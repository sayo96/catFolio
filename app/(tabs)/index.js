import { StyleSheet, View } from 'react-native';

import AppHeader from '../../src/components/AppHeader';
import CatGrid from '../../src/components/CatGrid';
import ApiKeyBanner from '../../src/components/ApiKeyBanner';
import { hasApiKey } from '../../constants/config';
import { useTheme } from '../../src/theme/ThemeContext';

export default function GalleryScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader subtitle="Your personal cat gallery 💜" />
      {hasApiKey ? <CatGrid variant="all" /> : <ApiKeyBanner />}
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
