# Web/API GDPR Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

The repo needs a way to reason specifically about **personal-data obligations at
web/API boundaries**. Broad privacy doctrine and broad security doctrine are
both necessary, but neither is a complete substitute for this narrower lens.

Without a dedicated **narrow-remit web/API GDPR specialist**, agents can:

- discuss privacy at a high level while missing API-level obligations and data
  contract implications
- validate framework wiring while missing how consent, deletion, export, or
  retention semantics should appear at the boundary
- reason about exploitability while under-specifying how personal-data handling
  should be represented, constrained, or documented in API behaviour

This specialist is intentionally **narrow-remit**. Its remit is web/API
personal-data handling and GDPR/UK GDPR-style obligations at those boundaries.
That narrowness is separate from review depth.

## Capability Shape

This is a future **agent capability**, not a reviewer-only construct.

- **`web-api-gdpr-reviewer`** would provide read-only assessment of
  personal-data handling and GDPR/UK GDPR concerns at web/API boundaries.
- **`web-api-gdpr-expert`** would support planning, research, and advisory work
  during implementation.
- The situational rule would make the capability discoverable whenever API
  contracts, consent, retention, deletion/export, or data-rights semantics are
  in scope.

**Remit note**: This is a **narrow-remit** specialist. Remit breadth is
independent of engagement depth. A narrow-remit specialist may still require
deep reasoning and live-docs consultation.

This capability should remain compatible with the broader agent model where
agents are not synonymous with reviewers. The reviewer persona is one
instantiation; the companion skill supports advisory and research work; the
situational rule makes the capability discoverable.

## Scope

### In scope

- Personal-data handling in API and web-boundary contracts
- Data minimisation in request and response schemas
- Consent, preference, and purpose-related boundary semantics where relevant
- Deletion, export, rectification, and related data-rights surfaces
- Retention and expiry signalling expressed through APIs or adjacent contracts
- Boundary documentation and behaviour for personal-data processing
- Personal-data handling patterns in an education context, including heightened
  sensitivity where learner or child-related data may be involved

### Out of scope

- Broad privacy-by-design and organisation-wide privacy posture
  (`privacy-reviewer`)
- Broad security posture or exploitability doctrine
  (`cyber-security-reviewer`, `security-reviewer`)
- General web/API attack-surface hardening (`web-api-security-reviewer`)
- Framework-specific implementation correctness (`express-reviewer`,
  `clerk-reviewer`, `mcp-reviewer`)
- Generic legal review beyond engineering-facing GDPR/UK GDPR implementation
  concerns at the boundary

## Doctrine Hierarchy

1. **Current official GDPR/UK GDPR and privacy-authority guidance** — for
   example ICO and EDPB guidance relevant to API/data-boundary behaviour
2. **Official web/API platform documentation where it affects data handling** —
   framework and protocol docs that shape how data obligations surface in
   requests, responses, sessions, and integration contracts
3. **Repository privacy and security docs** — especially
   `docs/governance/safety-and-security.md`, ADR-005, and other relevant ADRs
4. **Existing implementation** — evidence of the current state, not authority

## Deployment Context

**API and integration boundaries** are the default context:

- Express-based HTTP services
- MCP-over-HTTP and adjacent integration surfaces
- Tool outputs and API payloads that may contain personal data
- Documentation and integration contracts consumed by both humans and AI agents

## Deliverables

1. Canonical reviewer template:
   `.agent/sub-agents/templates/web-api-gdpr-reviewer.md`
2. Canonical skill: `.agent/skills/web-api-gdpr-expert/SKILL.md`
3. Canonical situational rule:
   `.agent/rules/invoke-web-api-gdpr-reviewer.md`
4. Platform adapters (Claude, Cursor, Gemini CLI, Codex)
5. Discoverability updates
6. Validation

## Overlap Boundaries

- **`web-api-gdpr-reviewer`** owns narrow personal-data obligations and
  GDPR/UK GDPR implementation concerns at web/API boundaries. It does **not**
  own broad privacy posture, exploitability posture, or general web/API
  attack-surface hardening.
- **`privacy-reviewer`** owns broad privacy-by-design, retention,
  minimisation, and trust posture. It does **not** own boundary-specific
  GDPR/UK GDPR implementation detail.
- **`web-api-security-reviewer`** owns general HTTP/API attack surface and
  endpoint hardening. It does **not** own personal-data compliance semantics.
- **`security-reviewer`** owns the practical default security/privacy
  exploitability review. It does **not** own the narrow API/data-rights and
  retention-semantics focus.
- **`express-reviewer`**, **`clerk-reviewer`**, and **`mcp-reviewer`** own
  framework or protocol correctness. They do **not** own boundary-level
  personal-data obligations and semantics.

## Promotion Trigger

This plan promotes to `current/` when:

1. Personal-data handling at API or web boundaries becomes an active delivery
   concern
2. Consent, deletion/export, retention, or data-rights semantics need a
   narrower specialist than the broad privacy capability
3. No conflicting work is in progress on the agent artefact layer
