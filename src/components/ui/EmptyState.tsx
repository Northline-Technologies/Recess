import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title,
  description,
  iconName = 'folder-open-outline',
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
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
        <Ionicons name={iconName} size={36} color={colors.accent} />
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
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} variant="secondary" size="sm" />
      )}
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
