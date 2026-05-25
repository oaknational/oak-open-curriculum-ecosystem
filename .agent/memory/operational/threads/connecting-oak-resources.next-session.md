# Next-Session Record — `connecting-oak-resources` thread

## 2026-05-25 — Salty Mooring Dock / cursor / Composer / `dc4dd7` — PR #114 preview agent test checklist

**Intent**: manual black-box checklist (what / how / expected results) for preview
MCP validation in Cursor — not automated curl/npm probes.

**Doc**: [agent-preview-test-checklist.md](../../../apps/oak-curriculum-mcp-streamable-http/docs/agent-preview-test-checklist.md)

**Also on branch**: Sonar S5443 fix (`2f5e1871`); `.cursor/mcp.json` `oak-preview-1`
URL for education-evidence preview.

**Validated in Cursor** (same preview host): `get-curriculum-model`,
`get-changelog-latest`, `browse-curriculum`, `search`, `explore-topic`,
`get-subjects`, and related tools — usable data, no blocking 5xx.

**Next safe step**: work through checklist sections A–H on each new preview URL;
record pass/fail in PR notes.

---

## 2026-05-24 — Velvet Stalking Moth / cursor / Composer / `bde2f8` — PR #108 preview MCP black-box validation (owner-directed closeout)

**Landed**: PR #108 preview-deployment MCP server verified end-to-end via Cursor
`oak-preview-1` (25 tool calls; all returned usable data).

**Endpoint**:
`https://poc-oak-open-curriculum-mcp-git-feat-mcp-graph-support-f-a47d40.vercel.thenational.academy/mcp`

**Evidence exercised**:

- Orientation: `get-curriculum-model`, `get-rate-limit` (unlimited), `get-changelog-latest` (API **0.7.0**, 2026-05-21)
- Discovery: `browse-curriculum`, `get-subjects`, `get-subject-detail`, `get-key-stages`, `get-keywords`
- Search (all scopes): lessons (photosynthesis KS3 science), units (fractions maths), threads (maths, no query), sequences (`maths-secondary`), suggest (`photo` + science)
- Cross-scope: `explore-topic` (volcanoes + geography)
- Fetch: `subject:maths`, `lesson:photosynthesis`, `unit:mountains-and-volcanoes-what-where-and-why`, `thread:number-multiplication-and-division`
- Lesson depth: `get-lessons-summary`, `get-lessons-quiz`, `get-lessons-transcript`, `get-lessons-assets`
- Unit: `get-units-summary`
- Graph (feat-mcp-graph-support branch): `get-thread-progressions` (164 threads), `get-prior-knowledge-graph` (1,607 units / 3,452 edges), `get-misconception-graph` (12,858 misconceptions)
- Error path: invalid lesson slug → clean **"Lesson not found"** (no crash)
- Filter: KS4 higher-tier trigonometry search returned tier-tagged lessons

**Minor quirks (non-blocking)**: `search` suggest returns empty `url`; `fetch` thread units have `oakUrl: null`.

**Owner routing (2026-05-24)**: this session satisfies the **PR #108 preview MCP validation** requirement on the merge path and contributes to **M1 Safe Pause** completion criteria. Gate 1 SonarCloud + `run-quality-gates` remain the open blockers per [`practice-infrastructure-hardening-program.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/practice-infrastructure-hardening-program.plan.md) WS-7 (archived 2026-05-25; M1 Safe Pause achieved, PR #108 merged at `2462952a`).

**Commits**: none (read-only black-box validation).

---

## 2026-05-22 → 2026-05-23 multi-agent gate-1a substrate-floor team session — graph-stack work summary (first-out closeout: Secret Vanishing Wisp / `981cbe`)

This thread is the historical container for the graph-substrate work that
executes the active `eef` first-feature delivery. The 2026-05-22 → 2026-05-23
team session landed substantial graph-stack Round 1+2 substrate work; this
entry captures the graph-stack-specific commits + outstanding state. Full
team-session synthesis lives at
[`eef.next-session.md` § Session 2026-05-22 → 2026-05-23](eef.next-session.md).

**Graph-stack Inc.1a closure progress — Round 1+2 cycles landed**:

| Cycle | Commit(s) | Owner |
|---|---|---|
| WS3.3 graph-project adjacency status flip (substantive at `f4ca84f6` prior session) | `83179e11` | Foamy Fathoming Compass / `ecb459` |
| WS4.4 graph-core GraphView interface + T7a array-stop compile-time smoke-test (11 files, +540/-3) | `1fc5b491` (substantive) + `bf7fa545` (test-partition amendment) + `db5271af` (test-expert absorb) | Foamy Fathoming Compass / `ecb459` |
| WS2.2 graph-ingest jsonld-compatible + Turtle parsers + §invariant-2 contract (7 files; vendor-isolation boundary at `normalize-rdfjs.ts`; n3.js + jsonld.js deps) | `f58bcb80` (scaffold + deps) + `ce0abe26` (substantive) + `361cae35` (SVW-reciprocal absorb) | Sparking Melting Magma / `4cdb53` |
| WS2.3 source-path primitives (JsonPointer wrapper + quadKey canonical Quad-key + SourceLocation discriminated union; 32 unit tests) | `6cc7b339` (primitives) + `c03ace9b` (plan split into primitives + parser-integration follow-on) | Sparking Melting Magma / `4cdb53` |
| Push-blocker prettier-format cure on Sparking's WS2.3 + Turtle source files | `644c937b` | Secret Dimming Shade / `5a6e56` |

**Inc.1a outstanding**:

- **WS4.1 graph-corpus-sdk scaffold — LANDED at `3241893d`** (Stormbound
  Spiralling Breeze / `b8a5c9`, owner-directed ownership-override at 06:39Z
  2026-05-23 after Lunar silent ~10h since the `e1b9561e` COMMIT_EDITMSG
  incident). 14 files (+311 lines) preserving Lunar's substance unchanged
  with `Co-Authored-By: Lunar Illuminating Eclipse`; two pre-execution
  code-expert absorptions baked in (`src/index.ts` placeholder replaced
  with type re-exports of `GraphView` + `Result<T, E>` to make deps
  knip-visible and declare the consumer contract; `knip.config.ts`
  explicit `entry:` removed since knip auto-detects sub-path entries from
  package.json `exports`). Lunar's `355d2ddb` (workspace) + `15465f06`
  (git:index/head) claims closed at the same commit. Reciprocal
  post-execution code-expert verdict on `3241893d` (Sparking Melting Magma):
  APPROVE-WITH-SUGGESTIONS — no critical, 2 important (workspace-tier
  ESLint rule-name + root barrel comment vs sub-path empty stubs), 4
  suggestions; full verdict in comms stream.
- **WS2.3 parser-integration follow-on** — Sparking Melting Magma /
  `4cdb53` opened claim `9c163e1c` (ws2-source-map-parser-integration) at
  01:08Z 2026-05-23 but never authored. Multi-turn intent posted; session
  hit ceiling at 15+ cycles. Clean pickup for any agent: per-quad
  source-location attachment refactor across both WS2.2 parsers — JSON-LD-
  compatible needs a custom document walker (`jsonld.toRDF(...)` strips
  per-element provenance during the n-quads round-trip); Turtle needs n3.js
  StreamParser refactor (synchronous `parse(input, null)` callback exposes
  no per-quad line/column; StreamParser does). Parser return-type changes
  atomic per test-expert C4: both parsers return
  `Result<{ dataset, sourceMap }, ParseError>`. Plus §invariant-3 contract
  test (`packages/libs/graph-ingest/src/invariant-3-source-path-preserved.unit.test.ts`)
  - plan amendment flipping `ws2-source-map-parser-integration` status.

**Downstream blocked**:

- **WS4.5 EefStrandsGraphView adapter** (Foamy's natural next cycle) —
  **NOW UNBLOCKED** at `3241893d`. Foamy at session-end pacing pause (4
  commits landed this session).
- **t2-zod-loader** — **NOW UNBLOCKED** at `3241893d` (the
  `@oaknational/graph-corpus-sdk` import path is stable); still needs
  `packages/sdks/oak-curriculum-sdk/src/mcp/data/eef-toolkit.json` copy
  from the repo-held reference at
  `.agent/plans/sector-engagement/eef/reference/eef-toolkit.json`.
- **t6a-explore-tool** — still blocked on t2 + WS4.5.

**Pattern surfacings from this team session** (full enumeration at
`pending-graduations.md` 2026-05-23 first-out closeout entry):

- **Vendor-isolation boundary discipline** — Sparking's WS2.2 routes all
  n3.js + jsonld.js Terms through graph-core's `DataFactory` constructors
  via the new `normalize-rdfjs.ts` boundary module. The `Literal.direction:
  string | null` (n3 surface) is collapsed to graph-core's `'' | 'ltr' |
  'rtl'` at the boundary, documented as the RDF-1.1 surface graph-core
  commits to. Forward-compatibility note for RDF 1.2 base-direction lives
  at the change point. Pattern is the default for any future graph-ingest
  vendor-parser addition.
- **Honest-restructure-over-band-aid** — Foamy split WS4.4 graph-view/index.ts
  into 3 modules when it hit `max-lines: 250` ceiling, rather than compress
  to pass. Sparking deleted the binding test per `no-conditional-tests.md`
  doctrine, rather than use a file-existence guard.
- **Sparking architecture-expert-fred cross-cycle audit returned GO**
  on system-level cohesion across t1 + WS2.2 + WS2.3 (ADR-041 + ADR-108
  compliant per Sparking napkin entry at `a7134f82`).

---

## Cycle 10 LANDED at 2389ff5e (attribution-corrected) — Shaded, 2026-05-22T15:00Z

**Substance** (Cycle 10 / task #10 — stdout/launcher convergence): 2 bin files (`agent-tools/src/bin/commit-queue.ts` + `collaboration-state.ts`) converted from `.then/.catch` Promise chains to top-level try/await. Streaming-asymmetry preserved: `collaboration-state.ts` keeps `stdout: process.stdout` runtime arg (for `comms watch`); `commit-queue.ts` does not (non-streaming).

**Misattribution mechanism**: Wooded's `2389ff5e` (`docs(distilled): add 8 owner-profile observations from .remember/ plugin distillation`) absorbed my Cycle 10 source files because the commit-queue primitive's `record-staged` step fingerprints the FULL git index, not the intersection of `(intent.files, currently-staged)`. My follow-on `2be2a786` (subject says Cycle 10) actually contains ONLY the new directed event `fab05f99`. Live instance of the failure mode that `.agent/plans/agent-tooling/current/commit-queue-intent-scope-discipline.plan.md` (Stormbound implementing) cures. Discipline lesson: `git status --short` immediately before any commit-queue staging operation.

**Reviewer trace**: pre-execution code-expert GO (`aa7d8084d189fd9d7`); post-execution code-expert APPROVED (`af9289ef0af00ad5d`). Workspace gates GREEN pre-stage. Substance is fully reviewer-passed despite the misattribution.

**Coordination**: directed events `fab05f99` (Shaded→Wooded heads-up), Wooded reply (no rollback recommended), `f63b727d` (Shaded→Wooded Option A confirmation), `357d04ff` (Shaded→Stormbound ack). Tempestuous flag on stale `306dcadd` git:index/head claim — closed 15:02Z.

**Claims closed**: `7bc6b37b` (Cycle 10 files-kind) + `306dcadd` (stale Cycle 9.2 git:index/head).

**Tasks**: #10 marked complete. PR-108 snagging open follow-ups remain #8 (boundary.ts error-message, design-tokens-core branch — cross-branch) and #9 (`jc-` prefix default leak in skills-adapter-generate L24 — owner-personal namespace leakage; architectural decision required on cure shape).

**Next-cycle decision deferred to owner**: tackle #9 (needs architectural call), tackle #8 (cross-branch, lower urgency), or close PR-108 snagging entirely.

---

## Tempestuous distilled.md fitness-rotation CLOSED (2026-05-22T15:02Z)

**Identity**: Tempestuous Spiralling Thermal / claude / claude-opus-4-7 / 9205b8.

**Owner direction**: "please carry on" (after substrate-completion graduation pass closed). Treated as continuation of OUTPUT-surface curation; assessed `distilled.md` 829L vs `fitness_line_limit` 500 as the next move.

**Landed at**: `53b00386` (`docs(distilled): rotate earlier graduations audit-trail to archive`).

**Net effect**:

- `distilled.md`: 919L → 874L (-45 lines). Trim covered 4 audit-trail blocks (2026-05-06, 2026-05-09 Woodland Sheltering Glade, 2026-05-10 Quiet Lurking Mask, 2026-05-11 Verdict-not-menu Flamebright Burning Lava) describing already-graduated substance.
- `archive/distilled-graduations-log-2026-05-14.md`: +97 lines covering frontmatter `appended_passes` record, title range extended to "2026-05-06 → 2026-05-14", and new "Backfill rotation 2026-05-22" section with all 4 blocks preserved verbatim.
- Substance-preservation discipline applied: no live-distilled entries displaced; only audit-trail moved.

**Coordination**: claim overlap discovered mid-flight with Wooded's `d26e453f` (covered `distilled.md`). Sidebar `b67a3240` sent at 14:55Z; Wooded released `distilled.md` from active edit-scope at 14:56Z via directed reply (their commit `2389ff5e` had already landed 8 complementary owner-profile additions from `.remember/` plugin Haiku distillation). Trim then landed without further blockers. Stale git:index/head claim `306dcadd` (Shaded) flagged via directed event `34f27c35`; Shaded closed at 15:02Z (my Path B commit had already landed pre-close, no collision).

**Gates**: full pre-commit suite GREEN. markdownlint-staged + prettier-staged + repo-validators + shell-lint + turbo type-check/lint/test (FULL TURBO 87/87 cached) all passed.

**Remaining fitness pressure**: distilled.md at 874L still over `fitness_line_limit` 500. Further trim requires substantive judgement calls on Recently-Distilled entry settling (which 2026-05-14 / 2026-05-13 / 2026-05-09 entries have stabilised vs which remain active learning). Deferred to a separate session.

**Claim closed**: `02eadf52`. **Closeout broadcast**: `222fe173`.

**Watcher / cron**: Monitor `bxysr2dvk` stopping. No cron re-armed.

---

## Tempestuous OUTPUT-surface curation CLOSED post-compaction (2026-05-22T14:46Z)

**Identity**: Tempestuous Spiralling Thermal / claude / claude-opus-4-7 / 9205b8.

**Resumption outcome**: Resolution 1 path (per FIFTH handoff "Two possible Shaded resolutions"). All 7 substance files from the coherence-restoration bundle landed via Shaded's absorbed Cycle 9.2 commit at `c7fd0b7b`. No Path B commit required.

**Discharge evidence**:

- `20fcf565` (Wooded) — pending-graduations.md graduation-log table + 4 graduated-pointers (the substrate Wooded landed in their INPUT-surface pass).
- `c7fd0b7b` (Shaded, absorbed coherence bundle) — PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment + start-right-team SKILL "Coordinator delegates sub-agent launches" amendment + new `.agent/rules/hook-policy-substring-discipline.md` + adapters (`.claude/`, `.cursor/`) + RULES_INDEX entry + pending-graduations-archive header + 4 entry bodies.

**Substance discharged**: 4 graduations from pending-graduations.md → permanent homes. Status counts moved 5 due → 1 due.

**Remaining due entry**: `canonical-tool-definitions-code-adjacent` — `plan-execution-gated` on `coordination-watcher-canonicalisation` plan. Not actionable until that plan executes. No follow-up required on the OUTPUT-surface graduation set this session.

**Claim closed**: `cb6a4cfc-f488-4ae0-adb9-debf508cdccf` (OUTPUT-surface curation).

**Closeout broadcast**: `aa228092-1945-45cc-8687-5ef783d30772`.

**Watcher / cron**: Monitor `bmqh7qznp` was re-armed briefly for closeout absorption; stopping now. No cron re-armed this resumption pass (work was already discharged before resumption — no heartbeat needed).

---

## Cycle 9.2 LANDED post-compaction (2026-05-22T14:21Z) — Shaded

**HEAD**: `c7fd0b7b` — `refactor(pr-108-snagging): consolidate graph-* eslint configs via createGraphBaseConfig`.

**Bundle (18 files)**: 3 graph-* eslint.config.ts rewires (Cycle 9.2 substance) + ff2 plan files (Mistbound, absorbed per owner widen direction) + hook-policy-substring-discipline rule + 2 adapter siblings + RULES_INDEX entry + Tempestuous coherence absorbs (PDR-064 §"Partial / Slice-Scoped Coordinator Transfer", SKILL-CANONICAL §"Coordinator delegates sub-agent launches", pending-graduations-archive header + 4 entry bodies) + pending-graduations.md (graduated-pointer pass already prepared by Tempestuous pre-pause) + 4 own narrative comms.

**Gates**: husky pre-commit GREEN; turbo type-check + lint + test FULL CACHE across 23 packages; commit-message PASS. Advisory fitness orchestrator exit 1 on `pending-graduations.md` + `repo-continuity.md` + `napkin.md` critical zones — NOT a commit gate; substance-led path is "graduated entries can retire as their target substrate is now in HEAD".

**Claims closed**: `47497834` (git:index/head) + `6af12756` (Cycle 9 substance — 3 eslint configs + base.ts).

**Cycle 9 series complete**: 9.1 (oak-eslint factory + index export) landed in sweep `03da8e3d`; 9.2 (3 graph-* consumer rewires) landed at `c7fd0b7b`. Print-config `.rules` + `.settings` byte-identical pre/post on all 3 workspaces.

**Open PR-108 follow-ups** (tasks #8, #9, #10):

- #8 pre-existing boundary.ts error-message mismatch (design-tokens-core)
- #9 `jc-` prefix default leak in `skills-adapter-generate`
- #10 stdout arg inconsistency across bin files

**Next-cycle decision deferred to owner**: re-scan PR-108 for fresh findings post-9.x, schedule Cycle 10, or close out PR-108 snagging.

**Landing broadcast**: `004d27ed` (Cycle 9.2 LANDED at c7fd0b7b).

---

## FIFTH compaction-boundary handoff (2026-05-22T14:10Z) — Tempestuous OUTPUT-surface graduations mid-flight

**Identity**: `Tempestuous Spiralling Thermal / claude / claude-opus-4-7 / 9205b8`.

**Owner direction at pause**: "prepare for compaction, then stop, no git operations permitted until post compaction".

**HEAD at pause**: `1b619457` (same as Shaded's FOURTH handoff below — Wooded's comms-archive drain commit).

### Substance landed via Wooded's bundle (in HEAD at `1b619457`)

- pending-graduations.md graduation-log table for "Tempestuous Spiralling Thermal — substrate-completion graduation pass" with 4 entries.
- 4 graduated-pointer one-liners replacing the original entry bodies: partial-slice-scoped-coordinator-transfer, coordinator-delegates-subagent-launches, cli-body-backtick-cure-pattern, hook-policy-substring-match-cure.
- Status counts: 5 due → 1 due (remaining: canonical-tool-definitions-code-adjacent, plan-execution-gated).

### Substance in working tree (uncommitted; coherence-restoration bundle)

The graduated-pointers landed via Wooded reference targets that are NOT yet in HEAD. The following 7 files need to land to restore coherence:

- `.agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md` — new §"Partial / Slice-Scoped Coordinator Transfer" subsection between §Cron/cadence boundary and §Intersection with PDR-063; anchor references at §Moment 2 (`[slice]` qualifier) and §Cron/cadence boundary updated to point at the landed subsection. State: modified, unstaged.
- `.agent/skills/start-right-team/SKILL-CANONICAL.md` — new "Coordinator delegates sub-agent launches" amendment paragraph appended to §"Choose Temporary Responsibilities". State: modified, unstaged.
- `.agent/rules/hook-policy-substring-discipline.md` — new rule canonical. State: untracked-then-`git add`-ed (A) — **now absorbed into Shaded's commit-queue intent `851d07af` per their FOURTH handoff**.
- `.claude/rules/hook-policy-substring-discipline.md` — Claude adapter wrapper. State: A; absorbed into Shaded's intent.
- `.cursor/rules/hook-policy-substring-discipline.mdc` — Cursor adapter with alwaysApply: true frontmatter. State: A; absorbed into Shaded's intent.
- `RULES_INDEX.md` — new entry between `generator-first-mindset` and `invoke-accessibility-expert`. State: modified, unstaged.
- `.agent/memory/operational/archive/pending-graduations-archive-2026-05-22.md` — header reorganised to reflect 3 drain passes for 2026-05-22 (initial + Wooded + Tempestuous); 4 entry bodies appended under new "Tempestuous Spiralling Thermal — substrate-completion graduation pass" section. State: modified, unstaged.

### Shaded coordination at pause

At 2026-05-22T14:07:46Z Shaded broadcast that their commit-queue intent `306dcadd` / `851d07af` widened to include my 3 rule + adapter files (in the staged set after my `git add`) plus `pending-graduations.md` (already in HEAD via Wooded's commit, so a no-op for HEAD content).

I sent directed event `0e81b819-ceec-4718-9f84-f213a726aa9d` to Shaded at 14:08Z asking them to absorb the 4 additional substance files (PDR-064, SKILL, RULES_INDEX, archive) into their bundle TOO, since the rule files alone do not complete coherence restoration.

Shaded then paused at 14:09:57Z for FOURTH compaction handoff WITHOUT widening to include my 4 substance files. **Their bundle currently has my 3 rule files + pending-graduations.md but NOT the PDR/SKILL/RULES_INDEX/archive files.**

### Two possible Shaded resolutions on resumption

1. **Shaded reads my directed event at resumption and widens to absorb all 7 files into their commit**. Coherence fully restored in one commit; close my claim `cb6a4cfc` and broadcast closeout naming Shaded's SHA as discharge evidence. Done.
2. **Shaded commits their bundle as-is (3 rule files + pending-graduations no-op + their 3 graph-* eslint configs + plans + comms residue)**. Coherence partially restored (rule + adapters now in HEAD; PDR-064 + SKILL + RULES_INDEX + archive still in working tree). **Post-compaction Tempestuous action**: Path B commit of the remaining 4 files via `git commit -- <pathspecs>`.

### Wooded coordination at pause

At 2026-05-22T14:01:46Z I sent directed event `cc9da59c-184b-4f9f-b73a-bd6eecfdca86` to Wooded asking how to coordinate the multi-writer overlap on `pending-graduations.md`. Wooded's commit `1b619457` answered indirectly (Option B: separate commits) by landing their broad bundle without my full 7-file set. No verbal reply received pre-pause.

### Active claims at pause

- `cb6a4cfc-f488-4ae0-adb9-debf508cdccf` (Tempestuous, OUTPUT-surface curation: `pending-graduations.md`, `distilled.md`, `repo-continuity.md`) — OPEN. TTL 7200s from 2026-05-22T13:48Z; expires ~2026-05-22T15:48Z.

### Cron + Monitor at pause (Tempestuous)

- Cron `bce50d79` (every 3 min, 8-rule prompt) — running; will be cancelled before this update is saved.
- Monitor `b42xd4d0r` (all-channels watcher) — running; will be TaskStop-ed before this update is saved.
- Both unreliable across compaction; re-arm on resumption per start-right-team SKILL §0 + §"First Moves" move 1.

### Resumption first-action (precise sequence) — Tempestuous

1. **Ground state**: identity preflight (`pnpm agent-tools:collaboration-state -- identity preflight --platform claude --model claude-opus-4-7`), read latest comms (look for replies to `cc9da59c` and `0e81b819`), read this section, read active-claims.json.
2. **Check Shaded's commit outcome**: `git log --oneline -5`. Inspect Shaded's Cycle 9.2 commit (subject likely `refactor(pr-108-snagging): consolidate graph-* eslint configs via createGraphBaseConfig`). Inspect which of my 7 files landed in that commit via `git show --stat <sha>`.
3. **Re-arm**: all-channels watcher (Monitor), heartbeat cron `*/3 * * * *` with the standard 8-rule prompt.
4. **Land the residual**: depending on Shaded's outcome (see "Two possible Shaded resolutions" above), either:
   - (Resolution 1) close claim `cb6a4cfc` and broadcast closeout naming Shaded's SHA. Done.
   - (Resolution 2) Path B commit the residual files. Verify markdown lint clean first (was clean pre-pause). Use the commit message draft below as a starting point.
5. **Verify coherence** post-commit: `git show HEAD:.agent/memory/operational/pending-graduations.md | grep -A 2 "Tempestuous"` should show graduated-pointers pointing at targets that exist in HEAD.
6. **Close claim** `cb6a4cfc` and broadcast closeout.

### Commit message draft for Resolution 2 path (durable here)

Subject: `docs(graduations): land PDR-064 + SKILL + RULES-INDEX + archive coherence-completion`

Body:

> Tempestuous Spiralling Thermal — coherence-restoration completion of the 2026-05-22 substrate-completion graduation pass. Companion to Wooded's `1b619457` (pending-graduations.md graduation log + graduated-pointers landed) and Shaded's Cycle 9.2 commit (hook-policy-substring-discipline rule + adapters absorbed via cross-lane bundle).
>
> Substance:
>
> - PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment subsection: slice-coordinator authority as a distinct shape from full-session coordinator authority. Two-moments pattern inherited; operational surface reduced (no full-authority transfer, no coordinator-cadence cron rearm, boundary-bounded scope). Anchor references at §Moment 2 and §Cron/cadence boundary updated to point at the landed subsection. Three in-session instances triggered.
>
> - start-right-team SKILL §"Choose Temporary Responsibilities" — "Coordinator delegates sub-agent launches" amendment paragraph: codifies coordinator-vs-implementer boundary on Agent-tool invocations. Owner direction observed twice in different framings. Extends to slice-coordinators per PDR-064.
>
> - RULES_INDEX entry for `.agent/rules/hook-policy-substring-discipline.md` (rule + adapters landed via Shaded's commit).
>
> - Archive bodies for the 4 graduated entries appended to `.agent/memory/operational/archive/pending-graduations-archive-2026-05-22.md` under new "Tempestuous Spiralling Thermal — substrate-completion graduation pass" section. Archive header reorganised to reflect three drain passes.
>
> Refs PDR-064, PDR-046. Closes claim cb6a4cfc.

### Open questions to recheck at resumption (Tempestuous scope)

- Has the canonical-tool-definitions-code-adjacent entry's plan executed in the interim? If yes, it would need graduation; if no, it stays as the only remaining `status: due` entry in pending-graduations.md.
- Has anyone touched `distilled.md` (829L, over fitness hard-limit of 500L) in the interim? It remains a candidate for a separate session.
- Has `repo-continuity.md` accumulated content since Wooded's earlier drain? Check fitness state.

### Load-bearing context that compaction may drop (Tempestuous)

- Wooded's reply (if any) to my `cc9da59c` event — check comms before acting on resumption.
- Shaded's reply (if any) to my `0e81b819` event — check comms before acting on resumption.
- Pre-compaction monitor `b42xd4d0r` and cron `bce50d79` IDs will be invalid post-compaction; re-arm with fresh IDs.
- Tmp file drafts at `/tmp/tempestuous-graduation-commit-msg.txt`, `/tmp/tempestuous-compaction-handoff.md`, `/tmp/tempestuous-shaded-sidebar.md`, `/tmp/tempestuous-wooded-sidebar.md`, `/tmp/tempestuous-compaction-broadcast.md` — may not survive compaction; durable content lives here.

---

## FOURTH compaction-boundary handoff (2026-05-22T14:08Z)

**HEAD**: `1b619457` (peer consolidation commit — drained 990 stale comms-events).

**Lane A Cycle 9.2 — MID-COMMIT, PAUSED PRE-`git commit`**:

- Substance complete and reviewed-GO: 3 graph-* eslint.config.ts rewired to consume `createGraphBaseConfig` (graph-core 66→23L, graph-ingest 66→25L, graph-project 66→30L). All three print-config diffs `.rules` AND `.settings` byte-identical pre/post. Pre-execution code-expert GO-WITH-CAVEATS + type-expert GO; post-delivery code-expert GO (confirms unscoped lib names `'graph-ingest'`/`'graph-project'` are the only valid form per `LibPackage` type).
- **Open claims**: `306dcadd` (git:index/head, claimed 14:01:09Z, TTL 900s — expires ~14:16:09Z; may need refresh on resumption), `6af12756` (Cycle 9 file scope), `da769539` (Cycle 6 — keep open through PR-108 close).
- **Queue intent `851d07af`** at phase `staging` with 12 files staged (6 mine: 3 eslint configs + my comms-seen + 2 new comms event JSONs; + 6 swept peer drift per owner widen direction: 2 plans + 3 hook-policy rule files + pending-graduations.md). Fingerprint recorded.
- **Halt-stage broadcast `e2dab18e`** posted 14:07Z asking peers to pause `git add` for ~3 min so verify-staged stops chasing.
- **Commit message** ready at `.git/COMMIT_EDITMSG` — subject `refactor(pr-108-snagging): consolidate graph-* eslint configs via createGraphBaseConfig`. commit-message check PASS.

**Resumption first-move sequence**:

1. Re-ground via `/jc-start-right-team` (identity unchanged: Shaded Whispering Dusk / claude / claude-opus-4-7 / 763ef4).
2. Re-arm Monitor + cron only if `bdo1r4kxs` / `573030fb` invalidated (both survived prior compactions — check `CronList` + `TaskList` first).
3. Read `git status --short` + `git diff --staged --name-only`. If claim `306dcadd` has expired (>14:16Z), reopen a fresh `git:index/head` claim.
4. If staged set is **still exactly the 12 files** the napkin records: invoke `pnpm agent-tools:commit-queue -- commit --intent-id 851d07af-5989-4441-abe2-d9a72508a5e7 --message-file .git/COMMIT_EDITMSG`. Husky pre-commit gate runs (full-tree, INTENTIONAL per owner). On GREEN, SHA prints.
5. If staged set has **widened further** (peers staged more): abandon intent, enqueue a new one matching current staged set, re-`record-staged`, retry. Owner blocked `git reset HEAD --` for unstaging; widening is the directed path.
6. If staged set has **narrowed** (peer landed a commit including some of my files): re-enqueue with the actual current staged set.
7. On commit success: close `306dcadd` git:index/head claim with the SHA. Broadcast lane-complete + mark task #13 complete.
8. After 9.2 lands: PR-108 next-cycle decision (push for re-scan? Cycle 10? close out?). Cycle 8 disposition is "stale finding — confirm clear after re-scan". Owner direction needed.

**Peer state at pause**:

- Mistbound: Lane B COMPLETE in earlier sweep + own broadcast `2026-05-22T13:48:52`. All Lane B claims closed.
- Wooded: resumed `/jc-consolidate-docs` with broadened intent on INPUT surfaces (napkins, `.remember/`, vendor memory). Claim `d26e453f` open.
- Tempestuous: resumed with OUTPUT-surface intent (distilled.md, pending-graduations.md, repo-continuity.md). Likely staged the swept-into-my-bundle pending-graduations.md.
- The hook-policy rule files swept into my bundle look directly related to the `git restore`/`git reset HEAD --` block I hit — likely Wooded or Tempestuous documenting the hook-policy substring discipline.

**Cron + Monitor**: `573030fb` (cron, every 3 min, 9-rule prompt) + `bdo1r4kxs` (Monitor, comms watcher) both running at pause time.

**Owner directive history this session**:

- 13:36Z: "commit all files, regardless of claims or cause" (drove sweep `03da8e3d` + `2cda69a2`).
- 14:00Z: "re-ground /jc-start-right-team, re-establish the monitor and cron, and continue the Lane A work" — drove 9.2 fan-out.
- 14:01Z: "use the fan out tools to launch teams of sub-agents whenever that would be useful. Please broadcast that to all agents" — broadcast as `23847181`.
- 14:06Z: blocked my `git restore` (hook policy).
- 14:07Z: AskUserQuestion → "Widen my bundle" (Recommended option).
- 14:08Z: "please pause" → "prepare for compaction then stop, the work will be resumed post compaction".

---

## Cross-Thread Program Pointer (2026-05-14)

This thread participates as the **graph-foundations lane (4B)** of the
[`token-remediation-p8-parallel-program.plan.md`](../../plans/agentic-engineering-enhancements/current/token-remediation-p8-parallel-program.plan.md).
Owner-stated four-step sequence: token work → singleton-lane remediation
→ P8 acceptance → **then** this thread's graph foundations run in
parallel with cost-of-collaboration residual. **Hard constraint**:
graph-foundations implementation work on this thread does NOT open
under the program until step 3 (P8) lands. Until then, the work below
remains the recorded continuation but is **program-paused** as the
program runs steps 1–3 on `agentic-engineering-enhancements`. The
owner may direct program reshape; the agent does not reshape from
inside a session.

**Next anticipated work**: **PREDECESSOR — upstream API v0.7.0 cascade clear** per [`upstream-api-v0.7.0-alignment.plan.md`](../../plans/sdk-and-mcp-enhancements/current/upstream-api-v0.7.0-alignment.plan.md). All graph commits on this branch are blocked on owner authorisation of A1 (v0.7.0 intent confirm) + chore(sdk) commit shape, then atomic execution of WS0→WS4 in that plan. After cascade clears, graph work resumes: **WS3.3 graph-project adjacency primitives** is ready-to-commit in Molten Igniting Hearth's working tree (3 files: `packages/libs/graph-project/src/adjacency/index.ts`, `src/adjacency/index.unit.test.ts`, `src/index.ts` +1 line; 22 vitest green; in-cycle reviewers absorbed) — re-verify against post-cascade base (graph-core APIs not touched by v0.7.0 so re-verification expected clean), open a fresh files claim, stage by explicit pathspec, run gates, commit `feat(graph-project): add WS3.3 adjacency primitives (incoming/outgoing/neighbours)`. **WS2.2 graph-ingest jsonld-compatible + Turtle/SKOS parser-to-Dataset + invariant #2 contract test** also remains pending: cycle brief unchanged from the prior session — `packages/libs/graph-ingest/src/jsonld-compatible/**` plus a Turtle parser location (recommended: new `src/turtle/` sub-path as a peer to the six WS2.1 pre-declared barrels; n3.js is the W3C-aligned Turtle parser choice). Lands §Test discipline invariant #2 (every emitted edge predicate is `NamedNode`, never a bare string). The next team session may also dispatch WS2.3 ↔ WS3.3 in parallel (file scopes disjoint per plan §Cycle dependencies); single-agent through WS2.2 → WS2.3 → WS3.3 remains the explicitly preferred default. Multi-vendor open of this thread remains forbidden until WS3.3 lands.

**Empirical-test outcome of the two-agent collaboration shape** (2026-05-21 session, Fiery Firing Cinder × Foamy Charting Fjord, both claude/opus-4-7-1m on shared physical checkout): collaboration shape **WORKED** — both agents grounded independently, posted team-start broadcasts, resolved the WS3.2-collision by first-to-claim deferral, coordinated commit-window ordering via directed-comms-event, landed cycle work on disjoint workspace trees. The standing memory `feedback_worktree_isolation_unreliable` is scoped to Agent-tool `isolation: "worktree"` sub-agent dispatch — shared-checkout two-main-session collaboration is a distinct empirical class; updated 2026-05-21 with that scope clarification. **Failure mode observed in real time**: the staged-only-gates P0 defect re-fired empirically — Foamy's first WS3.2 commit attempt was blocked by my dirty `agent-tools/src/collaboration-state/comms-use-cases.ts` at 415 lines (max-lines 250) even though that file was entirely outside Foamy's staged bundle. Foamy's retry ~30s later passed after my refactor to 222 lines. Lucky-timing pass. Structural cure is the existing pending-graduations item (staged-only-gates).

Inc.1a remaining after this session: 3 cycles (WS2.2, WS2.3, WS3.3). WS3.2 LANDED 2026-05-21.

**Last refreshed**: 2026-05-22 (Shaded Whispering Dusk / `claude` / `claude-opus-4-7` (1M) / `763ef4`) — **THIRD compaction-boundary handoff this session, mid-cycle pause of Lane A WITH 9.1 edits in working tree (uncommitted). Cycles 5/6/7/8 closed cleanly; Cycle 9 fully reviewed + 9.1 base.ts authored + post-delivery code-expert APPROVED; awaiting commit window**.

**Lane A state on pause (THIRD handoff)**:

- HEAD: `b6a8ca52` (Mistbound's pre-execution-code-expert-review rule landing).
- Cycles closed this resumption: **Cycle 6** S7787 (7 issues dispositioned FALSE_POSITIVE via SonarQube MCP — task #11 closed false-alarm), **Cycle 7** S1135 dispositioned ACCEPT (`AZ5GtcWG-XbNk0_fBucj`; WS1.6 future-decision deferral, code-expert verdict ACCEPT), **Cycle 8** S5443 stale-finding investigation (no action; next push re-scans + clears).
- **Cycle 9 sub-cycle 9.1 IS IN WORKING TREE** (UNCOMMITTED):
  - NEW `packages/core/oak-eslint/src/configs/base.ts` (~125 lines, with full TSDoc, cycle-comment, `createGraphBaseConfig` factory + `CreateGraphBaseConfigOptions` interface).
  - EDIT `packages/core/oak-eslint/src/index.ts` (2 added lines: `export { createGraphBaseConfig } from './configs/base.js';` + `export type { CreateGraphBaseConfigOptions } from './configs/base.js';`).
  - Owner-decided three-consumer scope: `graph-core`, `graph-ingest`, `graph-project` (oak-design-ink DROPPED on architectural divergences per code-expert findings A/B/C).
  - Pre-execution code-expert `a91a17a8eeedc7d5b` APPROVED WITH CAVEATS.
  - Plan-named config-expert `ae2ffc9b6eeb45f1a` ISSUES FOUND BUT RESOLVED (3 required consumer-supplied slots, explicit-list files-glob hard-coded, two-surface acceptance diff per workspace).
  - 9.1 implementer `a0d92b3a7987df1c7` flagged 2 regressions vs consumers (test-files glob narrower, boundary-rules placement broader) — BOTH FIXED in-place by Shaded before post-delivery review.
  - **Post-delivery code-expert `ad020453a24dbf7a6` APPROVED WITH MINOR FIXES** — config-file glob narrowing for `graph-core` flagged as 9.2 implementer concern (NOT a defect in base.ts); TSDoc `@param` gap fixed inline; module-graph cycle is live-binding-safe with comment in code.
- **Cycle 9.2 (rewire 3 consumers) is BLOCKED-BY 9.1 commit** — task #13 created with addBlockedBy [12]. Type-expert focused-depth review fires BEFORE 9.2 fan-out per code-expert specifier.

**Active claims at pause**:

- `da769539` (Shaded, Cycle 6 file scope) — KEEP open as a back-reference for Cycle 6 traceability; closeable on resumption.
- `6af12756` (Shaded, Cycle 9 file scope: `packages/core/graph-core/eslint.config.ts`, `packages/libs/graph-ingest/eslint.config.ts`, `packages/libs/graph-project/eslint.config.ts`, `packages/design/oak-design-ink/eslint.config.ts`, `packages/core/oak-eslint/src/configs/base.ts`) — ACTIVE; the 4th file (oak-design-ink) is retained in claim for safety even though dropped from scope.
- `6ed6ca9a` (Mistbound, Lane B substrate) — ACTIVE; T2 implementation in flight (4→7 file widening post-code-expert review; state-schemas.ts blocker found).
- Wooded (`d26e453f`) — Wooded PAUSED for compaction at `5ed8cf16` (napkin rotation + distilled 14 rules); claim left open for post-compaction Wooded.
- Tempestuous (`70d1199a`) — CLOSED in same bundle as `97bf9e97` (Lane C commit-queue workflow primitive + SKILL revision landed).
- `789ee97b` (Shaded, Cycle 5) — CLOSED this session.

**Cron + Monitor at pause**:

- Cron `f1a21607` DELETED; replaced by **enhanced 9-rule cron `573030fb`** (every 3 min, integrates pre-execution + post-delivery code-expert moments + owner full-tree-gating correction inline). Owner-authorised swap this session.
- Monitor `bdo1r4kxs` (`pnpm agent-tools:collaboration-state -- comms watch` over full directory, self-exclusion only) — session-only, will invalidate at compaction. **First resumption move: re-arm via same command in §"Resumption first-move sequence" block.**

**Resumption first-move sequence (THIRD compaction)**:

1. Confirm git HEAD matches `b6a8ca52`. Run `git status --short` and `git log --oneline -5`.
2. Re-arm comms-watch Monitor per the verbatim command block below.
3. Read 5-10 most recent comms events to absorb anything that landed during compaction.
4. Check Mistbound's Lane B T2 commit state (her 4→7 widening may have landed during compaction).
5. **Run gates + commit Cycle 9.1** as the first substantive Lane A action — bundle: `packages/core/oak-eslint/src/configs/base.ts` (new), `packages/core/oak-eslint/src/index.ts` (edited). Stage by explicit pathspec. Use Wooded's worked Path B pattern (`git commit -- <pathspecs>`) if Mistbound's T2 staged set is still in the shared index. Commit subject: `feat(oak-eslint): add createGraphBaseConfig factory for graph-* workspace consolidation`. Per /loop new rule 3, jc-commit skill carries the commit.
6. After 9.1 commits: post-commit broadcast; close Cycle 9.1 task (#12); open Cycle 9.2 file scope claim covering the 3 consumer eslint.config.ts files; dispatch type-expert focused-depth review BEFORE 9.2 fan-out.
7. After 9.2 lands: zero-diff verification per acceptance criterion: `pnpm --filter @oaknational/graph-core exec eslint --print-config src/index.ts | jq '.rules'` AND `jq '.settings'` pre/post diff for each consumer.
8. Continue with /loop cron `573030fb` cadence (every 3 min — runtime authority is the 9-rule prompt).

**Pending /loop-tick work items at pause**:

- Resolve **config-file glob narrowing for `graph-core`** (config-expert finding 1) at 9.2 implementer time — base.ts uses `['eslint.config.ts', 'vitest.config.ts', 'tsup.config.ts']` (explicit list); `graph-core`'s current `eslint.config.ts` uses `['*.config.ts']` (wildcard). 9.2 implementer must EITHER widen the base default OR document that `graph-core` accepts the deliberate narrowing per `never-disable-checks` Expansion Discipline. Default choice (config-expert's recommendation): narrow per the explicit list — record the rationale in the 9.2 commit body.
- Tasks #8, #9, #10 (Cycle 6 follow-ups) remain pending; not blocking; revisit when natural.

**Mistbound + Wooded state at pause**:

- Mistbound Lane B T2: 4→7 file widening visible in working tree post-code-expert. State-schemas.ts is the named blocker. Pre-staged: `agent-tools/src/collaboration-state/comms-relevant-events.ts`, `types.ts`, new `agent-tools/tests/collaboration-state/format-watcher-event.unit.test.ts`, ADR-183 doc. **My 9.1 commit must NOT disturb her staged set** — use `git commit -- <pathspecs>` Path B.
- Wooded PAUSED at `5ed8cf16` (napkin rotation 2026-05-22 — 1327 lines archived, 14 behaviour-changing rules distilled). Claim `d26e453f` left open.
- Tempestuous Lane C CLOSED with `97bf9e97`. On standby for cross-lane reviewer or owner direction.

**Lane A state on pause (SECOND handoff, retained for full history)**:

- HEAD: `92dcd8bd refactor(pr-108-snagging): clear Cycle 6 S7785 sites (5 bin files, top-level await)`.
- Cycle 5 landed at `d57c5025` (8 sites, 5 sub-cycles via parallel fan-out).
- Cycle 6 S7785 (5 sites, 5 bin files) landed at `92dcd8bd` via parallel fan-out; post-delivery code-expert review APPROVED, no drift, no specialist escalation.
- Cycle 6 S7787 (5 sites in `packages/libs/graph-ingest/src/*/index.ts`) **disposition is FALSE_POSITIVE** for all 5 per code-expert pre-execution review (WS2.1 reserved-entrypoint placeholders; `export {}` is the only TS-valid module-marker for ESM zero-implementation reserved sub-paths with no sibling files to re-export). **Pending: 5 SonarQube MCP `change_sonar_issue_status` calls** with the per-site rationales already produced by code-expert this session. The MCP calls are durable in plan-context and can be done from a fresh session — Sonar issue keys must be discovered via `search_sonar_issues_in_projects` filtering on rule `typescript:S7787` against this branch.
- Cycle 7+: not started. Cycles 7-10 + Phase Final remain in plan per `pr-108-snagging.plan.md`.

**Active claims on pause**:

- `789ee97b` (Shaded, Cycle 5 file scope, thread `pr-108-snagging`) — STALE; Cycle 5 landed at `d57c5025`. Should be closed in resumption first move.
- `da769539` (Shaded, Cycle 6 file scope, thread `pr-108-snagging`) — ACTIVE; Cycle 6 S7785 landed but the same claim covers the S7787 FALSE_POSITIVE work. Keep open until FALSE_POSITIVE pass completes.
- `6ed6ca9a` (Mistbound, Lane B substrate, thread `connecting-oak-resources`) — ACTIVE.
- `d26e453f` (Wooded, consolidation, thread `agentic-engineering-enhancements`) — ACTIVE.

**Standing rules landed this session that weren't in place pre-session**:

- `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md` (+ `.claude/` + `.cursor/` adapters) — authored by Mistbound's capture sub-agent per owner directive after my tick-4 loop-doctrine memory entry. Specifies: TWO code-expert dispatches per /loop cycle (pre-execution before fan-out + post-execution before commit). My memory entry `feedback_loop_runbook_code_expert_after_delivery.md` is now graduated — keep as record but flag superseded by the rule.

**Owner corrections received this session (memory updates required)**:

- Full-tree pre-commit gating is INTENTIONAL AND CORRECT; staged-only gating is REJECTED as a cure shape. Owner: "the worst bugs are often emergent outside of changed files." Multi-writer coordination is solved by queue + ordering + comms, not by narrowing gate scope. Supersedes memory entry `feedback_pre_commit_hook_must_gate_staged_only.md` — that memory should be deleted or rewritten as a "rejected cure" record on resumption.

**Triple-then-quadruple peer topology this session**:

- Shaded Whispering Dusk (`763ef4`, claude/opus-4-7) — Lane A, this session.
- Mistbound Slipping Night (`a1cb64`, claude/opus-4-7) — Lane B (PDR-063..066 cure, substrate Tranche 1 landed at `c4bacfc5`; Tranche 2 ADR-183 CLI rendering sidebar in flight; Q1-Q5 awaiting Shaded answers).
- Wooded Swaying Thicket (`6c58f3`, claude/opus-4-7) — consolidation specialist; scope = `.agent/memory/active|operational/*` + graduation destinations.
- Tempestuous Spiralling Thermal (4th peer, prefix unknown) — seen-file appeared mid-session; broadcast not yet absorbed before pause. **First resumption move: read their team-start broadcast to learn their role and scope**.

**Mistbound's sidebar Q1-Q5 outstanding** (for ADR-183 T2 CLI rendering update at `agent-tools/src/collaboration-state/cli-comms-watch.ts`):

- Q1 render-site location (render-time confirm); Q2 token format `[FAILURE-MODE]`/`[BEHAVIOUR-NOTE]` confirm; Q3 composition order `[BROADCAST] [FAILURE-MODE] <title>` confirm; Q4 multi-tag rendering rule (co-tag allowed? order? only-one-tag convention?); Q5 unknown-tag handling (literal/skip/error). Q6+Q7 Mistbound's own. **Resumption: reply via directed comms to Mistbound (prefix `a1cb64`)**; Mistbound dispatches the implementer sub-agent after Q1-Q5 are settled.

**Comms watcher Monitor task** for this session: `b683jt1tv` (current). After compaction, this task ID will be invalidated. **Resumption move**: re-arm via:

```bash
pnpm agent-tools:collaboration-state -- comms watch \
  --comms-dir .agent/state/collaboration/comms \
  --seen-file .agent/state/collaboration/comms-seen/shaded-whispering-dusk.json \
  --platform claude --model claude-opus-4-7
```

Run as a persistent Monitor task (Claude Code `Monitor` tool with `persistent: true`, `timeout_ms: 3600000`). The seen-file is committed and primed — no historical backfill will fire.

**Lane-advancing /loop command** (multi-peer-aware version from `/tmp/lane-c-opening-statement.md` lines 147-166; the runbook the user is currently pasting each tick):

```text
/loop 180s Advance lane AND coordinate. (1) Before any sub-agent dispatch: ensure a peer-level active-claim is open covering the full file scope of the imminent work; cross-check .agent/state/collaboration/active-claims.json AND each peer's latest broadcast for collision. (2) If a fan-out is in flight, do NOT spawn another — absorb returns as they arrive; when the cycle's full bundle is back, run pre-commit gates and commit cohesively via the jc-commit skill (no --no-verify). (3) If no fan-out is in flight and the next cycle is ready, fan out: file-disjoint sub-agents, one task brief per sub-agent, edits-only-no-commit-no-gates discipline. (4) If >120s silent on shared comms, broadcast a brief progress event per §5 cadence. (5) Cross-check each peer's recent broadcast scope against your intended next-cycle file scope; open a sidebar BEFORE dispatching if encroachment risk surfaces. (6) Surface anything the watcher will not surface via AskUserQuestion to owner OR directed comms to peer — never block silently. (7) If >75% context budget, post coordinator-style pre-positioning per PDR-064 and prepare mid-cycle handoff record per PDR-063. (8) End the tick when nothing is due — advance where possible, check where required, post where mandated; do not force action when none is due.
```

**Resumption first-move sequence (post-compaction)** — read this top-to-bottom before resuming /loop:

1. Confirm git HEAD matches `92dcd8bd` (Cycle 6 S7785) or a later commit if other peers landed work during the compaction gap. Run `git status --short` and `git log --oneline -5`.
2. Re-arm the Monitor comms watcher per the command block above; verify it starts cleanly (first stdout line should be the pnpm/node command echo, not backfill).
3. Read the 5-10 most recent comms events to absorb anything that landed during compaction: `ls -t .agent/state/collaboration/comms/*.json | head -10 | while read f; do jq -r '"\(.created_at)\t\(.author.agent_name // "?")\t\(.title // .subject)"' "$f"; done`.
4. **Critical: read Tempestuous Spiralling Thermal's team-start broadcast** (seen-file present at handoff but broadcast unread). Their scope + role must be absorbed before any Lane A dispatch in case it overlaps. Find via `grep -l "Tempestuous" .agent/state/collaboration/comms/*.json | head -3`.
5. Close stale claim `789ee97b` (Cycle 5, completed) via `pnpm agent-tools:collaboration-state -- claims close --active <path> --closed <path> --claim-id 789ee97b-6668-48e4-91a5-725b4767426d --summary "Cycle 5 completed at d57c5025; closing stale claim" --now <iso> --platform claude --model claude-opus-4-7`.
6. Paste the /loop command (block above). First tick options, in priority order:
   - (a) Send Mistbound directed comms answering sidebar Q1-Q5 (cheapest unblock for them; their T2 dispatch hinges on these answers).
   - (b) Dispatch the 5 SonarQube MCP `change_sonar_issue_status` calls to close out Cycle 6 formally (S7787 sites). Issue keys discovered via `mcp__sonarqube__search_sonar_issues_in_projects` filtering rule `typescript:S7787` on branch `feat/mcp-graph-support-foundation`. Rationale text already drafted by code-expert in this session — see prior agent return (in conversation memory, will be lost on compaction; if lost, the rationale shape is "WS2.1 reserved-entrypoint placeholder; no sibling implementation files; `export {}` is the only TS-valid module-marker idiom for an ESM zero-implementation reserved sub-path; replacing with named specifiers or `export type {} from '...'` would require a target module that does not exist yet").
   - (c) Begin Cycle 7 (S1135 TODO disposition at `packages/core/graph-core/src/data-factory/index.ts`) — single file, single site, mechanical or FALSE_POSITIVE depending on judgement. Plan section at `pr-108-snagging.plan.md` lines 866-895.
7. Continue cadence per the /loop runbook.

**Pending follow-up tasks at pause** (in-conversation task list, will be lost on compaction; recorded here for durability):

- #8 Pre-existing boundary.ts error-message mismatch (design-tokens-core branch reports `oak-design-tokens` for `oak-design-ink` violations) — surfaced by code-expert in Cycle 5 review; refactor preserved the defect, did not introduce. Architecture-expert follow-up candidate.
- #9 `jc-` prefix default leak in `agent-tools/src/bin/skills-adapter-generate.ts` line 24 — owner-relevant judgement call (intentional dev convention OR leak; orthogonal to the S7785 fix).
- #10 `stdout` arg inconsistency: `agent-tools/src/bin/agent-tools.ts` passes `stdout: process.stdout` to `runAgentToolsCli`, sibling bin files do not. Possibly load-bearing.
- #11 Sonar S7787 coverage gap: 7 export-only files in `packages/libs/graph-ingest/src/`, only 5 flagged. `records/index.ts` + `strict-jsonld/index.ts` not flagged. Either scan-path boundary or per-file cap.

**Session pattern captures (napkin)**:

- Multi-cycle Lane A session: 2 commits (Cycle 5, Cycle 6 S7785), 13 site fixes, 3 follow-up tasks tracked. The cohort drift (1 site producing a real fix, others producing followups) is normal.
- Triple-then-quadruple peer topology emerged smoothly: Shaded + Mistbound sequential commit choreography → Wooded joined as consolidation specialist (disjoint scope) → Tempestuous arrival mid-session was visible via seen-file before broadcast was absorbed (good early-warning signal for future peers).
- Pre-execution code-expert review caught zero defects in 5-site mechanical refactor (Cycle 5 + Cycle 6 S7785) but caught 5 architectural FALSE_POSITIVE calls in S7787 — value of the gate is in the FALSE_POSITIVE prevention more than the FIX confirmation.
- Loop-doctrine rule graduation pathway: in-session memory entry → owner directive to graduate → peer captures via sub-agent → rule lands in `.agent/rules/` within 2 ticks of owner directive. Fast cycle.

**Working tree at handoff time** (this commit lifecycle):

Will include: this thread record update; napkin entries; the loop-doctrine memory entry mark-as-graduated; the pre-commit-staged-only memory entry deletion-or-rewrite. Will NOT include: Wooded's `pending-graduations.md` + archive (their work product). Will NOT include: the new rule files (already committed by Mistbound's capture).

---

## SECOND-LAYER (deeper history) Last refreshed: 2026-05-22 (Shaded, first compaction-boundary handoff)

The block below is the previous (first) handoff this session, retained for full history. It describes the pre-Lane-A state. Read only if the current handoff block above is insufficient context.

**Compaction-boundary handoff after meta-plan review + two-peer team formation + metacognition pass on canonical-watcher organisation**. This session: (a) reviewed `feat-mcp-graph-support-foundation-meta.md` + 11 associated docs end-to-end; produced verdict "meta plan is structurally sound; three substantive drifts + one link bug worth follow-up"; (b) executed the cures via 4-sub-agent fan-out, landed at commit `4200a17b` (`docs(meta-plan): refresh post-arch-excellence and cure graph-stack link drift`; 9 files +31/−15; all 87 turbo gates green); (c) at owner direction formed a two-primary team for the next phase — Shaded Whispering Dusk on Lane A (PR-108 snagging Cycles 5-10 + Phase Final), Mistbound Slipping Night (`a1cb64`) as Peer B candidate awaiting owner direction (likely Lane B = Inc.1a closure WS2.2/WS2.3/WS3.3 OR Inc.1d substrate WS4.1/WS4.4/WS4.5); (d) ran `/jc-metacognition` on a worked-instance defect (seen-file JSON-vs-plain-text format confusion) and produced a structural plan at `.agent/plans/agent-tooling/future/coordination-watcher-canonicalisation.plan.md` capturing the canonical-home misplacement (`.agent/reference/` is for external materials only), the SKILL-invocation-example-as-fragile-authority shape, and the watcher-scope-narrower-than-substrate-scope gap; (e) authored napkin entries + pending-graduations entry "Canonical tool definitions belong code-adjacent" (`due`, second-instance trigger fired). **Lane A work NOT started this session** — owner direction was "give me a loop command first; don't start yet". The lane-advancing /loop command (paste identically into both Shaded's session and Mistbound's session once owner authorises start):

```text
/loop 180s Advance lane AND coordinate. (1) Before any sub-agent dispatch: ensure a peer-level active-claim is open covering the full file scope of the imminent work; cross-check .agent/state/collaboration/active-claims.json AND peer's latest broadcast for collision. (2) If a fan-out is in flight, do NOT spawn another — absorb returns as they arrive; when the cycle's full bundle is back, run pre-commit gates and commit cohesively via the jc-commit skill (no --no-verify). (3) If no fan-out is in flight and the next cycle is ready, fan out: file-disjoint sub-agents, one task brief per sub-agent, edits-only-no-commit-no-gates discipline. (4) If >120s silent on shared comms, broadcast a brief progress event (lane state, current cycle, blocker if any) per §5 cadence. (5) Cross-check peer's recent broadcast scope against your intended next-cycle file scope; open a sidebar BEFORE dispatching if encroachment risk surfaces. (6) Surface anything the watcher will not surface (silent peer past cadence, inter-peer routing question, missing owner direction, blocked sub-agent return) via AskUserQuestion to owner OR directed comms to peer — never block silently. (7) If >75% context budget, post coordinator-style pre-positioning per PDR-064 and prepare mid-cycle handoff record per PDR-063. (8) End the tick when nothing is due — advance where possible, check where required, post where mandated; do not force action when none is due.
```

Two-primary collaboration model captured in `.agent/memory/active/napkin.md` § Shaded Whispering Dusk / 2026-05-22 ("Live pattern: two-primary-each-fanning-out collaboration model"). Load-bearing precondition: **peer-level file-scope claim before any sub-agent fan-out** — sub-agents are invisible to active-claims so the peer must defend their file scope at peer level. Comms watcher for Shaded armed as Monitor task `b7ofkzzv1` at session-open; may need restart after compaction. Team-start events: Mistbound `69ba0a86` (11:17:37Z), Shaded `fca67873` (post-prime). **Next safe step for Shaded (Lane A) post-compaction**: re-arm watcher if needed; paste the /loop command above; first tick opens a peer-level claim covering PR-108 Cycle 4/5 file scope per `pr-108-snagging.plan.md` `primary_artefacts`, then dispatches the first mechanical-fix sub-agent fan-out (Cycle 4 rule-cluster mechanical fixes: S6653, S6594, S6582, S7755, S6564, S4323, S7780, S7786, S7763). **Next safe step for Mistbound (Peer B)**: await owner direction confirming lane assignment; if Lane B = Inc.1a closure, file scope is `packages/libs/graph-ingest/src/` (WS2.2 jsonld-compatible + Turtle parse) and `packages/libs/graph-project/src/adjacency/` (WS3.3) — both disjoint from Lane A's scope. **PR-108 hard gate relaxation 2026-05-22**: substantive substrate work (WS2.2, WS2.3, WS3.3, WS4.1, WS4.4, WS4.5) is now explicitly authorised to proceed on this branch in parallel with PR-108 snagging, per the file-scope partition recorded in the meta plan. Merge ordering is a session-time choice, not a planning constraint. No retained claims from this session; working tree at handoff carries the coordination-watcher plan + memory entries + comms events + seen-files + shared-comms-log (committed in the handoff commit before compaction). Inc.1a remaining unchanged at 3 cycles (WS2.2, WS2.3, WS3.3); Inc.1d still pending (WS4.1, WS4.4, WS4.5).

Previous refresh: 2026-05-21 (Soaring Flying Gale / `claude` / `claude-opus-4-7-1m` / `ffa6ce`) — **solo planning-deepening session for gate-1a maximum-parallelisation execution overlay**. Plan-file-only edits; no source code touched. (1) Added §Execution Partition to [`eef-first-feature.plan.md`](../../plans/sector-engagement/eef/current/eef-first-feature.plan.md) — unified dependency graph + round assignment + per-cycle reviewer set + named user-facing scenarios across all gate-1a-blocking cycles (substrate `WS4.1`/`WS4.4`/`WS4.5`, corpus `t1`/`t2`/`t6a`/`t9`/`t10`/`t12`/`t13`/`t14`/`t20` + partials, coordination tokens `ff1`–`ff6`). Inc.1a closure (`WS2.2`/`WS2.3`) recognised as cross-workspace parallel with gate-1a delivery (separate workspace tree). Critical path: `WS4.4` → `t1` → `t2` → `t6a` → `t10` → `ff6` = 5 sequential rounds + Round 0 authorisation + terminal acceptance. Round 1 = 8 file-disjoint parallel cycles + 2 non-technical streams + 2 cross-workspace Inc.1a cycles. (2) Refocused the [parallel-execution addendum](../../plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md) §Dependency-graph-dictated round structure to point at the unified execution partition (avoids the addendum's prior substrate-only under-count). (3) Three new pending-graduations entries landed: **mid-cycle retirement protocol** (PDR-shaped or skill-amendment-shaped; first-instance trigger = rotating-cast Round 1 launch), **grounding-cost amortisation** (PDR-shaped; trigger = owner-direction or first launch evidence), **comms-event stream as failure-mode capture channel** (PDR-shaped; trigger = second-instance or rotating-cast observation). The existing coordinator-handoff two-distinct-moments entry remains awaiting second instance. **HARD GATE recognised this session**: per Feathered Circling Horizon's PR #108 snagging plan (committed at `1af47f9e` during this session by parallel Cursor work) — **Inc.1a remaining cycles (`WS2.2`, `WS2.3`) + Inc.1b/c/d (including all gate-1a substrate `WS4.1`/`WS4.4`/`WS4.5`) MUST wait until PR #108's quality gates clear** (either via the snagging plan landing on `feat/mcp-graph-support-foundation`, or via the branch merging first and graph implementation resuming on a fresh branch). My plan-file deepening is the team-execution overlay for when Round 1 does eventually open; the timing is gated by PR #108, not by Round 0 owner authorisation alone. **Next-session entry shape (revised)**: (a) PR #108 snagging plan execution per the 12 cycles in [`pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) — this is the immediate-next executable step on this branch; (b) THEN owner authorisation of WS4.4 test-partition amendment + sketch-level ratification of the four protocol additions; (c) THEN Round 1 launch under `start-right-team` per the addendum's controlled-experiment shape. No claims retained from this session; working tree was clean at session-open after the Codex consolidation cohort's commits (`72a47c52`, `d3d31766`, `1af47f9e`, `ac893ca7`) landed during my read window — discovered mid-session and refreshed-from grounding accordingly.

Previous refresh: 2026-05-21 (Feathered Circling Horizon / `cursor` / `claude-opus-4.7` / `9e1c24`) — **PR #108 quality-gate snagging plan authored and parked as the immediate-next operational step on `feat/mcp-graph-support-foundation`.** Session was analysis-and-planning only: fetched all PR #108 comments + check-run results (`gh pr view 108`, `gh pr checks 108`, `gh api .../pulls/108/comments`); analysed the failing gates (CodeQL alert #90 `js/missing-rate-limiting` on `bootstrap-helpers.ts:151` re `createRequestLogger`, with the same misclassification shape as the already-disposed alert #69 on `createCorrelationMiddleware` on line 146; SonarCloud Quality Gate failing on 40 new issues, 12 unreviewed hotspots, 6.0% new-code duplication ≥ 3.0% threshold via the SonarCloud public REST API after the MCP transport failed); read `docs/governance/sonar-disposition-policy.md` and `.agent/rules/never-disable-checks.md` end-to-end; authored the executable snagging plan at [`.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) (1,114 lines, `type: quality-fix`, `status: planning`, 12 cycles across 3 phases — Phase 0 disposition ledger; Cycle 1 CodeQL #90 TSDoc extension + UI dismiss; Cycle 2 S5332 hotspots disposition as SAFE per policy W3C test-URI rule; Cycle 3 S4036 hotspot investigation; Cycle 4 17 mechanical issue fixes across 9 rules; Cycle 5 8 refactor-shaped fixes across 5 rules; Cycle 6 architectural-judgement issues `S7785` top-level await + `S7787` bare re-exports; Cycle 7 `S1135` TODO disposition; Cycle 8 S5443 mechanical encoding investigation; Cycle 9 ESLint config consolidation per `consolidate-at-third-consumer`; Cycle 10 residual duplication disposition with explicit policy-amendment escape hatch; Phase Final validation via `pnpm check` + push + green CI). Cross-referenced as **PR #108 merge blocker** at the top of the active graph-stack plan. **The snagging plan is the immediate-next executable step on this branch — Inc.1a remaining cycles (WS2.2, WS2.3, WS3.3), Inc.1b, Inc.1c, and Inc.1d must wait until PR #108's gates clear (either via the snagging plan landing on this branch, or via the branch merging first and graph implementation resuming on a fresh branch).** No code touched this session; no commits; no claims opened. Continuity surfaces touched (this file, `repo-continuity.md`, `active/graph-stack.plan.md`). Napkin / pending-graduations candidates from this session — (a) tighter policy-doc-first reading at gate-analysis time (read `sonar-disposition-policy.md` BEFORE proposing dispositions, not after); (b) the metacognition insight "the gate is the cheap version of the failure it names" as a candidate doctrine entry — surfaced here for the next consolidation pass rather than written into the (currently peer-claimed) napkin / pending-graduations surfaces. **`pnpm check` cleanliness gate (Step 11)**: NOT executed this session — inherited working-tree state is non-clean with mid-flight consolidation-lane work by three Codex agents (Prismatic, Gilded, Silvered on `019e4c` prefix); running the full aggregate gate would have disturbed peer work. ReadLints on the new plan file returned 0 diagnostics; markdownlint-clean. Surfacing the broader gate check as a deferred verification to whichever agent next opens a commit window on this tree (or to Silvered's pending gate-state report as the elected gate-runner of the inherited tree).

Previous refresh: 2026-05-21 (Cirrus Circling Plume / `claude` / `claude-opus-4-7` / `fba398`, continued — strategic-brief authoring after team-session closeout) — **Inc.1d EEF concurrent-tenant amendment-set landed at `0cdaf58c`** in the six-agent team session; inherited working-tree residual landed at `f4ca84f6` covering WS3.3 adjacency primitives + Pelagic search-cli fixes + Torrid agent-tools surface + Celestial start-right-team SKILL update + ADR-173 amendment + new upstream-api-v0.7.0 plan; session-handoff state landed at `1178db03`. **Final session output**: owner-directed ultrathink analysis of the path to first EEF tool delivery produced a strategic-brief addendum plan at [`gate-1a-delivery-parallel-execution-addendum.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md). The addendum captures: (a) one architectural amendment (WS4.4 test partition by ownership-of-invariant; separate type-invariant smoke-test in graph-core using fixture TNode from EefStrand-instantiation smoke-test in corpus-sdk with WS4.5) — architecturally correct independently of the parallelism it enables; (b) four rotating-cast coordination-protocol questions (mid-cycle retirement, coordinator handoff under token pressure, grounding-cost amortisation, comms-events as failure-mode channel); (c) dependency-graph-dictated 4-round structure with file-disjoint partitions per round (~8–11 hours wall-clock from authorisation through first tool shipped); (d) 10 inviolate quality invariants; (e) the test-partition-by-invariant-ownership generalisation as a PDR candidate after second-instance accumulates. **Next-session entry shape**: read the addendum end-to-end as Round 0 (owner authorisation pass + fact-finding); decide on WS4.4 amendment + four protocol additions; read `eef-first-feature.plan.md` for ff1–ff6 dependency graph; read `graph-stack.plan.md` for WS2.3 parallel-safety verification; launch Round 1 as 3-agent controlled experiment with deliberate mid-round coordinator-retirement stress test. No retained claims from this session; all peer team-member closeouts received (Stratospheric, Salty, Opalescent, Gilded, Evergreen). Inc.1a remaining unchanged at 2 cycles (WS2.2, WS2.3); WS3.3 LANDED in `f4ca84f6` this evening.

Previous refresh: 2026-05-21 (Cirrus Circling Plume / `claude` / `claude-opus-4-7` / `fba398`) — **six-agent team session landed the Inc.1d EEF concurrent-tenant amendment-set at commit `0cdaf58c`** (`docs(plans): land Inc.1d EEF concurrent-tenant amendment-set`; 7 files, +657/−129; all pre-commit gates green on first attempt). Team shape: four-slice file-disjoint partition + cross-cutting reviewer + elected gatekeeper. Slice owners: Gilded Beaming Eclipse (`0467d0`, Slice A — graph-query-layer.plan.md), Stratospheric Gusting Squall (`cfe7da`, Slice B — graph-stack.plan.md), Salty Snorkelling Pier (`5eb191`, Slice C — graph-mvp-arc.plan.md + §1a gate-runner + elected gatekeeper), Opalescent Illuminating Galaxy (`2aa615`, Slice D — eef-evidence-corpus + portfolio + conservation-map + new eef-first-feature.plan.md). Cross-cutting reviewer: Evergreen Climbing Canopy (`4a365e`) — per-slice PDR-044 vocabulary second-eye on all four slices (all CLEAN) + 8-row bidirectional cross-reference matrix verification + final coherence verdict GO. Coordinator handoff: Stratospheric Gusting Squall opened the four-slice partition and routed §1a gate-runner; coordinator role transferred to Cirrus Circling Plume at 19:33Z via explicit active-acknowledgement (owner-corrected timing: pre-positioning is distinct from authority transfer). §1a inherited-tree gate-state at session-open: ALL GREEN per Salty's per-workspace run (agent-tools / search-cli / env / graph-project; 1505 tests passing at HEAD `688ccef2`); cascade-class failure mode confirmed cured. PDR-044 vocabulary discipline applied across all four slices + 3 supplements (Slice C line 601 "non-negotiable" substituted; Slice D conservation-map.md lines 57+114 carve-out → exemption; Slice A t6-mcp-tools YAML "7 → 17" coherence drift). Six-row cross-reference integrity preserved. **Deferred to next session (pending-graduations entries)**: (a) Stratospheric's three pattern candidates — coordinator-handoff two-distinct-moments, coordinator-as-slice-runner viability, §1a gate-runner per-workspace scoping; (b) Cirrus's napkin-refinement note — closure-shape vs structural-antonym distinction for "definite" vocabulary (the 6 in-place instances on graph-mvp-arc.plan.md are structural-antonym usage consistent with `feedback_simple_definite_no_imaginary_flows`; KEEP); (c) Cirrus's backtick-substitution shell-safety pattern — composing comms-send bodies with markdown that contains backticks inside double-quoted shell args triggers accidental command substitution (phantom `git commit` ran during Salty's commit-window but was aborted by pre-commit hook failure on a flaky lifecycle-lease test; no on-disk damage; lesson captured); (d) `--body-file` CLI enhancement, evidence point 2. **Next-session entry shape for this thread**: pre-Inc.1d-implementation predecessor chain still applies (WS1.5 canon, WS2.2 jsonld-compatible, WS2.3, WS3.3 adjacency primitives, WS4.1 graph-corpus-sdk scaffold, WS4.2 + WS4.3 Threads adapter). Inc.1d (WS4.4 GraphView interface + WS4.5 EefStrandsGraphView adapter) opens once Inc.1a + WS4.1–4.3 land. Working-tree residual remaining post-commit: Molten's WS3.3 adjacency files + Pelagic's bulk-download fixes + agent-tools/comms-surface edits + ADR-173 markdown touch — not in scope of this session; subsequent session(s) decide handling. Files claim disposition: all slice-owner claims CLOSED to archive (Gilded, Salty, Opalescent, Stratospheric); no retained claims.

Previous refresh: 2026-05-21 (Torrid Glowing Flame / `claude` / `claude-opus-4-7-1m` / `5ab0ec`) — **Inc.1d EEF concurrent-tenant sequencing pull-forward authored as a planning amendment set under owner direction. NO product code in this session.** Cross-plan amendment set landed in the working tree: (1) ADR-173 §First-wave ingestion scope amended to record two concurrent attached corpora (Threads + EEF strands as concurrent `graph-corpus-sdk` tenants in Inc.1); workspace #6 Inc.1 activation expanded; new 2026-05-21 amendment summary block added. (2) `graph-stack.plan.md` Inc.1 expanded with WS4.4 (`GraphView<TNode, TEdgeType>` polymorphic interface + T7a `DeepKeyPath` compile-time smoke-test inside `graph-corpus-sdk`) and WS4.5 (`EefStrandsGraphView` adapter implementing `subgraph` + `manifest` for EEF; remaining 5 operations as typed `NotImplementedYet` Result stubs satisfying the full interface). Both new todos carry `sub_increment: 1d` and depend on WS4.1 + WS3.3. WS5 coordination-amendments dependency expanded to require both adapters (WS4.3 + WS4.5) before Inc.1 closes. Inc.1 / Inc.3 rows in the Increments table updated; §Slice value + §Slice non-scope updated. (3) `graph-query-layer.plan.md` per-adapter sequencing recorded: T5 `subgraph` + `manifest` at Inc.1d, remaining T5 + T3 + T4 at Inc.3; T2 interface home corrected from `oak-curriculum-sdk` to `graph-corpus-sdk` per ADR-173/179. (4) `eef-evidence-corpus.plan.md` gate-1a/gate-1b grouping added; new todo `t6a-explore-tool` for the `eef-explore-evidence-for-context` tool consumed by gate-1a. (5) `graph-mvp-arc.plan.md` gate-0/gate-1 split into gate-0a + gate-1a (first feature ships ahead of substrate completion) and gate-0b + gate-1b (residual substrate + slice 1 completes); sequencing diagram restructured; non-negotiable architectural commitments enumerated. (6) `graph-portfolio-index.md` slice 1 row updated. **Architectural commitments shipping at gate-1a are non-negotiable**: full GraphView interface, DeepKeyPath array-stop discipline, structural citation envelope, ADR-175 freshness CI gate (180-day binding), `eef-*` namespace + `_meta` attribution, Sentry telemetry seam pattern, atomic TDD landing. Net additional work over the unsplit sequencing roughly +10–15% (ADR-123 amends twice; T7/T19 extend across two passes), accepted per owner direction as the price of earlier first delivery. **Cascade status (corrected at handoff close)**: the v0.7.0 cascade CLEARED earlier today via Opalescent Twinkling Supernova's three commits (b1afd5bf chore(sdk) + 5613eee4 refactor(search-cli) + 8fcd3200 docs(plans)); my session ran with the cascade already resolved and the planning amendments are downstream of that clear. Earlier entries in this thread record referred to the cascade as blocking — that was true at their time of writing but is no longer true at my session's close. This session's amendments are planning-only and do not touch SDK codegen output. **Files claim opened** covering ADR-173 + 5 plans + 2 thread records + napkin + comms log; will close on commit. **Next-session entry shape**: after cascade clears + WS1.5 canon + WS2.2 + WS2.3 + WS3.3 + WS4.1 + WS4.2 + WS4.3 land per existing sequence, dispatch WS4.4 + WS4.5 as the new Inc.1d work (parallel-safe with WS4.2/4.3 Threads after WS4.1 scaffold lands; substrate dependencies are WS4.1 + WS3.3, not WS4.2 or WS4.3).

Previous refresh: 2026-05-21 (Molten Igniting Hearth / `claude` / `claude-opus-4-7-1m` / `078515`) — team-member closeout for WS3.3 in the three-agent session that Celestial Glimmering Moon (`46d23a`) opened. **WS3.3 atomic bundle ready-to-commit in working tree but NOT committed** (cascade-blocked per Celestial's investigation and the `upstream-api-v0.7.0-alignment.plan.md`). Working-tree contents on `feat/mcp-graph-support-foundation`@`84638bc9`: (1) `packages/libs/graph-project/src/adjacency/index.ts` — three free functions `outgoing(graph, nodeId)`, `incoming(graph, nodeId)`, `neighbours(graph, nodeId)` over `PropertyGraph`; identity-equality via canonical `equals` from `@oaknational/graph-core/term`; `readonly PropertyGraphEdge[]` / `readonly PropertyGraphNodeId[]` returns; total functions (no Result); full TSDoc with explicit conceptual-seam declaration against `DatasetCore.match()`; (2) `packages/libs/graph-project/src/adjacency/index.unit.test.ts` — 22 unit tests covering outgoing/incoming parallel-edge + order preservation, no-match returns empty, self-loops in both directions, blank-node structural equality, neighbours dedup + first-appearance order, neighbours self-loop returns self exactly once, empty cases; (3) `packages/libs/graph-project/src/index.ts` — 1-line addition re-exporting the three primitives. **Workspace-scoped gates green**: 22/22 vitest, lint clean, type-check clean. **In-cycle reviewer absorption complete**: type-expert GO (clean; no conditions; non-blocking nit on `expectTypeOf` moot after the test-expert absorption); architecture-expert-barney **KEEP-SEPARATE** verdict — three-barrel split shipped by WS3.1 (`./property-graph`, `./projection`, `./adjacency`) is structurally honest because adjacency has zero dependency on projection; collapse hypothesis would create coupling not resolve it; Inc.1a remaining cycle count unchanged; test-expert GO-WITH-CONDITIONS — type-level signature describe block deleted per `testing-strategy.md` "Do not test types" (now 22 tests; was 23). **Honesty correction this session**: initial team-start broadcast `d6a1b0c8` overstated foundation completeness; only thread record + plan + memory read at post time, not AGENT.md / principles / tdd-as-design / testing-strategy / orientation; corrected via comms event `9f2e25a7` after user direction to verify rule-following. Same failure mode shape as "closure-pressure produces reconstructed reasoning"; captured for distilled if it recurs. **Claim disposition**: files claim `8ca9dd0e` on `packages/libs/graph-project/src/adjacency/**` closing on this closeout (no retained claims per Closeout Contract default); working-tree changes remain in the tree for the next agent (DO NOT discard the three Molten-authored files). **Next-session entry shape for WS3.3 specifically**: after the cascade-clear plan lands, re-verify the three files against post-cascade base (graph-core APIs Molten depends on — `equals`, `PropertyGraph`, `PropertyGraphNodeId` — are NOT touched by the v0.7.0 codegen, so re-verification expected clean), open a new files claim on `packages/libs/graph-project/src/adjacency/**`, stage by explicit pathspec, run `pnpm check`, commit atomically with conventional message `feat(graph-project): add WS3.3 adjacency primitives (incoming/outgoing/neighbours)`. **Status sweep**: no graph code landed this session; Inc.1a remaining unchanged at 3 cycles (WS2.2, WS2.3, WS3.3).

Previous refresh: 2026-05-21 (Celestial Glimmering Moon / `claude` / `claude-opus-4-7` / `46d23a`) — three-agent team session opened (Celestial 46d23a, Molten Igniting Hearth 078515, Pelagic Sailing Beacon f72405); rendezvous resolved via comms-event cycle-collision protocol (earliest-timestamp wins per §3 of `start-right-team` First Moves). Operating shape: Celestial WS2.2 + per-commit gates; Molten WS3.3 + per-commit gates; Pelagic Inc.1a gate-sweeper + WS2.3 scout + reviewer cadence. **No graph product implementation landed this session.** Mid-session **cascade discovered**: the dirty SDK codegen tree inherited from `84638bc9` represents an intentional upstream API **v0.6.0 → v0.7.0** bump (`ks4Options` removed from `sequenceSlugs[]` in /subjects-family responses; `ks4ProgrammeFactors` added as required on /subjects/{subject}; 17-value subject enum constraint added; example payload swap art→science). Consumer cascade verified locally: 5 type errors + 2 lint errors in `@oaknational/search-cli` (sites enumerated in plan); 1 test failure in `@oaknational/curriculum-sdk` middleware-test (stale fixture body lacks now-required `ks4ProgrammeFactors`). Per AGENT.md Cardinal Rule, codegen + workspace alignment is one atomic operation. Plan authored: [`.agent/plans/sdk-and-mcp-enhancements/current/upstream-api-v0.7.0-alignment.plan.md`](../../../plans/sdk-and-mcp-enhancements/current/upstream-api-v0.7.0-alignment.plan.md) framed as expected maintenance with 8 explicit assumptions (A1–A8) and 4 workstreams (WS0 assumption verification, WS1 codegen idempotency, WS2 search-cli fix, WS3 curriculum-sdk test body, WS4 atomic commit + aggregate gate). All commits blocked on owner authorisation of A1 (v0.7.0 intent) + the chore(sdk): commit shape. Team holding cleanly per `all-quality-gates-blocking` + `local-broken-code-never-leaves` rules (Molten's correct stop-and-surface broadcast `3acec9` named the rules; no agent attempted `--no-verify` or bypass). **Behaviour failures captured in napkin this session**: (a) `bypass-as-progress` impulse fired when a pnpm long-body comms-append failed; owner corrected before I executed the bypass — high-confidence distilled candidate; (b) `preparation-as-progress` during plan authoring (over-reading templates while peers were blocked) — owner caught at the moment. Pending-graduations annotated with second-instance evidence for the `--body-file` CLI enhancement (root cause of (a) is shell argv corruption upstream of the CLI; CLI's own fail-fast-with-helpful-error discipline confirmed sound on missing-required-option test).

**Next-session entry shape for this thread**: read the cascade-clear plan above, surface to owner for A1 + execute-authorisation, then run WS0→WS4. After cascade clears, the three-way team session can resume: Celestial WS2.2 (claim closed this session — re-open against current branch state), Molten WS3.3 (ready-to-commit per their broadcast; will need to re-verify against post-cascade base), Pelagic gate-sweeper + WS2.3 scout. Inc.1a remaining after cascade clears: still 3 cycles (WS2.2, WS2.3, WS3.3); no graph progress this session.

Previous refresh: 2026-05-21 (Fiery Firing Cinder / `claude` / `claude-opus-4-7-1m` / `40c178`) — solo handoff after Foamy Charting Fjord (86dbd1) closed at 09:02:30Z. Mid-session pivot per owner direction: paused WS2.2 to land the all-channels comms CLI at `a9d0b8cf` (drainRelevantEvents + classifyEventForAgent + watch/inbox defaults emit every relevant event with self-exclusion only, tagged `[BROADCAST]`/`[GROUP]`/`[DIRECTED]`/`[LIFECYCLE]`; `--only-directed` opts into legacy narrow view). Encoded the principle in `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0 "Start The All-Channels Comms Monitor (non-negotiable)" as a precondition for team-session participation. 14 new tests; 433/433 green; 87/87 turbo cached pre-commit. **Honest scope flagged**: two-participant invariant for narrative-directed not yet refused at write time; `[SYNC]` view not yet wired (schema has no sync kind / urgency flag). WS3.2 graph-project toPropertyGraph round-trip projection LANDED at `abe6fcb3` (Foamy Charting Fjord / 86dbd1) followed by chore(plan) at `35b49858` — 11 invariant-#6 + behaviour tests, architecture-expert-betty GO-WITH-CONDITIONS + test-expert APPROVE-WITH-NITS absorbed in-cycle. WS2.2 itself NOT landed this session — owner direction redirected scope mid-session to the comms-CLI work as higher-priority structural cure. Falsifiability for the unlanded WS2.2 case: read comms events `bc7ca31a` + `e0397cb8` + `68c97705` and the owner-direction system messages in this session's transcript — they show the explicit pivot. Next session re-attempts WS2.2 with the cycle brief above.

Previous refresh: 2026-05-21 (Uplifted Swooping Wing / `claude` / `claude-opus-4-7-1m` / `8d9999`) — WS1.6 vocab registry LANDED at `3add41f9` (12 files, 444 insertions: seven standard W3C/community vocabularies — RDFS, SKOS, PROV-O, DCTERMS, OWL, SHACL, schema.org — as file-per-vocabulary const-typed NamedNode tables, every entry constructed via DataFactory.namedNode() for single canonical construction path; byIri reverse-lookup; @oaknational/type-helpers added as dep; 20 unit tests including type-level RDFS.label literal-narrowing assertion + cross-namespace collision invariant; CURRIC + EEF deferred to WS4.2 / EEF corpus plan). WS3.1 graph-project scaffold LANDED at `84bfffa5` (18 files, 312 insertions: workspace + three reserved sub-path barrels — `./property-graph` for types, `./projection` for toPropertyGraph, `./adjacency` for adjacency primitives — three-barrel split chosen over types-co-located-in-projection so adjacency does not depend on projection; graph-project added to `FOUNDATION_LIB_PACKAGES` in @oaknational/eslint-plugin-standards with boundary tests updated). Plus two lifecycle commits `db9d2e60` (WS1.6 plan + napkin entry capturing the decision-moment heuristic candidate) and `8e441bd0` (WS3.1 plan + parallel-pair boundary marker). **Verdict ratified for namedNode-at-every-entry** against literal-object alternative under owner-stated long-term-architectural-excellence frame: single canonical construction path enforces invariants in one place; literal-vs-factory split would be the replace-don't-bridge anti-pattern; type preservation works equivalently through `namedNode<const T>`. **Owner correction on reasoning hygiene received during dispatch-shape verdict**: plans are records of past reasoning, not evidence; memory entries about reliability issues are flags-to-verify not permanent prohibitions; "preferred / forbidden" dogma vocabulary closes inquiry. Captured in napkin (2026-05-21 entry). **Session closed at the parallel-pair boundary**; next session is the empirical two-agent Claude collaboration.

Previous refresh: 2026-05-13 (Quiet Stalking Mirror / `claude-code` / `claude-opus-4-7-1m` / `fe8a4f`) — WS1.5 pre-implementation review absorption + owner-stated doctrine record + URDNA2015→RDFC-1.0 plan-text remediation. No graph product implementation; WS1.5 implementation BLOCKED in-session by uncoordinated 43-44-file dirty slice (packageManager bump pnpm@10.33.4→@11.1.1, every workspace package.json, pnpm-workspace.yaml, pnpm-lock.yaml, SDK codegen artefacts) — no claim, no comms-event declared by the agent who produced it. Lockfile collision risk made adding `rdf-canonize` to graph-core deps unsafe. Three-reviewer absorption (code-expert APPROVE-WITH-NITS; assumptions-expert GO-WITH-CONDITIONS; architecture-expert-betty GO-WITH-RESHAPE) recorded inline in active graph-stack plan §ws1-canon along with the five-test set, the three-file layout, and the doctrinal rules. Sequencing comms event `b9961327` posted to Mossy Blossoming Canopy (no reply in session). Local pnpm install also failed with `husky: command not found` after the packageManager bump — surfaced in the comms event; mitigated locally by invoking `node agent-tools/dist/src/bin/agent-tools.js` directly. No active claim opened by this session (was blocked before reaching that step).

Previous refresh: 2026-05-13 (Solar Gliding Twilight / `codex` / `GPT-5` /
`019e1d`) — session-handoff/metacognition correction only. No graph product
implementation. Fixed the stale cold-start/self-bootstrapping section that still
routed fresh graph sessions to completed WS1.2. Current active plan remains the
authority: next executable choices are WS1.5 canon, WS1.6 vocab implementation
after the prep-note owner decisions, WS2.2 jsonld-compatible ingestion, or WS3.1
graph-project scaffold after a live root-file check. Live caveat at this refresh:
the worktree contains unrelated generated SDK/schema changes under
`packages/sdks/oak-sdk-codegen/`; preserve or isolate them before graph edits if
they are still present.

Previous refresh: 2026-05-13 (Luminous Threading Asteroid / `codex` /
`GPT-5` / `019e1d`) — session-handoff-only closeout after WS1.4 coordination
closeout and later graph-continuity repair commits were already landed. No
product implementation and no commit in this handoff per owner direction.
Initial handoff check saw a clean worktree and no active claims; before final
close, unrelated agentic-engineering P5 work appeared under Uplifted Wheeling
Sky. Connecting-oak next graph choices are unchanged.

Previous refresh: 2026-05-13 (Dim Hiding Secret / `codex` / `GPT-5` /
`019e1d`) — handoff-only closeout after WS1.6 prep had already landed at
`f36f98b1`; no new product or commit in this handoff. Active claims and commit
queue were empty; collaboration-state residue remains uncommitted by owner
direction.

Earlier refresh: 2026-05-13 (Solar Gliding Twilight / `codex` / `GPT-5` /
`019e1d`) — session-handoff continuity repair only. Live state before edits:
no directed inbox messages, no active peer claims, clean working tree. Opened
bounded file claim `c104b3a8-27eb-4fc2-9b52-fcc3160de0ab`, updated this thread
record plus repo-continuity, graph-stack plan, and napkin so the graph records
no longer name WS1.4 as pending/next. No product implementation in this session.

Earlier refresh: 2026-05-12 (Brazen Stoking Ash / `claude` /
`claude-opus-4-7-1m` / `913094` — peer-triple dispatcher session with
Lofty Vaulting Summit (codex / 019e1c) and Radiant Illuminating
Twilight (codex / 019e1c). WS1.3 landed at `87e21125` via Lofty
inside the pre-commit hook before my STOP message became
inbox-observable; outcome clean (no `--no-verify`). Sequence: (a) sent
Lofty WS1.3 GO after broadcast intro round-trip with Lofty; (b) dispatched
type-expert + architecture-expert-betty in parallel against the working
tree; (c) routed Betty's APPROVE-WITH-CONDITIONS back to Lofty for
DataFactory sub-path extraction; (d) Lofty absorbed the condition,
discovered `./data-factory` was NOT among the WS1.1 pre-declared
sub-paths and made the additive scaffold updates atomically;
(e) corrected my own protocol-incompatible attribution split (had
told Lofty "I run commit-queue end-to-end" — wrong; the 8-step protocol
assumes single-agent ownership; Lofty caught it); (f) third partner
Radiant joined mid-session, briefed on WS2.1 graph-ingest scaffold;
(g) cross-thread knip blocker on Vining's `1bb369a5` exports, escalated
to owner who confirmed Shaded Masking Shadow had taken the unblock;
(h) prematurely signalled Lofty GO inferring Vining's commit cleared
the gate without re-running it; (i) Shaded landed unblock at `730766ad`;
(j) Lofty landed WS1.3 inside the pre-commit window racing the STOP;
(k) assigned WS1.4 to Lofty; (l) handed over to Ferny Regrowing Leaf
via shared-log entry `8c4dc90a` and this thread record refresh.

**Captured frictions and lessons during this session** (also archived in
`napkin-2026-05-12b.md` + distilled by Dusky Lurking Shade):

- The gatekeeper must RUN the gate, not infer it from upstream-author
  commits ("verify gate before GO").
- STOP signal has an unrecoverable race window during the pre-commit
  hook (hook is uninterruptible; outcome was correct here by luck).
- `pnpm knip` standalone vs hook-invoked knip can disagree under
  concurrent landings (cache state / timing).
- `comms direct` and `claims active-agents` both require `--active <path>`
  but help text omits it; pnpm wrapper buries the diagnostic.
- Implementing-agent owns staging + commit (Lush correction); reviewer
  gates by verdict only — protocol assumes single-agent commit windows.
- Identity-discovery cost: peer-pair always needs one broadcast
  round-trip before `comms direct` is usable (no `comms presence`
  registry).
- `--body-file` would remove heredoc-quoting fragility on long briefs.
- 3-agent windows amplify the staged-only-gates P0 risk surface
  (markdownlint stale-sweep + knip cross-thread serialisation both
  observed today). Previous refresh: WS1.3 lands the RDF/JS-aligned
DatasetCore interface (1:1 with `@rdfjs/types` Dataset surface:
add/has/match/delete/iterable/size) plus DataFactory-style Term
constructors (namedNode, blankNode, literal, defaultGraph,
tripleTerm, quad). One commit, atomic-landing. Reviewer flags
(authoritative source is the YAML `content` field for
`ws1-dataset-core` in the active plan): type-expert (generic
match() iterator typing, @rdfjs/types alignment, DataFactory
literal-preservation) plus architecture-expert-betty (cohesion of
Dataset surface vs RDF/JS DataModel; whether DataFactory belongs
in the same cycle or its own). Inc.1a remaining cycle count is 10
(12 → 10 after V2 collapse + V3 deferral); the per-cycle inherited
patterns and reviewer flags are now recorded inline in each YAML
todo. WS1.6 vocab-registry's bare-literal-first-pass alternative
is an owner-direction flag for WS1.6 dispatch time, not blocking
WS1.3.

Previous refresh: 2026-05-12 (Clouded Vaulting Squall /
`claude` / `claude-opus-4-7-1m` / `866472` — holistic re-plan of
Inc.1a remaining cycles landed at `f73c42f5`. Plan-file diff
+79/-43. Five verdicts applied: V1 WS1.6 vocab-registry recorded
as file-scope parallel-safe with WS1.3 (dependency edge kept on
WS1.3 because vocab consumes the DataFactory namedNode
constructor; bare-literal-first alternative flagged for owner
direction). V2 WS1.4 expand + WS1.5 compact-frame collapsed into
one WS1.4 jsonld-processor cycle (shared file scope; framing-
determinism invariant #8 contract test cannot land without both
surfaces). V3 WS1.8 GraphDocument deferred to Inc.2 with
owner-set retrospective-review tripwire on §Increments row 2 —
the Inc.2 plan that takes ownership of GraphDocument MUST design-
review Inc.1 surfaces (WS1.3 Dataset + DataFactory, WS1.4 jsonld
processor, WS1.5 canon, WS1.6 vocab, WS2 graph-ingest, WS3
graph-project, WS4 graph-corpus-sdk) to identify what could be
expressed more efficiently, collapsed/removed, or reshaped
through GraphDocument; the review's verdict is binding on Inc.2
scope. V4 WS2.1 + WS3.1 scaffold depends_on corrected from
ws1-graph-document to ws1-graph-core-scaffold with inter-scaffold
serialisation invariant recorded. V5 WS3.3 adjacency scope
sharpened to property-graph node→node traversal only;
architecture-expert-barney collapse-vs-keep boundary check
flagged. Inherited patterns from WS1.1 + WS1.2 written into each
cycle: scaffold checklist (depcruise pathNot, eslint wsTsProject,
five-file bundle), per-kind checker-array dispatch for
discriminated-union equality, RDF/JS Data Model uniform-value-
string posture, "tree green" aligned to `.husky/pre-commit` as
authoritative source. Per-cycle reviewer flags now recorded
inline in YAML content fields. WS7 closure quality-gate
enumeration replaced with `pnpm check` reference). Previous
refresh: 2026-05-12 (Starlit Scattering Moon /
`claude` / `claude-opus-4-7-1m` / `edd1fb` — landed WS1.2 at
`1885fbcf`: 3 files +443/-2; `packages/core/graph-core/term/`
ships RDF/JS-aligned RDF 1.2 Term hierarchy (NamedNode | BlankNode |
Literal | DefaultGraph | TripleTerm) + Quad + free-function
`equals`. Cast-free per-kind checker-array dispatch; each branch
below complexity 8; recursive across Literal datatype + TripleTerm
children + Quad components. 18 unit tests green. Root barrel
re-exports as named exports; sub-path `@oaknational/graph-core/term`
remains the preferred entrypoint per ADR-179. 77/77 turbo gates
green. Reviewer: type-expert APPROVE-WITH-NITS; nit absorbed
(added `value: ''` to TripleTerm for RDF/JS Data Model conformance,
anticipating WS1.3 DatasetCore alignment). Full commit-queue
protocol followed: claim opened on files areas, intent enqueued,
record-staged, verify-staged, pre_commit, complete, claim closed).
Earlier 2026-05-12 (Celestial Transiting Satellite / `claude` /
`claude-opus-4-7-1m` / `9bc8e3` — landed WS1.1 at `ad2abb69`:
18 files +275/-1; `packages/core/graph-core/` scaffolded with six
pre-declared sub-path exports and empty barrels; root registrations
added across `pnpm-workspace.yaml`, `knip.config.ts`,
`pnpm-lock.yaml`, and `.dependency-cruiser.mjs`. Three reviewers
APPROVE — config-expert, architecture-expert-fred, test-expert. Full
commit-queue protocol followed: claim opened, re-scoped once on
depcruise discovery, intent enqueued/record-staged/verify-staged/
pre_commit/complete/closed). Earlier 2026-05-11 (Sparking Charring
Ash / `claude-code` / `claude-opus-4-7-1m` / `caf5e1`): ADR-173 +
ADR-179 Status: Proposed → Accepted; `graph-stack.plan.md` promoted
`current/` → `active/`; WS0 marked completed; WS1.1 row refined per
holistic review (Fred / type-expert / test-expert) and Barney
PROMOTION-READY verdict; doctrine corrections captured for
commit-queue discipline and knowledge-preservation-over-fitness.

## Self-Bootstrapping Continuation (cold-start landing)

A fresh session prompted with **"please continue the graph mvp work"**
should read this section and route through the active graph-stack plan before
editing. The direct implementation continuation is **Inc.1a**, not the
completed WS1.2 cold-start path. No additional briefing is required, but the
session must verify live dirty-tree and active-claim state before opening a
claim.

### State on session start

- ADR-173 (`docs/architecture/architectural-decisions/173-graph-stack-topology.md`)
  and ADR-179
  (`docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md`)
  both **Status: Accepted 2026-05-11**.
- Active plan:
  `.agent/plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`
  (lifecycle `active`). WS0, WS1.1, WS1.2, WS1.3, WS1.4, and WS2.1
  are completed. WS1.6 has a landed planning-prep note at `f36f98b1`.
- `packages/core/graph-core/` already carries Term/Quad, DatasetCore +
  DataFactory, and JSON-LD processor surfaces. The next `graph-core`
  implementation choices are WS1.5 `src/canon/` canonicalisation or WS1.6
  `src/vocab/` vocabulary registry implementation after respecting the owner
  decisions in the prep note.
- Cross-workspace Inc.1a choices are also available: WS2.2
  jsonld-compatible ingestion in `packages/libs/graph-ingest/`, or WS3.1
  `packages/libs/graph-project/` scaffold after a fresh root-file check.
- Branch: `feat/mcp-graph-support-foundation`. Recent landed graph foundation
  commits include WS1.1 `ad2abb69`, WS1.2 `1885fbcf`, WS1.3 `87e21125`, WS1.4
  `95f42cb7`, WS2.1 `0f895070`, WS1.6 prep `f36f98b1`, and WS1.4 coordination
  closeout `0d6f080a`.
- Immediate single-agent recommendation: WS1.5 canon is the cleanest linear
  continuation because it stays in `graph-core`, is unblocked by WS1.3/WS1.4,
  and avoids root registration files. The Oak Ontology Threads proof remains the
  first corpus/end-to-end proof, but it waits for the later `graph-corpus-sdk`
  Inc.1b/Inc.1c path.

### Scaffold checklist additions for future scaffold cycles (WS2.1, WS3.1, WS4.1)

Discovered during WS1.1; not yet in the canonical scaffold row in the plan:

1. `.dependency-cruiser.mjs` no-orphans `pathNot` exception for any
   pre-declared sub-path-export barrels (mirrors the
   `oak-sdk-codegen/src/(admin|zod|query-parser|observability)\.ts$`
   precedent). Absent registration produces six-error orphan
   failures at pre-commit even though every other gate is green.
2. config-expert nit (non-blocking, applies to graph-core today and
   any new workspace mirroring its eslint.config.ts): the
   `*.config.ts` block's `parserOptions.project` should use the
   resolved `wsTsProject` URL constant rather than the string
   literal `'./tsconfig.json'`; harmless today but inconsistent
   with the canonical pattern.

### Canonical scaffold reference

`packages/core/result/` is the canonical `packages/core/*` scaffold.
WS1.1 mirrors its file set with five additional items the WS1.1 row
calls out (all also encoded verbatim in the active plan's YAML
`todos` row `ws1-graph-core-scaffold`):

1. `tsup.config.ts` is multi-entry, not 3-line — `createLibConfig()`
   in `tsup.config.base.ts` defaults to single-entry `src/index.ts`
   and graph-core needs five sub-paths (`./term`, `./dataset`,
   `./jsonld`, `./canon`, `./vocab`). **Do not pass `dts` to
   `createLibConfig`** — declarations are produced only by
   `tsc --emitDeclarationOnly`; setting `dts` on tsup double-emits
   and collides.
2. `pnpm-workspace.yaml` is explicit (each workspace listed by exact
   path), not wildcard. `packages/core/graph-core` must be added to
   the `packages:` list.
3. `knip.config.ts` enumerates workspaces explicitly under
   `workspaces:`. Add a `'packages/core/graph-core': { project:
   ['src/**/*.ts'] }` entry; absent registration produces a repo-wide
   knip failure at pre-commit.
4. `tsconfig.lint.json` is required (canonical reference has it).
   Extends `./tsconfig.json`; pointed at by `eslint.config.ts`
   `wsTsProject` variable. Absence breaks ESLint project resolution.
5. `pnpm-lock.yaml` must be staged in the same commit as the
   scaffold — adding a workspace updates the lockfile.

### Zero tests in WS1.1

Test-expert verdict: vitest is wired (config files present) but the
first test lands in WS1.2 alongside the first product code (`Term`
union: NamedNode | BlankNode | Literal | DefaultGraph | TripleTerm,
plus `Quad`), per the atomic-landing invariant.

### "Tree green" definition

Matches `.husky/pre-commit` exactly (do not undercount):

- `format-check:root` (prettier) passes
- `markdownlint-check:root` passes
- `knip` passes (requires step 3 above)
- `depcruise` passes (WS1.1 required adding a `pathNot` exception
  for the six pre-declared sub-path-export barrels in
  `.dependency-cruiser.mjs`, mirroring the existing
  `oak-sdk-codegen/src/(admin|zod|query-parser|observability)\.ts$`
  precedent; without the exception, six `no-orphans` errors block
  the commit even though every other gate is green)
- `turbo run type-check lint test` passes across **all** workspaces
  (the new workspace's own gates exit 0; pre-existing workspaces
  unchanged; `vitest.config.base.ts:11 passWithNoTests: true` makes
  zero-tests-in-WS1.1 pass cleanly)

### Commit-message gotchas observed in the prior session

- The major-version-bump preventer hook
  (`scripts/prevent-accidental-major-version.ts`) matches
  `BREAKING CHANG` case-insensitively across the whole message.
  Avoid the prose phrase "breaking change(s)" anywhere in the
  body — reword to "incompatible" or similar.
- Pre-commit `markdownlint --dot .` scans the entire working tree,
  not just staged files. Peer-authored untracked markdown files can
  block your commit. The fix is `markdownlint --fix` on the offending
  peer file before retry (log the repair in the napkin); do not
  narrow gate scope or use `--no-verify`. This stale-gate-sweep race
  is tracked as a known repo defect in the
  `cost-of-collaboration.plan.md` (agent-tooling) P0 — staged-only
  gates.

### Commit-queue protocol — non-negotiable from step 1

The prior session was corrected mid-flight for skipping this. The
queue is the predictor for foreign `.git/index.lock` collisions;
staging before reading active-claims defeats its purpose.

1. Read `.agent/state/collaboration/active-claims.json` for live
   `git:index/head` claims AND `commit_queue` entries with `phase ∈
   {queued, staging, pre_commit}`. Filter by liveness
   (`claimed_at + freshness_seconds > now`).
2. Read recent `.agent/state/collaboration/shared-comms-log.md`
   tail for live coordination context.
3. **Only then** open active claim:
   `pnpm agent-tools:collaboration-state claims open --active
   .agent/state/collaboration/active-claims.json --thread
   connecting-oak-resources --area-kind git --area-pattern index/head
   --intent "..." --platform claude-code --model claude-opus-4-7-1m
   --now "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --ttl-seconds 900`.
4. Enqueue intent (`pnpm agent-tools:commit-queue -- enqueue
   --file ... --file ...`) BEFORE `git add`.
5. `phase staging` → `git add` by explicit pathspec →
   `record-staged` (fingerprint).
6. `pnpm agent-tools:check-commit-skill-advisories -- -F
   <msg-file>` (advisory; pre-existing fitness pressure on
   `napkin.md` / `repo-continuity.md` is NOT a commit verdict per
   repo doctrine).
7. `verify-staged --commit-subject "<exact subject>"` → `phase
   pre_commit` → `git commit -F <msg-file>`.
8. `complete --intent-id ...` → `claims close ...` with summary
   citing the SHA.

### Historical WS1.1 promotion note — superseded

The original post-WS1.1 promotion note routed to WS1.2. That route is now
complete: WS1.2 landed at `1885fbcf`, WS1.3 at `87e21125`, WS1.4 at
`95f42cb7`, and WS2.1 at `0f895070`. Do not use this historical block as the
next-step authority. Current implementation routing lives at the top of this
record and in the active graph-stack plan.

### Carry-in discipline summary

- `present-verdicts-not-menus` rule active (canonical at
  `.agent/rules/`; adapters in `.claude/rules/` and `.cursor/rules/`).
- Knowledge preservation is strictly prior to mechanical fitness
  warnings (repo doctrine; napkin/distilled entries are written when
  the moment occurs, not deferred for size reasons).
- 30%-context-for-directives budget.
- No-cheap-cure option discipline — only architectural-excellence
  shapes are legitimate options.
- ADRs permanent (no plan refs in body except canonical context);
  plans ephemeral.

### What the prior session shipped (for verification)

- `dbe7321c` — orphan markdown bundle landed (ADR-173 reviewer
  absorption, ADR-179 extraction, verdict-not-menu rule, plan body
  updates, session-scoped napkin).
- `5ec5004d` — ADR-173 + ADR-179 Status: Proposed → Accepted;
  `graph-stack.plan.md` promoted current → active; WS0 marked
  completed; WS1.1 row refined per holistic review by Fred,
  type-expert, test-expert; PROMOTION-READY verdict by Barney
  before ratification.
- `7560e48d` — session-close surfaces (thread record, continuity
  row, claim archives).
- `2ca54b01` — three-reviewer follow-up on WS1.1 cold-start
  surfaces: knip workspace registration, tsconfig.lint.json
  explicit naming, `do not pass dts to createLibConfig`
  instruction, pnpm-lock.yaml in commit scope, "tree green"
  expansion to match `.husky/pre-commit`, plan body status sweep,
  ADR-173 plan-path link cleanup, ADR index README update.

For the full session commit list, prefer
`git log --oneline 0be469a9..HEAD` over this static list — it
stays correct as further commits land.

`packages/core/graph-core/` is unblocked. Open the scaffold cycle.

---

**Prior refresh**: 2026-05-11 (Flamebright Burning Lava /
`claude-code` / `claude-opus-4-7-1m` / `b1202e` — question-
assumptions pass on the WS0 ADR brief. Three assumption-breaks
identified and verdicted (ADR-173 already exists; §Genuine Open
Decisions table was theatre; "deferrals" conflated three mechanics).
Plan body corrected: removed inaccurate "approved in principle
2026-05-11" claim, deleted §Genuine Open Decisions, rewrote WS0 +
§Promotion Trigger + §Dependencies to reference ADR-173 promotion
in place. Three reviewers dispatched in parallel against ADR-173:
architecture-expert-fred (COMPLIANT, one advisory amendment —
extract MCP-agnostic principle to separate ADR); architecture-
expert-betty (structurally fit, two pre-Inc.2/3 design preconditions
on graph-enhance/validate seam + graph-ingest/sdk parse extension
protocol); assumptions-expert (sound, build-vs-buy attestation
needed evidence depth, tripwire #6 reformulation, missing upstream-
ontology-change tripwire). Findings absorbed: ADR-173 tripwire
matrix updated (#2↔#5 cross-ref, #6 reformulated as continuous
contract test, #8 added for upstream ontology breaking changes);
plan body §Build-vs-Buy expanded with named alternatives per
library, §Test discipline gained tests 7 + 8, new §Reviewer
Absorption section records pre-Inc.2/3 design preconditions. Owner
resolved Open Question 2: extracted MCP-agnostic principle to
ADR-179 (Transport-Agnostic Graph Substrate — Surfacing Is A
Consumer-Side Concern); ADR-173 §"Transport discipline (see
ADR-179)" cross-references it; ADR-173 Related + 2026-05-11
amendment header updated. Secondary systemic landing: verdict-not-
menu pattern (recurred mid-session despite in-context feedback
memories) landed structurally — new canonical rule
`.agent/rules/present-verdicts-not-menus.md`, Claude + Cursor
adapters, RULES_INDEX entry, `jc-plan` skill SKILL-CANONICAL.md
§Before Writing item 1 rewritten with unknown-design-intent vs
analysed-and-have-verdict distinction, distilled.md entry, napkin
observation. **Next-session entry point**: surface ADR-173 +
ADR-179 to owner for final approval; on approval flip both
Proposed → Accepted, promote graph-stack CURRENT → ACTIVE, open
Inc.1a WS1.1.)

**Prior refresh**: 2026-05-11 (Shaded Ripening Copse /
`claude-code` / `claude-opus-4-7-1m` / `c13bdf` —
schedule-not-trigger sweep of `graph-stack.plan.md` and
`graph-combinatorial-arc.plan.md` per the doctrine ratified by the
prior `Mistbound Watching Lantern` session. Three atomic commits:
`5c1cd339` (graph-stack: Inc.2–7 trigger framings converted to
scheduled positions or named open decisions; new §Genuine Open
Decisions with O-1 WS0 topology ADR approval + O-2 increment
promotion ownership; Inc.4 written as hard predecessor on Inc.2 AND
agent-graphs org plan; cross-plan trigger relocated out of this
plan); `ff3ab004` (combinatorial-arc: design-stability wording
removed from frontmatter promotion_trigger + body echoes; concrete
todo `d6-inc3-join-api-review` absorbs D-6 from graph-mvp-arc Open
Decisions; `predecessor_substrate` frontmatter field added making
graph-stack coupling machine-discoverable; new §Decisions Absorbed
section); `5c299ed5` (agent-tooling: B-02 + B-03 + Workstream 4
architectural seam — the third commit lands in the
`agentic-engineering-enhancements` thread per opener routing, but
captured here because its substance is the commit-queue UX brief
explicitly named in this session's opener). Four reviewer
dispatches (architecture-expert-betty + assumptions-expert against
graph-stack; architecture-expert-betty + docs-adr-expert against
combinatorial-arc); all GO WITH CONDITIONS; conditions absorbed.
Owner direction applied at decision boundary: broad-scope sweep
(Betty) over narrow (assumptions); Inc.4 concrete hard predecessor;
cross-plan trigger removed from graph-stack and reshaped only in
combinatorial-arc. Parallel peer `Soaring Darting Kite` consolidate
commit `8f0dacd5` landed cleanly via explicit-pathspec staging on
both sides; no foreign-state absorption. **Next graph-engineering
entry point — definite sequence**: owner approved the topology in
principle 2026-05-11 pending reviewer input. Next session: (1)
author WS0 topology ADR in
`docs/architecture/architectural-decisions/` as `Status: Proposed`
sourcing from `graph-stack.plan.md` §Topology Decision + §Design
Principles + §Build-vs-Buy Attestation + §Risk Assessment, citing
ADR-041 / ADR-154 / ADR-157 / ADR-173 as Accepted neighbours; (2)
dispatch architecture-expert-betty + architecture-expert-fred +
assumptions-expert in parallel; (3) absorb findings into the ADR;
(4) surface refined ADR for final approval; (5) on final approval
O-1 closes, gates 1+2 of §Promotion Trigger close, graph-stack
moves CURRENT → ACTIVE, Inc.1a WS1.1 (`graph-core` workspace
scaffold) opens for test-first execution.)

**Prior refresh**: 2026-05-11 (Mistbound Watching Lantern /
`claude-code` / `claude-opus-4-7-1m` / `8fdb8b` —
graph-mvp-arc review-absorption + doctrine ratification. Three-reviewer
fresh-eyes review of `graph-mvp-arc.plan.md` (architecture-expert-betty +
assumptions-expert + docs-adr-expert) absorbed into one atomic commit
`67885e3f` plus the prior ADR-173 topology annotation `ae8cce2a`. Nine
owner-directed findings landed: D-3 resolved as concrete sequence
position (migration plan opens after Inc.3 misconception-adapter,
precedes combinatorial Phase 1); D-1 forcing function added as spine
todo `name-ai-client-adoption-owner` (gate-1 blocked until owner +
mechanism named); shape-understanding evidence templated to five
named questions per slice; partnership-conversation opener added to
slice 1 acceptance; D-6 routed to combinatorial arc as Inc.3
design-phase todo; D-7 marked resolved; EEF source-authority kept as
repo-held JSON (no premature seam); ADR-157 amendment section
collapsed to link + summary; sub-increment naming applied to gates
2 + 3a (Inc.1b specifically); gate-0 status reconciled from "in
place" to "pending" against empirical state. **Doctrine ratified
(owner 2026-05-11)**: schedule it, sequence it, no imaginary flows —
trigger framings ("when X ships," "depends on Y future," "activates
when") are imaginary flows that quietly stall; plans must commit to
concrete scheduled sequence positions. Captured as feedback memory.
Doctrine applied across the MVP arc; **graph-stack.plan.md and
graph-combinatorial-arc.plan.md sweeps remain pending** as the
next-session work. **Surprises captured this session**: opener
premise stale (steps 1–3 already done by parallel session by session
open); foreign-stage absorption swept 23 of Smouldering Crackling
Pyre's R1.b files into my MVP arc commit attempt — owner accepted
the bundle; commit-queue protocol failed twice this session (broken
build from in-flight schema refactor; record-staged step clearing
the index). **Memory captured**: feedback_simple_definite_no_imaginary_flows

- feedback_agents_default_no_gender (agents have no gender by
default; use they/them unless self-declared).)

**Prior refresh**: 2026-05-11 (Dusky Masking Cloak / `claude-code` /
`claude-opus-4-7-1m` / `c5ff7f` — graph execution-prep steps 1+2+3
landed. Step 1: D-4 topology BLOCKERs verified closed in-place by the
2026-05-10 graph-stack edit; surfaced sub-task D-4a — ADR-041 needs
an amendment to add `agent-graphs/` (and regularise `agent-tools/`) as
top-level workspace tiers before ADR-173 can move from Proposed to
Accepted. D-4 closed in graph-mvp-arc Open Decisions; D-4a routed.
Step 2: graph-stack Inc.1 decomposed into Inc.1a (substrate scaffolding —
WS1+WS2+WS3, three disjoint workspace trees) / Inc.1b (Threads adapter —
WS4.1+WS4.2) / Inc.1c (query proof — WS4.3) / closure (WS0+WS5–WS8);
code-expert surfaced and absorbed: WS2.1+WS3.1 are NOT parallel-safe
(root-file conflicts on `pnpm-workspace.yaml`, root `tsconfig.json`,
root `package.json`) — only WS2.2+WS3.2 and WS2.3+WS3.3 are.
WS4.2's earliest-start refinement: depends on WS1.7 + WS4.1, not on
all of Inc.1a. Step 3: EEF plan gains 9 capability workstreams + 1
coordination workstream as a dispatch lens; 20 todos byte-preserved.
Three atomic commits: `66d4f0fb`, `579cde34`, `85bcbc41`. Full pre-
commit gates green on every commit. **Next graph session entry point
unchanged**: opener step 4 — primary-agent-tooling-enhancements WS 2–5
implementation + B-01 fix; test-first atomic TDD. First Inc.1
implementation work still gated on opener step 4 closing.)

**Prior refresh**: 2026-05-11 (Blooming Growing Thicket / `claude-code` /
`claude-opus-4-7-1m` / `756c60` — MVP arc reshape, execution-prep opener,
and collaboration hardening opener. **Next graph session entry point**:
[`2026-05-11-graph-execution-prep-opener.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-11-graph-execution-prep-opener.md)
naming the four definite steps before graph execution begins (D-4
topology BLOCKERs; Inc.1 decomposition; EEF WS restructure;
collaboration-protocol Workstreams 2–5). Parallelisability findings and
open decisions D-1 through D-7 are discoverable in
[`graph-mvp-arc.plan.md`](../../../plans/graph-mvp-arc.plan.md) §
Team-of-Agents Execution. Separate
[`collaboration-protocol hardening opener`](../../../plans/agent-tooling/current/2026-05-11-collaboration-protocol-hardening-opener.md)
authored for the agentic-engineering-enhancements thread to address the
real ceiling on safe N-agent work. Owner direction:
substrate-for-three-sources establishes before combinatorial exploration;
each of the three corpora (EEF, Oak ontology, Oak misconceptions)
carries co-primary value as substrate + shape-understanding +
surfacing-exploration; teacher value is downstream of AI-client
adoption. Four-dimension value model (substrate / shape-understanding /
surfacing-exploration / partnership-or-combinatorial) replaces the
per-slice "user value triplet" framing. Slice 3b moves OUT of MVP arc;
new [`graph-combinatorial-arc.plan.md`](../../../plans/graph-combinatorial-arc.plan.md)
authored in `current/` owns substrate-layer cross-corpus composition;
its promotion trigger fires on MVP arc gate-1 + gate-3a shipped +
graph-stack Inc.3 design-stable. Slice-3b executable plan migrated from
`current/` to `future/` with spine pointer repointed. gate-1 → gate-3a
strict gate relaxed to parallel-safe with gate-2 (substrate streams are
co-primary). graph-stack Inc.3 now carries downstream-consumer
cross-reference to the combinatorial arc — Inc.3 retains its forcing
function. Plan-time reviewers (assumptions-expert, architecture-expert-
betty, docs-adr-expert) GO-WITH-CONDITIONS — all conditions absorbed
into the reshape. First graph engineering work remains graph-stack
Inc.1's Oak Ontology Threads proof in `graph-corpus-sdk` — that is
unchanged. The next-session action is to land the reshape commit, then
the focus returns to graph-stack Inc.1 once the topology BLOCKERs
surfaced 2026-05-07 are absorbed.)

**Prior refresh**: 2026-05-10 (Fragrant Regrowing Root / `codex` / GPT-5 /
`019e12` — source-authority clarification + handoff. Owner clarified the
three corpus sources: EEF uses the repository-held JSON snapshot as canonical
for implementation until EEF clarifies provenance/refresh; Oak ontology raw
material comes from the `oaknational/oak-curriculum-ontology` GitHub source of
truth; the misconception graph is constructed in this repo from Oak bulk data
during bulk-data processing. ADR-173, ADR-157, the graph MVP arc, graph-stack,
slice 3a/3b, and EEF plans now carry the clarification. The first graph work
remains graph-stack Inc.1's Oak Ontology Threads proof in `graph-corpus-sdk` —
enumerate `curric:Thread` and resolve inverse `curric:includesThread` Unit
lookup with a tiny fixture-backed test. This must land before NC work, EEF
adapter migration, misconception replatform, cross-corpus joins, serving
prototypes, or broader query-layer migration. Targeted markdownlint,
`git diff --check`, and JSON parse checks passed.)

**Prior refresh**: 2026-05-10 (Foamy Navigating Hull / `codex` / GPT-5 /
`019e12` — graph MVP plan amendment + handoff. Owner clarified the boundary:
the MVP still needs EEF + misconception graph + cross-source value; the
restriction is that the Oak Ontology repo intake brings in only the Oak
ontology/graph, not the NC graph/taxonomy. Plans now explicitly name the first
graph work: graph-stack Inc.1's Oak Ontology Threads proof in
`graph-corpus-sdk` — enumerate `curric:Thread` and resolve inverse
`curric:includesThread` Unit lookup with a tiny fixture-backed test. This must
land before NC work, EEF adapter migration, misconception replatform,
cross-corpus joins, serving prototypes, or broader query-layer migration.
Targeted markdownlint, prettier check, and `git diff --check` passed on the
amended plan files.)

**Prior refresh**: 2026-05-09 (owner direction via `jc-session-handoff` /
Fronded Bending Blossom / `cursor` / Composer / `60775a` — **next engineering
arc**: implement **graph MVP features** per slice plans after PR #102 merge
prep completes (post-merge type-check + gates). **Parked until later**:
monorepo workspace topology ADR / **S0–S6** programme
(`architecture-and-infrastructure/future/monorepo-workspace-topology-adr-and-canonical-plan.plan.md`).
Prior evidence block below remains authoritative for PR #102 state until
refreshed against live GitHub.)

**Prior refresh**: 2026-05-08 (Opalescent Shimmering Orbit / codex /
GPT-5 / `019e06` — PR #102 graph planning closeout is decision-complete and
pushed as head `309d9e5e44cebecb1be2478d2fb084a54f39b6b2`. GitHub checks pass,
SonarCloud Code Analysis passes through PR checks, and all known review threads
are resolved. Branch-touched-files reports `107`, so PR #102 is not
merge-ready until the final clean-worktree dry-run merge/abort is run. Latest
owner decisions applied in this pass: EEF verification is structural-only for
slice 1; LLM/outcome eval is follow-on infrastructure; practice-facing graph
tooling lives under `agent-graphs/practice-graph/`. Current plan:
[`2026-05-08-pr102-graph-decision-complete-closeout.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md).
Historical note at time of that refresh: next session was framed as clearing
the final merge blocker before implementation.)

```text
Decision-complete: YES
Merge-ready with respect to graph planning: NO
Remaining blocker: the 107-file branch requires the final pre-merge workflow
on a clean worktree. Current unrelated local scratch state in
.agent/plans/notes/ must be preserved or isolated before the dry-run.
Owner decisions resolved: structural-only EEF slice 1 evaluation; LLM/outcome
eval follow-on; `agent-graphs/practice-graph/`; slice 3a 16k budget +
20-context fixture; slice 3b Thread IRI substrate-only runtime; ADR-173 remains
Proposed.
Validation: markdownlint, format-check, git diff --check, branch-touched-files,
gh pr checks on pushed head 309d9e5e, Sonar PR surface through PR checks,
review-thread refresh with all threads resolved, non-mutating divergence probe.
Next safe step after merge: **first graph MVP implementation piece** is
graph-stack Inc.1's Oak Ontology Threads proof in `graph-corpus-sdk`
(`curric:Thread` enumeration + inverse `curric:includesThread` Unit lookup
with a tiny fixture-backed test). Defer NC taxonomy work, EEF adapter
migration, misconception replatform, cross-corpus joins, serving prototypes,
and broader query-layer migration until after that proof lands. Defer monorepo
topology ADR work until after the graph MVP tranche.
```

**Prior refresh**: 2026-05-08 (Fronded Branching Grove / codex /
GPT-5 / `019e06` — PR #102 technical closeout is green on
`a8ef3ad1be343d2b786416ce12dcfeca270fb56e`: GitHub merge state `CLEAN`,
root `run-quality-gates`, CodeQL, SonarCloud Code Analysis, and Vercel pass;
Sonar MCP reports quality gate `OK`, zero open PR issues, and zero new
violations; unresolved review threads are zero. Owner direction after that
closeout: PR #102 must not merge until the graph plans are finalised and
decision-complete. New current plan:
[`2026-05-08-pr102-graph-decision-complete-closeout.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md).
**Next session starts with final graph decision-completeness closeout, not
merge and not slice implementation.**)

**Prior refresh**: 2026-05-08 (Lush Rustling Bark / codex /
GPT-5 / `019e03` — owner-requested `jc-session-handoff` refresh for PR #102.
Current head is `df66b742694d1bfdd757019c97414945540eabf5`; PR title/body
are stale and must be rewritten after comparing `origin/main...HEAD`; the
branch differs from `origin/main` by 93 files, 6595 insertions, and 770
deletions. GitHub merge state is `BLOCKED` because SonarCloud Code Analysis
fails; Sonar MCP reports quality gate `ERROR`, four open issues, and zero
`TO_REVIEW` hotspots. Nine review threads remain unresolved: four are
outdated-and-fixed graph comments, three are fixed-but-undismissed current
threads, one schema docstring mismatch is live, and one PR metadata mismatch is
live. **Next session starts with PR #102 closeout, not graph planning work.**)

**Prior refresh**: 2026-05-07 (Lush Rustling Bark / codex /
GPT-5 / `019e03` — after the owner-directed PR #102 comment harvest, two new
live Copilot threads remained. The follow-up fixed branch-touched-files
CLI precedence/help and explicit Git executable portability with focused
tests. The same closeout resolved root lint failures from deprecated Oak
ESLint config helper usage by moving to ESLint core `defineConfig()`, while
keeping the local Oak plugin segment at the typed config boundary. Root
`pnpm lint` passes. **Next safe step after push**: re-check PR #102
comments/review threads, GitHub checks, and Sonar PR state on the new head;
then proceed only if no live feedback remains.)

**Prior refresh**: 2026-05-07 (Twigged Shedding Fern / codex /
GPT-5 / `019e03` — PR #102 snagging landed and pushed as `e8050400`.
The pass fixed the three graph-layer taxonomy review comments, the
primitive-wording comment, the branch-touched-files parser index issue,
and the Git subprocess-boundary Sonar hotspots. GitHub checks and
SonarCloud are green; Sonar MCP reports quality gate `OK`, zero open
issues, and zero `TO_REVIEW` hotspots. The four known Copilot review
threads are obsolete/outdated on the new head. **Owner direction for the
next session**: fetch remaining PR #102 comments and review threads,
then analyse whether any live reviewer feedback remains before editing.)

**Prior refresh**: 2026-05-07 (Breezy Navigating Sail / cursor /
claude-opus-4.7 / `9edbd1` — closed the MVP-arc PLANNING arc in a
single session per owner direction. Pre-flight + Phase 0 (spine drift
remediation, commit `d740baa0`) + Phase 1 (3-reviewer parallel batch
over 5 MVP-arc artefacts + topology) + Phase 2 (4 spine remediations,
commit `82b3a792`) + Phase 3 (3 slice plans authored, commit
`776df6b7` — `oak-kg-threads-surface.plan.md`,
`oak-misconceptions-subgraph-mcp-surface.plan.md`,
`oak-misconceptions-eef-cross-corpus-surface.plan.md`) + Phase 4
(2 BLOCKERs remediated, 6 FINDINGS deferred, commit `0899ba93`) +
Phase 5 (spine + thread record updates). Reviewer scope reduced per
owner direction: `code-expert` + `assumptions-expert` in series
across phases 1 + 4; `architecture-expert-betty` for topology in
parallel; out-of-scope reviewers (`mcp-expert`, `docs-adr-expert`,
`architecture-expert-fred`) explicitly skipped this session.
**Next session = decision-completeness closeout (per owner direction
2026-05-07; implementation OUT of scope for this branch)**: absorb
topology BLOCKERs into `graph-stack.plan.md` and ADR-173, absorb
remaining Phase 4 FINDINGS into the three slice plans and slice 1,
resolve the EEF plan internal contradiction, then verify
decision-complete state across the full MVP plan (spine, 3 slice
plans, slice 1, substrate, ADR-173). This historical queue is superseded by
the 2026-05-08 structural-only EEF decision. NO slice execution; NO
graph-stack ACTIVE promotion; NO ADR-173 ratification.
**Prior**: 2026-05-07 — Windward Darting Horizon / cursor /
claude-opus-4.7 / `dd084d` — authored
[`graph-mvp-arc.plan.md`](../../../plans/graph-mvp-arc.plan.md) at
top-level as a cross-collection coordination spine sequencing three
vertical slices: (1) EEF evidence corpus MCP surface; (2) Oak ontology
Threads MCP surface; (3) misconception sub-graph queries +
EEF×misconceptions cross-corpus composition. Coordination amendments
landed: ADR-157 namespace table extended (`oak-misconceptions-*` +
compound prefix + explicit-source-attribution discipline);
[`eef-evidence-corpus.plan.md`](../../../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md)
tool/prompt names re-prefixed `eef-*` (19 occurrences via 5
replace-alls); [`graph-portfolio-index.md`](../../../plans/graph-portfolio-index.md)
gained `## Vertical-slice arc` section pointing at the spine;
[`high-level-plan.md`](../../../plans/high-level-plan.md) cross-links
the spine from the Cross-cutting Threads section. **Course
corrections in same session**: (a) added unsequenced
`mvp_arc_status: deferred` annotation to NC SKOS taxonomy plan —
reverted by owner direction *"sequence properly or admit not-doing"*;
(b) re-introduced under different framing as `mvp_arc_sequencing` +
out-of-arc tracking — reverted by owner direction *"the NC work is
explicitly NOT part of the MVP"*. Final state: NC plan carries its
own `promotion_trigger` (demand-tripwire on SKOS-specific demand) in
its own frontmatter; spine plan tracks ONLY what's IN the MVP. No
commits during planning; commit chunks landed at session close.
**Prior**: 2026-05-04 — Cosmic Glowing Dawn / claude-code /
claude-opus-4-7-1m / `d11500` — authored
[`graph-stack.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md)
in `current/` as the topology-decision-plus-foundation-increment
spine plan for graph work. Historical topology was eight active workspaces
plus one deferred; PR #102 closeout updates this to seven active graph
workspaces plus one deferred
(`graph-future`); reserves a workspace home for every layer in
`.agent/research/graph-library.research.md` (renamed 2026-05-07 from `graph-iibrary.md`). Foundation increment ingests the
NC knowledge taxonomy end-to-end via SKOS-on-`graph-core`; no
surfacing in the increment (graph workspaces are MCP-agnostic per
owner direction; surfacing is consumer-side, at most one workspace
per transport). Plan is `current` — owner explicitly stated no
promotion now. Substrate-path supersession declared for
`nc-knowledge-taxonomy-surface.plan.md` and `graph-query-layer.plan.md`
in coordination map; their MCP-surfacing concerns remain independent
owner decisions. Collection README updated to register the spine plan
and reflect substrate-vs-surfacing split. Transport-agnostic-substrate
principle saved to platform memory
(`feedback_infrastructure_workspaces_transport_agnostic.md`); also a
PDR candidate (see ADR/PDR candidates below). No commits this session.
**Foreign stage observed**: `Ferny Spreading Petal` (`d0d13f`,
agentic-engineering-enhancements thread) has files staged from a
commit window that expired at 15:09:49Z (~40 min before this handoff)
without committing; underlying claim still fresh until 18:35:05Z.
Surfaced for owner attention. **Prior**: 2026-05-01 — Gnarled
Fruiting Root / claude-code / claude-opus-4-7-1m / `e18e2c` — created
the thread by owner direction; light scan of the three external Oak
repos; no blocking findings for Increment 1 graph-query-layer
promotion.)

---

## Thread Identity

- **Thread**: `connecting-oak-resources`
- **Thread purpose**: Connect Oak's own resources into this repo.
  Two complementary streams:
  - **Internal Oak knowledge-graph work** — the existing
    knowledge-graph-integration plans (graph-query-layer,
    graph-resource-factory, misconception/NC/open-education
    surfaces, kg-integration-quick-wins, kg-alignment-audit,
    cross-source-journeys, ontology-integration-strategy,
    ontology-repo-fresh-perspective-review, oak-curriculum-ontology-
    workspace-reassessment, direct-ontology-use-and-graph-serving-
    prototypes, agent-guidance-consolidation).
  - **External Oak references** — research and selective adoption
    from Oak's other public repos (oak-curriculum-ontology, Aila /
    oak-ai-lesson-assistant) plus concepts-only learning from Oak's
    private repos (oak-ai-moderation-service, aila-atomic-concepts).
- **Branch**: `planning/graph-tooling` for the current MVP-arc planning
  closeout branch.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `thread-bootstrap-and-light-scan` | 2026-05-01 | 2026-05-01 |
| `Cosmic Glowing Dawn` | `claude-code` | `claude-opus-4-7-1m` | `d11500` | `graph-stack-spine-plan-author` | 2026-05-04 | 2026-05-04 |
| `Windward Darting Horizon` | `cursor` | `claude-opus-4.7` | `dd084d` | `mvp-arc-spine-plan-author-and-coordination-amendments` | 2026-05-07 | 2026-05-07 |
| `Breezy Navigating Sail` | `cursor` | `claude-opus-4.7` | `9edbd1` | `mvp-arc-planning-closure-single-session` | 2026-05-07 | 2026-05-07 |
| `Tidal Surfing Lighthouse` | `codex` | `GPT-5` | `019e03` | `decision-completeness-closeout-fixer` | 2026-05-07 | 2026-05-07 |
| `Twigged Shedding Fern` | `codex` | `GPT-5` | `019e03` | `pr-102-snagging-and-pr-comment-refresh-handoff` | 2026-05-07 | 2026-05-07 |
| `Lush Rustling Bark` | `codex` | `GPT-5` | `019e03` | `pr-102-live-thread-follow-up-lint-hardening-and-handoff` | 2026-05-07 | 2026-05-08 |
| `Fronded Branching Grove` | `codex` | `GPT-5` | `019e06` | `pr-102-final-closeout` | 2026-05-08 | 2026-05-08 |
| `Opalescent Shimmering Orbit` | `codex` | `GPT-5` | `019e06` | `pr-102-graph-decision-complete-closeout-updater` | 2026-05-08 | 2026-05-08 |
| `Fronded Bending Blossom` | `cursor` | `Composer` | `60775a` | `owner-sequencing-graph-mvp-next-topology-parked` | 2026-05-09 | 2026-05-09 |
| `Foamy Navigating Hull` | `codex` | `GPT-5` | `019e12` | `graph-mvp-plan-amendment-and-first-implementation-handoff` | 2026-05-10 | 2026-05-10 |
| `Fragrant Regrowing Root` | `codex` | `GPT-5` | `019e12` | `source-authority-clarification-and-handoff` | 2026-05-10 | 2026-05-10 |
| `Blooming Growing Thicket` | `claude-code` | `claude-opus-4-7-1m` | `756c60` | `mvp-arc-reshape-author-and-execution-prep-opener-author` | 2026-05-11 | 2026-05-11 |
| `Dusky Masking Cloak` | `claude-code` | `claude-opus-4-7-1m` | `c5ff7f` | `graph-execution-prep-steps-1-2-3-author` | 2026-05-11 | 2026-05-11 |
| `Mistbound Watching Lantern` | `claude-code` | `claude-opus-4-7-1m` | `8fdb8b` | `graph-mvp-arc-review-absorption-and-doctrine-ratification` | 2026-05-11 | 2026-05-11 |
| `Shaded Ripening Copse` | `claude-code` | `claude-opus-4-7-1m` | `c13bdf` | `graph-stack-and-combinatorial-arc-schedule-not-trigger-sweep` | 2026-05-11 | 2026-05-11 |
| `Flamebright Burning Lava` | `claude-code` | `claude-opus-4-7-1m` | `b1202e` | `question-assumptions-adr-173-promotion-and-verdict-not-menu-nudges` | 2026-05-11 | 2026-05-11 |
| `Sparking Charring Ash` | `claude-code` | `claude-opus-4-7-1m` | `caf5e1` | `graph-foundation-work-orphan-bundle-land-adr-ratification-plan-promotion-ws1-1-refinement-three-reviewer-followup` | 2026-05-11 | 2026-05-12 |
| `Celestial Transiting Satellite` | `claude` | `claude-opus-4-7-1m` | `9bc8e3` | `ws1-1-graph-core-scaffold-landed-at-ad2abb69` | 2026-05-12 | 2026-05-12 |
| `Starlit Scattering Moon` | `claude` | `claude-opus-4-7-1m` | `edd1fb` | `ws1-2-rdf-term-hierarchy-and-quad-equality-landed-at-1885fbcf` | 2026-05-12 | 2026-05-12 |
| `Clouded Vaulting Squall` | `claude` | `claude-opus-4-7-1m` | `866472` | `inc-1a-holistic-re-plan-author-12-to-10-cycles-landed-at-f73c42f5` | 2026-05-12 | 2026-05-12 |
| `Brazen Stoking Ash` | `claude` | `claude-opus-4-7-1m` | `913094` | `ws1-3-dispatcher-reviewer-gatekeeper-peer-triple-with-lofty-and-radiant-ws1-3-landed-at-87e21125` | 2026-05-12 | 2026-05-12 |
| `Lofty Vaulting Summit` | `codex` | `GPT-5` | `019e1c` | `ws1-3-datasetcore-datafactory-implementation-landed-at-87e21125-session-closed-before-ws1-4` | 2026-05-12 | 2026-05-12 |
| `Radiant Illuminating Twilight` | `codex` | `GPT-5` | `019e1c` | `ws2-1-graph-ingest-scaffold-landed-at-0f895070-after-commitlint-hook-unblock-42f2e721` | 2026-05-12 | 2026-05-12 |
| `Dim Hiding Secret` | `codex` | `GPT-5` | `019e1d` | `ws1-6-vocab-planning-prep-landed-at-f36f98b1` | 2026-05-12 | 2026-05-13 |
| `Luminous Threading Asteroid` | `codex` | `GPT-5` | `019e1d` | `coordinator-handover-and-ws1-4-review-routing-closeout-at-0d6f080a` | 2026-05-12 | 2026-05-13 |
| `Fiery Igniting Furnace` | `codex` | `GPT-5` | `019e1d` | `ws1-4-jsonld-processor-landed-at-95f42cb7` | 2026-05-12 | 2026-05-12 |
| `Solar Gliding Twilight` | `codex` | `GPT-5` | `019e1d` | `ws1-4-review-support-plus-continuity-cold-start-route-repair` | 2026-05-12 | 2026-05-13 |
| `Quiet Stalking Mirror` | `claude-code` | `claude-opus-4-7-1m` | `fe8a4f` | `ws1-5-pre-implementation-review-absorption-plus-doctrine-record-no-aliases-no-fallbacks-fail-fast-replace-old-with-new-implementation-blocked-by-uncoordinated-43-file-dirty-slice` | 2026-05-13 | 2026-05-13 |
| `Coppery Kindling Anvil` | `cursor` | `claude-opus-4-7` | `536dd4` | `ws1-5-design-absorption-commit-39b3271d-with-owner-authorisation-commit-all-files-regardless-of-claims` | 2026-05-13 | 2026-05-13 |
| `Riverine Swimming Hull` | `claude` | `claude-opus-4-7-1m` | `304dde` | `cross-thread-program-pointer-registration-only-no-implementation-this-thread-participates-as-graph-foundations-lane-4B-of-token-remediation-p8-parallel-program-step-4-implementation-paused-until-step-3-p8-acceptance` | 2026-05-14 | 2026-05-14 |
| `Uplifted Swooping Wing` | `claude` | `claude-opus-4-7-1m` | `8d9999` | `ws1-6-vocab-registry-landed-at-3add41f9-seven-standard-w3c-community-vocabularies-rdfs-skos-prov-dcterms-owl-shacl-schema-org-with-file-per-vocab-data-factory-named-node-at-every-entry-byiri-reverse-lookup-curric-eef-deferred-then-ws3-1-graph-project-scaffold-landed-at-84bfffa5-with-three-reserved-sub-path-barrels-property-graph-projection-adjacency-three-barrel-split-keeps-adjacency-dependency-direction-clean-graph-project-added-to-foundation-lib-packages-with-boundary-test-updates-parallel-pair-boundary-now-open-ws2-2-vs-ws3-2` | 2026-05-21 | 2026-05-21 |
| `Foamy Charting Fjord` | `claude` | `claude-opus-4-7-1m` | `86dbd1` | `ws3-2-graph-project-topropertygraph-round-trip-projection-landed-at-abe6fcb3-paired-with-fromPropertyGraph-reverse-and-invariant-6-reconstructability-contract-test-plus-internal-rdf-vocab-module-followed-by-chore-plan-record-at-35b49858` | 2026-05-21 | 2026-05-21 |
| `Fiery Firing Cinder` | `claude` | `claude-opus-4-7-1m` | `40c178` | `ws2-2-paired-partner-deferred-to-foamy-on-ws3-2-collision-then-owner-directed-pivot-to-all-channels-comms-cli-landed-at-a9d0b8cf-with-skill-section-0-amendment-empirical-test-of-two-agent-claude-collaboration-on-shared-checkout-confirmed-working-shape` | 2026-05-21 | 2026-05-21 |
| `Celestial Glimmering Moon` | `claude` | `claude-opus-4-7` | `46d23a` | `three-agent-team-session-ws2-2-gate-runner-no-graph-code-landed-upstream-api-v0-7-0-cascade-discovered-and-cascade-clear-plan-authored-at-sdk-and-mcp-enhancements-current-upstream-api-v0-7-0-alignment-plan-plus-start-right-team-skill-update-for-inherited-tree-gate-verification-and-dialogue-not-competition-reframe` | 2026-05-21 | 2026-05-21 |
| `Molten Igniting Hearth` | `claude` | `claude-opus-4-7-1m` | `078515` | `three-agent-team-session-ws3-3-implementer-bundle-ready-to-commit-but-cascade-blocked-in-working-tree-22-vitest-green-and-three-reviewers-absorbed-clean-type-expert-go-architecture-expert-barney-keep-separate-test-expert-go-with-conditions` | 2026-05-21 | 2026-05-21 |
| `Pelagic Sailing Beacon` | `claude` | `claude-opus-4-7-1m` | `f72405` | `three-agent-team-session-inc-1a-gate-sweeper-and-ws2-3-scout-and-reviewer-cadence-holding-cleanly-through-cascade-discovery-and-cascade-clear-plan-authorship-no-source-claim-opened` | 2026-05-21 | 2026-05-21 |
| `Torrid Glowing Flame` | `claude` | `claude-opus-4-7-1m` | `5ab0ec` | `inc-1d-eef-concurrent-tenant-sequencing-pull-forward-author-no-source-code-cross-plan-amendment-set-adr-173-graph-stack-graph-query-layer-eef-evidence-corpus-graph-mvp-arc-graph-portfolio-index-and-thread-records-napkin-comms-log-with-full-graphview-interface-and-t7a-deepkeypath-discipline-and-citation-envelope-and-freshness-gate-as-non-negotiable-architectural-commitments-at-gate-1a` | 2026-05-21 | 2026-05-21 |
| `Stratospheric Gusting Squall` | `claude` | `claude-opus-4-7` | `cfe7da` | `inc-1d-team-session-coordinator-until-19-33z-and-slice-b-owner-graph-stack-plan-md-with-line-126-non-negotiable-substitution-to-substrate-floor-and-acceptance-item-for-ws4-4-and-ws4-5-then-handed-coordinator-to-cirrus-via-pre-positioning-vs-active-acknowledgement-distinction` | 2026-05-21 | 2026-05-21 |
| `Salty Snorkelling Pier` | `claude` | `claude-opus-4-7` | `5eb191` | `inc-1d-team-session-section-1a-gate-runner-per-workspace-all-green-then-slice-c-owner-graph-mvp-arc-plan-md-docs-adr-expert-p1s-plus-line-601-supplement-then-elected-gatekeeper-running-commit-window-bundle-of-7-files-landed-at-0cdaf58c-with-87-of-87-turbo-tasks-green-on-first-attempt` | 2026-05-21 | 2026-05-21 |
| `Opalescent Illuminating Galaxy` | `claude` | `claude-opus-4-7` | `2aa615` | `inc-1d-team-session-slice-d-owner-eef-evidence-corpus-plus-portfolio-plus-conservation-map-plus-new-eef-first-feature-plan-md-with-evidence-corpus-widening-and-section-o-extraction-trail-and-commit-scope-verdict-include-eef-first-feature-in-bundle-and-supplement-carve-out-to-exemption-on-conservation-map-lines-57-and-114` | 2026-05-21 | 2026-05-21 |
| `Gilded Beaming Eclipse` | `claude` | `claude-opus-4-7` | `0467d0` | `inc-1d-team-session-slice-a-owner-graph-query-layer-plan-md-with-14-pdr-044-vocabulary-substitutions-plus-betty-placement-correction-propagation-to-graph-core-graph-view-plus-t6-mcp-tools-yaml-supplement-7-to-17-and-killed-sub-agent-charcoal-inheritance-verified-via-diff-and-cross-slice-coherence-check-clean` | 2026-05-21 | 2026-05-21 |
| `Evergreen Climbing Canopy` | `claude` | `claude-opus-4-7` | `4a365e` | `inc-1d-team-session-cross-cutting-reviewer-pdr-044-vocabulary-second-eye-on-all-four-slices-all-clean-plus-bidirectional-cross-reference-matrix-8-row-verification-plus-final-coherence-pass-verdict-go-plus-three-supplement-reverifies-all-clean-and-disposition-c-classification-authorship-timeline-correction-on-salty-line-601` | 2026-05-21 | 2026-05-21 |
| `Cirrus Circling Plume` | `claude` | `claude-opus-4-7` | `fba398` | `inc-1d-team-session-coordinator-from-19-33z-and-closeout-owner-routing-three-supplement-absorptions-plus-evergreen-coherence-verdict-go-plus-commit-window-protocol-broadcast-plus-salty-gatekeeper-confirmation-and-post-commit-thread-record-plus-pending-graduations-plus-napkin-refresh-with-backtick-substitution-incident-captured-as-rule-candidate-plus-body-file-cli-evidence-point-2` | 2026-05-21 | 2026-05-21 |
| `Feathered Circling Horizon` | `cursor` | `claude-opus-4.7` | `9e1c24` | `pr-108-quality-gate-snagging-plan-author-no-code-no-commits-codeql-90-and-sonarcloud-quality-gate-analysed-via-public-api-after-mcp-failure-disposition-plan-aligned-with-sonar-disposition-policy-and-never-disable-checks-rule-merge-blocker-cross-referenced-from-active-graph-stack-plan-top` | 2026-05-21 | 2026-05-21 |
| `Soaring Flying Gale` | `claude` | `claude-opus-4-7-1m` | `ffa6ce` | `gate-1a-execution-partition-deepening-author-eef-first-feature-plan-md-gains-unified-dependency-graph-plus-round-assignment-plus-per-cycle-reviewer-set-plus-named-user-facing-scenarios-across-substrate-ws4-x-corpus-t1-t20-and-ff-coordination-tokens-plus-addendum-plan-refocused-to-point-at-unified-partition-plus-three-pending-graduations-protocol-pdr-candidates-mid-cycle-retirement-grounding-cost-amortisation-comms-event-failure-mode-channel-plus-pr-108-hard-gate-recognised-and-cross-referenced-throughout-no-source-code-touched-commits-24ab73c9-and-f6170504` | 2026-05-21 | 2026-05-22 |
| `Tempestuous Spiralling Thermal` | `claude` | `claude-opus-4-7` | `9205b8` | `lane-c-of-triple-peer-primary-topology-jc-commit-skill-critical-review-pdr-046-substance-verdict-and-commit-queue-commit-workflow-primitive-landed-at-97bf9e97-four-operational-moves-collapse-from-ten-distinct-cli-calls-five-invariant-ledger-added-advisory-polarity-pdr-053-adr-176-preserved-by-construction-fifteen-new-atomic-landing-tests-husky-full-tree-gating-unchanged-per-owner-stance` | 2026-05-22 | 2026-05-22 |
| `Velvet Stalking Moth` | `cursor` | `Composer` | `bde2f8` | `pr-108-preview-mcp-black-box-validation-via-oak-preview-1-twenty-five-tool-calls-all-pass-owner-confirmed-merge-and-m1-safe-pause-requirement-met-no-commits` | 2026-05-24 | 2026-05-24 |

## Plan Locations

- `.agent/plans/connecting-oak-resources/knowledge-graph-integration/`
  — internal Oak KG work (was `.agent/plans/knowledge-graph-integration/`
  pre-2026-05-01 restructure).
- `.agent/plans/connecting-oak-resources/external-oak-references/` —
  external Oak repo research and selective adoption.

## Cross-Plan Links

- **EEF subthread** (`sector-engagement/eef/`) consumes the graph
  layer (Increment 1: graph-query-layer.plan.md). EEF is *not* part
  of this thread (it is open-education evidence, not Oak-internal).
- **External (third-party) knowledge sources** live in the sibling
  thread `exploring-open-education-resources/` —
  `.agent/memory/operational/threads/exploring-open-education-resources.next-session.md`.

## Adoption-Rule Summary (owner direction 2026-05-01)

For external Oak repos:

- **Public repo + permissive license + attribution**: adoption-eligible.
  Acknowledgement mechanism approved (per-file header + repo-level
  NOTICE + README acknowledgement of Oak National Academy).
- **Private repo**: concepts-only. We can learn patterns and apply
  them in our own implementation, but cannot copy code, prompts,
  schemas, or distinctive content into this public repo —
  doing so would bypass the upstream privacy choice.

## Light-Scan Findings (2026-05-01)

- `oaknational/oak-curriculum-ontology` — public, dual MIT/OGL-3.
  OWL ontology with classes including `Misconception`, `Thread`,
  `Programme`, `Unit`, `Lesson`, etc. Vocabulary overlap with
  Increment 1's adapter names (e.g. `MisconceptionGraphView`),
  but no structural collision (ontology has no edges between
  misconceptions; this repo's data has no misconception edges
  either — already a Phase B finding). Adoption-eligible.
  Alignment is informational, not blocking.
- `oaknational/oak-ai-lesson-assistant` (Aila) — public, MIT.
  Monorepo with `apps/` and `packages/`. Likely contains prompts
  relevant to Increment 3 (cross-source-journeys). Adoption-eligible.
  Highest plan-altering potential of the three.
- `oaknational/oak-ai-moderation-service` — **private**. Concepts-
  only. Relevant to plans that produce LLM prose (none of the
  current Increment 1/2 plans).
- Adjacent (private, concepts-only): `oaknational/aila-atomic-
  concepts` — "prerequisite derivation, and curriculum graph
  construction. Science KS3 pilot." Direct conceptual relevance
  to Increment 1's PrerequisiteGraph.

## Implication for Increment 1 (graph-query-layer) Promotion

**No blocking findings.** Promote when owner approves the Promotion
Packet in the EEF thread record. Vocabulary alignment with the
ontology is a post-`pnpm sdk-codegen` decision, not a pre-promotion
gate.

## First Task of Next Session

**MVP-arc PLANNING is CLOSED on substance**. Spine + three slice
plans + topology review + reviewer-driven BLOCKER remediation all
landed 2026-05-07 in a single session (Breezy Navigating Sail). The
2026-05-07 opener for parallel specialist-expert pass is
**superseded** — that pass ran in Phase 1 of the closure session; do
NOT re-run. The slice-2 / slice-3a / slice-3b plan-authoring work is
**complete** in `current/`; do NOT re-author.

**Owner direction 2026-05-08 supersedes older merge notes**:
PR #102 must not merge until graph planning is decision-complete. The topology,
slice-plan, and EEF evaluation findings below were absorbed in the PR #102
closeout. Do not restart that absorption work; use the closed-disposition
sections below as history.

**Immediate first task — clear merge blockers only (no implementation)**:

1. Commit and push the local planning closeout bundle, then re-check GitHub and
   Sonar on the final pushed head.
2. Dispose the live Copilot `emit-index.ts` thread by fixing or explicitly
   rejecting it outside this planning-only closeout.
3. Run the final pre-merge divergence workflow for the 107-file branch scope.
   The non-mutating probe on 2026-05-08 found `origin/main` unchanged since
   merge-base `91e73d3c95066c9670b000648c547592d1334bd0`, no changed-both
   files, no ADR/plan numbering add/add collisions, and no merge-tree conflict
   signal; the actual dry-run merge/abort step remains for a clean worktree.
4. Collaboration claims are closed; verify `claims status` stays at zero before
   opening any new work.

**Out of scope for this branch (per owner direction 2026-05-07)**:

- Slice 1 execution; slice 2/3a/3b execution.
- `graph-stack.plan.md` CURRENT → ACTIVE transition.
- ADR-173 ratification.
- Any production code changes.

Queued (not blocked by MVP arc; appropriate for a separate session
on a separate branch):

5. Address EEF thread Promotion Packet (sibling thread).
6. Promote the external-oak-references plan to `current/`.
7. Do a deep read of `oak-curriculum-ontology` to extract the
   vocabulary alignment opportunities for the post-promotion graph
   adapters.

## Topology Findings Surfaced 2026-05-07 (Closed Dispositions)

Phase 1 of the single-session planning closure (Breezy Navigating Sail
/ cursor / claude-opus-4.7 / `9edbd1`) ran `architecture-expert-betty`
in parallel with the MVP-arc reviewer batch. The topology surface
itself was out of scope for that session per owner direction. PR #102 closeout
absorbed the planning-doc side of both findings without promoting graph-stack
ACTIVE or ratifying ADR-173.

1. **BLOCKER — `graph-stack.plan.md` WS4 sequencing (Principle 7 leakage)**:
   `ws4-skos-extractor` (Oak-specific NC taxonomy extractor) is
   sequenced **before** `ws4-graph-corpus-sdk-scaffold` (the consumer
   SDK). This forces domain-specific ingestion logic into a substrate
   workspace, contradicting the public-asset infrastructure boundary
   (Principle 7, lines 156-157). Fix direction: re-order so the
   consumer SDK scaffold lands first; the SKOS extractor then lives
   in the consumer SDK (where it belongs as Oak-specific code), not
   in the substrate. **ACTIONED 2026-05-08**: graph-stack WS4 now scaffolds
   `graph-corpus-sdk` before the NC adapter/extractor, and query proof depends
   on the adapter.
2. **FINDING — `practice-graph` workspace tier**: Placed in
   `packages/libs/` but is a practice-facing consumer, not pure
   substrate. Owner decision: relocate the planned workspace to
   `agent-graphs/practice-graph/`, with the top-level `agent-graphs/`
   organisation and workspace globs sequenced through
   `agent-tooling/future/agent-graphs-workspace-organisation.plan.md`.

ADR-173 ratification and graph-stack ACTIVE promotion still require their own
future owner approval, but these two topology findings are no longer live
execution-prep blockers.

## Phase 4 FINDINGS for Execution-Prep Absorption (Surfaced 2026-05-07)

Phase 4 of the single-session planning closure ran `code-expert` +
`assumptions-expert` in parallel over the three slice plans
authored at `776df6b7`. Two BLOCKERs were remediated same-session
(commit `0899ba93` — slice-3b composition-by-name conceptual mistake
across slices 2, 3a, and 3b). Two trivial FINDINGS were absorbed by
Tidal Surfing Lighthouse on 2026-05-07: the dead smoke gate command was
removed from the graph MVP and graph-stack quality-gate chains, and the
ADR-123 path was corrected to
`docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`.
Four FINDINGS remained for execution-prep absorption. PR #102 closeout applies
the following dispositions:

1. **Slice 2 adapter timing inconsistency** (`oak-kg-threads-surface.plan.md`
   L115-117 asserts the Oak Curriculum Ontology adapter lands in
   "Inc.2 or early Inc.3", but `graph-stack.plan.md` Inc.1-Inc.3
   only names the adapter in Inc.3). **ACTIONED 2026-05-08**: slice 2 now
   gates on the named graph-stack Oak Curriculum Ontology Thread adapter
   cycle.
2. **Slice 3a topic ambiguity** (`oak-misconceptions-subgraph-mcp-surface.plan.md`
   L167-169 acceptance #1 mentions "topic context" while
   non-goals at L160-161 cut topic-string sub-graph). **ACTIONED
   2026-05-08**: acceptance now requires Thread IRI context, with Unit IRI
   only if the optional unit variant is explicitly authorised.
3. **Slice 3a budget concretisation** (`oak-misconceptions-subgraph-mcp-surface.plan.md`
   L197-203 says "standard context windows" + "N representative
   responses" without numbers). **ACTIONED 2026-05-08**: slice 3a now uses
   `maxResponseTokens = 16000` and a deterministic `20`-context fixture
   manifest selected from reachable-misconception counts.
4. **Slice 3b implementation-audit test shape** (`oak-misconceptions-eef-cross-corpus-surface.plan.md`
   L223-226 + L232-235 contain test cycles framed around
   implementation-audit assertions: file-scope import audits, "the
   primitive (not bespoke composition logic) is responsible", file
   size + cyclomatic complexity bounds). **ACTIONED 2026-05-08**: TDD cycles
   are behavioural; no-legacy-import, thin-body, file-size, and complexity
   constraints moved to lint/depcruise/architecture/code-review gates.

These remaining FINDINGS did not retroactively block Breezy Navigating Sail's
single-session planning closure. They are now closed for PR #102 planning-doc
decision-completeness.

## Closeout Reviewer Pass 2026-05-07

Tidal Surfing Lighthouse ran `docs-adr-expert`, `code-expert`, and
`assumptions-expert` after the initial closeout fixes. Actionable
follow-ups absorbed in the same pass:

- ADR-173 made self-contained: no permanent ADR links to ephemeral
  `.agent/` plan or research surfaces.
- Superseded 2026-05-08 specialist-review opener marked historical, with
  the broken thread link corrected and the `53698ce0` ADR-168/ADR-173
  history clarified.
- Collaboration claim corrected to cover the deleted ADR-168 path plus
  the added template/napkin/comms surfaces.
- Active napkin memory now points namespace/topology checks to ADR-173.
- Plan templates no longer generate `pnpm smoke:dev:stub`.
- `graph-stack.plan.md` no longer depends on nonexistent
  `ws4-mcp-wiring`; `ws5-coordination-amendments` depends on
  `ws4-query-proof`.
- The Phase 4 findings note now says these findings belong before slice
  execution, while not retroactively blocking Breezy's planning closure.

The old EEF plan contradiction note is superseded by the 2026-05-08
structural-only decision: structural citation/data/caveat preservation is
load-bearing now; LLM/outcome evaluation is follow-on infrastructure.

## References

- Plan: `.agent/plans/connecting-oak-resources/external-oak-references/future/external-oak-references-deep-research.plan.md`
- Existing strategy: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`
- Related thread record: `.agent/memory/operational/threads/eef.next-session.md`
- Sibling thread record: `.agent/memory/operational/threads/exploring-open-education-resources.next-session.md`
