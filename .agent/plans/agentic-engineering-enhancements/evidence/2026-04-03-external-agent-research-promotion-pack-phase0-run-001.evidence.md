# Evidence Bundle

## 0. Storage Convention

- Directory: `.agent/plans/agentic-engineering-enhancements/evidence/`
- File: `2026-04-03-external-agent-research-promotion-pack-phase0-run-001.evidence.md`

## 1. Run Context

- Run ID: `run-001`
- Plan: `agentic-engineering-enhancements shortlist implementation`
- Workstream/Phase: `phase-0 research-promotion-pack pilot`
- Author: `Codex`
- Date (YYYY-MM-DD): `2026-04-03`

## 1A. External Concept Adoption Register

| Candidate ID | Local Problem | Current Oak Analogue | Difference Type | Likely Landing Zone | Confidence | Proof Needed | Disconfirming Case | Blast Radius | Reversibility | Natural Home |
|---|---|---|---|---|---|---|---|---|---|---|
| A-001 | External research can produce attractive but under-specified recommendations | Evidence bundles, research notes, adoption plans | capability-gap | `evidence-bundle.template.md`, collection README | high | Use the register on multiple proposals and check whether placement is clearer | Current evidence bundles already prevent vague promotion work | low | high | template + collection guidance |
| A-002 | Delegated work quality depends too much on hand-authored context | `parallel-agents`, reviewer invocation guidance, takeover bundles | boundary | `parallel-agents`, `invoke-code-reviewers`, `session-tools.ts` | high | Pilot on several bounded handoffs and compare clarification loops | Existing handoffs already reintegrate cleanly with no repeated churn | low-medium | high | skill + directive + tool output |
| A-003 | Agent-infrastructure diagnostics are split across multiple surfaces | `claude-agent-ops`, portability checks, hook policy, support matrix | capability-gap | `agent-tools` `health` command | moderate-high | Seed known drift and confirm the new summary-first probe catches it quickly | Existing operator tooling is already enough to diagnose drift quickly | medium | medium-high | CLI + README |

## 2. Claim Register

| Claim ID | Claim Class | Claim Statement | Evidence Refs | Status |
|---|---|---|---|---|
| C-001 | doctrine-promotion | The new adoption register can carry three research-derived proposals without inventing a second template family. | E-001, E-002 | verified |
| C-002 | delegation-contract | Delegation snapshot and reintegration guidance fit the existing Oak surfaces without importing worker-mesh doctrine. | E-003, E-004 | verified |
| C-003 | health-surface | A local health probe can aggregate repo-facing drift checks without introducing telemetry or remote-control doctrine. | E-005, E-006 | verified |

## 3. Evidence Index

| Evidence ID | Type | Summary | Location |
|---|---|---|---|
| E-001 | file-span | research bundle identifies missing local landing-zone and ownership artefacts | `.agent/research/developer-experience/novel/2026-04-02-external-agent-system-semantic-atlas-specialist-consensus-and-final-sweep.md` |
| E-002 | file-span | existing evidence bundle template is minimal and can absorb the adoption register | `.agent/plans/agentic-engineering-enhancements/evidence-bundle.template.md` |
| E-003 | file-span | second-pass atlas identifies snapshot-first delegation discipline as a local transfer candidate | `.agent/research/developer-experience/novel/2026-04-02-external-agent-system-semantic-atlas-second-pass.md` |
| E-004 | file-span | worker reintegration trace isolates flush, resume, and handoff boundaries worth keeping | `.agent/research/developer-experience/novel/2026-04-02-external-agent-system-semantic-atlas-worker-mesh-lane-reintegration-trace.md` |
| E-005 | file-span | extension/ops surfaces identify a health-probe-style diagnostic surface as especially transferable | `.agent/research/developer-experience/novel/2026-04-02-external-agent-system-semantic-atlas-extension-and-ops-surfaces.md` |
| E-006 | file-span | existing repo tooling already holds the underlying diagnostic signals | `agent-tools/src/bin/claude-agent-ops.ts`, `scripts/validate-portability.mjs`, `.agent/memory/executive/cross-platform-agent-surface-matrix.md` |

## 4. Command Evidence

| Command | Result | Output Ref |
|---|---|---|
| `rg -n "Transfer candidates\|Consensus asks\|Portable lessons" .agent/research/developer-experience/novel/*.md` | pass | E-001, E-003, E-005 |
| `sed -n '1,260p' .agent/plans/agentic-engineering-enhancements/evidence-bundle.template.md` | pass | E-002 |
| `sed -n '1,260p' agent-tools/src/bin/claude-agent-ops.ts` | pass | E-006 |

## 5. File-Span Evidence

- E-001: specialist consensus asks for local landing zones, ownership, consumer
  registers, evaluation surfaces, and doctrine exclusions.
- E-002: the template already carries run context, claims, evidence refs, and
  risk notes, so the adoption register is an additive extension.
- E-003: second pass names snapshot-first delegation discipline as a local
  transfer candidate.
- E-004: the reintegration trace distinguishes mailbox delivery from true
  parent-lane reintegration.
- E-005: the extension/ops brief names a unified health probe as the most
  transferable operational lesson.
- E-006: the repo already exposes agent dashboard, portability checks, and
  support-matrix truth, so the health probe is aggregation rather than a new
  telemetry system.

## 6. Behaviour and Risk Notes

- Behaviour change summary: this pilot turns three research-derived concepts
  into decision-complete Oak rows with proof and disconfirming cases.
- Known uncertainty: the pilot proves the format fits the work; it does not yet
  prove that the register reduces churn across multiple future sessions.
- Risk impact: low — this is additive guidance plus one evidence artefact.
- Evidence level: direct repo evidence plus Oak-side inference grounded in the
  local research bundle.

## 7. Open Items

- A-001 needs live reuse across more than one implementation session before it
  can be treated as settled doctrine.
- A-002 still needs comparison data from real delegated handoffs.
- A-003 still needs seeded failure drills against the new `health` command.

## 8. Merge-Readiness Check

- [x] Every non-trivial claim has at least one evidence reference
- [x] No "tests pass" claim without command/output evidence
- [x] Behaviour claims anchored to test or runtime evidence
- [x] Remaining uncertainty is explicit and tracked
- [x] Research-derived proposals include an adoption-register row with proof and
  a disconfirming case
