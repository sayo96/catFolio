import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';

export default function StatPill({ icon, iconColor, label, value }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={14} color={iconColor || colors.textMuted} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {value != null ? <Text style={styles.value}>{value}</Text> : null}
    </View>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.surfaceMuted,
      paddingVertical: 6,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
    },
    label: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
    value: { fontSize: 13, fontWeight: '700', color: colors.text },
  });
