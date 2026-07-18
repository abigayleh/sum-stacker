import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Credits'>;

const TRACK_URL = 'https://uppbeat.io/t/paint-the-skies/12am';

export function CreditsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={globalStyles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Credits</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>MUSIC</Text>
        <Text style={styles.trackTitle}>Paint the Skies</Text>
        <Text style={styles.body}>Music from Uppbeat (free for Creators!)</Text>
        <Pressable hitSlop={8} onPress={() => Linking.openURL(TRACK_URL)}>
          <Text style={styles.link}>uppbeat.io/t/paint-the-skies/12am</Text>
        </Pressable>
        <Text style={styles.license}>License code: 3L8L0IO4TJ9UVO1Y</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
    gap: 8,
  },
  sectionLabel: {
    color: colors.chalkMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  trackTitle: {
    color: colors.chalkWhite,
    fontSize: 20,
    fontWeight: '800',
  },
  body: {
    color: colors.chalkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: colors.accentYellow,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  license: {
    color: colors.chalkMuted,
    fontSize: 13,
    marginTop: 4,
  },
});
