# RizzAssist

## Current State
- Users can submit multi-line pickup lines via a form.
- All submitted lines are immediately visible in the public feed.
- Backend stores `PickupLine` records with `id`, `text`, `instagramUrl`, `reportCount`, `isSystem`.
- Frontend has Browse / Random / Submit nav buttons plus a detail modal.
- No approval workflow; no admin functionality exists.

## Requested Changes (Diff)

### Add
- `status` field on `PickupLine`: `#pending | #approved | #rejected`.
- Backend `getPendingPickupLines()` — returns all lines with status `#pending`.
- Backend `approvePickupLine(id)` — sets status to `#approved`.
- Backend `rejectPickupLine(id)` — sets status to `#rejected`.
- `getAllPickupLines()` modified to return only `#approved` lines to public users.
- Frontend `AdminPanel` component — password-gated (`garvit`) page showing pending lines with Approve / Reject buttons.
- "Admin" button in the header that opens a password modal; on correct password navigates to the admin panel view.
- Admin panel shows a count badge of pending items on the button.

### Modify
- `submitPickupLine` now sets initial `status = #pending` instead of making the line immediately public.
- `usePickupLines` hook — unchanged (already calls `getAllPickupLines` which will now filter to approved only).
- `App.tsx` — add `admin` view type and render `AdminPanel` when active.
- `AppHeader` — add Admin button that triggers password modal.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `main.mo`: add `status` variant type, update `PickupLine` type, update `submitPickupLine`, update `getAllPickupLines` to filter approved, add `getPendingPickupLines`, `approvePickupLine`, `rejectPickupLine`.
2. Regenerate `backend.d.ts` to expose new methods.
3. Add `useAdminQueries` hooks: `usePendingPickupLines`, `useApprovePickupLine`, `useRejectPickupLine`.
4. Create `AdminPanel.tsx` — list pending lines with approve/reject actions, empty state.
5. Create `AdminPasswordModal.tsx` — simple password input dialog, validates `garvit`.
6. Update `AppHeader.tsx` — add Admin button with pending count badge, wire to password modal.
7. Update `App.tsx` — add `admin` view, render `AdminPanel` when active.
