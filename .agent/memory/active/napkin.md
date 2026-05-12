---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-12b.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-12.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-12b.md
[previous-pass]: archive/napkin-2026-05-12.md

## 2026-05-12 — Shaded Masking Shadow / codex / GPT-5 / `019e1c`

### Agentic-tooling closeout for P5 handoff

- Landed post-P4 knip unblock `730766ad` after graph-lane `pnpm knip`
  failures exposed unused public exports from P4. Validated with `pnpm knip`
  and `pnpm --filter @oaknational/agent-tools type-check` before committing.
- Did not start P5 unified comms format because the collaboration substrate was
  actively carrying graph-lane traffic and live git windows. P5 remains the
  next safe agentic-tooling implementation step, followed by P8 collaboration
  TUI.

### Coordination Lessons

- A fresh overlapping file claim on memory surfaces is a real coordination
  stop even when the intended commit is narrow. I abandoned the first docs
  commit attempt before staging rather than racing Dusky's consolidation claim.
- "Current memory/state" needs owner/coordinator clarity in busy trees. This
  closeout commits the current handoff surfaces after claims and queue clear,
  but the next P5 session should still start by checking live claims, queue,
  shared comms, and staged files before migrating comms formats.

## 2026-05-12 — Brazen Stoking Ash / claude / claude-opus-4-7-1m / `913094`

### WS1.3 peer-triple dispatcher session — frictions for next session

Earlier same-day napkin entries from this session were rotated into
`napkin-2026-05-12b.md` and distilled by Dusky Lurking Shade. The
following are the lessons that should remain prominent in the active
surface so Ferny Regrowing Leaf and any next-session dispatcher carry
them forward without needing to re-read the archive:

- **Verify gate before GO** — the dispatcher must RUN the gate
  (`pnpm knip`, `pnpm depcruise`, whichever was failing) independently
  before issuing GO to the implementing agent. Inferring clearance
  from a peer's upstream commit is unsafe; today's premature GO to
  Lofty after Vining's `1bb369a5` landed sent Lofty into a window
  where the gate would still have failed. Outcome was correct only
  by the race-luck of Shaded's unblock landing inside Lofty's hook
  window.
- **STOP signals race the pre-commit hook** — the hook is uninterruptible
  once `git commit` is inside it; a STOP authored after the hook starts
  is unrecoverable. Mutual mechanical verification (both gatekeeper and
  implementer re-run the gate immediately before `git commit`) is the
  only cure that scales.
- **Independent `pnpm knip` probe vs hook-invoked knip can disagree**
  under concurrent landings (cache state / timing). The hook output is
  authoritative; gatekeeper independent probes are guidance, not verdict.
- **Implementing-agent owns staging + commit** — the 8-step
  commit-queue protocol assumes single-agent commit windows. "Pass me
  the staged-bundle fingerprint and I'll commit for you" is
  protocol-incompatible (verify-staged step assumes single ownership)
  and creates Lush-correction authorship-breach risk.
- **`comms direct` and `claims active-agents` both require
  `--active <path>`** but help text omits it; pnpm wrapper buries the
  underlying error. When a CLI fails with no visible diagnostic, drop
  to raw `node agent-tools/dist/...` to see the real message.
- **3-agent windows amplify the staged-only-gates P0 risk** —
  markdownlint stale-sweep AND knip cross-thread serialisation both
  observed today. Until the staged-only-gates cure lands, the
  dispatcher must serialise commits and the implementing agents must
  heartbeat claims under longer windows than usual.

### Sequence at session close

WS1.3 landed `87e21125` (Lofty); knip-unblock `730766ad` (Shaded); WS2.1
staged by Radiant Illuminating Twilight at handover; WS1.4 offered to
Lofty but deferred because owner closed Lofty's session. Handed
dispatcher role to Ferny Regrowing Leaf via shared-log `8c4dc90a`.
Pending continuity-surfaces commit bundle for Ferny to land on my
behalf per owner direction.

## 2026-05-12 — Dusky Lurking Shade / cursor / GPT-5.5 / `4cc0e8`

### Consolidation Sequence

- Owner directed a staged deep-consolidation sequence: process the active napkin
  fully first; next session process `distilled.md`; the following session process
  `pending-graduations.md`; the session after that process `practice-bootstrap.md`.
- Standing value ordering for the sequence: knowledge curation and conservation
  outrank brevity. Fitness numbers are advisory routing signals only.
- Ran `pnpm practice:fitness:informational` first. Result: CRITICAL overall from
  `napkin.md`; hard pressure in `pending-graduations.md` and
  `practice-bootstrap.md`; soft pressure in several doctrine/reference files.
- Opened consolidation claim `1c57c320-9915-462a-95fa-bcab598f593d` for the
  active-memory and Practice surfaces touched by this pass, while leaving the
  live `git:index/head` claim from Shaded Masking Shadow untouched.
- Archived the outgoing active napkin intact to
  `.agent/memory/active/archive/napkin-2026-05-12b.md` before resetting this
  file.
- Fully distilled the outgoing napkin into `distilled.md` under
  `Recently Distilled — 2026-05-12 Napkin Processing (Dusky Lurking Shade)`.

### Fitness Post-Mortem For The Critical Napkin

1. Earlier zones did fire: prior continuity notes already marked deep
   consolidation due, and multiple entries recorded the critical state. The
   pressure persisted because implementation and coordination lanes kept adding
   real learning faster than a dedicated rotation could process it.
2. The napkin limit is still correct for its active-memory role. The file was
   not too small for ordinary capture; it was carrying a same-day burst of
   cross-agent corrections, owner directions, tooling discoveries, and graph
   planning patterns that belonged in the learning loop before any trimming.
3. The file was a symptom of missing next-layer processing, not bad prose. The
   correct cure was intact archive plus distillation, followed by the staged
   processing of `distilled.md`, `pending-graduations.md`, and
   `practice-bootstrap.md`.

### Fitness Post-Mortem For The Now-Critical Distilled File

1. Earlier zones fired during the first fitness run: `distilled.md` was already
   one line below hard limit before this pass. The owner explicitly directed
   full napkin processing without treating target-file size as a constraint, so
   the learning moved into the correct next layer rather than being trimmed.
2. The current `distilled.md` limit is not being judged in this session. Per the
   staged sequence, the next session will process `distilled.md` in substance
   order and decide whether entries graduate, split, refine, or require an
   owner-approved limit review.
3. The critical state is exactly the intended next-layer signal: the napkin has
   been conserved into distilled learning, and the next session owns the
   distilled-stage curation rather than retroactively shrinking this pass.

### Mistakes Made

- My broad consolidation claim overlapped three docs another agent intended to
  include in a handoff commit, and I did not explicitly confirm handoff before
  proceeding. Their commit intent was abandoned before staging. Behaviour change:
  when opening a consolidation claim over shared memory/state surfaces during a
  live multi-agent window, post an explicit handoff/ownership note or ask the
  affected agent before treating the overlap as settled.

## 2026-05-12 — Lofty Vaulting Summit / codex / GPT-5 / `019e1c`

### WS1.3 Peer Implementation Closeout

- Landed `87e21125` for WS1.3 DatasetCore + DataFactory under Brazen Stoking
  Ash's dispatcher/reviewer gate. The bundle absorbed the reviewer-required
  `./data-factory` sub-path split plus `package.json`, `tsup.config.ts`, and
  depcruise registration gaps in one atomic commit.
- Coordination surprise: Brazen's STOP message arrived while `git commit` was
  already inside the pre-commit hook. The exec session could not accept
  Ctrl-C because stdin was closed, so the commit completed before the STOP was
  observable. Outcome was clean (`87e21125`, no `--no-verify`), but the STOP
  signal race is a real protocol limitation.
- Tooling friction to preserve: `comms inbox` needed a usable seen-file path;
  directed replies required a newly mandatory `--active`; shared-log watchers
  needed explicit `comms render`; `check-commit-skill-advisories` forwards args
  differently from direct `check-commit-message`; direct `.git/COMMIT_EDITMSG`
  writes were sandbox-blocked, so `/tmp` commit-message files are safer for
  Codex.
- Session-close decision: WS1.4 was offered after WS1.3, but the owner closed
  Lofty's session before new implementation began. Do not treat Lofty as the
  owner of WS1.4 unless a future session explicitly accepts that work.

## 2026-05-12 — Radiant Illuminating Twilight / codex / GPT-5 / `019e1c`

### WS2.1 Graph-Ingest Scaffold Closeout

- Landed `0f895070` for WS2.1 `packages/libs/graph-ingest` scaffold under
  Brazen Stoking Ash's direction. The scaffold reserves six sub-path barrels,
  registers the workspace in pnpm and knip, refreshes `pnpm-lock.yaml`, and
  passes the real commit hook.
- Landed `42f2e721` immediately before WS2.1 to repair the commit-message
  validation path: `.husky/commit-msg` and `check-commit-message.sh` now use
  repo-pinned `pnpm exec commitlint` instead of unpinned `pnpm dlx commitlint`.
- Tooling frictions captured in
  `.agent/plans/agent-tooling/frictions-register.md`: dirty shared-worktree
  rebase instructions (F-29), stale heartbeat CLI syntax with poor recovery
  help (F-30), and unpinned commitlint dlx resolution (F-31).
- Behaviour change: when a coordinator asks for `git pull --rebase` in a dirty
  shared worktree, verify required SHAs are already ancestors of local `HEAD`
  before requesting broad mutation. If the SHA evidence is sufficient, report
  the safer path rather than forcing a rebase through the shared state.
