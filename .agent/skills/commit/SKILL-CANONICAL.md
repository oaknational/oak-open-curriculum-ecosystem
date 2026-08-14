---
name: commit
classification: passive
description: >-
  Create a well-formed commit for current changes with conventional message
  format. Always active, every commit, every session, no trigger required.
  Enumerates live commitlint constraints inline at draft time, validates the
  drafted message via `pnpm agent-tools:check-commit-message` BEFORE invoking
  git commit, and coordinates the short-lived git index/head commit window.
---

# Commit Current Work

Create a well-formed commit for the current changes. This skill converts
commitlint from a post-hoc rejection surface (the `commit-msg` hook fires
*after* a full message has been drafted) into an **active, pre-draft tripwire**:
the constraints are enumerated inline before drafting, the message is
validated by `pnpm agent-tools:check-commit-message` before `git commit` is invoked,
and the shared git index/head window is claimed briefly before staging or
committing.

**Always-on** — every commit, every session, no trigger required.

**Motivating pattern**:
[`passive-guidance-loses-to-artefact-gravity`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
applied to commit authoring. Prior prose guidance said "lines under 99 chars"
without surfacing the preset's actual rules; every session hit rework
(subject-case violations, header-length overruns, missing footers). This skill
closes that exposure window.

## Tooling

These scripts make this skill actionable end-to-end:

- **`pnpm agent-tools:check-commit-skill-advisories`** — `[ADVISORY ONLY — NOT A
  COMMIT GATE]`. Orchestrates the commit skill's pre-`git commit` advisory
  discipline-check sequence: practice fitness (`practice:fitness:strict-hard`),
  practice vocabulary (`practice:vocabulary`), then the commit-message check
  (`pnpm agent-tools:check-commit-message`). Exits with the first non-zero exit
  code. **Use BEFORE every `git commit`** — but the exit is **advisory, not
  blocking**. The blocking commit-time enforcement is `.husky/pre-commit`,
  a separate enforcement surface (see "Quality Gates Are Always Blocking; the
  Orchestrator Is Advisory" below). Run via
  `pnpm agent-tools:check-commit-skill-advisories` and forward the
  same arguments you would pass to the message check (`-F file`,
  `-F -`, `-m "subject"`, etc.). Doctrinal anchors: PDR-038 §2026-05-04
  amendment (un-enforced doctrine at maturity is liability), PDR-044
  (memetic immune system, innate-immunity layer), PDR-053
  (orchestrator-vs-gate structural cure), ADR-144 (vocabulary consistency),
  ADR-176 (advisory orchestrator naming).
- **`pnpm agent-tools:check-commit-message`** — validates a commit message against
  this repo's commitlint config in isolation from the rest of the pre-commit /
  commit-msg hook chain. Mirrors `git commit` message intake (`-m` repeats,
  `-F`, `-F -`, stdin). Exit 0 conforms, 1 violates, 2 invalid usage. Catches
  `header-max-length`, `body-max-line-length`, and case violations in ~1s
  before the ~34s pre-commit cycle. The orchestrator above invokes this
  script as the third (message) gate; call it directly only when iterating
  on a draft message in isolation from the tree-state gates.
- **`pnpm agent-tools:commit-queue --`** — runs the `agent-tools` TypeScript
  commit-queue CLI for advisory `commit_queue` entries in
  `active-claims.json` (the surface's current schema version — pinned by
  the named constant in `agent-tools`, not by prose here; PDR-050
  §Latest-schema-version-only). Use it to enqueue the intended file bundle
  before staging, record the staged-bundle fingerprint after staging, verify
  the staged set immediately before `git commit`, and clear the queue entry
  after success. It is repo-owned and cross-vendor; no platform-native queue
  feature is required.

Commit-attempt logging is currently paused. Do not call or recreate a root
`scripts/log-commit-attempt.sh` helper; root scripts have been retired. If the
owner re-enables commit-attempt logging, route the implementation through a
workspace-owned tool surface and document the new command here.

## Before You Draft — Load the Live Constraints

Run these steps **before** formulating the commit message.

1. **Locate the commitlint config.** Check these locations in order and read
   whichever is present:

   ```bash
   ls commitlint.config.{mjs,js,cjs,ts} 2>/dev/null || \
     ls .commitlintrc.{json,yaml,yml} 2>/dev/null || \
     grep -n '"commitlint"' package.json 2>/dev/null
   ```

2. **Read the located config file** to discover which preset governs commits
   (typically an `extends:` array) and whether the repo layers on any `rules:`
   overrides.

3. **Read `.husky/commit-msg`** (if present) to see which hooks run at
   commit-msg time — any hook other than `commitlint --edit` is an additional
   gate whose checks must also pass.

4. **Enumerate the active constraints** based on the preset in use. The active
   constraints are whatever the commitlint preset declares; the rules below are
   the defaults for `@commitlint/config-conventional`, the most common preset
   (currently in use in this repo). If the config `extends` a different preset,
   or layers on `rules:` overrides, surface those instead.

   **`@commitlint/config-conventional` defaults**:

   | Rule | Effective constraint |
   | --- | --- |
   | `header-max-length` | Header ≤ **100 chars** (the whole first line: `type(scope): subject`) |
   | `body-max-line-length` | Each body line ≤ **100 chars** (wrap manually) |
   | `type-empty` | Type is **required** |
   | `type-case` | Type must be **lower-case** |
   | `type-enum` | Type ∈ \{`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`\} |
   | `scope-case` | Scope (if present) must be **lower-case** |
   | `subject-empty` | Subject is **required** |
   | `subject-case` | Subject must NOT be `sentence-case`, `start-case`, `pascal-case`, or `upper-case` — effectively start **lower-case** |
   | `subject-full-stop` | Subject must NOT end with `.` |
   | `body-leading-blank` | Body must be preceded by a blank line |
   | `footer-leading-blank` | Footer must be preceded by a blank line |

   **`footer-leading-blank` trap (bisected 2026-06-11):** a BODY line of
   the shape `token #ref` (e.g. `PR #170`) parses as a conventional-commits
   footer missing its leading blank and fires this rule. Write
   `pull request 170` or move the reference to the real footer. Em-dashes
   and bullet shapes are innocent.

   **Second shape, created by WRAPPING (bisected 2026-08-05):** a body line
   that BEGINS `<word>:` — one ordinary word plus a colon — also parses as a
   footer token and fires the same rule. This one is nastier than the
   `token #ref` shape for three reasons: the wrap creates it rather than
   anything you wrote (the same sentence on one line is fine); any plausible
   mid-sentence word triggers it (`fixed:`, `note:`, `result:`, `evidence:`,
   `cure:`), so a 100-char wrap can push one to a line start; and it only
   WARNS, so the commit lands and `check-commit-message` exits 0 on it — you
   discover it in the hook output of a commit that has already succeeded.
   **Cure: after wrapping a body, scan line STARTS for `^\w+:` and reword or
   rewrap.** `no-warning-toleration` has no carve-out for "it only warned", so
   an unpushed commit carrying it is amended (which the safety rules permit)
   — but read the amend precondition below before doing so: a pushed commit is
   never amended to clear a cosmetic warning, and one seat inverted exactly
   that proportion under this pressure.

   **The `commit-msg` hook is the real gate — do not test the checker.** The
   `.husky/commit-msg` hook runs commitlint on every commit unconditionally; the
   pre-draft `check-commit-message` script is an optional convenience to catch a
   format slip ~30s earlier, not a gate. **Never run a per-commit negative
   control** (a deliberately-bad message to "prove the checker is live") — that
   tests the tool, not your message, and has no bridge to landing a conforming
   commit. If you run the checker, trust its exit code; if a given invocation
   looks void (no echo, usage text), do not escalate to a forensic probe — just
   commit and let the hook gate the message. (An argless false-green run was
   observed once on 2026-06-11 and is environment-dependent; a one-off
   self-check is reasonable only if you genuinely suspect the checker is broken
   on this machine — it is never a standing per-commit step.)

5. **Surface any repo-specific extra hooks** flagged by `.husky/commit-msg`. In
   this repo at the time of writing, `pnpm agent-tools:prevent-accidental-major-version`
   (`agent-tools/src/version-guard/prevent-accidental-major-version.ts`) runs
   **before** commitlint and blocks accidental major-version bumps in commit
   headers — factor that into the message draft if the change touches
   version-bearing files.

## Commit Queue And Window Protocol

Staging and committing touch the shared git index and `HEAD`, even when file
edits do not overlap. The protocol below is **awareness, ordering, and
auditability** — not a mechanical lock. Default discipline is still one
commit owner at a time; the queue and claim make that ownership observable
to peers.

### Intent-Scoped End-to-End (2026-05-22 cure)

As of the commit-queue-intent-scope-discipline arc, every dep boundary that
touches scoped git state inside the workflow is compile-time-typed for a
non-empty pathspec, narrowed once at `runCommitWorkflow` entry from
`CommitIntent.files`. The inner `git commit` invocation appends
`-- <intent.files>` to its spawn argv; the two `verify-staged` reads pass
the same pathspec into `git diff --cached`. The structural consequence:

- **Disjoint multi-writer commits land via the queue ceremony.** When two
  agents' `intent.files` lists are disjoint, the queue's inner commit and
  staged-bundle reads only see their own intent's files; peer-staged
  content outside the intent's scope is invisible by construction. Path-B
  explicit-pathspec bypass is no longer the default workaround for the
  ff2-style multi-writer case.
- **`verifyStagedBundle` "extra files" semantics narrow.** The error
  signals files staged inside `intent.files` that the recorded bundle did
  not contain — a genuine intent integrity violation. Under the scoped
  read, the error cannot fire because of peer-staged drift outside the
  intent's scope; that case is no longer surfaced.
- **Empty `intent.files` short-circuits.** `runCommitWorkflow` refuses
  empty intents before any dep call, returning `{ok: false, stage:
  'git-commit'}` with a reason naming the empty list. The dep boundary is
  structurally incapable of being reached with an empty pathspec.

Path-B remains a documented fallback for emergency cases (queue
corruption, manual recovery) but is no longer the cure for the
multi-writer concurrency failure mode the queue ceremony exists to
support.

### Five invariants the protocol protects

| # | Invariant | Protected by |
|---|---|---|
| 1 | Authorial-bundle integrity | `enqueue` declares the intent; `record-staged` fingerprints the staged payload; `commit` re-verifies files / fingerprint / subject before AND after the advisory orchestrator runs |
| 2 | git:index/head coordination | The `git:index/head` active claim — read by peers, opened by you, closed by you |
| 3 | Commitlint conformance pre-`git commit` | Advisory orchestrator pre-screen (`check-commit-skill-advisories`) + the blocking `.husky/commit-msg` hook |
| 4 | Audit traceability | `claim_id` ↔ `intent_id` ↔ commit SHA ↔ `closure.summary` |
| 5 | Rollback discipline on abandon | Failed-attempt intents transition to `abandoned` with stage-named notes; claim closes with failure reason |

### Four operational moves

A clean commit is **four moves**, each backed by one CLI command. The
five invariants above are preserved by composition; the individual
primitives that compose into moves 2 and 3 (`enqueue`, `phase`, `guard`,
`record-staged`, `verify-staged`, `complete`) remain available as
direct CLI commands for inspection and recovery.

1. **Open the git:index/head active claim** via
   [`collaboration-state claims open`](../../../agent-tools/src/collaboration-state):

   ```bash
   pnpm agent-tools:collaboration-state -- claims open \
     --active .agent/state/collaboration/active-claims.json \
     --thread "<thread-slug>" \
     --area-kind git --area-pattern index/head \
     --intent "Stage and commit <summary>." \
     --ttl-seconds 900 \
     --platform <platform> --model <model> --now "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
   ```

   Before opening: read
   `.agent/state/collaboration/active-claims.json`
   for fresh `commit_queue` entries and any peer `git:index/head` claim.
   Inspect `git diff --staged --no-renames --name-only` and treat every
   reported path as a changed endpoint; if that endpoint set is non-empty
   and not wholly within your intended scope, pause and coordinate or ask
   the owner before opening the window. Active
   claims on `.agent/` paths are visibility signals, not commit
   blockers — `.agent` is shared Practice and coordination state, and
   it may be swept into commits when the bundle needs current
   handoff, plan, claim, queue, thread, or generated communication
   state to become durable.

2. **Stage the bundle.** Enqueue the intended file list, run the
   pre-stage guard, `git add` the exact pathspecs, and record the
   staged-bundle fingerprint. The file list is a contract, not a hint:
   if a hook failure, formatter, generated artefact, or claim /
   lifecycle write introduces an extra path, abandon the old intent
   and enqueue a widened one before staging or verifying the new set.
   A move or rename has two changed tree endpoints: include both the
   deleted source and the added destination in the enqueue, guard, and
   `git add` pathspecs. Git's inferred rename display is a compact diff
   presentation, not a commit pathspec and not the queue's file identity.
   When reconciling an already-staged or recovery bundle, derive the endpoint
   set with `git diff --cached --no-renames --name-only`; never populate
   `--file` from default rename-folded output. Normal work still enqueues
   before staging.
   When the bundle creates or renames a module, run a formatting proof
   before the final record-staged step (`pnpm agent-tools:repo-check --
   prettier-staged` or a targeted Prettier command). If formatting mutates a
   file, re-read the diff, re-stage the exact pathspecs, and record a fresh
   fingerprint.

   ```bash
   # Open the commit-window claim FIRST with the pattern spelled bare:
   #   claims open --area-kind git --area-pattern "index/head" ...
   # The composed label "git:index/head" is kind + pattern; guard's
   # matcher wants the bare pattern and rejects the composed spelling
   # (frictions F-116).
   #
   # Resolve the session's UUID v5 id once (PDR-076a). Suppress stderr
   # rather than tail-skipping lines: the pnpm banner goes to stderr on
   # some harnesses, so `tail -n +2` can eat the JSON's first line.
   AGENT_ID=$(pnpm -s agent-tools:collaboration-state -- identity preflight \
     --platform "<platform>" --model "<model>" \
     2>/dev/null | jq -r '.agent_id.id')

   # Note: enqueue prints a bare intent UUID (not JSON) — capture it
   # directly, do not pipe it to jq.
   pnpm agent-tools:commit-queue -- enqueue \
     --claim-id "<claim-id>" \
     --agent-name "<name>" --platform "<platform>" --model "<model>" \
     --session-id-prefix "<prefix>" --id "$AGENT_ID" \
     --commit-subject "<draft subject>" \
     --file path/one --file path/two
   pnpm agent-tools:commit-queue -- phase --intent-id "<intent-id>" --phase staging
   pnpm agent-tools:commit-queue -- guard \
     --agent-name "<name>" --platform "<platform>" --model "<model>" \
     --session-id-prefix "<prefix>" --id "$AGENT_ID" \
     --file path/one --file path/two
   git add -- path/one path/two
   pnpm agent-tools:commit-queue -- record-staged --intent-id "<intent-id>"
   ```

   `--id` is required on `enqueue` and `guard` as of PDR-076a; the value
   is the deterministic UUID v5 derived from the session seed. Resolve it
   once via `identity preflight` and reuse it across the queue ceremony.

   If `.agent/state/collaboration/active-claims.json` is in the staged
   bundle, do not re-stage it after `record-staged`. The command
   writes the fingerprint into the working tree so `verify-staged` can
   compare that fingerprint with the already-staged payload —
   re-staging the registry changes the payload being verified and
   creates a fingerprint-recursion loop.

3. **Land the commit** via the workflow primitive. Write the drafted
   message to an **intent-scoped scratch file** — never the shared
   `.git/COMMIT_EDITMSG`, which is single-writer state: under
   concurrent commits a peer's message overwrites yours and a
   wrong-attribution commit lands (the proven multi-agent failure the
   intent-scoped path cures). Then invoke a single command that
   composes verify-staged → advisory orchestrator → phase
   `pre_commit` → verify-staged-again → `git commit` → `complete`
   intent:

   ```bash
   MSGFILE="$(mktemp -t "commit-msg-<intent-id>")"
   # write the drafted message to "$MSGFILE", then:
   pnpm agent-tools:commit-queue -- commit \
     --intent-id "<intent-id>" \
     --message-file "$MSGFILE"
   ```

   The two verify-staged checks book-end the advisory orchestrator so
   tree-widening during the advisory pass is caught before history is
   written. Any failure between intent-load and successful `git
   commit` transitions the intent to `abandoned` with stage-named
   notes; on success the workflow prints the new SHA.

   **Advisory polarity preserved**: the orchestrator's stdout/stderr
   stream through to the caller, but its non-zero exit code does NOT
   abort the commit attempt or alter the workflow path. Blocking
   authority remains `.husky/pre-commit` + `.husky/commit-msg`. See
   PDR-053 and ADR-176; the §"Quality Gates Are Always Blocking; the
   Orchestrator Is Advisory" section below states the doctrine in
   full.

   Since the F-138 two-root split, the workflow's git operations AND
   the advisory orchestrator run against the INVOKING worktree (the
   registry stays at the coordination home). From a linked worktree
   that has not run `pnpm install`, the advisory pass therefore fails
   non-blockingly (no runnable scripts) rather than producing a real
   advisory verdict — install dependencies in the worktree when the
   advisory signal is wanted.

   The verify-staged checks protect the authorial bundle — they do
   not replace the repository's whole-tree quality gates. Full-tree
   gating is intentional and correct (owner-settled 2026-05-22): the
   worst bugs are emergent outside the changed files, so never propose
   staged-only gating or `lint-staged`-style scope-narrowing as a cure
   for multi-writer coordination pain — that pain is cured at the
   queue/ordering/comms layer (sequential commit windows, the commit
   queue), never by narrowing what the gate sees.

4. **Close the commit-window claim** after every exit once opened:
   success, staging failure, message-validation failure, hook
   failure, or deliberate abort. The closure summary records the SHA,
   failure reason, or abort reason and names the next action.

   ```bash
   pnpm agent-tools:collaboration-state -- claims close \
     --active .agent/state/collaboration/active-claims.json \
     --closed .agent/state/collaboration/closed-claims.archive.json \
     --claim-id "<claim-id>" \
     --summary "commit <SHA>: <subject>" \
     --platform <platform> --model <model> \
     --now "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
   ```

### Collaboration-state commit residue exception

The normal order above writes a clean audit trail for ordinary source commits,
but it is a poor fit when the intended bundle itself includes
`.agent/state/collaboration/active-claims.json`,
`.agent/state/collaboration/closed-claims.archive.json`, or the rendered
shared comms log. In that case, completing the queue and closing the
`git:index/head` claim after `git commit` necessarily creates a follow-up
working-tree diff: the commit made the old lifecycle state durable, then the
post-commit cleanup changed the lifecycle state again.

For commits whose purpose is to persist collaboration state, prefer a
**self-contained lifecycle commit**:

1. Open the short-lived `git:index/head` claim and enqueue the bundle as usual.
2. Run the message, staging, and validation checks while the claim is live.
3. Once the bundle is ready and no further staging-owner decision remains,
   close the commit-window claim and mark the queue entry complete or
   abandoned with a summary such as `closed in same collaboration-state commit`.
4. Re-stage only the intended pathspecs, including the updated
   `active-claims.json`, `closed-claims.archive.json`, comms event(s), and
   `shared-comms-log.md`.
5. Re-check the changed-endpoint set from
   `git diff --staged --no-renames --name-only` against the intended bundle.
6. Commit immediately with explicit pathspec discipline.

This exception is only for commits that intentionally persist collaboration
state. It trades the last few seconds of a live `git:index/head` claim for a
single durable commit that includes its own lifecycle closure. Do not use it
to dodge coordination on ordinary source commits, and do not use it while a
fresh peer commit-window claim or staged foreign bundle exists.

If a whole-repo hook fails on a minor issue such as formatting, markdown style,
lint autofix, or generated shared-state read-model drift, fix the issue
immediately and retry the commit protocol. This includes minor breakage in
peer-owned files: log the repair, but do not leave the repo uncommittable. If
the hook failure is larger than a mechanical repair, abandon the queue entry,
close the commit-window claim, and make the failing gate the highest-priority
next item with a named plan or owner-visible escalation. Do not narrow hook
scope, use `--no-verify` without fresh owner authorisation, or introduce
compatibility layers to make the gate pass.

If the queue attempt is abandoned, move the entry to `abandoned` rather than
leaving a fresh active phase:

```bash
pnpm agent-tools:commit-queue -- phase \
  --intent-id "<intent-id>" \
  --phase abandoned \
  --notes "<why the commit attempt stopped>"
```

This protocol is awareness, ordering, and auditability, not a mechanical lock.
If git reports an index lock, treat it as a commit-window collision: inspect
the queue, active claims, and the log. Do not delete `.git/index.lock` unless
the owner authorises it after you have proved no git process is active.

### Merge commits — the queue workflow does not apply

Merge commits CANNOT ride the `commit-queue -- commit` workflow: a
pathspec-scoped `git commit` is illegal mid-merge, and the queue's inner
commit is pathspec-scoped by design. This is a structural mismatch, not a
defect — do not treat the workflow's refusal as an F-112-class failure or
reach for `--no-verify`. The merge-commit path (worked and verified at the
PR-295 semantic main-merge, 2026-07-06; PDR-049 prescribes exactly this merge
topology for memory-file reconciliation):

1. **Preconditions**: sole-agent commit window (no fresh peer
   `git:index/head` claim or queue entry), and a `git:index/head` claim
   opened for the merge window as in move 1. The whole-index commit absorbs
   everything staged, so this is the one sanctioned exception to
   [`stage-by-explicit-pathspec`](../../rules/stage-by-explicit-pathspec.md)
   — its safety rests entirely on the sole-agent window plus the first-hand
   staged-set verification below. **Claim scope is per working tree**: the
   bare `git:index/head` label names the primary/shared checkout's index;
   an agent committing from its own worktree (PDR-117) claims
   `git:index/head@<worktree-name>` instead, and this merge path's
   sole-agent precondition reads only SAME-TREE claims plus the queue —
   a peer's worktree gate run neither blocks nor is blocked by a
   primary-tree merge window.
2. **Verify the staged set first-hand**: mid-merge, the index IS the merge
   resolution — read `git status` and `git diff --cached --stat` and confirm
   every path belongs to the merge (conflict resolutions plus the merge's own
   union writes). There is no queue fingerprint; the first-hand read is the
   verification.
3. **Commit the whole index plainly**: `git commit` (message via `-F`, no
   pathspec, no `--no-verify`) so the full pre-commit gate runs and the hook
   is the green verdict.
4. **Close the claim** with the merge SHA as usual (move 4).

For the semantic-merge topology itself (which branches merge where, and how
memory files reconcile as unions), PDR-049 and the `oak-semantic-merge` skill
govern; this subsection owns only the commit mechanics.

### Foreign index lock — no autonomous contact, including waits

Any autonomous interaction with `.git/index.lock` is forbidden — deletion
AND polling/wait loops alike (owner direction 2026-05-03, aligned here at
the 2026-06-11 owner walk). A wait loop only *observes* today, but it
conditions the agent to treat lock-clearing as an action it takes, and any
future evolution of the loop (timeout-then-remove) is a small step from the
catastrophic shape. A foreign lock means another agent is mid-commit:

1. Stop the commit attempt cleanly (a failed `git add`/`git commit` on a
   foreign lock fails safe — nothing is corrupted).
2. Diagnose without touching the lock: inspect the `commit_queue`, active
   claims, and `git log` for the live committer.
3. Surface the foreign lock to the owner with the diagnostics and the
   wait-vs-handoff options. The owner decides; the agent never loops on the
   lock file.

The `commit_queue`, `git:index/head` active claim, and shared-log entry are
the coordination surfaces; the lock file is never one of them.

## Process

Before opening the four-move protocol above:

1. `git status` — see all changes; `git diff --staged && git diff` —
   understand what will be committed.
2. Confirm quality gates have passed (or run them now). Do NOT
   pre-prime the turbo cache by running `bash .husky/pre-commit`
   separately — the real commit will warm it; the pre-prime is
   wasted ~30s and confuses symptom for cause.
3. Stage selectively — never blindly `git add .`. Skip `.env`,
   credentials, `bulk-downloads/`. The `commit-queue` enqueue +
   guard chain in move 2 enforces explicit pathspecs by design.
4. Draft the message against the enumerated constraints above. The
   `commit-queue commit` workflow in move 3 invokes the advisory
   orchestrator (which runs the message check) as part of its
   composition; no separate manual format-check pass is required.
5. On harness platforms, run long `git commit` invocations via the
   platform's background-task mechanism (`run_in_background`), never a
   shell-level detach — `& disown` inside a foreground call severs the
   hook chain from all tracking so no completion notification ever
   arrives (F-131 class, re-observed 2026-07-07). Backgrounding
   properly is the rule; an until-loop wake on HEAD movement is only
   the recovery shape after a detach has already happened.
6. **One gated commit per invocation — read the gate result before the
   next commit's `add`.** Never chain two gated commits in one shell
   invocation: if the first fails its gate, its bundle stays staged and
   the chained second commit SWEEPS it (worked instance 2026-07-22: a
   commitlint subject-case failure left cycle 1 staged; the chained
   cycle-2 commit swept both bundles into one). Layered gates also mask
   serially (prettier, then whole-tree lint, then commit-msg each
   surface only after the previous is cured) — the pre-draft message
   check in step 4 collapses the commit-msg layer out of that ladder
   for ~1s of cost.

## Advisory Orchestrator In Isolation

The `commit-queue commit` workflow invokes the advisory orchestrator
internally during move 3. Run the orchestrator directly only when
iterating on a draft message *before* the bundle is staged — for
example, to confirm a header obeys `header-max-length` without
attempting a real commit:

```bash
pnpm agent-tools:check-commit-skill-advisories -F - <<'EOF'
type(scope): short subject starting lowercase

Body paragraph explaining motivation and context. Wrap at ~100 chars
to satisfy body-max-line-length.

Co-Authored-By: <name> <email>
EOF
```

If the orchestrator reports a violation, classify the signal before
deciding what to do. Commit-message violations must be fixed before
`git commit`. Fitness and vocabulary findings require substance-led
disposition: fix violations introduced by the current change, and
record or route pre-existing shared-state signals through the
appropriate consolidation or owner-visible path. Do not treat the
advisory orchestrator as a hook verdict — the live `.husky/pre-commit`
and `.husky/commit-msg` hooks remain the blocking gate tier.

The fitness and vocabulary gates inspect the working tree, not the
staged set; pre-existing fitness or vocabulary violations are
catalogued at the appropriate consolidation pass per the
`doctrine-enforcement-quick-wins` plan (WS5) and not blocked
retroactively. New violations introduced by the current change are
blocked at this gate.

## Commit Message Template

```text
type(scope): short subject starting lowercase

Optional body paragraphs explaining WHY this change exists,
not what it does. Wrap at ≤100 chars (body-max-line-length).
Use imperative voice.

Co-Authored-By: <name> <email>
```

Use a HEREDOC to preserve multi-line formatting:

```bash
git commit -F - <<'EOF'
type(scope): short subject starting lowercase

Body paragraph explaining motivation and context.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
```

(`git commit -F -` reads the message from stdin; equivalent to the older
`git commit -m "$(cat <<EOF)"` HEREDOC pattern, with one fewer subshell
layer.)

## Stream truncation at the depcruise → turbo handover — workaround

**Scope**: Cursor Shell tool sessions only, since 2026-07-03. The
`commit-queue -- commit` workflow's spawned git-commit case in Claude Code
(observed 2026-06-17) was FIXED at `b2ae96898` per F-112: the mechanism was
a Node child-stdio socketpair on the spawned git's stderr poisoning the hook
chain (hook shell SIGPIPE at the handover; `set -e` silent exit 1); the
workflow's child runner (now `runFileBackedChild`) gives children
file-backed stdio and replays the conserved output on completion,
reporting exit code and signal distinctly. The workflow is the proper path and works from Claude Code.
A plain `git commit` typed at a direct terminal is unaffected. The same
class hit `merge-bot push` on 2026-08-07 (its git child was still on pipe
stdio) and was cured the same way: the runner now lives at its shared home
`agent-tools/src/core/file-backed-child.ts` and the push executor runs
through it — the F-112 register entry carries the push-path instance.

**Observation (active 2026-04-23, Cursor)**: when `git commit` is invoked from
the Cursor Shell tool with stdout/stderr streaming live, the pre-commit
hook's output is consistently cut off at the `depcruise → turbo`
handover, the tool reports `Exit 1`, and no commit lands. Running the
exact same hook directly via `bash .husky/pre-commit` exits 0 with full
output, and running the same `git commit` invocation with stdout/stderr
redirected to a file completes cleanly with the commit landing.

**Observation (2026-06-17, reproduced and FIXED 2026-07-03, Claude Code
commit-queue)**: the same truncation hit the
`pnpm agent-tools:commit-queue -- commit` workflow — its internally-spawned
`git commit` died at the `depcruise → turbo` handover with
`git commit exited with code 1`, output truncated mid-hook, no commit landing,
including with the parent's output redirected to a file. Instrumented runs
(F-112 plan, 2026-07-03) pinned the mechanism named in the Scope note above;
the fix landed at `b2ae96898` and the workflow now lands commits from Claude
Code with hook output conserved. If this section's symptom ever recurs on the
workflow path, that is a regression of F-112 — stop and surface it; the
no-fallback posture below still applies.

**No fallback (owner directive 2026-07-03; `principles.md` §Strict and
Complete — "No shims, no hacks, no workarounds — do it properly or do not")**:
when `commit-queue -- commit` fails here, that is an ERROR to stop on and
surface to the owner — do NOT land the commit by an equivalent-effect route
(direct `git commit`, manual index surgery). Transition the intent to
`abandoned` with stage-named notes, close the commit-window claim with the
failure reason, and surface the defect. The defect is tracked as
[F-112](../../memory/operational/frictions-register.md) — the cure is fixing
the workflow's spawned-process stdio handling, not routing around it. (A prior
revision of this section documented a direct-commit fallback; that guidance is
withdrawn — it was the equivalent-effect workaround the no-fallback principle
forbids.)

**Workaround**: redirect stdout/stderr to a temporary file and inspect
the tail after the command completes:

```bash
START=$(date +%s)
git commit -F - >tmp/commit.log 2>&1 <<'EOF'
type(scope): short subject starting lowercase

Body paragraph.

Co-Authored-By: <name> <email>
EOF
RC=$?
END=$(date +%s)
ELAPSED=$((END-START))
tail -5 tmp/commit.log
SHA=$(git log -1 --format=%h)
```

**Falsifiability**: keep the file-output workaround only while the
streamed `git commit` path is genuinely unreliable in Cursor Shell
tool sessions. If streamed commits start landing cleanly again, retire
the file-output variant and return to the plain HEREDOC.

**Anti-workaround**: do NOT pre-prime the turbo cache by running
`bash .husky/pre-commit` separately before `git commit`. It does not
prevent the truncation (the truncation is a stream-handover artefact,
not a hook-timing one), and it wastes ~30s per commit.

## Commit-Attempt Logging

Commit-attempt logging is currently paused. The helper script is still
present in `scripts/` for quick reactivation, but the standard commit
workflow should not append to
[`commit-attempts.log`](../../memory/operational/diagnostics/commit-attempts.log)
unless the owner explicitly asks for that diagnostic trace again.

## Safety Rules

**Do NOT modify git history or discard changes** without explicit owner
consent. Prohibited operations without prior discussion:

- `git stash` — can lose uncommitted work
- `git reset` — can discard commits or changes
- `git checkout -- <file>` — discards uncommitted changes
- `git clean` — deletes untracked files
- `git rebase` — rewrites history
- `--no-verify` — bypasses git hooks; **requires fresh per-commit owner
  authorisation** (no carry-forward, per the repo-wide invariant)
- `--force` / `-f` on push — overwrites remote history

If any of these would be helpful, **MUST discuss with the user first**.

Additional prohibitions:

- **Never** commit on `main` locally — `main` advances only via pull requests
  ([`never-commit-to-main`](../../rules/never-commit-to-main.md); the shared
  `.husky` branch guard refuses it mechanically — the rule enumerates the
  hooks).
  Branch first; if commits are already stranded on local `main`, fetch,
  preserve them on a branch, and re-home `main` to `origin/main`.
- **Never** force-push to `main` / `master`.
- **Never** amend commits already pushed to remote. The precondition needs one
  extra clause, because the plain form does not hold under backgrounding: the
  question is not "has this been pushed?" but **"has this been pushed — as of
  now, with nothing in flight that could change the answer?"** Read the remote
  ref at the instant of the amend, not before the reasoning that leads to it,
  AND confirm no push, background task, or other seat's operation is running
  against that ref. Worked instance 2026-08-05: a seat read the remote ref, got
  a correct "not pushed" answer, and amended — while its own backgrounded
  commit-and-push task was still in flight and landed in between. The push was
  then correctly refused as non-fast-forward, so nothing was lost, and the
  reconciliation was cheap only because the amend had changed the message alone;
  an amend that also touched content would have left divergent content with no
  clean pointer move available. The general shape is the pattern
  `observation-that-does-not-bear-on-the-claim` § the race; the operative
  discipline is that an in-flight task's partial log is never a completed result.
- If a pre-commit or commit-msg hook fails, **fix the underlying issue** — no
  shortcuts, no hook bypassing.

## Why This Skill is Active, Not Passive

Commitlint's `commit-msg` hook is a tripwire, but a **post-hoc** one — it fires
*after* the full message has been drafted. Every failure becomes rework. This
skill installs a **pre-draft** tripwire: constraints are enumerated inline
*before* the agent drafts, and `pnpm agent-tools:check-commit-message` runs the same
commitlint config *before* `git commit` is invoked. The live hook is still the
ground truth — this skill does not replace it — but the rework loop is closed
at draft time rather than commit-invocation time.

## Quality Gates Are Always Blocking; the Orchestrator Is Advisory

Two distinct enforcer roles operate around `git commit`. They share rule
configurations and are easily conflated under failure pressure. They are not
the same authority and must not be treated as such. Owner-stated 2026-05-05:
*"all quality gates are blocking always, the orchestrator is not a quality
gate, it surfaces very important but advisory signals, there is no conflict
here"*.

**Quality gates — blocking, always.** The `.husky/pre-commit` hook chain
(format / markdownlint / knip / depcruise / type-check / lint / test) and the
`.husky/commit-msg` hook (`prevent-accidental-major-version` + commitlint)
are the **blocking enforcer tier**. They run automatically when `git commit`
is invoked, they refuse the commit on failure, and their authority is
absolute. Bypassing them requires explicit per-commit owner authorisation
(`--no-verify`), which is owner-initiated only — never agent-proposed.

**The commit-skill orchestrator — advisory, always.** The
`pnpm agent-tools:check-commit-skill-advisories` command (and its sub-checks
`practice:fitness:strict-hard`, `practice:vocabulary`,
`pnpm agent-tools:check-commit-message`) is the **advisory pre-screen tier**.
Agents invoke it voluntarily before `git commit` to surface important
signals (whole-tree fitness shape, vocabulary drift, message-format issues)
early enough to act on. A non-zero orchestrator exit is **not** a commit
verdict; it is a discipline-checker output to read, record, and act on per
the substance-led path (e.g. PDR-046 §Move 3 graduation upward when the
signal flags a layer at rest, or fitness diagnostics on layers being
processed during a multi-layer pass).

If the failing advisory sub-check is only cataloguing pre-existing signal, the
bundle introduces zero new violations, and the bundle actively drains the
signal, the commit may proceed after the catalogue is recorded in the commit
body. That is not a gate bypass: dismissal or new violations remain blocking
under the quality-gates doctrine above.

**The conflation failure mode.** Five observed instances across four
distinct agents on 2026-05-05 (Ethereal Transiting Comet, Dawnlit Transiting
Galaxy, Opalescent Threading Nebula, Twilit Beaming Aurora, Fronded Climbing
Pollen): agents under failure pressure round the advisory orchestrator's
identity into the blocking hook chain's identity (the `gates` token in the
former filename `check-commit-skill-gates.ts` pulled the rounded-off whole
back into place under context pressure) and reach for `--no-verify` as the
escape valve, despite the actual blocking surface (the hook chain) running
a different rule set than the failing pre-screen. Two of the five instances
reached `--no-verify` proposal before owner correction; the third
(Opalescent Threading Nebula's rotation commit) constructed a false
doctrinal collision between SKILL §Pre-Commit Validation and PDR-046 §Move
2 to justify proceeding past the orchestrator's HARD signal — same
underlying rounding-off, different framing. In every instance plain `git
commit` succeeded because `.husky/pre-commit` does not run
`practice:fitness:strict-hard`. The 2026-05-10 structural cure
(advisory command naming, advisory banner at every invocation, this
skill-doctrine update) closes the rounding-off gap by
encoding the advisory polarity at three surfaces. See PDR-053 + ADR-176.

**Diagnostic discipline.** When *any* enforcer fires, before proposing any
response, name *which* enforcer is firing on *which* surface and *with
what authority*. The questions to ask:

- Is this an advisory pre-screen output (orchestrator script invoked by
  me before `git commit`) or a blocking-gate refusal (hook chain refusing
  the commit)?
- If advisory: what substance-led action does this signal point to?
  Graduation upward? Substance preservation per PDR-046? Capture for next
  pass?
- If blocking: what is the underlying tree-state issue, and how is it
  fixed at root?

The orchestrator's signals are *important*. They surface the consolidation
work that needs doing. They are not gates. The deeper disposition driving
the conflation is captured at
[`.agent/memory/active/patterns/eager-rounding-off-on-partial-structures.md`](../../memory/active/patterns/eager-rounding-off-on-partial-structures.md).

## Related Surfaces

- Pattern: [`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  — the failure mode this skill counters.
- PDR: [`.agent/practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md`](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — design principles (firing cadence first; two complementary layers target:
  enumerate inline at draft time + format-check at invocation time).
- PDR: [`.agent/practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md`](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
  — `capture → distil → graduate → enforce`. The diagnostic log is a
  **diagnostic substrate** the pipeline reasons over; pending PDR-011
  amendment to name diagnostic substrates as a distinct surface class
  (see `repo-continuity.md § Pending-graduations register additions
  (2026-04-23 handoff)`).
- Diagnostics: [`.agent/memory/operational/diagnostics/README.md`](../../memory/operational/diagnostics/README.md)
  — convention for diagnostic logs when the owner explicitly enables them.
- Principles: [`.agent/directives/principles.md`](../../directives/principles.md)
  — the `--no-verify` fresh-authorisation invariant.

## Platform Adapters

This skill is **passive / always-active** — discovery, not invocation.
Adapters are generated skill-form thin pointers. ADR-125 is authoritative for
the current adapter topology; do not hand-maintain a platform inventory here.
For this owned skill the generated adapters currently live at:

- `.agents/skills/oak-commit/SKILL.md` — cross-tool alias used by Codex,
  Cursor, Gemini, and other `.agents/` consumers.
- `.claude/skills/oak-commit/SKILL.md` — Claude Code adapter.

The retired custom-command and per-platform skill directories are not valid
homes for this workflow. Regenerate adapters with `pnpm skills:generate`
(the root script — it builds first and pins the estate's required
`--prefix=oak-`) and verify with `pnpm skills:check` or
`pnpm portability:check` after canonical changes. The workspace-filtered
form now also works (its script anchors at the repo root and pins the
prefix; the 2026-07-02 wrong-cwd failure is cured at the script).
