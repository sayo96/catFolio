import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../theme';

export default function IconChip({ icon, tint, size = 40, iconSize = 20 }) {
  return (
    <View style={[styles.chip, { width: size, height: size, backgroundColor: tint + '22' }]}>
      <Ionicons name={icon} size={iconSize} color={tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
