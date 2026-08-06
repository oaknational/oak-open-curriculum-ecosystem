---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# tool-guidance — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **tool-guidance** items of that view, so it can be reviewed in one sitting.

**70 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 21 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (49)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C001 — PRIMARY\_ORIENTATION\_TOOL\_NAME

**What it says now:**

```text
export const PRIMARY_ORIENTATION_TOOL_NAME = 'get-curriculum-model' as const;
```

**What it is for:** Canonical tool-name constant ('get-curriculum-model') that seeds every prerequisite/guidance string so agents are consistently pointed at one orientation tool as the recommended first call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`).
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C016 — toolCategories.discovery.description + whenToUse

**What it says now:**

```text
description:
        'Find curriculum content using semantic search, topic exploration, or structured listing. ' +
        'search provides semantic search across lessons, units, threads, and sequences via a scope parameter. ' +
        'explore-topic searches all scopes in parallel for broad discovery. ' +
        'browse-curriculum returns structured facets without a search query.',
      whenToUse:
        'When you need to find content on a topic, explore what is available, or browse the curriculum structure. ' +
        'Use search with a specific scope for targeted results, explore-topic for broad discovery, ' +
        'or browse-curriculum to see what subjects and key stages exist.',
```

**What it is for:** Routes the agent among search/explore-topic/browse-curriculum: search+scope for targeted, explore-topic for broad, browse-curriculum for structure without a query.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C017 — toolCategories.browsing.description + whenToUse

**What it says now:**

```text
description:
        'Explore curriculum structure systematically by navigating through subjects, units, and lessons via the REST API.',
      whenToUse:
        'When you want to navigate the curriculum hierarchy step by step (subject then units then lessons). ' +
        'For a quicker overview, use browse-curriculum or explore-topic instead.',
```

**What it is for:** Guides step-by-step REST navigation (subject then units then lessons) and defers to browse-curriculum/explore-topic for a quicker overview.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C018 — toolCategories.fetching.description + whenToUse

**What it says now:**

```text
description:
        'Get detailed content for specific lessons, units, or resources you have already identified. ' +
        'download-asset generates a short-lived, secure download link for lesson assets (HTTP transport only).',
      whenToUse:
        'When you have a lesson or unit slug/ID and need to retrieve its full content, transcript, quiz questions, or downloadable assets. ' +
        'Use download-asset after get-lessons-assets to generate a clickable download link.',
```

**What it is for:** Directs use of fetch/get-lessons-\* for already-identified content and to call download-asset after get-lessons-assets to generate a link (HTTP transport only).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C019 — toolCategories.progression.description

**What it says now:**

```text
description: 'Explore how concepts develop across years through curriculum threads.',
```

**What it is for:** Frames the progression tools as the way to explore how concepts develop across years via curriculum threads.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C020 — toolCategories.progression.whenToUse

**What it says now:**

```text
whenToUse: `When you want to understand how a concept builds from early years to GCSE, or find prerequisite/follow-up content. Use get-thread-progressions anchored by a threadSlug for one thread's year-ordered progression, or by subject + keyStage to discover which of the ${String(threadProgressionStats.threadCount)} threads to anchor. Use get-prior-knowledge-graph with anchor unit slugs for the bounded prior-knowledge (prerequisite) subgraph of those units.`,
```

**What it is for:** Directs anchoring get-thread-progressions by threadSlug or subject+keyStage, and get-prior-knowledge-graph by anchor unit slugs; cites a thread count.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C021 — toolCategories.programmes.description + whenToUse

**What it says now:**

```text
description:
        'Navigate the curriculum by programme — the contextualised, teacher-facing view of a single ' +
        "subject / key-stage / year-group pathway (what teachers pick on Oak's website). Discover a " +
        "subject's programmes, then fetch one programme's metadata, units, questions, or assets.",
      whenToUse:
        'When the task is framed the way a teacher navigates — one year group of one subject with its ' +
        'tier / exam-board / child-subject context (e.g. Year 10 higher-tier AQA biology). Programme and ' +
        'sequence routes are co-equal, not a replacement for one another: use the programme route for a ' +
        'single user-facing pathway, and the sequence route (get-sequences) for structural, ' +
        'cross-programme traversal — one sequence generates many programme views. See the ' +
        'programmesVsSequences and ks4Complexity sections of get-curriculum-model for the distinction. ' +
        'Programme slugs are full-form (e.g. english-primary-year-1, english-secondary-year-10-edexcel), ' +
        'not year-group labels like y7.',
    } satisfies ToolCategory,
```

**What it is for:** Defines programme as the teacher-facing subject/key-stage/year-group pathway; asserts programme and sequence routes are co-equal; warns slugs are full-form (english-secondary-year-10-edexcel), not labels like y7.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C022 — toolCategories.agentSupport.description + whenToUse

**What it says now:**

```text
description:
        'Agent orientation tool. get-curriculum-model provides the complete domain model (key stages, subjects, entity hierarchy, property graph) and tool usage guidance in a single call.',
      whenToUse:
        'At conversation start, call get-curriculum-model for complete orientation before using search, fetch, or browsing tools.',
```

**What it is for:** Instructs the agent to call get-curriculum-model at conversation start for complete orientation before using search/fetch/browsing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C024 — tips[0] search scope

**What it says now:**

```text
'Use search with a scope for targeted semantic search: scope "lessons" for specific lessons, "units" for topic groups, "threads" for progressions, "sequences" for programme structures, "suggest" for typeahead.',
```

**What it is for:** Teaches how to pick the search scope: lessons/units/threads/sequences/suggest for different targets.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C025 — tips[1] explore-topic

**What it says now:**

```text
'Use explore-topic when you do not know which scope to search — it searches lessons, units, and threads in parallel.',
```

**What it is for:** Advises explore-topic when the correct scope is unknown, since it searches lessons/units/threads in parallel.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C026 — tips[2] browse-curriculum

**What it says now:**

```text
'Use browse-curriculum to see what subjects and key stages are available, without needing a search query.',
```

**What it is for:** Advises browse-curriculum to see available subjects/key stages without a search query.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C027 — tips[3] fetch prefixed IDs

**What it says now:**

```text
'The "fetch" tool uses prefixed IDs: lesson:slug, unit:slug, thread:slug, subject:slug.',
```

**What it is for:** States the fetch tool's prefixed-ID scheme (lesson:/unit:/thread:/subject:).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C028 — tips[4] transcript/quiz

**What it says now:**

```text
'Get lesson transcript for detailed content understanding; get quiz for assessment ideas.',
```

**What it is for:** Suggests transcript for content understanding and quiz for assessment ideas.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C029 — tips[5] threads

**What it says now:**

```text
'Threads show how concepts build across years — great for finding prerequisites or extensions.',
```

**What it is for:** Frames threads as showing cross-year concept build-up, useful for prerequisites/extensions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C030 — tips[6] KS4 complexity

**What it says now:**

```text
'Key Stage 4 (GCSE) has additional complexity: tiers (foundation/higher) and exam boards.',
```

**What it is for:** Warns that KS4 (GCSE) adds tiers (foundation/higher) and exam boards, shaping filter/param choices.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C031 — tips[7] get-curriculum-model at start

**What it says now:**

```text
'Use get-curriculum-model at the start of a conversation for complete orientation — it combines the domain model and tool guidance in one call.',
```

**What it is for:** Reinforces calling get-curriculum-model at conversation start for one-call orientation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C032 — tips[8] get-curriculum-model contents

**What it says now:**

```text
'get-curriculum-model includes domain definitions, entity hierarchy, property graph, tool categories, workflows, and tips.',
```

**What it is for:** Lists what get-curriculum-model returns (definitions, hierarchy, property graph, categories, workflows, tips) so agents know not to re-derive it.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C033 — tips[9] optional components

**What it says now:**

```text
'Not all lessons have all components — video, transcript, quizzes, and worksheets are OPTIONAL. Check availability before assuming they exist.',
```

**What it is for:** Warns that video/transcript/quizzes/worksheets are OPTIONAL per lesson; agent must check availability before assuming.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C034 — tips[10] Agent guidance for search (ELSER/BM25/RRF, glossary mapping)

**What it says now:**

```text
'Agent guidance for search: Oak search uses semantic search (ELSER) combined with lexical search (BM25) via Reciprocal Rank Fusion. Search query should be curriculum topic terms (e.g. "trigonometry", "photosynthesis", "the Romans") — the semantic search handles linguistic variation naturally. Assessment terms like "GCSE" or "SATs" map to keyStage filters (ks4, ks2), not the search query. When the user uses an Oak glossary term (e.g. "KS4", "unit", "thread", "tier", "key stage"), treat it as already correct — do not rewrite it. When the user uses a colloquial term (e.g. "GCSE", "SATs", "times tables"), map it to the canonical term using the ukEducationContext and entityHierarchy in get-curriculum-model. Never rewrite a glossary term into a non-glossary term. See: https://open-api.thenational.academy/docs/about-oaks-data/glossary',
```

**What it is for:** Detailed search doctrine: use topic terms not assessment terms; map GCSE/SATs to keyStage filters; keep Oak glossary terms verbatim; map colloquial terms via ontology; never rewrite glossary terms.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C035 — idFormats.description

**What it says now:**

```text
description: 'The fetch tool uses prefixed IDs to route to the correct content type.',
```

**What it is for:** Explains that the fetch tool uses prefixed IDs to route to the correct content type.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C036 — idFormats.formats[lesson:]

**What it says now:**

```text
{
        prefix: 'lesson:',
        example: 'lesson:add-fractions-with-the-same-denominator',
        description: 'Fetches lesson summary with learning objectives, keywords, and metadata.',
      },
```

**What it is for:** Documents lesson: prefix, example, and that it fetches lesson summary with objectives/keywords/metadata.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C037 — idFormats.formats[unit:]

**What it says now:**

```text
{
        prefix: 'unit:',
        example: 'unit:comparing-fractions',
        description: 'Fetches unit summary with lesson list and unit metadata.',
      },
```

**What it is for:** Documents unit: prefix/example and that it fetches unit summary with lesson list and unit metadata.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C038 — idFormats.formats[thread:]

**What it says now:**

```text
{
        prefix: 'thread:',
        example: 'thread:number',
        description: 'Fetches units in a thread ordered by conceptual progression.',
      },
```

**What it is for:** Documents thread: prefix/example and that it fetches units in a thread ordered by conceptual progression.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C039 — idFormats.formats[subject:]

**What it says now:**

```text
{
        prefix: 'subject:',
        example: 'subject:maths',
        description: 'Fetches subject details including available key stages and sequences.',
      },
```

**What it is for:** Documents subject: prefix/example and that it fetches subject details including available key stages and sequences.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C040 — workflow: userInteractions

**What it says now:**

```text
userInteractions: {
    title: 'When finding or presenting Oak content for the user',
    description:
      'When finding or presenting Oak content for the user, you should follow these steps.',
    steps: [
      {
        step: 1,
        action:
          'Call get-curriculum-model for complete orientation: domain model, tool guidance, and workflows',
        tool: 'get-curriculum-model',
        example: 'get-curriculum-model()',
        returns:
          'Complete curriculum orientation including key stages, subjects, entity hierarchy, tool categories, workflows, and tips.',
      },
      {
        step: 2,
        action: 'Use the discovery and browsing tools to explore the Oak curriculum',
      },
      {
        step: 3,
        action: 'Use the fetching tools to find curriculum content and resources',
      },
    ],
  } satisfies Workflow,
```

**What it is for:** Prescribes the top-level flow when finding/presenting Oak content: (1) get-curriculum-model for orientation, (2) discovery/browsing tools, (3) fetching tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C041 — workflow: findLessons

**What it says now:**

```text
findLessons: {
    title: 'Find lessons on a topic',
    description: 'Search for lessons matching a topic and retrieve detailed content.',
    steps: [
      {
        step: 1,
        action: 'Search for lessons matching your topic using semantic search',
        tool: 'search',
        example:
          'search({ query: "photosynthesis", scope: "lessons", subject: "science", keyStage: "ks3" })',
        returns: 'Ranked list of matching lessons with titles, subjects, and relevance scores',
      },
      {
        step: 2,
        action: 'Review search results and select relevant lessons',
        note: 'Results include lesson slugs you can use with fetch',
      },
      {
        step: 3,
        action: 'Fetch full details for selected lessons',
        tool: 'fetch',
        example: 'fetch({ id: "lesson:photosynthesis-in-plants" })',
        returns: 'Full lesson details including transcript, quiz, assets',
      },
    ],
  } satisfies Workflow,
```

**What it is for:** 3-step recipe: search(scope:lessons) -> select from results (slugs usable with fetch) -> fetch(lesson:slug) for full details.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C042 — workflow: lessonPlanning

**What it says now:**

```text
lessonPlanning: {
    title: 'Plan a lesson',
    description: 'Gather all materials needed for lesson planning.',
    steps: [
      {
        step: 1,
        action: 'Find a relevant lesson using semantic search',
        tool: 'search',
        example:
          'search({ query: "adding fractions", scope: "lessons", subject: "maths", keyStage: "ks2" })',
        returns: 'Lessons matching your criteria with relevance ranking',
      },
      {
        step: 2,
        action: 'Get lesson summary for learning objectives and keywords',
        tool: 'get-lessons-summary',
        example: 'get-lessons-summary({ lesson: "add-fractions-with-the-same-denominator" })',
        returns: 'Learning objectives, keywords, misconceptions',
      },
      {
        step: 3,
        action: 'Get lesson transcript to understand content delivery',
        tool: 'get-lessons-transcript',
        example: 'get-lessons-transcript({ lesson: "add-fractions-with-the-same-denominator" })',
        returns: 'Full video transcript text',
      },
      {
        step: 4,
        action: 'Get quiz questions for assessment ideas',
        tool: 'get-lessons-quiz',
        example: 'get-lessons-quiz({ lesson: "add-fractions-with-the-same-denominator" })',
        returns: 'Starter and exit quiz questions with answers',
      },
      {
        step: 5,
        action: 'Get downloadable assets (slides, worksheets)',
        tool: 'get-lessons-assets',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** 6-step lesson-planning recipe: search -> get-lessons-summary -> get-lessons-transcript -> get-lessons-quiz -> get-lessons-assets -> download-asset, with per-step returns.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C043 — workflow: lessonPlanning step6 transport note

**What it says now:**

```text
note: 'HTTP transport only. On stdio, direct users to the lesson page via oakUrl (slug-based OWA URL; upstream also exposes canonicalUrl). Call once per asset type.',
```

**What it is for:** Transport-conditional behaviour: download-asset is HTTP-only; on stdio direct users to the lesson page via oakUrl (canonicalUrl also upstream); call once per asset type.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C044 — workflow: browseSubject

**What it says now:**

```text
browseSubject: {
    title: 'Browse a subject curriculum',
    description: 'Explore what units and lessons are available for a subject.',
    steps: [
      {
        step: 1,
        action: 'List all subjects to find the one you want',
        tool: 'get-subjects',
        returns: 'List of subjects with key stage coverage',
      },
      {
        step: 2,
        action: 'Get units for a specific subject and key stage',
        tool: 'get-key-stages-subject-units',
        example: 'get-key-stages-subject-units({ keyStage: "ks2", subject: "maths" })',
        returns: 'Units organised by year',
      },
      {
        step: 3,
        action: 'Get lessons within a specific unit',
        tool: 'get-key-stages-subject-lessons',
        example:
          'get-key-stages-subject-lessons({ keyStage: "ks2", subject: "maths", unit: "comparing-fractions" })',
        returns: 'Lessons with summaries',
      },
    ],
  } satisfies Workflow,
```

**What it is for:** 3-step browse recipe: get-subjects -> get-key-stages-subject-units -> get-key-stages-subject-lessons, with returns per step.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C045 — workflow: trackProgression

**What it says now:**

```text
trackProgression: {
    title: 'Track concept progression across years',
    description: 'See how a concept develops from early years to GCSE.',
    steps: [
      {
        step: 1,
        action: 'Search for learning progression threads on the concept',
        tool: 'search',
        example: 'search({ query: "algebra", scope: "threads", subject: "maths" })',
        returns: 'Matching threads with relevance ranking',
      },
      {
        step: 2,
        action: 'Get the year-ordered progression for the thread found in step 1',
        tool: 'get-thread-progressions',
        example: 'get-thread-progressions({ threadSlug: "<thread-slug-from-step-1>" })',
        returns:
          'That thread’s unit progression ordered by teaching year (within one year the order is not curricular)',
      },
      {
        step: 3,
        action:
          'Get the bounded prior-knowledge subgraph for the thread units found in steps 1-2, anchored by their slugs',
        tool: 'get-prior-knowledge-graph',
        example: 'get-prior-knowledge-graph({ unitSlugs: ["<unit-slug-from-step-2>"] })',
        returns:
          'Bounded prior-knowledge subgraph for the anchor units (dependencies and prior knowledge requirements)',
      },
    ],
  } satisfies Workflow,
```

**What it is for:** 3-step progression recipe: search(scope:threads) -> get-thread-progressions(threadSlug) -> get-prior-knowledge-graph(unitSlugs); caveats that within a year the order is not curricular and the subgraph is bounded.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C046 — workflow: exploreTopic

**What it says now:**

```text
exploreTopic: {
    title: 'Explore a topic across the curriculum',
    description:
      'Discover what lessons, units, and threads exist for a topic before drilling down.',
    steps: [
      {
        step: 1,
        action: 'Explore the topic across all content types in parallel',
        tool: 'explore-topic',
        example: 'explore-topic({ query: "volcanos", subject: "geography" })',
        returns: 'Unified topic map: top lessons, units, and threads found across the curriculum',
      },
      {
        step: 2,
        action: 'Drill down into the most relevant scope',
        tool: 'search',
        example: 'search({ query: "volcanos", scope: "lessons", subject: "geography" })',
        returns: 'Full ranked results for the chosen scope',
      },
      {
        step: 3,
        action: 'Fetch full details for the best results',
        tool: 'fetch',
        example: 'fetch({ id: "lesson:volcanic-eruptions" })',
        returns: 'Full lesson content including objectives, transcript, quiz',
      },
    ],
  } satisfies Workflow,
```

**What it is for:** 3-step exploration recipe: explore-topic (parallel unified map) -> search (drill into best scope) -> fetch full details.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C047 — workflow: discoverCurriculum

**What it says now:**

```text
discoverCurriculum: {
    title: 'Discover what is available in the curriculum',
    description:
      'Browse curriculum structure to see subjects, key stages, programmes, and lesson counts.',
    steps: [
      {
        step: 1,
        action: 'Browse available programmes and facets',
        tool: 'browse-curriculum',
        example: 'browse-curriculum({ subject: "science", keyStage: "ks3" })',
        returns: 'Structured facet data: subjects, key stages, sequences, units, lesson counts',
      },
      {
        step: 2,
        action: 'Explore a specific topic within the subject to find relevant content',
        tool: 'explore-topic',
        example: 'explore-topic({ query: "cells", subject: "science", keyStage: "ks3" })',
        returns: 'Topic map with lessons, units, and threads',
      },
    ],
  } satisfies Workflow,
```

**What it is for:** 2-step discovery recipe: browse-curriculum (facets, lesson counts) -> explore-topic to find relevant content within the subject.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C048 — workflow: byProgramme

**What it says now:**

```text
export const programmeWorkflows = {
  byProgramme: {
    title: 'Navigate by programme (teacher-facing pathway)',
    description:
      'Find and drill into a single programme — the contextualised view of one subject / key-stage / ' +
      'year-group pathway that a teacher navigates by. Co-equal with the sequence route; use this when ' +
      'the task is a single user-facing pathway rather than structural, cross-programme traversal.',
    steps: [
      {
        step: 1,
        action: "Discover a subject's programmes",
        tool: 'get-subjects-programmes',
        example: 'get-subjects-programmes({ subject: "english" })',
        returns:
          'A flat array of full-form programme slug strings (e.g. english-primary-year-1, ' +
          'english-secondary-year-10-edexcel) — slugs only, no per-programme metadata; the year ' +
          'group and factors (tier, exam board, child subject) come from get-programmes in step 2',
      },
      {
        step: 2,
        action: "Get one programme's metadata by its slug",
        tool: 'get-programmes',
        example: 'get-programmes({ programme: "english-primary-year-1" })',
        returns:
          "The programme's year group, key stage, phase, and nullable tier / exam board / pathway",
      },
      {
        step: 3,
        action: "Fetch the programme's units, questions, or assets",
        tool: 'get-programmes-units',
        example: 'get-programmes-units({ programme: "english-primary-year-1" })',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** 3-step programme recipe: get-subjects-programmes (flat slug array, slugs only) -> get-programmes (metadata: year group, key stage, phase, nullable tier/exam board/pathway) -> get-programmes-units (companions: questions, assets).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows-programmes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C051 — AGENT\_SUPPORT\_TOOL\_METADATA['get-curriculum-model'].purpose

**What it says now:**

```text
purpose:
      'understand the Oak curriculum domain model and how to use available tools — call this ONCE at conversation start',
```

**What it is for:** States why/when to call: understand the domain model and tool usage; call ONCE at conversation start.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C052 — AGENT\_SUPPORT\_TOOL\_METADATA['get-curriculum-model'].seeAlso

**What it says now:**

```text
seeAlso:
      'search for finding content, fetch for retrieving details, browse-curriculum for browsing',
```

**What it is for:** Cross-references sibling tools: search for finding content, fetch for details, browse-curriculum for browsing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C108 — buildNextSteps

**What it says now:**

```text
function buildNextSteps(totals: {
  lessonTotal: number;
  unitTotal: number;
  threadTotal: number;
}): string {
  const steps: string[] = [];

  if (totals.lessonTotal > 5) {
    steps.push("Use search(scope: 'lessons') for more lesson results");
  }
  if (totals.unitTotal > 0) {
    steps.push('Use fetch(unit:slug) for full unit details');
  }
  if (totals.threadTotal > 0) {
    steps.push('Use get-thread-progressions for ordered unit sequences');
  }
  if (steps.length === 0) {
    steps.push('Try browse-curriculum to see what subjects are available');
  }

  return steps.join('. ') + '.';
}
```

**What it is for:** Emits conditional next-step tool-chaining guidance (search scope:lessons for more, fetch unit:slug, get-thread-progressions, else browse-curriculum) to drive the agent's follow-up call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C211 — getGettingStartedMarkdown — Quick Start workflow (4 steps)

**What it says now:**

```text
1. **Search for lessons**: Use the `search` tool to find lessons by topic
2. **Browse curriculum**: Use `get-subjects` and browsing tools to explore structure
3. **Fetch content**: Use `fetch` or specific tools to get detailed lesson content
4. **Download assets**: Use `get-lessons-assets` then `download-asset` for clickable download links
```

**What it is for:** Prescribes a canonical tool-use sequence: search to find lessons, get-subjects/browsing to explore, fetch/specific tools to get content, get-lessons-assets then download-asset for download links — steering the agent's default tool-selection order.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-content.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C456 — GET\_RATE\_LIMIT\_NOTE

**What it says now:**

```text
const GET_RATE_LIMIT_NOTE = `

NOTE: A response of limit=0, remaining=0, reset=0 indicates an unlimited API key with no rate cap.`;
```

**What it is for:** Tell the agent an all-zero rate-limit response means an unlimited key, not a hard cap, so it doesn't back off unnecessarily.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C457 — ASSET\_DOWNLOAD\_NOTE

**What it says now:**

```text
const ASSET_DOWNLOAD_NOTE = `

NOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).`;
```

**What it is for:** Steer the agent to call download-asset for a clickable link (asset `url` fields are authenticated, not browser-openable), with an oakUrl lesson-page fallback on stdio.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C458 — GET\_KEYWORDS\_DISAMBIGUATION\_NOTE

**What it says now:**

```text
WHEN TO PREFER WHICH KEYWORDS TOOL: this tool returns the LIVE keyword set
```

**What it is for:** Disambiguate get-keywords (live full set) vs get-keyword-graph (bounded frequency-ranked subset) so the agent picks the right keywords tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C459 — largePayloadNote (template)

**What it says now:**

```text
const largePayloadNote = (narrowing: string): string => `

NOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. ${narrowing}`;
```

**What it is for:** Warn the agent a broad-scope call may exceed the host per-result token cap and prompt it to scope up front rather than discover the limit by truncation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C460 — PROGRAMME\_SLUG\_NOTE

**What it says now:**

```text
const PROGRAMME_SLUG_NOTE = `

NOTE: Programme slugs are the full form — `<subject>-<phase>-year-<year>` plus any KS4 factor — e.g. `english-secondary-year-7` or `english-secondary-year-10-edexcel`, not the short `y7` shorthand used above. Pass the exact slug string this response returns to `get-programmes` and its sub-endpoints.`;
```

**What it is for:** Correct the loose upstream `y7` shorthand; instruct the agent to pass the exact full-form programme slug the response returns when chaining programmes endpoints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C461 — TOOL\_DESCRIPTION\_ADDITIONS['get-key-stages-subject-assets'] narrowing sentence

**What it says now:**

```text
[
    'get-key-stages-subject-assets',
    `${ASSET_DOWNLOAD_NOTE}${largePayloadNote(
      'Narrow with `unit` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.',
    )}`,
  ],
```

**What it is for:** Name the real narrowing for the key-stage+subject assets tool so the agent scopes with unit/type or falls back to one lesson.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C462 — TOOL\_DESCRIPTION\_ADDITIONS['get-sequences-assets'] narrowing sentence

**What it says now:**

```text
[
    'get-sequences-assets',
    `${ASSET_DOWNLOAD_NOTE}${largePayloadNote(
      'Narrow with `year` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.',
    )}`,
  ],
```

**What it is for:** Name the real narrowing for the whole-sequence assets tool so the agent scopes with year/type or falls back to one lesson.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C503 — get-key-stages-subject-assets NOTE download-asset/oakUrl injection

**What it says now:**

```text
\n\nNOTE: The asset `url` fields returned by this tool are authenticated API endpoints
```

**What it is for:** Tell agent returned url is an authenticated endpoint (not a browser link); call download-asset or point to lesson oakUrl.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C546 — get-keywords WHEN-TO-PREFER injection

**What it says now:**

```text
\n\nWHEN TO PREFER WHICH KEYWORDS TOOL: this tool returns the LIVE keyword set
```

**What it is for:** Disambiguate get-keywords (live full set) vs get-keyword-graph (bounded ranked snapshot) to steer tool choice / token economy.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C553 — get-lessons-assets NOTE download-asset/oakUrl injection

**What it says now:**

```text
\n\nNOTE: The asset `url` fields returned by this tool are authenticated API endpoints
```

**What it is for:** Tell agent returned url is an authenticated endpoint, not a browser link; call download-asset or use oakUrl.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C581 — get-programmes-assets NOTE download-asset/oakUrl injection

**What it says now:**

```text
\n\nNOTE: The asset `url` fields returned by this tool are authenticated API endpoints
```

**What it is for:** Tell agent returned url is an authenticated endpoint, not a browser link; call download-asset or use oakUrl.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C685 — requiresDomainContext contract field + doc-comment grounding guidance

**What it says now:**

```text
/**
   * Indicates whether the tool benefits from domain context grounding.
   *
   * When true, the model should ideally call get-curriculum-model
   * before using this tool to understand the Oak curriculum structure.
   *
   * Curriculum content tools (require auth) have this set to true.
   * Utility tools (noauth) like get-rate-limit have this set to false.
   */
  readonly requiresDomainContext: boolean;
```

**What it is for:** Defines the per-tool boolean that drives runtime injection of get-curriculum-model grounding guidance; the doc comment states the intended agent behaviour ('the model should ideally call get-curriculum-model before using this tool'). Curriculum tools = true, utility tools (get-rate-limit) = false.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, boundary-owner-call
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

## Retired (21)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C002 — AGGREGATED\_PREREQUISITE\_GUIDANCE

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call `get-curriculum-model` first to understand the curriculum domain.
```

**What it is for:** Imperative prerequisite text appended to aggregated tool descriptions to force agents to call get-curriculum-model first for domain understanding.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C003 — FETCH\_PREREQUISITE\_GUIDANCE

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call `get-curriculum-model` first to understand the curriculum domain before using the fetch tool.
```

**What it is for:** Fetch-tool-specific prerequisite variant directing agents to call get-curriculum-model before using the fetch tool (context for the 'type:slug' ID pattern).

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C005 — OAK\_CONTEXT\_HINT

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
export const OAK_CONTEXT_HINT = generateContextHint();
```

**What it is for:** Context hint injected into structuredContent by every formatToolResponse call, steering the model to call agent-support tools for domain grounding (model sees structuredContent, unlike \_meta).

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C056 — generateContextHint()

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
If you have not called get-curriculum-model yet, do so before your next tool call — it provides the domain model and tool guidance needed for accurate results.
```

**What it is for:** Per-response nudge (structuredContent.oakContextHint on every tool response): if get-curriculum-model has not been called, call it before the next tool call for accurate results.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C062 — oakContextHint grounding-hint injection into structuredContent

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
...(options.includeContextHint !== false ? { oakContextHint: OAK_CONTEXT_HINT } : {}),
```

**What it is for:** Injects an OAK\_CONTEXT\_HINT grounding string into structuredContent (default-on unless includeContextHint===false) so the model reading a domain-context tool result is nudged toward the Oak curriculum orientation/context; a behaviour-shaping hint attached to every context-bearing response.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C163 — download description embedded font-install tip directive

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
IMPORTANT: When presenting download links... always include this tip (once, not per-link): "Our resources work best if you install the Google Fonts Lexend and Kalam — https://support.thenational.academy/how-to-install-...kalan"
```

**What it is for:** Instructs the agent to surface a specific font-install tip and URL to the user once (not per link) whenever presenting download links.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** possible-defect-reported
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C375 — OAK\_UNDER\_THE\_HOOD\_TOOL\_TRIGGER

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
Orient the user to this repository (the Oak Open Curriculum Ecosystem) using the Oak Under the Hood method. Fetch the canonical skill at the linked URL and follow it ... never surface a person’s name.
```

**What it is for:** The pointer-trigger instruction the assistant executes: fetch the canonical skill URL, discern the person's angle/facet/altitude, orient them to THIS repo framed by Oak's public mission/strategy, relay Oak's official wording, and never surface a person's name.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C455 — DOMAIN\_PREREQUISITE\_GUIDANCE

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force the agent to call get-curriculum-model before any authenticated curriculum tool to ground on the domain model.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C502 — get-key-stages-subject-assets PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model before using this data tool.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C513 — get-key-stages-subject-lessons PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C523 — get-key-stages-subject-questions PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C533 — get-key-stages-subject-units PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C540 — get-key-stages PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C545 — get-keywords PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C552 — get-lessons-assets PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C560 — get-lessons-quiz PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C567 — get-lessons-summary PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-summary.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C573 — get-lessons-transcript PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-transcript.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C580 — get-programmes-assets PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C590 — get-programmes-questions PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C599 — get-programmes-units PREREQUISITE injection

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
PREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.
```

**What it is for:** Force agent to call get-curriculum-model first.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-units.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact
