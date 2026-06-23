---
title: "PR #128 — Formal Substrate for Agentic Recurrence: disposition analysis"
type: report
status: stable
date: 2026-06-23
subject_pr: 128
disposition: closed-overtaken-by-adr-200
authors:
  - "Magnetar calls Gloom (9e276e) / claude-code"
  - "Narwhal tracks Lagoon (1bffe8) / claude-code"
reviewers:
  - assumptions-expert
  - architecture-expert-betty
  - docs-adr-expert
---

# PR #128 — Formal Substrate for Agentic Recurrence: disposition analysis

## Summary

PR #128 (`docs(agentic): propose formal substrate for agentic recurrence`,
opened 2026-05-29 by the owner) proposed a new `.agent/formal-substrate/`
documentation layer: an invariants register, an epistemic-status vocabulary,
proof-carrying claim records, a lemma book, an attractor-state file, optional
"formal reviewers", and a hand-authored set of reasoning-graph edge types —
framed as a "state-transition / attractor / recurrence" model. It was
`status: future`, not approved for implementation; merging it would have
committed nothing operationally.

**Disposition: CLOSED as overtaken by ADR-200, with the genuine kernels carried
forward.** Decided by the owner on 2026-06-23 after the analysis below.

This was a two-agent (n=2) analysis: independent operational-soundness and
architecture/cohesion lenses (Magnetar, with `assumptions-expert` and
`architecture-expert-betty`), and an independent epistemic-placement /
knowledge-flow-duplication / context-budget lens (Narwhal, with a
`docs-adr-expert` cross-check). All lenses converged.

## The decisive fact (verified first-hand)

The proposal's core problem statement is that the repository lacks graph
relationships describing claim / constraint / tension / evidence structure. Its
framing is dated **2026-05-29**.

That gap was closed on **2026-06-22 by ADR-200 ("Intent as a living idea-graph —
graph-authoritative")** — Status: Accepted (owner-ratified), verified first-hand
against the ADR's status line and decision sections. ADR-200 makes a
machine-readable, schema-backed idea-graph the authoritative source of truth for
ideas, with typed reasoning edges (`refines`, `tension_with`, `supersedes`,
`serves`, `depends_on`, `duplicates`; plus ADR-201 evidence edges), derived-view
non-canonicity, and a family-of-knowledge-graphs future — a more rigorous route
over `graph-core`. PR #128 predates and does not reference it.

Critically, **ADR-200 §135-136 and §217 mandate that edge vocabularies be
discovered from the corpus, never authored a priori.** PR #128's hand-authored
10-edge list (`SUPPORTS_CLAIM`, `CONSTRAINS`, `RAISES_TENSION_WITH`, …) therefore
conflicts with the *decided method*, not merely duplicates it. (This sharpening
came from Narwhal's lens, verified first-hand against ADR-200.)

## Operational core, once the framing is stripped

Underneath the mathematical vocabulary, the concrete proposal is **documentation
discipline**: a taxonomy (invariants / epistemic-status / claims / lemmas), an
orientation doc (attractor-state), and a graph-edge vocabulary. There is no
algorithm, mechanism, enforcement, or validator. `S_t → S_{t+1}`, "attractor",
and "proof-carrying" are descriptive metaphor over markdown a human writes and
reads. The "formal/mathematical" branding **over-claims** guarantees the
artefacts cannot deliver — and PDR-038 ("stated principles require structural
enforcement") names an unenforced invariants list as the incomplete half.

## Duplication map (built independently by both lenses, converged)

| Proposed surface | Already owned by |
|---|---|
| `invariants.md` register | `principles.md` + the `.agent/rules/` tier + ADRs |
| `epistemic-status.md` | memory frontmatter (`type:`, `merge_class`) + ADR/pattern `status:` |
| `claims/` | `patterns/` (`proven_in`/`proven_date`) + ADR Context + PDR-016 |
| `lemmas/` | `patterns/` + `distilled.md` (all six candidate lemmas already homed) |
| `attractor-state.md` | `AGENT.md` + `orientation.md` (the plan concedes the overlap) |
| graph edge types + reviewers | ADR-200/201 + the specialist-reviewer estate |

Five of the six surfaces are already owned. A new top-level tree with
`invariants/`, `claims/`, `lemmas/` **structurally pulls toward the
"rival source of truth" its own #1 non-goal forbids** — nothing enforces
subordination (PDR-105 reference-direction inversion; the existing
`governance-claim-needs-a-scanner` pattern names the unchecked-prose-claim
failure mode). Drift would arrive through ordinary editing, not malice.

## Fairness — closed as *overtaken*, not *wrong*

The proposal is honestly status-tagged (`research` + `future`, commits nothing),
deference-minded (it explicitly waits on the graph pilot), and unusually
self-aware (its non-goals anticipate the rival-doctrine, onboarding, and
ADR-duplication risks; the vocabulary doc pre-translates the philosophical
framing). The proposal itself concedes the surfaces are "already implicit" and
argues for *explicitness*, not novelty. The root cause of the disposition is
simply that it predates ADR-200. The "violates its own non-goal" framing is
softened accordingly to "the structure *pulls toward* it."

## Surviving kernels (carried forward, not discarded)

1. **Explicit epistemic-status vocabulary** — the one real gap (status is
   currently implicit in which surface a claim lives in). Candidate input to
   ADR-200's discovered node-status facet / PDR-016 — not a parallel layer.
2. **Evidence + counterevidence + last-reviewed envelope** on load-bearing
   claims — folds into the idea-node schema, where it gets a validator.
3. **A compact attractor-state orientation doc** — a separate, gated proposal,
   only if it proves it lowers grounding cost against the
   `directive-file-context-budget` and the ~80k reliably-loaded budget.

The reasoning-graph edges are subsumed by ADR-200 and must follow its
discover-from-corpus method, not a hand-authored list.

## Carry-over

See the carry-over note under
`.agent/research/agentic-engineering/` (epistemic-status + attractor-state,
candidate inputs to ADR-200 / PDR-016, gated). PR #128 is closed with this
report cited as the rationale; branch `docs/formal-substrate-recurrence` and its
commits remain, and the PR can be reopened if the disposition is revisited.

## Vocabulary document — note

The `formal-substrate-vocabulary.research.md` doc (a 368-line table translating
"reincarnation / soul / immortality / sanctuary" into
"recurrence / attractor / resilience") should not become a permanent repo
artefact. Its hygiene job is one-time; committed, it teaches the metaphor as
canon. Its sole durable kernel — that durable claims should carry epistemic
status and not over-claim — is captured in kernel (1) above.
