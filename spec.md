# RizzAssist

## Current State

- Full-stack app with Motoko backend and React/TypeScript frontend.
- Backend stores pickup lines with a `status` field: `#pending | #approved | #rejected`.
- `submitPickupLine` creates lines with `#pending` status.
- `getAllPickupLines()` returns ALL lines regardless of status — this is the root of the approval bug.
- `getPendingPickupLines()` correctly filters to pending only (used by AdminPanel).
- `approvePickupLine` and `rejectPickupLine` update the status field correctly in the backend.
- Frontend community feed uses `getAllPickupLines()` and does NOT filter by status — so pending and rejected lines appear in the feed.
- Like system is pure local React state (`useState`) per card — resets on refresh, not shared across users.
- AI generator is a static lookup table (`aiRizzGenerator.ts`) that pattern-matches topics to pre-written lines. It is not actually AI-powered. The section exists in the UI but returns pre-canned results.

## Requested Changes (Diff)

### Add
- Backend: new query `getApprovedPickupLines()` that returns only lines with `#approved` status.
- Backend: `likePickupLine(id)` mutation that increments a `likeCount` field stored on the line.
- Backend: `PickupLine` type extended with `likeCount: Nat` field.
- Frontend: seed data / existing system lines get `likeCount = 0` default.
- AI Generator: replace static lookup with a smarter algorithmic generator that produces varied, contextually relevant lines using the topic as input. More varied output so it doesn't feel like a lookup table. Add many more topic templates and use topic interpolation so every topic produces unique lines.

### Modify
- Backend: `getAllPickupLines()` renamed to keep existing use but community feed now calls `getApprovedPickupLines()` instead.
- Frontend `usePickupLines` hook: change `queryFn` to call `getApprovedPickupLines()` instead of `getAllPickupLines()`.
- Frontend `FeedCard`: replace local `useState` like with a call to `useLikePickupLine` mutation; read `likeCount` from the backend data rather than a random number. Like button optimistically updates count and is persisted.
- Frontend `PickupLineFeed`: `visiblePickupLines` filter already handles `reportCount` threshold — keep that but remove any other filtering since backend now sends only approved lines.

### Remove
- Nothing removed.

## Implementation Plan

1. Update Motoko backend:
   - Add `likeCount: Nat` to `PickupLine` type.
   - Add `getApprovedPickupLines()` query that filters `status == #approved`.
   - Add `likePickupLine(id: Nat)` shared function that increments `likeCount`.
   - Update `submitPickupLine` to include `likeCount = 0` in new records.

2. Regenerate backend (generate_motoko_code).

3. Update frontend:
   - `useQueries.ts`: add `useApprovedPickupLines` hook calling `getApprovedPickupLines()`, add `useLikePickupLine` mutation.
   - `App.tsx`: switch from `usePickupLines` to `useApprovedPickupLines`.
   - `FeedCard`: use backend `likeCount` from props, wire like button to `useLikePickupLine` mutation with optimistic update.
   - `aiRizzGenerator.ts`: expand topic database significantly and add interpolation logic so every topic (even unknown) generates creative, varied multi-line pickup lines that feel fresh.
