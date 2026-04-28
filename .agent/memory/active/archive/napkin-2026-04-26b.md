# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the register at
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status).

---

## 2026-04-26 — Frolicking Toast — self-applying the commit-window protocol surfaced two pre-commit footguns

**Context:** owner-directed multi-chunk commit landing under umbrella
claim `4535f2ff-0420-4bde-bfb8-af0db656e359`, self-applying the
commit-window protocol that chunk 1 implements. Six chunks, one
per intent. Each chunk: open claim (or re-use umbrella), append
log entry naming pathspecs, stage, validate message, commit, push.

**Surprise A — commitlint subject-case on identifier-leading subjects.**
Drafted a chunk-5a subject `docs(observability): L-IMM lane fully
closed after owner verification`. Commitlint rejected on
`subject-case`: the subject leads with `L-IMM` (uppercase). Reword
to `close L-IMM lane fully after owner Marketplace verification`
(verb-leading) passed. The `scripts/check-commit-message.sh`
validation catches it cheaply BEFORE invoking `git commit`, but
only if the agent runs it pre-flight. The commit skill mandates
the validation; this incident proves the mandate's value.

**Surprise B — markdownlint MD004 on `+` bullets and indented
continuation lines in log entries.** Wrote chunk-1 staging entry
with parenthetical multi-item lists like `(parent plan ... + future
plan ...)`. Markdownlint interprets the `+` as a list-item bullet
in the wrong style (the repo enforces `-` style). Fix: comma-
separated phrasing or full sentences instead of `+`-joined lists.
The pre-commit hook catches it before the commit lands but the
recovery loop costs ~30s per occurrence.

**Lesson:** the commit skill's validate-before-invoking-git-commit
discipline is well-shaped — it caught both footguns inside the
commit window before history was rewritten. The remaining gap is
the message itself: agents drafting subjects don't always remember
the case rule (especially for technical identifiers like
`L-IMM`/`PR-87`/`ADR-163` which look natural at the start of a
sentence). Adding `scripts/check-commit-message.sh -m "<draft>"`
to the commit skill's prep step (already there but easily skipped)
would surface case violations without invoking git at all.

**Promotion trigger:** captured here as evidence; no separate
graduation needed. The commit skill already mandates validation;
this entry strengthens the case for habitual pre-flight use vs.
trust-the-hook reflex.

---

## 2026-04-26 — Frolicking Toast — vendor-doc review caught a fingerprint policy regression before merge

**Surprise:** my Tier 2 fingerprinting implementation drafted
`event.fingerprint = ['<class-name>']` for known error families.
Code-reviewer and test-reviewer both passed the shape with only
NIT/MINOR findings; both implicitly accepted the single-element
form. `sentry-reviewer` flagged it as a MAJOR by reading Sentry's
official fingerprinting docs: a single-element fingerprint is a
**full override** that collapses every event of the class into one
issue, losing stack-aware discrimination within a family. The
canonical Sentry shape is the **hybrid** form
`['{{ default }}', '<class-name>']` which preserves default
stack-aware grouping AND adds the class-name anchor.

**Lesson:** for vendor-API-shaped decisions, the in-house code-
reviewer / test-reviewer cannot detect a vendor-contract violation
from inside the codebase — they read for shape and discipline, not
for vendor-doc conformance. The vendor-specialist reviewer
(`sentry-reviewer` here, but symmetrically `clerk-reviewer` /
`elasticsearch-reviewer` / `mcp-reviewer` for those vendors) is the
only reviewer that grounds against the official docs. **Substantive
vendor-API choices need the matching specialist reviewer
deliberately scheduled, not relied-on as a side-effect of "general
review".**

This is the **second instance** of the vendor-doc-review-for-
unknown-unknowns pattern surfacing on this branch (Sharded
Stroustrup's 2026-04-26 entry was the first, where six Sentry
capabilities were missed by 3499-line plan body but caught by a
single doc-traversal session). The promotion trigger named in
that entry — "second instance OR owner direction" — is now
satisfied. Pattern candidate name remains
`vendor-doc-review-for-unknown-unknowns`.

**Promotion trigger:** SECOND INSTANCE FIRED. Promote at next
`/jc-consolidate-docs` step 7a from pattern candidate → graduated
pattern in `.agent/memory/active/patterns/`, AND consider whether
it warrants a PDR amendment to `invoke-code-reviewers.md` adding a
"vendor-API surfaces require the matching vendor specialist
reviewer" rule.

---

## 2026-04-26 — Frolicking Toast — staged-bundle substitution under concurrent agents

**Surprise:** I ran `git add` to stage seven L-IMM closure files,
then `git commit` to commit them. The commit's pre-commit hooks
took ~10 seconds. During that window, Codex (running in parallel
on the same repo) ran their own `git commit`. Codex's commit
took ALL of my staged files plus their own intent-to-commit plan
under their commit message. My `git commit` then ran and reported
"no changes added" — because the index had been emptied by Codex's
commit. Net: my closure file CONTENTS landed at origin under
Codex's commit MESSAGE.

**Mechanism:** `git add` and `git commit` are not atomic from the
agent's perspective. The git index is a shared mutable surface
between processes; long pre-commit hooks (Prettier, knip,
depcruise, turbo gates) extend the staging-to-commit window from
milliseconds to seconds. Two agents racing through that window
will eventually have one agent's staged set absorbed into the
other's commit.

**Lesson:** for parallel-agent work on a shared branch, the
mitigations that DO work today are: (a) commit messages should
not be relied upon as proof of authorship — the file diff is
authoritative; (b) when contents are correct but message is
wrong, force-pushing to amend is more disruptive than a follow-up
log entry that explains the misattribution; (c) Codex's
intent-to-commit plan
([`agentic-engineering-enhancements/future/intent-to-commit-and-session-counter.plan.md`](../../plans/agentic-engineering-enhancements/future/intent-to-commit-and-session-counter.plan.md))
proposes a coordination protocol for advance commit-window
signalling — its promotion trigger ("third lock-contention OR
wiped-staged-set incident") fired during this session.

**Promotion trigger:** captured by Codex's plan; no separate
graduation needed. The `feedback_no_delete_git_lock` memory
already covered the index-lock side; this entry covers the
staged-bundle side.

---

## 2026-04-26 — Codex — learning before fitness correction

**Correction:** I deferred napkin rotation because `distilled.md` was near its
hard fitness limit. That was backwards. Fitness limits are health signals;
they never outrank preserving understanding. The correct move is to capture,
distil, graduate, and write the signal first, then route any fitness pressure
to structural follow-up.

**Action:** archived the outgoing napkin to
[`archive/napkin-2026-04-26.md`](archive/napkin-2026-04-26.md), distilled the
high-signal entries into `distilled.md`, and amended the consolidation /
Practice surfaces so future agents do not use strict-hard fitness as a reason
to starve the learning loop.

**Lesson:** learning comes first, limits second. If preservation creates hard
or critical fitness pressure, record and address that pressure through
refine / split / graduation / owner-approved limit change. Do not trim,
withhold, or delay learning to keep a validator green.

**Promotion trigger:** owner direction already promoted this from session
lesson into command / Practice / ADR-facing doctrine on 2026-04-26.

---

## 2026-04-26 — Codex — commit window as shared transaction surface

**Observation:** parallel agents can reach `git commit` at the same time.
Git's own index lock prevents repository corruption, but it does not preserve
shared understanding: peers only discover contention after the race has
already begun.

**Learning:** the index and `HEAD` need the same visibility as file areas,
but for a much shorter window. A `git:index/head` active claim before staging
or committing bridges the action-to-impact gap without turning coordination
into a mechanical lock.

**Promotion trigger:** owner explicitly promoted this refinement on
2026-04-26 after identifying concurrent commit attempts as a coordination
surface.

---

## 2026-04-26 — Codex — lock wait is physical, not social

**Observation:** Claude Code can use Monitor to wait for `.git/index.lock` to
disappear. Codex has no first-class Monitor by that name, but can run a
bounded shell wait; Cursor likely has the same practical shell-loop route
unless a custom monitor/MCP tool is configured.

**Learning:** waiting for the lock file is a physical guard against racing the
git index. It does not communicate intent or preserve shared understanding.
The `git:index/head` claim remains the social/coordination layer; lock waits
are only the last mechanical guard before staging or committing.

**Promotion trigger:** owner confirmed this distinction on 2026-04-26 and
asked for appropriate notes during session handoff / consolidation.

---

## 2026-04-26 — Codex — wrong-intent commits are worse than lock failures

**Observation:** a parallel commit can succeed while sweeping another
agent-authored staged set into the wrong commit message. The files are correct
and the branch remains green, but durable history now carries the wrong
description of intent.

**Learning:** lock waits prevent physical index collisions; they do not
protect the authorial bundle of staged files + commit message + agent intent.
The future intent-to-commit plan needs a queue/ownership check immediately
before `git commit`: the staged set must match the posting agent's fresh
intent, or the commit aborts before history is written.

**Promotion trigger:** owner identified this as a new clash class on
2026-04-26 and said better commit queueing is needed.

---

## 2026-04-26 — Codex — commit bundles need integrity, not just locking

**Observation:** additional evidence expanded the commit-window failure class
into three staged-bundle integrity failures: substitution (foreign staged files
replace the intended files under the wrong message), disappearance (the
intended staged set vanishes and a no-op history entry lands), and accretion
(the intended files land with unrelated foreign staged files bundled in).

**Learning:** the durable unit is not the lock, the index, or the commit
message alone. It is the bundle of agent intent + intended pathspecs + staged
diff + commit subject. A future commit queue must serialise that bundle
advisory-first and then verify exact staged-set ownership immediately before
`git commit`.

**Promotion trigger:** the future intent-to-commit plan now records concrete
evidence for all three clash types on 2026-04-26.

---

## 2026-04-26 — Sturdy Otter — phase transition at 3 agents touching threads

**Surprise:** the WS3A async-only signalling that scaled smoothly 1→2 agents
on separated threads broke once a third agent's thread occasionally touched
the others'. In a 90-minute window with three concurrent identities (Sturdy
Otter / Codex / Frolicking Toast) the branch produced three lock-contention
events plus three commit-time clash types (substitution / disappearance /
accretion). Same protocol, same agents, different count of touching threads —
the failure mode is structural, not workmanship.

**Lesson:** signalling tells peers *what you're doing*. It does not produce
*bilateral commitment*. At 3+ agents-touching, signalling alone leaves
agents independently doing the locally-correct thing while producing
globally-incorrect outcomes (clashes, redundant work, ambiguous follow-
through). The next layer up — discuss → decide jointly → assign recorder →
assign actor — is what scales further.

**Promotion trigger:** captured in `joint-agent-decision-protocol.plan.md`
(future, evidence-met) alongside the WS3B sidebar plan whose promotion gate
this same evidence satisfied.

---

## 2026-04-26 — Sturdy Otter — recursive demonstration

**Surprise:** the work was capturing failure modes of parallel agent
coordination while suffering them in real time. Each clash that happened to
my own commits became an evidence item in the plan describing how to
prevent it. The intent-to-commit plan landed under exactly the conditions
it would have prevented — three commit attempts before it stuck cleanly
(`8f44a941` substitution, `b014ca20` disappearance, `9af63a84` success).

**Lesson:** the owner observation "this is a clear phase transition point"
had a quality the same evidence wouldn't have had if collected from logs.
Sitting *inside* the failure mode while documenting it produced a sharper
problem statement than retrospective analysis would have. Worth preserving
this dynamic: when a coordination protocol is being designed under live
pressure from its own absence, the design tends to be more honest about
what the protocol must defend against.

**Promotion trigger:** none new; captured here as session texture for
PDR-011 §Surprise Pipeline.

---

## 2026-04-26 — Codex — same-branch friction is the experiment, not noise

**Correction:** I initially framed separate worktrees / branches as the
safest way to let one agent commit while another remediates PR-87. The owner
clarified that the point of the current work is to identify the frictions
that constrain multiple agents collaborating on the **same branch at the same
time**, then remove those frictions through communication. Avoiding the
shared branch would remove the signal the experiment is meant to study.

**Lesson:** for collaboration-architecture work, safety is not always
isolation. The better guard is observability: explicit commit-window
announcements, visible path ownership, no silent staging, no lock deletion,
and a handshaked decision when two agents need the same surface. Friction is
data when it is captured before it becomes misleading history.

**Promotion trigger:** none new. This sharpens the existing
intent-to-commit and joint-agent-decision protocol evidence rather than
opening a separate lane.
