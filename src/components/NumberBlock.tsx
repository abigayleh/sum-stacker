import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';

type Props = {
  id: string;
  value: number;
  isHint: boolean;
  onDrop: (id: string, absoluteX: number, absoluteY: number) => void;
  onTap?: (id: string) => void;
};

export function NumberBlock({ id, value, isHint, onDrop, onTap }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);

  const pan = Gesture.Pan()
    .enabled(!isHint)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.06);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(onDrop)(id, event.absoluteX, event.absoluteY);
    });

  const tap = Gesture.Tap()
    .enabled(Boolean(onTap) && !isHint)
    .onEnd((_, success) => {
      if (success && onTap) {
        runOnJS(onTap)(id);
      }
    });

  const gesture = onTap ? Gesture.Exclusive(pan, tap) : pan;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    zIndex: isDragging.value ? 10 : 0,
    shadowOpacity: isDragging.value ? 0.35 : 0.12,
  }));

  const label = value > 0 ? `+${value}` : `${value}`;
  const isNegative = !isHint && value < 0;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.block, isHint && styles.hintBlock, isNegative && styles.negativeBlock, animatedStyle]}>
        <Text style={styles.value}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    width: 64,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.accentYellow,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  hintBlock: {
    backgroundColor: colors.surfaceAlt,
  },
  negativeBlock: {
    backgroundColor: colors.accentBlue,
  },
  value: {
    color: colors.background,
    fontSize: 20,
    fontWeight: '900',
  },
});
