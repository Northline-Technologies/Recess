import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, radii, spacing, typography } = useAppTheme();

  const isInteractive = !disabled && !loading;

  // Resolve background and border styles
  let backgroundColor: string = colors.accent;
  let borderColor: string = 'transparent';
  let borderWidth = 0;
  let textColor: string = colors.onAccent;

  switch (variant) {
    case 'primary':
      backgroundColor = disabled ? colors.disabled : colors.accent;
      textColor = colors.onAccent;
      break;
    case 'secondary':
      backgroundColor = disabled ? colors.disabled : colors.surfaceSecondary;
      textColor = colors.textPrimary;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      borderColor = disabled ? colors.disabled : colors.border;
      borderWidth = 1.5;
      textColor = disabled ? colors.disabled : colors.textPrimary;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = disabled ? colors.disabled : colors.textPrimary;
      break;
    case 'destructive':
      backgroundColor = disabled ? colors.disabled : colors.error;
      textColor = '#FFFFFF';
      break;
  }

  // Sizing
  let height: number = 48;
  let paddingHorizontal: number = spacing.lg;
  let fontSize: number = typography.buttonLabel.fontSize;

  if (size === 'sm') {
    height = 36;
    paddingHorizontal = spacing.md;
    fontSize = 13;
  } else if (size === 'lg') {
    height = 54;
    paddingHorizontal = spacing.xl;
    fontSize = 17;
  }

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor:
            pressed && isInteractive
              ? variant === 'primary'
                ? colors.accentPressed
                : variant === 'secondary'
                ? colors.border
                : backgroundColor
              : backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: radii.md,
          height,
          paddingHorizontal,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.onAccent : colors.accent}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              typography.buttonLabel,
              { color: textColor, fontSize },
              leftIcon ? { marginLeft: spacing.sm } : null,
              rightIcon ? { marginRight: spacing.sm } : null,
              textStyle,
            ]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Accessible touch target
  },
});
