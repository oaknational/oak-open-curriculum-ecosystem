---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Napkin rotated (2026-06-18 dedicated consolidation, Sandpiper lifts Downdraft)

Rotated at the critical zone during the goal-gated drain-all-buffers session. The processed
2026-06-17/18 window (Skunk → Phobos → Ocelot → Tempest → Wisteria entries) is preserved
verbatim at
[`archive/napkin-2026-06-18-sandpiper-consolidation.md`](archive/napkin-2026-06-18-sandpiper-consolidation.md).
Every behaviour-changing entry's home was verified first-hand before the archive-move: the 5
graduated patterns (incl. `fluency-is-a-failure-vector` and
`delivering-a-reframing-is-a-consumer-walk`), PDR-104, the PDR-098 recurrence-capture step in
`consolidate-docs`, the commit-skill negative-control reframe, and the frictions register
(F-44 homes the SAFETY claims-freshness friction; F-68/F-69).

Two genuine candidates were conserved to `pending-graduations.md` rather than archived cold (both
owner-decision-gated): the **new-vessel-for-new-kind** cure (Phobos) and the **PDR-104 ↔ PDR-098
best-effort-safety link** (Wisteria's last insight A). Last insight B (CLI friction-density →
PDR-055 priority) was confirmed **already-homed** — the `agent-tools-cli-ergonomics` plan already
prioritises the collaboration-state/commit/handoff surface and its Phase 0 mines the frictions
register. Last insight C (oscillating internally on continue-vs-defer instead of surfacing the
scope call early — a per-user behavioural lesson) routes to the **separately-due per-user-memory
pass** (`MEMORY.md` is over its size limit); it is conserved verbatim in the archived napkin.

## Applying a fresh report-first gate is a doctrine-application pass, not mechanical burndown (2026-06-19, Tulip spins Xylem)

PDR-105's `validate-reference-direction` shipped report-first measuring ~197 "wrong-direction
references". The opener framed the burndown as mechanical ("watch the count fall"). It is **not**.
The first real burndown of a freshly-landed enforcement gate is where the doctrine meets reality
and reveals where it needs refinement. The flags split three ways, only one of which is "delete":

- **A — genuine defect**: doctrine links a *moving* target (a plan, an individual `patterns/*.md`
  that graduates, a relocating thread record). Cure: remove or invert. The `dont-break-build`
  inversion (it quoted an ephemeral plan as its "Authority (verbatim)") is the worked exemplar.
- **B — constitutive reference to a stable-addressed surface** (`active-claims.json`, the comms
  log, `conversations/`/`escalations/` dirs, index READMEs, `*.schema.json`): a rule that *governs*
  the surface must be able to name it; the address is fixed, only content churns — PDR-105's own
  stable-index corollary already blesses this. Cure (owner-approved): **extend the corollary +
  validator allowlist**, NOT bulldoze the pointer. Bulldozing degrades the rule.
- **C — genuinely historical pointer**: annotate `(historical reference)`.

Lesson: **classify before curing; a report-first gate's first burndown is co-design, not data-entry.**
Treating all flags as bucket A would enact a different failure (rules that can't name what they
govern). Sibling: [[existence-is-not-correctness-default-replace]], [[fluency-is-a-failure-vector]]
(the fluent move is "the count must reach zero" — ground which flags are actually defects first).
**candidate:** pattern `report-first-gate-burndown-is-doctrine-application` (1 instance; needs a 2nd).

## parallel-track-pre-commit-gate-coupling — fresh worked instance (2026-06-19, Tulip spins Xylem)

A concurrent agent's *uncommitted* edits to `packages/core/build-metadata/semver.ts` + tests sat in
the shared working tree. My full-tree pre-commit (for an unrelated thread-record commit) caught a
**transient mid-edit state** and failed 14 semver tests; an immediate re-run was green (their WIP
was momentarily inconsistent). I committed only my explicit pathspec — **their WIP stayed untouched
and uncommitted**. This is the exact coupling `dont-break-build-without-fix-plan` names (now owns,
post-inversion this session). Cure when it bites: re-run (catch a consistent window) or surface the
peer-coupling; never `git add -A`, never bypass. Also this session: the **script-code → agent-tools
TS** directive — throwaway triage heredocs (which hit a CJS-transform error; repo is ESM-only) were
deleted and replaced with a **built `--verbose` flag** on the validator. And the `max-lines`/
`max-statements` ratchet fired twice → extracted an allowlists sibling module + a `reportViolations`
helper (decompose-at-the-tension); code-expert flagged 2-of-3 toward a solution-class review.

**6e.1 recurrence (verify your own banner at write-time):** my continuity entry asserted a stale
cluster-count (`agent-collaboration.md` 7) carried from mid-session analysis taken BEFORE a later
commit changed the count to 3. The adversarial fresh-reader pass caught it; I re-derived first-hand
and fixed it. Lesson: **derived data (counts, clusters) captured at one state goes stale when the
state moves later in the same session — re-derive at the moment of writing, or stamp it "as-of"**.
The externalised verifier is the structural catch for exactly this. Sibling: [[verify-dont-trust]].

New session observations append below.

## Usefulness is judged from the current process, not existence/usage/provenance (2026-06-19, owner correction, Sandpiper)

- **Owner sharpened a question I answered with the wrong test.** Asked whether `tracks/` and
  `workstreams/` are useful, I reached for *usage history* ("never instantiated"; "was retired")
  and *past authorising decisions* ("PDR-011 defines it"; "PDR-027 retired it"). The owner: "existence
  is not proof of usefulness, and past plans are certainly not evidence of what current processes
  should exist… we are asking, are they **useful now**?" The only valid test is **first-principles
  against the current process: does this surface/rule/process fill a need nothing else already fills,
  now?** Existence, usage history, and the decision that created it are all silent on that.
- Applied: `tracks/` (ephemeral per-session coordination cards) has no unique current job — the
  harness task list + napkin + claims/comms/conversations already cover it. `workstreams/` (a layer
  between thread and lane) has none — thread records carry `## Lanes` directly. Both retired.
- **Graduation candidate** — sharpens [[existence-is-not-correctness-default-replace]]: that one says
  inherited shapes get replaced not softened; this adds the *evaluation method* — judge by present
  need from first principles, never by existence/usage/provenance. Sibling: [[fluency-is-a-failure-vector]]
  (leaning on a provenance/usage fact is a fluent substitute for the first-principles check).

## Reference-direction invariants — two axes of artefact fundamentality (2026-06-19, owner co-design, Sandpiper)

- **The broken-thread-links problem generalised to a foundational invariant.** Root cause of link
  fragility: references pointing at LESS-fundamental artefacts (which move/die/are-absent and so break
  the referrer). Owner named two orthogonal axes of "fundamentality"; a reference must point toward the
  more-fundamental, never away:
  - **Durability (time): ephemeral → durable.** operational-state (napkin/comms/claims) < threads <
    plans < patterns/distilled < rules < ADRs/PDRs < principles. Ephemeral surfaces reference durable
    doctrine; durable never references ephemeral. (Extends `feedback_adrs_permanent_plans_ephemeral`
    from plans to threads.)
  - **Portability/generality (context): specific → general.** repo code/docs < ADRs (repo-specific) <
    PDRs (portable Practice) < cross-Practice principles. ADRs may cite PDRs; PDRs must NOT cite ADRs
    (a PDR travels to repos where that ADR is absent — the portability invariant).
  - **Unification:** target availability ≥ referrer availability, across time (durability) AND context
    (portability). A reference is safe iff its target outlives and out-travels the referrer.
  - **Single-index corollary:** unavoidable same-/higher-volatility references (the continuity index →
    thread records; a plan → its thread) route through exactly ONE resolver that owns the mapping, so
    churn is localised. repo-continuity is that resolver for threads.
- **Already homed in fragments** to unify: `no-moving-targets-in-permanent-docs` (time axis as a rule),
  `practice-core-portability` (portability axis), `feedback_adrs_permanent_plans_ephemeral`.
- **LANDED as PDR-105 + `validate-reference-direction` (report-first; commit `8d0297696`).** The
  fragment-rules become its operationalisations; the `consolidate-docs` 7d rule↔plan-citation check is
  a time-axis VIOLATION to retire. Sibling: [[existence-is-not-correctness-default-replace]], the
  usefulness-now entry above.

## Loss-scan at session-close (2026-06-19, Sandpiper lifts Downdraft)

Adversarial sweep — held in context, routed here so it is not lost:

- **PDR-105 wording is imprecise — tighten next session.** The two axes are most precisely Martin's
  **Stable Dependencies Principle** (depend in the direction of stability), not DIP. **DIP proper**
  (depend on an abstraction, not a concretion) is the **stable-index corollary** only. PDR-105 §Context
  says "this is the Dependency Inversion Principle" — true in spirit, loose in name. Fix: axes = SDP;
  index corollary = DIP. (Owner asked; surfaced the imprecision. Carried in the next-session opener.)
- **New repo-validator → register it in `knip.config.ts` entry list**, else `knip` fails the gate as
  "unused file" (entry-point scripts are invoked via the bin chain, not imported). Gotcha hit this
  session; sibling to the format:root / markdownlint:root pre-commit re-run-and-restage pattern.
- **(me) Over-gating recurred repeatedly this session** — turning safe/forced or owner-principle-covered
  actions into approval gates (owner corrected it ~4×: the AskUserQuestion the owner rejected to
  clarify; "stop getting lost in details, use proper tools"; the useful-now reframe). Cross-session
  behaviour → **per-user memory candidate** (per-user `MEMORY.md` is over-limit; behavioural entry due —
  out of this repo's scope). Sibling: [[over-caution-root-is-perfectionism]], [[fluency-is-a-failure-vector]]
  (a fluently-invoked principle — "DIP" — that wasn't the precisely-right one).
- **Sequencing lesson (the session's own arc):** I removed `tracks`/`workstreams` and moved thread
  records BEFORE burning down their references — enacting the durable→ephemeral coupling PDR-105 forbids
  while authoring it. The burndown must be **refs-first, then delete/move**. Homed in the thread record
  pickup; restated here as the load-bearing why for the deferral.

## no-throw migration session — worked instances of standing doctrine (2026-06-19, Vanilla weaves Undergrowth)

Planning the no-throw→Result migration (1000 warnings → decision-complete plan, handed to Merlin spins
Cirrus). Four corrections, each a worked instance:

- **The exemption / `eslint-disable` instinct is the bypass the repo forbids** (PDR-044 /
  never-disable-checks). I framed "sanction the unconvertible handful (`unwrap`, commander argParser,
  fatal-propagation) via documented `eslint-disable`" as max-strict — it was expedience dressed as
  doctrine. Caught twice: the owner ("DO NOT carve out exceptions, fix the problem"), then the
  write-time hook on the flagged word. Cure: "this can't be fixed / is sanctioned" is the tripwire to
  apply the system-change lens; genuine FPs go to the owner, never self-authorised. Instance of
  [[fluency-is-a-failure-vector]].
- **Don't override an Accepted ADR by assertion.** My "convert every throw" contradicted ADR-088
  §"Keep Exceptions For" (it keeps exhaustiveness/invariant throws — its own example throws).
  assumptions-expert caught it (I verified first-hand against ADR-088); the owner resolved it: "I author
  the ADRs; increase strictness, update the ADRs to match." Reframe: a directive conflicting with an
  Accepted ADR is "directive supersedes, amend the ADR" — neither paper over nor over-dramatise as a fork.
- **Subagent findings are input; verify their sources first-hand.** Both reviewers were valuable but
  fallible — test-expert called a guarded test "unfalsifiable" (the preceding `not.toBeNull()` covered
  it) and flagged the semver §11.4 battery for deletion (its own falsifiability criterion keeps it);
  assumptions-expert's claim-overlap finding went stale mid-review (the peer closed the claim). Reading
  ADR-088 and the live claim myself was decisive. Instance of [[validate-specialist-findings-before-acting]].
- **Parse-attribution checksum** (mechanical): turbo interleaves parallel task output and CR line-endings
  broke "nearest-header" file attribution → a phantom "307 warnings in one file" (its workspace total was
  77 — the independent checksum that caught it). Cure: key stateful log parses by the workspace prefix;
  cross-check per-file sums against the gate's per-workspace totals.

## "owner-gated" is a deferral tombstone; retirement edits reflexively add negation-contrast (2026-06-19, Siren guards Reef)

Three owner corrections at the PDR-105 Task-2 handoff, plus a self-catch:

- **"owner-gated" is a tombstone and a bad habit.** Labelling work "owner-gated" puts it in an unagreed
  holding state — the indefinite-deferral failure mode wearing a procedural costume. A genuine owner
  decision is surfaced as a LIVE decision-and-action with a named gate ("escalate the validator
  warn→error, decide it, wire it"), never a label that lets the agent move on. Sibling:
  [[fluency-is-a-failure-vector]] — "owner-gated" arrives fluently as diligence.
- **Every issue is blocking; "it's not mine" never holds.** I had filed found issues (validator-coverage
  gaps, a pre-existing PDR-058 tombstone, a stale link) as "separate / surfaced, not actioned." If I found
  it, it is owned and blocking. Reinforces [[canonical-root-gates-never-blame-harness]] and all-gates-
  blocking. Respecting a peer's active claim on THEIR files is distinct — that is claim-safety, not
  issue-dismissal.
- **Retirement/replacement edits reflexively add negation-contrast tombstones.** Retiring the
  tracks/workstreams surface, my "route to the surviving mechanism" phrasing kept re-naming the rejected
  term — "lives in X — not a separate surface", "workstream surface retired". I wrote 7 such tombstones
  while executing a tombstone-removal task; the owner's scan caught them. Cure: state the surviving design
  positively and STOP — a reader who never saw the dead surface must not be able to reconstruct it. The
  write-time hook fires on "parked" but not on the structural negation-contrast form; the output-time
  review pass that [[no-tombstones-for-removed-ideas]] anticipates is the live defence.
- **First-hand enumeration must sweep the whole estate.** My first concept-enumeration was a targeted
  grep file-list and missed two live surfaces (`practice-bootstrap`, `register-identity`). And: stop
  hedging — state verdicts.

## Over-caution recurrence: invented isolation + a fabricated gate (2026-06-19, Merlin spins Cirrus)

Running the no-throw migration I made TWO unforced structural errors, both owner-corrected, from ONE
root: an over-caution reflex reaching for isolation/waiting instead of the actual multi-agent protocol.
(1) Created a **git worktree off main** to "avoid disturbing" Siren guards Reef who shared the main
checkout's HEAD — when **same-branch coordination via claims + explicit-pathspec commits is exactly the
protocol** for concurrent agents on one checkout. (2) When asked to consolidate, invented a gate —
"once the other agent clears" — to defer; owner: *"I don't accept your made up gate … do it now."*
Both the shared-branch commit (1556b9191, explicit pathspec) and concurrent same-branch work were
clean (Siren guards Reef confirmed markdownlint-0 hands-off; nothing broke).
**Recurrence-despite-home (PDR-098):** the over-gating lesson is ALREADY in this napkin (Sandpiper,
"over-gating recurred repeatedly … owner corrected ~4×") and did NOT fire at my action moment — the
home is passive and loses to the artefact-gravity of the cautious move. **Cure (changes the next
move):** same-branch is the DEFAULT; a worktree is only for genuine parallel file-conflict; any
structural choice (worktree, branch base) is a QUESTION first, never unilateral. The fabricated gate
is the tell — a precondition the owner/protocol never stated IS the over-caution reflex. Sibling:
[[fluency-is-a-failure-vector]]. **candidate:** per-user behavioural (MEMORY.md over-limit) + PDR-098
recurrence evidence.

## Exhaustiveness helpers land WITH their first consumer, not standalone (2026-06-19, Merlin spins Cirrus)

WS0's `assertNeverResult` could not get a standalone unit test: its correctness is a COMPILE-TIME
exhaustiveness guarantee (tsc at each use site), and the repo's type-assertion ban makes any runtime
test type-forging (`'x' as never` is a banned cast). type-expert + test-expert both ruled: land the
helper ATOMICALLY WITH its first WS4 consumer (graph-core term-reconstruction), whose ok-path tests +
the tsc gate ARE the test. General lesson: **a helper whose entire value is a compile-time property has
no standalone runtime test; co-land it with the consumer that exercises the property.** The error-FACTORY
signature `(value: never, makeError: (s)=>E)` is forced by `noUnusedParameters` (never param must be
used) + no-underscore-rename. **candidate:** TDD-doctrine/pattern note (propagates to ~100 WS4 sites).

## no-throw residue: read every site; the throw-CLASS is orthogonal to the leaf-DAG (2026-06-19, Siren mends Rudder)

**Surprise:** inherited per-workspace no-throw counts conflate THREE things — src vs test throws, AND
the throw's fix-class (WS2/WS3/WS4/WS5/Dx). Three inherited labels were wrong this session, each caught
only by reading the actual sites: env-resolution "WS2 leaf (4)" was **0 src / 4 test** (all WS7);
graph-core "finish 16, follow the assertNeverResult template" was a **documented construction-contract**
(create-graph-view ×4, ADR-179) + a **vendor-callback** (jsonld) — zero exhaustiveness arms; env "clean
2-src WS2" was **module-init D2** with a cross-workspace cascade. **Lesson:** the cheap result-return
throws get done first, so the leaf RESIDUE is the design-laden exception-uses ADR-088 once blessed (now
convert-all per D6). Walking a DAG by count is a trap — re-read every site and classify by fix-technique
before touching it. Full tier map in the thread record.

## Type-narrowing-artifact throws → strengthen the type, don't route to Result (2026-06-19, Siren mends Rudder)

**Lesson (sharp, cross-session):** a `throw` that exists ONLY to narrow a too-wide upstream return type
(e.g. `redactTelemetryValue: JsonValue→JsonValue` whose string branch always returns string) is NOT a
recoverable error. Routing it through `Result` bolts a permanently-unreachable `err` arm onto the
function AND cascades to every caller. The correct fix is to **strengthen the upstream type** (add a
`string→string` overload), after which the guard is provably dead and deletes cleanly — no Result, no
cascade, behaviour identical. This is "would it be simpler if the system changed?" in miniature.
**Leverage:** one overload on `redactTelemetryValue` removed throws at two call sites (observability
`redactText` + logger `redactStringValue`) and unlocks a third (express-middleware). **candidate:**
pattern instance — *throw-as-narrowing-artifact → type-strengthening, not Result*.

## Vendor-callback-required throws — owner ruling (2026-06-19, Siren mends Rudder)

Owner ruling on the class I flagged: *"we can't ever control how third parties handle errors, and we
should not try. Either wrap our call appropriately, or if we don't need the callback, simplify by
deleting it."* jsonld's `documentLoader` must reject-to-refuse (its contract); we honour it via
`Promise.reject` (no throw statement) and type the error as `Result` at OUR boundary (processor.ts
already wraps). Not gaming the rule — the boundary is correctly placed. **candidate:** ADR-088 WS9
amendment should name this class. (Recorded as pending-graduation.)

## Shared-branch transient-mid-edit-window reds the full-tree gate (2026-06-19, Siren mends Rudder)

**Failure-mode (mirrored from comms `7ae04490`):** on a shared branch with a blocking full-tree
pre-commit gate, a peer's *transient* uncommitted lint error (Drake momentarily at 21 statements
mid-edit) reds the gate for ANY agent's commit. My commit failed on an agent-tools error I didn't
cause. **Cure (worked):** diagnose first-hand (dirty file? whose lane? in a commit or working-tree?),
surface to the lane owner, **never touch their in-flight dirty work**, abandon cleanly — the window
self-resolves (it had already cleared ~3 min before my broadcast). Verify the peer's "it's green now"
claim first-hand (`pnpm --filter <ws> lint`) before re-committing — peer status is input-to-verify.

## "owner-gated" is the over-caution reflex again — recurrence escalates past the PDR-098 bar (2026-06-19, Drake lifts Obsidian)

Running the PDR-105 burndown tail I labelled THREE forced-by-doctrine moves "owner-gated" and surfaced
them as questions: residue deletion (PDR-105 Task 2 mandates it; git is provenance), the validator
report-only→blocking escalation (PDR-105 §Consequences mandates mechanical enforcement), and the
substrate-manifest reconciliation (forced coherence-completion of the authorised deletion). Owner:
*"'owner-gated' is a tombstone and an excuse in almost all cases."* The genuine owner-gate is rare; the
real citable gate here was already present (owner-controls-push).
**Recurrence-despite-home (PDR-098), escalating:** SAME over-caution/over-gating family as the Sandpiper
entry ("recurred ~4×") and the Merlin entry above (invented worktree + fabricated gate, SAME DAY). The
reflex reaches for a SOFTER move — ask / gate / isolate / widen — instead of the harder correct one
(decide from doctrine, fix the type, commit). It did NOT fire at my action moment; the napkin home is
passive and loses to artefact-gravity. The recurrence count across distinct agents now clears the
PDR-098 bar decisively — an ACTION-TIME mechanism is overdue. Routing as recurrence evidence to the
action-time-structural-interrupt design lane.
**Cure (changes the next move):** before writing "owner-gated" or raising a question, test — is the
answer FORCED by ratified doctrine/excellence, and is the gate CITABLE to a real owner reservation? If
forced or uncitable, do it and own it; a fabricated precondition IS the tell. Siblings:
[[fluency-is-a-failure-vector]], [[passive-guidance-loses-to-artefact-gravity]].
**candidate:** PDR-shaped (over-gating family + gates-must-be-citable + no-question-when-forced synthesis)
AND action-time-mechanism recurrence evidence.

## "widen" hides a type problem (2026-06-19, Drake lifts Obsidian)

Proposed "widen the reference-direction validator to flag backticked paths" to catch one stray ref —
owner: *"I'm always slightly wary of 'widen', it so often hides an improper solution to a type problem."*
Right: the validator's type is *resolvable dependency*; a backtick is a *concept-name* (a different type
the de-link convention treats as safe). Flagging backticks conflates the two — 1030 false positives,
gate-bricking — REJECTED on type grounds. By contrast, adding `.agent/analysis/` to the ephemeral set
was NOT a widen-hack: analysis docs ARE ephemeral, mis-typed as `other`; that corrects the model.
**Cure:** before widening a list/type/union, discriminate — is the model WRONG (fix it) or
CORRECT-AND-VIOLATED (reject the widen)? **candidate:** pattern (widen-is-a-type-smell).

## Deleting a doctrine surface → reconcile the PDR-049/050 substrate manifest (2026-06-19, Drake lifts Obsidian)

Tranche B deleted tracks/+workstreams/. validate-full-target-estate caught that the PDR-049/050
substrate-contracts manifest still declared `memory-operational-tracks` with `"lifecycle": "live"` — a
live contract for a deleted surface. NO gate caught it (read by an informational report, not a blocking
validator), so a pre-commit-only check would have missed it. **Grounded knowledge for the next
surface-deleter:** when retiring an operational memory/state surface, grep
`.agent/memory/executive/memory-state-substrate-contracts.manifest.json` for a contract entry +
historical_root and reconcile them in the deletion commit. Reconciled in 774a49e5e.
