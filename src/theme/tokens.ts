/**
 * SkillShare Design System Tokens
 * Source of truth: 07_DESIGN_SYSTEM.md
 */

export const LightColors = {
  background: '#F7F9F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F3F0',
  textPrimary: '#171B18',
  textSecondary: '#626B64',
  border: '#DDE4DE',
  accent: '#23864A',
  accentPressed: '#176B38',
  onAccent: '#FFFFFF',
  success: '#237A43',
  warning: '#946200',
  error: '#B42318',
  disabled: '#A7AEA9',
  card: '#FFFFFF',
  tint: '#23864A',
  tabIconDefault: '#626B64',
  tabIconSelected: '#23864A',
} as const;

export const DarkColors = {
  background: '#101411',
  surface: '#191F1A',
  surfaceSecondary: '#222A23',
  textPrimary: '#F3F6F3',
  textSecondary: '#B0BBB2',
  border: '#343E35',
  accent: '#55C878',
  accentPressed: '#75D991',
  onAccent: '#102015',
  success: '#75D991',
  warning: '#F2C66D',
  error: '#FF8A80',
  disabled: '#69736B',
  card: '#191F1A',
  tint: '#55C878',
  tabIconDefault: '#B0BBB2',
  tabIconSelected: '#55C878',
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentPressed: string;
  onAccent: string;
  success: string;
  warning: string;
  error: string;
  disabled: string;
  card: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const Radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

export const Typography = {
  display: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  screenTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySecondary: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400' as const,
  },
  buttonLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
} as const;
