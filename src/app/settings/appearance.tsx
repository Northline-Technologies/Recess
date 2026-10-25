import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, ThemePreference } from '@/context/ThemeContext';
import { Card } from '@/components/ui';

export default function AppearanceScreen() {
  const { themePreference, setThemePreference, resolvedTheme, colors, spacing, typography } =
    useAppTheme();

  const themeOptions: { key: ThemePreference; label: string; description: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    {
      key: 'system',
      label: 'System Default',
      description: 'Automatically match your device appearance settings.',
      icon: 'phone-portrait-outline',
    },
    {
      key: 'light',
      label: 'Light Theme',
      description: 'Clean light background with dark typography and green accents.',
      icon: 'sunny-outline',
    },
    {
      key: 'dark',
      label: 'Dark Theme',
      description: 'Near-black surfaces with high-contrast text for comfortable night viewing.',
      icon: 'moon-outline',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.base }]}>
      <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
        Theme Preference
      </Text>
      <Text style={[typography.bodySecondary, { color: colors.textSecondary, marginBottom: spacing.md }]}>
        Choose how SkillShare looks to you. Changes apply immediately and persist between app launches.
      </Text>

      <Card style={{ padding: 0 }}>
        {themeOptions.map((opt, index) => {
          const isSelected = themePreference === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setThemePreference(opt.key)}
              style={({ pressed }) => [
                styles.optionRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: index < themeOptions.length - 1 ? 1 : 0,
                  backgroundColor: pressed ? colors.surfaceSecondary : 'transparent',
                  padding: spacing.base,
                },
              ]}>
              <Ionicons
                name={opt.icon}
                size={22}
                color={isSelected ? colors.accent : colors.textSecondary}
                style={{ marginRight: spacing.md }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    typography.body,
                    {
                      color: isSelected ? colors.accent : colors.textPrimary,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}>
                  {opt.label}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  {opt.description}
                </Text>
              </View>
              {isSelected && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
            </Pressable>
          );
        })}
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
          Currently active appearance: {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
