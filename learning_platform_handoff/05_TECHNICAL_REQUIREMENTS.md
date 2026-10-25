# Technical Requirements

## Application stack
- React Native
- Expo
- TypeScript with strict type checking
- Expo Router
- PocketBase as the initial backend
- Official PocketBase JavaScript SDK

Target Android first while keeping the architecture compatible with iOS.

## Backend architecture
- PocketBase provides authentication, collections, API, realtime features, and file management.
- Keep frontend data access behind reusable service modules.
- Do not place business logic entirely inside screen components.
- Do not expose PocketBase superuser/admin credentials in the client.
- Do not rely on client-side UI hiding as an authorization mechanism.

## Authentication
Use PocketBase authentication with OAuth providers:
- Google
- Apple, after provider configuration and native/mobile redirect behavior have been tested

Requirements:
- Sign in, sign out, persistent session, account/profile setup, and session expiry handling.
- Map a provider identity to one application account wherever the supported OAuth flow allows.
- Handle cancellation, provider errors, missing email, and first-login profile completion.
- Do not invent a custom password flow unless explicitly approved.
- Test Google and Apple flows on actual target platforms; provider setup and platform requirements may differ.
- Never log access tokens or provider secrets.

## Data access architecture
Create service modules, for example:
- `services/auth`
- `services/courses`
- `services/classes`
- `services/groups`
- `services/assignments`
- `services/submissions`
- `services/grades`
- `services/sessions`
- `services/notifications`
- `services/files`

Screens and components should call these modules instead of making ad hoc PocketBase requests everywhere.

Use typed application models and explicit mapping/validation at the service boundary where useful. Keep PocketBase-specific record shapes from leaking across the entire UI.

## Authorization and security
- Configure PocketBase collection API rules with least privilege.
- Test list, view, create, update, delete, realtime, and file-access permissions.
- Scope teacher actions to classes they teach.
- Scope group admin/moderator actions to the relevant group membership.
- Learners may read only their own private notes, submissions, and published grades.
- Students must not be able to modify grades.
- Private group content must not leak through search, realtime, direct record URLs, or file URLs.
- Use server-side hooks/custom endpoints for operations that require transactional or multi-record validation.
- Do not use a superuser token in the mobile app.
- Treat PocketBase API rules as important but not as a substitute for security review and adversarial testing.

## Database and schema
- Use PocketBase collections and relations for relational data.
- Prefer explicit relation fields over arbitrary JSON for core relationships.
- Add unique constraints/indexes where appropriate, such as usernames/slugs and membership pairs.
- Document schema changes and keep migrations under version control.
- Do not manually edit production data structures without a repeatable migration process.
- Avoid building a complex abstraction layer just to anticipate a hypothetical future migration.

## File storage
Initial storage can use PocketBase's built-in file storage for profile images, thumbnails, and smaller resources.

Use S3-compatible storage later if needed for larger media, storage scale, or delivery architecture. Keep storage access behind a file service so the app is not coupled to a specific storage provider.

Requirements:
- Never store AWS secret keys in the mobile app.
- Keep private files protected.
- Validate ownership and access before granting access to private uploads.
- Set reasonable upload size/type limits.
- Show upload progress, retry, cancellation, and failure states.
- Use multipart/resumable approaches for large uploads when the chosen storage path supports them.
- Do not make all course or submission files public merely for convenience.
- Store metadata and access references in PocketBase; binary files should not be stored in text fields.

## Media delivery
Do not build a full video pipeline for the initial MVP unless requested. Structure media access so S3 and a CDN such as CloudFront can be added later. Consider transcoding and adaptive streaming only when the product requires them.

## State management
Separate server state from temporary UI state.
- Server state: courses, lessons, memberships, assignments, submissions, grades, notifications.
- UI state: modal visibility, selected tab, filters, draft form values.

Avoid duplicate copies of server data and unsafe optimistic updates for grades, submissions, or permissions.

## Navigation
Use Expo Router. Protect authenticated routes and support deep-link-ready routes for courses, classes, groups, sessions, and assignments. Match the final UX-flow diagram; do not invent a different information architecture.

## Theming
Support:
- `system`
- `light`
- `dark`

Persist the user's preference between launches. In `system` mode, follow the device color scheme. Switching themes should update the app without a restart.

Use centralized semantic tokens. No hardcoded theme-specific colors inside reusable components.

## Performance and reliability
- Use pagination for growing lists.
- Optimize images and thumbnails.
- Virtualize long lists.
- Avoid unnecessary API requests and expensive animations.
- Provide loading, empty, error, and retry states.
- Preserve unsent form content where practical.
- Cache appropriate read-only data without exposing private content to another account.
- Handle timeouts, network loss, and expired sessions gracefully.
- Do not claim full offline support unless it is implemented and tested.

## Environment and secrets
Provide `.env.example` with placeholder values only. Never commit real `.env` files, OAuth client secrets, superuser credentials, or cloud keys. Keep server-only secrets on the server.

## Testing
At minimum:
- TypeScript checks
- Linting
- Unit tests for business rules where practical
- Tests for service-layer behavior
- Authorization test matrix for learner, teacher, creator, group admin, and moderator
- Manual auth tests on target devices
- Upload/download access tests for public and private files
- Theme tests for light, dark, and system modes

## PocketBase operational caveat
PocketBase is pre-1.0. Pin the deployed version, read upgrade notes before updating, maintain backups of both database and uploaded files, and periodically test restoring them. Do not assume a future migration will be automatic.

## Code quality
Avoid giant components, repeated API logic, hardcoded production data, fake authentication, and mock flows that remain in production. Use reusable components and keep feature modules reasonably small.
