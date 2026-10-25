import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Button, LoadingState, EmptyState } from '@/components/ui';
import { ClassesService } from '@/services/classes.service';
import { ClassRoom, ClassAnnouncement, Assignment } from '@/types/models';

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, typography } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [announcements, setAnnouncements] = useState<ClassAnnouncement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    async function loadClass() {
      if (!id) return;
      try {
        const [c, a, asg] = await Promise.allSettled([
          ClassesService.getClassById(id),
          ClassesService.getAnnouncements(id),
          ClassesService.getAssignments(id),
        ]);
        if (c.status === 'fulfilled') setClassRoom(c.value);
        if (a.status === 'fulfilled') setAnnouncements(a.value);
        if (asg.status === 'fulfilled') setAssignments(asg.value);
      } catch (e) {
        console.warn('Error loading class:', e);
      } finally {
        setLoading(false);
      }
    }
    loadClass();
  }, [id]);

  const handleJoin = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }
    if (!id) return;

    setJoining(true);
    try {
      await ClassesService.joinClass(user.id, id);
      setJoined(true);
    } catch (e) {
      console.warn('Join class error:', e);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading classroom..." />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { padding: spacing.base }]}>
      {classRoom ? (
        <>
          <View style={{ marginBottom: spacing.md }}>
            <Badge label={classRoom.status.toUpperCase()} variant="accent" />
            <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: spacing.sm }]}>
              {classRoom.title}
            </Text>
            {classRoom.teacherData && (
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                Teacher: {classRoom.teacherData.display_name || classRoom.teacherData.username}
              </Text>
            )}
          </View>

          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.cardTitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Classroom Overview
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {classRoom.description || 'Welcome to this cohort classroom. Access announcements, assignments, and sessions.'}
            </Text>
          </Card>

          <Button
            title={joined ? 'Member — Enter Classroom' : 'Join Cohort Class'}
            variant={joined ? 'secondary' : 'primary'}
            loading={joining}
            onPress={handleJoin}
            style={{ marginBottom: spacing.xl }}
          />

          {/* Announcements */}
          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
            Announcements ({announcements.length})
          </Text>
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <Card key={ann.id} style={{ marginBottom: spacing.sm }}>
                <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>{ann.title}</Text>
                <Text style={[typography.bodySecondary, { color: colors.textSecondary, marginTop: 4 }]}>
                  {ann.body}
                </Text>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.md, marginBottom: spacing.lg }}>
              <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                No announcements posted yet.
              </Text>
            </Card>
          )}

          {/* Assignments */}
          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
            Assignments ({assignments.length})
          </Text>
          {assignments.length > 0 ? (
            assignments.map((asg) => (
              <Card key={asg.id} style={{ marginBottom: spacing.sm }}>
                <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>{asg.title}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  Max Points: {asg.max_points} {asg.due_at ? `• Due ${new Date(asg.due_at).toLocaleDateString()}` : ''}
                </Text>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                No assignments assigned yet.
              </Text>
            </Card>
          )}
        </>
      ) : (
        <EmptyState
          title="Classroom Not Found"
          description="The requested class could not be loaded or is closed."
          actionTitle="Back to Explore"
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
