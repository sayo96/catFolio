import { canVoteDown, canVoteUp, nextVoteValue, MAX_VOTE, MIN_VOTE } from '../src/utils/score';

describe('vote bounds', () => {
  it('computes the next absolute vote value, clamped to 1–10', () => {
    expect(nextVoteValue(0, 1)).toBe(1); 
    expect(nextVoteValue(1, 1)).toBe(2);
    expect(nextVoteValue(10, 1)).toBe(MAX_VOTE);
    expect(nextVoteValue(5, -1)).toBe(4);
    expect(nextVoteValue(1, -1)).toBe(MIN_VOTE); 
  });

  it('disables up-voting at the maximum', () => {
    expect(canVoteUp(9)).toBe(true);
    expect(canVoteUp(10)).toBe(false);
  });

  it('disables down-voting at or below the minimum', () => {
    expect(canVoteDown(2)).toBe(true);
    expect(canVoteDown(1)).toBe(false);
    expect(canVoteDown(0)).toBe(false); 
  });
});
