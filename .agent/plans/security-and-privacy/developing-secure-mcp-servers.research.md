# Secure MCP Server Development Hardening Report

**Scope:** Deep-dive review of the [A Practical Guide for Secure MCP Server Development (v1.0, Feb 2026)](https://genai.owasp.org/resource/a-practical-guide-for-secure-mcp-server-development/) plus additional web research on MCP and adjacent best practices.

**Goal:** Provide a comprehensive, self-contained set of recommendations to harden an MCP server already in development.

**Research snapshot date:** 2026-02-24

**Normative-source note:** MCP and OAuth standards evolve. Treat this report as
an implementation-oriented snapshot and re-validate normative references before
execution.

---

## 0) Scope assumptions and applicability

This report is most directly applicable to MCP deployments where:

- remote HTTP transport is enabled (not stdio-only)
- the server can invoke multiple tools and perform chained tool workflows
- delegated user permissions are in scope (OAuth/OIDC)
- tool outputs may include untrusted content that returns to model context

If your deployment differs (for example, local-only stdio with a very small,
fixed toolset), you can de-scope controls accordingly, but should do so
explicitly and document the rationale.

---

## 1) Executive summary

MCP servers sit at a uniquely risky junction: they translate LLM intent into concrete actions across tools, data sources, and downstream systems. Compared to traditional APIs, MCP can introduce (a) **dynamic tool loading**, (b) **tool chaining**, (c) **delegated user permissions**, and (d) **prompt-/context-mediated decision-making**. Where these capabilities are enabled, they expand the attack surface and magnify blast radius.

Hardening priorities should focus on:

1. **Trust boundaries & isolation**: strict tenant/session/tool isolation, strong sandboxing, and least privilege everywhere.
2. **Schema-driven control plane**: strict MCP message validation + strict tool input/output schemas + size/time/CPU/memory caps.
3. **Tool supply-chain integrity**: signed tool manifests, version pinning, and governance for tool onboarding/updates.
4. **Authorization done “the MCP way”**: OAuth 2.1 / OIDC, token exchange / on-behalf-of patterns, no token passthrough, and centralized policy enforcement.
5. **Prompt-injection resilience**: structured tool invocation, high-risk HITL gates, and independent policy checks (“LLM-as-a-judge” style) for sensitive actions.
6. **Operational readiness**: secure secrets handling, hardened containers, default-deny networking, robust audit logs, continuous scanning and monitoring.

---

## 2) MCP threat model and attack surface

### 2.1 Core assets

- **User data** accessible via tools (documents, drives, student data, internal content, etc.).
- **Credentials and tokens** (user OAuth tokens, server-to-server tokens, API keys).
- **Downstream systems** (databases, SaaS APIs, file systems, CI/CD, cloud resources).
- **Tool registry and tool definitions** (descriptions, schemas, permissions metadata).
- **Audit/log data** (must be reliable and immutable; also a leakage risk).

### 2.2 Primary trust boundaries

- **Client ↔ MCP server** (transport security + client identity + request validation)
- **LLM ↔ tool router / policy layer** (LLM must not directly touch secrets or privileged execution)
- **MCP server ↔ tools/executors** (sandbox boundary; tool egress control)
- **MCP server ↔ authorization server** (OAuth/OIDC flows, token validation, introspection)
- **Tool outputs ↔ LLM context** (indirect prompt injection via tool output / external content)

### 2.3 Common MCP-specific risks (and what they look like)

- **Tool poisoning**: malicious tool description/schema nudges the model into unsafe actions.
- **Dynamic tool instability (“rug pull”)**: previously trusted tool changes after initial review or pinning.
- **Code injection / unsafe execution**: model-provided strings land in shell, SQL, templates, or HTTP requests without strict validation and encoding.
- **Credential leakage / token misuse**: tokens passed through, logged, cached, or exposed to the model.
- **Confused deputy**: server is tricked into using legitimate privileges for attacker goals, especially if downstream calls rely on client/user tokens rather than server-issued tokens.
- **Prompt injection (direct/indirect)**: instructions embedded in user content or tool outputs override policy intent.

---

## 3) Deep dive: OWASP “Secure MCP Server Development” guidance (attached) — analysis + hardening implications

This section mirrors the attached guide’s structure and expands each point into concrete engineering actions and “gotchas”.

### 3.1 Secure MCP architecture

**Key guidance (expanded):**

- Prefer **local transports** (stdio / Unix sockets) where feasible; avoid exposing MCP over network unless required.
- For remote HTTP transport:
  - Enforce **TLS 1.2+**.
  - Strictly **validate all JSON-RPC messages** against the MCP schema.
  - Ensure trusted client connections via allowlists/hardcoded endpoints, **mTLS** for static trust, and **OAuth 2.1 / OIDC** for dynamic trust.

**Implementation recommendations:**

- **Transport-level hardening**
  - HTTP: enforce HSTS, modern TLS ciphers, and certificate pinning for clients where practical.
  - Reject requests missing required headers; validate `Origin` where applicable; apply CSRF-like protections where browser contexts are involved.
  - Rate limit at the edge (per IP + per client_id + per user).

- **Protocol strictness**
  - Implement a “strict JSON-RPC mode”:
    - Only allow known MCP methods.
    - Reject unknown fields.
    - Enforce max request size and max nesting depth.
    - Validate `id` correlation and response matching.
  - Treat schema validation failures as security signals (feed into monitoring/alerting).

- **Isolation-first server topology**
  - Consider a 3-tier design:
    1) **Gateway** (TLS termination, rate limiting, request shaping, auth)
    2) **Policy router** (schema validation, permissions evaluation, tool selection constraints)
    3) **Tool executor(s)** (sandboxed, least-privilege, network-restricted)

### 3.2 Safe tool design

**Key guidance (expanded):**

- Require **cryptographic tool manifests**: signed manifest includes description, schema, version, permissions.
- Formal onboarding: SAST/DAST/SCA + manual review.
- Validate “description vs behavior”: runtime checks for unexpected capabilities.
- Only expose minimal tool fields to the model.

**Implementation recommendations:**

- **Tool identity & integrity**
  - Use signed manifests (e.g., Sigstore/cosign for artifacts; signed JSON for tool descriptors).
  - Maintain a **tool allowlist** with explicit versions and hashes.
  - Separate:
    - *Tool metadata exposed to model* (minimal)
    - *Internal metadata* (owner, code repo, risk tier, last review, allowed egress, secret refs)

- **Permission model**
  - Define a consistent permission vocabulary:
    - Data scopes (e.g., `files:read`, `db:query`, `grades:read`)
    - Action scopes (e.g., `email:send`, `payments:initiate`, `admin:write`)
    - Egress scopes (e.g., `net:outbound:deny`, `net:outbound:allowlist`)
  - Enforce permission checks *twice*:
    1) Before tool invocation (policy router)
    2) In the tool executor (defense-in-depth)

- **Runtime attestation**
  - Build “capability guardrails” into the executor:
    - deny filesystem paths outside sandbox
    - deny network by default; allowlist hosts per tool
    - deny spawning subprocesses unless explicitly allowed

### 3.3 Data validation & resource management

**Key guidance (expanded):**

- Quotas/rate limits/timeouts; isolate compute/memory budgets.
- Strict I/O validation: JSON schema for tool inputs and outputs.
- Sanitization/encoding; output size limits.

**Implementation recommendations:**

- **Schema everywhere**
  - Maintain JSON Schemas for:
    - MCP requests/responses
    - Each tool input
    - Each tool output
  - Use a validator that supports:
    - max length constraints
    - patterns and enums
    - numeric bounds
    - disallow unknown properties

- **Resource governance**
  - Per session + per tool:
    - max calls/min
    - max concurrent calls
    - max wall time per call
    - max response bytes
  - Add a “circuit breaker”:
    - if model repeatedly triggers validation failures or suspicious patterns → degrade or block session.

- **Encoding discipline**
  - Tools must treat inputs as hostile:
    - never interpolate into SQL/shell; use parameterized queries and safe process APIs
    - HTML escaping where relevant
    - strict URL building and SSRF controls for HTTP tools

### 3.4 Prompt injection controls

**Key guidance (expanded):**

- Use structured JSON tool calls rather than free-text commands.
- HITL for high-risk actions using elicitations.
- LLM-as-a-judge / separate context policy check for risky actions.
- “One task, one session” to reduce lingering hidden instructions.

**Implementation recommendations:**

- **Structured invocation only**
  - Enforce a hard boundary:
    - The model proposes a tool + JSON args
    - The policy router validates and either executes or rejects
    - Free-text execution is disallowed.

- **Tiered risk gates**
  - Assign each tool a risk tier:
    - Tier 0: read-only, low sensitivity
    - Tier 1: limited writes (idempotent, reversible)
    - Tier 2: destructive or irreversible actions
  - Enforce:
    - Tier 2 requires explicit user approval (HITL)
    - Tier 1 may require “secondary policy model” approval
    - Tier 0 runs automatically but still under quotas.

- **Independent policy evaluation**
  - Use a non-chatty, minimal-context “policy check” step:
    - take proposed tool call + relevant policy facts
    - decide allow/deny with explicit rationale
  - Treat this as *defense-in-depth*, not a primary boundary.

- **Context compartmentalization**
  - Reduce cross-contamination:
    - separate sessions per task
    - avoid persisting untrusted tool outputs in memory
    - tag and filter content sources (user vs tool vs system policy)

### 3.5 Authentication & authorization

**Key guidance (expanded):**

- Mandatory OAuth 2.1/OIDC for remote servers; validate token claims/signatures each request.
- Token delegation via token exchange / on-behalf-of patterns (RFC 8693).
- Prohibit token passthrough to downstream APIs (confused deputy risk).
- Short-lived, scoped tokens; revalidate every call.

**Implementation recommendations:**

- **OAuth/OIDC “gold standard”**
  - Prefer authorization code flow + PKCE for public clients.
  - Validate:
    - signature (JWK rotation handling)
    - `iss`, `aud`, `exp`, `nbf`, `iat`
    - `azp` / client binding where appropriate
  - Strong scope design: scopes should map to tool permissions.

- **No token passthrough**
  - Downstream calls should use:
    - server-issued tokens to downstream, or
    - exchanged tokens (user context embedded) minted for the MCP server as audience.
  - Maintain auditable separation:
    - user identity ≠ MCP server identity.

- **Central policy enforcement**
  - Authorization logic should live in one place:
    - a policy engine or router layer
  - Tools should not decide authorization; tools should enforce only their own least-privilege runtime checks.

### 3.6 Secure deployment & updates

**Key guidance (expanded):**

- Secrets in vaults; never expose to the LLM; never log secrets.
- Hardened container, non-root, minimal packages/capabilities.
- Network segmentation; default-deny.
- Supply chain controls: pin/scan deps; signed images; AIBOMs.
- CI/CD security gates.

**Implementation recommendations:**

- **Secrets architecture**
  - Model never sees secrets:
    - tool executor pulls secrets from vault at runtime
    - return only the minimum derived result
  - Add secret scanning in CI (prevent commit leaks).

- **Container runtime hardening**
  - Run as non-root; drop Linux capabilities; read-only filesystem where possible.
  - Use seccomp/AppArmor profiles.
  - Minimal base images; remove shells/package managers in runtime images where feasible.

- **Network controls**
  - Default deny egress; allowlist only required downstream hosts.
  - Add SSRF protections for any HTTP-fetching tool:
    - block private IP ranges
    - block link-local
    - block metadata endpoints
    - enforce DNS pinning / re-resolution rules if needed

- **Supply chain**
  - Pin dependencies and container digests.
  - Verify signatures for tool packages and images.
  - Maintain SBOM/AIBOM artifacts; monitor for CVEs continuously.

### 3.7 Governance

**Key guidance (expanded):**

- Cryptographic integrity for tools/dependencies/registry manifests.
- Security-focused peer review for changes.
- Audit logs with redaction/allowlists; immutable storage.
- Non-human identity governance for agents/services.

**Implementation recommendations:**

- **Change control**
  - Tool changes require:
    - new manifest signature
    - version bump
    - security review sign-off
    - staged rollout (canary) with monitoring

- **Audit logging design**
  - Log:
    - authentication decisions
    - policy decisions (allow/deny + rule id)
    - tool invocation (tool id/version + parameters *after* redaction)
    - resource access summaries
  - Protect logs:
    - append-only storage
    - restricted access
    - retention policy
  - Add “privacy modes” for sensitive tools (hash or omit sensitive fields).

- **NHI governance**
  - Treat the MCP server and each tool executor as distinct identities.
  - Rotate credentials; scope them tightly; monitor for anomalous usage.

### 3.8 Tools & continuous validation

**Key guidance (expanded):**

- SAST/SCA in CI; runtime security tools; SIEM integration.
- Monitor for anomalous tool usage, validation failures, unexpected file/network access.
- Use OpenSSF Scorecard and OSV to improve supply chain posture.

**Implementation recommendations:**

- **CI gates**
  - Fail builds on:
    - critical vulns in deps
    - new unsafe sinks (shell exec, dynamic SQL) without approved wrappers
    - policy/schema regression tests failing

- **Runtime monitoring**
  - Alert on:
    - spikes in denied calls
    - repeated schema validation failures
    - unusual egress attempts
    - tool invocation pattern anomalies (new tool combos, unusual parameter shapes)

---

## 4) Additional MCP-specific best practices from official MCP documentation

The MCP project itself publishes security guidance and an authorization specification that you should treat as normative for interoperability.

### 4.1 Transport choices and security posture

- Prefer local stdio where possible; remote HTTP requires stronger auth, request validation, and network controls.
- Treat the protocol as JSON-RPC: enforce strict encoding, schema validation, and method allowlisting.

### 4.2 MCP authorization (OAuth 2.1)

- MCP authorization flow expectations include OAuth 2.1, metadata discovery, and (optionally) dynamic client registration.
- Implementations should align with OAuth best current practices: PKCE, correct redirect URI handling, and robust token validation.

**Practical alignment:** treat “MCP authorization” as a baseline; then add enterprise requirements: short token lifetimes, token exchange, fine-grained scopes, and centralized policy evaluation.

---

## 5) Concrete hardening blueprint for an MCP server in development

### 5.1 Reference architecture (recommended)

**Edge / Gateway**

- TLS termination, WAF/rate limiting, request size limits
- client allowlists or mTLS where feasible
- strict HTTP header requirements

**AuthN/AuthZ + Policy Router**

- OAuth 2.1/OIDC validation and session management
- authorization mapping: scopes → tool permissions → resource constraints
- schema validation of JSON-RPC + tool inputs
- risk tier gating (HITL / policy-model approval)
- audit logging

**Tool Executor Layer**

- per-tool sandbox (container/microVM/process jail)
- default-deny network with per-tool allowlist
- strict filesystem boundaries
- secrets retrieved from vault inside executor; never exposed to model
- deterministic cleanup and resource caps

### 5.2 Minimum security controls (must-have)

- Strict schema validation for:
  - MCP requests/responses
  - every tool’s input and output
- Token validation on every request:
  - signature + issuer + audience + expiry
- No token passthrough to downstream APIs
- Signed and pinned tool manifests + controlled onboarding pipeline
- Per-session quotas and per-tool timeouts
- Default-deny egress with allowlists
- Audit logs with redaction + immutable storage

### 5.3 High-value “next layer” controls (strongly recommended)

- mTLS between trusted internal components
- Independent policy check for high-risk actions
- Runtime attestation / behavior monitoring (“description vs behavior”)
- Canary tool rollouts + automated rollback
- Automated adversarial testing (prompt injection suites, tool misuse scenarios)
- SBOM + image signing + provenance checks

### 5.4 Repository operationalisation notes (`oak-mcp-ecosystem`)

Use this report as a source document, then express implementation through
collection roadmap + active plans so controls are executable and testable.

Suggested ownership mapping in this repository:

- **MCP app transport/auth/policy wiring**: `apps/*mcp*/`
- **Tool and schema contract generation flow**: `packages/sdks/` + `pnpm type-gen`
- **Cross-cutting directives/gates**: `.agent/directives/`, root scripts, CI workflows
- **Evidence and rollout tracking**: `.agent/plans/security-and-privacy/` (roadmap + active plans + evidence artefacts)

Suggested first implementation slices:

1. Transport and protocol strictness baseline (JSON-RPC validation, request limits, method allowlist)
2. OAuth/OIDC and token handling baseline (no passthrough; token validation path)
3. Tool execution isolation baseline (sandbox + default-deny egress + quotas)
4. Prompt-injection and high-risk action gates (structured invocation + HITL)

---

## 6) Security backlog template (actionable checklist)

### 6.1 Protocol & validation

- [ ] Enforce strict JSON-RPC + MCP schema validation (reject unknown methods/fields)
- [ ] Max request/response size; max nesting depth; input length caps
- [ ] Implement structured tool invocation only; disallow free-text execution paths

### 6.2 Authentication & authorization

- [ ] OAuth 2.1/OIDC with robust validation (`iss`, `aud`, `exp`, signature, etc.)
- [ ] Fine-grained scopes mapped to tool permissions
- [ ] Token exchange / on-behalf-of for delegated user access (no passthrough)
- [ ] Centralized policy engine (deny-by-default; explicit allow rules)

### 6.3 Tool governance & integrity

- [ ] Signed tool manifests + pinned versions/hashes
- [ ] Tool onboarding workflow: SAST/SCA + manual review + threat model
- [ ] Runtime enforcement: tool can only do what its policy allows (egress/filesystem)

### 6.4 Isolation & runtime safety

- [ ] Per-session isolation; deterministic cleanup; no shared mutable state
- [ ] Sandboxed tool execution with CPU/memory/time quotas
- [ ] Default-deny egress; allowlist downstream hosts
- [ ] SSRF protections for any HTTP tool

### 6.5 Prompt injection resilience

- [ ] HITL for destructive/irreversible actions
- [ ] Independent policy check for high-risk tool calls
- [ ] Context compartmentalization: task-based sessions, restricted memory

### 6.6 Observability, monitoring, and response

- [ ] Audit logging: auth decisions, policy decisions, tool calls (redacted), config changes
- [ ] SIEM integration + alerts for anomalies
- [ ] Incident playbooks: credential rotation, tool disable/rollback, session quarantine

### 6.7 Supply chain & CI/CD

- [ ] Dependency pinning + automated SCA (OSV-based) gating
- [ ] Signed images + provenance checks
- [ ] SBOM/AIBOM generation and retention
- [ ] OpenSSF Scorecard tracking for key repos/tools

---

## 7) Curated external references (all links are markdown links)

Reference hygiene rule for execution:

- Re-validate standards links and version anchors before implementing controls.
- If a linked MCP spec version is superseded, update the execution plan and
  record the decision in evidence notes.

### MCP official docs

- [MCP specification repository](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [MCP transports (stdio / Streamable HTTP)](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports)
- [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)

### OWASP guidance

- [OWASP: LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [OWASP: OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
- [OWASP: Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [OWASP API Security Top 10 (API1:2023 BOLA)](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)

### OAuth / OIDC standards

- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [RFC 8693: OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)

### Container, network segmentation, and supply chain

- [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [OpenSSF Scorecard](https://openssf.org/projects/scorecard/)
- [OSV (Open Source Vulnerabilities)](https://osv.dev/)
- [OSV-Scanner usage docs](https://google.github.io/osv-scanner/usage/)

### Research / broader context

- [Enterprise-Grade Security for the Model Context Protocol (MCP) (arXiv)](https://arxiv.org/abs/2504.08623)
- [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

---

## 8) Closing guidance: how to use this report during hardening

1. Implement the **must-have controls** first (Section 5.2 / 6.1–6.2).  
2. Treat tool governance + sandboxing as the biggest risk reducers (Sections 3.2, 3.6, 5.1).  
3. Run adversarial testing continuously (prompt injection + tool misuse), and wire outcomes into CI gates and monitoring.  
4. Revisit threat model quarterly and after any major new tool integrations.

---

## 9) Follow-on artefacts in this repository

This research now maps to the collection execution surfaces:

1. `.agent/plans/security-and-privacy/README.md`
2. `.agent/plans/security-and-privacy/roadmap.md`
3. `.agent/plans/security-and-privacy/active/` atomic execution plans
4. `.agent/plans/security-and-privacy/evidence-bundle.template.md` and `evidence/` storage conventions

Operational phase artefacts:

5. `.agent/plans/security-and-privacy/phase-0-control-mapping.md`
6. `.agent/plans/security-and-privacy/phase-1-security-claim-contract.md`
7. `.agent/plans/security-and-privacy/phase-2-evidence-merge-readiness-rules.md`
8. `.agent/plans/security-and-privacy/phase-3-baseline-control-cut-list.md`
9. `.agent/plans/security-and-privacy/deferred-controls-register.md`
