import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { getSettings, subscribeSettings } from '../storage/settings';

// One-shot game SFX: click on drop, chime on pile complete, flourish on win.
let click: AudioPlayer | null = null;
let chime: AudioPlayer | null = null;
let win: AudioPlayer | null = null;
let bgm: AudioPlayer | null = null;
let soundsEnabled = true;
let musicEnabled = true;

function syncMusicState() {
  if (!bgm) return;
  if (musicEnabled && !bgm.playing) bgm.play();
  if (!musicEnabled && bgm.playing) bgm.pause();
}

export async function initAudio() {
  if (click) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    const settings = await getSettings();
    soundsEnabled = settings.soundsEnabled;
    musicEnabled = settings.musicEnabled;

    click = createAudioPlayer(require('../../assets/audio/click.mp3'));
    click.volume = 0.6;
    chime = createAudioPlayer(require('../../assets/audio/chime.mp3'));
    chime.volume = 0.7;
    win = createAudioPlayer(require('../../assets/audio/win.mp3'));
    win.volume = 0.85;
    bgm = createAudioPlayer(require('../../assets/audio/bgm.mp3'));
    bgm.volume = 0.35;
    bgm.loop = true;
    syncMusicState();

    subscribeSettings((next) => {
      soundsEnabled = next.soundsEnabled;
      musicEnabled = next.musicEnabled;
      syncMusicState();
    });
  } catch {}
}

// seekTo is async: calling play() before it lands leaves the player parked at the
// end of the clip, which silenced every other one-shot.
async function oneShot(player: AudioPlayer | null) {
  if (!player || !soundsEnabled) return;
  try {
    await player.seekTo(0);
    player.play();
  } catch {}
}

export const playClick = () => oneShot(click);
export const playChime = () => oneShot(chime);
export const playWin = () => oneShot(win);
