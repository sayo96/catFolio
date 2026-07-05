import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import AppHeader from '../../src/components/AppHeader';
import CatGrid from '../../src/components/CatGrid';
import ApiKeyBanner from '../../src/components/ApiKeyBanner';
import { useImages } from '../../src/hooks/useImages';
import { useFavourites } from '../../src/hooks/useFavourites';
import { hasApiKey } from '../../constants/config';
import { useTheme } from '../../src/theme/ThemeContext';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const images = useImages();
  const favourites = useFavourites();

  const count = useMemo(
    () => (images.data ?? []).filter((image) => favourites.byImage.has(image.id)).length,
    [images.data, favourites.byImage],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader
        subtitle="Your Favourites"
        badge={hasApiKey ? `${count} ${count === 1 ? 'cat' : 'cats'}` : undefined}
      />
      {hasApiKey ? <CatGrid variant="favourites" /> : <ApiKeyBanner />}
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
