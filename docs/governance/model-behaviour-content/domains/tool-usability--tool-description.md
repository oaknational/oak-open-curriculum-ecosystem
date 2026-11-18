---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# tool-description — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **tool-description** items of that view, so it can be reviewed in one sitting.

**46 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, 0 to both a reachable and a switched-off surface, and 3 no longer exist in the codebase. 43 live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (14)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C049 — AGENT\_SUPPORT\_TOOL\_METADATA['get-curriculum-model'].shortDescription

**What it says now:**

```text
shortDescription: 'Complete curriculum orientation',
```

**What it is for:** Names get-curriculum-model's purpose ('Complete curriculum orientation') in server instructions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C050 — AGENT\_SUPPORT\_TOOL\_METADATA['get-curriculum-model'].provides

**What it says now:**

```text
provides: [
      'domain model',
      'tool guidance',
      'key stages',
      'subjects',
      'entity hierarchy',
      'ID formats',
      'tool categories',
      'workflows',
      'tips',
    ],
```

**What it is for:** Enumerates what get-curriculum-model returns (domain model, tool guidance, key stages, subjects, entity hierarchy, ID formats, tool categories, workflows, tips); interpolated into server instructions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C066 — SEARCH\_TOOL\_DEF.description

**What it says now:**

```text
description: `Hybrid lexical and semantic search across lessons, units, threads and sequences,
```

**What it is for:** Primary agent guidance: required params, scope-selection rules, do-NOT-use routing to fetch/orientation/browse/explore, NL-to-structured mapping examples, scope limitations, cross-tool workflows, and a large-payload/pagination caution. Interpolates AGGREGATED\_PREREQUISITE\_GUIDANCE and PRIMARY\_ORIENTATION\_TOOL\_NAME from a sibling module.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C101 — EXPLORE\_TOOL\_DEF.description

**What it says now:**

```text
description: `Explore a topic across the entire Oak curriculum in one call.
```

**What it is for:** Routes the agent to use explore for broad discovery; embeds a MUST-call-get-curriculum-model prerequisite, 'Use this when' / 'Do NOT use for' rules, natural-language mapping examples, and next-step tool chaining.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C119 — USER\_SEARCH\_TOOL\_DEF.description

**What it says now:**

```text
description: `Interactive user-facing curriculum search within the Oak MCP App.

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
- Fetching known content by ID (use 'fetch')`,
```

**What it is for:** Routes the agent to invoke the visual/interactive widget search when the user wants to browse with Oak branding; lists scope semantics (lessons/units/threads/sequences), 'Use this when' and 'Do NOT use for' (defer to 'search'/'fetch').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C122 — USER\_SEARCH\_QUERY\_TOOL\_DEF.description

**What it says now:**

```text
description: `App-only search query helper for the Oak MCP App.

This tool executes search queries initiated by the MCP App UI without
requiring model mediation. It is hidden from the model (app-only visibility)
and designed for responsive, interactive search within the app.

The app calls this tool via app.callServerTool() when the user interacts
with search controls directly.`,
```

**What it is for:** Describes the app-only helper as executing UI-initiated searches via app.callServerTool() without model mediation, and states it is hidden from the model.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C138 — BROWSE\_TOOL\_DEF.description

**What it says now:**

```text
description: `Browse what's available in Oak's curriculum without searching.
```

**What it is for:** Steers tool selection: use-when list, do-NOT-use list (defers to search/fetch/orientation tool), NL-\>args mapping examples, and a NOTE that unfiltered calls can exceed host token limits so pass subject/keyStage.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C152 — FETCH\_TOOL\_DEF.description

**What it says now:**

```text
description: `Fetch curriculum resource by canonical identifier.
```

**What it is for:** Steers tool selection: what fetch returns (lesson/unit/subject/sequence/thread detail), do-NOT-use list (defers to search when no id, to orientation tool for id formats), and mandates the 'type:slug' id format with worked examples.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C162 — DOWNLOAD\_ASSET\_TOOL\_DEF.description

**What it says now:**

```text
description: `Generate a short-lived, secure download link for a lesson asset.
```

**What it is for:** Tells the agent what the tool does (5-min self-authenticating download URL), when to use it (has lesson slug + asset type from a prior get-lessons-assets call), and when NOT to (browsing assets, fetching content).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C222 — GET\_KEYWORD\_GRAPH\_TOOL\_DEF.description

**What it says now:**

```text
Returns the key vocabulary for one teaching context: a bounded, frequency-ranked page of curriculum keywords, each decorated with its in-scope placing lessons.
```

**What it is for:** Directs when to call this tool vs get-keywords, explains frequency ranking, bounded top-N, honest totals, coarse firstYear mapping, and the snapshot-not-live/KS4-lag caveat.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C234 — GET\_MISCONCEPTION\_GRAPH\_TOOL\_DEF.description

**What it says now:**

```text
- unitSlugs: the core anchor; each unit returns every placed lesson with its misconceptions, in Oak's authored teaching order

Ordering is a deterministic projection of Oak's authored order, not a single global sequence.
```

**What it is for:** Explains the thread→unit→lesson→misconception chain, the exactly-one-anchor rule, per-anchor body sizes, coverage honesty (thread-scoped never subject-complete), and example questions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C247 — GET\_PRIOR\_KNOWLEDGE\_GRAPH\_TOOL\_DEF.description

**What it says now:**

```text
Returns the stated prior knowledge for the anchor units you name.

Statements name knowledge, not the units that teach it; judging whether earlier units satisfy them is the caller's reasoning.
```

**What it is for:** Defines 'prior knowledge = predecessors', explains prerequisiteFor edges derived from thread ordering, gives empirical result-size table per depth, and example questions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C253 — GET\_THREAD\_PROGRESSIONS\_TOOL\_DEF.description

**What it says now:**

```text
- threadSlug: the detail anchor; returns that ONE thread's full unit progression as one run per subject the thread spans — never the whole thread estate.

Ordering semantics: each run is Oak's curriculum order for that subject — years ascending (earliest → latest), and within a year the authored unit order of the subject's sequence;

Complements get-prior-knowledge-graph (each unit's stated prior knowledge) and get-misconception-graph (per-lesson misconceptions along a thread).
```

**What it is for:** Explains detail vs discovery anchors and, critically, the ORDERING-HONESTY caveat: axis is teaching year, within-year order is NOT curricular — treat same-year units as a group not a chain.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C373 — OAK\_UNDER\_THE\_HOOD\_TOOL\_DESCRIPTION

**What it says now:**

```text
const OAK_UNDER_THE_HOOD_TOOL_DESCRIPTION =
  'Use when a user asks to understand the Oak project, effort, or ecosystem — this repository, ' +
  "how Oak builds and delivers its curriculum, the project's purpose and machinery, or how to " +
  'engage or contribute. Not for curriculum content questions (subjects, units, lessons, key ' +
  'stages, sequencing) — those are served by the curriculum tools.';
```

**What it is for:** The 'separation lever': tells the agent to route repo/effort/ecosystem/contribution questions here and explicitly to send curriculum-content questions (subjects, units, lessons, key stages, sequencing) to the curriculum tools instead.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

## Words owned elsewhere (29)

These are authored somewhere else. Each item names the repository that owns it; raise changes there, not here. Whether an item reaches an agent today is stated on the item itself.

### C453 — normaliseUpstreamDescription

**What it says now:**

```text
export function normaliseUpstreamDescription(rawDescription: string): string {
  return rawDescription
    .replaceAll(/\bThis endpoint\b/gi, (match) =>
      match.startsWith('T') ? 'This tool' : 'this tool',
    )
    .replaceAll(/\s+/g, ' ')
    .trim();
}
```

**What it is for:** Reframes upstream OpenAPI endpoint prose as tool-centric ('This endpoint'-\>'This tool', case-preserving) plus whitespace collapse, so the agent reads the surface as an MCP tool, not an HTTP endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C454 — toToolDescription (summary\n\ndescription assembly)

**What it says now:**

```text
export function toToolDescription(operation: OperationObject): string | undefined {
  const summary = typeof operation.summary === 'string' ? operation.summary.trim() : '';
  const rawDescription = typeof operation.description === 'string' ? operation.description : '';

  const description = normaliseUpstreamDescription(rawDescription);

  // Build git commit message style: summary\n\ndescription
  if (summary && description) {
    return `${summary}\n\n${description}`;
  }
  if (summary) {
    return summary;
  }
  if (description) {
    return description;
  }
  return undefined;
}
```

**What it is for:** Assembles the tool description in git-commit style (summary, blank line, body) so agents grasp purpose from the first line.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C500 — get-key-stages-subject-assets description (base prose)

**What it says now:**

```text
description: "Downloadable assets by key stage and subject
```

**What it is for:** Route agent: use for all assets in KS+subject; Not-for clauses point to sequence/programme/lesson tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C512 — get-key-stages-subject-lessons description (base prose)

**What it says now:**

```text
description: "List lessons in a key stage and subject
```

**What it is for:** Route agent: lessons grouped by unit; pagination note; Not-for points to search/summary/sequence/programme.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C522 — get-key-stages-subject-questions description (base prose)

**What it says now:**

```text
description: "Quiz questions by key stage and subject
```

**What it is for:** Route agent: quiz questions across KS+subject; Not-for points to lesson/sequence/programme.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C532 — get-key-stages-subject-units description (base prose)

**What it says now:**

```text
description: "Units in a key stage and subject
```

**What it is for:** Route agent: flat unit list for KS+subject; examBoard restricts KS4; Not-for points to sequence/programme/thread/single-unit/lessons.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C539 — get-key-stages description (base prose)

**What it says now:**

```text
description: "All key stages
```

**What it is for:** Route agent: master key-stage list; Not-for points to subject-scoped key stages.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C544 — get-keywords description (base prose)

**What it says now:**

```text
description: "Keywords by subject and key stage
```

**What it is for:** Route agent: keyword/vocabulary retrieval; instructs to pass at least one filter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C550 — get-lessons-assets description (base prose)

**What it says now:**

```text
description: "Downloadable assets for a lesson
```

**What it is for:** Route agent: per-lesson downloadable assets; lists 9 asset types; Not-for points to streaming/bulk/summary.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C559 — get-lessons-quiz description (base prose)

**What it says now:**

```text
description: "Quiz questions for a lesson
```

**What it is for:** Route agent: per-lesson starter/exit quiz with correct answers/distractors; Not-for points to sequence/programme/KS/summary.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C566 — get-lessons-summary description (base prose)

**What it says now:**

```text
description: "Lesson summary by slug
```

**What it is for:** Route agent: full lesson metadata by slug; enumerates fields; Not-for points to search/transcript/assets/listing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-summary.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C572 — get-lessons-transcript description (base prose)

**What it says now:**

```text
description: "Lesson video transcript
```

**What it is for:** Route agent: lesson video transcript + WebVTT; Not-for points to search/video-file/summary.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-transcript.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C578 — get-programmes-assets description (base prose)

**What it says now:**

```text
description: "Downloadable assets in a programme
```

**What it is for:** Route agent: per-programme (year group) downloadable assets; pagination; Not-for points to sequence/KS/lesson.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C589 — get-programmes-questions description (base prose)

**What it says now:**

```text
description: "Quiz questions in a programme
```

**What it is for:** Route agent: per-programme quiz questions; tells agent where to get programme slugs; pagination; Not-for points to lesson/sequence/KS.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C598 — get-programmes-units description (base prose)

**What it says now:**

```text
description: "Units in a programme
```

**What it is for:** Route agent: ordered unit sequence for one programme; frames units as knowledge-building sequence; Not-for points to sequence/KS/single-unit/thread.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C604 — description

**What it says now:**

```text
description: "Get a programme by slug
```

**What it is for:** Tells the agent when to call this tool vs siblings and mandates a prerequisite call; shapes routing and sequencing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C609 — description

**What it says now:**

```text
description: "Current rate-limit status\n\nUse when you need rate-limit status as a JSON body — e.g. for a quota indicator. Returns limit, remaining, and reset. The same data sits on the 'X-RateLimit-*' headers of every response, so this tool is rarely needed directly. Does not count against your quota.\n\nNOTE: A response of limit=0, remaining=0, reset=0 indicates an unlimited API key with no rate cap.",
```

**What it is for:** Tells the agent this tool is rarely needed (same data on X-RateLimit-\* headers) and does not count against quota; discourages superfluous calls.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-rate-limit.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C613 — description

**What it says now:**

```text
description: "Downloadable assets in a sequence
```

**What it is for:** Routes the agent to whole-sequence asset retrieval, states licensing/attribution obligations, and heavily steers behaviour on download-link generation and payload-size narrowing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C620 — description

**What it says now:**

```text
description: "Quiz questions across a sequence
```

**What it is for:** Routes agent to whole-sequence questions, explains offset/limit pagination and the Link rel=next header, and mandates the prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C629 — description

**What it says now:**

```text
description: "Units in a curriculum sequence
```

**What it is for:** Routes agent to all units across a sequence, explains exam-board scoping and tiers/pathways/exam subjects, and mandates the prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C635 — description

**What it says now:**

```text
description: "Sequencing information for a given sequence slug
```

**What it is for:** Defines what a 'sequence' is for the agent, tells it where to source sequence slugs, and mandates the prerequisite; central domain-framing content.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C640 — description

**What it says now:**

```text
description: "Single subject with sequences, key stages, and years
```

**What it is for:** Tells the agent what a single subject record returns (sequenceSlugs, keyStages, years) and how to enumerate programmes; mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subject-detail.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C645 — description

**What it says now:**

```text
description: "Key stages for a subject
```

**What it is for:** Narrows the agent to only the key stages for a subject; mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-key-stages.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C650 — description

**What it says now:**

```text
description: "Get all programmes for a subject slug
```

**What it is for:** Routes agent to discover programmes within a subject and get slugs; mandates prerequisite and corrects slug-form misconceptions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-programmes.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C655 — description

**What it says now:**

```text
description: "Year groups for a subject
```

**What it is for:** Narrows the agent to only year groups for a subject; mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C660 — description

**What it says now:**

```text
description: "All subjects
```

**What it is for:** Positions this as the crawl/entry-point tool, enumerates returned fields, steers to programmes enumeration, and mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C664 — description

**What it says now:**

```text
description: "Units in a thread
```

**What it is for:** Defines what a thread is (curriculum-model framing), warns thread order is independent of unit sequence order, and mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C669 — description

**What it says now:**

```text
description: "All threads
```

**What it is for:** Defines a thread and its purpose (vertical connections across year groups), describes the catalogue return, and mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C673 — description

**What it says now:**

```text
description: "Unit summary by slug
```

**What it is for:** Enumerates the unit summary payload (threads, prior-knowledge, national-curriculum statements, lessons), explains variant-slug resolution, and mandates prerequisite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-units-summary.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

## Retired (3)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C004 — ONTOLOGY\_RECOMMENDED\_FIRST\_STEP

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
You MUST call this tool before using other curriculum tools.
```

**What it is for:** Self-referential ('this tool') mandate embedded only in the get-curriculum-model tool description, asserting it must be called before other curriculum tools.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C492 — get-changelog-latest description (base prose, noauth)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
Latest API version\n\nUse when you only need the current API version — e.g. a version banner or deployment check. Returns the most recent changelog entry. Not for: full version history (GET /changelog).
```

**What it is for:** Route agent to/away from this tool (Use-when / Returns / Not-for).

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog-latest.ts`).
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C496 — get-changelog description (base prose, noauth)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
API changelog\n\nUse when you need the full history of API changes... Returns every changelog entry with version and date. Not for: the current version (GET /changelog/latest).
```

**What it is for:** Route agent to/away from this tool (Use-when / Returns / Not-for).

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** nowhere — retired (it was in `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog.ts`).
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact
