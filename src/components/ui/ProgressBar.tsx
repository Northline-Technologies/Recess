import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  style?: StyleProp<ViewStyle>;
  height?: number;
}

export function ProgressBar({ progress, style, height = 6 }: ProgressBarProps) {
  const { colors, radii } = useAppTheme();

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: colors.surfaceSecondary,
          borderRadius: radii.full,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            height,
            backgroundColor: colors.accent,
            borderRadius: radii.full,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
