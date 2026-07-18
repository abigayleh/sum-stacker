import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@number-puzzle/settings/v1';

export type Settings = {
  musicEnabled: boolean;
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  musicEnabled: true,
  soundsEnabled: true,
  hapticsEnabled: true,
};

type Listener = (settings: Settings) => void;
const listeners = new Set<Listener>();

let settingsCache: Settings = DEFAULT_SETTINGS;
let hasLoaded = false;

export function getDefaultSettings(): Settings {
  return DEFAULT_SETTINGS;
}

export async function getSettings(): Promise<Settings> {
  if (hasLoaded) return settingsCache;

  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    hasLoaded = true;
    settingsCache = DEFAULT_SETTINGS;
    return settingsCache;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    settingsCache = { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    settingsCache = DEFAULT_SETTINGS;
  }

  hasLoaded = true;
  return settingsCache;
}

export function getSettingsSync(): Settings {
  return settingsCache;
}

export async function updateSettings(next: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  settingsCache = { ...current, ...next };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsCache));
  listeners.forEach((listener) => listener(settingsCache));
  return settingsCache;
}

export function subscribeSettings(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
