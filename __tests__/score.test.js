import { scoresFromVotes } from '../src/utils/score';

describe('scoresFromVotes', () => {
  it('returns an empty map for no votes', () => {
    expect(scoresFromVotes([]).size).toBe(0);
    expect(scoresFromVotes().size).toBe(0);
  });

  it('uses the value of the latest vote per image', () => {
    const votes = [
      { image_id: 'a', value: 1, created_at: '2026-07-04T10:00:00.000Z' },
      { image_id: 'a', value: 5, created_at: '2026-07-04T12:00:00.000Z' },
      { image_id: 'a', value: 3, created_at: '2026-07-04T11:00:00.000Z' },
      { image_id: 'b', value: 7, created_at: '2026-07-04T09:00:00.000Z' },
    ];

    const scores = scoresFromVotes(votes);

    expect(scores.get('a')).toBe(5);
    expect(scores.get('b')).toBe(7);
  });

  it('coerces string values coming back from the API', () => {
    const scores = scoresFromVotes([
      { image_id: 'a', value: '4', created_at: '2026-07-04T10:00:00.000Z' },
    ]);

    expect(scores.get('a')).toBe(4);
  });
});
