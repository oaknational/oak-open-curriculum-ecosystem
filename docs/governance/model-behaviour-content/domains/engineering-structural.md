---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# engineering-structural — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Annotations, schemas, authorisation scopes, and discovery or branding metadata.

**93 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 4 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (85)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C007 — SCOPES\_SUPPORTED

**What it says now:**

```text
export { SCOPES_SUPPORTED } from '@oaknational/sdk-codegen/mcp-tools';
```

**What it is for:** Advertises the OAuth scopes the MCP server supports (surfaced in auth/PRM discovery); shapes what clients request and what an agent can access. This file only re-exports it to give aggregated tools a stable import path.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/scopes-supported.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C011 — serverOverview.name / version

**What it says now:**

```text
name: 'Oak Curriculum MCP Server',
    version: '1.0.0',
```

**What it is for:** Identifies the MCP server to the host/agent by name and version, shaping how it is labelled and disambiguated.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C012 — serverOverview.aboutOak / oakWebsite

**What it says now:**

```text
aboutOak:
      "Oak National Academy is the UK's national curriculum body, providing free, high-quality, fully-resourced curriculum resources for teachers and students.",
    oakWebsite: 'https://www.thenational.academy',
```

**What it is for:** Frames Oak as the UK national curriculum body offering free high-quality resources; sets trust/context for how the agent describes the source.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C013 — serverOverview.description

**What it says now:**

```text
description:
      'Access Oak National Academy curriculum resources including lessons, units, quizzes, transcripts, and teaching materials. Covers Key Stages 1-4 across all National Curriculum subjects.',
```

**What it is for:** States coverage (lessons, units, quizzes, transcripts, materials; KS1-4, all National Curriculum subjects) so the agent scopes expectations of what is retrievable.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C015 — serverOverview.documentation

**What it says now:**

```text
documentation: 'https://open-api.thenational.academy/docs',
```

**What it is for:** Points to the canonical API docs URL the agent can cite/redirect to for deeper reference.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C023 — toolCategories.\*.tools (6 arrays)

**What it says now:**

```text
tools: [
        'search',
        'user-search',
        'user-search-query',
        'explore-topic',
        'browse-curriculum',
        'get-subjects',
        'get-key-stages',
      ],
      description:
        'Find curriculum content using semantic search, topic exploration, or structured listing. ' +
        'search provides semantic search across lessons, units, threads, and sequences via a scope parameter. ' +
        'explore-topic searches all scopes in parallel for broad discovery. ' +
        'browse-curriculum returns structured facets without a search query.',
      whenToUse:
        'When you need to find content on a topic, explore what is available, or browse the curriculum structure. ' +
        'Use search with a specific scope for targeted results, explore-topic for broad discovery, ' +
        'or browse-curriculum to see what subjects and key stages exist.',
    } satisfies ToolCategory,

    browsing: {
      tools: [
        'get-key-stages-subject-units',
        'get-key-stages-subject-lessons',
        'get-sequences',
        'get-subjects-years',
      ],
      description:
        'Explore curriculum structure systematically by navigating through subjects, units, and lessons via the REST API.',
      whenToUse:
        'When you want to navigate the curriculum hierarchy step by step (subject then units then lessons). ' +
        'For a quicker overview, use browse-curriculum or explore-topic instead.',
    } satisfies ToolCategory,
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Enumerates which tool names belong to each category (discovery, browsing, fetching, progression, programmes, agentSupport), shaping the agent's mental map of available tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C067 — SEARCH\_TOOL\_DEF.annotations

**What it says now:**

```text
title: 'Search Curriculum',
```

**What it is for:** Declares readOnlyHint:true, destructiveHint:false, idempotentHint:true, openWorldHint:false so the host treats the tool as safe to call/retry without confirmation and closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C090 — SCOPE\_TITLES

**What it says now:**

```text
const SCOPE_TITLES: Readonly<Record<SearchSdkScope, string>> = {
  lessons: 'Search Lessons',
  units: 'Search Units',
  threads: 'Search Threads',
  sequences: 'Search Sequences',
  suggest: 'Search Suggestions',
};
```

**What it is for:** Per-scope annotation titles (Search Lessons/Units/Threads/Sequences/Suggestions) passed as annotationsTitle to label the result surface.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C102 — EXPLORE\_TOOL\_DEF.annotations

**What it says now:**

```text
title: 'Explore Topic',
```

**What it is for:** Declares read-only / non-destructive / idempotent / closed-world hints so the agent treats the tool as safe to call freely without side-effect concern.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C110 — formatTopicMap response metadata (toolName, annotationsTitle)

**What it says now:**

```text
status: 'success',
    toolName: 'explore-topic',
    annotationsTitle: 'Explore Topic',
```

**What it is for:** Stamps the response with toolName 'explore-topic' and display annotationsTitle 'Explore Topic' so the agent/UI attribute results to this tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C120 — USER\_SEARCH / USER\_SEARCH\_QUERY annotations (grouped, 2 identical blocks)

**What it says now:**

```text
title: 'User Search',
```

**What it is for:** Declares both user-search tools read-only / non-destructive / idempotent / closed-world so agent treats them as safe to call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C123 — USER\_SEARCH\_QUERY\_TOOL\_DEF.\_meta.ui.visibility

**What it says now:**

```text
ui: { visibility: ['app'] satisfies ('model' | 'app')[] },
```

**What it is for:** Sets visibility to app-only, gating the tool out of the model's tool list so the agent cannot call it directly.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C139 — BROWSE\_TOOL\_DEF.annotations

**What it says now:**

```text
title: 'Browse Curriculum',
```

**What it is for:** Behaviour hints telling the host the tool is read-only, non-destructive, idempotent, closed-world — so it may be called freely and safely retried.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C153 — FETCH\_TOOL\_DEF.annotations

**What it says now:**

```text
title: 'Fetch Curriculum Resource',
```

**What it is for:** Behaviour hints: read-only, non-destructive, idempotent, closed-world — so hosts call freely and retry safely.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C166 — DOWNLOAD\_ASSET\_TOOL\_DEF.annotations

**What it says now:**

```text
title: 'Download Asset',
```

**What it is for:** MCP behaviour hints: read-only, non-destructive, idempotent, closed-world — signal to clients the tool is safe to call without confirmation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C177 — securitySchemes / \_meta.securitySchemes oauth2 scope declaration (both tools)

**What it says now:**

```text
securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
```

**What it is for:** Declares the tool requires oauth2 with SCOPES\_SUPPORTED, driving the client's auth/consent flow before the tool can be called.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C216 — DOCUMENTATION\_RESOURCES[getting-started].annotations

**What it says now:**

```text
annotations: {
      priority: 0.8,
      audience: ['user', 'assistant'] satisfies ('user' | 'assistant')[],
    },
```

**What it is for:** MCP resource annotations (priority 0.8, audience user+assistant) that hint clients to surface this guide prominently to both humans and assistants.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C231 — tool annotations (readOnly/destructive/idempotent/openWorld)

**What it says now:**

```text
title: KEYWORD_GRAPH_TOOL_TITLE,
```

**What it is for:** Signals read-only, non-destructive, idempotent, closed-world so the agent can reason about safety/caching. GROUPED: identical block appears in all 5 curriculum graph tools plus get-eef-evidence.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C232 — securitySchemes (oauth2 SCOPES\_SUPPORTED)

**What it says now:**

```text
securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],

_meta: {
    securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],
  },
```

**What it is for:** Declares OAuth2 scopes required to call the tool. GROUPED: same oauth2/SCOPES\_SUPPORTED declaration repeats across all tool defs in this slice.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C285 — eefEvidenceToCallToolResult toolName

**What it says now:**

```text
export function eefEvidenceToCallToolResult(result: EefEvidenceResult): CallToolResult {
  if (result.isError) {
    return { content: result.content, isError: true };
  }
  return formatToolResponse({
    summary: result.summary,
    data: result.envelope,
    status: 'success',
    toolName: 'get-eef-evidence',
    annotationsTitle: GET_EEF_EVIDENCE_TOOL_DEF.title,
    timestamp: Date.now(),
  });
```

**What it is for:** Stamps the response envelope with toolName 'get-eef-evidence' and reuses the tool def title; no other authored agent-facing prose (pure transport membrane).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-evidence-egress.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C322 — search-result scope discriminant vocabulary

**What it says now:**

```text
/** Lessons search result. */
export interface LessonsSearchResult extends SearchResultMeta {
  readonly scope: 'lessons';
  readonly results: readonly LessonResult[];
}

/** Units search result. */
export interface UnitsSearchResult extends SearchResultMeta {
  readonly scope: 'units';
  readonly results: readonly UnitResult[];
}

/** Sequences search result. */
export interface SequencesSearchResult extends SearchResultMeta {
  readonly scope: 'sequences';
  readonly results: readonly SequenceResult[];
}

/** Threads search result. */
export interface ThreadsSearchResult extends SearchResultMeta {
  readonly scope: 'threads';
  readonly results: readonly ThreadResult[];
}
```

**What it is for:** Defines the authored scope discriminants (lessons/units/sequences/threads) that tag each search-result shape, letting an agent identify which corpus a result set belongs to.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-types.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C323 — McpServer Implementation name (oak-curriculum-http) + version

**What it says now:**

```text
const server = new McpServer(
      { name: 'oak-curriculum-http', version: '0.1.0', ...OAK_SERVER_BRANDING },
      { instructions: SERVER_INSTRUCTIONS },
    );
```

**What it is for:** The bare technical server identity advertised in the MCP initialize result / host server list; the branding fields (title etc.) are spread over it so the host shows a human name rather than 'oak-curriculum-http v0.1.0'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C325 — OAK\_SERVER\_BRANDING.title

**What it says now:**

```text
title: 'Oak National Academy',
```

**What it is for:** Human-readable server title rendered in every MCP host's server list, establishing the Oak National Academy brand as the source of the tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C326 — OAK\_SERVER\_BRANDING.description

**What it says now:**

```text
description:
    "Search, explore, download and use Oak's free, fully sequenced and resourced curriculum resources, for KS1 to KS4.",
```

**What it is for:** One-line server pitch that frames what the whole toolset is for (search/explore/download/use Oak's free sequenced KS1-KS4 curriculum) and sets scope expectations for agent + user.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C327 — OAK\_SERVER\_BRANDING.websiteUrl

**What it says now:**

```text
websiteUrl: 'https://www.thenational.academy',
```

**What it is for:** Canonical Oak website pointer / source-attribution surfaced in host UI so users can reach the authoritative Oak site.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C328 — OAK server icons (light #287c34 / dark #ffffff acorn SVG data URIs)

**What it says now:**

```text
const OAK_ACORN_PATH =
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Themed acorn logo icons shown next to the server in the host UI for brand recognition against light/dark backgrounds; base64 data: URIs per MCP spec.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C341 — HTML\_HEAD <title>

**What it says now:**

```text
const PAGE_TITLE = 'Oak Curriculum MCP (HTTP)';
```

**What it is for:** Names the service in the browser tab / document title so a reader (or an agent fetching the page) identifies it as the Oak Curriculum MCP HTTP server.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/landing-page-document.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/html-head.ts`).
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C345 — status/route/auth meta line

**What it says now:**

```text
Status: ok • Route: <code>/mcp</code> • Auth: OAuth 2.1
```

**What it is for:** Advertises operational facts an agent/user needs to connect: hardcoded 'Status: ok', MCP route '/mcp', and auth scheme 'OAuth 2.1'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C353 — app-version meta template

**What it says now:**

```text
<meta name="app-version" content={appVersion} />
```

**What it is for:** Emits the build identity as an HTML meta tag so tooling/agents can read the deployed app version.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/landing-page-document.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C357 — section count headings (Prompts/Resources/Tools)

**What it says now:**

```text
Resources ({resources.length})

Tools ({aggregatedTools.length + generatedTools.length})
```

**What it is for:** Advertises how many prompts/resources/tools exist via templated counts in each section heading, signalling surface size. (Grouped: 3 near-identical headings — prompts L51, resources L44, tools L144.)

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/resources-section.tsx`, `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-prompts-section.ts`).
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C369 — AGGREGATED\_TOOL\_ORDER curation list

**What it says now:**

```text
export const AGGREGATED_TOOL_ORDER: readonly AggregatedToolName[] = [
```

**What it is for:** Curated display order of aggregated tools ('value-add first, utilities last') that shapes which tools a reader sees first (get-curriculum-model, browse, explore, search, fetch, then graphs/utilities/download).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/derive-view-props.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C371 — OAK\_UNDER\_THE\_HOOD\_TOOL\_NAME

**What it says now:**

```text
export const OAK_UNDER_THE_HOOD_TOOL_NAME = 'oak-under-the-hood';
```

**What it is for:** The wire tool name advertised in tools/list; a connecting agent uses it to identify and invoke the orientation capability, and it anchors routing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C374 — tool annotations {readOnlyHint, openWorldHint}

**What it says now:**

```text
openWorldHint: false,
        title: OAK_UNDER_THE_HOOD_TOOL_TITLE,
```

**What it is for:** Signals the tool is read-only and open-world (points OUT to a fetched external canonical), shaping client trust/execution decisions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C384 — appInfo.name 'oak-curriculum-mcp-app'

**What it says now:**

```text
setHostContext((prev) => ({ ...prev, ...updatedHostContext }));
        applyHostContextToRuntime(dispatch, updatedHostContext);
      });
    },
```

**What it is for:** App identity string sent to the MCP host when the UI app is created, identifying the widget in host context.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C393 — OakLogo inline acorn SVG

**What it says now:**

```text
<svg
      aria-hidden="true"
      focusable="false"
      viewBox={WORDMARK_VIEWBOX}
      className="oak-brand-banner__logo"
      dangerouslySetInnerHTML={wordmarkGeometry}
    />
```

**What it is for:** Oak acorn brand mark rendered with currentColor (adapts to light/dark/forced-colours); aria-hidden decorative reinforcement of brand identity/orientation. Path data extracted from the Oak-Web-Application sprite sheet.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C408 — rewriteAuthServerMetadata

**What it says now:**

```text
export function rewriteAuthServerMetadata(
  upstreamMetadata: UpstreamAuthServerMetadata,
  localOrigin: string,
): UpstreamAuthServerMetadata {
  return {
    ...upstreamMetadata,
    issuer: localOrigin,
    authorization_endpoint: `${localOrigin}/oauth/authorize`,
    token_endpoint: `${localOrigin}/oauth/token`,
    registration_endpoint: `${localOrigin}/oauth/register`,
  };
}
```

**What it is for:** Rewrites upstream Clerk AS metadata so issuer + authorization/token/registration endpoints point at the local proxy origin, directing the client to send all OAuth flow requests to the proxy (same-origin, Cursor-bug workaround).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C414 — renderEndpointCatalog: '## Endpoint Catalog' header

**What it says now:**

```text
const lines: string[] = ['## Endpoint Catalog'];
```

**What it is for:** Names the generated endpoint catalog so a consuming agent recognises the block as the authoritative list of HTTP endpoints it can call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C418 — renderToolCatalog: '## MCP Tool Catalog' header

**What it says now:**

```text
const lines: string[] = ['## MCP Tool Catalog'];
```

**What it is for:** Names the generated MCP tool catalog so agents recognise the block as the list of callable MCP tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C419 — renderToolCatalog: per-tool entry template (path/method/operationId/path params/query params)

**What it says now:**

```text
for (const name of entries) {
    const descriptor = lookupTool(name);
    const operationId = getOwnString(descriptor, 'operationId');
    lines.push(
      `### ${name}`,
      `- path: ${getOwnString(descriptor, 'path') ?? ''}`,
      `- method: ${getOwnString(descriptor, 'method') ?? ''}`,
    );
    if (operationId) {
      lines.push(`- operationId: ${operationId}`);
    }
    lines.push(
      `- path params: ${listParamObjectKeys(getOwnValue(descriptor, 'pathParams'))}`,
      `- query params: ${listParamObjectKeys(getOwnValue(descriptor, 'queryParams'))}`,
      '',
    );
```

**What it is for:** Frames each MCP tool as '### <name>' followed by authored labelled lines (path, method, operationId, path params, query params) so agents can map a tool name to its HTTP binding and inputs.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C463 — TOOL\_DESCRIPTION\_ADDITIONS map + appendToolEnhancements

**What it says now:**

```text
export const TOOL_DESCRIPTION_ADDITIONS: ReadonlyMap<string, string> = new Map([
```

**What it is for:** Declarative config binding each generated tool name to the authored guidance note appended to its description at codegen time.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C469 — generateMcpToolName (endpoint->tool rewrite + special cases)

**What it says now:**

```text
export function generateMcpToolName(path: string, method: string): string {
  // Special cases to avoid duplicates and reserved words
  // 'type' is a TypeScript keyword, so we use 'assetType' instead
  if (path === '/lessons/{lesson}/assets/{type}') {
    return 'get-lessons-assets-by-type';
  }
  if (path === '/subjects/{subject}' && method === 'get') {
    return 'get-subject-detail';
  }

  // Parse path to extract non-parameter segments
  const segments = path.split('/').filter(Boolean);
  const paramPattern = /^\{[^}]+\}$/;

  // Filter out parameter segments and clean remaining segments
  const nameSegments = segments
    .filter((seg) => !paramPattern.test(seg))
    .map((s) => s.replaceAll(/[^a-zA-Z0-9]+/g, '-'))
    .filter(Boolean);

  // Generate deterministic name: oak-{method}-{segments}
  return `${method.toLowerCase()}-${nameSegments.join('-')}`;
}
```

**What it is for:** Deterministic endpoint->tool-name rewrite that becomes the identifier the agent invokes; special cases avoid duplicates/reserved words.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/name-generator.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C470 — SKIPPED\_PATHS

**What it says now:**

```text
export const SKIPPED_PATHS: ReadonlySet<string> = new Set([
  '/search/lessons',
  '/search/transcripts',
  '/lessons/{lesson}/assets/{type}',
]);
```

**What it is for:** Exclude search/asset-by-type paths from the generated tool catalog (superseded by ES search / non-transportable), shaping which tools the agent can see.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts`).
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C471 — operationId fallback template

**What it says now:**

```text
const operationId = operation.operationId ?? `${method}-${path.replaceAll(/[{}]/g, '')}`;
```

**What it is for:** Synthesise an operationId when upstream omits one; operationId surfaces in definitions and in the UndocumentedResponseError message.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C473 — generateScopesSupportedFile / SCOPES\_SUPPORTED emitter

**What it says now:**

```text
export function generateScopesSupportedFile(): string {
  const scopes = getScopesSupported();
  const quotedScopes = scopes.map((s) => `'${s}'`).join(', ');
  const scopesLiteral = `[${quotedScopes}]`;

  return [
    BANNER,
    '',
    `export const SCOPES_SUPPORTED = ${scopesLiteral} as const;`,
    '',
    '/**',
    ' * Type representing the supported OAuth scopes.',
    ' */',
    'export type ScopesSupported = typeof SCOPES_SUPPORTED;',
    '',
  ].join('\n');
```

**What it is for:** Emit the OAuth scopes constant runtime serves as RFC 9728 protected-resource metadata (client/agent-facing during auth discovery).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-scopes-supported-file.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C475 — annotations block (readOnlyHint/destructiveHint/idempotentHint/openWorldHint + title)

**What it says now:**

```text
// MCP annotations: all Oak tools are read-only, non-destructive, idempotent GET operations
  const humanReadableTitle = kebabToTitleCase(toolName);
  lines.push(
    '  annotations: {',
    '    readOnlyHint: true,',
    '    destructiveHint: false,',
    '    idempotentHint: true,',
    '    openWorldHint: false,',
    `    title: ${JSON.stringify(humanReadableTitle)},`,
    '  },',
  );
```

**What it is for:** Declare every Oak tool read-only, non-destructive, idempotent, closed-world so hosts treat all calls as safe reads.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C476 — requiresDomainContext flag

**What it says now:**

```text
// Determine if tool benefits from domain context (get-curriculum-model)
  // Utility tools (noauth) like get-rate-limit don't need domain context
  const requiresDomainContext = securitySchemes[0]?.type !== NOAUTH_SCHEME_TYPE;

`  requiresDomainContext: ${requiresDomainContext ? 'true' : 'false'},`,
```

**What it is for:** Signal to the host whether a tool benefits from get-curriculum-model grounding (auth tools true, noauth utility tools false).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C479 — BASE\_WIDGET\_URI

**What it says now:**

```text
export const BASE_WIDGET_URI = `ui://widget/oak-curriculum-app-${resolveWidgetUriSuffix({

vercel: process.env.VERCEL,
  gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID
```

**What it is for:** Advertise the widget bundle URI in \_meta.ui.resourceUri for widget tools; the cache-busting hash forces hosts to reload a fresh bundle.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C480 — WIDGET\_TOOL\_NAMES

**What it says now:**

```text
/**
 * Tools that should advertise a widget UI via `_meta.ui.resourceUri`.
 *
 * Only allowlisted **names** emit `_meta.ui.resourceUri` in codegen and in
 * aggregated tool definitions. Other tools must not include `resourceUri`
 * in `_meta.ui` (even if they use `_meta.ui.visibility` for app-only helpers).
 *
 * Tools in this set get `_meta.ui.resourceUri` in their codegen output
 * and in aggregated definitions.
 *
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set([
  'get-curriculum-model',
  'user-search',
]);
```

**What it is for:** Allowlist of tools that advertise a widget UI (get-curriculum-model, user-search); all other tools must omit resourceUri.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C485 — collectExports ignoreNames filter

**What it says now:**

```text
// Filter out internal helper functions that aren’t useful for AI agents
  const exported = collectExports(project).filter((r) => {
    const name = r.name;
    const ignoreNames = new Set([
      'typeSafeKeys',
      'typeSafeValues',
      'typeSafeEntries',
      'typeSafeGet',
      'typeSafeSet',
      'typeSafeHas',
      'typeSafeHasOwn',
    ]);
    if (ignoreNames.has(name)) {
      return false;
    }
    const src = r.sources?.[0]?.fileName ?? '';
    if (src.includes('types/helpers.ts')) {
      return false;
    }
    return true;
  });
```

**What it is for:** Curate the AI doc by dropping internal helpers (typeSafe\* and anything from types/helpers.ts) so they don't appear in the agent-facing surface.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C494 — get-changelog-latest annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Changelog Latest",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world so hosts can auto-approve and reason about safety.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog-latest.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C498 — get-changelog annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Changelog",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C510 — get-key-stages-subject-assets annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages Subject Assets",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C520 — get-key-stages-subject-lessons annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages Subject Lessons",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C530 — get-key-stages-subject-questions annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages Subject Questions",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C537 — get-key-stages-subject-units annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages Subject Units",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C542 — get-key-stages annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C548 — get-keywords annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Keywords",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C557 — get-lessons-assets annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Lessons Assets",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C564 — get-lessons-quiz annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Lessons Quiz",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C570 — get-lessons-summary annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Lessons Summary",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-summary.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C576 — get-lessons-transcript annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Lessons Transcript",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-transcript.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C587 — get-programmes-assets annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Programmes Assets",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C596 — get-programmes-questions annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Programmes Questions",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C602 — get-programmes-units annotations (behaviour hints)

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Programmes Units",
  },
```

**What it is for:** Advertise read-only/non-destructive/idempotent/closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C607 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Programmes",
  },
```

**What it is for:** Machine hints telling the agent the tool is safe to call/retry: read-only, non-destructive, idempotent, closed-world.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C611 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Rate Limit",
  },
```

**What it is for:** Read-only/idempotent/non-destructive/closed-world hints for a safe GET.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-rate-limit.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C618 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Sequences Assets",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C627 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Sequences Questions",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C633 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Sequences Units",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C638 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Sequences",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C643 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Subject Detail",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subject-detail.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C648 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Subjects Key Stages",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-key-stages.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C653 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Subjects Programmes",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-programmes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C658 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Subjects Years",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C662 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Subjects",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C667 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Threads Units",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C671 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Threads",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C676 — annotations block

**What it says now:**

```text
annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Units Summary",
  },
```

**What it is for:** Safe-GET hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-units-summary.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C689 — generateMetadataUrl

**What it says now:**

```text
function generateMetadataUrl(resourceUrl: string): string {
  // Parse the resource URL to get protocol and host
  const url = new URL(resourceUrl);
  const protocol = url.protocol; // "http:" or "https:"
  const host = url.host; // "example.com" or "localhost:3000"

  // RFC 9728 Section 3.1: path-qualified PRM URL includes resource pathname
  return `${protocol}//${host}/.well-known/oauth-protected-resource${url.pathname}`;
```

**What it is for:** Builds the path-qualified PRM URL embedded as resource\_metadata="…" that points the client at the well-known OAuth Protected Resource Metadata endpoint (RFC 9728 3.1).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C706 — servePrm PRM response body

**What it says now:**

```text
resource: `${selfOrigin}${MCP_RESOURCE_PATH}`,
      authorization_servers: [upstreamMetadata.issuer],
      scopes_supported: SCOPES_SUPPORTED,
```

**What it is for:** The RFC 9728 OAuth Protected Resource Metadata document (resource, authorization\_servers, scopes\_supported) served at both well-known PRM paths, telling clients where/how to authenticate.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C708 — /.well-known/mcp-stub-mode { stubMode: true }

**What it says now:**

```text
app.get('/.well-known/mcp-stub-mode', (_req, res) => {
```

**What it is for:** When useStubTools is on, publicly advertises a custom well-known endpoint returning {stubMode:true}, telling any client the server is serving canned stub responses rather than live curriculum data.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C716 — stub error code vocabulary

**What it says now:**

```text
throw new McpToolError('Stub result content is empty', name, { code: 'STUB_DECODE_ERROR' });
  }
  try {
    return JSON.parse(first.text);
  } catch (error) {
    throw new McpToolError('Stub result is not valid JSON', name, {
      code: 'STUB_DECODE_ERROR',
      cause: error instanceof Error ? error : undefined,
    });
  }
}

function deriveErrorMessage(result: CallToolResult): string {
  const first = extractFirstText(result);
  if (first) {
    return first.text;
  }
  return 'Stub execution failed without diagnostic text content';
}

export function createStubToolExecutionAdapter(): (
  name: ToolName,
  args: unknown,
) => Promise<ToolExecutionResult> {
  const executeStubTool = createCallToolStubExecutor();

  return async (name: ToolName, args: unknown): Promise<ToolExecutionResult> => {
    const descriptor = getToolFromToolName(name);
    const validation = descriptor.toolMcpFlatInputSchema.safeParse(args ?? {});
    if (!validation.success) {
      return err(
        new McpParameterError(descriptor.describeToolArgs(), name, undefined, undefined, {
          code: 'PARAMETER_ERROR',
        }),
      );
    }

    const result = await executeStubTool(name);
    if (result.isError) {
      return err(
        new McpToolError(deriveErrorMessage(result), name, {
          code: 'STUB_EXECUTION_ERROR',
        }),
      );
    }
    const rawData = decodeStubPayload(result, name);
    const outputValidation = descriptor.validateOutput(rawData);
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** The machine-readable error codes (STUB\_DECODE\_ERROR, STUB\_EXECUTION\_ERROR, PARAMETER\_ERROR, OUTPUT\_VALIDATION\_ERROR) attached to the errors above, which a client can branch on.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### A001 — MCP served-surface allowlist

**What it says now:**

```text
user-search': 'dormant',
    'user-search-query': 'dormant'

'get-eef-evidence': 'dormant'

'docs://oak/getting-started.md': 'live'

'docs://oak/guidance/curriculum-mapping.md': 'dormant'
```

**What it is for:** Classify every MCP tool and resource as live or dormant at the app registration boundary.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A002 — Deferred upstream API paths

**What it says now:**

```text
export const DEFERRED_PATHS: readonly DeferredPathEntry[] = [
  { path: '/key-stages/{keyStage}/subject/{subject}/check-restricted', ticket: 'MCP-214' },
  { path: '/lessons/check-restricted', ticket: 'MCP-214' },
];
```

**What it is for:** Temporarily exclude the check-restricted API family from generated schemas and MCP tools until MCP-214 lifts the deferral.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

### A010 — Oak: Under the Hood baked orientation digest

**What it says now:**

```text
export const OAK_UNDER_THE_HOOD_ORIENTATION =
```

**What it is for:** Serve the repository orientation method inline from the deployed artefact (directory policy §2.F cure, MCP-353): the audience-independent digest of the canonical under-the-hood skill, generated out of band with a parity gate (validate-under-the-hood-content) so served instructions are reviewed with the deployment, never fetched at runtime.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/generated/oak-under-the-hood-content.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact

## Words owned elsewhere (4)

These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.

### C677 — MCP\_TOOL\_ENTRIES tool-name catalogue (29 kebab-case tool names)

**What it says now:**

```text
export const MCP_TOOL_ENTRIES = [
  { name: 'get-changelog', descriptor: getChangelog, operationId: 'changelog-changelog' },
  { name: 'get-changelog-latest', descriptor: getChangelogLatest, operationId: 'changelog-latest' },
  { name: 'get-key-stages', descriptor: getKeyStages, operationId: 'getKeyStages-getKeyStages' },
  { name: 'get-key-stages-subject-assets', descriptor: getKeyStagesSubjectAssets, operationId: 'getAssets-getSubjectAssets' },
  { name: 'get-key-stages-subject-lessons', descriptor: getKeyStagesSubjectLessons, operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons' },
  { name: 'get-key-stages-subject-questions', descriptor: getKeyStagesSubjectQuestions, operationId: 'getQuestions-getQuestionsForKeyStageAndSubject' },
  { name: 'get-key-stages-subject-units', descriptor: getKeyStagesSubjectUnits, operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits' },
  { name: 'get-keywords', descriptor: getKeywords, operationId: 'getKeywords-getKeywords' },
  { name: 'get-lessons-assets', descriptor: getLessonsAssets, operationId: 'getAssets-getLessonAssets' },
  { name: 'get-lessons-quiz', descriptor: getLessonsQuiz, operationId: 'getQuestions-getQuestionsForLessons' },
  { name: 'get-lessons-summary', descriptor: getLessonsSummary, operationId: 'getLessons-getLesson' },
  { name: 'get-lessons-transcript', descriptor: getLessonsTranscript, operationId: 'getLessonTranscript-getLessonTranscript' },
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** The set of tool identifiers surfaced to the MCP client's tools/list; the agent selects and invokes tools by these exact names, so the naming scheme shapes which tool an agent reaches for.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/definitions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C678 — operationId identifiers per tool (29)

**What it says now:**

```text
{ name: 'get-changelog', descriptor: getChangelog, operationId: 'changelog-changelog' },
  { name: 'get-changelog-latest', descriptor: getChangelogLatest, operationId: 'changelog-latest' },
  { name: 'get-key-stages', descriptor: getKeyStages, operationId: 'getKeyStages-getKeyStages' },
  { name: 'get-key-stages-subject-assets', descriptor: getKeyStagesSubjectAssets, operationId: 'getAssets-getSubjectAssets' },
  { name: 'get-key-stages-subject-lessons', descriptor: getKeyStagesSubjectLessons, operationId: 'getKeyStageSubjectLessons-getKeyStageSubjectLessons' },
  { name: 'get-key-stages-subject-questions', descriptor: getKeyStagesSubjectQuestions, operationId: 'getQuestions-getQuestionsForKeyStageAndSubject' },
  { name: 'get-key-stages-subject-units', descriptor: getKeyStagesSubjectUnits, operationId: 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits' },
  { name: 'get-keywords', descriptor: getKeywords, operationId: 'getKeywords-getKeywords' },
  { name: 'get-lessons-assets', descriptor: getLessonsAssets, operationId: 'getAssets-getLessonAssets' },
  { name: 'get-lessons-quiz', descriptor: getLessonsQuiz, operationId: 'getQuestions-getQuestionsForLessons' },
  { name: 'get-lessons-summary', descriptor: getLessonsSummary, operationId: 'getLessons-getLesson' },
  { name: 'get-lessons-transcript', descriptor: getLessonsTranscript, operationId: 'getLessonTranscript-getLessonTranscript' },
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** OpenAPI operation identifiers bound to each tool; they are forwarded verbatim into the UndocumentedResponseError message an agent receives, so they surface to agents in error text and identify the failing operation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/definitions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C681 — SCOPES\_SUPPORTED = ['email']

**What it says now:**

```text
export const SCOPES_SUPPORTED = ['email'] as const;
```

**What it is for:** The OAuth scope label advertised in the server's RFC 9728 Protected Resource Metadata; an MCP client reads scopes\_supported during auth discovery to know which scope to request, so it shapes the auth/consent handshake.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/scopes-supported.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C707 — oauth-authorization-server rewriteAuthServerMetadata

**What it says now:**

```text
app.get('/.well-known/oauth-protected-resource', servePrm);
```

**What it is for:** Serves the OAuth Authorization Server metadata at /.well-known/oauth-authorization-server — upstream Clerk metadata with endpoint URLs rewritten to this server's origin.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

## Retired (4)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C339 — Oak: Under the Hood resource annotations (priority 0.2, audience ['assistant'])

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
annotations: { priority: 0.2, audience: ['assistant'] }
```

**What it is for:** Low-salience hint: priority 0.2 and audience 'assistant' tell the client to deprioritise this resource and treat it as for assistants/integrators, not surface it prominently to end users.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C342 — logo alt text

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
alt="Oak National Academy logo"
```

**What it is for:** Attributes the page to Oak National Academy via the logo alt attribute, establishing brand identity and giving non-visual readers the source name.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** server-branding · **Impact tier:** simple-config

### C383 — resource\_link annotations {audience:['assistant'], priority:0.9}

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
annotations: { audience: ['assistant'], priority: 0.9 },
```

**What it is for:** Marks the canonical link as assistant-audience, high-priority, biasing clients to surface/act on it.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C413 — PUBLIC\_RESOURCE\_URIS / under-the-hood.md

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
const PUBLIC_RESOURCE_URIS = [...DOCUMENTATION_RESOURCES.map(r=>r.uri), WIDGET_URI, 'docs://oak/under-the-hood.md']
```

**What it is for:** Allowlist of resource URIs that skip auth; the app-local literal 'docs://oak/under-the-hood.md' is the client-visible identifier of the orientation-pointer resource served without authentication (also pulls SDK DOCUMENTATION\_RESOURCES + WIDGET\_URI).

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact
