import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVELS } from '../game/levels';

const STORAGE_KEY = '@number-puzzle/progress/v1';

export type LevelProgress = { unlocked: boolean; bestStars: number; bestMoves: number | null };
export type Progress = { version: 1; levels: Record<string, LevelProgress> };

export function defaultProgress(): Progress {
  const levels: Record<string, LevelProgress> = {};
  LEVELS.forEach((level) => {
    levels[String(level.id)] = { unlocked: level.id === 1, bestStars: 0, bestMoves: null };
  });
  return { version: 1, levels };
}

export async function getProgress(): Promise<Progress> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const fallback = defaultProgress();
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Progress;
    return { ...fallback, ...parsed, levels: { ...fallback.levels, ...parsed.levels } };
  } catch {
    return fallback;
  }
}

export async function recordLevelResult(levelId: number, stars: number, moves: number): Promise<Progress> {
  const progress = await getProgress();
  const current = progress.levels[String(levelId)];
  const bestStars = Math.max(current.bestStars, stars);
  const bestMoves = current.bestMoves == null ? moves : Math.min(current.bestMoves, moves);
  progress.levels[String(levelId)] = { ...current, bestStars, bestMoves };

  const nextId = String(levelId + 1);
  if (progress.levels[nextId]) {
    progress.levels[nextId] = { ...progress.levels[nextId], unlocked: true };
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}
