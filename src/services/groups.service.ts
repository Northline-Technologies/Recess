import { pb } from './pocketbase';
import {
  Group,
  GroupMembership,
  Post,
  Comment,
} from '@/types/models';

export const GroupsService = {
  /**
   * Fetch public groups
   */
  async getGroups(page: number = 1, perPage: number = 20): Promise<{
    items: Group[];
    totalItems: number;
    totalPages: number;
  }> {
    const result = await pb.collection('groups').getList(page, perPage, {
      filter: 'status = "active"',
      sort: '-created',
      expand: 'owner,category',
    });

    return {
      items: result.items.map((item: any) => ({
        ...(item as unknown as Group),
        ownerData: item.expand?.owner,
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  },

  /**
   * Fetch single group
   */
  async getGroupById(id: string): Promise<Group> {
    const item: any = await pb.collection('groups').getOne(id, {
      expand: 'owner,category',
    });
    return {
      ...(item as unknown as Group),
      ownerData: item.expand?.owner,
    };
  },

  /**
   * Fetch posts in a group
   */
  async getGroupPosts(groupId: string, page: number = 1, perPage: number = 20): Promise<{
    items: Post[];
    totalItems: number;
    totalPages: number;
  }> {
    const result = await pb.collection('posts').getList(page, perPage, {
      filter: `group = "${groupId}" && status = "published"`,
      sort: '-created',
      expand: 'author',
    });

    return {
      items: result.items.map((item: any) => ({
        ...(item as unknown as Post),
        authorData: item.expand?.author,
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  },

  /**
   * Create a post inside a group
   */
  async createPost(groupId: string, authorId: string, content: string): Promise<Post> {
    const record = await pb.collection('posts').create({
      group: groupId,
      author: authorId,
      content,
      status: 'published',
    });
    return record as unknown as Post;
  },

  /**
   * Fetch comments on a post
   */
  async getPostComments(postId: string): Promise<Comment[]> {
    const records: any[] = await pb.collection('comments').getFullList({
      filter: `post = "${postId}" && status = "published"`,
      sort: 'created',
      expand: 'author',
    });

    return records.map((r) => ({
      ...(r as unknown as Comment),
      authorData: r.expand?.author,
    }));
  },

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, authorId: string, content: string): Promise<Comment> {
    const record = await pb.collection('comments').create({
      post: postId,
      author: authorId,
      content,
      status: 'published',
    });
    return record as unknown as Comment;
  },

  /**
   * Join a group
   */
  async joinGroup(userId: string, groupId: string): Promise<GroupMembership> {
    const record = await pb.collection('group_memberships').create({
      group: groupId,
      user: userId,
      membership_role: 'member',
      status: 'active',
      joined_at: new Date().toISOString(),
    });
    return record as unknown as GroupMembership;
  },
};
