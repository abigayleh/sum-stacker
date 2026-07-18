import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { getSettings, updateSettings, type Settings } from '../storage/settings';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenCredits: () => void;
};

function SettingRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#5a4a63', true: colors.success }}
        thumbColor={colors.chalkWhite}
      />
    </View>
  );
}

export function SettingsModal({ visible, onClose, onOpenCredits }: Props) {
  const [settings, setSettings] = useState<Settings>({
    musicEnabled: true,
    soundsEnabled: true,
    hapticsEnabled: true,
  });

  useEffect(() => {
    if (!visible) return;
    getSettings().then(setSettings);
  }, [visible]);

  const setValue = (key: keyof Settings) => async (value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSettings(await updateSettings({ [key]: value }));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.group}>
            <SettingRow label="Music" value={settings.musicEnabled} onValueChange={setValue('musicEnabled')} />
            <View style={styles.divider} />
            <SettingRow label="Sounds" value={settings.soundsEnabled} onValueChange={setValue('soundsEnabled')} />
            <View style={styles.divider} />
            <SettingRow label="Haptics" value={settings.hapticsEnabled} onValueChange={setValue('hapticsEnabled')} />
          </View>

          <Pressable style={styles.creditsButton} onPress={onOpenCredits}>
            <Text style={styles.creditsText}>Credits</Text>
            <Text style={styles.creditsChevron}>›</Text>
          </Pressable>

          <Pressable style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 22,
    gap: 16,
  },
  title: {
    color: colors.chalkWhite,
    fontSize: 24,
    fontWeight: '800',
  },
  group: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: colors.chalkWhite,
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.border,
  },
  creditsButton: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditsText: {
    color: colors.chalkWhite,
    fontSize: 17,
    fontWeight: '700',
  },
  creditsChevron: {
    color: colors.chalkMuted,
    fontSize: 22,
    fontWeight: '700',
  },
  doneButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentYellow,
  },
  doneText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '800',
  },
});
