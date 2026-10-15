# AGENT.md - Context & Instructions for AI Coding Agents

## Project Overview
LeetLearn is a self-hosted personal web application built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.
It structures LeetCode practice into 16 pattern-based learning paths with a Duolingo-style UI and an automated weekly spaced-repetition system.

---

## Architecture and Domain Rules

### 1. Structure of a Learning Path (Pattern)
- There are 16 Patterns, each containing 10 LeetCode problems:
  - 2 Easy -> 7 Medium -> 1 Hard (sequence order: 1 to 10).
- Progress within a pattern is sequential: problem order N unlocks when problem order N-1 is marked as isSolved = true. Order 1 is unlocked by default.
- Users can switch between different pattern paths at any time.

### 2. Problem Resolution Flow
- LeetLearn does not host a code runner. External problem links direct users to LeetCode.
- Clicking a problem node opens a modal with:
  - Problem title and external LeetCode URL.
  - Completion prompt: "Solved in under 15 minutes?" with a Green Check (TRUE) and Red X (FALSE).
- Submitting an answer sets isSolved = true, records lastSolvedAt = now(), updates solvedUnder15Min, and sets unlocked = true for problem order N + 1.
- If completed from the Review section, inReview is reset to false.

### 3. Saturday Review System
- The review queue holds up to 5 problems maximum.
- Managed by src/lib/review-service.ts and triggered via node-cron or fallback check on application launch.
- Selection Algorithm Rules:
  1. Retain problems currently in review that have not been re-solved.
  2. Fill remaining slots up to 5 with problems where isSolved == true AND inReview == false.
  3. Priority Ranking for Candidates:
     - Priority 1: solvedUnder15Min == false.
     - Priority 2: lastSolvedAt timestamp is oldest.

### 4. Streaks and Reminders
- Any solve (path or review) upserts today's `ActivityDay` row, keyed YYYY-MM-DD in `AppSettings.timeZone` (sent by the client on solve/subscribe).
- The streak is derived from consecutive `ActivityDay` rows (src/lib/streak.ts), so there is no counter to keep in sync.
- src/lib/streak-reminders.ts runs every 10 minutes via node-cron: stage 1 at `reminderHour`, stage 2 at 22:00, only while the streak is at risk; each stage fires at most once a day.
- Push is Web Push with VAPID (src/lib/push.ts). Keys come from env, or are generated and stored in `AppSettings`. Expired subscriptions (404/410) are pruned.
- public/sw.js must always show a notification on `push`: iOS revokes permission otherwise.

### Schema Changes
- Docker runs `prisma db push` on boot against a database already in use. Keep changes additive (new tables, nullable or defaulted columns). Never rename or drop columns.

---

## Database Schema (prisma/schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

model Pattern {
  id          String    @id @default(uuid())
  name        String
  description String    @db.Text
  order       Int       @unique
  problems    Problem[]
}

model Problem {
  id               String     @id @default(uuid())
  title            String
  leetcodeUrl      String
  difficulty       Difficulty
  order            Int

  isSolved         Boolean    @default(false)
  solvedUnder15Min Boolean    @default(false)
  lastSolvedAt     DateTime?
  unlocked         Boolean    @default(false)

  inReview         Boolean    @default(false)
  addedToReviewAt  DateTime?

  patternId        String
  pattern          Pattern    @relation(fields: [patternId], references: [id], onDelete: Cascade)

  @@unique([patternId, order])
}

model ReviewSystemState {
  id            Int      @id @default(1)
  lastRotatedAt DateTime @default(now())
}

// One row per calendar day (in the user's time zone) with at least one solve.
// The streak is derived from consecutive days, so there is no counter to drift.
model ActivityDay {
  day    String @id // YYYY-MM-DD
  solves Int    @default(0)
}

// Single-row app settings (single-user mode).
model AppSettings {
  id                 Int     @id @default(1)
  timeZone           String  @default("UTC")
  reminderHour       Int     @default(20) // local hour for the first streak reminder
  lastReminderDay    String? // YYYY-MM-DD of the last reminder sent
  lastReminderStage  Int     @default(0)  // 1 = evening nudge, 2 = last call
  // Generated on first use unless VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are set
  vapidPublicKey     String?
  vapidPrivateKey    String?
}

model PushSubscription {
  id        String   @id @default(uuid())
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())
}
```

---

## UI Guidelines

- Design Style: Duolingo-inspired path layout.
- Path Visualization: Winding zigzag or snake path of circular buttons representing problem nodes.
- Node States:
  - Locked: Grayed out with lock icon (unlocked = false).
  - Available: Interactive highlight (unlocked = true, isSolved = false).
  - Completed: Checkmark or distinct color (isSolved = true).
- Modal Behavior: Exactly one problem modal can be open at a time. Opening a new node closes any open modal.

---

## Test-Driven Development (required)

Every new feature and every bug fix is built test-first. No production code is written without a failing test that demands it.

### The Cycle
1. Red: write the smallest test that describes the next piece of behavior. Run it and watch it fail for the expected reason (not a typo or import error).
2. Green: write the minimum production code to make it pass. Run the full suite.
3. Refactor: clean up the code and the tests while everything stays green.
4. Repeat until the feature is complete. Each domain rule in this file (unlocking, review selection, streaks, training) should map to at least one test.

### Bug Fixes
- First write a test that reproduces the bug and fails. Then fix it. The test stays in the suite as a regression guard.

### Tooling
- Test runner: Vitest. Tests live next to the code they cover as `*.test.ts` / `*.test.tsx` (e.g. src/lib/streak.test.ts).
- `npm test` runs the suite once; `npm run test:watch` runs it in watch mode. The suite must pass before a change is considered done.
- If Vitest is not set up yet, setting it up (config + scripts) is the first step of the next feature.

### What to Test
- Domain logic in src/lib/ (review selection and priority ranking, streak derivation, reminder stages, training session building, `normalizeAnswer`): unit tests with plain inputs and a fixed clock (`vi.useFakeTimers` / `vi.setSystemTime`). Keep this logic in pure functions so it can be tested without a database.
- API routes and code that touches Prisma: test against a separate test database (`DATABASE_URL` pointing at a throwaway Postgres schema), never the real one. Reset state between tests.
- Content (src/content/): keep the build-time validators covered, including a failing case for each rule they enforce.
- Components: test behavior a user can see (node states, modal open/close, answer feedback) with React Testing Library, not implementation details.

### Rules
- Never change or delete a test just to make it pass. If a test is wrong, say so and fix the test in its own step.
- Don't skip, `.only`, or comment out tests in committed code.
- Tests use time zones and dates explicitly; never rely on the machine's local time.

---

## Codebase Conventions

1. Use Next.js App Router (src/app).
2. API routes located under src/app/api/.
3. Singleton Prisma client in src/lib/db.ts to prevent connection pool exhaustion during development.
4. Component code structured inside src/components/duolingo/, src/components/review/ and src/components/streak/.
5. Do not include authentication modules.
