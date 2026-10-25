# SkillShare — Social Learning Platform MVP

A mobile-first social learning platform built with **React Native**, **Expo (SDK 58)**, **TypeScript**, **Expo Router**, and **PocketBase**.

Learners discover courses, participate in teacher-guided classroom cohorts, submit assignments, collaborate in informal community groups, and attend live sessions.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20+ (developed on v22.18.0)
- **Package Manager**: `npm` (v10.9.3)
- **PocketBase**: Binary included in root (`pocketbase.exe` v0.34.2)

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Default values:
```env
# PocketBase base URL
EXPO_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090

# Optional Google OAuth client ID for mobile flow
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-placeholder.apps.googleusercontent.com
```
*Note: For the Android emulator, use `http://10.0.2.2:8090`.*

### 3. Start PocketBase (Backend)
In a separate terminal window:
```bash
.\pocketbase.exe serve
```
PocketBase dashboard will be accessible at: `http://127.0.0.1:8090/_/`
Refer to [POCKETBASE_SETUP.md](file:///c:/Users/USER/Desktop/dev/Active/SkillShare/POCKETBASE_SETUP.md) for full collection schemas and API rules.

### 4. Start the Mobile App
```bash
npm start
# or
npx expo start
```
From the interactive terminal:
- Press `a` for Android emulator
- Press `w` for Web preview
- Scan QR code with Expo Go on a physical device

---

## 📂 Architecture & Directory Structure

```
SkillShare/
├── assets/                     # App icons, splash screens, and images
├── learning_platform_handoff/  # Architecture and requirements specifications
├── src/
│   ├── app/                    # Expo Router file-based navigation
│   │   ├── (tabs)/             # Main application tabs
│   │   │   ├── _layout.tsx     # Tab bar navigation with 5 primary areas
│   │   │   ├── index.tsx       # Home: Continue learning, upcoming sessions
│   │   │   ├── explore.tsx     # Explore: Search & filters for courses/classes/groups
│   │   │   ├── learning.tsx    # My Learning: Enrolled courses, classes, progress
│   │   │   ├── community.tsx   # Community: Discussion groups and feeds
│   │   │   └── profile.tsx     # Profile: User bio, theme switcher, backend status
│   │   ├── course/[id].tsx     # Course syllabus and enrollment screen
│   │   ├── class/[id].tsx      # Classroom cohort overview, announcements, assignments
│   │   ├── group/[id].tsx      # Group feed, discussions, and post composer
│   │   ├── session/[id].tsx    # Scheduled live session details & meeting launcher
│   │   ├── settings/
│   │   │   └── appearance.tsx  # Appearance settings (Light / Dark / System Default)
│   │   ├── auth/
│   │   │   └── login.tsx       # Authentication screen (Google OAuth & developer test)
│   │   └── _layout.tsx         # Root layout with ThemeProvider and AuthProvider
│   ├── components/
│   │   └── ui/                 # Reusable design system primitives
│   │       ├── Button.tsx      # Primary, secondary, outline, ghost, destructive
│   │       ├── Input.tsx       # Text & search input with error/helper states
│   │       ├── Card.tsx        # Surface container with pressable feedback
│   │       ├── Badge.tsx       # Status badges (accent, success, warning, etc.)
│   │       ├── ProgressBar.tsx # Accent progress bar (0-100%)
│   │       ├── EmptyState.tsx  # Accessible empty state placeholder
│   │       ├── ErrorState.tsx  # Recovery action with retry
│   │       └── LoadingState.tsx# Spinner with message
│   ├── context/
│   │   ├── ThemeContext.tsx    # Theme state (Light, Dark, System Default) with AsyncStorage
│   │   └── AuthContext.tsx     # Persistent PocketBase authentication & user state
│   ├── services/               # Typed PocketBase service layer
│   │   ├── pocketbase.ts       # PocketBase client singleton with AsyncAuthStore
│   │   ├── auth.service.ts     # Google OAuth, password sign-in, profile update
│   │   ├── courses.service.ts  # Courses, lessons, progress, and enrollments
│   │   ├── classes.service.ts  # Class cohorts, announcements, assignments
│   │   ├── groups.service.ts   # Community groups, posts, comments
│   │   ├── sessions.service.ts # Live sessions and schedules
│   │   └── notifications.service.ts # In-app notification triggers
│   ├── theme/
│   │   └── tokens.ts           # Centralized color, typography, spacing, and radius tokens
│   └── types/
│       └── models.ts           # Strict TypeScript domain interfaces
├── .env.example                # Template environment file (no secrets committed)
├── IMPLEMENTATION_STATUS.md    # Detailed roadmap, completed items, and decisions
├── POCKETBASE_SETUP.md         # Complete backend schema and security setup
└── pocketbase.exe              # Pinned PocketBase server executable (v0.34.2)
```

---

## 🎨 Design System & Theming

- **Tokens**: Exact semantic palette from `07_DESIGN_SYSTEM.md`.
  - Light mode: Clean surfaces (`#F7F9F7` background, `#FFFFFF` card)
  - Dark mode: Near-black surfaces (`#101411` background, `#191F1A` card)
  - Accent: Green (`#23864A` light / `#55C878` dark) for meaningful actions, progress, and selected states
- **Appearance Modes**:
  - `System Default`: Follows operating system appearance dynamically.
  - `Light`: Forces light mode.
  - `Dark`: Forces dark mode.
  - Persisted in `@react-native-async-storage/async-storage` across app restarts.
  - Zero hardcoded colors in screens; all styling uses semantic theme tokens.

---

## 🔒 Security & Code Quality

1. **No Client Secrets**: PocketBase superuser credentials, OAuth client secrets, and keys are never bundled in client code.
2. **Backend-Enforced Authorization**: UI hiding is never treated as a permission barrier. Full collection API rules are documented in `POCKETBASE_SETUP.md`.
3. **Strict TypeScript**: Verified with `npx tsc --noEmit` with zero errors.
4. **Linting**: Verified with `npm run lint` (`expo lint`) with zero errors.
5. **Expo Doctor**: Verified with `npx expo-doctor` (20/20 checks passed).
