---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# empty-or-refusal-copy — part of the recovery-copy review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

What an agent receives when something fails or returns nothing — validation, empty-state, and degradation messages. This copy shapes whether an agent recovers or fabricates.

This page holds only the **empty-or-refusal-copy** items of that view, so it can be reviewed in one sitting.

**14 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the recovery-copy view](./recovery-copy.md) · [Back to the workspace index](../README.md)

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

### C086 — buildSearchSummary (zero-result copy)

**What it says now:**

```text
return `No ${plural} found for "${query}". Try broadening your search or using a different scope.`;
```

**What it is for:** Empty-result message that reports no matches and prompts the user/agent to broaden the search or change scope.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C088 — buildSuggestSummary (zero-result copy)

**What it says now:**

```text
return `No suggestions found for "${prefix}"`;
```

**What it is for:** Reports that no typeahead suggestions were found for the prefix.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C107 — buildTopicMapSummary (empty branch)

**What it says now:**

```text
if (parts.length === 0) {
    return `No content found for "${topic}". Try different terms or check available subjects with browse-curriculum.`;
  }
```

**What it is for:** On zero results, tells the user/agent no content was found and recommends trying different terms or browse-curriculum to see subjects.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C145 — buildBrowseSummary empty case

**What it says now:**

```text
if (count === 0) {
    return `No curriculum programmes found${filterText}. Try broader filters or no filters to see everything.`;
  }
```

**What it is for:** On zero results, tells the agent nothing matched the filters and prompts it to broaden filters or drop them to see everything.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C229 — summariseKeywords (empty)

**What it says now:**

```text
if (subgraph.keywords.length === 0) {
    return `No keywords matched ${subject} at ${keyStage}${narrowed ? ' with the given narrowing' : ''}.`;
```

**What it is for:** States a well-formed empty result rather than an error, discouraging spurious retries.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C319 — createStubSearchRetrieval empty-result payloads

**What it says now:**

```text
searchLessons: () =>
      Promise.resolve(ok({ scope: 'lessons', total: 0, took: 0, timedOut: false, results: [] })),
    searchUnits: () =>
      Promise.resolve(ok({ scope: 'units', total: 0, took: 0, timedOut: false, results: [] })),
    searchSequences: () =>
      Promise.resolve(ok({ scope: 'sequences', total: 0, took: 0, timedOut: false, results: [] })),
    searchThreads: () =>
      Promise.resolve(ok({ scope: 'threads', total: 0, took: 0, timedOut: false, results: [] })),
    suggest: () =>
      Promise.resolve(ok({ suggestions: [], cache: { version: '1', ttlSeconds: 300 } })),
    fetchSequenceFacets: () => Promise.resolve(ok({ sequences: [] })),
```

**What it is for:** In stub mode, returns well-formed empty search results (scope='lessons'/'units'/'sequences'/'threads', total 0, timedOut false, results []) so the agent sees a valid no-results answer rather than an error when search is stubbed.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-stub.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C336 — documentation resource fallback 'Content not found' template

**What it says now:**

```text
server.registerResource(name, uri, metadata, () => {
    const content = getDocumentationContent(uri);
    return {
      contents: [
        {
          uri,
          mimeType: resource.mimeType,
          text: content ?? `# ${resource.title}\n\nContent not found.`,
        },
      ],
    };
  });
```

**What it is for:** Degradation/fallback body returned as the resource text when getDocumentationContent(uri) yields nothing, so the client receives a titled 'Content not found' stub instead of empty text.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/resource-registrations.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`).
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C416 — renderParamSummary: '\_No parameters\_' empty copy

**What it says now:**

```text
function renderParamSummary(params: unknown): string {
  if (!isArrayOfObjects(params) || params.length === 0) {
    return '_No parameters_';
```

**What it is for:** Signals to an agent that an endpoint takes no parameters, so it does not hallucinate query/path inputs.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C420 — listParamObjectKeys: '\_None\_' empty copy

**What it says now:**

```text
function listParamObjectKeys(value: unknown): string {
  if (!isPlainObject(value)) {
    return '_None_';
  }

  const keys = Object.keys(value);
  return keys.length === 0 ? '_None_' : keys.join(', ');
```

**What it is for:** Tells an agent a tool has no path/query params of the given kind so it supplies none.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C697 — 403 signature-rejection reason (result.reason)

**What it says now:**

```text
if (!result.valid) {
      deps.logger.warn('asset-download.signature.invalid', {
        lesson: validated.lesson,
        type: validated.type,
        reason: result.reason,
      });
      res.status(403).json({ error: result.reason });
      return;
```

**What it is for:** 403 refusal whose body is the HMAC-validation reason — surfaced here but the actual strings ('Download link has expired' / 'Invalid signature') are authored in the SDK validateDownloadSignature.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C702 — hostValidationErrorMessage missing\_host

**What it says now:**

```text
switch (error.type) {
    case 'missing_host':
      return 'Cannot generate OAuth metadata: missing host header';
```

**What it is for:** 403 refusal error\_description when the Host header is absent on an OAuth metadata request.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/host-validation-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C703 — hostValidationErrorMessage invalid\_format

**What it says now:**

```text
case 'invalid_format':
      return `Rejected Host header '${error.host}': invalid host header format`;
    case 'not_allowed':
```

**What it is for:** 403 refusal when the Host header fails format validation; reflects the offending host value back in the message.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** pii-adjacent
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/host-validation-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C704 — hostValidationErrorMessage not\_allowed

**What it says now:**

```text
case 'not_allowed':
      return `Rejected Host header '${error.hostname}': not in allowed hosts list`;
```

**What it is for:** 403 refusal when the hostname is well-formed but not in the allowed-hosts list; reflects the hostname back.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/host-validation-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact

### C705 — servePrm 403 { error:'forbidden', error\_description }

**What it says now:**

```text
const servePrm: RequestHandler = (req, res) => {
```

**What it is for:** OAuth-error-shaped 403 returned from the PRM (and AS-metadata) endpoint when host validation fails; the 'forbidden' code is authored, error\_description reuses hostValidationErrorMessage.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** empty-or-refusal-copy · **Impact tier:** high-impact
