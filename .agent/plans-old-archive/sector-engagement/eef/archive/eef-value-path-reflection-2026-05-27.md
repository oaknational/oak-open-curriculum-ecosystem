# EEF Value-Path Reflection — 2026-05-27

Generative metacognition (owner-triggered), authored by Starless (13c7d5) after
commit 1 landed and the WS4.5-adapter-missing discovery reshaped the value-PR.
Galactic (7efeec) was owner-paused mid-reflection → effective single-agent
execution, with Galactic's in-cycle review of commits 2–3 parked until resume.

## The impact we are actually chasing

Gate-1a real value: **a teacher gets relevant EEF Teaching & Learning Toolkit
evidence for their teaching context**, via the `eef-explore-evidence-for-context`
MCP tool + the `eef-evidence-grounded-lesson-plan` prompt (landed), as a typed
subgraph of strands with citations + caveats, to ground a lesson. This is the
**first working instance of the external-evidence-corpus pattern** — it repeats
for future corpora, so the shape matters beyond gate-1a.

## Where we honestly are

- **Landed:** commit 1 (`52972ad6`) — corpus type relocation to
  `graph-corpus-sdk`. Internal plumbing, **zero teacher value yet**. Plus prior-PR
  pieces: the prompt, guidance constant, citation shape, telemetry types, a
  freshness check *function*.
- **The real engine does NOT exist:** the `EefStrandsGraphView` adapter (WS4.5) —
  the thing that loads EEF data and answers `subgraph`/`manifest` queries — is a
  placeholder. Without it the tool has nothing to call. The plan claimed it
  landed; it didn't. **The pre-execution review caught this** — the rigour paid
  for itself here.
- **Process assets built this session:** comms-method comparison report;
  worktree-per-agent evaluation (positive, with build-onboarding + commit-ceremony
  mapping findings); the review-findings register (all items owned); a live
  observer.
- **Team:** Galactic owner-paused → I am solo; their review duty is parked.

## The honest value-distance (the uncomfortable part)

We are ~1 *cheap* commit into a path whose value lives entirely in the **3
substantive commits still ahead**. Effort so far has been ~80% process /
coordination / analysis, ~20% value — much of it deliberate, owner-directed
pattern-setting. That investment was not waste: it caught a blocking plan-drift
(WS4.5) that would have detonated at commit 3/4. **But the pattern is now set.
The remaining path must not re-pay the pattern-setting cost.** The
process-to-value ratio has to invert from here.

## Where we need to get to — "done = real value" bar

The tool, called with a real teacher context (subject, key_stage, topic, optional
focus), returns a **real** typed subgraph of EEF strands loaded + Zod-validated
from the canonical `eef-toolkit.json`, with citations + caveats, **verified
end-to-end against real data — not a fake**, with the prompt orchestrating it.
Green unit tests against an injected fake are necessary but **not** the bar.

## The irreducible value path (no shortcut exists)

Each remaining commit is the minimum; none can be skipped or faked away:

1. **Commit 2 — `EefStrandsGraphView` adapter (WS4.5): the engine.** Load strands,
   build the graph, implement `subgraph` + `manifest` live; 5 ops as typed
   `NotImplementedYet` stubs. + item G (graph-corpus-sdk → curriculum-sdk one-way
   eslint/depcruise rule). **Novel/substantive → focused specialist review.**
2. **Commit 3 — Zod loader + freshness.** Validate + load `eef-toolkit.json`
   (co-located in `graph-corpus-sdk`); `z.infer` replaces the `EefStrand` skeleton
   (items F, J); `freshness:check` binds (ADR-175); resolve phase-union /
   `early_years` (item C); assess `freshness.ts`/`citation-shape.ts` rehome (item
   M). **Substantive (schema) → type + test + freshness review.**
3. **Commit 4 — the tool + wire-up + tests (+ the deferred dep).** MCP surface
   over the adapter's `subgraph`; register tool + prompt; ADR-123 tables; re-check
   `./mcp/*` wildcard (item I). **→ mcp + type + test review.**
4. **Open value-PR → main.** Then `pr3-gate-1a-closure` (acceptance bundle,
   release-readiness go/no-go, status sync) as a separate closeout.

## Right-sized process for a two-agent team (the calibration)

- **The 6-reviewer panel + register-from-scratch was a one-time commit-1
  investment. Do not repeat it per commit.**
- **Calibrate review to risk:** specialist review on *novel design surfaces*
  (adapter design, loader failure modes, the tool's MCP shape); self-review +
  gates on mechanical changes.
- **Per-commit cadence:** implement → self-verify gates in worktree → *one
  targeted* specialist review matched to the commit's risk → absorb → commit.
- **Stand down the heavy apparatus:** comms-method report is complete; the
  observer runs lighter or stands down; the register is the standing tracker
  (append, never rebuild).
- **n=2 comms mode confirmed** (no heartbeat; sidebar for sync) by the 97%
  ceremony finding.
- **Galactic-paused contingency:** while Galactic is dark, build commits 2–4 in
  the worktree and **hold the PR for review-on-resume** (no-backfill = review
  before the PR *merges*, not before each worktree commit). If the pause is
  extended, route review to fresh specialist subagents rather than block value on
  a dark reviewer — owner's call.

## Structural cure for the WS4.5-class defect (not a doc patch)

The root cause of the WS4.5 surprise is "plan `LANDED` status drifts from
implementation." Per the metacognition directive's cure-shape rule, the durable
cure is **generative, not a one-time correction**: a fitness check that verifies
plan `LANDED`/`completed` claims against the codebase (does the named
symbol/file/export actually exist?), failing when a plan asserts landed work the
code doesn't contain. That recur-proofs the whole class; hand-correcting this one
plan does not. Proposed as a follow-on (owner/curation), not value-PR scope.

## Action-to-impact bridge — what changes from here

1. Stop treating each remaining commit as pattern-setting; the pattern is set.
2. Invert the process-to-value ratio: light, risk-calibrated review; drive the
   substantive engine work (adapter → loader → tool).
3. Define + verify the **end-to-end real-value bar**, not just green units.
4. Bring plans + continuity into line with the true state (WS4.5 missing→folded,
   4-commit value-PR, the value-distance honesty).
5. Carry the Galactic-pause contingency explicitly so value isn't blocked on a
   dark reviewer.
