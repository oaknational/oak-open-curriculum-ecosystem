# Quality-gate inventory — recomputed 2026-08-04

Evidence for the ratified [quality-gate-ledger plan](../plans/delivery/quality-gate-ledger.plan.md)
(MCP-491), and the discharge of its step 1. Produced by a read-only sweep across
hooks, CI workflows, root and workspace scripts, turbo tasks, and custom validators,
reconciled against every document claiming to list the gates.

**Method note.** ADR-121 was deliberately **not** used as an input — the owner's
direction on 2026-08-04 was to assume it badly out of date, so it is a test case for
the finished validator, never a seed. Everything below is recomputed from
invocation sites.

## Counts

| Measure | Count |
| --- | --- |
| Distinct gates | **88** |
| Custom in-repo validators/scripts | 54 |
| Invisible from root pnpm scripts | **44** (24 unreachable; 20 only via an aggregate) |
| In CI but not hooks | 13 |
| In hooks but not CI | 8 |
| Defined but wired to no blocking surface | 14 |
| Non-blocking gates inside blocking surfaces | 3 |
| Rows ADR-121's matrix can express | 24 of 88 |

## Disagreements between documentation and reality

Each verified with file and line. This list is the reconciliation the plan's step 6
must disposition — none may be silently absorbed.

- **D1** — ADR-121 contradicts itself on browser suites: prose at `:88-93` says
  pre-push and CI exclude four suites; its own matrix at `:64-69` marks them CI =
  Yes, and `ci.yml:228-231` runs six. The 2026-07-21 change-log entry fixed the
  cells and never touched the prose.
- **D2** — the `secrets:scan` row collapses two different gates. `ADR-121:47` marks
  it pre-push = Yes, but `.husky/pre-push:28` runs the push-range scanner
  (`agent-tools/src/secret-scan/`), not `pnpm secrets:scan`. Different tool,
  different scope, one row — so `ADR-121:119-121` is false for pre-push.
- **D3** — **CodeQL is absent from ADR-121 entirely** and falsifies its principle #5
  ("no CI-only checks except SonarCloud and dependency-review"). `ADR-204:18-19`
  names CodeQL a *required* status check.
- **D4** — the required Preview deployment (`ADR-204:19-20`,
  `required_deployments: [Preview]`) has no matrix row, no script, no hook, no
  workflow file.
- **D5** — `ADR-204:48` describes CodeQL "default setup"; `codeql.yml:3-18` records
  migration to *advanced* setup and says the two are mutually exclusive. The
  required context name may also be wrong (`CodeQL` vs three
  `Analyze (<language>)` contexts). **To verify against the live ruleset.**
- **D6** — **the parity guard's claim is far narrower than its docstring.**
  `validate-check-ci-parity` splits only `scripts.check`, so gates in pre-push or
  pre-commit but not in `check` are outside its universe; it never recurses into
  aggregates, so **any of the 20 `repo-validators` leaves could be deleted and it
  would still report OK**; `findParityGaps` is one-directional (a CI step with no
  local counterpart is never a gap); and it is hard-pinned to `ci.yml`, so it can
  never detect D3.
- **D7** — "all gates are always blocking — there is no non-blocking warning
  category inside the gate set" (`docs/foundation/agentic-engineering-system.md:64`)
  is false. Three sit inside blocking surfaces: `ci-schema-drift-check`
  (`.husky/pre-push:87` `|| true`; `ci.yml:157-159` `if: always()`),
  `dependency-review` (advisory), and `check-plan-gate-drift` (its own docstring
  says non-blocking, wired into no blocking aggregate).
- **D8** — two documents contradict each other on exhaustiveness. `ADR-121:148-149`
  says `pnpm check` is "the only surface that runs every check";
  `docs/engineering/build-system.md:615` says it does not. At least twelve gates are
  not run by `check`.
- **D9** — `docs/engineering/workflow.md:88` names the wrong pre-push secret command
  (`gitleaks detect`); the binary is a precondition, the scanner is
  `agent-tools:secret-scan`.
- **D10** — `practice:vocabulary` is presented as enforcement in `AGENT.md` and the
  build-system doc, and its own docstring describes exit codes for drift. **Nothing
  runs it** — no hook, no CI, not in `repo-validators:check`, not in `check`.
- **D11** — ADR-121's implementation lists are incomplete on both sides: pre-push
  omits `ci-schema-drift-check`; CI omits the `build` job's drift step and all three
  `ci-turbo-report` steps, each of which can fail its job.
- **D12** — the matrix's own audit claim (`:197`, "makes gaps visible and auditable")
  is scoped to aggregate names only: no row for any of the 20 validator leaves, the
  11 gates buried in turbo tasks, or the 14 ungated scripts — **45 gates it cannot
  express**.
- **D13** — ADR-121 carries a self-declared unreconciled drift note at `:267`, and
  D1 shows the prose half survived the later repair.
- **D14** — **ADR-168 §5 asserts a test-coverage guarantee that is false in both
  directions at once.** Found and measured first-hand by Birch holds Seedling
  (2026-08-04); cure in flight on the #751 branch. §5 states the vitest globs cover
  `src/**` and `tests/**` and *never* `scripts/**`, `build-scripts/**`, or
  `runtime-only-scripts/**`. Measured: `build-scripts/**` **is** in the globs for
  `apps/oak-curriculum-mcp-streamable-http` (ts and mjs, plus `operations/**`) and for
  `packages/core/build-metadata` (mjs) — 130 build-scripts tests collected in the MCP
  app alone. In the other
  direction `runtime-only-scripts/**` is in **no** workspace's globs, yet §4's own
  canonical reference tree shows a `.unit.test.mjs` living there: 663 lines of
  assertions about the gate guarding every production deploy, which had never run
  once.

  D14 generalises the "defined but wired to nothing" class above from *scripts* to
  **test files**. A suite matched by no runner glob is a gate that does not exist, and
  nothing in the estate reports it — the failure is invisible in exactly the way an
  unregistered script is, one level down. The ledger's derived half must therefore
  recompute **test-file reachability**, not only script, hook, and workflow invocation;
  a ledger that enumerated only invocation sites would inherit this blind spot whole.

  **Precision added on re-measure (2026-08-04).** An exhaustive cross-match of every
  test file under `scripts/`, `build-scripts/`, `operations/` and
  `runtime-only-scripts/` against every include glob in the repository found **22 such
  files, 21 matched by some glob, and exactly one orphan**:
  `apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`.
  The earlier phrase "18 test files estate-wide" counted files *beneath those
  directories*, not orphans, and reads as a far larger hole than the evidence supports.
  One never-executed suite guarding every production deploy is the finding; it does not
  need inflating. Note also that the repository has **no** root vitest workspace file —
  Turbo composes the per-workspace configs — so reachability must be computed
  per-workspace, with no single glob surface to read.

- **D15** — **the `oak-gates` skill is a second hand-maintained copy of ADR-121's
  information, and it has already drifted.** `.agent/skills/gates/SKILL-CANONICAL.md:33-55`
  hand-lists a 21-command sequence it presents as corresponding to `pnpm check`. Against
  the live root script it is **missing `lint:shell` and `encoding:check`**, says `knip`
  where the live script says `knip:gate`, and orders `repo-validators:check`
  differently. The skill's own text tells the reader to "re-read `package.json` before
  editing this list" — an instruction to be vigilant, which is precisely what a
  generated view removes the need for. This one matters more than an ordinary doc
  disagreement because of the owner's 2026-08-02 ruling that skills are the source of
  truth other surfaces derive from: a stale hand-list inside the skill corpus is a
  defect in the surface that ruling elevates.

- **D16** — **two engineering docs disagree about which of them holds the quick
  reference.** `docs/engineering/workflow.md:109-125` sends the reader to
  `build-system.md` for "a quick reference table", but `build-system.md:159-167`
  explicitly *disclaims* duplicating the matrix and names its own past drift incident
  as the reason. The same workflow.md passage also lists "smoke tests" among what the
  surfaces cover; ADR-121's change log records smoke tests as retired on 2026-05-04. A
  pointer to a table that does not exist, beside a claim about a gate that no longer
  runs.

## Gates defined but wired to nothing (14)

`practice:fitness`, `practice:fitness:strict-hard`, `practice:fitness:informational`,
`practice:vocabulary`, `plan-gates:check`, `protocol:conformance`,
`practice:substrate:check`, `test:field-integrity`, `mutate` (Stryker),
`test:smoke` (search-cli), `validate:concept-links`, `tool:token-audit`,
`smoke:collaboration-tui`, and the commit-message advisory pair.

## Gates buried inside turbo tasks (invisible by name, 11)

Inside `agent-tools` `test:e2e`: `validate-protocol-wire-contract`, five
`smoke:commit-queue-*` / `smoke:comms-watch-*` checks, `smoke:esm-import-extensions`,
`smoke:codex-session-alert-bootstrap`, `smoke:pre-tool-use-dispatch`,
`smoke:mcp-conformance-cli`. Plus `check-research` and a PostHog logger smoke inside
other packages' `test`.

## Ambiguous failure output (seeds the MCP-492 worklist)

1. Two `repo-validators` legs chain `turbo run … && tsx <validator>` — a **build**
   failure short-circuits and the hook prints "Repo validator checks failed",
   blaming a validator for an unrelated package's broken build.
2. `validate-collaboration-state` prints "N invalid JSON file(s) found" for findings
   that include schema and surface-contract failures on **well-formed** JSON.
3. `.husky/pre-commit:96-100` prints "Knip found unused code, or the knip analysis
   itself crashed" — two causes, one message (the gate itself disambiguates; only
   the echo is ambiguous).
4. `.husky/pre-commit:75-79` reads a missing or empty `.turbo/last-gate.status` as
   gate failure, so a filesystem error is indistinguishable from a real failure.
   Fail-closed by design, ambiguous by construction.

## Could not determine (needs an authenticated read — tier 2 in the plan)

The live ruleset's required contexts; whether SonarCloud automatic analysis is
enabled; whether CodeQL default setup is actually disabled as `codeql.yml` requires;
whether `required_deployments: [Preview]` is still configured. Also: five validators
have **no header docstring**, so their "enforces" lines were inferred from imports
and constants rather than read from an authored description — those five are the
first candidates for the description contract.

## Nine authored skills that no harness can summon (cure in flight: PR #731)

**Correction of record — two passes.** This section first read that a skill directory
"has held no readable canonical", implying a broken artefact. The owner corrected it
at the boundary and the truth is the opposite, and worse: the artefacts are fine and
the **tooling's model of the corpus is wrong**.

The second correction was made on resume, 2026-08-04. The original text called this
finding **"unticketed as of the boundary"**. That claim was wrong and had never been
checked. PR #731 (`jimcresswell/parallax-family-generator`, opened 2026-08-03T08:45Z —
a full day *before* the boundary, draft, CHANGES_REQUESTED) exists precisely to cure
it, under an owner ruling of 2026-08-02. The verified finding stood; the ownership
claim attached to it did not, because nothing was searched before asserting it.

`.agent/skills/cognition/` is not a skill. It is a *collection*, and it holds the
Parallax family at `cognition/parallax/skills/` — **nine valid
`SKILL-CANONICAL.md` files** (`parallax`, `-frame`, `-decide`, `-learn`, `-audit`,
`-synthesise`, `-design-inquiry`, `-design-experiment`, `-product-experiment`).

Verified at the boundary, and still true on main because #731 is unmerged: **zero of
the nine are emitted as adapters** to either `.claude/skills/` or `.agents/skills/`.
Nine skills of authored work exist in the corpus and are summonable in no harness at
all.

The generator's model is flat — one canonical per top-level directory — and the
corpus has grown a nested family shape it cannot express. Its own message names the
cure ("or land the family-aware generator extension"), so the mismatch is *known to
the tool*. How it reaches the gates was measured first-hand on 2026-08-04, and the
first pass of this report had the two modes **backwards**:

| Mode | Exit | Says |
| --- | --- | --- |
| generate (`--prefix=oak-`) | **1** | `ERROR — canonical directories with no readable SKILL-CANONICAL.md: cognition`, plus the cure |
| `--check` — what `.husky/pre-push:65` runs, via `pnpm skills:check` | **0** | `All adapters are up to date.` |

The ungated mode tells the truth and fails correctly. The **gated** mode returns a
false green — and not by silence, which is how this report first described it. It
positively asserts that all adapters are up to date while nine canonical skills have
none. A gate that stays quiet at least leaves room for doubt; this one answers the
question, wrongly.

This is the ledger thesis in one artefact: a gate whose stated coverage exceeds its
real coverage, green on the one surface the hooks actually run, hiding nine missing
skills. It matters more
under the owner's ruling that skills become the source of truth *because* they are
the only lever with eval support — the corpus we are about to make authoritative has
a ninefold hole in its delivery path.

A search caution for whoever picks this up: grepping adapter directories for
`cognition` matches `metacognition` and reads as a false positive. Search for
`parallax`.

Nothing gates skill **description** quality either, which the naming rule calls a
routing defect with the same standing as a broken link.

**Owner position at the boundary** (2026-08-04): the collection was intended to hold
*all* thought-structuring skills, and the corpus should **either** endorse filesystem
organisation **or** be flat — *"mixing is a bad idea"*.

PR #731 already implements an answer. It removes the category tier by intact `git mv`
(`.agent/skills/cognition/parallax/` → `.agent/skills/parallax/`) and admits exactly
two shapes — flat individuals, and one-tier family bundles at
`<family-id>/skills/<skill-id>/` — refusing anything else, with duplicate leaf ids
failing `--check` rather than last-writer-winning silently.

So **MCP-494 is not a fresh design fork**; it is the reconciliation, and should be
worked as one: does #731's two-shape rule satisfy the owner's 2026-08-04 restatement,
and does the tooling REFUSE the non-conforming shape rather than ignore it? The mix is
what turned a design question into nine invisible skills; the refusal behaviour is the
part that stops it recurring.
