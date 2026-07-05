import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import PrimaryButton from './PrimaryButton';

export default function ErrorState({ message, onRetry }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={52} color={colors.textMuted} />
      <Text style={styles.title}>Couldn’t load your cats</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? (
        <View style={styles.action}>
          <PrimaryButton label="Try again" icon="refresh" onPress={onRetry} />
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
    title: { ...typography.title, color: colors.text, textAlign: 'center', marginTop: spacing.sm },
    message: { ...typography.subtitle, color: colors.textMuted, textAlign: 'center', maxWidth: 280 },
    action: { marginTop: spacing.lg },
  });
