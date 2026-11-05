# Team resume — the Matt clear-run quiesce (2026-08-03)

The pushed rehydration surface for the exact agents quiesced at the
owner's word on 2026-08-03 (~09:45Z): "I need all seats other than Birch
to get their work into a fully safe and resumable state, where safe
includes being in an open PR on the remote, and I want all of our PRs
either merged or set to draft. Birch's work will be merged. This is so
Matt has a clear run for his work without churn from ours."

**Reopening gate (owner-agreed)**: the owner declares the
first-submission window closed. At that word: flip #729 and #731 from
draft back to ready, remove the temporary Matt block from
`start-right.md` §6a (its text carries the same trigger), cut a fresh
coordination branch from main (the 2026-08-02 one merged at the
door-shut), and rehydrate seats from this document.

## How to rehydrate a seat

1. **Same session, resumed** (first choice — this is what makes it the
   EXACT agent): resume the platform session by its id prefix below
   (Claude Code: `claude --resume`, pick the session; Codex: its resume
   flow). The seat wakes with its context and recomputes state
   first-hand per its own resume map. The owner-supplied verbatim
   commands (2026-08-03):

   ```bash
   claude --resume "Magnetar binds Oblivion (74d914) - Director"

   claude --resume "Birch holds Seedling (e48fe2) - Upstream Schema Update"

   claude --worktree pds-w0-census-validator --resume "Corsair hunts Surf (4d3282) - Design"

   claude --worktree skylark-clear-lock-cure --resume "Skylark hunts Nimbus (e856d5) - Agentic Mechanisms"

   claude --resume "Vanilla stirs Bough (604af6) - Foundations Review"
   ```

   Resume the Director first — its wake ceremony re-arms the
   coordination surfaces the other seats register against. Birch's
   command applies only if their session has ended by then (it stays
   live through the window). The Lichen seat is closed — its corpus
   draft PR is the pickup surface, no session resume involved.
2. **Fresh session, same identity** (fallback): start a seat on the same
   platform/model, follow `start-right-team`, and read the seat's thread
   record named below END TO END before any act. Claims were closed with
   resume-pointer summaries — open a FRESH claim; do not hand-edit old
   rows.
3. Either way: the seat's first question is "what changed since my
   records froze?" — answered by recomputation, never from memory.

**Cross-machine guarantee (owner principle, 2026-08-03: resume context
that only lives locally is a defect)**: route 1 is machine-bound by
nature — session state lives on the machine that ran it. Route 2 is the
guarantee: everything it needs (this document, the thread records, the
freeze entries in `director-handoff.md`, the draft PRs) is tracked and
pushed, so any computer with a checkout can rehydrate the whole team.
Local instance-tier state (comms events, the claims registry) is
transport; its resume substance is homed in the pushed surfaces above.
Birch's in-flight worktree state is re-derivable from the committed
runbook (sdk-codegen README §Responding to Upstream Spec Changes) and
lands through their PR cycle.

## The seats

### Magnetar binds Oblivion (74d914) — Director + commit-warden

- Claude Code / claude-fable-5. Claims a2286c53 (Director) + 4e5f1032
  (warden) RETAINED through the pause.
- Resume map: `director-handoff.md` seated block (the freeze entries;
  the clear-run freeze is the latest). Wake ceremony: monitors →
  warden recompute → board first-hand → gap sweep.
- Board at quiesce: #729 and #731 in draft (titles jimbot-prefixed at
  owner word); the Matt start-right note MERGED at `731fafccf`
  (PR #733); the coordination branch (#714) MERGED at the door-shut —
  the wrap's final act; and the Lichen corpus draft PR (below). At
  resume the Director cuts a fresh coordination branch from main.

### Birch holds Seedling (e48fe2) — upstream update lane (LIVE through the window)

- Claude Code / claude-fable-5. The ONLY lane that continues: tickets
  MCP-462 (spec alignment), MCP-463 (bulk truing + freshness), MCP-464
  (upstream keywords feedback, Aakesh). Matt tagged on lane tickets and
  PRs. Owner word: this lane's work WILL BE MERGED — each PR at full
  condition as it settles.
- Channel: `.agent/collaboration/rapid-comms/`
  `2026-08-03-upstream-update-lane-magnetar-binds-oblivion-birch-holds-seedling.md`
  (activation pack + all owner rulings). Worktree:
  `.claude/worktrees/upstream-spec-probe`.
- Delivered before the door-shut: PR #735 (MCP-462 spec alignment,
  draft, commit `bcdc62373`) with Matt as assignee AND requested
  reviewer — his code-owner approval is the gate and the handoff; Birch
  REST-merges at full condition. MCP-463 (owner-co-designed bulk
  truing + freshness) is their next act.

### Corsair hunts Surf (4d3282) — design lane

- Claude (claude.ai) / claude-fable-5. Wrap-closed 10:02Z; claims closed
  with resume pointers.
- Safe state: records landed at `b1b5431a7`; the #729 cure round is
  pushed into draft PR #729 (all gates green), dispositioned on the PR.
- Thread record:
  `.agent/memory/operational/threads/design-system-integration.next-session.md`.
- Resume order: #729 census-regeneration note → ready → merge at full
  condition; PDS naming execution at owner word; the scoped
  near-horizon re-review; then the owner's implementation word.

### Skylark hunts Nimbus (e856d5) — skills lane

- Claude Code / claude-fable-5. Wrap-closed 10:04Z; claims closed with
  resume pointers.
- Safe state: records landed at `e15d52953`; #731 is draft with
  CHANGES REQUIRED (three blockers + portability-validator gap; full
  report is a bot comment on the PR; round 1 of the PDR-132 budget
  used).
- Thread record:
  `.agent/memory/operational/threads/skills-estate-organisation.next-session.md`.
- Resume order: fresh claim → cure the #731 blockers red-first
  (file-by-file map in the thread record) → re-review → merge at full
  condition → R4, the 37-skill description backfill, the evals-pilot
  scoping at owner word. (The fold merged at the door-shut by owner
  word — no #714 thread remains for this lane.)
- Routed from the #714 fold review (door-shut dispositions, findings
  real, carriers named): the skill-creator DELETION (owner-ruled
  2026-08-03) discharges three findings in `.agents/skills/
  skill-creator/` (block-scalar frontmatter parsing, eval-viewer
  script-injection escaping, viewer-port SIGTERM); three Parallax
  validator defects queue behind the #731 cures (approvals map must
  require every category; stop validation on wrong-typed containers;
  readiness checks must also bind `running` plans).

### Vanilla stirs Bough (604af6) — ARC-colour statusline lane

- Claude Code / claude-fable-5. Wrap-closed 09:48Z; claim closed.
- Safe state: ws-b0 COMPLETE AND MERGED (PR #730, `3fb6875e6`); lane
  worktree `arc-colour-statusline-604af6` persists clean at
  origin/main.
- Plan (owner-ratified):
  `.agent/plans/delivery/arc-colour-statusline.plan.md`.
- Resume order: ws-a-cycle-2 (usage gauges to the MODEL row) at
  owner/Director word after the window; then the B chain at port-speed
  wall-clock, deliberate quality (owner reframe). The castr-pin
  reachability check binds at the first B-story open.

### Lichen guards Phloem (019fc3) — TypeScript-estate review corpus

- Codex / GPT-5. Seat closed earlier at owner word; the corpus is the
  frozen artefact, not a live lane.
- Safe state: the 125-path corpus is committed and pushed at
  `c69b0746c` (owner-run authorized bypass, 2026-08-03) and lives in
  DRAFT PR #734 (jimbot-prefixed). Gates red on the WIP state by
  design — do not merge, do not fix forward without adopting the lane.
- Thread record:
  `.agent/memory/operational/threads/typescript-estate-consolidation-review.next-session.md`.
- Resume route: the green-up (3 lint errors + type/build/test) is the
  foundations review lane's first act — any capable seat, not
  necessarily a Codex one; the corpus PR is the pickup surface.

## Owner working agreements homed from per-user memory (door-shut audit)

The owner's principle (2026-08-03): resume context living only locally —
including per-user Claude memory — is a defect. A door-shut audit of the
memory corpus against tracked surfaces found most entries already have
tracked twins (rules, napkin captures, freeze entries); these did not,
and a cross-machine resume needs them:

- **Merge mechanics** (owner rulings, standing): merge commits only —
  never squash; agent merges are REST calls on minted bot tokens at the
  full condition (every named check green, zero unresolved review
  threads, MERGEABLE, and — since at least 2026-08-03 — the repo-wide
  CODEOWNERS approval from jimCresswell or mantagen).
- **First-major-release gates** (owner rulings): the release is gated on
  the guidance artefact, the MCPJam test suites, and one-click install;
  the sensitivity split stands; a thing merely executed is not thereby
  ratified — owner sight ratifies.
- **Priority order** (owner standing): bugs, then features, then
  research with a protected floor; priority means importance, never
  speed.

Per-user memory remains a buffer: at each consolidation moment, whatever
has become pertinent flows to a tracked surface like this one.

## Standing context that survives the pause

- Matt-priority ruling binds fleet-wide: only the update lane mints
  Linear tickets before the embargo lift; Matt tagged on its tickets
  and PRs.
- Owner questions from every seat go via cards (the
  points-in-conversation window closed 2026-08-03 ~09:35Z).
- Doctrine queue (Director-held, napkin + freeze entries): the
  population-claims family (now with Vanilla's two enrichments), the
  sentinel-taxonomy discriminator from Birch's lane (owner-ratified
  reshape; testing-strategy §Prove-behaviour carve-out via
  new-rule-vs-pdr-clause), coordinator dark-window detection,
  whose-lint-gates-whose-push (n=3 — structural cure on the queue),
  horizon-seam authoring check, `--in-response-to` existence check.
- Watches: Linear embargo lifts 2026-08-10 08:00 London (design ticket,
  pnpm-CLI story, MCP true-ups, ARC-colour frontmatter stamp); skills
  gate expiry 2026-08-23; codex-dialogues window to 2026-08-16; ADR-186
  window-closure signal; four PR-725 follow-ups needing carriers.
- Routed from the update lane at the door-shut (Birch, 10:52Z entry):
  the owner wants repo skills for updating the upstream API spec and
  bulk schema (post-embargo authoring; the sdk-codegen runbook + this
  lane's PR records are the worked instances); sweep residue — the
  MCP-441 "disclose, don't bound" rationale needs re-truing (the server
  now pages), the keywords-finer-grained-control backlog item is partly
  delivered upstream and needs re-adjudication, and rendered-wholes.md
  lacks a frozen-at date.

_Record locations, 2026-09-06: of the thread records named above by their paths of the
time, those the 2026-09-06 consolidation paused moved under
`.agent/memory/operational/threads/paused/` (the threads README's lifecycle layout; the
paused index in `repo-continuity.md` names each); a record still active keeps its root path
under `.agent/memory/operational/threads/`; the paths here are the historical ones._
