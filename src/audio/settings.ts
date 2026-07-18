import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// Single master sound toggle: gates music, SFX, and haptics together.
const STORAGE_KEY = '@sum-stacker/settings/v1';

let soundOn = true;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function getSoundOn() {
  return soundOn;
}

// Load the persisted value once on startup.
export async function loadSoundSetting(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      soundOn = Boolean(JSON.parse(raw).soundOn);
      emit();
    }
  } catch {}
  return soundOn;
}

export function setSoundOn(on: boolean) {
  soundOn = on;
  emit();
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ soundOn: on })).catch(() => {});
}

// Subscribe hook so every SoundToggle stays in sync without a Provider.
export function useSoundOn(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSoundOn
  );
}
