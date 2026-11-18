# PDR-008: Canonical Quality-Gate Naming

**Status**: Accepted (amended 2026-09-24 — see Amendment Log)
**Date**: 2026-04-18
**Related**:
[PDR-006](PDR-006-dev-tooling-per-ecosystem.md)
(leading-edge reference repos per ecosystem — this PDR sits alongside
it as complementary doctrine: PDR-006 names **who** leads an
ecosystem's stack choices; this PDR names **what** the gates are
called across all ecosystems);
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract — this PDR is one of the first authored under it).

## Context

Quality gates — the named commands that prove a repo is in a
releasable state — vary in naming across repos in the Practice
network even when the underlying tools are similar. Observed variations:

- `lint` meaning verify-only in one repo, apply-fixes in another.
- `check` aggregating different sets (formatting + linting + types;
  or formatting + linting + types + tests + build; or all of the
  above plus bespoke validators).
- `format:check` in one repo vs `format-check` or `check-format` in
  another (separator and ordering both varying).
- CI-appropriate variants named `check:ci`, `ci:check`, `test:ci`,
  or absent entirely (CI running a hand-rolled sequence not
  matching any named local gate).
- `typecheck` vs `type-check` vs `type:check` vs `tsc` vs `types`.
- Auto-fix aggregates named `fix`, `format-all`, `pre-commit`,
  `make`, or inlined into a combined `lint:fix` that does more than
  linting.

The cost of this drift accumulates at three surfaces:

**Hydrating agents.** When the Practice Core arrives in a new repo
and the hydrating agent needs to run the quality gate, "run the
full gate" has no universal command. The agent must read the
package manifest, infer which script is the aggregate gate, and
confirm the semantics before running it. PDR-006 names the
leading-edge reference repo for each ecosystem, but PDR-006 alone
does not settle what the gate commands are called once the
reference is consulted. Every hydration re-derives the mapping.

**CI configuration.** CI files that run quality gates cannot be
transferred between repos unchanged because the script names
differ. Hand-editing is required per repo, and the edits are
invisible to the next maintainer — the CI config silently diverges
from what a local command would produce.

**Muscle memory and tooling.** Contributor commands, reviewer
prompts, git hooks, and automation tools all hard-code script
names. When a contributor moves between repos, the names they
type do not match. When a reviewer agent's prompt says "run
`pnpm check` and report findings", the prompt works in some
repos and silently fails in others.

Underlying cause: the Practice network has agreed that quality
gates are foundational (reflected in distilled memory: "The
quality-gate criterion is always `pnpm check` from the repo root,
with no filtering, green"), but the **names** of those gates were
never canonicalised. The shape of the command is portable doctrine;
the commands are reinvented per repo.

## Decision

**Every repo in the Practice network exposes a canonical set of
named quality gates at the package-manager script level. The
canonical set is the minimum; additional ecosystem-specific gates
are permitted. Names follow a consistent verify/apply convention
(verify is default; mutation is explicit), and CI runs the
aggregate gate's verifying legs under a parity check. Underlying
tool invocations adapt to each ecosystem.**

### The canonical minimum set

Every repo provides these named scripts:

| Name | Mutating | Role |
|---|---|---|
| `clean` | yes | Remove build artefacts, caches, and generated output. Leaves source and manifests. Inherently an action command; has no verify form. |
| `build` | yes | Produce the repo's build artefacts. Inherently an action command; its implicit verify form is `typecheck`. |
| `dev` | yes | Run the repo's development loop (server, watcher, or equivalent). Inherently an action command. |
| `format` | no | Verify formatting. Fails if `format:fix` would produce changes. |
| `format:fix` | yes | Apply formatting across the repo. |
| `lint` | no | Verify lints. Fails if `lint:fix` would produce changes or report errors. |
| `lint:fix` | yes | Apply lints with auto-fix. |
| `typecheck` | no | Verify types across the repo. No `:fix` variant — type errors are source changes, not tool-fixable. |
| `test` | no | Run the repo's tests. No `:fix` variant — test failures are source changes, not tool-fixable. |
| `check` | source: no | Aggregate gate: runs every verify-type gate and applies no fixes. The action legs it runs (`clean`, a build, code generation) may rewrite derived output, never source. Its clean exit is the merge criterion, locally and in CI. |
| `fix` | yes | Aggregate apply: runs every `:fix` sub-gate so a developer can bring the repo into a state that `check` passes. At minimum runs `format:fix` + `lint:fix`; ecosystem-appropriate additions welcome (e.g. `markdownlint:fix`, `knip:fix`). |

### Convention rules

Four rules govern the naming:

1. **Bare name = verify; `:fix` suffix = apply.** The safe default
   is non-mutating. `format` verifies, `format:fix` applies. `lint`
   verifies, `lint:fix` applies. The aggregate apply is `fix` (and
   `fix:docs` for the documentation subset). Running a verify gate
   cannot change source.
2. **Inherently-action commands keep bare names.** `clean`,
   `build`, `dev` have no verify counterpart — they are actions,
   not assertions about state. They use bare names. An action
   command's implicit verify form, where one exists, uses a
   different name (`build`'s implicit verify is `typecheck`).
3. **CI runs the aggregate's verifying legs.** CI runs every
   verifying leg of `check`, and a parity validator fails a
   verifying leg that CI does not run, so a local `check` and CI
   cannot drift apart.
4. **Additional gates are permitted.** The canonical set is the
   minimum. Ecosystem-specific gates (`knip`, `depcruise`,
   `secrets:scan`, `practice:fitness`, `portability:check`,
   `subagents:check`) may be added freely; they follow Rule 1.
   `knip` verifies unused exports; `knip:fix` applies knip's
   fixes. `depcruise` verifies dependency constraints; it has no
   `:fix` variant because violations are source changes. A
   documentation subset, where a repo has one, is `check:docs`
   (verify) and `fix:docs` (apply).

### Per-ecosystem adaptation

The canonical set names the **script API** at the repo's package-
manager entry layer. The commands invoked underneath adapt per
ecosystem:

| Ecosystem | `format` invokes | `format:fix` invokes | `typecheck` invokes |
|---|---|---|---|
| TypeScript / Node (pnpm) | `prettier --check .` | `prettier --write .` | `tsc --noEmit` (often via turbo) |
| Python (uv / poetry) | `ruff format --check .` | `ruff format .` | `mypy .` or `pyright` |
| Rust (cargo) | `cargo fmt --check` | `cargo fmt` | `cargo check` |
| Go | `gofmt -l . && exit <n>` | `gofmt -w .` | `go vet ./...` |

The adaptation obligation is:

- **Names travel verbatim.** `format` is `format` in every
  ecosystem — not `fmt`, not `format-check`, not the underlying
  binary's name.
- **Semantics travel verbatim.** `format` verifies in every
  ecosystem; `format:fix` applies in every ecosystem. A repo
  MUST NOT use `format` for mutating semantics even if the
  underlying tool's bare invocation is mutating. Wrap it.
- **Underlying commands adapt.** The ecosystem's idiomatic binary
  invocations go inside the script body. Ecosystem-native
  conventions (`cargo fmt --check`, `ruff format --check`) are
  legitimate implementation choices wrapped under the canonical
  names.
- **Additions are ecosystem-local.** `ruff` may expose
  `ruff:unused` as an additional gate; `cargo` may expose
  `cargo:clippy` or similar. These additions are local to the
  ecosystem's leading-edge reference repo (per PDR-006) and do
  not propagate as canonical.

### The aggregate gate semantics

`check` and `fix` have specific coverage requirements:

- **`check`** is the aggregate gate. It MUST run every
  verify-type gate in the repo — at minimum `format`, `lint`,
  `typecheck`, `test`, and a build probe (either the full build
  or a verify-equivalent check that would fail for the same
  reasons) — and it applies no fixes. Repositories with
  additional verify-type gates (`knip`, `depcruise`,
  `secrets:scan`, `practice:fitness`) MUST include those too. A
  repo where `check` passes but a bespoke gate fails has a
  broken `check` contract. Any conceptually-must-verify gate
  available only in mutating form is wrapped so it verifies
  (e.g. run a mutating pass against a scratch copy; fail if it
  differs from the source).
- **CI** runs every verifying leg of `check`, and a parity
  validator fails a verifying leg that CI does not run. A CI run
  never rewrites the checked-out source.
- **`fix`** MUST run every `:fix` sub-gate the repo exposes. A
  `fix` that omits an available `:fix` gate leaves developers
  with a false "I ran fix, now check should pass" expectation.
  A developer who has typed `fix` still runs `check` to confirm
  the verify bar.

## Rationale

Four options were considered.

**Option A — No canonical names (status quo).** Each repo names
its own gates. Rejected: the drift-generating cost (hydrating
agents, CI configs, muscle memory) is already material and
grows with each new repo in the network.

**Option B — Canonicalise names only (no semantics, no
ecosystem adaptation rule).** Agree the script names but leave
the semantics and the command mapping to each repo. Rejected:
name-only canonicalisation would still permit `format` meaning
different things in different repos. The payoff is the
combination (names + semantics + adaptation rule), not any one.

**Option C — Canonicalise with bare = apply, `:check` = verify.**
The inverse convention: mutating is default, verify is explicit.
Rejected: running a bare command should be safe by default. A
contributor typing `format` or `lint` while exploring a new repo
should not rewrite the tree. Verify-by-default matches the
"safety is the default; danger is explicit" discipline that
applies across the rest of the Practice (quality gates always
blocking, strict validation at boundaries, no silent mutation).

**Option D (adopted) — Canonicalise names and semantics with
verify-by-default; ecosystem-adapt the underlying commands.**
Satisfies the portability goal (names + semantics travel) without
imposing uniformity where uniformity is not useful. The script
API is stable; the implementation adapts. Verify-by-default
matches the Practice's broader safety posture.

Verify-by-default holds for the aggregate too: the most-typed
command in the daily loop, `check`, verifies, and a repair is
always the explicit `fix`. A contributor or agent can run it at
any time without rewriting source.

The convention's specific shape — bare/noun for verify, `:fix`
for apply — draws on existing ecosystem
patterns rather than inventing new ones. `prettier --check` vs
`prettier --write` maps naturally to `format` vs `format:fix`.
The convention formalises a de-facto practice rather than
introducing unfamiliar patterns.

## Consequences

### Required

- Every repo in the Practice network MUST expose the canonical
  minimum set at its package-manager script level with the
  specified semantics.
- Every leading-edge reference repo (per PDR-006) MUST document
  its ecosystem adaptation — the mapping from canonical names
  to underlying commands — in its `docs/dev-tooling.md` (or
  discoverable equivalent per PDR-006).
- CI configurations MUST run every verifying leg of `check`, and a
  parity validator MUST fail a verifying leg that CI does not run.
- Reviewer prompts, automation tools, git hooks, and
  documentation that reference quality gates MUST use the
  canonical names. This preserves portability across the
  network.

### Forbidden

- Using canonical names with non-canonical semantics. A `lint`
  script that applies fixes is a contract violation; rename to
  `lint:fix` and add a real `lint` that verifies.
- `check` with incomplete coverage. If a bespoke gate exists in
  the repo, it MUST be in the aggregate.
- `check` that applies fixes. The aggregate gate MUST leave
  source unchanged; repairs belong to `fix`.
- Canonical names at a non-script layer (e.g. a Makefile target
  named `check` that is not also exposed as a package-manager
  script). The package manager's script surface is the canonical
  API surface; other layers may exist but do not substitute.

### Accepted cost

- Existing repos that use non-canonical names pay a one-time
  rename cost. The cost is concentrated: script names, CI
  configs, documentation, and a small number of automation
  references. Cross-repo muscle memory benefits accrue per
  rename.
- The convention constrains future naming choices. A repo
  wishing to invent a differently-named aggregate gate cannot
  do so under this PDR. Additions follow the convention
  (bare name = verify; `:fix` = apply) or are flagged as
  deviations needing rationale.
- New leading-edge reference repos (per PDR-006) inherit this
  naming obligation in addition to the stack-documentation
  obligation. The two PDRs compose: reference repos name the
  stack and expose the canonical gates against that stack.
- Existing repos whose `check` runs mutating sub-steps (a
  common pattern: `check` includes `lint:fix` so a local run
  auto-corrects) move those steps to `fix` and keep `check`
  verifying. A local run that should auto-correct is `fix`, then
  `check`.

## Notes

### Relationship to PDR-006

PDR-006 establishes that each ecosystem has a named leading-edge
reference repo whose stack choices are authoritative. This PDR
establishes that the gate names are stable across all ecosystems
regardless of which reference repo the stack comes from. A
hydrating agent now has two coordinates: consult the ecosystem's
reference repo (PDR-006) for the stack; invoke the canonical
gate names (PDR-008) to prove the stack is green.

### Graduation intent

Like PDR-006, this PDR is portable Practice governance. The
convention and its adaptation rules could graduate into
`practice-bootstrap.md` as a naming section within the Ecosystem
Survey template once the convention is exercised across several
hydrations. The graduation would mark PDR-008 as `Superseded by
<Core section>` and retain it as provenance for when and why the
names were fixed.

### Relationship to `pnpm check` as the merge criterion

The distilled-memory rule "the quality-gate criterion is always
`pnpm check` from the repo root, with no filtering, green"
carries forward in substance. Under PDR-008 the phrasing sharpens:

- Local authors type `pnpm check` (the aggregate gate, which
  applies no fixes); its clean exit proves the repo is in a state
  where CI would also pass.
- CI runs every verifying leg of `check`, under a parity
  validator.

The merge criterion is `check` green, locally and in CI. A repair
is always an explicit `fix` (or `fix:docs`), followed by `check`
again; a mutating command is never the proof.

### Why verify-by-default matters

A contributor new to a repo, an agent hydrating for the first
time, or an automation tool running `pnpm <something>` without
full context should have the guarantee that a bare-name gate
cannot change source. Mutation is a request that requires an
explicit suffix. This matches how the Practice treats other
default-safe concerns: quality gates always blocking, strict
validation at boundaries, no ambient state, injected
dependencies over globals. Verify-by-default extends the
pattern to script names, the aggregate gate included.

## Amendment Log

### 2026-09-12 — `check` applies no fixes; `check:fix` and `check:ci` retired

Owner direction (2026-09-12), adopting the convention the Practice's skills
and rules already assume of the repositories that carry it. The body is read
through this entry: `check` is the aggregate gate and applies no
fixes, `fix` is the mutating aggregate, and CI runs every verifying leg of
`check` under a parity validator, which gives the guarantee a separate CI form
was for. Retired with it: `check` as an ergonomic alias of a mutating
`check:fix`, the non-mutating `check:ci`, and the requirement to consolidate
CI into one aggregate script. A host repository enumerates its live gate and
validator sets in its own scripts and gates skill, never here (the
no-moving-targets rule); which scripts it names and how its validators are
grouped are the host's own record, paired with this record in its bridge
index.
