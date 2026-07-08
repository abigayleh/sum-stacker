import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: colors.chalkWhite,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.chalkMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.accentYellow,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: colors.chalkWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});
