---
name: "MCP Apps SDK Audit: Assumptions and Opportunities"
overview: "Correct bad assumptions about the MCP Apps SDK and adopt missed opportunities. All items are immediate priorities for the branding branch."
parent_plan: "ws3-branding-alignment-and-merge.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, react-component-reviewer"
isProject: false
todos:
  - id: a1-fix-tsdoc-single-slot
    content: "A1: Correct misleading single-callback-slot TSDoc in App.tsx — SDK has addEventListener, not just on* setters."
    status: pending
  - id: a3-fix-variable-count
    content: "A3: Remove specific '73' count from TSDoc — actual union is ~65 keys."
    status: pending
  - id: a4-update-readme-network
    content: "A4: Update README 'no network requests' text after Google Fonts @import is added."
    status: pending
  - id: a5-handle-connection-state
    content: "A5: Destructure isConnected and error from useApp, render error/connecting states."
    status: pending
  - id: b4-downloadfile-for-assets
    content: "B4: Wire existing download-asset tool into official downloadFile flow for curriculum slides/PDFs."
    status: pending
  - id: b5-csp-google-fonts
    content: "B5: Add _meta.ui.csp.resourceDomains for Google Fonts to register-resources.ts contents[]."
    status: pending
  - id: b6-prefers-border
    content: "B6: Add _meta.ui.prefersBorder to widget resource for visual boundary in chat flow."
    status: pending
  - id: b7-sendlog
    content: "B7: Use app.sendLog for structured logging to host (replace console patterns)."
    status: pending
  - id: b8-capability-check
    content: "B8: Check getHostCapabilities before calling openLink, downloadFile."
    status: pending
  - id: b2-container-dimensions
    content: "B2: Read containerDimensions from host context for layout adaptation."
    status: pending
  - id: b3-display-modes
    content: "B3: Support displayMode and requestDisplayMode for fullscreen search view."
    status: pending
  - id: b9-platform-capabilities
    content: "B9: Read platform and deviceCapabilities for adaptive UI."
    status: pending
  - id: b10-locale-timezone
    content: "B10: Read locale and timeZone from host context for future localisation."
    status: pending
  - id: b11-update-model-context
    content: "B11: Use updateModelContext to push search results as model context."
    status: pending
  - id: b12-send-message
    content: "B12: Use sendMessage for app-to-model communication."
    status: pending
  - id: b13-streaming-preview
    content: "B13: Use ontoolinputpartial data for streaming search preview."
    status: pending
  - id: b14-per-tool-auth
    content: "B14: Design per-tool auth escalation for user-specific curriculum features."
    status: pending
---

# MCP Apps SDK Audit: Assumptions and Opportunities

**Last Updated**: 2026-04-06
**Status**: 🟢 IMMEDIATE — all items are priorities for this branch
**Branch**: `feat/mcp_app_ui`
**Scope**: Correct bad assumptions and adopt missed SDK opportunities.

**Source**: Complete read of every page at
`apps.extensions.modelcontextprotocol.io/api/` — overview, quickstart,
patterns, testing-mcp-apps, agent-skills, migrate-openai-app,
authorization, csp-and-cors, App class API, React hooks API,
server-helpers, app-bridge, types. Also explored installed v1.3.2
source in `node_modules`.

---

## Part 1: Bad Assumptions to Correct

### A1: "Single callback slot per notification" — WRONG

**Our TSDoc** (App.tsx lines 4-19): Claims the SDK uses a single
`onhostcontextchanged` setter and a second assignment overwrites.

**Reality**: The App class has `addEventListener(event, handler)` and
`removeEventListener(event, handler)`. These compose with `on*`
property setters. Multiple listeners are supported.

**Fix**: Correct TSDoc to say "we compose concerns in one handler for
simplicity" not "because the SDK only has one slot." Also update
the napkin entry from session 2026-04-06c and `distilled.md` entry
about "MCP Apps single callback slot".

### A2: Lexend embedding — ALREADY FIXED

Google Fonts `@import`, not WOFF2 embedding.

### A3: "73 standard variable names" — IMPRECISE

Installed `McpUiStyleVariableKey` union has ~65 keys. Remove the
specific count from TSDoc; say "standard names" instead.

### A4: "No external network requests" — MISLEADING

README says widget has "no external network requests." After the
Google Fonts `@import`, this is no longer true. Update in P1.

### A5: `isConnected` and `error` not used

`useApp` returns `{ app, isConnected, error }`. We only destructure
`app`. A connection failure or timeout shows a broken widget with no
error indication. Fix: render error and connecting states.

---

## Part 2: Opportunities — All Immediate Priorities

### B1: `autoResize` — already active (no action needed)

`useApp` defaults `autoResize: true`. Our banner auto-reports its
compact size to the host. No code change needed, but good to know.

### B2: `containerDimensions` from host context

Host provides `{ height, maxHeight, width, maxWidth }`. Read this
for layout adaptation in interactive views.

### B3: `displayMode` and `requestDisplayMode`

Support `inline`, `fullscreen`, and `pip`. Read `displayMode` and
`availableDisplayModes` from host context. The search view (Phase 5)
should offer fullscreen mode.

### B4: `downloadFile` for curriculum assets — HIGH VALUE

`app.downloadFile({ contents: [...] })` bypasses iframe sandbox
restrictions. We already have a `download-asset` tool that streams
curriculum slides and PDFs. Wire this into the official `downloadFile`
flow so users can download assets directly from the MCP App UI.

### B5: CSP for Google Fonts — BLOCKING for P1

After adding the Google Fonts `@import`, the resource `contents[]`
must declare CSP domains:

```typescript
contents: [
  {
    uri: WIDGET_URI,
    mimeType: RESOURCE_MIME_TYPE,
    text: getWidgetHtml(),
    _meta: {
      ui: {
        csp: {
          resourceDomains: [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
          ],
        },
      },
    },
  },
],
```

File: `src/register-resources.ts` line 191.

### B6: `_meta.ui.prefersBorder`

Add `prefersBorder: true` to the widget resource metadata. Hints the
host to render a visible border around the Oak banner iframe.

### B7: `sendLog` for structured logging

`app.sendLog({ level, message })` sends logs to the host's developer
tools. Use instead of console patterns. Requires host `logging`
capability (check first via B8).

### B8: `getHostCapabilities` for feature detection

Check capabilities before calling `openLink`, `downloadFile`,
`sendLog`, `updateModelContext`, `sendMessage`. Degrade gracefully
when a host doesn't support a feature.

### B9: `platform` and `deviceCapabilities`

`hostContext.platform` (`web`/`desktop`/`mobile`) and
`deviceCapabilities` (`{ touch, hover }`) enable adaptive UI. Read
and store in runtime state.

### B10: `locale` and `timeZone`

BCP 47 locale and IANA timezone from host. Store for future
localisation support.

### B11: `updateModelContext` for search results

Push structured context (with YAML frontmatter) to the model. The
interactive search view should push search results as model context
so the model can reason about what the user found.

### B12: `sendMessage` for app-to-model communication

Inject messages into the conversation from the app UI. Combined with
B11, enables the app to guide the model after user interaction.

### B13: `ontoolinputpartial` streaming preview

We register the handler but don't use the data. Use for live search
preview while tool input is streaming.

### B14: Per-tool authorization escalation

Public tools work without auth; protected tools trigger OAuth on
demand. Design this for user-specific curriculum features (saved
lessons, personalised recommendations, annotation).

---

## Phasing

### Fix now (P1/P2/P3 on this branch):

- A1, A3: TSDoc corrections
- A4: README update (with P1 font work)
- A5: `isConnected`/`error` handling
- B5: CSP for Google Fonts (blocking P1)
- B6: `prefersBorder`
- B8: Capability check before `openLink`

### Fix on this branch if time permits:

- B4: `downloadFile` wiring for `download-asset`
- B7: `sendLog` adoption

### Phase 5 (interactive search view):

- B2: Container dimensions
- B3: Display modes / fullscreen
- B9: Platform / device capabilities
- B10: Locale / timezone
- B11: `updateModelContext`
- B12: `sendMessage`
- B13: Streaming preview
- B14: Per-tool auth escalation

---

## Key files

- `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/app-runtime-state.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
  — line 191: `contents[]` return has no `_meta`. CSP goes here.
- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `.agent/memory/distilled.md` — "MCP Apps single callback slot"
  entry needs correction (A1)

---

## Cross-Plan References

- `ws3-branding-alignment-and-merge.plan.md` — parent plan (P0-P3)
- `ws3-widget-clean-break-rebuild.plan.md` — WS3 parent
- `ws3-phase-5-interactive-user-search-view.plan.md` — consumer of
  B2, B3, B9-B14
