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

The retired YAML seed was promoted into strict JSON on 2026-05-07 and is
preserved as dated evidence at [retired seed evidence][retired-seed].
Future machine consumption must read the JSON manifest, not the retired seed.

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

If this host needs merge policy richer than per-file `merge_class` metadata,
the host-local policy surface belongs under operational memory and must be
linked from this contract and `.agent/practice-index.md`. Practice Core keeps
the portable merge semantics; this host contract names concrete paths.

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
| `comms/events/` legacy fragments migrated | Terminal migration complete; the whole legacy `comms/` tree must not remain on disk | Doctor validates root absence and stale-path classifier |
| Live and archived prose still mention `comms/events/` | Must classify by live reference vs archived evidence | Doctor stale-path classifier |
| `shared-comms-log.md` is not drift-checked by no-arg collaboration check | Deterministic checker gap | Doctor report mode |
| Communication event JSON has a parser but no colocated JSON Schema | Contract gap | Agent tooling |
| Markdown `merge_class` coverage is partial | Structural metadata gap; repair only when unambiguous | Doctor report/repair mode |
| Conversation example files sit inside the live root | Explicit fixture/example exclusion required | Doctor inventory parser |
| Directory README contract coverage is partial across memory roots | Structural metadata gap; preserve content while classifying | Doctor report mode |
| Memory/state merge claims lack topology validation | Multi-checkout merge-safety gap | Doctor topology phase |

## Command Boundary

Repo-level substrate commands must invoke built `agent-tools` output. The
public aliases owned by the doctor plan are:

```bash
pnpm practice:substrate:check
pnpm practice:substrate:check -- --mode strict
```

Repair commands do not exist yet and are a future arc. Do not cite no-arg
`pnpm agent-tools:collaboration-state -- check` as broad substrate validation;
it is a narrow parser check unless explicit paths are supplied.

## Legacy Event Transition Rule

`.agent/state/collaboration/comms-events/` is the one live communication-event
root. The deleted legacy collaboration comms tree must not remain on disk.
Archived references to the old path remain archived evidence unless a reviewer
explicitly decides they are live instructions.

[pdr-049]: ../../practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md
[pdr-050]: ../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md
[retired-seed]: ../../plans/agentic-engineering-enhancements/evidence/2026-05-07-memory-state-substrate-retired-yaml-seed.md
