export const MIN_VOTE = 1;
export const MAX_VOTE = 10;

export function scoresFromVotes(votes = []) {
  const latest = new Map();
  for (const vote of votes) {
    const at = Date.parse(vote.created_at) || 0;
    const existing = latest.get(vote.image_id);
    if (!existing || at >= existing.at) {
      latest.set(vote.image_id, { value: Number(vote.value), at });
    }
  }

  const scores = new Map();
  for (const [imageId, { value }] of latest) {
    scores.set(imageId, value);
  }
  return scores;
}

export function nextVoteValue(score, direction) {
  return Math.max(MIN_VOTE, Math.min(MAX_VOTE, score + direction));
}

export const canVoteUp = (score) => score < MAX_VOTE;
export const canVoteDown = (score) => score > MIN_VOTE;
