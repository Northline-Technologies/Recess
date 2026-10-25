# User Stories

## Learner

### Discovery
- As a learner, I want to discover and search courses so I can find relevant skills.
- As a learner, I want to discover classes so I can join structured learning cohorts.
- As a learner, I want to discover groups so I can connect with people who share my interests.
- As a learner, I want to filter and save courses so I can revisit useful learning opportunities.
- As a learner, I want to view creator and teacher profiles so I can understand who is teaching.

### Courses
- As a learner, I want to view course details and previews before enrolling.
- As a learner, I want to enroll in a course and continue where I left off.
- As a learner, I want to mark lessons complete and track progress.
- As a learner, I want to access lesson resources and transcripts when available.
- As a learner, I want to take private notes linked to a course or lesson.
- As a learner, I want to see completed courses in my library.

### Classes
- As a learner, I want to view class details, teacher information, dates, and expectations.
- As a learner, I want to join a class and see its resources and announcements.
- As a learner, I want to see assignments and due dates.
- As a learner, I want to submit text or files for an assignment.
- As a learner, I want to see submission status and teacher feedback.
- As a learner, I want to see my grades when the teacher publishes them.
- As a learner, I want to see upcoming class sessions.

### Groups
- As a learner, I want to join or leave groups according to their privacy rules.
- As a group member, I want to read posts and comments.
- As a group member, I want to create posts, ask questions, and share resources.
- As a group member, I want to participate in group events and sessions.
- As a group member, I want to report inappropriate content if reporting is implemented.

## Teacher
- As a teacher, I want to create and manage classes I teach.
- As a teacher, I want to use an existing course as class curriculum without duplicating lessons.
- As a teacher, I want to manage class membership according to permissions.
- As a teacher, I want to create, edit, publish, and close assignments.
- As a teacher, I want to review student submissions.
- As a teacher, I want to grade submissions and provide feedback.
- As a teacher, I want to publish grades so students can view them.
- As a teacher, I want to track class progress and schedule sessions.
- As a teacher, I want to post class announcements.

## Creator
- As a creator, I want to create a course and organize its lessons.
- As a creator, I want to upload thumbnails, videos, and resources.
- As a creator, I want to preview a course before publishing it.
- As a creator, I want to edit courses I own.
- As a creator, I want to see course enrollment and basic progress metrics when analytics are implemented.

## Group Admin
- As a group admin, I want to edit my group's details and privacy.
- As a group admin, I want to approve or remove members when the group rules require it.
- As a group admin, I want to assign moderators and manage group membership roles.
- As a group admin, I want to manage group resources and moderate posts.
- As a group admin, I want to create group events or sessions.

## Group Moderator
- As a moderator, I want to review and moderate content in groups where I have moderator permissions.
- As a moderator, I must not be able to manage unrelated groups unless I have permissions there too.

## Platform Admin
- As a platform admin, I want to manage reports and platform-level configuration through a separate administrative interface.
- As a platform admin, I want privileged operations to be auditable.

## Acceptance principles

A feature is not complete if only its happy path works. Major flows must handle:
- Loading
- Empty state
- Network/backend error
- Permission denied
- Invalid input
- Duplicate submission or repeated taps
- Offline/timeout conditions where relevant
- Success confirmation

Authorization tests must cover at least two unrelated users, a teacher and student, and members with different roles in different groups.
