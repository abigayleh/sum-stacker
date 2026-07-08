import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { StarRating } from './StarRating';

type Props = {
  visible: boolean;
  stars: number;
  isLastLevel: boolean;
  onReplay: () => void;
  onNextLevel: () => void;
  onLevelSelect: () => void;
};

export function CompletionModal({ visible, stars, isLastLevel, onReplay, onNextLevel, onLevelSelect }: Props) {
  const [litStars, setLitStars] = useState(0);

  useEffect(() => {
    if (!visible) {
      setLitStars(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= stars; i++) {
      timers.push(setTimeout(() => setLitStars(i), i * 230));
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [visible, stars]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.kicker}>{isLastLevel ? 'ALL LEVELS' : 'LEVEL COMPLETE'}</Text>
          <Text style={globalStyles.title}>{isLastLevel ? 'Puzzle Master!' : 'Complete!'}</Text>
          <StarRating stars={stars} litStars={litStars} size={38} />
          <Text style={styles.copy}>Flawless - every pile matched the target.</Text>
          {!isLastLevel && (
            <Pressable style={globalStyles.button} onPress={onNextLevel}>
              <Text style={globalStyles.buttonText}>Next Level</Text>
            </Pressable>
          )}
          <View style={styles.actionsRow}>
            {!isLastLevel && (
              <Pressable style={globalStyles.buttonSecondary} onPress={onReplay}>
                <Text style={globalStyles.buttonSecondaryText}>Replay</Text>
              </Pressable>
            )}
            <Pressable style={globalStyles.buttonSecondary} onPress={onLevelSelect}>
              <Text style={globalStyles.buttonSecondaryText}>Levels</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    width: '84%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  kicker: {
    color: colors.chalkMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  copy: {
    color: colors.chalkMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  actionsRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 10,
  },
});
