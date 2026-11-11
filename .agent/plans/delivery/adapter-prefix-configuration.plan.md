---
id: adapter-prefix-configuration
node_type: delivery
name: "The adapter prefix resolves from one point of configuration"
overview: "Replace the hand-pinned adapter prefix with one resolver over a tracked default and an untracked per-checkout override behind a tracked example, proven for a second prefix in isolation while the projected skill names stay exactly as they are."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-09-06
ratified_where: "Owner answers at the lead seat (Flounder turns Estuary, c5cc2c), 2026-09-06 ~09:5xZ: 'ratified with notes below'; the notes are quoted verbatim in this node's Ratification notes and on the comms event of the same hour"
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: code-quality-binding-per-checkout
    kind: beneficial
owner_gates: []
last_updated: 2026-09-06
---

# The adapter prefix resolves from one point of configuration

## Goal

The generated skill adapters carry a name prefix (`oak-` today) that is pinned by hand in
four script and hook lines and in the generator's own usage text. After this lands, the
prefix is read from one tracked default file, overridable by one untracked per-checkout
file that a tracked example describes, and both the generator and its checker resolve it
the same way. The mechanism is proven for a second prefix in an isolated root. Nothing
projected changes: this checkout keeps `oak-`, every adapter directory stays committed
and byte-identical, and no checkout switches prefix: the owner's word, on 2026-09-05 and
again at ratification on 2026-09-06, is to build and prove the mechanism with no configuration
change, so the names stay exactly as they are.

## Ratification notes (2026-09-06)

The owner ratified this node with two notes, verbatim:

1. "we don't want a dirty tree or doubled skills, those are both obviously terrible ideas,
   that is why I already decided, and told you, that what I want is the mechanism
   implementing, but no config changes yet, so the output continues to be exactly what it
   is today, just using the improved code that makes future changes easy."
2. "this checkout will not switch to e-"

Consequences carried into this node: every unit lands the mechanism and nothing else — no
override file is created on any checkout, the tracked default holds `oak-`, and the
projected adapters stay byte-identical. The question the earlier draft held open, whether
the committed projections should become install-generated, is dissolved by the first note:
with no override there is nothing to double and no tree to dirty, and ADR-125's committed
adapters stand. The isolated-root proof is the only place a second prefix appears.

## User groups and value

- **An organisation running this repository as its own**: the mechanism for choosing its
  own projected skill names exists and is proven, so a future switch would be one untracked
  file rather than a rename sweep; no checkout makes that switch under this node, and the
  slice claims nothing about how an overriding checkout's projections would behave.
- **Contributors on any machine**: `pnpm skills:generate` and `pnpm skills:check` need no
  argument and cannot disagree with each other about the prefix, because both read the
  same resolver.
- **The platform's maintainers**: the second agent-tools reader of a per-checkout file
  (the merge-bot identity file is the first) lands as the shared shape the strategic node
  named — tracked default, untracked override, tracked example, strict schema, the override
  resolved at the primary checkout — and the read-parse-name-the-example helper the two
  readers share is extracted here, so every later identity pin that takes the per-checkout
  rung reuses one helper instead of a third copy.
- **The owner**: the mechanism lands with no configuration change and the projected output
  byte-identical, as ruled at ratification; a working, proven resolver is what any later
  word on prefixes would rest on.

## Mechanism

The per-checkout rung of the strategic node's ladder, applied to the generator; the
merge-bot identity file is the precedent for every shape below. The beneficial edge to
`code-quality-binding-per-checkout` is the shape of its ignore comments and examples,
which this node copies; it ships alone, carrying its own ignore line and example, whether
or not that node has landed.

1. **The resolver**, `agent-tools/src/skills-adapter-generate/prefix-config.ts`:
   `resolveAdapterPrefix({ repoRoot, primaryRoot, readFileImpl })` returns a `Result`
   carrying the prefix and its source (`override` or `default`). It composes two pieces
   the tests tell apart: a pure core, `resolvePrefixFromContents`, that takes the two
   files' contents (each present or absent) and returns the prefix with its source or the
   refusal, and a thin reader composition over `readFileImpl`, the injected reader the
   merge-bot loader already takes, defaulting to the real one. The override, `.agent/skills-projection.local.json`,
   is read at the primary checkout (the first entry of `git worktree list`, the same
   resolution the merge-bot and the collaboration substrate use) because an untracked file
   does not travel to a linked worktree; the tracked default, `.agent/skills-projection.json`,
   is read at the repository root the generator writes into, because a tracked file does
   travel with the branch and a worktree must regenerate against its own branch's default,
   never another branch's. If the override exists it wins; otherwise the default applies.
   Each file is parsed as JSON and validated through the strict-schema parse with a
   `.strict()` object of one field, `prefix`, whose grammar is a lowercase name fragment,
   `^[a-z0-9][a-z0-9-]*$` — tighter than the CLI's traversal guard, which stays on the
   explicit `--prefix` flag — and that grammar has one definition, in the resolver, which
   `cli-flags.ts` imports. The example's placeholder `<prefix->` fails the grammar by
   construction, so a copied-but-unedited override refuses loudly, naming the override, the
   example it is copied from and the field to edit, rather than minting a placeholder-named
   estate; a missing or invalid default names the tracked file. The read-parse-name-the-
   example step is the same one `agent-tools/src/merge-bot/repo-config.ts` already performs
   for the merge-bot identity file, so it is extracted into one shared helper under
   `agent-tools/src/core/` (a pure parse of file contents against a strict schema that
   names the file and its example on failure, composed over the injected reader), which
   both readers call; the merge-bot loader's
   messages and tests stay as they are.
2. **The tracked default and the example.** `.agent/skills-projection.json` holds
   `{"prefix": "oak-"}`; `.agent/skills-projection.local.json.example` holds
   `{"prefix": "<prefix->"}`. The root ignore file gains `.agent/skills-projection.local.json`
   beside a comment naming the example and the one value to enter, in the merge-bot line's
   shape. The Practice home holds only Markdown at its top level today; the two JSON files
   sit there because the projection they configure is a Practice-wide fact, not a package's.
3. **The CLI.** In `cli-flags.ts`, `--prefix=<value>` becomes an explicit override for a
   single run and is no longer required; an omitted flag means "resolve". Precedence is
   fixed: an explicit flag wins over the override file, which wins over the tracked
   default, and the source label has three values, `flag`, `override`, `default`. A new
   `--print-prefix` flag prints the effective prefix and its source on one line and exits
   before either the checker or the generator is called, so it reads and writes no
   projection: the proof instrument for any checkout, and `--print-prefix --prefix=e-`
   prints `e-` with source `flag`. The traversal guard on an explicit `--prefix` stays.
   `bin/skills-adapter-generate.ts` resolves once and passes the prefix to `checkAdapters`
   and `generateAdapters`, whose signatures do not change.
4. **The pinned sites.** The root `skills:check` and `skills:generate` scripts, the
   `agent-tools` `skills-adapter-generate` script, the pre-push hook's regenerate hint, the
   generator's header comment and the flag parser's own usage and error text drop the
   literal `--prefix=oak-`; the hint says `pnpm skills:generate`. A root script,
   `skills:prefix`, builds the package and runs the binary with `--print-prefix`, so the
   proof command exists in a fresh checkout as the planned prefix script. The commit skill's
   canonical, which tells agents the root script pins the required prefix, says instead
   that the prefix is read from the tracked default and the per-checkout override.
5. **The permanent record.** ADR-125 names the pin at three sites — the skill-adapter
   paragraph ("pinned by the root scripts"), the configurable-prefix paragraph ("the source
   default is empty; the effective prefix is passed explicitly via `--prefix=oak-`"), and
   the later restatement of the same — each corrected to say the prefix is read from the
   tracked default and overridable per checkout, with one dated change-log entry; its
   committed-adapters decision is untouched. The agent-tools README's skills section and the engineering doc's
   per-checkout file list say the same in one sentence each.
6. **Tests.** Unit tests, pure and without fakes, on the helper's parse core (valid
   contents parse; absent contents name the file and its example; invalid JSON and a
   schema breach each name the file) and on the resolver's core: default only; override
   wins; an invalid override refuses naming the file and the example; the placeholder
   refuses; a missing default names the tracked file. Integration tests, in the
   directive's shape of a simple fake injected as an argument, on the two reader
   compositions: each reads through `readFileImpl` and hands the contents to its core, so
   none touches the filesystem; the merge-bot loader's existing tests stay green through
   the extraction. The flag-parser tests cover the optional flag and
   `--print-prefix`. Three proofs drive the built binary against real temporary trees,
   so they live in the smoke tier (`agent-tools/smoke-tests/`, gated by `test:e2e`, the
   home of the commit-queue proofs that spawn git), never in the in-process integration
   runner, which the test-immediate-fails rule keeps spawn-free. The first builds a
   temporary git repository with a linked worktree whose branch carries a tracked default
   distinct from the primary branch's, runs the binary from the linked worktree twice —
   once with no override, asserting the worktree's own default is read and the primary's
   is not; once with an override saying `e-` at the primary, asserting it wins — so wiring
   the current directory into both roots, or the primary into both, fails one of the two
   runs. The second generates into a temporary root overridden to `e-`, asserts every
   projection lands under `e-*` with the class marker, and asserts the checker is green
   there. The third proves `--print-prefix` is inert by making one projection
   deliberately stale, running the binary with the flag, and asserting the output line and
   that the stale projection is still stale afterwards — a byte-identical regeneration
   would repair it, so reaching the generator at all fails the proof. A fourth run proves
   precedence at the layer that resolves: `--print-prefix --prefix=e-` with an invalid
   override present and no usable default prints `e-` with source `flag`, so a composition
   root that resolved the files before applying the flag would fail it. The real tree's checker stays green with no override present, which CI
   proves on the landing PR.

What this slice deliberately does not decide: whether projections remain committed when a
checkout overrides the prefix. With committed projections, an override checkout would
either list both the tracked `oak-*` set and its generated set, or clear the tracked set
and leave the tree permanently dirty. The owner's ratification note closes this: no
configuration changes, so no checkout overrides, nothing is doubled and no tree is dirtied;
ADR-125's committed adapters stand, and the isolated-root proof is the only place a second
prefix appears.

## Acceptance criteria (each with a proof — required)

- **One point of configuration.** `git grep -n -- '--prefix=oak-' -- package.json
  agent-tools/package.json .husky agent-tools/src agent-tools/README.md docs/architecture
  .agent/skills .agent/rules .agent/directives` returns nothing, and on this checkout
  the planned prefix script reports `oak-` with source `default`. The named
  residue outside that scope: the flag parser's unit test keeps explicit `--prefix` values
  because it exercises the surviving override, and the dated records under `.agent/reports`
  and `.agent/plans-old-archive` stay as written. Proof: `repo-safe`, the command and the
  output in the PR body.
- **Resolution order holds.** The resolver core's unit tests prove: default alone resolves
  `oak-` with source `default`; an override resolves its value with source `override`;
  an invalid override, the unedited example placeholder, and a missing default each
  refuse with a message naming the file to fix. Proof: `repo-safe`, the agent-tools unit
  suite.
- **The mechanism works for a second prefix without touching this tree.** The smoke
  proof generates into a temporary root overridden to `e-` and finds every projection
  under `e-*`, checker green; on this checkout the planned prefix script prints `oak-` with
  source `default`. Proof: `repo-safe`, the smoke proof and the command's output quoted in
  the PR body.
- **No projected name changes.** The landing PR's diff touches no file under
  `.claude/skills/` or `.agents/skills/`, and the pull-request workflow's `skills:check`
  passes on the head. Proof: `repo-safe`, `git diff --stat` on the PR and the check by
  name.
- **The example is a template, not a home.** `.agent/skills-projection.local.json.example`
  parses as JSON, and copying it unedited to the override name makes the planned prefix script
  refuse, because `<prefix->` fails the lowercase name-fragment grammar, with the message
  that names the override, the example and the field to edit. Proof: `repo-safe`, the resolver's placeholder
  test and the command in the PR body.
- **A cold clone is told what to copy.** The ignore comment names the example and the
  value; ADR-125, the agent-tools README and the engineering doc's per-checkout list say
  where the default and the override live. Proof: `repo-safe`, the docs validators in the
  aggregate gate and the ignore lines quoted in the PR body.

## Todos

Four PR-shaped units, each inside the sizing bands and safe on its own, in this order
(each `blocking` on the one before it):

1. **The shared checkout-config helper.** `agent-tools/src/core/` gains the parse core
   with its unit tests and the reader composition with its integration test, and the
   merge-bot loader is re-pointed at it with its existing tests green: a pure refactor,
   about four files.
2. **The resolver with its observable surface.** `prefix-config.ts` with its unit and
   integration tests, the tracked default, the example, the ignore line, and the minimal
   consumer that makes the resolver observable from any checkout: `--print-prefix` in the
   flag parser and the binary with the parser's tests, and the `skills:prefix` root
   script: about ten files, at the band, so the resolver never lands as an internal seam
   with only tests of itself, the scaffolding shape the design-by-tests directive
   forbids. Generation and checking still take the pinned flag in this unit; the tree's
   projections are unchanged.
3. **The switch, with the smoke proofs.** `--prefix` becomes optional and the generator
   and checker resolve through the same resolver when it is absent; the flag-parser tests,
   the one smoke file carrying the four built-binary proofs (the linked-worktree pair,
   the inertness run, the precedence run and the isolated-root `e-` generation) and the
   one permanent statement the switch falsifies, ADR-125's sentence that the CLI refuses
   an unprefixed run, land here: about five files. The root scripts, the agent-tools
   script and the pre-push hint still pass `--prefix=oak-`, an explicit flag with source
   `flag`, so every statement about the pins stays true and the tree's projections are
   unchanged.
4. **The pins drop, with their record.** The root `skills:check` and `skills:generate`
   scripts, the agent-tools script, the pre-push hint and the flag parser's usage, error
   and header text drop the literal, and every permanent statement that drop falsifies
   lands with it: ADR-125's two remaining sites with one change-log entry, the commit
   skill's canonical, the agent-tools README and the engineering doc. About eight files,
   four of mechanism and four carrying one-sentence record corrections; the record cannot
   land later, because ADR-125 would then state a pin the tree no longer has. This is the
   one PR whose body carries the `git grep` proofs, the planned prefix script's output, the
   placeholder refusal and the diff-stat proof that no projection moved.

## Out of scope

- Switching this checkout, or any checkout, to another prefix: the owner's ruling of
  2026-09-06 is that this checkout will not switch; the override file is not created
  anywhere, and the isolated-root test is the only place `e-` appears.
- Untracking the projections and amending ADR-125's committed-adapters decision: dissolved
  by the owner's ruling of 2026-09-06 that no configuration changes yet — with no override
  there is nothing to double and no tree to dirty, so the committed adapters stand.
- The `Skill(oak-*)` pre-approval entries in the tracked harness settings, the prose that
  names projected skills, and the four runtime strings that name `/oak-start-right-team`
  and `oak-consolidate-docs`: none is wrong while the names stand; they belong to the
  name-change slice, which the strategic node treats as prose migrating once to canonical
  ids plus a generated index.
- The identity-literal census validator: its own slice; this slice reduces the
  hand-pinned count it will be seeded with.

## First-principles check

The six clauses of the plan-body first-principles check, applied at authoring:

- **Shape.** The tests prove Oak-authored behaviour — precedence, the refusal messages,
  the primary-versus-worktree wiring, and that `--print-prefix` is inert — never that
  JSON parses or that a schema library works.
- **Landing path.** In-process tests take the estate's `*.unit.test.ts` name for the
  pure cores and `*.integration.test.ts` for the reader compositions with their injected
  fake, so the existing runner includes them; the binary-driving proofs take the smoke tier's
  `*.smoke.ts` name and its `test:e2e` gate, because the integration runner is spawn-free
  by rule; the scripts keep the names CI and the pre-push hook already invoke; the override
  is ignored by an explicit line, never a glob, so the example beside it stays tracked.
- **Vendor literal and locus.** `pnpm` forwards arguments after a script name, `git
  worktree list` names the primary first (the resolution the merge-bot already relies on),
  and no validator today forbids a JSON file at the Practice home's top level — each
  checked against the tree on 2026-09-05, and each re-verified at pickup.
- **Optionality.** One observable signal, the planned prefix script's line; the sequence is
  four ordered PRs; no deferral remains — the projections question is closed by the
  ratification note.
- **Record consumer.** The disposition ledger below is read by the pickup implementer,
  and reading it decides which findings are already applied and which are routed.
- **Rules tier.** `--prefix` survives as an explicit override, not a compatibility alias
  (replace-dont-bridge); the work is shaped as four small PRs, each inside the bands
  (design-work-for-small-prs);
  `skills:check` is neither weakened nor bypassed (never-disable-checks); both files are
  validated by a strict schema at the read boundary (strict-validation-at-boundary).

## Review dispositions

One row per finding; "applied" means folded into this node before ratification.

| Date | Source | Finding | Disposition |
| --- | --- | --- | --- |
| 2026-09-05 | readiness review | The tracked default resolved at the primary checkout, which reads another branch's file from a worktree | Applied: default at the generator's own root, override at the primary |
| 2026-09-05 | readiness review | The example placeholder passed the CLI's traversal guard | Applied: a lowercase name-fragment grammar the placeholder fails |
| 2026-09-05 | readiness review | The one-point-of-configuration grep was unachievable over the whole tree | Applied: scoped to live mechanism surfaces, residue named |
| 2026-09-05 | readiness review | The commit skill's canonical also pins the prefix | Applied: added to the pinned sites |
| 2026-09-05 | readiness review | ADR-125 names the pin at three sites, not one | Applied: all three named |
| 2026-09-05 | readiness review | The merge-bot loader is already a per-checkout reader; second consumer | Applied: shared helper extracted, first unit of the Todos |
| 2026-09-05 | readiness review | The beneficial dependency was absent from the body | Applied: stated under Mechanism |
| 2026-09-05 | PR #54 round one | `--print-prefix --prefix=<value>` precedence and source label unspecified | Applied: flag wins, source `flag`, covered in the CLI tests |
| 2026-09-05 | PR #54 round one | The proof named a binary the repository does not expose | Applied: the `skills:prefix` root script is the reproducible command |
| 2026-09-05 | PR #54 round one | The value claim overstated the switch as already a no-tracked-edit operation | Applied: reworded as enabling the later switch |
| 2026-09-05 | PR #54 round one | One PR of about twenty files breaches the small-PR bands (raised twice) | Applied: four ordered PR-shaped units |
| 2026-09-05 | PR #54 round one | The ledger collapsed seven findings into one row | Applied: one row per finding |
| 2026-09-05 | PR #54 round one | The first-principles check was not stated | Applied: the section above |
| 2026-09-05 | PR #54 round one | The worktree wiring was untested at the CLI level | Applied: the linked-worktree fixture through the entry point |
| 2026-09-05 | PR #54 round one | `--print-prefix` could still reach the generator undetected | Applied: the inertness test through the entry point |
| 2026-09-05 | PR #54 round two | The worktree fixture's primary override masked the default-root wiring | Applied: two runs, one with no override and distinct defaults per branch |
| 2026-09-05 | PR #54 round two | Binary-driving proofs were prescribed for the spawn-free integration runner | Applied: they live in the smoke tier under `test:e2e` |
| 2026-09-05 | PR #54 round three | The inertness snapshot passes if the generator rewrites byte-identically | Applied: one projection made stale first; reaching the generator repairs it and fails the proof |
| 2026-09-05 | PR #54 round three | Unit 2 landed the resolver with tests of an internal seam only (the scaffolding shape) | Applied: the resolver lands with `--print-prefix`, its root script and its smoke proofs; the switch is unit 3 |
| 2026-09-05 | PR #54 round three | Flag precedence was proven only in the parser | Applied: a built-binary run with an invalid override and no usable default prints `e-` from the flag |
| 2026-09-05 | PR #54 round four | The switch (unit 3) dropped the pins while the record (unit 4) corrected ADR-125 later, so one landed state left the ADR false | Applied: the record rides the switch; three units |
| 2026-09-05 | PR #54 round five | The resolver's unit tests would read the filesystem, which the testing directive forbids a unit test | Applied: the helper keeps the loader's injected reader and the resolver passes it through |
| 2026-09-05 | PR #54 round five | The second-prefix acceptance criterion still called the smoke proof an integration test at two sites | Applied: smoke proof at both; tier-word sweep found no other mismatch |
| 2026-09-05 | PR #54 round six | Tests with an injected reader are integration tests by the directive (a unit test contains no fakes), whatever the loader's precedent is named | Applied: pure cores under unit tests; the reader compositions under integration tests with an injected fake |
| 2026-09-05 | PR #54 round six | The eleven-file switch exceeded the ten-file band, which re-decomposes before a branch is cut | Applied: the switch (about five files, with the one ADR sentence it falsifies) and the pin drop with its record (about eight); four units |
| 2026-09-05 | PR #54 rounds seven–eight | Unit 2 lands `--print-prefix` without the three non-generation smoke proofs | Dispositioned on the PR reply, carried to the pickup: carry the proofs into unit 2 as a stated indivisibility, or record the linked-worktree and inertness scenarios as manual runs in its PR body |
| 2026-09-05 | PR #54 rounds seven–eight | `test:e2e` chains named `smoke:*` scripts with no glob, so a new smoke script is not run by the chain | Dispositioned on the PR reply, carried to the pickup: unit 3 adds `smoke:skills-prefix` and appends it to the chain. Superseded 2026-09-28: `test:e2e` now runs every `smoke-tests/*.smoke.ts` it finds and the per-file scripts are retired (J6), so unit 3 adds only the smoke file |
| 2026-09-05 | PR #54 rounds seven–eight | A valid override with an absent or malformed default must resolve to the override | Dispositioned on the PR reply, carried to the pickup: one core unit case and one integration case asserting the reader never asks for the default |

The three carried rows were dispositioned on PR #54's replies and named only on the lane-closed
comms event of 2026-09-05 until the consolidation fold of 2026-09-06 mirrored them here; the
pickup seat's first act on unit 2 is to honour them, not to rediscover them.
