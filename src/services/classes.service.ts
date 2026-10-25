import { pb } from './pocketbase';
import {
  ClassRoom,
  ClassMembership,
  ClassAnnouncement,
  Assignment,
} from '@/types/models';

export const ClassesService = {
  /**
   * Fetch open/active classes
   */
  async getClasses(page: number = 1, perPage: number = 20): Promise<{
    items: ClassRoom[];
    totalItems: number;
    totalPages: number;
  }> {
    const result = await pb.collection('classes').getList(page, perPage, {
      filter: 'status = "open" || status = "active"',
      sort: '-created',
      expand: 'teacher,course',
    });

    return {
      items: result.items.map((item: any) => ({
        ...(item as unknown as ClassRoom),
        teacherData: item.expand?.teacher,
        courseData: item.expand?.course,
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  },

  /**
   * Fetch single class details
   */
  async getClassById(id: string): Promise<ClassRoom> {
    const item: any = await pb.collection('classes').getOne(id, {
      expand: 'teacher,course',
    });
    return {
      ...(item as unknown as ClassRoom),
      teacherData: item.expand?.teacher,
      courseData: item.expand?.course,
    };
  },

  /**
   * Fetch user's class memberships
   */
  async getUserClasses(userId: string): Promise<ClassMembership[]> {
    const records: any[] = await pb.collection('class_memberships').getFullList({
      filter: `user = "${userId}" && status = "active"`,
      expand: 'class,class.teacher',
      sort: '-joined_at',
    });

    return records.map((r) => ({
      ...(r as unknown as ClassMembership),
      classData: r.expand?.class,
    }));
  },

  /**
   * Join an open class
   */
  async joinClass(userId: string, classId: string): Promise<ClassMembership> {
    const record = await pb.collection('class_memberships').create({
      class: classId,
      user: userId,
      status: 'active',
      joined_at: new Date().toISOString(),
    });
    return record as unknown as ClassMembership;
  },

  /**
   * Fetch announcements for a class
   */
  async getAnnouncements(classId: string): Promise<ClassAnnouncement[]> {
    const records: any[] = await pb.collection('class_announcements').getFullList({
      filter: `class = "${classId}" && status = "published"`,
      sort: '-published_at',
      expand: 'author',
    });

    return records.map((r) => ({
      ...(r as unknown as ClassAnnouncement),
      authorData: r.expand?.author,
    }));
  },

  /**
   * Fetch assignments for a class
   */
  async getAssignments(classId: string): Promise<Assignment[]> {
    const records = await pb.collection('assignments').getFullList({
      filter: `class = "${classId}" && status = "published"`,
      sort: 'due_at',
    });
    return records as unknown as Assignment[];
  },
};
