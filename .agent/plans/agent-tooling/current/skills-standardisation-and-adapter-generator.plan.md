---
name: "Skills Standardisation and Adapter Generator"
overview: >
  Implement PDR-051 vendor-agnostic skills standardisation in this repo
  under strict cycle-by-cycle TDD discipline. Each cycle ends with a
  green commit containing the failing test plus the product code that
  greens it. Documents (PDR-051, ADR-125 amendment, friction F-16)
  already landed in attempt 1; this plan re-implements the generator,
  validator extensions, migration, and documentation propagation
  cleanly.
todos:
  - id: ws0-pre-execution-plan-review
    content: "WS0 (MANDATORY before any implementation): dispatch assumptions-reviewer + test-reviewer + architecture-reviewer-fred + docs-adr-reviewer in parallel on this plan and the kept attempt-1 documents. Address findings before WS1.1. No code edits in this todo."
    status: pending
  - id: ws1-cycle-1-lock-loader
    content: "WS1.1: Ajv schema + loader for skills-lock.json. Test: schema rejects malformed; valid lock returns id set. Product: src/skills-adapter-generate/lock.ts. One commit."
    status: pending
    depends_on: [ws0-pre-execution-plan-review]
  - id: ws1-cycle-2-frontmatter
    content: "WS1.2: canonical frontmatter parse/emit round-trip. Test: real fixture round-trips bytewise; multi-line description preserved. Product: src/skills-adapter-generate/frontmatter.ts. One commit."
    status: pending
    depends_on: [ws1-cycle-1-lock-loader]
  - id: ws1-cycle-3-consistency
    content: "WS1.3: owned-XOR-locked consistency check. Test: owned+locked → error; neither → orphan; pure ok→ok. Product: src/skills-adapter-generate/consistency.ts. One commit."
    status: pending
    depends_on: [ws1-cycle-1-lock-loader]
  - id: ws1-cycle-4-cross-tool-adapter
    content: "WS1.4: cross-tool adapter generator (.agents/skills). Test: emitted adapter has spec-portable frontmatter only, name = jc-<id> for owned, body = read instruction. Product: src/skills-adapter-generate/generator.ts (cross-tool path). One commit."
    status: pending
    depends_on: [ws1-cycle-2-frontmatter]
  - id: ws1-cycle-5-claude-adapter
    content: "WS1.5: Claude adapter generator with metadata.claude-* hoisting. Test: claude-argument-hint hoists to top-level argument-hint; non-claude metadata preserved. Product: extends generator.ts. One commit."
    status: pending
    depends_on: [ws1-cycle-4-cross-tool-adapter]
  - id: ws1-cycle-6-supporting-files
    content: "WS1.6: bytewise supporting-file copier. Test: references/, scripts/, assets/ copied bytewise into both adapter dirs; binary preserved. Product: src/skills-adapter-generate/supporting-files.ts + integration test using temp dirs. One commit."
    status: pending
    depends_on: [ws1-cycle-5-claude-adapter]
  - id: ws1-cycle-7-cli
    content: "WS1.7: CLI runner. Test: --help exit 0 stdout; --check exit 0/1; invalid flag exit 2 with FULL help on stderr (F-09). Product: src/skills-adapter-generate/cli.ts + parser. One commit."
    status: pending
    depends_on: [ws1-cycle-6-supporting-files]
  - id: ws1-cycle-8-bin-shim
    content: "WS1.8: bin shim + agent-tools script + root pnpm alias. Test: integration — pnpm agent-tools:skills-adapter-generate --help exits 0. Product: src/bin/skills-adapter-generate.ts + package.json updates. One commit."
    status: pending
    depends_on: [ws1-cycle-7-cli]
  - id: ws1-mid-review
    content: "WS1 mid-review: dispatch code-reviewer + type-reviewer + test-reviewer in parallel on the generator module. Address findings in a follow-up commit if needed."
    status: pending
    depends_on: [ws1-cycle-8-bin-shim]
  - id: ws2-cycle-1-canonical-filename
    content: "WS2.1: validator check — every .agent/skills/<id>/ has SKILL-CANONICAL.md and no SKILL.md. Test: fixture-driven; mixed cases; empty dirs. Product: extend scripts/validate-portability.ts. One commit."
    status: pending
    depends_on: [ws1-mid-review]
  - id: ws2-cycle-2-two-surface
    content: "WS2.2: validator check — exactly two adapter surfaces; .cursor/skills, .gemini/skills, .codex/skills, .windsurf/skills must not exist. Test + product. One commit."
    status: pending
    depends_on: [ws2-cycle-1-canonical-filename]
  - id: ws2-cycle-3-owned-lock
    content: "WS2.3: validator check — owned/lock consistency programmatic. Test + product (reuses consistency.ts). One commit."
    status: pending
    depends_on: [ws2-cycle-2-two-surface]
  - id: ws2-cycle-4-supporting-equality
    content: "WS2.4: validator check — bytewise supporting-file equality between canonical and both adapter dirs. Test + product. One commit."
    status: pending
    depends_on: [ws2-cycle-3-owned-lock]
  - id: ws2-cycle-5-drift
    content: "WS2.5: validator check — invoke generator --check; propagate exit code. Test + product. One commit."
    status: pending
    depends_on: [ws2-cycle-4-supporting-equality]
  - id: ws2-cycle-6-pdr-portability
    content: "WS2.6: validator check — PDR portability gate (regex-scan PDR-*.md for forbidden ADR-NNN, docs/, src/, packages/ refs). Test + product. One commit."
    status: pending
    depends_on: [ws2-cycle-5-drift]
  - id: ws2-mid-review
    content: "WS2 mid-review: code-reviewer + test-reviewer on validator extension. Address findings."
    status: pending
    depends_on: [ws2-cycle-6-pdr-portability]
  - id: ws2-5-pre-migration-direction-check
    content: "WS2.5 plan-direction review: dispatch architecture-reviewer-fred + assumptions-reviewer on the post-WS2 plan state. Confirm WS3 migration shape, command-audit policy, and validator strict-flip sequencing are still right before destructive migration begins."
    status: pending
    depends_on: [ws2-mid-review]
  - id: ws3-cycle-1-rename
    content: "WS3.1 (mechanical): git mv .agent/skills/<id>/SKILL.md SKILL-CANONICAL.md × 37. Tree green via legacy validator only (validator strict-flip is WS3.8). One commit."
    status: pending
    depends_on: [ws2-5-pre-migration-direction-check]
  - id: ws3-cycle-2-owned-flag
    content: "WS3.2 (mechanical): add metadata.owned: true to owned canonical frontmatter (skills NOT in skills-lock.json). One commit."
    status: pending
    depends_on: [ws3-cycle-1-rename]
  - id: ws3-cycle-3-skill-root-section
    content: "WS3.3: add 'Skill root: .agent/skills/<id>/' section to canonical body of each owned skill (per agentskills.io supporting-file resolution rule). One commit."
    status: pending
    depends_on: [ws3-cycle-2-owned-flag]
  - id: ws3-cycle-4-first-generate
    content: "WS3.4: pnpm agent-tools:skills-adapter-generate; commit emitted .agents/skills/jc-* and .claude/skills/jc-* adapters + supporting-file copies. One commit."
    status: pending
    depends_on: [ws3-cycle-3-skill-root-section]
  - id: ws3-cycle-5-delete-retired-skill-surfaces
    content: "WS3.5: rm -rf .cursor/skills/ .gemini/skills/ .codex/skills/ .windsurf/skills/. One commit."
    status: pending
    depends_on: [ws3-cycle-4-first-generate]
  - id: ws3-cycle-6-command-audit
    content: "WS3.6: per-command audit — for each .agent/commands/*.md, decide skill / inline / delete. Audit document recorded as commit body. No file changes in this cycle."
    status: pending
    depends_on: [ws3-cycle-5-delete-retired-skill-surfaces]
  - id: ws3-cycle-7-command-migration
    content: "WS3.7: convert kept commands to canonical skills (.agent/skills/<id>/SKILL-CANONICAL.md with metadata.owned: true and Claude metadata fields). Run generator. One commit per converted command (or grouped if mechanically identical)."
    status: pending
    depends_on: [ws3-cycle-6-command-audit]
  - id: ws3-cycle-8-delete-command-surfaces
    content: "WS3.8: rm -rf .agent/commands/ .claude/commands/ .cursor/commands/ .gemini/commands/. One commit."
    status: pending
    depends_on: [ws3-cycle-7-command-migration]
  - id: ws3-cycle-9-validator-strict-flip
    content: "WS3.9: remove legacy adapter checks from scripts/validate-portability.ts. New contract is the only contract. Test the removal. One commit."
    status: pending
    depends_on: [ws3-cycle-8-delete-command-surfaces]
  - id: ws4-quality-gates
    content: "WS4: full quality gate chain: pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint && pnpm test && pnpm portability:check. All green."
    status: pending
    depends_on: [ws3-cycle-9-validator-strict-flip]
  - id: ws5-cycle-1-readme
    content: "WS5.1: agent-tools/README.md — register skills-adapter-generate under Commands. One commit."
    status: pending
    depends_on: [ws4-quality-gates]
  - id: ws5-cycle-2-engineering-doc
    content: "WS5.2: docs/engineering/skills-adapter-generation.md — purpose, when to use, integration with portability:check, how to add owned/ingested skill, manual-edit prohibition, drift detection. One commit."
    status: pending
    depends_on: [ws5-cycle-1-readme]
  - id: ws5-cycle-3-tsdoc-audit
    content: "WS5.3: TSDoc audit on every exported function in agent-tools/src/skills-adapter-generate/ — description, params, returns, example. One commit."
    status: pending
    depends_on: [ws5-cycle-2-engineering-doc]
  - id: ws5-cycle-4-research-corrections
    content: "WS5.4: .agent/research/agentic-engineering/standardising-skills.md corrections in place — line 226 'should match' → 'must match'; lines 383–389 paraphrased Gemini quote stripped; Last researched 2026-05-09. One commit."
    status: pending
    depends_on: [ws5-cycle-3-tsdoc-audit]
  - id: ws5-cycle-5-practice-index
    content: "WS5.5: .agent/practice-index.md — register PDR-051 in Practice-Core concept ↔ ADR map; future/adapter-generation.plan.md note that skills surface is closed. One commit."
    status: pending
    depends_on: [ws5-cycle-4-research-corrections]
  - id: ws6-adversarial-review
    content: "WS6: docs-adr-reviewer on PDR-051 + ADR-125 + engineering doc + research corrections; architecture-reviewer-fred on boundary compliance + ADR amendment shape. Address BLOCKERs in follow-up commits."
    status: pending
    depends_on: [ws5-cycle-5-practice-index]
  - id: ws6-consolidation
    content: "WS6: /jc-consolidate-docs — graduate settled content, rotate napkin, update repo-continuity, mark plan completed, archive."
    status: pending
    depends_on: [ws6-adversarial-review]
isProject: false
---

<!-- TDD shape (mandatory). Each WS that lands product code is a SEQUENCE
     of test+code CYCLES. Each cycle is one commit containing:
       (a) the failing test that describes the new behaviour;
       (b) the product code that makes it pass;
       (c) any in-cycle refactor.
     Tests and product code never separate across commits. The tree is green
     at the end of every cycle. WS1 cycles 1.1-1.8 must each end with
     `pnpm agent-tools:test`, `pnpm agent-tools:type-check`, and
     `pnpm agent-tools:lint` exiting 0. WS2 cycles must additionally end
     with `pnpm portability:check` exiting 0.

     Attempt 1 (2026-05-09) failed by writing all product code in one pass
     before any test. The current attempt re-establishes the cycle invariant.
     If a cycle is tempted to skip a step, stop and note the impulse — that
     is the failure mode this plan exists to prevent. -->

# Skills Standardisation and Adapter Generator

**Last Updated**: 2026-05-09
**Status**: 🟡 PLANNING (attempt 2)
**Scope**: Implement [PDR-051](../../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md) in this repo: one canonical body per skill (`SKILL-CANONICAL.md`), exactly two adapter surfaces (`.agents/skills/` + `.claude/skills/`), generator-mandatory, custom commands retired.

---

## Next-Session First Action (READ ME FIRST)

**Before any implementation begins, dispatch the WS0 pre-execution plan review.** Attempt 1 (2026-05-09) failed by skipping the substrate review and going straight to code; this plan exists in part to prevent that recurrence.

The next session's first concrete action is the WS0 todo — four specialist reviewers, dispatched in parallel against this plan and the kept attempt-1 documents (PDR-051, ADR-125 amendment, friction F-16). Implementation does not begin until WS0 findings are addressed.

If a session opens this plan and feels the impulse to start coding, that impulse is the diagnostic the `no-speed-pressure` rule names. The cure is to dispatch WS0 instead.

See [§Pre-Execution Plan Review](#ws0--pre-execution-plan-review-mandatory) below for the dispatch briefs and acceptance criteria.

---

## Context

Phase 1 documents already landed (attempt 1):

- [`PDR-051-vendor-agnostic-skills-standardisation.md`](../../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md) — portable doctrine.
- [`ADR-125 (Amended 2026-05-09)`](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md) — host adoption.
- [`F-16`](../frictions-register.md) — drift signal addressed by this plan.
- Failed attempt-1 record: [`../archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md`](../archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md).

This plan implements the generator, validator extensions, mass migration, and documentation propagation. It is the only artefact that adds product behaviour; the docs are unchanged from attempt 1.

### Problem statement

`.agent/skills/` currently has 37 canonical bodies named `SKILL.md` (discoverable filename). Adapters duplicate full content across five surfaces (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, plus 12 commands × 3 platform mirrors). The duplication is a single-source-of-truth violation enabled by the lack of a generator and the discoverable canonical filename. The cure is the PDR-051 design.

### Existing capabilities to reuse

- `scripts/validate-portability.ts` (lines 57–67) — `extractFrontmatter` and `getFrontmatterValue` regex patterns. Reused as the parser substrate.
- `agent-tools/src/bin/agent-identity-cli.ts` and `agent-identity-cli-parser.ts` — CLI shape: pure-function runner with injected argv/env, exit-2 on bad usage, `--help`/`-h` early exit. Reused as the CLI substrate.
- `ajv` (`agent-tools` dependency) — JSON schema validator. Used at the `skills-lock.json` boundary.
- `vitest` — test framework; existing pattern uses pure-function unit tests + temp-fs integration tests.
- `pnpm portability:check` — gate already wired into `.husky/pre-push:46-49` and `.github/workflows/ci.yml:62-63`. Extended in WS2; no new gate plumbing needed.
- `skills-lock.json` — existing 12-entry ingested-skill registry. Schema unchanged.

---

## Design Principles

1. **Cycle-by-cycle TDD.** No product code without a paired failing test landing in the same commit. The tree is green at the end of every cycle.
2. **Boundary validation before logic.** `skills-lock.json` is parsed under an Ajv schema before any consumer touches it; no `as` casts at trust boundaries (`strict-validation-at-boundary`, `no-type-shortcuts`).
3. **Pure functions injectable for tests.** The CLI takes argv + cwd + fs as input; the real-fs implementation lives behind the same interface as the test in-memory fs.
4. **Full help on every invalid invocation.** Per friction F-09, every parser error prints the FULL help text on stderr followed by the specific error, then exits 2.
5. **Generator output is checked in.** Manual edits to emitted files are forbidden by header comment; the drift gate enforces.

**Non-goals** (YAGNI):

- Manifest-driven adapter generation for sub-agents and rules (`future/adapter-generation.plan.md`).
- External skill-pack ingestion CLI (`future/canonical-first-skill-pack-ingestion-tooling.plan.md`).
- Cross-platform integration tests against real Claude/Cursor/Codex/Gemini CLIs.
- Hooks portability standardisation (`future/hooks-portability.plan.md`).

---

## Build-vs-Buy Attestation

**Vendor**: Agent Skills ecosystem tooling.

| Integration | Evaluated? | Adopted / ruled out |
|---|---|---|
| Vercel `npx skills` (skills.sh) | yes | Ingestion-only — pulls remote packs, hashes them. Does not multi-platform-emit adapters from a canonical with non-discoverable filename. Already used by ingested-skill flow recorded in `skills-lock.json`; orthogonal to this work. |
| OpenAI `openai/skills` skill-creator | yes | Authoring-only — scaffolds a single skill at a single platform path. Not a multi-platform generator. Orthogonal. |
| `skills-ref validate` | yes (deferred adopt) | Per-skill spec validator. Not used for canonical (which is non-discoverable by design). Adoption is a separate decision once adapters stabilise; out of scope here. |
| `js-yaml` / `gray-matter` | yes | Rejected — repo convention (`scripts/validate-portability.ts:57-67`) parses frontmatter via regex; the canonical YAML subset we author is bounded (top-level scalars + folded block scalars + nested `metadata` mapping); a full YAML parser is more surface than the bounded subset needs. Reuse the regex pattern. |
| `ajv` | yes — adopt | Already a direct dependency of `agent-tools`. Used to validate `skills-lock.json` at the boundary. |

**Bespoke wrapper**: the generator core (~300 LOC) and CLI (~150 LOC). No first-party tool multi-platform-emits adapters from a canonical-with-non-discoverable-filename source. The bespoke surface is small, aligned with existing CLI conventions, and replaces no first-party capability.

**Reviewer**: `assumptions-reviewer` POST WS1.8 to verify the build-vs-buy posture survives implementation and that no first-party capability would have done the job.

---

## Reviewer Scheduling

Reviews fire in three classes: **plan-direction reviews** (does the plan still point the right way), **work reviews** (is the code/docs that landed structurally sound), and **release reviews** (is the integrated result shippable). Plan-direction reviews are non-negotiable at named workstream boundaries — a session that skips them is the named attempt-1 failure mode.

| Phase | Class | Reviewer | Trigger |
|---|---|---|---|
| **WS0 — pre-execution** | plan-direction | `assumptions-reviewer`, `test-reviewer`, `architecture-reviewer-fred`, `docs-adr-reviewer` (parallel) | **MANDATORY before any implementation.** See §WS0 below for briefs. |
| WS1 mid-review (after WS1.8) | work | `code-reviewer`, `type-reviewer`, `test-reviewer` (parallel) | Generator + CLI complete; before WS2 begins. |
| WS1 mid-review (after WS1.8) | plan-direction | `assumptions-reviewer` | Build-vs-buy survival check. Has implementation surfaced any first-party capability that would have done the job? |
| WS2 mid-review (after WS2.6) | work | `code-reviewer`, `test-reviewer` | Validator extension complete; before WS2.5-direction-check. |
| **WS2.5 pre-migration direction check** | plan-direction | `architecture-reviewer-fred`, `assumptions-reviewer` | **MANDATORY before WS3 destructive migration.** See §WS2.5 below for briefs. |
| During WS3 (cycles 3.1–3.9) | (none) | — | Mechanical migration; reviewer overhead would not pay. |
| WS6 post-execution | work + release | `docs-adr-reviewer`, `architecture-reviewer-fred` | All product behaviour landed; documents stabilised; gate passing. |
| Pre-merge | release | `release-readiness-reviewer` | Optional, before merge to main. |

If a reviewer surfaces a question about a closed decision, the brief was misframed — note it and re-brief on execution legitimacy only (per `feedback_reviewer_brief_respects_decided_scope`). The owner-locked decisions are: two-surface contract; `SKILL-CANONICAL.md` filename; bytewise supporting-file copies; configurable `jc-` prefix; commands subsumed into skills; `.cursor/skills`/`.gemini/skills`/`.codex/skills`/`.windsurf/skills` retired.

---

## WS0 — Pre-Execution Plan Review (MANDATORY)

**Trigger**: a session opens this plan with intent to implement.

**Output**: a written record of findings against this plan and the kept attempt-1 documents, plus a follow-up commit (or commits) addressing every BLOCKER before WS1.1 begins. Findings of severity below BLOCKER may be deferred into the cycle they touch.

**Dispatch**: all four reviewers in parallel via the Agent tool. Each gets a self-contained brief; none reads the others' findings. The session synthesises after.

### Brief — `assumptions-reviewer`

**Read first**: this plan; PDR-051; ADR-125 (especially the 2026-05-09 amendment); friction register F-16; `.agent/plans/agent-tooling/archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md` (the failure note in particular).

**Question**: are this plan's proportionality, build-vs-buy attestation, blocking relationships, and reviewer dispatch points sound? Specifically:

- Is the 28-cycle granularity proportionate to the work, or could cycles consolidate without losing the TDD invariant?
- Does the build-vs-buy attestation honestly survey first-party tooling, or has any vendor capability been overlooked?
- Are the named blocking relationships (WS0 → WS1; WS2.5 → WS3; WS3.9 → WS4) load-bearing, or could any be relaxed without quality loss?
- Are owner-locked decisions (listed in §Reviewer Scheduling) actually closed, or does primary-source evidence suggest one should be reopened?

**Out of scope**: re-litigating the locked design decisions. If the reviewer surfaces a question on a closed decision, that's a brief misframing — note it, do not act on it.

**Expected severity range**: WARN (proportionality nudges) up to BLOCKER (a load-bearing dependency is wrong).

### Brief — `test-reviewer`

**Read first**: this plan, especially every WS1 cycle's test section; the failure note in `archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md` describing the audit-shaped test that was written after the code.

**Question**: do the cycles describe behaviour the system must hold, or do they audit implementation choices already implicit in the plan? Specifically:

- Is each cycle's test section the kind of assertion that survives a refactor of the implementation, or is it shape-coupled to the implementation file structure?
- Does the atomic-landing invariant hold as written? (Test and product code in one commit; tree green at end of every commit.)
- Are any cycle tests describing private internals rather than observable behaviour?
- WS1.7 mandates "full help text on stderr" for invalid invocations — is the assertion shape testable without coupling to the literal help text, or is the literal text itself the contract?

**Expected severity range**: WARN (cycle-shape nudges) up to BLOCKER (a cycle as written is audit-shaped and would be rejected at landing).

### Brief — `architecture-reviewer-fred`

**Read first**: this plan; PDR-051; ADR-125 (amended); ADR-125's pre-amendment Layer-2 contract for context; existing `agent-tools/` workspace structure; `scripts/validate-portability.ts`.

**Question**: does the plan respect ADR/PDR boundaries and the canonical-first discipline as authored? Specifically:

- Does WS2's validator extension respect the existing `validate-portability.ts` boundaries, or does it leak generator-package internals into the script?
- Does WS3's mechanical migration preserve the ADR-125 amendment shape (e.g. the Layer-2 table accurately describes post-migration state)?
- Does the proposed boundary between `agent-tools/src/skills-adapter-generate/` and the validator script follow consolidate-at-third-consumer, or does it duplicate logic that should live in one place?
- Is the WS3.9 strict-flip safe given the cumulative state at that point?

**Out of scope**: re-litigating the two-surface contract or the `SKILL-CANONICAL.md` filename choice — both are owner-locked.

**Expected severity range**: WARN up to BLOCKER (a structural violation that must reshape WS2 or WS3 before they execute).

### Brief — `docs-adr-reviewer`

**Read first**: PDR-051; ADR-125 (with all amendments, especially 2026-05-09); the `.agent/research/agentic-engineering/standardising-skills.md` corrections planned in WS5.4; the existing `.agent/practice-index.md` PDR map; the practice-core-portability rule.

**Question**: are the documents already landed coherent, and is the WS5 documentation propagation plan complete?

- Does PDR-051 satisfy the practice-core-portability rule? Note the rule's scope exception for `.agent/skills/` (allowed) and external standards citations (allowed). PDR-051 names `skills-lock.json` (a host-local file) — is that a violation, or precedent-aligned with PDR-009's similar mention?
- Does the ADR-125 amendment cover what changed without breaking links elsewhere in the repo? Are any references to the retired Layer-2 surfaces (`.cursor/skills/` etc.) elsewhere in `docs/` left dangling?
- Does the WS5 propagation list cover every doc surface that would otherwise drift after migration?
- Is the planned research-doc correction (line 226 should/must, lines 383–389 quote stripping, "Last researched" date) appropriate for in-place amendment, or does it warrant a fuller re-issue?

**Expected severity range**: WARN (small doc fixes) up to BLOCKER (PDR-051 violates portability discipline and must be re-authored before adoption).

### Acceptance for WS0

- All four reviewers' findings collected as a written record (in the session napkin or a short report).
- Every BLOCKER addressed (typically a documentation amendment or a plan-cycle re-shape).
- The plan's todos array updated to reflect any cycle-shape changes.
- A short note in this plan's body recording the WS0 outcome: which reviewers ran, what landed, what was deferred and why.

Only after WS0 acceptance does WS1.1 begin.

---

## WS1 — Generator core

Each cycle is one commit. Tree green at end of every commit. After every cycle: `pnpm agent-tools:test && pnpm agent-tools:type-check && pnpm agent-tools:lint` must exit 0.

### Cycle 1.1 — `skills-lock.json` Ajv schema and loader

**Parallel-safety**: parallel-safe with 1.2 (different files, no acceptance dependency).

**Starting state**: branch HEAD with no `agent-tools/src/skills-adapter-generate/` directory.

**File scope** (this cycle is permitted to touch):

- `agent-tools/src/skills-adapter-generate/lock.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/lock.unit.test.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/fixtures/lock-valid.json` (NEW)
- `agent-tools/tests/skills-adapter-generate/fixtures/lock-malformed.json` (NEW)

**Files NOT to touch**: anything outside `skills-adapter-generate/`.

**Test (Red)** — `lock.unit.test.ts`:

- Valid lock fixture (mirrors current `skills-lock.json` shape) → loader returns a `Set<string>` of locked skill ids.
- Malformed lock (e.g. `skills` is an array) → loader returns a typed error result; no throw.
- Empty `skills` map → empty set.
- Missing top-level `version` → typed schema error naming the field.

**Product (Green)** — `lock.ts`:

- Export `LockSchema` (Ajv schema literal): `{ type: 'object', required: ['version', 'skills'], properties: { version: { type: 'integer' }, skills: { type: 'object', additionalProperties: { type: 'object', required: ['source', 'sourceType', 'computedHash'], properties: { source: { type: 'string' }, sourceType: { type: 'string' }, computedHash: { type: 'string' } } } } } }`.
- Export `loadLockedSkillIds(rawJsonText: string): Result<ReadonlySet<string>, LockError>`.
- Use `Result<T, E>` shape with `kind: 'ok' | 'error'` (matches `agent-identity-cli-parser` pattern, satisfies `use-result-pattern` rule).
- No `as` casts.

**Acceptance**:

```bash
pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/lock
# Expected: exit 0, all tests pass

pnpm --filter @oaknational/agent-tools type-check
# Expected: exit 0
```

**Reviewer dispatch**: none for this cycle (deferred to WS1 mid-review).

---

### Cycle 1.2 — Frontmatter parse / emit round-trip

**Parallel-safety**: parallel-safe with 1.1 (no shared files).

**Starting state**: as 1.1.

**File scope**:

- `agent-tools/src/skills-adapter-generate/frontmatter.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/frontmatter.unit.test.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/fixtures/canonical-simple.md` (NEW — single-line description)
- `agent-tools/tests/skills-adapter-generate/fixtures/canonical-folded.md` (NEW — `>-` block scalar)
- `agent-tools/tests/skills-adapter-generate/fixtures/canonical-metadata.md` (NEW — full metadata block including `claude-*` keys)

**Files NOT to touch**: anything outside `skills-adapter-generate/`.

**Test (Red)**:

- Parse `canonical-simple.md` → top-level entries include `name`, `classification`, `description`; metadata empty; body preserved.
- Parse `canonical-folded.md` → description entry's raw lines preserve every continuation line of the `>-` block scalar.
- Parse `canonical-metadata.md` → metadata entries include `owned`, `claude-argument-hint`, `claude-user-invocable` in source order.
- Round-trip: emit(parse(content)) === content (modulo a documented and tested normalisation: trailing whitespace, single newline at end).
- BOM and CRLF: `canonical-simple.md` re-encoded with BOM prefix and CRLF line endings parses identically.
- No frontmatter fence → returns null.

**Product (Green)** — `frontmatter.ts`:

- `parseCanonicalFrontmatter(content: string): ParsedFrontmatter | null`.
- `emitFrontmatter(topLevel, metadata): string`.
- `findEntry`, `inlineValue`, `withInlineValue` helpers as needed by 1.4/1.5.
- Line-based scanner over the YAML subset documented in PDR-051; rejects nothing aggressively (lenient parsing per agentskills.io client guidance).

**Acceptance**:

```bash
pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/frontmatter
# Expected: exit 0
```

---

### Cycle 1.3 — Owned-XOR-locked consistency check

**Starting state**: 1.1 + 1.2 landed.

**File scope**:

- `agent-tools/src/skills-adapter-generate/consistency.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/consistency.unit.test.ts` (NEW)

**Test (Red)**:

- Owned + in lock → error with skill id and remediation message.
- Owned + not in lock → ok.
- Not owned + in lock → ok.
- Not owned + not in lock → orphan error with skill id and remediation message.
- Multiple errors → all collected and returned together.

**Product (Green)** — `consistency.ts`:

- `checkConsistency(classifications: readonly SkillClassification[]): ConsistencyResult` returning `{kind: 'ok'} | {kind: 'error', errors: readonly ConsistencyError[]}`.
- Error messages name the skill id and the concrete remediation step.

**Acceptance**: `pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/consistency` exits 0.

---

### Cycle 1.4 — Cross-tool adapter generator

**Starting state**: 1.2 landed.

**File scope**:

- `agent-tools/src/skills-adapter-generate/generator.ts` (NEW — cross-tool path only)
- `agent-tools/src/skills-adapter-generate/index.ts` (NEW — exports + `OWNED_PREFIX = 'jc-'` constant + `CANONICAL_FILENAME = 'SKILL-CANONICAL.md'` constant)
- `agent-tools/tests/skills-adapter-generate/generator-cross-tool.unit.test.ts` (NEW)

**Test (Red)**:

- Owned skill with simple frontmatter → emitted adapter has `name: jc-<id>`, spec-portable fields preserved, `metadata.claude-*` stripped, body = `Read and follow [SKILL-CANONICAL.md](../../../.agent/skills/<id>/SKILL-CANONICAL.md), including any supporting files it references.` plus AUTO-GENERATED header comment.
- Ingested skill (owned: false) → emitted adapter has `name: <id>` (no prefix).
- `buildAdapterId('metacognition', true) === 'jc-metacognition'`; `buildAdapterId('clerk', false) === 'clerk'`.
- Metadata block with both `owned` and `claude-*` keys → output preserves `owned`, drops `claude-*`.

**Product (Green)** — `generator.ts` (cross-tool only):

- `generateCrossToolAdapter(canonicalId, owned, parsed): GeneratedAdapter`.
- `buildAdapterId(canonicalId, owned): string`.
- `index.ts` exports `OWNED_PREFIX`, `CANONICAL_FILENAME`, `ADAPTER_FILENAME`.

**Acceptance**: `pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/generator-cross-tool` exits 0.

---

### Cycle 1.5 — Claude adapter generator with `claude-*` hoisting

**Starting state**: 1.4 landed.

**File scope**:

- `agent-tools/src/skills-adapter-generate/generator.ts` (MODIFIED — add Claude path)
- `agent-tools/tests/skills-adapter-generate/generator-claude.unit.test.ts` (NEW)

**Test (Red)**:

- Canonical with `metadata.claude-argument-hint: '[topic]'` → Claude adapter has top-level `argument-hint: '[topic]'`; the `metadata.claude-argument-hint` key is removed from `metadata`.
- Canonical with `metadata.claude-user-invocable: 'true'` → Claude adapter top-level `user-invocable: true` (string-to-boolean if needed; document the convention).
- Canonical with no `claude-*` keys → Claude adapter top-level matches cross-tool top-level.
- Canonical with both `claude-*` and other metadata → other metadata preserved under `metadata:`; claude-* hoisted.

**Product (Green)** — `generator.ts`:

- `generateClaudeAdapter(canonicalId, owned, parsed): GeneratedAdapter`.
- Hoist behaviour documented in TSDoc with example.

**Acceptance**: `pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/generator-claude` exits 0.

---

### Cycle 1.6 — Supporting-file bytewise copier

**Starting state**: 1.4 landed (1.5 not strictly needed but probably also landed by now).

**File scope**:

- `agent-tools/src/skills-adapter-generate/supporting-files.ts` (NEW)
- `agent-tools/tests/skills-adapter-generate/supporting-files.integration.test.ts` (NEW — uses `node:fs/promises` + `node:os` tmpdir)

**Test (Red)**:

- Canonical skill with `references/rubric.md` → both adapter dirs receive bytewise-identical `references/rubric.md`.
- Canonical with `scripts/run.sh` (executable bit set) → both adapter dirs receive the file with bytes preserved (executable bit handling documented; behaviour either preserves it or asserts it does not, but is consistent).
- Canonical with `assets/templates/output.md` (nested) → both adapter dirs receive the nested structure.
- Canonical with binary file (`assets/diagram.png` — small fixture) → bytes preserved exactly.
- No supporting files → no error, no adapter sub-dirs created.

**Product (Green)** — `supporting-files.ts`:

- `copySupportingFiles(canonicalDir, adapterDir, fs): Promise<void>` over an injectable fs interface.
- Walks `references/`, `scripts/`, `assets/`; bytewise reads via `Uint8Array`; writes to adapter dir creating directories as needed.

**Acceptance**: `pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/supporting-files` exits 0.

---

### Cycle 1.7 — CLI runner

**Starting state**: 1.1 + 1.2 + 1.3 + 1.4 + 1.5 + 1.6 landed.

**File scope**:

- `agent-tools/src/skills-adapter-generate/cli.ts` (NEW)
- `agent-tools/src/skills-adapter-generate/cli-parser.ts` (NEW)
- `agent-tools/src/skills-adapter-generate/fs-interface.ts` (NEW — `SkillsAdapterFs`)
- `agent-tools/tests/skills-adapter-generate/cli.unit.test.ts` (NEW — uses an in-memory fs implementation in the test file)

**Test (Red)**:

- `runCli({argv: ['--help'], cwd: '/r', fs: memFs})` → exit 0; full help text on stdout; stderr empty.
- `runCli({argv: ['-h'], ...})` → same as `--help`.
- `runCli({argv: [], ...})` against an in-memory fs seeded with two canonical skills (one owned, one ingested) → exit 0; both adapter dirs populated; `Generated 4 adapter file(s)` message.
- `runCli({argv: ['--check'], ...})` against in-memory fs already in sync → exit 0.
- `runCli({argv: ['--check'], ...})` after a manual edit to one adapter → exit 1; stderr lists the drifted file.
- `runCli({argv: ['--unknown-flag'], ...})` → **exit 2; stderr starts with the FULL help text, then `\n\nError: unknown argument '--unknown-flag'\n`** (per F-09).
- `runCli({argv: ['--prefix'], ...})` (a flag without value, if applicable) → exit 2; full help on stderr.
- `runCli` against a fs where `skills-lock.json` is missing → exit 1; stderr names the inconsistency (every owned skill OK, every ingested skill is now an orphan with the lock-deletion remediation message).

**Product (Green)** — `cli.ts` + `cli-parser.ts`:

- Parser: `parseArgs(argv): {kind: 'ok', mode: 'generate' | 'check'} | {kind: 'help'} | {kind: 'error', message: string}`.
- Runner: `runSkillsAdapterGenerateCli(input): Promise<Result>` returning `{exitCode, stdout, stderr}`.
- Bad-usage path emits `${HELP_TEXT}\n\nError: ${message}\n` on stderr (F-09).
- `HELP_TEXT` covers synopsis, all modes, inputs/outputs, owned-vs-ingested rules, manual-edit prohibition, exit codes, examples.

**Acceptance**:

```bash
pnpm --filter @oaknational/agent-tools test -- skills-adapter-generate/cli
# Expected: exit 0
```

**Reviewer dispatch**: none yet (deferred to WS1 mid-review).

---

### Cycle 1.8 — Bin shim and script registration

**Starting state**: 1.7 landed.

**File scope**:

- `agent-tools/src/bin/skills-adapter-generate.ts` (NEW)
- `agent-tools/src/skills-adapter-generate/fs-real.ts` (NEW)
- `agent-tools/package.json` (MODIFIED — add `"skills-adapter-generate": "pnpm -s build && cd .. && node agent-tools/dist/src/bin/skills-adapter-generate.js"` under scripts)
- `package.json` (MODIFIED — add `"agent-tools:skills-adapter-generate": "pnpm --filter @oaknational/agent-tools skills-adapter-generate"` under scripts)
- `agent-tools/tests/skills-adapter-generate/bin.integration.test.ts` (NEW — spawns the built binary against a temp-fs fixture)

**Test (Red)**:

- Build (`pnpm -s build`) and execute the bin against a temp-dir canonical fixture: `node dist/src/bin/skills-adapter-generate.js --help` exits 0 with help on stdout.
- Same bin against the temp fixture without `--help` regenerates the adapter tree.

**Product (Green)**:

- `fs-real.ts`: real-fs implementation of `SkillsAdapterFs` against `node:fs/promises`.
- `bin/skills-adapter-generate.ts`: shim resolving cwd from `INIT_CWD ?? process.cwd()`, wiring `fs-real` and `runSkillsAdapterGenerateCli`.
- Build script entry preserves `chmod +x` on the generated bin file.

**Acceptance**:

```bash
pnpm agent-tools:build
pnpm agent-tools:skills-adapter-generate --help
# Expected: exit 0, full help on stdout
```

---

### WS1 mid-review

**Trigger**: cycles 1.1–1.8 landed.

**Reviewers**: `code-reviewer`, `type-reviewer`, `test-reviewer`, `assumptions-reviewer` (build-vs-buy survival check). Dispatched in parallel.

**Output**: any BLOCKERs land as a follow-up commit before WS2 begins. Document findings in the cycle todo for traceability.

---

## WS2 — Validator extension

Each cycle: one commit. After every cycle: `pnpm portability:check` exits 0 against the working tree (legacy contract still active until WS3.9). New checks land at `severity: warn` if any pass over the existing tree would cascade-fail; otherwise at error severity directly.

### Cycle 2.1 — Canonical filename check

**File scope**:

- `scripts/validate-portability.ts` (MODIFIED — add the check)
- `scripts/validate-portability.test.ts` if exists, else `agent-tools/tests/validate-portability/canonical-filename.unit.test.ts` (NEW, reading `validate-portability.ts` exports)

**Test (Red)**:

- Fixture with `.agent/skills/<id>/SKILL-CANONICAL.md` and no `SKILL.md` → check passes.
- Fixture with `.agent/skills/<id>/SKILL.md` (legacy) → check fails with skill id named.
- Fixture with both files → check fails with skill id named.
- Fixture with neither file → check fails with skill id named (canonical missing).

**Product (Green)**: extend the validator with a check function that walks `.agent/skills/`. Until WS3.1 lands the rename, this check fires `warn` and lists every skill missing `SKILL-CANONICAL.md`; after WS3.1, it fires `error`.

**Acceptance**: `pnpm portability:check` exits 0 on the working tree (warn level acceptable pre-migration).

---

### Cycle 2.2 — Two-surface adapter shape check

**File scope**: `scripts/validate-portability.ts`, paired test.

**Test (Red)**:

- Fixture with `.cursor/skills/foo/SKILL.md` present → check fails.
- Fixture with `.gemini/skills/`, `.codex/skills/`, `.windsurf/skills/` present → check fails.
- Fixture with only `.agents/skills/` and `.claude/skills/` adapter trees → check passes.

**Product (Green)**: directory-existence assertion. Fires `warn` until WS3.5 deletes the retired surfaces; `error` thereafter.

**Acceptance**: `pnpm portability:check` exits 0.

---

### Cycle 2.3 — Owned/lock consistency programmatic check

**File scope**: `scripts/validate-portability.ts`, paired test. Imports `consistency.ts` from agent-tools (or duplicates the small XOR logic, accepting duplication if cross-package import is non-trivial — decide at write time).

**Test (Red)**: same fixtures as WS1.3 but driven through the validator entry point.

**Product (Green)**: load `skills-lock.json` via the new Ajv schema, walk canonical skills, check XOR.

**Acceptance**: `pnpm portability:check` exits 0.

---

### Cycle 2.4 — Bytewise supporting-file equality check

**File scope**: `scripts/validate-portability.ts`, paired test.

**Test (Red)**: fixture with canonical `references/rubric.md` and matching adapter copies → passes; fixture with one byte different → fails with the diverged path; fixture with adapter copy missing → fails with missing path.

**Product (Green)**: walk canonical supporting trees; bytewise compare adapter copies.

**Acceptance**: `pnpm portability:check` exits 0.

---

### Cycle 2.5 — Generator drift gate

**File scope**: `scripts/validate-portability.ts`, paired test.

**Test (Red)**: validator invokes `pnpm agent-tools:skills-adapter-generate --check` as a subprocess; non-zero exit propagates as a portability failure.

**Product (Green)**: subprocess invocation with structured stderr forwarding.

**Acceptance**: `pnpm portability:check` exits 0; `pnpm agent-tools:skills-adapter-generate --check` exits 0.

---

### Cycle 2.6 — PDR portability gate

**File scope**: `scripts/validate-portability.ts`, paired test.

**Test (Red)**:

- Synthetic PDR fixture with `ADR-125` reference → check fails.
- Fixture with `docs/architecture/...` path → check fails.
- Fixture with `src/foo/bar.ts` reference → check fails.
- Fixture with `packages/foo/...` path → check fails.
- Real PDR-009 (which mentions `.agents/skills/` per the scope exception) → check passes (path-allowed regex).
- Real PDR-051 → check passes (no forbidden refs after attempt-1 corrections; if regex finds any, fix in this cycle, in canonical, before merging).

**Product (Green)**: regex scan over `.agent/practice-core/decision-records/PDR-*.md`. Forbidden-ref regex with explicit allow-list for the scope exception (Practice canonical paths under `.agent/`, http(s) citations).

**Acceptance**: `pnpm portability:check` exits 0.

---

### WS2 mid-review

`code-reviewer` + `test-reviewer` on the validator extension. BLOCKERs landed before WS3 begins.

---

## WS2.5 — Pre-Migration Plan-Direction Check (MANDATORY)

**Trigger**: WS2 mid-review passed; WS3 destructive migration is the next step.

**Why this exists**: WS3 deletes adapter trees, deletes command surfaces, renames 37 canonical files, and flips the validator contract. After it lands, returning to attempt 1's state is expensive. A direction check before WS3 is much cheaper than a rollback after.

**Dispatch**: in parallel.

### Brief — `architecture-reviewer-fred`

**Read first**: the plan as it stands at this point (post-WS2 commits applied); the actual generator code as it landed (does it match the plan?); the actual validator extension as it landed.

**Question**: is the WS3 migration sequence still right given what actually built? Specifically:

- Has the generator's emitted output diverged from the WS3 expectations (e.g. adapter file structure, frontmatter shape) such that WS3.4 would commit a surprise?
- Is WS3.9 strict-flip still the right shape, or did WS2 land a check that needs a different removal pattern?
- Is the per-command audit (WS3.6) still appropriately scoped? Has any context emerged that suggests a command should be retained as a command (i.e. the commands-to-skills decision needs revisiting)?

### Brief — `assumptions-reviewer`

**Read first**: same as above plus this plan's risk register.

**Question**: any new assumption surfaced by the WS1+WS2 implementation that this plan hasn't recorded? Specifically:

- Did the generator's behaviour reveal an assumption about canonical content shape that WS3.1–3.3 mass-applies?
- Is the WS3.6 per-command audit still proportionate (12 audits), or has the implementation revealed that some commands have characteristics that change the default decision?
- Are there any sunk-cost reasoning patterns in continuing to WS3 vs reshaping?

### Acceptance for WS2.5

- Both reviewer findings collected.
- Any BLOCKER addressed before WS3.1 begins.
- A short note in this plan's body recording the WS2.5 outcome.

Only after WS2.5 acceptance does WS3.1 begin.

---

## WS3 — Migration (mechanical, separated commits)

Each cycle is one commit. No reviewer dispatch (mechanical work). After every cycle: `pnpm portability:check` exits 0 (warnings tolerated until 3.9 strict-flips).

### 3.1 — Rename canonical filenames

`git mv .agent/skills/<id>/SKILL.md .agent/skills/<id>/SKILL-CANONICAL.md` × 37. Mechanical; no content changes.

### 3.2 — Add `metadata.owned: true` to owned canonicals

For every canonical skill NOT in `skills-lock.json` (the disjoint complement = ~25 owned skills), add a `metadata:` block with `owned: true` to its frontmatter (or extend the existing block). Use a script if helpful (`scripts/add-owned-flag.mjs` ad-hoc; not committed).

### 3.3 — Add canonical Skill-root section

For every owned canonical, ensure the body opens with a `## Skill root` section: `Treat .agent/skills/<id>/ as the skill root. Resolve all supporting files mentioned in this skill relative to that directory, even if this file was reached through an adapter under .agents/skills/ or .claude/skills/.`

This protects supporting-file path resolution when the canonical is read through an adapter.

### 3.4 — First generator run

`pnpm agent-tools:skills-adapter-generate`. Commit emitted `.agents/skills/jc-*/SKILL.md`, `.claude/skills/jc-*/SKILL.md`, plus `.agents/skills/<ingested-id>/SKILL.md`, `.claude/skills/<ingested-id>/SKILL.md`, plus all supporting-file copies.

### 3.5 — Delete retired skill surfaces

```bash
[ -d .cursor/skills ] && rm -rf .cursor/skills
[ -d .gemini/skills ] && rm -rf .gemini/skills
[ -d .codex/skills ] && rm -rf .codex/skills
[ -d .windsurf/skills ] && rm -rf .windsurf/skills
```

### 3.6 — Per-command audit

For each `.agent/commands/*.md` (12 commands), record disposition in this cycle's commit body:

- skill (default — convert in 3.7)
- inline (fold into an existing skill — name the target)
- delete (dead — note why)

No file changes in 3.6.

### 3.7 — Convert kept commands to skills

For each command marked `skill`: create `.agent/skills/<id>/SKILL-CANONICAL.md` with the command's body, `metadata.owned: true`, `metadata.claude-user-invocable: 'true'`, and `metadata.claude-argument-hint` if applicable. Run `pnpm agent-tools:skills-adapter-generate`. Commit per command, or grouped if mechanically identical.

### 3.8 — Delete command surfaces

```bash
rm -rf .agent/commands/ .claude/commands/ .cursor/commands/ .gemini/commands/
```

Slash invocation continues via `.claude/skills/jc-<id>/` per Claude Code skill discovery.

### 3.9 — Validator strict-flip

Remove the `warn`-level legacy adapter checks from `scripts/validate-portability.ts`; the new contract is the only contract. Test the removal (negative test: a stray `.cursor/skills/` directory under a fixture causes a fail).

---

## WS4 — Quality gates

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm lint && pnpm test && pnpm portability:check
```

All commands exit 0. `pnpm agent-tools:skills-adapter-generate --check` also exits 0 (drift gate green via portability:check, but invoke standalone for explicit smoke).

Manual smoke check: `/jc-go`, `/jc-plan`, `/jc-metacognition`, `/jc-session-handoff` register as user-invokable in Claude Code (typing `/` shows them in the menu).

---

## WS5 — Documentation

### 5.1 — `agent-tools/README.md`

Register `skills-adapter-generate` under Commands.

### 5.2 — `docs/engineering/skills-adapter-generation.md` (NEW)

Sections: Purpose. When to use. Integration with `pnpm portability:check`. How to add a new owned skill. How a new ingested skill flows through. Manual-edit prohibition. Drift detection in CI. The owned-skill prefix and how to change it.

### 5.3 — TSDoc audit

Every exported function in `agent-tools/src/skills-adapter-generate/` has description, parameters, returns, and an example block. Internal helpers have at minimum a one-line description.

### 5.4 — Research-doc corrections

`.agent/research/agentic-engineering/standardising-skills.md` corrections in place:

- Line 226: `should match` → `must match`.
- Lines 383–389: paraphrased Gemini quote stripped; substantive claim retained via spec inheritance.
- Header `Last researched: 2026-05-09`.

### 5.5 — Practice-index update

`.agent/practice-index.md`:

- Add PDR-051 row to the "Practice-Core concept ↔ ADR map".
- `.agent/plans/agent-tooling/future/adapter-generation.plan.md` body or README — note that the skills surface is closed by this plan; sub-agents and rules remain the future scope.

---

## WS6 — Adversarial review and consolidation

`docs-adr-reviewer` on PDR-051 + ADR-125 amendment + `docs/engineering/skills-adapter-generation.md` + research-doc corrections. `architecture-reviewer-fred` on boundary compliance, ADR amendment shape, generator placement under `agent-tools/`. Findings → follow-up commits or follow-up plans depending on severity.

After review passes: `/jc-consolidate-docs`. Update `.agent/memory/operational/repo-continuity.md`. Mark this plan completed and archive to `archive/completed/`.

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Frontmatter regex parser fails on edge cases (multi-line description with embedded colons, escaped quotes, BOM, CRLF). | Mandatory test corpus in WS1.2: simple, folded, metadata-rich, BOM-prefixed, CRLF-terminated fixtures. No cycle merges without each fixture green. |
| `as` cast at trust boundary (the WS attempt-1 failure mode). | WS1.1 lands the Ajv schema **first**; every subsequent cycle's loader code calls `loadLockedSkillIds` rather than parsing JSON directly. The boundary discipline is established before any consumer is written. |
| WS3.4 first-generator-run produces a horrifying review surface. | Regenerated output is largely mechanical and self-consistent; reviewer overhead is low. The cycle is committed as a single mechanical commit; reviewers in WS6 see the post-migration state, not the intermediate. |
| Cross-vendor adapter activation cannot be CI-verified. | Manual smoke check documented in WS4 acceptance and in `docs/engineering/skills-adapter-generation.md`. Integration tests against real Claude/Cursor/Codex/Gemini CLIs are out of scope (separate plan). |
| Generator drift between in-memory output and disk on partial failures. | Generator wipes adapter trees and re-emits per run; no partial states. CI drift gate catches any post-hoc drift. |
| TDD discipline silently abandoned mid-plan (the attempt-1 failure mode). | Each cycle's acceptance includes `pnpm agent-tools:test`, `type-check`, `lint`. The cycle's commit cannot land green without those passing. The pre-push hook re-runs `portability:check`. The plan's todo IDs are cycle-grain and update as commits land — visible drift signal. |

---

## Foundation Alignment

- [PDR-009](../../../practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md): canonical-first cross-platform architecture preserved; this is a specialisation for the skills surface.
- [PDR-024](../../../practice-core/decision-records/PDR-024-vital-integration-surfaces.md): Category D canonical agent artefact architecture refined for skills.
- [PDR-035](../../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md): canonical is Practice substance; adapters are repo phenotype.
- [PDR-051](../../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md): the portable doctrine this plan implements.
- [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md) (Amended 2026-05-09): host adoption of PDR-051.
- [F-09](../frictions-register.md): full-help-on-invalid-flag rule — generator CLI must comply (cycle 1.7 test).
- [F-16](../frictions-register.md): skills/commands surface sprawl — closed by this plan.
- `.agent/rules/no-speed-pressure.md`: the ceremony substrate is the cure, not the obstacle.
- `.agent/rules/strict-validation-at-boundary.md`: WS1.1 lands Ajv schema first.
- `.agent/rules/no-type-shortcuts.md`: no `as` casts; Result types throughout.
- `.agent/rules/never-disable-checks.md`: no `eslint-disable`, no `// @ts-expect-error` shortcuts.

---

## Documentation Propagation

Captured in WS5. Outcomes mined into PDR-051, ADR-125 amendment, `docs/engineering/skills-adapter-generation.md`, generator README, research-doc corrections, `.agent/practice-index.md`.

---

## Consolidation

After WS6 passes, run `/jc-consolidate-docs`. Update `.agent/memory/operational/repo-continuity.md` with the closeout line. Mark this plan completed and archive to `archive/completed/`.

---

## Dependencies

**Blocking**: none. PR #102 graph planning is unrelated to skills substrate.

**Related plans**:

- [`../future/adapter-generation.plan.md`](../future/adapter-generation.plan.md) — skills surface closed by this plan; sub-agents and rules remain in scope.
- [`../future/canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md) — complementary; consumes the new generator and `skills-lock.json` shape.
- [`../future/hooks-portability.plan.md`](../future/hooks-portability.plan.md) — sibling Layer-1/Layer-2 portability work; same generator pattern, different artefact.

**Friction closed**: F-16.

**Failed predecessor**: [`../archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md`](../archive/failed-skills-standardisation-attempt-1-2026-05-09.plan.md).
