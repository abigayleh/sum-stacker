import { useEffect } from 'react';
import { AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { applySound, initAudio, pauseMusic, resumeMusic } from './src/audio/audio';
import { getSoundOn, loadSoundSetting } from './src/audio/settings';

export default function App() {
  useEffect(() => {
    (async () => {
      await initAudio();
      await loadSoundSetting();
      applySound(getSoundOn());
    })();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') resumeMusic();
      else pauseMusic();
    });
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
