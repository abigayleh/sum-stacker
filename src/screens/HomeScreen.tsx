import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]}>
      <View style={styles.hero}>
        <View style={styles.equation}>
          <View style={styles.column}>
            <Text style={styles.eqNum}>5</Text>
            <Text style={styles.eqNum}>3</Text>
            <Text style={styles.eqNum}>2</Text>
          </View>
          <Text style={styles.eqEqual}>=</Text>
          <View style={styles.column}>
            <Text style={styles.eqNum}>5</Text>
            <Text style={styles.eqNum}>4</Text>
            <Text style={styles.eqNum}>1</Text>
          </View>
        </View>
        <Text style={globalStyles.title}>Sum Stacker</Text>
        <Text style={globalStyles.subtitle}>Stack the numbers. Match the sums.</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={globalStyles.button} onPress={() => navigation.navigate('LevelSelect')}>
          <Text style={globalStyles.buttonText}>Play</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  hero: {
    marginTop: 66,
    alignItems: 'center',
    gap: 12,
  },
  equation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  column: {
    width: 38,
    alignItems: 'center',
    gap: 2,
  },
  eqNum: {
    color: colors.accentCream,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
  },
  eqEqual: {
    color: colors.chalkMuted,
    fontSize: 28,
    fontWeight: '700',
  },
  actions: {
    alignItems: 'center',
    gap: 16,
  },
});
