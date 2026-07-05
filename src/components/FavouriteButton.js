import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { tapFeedback } from '../utils/haptics';

export default function FavouriteButton({ isFavourite, pending, onToggle, size = 22 }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  function handlePress() {
    tapFeedback();
    onToggle();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={pending}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isFavourite ? 'Unfavourite' : 'Favourite'}
      style={[styles.button, pending && styles.pending]}
    >
      <Ionicons
        name={isFavourite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavourite ? colors.heart : colors.text}
      />
    </Pressable>
  );
}

const makeStyles = ({ colors, isDark, shadowSoft }) =>
  StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.pill,
      backgroundColor: isDark ? 'rgba(26,29,39,0.85)' : 'rgba(255,255,255,0.92)',
      ...shadowSoft,
    },
    pending: { opacity: 0.6 },
  });
