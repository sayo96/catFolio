import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import AppHeader from '../../src/components/AppHeader';
import IconChip from '../../src/components/IconChip';
import { radius, spacing, typography } from '../../src/theme';
import { useTheme, useThemedStyles } from '../../src/theme/ThemeContext';

const SUPPORT_EMAIL = 'help@catpaws.co.uk';
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const { colors, isDark, toggle } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader subtitle="Settings" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <IconChip icon={isDark ? 'moon' : 'sunny'} tint={colors.primary} />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Text style={styles.rowSub}>Toggle dark mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggle}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <InfoRow icon="paw" label="App Name" value="Catfolio" chevron styles={styles} tint={colors.primary} />
          <Divider styles={styles} />
          <InfoRow icon="star" label="Version" value={APP_VERSION} styles={styles} tint={colors.primary} />
          <Divider styles={styles} />
          <InfoRow
            icon="mail"
            label="Support"
            value={SUPPORT_EMAIL}
            valueColor={colors.primary}
            chevron
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            styles={styles}
            tint={colors.primary}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerEmoji}>😻</Text>
          <View style={styles.footerText}>
            <Text style={styles.footerTitle}>Made with 🐾 and ❤️</Text>
            <Text style={styles.footerSub}>Thank you for using Catfolio!</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, valueColor, chevron, onPress, tint, styles }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <IconChip icon={icon} tint={tint} />
      <Text style={styles.rowLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={[styles.rowValue, valueColor && { color: valueColor }]} numberOfLines={1}>
          {value}
        </Text>
        {chevron ? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} /> : null}
      </View>
    </Pressable>
  );
}

function Divider({ styles }) {
  return <View style={styles.divider} />;
}

const makeStyles = ({ colors, isDark, shadowSoft }) =>
  StyleSheet.create({
    safe: { flex: 1 },
    container: { padding: spacing.xl, gap: spacing.sm },
    sectionTitle: {
      ...typography.caption,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginLeft: spacing.xs,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
      ...shadowSoft,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      minHeight: 62,
    },
    rowPressed: { backgroundColor: colors.surfaceMuted },
    rowText: { flex: 1 },
    rowLabel: { ...typography.metadata, color: colors.text, flex: 1 },
    rowSub: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    rowValue: { ...typography.metadata, color: colors.textMuted },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 68 },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.primary + (isDark ? '22' : '14'),
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginTop: spacing.lg,
    },
    footerEmoji: { fontSize: 40 },
    footerText: { flex: 1 },
    footerTitle: { ...typography.label, fontSize: 15, color: colors.text },
    footerSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  });
