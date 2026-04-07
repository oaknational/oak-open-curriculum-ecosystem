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

### Session 2026-04-06g — Pre-implementation adversarial review

#### Surprises

**S1: Plan accent was #222222 — real Oak uses oakGreen #287C34.**
Expected: accent = #222222 (plan's original design direction).
Actual: Oak-Web-Application `default.theme.ts` uses oakGreen (#287C34)
as the primary interactive colour (buttons, links). #222222 is Oak's
text colour (they call it "black"). Mint (#bef2bd) is the signature
surface. This corrects the earlier napkin entry S5 from session
2026-04-06c which incorrectly said "Oak brand green is mint, not
#287C34" — both are correct, they serve different roles.

**S2: Focus ring on mint FAILS, not marginal.**
Expected: sky-600 on mint-300 ≈3.1:1 (plan's estimate, marginal).
Actual: design-system-reviewer computed ~2.79:1 using WCAG luminance
formula. Falls below the 3:1 non-text threshold. The build pipeline
would have rejected this. Resolution: new `focus-ring-on-accent`
semantic token using oakGreen (#287C34, ~3.96:1 on mint).

**S3: `openLinks` is plural — SDK throws without capability.**
Expected: capability key `openLink` (singular, matching the method).
Actual: `McpUiHostCapabilities` defines `openLinks` (plural). And
the SDK's internal `assertCapabilityForMethod` throws (not returns
error) if the host lacks the capability. Pre-checking is mandatory.

**S4: SDK bridge creates reverse dependency if in token build.**
Expected: token build pipeline emits SDK variable bridges (plan §1.7).
Actual: Barney identified this as a boundary violation. The design
token package (`packages/design/`) is infrastructure — it must not
know about app-layer protocols. The bridge belongs in `widget/src/
index.css` as static CSS. Zero build complexity, correct direction.

**S5: Font weight naming mismatch.**
Expected: `weight-regular` (400) and `weight-semibold` (600).
Actual: Oak uses Lexend at 300 (light) and 700 (bold). Using
"regular" for 300 and "semibold" for 700 violates CSS conventions.
Renamed to `weight-light` and `weight-bold`.

**S6: Oak button hover uses drop-shadow, not colour shift.**
Expected: buttons have a darker background on hover (standard pattern).
Actual: Oak-Web-Application uses `box-shadow` effects for hover
(`8px 5px 13px 1px #0b4413` for green buttons). We use a colour
variant (oak-green-600 #22692C) as a pragmatic token-system equivalent.

#### Corrections

- Plan completely reworked: accent from #222222 to oakGreen #287C34,
  ink-950 untouched, new oak-black token, SDK bridge relocated,
  focus ring fix, font weight rename, 28 findings resolved.
- Napkin entry S5 from 2026-04-06c was misleading — corrected above.
- "Design decisions confirmed" from session 2026-04-06c now outdated:
  accent is oakGreen, not #222222. Plan is authoritative.

#### Patterns to Remember

- **Pre-implementation adversarial review catches more than
  post-implementation review.** 5 reviewers found 28 issues before
  any code was written. The most valuable: focus ring arithmetic
  (would have caused build failure), SDK capability key pluralisation
  (would have caused runtime throw), and boundary violation in token
  build (would have created wrong dependency direction).
- **Brand assumptions need verification against source code, not
  memory.** The plan carried forward a design direction (#222222
  accent) that was plausible but wrong. Extracting real values from
  Oak-Web-Application's `default.theme.ts` resolved 3 blocking
  findings in one step.
- **Reviewer sign-off gates prevent wasted implementation effort.**
  Two review rounds with 5 specialists is not overhead — it's the
  cheapest place to find design errors.

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

---

### Session 2026-04-07a — P1 branding execution + dark theme rebrand

#### Surprises

**S1: Dark theme gold accent was not Oak brand identity.**
Expected: sun-300/sun-400 (golden yellow) was an acceptable dark mode
accent. Actual: User directed that Oak's identity is green in ALL
themes. Gold was a placeholder. Dark theme accents replaced with
oak-green-300 (#78c85a, logo green family) and oak-green-200 (#8ad46c).

**S2: Dark surface-accent should be old Oak Green #008237.**
Expected: green-700 (#2a5c3a) was the right dark accent surface.
Actual: User wanted brand resonance — the original Oak Green from
the earliest sites (#008237) as a callback. This required changing
the dark focus-ring-on-accent from sky-400 (2.29:1, FAILS) to
paper-050 (white, 4.78:1, passes).

**S3: #69be4b (original logo green) fails 4.5:1 on ink-800.**
Expected: #69be4b (7.10:1 on ink-950) would be the dark accent.
Actual: on ink-800 (#31465f, panel background) it's only 4.17:1 —
fails text contrast. Adjusted to #78c85a (4.70:1 on ink-800).

**S4: dev:basic-host fundamentally requires bun.**
Expected: npm install + npm run dev would work. Actual: The
ext-apps basic-host serve.ts uses `bun --watch serve.ts` — hard
dependency. Also, npm install must run at repo root (workspace),
not in examples/basic-host/.

**S5: Portability check fails on vendor skill adapters.**
Pre-existing: 4 MCP Apps SDK skills in `.agents/skills/` have
Codex adapters but no canonical counterparts in `.agent/skills/`.
They were auto-installed by `npx skills add`. The portability
validator expects every adapter to have a canonical source.

**S6: Existing BrandBanner tests proved behaviour, not implementation.**
Expected: SVG path replacement would require test updates. Actual:
all 5 tests verify text, link, aria-hidden, click handler, and
landmark — none assert SVG path content or viewBox. Tests survived
unchanged. Good test design.

#### Corrections

- Dark palette: removed sun-300/sun-400/paper-200, added
  oak-green-300 (#78c85a), oak-green-200 (#8ad46c), changed
  green-700 to #008237.
- Dark semantic: accent and accent-strong now reference green family
  instead of gold. focus-ring-on-accent uses paper-050 on dark
  (sky-400 fails on #008237).
- Dev scripts: dev:widget has port conflict detection with PID/command
  output. dev:basic-host checks for bun, runs npm install at repo root.
- Hex case normalised: #287C34→#287c34, #22692C→#22692c (reviewer).
- Stale "fern" description in dark semantic.dark.json fixed (reviewer).
- Accessibility: added visually-hidden new-tab warning (G201) and
  forced-colours focus ring (reviewer).
- focus-ring-on-accent component token added (reviewer).

#### Reviewer pass (5 specialists, all clean after fixes)

- react-component: WELL-STRUCTURED, no findings
- design-system: COMPLIANT, 2 findings fixed (hex case, stale desc)
- code-reviewer: APPROVED, 2 findings fixed (same as design-system)
- accessibility: NO VIOLATIONS, 2 best-practice gaps fixed
- architecture-barney: COMPLIANT, paper-200 removed per observation

---

### Session 2026-04-07b — Dev DX fixes + theme rework

#### Surprises

**S1: Vite dev server blank page — widget HTML was `mcp-app.html`.**
Expected: `http://localhost:5173/` would show the widget. Actual:
blank page with no errors. Root cause: the HTML entry was named
`mcp-app.html`, but Vite only auto-serves `index.html` at `/`.
The `rollupOptions.input` only controls the build, not dev serving.
Fix: renamed to `index.html`. Updated 8 active plan files, 3 agent
docs, register-resources.ts, and README.

**S2: Token edits invisible in dev server — cross-workspace boundary.**
Expected: editing design token JSON would live-reload in the widget.
Actual: no change. The widget imports the *built* `dist/index.css`
from the tokens package. JSON source changes do nothing until
`tsx src/build.ts` runs. Fix: custom Vite plugin (`oak-design-tokens-watch`)
watches `packages/design/oak-design-tokens/src/tokens/` and triggers
`pnpm --filter @oaknational/oak-design-tokens build` on change, then
sends `full-reload` to the browser.

**S3: Token build contrast check blocks CSS generation.**
Expected: dev iteration on colours. Actual: contrast violations
throw, producing no CSS — dev server shows stale styles.
Fix: `OAK_TOKEN_DEV=1` env var makes violations warnings, not
errors. CSS still generated. CI build does not set this flag.

**S4: `data-theme` attribute overrides CSS media query.**
Expected: `@media (prefers-color-scheme: dark)` + inline JS would
handle theme switching. Actual: the inline script eagerly set
`data-theme="light"` on page load, and the `[data-theme='dark']`
CSS selector could never win because the attribute was stuck on
`light`. Investigation of user's 3 other repos (Astro, Next.js)
confirmed the pattern: in auto mode, do NOT set `data-theme` —
let the CSS media query govern. Only set the attribute when the
user or host explicitly overrides.
Fix: removed the inline script entirely. Added
`@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { ... } }`
to the generated CSS. Dark mode now works CSS-only.

**S5: Light theme accent (green links on mint bg) fails WCAG.**
Expected: oakGreen (#287c34) as link colour on mint-300 (#bef2bd).
Actual: 4.13:1 — fails 4.5:1 for text. Checking the Oak website
screenshot confirmed: on mint sections, links use dark text (#222),
not green. Green is only on white backgrounds. Fix: light `accent`
changed to `oak-black`, matching Oak website pattern.

**S6: basic-host genuinely requires bun.**
Expected: the bun gate in `dev:basic-host` might be unnecessary.
Actual: thorough investigation confirmed bun needed for (a) root
`npm install` triggers `prepare` → `build` which invokes bun via
`scripts/run-bun.mjs`, and (b) `serve` script runs
`bun --watch serve.ts`. The actual serve.ts is pure Node/Express
(even has `#!/usr/bin/env npx tsx` shebang), but the npm scripts
require bun. Updated error message with install instructions and
`dev:widget` as alternative.

#### Corrections

- Dark `surface-page` changed from `ink-950` (#102033) to
  `green-700` (#008237) — user directed this is Oak brand identity
- Light `surface-page` changed from `paper-050` to `mint-300`
  (#bef2bd) — matching Oak teacher landing page
- Light `accent` changed from `oak-green-500` to `oak-black` —
  dark links on mint, matching Oak website
- Light `focus-ring` changed from `sky-600` to `oak-green-500` —
  sky fails on mint
- Dark accent tokens reworked: white text/accents on green-700 page
- `accent-strong` text contrast pairings removed (hover-only state)
- `text-primary` on `surface-accent` pairing kept (not `text-inverse`)
- Dark `surface-accent` changed to `oak-green-600` for text contrast
- `banner-link-color` component token: `accent` → `text-primary`

#### Patterns to Remember

- **CSS media query is the foundation; JS is the override.**
  `@media (prefers-color-scheme: dark)` works without JavaScript,
  without attributes, without React. The data-theme attribute should
  only be set by explicit user/host choice, never eagerly on load.
  Three user repos confirm this pattern independently.

- **Cross-workspace dev loops need explicit plumbing.**
  Vite HMR works within one workspace. When CSS depends on a built
  artefact from another package, edits to the source are invisible.
  A Vite plugin that watches + rebuilds + sends full-reload bridges
  the gap without requiring a separate terminal.

- **Contrast violations should warn in dev, fail in CI.**
  Iterating on colour schemes is impossible when the build throws
  on every contrast failure. A dev-mode flag that generates CSS
  despite violations (with prominent warnings) enables visual
  iteration while preserving the CI quality gate.

---

### Session 2026-04-07a — Initial review of `reference-local/eef-data`

#### What Was Done

- Reviewed `.agent/reference-local/eef-data` as a gitignored reference lane
  using explicit `find`/`rg -uu`-style discovery rather than default file
  search.
- Checked packaging metadata, default data-file resolution, and core query
  behaviour with small local Python probes.

#### Patterns to Remember

- Gitignored reference folders can look empty if searched with default ignore
  settings. Use explicit sweeps before concluding a lane only contains README
  docs.
- For standalone reference packages, check `pyproject.toml` entry points and
  wheel package paths against the actual on-disk layout first. It is a fast way
  to catch "README install command cannot possibly work" failures before doing
  heavier setup.
- Data-loader assumptions are easy to drift from packaging rules. In this lane,
  the default lookup path and the declared shared-data install path point to
  different places, so startup depends on `EEF_TOOLKIT_DATA` even though a JSON
  file ships beside the code.
