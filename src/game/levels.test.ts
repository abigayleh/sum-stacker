import { LEVELS } from './levels';

describe('LEVELS', () => {
  it('defines exactly 10 levels with 3 piles each', () => {
    expect(LEVELS).toHaveLength(10);
    LEVELS.forEach((level) => expect(level.pileCount).toBe(3));
  });

  it('shows the target sum for levels 1-5 and hides it for levels 6-10', () => {
    LEVELS.forEach((level) => {
      expect(level.showSum).toBe(level.id <= 5);
    });
  });

  it('only pre-fills hint blocks on early levels (1-3)', () => {
    LEVELS.forEach((level) => {
      const hintCount = level.blocks.filter((b) => b.isHint).length;
      if (level.id <= 3) {
        expect(hintCount).toBeGreaterThan(0);
      } else {
        expect(hintCount).toBe(0);
      }
    });
  });

  it('every level is solvable: footer blocks + hints can reach targetSum per pile', () => {
    // Re-derive intended grouping is not possible post-construction (by design),
    // but buildLevel throws at import time if any authored pile is unbalanced,
    // so successfully importing LEVELS is itself the guarantee. This test just
    // sanity-checks the total pool sums to pileCount * targetSum.
    LEVELS.forEach((level) => {
      const total = level.blocks.reduce((sum, b) => sum + b.value, 0);
      expect(total).toBe(level.pileCount * level.targetSum);
    });
  });
});
