import { LevelDef } from './types';

type PileBlueprint = { value: number; isHint?: boolean }[];

/**
 * Builds a level from per-pile blueprints and throws at import time if any
 * pile's authored values don't sum to the same target — catches typos early.
 * Footer (non-hint) blocks are interleaved round-robin across piles so their
 * order in the footer doesn't visually reveal which pile they belong to.
 */
function buildLevel(id: number, showSum: boolean, piles: PileBlueprint[]): LevelDef {
  const targetSum = piles[0].reduce((sum, b) => sum + b.value, 0);
  const hintBlocks: LevelDef['blocks'] = [];
  const footerByPile: LevelDef['blocks'][] = piles.map(() => []);

  piles.forEach((pile, pileIndex) => {
    const pileSum = pile.reduce((sum, b) => sum + b.value, 0);
    if (pileSum !== targetSum) {
      throw new Error(`Level ${id} pile ${pileIndex} sums to ${pileSum}, expected ${targetSum}`);
    }
    pile.forEach((b) => {
      if (b.isHint) {
        hintBlocks.push({ value: b.value, isHint: true, startLocation: { type: 'pile', pileIndex } });
      } else {
        footerByPile[pileIndex].push({ value: b.value, isHint: false, startLocation: { type: 'footer' } });
      }
    });
  });

  const footerBlocks: LevelDef['blocks'] = [];
  const maxLen = Math.max(...footerByPile.map((p) => p.length));
  for (let i = 0; i < maxLen; i++) {
    footerByPile.forEach((pileBlocks) => {
      if (pileBlocks[i]) footerBlocks.push(pileBlocks[i]);
    });
  }

  return { id, pileCount: piles.length, targetSum, showSum, blocks: [...hintBlocks, ...footerBlocks] };
}

export const LEVELS: LevelDef[] = [
  buildLevel(1, true, [
    [{ value: 2, isHint: true }, { value: 3 }],
    [{ value: 0, isHint: true }, { value: 5 }],
    [{ value: -1, isHint: true }, { value: 6 }],
  ]),
  buildLevel(2, true, [
    [{ value: 3, isHint: true }, { value: 5 }],
    [{ value: -2, isHint: true }, { value: 10 }],
    [{ value: 6 }, { value: 2 }],
  ]),
  buildLevel(3, true, [
    [{ value: 4, isHint: true }, { value: 6 }],
    [{ value: 15 }, { value: -5 }],
    [{ value: 7 }, { value: 3 }],
  ]),
  buildLevel(4, true, [
    [{ value: 8 }, { value: 4 }],
    [{ value: 20 }, { value: -8 }],
    [{ value: 15 }, { value: -3 }],
  ]),
  buildLevel(5, true, [
    [{ value: 5 }, { value: -10 }, { value: 2 }],
    [{ value: -1 }, { value: -8 }, { value: 6 }],
    [{ value: 10 }, { value: -9 }, { value: -4 }],
  ]),
  buildLevel(6, false, [
    [{ value: 10 }, { value: -5 }, { value: 2 }],
    [{ value: -3 }, { value: 4 }, { value: 6 }],
    [{ value: 15 }, { value: -20 }, { value: 12 }],
  ]),
  buildLevel(7, false, [
    [{ value: -10 }, { value: 5 }, { value: -1 }],
    [{ value: 8 }, { value: -20 }, { value: 6 }],
    [{ value: -15 }, { value: 4 }, { value: 5 }],
  ]),
  buildLevel(8, false, [
    [{ value: 10 }, { value: -5 }, { value: 8 }, { value: 2 }],
    [{ value: 20 }, { value: -10 }, { value: 5 }],
    [{ value: -8 }, { value: 13 }, { value: 6 }, { value: 4 }],
  ]),
  buildLevel(9, false, [
    [{ value: -20 }, { value: 5 }, { value: -3 }, { value: 6 }],
    [{ value: 10 }, { value: -25 }, { value: 8 }, { value: -5 }],
    [{ value: -15 }, { value: -2 }, { value: 9 }, { value: -4 }],
  ]),
  buildLevel(10, false, [
    [{ value: 30 }, { value: -15 }, { value: 10 }, { value: -5 }],
    [{ value: -10 }, { value: 25 }, { value: 8 }, { value: -3 }],
    [{ value: 40 }, { value: -30 }, { value: 15 }, { value: -5 }],
  ]),
];
