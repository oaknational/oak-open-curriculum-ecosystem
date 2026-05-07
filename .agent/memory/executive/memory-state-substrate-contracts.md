---
fitness_line_target: 330
fitness_line_limit: 450
fitness_char_limit: 22000
fitness_line_length: 100
split_strategy: "Split per-surface detail into companion contracts once the doctor consumes this inventory"
merge_class: index-narrative-tables
---

# Memory/State Substrate Contracts

Host-local substrate instance and strict inventory bridge for Practice state, memory,
generated read models, historical surfaces, and repair routing. Look this up
when adding, auditing, repairing, or building tooling for any `.agent/state/`
or `.agent/memory/` surface.

Portable doctrine lives in [PDR-050][pdr-050]. Merge-time semantics live in
[PDR-049][pdr-049]. This file is the repo-local bridge: it may name Oak paths,
commands, schemas, and plans. Do not move those host details into Practice Core.
The transferable contract specification belongs in PDR-050; this file is the
human-facing local instance that a future doctor validates against that
specification and the adjacent strict JSON manifest/schema.

## Contract Authority

| Field | Value |
| --- | --- |
| Inventory owner | This executive-memory file |
| Primary writers | Substrate-contract adoption work, consolidation, and doctor-plan implementation |
| Reviewer route | `docs-adr-reviewer`, `assumptions-reviewer`, `architecture-reviewer-fred`; add `test-reviewer` when executable checks change |
| Doctrine source | PDR-050 for substrate contracts; PDR-049 for merge classes |
| Implementation owner | Repo-local `agent-tools` doctor plan |
| Boundary | Practice Core names portable doctrine only; this file names local roots and commands |

State is truth-of-now. Memory is truth-across-time. Generated read models are
derived views. Historical fragments and archived prose are evidence, not noise
to delete. Repair must preserve knowledge before satisfying fitness or shape.

## Transferable vs Local

| Layer | Home | Contents |
| --- | --- | --- |
| Transferable specification | [PDR-050][pdr-050] | Required fields, merge-class discipline, severity vocabulary, repair vocabulary, generated read-model rule, transition-surface pattern, preservation-before-fitness |
| Repo-local instance | This file plus the strict JSON manifest/schema beside it | Concrete roots, schemas, parsers, generated outputs, commands, exclusions, current gaps, reviewer routes, and migration ledgers |

The local doctor should validate the repo-local instance against the
transferable specification. It should not treat this host inventory as the
portable doctrine itself.

## Strict Inventory Manifest

The machine-consumed local instance now lives in
[`memory-state-substrate-contracts.manifest.json`](memory-state-substrate-contracts.manifest.json)
and validates against
[`memory-state-substrate-contracts.schema.json`](memory-state-substrate-contracts.schema.json).
This Markdown file remains the human-facing contract; the JSON manifest is the
strict data surface the future doctor consumes before authoring RED fixtures.

The fenced YAML below is the retired seed that was promoted into strict JSON.
It remains only as transition context for this session's review. Future machine
consumption must read the JSON manifest, not this seed snapshot.

```yaml
contract_version: "0.1"
contract_surface: ".agent/memory/executive/memory-state-substrate-contracts.md"
contract_surface_merge_class: "index-narrative-tables"
inventory_status: "seed; not yet strict-doctor-complete"
doctrine:
  substrate_contracts: ".agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md"
  merge_semantics: ".agent/practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md"
portability_tiers:
  core-portable: "Portable doctrine or merge class vocabulary; no host paths."
  host-bridge: "Repo-local mapping from portable doctrine to local surfaces."
  repo-local-contract: "Contract for local state, memory, or generated output."
  repo-local-implementation: "Executable checker, renderer, schema, or helper."
  historical-evidence: "Archived or legacy material preserved for provenance."
discovery:
  live_roots:
    - ".agent/state/"
    - ".agent/memory/"
  doctrine_roots:
    - ".agent/practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md"
    - ".agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md"
  plan_roots:
    - ".agent/plans/agentic-engineering-enhancements/current/memory-state-substrate-portable-contracts.plan.md"
    - ".agent/plans/agent-tooling/current/memory-state-contract-doctor.plan.md"
  historical_roots:
    - ".agent/state/collaboration/comms/events/"
    - ".agent/state/collaboration/comms/archive/"
    - ".agent/memory/active/archive/"
    - ".agent/memory/operational/archive/"
    - ".agent/memory/operational/workstreams/"
  fixture_roots:
    - ".agent/state/collaboration/fixtures/"
  generated_read_models:
    - output: ".agent/state/collaboration/shared-comms-log.md"
      source: ".agent/state/collaboration/comms-events/"
      renderer: "pnpm agent-tools:collaboration-state -- comms render"
      current_checker: "narrow parser only; future doctor must regenerate and compare"
  exclusions:
    - pattern: ".agent/state/collaboration/conversations/*.example.json"
      reason: "Example fixtures inside the live directory; parse as examples, not live threads."
    - pattern: ".agent/state/collaboration/fixtures/**"
      reason: "Fixture estate for tests; never live state."
surface_defaults:
  required_contract_fields:
    - purpose
    - authority
    - lifecycle
    - writer_or_write_api
    - entry_identity
    - merge_class
    - schema_or_parser
    - generated_outputs
    - validator
    - severity
    - repair_path
    - portability_tier
    - owner_reviewer_route
  stored_derived_values_rule: "Allowed only when the validator recomputes and compares them."
  repair_preservation_rule: "Do not delete, trim, or compress knowledge to satisfy fitness."
  machine_consumption_rule: "Satisfied 2026-05-07 by memory-state-substrate-contracts.manifest.json plus schema."
surfaces:
  - id: "substrate-inventory"
    path: ".agent/memory/executive/memory-state-substrate-contracts.md"
    plane: "memory"
    lifecycle: "live contract"
    portability_tier: "host-bridge"
    merge_class: "index-narrative-tables"
    owner_reviewer_route: "docs-adr + assumptions + architecture"
    validator: "future practice:substrate:check"
  - id: "state-entrypoint"
    path: ".agent/state/README.md"
    plane: "state"
    lifecycle: "live entrypoint"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing"
    merge_class_expected: "index-narrative-tables"
    owner_reviewer_route: "architecture + docs-adr"
    validator: "future practice:substrate:check"
  - id: "collaboration-comms-events"
    path: ".agent/state/collaboration/comms-events/"
    plane: "state"
    lifecycle: "live immutable fragments"
    portability_tier: "repo-local-contract"
    merge_class: "exclusive-create-fragments"
    schema_or_parser: "agent-tools comms parser; JSON Schema pending"
    generated_outputs:
      - ".agent/state/collaboration/shared-comms-log.md"
    owner_reviewer_route: "agent-tooling + docs-adr"
    validator: "agent-tools parser today; doctor must add drift comparison"
  - id: "collaboration-comms-events-legacy"
    path: ".agent/state/collaboration/comms/events/"
    plane: "state"
    lifecycle: "historical transition defect; no new writes"
    portability_tier: "historical-evidence"
    merge_class: "exclusive-create-fragments"
    schema_or_parser: "agent-tools comms parser for provenance"
    owner_reviewer_route: "doctor plan + consolidation"
    validator: "future doctor classifies live-vs-archive references"
  - id: "collaboration-shared-comms-log"
    path: ".agent/state/collaboration/shared-comms-log.md"
    plane: "generated"
    lifecycle: "live generated read model"
    portability_tier: "repo-local-contract"
    merge_class: "append-only-narrative"
    schema_or_parser: "generated markdown header plus renderer comparison"
    owner_reviewer_route: "agent-tooling + docs-adr"
    validator: "future doctor regenerates from comms-events and compares"
  - id: "collaboration-active-claims"
    path: ".agent/state/collaboration/active-claims.json"
    plane: "state"
    lifecycle: "live truth-of-now registry"
    portability_tier: "repo-local-contract"
    merge_class: "index-narrative-tables"
    merge_class_declared_in: ".agent/state/collaboration/active-claims.schema.json"
    schema_or_parser: ".agent/state/collaboration/active-claims.schema.json"
    owner_reviewer_route: "agent-tooling + architecture"
    validator: "pnpm agent-tools:collaboration-state -- check --active <path>"
  - id: "collaboration-closed-claims"
    path: ".agent/state/collaboration/closed-claims.archive.json"
    plane: "state"
    lifecycle: "archive of closed or stale claim evidence"
    portability_tier: "repo-local-contract"
    merge_class: "append-only-structured-by-claim_id"
    merge_class_declared_in: ".agent/state/collaboration/closed-claims.schema.json"
    schema_or_parser: ".agent/state/collaboration/closed-claims.schema.json"
    owner_reviewer_route: "agent-tooling + architecture"
    validator: "pnpm agent-tools:collaboration-state -- check --closed <path>"
  - id: "collaboration-conversations"
    path: ".agent/state/collaboration/conversations/"
    plane: "state"
    lifecycle: "live decision threads; example files excluded from live set"
    portability_tier: "repo-local-contract"
    merge_class: "append-only-structured-by-entry_id"
    merge_class_declared_in: ".agent/state/collaboration/conversation.schema.json"
    schema_or_parser: ".agent/state/collaboration/conversation.schema.json"
    owner_reviewer_route: "agent-tooling + docs-adr"
    validator: "future doctor JSON Schema validation"
  - id: "collaboration-escalations"
    path: ".agent/state/collaboration/escalations/"
    plane: "state"
    lifecycle: "live owner escalation records"
    portability_tier: "repo-local-contract"
    merge_class: "append-only-structured-by-escalation_id"
    merge_class_declared_in: ".agent/state/collaboration/escalation.schema.json"
    schema_or_parser: ".agent/state/collaboration/escalation.schema.json"
    owner_reviewer_route: "agent-tooling + docs-adr"
    validator: "future doctor JSON Schema validation"
  - id: "memory-entrypoint"
    path: ".agent/memory/README.md"
    plane: "memory"
    lifecycle: "live memory taxonomy entrypoint"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing"
    merge_class_expected: "index-narrative-tables"
    owner_reviewer_route: "docs-adr + architecture"
    validator: "future practice:substrate:check"
  - id: "memory-active-napkin"
    path: ".agent/memory/active/napkin.md"
    plane: "memory"
    lifecycle: "live learning capture"
    portability_tier: "repo-local-contract"
    merge_class: "append-only-narrative"
    owner_reviewer_route: "consolidation + docs-adr"
    validator: "practice fitness plus future substrate doctor"
  - id: "memory-active-distilled"
    path: ".agent/memory/active/distilled.md"
    plane: "memory"
    lifecycle: "live distilled learning"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing"
    merge_class_expected: "review-required"
    owner_reviewer_route: "consolidation + docs-adr"
    validator: "practice fitness plus future substrate doctor"
  - id: "memory-active-patterns"
    path: ".agent/memory/active/patterns/"
    plane: "memory"
    lifecycle: "live pattern library"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing at directory contract"
    merge_class_expected: "exclusive-create-fragments for new pattern files; per-file edits need a contract"
    owner_reviewer_route: "patterns skill + docs-adr"
    validator: "future practice:substrate:check"
  - id: "memory-collaboration-patterns"
    path: ".agent/memory/collaboration/"
    plane: "memory"
    lifecycle: "live collaboration pattern memory"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing at directory contract"
    merge_class_expected: "review-required"
    owner_reviewer_route: "consolidation + architecture"
    validator: "future practice:substrate:check"
  - id: "memory-operational-continuity"
    path: ".agent/memory/operational/repo-continuity.md"
    plane: "memory"
    lifecycle: "live repo continuity contract"
    portability_tier: "repo-local-contract"
    merge_class: "index-narrative-tables"
    owner_reviewer_route: "session-handoff + docs-adr"
    validator: "practice fitness plus future substrate doctor"
  - id: "memory-operational-threads"
    path: ".agent/memory/operational/threads/"
    plane: "memory"
    lifecycle: "live per-thread continuity records"
    portability_tier: "repo-local-contract"
    merge_class_status: "partial; most records missing"
    merge_class_expected: "index-narrative-tables"
    owner_reviewer_route: "session-handoff + architecture"
    validator: "future practice:substrate:check"
  - id: "memory-operational-tracks"
    path: ".agent/memory/operational/tracks/"
    plane: "memory"
    lifecycle: "live single-writer tactical coordination cards"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing at directory contract"
    merge_class_expected: "exclusive-create-fragments for new track cards; per-card edits are single-writer"
    owner_reviewer_route: "session-handoff + architecture"
    validator: "future practice:substrate:check"
  - id: "memory-operational-pending-graduations"
    path: ".agent/memory/operational/pending-graduations.md"
    plane: "memory"
    lifecycle: "live graduation queue"
    portability_tier: "repo-local-contract"
    merge_class: "mostly-append-register"
    owner_reviewer_route: "consolidation + assumptions"
    validator: "practice fitness plus future substrate doctor"
  - id: "memory-operational-collaboration-contracts"
    path: ".agent/memory/operational/collaboration-state-*.md"
    plane: "memory"
    lifecycle: "live operational contracts and recipes"
    portability_tier: "repo-local-contract"
    merge_class_status: "partial; conventions declares index-narrative-tables"
    merge_class_expected: "index-narrative-tables"
    owner_reviewer_route: "agent-tooling + architecture"
    validator: "future practice:substrate:check"
  - id: "memory-operational-diagnostics"
    path: ".agent/memory/operational/diagnostics/"
    plane: "memory"
    lifecycle: "operational diagnostic evidence"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing at directory contract"
    merge_class_expected: "review-required"
    owner_reviewer_route: "consolidation + assumptions"
    validator: "future practice:substrate:check"
  - id: "memory-operational-quarantine"
    path: ".agent/memory/operational/quarantine/"
    plane: "memory"
    lifecycle: "quarantined operational memory awaiting disposition"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing at directory contract"
    merge_class_expected: "review-required"
    owner_reviewer_route: "consolidation + assumptions"
    validator: "future practice:substrate:check"
  - id: "memory-executive-contracts"
    path: ".agent/memory/executive/"
    plane: "memory"
    lifecycle: "live stable contract catalogues"
    portability_tier: "repo-local-contract"
    merge_class_status: "missing at directory contract"
    merge_class_expected: "index-narrative-tables for catalogue READMEs; per-file contracts declare their own class"
    owner_reviewer_route: "docs-adr + architecture"
    validator: "future practice:substrate:check"
```

## Surface Contract Template

Every in-scope surface needs a contract. For a single file, put the contract in
frontmatter, schema annotations, or the file body. For a directory, put it in
the directory `README.md`. For a generated read model, put it in the output
header and in the source-surface contract.

| Field | Required meaning |
| --- | --- |
| Purpose | What truth this surface carries and what it must not carry |
| Authority | Which doctrine, plan, rule, schema, or contract governs it |
| Lifecycle | Live, generated, archived, historical, fixture, retired, or transition defect |
| Writer or write API | Human edit, command, renderer, transaction helper, or append-only fragment write |
| Entry identity | Stable ID, timestamp, agent identity, filename convention, or none |
| Merge class | One PDR-049 class, declared in frontmatter, schema, or directory README |
| Schema or parser | JSON Schema, TypeScript parser, markdown convention, or explicit gap |
| Generated outputs | Derived files this surface feeds; empty when none |
| Validator | Current check and future doctor responsibility |
| Severity | Blocking, review-required, or informational for each invariant |
| Repair path | Deterministic, manual-with-provenance, or forbidden |
| Portability tier | One manifest tier; never infer from path alone |
| Owner/reviewer route | Agent, command, reviewer, or plan that owns changes |

The retired YAML seed used `merge_class_status` while gaps were being named.
Durable surface contracts in the strict JSON manifest now use declared PDR-049
`merge_class` values before strict enforcement.

When a surface stores a derived value, the validator must recompute it. A stored
count, rendered markdown log, freshness status, or generated index is evidence
only after comparison with the current source set.

## Severity and Repair Vocabulary

| Severity | Meaning | Examples |
| --- | --- | --- |
| `blocking` | Deterministic structural defect that can be proven without judgement | Invalid JSON, conflict markers, generated drift, new writes to a retired live path |
| `review-required` | Ambiguous or semantic defect that needs an agent or owner decision | Same-key memory collision, unclear stale-vs-archive prose reference |
| `informational` | Historical or contextual signal that must be preserved | Archived prose naming old paths, legacy fragments before terminal migration |

CLI output may include a transport-oriented `level` such as `error` or `warn`,
but every substrate finding must also carry one of the contract severities
above. `level: "error"` maps to `severity: "blocking"`.

| Repair class | Meaning | Constraint |
| --- | --- | --- |
| `deterministic` | Tool can compute one correct repair from current contract | Must be available as dry-run before apply |
| `manual-with-provenance` | Agent must preserve source, original path, content identity, and rationale | No silent rewrite or deletion |
| `forbidden` | Repair would erase evidence or choose semantics | Emit remediation, do not mutate |

## Known Contract Gaps

These are not permission to trim content. They are the first defect-ledger seeds
for the doctor plan.

| Gap | Current classification | Next owner |
| --- | --- | --- |
| `comms/events/` legacy fragments migrated | Terminal migration completed with provenance ledger; no event JSON remains in the legacy root | Doctor validates ledger and stale-path classifier |
| Live and archived prose still mention `comms/events/` | Must classify by live reference vs archived evidence | Doctor stale-path classifier |
| `shared-comms-log.md` is not drift-checked by no-arg collaboration check | Deterministic checker gap | Doctor report mode |
| Communication event JSON has a parser but no colocated JSON Schema | Contract gap | Agent tooling |
| Markdown `merge_class` coverage is partial | Structural metadata gap; repair only when unambiguous | Doctor report/repair mode |
| Conversation example files sit inside the live root | Explicit fixture/example exclusion required | Doctor inventory parser |
| Directory README contract coverage is partial across memory roots | Structural metadata gap; preserve content while classifying | Doctor report mode |
| Memory/state merge claims lack topology validation | Multi-checkout merge-safety gap | Doctor topology phase |

## Migration Ledgers

| Ledger | Source | Target | Entries | Purpose |
| --- | --- | --- | --- | --- |
| [`legacy-comms-events-migration-ledger-2026-05-07.json`](../../state/collaboration/comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json) | `.agent/state/collaboration/comms/events/` | `.agent/state/collaboration/comms-events/` | 114 | Preserves original path, target path, SHA-256, byte count, source evidence, and rationale for each migrated event fragment. |

## Command Boundary

Repo-level substrate commands must invoke built `agent-tools` output. The
public aliases owned by the doctor plan are:

```bash
pnpm practice:substrate:check
pnpm practice:substrate:check -- --mode strict
pnpm practice:substrate:repair -- --dry-run
pnpm practice:substrate:repair -- --apply
```

Those commands do not exist yet. Until they land, do not cite no-arg
`pnpm agent-tools:collaboration-state -- check` as broad substrate validation;
today it is a narrow parser check unless explicit paths are supplied.

## Legacy Event Transition Rule

`.agent/state/collaboration/comms-events/` is the one live communication-event
root. `.agent/state/collaboration/comms/events/` is historical transition state
and now retains only `.gitkeep` after the provenance-ledger migration above.
Archived references to the old path remain archived evidence unless a reviewer
explicitly decides they are live instructions.

[pdr-049]: ../../practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md
[pdr-050]: ../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md
