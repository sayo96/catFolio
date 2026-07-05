import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius, spacing } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import CatImage from './CatImage';
import FavouriteButton from './FavouriteButton';
import VoteControls from './VoteControls';
import StatPill from './StatPill';
import OverflowMenu from './OverflowMenu';

function CatCard({
  image,
  isFavourite,
  favouritePending,
  score,
  votePendingDirection,
  onToggleFavourite,
  onVote,
  onDelete,
  onPress,
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => onPress(image.id)} accessibilityRole="imagebutton" accessibilityLabel="Open cat">
        <View style={styles.imageWrap}>
          <CatImage uri={image.url} style={styles.image} accessibilityLabel="Uploaded cat" />
          <View style={styles.heart}>
            <FavouriteButton
              isFavourite={isFavourite}
              pending={favouritePending}
              onToggle={() => onToggleFavourite(image.id)}
            />
          </View>
        </View>
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <StatPill icon="star" iconColor={colors.star} label="Score" value={score} />
          <OverflowMenu onDelete={() => onDelete(image.id)} />
        </View>

        <VoteControls
          score={score}
          pendingDirection={votePendingDirection}
          onVote={(direction) => onVote(image.id, direction)}
        />
      </View>
    </View>
  );
}

const makeStyles = ({ colors, isDark, shadow }) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      overflow: 'hidden',
      borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
      ...shadow,
    },
    imageWrap: { width: '100%', aspectRatio: 1 },
    image: { width: '100%', height: '100%' },
    heart: { position: 'absolute', top: spacing.sm, right: spacing.sm },
    footer: { padding: spacing.md, gap: spacing.sm },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  });

export default memo(CatCard);
