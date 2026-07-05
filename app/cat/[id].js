import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import CatImage from '../../src/components/CatImage';
import ImageViewer from '../../src/components/ImageViewer';
import FavouriteButton from '../../src/components/FavouriteButton';
import VoteControls from '../../src/components/VoteControls';
import StatPill from '../../src/components/StatPill';
import { useImages, useDeleteImage } from '../../src/hooks/useImages';
import { useFavourites, useToggleFavourite } from '../../src/hooks/useFavourites';
import { useVotes, useCastVote } from '../../src/hooks/useVotes';
import { canVoteDown, canVoteUp, nextVoteValue } from '../../src/utils/score';
import { radius, spacing } from '../../src/theme';
import { useTheme, useThemedStyles } from '../../src/theme/ThemeContext';

export default function CatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const images = useImages();
  const favourites = useFavourites();
  const votes = useVotes();
  const toggleFavourite = useToggleFavourite();
  const castVote = useCastVote();
  const deleteImage = useDeleteImage();

  const [viewerOpen, setViewerOpen] = useState(false);

  const image = useMemo(
    () => (images.data ?? []).find((item) => item.id === id),
    [images.data, id],
  );

  useEffect(() => {
    if (!images.isLoading && !image) router.replace('/');
  }, [images.isLoading, image, router]);

  if (!image) return null;

  const isFavourite = favourites.byImage.has(id);
  const score = votes.scores.get(id) ?? 0;
  const votePendingDirection =
    castVote.isPending && castVote.variables?.imageId === id ? castVote.variables.direction : 0;

  function handleVote(direction) {
    if (direction > 0 && !canVoteUp(score)) return;
    if (direction < 0 && !canVoteDown(score)) return;
    castVote.mutate(
      { imageId: id, value: nextVoteValue(score, direction), direction },
      { onError: (e) => Toast.show({ type: 'error', text1: 'Couldn’t record vote', text2: e.message }) },
    );
  }

  function handleDelete() {
    Alert.alert('Delete cat?', 'This permanently removes it from your collection.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (router.canGoBack()) router.back();
          else router.replace('/');
          deleteImage.mutate(id, {
            onSuccess: () => Toast.show({ type: 'success', text1: 'Cat deleted' }),
            onError: (e) => Toast.show({ type: 'error', text1: 'Couldn’t delete', text2: e.message }),
          });
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => setViewerOpen(true)} style={styles.imageCard}>
        <CatImage uri={image.url} style={styles.image} accessibilityLabel="Uploaded cat" />
        <View style={styles.heart}>
          <FavouriteButton
            isFavourite={isFavourite}
            pending={toggleFavourite.isPending}
            onToggle={() =>
              toggleFavourite.mutate({
                imageId: id,
                favouriteId: favourites.byImage.get(id) ?? null,
              })
            }
          />
        </View>
        <View style={styles.zoomHint}>
          <Ionicons name="expand" size={16} color="#FFFFFF" />
        </View>
      </Pressable>

      <View style={styles.pills}>
        <StatPill icon="star" iconColor={colors.star} label="Score" value={score} />
      </View>

      <VoteControls score={score} pendingDirection={votePendingDirection} onVote={handleVote} />

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [styles.delete, pressed && styles.pressed]}
      >
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text style={styles.deleteText}>Delete cat</Text>
      </Pressable>

      <ImageViewer uri={image.url} visible={viewerOpen} onClose={() => setViewerOpen(false)} />
    </ScrollView>
  );
}

const makeStyles = ({ colors, shadow }) =>
  StyleSheet.create({
    container: { padding: spacing.xl, gap: spacing.lg },
    imageCard: {
      borderRadius: radius.card,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      ...shadow,
    },
    image: { width: '100%', aspectRatio: 4 / 5 },
    heart: { position: 'absolute', top: spacing.md, right: spacing.md },
    zoomHint: {
      position: 'absolute',
      bottom: spacing.md,
      right: spacing.md,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    delete: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.danger + '1A',
      marginTop: spacing.sm,
    },
    deleteText: { color: colors.danger, fontWeight: '600', fontSize: 16 },
    pressed: { opacity: 0.7 },
  });
