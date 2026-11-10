# Session brief: comparing Hermes Agent with the Practice

As of 2026-11-10. Owner: Jim. Author: Swift holds Aether (Claude Code cloud session `01Duocji`),
the seat that wrote the Hermes study this brief builds on.

## How to read this brief

The owner's quoted words bind. Everything else here is the author's proposal, written by the
seat whose account of Hermes is one of the two things being compared. Re-derive each step
against the live rules before following it, and treat the author's framing of Hermes as an input
to test, not a settled lens. Where a step conflicts with a live rule, the rule governs and the
session reports the conflict.

## The owner's words, verbatim

- 2026-11-10, commissioning the Hermes study: "The eventual task is to compare the understanding
  we develop about Hermes to a comparison with the Practice, however I want us to understand
  Hermes in its own terms first, so keep the Practice comparison out of the exploration for now"
- 2026-11-10, after the study: "To me it seems like DSPy/GEPA might be the heart of the self
  improvement in Hermes? Explore and challenge that perspective"
- 2026-11-10, after pull request 395 merged: "395 is merged. Switch to the `engraph` branch, and
  find that report and other recent research and reports on learning and self-improvement
  systems in the repo"
- 2026-11-10, opening this phase: "I do want that session opened, please prepare for it, and as
  part of that make sure that everything important from this session is made durable"; "Once
  that is done I will compact this session, and we can begin the next phase"

The gate the Hermes study set for this session has two parts and both are met: pull request 395
merged (merge commit `8af1b0fc2` on `engraph`), and the owner's go-ahead (the fourth quote).

## What the owner has not yet said

The owner has named the task, a comparison, and nothing about its purpose, its depth, its
questions or its output. Those are owner facts. The session's first act after grounding is to
ask for them in dialogue, not to infer them: what decision or change the comparison is meant to
serve, which of the two systems is the one being examined in the light of the other, and what
the owner wants to hold at the end. A scope block (`GOAL`, `IN`, `OUT`) comes after that answer.

## Inputs

### The Hermes side (merged, in `.agent/research/agentic-engineering/hermes-agent-v0.23.0-2026-11/`)

| File | Use |
| --- | --- |
| `synthesis.md` | Start here. Status `provisional`, what it permits and forbids, twelve verdicts, and section 2.3 on DSPy and GEPA. |
| `memory-learning-architecture.md` | Stores, writers, triggers, re-entry, controls, retention, evidence of effect, the offline loop, Hermes's named failure modes, and section 10. |
| `architecture-map.md` | Subsystems, one traced request, the package graph, extension points. |
| `evidence-log.md` | The claims register, E-001 to E-043. Rely on rows in bin **Fact**; re-read rows marked Open, Assumption to verify or `[unverified]` before leaning on them. |
| `charter.yaml` | Scope and frames, revision 3. |
| `method-instruments.md` | The scripts behind the measurements, for reproduction. |
| `brief.md`, `sealed-hypotheses-ledger.md` | The commissioning brief and the fifteen prior claims, with outcomes in `evidence-log.md` section 6. |

What the study establishes, in one paragraph. Hermes at v0.23.0 has two designs for improving
itself that do not touch. In the runtime, the model writes memory entries and skills during a
turn, a second agent reviews the conversation after the reply on counters, and a curator ages
and archives skills on a timer; all of this runs automatically and none of it is measured. In a
separate repository, a script optimises one skill's text against a score on a held-out set; it
runs only when a person starts it, its named optimiser has not been shown to run, and no code
carries its result back. The study's status forbids reading any of this as observed behaviour.

Three limits to carry. The study read code and documents and ran nothing. The pinned Hermes
clone is shallow, so the study cannot date when a mechanism arrived. And Hermes claims a
weight-training pipeline that the study did not read.

### The Practice side (found by search on `engraph`, 2026-11-10; openings read only)

| Last commit | Document | Why it is a candidate input |
| --- | --- | --- |
| 2026-06-23 | `docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md` | The decision record for the Practice's own improvement loop |
| 2026-09-28 | `.agent/practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md` | Names the learning path as capture, distil, graduate, enforce |
| 2026-10-04 | `.agent/practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md` | Knowledge-flow discipline |
| 2026-10-04 | `.agent/reports/agentic-engineering/practice-system-review-2026-10.md` | How two estates plan, decide, implement, review, deliver and learn, read as one system |
| 2026-09-09 | `.agent/research/agent-capacities-2026-09-09/report.md` | A 310 KB research record on adaptive capacities; opens by separating remembering, learning and improving |
| 2026-08-02 | `.agent/plans/strategic/outcome-informed-practice-learning.plan.md` | A strategic plan whose kernel is that "The system's missing centre is outcome-informed human learning" |
| 2026-09-02 | `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-09-02.md` | An archive-scale synthesis of the capture buffer's history |
| 2026-10-02 | `.agent/reports/agentic-engineering/2026-09-30-two-estate-consolidation-retrospective.md` | Asks whether a consolidation curated knowledge or chased numbers |
| 2026-09-24 | `.agent/reports/agentic-engineering/2026-09-24-records-that-outrun-their-evidence-retrospective.md` | A retrospective on records that claimed more than their evidence |
| 2026-08-05 | `.agent/reports/vendor-memory-graduation-audit-2026-08-05.md` | An audit of per-user platform memory for learning not yet in the repository |
| 2026-11-06 | `.agent/research/team-of-one-agentic-sdlc-and-the-practice-2026-11-06.md` | A recent comparison of another system with the Practice; a precedent for form |
| 2026-10-27 | `.agent/research/practice-nature-and-lights-on-comparison-2026-10-22.md` | Another recent comparison; a precedent for form |

The search covered file names and content under `.agent/research`, `.agent/reports`,
`.agent/analysis`, `.agent/plans`, `.agent/prompts`, `docs`, the decision records and the
directives, for learning, memory, self-improvement and related terms (135 name matches, 123
content matches). The author read only each document's opening. Which of them are current
doctrine and which are historical is for the session to establish from the canonical surfaces.

## Proposals for the session to test

1. **Describe the Practice by the same discipline before comparing.** The Hermes account was
   written from code first, then Hermes's own words, with every claim cited. A comparison of
   that account with an uncited, from-memory picture of the Practice would compare evidence with
   belief. The proportionate form is for the owner to size: it may be a cited account of the
   Practice's learning mechanisms from the live rules, skills, decision records and tooling, or
   it may be that the documents above already serve.
2. **Guard against the lens.** The Hermes study's categories (store, writer, trigger, re-entry,
   control, retention, evidence of effect, offline loop, named failure modes) are a convenient
   frame and were built for Hermes. Using them unexamined would find in the Practice only what
   Hermes has. Hold at least one frame that starts from the Practice's own terms, and one that
   starts from neither, for example the distinctions the agent-capacities record draws.
3. **Keep the two authority classes.** For what each system intends, its own documents; for what
   each does, its code and tooling. The Practice can be observed running in this repository,
   which Hermes could not; say which claims rest on observation and which on reading.
4. **Carry the finding that framed the study's end.** Whether a system measures the effect of
   what it learns was the sharpest line the Hermes study drew. It is a candidate question, not a
   required one.
5. **Same-author caution.** This brief, the Hermes study and any comparison written by a
   successor of this seat share one lineage. Independent challenge matters more here than it did
   for the study; the session should say how it will get it.

## Inherited constraints and environment facts

- The session carries three repositories. The two Hermes clones are the owner's forks, pinned
  and clean at `/home/user/hermes-agent` (detached at `v0.23.0`) and
  `/home/user/hermes-agent-self-evolution`. Nothing has been written to either, and the study's
  rule stands unless the owner lifts it: no Hermes code is run, and no commit, branch, push or
  GitHub write goes to a Hermes repository. The harness names a work branch in all three
  repositories; in the two forks it is not used.
- Work in this repository goes on the harness branch, restarted from `engraph` after each merge,
  to a pull request against `engraph`; pushes use `HUSKY=0` with the four in-session checks in
  `.agent/claude-harness-integrations/cloud-environment.md`, and no second push before the
  required check concludes.
- `dspy.ai` is outside the session's allowed network domains. Package registries and public
  GitHub reads are reachable.
- `agent-tools review-cost survey` cannot run in a cloud session; the ledger row is written from
  the connector's review-thread listing.
- Reviewer bots on pull request 395 raised one finding class three times: a Fact row whose
  sources do not cover its whole claim. Any register the comparison writes should be checked for
  that class before its first push.

## Method notes from the study that transfer

- A permalink that resolves is not a quotation that matches. Check the quoted words at the cited
  lines mechanically; nine of the first 122 citations were a few lines off.
- A sentence with "none", "never" or "only" in it is the cue for the cheapest sweep that could
  refute it, with a known positive for the probe.
- In a small body of material, read every artefact before giving a verdict on it.
- After a first synthesis, ask which conclusion the starting point made inevitable.
- A subagent given questions and never the seat's answers found what the seat had missed.

## What this brief does not do

It does not begin the comparison, state a hypothesis about how the two systems relate, or
describe the Practice. One line in the study's napkin entry said a comparison thought had
occurred and was left undeveloped; no such thought was recorded anywhere, and the session
should not look for one.
