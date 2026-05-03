---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The previous active napkin was archived during the 2026-05-03
deep-consolidation pass at
[`archive/napkin-2026-05-03.md`](archive/napkin-2026-05-03.md). It
carries the full record of the 2026-04-30 → 2026-05-03 session arc
(EEF graph-and-corpus architecture, pin-to-Maintainer-Latest saga,
post-mortem and fitness remediation, EEF type-reviewer round,
Practice-Core portability rounds 1/2/3, observability multi-sink
plan WS0/WS1, rush-impulse-as-entropy-generator metacognition,
markdown shared-state collision class, CLI ergonomics fourth-instance
evidence, parallel-two-agent execution at N=2 with E1 observations,
N-agent collaboration hypothesis framework lift, smoke-harness
canonical redesign).

High-signal entries from that arc graduated to:

- `principles.md § Architectural Excellence Over Expediency` —
  rewritten 2026-05-02 to absolute framing with vocabulary
  trip-list, failure-mode analysis, and generator-vs-fence
  framing. Source napkin entries: rush-impulse-as-entropy-generator
  (Deep Navigating Stern 2026-05-01); architectural-excellence-
  absolute (Abyssal Diving Stern 2026-05-02).
- `PDR-040`, `PDR-041`, `PDR-042`, `ADR-169` — pin-to-Maintainer-
  Latest (PDR + ADR pair); composition-obscurity investigation
  methodology; signal-distinguishing pre-action gate. Source: Briny
  Lapping Harbor 2026-04-30.
- `PDR-036`, `PDR-037` — friction-as-structural-finding;
  substrate-vs-axis plan categorisation. Source: Verdant
  Sheltering Glade 2026-04-30.
- `PDR-038`, `PDR-039` — stated-principles-require-structural-
  enforcement; external-system-findings-reveal-local-detection-gaps.
  Source: Verdant Sheltering Glade 2026-04-30.
- `distilled.md § Multi-agent collaboration` — multi-agent
  collaboration cures are hypothesis-under-test, not design-to-ship.
  Source: Misty Ebbing Pier 2026-05-03 metacognition pivot.
- `pending-graduations.md` — active candidates including:
  CLI first-touch friction (4th instance, ready for promotion);
  observability multi-sink WS8.6/WS10 (due); inter-agent collaboration
  cures + worker addenda (due, hypothesis-validation-gated); P11
  housekeeping ownership (single instance); markdown shared-state
  collision class (pending, owner-direction partial); retired-thread
  retirement-banner discipline (pending, owner-direction partial);
  rush-impulse three structural cues (graduated to PDR-043 + ADR-172
  on 2026-05-03 — three cues fully landed in principles.md);
  6 skipped test files violating no-skipped-tests rule (cure: re-shape
  workstreams so tests + consumer wiring land together).

## 2026-05-03 — The rule applies, always: hedging stripped from principles, distilled, graduations

Owner halted graduation work mid-execution after identifying that
the agent had authored the rush-impulse-three-cues PDR/ADR pair
(sound) AND, in the same session, authored a named-deferrals PDR +
ADR + pattern triple that prescribed carving out the absolute
"NEVER skip tests" rule with elaborate audit machinery dressed as
"structurally bounded discipline". The cue 2 of the very PDR being
authored said *don't introduce a "case where the rule doesn't
apply"*; the agent did exactly that in the same turn.

The owner's reframings, sharpened across the arc:

1. **Tests + code = one practice = one action = together.**
   Test-commit-ahead-of-code-commit was the wrong workflow shape;
   the named-deferral discipline dressed the misreading.
2. **No special-case framing, ever.** "Carve out", "carve around",
   "exception", "honest framing for external X", "permitted variant",
   "for these arcs" — every wording that means *I know the rule
   always applies, but this situation is special* is the same
   failure. The rule applies. Period.
3. **Always strict, everywhere, all the time.** Strict-and-complete
   covers every rule, not just types.

The corrective went deeper than the initial deletions. Removed
this session:

- PDR-043 "producer-output-is-not-immutable-when-producer-is-ours",
  ADR-172 "Cardinal Rule extension to generator-emitted structure",
  and the principles.md Cardinal Rule extension paragraph — these
  prescribed a "carve out the operation; record the carve-out as a
  domain constraint" pattern with "honest framing only for external
  producers" hedging. Same shape as the multi-commit-TDD skip
  register, different vocabulary.
- Multi-commit-TDD skip-register PDR/ADR/pattern triple — deleted
  outright (no WITHDRAWN marker; no audit trail of bullshit).
- pending-graduations.md — deleted the producer-output entry, the
  multi-commit-TDD GRADUATED block, the multi-commit-TDD pattern
  observation, and the C7-carve-out entry that proposed numbering
  carve-outs as a pattern (C6, C7, C8...).
- distilled.md "Two narrow carve-outs, ratified 2026-05-02" —
  rewritten as a scope statement (the constraint targets
  host-repo paths; the Practice's own canonical surface and
  external http(s) citations are not host-repo paths and so are
  not in the constraint's domain). No carve-outs.
- principles.md "no type shortcuts" bullet — rewritten so the
  rule names what it bans (widening) rather than granting
  "permitted exceptions" for `as const` / `satisfies`. Narrowing
  operators are not in the rule's scope.
- Rush-impulse pair renumbered to PDR-043 + ADR-172 (filling the
  gaps left by the deletions; no number breadcrumbs).

Preserved: rush-impulse three structural cues PDR + ADR (the cues
do their job — they catch this exact failure mode); the
metacognition entry; the napkin rotation; the multi-agent
collaboration distilled insight.

**Generator named (again)**: rush impulse / closure pressure +
prior-art legitimacy bias. Recall-dependent principles fail under
flow-state pressure even when authored in the same session.
Structural enforcement (output-time vocabulary scanner +
candidate-doctrine review gate) is owed; PDR-038 reasoning applies.

**Existing skipped tests** (6 files) are a remaining
no-skipped-tests violation; cure is workstream re-shape so tests
land together with their consumer wiring. Captured in
pending-graduations.

**Original session intent**: complete consolidation, return to
MCP/search tool fix-and-prove work in agent-collaboration-
experiments context. Consolidation now done; back to the work.

## 2026-05-03 — Templates can encode failure modes; TDD-as-pairs landed in surfaces and plans

After the corrective deletions, two further sharpenings landed.

**1. Templates and components can institutionalise the failure
mode they were not designed to enforce.** The WS1=RED / WS2=GREEN /
WS3=REFACTOR shape in `feature-workstream-template.md` and
`tdd-phases.md` was the institutional source of every multi-
commit-TDD-shaped plan in this repo. The principles directive
already said "Red, Green, Refactor"; the template made that read
as "RED commit, then GREEN commit, then REFACTOR commit". Six
plans inherited that shape, and one of them (WS1 RED arc) left
4 skipped tests in the tree. Fixing the directive without fixing
the templates would have left the failure mode alive in every
new plan derived from the template. Lesson: when a generator is
named and a doctrine is sharpened, the templates the doctrine
flows through MUST be updated in the same pass — passive
guidance loses to artefact gravity (existing pattern, now with
fresh evidence).

**2. The "all hedging is the same failure" sharpening.** Owner
direction: there is no semantic difference between *carve out*,
*carve around*, *exception*, *honest framing for external X*,
*permitted variant*, *for these arcs*, or any other wording that
means "I know the rule always applies, but this situation is
special". Every such wording is the same failure shape in
different dressing. Cue 2 in PDR-043 names "case where the rule
doesn't apply"; the sharpened reading: vocabulary is not the
trigger — *intent* is. If the substance reads "the rule doesn't
apply here", the candidate is suspect regardless of vocabulary.

**3. Atomic, independent cycles for optional parallel-agent
dispatch.** New planning discipline added on top of TDD-as-pairs:
where the work shape allows, cycles should be made independent
of each other (separate file scopes, executable acceptance,
self-contained briefs) so each can be handed to a parallel
agent without mid-work coordination. Declared via optional
`depends_on: []` field on the YAML todo; cycles with no
declared dependency are parallel-safe. Plan-author rule: do not
invent serial dependencies the work shape does not require.
Pick the natural decomposition (separate workspaces, separate
modules, separate features) the cycles already suggest. Lands
as the first explicit framing of agent-multiplexing as a
plan-time concern rather than a runtime concern; future plans
inherit the discipline through `/jc-plan`.

**Active-plan inventory after this session**:

- All six `current/` plans now express work as cycle-pairs (test
  paired with product code in one commit). The 6 skipped tests
  have named cycle-pair homes — each one paired with the WS that
  will unskip and green it in one commit.
- The plan command, the TDD cycles component, and the feature-
  workstream template carry both disciplines (TDD-as-pairs and
  atomic-independent-parallel cycles); future plans inherit
  both automatically.

Next session resumes at the WS2 cycle of the multi-sink plan
(sentry-node `SinkRegistry` consumption — first paid-down
skip-violation + first product slice).
