import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing } from '../theme';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { VOTE_DOWN, VOTE_UP } from '../api/votes';
import { canVoteDown, canVoteUp } from '../utils/score';
import { tapFeedback } from '../utils/haptics';

export default function VoteControls({ score, pendingDirection = 0, onVote }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.row}>
      <VoteButton
        icon="arrow-up"
        color={colors.success}
        label="Vote up"
        styles={styles}
        disabled={!canVoteUp(score) || pendingDirection === VOTE_UP}
        loading={pendingDirection === VOTE_UP}
        onPress={() => onVote(VOTE_UP)}
      />
      <VoteButton
        icon="arrow-down"
        color={colors.danger}
        label="Vote down"
        styles={styles}
        disabled={!canVoteDown(score) || pendingDirection === VOTE_DOWN}
        loading={pendingDirection === VOTE_DOWN}
        onPress={() => onVote(VOTE_DOWN)}
      />
    </View>
  );
}

function VoteButton({ icon, color, label, styles, disabled, loading, onPress }) {
  function handlePress() {
    tapFeedback();
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed, hovered }) => [
        styles.button,
        { backgroundColor: color + '14', borderColor: color + '4D' },
        (pressed || hovered) && { backgroundColor: color + '2A' },
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name={icon} size={20} color={color} />
      )}
    </Pressable>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.md },
    button: {
      flex: 1,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: radius.pill,
    },
    disabled: { opacity: 0.4 },
  });
