---
name: "Oak Search CLI Command Surface Rationalisation"
overview: "Strategic follow-up to define one canonical architecture for public `oaksearch` commands, move non-CLI operations into ordinary package scripts, and delete any command or script that cannot prove current value."
depends_on:
  - "../../semantic-search/future/search-ingestion-sdk-extraction.execution.plan.md"
todos:
  - id: inventory-surface-and-evidence
    content: "Build a complete command/script inventory, classify each surface as public CLI candidate vs non-CLI operation vs delete candidate, and record the evidence proving or disproving current value."
    status: pending
  - id: define-public-cli-charter
    content: "Define the public `oaksearch` command charter and one architectural contract for every retained public command: Commander-owned, in-process, single env-load, explicit resource ownership, no pass-through indirection."
    status: pending
  - id: migrate-retained-public-commands
    content: "Move every retained public command onto the canonical in-process command architecture and delete `pass-through.ts` plus any legacy command registrations that only preserve old scripts."
    status: pending
  - id: demote-retained-non-cli-operations
    content: "Move every retained non-public operation behind ordinary package.json scripts using the shared repo runner, with no shebang-runtime assumptions and no public `oaksearch` exposure."
    status: pending
  - id: delete-unproven-surfaces-and-reconcile-docs
    content: "Delete commands/scripts that lack current value evidence, then reconcile docs, package scripts, tests, and knip coverage to the reduced surface."
    status: pending
---

# Oak Search CLI Command Surface Rationalisation

**Last Updated**: 2026-04-23
**Status**: Strategic brief — not yet executable
**Lane**: `future/`

## Problem and Intent

`apps/oak-search-cli` currently mixes three different things under one
surface:

1. genuine public CLI commands that already follow the repo's preferred
   in-process architecture,
2. operational or generator scripts that happen to be reachable through
   `oaksearch`, and
3. old pass-through commands whose only job is to keep standalone
   scripts reachable behind the public CLI.

That shape is wrong even when it "works". It hides which commands are
actually part of the public operator contract, it preserves legacy
script architecture behind a new shell, and it encourages commands to
survive because they exist rather than because they still have value.

The intent of this plan is to reduce the surface to one clear model:

- public `oaksearch` commands are real CLI commands with one
  architecture,
- non-CLI operations are ordinary package scripts,
- anything that cannot prove present-day value is deleted.

The April 23, 2026 `knip` unblock was intentionally smaller than this:
it removed dead manifest entries and one remaining local `tsx`
shebang/runtime tie so `pnpm knip` could pass, but it did not solve the
command-surface architecture. This plan is the home for that full fix.

## Domain Boundaries and Non-Goals

- **In scope**:
  - `apps/oak-search-cli` public command registrations and command docs,
  - `apps/oak-search-cli/package.json` script surfaces,
  - the current pass-through estate and the standalone scripts it keeps
    reachable,
  - command ownership decisions at the boundary between public CLI,
    package script, and deletion,
  - removal of `tsx` shebang/runtime assumptions in retained search-cli
    operations.
- **Out of scope**:
  - changing the underlying search/retrieval product behaviour unless a
    retained command needs an importable seam,
  - inventing compatibility layers so old commands and new commands can
    coexist,
  - preserving a command just because it is currently documented or
    historically existed,
  - broad ingestion-SDK extraction design beyond what is already owned
    by [ADR-140](../../../../docs/architecture/architectural-decisions/140-search-ingestion-sdk-boundary.md)
    and the linked future plan.

## Dependencies and Sequencing Assumptions

- [ADR-133](../../../../docs/architecture/architectural-decisions/133-cli-resource-lifecycle-management.md)
  remains the architectural contract for retained public commands:
  `parseAsync()`, single env-load, explicit ES client ownership, and
  cleanup at the command boundary.
- [ADR-140](../../../../docs/architecture/architectural-decisions/140-search-ingestion-sdk-boundary.md)
  and the linked ingestion-SDK future plan remain authoritative for
  where reusable Oak-specific ingestion runtime should live. This plan
  does not re-decide that boundary.
- The current state after the minimum `knip` fix is:
  - `pnpm knip` passes,
  - `knip.config.ts` now models the real entry graph honestly,
  - the remaining problem is architectural ownership of commands and
    scripts, not static-analysis noise.
- Promotion should assume a fresh command/script inventory rather than
  using today's categories as fixed truth. Existing analysis is input,
  not the final retention decision.

## Success Signals

- Every retained public `oaksearch` command is implemented as a direct,
  in-process Commander action with one architectural pattern.
- `apps/oak-search-cli/src/cli/shared/pass-through.ts` is deleted.
- No public `oaksearch` command exists solely to forward into a
  standalone script.
- Every retained non-public operation is reachable as an ordinary
  package script using the shared repo runner, with no `tsx` shebangs
  and no system-runtime assumptions.
- Every retained command or script has explicit value evidence:
  documentation, automation usage, operator workflow ownership, or
  direct owner confirmation.
- Commands and scripts without such evidence are deleted rather than
  preserved "for safety".
- README/package-script/docs/knip coverage all describe the same
  reduced surface.

## Risks and Unknowns

- Some currently exposed commands may have hidden human or automation
  consumers not visible from code search alone.
- Some evaluation and observability flows already have partly modern
  internals; the right answer may be "promote into a real CLI command",
  "keep as a package script", or "delete" depending on evidence.
- Documentation drift is part of the current confusion, so "proof of
  value" must not rely on stale docs alone.
- There is a real risk of drifting into compatibility framing
  ("temporary script wrapper", "keep the old alias for now"). This plan
  must apply the replace-not-bridge rule strictly.

## Promotion Trigger (`future/` → `current/`)

Promote this brief when any of the following becomes true:

1. The owner explicitly prioritises removing `pass-through.ts` and
   rationalising the `oaksearch` surface.
2. Another build, `knip`, or docs issue touches the same command/script
   estate strongly enough that continuing with the mixed surface would
   create more workaround debt.
3. The ingestion-SDK extraction lane reaches the point where CLI
   ownership must be reduced to a thin shell over package surfaces.

When promoted, convert the inventory and migration steps above into an
executable `current/` plan with acceptance criteria, a command-by-
command evidence matrix, and explicit delete-vs-retain decisions.

## Implementation Detail (Reference Only)

These notes are **reference context only**. Execution decisions are
finalised only on promotion to `current/` or `active/`.

- **Step 1: Inventory and proof.**
  Build one matrix covering every current `oaksearch` command and every
  related package script. For each item, record:
  - current implementation shape,
  - current owner/module,
  - consumer evidence,
  - candidate fate: public CLI, package script, or delete.
- **Step 2: Public CLI charter.**
  Define the allowed public command groups and the one command
  architecture they all must use.
- **Step 3: Public command migration.**
  For every retained public command, move logic to importable canonical
  owners and call it in-process from Commander. No subprocess delegation.
- **Step 4: Non-CLI script demotion.**
  For every retained non-public operation, expose it only as a normal
  package script using `node ../../scripts/run-tsx-development.mjs ...`.
- **Step 5: Deletion and reconciliation.**
  Delete unproven commands/scripts, remove stale docs, remove shebangs,
  remove pass-through wiring, and shrink `knip` coverage to the real
  remaining surface.

## Foundation Alignment

- [principles.md](../../../directives/principles.md) — especially
  "no compatibility layers", "remove dead code", and the first question.
- [replace-dont-bridge.md](../../../rules/replace-dont-bridge.md) —
  the specific tripwire against preserving old script shapes behind new
  command surfaces.
- [ADR-133](../../../../docs/architecture/architectural-decisions/133-cli-resource-lifecycle-management.md)
  — canonical public-command lifecycle.
- [ADR-140](../../../../docs/architecture/architectural-decisions/140-search-ingestion-sdk-boundary.md)
  — reusable Oak-specific ingestion runtime belongs in a package, not
  in the app or in ad hoc scripts.

## Learning Loop

When this plan is promoted and completed:

- distil any reusable command-surface triage pattern into
  `.agent/memory/active/patterns/`,
- update `apps/oak-search-cli` docs so the public CLI contract and the
  script estate are described separately,
- run `/jc-consolidate-docs` so the kept-vs-deleted rationale is not
  trapped in the plan.
