import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import IconChip from './IconChip';

export default function StatsCard({ cats, favourites }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.card}>
      <Stat
        icon="paw"
        tint={colors.primary}
        value={`${cats} ${cats === 1 ? 'Cat' : 'Cats'}`}
        caption="In your gallery"
        styles={styles}
      />
      <View style={styles.divider} />
      <Stat
        icon="heart"
        tint={colors.heart}
        value={`${favourites} Favorites`}
        caption="Your loved ones"
        styles={styles}
      />
    </View>
  );
}

function Stat({ icon, tint, value, caption, styles }) {
  return (
    <View style={styles.stat}>
      <IconChip icon={icon} tint={tint} size={38} iconSize={18} />
      <View style={styles.statText}>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {value}
        </Text>
        <Text style={styles.caption} numberOfLines={1}>{caption}</Text>
      </View>
    </View>
  );
}

const makeStyles = ({ colors, shadowSoft }) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadowSoft,
    },
    stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    statText: { flex: 1 },
    value: { ...typography.title, fontSize: 16, color: colors.text },
    caption: { ...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 1 },
    divider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: colors.border, marginHorizontal: spacing.sm },
  });
