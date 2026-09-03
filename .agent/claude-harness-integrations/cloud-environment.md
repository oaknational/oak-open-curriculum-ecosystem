# Claude cloud environment — the "Practice Repos" environment

How claude.ai cloud sessions (web, mobile, routines, `claude --cloud`) are
provisioned for Practice repos, and how to change that safely. The
environment is shared by every Practice repo; a session may carry one or
several repos (owner word 2026-08-24, superseding the 2026-08-23
one-repo ruling), and the environment never knows which in advance —
discovery provisions every Practice repo present. When a document
references a file in another repo, use a GitHub URL, never a local
path (owner word 2026-08-24).

## The two layers

1. **Environment setup script** — universal, repo-agnostic. Lives in the
   claude.ai environment configuration; its source of truth is the
   reference copy at
   [`cloud-environment-setup.sh`](cloud-environment-setup.sh). It discovers
   whichever Practice repo the session carries and installs the toolchain
   that repo declares — Node at the major named by its `engines` field,
   the exact pnpm its `packageManager` pin selects (via Corepack, shimmed
   into a trusted path), git ≥ 2.45, and a checksum-verified gitleaks
   (version and sha value-synced with castr's supply-chain single source,
   `.claude/hooks/_lib/gitleaks-pin.env`) — then runs `pnpm install` and
   delegates to the repo's own hook. The script itself pins no version a
   repo declares.
2. **Per-repo session hook** — the common-ability contract. A Practice repo
   that needs more than `pnpm install` commits an executable
   `.agent/setup/cloud-session-setup.sh`; the environment script invokes it
   from the repo root after install, under the same fail-fast rules. This
   repo's hook installs the pinned Playwright Chromium for the
   `test:ui`/e2e suites. A repo with no extra needs commits no hook.

## Changing the environment

1. Edit [`cloud-environment-setup.sh`](cloud-environment-setup.sh) here,
   review, and land it via a pull request.
2. Paste the whole script into claude.ai → environment selector →
   "Practice Repos" → Setup script, and save.
3. Changes apply to **new sessions only**. The environment cache (a
   filesystem snapshot, roughly 7-day expiry) rebuilds when the script or
   the allowed-domain list changes; the first session after a change runs
   the script live.

Repo-specific needs never go in the environment script — put them in the
repo's hook so other Practice repos' sessions are unaffected.

## Validating and diagnosing

The environment builder is the only true fresh-container test bench:
running the script by hand inside an existing session proves nothing about
a fresh container (different egress, different filesystem state, different
cache). The dialog is also write-only — no API reads it back, so drift
between this reference file and the pasted copy is undetectable from a
session. Four consequences, each with its instrument:

1. **The script narrates itself.** Every section opens with a
   `=== PHASE: … ===` banner and an `ERR` trap prints the failing phase,
   line, and command. A failure card therefore names its own point of
   death; a card without a phase banner means the script died before
   `set -euo pipefail` — i.e. the paste itself is damaged.
2. **The preflight returns the complete falsification list in one paste.**
   [`cloud-environment-preflight.sh`](cloud-environment-preflight.sh) is a
   read-only probe of every external assumption the setup script makes
   (repo discovery, hook contract, git origin remotes, nodejs.org, registry.npmjs.org,
   keyserver.ubuntu.com, ppa.launchpadcontent.net, the base image's own
   apt hosts, the gitleaks release-asset redirect chain). All probes run
   regardless of individual failures and the summary lists every failed
   assumption. Setup-time egress differs from in-session egress (worked
   instance 2026-08-23: Trusted preset fine in-session, 403 at setup), so
   the authoritative run mode is pasting the preflight as a **temporary**
   environment script and reading the session-start card; the in-session
   run (`bash .agent/claude-harness-integrations/cloud-environment-preflight.sh`)
   is the cheap first pass.
3. **The diagnosis loop.** When fresh sessions stop starting:
   1. Read the failure card. A phase banner localises the failure; no
      banner means paste damage — go straight to step 4.
   2. Paste the preflight as the environment script, start a session, and
      read its card: the complete list of falsified assumptions in one
      round-trip.
   3. Fix what the preflight names — usually the network allow-list (a
      redirect target like `release-assets.githubusercontent.com` never
      appears in the script text) or a vendor-side change — landing any
      script edit here first via PR.
   4. Re-paste the current reference `cloud-environment-setup.sh` in full.
      The rollback lever is the same move: any previous known-good version
      is in this file's git history, and pasting it restores that state
      exactly.
4. **The probe invariant.** Every external host the setup script contacts
   has a probe in the preflight; a change adding a host lands the probe in
   the same commit. Redirect chains count — probe the effective URL, not
   just the named host. Hook-contacted hosts count too, via the
   **hook-preflight contract**: a repo whose session hook contacts extra
   hosts commits the read-only twin
   `.agent/setup/cloud-session-preflight.sh` beside the hook, and the
   universal preflight runs it as a probe — the same
   delegation shape as setup itself. Absence is the only benign skip;
   exists-but-not-executable fails the probe.

## Suspected-fragile hosts register

Empty. A setup-time preflight paste on 2026-08-24 ran 12/12 from a true
fresh builder, positively confirming every previously registered host —
`nodejs.org`, `registry.npmjs.org`, `keyserver.ubuntu.com`, and the
gitleaks release-asset redirect target (measured as
`release-assets.githubusercontent.com`, not `objects.githubusercontent.com`
as once assumed; the preflight's failure branch now prints the last
attempted URL so a future redirect-host change names itself on the card).
Re-add an entry only when a setup-time card implicates a host.

## Environment settings that pair with the script

- **Network access**: Custom, with "Also include default list of common
  package managers" ticked, plus:

  ```text
  ppa.launchpadcontent.net
  cdn.playwright.dev
  playwright.download.prss.microsoft.com
  ```

  The Trusted preset is not sufficient: it 403s `ppa.launchpadcontent.net`,
  which breaks any `apt-get update` because the base image itself ships PPA
  sources on that host (worked instance 2026-08-23: castr routine sessions
  failed to start).

- **Environment variables**: the Slack Watcher configuration lives here —
  in the environment, never in a repo — so every Practice repo's sessions
  share it and changing channel or workspace is an environment edit, not a
  commit:

  ```text
  SLACK_WATCHER_CHANNEL_ID=<channel id, e.g. C0XXXXXXXXX>
  SLACK_WATCHER_WORKSPACE=<workspace name>
  ```

  Consumed by the `slack-watcher` and `talk-to-slack-watcher` skills
  (canonical under `.agent/skills/`). These values are visible to anyone
  using the environment; channel ids are not secrets, and no secret may be
  added here.

## Git-hook policy for cloud agent sessions (HUSKY=0)

Owner ruling, 2026-08-31 (trialled the same session, then adopted with a
companion profiling commission): **cloud agent sessions commit and push with
`HUSKY=0`**, relying on GitHub CI as the quality gate. This relocates the
checks, it does not remove them — the adoption was conditional on CI being
comprehensive, and that premise was verified first-hand against `ci.yml`
(secret-scan; format, markdownlint, runtime and shell lint, subagents,
portability, repo-validators, skills, encoding; build with schema-drift
check; type-check, lint, test; knip and dependency-cruiser; browser suites;
a `run-quality-gates` rollup). That comprehensiveness covers **tree-state**
gates only — CI runs no commit-message-class checks, which is why the
in-session validation below is non-optional. Measured effect at adoption:
seconds per commit-push cycle against ~15 minutes with local hooks.

Conditions that keep the policy honest:

- Scope is **agent cloud sessions**; local human development keeps hooks. The
  canonical [`no-verify-requires-fresh-authorisation`](../rules/no-verify-requires-fresh-authorisation.md)
  rule carries this standing ruling as its one scoped narrowing — outside this
  scope its per-invocation requirement is unchanged.
- **The blocking in-session substitute set** — the skipped hooks' checks are
  enumerated here once, each mapped to its substitute; skipping any of the
  in-session four recreates the gap `HUSKY=0` opens:

  1. **Branch guard** (`.husky/pre-commit` sources
     `refuse-commit-on-main.sh`): run the same guard before every commit —
     `bash -c 'GUARD_BRANCH="" GUARD_HINT="…" . .husky/refuse-commit-on-main.sh'`
     — because CI cannot prevent a local-`main` commit after the ref has
     advanced.
  2. **Commitlint** (`.husky/commit-msg`):
     `pnpm agent-tools:check-commit-message -F <draft>`.
  3. **Accidental-major-release guard** (`.husky/commit-msg`):
     `pnpm exec tsx agent-tools/src/version-guard/prevent-accidental-major-version.ts <draft>`.
     Its path-safety contract only accepts files under the real git
     directory: resolve with `git rev-parse --absolute-git-dir` (in a linked
     worktree `.git` is a file) and make the draft **intent-scoped** — a
     shared fixed name races between agents on one worktree (the commit
     skill's proven concurrency class) — e.g.
     `"$(git rev-parse --absolute-git-dir)/COMMIT_MSG_<intent-id>"`.

  4. **Pre-push secret scan** (`.husky/pre-push` runs gitleaks before
     transfer): scan **the outgoing commits only, before every push** —
     CI's secret-scan job starts only after GitHub has received the commits,
     so it can block the PR but cannot stop a credential leaving the
     machine; only the pre-transfer scan can. The instrument mirrors the
     hook's own scope (pushed commits, not history — CI's full
     `--branches --tags` scan is the comprehensive backstop):
     `gitleaks detect --redact=100 --source . --log-opts="origin/<branch>..HEAD"`
     (first push of a branch: range from `origin/engraph`). That range covers
     the one push shape this policy authorises — the checked-out branch to its
     matching `origin` branch. A push naming anything else (a tag, another
     branch, multiple refs) is outside that shape: scan it with the repo's
     ref-aware scanner instead — `pnpm agent-tools:secret-scan --remote origin
     --refs-file <file>`, feeding one pre-push-format line
     (`<local_ref> <local_sha> <remote_ref> <remote_sha>`) per pushed ref, the
     same tested range logic (`compute-push-scan-ranges.ts`) the hook runs.
     Running the full-history `pnpm secrets:scan` per push is the wrong
     instrument — minutes of re-scanning already-pushed history for zero
     marginal coverage (owner ruling 2026-08-31). gitleaks is installed by the
     cloud environment setup.

  Everything else the hooks ran maps to CI: staged prettier/markdownlint →
  the static-checks job; the turbo suites → the build/test/browser jobs.
  History-rewriting guards (`.husky/pre-rebase`'s main-in-range check and
  kin) are not substituted because history rewriting stays governed by the
  estate's never-rewrite doctrine; the rare session that must rebase runs
  the applicable `.husky` guard explicitly first.
- Every push lands on a CI-gated PR; an un-PR'd branch push has no gate
  (CI's push trigger covers only `main`/`engraph`), so cloud work stays on
  PR branches — and the gate condition is an **OPEN** PR: a branch whose PR
  has merged or closed (a stale worktree, a recreated merged branch) gets
  no `pull_request` run on push, so before pushing, confirm the branch's PR
  is open; when it is not, open one first — or run the local gates for that
  push. **First-push caveat**: a fresh lane's first push necessarily
  precedes its PR (the spawn tool pushes, then opens the draft PR), so if
  PR creation fails, open the PR before any further work — or run the
  local gates for that push — rather than leaving an ungated remote branch.
- **Push cadence — a concluded required check is part of the gate** (worked
  instance 2026-08-31): CI's concurrency group cancels the in-flight run on
  every push, so the relocated gates only bind if the required check reaches
  a genuine conclusion. A push cadence at or below CI duration (~15-20 min)
  silently removes the gate for the series while burning paid runners —
  eight consecutive runs were cancelled at workflow level; seven ended with
  no genuine conclusion on the required check, and the one that did finish
  (its `run-quality-gates` succeeded one second before the cancel landed)
  was still labelled cancelled. Neither workflow status (`completed`
  includes cancelled runs) nor the rollup's colour is the boundary: the
  boundary is the required check (`run-quality-gates`) reaching a genuine
  conclusion — success or failure; cancellation is neither. Minimum spacing
  between pushes: that conclusion on the previous head, or an in-session
  full `pnpm check`. Review rounds are NOT safety boundaries; and never
  push to a branch whose merge-deciding CI run is in flight.
- If CI's coverage narrows relative to the local suite, the premise fails
  and the policy is re-decided — the comprehensiveness check above is the
  revalidation instrument.
- `HUSKY=0` is the mechanism; `--no-verify` remains blocked and separately
  governed by `no-verify-requires-fresh-authorisation`.

**Companion commission (same ruling): the check-performance profiling
lane.** The owner also commissioned profiling and improving full-check
performance so local (hooked) cycles get faster too. The lane awaits
pickup; its delivery plan is authored by its implementer at pickup per the
plan estate's own doctrine. First measurements to beat: ~15 minutes for a
cold full suite, minutes warm, dominated by the turbo build/test legs.

## Known provisioning defects and in-session cures (dated)

Recorded first-hand by cloud seats between 2026-08-24 and 2026-09-01. Each
is a defect of the image or the sandbox, never a gate to narrow (owner
re-confirmed 2026-08-26, verbatim: "We NEVER disabled checks, don't ask
again"). **A deterministic local-only failure with a green CI twin is an
environment defect with a findable mechanism — fix it at the environment;
never ask to route around it.**

- **`PNPM_HOME` unset** while pnpm lives at `/opt/node22/bin/pnpm`, so
  `repo-check`'s trusted-location probe fails on the commit chain. Safe
  homes for the cure: image-level (pre-install) configuration, or adding
  `/opt/node22/bin/pnpm` to `resolvePnpm`'s trusted candidates — never a
  late export in the post-install session script, which re-points pnpm's
  store root after `node_modules` exists (the store-rebind class).
- **Image git 2.43** lacks `--no-lazy-fetch` (needs ≥ 2.45), on which
  `agent-tools test:e2e` dies. A shallow clone also lacks the
  `validate-mcp-content` `BASELINE_COMMIT`; `git fetch --depth=2000`
  restores it (a guarded unshallow in the setup script is the candidate
  cure).
- **Playwright chromium revision mismatch**: the image ships build 1194
  at `/opt/pw-browsers`; the repo's pin wants 1234; browser downloads are
  egress-blocked on some sessions. Where egress allows,
  `pnpm exec playwright install chromium-headless-shell` from an app
  directory with `PLAYWRIGHT_BROWSERS_PATH` unset (it lands in `~/.cache`)
  plus a symlink of the 1234 build into `/opt/pw-browsers` satisfies both
  lookup paths.
- **turbo strict `envMode` strips the sandbox's plumbing from gate
  children**: only `globalPassThroughEnv` plus turbo's built-in allowlist
  survive (PATH does; `PLAYWRIGHT_BROWSERS_PATH`, `HTTPS_PROXY`,
  `NODE_EXTRA_CA_CERTS` do not), so `test:ui` children look in the wrong
  browser cache and corepack children die on `SELF_SIGNED_CERT_IN_CHAIN`.
  Session-side cures: `COREPACK_DEFAULT_TO_LATEST=0` (no network; the
  pinned version) and a PATH-front `pnpm` shim restoring the WHOLE proxy
  tuple including `NO_PROXY` — a shim that omits the exclusions converts
  the failure into its inverse (Playwright's webServer readiness probe
  routed to the proxy and never saw localhost). Repo-side candidate:
  declare the plumbing in turbo `globalPassThroughEnv`, a gate-config
  change that needs its own review.
- **Headless Chromium honours the env proxy but not its MITM CA**, so
  CONNECT tunnels to font and CDN hosts die slowly: a browser test that is
  slow or flaky ONLY in a proxied container is a proxy-CA mismatch until
  proven otherwise — probe with a request-lifecycle logger before touching
  the test. Cure: append `fonts.googleapis.com,fonts.gstatic.com,cdn.jsdelivr.net`
  to `NO_PROXY`/`no_proxy`; the one failing test went green and the whole
  showcase suite dropped from 1.7 minutes to 16 seconds. The restricted
  runner doubles as a coverage sensor: the test that cannot run
  hermetically is the test with the environment coupling (a stale-sheet
  race spec navigating without the hermetic external-origin interception,
  cured on-convention).
- **The session scratchpad path exceeds the 108-byte Unix-socket
  `sun_path` limit** (~150 characters), so tsx's IPC pipe under
  `node_modules/.tmp` fails `EINVAL` and `pnpm install`'s postinstall dies.
  Worktrees that need installs live at a short path (`/tmp/<name>`); the
  scratchpad stays right for plain files.
- **`--force-with-lease` is denied by the cloud permission classifier**;
  a branch restart after a merged PR goes `git checkout -B <branch> <base>`
  then a plain push.
- **Harness checkpointing auto-commits held work** with an accurate
  message under the bot identity and without the seat invoking git:
  held-work discipline cannot assume a dirty tree stays dirty in a cloud
  session, and a freeze decision accounts for auto-checkpoint.
- **The merge-bot front door cannot run in a cloud session**: the bot's
  machine-local private key is absent and `.github/merge-bot.json` names
  the upstream repo, so an owner-authorised merge executed through the
  session's GitHub connector runs under the OPERATOR credential — a
  credential-selection gap against `bot-identity-on-third-party-systems`,
  recorded as an environment fact, never a practice to normalise.
- **A cloud seat cannot message a local seat**, so a cloud-to-local
  handoff rides the pull-request record: the full handoff landed as a
  comment on the PR, and the local seat's persistent watch on that record
  (fork tip, branches, open PRs; one line per new event) was the wake path
  that caught it within a minute (2026-09-01). Exclude the acting bot's
  own comments from such a watch's filter, or it echoes the ack back as an
  event.
- **`cloud-environment-setup.sh` has not executed since its 2026-09-01
  shell-hygiene refactor** (READ, shellcheck and the local preflight
  harness only — it needs root, apt and `/usr/local`); its first real run
  is the first fresh provisioning after that change lands, and that run is
  the refactor's falsifier.

Two operating rulings pair with the list. **Cloud sessions set their own
session name from the Practice identity** via the remote session-title
tool (`<agent name> - <intent>`; owner ruling 2026-08-31). **One
environment definition serves both estates**: castr's copy of this document
is the definition of record for the shared script (owner ruling
2026-08-25); at the time of writing this document still carries a parallel
definition rather than a reference to that copy.

## Fail-fast contract

The script exits non-zero on any failure and session creation then fails
with the script output in the session-start card — deliberately. A session
on a half-built environment is worse than no session.

One tracked vendor warning (per no-warning-toleration's third-party
clause): `apt-get update` reports the git-core PPA's InRelease signature
uses a weak algorithm (`rsa1024`). The key is Launchpad's, not this
repo's, so the warning cannot be fixed at source; the signature still
verifies and provisioning proceeds. Triage disposition: if apt escalates
this to a rejected signature, provisioning hard-fails loudly at `apt-get
update` — that failure is the designed signal, and the remedy is moving
git to a source with a modern key.

## Provenance (worked instances, 2026-08-23/24)

- `add-apt-repository` crashes on this image (`apt_pkg` missing) — PPAs are
  added by writing sources and key files directly.
- The image's `/opt/nodeXX/bin` precedes `/usr/local/bin` in `PATH`, so the
  toolchain install repoints those entries; nothing else can change a
  session's `PATH`.
- Hard-coding a repo path broke castr sessions (the environment previously
  assumed this repo); discovery-and-delegation replaced it.
- The 2026-08-23/24 outage (every fresh session failing for ~24h): the
  discovery pipeline's `find /home /workspace` exits non-zero because the
  builder ships no `/workspace` — while still printing every match — and
  `set -euo pipefail` turned that into instant death at the discovery
  line, from the discovery script's very first paste. Two traps hid it:
  hand-validation ran script chunks in an interactive shell (no strict
  mode, so the pipeline "worked" on the bench), and the preflight runs
  without `-e`/`pipefail` by design, so it cannot catch strict-mode
  shell-semantics deaths — that class belongs to the setup script's own
  phase banners and ERR trap, which named the dying line on the first
  instrumented run. When validating a strict-mode script, run the WHOLE
  file under its own strict mode, never chunks in an interactive shell.
