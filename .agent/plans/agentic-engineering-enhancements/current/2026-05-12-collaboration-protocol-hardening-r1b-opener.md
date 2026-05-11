---
plan_id: collaboration-protocol-hardening-tail
status: current
landed_commits:
  - sha: f7560339
    label: R1.a canonical schema + Ajv test baseline
  - sha: b529fa6e
    label: R1.b three parsers + three types + 7 file moves + consumer updates + 16 tests
  - sha: 5aa91a76
    label: Third-instance peer-commit absorption record
  - sha: 8f0dacd5
    label: Pattern graduations + tail-plan reshape; completed T-R8
  - sha: e298723c
    label: T-CQ-UX F-11 commit-queue list/show inspection slice
todos:
  - id: T-R8
    wave: 1
    content: Pattern capture for claim-overlap-revert-and-handoff (and the new peer-commit-absorption direction) in `.agent/memory/active/patterns/`
    status: completed
    depends_on: []
  - id: T-R4b
    wave: 1
    content: Commit-skill SKILL-CANONICAL.md amendment mandating explicit pathspec staging + queue-lifecycle invocation
    status: pending
    depends_on: []
  - id: T-R7
    wave: 1
    content: Author B-9 follow-on plan stub in `.agent/plans/agent-tooling/current/`
    status: pending
    depends_on: []
  - id: T-R2
    wave: 1
    content: B-10 `comms send` shell-mangling investigation — caller-vs-CLI responsibility on long bodies (proven live this session by orphan event c09300be)
    status: pending
    depends_on: []
  - id: T-R3
    wave: 2
    content: Identity caching for wordlist drift — cache derived (agent_name, session_id_prefix) in `PRACTICE_AGENT_NAME_CLAUDE` env var; invalidate on prefix mismatch
    status: pending
    depends_on: []
  - id: T-CQ-UX
    wave: 3
    content: Commit-queue UX hardening — discoverability (surface in `collaboration-state --help`, in commit-skill canonical); ease-of-use (collapse 6-command lifecycle to fewer ergonomic invocations); clearer `verify-staged` error messages (distinguish queue-ordering signal from staged-set divergence); make harder-to-bypass (husky pre-commit calls verify-staged; refuse commit absent queue evidence). Partial landing: F-11 list/show inspection slice at `e298723c`.
    status: pending
    depends_on: []
  - id: T-R4-new
    wave: 3
    content: Native git pre-commit hook implementing PDR-059 host classification gate — Class A producer manifest, classification logic at post-hook-pre-commit window, structured Class C abort
    status: pending
    depends_on: []
  - id: T-R5.0
    wave: 4
    content: Retire `evaluateSharedCommsLog` evaluator at live-json.ts — generated read-model drift check against committed log
    status: pending
    depends_on: []
  - id: T-R5.1
    wave: 4
    content: Round-trip 299 narrative markdown entries to JSON with golden-output test
    status: pending
    depends_on: [T-R5.0]
  - id: T-R5.2
    wave: 4
    content: Reconcile 6 B-01-damaged markdown-only events via the post-R1.b fixed `comms append`
    status: pending
    depends_on: [T-R5.1]
  - id: T-R5.3
    wave: 4
    content: `git rm shared-comms-log.md` + sweep references across `.agent/`, `docs/`, and source code
    status: pending
    depends_on: [T-R5.2]
  - id: T-R5.4
    wave: 4
    content: Single atomic `agent-collaboration.md` doc-sweep recording the Path β migration outcome
    status: pending
    depends_on: [T-R5.3]
  - id: T-Phase4
    wave: 5
    content: Four-probe adversarial validation matrix — dispatch `architecture-expert-wilma` across file-scope-overlap, commit-discipline-violation, injected-red-gate, session-end-mid-flight probes
    status: pending
    depends_on: [T-CQ-UX, T-R4-new, T-R5.4]
  - id: T-Phase5
    wave: 6
    content: Arc closure — graduate the three pending entries, refresh thread record, full `/jc-consolidate-docs` pass, announce arc closure in shared-comms-log + thread record
    status: pending
    depends_on: [T-Phase4]
---

# Collaboration Protocol Hardening — Tail Plan (post-R1.b)

**Thread**: `agentic-engineering-enhancements`.
**Branch**: `feat/mcp-graph-support-foundation`.
**Status**: R1.a + R1.b landed. Remaining work is the sequenced tail
(Waves 1–6 below).

## Closed re-decisions (do not re-open)

- **Three families, not two.** Fingerprint scan confirmed narrative
  312 / lifecycle 5 / directed 2 at R1.a. Two-family diagnosis is dead.
- **Shape A′ — single canonical schema, three sibling directories.**
  Protocol SoT = `comms-event.schema.json`; application SoT = directory
  layout (projection of `$defs`). Owner-articulated criterion:
  *"single source of truth for the protocol, not the same as only
  having a single application for that protocol."*
- **R1.b landed `b529fa6e`** (2026-05-11, Soaring Darting Kite / `01db95`):
  three readonly TypeScript interfaces replace flat `CommsEvent`;
  three single-schema parsers replace `parseCommsEvent`; 7 event files
  migrated to the two new sibling directories with `timestamp → created_at`
  rename on the directed pair; 16 new parser/render tests across two
  new test files; all four reviewer reports actioned in-scope
  (`code-expert` APPROVED WITH SUGGESTIONS, `test-expert` IMPROVEMENTS
  RECOMMENDED, `type-expert` SAFE, `docs-adr-expert` COMPLIANT).
  No data loss; no foreign-stage absorption into the R1.b commit
  itself.

## Tail waves

The waves below are dependency-ordered. Within a wave, items are
parallel-safe (no overlapping file scope, no mid-work coordination
needed). Across waves, the listed `depends_on` must be respected.
Plan does not invent serial dependencies the work shape does not
require.

### Wave 1 — small, independent, parallel-safe

Each is a single atomic commit through the commit-queue lifecycle.
None depend on each other.

- **T-R8 — Pattern capture.** Append entries to
  `.agent/memory/active/patterns/` for:
  - claim-overlap-revert-and-handoff (proven live this session with
    Fronded Flowering Seed; sidebar `2e1a886f` → reply `544bf9bf`
    in 10 minutes, claim narrowed without owner mediation);
  - peer-commit-absorption (third-instance evidence at `e0a17465`;
    Mistbound `67885e3f` absorbed six of this session's files via
    non-pathspec staging). This is structurally new beyond the two
    failure modes PDR-054 and PDR-059 already name.
- **T-R4b — Commit-skill amendment.** Amend
  `.agent/skills/commit/SKILL-CANONICAL.md` to mandate explicit
  pathspec staging and explicit commit-queue lifecycle invocation
  (enqueue → staging → record-staged → verify-staged → commit →
  complete). Doc-only.
- **T-R7 — B-9 follow-on plan stub.** Author a stub at
  `.agent/plans/agent-tooling/current/` naming the
  fitness-gate-staged-set-awareness design questions. No fix this
  session.
- **T-R2 — B-10 investigation.** Investigate the
  `pnpm agent-tools:collaboration-state -- comms send` failure on
  long body strings (this session's orphan event `c09300be` is the
  third observed instance). Caller responsibility vs CLI bug. If
  CLI bug: test-first failure + product fix. If caller responsibility:
  document in CLI help.

### Wave 2 — tactical, smaller

- **T-R3 — Identity caching.** Cache derived
  `(agent_name, session_id_prefix)` pair in
  `PRACTICE_AGENT_NAME_CLAUDE` env var; invalidate on prefix
  mismatch. Test-first in `agent-tools/src/agent-identity/`.

### Wave 3 — structural cures (UX + enforcement)

These are complementary, not sequential. T-CQ-UX makes the
commit-queue discoverable and easier to use; T-R4-new closes the
bypass surface at the hook boundary. Either order works; landing
T-CQ-UX first makes T-R4-new's host implementation easier to test
against; landing T-R4-new first makes T-CQ-UX's harder-to-bypass
requirement a structural property rather than a doc claim. The
working evidence is the third-instance peer-commit absorption at
`e0a17465`.

- **T-CQ-UX — Commit-queue UX hardening.** Sharpened by this
  session's friction surface:
  - **Read-side inspection landed**: `e298723c` added
    `commit-queue list` filters (`--prefix`, `--phase`,
    `--agent-name`, `--queue-status`) and `commit-queue show
    --intent-id`, plus strict `--now` validation. This closes the
    F-11 read-inspection slice only; the rest of T-CQ-UX remains open.
  - **Discoverability**: surface `commit-queue` in
    `collaboration-state --help`, in the commit-skill canonical,
    and in the bootstrap fast-path guidance. The CLI on a separate
    binary is invisible today.
  - **Ease-of-use**: collapse the 6-command lifecycle (enqueue →
    phase → record-staged → verify-staged → commit → complete) to
    fewer ergonomic invocations. Investigate whether `enqueue +
    stage` and `verify + commit + complete` can be single commands.
  - **Error message clarity**: `verify-staged` currently conflates
    "queue order ahead" with "staged-set divergence". Same exit
    code, single-line error. Distinguish: ordering signal is
    advisory (proceed when peer clears or on owner authorisation);
    divergence is hard refusal.
  - **Harder-to-bypass**: the husky `pre-commit` hook does not
    call `verify-staged`. Wire it. Refuse commits without queue
    evidence unless the operator explicitly authorises bypass
    (with an audit-trail comms-event). Combines with T-R4-new
    structurally.
  - **Claim-close-cycle recursion**: a `claims close` mutates
    `active-claims.json` and `closed-claims.archive.json`, which
    requires another commit cycle to capture. Either batch the
    closure with the parent commit or define a closure path that
    does not require a follow-up.
- **T-R4-new — Native git pre-commit hook (PDR-059 host
  implementation).** Author `.husky/pre-commit` (or
  `.git/hooks/pre-commit` per husky audit) implementing the
  three-class classification gate from PDR-059. Class A producer
  manifest at `.agent/hooks/regenerator-output-manifest.json`;
  classification logic at the post-hook-pre-commit window;
  structured Class C abort with named absorbed files. Reviewer:
  `architecture-expert-wilma` adversarial on bypass surfaces.

### Wave 4 — Path β migration (the shared-comms-log retirement)

R5.0 must land first; R5.1 → R5.4 are strict-serial.

- **T-R5.0 — Retire `evaluateSharedCommsLog` evaluator** at
  `live-json.ts:102-117`. The generated read-model drift check was
  R1.a-era; with the three-directory walk now in place via
  `readCommsEventFiles`, the markdown evaluator is no longer the
  primary check.
- **T-R5.1 — Round-trip narrative markdown to JSON.** Convert the
  299 narrative markdown entries to JSON via a parser; golden-output
  test asserts round-trip stability.
- **T-R5.2 — Reconcile B-01-damaged markdown-only events** via the
  post-R1.b fixed `comms append` path.
- **T-R5.3 — `git rm shared-comms-log.md`** and sweep references
  across `.agent/`, `docs/`, and source.
- **T-R5.4 — `agent-collaboration.md` doc-sweep** recording the
  Path β migration outcome. Atomic doc commit.

### Wave 5 — adversarial validation

- **T-Phase4 — Four-probe validation matrix.** Dispatch
  `architecture-expert-wilma` adversarially across:
  - file-scope-overlap (was the R1.b claim scope correctly bounded?);
  - commit-discipline-violation (does T-R4-new actually refuse
    Class C absorption?);
  - injected-red-gate (does the commit-queue refuse staged-set
    divergence under load?);
  - session-end-mid-flight (does the claim-closure path survive
    interruption without dangling state?).
  Depends on Wave 3 structural cures landed.

### Wave 6 — arc closure

- **T-Phase5 — Arc closure.** Graduate the three pending entries
  (pre-flight-fingerprint-scan; schema-as-protocol-authority-with-
  directory-projection; R4-new native pre-commit hook); mark
  sibling plans; refresh thread next-session record; full
  `/jc-consolidate-docs` pass; announce arc closure in
  `shared-comms-log.md` + thread record. After this announcement,
  future collaboration-protocol friction routes via the standard
  friction register, not a new opener.

## Discipline carried forward

- **Architectural excellence over expediency** — no cheap-cure
  shape ever surfaced; only architecturally-excellent options.
- **Test-first; atomic test+product commits** per `tdd-as-design.md`.
- **Stage by explicit pathspec; commit by explicit pathspec.** This
  session's peer-commit-absorption incident reaffirms the rule from
  the peer-write side.
- **Commit-queue lifecycle for every commit** (per the queue-UX
  work in Wave 3 — discoverability is improving, the discipline is
  not new). The R1.b atomic commit `b529fa6e` is this session's
  named miss; honest in the record, not repeated.
- **Manual post-hook eyeball** per PDR-059 + ADR-177 amendment
  until T-R4-new lands.
- **No `--no-verify`** without fresh per-commit owner authorisation.
- **No speed pressure** — waves can span multiple sessions; do not
  cram across wave boundaries.
- **Inter-agent coordination via comms-events** — proven this
  session with Fronded; failure-mode-named with Mistbound. Sidebar
  protocol works between two known agents; does not prevent a third
  agent's non-pathspec staging — that is what Wave 3 is for.

## Cross-references

- `.agent/state/collaboration/comms-event.schema.json` — canonical
  protocol authority (R1.a `f7560339`).
- `agent-tools/tests/collaboration-state/comms-event-schema.unit.test.ts`
  — R1.a Ajv baseline.
- `agent-tools/tests/collaboration-state/state-parsers.unit.test.ts`
  - `comms-render.unit.test.ts` — R1.b TypeScript-layer baseline.
- `.agent/practice-core/decision-records/PDR-059-regenerator-output-classification.md`
  — post-hook classification doctrine.
- `docs/architecture/architectural-decisions/177-asymmetric-cure-enforcement-in-staging.md`
  — host-repo amendment for PDR-059 (deferred implementation; this
  plan's Wave 3 is that implementation).
- `.agent/state/collaboration/comms-events/e0a17465-fd5a-4c7d-979d-89696247de0a.json`
  — third-instance peer-commit-absorption record (working evidence
  for Wave 3).
- `.agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md`
  — B-01 closed at `b529fa6e`; B-9 + B-10 remain.

## Lifecycle triggers

This plan covers multi-session work. Each wave's first session opens
via `start-right-thorough`; each session closes via `session-handoff`
with consolidation discipline. The commit-queue lifecycle is
mandatory for every commit produced under this plan (per Wave 3
which sharpens it).

## Learning loop

Each wave closes with a `/jc-consolidate-docs` pass that mines
hardened patterns into permanent homes (PDRs, ADRs, governance
docs) and prunes ephemeral surfaces.
