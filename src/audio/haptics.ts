import * as Haptics from 'expo-haptics';
import { getSettings, subscribeSettings } from '../storage/settings';

let hapticsEnabled = true;
getSettings().then((settings) => {
  hapticsEnabled = settings.hapticsEnabled;
});

subscribeSettings((settings) => {
  hapticsEnabled = settings.hapticsEnabled;
});

export function hapticDrop() {
  if (!hapticsEnabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticPileComplete() {
  if (!hapticsEnabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function hapticWin() {
  if (!hapticsEnabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
