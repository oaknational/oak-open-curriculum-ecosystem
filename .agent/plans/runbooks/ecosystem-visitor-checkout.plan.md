---
id: ecosystem-visitor-checkout
node_type: runbook
name: "Ecosystem visitor checkout — a satellite repository worked inside this checkout under the host Practice"
overview: "Check a satellite repository out under the gitignored `visitors/` directory of this checkout so it keeps its own git history and remote, stays invisible to the host's git and gates by construction, and is worked from sessions launched at the host root, which carry the host's rules, skills, hooks and tooling without any Practice transfer."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-09-06
ratified_where: "Owner decision cards at the lane seat (Finch binds Sundog, 47f9d2), 2026-09-06: ~10:3xZ, answer 'Ratify' to the card describing the ignore line, the clone under visitors/, host-root sessions, the bot's org-wide installation and the known limits; ~11:5xZ, answer 'Re-ratify, accept the no-rollback step' to the card listing the review revisions to steps 3, 4, 6 and 7 and the rollback for steps 6 and 7"
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-06
---

# Ecosystem visitor checkout

## When to run

When an organisation running this line wants a small satellite repository — a plugin, a
skills library, a scaffold for a product being extracted — to be built under this
repository's Practice without transferring that Practice into the satellite, and without
any of the satellite's content entering this tree. The satellite is a visitor: it borrows
the host's machinery at session time and never joins the host's history. In the Practice's
own exchange vocabulary this sits beside transformation and conjugation as a third mode,
held here as a working name, not doctrine.

## User groups and value

- **An organisation running a satellite alongside this line**: the full Practice on day
  one, zero sync or landing cost on the host, and a repository that lifts out unchanged.
- **The host's maintainers**: one tracked ignore line; nothing else in the tree knows the
  visitor exists.
- **Agents**: the rules, skills, hooks and agent-tools they already run, applied to a second
  repository through ordinary residency.

## Preconditions

- The host's `.gitignore` carries the line `/visitors/`. Check: `git check-ignore -q
  visitors/x` exits zero. Probed 2026-09-06 in a lane worktree: with that one line, `git
  status` shows nothing, the markdown gate (which reads the ignore file) reports zero files,
  and the formatter check (which reads the ignore file) passes. Without it both gates lint
  the visitor, and a per-checkout exclude hides it from git only.
- The vocabulary walker, the one validator that walks from the repository root rather than
  from enumerated roots, skips every nested directory that carries a `.git` entry as a
  foreign working tree, so a cloned visitor is outside its scope by construction and no
  exclusion entry is added. Check: the walker's foreign-working-tree test is applied to
  every directory below the root in `agent-tools/src/validators/fitness-vocabulary/walk.ts`.
- The satellite repository exists on its remote and the operator holds push rights and a
  bot identity for it. Owner-held.

## Steps

1. `agent` — From the host root, `git clone <satellite-remote> visitors/<name>`. Verify:
   `git -C visitors/<name> rev-parse --show-toplevel` names the visitor, and the host's `git
   status --short` shows nothing under `visitors/`.
2. `owner-held` — Bind the visitor's own commit identity and per-checkout bot configuration
   inside `visitors/<name>` (its own `.git/config`, its own untracked bot config behind a
   tracked example, following the host's merge-bot shape). Verify: `git -C visitors/<name>
   config user.email` names the satellite's bot, never the host's.
3. `agent` — Add the visitor's one Practice file: a root agent entry point that says how the
   repository is worked in either placement — as a visitor when it is checked out under a
   host (sessions launch at the host root and the host's Practice applies) and standalone
   otherwise (it carries only what it declares itself) — so the file stays true after a
   lift-out. Verify: the file exists, names both placements and carries no other
   instruction.
4. `agent` — Work the visitor from a session launched at the host root. Address the visitor
   explicitly on every command (`git -C visitors/<name>`, paths under `visitors/<name>`): a
   shell whose working directory persists across tool calls (Claude Code, verified
   2026-09-06) also honours a `cd`, but a harness that runs each call in a fresh process
   would send an unqualified command to the host. The host's rules, skills, hooks and
   agent-tools apply to every tool call because they load from the launch project. Verify: a
   forbidden operation inside the visitor is refused by the host's hook policy.
5. `agent` — Declare the coordination home before any collaboration-state command. From
   inside the visitor, git-native resolution names the visitor itself as primary and would
   seed a decoy substrate there; set `PRACTICE_COORDINATION_HOME` to the host's primary
   checkout root, or run the commands from the host root. Verify: the claims file the
   command touches is the host's.
6. `agent` — Gate the visitor's artefacts with its own minimal checks (format, markdown lint,
   plugin validation where it is a plugin) in its own CI, and its own git hooks where it
   wants commit-time gates: the host's hooks and gate suite never run inside the visitor,
   which has its own `.git`; only the host's tool-call policy governs the agent's commands
   there. Verify: the visitor's CI is green on its default branch.
7. `agent` — Commit and push inside the visitor with the host's commit discipline carried as
   behaviour (conventional message, explicit pathspecs, the bot as committer) and the
   visitor's identity; open its pull requests against the visitor's own default branch. Run
   the host's built agent-tools binary with the visitor as the working directory, because
   the host's root `pnpm` scripts act on the host whatever the shell's directory: from
   `visitors/<name>`, `node <host root>/agent-tools/dist/src/bin/agent-tools.js merge-bot
   push --branch <branch>` resolves the visitor's own bot configuration. On an empty
   repository, create the default branch through the hosting service's API as the bot
   before the first pull request: the bot push tool refuses a direct push to a default
   branch. The bot push sets no upstream, so verify the remote ref directly: after
   `git -C visitors/<name> fetch origin`, `git -C visitors/<name> rev-parse HEAD` equals
   `git -C visitors/<name> rev-parse origin/<branch>`.

## Verification

- Host untouched: `git status --short` at the host root shows nothing under `visitors/`;
  `pnpm exec markdownlint-cli2` and `pnpm exec prettier --check .` at the host root report
  no visitor file.
- Practice present: a session at the host root editing a visitor file has the host's hook
  policy fire (probe a refused operation), and its skills list is the host's.
- Coordination home correct: a claim opened while working the visitor lands in the host's
  active-claims file.

## Rollback

- Steps 1 to 3: remove the `visitors/<name>` directory; nothing in the host changes. Work
  pushed to the satellite's remote is unaffected; unpushed work inside the directory is
  lost, so push first.
- Step 5: unset the declared home; a decoy substrate seeded by mistake inside the visitor is
  removed by hand and named in the napkin.
- Step 6: the CI file is the visitor's own; revert it with a forward commit in the visitor.
- Step 7: no rollback for pushed history, which is never unwound (the estate's rule against
  using git to remove work): a wrong push is corrected by a further commit, and a pull
  request opened in error is closed in the visitor. The owner accepted this no-rollback
  step at the re-ratification recorded in the frontmatter.
- The ignore line stays: it is generic and harmless when the directory is absent.

## Known limits

- A session launched inside the visitor directory carries none of the host's Practice; the
  entry-point file in step 3 exists to say so.
- Lane worktrees of the host do not contain the visitor; clone it again under the worktree
  that needs it, or work the visitor from the primary checkout.
- The host's plan-corpus validator does not read a visitor's plan nodes; a visitor's records
  are its own plain files until a validator can be pointed at it.
- The host's git hooks never run inside the visitor; its own hooks and CI are its commit and
  push gates (step 6).
- The bot's push tool resolves the visitor's own bot configuration when run from inside the
  visitor (probed 2026-09-06 on the first visitor); the host's commit-queue tooling has not
  been run against a visitor's index.

- Why a visitor and not a fork-only directory in the host tree: a landing that deletes such a
  directory puts the deletion into shared ancestry, and the next upstream sync deletes every
  untouched fork-only file with no conflict — only edited files surface as modify/delete
  (reproduced 2026-09-06 in a throwaway repository; three of four independent reviewers found
  it). A fork-added top-level tier is either upstream-admitted (ADR-041's registrations) or
  excluded from the landing diff; a visitor needs neither.
