import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Skeleton from './Skeleton';
import { radius, spacing } from '../theme';
import { useThemedStyles } from '../theme/ThemeContext';

export default function SkeletonGrid({ numColumns }) {
  const { width } = useWindowDimensions();
  const styles = useThemedStyles(makeStyles);
  const itemWidth = (width - spacing.xl * 2 - spacing.xl * (numColumns - 1)) / numColumns;
  const placeholders = Array.from({ length: numColumns * 3 });

  return (
    <View style={styles.grid}>
      {placeholders.map((_, i) => (
        <View key={i} style={[styles.card, { width: itemWidth }]}>
          <Skeleton style={styles.image} />
          <View style={styles.footer}>
            <Skeleton style={styles.line} />
            <Skeleton style={styles.votes} />
          </View>
        </View>
      ))}
    </View>
  );
}

const makeStyles = ({ colors, shadow }) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl, padding: spacing.xl },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      overflow: 'hidden',
      ...shadow,
    },
    image: { width: '100%', aspectRatio: 1, borderRadius: 0 },
    footer: { padding: spacing.md, gap: spacing.sm },
    line: { height: 24, width: 100, borderRadius: radius.pill },
    votes: { height: 44, width: '100%', borderRadius: radius.pill },
  });
