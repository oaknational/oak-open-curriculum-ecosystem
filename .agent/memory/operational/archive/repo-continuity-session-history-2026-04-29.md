# Repo Continuity — Archived Session History (2026-04-29)

This file preserves session-close summaries and incremental refresh entries
that were rotated out of the live `repo-continuity.md` during the 2026-04-29
deep consolidation pass run by Nebulous Illuminating Satellite.

The companion archives at
[`repo-continuity-session-history-2026-04-22.md`](repo-continuity-session-history-2026-04-22.md),
[`repo-continuity-session-history-2026-04-26.md`](repo-continuity-session-history-2026-04-26.md),
and
[`repo-continuity-session-history-2026-04-28.md`](repo-continuity-session-history-2026-04-28.md)
hold older history.

---

## Incremental refresh entries archived from the 2026-04-29 pass

### Prior refresh — 2026-04-29T~13:10Z (Verdant Regrowing Pollen)

`claude-code` / `claude-opus-4-7-1m` / `b3812b` — long-arc session unblocked
the Vercel release pipeline. Original failure on `dpl_9CmqChJi9Y3KA8DmAHSX8XvEyTn6`
(release commit `171a94fd` for v1.6.0): pnpm refused to parse a multi-document
`pnpm-lock.yaml`, fell back to npm-registry fetches, hit Node 24.x's
`URLSearchParams` strictness change as `ERR_PNPM_META_FETCH_FAIL`. Commit `a34f8402`
(this session) regenerated a clean single-document lockfile; Vercel preview now
passes (`dpl_GMwYNx3AojnVx7o3gGM2n3SMWeFm` and onwards) on PR #90.

Branch `fix/build_issues` consolidated work from multiple agents/sessions
(intended squash-merge): 12 author-commits from this session + 2 from owner
bundling; PR #90 is open against `main` with a comprehensive description.
ADRs landed: 166 (architectural budget system), 167 (hook-execution-failure
visibility), 168 (TS6 baseline + workspace-script architectural rules). TS6
plan archived to `archive/completed/`. Sonar partial fixes landed in `16743c69`;
~30 Sonar issues remain pending (mechanical: replaceAll, String.raw, sort
callbacks, negated-condition flips, startsWith). Open next-session work:
zero Sonar issues, resolve PR review comments + Cursor Bugbot findings,
investigate `.github/workflows/ci.yml` reference to a removed `.mjs` script,
owner manual MCP server validation, then merge. **Critical falsifiability
note for next session**: lockfile-corruption hypothesis was confirmed by Vercel
preview pass, not just by local gate green.

### Prior refresh — 2026-04-28T~15:30Z (Abyssal Cresting Compass)

`claude-code` / `claude-opus-4-7-1m` / `6efc47` — PR-87 Phase 2.0.5 keyGenerator
cure landed (a7ce1a39); doc alignment landed (d3e86fd1); PR-87 mega-plan
archived and superseded by one-page CodeQL-only plan (d6693239). Mid-session
re-classification of FIND-001/002 from MUST-FIX → HARDENING after Vercel
docs verification — cure is defence-in-depth + configuration-drift insurance,
not exploit closure. Owner-directed plan reset: scope-lock to CodeQL only;
defer Sonar to a separate plan. Owner-flagged hypothesis at session close:
the 1,680-file / +167k-line PR diff may be triggering CodeQL stale-instance /
skip-by-size behaviour — fresh session probes that BEFORE writing structural
cures.

### Incremental refresh — 2026-04-28 (Coastal Mooring Atoll)

`codex` / `GPT-5` / `019dd3` — owner-requested deep consolidation pass.
Historical continuity summaries are archived, PR-87 is homed in-repo,
disposition-drift doctrine is graduated to PDR-018, and principles /
collaboration-state fitness pressure is structurally reduced. Fresh Mossy
identity-plumbing work remains under its own claims.

### Incremental refresh — 2026-04-28 (Mossy Creeping Branch)

`codex` / `GPT-5` / `019dd3` — Codex session identity plumbing implemented
and validated, then propagated into the plan, thread record, repo-continuity,
ADR-125, ADR-165, PDR-024, PDR-027, PDR-029, and PDR-035. Narrow follow-on
to the Coastal consolidation pass.

### Incremental refresh — 2026-04-28 (Glassy Ebbing Reef)

`codex` / `GPT-5` / `019dd3` — Cloudflare MCP public-beta security and
token-economy planning was preserved, commit-gate doctrine was strengthened
per owner correction, and the final handoff confirms no new
deep-consolidation trigger beyond the committed doctrine.

### Incremental refresh — 2026-04-28 (Coastal Mooring Atoll lightweight)

`codex` / `GPT-5` / `019dd3` — lightweight handoff after the Codex identity
plan archive. The remaining archive claim is closed, the handoff-time napkin
overflow was rotated by Mossy Creeping Branch, and current strict-hard
fitness is soft-only again.

### Incremental refresh — 2026-04-28 (Luminous Waning Aurora)

`cursor` / `composer` / `dde6be` — `/jc-session-handoff` after
investigation-only work: oak-preview MCP curriculum probes, Sentry MCP
preview/error correlation, ADR-163 release-id story confirmed against live
aggregates, OAuth proxy `429` + unconditional `.json()` root cause captured
for `handleToken`. No working-tree edits.

### Incremental refresh — 2026-04-29 (Nebulous Weaving Dusk)

`codex` / `GPT-5` / `019dd7` — architectural budget planning pass landed in
docs/plans: ADR-166 created and tightened, parent/visibility/enforcement
budget plans added, the directory-cardinality plan rewritten as the
`max-files-per-dir` child, and roadmap/index references reconciled.
Validation passed for root markdownlint and scoped `git diff --check`.
Aggregate build/check gates not claimed because concurrent TS6/build
migration work was active on `fix/build_issues`.

### Incremental refresh — 2026-04-29 (Verdant Swaying Fern)

`claude` / `claude-opus-4-7` / `c34d50` — TS6 migration mid-flight on
`fix/build_issues`, moved to fresh session per owner direction after
recurring mistake-pattern accumulation (sed-bypass of Read-then-Edit
safety, captured as napkin Surprise 5). Tasks #1–#8 done and verified by
green build, type-check, test, and knip; Tasks #9 (ADR-167 authoring) and
#10 (final quality-gate sweep + release-readiness review) pending. ~170
uncommitted files in working tree; owner-recommended 7-commit landing
shape documented in the plan. New patterns landed:
`hook-as-question-not-obstacle`; `ground-before-framing` extended with
2026-04-29 evidence; napkin skill amended with "Never Hold Back Insight to
Fit a Budget" rule. Owner-directed architectural rules captured:
workspace-to-root-script ban, all-TypeScript-scripts with dedicated
no-compile-no-deps directory exception (currently
`apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/` for the
vercel-ignore script). Open question: vitest-config-base coupling (19
workspaces import `../../../vitest.config.base`) — same shape as the script
ban but for configs.

### Incremental refresh — 2026-04-29 (Ethereal Illuminating Comet)

`claude-code` / `claude-opus-4-7-1m` / `05f2e9` — small-scope test deletion
on `fix/build_issues`: removed
`packages/sdks/oak-sdk-codegen/e2e-tests/scripts/zodgen.e2e.test.ts` plus
stale `test-cache/zod-out/`. Test was a misclassified e2e (in-process
function call), violated "do not test types", duplicated existing unit +
integration coverage. Verified `pnpm test` 855 passed, `pnpm test:e2e` 8
passed, `pnpm type-check` clean. Owner-flagged process anomaly for separate
investigation: this session ran without `/rename`, without joining a
thread, without registering an active claim, without writing to
`shared-comms-log.md`. Captured as pending-graduations candidate
(small-work bypass of coordination surfaces). **Post-handoff landings**:
diagnosed and fixed silent `sonar-secrets` PreToolUse:Read hook failure
(relative path resolved against shell cwd after `cd packages/sdks/oak-sdk-codegen`,
exit 127, no visibility because the hook is non-blocking). Fix: registered
hook commands in `.claude/settings.json` rewritten to use
`${CLAUDE_PROJECT_DIR}` dynamic paths; new wrapper at
`.claude/hooks/_lib/log-hook-errors.sh` persists non-zero hook exits to
`.claude/logs/hook-errors.log` (gitignored). Authored ADR-167. Owner caught
wording mistake: initial Decision §2 said "absolute path" — reframed to
"dynamic path rooted at platform-provided project-root variable" with
explicit rejection of both bare-relative and literal-absolute shapes.

---

## Deep Consolidation Status entries archived from the 2026-04-29 pass

### Squally Diving Anchor handoff (2026-04-29)

**Completed this handoff** — owner requested session handoff plus a light
consolidation pass around the sector-engagement changes, not a full
repo-wide convergence run. Bounded consolidation landed impact framing in
sector-engagement/README.md and roadmap.md, created the sector-engagement
thread record, captured the owner-requested PR Lifecycle Skill future plan.
ADR scan: no new host ADR qualifies from the taxonomy work alone. PDR-shaped
candidate: PR lifecycle governance may need portable Practice doctrine after
the skill is exercised on a real PR. Entry-point sweep: CLAUDE.md, GEMINI.md
remain pointer-only; AGENTS.md retains pre-existing RULES_INDEX pointer.
Fitness disposition: critical pressure remained in napkin.md and
repo-continuity.md (now addressed in Nebulous's 2026-04-29 deep pass).
Constraint: owner requested a light consolidation around this session's
changes while the PR #90 landing lane was active under a separate claim.

### Verdant Swaying Fern handoff (2026-04-29)

**Not due** — owner directed lightweight handoff to a fresh session before
further TS6/build-infrastructure work, citing recurring sed-bypass mistake
pattern. Tasks #1–#8 of TS6 plan landed and verified; Tasks #9 (ADR-168
authoring) and #10 (final quality-gate sweep + release-readiness review)
were owner-explicit next-session work. Two new pending-graduations register
entries added: ADR-168 candidate (TS6 + workspace-script rules);
pattern-or-PDR candidate for "tool-error-as-question" meta-pattern. Five
napkin Surprises captured. **No thread touched** — work was
branch-fix-bound, not thread-bound; the plan file was the durable
continuity carrier.

### Ethereal Illuminating Comet final handoff (2026-04-29)

**Not due** — combined session (test deletion + silent-hook fix + ADR-167)
landed three pending-graduations candidates and one new ADR; portable
generalisation deferred to a future session and a future second-platform
implementation per PDR-009. Three new pending-graduations entries:
small-work coordination-skip; test misnaming as exemption; hook-failure
visibility canonical contract. Three napkin Surprises captured.

### Nebulous Weaving Dusk handoff (2026-04-29)

Not due — the ADR-shaped decision from this session was created directly as
ADR-166 and then amended before handoff. Planning surfaces and ADR/index
links validated; no unhomed ADR/PDR candidate, entrypoint drift, or
repeated surprise required `jc-consolidate-docs`.

### Coastal Mooring Atoll deep pass (2026-04-28)

Completed the deep pass that was explicitly requested to preserve usefulness
rather than make numbers smaller. Homed PR-87 stance and sequencing into the
in-repo plan, graduated disposition-drift doctrine into PDR-018, extracted
problem-hiding examples to governance docs, moved collaboration-state field
provenance to lifecycle guidance, applied this file's archive split strategy.

ADR/PDR scan: no new host ADR was required. Generated-code responsibility
and no-shim doctrine already covered by existing surfaces; the newly due
Practice-governance item graduated as a PDR-018 amendment with a PDR-029
tripwire cross-reference. Pattern scan: absolute-git-binary and
vendor-control-disposition remain pending candidates.

ADR-144 critical post-mortem for repo-continuity at the time: earlier
soft/hard zones did fire, but repeated handoff additions preserved useful
evidence without applying the archive split. The hard limit remains correct
because the file is a live index, not a historical log. The breach was a
symptom of delayed archival, not missing product architecture documentation.

### Glassy Ebbing Reef final handoff (2026-04-28)

Not due — owner correction about `.agent` shared state and whole-repo
commit gates already landed in doctrine via `7c589a0a`; no additional
ADR/PDR candidate, entrypoint drift, or repeated surprise.

### Coastal Mooring Atoll lightweight handoff (2026-04-28)

Not due — handoff-time active napkin hard-fitness spike was immediately
rotated by Mossy Creeping Branch into napkin-2026-04-28-current-overflow.md.
strict-hard fitness was soft-only again.

### Luminous Waning Aurora handoff (2026-04-28)

**Not due — investigation-only session** (no plan closure, napkin
Surprise capture only, no consolidate-docs hygiene gap beyond thread +
continuity refresh).

### Choppy Lapping Rudder owner-directed (2026-04-28T~12:50Z)

**Due — owner-directed move to fresh session.** Owner explicitly invoked
`/jc-consolidate-docs` after `/jc-session-handoff` so this session's
graduation candidates and convergence work happen now before the fresh
session opens. New pending-graduations candidates: CLI ergonomics +
cross-thread request/response correlation + stance-staleness mitigation +
protocol-experience pattern.

ADR/PDR candidate scan surfaced two candidates recorded in the register
rather than promoted: stance-staleness mitigation (single-instance evidence)
and pre-phase-adversarial-review-expands-cluster-scope (possible
second-instance evidence in Wilma's PATH-defence expansion).

Practice Core review: no qualifying candidate this pass. The two candidates
above belong in `agent-collaboration.md` (host directive) or as ADR-150
amendments rather than the portable Practice Core. Practice exchange box:
empty incoming; no outgoing substance to home.
