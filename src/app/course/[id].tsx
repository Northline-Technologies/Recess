import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Button, LoadingState, EmptyState } from '@/components/ui';
import { CoursesService } from '@/services/courses.service';
import { Course, Lesson } from '@/types/models';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, typography } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      if (!id) return;
      try {
        const [c, l] = await Promise.allSettled([
          CoursesService.getCourseById(id),
          CoursesService.getLessons(id),
        ]);
        if (c.status === 'fulfilled') setCourse(c.value);
        if (l.status === 'fulfilled') setLessons(l.value);
      } catch (e) {
        console.warn('Error loading course:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }
    if (!id) return;

    setEnrolling(true);
    try {
      await CoursesService.enrollInCourse(user.id, id);
      setEnrolled(true);
    } catch (e) {
      console.warn('Enrollment error:', e);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading course curriculum..." />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { padding: spacing.base }]}>
      {course ? (
        <>
          <View style={{ marginBottom: spacing.md }}>
            <Badge label={course.difficulty.toUpperCase()} variant="secondary" />
            <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: spacing.sm }]}>
              {course.title}
            </Text>
            {course.creatorData && (
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                Created by {course.creatorData.display_name || course.creatorData.username}
              </Text>
            )}
          </View>

          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.cardTitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              About this course
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {course.description}
            </Text>
          </Card>

          <Button
            title={enrolled ? 'Enrolled — Start Learning' : 'Enroll in Course'}
            variant={enrolled ? 'secondary' : 'primary'}
            loading={enrolling}
            onPress={handleEnroll}
            style={{ marginBottom: spacing.xl }}
          />

          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
            Course Syllabus ({lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'})
          </Text>

          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <Card key={lesson.id} style={{ marginBottom: spacing.sm }}>
                <View style={styles.lessonRow}>
                  <Text style={[typography.buttonLabel, { color: colors.accent, marginRight: spacing.md }]}>
                    {index + 1}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>
                      {lesson.title}
                    </Text>
                    {lesson.estimated_minutes && (
                      <Text style={[typography.caption, { color: colors.textSecondary }]}>
                        {lesson.estimated_minutes} min
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                Lessons for this course will appear here once published.
              </Text>
            </Card>
          )}
        </>
      ) : (
        <EmptyState
          title="Course Not Found"
          description="The requested course could not be loaded or has been unpublished."
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
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
