import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../theme';
import { useThemedStyles } from '../theme/ThemeContext';

export default function ApiKeyBanner() {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.banner}>
      <Ionicons name="key-outline" size={20} color="#1A1A2E" />
      <View style={styles.body}>
        <Text style={styles.title}>Add your API key</Text>
        <Text style={styles.message}>
          Copy .env.example to .env, paste a free key from thecatapi.com, then restart the app.
        </Text>
      </View>
    </View>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      gap: spacing.md,
      backgroundColor: colors.warning,
      margin: spacing.lg,
      padding: spacing.lg,
      borderRadius: radius.md,
    },
    body: { flex: 1, gap: spacing.xs },
    title: { ...typography.label, color: '#1A1A2E' },
    message: { ...typography.caption, color: '#1A1A2E', lineHeight: 18 },
  });
