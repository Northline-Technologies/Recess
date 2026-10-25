import { pb } from './pocketbase';
import {
  Course,
  Lesson,
  CourseEnrollment,
  LessonProgress,
  SavedCourse,
} from '@/types/models';

export interface CourseFilterParams {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export const CoursesService = {
  /**
   * Fetch published courses with optional filtering and pagination
   */
  async getCourses(params: CourseFilterParams = {}): Promise<{
    items: Course[];
    totalItems: number;
    totalPages: number;
  }> {
    const { category, difficulty, search, page = 1, perPage = 20 } = params;

    const filterClauses: string[] = ['status = "published"'];
    if (category) filterClauses.push(`category = "${category}"`);
    if (difficulty) filterClauses.push(`difficulty = "${difficulty}"`);
    if (search) filterClauses.push(`(title ~ "${search}" || description ~ "${search}")`);

    const result = await pb.collection('courses').getList(page, perPage, {
      filter: filterClauses.join(' && '),
      sort: '-created',
      expand: 'creator,category',
    });

    return {
      items: result.items.map((item: any) => ({
        ...(item as unknown as Course),
        creatorData: item.expand?.creator,
        categoryData: item.expand?.category,
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  },

  /**
   * Fetch a single course by ID or slug
   */
  async getCourseById(id: string): Promise<Course> {
    const item: any = await pb.collection('courses').getOne(id, {
      expand: 'creator,category',
    });
    return {
      ...(item as unknown as Course),
      creatorData: item.expand?.creator,
      categoryData: item.expand?.category,
    };
  },

  /**
   * Fetch lessons belonging to a course ordered by position
   */
  async getLessons(courseId: string): Promise<Lesson[]> {
    const records = await pb.collection('lessons').getFullList({
      filter: `course = "${courseId}" && status = "published"`,
      sort: 'position',
    });
    return records as unknown as Lesson[];
  },

  /**
   * Get active enrollments for a user
   */
  async getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
    const records: any[] = await pb.collection('course_enrollments').getFullList({
      filter: `user = "${userId}"`,
      expand: 'course,course.creator',
      sort: '-enrolled_at',
    });

    return records.map((r) => ({
      ...(r as unknown as CourseEnrollment),
      courseData: r.expand?.course,
    }));
  },

  /**
   * Enroll a user into a course
   */
  async enrollInCourse(userId: string, courseId: string): Promise<CourseEnrollment> {
    const record = await pb.collection('course_enrollments').create({
      user: userId,
      course: courseId,
      status: 'active',
      progress_percent: 0,
      enrolled_at: new Date().toISOString(),
    });
    return record as unknown as CourseEnrollment;
  },

  /**
   * Record or update progress for a lesson
   */
  async updateLessonProgress(
    userId: string,
    lessonId: string,
    completed: boolean,
    lastPositionSeconds: number = 0
  ): Promise<LessonProgress> {
    try {
      // Find existing record if one exists
      const existing = await pb
        .collection('lesson_progress')
        .getFirstListItem(`user = "${userId}" && lesson = "${lessonId}"`);

      const updated = await pb.collection('lesson_progress').update(existing.id, {
        completed,
        last_position_seconds: lastPositionSeconds,
      });
      return updated as unknown as LessonProgress;
    } catch {
      // Create new progress record
      const created = await pb.collection('lesson_progress').create({
        user: userId,
        lesson: lessonId,
        completed,
        last_position_seconds: lastPositionSeconds,
      });
      return created as unknown as LessonProgress;
    }
  },

  /**
   * Fetch user's saved/bookmarked courses
   */
  async getSavedCourses(userId: string): Promise<SavedCourse[]> {
    const records: any[] = await pb.collection('saved_courses').getFullList({
      filter: `user = "${userId}"`,
      expand: 'course,course.creator',
      sort: '-created',
    });
    return records.map((r) => ({
      ...(r as unknown as SavedCourse),
      courseData: r.expand?.course,
    }));
  },
};
