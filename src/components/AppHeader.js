import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, typography } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';

export default function AppHeader({ subtitle, badge }) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.titleRow}>
        <Text style={styles.logo}>🐱</Text>
        <Text style={styles.title}>Catfolio</Text>
        <Text style={styles.sparkle}>✨</Text>
      </View>

      {(subtitle || badge) && (
        <View style={styles.subtitleRow}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.md,
      backgroundColor: colors.background,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    logo: { fontSize: 24 },
    title: { ...typography.heading, color: colors.primary },
    sparkle: { fontSize: 18, marginLeft: -2 },
    subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 3 },
    subtitle: { ...typography.subtitle, color: colors.textMuted },
    badge: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: spacing.md,
      paddingVertical: 3,
      borderRadius: radius.pill,
    },
    badgeText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  });
