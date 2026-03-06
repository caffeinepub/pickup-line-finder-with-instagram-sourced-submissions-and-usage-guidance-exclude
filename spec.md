# Specification

## Summary
**Goal:** Make the backend-generated “How to Use” guidance vary based on each pickup line’s content, avoid duplicating the line text, and reliably include a non-empty Context section.

**Planned changes:**
- Update `generateHowToUseGuide` (backend) so the returned `howToUse` guidance is derived from the pickup line content instead of using the same generic text for all lines.
- Implement deterministic `detectLineType` heuristics in `backend/main.mo` to classify lines into multiple categories and drive category-specific guidance selection.
- Remove repeated pickup line text from the `howToUse` output so it contains guidance sections only (Context/Timing/Follow-up/etc.).
- Ensure `howToUse` never includes an empty “Context:” section by providing a default non-empty English context when none is inferred.

**User-visible outcome:** When viewing different pickup lines, the “How to Use” section provides distinct, relevant guidance without repeating the pickup line, and the Context section is always filled.
