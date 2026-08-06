---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# pedagogy — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Prompts, orientation, and curriculum-model doctrine — how the content teaches an agent to teach. Reviewed by Oak education experts.

**99 items.** Of those, 14 are traced to a surface an agent can reach today, 18 to a surface that is retained but switched off, and 5 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (93)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C178 — prompt: find-lessons (name + description)

**What it says now:**

```text
find curriculum lessons on a topic the teacher names, across all subjects and key stages
```

**What it is for:** Advertises a slash-command/prompt that finds lessons on a topic via semantic search across all subjects and key stages; frames the capability so the user/agent picks it for topic discovery.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/find-lessons.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C180 — prompt: explore-curriculum (name + description)

**What it says now:**

```text
explore what Oak has on a topic across lessons, units, and threads in parallel
```

**What it is for:** Frames a broad-discovery prompt that searches lessons, units, and threads in parallel for an overview before drilling down.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/explore-curriculum.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C181 — prompt: learning-progression (name + description)

**What it says now:**

```text
understand how a concept builds across year groups by walking progression threads
```

**What it is for:** Frames a prompt that traces how a concept builds across year groups via progression threads and unit dependencies.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/learning-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C182 — prompt: curriculum-mapping (name + description)

**What it says now:**

```text
build or audit a curriculum map — unit order across a year or key stage — grounded in Oak
```

**What it is for:** Frames a prompt to build/audit a curriculum map grounded in Oak threads, prior-knowledge graph, and national-curriculum coverage.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C183 — prompt: adapt-lesson (name + description)

**What it says now:**

```text
adapt an Oak lesson grounded in EEF Teaching and Learning Toolkit evidence
```

**What it is for:** Frames a prompt to adapt an Oak lesson grounded in EEF Teaching and Learning Toolkit evidence, promising evidence-calibrated options with caveats and attribution.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C184 — prompt: continue-progression (name + description)

**What it says now:**

```text
plan the next step from where the teacher's class is — resolve the next unit from Oak's sequence
```

**What it is for:** Frames a position-anchored prompt: teacher states what class just covered, and the workflow plans the next step with readiness list and anticipated misconceptions.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C185 — arg: find-lessons.topic (required)

**What it says now:**

```text
Substitute the teacher's own topic wherever a placeholder like `<topic>`
appears
```

**What it is for:** Tells the user/agent what to put in the topic slot, with worked examples that steer the search query.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/find-lessons.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C186 — arg: find-lessons.keyStage (optional)

**What it says now:**

```text
if they name a key stage, carry it as the `keyStage` filter

`"ks1"`,
   `"ks2"`, `"ks3"`, `"ks4"`
```

**What it is for:** Offers an optional key-stage filter and enumerates the accepted token forms (ks1..ks4), constraining the value the agent passes.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/find-lessons.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C187 — arg: topic 'The topic for the lesson' (lesson-planning + adapt-lesson)

**What it says now:**

```text
a teacher is adapting a lesson on a topic for a
year group
```

**What it is for:** Prompts the user to name a lesson topic with examples; shapes the search anchor for lesson build/adapt flows.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C188 — arg: yearGroup 'The year group' (lesson-planning, adapt-lesson, continue-progression)

**What it says now:**

```text
Substitute the teacher's own topic and year group where the
placeholders appear

Substitute the teacher's own
subject, year group, and just-covered topic where the placeholders appear
```

**What it is for:** Prompts the user for a year group with examples ('Year 4', 'Year 9'); downstream templates convert this to a numeric year filter.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`, `docs://oak/guidance/continue-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C189 — arg: explore-curriculum.topic (required)

**What it says now:**

```text
Substitute the teacher's own topic for `<topic>`
```

**What it is for:** Prompts for an exploration topic with examples steering the parallel discovery query.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/explore-curriculum.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C190 — arg: explore-curriculum.subject (optional)

**What it says now:**

```text
if they name a
subject, carry it as the `subject` filter
```

**What it is for:** Offers optional subject narrowing with examples, constraining the subject filter passed to explore-topic.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/explore-curriculum.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C191 — arg: learning-progression.concept (required)

**What it says now:**

```text
Substitute the teacher's own
concept and subject where the placeholders appear
```

**What it is for:** Prompts for the concept to trace across years with examples steering the threads search.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/learning-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C192 — arg: subject 'The subject area' (learning-progression, curriculum-mapping, continue-progression)

**What it says now:**

```text
Substitute the teacher's own
concept and subject where the placeholders appear

Substitute the teacher's own subject, key stage, and
(if named) year group where the placeholders appear

Substitute the teacher's own
subject, year group, and just-covered topic where the placeholders appear
```

**What it is for:** Prompts for a subject with examples ('maths', 'science', 'english'); shapes the subject filter across three prompts.

- **Can an agent see it?** Mixed — reaches both live and dormant surfaces
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`, `docs://oak/guidance/curriculum-mapping.md`, `docs://oak/guidance/learning-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C193 — arg: curriculum-mapping.keyStage (required)

**What it says now:**

```text
build (or audit) a curriculum
map for a subject at a key stage
```

**What it is for:** Prompts for the key stage to map, enumerating accepted token forms ks1..ks4.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C194 — arg: curriculum-mapping.yearGroup (optional)

**What it says now:**

```text
(if named) year group where the placeholders appear
```

**What it is for:** Offers optional narrowing of the map to one year group, with an example.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C195 — arg: continue-progression.justCovered (required)

**What it says now:**

```text
what their class just covered
```

**What it is for:** Prompts the teacher to state what the class just completed (topic/unit/lesson), anchoring the position-resolution step of the workflow.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C196 — arg: continue-progression.classNotes (optional)

**What it says now:**

```text
optionally
with notes on how the class did
```

**What it is for:** Offers optional free-text class notes; when provided, the template adds a readiness cross-check against these notes.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Flagged for a closer look:** user-input-interpolation, pii-adjacent
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C197 — getFindLessonsMessages — user message template

**What it says now:**

```text
Use `search` with scope `"lessons"` to find lessons matching the topic

For the top 3-5 lessons, provide a brief summary of what each covers
```

**What it is for:** Injects a first-person user message directing the agent to call get-curriculum-model first, then search scope 'lessons' with an interpolated query/keyStage, summarise top 3-5, suggest by objective, and fetch details.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/find-lessons.md`
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/find-lessons.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C199 — getExploreCurriculumMessages — user message template

**What it says now:**

```text
Use `explore-topic` to search across lessons, units, and threads in
   parallel

For the most relevant results, drill down using `search` with a
   specific scope
```

**What it is for:** Directs the agent to call get-curriculum-model first, run explore-topic with interpolated query/subject, review the topic map, drill down via scoped search, note thread development, and suggest next steps.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/explore-curriculum.md`
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/explore-curriculum.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C200 — getLearningProgressionMessages — user message template

**What it says now:**

```text
The progression from earliest to latest year group

Key prerequisites at each stage

How concepts build on previous learning
```

**What it is for:** Directs the agent through search scope 'threads' -> get-thread-progressions -> get-prior-knowledge-graph, then to map progression, prerequisites, conceptual jumps and scaffolding for the interpolated concept/subject.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/learning-progression.md`
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/learning-progression.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C202 — getAdaptLessonMessages — user message template (EEF-grounded adaptation)

**What it says now:**

```text
Surface the pedagogical signals: take the lesson slug of the lesson you
   selected in step 1

Give the teacher the adapted lesson as evidence-calibrated options and
   trade-offs — not a single recommendation or selection
```

**What it is for:** Orchestrates a 5-step EEF-evidence-grounded adaptation: find Oak material, surface pedagogical signals via misconception/prior-knowledge graphs, map to EEF strand ids from eef://interpretation, call get-eef-evidence, present options with caveats.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/adapt-lesson.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C203 — getContinueProgressionMessages — user message template (position->next)

**What it says now:**

```text
the unit that follows the
   class's confirmed position is the candidate next step

its assumed prior knowledge is exactly what the class should now have
   secured
```

**What it is for:** Orchestrates a 5-step position-anchored workflow: resolve position via unit search (confirm ambiguous matches, never select silently), derive next via get-thread-progressions, check readiness, anticipate misconceptions, then chain into lesson-planning.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/continue-progression.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C204 — continue-progression conditional fragments (classNotesLine + classNotesCheck)

**What it says now:**

```text
If
   the teacher gave class notes, check the list against them and flag
   anything the class may not have secured
```

**What it is for:** When classNotes is supplied, appends 'Notes on how the class did: <notes>' and instructs the agent to check the readiness list against those notes and flag unsecured items.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Flagged for a closer look:** user-input-interpolation, pii-adjacent
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/continue-progression.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C205 — recurring orientation preamble: get-curriculum-model-first + tool-suffix matching

**What it says now:**

```text
Before searching, call `get-curriculum-model` for a complete understanding
of the curriculum domain model and available tools

Call `get-curriculum-model` first for domain definitions and tool guidance

Call `get-curriculum-model` first for domain definitions and tool
guidance

MCP tool names may appear prefixed
```

**What it is for:** Directs the agent to call get-curriculum-model before other tools for domain/tool guidance, and to match prefixed MCP tool names by suffix — a cross-cutting behaviour primer embedded in every prompt template.

- **Can an agent see it?** Mixed — reaches both live and dormant surfaces
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`, `docs://oak/guidance/continue-progression.md`, `docs://oak/guidance/curriculum-mapping.md`, `docs://oak/guidance/explore-curriculum.md`, `docs://oak/guidance/find-lessons.md`, `docs://oak/guidance/learning-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/lesson-planning.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C207 — recurring WCAG 2.2 AA output-accessibility requirement

**What it says now:**

```text
render any document with real table
headers and a logical reading order (WCAG 2.2 AA)

If you produce slides, worksheets, or
quizzes, meet WCAG 2.2 AA (alt text, heading/reading order, contrast)
```

**What it is for:** Requires any produced slides/worksheets/quizzes to meet WCAG 2.2 AA (alt text, heading/reading order, contrast); constrains the accessibility of agent output.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`, `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/lesson-planning.ts`).
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C208 — recurring 'recommendation not a mandate / decision is yours' framing

**What it says now:**

```text
the map is a model to localise, not a mandate

not a single recommendation or selection

The decision is theirs to make

The next step is a recommendation grounded in Oak's published sequence,
not a mandate

the teaching decision is the teacher's to make
```

**What it is for:** Instructs the agent to present outputs as teacher-owned recommendations with alternatives rather than a single mandated selection, preserving human decision authority.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`, `docs://oak/guidance/continue-progression.md`, `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/continue-progression.ts`).
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C212 — getGettingStartedMarkdown — Orientation (load curriculum://model first)

**What it says now:**

```text
## Orientation

For full orientation — the domain model (key stages, subjects, entity hierarchy), tool categories, common workflows, usage tips, and `fetch` ID formats — read the `curriculum://model` resource, or call the `get-curriculum-model` tool, at the start of a session.
```

**What it is for:** Directs the agent to read the curriculum://model resource (or call get-curriculum-model) at session start for full orientation — domain model, tool categories, workflows, tips, fetch ID formats — instead of duplicating that content here (single-sourcing).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-content.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C261 — GET\_EEF\_EVIDENCE\_TOOL\_DEF.title

**What it says now:**

```text
title: 'EEF Evidence (Teaching and Learning Toolkit)',
```

**What it is for:** Names/brands the EEF evidence tool, attributing the Teaching and Learning Toolkit.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C262 — GET\_EEF\_EVIDENCE\_TOOL\_DEF.description

**What it says now:**

```text
description: `Returns the Education Endowment Foundation (EEF) Teaching and Learning Toolkit's evidence for a pedagogical move — strength, cost, months of additional progress, caveats, and source attribution — as deterministic facts to reason over (not recommendations).

Two queries via `function`:
- 'inspect-strand': the evidence for one named EEF strand, by `strandId`.
- 'evidence-for-move': the strands matching a pedagogical context — any of `phase`, `keyStage`, `priority`, or explicit `strandIds`. At least one selector is required. Pass `detail: 'headline'` to scan a bounded list (identity, headline metrics, tags, EEF page), then drill a chosen strand with 'inspect-strand'.

Use this when the teacher asks for the evidence behind an approach, or when you are already adapting, combining, or framing Oak material pedagogically. State a terse rationale first (e.g. "EEF because: <pedagogical choice>").

Do NOT use for plain curriculum retrieval (use 'search'/'fetch'), for guaranteed-outcome claims, for individual-pupil causal claims, or to make a teacher-replacing selection. The evidence is population-level; carry its caveats and attribution into anything drafted from it.
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Strong behaviour-shaping guidance: return evidence as deterministic facts NOT recommendations; state a terse rationale first; DO-NOT-USE list (plain retrieval, guaranteed-outcome claims, individual-pupil causal claims, teacher-replacing selection); population-level with caveats/attribution; answerType meaning; points to eef://interpretation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C263 — EEF\_EVIDENCE\_INPUT.function

**What it says now:**

```text
function: z
    .enum(['inspect-strand', 'evidence-for-move'])
    .describe(
      "Which query to run. 'inspect-strand': the evidence for one named EEF strand by id. 'evidence-for-move': the strands matching a pedagogical context (phase / key stage / priority) or an explicit set of ids.",
    )
    .meta({ examples: ['inspect-strand', 'evidence-for-move'] }),
```

**What it is for:** Selects between inspect-strand and evidence-for-move query shapes; carries examples.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C264 — EEF\_EVIDENCE\_INPUT.strandId

**What it says now:**

```text
strandId: z
    .enum([...EEF_STRAND_IDS])
    .optional()
    .describe('inspect-strand: the single EEF strand id to inspect.'),
```

**What it is for:** Names the single strand id to inspect. Enum domain is corpus-derived (EEF\_STRAND\_IDS).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C265 — EEF\_EVIDENCE\_INPUT.strandIds

**What it says now:**

```text
strandIds: z
    .array(z.enum([...EEF_STRAND_IDS]))
    .optional()
    .describe('evidence-for-move: explicit EEF strand ids to retrieve together.'),
```

**What it is for:** Explicit set of EEF strand ids to retrieve together (evidence-for-move).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C266 — EEF\_EVIDENCE\_INPUT.phase

**What it says now:**

```text
phase: z
    .enum([...OBSERVED_PHASES])
    .optional()
    .describe('evidence-for-move: the school phase the pedagogical move applies to.'),
```

**What it is for:** School-phase axis selector for evidence-for-move.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C267 — EEF\_EVIDENCE\_INPUT.keyStage

**What it says now:**

```text
keyStage: z
    .enum([...OBSERVED_KEY_STAGES])
    .optional()
    .describe('evidence-for-move: the key stage the pedagogical move applies to.'),
```

**What it is for:** Key-stage axis selector for evidence-for-move.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C268 — EEF\_EVIDENCE\_INPUT.priority

**What it says now:**

```text
priority: z
    .enum([...OBSERVED_PRIORITIES])
    .optional()
    .describe('evidence-for-move: the school-improvement priority the move addresses.'),
```

**What it is for:** School-improvement-priority axis selector for evidence-for-move.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C269 — EEF\_EVIDENCE\_INPUT.detail

**What it says now:**

```text
detail: z
    .enum(['full', 'headline'])
    .optional()
    .describe(
      "evidence-for-move: 'full' (default) returns the complete strands; 'headline' returns a bounded list — identity, the impact-for-cost headline metrics, tags, and the EEF page — to scan, then drill a chosen strand with inspect-strand. Ignored by inspect-strand.",
    ),
```

**What it is for:** full vs headline projection; directs a scan-then-drill workflow.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C270 — runEefEvidenceTool errors

**What it says now:**

```text
return eefError(`Invalid get-eef-evidence input: ${parsed.error.message}`);

return eefError("inspect-strand requires 'strandId'.");

return eefError(
      'evidence-for-move requires at least one selector: strandIds, phase, keyStage, or priority.',
    );
```

**What it is for:** Reports invalid input, missing strandId for inspect-strand, and unscoped evidence-for-move so the agent corrects.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C271 — summariseEefEnvelope

**What it says now:**

```text
export function summariseEefEnvelope(
  envelope: EefEvidenceEnvelope | EefEvidenceEnvelope<EefStrandHeadline>,
  detail: 'full' | 'headline',
): string {
  const members = envelope.members.length;
  const edges = envelope.edges.length;
  const frontier = envelope.frontier.length;
  return `EEF evidence (${envelope.answerType}): ${String(members)} ${detail} member strand${members === 1 ? '' : 's'}, ${String(edges)} related_strand edge${edges === 1 ? '' : 's'}, ${String(frontier)} frontier strand${frontier === 1 ? '' : 's'}.`;
}
```

**What it is for:** Information-only one-line framing: answerType, member/edge/frontier strand counts.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence-summaries.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C272 — EEF\_INTERPRETATION\_RESOURCE name/uri/title

**What it says now:**

```text
name: 'eef-interpretation',
  uri: 'eef://interpretation',
  title: 'EEF Toolkit — Interpretation Guide',
```

**What it is for:** Identifies and titles the eef://interpretation resource for discovery.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C273 — EEF\_INTERPRETATION\_RESOURCE.description

**What it says now:**

```text
description:
    'How to interpret and faithfully apply EEF Teaching and Learning Toolkit evidence: the corpus methodology, caveats, source attribution, and a complete strand index, plus agent reasoning guidance and the graph field names. Read context for grounding get-eef-evidence; the agent reasons over the evidence.',
```

**What it is for:** Tells the agent what the resource contains and that it is grounding context (the agent reasons over the evidence).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C274 — EEF\_INTERPRETATION\_RESOURCE.annotations

**What it says now:**

```text
annotations: {
    priority: 0.5,
    audience: ['assistant'],
  },
```

**What it is for:** priority 0.5 (supplementary, need not pre-load) and audience ['assistant'].

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C275 — getEefInterpretationMarkdown intro + layer-1 header

**What it says now:**

```text
'# EEF Teaching and Learning Toolkit — Interpretation Guide',
    '',
    "Read context for grounding `get-eef-evidence`. The EEF Toolkit summarises education research as average impact (months of additional progress), implementation cost, and evidence strength. This guide projects the corpus's own methodology, caveats, attribution, and a complete strand index; it then adds agent reasoning guidance (clearly tagged) and the graph field names. The agent is the only reasoner over the evidence (ADR-191); this guidance cannot constrain it.",
    '',
    '## 1. EEF corpus reference (cited)',
    '',
    citeSource(),
    '',
    citeMethodology(),
    '',
    citeCaveats(),
```

**What it is for:** Frames the three-layer guide, summarises what the EEF Toolkit measures (months of additional progress, cost, evidence strength), and asserts the agent is the only reasoner (guidance cannot constrain it).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C277 — citeMethodology()

**What it says now:**

```text
function citeMethodology(): string {
  const { impact_measure, cost_measure, evidence_strength_measure } = corpusMethodology;
  const costRows = typeSafeValues(cost_measure.scale)
    .map(
      (band) =>
        `  - ${band.rating} (${band.label}): ${band.range_per_pupil_per_year_gbp} per pupil/year`,
    )
    .join('\n');
  return [
    '### Methodology (EEF)',
    '',
    `- **${impact_measure.name}** (${impact_measure.unit}): ${impact_measure.derivation} ${impact_measure.interpretation_guidance}`,
    `- **${cost_measure.name}**:`,
    costRows,
    `- **${evidence_strength_measure.name}**: ${evidence_strength_measure.interpretation_guidance}`,
  ].join('\n');
}
```

**What it is for:** Explains the EEF methodology: impact measure derivation/interpretation, cost bands (£/pupil/year scale), and evidence-strength interpretation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C278 — citeCaveats()

**What it says now:**

```text
function citeCaveats(): string {
  return [
    '### Caveats (apply to every figure)',
    '',
    corpusCaveats.map((caveat) => `- ${caveat}`).join('\n'),
  ].join('\n');
}
```

**What it is for:** Emits the EEF caveats that apply to every figure.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C279 — strandIndex()

**What it says now:**

```text
function strandIndex(): string {
  const header =
    '| Strand id | Name | Impact-for-cost summary | Tags | EEF page |\n| --- | --- | --- | --- | --- |';
  const rows = EEF_STRAND_IDS.map((id) => {
    const strand = strandById(id);
    const tags = 'tags' in strand && strand.tags ? strand.tags.join(', ') : '';
    return `| ${strand.id} | ${strand.name} | ${strand.headline.headline_summary} | ${tags} | ${strand.eef_url} |`;
  }).join('\n');
  return [
    '### Strand index (complete corpus)',
    '',
    'Every strand, with its impact-for-cost one-liner and EEF page. Choose strands from this index by inspecting their definitions, findings, and relations — not by axis filtering alone.',
    '',
    header,
    rows,
  ].join('\n');
```

**What it is for:** Renders the complete strand index table AND authored guidance to choose strands by inspecting definitions/findings/relations, NOT by axis filtering alone.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C280 — agentGuidance() — layer header + End goals

**What it says now:**

```text
'## 2. Agent reasoning guidance — NOT EEF corpus evidence',
    '',
    "This layer is the calling agent's reasoning scaffold. It is NOT part of the EEF corpus and must never be presented to a teacher as EEF evidence.",
    '',
    '### End goals',
    "- Transmit the evidence faithfully: preserve each strand's impact, cost, evidence strength, caveats, and limits.",
    '- Present options and trade-offs, never recommendations or selections — the teacher decides.',
    '- Always attribute EEF and link the teacher to the relevant EEF page for the full detail and most current figures.',
    '',
    '### Oak → EEF workflow',
```

**What it is for:** Tags the layer as NOT EEF corpus evidence (never present as EEF evidence to a teacher); end goals: transmit evidence faithfully, present options/trade-offs not recommendations, always attribute EEF and link the page.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C281 — agentGuidance() — Oak → EEF workflow

**What it says now:**

```text
'1. Understand the teaching task.',
    "2. Use Oak's search, misconception, and prior-knowledge tools to surface the pedagogical signals in the lesson.",
    '3. Name the pedagogical move the signal raises, then choose real strand ids from the index above.',
    '4. Call `get-eef-evidence` with those finite ids/axes; read the returned envelope.',
    '5. Offer the teacher evidence-calibrated options, with caveats and EEF attribution intact.',
    '',
```

**What it is for:** Five-step workflow: understand task → use Oak search/misconception/prior-knowledge tools → name the pedagogical move → call get-eef-evidence with real ids/axes → offer evidence-calibrated options with caveats/attribution.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C282 — agentGuidance() — Worked examples

**What it says now:**

```text
'### Worked examples',
    '- Faithful: "EEF rates feedback as high impact (+6 months) for very low cost on extensive evidence, though figures are population averages and depend on implementation quality."',
    '- Unfaithful: "Use feedback — it is the best strategy." (Invents a ranking; drops cost, evidence strength, and caveats.)',
    '',
```

**What it is for:** Contrasts a faithful transmission (impact+months+cost+evidence+caveats) against an unfaithful one (invents a ranking; drops cost/evidence/caveats).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C283 — agentGuidance() — Reading partial curation honestly

**What it says now:**

```text
'### Reading partial curation honestly',
    `- ${taggedForSchoolContext} of ${total} strands carry school-context tags (`school_context_relevance`). The absence of a tag is **not evidence of inapplicability** — the corpus covers ${corpusMeta.coverage.age_range} and curation is partial.`,
    '- The complete strand index above, not axis filtering, is the discovery path over the full corpus.',
  ].join('\n');
```

**What it is for:** States N-of-total strands carry school-context tags and that absence of a tag is NOT evidence of inapplicability; the full index (not axis filtering) is the discovery path.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C284 — graphStructural()

**What it says now:**

```text
function graphStructural(): string {
  return [
    '## 3. Graph-structural reference',
    '',
    'A `get-eef-evidence` result is an evidence envelope with these fields:',
    "- `answerType`: what kind of result this is — `'strand-lookup'` (exactly the strands you named by id, complete for the request) or `'context-subset'` (the strands the corpus tags for your axis selectors, a NON-EXHAUSTIVE curated subset; a missing tag is not inapplicability). Information about the result, not a recommendation.",
    '- `members`: the matched strands — full strand objects by default, or the headline projection (identity, headline metrics, tags, EEF page) when the query passed `detail: "headline"`.',
    '- `edges`: `related_strand` edges whose endpoints are both members.',
    '- `frontier`: related strand ids outside the member set — suggested next lookups.',
    '- `provenance`: `source` (name, url, organisation, authors), `licence`, and `caveats`, carried once per envelope.',
    '',
    'Input selectors are finite and drawn from the corpus: strand ids, and the observed phase, key stage, and priority axes. For `evidence-for-move`, `detail: "headline"` returns a bounded list to scan; drill a chosen strand with `inspect-strand` for its full evidence.',
    '',
    'MCP tool names may appear prefixed by the client (e.g. `mcp__<server>__get-eef-evidence`); match tools by their suffix.',
  ].join('\n');
}
```

**What it is for:** Documents the get-eef-evidence envelope fields (answerType, members, edges, frontier, provenance) and the closed input selectors; plus 'MCP tool names may appear prefixed by the client... match tools by their suffix.'

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C329 — prompt find-lessons (title 'Find Lessons' + description)

**What it says now:**

```text
Agent guidance: find lessons
```

**What it is for:** Slash-command/suggested-action that tells the user+agent this workflow finds curriculum lessons on a topic across all subjects and key stages.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/find-lessons.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C331 — prompt explore-curriculum (title 'Explore Curriculum' + description)

**What it says now:**

```text
Agent guidance: explore the curriculum
```

**What it is for:** Tells user+agent this workflow explores a topic across the whole curriculum by searching lessons, units and threads in parallel.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/explore-curriculum.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C332 — prompt learning-progression (title 'Learning Progression' + description)

**What it says now:**

```text
Agent guidance: learning progression
```

**What it is for:** Frames a workflow that explains how a concept builds across year groups via progression threads and dependency mapping.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/learning-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C333 — prompt curriculum-mapping (title 'Curriculum Mapping' + description)

**What it says now:**

```text
Agent guidance: curriculum mapping
```

**What it is for:** Frames build/audit of a curriculum map (unit order across a year/key stage) grounded in Oak threads, prerequisites and national-curriculum coverage.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C334 — prompt adapt-lesson (title 'Adapt Lesson with EEF Evidence' + description, EEF-gated)

**What it says now:**

```text
Agent guidance: adapt a lesson with EEF evidence
```

**What it is for:** Frames an EEF-evidence-grounded lesson adaptation that must present evidence-calibrated options with caveats and attribution intact; EEF flag co-gated so it disappears when disabled.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C335 — prompt continue-progression (title 'Continue Progression' + description)

**What it says now:**

```text
Agent guidance: continue the progression
```

**What it is for:** Frames a 'what next' workflow: from what a class just covered, return the next unit from Oak's sequence plus a checkable readiness list and misconceptions to anticipate.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C343 — h1 page heading (alpha status)

**What it says now:**

```text
Public Beta
```

**What it is for:** Orients the reader that this is the Oak Curriculum MCP and signals restricted maturity/access ('Invite Only Public Alpha'), setting expectations about availability.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C344 — hero explainer paragraph

**What it says now:**

```text
Designed for teachers, this service connects your AI assistant to Oak
```

**What it is for:** Frames the value proposition to educators/agents: connects an AI assistant to Oak's free, sequenced, openly licenced curriculum; links to the licence terms; makes quantitative scope claims ('thousands of lessons, units, and assets').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C346 — connect section heading

**What it says now:**

```text
Connect the Oak Curriculum MCP to your AI assistant
```

**What it is for:** Introduces the connection instructions, directing the reader to wire the MCP server into their AI assistant.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C347 — config instruction sentence

**What it says now:**

```text
Add this to your MCP client configuration:
```

**What it is for:** Instructs the reader to paste the following JSON into their MCP client configuration.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C350 — Documentation section heading

**What it says now:**

```text
<h2 className="oak-heading-5">Documentation</h2>
```

**What it is for:** Introduces the documentation links block.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C354 — MCP client config JSON snippet template

**What it says now:**

```text
"mcpServers": {
    "oak-open-curriculum": {
      "type": "http",
```

**What it is for:** Provides the copy-paste JSON that wires this server into an MCP client: fixes the server key 'oak-curriculum', type 'http', and the resolved endpoint URL.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/create-snippet.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C355 — canonical MCP endpoint URL strings

**What it says now:**

```text
export function resolveServedMcpUrl(inputs: ServedOriginInputs): string {
```

**What it is for:** Determines the endpoint URL shown in the connection snippet: HTTPS on the Vercel host when present, else the localhost:3333/mcp dev default.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/served-origin.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C360 — resources section framing sentence

**What it says now:**

```text
Resources available via MCP resources/read:
```

**What it is for:** Tells the reader these resources are retrievable via the MCP resources/read operation, orienting how to consume them.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/resources-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-resources-section.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C362 — tools section framing sentence

**What it says now:**

```text
The following tools are available via the MCP protocol:
```

**What it is for:** Introduces the tool catalogue, stating the tools are available via the MCP protocol.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C363 — 'Curriculum tools' group label

**What it says now:**

```text
<h3 className="tool-group-label">Curriculum tools</h3>
```

**What it is for:** Labels the first (aggregated) tool group, framing these as the higher-level curriculum tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C364 — 'Curriculum tools' group hint

**What it says now:**

```text
Higher-level tools that combine multiple API calls
```

**What it is for:** Explains that curriculum tools combine multiple API calls, steering the reader toward these higher-level tools first.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C365 — 'API pass-through' group label

**What it says now:**

```text
<h3 className="tool-group-label muted">API pass-through</h3>
```

**What it is for:** Labels the second (generated) tool group, visually de-emphasised (muted), framing these as lower-priority raw endpoints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C366 — 'API pass-through' group hint

**What it says now:**

```text
Individual Oak Curriculum API endpoints
```

**What it is for:** Explains that pass-through tools map to individual Oak Curriculum API endpoints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C376 — OAK\_UNDER\_THE\_HOOD\_TOOL\_SUMMARY

**What it says now:**

```text
'Oak: Under the Hood — the orientation method for this repository (the Oak Open Curriculum '
```

**What it is for:** Human-readable summary block in the result content array; frames the pointer and tells the reader the method and sources are at the resource link below.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C421 — fileMap: doc section titles (also reused as H1 at line 118)

**What it says now:**

```text
function fileMap(): { kind: string; filename: string; title: string }[] {
  return [
    { kind: 'Function', filename: 'functions.md', title: 'Functions' },
    { kind: 'Class', filename: 'classes.md', title: 'Classes' },
    { kind: 'Interface', filename: 'interfaces.md', title: 'Interfaces' },
    { kind: 'Type alias', filename: 'types.md', title: 'Type Aliases' },
    { kind: 'Enum', filename: 'enums.md', title: 'Enums' },
    { kind: 'Variable', filename: 'variables.md', title: 'Variables' },
    { kind: 'Namespace', filename: 'namespaces.md', title: 'Namespaces' },
    { kind: 'Reference', filename: 'references.md', title: 'References' },
  ];
}
```

**What it is for:** Provides the human/agent-readable section titles (Functions, Classes, Interfaces, Type Aliases, Enums, Variables, Namespaces, References) that organise the generated Markdown API docs and their index links.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C422 — quickstart(): SDK usage code example

**What it says now:**

````text
function quickstart(): string {
  return (
    '## Quickstart\n\n' +
    '```ts\n' +
    "import { createOakClient } from '@oaknational/curriculum-sdk';\n" +
    "const client = createOakClient('REDACTED');\n" +
    "const res = await client.GET('/lessons/{lesson}/transcript', { params: { path: { lesson: 'lesson-slug' } } });\n" +
    'if (res.error) throw res.error;\n' +
    'console.log(res.data);\n' +
    '```'
  );
}
````

**What it is for:** Hand-authored quickstart teaching how to instantiate createOakClient and call GET '/lessons/{lesson}/transcript' with path params and handle res.error/res.data — directly shapes how an agent writes SDK calls.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C423 — writeIndex: docs index header + contents links

**What it says now:**

```text
async function writeIndex(
  outDir: string,
  kinds: { filename: string; title: string }[],
): Promise<void> {
  const lines: string[] = [];
  lines.push(
    '# Oak Curriculum SDK — API (Markdown)',
    '',
    `Generated: ${nowIso()}`,
    '',
    '## Contents',
  );
  for (const k of kinds) {
    lines.push(`- [${k.title}](./${k.filename})`);
  }
  lines.push('', quickstart());
  await fs.writeFile(join(outDir, 'index.md'), lines.join('\n'), 'utf8');
```

**What it is for:** Titles the generated API docs ('# Oak Curriculum SDK — API (Markdown)'), stamps a generated timestamp, and lists '## Contents' links to each kind file, orienting a reader entering the docs.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C433 — meta.source (name / organisation / url / original\_authors)

**What it says now:**

```text
name: 'EEF Teaching and Learning Toolkit',
      url: 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit',
      organisation: 'Education Endowment Foundation',
      original_authors: [
        'Higgins, S.',
        'Katsipataki, M.',
        'Kokotsaki, D.',
        'Coleman, R.',
        'Major, L.E.',
        'Coe, R.',
      ],
    },
```

**What it is for:** Establishes the dataset's canonical source and citation so agents attribute the EEF toolkit and its authors when relaying figures.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** pii-adjacent
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C434 — meta.licence.name + meta.licence.attribution\_note

**What it says now:**

```text
licence: {
      name: 'Repository-held EEF Toolkit data snapshot; provenance pending EEF clarification',
      url: 'https://educationendowmentfoundation.org.uk',
      attribution_note:
        'This structured dataset is the repository-held EEF Teaching and Learning Toolkit snapshot. The acquisition path is not yet confirmed in-repo; it may have been downloaded from EEF or supplied to Oak by EEF. Until EEF clarifies provenance and refresh mechanics, this repository copy is the definitive source for implementation. All EEF-derived outputs must continue to attribute EEF and link users to the original EEF strand pages for full detail, technical appendices, and the most current figures.',
    },
```

**What it is for:** Directs the agent to always attribute EEF and link users to original EEF strand pages for full detail, appendices, and current figures; flags provenance as pending.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C435 — meta.coverage (age\_range / jurisdiction\_focus / evidence\_scope)

**What it says now:**

```text
coverage: {
      age_range: '3-18 year-olds',
      jurisdiction_focus:
        'International evidence base; primary audience is schools in England and Wales',
      evidence_scope: 'Systematic reviews of meta-analyses and randomised controlled trials',
    },
```

**What it is for:** Frames the scope/applicability of the evidence base (ages 3-18, England & Wales focus, systematic-review scope) so agents scope claims appropriately.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C436 — meta.caveats (grouped block of 9 caveats)

**What it says now:**

```text
caveats: [
      'Impact figures represent population averages from research conditions, not guaranteed outcomes for individual schools or pupils.',
      "Effect sizes are converted to 'months of additional progress' using a standard approximation (~0.2 SD per month in primary). This conversion varies by age and subject.",
      'High impact with low evidence strength should be treated with caution — the true effect may differ substantially.',
      'Implementation quality is a critical moderator. Poorly implemented high-impact strategies can show zero or negative effects.',
      'The toolkit measures academic attainment outcomes. It does not capture the full value of approaches that have important non-academic benefits (e.g. arts, physical activity, SEL).',
      'Absence from the toolkit is not evidence of ineffectiveness — it indicates insufficient research to date.',
      'Digital technology was removed as a standalone strand in 2021 and integrated as a sub-section within other strands.',
      'Data in this file reflects the May 2025 and October 2025 living systematic review updates where available. Some strands may reflect earlier data pending their annual refresh.',
      "Some strands now show null impact where evidence is rated 'insufficient'. The EEF cannot determine a reliable impact estimate for these strands.",
    ],
```

**What it is for:** Curated interpretation guardrails: figures are population averages not guarantees; low-evidence high-impact needs caution; implementation quality moderates; absence != ineffectiveness; null impact where evidence insufficient.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C437 — methodology.impact\_measure (derivation + interpretation\_guidance)

**What it says now:**

```text
methodology: {
    impact_measure: {
      name: 'Months of additional progress',
      unit: 'months',
      derivation:
        "Derived from effect sizes (typically Cohen's d) reported in meta-analyses and systematic reviews. Effect sizes are converted to months using a standard conversion based on ~0.2 standard deviations of improvement per month of typical school progress.",
      interpretation_guidance:
        "A figure of '+6 months' means that, on average across the included studies, pupils receiving this intervention made 6 months more progress than comparable pupils who did not. This is an average, not a guarantee.",
    },
```

**What it is for:** Explains what 'months of additional progress' means and how effect sizes convert (~0.2 SD/month), stressing it is an average not a guarantee.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C439 — methodology.evidence\_strength\_measure (factors + interpretation\_guidance)

**What it says now:**

```text
evidence_strength_measure: {
      name: 'Evidence strength (padlocks)',
      scale_min: 1,
      scale_max: 5,
      factors: [
        'Number of studies (90+ studies required for 5 padlocks base)',
        'Quality of study designs (RCTs weighted most heavily)',
        'Ecological validity (studies in real school settings preferred)',
        'Use of curriculum-relevant outcome measures',
        'Independence of evaluation (non-independent evaluations may reduce rating)',
        'Consistency of findings across studies',
        'Recency of evidence (post-1990 studies preferred in living review)',
      ],
      interpretation_guidance:
        '5 padlocks = very extensive, high-quality evidence. 1 padlock = very limited evidence. Padlocks can be lost from the base count for issues such as non-independent evaluation, inconsistent findings, or poor ecological validity.',
    },
```

**What it is for:** Explains the 1-5 padlock evidence-strength scale and the factors (study count, RCT weighting, ecological validity, independence, consistency, recency) that raise/lower it.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C440 — methodology.effect\_size\_to\_months\_conversion.notes

**What it says now:**

```text
notes:
        'This conversion is approximate and based on typical academic progress rates. It is most accurate for primary-age pupils and may overestimate months for older pupils who typically make less progress per month in standardised terms.',
```

**What it is for:** Warns the effect-size-to-months conversion is approximate, most accurate for primary pupils, and may overestimate months for older pupils.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C445 — strands[].headline.headline\_summary (templated impact/cost/evidence sentence, 25 strands)

**What it says now:**

```text
headline: {
        impact_months: 3,
        cost_rating: 1,
        cost_label: 'Very Low',
        evidence_strength_rating: 3,
        evidence_strength_label: 'Moderate',
        headline_summary: 'Moderate impact for very low cost based on moderate evidence',
      },
      definition: {
        short:
          'Involvement in artistic and creative activities such as dance, drama, music, painting, or sculpture.',
        full: 'Arts participation is defined as involvement in artistic and creative activities, such as dance, drama, music, painting, or sculpture. It can occur either as part of the curriculum or as extra-curricular activity. Arts-based approaches may be used in other areas of the curriculum, such as the use of drama to develop engagement and oral language before a writing task. This entry focuses on the benefits of arts participation for core academic attainment in other areas of the curriculum, particularly literacy and mathematics.',
      },
      key_findings: [
        'Arts participation approaches can have a positive impact on academic outcomes in other areas of the curriculum.',
        'The value of arts participation should be considered beyond maths or English outcomes — arts engagement is valuable in and of itself.',
        'If the aim is to improve academic attainment, it is important to identify the link between the chosen arts intervention and the outcomes you want to improve.',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** One-line framing sentence per strand ('X impact for Y cost based on Z evidence') that the agent surfaces as the at-a-glance verdict.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C447 — strands[].school\_context\_relevance (pp\_relevance\_note, critical\_note, workload\_note, session\_guidance, implementation\_requirements)

**What it says now:**

```text
school_context_relevance: {
        most_relevant_phases: ['primary', 'secondary'],
        most_relevant_key_stages: ['KS1', 'KS2', 'KS3', 'KS4'],
        most_relevant_priorities: ['improving_behaviour', 'closing_disadvantage_gap'],
        pp_relevance: 'high',
        pp_relevance_note:
          'Behavioural challenges disproportionately affect disadvantaged pupils. Both universal and targeted approaches effective.',
        implementation_requirements: {
          cpd_intensity: 'moderate',
          additional_staff_needed: false,
          resource_cost: 'low',
          time_to_embed: '2-6 months',
          key_staff: ['classroom_teachers', 'pastoral_leads', 'behaviour_leads'],
        },
      },
    },
    {
      id: 'eef-tl-collaborative-learning',
      name: 'Collaborative learning approaches',
      slug: 'collaborative-learning-approaches',
      eef_url:
        'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/collaborative-learning-approaches',
      headline: {
        impact_months: 5,
        cost_rating: 1,
        cost_label: 'Very Low',
        evidence_strength_rating: 2,
        evidence_strength_label: 'Limited',
        headline_summary: 'Moderate impact for very low cost based on limited evidence',
      },
      definition: {
        short:
          'Pupils working together on activities or learning tasks in a group small enough to ensure that everyone participates.',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Oak's contextualisation layer mapping strands to UK phase/key-stage/priorities and PP relevance, feeding the recommend\_for\_context tool's tailored recommendations.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C449 — strands[].tags (classification tags)

**What it says now:**

```text
tags: ['creative', 'engagement', 'cross-curricular', 'enrichment', 'primary', 'secondary'],
    },
    {
      id: 'eef-tl-aspiration-interventions',
      name: 'Aspiration interventions',
      slug: 'aspiration-interventions',
      eef_url:
        'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/aspiration-interventions',
      headline: {
        impact_months: null,
        cost_rating: 1,
        cost_label: 'Very Low',
        evidence_strength_rating: 0,
        evidence_strength_label: 'Insufficient',
        headline_summary: 'Unclear impact for very low cost based on insufficient evidence',
      },
      definition: {
        short:
          "Interventions that aim to raise pupils' aspirations for their future education and career.",
        full: 'Aspiration interventions aim to raise the educational aspirations of pupils who come from disadvantaged backgrounds, or those who are at risk of educational underachievement. Approaches include mentoring by successful role models, trips to universities, and interventions to raise career awareness.',
      },
      key_findings: [
        'There is very limited evidence that aspiration interventions alone improve academic attainment.',
        'Most disadvantaged pupils already have high aspirations — the challenge is often a gap between aspirations and the knowledge, skills or qualifications needed to achieve them.',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Repo taxonomy tags (e.g. 'high-impact','low-cost','debunked','disadvantage','primary') used for filtering/grouping strands in agent-facing discovery.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C450 — school\_context\_schema.description + property descriptions

**What it says now:**

```text
school_context_schema: {
    description:
      'UK school context parameters for contextualised recommendations. Pass these to recommend_for_context.',
    properties: {
      phase: {
        type: 'string',
        enum: ['early_years', 'primary', 'secondary', 'post_16', 'all_through', 'special'],
      },
      key_stage: {
        type: 'string',
        enum: ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5'],
      },
      school_type: {
        type: 'string',
        enum: [
          'maintained',
          'academy',
          'free_school',
          'independent',
          'special',
          'alternative_provision',
          'nursery',
        ],
      },
      pupil_premium: {
        type: 'object',
        properties: {
          pp_percentage: {
            type: 'number',
            description: '% eligible for PP (national avg ~27%)',
          },
          pp_band: {
            type: 'string',
            enum: ['low', 'below_average', 'average', 'above_average', 'high'],
          },
          total_pp_funding_gbp: {
            type: 'integer',
          },
        },
      },
      send_percentage: {
        type: 'number',
      },
      ofsted_grade: {
        type: 'string',
        enum: ['outstanding', 'good', 'requires_improvement', 'inadequate'],
      },
      attainment: {
        type: 'object',
        properties: {
          ks2_reading_expected_plus: {
            type: 'number',
          },
          ks2_maths_expected_plus: {
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Describes the school-context input schema and instructs the agent to 'Pass these to recommend\_for\_context'; property notes like PP national average anchor input values.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C481 — makeQuickstartSection

**What it says now:**

````text
function makeQuickstartSection(): string {
  return (
    '## Quickstart\n\n' +
    '### Create clients\n\n' +
    '```ts\n' +
    "import { createOakClient, createOakPathBasedClient } from '@oaknational/curriculum-sdk';\n\n" +
    "const apiKey = 'REDACTED';\n" +
    'const client = createOakClient(apiKey);\n' +
    'const pathClient = createOakPathBasedClient(apiKey);\n' +
    '```\n\n' +
    '### Call an endpoint (method-based)\n\n' +
    '```ts\n' +
    "const res = await client.GET('/lessons/{lesson}/transcript', {\n" +
    "  params: { path: { lesson: 'lesson-slug' } },\n" +
    '});\n' +
    'if (res.error) throw res.error;\n' +
    'console.log(res.data);\n' +
    '```\n\n' +
    '### Call an endpoint (path-based)\n\n' +
    '```ts\n' +
    "const res2 = await pathClient['/lessons/{lesson}/transcript'].GET({\n" +
    "  params: { path: { lesson: 'lesson-slug' } },\n" +
    '});\n' +
    'console.log(res2.data);\n' +
    '```\n\n' +
    '### Programmatic tool generation\n\n' +
    '```ts\n' +
    "import { toolGeneration, schema } from '@oaknational/curriculum-sdk';\n\n" +
    'for (const op of toolGeneration.PATH_OPERATIONS) {\n' +
    '  const { pathParams, toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);\n' +
    '  console.log(op.operationId, toMcpToolName(), pathParams);\n' +
    '}\n' +
    '```\n'
  );
}
````

**What it is for:** Teach agents how to create clients and call endpoints (method-based, path-based) and generate tools programmatically.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** pii-adjacent
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C482 — buildHeader

**What it says now:**

```text
function buildHeader(): string {
  return (
    '# Oak Curriculum SDK — AI Reference\n\n' +
    `Generated: ${nowIso()}\n\n` +
    'This single-file document is intended for AI agents. It contains the public API surface of the SDK,' +
    ' usage examples, and programmatic exports. For detailed human-oriented docs, see files under `docs/api/`.'
  );
}
```

**What it is for:** Frame the doc as the AI-agent reference to the SDK public surface, usage examples, and programmatic exports.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C483 — buildConventionsSection

**What it says now:**

```text
function buildConventionsSection(): string {
  return [
    '## Conventions',
    '- Authorization: pass API key to `createOakClient(apiKey)`; the SDK never reads env vars.',
    '- Base URL: defaults to the production API; override via `OAK_API_URL` if needed.',
    '- Responses: every call returns `{ data, error, response }` from openapi-fetch.',
    '- Rate limits: see `/rate-limit` endpoint; headers expose remaining/limit.',
  ].join('\n');
}
```

**What it is for:** State SDK conventions the agent must follow: auth via createOakClient (SDK never reads env vars), base URL/OAK\_API\_URL, {data,error,response} shape, rate-limit endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C484 — renderSections plural label map

**What it says now:**

```text
function renderSections(grouped: Map<string, TDReflection[]>): string[] {
  const sections: string[] = [];
  const plural = (k: string): string => {
    const map: Record<string, string> = {
      Class: 'Classes',
      'Type alias': 'Type Aliases',
      Variable: 'Variables',
      Function: 'Functions',
      Interface: 'Interfaces',
      Enum: 'Enums',
      Namespace: 'Namespaces',
      Reference: 'References',
    };
    return map[k] ?? (k.endsWith('s') ? k : `${k}s`);
  };
  for (const [kind, items] of grouped) {
    if (items.length === 0) {
      continue;
    }
    sections.push(`## ${plural(kind)}`);
    for (const r of items) {
      sections.push(renderReflection(r));
    }
  }
  return sections;
```

**What it is for:** Pluralise TypeDoc kind names into section headings in the AI doc (Class->Classes, Type alias->Type Aliases, etc.).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C486 — commentToMarkdown + exampleBlockFromComment templates

**What it says now:**

````text
function exampleBlockFromComment(c: TDComment): string {
  if (!Array.isArray(c.blockTags)) {
    return '';
  }
  const ex = c.blockTags.find((t) => t.tag === '@example');
  if (!ex || !Array.isArray(ex.content) || ex.content.length === 0) {
    return '';
  }
  const exampleText = ex.content
    .map((p) => p.text)
    .join('')
    .trim();
  return exampleText === '' ? '' : 'Example:\n\n```ts\n' + exampleText + '\n```';
}

export function commentToMarkdown(c?: TDComment): string {
  if (!c) {
    return '';
  }
  const parts = [
    trimOrEmpty(c.shortText),
    trimOrEmpty(c.text),
    summaryFromComment(c),
    exampleBlockFromComment(c),
  ].filter((s) => s !== '');
  return parts.join('\n\n');
}
````

**What it is for:** Assemble each symbol's doc body (shortText/text/summary/example) and wrap @example content in a fenced ts block for the AI doc.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/lib/ai-doc-render.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C487 — signatureToMarkdown

**What it says now:**

````text
export function signatureToMarkdown(sig: TDSignature): string {
  const params = (sig.parameters ?? []).map((p) => `${p.name}: ${typeToString(p.type)}`).join(', ');
  const ret = typeToString(sig.type);
  const details = '```ts\n' + `function ${sig.name}(${params}): ${ret}` + '\n```';
  const doc = commentToMarkdown(sig.comment);
  return doc ? details + '\n\n' + doc : details;
}
````

**What it is for:** Render a function signature as a ts code fence in the AI doc so agents see the exact call shape.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/lib/ai-doc-render.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C488 — groupByKind KIND\_LABEL map + fallbacks

**What it says now:**

```text
export function groupByKind(reflections: TDReflection[]): Map<string, TDReflection[]> {
  const map = new Map<string, TDReflection[]>();
  const KIND_LABEL: Record<number, string> = {
    4: 'Namespace',
    8: 'Enum',
    32: 'Variable',
    64: 'Function',
    128: 'Class',
    256: 'Interface',
    65536: 'Type literal',
    2097152: 'Type alias',
    4194304: 'Reference',
  };
  const labelFor = (r: TDReflection): string => {
    if (r.kindString && r.kindString.length > 0) {
      return r.kindString;
    }
    if (typeof r.kind === 'number') {
      return KIND_LABEL[r.kind] ?? 'Kind:' + String(r.kind);
    }
    return 'Symbol';
  };
  for (const r of reflections) {
    const k = labelFor(r);
    const g = map.get(k) ?? [];
    g.push(r);
    map.set(k, g);
  }
  return map;
}
```

**What it is for:** Map TypeDoc numeric kinds to human labels for AI-doc grouping (Namespace/Enum/Variable/Function/Class/Interface/Type literal/Type alias/Reference) with 'Kind:<n>'/'Symbol' fallbacks.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/lib/ai-doc-render.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C490 — renderReflection (heading + type-alias code fence)

**What it says now:**

````text
export function renderReflection(r: TDReflection): string {
  const title = `### ${r.name}`;
  if (isTypeAlias(r)) {
    const aliased = '```ts\n' + `type ${r.name} = ${typeToString(r.type)}` + '\n```';
    const src = renderSources(r.sources);
    const doc = commentToMarkdown(r.comment);
    return [title, aliased, src, doc].filter((s) => s && s.length > 0).join('\n\n');
  }
  const doc = commentToMarkdown(r.comment);
  const sigs = (r.signatures ?? []).map(signatureToMarkdown).join('\n\n');
  return [title, doc, sigs].filter((s) => s && s.length > 0).join('\n\n');
}
````

**What it is for:** Render each symbol as a `### name` heading with a type-alias code fence plus doc/signatures in the AI doc.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/lib/ai-doc-render.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

## Words owned elsewhere (1)

These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.

### C201 — getCurriculumMappingMessages — user message template (map build/audit)

**What it says now:**

```text
threads are the vertical backbone, so the
   map should advance them coherently rather than presenting disconnected
   topics

Output the map as a table (term/half-term | unit | thread(s) | builds on |
national curriculum coverage)
```

**What it is for:** Orchestrates a 6-step build/audit of a curriculum map (scope, backbone threads, prerequisite ordering, coverage, breadth balance, audit) with a prescribed output table format and KS4/sequences caveat.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/curriculum-mapping.md`
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** Oak Skills, in the `oaknational/oak-skills` repository. The workflow here is adapted from a named skill; the authoritative pedagogy lives there.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/curriculum-mapping.ts`).
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

## Retired (5)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C179 — prompt: lesson-planning (name + description)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
lesson-planning — 'Build a complete, teachable lesson on a topic the way Oak does — planning grounded in Oak's live curriculum data and six curriculum principles: pupil outcome, key learning points...'
```

**What it is for:** Frames a prompt that builds a full teachable lesson 'the way Oak does', naming the six curriculum principles and attribution, setting the user's expectation of a grounded plan.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C198 — getLessonPlanningMessages — user message template (6-step lesson build)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
Workflow: 1. Place the lesson. Use search with scope "lessons" ... get-prior-knowledge-graph ... 2. Specify the knowledge ... get-lessons-summary ... get-lessons-transcript ... 6. Gather resources ...
```

**What it is for:** Orchestrates a 6-step lesson build (place, specify knowledge, anticipate misconceptions, sequence, assess, gather resources) naming specific tools/params and Oak pedagogy; the primary behaviour-shaping content of this prompt.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/lesson-planning.ts`).
- **Who owns the words:** Oak Skills, in the `oaknational/oak-skills` repository. The workflow here is adapted from a named skill; the authoritative pedagogy lives there.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** prompt-message-template · **Impact tier:** high-impact

### C330 — prompt lesson-planning (title 'Lesson Planning' + description)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
'Build a complete, teachable lesson on a topic, grounded in Oak's live curriculum data and six curriculum principles — outcome, key learning points, keywords, misconceptions, quizzes…'
```

**What it is for:** Frames a full lesson-build workflow grounded in Oak live data and 'six curriculum principles' (outcome, key learning points, keywords, misconceptions, quizzes, resources) — sets the expected output structure.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** prompt-name-or-description · **Impact tier:** high-impact

### C340 — Oak: Under the Hood resource CONTENT (pointer body)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
'# Oak: Under the Hood — orientation method\n\nThis resource is a pointer, not a copy. Fetch the canonical orientation method and follow it to orient the user to this repository…'
```

**What it is for:** The returned resource body: instructs the assistant that this is a pointer not a copy, to FETCH the canonical orientation method and follow it to orient the user to the repo framed by Oak's public mission/strategy, and critically to 'Relay Oak's official wording from its public site; never surface a person's name.'

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C356 — prompts section framing sentence

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
Prompts are workflow templates that guide common curriculum tasks:
```

**What it is for:** Defines for the reader what MCP prompts are ('workflow templates that guide common curriculum tasks'), shaping their mental model of the prompt surface.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-prompts-section.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact
