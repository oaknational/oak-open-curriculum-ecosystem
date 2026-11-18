# Architectural Fitness Functions: Concept Exploration

**Date**: 2026-07-15  
**Status**: Decision-ready exploration; no implementation authorised  
**Scope**: This repository only

## Review Contract

This report tests whether Oak should replace the unwired
`max-files-per-dir` ESLint rule with a suite of repository-level architectural
fitness signals. A successful review should challenge the evidence, the
signal-versus-gate distinction, the classification model, and the proposed
sequencing. It should report missing evidence rather than infer that a high
count proves poor architecture.

The evidence is first-hand repository inspection plus a one-off deterministic
baseline of authored TypeScript source directories. The report can recommend a
direction and prepare a plan, but it does not amend
[ADR-166](../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md),
delete the rule, refactor any directory, select thresholds, or add a gate.

## Executive Synthesis

Oak should move directory cardinality out of per-file ESLint and into a
repository-level architectural-fitness validator suite. The suite should emit
deterministic, non-blocking observations for named consumers. File count is a
useful noticer of concentrated responsibility, but it is not a diagnosis, a
limit, or a refactoring instruction.

The deeper architectural hierarchy remains valid: complexity can migrate from
functions to files, from files to directories, and from directories to
workspaces. What changes is the assumption that every scale needs the same
enforcement mechanism. Syntax-local invariants belong in ESLint; repository
topology and concentration signals belong in the existing validator framework;
dependency and boundary invariants belong in graph or package-contract gates.

The current custom rule should remain untouched until its replacement has
equivalent deterministic coverage and discoverability. Because it is neither
exported nor configured today, replacing it does not weaken a live gate.

## Problem Frame

Oak deliberately constrains cyclomatic complexity, nesting, statements,
function length, and file length. Those controls can push complexity one level
up: many small files can accumulate in one directory without creating a clear
conceptual boundary. The original `max-files-per-dir` idea noticed this real
failure mode.

The implementation shape, however, places repository-wide inventory inside a
per-file ESLint rule. That creates a mismatch:

- ESLint visits individual files and syntax trees;
- directory cardinality requires deterministic repository discovery;
- the rule accepts caller-supplied directory inventories rather than deriving
  them;
- an absent inventory produces no finding;
- a finding is attached only to the alphabetically first file so that the same
  directory is not reported repeatedly.

The rule therefore carries repository analysis through an AST-oriented
interface without owning the analysis it needs.

## First-Hand Current State

The implementation and its tests lived at (deleted 2026-09-25 under the owner's
2026-09-14 ruling, the rule having never been registered):

- `max-files-per-dir.ts`
- `max-files-per-dir.test.ts`

The rule is not exported or registered by
[`plugin.ts`](../../packages/core/oak-eslint/src/plugin.ts). Its default maximum
is eight files, but no production ESLint configuration supplies the required
inventory. It is therefore implemented and tested in isolation but not active.

The shared ESLint configuration already enforces syntax-local constraints,
including complexity, depth, statement count, function length, and file length.
That is the right mechanism for those local properties.

The established repository validator framework lives under
[`agent-tools/src/validators`](../../agent-tools/src/validators). It already
supports independently tested, repository-aware validation and root command
wiring. It is a better home for deterministic discovery, role classification,
human-readable output, and machine-readable evidence.

### Baseline observation

A read-only scan counted production TypeScript and TSX files under authored
`src` directories, excluding tests, generated output, build output, and
dependencies. At the inspected worktree state it found:

- 1,632 files across 217 directories;
- 77 directories containing more than eight files;
- 28 directories containing more than twelve files.

The largest directories included collaboration-state mechanisms, refounding
mechanisms, search indexing, MCP transport code, curriculum MCP code, search
administration, and ground-truth entry collections. These are observations,
not violations. In particular, one-file-per-concept registries and data-like
collections can be large while remaining cognitively regular. Conversely, a
smaller directory can still mix responsibilities or violate a boundary.

The baseline falsifies immediate activation of the old default. It would
produce broad churn before establishing whether each result represents
architectural pressure, a deliberately flat registry, generated material, or a
classification error.

## Assumptions Challenged

### Assumption: file count measures architectural quality

It does not. Count detects concentration. It says where a human or agent should
look, not what they will find. Cohesion, change coupling, ownership, dependency
direction, public API shape, and lifecycle alignment determine the response.

### Assumption: every architectural scale should be a blocking limit

Different scales have different evidence quality. A forbidden dependency edge
can be a deterministic invariant. A directory count is a heuristic whose
meaning depends on the role of the files. Treating both as limits would erase
that distinction.

### Assumption: the existing rule is nearly ready to enable

It is not. Registration is the small missing step; deterministic inventory,
classification, output semantics, consumers, and remediation interpretation
are the larger design.

### Assumption: non-blocking means optional

It should not. A signal with no consumer becomes noise. Each signal needs a
named review surface, a stable output contract, and a recorded disposition.
What remains non-blocking is the exit status, not the obligation to interpret
the evidence when the agreed review cadence invokes it.

### Assumption: a threshold makes the report objective

A threshold makes sorting convenient; it does not make the interpretation
objective. Early reporting should present distributions, largest
concentrations, and role-separated counts. Thresholds may later define report
bands, but not implicit permission below the line or automatic failure above
it.

## Conceptual Model

### 1. Preserve the scale hierarchy; vary the mechanism

| Scale | Useful evidence | Appropriate semantics |
|---|---|---|
| Function and file | AST complexity, length, depth, statements | Blocking ESLint invariants where calibrated |
| Directory | Authored-file concentration, role mix, local change coupling | Non-blocking repository observation |
| Workspace | Layer mix, public API, fan-in/fan-out, deep imports | Observation plus blocking boundary invariants |
| Dependency graph | Cycles and forbidden edges | Blocking graph invariants |
| Estate trend | Deltas, hotspots, recurring dispositions | Review evidence only when a consumer exists |

This prevents complexity being punted upward without pretending that a line
count and a workspace boundary carry the same epistemic certainty.

### 2. Separate discovery, classification, and interpretation

The validator should have three explicit stages:

1. **Discovery** produces a stable, sorted inventory from declared repository
   roots.
2. **Classification** distinguishes production behaviour, tests, generated
   output, fixtures, registries/data, declarations, and documentation.
3. **Interpretation** reports observations and routes them to a named consumer;
   it does not prescribe a directory split.

A classification must be explainable and testable. Broad ignore lists would
hide the evidence. Role labels should preserve the count while explaining why
different groups should not be compared naively.

### 3. Provide two outputs from one analysis

- concise, human-readable console output for maintainers;
- stable JSON for agents, trend analysis, and later evidence bundles.

Both outputs should identify the repository revision, discovery roots,
exclusions, classification version, and validator version. The command should
exit successfully while it remains informational. Repository doctrine avoids
warnings as a terminal state, so the vocabulary should be **signal**,
**observation**, and **review candidate**, not warning or violation.

### 4. Keep invariants distinct from heuristics

The suite can eventually bring multiple architectural observations together,
but should not flatten them into one score. Candidate signals include:

- authored source count and source lines by directory and workspace;
- test-to-production distribution;
- role mixture within a directory;
- public export surface and wildcard exports;
- deep imports and internal-package fan-in/fan-out;
- dependency cycles, forbidden edges, and orphans;
- nested package markers and their explicit disposition.

Existing blocking tools remain authoritative for invariants they already own.
The fitness report can quote their results or route to them; it should not
duplicate dependency-cruiser, Knip, or ESLint.

### 5. Make anti-gaming part of the contract

A response is not successful merely because the count falls. Review should
reject:

- arbitrary subdirectories that add navigation without a concept;
- proxy workspaces or barrels that conceal coupling;
- moving code across neighbouring directories without changing ownership;
- threshold increases or exclusions whose only purpose is a cleaner report;
- deleting or compressing valuable documentation, tests, or evidence to satisfy
  a fitness number.

Valid responses include discovering that the directory is a well-structured
registry and recording that interpretation. The signal is allowed to result in
no structural change.

## Options Considered

### Enable the existing rule with a high threshold

Rejected as the primary direction. It preserves the mechanism mismatch,
encourages threshold negotiation, and still needs external inventory and role
classification.

### Keep the rule and add a repository inventory generator

Possible, but unnecessarily couples a repository-level analysis to per-file
lint reporting. It also duplicates output and orchestration concerns that the
validator framework already solves.

### Replace the rule with one directory-count validator

A good first slice, but incomplete as a final architecture. The validator
should be designed as the first member of an architectural-fitness suite so
classification, provenance, JSON output, and consumer routing can be reused.

### Build a dashboard first

Rejected. A deterministic command and versioned evidence contract should prove
value before adding storage or presentation infrastructure.

## Recommended Sequence

Each step includes the observation that warrants it and the evidence that
would falsify the direction.

1. **Ratify the semantics before implementation.**
   - Warrant: the baseline shows count is useful but not self-interpreting.
   - Falsifier: an owner requirement that directory count must be a strict
     repository invariant, with evidence that role variation is immaterial.
2. **Implement deterministic discovery and classification in the validator
   framework using TDD.**
   - Warrant: the ESLint rule does not own a reliable inventory.
   - Falsifier: an existing repository analysis surface is found that already
     supplies the complete contract without duplication.
3. **Ship directory concentration as a report-only first slice.**
   - Warrant: it directly preserves the original upward-complexity insight.
   - Falsifier: pilot reviewers cannot make repeatable dispositions from the
     signal even with role classification.
4. **Pilot contrasting directories, including behaviour code and a
   registry/data collection.**
   - Warrant: the baseline reveals both shapes among the largest directories.
   - Falsifier: classification cannot remain deterministic or becomes a manual
     allowlist disguised as taxonomy.
5. **Add further signals only for named consumers.**
   - Warrant: the existing visibility plan already names cross-scale evidence.
   - Falsifier: the consumer cannot state a decision the signal would inform.
6. **Retire the custom rule and its tests in the same change that proves
   replacement coverage and documentation.**
   - Warrant: parallel mechanisms would create conflicting semantics.
   - Falsifier: the rule is discovered to serve a syntax-local use case not
     covered by the replacement.
7. **Consider blocking promotion only for deterministic architectural
   invariants.**
   - Warrant: cycles, forbidden edges, and export-contract breaches have
     defined failure semantics; directory count does not.
   - Falsifier: longitudinal evidence establishes a count-based invariant with
     low ambiguity and an ungameable structural response.

## Plan and Decision Implications

The current
[Directory Complexity Enablement plan](../plans-backlog-2026-07/developer-experience/current/directory-complexity-enablement.execution.plan.md)
should be refounded around a report-only validator slice rather than ESLint
activation. The
[visibility-layer plan](../plans-backlog-2026-07/architecture-and-infrastructure/future/architectural-budget-visibility-layer.plan.md)
already contains much of the right contract and should become the parent
execution direction. The
[enforcement-layer plan](../plans-backlog-2026-07/architecture-and-infrastructure/future/architectural-budget-enforcement-layer.plan.md)
should treat directory cardinality as a signal unless later evidence supports
a genuine invariant.

ADR-166 remains the current authority. If the owner ratifies this synthesis, an
ADR amendment should clarify that “budget” does not mean “blocking maximum” at
every scale and should separate heuristic concentration signals from
enforceable invariants.

## Unresolved Evidence

The following could change implementation details or the recommendation:

- which review cadence and named role will consume the report;
- whether classifications can be derived entirely from repository structure or
  need small explicit annotations;
- whether change-coupling history is useful enough to justify Git-derived
  signals later;
- the stable JSON schema and whether any existing agent tool already consumes a
  compatible architecture report;
- which two contrasting directories are the most informative pilot cases;
- whether ADR-166's owner wants an amendment, a superseding ADR, or only plan
  clarification.

None of these gaps justifies enabling the existing rule first.
