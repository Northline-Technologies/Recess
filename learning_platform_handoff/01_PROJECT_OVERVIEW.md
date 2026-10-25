# 01 — Project Overview

## 1. Purpose

Build a mobile-first social learning platform where people can learn independently, teach others, run structured learning cohorts, and collaborate in communities.

The product combines four related experiences:

- **Courses:** self-paced learning content organized into lessons, with progress tracking and supporting resources.
- **Classes / Classrooms:** structured learning spaces for a teacher and a cohort. A class can have members, a schedule, announcements, resources, assignments, submissions, grading, and feedback.
- **Groups:** ongoing communities for discussion, peer support, sharing notes and resources, and informal collaboration.
- **Sessions:** scheduled events such as live lessons, workshops, study groups, office hours, or group meetups. A session may belong to a class or a group.

The product should feel approachable and focused: users should be able to discover something useful, understand what to do next, and return to their learning without fighting the interface.

## 2. Product principles

1. **Make learning progress visible.** Show current learning, completed work, upcoming tasks, and useful next steps.
2. **Keep learning and community connected.** Users can discuss what they are learning and find people with shared interests.
3. **Support both informal and structured learning.** A course should not need a classroom; a classroom should support a more guided experience.
4. **Make creator and teacher workflows practical.** Publishing content, managing a cohort, reviewing work, and communicating with learners should be straightforward.
5. **Use clear permissions.** A user’s role is scoped to the relevant resource. Being a group moderator does not make someone a platform administrator.
6. **Design for mobile first.** Core learner workflows must work comfortably on phone screens, with responsive layouts where other platforms are supported.
7. **Protect user data by default.** Enforce access rules on the backend; never rely on hiding a UI control as the only authorization check.
8. **Ship a coherent MVP.** Prefer reliable end-to-end flows over a large number of incomplete features.

## 3. Intended audiences

- **Learners:** discover courses, learn at their own pace, join classes and groups, complete assignments, attend sessions, track progress.
- **Course creators:** prepare, organize, publish, and maintain courses and lessons.
- **Teachers / class facilitators:** run a class, share resources, schedule sessions, create assignments, review submissions, provide feedback and grades.
- **Group admins and moderators:** manage membership and keep a community useful and safe.
- **Platform administrators:** handle platform-level moderation and operational tasks through a protected administrative workflow.

One account may participate in multiple capacities. Do not make the user choose one permanent global role if their permissions can be represented through ownership and memberships.

## 4. Core product areas

### Courses
A course contains metadata such as title, description, cover image, creator, category, difficulty, tags, publication status, and lessons. Lessons may contain text, video links or media, attachments, and other learning resources. Learners can enroll, save a course, record lesson completion, and resume where they left off.

### Classes / Classrooms
A class is a guided learning space. It has a teacher or facilitator, enrolled members, a description, optional start/end dates, announcements, resources, and potentially assignments and sessions. Membership may be open, invite-only, or controlled by an enrollment code depending on the final product rules.

### Assignments and grading
Teachers can publish an assignment with instructions, a due date, attachments, and optional rubric. Learners can submit work and, where appropriate, revise it. Teachers can review a submission, leave feedback, and assign a grade or status. The system should distinguish draft, submitted, returned for revision, graded, and late states as needed.

### Groups
A group is a community around a topic, skill, course, class, or shared goal. It supports a description, membership, posts, comments, shared resources, and moderation. Group administration is scoped to that group.

### Sessions
A session is an event with a title, description, start/end time, timezone, host, and optional parent class or group. It may include a location or external meeting URL. Participants can see upcoming sessions and receive relevant reminders when notifications are implemented.

### Profiles and discovery
Profiles identify a user and their learning or teaching activity. Discovery helps users find courses, classes, groups, and creators through categories, search, and filters. Search can be simple in the MVP and improved later.

## 5. Product boundaries

### MVP priorities
- Authentication and account/profile basics.
- Course discovery and course detail.
- Course enrollment, lesson navigation, and progress tracking.
- Class creation or joining, class overview, announcements, and resources.
- Assignment creation, submission, grading, and feedback.
- Group discovery or joining, posts, comments, and basic moderation.
- Sessions list/detail and creation by authorized hosts.
- Notifications for key events if feasible; otherwise build the data model and a minimal in-app notification experience.
- Light, dark, and system-default appearance modes.
- Backend-enforced access control and useful error, loading, empty, and offline states.

### Later candidates
- Payments, subscriptions, creator payouts, and refunds.
- Certificates, badges, and public portfolios.
- Advanced analytics and learning recommendations.
- Live video infrastructure, recording, and attendance automation.
- Rich collaborative editing, live chat, and group workspaces.
- Advanced moderation, reporting workflows, and organization accounts.
- Web/desktop-specific experiences beyond responsive support.

Treat these as candidates, not promises. Do not build them before the main learning and classroom flows work.

## 6. Navigation model

Use the supplied UX flow diagram as the behavioral reference. A sensible initial mobile navigation may include:

- **Home:** continue learning, upcoming work, sessions, and relevant updates.
- **Explore:** search and discover courses, classes, groups, and creators.
- **My Learning:** enrolled courses, joined classes, assignments, and progress.
- **Community:** groups and discussion activity.
- **Profile:** personal details, created content, preferences, and settings.

The exact tab structure should follow the provided UX-flow reference and the existing repository if one exists. Do not blindly add every product area as a top-level tab; keep the main navigation compact and place related tasks within their parent areas.

## 7. Visual direction

Use supplied UI screenshots as visual references, not as a requirement to reproduce every pixel. The intended direction is clean, calm, and productivity-focused:

- Light backgrounds and white surfaces in light mode.
- Near-black surfaces and legible contrast in dark mode.
- Green as the primary accent for important actions, progress, and selected states.
- Clear typography and spacing.
- Cards and grouped sections used where they improve scanning.
- Restrained borders, shadows, and decoration.
- Consistent loading, empty, error, disabled, and success states.
- Accessible touch targets, contrast, and text scaling.

The product must support **Light**, **Dark**, and **System Default** themes.

## 8. Technical baseline

- React Native
- Expo
- TypeScript
- Expo Router
- PocketBase for MVP authentication, data API, realtime features where useful, and file handling
- Google OAuth as the first authentication provider; test Apple sign-in separately for platform-specific requirements
- A typed service/repository layer between UI components and PocketBase

Keep secrets and superuser credentials off the client. Use PocketBase collection rules and backend validation for authorization. Pin the PocketBase version, maintain version-controlled migrations, back up both the database and uploaded files, and test restoring a backup. PocketBase is pre-1.0, so treat the backend choice as an MVP decision with an explicit upgrade/migration plan.

## 9. Definition of a successful MVP

A new user can sign in, find a course, enroll, complete a lesson, and see their progress. A teacher can create a class, publish an assignment, review a submission, and return feedback. Learners can join a group, contribute to a discussion, and find an upcoming session. Unauthorized users cannot access private records by bypassing the UI. The experience remains understandable in light, dark, and system-default themes.

## 10. Source-of-truth order for implementation

When references conflict, use this order:

1. Explicit product decisions made by the project owner.
2. `03_PRODUCT_SPEC.md` and `04_USER_STORIES.md` for behavior and acceptance criteria.
3. `02_UX_FLOW.md` and the supplied UX flow diagram for navigation and transitions.
4. `07_DESIGN_SYSTEM.md` and supplied UI screenshots for visual treatment.
5. `05_TECHNICAL_REQUIREMENTS.md` and `06_DATA_MODEL.md` for architecture and data behavior.
6. Existing repository conventions, where they do not conflict with the above.

If a requirement is unclear, note the assumption and ask a focused question rather than silently inventing a major product rule.
