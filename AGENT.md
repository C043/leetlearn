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

## Codebase Conventions

1. Use Next.js App Router (src/app).
2. API routes located under src/app/api/.
3. Singleton Prisma client in src/lib/db.ts to prevent connection pool exhaustion during development.
4. Component code structured inside src/components/duolingo/ and src/components/review/.
5. Do not include authentication modules.
