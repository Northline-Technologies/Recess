# Product Specification

## Product vision

A modern social-learning platform where people discover skills, learn through self-paced courses, participate in structured classrooms, collaborate in informal communities, and attend live learning sessions.

Core loop: **Learn → Practice → Connect**.

## Product pillars

### Courses — learn independently
Courses contain reusable educational content organized into lessons and resources. Learners can enroll, track progress, save courses, take private notes, and complete content at their own pace.

### Classes — learn in a structured cohort
Classes are teacher-led learning experiences with students, schedules, announcements, assignments, submissions, grading, feedback, and sessions. A class may use an existing course as its curriculum.

### Groups — collaborate informally
Groups are communities for discussion, collaboration, questions, resource sharing, and events. Groups do not require curriculum, assignments, or grades.

### Sessions — meet live
Sessions are scheduled events associated with either a Class or a Group. The initial MVP may support session details and join links before building native real-time audio/video.

## User capabilities

A user can have multiple capabilities, such as Learner, Creator, and Teacher. Do not treat these as mutually exclusive account types.

- **Learner:** discovers and consumes learning content.
- **Creator:** creates and manages courses.
- **Teacher:** manages classes, assignments, submissions, and grades.
- **Group Admin:** manages one specific group.
- **Group Moderator:** moderates one specific group.
- **Platform Admin:** privileged platform-wide administration, not a normal user-facing role.

Group Admin and Group Moderator are scoped to a specific group membership. They are not global roles.

## Core entities

### User
An application profile linked to a PocketBase authenticated account. Includes public profile fields such as display name, username, avatar, bio, and timestamps. Never expose private authentication fields in public profile responses.

### Course
Reusable learning content. Fields include title, slug, description, thumbnail, creator, category, difficulty, status, pricing configuration if monetization is enabled, lessons, resources, and skills.

Course content should not be duplicated when a class uses it.

### Lesson
A unit within a course, with title, description, order, estimated duration, optional media, transcript, and resources. Draft lessons should not be visible to unauthorized users.

### Course enrollment
A relationship between a user and a course. Stores enrollment status, progress summary, and timestamps.

### Lesson progress
Tracks per-user progress for a lesson, including completion and last playback position where relevant.

### Class
A structured cohort with a teacher, optional course curriculum, description, schedule, capacity, status, assignments, class resources, and sessions.

### Class membership
Connects a user to a class and records their membership status. Teacher permissions must be checked against the specific class.

### Group
An informal community with name, description, cover image, category, privacy setting, owner, and membership.

### Group membership
Connects a user to a group and stores a group-scoped role: member, moderator, or admin.

### Post and comment
User-generated discussion content. Visibility and moderation must follow the parent group's privacy and membership rules.

### Assignment
A task belonging to a class, with instructions, due date, points, optional attachments and rubric, publication status, and creator.

### Submission
A student's response to an assignment. May contain text and file attachments. Students may only read and change their own submission, subject to submission state and class rules.

### Grade
A teacher's evaluation of a submission, including score, maximum score, feedback, grader, publication status, and timestamps. Students may read their own published grades, not change them.

### Personal note
A private note owned by a user and optionally associated with a course, lesson, or class. Notes are private by default.

### Session
A scheduled event associated with exactly one Class or Group. Initially, the app may store a meeting URL rather than host live video itself.

### Notification
An in-app event such as a due date reminder, grade publication, group mention, class announcement, or session reminder.

### Certificate
An optional achievement record issued after a defined completion requirement is met. Do not generate certificates until the completion rules are explicit.

## Product rules

1. A Course is reusable educational content.
2. A Class is a structured cohort and may reference a Course.
3. A Group is an informal community and is independent of a Course.
4. A Session belongs to exactly one Class or Group.
5. Grades belong to assignment submissions.
6. Group moderation permissions are scoped to the relevant group.
7. Teacher permissions are scoped to classes the teacher manages.
8. Users may have multiple capabilities.
9. Notes are private unless an explicit sharing feature is introduced.
10. Enforce authorization on the backend, not only by hiding UI controls.
11. Public/private content visibility must be enforced consistently across lists, detail views, search, realtime subscriptions, and file access.
12. Do not invent monetization, live-video infrastructure, certificates, or advanced analytics for the MVP unless requested.

## Primary navigation

Use the final UI/UX reference to confirm exact navigation labels and placement. The current proposed structure is:

- Home
- Explore
- Community
- Library
- Profile

Creator Studio and teacher management tools should be accessible to users with the appropriate permissions without overwhelming the normal learner experience.

## MVP scope

### MVP core
- Authentication and profile
- Course discovery and course details
- Lessons and progress tracking
- Course enrollment and saved courses
- Classes and class memberships
- Groups, memberships, posts, and comments
- Assignments, submissions, grades, and feedback
- Personal notes
- Session listings and details
- In-app notifications
- Light, Dark, and System appearance preferences
- Loading, empty, error, and permission-denied states

### Later phases
- Creator analytics and earnings
- Payments and subscriptions
- Certificates and verification
- Native live video/audio, screen sharing, whiteboard
- Advanced offline synchronization
- Video transcoding and CDN delivery
- Advanced moderation and reporting workflows
