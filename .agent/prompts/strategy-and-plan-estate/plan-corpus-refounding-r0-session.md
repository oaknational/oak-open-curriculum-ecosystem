# Session opener — Plan-corpus refounding R0: build the mechanical instrument (Stoat rides Gloaming)

> Pasteable opener. Authored 2026-07-06 (Wildfire herds Sulphur, 839565) at the owner's
> direction, at the close of the design-and-ratification session. The owner named
> **Stoat rides Gloaming** as the successor for this lane. Everything below is
> re-derivable from the named artefacts; treat this opener as pointer-and-hypothesis and
> recompute live state first (start-right discipline).

You are picking up the **plan-corpus refounding** at the start of R0. The protocol is
designed, cross-estate adversarially reviewed, owner-ratified, and landed; **nothing is
blocked on any decision** — your job is to build, test-first, the deterministic instrument
the protocol runs on, and produce the G1 packet for the owner's freeze-rule sitting.

## Hold this correctly (metacognition — generative mode)

You are building the instrument that PROVES nothing is lost when 618 files / 165k lines of
planning intent are re-founded. Every detector you build must prove it can fire before its
zero is trusted (P4); every script recomputes rather than records; a worker judgement is a
task-design failure. The protocol's authority chain: the owner's ratifications (2026-07-06,
recorded on the comms stream as the ratification-record event) → ADR-200 §Consequences
Amendment → `plan-corpus-refounding.plan.md` (P1–P14, J1–J9, the owner-gate register) →
the design record. Do not re-litigate ratified decisions; do surface genuine defects in
them (signals are verdicts).

## Ground first (read in this order)

1. `.agent/plans/product-development-governance/active/plan-corpus-refounding.plan.md` —
   the executable contract. R0a/R0b/R0c are yours this session.
2. `.agent/reports/agentic-engineering/plan-estate-refounding-design-2026-07-06.md` — the
   design record: every critical finding's disposition (§3, §3a), the resonance mechanism
   integration table, economics.
3. `.agent/reports/agentic-engineering/plan-estate-refounding-design-panel-2026-07-06/` —
   the conserved panel corpus. **F1-mechanical-substrate.md is your primary input** (the
   ten script contracts — plus `plant-challenge-canary`, which the ratified `r0a` todo
   names as its own script beyond F1; the plan todo is the binding script list); F2
   (worker envelopes) and F5 (the plan-state tool: one engine,
   two adapters) are R0b's inputs. Read WITH the design record's disposition tables — the
   raw designs contain the contradictions the critics caught.
4. ADR-200 §Consequences Amendment + §Sequence note + §Scope alignment note; the V0.1
   owner-signed block in `plan-node-schema.v0.md`.
5. `.agent/reference/resonance-practice-knowledge.md` §2 (recomputable state) and the
   incoming box synthesis `.agent/practice-core/incoming/resonance-plan-estate-refounding-synthesis-2026-07-06.md`
   (the ten-item kit — kit 1/3/4/9 bind R0 directly).
6. The thread record `threads/paused/strategy-and-plan-estate-holistic-review.next-session.md`
   §Where We Are (2026-07-06).

## The work (R0, in dependency order)

- **R0a — the mechanical instrument** (`agent-tools/src/refounding/`, TDD, zero-LLM):
  freeze / verify-freeze / inventory (three nets, verbatim, per-line digests) / tile
  (exact cover) / plant-orphan (incl. the marker-free paraphrase plant) /
  plant-challenge-canary (a separate script per the ratified `r0a` todo: the sealed
  planted-loss challenge plants with hash-commit-then-reveal keys and its own
  sealed-then-revealed acceptance) / sweep /
  merge-recheck (banner-aware) / batch-status / claim-census. Acceptance is in the plan
  todo: every detector passes its scripted discrimination proof; byte-stable determinism
  tests. **Freeze+inventory may land and run the moment their own proofs pass** — do not
  serialise them behind the rest of R0.
- **R0b — the plan-state recomputation tool** (`agent-tools/src/plan-state/`, per F5's
  one-engine-two-adapters design): fixture + 10-case mutation-probe selftest is THIS
  todo's acceptance; the full-estate divergence report is R1's.
- **R0c — the registers**: the consolidated owner-gate register + the Director-owned cost
  ledger (every billing denomination; fixed-vs-marginal; Author/Adjudicator lines;
  challenger-finding adjudication line).
- **Deliverable to the owner: the G1 packet** (surface-class verdict table with kit-10
  sub-reasons, Net-C keyword list, residue-orphan bounds, destination-rooting class,
  sanctioned-writer classes, the sweep single-net residue declaration or its reader-sample
  cure) — the plan's owner-gate register names the full contents.

## Operational craft this lane learned the hard way (conserve it)

- **Worktree**: `docs/plan-corpus-refounding` has a built worktree (sibling
  `-worktrees/plan-corpus-refounding` directory; resolve via `git worktree list`);
  install+build already done. Work there; the primary checkout belongs to whoever holds it.
- **Commits**: the pre-commit chain runs build/type-check/lint/test across ~26 packages
  even for docs-only commits (~5–10 min). Run `git commit` as a BACKGROUND task, never
  under a foreground timeout — two timeout-killed commits orphaned whole-tree lint fleets
  and drove host load to 94 (F-131 in the frictions register; the repair for hook-kill
  residue is forward `git show HEAD:<p> > <p>` writes, never `git restore`). Check host
  load before starting any heavy chain (the cross-estate one-heavy-chain agreement).
- **PR #315** carries the protocol + ratifications. **Merge-ready = checks green AND zero
  unresolved review threads, harvested via GraphQL at the declaration instant** — the
  binding-moment clause in `pr-comments-resolve-and-recheck` (added this session after the
  owner caught exactly that failure; F-130 is the mechanical-checker debt, a natural small
  first build alongside R0a if you want a warm-up).
- **WS2 of ADR-200 proceeds in parallel** and must not wait on you, nor you on it.
- The resonance exchange seat has stood down; the inter-practice lane's WS0+WS4 authoring
  session is a separate opener (`agentic-engineering/inter-practice-protocol-ws0-ws4-authoring-session.md`).

## Landing commitment shape

Per PDR-026, declare at session open. Suggested: `Target: plan-corpus-refounding R0a —
freeze+inventory scripts landed with green discrimination proofs (mutation-tested), G1
packet drafted.` The exit criterion is the proof, never the clock.
