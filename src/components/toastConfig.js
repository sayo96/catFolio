import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';

const VARIANTS = {
  success: { icon: 'checkmark-circle', tone: 'success' },
  error: { icon: 'alert-circle', tone: 'danger' },
  info: { icon: 'information-circle', tone: 'info' },
};

function ThemedToast({ variant, text1, text2 }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { icon, tone } = VARIANTS[variant];
  const accent = colors[tone];

  return (
    <View style={styles.toast}>
      <View style={[styles.iconChip, { backgroundColor: accent + '1F' }]}>
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <View style={styles.body}>
        {text1 ? <Text style={styles.title} numberOfLines={1}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message} numberOfLines={2}>{text2}</Text> : null}
      </View>
    </View>
  );
}

export const toastConfig = {
  success: (props) => <ThemedToast variant="success" {...props} />,
  error: (props) => <ThemedToast variant="error" {...props} />,
  info: (props) => <ThemedToast variant="info" {...props} />,
};

const makeStyles = ({ colors, shadow }) =>
  StyleSheet.create({
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      width: '92%',
      alignSelf: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadow,
    },
    iconChip: {
      width: 38,
      height: 38,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { flex: 1 },
    title: { ...typography.label, color: colors.text },
    message: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  });
