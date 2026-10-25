# Data Model — PocketBase Proposal

This is a conceptual schema to implement and validate in PocketBase. Confirm exact field types, required fields, indexes, API rules, and deletion behavior during implementation. Do not blindly create every optional collection if the MVP does not need it yet.

## Naming and conventions
- Use PocketBase record IDs for primary identifiers.
- Use relation fields for core relationships.
- Add `created` and `updated` system fields where appropriate.
- Use a status field with documented allowed values.
- Add indexes/uniqueness rules for slugs and membership pairs.
- Decide deletion behavior explicitly; avoid cascading deletion of user-generated learning records by accident.

## Authentication and profiles

### `users` (auth collection)
PocketBase auth collection. Keep authentication/provider-managed fields separate from public profile information where appropriate.

Suggested profile fields:
- `username` (unique)
- `display_name`
- `avatar` (file, optional)
- `bio` (text, optional)
- `capabilities` (multi-select or relations, only if global capabilities are needed)
- `onboarding_completed` (bool)

Do not store group-scoped roles in this global profile.

## Taxonomy

### `categories`
- `name` (text, required)
- `slug` (text, unique)
- `description` (text, optional)

### `skills`
- `name` (text, required)
- `slug` (text, unique)
- `description` (text, optional)

### `course_skills`
- `course` (relation → courses)
- `skill` (relation → skills)
Use a unique index on the pair.

## Courses and learning

### `courses`
- `creator` (relation → users)
- `category` (relation → categories, optional)
- `title` (text, required)
- `slug` (text, unique)
- `description` (editor/text)
- `thumbnail` (file, optional)
- `difficulty` (select: beginner/intermediate/advanced)
- `estimated_minutes` (number, optional)
- `status` (select: draft/published/archived)
- `price_amount` (number, optional; do not enable payments without a separate payment design)
- `currency` (text, optional)

### `lessons`
- `course` (relation → courses)
- `title` (text, required)
- `description` (text, optional)
- `position` (number, required)
- `estimated_minutes` (number, optional)
- `video_file` (file, optional)
- `video_external_url` (url, optional)
- `transcript` (editor/text, optional)
- `status` (select: draft/published)
Unique index: (`course`, `position`).

### `course_resources`
- `course` (relation → courses)
- `lesson` (relation → lessons, optional)
- `title` (text, required)
- `description` (text, optional)
- `file` (file, optional)
- `external_url` (url, optional)
- `uploaded_by` (relation → users)

### `course_enrollments`
- `user` (relation → users)
- `course` (relation → courses)
- `status` (select: active/completed/cancelled)
- `progress_percent` (number, default 0)
- `enrolled_at` (date)
- `completed_at` (date, optional)
Unique index: (`user`, `course`).

### `lesson_progress`
- `user` (relation → users)
- `lesson` (relation → lessons)
- `completed` (bool, default false)
- `last_position_seconds` (number, default 0)
- `updated_at` (date, if not using system updated field)
Unique index: (`user`, `lesson`).

### `saved_courses`
- `user` (relation → users)
- `course` (relation → courses)
Unique index: (`user`, `course`).

### `notes`
- `user` (relation → users)
- `course` (relation → courses, optional)
- `lesson` (relation → lessons, optional)
- `class` (relation → classes, optional)
- `title` (text, optional)
- `content` (editor/text)
Private by default. Validate that at least one relevant parent context is provided if required by product rules.

## Classes

### `classes`
- `course` (relation → courses, optional)
- `teacher` (relation → users)
- `title` (text, required)
- `description` (text, optional)
- `start_at` (date, optional)
- `end_at` (date, optional)
- `capacity` (number, optional)
- `status` (select: draft/open/active/completed/archived)

### `class_memberships`
- `class` (relation → classes)
- `user` (relation → users)
- `status` (select: invited/active/completed/removed)
- `joined_at` (date)
Unique index: (`class`, `user`).

### `class_resources`
- `class` (relation → classes)
- `title` (text, required)
- `description` (text, optional)
- `file` (file, optional)
- `external_url` (url, optional)
- `uploaded_by` (relation → users)

### `class_announcements`
- `class` (relation → classes)
- `author` (relation → users)
- `title` (text, required)
- `body` (editor/text, required)
- `published_at` (date, optional)
- `status` (select: draft/published)

## Groups and community

### `groups`
- `owner` (relation → users)
- `category` (relation → categories, optional)
- `name` (text, required)
- `slug` (text, unique)
- `description` (text, optional)
- `cover_image` (file, optional)
- `privacy` (select: public/private/invite_only)
- `status` (select: active/archived)

### `group_memberships`
- `group` (relation → groups)
- `user` (relation → users)
- `membership_role` (select: member/moderator/admin)
- `status` (select: pending/active/removed)
- `joined_at` (date)
Unique index: (`group`, `user`).

Important: permissions must be checked against the membership for the exact group. A membership role must not grant access to another group.

### `posts`
- `group` (relation → groups)
- `author` (relation → users)
- `content` (editor/text, required)
- `media` (file or relation to post attachments; choose based on multiple-file needs)
- `status` (select: published/hidden/removed)

### `comments`
- `post` (relation → posts)
- `author` (relation → users)
- `parent_comment` (self-relation, optional)
- `content` (editor/text, required)
- `status` (select: published/hidden/removed)

### `group_resources`
- `group` (relation → groups)
- `uploaded_by` (relation → users)
- `title` (text, required)
- `description` (text, optional)
- `file` (file, optional)
- `external_url` (url, optional)

## Assignments and grading

### `assignments`
- `class` (relation → classes)
- `created_by` (relation → users)
- `title` (text, required)
- `instructions` (editor/text, required)
- `due_at` (date, optional)
- `max_points` (number, required)
- `status` (select: draft/published/closed)

### `rubrics` (optional for MVP)
- `assignment` (relation → assignments)
- `title` (text, required)
- `description` (text, optional)
- `max_points` (number, required)
- `position` (number)

### `submissions`
- `assignment` (relation → assignments)
- `student` (relation → users)
- `text_response` (editor/text, optional)
- `status` (select: draft/submitted/late/returned/resubmitted)
- `submitted_at` (date, optional)
Unique index: (`assignment`, `student`) if only one current submission is supported. If resubmission history is required, model attempts separately.

### `submission_files`
- `submission` (relation → submissions)
- `file` (file, required)
- `original_filename` (text, optional)
- `mime_type` (text, optional)
- `size_bytes` (number, optional)

### `grades`
- `submission` (relation → submissions)
- `graded_by` (relation → users)
- `score` (number, required)
- `max_points` (number, required)
- `feedback` (editor/text, optional)
- `published` (bool, default false)
Unique index: (`submission`) if each submission has one current grade.

## Sessions

### `sessions`
- `host` (relation → users)
- `class` (relation → classes, optional)
- `group` (relation → groups, optional)
- `title` (text, required)
- `description` (text, optional)
- `start_at` (date, required)
- `end_at` (date, optional)
- `meeting_url` (url, optional)
- `session_type` (select: online/in_person)
- `status` (select: scheduled/live/completed/cancelled)

Business rule: exactly one of `class` or `group` must be set. Enforce this with validated server-side logic; collection rules alone may not be enough.

### `session_participants`
- `session` (relation → sessions)
- `user` (relation → users)
- `joined_at` (date, optional)
- `left_at` (date, optional)
Unique index: (`session`, `user`).

## Notifications

### `notifications`
- `user` (relation → users)
- `type` (select: learning/class/assignment/grade/group/session/social/system)
- `title` (text, required)
- `body` (text, optional)
- `related_collection` (text, optional)
- `related_record_id` (text, optional)
- `read_at` (date, optional)

Notifications should be created by trusted server-side logic for important events, not accepted as arbitrary trusted facts from clients.

## Optional later collections

### `certificates`
Only implement after completion rules are defined.
- `user` (relation → users)
- `course` (relation → courses, optional)
- `class` (relation → classes, optional)
- `certificate_number` (text, unique)
- `issued_at` (date)
- `verification_token` (text, unique)

### `reports`
For content/user reporting, if included in MVP:
- `reporter` (relation → users)
- `target_collection` (text)
- `target_record_id` (text)
- `reason` (select/text)
- `details` (text, optional)
- `status` (select: open/reviewing/resolved/dismissed)

## Authorization checklist

Implement and test PocketBase API rules for every collection:
- Who can list records?
- Who can view a record?
- Who can create it?
- Who can update it?
- Who can delete it?
- Can realtime subscriptions reveal it?
- Can file URLs reveal protected attachments?

Never rely on a UI-only permission check. For complex teacher/group role checks, use carefully tested relation-aware rules and server-side hooks/custom endpoints where necessary.
