---
name: "Agent Frustration Corpus Survey — surface frictions not yet in the register"
overview: >
  Mine the repo's friction/frustration corpora that sit OUTSIDE the curated
  frictions register — archived napkins, the comms corpus, the agentic-engineering
  WS1–6 research, analysis/research, and git-log signals — extract candidate
  frictions, dedupe against the live register, and route the residue in. A
  read-and-route survey, not a build.
status: future
type: developer-experience
related_reports:
  - "../../../reports/agent-experience-cause-class-analysis-2026-06-21.md"
related_plans:
  - "../current/agent-experience-improvement.plan.md"
related_doctrine:
  - ".agent/practice-core/decision-records/PDR-060-tooling-friction-is-first-class-user-feedback.md"
  - ".agent/practice-core/decision-records/PDR-111-agent-experience-is-first-class.md"
last_updated: 2026-06-21
isProject: false
---

# Agent Frustration Corpus Survey

**Status**: 🔵 FUTURE — strategic brief, queued. Named as a next-step by the
2026-06-21 AX cause-class analysis.

## Problem and intent

The frictions register (82 entries) is the *curated* AX backlog, but it is a
projection: it holds the frictions agents took the time to capture into one
surface. PDR-060 capture is best-effort and session-scoped, so real friction
signal is also scattered, uncaptured, across corpora that no one has swept
end-to-end for tooling pain. The drain-fix in the companion plan makes the
register's drain *visible*; this survey makes the register's *intake* complete —
the two are the inflow and outflow of the same loop.

## End goal · Mechanism · Means

- **End goal (user impact)**: the frictions register reflects the AX pain agents
  have actually expressed across the repo, not only what was hand-filed — so the
  drain machinery operates over a complete intake and no recurring friction is
  invisible because it was never registered.
- **Mechanism**: a single read-and-route pass over the friction-bearing corpora,
  deduped against the live register, routes net-new frictions in (each as a
  register entry with a candidate cause-class). Survey output is register entries,
  not a parallel document.
- **Means**: inventory → extract → dedupe-against-register → route. Sized to unique
  substance (a recurring pain across ten napkins is one register entry, not ten).

## Corpus inventory (the survey's input)

| Corpus | Path | Signal |
|---|---|---|
| Archived napkins (~93 files) | `.agent/memory/active/archive/napkin-*.md` | session-end friction instances, workarounds, recurrence |
| Comms corpus | `.agent/state/collaboration/comms/` (live) + archive | tool-failure events, ordering/render pain (untracked-by-design) |
| Agentic-engineering research | `.agent/reports/agentic-engineering/` (WS1–6) | failure-mode taxonomy, discoverability audits, comms-corpus synthesis |
| Analysis + research | `.agent/analysis/`, `.agent/research/` | systemic gaps, integration friction, design debt |
| Distilled / pending-graduations | `.agent/memory/active/distilled.md`, `.agent/memory/operational/pending-graduations.md` | staged friction candidates not yet routed |
| Git log | `git log --grep` friction/fix/workaround | migration debt, workaround signals |

## Domain boundaries and non-goals

- **In**: extracting friction signal and routing net-new entries into the
  frictions register with a candidate cause-class.
- **Out**: *curing* any friction (that is the companion plan and the per-class
  plans); re-deriving the cause-class taxonomy (the report owns it); mining
  product-feature requests (AX-substrate only).
- **Non-goal**: a parallel "frustration document" — the register is the single
  home; this survey feeds it.

## Dependencies and sequencing

- **Blocking**: none — the corpora exist and are readable now.
- **Beneficial**: the companion plan's drain-validator + closed status grammar
  landed first, so routed entries get a `Home:`/disposition from the start.
  Minimum shippable shape without it: route entries in the current freeform shape;
  the disposition migration absorbs them.

## Strategic acceptance criteria and success signals

- Every corpus above is swept; the sweep records what was covered and what was
  intentionally skipped (no silent truncation).
- Net-new frictions are in the register, deduped against existing entries, each
  with a candidate cause-class (A–H per the report).
- A short coverage note records the derivation ("N candidates found; M routed as
  new; K deduped into existing F-NN; J out-of-scope").

## Risks and unknowns

- **Volume** (~93 napkins, thousands of comms events): bound the sweep by
  cause-class saturation — stop a corpus when it stops producing net-new classes,
  and log the stop. Per `loop-exit-criteria-required`.
- **Untracked comms corpus**: present-on-this-checkout only; the survey reads what
  is on disk and notes the limitation.
- **Sub-agent sifting**: sub-agents may sift the corpora but findings are
  verified first-hand before routing (a sub-agent fabricated a quote in a prior
  pass) — `feedback_first_hand_means_me_not_subagents`.

## Promotion trigger

Promote to `current/` when the companion plan's drain machinery has landed (so the
register has the status grammar to route into cleanly), or on owner direction to
run the survey sooner.
