# Widget Design Improvements Based on Real Interaction With the Oak MCP

This document synthesises:

- Observed behaviour from actually calling preview-branch tools
- Real gaps and irregularities in Oak’s data (e.g., missing lessons, inconsistent quiz indexing)
- Earlier research into canonical OpenAI App widget patterns
- UX and engineering best practices from the Apps SDK
- Lessons learned from trying to navigate search/fetch flows in practice

---

# 1. Build widgets around **capability detection**, not assumptions

## 1.1 Why

We discovered that:

- Lesson slugs in Open Data _never_ match lesson slugs in the MCP API.

## 1.2 Recommendation

Before rendering lesson-specific UI, the widget should understand the lesson's content availability. Then use a “content availability matrix” to determine what UI blocks to render. In practice this is addressed by the `get-lesson-details` aggregated tool detailed below.

## 1.3 Benefits

- Prevents dead UI states (“quiz coming soon”, “no transcript found”).
- Avoids backend assumptions about data shape.
- Ensures UX consistency even with inconsistent datasets.

---

# 2. Unify lesson interactions into a **single persistent widget** with modes

## 2.1 Why

We saw that:

- Repeated calls generate repeated widgets if outputTemplates are reused.
- The search–fetch–quiz–summary chain spans multiple tools.
- The natural flow involves users jumping between search results, units, lessons, assets.

## 2.2 Recommendation

Adopt a **single-widget state machine**:

```text
mode: "search" | "unit" | "lesson" | "assets" | "quiz" | "transcript"
```

The widget should declare the mode, not the model.

Your backend only returns:

```json
{
  "sessionId": "...",
  "mode": "lesson",
  "lesson": { ...summary... },
  "quiz": { ...ifLoaded... },
  "assets": { ...ifLoaded... }
}
```

## 2.3 Benefits

- Chat stays clean.
- Updates happen inside the widget.
- Navigation feels app-like and predictable.

---

# 3. Make the widget a **data browser** rather than a “tool invoker”

## 3.1 Why

Users are navigating:

- Hierarchical data (subject → units → lessons)
- Patchy availability (some lessons missing quizzes/assets/transcripts)
- Ambiguous search results (semantic search returning irrelevant lessons)

## 3.2 Recommendation

The widget should include:

- **Search panel** (keyword + KS + subject)
- **Results list** with metadata (key stage, unit, subject)
- **Viewer panel** showing:
  - Summary
  - Quiz (if present)
  - Assets
  - Transcript preview

Treat the widget as the “source of truth for navigation” rather than chat-mediated multi-step interactions.

## 3.3 Benefits

- Reduces cognitive load on the model.
- Prevents accidental tool spam.
- Gives the user a coherent, stable interface.

---

# 4. Reflect the inconsistencies of the Preview dataset with **resilient UI affordances**

## 4.1 Observations

- Searching “Growing in the garden” returns only semantically related content.
- Many KS1/KS2 art lessons exist, but EYFS and Drama do not.
- Some fields are optional across lessons (e.g., no transcript, no guidance).
- Some units have assets but no quiz; others have full quiz sets.

## 4.2 Recommendation

Show explicit empty-state UI:

- **Quiz:** “This lesson has no quiz.”
- **Assets:** “This lesson has no downloadable resources.”
- **Transcript:** “No transcript available for this lesson.”
- **Search:** “No direct matches — here are related lessons.”

Use a simple pattern:

```js
if (!quiz || quiz.length === 0) {
  renderNoQuizMessage();
}
```

## 4.3 Benefits

- Prevents broken UI attempts to render missing data.
- Improves trust and transparency.
- Reduces guesswork.

---

# 5. Decouple widget-visible state from API data

We established earlier:

- `widgetState` should hold **model-visible summaries**, _not_ full API blobs.
- API results should live in `toolOutput`.

## 5.1 Recommendation

Keep `widgetState` tiny:

```json
{
  "currentLessonSlug": "make-a-tonal-study-of-a-sculpture",
  "currentSubject": "art",
  "currentKeyStage": "ks1"
}
```

All heavy data (summary/quiz/assets/transcripts) stays in structuredContent.

## 5.3 Benefits

- Prevents token inflation.
- Keeps model aware of user context.
- Supports cross-message reasoning.

---

# 6. Use Display Modes intentionally

## 6.1 Inline

- Show high-level search results or lesson overview.
- Avoid long quizzes or transcripts.

## 6.2 Fullscreen

- Lesson explorer UI (summary, tabs for quiz/assets/transcript).
- Multi-column “curriculum browser”.

## 6.3 PiP

- Optional “Lesson quick reference”
  - Title
  - Key learning points
  - One-click expand

This matches user mental models during multi-step discovery.

---

# 7. Backend consolidation: create an **Oak lesson aggregator tool**

Given the number of calls the widget needs (`summary`, `quiz`, `assets`, `transcript`), introduce:

```text
oak-get-lesson-details(lessonSlug)
```

The tool would:

- Fetch summary
- Fetch quiz (if exists)
- Fetch assets (if exists)
- Fetch transcript (if exists)

Then return:

```json
{
  "lesson": {...},
  "quiz": {...or null},
  "assets": [...],
  "transcript": {...or null}
}
```

## 7.1 Benefits

- Faster widget updates
- Reduced UI complexity
- Fewer model/tool round trips
- Guaranteed consistent response shape

---

# 8. Future-proof search UX by blending

- Title search (`search`)
- Transcript search (`get-search-transcripts`)
- Unit browsing (keyStage + subject + unit)

The widget should run all three as appropriate and merge the results locally.

---

# 9. Provide slugs, not titles, as canonical identifiers in the UI

Because:

- Search results can be fuzzy.
- Unit and lesson slugs are authoritative.
- Slugs are required in _every_ tool call.

Show both:

```text
Make a tonal study of a sculpture
(lesson:make-a-tonal-study-of-a-sculpture)
```

This is especially important when teaching users to refer to content.

---

# 10. Use event-driven updates (`openai:set_globals`) to stay authoritative

Whenever the backend updates:

- New summary loaded
- New quiz loaded
- New assets loaded

The widget should:

```js
window.addEventListener('openai:set_globals', onUpdate);
```

This guarantees that:

- The widget always shows the freshest tool output.
- UI state and backend state never get out of sync.

---

# 11. Reflect missing Oak programmes cleanly (EYFS, Drama KS1)

Since the Preview dataset lacks certain subjects:

- Show “This programme is not available in this environment.”
- Offer redirect or alternative content suggestions.

Avoid implying that the user “made a mistake.” This is a dataset boundary, not a user error.

---

# Summary of Improvements

**Do build:**

- A single persistent curriculum explorer widget
- A unified mode-based UI architecture
- A tool orchestrator for lessons

**Do not rely on:**

- The quiz index tools for quiz existence
- Any Open Data content being in the MCP
- Lessons having uniform metadata

**The result:**
A widget that feels robust, adaptive, polished — and resilient to the Preview dataset's irregularities.
