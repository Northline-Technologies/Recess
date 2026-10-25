import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash screen prevention may fail in web environments
});

function RootNavigationLayout() {
  const { isDark, colors } = useAppTheme();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="course/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Course Details',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="class/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Classroom',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="group/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Community Group',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="session/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Live Session',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="settings/appearance"
          options={{
            headerShown: true,
            headerTitle: 'Appearance',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Sign In',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigationLayout />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
