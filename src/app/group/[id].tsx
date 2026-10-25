import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Button, Input, LoadingState, EmptyState } from '@/components/ui';
import { GroupsService } from '@/services/groups.service';
import { Group, Post } from '@/types/models';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, typography } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function loadGroup() {
      if (!id) return;
      try {
        const [g, p] = await Promise.allSettled([
          GroupsService.getGroupById(id),
          GroupsService.getGroupPosts(id),
        ]);
        if (g.status === 'fulfilled') setGroup(g.value);
        if (p.status === 'fulfilled') setPosts(p.value.items);
      } catch (e) {
        console.warn('Error loading group:', e);
      } finally {
        setLoading(false);
      }
    }
    loadGroup();
  }, [id]);

  const handleCreatePost = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }
    if (!id || !newPostContent.trim()) return;

    setPosting(true);
    try {
      const created = await GroupsService.createPost(id, user.id, newPostContent.trim());
      setPosts([created, ...posts]);
      setNewPostContent('');
    } catch (e) {
      console.warn('Post error:', e);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading community group..." />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { padding: spacing.base }]}>
      {group ? (
        <>
          <View style={{ marginBottom: spacing.md }}>
            <Badge label={group.privacy.toUpperCase()} variant="secondary" />
            <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: spacing.sm }]}>
              {group.name}
            </Text>
            {group.description && (
              <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
                {group.description}
              </Text>
            )}
          </View>

          {/* New Post Composer */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.cardTitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
              Share an update or question
            </Text>
            <Input
              placeholder="What are you learning or working on?"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={3}
              style={{ minHeight: 60 }}
            />
            <Button
              title="Post to Group"
              size="sm"
              loading={posting}
              disabled={!newPostContent.trim()}
              onPress={handleCreatePost}
              style={{ marginTop: spacing.sm, alignSelf: 'flex-end' }}
            />
          </Card>

          {/* Group Feed */}
          <Text style={[typography.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
            Discussions ({posts.length})
          </Text>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} style={{ marginBottom: spacing.sm }}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {post.authorData?.display_name || post.authorData?.username || 'Community Member'} •{' '}
                  {new Date(post.created).toLocaleDateString()}
                </Text>
                <Text style={[typography.body, { color: colors.textPrimary, marginTop: 4 }]}>
                  {post.content}
                </Text>
              </Card>
            ))
          ) : (
            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: 'center' }]}>
                No posts yet. Start the conversation!
              </Text>
            </Card>
          )}
        </>
      ) : (
        <EmptyState
          title="Group Not Found"
          description="The requested community group could not be loaded."
          actionTitle="Back to Community"
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
