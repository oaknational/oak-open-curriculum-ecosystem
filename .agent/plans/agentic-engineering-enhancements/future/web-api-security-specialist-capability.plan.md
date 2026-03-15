# Web/API Security Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

The repo already has:

- `security-reviewer` for practical cross-cutting exploitability review
- planned Express, Clerk, and MCP specialists for framework/protocol correctness

What it does not yet have is a **narrow-remit web/API security specialist**
that lives specifically at the HTTP and API trust boundary. That gap matters
because web and API security concerns are easy to blur across multiple
specialists:

- framework specialists can assess correctness without fully owning the attack
  surface
- broad security review can identify risk without exhaustively reasoning about
  HTTP/API-specific weaknesses
- privacy specialists care about data handling, but not all API attack classes

Without this narrow-remit capability, agents can miss subtle but important
web/API security issues such as:

- incorrect treatment of authentication vs authorisation at endpoints
- overly permissive CORS, callback, redirect, or cookie/session boundaries
- missing validation or normalisation at API ingress
- API-specific attack classes hidden inside otherwise correct framework wiring

This is a **narrow-remit** specialist. Its narrowness is about domain scope,
not about lightweight review depth. A narrow-remit specialist may still need
deep reasoning.

## Capability Shape

This is a future **agent capability**, not just a reviewer label.

- **`web-api-security-reviewer`** would provide read-only assessment of web and
  API attack-surface correctness.
- **`web-api-security-expert`** would support planning, research, and advisory
  work during implementation.
- The situational rule would trigger this capability when changes touch HTTP,
  APIs, web security boundaries, or adjacent auth/session surfaces.

**Remit note**: This is a **narrow-remit** specialist. Remit breadth is
independent of engagement depth. A narrow-remit specialist may still require
deep reasoning and live-docs consultation.

This capability should remain compatible with the broader agent model where
agents are not synonymous with reviewers. The reviewer persona is one
instantiation; the companion skill supports advisory and research work; the
situational rule makes the capability discoverable.

## Scope

### In scope

- HTTP and API trust-boundary hardening
- Request validation and normalisation at ingress
- Authentication vs authorisation behaviour at endpoint boundaries
- Session, cookie, token, callback, redirect, and browser-facing API concerns
- CORS, CSRF, replay, and adjacent request-boundary protections
- Error, header, cache, and response-shaping issues that affect web/API
  exposure
- OWASP API-style risk assessment
- Boundary interactions across Express, Clerk, MCP HTTP transport, and
  adjacent API surfaces

### Out of scope

- Broad security posture and system-wide defence-in-depth doctrine
  (`cyber-security-reviewer`)
- Broad privacy-by-design and retention/minimisation governance
  (`privacy-reviewer`)
- GDPR/UK GDPR and personal-data obligations at API boundaries
  (`web-api-gdpr-reviewer`)
- Framework correctness that is not security-specific (`express-reviewer`,
  `clerk-reviewer`, `mcp-reviewer`)
- Generic code quality, type, or architecture concerns

## Doctrine Hierarchy

1. **Current official web and API security doctrine** — for example OWASP API
   Security Top 10, OWASP ASVS web/API-relevant controls, browser/web-platform
   security guidance, and equivalent primary sources
2. **Official framework and platform security guidance** — Express, Clerk, MCP,
   Vercel, and any other directly relevant runtime or auth platform docs
3. **Repository ADRs and governance docs** — especially
   `docs/governance/safety-and-security.md` and the repo's auth-boundary ADRs
4. **Existing implementation** — evidence of current state, not authority

## Deployment Context

**Express 5.x, HTTP APIs, and MCP-over-HTTP surfaces** are the default context.
Key constraints:

- Express on Vercel is a primary web/API surface
- Shared Clerk instance and token-handling behaviour sit close to the web edge
- MCP HTTP transport introduces request/response and session semantics
- AI agents often reason about API shape from docs and examples, so edge
  behaviour must be explicit and safe

## Deliverables

1. Canonical reviewer template:
   `.agent/sub-agents/templates/web-api-security-reviewer.md`
2. Canonical skill: `.agent/skills/web-api-security-expert/SKILL.md`
3. Canonical situational rule:
   `.agent/rules/invoke-web-api-security-reviewer.md`
4. Platform adapters (Claude, Cursor, Gemini CLI, Codex)
5. Discoverability updates
6. Validation

## Overlap Boundaries

- **`web-api-security-reviewer`** owns HTTP/API attack surface, endpoint trust
  boundaries, and request/response security behaviour. It does **not** own
  broad security posture, privacy-governance doctrine, GDPR obligations, or
  generic framework correctness.
- **`security-reviewer`** owns the practical default exploitability review
  across all security-sensitive changes. It does **not** own exhaustive
  web/API-specific doctrine.
- **`cyber-security-reviewer`** owns broad security posture, threat models, and
  defence-in-depth strategy. It does **not** own narrow HTTP/API boundary
  detail.
- **`web-api-gdpr-reviewer`** owns personal-data and GDPR/UK GDPR obligations
  at web/API boundaries. It does **not** own general web/API attack-surface
  hardening.
- **`express-reviewer`**, **`clerk-reviewer`**, and **`mcp-reviewer`** own
  framework and protocol correctness. They do **not** own the narrow security
  posture of the web/API boundary itself.

## Promotion Trigger

This plan promotes to `current/` when:

1. Significant HTTP, API, auth-boundary, or session/callback work is scheduled
2. A future security cluster needs a narrow-remit web/API specialist distinct
   from both the broad security specialist and framework specialists
3. No conflicting work is in progress on the agent artefact layer
