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
