---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-24 — Shaded Silencing Dusk / codex / GPT-5 / `019e59`

Post-rotation capture after the active napkin second rotation.

### What Was Done

- Processed the active napkin entries accumulated after the first 2026-05-24
  rotation before archiving the source.
- Verified Breezy and Charcoal captures already had durable processing status
  in rules, policy docs, pending routes, or permanent patterns.
- Refined `distilled.md` with the remaining napkin-only tooling lesson:
  `claims list` rejects identity flags, claim mutations need them, and literal
  search patterns containing backticks should use single quotes.
- Archived the processed source at
  `archive/napkin-2026-05-24-knowledge-curator-continuation.md`.

### Patterns to Remember

- A second same-day napkin rotation needs a distinct archive filename; the
  source date alone is not enough once an earlier processed archive already
  exists for that date.
- "Processing status" entries are useful only after verification: check that
  the named rule, pattern, policy, pending route, or distilled entry actually
  carries the substance before treating the source as processed.

### Mistake — Backtick Search Hazard Recurred Immediately

- Right after routing the backtick-safe `rg` guidance into `distilled.md`, I
  verified it with a double-quoted search pattern containing backticked `rg`.
  zsh attempted command substitution and `rg` complained that no search pattern
  was provided.
- Behaviour change: when the search text itself contains backticks, write the
  pattern in single quotes or search for a simpler adjacent literal first.

### Critical Register Structural Repair After No Safe Archive Target

- After verifying that PDR-077/PDR-078/PDR-079/ADR-186 homes were still absent
  and the remaining PDR-074 autonomy entries were owner/instance-gated, I did
  not archive another pending body.
- The useful move was a structural width repair: wrap metadata prose and
  over-wide pending bodies while preserving unresolved substance live. This
  removed critical-width lines but left line/character critical pressure intact,
  proving the next real drain still needs home-complete graduation, not cosmetic
  trimming.
- A later pass found a safe historical-log slice instead: the 2026-05-12 and
  2026-05-22 top-of-register audit block contained processed disposition
  history. Retained entries still had live bodies later in the register, and
  graduated entries had archived bodies or permanent homes, so the block could
  move to archive with only a concise live pointer.
- The same rule applied to the older 2026-05-10/11 graduations-log cluster and
  stale 2026-05-12 count snapshot: after verifying archive/permanent homes,
  move the processed log text to archive; leave the live register focused on
  queue bodies rather than historical indexes.

### Mistake — Claim Mutation Helpers Need Their Shape Read Back

- I opened the structural-repair claim without `--area-kind files`; the helper
  rejected it and printed the correct usage.
- I then closed the claim without `--closed`, and the helper again rejected the
  command with the correct usage.
- Behaviour change: for claim mutations, trust the helper usage output over
  memory: `claims open` needs `--area-kind`, and `claims close` needs
  `--closed` as well as `--active`.

### Mistake - Claim Open Also Needs `--now`

- I repeated the claim-helper shape mistake when opening the processed-ledger
  archive claim: remembered `--area-kind files`, but omitted required `--now`.
- Behaviour change: treat the helper usage line as the complete contract, not
  as a patch over memory. For `claims open`, the minimum writable shape is
  `--active`, `--thread`, `--area-kind`, `--intent`, `--now`, `--platform`,
  `--model`, plus either repeated `--file` or repeated `--area-pattern`.

## 2026-05-24 — Sylvan Sprouting Petal / codex / GPT-5 / `019e59`

Continuation after re-grounding the curator lane while Shaded owned the
pending-register pattern drain.

### What Was Done

- Avoided Shaded's fresh claim on `pending-graduations.md` and the five
  pattern files, then took a narrow Phase 3 distilled slice instead.
- Verified the live Sonar hotspot audit-trail lesson had a natural durable home
  in `.agent/rules/sonarqube-mcp-instructions.md`.
- Amended the Sonar rule with the REST hotspot changelog verification surface
  before removing the duplicate live `distilled.md` entry and recording the
  graduation in the audit log.

### Patterns to Remember

- In a live curator overlap, useful work can be a small verified-home
  graduation in `distilled.md`; it does not need to compete with a peer's
  critical-register drain.
- An expired tactical track card should be resolved only after checking that
  its useful substance has already moved to durable homes. For the
  skills-standardisation timing card, the thread record carried the reviewer
  findings and timing evidence, while the commands-retirement plan and
  pending-graduations route carried the executable follow-up work.
- When a critical surface is freshly claimed by a peer, the next useful
  curation move is a claim-safe verified-home graduation elsewhere, not
  competing for the same file. The reviewer-pass critical-absorption lesson
  could graduate only after `verify-dont-trust.md` carried the exact behaviour:
  reviewer output is evidence to test, not a substrate pointer to trust.
- The compaction-boundary handoff lesson needed the same exact-home check:
  self-contained handoff doctrine already covered future-self handoffs, but the
  durable rule needed the runtime monitor / cron / watcher verification clause
  before the distilled duplicate could be removed.

### Critical-Register Triage While Claimed

- After the track-card slice, fitness still named `pending-graduations.md` as
  the only critical surface, but Shaded had a fresh claim on the file and its
  2026-05-24 archive.
- Read-only triage found the live index down to three due entries, all
  owner/PDR-gated, and no obvious remaining `status: graduated` live bodies.
  The next writable critical slice should wait for Shaded's claim to clear or
  use a new non-overlapping owner-approved lane.

### Mistake — Chained Validation Command

- I ran one validation command with `&&` between Prettier, markdownlint, and
  `git diff --check`, despite the local collaboration instruction to avoid
  shell command chaining for readable outputs.
- Behaviour change: keep validation calls separate or use the parallel tool
  wrapper for independent checks.

### PDR-072 Cascade While Critical Register Was Claimed

- Shaded held the fresh `pending-graduations.md` claim for the PDR-076 split
  residual drain, so I did not compete for the critical register.
- PDR-072 already carried the durable principle that knowledge curation is
  autonomic learning and that Practice-bearing repos have product and
  Practice-substrate output surfaces. Its live residual named the downstream
  Core cascade into `practice.md` and/or `practice-lineage.md`.
- Landed the non-overlapping downstream cascade in the Core trinity instead:
  `practice.md` now names the two output surfaces and `practice-lineage.md`
  carries the learned principle for propagation.
- After Shaded's claim cleared, removed the now-complete PDR-072 residual from
  the live critical register. The original body and Shaded processing note
  remain in the 2026-05-24 pending-graduations archive.
- Repeated the same verified-home closure shape for PDR-073: `practice.md`
  now carries recursion-as-method in the self-teaching property, and
  `practice-lineage.md` carries it as a learned principle. I declined a new
  directive surface because the trinity plus existing `metacognition.md`
  provide the session-open recognition path without duplicating doctrine.
- After PDR-073 closure, Shaded re-claimed the critical register for width
  repair. I stayed off `pending-graduations.md` and responded to the
  Core-lineage hard pressure instead: tighten lineage-level wording without
  dropping substance, relying on PDR-072/PDR-073 and `practice.md` for the full
  doctrine.
- Repo-continuity had drifted while the team reactivated around Sonar/CLI and
  Shaded reclaimed the critical register. Corrected its live-state head and
  active-lane summary as an index repair, not as an archive move.
- After Shaded's critical-register claim cleared, the remaining file mass was
  not just stale material; it carried live pending bodies. I split the coherent
  2026-05-23 team-session/autonomy cluster into
  `.agent/memory/operational/pending-graduations/2026-05-23-team-session-autonomy.md`
  as an active queue shard, leaving a pointer in the main register. This is the
  right shape for unprocessed content: reduce the critical always-open surface
  without hiding the work in an archive.
- The same pass also wrapped the remaining prose-width offenders in
  `pending-graduations.md`. Fitness now shows the register critical only by
  line count; character count is hard and prose width is green.
- The next critical-file slice split the legacy `## Entries` body into
  `.agent/memory/operational/pending-graduations/2026-05-06-to-2026-05-21-legacy-backlog.md`.
  That body is still live queue material; the split changes load shape, not
  status. The main register is now closer to an index plus current due/recent
  routing surface.
- After the legacy split, fitness moved from critical to hard. The remaining
  pending-register pressure is narrow: 764 lines against a hard limit of 750,
  with characters and prose width green.
- Compacting the now-duplicated shard body pointers moved
  `pending-graduations.md` to soft: 741 lines / 38,880 chars / max prose line
  260. The still-live substance remains in the active shards.
- Re-grounding after compaction found the critical pressure fully cleared:
  current fitness is `HARD (1 hard, 19 soft)`, with no critical surfaces and
  `pending-graduations.md` soft at 690 lines / 36,308 chars. I corrected
  continuity surfaces because stale text saying "critical" becomes a routing
  bug once the file is no longer critical.
- Shaded claimed the only remaining hard file (`testing-strategy.md`) for the
  acceptance value-proxy recipe move, so I did not compete. The useful
  follow-on was a legacy active-shard verified-home drain: the Sonar hotspot
  MCP changelog-vs-comments entry already lives in the SonarQube MCP rule's
  hotspot-review section, so I archived the original shard body with that
  disposition and removed it from the live shard. The next fitness run reported
  `SOFT (21 soft)`, so the current pressure is now all soft-routing work.
- A second legacy shard item had an exact pattern home:
  `deferred-at-write-time-is-unmade-load-bearing-decision.md`. After verifying
  the pattern carries the diagnostic, worked instances, cure, and PDR-026
  cross-reference, I archived the original pending body with disposition and
  removed it from the live shard.
- The insight-report sibling-repos item is now processed: `practice-lineage.md`
  has no host sibling map, while `docs/engineering/sibling-repos.md` is the
  right host-doc home. I preserved the original item in the 2026-05-24 archive
  rather than adding host-specific repo listings to Practice Core.
- The peer-commit absorption third-direction body was also a verified duplicate:
  the active pattern file already carries the exact Mistbound/Soaring worked
  instance, the three-direction model, root cause, cure, and routing. I left the
  implementation tail live in the neighbouring R4-new / commit-queue UX entries.
- The gatekeeper green-light stale-sweep race was another duplicate active-shard
  body: the tooling frictions register already carries it as F-18 with evidence,
  expected invariant, candidate cure, target surfaces, and an explicit open/no-
  cure-landed status. I drained only the duplicate body and left the unresolved
  cure live in that register.
- The plan-portfolio reachability invariant was also safe to drain: the invariant
  is already in `.agent/plans/README.md`, and the unresolved validator/ADR route
  is owned by the decision-incomplete reachability remediation plan. I archived
  the duplicate body but left that plan as the live work surface.
- The canonical-tool-definitions/code-adjacent item has the same shape: its full
  worked instances and cure already live in the coordination-watcher
  canonicalisation future plan. I replaced the shard body with a pointer and left
  the plan-execution trigger alive there.
- When Shaded re-claimed the legacy backlog and shared 2026-05-24 archive, the
  non-overlapping useful move was the 2026-05-23 autonomy shard. The first two
  commit-queue ceremony bodies were exact duplicates of the multi-writer cure
  plan: Tranche C owns intent-scoped message storage, and Tranche A owns
  line-scoped staging. I preserved the original bodies in a Sylvan-specific
  archive file rather than touching Shaded's claimed archive.
- Fresh strict-hard fitness now reports `SOFT (22 soft)`, with no current hard
  or critical surfaces. The next "critical files" move is therefore operational
  correctness on near-limit files, not pressure trimming: I corrected
  `repo-continuity.md` so it no longer routes readers from stale "critical"
  language after the former critical register became soft-only.
