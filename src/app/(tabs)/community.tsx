import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { Card, Badge, EmptyState, LoadingState, Button } from '@/components/ui';
import { GroupsService } from '@/services/groups.service';
import { Group } from '@/types/models';

export default function CommunityScreen() {
  const { colors, spacing, typography, radii } = useAppTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await GroupsService.getGroups();
      setGroups(res.items);
    } catch (e) {
      console.warn('Error fetching community groups:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    GroupsService.getGroups()
      .then((res) => {
        if (active) setGroups(res.items);
      })
      .catch((e) => {
        console.warn('Error fetching community groups:', e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.base, paddingTop: spacing.sm }]}>
        <View style={styles.headerRow}>
          <Text style={[typography.screenTitle, { color: colors.textPrimary }]}>
            Community
          </Text>
          <Button
            title="Explore"
            size="sm"
            variant="outline"
            onPress={() => router.push('/(tabs)/explore')}
          />
        </View>
        <Text style={[typography.bodySecondary, { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.md }]}>
          Collaborate with peers, ask questions, and share learning resources.
        </Text>
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
          <LoadingState message="Loading community discussions..." />
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <Card
              key={group.id}
              style={{ marginBottom: spacing.md }}
              onPress={() => router.push(`/group/${group.id}`)}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.groupIconBox,
                    { backgroundColor: colors.surfaceSecondary, borderRadius: radii.full },
                  ]}>
                  <Ionicons name="people" size={24} color={colors.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={[typography.cardTitle, { color: colors.textPrimary }]}>
                    {group.name}
                  </Text>
                  <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {group.privacy === 'public' ? 'Public Community' : 'Private Group'}
                  </Text>
                </View>
                <Badge label={group.privacy.toUpperCase()} variant="secondary" />
              </View>

              {group.description && (
                <Text
                  numberOfLines={2}
                  style={[typography.bodySecondary, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                  {group.description}
                </Text>
              )}
            </Card>
          ))
        ) : (
          <Card style={{ padding: spacing.lg }}>
            <EmptyState
              iconName="people-outline"
              title="No Communities Found"
              description="Be the first to join or explore topic-based study groups."
              actionTitle="Discover Groups"
              onAction={() => router.push('/(tabs)/explore')}
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
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIconBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
