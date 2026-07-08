import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  stars: number;
  size?: number;
  litStars?: number;
};

export function StarRating({ stars, size = 20, litStars }: Props) {
  const filled = litStars ?? stars;

  return (
    <View style={styles.row}>
      {[1, 2, 3].map((n) => (
        <Text
          key={n}
          style={[styles.star, { fontSize: size, color: n <= filled ? colors.accentYellow : colors.chalkMuted }]}
        >
          {n <= filled ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  star: { marginHorizontal: 2 },
});
