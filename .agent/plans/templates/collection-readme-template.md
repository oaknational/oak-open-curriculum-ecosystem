# [Collection Name]

[One-line description of the collection mission and scope.]

**Collection Roadmap**: [roadmap.md](roadmap.md)  
**Atomic Execution Plans**: [active/README.md](active/README.md)
**Next-Up Plans**: [current/README.md](current/README.md)  
**Later Plans**: [future/README.md](future/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic phase sequence and dependencies |
| `active/README.md` | Active index | Atomic executable plans mapped one-to-one to roadmap phases |
| `current/README.md` | Current index | Next-up plans that are queued and ready |
| `future/README.md` | Future index | Deferred/later plans and ideas |
| `documentation-sync-log.md` | Tracking log | Per-phase record of required ADR/directive/reference-doc and README updates |
| `[plan-a].plan.md` | Strategic source plan | Policy intent, rationale, success criteria |
| `[research-a].research.md` | Research | Evidence base and external context |
| `evidence-bundle.template.md` | Template | Claim/evidence artefact format for non-trivial claims |
| `evidence/README.md` | Reference | Evidence storage and naming conventions |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Now (in progress)**: [active/README.md](active/README.md)
3. **Next (queued)**: [current/README.md](current/README.md)
4. **Later (deferred)**: [future/README.md](future/README.md)
5. **Strategic source plans**: `[plan-a].plan.md`, `[plan-b].plan.md`
6. **Research evidence**: `[research-a].research.md`, `[research-b].research.md`

## Document Roles (DRY)

- **Roadmap (`roadmap.md`)**: strategic phase sequence, dependencies, status.
- **Active plans (`active/*.md`)**: in-progress execution only (NOW).
- **Current plans (`current/*.md`)**: queued/next plans (NEXT), not yet started.
- **Future plans (`future/*.md`)**: deferred/later plans (LATER), not yet started.
- **Strategic source plans (`*.plan.md`)**: intent and rationale only.
- **Research docs (`*.research.md`)**: evidence base only, not execution instructions.
- **Tracking artefacts** (`documentation-sync-log.md`, `evidence/`): proof of documentation propagation and evidence-backed claims.

If strategy and execution disagree, update the active plan first, then reconcile
the strategic source plan and roadmap.

## Documentation Propagation Contract

No phase is complete until update handling is recorded for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/directives/practice.md`
3. `.agent/reference-docs/prog-frame/agentic-engineering-practice.md`
4. any additionally impacted ADRs, `/docs/` pages, and README files

Also apply:
[`jc-consolidate-docs`](../../../.cursor/commands/jc-consolidate-docs.md)

## Milestone Alignment

- **Milestone [N]**: [Primary outcomes]
- **Milestone [N+1]**: [Follow-on outcomes]

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

## Foundation Documents (Mandatory Re-read)

1. [rules.md](../../directives/rules.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
