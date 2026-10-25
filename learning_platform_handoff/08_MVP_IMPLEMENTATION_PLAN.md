# MVP Implementation Plan

## Goal

Build a working, testable vertical slice before implementing every feature. Do not generate the entire app as one giant untested batch.

## Phase 0 — repository and decisions
- Inspect the existing repository before changing it.
- Confirm Expo, TypeScript, Expo Router, and PocketBase versions.
- Set up formatting, linting, type checking, and environment configuration.
- Add `.env.example` with placeholders only.
- Document how to run the app and PocketBase locally.
- Create a short decision log for unresolved product choices.

**Exit criteria:** app boots on a target device and the developer setup is documented.

## Phase 1 — design foundation and navigation
- Implement theme tokens and System/Light/Dark preference.
- Build typography, spacing, buttons, inputs, cards, navigation, and loading/empty/error primitives.
- Implement routes and placeholder screens based on the supplied UI references and UX flow.
- Confirm responsive layouts and safe-area/keyboard behavior.

**Exit criteria:** navigation and visual foundations are consistent; theme changes work throughout the app.

## Phase 2 — PocketBase foundation and authentication
- Define collections and indexes for the first vertical slice.
- Configure Google OAuth; test redirects and session persistence.
- Add Apple OAuth only after configuring and testing platform requirements.
- Implement profile creation and onboarding.
- Add auth guards and expired-session handling.
- Write authorization tests before adding sensitive workflows.

**Exit criteria:** users can authenticate, sign out, reopen the app, and access only permitted routes/data.

## Phase 3 — course learning vertical slice
- Course discovery and detail
- Course enrollment and saved courses
- Lesson list and lesson player/detail
- Lesson completion and progress
- Private notes
- Pagination and loading/error/empty states

**Exit criteria:** a learner can discover a course, enroll, study a lesson, save progress, and revisit notes.

## Phase 4 — classes and assessments
- Create/manage classes for authorized teachers
- Class membership
- Class resources and announcements
- Assignments and due dates
- Submission creation/editing
- Teacher grading and feedback
- Published grades visible to the correct student only

**Exit criteria:** complete assignment-to-grade workflow passes multi-account authorization tests.

## Phase 5 — groups and collaboration
- Group discovery and detail
- Join/request/invite behavior according to privacy mode
- Group memberships and scoped roles
- Posts and comments
- Resources
- Moderation actions

**Exit criteria:** members can collaborate while private group content and moderation powers remain scoped correctly.

## Phase 6 — sessions and notifications
- Session listing/detail and meeting links
- Class/group session association
- In-app notifications for key events
- Realtime subscriptions only where they add value and obey access rules

**Exit criteria:** users see relevant upcoming sessions and authorized notifications.

## Phase 7 — hardening
- Test empty/error/loading states
- Test light/dark/system themes
- Test permissions with multiple accounts
- Test upload size/type limits and private file access
- Test slow network, timeout, retry, and session expiry
- Test backup and restore
- Remove mock data from completed production flows
- Check performance on a mid-range Android device

**Exit criteria:** release checklist is completed and known limitations are documented.

## Definition of done for each feature
- UI matches the supplied references and theme tokens.
- UX matches the flow diagram.
- Backend data is real, not silently mocked.
- Permissions are enforced server-side.
- Loading, empty, error, and success states exist.
- Type checking and linting pass.
- Relevant tests pass.
- The implementation and any schema changes are documented.

## Scope control
Do not build payments, earnings, native video conferencing, full offline sync, certificates, or advanced analytics until the core learning/class/group loop works and the user explicitly prioritizes those features.
