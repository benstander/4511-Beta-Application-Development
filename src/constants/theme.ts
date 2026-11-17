// Colours, fonts and spacing. Use useTheme() to get the right colours

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    textMuted: '#4B4B4B',
    border: '#E4E4E4',
    iconButton: '#F5F5F5',
    iconButtonBorder: '#E5E5E5',
    buttonSecondary: '#EFEFEF',
    buttonSecondaryBorder: '#D7D7D7',
    buttonDisabled: '#E5E5E5',
    textDisabled: '#A3A3A3',
    surface: '#FFFFFF',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    textMuted: '#B0B4BA',
    border: '#2E3135',
    iconButton: '#212225',
    iconButtonBorder: '#2E3135',
    buttonSecondary: '#2E3135',
    buttonSecondaryBorder: '#3A3D42',
    buttonDisabled: '#2E3135',
    textDisabled: '#6B6F76',
    surface: '#1C1C1E',
  },
} as const;

export const Palette = {
  primary: '#0051FF',
  destructive: '#D10000',
  onColor: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;

export const FontFamily = {
  medium: 'InstrumentSans_500Medium',
  semiBold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
} as const;

export const SessionLevelColors = {
  social: '#169300',
  competitive: '#D10000',
  beginner: '#0051FF',
} as const;

export type SessionLevel = keyof typeof SessionLevelColors;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const ScreenPadding = 16;

export const TabBarHeight = Platform.select({ android: 80 }) ?? 0;
export const MaxContentWidth = 800;
