import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export default function Skeleton({ style }) {
  const { colors } = useTheme();
  const progress = useSharedValue(0.5);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: colors.surfaceMuted, borderRadius: radius.sm }, style, animatedStyle]}
    />
  );
}
