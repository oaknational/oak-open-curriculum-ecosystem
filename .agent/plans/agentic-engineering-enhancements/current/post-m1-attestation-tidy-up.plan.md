---
name: "Post-M1 Attestation Tidy-Up — Linear Sequence"
overview: >
  Linear 17-cycle sequence closing every post-M1-attestation
  carry-forward item identified in the M1 Safe Pause attestation
  broadcast `2849b623` (2026-05-24T20:09:10Z). Each cycle is one
  commit; tree green at end of each cycle; serialized per owner
  direction ("highly focussed, highly linear, utterly defined").
  Covers /tmp substrate capture (cycles 1–2), doctrine landings
  (cycles 3–8a: PDR-076a + PDR-076b + PDR-077 + PDR-079 + WS-11
  bundle = PDR-078 + ADR-186 + thin SKILL + reciprocal amendments,
  + WS-8 self-mod authz ADR-187), infrastructure cleanup (cycles
  9–11: comms-watch seen-state redesign WS1+WS2+WS3), test-debt +
  Sonar residue (cycles 12–14: Charcoal Beta + Gamma substance +
  Twilit Cycle 3 audit-shaped test deletion), branch fitness drain
  (cycle 15: soft-surface sweep + napkin rotation + pending-graduations
  drain). R2 absorbed Lanternlit's two lanes (WS-8 + WS-12) as
  cycles 5a + 8a. R3 added cycle 15 (branch fitness drain;
  comms-events archival deliberately excluded per owner correction).
todos:
  - id: cycle-1-capture-ferny-prestage
    content: >
      Cycle 1: Capture Ferny PDR-076 SPLIT prestage from /tmp to durable
      handoff record. One commit. Tree green at end.
    status: completed
  - id: cycle-2-capture-charcoal-pdr077
    content: >
      Cycle 2: Capture Charcoal PDR-077 draft + R3 synthesis from /tmp
      to durable handoff record. One commit. Tree green at end.
    status: completed
    depends_on: [cycle-1-capture-ferny-prestage]
  - id: cycle-3-pdr-076a
    content: >
      Cycle 3: Author PDR-076a (identity tuple) from captured Ferny
      prestage; reviewer dispatch (docs-adr-expert); marshal-cycle.
      One commit. Tree green at end.
    status: completed
    depends_on: [cycle-2-capture-charcoal-pdr077]
  - id: cycle-4-pdr-076b
    content: >
      Cycle 4: Author PDR-076b (body-file frontmatter) from captured
      Ferny prestage; reviewer dispatch (docs-adr-expert); marshal-cycle.
      One commit. Tree green at end.
    status: completed
    depends_on: [cycle-3-pdr-076a]
  - id: cycle-5-pdr-077
    content: >
      Cycle 5: Absorb 7 R3 SHOULD-ABSORB + 1 Director-verdict item;
      author PDR-077 (marshal-as-cycle-discipline) final;
      marshal-cycle. One commit. Tree green at end.
    status: completed
    depends_on: [cycle-4-pdr-076b]
  - id: cycle-5a-pdr-079
    content: >
      Cycle 5a (R2 Lanternlit absorption): Author PDR-079 (PDR-vs-ADR
      portability distinction) + `no-moving-targets-in-permanent-docs`
      rule scope-update (WS-12 co-cure). Unblocks cycles 6 + 7.
      Reviewer dispatch (docs-adr-expert + architecture-expert-fred +
      assumptions-expert). Marshal-cycle. One commit. Tree green at end.
    status: completed
    depends_on: [cycle-5-pdr-077]
  - id: cycle-6-pdr-078
    content: >
      Cycle 6: Author PDR-078 (liveness-heartbeat-contract, portable,
      SHA-free); reviewer dispatch (docs-adr-expert + assumptions-expert);
      marshal-cycle. One commit. Tree green at end.
    status: completed
    depends_on: [cycle-5a-pdr-079]
  - id: cycle-7-adr-186
    content: >
      Cycle 7: Author ADR-186 (comms-event-heartbeat-lifecycle-substrate,
      repo-bound, SHAs/UUIDs allowed); reviewer dispatch (docs-adr-expert
      + architecture-expert-fred); marshal-cycle. One commit. Tree green
      at end. **Note**: off-plan Cycle 7.1 prettier-mangle fix landed at
      `75a2cd25` (R4-captured).
    status: completed
    depends_on: [cycle-6-pdr-078]
  - id: cycle-8-skill-thin-pointer
    content: >
      Cycle 8: Collapse start-right-team SKILL §0.5 fat-draft to thin
      pointer to PDR-078 + reciprocal §Related amendments to PDR-027 /
      PDR-063 / PDR-064; reviewer dispatch (docs-adr-expert +
      onboarding-expert); marshal-cycle. One commit. Tree green at end.
    status: completed
    depends_on: [cycle-7-adr-186]
  - id: cycle-8a-ws8-adr
    content: >
      Cycle 8a (R2 Lanternlit absorption): Author WS-8 ADR (Claude
      self-modification authz cure-shape) ratifying C2+C5+C4 combination
      with C2-deferred-until-platform-support trigger. Repo-bound ADR
      per PDR-079. Reviewer dispatch (docs-adr-expert +
      assumptions-expert + security-expert). Marshal-cycle. One commit.
      Tree green at end.
    status: completed
    depends_on: [cycle-8-skill-thin-pointer]
  - id: cycle-9-comms-watch-ws1
    content: >
      Cycle 9: Comms-watch CLI auto-seed (WS1) — --seed-from-now flag
      + auto-seed-on-missing/empty by default. TDD pair: failing test
      proves backflood-on-empty-file is impossible; product code
      auto-seeds. Reviewer dispatch (code-expert + type-expert +
      test-expert). Marshal-cycle. One commit. Tree green at end.
    status: pending
    depends_on: [cycle-8a-ws8-adr]
  - id: cycle-10-comms-watch-ws2
    content: >
      Cycle 10: Comms-watch storage redesign (WS2) — mtime watermark
      + ephemeral per-session location at
      ${XDG_CACHE_HOME:-$HOME/.cache}/oak/practice/<session_prefix>/comms-watch.json
      + legacy UUID-list migration on first read. TDD: failing test
      proves new-format roundtrip + legacy-migration; product code
      implements. Reviewer dispatch (code-expert + type-expert +
      architecture-expert-wilma). Marshal-cycle. One commit. Tree green
      at end.
    status: pending
    depends_on: [cycle-9-comms-watch-ws1]
  - id: cycle-11-comms-watch-ws3
    content: >
      Cycle 11: Comms-watch cleanup (WS3) — remove
      .agent/state/collaboration/comms-seen/ from repo; drop
      legacy-location compat read; update start-right-team SKILL §0
      and reference/comms-watch-mechanism.md to remove re-seed
      instruction. Reviewer dispatch (docs-adr-expert + onboarding-expert).
      Marshal-cycle. One commit. Tree green at end.
    status: pending
    depends_on: [cycle-10-comms-watch-ws2]
  - id: cycle-12-charcoal-beta-s5443
    content: >
      Cycle 12: S5443×14 fixture replacement in
      agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts
      (10 sites) + watcher-heartbeat.unit.test.ts (4 sites) +
      consistency sweep in adjacent files. Tests remain green pre+post.
      Reviewer dispatch (code-expert + test-expert). Marshal-cycle.
      One commit. Tree green at end.
    status: pending
    depends_on: [cycle-11-comms-watch-ws3]
  - id: cycle-13-charcoal-gamma-extraction
    content: >
      Cycle 13: resolveSelfIdentity extraction across CLI bin files
      (dedupe) + **/eslint.config.ts cpd-exclusion. Tests remain green
      pre+post. Reviewer dispatch (code-expert + type-expert).
      Marshal-cycle. One commit. Tree green at end.
    status: pending
    depends_on: [cycle-12-charcoal-beta-s5443]
  - id: cycle-14-twilit-cycle-3
    content: >
      Cycle 14: Audit-shaped test deletion in
      agent-tools/tests/commit-workflow.unit.test.ts:221-247.
      Reviewer dispatch (test-expert: validate the deletion is correct
      per audit-shape definition; code-expert: confirm no coverage
      regression at the system-state level). Marshal-cycle. One commit.
      Tree green at end.
    status: completed
    depends_on: [cycle-13-charcoal-gamma-extraction]
  - id: cycle-15-branch-fitness-drain
    content: >
      Cycle 15 (R3 owner-directed): branch fitness drain composite —
      soft-surface markdownlint sweep + napkin rotation + pending-
      graduations buffer drain. Highest-impact-per-effort fitness
      selection (not exhaustive). Comms-events archival EXCLUDED per
      owner correction: comms-events are critical resource; handling
      problem addressed by cycles 9-11, not by their removal. Reviewer
      dispatch (docs-adr-expert + onboarding-expert + curator pass).
      Marshal-cycle. One commit (or 2-3 commits if curator conventions
      require). Tree green at end. SOFT count materially reduced.
    status: pending
    depends_on: [cycle-14-twilit-cycle-3]
isProject: false
---

# Post-M1 Attestation Tidy-Up — Linear Sequence

## Plan Refinement Log

### R3 — 2026-05-24 — Seaworthy Navigating Beacon — add branch-fitness-drain cycle (owner-directed)

**Why**: Owner direction this turn: *"does the companion plan include
branch fitness enhancements? It doesn't need to be all of them, just
the most impactful within a reasonable effort window"*. Honest answer:
plan as-of R2 covered doctrine + infrastructure + test-debt but did
NOT address the fitness-measure surface (pending-graduations buffer,
comms-events directory growth, soft-surface markdownlint floor,
napkin rotation, archive hygiene). Hushed + Dusky curator passes this
session reported `practice:fitness:strict-hard` SOFT 20 floor as
steady-state — meaningful background pressure that compounds across
sessions.

**Owner correction (mid-R3)**: comms-events are a critical resource;
the problem is *how* they are handled, not their existence. The
handling problem is the seen-state mechanism — already addressed by
cycles 9–11 (auto-seed + mtime watermark + ephemeral location).
Comms-events themselves stay in place. R3 cycle 15 stripped of any
comms-events archival; only genuine fitness-surface items remain.

**Cycle added** (single composite cycle, tail-position per
tree-cleanliness category):

- **Cycle 15 — Branch fitness drain (composite hygiene cycle)**.
  Inserted after cycle 14 (audit-shaped test deletion). Substance
  (highest-impact-per-effort selection, not exhaustive):
  1. **Soft-surface markdownlint sweep** — drain the current SOFT
     floor (Hushed reported 20 pre-cycle; will likely be higher post
     cycles 3-8a + R1/R2/R3 plan refinement additions). Fix all soft
     surfaces reachable by `pnpm markdownlint-check:root` and the
     `practice:fitness:strict-hard` sweep.
  2. **Napkin rotation** — if the active napkin (`.agent/memory/active/napkin.md`)
     has accumulated entries since the last rotation, archive
     processed entries per existing curator-pass convention.
  3. **Pending-graduations buffer drain** — process candidates whose
     trigger conditions have been met; route to permanent homes (PDR
     / rule / pattern / memory); leave only un-triggered candidates
     in the buffer.

**Cycle count**: 16 → 17 (cycle 15 appended; existing cycles
unchanged in number).

**Out of scope** (deliberately deferred per "reasonable effort"
framing, or excluded by owner correction):

- **Comms-events directory archival — EXCLUDED** per owner correction.
  Comms-events are a critical resource; the handling problem is
  addressed by cycles 9–11.
- SonarCloud quality-gate baseline reset on merged branch.
- Rule-file graduation hygiene (rules graduated above their thresholds).
- Cross-repo continuity surface audit.
- Pending-graduations buffer schema-shape changes (separate concern).

**Acceptance signals** (verifiable):

- `practice:fitness:strict-hard` reports SOFT count materially
  reduced (target: < 5; absolute zero not required because new
  soft surfaces may accrue during plan execution).
- Pending-graduations buffer entries reduced to un-triggered
  candidates only.
- `.agent/memory/active/napkin.md` rotated if criteria met (or
  documented as unnecessary at cycle-open).

### R2 — 2026-05-24 — Seaworthy Navigating Beacon — absorb Lanternlit's two outstanding lanes (WS-8 + WS-12) as in-plan cycles

**Why**: Owner direction this turn: *"Lanternlit has been gone for a
long time, whatever needs doing, integrate it into the plan as a
step"*. Lanternlit's session never returned to this work; the two
AUTHOR-IN-FLIGHT artefacts named in the primary plan (WS-8 self-mod
authz ADR; WS-12 PDR-079 + `no-moving-targets` rule scope-update) had
no in-flight author. WS-12 was a BLOCKING prerequisite for companion
plan cycles 6 + 7 per R1 absorption finding #8. R2 absorbs both lanes
into this plan as in-sequence cycles.

**Cycles added** (letter-suffix to preserve existing cycle-number
references in primary plan):

- **Cycle 5a — WS-12 PDR-079 + `no-moving-targets` rule scope-update**.
  Inserted between cycle 5 (PDR-077) and cycle 6 (PDR-078) so PDR-079
  lands BEFORE cycles 6 + 7 that previously named it as BLOCKING
  prerequisite. Cycle 5a's landing satisfies the prerequisite in-band
  (cycles 6 + 7 no longer await out-of-plan substrate).
- **Cycle 8a — WS-8 Claude self-modification authz cure-shape ADR**.
  Inserted between cycle 8 (SKILL thin pointer + reciprocal amendments)
  and cycle 9 (comms-watch WS1). Position chosen because WS-8 is
  M2-pursuit doctrine work (cleanly grouped with the WS-11 bundle in
  Phase 2 — doctrine landings) and does not depend on the
  infrastructure cycles. Independent of WS-11; no dependency between
  cycles 6/7/8 and 8a.

**§Prerequisite Classification updated**: PDR-079 row flipped from
BLOCKING (external to plan) to BLOCKING (satisfied by cycle 5a) —
internal dependency, met in-sequence.

**Cycle count**: 14 → 16 (cycles 5a + 8a inserted; existing cycles
unchanged in number).

**Primary plan update needed** (deferred to companion R3 / primary
plan R3 once these cycles land): primary plan §Workstream Roll-up
WS-8 + WS-12 status flips from AUTHOR-IN-FLIGHT (Lanternlit) to
LANDED via companion plan cycles 5a + 8a.

**No partial-decline this round**: owner direction is explicit ("integrate"),
the two lanes are codified-but-undelivered (low ambiguity), and
linear sequencing absorbs them without forcing parallel execution.

### R1 — 2026-05-24 — Seaworthy Navigating Beacon — readiness-reviewer fan-out absorption

**Why**: Owner-directed 9-reviewer fan-out returned two NOT-READY verdicts
(docs-adr-expert; architecture-expert-wilma) + seven READY-WITH-CONDITIONS.
Owner direction this turn: *"apply all critical and important findings,
and any of the other findings that you critically analyse and find to be
relevant"*. R1 absorbs the substantive findings; cycle bodies updated where
the change carries content; structural changes (Prerequisite Classification,
Preflight, Acceptance Criteria) carry inline.

**Absorption ledger**:

| # | Reviewer | Severity | Finding | Absorption shape | Affected section |
|---|----------|----------|---------|------------------|------------------|
| 1 | docs-adr-expert | CRITICAL | PDR-076a + PDR-076b already exist on disk at `Status: Proposed`; plan treats as net-new authoring | Cycles 3 + 4 rewritten as **ratify-existing-draft** (diff against on-disk, reconcile §Related expansion, choose final Status verdict). Per-cycle file-scope notes the on-disk source. | Cycles 3 + 4 |
| 2 | assumptions-expert | CRITICAL (partial-decline) | Bundle cycles 3+4 (same prestage; SPLIT-redirect-stabilises issue) | **Partial decline**: kept cycles 3 + 4 separate because docs-adr-expert finding #1 changes the cycle shape to ratify (not author), and the per-PDR ratification may diverge in substance (one may need reconciliation, the other not). The "redirect-stabilises-after-both" rationale dissolves once both PDRs already exist on disk with the redirect-note in PDR-076 v2 in place. Keeping separate preserves independent ratification trajectory. | Cycles 3 + 4 |
| 3 | code-expert | CRITICAL | Cycle 13 false premise: `resolveSelfIdentity` is NOT duplicated in `bin/` files; lives once at `cli-self-identity.ts`; the named extraction destination `identity.ts` holds different concern | Cycle 13 **narrowed** to the eslint cpd-exclusion edit only (extraction was already landed via bundle `340752bb` or some prior cycle; the pre-pause routing was stale). Cycle now scope-minimised to a Sonar-config single-line edit. | Cycle 13 |
| 4 | code-expert | CRITICAL | `agent-tools/README.md:348` references `comms-seen` — cycle 11 cleanup pre-check will incorrectly trigger Blocked Protocol | Cycle 11 file-scope expanded to include `agent-tools/README.md`. | Cycle 11 |
| 5 | architecture-expert-wilma | CRITICAL | Cycle 10 partial-state drain on crash; no atomic-write discipline for new JSON format | Cycle 10 expanded with **transactional write discipline** (write to temp file in same dir; fsync; atomic rename) + **parse-error fallback** (corrupted new-format file → log + treat as missing → auto-seed). Explicit failing tests for crash-recovery. | Cycle 10 |
| 6 | architecture-expert-wilma | CRITICAL | Cycle 11 in-flight reader race: deleting `comms-seen/` while concurrent sessions hold legacy paths → ENOENT on append | Cycle 11 sequenced with explicit **pre-delete safety check**: query `active-claims.json` for any comms-watcher claim; if any found, surface to owner before deletion. Combined with cycle 10's atomic-rename-of-state-file approach, the in-flight write-side race is bounded. Cycle 10 also writes to NEW location only; legacy files become read-only migration-source, so cycle 11 deletion does not race against writes — only reads. Reads of missing files at cycle-11 boundary trigger auto-seed (cycle 9 cure), not ENOENT. | Cycle 11 (sequencing) + Cycle 10 (write-side) |
| 7 | type-expert | CRITICAL | Cycle 10 no Zod schema specified; implementer will hand-roll JSON.parse + `as` cast (violates schema-first + Commandment 4) | Cycle 10 expanded with explicit deliverables: `CommWatchSeenState = z.strictObject({ last_seen_mtime: z.string().min(1), last_seen_filenames: z.array(z.string()) })`; `LegacySeenState = z.array(z.string())`; format-detection via `safeParse` against each schema in priority order (new first, legacy fallback). Schemas land in `agent-tools/src/collaboration-state/state-schemas.ts`. | Cycle 10 |
| 8 | docs-adr-expert | CRITICAL | PDR-079 cited 3× as governing authority but does not exist; primary plan §Non-Goals says PDR-079 is Lanternlit's lane | **PDR-079 added to §Prerequisite Classification as BLOCKING for cycles 6 + 7**. Cycles 6 + 7 cannot open until PDR-079 lands in Lanternlit's lane (or owner explicitly inlines the portability rule for this plan). Surfacing to owner is required at cycle-6 open-time if PDR-079 still pending. | §Prerequisite Classification + cycles 6 + 7 |
| 9 | docs-adr-expert | CRITICAL | Build-vs-Buy attestation missing per ADR-117 template | §Preflight expanded with explicit **Build-vs-Buy Attestation: no third-party vendor touched**. Cycle 10's `XDG_CACHE_HOME` adoption is consumption of a published OS standard, not a vendor integration (XDG is a freedesktop.org spec, not a managed service); no first-party alternative evaluation warranted. Recorded in §Preflight. | §Preflight |
| 10 | onboarding-expert | CRITICAL | `continuity-surface-commits-as-orphans.md:12` cross-reference dangles after cycle 11; SKILL §0 fallback script still writes UUID-list | Cycle 11 file-scope expanded to include `.agent/rules/continuity-surface-commits-as-orphans.md` (line 12 amendment removing `comms-seen/*.json` from the enumerated surfaces) and `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0 fallback script (lines ~199-226 — revise or delete; cross-platform agents bouncing into fallback shape must not re-introduce the legacy mechanism). | Cycle 11 |
| 11 | architecture-expert-fred | IMPORTANT | Cycle 6 portability grep too narrow (catches SHA40 + UUIDs only; misses short-hex, repo-path fragments, plan filenames, branch-prefixes) | Cycle 6 deterministic-validation expanded with compound check: short-hex `\b[0-9a-f]{6,}\b`, repo-path fragments `(agent-tools/\|\.agent/\|docs/\|apps/\|packages/)`, plan-filename pattern`\.plan\.md`, branch-prefix pattern`(feat\|fix\|chore)/`. All four checks must score zero matches on PDR-078 body. | Cycle 6 |
| 12 | architecture-expert-fred | IMPORTANT | Cycle 8 §Related amendments risk leaking ADR-186 references into portable PDRs | Cycle 8 acceptance criterion expanded: **reciprocal §Related entries reference PDR-078 only, never ADR-186 directly**. ADR-186 ← PDR-078 is the one-way bridge. Deterministic validation greps each reciprocal PDR for absence of ADR-186 references. | Cycle 8 |
| 13 | architecture-expert-betty | IMPORTANT | Cycle 7 renderer scope constrains cycle 10's TDD-pair surface (not currently named) | Cycle 10 acceptance criterion expanded: if cycle 7 amended the watcher renderer (heartbeat token), cycle 10's TDD-pair must NOT regress that renderer surface; failing-test set includes "heartbeat-tagged event renders with [HEARTBEAT] token" as a regression check. | Cycle 10 |
| 14 | architecture-expert-betty | IMPORTANT | Cycle 8 deterministic validation is shallow (grep-counts can pass with 2 of 3 reciprocal amendments missing) | Cycle 8 deterministic-validation strengthened: per-PDR independent verification (`grep -c "PDR-078" <each PDR>`) returning ≥ 1 each; absent any one PDR, validation fails. | Cycle 8 |
| 15 | code-expert | IMPORTANT | Cycle 9 silent backward-compat break (`--seen-file` with empty file no longer replays) | Cycle 9 body expanded with explicit **backward-compat statement**: the auto-seed-on-empty is an intentional behaviour change; any caller passing an empty seen-file to trigger full history replay must use an explicit `--no-auto-seed` flag (added as part of cycle 9). Cycle 11 SKILL §0 update follows so the next team session uses the new semantics. | Cycle 9 |
| 16 | code-expert | IMPORTANT | Cycle 14 deletion scope ambiguity (lines 221-247 vs 221-232 + 234-247) | Cycle 14 disambiguated: **delete lines 221-247 inclusive** (line 233 is blank-line separator between the two test cases; deleting both with the separator is correct). Acceptance criterion adds explicit post-deletion line-count check against pre-deletion count minus 27. | Cycle 14 |
| 17 | type-expert | IMPORTANT | Cycle 10 cache-dir path resolver must receive `XDG_CACHE_HOME` as injected parameter (not `process.env` read) | Cycle 10 expanded with explicit DI constraint: `resolveCommsWatchStatePath(identity: CollaborationAgentId, env: Pick<Process['env'], 'XDG_CACHE_HOME' \| 'HOME'>): string` — env values are injected per test; tests never read `process.env` directly. `CollaborationStateEnvironment` may need extension to carry these env keys; verify at cycle open. | Cycle 10 |
| 18 | test-expert | IMPORTANT | Cycle 14 gating reviewer needs to read file directly — Twilit prior is advisory, not gate-evidence | Cycle 14 body adds explicit note: *"Confirming test-expert reviewer reads lines 221-247 directly at cycle-open; Twilit's pre-pause audit-shape classification is advisory, not self-sufficient as gate evidence."* test-expert review during this fan-out has already confirmed both test blocks ARE audit-shaped (call-count assertion + pathspec assertion both pin internal implementation choices); deletion is correct per audit-shape definition. | Cycle 14 |
| 19 | assumptions-expert | IMPORTANT | Implementer-class capacity prerequisite should be downgraded from BLOCKING to BENEFICIAL | §Prerequisite Classification: implementer-class capacity row downgraded BLOCKING → BENEFICIAL with explicit fallback "any implementer-class agent can execute any cycle with the prerequisite-cycle artefacts present". | §Prerequisite Classification |
| 20 | onboarding-expert | IMPORTANT | Cycle 8 SKILL preservation set must enumerate explicitly (not "operational essentials") | Cycle 8 acceptance criterion expanded with explicit preservation set: cadence (≤ 4 min), threshold (≥ 10 min), retirement rule, **claim auto-rebalance protocol** (per-claim disposition + handoff-record routing), **three exemptions** (coordinator-transfer grace window, marshal-cycle contiguous-execution exemption, sub-agent dispatch verdict-synthesis exemption), and §1 cron-status field linkage. ≤ 30 line ceiling reframed as "≤ 30 lines OR all preservation items intact, whichever is larger". | Cycle 8 |
| 21 | onboarding-expert | IMPORTANT | PDR-078 will be `Status: Candidate` — SKILL pointer to candidate PDR needs explicit handling | Cycle 8 acceptance criterion adds **status flip**: PDR-078 flips from `Status: Candidate` (post-cycle-6) to `Status: Adopted` in cycle 8 (concurrent with the SKILL thin-pointer adopting it as authoritative contract). Acceptable per WS-11 bundle's 5-reviewer convergence + 2 review-rounds-per-PDR shape from primary plan §M2 Criterion 4. | Cycle 8 |
| 22 | assumptions-expert | NIT (absorbed) | EEF priority interaction unexamined; cycles 12-14 first-to-defer if EEF pressure escalates | §Non-Goals + §Prerequisite Classification cross-reference: cycles 12-14 are explicitly tree-cleanliness only and deferrable indefinitely if EEF pressure escalates. Added note in §Non-Goals. | §Non-Goals |
| 23 | docs-adr-expert | NIT (absorbed) | Handoff destination date convention unstated | §Cycle 1 + §Cycle 2 footer adds convention note: "date in filename = substrate-origin date (when Ferny/Charcoal wrote `/tmp` content), not capture date". | Cycles 1 + 2 |
| 24 | docs-adr-expert | NIT (absorbed) | Cycle 5 reciprocal §Related back-direction grep validation missing | Cycle 5 deterministic-validation adds: `grep -c "PDR-063\|PDR-064" .agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md` returns ≥ 2. | Cycle 5 |
| 25 | docs-adr-expert | NIT (absorbed) | ADR-186 → ADR-183 cross-reference rationale not specified | Cycle 7 body expanded: ADR-186 cites ADR-183 because heartbeat is a new tag-namespace consumer (per ADR-183 `tags` field + namespace `["failure-mode", "behaviour-note", "heartbeat"]`). Cross-reference is substance-grounded. | Cycle 7 |
| 26 | code-expert | NIT (absorbed) | Cycle 9 deterministic-validation: pre-implementation Red-state distinction | Cycle 9 deterministic-validation gains Red/Green annotation per command (which fails before implementation, which passes after). | Cycle 9 |
| 27 | code-expert | NIT (absorbed) | Cycle 12 "consistency sweep adjacent files" under-specified | Cycle 12 body marks the adjacent-files identification as a **deferred-identification step at cycle-open**: implementer runs Sonar surface query OR `grep -rn "fs.writeFileSync\|os.tmpdir" agent-tools/tests/` at cycle-open and names the files; cycle-open broadcasts the resolved file list to comms before opening claim. | Cycle 12 |
| 28 | docs-adr-expert | IMPORTANT | Cycle 5 §Absorption Trail subsection convention not specified | Cycle 5 body adds inline schema: `### Absorption Trail` subsection with bullets `- [SHOULD-ABSORB\|VERDICT] R{n}: <one-line-item> (source: <synthesis-doc-anchor>)`. Marshal-cycle landing includes the subsection. | Cycle 5 |
| 29 | docs-adr-expert | IMPORTANT | Cycle 7 ADR-186 prescribes HOW rather than WHAT | Cycle 7 §Action narrowed: ADR-186 names OUTCOME ("the comms-event substrate carries a designated lifecycle-substrate event-type for heartbeat liveness, distinguished in render"). Implementation literals (`event_type='heartbeat'`, `[HEARTBEAT]` token) move to this plan's cycle 7 §Action body, NOT into ADR-186 body. | Cycle 7 |
| 30 | docs-adr-expert | IMPORTANT | Cycle 8 SKILL ≤30 line ceiling rationale missing | Absorbed via finding #20 above (ceiling reframed as "≤30 lines OR all preservation items intact, whichever is larger"). | Cycle 8 |
| 31 | architecture-expert-wilma | IMPORTANT | Cycle 10 XDG_CACHE_HOME empty-string edge case | Cycle 10 expanded: empty-string `XDG_CACHE_HOME` falls through to `HOME/.cache` per shell `:-` semantics; if `HOME` also unset (containerised CI), path resolver throws explicit error (not silent relative-path fallback). Test added for this edge case. | Cycle 10 |
| 32 | architecture-expert-wilma | IMPORTANT | Cycle 11 grep pre-check exclude scope (`.github/`, `scripts/`, `docs/`) | Cycle 11 pre-check grep extended exclude scope: `--exclude-dir=node_modules --exclude-dir=.git`. Audit additionally includes `.github/`, `scripts/`, `docs/` paths explicitly — any reference to `comms-seen` in those paths surfaces to owner before deletion. | Cycle 11 |
| 33 | architecture-expert-wilma | NIT (declined) | NFS/SMB file-locking semantics | **Declined**: too platform-specific for current dev team (all macOS + Linux local + Linux CI; no NFS/SMB in scope). If a future agent surfaces on NFS/SMB, the concurrent-watcher detection failure mode would surface as a new worked instance; absorb then. Captured as a tracked-condition for cycle 10. | Cycle 10 (footnote) |
| 34 | type-expert | NIT (absorbed) | Cycle 13 import-surface coupling check | Cycle 13's now-narrowed scope (eslint cpd-exclusion only, extraction dropped) makes this NIT moot. | (closed by finding #3) |
| 35 | onboarding-expert | NIT (absorbed) | Rationale-for-change SKILL breadcrumb | Cycle 8 acceptance adds one-line in-SKILL breadcrumb: "Heartbeat doctrine relocated to PDR-078 (portable contract); ADR-186 carries the repo phenotype. See PDR-079 for the PDR-vs-ADR portability distinction that motivated the split." | Cycle 8 |

**Cycle count after R1**: 14 (unchanged; cycles 3+4 kept separate per
partial-decline of finding #2). PDR-079 prerequisite is the
substantive new BLOCKING addition.

**Verdict after R1 absorption**: cycles 3-14 are now fully specified
for execution conditional on PDR-079 landing in Lanternlit's lane
(BLOCKING gate). Cycles 1-2 are unblocked the moment owner unpauses.
Awaiting owner unpause + PDR-079 landing decision before cycle 1
opens.

## Source Strategy

- Strategic source:
  [`practice-infrastructure-hardening-program.plan.md`](practice-infrastructure-hardening-program.plan.md)
  R2 refinement (2026-05-24 — M1 attestation + post-M1 re-shape).
- M1 attestation broadcast:
  `.agent/state/collaboration/comms/2849b623-5026-4e9d-9938-7ebaffb727fd.json`
  (Director Seaworthy `6966d4`, 2026-05-24T20:09:10Z).
- Carry-forward inventory: primary plan §M1 — Safe-Pause Milestone
  Criteria → §Gate 5 queue terminal state inventory.

## End Goal

Every post-M1-attestation carry-forward item reaches terminal state
(landed) via a single linear cycle sequence, so the next team session
opens with zero stranded substrate and the M2 Completion Milestone's
Criteria 2 (PDR-077) + 4 (WS-11 bundle) close. The §P5.W1 comms-watch
redesign also closes, eliminating the manual re-seed friction from
all future resume protocols.

## Mechanism

Linear cycle-by-cycle execution serializes risk: each cycle's
output is verifiable before the next begins; failure in cycle N
blocks N+1 without contaminating the rest. The /tmp capture cycles
(1–2) front-load substrate-hygiene so subsequent doctrine cycles
read from durable substrate, not session-local /tmp. The doctrine
landings (3–8) precede the infrastructure cleanup (9–11) because
the doctrine codifies the contract under which the infrastructure
operates. The test-debt + Sonar residue cycles (12–14) trail the
sequence because they are independent of any milestone — they
land for tree-cleanliness, not for unblocking.

## Means

Linear 14-cycle sequence, each cycle one commit, tree green at end
of each cycle. Reviewer dispatch is named per cycle in §Atomic
Cycles below. Marshal-cycle execution per
[`marshal-as-cycle-discipline`](practice-infrastructure-hardening-program.plan.md#ws-6-marshal-as-cycle-discipline-pdr-077)
empirical precedent (no doctrine home yet; cycle 5 lands the
doctrine itself).

## Acceptance Criteria

1. All 17 cycles (1, 2, 3, 4, 5, 5a, 6, 7, 8, 8a, 9, 10, 11, 12, 13,
   14, 15) reach terminal state (LANDED) with deterministic validation
   output captured per cycle.
2. M2 Completion Criteria 2 (PDR-077, cycle 5), 3 (WS-8 ADR, cycle
   8a), and 4 (WS-11 bundle, cycles 6+7+8) flip to MET at primary
   plan refinement R3 (a follow-on plan refinement triggered by this
   plan's completion). PDR-079 (cycle 5a) closes WS-12.
3. `.agent/state/collaboration/comms-seen/` directory removed from
   the repo (WS3 acceptance).
4. No `/tmp` substrate remains that the next session would need to
   read (cycles 1–2 acceptance).
5. Sonar quality gate remains GREEN throughout the sequence
   (no regression of Gate 1).
6. Tree green at every commit boundary (no cycle leaves the tree
   broken).

## Prerequisite Classification

| Prerequisite | Classification | Notes |
|--------------|----------------|-------|
| M1 Safe Pause Attestation broadcast emitted | **blocking** | MET (event `2849b623`, 2026-05-24T20:09:10Z) |
| Owner unpause direction | **blocking** | Team currently paused per broadcast `e4f680c6` 2026-05-24T14:59:58Z; this plan executes ONLY after owner directs resume |
| `agent-tools` workspace healthy + green gates | **blocking** for cycles 9–14 | Verified pre-pause via bundle `340752bb` husky gate |
| **PDR-079 PDR-vs-ADR portability distinction landed** | **blocking** for cycles 6 + 7 — **satisfied in-plan by cycle 5a (R2)** | Lanternlit's lane absorbed into this plan per R2 owner direction. Cycle 5a authors PDR-079 + `no-moving-targets` rule scope-update; cycles 6 + 7 open after cycle 5a lands. Director no longer needs to surface PDR-079 status to owner — in-band dependency. |
| Implementer-class agent capacity (Twilit-class for cycles 9–14; doctrine-class for cycles 3–8; capture-class for cycles 1–2) | **beneficial** | Downgraded R1 per assumptions-expert finding #19. Any implementer-class agent can execute any cycle with the prerequisite-cycle artefacts present; staffing-class is preferred not required. |
| Marshal seat staffed | **blocking** | One marshal per cycle; Mistbound-class succession applies |
| Cross-platform cache-dir validation (Linux + macOS) for cycle 10 | **beneficial** | Default `${XDG_CACHE_HOME:-$HOME/.cache}` works on both; Windows-WSL plausibly works (no formal verification needed unless a Windows agent surfaces). NFS/SMB file-locking out of scope (R1 finding #33 declined; revisit if a future agent surfaces on those filesystems). |

**Minimum shippable shape**: cycles 1 + 2 (capture) + cycle 9 (CLI
auto-seed) is the smallest tranche that delivers user-visible value
— substrate captured, manual re-seed eliminated. Cycles 3–8
(doctrine) and 10–11 (storage redesign + cleanup) are next-tier;
cycles 12–14 (test-debt + Sonar) are tree-cleanliness, deferrable
indefinitely without consequence.

## Non-Goals

1. **Not** reshaping cycle ordering for parallelism — owner directed
   linear execution. Future agents observing parallel opportunities
   should file a refinement entry, NOT silently re-shape.
2. **Not** authoring WS-8 (Claude self-modification authz cure-shape
   ratification) — remains Lanternlit's lane (in-flight in primary
   plan). WS-12 (PDR-079 portability distinction) is a **BLOCKING
   prerequisite** for cycles 6 + 7 per §Prerequisite Classification,
   not a non-goal.
3. **Not** running M2 Criterion 5 (next-window evidence) — that
   requires the next team session to open and apply substrate; it is
   detection-only, not landing-work.
4. **Not** revisiting WS-11 bundle shape — converged pre-pause;
   re-litigation would be substrate-pointer-read on settled doctrine.
5. **Not** changing the comms event schema or storage shape (only
   the watcher's seen-state).
6. **Not** addressing other manual steps in resume protocols beyond
   the comms-watch seen-state — separate Emergent Observation
   candidates surface as P5.W2+ in primary plan.
7. **Not** treating cycles 12–14 as M1-attestation-blockers (R1
   finding #22). These are tree-cleanliness only; per
   §Prerequisite Classification "deferrable indefinitely without
   consequence to intended impact". If EEF priority escalates during
   this plan's execution window, cycles 12–14 are first to defer
   without consultation. Cycles 1–11 carry the doctrine + infrastructure
   substance.

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **Shape**: linear 14-cycle sequence honours owner direction
  ("highly linear"). The single-plan shape avoids over-decomposition
  into sub-plans for what is fundamentally a serialised carry-forward
  drain. Question: could this be simpler? Verdict: No — each cycle
  represents a distinct logical landing with its own acceptance
  signal; collapsing further would conflate independent concerns.
- **Landing path**: each cycle is one commit (TDD-pair where code,
  doc-landing where doctrine). Marshal-cycle execution per
  established precedent. Tree green at every boundary.
- **Vendor-literal**: cycles 9–11 touch no vendor APIs. Cycles 1–8
  are doctrine + capture. Cycles 12–14 touch test/lint config but no
  vendor shapes. Vendor-literal clause N/A.

## Preflight (per cycle, non-negotiable)

Before any non-planning edits in each cycle:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. **Build-vs-Buy Attestation** (per ADR-117 §Preflight, R1 finding #9):
   **no third-party vendor touched by this plan**. Cycle 10's
   `XDG_CACHE_HOME` adoption is consumption of a published OS standard
   (freedesktop.org Base Directory Specification), not a vendor
   integration; no first-party alternative evaluation warranted. All
   other cycles touch in-tree substrate only (PDRs, ADRs, SKILL files,
   `agent-tools` code, tests). Attestation discharged.
3. **Lifecycle triggers**: apply
   [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).
   Record work shape; consult active claims / shared comms / commit
   queue; register active areas before edits; close own claim at
   cycle-end.
4. Capture baseline signal:

   ```bash
   pnpm check
   ```

   Expected: exit 0 (tree-green precondition).
5. Verify cycle prerequisite (named in cycle frontmatter `depends_on`)
   has landed — `git log --oneline -1` shows the prerequisite cycle's
   commit subject. For cycles 6 + 7: additionally verify PDR-079 has
   landed (`test -f .agent/practice-core/decision-records/PDR-079*.md`);
   if not, surface to owner before opening claim per §Prerequisite
   Classification.

## Atomic Cycles

### Phase 1 — Substrate Hygiene (cycles 1–2)

**Purpose**: capture session-local `/tmp` substrate to durable
handoff records before doctrine cycles read from it. Hygiene gate
for all subsequent cycles.

#### Cycle 1 — Capture Ferny PDR-076 SPLIT prestage

**Parallel-safety**: linear (no prior dependency; first cycle).

**Starting state**: branch HEAD post-M1-merge (`2462952a` or later).

**File scope**:

- Source: `/tmp/ferny-ws2-partition-prestage-synthesis.md` (session-local;
  may not exist if /tmp purged between sessions — see Blocked Protocol)
- Destination: `.agent/state/collaboration/handoffs/2026-05-23-ferny-ws2-pdr-076-split-prestage.md`

**Action**: copy `/tmp` content to handoff destination with
frontmatter (agent_name, identity tuple, created_at, last_updated_at,
topic, intended_consumer="post-m1-attestation-tidy-up cycles 3+4").

**Acceptance criteria**:

1. Destination file exists at named path with frontmatter intact.
2. Source content preserved byte-for-byte (no editorial changes).
3. Frontmatter declares Ferny identity tuple + capture-by Seaworthy
   identity tuple + intended_consumer.
4. Markdownlint passes on destination file.

**Deterministic validation**:

```bash
test -f .agent/state/collaboration/handoffs/2026-05-23-ferny-ws2-pdr-076-split-prestage.md
head -20 .agent/state/collaboration/handoffs/2026-05-23-ferny-ws2-pdr-076-split-prestage.md
pnpm markdownlint-check:root \
  .agent/state/collaboration/handoffs/2026-05-23-ferny-ws2-pdr-076-split-prestage.md
```

Expected: exit 0 all three; head shows frontmatter; markdownlint clean.

**Reviewer dispatch**: none (capture-only; substance unchanged).

**Marshal-cycle**: standard.

**R1 convention note (finding #23)**: date in destination filename
= **substrate-origin date** (when Ferny wrote the `/tmp` content,
~2026-05-23), NOT capture-execution date. Aligns with existing
`.agent/state/collaboration/handoffs/` naming convention.

**R1 amendment (finding #1 cycle-1 branch of Blocked Protocol)**: if
`/tmp/ferny-ws2-partition-prestage-synthesis.md` is purged at
cycle-open time (session-local; not guaranteed present), Blocked
Protocol fires: surface to owner; do NOT silently auto-reconstruct
PDR-076a/b content from primary plan + memory; cycles 3 + 4 are
ratify-existing-draft against on-disk PDR-076a/b (which DO exist
per ground-state check) but the prestage diff input would be lost,
weakening the reconciliation rigour. Owner verdict drives recovery
path (proceed without prestage; reconstruct prestage; abandon
cycles 3+4 stand-down).

#### Cycle 2 — Capture Charcoal PDR-077 draft + R3 synthesis

**Parallel-safety**: sequenced after cycle 1.

**Starting state**: branch HEAD post-cycle-1.

**File scope**:

- Sources: `/tmp/charcoal-pdr077-postresume-fanout-synthesis.md` +
  any sibling `/tmp` files Charcoal authored for the PDR-077 lane
  (R1 + R2 + R3 review transcripts if still in `/tmp`)
- Destinations:
  - `.agent/state/collaboration/handoffs/2026-05-23-charcoal-pdr-077-draft-and-r3-synthesis.md`
  - Subdirectory if multi-file:
    `.agent/state/collaboration/handoffs/2026-05-23-charcoal-pdr-077/`

**Action**: copy `/tmp` content to handoff destination with
frontmatter (agent_name, identity tuple, created_at,
last_updated_at, topic, intended_consumer="post-m1-attestation-tidy-up cycle 5",
review-round-state ("R1 + R2 + R3 review-complete; 7 SHOULD-ABSORB +
1 Director-verdict pending absorption")).

**Acceptance criteria**:

1. Destination file(s) exist with frontmatter intact.
2. Source content preserved byte-for-byte.
3. Frontmatter declares review-round state as named string.
4. Markdownlint passes on destination file(s).
5. If `/tmp` content missing (session purged), Blocked Protocol fires:
   surface to owner with "PDR-077 substrate lost; cycle 5 author
   starts from scratch using primary plan WS-6 row + Mistbound 2nd
   worked-instance evidence + WS-4 recursion-of-doctrine pattern as
   foundation".

**Deterministic validation**:

```bash
test -f .agent/state/collaboration/handoffs/2026-05-23-charcoal-pdr-077-draft-and-r3-synthesis.md
head -30 .agent/state/collaboration/handoffs/2026-05-23-charcoal-pdr-077-draft-and-r3-synthesis.md
pnpm markdownlint-check:root \
  .agent/state/collaboration/handoffs/2026-05-23-charcoal-pdr-077-draft-and-r3-synthesis.md
```

Expected: exit 0 all three.

**Reviewer dispatch**: none.

**Marshal-cycle**: standard.

**R1 convention note (finding #23)**: date in destination filename
= substrate-origin date (when Charcoal wrote `/tmp` content,
~2026-05-23), NOT capture-execution date.

### Phase 2 — Doctrine Landings (cycles 3–8)

**Purpose**: land the carry-forward PDRs + ADR + thin SKILL pointer +
reciprocal amendments. Each cycle = one doctrine artefact (or
tightly-coupled group) committed as one logical landing.

#### Cycle 3 — Ratify PDR-076a (identity tuple) — existing draft on disk

**R1 reshape (finding #1)**: PDR-076a already exists on disk at
`.agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md`
with `Status: Proposed`. Cycle is **ratify-existing-draft**, not
net-new authoring.

**Parallel-safety**: sequenced after cycle 2 (depends on captured
Ferny prestage for diff input).

**Starting state**: branch HEAD post-cycle-2.

**File scope**:

- Modified: `.agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md`
  (existing file; ratify Status; reconcile with captured prestage if
  divergent)
- Source for diff: captured Ferny prestage from cycle 1
- Modified: `.agent/practice-core/decision-records/PDR-076-agent-identity-tuple-and-body-file-frontmatter.md`
  (verify SPLIT redirect note exists; amend if drifted)
- Modified: `.agent/practice-core/decision-records/README.md` (verify
  PDR-076a in index; add if absent)

**Action**:

1. Diff on-disk PDR-076a body against captured Ferny prestage block.
2. If divergent, surface to owner with three options: (a) keep on-disk
   shape; (b) reconcile to prestage shape; (c) merge both. Owner
   verdict drives the reconciliation.
3. Confirm Status verdict: current `Proposed` → choose between
   `Proposed` (continue review), `Candidate` (next-step formal review
   round), or `Adopted` (ratification complete this cycle). R1 default
   verdict: **`Adopted`** (5-reviewer convergence pre-pause + this R1's
   docs-adr-expert review = sufficient ratification evidence).
4. Verify SPLIT-redirect in PDR-076 v2 §Status references both
   PDR-076a + PDR-076b (already in tree per ground-state check).
5. Verify README.md PDR index includes PDR-076a (already in tree).

**Acceptance criteria**:

1. PDR-076a Status flipped from `Proposed` to ratification verdict
   (default `Adopted`; owner may override).
2. PDR-076a body reconciled with captured prestage (no substantive
   loss; divergence-resolution path explicit).
3. PDR-076 v2 §Status SPLIT-redirect intact + references PDR-076a.
4. README.md PDR index includes PDR-076a.
5. `pnpm check` passes.

**Deterministic validation**:

```bash
test -f .agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md
grep "^\\*\\*Status\\*\\*" .agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md
grep -c "PDR-076a" .agent/practice-core/decision-records/README.md
grep -c "PDR-076a" .agent/practice-core/decision-records/PDR-076-agent-identity-tuple-and-body-file-frontmatter.md
pnpm check
```

Expected: exit 0; Status line shows ratification verdict (not
`Proposed`); README and parent PDR both reference PDR-076a.

**Reviewer dispatch**: docs-adr-expert (PDR doctrine soundness +
§Related cross-reference accuracy + reconciliation verdict).

**Marshal-cycle**: standard.

#### Cycle 4 — Ratify PDR-076b (body-file frontmatter) — existing draft on disk

**R1 reshape (finding #1)**: PDR-076b already exists on disk at
`.agent/practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md`
with `Status: Proposed`. Cycle is **ratify-existing-draft**, not
net-new authoring.

**Parallel-safety**: sequenced after cycle 3 (independent
ratification trajectory; cycles 3 + 4 kept separate per R1
partial-decline of finding #2).

**Starting state**: branch HEAD post-cycle-3.

**File scope**:

- Modified: `.agent/practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md`
  (existing file; ratify Status; reconcile with captured prestage if
  divergent)
- Source for diff: captured Ferny prestage from cycle 1
- Modified: `.agent/practice-core/decision-records/PDR-076-agent-identity-tuple-and-body-file-frontmatter.md`
  (verify SPLIT redirect note exists for PDR-076b; amend if drifted)
- Modified: `.agent/practice-core/decision-records/README.md` (verify
  PDR-076b in index; add if absent)

**Action**:

1. Diff on-disk PDR-076b body against captured Ferny prestage block.
2. If divergent, surface to owner per cycle 3 reconciliation protocol.
3. Confirm Status verdict (default R1: **`Adopted`** per same
   ratification-evidence basis as cycle 3).
4. Verify SPLIT-redirect in PDR-076 v2 §Status references PDR-076b.
5. Verify README.md PDR index includes PDR-076b.

**Acceptance criteria**:

1. PDR-076b Status flipped from `Proposed` to ratification verdict
   (default `Adopted`; owner may override).
2. PDR-076b body reconciled with captured prestage.
3. PDR-076 v2 §Status SPLIT-redirect intact + references PDR-076b.
4. README.md PDR index includes PDR-076b.
5. `pnpm check` passes.

**Deterministic validation**:

```bash
test -f .agent/practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md
grep "^\\*\\*Status\\*\\*" .agent/practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md
grep -c "PDR-076b" .agent/practice-core/decision-records/README.md
grep -c "PDR-076b" .agent/practice-core/decision-records/PDR-076-agent-identity-tuple-and-body-file-frontmatter.md
pnpm check
```

Expected: exit 0; Status line shows ratification verdict.

**Reviewer dispatch**: docs-adr-expert.

**Marshal-cycle**: standard.

#### Cycle 5 — PDR-077 absorption + final author

**R1 amendments**:

- Finding #28: explicit §Absorption Trail subsection schema (see Action step 5 below).
- Finding #24: add reciprocal-validation grep on PDR-077 body (see Deterministic validation).

**Parallel-safety**: sequenced after cycle 4.

**Starting state**: branch HEAD post-cycle-4.

**File scope**:

- New: `.agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md`
- Source: captured draft + R3 synthesis from cycle 2
- Modified: `.agent/practice-core/decision-records/README.md`
- Modified: `.agent/practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md`
  (§Related cross-reference)
- Modified: `.agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md`
  (§Related cross-reference)

**Action**:

1. Absorb the 7 R3 SHOULD-ABSORB items from captured synthesis (each
   absorbed into PDR-077 draft with citation to source review round).
2. Absorb the 1 Director-verdict item (claim-state immutability
   clause) per Director Seaworthy's verdict captured in the synthesis.
3. Author final PDR-077 covering: role definition (marshal-as-cycle
   actor), cycle protocol (intent → claim → review → land),
   gate-singleton invariant (one marshal per cycle), throughput
   observation (empirical evidence from Ashen + Mistbound regimes),
   standing-duty intersection (feedback_marshal_queues_comms_and_memory_state),
   PDR-063 + PDR-064 cross-references.
4. Add reciprocal §Related entries to PDR-063 and PDR-064 referencing
   PDR-077.
5. **§Absorption Trail subsection** (R1 finding #28): add a final
   subsection to PDR-077 titled `### Absorption Trail`. Schema for
   each entry (bullet):

   ```text
   - [SHOULD-ABSORB|VERDICT] R{n}: <one-line-item-summary>
     (source: <synthesis-doc-path-or-anchor>)
   ```

   All 7 SHOULD-ABSORB items + 1 VERDICT item listed; reviewer can
   verify substantive absorption against this trail.

**Acceptance criteria**:

1. PDR-077 file at named path; substance covers 7 absorbed items + 1
   verdict item + 5 named sections above.
2. Frontmatter `Status: Adopted` (per R3 final docs-adr-expert GO).
3. PDR-063 + PDR-064 §Related sections cite PDR-077.
4. README.md PDR index includes PDR-077 entry.
5. `pnpm check` passes.

**Deterministic validation**:

```bash
test -f .agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md
grep -c "Status: Adopted" .agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md
grep -c "PDR-077" .agent/practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md
grep -c "PDR-077" .agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md
grep -c "PDR-077" .agent/practice-core/decision-records/README.md
# R1 finding #24: reciprocal-validation back-direction check
grep -cE "PDR-063|PDR-064" .agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md
# R1 finding #28: §Absorption Trail subsection presence + content check
grep -c "^### Absorption Trail" .agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md
grep -cE "\\[SHOULD-ABSORB|VERDICT\\] R[0-9]+:" .agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md
pnpm check
```

Expected: exit 0; PDR-077 references PDR-063 + PDR-064 (≥ 2);
§Absorption Trail section present with ≥ 8 entries (7 SHOULD-ABSORB +
1 VERDICT).

**Reviewer dispatch**: docs-adr-expert (one final pass to confirm
absorption integrity + verify §Absorption Trail covers all 8 items);
assumptions-expert (proportionality check — PDR-077 is bigger than
typical PDR; warranted by empirical evidence).

**Marshal-cycle**: standard.

#### Cycle 5a — Author PDR-079 (PDR-vs-ADR portability distinction) + `no-moving-targets` rule scope-update (WS-12, R2 Lanternlit absorption)

**R2 absorption (Lanternlit lane WS-12)**: owner-directed integration.
WS-12 was AUTHOR-IN-FLIGHT in Lanternlit's lane (owner-directed
2026-05-24 per primary plan R1.5); never landed. R2 absorbs into this
plan as cycle 5a so the BLOCKING prerequisite for cycles 6 + 7
satisfies in-band.

**Parallel-safety**: sequenced after cycle 5 (depends on substrate
hygiene from cycles 1-2 + PDR-077 landing baseline).

**Starting state**: branch HEAD post-cycle-5.

**File scope**:

- New: `.agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md`
- Modified: `.agent/practice-core/decision-records/README.md` (add
  PDR-079 to index)
- Modified: `.agent/rules/no-moving-targets-in-permanent-docs.md`
  (scope-update co-cure: rule applies strictly to **portable surfaces**
  (PDRs + rules + patterns), NOT to repo-bound ADRs)
- Modified (if applicable): hook implementation enforcing the rule
  (path TBD at cycle-open via grep) to recognise the new scope
  boundary

**Action**: author PDR-079 per primary plan WS-12 substance + R1
finding #8 expansion. Content:

- Decision: PDRs are portable practice doctrine (claim about how
  multi-agent practice works; applies to ANY repo with multi-agent
  collaboration; CANNOT contain SHAs, repo paths, branch names, plan
  filenames — anything that ties to *this* git history). ADRs are
  repo-specific architectural decisions (choice about how *this*
  repo's substrate implements something; repo-bound by definition;
  SHAs and event-UUIDs welcome as appropriate evidence).
- Mechanism: SHA-in-PDR = misclassification signal — when content
  wants a SHA in a PDR, the SHA-bearing substance belongs in an ADR,
  not a PDR. Composition with PDR-066 (PDR↔ADR pattern). Co-cure:
  scope `no-moving-targets-in-permanent-docs.md` rule to portable
  surfaces only.
- §Related: PDR-066 (PDR↔ADR pattern), PDR-078 (worked instance —
  this plan's cycle 6 will cite PDR-079), ADR-186 (worked instance —
  cycle 7's repo-bound counterpart).

**Rule scope-update**: amend `.agent/rules/no-moving-targets-in-permanent-docs.md`
to explicitly state: rule applies to **portable surfaces** (`.agent/practice-core/decision-records/PDR-*.md` +
`.agent/rules/*.md` + `.agent/memory/active/patterns/*.md`); rule
does NOT apply to **repo-bound surfaces** (`docs/architecture/architectural-decisions/ADR-*.md`).
Cite PDR-079 as the governing distinction.

**Acceptance criteria**:

1. PDR-079 file at named path; covers Decision + Mechanism +
   §Related per above.
2. Frontmatter `Status: Adopted` (owner-direct ratification this turn
   suffices; reviewer dispatch corroborates).
3. README.md PDR index includes PDR-079.
4. `no-moving-targets-in-permanent-docs.md` updated with scope
   boundary; cites PDR-079.
5. PDR-079 body itself complies with the portability rule it codifies
   (ZERO SHAs / UUIDs / repo-paths / plan-filenames / branch-prefixes).
6. `pnpm check` passes.

**Deterministic validation**:

```bash
test -f .agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md
grep "^\\*\\*Status\\*\\*" .agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md
grep -c "PDR-079" .agent/practice-core/decision-records/README.md
grep -c "PDR-079" .agent/rules/no-moving-targets-in-permanent-docs.md
grep -c "portable surfaces\|repo-bound" .agent/rules/no-moving-targets-in-permanent-docs.md
# PDR-079 self-compliance: portability invariant on itself
grep -cE '[0-9a-f]{40}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' \
  .agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md || echo "1 OK"
grep -oE '\b[0-9a-f]{6,}\b' \
  .agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md | wc -l
grep -cE '(agent-tools/|\.agent/|docs/|apps/|packages/)' \
  .agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md || echo "3 OK"
pnpm check
```

Expected: exit 0; PDR-079 self-compliance grep returns 0 matches on
each portability check (or "OK" sentinel); rule file references
PDR-079 + names portable-vs-repo-bound scope.

**Reviewer dispatch**: docs-adr-expert (doctrine soundness);
architecture-expert-fred (strict principles adherence — this PDR
codifies the rule fred enforces); assumptions-expert (proportionality —
portability invariant).

**Marshal-cycle**: standard.

#### Cycle 6 — Author PDR-078 (liveness-heartbeat-contract, portable)

**R1 prerequisite (finding #8)**: PDR-079 MUST be landed before this
cycle opens. **R2 update**: PDR-079 now lands in-plan at cycle 5a;
this cycle opens after cycle 5a lands. Out-of-plan dependency removed.

**R1 amendment (finding #11)**: portability grep broadened to four
checks (short-hex / repo-path / plan-filename / branch-prefix).

**Parallel-safety**: sequenced after cycle 5.

**Starting state**: branch HEAD post-cycle-5.

**File scope**:

- New: `.agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md`
- Modified: `.agent/practice-core/decision-records/README.md`

**Action**: author PDR-078 per WS-11 bundle ratified shape. Content:

- Decision: liveness-heartbeat-contract as portable practice doctrine.
- Mechanism (emit-side + observe-side, portable; ZERO SHAs / repo
  paths / branch names / commit references per PDR-079 PDR-vs-ADR
  portability distinction).
- Cadence: ≤ 4 min default; threshold ≥ 10 min retires.
- Exemptions: coordinator-handoff grace window (per PDR-064);
  marshal-cycle contiguous-execution exemption; sub-agent dispatch
  verdict-synthesis exemption.
- §Related: PDR-027 (identity tuple in subject line) + PDR-063
  (retirement claim auto-rebalance) + PDR-064 (coordinator handoff
  grace window) + ADR-186 (repo phenotype, separate file because
  repo-bound).

**Acceptance criteria**:

1. PDR-078 file at named path; ZERO SHAs / UUIDs / repo paths in
   body (portability invariant — verifiable via grep).
2. Frontmatter `Status: Candidate` + `pdr_kind: contract`.
3. §Related references PDR-027 + PDR-063 + PDR-064 + ADR-186.
4. README.md PDR index includes PDR-078 entry.
5. `pnpm check` passes.

**Deterministic validation** (R1 finding #11: compound portability check):

```bash
test -f .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md
# Portability check 1: SHAs (40-char hex) or UUIDs
grep -cE '[0-9a-f]{40}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' \
  .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md || echo "1 OK"
# Portability check 2: short-hex (6+ char) — catches session-id-prefixes like '6966d4'
grep -oE '\b[0-9a-f]{6,}\b' \
  .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md | wc -l
# Portability check 3: repo-path fragments
grep -cE '(agent-tools/|\.agent/|docs/|apps/|packages/)' \
  .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md || echo "3 OK"
# Portability check 4: plan-filename pattern
grep -cE '\.plan\.md' \
  .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md || echo "4 OK"
# Portability check 5: branch-prefix pattern
grep -cE '(feat|fix|chore)/' \
  .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md || echo "5 OK"
grep -c "PDR-078" .agent/practice-core/decision-records/README.md
pnpm check
```

Expected: all 5 portability checks return 0 matches (or "OK"
sentinel); README contains PDR-078. ANY non-zero match on
portability checks 1–5 indicates a portability violation and fails
the cycle.

**Reviewer dispatch**: docs-adr-expert (doctrine soundness);
assumptions-expert (portability invariant check); architecture-expert-fred
(PDR/ADR portability distinction adherence per PDR-079).

**Marshal-cycle**: standard.

#### Cycle 7 — Author ADR-186 (comms-event-heartbeat-lifecycle-substrate)

**R1 prerequisite (finding #8)**: PDR-079 MUST be landed before this
cycle opens. **R2 update**: PDR-079 lands in-plan at cycle 5a; this
cycle's dependency satisfied in-band.

**R1 conditional resolution (finding #2)**: ground-state checked in
R1 — `event_type` in `.agent/state/collaboration/comms-event.schema.json`
is `{"type": "string", "minLength": 1}` (open-string, not enum). **No
schema amendment needed.** File scope simplified accordingly.

**R1 narrowing (finding #29)**: ADR-186 names OUTCOME only. Implementation
literals (`event_type='heartbeat'`, `[HEARTBEAT]` token) belong in
this plan's cycle 7 §Action body and the executing commit's source
files — NOT in ADR-186 prose.

**R1 amendment (finding #25)**: ADR-186 cross-reference to ADR-183 is
substance-grounded — heartbeat is a new tag-namespace consumer per
ADR-183's existing `["failure-mode", "behaviour-note", "heartbeat"]`
namespace. Cite this rationale inline.

**Parallel-safety**: sequenced after cycle 6.

**Starting state**: branch HEAD post-cycle-6.

**File scope**:

- New: `docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md`
- Modified: `docs/architecture/architectural-decisions/README.md` (or
  equivalent ADR index)
- Modified (CONDITIONAL on cycle-7 ground-state check): comms watcher
  renderer if `[HEARTBEAT]` rendering not already wired. Cycle-7
  ground-state check: grep watcher renderer for `[HEARTBEAT]` token;
  if absent, add wiring (renderer source TBD at cycle open).
- **NOT modified** (R1 finding #2 resolution): `comms-event.schema.json`
  — open-string `event_type` is sufficient.

**Action**: author ADR-186 per WS-11 bundle ratified shape (OUTCOME
only, per R1 finding #29). Content:

- Decision (OUTCOME): the comms-event substrate carries a designated
  lifecycle-substrate event-type for heartbeat liveness, distinguished
  in watcher render. Repo-bound concrete realisation of PDR-078's
  portable liveness contract.
- Phenotype reference: `lifecycle.event_type='heartbeat'` is the
  realisation chosen for this repo; rationale = `event_type` is
  open-string (no schema amendment cost); aligns with existing
  `[LIFECYCLE]` channel.
- Renderer rule (OUTCOME): tolerate-unknown-event-type so future
  lifecycle event-types do not break existing watchers.
- SHAs / event-UUIDs / repo paths ALLOWED in ADR-186 body per PDR-079
  (ADRs repo-bound).
- §Related: PDR-078 (portable contract) + ADR-183 (heartbeat is a
  new tag-namespace consumer per the existing
  `["failure-mode", "behaviour-note", "heartbeat"]` namespace).

**Acceptance criteria**:

1. ADR-186 file at named path; references PDR-078 + ADR-183.
2. `event_type='heartbeat'` is accepted by the schema (verify either
   via open-string spec or via enum amendment commit).
3. Watcher renders heartbeat events with `[HEARTBEAT]` token (verify
   via test or live event observation).
4. ADR index includes 186 entry.
5. `pnpm check` passes; agent-tools tests pass.

**Deterministic validation**:

```bash
test -f docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md
grep -c "PDR-078\|ADR-183" \
  docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md
pnpm --filter @oaknational/agent-tools test
pnpm check
```

Expected: exit 0; ADR-186 references both PDR-078 and ADR-183.

**Reviewer dispatch**: docs-adr-expert (ADR doctrine);
architecture-expert-fred (PDR/ADR portability distinction adherence);
code-expert (if schema or renderer changes land).

**Marshal-cycle**: standard.

#### Cycle 8 — Thin SKILL pointer + reciprocal amendments

**R1 amendments**:

- Finding #12: reciprocal §Related entries reference PDR-078 ONLY,
  never ADR-186 directly (ADR-186 ← PDR-078 is the one-way bridge).
- Finding #14: per-PDR independent verification (not grep-count
  collation).
- Finding #20: explicit preservation set enumerated (claim
  auto-rebalance protocol + three exemptions + §1 cron-status field
  linkage), not "operational essentials" handwave.
- Finding #21: PDR-078 Status flips `Candidate` → `Adopted` in this
  cycle (concurrent with SKILL thin-pointer adopting it as
  authoritative contract).
- Finding #35: one-line in-SKILL rationale breadcrumb so agents reading
  SKILL before PDR understand the shape.

**Parallel-safety**: sequenced after cycle 7.

**Starting state**: branch HEAD post-cycle-7.

**File scope**:

- Modified: `.agent/skills/start-right-team/SKILL-CANONICAL.md` — collapse
  §0.5 fat-draft to thin pointer to PDR-078; preserve §1 Register
  Presence cron-status field + §Closeout heartbeat-end clause.
- Modified: `.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md` —
  §Related amendment naming PDR-078 as heartbeat contract anchor.
- Modified: `.agent/practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md` —
  §Related amendment naming PDR-078 as liveness contract.
- Modified: `.agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md` —
  §Related amendment naming PDR-078 as liveness contract +
  grace-window exemption anchor.

**Action**:

1. Read SKILL §0.5 current text; identify the substantive contract
   (cadence, threshold, retirement rule) vs the SKILL-level operational
   guidance (cron invocation, mechanism details).
2. Replace SKILL §0.5 body with thin pointer: brief reference to
   PDR-078 + operational essentials (cron invocation pattern, the
   owner-input-precedence rule, the state-thresholds table).
3. Add reciprocal §Related entries to PDR-027 / PDR-063 / PDR-064
   per WS-11 bundle ratified shape.

**Acceptance criteria** (R1 expanded):

1. SKILL §0.5 ceiling: **≤ 30 lines OR all preservation items intact,
   whichever is larger** (was ~120 lines). References PDR-078 as
   authoritative contract.
2. **Preservation set explicit** (R1 finding #20): cadence (≤ 4 min),
   threshold (≥ 10 min), retirement rule, **claim auto-rebalance
   protocol** (per-claim disposition + handoff-record routing),
   **three exemptions** (coordinator-transfer grace window,
   marshal-cycle contiguous-execution, sub-agent dispatch
   verdict-synthesis), §1 cron-status field linkage. Any preservation
   item absent fails the cycle.
3. **Reciprocal §Related entries** (R1 finding #12): three
   amendments to PDR-027 / PDR-063 / PDR-064; each cites PDR-078
   ONLY (never ADR-186 directly — verified via grep).
4. **PDR-078 Status flip** (R1 finding #21): `Candidate` → `Adopted`
   in this cycle's commit (concurrent with SKILL thin-pointer adopting
   it as authoritative contract).
5. **In-SKILL rationale breadcrumb** (R1 finding #35): one-line note
   in SKILL §0.5 reading approximately *"Heartbeat doctrine relocated
   to PDR-078 (portable contract); ADR-186 carries the repo phenotype.
   See PDR-079 for the PDR-vs-ADR portability distinction that
   motivated the split."*
6. `pnpm check` passes.

**Deterministic validation** (R1 finding #14: per-PDR independent verification):

```bash
# SKILL §0.5 line count check (advisory; ≤30 is target, preservation is gating)
awk '/^### 0.5\./,/^### 1\./' \
  .agent/skills/start-right-team/SKILL-CANONICAL.md | wc -l
# Preservation set checks
awk '/^### 0.5\./,/^### 1\./' .agent/skills/start-right-team/SKILL-CANONICAL.md | \
  grep -cE 'cadence|4 min|≤ 4'
awk '/^### 0.5\./,/^### 1\./' .agent/skills/start-right-team/SKILL-CANONICAL.md | \
  grep -cE 'threshold|10 min|≥ 10'
awk '/^### 0.5\./,/^### 1\./' .agent/skills/start-right-team/SKILL-CANONICAL.md | \
  grep -cE 'auto-rebalance|rebalance'
awk '/^### 0.5\./,/^### 1\./' .agent/skills/start-right-team/SKILL-CANONICAL.md | \
  grep -cE 'coordinator-transfer|grace window'
awk '/^### 0.5\./,/^### 1\./' .agent/skills/start-right-team/SKILL-CANONICAL.md | \
  grep -cE 'marshal-cycle.*exemption|contiguous-execution'
awk '/^### 0.5\./,/^### 1\./' .agent/skills/start-right-team/SKILL-CANONICAL.md | \
  grep -cE 'sub-agent dispatch|verdict-synthesis'
# Reciprocal amendments per-PDR (R1 finding #14: independent check, not collation)
grep -c "PDR-078" .agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md
grep -c "PDR-078" .agent/practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md
grep -c "PDR-078" .agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md
# R1 finding #12: NO direct ADR-186 references in the three reciprocal PDRs
grep -c "ADR-186" .agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md
grep -c "ADR-186" .agent/practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md
grep -c "ADR-186" .agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md
# R1 finding #21: PDR-078 Status check
grep "^\\*\\*Status\\*\\*" .agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md
pnpm check
```

Expected: each preservation-set grep ≥ 1; each PDR-078-reference grep
≥ 1; each ADR-186-reference grep == 0 in reciprocal PDRs;
PDR-078 Status reads `Adopted`; exit 0.

**Reviewer dispatch**: docs-adr-expert (cross-reference integrity +
SKILL-vs-PDR boundary); onboarding-expert (SKILL §0.5 thin-pointer
remains discoverable by new agents in the resume-protocol path).

**Marshal-cycle**: standard.

#### Cycle 8a — Author WS-8 ADR (Claude self-modification authz cure-shape, R2 Lanternlit absorption)

**R2 absorption (Lanternlit lane WS-8)**: owner-directed integration.
WS-8 was AUTHOR-IN-FLIGHT in Lanternlit's lane (owner-directed
2026-05-24 *"Author it NOW"* per primary plan R1.5); never landed.
R2 absorbs into this plan as cycle 8a — independent of cycles 5a-8
(self-mod authz is a separate concern from heartbeat doctrine), and
sequenced at end of Phase 2 (doctrine landings) so all doctrine
artefacts land before infrastructure work begins.

**Parallel-safety**: sequenced after cycle 8 (independent of cycles
5a-8 substance; positioned here for Phase 2 cohesion).

**Starting state**: branch HEAD post-cycle-8.

**File scope**:

- New: `docs/architecture/architectural-decisions/187-claude-self-modification-authorisation-cure-shape.md`
  (next-available ADR number; verify at cycle-open via
  `ls docs/architecture/architectural-decisions/`).
- Modified: `docs/architecture/architectural-decisions/README.md` (or
  equivalent ADR index) — add ADR-187 entry.

**Action**: author ADR-187 per owner shape-verdict captured in
primary plan §M2 Criterion 3 + WS-8 row. Content:

- Decision: ratify the C2 + C5 + C4 cure-shape combination for Claude
  self-modification authorisation (per the named cure-shape options
  Director Seaworthy surfaced 2026-05-23 19:28:47Z; owner verdict
  R1.5 2026-05-24).
  - C2 (near-term): scoped trust grants per session-context with
    explicit owner authorisation events.
  - C5 (long-term): platform-level binding self-mod authorisation
    primitive (deferred trigger).
  - C4 (fallback): owner-direct-only path for self-mod when neither
    C2 nor C5 applies.
- C2-deferred-until-platform-support trigger: codify *"when Anthropic
  platform supports binding self-mod authz"* as the named trigger
  for migration from C2 (current) to C5 (target). Until then, C2 +
  C4 carry the contract.
- Repo-bound substrate (ADR-class per PDR-079 portability distinction
  landed cycle 5a): SHAs / event-UUIDs / repo paths allowed in body
  as appropriate evidence.
- §Related: PDR-079 (portability distinction governing this ADR's
  repo-bound classification); cross-references to any existing
  authz-relevant PDRs / ADRs (verify at cycle-open).

**Acceptance criteria**:

1. ADR-187 file at named path; covers Decision + Mechanism +
   §Related.
2. C2 + C5 + C4 cure-shape combination explicit; trigger for C5
   migration named.
3. ADR index includes ADR-187.
4. `pnpm check` passes.

**Deterministic validation**:

```bash
test -f docs/architecture/architectural-decisions/187-claude-self-modification-authorisation-cure-shape.md
grep -cE "C2|C5|C4" \
  docs/architecture/architectural-decisions/187-claude-self-modification-authorisation-cure-shape.md
grep -c "binding self-mod authz\|platform-level" \
  docs/architecture/architectural-decisions/187-claude-self-modification-authorisation-cure-shape.md
grep -c "PDR-079" \
  docs/architecture/architectural-decisions/187-claude-self-modification-authorisation-cure-shape.md
grep -c "ADR-187\|187-claude-self-modification" \
  docs/architecture/architectural-decisions/README.md
pnpm check
```

Expected: exit 0; ADR-187 covers all three cure shapes + the C5
migration trigger; ADR-187 cites PDR-079; ADR index references
ADR-187.

**Reviewer dispatch**: docs-adr-expert (doctrine soundness +
§Related cross-references); assumptions-expert (proportionality of
the three-cure combination + the C2-deferred trigger shape);
security-expert (any security-sensitive substrate the cure-shape
introduces — authz is a security boundary).

**Marshal-cycle**: standard.

### Phase 3 — Infrastructure Cleanup (cycles 9–11)

**Purpose**: land §P5.W1 comms-watch seen-state redesign per primary
plan promotion-eligibility. Each WS is one cycle.

#### Cycle 9 — Comms-watch CLI auto-seed (WS1)

**R1 amendments**:

- Finding #15: **backward-compat statement**. Auto-seed-on-empty is
  an intentional behaviour change. Any caller passing an empty
  seen-file to trigger full history replay must use a new explicit
  `--no-auto-seed` flag (added as part of cycle 9). Cycle 11 SKILL §0
  update follows so the next team session uses the new semantics.
- Finding #26: deterministic-validation commands annotated Red (pre-
  implementation) vs Green (post-implementation).

**Parallel-safety**: sequenced after cycle 8.

**Starting state**: branch HEAD post-cycle-8.

**File scope**:

- Modified: `agent-tools/src/collaboration-state/cli-comms-watch.ts`
  (or equivalent watch-loop entry) — add `--seed-from-now` flag +
  auto-seed-on-missing/empty default.
- Modified: `agent-tools/tests/collaboration-state/comms-watch-loop.unit.test.ts`
  (or equivalent test file) — failing test first.
- Modified: CLI help text (update `--help` output for `comms watch`).

**TDD pair** (atomic-landing invariant — all tests + product code in
ONE commit):

- **Failing tests**: (a) watcher armed with missing seen-file emits
  NO historical events (auto-seed catches missing); (b) watcher
  armed with empty seen-file emits NO historical events (auto-seed
  catches empty); (c) watcher armed with `--seed-from-now` emits NO
  historical events regardless of seen-file state; (d) **`--no-auto-seed`
  flag** preserves the legacy replay-on-empty behaviour (per R1
  backward-compat statement).
- **Product code**: detect missing/empty seen-file at startup; seed
  state with current directory listing; proceed as if all current
  events are baseline-seen. Implement `--seed-from-now` flag as
  explicit-trigger form. Implement `--no-auto-seed` flag as
  legacy-replay opt-in (preserves backward-compat for callers
  intentionally using empty-seen-file as replay trigger).
- **Refactor**: extract auto-seed into a small named function for
  testability.

**Acceptance criteria**:

1. All failing tests pass after implementation; all existing tests
   pass (Green). TDD pair landed in single commit (atomic-landing).
2. CLI help text names auto-seed behaviour + `--no-auto-seed`
   backward-compat flag.
3. `--seed-from-now` flag documented + tested.
4. `--no-auto-seed` flag documented + tested (R1 finding #15).
5. `pnpm check` passes.

**Deterministic validation** (R1 finding #26: Red/Green annotated):

```bash
# Pre-implementation Red state (BEFORE cycle commit):
#   Tests fail; help text grep returns 0
# Post-implementation Green state (AFTER cycle commit):
#   Tests pass; help text grep returns ≥ 1
pnpm --filter @oaknational/agent-tools test -- \
  agent-tools/tests/collaboration-state/comms-watch-loop
# [GREEN] expected exit 0 after cycle commit
pnpm agent-tools:collaboration-state -- comms watch --help 2>&1 | \
  grep -E "seed-from-now|auto-seed|no-auto-seed"
# [GREEN] expected ≥ 1 match after cycle commit
pnpm check
# [GREEN] expected exit 0 after cycle commit
```

Expected post-commit: exit 0; auto-seed + no-auto-seed surfaced in
help text.

**Reviewer dispatch**: test-expert (TDD-pair shape, atomic-landing
invariant); code-expert (CLI semantics + flag-default consistency);
type-expert (any new generic / type widening).

**Marshal-cycle**: standard.

#### Cycle 10 — Comms-watch storage redesign (WS2)

**R1 amendments** (this cycle absorbs the largest R1 expansion —
five findings + two NITs):

- **Finding #5 (Wilma CRITICAL)**: transactional write discipline
  (atomic rename pattern); parse-error fallback semantics.
- **Finding #7 (type-expert CRITICAL)**: explicit Zod schema
  deliverables; safeParse-discriminated read.
- **Finding #13 (Betty IMPORTANT)**: regression check for cycle 7's
  watcher renderer surface (`[HEARTBEAT]` token render).
- **Finding #17 (type-expert IMPORTANT)**: dependency-injected env
  for cache-dir path resolver; no `process.env` in tests.
- **Finding #31 (Wilma IMPORTANT)**: empty-string `XDG_CACHE_HOME`
  - unset `HOME` edge case — explicit error, not silent
  relative-path fallback.

**Parallel-safety**: sequenced after cycle 9.

**Starting state**: branch HEAD post-cycle-9.

**File scope**:

- New: `agent-tools/src/collaboration-state/state-schemas.ts`
  amendments (or new sibling file) — `CommWatchSeenState` + `LegacySeenState`
  Zod schemas.
- New: `agent-tools/src/collaboration-state/comms-watch-state-io.ts`
  (or absorbed into existing state-IO module) — typed I/O functions:
  `readSeenState(path: string)`, `writeSeenStateAtomic(path: string, state: CommWatchSeenState)`,
  `resolveCommsWatchStatePath(identity: CollaborationAgentId, env: Pick<NodeJS.ProcessEnv, 'XDG_CACHE_HOME' | 'HOME'>)`.
- Modified: `agent-tools/src/collaboration-state/cli-comms-watch.ts`
  - adjacent state-IO modules — wire new state-IO functions; legacy
  read-and-migrate on first tick; WRITE TO NEW LOCATION ONLY (legacy
  becomes read-only migration source, eliminating cycle-11 write-side
  race).
- Modified: corresponding test files — see TDD section below.

**Zod schemas** (R1 finding #7 — explicit deliverables, not "hand-rolled"):

```typescript
// state-schemas.ts additions
export const CommWatchSeenState = z.strictObject({
  last_seen_mtime: z.string().min(1),
  last_seen_filenames: z.array(z.string()),
});
export type CommWatchSeenState = z.infer<typeof CommWatchSeenState>;

export const LegacySeenState = z.array(z.string()); // UUID list
export type LegacySeenState = z.infer<typeof LegacySeenState>;
```

**Format-detection on read** (R1 finding #7): safeParse against new
schema first; on failure safeParse against legacy schema; on both
failure log + treat as missing (auto-seed catches per cycle 9).

**Transactional write** (R1 finding #5): write to
`<path>.tmp-<pid>-<timestamp>` in same directory; fsync; atomic
rename to final path. On crash mid-write, the tmp file is orphaned
(swept by future implementation, not in cycle scope) and the final
path remains in its pre-write state.

**Path resolver with injected env** (R1 finding #17): function
signature is
`resolveCommsWatchStatePath(identity: CollaborationAgentId, env: Pick<NodeJS.ProcessEnv, 'XDG_CACHE_HOME' | 'HOME'>): string`.
Tests pass literal env objects, NEVER read `process.env`.

- If `env.XDG_CACHE_HOME` truthy + non-empty: use it.
- Else if `env.HOME` truthy: use `${HOME}/.cache`.
- Else THROW explicit error (R1 finding #31: no silent relative-path
  fallback).
- Compose final path: `${cacheBase}/oak/practice/${session_id_prefix}/comms-watch.json`.

**TDD pair** (atomic-landing — all tests + product code in ONE commit):

- **Failing tests** (each is a system-state assertion, not
  audit-shape):
  1. New-format roundtrip: write state via `writeSeenStateAtomic`,
     read back via `readSeenState`, equal.
  2. Legacy migration: write legacy UUID-list to disk; read via
     `readSeenState`; observe LegacySeenState parse; observe
     auto-rewrite to new format on next write tick.
  3. Multi-file mtime-tie: two events with identical mtime; both
     captured in `last_seen_filenames` array; neither re-emits.
  4. Cache-dir auto-create: target dir missing; `writeSeenStateAtomic`
     creates parent dirs; final file exists.
  5. Per-session-prefix isolation: two `resolveCommsWatchStatePath`
     calls with different identities produce different paths.
  6. **Crash-recovery** (R1 finding #5): simulate partial write
     (tmp-file exists, final not yet renamed); `readSeenState` on
     final path returns previous state (not corrupted-tmp); subsequent
     fresh write succeeds.
  7. **Parse-error fallback** (R1 finding #5): write a corrupted
     file (truncated JSON); `readSeenState` logs + returns
     `undefined`; caller (cycle 9 auto-seed) handles `undefined` as
     missing-file.
  8. **DI env edge** (R1 finding #31): `resolveCommsWatchStatePath`
     with `env: { XDG_CACHE_HOME: '', HOME: '' }` throws; with
     `env: { XDG_CACHE_HOME: '', HOME: '/home/user' }` falls through
     to `/home/user/.cache/...`.
  9. **Renderer regression** (R1 finding #13): if cycle 7 wired
     `[HEARTBEAT]` token rendering, this cycle's watcher invocation
     must still render `[HEARTBEAT]` events with the token. Skip if
     cycle 7 did NOT wire renderer (event_type='heartbeat' rendered
     via existing `[LIFECYCLE]` token in that case).
- **Product code**: implement Zod schemas + transactional write +
  safeParse-discriminated read + DI path resolver per above
  specifications.
- **Refactor**: extract per-concern helpers (atomicWrite, parseSeen,
  resolveStatePath) for testability.

**Acceptance criteria**:

1. All TDD pair tests pass; existing comms-watch tests pass (no
   regression) — TDD pair landed in single commit (atomic-landing).
2. State file lives at the new ephemeral location (verified by test
   with literal `env` value).
3. Legacy UUID-list files in `.agent/state/collaboration/comms-seen/`
   still work on first read (read-and-migrate path) — but NEW writes
   go to new location only.
4. Transactional write discipline implemented (tmp-file + atomic
   rename); crash-recovery test passes.
5. Parse-error fallback implemented; corrupted-file test passes.
6. No `process.env` access in test bodies (R1 finding #17 — tests
   inject literal env values).
7. Renderer regression check passes if cycle 7 wired `[HEARTBEAT]`.
8. `pnpm check` passes.

**Deterministic validation**:

```bash
# Pre-cycle ground-state: verify cycle 7 renderer state
grep -c "HEARTBEAT" agent-tools/src/collaboration-state/cli-comms-watch.ts || \
  echo "renderer not wired in cycle 7 — regression check optional"
# TDD pair test run
pnpm --filter @oaknational/agent-tools test -- \
  agent-tools/tests/collaboration-state/comms-watch-loop \
  agent-tools/tests/collaboration-state/state-schemas \
  agent-tools/tests/collaboration-state/comms-watch-state-io
# Type check
pnpm --filter @oaknational/agent-tools type-check
# Lint
pnpm --filter @oaknational/agent-tools lint
# Full check
pnpm check
```

Expected: all gates exit 0.

**Reviewer dispatch**: code-expert (state-IO correctness + atomic
write discipline); type-expert (Zod schema + safeParse discriminator —
DI signature); architecture-expert-wilma (failure-mode re-review:
crash-recovery cure verified; cross-platform empty-env cure verified);
test-expert (TDD-pair atomic landing + test coverage shape).

**Tracked condition (R1 finding #33 declined)**: NFS/SMB file-locking
semantics are out of scope for this cycle. If a future agent surfaces
concurrent-watcher hazards on NFS/SMB (which the current dev team
does not use), absorb as a follow-on cure.

**Marshal-cycle**: standard.

#### Cycle 11 — Comms-watch cleanup (WS3)

**R1 amendments** (four findings absorbed):

- **Finding #4 (code-expert CRITICAL)**: `agent-tools/README.md:348`
  added to File scope.
- **Finding #6 (Wilma CRITICAL)**: in-flight reader race cured via
  cycle-10 write-side change (writes go to new location only;
  legacy is read-only migration source) + explicit pre-delete check
  for active comms-watcher claims.
- **Finding #10 (onboarding-expert CRITICAL)**: rule file +
  fallback script added to File scope.
- **Finding #32 (Wilma IMPORTANT)**: grep pre-check exclude scope
  extended to `.github/`, `scripts/`, `docs/`.

**Parallel-safety**: sequenced after cycle 10.

**Starting state**: branch HEAD post-cycle-10.

**File scope**:

- Deleted: `.agent/state/collaboration/comms-seen/` directory and all
  contents (every agent's committed seen-file).
- Modified: `agent-tools/src/collaboration-state/cli-comms-watch.ts`
  — drop legacy-location compat read code path (now-unreferenced).
- Modified: `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0
  — remove `--seen-file` argument from canonical invocation; remove
  the re-seed instruction block; remove the seen-file path reference.
- Modified: `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0
  **fallback script** (lines ~199-226 per R1 finding #10) — revise
  to align with new mechanism OR delete; cross-platform agents
  bouncing into fallback must not re-introduce the legacy UUID-list.
- Modified: `.agent/reference/comms-watch-mechanism.md` — describe
  the new mechanism (mtime watermark + ephemeral per-session location
  - auto-seed); remove the legacy UUID-list mechanism description.
- Modified (R1 finding #4): `agent-tools/README.md` — update line
  ~348 to remove `comms-seen` path reference; replace with new
  mechanism description.
- Modified (R1 finding #10): `.agent/rules/continuity-surface-commits-as-orphans.md`
  line 12 — remove `comms-seen/*.json` from enumerated continuity
  surfaces.

**Action**:

1. **Pre-delete safety check (R1 finding #6)**: query active-claims
   for any comms-watcher / coordination-state claim:

   ```bash
   jq '.claims[] | select(.intent_summary | test("comms-watch|coordination-state"; "i"))' \
     .agent/state/collaboration/active-claims.json
   ```

   If any active claims, surface to owner before deletion. If none,
   proceed.
2. **Pre-check repo for external consumers (R1 finding #32)**:

   ```bash
   grep -r "comms-seen" \
     --exclude-dir=node_modules --exclude-dir=.git \
     --include="*.ts" --include="*.json" --include="*.md" --include="*.sh" \
     .
   # Audit must include but-not-exclude .github/, scripts/, docs/
   ```

   If results > test fixtures + the directory itself + files already
   in cycle 11 file scope, surface to owner before deletion.
3. Delete directory + contents.
4. Drop legacy compat code path from `cli-comms-watch.ts`.
5. Update SKILL §0 (main path + fallback script).
6. Update `comms-watch-mechanism.md`.
7. Update `agent-tools/README.md` line ~348.
8. Update `continuity-surface-commits-as-orphans.md` line 12.

**Acceptance criteria**:

1. Pre-delete safety check found zero active comms-watcher claims
   (or owner approved override).
2. `.agent/state/collaboration/comms-seen/` no longer exists.
3. `grep -r "comms-seen" --exclude-dir=node_modules` shows zero
   matches outside test fixtures + the deleted directory.
4. SKILL §0 main path has no re-seed instruction; no `--seen-file`
   argument in canonical invocation.
5. SKILL §0 fallback script either deleted or re-aligned with new
   mechanism (no UUID-list write).
6. `comms-watch-mechanism.md` describes new mechanism.
7. `agent-tools/README.md` line ~348 no longer references legacy path.
8. `continuity-surface-commits-as-orphans.md` line 12 no longer
   enumerates `comms-seen/*.json`.
9. `pnpm check` passes.
10. Comms watcher continues to function (smoke test: arm watcher in a
    throwaway directory, observe events emit correctly).

**Deterministic validation**:

```bash
test ! -d .agent/state/collaboration/comms-seen
# R1 finding #32: exclude scope extended
grep -r "comms-seen" \
  --exclude-dir=node_modules --exclude-dir=.git \
  --include="*.ts" --include="*.json" --include="*.md" --include="*.sh" . | \
  grep -v "test\|spec" | wc -l
grep -c "seed-from-now\|auto-seed" .agent/reference/comms-watch-mechanism.md
# R1 finding #4
grep -c "comms-seen" agent-tools/README.md
# R1 finding #10
grep -c "comms-seen" .agent/rules/continuity-surface-commits-as-orphans.md
# Verify fallback script either deleted or rewritten (no UUID-list write)
grep -c "comms-seen" .agent/skills/start-right-team/SKILL-CANONICAL.md
pnpm check
```

Expected: directory absent; zero non-test matches in repo; new
mechanism documented in reference doc; README + rule file + SKILL
all clean of `comms-seen` references; exit 0.

**Reviewer dispatch**: docs-adr-expert (SKILL §0 prose alignment +
reference doc accuracy + rule file accuracy); onboarding-expert
(resume-protocol shape post-cleanup remains discoverable + complete;
fallback script revision sound).

**Marshal-cycle**: standard.

### Phase 4 — Test-Debt + Sonar Residue (cycles 12–14)

**Purpose**: clean up Sonar findings + test-debt that were paused
mid-cycle by the M1 push window. Independent of any milestone;
tree-cleanliness only. Deferrable indefinitely without consequence.

#### Cycle 12 — S5443×14 fixture replacement (Charcoal Beta substance)

**R1 amendment (finding #27)**: "consistency sweep adjacent files"
is explicitly marked as a **deferred-identification step at
cycle-open** — implementer runs Sonar surface query OR
`grep -rn "fs.writeFileSync\|os.tmpdir" agent-tools/tests/` at
cycle-open and names the files; cycle-open broadcasts the resolved
file list to comms before opening claim.

**Parallel-safety**: sequenced after cycle 11.

**Starting state**: branch HEAD post-cycle-11.

**File scope**:

- Modified: `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts`
  (10 S5443 sites — replace inline temp-file fixtures with named
  fixture helpers).
- Modified: `agent-tools/tests/collaboration-state/watcher-heartbeat.unit.test.ts`
  (4 S5443 sites).
- Modified (deferred-identification per R1 finding #27): 2 adjacent
  files for consistency sweep. Implementer identifies at cycle-open
  via either: (a) Sonar surface query for S5443 sites in
  `agent-tools/tests/`, OR (b) local grep
  `grep -rn "fs.writeFileSync\|os.tmpdir" agent-tools/tests/`. The
  resolved file list is broadcast to comms before claim opens.

**Action**: replace inline temp-file fixtures with named fixture
helpers per S5443 cure shape. Mechanical; no behaviour change.

**Acceptance criteria**:

1. All 14 S5443 sites cured (no inline fixtures remain in named
   files).
2. Tests still pass (no behavioural regression).
3. SonarCloud no longer reports S5443 on the cured files (verify
   via Sonar API or local sonar-scanner run if available; otherwise
   verify post-merge in CI).
4. `pnpm check` passes.

**Deterministic validation**:

```bash
pnpm --filter @oaknational/agent-tools test -- \
  agent-tools/tests/collaboration-state/watcher-staleness \
  agent-tools/tests/collaboration-state/watcher-heartbeat
pnpm check
```

Expected: exit 0; tests pass; tree clean.

**Reviewer dispatch**: code-expert (fixture-helper extraction shape);
test-expert (no system-state coverage regression from the refactor).

**Marshal-cycle**: standard.

#### Cycle 13 — eslint.config.ts cpd-exclusion (Charcoal Gamma residue)

**R1 reshape (finding #3 CRITICAL)**: `resolveSelfIdentity`
extraction sub-task **DROPPED**. Ground-state verified by code-expert
fan-out: `resolveSelfIdentity` already lives once at
`agent-tools/src/collaboration-state/cli-self-identity.ts` and is
imported by `cli-comms-watch.ts` + `cli-comms-inbox.ts`. NOT
duplicated in `bin/` files. The pre-pause routing premise was stale
(the extraction had already landed via some prior cycle or bundle
`340752bb`). Cycle 13 narrowed to just the eslint cpd-exclusion.

**Parallel-safety**: sequenced after cycle 12.

**Starting state**: branch HEAD post-cycle-12.

**File scope**:

- Modified: `sonar-project.properties` — add `**/eslint.config.ts`
  to `sonar.cpd.exclusions` (eslint config files legitimately
  duplicate boilerplate; current cpd surface is noise).

**Action**: append `**/eslint.config.ts` to existing
`sonar.cpd.exclusions` list in `sonar-project.properties`. Mechanical;
no code change.

**Acceptance criteria**:

1. `sonar.cpd.exclusions` includes `**/eslint.config.ts`.
2. `pnpm check` passes.
3. Post-merge Sonar gate remains GREEN (verify in CI; not local
   reproducible).

**Deterministic validation**:

```bash
grep -c "eslint.config.ts" sonar-project.properties
pnpm check
```

Expected: exit 0; eslint.config.ts present in exclusions.

**Reviewer dispatch**: none (single-line config edit; no substance
review warranted).

**Marshal-cycle**: standard. (Small cycle; possibly bundleable with
cycle 12 if marshal seat is busy. Default: separate per linear
constraint.)

#### Cycle 14 — Audit-shaped test deletion (Twilit Cycle 3)

**R1 amendments**:

- **Finding #16 (code-expert IMPORTANT)**: deletion scope
  disambiguated — delete lines **221-247 inclusive** (line 233 is
  blank-line separator between the two test cases; deleting both with
  the separator is correct). Acceptance criterion adds explicit
  post-deletion line-count check (pre-deletion count minus 27).
- **Finding #18 (test-expert IMPORTANT)**: gating-evidence note added
  — *confirming test-expert reviewer reads lines 221-247 directly at
  cycle-open*; Twilit's pre-pause audit-shape classification is
  advisory not self-sufficient as gate evidence. **R1 fan-out's
  test-expert review HAS already confirmed both test blocks are
  audit-shaped** (call-count assertion at 221-232; pathspec assertion
  at 234-247 — both pin internal implementation choices). Deletion is
  correct per audit-shape definition. The cycle-open reviewer
  re-confirms.

**Parallel-safety**: sequenced after cycle 13.

**Starting state**: branch HEAD post-cycle-13.

**File scope**:

- Modified: `agent-tools/tests/commit-workflow.unit.test.ts` — delete
  lines **221-247 inclusive** (27 lines total).

**Action**:

1. Capture pre-deletion line count: `wc -l agent-tools/tests/commit-workflow.unit.test.ts`.
2. **Confirming test-expert reviewer reads lines 221-247 directly at
   cycle-open** (R1 finding #18). Verify both test blocks are
   audit-shaped per definition: do they describe a system state
   (legitimate) or audit an implementation choice (deletable)? R1
   fan-out's test-expert confirmed both are audit-shape; cycle-open
   reviewer re-confirms.
3. Delete lines 221-247 inclusive (the two test blocks + the
   separator blank line).
4. Verify no system-state coverage regression: other tests in the
   file still cover the system states the deleted tests were nominally
   checking. Code-expert reviewer confirms.

**Acceptance criteria**:

1. Lines 221-247 deleted (27 lines).
2. Post-deletion line count = pre-deletion line count − 27.
3. All other tests in `commit-workflow.unit.test.ts` pass.
4. Test-expert reviewer confirms deletion is correct per audit-shape
   definition (gating).
5. Code-expert reviewer confirms no system-state coverage regression.
6. `pnpm check` passes.

**Deterministic validation**:

```bash
# Verify deletion size is exactly 27 lines
# (Run before cycle: PRE_COUNT=$(wc -l < agent-tools/tests/commit-workflow.unit.test.ts))
# (Run after cycle: POST_COUNT=$(wc -l < agent-tools/tests/commit-workflow.unit.test.ts))
# Verify: PRE_COUNT - POST_COUNT == 27
pnpm --filter @oaknational/agent-tools test -- commit-workflow
pnpm check
```

Expected: exit 0; tests pass; line-count delta exactly 27.

**Reviewer dispatch**: test-expert (audit-shape verification —
**gating**; reviewer reads lines 221-247 directly, Twilit's prior
classification is advisory only); code-expert (no system-state
coverage regression).

**Marshal-cycle**: standard.

### Phase 5 — Branch Fitness Drain (cycle 15)

**Purpose**: drain the residual branch fitness surface (SOFT floor +
napkin accumulation + pending-graduations buffer) so post-plan tree
state is materially cleaner than at plan-open. Highest-impact-per-
effort selection per R3 owner direction. Comms-events archival
deliberately EXCLUDED per owner correction (comms-events are critical
resource; the handling problem is the seen-state mechanism, addressed
by cycles 9–11).

#### Cycle 15 — Branch fitness drain (composite hygiene cycle, R3 owner-directed)

**Parallel-safety**: sequenced after cycle 14 (final cycle).

**Starting state**: branch HEAD post-cycle-14.

**File scope** (deferred-identification at cycle-open; surface varies
per cycle-open SOFT inventory):

- Modified (sweep): all markdown files surfaced by
  `pnpm practice:fitness:strict-hard` or `pnpm markdownlint-check:root`
  as soft-floor contributors. Identified at cycle-open via the
  fitness sweep.
- Modified (if rotation criteria met): `.agent/memory/active/napkin.md`
  - new archive shard at
  `.agent/memory/active/archive/napkin-<date>-<topic>.md`.
- Modified (drain): `.agent/memory/operational/pending-graduations.md`
  - per-candidate destination files (PDR / rule / pattern / memory)
  for any candidates with met trigger conditions.

**Action** (executed as sub-steps; cycle may land as 1-3 commits per
curator-pass convention if needed):

1. **Pre-cycle fitness baseline**: capture current SOFT count.

   ```bash
   pnpm practice:fitness:strict-hard 2>&1 | tail -10
   ```

   Record baseline number in cycle evidence.

2. **Soft-surface markdownlint sweep**: identify + fix soft-floor
   contributors.

   ```bash
   pnpm markdownlint-check:root
   pnpm practice:fitness:strict-hard
   ```

   Fix each soft surface mechanically (line-width, list-style,
   blanks-around-lists, etc.). Do NOT modify substance; only
   formatting / lint.

3. **Napkin rotation** (if criteria met): if active napkin has
   accumulated entries since last rotation per curator-pass
   convention, archive processed entries to dated archive shard;
   seed fresh active napkin. Skip if napkin is already at clean
   baseline.

4. **Pending-graduations buffer drain**: for each entry in
   `pending-graduations.md`:
   - If trigger condition has been met (per the entry's named
     promotion-trigger), route the candidate to its destination
     permanent home (PDR / rule / pattern / memory) per the
     candidate's graduation-target.
   - If trigger not met, leave in buffer.
   - Record drain count + destinations in cycle evidence.

5. **Post-cycle fitness verification**:

   ```bash
   pnpm practice:fitness:strict-hard 2>&1 | tail -10
   ```

   Record post-drain SOFT count; delta from baseline is the cycle's
   primary evidence.

**Acceptance criteria**:

1. Soft-surface SOFT count materially reduced — target < 5; absolute
   zero not required because plan execution itself accrues new soft
   surfaces.
2. Pending-graduations buffer drained of all met-trigger candidates;
   each candidate's destination commit/edit captured in cycle
   evidence record.
3. Napkin rotation evaluated; either rotated (with archive shard
   created) OR documented at cycle-open as not warranting rotation.
4. `pnpm check` passes.
5. `pnpm practice:fitness:strict-hard` exit 0 (SOFT only; no HARD or
   CRITICAL surfaces).

**Deterministic validation**:

```bash
# Post-drain fitness state
pnpm practice:fitness:strict-hard 2>&1 | tail -10
# Soft count target (extracted from above output)
pnpm markdownlint-check:root
# Pending-graduations drain evidence (manual line-count check;
# acceptable if substantively reduced)
wc -l .agent/memory/operational/pending-graduations.md
# Active napkin state
test -f .agent/memory/active/napkin.md
# Standard tree-green
pnpm check
```

Expected: exit 0 on all; SOFT count < 5; pending-graduations.md
reduced or substantively unchanged with reasoning.

**Reviewer dispatch**: docs-adr-expert (graduation destinations
correct for routed candidates); onboarding-expert (napkin rotation
impact on agent resume protocols); assumptions-expert (cycle scope
honestly selected as "most impactful within reasonable effort" —
not over-reach, not under-scope).

**Marshal-cycle**: standard. Curator-pass conventions may warrant
2-3 commits if napkin rotation + pending-graduations drain
substantively land separately. Default: bundle into one commit if
substance fits; split if marshal hygiene calls for separation.

## Blocked Protocol

If any validation command fails or produces unexpected output during
cycle execution:

1. **Stop** — do not proceed to the next cycle.
2. **Document** the failure: cycle id, command, actual output,
   expected output.
3. **Surface** the failure to owner via directed comms event before
   continuing.
4. **Do not guess** a workaround — ask for clarification.

Applies equally to AI agents and human implementers.

## Evidence and Claims

> See [Evidence and Claims component](../../templates/components/evidence-and-claims.md)

- Each cycle's deterministic-validation output is its evidence record.
  Capture in a per-cycle line in
  `.agent/plans/agentic-engineering-enhancements/evidence/post-m1-attestation-tidy-up.evidence.md`
  (created on cycle 1; appended per cycle).
- Cycle 5 (PDR-077) carries additional evidence: the absorbed R3
  items + Director-verdict item are itemised in the PDR §Absorption
  Trail subsection.
- Cycle 10 (WS2 storage redesign) carries cross-platform evidence:
  test run on Linux + macOS (or equivalent OS coverage).

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- `principles.md`: code quality (no broken commits leaving the tree);
  replace-don't-bridge (cycle 11 removes the legacy seen-state shape
  entirely); knowledge preservation (cycles 1–2 move /tmp substrate
  to durable handoff records).
- `testing-strategy.md`: TDD cycles where TDD applies (cycles 9 + 10);
  atomic-landing invariant (one commit per cycle including tests +
  product code); tests describe system states not implementation
  choices (cycle 14 tests this principle by deleting tests that
  violate it).
- `schema-first-execution.md`: cycle 10 schema migration with
  format-detection on read (legacy UUID-list → new mtime-watermark);
  cycle 7 may amend `comms-event.schema.json` if event_type enum
  needs `heartbeat` value.

## Readiness Reviewers

Before this plan is marked READY FOR EXECUTION (i.e., before cycle 1
opens its claim), invoke the following specialist reviewers in
parallel:

| Reviewer | Substance reviewed |
|----------|--------------------|
| `assumptions-expert` | Plan-readiness, proportionality, sequencing assumption (linear-vs-parallel trade-off), prerequisite classification accuracy, M1-vs-EEF priority interaction |
| `docs-adr-expert` | Doctrine landings (PDR-076a/b, PDR-077, PDR-078, ADR-186) cross-reference integrity, SKILL-vs-PDR boundary in cycle 8, ADR-117 plan-template compliance |
| `code-expert` | Cycles 9–14 code-work cycles, TDD-pair shape, extraction shape (cycle 13), cleanup shape (cycle 11) |
| `type-expert` | Cycles 9–10 state-schema typing, cycle 13 helper signature, any generic widening |
| `test-expert` | TDD-pair atomic landing in cycles 9–10, audit-shape verification gating in cycle 14, no-regression discipline in cycles 12–14 |
| `architecture-expert-betty` | Systems-thinking on cycle ordering (linear-vs-natural-shape), bundle coupling in WS-11 cycles 6–8, change-cost trade-off across the 14-cycle sequence |
| `architecture-expert-wilma` | Failure-mode review on cycle 10 storage migration (partial-state drain window, cross-platform cache-dir edge cases, concurrent-watcher hazards), cycle 11 cleanup risks |
| `onboarding-expert` | SKILL §0 + §0.5 resume-protocol changes in cycles 8 + 11 remain discoverable + first-success-friendly for new agents |

Reviewer findings absorb into a `R1` refinement entry on this plan
before the first cycle executes. Findings during cycle execution
absorb into per-cycle reviewer-absorption notes appended to the cycle
description.

## Lifecycle Triggers

Per [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):

- **Session-open**: any agent picking up this plan reads §End Goal +
  §Atomic Cycles + the in-progress cycle's full body.
- **Cycle-open**: implementing agent opens claim on the cycle's
  file scope; reads cycle body in full; runs cycle Preflight; runs
  cycle prerequisite check; opens TDD pair (where applicable);
  drives to deterministic validation; closes claim at marshal-cycle
  completion.
- **Cycle-close**: marshal-cycle lands one commit covering the cycle;
  evidence record appended; cycle frontmatter status flipped
  `pending` → `completed`.
- **Plan-close**: when cycle 14 completes, primary plan
  `practice-infrastructure-hardening-program.plan.md` receives an R3
  refinement marking M2 Completion Criteria 2 + 4 as MET; this plan
  archives to `archive/completed/`.
- **Archive**: per plan-archive-lifetime declaration in primary plan
  Lifecycle Triggers; this plan's per-cycle evidence records remain
  in `evidence/` as audit trail; the doctrine landed across cycles
  3–8 lives in the PDR/ADR files (not in this plan body).

## Consolidation

After cycle 14 completes and all gates pass, run
`/oak-consolidate-docs` to graduate settled content, extract reusable
patterns, rotate napkin, manage fitness, update the practice exchange.

## Done When

1. All 17 cycles status `completed` (1, 2, 3, 4, 5, 5a, 6, 7, 8, 8a,
   9, 10, 11, 12, 13, 14, 15).
2. Deterministic-validation output captured per cycle in evidence
   record.
3. M2 Completion Criteria 2 + 3 + 4 flipped MET via primary plan R3
   refinement; WS-8 + WS-12 closed in primary plan §Workstream
   Roll-up.
4. `.agent/state/collaboration/comms-seen/` removed from repo
   (cycle 11 acceptance).
5. `/tmp` substrate captured (cycles 1–2 acceptance) — no remaining
   `/tmp` content this plan depends on.
6. Sonar quality gate remains GREEN (Gate 1 of primary plan
   unaffected).
7. Tree green at every commit boundary (no broken intermediate state).
8. Consolidation has been run.
