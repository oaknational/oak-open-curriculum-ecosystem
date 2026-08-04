# Rendered wholes — the content as an agent receives it

Companion to `report.md` / `registry.json`. Where the registry lists a cohesive delivered surface as separate authored fragments, this file shows the **assembled whole** — rendered directly from the built SDK, so it is **exact** for deterministic content and marked with `{{placeholder}}` where a value is supplied at runtime (a user prompt argument, or interpolated curriculum data). Regenerate with `render-wholes.mjs`.

Rendered: 2026-08-03 — the render is exact for the SDK build it ran against and goes stale as the SDK moves; this date is the staleness signal.


## 1. Server instructions — delivered once at connection

Exact. This is the whole string an agent receives in the MCP `initialize` response.

```text
Oak Curriculum MCP Server - AI Agent Guidance

For optimal results, call these agent support tools at conversation start:

0. get-curriculum-model - Complete curriculum orientation: domain model, tool guidance, key stages, subjects, entity hierarchy, ID formats, tool categories, workflows, tips

These tools are read-only and idempotent. They complement each other:

- get-curriculum-model: understand the Oak curriculum domain model and how to use available tools — call this ONCE at conversation start. See also: search for finding content, fetch for retrieving details, browse-curriculum for browsing

Call these tools first to reduce errors when using search, fetch, and browsing tools.

Oak's curriculum is fully sequenced: year-ordered progressions, prior-knowledge, misconception, and keyword graphs are served by the anchored graph tools (get-thread-progressions, get-prior-knowledge-graph, get-misconception-graph, get-keyword-graph), so lesson and curriculum plans can build on what a class has already covered.

For questions that are not about curriculum content — about the mechanisms by which the content is delivered, about this MCP app or its associated services, or about the repository itself — use the oak-under-the-hood tool to orient yourself to the Oak Open Curriculum Ecosystem.

Oak brand and content provenance: Oak National Academy owns the Oak brand and brand elements. When you reuse Oak's curriculum content, attribute it ("Contains public sector information licensed under the Open Government Licence v3.0."). When you create content derived from Oak's resources, we request that it adheres to the same high design standards as Oak — but it must not use the Oak branding, and it must never present itself as Oak-created or Oak-endorsed.
```

## 2. Server identity (Implementation metadata)

Verbatim snapshot — **not machine-rendered**. SSOT: `apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts` (`OAK_SERVER_BRANDING`); re-verify against it on change.

```text
title: Oak National Academy
description: Search, explore, download and use Oak's free, fully sequenced and resourced curriculum resources, for KS1 to KS4.
websiteUrl: https://www.thenational.academy
icons: two themed data:image/svg+xml;base64 acorn variants (light fill #287c34, dark fill #ffffff)
```

## 3. Tools — assembled definitions (42)

Exact. Each is the full `title` + `description` (as authored; routing cross-references only) + parameter descriptions + behaviour annotations the agent sees in `tools/list`.

### `search` — Search Curriculum

```text
Search Oak's curriculum using semantic search across all four content indexes.

Required parameters: `scope` (which index to search) and `query` (your search query). For `threads` scope, `query` may be omitted if `subject` or `keyStage` is provided.

SCOPE SELECTION — choose the right scope for the teacher's intent:
- "lessons": Find specific lessons on a topic. Best for "find me a lesson about X".
- "units": Find teaching units (groups of lessons). Best for "what units cover X?".
- "threads": Find learning progression strands across year groups. Best for "how does X build across years?". If the teacher mentions a subject (for example, "maths threads"), pass it in the subject filter parameter rather than relying on the query alone.
- "sequences": Find curriculum programme structures. Best for "show me the programme for X". Sequence names are structural (for example, "maths-secondary"), so broad subject terms should be passed via subject filters.
- "suggest": Typeahead suggestions as the user types. Best for autocomplete.

Use this when you need to:
- Find lessons, units, threads, or sequences on a topic
- Search with specific filters (key stage, subject, year, tier)
- Get typeahead suggestions for a partial query
- Discover what content exists for a subject or topic

Do NOT use for:
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use 'get-curriculum-model')
- Browsing what's available without a search query (use 'browse-curriculum')
- Exploring a topic across multiple indexes at once (use 'explore-topic')

NATURAL LANGUAGE MAPPING EXAMPLES:
- "Find KS3 science lessons about photosynthesis" → scope: 'lessons', query: 'photosynthesis', subject: 'science', keyStage: 'ks3'
- "What units cover fractions in primary maths?" → scope: 'units', query: 'fractions', subject: 'maths', keyStage: 'ks2'
- "What's the learning progression for algebra?" → scope: 'threads', query: 'algebra', subject: 'maths'
- "What maths threads are there?" → scope: 'threads', subject: 'maths' (no query needed — returns all maths threads sorted by size)
- "Show me secondary science programmes" → scope: 'sequences', query: 'science', keyStage: 'ks3'
- "Find lessons on the Romans for Year 3" → scope: 'lessons', query: 'Romans', year: '3'
- "KS4 higher tier maths on trigonometry" → scope: 'lessons', query: 'trigonometry', keyStage: 'ks4', tier: 'higher'

SCOPE LIMITATIONS:
- "suggest" requires at least one filter: subject or keyStage.
- "sequences" works best with structural names (for example, "maths-secondary"), not topic words.
- "threads" can omit query when subject or keyStage is provided, returning all matching threads sorted by unit count.
CROSS-TOOL WORKFLOWS:
- For lesson planning: search(scope: 'lessons') → fetch(lesson:slug) for full details
- For prerequisites: search(scope: 'threads') → get-prior-knowledge-graph with the found unit slugs for dependencies
- For progressions: search(scope: 'threads') → get-thread-progressions for ordered units

NOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. Broad scopes such as `sequences` are largest; pass `size` to cap results and `from` to page.
```

Parameters:
  - query (optional): Search query. Required for all scopes except threads — for threads scope, omit query and provide subject or keyStage to browse all threads matching the filter.
  - scope: Which index to search. "lessons" for specific lessons, "units" for topic groups, "threads" for cross-year progressions, "sequences" for programme structures, "suggest" for typeahead. [enum: lessons, units, threads, sequences, suggest]
  - subject (optional): Filter by subject slug (e.g. "maths", "science", "english") [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - keyStage (optional): Filter by key stage (ks1, ks2, ks3, ks4) [enum: ks1, ks2, ks3, ks4]
  - size (optional): Maximum number of results to return (1-100, default 25)
  - from (optional): Offset for pagination (default 0)
  - unitSlug (optional): Filter lessons whose `units[]` contains an entry with this unit slug. A lesson can belong to multiple units across programme variants, so this filter matches a lesson if any of its unit entries has the supplied slug. Lessons scope only.
  - tier (optional): Filter to lessons available in this KS4 tier (foundation/higher). Tier is a programme-factor on the lesson's units; matching a lesson means at least one of its unit entries has this tier. Lessons scope only, KS4.
  - examBoard (optional): Filter to lessons offered by this exam board. Exam board is a programme-factor on the lesson's units; matching a lesson means at least one of its unit entries is tagged with this exam board. Lessons scope only.
  - year (optional): Filter by year group number. Lessons scope only.
  - threadSlug (optional): Filter by curriculum thread slug. Lessons scope only.
  - highlight (optional): Include highlighted text snippets in results. Lessons and units scopes.
  - minLessons (optional): Minimum number of lessons a unit must contain. Units scope only.
  - phaseSlug (optional): Filter by phase slug. Sequences scope only.
  - category (optional): Filter by category. Sequences scope only.
  - limit (optional): Maximum number of suggestions. Suggest scope only.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `fetch` — Fetch Curriculum Resource

```text
Fetch curriculum resource by canonical identifier.

Use this when you need to:
- Get lesson details (learning objectives, keywords, misconceptions)
- Get unit information (lessons list, subject context)
- Get subject or sequence overview
- Retrieve thread progression data

Do NOT use for:
- Finding content when you don't have the ID (use 'search')
- Understanding ID formats (use 'get-curriculum-model')

Use format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator", "unit:comparing-fractions").
```

Parameters:
  - id: Canonical identifier in format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator", "unit:comparing-fractions", "subject:maths", "sequence:maths-primary", "thread:number-multiplication-and-division")

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-curriculum-model` — Oak Curriculum Overview

```text
Returns a complete orientation to Oak National Academy's curriculum: domain model (key stages, subjects, entity hierarchy, property graph) AND tool usage guidance (categories, workflows, tips).

Use this when you need to understand:
- The Oak curriculum structure (key stages, subjects, units, lessons, threads)
- Which tools are available and how to use them
- Common workflows for finding and using curriculum content
- How to interpret ID formats for the 'fetch' tool

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)
Widget (_meta.ui): resourceUri=ui://widget/oak-curriculum-app-local.html visibility=["model","app"]

### `get-thread-progressions` — Oak Curriculum Thread Progressions

```text
Returns how an Oak curriculum thread progresses across year groups, for the anchor you name.

Threads connect units into conceptual progressions across years (160 threads across 17 subjects). Every call is anchored — exactly ONE of:
- threadSlug: the detail anchor; returns that ONE thread's full unit progression ordered by teaching year (earliest → latest; "All years" units last) — never the whole thread estate.
- subject + keyStage (both together): the discovery anchor; returns bounded thread descriptors (slug, title, year span, unit count — no sequences) so you can pick a threadSlug to anchor next.

Ordering semantics, stated honestly: the progression axis is the teaching year. Within one year the order is not curricular (the curriculum data defines no within-year unit sequence); treat same-year units as a group, not a chain.

Slugs are corpus keys — resolve them first with search (scope "threads"), fetch, or browse-curriculum. An unknown threadSlug is reported in the result's unknownAnchors, not errored; an unmatched subject+keyStage returns a well-formed empty result.

Use this to answer questions like:
- "What's the learning path for fractions?" (discover with subject+keyStage, then anchor the thread)
- "How does this thread build from early years to GCSE?" (threadSlug)
- "Which threads cover algebra at KS3?" (subject + keyStage)

Complements get-prior-knowledge-graph (unit-level prerequisite subgraphs) and get-misconception-graph (per-lesson misconceptions along a thread).
```

Parameters:
  - threadSlug (optional): Detail anchor: one thread slug (corpus key). Returns that thread’s full year-ordered unit progression. Exactly one anchor mode per call.
  - subject (optional): Discovery anchor (with keyStage): a subject slug, e.g. "maths". Returns bounded thread descriptors without sequences. Exactly one anchor mode per call.
  - keyStage (optional): Discovery anchor (with subject): a key-stage slug, e.g. "ks2". Returns bounded thread descriptors without sequences.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-prior-knowledge-graph` — Oak Curriculum Prior Knowledge Subgraph

```text
Returns the bounded prior-knowledge subgraph for the anchor units you name.

"Prior knowledge of unit X" means X's predecessors: the units that are (transitively, up to the requested depth) prerequisites of X. Edges are prerequisiteFor relationships (prerequisite → dependent), derived from curriculum thread ordering.

The query is anchored, never whole-corpus:
- unitSlugs: the anchor units. Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown slugs are reported in the result's unknownAnchors, not errored.
- depth (optional): predecessor levels to include. Default 2, maximum 3. Typical result sizes per anchor: depth 1 ≈ 2 units (median, max 8); depth 2 ≈ 4 units (median, max 21); depth 3 ≈ 8 units (median, max 42).

The result reports nodes (unit metadata: slug, title, subject, key stage, year, prior-knowledge statements, thread memberships), edges, resolvedAnchors, unknownAnchors, and the depth used.

Use this to answer questions like:
- "What should students know before this unit?" (anchor: that unit's slug)
- "Which prerequisite gaps could explain difficulty with this lesson's unit?"
- "What earlier units does this scheme of work build on?"

Complements get-thread-progressions (full thread learning paths) with anchored prior-knowledge detail.
```

Parameters:
  - unitSlugs: Anchor unit slugs (corpus keys, e.g. from search/fetch results). The result is the bounded prior-knowledge subgraph for these units. Unknown slugs are reported back in unknownAnchors, not errored.
  - depth (optional): Prerequisite-traversal depth: how many predecessor levels to include. Default 2, maximum 3.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-misconception-graph` — Oak Curriculum Misconception Subgraph

```text
Returns the misconceptions (with teacher responses) addressed by the anchor you name.

Misconceptions are extracted per lesson from the Oak curriculum and reached through the thread → unit → lesson → misconception chain. Every call is anchored — exactly ONE of:
- lessonSlugs: the leaf anchor; each lesson carries at most two misconceptions.
- unitSlugs: the core anchor; each unit returns every placed lesson with its misconceptions (typical bodies 2–11 KB per unit).
- threadSlug (+ optional unitOffset/unitLimit): a unit-granular window over one thread, default 10 units per page (maximum 25), with totalUnits and hasMore reported so partial coverage is always visible. unitOffset/unitLimit are valid ONLY with threadSlug — combining them with lessonSlugs or unitSlugs is rejected.

Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown slugs are reported in the result's unknownAnchors, not errored.

Coverage honesty: some units belong to no thread (unit entries carry threadSlugs membership; an empty list marks a thread-unreachable unit), so thread-anchored results are thread-scoped and never subject-complete.

Use this to answer questions like:
- "What misconceptions should I anticipate in this lesson?" (anchor: that lesson's slug)
- "Which misconceptions does this unit address across its lessons?"
- "How do misconceptions develop along this curriculum thread?" (windowed)

Complements get-prior-knowledge-graph (prerequisite gaps) with per-lesson misconception detail.
```

Parameters:
  - lessonSlugs (optional): Lesson anchor: lesson slugs (corpus keys). Each lesson carries at most two misconceptions. Exactly one anchor mode per call.
  - unitSlugs (optional): Unit anchor: unit slugs (corpus keys). Returns each unit with every placed lesson and its misconceptions. Exactly one anchor mode per call.
  - threadSlug (optional): Thread anchor: one thread slug (corpus key). Returns a unit-granular window over the thread with honest coverage (totalUnits, hasMore). Exactly one anchor mode per call.
  - unitOffset (optional): Thread anchor only: index of the first unit in the window. Default 0.
  - unitLimit (optional): Thread anchor only: units per window. Default 10, maximum 25.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-keyword-graph` — Oak Curriculum Keyword Graph

```text
Returns the key vocabulary for one teaching context: a bounded, frequency-ranked page of curriculum keywords, each decorated with its in-scope placing lessons.

Every call is anchored by subject + keyStage (both required — corpus keys, e.g. "maths" + "ks2"), narrowable by unitSlugs and/or lessonSlugs. Ranking is by in-scope placement count (how many anchor-matching lessons place the keyword), descending — vocabulary frequent elsewhere in the curriculum never outranks locally relevant vocabulary. Results are bounded top-N (default 25, max 100) with honest totals (totalMatchingKeywords, hasMore); each entry carries the keyword node (term, description, global frequency = unique placing lessons corpus-wide, coarse firstYear at key-stage granularity: ks1→1, ks2→3, ks3→7, ks4→10) plus up to 10 in-scope placing lessons (hasMoreLessons marks the cut) — richness arrives by edge traversal on the curriculum graph, never a flat dump.

Data is a point-in-time snapshot of the published curriculum (bulk export), not the live API; coverage can lag live content, materially at KS4 while subjects restructure.

When to prefer which keywords tool: get-keywords returns the LIVE full keyword set for a key stage + subject — fresh, authoritative at KS4, alphabetical, unranked, and large. This tool returns a bounded frequency-ranked subset with lesson connections — token-economical, best for "the most relevant vocabulary for this teaching context" and for navigating from keywords into lessons, units, and the wider curriculum graph.

Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown unitSlugs/lessonSlugs are reported in the result's unknown-anchor fields, not errored; an unknown subject or keyStage returns a well-formed empty result.

Use this to answer questions like:
- "What vocabulary should I emphasise teaching maths at KS2?" (subject + keyStage)
- "Which keywords matter most in this unit?" (narrow with unitSlugs)
- "What terms does this lesson rely on?" (narrow with lessonSlugs)

Complements get-keywords (live full set), get-misconception-graph, get-prior-knowledge-graph, and get-thread-progressions on the same curriculum graph.
```

Parameters:
  - subject: Anchor subject slug (corpus key), e.g. "maths". Required, with keyStage.
  - keyStage: Anchor key-stage slug (corpus key), e.g. "ks2". Required, with subject.
  - unitSlugs (optional): Optional narrowing: unit slugs (corpus keys) within the anchor. Unknown slugs are reported in unknownUnitAnchors, not errored.
  - lessonSlugs (optional): Optional narrowing: lesson slugs (corpus keys) within the anchor. Unknown slugs are reported in unknownLessonAnchors, not errored.
  - limit (optional): Optional top-N bound for the ranked keyword page: integer in [1, 100], default 25.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-eef-evidence` — EEF Evidence (Teaching and Learning Toolkit)

```text
Returns the Education Endowment Foundation (EEF) Teaching and Learning Toolkit's evidence for a pedagogical move — strength, cost, months of additional progress, caveats, and source attribution — as deterministic facts to reason over (not recommendations).

Two queries via `function`:
- 'inspect-strand': the evidence for one named EEF strand, by `strandId`.
- 'evidence-for-move': the strands matching a pedagogical context — any of `phase`, `keyStage`, `priority`, or explicit `strandIds`. At least one selector is required. Pass `detail: 'headline'` to scan a bounded list (identity, headline metrics, tags, EEF page), then drill a chosen strand with 'inspect-strand'.

Use this when the teacher asks for the evidence behind an approach, or when you are already adapting, combining, or framing Oak material pedagogically. State a terse rationale first (e.g. "EEF because: <pedagogical choice>").

Do NOT use for plain curriculum retrieval (use 'search'/'fetch'), for guaranteed-outcome claims, for individual-pupil causal claims, or to make a teacher-replacing selection. The evidence is population-level; carry its caveats and attribution into anything drafted from it.

Inputs are a closed set drawn from the corpus's own vocabulary. Axis filters (`phase`/`keyStage`/`priority`) match only the strands the corpus tags for school context — they focus the result, they do not bound coverage, and a missing tag is not evidence of inapplicability. The result's `answerType` says which it is: 'strand-lookup' (exactly the strands you named, complete) or 'context-subset' (the corpus-curated, non-exhaustive axis match). Use `eef://interpretation` for the full strand index and how to read the evidence faithfully.
```

Parameters:
  - function: Which query to run. 'inspect-strand': the evidence for one named EEF strand by id. 'evidence-for-move': the strands matching a pedagogical context (phase / key stage / priority) or an explicit set of ids. [enum: inspect-strand, evidence-for-move]
  - strandId (optional): inspect-strand: the single EEF strand id to inspect. [enum: eef-tl-arts-participation, eef-tl-aspiration-interventions, eef-tl-behaviour-interventions, eef-tl-collaborative-learning, eef-tl-extending-school-time, eef-tl-feedback, eef-tl-homework, eef-tl-individualised-instruction, eef-tl-learning-styles, eef-tl-mastery-learning, eef-tl-mentoring, eef-tl-metacognition-and-self-regulation, eef-tl-one-to-one-tuition, eef-tl-oral-language-interventions, eef-tl-outdoor-adventure-learning, eef-tl-parental-engagement, eef-tl-peer-tutoring, eef-tl-performance-pay, eef-tl-phonics, eef-tl-physical-activity, eef-tl-reading-comprehension-strategies, eef-tl-reducing-class-size, eef-tl-repeating-a-year, eef-tl-school-uniform, eef-tl-setting-and-streaming, eef-tl-small-group-tuition, eef-tl-social-and-emotional-learning, eef-tl-summer-schools, eef-tl-teaching-assistant-interventions, eef-tl-within-class-attainment-grouping]
  - strandIds (optional): evidence-for-move: explicit EEF strand ids to retrieve together. [enum: eef-tl-arts-participation, eef-tl-aspiration-interventions, eef-tl-behaviour-interventions, eef-tl-collaborative-learning, eef-tl-extending-school-time, eef-tl-feedback, eef-tl-homework, eef-tl-individualised-instruction, eef-tl-learning-styles, eef-tl-mastery-learning, eef-tl-mentoring, eef-tl-metacognition-and-self-regulation, eef-tl-one-to-one-tuition, eef-tl-oral-language-interventions, eef-tl-outdoor-adventure-learning, eef-tl-parental-engagement, eef-tl-peer-tutoring, eef-tl-performance-pay, eef-tl-phonics, eef-tl-physical-activity, eef-tl-reading-comprehension-strategies, eef-tl-reducing-class-size, eef-tl-repeating-a-year, eef-tl-school-uniform, eef-tl-setting-and-streaming, eef-tl-small-group-tuition, eef-tl-social-and-emotional-learning, eef-tl-summer-schools, eef-tl-teaching-assistant-interventions, eef-tl-within-class-attainment-grouping]
  - phase (optional): evidence-for-move: the school phase the pedagogical move applies to. [enum: primary, secondary, early_years]
  - keyStage (optional): evidence-for-move: the key stage the pedagogical move applies to. [enum: KS1, KS2, KS3, KS4, EYFS]
  - priority (optional): evidence-for-move: the school-improvement priority the move addresses. [enum: improving_behaviour, closing_disadvantage_gap, improving_oracy, improving_writing, metacognition_and_self_regulation, improving_reading, improving_maths, curriculum_development, post_covid_recovery, parental_engagement, transition_support, effective_use_of_tas, improving_send_provision]
  - detail (optional): evidence-for-move: 'full' (default) returns the complete strands; 'headline' returns a bounded list — identity, the impact-for-cost headline metrics, tags, and the EEF page — to scan, then drill a chosen strand with inspect-strand. Ignored by inspect-strand. [enum: full, headline]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `browse-curriculum` — Browse Curriculum

```text
Browse what's available in Oak's curriculum without searching.

Returns structured facet data showing subjects, key stages, sequences (programmes),
units, and lesson counts. Useful for orientation and discovery.

Use this when:
- The teacher wants to see what's available ("What subjects do you have?")
- The teacher wants to browse a subject ("Show me the maths curriculum")
- The teacher wants to see what's at a key stage ("What's in KS2?")
- You need to understand curriculum structure before searching

Do NOT use for:
- Searching for specific content (use 'search' with a query)
- Getting full lesson details (use 'fetch')
- Understanding the domain model (use 'get-curriculum-model')

NATURAL LANGUAGE MAPPING EXAMPLES:
- "What subjects are available?" → no arguments (returns all facets)
- "Show me KS2 science" → { subject: 'science', keyStage: 'ks2' }
- "What's in the maths curriculum?" → { subject: 'maths' }
- "What subjects are at Key Stage 3?" → { keyStage: 'ks3' }

NOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. Pass `subject` and/or `keyStage` to narrow; an unfiltered call returns the whole curriculum.
```

Parameters:
  - subject (optional): Filter by subject slug to see what units and lessons are available [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - keyStage (optional): Filter by key stage to see what subjects and content are available [enum: ks1, ks2, ks3, ks4]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `explore-topic` — Explore Topic

```text
Explore a topic across the entire Oak curriculum in one call.

Searches lessons, units, AND learning threads in parallel for a topic,
returning a unified topic map showing what's available across all scopes.
Returns a small set from each scope (top 5) for a quick overview.

Use this when:
- The teacher says "What does Oak have about volcanos?"
- The teacher says "I want to teach about electricity"
- You need to discover what content exists before drilling down
- The teacher's intent doesn't clearly map to one scope
- The teacher mentions a subject and you need cross-scope results (pass the subject parameter explicitly)

Do NOT use for:
- Precise search in a single scope (use 'search' with a specific scope)
- Browsing without a topic (use 'browse-curriculum')
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use 'get-curriculum-model')

NATURAL LANGUAGE MAPPING EXAMPLES:
- "What does Oak have about volcanos?" → { query: 'volcanos' }
- "Explore fractions across the curriculum" → { query: 'fractions', subject: 'maths' }
- "Explore maths topics" → { query: 'topics', subject: 'maths' }
- "I want to teach about electricity in KS3" → { query: 'electricity', keyStage: 'ks3' }
- "What can you tell me about the Romans?" → { query: 'the Romans' }

NEXT STEPS AFTER EXPLORE:
- Use search(scope: 'lessons') for more lesson results
- Use search(scope: 'threads') for progression details
- Use fetch(lesson:slug) for full lesson content
- Use get-thread-progressions for ordered unit sequences
```

Parameters:
  - query: The topic to explore. Use descriptive terms like "photosynthesis", "the Romans", "fractions".
  - subject (optional): Optional subject filter applied to all scopes [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - keyStage (optional): Optional key stage filter applied to all scopes [enum: ks1, ks2, ks3, ks4]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `download-asset` — Download Asset

```text
Generate a short-lived, secure download link for a lesson asset.

Returns a clickable URL valid for 5 minutes that downloads the asset
directly in the user's browser — no authentication needed on their side.

Use this when:
- The user wants to download a slide deck, worksheet, quiz, or video
- You have the lesson slug and asset type from a previous get-lessons-assets call

Do NOT use for:
- Browsing available assets (use 'get-lessons-assets')
- Getting lesson content or metadata (use 'fetch')
```

Parameters:
  - lesson: Lesson slug (e.g. "add-fractions-with-the-same-denominator")
  - type: Asset type to download [enum: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `user-search` — User Search

```text
Interactive user-facing curriculum search within the Oak MCP App.

This tool provides a visual, interactive search experience for teachers using
the MCP App interface. Unlike the agent-facing 'search' tool, this tool is
designed to be invoked when the user wants to browse and explore results
visually.

Required parameters: `query` (search text) and `scope` (which index to search).

SCOPE SELECTION:
- "lessons": Find specific lessons on a topic
- "units": Find teaching units (groups of lessons)
- "threads": Find learning progression strands across year groups
- "sequences": Find curriculum programme structures

Use this when:
- The user wants to search and browse results interactively
- A visual, filterable search experience is more appropriate than text results
- The teacher wants to explore curriculum content with Oak branding

Do NOT use for:
- Agent-initiated search (use 'search' instead)
- Fetching known content by ID (use 'fetch')
```

Parameters:
  - query: Search query text.
  - scope: Which index to search: lessons, units, threads, or sequences. [enum: lessons, units, threads, sequences]
  - subject (optional): Filter by subject slug. [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - keyStage (optional): Filter by key stage. [enum: ks1, ks2, ks3, ks4]
  - size (optional): Maximum number of results to return (1-50, default 25).

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)
Widget (_meta.ui): resourceUri=ui://widget/oak-curriculum-app-local.html

### `user-search-query` — User Search Query

```text
App-only search query helper for the Oak MCP App.

This tool executes search queries initiated by the MCP App UI without
requiring model mediation. It is hidden from the model (app-only visibility)
and designed for responsive, interactive search within the app.

The app calls this tool via app.callServerTool() when the user interacts
with search controls directly.
```

Parameters:
  - query: Search query text.
  - scope: Which index to search: lessons, units, threads, or sequences. [enum: lessons, units, threads, sequences]
  - subject (optional): Filter by subject slug. [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - keyStage (optional): Filter by key stage. [enum: ks1, ks2, ks3, ks4]
  - size (optional): Maximum number of results to return (1-50, default 25).

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)
Widget (_meta.ui):  visibility=["app"]

### `get-changelog` — Get Changelog

```text
API changelog

Use when you need the full history of API changes — for surfacing release notes or checking which version introduced a field. Returns every changelog entry with version and date. Not for: the current version (GET /changelog/latest).
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: noauth

### `get-changelog-latest` — Get Changelog Latest

```text
Latest API version

Use when you only need the current API version — e.g. a version banner or deployment check. Returns the most recent changelog entry. Not for: full version history (GET /changelog).
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: noauth

### `get-key-stages` — Get Key Stages

```text
All key stages

Use when you need the master list of key stages. Returns every key stage with its title and slug. Not for: key stages restricted to a subject (GET /subjects/{subject}/key-stages).
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-key-stages-subject-assets` — Get Key Stages Subject Assets

```text
Downloadable assets by key stage and subject

Use when you want every downloadable asset for a key stage + subject, without programme structure or unit sequence order, optionally scoped to a unit or asset type. Returns assets grouped by lesson, each with signed download URLs, asset type, lesson title and slug, and attribution. Pass unit to restrict to one unit and type to restrict to one asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms. Not for: assets across a sequence (GET /sequences/{sequence}/assets); assets in one programme (GET /programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).

NOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).

NOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. Narrow with `unit` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.
```

Parameters:
  - keyStage: Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase [enum: ks1, ks2, ks3, ks4]
  - subject: Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - type (optional): Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint [enum: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers]
  - unit (optional): Optional unit slug to additionally filter by

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-key-stages-subject-lessons` — Get Key Stages Subject Lessons

```text
List lessons in a key stage and subject

Use when you want every published lesson in a key stage + subject, grouped by unit, without programme structure or unit sequence order. Returns an array of units, each with slug, title, and the lessons inside. Pass unit to restrict to one. Supports offset/limit pagination; Link: rel="next" header signals more pages. Not for: finding a lesson from a search term (GET /search/lessons); a single lesson's metadata (GET /lessons/{lesson}/summary); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units). Example: keyStage=ks3, subject=maths, unit=perimeter-and-area.
```

Parameters:
  - keyStage: Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase [enum: ks1, ks2, ks3, ks4]
  - subject: Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - unit (optional): Optional unit slug to additionally filter by
  - offset (optional): Offset applied to lessons within each unit (not to the unit list).
  - limit (optional): Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-key-stages-subject-questions` — Get Key Stages Subject Questions

```text
Quiz questions by key stage and subject

Use when you want every quiz question for a key stage + subject, without programme structure or unit sequence order. Returns lessons each with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel="next" header signals more pages. Not for: a single lesson's quiz (GET /lessons/{lesson}/quiz); questions across a sequence (GET /sequences/{sequence}/questions); questions in one programme (GET /programmes/{programme}/questions).
```

Parameters:
  - keyStage: Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase [enum: ks1, ks2, ks3, ks4]
  - subject: Subject slug to search by, e.g. 'science' - note that casing is important here [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - offset (optional): If limiting results returned, this allows you to return the next set of results, starting at the given offset point
  - limit (optional): Limit the number of lessons, e.g. return a maximum of 300 lessons
  - filter (optional): Optional filter for question results. Use `images` to return only questions with a question image or image answer. [enum: images]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-key-stages-subject-units` — Get Key Stages Subject Units

```text
Units in a key stage and subject

Use when you want a flat list of every unit with published lessons in a key stage + subject, without programme structure or unit sequence order. Returns units grouped by year slug; units without published lessons are omitted. Pass examBoard to restrict KS4 to one board (one of: aqa, edexcel (Edexcel A), eduqas, ocr, wjec, edexcelb (Edexcel B)); otherwise each unit lists the boards it appears in. Not for: all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units); a single unit (GET /units/{unit}/summary); lessons rather than units (GET /key-stages/{keyStage}/subject/{subject}/lessons); units in a thread (GET /threads/{threadSlug}/units).
```

Parameters:
  - keyStage: Key stage slug to filter by, e.g. 'ks2' [enum: ks1, ks2, ks3, ks4]
  - subject: Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - examBoard (optional): (no description) [enum: aqa, edexcel, eduqas, ocr, wjec, edexcelb]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-keywords` — Get Keywords

```text
Keywords by subject and key stage

Use when you want the vocabulary for a key stage, subject, unit, lesson, or phase — e.g. to build a glossary or attach definitions to content. Returns keywords with definition, the subject + key stage they appear in, and the lessons that use them, sorted alphabetically. All filters are optional, but pass at least one of keyStage, subject, unit, lesson, or phase.

WHEN TO PREFER WHICH KEYWORDS TOOL: this tool returns the LIVE full keyword set for a key stage + subject — fresh and authoritative (including KS4 during curriculum restructures), alphabetical, unranked, and large at subject scope. For a bounded frequency-ranked subset with lesson connections (token economy + relationship navigation over the curriculum graph), prefer get-keyword-graph, which serves a point-in-time curriculum snapshot.
```

Parameters:
  - subject (optional): (no description) [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]
  - keyStage (optional): (no description) [enum: ks1, ks2, ks3, ks4]
  - phase (optional): (no description) [enum: primary, secondary]
  - unit (optional): (no description)
  - lesson (optional): (no description)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-lessons-assets` — Get Lessons Assets

```text
Downloadable assets for a lesson

Use when you have a lesson slug and need the list of what's downloadable. Returns every available asset type with a signed download URL per asset and attribution. The 9 type values are: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Pass type to return only one. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms. Not for: streaming the file itself (GET /lessons/{lesson}/assets/{type}); bulk asset retrieval across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/assets), a sequence (GET /sequences/{sequence}/assets), or one programme (GET /programmes/{programme}/assets); lesson metadata (GET /lessons/{lesson}/summary).

NOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).
```

Parameters:
  - lesson: The lesson slug identifier
  - type (optional): Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint [enum: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-lessons-quiz` — Get Lessons Quiz

```text
Quiz questions for a lesson

Use when you have a lesson slug and need its starter and exit quiz questions with correct answers marked. Returns two arrays, starterQuiz and exitQuiz; each question includes the prompt, the answers (with correct ones flagged), and which answers are distractors. Not for: quiz questions across a sequence (GET /sequences/{sequence}/questions); quiz questions in one programme (GET /programmes/{programme}/questions); across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/questions); lesson metadata or assets (GET /lessons/{lesson}/summary or GET /lessons/{lesson}/assets).
```

Parameters:
  - lesson: The lesson slug identifier
  - filter (optional): Optional filter for question results. Use `images` to return only questions with a question image or image answer. [enum: images]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-lessons-summary` — Get Lessons Summary

```text
Lesson summary by slug

Use when you have a lesson slug and need its full metadata: title, key stage, subject, unit, keywords, key learning points, misconceptions, pupil lesson outcome, teacher tips, content guidance, supervision level, and downloadsAvailable. Returns the lesson summary record. Not for: finding a lesson from a search term (GET /search/lessons); searching what's said in lesson videos (GET /search/transcripts); listing every lesson in a unit or subject (GET /key-stages/{keyStage}/subject/{subject}/lessons); the transcript or assets (GET /lessons/{lesson}/transcript or GET /lessons/{lesson}/assets). Example slug: imagining-you-are-the-characters-the-three-billy-goats-gruff.
```

Parameters:
  - lesson: The slug of the lesson

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-lessons-transcript` — Get Lessons Transcript

```text
Lesson video transcript

Use when you have a lesson slug and need the video transcript — for accessibility, captioning, or text analysis. Returns the transcript as an array of sentences plus a raw WebVTT captions file (vtt) suitable for a <track> element. Not for: searching across transcripts (GET /search/transcripts); the video file itself (GET /lessons/{lesson}/assets/{type} with type=video); lesson metadata (GET /lessons/{lesson}/summary).
```

Parameters:
  - lesson: The slug of the lesson

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-programmes` — Get Programmes

```text
Get a programme by slug

Use when you need to get the metadata of one programme. Get programme slugs from GET /subjects/{subject}/programmes. Returns the programme's year group, slug (e.g. y7, y10-biology-foundation), and applicable programme factors (exam board, tier, child subject). Not for: the units, questions, or assets of one programme (GET /programmes/{programme}/units, GET /programmes/{programme}/questions, or GET /programmes/{programme}/assets); the sequence-level summary (GET /sequences/{sequence}); all programmes for a subject (GET /subjects/{subject}/programmes).

NOTE: Programme slugs are the full form — `<subject>-<phase>-year-<year>` plus any KS4 factor — e.g. `english-secondary-year-7` or `english-secondary-year-10-edexcel`, not the short `y7` shorthand used above. Pass the exact slug string this response returns to `get-programmes` and its sub-endpoints.
```

Parameters:
  - programme: The programme slug identifier

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-programmes-assets` — Get Programmes Assets

```text
Downloadable assets in a programme

Use when you need every downloadable asset for a single programme (year group) within a subject. Returns assets grouped by lesson with signed download URLs, asset type, lesson title and slug, and attribution. Supports offset/limit pagination; Link: rel="next" header signals more pages. Optionally narrow by asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms. Not for: assets across a whole sequence (GET /sequences/{sequence}/assets); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).

NOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).
```

Parameters:
  - programme: The programme slug identifier
  - offset (optional): If limiting results returned, this allows you to return the next set of results, starting at the given offset point
  - limit (optional): Limit the number of lessons, e.g. return a maximum of 300 lessons
  - type (optional): Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint [enum: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-programmes-questions` — Get Programmes Questions

```text
Quiz questions in a programme

Use when you want every quiz question in a single programme (year group) within a subject. Get programme slugs from GET /subjects/{subject}/programmes. Returns questions grouped by lesson with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel="next" header signals more pages. Not for: questions in a single lesson (GET /lessons/{lesson}/quiz); questions across a whole sequence (GET /sequences/{sequence}/questions); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).
```

Parameters:
  - programme: The programme slug identifier
  - offset (optional): If limiting results returned, this allows you to return the next set of results, starting at the given offset point
  - limit (optional): Limit the number of lessons, e.g. return a maximum of 300 lessons
  - filter (optional): Optional filter for question results. Use `images` to return only questions with a question image or image answer. [enum: images]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-programmes-units` — Get Programmes Units

```text
Units in a programme

Use when you need the unit sequence for one programme — units as an ordered arrangement designed to build knowledge progressively. Get programme slugs from GET /subjects/{subject}/programmes. Returns units in unit sequence order with title, slug, and any associated factors. Not for: every unit across the whole sequence (GET /sequences/{sequence}/units); a flat list of units for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/units); a single unit (GET /units/{unit}/summary); units in a thread (GET /threads/{threadSlug}/units).
```

Parameters:
  - programme: The programme slug identifier

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-rate-limit` — Get Rate Limit

```text
Current rate-limit status

Use when you need rate-limit status as a JSON body — e.g. for a quota indicator. Returns limit, remaining, and reset. The same data sits on the 'X-RateLimit-*' headers of every response, so this tool is rarely needed directly. Does not count against your quota.

NOTE: A response of limit=0, remaining=0, reset=0 indicates an unlimited API key with no rate cap.
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: noauth

### `get-sequences` — Get Sequences

```text
Sequencing information for a given sequence slug

Use when you have a sequence slug and need the sequence-level summary. A sequence is a subject's curriculum across a phase (e.g. maths-primary, science-secondary-aqa); it spans one or more National Curriculum schemes and contains one programme per year group. Get sequence slugs from GET /subjects or GET /subjects/{subject} (the sequenceSlugs field). Returns slug, phase, key stages, years, and any KS4 programme factors (exam board, tier, child subject, pathway) needed to interpret the programmes within it. Not for: the programmes within this sequence (GET /subjects/{subject}/programmes); the unit sequence for one programme (GET /programmes/{programme}/units); all units across the sequence (GET /sequences/{sequence}/units); subject-level catalogue data (GET /subjects or GET /subjects/{subject}). Example: sequence=maths-primary or science-secondary-aqa.
```

Parameters:
  - sequence: The sequence slug identifier

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-sequences-assets` — Get Sequences Assets

```text
Downloadable assets in a sequence

Use when you need every downloadable asset across a whole sequence — all programmes combined. Returns assets grouped by lesson in unit sequence order, with signed download URLs, asset type, lesson title and slug, and attribution. Pass year as an optional filter. Narrow further with type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms. Not for: assets in a single programme (GET /programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets).

NOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).

NOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. Narrow with `year` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.
```

Parameters:
  - sequence: The sequence slug identifier, including the key stage 4 option where relevant.
  - year (optional): The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.
  - type (optional): Optional asset type specifier

Available values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers [enum: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-sequences-questions` — Get Sequences Questions

```text
Quiz questions across a sequence

Use when you want every quiz question across a whole sequence — all programmes combined. Returns questions grouped by lesson in unit sequence order. Pass year as an optional filter to return only that year's questions. Supports offset and limit; Link: rel="next" header signals more pages. Not for: questions in a single programme (GET /programmes/{programme}/questions); a single lesson's quiz (GET /lessons/{lesson}/quiz); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).
```

Parameters:
  - sequence: The sequence slug identifier, including the key stage 4 option where relevant.
  - year (optional): The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.
  - offset (optional): If limiting results returned, this allows you to return the next set of results, starting at the given offset point
  - limit (optional): Limit the number of lessons, e.g. return a maximum of 300 lessons
  - filter (optional): Optional filter for question results. Use `images` to return only questions with a question image or image answer. [enum: images]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-sequences-units` — Get Sequences Units

```text
Units in a curriculum sequence

Use when you want every unit across a whole sequence — all programmes combined, in unit sequence order. Returns units grouped by programme (year group) in unit sequence order. If the sequence slug includes an exam board (e.g. science-secondary-aqa), units are scoped to that exam board. Secondary sequences also expose tiers, pathways, and exam subjects where applicable. Pass year as an optional filter to return only that year's units (across all KS4 factor combinations). Not for: units in a single programme (GET /programmes/{programme}/units); a flat list of units for a key stage + subject without programme structure or unit sequence order (GET /key-stages/{keyStage}/subject/{subject}/units); the programmes within this sequence (GET /subjects/{subject}/programmes); a single unit (GET /units/{unit}/summary); units in a thread (GET /threads/{threadSlug}/units). Example: sequence=science-secondary-aqa or maths-primary.
```

Parameters:
  - sequence: The sequence slug identifier, including the key stage 4 option where relevant.
  - year (optional): The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-subject-detail` — Get Subject Detail

```text
Single subject with sequences, key stages, and years

Use when you have a subject slug. Returns subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for this subject; each sequence contains one programme per year group — call GET /subjects/{subject}/programmes to enumerate them. Not for: every subject in one call (GET /subjects); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); subject-scoped lessons or units (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}). Example: subject=maths.
```

Parameters:
  - subject: The slug identifier for the subject [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-subjects` — Get Subjects

```text
All subjects

Use when you need every subject in one call — the entry point for a subject picker or for crawling the whole curriculum. Returns subjects alphabetically, each with subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for that subject; each sequence contains one programme per year group — call GET /subjects/{subject}/programmes to enumerate them. Not for: a single subject (GET /subjects/{subject}); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); lessons or units inside a subject (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-subjects-key-stages` — Get Subjects Key Stages

```text
Key stages for a subject

Use when you only need the key stages where this subject is available. Returns key-stage titles and slugs. Not for: every key stage (GET /key-stages); the subject record (GET /subjects/{subject}). Example: 'subject=history'.
```

Parameters:
  - subject: The subject slug identifier [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-subjects-programmes` — Get Subjects Programmes

```text
Get all programmes for a subject slug

Use when you need to discover the programmes within a subject — to get a programme's slug for use with GET /programmes/{programme} or its sub-endpoints. Returns programmes grouped by key stage, each with year group, slug (e.g. y7, y10-biology-foundation), and applicable programme factors (exam board, tier, child subject). Not for: the metadata of one programme (GET /programmes/{programme}); the units, questions, or assets of one programme (GET /programmes/{programme}/units, GET /programmes/{programme}/questions, or GET /programmes/{programme}/assets); the sequence-level summary (GET /sequences/{sequence}).

NOTE: Programme slugs are the full form — `<subject>-<phase>-year-<year>` plus any KS4 factor — e.g. `english-secondary-year-7` or `english-secondary-year-10-edexcel`, not the short `y7` shorthand used above. Pass the exact slug string this response returns to `get-programmes` and its sub-endpoints.
```

Parameters:
  - subject: The subject slug identifier [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-subjects-years` — Get Subjects Years

```text
Year groups for a subject

Use when you only need the year groups where this subject is available. Returns an array of year numbers, derived from the subject's key stages. Not for: the subject record (GET /subjects/{subject}); key stages rather than year groups (GET /subjects/{subject}/key-stages). Example: 'subject=english'.
```

Parameters:
  - subject: Subject slug to filter by [enum: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-threads` — Get Threads

```text
All threads

Use when you want the catalogue of every thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — making vertical connections across year groups. Returns all threads with published units, sorted alphabetically — each with title, slug, and unitCount. Not for: the units inside a thread (GET /threads/{threadSlug}/units).
```

Parameters:
  (none)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-threads-units` — Get Threads Units

```text
Units in a thread

Use when you want every unit in a thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — for example, number and place value or scientific method. Units in a thread span multiple programmes and key stages; thread order is independent of unit sequence order within any individual programme. Returns units in thread order with unitTitle, unitSlug, and unitOrder. Not for: the catalogue of threads (GET /threads); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units); a single unit (GET /units/{unit}/summary). Example: 'threadSlug=number-and-place-value'.
```

Parameters:
  - thread: (no description)

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

### `get-units-summary` — Get Units Summary

```text
Unit summary by slug

Use when you have a unit slug and need the unit summary: title, description, key stage, subject, year, threads, prior-knowledge requirements, national-curriculum statements, and the lessons inside. Unit variant slugs (ending in -1, -2, etc.) resolve to that specific variant. Not for: listing every unit in a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/units); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units); units in a thread (GET /threads/{threadSlug}/units); lessons inside the unit (GET /key-stages/{keyStage}/subject/{subject}/lessons with unit={unit}).
```

Parameters:
  - unit: The unit slug
  - examBoard (optional): (no description) [enum: aqa, edexcel, eduqas, ocr, wjec, edexcelb]
  - pathway (optional): (no description) [enum: core, gcse]
  - tier (optional): (no description) [enum: core, foundation, higher]
  - childSubject (optional): (no description) [enum: biology, chemistry, combined-science, physics]

Annotations: readOnly=true destructive=false idempotent=true openWorld=false
Security: oauth2 (scopes: email)

## 4. Prompts — assembled workflow messages (0)

Rendered with `{{arg}}` placeholders where the user supplies a value. This is the message injected into the conversation when the prompt fires.

## 5. Resource — `docs://oak/getting-started` (getting-started markdown)

Exact.

```text
# Oak Curriculum MCP Server

Access Oak National Academy curriculum resources including lessons, units, quizzes, transcripts, and teaching materials. Covers Key Stages 1-4 across all National Curriculum subjects.

## Authentication

OAuth2 with Clerk - sign in with your email to access curriculum resources.

## Quick Start

1. **Search for lessons**: Use the `search` tool to find lessons by topic
2. **Browse curriculum**: Use `get-subjects` and browsing tools to explore structure
3. **Fetch content**: Use `fetch` or specific tools to get detailed lesson content
4. **Download assets**: Use `get-lessons-assets` then `download-asset` for clickable download links

## Orientation

For full orientation — the domain model (key stages, subjects, entity hierarchy), tool categories, common workflows, usage tips, and `fetch` ID formats — read the `curriculum://model` resource, or call the `get-curriculum-model` tool, at the start of a session.

## Documentation

For detailed API documentation, visit: <https://open-api.thenational.academy/docs>

```

## 6. Resource — `eef://interpretation` (assembled)

Exact assembled markdown, rendered IN FULL (PR #337 review: an "exact" surface must not be truncated). The interpolated corpus values (strand text, caveats, named authors) are external EEF content; the scaffold + agent-reasoning layer are Oak-authored.

```text
# EEF Teaching and Learning Toolkit — Interpretation Guide

Read context for grounding `get-eef-evidence`. The EEF Toolkit summarises education research as average impact (months of additional progress), implementation cost, and evidence strength. This guide projects the corpus's own methodology, caveats, attribution, and a complete strand index; it then adds agent reasoning guidance (clearly tagged) and the graph field names. The agent is the only reasoner over the evidence (ADR-191); this guidance cannot constrain it.

## 1. EEF corpus reference (cited)

### Source and attribution

- **Source**: EEF Teaching and Learning Toolkit (Education Endowment Foundation)
- **EEF page**: https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit
- **Authors**: Higgins, S.; Katsipataki, M.; Kokotsaki, D.; Coleman, R.; Major, L.E.; Coe, R.
- **Licence**: Repository-held EEF Toolkit data snapshot; provenance pending EEF clarification
- This structured dataset is the repository-held EEF Teaching and Learning Toolkit snapshot. The acquisition path is not yet confirmed in-repo; it may have been downloaded from EEF or supplied to Oak by EEF. Until EEF clarifies provenance and refresh mechanics, this repository copy is the definitive source for implementation. All EEF-derived outputs must continue to attribute EEF and link users to the original EEF strand pages for full detail, technical appendices, and the most current figures.
- **Coverage**: 3-18 year-olds; International evidence base; primary audience is schools in England and Wales; Systematic reviews of meta-analyses and randomised controlled trials

### Methodology (EEF)

- **Months of additional progress** (months): Derived from effect sizes (typically Cohen's d) reported in meta-analyses and systematic reviews. Effect sizes are converted to months using a standard conversion based on ~0.2 standard deviations of improvement per month of typical school progress. A figure of '+6 months' means that, on average across the included studies, pupils receiving this intervention made 6 months more progress than comparable pupils who did not. This is an average, not a guarantee.
- **Implementation cost**:
  - 1 (Very low): Up to £80 per pupil/year
  - 2 (Low): £80-£200 per pupil/year
  - 3 (Moderate): £200-£600 per pupil/year
  - 4 (High): £600-£1,200 per pupil/year
  - 5 (Very high): Over £1,200 per pupil/year
- **Evidence strength (padlocks)**: 5 padlocks = very extensive, high-quality evidence. 1 padlock = very limited evidence. Padlocks can be lost from the base count for issues such as non-independent evaluation, inconsistent findings, or poor ecological validity.

### Caveats (apply to every figure)

- Impact figures represent population averages from research conditions, not guaranteed outcomes for individual schools or pupils.
- Effect sizes are converted to 'months of additional progress' using a standard approximation (~0.2 SD per month in primary). This conversion varies by age and subject.
- High impact with low evidence strength should be treated with caution — the true effect may differ substantially.
- Implementation quality is a critical moderator. Poorly implemented high-impact strategies can show zero or negative effects.
- The toolkit measures academic attainment outcomes. It does not capture the full value of approaches that have important non-academic benefits (e.g. arts, physical activity, SEL).
- Absence from the toolkit is not evidence of ineffectiveness — it indicates insufficient research to date.
- Digital technology was removed as a standalone strand in 2021 and integrated as a sub-section within other strands.
- Data in this file reflects the May 2025 and October 2025 living systematic review updates where available. Some strands may reflect earlier data pending their annual refresh.
- Some strands now show null impact where evidence is rated 'insufficient'. The EEF cannot determine a reliable impact estimate for these strands.

### Strand index (complete corpus)

Every strand, with its impact-for-cost one-liner and EEF page. Choose strands from this index by inspecting their definitions, findings, and relations — not by axis filtering alone.

| Strand id | Name | Impact-for-cost summary | Tags | EEF page |
| --- | --- | --- | --- | --- |
| eef-tl-arts-participation | Arts participation | Moderate impact for very low cost based on moderate evidence | creative, engagement, cross-curricular, enrichment, primary, secondary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/arts-participation |
| eef-tl-aspiration-interventions | Aspiration interventions | Unclear impact for very low cost based on insufficient evidence | motivation, disadvantage, careers, widening-participation | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/aspiration-interventions |
| eef-tl-behaviour-interventions | Behaviour interventions | Moderate impact for low cost based on moderate evidence | behaviour, classroom-management, self-regulation, universal, targeted, primary, secondary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/behaviour-interventions |
| eef-tl-collaborative-learning | Collaborative learning approaches | Moderate impact for very low cost based on limited evidence | pedagogy, group-work, cooperative-learning, talk, primary, secondary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/collaborative-learning-approaches |
| eef-tl-extending-school-time | Extending school time | Moderate impact for moderate cost based on moderate evidence | time, after-school, holiday, enrichment, academic-support | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/extending-school-time |
| eef-tl-feedback | Feedback | High impact for very low cost based on extensive evidence | assessment, formative-assessment, marking, pedagogy, primary, secondary, high-impact, low-cost | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/feedback |
| eef-tl-homework | Homework | Moderate impact for very low cost based on very limited evidence | homework, independent-learning, primary, secondary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/homework |
| eef-tl-individualised-instruction | Individualised instruction | Moderate impact for very low cost based on limited evidence | differentiation, adaptive-teaching, personalisation, technology | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/individualised-instruction |
| eef-tl-learning-styles | Learning styles | Unclear impact for very low cost based on insufficient evidence | debunked, myths, VAK, differentiation | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/learning-styles |
| eef-tl-mastery-learning | Mastery learning | Moderate impact for very low cost based on limited evidence | mastery, curriculum-design, assessment, progression, primary, secondary, mathematics | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/mastery-learning |
| eef-tl-mentoring | Mentoring | Low impact for moderate cost based on moderate evidence | relationships, role-models, disadvantage, pastoral | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/mentoring |
| eef-tl-metacognition-and-self-regulation | Metacognition and self-regulation | High impact for very low cost based on extensive evidence | metacognition, self-regulation, planning, monitoring, evaluation, pedagogy, high-impact, low-cost, disadvantage, primary, secondary, early-years | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation |
| eef-tl-one-to-one-tuition | One to one tuition | Moderate impact for moderate cost based on moderate evidence | tuition, intervention, targeted-support, primary, secondary, online-tutoring, pupil-premium | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/one-to-one-tuition |
| eef-tl-oral-language-interventions | Oral language interventions | High impact for very low cost based on extensive evidence | oracy, speaking, listening, vocabulary, language, literacy, early-years, primary, secondary, high-impact | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/oral-language-interventions |
| eef-tl-outdoor-adventure-learning | Outdoor adventure learning | Unclear impact for moderate cost based on insufficient evidence | outdoor, adventure, residential, enrichment, wellbeing | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/outdoor-adventure-learning |
| eef-tl-parental-engagement | Parental engagement | Moderate impact for very low cost based on extensive evidence | parents, families, home-learning, communication, early-years, primary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/parental-engagement |
| eef-tl-peer-tutoring | Peer tutoring | High impact for very low cost based on extensive evidence | peer-support, tutoring, structured, reciprocal, primary, secondary, high-impact, low-cost | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/peer-tutoring |
| eef-tl-performance-pay | Performance pay | Low impact for low cost based on very limited evidence | teacher-pay, incentives, workforce, policy | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/performance-pay |
| eef-tl-phonics | Phonics | Moderate impact for very low cost based on extensive evidence | reading, literacy, early-reading, systematic-synthetic-phonics, early-years, KS1, high-impact | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/phonics |
| eef-tl-physical-activity | Physical activity | Low impact for very low cost based on extensive evidence | PE, physical-activity, health, wellbeing, concentration | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/physical-activity |
| eef-tl-reading-comprehension-strategies | Reading comprehension strategies | High impact for very low cost based on moderate evidence | reading, literacy, comprehension, strategies, primary, secondary, high-impact, low-cost | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/reading-comprehension-strategies |
| eef-tl-reducing-class-size | Reducing class size | Low impact for very high cost based on very limited evidence | class-size, staffing, policy, resources | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/reducing-class-size |
| eef-tl-repeating-a-year | Repeating a year | Negative impact for very high cost based on limited evidence | retention, progression, policy, negative-impact | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/repeating-a-year |
| eef-tl-school-uniform | School uniform | Unclear impact for very low cost based on insufficient evidence | uniform, policy, behaviour, school-culture | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/school-uniform |
| eef-tl-setting-and-streaming | Setting and streaming | No impact for very low cost based on very limited evidence | grouping, setting, streaming, ability-grouping, equity, disadvantage | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/setting-and-streaming |
| eef-tl-small-group-tuition | Small group tuition | Moderate impact for low cost based on moderate evidence | tuition, intervention, targeted-support, small-group, primary, secondary, pupil-premium | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/small-group-tuition |
| eef-tl-social-and-emotional-learning | Social and emotional learning | Moderate impact for very low cost based on moderate evidence | SEL, wellbeing, PSHE, social-skills, emotional-regulation, resilience, primary, secondary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/social-and-emotional-learning |
| eef-tl-summer-schools | Summer schools | Moderate impact for moderate cost based on limited evidence | summer, holiday, catch-up, enrichment, disadvantage | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/summer-schools |
| eef-tl-teaching-assistant-interventions | Teaching assistant interventions | Moderate impact for moderate cost based on moderate evidence | teaching-assistants, TAs, deployment, intervention, targeted-support, primary, secondary | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/teaching-assistant-interventions |
| eef-tl-within-class-attainment-grouping | Within-class attainment grouping | Low impact for very low cost based on very limited evidence | grouping, differentiation, flexible-grouping, adaptive-teaching | https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/within-class-attainment-grouping |

## 2. Agent reasoning guidance — NOT EEF corpus evidence

This layer is the calling agent's reasoning scaffold. It is NOT part of the EEF corpus and must never be presented to a teacher as EEF evidence.

### End goals
- Transmit the evidence faithfully: preserve each strand's impact, cost, evidence strength, caveats, and limits.
- Present options and trade-offs, never recommendations or selections — the teacher decides.
- Always attribute EEF and link the teacher to the relevant EEF page for the full detail and most current figures.

### Oak → EEF workflow
1. Understand the teaching task.
2. Use Oak's search, misconception, and prior-knowledge tools to surface the pedagogical signals in the lesson.
3. Name the pedagogical move the signal raises, then choose real strand ids from the index above.
4. Call `get-eef-evidence` with those finite ids/axes; read the returned envelope.
5. Offer the teacher evidence-calibrated options, with caveats and EEF attribution intact.

### Worked examples
- Faithful: "EEF rates feedback as high impact (+6 months) for very low cost on extensive evidence, though figures are population averages and depend on implementation quality."
- Unfaithful: "Use feedback — it is the best strategy." (Invents a ranking; drops cost, evidence strength, and caveats.)

### Reading partial curation honestly
- 17 of 30 strands carry school-context tags (`school_context_relevance`). The absence of a tag is **not evidence of inapplicability** — the corpus covers 3-18 year-olds and curation is partial.
- The complete strand index above, not axis filtering, is the discovery path over the full corpus.

## 3. Graph-structural reference

A `get-eef-evidence` result is an evidence envelope with these fields:
- `answerType`: what kind of result this is — `'strand-lookup'` (exactly the strands you named by id, complete for the request) or `'context-subset'` (the strands the corpus tags for your axis selectors, a NON-EXHAUSTIVE curated subset; a missing tag is not inapplicability). Information about the result, not a recommendation.
- `members`: the matched strands — full strand objects by default, or the headline projection (identity, headline metrics, tags, EEF page) when the query passed `detail: "headline"`.
- `edges`: `related_strand` edges whose endpoints are both members.
- `frontier`: related strand ids outside the member set — suggested next lookups.
- `provenance`: `source` (name, url, organisation, authors), `licence`, and `caveats`, carried once per envelope.

Input selectors are finite and drawn from the corpus: strand ids, and the observed phase, key stage, and priority axes. For `evidence-for-move`, `detail: "headline"` returns a bounded list to scan; drill a chosen strand with `inspect-strand` for its full evidence.

MCP tool names may appear prefixed by the client (e.g. `mcp__<server>__get-eef-evidence`); match tools by their suffix.

```

## 7. Resource/tool — `curriculum://model` / `get-curriculum-model` (representative)

The orientation payload delivered by the priority-1.0 resource and the `get-curriculum-model` tool. Large (66453 chars). Top-level keys: `(string)`. First ~3000 chars shown (line-boundary truncation); the whole is repo-authored domain model + tool guidance (subject/key-stage slug lists are OpenAPI-derived, display metadata authored).

```text
{
  "domainModel": {
    "version": "0.2.0",
    "generatedAt": "2026-06-23T00:00:00Z",
    "purpose": "This ontology describes the Oak National Academy curriculum domain model. It provides context for AI agents to understand the structure of UK education content, including key stages, subjects, entity hierarchies, threads, and tool usage guidance.",
    "notice": "Partially schema-derived: the subject list, the key-stage list, and the KS4 examSubject variants are generated from the OpenAPI schema/SDK at build time and cannot drift from the live API. Display names, key-stage metadata, exam boards, tiers, and pathways are authored.",
    "officialDocs": "https://open-api.thenational.academy/docs/about-oaks-data/glossary",
    "relatedResources": {
      "threadProgressions": "Call get-thread-progressions for ordered unit sequences within curriculum threads (instance data)",
      "priorKnowledgeGraph": "Call get-prior-knowledge-graph with anchor unit slugs for the bounded prior-knowledge subgraph of those units (dependencies and prior knowledge requirements)"
    },
    "curriculumStructure": {
      "keyStages": [
        {
          "slug": "ks1",
          "name": "Key Stage 1",
          "ageRange": "5-7",
          "years": [
            1,
            2
          ],
          "phase": "primary",
          "description": "Foundation stage covering basic literacy and numeracy"
        },
        {
          "slug": "ks2",
          "name": "Key Stage 2",
          "ageRange": "7-11",
          "years": [
            3,
            4,
            5,
            6
          ],
          "phase": "primary",
          "description": "Primary education building on KS1 foundations"
        },
        {
          "slug": "ks3",
          "name": "Key Stage 3",
          "ageRange": "11-14",
          "years": [
            7,
            8,
            9
          ],
          "phase": "secondary",
          "description": "Lower secondary education"
        },
        {
          "slug": "ks4",
          "name": "Key Stage 4",
          "ageRange": "14-16",
          "years": [
            10,
            11
          ],
          "phase": "secondary",
          "description": "GCSE preparation years - has additional programme factors (tiers, exam boards)"
        }
      ],
      "phases": [
        {
          "slug": "primary",
          "name": "Primary",
          "keyStages": [
            "ks1",
            "ks2"
          ],
          "years": [
            1,
            2,
            3,
            4,
            5,
            6
          ]
        },
        {
          "slug": "secondary",
          "name": "Secondary",
          "keyStages": [
            "ks3",
            "ks4"
          ],
          "years": [
            7,
            8,
            9,
            10,
            11
          ]
        }
      ],
      "subjects": [
        {
          "slug": "art",
          "name": "Art",
          "keyStages": [
…[truncated; full length 66453 chars]
```
