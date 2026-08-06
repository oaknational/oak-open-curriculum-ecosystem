---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# response-format-template — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **response-format-template** items of that view, so it can be reviewed in one sitting.

**30 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 2 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (28)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C057 — generated-tool result summary template `${title}: ${status}`

**What it says now:**

```text
summary: `${title}: ${String(result.value.status)}`,
```

**What it is for:** Frames every generated (OpenAPI-derived) tool's result with a one-line human-readable summary of shape 'Tool Title: status' shown as content[0] and structuredContent.summary, telling the model/host at a glance which tool ran and whether it succeeded.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C085 — SCOPE\_LABELS

**What it says now:**

```text
const SCOPE_LABELS: Readonly<Record<SearchSdkScope, string>> = {
  lessons: 'lesson',
  units: 'unit',
  threads: 'learning thread',
  sequences: 'sequence',
  suggest: 'suggestion',
};
```

**What it is for:** Maps each scope to a human noun (lesson, unit, learning thread, sequence, suggestion) interpolated into result-count summaries.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C087 — buildSearchSummary (found copy)

**What it says now:**

```text
return `Found ${String(total)} ${plural} matching "${query}"`;
```

**What it is for:** Frames a successful scoped search result with a count and the query text.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C089 — buildSuggestSummary (found copy)

**What it says now:**

```text
return `Found ${String(count)} ${word} for "${prefix}"`;
```

**What it is for:** Frames a successful suggestion result with a count and the prefix.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C106 — buildTopicMapSummary (found branch + plural labels)

**What it says now:**

```text
if (totals.lessonTotal > 0) {
    const word = totals.lessonTotal === 1 ? 'lesson' : 'lessons';
    parts.push(`${String(totals.lessonTotal)} ${word}`);
  }

  if (totals.unitTotal > 0) {
    const word = totals.unitTotal === 1 ? 'unit' : 'units';
    parts.push(`${String(totals.unitTotal)} ${word}`);
  }

  if (totals.threadTotal > 0) {
    const word = totals.threadTotal === 1 ? 'learning thread' : 'learning threads';
    parts.push(`${String(totals.threadTotal)} ${word}`);
  }

  if (parts.length === 0) {
    return `No content found for "${topic}". Try different terms or check available subjects with browse-curriculum.`;
  }

  return `Found ${parts.join(', ')} about "${topic}"`;
}
```

**What it is for:** Frames the result set as 'Found N lessons, N units, N learning threads about "topic"', authoring the count labels and singular/plural wording that summarise exempt data.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C109 — formatTopicMap summary composition

**What it says now:**

```text
return formatToolResponse({
    summary: `${summary}. ${nextSteps}`,
```

**What it is for:** Concatenates summary and next-steps into the single human-readable summary line that frames the whole topic-map payload.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C144 — browse annotationsTitle

**What it says now:**

```text
annotationsTitle: 'Browse Curriculum',
```

**What it is for:** Titles the successful browse result block ('Browse Curriculum') for display in hosts/widgets.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C146 — buildBrowseSummary found case

**What it says now:**

```text
const filterText = filterParts.length > 0 ? ` for ${filterParts.join(' ')}` : '';
  const word = count === 1 ? 'programme' : 'programmes';

  if (count === 0) {
    return `No curriculum programmes found${filterText}. Try broader filters or no filters to see everything.`;
  }

  return `Found ${String(count)} curriculum ${word}${filterText}`;
```

**What it is for:** Frames a count of matching programmes with correct singular/plural ('programme'/'programmes') and an optional ' for <subject> <KS>' filter echo.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/formatting.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C157 — buildFetchSummary

**What it says now:**

```text
function buildFetchSummary(type: ContentType, slug: string, oakUrl: string | null): string {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);
  const urlPart = oakUrl ? ` (${oakUrl})` : '';
  return `Fetched ${typeName}: ${slug}${urlPart}`;
```

**What it is for:** Frames a successful fetch as 'Fetched <Type>: <slug>' with an optional trailing '(<oakUrl>)' — capitalises the content type and surfaces a canonical Oak URL when derivable.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C158 — fetch annotationsTitle

**What it says now:**

```text
annotationsTitle: 'Fetch Curriculum Resource',
```

**What it is for:** Titles the successful fetch result block ('Fetch Curriculum Resource') for host/widget display.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C167 — runDownloadAssetTool summary template

**What it says now:**

```text
summary: `Download link (valid for 5 minutes): ${url}`,
```

**What it is for:** Frames the returned download URL with a 'valid for 5 minutes' preface so the agent relays the expiry to the user.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C228 — summariseKeywords (populated)

**What it says now:**

```text
const total = String(subgraph.totalMatchingKeywords);
  return `Top ${shown} of ${total} keywords for ${subject} at ${keyStage}${narrowed ? ' (narrowed)' : ''}, ranked by in-scope lesson placements.`;
}
```

**What it is for:** Frames the returned data as a ranked top-N-of-total, signalling ranking basis and partiality.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C242 — withUnknownClause

**What it says now:**

```text
/** Appends the unknown-anchor clause to a summary line when any slug missed the corpus. */
function withUnknownClause(base: string, unknownAnchors: readonly string[]): string {
  if (unknownAnchors.length === 0) {
    return base;
  }
  return `${base} ${String(unknownAnchors.length)} unknown anchor slug${unknownAnchors.length === 1 ? '' : 's'} reported in unknownAnchors.`;
}
```

**What it is for:** Appends an honest unknown-anchor count so partial resolution is visible.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph-summaries.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C243 — summariseLessons

**What it says now:**

```text
export function summariseLessons(subgraph: LessonMisconceptionsSubgraph): string {
  const misconceptionCount = subgraph.lessons.reduce(
    (count, entry) => count + entry.misconceptions.length,
    0,
  );
  return withUnknownClause(
    `Misconceptions for ${String(subgraph.resolvedAnchors.length)} anchor lesson(s): ${String(misconceptionCount)} misconception(s).`,
    subgraph.unknownAnchors,
  );
}
```

**What it is for:** One-line, information-only framing of a lesson-anchored misconception count.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph-summaries.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C244 — summariseUnits

**What it says now:**

```text
export function summariseUnits(subgraph: UnitMisconceptionsSubgraph): string {
  const lessonCount = subgraph.units.reduce((count, entry) => count + entry.lessons.length, 0);
  return withUnknownClause(
    `Misconceptions for ${String(subgraph.resolvedAnchors.length)} anchor unit(s): ${String(lessonCount)} lesson(s) with their misconceptions.`,
    subgraph.unknownAnchors,
  );
}
```

**What it is for:** Information-only framing of a unit-anchored result.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph-summaries.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C245 — summariseThread

**What it says now:**

```text
export function summariseThread(subgraph: ThreadMisconceptionsSubgraph): string {
  const entry = subgraph.threads[0];
  if (entry === undefined) {
    return withUnknownClause('Misconceptions for thread anchor: no thread resolved.', [
      ...subgraph.unknownAnchors,
    ]);
  }
  if (entry.units.length === 0) {
    return `Misconceptions for thread window: no units in this window (offset ${String(entry.unitOffset)} of ${String(entry.totalUnits)} units).`;
  }
  const from = entry.unitOffset + 1;
  const to = entry.unitOffset + entry.units.length;
  return `Misconceptions for thread window: units ${String(from)}–${String(to)} of ${String(entry.totalUnits)}${entry.hasMore ? ' (more available via unitOffset)' : ''}.`;
}
```

**What it is for:** Frames a thread window as units X–Y of Z with a more-available hint, or an empty/no-thread case.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph-summaries.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C250 — summariseSubgraph

**What it says now:**

```text
function summariseSubgraph(subgraph: PriorKnowledgeSubgraph): string {
  const anchorCount = subgraph.resolvedAnchors.length;
  const base = `Prior-knowledge subgraph for ${String(anchorCount)} anchor unit${anchorCount === 1 ? '' : 's'} at depth ${String(subgraph.depth)}: ${String(subgraph.nodes.length)} units, ${String(subgraph.edges.length)} prerequisiteFor edges.`;
  if (subgraph.unknownAnchors.length === 0) {
    return base;
  }
  return `${base} ${String(subgraph.unknownAnchors.length)} unknown anchor slug${subgraph.unknownAnchors.length === 1 ? '' : 's'} reported in unknownAnchors.`;
}
```

**What it is for:** Information-only framing: node/edge counts at depth plus unknown-anchor honesty.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C258 — summariseProgression

**What it says now:**

```text
function summariseProgression(subgraph: ThreadProgressionSubgraph): string {
  if (subgraph.threads.length === 0) {
    const unknown = subgraph.unknownAnchors.join(', ');
    return `No thread matched the anchor (unknown: ${unknown}).`;
  }
  const progression = subgraph.threads[0];
  if (progression === undefined) {
    return 'No thread matched the anchor.';
  }
  const span =
    progression.thread.firstYear !== undefined && progression.thread.lastYear !== undefined
      ? ` spanning Year ${String(progression.thread.firstYear)}–${String(progression.thread.lastYear)}`
      : '';
  return `Thread "${progression.thread.title}": ${String(progression.totalUnits)} unit placements${span}, ordered by teaching year.`;
}
```

**What it is for:** Frames one thread's progression (title, unit count, year span, ordered-by-year) or a no-match case.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C259 — summariseDiscovery

**What it says now:**

```text
function summariseDiscovery(discovery: ThreadDiscovery): string {
  return `${String(discovery.threads.length)} thread(s) with ${discovery.subject} units at ${discovery.keyStage}. Anchor get-thread-progressions with a threadSlug for the ordered progression.`;
}
```

**What it is for:** Frames the discovery result and directs the agent to anchor a threadSlug next.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C312 — classifyUndocumentedResponse message templates

**What it says now:**

```text
const message = error.upstreamMessage
    ? `${prefix} (${statusStr}): ${error.upstreamMessage}`
    : `${prefix}: status ${statusStr}`;
```

**What it is for:** Two authored templates that wrap the classified prefix, HTTP status, and the raw upstream message into the surfaced error string, framing how undocumented upstream failures are presented to the agent.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C361 — resource list-item display template

**What it says now:**

```text
<span className="resource-title">{resource.title}</span>
```

**What it is for:** Frames each resource's SDK-sourced URI, title, and description into a list item; per the file's own TSDoc this lists the full static ALL\_MCP\_RESOURCES set including the flag-gated EEF entry even when its registration flag is off.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/resources-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-resources-section.ts`).
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C368 — tool list-item display template

**What it says now:**

```text
<details className="oak-disclosure tool-item">
```

**What it is for:** Frames each tool's SDK-sourced name and description into a collapsible item, applying the first-paragraph split to show a summary and hide the rest under 'How to use'; per file comment this affects human browsing only, not MCP tool behaviour.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C398 — sendInvalidResourceResponse

**What it says now:**

```text
export function sendInvalidResourceResponse(res: Response, prmUrl: string, reason: string): void {

error_description="${AUDIENCE_MISMATCH_DESCRIPTION}"
```

**What it is for:** Frames an RFC 8707 audience-mismatch rejection as invalid\_token with a reason interpolated into both the WWW-Authenticate error\_description and the JSON body message; tells the client the token was minted for the wrong resource.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, possible-defect-reported
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`).
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C404 — mapNonJsonErrorResponse

**What it says now:**

```text
function mapNonJsonErrorResponse(
  text: string,
  response: globalThis.Response,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
  contentType: string,
): ParsedUpstreamBody {
  log.warn('oauth-proxy.upstream.non-json-error', {
    ...context,
    upstreamStatus: response.status,
    contentType,
    sample: text.slice(0, 200),
  });
  const isThrottled = response.status === 429;
  const trimmed = text.trim();
  const description = sanitiseErrorDescription(
    trimmed === '' ? `Upstream returned ${response.status}` : trimmed,
  );
  const retryAfter = sanitiseRetryAfter(response.headers.get('retry-after'));
  return {
    status: isThrottled ? 429 : 502,
    body: formatProxyErrorResponse(
      isThrottled ? 'temporarily_unavailable' : 'server_error',
      description,
    ),
    headers: retryAfter !== undefined ? { 'Retry-After': retryAfter } : undefined,
  };
}
```

**What it is for:** Maps a non-JSON upstream error to an OAuth error: 429->temporarily\_unavailable (with sanitised/forwarded Retry-After) else 502->server\_error; error\_description is the sanitised upstream text or the authored fallback 'Upstream returned <status>'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C407 — formatProxyErrorResponse

**What it says now:**

```text
/**
 * Creates an OAuth 2.0 error response per RFC 6749 Section 5.2.
 *
 * @param error - The error code (e.g. `temporarily_unavailable`, `invalid_request`)
 * @param errorDescription - Human-readable description of the error
 * @returns Formatted error response object
 */
export function formatProxyErrorResponse(
  error: string,
  errorDescription: string,
): OAuthErrorResponse {
  return { error, error_description: errorDescription };
}
```

**What it is for:** The single response-format template that wraps every proxy error as an RFC 6749 §5.2 { error, error\_description } object, standardising what all proxy failures look like to the client.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C415 — renderSingleEndpoint: per-endpoint entry template

**What it says now:**

```text
function renderSingleEndpoint(lines: string[], op: unknown): void {
  const method = getOwnString(op, 'method') ?? '';
  const path = getOwnString(op, 'path') ?? '';
  lines.push(`### ${method.toUpperCase()} ${path}`);
  maybePush(lines, 'operationId', getOwnString(op, 'operationId'));
  maybePush(lines, 'summary', getOwnString(op, 'summary'));
  maybePush(lines, 'description', getOwnString(op, 'description'));
  lines.push('Parameters:', renderParamSummary(getOwnValue(op, 'parameters')), '');
```

**What it is for:** Frames each endpoint as '### METHOD path' with labelled 'operationId/summary/description' lines and a 'Parameters:' block, telling agents how to read each endpoint entry.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C417 — renderParamLine: parameter line template

**What it says now:**

```text
function renderParamLine(info: RenderableParamInfo): string {
  const enumText = typeof info.enumCount === 'number' ? ` enum:${String(info.enumCount)}` : '';
  const requiredText = info.required ? ' - required' : '';
  return `- ${info.loc} ${info.name} (${info.typeName}${enumText})${requiredText}`;
```

**What it is for:** Encodes each parameter as '- <in> <name> (<type> enum:N) - required', teaching the agent the location, type, enum cardinality and requiredness of every parameter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-ai-doc-catalog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C427 — add404ResponsesWhereExpected: injected 404 response description template

**What it says now:**

```text
const response: ResponseObject = {
      description: [
        'Temporary: Documented locally until the upstream schema captures this legitimate 404 response.',
        descriptor.reason,
        `Tracking: ${descriptor.upstreamReference}`,
      ].join('\n\n'),
      content: {
        'application/json': descriptor.media,
      },
    };

    operation.responses = { ...responses, '404': response };
```

**What it is for:** Authored template injected as the OpenAPI 404 ResponseObject.description — 'Temporary: Documented locally until the upstream schema captures this legitimate 404…', the descriptor.reason, and 'Tracking: <ref>' — documenting to agents/devs when a 404 is a legitimate response.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/schema-enhancement-404.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

## Retired (2)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C358 — prompt list-item display template

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
<li><code>${escapeHtml(prompt.name)}</code><span class="tool-desc">${escapeHtml(prompt.description)}</span>${argList}</li>
```

**What it is for:** Frames each prompt's SDK-sourced name and description into a list item, presenting the advertised prompt catalogue to the reader.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-prompts-section.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C359 — prompt arguments labels ('Arguments:', '(optional)')

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
Arguments: <code>${a.name}</code>${a.required ? '' : ' (optional)'}
```

**What it is for:** Labels the prompt argument list and annotates non-required args as '(optional)', telling the reader which inputs a prompt takes and whether they are mandatory.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-prompts-section.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact
