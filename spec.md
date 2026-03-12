# RizzAssist

## Current State

The site is a full-stack ICP app with:

**Backend (Motoko)**
- `PickupLine` type: `id`, `text`, `instagramUrl`, `reportCount`, `likeCount`, `isSystem`, `status`
- Submit, approve, reject, report, like, and query (all / approved / pending) endpoints
- `getLineWithGuide` generates usage tips based on detected line type
- No: downvotes, categories/tags, comments, usernames, emoji reactions, copy tracking, Rizz of the Day

**Frontend (React)**
- Dark crimson red theme, Bricolage Grotesque + Sora fonts
- Hero section, AI Rizz Generator (local topic database), Community Feed grid
- Admin panel with password gating ("garvit")
- Basic like (backend) + copy (client) per card
- Search filter (client-side), random line modal
- PickupLineDetail dialog with usage guide

## Requested Changes (Diff)

### Add

**Backend**
- `downvoteCount` field on `PickupLine`
- `category` field on `PickupLine` (variant: Funny | Smooth | Cheesy | Savage | Romantic | Nerdy | Opener | Comeback | Cringe | Uncategorized)
- `username` optional field on `PickupLine` (submitted by user)
- `copyCount` field for tracking copies (increment via new `recordCopy` endpoint)
- `emojiReactions` field: record of 4 emoji counts (laugh, heart, fire, skull)
- `submittedAt` timestamp (Int / nanoseconds from Time.now())
- New endpoints: `downvotePickupLine`, `recordCopy`, `addEmojiReaction(id, emoji)`, `getRizzOfTheDay`, `getLeaderboard` (returns top users by upvote total), `submitComment(lineId, text, username)`, `getComments(lineId)` 
- `Comment` type: `id`, `lineId`, `text`, `username`, `submittedAt`
- `submitPickupLine` updated to accept optional `username` and `category` params

**Frontend — Content Interaction**
- Upvote + downvote buttons on every card (replace single like button); upvote calls existing `likePickupLine`, downvote calls `downvotePickupLine`
- Sorting bar: Trending Today | Top of All Time | Newest | Underrated
- Copy button already exists — add "Copied! Share it with a friend 🔥" toast after copy
- Random Rizz button already exists — keep it
- Search bar already exists — keep it
- Category/tag filter bar below search (All + 9 categories); filters community feed client-side

**Frontend — AI Tools**
- "Improve My Rizz" section: textarea input + Generate button → shows 3 improved variants (use existing `generateAiLines` pattern with improvement templates)
- AI Generator already exists — keep it, extend with more themes if helpful

**Frontend — Engagement**
- Username field on submit form (optional)
- Leaderboard panel (sidebar or collapsible section) showing top 10 users by total upvotes
- Comments section inside PickupLineDetail dialog (list + add comment form)
- Emoji reactions row on each card (😂 ❤️ 🔥 💀) with per-emoji counts

**Frontend — Viral Mechanics**
- Share button on each card that generates a styled text card and copies/shares it
- "Rizz of the Day" banner at top of feed (highest voted line from today, highlighted with fire styling)
- Post-copy toast: "Copied! Share it with a friend 🔥"

**Frontend — Discovery**
- Trending panel (collapsible sidebar or section) showing: trending tags (by frequency), most copied lines (top 5), top creators (by upvotes)

**Frontend — UI**
- Dark mode toggle in header (toggle between current dark theme and a lighter variant)
- Infinite scroll / "Load More" button for feed (show 12 at a time, load more on scroll/click)
- Confetti animation when a line hits 100 upvotes

### Modify

- `submitPickupLine` backend signature: add `username ?Text` and `category` variant params
- `PickupLine` type: add `downvoteCount`, `category`, `username`, `copyCount`, `emojiReactions`, `submittedAt`
- `SubmitPickupLineForm`: add optional username input, category select dropdown
- `FeedCard`: replace single like with upvote/downvote, add emoji reactions row, share button
- `PickupLineFeed`: add sorting bar, category filter bar, infinite scroll, Rizz of the Day banner, Trending panel
- `PickupLineDetail`: add comments section
- `AppHeader`: add dark mode toggle button

### Remove

- Nothing removed — all existing functionality preserved

## Implementation Plan

1. **Backend**: Add new fields (`downvoteCount`, `category`, `username`, `copyCount`, `emojiReactions`, `submittedAt`) and new types (`Comment`, `Category`, `EmojiType`). Add endpoints: `downvotePickupLine`, `recordCopy`, `addEmojiReaction`, `getRizzOfTheDay`, `getLeaderboard`, `submitComment`, `getComments`. Update `submitPickupLine` signature.

2. **Frontend hooks**: Add `useDownvotePickupLine`, `useRecordCopy`, `useAddEmojiReaction`, `useRizzOfTheDay`, `useLeaderboard`, `useComments`, `useSubmitComment` in `useQueries.ts`.

3. **AI Improve My Rizz lib**: Add `improveRizzLine(line: string): string[]` to `aiRizzGenerator.ts` returning 3 improved variations.

4. **FeedCard**: Upvote + downvote buttons, emoji reactions row (4 emojis with counts), share button, post-copy toast, confetti at 100 upvotes.

5. **PickupLineFeed**: 
   - Rizz of the Day banner (top section before feed)
   - Sort bar (Trending Today / Top All Time / Newest / Underrated)
   - Category filter chips
   - Infinite scroll (12 per page, Load More button)
   - Trending panel (tags, most copied, top creators)
   - "Improve My Rizz" section

6. **SubmitPickupLineForm**: Add username input + category select.

7. **PickupLineDetail**: Add comments section (list + form).

8. **AppHeader**: Add dark mode toggle.

9. **AppLayout / index.css**: Dark mode class toggle support using `localStorage` + `document.documentElement.classList`.
