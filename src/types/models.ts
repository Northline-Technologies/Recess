/**
 * SkillShare Domain Models
 * Source of truth: 06_DATA_MODEL.md
 */

export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
}

export type UserCapability = 'learner' | 'creator' | 'teacher';

export interface User extends BaseRecord {
  email: string;
  username: string;
  display_name: string;
  avatar?: string;
  bio?: string;
  capabilities?: UserCapability[];
  onboarding_completed: boolean;
}

export interface Category extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
}

export interface Skill extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course extends BaseRecord {
  creator: string;
  creatorData?: User;
  category?: string;
  categoryData?: Category;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  difficulty: CourseDifficulty;
  estimated_minutes?: number;
  status: CourseStatus;
  price_amount?: number;
  currency?: string;
}

export type LessonStatus = 'draft' | 'published';

export interface Lesson extends BaseRecord {
  course: string;
  title: string;
  description?: string;
  position: number;
  estimated_minutes?: number;
  video_file?: string;
  video_external_url?: string;
  transcript?: string;
  status: LessonStatus;
}

export type EnrollmentStatus = 'active' | 'completed' | 'cancelled';

export interface CourseEnrollment extends BaseRecord {
  user: string;
  course: string;
  courseData?: Course;
  status: EnrollmentStatus;
  progress_percent: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface LessonProgress extends BaseRecord {
  user: string;
  lesson: string;
  completed: boolean;
  last_position_seconds: number;
}

export interface SavedCourse extends BaseRecord {
  user: string;
  course: string;
  courseData?: Course;
}

export interface Note extends BaseRecord {
  user: string;
  course?: string;
  lesson?: string;
  class?: string;
  title?: string;
  content: string;
}

export type ClassStatus = 'draft' | 'open' | 'active' | 'completed' | 'archived';

export interface ClassRoom extends BaseRecord {
  course?: string;
  courseData?: Course;
  teacher: string;
  teacherData?: User;
  title: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  capacity?: number;
  status: ClassStatus;
}

export type ClassMembershipStatus = 'invited' | 'active' | 'completed' | 'removed';

export interface ClassMembership extends BaseRecord {
  class: string;
  classData?: ClassRoom;
  user: string;
  status: ClassMembershipStatus;
  joined_at: string;
}

export interface ClassAnnouncement extends BaseRecord {
  class: string;
  author: string;
  authorData?: User;
  title: string;
  body: string;
  published_at?: string;
  status: 'draft' | 'published';
}

export type GroupPrivacy = 'public' | 'private' | 'invite_only';
export type GroupStatus = 'active' | 'archived';

export interface Group extends BaseRecord {
  owner: string;
  ownerData?: User;
  category?: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  privacy: GroupPrivacy;
  status: GroupStatus;
  member_count?: number;
}

export type GroupRole = 'member' | 'moderator' | 'admin';
export type GroupMembershipStatus = 'pending' | 'active' | 'removed';

export interface GroupMembership extends BaseRecord {
  group: string;
  groupData?: Group;
  user: string;
  membership_role: GroupRole;
  status: GroupMembershipStatus;
  joined_at: string;
}

export interface Post extends BaseRecord {
  group: string;
  author: string;
  authorData?: User;
  content: string;
  media?: string;
  status: 'published' | 'hidden' | 'removed';
  comment_count?: number;
}

export interface Comment extends BaseRecord {
  post: string;
  author: string;
  authorData?: User;
  parent_comment?: string;
  content: string;
  status: 'published' | 'hidden' | 'removed';
}

export type AssignmentStatus = 'draft' | 'published' | 'closed';

export interface Assignment extends BaseRecord {
  class: string;
  classData?: ClassRoom;
  created_by: string;
  title: string;
  instructions: string;
  due_at?: string;
  max_points: number;
  status: AssignmentStatus;
}

export type SubmissionStatus = 'draft' | 'submitted' | 'late' | 'returned' | 'resubmitted';

export interface Submission extends BaseRecord {
  assignment: string;
  assignmentData?: Assignment;
  student: string;
  studentData?: User;
  text_response?: string;
  status: SubmissionStatus;
  submitted_at?: string;
}

export interface Grade extends BaseRecord {
  submission: string;
  graded_by: string;
  graderData?: User;
  score: number;
  max_points: number;
  feedback?: string;
  published: boolean;
}

export type SessionType = 'online' | 'in_person';
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface Session extends BaseRecord {
  host: string;
  hostData?: User;
  class?: string;
  group?: string;
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  meeting_url?: string;
  session_type: SessionType;
  status: SessionStatus;
}

export type NotificationType =
  | 'learning'
  | 'class'
  | 'assignment'
  | 'grade'
  | 'group'
  | 'session'
  | 'social'
  | 'system';

export interface Notification extends BaseRecord {
  user: string;
  type: NotificationType;
  title: string;
  body?: string;
  related_collection?: string;
  related_record_id?: string;
  read_at?: string;
}
