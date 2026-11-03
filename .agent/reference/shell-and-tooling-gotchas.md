# Shell and tooling gotchas (worked, dated, first-hand)

Small operational facts with real bite, each observed live in this
repository. Host-local reference (PDR-007 home class). Add entries with
a date and the observed mechanism; remove entries when the underlying
tool retires them.

## zsh

- **Unquoted leading-`=` words abort compound commands** (3 instances,
  2026-07-20; recurred 2026-09-09 at a seat running five chained reads —
  the cure that holds is one plain command per call, the
  `worktree-residency` rule's working shape, which PR #100's pending
  unattended-seats rule restates for every seat). `echo ===X===` in a chained command errors and kills the
  REMAINING chained commands invisibly: zsh's default `EQUALS` option
  performs command-path expansion on an unquoted word beginning with
  `=` (the `=cmd` form). Quote the separator or emit it with `printf`.
  Recurred 2026-10-13 (an `echo ==label` separator in a chained inspection, the
  rest of the chain lost): label with a leading `--` and a space.
- **`GID` is a READONLY integer parameter in zsh** (2026-07-20).
  Assigning a uuid to it fails as "bad math expression"; never use it
  as a variable name (same family: `UID`, `EUID`, `EGID`).
- **Brackets in a path are a glob** (2026-03-09): an unquoted
  `app/cv/[variant]/page.tsx` is expanded as a character class and the
  read fails or hits another file. Quote every route path that carries
  `[`, `]`, `(` or `)` (Next.js dynamic segments and route groups).
- **Monitor commands run under zsh too** (2026-09-2x): an unquoted `$var`
  does not word-split, and `"$n:a…"` reads `:a` as a path modifier, so write
  `${n}:`; run watch loops as `bash` scripts, prove a loop on a landed event
  before trusting its silence, and never pipe a Monitor through `grep` (the
  filter goes inside the script, or the exit code is the pipe's). Recurred
  2026-10-13: a doctrine probe passed its directory list as `$D` and every grep
  read zero, the control term included; the control term is what showed it,
  so a probe batch runs its known-positive term first and spells its paths out.
- **A `:` straight after an unbraced parameter is a modifier, inside double
  quotes too** (verified 2026-10-01): zsh reads `$NAME:r` (and `:h`, `:t`,
  `:e`, and `:a` above) as a history-style modifier on the parameter, so
  `"+refs/heads/$FOLDED:refs/remotes/origin/$FOLDED"` expands to `$FOLDED`
  with its suffix removed, then `efs/remotes/origin/…`, the `r` consumed.
  Brace the name: `"+refs/heads/${FOLDED}:refs/remotes/origin/${FOLDED}"`.
- **zsh reserves `path` and `status`** (2026-09-26): a loop variable named `path`
  replaced `PATH`, every later command was "not found", and two thread replies
  never posted. Never name a shell variable `path`, `status`, `argv`, `options`
  or `cdpath`; read state back after a scripted write.
- **Perl in-place replacements interpolate template literals** (2026-09-13):
  `perl -pi -e 's/…/…${name}…/'` reads `${name}` in the replacement as a
  Perl variable and writes nothing there; two TypeScript template literals
  were silently emptied and caught only by reading the diff. Escape as
  `\$\{name\}`, or edit source with the native per-file tool.
- **Unicode quotes block exact-match replacement in Markdown**: curly
  quotes and dashes in prose defeat a literal `old_string`; read the exact
  bytes of the line before an edit and paste them, never retype them.

## Repo tooling

- **Filesystem probes use absolute paths — a persistent shell cwd fakes
  vanished files** (2026-07-26): after a `cd` into a workspace, a
  root-relative `ls .agent/experience/` reports "no such directory" while
  the file exists, and a `find` from the same cwd "confirms" the vanish. A
  vanished-file conclusion needs a root-anchored (absolute-path) check
  before it is a conclusion.
- **Prettier must run with the target worktree as cwd** (2026-07-20): a
  root-anchored relative path from a reset shell cwd silently formats
  the wrong checkout (one pre-commit red before diagnosis).
- **`node_modules/.pnpm/<pkg>@*` listings read store RESIDUE** (2026-07-25):
  the pnpm store keeps prior installs' versions, so a glob listing after a
  bump can read back the OLD version while the bump worked perfectly.
  Verify a resolved version with `pnpm why <pkg>` or the lockfile, never a
  store-directory listing.
- **Branch-switch stale-dist brick** (2026-07-20): after switching a
  checkout between branches whose `@engraph/result` dist differs,
  `pnpm install`'s bootstrap fails on the stale dist and every filtered
  build recurses into the same failing install. Escape:
  `PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1 pnpm install`, then the filtered
  package build, then plain install.
- **pnpm-wrapped CLI invocations die at postinstall during source
  breakage** (2026-07-21): while the tree is broken, `pnpm <script>`
  forms of the agent-tools CLI fail at bootstrap; direct
  `node agent-tools/dist/...` (or `pnpm exec tsx` on source) is the
  resilient path — valid only while dist+deps stay coherent.

## Repo CLI (agent-tools)

- **`comms send` takes NO `--kind` flag** (2026-07-21): event kind is
  not caller-settable; the usage line is truth, not the event schema's
  kind vocabulary.
- **`claims adopt` requires the FULL claim UUID** (2026-07-21): the
  8-char prefix used throughout records and doctrine is rejected with
  "no active claim matches".
- **`claims heartbeat` and `claims close` require explicit `--now`**
  while `claims open` defaults it (three instances, 2026-07-20..23) —
  the per-command now-defaulting inconsistency, F-89 family.

- **`merge-bot mint-token` has no direct-run bootstrap** (2026-07-25, two
  seats): BOTH direct node entries (tsx on source and node on the built
  cli.js) exit 0 with empty streams on the MINT path — a silent exit-0 on a
  token-minting path. The working entry is `pnpm --silent agent-tools
  merge-bot mint-token --scope <name>` (`.agent/reference/merge-bot.md`).
  Scoped to the mint path deliberately: since MCP-385 the direct node entry
  DOES exit 2 with a proper stderr message on a `--scope` usage failure
  (verified 2026-07-29), so the blanket "always exit 0" reading is no longer
  true of every path.
- **A failing mint inside `GH_TOKEN=$(…) gh …` runs as the HUMAN**
  (2026-07-29): the substitution yields an empty string, `gh` treats an empty
  `GH_TOKEN` as unset, and it falls back to the keyring — silently executing
  as the signed-in, possibly bypass-capable account. Assign first and stop on
  failure (`token=$(…) || exit 1`); never the prefix form. See
  `.agent/rules/bot-identity-on-third-party-systems.md`.
- **Workflow-resume caches can serve degenerate results** (2026-07-25): a
  quota-wall degradation produced literal placeholder schema-fills
  ("test") that a later resume would have cache-served as valid — inspect
  the journal's actual return values for degenerate output before
  trusting a workflow resume cache.

## GitHub Actions

- **A hand-folded YAML `run: >-` block joins its lines** (2026-09-25): two
  commands became one, and a call hid behind an echo. Parse a workflow with
  a YAML library and read only `steps[].run` before reasoning about what
  runs; never read the folded text as lines.
- **A workflow existing only on a non-default branch is not dispatchable**
  (2026-07-23, single instance, mechanism inferred): no registration
  appeared after ~15 min. Working cure: `on: push` scoped to its own
  scratch ref — the push event runs the file at that ref immediately.
  Scaffold → evidence → delete-ref, proven on the Slack alert test.

## GitHub credential

- **gh-token invalidation masquerades as rate-limiting** (3+ instances,
  2026-07-13..20): anonymous-tier limits (`limit: 60`) after a 401 are
  the signature; `gh auth status` is the discriminator. Never diagnose
  "quota exhausted" from 403s alone; empty/failing gh reads are
  transport-down, not no-news. Fleet cure: stop polling, keep
  SSH-git/local work, one owner card for the interactive re-auth.

## Git craft

- **Cut-branch roll-ups from the primary use the UNBUNDLED form**
  (2026-07-21, owned violation): `git branch <name>` (pointer only, no
  switch) + `git push origin <name>` + `gh pr create --head <name>`.
  The muscle-memory `checkout -b` bundles create+switch and moves the
  shared primary; `git branch --show-current` after every
  branch-affecting command is the cheap tripwire.
- **A checked-out lane with no commits of its own is re-pointed without a
  reset** (2026-10-13): the hook refuses `git reset --hard` whatever the tree
  holds, and the block is a concept to reappraise, not a command to swap. The
  forward shape: `git switch --detach`, `git branch -d <lane>` (the safe
  delete refuses an unmerged branch), `git switch -c <lane> <new base>`, then
  `git merge --ff-only <parent>` to follow the parent afterwards; prove the
  preconditions first (`git rev-list --count <base>..HEAD` is 0 and
  `git status --porcelain` is empty), in the same command as the move.

A fast-forward of the primary succeeds over staged ride-along files whose content equals the
incoming tip: "the identical files were staged before the fast-forward, which git's two-way merge
accepts (proven in a scratch repository first)", so a fold lands without unstaging peer records (the
Director's landing record of 2026-09-06, event f05a54da).

## Markdown

- **A wrapped prose line starting with `+ ` reads as a list marker**
  (markdownlint MD004/MD032, 2026-07-23): reflowing prose so a
  continuation line begins with `+` (e.g. "…inputs X\n+ the report…")
  turns it into an unordered-list item in the wrong style. Reword to
  "and"/"plus" or rewrap.
- **Prettier pads a markdown table to its widest cell, so editing the widest
  cell realigns every row** (2026-09-07, the rules index: a one-cell edit
  became a 254-line diff twice). Fit the new text to the column's current
  width — prettier's own count, one wider than a naive character count
  where the cell holds an em dash — then `prettier --write` restores the
  single-line diff; recovering the file from the index is hook-refused, so
  measure first.

## Git hooks

- **husky names the failing STAGE only in its last line** (2 misreads,
  2026-07-21): a commit-msg failure (e.g. a >100-char subject) reads
  like a gate failure until the final `husky - <hook> script failed`
  line is read literally. Read that line before diagnosing; the
  pre-draft `check-commit-message` step in the commit skill collapses
  the whole layer.

## 2026-07-30 consolidation batch (each measured first-hand in the 07-24→30 window)

- **zsh does not word-split unquoted variables** (third monitor-recipe
  instance — the row is now owed): `for c in $CLAIMS` iterates ONCE with
  the whole string; four GraphQL ids went as one malformed argument.
  Iterate literal values or `printf '%s\n' … | while read`. Sibling:
  `${PIPESTATUS[0]}` is a bashism that expands EMPTY in zsh (whose array is
  the lowercase, 1-based `pipestatus`) — the piped-exit trap in a fourth
  costume.
- **pnpm re-appends the literal `--` at EACH forwarding layer**: a root
  alias forwarding through a workspace script delivers `['--', …]` to the
  leaf bin, and an arg scanner reading leading `--` as its terminator sees
  nothing. Drop the `--`; smoke the full script chain shell-level.
- **turbo parses bare `--force` as value-taking** and eats the task name
  (`turbo run --force build` runs nothing); use `--force=true`.
- **`spawnSync` timeout sets BOTH `error` (ETIMEDOUT) and `signal`** — an
  error-first branch swallows the captured streams the signal branch's
  diagnostics were added for; compose stream excerpts into both.
- **`join(root, dir)` silently mangles absolute dirs** (`join('/repo',
  '/abs')` → `/repo/abs`); `resolve(root, dir)` is the cure; every
  path-taking CLI option earns one absolute-input test.
- **esquery selector regexes mute on raw slashes**: `Literal[value=/a//]`
  parses and lint runs green but the selector NEVER fires (the `/`
  delimiter truncates it). Escape `/` inside `String.raw`, write
  escape-bearing config via a script, and prove it with a negative
  control (tmp file with the banned literal → expect the error).
- **A backtick in an inline `--body` is a live command substitution**:
  zsh executed a phrase out of a doctrine sentence mid-send and the event
  landed mangled at exit 0. `--body-file` is the only quoting-safe
  transport for non-trivial bodies.
- **`git add -- <deleted-path>` fatals (exit 128) when the deletion is
  already staged** — pathspec matches nothing and the whole add aborts;
  add only paths that exist on disk. And `git status --porcelain`
  collapses untracked DIRECTORIES — enumerating files needs `-uall`.
- **BSD grep -E has no `\s`** and a mis-quoted retry can still undercount
  with a clean exit — calibrate any counting instrument against a KNOWN
  count first; prefer a real parse (`matchAll`) over line-regex on
  structured sources.
- **Codex seat salvage paths**: a stopped Codex seat's opening prompt
  (including any relayed predecessor plan) survives verbatim in
  `~/.codex/history.jsonl` and `~/.codex/sessions/<date>/rollout-*.jsonl`;
  distilled tenure summaries in `~/.codex/memories/rollout_summaries/`.
  A 6-char PDR-027 prefix can span MULTIPLE relaunched platform sessions —
  prefix-identity is coarser than session-identity at the platform layer.
- **Google Docs under browser automation**: the canvas editor swallows
  synthetic input while the tool reports success — treat Docs as
  READ-ONLY (deliver content as paste-ready blocks). The `/mobilebasic`
  render is the reliable read surface, but it renders ACCEPTED text only:
  an absence verdict ("the doc lacks X") also requires the
  comment/suggestion history panel, where a full draft section can live
  invisible to mobilebasic. The write-side dual: Google Docs SYNTHETIC
  TYPING silently fails — the automation tool reports success while the
  document stays untouched — so mobilebasic is the reliable READ path and
  browser-automation writes into Docs need an independent read-back
  verification before any "written" claim.
- **An open-range dependency override (`>=X`) is a standing exposure, not
  a one-shot test subject**: its resolution is a moving target, so a
  survivability test can pass at authoring and fail a day later with zero
  repo changes (measured: froze at 4.0.40 on the 29th, floated to 5.0.14
  breaking two more packages on the 30th). The cheapest durable state is
  not having the override.
- **Grepping a shipped binary needs `LC_ALL=C`** or grep reports a false
  "binary file matches" zero-hit read; registry semantic hashes are
  computable via a temp tsx file inside the package dir importing
  `./semantic-source-sha256.js`; and a newline-joined variable passed to
  git reads as ONE pathspec — use `xargs`, and verify with a staged-count
  check.
- **Operational signatures worth knowing** (2026-07-30): a model tier can
  change WITHIN a session id, so tuple-matchers keyed on (session, model)
  mis-match across the change; a write command is never a probe (a stray
  all-zeros event id traced to an argument-validation "probe" that was
  actually a write); and the security-headers integration test's
  `Parse Error: Expected HTTP/, RTSP/ or ICE/` was ROOT-CAUSED (MCP-403,
  superseding the earlier "loaded-host flake" reading): supertest servers
  bind `::` (IPv6-any) while clients dial `127.0.0.1`, and a resident
  macOS Java listener on the colliding port answered the mismatch — the
  cure is the loopback-request test helper binding client and server to
  the same explicit loopback. A gate failure in a package the diff never
  touched is still a re-run candidate first, but this signature now has a
  named cause.
- **Under an inherited `COREPACK_ROOT` the resolved standalone pnpm refuses
  the `packageManager` self-switch** (observed on an 11.9.0-resolved pnpm
  against an 11.8.0 pin): strip the corepack env (`env -u COREPACK_ROOT …`
  or a clean shell) so the pin resolves its own binary.
- **Analytics/event-store retention config is free to fix only BEFORE first
  collection**: before any event lands it is a settings change; after, it
  is a deletion exercise with data-governance weight. The free-to-fix
  window closes at the first event — configure retention in the same
  change that enables collection.
- **Two whole-repo gate suites racing on one checkout can strand a Next
  build lock**: `next build` refuses with "Another next build process is
  already running" even after the racing process is gone (observed when a
  peer's pre-commit gate overlapped a merge-commit gate on the shared
  primary, 2026-07-31). Check `pgrep -fl "next build"` — if nothing is
  live, the lock is stale residue and ONE retry succeeds; the singleton
  gate-runner discipline is the prevention.
- **A Vercel function boot-throw serves 500 `FUNCTION_INVOCATION_FAILED`
  with ZERO runtime logs** — the throw happens before the logger exists,
  so "no logs" is itself the signature: check module-load/boot-path code
  (top-level awaits, config reads, imports) before instrumenting the
  handler.

## 2026-09-02 fold-carry batch (2026-08-19 instances carried at the fold merge)

- **zsh arrays are 1-indexed.** A `for i in 0 1 …` over `declare -a`
  silently dropped element 0 (one review thread unreplied, caught by the
  in-band NOT_FOUND error). Iterate the array itself, never numeric
  indices, in this shell.
- **zsh no-word-split, census edition** (recurrence of the row above,
  2026-09-02): a grep census over a space-joined path list in `$H`
  returned NONE for every probe because grep searched one nonexistent
  path and `2>/dev/null` hid the error. An all-NONE census is a probe
  failure until one known-positive probe in the set reads a hit — carry
  a positive control in every census.
- **JSX attribute strings decode HTML entities.** Both SWC and esbuild
  turn `"&mdash;"` into an em dash in attribute literals — a reviewer
  finding built on "string props render literally" was premise-false.
  Verify transform-level claims AT the transform, not from the JSX
  mental model.

## 2026-09-06 consolidation batch (2026-09-02→06 instances, each measured first-hand by the seat named in the napkin)

- **pnpm forwards a literal `--` to some scripts as an unknown flag.**
  `pnpm agent-tools:check-commit-message -- -F <file>` exits 2; feed the
  message on stdin (`< "$MSGFILE"`) or pass `-F` without the `--`
  (2026-09-03).
- **A rename through the version-control CLI stages both endpoints.** A
  later staging call naming the deleted path refuses ("did not match any
  files") and aborts the WHOLE pathspec add; after a move, stage the live
  paths only (2026-09-03).
- **A stale commit-queue intent blocks the next guard.** An intent that was
  enqueued and never committed (a failed guard, an abandoned ceremony)
  makes every later guard on overlapping files refuse with "multiple fresh
  matching commit-queue intents" until `phase --intent-id … --phase
  abandoned` (2026-09-03; 2026-09-06, frictions F-172).
- **commitlint `subject-case` rejects an uppercase token right after the
  type**: a subject beginning "ADR-227 …" fails; lead with a lowercase word
  (2026-09-03).
- **A markdown line opening with `#959's` is an ATX heading** to
  markdownlint (MD018); write `PR #959's` (2026-09-03).
- **zsh globs an unquoted `--include=*.md`** before grep sees it and fails
  with "no matches found"; quote the pattern (2026-09-05).
- **`claude mcp logout <name>` cannot see a server disabled in settings or
  whose plugin is off**: it answers "No MCP server named" for every disabled
  server. Order a disconnect clear-tokens-then-disable (2026-09-03, Claude
  Code 2.1.25x).
- **`vercel whoami` after `vercel logout` blocks on an interactive login
  prompt**: a batched logout chain timed out on it and the later commands
  never ran. CLI logouts run one per call, stdin closed, under `timeout`
  (2026-09-03).
- **The harness re-injects a nested checkout's rule pointers on every read
  under it.** One 2026-08 transcript holds 1,056 nested-memory attachments
  across eight worktrees under the repository's own platform worktree
  directory, naming 121 distinct rule files (separate counts; the per-worktree
  split was not retained) — the measured mechanism behind "the rules load
  twice" (2026-09-05).
- **The bot merge token expires hourly**; a 401 mid-batch is the tell —
  mint, then repeat the batch (2026-09-05).
- **`ls -1` hides dotfiles**, so it reports a just-copied dotfile as absent.
  **The ignore-check verb prints the matching pattern for a NEGATED path
  too**, so its output cannot say whether a file is ignored — ask the
  status command what the tree actually sees. **A background task's "exit
  code 0" is the wrapper's status**, not the command's. **A validator's
  file flag was `-F`, not `--file`** — read the tool's help before guessing
  the flag (experience letter, the MCP submission drive, 2026-08).
- **`cd` inside one Bash call persists into the next call.** The identity
  preflight and the bot token mint both resolve the repository from the
  working directory and fail outside the worktree ("not a git repository"
  → IDENTITY PREFLIGHT FAILED / TOKEN MINT FAILED); use absolute paths and
  never change directory (2026-09-04, relative paths reading "file
  missing" after one directory change; 2026-09-06, twice in one window).
- **A lowercase `path` variable clobbers PATH in zsh.** zsh ties the
  lowercase `path` array to `PATH` (likewise `cdpath`, `fpath`, `manpath`),
  so `path=…` in a loop silently empties PATH and every later binary reports
  "command not found" until a fresh call; name scratch variables anything
  else (2026-09-04).
- **A comms append is a transactional touch on the claims registry.** The
  `collaboration-state comms append` path reads the active-claims file
  through the migrating reader, so the first CLI use after a rebuild runs
  any pending one-time registry migration: on 2026-09-04 the 1.3.0 → 1.4.0
  queue split ran under a merge-landed broadcast, seconds after the
  rebuilt dist appeared and BEFORE the planned by-hand archive copy, so no
  pre-migration copy of that day's file exists. Take the archive copy
  before ANY CLI call after a rebuild — a comms send included.

## 2026-09-07 consolidation batch (2026-09-02→07 instances, each measured first-hand by the seat named in the napkin and verified at the drain)

- **The Actions runs listing returns at most 1,000 results per query and
  raises no error at the cap** (2026-09-02): a day with 1,325 runs produced
  a 1,000-line file and a clean exit, found only against the endpoint's own
  `total_count`. Count each window with `per_page=1`, split any day over the
  cap into sub-day `created` windows, and record per-day coverage.
- **A bot installation token is a second 5,000-requests-per-hour core bucket
  for read-only Actions pulls** (2026-09-02): two shards, one under the `gh`
  login and one under a minted installation token, ran side by side over a
  17,467-run export; the token lasts an hour, so the pull ran under a
  re-mint-and-resume wrapper on each timeout exit (124).
- **The Actions performance-metrics page under Insights has no REST
  endpoint** (2026-09-02): its per-workflow and per-job counts, run and
  queue times and failure rates are derivable from `actions/runs` and
  `actions/runs/{id}/jobs?filter=all` (queue time = job `started_at −
  created_at`; run time = `completed_at − started_at`; every attempt under
  `run_attempt`); the page's CSV is a manual download.
- **A format or lint run over an unquoted space-joined variable silently
  widens** (2026-09-03, the no-word-split family): `prettier --write $FILES`
  exited 2 on one nonexistent path; `markdownlint` over the same string
  linted the whole tree, so its verdict said nothing about the named files.
  Literal paths, one variable per file. Recurred 2026-10-14: `prettier --check $FILES` and
  `markdownlint` over an unsplit zsh variable printed their success lines over zero files; the
  proof is the count line ("Linting: N files"); split with `set --` or `$(cat list)`, and BSD
  `xargs` has no `-a`.
- **`validate-markdown-links` reads a link from a tracked source to an
  untracked new file as broken** and labels it
  `tracked-source-to-untracked-target` (2026-09-03): a new ADR plus its
  index row was red in the working tree and green once the new file was
  staged. Stage the new file first, or read the reason label.
- **A workflow fan-out stalled at N−1 of N is a held approval, not a slow
  agent** (2026-09-03): the journal's `started` versus `result` counts name
  the missing agent; its newest transcript ends on a Bash tool use with no
  result; no process is running. A hook-held command inside a background
  agent has no approver — stop the run, name the held command class in the
  prompt, resume from the run id (the cached agents return instantly).
- **`gh repo view` takes the repository as a positional argument and has no
  `--repo` flag** (2026-09-06).
- **`comms send --body` caps at 1,500 characters** (`MAX_COMMS_BODY_LENGTH`,
  2026-09-06); `--body-file` beyond it.
- **`gh api --jq` has no `--arg`**: interpolate values in the shell before
  the jq expression (2026-09-06).
- **A GitHub CheckRun still in progress carries no `conclusion`**
  (2026-09-06): read `(.conclusion // .state // "") == ""` as pending, never
  as absent or failed, or a green-by-name check read lies.
- **`merge-bot push` runs the full pre-push chain and takes minutes; three
  chains in parallel put the host at load 17** (2026-09-06) — the
  measurement behind the owner's host bound of two, at most three,
  simultaneous full local gates (2026-09-07).
- **`gitleaks detect --no-git` did not report a synthetic credential that
  git-mode scanning caught**, inside a file named by an AND-conditioned
  allowlist (gitleaks 8.30.1, 2026-09-06): a scanner-mode difference to
  verify per invocation, not a defect to route upstream unreproduced.
- **A zero from a probe is a probe failure until a known positive is in the
  set** (2026-09-06, the second instance that week): an xlsx written with
  the `x:` namespace prefix hid `<x:f>` formula tags from a bare `<f` grep,
  and a URL extractor's quoting matched nothing against real content.
- **`/code-review ultra` (`/ultrareview`) refuses 21 files / 16,235 lines
  and is owner-triggered only** (2026-09-06): run the link-closure census
  before any fixture branch, not after two abandoned attempts.
- **Prettier's `resolveConfig` returns null from a path outside the
  repository** (2026-09-06): a self-check resolving from its own output
  directory validated nothing until it resolved from the script's own
  location.
- **A `;`-joined chain runs every step regardless of the previous exit**
  (2026-09-06): a commit refused by the commit-msg hook (a 101-character
  header) did not stop the chain; the push moved nothing and a reply script
  posted, on three threads, a cure SHA the head did not carry. Gate every
  dependent step on the prior exit, and measure the header before the
  ceremony.
- **Some publishers answer 403 to a scripted fetch or HEAD** (2026-09-05,
  the evidence publisher's terms page to the harness fetcher; 2026-09-07,
  seven of twenty load-bearing citations to a scripted HEAD): a 403 to a bot
  is not a dead link and the honest verdict is "unverified by probe"; a page
  a seat cannot read first-hand has its terms carried in the artefact's
  metadata instead.
- **The reference-direction validator refuses a directive that links into
  `.agent/memory/**`** (patterns included; the #59 cure commit's hook,
  2026-09-06): doctrine names a pattern in backticks, never as a link.
- **A lane touching a `DELTA_SCOPE_PATHS` entry of the MCP current-source ledger runs
  `validate-mcp-content-current-source` as a lane gate before the ceremony** (2026-09-06):
  package gates never invoke it, so the pre-commit hook was the first place it fired and it
  refused the projection's first commit outright ("Reviewed semantic-delta files differ",
  eleven files). Cure shape: one review-ledger file per concern with an `excluded(...)`
  disposition and the semantic hash for each affected file, wired into the aggregator, then
  `refresh-mcp-content-current-source-anchors`.
- **The pre-push turbo step can replay a cached agent-tools test pass when only a root
  file changed** (2026-09-07): `tests/rules/rules-index-classification.unit.test.ts` reads
  `RULES_INDEX.md`, but the root `test` task declares only package-local inputs
  (`$TURBO_DEFAULT$`, `**/*.ts`, `vitest.config.ts`), so an edit to the index does not
  invalidate the cache — the pre-push log read `agent-tools:test: cache hit, replaying
  logs` while CI, running cold, failed the new core row's explaining trigger cell (the test
  requires the bare em dash): one CI cycle and one extra push on a terminal PR. Run the
  dedicated directory before the push (`pnpm exec vitest run tests/rules/` from
  `agent-tools/`, about 100 ms); the structural cure is declaring the root file among the
  task's inputs (`$TURBO_ROOT$/RULES_INDEX.md`, the form `tsconfig.base.json` already uses).
- **The skill-adapter projection check refuses a push whose skill reference changed
  without regenerated projections** (2026-09-07): an edit under a skill's `references/`
  needs `pnpm skills:generate` first, and the regenerated `.claude/skills/` and
  `.agents/skills/` copies travel in the same push.
- **The reference-direction validator also refuses a permanent doc that links to a plan
  node** (PDR-105; the second class after the `.agent/memory/**` one above, 2026-09-07):
  an ADR linking its delivery plan was refused at pre-commit. Doctrine states its own
  contract self-contained; a plan is named in prose at most, never linked.

## 2026-09-09 consolidation batch (2026-09-07→09 instances, each measured first-hand by the seat named in the napkin and verified at the drain)

- **`gh pr list --search` with a head-name query returns nothing, silently**
  (2026-09-09, the carrier check): filter server-side with `--head <branch>`
  (gh 2.97.0: "Filter by head branch"); any listing you read as "the full open
  list" needs an explicit `--limit`, because the default page is thirty and the
  command raises no error at the cap.
- **A `git grep` over a pathspec built by substitution gave different counts on
  two runs** (8 files, then 0; 2026-09-09): one term at a time in the plain form
  `git grep <term> <ref> -- '*.md'`.
- **The bot's push leaves the remote-tracking ref stale** (2026-09-09):
  `git fetch origin <branch>` before any `-d` or `rev-list` against it, or the
  ancestry proof reads the pre-push ref.
- **`git add -- <old> <new>` after a `git mv` exits 128 (`pathspec '<old>' did
  not match any files`), and a pathspec commit that omits the old path leaves it
  tracked-but-missing** (2026-09-08, the fold; Git 2.43). The sequence that
  works: `git mv` has already staged the rename, so `git add -- <new>` alone,
  then name BOTH endpoints in the commit pathspec (`git commit -- <old> <new>`)
  so the deletion is recorded. The commit skill's staging step still tells the
  reader to `git add` both endpoints — a pointer for its next records pass; the
  Director's fold script of that day worked around it by skipping absent paths
  at its add step while keeping them in the queue intent.
- **markdownlint MD028 fires on consecutive blockquotes without a separator**
  (2026-09-08): blank line, `---`, blank line. **MD018 fires on a wrapped line
  that begins with a PR number** (`#674)`, `#96`; 2026-09-08 and 2026-09-09):
  never let a reflow put `#NN` at a line start.
- **A moved record's relative links change depth** (2026-09-08): the links
  validator names the fix; run it before the push after any move.
- **`comms reply` refuses an unknown antecedent event id** (2026-09-08), and
  `comms show` refuses the 8-character prefix records use (2026-09-09); but
  `comms direct --in-response-to` copies whatever string it is given into the
  event unvalidated (the command's own integration test threads to a
  nonexistent id by design), so a caller verifies that full id against the
  store first or the threading edge dangles. Read ids from the store, never
  from memory.
- **The auto-mode permission classifier refused a Monitor arm and a one-shot cron
  identical in shape to ones it had allowed minutes earlier** (2026-09-08,
  2026-09-09): a refusal is not a verdict on the command — retry once with the
  same shape, then route it.
- **A subagent's final result is truncated at about 16,000 characters in the
  idle notification** (2026-09-09, four of five reviewers): put a scratchpad
  path in the original brief and ask for the report on disk plus a one-line
  pointer; a follow-up message asking for the file worked first time.
- **A merge-bot token re-runs a workflow job only under the `workflow-dispatch`
  scope** (Actions write): the `pull-request-work` scope does not request
  `actions: write` and answers `Resource not accessible by integration`
  (2026-09-08 and 2026-09-09). The installation holds the permission (read as
  held on 2026-09-11; the merge-bot reference document cites two bot re-runs of
  2026-09-12 in OCE) and a `workflow-dispatch` mint succeeds (2026-09-25), so
  mint that scope for a re-run; the empty-commit re-trigger is retired.
- **`apt` fetching Google's chrome-stable index returned "Hash Sum mismatch" at
  the Playwright install step** — three consecutive `browser-tests` reds in
  sixteen minutes (2026-09-09): an external-mirror class; re-run after it
  settles, never a push to fix; the OS-deps step is the surface to make resilient
  if it recurs.
- **The statusline log path resolves relative to the session's persistent cwd**
  (2026-09-09): after a `cd … && sed` left the cwd under `.agent/skills/cognition`,
  the log wrote `.agent/skills/cognition/.logs/statusline.log` every ten seconds
  and the skills generator refused the dot-directory under the skill tiers, so
  every push from the repository failed until the cwd returned to the root. Never
  `cd` in a call; absolute paths only.
- **A `.git/index.lock` collision with a peer's `git worktree add` in the same
  second aborts the ceremony cleanly** (2026-09-08): the lock is gone on
  inspection; re-run.
- **A fresh worktree has no `.husky/_` until install runs** (2026-09-09): a commit
  made before install runs no commit-msg or pre-commit hook and reads as if the
  gate passed.
- **The write hook fingerprints a user-home absolute path inside a file's
  CONTENT** (2026-09-05, 2026-09-06, 2026-09-09): scripts and records derive paths
  at runtime (`git worktree list`, `git rev-parse`, `mktemp -d`) or use
  repo-relative and sibling-relative paths.
- **A pre-authored apply script's match strings drift by the time they run**
  (2026-09-08, two words): re-read against the landed file before running; the
  dry run proved the old text, not the landed one.
- **The wrap cron fires only in an idle REPL** (2026-09-09): a night of
  notifications kept a Director's loop busy at the minute and the tick never
  arrived, so a dirty continuity line sat for an hour — a dirty continuity line
  is swept at the next quiet moment, cron or not.
- **The Sonar CLI's login and integrate path rewrites TRACKED files in place**
  (2026-09-03): `sonar auth login --org <org>` replaced the estate's customised
  Sonar hook scripts under `.claude/hooks/` with the CLI's stock five-line
  scripts, rewrote the two hook command lines in
  `.claude/settings.json` (dropping the error-logging wrapper and a trailing
  newline) and the SonarLint block in `.vscode/settings.json` — no seat edited
  them, and the session ran the stock hooks from then on. A vendor-owned
  in-tree surface is a pin class to name; after any `sonar auth` or
  `sonar integrate` run, `git status` before anything else, and read a
  logout's state from the tool's own status command, never its exit line (a
  `sonar auth logout` once left the keychain connection in place).
- **`ls --time-style` and `cat -A` are GNU flags; the macOS tools refuse them**
  — use `stat -f '%Sm %N'` for mtimes and `cat -v` for invisible characters.
- **A zsh glob that matches nothing aborts the WHOLE command** (`no matches
  found`), so a grep over several paths with one unmatched glob returns
  nothing for all of them and reads as a clean negative (four false NONE
  verdicts in one curation pass, 2026-09-14). Name paths literally, or set
  `nullglob` for the call; a census with a glob in it needs a known positive.
- **A pre-push gate that drives a browser starts the app on port 3000**, so a listener already on
  the port (a dev server, an earlier gate still running) fails the gate with a bind or connection
  error that reads like a test defect. Check the port is free (`lsof -nP -iTCP:3000 -sTCP:LISTEN`)
  before a push that runs the gate (the 2026-09-16 orchestration recipe, homed 2026-09-30).
- **Claude Code's Edit tool refuses a file in a sibling repository as unread until the Read
  tool has read it** (2026-09-30): a `cat` or `sed` through Bash counts as a read only for files
  under the session's own repository. Read the sibling file with the Read tool first, or make
  the change with a scripted exact-match replace that asserts on its anchor.
- **A regex over wrapped prose misses a phrase split across a line break** (2026-10-01): `\bthe
  lineage's\b` found 80 uses and missed nine whose "the" ended the previous line; match whitespace
  with `\s+` or collapse whitespace before matching, the same class as a presence check that
  compares unwrapped text with a wrapped file.
- **`grep -rl` over `.agent` can return non-UTF-8 files** (transcripts, binaries), and a Python
  `open().read()` on one aborts the pass; restrict with `--include='*.md'` or guard the decode. A
  substring exclusion list over-excludes: `practice.md` matched `accessibility-practice.md`; match
  on the basename, never a substring (2026-10-01).
- **A script that rewraps Markdown has to know frontmatter and code fences** (2026-09-30, one
  pass): an archiving script's rewrap joined a YAML frontmatter block into one line and moved
  two paragraphs inside a code fence. Skip the frontmatter block and every fenced block, or do
  not rewrap.

## 2026-10-01 consolidation batch (from the handoff and thread records; each searched for in both estates' permanent surfaces first)

- **`pnpm --silent` does not silence a nested `--filter` script's banner**: the root
  script's echo is suppressed, but the nested script's `$ ...` lines still reach stdout. A
  pipeline into `jq` first drops lines that start with a dollar sign, and a watcher started
  that way still prints one start-up line (two records, 2026-09-25 and 2026-09-28).
- **`gh api --field` reads a leading `@` as a file path**: to post `@codex review` as the
  bot, pass the body with `--raw-field` (one record, 2026-09-28).
- **A wait that filters on a reviewer's login must match the `[bot]` suffix**: the REST login
  of the Codex connector carries it, and a filter without it reports silence while Codex has
  answered (one record, 2026-09-28).
- **markdownlint MD049 reads a bare glob in a table cell as emphasis**: write globs in code
  spans (one record, 2026-09-13).
- **Build a grep work list from line-anchored markers**: a bare-word grep false-matches prose
  and under-counts. `^---` matches horizontal rules as well as frontmatter fences, so it is no
  test for frontmatter; a count taken that way reversed a ruling once it was measured
  properly (2026-09-13).
- **Under bash 3.2, `exec` with no arguments returns**: a hook wrapper whose floor branch
  ended in a bare `exec` fell through into its body. End the branch with an explicit exit
  (one record, 2026-09-28).
- **With git 2.50.1, pushing `<sha>^{commit}:refs/heads/<branch>` gives the pre-push hook a
  local-ref field of `<sha>^{commit}`**: a hook parser that reads fields 2 to 4 is unaffected;
  one that reads field 1 as a ref name is not (one record, 2026-09-29).
- **A scripted edit replaces one named block; it never slices between two anchors**: a slice
  deleted a test that sat between them. Read `git diff` before staging (one record,
  2026-09-28).
- **With `noUncheckedIndexedAccess` off, a guard on `arr[i]` is not a TS2367 error**: the
  comparison with `undefined` always compiles, so the compiler will not show which guards the
  flag would make necessary (one record, 2026-09-26).
- **Prettier reads nothing under `.agent/`**: `.prettierignore` lists the directory in both
  estates, so `prettier --check` on a rule, skill or directive prints "All matched files use
  Prettier code style!" having read no file (`prettier --file-info <path>` says
  `"ignored": true`). An evidence line cites only checks that read the file. markdownlint's
  config ignores part of `.agent/` as well (`.agent/reference/` and `.agent/reports/` among
  others, in both estates), so cite it only for the files its run counts as linted, beside the
  docs validators (first recorded 2026-09-28; the same false evidence line was written into
  eight pull-request bodies on 2026-10-01, and a markdownlint line over two ignored files
  the day after).
- **A review thread is a review comment with no `in_reply_to_id`**: read them with
  `gh api repos/<owner>/<name>/pulls/<n>/comments --paginate` and recompute the count before
  writing it into a record (2026-09-27).
- **`git status` lists no empty directory, even with `--untracked-files=all`**: a fresh empty
  results directory leaves a clean-tree test true (probe, 2026-09-27; a reviewer's finding
  was rejected on it).
- **`git fetch --prune` can delete the tracking ref that was a post-merge commit's last
  name**: a proof that reads only local refs then passes, and the branch is deleted with the
  commit reachable from nothing. Prove a branch merged against the remote's own refs
  (reproduced 2026-09-28).
- **A branch whose configured upstream is the default branch reports its ahead count against
  that base**: the count that matters for a push is the one against the pull request's own
  remote branch (2026-09-25).
- **TS6133 refuses what eslint's `after-used` allows**: an unused parameter in an
  interface-shaped fake passes lint and fails `tsc` under `noUnusedParameters`. Name it
  `_name` with a reason comment, and run `tsc --noEmit` in the pre-checks (2026-09-29).
- **Zod 4.4.3 carries a custom failure reason in `issues[0].message`** when the schema uses
  the `error` option (recorded in the Codex dialogues thread, September 2026).
- **A hermetic smoke fixture drops every `GIT_*` environment variable, not a chosen few**: a
  `GIT_CONFIG_COUNT` reproduction passed only after that (2026-09-29).
- **`process.exit` skips `finally`**: a smoke's `fail()` removes its fixtures itself, through
  a cleanup set filled after `mkdtemp`; a set-up throw in a TUI smoke leaks the temporary
  directory the same way (2026-09-29).
- **The Turbo remote-cache action fails with `Input "team" is required` when
  `vars.TURBO_TEAM` resolves empty**: an organisation variable's repository selection can
  exclude the repository. The action takes `team` (required), `audience`, `policy` and
  `revoke` (default true), and fails with a named error without `id-token: write`
  (read first-hand 2026-09-29).
- **The operator-profile sync push stages every tracked profile document**: before any
  profile write, pull, and read `git status --short` in that root; ask another writer to
  push first (both estates, 2026-09-26).
- **axe disables its colour-contrast rule under forced colours**: a forced-colours contrast
  regression has no automated sensor and is caught only by a rendered read (2026-08-18).
- **Claude Code resolves a relative `@` import against the importing file, and skips code
  spans**: a hand-kept `@.agent/rules/<name>.md` inside `.claude/rules/` pointed at a path
  that does not exist. A mid-turn harness injection showing a file's own text neither proves
  nor disproves expansion at launch; state such a claim as a prediction (vendor docs read
  2026-09-13).
- **Rule front matter differs by host**: Claude Code's `.claude/rules` `paths` is a YAML
  list with brace expansion (1000 patterns and 4 MiB per rule); Cursor's `.mdc` takes
  `globs` as one comma-joined string and an explicit `alwaysApply` (vendor shapes read
  2026-09-13).
- **A guard's fail-closed claim never leans on husky's `sh -e`**: the guard refuses by its
  own exit, and its smoke resolves the shell through a trusted resolver, never a literal
  `/bin/sh` (two review findings, 2026-09-26).
- **A seat's scripts take the repository root as an argument and never `cd`**: a foreground
  `cd` moves the session's working directory for every later command (2026-09-27, and again
  2026-10-01).
- **Copilot's review can start by itself**: GitHub requests it when a pull request is marked
  ready, and some pushes start one. Read the pull request's reviews and requested reviewers
  before requesting a leg: an explicit request after an automatic one returns HTTP 422, and a
  duplicate can cost a review round (four records, September 2026).
- **A workflow re-run keeps the original `github.actor`** and that actor's privileges; it does
  not take the identity of whoever re-ran it (GitHub's contexts reference, read 2026-09-29).
- **A workflow run dispatched with the bot's token is capped at that token's permissions**, so
  the mint scope for a dispatch names every permission the dispatched run needs (2026-09-20).
- **Array expansion hides a flag from a text-matching security analyser**: a `curl --proto`
  built into an array is invisible to it. Write the flag and the URL literally at every call
  site the analyser must see (ten literal sites were flagged and six variable ones were not;
  2026-09-02).
- **A registry audit cannot see repository advisories**: a dependency gate built on the
  registry's audit misses an advisory published only on the package's repository (one resolved
  version sat inside two such advisories; September 2026).
- **Owner-only file modes do not hold on a mount that ignores modes** (WSL `/mnt/c`, CIFS,
  vfat): read the mode back after setting it, and refuse or replace a file whose mode admits
  another account (2026-09-25).
- **The comms watcher's event line truncates a long body**: read the full body from the event
  file in the comms store before acting on it (a freeze message was cut, 2026-09-29).
- **`comms send` prints an `event_id` JSON on success, and echoes the body**: test for the id or
  the exit code, never by searching the output for the word "error" (a misread result caused
  duplicate events; 2026-09-25).
- **`claims open` can refuse as blind to comms while a gate runs**: under gate load the
  watcher's heartbeat lags past its 90-second bound. Re-run after the gate (2026-09-25).
- **The cited-paths validator checks paths, not record numbers**: a citation of a decision
  record by number is verified by reading the record's title at the target (2026-09-13).
- **The pending-graduations counter reads one entry shape**: only an inline-bracket entry is
  counted; an entry filed under a heading with bullets is neither counted nor flagged, so the
  register reads empty while holding it (found 2026-09-13).
- **`comms send --tag heartbeat-end` is refused**: the tag namespace is `failure-mode`,
  `behaviour-note` and `heartbeat`. Put `heartbeat-end:` at the start of the title (found by a
  spot check on 2026-10-02 to be stated in neither estate).
- **`gh pr create` needs the head branch on the remote**: push first, and read the push back,
  before the create call (a thread record of September 2026).
- **`comms send --body` is refused over 1,500 characters**, before anything is written (exit
  2; `MAX_COMMS_BODY_LENGTH` in the CLI, read in both estates on 2026-10-02). Pass a longer
  body with `--body-file`.
- **Pass the registered `--model` on every comms call that resolves an identity**: the
  command's `--help` says whether it takes `--platform` and `--model` (the sending, watching,
  inbox and reply commands do; the read-only `comms list` and `claims heartbeat` refuse
  them). The call binds the seat's registered platform and model, and a mismatch refusal
  reads like an identity collision (2026-07-29).
- **`comms send` can exit 1 after a durable write, or print usage and write nothing**: read
  `comms list --since` before any retry, never the exit code alone (2026-07-30).
- **macOS's `patch` with no terminal reverses a hunk the target already holds**: its prompt
  "Assume -R? [y]" defaults to yes (patch 2.0-12u11-Apple; GNU patch defaults to no and skips
  the hunk). Pass `-N` on either: probed on 2026-10-02, bare and `-t` reversed the hunk, `-f`
  applied it a second time, `-N` ignored it and exited 1. After any port, scan the changed files for a three-line run
  that occurs twice: a port made from the other estate's raw diff reversed one hunk and
  duplicated three passages (2026-10-02).
- **`git log` `%cI` moves on a rebase, cherry-pick or amend with no content change; `%aI` does
  not**: a drift check regenerates, it never compares committer dates (one handoff record).
- **HTTP 403 from a publisher to a scripted client is a refusal, never a dead link**: record
  "unverified by probe" (2026-09-07).
- **A harness classifier's refusal is session-local, and a classifier error is transient**: a
  successor re-tests and never inherits a refusal as a gate; an error retries once
  (2026-07-15).
- **After GitHub Code Quality is re-enabled, a head minted before it is refused at
  all-green** ("base branch policy prohibits"): update the branch to mint a fresh head
  (2026-07-20).
- **An out-of-credit Codex connector posts a "usage limits reached" notice on a new pull
  request within seconds**, and a billing-capped Claude review bot posts a skip notice: each
  is the observable outage, and a skip is never a pass (2026-06-28, 2026-09-10).
- **`/restart` is not a fresh session**: hook session state persists (2026-07-25).
- **A `NODE_OPTIONS` tap reaches only the config that runs**: a harness change needs the full
  gate surface green, not one config (2026-07-30).
- **When the primary checkout cannot build, a lane worktree that built the CLI still carries
  comms**, and a `pnpm`-wrapped CLI call dies at postinstall while `node` on `dist` works only
  while `dist` and the dependencies agree (2026-07-20).
- **`mint-token --scope` enforcement depends on which build runs**: a rebuilt CLI requires
  the flag where an older `dist` accepted a mint without it (2026-07-29).
- **vitest path arguments under `pnpm --filter` are workspace-relative** (`tests/...`,
  `src/...`), never prefixed with the repository path (2026-07-20).
- **prettier run inside a workspace resolves that workspace's config and can warn falsely**:
  check formatting from the repository root before treating it as drift (2026-07-30).
- **In zsh, `status` is read-only** (use another name), and a backslash before `>` inside
  test brackets misparses (2026-09-17).
- **The shared CLI registry files in agent-tools are additive-only across parallel lanes**, so
  their merges serialise (2026-06-28).
- **git can sleep on the fsmonitor socket** (one daemon per worktree): pass
  `-c core.fsmonitor=false` to the command; a clone may set it once in its config
  (2026-09-17 to 2026-09-23).
- **Profile a gate before optimising it**: `turbo run --summarize` and a timing line per gate
  step name the quickest win (2026-09-29).
- **`gh pr create --draft` fails on a branch with no commit beyond its base** (2026-06-28).
- **Copilot's automatic review may not bind a tip that is only a merge commit of the base**:
  after a "merge the base in, then land" push, read the reviews for a review on that tip before
  waiting for one (one record, 2026-09-02, carried as received and not reproduced; frictions
  entry F-167).
- **The Claude Bash tool's sandbox can return empty content for reads under `.agent/memory/`,
  and its shell is zsh**: a grep that reads empty everywhere, a known-present term included,
  is the tell (2026-06-30, confirmed again 2026-07-02; frictions entry F-111).
- **git commands and quality gates run outside the harness sandbox** (owner direction; the
  sandbox refuses their writes and network reads).
- **A worktree's local default branch can sit many commits behind the remote**: cut a branch
  from `origin/<default>` after a fetch, never from the local name (2026-09-13).
- **CI can drop webhook events under throttle**: a pull request may show no checks at all. A
  push re-fires them; bot authorship is not the cause (August 2026).
- **Agents of one session share one scratchpad directory**: put a distinguishing token in every
  scratchpad filename. One collision overwrote a validated commit message before
  `git commit -F` read it (August 2026).
- **Download external data once**: write a CI log or an API response to a scratch file and read
  it locally; do not request it again for a second look (2026-03-30).
- **`ps`'s `%cpu` is an average, not the load now** (on Linux, CPU time over the time since the
  process started): take two samples of CPU time a few seconds apart, or read `top`, before
  calling a process busy or idle (2026-09-24).
- **`open(p, 'w').write(compute())` truncates the file before `compute()` runs**: Python opens,
  and empties, before it evaluates the argument, so a raise in `compute()` leaves an empty
  file. Compute first, then open (2026-10-01: a decision record was emptied and restored).
- **A computed listing printed into a seat's context gets a bound**: a line count or a heading
  list first, then the range that is needed. One unbounded read of a ledger of long rows cost
  about 28,000 tokens (2026-10-02).
- **The context meter's first read after a compaction can describe another moment**: 63.9 % and
  0 % were read where the next reads said 28.9 % and 17 % (2026-10-02). Read it twice, a few
  calls apart, before anything is priced on it.
- **A Copilot review can carry a claim in its overview with no thread, under "Findings:
  None"**: read every review body in full. On 2026-10-02 one such sentence named two files and
  nothing else; reading the pull request's additions to those files found three true
  contradictions.
- **A watch whose ready condition needs "no review request pending" never fires where a
  person's request stands**: count only the vendor reviewers' requests, and read each
  condition of a new watch against one live sample before trusting its silence (2026-10-02).

## 2026-10-02 consolidation batch (from the live notebook's rotation; each searched for in the permanent surfaces first)

- **A `\uXXXX` escape written in an Edit or Write parameter can reach the file as the raw
  character** (U+202E did, twice, 2026-10-01): write the brace form `\u{202e}`, which no layer
  decodes, and grep the file for the raw bytes afterwards.
- **A gitignored directory is still inside knip's reach**: a scratchpad sync that carried code
  into the state directory failed the push on knip (2026-10-02); exclude code from the sync
  (`--exclude '*.ts' --exclude '*.js'` and kin).
- **Run `git check-ignore -v <path>` before adding a file under a state directory**: the
  handoffs directory is gitignored in both estates, so `git add` of a record there fails
  (2026-10-02).

## 2026-10-14 consolidation batch (from the third dedicated consolidation's registers; each searched for in the permanent surfaces first)

- **A carry between estates is proved by `git ls-files` and `git check-ignore -v`, never by a
  green local gate**: a bare `build` ignore line swallowed a carried directory, so the local
  gate passed and CI went red (2026-10-05). After copying a directory, `git ls-files` it in the
  receiving tree and `git check-ignore -v` anything missing, before the commit.
- **A sibling's gate that needs a browser takes one Playwright install per Playwright version**
  (`pnpm --filter <app> exec playwright install chromium-headless-shell`), and knip's exit is
  the verdict while its hint count is information: the two estates differ on
  `treatConfigHintsAsErrors`, a family drift to name, not a finding (2026-10-05).
- **A dry run under `TURBO_FORCE=true` needs `--cache=local:rw`**: `local:r` meets "WARNING no
  caches are enabled" while `local:rw` is silent (2026-09-30); every place that names the remote
  cache's team must agree, and `turbo config` on each host is the check that they do.
- **A table transform rebuilds each row from its cells**; the closer's width check is
  necessary, not sufficient, and `grep ' | |$'` finds the empty cell (2026-10-03).
- **Markdownlint by explicit path still ignores `.agent/reports/**`**: lint a report by copying
  it outside the repository with the repo config (2026-10-03).
- **A commit pathspec that names a renamed or deleted path aborts the whole `git add`**: stage
  what exists, commit by the full pathspec (2026-10-05).
- **`pnpm --filter <name>` with no matching package prints "Scope: 0 of N" and exits 0**: a test
  run's proof is its "Test Files" line, never the exit (2026-10-05).
- **In Python, `open(p, "w").write(compute())` truncates the file before `compute()` runs**:
  compute first, then open (2026-10-10).
- **A sender probe against the live comms directory writes an event before its output step
  fails**: a probe of the sender's refusal with its output at `/dev/null` left a one-word body on
  the append-only stream (2026-10-02); both estates' CLI takes `--comms-dir`, so a probe points
  it at a scratch directory.
- **SonarCloud's security rating fails a smoke that resolves `pnpm` or `git` through `PATH`**: a
  smoke spawns `process.execPath` with tsx and the resolved trusted git (both estates carry the
  smokes; cured in OCE on 2026-10-03).
- **BSD `grep` has no `\b`**: `grep -o '\bok('` matched nothing and read as absence; a fixed
  string (`grep -F`) or a python `in` test (2026-10-14).
- **`git log --format=%cI` prints the committer's local offset (`+01:00`)**: a record stamp copied
  from it with a `Z` suffix is wrong by the offset. A stamp is read from `date -u` at the moment
  of writing, never from a commit time or the seat's sense of the hour (a stage's stamps ran an
  hour fast and were corrected by the commit times, 2026-10-14).
- **A fresh linked worktree installs its dependencies on the first script run** (1,289 packages
  from the store in fifteen seconds, with the bootstrap) and holds no workspace package `dist`:
  knip's config loader then fails on the first config that imports such a package ("No exports
  main defined"), a crash class the knip gate refuses by design (F-147); build the package and
  rerun. The commit hooks run prettier, markdownlint and the changed-files lint only, plus the
  staged profanity check where the estate carries it; knip and the dependency cruiser run
  inside the pre-push gate's `pnpm check`, never by hand beside it, so build the worktree's
  packages before the push (2026-10-14).
- **`collaboration-state <topic> <action> --help` works only as separate words**; a quoted
  "topic action" prints the topic index (2026-10-14).
- **`agent-tools session-metadata` derives the transcript directory from the working directory's
  project path**, so from a linked worktree it fails ENOENT. The context reading is the
  transcript's newest assistant usage (input plus cache read plus cache creation, over the
  window) under the primary's project directory until the command takes a project-directory
  option (a friction in each estate's register, 2026-10-14).
