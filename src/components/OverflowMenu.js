import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';

export default function OverflowMenu({ onDelete }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [open, setOpen] = useState(false);

  function confirmDelete() {
    setOpen(false);
    Alert.alert('Delete cat?', 'This permanently removes it from your collection.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="More options"
        style={styles.trigger}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Pressable
              onPress={confirmDelete}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
              <Text style={[styles.itemLabel, { color: colors.danger }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const makeStyles = ({ colors, shadow }) =>
  StyleSheet.create({
    trigger: { padding: 4 },
    backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      paddingBottom: spacing.xxl,
      paddingTop: spacing.sm,
      ...shadow,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    itemPressed: { backgroundColor: colors.surfaceMuted },
    itemLabel: { ...typography.metadata },
  });
