---
title: "Validation Strategy"
status: seeded-stub
last_updated: 2026-08-10
---

# Validation Strategy

> **Seeded stub (2026-06-23).** This file is the formal home the
> [testing-strategy.md](testing-strategy.md) doctrine restructure points to. Its
> spine — test / evaluate / assure — and its assurance tiers are ratified (owner,
> 2026-06-23); the finer internal taxonomy is **deliberately deferred** until the
> skill-evals pilot and the first MCPJam eval suite produce real experience to write
> from (resist premature crystallisation). The reasoning behind everything here lives in
> [`evals-and-assurance-position-2026-06-23.md`](../reports/evals-and-assurance-position-2026-06-23.md).

## The spine: test / evaluate / assure

- **Test** — *deterministic*. Proves code does what its spec says. Binary,
  reproducible; unit of truth is the assertion. This is all of
  [testing-strategy.md](testing-strategy.md). Mutation testing (Stryker) is the
  meta-quality layer that makes test coverage meaningful.
- **Evaluate** — *probabilistic*. Measures the value and reliability of a
  judgement-laden capability across realistic inputs, graded relative to a
  baseline. Unit of truth is a graded outcome over a corpus plus a with/without
  delta. Assertions are authored *after* the first run (this inverts test-first).
- **Assure** — the umbrella trust case: composes test + evaluate + conformance +
  UAT + observability + security review + human review into ongoing evidence that
  the capability is fit for the world.

**Describe the outcome you want; never audit the implementation choice** is the
continuity across all three — the same discipline as "test behaviour, not
implementation" in testing.

## Assurance tiers (risk-tiered, keyed on harm asymmetry)

Rigour is proportionate to the harm of getting it wrong — not uniform, and not
keyed on surface type.

| Tier | Applies to | Assurance floor |
|---|---|---|
| **Critical** | Asymmetric, hard-to-reverse harm to a user — EEF evidence surfacing, pedagogy/curriculum advice, anything that attributes or summarises evidence | Tests + mandatory evals **including a faithfulness assertion** + human review |
| **Standard** | User-facing where errors are visible and correctable — semantic search, browse, the MCP tool surface | Tests + conformance + behavioural evals |
| **Light** | Internal / agent-facing where harm is cheap and self-correcting — formatting, scaffolding, internal tooling | Tests + spot checks; evals optional |

## Gate integrity: a green check proves its own path, nothing more

A green gate is evidence about the path the gate exercised — never about
the path production runs. Worked instance (2026-07-2x): a Vitest unit test
passed on a runtime fact the real build path could not satisfy, because
Vite resolves workspace packages and `tsx esbuild.config.ts` does not — the
green unit test "proved" a resolution the shipped artefact lacked. When a
claim is about a RUNTIME or BUILD property, the check must run on that
runtime or build path (a smoke test on the built artefact, not a unit test
on the source graph). Composes with the
`green-parts-red-composition` pattern: per-path checks compose no better
than per-part ones.

### Right tool: a check uses the property's real machinery (owner ruling 2026-08-09)

A validator's subject dictates its instrument. A check about
**dependencies** runs on a dependency **resolver** — dependency-cruiser,
AST-based and already in the blocking chain (group-matched containment
via `$1` back-references, phantom-dependency `dependencyTypes`,
first-class dynamic-`import()` and `require` analysis) — never on
textual pattern-matching of source. Regex import-scanning is the wrong
tool: its silent-pass classes (literal dynamic imports, unrecognised
path idioms, comment-stripping bypasses) are the instrument's shape,
not bugs to patch one spelling at a time. This generalises the section
above — prefer the instrument that exercises the property's real path
over a textual shadow of it.

The module-system policy those rules enforce (owner ruling
2026-08-09): this estate is **strictly ESM — zero `require`
statements**; the presence of a `require` IS the finding, never a
style note. **Dynamic `import()` is strongly discouraged**: it errors
by default, with any sanctioned use carried as a recorded,
per-instance exemption in the rule configuration — never a silent
allowance. Worked instance: the
workspace-config-isolation containment leg (2026-08-09) — its
replacement with dependency-cruiser rules was ruled at the owner's
word; the isolation lane executes it.

## Validation jurisdiction: we validate our own systems

Every validator names whose system it validates, and external-system
content is never in scope — the testing doctrine's existing "NEVER test
external functionality, that is not under our control"
([testing-strategy.md](testing-strategy.md)), applied to the whole
validation estate. A check whose walk crosses territory another system
owns (an external installer's output, a vendor's artifacts) must be
scoped so that territory is invisible to it, never tolerated through an
exemption list: an exemption over foreign territory is a jurisdiction
claim wearing a tolerance, and it converts the other system's normal
output into findings. Class membership derives from the owned system's
own definition — location, recorded derivation, declared membership —
never from name patterns, which are configurable. Worked instance
(2026-08-12): the skills reconciliation sweep adjudicated every entry at
the projection roots, defining the external skills CLI's standard
install layout as a defect tolerated only via a homegrown lock
exemption; cured by recognising Practice projections through their
recorded derivation and leaving everything else untouched (ADR-125
§Skill classes and validation jurisdiction).

## Eval home

Evaluation **definitions are always version-controlled in-repo** with the artefact
they grade. Execution home depends on surface:

- **Skills, prompts, sub-agents** → in-repo `evals/evals.json` (agentskills.io
  convention), run in-repo, reviewed in PRs.
- **MCP-server surface** → MCPJam as the *runner* (cross-LLM, scheduled regression,
  headless widget render via `protocol` / `apps` / `eval`); its suite-definition
  JSON is version-controlled in-repo. MCPJam is execution, never the source of truth.

## The real-world loop (non-negotiable closure)

Test / evaluate / assure is an **internal-confidence triad** — every layer grades
against an expectation *we* authored. It only becomes trustworthy when closed
against a real-world signal of value. Near-term signal: **usage telemetry** via the
existing Sentry / OpenTelemetry observability foundation (tool-selection, success,
retry, abandonment as a value proxy), with eval corpora **seeded from real usage
distributions** so the loop is structural, not bolted on. Medium-term: a
**teacher-feedback** channel as the higher-value signal.

## What is not eval-shaped

Diffuse, long-horizon, cultural capability (doctrine, planning discipline,
collaboration) does not decompose into `prompt → graded output`. It takes a
different instrument (retrospective, experience corpus), not a forced
`evals/evals.json`. Forcing eval-shape onto it is the mirror category error of
treating evals as tests.
