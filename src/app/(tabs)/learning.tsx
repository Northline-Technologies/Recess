import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, ProgressBar, EmptyState, LoadingState } from '@/components/ui';
import { CoursesService } from '@/services/courses.service';
import { ClassesService } from '@/services/classes.service';
import { CourseEnrollment, ClassMembership } from '@/types/models';

type LearningTab = 'courses' | 'classes' | 'assignments';

export default function MyLearningScreen() {
  const { colors, spacing, typography, radii } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<LearningTab>('courses');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [classMemberships, setClassMemberships] = useState<ClassMembership[]>([]);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const [enrollRes, classRes] = await Promise.allSettled([
        CoursesService.getUserEnrollments(user.id),
        ClassesService.getUserClasses(user.id),
      ]);

      if (enrollRes.status === 'fulfilled') setEnrollments(enrollRes.value);
      if (classRes.status === 'fulfilled') setClassMemberships(classRes.value);
    } catch (e) {
      console.warn('Error fetching learning records:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    let active = true;

    Promise.allSettled([
      CoursesService.getUserEnrollments(user.id),
      ClassesService.getUserClasses(user.id),
    ]).then(([enrollRes, classRes]) => {
      if (!active) return;
      if (enrollRes.status === 'fulfilled') setEnrollments(enrollRes.value);
      if (classRes.status === 'fulfilled') setClassMemberships(classRes.value);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated, user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.base, paddingTop: spacing.sm }]}>
        <Text style={[typography.screenTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
          My Learning
        </Text>

        {/* Tab Segment Controls */}
        <View
          style={[
            styles.segmentContainer,
            { backgroundColor: colors.surfaceSecondary, borderRadius: radii.md, padding: 4 },
          ]}>
          {(['courses', 'classes', 'assignments'] as LearningTab[]).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.segmentButton,
                  {
                    backgroundColor: isSelected ? colors.surface : 'transparent',
                    borderRadius: radii.sm,
                  },
                ]}>
                <Text
                  style={[
                    typography.buttonLabel,
                    {
                      fontSize: 13,
                      color: isSelected ? colors.textPrimary : colors.textSecondary,
                    },
                  ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.base }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }>
        {!isAuthenticated ? (
          <Card style={{ padding: spacing.lg }}>
            <EmptyState
              iconName="lock-closed-outline"
              title="Sign In to Track Learning"
              description="Sign in to your SkillShare account to view your enrolled courses, classes, and progress."
              actionTitle="Sign In"
              onAction={() => router.push('/auth/login')}
            />
          </Card>
        ) : loading ? (
          <LoadingState message="Loading your learning workspace..." />
        ) : activeTab === 'courses' ? (
          enrollments.length > 0 ? (
            enrollments.map((item) => (
              <Card
                key={item.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/course/${item.course}`)}>
                <View style={styles.cardHeader}>
                  <Badge
                    label={item.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                    variant={item.status === 'completed' ? 'success' : 'accent'}
                  />
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    Enrolled {new Date(item.enrolled_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    typography.cardTitle,
                    { color: colors.textPrimary, marginTop: spacing.xs, marginBottom: spacing.xs },
                  ]}>
                  {item.courseData?.title || 'Course'}
                </Text>
                <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
                  <View style={styles.progressRow}>
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                      Completion
                    </Text>
                    <Text style={[typography.caption, { color: colors.accent, fontWeight: '600' }]}>
                      {item.progress_percent}%
                    </Text>
                  </View>
                  <ProgressBar progress={item.progress_percent} />
                </View>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.lg }}>
              <EmptyState
                iconName="book-outline"
                title="No Enrolled Courses"
                description="Browse courses in our catalog and start learning now."
                actionTitle="Explore Courses"
                onAction={() => router.push('/(tabs)/explore')}
              />
            </Card>
          )
        ) : activeTab === 'classes' ? (
          classMemberships.length > 0 ? (
            classMemberships.map((membership) => (
              <Card
                key={membership.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/class/${membership.class}`)}>
                <View style={styles.cardHeader}>
                  <Badge label="ENROLLED" variant="accent" />
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>Active Cohort</Text>
                </View>
                <Text
                  style={[
                    typography.cardTitle,
                    { color: colors.textPrimary, marginTop: spacing.xs },
                  ]}>
                  {membership.classData?.title || 'Classroom'}
                </Text>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.lg }}>
              <EmptyState
                iconName="school-outline"
                title="No Enrolled Classes"
                description="Join structured cohorts led by teachers with assignments and live sessions."
                actionTitle="Find Classes"
                onAction={() => router.push('/(tabs)/explore')}
              />
            </Card>
          )
        ) : (
          <Card style={{ padding: spacing.lg }}>
            <EmptyState
              iconName="clipboard-outline"
              title="No Pending Assignments"
              description="When teachers post assignments in your classrooms, they will show up here."
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingBottom: 8,
  },
  segmentContainer: {
    flexDirection: 'row',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
