# 02 — UX Flow

## 1. Purpose and references

This document describes the main user journeys and screen transitions for the learning platform. Use the supplied UX flow diagram as the primary visual reference for navigation and flow, and use the supplied UI screenshots as the visual reference for layout, styling, and component treatment.

The flow below is a baseline for implementation. If the supplied diagram defines a different transition, follow the diagram unless it conflicts with an explicit product decision or a security requirement. Keep navigation and screen responsibilities clear; avoid implementing every feature as an unrelated top-level destination.

## 2. Global navigation and application states

### Suggested main destinations
Use the existing project navigation if it already exists. Otherwise, start with a compact mobile navigation such as:

1. **Home** — continue learning, recommended next steps, upcoming sessions, due work, and recent updates.
2. **Explore** — search and browse courses, classes, groups, and creators.
3. **My Learning** — enrolled courses, joined classes, assignments, and progress.
4. **Community** — groups and relevant discussion activity.
5. **Profile** — profile, created content, preferences, and settings.

A destination may contain nested screens, tabs, filters, and detail pages. Do not add a separate bottom tab for every entity type unless the reference flow explicitly calls for it.

### Global states
Every network-backed screen should handle:
- Initial loading.
- Pull-to-refresh or an equivalent refresh action where useful.
- Empty state with a meaningful next action.
- Error state with retry when appropriate.
- Permission-denied or unavailable state without leaking private data.
- Offline or connection-lost state when feasible.
- Long content, small screens, keyboard visibility, and text scaling.

Use consistent back behavior. Preserve scroll position and unsaved form values when reasonable. Warn before discarding meaningful unsaved work.

## 3. Authentication and first-time setup

### Entry flow
1. App launch.
2. Read the authentication/session state.
3. If signed in, load the main app.
4. If signed out, show the welcome/sign-in experience.
5. User chooses Google sign-in (MVP priority) or another configured provider.
6. Complete OAuth through the supported Expo/PocketBase flow.
7. Handle cancellation, provider errors, and network errors.
8. On success, check whether the account profile requires completion.
9. If profile setup is needed, collect the minimum required information.
10. Navigate to Home and show a useful first-run empty state.

### Profile setup
Possible fields include display name, username if supported, avatar, short bio, and interests. Keep optional fields optional. Do not force users to select a permanent global role: a person may learn, teach, create courses, and moderate a group under different permissions.

### Account settings
Profile → Settings should include:
- Edit profile.
- Appearance: Light / Dark / System Default.
- Account and sign-in details.
- Notification preferences when notifications are available.
- Sign out.
- Account deletion or a clearly documented future-state placeholder if deletion is not yet implemented.

Do not claim an account has been deleted if the backend flow has not completed successfully.

## 4. Home flow

1. Open Home.
2. Load the user's active learning, next suggested action, upcoming sessions, assignments due soon, and relevant updates.
3. Tapping a course card opens Course Detail or resumes the most recent lesson.
4. Tapping an assignment opens Assignment Detail.
5. Tapping an upcoming session opens Session Detail.
6. Tapping an update opens the related class, group, submission, or session.
7. If the user has no activity, show useful calls to action such as Explore courses, Find a group, or Join a class.

Do not make Home depend on every data source succeeding. A failure in one section should not necessarily blank the entire screen.

## 5. Explore and discovery flow

1. Open Explore.
2. Choose a content type or use a combined search: Courses, Classes, Groups, Creators.
3. Enter a search query or choose category/filter options.
4. View result cards with enough information to make a choice.
5. Open a detail page.
6. Perform the available action:
   - Course: enroll or save.
   - Class: request/join, use an invite code, or view access instructions.
   - Group: join or request to join.
   - Creator: view profile and published courses.
7. Show success/failure feedback and update the relevant state.

Search filters should not silently reset when users return from a detail page unless that is the intended interaction.

## 6. Course learning flow

### Discover and enroll
Explore → Course Card → Course Detail → Enroll/Start Learning → Course Learning Overview.

Course Detail should include title, creator, description, cover, difficulty/category, lesson outline, and relevant resources. Display enrollment state and prerequisites if any. If the course is private or unpublished, enforce that rule on the backend and show an appropriate unavailable state.

### Learn a lesson
Course Learning Overview → Select Lesson → Lesson Player/Reader.

The lesson experience may contain text, video or an external video link, attachments, and related resources. Provide:
- Lesson title and content.
- Previous/next lesson navigation.
- Course/lesson outline access.
- A completion action or a well-defined completion rule.
- Progress indication.
- Resume behavior.

When a lesson is completed, persist progress and update the course progress indicator. Handle retries safely so repeated completion requests do not create duplicate progress records.

### Course actions
- Save/unsave a course.
- Open creator profile.
- View course resources.
- Continue where the learner left off.
- View completed lessons and overall progress.

If a course is not yet published, show it only to users authorized to preview or edit it.

## 7. My Learning flow

1. Open My Learning.
2. View relevant sections such as Courses, Classes, Assignments, and Progress.
3. Select a course to resume learning.
4. Select a class to open its classroom.
5. Select an assignment to view instructions, due date, status, and submission.
6. View progress and completed work.

Keep status labels consistent across Home and My Learning. Examples: Not started, In progress, Completed; assignment states may include Draft, Submitted, Returned for revision, Graded, and Late.

## 8. Class / Classroom flow

### Join a class
Explore or invitation link → Class Detail → Review class information and access rules → Join/request/invite-code flow → Classroom.

The UI must clearly distinguish open enrollment, request-based enrollment, and invite-only access. Never imply that a user joined until the backend confirms membership.

### Classroom overview
A classroom may provide:
- Overview and teacher information.
- Announcements.
- Resources.
- Assignments.
- Sessions/schedule.
- Member list, subject to privacy settings.

Use clear section navigation within the classroom. The exact arrangement can follow the supplied design and UX diagram.

### Teacher creates a class
Authorized teacher/creator → Teaching or Creator area → Create Class form → Validate fields → Save draft or create/publish → Class Detail.

The form should validate required fields, show field-level errors, prevent accidental duplicate submission, and preserve input if saving fails. Only authorized users should be able to edit or publish the class.

### Announcements and resources
Teacher → Classroom → Create Announcement or Add Resource → Compose → Preview if useful → Publish/save → Members see the update.

Provide edit/delete actions only to the owner or users with explicit classroom permissions. Confirm destructive actions when recovery is difficult.

## 9. Assignment and assessment flow

### Teacher creates an assignment
Classroom → Assignments → Create Assignment → Enter title, instructions, due date/time, attachments, and optional rubric → Save draft or publish.

After publishing, learners who are members of the class can view the assignment. Private drafts must remain visible only to authorized staff.

### Learner submits work
Classroom or My Learning → Assignment Detail → Read instructions and due date → Add response and/or upload files → Review → Submit → Confirmation and updated status.

If drafts are supported, distinguish Save Draft from Submit. Show file upload progress and explain file type/size restrictions. Prevent double submission while a request is in progress. If resubmission is allowed, show the current submission and whether the learner may replace it.

### Teacher reviews work
Classroom → Assignment → Submission List → Select learner submission → Review files/response → Enter grade or rubric feedback and comments → Return feedback/mark graded → Learner can view the result.

The backend must verify the teacher's authority over the class and assignment. Learners must only access their own submission and feedback unless an explicit peer-review feature grants more access.

### Assessment states
Use a documented state model, for example:
- Draft: learner has not submitted or submission is saved privately.
- Submitted: work has been sent for review.
- Returned: teacher requests changes.
- Graded: review is complete.
- Late: submitted after the deadline; this may be a flag alongside another state.

Clarify whether late submissions and resubmissions are allowed. Do not infer grading policy from UI alone.

## 10. Groups and community flow

### Find and join a group
Explore or Community → Group list/search → Group Detail → View purpose, rules, and recent activity → Join/request access → Group Feed.

### Group feed
Group Feed → Read posts → Open comments → Comment or react if supported → Return to feed.

### Create a post
Group Feed → Create Post → Write text and optionally attach supported resources → Publish → Post appears in the feed.

Show upload and publication states. Handle empty posts and failed uploads. Avoid rendering unsafe rich content as trusted HTML.

### Group administration
Group admin/moderator → Group Settings or member-management screen → Review join requests, manage membership, pin/hide/remove posts, or update group details according to assigned permissions.

Moderation permissions are scoped to that group. A group moderator must not gain platform-wide administrative access. Record sensitive moderation actions where appropriate and provide confirmation for destructive actions.

## 11. Sessions and events flow

### Discover a session
Home, Classroom, or Group → Upcoming Session card → Session Detail.

Session Detail should show title, description, host, date/time, timezone, parent class/group if applicable, and location or meeting link when available.

### Create or edit a session
Authorized host/teacher → Class or Group → Sessions → Create/Edit Session → Enter title, start/end time, timezone, description, and optional meeting location/link → Save → Participants can see the session.

Validate that the end time is after the start time. Store timestamps consistently and display them in the appropriate timezone. Do not expose private meeting links to unauthorized users.

### Reminders and participation
If reminders are in MVP scope, notify only relevant participants and respect notification preferences. If attendance is supported, make the attendance rule clear; do not imply attendance was recorded simply because a user opened the session detail.

## 12. Creator and teacher workspace

Provide a protected area for users who own or are authorized to manage content. It may contain:
- My Courses / course editor.
- My Classes / classroom management.
- Assignments and submissions needing review.
- Session management.
- Basic learner/progress overview where appropriate.

### Course creation flow
Creator workspace → Create Course → Add metadata and cover → Add/reorder lessons and resources → Save draft → Preview → Publish.

Only published courses should be discoverable by ordinary users. A creator can edit their own draft. Changes to a published course should not silently destroy learner progress or invalidate existing enrollments.

### Permission checks
The UI should show relevant actions based on current permissions, but backend authorization is authoritative. Handle permission changes that occur while the user is signed in.

## 13. Notifications flow

1. A relevant event occurs, such as assignment publication, feedback returned, class announcement, group invitation, or session reminder.
2. Backend creates a notification for the intended recipient(s).
3. Notification list displays unread/read state and timestamp.
4. User taps the notification.
5. App opens the related resource if the user still has permission.
6. Mark as read after a successful action according to the chosen product behavior.

Do not expose private content in notification previews to users who are no longer authorized to see it. Notification delivery can begin as in-app only; push notifications can be added when the core flows are stable.

## 14. Profile and public-facing creator flow

Profile → View/edit own profile, created courses, and relevant activity. A public profile should reveal only fields intended to be public. Private account data, OAuth details, email visibility, and administrative information must not be exposed by default.

Tapping a creator from a course detail opens their profile. Back navigation should return to the originating context where possible.

## 15. Theme and accessibility flow

Settings → Appearance → Light / Dark / System Default.

- **Light:** light background, white surfaces, near-black text, green accent.
- **Dark:** dark surfaces and background, high-contrast text, green accent adjusted for readability.
- **System Default:** follow the operating system appearance and update when the OS theme changes.

Persist the explicit user preference. When System Default is selected, continue to follow the OS setting rather than saving a fixed light/dark value.

Ensure keyboard navigation and screen-reader labels where applicable, accessible contrast, touch targets, text scaling, visible focus/selected states, and status messages that are not conveyed by color alone.

## 16. Error, empty, and destructive-action flows

Every major flow should define what happens when:
- The user is signed out or the session expires.
- The resource is deleted, unpublished, or no longer accessible.
- A request fails or times out.
- A file upload fails.
- The user loses permission.
- A form contains invalid values.
- A submission or publish action is tapped more than once.
- The user tries to leave with unsaved changes.
- A list has no results or no items yet.

Prefer clear recovery actions such as Retry, Go Back, Save Draft, or Explore Courses. Do not show raw backend stack traces or secrets. Destructive actions should use confirmation where appropriate and should reflect the backend result rather than optimistic assumptions.

## 17. Analytics and product instrumentation

For MVP, instrument only events that help validate core flows and diagnose issues, subject to the project's privacy policy. Potential events include sign-in success/failure, course enrollment, lesson completion, class join, assignment submission, feedback returned, group join, and session creation. Avoid logging passwords, OAuth tokens, private submission content, or unnecessary personal data.

## 18. Acceptance walkthroughs

Before calling the core UX complete, test these journeys end to end:

1. New user signs in, completes profile setup, and reaches Home.
2. Learner discovers a published course, enrolls, completes a lesson, leaves, returns, and resumes correctly.
3. Learner joins a class and can view its announcements, resources, assignments, and sessions.
4. Teacher creates an assignment and publishes it to the correct class.
5. Learner submits work and can see the correct status.
6. Teacher reviews the submission and returns feedback.
7. Learner joins a group, creates a post, and comments.
8. Authorized host creates a session and the intended participants can see it.
9. A user without permission cannot read or mutate protected records through direct API requests.
10. Appearance works in Light, Dark, and System Default, including after app restart.
11. Failed network requests show useful recovery actions and do not lose important form input.
12. Navigation back from detail screens returns to a sensible prior context.
