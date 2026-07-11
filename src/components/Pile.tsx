import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export type Rect = { x: number; y: number; width: number; height: number };

type Props = {
  index: number;
  sum: number;
  isComplete: boolean;
  children: React.ReactNode;
  onMeasured: (index: number, rect: Rect) => void;
};

export function Pile({ index, sum, isComplete, children, onMeasured }: Props) {
  const ref = useRef<View>(null);

  const measure = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      onMeasured(index, { x, y, width, height });
    });
  };

  return (
    <View ref={ref} style={styles.column} onLayout={measure}>
      <View style={[styles.badge, isComplete && styles.badgeComplete]}>
        <Text style={[styles.badgeValue, isComplete && styles.badgeValueComplete]}>{sum}</Text>
        {isComplete && <Text style={styles.badgeCheck}>✓</Text>}
      </View>
      <View style={styles.well} />
      <View style={styles.stack}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 280,
  },
  badge: {
    minWidth: 52,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 10,
  },
  badgeComplete: {
    borderColor: colors.success,
    backgroundColor: 'rgba(113, 208, 143, 0.16)',
  },
  badgeValue: {
    color: colors.chalkMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  badgeValueComplete: {
    color: colors.success,
  },
  badgeCheck: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '900',
  },
  well: {
    width: '90%',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  stack: {
    position: 'absolute',
    bottom: 18,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    gap: 2,
  },
});
