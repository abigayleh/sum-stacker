import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';
import { getProgress } from '../storage/progress';
import { LEVELS } from '../game/levels';
import { SettingsModal } from '../components/SettingsModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Solved-board preview: both piles sum to 10, showing off gold + coral blocks.
const LEFT_PILE = [5, 3, 2];
const RIGHT_PILE = [6, 5, -1];

function MiniBlock({ value }: { value: number }) {
  const label = value > 0 ? `+${value}` : `${value}`;
  return (
    <View style={[styles.block, value < 0 && styles.blockNegative]}>
      <Text style={styles.blockValue}>{label}</Text>
    </View>
  );
}

function MiniPile({ values }: { values: number[] }) {
  return (
    <View style={styles.pile}>
      <View style={styles.badge}>
        <Text style={styles.badgeValue}>10</Text>
        <Text style={styles.badgeCheck}>✓</Text>
      </View>
      <View style={styles.stack}>
        {values.map((value, i) => (
          <MiniBlock key={i} value={value} />
        ))}
      </View>
    </View>
  );
}

export function HomeScreen({ navigation }: Props) {
  const [nextLevel, setNextLevel] = useState(1);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getProgress().then((progress) => {
        const unlocked = LEVELS.filter((l) => progress.levels[String(l.id)]?.unlocked).map((l) => l.id);
        setNextLevel(unlocked.length ? Math.max(...unlocked) : 1);
      });
    }, [])
  );

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]}>
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.board}>
          <MiniPile values={LEFT_PILE} />
          <Text style={styles.equals}>=</Text>
          <MiniPile values={RIGHT_PILE} />
        </View>
        <Text style={globalStyles.title}>
          Sum <Text style={styles.titleAccent}>Stacker</Text>
        </Text>
        <Text style={globalStyles.subtitle}>Stack the numbers. Match the sums.</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [globalStyles.button, styles.playButton, pressed && styles.pressed]}
          onPress={() => navigation.navigate('LevelBoard', { levelId: nextLevel })}
        >
          <Text style={globalStyles.buttonText}>Play</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [globalStyles.buttonSecondary, pressed && styles.pressed]}
          onPress={() => navigation.navigate('LevelSelect')}
        >
          <Text style={globalStyles.buttonSecondaryText}>Levels</Text>
        </Pressable>
      </View>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    color: colors.chalkWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    marginTop: 18,
    alignItems: 'center',
    gap: 20,
  },
  board: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 22,
    paddingHorizontal: 26,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  pile: {
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    minWidth: 48,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: 'rgba(113, 208, 143, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  badgeValue: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '800',
  },
  badgeCheck: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '900',
  },
  stack: {
    gap: 5,
  },
  block: {
    width: 58,
    height: 42,
    borderRadius: 11,
    backgroundColor: colors.accentYellow,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  blockNegative: {
    backgroundColor: colors.accentBlue,
  },
  blockValue: {
    color: colors.background,
    fontSize: 19,
    fontWeight: '900',
  },
  equals: {
    color: colors.chalkMuted,
    fontSize: 26,
    fontWeight: '800',
  },
  titleAccent: {
    color: colors.accentYellow,
  },
  actions: {
    gap: 12,
  },
  playButton: {
    shadowColor: colors.accentYellow,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
