---
name: "Reciprocal Cross-Agent Reviewer Dispatch"
polarity: pattern
use_this_when: "Two or more agents are landing substantive cycles in parallel on the same branch and can cheaply review each other's commits through directed comms."
category: agent
status: proven
discovered: 2026-05-22
proven_in: "2026-05-22 → 2026-05-23 multi-agent gate-1a substrate-floor team session (9 substantive review findings across three axes: SVW ↔ Sparking + SVW ↔ Foamy + Sparking ↔ Stormbound Spiralling Breeze; full enumeration below). Adjacent earlier instances on the same branch: t12-citation-shape cycle's pre-execution reviewer-dispatch chain (Mistbound + Stormbound + Cirrus reviewer-and-author symmetry, 2026-05-22)."
proven_date: 2026-05-23
adjacent: ".agent/memory/active/patterns/different-lens-reviewer-divergence.md (covers WHY multi-lens dispatch produces divergent findings; this pattern covers HOW peer-pair cross-dispatch operationalises that across separate agent sessions)"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Depending only on the original author's reviewer framing when a peer's different framing would catch different defects."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Reciprocal Cross-Agent Reviewer Dispatch

When two or more agents are landing cycles in parallel on the same
branch within a team session, the established cadence of
**self-dispatched pre- and post-execution reviewers** is amplified by
adding **reciprocal cross-agent reviewer dispatch**: agent A dispatches
a `code-expert` / `type-expert` / `docs-adr-expert` / `assumptions-expert`
sub-agent on agent B's landed commit, returns the verdict via directed
comms, and B absorbs the findings in a follow-up `chore(scope): absorb
<reviewer> post-exec on <SHA>` commit. The pattern then runs in the
other direction.

The empirical signature: each cross-agent reviewer pair catches
defects that the original author's own self-dispatched reviewers
missed. The divergence is the value — not because the original
reviewers were inadequate, but because **another agent's brief framing
of the same commit elicits different sub-agent attention** (different
specific questions, different surface points, different priors carried
into the dispatch).

## Pattern

**Shape**:

1. Agent A lands cycle X via the commit-queue ceremony with its own
   self-dispatched pre- and post-execution reviewers (per
   `invoke-code-experts` rule).
2. Agent B, working in parallel on a different cycle, dispatches a
   reciprocal post-execution reviewer on cycle X's commit. The brief
   frames specific questions B would ask if they were authoring or
   integrating against X — these questions differ from the questions
   A asked their own reviewers.
3. B returns the verdict via directed comms to A with explicit
   `[APPROVE | NITS-FOLLOWUP | CHANGES-REQUIRED | ESCALATE]` shape +
   substantive findings.
4. A absorbs the findings (if substantive) in a `chore(scope): absorb
   <reviewer> post-exec on <SHA>` follow-up commit. Closure broadcast
   acknowledges the catches.
5. The pattern runs in the other direction when B lands a cycle: A
   dispatches reciprocally on B's commit.

**Closure invariant**: the loop closes when both agents have run at
least one reciprocal dispatch on each other's cycles. Sequential
asymmetry (A reviews B but B does not review A) is acceptable but
not the proven shape — both directions strengthen the closure.

## When to apply

- A multi-agent team session is running cycles in parallel on the
  same branch.
- The cycles are substantive (not state-flag flips or one-line absorbs).
- The agents have a working channel for directed comms (the shared
  `.agent/state/collaboration/comms/` event stream + watcher).
- Both agents have context budget for one extra reviewer dispatch per
  cycle pair.

## Empirical worked instances (2026-05-22 → 2026-05-23 session)

**9 substantive review findings across three cross-agent axes**:

**SVW ↔ Sparking axis** (3 catches each direction = 6 catches):

- SVW → Sparking on `745fe919` (t13a freshness check): TSDoc filename
  forward-reference (the `@packageDocumentation` block named
  `eef-freshness-binding.unit.test.ts` for a future binding test that
  could land under a different name). Absorbed at `8f253280` —
  TSDoc-only, +5/-3 lines, generalised the pointer to remove the
  filename-pinning rot risk.
- SVW → Sparking on `7d8f0b0c` (t1 EvidenceCorpus type substrate):
  3 plan-vs-implementation divergences in `RankOptions.context` —
  `focus` enum shipping 4/6 members (missing `'behaviour' | 'feedback'`);
  `pp_percentage?: number` absent inside `context`; `max_results`
  nested inside `context` instead of peer to `filter`+`context` per
  plan body. Both reviewers (code-expert + type-expert) converged
  independently. Absorbed at `9425faa0` — 1 file, +26/-2 lines.
- SVW → Sparking on `ce0abe26` (WS2.2 jsonld-compatible + Turtle):
  literal-object quads partial C2-deviation — the manual-iteration
  flag pattern verified only `predicate.value`/`subject.value`, missing
  the literal-value structural check that `dataset.has(quad(...,
  literal('Ada')))` would do correctly. Absorbed at `361cae35` (Sparking's
  test improvement) with all-literal-object assertions migrated to
  the structural `has()` shape.
- Sparking → SVW on `a2136557` (t10 lesson-plan prompt): 3 catches +
  1 minor — registration tests in `mcp-prompts.unit.test.ts` were
  schema-audit-shaped (TypeScript already enforced via `as const`);
  KS5 phase-resolution coverage gap (F9 edge case "EEF coverage
  primarily up to age 16" had no test); `m.content.text` access in
  test helper unguarded (defensive narrowing against future
  `PromptMessageContent` widening); plus a SHA-pinned TSDoc
  `@remarks` reference rot risk extending the
  `no-moving-targets-in-permanent-docs` discipline from plan files to
  git-SHA references. Absorbed at `11c05ced` — 3 files, +46/-22.

**SVW ↔ Foamy axis** (2 catches):

- Foamy → SVW on `acd2a3f3` (t9 AGGREGATED_EEF_EVIDENCE_GUIDANCE):
  TSDoc line-range references that would silently rot if the strategy
  doc inserts content above the referenced lines. Absorbed in-touch
  (replaced line-range references with section-header anchors).
- SVW → Foamy on `bf7fa545` (WS4.4 test-partition amendment): WS4.5
  `depends_on` array drift (named WS4.1 in prose but not in YAML);
  stale `Last Updated` header on graph-query-layer.plan.md.
  Recorded as targeted follow-up for the next plan touch (NITS-FOLLOWUP
  verdict, not blocking; non-absorbed at this commit but the audit
  trail captures the next-touch obligation).

**Sparking self-dispatched architecture-expert-betty** on `7d8f0b0c`
(t1) — additional independent finding: relocate the 12 corpus type
re-exports from `public/mcp-tools.ts` to a dedicated
`public/evidence-corpus.ts` subpath for cohesion. Absorbed at
`5ec02aec` — 3 files, +44/-21. This worked as **self-dispatch fallback**
when peer-reciprocal bandwidth was constrained, demonstrating the
pattern also works asymmetrically.

**Sparking → Stormbound Spiralling Breeze axis** (1 verdict, 2026-05-23
07:02:53Z, broadcast to comms stream since Stormbound's watcher had
stopped at closeout): reciprocal post-execution code-expert verdict on
Stormbound's `3241893d` (WS4.1 landing) — APPROVE-WITH-SUGGESTIONS,
no critical, 2 important deferrable, 4 suggestions. Important findings
were workspace-tier patterns rather than commit-local defects:
`preserve-caught-error` ESLint rule wired by bare name without plugin
prefix (latent silent-no-op risk if rule ever moves into a plugin
namespace); root barrel doc-comment aspirationally rather than
presently accurate (will re-export vs re-exports phrasing). Suggestions
covered knip-version reference accuracy, `tsconfig.lint.json` `noEmit`
declaration consistency, and vestigial `main`+`types` alongside
complete exports map. **This third axis extends the pattern beyond
the SVW ↔ Sparking + SVW ↔ Foamy pairs** — confirming the pattern
generalises across cross-agent pairs rather than being specific to
any one pair's dynamics, and demonstrates the comms-broadcast verdict
shape works when the original author's watcher has stopped at session
closeout (the verdict becomes a substrate record for the next session
reading the comms tail).

## Why the divergence is the value (not noise)

Each cross-agent reviewer pair caught defects the original author's
own reviewers missed. Three forces explain the divergence:

1. **Different brief framing**: when B writes the reviewer brief, B
   names different questions than A would. Same artefact, different
   attention points. Reviewers respond to the brief.
2. **Different agent priors**: B carries different session context
   (the reciprocal review on Sparking's `7d8f0b0c` came AFTER SVW
   had already absorbed three of Sparking's reviewer findings on SVW's
   own cycles — that pattern recognition primed SVW to look for
   plan-vs-implementation drift specifically).
3. **Independent dispatch resets context**: a sub-agent dispatched
   by B reads the diff fresh, without the A-session's reviewer-finding
   history. This is structurally similar to the
   `different-lens-reviewer-divergence` pattern but applied across
   agent sessions rather than across reviewer specialties.

## Cost vs value

- **Cost per cycle pair**: ~1 sub-agent dispatch (~60-90s of agent
  time) + ~30s for the directed-comms verdict round-trip + ~5-10min
  for the original author to absorb findings in a follow-up commit.
- **Value per finding**: each defect caught at post-execution time
  saves the downstream rediscovery cost at integration time (the
  WS4.5 consumer of `RankOptions.context` would have hit the focus
  enum gap; the t10 prompt would have shipped with a duplicate
  AGGREGATED_EEF_EVIDENCE_GUIDANCE if SVW had not caught the
  splice-presence regression in the schema-audit test reshape).
- **Net**: at the n=9 findings observed in this session, the pattern
  is paying multiples of its cost. The diminishing-returns boundary
  is when both agents' reviewers consistently land verdicts with no
  substantive findings — at that point the pattern can drop to
  occasional dispatch rather than every cycle.

## The reciprocity-axis is the load-bearer, not the n-count

Refinement landed 2026-05-23 (Sparking last-agent-out metacognition).
The pattern's value is in the RECIPROCITY (pair-bidirectional dispatch),
not in the absolute count of catches across all pairs.

**What the n-count obscures**:

- **Pre-execution self-dispatch** caught the highest-leverage defects
  this session (WS2.3 Quad-object-keyed-Map unsafety; "JSON Pointer for
  Turtle" type-level lie; the jsonld walker typing wall). These would
  have been parser-integration-cycle rewrites if missed. All were
  *self-dispatched*, not peer-dispatched.
- **Post-execution peer-reciprocal** caught important-but-tier-2
  plan-vs-impl divergences (focus enum 4/6 members, `pp_percentage`
  missing, `max_results` mis-nested) and schema-audit-vs-behavioural
  test shapes.

**Structural insight**: pre-execution self-dispatch + reciprocal
post-execution peer-dispatch is the cheapest + highest-value review
combo (<2 minutes total per cycle). The reciprocity-axis pairs deliver
depth; adding more reviewers in a fan-out adds breadth without depth.
**Two agents reviewing each other beats five agents fanning-out to one**
for substrate-substance quality.

**Implications for application**:

- A reciprocity-axis pair with mutual dispatch is the proven shape; n=9
  empirical findings arose from three such pairs (SVW ↔ Sparking, SVW ↔
  Foamy, Sparking ↔ Stormbound Spiralling Breeze).
- Adding a fourth pair (5 agents fanning to 1) for the same cycle is
  unlikely to add depth proportional to its cost.
- Self-dispatched pre-execution review is NOT replaceable by peer
  post-execution. They cover different failure modes (type-level lies
  vs plan-vs-impl drift).
- The pattern graduation is on the reciprocity property, not on the
  empirical n. n grows in any session with active pairs; reciprocity is
  the property that determines whether n yields depth or breadth.

## Adjacent patterns

- [`different-lens-reviewer-divergence`](different-lens-reviewer-divergence.md)
  — the WHY for parallel-reviewer dispatch returning divergent findings.
  Reciprocal cross-agent dispatch operationalises that lens-divergence
  across separate agent sessions.
- The `invoke-code-experts` rule + executive-memory invocation matrix —
  the WHEN to dispatch self-reviewers. Reciprocal dispatch is the
  natural extension when peer agents are also active.

## Anti-pattern boundary

This pattern is NOT:

- **Stand-off reviewer-vs-reviewer adversarial framing**: the two
  agents are collaborating on quality, not competing on verdict
  shape. When the reciprocal reviewer disagrees with the original
  reviewer, the substance question is resolved on principle (per
  `more-restrictive-practice-rule-wins-on-reviewer-conflict` if
  applicable), not by reviewer authority count.
- **Mandatory on every cycle**: small one-line absorptions or
  state-flag flips do not warrant the reciprocal-dispatch cost. The
  pattern fires on substantive cycles where another agent's lens
  carries real probability of catching a real defect.
- **A substitute for the original author's reviewer cadence**:
  reciprocal review complements, never replaces, the author's own
  pre-execution and post-execution reviewers (per `invoke-code-experts`).

## Surface

This pattern fires from:

- The shared `.agent/state/collaboration/comms/` event stream + watcher
  (the channel agents use to broadcast SHA landings and receive
  directed reviewer verdicts).
- Pre-execution reviewer-dispatch discipline already established
  per `invoke-code-experts` + the `code-expert`-as-gateway rule.
- An emergent default that 4+ agents adopted unprompted across this
  session — the empirical evidence that the pattern is graduation-ready,
  not just speculative.

## Graduation status

Captured for graduation in
[`pending-graduations.md`](../../operational/pending-graduations.md)
under the 2026-05-23 first-out closeout entry "Reciprocal cross-agent
reviewer dispatch pattern — empirically validated".
This pattern file is the captured-substance home; the rule shape (if
any) graduates separately if and when the pattern is observed across
multiple team sessions (currently single-session n=9, awaiting
second-session validation before any rule promotion).
