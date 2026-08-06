---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# error-message — part of the recovery-copy review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

What an agent receives when something fails or returns nothing — validation, empty-state, and degradation messages. This copy shapes whether an agent recovers or fabricates.

This page holds only the **error-message** items of that view, so it can be reviewed in one sitting.

**126 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the recovery-copy view](./recovery-copy.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (126)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C059 — formatUnknownTool string-name copy `Unknown tool: <name>`

**What it says now:**

```text
export function formatUnknownTool(value: unknown): CallToolResult {
  if (typeof value === 'string') {
    return formatError(`Unknown tool: ${value}`);
  }
```

**What it is for:** Returned when an agent calls a tool name that is neither an aggregated nor a generated tool; echoes the offending name back so the agent can correct its call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C060 — formatUnknownTool non-string fallback `Unknown tool`

**What it says now:**

```text
return formatError('Unknown tool');
```

**What it is for:** Fallback refusal copy when the unknown tool identifier is not even a string; avoids interpolating a non-string into the message while still signalling the tool is unknown.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C061 — toErrorMessage 'Unknown error' fallbacks (2 occurrences grouped)

**What it says now:**

```text
return value.message.length > 0 ? value.message : 'Unknown error';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return 'Unknown error';
```

**What it is for:** Normalises arbitrary thrown error values into a message string for the error CallToolResult; supplies 'Unknown error' when an Error has an empty message or the thrown value is an unhandled type, so the agent always receives some error text.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C063 — requireGeneratedToolMetadata missing-metadata fail-fast error

**What it says now:**

```text
if (!title || !description) {
    throw new Error(
      `Generated tool "${toolName}" missing required metadata: ` +
        `title=${String(title)}, description=${String(description)}. ` +
        'Fix the generator template or OpenAPI spec.',
    );
  }
```

**What it is for:** Thrown during listing/execution when a generated tool descriptor lacks title or description; developer-directed fail-fast ('Fix the generator template or OpenAPI spec') that surfaces the tool name and the missing values. Could reach an agent if uncaught during execution.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/descriptor-utils.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C064 — requireGeneratedToolInputShape missing-flat-schema fail-fast error

**What it says now:**

```text
if (!inputSchema) {
    throw new Error(
      `Generated tool "${toolName}" missing required flat input schema: ` +
        'toolMcpFlatInputSchema must be a ZodObject. ' +
        'Fix the generator output or test registry.',
    );
  }
```

**What it is for:** Thrown when a generated tool's toolMcpFlatInputSchema is not a ZodObject; developer-directed fail-fast ('Fix the generator output or test registry') preventing a parameterised tool from being mis-advertised as parameterless.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/descriptor-utils.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C091 — formatRetrievalError (error-message family)

**What it says now:**

```text
/** Formats a SearchRetrievalError into a human-readable error message. */
function formatRetrievalError(error: SearchRetrievalError): string {
  if (error.type === 'es_error') {
    const suffix = error.statusCode !== undefined ? ` (status ${String(error.statusCode)})` : '';
    return `Elasticsearch error: ${error.message}${suffix}`;
  }
  if (error.type === 'timeout') {
    return `Search timed out: ${error.message}`;
  }
  if (error.type === 'validation_error') {
    return `Invalid search parameters: ${error.message}`;
  }
  return `Unexpected search error: ${error.message}`;
}
```

**What it is for:** Frames retrieval failures into four distinct agent-facing messages by error type: 'Elasticsearch error: … (status N)', 'Search timed out: …', 'Invalid search parameters: …', 'Unexpected search error: …'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C092 — dispatchByScope exhaustiveness throw

**What it says now:**

```text
throw new Error(`Unhandled search scope: ${String(exhaustive)}`);
```

**What it is for:** Internal exhaustiveness guard error thrown if an unhandled scope reaches dispatch (unreachable on validated input).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C093 — SearchSdkObjectSchema.scope error

**What it says now:**

```text
scope: z.string({ error: 'scope is required' }),
```

**What it is for:** Tells the agent the scope field is required when missing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C094 — SearchSdkObjectSchema.refine (query/threads) message

**What it says now:**

```text
.refine(
    (data) => {
      if (data.query.length > 0) {
        return true;
      }
      return (
        data.scope === 'threads' && (data.subject !== undefined || data.keyStage !== undefined)
      );
    },
    {
      message:
        'search requires a non-empty query (threads scope can omit query when subject or keyStage filter is provided)',
      path: ['query'],
    },
  );
```

**What it is for:** Explains the non-empty-query requirement and the threads-scope exception (can omit query when subject or keyStage filter is provided), teaching the agent how to recover.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C095 — normaliseKeyStage error

**What it says now:**

```text
return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
```

**What it is for:** Enumerates valid key stages (ks1-ks4) when an invalid keyStage is supplied.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C096 — normaliseSubject error

**What it says now:**

```text
return { ok: false, message: 'subject must be a recognised subject slug' };
```

**What it is for:** Tells the agent the subject must be a recognised subject slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C097 — narrowEnums scope error

**What it says now:**

```text
return { ok: false, message: `scope must be one of: ${SEARCH_SCOPES.join(', ')}` };
```

**What it is for:** Lists the allowed scope values (joined from SEARCH\_SCOPES) when an unrecognised scope is supplied.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C098 — validateSearchSdkArgs non-object error

**What it says now:**

```text
return { ok: false, message: 'search expects an object input with query and scope fields' };
```

**What it is for:** Tells the agent the tool expects an object input with query and scope fields when given a non-object.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C099 — validateSearchSdkArgs fallback error

**What it says now:**

```text
return { ok: false, message: firstIssue?.message ?? 'Invalid search input' };
```

**What it is for:** Generic fallback message when a Zod issue has no message; low information but surfaced to the agent.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C111 — searchScope error templates (Lessons/Units/Threads)

**What it says now:**

```text
error: `${scopeName} search failed: ${result.error?.message ?? 'unknown error'}`,
    };
  } catch (thrown: unknown) {
    const message = thrown instanceof Error ? thrown.message : 'unknown error';
    return { ok: false, error: `${scopeName} search error: ${message}` };
```

**What it is for:** Reports a single scope's failure ('<Scope> search failed/error: <message>') so the agent knows which scope degraded while others still returned (partial-success path).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C112 — runExploreTool all-failed error

**What it says now:**

```text
if (allFailed) {
    const errors = [outcomes.lessons.error, outcomes.units.error, outcomes.threads.error]
      .filter((e): e is string => e !== undefined)
      .join('; ');
    return formatError(`All searches failed: ${errors}`);
```

**What it is for:** When every scope fails, returns a combined 'All searches failed: <errors>' error so the agent surfaces a total failure rather than an empty success.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C113 — explore query-required error

**What it says now:**

```text
.trim()
      .min(1, { message: 'explore-topic requires a non-empty query' }),
    subject: z.string().optional(),
```

**What it is for:** Rejects missing/empty query with 'explore-topic requires a non-empty query' so the agent re-issues with a query (message appears twice: type error + min-length).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C114 — explore keyStage narrow error

**What it says now:**

```text
return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
```

**What it is for:** Rejects an unrecognised keyStage and enumerates the accepted values ks1-ks4 to steer correction.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C115 — explore subject narrow error

**What it says now:**

```text
return { ok: false, message: 'subject must be a recognised subject slug' };
```

**What it is for:** Rejects an unrecognised subject slug so the agent corrects to a valid subject.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C116 — explore non-object input error

**What it says now:**

```text
return { ok: false, message: 'explore-topic expects an object input with a query field' };
```

**What it is for:** Rejects non-object input, telling the agent explore-topic expects an object with a query field.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C117 — explore invalid-input fallback

**What it says now:**

```text
return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid explore input' };
```

**What it is for:** Fallback message 'Invalid explore input' when no specific Zod issue message is available.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C130 — user-search query-required error

**What it says now:**

```text
scope: z.string({ error: 'scope is required' }),
```

**What it is for:** Rejects a missing query with 'query is required' so the agent/app supplies it.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C131 — user-search scope-required error

**What it says now:**

```text
subject: z.string().optional(),
```

**What it is for:** Rejects a missing scope with 'scope is required'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C132 — user-search keyStage error (duplicate of explore)

**What it says now:**

```text
return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
```

**What it is for:** Rejects unrecognised keyStage, enumerating ks1-ks4.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C133 — user-search subject error (duplicate of explore)

**What it says now:**

```text
return { ok: false, message: 'subject must be a recognised subject slug' };
```

**What it is for:** Rejects unrecognised subject slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C134 — user-search scope-enum error

**What it says now:**

```text
return { ok: false, message: `scope must be one of: ${USER_SEARCH_SCOPES.join(', ')}` };
```

**What it is for:** Rejects an invalid scope and interpolates the allowed list (lessons, units, threads, sequences) so the agent corrects it.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C135 — user-search non-object input error

**What it says now:**

```text
return { ok: false, message: 'user-search expects an object input with query and scope' };
```

**What it is for:** Rejects non-object input, stating user-search expects an object with query and scope.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C136 — user-search invalid-input fallback

**What it says now:**

```text
return { ok: false, message: firstIssue?.message ?? 'Invalid user search input' };
```

**What it is for:** Fallback 'Invalid user search input' when no specific Zod issue message exists.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C142 — browse error template

**What it says now:**

```text
return formatError(`Browse error: ${result.error.message} (${result.error.type})`);
```

**What it is for:** Frames a retrieval failure as 'Browse error:' with the underlying message and type so the agent understands the call failed and why.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C143 — unexpected-shape error

**What it says now:**

```text
return formatError('Unexpected response shape from fetchSequenceFacets');
```

**What it is for:** Signals a contract/shape violation from the search service so the agent does not treat the response as valid facets.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C147 — keyStage validation error

**What it says now:**

```text
return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
```

**What it is for:** Rejects an invalid keyStage and enumerates the allowed values (ks1-ks4) so the agent can correct the argument.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C148 — subject validation error

**What it says now:**

```text
return { ok: false, message: 'subject must be a recognised subject slug' };
```

**What it is for:** Rejects an unrecognised subject slug and tells the agent a valid subject slug is required.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C149 — browse input-type error

**What it says now:**

```text
return { ok: false, message: 'browse-curriculum expects an object input or no arguments' };
```

**What it is for:** Tells the agent browse-curriculum accepts an object or no arguments when a non-object primitive is passed.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C150 — browse invalid-input fallback

**What it says now:**

```text
return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid browse input' };
```

**What it is for:** Fallback error when Zod parse fails without a first-issue message (e.g. unknown key under .strict()).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/validation.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C154 — fetch id-required validation message

**What it says now:**

```text
.min(1, { message: 'fetch requires an "id" string' })
  .transform<FetchArgs>((id) => ({ id }));

const FetchObjectSchema = z
  .object({
    id: z
      .string({ error: 'fetch requires an "id" string' })
      .trim()
      .min(1, { message: 'fetch requires an "id" string' }),
```

**What it is for:** Tells the agent an 'id' string is required when it is missing/blank in either string or object form.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C155 — fetch input-type error

**What it says now:**

```text
return { ok: false, message: 'fetch expects a string or object input' };
```

**What it is for:** Tells the agent fetch accepts a string or object input when given neither.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C156 — unsupported-id-prefix error

**What it says now:**

```text
return formatError(`Unsupported id prefix in ${args.id}`);
```

**What it is for:** Rejects an id whose prefix is not one of the recognised types (lesson/unit/subject/sequence/thread), echoing the offending id.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C159 — unsupported-content-type error

**What it says now:**

```text
return err(new McpParameterError('fetch', `Unsupported content type: ${String(type)}`));
```

**What it is for:** Defensive fallback in executeFetchByType signalling an unhandled content type, echoing the type value.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C168 — validateDownloadAssetArgs invalid-field error

**What it says now:**

```text
return {
      ok: false,
      message: `Invalid "${String(field)}": ${firstIssue?.message ?? 'validation failed'}`,
    };
```

**What it is for:** Reports which field failed strict validation and the zod reason, so the agent can correct its arguments and retry.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C169 — validateDownloadAssetArgs invalid-type error

**What it says now:**

```text
return {
      ok: false,
      message: `Missing or invalid "type" — expected one of: ${ASSET_TYPES.join(', ')}`,
    };
```

**What it is for:** Tells the agent the asset 'type' is missing/invalid and enumerates the accepted values so it can pick a valid one.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C170 — validateDownloadSignature expired reason

**What it says now:**

```text
return { valid: false, reason: 'Download link has expired' };
```

**What it is for:** Explains to the user (on the download-proxy HTTP response) that a clicked link is past its 5-minute TTL, implying they should request a fresh link.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/download-token.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C171 — validateDownloadSignature invalid-signature reason (x2)

**What it says now:**

```text
return { valid: false, reason: 'Invalid signature' };
  }

  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Invalid signature' };
  }
```

**What it is for:** Signals a tampered/mismatched download signature without leaking why, so the user knows the link is not usable.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** possible-defect-reported
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/download-token.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C230 — runKeywordGraphTool errors

**What it says now:**

```text
return formatError(`Invalid get-keyword-graph input: ${parsed.error.message}`);

return formatError(
      `Invalid get-keyword-graph limit: ${String(result.error.limit)} (must be an integer in [1, ${String(result.error.maxLimit)}])`,
    );
```

**What it is for:** Tells agent why input/limit was rejected so it can correct the call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C240 — MISCONCEPTION\_INPUT\_VALIDATED superRefine messages

**What it says now:**

```text
if (anchorModes !== 1) {
    ctx.addIssue({
      code: 'custom',
      message: `exactly one anchor mode is required (lessonSlugs, unitSlugs, or threadSlug); received ${String(anchorModes)}`,
    });
  }
  if ((input.unitOffset !== undefined || input.unitLimit !== undefined) && !input.threadSlug) {
    ctx.addIssue({
      code: 'custom',
      message: 'unitOffset/unitLimit apply to the thread anchor only',
    });
  }
```

**What it is for:** Rejects zero/multiple anchors and mis-scoped window params so the agent corrects the call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C241 — runMisconceptionGraphTool errors

**What it says now:**

```text
return {
        errorText: `get-misconception-graph failed: ${result.error.kind} — window offset ${String(result.error.unitOffset)}, limit ${String(result.error.unitLimit)} (maximum ${String(result.error.maxUnitLimit)}).`,
      };
    }
    return {
      summary: summariseThread(result.value),
      data: { anchorKind: 'thread', ...result.value },
    };
  }
  // Unreachable: the parse-time exactly-one-anchor rule guarantees a branch above.
  return { errorText: 'get-misconception-graph failed: no anchor resolved after validation.' };

return formatError(`Invalid get-misconception-graph input: ${parsed.error.message}`);
```

**What it is for:** Reports window-drift failure, an unreachable no-anchor guard, and input parse failure.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C251 — runPriorKnowledgeGraphTool errors

**What it says now:**

```text
return formatError(`Invalid get-prior-knowledge-graph input: ${parsed.error.message}`);

return formatError(
      error.kind === 'SubgraphDepthExceeded'
        ? `get-prior-knowledge-graph failed: ${error.kind} — requested depth ${String(error.depth)} exceeds the view limit ${String(error.limit)}.`
        : `get-prior-knowledge-graph failed: ${error.kind}.`,
    );
```

**What it is for:** Reports invalid input and a defensive depth-exceeded/kind failure so the agent corrects.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C257 — THREAD\_PROGRESSIONS\_INPUT\_VALIDATED superRefine messages

**What it says now:**

```text
if (detail && discoveryFields > 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'exactly one anchor mode is required: threadSlug, OR subject + keyStage',
    });
  }
  if (!detail && discoveryFields !== 2) {
    ctx.addIssue({
      code: 'custom',
      message:
        'exactly one anchor mode is required: threadSlug, OR subject + keyStage (both together)',
    });
  }
```

**What it is for:** Enforces threadSlug XOR (subject AND keyStage) at parse time.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C260 — runThreadProgressionsTool errors / invariant breach

**What it says now:**

```text
throw new Error(
      'get-thread-progressions invariant breach: discovery anchor missing subject or keyStage after validated parse',
    );

return formatError(`Invalid get-thread-progressions input: ${parsed.error.message}`);
```

**What it is for:** Reports invalid input; a thrown invariant-breach Error fails loud if the parse guarantee ever drifts (may surface to the caller as a tool error).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C306 — UPSTREAM\_MESSAGE\_PREFIX.CONTENT\_NOT\_AVAILABLE

**What it says now:**

```text
CONTENT_NOT_AVAILABLE:
    'Resource unavailable due to copyright restrictions. The original may be viewed at www.thenational.academy',
```

**What it is for:** Tells the agent/user that a lesson is withheld for copyright reasons and directs them to the canonical Oak site to view the original; doubles as refusal copy and source attribution.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C307 — UPSTREAM\_MESSAGE\_PREFIX.UPSTREAM\_SERVER\_ERROR

**What it says now:**

```text
UPSTREAM_SERVER_ERROR: 'Upstream server error',
```

**What it is for:** Frames 5xx upstream failures as a server-side ('Upstream server error') problem so the agent treats it as transient/retryable rather than a bad request.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C308 — UPSTREAM\_MESSAGE\_PREFIX.UPSTREAM\_API\_ERROR

**What it says now:**

```text
UPSTREAM_API_ERROR: 'Upstream API error',
```

**What it is for:** Generic catch-all prefix ('Upstream API error') for unclassified 4xx upstream errors, signalling a client/request-level failure that is not one of the specific classified cases.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C309 — classifyDocumentedErrorResponse 401 fallback message

**What it says now:**

```text
return new McpToolError(message ?? 'Authentication required', toolName, {
```

**What it is for:** Default message ('Authentication required') for a 401 when the upstream body has no message; tells the agent/user the request needs auth credentials.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C310 — classifyDocumentedErrorResponse 404 fallback message

**What it says now:**

```text
return new McpToolError(message ?? 'Resource not found', toolName, {
```

**What it is for:** Default message ('Resource not found') for a 404 with no upstream body message; tells the agent the requested slug/id does not exist so it should not retry blindly.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C311 — classifyDocumentedErrorResponse other-4xx template

**What it says now:**

```text
return new McpToolError(message ?? `Upstream API error (${String(httpStatus)})`, toolName, {
```

**What it is for:** Fallback template for unclassified 4xx that embeds the numeric HTTP status ('Upstream API error (<status>)') so the agent can see which status was returned.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C313 — DocumentedErrorCode / UpstreamErrorCode vocabulary

**What it says now:**

```text
type DocumentedErrorCode =
  'RESOURCE_NOT_FOUND' | 'AUTHENTICATION_REQUIRED' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR'

type UpstreamErrorCode = 'UPSTREAM_SERVER_ERROR' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR'
```

**What it is for:** Machine-readable error-code vocabulary (RESOURCE\_NOT\_FOUND, AUTHENTICATION\_REQUIRED, CONTENT\_NOT\_AVAILABLE, UPSTREAM\_API\_ERROR, UPSTREAM\_SERVER\_ERROR) attached to McpToolError.code that downstream code/agents branch on for handling and presentation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C314 — McpToolError/McpParameterError names + PARAMETER\_ERROR default code

**What it says now:**

```text
export class McpToolError extends Error {
  readonly toolName: string;
  readonly code?: string;

  constructor(message: string, toolName: string, options?: { cause?: Error; code?: string }) {
    super(message, options);
    this.name = 'McpToolError';
    this.toolName = toolName;
    this.code = options?.code;
  }
}

/**
 * Error thrown when MCP tool parameters are invalid.
 *
 * Carries optional path/query parameter names to help identify which
 * specific parameter caused the validation failure.
 */
export class McpParameterError extends Error {
  readonly toolName: string;
  readonly code: string;
  readonly pathParameterName?: string;
  readonly queryParameterName?: string;

  constructor(
    message: string,
    toolName: string,
    pathParameterName?: string,
    queryParameterName?: string,
    options?: { cause?: Error; code?: string },
  ) {
    super(message, options);
    this.name = 'McpParameterError';
    this.toolName = toolName;
    this.pathParameterName = pathParameterName;
    this.queryParameterName = queryParameterName;
    this.code = options?.code ?? 'PARAMETER_ERROR';
  }
```

**What it is for:** Sets serialized error names ('McpToolError', 'McpParameterError') and the default code ('PARAMETER\_ERROR') that identify the error class/kind an agent sees when a tool call fails.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/error-types.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C315 — generic Error 'Execution failed' template + EXECUTION\_ERROR

**What it says now:**

```text
new McpToolError(`Execution failed: ${error.message}`, toolName, {
```

**What it is for:** Wraps any non-classified Error into 'Execution failed: <message>' with code EXECUTION\_ERROR, telling the agent the tool run failed for an internal reason (identical template also used at line 116 for the documented-error fallback).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C316 — unknown-error 'Execution failed: UNKNOWN ERROR' template

**What it says now:**

```text
new McpToolError(`Execution failed: UNKNOWN ERROR: ${String(error)}`, toolName, {
```

**What it is for:** Handles thrown non-Error values, surfacing 'Execution failed: UNKNOWN ERROR: <stringified>' with EXECUTION\_ERROR so the agent still receives a structured failure rather than a crash.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C317 — output-validation-error message + OUTPUT\_VALIDATION\_ERROR

**What it says now:**

```text
if (error.message.startsWith('Output validation error: ')) {
    const message = error.message.replace('Output validation error: ', '');
    return err(
      new McpToolError('Execution failed: ' + message, toolName, {
        code: 'OUTPUT_VALIDATION_ERROR',
        cause: error,
      }),
    );
  }
```

**What it is for:** Detects the generated 'Output validation error: ' prefix, strips it, and re-frames as 'Execution failed: <message>' with code OUTPUT\_VALIDATION\_ERROR, telling the agent the upstream response failed schema validation (server-side, not agent's parameters).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C318 — unknown-tool message + UNKNOWN\_TOOL

**What it says now:**

```text
if (!isToolName(maybeToolName)) {
    return err(
      new McpToolError(`Unknown tool: ${String(maybeToolName)}`, String(maybeToolName), {
        code: 'UNKNOWN_TOOL',
      }),
    );
```

**What it is for:** Rejects an unrecognised tool name with 'Unknown tool: <name>' and code UNKNOWN\_TOOL, telling the agent the requested tool does not exist so it should consult the tool catalog.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C321 — SearchRetrievalError discriminant vocabulary

**What it says now:**

```text
export type SearchRetrievalError =
  | { readonly type: 'es_error'; readonly message: string; readonly statusCode?: number }
  | { readonly type: 'timeout'; readonly message: string }
  | { readonly type: 'validation_error'; readonly message: string }
  | { readonly type: 'unknown'; readonly message: string };
```

**What it is for:** Defines the authored error-kind vocabulary (es\_error, timeout, validation\_error, unknown) that search failures are classified into and that consumers surface for agent-side branching.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-types.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C386 — openLink failure fallback message

**What it says now:**

```text
errorMessage:
        openLinkError instanceof Error ? openLinkError.message : 'Host link opening failed',
    });
```

**What it is for:** Fallback error text dispatched to runtime-error state when host link opening fails and no Error.message is available.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C387 — styling sync failure fallback message

**What it says now:**

```text
* Connected MCP App component.
 *
 * @remarks
 * Initialises the MCP Apps React runtime via {@link useApp}, registers
```

**What it is for:** Fallback error text dispatched when host-context styling synchronisation throws, isolating the failure from the render cycle.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C388 — root-element-missing mount error

**What it says now:**

```text
if (!rootElement) {
  throw new Error('Root element #root not found — MCP App cannot mount');
```

**What it is for:** Thrown error explaining the widget cannot mount because the #root element is absent.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/main.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C389 — safe-dispatch failure fallback template

**What it says now:**

```text
errorMessage:
            error instanceof Error ? error.message : `Dispatch failed for action "${action.type}"`,
        });
      }
```

**What it is for:** Fallback error text when a reducer dispatch throws and no Error.message exists; interpolates the repo-defined action.type into the message before re-dispatching as runtime-error.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/app-runtime-state.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C399 — unknown-validation-error-fallback

**What it says now:**

```text
sendInvalidResourceResponse(res, prmUrl, validation.reason ?? 'Unknown validation error');
```

**What it is for:** Default text substituted into the invalid-resource response when the validator supplies no reason, ensuring the client always gets a non-empty error\_description.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C400 — handleAuthError-forbidden

**What it says now:**

```text
res.status(403).json({ error: 'Forbidden' });
```

**What it is for:** Returns a generic 403 { error: 'Forbidden' } when the Host header is invalid/disallowed, deliberately withholding the internal host-validation detail from the client.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`).
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C402 — readUpstreamBody-body-read-error

**What it says now:**

```text
if (readResult === undefined) {
    return {
      status: 502,
      body: formatProxyErrorResponse('server_error', 'Could not read upstream response body'),
    };
```

**What it is for:** Maps an unreadable upstream body to a 502 server\_error telling the client the proxy could not read the upstream response.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C403 — parseJsonBody-malformed-json

**What it says now:**

```text
log.warn('oauth-proxy.upstream.malformed-json', {
      ...context,
      upstreamStatus: status,
      sample: text.slice(0, 200),
    });
    return {
      status: 502,
      body: formatProxyErrorResponse('server_error', 'Upstream returned malformed JSON'),
    };
  }
```

**What it is for:** When an upstream JSON content-type body fails to parse, returns 502 server\_error telling the client the upstream returned malformed JSON (instead of throwing SyntaxError).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C405 — mapNonJsonSuccessAsError

**What it says now:**

```text
function mapNonJsonSuccessAsError(
  text: string,
  status: number,
  log: UpstreamBodyLogger,
  context: UpstreamBodyContext,
  contentType: string,
): ParsedUpstreamBody {
  log.warn('oauth-proxy.upstream.unexpected-content-type', {
    ...context,
    upstreamStatus: status,
    contentType,
    sample: text.slice(0, 200),
  });
  return {
    status: 502,
    body: formatProxyErrorResponse('server_error', 'Upstream returned non-JSON success body'),
  };
```

**What it is for:** Treats a non-JSON but 2xx upstream response as a failure, returning 502 server\_error telling the client the upstream returned a non-JSON success body.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C406 — asyncRoute-internal-proxy-error

**What it says now:**

```text
if (!res.headersSent) {
          res.status(500).json(formatProxyErrorResponse('server_error', 'Internal proxy error'));
        }
```

**What it is for:** Last-resort 500 for unhandled proxy errors when headers not yet sent; returns generic 'Internal proxy error' in the OAuth error shape.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C424 — readProject: 'TypeDoc JSON not found' error with remediation command

**What it says now:**

```text
} catch {
    throw new Error(
      'TypeDoc JSON not found at ' +
        jsonPath +
        '. Run: pnpm -F @oaknational/curriculum-sdk docs:api:json:ai',
    );
  }
```

**What it is for:** Build-time failure telling the operator the TypeDoc JSON is missing and to run 'pnpm -F @oaknational/curriculum-sdk docs:api:json:ai' to produce it.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C425 — readProject: 'Failed to parse TypeDoc JSON' error

**What it says now:**

```text
let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error('Failed to parse TypeDoc JSON');
  }
```

**What it is for:** Build-time failure signalling the TypeDoc JSON is not valid JSON.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C426 — formatZodIssues + 'TypeDoc JSON validation failed' error

**What it says now:**

```text
function formatZodIssues(issues: ZodIssueType[]): string {
  return issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

try {
    return parseTDProject(json);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      throw new Error('TypeDoc JSON validation failed:\n' + formatZodIssues(err.issues), {
        cause: err,
      });
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
```

**What it is for:** Build-time failure listing each Zod validation issue as '- <path>: <message>' under a 'TypeDoc JSON validation failed:' heading, guiding the developer to the offending fields.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C428 — add404ResponsesWhereExpected: 'schema is missing paths object' error

**What it says now:**

```text
if (!hasPaths(schema)) {
    throw new Error('OpenAPI schema is missing paths object; cannot decorate responses.');
  }
  const decorated = structuredClone(schema);
  if (!hasPaths(decorated)) {
    throw new Error('OpenAPI schema is missing paths object; cannot decorate responses.');
  }
```

**What it is for:** Build-time guard failure when the OpenAPI schema lacks a paths object, so decoration cannot proceed.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/schema-enhancement-404.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C429 — add404 / readOperation: 'Configured legitimate 404 endpoint … not found / no operation' errors

**What it says now:**

```text
for (const descriptor of overrides) {
    if (!Object.hasOwn(decorated.paths, descriptor.path)) {
      throw new Error(
        `Configured legitimate 404 endpoint ${descriptor.method.toUpperCase()} ${descriptor.path} was not found in the schema.`,
      );
    }
    if (!Object.hasOwn(schema.paths, descriptor.path)) {
      throw new Error(
        `Configured legitimate 404 endpoint ${descriptor.method.toUpperCase()} ${descriptor.path} was not found in the schema.`,
      );

function readOperation(
  pathItem: PathItemObject,
  descriptor: Legitimate404Descriptor,
): OperationObject {
  const candidate = pathItem[descriptor.method];
  if (!candidate) {
    throw new Error(
      `Configured legitimate 404 endpoint ${descriptor.method.toUpperCase()} ${descriptor.path} has no operation in the schema.`,
    );
  }
```

**What it is for:** Fail-fast build errors naming the configured METHOD+path that is absent from the schema ('was not found in the schema') or lacks an operation ('has no operation in the schema'), guiding the developer to prune stale 404 config.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, possible-defect-reported
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/schema-enhancement-404.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C452 — RetrievalError discriminant tags ('timeout' / 'es\_error') + message passthrough

**What it says now:**

```text
export function toRetrievalError(error: unknown): RetrievalError {
  const message = error instanceof Error ? error.message : String(error);
  if (isTimeoutError(error)) {
    return { type: 'timeout', message };
  }
  const statusCode = extractStatusCode(error);
  return { type: 'es_error', message, statusCode };
}
```

**What it is for:** Classifies retrieval failures into a typed union so callers/agents can distinguish retryable timeouts from permanent ES errors and carry a statusCode.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-search-sdk/src/retrieval/retrieval-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C467 — toolArgsDescription / describeToolArgs template

**What it says now:**

```text
function buildRequiredList(schema: JsonSchemaObject): string {
  if (!schema.required || schema.required.length === 0) {
    return '(none)';
  }
  return schema.required.join(', ');
}

function escapeForSingleQuotedJsString(text: string): string {
  return text
    .replaceAll('\', '\\\')
    .replaceAll("'", String.raw`'`)
    .replaceAll('\n', String.raw`\n`);
}

export function emitErrorDescription(
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): string {
  const schema = buildInputSchemaObject(pathParamMetadata, queryParamMetadata);

  const compactSchemaJson = JSON.stringify(schema);
  const requiredList = buildRequiredList(schema);

  const content = [
    'Invalid request parameters. Please match the following schema:',
    `Schema: ${compactSchemaJson}`,
    `Required: ${requiredList}`,
  ].join('\n');

  const escaped = escapeForSingleQuotedJsString(content);

  return [
    "const toolArgsDescription = '" + escaped + "';",
    'export const describeToolArgs = () => toolArgsDescription;',
  ].join('\n');
}
```

**What it is for:** On invalid arguments, hand the agent the exact JSON schema plus required-field list so it can retry with a valid call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-error-description.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C472 — getToolEntryFromToolName / getToolNameFromOperationId / getOperationIdFromToolName guard messages

**What it says now:**

```text
const GET_TOOL_ENTRY_FROM_TOOL_NAME_BLOCK = `export function getToolEntryFromToolName<TName extends ToolName>(toolName: TName): ToolEntryForName<TName> {
  const entry = TOOL_ENTRY_BY_NAME[toolName];
  if (!entry) {
    throw new TypeError('Unknown tool: ' + String(toolName));
  }
  return entry;
}`;

const GET_TOOL_FROM_TOOL_NAME_BLOCK = `export function getToolFromToolName<TName extends ToolName>(toolName: TName): ToolDescriptorForName<TName> {
  const entry = getToolEntryFromToolName(toolName);
  return entry.descriptor;
}`;

const OPERATION_ID_MAP_BLOCK = (operationIdToToolNameCases: string): string =>
  `const OPERATION_ID_TO_TOOL_NAME = {\n${operationIdToToolNameCases}\n} as const satisfies OperationIdToToolNameMap;`;

const IS_TOOL_OPERATION_ID_BLOCK = `export function isToolOperationId(value: unknown): value is ToolOperationId {
  return typeof value === 'string' && value in OPERATION_ID_TO_TOOL_NAME;
}`;

const GET_TOOL_NAME_FROM_ID_BLOCK = `export function getToolNameFromOperationId<TId extends ToolOperationId>(operationId: TId): ToolNameForOperationId<TId> {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}`;

const TOOL_NAME_TO_OPERATION_ID_BLOCK = (toolNameToOperationIdCases: string): string =>
  `const TOOL_NAME_TO_OPERATION_ID = {\n${toolNameToOperationIdCases}\n} as const satisfies ToolNameToOperationIdMap;`;
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Runtime guards in the generated tool registry that throw on an unknown tool name or operation id.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-definitions-file.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C474 — UndocumentedResponseError message template

**What it says now:**

```text
constructor(
    status: number,
    operationId: string,
    documentedStatuses: readonly string[],
    responseBody: unknown,
  ) {
    const upstreamMessage = extractUpstreamMessage(responseBody);
    const base = `Undocumented response status \${String(status)} for \${operationId}. Documented statuses: \${documentedStatuses.join(', ')}`;
    const message = upstreamMessage
      ? `\${base}. Upstream: \${upstreamMessage}`
      : base;
    super(message);
    this.name = 'UndocumentedResponseError';
    this.status = status;
    this.operationId = operationId;
    this.documentedStatuses = documentedStatuses;
    this.responseBody = responseBody;
    this.upstreamMessage = upstreamMessage;
  }
}
```

**What it is for:** When the upstream API returns an undocumented status, give the agent the status, the documented statuses, and any upstream message so it can react.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-undocumented-response-error-file.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C477 — validateOutput no-match message

**What it says now:**

```text
lines.push(
    '  validateOutput: (data: unknown) => {',
    '    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: z.ZodError["issues"] }[] = [];',
    '    for (const statusKey of documentedStatuses) {',
    '      const descriptor = responseDescriptors[statusKey];',
    '      if (!descriptor) {',
    '        continue;',
    '      }',
    '      const result = descriptor.zod.safeParse(data);',
    '      if (result.success) {',
    '        return { ok: true, data: result.data, status: STATUS_DISCRIMINANTS[statusKey] };',
    '      }',
    '      attemptedStatuses.push({ status: STATUS_DISCRIMINANTS[statusKey], issues: result.error.issues });',
    '    }',
    '    return {',
    `      ok: false, message: 'Response does not match any documented schema for statuses: ${documentedStatusesMessage}',`,
    '      issues: attemptedStatuses.flatMap((entry) => entry.issues),',

    '      attemptedStatuses,',
    '    };',
    '  },',
```

**What it is for:** When a response matches no documented schema, return a message naming the attempted documented statuses.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C478 — invoke-time guard TypeErrors (missing response descriptor / invalid method)

**What it says now:**

```text
'if (!primaryResponseDescriptor) {',
    `  throw new TypeError('Missing response descriptor for documented status ${primaryStatus} on ${operationId}.');`,

'    if (typeof call !== "function") {',
    `      throw new TypeError('Invalid method on endpoint: ${method.toUpperCase()} for ${path}');`,
```

**What it is for:** Guard rails inside each generated tool's invoke for a missing response descriptor or an invalid HTTP method on the endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C493 — get-changelog-latest toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
```

**What it is for:** Tell caller how to fix invalid args (schema + required list).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog-latest.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C497 — get-changelog toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
```

**What it is for:** Tell caller how to fix invalid args.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-changelog.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C509 — get-key-stages-subject-assets toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"description":"Use this type and the lesson slug in conjunction to get a signed download URL
```

**What it is for:** Tell caller how to fix invalid args (schema + required keyStage,subject).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C519 — get-key-stages-subject-lessons toolArgsDescription (validation template)

**What it says now:**

```text
"default":20,"examples":[10],"maximum":300}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject
```

**What it is for:** Tell caller how to fix invalid args (required keyStage,subject).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C529 — get-key-stages-subject-questions toolArgsDescription (validation template)

**What it says now:**

```text
"default":20,"examples":[10],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results.

\nRequired: keyStage, subject
```

**What it is for:** Tell caller how to fix invalid args (required keyStage,subject).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C536 — get-key-stages-subject-units toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"examBoard":{"type":"string","description":"Optional exam board slug to filter units by
```

**What it is for:** Tell caller how to fix invalid args (required keyStage,subject). Note: examBoard has no param description, only bare enum.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C541 — get-key-stages toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
```

**What it is for:** Tell caller how to fix invalid args (no required params).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C547 — get-keywords toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]}
```

**What it is for:** Tell caller how to fix invalid args (no required params; all filters optional bare enums).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C556 — get-lessons-assets toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"type":{"type":"string","description":"Optional asset type specifier\\n\\nAvailable values: slideDeck
```

**What it is for:** Tell caller how to fix invalid args (required lesson).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C563 — get-lessons-quiz toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug identifier","examples":["imagining-you-are-the-characters-the-three-billy-goats-gruff"]},"filter":{"type":"string","description":"Optional filter for question results. Use `images` to return only questions with a question image or image answer.","enum":["images"]}},"additionalProperties":false,"required":["lesson"]}\nRequired: lesson';
```

**What it is for:** Tell caller how to fix invalid args (required lesson).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C569 — get-lessons-summary toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"lesson":{"type":"string","description":"The slug of the lesson","examples":["using-vector-tools-to-draw-and-modify-shapes"]}
```

**What it is for:** Tell caller how to fix invalid args (required lesson).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-summary.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C575 — get-lessons-transcript toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"lesson":{"type":"string","description":"The slug of the lesson","examples":["checking-understanding-of-basic-transformations"]}},"additionalProperties":false,"required":["lesson"]}\nRequired: lesson';
```

**What it is for:** Tell caller how to fix invalid args (required lesson).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-transcript.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C586 — get-programmes-assets toolArgsDescription (validation template)

**What it says now:**

```text
"default":20,"examples":[20],"maximum":300},"type":{"type":"string","description":"Use this type

\nRequired: programme
```

**What it is for:** Tell caller how to fix invalid args (required programme).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C595 — get-programmes-questions toolArgsDescription (validation template)

**What it says now:**

```text
"default":20,"examples":[20],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results.

\nRequired: programme
```

**What it is for:** Tell caller how to fix invalid args (required programme).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C601 — get-programmes-units toolArgsDescription (validation template)

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"programme":{"type":"string","description":"The programme slug identifier","examples":["english-secondary-year-10-edexcel"]}},"additionalProperties":false,"required":["programme"]}\nRequired: programme';
```

**What it is for:** Tell caller how to fix invalid args (required programme).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C606 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"programme":{"type":"string","description":"The programme slug identifier","examples":["english-secondary-year-10-edexcel"]}},"additionalProperties":false,"required":["programme"]}\nRequired: programme';
```

**What it is for:** Returned when args fail validation; instructs the agent to match the schema and lists required params so it can retry.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C610 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
```

**What it is for:** Validation error for a no-param tool; states no params are required.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-rate-limit.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C617 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["maths-primary"]}
```

**What it is for:** Validation error listing schema and required 'sequence' param.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C626 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
"default":20,"examples":[100],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results.

\nRequired: sequence
```

**What it is for:** Validation error listing schema and required 'sequence'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C632 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"anyOf":[{"type":"string","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"],"description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."}]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
```

**What it is for:** Validation error listing schema and required 'sequence'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C637 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"sequence":{"type":"string","description":"The sequence slug identifier","examples":["english-secondary-aqa"]}
```

**What it is for:** Validation error listing schema and required 'sequence'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C642 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"The slug identifier for the subject","examples":["art"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
```

**What it is for:** Validation error listing schema (with subject enum) and required 'subject'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subject-detail.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C647 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"The subject slug identifier","examples":["art"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
```

**What it is for:** Validation error listing schema and required 'subject'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-key-stages.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C652 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"The subject slug identifier","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
```

**What it is for:** Validation error listing schema and required 'subject'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-programmes.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C657 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"Subject slug to filter by","examples":["cooking-nutrition"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
```

**What it is for:** Validation error listing schema and required 'subject'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C661 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
```

**What it is for:** Validation error for a no-param tool (Required: none).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C666 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"thread":{"type":"string","description":"The thread identifier for a given unit","examples":["number-multiplication-and-division"]}
```

**What it is for:** Validation error listing schema and required 'thread'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads-units.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C670 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
```

**What it is for:** Validation error for a no-param tool (Required: none).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C675 — toolArgsDescription / describeToolArgs

**What it says now:**

```text
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:

"examBoard":{"type":"string","description":"Optional exam board slug to narrow the unit to a specific programme variant, e.g. 'aqa'.","examples":["aqa"]
```

**What it is for:** Validation error listing schema and required 'unit'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-units-summary.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C679 — TypeError 'Unknown tool: ' + toolName

**What it says now:**

```text
throw new TypeError('Unknown tool: ' + String(toolName));
```

**What it is for:** Invariant-violation error thrown by dispatch lookups (getToolEntryFromToolName, getOperationIdFromToolName) when an unrecognised tool name is passed; a fixed authored prefix + interpolated name.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/definitions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C680 — TypeError 'Unknown operation: ' + operationId

**What it says now:**

```text
throw new TypeError('Unknown operation: ' + String(operationId));
```

**What it is for:** Invariant-violation error thrown by getToolNameFromOperationId when an unrecognised operationId is passed; fixed authored prefix + interpolated operationId.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/definitions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C682 — UndocumentedResponseError base message template

**What it says now:**

```text
const base = `Undocumented response status ${String(status)} for ${operationId}. Documented statuses: ${documentedStatuses.join(', ')}`;
```

**What it is for:** The core error message an agent receives when the upstream API returns an HTTP status not documented in the OpenAPI spec; states the status, operation and the documented statuses so the agent understands the contract violation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/undocumented-response-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C683 — '. Upstream: ' + upstreamMessage suffix

**What it says now:**

```text
const message = upstreamMessage
      ? `${base}. Upstream: ${upstreamMessage}`

function extractUpstreamMessage(body: unknown): string | undefined {
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  if ('message' in body && typeof body.message === 'string') {
    return body.message;
  }
  return undefined;
}
```

**What it is for:** Appends the upstream API's own error message to the error the agent receives, giving human-readable context (e.g. why a transcript is unavailable). extractUpstreamMessage pulls a plain string body or body.message.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/undocumented-response-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C684 — error name literal 'UndocumentedResponseError'

**What it says now:**

```text
this.name = 'UndocumentedResponseError';
```

**What it is for:** The error's name property, used for instanceof/name-based classification by downstream handlers (mapErrorToResult) and visible in serialized errors/logs an agent may see.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/undocumented-response-error.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C687 — AuthErrorResponse.content text

**What it says now:**

```text
content: [
      {
        type: 'text',
        text: `Authentication Error: ${description}`,
      },
```

**What it is for:** Human/agent-readable auth failure text placed in the tool result content array so the caller sees why the call was rejected.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C693 — validateRequestParams 'Missing lesson parameter'

**What it says now:**

```text
if (!isNonEmptyString(lesson)) {
    return 'Missing lesson parameter';
  }
```

**What it is for:** 400 validation error returned as JSON {error} when the lesson path param is empty.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C694 — validateRequestParams 'Invalid asset type'

**What it says now:**

```text
if (!isNonEmptyString(type) || !isAssetType(type)) {
    return 'Invalid asset type';
  }
```

**What it is for:** 400 validation error when the type param is empty or fails isAssetType.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C695 — validateRequestParams 'Invalid sig parameter'

**What it says now:**

```text
if (!isNonEmptyString(sig) || !HEX_SHA256_PATTERN.test(sig)) {
    return 'Invalid sig parameter';
  }
```

**What it is for:** 400 validation error when sig is absent or not a 64-char lowercase hex SHA-256 string.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C696 — validateRequestParams 'Invalid exp parameter'

**What it says now:**

```text
const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt)) {
    return 'Invalid exp parameter';
  }
```

**What it is for:** 400 validation error when exp is not a finite number.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C710 — McpToolError 'Stub result content is empty'

**What it says now:**

```text
function decodeStubPayload(result: CallToolResult, name: ToolName): unknown {
  const first = extractFirstText(result);
  if (!first) {
    throw new McpToolError('Stub result content is empty', name, { code: 'STUB_DECODE_ERROR' });
  }
```

**What it is for:** Tool-execution error surfaced to the consumer (code STUB\_DECODE\_ERROR) when a stub result has no text content.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C711 — McpToolError 'Stub result is not valid JSON'

**What it says now:**

```text
try {
    return JSON.parse(first.text);
  } catch (error) {
    throw new McpToolError('Stub result is not valid JSON', name, {
      code: 'STUB_DECODE_ERROR',
      cause: error instanceof Error ? error : undefined,
    });
  }
}
```

**What it is for:** Tool-execution error (STUB\_DECODE\_ERROR) when a stub payload text fails JSON.parse.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C712 — deriveErrorMessage fallback + STUB\_EXECUTION\_ERROR

**What it says now:**

```text
function deriveErrorMessage(result: CallToolResult): string {
  const first = extractFirstText(result);
  if (first) {
    return first.text;
  }
  return 'Stub execution failed without diagnostic text content';
}
```

**What it is for:** When a stub returns isError, the caller receives an McpToolError (code STUB\_EXECUTION\_ERROR) whose message is the stub's own text, or this fallback when no diagnostic text exists.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C713 — McpToolError 'Execution failed: ' + message

**What it says now:**

```text
const outputValidation = descriptor.validateOutput(rawData);
    if (!outputValidation.ok) {
      return err(
        new McpToolError('Execution failed: ' + outputValidation.message, name, {
          code: 'OUTPUT_VALIDATION_ERROR',
        }),
      );
    }
```

**What it is for:** Output-validation error (code OUTPUT\_VALIDATION\_ERROR) surfaced when a decoded stub payload fails the descriptor's output schema; authored prefix + validation message.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact

### C715 — assertStubAvailable TypeError

**What it says now:**

```text
export function assertStubAvailable(name: unknown): asserts name is ToolName {
  if (!isToolName(name) || !hasStubForTool(name)) {
    throw new TypeError(`Stub payload not available for tool: ${String(name)}`);
  }
}
```

**What it is for:** Guard TypeError thrown when a stub payload is requested for a tool that has none; reflects the tool name.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** error-message · **Impact tier:** high-impact
