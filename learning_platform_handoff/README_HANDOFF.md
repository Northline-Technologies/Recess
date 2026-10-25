# Learning Platform — Coding Agent Handoff

## What this package contains

- `03_PRODUCT_SPEC.md` — product scope and domain rules
- `04_USER_STORIES.md` — user goals and acceptance principles
- `05_TECHNICAL_REQUIREMENTS.md` — implementation constraints and stack
- `06_DATA_MODEL.md` — proposed PocketBase collections and relationships
- `07_DESIGN_SYSTEM.md` — visual rules for light and dark themes
- `08_MVP_IMPLEMENTATION_PLAN.md` — suggested build order and definition of done
- `09_CODING_AGENT_PROMPT.md` — copy/paste prompt for the coding agent

Also provide the agent with your final UI screenshots and the latest UX-flow diagram. Those images are not included in this Markdown package.

## Recommended stack

- React Native
- Expo
- TypeScript
- Expo Router
- PocketBase as the initial backend
- PocketBase JavaScript SDK
- Google OAuth first; Apple Sign In as a separately tested provider
- PocketBase file storage initially
- Amazon S3-compatible storage later if media volume or delivery needs justify it

## Source-of-truth order

If references conflict, follow this order:

1. Explicit user instructions in the current task
2. `03_PRODUCT_SPEC.md` for product rules
3. `06_DATA_MODEL.md` for entities and relationships
4. UX-flow diagram for navigation and behavior
5. UI screenshots and `07_DESIGN_SYSTEM.md` for appearance
6. `05_TECHNICAL_REQUIREMENTS.md` for implementation constraints

If a conflict remains, document it and ask instead of silently inventing a product rule.

## Important PocketBase note

PocketBase is a practical MVP choice, but it is still pre-1.0 and its documentation cautions against relying on it for production-critical applications without accepting migration and compatibility risks. Pin the version, back up the database and files, test restores, and keep schema migrations under version control.

Do not claim the app is production-secure merely because collection rules exist. Test authorization with multiple accounts and roles before release.
