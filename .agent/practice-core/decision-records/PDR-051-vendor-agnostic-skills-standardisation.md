---
pdr_kind: governance
---

# PDR-051: Vendor-Agnostic Skills Standardisation

**Status**: Accepted
**Date**: 2026-05-09
**Related**:
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(canonical-first cross-platform architecture — this PDR specialises the
three-layer model for the Agent Skills standard surface);
[PDR-024](PDR-024-vital-integration-surfaces.md)
(vital integration surfaces — skills doctrine is a Category D canonical
contract);
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(agent-work capabilities belong to the Practice — skills are Practice
substance by default).

## Context

The open Agent Skills standard (an Anthropic-originated open spec adopted
across Claude Code, Cursor, Codex, Gemini CLI, Amp, Vercel and others)
defines a skill as a directory containing a file named exactly `SKILL.md`,
with optional supporting files in `references/`, `scripts/`, and `assets/`.
The spec's `name` field must match the parent directory name, and
discovery is a flat scan over a vendor-known set of directories — most
vendors scan `.agents/skills/` (the cross-tool alias) plus their own
native path; one prominent vendor scans only its native path.

In a Practice-bearing repo with multiple supported platforms, a naive
implementation of canonical-first (PDR-009) for skills produces three
recurring failure modes:

**Discovery duplication.** When the canonical skill body lives at the
same filename and discoverable directory as adapter copies, every
platform that scans both surfaces registers the skill twice. The
duplication is silent in some clients and emits "Names must be unique"
warnings in others.

**Adapter sprawl.** With four or five supported platforms, naively
generating a per-platform adapter for every skill produces an N×M
adapter surface that drifts and rots. Only two surfaces are actually
required across all current platforms: the cross-tool alias and the one
vendor-native path that the cross-tool alias does not cover.

**Manual editing of adapters.** Without a generator, contributors edit
adapters directly to clear validation failures or to add platform-specific
metadata. Each manual edit is a chance for the canonical and the
adapters to diverge.

**Custom commands as a parallel surface.** Custom slash-command surfaces
(`<platform>/commands/`) duplicate workflows that already exist as
skills. Industry direction is unanimous: commands are merging into
skills as the unified user-and-model-invokable workflow surface.

A doctrine that resolves all four failure modes must (a) keep canonical
content invisible to vendor discovery, (b) limit adapter surfaces to the
documented minimum, (c) make adapter generation deterministic and
machine-owned, and (d) treat skills as the unified workflow surface,
retiring custom commands.

## Decision

**Skills are authored canonically as non-discoverable source files; two
deterministic adapter surfaces are emitted by a mandatory generator;
custom commands are subsumed into the skills surface.**

### Canonical source

Every skill is authored at the platform-agnostic canonical surface
(typically `.agent/skills/<id>/`). The canonical body lives in a
**non-discoverable filename** — a filename that no documented vendor
discovery scanner matches as a skill (i.e. not exactly `SKILL.md`, and
not any future fuzzy match a strict client might apply). The canonical
filename signals "this is the source of truth, not the discovery
target".

Supporting files (`references/`, `scripts/`, `assets/`) live alongside
the canonical body. The canonical body declares its skill root
explicitly so that when the canonical is read through an adapter, all
relative paths resolve against the canonical directory.

The canonical's `name` field matches its own parent directory name, per
spec. Owned skills (authored within the Practice-bearing repo) carry a
metadata flag distinguishing them from skills ingested from external
packs.

### Adapter surfaces

Only two adapter surfaces are emitted, regardless of platform count:

1. **The cross-tool alias surface** (the `.agents/skills/` plural path),
   which the majority of current platforms scan natively or as a
   documented alias.
2. **One vendor-native surface** for the platform that does not read the
   cross-tool alias. (At time of authoring, this is Claude Code, which
   scans `.claude/skills/` only.)

Adapter directories use the documented discovery filename (`SKILL.md`).
Adapter frontmatter satisfies the spec's `name`-matches-directory rule
locally. Adapter bodies contain only the canonical-read instruction.

Other vendor-specific skill paths (`.cursor/skills/`, `.gemini/skills/`,
`.codex/skills/`, etc.) are **not** emitted. Their platforms read the
cross-tool alias; emitting per-vendor adapters re-introduces the very
duplication the standard's alias was designed to eliminate.

### Generator-mandatory

Adapters are emitted by a deterministic generator from canonical
source. Manual editing of adapters is forbidden by header comment
in every emitted file and enforced by a drift gate that fails CI when
emitted output diverges from regenerated output.

The generator's responsibilities:

- Parse canonical frontmatter and body.
- Compute the adapter identifier (canonical name, optionally with a
  configurable owned-skill prefix).
- Emit adapter `SKILL.md` files with spec-portable frontmatter for the
  cross-tool surface and spec-portable plus platform-specific frontmatter
  for the native surface.
- Bytewise copy supporting files from canonical to both adapter
  directories (text and binary alike — pointer-shaped supporting files
  do not work uniformly across file types).
- Verify owned/ingested classification consistency: a skill must be
  either owned (authored locally) or ingested (recorded in the lock
  file) — never both, never neither.

### Owned vs ingested classification

Ingested skills (vendor-distributed, installed via skill-pack tooling)
are recorded in a lock file (typically `skills-lock.json`) with their
upstream source and content hash. Ingested skills retain their
upstream identity in adapters; they receive no local prefix.

Owned skills are authored locally and carry an explicit
`metadata.owned: true` flag in canonical frontmatter. Owned skills may
optionally receive a configurable prefix (e.g. `<repo>-<id>`) in
adapter directories to disambiguate them from third-party packs in
shared skill-discovery menus, without touching canonical identity.

A consistency check (in the generator and re-asserted in the
portability validator) refuses to operate when:

- A skill is marked owned and also recorded in the lock file
  (contradictory ownership claim), or
- A skill is neither marked owned nor recorded in the lock file
  (orphan: unable to classify).

A deleted lock file produces many orphan errors with a remediation
message, rather than silently re-prefixing every skill.

### Commands subsumed into skills

Custom slash-command surfaces (`<platform>/commands/` and a canonical
`<canonical>/commands/`) are retired. Each canonical command becomes
either a skill, an inlined section of an existing skill, or a deletion
(when the command is dead).

User-invokable behaviour previously provided by commands is preserved
by the skills surface itself: every documented platform that supports
slash invocation registers a skill at `<surface>/skills/<id>/SKILL.md`
as a slash-invocable workflow whose name equals the directory name.
Platform-specific frontmatter (argument hints, tool restrictions,
model selection) lives on the adapter and is generated from canonical
metadata.

### Frontmatter strategy

The canonical carries the union of metadata across surfaces under a
single frontmatter, using:

- The standard portable fields (`name`, `description`, `license`,
  `compatibility`, `metadata`, `allowed-tools`).
- Platform-prefixed string values under `metadata.<platform>-<field>`
  for platform-specific behaviour (e.g. `metadata.<platform>-argument-hint`,
  `metadata.<platform>-user-invocable`).

The generator emits real top-level fields per platform from the
platform-prefixed metadata strings. The cross-tool adapter receives
only spec-portable fields; platform-specific fields are confined to
the native adapter.

### Validation

Portability validation checks, beyond the existing canonical-first
contract:

- Canonical filename present and non-discoverable.
- Two adapter surfaces present and exactly two; no other skill adapter
  surfaces exist.
- Adapter `name` matches its own directory.
- Owned/ingested classification consistent with the lock file.
- Bytewise equality of supporting files between canonical and both
  adapter directories.
- Generator drift: regenerated output equals committed output.

Canonical filename and forbidden-adapter-surface checks together
enforce the discovery-exclusion property structurally.

## Rationale

Five options were considered.

**Option A — One adapter surface per platform.** Per-platform skill
adapter trees (`<platform>/skills/`) for each supported vendor.
Rejected: re-introduces N×M sprawl that the cross-tool alias was
designed to eliminate; also re-introduces drift and double-registration
on platforms that scan multiple paths.

**Option B — Canonical at the discovery surface.** Author skills
directly under the cross-tool alias and let platforms discover them
in place. Rejected: removes the canonical/adapter distinction
entirely; loses the platform-specific frontmatter mechanism (a single
adapter cannot carry both spec-portable and platform-specific
top-level fields without violating the spec's name-matches-directory
rule); and the cross-tool alias is itself one of several discovery
paths, not a universal substrate.

**Option C — Symlinked adapters.** Symlink adapter directories at
canonical content. Rejected: cross-platform fragility (Windows, some
package managers, some sandboxes do not follow), violates the
no-symlinks discipline established in PDR-009 by adapter contract.

**Option D — Pointer-shaped supporting files in adapters.** Generate
adapter trees with markdown pointer files standing in for canonical
supporting files. Rejected: pointer shape works for text supporting
files but breaks for binary assets and executable scripts, requiring a
per-file-type policy split that is more complex than the bytewise-copy
alternative without a meaningful single-source benefit.

**Option E (adopted) — Non-discoverable canonical filename + two
adapter surfaces + bytewise supporting-file copies + generator-mandatory.**
Resolves all four failure modes:

- Discovery duplication eliminated by non-discoverable canonical
  filename.
- Adapter sprawl eliminated by emitting only the two surfaces every
  platform actually requires.
- Manual editing prevented by generator-mandatory + drift gate.
- Custom commands retired by treating skills as the unified workflow
  surface.

The supporting-file bytewise-copy choice trades working-tree size
(each supporting file present in canonical plus two adapter copies)
against single-source simplicity (one file shape, one generator
behaviour, one validator check). The trade-off favours simplicity:
working-tree size grows by a small constant factor; complexity is
held flat.

**Why a non-discoverable canonical filename, not a non-discoverable
canonical directory.** Both work today. The filename is the load-bearing
discriminator across every documented vendor discovery scanner; the
directory adds a second guard. Future-proofing is strongest with both,
which this doctrine adopts.

**Why two adapter surfaces, not one.** Some platforms read the
cross-tool alias; one prominent platform reads only its native path.
Both must be served. Other platforms that document a native path also
read the cross-tool alias (often with documented precedence), so a
single cross-tool surface plus a single Claude-native surface suffices
for the entire current platform set.

**Why a configurable owned-skill prefix.** Disambiguation in shared
slash-command menus when third-party skill packs collide with locally
authored skills. The prefix is repo-scope and applied only at adapter
emission; canonical identity is unprefixed. Repos that ship skills
externally (as plugins) do not need the prefix because plugin loaders
namespace automatically. The configurability lets a repo change the
prefix without re-authoring canonical content.

## Consequences

### Required

- Every owned skill carries `metadata.owned: true` in canonical
  frontmatter. Every ingested skill is recorded in the lock file. The
  two sets are disjoint and exhaustive.
- The canonical filename is non-discoverable and consistent across all
  skills in a Practice-bearing repo.
- Exactly two adapter surfaces exist for skills: the cross-tool alias
  surface and one vendor-native surface.
- Adapters are generated, never edited by hand. Every emitted adapter
  carries a header comment forbidding manual edits.
- The portability validator enforces all of: canonical filename,
  two-surface contract, owned/ingested consistency, bytewise
  supporting-file equality, and generator drift.
- Custom command surfaces are retired in favour of skills as the
  unified workflow.
- The generator CLI prints full help on any invalid invocation
  (consistent with the wider Practice convention for agent-facing
  CLIs).

### Forbidden

- Manual edits to emitted adapter files. The header comment is the
  contract; the drift gate is the enforcement.
- Per-platform skill adapter surfaces beyond the documented two.
  Adding a third surface re-introduces the duplication the standard's
  cross-tool alias eliminates.
- Using the canonical's spec-portable filename for the canonical body.
  The discovery scanner cannot distinguish source-of-truth from
  copy when the filename is identical.
- Custom slash-command surfaces parallel to the skills surface for
  workflows. Skills cover both user-invokable and model-invokable
  invocation patterns.
- Owned-and-locked simultaneously, or neither-owned-nor-locked. Both
  are classification errors; the validator refuses to proceed until
  resolved.

### Accepted cost

- Working-tree size grows: each supporting file lives in canonical
  plus two adapter copies. The factor is small and constant.
- A minor amount of duplicate-name warning on platforms that scan
  both adapter surfaces (i.e. tools that scan the cross-tool alias
  and a vendor-native path simultaneously, then surface "Names must
  be unique" notices). Unavoidable given the split-surface platform
  population; documented and accepted.
- The configurable owned-skill prefix produces slightly longer slash
  invocations for owned skills than for ingested ones, in exchange
  for collision-free menus.

### Accepted limitation — supporting-file activation boundary

Some platforms add the activated-skill directory to their access-grant
set on activation. Canonical supporting files reach adapter copies via
the bytewise copy, so activation always sees the supporting files in
the activated directory. Edits to supporting files happen at canonical
and propagate via the generator; the same file's adapter copy is
re-emitted bytewise on the next generator run. Validators detect and
fail on drift between canonical and adapters.

## Notes

### Relationship to PDR-009

PDR-009 establishes canonical-first cross-platform architecture for
all agent artefacts: canonical content + thin adapters + entry points,
across rules, skills, commands, and sub-agents. This PDR specialises
the model for skills under the open Agent Skills standard, where the
spec's flat-discovery design and `name`-matches-directory rule make
the naive three-layer instantiation unsafe (filename collision causes
double-registration). The non-discoverable-canonical-filename
discipline keeps PDR-009's substance — one canonical source, thin
adapters — while preventing the discovery scanner from misclassifying
the canonical as a discoverable adapter.

### Relationship to PDR-024

PDR-024's Category D names "canonical agent artefact architecture"
as a vital integration surface. This PDR is one specialisation of
that surface. A repo cannot satisfy Category D for skills without
either this doctrine or an equivalent one that resolves the four
failure modes named in Context.

### Relationship to PDR-035

PDR-035 establishes that agent-work capabilities are Practice
substance by default; phenotype expressions live locally. Skills are
Practice substance: the canonical body carries the workflow doctrine,
not the host. The two adapter surfaces are phenotype: they express
the host's choice of which platforms to support and how those
platforms surface the skill. This PDR defines the canonical/phenotype
split for skills specifically; the broader phenotype boundary lives
at PDR-035 and host-side ADRs.

### Graduation intent

This PDR's substance is a candidate for graduation into
`practice-lineage.md` once the doctrine has stabilised across
multiple cross-platform hydrations. Until then it remains a portable
PDR.
