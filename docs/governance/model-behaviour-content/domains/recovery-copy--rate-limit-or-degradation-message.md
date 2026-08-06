---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# rate-limit-or-degradation-message — part of the recovery-copy review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

What an agent receives when something fails or returns nothing — validation, empty-state, and degradation messages. This copy shapes whether an agent recovers or fabricates.

This page holds only the **rate-limit-or-degradation-message** items of that view, so it can be reviewed in one sitting.

**11 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 4 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the recovery-copy view](./recovery-copy.md) · [Back to the workspace index](../README.md)

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

### C058 — download-asset transport-unavailable error

**What it says now:**

```text
if (!deps.createAssetDownloadUrl) {
    return Promise.resolve(
      formatError('download-asset is not available in this transport (HTTP-only)'),
    );
  }
```

**What it is for:** Returned as an isError CallToolResult when an agent invokes download-asset on a transport lacking createAssetDownloadUrl (stdio); tells the calling agent the capability is HTTP-only rather than silently failing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C401 — respondProxyError-upstream-unavailable

**What it says now:**

```text
res
    .status(status)
    .json(
      formatProxyErrorResponse(
        'temporarily_unavailable',
        'Upstream authorization server is not responding',
      ),
    );
}
```

**What it is for:** On upstream timeout (504) or network failure (502) tells the client the upstream authorization server is not responding, framed as OAuth temporarily\_unavailable so the client backs off/retries later.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-handlers.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C504 — get-key-stages-subject-assets NOTE token-limit injection

**What it says now:**

```text
\n\nNOTE: This tool can return a large payload at broad scope and may exceed a host
```

**What it is for:** Warn agent of large payloads at broad scope; narrow with unit/type or use get-lessons-assets.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C698 — 'Proxy error'

**What it says now:**

```text
if (!res.headersSent) {
        res.status(502).json({ error: 'Proxy error' });
      }
```

**What it is for:** 502 degradation body returned when proxyUpstreamAsset throws before headers are sent.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C699 — 'Download stream error'

**What it says now:**

```text
readable.on('error', (error) => {
      logger.error('asset-download.stream.error', normalizeError(error));
      if (!res.headersSent) {
        res.status(502).json({ error: 'Download stream error' });
      }
      res.destroy();
      settle(() => reject(error));
    });
```

**What it is for:** 502 degradation body emitted if the upstream body stream errors before headers are sent.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-proxy.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C700 — 'Upstream error'

**What it says now:**

```text
if (!upstream.ok) {
    logUpstreamError(deps.logger, params, upstream.status);
    res.status(502).json({ error: 'Upstream error' });
    return;
```

**What it is for:** 502 degradation body returned when the Oak API upstream responds non-2xx (mapped/logged by status but body is a generic 'Upstream error').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-proxy.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C701 — 'Upstream response has no body'

**What it says now:**

```text
deps.observability?.captureHandledError(new Error('Upstream response has no body'), {
    boundary: 'asset_download_no_body',
    lesson: params.lesson,
    type: params.type,
  });
  res.status(502).json({ error: 'Upstream response has no body' });
```

**What it is for:** 502 degradation body when an ok upstream response carries no body; same text also passed to observability.captureHandledError (operator-facing) at line 156.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-proxy.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

## Retired (4)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C409 — MCP\_RATE\_LIMIT.message

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
{ error: 'Too Many Requests', message: 'Rate limit exceeded. Try again later.' }
```

**What it is for:** The 429 body for MCP routes (POST/GET /mcp) telling the client it exceeded the 120 req/min limit and to retry later; uses the { error, message } shape matching MCP route errors.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C410 — OAUTH\_RATE\_LIMIT.message

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
{ error: 'too_many_requests', error_description: 'Rate limit exceeded. Try again later.' }
```

**What it is for:** The 429 body for OAuth flow routes (register/token/authorize) at 30 req/15min; uses the OAuth { error, error\_description } shape so it parses like an OAuth error client-side.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C411 — METADATA\_RATE\_LIMIT.message

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
{ error: 'too_many_requests', error_description: 'Rate limit exceeded. Try again later.' }
```

**What it is for:** The 429 body for OAuth metadata discovery routes (/.well-known/\*) at 60 req/min; OAuth error shape since these routes are OAuth-protocol-adjacent.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact

### C412 — ASSET\_RATE\_LIMIT.message

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
{ error: 'Too Many Requests', message: 'Rate limit exceeded. Try again later.' }
```

**What it is for:** The 429 body for asset download route (GET /assets/download/:lesson/:type) at 60 req/min; { error, message } shape, guarding against HMAC-URL replay exhausting the upstream Oak API.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** rate-limit-or-degradation-message · **Impact tier:** high-impact
