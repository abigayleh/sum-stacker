import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';
import { defaultProgress, getProgress, Progress } from '../storage/progress';
import { LEVELS } from '../game/levels';
import { StarRating } from '../components/StarRating';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelect'>;

export function LevelSelectScreen({ navigation }: Props) {
  const [progress, setProgress] = useState<Progress>(defaultProgress());

  useFocusEffect(
    useCallback(() => {
      getProgress().then(setProgress);
    }, [])
  );

  return (
    <SafeAreaView style={globalStyles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Select Level</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.grid}>
        {LEVELS.map((level) => {
          const levelProgress = progress.levels[String(level.id)];
          const unlocked = levelProgress.unlocked;
          return (
            <Pressable
              key={level.id}
              disabled={!unlocked}
              style={[styles.tile, !unlocked && styles.tileLocked]}
              onPress={() => navigation.navigate('LevelBoard', { levelId: level.id })}
            >
              <Text style={styles.tileNumber}>{unlocked ? level.id : '•'}</Text>
              {unlocked && <StarRating stars={levelProgress.bestStars} size={12} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    color: colors.chalkMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    color: colors.chalkWhite,
    fontSize: 26,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 56,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  tile: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tileLocked: {
    opacity: 0.34,
  },
  tileNumber: {
    color: colors.chalkWhite,
    fontSize: 26,
    fontWeight: '800',
  },
});
