import { useCallback, useMemo, useRef } from 'react';
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import CatCard from './CatCard';
import SkeletonGrid from './SkeletonGrid';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import StatsCard from './StatsCard';
import { useImages, useDeleteImage } from '../hooks/useImages';
import { useFavourites, useToggleFavourite } from '../hooks/useFavourites';
import { useVotes, useCastVote } from '../hooks/useVotes';
import { columnsForWidth } from '../utils/columns';
import { canVoteDown, canVoteUp, nextVoteValue } from '../utils/score';
import { spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export default function CatGrid({ variant = 'all' }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const numColumns = columnsForWidth(width);

  const itemWidth = (width - spacing.xl * 2 - spacing.xl * (numColumns - 1)) / numColumns;

  const images = useImages();
  const favourites = useFavourites();
  const votes = useVotes();
  const toggleFavourite = useToggleFavourite();
  const castVote = useCastVote();
  const deleteImage = useDeleteImage();

  const scoresRef = useRef(votes.scores);
  scoresRef.current = votes.scores;
  const favByImageRef = useRef(favourites.byImage);
  favByImageRef.current = favourites.byImage;

  const data = useMemo(() => {
    const all = images.data ?? [];
    if (variant === 'favourites') {
      return all.filter((image) => favourites.byImage.has(image.id));
    }
    return all;
  }, [images.data, favourites.byImage, variant]);

  const favouriteCount = useMemo(
    () => (images.data ?? []).filter((image) => favourites.byImage.has(image.id)).length,
    [images.data, favourites.byImage],
  );

  const listHeader = useMemo(
    () =>
      variant === 'all' ? (
        <StatsCard cats={images.data?.length ?? 0} favourites={favouriteCount} />
      ) : null,
    [variant, images.data?.length, favouriteCount],
  );

  const onRefresh = useCallback(() => {
    images.refetch();
    favourites.refetch();
    votes.refetch();
  }, [images, favourites, votes]);

  const handleToggleFavourite = useCallback((imageId) => {
    toggleFavourite.mutate(
      { imageId, favouriteId: favByImageRef.current.get(imageId) ?? null },
      { onError: (e) => Toast.show({ type: 'error', text1: 'Couldn’t update favourite', text2: e.message }) },
    );
  }, []);

  const handleVote = useCallback((imageId, direction) => {
    const score = scoresRef.current.get(imageId) ?? 0;
    if (direction > 0 && !canVoteUp(score)) return;
    if (direction < 0 && !canVoteDown(score)) return;
    castVote.mutate(
      { imageId, value: nextVoteValue(score, direction), direction },
      { onError: (e) => Toast.show({ type: 'error', text1: 'Couldn’t record vote', text2: e.message }) },
    );
  }, []);

  const handleDelete = useCallback((imageId) => {
    deleteImage.mutate(imageId, {
      onSuccess: () => Toast.show({ type: 'success', text1: 'Cat deleted' }),
      onError: (e) => Toast.show({ type: 'error', text1: 'Couldn’t delete', text2: e.message }),
    });
  }, []);

  const handlePress = useCallback((imageId) => router.push(`/cat/${imageId}`), [router]);

  const votePending = castVote.isPending ? castVote.variables : null;
  const favPending = toggleFavourite.isPending ? toggleFavourite.variables : null;

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ width: itemWidth }}>
        <CatCard
          image={item}
          isFavourite={favourites.byImage.has(item.id)}
          favouritePending={favPending?.imageId === item.id}
          score={votes.scores.get(item.id) ?? 0}
          votePendingDirection={votePending?.imageId === item.id ? votePending.direction : 0}
          onToggleFavourite={handleToggleFavourite}
          onVote={handleVote}
          onDelete={handleDelete}
          onPress={handlePress}
        />
      </View>
    ),
    [itemWidth, favourites.byImage, votes.scores, votePending, favPending, handleToggleFavourite, handleVote, handleDelete, handlePress],
  );

  if (images.isLoading) {
    return <SkeletonGrid numColumns={numColumns} />;
  }

  if (images.error) {
    return <ErrorState message={images.error.message} onRetry={images.refetch} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={variant === 'favourites' ? 'No favourites yet' : 'No cats yet'}
        message={
          variant === 'favourites'
            ? 'Tap the heart on any cat to save it here.'
            : 'Head to the Upload tab to add your first cat.'
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={`cols-${numColumns}`}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        refreshControl={
          <RefreshControl
            refreshing={images.isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.xl, gap: spacing.xl, paddingBottom: 32 },
  row: { gap: spacing.xl },
});
