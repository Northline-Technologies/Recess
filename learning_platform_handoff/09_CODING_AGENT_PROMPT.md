# Coding Agent Prompt

You are implementing a mobile learning platform from the supplied UI screenshots, UX-flow diagram, and Markdown specifications.

## Before coding
1. Inspect the existing repository and report its current stack, structure, and working state.
2. Read all supplied Markdown files.
3. Inspect every supplied UI screenshot and the UX-flow diagram.
4. Identify conflicts, missing decisions, and risky assumptions before making major architectural changes.
5. Propose a small phased plan and start with the first complete vertical slice. Do not rewrite a working repository without a clear reason.

## Source of truth
- `03_PRODUCT_SPEC.md`: product behavior and domain rules
- `04_USER_STORIES.md`: user goals and acceptance expectations
- `05_TECHNICAL_REQUIREMENTS.md`: stack and engineering constraints
- `06_DATA_MODEL.md`: proposed entities and relationships
- `07_DESIGN_SYSTEM.md`: visual system and themes
- `08_MVP_IMPLEMENTATION_PLAN.md`: implementation order
- UI screenshots: visual reference
- UX-flow diagram: navigation and interaction reference

If references conflict, explain the conflict instead of silently guessing.

## Required stack
- React Native
- Expo
- TypeScript
- Expo Router
- PocketBase
- Official PocketBase JavaScript SDK

Do not introduce a second backend framework or unnecessary infrastructure. PocketBase is the initial backend. Keep the data-access boundary modular enough to reduce future migration effort, but do not overengineer abstractions.

## Implementation rules
- Match the supplied UI references closely while adapting their visual language to the learning product.
- Support Light, Dark, and System themes from the beginning.
- Use semantic theme tokens; no hardcoded theme colors inside reusable components.
- Use real PocketBase-backed flows for features marked implemented.
- Never claim a mock or placeholder flow is complete.
- Separate UI, service/data access, and domain logic.
- Use typed models and reusable components.
- Enforce authorization on the backend, not just in the UI.
- Keep Group Admin/Moderator permissions scoped to each group.
- Keep Teacher permissions scoped to classes they teach.
- Students must not be able to change grades and must not see another student's private submission or unpublished grade.
- Never ship PocketBase superuser credentials, OAuth secrets, or AWS keys in the app.
- Handle loading, empty, error, success, permission-denied, and retry states.
- Paginate growing lists and optimize media for mobile.
- Preserve user-entered content when practical if a request fails.
- Document collection/schema changes and keep migrations repeatable.
- Do not add payments, advanced analytics, certificates, or native live video unless requested.

## Working method
1. Make small, reviewable changes.
2. Run type checks and linting after meaningful changes.
3. Test each flow using multiple accounts with different permissions.
4. Report files changed, features completed, commands/tests run, and known limitations.
5. Do not claim tests passed unless they were actually run.
6. If a requirement is ambiguous and materially affects architecture or security, ask before committing to it.
7. Keep a concise `IMPLEMENTATION_STATUS.md` updated with completed work, pending work, known issues, and setup instructions.

## First milestone
Deliver:
- A bootable Expo app
- Theme system with Light/Dark/System
- Navigation matching the UX-flow
- Reusable design primitives
- PocketBase connection/configuration
- Authentication skeleton with Google OAuth configuration documented
- `.env.example`
- Setup instructions
- No exposed secrets

Do not attempt to implement the whole product in one giant pass.
