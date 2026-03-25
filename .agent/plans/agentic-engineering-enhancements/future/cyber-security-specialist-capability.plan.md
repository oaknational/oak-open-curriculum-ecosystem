# Cyber Security Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

The repo already has a useful `security-reviewer`: a cross-cutting, practical,
exploitability-first security and privacy reviewer that should remain the
default security specialist for day-to-day work.

What it does not yet have is a **broad-remit cyber security specialist** for
the deeper doctrine, posture, and system-trade-off questions that sit behind
individual exploitability findings. Without that broader capability, agents can:

- focus on immediate vulnerabilities but miss defence-in-depth gaps
- under-specify threat models and trust-boundary assumptions
- treat supply-chain, dependency, and secret-lifecycle concerns as ad hoc
  hygiene rather than part of one security posture
- miss the difference between "this is exploitable now" and "this weakens the
  system's long-term security architecture"

This specialist fills that gap. It is a **broad-remit** security capability.
That breadth is separate from review depth: the future taxonomy must not
conflate **broad vs narrow remit** with **deep vs focused engagement**.

## Capability Shape

This plan is about an **agent capability**, not just a reviewer persona.

- **`cyber-security-reviewer`** would provide read-only specialist assessment
  against current cyber-security doctrine.
- **`cyber-security-expert`** would provide active research, planning, and
  advisory support during implementation.
- The situational rule would make the capability discoverable when broad
  security-posture concerns are in scope.

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

- Broad security posture and defence-in-depth assessment
- Threat modelling and trust-boundary analysis
- Secure-by-default patterns across services, SDKs, CLIs, and platform edges
- Secret lifecycle and credential-hygiene strategy
- Dependency and supply-chain security posture
- Security observability posture (what should or should not be emitted, stored,
  or correlated)
- Interaction between multiple security controls across packages and apps
- Architectural security trade-offs that exceed a single framework or protocol

### Out of scope

- The default exploitability-focused security pass on ordinary changes
  (`security-reviewer` keeps that role)
- Narrow HTTP/web/API boundary hardening (`web-api-security-reviewer`)
- Privacy-governance correctness, retention policy, and privacy-by-design
  doctrine (`privacy-reviewer`)
- Web/API personal-data compliance details (`web-api-gdpr-reviewer`)
- Framework-specific implementation correctness for Express, Clerk, MCP, or
  Elasticsearch specialists
- Generic code quality, architecture, or type-system concerns

## Doctrine Hierarchy

1. **Current official cyber-security doctrine** — for example OWASP ASVS,
   OWASP Top 10, NCSC secure-design guidance, NIST secure software and
   supply-chain guidance, and other primary sources relevant to the surface
   under review
2. **Official vendor and platform security documentation** — the security
   guidance published by the relevant framework, cloud, SDK, or dependency
3. **Repository ADRs and governance docs** — especially
   `docs/governance/safety-and-security.md` and security-relevant ADRs
4. **Existing implementation** — evidence of the current state, not authority

## Deployment Context

**Monorepo security posture across multiple runtime surfaces**. Key constraints:

- Express-based HTTP transport and MCP surfaces
- SDKs and CLIs used by both humans and AI agents
- Security-sensitive configuration resolved at startup and carried through DI
- Read-only by default remains a core safety posture
- The repo operates in an education context, so trust and safe defaults matter
  beyond narrow exploitability

## Deliverables

1. Canonical reviewer template:
   `.agent/sub-agents/templates/cyber-security-reviewer.md`
2. Canonical skill: `.agent/skills/cyber-security-expert/SKILL.md`
3. Canonical situational rule:
   `.agent/rules/invoke-cyber-security-reviewer.md`
4. Platform adapters (Claude, Cursor, Gemini CLI, Codex)
5. Discoverability updates
6. Validation

## Overlap Boundaries

- **`cyber-security-reviewer`** owns broad security posture, defence in depth,
  supply-chain posture, threat models, and control interaction. It does **not**
  own the default exploitability triage, narrow HTTP/API hardening, or
  privacy-governance correctness.
- **`security-reviewer`** owns the practical default security/privacy review,
  exploitability, and auth/secrets/input-risk triage. It does **not** own the
  deeper broad-remit doctrine and posture lens.
- **`web-api-security-reviewer`** owns narrow web/API attack-surface and
  boundary hardening. It does **not** own broad security posture across the
  whole repo.
- **`privacy-reviewer`** owns privacy-by-design and privacy-governance
  correctness. It does **not** own security posture or exploitability.
- **Architecture reviewers** own structural dependency and boundary trade-offs.
  They do **not** own security doctrine or control sufficiency.

## Promotion Trigger

This plan promotes to `current/` when:

1. Significant security architecture, threat-model, supply-chain, or
   secret-lifecycle work is scheduled
2. The gateway/roster work needs an explicit broad-remit security capability
   rather than relying only on the current `security-reviewer`
3. No conflicting work is in progress on the agent artefact layer
