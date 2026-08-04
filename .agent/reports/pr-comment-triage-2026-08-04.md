# PR comment triage and fresh-eyes reassessment — 2026-08-04 (rev 2, fleet-verified)

Owner instruction (verbatim): _"after compaction please pull down all comments
on all PRs and triage and categorise them"_, extended mid-session to _"triage
and analyse and understand them, and reassess them and our understanding of the
current state with fresh eyes"_.

**Revision 2.** The rev-1 solo synthesis was adversarially verified by an
11-agent fleet (run `wf_95675b4e-19f`: 4 blind mappers over the raw per-PR
JSON, a blind reducer, 5 adversarial verifiers, 1 completeness critic;
1.34M tokens; the full result JSON is conserved beside this report as
`pr-comment-triage-2026-08-04-fleet-result.json`). The fleet confirmed the
spine, corrected all five load-bearing claims (two overstated, three
understated), and refuted the enumeration's completeness. This revision
absorbs that delta and marks every correction. The critic's one-line verdict
on rev 1 deserves preserving verbatim: *"Strong synthesis, incomplete
enumeration — and it failed on exactly the axis it diagnosed."* Its author
agrees: rev 1's own footer statistics were hand-asserted and did not reconcile
with the corpus (claimed 40 threads / 121 reviews; derived actual below).

**Method (rev 2).** All comment surfaces pulled for PRs #729–#756 (15 open at
capture + 12 recently closed/merged): GraphQL `reviewThreads`
(resolved-state), review bodies including `<details>` suppressed-comments
blocks, and issue comments. Derived corpus statistics: **27 PRs, 29 review
threads, 113 reviews, 137 issue comments** (computed from the captured
payloads, not asserted). Named, still-open method gaps are in §5 — the report
now states what it structurally could not see rather than implying coverage.

---

## 1. Triage — every PR, its comment state, and who holds the next move

State current as of ~14:50Z; rows marked ⚠ were corrected by the fleet pass.

### Open PRs

| PR | What it is | Comment/thread state | Next move is with |
| --- | --- | --- | --- |
| #756 | Sanction per-person ambient bot identities | 0 threads; **both code-owner approvals discharged** (Matt 10:44Z; the lead-AI-under-grant approval 11:34Z); CLEAN | ⚠ **Merge word only** (auto-merge is off repo-wide). Rev 1 wrongly routed this to Jim's review queue — the review was already done. The rule-gap note (recording the approval grant) rides it |
| #751 | Production redeploy of the deployed commit (MCP-479) | Threads resolved; ⚠ the 10:53Z suppressed set (6 items) includes a **normative ADR-163 contradiction** (two incompatible outcomes for one build condition) and a taken amendment ordinal — NOT "2 docs-only wording items" as rev 1 said | **Agent seat** — the ADR contradiction is the §2 defect class in the governing document for production deploy gating; cure before re-request |
| #748 | posthog requires sentry alongside (MCP-361) | Both threads resolved; owner ruled "strengthen", implemented at `c6aefcad` | ⚠ **One verified-load-bearing pre-merge check**: the fleet positively established posthog IS selected in preview and development today, so if either env lacks `SENTRY_MODE=sentry` the first deploy after merge is boot-dead there. One Vercel-panel look (Jim or Matt), then merge |
| #749 | pnpm version guard (MCP-478, Matt's) | Thread resolved via scope-and-rebut; ⚠ the ADR-121 pre-push parity finding appears in **five** consecutive Copilot suppressed sets (rev 1 said four), none answered; knip registration + `process.exit`-skips-`finally` also suppressed | **Matt** (ADR-168 convergence answer) + explicit disposition of the suppressed findings |
| #737 | Oak Components research record | ⚠ **MISSING FROM REV 1 ENTIRELY** — open, CHANGES_REQUESTED, with two live findings from Matt's 10:06Z verdict (capability-ledger frontmatter freshness; the "based on current main" claim), both instances of the §2 class | **Agent seat** — two small record-integrity cures, then re-request |
| #746 | Deployment-reliability plan nodes ×4 | 0 threads; findings 1/2/5 cured; 3 (bootstrap-reporter proof) and 4 (build-vs-buy) open and declared | **Agent seat** — fresh-context engineering, scoped in the handoff |
| #752 | String-encoded numbers at MCP boundary | 2 threads open; cost measured live, benefit gone (client fixed upstream); recommend CLOSE | **Jim** — close or keep; MCP-487 already points at the request-boundary cure |
| #755 | PDR-136 gate-ledger register (Petrel's lane) | 0 threads; §§5–6 ratified; renumbered off the double-mint | Petrel's lane |
| #750 | Matt's draft lane-opener (MCP-483) | 0 threads, CLEAN draft | Matt's lane |
| #742 | Coordination records carrier | Perpetual draft by design | Nobody |
| #734 | Lichen's frozen review corpus | ⚠ **A BROKEN BRANCH, not a cleanly gated lane** (rev 1 mis-classed it): CI red across install / secret-scan / run-quality-gates / Vercel / Sonar; TS6133 in the preserved source; one unresolved thread from **github-code-quality** — a reviewer channel rev 1 never named | **Owner-gated lane with a defect list** — its continuation contract must include curing the red, and the secret-scan failure wants a look sooner than the lane's reopening |
| #729 / #745 | Identity census; claim-freshness pilot | Held at the clear-run owner gate with documented continuation contracts; ⚠ #729's contract is corrected: Matt's actual verdict is that the branch carries 56 commits / 269 files of unrelated work — the real next move is a **re-cut onto a clean base**, not regenerate-and-undraft (rev 1's wording would have produced an unreviewable PR) | **Gated on the owner's declared trigger**; #745 additionally carries a failing Sonar gate to cure at reopen |
| #731 | Parallax family relocation | ⚠ Three live blockers, all §2-class, unsurfaced in rev 1 (checker swallows an unreadable skills root into "all up to date"; `skipped` discarded from `CheckOutcome`; the portability validator's "41 canonicals" derives from a walk that cannot see the 9 nested family members) | Its lane owner at the clear-run gate — with the blockers now named |

### Recently closed/merged with comment substance

| PR | Residue worth carrying |
| --- | --- |
| #754 (merged ~13:47Z by this seat) | ⚠ Rev 1's open-table row is stale. Threads were resolved pre-merge (GraphQL receipts at this seat; the fleet critic read the pre-resolution capture). Genuine residue: three suppressed date-convention items against AGENT.md on shipped files |
| #747 (merged, 1.148.2) | ⚠ **Three** un-dispositioned residues, not one (rev 1 undercounted): the dir-read TOCTOU (recursive — every subdirectory carries the window), plus two adjacent suppressed findings. Unticketed |
| #738 (merged, 1.146.3) | ⚠ **OWNER ATTENTION — the highest-consequence miss in the window**: the five-year retention extension merged while ADR-218 still misstates the collected data category ("session starts" after `$session_id` was removed) and the ratified plan's own gate — a recorded five-year analytical need, or the shorter-raw alternative — is unmet. A privacy commitment landed with its proof gate open |
| #743 (merged) | `preview-serves` live as informational; trusted-publisher precondition named for Phase E |
| #739 (closed) | ⚠ Rev 1 asserted supersession without verifying: one flagged defect **survives on merged main** (policy.json's scope description covers only git/history-bypass patterns while the live guard also blocks host-DoS patterns, wildcard staging, and the stash-based hiding of work) |
| #735, #741, #744, #740, #736, #733, #732 | As rev 1: clean closes; MCP-486 ticketed; the derive-don't-snapshot lesson absorbed into the skill |

## 2. Categorisation — corrected by the blind pass

Rev 1 compressed the window into one defect class. The blind reducer — which
never saw rev 1 — found **nine mechanism clusters** across 155 independently
mapped findings, and separately judged that one mechanism genuinely
cross-cuts ~75 of ~107 clustered findings:

> "A claim about the system and the system itself are maintained by two
> separate mechanisms, with nothing recomputing the claim at the moment it is
> relied on."

So the rev-1 thesis survives as the *dominant* mechanism — the verifier
measured ~20 of 27 bot review-thread findings fitting it, and 9 of rev 1's 10
table rows re-derived accurately — but "nearly every finding is one class"
was over-compression. The clusters, with counts (full membership in the
conserved fleet-result JSON):

1. **Hand-snapshotted claim drifts from its referent** (30) — cure: derive at
   read time; never hand-copy a system fact into prose.
2. **Enforcement installed off the executed path** (12) — cure: put the rule
   on the path the property must hold on; delete the parallel definition.
3. **Check predicate structurally incapable of falsifying the claim** (13) —
   cure: change what the check observes, not its threshold.
4. **Test surface never extended to the newly added or only-real path** (10)
   — cure: the new branch's discriminating test lands with the branch.
5. **Error/absent state collapsed into a value indistinguishable from
   health** (8) — the `--silent` zero-bytes class; distinct generator,
   distinct cure (fail loud at the point of failure).
6. **Read-then-act across an unguarded mutation window** (7) — the TOCTOU
   and cancellation-ordering family; distinct.
7. **Finding survival depends on its carrier, not its content** (10) — the
   suppressed-comments class generalised; a finding's channel decides whether
   it is ever read.
8. **One artefact carrying several independent changes with no per-change
   ownership** (4).
9. **Bot identity not a first-class principal in the merge/permission
   model** (6).

Clusters 1–4 and 7 are the dominant mechanism's five faces and share the
re-derivation cure family (the gate-ledger programme's territory). Clusters
5, 6, 8, 9 are genuinely different generators the estate should not fold in.

## 3. The five rev-1 claims, as verdicted by adversarial verifiers

| Claim | Verdict | Correction |
| --- | --- | --- |
| §3.1 #748 ruling discharged + env check | OVERSTATED (mildly) | Discharge confirmed from the commit record; the ruling is attested by Matt's commit/comment, not an owner artefact on the PR. Sharpened: posthog IS selected in preview/dev (verified live), so the SENTRY_MODE check is load-bearing, not precautionary |
| §3.2 #747 residual | UNDERSTATED | Three residues, not one; the TOCTOU window recurses through every subdirectory |
| §3.3 suppressed-comments blind spot | UNDERSTATED | Five flags on #749, not four; and rev 1 itself swept the channel on only 2 of the 11 PRs that carry it (§5) |
| §3.4 review-economy re-pricing | UNDERSTATED / over-narrowed | 23 of 24 genuine mantagen verdicts (96%) are agent-authored; 20 of 24 mechanically triggered; but only 11 of 24 are head-change re-reviews — and the economy verdict was measured with the Claude and Codex review channels dark estate-wide on overage limits, which rev 1 classed as noise |
| §2 one-defect-class synthesis | OVERSTATED | Dominant and genuinely shared, but four-plus distinct generators with different cures — §2 above is the corrected structure |

## 4. Owner-attention items (each on its own line, none discharged by this report)

1. **#738's undischarged privacy gate** (§1) — a five-year retention
   commitment on pseudonymous analytics is live on main with its ratified
   proof gate unmet and a data-category misstatement in the approved record.
2. **#748 merge timing** — one Vercel-panel read of preview/dev `SENTRY_MODE`
   (the precondition is now verified present), then it merges.
3. **#756** — one merge word; review is fully discharged.
4. **#734's failing secret-scan** — on a preserved-corpus branch, worth a look
   ahead of the lane's owner-gated reopening.
5. **#752** — close (recommended) or keep.
6. Standing from the handoff: the Matt-authored-settled-PRs merge ruling;
   the fourteen-consecutive-closed-dependabot-PRs pattern (§5) is either
   policy to record or drift to name.

## 5. Method gaps, named (what this report structurally could not see)

- **No check-run / commit-status / Sonar-issue surface** — the same failure
  shape as the suppressed-comments finding, one level up: two failing Sonar
  gates (#734, #745) and #734's red CI were invisible to a comment-only sweep.
- **Suppressed-comments sweep executed on 2 of 11 carrying PRs** in rev 1;
  the fleet completed #731/#735/#737/#738/#739/#743/#751/#754 and the
  substantive finds are absorbed above; #730/#725 (below the scope floor)
  remain unswept.
- **The scope floor (#729) was set before the carrier-dependence finding and
  never re-tested against it** — the fleet found unread suppressed findings
  on merged #725/#730. The floor stands as a *named* bound now, not an
  implied completeness claim.
- **No dependency-currency lens**: fourteen consecutive dependabot PRs closed
  unmerged since 20 July, including CodeQL scanner bumps closed inside this
  window.
- **Reviewer-channel health treated as boilerplate**: Claude and Codex
  automated review are both off (overage) across the estate — a fact about
  the review economy, not noise.
- The captured payloads carry no pagination cursors, so "all comment
  surfaces pulled" is bounded by the capture's own first-page limits
  (`reviewThreads(first:100)`, `comments(first:100)`, `reviews(first:50)`);
  no PR in the window approaches those bounds, but the warrant is the query
  shape, not an assertion.

## 6. Where this leaves the board

Rev 1's four conclusions survive with corrections absorbed: the named
priorities are discharged; the deployment-reliability programme converges
(#743 merged, #754 merged, #748 one check from merge, #751 one real cure +
re-request); the open human decisions are §4's short list; and the estate's
meta-programme (gate ledger, PDR-136, the strata verdict) is aimed at the
dominant mechanism the blind pass independently derived — with the corrected
understanding that four sibling generators need their own cures, which the
cluster structure above now gives the ledger lane as evidence.

*Rev 2 by Galaxy weaves Latitude (5baf4e), claude-code / claude-fable-5,
2026-08-04 ~14:55Z. Fleet: workflow `wf_95675b4e-19f` (11 agents, 0 errors,
26 min, 1.34M tokens); solo rev 1 preserved in git history at `b89abe0ee`.
Corpus statistics in the header are derived from the captured payloads.*
