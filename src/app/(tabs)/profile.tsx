import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, ThemePreference } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Badge } from '@/components/ui';
import { checkPocketBaseHealth, POCKETBASE_URL } from '@/services/pocketbase';

export default function ProfileScreen() {
  const { themePreference, setThemePreference, resolvedTheme, colors, spacing, typography, radii } =
    useAppTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const [backendHealth, setBackendHealth] = useState<{
    ok: boolean;
    checked: boolean;
    message?: string;
  }>({ ok: false, checked: false });

  useEffect(() => {
    async function testBackend() {
      const health = await checkPocketBaseHealth();
      setBackendHealth({ ok: health.ok, checked: true, message: health.message });
    }
    testBackend();
  }, []);

  const themeOptions: { key: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'system', label: 'System Default', icon: 'phone-portrait-outline' },
    { key: 'light', label: 'Light', icon: 'sunny-outline' },
    { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.base }]}>
        <Text style={[typography.screenTitle, { color: colors.textPrimary, marginBottom: spacing.lg }]}>
          Profile & Settings
        </Text>

        {/* User Profile Card */}
        <Card style={{ marginBottom: spacing.lg, padding: spacing.lg }}>
          <View style={styles.profileRow}>
            <View
              style={[
                styles.avatarBox,
                { backgroundColor: colors.surfaceSecondary, borderRadius: radii.full },
              ]}>
              <Ionicons name="person" size={32} color={colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>
                {isAuthenticated ? user?.display_name || user?.username : 'Guest Learner'}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                {isAuthenticated ? user?.email : 'Not signed in'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.xs }}>
                <Badge label={isAuthenticated ? 'LEARNER' : 'VISITOR'} variant="accent" />
                {user?.capabilities?.map((cap) => (
                  <Badge key={cap} label={cap.toUpperCase()} variant="secondary" />
                ))}
              </View>
            </View>
          </View>

          {!isAuthenticated ? (
            <Button
              title="Sign In with Google"
              variant="primary"
              style={{ marginTop: spacing.base }}
              onPress={() => router.push('/auth/login')}
            />
          ) : (
            <Button
              title="Sign Out"
              variant="outline"
              style={{ marginTop: spacing.base }}
              onPress={() => signOut()}
            />
          )}
        </Card>

        {/* Appearance & Theme Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
            Appearance
          </Text>
          <Card style={{ padding: 0 }}>
            {themeOptions.map((opt, index) => {
              const isSelected = themePreference === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setThemePreference(opt.key)}
                  style={({ pressed }) => [
                    styles.settingItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: index < themeOptions.length - 1 ? 1 : 0,
                      backgroundColor: pressed ? colors.surfaceSecondary : 'transparent',
                      padding: spacing.base,
                    },
                  ]}>
                  <View style={styles.settingLabelRow}>
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={isSelected ? colors.accent : colors.textSecondary}
                      style={{ marginRight: spacing.md }}
                    />
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
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
                </Pressable>
              );
            })}
          </Card>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 6, marginLeft: 4 }]}>
            Active theme: {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            {themePreference === 'system' ? ' (Following system appearance)' : ''}
          </Text>
        </View>

        {/* Backend & Environment Status */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
            Backend Integration
          </Text>
          <Card style={{ padding: spacing.base }}>
            <View style={styles.statusRow}>
              <View style={{ flex: 1 }}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>PocketBase URL</Text>
                <Text style={[typography.bodySecondary, { color: colors.textPrimary, marginTop: 2 }]}>
                  {POCKETBASE_URL}
                </Text>
              </View>
              <Badge
                label={backendHealth.ok ? 'ONLINE' : 'OFFLINE / UNREACHABLE'}
                variant={backendHealth.ok ? 'success' : 'warning'}
              />
            </View>

            <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopColor: colors.border, borderTopWidth: 1 }}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {backendHealth.ok
                  ? 'Connected to local PocketBase instance.'
                  : 'Backend is offline or not yet started. Run .\\pocketbase.exe serve locally to connect.'}
              </Text>
            </View>
          </Card>
        </View>

        {/* App Info */}
        <View style={{ alignItems: 'center', marginTop: spacing.md }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            SkillShare Platform MVP • v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
