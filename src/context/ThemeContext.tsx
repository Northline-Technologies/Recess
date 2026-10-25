import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, ThemeColors, Spacing, Radii, Typography } from '@/theme/tokens';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => Promise<void>;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof Spacing;
  radii: typeof Radii;
  typography: typeof Typography;
}

const THEME_STORAGE_KEY = '@skillshare_theme_preference';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setThemePreferenceState(stored);
        }
      } catch (e) {
        console.warn('Failed to load theme preference from storage', e);
      }
    }
    loadStoredTheme();
  }, []);

  const setThemePreference = async (pref: ThemePreference) => {
    try {
      setThemePreferenceState(pref);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch (e) {
      console.warn('Failed to persist theme preference', e);
    }
  };

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (themePreference === 'system') {
      return deviceColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  }, [themePreference, deviceColorScheme]);

  const colors = useMemo(() => {
    return resolvedTheme === 'dark' ? DarkColors : LightColors;
  }, [resolvedTheme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      themePreference,
      setThemePreference,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      colors,
      spacing: Spacing,
      radii: Radii,
      typography: Typography,
    }),
    [themePreference, resolvedTheme, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
