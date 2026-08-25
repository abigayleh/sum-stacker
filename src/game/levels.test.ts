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

  it('keeps hard levels a rare milestone - every 10th from 20', () => {
    const hardIds = LEVELS.filter((l) => l.difficulty === 'hard').map((l) => l.id);
    expect(hardIds).toEqual([20, 30, 40, 50, 60, 70, 80, 90]);
  });

  it('follows every hard level with an easy breather', () => {
    LEVELS.filter((l) => l.difficulty === 'hard').forEach((level) => {
      expect(LEVELS.find((l) => l.id === level.id + 1)?.difficulty).toBe('easy');
    });
  });

  it('keeps every value within +/-12 so the arithmetic stays instant', () => {
    LEVELS.forEach((level) => {
      level.blocks.forEach((b) => {
        expect(Math.abs(b.value)).toBeGreaterThan(0);
        expect(Math.abs(b.value)).toBeLessThanOrEqual(12);
      });
    });
  });

  it('holds values to single digits until the late game', () => {
    const ceiling = (id: number) => (id <= 30 ? 7 : id <= 65 ? 9 : 12);
    LEVELS.forEach((level) => {
      level.blocks.forEach((b) => expect(Math.abs(b.value)).toBeLessThanOrEqual(ceiling(level.id)));
    });
  });

  it('introduces negative blocks only after level 7', () => {
    LEVELS.filter((l) => l.id < 8).forEach((level) => {
      level.blocks.forEach((b) => expect(b.value).toBeGreaterThan(0));
    });
  });

  it('keeps the number of blocks to drag low enough to stay in flow', () => {
    LEVELS.forEach((level) => {
      const drags = level.blocks.filter((b) => !b.isHint).length;
      expect(drags).toBeGreaterThanOrEqual(3);
      expect(drags).toBeLessThanOrEqual(11);
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

  it('opens with a fully seeded tutorial so the mechanic is obvious', () => {
    [1, 2].forEach((id) => {
      const level = LEVELS.find((l) => l.id === id)!;
      expect(level.blocks.filter((b) => b.isHint)).toHaveLength(3);
    });
  });

  it('seeds every hard level with at least one pre-placed block', () => {
    LEVELS.filter((l) => l.difficulty === 'hard').forEach((level) => {
      expect(level.blocks.filter((b) => b.isHint).length).toBeGreaterThan(0);
    });
  });

  it('varies the seed pattern instead of pre-filling every level the same way', () => {
    const seedCounts = LEVELS.map((l) => l.blocks.filter((b) => b.isHint).length);
    expect(new Set(seedCounts).size).toBeGreaterThan(2);
    expect(seedCounts.filter((c) => c === 0).length).toBeGreaterThan(10);
  });

  it('never pre-fills a whole pile - every pile keeps a block to place', () => {
    LEVELS.forEach((level) => {
      const perPile = new Array(level.pileCount).fill(0);
      level.blocks.forEach((b) => {
        if (b.isHint && b.startLocation.type === 'pile') perPile[b.startLocation.pileIndex] += 1;
      });
      const blocksPerPile = level.blocks.length / level.pileCount;
      perPile.forEach((seeds) => expect(seeds).toBeLessThan(blocksPerPile));
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
