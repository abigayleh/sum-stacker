import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultProgress, getProgress, recordLevelResult } from './progress';
import { LEVELS } from '../game/levels';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('progress storage', () => {
  it('defaults to only level 1 unlocked with no stars', () => {
    const progress = defaultProgress();
    expect(progress.levels['1']).toEqual({ unlocked: true, bestStars: 0, bestMoves: null });
    expect(progress.levels['2'].unlocked).toBe(false);
    expect(Object.keys(progress.levels)).toHaveLength(LEVELS.length);
  });

  it('getProgress returns defaults when nothing is stored yet', async () => {
    const progress = await getProgress();
    expect(progress).toEqual(defaultProgress());
  });

  it('recordLevelResult stores stars/moves and unlocks the next level', async () => {
    const progress = await recordLevelResult(1, 2, 5);

    expect(progress.levels['1']).toEqual({ unlocked: true, bestStars: 2, bestMoves: 5 });
    expect(progress.levels['2'].unlocked).toBe(true);
  });

  it('keeps the best (max stars / min moves) result across replays', async () => {
    await recordLevelResult(1, 2, 6);
    const progress = await recordLevelResult(1, 3, 8);

    expect(progress.levels['1'].bestStars).toBe(3);
    expect(progress.levels['1'].bestMoves).toBe(6);
  });

  it('does not unlock a level past the last one', async () => {
    const progress = await recordLevelResult(LEVELS.length, 3, 4);
    expect(progress.levels[String(LEVELS.length + 1)]).toBeUndefined();
  });
});
