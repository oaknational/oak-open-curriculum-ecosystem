# Pass-1 Smoke-Run Validation (5 plans)

> 2026-06-21. Orchestrator: Hobby wakes Halo (3ebdb8). Workflow run `wf_71bdbaed-484`
> (18 agents, ~781k subagent tokens, ~271s). Purpose: validate the Pass-1 pipeline,
> the StructuredOutput schemas, the model tiering, the HALT-dont-fabricate clause, and
> host behaviour before the full fan-out. **Verdict: pipeline validated; clear to scale.**

## Plans exercised (chosen for variety)

| Plan | lane / fm | classification | conformance | specialist | high-stakes verdicts |
| --- | --- | --- | --- | --- | --- |
| agent-tools-test-io-compliance | current / fm | keep | major-drift | test (5) | — |
| agent-coordination-cli-ergonomics… | future / fm | keep | major-drift | architecture (6) | — |
| comms-corpus-research-and-rotation | active / fm | keep | major-drift | architecture (6) | 2: **1 survives, 1 refuted** |
| adapter-generation | future / no-fm | keep | no-frontmatter | architecture (5) | — |
| agent-classification-taxonomy | future / no-fm | keep | no-frontmatter | architecture (7) | 1: survives |

## What validated

- **Reads first-hand:** 5/5 plans read; `unreadable: []`, `null_holistic: []` — the default
  workflow agent has Read access (no agentType override needed).
- **Schemas:** all four StructuredOutput schemas validated; no schema failures.
- **Tiering:** Sonnet reads / Opus verify worked; ~3.6 agents/plan (matches the ~3.4 estimate).
- **Conditional specialist routing:** test-signal plan -> test specialist; the rest -> architecture.
- **Scoped adversarial verify has teeth:** fired only on high-stakes claims (3 across 5 plans),
  and **refuted** one ("manifest still points 4x at old homes") while another survived
  ("WS7 untrack unsafe — hard gate"). The gate kills over-claims, exactly as designed.
- **Conformance lens:** surfaced emergent frontmatter keys V0 does NOT classify (`isProject`,
  `Domain`) and correctly flagged the two no-frontmatter plans — lens-completeness signal for V1.

## Scale signal for the full survey

~781k tokens / 18 agents ≈ **43k tokens/agent** -> the full ~1,000-agent survey is roughly
**~40M tokens, ~1.5–2h wall-clock** across 4 batches. Sanctioned under the session's ultracode
directive (cost is not a constraint; exhaustive correctness is the goal).

## Note for V1 / cost-optimisation (deferred, not blocking)

Every conformance agent re-reads the full V0 lens (~550 lines). Under ultracode this is accepted
(correctness over cost). A future optimisation: pass a compact lens-digest instead of the full doc.
