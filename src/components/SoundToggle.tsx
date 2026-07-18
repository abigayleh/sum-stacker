import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { applySound } from '../audio/audio';
import { setSoundOn, useSoundOn } from '../audio/settings';

// Single master toggle for music, SFX, and haptics.
export function SoundToggle({ style }: { style?: StyleProp<ViewStyle> }) {
  const on = useSoundOn();
  return (
    <Pressable
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={on ? 'Mute sound' : 'Unmute sound'}
      onPress={() => {
        const next = !on;
        setSoundOn(next);
        applySound(next);
      }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <Text style={styles.icon}>{on ? '🔊' : '🔇'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    fontSize: 18,
  },
});
