import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import AppHeader from '../../src/components/AppHeader';
import CatImage from '../../src/components/CatImage';
import PrimaryButton from '../../src/components/PrimaryButton';
import ApiKeyBanner from '../../src/components/ApiKeyBanner';
import IconChip from '../../src/components/IconChip';
import { useUploadImage, useDeleteImage } from '../../src/hooks/useImages';
import { pickAsset, validateAsset } from '../../src/utils/imageAsset';
import { hasApiKey } from '../../constants/config';
import { radius, spacing, typography } from '../../src/theme';
import { useTheme, useThemedStyles } from '../../src/theme/ThemeContext';

const UPLOAD_ERROR = 'Unable to upload your image. Please try again.';

export default function UploadTab() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const upload = useUploadImage();
  const deleteImage = useDeleteImage();

  const [asset, setAsset] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setAsset(null);
    setUploaded(null);
    setError(null);
    upload.reset();
    deleteImage.reset();
  }, []);

  useFocusEffect(reset);

  const busy = upload.isPending || deleteImage.isPending;

  async function choose() {
    try {
      const picked = await pickAsset();
      if (picked) {
        setError(null);
        setAsset(picked);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  function handleUpload() {
    const validationError = validateAsset(asset);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    upload.mutate(asset, {
      onSuccess: (created) => {
        setUploaded(created);
        Toast.show({ type: 'success', text1: 'Cat uploaded!' });
        // Upload succeeded — send the user back to the home screen.
        router.replace('/');
      },
      onError: (e) => {
        setError(UPLOAD_ERROR);
        if (e?.message && !/network|failed|timeout/i.test(e.message)) {
          Toast.show({ type: 'error', text1: 'Upload failed', text2: e.message });
        }
      },
    });
  }

  function handleDelete() {
    Alert.alert('Delete cat?', 'This permanently removes it from your collection.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteImage.mutate(uploaded.id, {
            onSuccess: () => {
              reset();
              Toast.show({ type: 'success', text1: 'Cat deleted' });
            },
            onError: (e) => Toast.show({ type: 'error', text1: 'Couldn’t delete', text2: e.message }),
          }),
      },
    ]);
  }

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader subtitle="Add a Cat" />

      {!hasApiKey ? (
        <ApiKeyBanner />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Pressable
            onPress={() => !uploaded && !busy && choose()}
            disabled={busy}
            style={({ pressed }) => [
              styles.box,
              !uploaded && styles.boxDashed,
              pressed && !busy && !uploaded && styles.boxPressed,
            ]}
            accessibilityLabel={uploaded ? 'Uploaded cat' : 'Choose an image'}
          >
            {uploaded ? (
              <CatImage uri={uploaded.url} style={StyleSheet.absoluteFill} />
            ) : asset ? (
              <Image source={{ uri: asset.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <View style={styles.placeholder}>
                <View style={styles.cloud}>
                  <Ionicons name="cloud-upload-outline" size={34} color={colors.primary} />
                </View>
                <Text style={styles.placeholderTitle}>Tap to choose an image</Text>
                <Text style={styles.placeholderHint}>JPG, PNG up to 10MB</Text>
              </View>
            )}

            {busy && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.overlayText}>
                  {deleteImage.isPending ? 'Deleting…' : 'Uploading…'}
                </Text>
              </View>
            )}
          </Pressable>

          {uploaded ? (
            <>
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [styles.delete, pressed && styles.pressed]}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={styles.deleteText}>Delete cat</Text>
              </Pressable>
              <Pressable onPress={reset} style={styles.link}>
                <Ionicons name="add" size={18} color={colors.primary} />
                <Text style={styles.linkText}>Upload another cat</Text>
              </Pressable>
            </>
          ) : (
            <>
              {asset && (
                <Pressable onPress={choose} style={styles.link}>
                  <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
                  <Text style={styles.linkText}>Choose a different image</Text>
                </Pressable>
              )}

              <View style={styles.infoCard}>
                <IconChip icon="paw" tint={colors.primary} size={36} iconSize={18} />
                <Text style={styles.infoText}>
                  Make sure your cat is looking their purr-fect best! 🐱✨
                </Text>
              </View>

              {error && (
                <View style={styles.error}>
                  <Ionicons name="alert-circle" size={18} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <PrimaryButton
                label={error ? 'Try again' : 'Upload cat'}
                icon="paw"
                onPress={handleUpload}
                loading={upload.isPending}
                disabled={!asset}
              />
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const makeStyles = ({ colors, isDark }) =>
  StyleSheet.create({
    safe: { flex: 1 },
    container: { padding: spacing.xl, gap: spacing.lg },
    box: {
      aspectRatio: 1,
      borderRadius: radius.card,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    boxDashed: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary + '66',
      backgroundColor: colors.primary + '0D',
    },
    boxPressed: { opacity: 0.9 },
    placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    cloud: {
      width: 68,
      height: 68,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary + '1F',
      marginBottom: spacing.sm,
    },
    placeholderTitle: { ...typography.label, fontSize: 16, color: colors.text },
    placeholderHint: { ...typography.caption, color: colors.textMuted },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: 'rgba(10,10,20,0.55)',
    },
    overlayText: { color: '#FFFFFF', fontWeight: '600' },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    infoText: { flex: 1, ...typography.caption, color: colors.textMuted, lineHeight: 18 },
    delete: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.danger + '1A',
    },
    deleteText: { color: colors.danger, fontWeight: '600', fontSize: 16 },
    link: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center' },
    linkText: { color: colors.primary, fontWeight: '600' },
    error: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.danger + '1A',
      padding: spacing.md,
      borderRadius: radius.md,
    },
    errorText: { flex: 1, color: colors.danger },
  });
