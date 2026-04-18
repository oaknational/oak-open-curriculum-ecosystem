# PDR-008: Canonical Quality-Gate Naming

**Status**: Accepted
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
(verify is default; mutation is explicit) and a consistent
CI-variant convention. Underlying tool invocations adapt to each
ecosystem.**

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
| `check` | yes | **Ergonomic alias for `check:fix`.** The short name carries the most-typed aggregate gate. This is the one deliberate exception to Rule 1 (see Convention Rules below). |
| `check:fix` | yes | Aggregate local gate: runs every verify-type gate plus every `:fix` sub-gate. Mutating; brings the tree into a state where `check:ci` would pass. |
| `check:ci` | no | CI-safe aggregate gate. Non-mutating; runs every verify-type gate only. Its exit code is the authoritative CI gate answer. |
| `fix` | yes | Aggregate apply: runs every `:fix` sub-gate so a developer can bring the repo into a state that `check:ci` passes. At minimum runs `format:fix` + `lint:fix`; ecosystem-appropriate additions welcome (e.g. `markdownlint:fix`, `knip:fix`). |

### Convention rules

Five rules govern the naming:

1. **Bare name = verify; `:fix` suffix = apply.** The safe default
   is non-mutating. Mutation requires an explicit `:fix` suffix.
   `format` verifies, `format:fix` applies. `lint` verifies,
   `lint:fix` applies. Running a bare-name gate cannot change the
   working tree.
2. **Inherently-action commands keep bare names.** `clean`,
   `build`, `dev` have no verify counterpart — they are actions,
   not assertions about state. They use bare names. An action
   command's implicit verify form, where one exists, uses a
   different name (`build`'s implicit verify is `typecheck`).
3. **`:ci` suffix = non-mutating CI form.** `check:ci` is the CI
   version of the aggregate gate — equivalent in verify coverage
   to `check:fix` minus the `:fix` sub-gates. Its exit code is
   the authoritative CI answer.
4. **`check` is the one deliberate exception to Rule 1.** `check`
   is defined as an alias for `check:fix` — the mutating local
   aggregate. The exception is ergonomic: the aggregate gate is
   typed tens of times per day in active development, and
   imposing the `:fix` suffix on every invocation is friction
   the ergonomics do not justify. Under the exception:
   - `check` = `check:fix` (mutating; applies fixes; local form)
   - `check:fix` = canonical name for the mutating aggregate
     (explicit form; the script body)
   - `check:ci` = non-mutating aggregate (CI form)

   The exception is scoped: it applies only to `check` as an
   alias for `check:fix`. No other bare gate aliases a mutating
   form. `format` does not alias `format:fix`; `lint` does not
   alias `lint:fix`.
5. **Additional gates are permitted.** The canonical set is the
   minimum. Ecosystem-specific gates (`knip`, `depcruise`,
   `secrets:scan`, `practice:fitness`, `portability:check`,
   `subagents:check`) may be added freely; they follow Rule 1.
   `knip` verifies unused exports; `knip:fix` applies knip's
   fixes. `depcruise` verifies dependency constraints; it has no
   `:fix` variant because violations are source changes.

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

`check` / `check:fix`, `check:ci`, and `fix` have specific
coverage requirements:

- **`check:fix`** (and its alias `check`) is the local aggregate.
  It MUST run every verify-type gate in the repo — at minimum
  `format`, `lint`, `typecheck`, `test`, and a build probe
  (either the full build or a verify-equivalent check that would
  fail for the same reasons) — plus every `:fix` sub-gate so the
  tree is brought into a state where `check:ci` passes.
  Repositories with additional verify-type gates (`knip`,
  `depcruise`, `secrets:scan`, `practice:fitness`) MUST include
  those too. A repo where `check` passes but a bespoke gate
  fails has a broken `check` contract.
- **`check:ci`** MUST have equivalent verify coverage to
  `check:fix` minus the `:fix` sub-gates. Its exit code is the
  authoritative CI gate answer. It MUST be non-mutating: a CI
  run cannot rewrite the checked-out tree. Any
  conceptually-must-verify gate available only in mutating form
  is wrapped so it verifies (e.g. run a mutating pass against a
  scratch copy; fail if it differs from the source).
- **`fix`** MUST run every `:fix` sub-gate the repo exposes. A
  `fix` that omits an available `:fix` gate leaves developers
  with a false "I ran fix, now check:ci should pass" expectation.
  `fix` is a subset of `check:fix`: `check:fix` includes the
  verify gates, `fix` is only the mutating sub-gates. A
  developer who has typed `fix` still needs to run `check` (or
  `check:ci`) to confirm the verify bar.

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

The one deliberate exception to verify-by-default is `check` as
an alias for `check:fix`. This exception is ergonomic, not
accidental: the aggregate gate is the single most-typed command
in the day-to-day quality loop (invoked tens of times per day
during active work). Forcing the `:fix` suffix on every
invocation imposes friction that the ergonomics do not justify,
and the CI-safe non-mutating form remains available as
`check:ci`. The exception is scoped narrowly to `check`; the
rest of the convention is uniform.

The convention's specific shape — bare/noun for verify, `:fix`
for apply, `:ci` for CI-variant — draws on existing ecosystem
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
- CI configurations MUST invoke `check:ci` (or `check` if no
  CI-specific tuning is needed) as the aggregate gate.
  Hand-rolled CI sequences that duplicate what the aggregate
  should cover are a drift vector and MUST be consolidated into
  the script.
- Reviewer prompts, automation tools, git hooks, and
  documentation that reference quality gates MUST use the
  canonical names. This preserves portability across the
  network.

### Forbidden

- Using canonical names with non-canonical semantics. A `lint`
  script that applies fixes is a contract violation; rename to
  `lint:fix` and add a real `lint` that verifies. The `check`
  alias-for-`check:fix` exception is the only permitted
  bare-name-maps-to-mutating alias; no other gate follows that
  pattern.
- `check:ci`, `check:fix`, or `check` with incomplete coverage.
  If a bespoke gate exists in the repo, it MUST be in the
  aggregate.
- `check:ci` that mutates the working tree. A CI-form
  invocation MUST leave the tree byte-identical.
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
- Existing repos that had `check` running mutating sub-steps
  (common pattern: `check` includes `lint:fix` so a local run
  auto-corrects) keep their `check` largely intact — the
  mutating aggregate is now canonically named `check:fix` with
  `check` as its alias. The new surface obligation is adding
  `check:ci` as the non-mutating CI form.

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

- Local authors type `pnpm check` (the short, mutating-aggregate
  alias); its clean exit proves the repo is in a state where
  CI would also pass.
- CI invokes `pnpm check:ci` (the non-mutating CI form); its
  clean exit is the authoritative merge gate.

Both forms share verify coverage. The distinction is mutation
scope: local form may auto-correct; CI form leaves the tree
unchanged. The merge criterion is `check:ci` green; the local
proof-of-merge-readiness is `check` (= `check:fix`) green.

### Why verify-by-default matters (and why `check` breaks it)

A contributor new to a repo, an agent hydrating for the first
time, or an automation tool running `pnpm <something>` without
full context should have the guarantee that a bare-name gate
cannot change source. Mutation is a request that requires an
explicit suffix. This matches how the Practice treats other
default-safe concerns: quality gates always blocking, strict
validation at boundaries, no ambient state, injected
dependencies over globals. Verify-by-default extends the
pattern to script names.

The `check` exception is a conscious trade-off. The aggregate
gate is the single most-invoked command in the daily loop; the
four characters of `:fix` multiplied by tens of invocations per
day per developer across the network is a real ergonomic cost.
The risk surface of the exception is narrow: `check` is nearly
always run by someone who understands they are running the
local gate, and the CI-safe form (`check:ci`) remains one suffix
away. The exception is worth its cost; it is not an invitation
to add further aliases.

### Host-local context (this repo only, not part of the decision)

At the time of authoring, the repo where this PDR was written
partially matches the canonical set. Specific divergences:

| Canonical | Current in this repo | Disposition |
|---|---|---|
| `format` (verify) | `format-check:root` | Rename |
| `format:fix` | `format:root` | Rename |
| `lint` (verify) | `lint` | Already canonical |
| `lint:fix` | `lint:fix` | Already canonical |
| `typecheck` | `type-check` | Rename |
| `check` (alias for `check:fix`) | `check` (mutating) | Keep; document as alias for the new canonical `check:fix` |
| `check:fix` | (absent — substance lives in `check`) | Add as the explicit mutating-aggregate name; `check` aliases to it |
| `check:ci` | (absent) | Add as non-mutating CI form |
| `fix` | `fix` | Already canonical in name and role (subset of `check:fix`) |

A migration within this repo renames the divergent scripts,
splits the current `check`, updates CI invocations, updates
pre-commit hooks, and sweeps internal documentation. That
migration is **not** part of accepting PDR-008 — it is a
follow-on execution task. Accepting PDR-008 fixes the names;
realising them locally is a scheduled change.
