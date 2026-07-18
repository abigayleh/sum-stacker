import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { getSoundOn } from './settings';

// App-wide audio: a looping music track plus one-shot SFX (click/chime/win).
// Players are created once; SFX no-op while sound is off, music is paused/resumed.
let music: AudioPlayer | null = null;
let click: AudioPlayer | null = null;
let chime: AudioPlayer | null = null;
let win: AudioPlayer | null = null;

export async function initAudio() {
  if (music) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    music = createAudioPlayer(require('../../assets/audio/music.mp3'));
    music.loop = true;
    music.volume = 0.4;
    click = createAudioPlayer(require('../../assets/audio/click.mp3'));
    click.volume = 0.6;
    chime = createAudioPlayer(require('../../assets/audio/chime.mp3'));
    chime.volume = 0.7;
    win = createAudioPlayer(require('../../assets/audio/win.mp3'));
    win.volume = 0.85;
  } catch {}
}

function oneShot(player: AudioPlayer | null) {
  if (!getSoundOn() || !player) return;
  player.seekTo(0).catch(() => {});
  player.play();
}

export const playClick = () => oneShot(click);
export const playChime = () => oneShot(chime);
export const playWin = () => oneShot(win);

// Sync music with the toggle — call on load and after every change.
export function applySound(on: boolean) {
  if (on) music?.play();
  else music?.pause();
}

// Background/foreground lifecycle — resume respects the toggle.
export function pauseMusic() {
  music?.pause();
}
export function resumeMusic() {
  if (getSoundOn()) music?.play();
}
