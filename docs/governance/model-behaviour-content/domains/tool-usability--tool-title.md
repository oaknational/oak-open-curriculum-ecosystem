---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# tool-title — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **tool-title** items of that view, so it can be reviewed in one sitting.

**42 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (13)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C065 — SEARCH\_TOOL\_DEF.title

**What it says now:**

```text
title: 'Search Curriculum',
```

**What it is for:** Names the tool 'Search Curriculum' so an agent selects it for curriculum-search intents and a human recognises it in the tool list.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C100 — EXPLORE\_TOOL\_DEF.title

**What it says now:**

```text
title: 'Explore Topic',
```

**What it is for:** Names the tool 'Explore Topic' in tool listings so agent/user recognise it as the broad cross-curriculum discovery entry point.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C118 — USER\_SEARCH\_TOOL\_DEF.title

**What it says now:**

```text
title: 'User Search',
```

**What it is for:** Names the interactive widget search tool 'User Search' in listings, distinguishing it from the agent-facing 'search'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C121 — USER\_SEARCH\_QUERY\_TOOL\_DEF.title

**What it says now:**

```text
title: 'User Search Query',
```

**What it is for:** Names the app-only search helper 'User Search Query'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C137 — BROWSE\_TOOL\_DEF.title

**What it says now:**

```text
title: 'Browse Curriculum',
```

**What it is for:** Names the tool 'Browse Curriculum' so agents/hosts pick it for orientation/discovery over search or fetch.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C151 — FETCH\_TOOL\_DEF.title

**What it says now:**

```text
title: 'Fetch Curriculum Resource',
```

**What it is for:** Names the tool 'Fetch Curriculum Resource' so agents pick it to retrieve a resource by canonical id.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C161 — DOWNLOAD\_ASSET\_TOOL\_DEF.title

**What it says now:**

```text
title: 'Download Asset',
```

**What it is for:** Names the tool 'Download Asset' in the tool catalog so a consuming agent recognises it as the way to get a downloadable asset link.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C221 — KEYWORD\_GRAPH\_TOOL\_TITLE

**What it says now:**

```text
const KEYWORD_GRAPH_TOOL_TITLE = 'Oak Curriculum Keyword Graph';
```

**What it is for:** Names/brands the tool in tools/list so an agent recognises it as the Oak curriculum keyword graph retriever.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C233 — MISCONCEPTION\_TOOL\_TITLE

**What it says now:**

```text
const MISCONCEPTION_TOOL_TITLE = 'Oak Curriculum Misconception Subgraph';
```

**What it is for:** Names the misconception subgraph tool in tools/list.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C246 — PRIOR\_KNOWLEDGE\_TOOL\_TITLE

**What it says now:**

```text
const PRIOR_KNOWLEDGE_TOOL_TITLE = 'Oak Curriculum Prior Knowledge Subgraph';
```

**What it is for:** Names the prior-knowledge subgraph tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C252 — THREAD\_PROGRESSIONS\_TOOL\_TITLE

**What it says now:**

```text
const THREAD_PROGRESSIONS_TOOL_TITLE = 'Oak Curriculum Thread Progressions';
```

**What it is for:** Names the thread-progressions tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C372 — tool title 'Oak: Under the Hood'

**What it says now:**

```text
const OAK_UNDER_THE_HOOD_TOOL_TITLE = 'Oak: Under the Hood';
```

**What it is for:** Human/agent-readable title shown in tool catalogues to name the orientation capability.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C468 — kebabToTitleCase

**What it says now:**

```text
export function kebabToTitleCase(name: unknown): string {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError(`Name must be a string, given: ${String(name)}`);
  }

  return name
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}
```

**What it is for:** Derive the human-readable annotations.title from the kebab tool name (get-key-stages -> 'Get Key Stages') for host display.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/kebab-to-title-case.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

## Words owned elsewhere (29)

These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.

### C491 — get-changelog-latest annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Changelog Latest",
```

**What it is for:** Label used for tool selection in listings/pickers.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog-latest.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C495 — get-changelog annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Changelog",
```

**What it is for:** Label used for tool selection in listings/pickers.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C499 — get-key-stages-subject-assets annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Key Stages Subject Assets",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C511 — get-key-stages-subject-lessons annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Key Stages Subject Lessons",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C521 — get-key-stages-subject-questions annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Key Stages Subject Questions",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C531 — get-key-stages-subject-units annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Key Stages Subject Units",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C538 — get-key-stages annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Key Stages",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C543 — get-keywords annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Keywords",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C549 — get-lessons-assets annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Lessons Assets",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C558 — get-lessons-quiz annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Lessons Quiz",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C565 — get-lessons-summary annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Lessons Summary",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-summary.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C571 — get-lessons-transcript annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Lessons Transcript",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-transcript.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C577 — get-programmes-assets annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Programmes Assets",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C588 — get-programmes-questions annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Programmes Questions",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C597 — get-programmes-units annotations.title (+ tool name)

**What it says now:**

```text
title: "Get Programmes Units",
```

**What it is for:** Label used for tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C603 — name / annotations.title

**What it says now:**

```text
const name = 'get-programmes' as const;

title: "Get Programmes",
```

**What it is for:** Names the tool the agent invokes (get-programmes) and the human-facing display label; steers tool selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C608 — name / annotations.title

**What it says now:**

```text
const name = 'get-rate-limit' as const;

title: "Get Rate Limit",
```

**What it is for:** Names/labels the rate-limit tool for agent selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-rate-limit.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C612 — name / annotations.title

**What it says now:**

```text
const name = 'get-sequences-assets' as const;

title: "Get Sequences Assets",
```

**What it is for:** Names/labels the sequence-assets tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C619 — name / annotations.title

**What it says now:**

```text
const name = 'get-sequences-questions' as const;

title: "Get Sequences Questions",
```

**What it is for:** Names/labels the sequence-questions tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C628 — name / annotations.title

**What it says now:**

```text
const name = 'get-sequences-units' as const;

title: "Get Sequences Units",
```

**What it is for:** Names/labels the sequence-units tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C634 — name / annotations.title

**What it says now:**

```text
const name = 'get-sequences' as const;

title: "Get Sequences",
```

**What it is for:** Names/labels the sequence-summary tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C639 — name / annotations.title

**What it says now:**

```text
const name = 'get-subject-detail' as const;

title: "Get Subject Detail",
```

**What it is for:** Names/labels the subject-detail tool. Note name 'get-subject-detail' diverges from the pluralised sibling naming.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subject-detail.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C644 — name / annotations.title

**What it says now:**

```text
const name = 'get-subjects-key-stages' as const;

title: "Get Subjects Key Stages",
```

**What it is for:** Names/labels the subject-key-stages tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-key-stages.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C649 — name / annotations.title

**What it says now:**

```text
const name = 'get-subjects-programmes' as const;

title: "Get Subjects Programmes",
```

**What it is for:** Names/labels the subject-programmes tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-programmes.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C654 — name / annotations.title

**What it says now:**

```text
const name = 'get-subjects-years' as const;

title: "Get Subjects Years",
```

**What it is for:** Names/labels the subject-years tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C659 — name / annotations.title

**What it says now:**

```text
const name = 'get-subjects' as const;

title: "Get Subjects",
```

**What it is for:** Names/labels the all-subjects catalogue tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C663 — name / annotations.title

**What it says now:**

```text
const name = 'get-threads-units' as const;

title: "Get Threads Units",
```

**What it is for:** Names/labels the thread-units tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C668 — name / annotations.title

**What it says now:**

```text
const name = 'get-threads' as const;

title: "Get Threads",
```

**What it is for:** Names/labels the all-threads catalogue tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C672 — name / annotations.title

**What it says now:**

```text
const name = 'get-units-summary' as const;

title: "Get Units Summary",
```

**What it is for:** Names/labels the unit-summary tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-units-summary.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact
