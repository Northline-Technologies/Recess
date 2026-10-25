import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Input } from '@/components/ui';

export default function LoginScreen() {
  const { colors, spacing, typography, radii } = useAppTheme();
  const { signInWithGoogle, signInWithPassword } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dev login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.back();
    } catch (e: any) {
      setError(e.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithPassword(email.trim(), password);
      router.back();
    } catch (e: any) {
      setError(e.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { padding: spacing.base }]}>
      <View style={{ alignItems: 'center', marginVertical: spacing.xl }}>
        <View
          style={[
            styles.logoBox,
            { backgroundColor: colors.surfaceSecondary, borderRadius: radii.full },
          ]}>
          <Ionicons name="school" size={40} color={colors.accent} />
        </View>
        <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: spacing.md }]}>
          SkillShare
        </Text>
        <Text style={[typography.bodySecondary, { color: colors.textSecondary, marginTop: 4, textAlign: 'center' }]}>
          Sign in to access your courses, classroom cohorts, assignments, and study groups.
        </Text>
      </View>

      {error && (
        <Card style={{ backgroundColor: colors.surfaceSecondary, borderColor: colors.error, marginBottom: spacing.md }}>
          <Text style={[typography.bodySecondary, { color: colors.error, textAlign: 'center' }]}>
            {error}
          </Text>
        </Card>
      )}

      {/* Google OAuth (Primary Auth Provider) */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.cardTitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
          Social Authentication
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.md }]}>
          Fast and secure authentication using your Google Account.
        </Text>
        <Button
          title="Continue with Google"
          variant="primary"
          loading={loading}
          onPress={handleGoogleSignIn}
          leftIcon={<Ionicons name="logo-google" size={18} color={colors.onAccent} />}
        />
      </Card>

      {/* Developer / Direct Sign-In */}
      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.cardTitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
          Local Developer Testing
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.md }]}>
          Use a pre-configured PocketBase user account for local testing.
        </Text>
        <Input
          label="Email Address"
          placeholder="learner@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          containerStyle={{ marginBottom: spacing.md }}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          containerStyle={{ marginBottom: spacing.md }}
        />
        <Button
          title="Sign In with Credentials"
          variant="secondary"
          loading={loading}
          onPress={handleDevSignIn}
        />
      </Card>

      <Button
        title="Cancel and Browse as Guest"
        variant="ghost"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  logoBox: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
