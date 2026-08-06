---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# ux-accessibility — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Human-facing surfaces — the landing page, the widget, and authorisation and consent copy. WCAG 2.2 AA applies.

**16 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 1 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (15)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C014 — serverOverview.authentication

**What it says now:**

```text
authentication: 'OAuth2 with Clerk - sign in with your email to access curriculum resources.',
```

**What it is for:** Tells the user/agent that access requires OAuth2 (Clerk) sign-in with email, shaping how auth failures are explained.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C068 — SEARCH\_TOOL\_DEF.securitySchemes / \_meta.securitySchemes

**What it says now:**

```text
securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,

_meta: {
    securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }],
  },
```

**What it is for:** Declares the oauth2 scopes the tool requires (values spread from imported SCOPES\_SUPPORTED) so the host requests the correct consent scopes.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C348 — config snippet aria-label

**What it says now:**

```text
aria-label="JSON configuration snippet"
```

**What it is for:** Labels the preformatted code block for assistive tech so non-visual users know it is the JSON configuration snippet.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

### C349 — OAuth / access-restriction copy

**What it says now:**

```text
You will be prompted to sign in with your Oak account.
```

**What it is for:** Tells the user the server uses OAuth 2.1, that they will be prompted to log in, and that access is limited to internal staff or invitees — links to the PRM well-known endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C367 — 'How to use' collapsible label

**What it says now:**

```text
How to use<span className="oak-visually-hidden"> {tool.name}</span>
```

**What it is for:** Labels the nested collapsible that holds the how-to-use remainder of a tool description (first-paragraph = summary, rest = how-to-use).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/tools-section.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-tools-section.ts`).
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

### C385 — visually-hidden <h1> heading

**What it says now:**

```text
<h1 className="visually-hidden">Oak National Academy Curriculum</h1>
```

**What it is for:** Screen-reader-only page heading giving the widget an accessible name/landmark (WCAG page-has-heading-one) so AT users are oriented to 'Oak National Academy Curriculum'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

### C391 — brand banner label 'Oak National Academy'

**What it says now:**

```text
<span className="visually-hidden">Oak National Academy (opens in a new tab)</span>
```

**What it is for:** Visible brand text and the link's accessible name; the sole human-visible orientation cue ('you are in Oak now') in the widget.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

### C392 — visually-hidden 'opens in a new tab' hint

**What it says now:**

```text
<span className="visually-hidden">Oak National Academy (opens in a new tab)</span>
```

**What it is for:** Screen-reader-only warning that the brand link opens in a new tab (target=\_blank), meeting the WCAG new-window advisory.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

### C394 — WIDGET\_HTML\_CONTENT (generated widget bundle)

**What it says now:**

```text
/**
 * GENERATED FILE — DO NOT EDIT
 *
 * Built widget HTML content generated by the widget build step.
 * Re-generate by running: pnpm build:widget
 *
 * @see widget/vite.config.ts - Widget build configuration
 * @see widget/oak-banner.html - Widget entry point
 */
export const WIDGET_HTML_CONTENT = `<!doctype html>
<html lang="en">
```

**What it is for:** The full self-contained HTML+JS the MCP host renders as the Oak UI app; a build artefact whose behaviour-bearing source of truth is the widget/src React app (this slice) plus the widget/oak-banner.html entry and widget/vite.config.ts, regenerated via `pnpm build:widget`. Not authored/edited directly.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/generated/widget-html-content.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

### C395 — sendMissingAuthResponse

**What it says now:**

```text
export function sendMissingAuthResponse(res: Response, prmUrl: string): void {

'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}"`
```

**What it is for:** Signals a 401 with a WWW-Authenticate Bearer challenge pointing at the PRM URL, directing the MCP client to begin OAuth discovery/authentication; body error is the generic 'Unauthorized'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`).
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C396 — sendInvalidFormatResponse

**What it says now:**

```text
export function sendInvalidFormatResponse(res: Response, prmUrl: string): void {

message: 'Invalid Authorization header format.',
```

**What it is for:** Tells the client its Authorization header format is wrong and instructs the correct form ("Bearer <token>"); error code invalid\_request in the challenge, plus a human-readable body message.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`).
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C397 — sendVerificationFailedResponse

**What it says now:**

```text
export function sendVerificationFailedResponse(res: Response, prmUrl: string): void {

error_description="Token verification failed"
```

**What it is for:** Signals invalid\_token (token verification failed) so the client discards the token and re-authenticates rather than retrying with the same credential.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`).
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C686 — createAuthErrorResponse / wwwAuthenticate

**What it says now:**

```text
// Format WWW-Authenticate header per RFC 6750 Section 3
  // Format: Bearer resource_metadata="...", error="...", error_description="..."
  const wwwAuthenticate = `Bearer resource_metadata="${metadataUrl}", error="${errorType}", error_description="${description}"`;

  // Return MCP-compliant error response
  return {
    content: [
      {
        type: 'text',
        text: `Authentication Error: ${description}`,
      },
    ],
    isError: true,
    _meta: {
      'mcp/www_authenticate': [wwwAuthenticate],
    },
```

**What it is for:** The WWW-Authenticate Bearer string is emitted in \_meta['mcp/www\_authenticate'] to signal OAuth availability and trigger the MCP client's re-authentication flow per RFC 6750 / MCP spec.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C688 — AuthErrorType union

**What it says now:**

```text
export type AuthErrorType =
  | 'invalid_token' // Token is malformed, expired, or otherwise invalid
  | 'insufficient_scope' // Token lacks required scopes
  | 'token_expired' // Token has expired
  | 'missing_token'; // No token provided
```

**What it is for:** Enumerates the RFC 6750 error tokens (invalid\_token / insufficient\_scope / token\_expired / missing\_token) surfaced in the error="…" field of the WWW-Authenticate header, which clients branch on.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** auth-consent-copy · **Impact tier:** high-impact

### C692 — WIDGET\_UI\_META

**What it says now:**

```text
const WIDGET_UI_META = {
  csp: {
    resourceDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  prefersBorder: false,
} as const;
```

**What it is for:** Authored MCP-App UI metadata on the contents[] item: declares CSP resourceDomains (Google Fonts) so CSP-enforcing hosts allow the Lexend @import, and prefersBorder:false so the host does not add chrome.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config

## Retired (1)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C370 — 'Click to expand' hint (grouped)

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
<span class="expand-hint">Click to expand</span>
```

**What it is for:** Affordance hint prompting the reader to expand each collapsible section. Grouped: identical string in all three sections (prompts L52, resources L45, tools L145).

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-prompts-section.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** simple-config
