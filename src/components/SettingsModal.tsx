import React, { useEffect, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { getSettings, updateSettings, type Settings } from '../storage/settings';

type Props = {
  visible: boolean;
  onClose: () => void;
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
        thumbColor={value ? colors.chalkWhite : '#f1e1cb'}
      />
    </View>
  );
}

export function SettingsModal({ visible, onClose }: Props) {
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
    const next = await updateSettings({ [key]: value });
    setSettings(next);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>Settings</Text>

          <SettingRow label="Music" value={settings.musicEnabled} onValueChange={setValue('musicEnabled')} />
          <SettingRow label="Sounds" value={settings.soundsEnabled} onValueChange={setValue('soundsEnabled')} />
          <SettingRow label="Haptics" value={settings.hapticsEnabled} onValueChange={setValue('hapticsEnabled')} />

          <View style={styles.creditWrap}>
            <Text style={styles.creditTitle}>Music Credit</Text>
            <Text style={styles.creditText}>Music from #Uppbeat (free for Creators!):</Text>
            <Pressable onPress={() => Linking.openURL('https://uppbeat.io/t/paint-the-skies/12am')}>
              <Text style={styles.creditLink}>https://uppbeat.io/t/paint-the-skies/12am</Text>
            </Pressable>
            <Text style={styles.creditText}>License code: 3L8L0IO4TJ9UVO1Y</Text>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
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
    padding: 18,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 10,
  },
  title: {
    color: colors.chalkWhite,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  row: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: colors.chalkWhite,
    fontSize: 17,
    fontWeight: '700',
  },
  creditWrap: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 5,
  },
  creditTitle: {
    color: colors.chalkWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  creditText: {
    color: colors.chalkMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  creditLink: {
    color: colors.accentYellow,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  closeButton: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  closeText: {
    color: colors.chalkWhite,
    fontSize: 16,
    fontWeight: '800',
  },
});
