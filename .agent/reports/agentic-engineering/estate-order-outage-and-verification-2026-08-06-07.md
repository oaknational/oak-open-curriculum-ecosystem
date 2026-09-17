# Estate order, the Actions outage, and the production verification (2026-08-06 evening – 2026-08-07 morning)

The record of one continuous arc at the Director seat (Petrel holds
Turbulence, a0892f), from the owner's entropy-decrease word through a
platform outage to the first full end-to-end verification of the
production MCP path. Facts carry their instruments; details live at the
named homes rather than being restated here.

## The ordering day (2026-08-06 evening)

Owner frame, verbatim: "Let's start to decrease the entropy and
increase the order, for now, there will always be cycles of creativity
and structure."

- **The open-PR estate mapped and executed.** 33 open PRs clustered
  into seven real efforts with per-PR verdicts
  (`open-pr-disposition-map-2026-08-06.md`, this directory). By the
  arc's end: #781, #790, #800, #767 merged by full ceremony
  (suppressed-body reads, reasoned thread dispositions, sha-pinned
  REST merges); #776/#777/#778/#765 closed with evidence comments;
  the owner's own batch merged six more (#755, #764, #770, #775,
  #780, #785); #791 re-trued as the ordinary coordination fold.
- **The S1–S5 disposition round on #790** completed in one
  proportional pass: five red-first cures, a live-fire smoke in the
  gated e2e tier, an Opus expert review (LAND-WITH-FIXES), and a
  three-fix convergence round — 4,146 tests green. The review caught
  the round's blocking defect: the S3 degradation detector watched
  the wrong range shape because cure and test shared one false belief
  about githooks(5); an ~836× silent over-scan (measured 5,016 vs 6
  commits) sat behind a green red-first test. Third dated instance of
  the oracle-independence class in two days; the evidence-running
  reviewer is the instrument that keeps working. Full disposition on
  PR #790's round comment.
- **Knowledge landed as structure**: the engineering-directions
  register (`.agent/plans/strategic/engineering-directions.plan.md`,
  sketch — five owner directions each with falsifier, prior art, and
  promotion trigger); the PR label ledger
  (`docs/engineering/pr-label-ledger.md`); the June deferred-work map
  conserved as graph prior art; the vendor-memory audit (27 unlanded
  learnings) merged and its curator pass shaped as a ready prompt
  block.
- **Post-submission deferrals removed** at owner ruling ("the release
  has effectively already happened"), with the explicit cloud tripwire
  MCP-519 (due 2026-08-11, after 10:00 London) to re-review the five
  unlocked items.

## The outage (15:22Z – ~00:00Z)

GitHub Actions incident qcvjkzcs7j74 (full timeline on MCP-520):
webhook triggers throttled to ~15%, runners assigned invalid jobs.
Estate-side effects, each verified first-hand at the time: main went
9 merge commits past its last CI-verified commit; two CI runs stuck
queued indefinitely; six merges produced no runs at all; the Release
workflow — whose trigger history was audited back to April and never
changed — correctly skipped and then received nothing, damming all
production releases after 1.152.8.

What the estate did about it:

- A five-agent diagnosis workflow established the verified
  chain-of-cause (trigger unchanged; #808's 15:35Z failure was
  outage-onset, its content trivial and locally exonerated).
- **Local verification substituted for CI**: merging main into the
  coordination branch and running the full gate estate caught a real
  casualty CI could not — #785 had landed an identity-census
  divergence on main (a validator failure). The cure was staged with
  the proper ratchet ceremony, and the prediction "main goes red on
  static-checks at recovery" was later confirmed by CI to the exact
  validator line.
- The fold PR was armored (draft, priority block, assigned) and
  MCP-520 minted so the whole story lived where the morning would
  find it.

## The endgame (overnight)

The incident resolved shortly after midnight. Matt's lane had landed
the same census cure independently (#810, full green checks); main
greened; the release gate fired exactly as designed; **v1.153.0
shipped at 00:10 carrying the consolidated batch** — and production
was verified healthy first-hand within minutes (healthz 200; the /mcp
page 200 with the routed-asset fix visibly serving). The one deviation
from the written plan — the release preceding a dedicated preview
pass — is recorded on MCP-520 with the owner's open question
(retrospective preview verification, yes or no). The two remaining
doc merges completed at recovery after re-fires (their webhook events
had died in the throttle).

## The verification morning (2026-08-07)

Owner ask: basic tests against production. What passed immediately:
healthz, the landing page, the PRM (suffixed form), and a textbook
401 → WWW-Authenticate → PRM discovery chain. What then unfolded is
recorded honestly:

- Every connector tool call failed with a resource mismatch. The
  eventual diagnosis — reached only after the owner's correction to
  slow down — was a **stale cached OAuth grant** (alpha-era resource
  binding) being correctly refused against www's metadata: RFC 8707
  client conduct, and no evidence at all about the alpha URL's
  viability. Three rushed conclusions were made and withdrawn on the
  way (the calibration entry in the napkin, 2026-08-07, holds them
  with their cures).
- The owner's ruling landed and is recorded on MCP-307 (closed):
  **`https://www.thenational.academy/mcp` is now and forever the
  canonical URL**; whether the alpha domain continues to serve at all
  remains an open owner choice.
- After a fresh interactive grant, the **entire new-user path proved
  end to end on the canonical URL**: discovery (PRM + AS metadata
  consistent), dynamic client registration (201 with real
  credentials), the interactive OAuth grant, and five authenticated
  tools returning real curriculum — the unlimited-key rate-limit
  shape matching MCP-513's corrected truth, and semantic search
  returning genuine KS3 lessons with full pedagogical payloads. The
  submission-critical path is proven live.

## Rulings, mints, and homes from the arc

- MCP-307 decided and closed: canonical URL forever (owner verbatim
  on the ticket, with the alpha-serving refinement).
- MCP-517 corrected and MCP-518 minted (same day window, parallel
  arc): the Clerk wrong-domain-handshake diagnosis, its
  vendor-contract reclassification, and the non-cures (the proxy
  chain cannot forward the headers; in-app middleware is the only
  placement honouring never-touch-Host) — full run record at
  [the fleet-topology adversarial review](fleet-topology-adversarial-review-2026-08-06.md);
  diagnosis substance on the tickets.
- MCP-519: the Tuesday tripwire over the five unlocked deferrals.
- MCP-520: the outage record, the fold plan, the release deviation,
  and the open preview question.
- MCP-521: coordination branch names as a mechanical production with
  join-before-mint (the twin-incident cure, design agreed).
- The label ledger, the directions register, the disposition map, and
  the conserved June map — all merged or riding the fold.

## Residue register (deliberate, none silent)

Conformance-sweep items from the S1–S5 round (gh-executor buffer
seam, token-lifetime timing pin, docblock over-claim, one fixture
`--no-verify`); MCP-347 (root PRM path unrouted); the probe DCR test
client on prod Clerk (inert; deletion is an owner/Matt click); the
owner's first re-auth attempt failed before the second succeeded
(shape uncaptured — chase only if it recurs); the 103 preparatory
branch pushed remote-safe with its build deliberately deferred; the
alpha domain's future open.
