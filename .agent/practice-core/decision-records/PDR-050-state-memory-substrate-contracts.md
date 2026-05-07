---
pdr_kind: governance
---

# PDR-050: State and Memory Substrate Contracts

**Status**: Accepted
**Date**: 2026-05-07
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge-flow discipline);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(doctrine needs structural enforcement);
[PDR-044](PDR-044-memetic-immune-system.md)
(innate and adaptive doctrine defence);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered knowledge processing and preservation before restructuring);
[PDR-049](PDR-049-memory-and-state-file-merge-semantics.md)
(merge-time semantics for the same substrate).

## Context

Practice-bearing repos need more than source code and documentation. They
also need a substrate that carries live coordination, cross-session continuity,
learning, generated views, and the feedback loops that keep all of those
surfaces healthy.

That substrate is fragile in a parallel-checkout world. Two sessions can be
coordinated correctly at the intent layer and still produce conflicting or
incoherent persistence-layer changes. PDR-049 names the merge-time semantics
for that class of conflict. This PDR names the broader contract: every state
and memory surface must declare what it is, how it changes, how it is checked,
and how it is repaired.

Without that contract, doctrine decays into a reading assignment. A surface may
look healthy because a local check parses its happy path, while stale paths,
duplicate surfaces, generated-output drift, or ambiguous repair procedures
continue to accumulate. A mature Practice needs a portable way to prevent,
detect, mitigate, repair, and learn from those failures.

## Decision

State and memory are sibling planes in the Practice substrate, not parent and
child.

- **State** is truth-of-now: live coordination, ownership, attention, queues,
  and other signals whose correctness depends on freshness.
- **Memory** is truth-across-time: durable learning, operational continuity,
  executive contracts, and patterns that survive individual sessions.
- **Generated read models** are derived views over state or memory. They are
  useful for humans and agents, but their authority comes from their source
  fragments plus the renderer that recomputes them.
- **Consolidation** is the bridge from state evidence to durable memory and
  from durable memory back into improved state design.

The substrate inventory is itself a contract surface. Each host MUST declare
how state and memory surfaces are discovered, which roots are live, which roots
are archived or historical, which exclusions are intentional, and which owner
or reviewer route governs the inventory. Without an inventory contract, a
checker can validate known files but cannot prove it found the full substrate.

Every Practice substrate surface MUST have a surface contract. A surface
contract is the smallest durable description that lets another host or agent
answer:

1. How is the surface discovered, and is it live, archived, or historical?
2. What is this surface for?
3. Who or what is allowed to write it?
4. What lifecycle does an entry follow?
5. What shape identifies one entry, section, or generated output?
6. Which merge class applies?
7. Which schema, parser, or structural convention validates it?
8. Which outputs are generated from it?
9. Which checker recomputes its health?
10. Which failures block, which require review, and which are informational?
11. Which repair actions are deterministic, and which require judgement?
12. Which parts of the contract are portable Practice doctrine and which are
    host implementation choices?

This is the **contract-for-contracts**. A surface contract that omits its
validator, repair path, or severity model is incomplete. A validator that only
records derived facts without recomputing them is not a validator. A repair
path that relies on unrecorded judgement is not portable.

The portable contract has two layers:

1. **Transferable substrate contract specification** — the vocabulary and
   template that travels with Practice Core: required contract fields,
   merge-class field discipline, severity and repair vocabulary, generated
   read-model requirements, preservation-before-fitness, transition handling
   for retired surfaces, and the requirement that local checkers validate or
   promote any machine-consumed manifest before tests depend on it.
2. **Host substrate instance** — the filled inventory for one repository or
   host: concrete roots, schemas, parsers, generated outputs, commands,
   exclusions, current gaps, reviewer routes, and migration ledgers.

The transferable specification belongs in Practice Core. Host instances belong
in the host bridge or host memory/documentation surfaces. A host may keep a
human-readable inventory and a stricter generated data file, but the local
doctor validates the host instance against the transferable specification
rather than treating a repo-local file as portable doctrine.

This split is an instance of a broader Practice shape. The Practice is a
philosophy and commitment as well as a specification system; the specification
aspect is the tool that lets a commitment become portable without becoming
implementation-specific. Future agentic engineering processes and support
systems may use the same pattern: Practice Core carries the fully specified
portable concept, while each host carries its binding and current instance.

`merge_class` is reserved for exact merge-class vocabulary from PDR-049.
Declaration status, missing coverage, partial coverage, or "declared via
schema" belong in adjacent metadata fields, not inside `merge_class`.

Substrate findings use a portable severity vocabulary:

- **blocking** — a deterministic structural defect that can be proven without
  judgement;
- **review-required** — an ambiguous or semantic defect that needs an agent or
  owner decision;
- **informational** — historical or contextual evidence that must be preserved.

Local tools may expose transport-oriented levels such as `error` or `warn`,
but they must also emit or map to the portable severity vocabulary.

Repair paths use the same portability split:

- **deterministic** — one correct repair can be computed from the contract;
- **manual-with-provenance** — judgement is needed, and source, original path,
  content identity, and rationale must be preserved;
- **forbidden** — the proposed repair would erase evidence or choose
  semantics, so the tool reports remediation instead of mutating.

Retired, renamed, or legacy state homes are transition surfaces. They are not
second live homes, and they are not trash. A terminal migration must preserve
provenance before changing location: original path, content identity, source
evidence, and rationale. Archived references remain evidence unless a reviewer
classifies them as live instructions.

## Immune Layer

Each Practice substrate surface participates in a two-layer immune system:

- **Prevention**: authoring guidance, write APIs, lifecycle rules, merge-class
  declarations, and generated-output warnings make the right action cheaper
  than the wrong one.
- **Detection**: deterministic checks recompute structure from current inputs.
  They catch stale canonical paths, duplicate identifiers, conflict markers,
  invalid schemas, generated read-model drift, impossible state transitions,
  and missing surface contracts.
- **Mitigation**: when a check finds a defect, the system names the failure
  class, severity, affected surface, and owner/reviewer route. Ambiguity is
  not silently repaired.
- **Repair**: deterministic repairs may regenerate outputs, restore ordering,
  add mechanical metadata, or migrate stale live references. Repair MUST
  preserve knowledge and evidence before addressing fitness or shape pressure:
  it must not delete, trim, compress, or rewrite historical knowledge to make a
  surface look healthy. Unresolved pressure routes to homing, graduation,
  splitting, an owner limit decision, or reviewer escalation. Semantic repairs
  require explicit judgement and evidence.
- **Learning**: repeated defects enter consolidation. Consolidation either
  refines the surface contract, adds a new fingerprint to the immune layer, or
  records why no new enforcement is warranted.

The innate layer handles deterministic structure. The adaptive layer handles
semantic ambiguity and new failure shapes. The two layers share the same
surface contracts, so learning does not remain trapped in one host's tooling.

## Merge-Time Consequence

PDR-049 remains authoritative for memory/state merge semantics. This PDR adds
one upstream requirement: a merge resolver should not have to infer the
surface's contract from prose scattered across the repository. The surface
declares its contract; the checker verifies that the declaration and current
files still agree; the repair path names what can be fixed mechanically.

Semantic union is still insufficient without the git operation that preserves
parentage, ancestry, and future merge-base behaviour. The substrate contract
therefore includes both content health and history health.

## Rationale

The alternative is local convention: each repository gradually accretes state
files, memory files, generated views, scripts, and warnings. That works while
there is one checkout and a small number of sessions. It fails when multiple
branches and agents write the same global surfaces in parallel.

Another alternative is to move all coordination state outside git. That may be
right for some hosts later, but it does not remove the need for substrate
contracts. External state still needs purpose, lifecycle, validator, severity,
repair, and learning loops.

The chosen shape is portable because it specifies responsibilities, not a
programming language or tool. One host may implement the doctor as a script,
another as a CI job, another as an MCP tool, and another as an editor
extension. The Practice contract remains the same.

## Consequences

- New state or memory surfaces need a surface contract before they become
  load-bearing.
- The surface inventory is part of the substrate contract, including live roots,
  archived or historical roots, discovery rules, exclusions, owner route, and
  portability tier.
- Generated read models are checked by recomputation, not trusted because they
  look current.
- Stale canonical paths and duplicate live surfaces are health defects, even
  when existing narrow checks pass.
- Repair commands must distinguish deterministic repairs from judgement calls.
- Repair commands preserve knowledge first; fitness pressure is a routing
  signal, never a deletion rule.
- Consolidation becomes part of the immune system, not a separate cleanup
  ritual.
- Host adoption belongs in the host bridge index and host implementation
  plans; the portable requirement lives here.

## Amendment Log

### 2026-05-07 — Transferable specification vs host instance split

The first host-side inventory/template seed exposed a useful distinction: the
surface-contract template, severity vocabulary, repair vocabulary, generated
read-model rule, and transition-surface pattern are Practice-level contracts,
while concrete roots, commands, schemas, current gaps, and migration ledgers are
host instances. This amendment makes the split explicit so future hosts can
reuse the transferable specification and validate their own local instance
against it.

The owner further clarified that this does not reduce the Practice to a
specification repository. The Practice remains a philosophy and commitment; its
specification aspect is a powerful portability tool. The transferable-vs-host
split may apply to other agentic engineering processes when they need the same
implementation-agnostic treatment.
