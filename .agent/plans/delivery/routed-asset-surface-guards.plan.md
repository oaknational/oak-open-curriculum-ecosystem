---
id: routed-asset-surface-guards
node_type: delivery
name: "Routed-asset surface guards: authoring-time lint + published-CSS assertion"
overview: "Make the MCP-509 defect class unrepresentable with a green suite: an ESLint rule catches root-relative asset literals at authoring time with an agent-friendly message, and a copy-step assertion closes the scrape-invisible CSS half."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - served-surface
  - practice-and-estate
tickets:
  - MCP-510
depends_on: []
owner_gates: []
last_updated: 2026-08-06
---

# Routed-asset surface guards: authoring-time lint + published-CSS assertion

## Goal

A root-relative first-party asset reference — the class that broke the
canonical landing page (MCP-509) — cannot reappear with a green suite,
and an author (human or agent) who writes one learns the mechanism,
the consequence, and the cure at lint time, not in production.

## Mechanism

Two guards, split by instrument reach, because the defect class has
two homes and no single tool sees both:

1. **ESLint rule `no-root-relative-asset-paths`** in
   `@oaknational/eslint-plugin-standards`
   (`packages/core/oak-eslint/src/rules/`), following the plugin's
   existing conventions: `createMessage` /
   `RuleWithReappraisingMessages` for the agent-friendly message,
   registration via `oakRuleModules` in `src/plugin.ts`, a
   `.unit.test.ts` suite on the shared RuleTester (JSX cases pass
   `filename: 'file.tsx'` per case — the shared tester's default
   filename does not parse JSX, and the tester itself is out of scope
   here), and a row in the plugin README's per-rule table.

   **Detection predicate**: in JSX `href`/`src` attributes on
   subresource-bearing elements (`link`, `img`, `script`) and in
   exported path constants — a string literal that starts with `/` is
   an error, and so is a template literal whose leading static text
   starts with `/` (protocol-relative `//` exempt in both cases).
   Nothing else is. The check reads the COOKED
   value (`quasis[0].value.cooked`), never the raw source spelling: an
   escaped leading slash (`\u002F`, `\/`) cooks to `/` and must still
   fire, and the RuleTester suite carries an escaped-leading-slash
   case proving it (suppressed Copilot finding on PR #795, adopted).
   An expression-led template (the live pattern:
   `` `${OAK_DS_BASE}/styles.css` ``) is by construction not a
   root-relative literal and needs no special clause; the rule never
   names app identifiers (no app knowledge in the estate-wide
   plugin).

   **Arming**: in the app's `eslint.config.ts` by `files` glob over
   `src/landing-page/**` and `src/app/**` (the config already arms
   rules this way), with `src/app/static-asset-paths.ts` excluded —
   it is the single home of the base constant and necessarily
   contains the one legitimate root-relative literal.

   **No options schema** (`schema: []`, as most of the plugin's rules
   ship): the repository currently has zero in-scope literals needing
   an allowlist — the only `/.well-known/` literal sits on an
   `<a href>`, which is out of scope by design. Options arrive with
   the first real exception, not before.

   **Alternative recorded**: the app config already carries
   `no-restricted-syntax` esquery guards of this class (the MCP-187
   widget-URI pair), which could express the predicate with no new
   plugin surface. The custom rule wins deliberately: the branded
   reappraisal-direction message (mechanism, consequence, cure —
   PDR-044 register), RuleTester coverage including the exact message
   text, and a named rule identity that survives config refactors.

2. **Published-CSS assertion** inside the existing `@import`-closure
   walk in
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/copy-oak-ds.integration.test.ts`:
   one leading-`/` check on BOTH reference classes the walk already
   collects — `url(...)` targets (`collectUrlReferences`) AND
   `@import` targets (`collectImportClosure`), since a bare
   root-relative `@import '/assets/x.css'` rides the same
   normalisation and would otherwise stay green (Copilot review
   finding on this PR, adopted) — each check BEFORE `resolveRelative`.
   Protocol-relative `//` targets are not merely exempt from the
   root-relative check: they are SKIPPED AS EXTERNAL before resolution
   in both classes, and the suite proves it — today's collectors would
   otherwise manifest-check `url(//cdn/…)` as a local path and queue
   `@import '//cdn/…'` as a package file (suppressed Copilot finding
   on PR #795, adopted). The walk is extended to cover the
   tracked `public/landing-page.css` via the existing helper, with a
   non-empty-corpus assertion so an absent build output can never
   read as a pass. Placement justification, verified at plan-author
   time: `resolveRelative` does
   `path.join(path.dirname(sheet), target)`, which NORMALISES a
   root-relative `url('/assets/…')` into a relative path the manifest
   covers — the existing assertion passes green on the exact defect
   this guard exists to catch. This is the half no HTML scrape can
   see and ESLint cannot parse.

Division of labour with the guards PR #794 already landed: the by-tag
rendered-page test remains the enforcement of record for markup; the
lint rule adds authoring-time feedback; the CSS assertion is the
enforcement for the scrape-invisible half. None substitutes for
another.

Convention verification (at plan-author time, re-verified by
independent review): plugin rule shape, shared RuleTester, message
helper, and flat-config `files`-glob arming all confirmed against the
live tree; the published-CSS corpus confirmed currently clean, so the
assertion lands green with a red synthetic fixture proving it bites.

Precondition (landed): PR #794 merged 2026-08-06 (tip `SHA:dd6aff00a`,
merge `SHA:cf954e6c`) — `ROUTED_ASSET_BASE` exists on main at
`src/app/static-asset-paths.ts`. The pickup seat branches from a base
containing it (main; note the 2026-08-06 coordination branch predates
the merge). Internal detail and pickup state ride MCP-510.

## Acceptance criteria (each with a proof — required)

1. The rule rejects a root-relative string literal and a
   root-relative-leading template literal in scope — including the
   escaped-leading-slash spellings (`\u002F`, `\/`), which cook to `/`
   and must fire — and accepts the expression-led derived form — proof
   `repo-safe`: RuleTester unit tests in the plugin (JSX cases under a
   `.tsx` filename), including the exact message text and the
   escaped-leading-slash case.
2. The rule is armed for the app's `src/landing-page/**` and
   `src/app/**` (minus `static-asset-paths.ts`) and the repository
   lints green — proof `repo-safe`: the lint gate in pre-commit/CI.
3. The walk assertion fails on a synthetic root-relative `url(/…)`
   fixture AND on a synthetic root-relative `@import '/…'` fixture,
   skips protocol-relative `//` targets as external in BOTH reference
   classes, passes on the real published corpus, and fails on an empty
   corpus — proof `repo-safe`: the integration test's two red-fixture
   cases, the two protocol-relative-skipped cases, the green-corpus
   case, and the non-empty case.
4. The change introduces zero new Sonar issues — proof `repo-safe`:
   the SonarCloud PR analysis (estate bar, owner word 2026-08-06:
   zero new issues; the configured gate threshold is not the bar).

## Todos

- One single-story PR (default round budget, PDR-132): the rule + its
  `.unit.test.ts` suite (including the escaped-leading-slash case) +
  the plugin README table row + the app lint-config arming + the
  walk assertions on BOTH reference classes (`url(...)` AND
  `@import`, each with its red fixture, plus the
  protocol-relative-skipped-as-external proof). The two guards ship
  together because each is small and they share one story — "the
  routed-asset surface cannot silently regress."

## Out of scope

- Stylelint adoption — one CSS assertion does not warrant a new
  toolchain.
- Widening the rule beyond the MCP app — no other workspace serves
  through a path-scoped edge rule; generalise at the second consumer.
- Guarding `<a href>` destinations — links are destinations, not
  subresources; PR #794's review records why.
- Rule options / allowlist machinery — zero current in-scope
  exceptions exist; options arrive with the first real one.
- Editing the shared RuleTester for JSX — per-case filenames suffice;
  the tester is estate-wide surface, unscoped here.
- Changing the Cloudflare edge rule — ruled out in MCP-509 itself.
