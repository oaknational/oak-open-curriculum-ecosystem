---
name: "Skills Standardisation and Adapter Generator (FAILED — attempt 1)"
status: failed
superseded_by: ../current/skills-standardisation-and-adapter-generator.plan.md
overview: >
  FAILED 2026-05-09. Phase 1 documents (PDR-051, ADR-125 amendment, friction
  F-16) landed correctly. WS1 generator implementation was attempted without
  TDD discipline: ~700 lines of product code written before any test, no gates
  run, no reviewers dispatched, no verification of any kind. Code binned per
  owner direction. New plan supersedes with proper cycle-by-cycle TDD shape.
  Original overview preserved below for record.

  Original: Implement PDR-051 vendor-agnostic skills standardisation: non-discoverable
  canonical filename (SKILL-CANONICAL.md), exactly two adapter surfaces
  (.agents/skills/ + .claude/skills/), deterministic generator CLI, validator
  extension, full migration, custom-command retirement, comprehensive
  documentation.
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: frontmatter parser unit tests + product code (regex extraction, metadata.owned, multi-line description, BOM/CRLF). One commit."
    status: pending
  - id: ws1-cycle-2
    content: "WS1 cycle 2: owned/ingested consistency check unit tests + product code (XOR against skills-lock.json). One commit."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws1-cycle-3
    content: "WS1 cycle 3: generator core unit tests + product code (adapter id derivation, frontmatter rewrite, body emission, supporting-file bytewise copy). One commit."
    status: pending
    depends_on: [ws1-cycle-2]
  - id: ws1-cycle-4
    content: "WS1 cycle 4: CLI tests + product code (--help, --check, default regenerate, invalid-flag → full help on stderr exit 2). One commit."
    status: pending
    depends_on: [ws1-cycle-3]
  - id: ws2-cycle-1
    content: "WS2 cycle 1: validator extension tests + product code (canonical filename, two-surface contract, owned/lock consistency, bytewise equality, generator drift, PDR portability gate). One commit."
    status: pending
    depends_on: [ws1-cycle-4]
  - id: ws3-migration
    content: "WS3: migration — rename canonical files to SKILL-CANONICAL.md, add metadata.owned to owned canonical files, run generator, delete retired adapter surfaces, retire commands, validator strict-flip. Multiple commits for review legibility."
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws4-quality-gates
    content: "WS4: full quality gate chain (sdk-codegen → build → type-check → lint → test → portability:check)."
    status: pending
    depends_on: [ws3-migration]
  - id: ws5-doc-propagation
    content: "WS5: agent-tools/README, docs/engineering/skills-adapter-generation.md, TSDoc audit, research-doc corrections, practice-index update."
    status: pending
    depends_on: [ws4-quality-gates]
  - id: ws6-adversarial-review
    content: "WS6: code/type/test reviewers on generator; docs-adr-reviewer on PDR/ADR/research; architecture-reviewer-fred on boundary compliance."
    status: pending
    depends_on: [ws5-doc-propagation]
isProject: false
---

# Skills Standardisation and Adapter Generator — FAILED (attempt 1)

**Last Updated**: 2026-05-09
**Status**: 🔴 FAILED — superseded by [`../current/skills-standardisation-and-adapter-generator.plan.md`](../current/skills-standardisation-and-adapter-generator.plan.md)

## Failure Note (2026-05-09)

This plan was authored 2026-05-09 alongside PDR-051 and the ADR-125 amendment.
Phase 1 (documentation deliverables) landed correctly: PDR-051 published,
ADR-125 amended in place, friction register entry F-16 added, canonical repo
plan v1 written. Those documents are kept; nothing was committed.

**WS1 was attempted without TDD discipline and is binned in full.** Concretely:

- ~700 lines of product code (`agent-tools/src/skills-adapter-generate/`
  module — `frontmatter.ts`, `consistency.ts`, `generator.ts`, `cli.ts`,
  `fs-real.ts`, plus `agent-tools/src/bin/skills-adapter-generate.ts`)
  written in one pass before any test landed.
- One audit-shaped test file (`tests/skills-adapter-generate/frontmatter.unit.test.ts`)
  written after the code, mirroring the implementation rather than
  describing a behaviour the system must hold.
- No `pnpm agent-tools:type-check`, no `pnpm agent-tools:lint`,
  no `pnpm agent-tools:test`, no `pnpm portability:check` run.
- No reviewer dispatched (`code-reviewer`, `type-reviewer`, `test-reviewer`
  were named in the plan; none invoked).
- Boundary safety violated: `JSON.parse(...) as SkillsLockFile` cast
  in cli.ts without Ajv schema validation
  (`strict-validation-at-boundary` rule, `no-type-shortcuts` rule).
- Atomic-landing invariant broken: tests and product code did not travel
  together.

The owner-direction "1 hour, tighten it up" was a scope signal, not a
quality-discipline signal. The session responded to it by skipping the
TDD substrate the repo's rule set explicitly requires. This is the
named anti-pattern in `.agent/rules/no-speed-pressure.md`: the urge to
skip ceremony was the diagnostic, not the cure. Recovery is
straightforward — the documents are sound, the design is right; the
implementation simply needs to be re-laid under proper discipline.

**Disposition**:

- Documents kept and remain authoritative:
  - `.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md`
  - `docs/architecture/architectural-decisions/125-agent-artefact-portability.md`
    (Amended 2026-05-09 entry)
  - `.agent/plans/agent-tooling/frictions-register.md` (F-16)
- Code binned: `agent-tools/src/skills-adapter-generate/` and
  `agent-tools/src/bin/skills-adapter-generate.ts` and
  `agent-tools/tests/skills-adapter-generate/` removed 2026-05-09.
- New plan at `../current/skills-standardisation-and-adapter-generator.plan.md`
  supersedes this one with cycle-by-cycle TDD structure, explicit
  reviewer dispatch points, and Ajv-schema boundary validation.

The remainder of this file is the original plan content, preserved
unedited as the historical record of attempt 1.

---

# Skills Standardisation and Adapter Generator (original — superseded)

**Last Updated**: 2026-05-09
**Status**: 🟡 PLANNING
**Scope**: Implement PDR-051 doctrine in this repo. One canonical body per skill, two adapter surfaces, deterministic generator, custom commands retired.

---

## Context

Skills/commands carry duplicated content across five surfaces today:
`.agent/skills/` (37 canonical), `.agents/skills/` (47 — including 10
mis-shaped jc-* command-as-skill entries), `.cursor/skills/` (37),
`.claude/skills/` (37), plus 12 canonical commands with mirrored
adapters in `.claude/`, `.cursor/`, and `.gemini/`. Drift, double
registrations, and per-platform sprawl are the named consequence
(F-16). Primary-source verification of vendor docs confirmed two
adapter surfaces are sufficient and the canonical can be made
non-discoverable via filename. PDR-051 is the portable doctrine;
this plan is the host-side execution.

### Problem Statement

Single source of truth not preserved. Five adapter trees instead of
two. Custom command surface duplicates skill workflow space.
Validation gaps that allow drift. Generator-mandatory doctrine not
enforced because no generator exists.

### Existing Capabilities

- `scripts/validate-portability.ts` — extend rather than replace.
- `agent-tools` workspace — house the new generator CLI.
- `skills-lock.json` — already records ingested skills with content
  hashes; consume from generator and validator.
- Frontmatter regex helpers in `validate-portability.ts:57-67`.
- CLI conventions across `agent-tools` — pure functions with injected
  argv/env, exit-2-on-bad-invocation, full-help-on-invalid-flag (F-09).

---

## Design Principles

1. **One canonical, two adapters.** Non-discoverable canonical body
   filename. Exactly two adapter surfaces. No exceptions.
2. **Generator-mandatory.** Adapters are emitted, never edited. Header
   comment forbids manual edits; CI drift gate enforces.
3. **Spec-aligned.** `name` matches own parent directory in every
   emitted adapter. Spec-portable fields stay portable; platform
   specifics confined to native adapter via `metadata.<platform>-*` in
   canonical.
4. **Owned vs ingested disjoint.** Frontmatter `metadata.owned: true`
   XOR membership in `skills-lock.json`. Validator refuses both-or-neither.
5. **Bytewise supporting files.** Text and binary alike. Single rule,
   single failure mode.

**Non-Goals** (YAGNI):

- Manifest-driven adapter generation for sub-agents and rules
  (`future/adapter-generation.plan.md` retains that broader scope).
- Vendor-agnostic ingestion CLI for external skill packs
  (`future/canonical-first-skill-pack-ingestion-tooling.plan.md`).
- Cross-platform integration tests against real Claude/Cursor/Codex/Gemini
  CLIs (manual smoke verification only).
- Hooks portability standardisation (`future/hooks-portability.plan.md`).

---

## Build-vs-Buy Attestation

**Vendor**: agent-skills ecosystem tooling.

**First-party integrations surveyed**:

| Integration | Evaluated? | Adopted / ruled out + reason |
|---|---|---|
| Vercel `npx skills` (skills.sh) | yes | Ingestion-only — fetches remote skill packs into a local directory and tracks hashes. Does not generate adapter mirrors across multiple platforms from canonical source. Already used for ingested skills (recorded in `skills-lock.json`); orthogonal to the generator task. |
| OpenAI `openai/skills` skill-creator | yes | Authoring-only — scaffolds a single skill at a single platform path. Does not multi-platform-emit from canonical. Orthogonal. |
| `skills-ref validate` | yes | Per-skill validator (frontmatter + filename rules per spec). Adopt: invoke from `validate-portability.ts` against each generated adapter (not against canonical, which is non-discoverable by design). |

**Bespoke wrapper**: the generator. Justification: no first-party tool
multi-platform-emits adapters from a canonical-with-non-discoverable-filename
source. The generator is small (~300 LOC core + ~150 LOC CLI), aligned
with existing `agent-tools` patterns, and replaces no first-party
capability.

**Reviewer**: `assumptions-reviewer` runs against this attestation
post-WS1 (mid-cycle) given the design is owner-locked from prior
metacognition cycles.

---

## Reviewer Scheduling

**Pre-execution (already complete)**: metacognition cycles + primary-
source verification + assumptions-reviewer-equivalent surfaced
non-issues. PDR-051 + ADR-125 amendment landed before WS1.

**Mid-execution**:
- After WS1 (generator complete): `code-reviewer`, `type-reviewer`,
  `test-reviewer`.
- After WS2 (validator complete): `code-reviewer`, `test-reviewer`.
- During WS3 (migration): no reviewer — mechanical.

**Post-execution (WS6)**:
- `docs-adr-reviewer` — PDR-051, ADR-125 amendment,
  `docs/engineering/skills-adapter-generation.md`, research-doc
  corrections.
- `architecture-reviewer-fred` — boundary compliance, generator
  placement, validator extension shape.

---

## WS1 — Generator

> See [TDD Cycles component](../../templates/components/tdd-phases.md)

### Cycle 1.1: Frontmatter parser

**File scope**:
- `agent-tools/src/skills-adapter-generate/frontmatter.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/frontmatter.unit.test.ts` (NEW)

**Test (Red)**: parse canonical SKILL-CANONICAL.md fixtures with
multi-line description, escaped quotes, `metadata.owned`,
`metadata.<platform>-*` keys, BOM/CRLF tolerance. Reject malformed
frontmatter with named errors.

**Product (Green)**: regex-based extractor mirroring
`scripts/validate-portability.ts:57-67` patterns. Pure function;
returns parsed structure. No `gray-matter` / `js-yaml`.

**Acceptance**: `pnpm agent-tools:test --filter frontmatter` green.

### Cycle 1.2: Owned/ingested consistency check

**File scope**:
- `agent-tools/src/skills-adapter-generate/consistency.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/consistency.unit.test.ts` (NEW)

**Test (Red)**: given a canonical roster + lock-file fixture, assert
each skill is owned XOR ingested. Owned-and-locked → error with the
skill id. Neither → orphan error with remediation message naming the
likely cause (lock file deleted? skill not yet ingested?).

**Product (Green)**: pure function over `(canonicalRoster, lockFile)
→ Result<void, ConsistencyError[]>`.

### Cycle 1.3: Generator core

**File scope**:
- `agent-tools/src/skills-adapter-generate/generator.ts` (NEW)
- `agent-tools/src/skills-adapter-generate/index.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/generator.unit.test.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/fixtures/` (NEW — pinned canonical fixtures)

**Test (Red)**: given a canonical fixture, generate adapter content
in-memory; assert exact frontmatter shape, exact body text, header
comment present, supporting files bytewise-equal.

**Product (Green)**: `OWNED_PREFIX = "jc-"` constant in `index.ts`
(documented as the configurable repo-scope namespace).
`generateAdapter(canonical, target: "agents" | "claude") → Adapter`
emits the right shape per target. `bytewiseCopySupportingFiles(canonicalDir,
adapterDir)` for `references/` `scripts/` `assets/`.

**TSDoc**: every exported function carries description, parameters,
returns, and an example.

### Cycle 1.4: CLI

**File scope**:
- `agent-tools/src/skills-adapter-generate/cli.ts` (NEW)
- `agent-tools/src/bin/skills-adapter-generate.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/cli.unit.test.ts` (NEW)
- `agent-tools/package.json` (MODIFIED — add `skills-adapter-generate` script)
- `package.json` (MODIFIED — add `agent-tools:skills-adapter-generate` root alias)

**Test (Red)**:
- `runCli({argv: ['--help'], env: {}})` → exit 0, full help on stdout.
- `runCli({argv: [], env: {}})` → default mode regenerates all
  adapters under `.agents/skills/` and `.claude/skills/`; idempotent.
- `runCli({argv: ['--check'], env: {}})` → exit 1 on drift, 0 clean.
- `runCli({argv: ['--invalid-flag'], env: {}})` → exit 2, **full help
  text on stderr** (per F-09 standing convention), then specific
  error message.
- `runCli({argv: ['--prefix'], env: {}})` (missing value) → exit 2,
  full help on stderr.

**Product (Green)**: pure function with injected argv/env, mirroring
`agent-tools/src/agent-identity/cli.ts` pattern. Try/catch wrapper
emits exit-2 + full help on any parser error.

**Help text** documents:
- Synopsis (`pnpm agent-tools:skills-adapter-generate [--check]`)
- Modes: default (regenerate), `--check` (drift detect)
- Owned vs ingested classification
- Output surfaces (`.agents/skills/`, `.claude/skills/`)
- Manual-edit prohibition
- Exit codes
- Examples

---

## WS2 — Validator extension

### Cycle 2.1: New contract checks

**File scope**:
- `scripts/validate-portability.ts` (MODIFIED)
- `scripts/validate-portability.test.ts` if it exists, else add
  `agent-tools/tests/validate-portability/contract.unit.test.ts` (NEW)

**Tests** (Red): for each new check, fixture-driven assertions:

1. Canonical filename: every `.agent/skills/<id>/` contains
   `SKILL-CANONICAL.md`; no `SKILL.md` permitted under `.agent/skills/`.
2. Two-surface adapter shape: every owned canonical has
   `.agents/skills/jc-<id>/SKILL.md` AND `.claude/skills/jc-<id>/SKILL.md`;
   every ingested canonical has unprefixed adapter dirs at both
   surfaces. No other skill adapter surfaces exist.
3. Owned/lock consistency (same logic as generator's check).
4. Bytewise supporting-file equality between canonical and both
   adapter dirs.
5. Generator drift: invokes `pnpm agent-tools:skills-adapter-generate --check`;
   propagate exit code.
6. PDR portability gate: regex-scan each `.agent/practice-core/decision-records/PDR-*.md`
   for forbidden refs (`ADR-`, `docs/`, `src/`, `packages/`); allow
   the scope-exception cases (Practice's own canonical layout, http(s)
   citations).

**Product (Green)**: extend the validator with the six checks. Reuse
existing `extractFrontmatter` / `getFrontmatterValue`.

---

## WS3 — Migration

Mechanical commits for review legibility.

### 3.1: Rename canonical filenames

`git mv .agent/skills/<id>/SKILL.md .agent/skills/<id>/SKILL-CANONICAL.md`
for each of the 37 canonical skills. Add `metadata.owned: true` to
owned canonical files (cross-checked against `skills-lock.json`
complement — owned is the disjoint complement of ingested).

### 3.2: Run generator

`pnpm agent-tools:skills-adapter-generate`. Emits owned adapters at
`.agents/skills/jc-*/SKILL.md` and `.claude/skills/jc-*/SKILL.md` and
ingested adapters at unprefixed dirs in both surfaces. Bytewise-copies
supporting files.

### 3.3: Commands → skills

For each canonical command in `.agent/commands/`:

- Default: convert to a skill at `.agent/skills/<id>/SKILL-CANONICAL.md`
  with `metadata.owned: true` + `metadata.claude-user-invocable: 'true'`
  + `metadata.claude-argument-hint` if applicable. Body becomes the
  skill's workflow.
- Dead/redundant: delete (note in commit body).

Run generator. New skill adapters land at `.agents/skills/jc-<command>/`
and `.claude/skills/jc-<command>/`.

### 3.4: Delete retired surfaces

```bash
rm -rf .cursor/skills/ .gemini/skills/ .codex/skills/ .windsurf/skills/
rm -rf .agent/commands/ .claude/commands/ .cursor/commands/ .gemini/commands/
```

(Verify each exists before deletion; some are empty today.)

### 3.5: Validator strict-flip

Remove legacy adapter checks from `validate-portability.ts`; new
contract is the only contract.

---

## WS4 — Quality gates

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm lint && pnpm test && pnpm portability:check
```

`pnpm agent-tools:skills-adapter-generate --check` exit 0 (drift gate
green via portability:check, but invoke standalone too as a smoke
check).

---

## WS5 — Documentation

1. `agent-tools/README.md` — register `skills-adapter-generate` under
   Commands.
2. `docs/engineering/skills-adapter-generation.md` (NEW) — purpose,
   when to use, integration with `pnpm portability:check`, how to add
   a new owned skill, how to add an ingested skill, manual-edit
   prohibition, drift detection.
3. TSDoc audit: every exported function in
   `agent-tools/src/skills-adapter-generate/` has description, params,
   returns, example.
4. `.agent/research/agentic-engineering/standardising-skills.md`
   corrections in place: line 226 `should match` → `must match`; lines
   383–389 paraphrased Gemini quote stripped (substantive claim
   survives via spec); update `Last researched` header to 2026-05-09.
5. `.agent/practice-index.md` — register PDR-051 in the
   Practice-Core concept ↔ ADR map.
6. `.agent/plans/agent-tooling/future/adapter-generation.plan.md` —
   note that the skills-specific surface is now closed by this plan;
   the plan retains scope for sub-agents and rules.

---

## WS6 — Adversarial review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Reviewers per the schedule above. Document findings; create follow-up
plans if BLOCKERs land.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Frontmatter regex parser fails on edge cases | Mandatory test corpus: multi-line description, escaped quotes, BOM, CRLF, trailing whitespace. TDD-driven from corpus. |
| Single-commit migration creates horrifying review surface | WS3 split into mechanical commits 3.1–3.5; each individually reviewable. |
| Cross-vendor adapter activation can't be CI-verified | Manual smoke check (`/jc-go`, `/jc-plan`, `/jc-metacognition` register in Claude Code) documented in `docs/engineering/skills-adapter-generation.md`. Integration tests are out of scope (separate plan). |
| Generator drift between in-memory output and disk on partial failures | Generator writes per-skill atomically (write to temp dir, then rename); CI drift check catches any post-hoc divergence. |

---

## Foundation Alignment

- PDR-009 (canonical-first cross-platform architecture): preserved;
  this is a specialisation for the skills surface.
- PDR-024 (vital integration surfaces): Category D canonical agent
  artefact architecture refined for skills.
- PDR-035 (agent-work capabilities belong to the Practice): canonical
  is Practice substance; adapters are repo phenotype.
- PDR-051 (vendor-agnostic skills standardisation): the portable
  doctrine this plan implements.
- ADR-125 (agent artefact portability — three-layer model): amended
  in place 2026-05-09 with the host-side adoption of PDR-051.
- F-09 (full-help-on-invalid-flag): generator CLI must comply.
- F-16 (skills/commands surface sprawl): closed by this plan.

---

## Documentation Propagation

Captured in WS5 above. Outcomes mined into PDR-051, ADR-125 amendment,
`docs/engineering/skills-adapter-generation.md`, generator README,
research-doc corrections, `.agent/practice-index.md`.

---

## Consolidation

After WS6 passes, run `/jc-consolidate-docs` to graduate settled
content, rotate the napkin, and update the practice exchange. Update
`.agent/memory/operational/repo-continuity.md` with the closeout line.
Mark this plan completed and archive.

---

## Dependencies

**Blocking**: none (PR #102 graph planning is unrelated to skills
substrate).

**Related Plans**:
- [`future/adapter-generation.plan.md`](../future/adapter-generation.plan.md) — skills surface closed; sub-agents and rules remain in scope.
- [`future/canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md) — complementary; consumes the new generator and `skills-lock.json` shape.
- [`future/hooks-portability.plan.md`](../future/hooks-portability.plan.md) — sibling Layer-1/Layer-2 portability.

**Friction closed**: F-16 (skills/commands surface sprawl).
