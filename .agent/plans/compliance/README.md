# Compliance

Plans for external policy compliance, directory listing requirements, and
regulatory alignment for the Oak MCP servers and related services.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Atomic Execution Plans**: [active/README.md](active/README.md)
**Next-Up Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies |
| `active/README.md` | Active index | In-progress executable plans |
| `current/README.md` | Current index | Next-up plans that are queued and ready |
| `future/README.md` | Future index | Deferred/later plans and ideas |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Now (in progress)**: [active/README.md](active/README.md)
3. **Next (queued)**: [current/README.md](current/README.md)
4. **Later (deferred)**: [future/README.md](future/README.md)

## Document Roles (DRY)

- **Roadmap (`roadmap.md`)**: strategic phase sequence, dependencies, status.
- **Active plans (`active/*.md`)**: in-progress execution only (NOW).
- **Current plans (`current/*.md`)**: queued/next plans (NEXT), not yet started.
- **Future plans (`future/*.md`)**: deferred/later plans (LATER), not yet started.

If strategy and execution disagree, update the active plan first, then reconcile
the roadmap.

## Coordination Boundaries

- Security-specific controls (auth, rate limiting, sandboxing) are owned by
  [`security-and-privacy`](../security-and-privacy/README.md).
- This collection owns external policy mapping and compliance evidence — it does
  not redefine security controls but ensures they meet external requirements.
- Graph tool token efficiency work lives here because the driver is policy
  compliance, not feature development. The implementation touches
  [`sdk-and-mcp-enhancements`](../sdk-and-mcp-enhancements/README.md) code
  paths but the plan is owned by this collection.

## Documentation Propagation Contract

No phase is complete until update handling is recorded for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. any additionally impacted ADRs, `/docs/` pages, and README files

Also apply:
[`jc-consolidate-docs`](../../../.cursor/commands/jc-consolidate-docs.md)

## Milestone Alignment

- **Milestone 1**: directory listing readiness for Anthropic Software Directory.

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

## Foundation Documents (Mandatory Re-read)

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
