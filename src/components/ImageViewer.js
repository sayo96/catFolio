import { Modal, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function ImageViewer({ uri, visible, onClose }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  function reset() {
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedX.value = 0;
    savedY.value = 0;
  }

  function close() {
    reset();
    onClose();
  }

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    })
    .onEnd((e) => {
      if (scale.value <= 1 && e.translationY > 120) {
        runOnJS(close)();
        return;
      }
      if (scale.value <= 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const next = scale.value > 1 ? 1 : 2;
      scale.value = withTiming(next);
      savedScale.value = next;
      if (next === 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(Math.abs(translateY.value) / 400, 0.6),
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Animated.View style={[styles.backdrop, backdropStyle]} />
      <Pressable style={styles.closeButton} onPress={close} accessibilityLabel="Close">
        <Ionicons name="close" size={28} color="#FFFFFF" />
      </Pressable>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.container}>
          <Animated.View style={[styles.imageWrap, imageStyle]}>
            <Image source={{ uri }} style={styles.image} contentFit="contain" />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageWrap: { width: '100%', height: '100%' },
  image: { width: '100%', height: '100%' },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
