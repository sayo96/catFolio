import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';

export default function PrimaryButton({ label, onPress, loading = false, disabled = false, icon }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, isDisabled && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={colors.onPrimary} />}
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.md,
    },
    pressed: { backgroundColor: colors.primaryDark },
    disabled: { opacity: 0.5 },
    label: { color: colors.onPrimary, fontSize: 16, fontWeight: '600' },
  });
