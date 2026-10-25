import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  style,
}: ErrorStateProps) {
  const { colors, spacing, typography, radii } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxl }, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceSecondary,
            borderRadius: radii.full,
            marginBottom: spacing.base,
          },
        ]}>
        <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
      </View>
      <Text
        style={[
          typography.cardTitle,
          { color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          typography.bodySecondary,
          { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
        ]}>
        {message}
      </Text>
      {onRetry && <Button title="Try Again" onPress={onRetry} variant="secondary" size="sm" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
