import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/theme/tokens';

export type ThemedTextVariant =
  | 'display'
  | 'screenTitle'
  | 'sectionTitle'
  | 'cardTitle'
  | 'body'
  | 'bodySecondary'
  | 'caption'
  | 'buttonLabel'
  | 'link'
  | 'default'
  | 'title'
  | 'subtitle'
  | 'small';

export interface ThemedTextProps extends TextProps {
  variant?: ThemedTextVariant;
  color?: keyof ThemeColors;
}

export function ThemedText({
  style,
  variant = 'body',
  color = 'textPrimary',
  children,
  ...rest
}: ThemedTextProps) {
  const { colors, typography } = useAppTheme();

  const textColor = colors[color] || colors.textPrimary;

  let variantStyle: any = typography.body;
  switch (variant) {
    case 'display':
      variantStyle = typography.display;
      break;
    case 'screenTitle':
    case 'title':
      variantStyle = typography.screenTitle;
      break;
    case 'sectionTitle':
    case 'subtitle':
      variantStyle = typography.sectionTitle;
      break;
    case 'cardTitle':
      variantStyle = typography.cardTitle;
      break;
    case 'body':
    case 'default':
      variantStyle = typography.body;
      break;
    case 'bodySecondary':
    case 'small':
      variantStyle = typography.bodySecondary;
      break;
    case 'caption':
      variantStyle = typography.caption;
      break;
    case 'buttonLabel':
      variantStyle = typography.buttonLabel;
      break;
    case 'link':
      variantStyle = [typography.body, { color: colors.accent, textDecorationLine: 'underline' }];
      break;
  }

  return (
    <Text style={[{ color: textColor }, variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
}
