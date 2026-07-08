import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  children: React.ReactNode;
  hint?: string;
};

export function Footer({ children, hint = 'Drag each block onto a pile - make every pile equal the target' }: Props) {
  return (
    <View style={styles.footer}>
      <Text style={styles.hint}>{hint}</Text>
      <View style={styles.tray}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    minHeight: 154,
    paddingTop: 10,
    gap: 10,
  },
  hint: {
    color: colors.chalkMuted,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
});
