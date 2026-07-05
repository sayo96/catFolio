import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../theme';
import { useThemedStyles } from '../theme/ThemeContext';
import PrimaryButton from './PrimaryButton';

export default function EmptyState({
  emoji = '🐱',
  title,
  message,
  actionLabel,
  actionIcon,
  onAction,
}) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton label={actionLabel} icon={actionIcon} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.sm,
    },
    emoji: { fontSize: 64, marginBottom: spacing.sm },
    title: { ...typography.title, color: colors.text, textAlign: 'center' },
    message: { ...typography.subtitle, color: colors.textMuted, textAlign: 'center', maxWidth: 260, lineHeight: 20 },
    action: { marginTop: spacing.lg },
  });
