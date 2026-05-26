# Stage By Explicit Pathspec

We stage files for commit by naming them explicitly. Wildcard staging
(`git add -A`, `git add --all`, `git add .`) is forbidden — every
addition must be an act of intent, not a sweep.

## The Rule

When staging changes, name each path:

```bash
git add path/to/file.ts path/to/other.ts
```

Or, when the staged set is already correct from prior `git add` calls,
use `git commit -- <pathspec>` to commit only the listed paths
regardless of what else sits in the index.

The following commands are blocked at the Bash hook
(`.agent/hooks/policy.json` `preToolUse.blocked_patterns`):

```text
git add -A
git add --all
git add .
```

The deny payload surfaces the current rule citation so the doctrinal
anchor travels with the refusal. This rule is the permanent home for
the older distilled lesson.

## Why

Wildcard staging silently bundles unrelated work into a single commit.
Three concrete consequences:

1. **Peer-agent work bleeds into your commit.** When parallel sessions
   touch shared files (thread records, napkins, plan bodies, comms
   logs, collaboration state), `git add -A` captures their in-flight
   edits alongside yours. Their work then ships under your commit
   message, with no audit trail of what got swept along.
2. **Unrelated changes hide behind related ones.** A continuity-
   deferral commit that incidentally bundled 372 lines of parallel
   Practice-thread plan work plus an unrelated plugin enable is the
   recorded incident (2026-04-30, post-mortem captured in the napkin
   archive).
3. **The act of staging stops being deliberate.** Once wildcard
   staging is normalised, the question *"which of these belongs in
   this commit?"* never gets asked, and the commit boundary becomes
   accidental.

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "Stage everything I changed" | `git add -A` | `git status --short`, then `git add <each path>` |
| "Stage every file in this directory" | `git add packages/foo/.` | `git add packages/foo/file-a.ts packages/foo/file-b.ts` |
| "I already added too much; I want only these paths in this commit" | `git reset` then re-stage | `git commit -F <msg> -- path/to/file` (commit-by-pathspec is the cleanest cure when peer-staged work sits in the index) |

## Pre-Stage Re-Ground for Long Sessions

If a session has been running for roughly an hour, or if the all-channel
watcher was deferred during plan-mode or review work, refresh git state
immediately before staging, `record-staged`, or committing:

```bash
git log -8 --oneline
git status --short
```

Treat session-open git state as stale at commit time. If HEAD moved, staged
state changed, or unexpected peer work appears, pause and re-scope the
commit boundary before adding paths.

## Peer-Index Note

If `git status --short` shows another agent's work staged in your
index (e.g. a `R` rename you did not originate), that staged state
came from the peer's mid-flight commit prep. Do not run `git reset
HEAD <peer-files>` lightly — it briefly disturbs the peer's view of
their own staging area. Prefer `git commit -- <pathspec>`, which
captures only your listed paths and leaves the peer's index
entries intact.

## Source Incident

2026-04-30: a continuity-deferral commit accidentally bundled 372
lines of parallel Practice-thread plan work plus an unrelated plugin
enable. Owner correction first graduated *Stage by explicit pathspec*
into `distilled.md`; this rule is the later permanent home. The hook
block landed 2026-05-04 as WS6 of the doctrine-enforcement-quick-wins plan.

## Cure Asymmetry — One-Sided Application Does Not Prevent Absorption

The rule above protects the agent who applies it. It does **not**
prevent the failure mode in agents who do not apply it. When a peer
runs `git commit` without a `-- <pathspec>` filter on a shared `.git/`
index, the peer's commit absorbs everything currently staged —
including content authored by other agents through their explicit
`git add path/to/file` operations. Three observed instances:

| Date | Source agent (applied pathspec) → absorbing agent (did not) | Result |
| --- | --- | --- |
| 2026-04-30 | Vining Spreading Seed initial incident | Peer-staged renames bled via `git add` |
| 2026-05-04 | Lacustrine → Moonlit | Lacustrine's staged plan content absorbed into Moonlit's commit |
| 2026-05-05 | Dawnlit → Ethereal | Dawnlit's C1 closure substance (12 consumer rewrites + fixture relocation + reviewer evidence) absorbed into Ethereal's `chore(continuity)` commit; substance correct at HEAD; commit-message attribution distorted |

Three instances now make the asymmetry observable as substance: a
cure that protects only the applier is not really a structural cure
— it is a *behavioural commitment one side keeps on the other side's
behalf*. The applying side carries the discipline; the non-applying
side experiences none of the friction; the failure mode persists
exactly until both sides apply the discipline at every commit.

In every observed instance the substance landed correctly (the
absorbed content is in the tree at HEAD); reviewer evidence applied
to the diff pre-absorption remains intact; only commit-message
attribution distorts. The cost is auditability of authorship, not
correctness — but the cost compounds across multi-month git history.

## Structural-Enforcement Candidate (Owner-Direction-Shaped)

The asymmetric-cure observation is graduation-ready substance for
host structural enforcement. Three named candidate shapes, each a
distinct host-architectural decision (ADR-shaped at landing time):

1. **Pre-commit hook refuses implicit pathspec** when the staged set
   contains files outside the agent's queued commit-bundle intent.
2. **Commit-queue layer detects fingerprint divergence** between the
   recorded staged-bundle and the actual staged set at
   `verify-staged`, aborting the commit before history is written.
3. **Shared pre-commit gate** requiring explicit `--include` /
   pathspec matching the active commit-queue intent, refusing
   commits whose staged set exceeds the intent.

Each shape protects different layers of the failure mode (1 is
defensive at the hook tier; 2 is detective at the discipline tier; 3
is preventive at the workflow tier). The choice between them is
owner-direction-shaped — they trade off friction, false-positive
rate, and operational complexity differently. Pending owner
direction.

The asymmetry insight itself is a Practice-governance principle
candidate (any cooperative-discipline cure that requires one side to
keep the discipline on the other side's behalf has the same shape).
Promotion to a Practice-Core PDR awaits a second-context
manifestation of the same asymmetric-cure failure outside `git
commit -- <pathspec>` (e.g. shared lockfile discipline,
shared-state-file write discipline, shared-comms-log authoring
discipline).

## Doctrinal Anchors

- This rule: stage by explicit pathspec
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)
- PDR-044 §Innate immunity (write-time fingerprints)
