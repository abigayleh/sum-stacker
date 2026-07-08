import { createInitialState, reducer } from './useGameState';
import { LEVELS } from './levels';

const level1 = LEVELS[0]; // has a hint block pre-placed in each of its 3 piles

describe('useGameState reducer', () => {
  it('places hint blocks on their pile and everything else in the footer', () => {
    const state = createInitialState(level1);
    const values = Object.values(state.blocks);
    const hints = values.filter((b) => b.isHint);
    const footer = values.filter((b) => b.location.type === 'footer');

    expect(hints).toHaveLength(3);
    hints.forEach((b) => expect(b.location.type).toBe('pile'));
    expect(footer).toHaveLength(3);
    expect(state.moveCount).toBe(0);
  });

  it('moves a footer block onto a pile and increments moveCount', () => {
    const state = createInitialState(level1);
    const [footerId] = Object.entries(state.blocks).find(([, b]) => b.location.type === 'footer')!;

    const next = reducer(state, { type: 'MOVE_BLOCK', blockId: footerId, destination: { type: 'pile', pileIndex: 1 } });

    expect(next.blocks[footerId].location).toEqual({ type: 'pile', pileIndex: 1 });
    expect(next.moveCount).toBe(1);
  });

  it('ignores attempts to move a hint block', () => {
    const state = createInitialState(level1);
    const [hintId, hintBlock] = Object.entries(state.blocks).find(([, b]) => b.isHint)!;

    const next = reducer(state, { type: 'MOVE_BLOCK', blockId: hintId, destination: { type: 'footer' } });

    expect(next.blocks[hintId].location).toEqual(hintBlock.location);
    expect(next.moveCount).toBe(0);
  });

  it('is a no-op when dropped back on its current location', () => {
    const state = createInitialState(level1);
    const [footerId] = Object.entries(state.blocks).find(([, b]) => b.location.type === 'footer')!;

    const next = reducer(state, { type: 'MOVE_BLOCK', blockId: footerId, destination: { type: 'footer' } });

    expect(next.moveCount).toBe(0);
    expect(next).toBe(state);
  });

  it('resets all blocks back to their initial location and clears moveCount', () => {
    const state = createInitialState(level1);
    const [footerId] = Object.entries(state.blocks).find(([, b]) => b.location.type === 'footer')!;
    const moved = reducer(state, { type: 'MOVE_BLOCK', blockId: footerId, destination: { type: 'pile', pileIndex: 0 } });

    const reset = reducer(moved, { type: 'RESET_LEVEL' });

    expect(reset.blocks).toEqual(state.initialBlocks);
    expect(reset.moveCount).toBe(0);
  });
});
