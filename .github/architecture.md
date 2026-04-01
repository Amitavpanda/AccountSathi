# Project Architecture

> Fill this file per-project. Skills reference it to understand your stack and constraints.
> Keep it minimal — tech stack essentials only, no implementation details.

---

## Project Name
<!-- e.g. AccountSathi -->

## Tech Stack

| Layer         | Technology           | Version / Notes       |
|---------------|----------------------|-----------------------|
| Frontend      | Next.js              | App Router            |
| Styling       | Tailwind CSS         |                       |
| UI Components | shadcn/ui            |                       |
| Backend       | Node.js / Express    |                       |
| Database      | PostgreSQL + Prisma  |                       |
| Auth          | Supabase Auth        |                       |
| Hosting       | Vercel (FE)          |                       |
| Monorepo      | Turborepo            |                       |

## Package Structure

```
apps/
  web/          ← Next.js frontend
  api/          ← Node.js backend
packages/
  db/           ← Prisma client + schema
  ui/           ← Shared component library
  validations/  ← Zod schemas (shared FE + BE)
  logs/         ← Logging utilities
```

## Key Engineering Constraints

- **Row-Level Security (RLS)**: All Supabase tables use RLS — queries must be scoped to `auth.uid()`
- **Monorepo**: Packages are consumed via workspace aliases (`@repo/ui`, `@repo/db`)
- **API Base URL**: Accessed via `NEXT_PUBLIC_UI_BASE_URI` env var on the frontend
- **No client-side DB calls**: Backend API is the single data access layer
- **Type Safety**: End-to-end TypeScript; Zod schemas shared between FE and BE via `@repo/validations`

## Environment Variables

| Variable                   | Where Used | Purpose                        |
|----------------------------|------------|--------------------------------|
| `NEXT_PUBLIC_UI_BASE_URI`  | Frontend   | API base URL                   |
| `DATABASE_URL`             | Backend    | Prisma direct connection       |
| `DIRECT_URL`               | Backend    | Prisma direct URL (Supabase)   |
| `SUPABASE_URL`             | Backend    | Supabase project URL           |
| `SUPABASE_SERVICE_KEY`     | Backend    | Service role key (server only) |

## Team Structure

| Role              | Skill File                                          |
|-------------------|-----------------------------------------------------|
| Frontend Engineer | `.github/skills/frontend-engineer/SKILL.md`        |
| Backend Engineer  | `.github/skills/backend-engineer/SKILL.md`         |
| Full-Stack        | `.github/skills/fullstack-engineer/SKILL.md`       |
| Tech Lead         | `.github/skills/tech-lead/SKILL.md`                |
| QA Engineer       | `.github/skills/qa-strategy/SKILL.md`              |
| DevOps            | `.github/skills/devops-engineer/SKILL.md`          |

## Links

- Supabase Dashboard: <!-- add link -->
- Vercel Dashboard: <!-- add link -->
- Design System (Figma): <!-- add link -->
- API Docs: <!-- add link -->
