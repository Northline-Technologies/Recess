import { Platform } from 'react-native';
import { LightColors, DarkColors, Spacing as DesignSpacing, Radii as DesignRadii, Typography as DesignTypography } from '@/theme/tokens';

export const Colors = {
  light: LightColors,
  dark: DarkColors,
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = DesignSpacing;
export const Radii = DesignRadii;
export const Typography = DesignTypography;

export const BottomTabInset = Platform.select({ ios: 50, android: 70 }) ?? 60;
export const MaxContentWidth = 800;
