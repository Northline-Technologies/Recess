import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { Card, Badge, Button, LoadingState, EmptyState } from '@/components/ui';
import { SessionsService } from '@/services/sessions.service';
import { Session } from '@/types/models';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, typography } = useAppTheme();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      if (!id) return;
      try {
        const s = await SessionsService.getSessionById(id);
        setSession(s);
      } catch (e) {
        console.warn('Error loading session:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id]);

  const handleJoinMeeting = () => {
    if (session?.meeting_url) {
      Linking.openURL(session.meeting_url).catch(() => {
        alert('Could not open meeting link');
      });
    }
  };

  if (loading) {
    return <LoadingState message="Loading session details..." />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { padding: spacing.base }]}>
      {session ? (
        <>
          <View style={{ marginBottom: spacing.md }}>
            <Badge label={session.session_type.toUpperCase()} variant="accent" />
            <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: spacing.sm }]}>
              {session.title}
            </Text>
            {session.hostData && (
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                Hosted by {session.hostData.display_name || session.hostData.username}
              </Text>
            )}
          </View>

          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.cardTitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Schedule
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Start: {new Date(session.start_at).toLocaleString()}
            </Text>
            {session.end_at && (
              <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
                End: {new Date(session.end_at).toLocaleString()}
              </Text>
            )}
            {session.description && (
              <Text style={[typography.body, { color: colors.textPrimary, marginTop: spacing.md }]}>
                {session.description}
              </Text>
            )}
          </Card>

          {session.meeting_url ? (
            <Button
              title="Join Online Session"
              variant="primary"
              onPress={handleJoinMeeting}
            />
          ) : (
            <Button
              title="Meeting Link Unavailable"
              variant="secondary"
              disabled
              onPress={() => {}}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="Session Not Found"
          description="The requested live session could not be loaded."
          actionTitle="Back"
          onAction={() => router.back()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
});
