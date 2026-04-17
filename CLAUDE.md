# CLAUDE.md

## Project Overview

**chore-app** is a single-page office chore manager that lets a team assign, schedule, and track recurring household/office tasks on a monthly calendar view. No backend — all data persists in the browser via localStorage.

## Tech Stack

| Layer | Tech |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Component Library | MUI v9 (Material UI) + Emotion |
| Date Utilities | date-fns v4 |
| Linter | ESLint 9 + typescript-eslint |

## Key Directories

```
chore-app/
  src/
    types.ts              — Data model interfaces (Chore, TeamMember, Recurrence)
    App.tsx               — Root state container; owns all persistent + dialog state
    components/           — UI components (AppHeader, CalendarView, CalendarDayCell,
                            ChoreChip, ChoreFormDialog, MemberManagerDialog)
    hooks/
      useLocalStorage.ts  — Generic hook for JSON-persisted useState
    utils/
      choreOccurrences.ts — Recurrence expansion: maps chores → calendar days
      colors.ts           — Member color palette + next-color assignment
  public/                 — Static assets (favicon, icons)

```

## IMPORTANT

When you work on a new feature or bug, create a git branch first. Then work on changes in that branchfor the remainder of the session.

## Essential Commands

All commands run from `chore-app/`:

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check then bundle for production
npm run preview   # Preview production build locally
npm run lint      # ESLint across all source files
```

No test suite is currently configured.

## Data Persistence

localStorage keys (both JSON arrays):
- `chore-app:members` — `TeamMember[]`
- `chore-app:chores` — `Chore[]`

Dates stored as `"YYYY-MM-DD"` strings throughout the model.

## Additional Documentation

Check these files when working on the relevant areas:

- [`.claude/docs/architectural_patterns.md`](.claude/docs/architectural_patterns.md) — State management, component data flow, recurrence logic, form patterns, color assignment
