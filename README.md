# LeetLearn

LeetLearn is a self-hosted web application built to help structure and optimize LeetCode problem-solving for technical interview preparation.

Instead of solving random problems, LeetLearn provides 16 pattern-based learning paths with a gamified, responsive UI and an automated weekly review system.

---

## Features

- 16 Learning Paths: From Two Pointers to Trie data structures.
- 160 Free Problems: Each path contains exactly 10 free LeetCode problems (2 Easy -> 7 Medium -> 1 Hard).
- Sequential Unlocking: Sequential progression per path where completing one problem unlocks the next.
- 15-Minute Benchmark: Track whether problems were completed in under 15 minutes to identify weak spots.
- Saturday Review System: Automatically picks up to 5 previously solved problems every Saturday for spaced repetition, prioritizing problems where you struggled.
- Docker-Ready: Single-command deployment using Docker Compose.
- Single-User Mode: No authentication required, built for personal self-hosted deployment.

---

## Tech Stack

- Framework: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS, Lucide React Icons
- Database: PostgreSQL, Prisma ORM
- Scheduler: node-cron integrated via Next.js instrumentation
- Containerization: Docker Compose

---

## Quick Start

### Docker Compose Deployment

```bash
# 1. Clone the repository and enter the directory:
   git clone https://github.com/username/leetlearn.git
   cd leetlearn

# 2. Start the containers:
   docker compose up --build -d

# 3. Run database migrations and seed initial data:
   docker compose exec app npx prisma migrate dev --name init
   docker compose exec app npx prisma db seed

# 4. Access the web application at http://localhost:3000.
```

---

## Saturday Review Algorithm

The review queue refreshes every Saturday at midnight UTC and holds up to 5 problems:
1. Unsolved problems remaining in the review queue are retained.
2. Empty slots are filled with previously solved problems from any pattern without duplicates.
3. Priority Criteria:
   1. Problems NOT solved in under 15 minutes (solvedUnder15Min = false).
   2. Problems with the oldest completion timestamp (lastSolvedAt).
