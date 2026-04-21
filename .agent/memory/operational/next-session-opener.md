# Next-Session Opener — §L-8 Vercel preview smoke + WS4/WS5 rollout

**Authored**: 2026-04-21 session close after the §L-8 WS1+WS2+WS3.1
atomic landing (`f9d5b0d2 feat(mcp-http): §L-8 esbuild-native build
via @sentry/esbuild-plugin`). Three branches: 31 files changed, +1328
/-1376; tsup → raw esbuild + `@sentry/esbuild-plugin`; 953-line L-7
orchestrator + `upload-sourcemaps.sh` + `tsup.config.ts` deleted; 24
new tests pass; 639/639 total tests pass; type-check + lint + format
+ knip + depcruise + markdownlint clean.
**Consumed at**: next session open.
**Lifecycle**: delete on session close once its landing target has
been reported (per PDR-026); rewrite if the landing target needs
re-stating for a further session.

---

## Impact (metacognition lens)

§L-8 closed the *implementation* surface for esbuild-native Sentry
release/source-map/deploy linkage. The *operational* surface is
still unproven — the `@sentry/esbuild-plugin` configured by
`createSentryBuildPlugin` runs only when Vercel's build env exposes
`VERCEL_ENV` + `VERCEL_GIT_COMMIT_SHA` + `VERCEL_GIT_REPO_SLUG` AND
`SENTRY_AUTH_TOKEN` is wired into the Vercel project env. Until a
preview build proves the boundary read works end-to-end, §L-8's
contribution to "errors attributed to release, tool context, and
request state, with runtime health visible" remains blocked.

The bridge from action to impact is two short steps:

1. **§L-8 WS1 acceptance probe** (next-session target): push the
   landed branch to a Vercel preview, observe the build log for the
   `[esbuild.config] Sentry plugin enabled: release=… env=…` line,
   confirm Sentry UI surfaces the expected Artifact Bundle + release
   + commits + deploy event for that build.
2. **§L-8 WS4/WS5 rollout** (after probe passes): production deploy
   on the next `semantic-release` version-bump commit; smoke-test the
   live MCP server through the Sentry UI.

After WS5, public-alpha Sentry integration's release-attribution lane
is complete and Phase 3a (L-1 + L-2 + L-3) becomes the next forward
lane.

## Landing target (per PDR-026)

State at session open:

> **Target**: §L-8 WS1 acceptance probe complete — Vercel preview
> build of `feat/otel_sentry_enhancements` produces the
> `[esbuild.config] Sentry plugin enabled: …` log line, AND the
> Sentry UI for `oak-open-curriculum-mcp` shows the resulting
> Artifact Bundle + release + commits + deploy event for that build.

Evidence to capture in the napkin or `repo-continuity.md` once
landed:

- Vercel preview deployment URL.
- The exact build-log line(s) from `esbuild.config.ts` (skipped or
  enabled, with release name + env).
- Sentry UI screenshot or `sentry-cli releases info <version>`
  output showing the registered release with `commit`, `deploy`,
  and Artifact Bundle.
- Confirmation that `dist/**/*.js.map` was deleted post-upload (per
  the plugin's `filesToDeleteAfterUpload`); deployed `.js` carries
  no `sourceMappingURL` comment (Sentry "hidden source-map"
  posture).

## Session shape

1. **Ground First** per `start-right-quick` steps 1–6 (directives →
   start-here ADRs → active memory → operational memory → plans →
   branch state). Read the 2026-04-21 napkin entries (top of file —
   four entries spanning 4th/5th/6th `inherited-framing` instances
   plus the perturbation-mechanism activation observation) before
   touching §L-8.
2. **Pre-flight**: confirm `SENTRY_AUTH_TOKEN` is set on the Vercel
   `poc-oak-open-curriculum-mcp` project for **all three**
   environments (production, preview, development). The probe needs
   it on preview; production deploy needs it for WS5; setting it
   once across the three is cheaper than touching the project twice.
   Authoritative location:
   <https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/settings/environment-variables>.
3. **Push the branch** (`feat/otel_sentry_enhancements`) to the
   remote. Vercel auto-builds the preview.
4. **Watch the build log** for one of:
   - `[esbuild.config] Sentry plugin enabled: release=<ver> env=preview`
     → expected; continue.
   - `[esbuild.config] Sentry plugin skipped: registration_disabled_by_policy`
     → unexpected on preview; the policy resolver thinks
     `registerRelease=false`. Inspect `VERCEL_ENV` +
     `VERCEL_GIT_COMMIT_REF` + the override pair before debugging
     deeper.
   - `[esbuild.config] Sentry build-plugin intent error: { kind: '<k>', … }`
     → boundary read failed. The `kind` discriminant tells you what
     was missing (auth token, release, commit SHA, repo slug, etc.).
     Fix the env var; re-push.
5. **Verify Sentry UI state** for the resulting release name (root
   `package.json` semver):
   - **Project Settings → Source Maps → Artifact Bundles** lists the
     bundle for the build commit's Debug IDs.
   - **Releases → `<version>`** shows `commits` linked to
     `oaknational/oak-open-curriculum-ecosystem@<sha>` and a
     `deploys` entry with `environment: preview`.
6. **Capture evidence** in the napkin (new entry under
   `2026-04-21 (open) — Vercel acceptance probe…`); update
   `repo-continuity.md § Next safe step` with the WS5 rollout
   trigger ("merge to `main` once the next semantic-release commit
   is ready").
7. **Delete this file** (PDR-026 landed-case discipline).

## Standing decisions (owner-beats-plan invariant protects these)

- **Build tool for the MCP app**: raw esbuild via
  `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
  (composition root) + `build-scripts/esbuild-config.ts` (pure
  factory). NOT tsup. NOT a bespoke wrapper. NOT an `.mjs` shape.
- **Plugin**: `@sentry/esbuild-plugin`, first-party, ADOPTED.
- **`vercel.json` `buildCommand` override**: REMOVED. Vercel runs
  the workspace's default `build` script.
- **L-7 bespoke orchestrator** (5 TS files + `upload-sourcemaps.sh`
  + `tsup.config.ts` + `apps/oak-search-cli/.sentryclirc`): DELETED
  by `f9d5b0d2`. Do NOT recreate.
- **`@sentry/cli` direct devDep**: DELETED from BOTH the MCP app
  AND `apps/oak-search-cli/`. The CLI now arrives only as a
  transitive dep of `@sentry/esbuild-plugin`; root
  `pnpm.onlyBuiltDependencies` allows its native build script under
  pnpm v10.
- **`packages/libs/sentry-node`**: re-exports `resolveGitSha` for
  the MCP-app composition root (added by `f9d5b0d2`).
- **ADR-163 §6 / §7**: amended 2026-04-21 from prescriptive CLI
  commands (HOW) to outcome statements (WHAT). The plugin is the
  mechanism; the §6.0–§6.6 outcomes are unchanged. Do NOT amend
  the ADR back to CLI prescriptions.

## Non-goals (do not re-open)

- Do NOT recreate the L-7 orchestrator, even if the probe surfaces a
  plugin behaviour gap. The vendor plugin is the canonical
  mechanism; gaps are vendor-issue work, not Oak-built workarounds.
- Do NOT add any `vercel.json` `buildCommand` override. Vercel's
  default `build` script invocation is load-bearing.
- Do NOT edit the unit tests authored in `f9d5b0d2` to assert vendor
  behaviour. Vendor proof lives in the Sentry UI screenshot from
  the probe, not in-process.
- Do NOT migrate any other workspace off tsup.
- Do NOT re-open the tsup-vs-esbuild decision.

## What's after this landing

- **§L-8 WS5 production rollout**: triggered automatically by the
  next `semantic-release` version-bump commit on `main` after the
  feature branch merges. The Vercel `ignoreCommand` ensures only
  version-bump commits run the production Build Command.
- **Phase 3a in parallel** (L-1, L-2, L-3): schema-independent;
  three small lanes that close public-alpha Sentry integration.
- **L-15 strategy close-out + L-EH final**: author
  `prefer-result-pattern` ESLint rule + first-tranche adoption.

## Pattern reminders

- `inherited-framing-without-first-principles-check` has now
  surfaced **six times** across this two-session window (4th, 5th,
  6th instances landed in the napkin on 2026-04-21). The three-clause
  first-principles check (test-shape, file-naming-vs-landing-path,
  vendor-API-literals) is the documented countermeasure. Run it
  before authoring anything prescribed by a plan body.
- **`passive-guidance-loses-to-artefact-gravity`** (new, single
  instance, 2026-04-21): the three-mechanism perturbation register
  installed 2026-04-20 evening did not fire on any of the 4th/5th/6th
  instances. Documented guardrails are watchlist items; **active
  tripwires** (rules / hooks / skills / pre-commit gates) are what
  actually prevent drift. Exploration queued for a later
  consolidation pass — do not pursue inline. See napkin top entry
  for the candidate-layer table and Heath brothers (Decisive ch. 9 /
  Switch ch. 8) framing.

## Session-close discipline reminder (PDR-026)

Close by either:

- **Landed** (probe passed, evidence captured): record the
  preview-deployment URL + Sentry UI evidence link; delete this
  file; rewrite a fresh opener for §L-8 WS5 + Phase 3a.
- **Unlanded** (probe failed, env var missing, plugin gap, etc.):
  record attempted / prevented / next-session-re-attempts in
  `repo-continuity.md § Next safe step`; rewrite the Target block
  above for the next session with the specific failure mode named.
