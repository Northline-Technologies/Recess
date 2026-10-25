import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export type BadgeVariant =
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'secondary'
  | 'outline';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, variant = 'secondary', style }: BadgeProps) {
  const { colors, isDark, radii, spacing, typography } = useAppTheme();

  let backgroundColor: string = colors.surfaceSecondary;
  let textColor: string = colors.textPrimary;
  let borderColor: string = 'transparent';

  switch (variant) {
    case 'accent':
      backgroundColor = colors.accent;
      textColor = colors.onAccent;
      break;
    case 'success':
      backgroundColor = isDark ? '#1B3D27' : '#E8F5E9';
      textColor = colors.success;
      break;
    case 'warning':
      backgroundColor = isDark ? '#3D2F1B' : '#FFF8E1';
      textColor = colors.warning;
      break;
    case 'error':
      backgroundColor = isDark ? '#3D1B1B' : '#FFEBEE';
      textColor = colors.error;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      borderColor = colors.border;
      textColor = colors.textSecondary;
      break;
    case 'secondary':
    default:
      backgroundColor = colors.surfaceSecondary;
      textColor = colors.textSecondary;
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: radii.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
        },
        style,
      ]}>
      <Text style={[typography.caption, { color: textColor, fontWeight: '600' }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
