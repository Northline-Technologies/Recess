import React, { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppTheme } from '@/context/ThemeContext';

export function Collapsible({ children, title }: PropsWithChildren<{ title: string }>) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, spacing, radii } = useAppTheme();

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [styles.heading, { gap: spacing.sm }, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}>
        <View
          style={[
            styles.button,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radii.sm,
            },
          ]}>
          <Ionicons
            name={isOpen ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={colors.textPrimary}
          />
        </View>

        <ThemedText variant="body" style={{ fontWeight: '600' }}>
          {title}
        </ThemedText>
      </Pressable>
      {isOpen && (
        <ThemedView
          color="surfaceSecondary"
          style={[
            styles.content,
            {
              marginTop: spacing.sm,
              borderRadius: radii.md,
              marginLeft: spacing.lg,
              padding: spacing.md,
            },
          ]}>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {},
});
