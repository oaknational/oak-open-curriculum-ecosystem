# Independent review of PR 66 — the public-service AI tuition import

**Reviewed:** 6 September 2026, by Jackal wakes Nocturne (Claude Code, `claude-fable-5-1`,
session prefix 3484b6), agent-authored on behalf of the owner under the estate's bot identity.
**Target:** [PR 66](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/66),
`docs/public-service-ai-tuition-2026-09-06`, head SHA:2db74f5bb, base `engraph` at
SHA:6019dd44f; the 17 imported files are unchanged from SHA:5f04e4d0f; the diff since then is the
author-lineage review and its index row. **Disposition: qualified.** All three of the owner's
facts were ruled on 2026-09-07 (the runner: apply the standing policy; the nine repositories: all
public; the "settled" directions: proposals, not ratified — PR 66 comment 5571197335, ~13:2xZ);
one class of defect is curable only at the author's source. The substance of the collection is
reviewed in the "Second pass" section below and on the PR. The review posted on the PR is
[review 5126608127](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/66#pullrequestreview-5126608127)
(COMMENT state, 21:03Z) with its second comment,
[review 5126692305](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/66#pullrequestreview-5126692305)
(21:39Z: the R1–R7 mapping and the retraction of finding 2). The owner marked the PR ready for
review at 21:10Z; the intake declaration and the merge remain the owner's.

**Independence.** A different vendor and model lineage from the author session and from the
[published review](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa/.agent/reports/public-service-ai-tuition/pr-66-review-2026-09-06.md) that entered the PR at 20:00Z; correlated with both
through the same corpus and the same repository; no Oak National surface was read. The three
exploration subagents and the audit legs this seat dispatched share its model family and are
declared correlated, never independent. Every count below names the command that produced it.

## Review contract

- **Purpose and impact**: give the owner the evidence to release or refuse PR 66's draft hold
  that neither the PR's own validation surface nor the published review could supply; map the
  published review's seven findings as accepted, partially accepted or refuted; return the
  decisions that are the owner's as one packet with factors.
- **Questions tested**: (1) does the import conform to ADR-226 clauses 2–4 and the repository's
  rules on tracked executable content; (2) what does the PR publish beyond its own bytes (external
  links, internal paths, named people); (3) do the collection's claims of settled authority carry
  identifiable, dated, appropriate word; (4) do the published review's findings survive
  re-derivation; (5) do the collection's engineering defect statements hold at the pinned revision
  and at one pinned `engraph` tip.
- **Evidence standard and authority boundary**: first-hand commands over the PR branch and the
  working tree at the pinned tip SHA:341477368 (fetched 20:46Z); the published review's own
  re-execution of the probe runner is accepted on its stated hash evidence and not repeated; the
  education literature, the experiment design and the workbook's external sources are outside the
  standard. This report names decisions with their factors and recommends nothing that is the
  owner's to decide.
- **Non-goals**: editing any imported file; planning or ratifying chapter 13's programme;
  re-running the probe; reading any Oak surface; merging or shepherding the PR.
- **A successful review of this report** re-runs the reproduction block from a clean checkout of
  the PR branch and finds the same numbers, and reports any mismatch against the questions above
  rather than against taste.

## Findings (two verdicts each: correctness, alignment; one action type)

### F1 — 157 distinct permalinks into nine `oaknational` repositories, all public (resolved 2026-09-07)

The PR body's "403 internal file/anchor links resolve" is true (reproduced: 403, of which 78 are
pure anchors) and internal-only. A census of every `http(s)` URL in the 14 markdown files finds
2,885 occurrences and 2,184 distinct URLs; 421 distinct GitHub `blob`/`tree` permalinks (325
pinned to a 40-hex revision, 96 branch-named); 162 into `EngraphCode/open-curriculum-ecosystem`
(public, verified by `gh repo view --json visibility`); and 157 into nine `oaknational`
repositories — oak-open-curriculum-ecosystem 87, oak-components 27, oak-ai-lesson-assistant 17,
Oak-Web-Application 10, oak-resource-adapter 6, oak-curriculum-ontology 4, oak-dspy-mcq-eval 3,
oak-components-sandbox 2, oak-ai-autoeval-tools 1 — 26 of them unpinned (`main`, `research`).
ADR-226 clause 2 keeps permalinks into public repositories live and requires permalinks into
private ones to be reduced to plain-text citations resolved by an index in the private source.
This line reads no Oak surface without the owner's word, so at the first review visibility was
unverified by construction (the fork's own record reads `isFork: true, parent: null`, which
GitHub returns both for an unlisted and for an inaccessible parent). Resolved 2026-09-07: the
owner permitted nine read-only `gh repo view` calls, the Director ran them once as the bot and
posted the table on PR 66 (comment 5570600664, 12:25Z): all nine repositories are PUBLIC
(oak-dspy-mcq-eval archived, its links live but frozen). Under clause 2 every one of the 157
permalinks may stay live; no reduction to citations is required. Correctness: true. Alignment:
disposition-as-intended on visibility; the 26 unpinned links (`main`, `research`) remain a
pinning nit for the author's source.

### F2 — Thirty-one references use the fork's former repository name (withdrawn as a defect)

`github.com/EngraphCode/oak-open-curriculum-ecosystem` appears in 30 unpinned `blob/main/` URLs
in chapter 08 (from line 3230) and once bare in chapter 12 (line 521). The first posted review
(5126608127) called these links dead by construction. That was wrong: `gh api
repos/EngraphCode/oak-open-curriculum-ecosystem` returns `full_name:
EngraphCode/open-curriculum-ecosystem`, so the fork was renamed and GitHub redirects the former
name; every one of the links resolves. The same former name occurs about sixty times on `engraph`
at the tip (`git grep -n 'EngraphCode/oak-open-curriculum-ecosystem' 34147736855493b8f9a528870e0541e3ae948c40`: two thread
records, the v0/Claude Code practice report, four innovation-kit reports and their provenance
files, and `.agent/rules/pr-target-is-engraph.md:10`), so this is rename residue across the
estate, not a collection defect. Correctness: withdrawn as a defect; true as an observation.
Alignment: a nit at the author's source (prefer the current name; a redirect lasts only until the
former name is reused) and an estate-side sweep for the owner to price, outside this PR. Cause
of the error: liveness was inferred from a name mismatch and never probed. Retracted in the second
review comment (5126692305, 21:39Z) and captured as failure-mode event `ced01103`.

### F3 — The historical runner is non-conforming tracked executable content

ADR-226 clause 2 grants byte-faithfulness to a record's documents and prose formatting; clause 4
holds a record's executable content to the repository's gates. The runner
(`assets/oce-core-graphs-atoms-probes-2026-09-06.mjs`) is executable content: a hand-authored
`.mjs` on a diff — the TypeScript-only rule's own trigger — outside the sole authorised
hand-authored tier (ADR-168 §4: scripts that must run before `pnpm install`). No gate reaches it:
markdownlint and prettier exempt the subtree, knip and the fitness validators never see it, and the
file sits outside every lint program (CI's static checks passed either way); only the
stale-script-invocations validator scans the subtree. The earlier import (PR #437, ADR-215)
converted its runners to TypeScript; that TypeScript did not survive the relocation into
`.agent/research/innovation-kit/`, which holds no executable content, so clause 4 has not been
exercised on this surface before. The eleven hand-authored `.sh` and `.py` files already under
`.agent/research/developer-experience/` are precedent, not approval. The runner itself passes
`node --check`, reads its checkout root from `argv[2]`, asserts the pinned HEAD, imports only
`node:` modules, and loads ten product source files plus the 25 MB generated corpus dynamically
(all present at the pin). Correctness: non-conforming. Alignment: ruled (owner, 2026-09-07 ~12:24Z, "Apply the standing
policy"): the runner is reduced to data or rewritten in TypeScript per ADR-226 clause 4 and the
TypeScript-only rule, in PR 66 or a follow-on; no research-record exemption class exists. Applied
in PR 66 on 2026-09-07 as reduction to data: the runner's exact text is preserved as the fenced
listing `assets/oce-core-graphs-atoms-probes-2026-09-06.md` (the fenced text hashes to the
imported blob `795808186a4c215909aee2fa7994803d63302612`), the two links that pointed at the
executable (README assets table, chapter 08 §7) are retargeted, and `AUTHORITY.md` beside the
collection records every delta from the imported bytes. The lenses chose data over a wired
TypeScript rewrite: a one-shot witness pinned to a past commit would rot as a maintained script
while proving nothing new. The options the first review had listed for the owner were —
convert per the precedent and lose the byte witness; keep only the results JSON and cite the
runner's source archive; or rule that a research record's executable bytes are data, which also
settles the eleven existing files.

### F4 — The Gitleaks allowlist is as intended in git mode; one caveat; one factor

Reproduced with the PR's own config at 8.30.1 (CI pins 8.30.0; the delta is stated, not assumed
harmless): the PR's commits report nothing; the base config reports exactly one `generic-api-key`
hit, the product label at 08:3157; synthetic credentials appended inside chapter 08 at the
allowlisted path are still reported in git mode (token-scoped, not file-wide); the same token at
another path is still reported (path-scoped). `regexTarget = "secret"` is unique in the file and
tighter than the existing blocks; the firing rule is a built-in (`useDefault = true`) and cannot be
narrowed locally. Caveat: in `gitleaks detect --no-git` directory mode the same config did not
report the synthetic credentials inside the allowlisted file — a scanner-mode behaviour; CI and
the pre-push hook scan git history. Correctness: true. Alignment: disposition-as-intended. Factor
for the owner: the file's first block already exempts `.agent/reference/**` wholesale as
third-party reference material; whether ADR-226's research surface receives the same subtree
treatment, so the next import needs no config change, is a generator question.

### F5 — "Settled" asserted where the collection's own evidence chapter grades it as relayed

README:24, 13:3, 12:31 and 12:33 state that the POC, experiment and managed-platform directions
are settled, without a date or the owner's words at the point of assertion. Chapter 12 lines
790–798 trace those rows to continuity-excerpt records CV-05 and CV-10 and state: "The CV rows are
interpretations of `provided-continuity-excerpt` records, not independently fetched transcripts."
The README does not carry that grade forward. Correctness: true observation. Alignment:
cure-at-source for the README's wording; and an owner fact the repository cannot measure — are
these settled at the owner's word, and where does that word live. Authority-class findings never
enter a refute vote; this one travels verbatim on the owner packet.

### F6 — Tooling coverage of the new subtree (information)

markdownlint (`.markdownlint-cli2.jsonc` lines 35 and 44) and prettier (`.prettierignore` line 81)
exempt it automatically; Gitleaks does not (only `.agent/reference/` is allowlisted), which is why
the block exists; the stale-script-invocations validator scans it
(`agent-tools/src/validators/stale-script-invocations/validate-no-stale-script-invocations.ts:43`);
knip, eslint and practice-fitness never see it. The only registration obligation is editorial and
the PR meets it; the Recent Additions row already states the non-ratification boundary.

### F7 — Process observations (not content defects)

No PDR-140 intake declaration was made at PR-open (the shepherd's act; for an owner-held PR, the
owner's). The authoring session left no continuity footprint in the estate (no claim, thread
record or comms event; the identity "Swallow stirs Altitude" appears nowhere in the tree). Both are
Practice observations for the import procedure.

### F8 — Where an OCE-side authority statement lives (applied 2026-09-07)

The innovation-kit precedent carries an "Authority and status" section in the collection's own
README (`.agent/research/innovation-kit/README.md` lines 23–33); here that file is byte-faithful.
Both reviews and both bot reviewers converged on an OCE-authored sibling inside the collection
directory, pointed at from the research index row. Applied in PR 66:
`.agent/research/public-service-ai-tuition/AUTHORITY.md` states what placement confers, points
at both dated reviews and the R4 successor, records the F9 reading route, carries the owner's
three rulings (all ruled by 2026-09-07 13:2xZ; the second pass added four pointers), and tables
every delta from the imported bytes with the imported blob ids; the research index row links it
and both reviews.

## Reproduced from the PR body and the published review

| Claim | Result | Command |
| --- | --- | --- |
| 403 internal file/anchor links | 403, of which 78 pure anchors | `grep -oE '\]\([^)]+\)'` over the 14 blobs, minus `](http` and `](mailto:`; `](#` counted separately |
| Runner passes `node --check` | passes (Node 24.18.0) | `node --check` on the extracted blob |
| Workbook integrity | `unzip -t` clean | `unzip -tq research-landscape.xlsx` |
| Eight sheets, four tables | 8, 4 | `unzip -l \| grep -c 'xl/worksheets/sheet'`; `ls xl/tables` |
| 1,180 formula cells, no cached errors | 1,180 `<x:f>` elements; 0 cells with `t="e"`; 6,840 cells | `grep -o '<x:f[ >/]' xl/worksheets/sheet*.xml \| wc -l`; `grep -o 't="e"' … \| wc -l` |
| Both pinned revisions exist on this fork | SHA:31e76a72 (the #55 merge), SHA:f1a14284 (the #57 merge) | `git log -1 --format='%ci %s' <sha>` |
| Workspace arithmetic 08:23/33 vs Appendix A | reconciles (A1 folds core with SDKs; A3 folds design with apps and demos) | `sed -n` on lines 23, 33, 471, 490, 503 |
| P1–P11 figures match the results JSON | P10 = 25,026,134 bytes, 36,283 nodes, 67,923 edges, 243 self-loops; JSON pin equals the #55 merge | `jq .probes.P10` on the results blob |
| Implementation drift, pin to PR head | accepted from the published review (5,099 identical blob ids); not repeated | — |

## Engineering defect statements at the pin and at the tip

Checked at the `engraph` tip SHA:341477368 by single searches over the lane worktree; "holds"
means the code state the statement describes is present at the tip.

| Statement (chapter 08 line) | At the tip | Evidence |
| --- | --- | --- |
| Depth admission accepts NaN and 0.5 (257, 317) | holds | `create-graph-view.ts:158` tests only `depth < 0 \|\| depth > maxDepth` |
| Retry honours only the global `maxRetries` (251, 320) | holds | `retry.ts:107` loops to `config.maxRetries` and its predicate `shouldRetryResult(lastResult, config)` takes no attempt index, so the per-status limit that `retry-config.ts:112` computes cannot bound the loop; the loop also sleeps and re-fetches with no signal check |
| P1–P11 probe statements (315–325) | hold by construction | `git diff --stat <pin> <tip>` over the ten loaded source paths and the two `agent-tools` modules is empty: zero drift between SHA:31e76a72 and SHA:341477368 on everything the runner loads |
| Per-request MCP transport with `sessionIdGenerator: undefined` (69) | holds | `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:142` |
| `--oak-` prefix hardcoded in CSS-variable emission (510) | holds | `packages/design/design-tokens-core/src/index.ts:47` |
| graph-ingest root and five parser entrypoints are `export {}` (71, 499) | holds | six `export {};` under `packages/libs/graph-ingest/src` |
| `oak-design-ink` has no consumer outside its package (514) | holds | only eslint boundary rules and a validator test name it |
| EEF envelope omits `data_version` and `last_updated` (92) | holds as fact; documented as deliberate | `eef-evidence.ts:37` "excluded — internal debugging metadata"; the unit test asserts the exclusion. Disposition-as-intended by the code's own contract; the collection's argument is a design disagreement, not a defect |

Remaining statements are checked in the audit stage below or named as unverified.

## Mapping of the published review's findings R1–R7

One audit leg per finding (sonnet, medium; six returned before the compaction boundary) re-read
the cited lines on the PR branch and, where a finding names an OCE record, the working tree at the
tip SHA:341477368; R1 was re-derived by the seat from the cited lines after the boundary. Every
cited line was spot-read again by the seat before the mapping was posted on PR 66 (review
5126692305, 21:39Z). No finding is refuted; two are narrower than published; one cure has a
different home from the one proposed.

| # | Verdict | Re-derived first-hand | Action, and whose |
| --- | --- | --- | --- |
| R1 | accept | 01:16 files the kernel-and-profiles architecture under *Governing design constraints* while the same table's *Future choices* row lists "detailed architecture"; 03:42 calls it "a design inference" to be compared with alternatives; 03:194 repeats the kernel under *Commit now*; chapter 12's ledger (rows 31, 33) marks the POC and PaaS directions settled and never the architecture | cure-at-source (relabel as the source's recommended design); the ratification fact is the owner's (packet item 3) |
| R2 | partial | 10:189 already carries "+5.5 percentage points … 95% credible interval crossing zero" and "expert tutors reviewing every message"; 10:1422 carries the same hedge; the bounds (−1.4 to +12.4), the 93.6% posterior and the raw 66.2% vs 60.7% live at 10:887 and 10:106 only | cure-at-source: one cell at 10:189 mirroring 10:106; why one trial is summarised three times is the author's single-source question |
| R3 | accept | `P1.3`–`P1.6` and `P2.2` (08:1660) are defined nowhere in the 14 files, their meanings surviving as unnumbered rows at 08:1571; 08:149's "§5.1" is absent from the cited plan at the tip; "standards tripwire" (08:1351) occurs once, undefined | cure-at-source |
| R4 | accept | Appendix G (08:3083–3329) never names its successor; `.agent/research/innovation-kit/eve-mcp-agentic-chat-experience-2026-08-30.md` exists at the tip with "Supersedes: `oce-eve-in-app-mcp-chat-demo-investigation-2026-08-29.md`" | the pointer's home is the OCE-side record beside the collection (F8), not the byte-faithful appendix |
| R5 | accept | 04:357 requires cost per eligible, reached/active and retained-benefit learner and demands the denominator "propagate its uncertainty"; identification from a continuous mean intention-to-treat estimand is never defined | cure-at-source before economic use; nothing for this PR |
| R6 | partial | 03:570's own counts (824, 469, 434) make the 355 never-joined ≈ 43%, distinct from the 35 later losses; the "post-randomisation" timing and the five voluntary withdrawals rest on the external PDF, unverified here; the row's conclusion does not depend on the label | cure-at-source: one-cell wording |
| R7 | accept | the five stage ranges at 08:2364–2368 sum to £6.5m–£13m against "≈£7.5m–£15m"; labour sums to £4.92m–£9.42m and reconciles | cure-at-source: record the discrepancy, never invent the allowance |

Perishability ordering (from the scale card below, adopted): R1, R3 and R4 harden or widen with
every citation and successor, so they belong in the OCE-side record at landing; R2, R5, R6 and R7
are stationary and can follow. The legs' evidence rows, each with the command that produced it,
are in the workflow journal for run `wf_b8818d51-f17`; the seat's spot-reads are in the
reproduction block.

## Frame set (the gate)

Four protected Frame Cards (opus, high; each shown only the six seat-frame labels) ran before any
mapping. Adjudication against the seat's priors F1–F6, dated 2026-09-06:

| Card | Framing operation | What it would measure differently | Adjudication |
| --- | --- | --- | --- |
| Boundary: the merge unit as a self-certifying record | the object is the assurance package the merge installs (corpus, certificate, two index rows, one scanner exemption), not the 17 files or the diff | merge-unit composition and the instrument admitting each member; warrant currency (the certificate describes 19 files at SHA:5f04e4d0f while 21 merge at SHA:2db74f5bb, and the review's own reopen clause fires at landing); pointer fidelity one hop up to the index row; decay wiring for the exemption, which has no expiry | adopted in part. Pointer fidelity is the mechanism behind F8 and was confirmed from outside: Copilot and Codex both flagged the index row. Warrant currency is disclosed by the review's own publication note, so no finding. The exemption's missing expiry is a factor under F4. The card's "no on composition" verdict is answered at the authority level by the owner's publication instruction, as its own blind-spot row concedes |
| Scale: decaying witness | from the instant of import to the horizon over which agents read the record; from bytes to the agent-directive surface the record tells readers to apply | a decay rate and re-check owner beside every assurance; drift on the `.agent/` directive surface (the card measured 53 files, +1657/−258 since the collection's latest pin: the card's number, not re-measured by the seat); re-measurement at the merge commit; a perishability class per finding; a temporal clause in ADR-226's import pattern | adopted in part. The perishability ordering is applied in the mapping. The import-procedure proposal (an external-URL census, a gated-or-excluded line for executable content, now with a re-check owner) rides the napkin with a falsifier. Byte-hash equality is demoted from headline assurance, which this report does by construction. The re-check-owner clause is a factor for the owner, not a finding |
| Standpoint: the first learner and the responsible adult | who meets what the record licenses at the moment the first increment is chosen | reachability of non-compensatory conditions from the planning chapter; decision distance as a severity axis over R1–R7; licence-to-omit on every summary row touching supervision, staffing, safeguarding or access | adopted in one verified observation, F9 below. The proxy-standpoint risk the card names for itself is why the rest is declined |
| Construct: the import as a change to the agent-retrieval surface | from "faithful transfer" to "an intervention on what future sessions retrieve and act on" | a span self-containment rate with an interval; an imperative-mood census; a namespace-collision count against live doctrine vocabulary (the card's seed case, not re-verified); a retrieval-precision A/B | declined as a measurement programme, disproportionate to the decision. Adopted as the mechanism statement that authority-by-location and unratified-plan gravity are one phenomenon whose cure is an adjacent status layer, which is F8's home. Its defeater, an owner ruling that `.agent/research/` is not an instruction surface, is a factor for the packet |

Correlation: all four cards and this seat share one model family and one repository; they are
protected against each other, not independent of the seat.

### F9 — Chapter 13 does not route to the inclusion or rights chapters (from the frame gate)

The work-programme chapter links chapters 01, 02, 03, 04, 07, 08, 09, 11 and 12 and never 05
(inclusion and human service) or 06 (state, rights and context); the relative-link census in the
reproduction block confirms it. A builder following chapter 13's routes meets the access,
safeguarding and rights conditions only by finding them elsewhere. Correctness: true. Alignment:
cure-at-source (the author's collection); a factor for the OCE-side record's reading route.

## Epistemic profile and conflict ledger

Profile by frame (support type, then the seat's confidence and what would move it):

- **F1 import fidelity**: empirical, reproduced (blob equality, 403 links, workbook counts,
  scanner runs with controls). High; moved only by a new PR head.
- **F2 claim accuracy**: sampled, not exhaustive. Seven published findings re-derived (five
  accept, two partial, none refuted) and seven defect statements checked at the tip. The seat's
  own posted findings carry one withdrawal in eight (the former-name links), which is the measured
  error rate of this review and the reason every liveness claim now needs a probe.
- **F3 authority**: interpretive at the first pass; ruled 2026-09-07 ~13:2xZ — the "settled"
  assertions are proposals, not ratified (PR 66 comment 5571197335), and the architecture's
  status follows (R1: the source's recommended design). Closed.
- **F4 strategic fit**: not measured beyond chapter 13's stated authority conditions; the
  programme is returned as decisions with factors, by the owner-approved altitude.
- **F5 reader**: mechanism-level, corroborated from outside. Two reviewers of a different lineage
  (Copilot, Codex) independently flagged the index row's missing pointer, the one convergence in
  this review that does not share the seat's model family.
- **F6 harm and publication**: unverified by construction at the first pass; ruled 2026-09-07
  ~12:24Z — all nine repositories public (PR 66 comment 5570600664), every permalink stays live.
  Closed.

Conflict ledger (each row names the resolution and the surface it lives on):

| Conflict | Resolution |
| --- | --- |
| Published R2 (catalogue row silent on the estimate) vs the row's text | partial: the row carries the estimate and the crossing-zero caveat; only the bounds and the posterior are missing (mapping) |
| Published R4's cure (a pointer in Appendix G) vs ADR-226 clause 2 | the pointer's home is the OCE-side record (F8); the appendix stays byte-faithful |
| Codex P2 (revise README:71 and link the review) vs clause 2 | cure-at-named-home: the index row and the OCE-side record carry the qualification; README:71 stays |
| This review's first F2 ("dead by construction") vs the GitHub API | withdrawn: a renamed repository with live redirects (F2; failure-mode event `ced01103`) |
| The boundary card's "no on composition" vs the owner's publication instruction | answered at the authority level; the composition is owner-directed |
| The two scale-type cards' re-check-owner ask vs the frozen witness | the cure lives outside the bytes (an OCE-side record with an owner and a trigger), or it is not proposed |
| The seat's F3 (executable content meets gates) vs eleven existing `.sh` and `.py` files under the surface | precedent is not approval; the class ruling is the owner's (packet item 1) |

Status (Parallax §5): **validated for its declared scope** as of 2026-09-07 13:2xZ. The fidelity
findings are validated; the three owner facts are ruled (runner, visibility, settled directions)
and applied; the mapping is complete; the audit of this draft was same-context self-review
(`execution_context.mode: emulated-reduced`) and does not count as independent assurance. The
first pass was provisional until the packet returned; the second pass below reviews the
collection's substance under the returned rulings.

## Decisions named for the owner, with factors (one packet, raised by the Director)

1. **The runner's cure and the class ruling** (F3). Ruled 2026-09-07 ~12:24Z, "Apply the standing
   policy": reduce to data or rewrite in TypeScript, in PR 66 or a follow-on; no exemption class.
   Applied in PR 66 the same day as reduction to data; `AUTHORITY.md` records the deltas. The factors that were carried: the byte witness versus
   conformance; the precedent converted; eleven existing hand-authored files under the surface.
2. **The nine repositories' visibility** (F1). Ruled 2026-09-07: nine read-only reads permitted,
   run once by the Director; all nine PUBLIC (PR 66 comment 5570600664); the permalinks stay live.
3. **The settled-direction word** (F5). Ruled 2026-09-07 ~13:2xZ on the Director's card: "No,
   they are proposals" (PR 66 comment 5571197335) — nothing in the collection is ratified by its
   own README; every direction is tested against the estate's ratified structure. The factors
   that were carried: four flat assertions; chapter 12's own grade; the two verbatim owner
   quotations the collection does carry (RC-01, RC-02). Applied in the second pass (S1) and in
   `AUTHORITY.md`.
4. **Whether chapter 13's programme receives a plan node, and under which parent** (the second
   gate on the lane node). Factors: the collection refuses a parent by placement; no pedagogy or
   tuition node exists in this tree; the Engraph product direction lives in its own repository.
5. **Outside this PR: the former repository name across the estate's records** (F2). Factors:
   about sixty occurrences at the tip in two thread records, the v0/Claude Code practice report,
   four innovation-kit reports and one rule; redirects hold only until the former name is reused;
   a sweep is a records-only PR.

## World-return contract

- **Observation after the hold decision**: the index row's boundary text and any OCE-side
  authority file in place; the former-name references cured at source or accepted as
  redirect-dependent; the runner disposition applied.
- **Indicators and thresholds**: a fresh reader recovers the collection's authority status from
  the research index alone; every external URL in the census is probed live, never inferred, at
  the next revision.
- **Reopen**: the PR head or the completed collection's revision changes; any decision above
  lands; the R1–R7 audit refutes a finding accepted here.

## Spend (measured, beside the estimate)

| Stage | Estimate | Measured |
| --- | --- | --- |
| Fleet-design review (4 legs) | 0.35M | 0.484M, 8 min |
| Frame gate (4) + R1–R7 audit (7) | 0.55M | 1.04M (run `wf_b8818d51-f17`, stopped at the compaction boundary with six of seven audit legs returned; R1 re-derived by the seat, no resume) |
| Draft audit + critic | 0.25M | not run; replaced by the seat's spot-read of every cited line and a same-context self-review, declared as such above |
| Mapper / verify / refute stages of the approved plan | 2.5–4M | not run — dated proportionality note on the lane node |

## Reproduction

- **Census** (at the immutable revision the counts were taken from, so the recipe survives the
  branch's deletion): `git ls-tree -r -l 2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa -- .agent/research/public-service-ai-tuition`;
  URLs from `git show 2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa:<file> | grep -oE 'https?://[^[:space:]<>)"]+'` over the 14 markdown
  files, trailing punctuation stripped, grouped by host and by `org/repo`; permalinks are paths
  matching `/(blob|tree)/`; pinned ones match `/(blob|tree)/[0-9a-f]{40}/`.
- **Former repository name (F2)**: `grep -n 'EngraphCode/oak-open-curriculum-ecosystem'` over the
  same blobs (31); liveness by `gh api repos/EngraphCode/oak-open-curriculum-ecosystem --jq
  .full_name` (returns the current name: a redirect); the estate-side count by
  `git grep -n 'EngraphCode/oak-open-curriculum-ecosystem' 34147736855493b8f9a528870e0541e3ae948c40`
  (the `engraph` tip the first pass pinned, SHA:341477368).
- **Link census (F9, atomicity)**: `git grep -o -E '\]\(([0-9]{2}-[a-z-]+\.md|README\.md|assets/[^)#]+)'
  2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa -- .agent/research/public-service-ai-tuition | sort | uniq -c`
  (every chapter links into 01 or 13; 13 links 01, 02, 03, 04, 07, 08, 09, 11, 12; the README
  links all fourteen and the three assets).
- **Gate measurement**: in a worktree from the `engraph` tip holding a subset of the collection
  staged, `pnpm --filter @oaknational/agent-tools validate-markdown-links` reports every link
  from a tracked source to an untracked target as broken (93 for the eight-file subset; 2 for a
  six-file subset that still carried the research index on disk; 0 for the link-free members).
- **Scanner** (immutable refs, run from the repository root, gitleaks 8.30.1):
  `git show 2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa:.gitleaks.toml > pr66-gitleaks.toml`, then
  `gitleaks detect --redact=100 --source . --config pr66-gitleaks.toml --log-opts="6019dd44f188d70334b3ebdc6ebbed81bc4920d2..2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa"`
  (0 findings); `git show 6019dd44f188d70334b3ebdc6ebbed81bc4920d2:.gitleaks.toml > base-gitleaks.toml`
  and the same `detect` with `--config base-gitleaks.toml` (1 finding, 08:3157); controls in a
  scratch git repository holding the
  chapter at its relative path with two synthetic credentials appended: an `api_key =` assignment
  carrying a forty-character hexadecimal value with entropy, and an `OAK_API_KEY=` line carrying a
  UUID-shaped value (the literals are kept out of this report so the scanner never learns them as
  history; any values of those shapes reproduce the controls) (both reported inside the file and
  at another path); the directory-mode caveat from `gitleaks detect --no-git --source .` inside the
  same tree.
- **Workbook**: `git show 2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa:.agent/research/public-service-ai-tuition/assets/research-landscape.xlsx > research-landscape.xlsx`,
  then `unzip -tq research-landscape.xlsx` (clean) and `unzip -oq research-landscape.xlsx -d xlsx`,
  then the `grep` counts above over `xlsx/xl/worksheets/`.
- **Runner**: `git show 2db74f5bbc9b3b3c1afe2bf95a7c556cad6295fa:.agent/research/public-service-ai-tuition/assets/oce-core-graphs-atoms-probes-2026-09-06.mjs > runner.mjs`
  then `node --check runner.mjs` (the executable existed at that revision; at the landed head its
  text is the fenced listing `assets/oce-core-graphs-atoms-probes-2026-09-06.md`); presence of the
  loaded inputs at the probe pin by `git cat-file -e 31e76a7237ee7aecb8adfca96e73b2d83b25be39:<path>`
  for each of `packages/core/result/src/index.ts`, `packages/core/type-helpers/src/index.ts`,
  `packages/core/graph-core/src/term/index.ts`, `packages/core/graph-core/src/dataset/index.ts`,
  `packages/libs/graph-ingest/src/source-path/index.ts`,
  `packages/core/graph-core/src/graph-view/create-graph-view.ts`,
  `agent-tools/src/typescript-estate/canonical-json.ts`,
  `agent-tools/src/typescript-estate/length-framing.ts`,
  `packages/sdks/oak-curriculum-sdk/src/client/middleware/retry.ts`,
  `packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts`,
  `packages/libs/graph-project/src/projection/to-property-graph.ts`,
  `packages/libs/graph-project/src/projection/from-property-graph.ts` and the corpus
  `packages/sdks/oak-sdk-codegen/src/generated/vocab/graph-corpus/data.json`.
- **Tip checks**: single `grep -rn` searches over the lane worktree at SHA:341477368, paths as
  cited in the table.

## Second pass — the collection's substance (2026-09-07)

**Reviewed:** 7 September 2026, 13:1xZ–13:4xZ, by Cricket weaves Burrow (Claude Code,
`claude-fable-5-1`, session prefix f8f302), a fresh seat opened at the owner's word on the brief
the first seat left (`.agent/state/collaboration/handoffs/3484b6-jackal-wakes-nocturne-pr66-substance-review-brief-2026-09-07.md`).
**Object:** the fourteen markdown files and three assets at PR head SHA:82bf00121, read from the
branch by `git show`; every claim about this repository tested at ONE pinned `engraph` tip,
SHA:6e9d67216 (the post-#58 tip), by `git grep`, `git diff` and `git show` against that ref.
**Governing frame:** the owner's ruling of 13:2xZ (PR 66 comment 5571197335): the collection's
"settled" directions are proposals; every direction is tested against ratified structure.
**Posted:** [review 5132463698](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/66#pullrequestreview-5132463698)
(13:23Z, findings S1–S6) and
[review 5132534231](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/66#pullrequestreview-5132534231)
(13:31Z, S7–S10). The reviews are the deliverable; this section is the record.

### Scope covered and verdicts

| Brief item | Covered | Verdict |
| --- | --- | --- |
| 1. Chapter 08 engineering claims (the open defect statements, Appendix A, G1–G7, C01–C24, BC1–BC7, I1–I9, Appendix J, appendices C–I as they claim OCE facts) | all read; fourteen further claims checked at the tip beyond the first pass's eight; P0.1–P0.9 at the 20 August pin; Appendix A consumer claims sampled | hold at SHA:6e9d67216 (zero drift on runner-loaded paths from SHA:31e76a72; product drift pin→tip is only #58's `eef-strands`); one wording slip (J1); one perishable statement superseded by #58 (S4); Appendix F's Oak-surface claims unverifiable by construction, three tree-carried ones hold |
| 2. Chapter 07 bridges | all 24 bridges, BP-01–BP-10, PS-01–PS-34 read | honestly bounded as proposals (07:5, 07:53, 07:86); assumed absences hold (no tuition runtime, no participant journey, no transactional store, no published package) |
| 3. Chapter 13 against ratified structure | landing, five destinations, plan-schema conditions, `/visitors` route, the seven opportunities and responsibilities, the one ask (13:130) | hold; 13:136 already ruled and applied; registry-publication rows overtaken by ADR-227 (pointer) |
| 4. Chapter 12 authority | §1 rows, §14 grading; the eleven "settled/governing/commit now" sites across README, 01, 03, 04, 07, 09, 12, 13 | proposals at the owner's word (S1); cure-at-source relabel; `AUTHORITY.md` ruling bullet re-trued |
| 5. Education and evidence chapters (02–06, 09–11) | standing and limits sections of every chapter; R2 and R6 classes re-derived; chapter 09 §9 and §11; chapter 10's OCE claims; twenty external citations probed; the workbook sampled | evidence boundaries honest; R2 partial and R6 partial confirmed; 13 citations resolve, 7 refuse a scripted client (unverified by probe, not dead); workbook 102 records, sample consistent |
| 6. Cross-cutting | identifier census (all families), imperative census (83 `MUST`, all in appendix C/H spans), load-bearing links | one unresolved identifier class (R3's); one unqualified imperative (12:31, closed by S1); no dead load-bearing link found |

### Findings (two verdicts each; one action type)

- **S1 — settled rows are proposals.** Correctness: the flat wording is false of this estate;
  chapter 12 §14's grade was right. Alignment: cure-at-source (relabel) and cure-at-named-home
  (`AUTHORITY.md`, done on this branch). Sites: README:24; 01:15–16; 03:194; 04:363; 07:326,
  07:354; 09:3; 12:29–35; 13:3.
- **S2 — chapter 13 fits ratified structure.** Landing, destinations (`.agent/reports/…`,
  `.agent/plans/{delivery,strategic,runbooks}/`, the ADR directory) and conditions hold at the tip;
  the `/visitors` route matches the ratified runbook, `.gitignore:364`, the CLI's
  `PRACTICE_COORDINATION_HOME` and the vocabulary walker's `.git` exclusion. 13:136 (keep the
  `.mjs`) was ruled and applied; 13:27 and 12:31 (publication conditional) are overtaken by
  ADR-227 — cure-at-named-home. 08:94–111's ten `tuition-*` workspaces inside OCE against 08:126's
  "separate product repository" — an internal tension the collection leaves open; the choice is
  the owner's at planning time (the node's remaining gate).
- **S3 — chapter 08 tip table extension.** 33 workspaces (10/8/4/6/2/2 + agent-tools); 728/676/52
  content items; `oak-design-react` exports one module; identities tier holds only a README;
  `prerequisiteFor` from consecutive year-ordered pairs with a stated-arbitrary tie-break
  (`graph-corpus-edges.ts:6–7, 69–76`), tool live, removal plan `status: sketch`;
  `get-eef-evidence` and `eef://interpretation` dormant; four graph packages private;
  `serialiseCanonicalJson`/`publishRawExtraction` with no non-test product caller;
  `parseWithSchema` a bare `safeParse`; no single-flight in `sdk-cache/cache-wrapper.ts`; the
  lease loop returns the ok execution result on renewal failure (`lifecycle-lease.ts:104–105`);
  bulk reader whole-file (`reader.ts:77–78`), downloader no drain wait (`download-bulk.ts:84`);
  the TypeScript-estate review's evidence/manifest/proposals family absent; pin→92d4854 exactly
  eight documentary files; 61 `SKILL-CANONICAL.md`; plugin 3 skills + 2 agents; 92d4854→f1a1428
  two nodes + four `.gitignore` lines (one `/visitors/`). Served surface at the tip: 40 universal
  tools (37 live, 3 dormant), 1 app-local, 10 resources (6 live, 4 dormant) — confirms 08:168 and
  08:3093 exactly. Correctness: true. Alignment: disposition-as-intended; J1 wording is a
  cure-at-source nit.
- **S4 — perishable: the EEF renderers exist at the tip** (#58, SHA:6e9d67216); 13:155, 08:126,
  J1 true at SHA:f1a14284. Cure-at-named-home (`AUTHORITY.md` pointer, done).
- **S5 — chapter 07 honest**; disposition-as-intended.
- **S6 — 08:168's fork-standing reading** versus `docs/strategy/README.md:40–45` and ADR-227 at
  the tip. Cure-at-source; pointer in `AUTHORITY.md` (done).
- **S7 — appendices C–J.** P0.1–P0.9 stand at the tip (graph packages unchanged from
  SHA:1173c1adf; P0.1 `jsonld-compatible/index.ts:98`, P0.2 `term/index.ts:7`, P0.7
  `canonicalize.ts:9,71`); ADR-221's "no triplestore service" holds; Appendix G's counts hold;
  demos-terminal boundary holds (`boundary.ts:323`); the only MCP client in product code is the
  registration-proof harness; H1/H4 are dated external studies scoped as such; F's tree-carried
  claims (six workflows, tag `v1.178.4`, CONTRIBUTING's no-external-contributions) hold, its
  Oak-surface claims are unverifiable by construction. Disposition-as-intended.
- **S8 — censuses.** Exactly-once alias tokens are self-defining catalogue rows; `OSR-C27` is
  chapter 09's family; R3's class remains the only unresolved identifiers; 83 `MUST` all inside
  appendix C/H spans whose standing lines scope them; one unqualified imperative (12:31).
- **S9 — evidence chapters.** Standing and limits honest in every chapter; R2 partial (10:189 vs
  10:106/10:887) and R6 partial (03:570: 43.1% never-joined; 7.5% withdrew after joining)
  confirmed; 09 §9's four maturity levels hold (PDR-024:338–342) and "the fifth is a synthesis"
  is correct; 10:132 and 10:136 hold; the cognition pin SHA:2714f61 resolves locally with twelve
  skills; citations: 13 × 200, 7 × 403 to a scripted client (unverified, not dead); workbook 102
  records, every-ninth sample consistent, P012 correction present.
- **S10 — ADR-226 clause 3 holds**; the one ask of OCE (13:130) is done; nothing needs an edit to
  the imported bytes.

### Epistemic profile per chapter class

- **Engineering claims about OCE (08, 07's assumed absences, 13 §4–5):** empirical, first-hand at
  one pinned tip; high; moved only by a new `engraph` tip. Coverage: every statement the brief
  listed plus Appendix A sampled (three consumer claims); the full per-row Appendix A ledger
  remains the separately priced follow-up the first pass named.
- **Authority (README, 01, 03, 04, 07, 09, 12, 13 settled rows):** ruled by the owner; closed.
- **Structural fit (13):** verified against the tree and ADR-226/ADR-227; high.
- **Evidence-boundary honesty (02–06, 09–11):** sampled, not exhaustive: standing lines read in
  full, two reviewer-class findings re-derived, twenty citations probed, the workbook sampled at
  one in nine. Medium; a full citation-by-citation probe and a research-merits review remain
  outside the standard, as the first pass declared.
- **External surfaces:** Oak National surfaces unread by construction; seven citations refused a
  scripted client.

### Spend (measured)

Seat-inline only: no fleet, no subagent, no workflow. About 0.62M tokens from session open to the
second review's post (13:31Z), read off the session budget counter; the branch writes that follow
add to it and the final figure is on the thread record's RESUME 4 block.

### Reproduction (second pass)

- **Tip pin:** `origin/engraph` resolved to `6e9d67216bb8bb34c6558aca8977c37c8fa4d3c6` after
  `git fetch origin` at 13:1xZ; every command below names that immutable object, never the
  moving ref.
- **Runner-path drift:** `git diff --stat 31e76a7237ee7aecb8adfca96e73b2d83b25be39 6e9d67216bb8bb34c6558aca8977c37c8fa4d3c6 -- <the ten loaded paths and
  the corpus>` (empty); product drift with `-- packages apps demos agent-tools/src` (23
  `eef-strands` files only).
- **Served surface:** `git show 6e9d67216bb8bb34c6558aca8977c37c8fa4d3c6:apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts`,
  count the `'live'` and `'dormant'` entries per map.
- **Workspace census:** `git ls-tree -r --name-only 6e9d67216bb8bb34c6558aca8977c37c8fa4d3c6 | grep -E '^(packages|apps|demos|agent-tools)/[^/]+(/[^/]+)?/package\.json$'`.
- **Identifier census:** `grep -oE` over the concatenated fourteen files for the alias families
  named in S8, `sort | uniq -c`, then inspect the count-1 rows.
- **Imperative census:** `grep -c '\bMUST\b'` over the concatenation (83) and the line numbers'
  membership in appendix C/H spans.
- **Citations:** `curl -sIL -A 'Mozilla/5.0 (review probe)' --max-time 20 -o /dev/null -w '%{http_code}' <url>`
  over the twenty URLs listed in review 5132534231; no Oak National host.
- **Workbook:** `unzip -oq research-landscape.xlsx`; records by `grep -o '<x:v>P[0-9]\{3\}</x:v>' xl/worksheets/sheet2.xml | wc -l`
  (102); cells are inline `t="str"` values (`sharedStrings.xml` is empty); every ninth `P###`
  paired with its column-B name, then `grep -c -F` of a short name key over the chapters; P012's
  second source from `xl/worksheets/sheet5.xml`.
