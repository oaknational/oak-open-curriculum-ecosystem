# Security and Privacy

Plans and research for MCP security hardening, with execution prioritised to
reduce unsupported security claims first, then enforce evidence-backed delivery.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Atomic Execution Plans**: [active/README.md](active/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies for this collection |
| `active/README.md` | Active index | Atomic executable plans mapped one-to-one to roadmap phases |
| `future/phase-0-control-mapping.md` | Future artefact | Phase 0 control inventory and mapping target |
| `future/phase-1-security-claim-contract.md` | Future artefact | Phase 1 security claim contract target |
| `future/phase-2-evidence-merge-readiness-rules.md` | Future artefact | Phase 2 evidence merge-readiness rules target |
| `future/phase-3-baseline-control-cut-list.md` | Future artefact | Phase 3 baseline control cut list target |
| `future/cloudflare-mcp-public-beta-security-gate.plan.md` | Future strategic brief | Cloudflare MCP security gate, Practice deltas, and product threat-model enhancements before public beta |
| `documentation-sync-log.md` | Tracking log | Per-phase record of required ADR/directive/reference-doc and README updates |
| `developing-secure-mcp-servers.research.md` | Research | Hardening evidence base and control backlog |
| `evidence-bundle.template.md` | Template | Claim/evidence artefact format for non-trivial security claims |
| `evidence/README.md` | Reference | Storage and naming convention for security evidence artefacts |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Atomic execution plans**: [active/README.md](active/README.md)
3. **Phase artefact targets**: [future/](future/) (control mapping, claim contracts, merge-readiness rules, control cut list)
4. **Research evidence base**: [developing-secure-mcp-servers.research.md](developing-secure-mcp-servers.research.md)

## Prioritisation Contract

1. **Immediate**: hallucination guarding for security-relevant claims.
2. **Second**: evidence-based claim verification and merge-readiness checks.
3. **Lower priority (not in current executable phase sequence)**:
   sandboxing expansion and prompt-injection automation, tracked as deferred
   notes in the roadmap.

## Coordination Boundaries

- Global hallucination/evidence guard policy is owned by
  [`agentic-engineering-enhancements`](../agentic-engineering-enhancements/README.md).
- This collection applies that policy to security hardening work; it does not
  redefine cross-repository guard standards.
- Security-specific claim classes and merge-readiness rules are scoped to MCP
  security controls and must remain consistent with the global claim/evidence
  contract.

## Document Roles (DRY)

- **Roadmap (`roadmap.md`)**: strategic phase sequence, dependencies, and status.
- **Active plans (`active/*.md`)**: authoritative executable tasks and deterministic validation.
- **Research docs (`*.research.md`)**: evidence base only; not execution instructions.
- **Tracking artefacts** (`documentation-sync-log.md`, `evidence/`): proof of documentation propagation and evidence.

If strategy and execution disagree, update the active plan first, then
reconcile the roadmap and collection README.

## Documentation Propagation Contract

No phase is complete until update handling is recorded for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. any additionally impacted ADRs, `/docs/` pages, and README files

Also apply:
[`jc-consolidate-docs`](../../../.cursor/commands/jc-consolidate-docs.md)

## Milestone Alignment

- **Milestone 1**: security baseline readiness for public alpha confidence.
- **Milestone 2**: hardening expansion after alpha feedback.
- **Milestone 3**: public beta is blocked until the Cloudflare MCP security
  gate is satisfied. The gate evaluates Cloudflare's 2026-04-14 enterprise MCP
  reference architecture
  (<https://blog.cloudflare.com/enterprise-mcp/>) against Oak's remote/public
  MCP threat model and records either enabled controls or evidence-backed
  declines. Strategic detail now lives in
  [cloudflare-mcp-public-beta-security-gate.plan.md](future/cloudflare-mcp-public-beta-security-gate.plan.md).

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.
