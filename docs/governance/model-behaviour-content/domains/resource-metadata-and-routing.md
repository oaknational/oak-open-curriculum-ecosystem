---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# resource-metadata-and-routing — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How each guidance document announces itself — its name, address, audience, and freshness — which decides when an agent reaches for it.

**7 items.** Of those, 3 are traced to a surface an agent can reach today, 3 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (7)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### A003 — Find lessons guidance resource identity and metadata

**What it says now:**

```text
name: 'guidance-find-lessons'

uri: 'docs://oak/guidance/find-lessons.md'

mimeType: 'text/markdown'

annotations: { priority: 0.4, audience: ['assistant'] }

lastModified: '2026-07-23T00:00:00Z'
```

**What it is for:** Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/find-lessons.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/find-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A004 — Explore curriculum guidance resource identity and metadata

**What it says now:**

```text
name: 'guidance-explore-curriculum'

uri: 'docs://oak/guidance/explore-curriculum.md'

mimeType: 'text/markdown'

annotations: { priority: 0.4, audience: ['assistant'] }

lastModified: '2026-07-23T00:00:00Z'
```

**What it is for:** Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/explore-curriculum.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/explore-curriculum.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A005 — Learning progression guidance resource identity and metadata

**What it says now:**

```text
name: 'guidance-learning-progression'

uri: 'docs://oak/guidance/learning-progression.md'

mimeType: 'text/markdown'

annotations: { priority: 0.4, audience: ['assistant'] }

lastModified: '2026-07-23T00:00:00Z'
```

**What it is for:** Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads.

- **Can an agent see it?** Live — an agent can reach these words today
- **Reaches an agent through:** `docs://oak/guidance/learning-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/learning-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A006 — Curriculum mapping guidance resource identity, metadata, and provenance

**What it says now:**

```text
name: 'guidance-curriculum-mapping'

uri: 'docs://oak/guidance/curriculum-mapping.md'

mimeType: 'text/markdown'

annotations: { priority: 0.4, audience: ['assistant'] }

lastModified: '2026-07-23T00:00:00Z'

provenance:
      'Derived from the oak-curriculum-mapper skill (oaknational/oak-skills); keep the two in step.'
```

**What it is for:** Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads. Preserve the source provenance notice as reviewed lineage context.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A007 — Adapt lesson guidance resource identity and metadata

**What it says now:**

```text
name: 'guidance-adapt-lesson'

uri: 'docs://oak/guidance/adapt-lesson.md'

mimeType: 'text/markdown'

annotations: { priority: 0.4, audience: ['assistant'] }

lastModified: '2026-07-23T00:00:00Z'
```

**What it is for:** Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A008 — Continue progression guidance resource identity and metadata

**What it says now:**

```text
name: 'guidance-continue-progression'

uri: 'docs://oak/guidance/continue-progression.md'

mimeType: 'text/markdown'

annotations: { priority: 0.4, audience: ['assistant'] }

lastModified: '2026-07-23T00:00:00Z'
```

**What it is for:** Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/continue-progression.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A009 — Guidance resource catalogue and live-purpose partition

**What it says now:**

```text
export const AGENT_GUIDANCE_RESOURCES: readonly AgentGuidanceResource[] = [
  FIND_LESSONS_GUIDANCE,
  EXPLORE_CURRICULUM_GUIDANCE,
  LEARNING_PROGRESSION_GUIDANCE,
  CURRICULUM_MAPPING_GUIDANCE,
  ADAPT_LESSON_GUIDANCE,
  CONTINUE_PROGRESSION_GUIDANCE,
];

export const NAVIGATION_GUIDANCE_URIS: readonly string[] = [
  FIND_LESSONS_GUIDANCE.uri,
  EXPLORE_CURRICULUM_GUIDANCE.uri,
  LEARNING_PROGRESSION_GUIDANCE.uri,
];

export const CREATION_GUIDANCE_URIS: readonly string[] = [
  CURRICULUM_MAPPING_GUIDANCE.uri,
  ADAPT_LESSON_GUIDANCE.uri,
  CONTINUE_PROGRESSION_GUIDANCE.uri,
];

const CONTENT_BY_URI: ReadonlyMap<string, string> = new Map([
  [FIND_LESSONS_GUIDANCE.uri, FIND_LESSONS_GUIDANCE_MARKDOWN],
  [EXPLORE_CURRICULUM_GUIDANCE.uri, EXPLORE_CURRICULUM_GUIDANCE_MARKDOWN],
  [LEARNING_PROGRESSION_GUIDANCE.uri, LEARNING_PROGRESSION_GUIDANCE_MARKDOWN],
  [CURRICULUM_MAPPING_GUIDANCE.uri, CURRICULUM_MAPPING_GUIDANCE_MARKDOWN],
  [ADAPT_LESSON_GUIDANCE.uri, ADAPT_LESSON_GUIDANCE_MARKDOWN],
  [CONTINUE_PROGRESSION_GUIDANCE.uri, CONTINUE_PROGRESSION_GUIDANCE_MARKDOWN],
]);
```

**What it is for:** Define the complete six-resource catalogue, stable content lookup, and navigation-versus-creation partition consumed by registration, served-surface checks, and public-resource policy.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/agent-guidance-resources.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact
