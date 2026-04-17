# Architectural Patterns

## State Management: Single Root Owner

All persistent and dialog state lives in `App.tsx`. No Context API or external state library is used.

**Persistent state** (via `useLocalStorage`):
- `members: TeamMember[]` — keyed `chore-app:members`
- `chores: Chore[]` — keyed `chore-app:chores`

**Ephemeral state** (plain `useState`):
- `viewDate`, `choreDialogOpen`, `memberDialogOpen`, `editingChore`, `defaultDate`

Pattern: App owns state → passes arrays + callbacks as props → children call callbacks → App updates state → re-render propagates down.

## Custom Hook: useLocalStorage

`hooks/useLocalStorage.ts` wraps `useState` with automatic JSON read/write to localStorage. It has the same API as `useState` — returns `[value, setter]`. Any component needing persisted state uses this instead of `useState`.

File: `src/hooks/useLocalStorage.ts`

## Props Drilling (intentional, no Context)

Data flows strictly top-down. Dialogs (`ChoreFormDialog`, `MemberManagerDialog`) are siblings of `CalendarView` — all three are children of `App` and receive their data/callbacks via props. No shared context exists between sibling components.

## Dialog Pattern: Controlled by Parent

Both modal dialogs follow the same pattern:
1. Parent (`App`) controls `open` boolean and the data to edit (`editingChore`)
2. Dialog maintains its own local form state (`useState`)
3. `useEffect` resets local form state whenever the dialog opens or `editingChore` changes
4. On save: dialog calls parent callback, parent updates array, dialog closes
5. Validation (non-empty title, valid date) happens at save time inside the dialog

Files: `src/components/ChoreFormDialog.tsx`, `src/components/MemberManagerDialog.tsx`

## Upsert Pattern for Chores

`handleSaveChore` in `App.tsx` handles both create and update with a single `findIndex` check:
- If `chore.id` found in array → replace in-place
- If not found → append

This means `ChoreFormDialog` always generates a UUID for new chores and the parent never needs to distinguish create vs. update.

File: `src/App.tsx`

## Recurrence Expansion at Render Time

Chores are stored as rules (start date, end date, recurrence type/day), not as pre-expanded occurrences. `getChoresForMonth(chores, year, month)` in `choreOccurrences.ts` expands them into a `Map<"YYYY-MM-DD", Chore[]>` on every render. No caching.

Recurrence rules:
- `none` — appears on `startDate` only
- `daily` — every day between `startDate` and `endDate`
- `weekly` — every matching `dayOfWeek` (0–6) in range
- `monthly` — `dayOfMonth` (1–31) each month in range

File: `src/utils/choreOccurrences.ts`

## Color Assignment

`colors.ts` exports a fixed palette of 10 hex colors. `getNextColor(usedColors)` returns the first palette color not in `usedColors`; if all are taken, it wraps via modulo. Members are assigned colors at creation time; the color is stored on the `TeamMember` object.

ChoreChip falls back to `#90a4ae` when `assignedTo` is null.

File: `src/utils/colors.ts`

## Member Deletion Cascades to Chores

When a member is deleted in `MemberManagerDialog`, the parent callback (`handleDeleteMember` in `App.tsx`) both removes the member from `members` and sets `assignedTo = null` on all chores that referenced them. No orphaned foreign keys.

## Event Propagation: Chip Stops Propagation

`ChoreChip` calls `e.stopPropagation()` on click to prevent the parent `CalendarDayCell`'s onClick (which opens the "add chore" dialog) from also firing when the user intends to edit an existing chore.

File: `src/components/ChoreChip.tsx`
