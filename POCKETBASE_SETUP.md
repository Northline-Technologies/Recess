# PocketBase Backend Setup & Schema Reference

This guide details the setup, collection schema, API rules, and authentication configuration required for the SkillShare mobile platform backend using PocketBase (`v0.34.2`).

---

## 1. Starting PocketBase Locally

The repository includes `pocketbase.exe` pinned to version `0.34.2`.

### Start the server:
```bash
# In the project root:
.\pocketbase.exe serve
```
By default, PocketBase runs on:
- REST API: `http://127.0.0.1:8090/api/`
- Admin Dashboard: `http://127.0.0.1:8090/_/`

### Connecting from Mobile Devices / Emulators
Update `EXPO_PUBLIC_POCKETBASE_URL` in your `.env`:
- **Android Emulator**: `http://10.0.2.2:8090` (special loopback address for Android emulator)
- **iOS Simulator / Web**: `http://127.0.0.1:8090`
- **Physical Device**: `http://<YOUR_LOCAL_IP>:8090` (e.g. `http://192.168.1.100:8090`)

---

## 2. Google OAuth 2.0 Setup

1. Open Google Cloud Console: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID**:
   - Application Type: **Web application** (for PocketBase OAuth callback handling)
   - Authorized redirect URI:
     `http://127.0.0.1:8090/api/oauth2-redirect` (or your production PocketBase domain)
3. Open PocketBase Admin UI (`http://127.0.0.1:8090/_/`):
   - Navigate to **Settings** > **Auth providers** > **Google**
   - Toggle **Enabled**
   - Enter your Google **Client ID** and **Client Secret**
   - Save changes.
4. Mobile App Redirect Scheme:
   - Configured in `app.json` as `scheme: "skillshare"`
   - Callback route: `skillshare://auth-callback`

---

## 3. Collections & API Rules Specification

All access rules follow the **least privilege principle**. Server-side rules must enforce data integrity rather than relying on UI hiding.

### `users` (Auth collection)
- **Fields**:
  - `username` (text, unique, required)
  - `email` (email, unique, required)
  - `display_name` (text, required)
  - `avatar` (file, optional, max 5MB, mime: image/*)
  - `bio` (text, optional)
  - `capabilities` (json/select: `learner`, `creator`, `teacher`)
  - `onboarding_completed` (bool, default `false`)
- **API Rules**:
  - **List / Search**: `@request.auth.id != ""` (public profile view)
  - **View**: `@request.auth.id != ""`
  - **Create**: Always allowed (public registration/OAuth)
  - **Update**: `@request.auth.id = id` (own profile only)
  - **Delete**: `@request.auth.id = id`

---

### `categories` (Base collection)
- **Fields**:
  - `name` (text, required)
  - `slug` (text, unique, required)
  - `description` (text, optional)
- **API Rules**:
  - **List / View**: Everyone (`""`)
  - **Create / Update / Delete**: Admins only

---

### `skills` (Base collection)
- **Fields**:
  - `name` (text, required)
  - `slug` (text, unique, required)
- **API Rules**:
  - **List / View**: Everyone (`""`)
  - **Create / Update / Delete**: Admins only

---

### `courses` (Base collection)
- **Fields**:
  - `creator` (relation -> `users`, required)
  - `category` (relation -> `categories`, optional)
  - `title` (text, required)
  - `slug` (text, unique, required)
  - `description` (text, required)
  - `thumbnail` (file, optional, image/*)
  - `difficulty` (select: `beginner`, `intermediate`, `advanced`)
  - `estimated_minutes` (number, optional)
  - `status` (select: `draft`, `published`, `archived`)
  - `price_amount` (number, optional)
  - `currency` (text, optional)
- **API Rules**:
  - **List / View**: `status = "published" || creator = @request.auth.id`
  - **Create**: `@request.auth.id != ""`
  - **Update**: `creator = @request.auth.id`
  - **Delete**: `creator = @request.auth.id`

---

### `lessons` (Base collection)
- **Fields**:
  - `course` (relation -> `courses`, required)
  - `title` (text, required)
  - `description` (text, optional)
  - `position` (number, required)
  - `estimated_minutes` (number, optional)
  - `video_file` (file, optional)
  - `video_external_url` (url, optional)
  - `transcript` (text, optional)
  - `status` (select: `draft`, `published`)
- **API Rules**:
  - **List / View**: `status = "published" || course.creator = @request.auth.id`
  - **Create / Update / Delete**: `course.creator = @request.auth.id`

---

### `course_enrollments` (Base collection)
- **Fields**:
  - `user` (relation -> `users`, required)
  - `course` (relation -> `courses`, required)
  - `status` (select: `active`, `completed`, `cancelled`)
  - `progress_percent` (number, default `0`)
  - `enrolled_at` (date, required)
  - `completed_at` (date, optional)
- **Indexes**: Unique index on `(user, course)`
- **API Rules**:
  - **List / View**: `user = @request.auth.id || course.creator = @request.auth.id`
  - **Create**: `@request.auth.id != "" && user = @request.auth.id`
  - **Update**: `user = @request.auth.id`
  - **Delete**: `user = @request.auth.id`

---

### `lesson_progress` (Base collection)
- **Fields**:
  - `user` (relation -> `users`, required)
  - `lesson` (relation -> `lessons`, required)
  - `completed` (bool, default `false`)
  - `last_position_seconds` (number, default `0`)
- **Indexes**: Unique index on `(user, lesson)`
- **API Rules**:
  - **List / View**: `user = @request.auth.id`
  - **Create / Update**: `user = @request.auth.id`
  - **Delete**: `user = @request.auth.id`

---

### `saved_courses` (Base collection)
- **Fields**:
  - `user` (relation -> `users`, required)
  - `course` (relation -> `courses`, required)
- **Indexes**: Unique index on `(user, course)`
- **API Rules**:
  - **List / View / Create / Delete**: `user = @request.auth.id`

---

### `classes` (Base collection)
- **Fields**:
  - `course` (relation -> `courses`, optional)
  - `teacher` (relation -> `users`, required)
  - `title` (text, required)
  - `description` (text, optional)
  - `start_at` (date, optional)
  - `end_at` (date, optional)
  - `capacity` (number, optional)
  - `status` (select: `draft`, `open`, `active`, `completed`, `archived`)
- **API Rules**:
  - **List / View**: `status != "draft" || teacher = @request.auth.id`
  - **Create**: `@request.auth.id != ""`
  - **Update**: `teacher = @request.auth.id`
  - **Delete**: `teacher = @request.auth.id`

---

### `class_memberships` (Base collection)
- **Fields**:
  - `class` (relation -> `classes`, required)
  - `user` (relation -> `users`, required)
  - `status` (select: `invited`, `active`, `completed`, `removed`)
  - `joined_at` (date, required)
- **Indexes**: Unique index on `(class, user)`
- **API Rules**:
  - **List / View**: `user = @request.auth.id || class.teacher = @request.auth.id`
  - **Create**: `user = @request.auth.id || class.teacher = @request.auth.id`
  - **Update / Delete**: `user = @request.auth.id || class.teacher = @request.auth.id`

---

### `class_announcements` (Base collection)
- **Fields**:
  - `class` (relation -> `classes`, required)
  - `author` (relation -> `users`, required)
  - `title` (text, required)
  - `body` (text, required)
  - `published_at` (date, optional)
  - `status` (select: `draft`, `published`)
- **API Rules**:
  - **List / View**: `@request.auth.id != "" && (status = "published" || author = @request.auth.id)`
  - **Create / Update / Delete**: `author = @request.auth.id && class.teacher = @request.auth.id`

---

### `assignments` (Base collection)
- **Fields**:
  - `class` (relation -> `classes`, required)
  - `created_by` (relation -> `users`, required)
  - `title` (text, required)
  - `instructions` (text, required)
  - `due_at` (date, optional)
  - `max_points` (number, required)
  - `status` (select: `draft`, `published`, `closed`)
- **API Rules**:
  - **List / View**: `class.teacher = @request.auth.id || (status != "draft" && @collection.class_memberships.class = class && @collection.class_memberships.user = @request.auth.id)`
  - **Create / Update / Delete**: `class.teacher = @request.auth.id`

---

### `submissions` (Base collection)
- **Fields**:
  - `assignment` (relation -> `assignments`, required)
  - `student` (relation -> `users`, required)
  - `text_response` (text, optional)
  - `status` (select: `draft`, `submitted`, `late`, `returned`, `resubmitted`)
  - `submitted_at` (date, optional)
- **Indexes**: Unique index on `(assignment, student)`
- **API Rules**:
  - **List / View**: `student = @request.auth.id || assignment.class.teacher = @request.auth.id`
  - **Create / Update**: `student = @request.auth.id`
  - **Delete**: `student = @request.auth.id && status = "draft"`

---

### `grades` (Base collection)
- **Fields**:
  - `submission` (relation -> `submissions`, required)
  - `graded_by` (relation -> `users`, required)
  - `score` (number, required)
  - `max_points` (number, required)
  - `feedback` (text, optional)
  - `published` (bool, default `false`)
- **Indexes**: Unique index on `(submission)`
- **API Rules**:
  - **List / View**: `graded_by = @request.auth.id || (published = true && submission.student = @request.auth.id)`
  - **Create / Update / Delete**: `graded_by = @request.auth.id || submission.assignment.class.teacher = @request.auth.id`

---

### `groups` (Base collection)
- **Fields**:
  - `owner` (relation -> `users`, required)
  - `category` (relation -> `categories`, optional)
  - `name` (text, required)
  - `slug` (text, unique, required)
  - `description` (text, optional)
  - `cover_image` (file, optional)
  - `privacy` (select: `public`, `private`, `invite_only`)
  - `status` (select: `active`, `archived`)
- **API Rules**:
  - **List / View**: `privacy = "public" || owner = @request.auth.id || @collection.group_memberships.group = id && @collection.group_memberships.user = @request.auth.id`
  - **Create**: `@request.auth.id != ""`
  - **Update / Delete**: `owner = @request.auth.id`

---

### `group_memberships` (Base collection)
- **Fields**:
  - `group` (relation -> `groups`, required)
  - `user` (relation -> `users`, required)
  - `membership_role` (select: `member`, `moderator`, `admin`)
  - `status` (select: `pending`, `active`, `removed`)
  - `joined_at` (date, required)
- **Indexes**: Unique index on `(group, user)`
- **API Rules**:
  - **List / View**: `@request.auth.id != ""`
  - **Create**: `user = @request.auth.id`
  - **Update / Delete**: `user = @request.auth.id || group.owner = @request.auth.id`

---

### `posts` (Base collection)
- **Fields**:
  - `group` (relation -> `groups`, required)
  - `author` (relation -> `users`, required)
  - `content` (text, required)
  - `media` (file, optional)
  - `status` (select: `published`, `hidden`, `removed`)
- **API Rules**:
  - **List / View**: `group.privacy = "public" || author = @request.auth.id || @collection.group_memberships.group = group && @collection.group_memberships.user = @request.auth.id`
  - **Create**: `@request.auth.id != "" && author = @request.auth.id`
  - **Update / Delete**: `author = @request.auth.id || group.owner = @request.auth.id`

---

### `comments` (Base collection)
- **Fields**:
  - `post` (relation -> `posts`, required)
  - `author` (relation -> `users`, required)
  - `parent_comment` (relation -> `comments`, optional)
  - `content` (text, required)
  - `status` (select: `published`, `hidden`, `removed`)
- **API Rules**:
  - **List / View**: `status = "published" || author = @request.auth.id`
  - **Create**: `@request.auth.id != "" && author = @request.auth.id`
  - **Update / Delete**: `author = @request.auth.id`

---

### `sessions` (Base collection)
- **Fields**:
  - `host` (relation -> `users`, required)
  - `class` (relation -> `classes`, optional)
  - `group` (relation -> `groups`, optional)
  - `title` (text, required)
  - `description` (text, optional)
  - `start_at` (date, required)
  - `end_at` (date, optional)
  - `meeting_url` (url, optional)
  - `session_type` (select: `online`, `in_person`)
  - `status` (select: `scheduled`, `live`, `completed`, `cancelled`)
- **API Rules**:
  - **List / View**: `status != "cancelled" || host = @request.auth.id`
  - **Create / Update / Delete**: `host = @request.auth.id`

---

### `notifications` (Base collection)
- **Fields**:
  - `user` (relation -> `users`, required)
  - `type` (select: `learning`, `class`, `assignment`, `grade`, `group`, `session`, `social`, `system`)
  - `title` (text, required)
  - `body` (text, optional)
  - `related_collection` (text, optional)
  - `related_record_id` (text, optional)
  - `read_at` (date, optional)
- **API Rules**:
  - **List / View**: `user = @request.auth.id`
  - **Create**: Admins only / server hooks
  - **Update**: `user = @request.auth.id` (for marking read)
  - **Delete**: `user = @request.auth.id`

---

## 4. Backup & Restore Procedures

PocketBase stores all data in the `pb_data` directory (SQLite database files + uploaded media).

### Backup:
```bash
# Ensure pocketbase is temporarily stopped or use the automated backup feature:
.\pocketbase.exe backup
# Or copy pb_data directory to a secure off-site archive:
Copy-Item -Path "pb_data" -Destination "backups/pb_data_$(Get-Date -Format 'yyyyMMdd_HHmmss')" -Recurse
```

### Restore:
```bash
# Restore from a backup archive:
.\pocketbase.exe restore path/to/backup.zip
```
