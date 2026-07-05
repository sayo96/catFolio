import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Skeleton from './Skeleton';
import { useTheme } from '../theme/ThemeContext';

export default function CatImage({ uri, style, contentFit = 'cover', accessibilityLabel }) {
  const { colors } = useTheme();
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceMuted }, style]}>
      {!loaded && <Skeleton style={StyleSheet.absoluteFill} />}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        transition={250}
        onLoad={() => setLoaded(true)}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
});
