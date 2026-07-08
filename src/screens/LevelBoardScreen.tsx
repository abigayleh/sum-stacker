import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';
import { LEVELS } from '../game/levels';
import { useGameState } from '../game/useGameState';
import { recordLevelResult } from '../storage/progress';
import { NumberBlock } from '../components/NumberBlock';
import { Pile, Rect } from '../components/Pile';
import { Footer } from '../components/Footer';
import { CompletionModal } from '../components/CompletionModal';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelBoard'>;

export function LevelBoardScreen({ route, navigation }: Props) {
  const level = LEVELS.find((l) => l.id === route.params.levelId)!;
  const { state, moveBlock, resetLevel, pileSums, footerBlockIds, isWin, stars } = useGameState(level);
  const pileRects = useRef<Record<number, Rect>>({});
  const hasRecordedWin = useRef(false);
  const [winVisible, setWinVisible] = useState(false);

  useEffect(() => {
    if (isWin) {
      setWinVisible(true);
      if (!hasRecordedWin.current) {
        hasRecordedWin.current = true;
        recordLevelResult(level.id, stars, state.moveCount);
      }
    } else {
      hasRecordedWin.current = false;
    }
  }, [isWin, stars, state.moveCount, level.id]);

  const handleMeasured = useCallback((index: number, rect: Rect) => {
    pileRects.current[index] = rect;
  }, []);

  const handleDrop = useCallback(
    (blockId: string, absoluteX: number, absoluteY: number) => {
      const targetPile = Object.entries(pileRects.current).find(
        ([, rect]) =>
          absoluteX >= rect.x &&
          absoluteX <= rect.x + rect.width &&
          absoluteY >= rect.y &&
          absoluteY <= rect.y + rect.height
      );
      moveBlock(blockId, targetPile ? { type: 'pile', pileIndex: Number(targetPile[0]) } : { type: 'footer' });
    },
    [moveBlock]
  );

  const returnToFooter = useCallback(
    (blockId: string) => {
      moveBlock(blockId, { type: 'footer' });
    },
    [moveBlock]
  );

  const blocksForPile = (pileIndex: number) =>
    Object.entries(state.blocks).filter(([, b]) => b.location.type === 'pile' && b.location.pileIndex === pileIndex);

  const isLastLevel = level.id === LEVELS.length;

  return (
    <SafeAreaView style={globalStyles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>{'< Back'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Level {level.id}</Text>
        <Pressable hitSlop={12} onPress={resetLevel}>
          <Text style={styles.headerButton}>Reset</Text>
        </Pressable>
      </View>

      {level.showSum && (
        <View style={styles.targetWrap}>
          <Text style={styles.targetLabel}>TARGET</Text>
          <Text style={styles.target}>{level.targetSum}</Text>
        </View>
      )}

      <View style={styles.piles}>
        {pileSums.map((_, index) => (
          <Pile
            key={index}
            index={index}
            sum={pileSums[index]}
            isComplete={pileSums[index] === level.targetSum}
            onMeasured={handleMeasured}
          >
            {blocksForPile(index).map(([id, b]) => (
              <NumberBlock
                key={id}
                id={id}
                value={b.value}
                isHint={b.isHint}
                onDrop={handleDrop}
                onTap={returnToFooter}
              />
            ))}
          </Pile>
        ))}
      </View>

      <Footer>
        {footerBlockIds.map((id) => (
          <NumberBlock key={id} id={id} value={state.blocks[id].value} isHint={false} onDrop={handleDrop} />
        ))}
      </Footer>

      <CompletionModal
        visible={winVisible}
        stars={stars}
        isLastLevel={isLastLevel}
        onReplay={() => {
          setWinVisible(false);
          resetLevel();
        }}
        onNextLevel={() => {
          setWinVisible(false);
          navigation.replace('LevelBoard', { levelId: level.id + 1 });
        }}
        onLevelSelect={() => {
          setWinVisible(false);
          navigation.navigate('LevelSelect');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerButton: {
    color: colors.chalkMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    color: colors.chalkWhite,
    fontSize: 28,
    fontWeight: '800',
  },
  targetWrap: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  targetLabel: {
    color: colors.chalkMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  target: {
    color: colors.accentYellow,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  piles: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
});
