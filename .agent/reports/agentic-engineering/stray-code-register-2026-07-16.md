# Stray-code register — owner-ordered sweep, 2026-07-16 (AIP-131)

Every piece of work found outside `main` at the session close, with its committed/
pushed/draft-PR disposition. Corrected inventory: the first scan over-counted by
eleven stale remote-tracking refs (branches merged upstream and deleted; pruned).

## Secured on draft PRs by this sweep

| Draft PR | Branch | Content | Commits |
|---|---|---|---|
| #395 | chore/aip-131-primary-estate-snapshot | ALL uncommitted primary-checkout work (36 files, +6,293): session records, reports, rules, cricket templates, ratified oak-reason amendments, tooling-runway plan, r2 walk inputs; napkin as mechanical append union (+1,953/−0 over main) | 1 |
| #396 | fix/commit-queue-rename-endpoints | commit-queue rename-endpoint fixes | 3 |
| #397 | feat/plan-corpus-refounding-s1-zodiac | Zodiac's S1 refounding work | 1 |
| #398 | chore/session-handoff-zodiac-019f65 | Zodiac's session-handoff record | 1 |
| #399 | team/plan-corpus-refounding | refounding team-branch work | 3 |
| #400 | docs/agent-operability-deferred-work-map | operability deferred-work map | 3 |
| #401 | claude/nifty-ramanujan-7b1623 | unlabelled claude-session work — needs identification at adjudication | 3 |
| #402 | docs/graph-team-direction-2026-06-10 | graph team direction docs | 2 |

## Another seat's parallel sweep (do not touch)

- `fix/claude-hook-hardening` — 5 commits + 12 uncommitted files in its worktree:
  **Lupin herds Bark's hooks sweep**, per the owner. Also excluded from #395 for the
  same reason: the codex-hook ARC channel and the codex-to-codex thread record.

## Deliberately NOT committed (hard constraint: never enters git history)

- `.agent/reports/restatement-audit/canary-key.v1.json` (primary checkout)
- `.agent/plans-refounding/challenge/canary-key.v1.json` and
  `canary-keyset.v1.json` (s2-divergence worktree)

These are unsealed audit canary keys; they live untracked beside their consumers.

## Stale refs corrected (merged upstream, branch deleted — nothing stranded)

- `feat/plan-corpus-refounding-r2` → already merged as PR #390; the first scan's
  "12 unmerged commits" was a stale local ref, not stranded work
- `feat/refound-tooling-arg-contract` → merged as PR #387
- `chore/s2-attestation-ledger-set-aside` → merged as PR #388
- plus eight further pruned refs with no local divergence

## Clean at sweep close

- `s2-divergence` worktree: branch fully merged; only the canary keys above remain
  (by design). All other worktrees (tooling-runway, continuity-truth,
  s1-reader-sample, restatement-audit, plan-corpus-refounding-r1): clean, branches
  merged.
- The primary checkout's working tree DELIBERATELY retains its files (live fleet
  surfaces — comms, claims, handoff records, napkin); their content is secured on
  #395. Do not "clean" the primary; reconciliation lands via AIP-127.

## Adjudication queue (merge / fold / close — owner or fresh seat)

Each draft above needs a disposition, adjudicated at the refounding restart with its
Linear link per the new order. Recommended first pass: #395 folds via AIP-127's union
authorship; #397/#398/#399 are refounding-lane inputs and adjudicate with that
restart; #396/#400/#401/#402 are individually small — merge-or-close on inspection.

— Mussel rides Coral (6f8857), 2026-07-16, agent under shared credentials

## Post-sweep amendment (2026-07-16 ~22:0xZ): the s2 canary keys entered history via PR #404

Lupin herds Bark's parallel cleanup (correctly protocol'd — their custody ask went
unanswered because this seat's watcher was already stood down) committed the two
s2-divergence canary JSON files as `chore/preserve-r2-canary-key` (commit 5612ae244,
draft PR #404). Under the standing never-in-history constraint those keys are now
COMPROMISED-FOR-AUDIT: a key readable in history cannot prove a finder found rather
than read it. Disposition: #404 closes unmerged; both keys re-plant in the v2-cycle
key work before any canary gate consumes them. The primary-checkout key
(canary-key.v1.json) remains untracked and unaffected. Lupin's #403 (hook prototype)
is clean and stands.

## THE MANAGEMENT PLAN (definitive, 2026-07-16 close; supersedes the queue above)

Two tickets own everything; every PR below carries its verdict and its vehicle.

### The nine open PRs

| PR | Verdict | Vehicle / gate |
|---|---|---|
| #395 estate snapshot | CURATE THEN MERGE — this branch IS AIP-127's working vehicle: author the two remaining unions (repo-continuity, strategy thread record), apply the track-vs-untracked split (coordination-record classes that stay untracked BY RULE come OFF the branch, recorded here as living untracked-by-design), undraft, merge | AIP-127; first act of the next fresh seat |
| #396 commit-queue fixes | MERGE — small code fix; verify gates on tip, undraft, merge | AIP-131 adjudication; minutes |
| #397 Zodiac S1 | ADJUDICATE AT REFOUNDING RESTART — lane input; fold into the restart branch or merge if self-contained | AIP-131 → refounding restart |
| #398 Zodiac handoff record | EXTRACT AND CLOSE — handoff commits are barred from main by standing rule; conserve unique content into the continuity estate via #395, then close | AIP-131 adjudication |
| #399 team/plan-corpus-refounding | ADJUDICATE AT REFOUNDING RESTART — as #397 | AIP-131 → refounding restart |
| #400 operability work map | FRESHNESS-CHECK THEN MERGE-OR-CLOSE — docs; if the map still reflects reality, merge; else extract-and-close | AIP-131 adjudication |
| #401 nifty-ramanujan | IDENTIFY FIRST — unlabelled session work; read the 3 commits, then merge-or-close on content | AIP-131 adjudication |
| #402 graph-team-direction (June) | FRESHNESS-CHECK THEN MERGE-OR-CLOSE — five weeks old; likely extract-and-close | AIP-131 adjudication |
| #403 Lupin hook prototype | HOLDS AS DRAFT — the codex-hook lane's own continuation gate (diagnose the masked reviewer exit-1 first, per their thread record); disposition belongs to that lane, not this sweep | codex-hook lane |

(#404 CLOSED unmerged — canary-key constraint; keys re-plant in the v2 cycle.)

### The dirty primary checkout

All content is secured on #395; the working tree deliberately keeps its files because
they are live fleet surfaces. End-state after #395 merges (AIP-127): `git pull
--ff-only` succeeds content-aware; the tracked files match main; what remains
"dirty" is exactly the by-design residue — the untracked runtime surfaces (comms,
claims, active handoff records, ARC channels if ruled untracked) and the primary
canary key. Target: primary status drops from 39 items to only that named residue,
listed here at AIP-127 close as the accepted steady state.

Sequencing: (1) #396 merge (minutes) · (2) #395 curation + merge, then the primary
fast-forward (AIP-127) · (3) #398/#400/#401/#402 adjudications (an hour of fresh-seat
work) · (4) #397/#399 ride the refounding restart · (5) #403 rides its lane. All
under ticket-first; AIP-131 closes when only #397/#399/#403 remain, each owned by a
named live lane.

## 2026-07-17 adjudication updates (Foundry guards Vapor, 72fa18)

- **Operating model changed (owner instruction, 2026-07-17 morning):** the primary
  checkout now lives ON `coordination/estate-2026-07` with ZERO dirty files — live
  fleet surfaces are tracked and committed there (no third state; canary keys stay
  gitignored). All PRs target `main`; after each merge the coordination branch
  updates from latest `main`. The management plan's "primary fast-forward to main"
  end-state is superseded accordingly.
- **#396 CLOSED UNMERGED (verdict corrected from MERGE):** the branch was a strict
  ancestry prefix of #403 carrying the codex-hook module, not a standalone small
  fix; the rename defect was independently cured on main at 5efa4debc; the two
  net-new residues (worktree-smoke rename traversal; commit-skill rename-endpoint
  contract) merged via PR #407 (2026-07-17T08:43Z). Full evidence on the PR.
- **#404 CLOSED UNMERGED (2026-07-17T07:50Z)** per the canary containment ruling;
  the v1 keys are compromised-for-audit and the r2 pilot design + .gitignore now
  carry that status explicitly (this commit).

### 2026-07-17 disposition results (continued)

- **#398 CLOSED UNMERGED** — handoff commit barred from main; all four files
  substance-probed conserved in the coordination estate (evidence on the PR).
- **#400 CLOSED UNMERGED** — freshness failed (frictions-register links broken by
  the PR #375 registers-OUT re-homing; June map of a mid-refounding corpus); its
  `derives_from` source report is on main; the map re-derives fresh at the
  refounding restart. The companion under-the-hood one-liner is already on main.
- **#401 HOLDS OPEN, retitled** — ITF spike preservation, gated by the owner's
  TS-promotion integration pass (never merge `.mjs` as official code); owned by
  the `itf-knowledge-graph-spike` thread. Its three branch-only knowledge
  surfaces (thread record, experience entry, Fern's napkin entry) are conserved
  on the coordination branch.
- **#402 CLOSED UNMERGED** — report conserved on main in strictly-newer corrected
  form (2026-07-15 re-home; resolution PR #191); eef bullet in
  `threads/paused/eef.next-session.md`; June napkin entry in
  `archive/napkin-2026-07-14.md`. Discharges the §OWNER ROADMAP
  graph-team-direction open action.
- **AIP-131 close-state**: remaining open drafts are #395 (the estate→main PR,
  now pointing at the coordination tip), #397/#399 (refounding-restart inputs),
  #401 (ITF integration pass), #403 (codex-hook lane) — each owned by a named
  live lane.
