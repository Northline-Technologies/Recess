import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export interface LoadingStateProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export function LoadingState({ message = 'Loading...', style }: LoadingStateProps) {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.accent} />
      {message ? (
        <Text
          style={[
            typography.bodySecondary,
            { color: colors.textSecondary, marginTop: spacing.md },
          ]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
