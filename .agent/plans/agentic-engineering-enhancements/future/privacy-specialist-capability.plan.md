# Privacy Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

The repo already recognises privacy as a first-class concern:

- `docs/governance/safety-and-security.md` treats privacy by design as a core
  principle
- ADR-005 records automatic PII scrubbing as an architectural decision
- `security-reviewer` includes privacy and data-minimisation concerns in its
  practical exploitability-focused remit

What is still missing is a **broad-remit privacy specialist** whose primary
concern is privacy correctness, privacy-by-design trade-offs, and the ongoing
governance of data handling across the system.

Without that capability, agents can:

- reduce privacy to "don't leak PII" and miss minimisation, retention, and
  purpose-limitation questions
- reason well about security exploitability but weakly about user trust and
  privacy posture
- miss the educational and potentially child-adjacent sensitivity of some data
  handling contexts
- under-specify how logs, traces, prompts, and tool outputs should handle
  personal or sensitive data over time

This is a **broad-remit** capability. Its breadth is about domain coverage and
governance, not about lightweight review depth.

## Capability Shape

This future capability should support more than review alone.

- **`privacy-reviewer`** would provide read-only privacy-by-design and
  privacy-governance assessment.
- **`privacy-expert`** would support research, planning, and advisory work for
  privacy-sensitive implementation and documentation decisions.
- The situational rule would make this capability discoverable when data
  minimisation, retention, observability redaction, or privacy posture is in
  scope.

**Remit note**: This is a **broad-remit** specialist. Remit breadth is
independent of engagement depth. A broad-remit specialist may still run a
focused engagement, and a narrow-remit specialist may still require deep
reasoning.

This capability should remain compatible with the broader agent model where
agents are not synonymous with reviewers. The reviewer persona is one
instantiation; the companion skill supports advisory and research work; the
situational rule makes the capability discoverable.

## Scope

### In scope

- Privacy-by-design assessment across the repo
- Data minimisation and purpose limitation
- Retention and deletion posture
- Redaction, scrubbing, and observability/privacy trade-offs
- Personal-data handling across prompts, logs, traces, tool outputs, and API
  payloads
- User trust implications of data exposure and system design
- Privacy posture in an education context, including sensitivity around
  children and learner-related data when relevant
- Consistency between privacy claims, architecture decisions, and system
  behaviour

### Out of scope

- Practical exploitability triage for auth, secrets, injection, or trust
  boundaries (`security-reviewer`)
- Broad security posture and defence-in-depth architecture
  (`cyber-security-reviewer`)
- Narrow HTTP/API personal-data obligations and GDPR/UK GDPR boundary semantics
  (`web-api-gdpr-reviewer`)
- Narrow HTTP/API attack-surface hardening (`web-api-security-reviewer`)
- Generic code quality, type safety, or framework correctness

## Doctrine Hierarchy

1. **Current official privacy and data-protection guidance** — for example ICO,
   EDPB, UK GDPR / GDPR authority guidance, NIST privacy guidance, and other
   primary privacy-by-design sources relevant to the issue
2. **Repository privacy and safety docs** — especially
   `docs/governance/safety-and-security.md` and
   `docs/architecture/architectural-decisions/005-automatic-pii-scrubbing.md`
3. **Repository ADRs and research** — local architectural trade-offs and
   documented privacy commitments
4. **Existing implementation** — evidence of current state, not authority

## Deployment Context

**Privacy across multiple surfaces** is the default context:

- APIs and MCP outputs may expose user or organisation-related data
- Logs, traces, and debugging flows create observability/privacy trade-offs
- AI agent workflows may handle user text and derived metadata
- The education context raises the importance of trust, restraint, and clear
  privacy posture

## Deliverables

1. Canonical reviewer template:
   `.agent/sub-agents/templates/privacy-reviewer.md`
2. Canonical skill: `.agent/skills/privacy-expert/SKILL.md`
3. Canonical situational rule:
   `.agent/rules/invoke-privacy-reviewer.md`
4. Platform adapters (Claude, Cursor, Gemini CLI, Codex)
5. Discoverability updates
6. Validation

## Overlap Boundaries

- **`privacy-reviewer`** owns broad privacy-by-design, minimisation,
  retention, redaction, trust, and privacy-governance correctness. It does
  **not** own exploitability triage, broad cyber posture, or narrow web/API
  GDPR details.
- **`security-reviewer`** owns the practical default security/privacy risk
  review and exploitability posture. It does **not** own broad
  privacy-governance and privacy-by-design doctrine.
- **`cyber-security-reviewer`** owns security posture, threat models, and
  defence in depth. It does **not** own privacy correctness or user-trust
  posture.
- **`web-api-gdpr-reviewer`** owns narrow personal-data obligations and
  boundary semantics in APIs. It does **not** own broad privacy posture across
  the repo.
- **`docs-adr-reviewer`** owns documentation accuracy and ADR drift. It does
  **not** own privacy correctness itself.

## Promotion Trigger

This plan promotes to `current/` when:

1. Significant privacy-by-design, retention, redaction, or personal-data
   handling work is scheduled
2. The future roster needs a broad-remit privacy capability distinct from the
   default `security-reviewer`
3. No conflicting work is in progress on the agent artefact layer
