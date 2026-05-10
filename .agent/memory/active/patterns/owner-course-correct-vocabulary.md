---
name: Owner Course-Correct Vocabulary
use_this_when: Receiving an owner message that contains a course-correct token, or noticing a self-trigger phrase in your own draft prose; both signal a re-grounding moment that maps to a specific canonical doctrine surface.
category: agent
polarity: pattern
proven_in: 2026-05-10 Claude insight report (`.agent/reference-local/claude-insight-reports/2026-05-10-full-corpus/`) §08-communication-style.md (owner-side corpus) and §06-frictions-and-anti-patterns.md + §09-agent-action-rules.md (agent-side self-triggers); patterns originally surfaced as enforced rules and feedback memories before consolidation here.
proven_date: 2026-05-10
related_pdr: PDR-027
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Misreading a one-word owner message as low-signal; or shipping a draft whose vocabulary betrays the very doctrine the agent has just read; or ignoring a self-trigger phrase as a stylistic tic when it is the diagnostic that the agent is operating under a wrong frame"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat. When an owner-side
> phrase from §Owner-side course-correct phrases lands in chat, OR a
> self-trigger phrase from §Agent-side self-trigger phrases appears in
> your own draft, treat it as a discrete re-grounding event whose
> response is named in this file.

## Why this pattern exists

A course-correct phrase from the owner is rarely a stylistic remark.
It is a structural signal that the work has drifted from the named
doctrine surface and the agent is expected to stop the current beat,
re-ground, and resume from the surface the phrase points at. A
self-trigger phrase in the agent's own draft is the same shape from
the inside: the prose has drifted; the trigger appears; the agent
must stop drafting and re-read the named surface before continuing.

The pairing matters. Owner-side phrases without an internal trigger
table mean every correction must come from outside the agent.
Self-trigger phrases without a paired owner vocabulary mean every
self-catch is unsupported when the owner intervenes. Holding both
together is what makes the metacognition workflow load-bearing
rather than ceremonial.

## Owner-side course-correct phrases

When one of these appears in an owner message, treat it as the start
of a re-grounding event, not a tone marker. The named action is the
correct response in every case; lifting the prior beat and continuing
is the failure mode.

| Phrase                       | Meaning                                                | Re-grounding action                                                                       |
|------------------------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `stop`                       | Terminate this beat now                                | Halt mid-action; do not continue the current draft or tool call; await further direction. |
| `wait`                       | Pause; you have drifted                                | Stop drafting; read the last 3–5 owner messages and state what you understood is the goal. |
| `first principles`           | Reframe from the substrate                             | Re-read `.agent/directives/principles.md`; restart the analysis from the principle layer. |
| `root cause`                 | Stop chasing symptoms                                  | Halt the current fix; identify the underlying invariant violation; treat the symptom as evidence, not as the work item. |
| `ultrathink` / `think hard`  | Go deeper before the next move                         | Pause output; produce a written analysis surface (plan, napkin entry, or comms-event) before the next mutation. |
| `step back and evaluate`     | Re-ground at the work-shape level                      | Stop the current execution; re-read the active plan or thread record; verify the current beat is still the right beat. |
| `jeesus` (or similar strong reaction) | A named mechanism is being ignored             | Identify the mechanism by name from the recent doctrine surfaces (`MEMORY.md`, `.agent/rules/`, `.agent/directives/`); apply it before resuming. |

Affirmation phrases ("exactly", "great", "perfect") are tracked
separately in the pending-graduations register; they are calibration
signals, not re-grounding triggers, and warrant their own surface
once corroborated across regeneration windows.

## Agent-side self-trigger phrases

When one of these appears in your own draft prose or internal plan,
treat it as a diagnostic. The phrase indicates the named anti-pattern
is forming. The named surface holds the canonical cure.

| Self-trigger phrase                                  | Diagnostic of                                                            | Surface to re-read                                                       |
|------------------------------------------------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| "I'll just bypass the hook with `--no-verify`"       | Hook failures treated as obstacles rather than questions                 | `.agent/rules/no-verify-requires-fresh-authorisation.md`; `feedback_hook_failures_are_questions` |
| "Let me delete `.git/index.lock`"                    | Foreign lock from a parallel agent being misread as stuck state          | `feedback_no_delete_git_lock`; `feedback_no_lock_wait_loops`             |
| "I'll add `as any` for now"                          | Type assertion at a boundary where schema flow is broken                 | `.agent/rules/strict-validation-at-boundary.md`; type-expert dispatch    |
| "Cheap option vs proper option"                      | Cheap-cure framing entering an option list                               | `feedback_no_cheap_cure_option`; `.agent/rules/no-hedging-vocabulary.md` |
| "Maybe", "could", "perhaps"                          | Hedging vocabulary as a softening reflex                                 | `.agent/rules/no-hedging-vocabulary.md`                                  |
| "Should I run this?" (after the owner already said go) | Re-confirmation drift; converting authorisation into perpetual ask     | `feedback_no_responsibility_passback`                                    |
| "Trim", "reduction", "savings", "contraction" in doctrine work | Optimisation vocabulary supplanting curation vocabulary        | PDR-003 §Decision-2; napkin entry on holding-vs-reading governance       |
| "Apply all of X" framing for a redundant surface     | Cycle-count inflation; thoroughness-theatre                              | This file's first-question audit pattern; `patterns/scope-as-goal.md`    |
| Verbatim phrasing from `principles.md` in your draft | Innate-immunity hook trip-list violation under any citation form         | Paraphrase + cite by §heading; do not quote                              |

## How this pairs with `metacognition.md`

The metacognition directive at `.agent/directives/metacognition.md`
is the canonical re-grounding workflow. This pattern names the
specific phrases that should invoke that workflow rather than passing
through unnoticed. The workflow itself is unchanged; the contribution
of this pattern is the trigger surface.

Workflow on owner-side phrase:

1. Halt the current beat.
2. Acknowledge the phrase explicitly (one sentence) so the owner sees
   the signal landed.
3. Apply the re-grounding action named in the table above.
4. Re-read the surface the phrase pointed at, in full.
5. Resume only after the action completes.

Workflow on agent-side self-trigger:

1. Stop drafting.
2. Identify the diagnostic from the table above.
3. Re-read the named surface.
4. Re-draft from that surface, not from the prior draft.
5. Verify the trigger phrase is absent from the new draft before
   continuing.

## Cross-references

- `.agent/directives/metacognition.md` — the re-grounding workflow
  this pattern feeds.
- `.agent/rules/no-hedging-vocabulary.md` — the canonical banned-set
  for hedging vocabulary, named in several self-trigger entries.
- `feedback_no_speed_pressure` (auto-memory) — the urge to skip the
  re-grounding action when an owner-side phrase appears is the named
  diagnostic; apply the action precisely *because* the urge appeared.
- `.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md`
  — re-grounding events frequently re-anchor on the active thread
  record; the identity discipline supports correct re-grounding.

## What this pattern is not

- Not a new doctrine layer; the named cures already exist in the
  rules / directives / feedback memories cited above. The contribution
  is the trigger-to-surface mapping.
- Not a prescription for tone-matching. Owner-side phrases are read
  for structural signal, not for emotional reading.
- Not a complete catalogue. New self-trigger phrases should accrue
  here as they are identified across sessions; the pattern is
  append-extensible.

## Source

The owner-side phrase set was surfaced from §08 of the
2026-05-10 insight report. The agent-side self-trigger set was
surfaced from §06 + §09 of the same report. The disposition routing
that brought both into one file lives in
`.agent/plans/agentic-engineering-enhancements/current/claude-insight-report-2026-05-10-disposition.plan.md`
(§Disposition Ledger, items 9 and 20). The integration shape (single
pattern, two paired sections) was a Phase 1 design decision in that
plan.
