import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'surface' | 'secondary' | 'outlined';
}

export function Card({
  children,
  onPress,
  style,
  variant = 'surface',
}: CardProps) {
  const { colors, radii, spacing } = useAppTheme();

  const backgroundColor =
    variant === 'surface'
      ? colors.surface
      : variant === 'secondary'
      ? colors.surfaceSecondary
      : 'transparent';

  const cardStyle: ViewStyle = {
    backgroundColor,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.base,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          cardStyle,
          pressed && { opacity: 0.9, backgroundColor: colors.surfaceSecondary },
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
