import * as Haptics from 'expo-haptics';
import { getSoundOn } from './settings';

// All haptics respect the single master toggle.
export function hapticDrop() {
  if (!getSoundOn()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticPileComplete() {
  if (!getSoundOn()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function hapticWin() {
  if (!getSoundOn()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
