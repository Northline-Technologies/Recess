import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/theme/tokens';

export interface ThemedViewProps extends ViewProps {
  color?: keyof ThemeColors;
  type?: keyof ThemeColors;
}

export function ThemedView({ style, color = 'background', type, ...otherProps }: ThemedViewProps) {
  const { colors } = useAppTheme();
  const bgKey = type || color;
  const backgroundColor = colors[bgKey] || colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
