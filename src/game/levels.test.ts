import { LEVELS } from './levels';
import { LevelDef } from './types';

const BLOCKS_PER_PILE = { easy: 2, medium: 3, hard: 4 } as const;

/**
 * Returns true if the footer blocks can be distributed across the piles so every
 * pile equals targetSum, with hint blocks kept in the pile they start pinned to.
 * This is the actual win condition, so it's the real solvability guarantee —
 * stronger than "the pool sums to pileCount * targetSum".
 */
function isSolvable(level: LevelDef): boolean {
  const pileTotals = new Array(level.pileCount).fill(0);
  level.blocks.forEach((b) => {
    if (b.isHint && b.startLocation.type === 'pile') pileTotals[b.startLocation.pileIndex] += b.value;
  });
  const footer = level.blocks.filter((b) => !b.isHint).map((b) => b.value);

  const place = (i: number): boolean => {
    if (i === footer.length) return pileTotals.every((sum) => sum === level.targetSum);
    for (let p = 0; p < level.pileCount; p++) {
      pileTotals[p] += footer[i];
      if (place(i + 1)) return true;
      pileTotals[p] -= footer[i];
    }
    return false;
  };
  return place(0);
}

describe('LEVELS', () => {
  it('defines exactly 100 levels with 3 piles each', () => {
    expect(LEVELS).toHaveLength(100);
    LEVELS.forEach((level) => expect(level.pileCount).toBe(3));
  });

  it('tags every level with a known difficulty', () => {
    LEVELS.forEach((level) => {
      expect(['easy', 'medium', 'hard']).toContain(level.difficulty);
    });
  });

  it('places a hard spike every 6th level starting at 7 (7, 13, ... 97)', () => {
    const expected = LEVELS.map((l) => l.id).filter((id) => id >= 7 && (id - 7) % 6 === 0);
    const hardIds = LEVELS.filter((l) => l.difficulty === 'hard').map((l) => l.id);
    expect(hardIds).toEqual(expected);
  });

  it('never uses a 3-digit number (values stay 2-digit for playability)', () => {
    LEVELS.forEach((level) => {
      level.blocks.forEach((b) => expect(Math.abs(b.value)).toBeLessThan(100));
    });
  });

  it('hides the target sum only on hard levels', () => {
    LEVELS.forEach((level) => {
      expect(level.showSum).toBe(level.difficulty !== 'hard');
    });
  });

  it('scales block count per pile with difficulty (easy 2, medium 3, hard 4)', () => {
    LEVELS.forEach((level) => {
      expect(level.blocks).toHaveLength(BLOCKS_PER_PILE[level.difficulty] * level.pileCount);
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

});

// One test per level so a broken level names itself. Run every release to
// guarantee no level ships in an unsolvable state.
describe('every level is solvable', () => {
  it.each(LEVELS.map((level) => [level.id, level.difficulty, level] as const))(
    'level %i (%s) has a valid solution',
    (_id, _difficulty, level) => {
      expect(isSolvable(level)).toBe(true);
    }
  );
});
