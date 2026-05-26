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
  `active-claims.json` v1.3.0. Use it to enqueue the intended file bundle
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

5. **Surface any repo-specific extra hooks** flagged by `.husky/commit-msg`. In
   this repo at the time of writing, `scripts/prevent-accidental-major-version.ts`
   runs **before** commitlint and blocks accidental major-version bumps in
   commit headers — factor that into the message draft if the change touches
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
   [`.agent/state/collaboration/active-claims.json`](../../state/collaboration/active-claims.json)
   for fresh `commit_queue` entries and any peer `git:index/head` claim.
   Inspect `git diff --staged --name-only`; if the staged set is
   non-empty and not wholly within your intended scope, pause and
   coordinate or ask the owner before opening the window. Active
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
   When the bundle creates or renames a module, run a formatting proof
   before the final record-staged step (`pnpm agent-tools:repo-check --
   prettier-staged` or a targeted Prettier command). If formatting mutates a
   file, re-read the diff, re-stage the exact pathspecs, and record a fresh
   fingerprint.

   ```bash
   pnpm agent-tools:commit-queue -- enqueue \
     --claim-id "<claim-id>" \
     --agent-name "<name>" --platform "<platform>" --model "<model>" \
     --session-id-prefix "<prefix>" \
     --commit-subject "<draft subject>" \
     --file path/one --file path/two
   pnpm agent-tools:commit-queue -- phase --intent-id "<intent-id>" --phase staging
   pnpm agent-tools:commit-queue -- guard \
     --agent-name "<name>" --platform "<platform>" --model "<model>" \
     --session-id-prefix "<prefix>" \
     --file path/one --file path/two
   git add -- path/one path/two
   pnpm agent-tools:commit-queue -- record-staged --intent-id "<intent-id>"
   ```

   If `.agent/state/collaboration/active-claims.json` is in the staged
   bundle, do not re-stage it after `record-staged`. The command
   writes the fingerprint into the working tree so `verify-staged` can
   compare that fingerprint with the already-staged payload —
   re-staging the registry changes the payload being verified and
   creates a fingerprint-recursion loop.

3. **Land the commit** via the workflow primitive. Write the drafted
   message to a file (typically `.git/COMMIT_EDITMSG`), then invoke a
   single command that composes verify-staged → advisory orchestrator
   → phase `pre_commit` → verify-staged-again → `git commit` →
   `complete` intent:

   ```bash
   pnpm agent-tools:commit-queue -- commit \
     --intent-id "<intent-id>" \
     --message-file .git/COMMIT_EDITMSG
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

   The verify-staged checks protect the authorial bundle — they do
   not replace the repository's whole-tree quality gates.

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
5. Re-check `git diff --staged --name-only` against the intended bundle.
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

### Physical lock wait

It is valid to wait for `.git/index.lock` to disappear as a final physical
guard. Claude Code may use its Monitor tool for this. Codex and Cursor should
use an equivalent bounded shell wait unless a custom monitor tool is
configured:

```bash
deadline=$((SECONDS + 300))
while [ -e .git/index.lock ]; do
  if [ "$SECONDS" -ge "$deadline" ]; then
    echo "Timed out waiting for .git/index.lock"
    exit 124
  fi
  sleep 1
done
```

The wait is not coordination. It complements, but never replaces, the
`commit_queue`, `git:index/head` active claim, and shared-log entry.

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

## Cursor Shell tool — stream truncation workaround

**Scope**: Cursor Shell tool sessions only. Other platforms (Claude Code,
Codex CLI, direct terminal) use the plain HEREDOC above without
modification.

**Observation (active 2026-04-23)**: when `git commit` is invoked from
the Cursor Shell tool with stdout/stderr streaming live, the pre-commit
hook's output is consistently cut off at the `depcruise → turbo`
handover, the tool reports `Exit 1`, and no commit lands. Running the
exact same hook directly via `bash .husky/pre-commit` exits 0 with full
output, and running the same `git commit` invocation with stdout/stderr
redirected to a file completes cleanly with the commit landing.

**Workaround**: redirect stdout/stderr to a temporary file and inspect
the tail after the command completes:

```bash
START=$(date +%s)
git commit -F - >/tmp/commit.log 2>&1 <<'EOF'
type(scope): short subject starting lowercase

Body paragraph.

Co-Authored-By: <name> <email>
EOF
RC=$?
END=$(date +%s)
ELAPSED=$((END-START))
tail -5 /tmp/commit.log
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

- **Never** force-push to `main` / `master`.
- **Never** amend commits already pushed to remote.
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
homes for this workflow. Regenerate adapters with
`pnpm --filter @oaknational/agent-tools skills-adapter-generate` and verify
with `pnpm skills:check` or `pnpm portability:check` after canonical changes.
