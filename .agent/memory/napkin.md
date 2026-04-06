## Napkin rotation — 2026-04-06

Rotated at 559 lines after SDK adoption Phase 5 + type-correctness
audit. Archived to `archive/napkin-2026-04-06.md`. Merged 2 entries
into `distilled.md`: `unknown` rule promotion note, Zod v4 `.merge()`
correction. Extracted 1 pattern: `reviewer-widening-is-always-wrong.md`.
Previous rotation: 2026-04-04 at 579 lines.

---

### Session 2026-04-06b — Host verification + reviewer sweep

#### Surprises

**S1: Claude Code does not support MCP Apps rendering.**
Expected: Claude Code (VS Code extension) would render the MCP App
widget when `get-curriculum-model` was called via `/mcp` connection.
Actual: No widget rendered. Investigation revealed Claude Code is NOT
listed as an MCP Apps host. The "VS Code" entry in the ext-apps
supported clients list refers to VS Code's built-in GitHub Copilot
agent mode, not Claude Code. MCPJam confirmed the server-side works.
Source: modelcontextprotocol.io/extensions/apps/overview — authoritative
client list. Also code.claude.com/docs/en/mcp — no MCP Apps mention.
Impact: Need to validate MCP Apps in MCPJam, basic-host, claude.ai
web, or Claude Desktop — not Claude Code.

**S2: Legacy compatibility tests were testing SDK internals.**
The E2E pipeline test had an assertion for `_meta["ui/resourceUri"]`
(a legacy flat key added by the SDK's `registerAppTool` normalisation).
The integration test had a full describe block testing this legacy key.
Both tested the SDK's internal compatibility logic, not Oak product
behaviour. Deleted per clean-break principle.

**S3: DNS rebinding test broken by missing ALLOWED_HOSTS.**
`web-security-selective.e2e.test.ts` expected 403 for `Host: evil.com`
but got 404. Root cause: the test config had no `ALLOWED_HOSTS`, so
`dnsRebindingProtection` treated empty allowedHosts as "allow all"
(security.ts:58). Adding `ALLOWED_HOSTS: 'localhost,127.0.0.1,::1'`
fixed it. The empty-means-permissive behaviour is intentional for
production (Vercel sets hosts), but tests must configure explicitly.

#### Corrections

- Removed redundant `ws3-red-specs.e2e.test.ts` — all 3 specs now
  GREEN (Phase 3 complete), and behaviour is proven by pipeline +
  metadata E2E tests.
- Removed duplicate `createTestApp` from `widget-metadata.e2e.test.ts`
  — now uses shared `createStubbedHttpApp()` helper.
- Added vacuous-pass guards to widget-metadata tests.
- Added `target="_blank" rel="noopener noreferrer"` to BrandBanner
  link (code-reviewer finding).

#### Reviewer findings (8 specialists, 0 critical)

All 8 specialist reviewers passed with zero critical issues:
react-component (WELL-STRUCTURED), type (no violations), test
(5 improvements), code-gateway (APPROVED), mcp (COMPLIANT),
accessibility (COMPLIANT), E2E helper audit (confirmed real path).

Non-blocking findings addressed this session:

- Legacy key test deleted
- BrandBanner link security fixed
- Vacuous-pass guards added
- CSS class assertion deleted
- fireEvent.click consistency fixed

Non-blocking findings deferred:

- `getUiCapability` capability negotiation (design assessment needed)
- Browser proof surfaces per ADR-147 (future plan)
- `createSafeDispatch` error-isolation coverage (future test)

#### Practice note

The `unknown-is-type-destruction` concept was approved by the user for
Practice Core promotion. It mostly applies to TypeScript but many Oak
repos are TypeScript.

---

### Session 2026-04-06c — Branding alignment planning

#### Surprises

**S1: basic-host is not an npm package.**
Expected: `npx @modelcontextprotocol/basic-host` would start the host.
Actual: Package name is `@modelcontextprotocol/ext-apps-basic-host`,
has no `bin` field, and is not published to npm. Must clone the
ext-apps repo and run from `examples/basic-host/`.
Source: mcp-reviewer verified against GitHub source and npm registry.

**S2: Single-callback-slot dispute between reviewers.**
react-component-reviewer (checked installed v1.3.2 bundle) said
`useHostFonts` assigns `app.onhostcontextchanged` directly. mcp-reviewer
(checked GitHub source) said hooks use `addEventListener`. Resolution:
use the official imperative pattern from `ext-apps/docs/patterns.md`
(`applyDocumentTheme`/`applyHostStyleVariables`/`applyHostFonts` in
`useEffect`) which avoids the question entirely.

**S3: `getUiCapability` incompatible with per-request server.**
The function requires `oninitialized` callback after client handshake.
In the per-request factory (ADR-112), tools are registered before any
client request arrives. Resolution: always register App tools with
`_meta.ui.resourceUri` AND include `content[]` text — non-UI hosts
ignore `_meta.ui`. This is already the repo's current approach.

**S4: The official React example does NOT use convenience hooks.**
Expected: `useHostStyles`/`useHostFonts` would be the canonical React
pattern. Actual: The official `basic-server-react` example uses
`app.onhostcontextchanged` property setter in `onAppCreated` with
manual state management. The `docs/patterns.md` shows imperative
`applyDocumentTheme`/`applyHostStyleVariables`/`applyHostFonts` in
`useEffect`.

**S5: Oak brand green is mint #bef2bd, not #287C34.**
Expected: oakGreen (#287C34) was the primary brand colour (from
Oak-Web-Application's default.theme.ts). Actual: User corrected —
the current Oak brand identity centres on the mint background visible
on thenational.academy. The #287C34 is the old button accent.

#### Corrections

- "Fallback" language corrected throughout plan and docs. This repo
  does not permit fallbacks. CSS custom properties set by the app are
  brand defaults; the host MAY override via CSS specificity. Both
  states are correct and complete.
- Removed 4 custom Oak MCP skills (mcp-create-app, mcp-add-ui,
  mcp-convert-web, mcp-migrate-oai) in favour of official upstream
  versions installed via `npx skills add modelcontextprotocol/ext-apps`.
- mcp-expert SKILL.md and mcp-reviewer template updated with proper
  MCP Apps API documentation URLs.
- Consolidated ws3-local-widget-development plan into the branding plan.

#### Design decisions confirmed

- `semantic.accent` (light): `#222222` (dark text doubles as accent)
- Dark theme `surface-accent`: `#2a5c3a` (dark forest green, ~7.5:1)
- Banner: minimally tall — compact, not centred in full viewport
- Fonts: Lexend embedded as @font-face, `--font-sans` set to Lexend
- Logo: real Oak SVG from Oak-Web-Application sprite sheet

---

### Session 2026-04-06d — P0 dev infra execution

#### Surprises

**S1: ext-apps package blocks `require('./package.json')` via exports.**
Expected: `require('@modelcontextprotocol/ext-apps/package.json').version`
would read the installed version. Actual: Node throws
`ERR_PACKAGE_PATH_NOT_EXPORTED`. The package uses the `exports` field
which restricts subpath access. Workaround: `require.resolve` the
entry point, walk up directories to find `package.json`. Simplified
by dropping version pinning entirely — shallow clone of default branch
is sufficient for a dev tool.

**S2: `vite-plugin-singlefile` is a no-op in dev mode.**
Expected: might need a separate `vite.dev.config.ts` without the
singlefile plugin. Actual: the plugin hooks into `generateBundle`
(a Rollup build-only hook). During `vite dev` there is no build step,
so the plugin does nothing. The `build:` config block is similarly
ignored. One config serves both modes.

#### Corrections

- None this session.

---

### Session 2026-04-06e — Canonical divergence review + fixes

#### Surprises

**S1: MCP spec confirms partial host context updates.**
Expected: unclear whether hosts always send full context.
Actual: MCP Apps spec explicitly says these are "partial updates"
and Views SHOULD merge. A theme-only update followed by a
variables-only update is a valid host sequence. Our imperative
approach was silently losing previously-set styling fields.

**S2: SDK does NOT require 73 standard variable names in app CSS.**
Expected: apps must define `--color-background-primary` etc.
Actual: those are purely the host-to-app override channel. Apps
can use whatever CSS naming they want internally. The MUST is
narrower: provide fallbacks for any SDK variable you DO reference.

**S3: D2 was partially a false alarm.**
The assumptions-reviewer caught that our reducer already had merge
semantics via `?? state.theme` (line 144-145 of
`app-runtime-state.ts`). The real bug was only on the styling
side-effect, not the state accumulation.

#### Corrections

- Refactored App.tsx to canonical SDK React pattern: `useState`
  with merge semantics, `useEffect` for styling, `applyHostFonts`
  added, safe area insets applied, `useCallback` for stable refs.
- Removed dead `oak-banner__title` CSS class from BrandBanner.
- Extracted `useHostContextStyling` hook to keep `App` under
  50-line lint limit.

#### New artefacts

- `docs/governance/mcp-app-styling.md` — canonical MCP App styling
  guide (SDK standard variable names, host context pattern, no custom
  plumbing)
- `.agent/reference/official-mcp-app-skills.md` — upstream skill
  installation and integration
- `.agents/skills/{create-mcp-app,add-app-to-server,convert-web-app,migrate-oai-app}/` — official upstream skills

---

### Session 2026-04-06f — Full SDK docs audit

#### Surprises

**S1: SDK has addEventListener, not just on* setters.**
Expected: single callback slot per notification (stated in our TSDoc
and distilled.md). Actual: `App` class has `addEventListener(event,
handler)` and `removeEventListener(event, handler)` that compose with
`on*` setters. Multiple listeners supported. Our TSDoc and
distilled.md entry "MCP Apps single callback slot" are wrong.

**S2: CSP declarations required for external resources.**
Expected: MCP App iframes can freely make network requests. Actual:
hosts enforce CSP based on `_meta.ui.csp` declarations in the
resource `contents[]`. Must declare `resourceDomains` for Google Fonts
(`fonts.googleapis.com`, `fonts.gstatic.com`) and `connectDomains`
for any API calls. Without this, hosts may block requests.

**S3: `downloadFile` method exists for sandbox-bypassing downloads.**
Expected: file downloads require workarounds in sandboxed iframes.
Actual: `app.downloadFile({ contents: [...] })` is an official SDK
method that delegates to the host. We already have `download-asset`
for curriculum slides/PDFs — this should wire into `downloadFile`.

**S4: `useApp` returns connection state we're ignoring.**
Expected: `app` is sufficient. Actual: `{ app, isConnected, error }`.
Connection failures or timeouts show a broken widget with no error
indication.

**S5: ~65 standard variable keys, not 73.**
Expected: 73 (stated in TSDoc). Actual: installed
`McpUiStyleVariableKey` union has ~65 keys. The number was never
authoritative — just a count from an earlier review.

#### Corrections

- Font embedding assumption corrected (again) — user had to correct
  this a third time. Web fonts use `@import`, not WOFF2 downloads.
  Saved as feedback memory. Plan and risk assessment updated.
- "Single callback slot" carried forward from session 2026-04-06c
  napkin into distilled.md without verification against source. Must
  correct distilled.md entry.

#### New artefacts

- `.agent/plans/sdk-and-mcp-enhancements/active/ws3-mcp-apps-sdk-audit.plan.md`
  — 5 bad assumptions, 16 opportunities, all immediate priorities
