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
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { Input, Card, Badge, LoadingState } from '@/components/ui';
import { CoursesService } from '@/services/courses.service';
import { ClassesService } from '@/services/classes.service';
import { GroupsService } from '@/services/groups.service';
import { Course, ClassRoom, Group } from '@/types/models';

type ExploreTab = 'all' | 'courses' | 'classes' | 'groups';

export default function ExploreScreen() {
  const { colors, spacing, typography, radii } = useAppTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ExploreTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchExploreData = useCallback(async () => {
    try {
      const [coursesRes, classesRes, groupsRes] = await Promise.allSettled([
        CoursesService.getCourses({ search: searchQuery }),
        ClassesService.getClasses(),
        GroupsService.getGroups(),
      ]);

      if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value.items);
      if (classesRes.status === 'fulfilled') setClasses(classesRes.value.items);
      if (groupsRes.status === 'fulfilled') setGroups(groupsRes.value.items);
    } catch (e) {
      console.warn('Error fetching explore items:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      CoursesService.getCourses({ search: searchQuery }),
      ClassesService.getClasses(),
      GroupsService.getGroups(),
    ]).then(([coursesRes, classesRes, groupsRes]) => {
      if (!active) return;
      if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value.items);
      if (classesRes.status === 'fulfilled') setClasses(classesRes.value.items);
      if (groupsRes.status === 'fulfilled') setGroups(groupsRes.value.items);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchExploreData();
  };

  const tabs: { key: ExploreTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'courses', label: 'Courses' },
    { key: 'classes', label: 'Classes' },
    { key: 'groups', label: 'Groups' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.base, paddingTop: spacing.sm }]}>
        <Text style={[typography.screenTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
          Explore
        </Text>

        {/* Search Bar */}
        <Input
          placeholder="Search courses, classes, groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          rightIcon={
            searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </Pressable>
            ) : null
          }
        />

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabList, { marginVertical: spacing.md }]}>
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                    borderRadius: radii.full,
                    marginRight: spacing.sm,
                  },
                ]}>
                <Text
                  style={[
                    typography.buttonLabel,
                    {
                      fontSize: 13,
                      color: isSelected ? colors.onAccent : colors.textSecondary,
                    },
                  ]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
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
        {loading ? (
          <LoadingState message="Searching learning materials..." />
        ) : (
          <>
            {/* Courses Section */}
            {(activeTab === 'all' || activeTab === 'courses') && (
              <View style={{ marginBottom: spacing.xl }}>
                <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
                  Courses
                </Text>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Card
                      key={course.id}
                      style={{ marginBottom: spacing.md }}
                      onPress={() => router.push(`/course/${course.id}`)}>
                      <View style={styles.cardHeader}>
                        <Badge label={course.difficulty.toUpperCase()} variant="secondary" />
                        <Badge label="Self-Paced" variant="outline" />
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
                        style={[typography.bodySecondary, { color: colors.textSecondary }]}>
                        {course.description}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <Card style={{ padding: spacing.md }}>
                    <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                      No courses match your query.
                    </Text>
                  </Card>
                )}
              </View>
            )}

            {/* Classes Section */}
            {(activeTab === 'all' || activeTab === 'classes') && (
              <View style={{ marginBottom: spacing.xl }}>
                <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
                  Cohorts & Classes
                </Text>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <Card
                      key={cls.id}
                      style={{ marginBottom: spacing.md }}
                      onPress={() => router.push(`/class/${cls.id}`)}>
                      <View style={styles.cardHeader}>
                        <Badge label={cls.status.toUpperCase()} variant="accent" />
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                          Cohort Class
                        </Text>
                      </View>
                      <Text
                        style={[
                          typography.cardTitle,
                          { color: colors.textPrimary, marginTop: spacing.xs, marginBottom: spacing.xs },
                        ]}>
                        {cls.title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[typography.bodySecondary, { color: colors.textSecondary }]}>
                        {cls.description || 'Guided cohort with teacher assessments and live sessions.'}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <Card style={{ padding: spacing.md }}>
                    <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                      No active classes found.
                    </Text>
                  </Card>
                )}
              </View>
            )}

            {/* Groups Section */}
            {(activeTab === 'all' || activeTab === 'groups') && (
              <View style={{ marginBottom: spacing.xl }}>
                <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
                  Communities & Groups
                </Text>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <Card
                      key={group.id}
                      style={{ marginBottom: spacing.md }}
                      onPress={() => router.push(`/group/${group.id}`)}>
                      <View style={styles.cardHeader}>
                        <Badge label={group.privacy.toUpperCase()} variant="outline" />
                      </View>
                      <Text
                        style={[
                          typography.cardTitle,
                          { color: colors.textPrimary, marginTop: spacing.xs, marginBottom: spacing.xs },
                        ]}>
                        {group.name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[typography.bodySecondary, { color: colors.textSecondary }]}>
                        {group.description || 'Join community discussion and share learning resources.'}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <Card style={{ padding: spacing.md }}>
                    <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                      No community groups found.
                    </Text>
                  </Card>
                )}
              </View>
            )}
          </>
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
    paddingBottom: 4,
  },
  tabList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  content: {
    paddingBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
