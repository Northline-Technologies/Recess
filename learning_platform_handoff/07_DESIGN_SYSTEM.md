# Design System

## Visual direction

Use the supplied final UI screenshots as the visual source of truth. The current direction is a clean, light, productivity-focused learning platform with green accents.

The screenshots define visual language, not necessarily the source app's information architecture. Preserve this product's Courses, Classes, Groups, Sessions, and learning workflows.

## Themes

Support three preferences:
- System Default
- Light
- Dark

Persist the preference and update the app immediately when it changes. System Default follows the device appearance setting.

## Semantic color tokens

Use semantic tokens rather than hardcoding colors in components. The values below are starting points; refine them against the actual supplied screenshots and accessibility contrast checks.

### Light theme
- `background`: `#F7F9F7`
- `surface`: `#FFFFFF`
- `surfaceSecondary`: `#F0F3F0`
- `textPrimary`: `#171B18`
- `textSecondary`: `#626B64`
- `border`: `#DDE4DE`
- `accent`: `#23864A`
- `accentPressed`: `#176B38`
- `onAccent`: `#FFFFFF`
- `success`: `#237A43`
- `warning`: `#946200`
- `error`: `#B42318`
- `disabled`: `#A7AEA9`

### Dark theme
- `background`: `#101411`
- `surface`: `#191F1A`
- `surfaceSecondary`: `#222A23`
- `textPrimary`: `#F3F6F3`
- `textSecondary`: `#B0BBB2`
- `border`: `#343E35`
- `accent`: `#55C878`
- `accentPressed`: `#75D991`
- `onAccent`: `#102015`
- `success`: `#75D991`
- `warning`: `#F2C66D`
- `error`: `#FF8A80`
- `disabled`: `#69736B`

These are proposed tokens, not a claim that the screenshots contain these exact pixel values.

## Design principles
- Clean, friendly, professional, and productive.
- Readability over density.
- Use whitespace to separate content.
- Use green for primary actions, active states, and meaningful progress—not as a decoration on every element.
- Avoid excessive cards, borders, shadows, gradients, and animations.
- Both themes must be intentionally designed; do not simply invert colors.

## Typography
Use a modern sans-serif font supported by the app. Establish reusable text styles:
- Display
- Screen title
- Section title
- Card title
- Body
- Secondary body
- Caption
- Button label

Maintain clear hierarchy and comfortable line height. Do not rely on tiny text for important metadata.

## Spacing
Use a consistent scale:
`4, 8, 12, 16, 20, 24, 32, 40`.

## Shape and elevation
- Use consistent corner radii.
- Keep shadows subtle and restrained.
- Use borders and surface contrast as the primary separation mechanism.
- Avoid putting every element inside its own card.

## Component patterns
Create reusable components where useful:
- Buttons and icon buttons
- Text inputs and search
- Course card
- Class card
- Group card
- Session card
- Assignment card
- Grade/feedback panel
- Avatar
- Progress indicator
- Tabs
- Modal/sheet
- Notification item
- Empty state
- Error state
- Skeleton/loading state
- Bottom navigation

Reuse components without forcing unrelated screens into identical layouts.

## Product-specific visual distinctions
- Courses should emphasize learning content, creator, duration, difficulty, and progress.
- Classes should emphasize teacher, cohort, schedule, progress, and deadlines.
- Groups should feel more social, emphasizing activity, members, discussions, and resources.
- Assignments should clearly show due date and submission state.
- Grades should show score and feedback only to authorized users.
- Creator/teacher tools should feel professional but remain consistent with the consumer-facing app.

## Navigation
Use the exact navigation and screen hierarchy in the final UX-flow diagram. The current proposed top-level destinations are Home, Explore, Community, Library, and Profile; do not treat this proposal as overriding the final flow diagram.

## Responsive mobile behavior
- Prioritize common phone widths around 360–430 px.
- Use comfortable touch targets.
- Respect safe areas and keyboard behavior.
- Support dynamic text sizing where practical.
- Avoid horizontal overflow and clipped primary actions.

## Accessibility
- Maintain readable contrast in both themes.
- Do not use color as the only status indicator.
- Provide accessible labels for icon-only controls.
- Respect reduced motion and system font scaling where practical.

## Loading, empty, and error states
Every major screen needs intentional loading, empty, and error states. Errors should explain the problem in plain language and offer retry when appropriate. Avoid blank screens and raw backend error messages.

## Source-of-truth rules
- UI screenshots: appearance and component styling.
- UX-flow diagram: navigation and behavior.
- Product spec: domain rules.
- Technical requirements: implementation constraints.

When details are ambiguous, preserve the product rules and ask rather than inventing a conflicting workflow.
