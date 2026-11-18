# Design: the `merge-bot commit` wrapper, conserved from the seat's scratchpad (2026-09-26)

Swallow holds Drift (516619). Status: a reviewed design (pre-execution review GO WITH CHANGES,
2026-09-25; its changes folded), not built. The landing toolkit's first wrapper, the Director's
condition 8 for the Codex seat rules (PR 241, merged `fc645531c`). Conserved here at compaction
boundary 4 because its only home was a session-local file; the thread record
`.agent/memory/operational/threads/codex-dialogues.next-session.md` carries the summary and
points here. The design below is the scratchpad text as reviewed, unedited.

---

## Design: `merge-bot commit` (the Director's condition 8 for the Codex seat rules)

## Why

PR 241 lets a Codex seat run `git commit` with no approval prompt through an exec-policy allow rule
(`prefix_rule(pattern = ["git", "commit"], decision = "allow")`), with forbid rules for
`--no-verify`, `-n` and `--amend` in the position right after `commit`. Exec-policy patterns are
exact tokens matched position by position (codex-rs 0.157.0 `execpolicy/src/rule.rs:16-25`,
`matches_prefix` at `:46`), with no wildcard, so `git commit -F m --no-verify` (a flag after the
free-form message file) is allowed by prefix. That skips the local pre-commit and commit-msg
hooks. The pre-push chain `merge-bot push` always runs is a superset of pre-commit's gates, but
the commit message's commitlint and major-version checks are not re-run anywhere.

The cure: a command whose own strict parser gives the commit its exact shape, so the rules
allow the wrapper and drop the `git commit` allow.

## Surface

```text
merge-bot commit --message-file <path> [--author "<Name> <email>"] [--json]
```

- Runs exactly `git commit -F <path>` (plus `--author=<value>` when given), in the invoking
  worktree, with the caller's environment. No other argument ever reaches git.
- Hooks always run: there is no `--no-verify` pass-through of any kind.
- `--message-file` is required, given once. `-m` does not exist: one message shape only.
- `--author` is optional, given once, shaped `Name <email>` (no newline, no angle brackets in
  the name). The repository's convention is the owner as author, passed per commit; the
  committer stays the configured identity.
- Refused by name, with a teaching message (the `merge-bot push` pattern): `--no-verify`, `-n`,
  `--amend`, `-a`/`--all` (staging stays by explicit pathspec), `--no-edit`, `-m`/`--message`.
- Any other argument is a usage error.
- No token is minted: a commit is local.
- Exit map, aligned with `push`: 0 committed; 1 operational failure (git's own non-zero exit,
  such as a hook refusing, nothing staged, or a missing message file, with git's stderr
  surfaced); 2 usage (including a refused flag, named); `--json` puts exactly the outcome object
  on stdout.

## Where

- `agent-tools/src/merge-bot/commit-args.ts`: the parser and `COMMIT_USAGE`.
- `agent-tools/src/merge-bot/commit-cli.ts`: `runCommitAction(rest, input)`. It calls git
  through the existing `GitExecutor` seam on its file-backed arm, since the pre-commit gate
  chain produces output whose volume the tool does not control (F-112).
- `cli.ts`: dispatch `commit`, append `COMMIT_USAGE` to the usage text.
- `docs/engineering/merge-bot.md`: a commit paragraph.
- `.codex/rules/seat-landing.rules`: allow `pnpm agent-tools merge-bot commit`; drop the
  `git commit` allow; keep the `git commit` forbids as guardrails (a hard refusal instead of a
  prompt). `.codex/README.md` and the execpolicy transcript updated.

## Tests (the owner's ruling: no call inspection, no config pins)

- `commit-args.unit.test.ts`: the parser as a pure function, argv in and a Result out: each
  refused flag named; a repeated or missing `--message-file`; an `--author` of the wrong shape;
  an unknown argument.
- A smoke in `agent-tools/smoke-tests/` over a real temporary repository, with the real git
  executor:
  - a staged file and a message file commit, and the log shows the message and the given author;
  - a `pre-commit` hook in the temporary repository that exits 1 refuses the commit (exit 1, HEAD
    unchanged), so hooks provably run;
  - a `commit-msg` hook that exits 1 refuses it too;
  - `--no-verify` and `--amend` refuse with exit 2, and HEAD is unchanged.

## Open questions for the review

1. Should `--author` exist, or should the author come from somewhere a seat cannot vary (for
   example the operator profile's scope file, which is machine-local)? Today a seat can type
   any `--author` after `git commit`, so the flag adds no capability.
2. Should the wrapper itself refuse a commit on the default branch, or leave that to the
   pre-commit hook's branch guard, which now always runs?
3. Is `merge-bot` the right home, given that no bot credential is involved? The Director named it
   `merge-bot commit`; the seat's landing commands then share one prefix in the rules.

## Revision after the pre-execution review (code-expert, GO WITH CHANGES)

- **Environment scrub, one table, two consumers.** A `hookSkipEnv` table beside
  `git-credential-chain.ts` sets `HUSKY`, `GIT_CONFIG_PARAMETERS`, `GIT_CONFIG_COUNT` (and every
  `GIT_CONFIG_KEY_n`/`GIT_CONFIG_VALUE_n` present in the base), `GIT_CONFIG_GLOBAL` and
  `GIT_CONFIG_SYSTEM` to undefined, plus `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and
  `GIT_COMMON_DIR` for commit (the pre-commit hook's own `env -u` precedent; `GIT_COMMON_DIR`
  because a caller pointing it at another valid common directory without the repository's hooks
  commits without the refusing pre-commit hook, reproduced by the Codex connector with Git 2.43.0
  at the fold's review, 2026-09-27, and listed by `git rev-parse --local-env-vars`; the smoke
  covers it beside the config-file case). The two config-file variables are in the
  table because a file named there can set `core.hooksPath=/dev/null` and the commit then runs no
  hook (the Codex connector verified this with Git 2.43.0 at the fold's review, 2026-09-27); the
  smoke covers it: a `GIT_CONFIG_GLOBAL` file setting `core.hooksPath=/dev/null` in the caller's
  environment, and the wrapper's commit still runs an executable pre-commit hook that exits 1,
  so the commit is refused. Its TSDoc cites `no-verify-requires-fresh-authorisation`. `merge-bot push`'s
  `pushEnv` uses it too (this moves condition 7's `GIT_CONFIG_*` item here).
- **`--author` required**, given once, strictly `Name <email>` (no newline, no `<`/`>` in the
  name, a non-empty email, no leading `-`), passed as one token `--author=<value>`.
- **The message file is checked before git.** The parser refuses `-` and any value that reads
  as a flag. The action resolves the path against `repoRoot`, reads it through an injected
  seam, and refuses a missing, unreadable or directory path with exit 2 naming it; git gets
  `--file=<absolute path>`.
- **No `--json`** in the first version. stdout carries nothing; the hooks' and git's output go
  to stderr through the file-backed arm's `onOutput`; a closing line names git's end with
  `describeGitChildEnd`. No `timeoutMs`.
- **No bot identity, no mint**: `commit` never calls `resolveBotIdentity`, and the usage text
  says so.
- **The default branch** stays with the hook's guard, which since PR 246 (merged 2026-09-26
  21:23Z) derives the branch named by `refs/remotes/origin/HEAD` and refuses it beside `main`
  and `master` (`.husky/refuse-commit-on-main.sh`); no widening follow-up remains.
- **Smoke** `smoke-tests/merge-bot-commit.smoke.ts`, registered as `smoke:merge-bot-commit` and
  chained into `test:e2e`, driving `runMergeBotCli(['commit', …])` end to end with the real
  executor, over a temporary repository with a seed commit:
  - success: one staged new file, one modified-unstaged tracked file, one untracked file;
    `HEAD~1` is the seed; `git show --name-only` lists only the staged path; `git status
    --porcelain` still shows the other two; `%an <%ae>` is the given author; `%cn <%ce>` the
    configured committer;
  - a pre-commit hook that exits 1 refuses (exit 1, HEAD unchanged), and its stderr marker
    reaches the wrapper's stderr, not stdout;
  - a commit-msg hook that exits 1 refuses;
  - a husky-shaped hook under `HUSKY=0` in the base environment still refuses;
  - a hook under `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0=/dev/null`
    still refuses;
  - `--no-verify` and `--amend` refuse with exit 2, HEAD unchanged;
  - a missing message file refuses with exit 2 before any hook runs.
- **`cli.ts`** is at complexity 7; the `commit` branch makes it 8, the cap. Dispatch through a
  record keyed by action instead.
- **Surfaces**: the commit skill's Codex form (`git add -- <paths>`, then the wrapper, in the
  seat's own worktree); `.codex/README.md` (the allowed list, the guardrails paragraph,
  `--message-file`); `seat-landing.rules` with `match`/`not_match` examples;
  `docs/engineering/merge-bot.md`.
- **Reviews after**: security-expert, test-expert, config-expert, docs-adr-expert with
  onboarding-expert, each focused.
