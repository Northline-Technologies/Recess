import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Badge, ProgressBar, EmptyState, LoadingState } from '@/components/ui';
import { CoursesService } from '@/services/courses.service';
import { SessionsService } from '@/services/sessions.service';
import { Course, Session } from '@/types/models';

export default function HomeScreen() {
  const { colors, spacing, typography, radii } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);

  const loadHomeData = useCallback(async () => {
    try {
      const [coursesRes, sessionsRes] = await Promise.allSettled([
        CoursesService.getCourses({ perPage: 3 }),
        SessionsService.getUpcomingSessions(2),
      ]);

      if (coursesRes.status === 'fulfilled') {
        setFeaturedCourses(coursesRes.value.items);
      }
      if (sessionsRes.status === 'fulfilled') {
        setUpcomingSessions(sessionsRes.value);
      }
    } catch (e) {
      console.warn('Error loading home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      CoursesService.getCourses({ perPage: 3 }),
      SessionsService.getUpcomingSessions(2),
    ])
      .then(([coursesRes, sessionsRes]) => {
        if (!active) return;
        if (coursesRes.status === 'fulfilled') {
          setFeaturedCourses(coursesRes.value.items);
        }
        if (sessionsRes.status === 'fulfilled') {
          setUpcomingSessions(sessionsRes.value);
        }
      })
      .catch((e) => {
        console.warn('Error loading home data:', e);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
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
        {/* Header Greeting */}
        <View style={[styles.header, { marginBottom: spacing.lg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
            <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: 2 }]}>
              {isAuthenticated ? `Welcome back, ${user?.display_name || user?.username || 'Learner'}` : 'Welcome to SkillShare'}
            </Text>
          </View>
          {!isAuthenticated && (
            <Button
              title="Sign In"
              size="sm"
              variant="outline"
              onPress={() => router.push('/auth/login')}
            />
          )}
        </View>

        {/* Continue Learning Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={[styles.sectionRow, { marginBottom: spacing.md }]}>
            <Text style={[typography.sectionTitle, { color: colors.textPrimary }]}>
              Continue Learning
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/learning')}>
              <Text style={[typography.caption, { color: colors.accent, fontWeight: '600' }]}>
                View all
              </Text>
            </Pressable>
          </View>

          {loading ? (
            <LoadingState message="Loading courses..." />
          ) : featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <Card
                key={course.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/course/${course.id}`)}>
                <View style={styles.courseHeader}>
                  <Badge label={course.difficulty.toUpperCase()} variant="secondary" />
                  {course.estimated_minutes && (
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                      {course.estimated_minutes} mins
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    typography.cardTitle,
                    { color: colors.textPrimary, marginTop: spacing.xs, marginBottom: spacing.xs },
                  ]}>
                  {course.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[typography.bodySecondary, { color: colors.textSecondary, marginBottom: spacing.md }]}>
                  {course.description}
                </Text>
                <View style={{ gap: spacing.xs }}>
                  <View style={styles.progressRow}>
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>Progress</Text>
                    <Text style={[typography.caption, { color: colors.accent, fontWeight: '600' }]}>
                      0%
                    </Text>
                  </View>
                  <ProgressBar progress={0} />
                </View>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.lg }}>
              <EmptyState
                iconName="book-outline"
                title="No active courses yet"
                description="Explore our curated catalog and start mastering a new skill today."
                actionTitle="Explore Courses"
                onAction={() => router.push('/(tabs)/explore')}
              />
            </Card>
          )}
        </View>

        {/* Upcoming Sessions Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={[styles.sectionRow, { marginBottom: spacing.md }]}>
            <Text style={[typography.sectionTitle, { color: colors.textPrimary }]}>
              Upcoming Live Sessions
            </Text>
          </View>

          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <Card
                key={session.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/session/${session.id}`)}>
                <View style={styles.sessionRow}>
                  <View
                    style={[
                      styles.calendarBox,
                      { backgroundColor: colors.surfaceSecondary, borderRadius: radii.md },
                    ]}>
                    <Ionicons name="videocam" size={24} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>
                      {session.title}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                      {new Date(session.start_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  </View>
                  <Badge label="Online" variant="accent" />
                </View>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.base }}>
              <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                No scheduled sessions right now. Check back later!
              </Text>
            </Card>
          )}
        </View>

        {/* Community & Quick Actions */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
            Community & Collaboration
          </Text>
          <Card
            onPress={() => router.push('/(tabs)/community')}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.communityIconBox,
                { backgroundColor: colors.surfaceSecondary, borderRadius: radii.full, marginRight: spacing.md },
              ]}>
              <Ionicons name="people" size={26} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>
                Join Learning Groups
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                Connect with peers, share notes, and discuss assignments.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityIconBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
