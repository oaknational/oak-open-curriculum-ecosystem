---
id: workspace-config-enforcement-hardening
node_type: delivery
name: "Workspace-config enforcement hardening: the surviving depth slices (H1 slimmed, H2, H4)"
overview: "Harden the landed workspace-config boundary enforcement along the surviving decided axes: one path idiom by construction (H1, slimmed), config file-class widening with coverage assertion (H2), and bootstrap-closure ordering (H4) — every slice with a committed red-proof. H3 and the H1 config-VALUE leg were withdrawn at the owner's word 2026-08-11."
status: archived
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-11
ratified_where: "Owner approval of the decision-complete completion-arc plan, in-session at the implementer seat (Wren calls Downdraft 6b29b5), 2026-08-11 — the plan named this node's birth explicitly (successor carrying slices H1–H4, cut so the parent node stays one step of the lane). Amended 2026-08-11, owner word at the lane seat (decision-matrix run): H3 WITHDRAWN — an extends reference is not an import (principles §Tooling) and no live consumer forces it; H1 SLIMMED — the config-VALUE scanner dropped as an instrument built to find nothing. The stamp covers the surviving scope; a ratification stamp owner-locks nothing."
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: workspace-config-isolation
    kind: beneficial
owner_gates: []
last_updated: 2026-08-12
---

## Re-scope and archival (2026-08-12, owner four-card ruling at the lane seat)

The owner-directed provenance pass (2026-08-12: every queue item's
problem claim traced to an owner observation or a first-hand-reproduced
defect in territory we own) dispositioned every remaining slice, and the
owner ratified the outcome by card:

- **H1 (idiom standardisation) — REMOVED.** No live defect: the one
  historical escape the recognition problem guarded against was
  structurally cured before this node was born. The earlier keep-verdict
  ("simpler estate", lens 3) is re-read as momentum — the seat had built
  the instrument. Re-enters only on a real defect caused by a config-file
  path idiom.
- **H2 widening + depth — evidence-gated** (morning re-derivation, same
  day): re-enters on a named live escape in the widened config families.
- **H2 coverage-assert — FOLDED into MCP-543's PR as a rider** (same
  file, same instrument): the workspace-membership assert plus its
  synthetic unmatched-member red fixture land with the named lawful-edge
  rule. Kept because its failure class is silent-forever (an unpoliced
  new workspace never announces itself) and the class occurred here
  first-hand (the field-integrity phantom include).
- **H4 (bootstrap ordering + staleness) — REMOVED.** The experienced
  defect of its class was already cured at `cd822f20f` (#836); no
  recurrence observed. Re-enters on recurrence evidence.

With every slice removed, gated, or folded, this node holds no active
work and ARCHIVES with zero executed slices. That outcome is the record:
each slice was born from instrument-side reasoning; none survived the
provenance rung. The dormant re-entry conditions above are the node's
legacy — a re-entry mints a fresh node citing this ledger.

# Workspace-config enforcement hardening

## Goal

The boundary enforcement landed by the `workspace-config-isolation`
lane (depcruise rules at error severity plus the resolver-invisible
validator) holds against the drift classes the #836 review packet and
its stress-tests named: unrecognised path-arithmetic spellings, config
families outside the scanned class, workspace roots outside the rule
regex, and install-time build ordering. Each surviving slice closes
one class structurally, with a committed red-proof — never a silent
gap. (Relative tsconfig `extends` chains left this list with H3's
withdrawal, 2026-08-11.)

The `depends_on` edge is `beneficial`: every slice is executable
against today's main. The minimum shippable shape without the parent's
remaining todos is exactly the three surviving slices (H1 slimmed,
H2, H4) as specified — none reads
the census register or the de-hatched lint surface; H-slices and the
exemption-removal programme's census sweeps (extracted from the
parent 2026-08-11) are cross-seat parallelisable because the
census register is partitioned per-surface.

## Mechanism — decisions, made (2026-08-11, all measured)

- **H1 — one path idiom, by construction.** Config-file path
  derivation standardises on native `import.meta.dirname` (~40
  mechanical one-line rewrites across four current spellings —
  measured; already live at two sites in `oak-eslint`'s own config,
  so runtime support is proven in-estate; the 53-site migration of
  the parent's todo 1 is the sweep precedent). The validator then
  recognises path arithmetic rooted at `import.meta.dirname` with
  literal segments (containment-checked) and REFUSES every other
  spelling (`import.meta.url` arithmetic, `__dirname`) and every
  non-literal — an unrecognised spelling can never silently pass
  again. The quote-parity false-refusal heuristic in the
  comment-stripping module is rewritten in the same slice, and the
  bin-level fs-unreadable exit-2 test lands here (the one refusal
  path that was implementation-verified-only). The config-VALUE leg was DROPPED at the owner's matrix word
  (2026-08-11): an instrument built to find nothing — both live
  config-VALUE relative strings estate-wide target lint-ignored
  `.agent/reference/**`; the class keeps a recorded pointer in the
  parent plan's register triage, not a scanner. The sanctioned idiom is itself registered in
  the [`exemption-removal`](exemption-removal.plan.md) node's register
  with this plan as its policy pointer (an allowance in an enforcement
  surface carries its warrant; the census extracted there 2026-08-11
  at the owner's word).
- **H2 — config file-class widening + depth + coverage assert.**
  The scanned config class widens to the families measured present (9
  tracked files: 3 playwright, 1 vite, 2 next, 1 postcss, 2 esbuild)
  in BOTH the depcruise `from.path` classes and the validator's
  file-class predicate, under H1's final refusal semantics (H1 lands
  first so every per-family red-proof is written once). Two of the
  nine sit BELOW their workspace root — the depth the current
  one-segment anchor misses — so depth handling is part of this
  slice, not a separate row. A new validator leg asserts every
  expanded `pnpm-workspace.yaml` member directory is matched by the
  depcruise `from.path` alternation (assert-not-derive: recomputes
  coverage instead of generating config; a synthetic unmatched member
  is the red-proof), so a new workspace root can never silently sit
  outside the rule.
- **H3 — WITHDRAWN 2026-08-11** (owner word, decision-matrix run;
  see Out of scope for the ground and re-entry condition).
- **H4 — bootstrap closure hardening.** Two cures in one slice, both
  extending `agent-tools/src/bootstrap/bootstrap-helpers.ts` with
  red-proof unit tests: an install-time-closure ordering check (every
  config import in the install-time closure must be registered
  earlier in `WORKSPACE_DEPS` — the cold-install recurrence class),
  and the shared config package's dist artifacts counted as leaf
  staleness inputs (transitive staleness: today a workspace-config
  rebuild does not invalidate the leaf deps' staleness skip; bounded
  exposure meanwhile — cold installs unaffected, turbo's `^build`
  edge rebuilds leaves on the next orchestrated build).

## Todos (each a single-story PR; ticket minted at pickup)

1. H1 (slimmed 2026-08-11) — idiom standardisation + validator
   refusal rewrite + comment-stripping rewrite + fs-unreadable bin
   test. (The config-VALUE leg left with the same-day amendment.)
2. H2 — family widening + depth handling + workspace-root coverage
   assert (after H1).
3. H4 — bootstrap ordering check + transitive staleness inputs.
   (H3's former todo withdrawn 2026-08-11.)

## Acceptance criteria (each with a proof)

- Config-file path derivation uses `import.meta.dirname` exclusively;
  the validator refuses every other spelling and every non-literal —
  `repo-safe`: validator green estate-wide + committed red-proofs for
  the refused spellings; the sanctioned idiom's census row carries
  this plan as its policy pointer.
- Every config family present in the estate is inside the scanned
  class at any depth, and every pnpm-workspace member is matched by
  the depcruise rule — `repo-safe`: per-family red-proofs + the
  synthetic-unmatched-member red-proof + depcruise green.
- The install-time bootstrap refuses an unregistered config import in
  its closure, and a workspace-config rebuild invalidates dependent
  leaf staleness — `repo-safe`: red-proof unit tests on
  `bootstrap-helpers.ts`.

## Out of scope

- **H3, tsconfig-extends via the package — withdrawn 2026-08-11**
  (owner word at the lane seat, decision-matrix run). Ground: the
  boundary rule binds imports and an `extends` reference is not one —
  live doctrine (principles §Tooling) names the extends chain as the
  one permitted root-anchored convention; the sole empirical forcing
  consumer (the Stryker sandbox) ran the canary at 100% with
  root-anchored extends untouched. Re-enters only with a named live
  consumer that copies workspace subtrees.
- **The H1 config-VALUE scanner — dropped 2026-08-11** (same word):
  an instrument built to find nothing; the class keeps its recorded
  pointer in the parent plan's register triage (row 7c).
- Everything the parent plan owns (the lint de-hatch arc, S1b, S2)
  and everything the `exemption-removal` node owns (the census
  mechanism and sweeps, extracted 2026-08-11). This node hardens
  instruments; it does not adjudicate register rows.
- Estate-wide mutation-testing roll-out (owner-committed, later,
  staged — carried at the parent plan's Out of scope).
- Deriving the depcruise config from `pnpm-workspace.yaml`
  (generation) — rejected for the assert-leg shape in H2:
  recompute-and-assert gets the same drift protection without config
  codegen machinery.
