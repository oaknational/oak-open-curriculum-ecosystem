---
id: deploy-reliability-corpus-amendment
node_type: delivery
name: 'Amend the deployment-reliability plan corpus on PR #746 against current reality'
overview: 'Apply every surviving review finding and the post-submission context review to PR #746, leaving one truthful carrier per remaining outcome and an evidence-backed disposition for every comment.'
status: ratified
ratified_by: 'Jim Cresswell'
ratified_date: 2026-08-09
ratified_where: "Owner card at the Director seat 2026-08-09 ~14:5xZ (card answer: 'Ratify — subagent executes'; first-principles check and three benign freshness deltas presented on the card; session Plover lifts Troposphere b10c37)"
serves: first-major-release
impact_areas:
  - served-surface
tickets:
  - MCP-475
  - MCP-479
  - MCP-480
  - MCP-481
depends_on: []
owner_gates: []
last_updated: 2026-08-11
---

# Amend the deployment-reliability corpus

## Goal

PR #746 becomes genuinely mergeable: every substantive review finding
carries a recorded disposition, each live plan is true against current
code, decisions, ticket state, and vendor facts, completed work is not
reintroduced as a live sketch, and the open CHANGES_REQUESTED review is
adjudicated with evidence rather than overridden or absorbed.

## Problem

The corpus is valuable — it is the map for the remaining
deployment-reliability work — but it was written before submission and
then repeatedly amended while the surrounding estate changed. The
original findings now have replies, yet the post-submission review found
new drift: an already-completed recovery arm remained a live sketch; the
deploy plan described the wrong production artefact and two incompatible
configuration seams; the reporter proofs remained under-specified; the
liveness node preserved a repository heartbeat that contradicted
ADR-162 while sharing its claimed independent notification plane; and
the PR, plan, operations, and Linear summaries no longer agreed.

## Mechanism

Work happens as commits on the existing PR #746 branch (no new PR):

1. **Rebase/merge `main` in** so the text is amended against reality,
   not against a stale snapshot.
2. **Apply the amendment set** below, file by file.
3. **Adjudicate on the PR**: one review reply carrying the evidence for
   each rejected finding, then re-request review so the
   CHANGES_REQUESTED state can clear honestly.
4. **Record-truing deliverables (owner-directed 2026-08-05).** The same
   amendment round lands the two record cures the post-#751 review
   surfaced: (a) ADR-163 §10's amendment numbering — rename the
   redeploy-arm heading to "Fourth amendment (2026-08-04, MCP-479)" and
   reconcile every self-reference to that single designation, leaving
   the 2026-04-28 third amendment untouched; (b) ADR-163 §10 gains the
   verbatim vendor definition of `VERCEL_GIT_PREVIOUS_SHA` — "The git
   SHA of the last successful deployment for the project and branch"
   (Vercel system-environment-variables reference, retrieved
   2026-08-05) — so the equality arm's premise is cited rather than
   assumed, and the divergence-after-rollback case is named where the
   definition is quoted. The recovery node's own prose is trued to the
   same definition (row 15).

The disposition ledger below is the decision surface: every review
finding has exactly one recorded decision. Applying it is mechanical.

### Disposition ledger — `deploy-config-fails-the-build.plan.md` (MCP-475)

| # | Finding (source) | Disposition |
| --- | --- | --- |
| 1 | `preview-serves` as a required check without the trusted-publisher precondition creates a PR-forgeable required gate (three seats, convergent) | **Apply by rescoping**: keep `preview-serves` explicitly advisory and remove merge-blocking/ruleset adoption from this node's acceptance contract; a separately authorised node and ticket must own the trust-boundary mechanism and fault-injection proof |
| 2 | Turbo cache can skip the build-time gate on same-commit redeploys — none of the validated env vars are hash inputs (verified: root `turbo.json` app build task) | **Apply**: mechanism states the gate runs as an always-executed, non-cached step (or names its env-hash set); criterion 1's proof gains the same-commit-redeploy case |
| 3 | Run the gate with build-only credentials filtered out and a narrow `runtime-config` import, never the app barrel (security) | **Apply** to §Mechanism — the one mitigation that genuinely shrinks the reachable-secret set |
| 4 | The deploy rehearsal must not absorb a local `.env` file layer that is absent from Vercel's deployment condition (wilma; corrected against the live runtime, which deliberately supports `.env` and `.env.local` locally) | **Apply with corrected premise** — use an explicitly passed `processEnv` through a process-environment-only seam shared with `loadRuntimeConfig`; do not claim the runtime has no file layer |
| 5 | Criteria 1/3/4 label console-verified acts `repo-safe` against the schema and both siblings (three seats) | **Apply**: split criterion 1 into its repo-safe and owner-held proofs; criteria 3/4 are removed with the unowned trusted-publisher project under row 1 |
| 6 | The build-env ≡ runtime-env variable-set invariant is unstated; value-level validation's warrant is unstated (three seats) | **Apply**: one mechanism paragraph naming the invariant and why the motivating failure class is value-shaped |
| 7 | No criterion constrains what the gate may print — it consumes live key material (security) | **Apply**: criterion + unit test that gate output contains no secret bytes |
| 8 | Presence-only Clerk validation misses wrong-instance keys; `@clerk/shared` prefix utilities catch it network-free (clerk) | **Overtaken by main**: `HttpEnvSchema` now calls the shared runtime `refineClerkKeyLocality` allowlist, and the deploy rehearsal consumes it through the same schema-and-composition seam as `loadRuntimeConfig`; do not add the conflicting `@clerk/shared` predicate, which accepts a legacy `live_…` form the runtime rejects |
| 9 | The estate has no recorded position on ambient build-env secret exposure (security) | **Apply**: §Out of scope clause naming the exposure as platform-default and pre-existing, listing the live compensating controls |
| 10 | Betty mitigation 1 — keys-not-values validation | **Reject with evidence**: blind to the keyring failure class that motivated the corpus; recreates the second definition of "valid" the node forecloses; the named secret's check is already presence-only |
| 11 | Betty mitigation 2 — post-deploy-only validation | **Reject with evidence**: deletes the node's goal; `preview-serves` is preview-scoped by the node's own boundary |
| 12 | The seat's own Finding-B amendment (structural-only at build) | **Retracted by its author** — same defects as row 10 |
| 13 | Release-expert blocker demanding the row-12 amendment | **Superseded** by rows 10–12's adjudication |

### Disposition ledger — `release-redeploy-recovery.plan.md` (MCP-479)

| # | Finding (source) | Disposition |
| --- | --- | --- |
| 14 | Frontmatter `name`/`overview` still promise the rollback the body disproves (fred, blocker) | **Apply**: rewrite both to the same-commit redeploy arm only |
| 15 | "`VERCEL_GIT_PREVIOUS_SHA` … by construction identifies the current release" overstates the vendor semantic (two seats; vendor-verified: it is the last *successful deployment*, divergent after Instant Rollback) | **Apply**: reword to the verbatim vendor definition; add the post-rollback divergence to §Out of scope; the ADR-163 vendor grounding lands in this same round (Mechanism 4) |
| 16 | The node describes the shipped arm as future work (branch staleness) | **Apply**: re-derive as descriptive of the landed mechanism; proofs cite the shipped unit tests and the live 2026-08-05 pipeline evidence on MCP-479 |
| 17 | The node cites ADR-163 §10 content that does not exist yet (wilma) | **Apply** (owner-directed 2026-08-05): the ADR-163 §10 truing is Mechanism 4 of this plan, so the citation becomes true in the same round |
| 18 | Composed guards leave the promote/rollback path ungated; runbook prescribes it (wilma) | **Partial**: vendor-verified post-rollback auto-assignment suspension (runbook coverage rides PR #769) reframes this; add an §Out of scope bullet naming promotion as platform-governed, not guard-governed |
| 19 | Acceptance criterion 4 ("no duplicate amendment numbers") is currently false on `main` (barney — verified: ADR-163 lines 707/722/732 vs 894) | **Apply**: Mechanism 4 cures the collision; re-verify the node's criterion against the same diff |

### Disposition ledger — `boot-failure-observability.plan.md` (MCP-480)

| # | Finding (source) | Disposition |
| --- | --- | --- |
| 20 | Reporter contract pinned to the retired `SENTRY_MODE` switch; criterion 2 false under the successor shape (fred) | **Apply**: restate on the ADR-171 orthogonal axes (`OBSERVABILITY_SINKS`, fixture-as-tee, unconditional redaction), or declare the un-migrated surface and its migration edge explicitly |
| 21 | "Strictly valid live-mode inputs" undefined — the second-definition drift its sibling declares fatal (wilma) | **Apply**: derive inputs from the shared `SentryEnvSchema`; add the reporter-stays-silent-on-invalid-Sentry-inputs criterion |
| 22 | Incident-duration figures inconsistent across siblings (docs-adr) | **Apply**: move the figures to the tickets, per the corpus's own mechanism-only discipline |
| 23 | Bounded-reporter design verified sound against the real boot path (sentry) | **No change**: cite the evidence at execution pickup |

### Disposition ledger — `production-liveness-detection.plan.md` (MCP-481)

| # | Finding (source) | Disposition |
| --- | --- | --- |
| 24 | The 401-as-healthy assertion requires capabilities the owner's screenshot did not fully discharge (three seats) | **Apply**: record method, request-header, expected-status, and response-header assertions separately; current Sentry API evidence discharges method and request headers, while the two assertion capabilities remain owner-held; if unavailable, use another externally operated monitor or leave the auth check open rather than adding a repository scheduler |
| 25 | The five-minute SLA arithmetic omits Sentry's default three-failure tolerance (sentry) | **Apply**: criterion names Failure Tolerance as a required parameter and shows the arithmetic clearing five minutes |
| 26 | A bare 401 cannot distinguish the app's auth layer from an edge answering in front of it (wilma) | **Apply**: assert an app-only artefact (the `WWW-Authenticate` challenge naming the PRM resource) and name the edge as a probe-path dependency |
| 27 | Finding C's framing conflated headers with authentication; a credential must never enter monitor config (three seats) | **Apply**: dated confirmation note — headers cover `Accept` only; no credential in uptime configuration; a 200 on `POST /mcp` is a failure |
| 28 | The in-repo heartbeat workflow may reverse ADR-162's recorded externalisation direction (fred) | **Superseded after the current-context check**: ADR-162 still externalises production synthetic monitoring and ends the repo obligation at `/healthz`; remove the repository heartbeat instead of adding a gate whose purpose is to seek reversal of the governing decision. Row 51 records the composed failure-domain finding |
| 29 | Frontmatter `last_updated` contradicts the body's later dated correction (betty-rerun) | **Apply** |
| 30 | The node's owner gate expires 2026-08-06, mid-review (assumptions) | **Partly overtaken**: remove the obsolete ADR-reversal gate with the heartbeat; renew only the still-real alert-destination gate to 2026-08-31 |

### Disposition ledger — operations docs and process

| # | Finding (source) | Disposition |
| --- | --- | --- |
| 31 | `environment-variables.md` prescribes a redeploy the guard cancels (docs-adr) | **Overtaken by events**: the redeploy arm shipped in #751, so the instruction is true after the main merge; link the governing ADR-163 §10 contract directly. Do not depend on #769's out-of-scope runbook section |
| 32 | New procedure lacks a cross-reference to the existing local pre-deploy validation path (barney) | **Apply**: one line |
| 33 | Step 1 invites passing a live secret as a shell argument (security) | **Apply**: stdin-or-gitignored-file sentence |
| 34 | The operations index bullet repeats the premise the PR corrects (security) | **Apply**: reword |
| 35 | Two draft-archaeology passages violate `no-tombstones-for-removed-ideas` (two seats) | **Apply**: delete the negation-contrast memorials; keep the vendor quotes and positive statements; the `environment-variables.md` correction note stays |
| 36 | The CHANGES_REQUESTED review is unadjudicated on the PR (two seats) | **Apply**: one evidence-carrying reply (rows 10–13), then re-request review |
| 37 | The PR is a draft awaiting the owner (release-expert) | **Overtaken**: PR #746 is no longer a draft. Merge readiness is governed by current CI and complete comment disposition, with no additional owner ceremony |
| 38 | "The build-time gate already shipped in #743" (barney) | **Reject**: verified false — #743 shipped the preview-serves workflow only; no gate files exist on `main` |

### Disposition ledger — owner-directed additions (2026-08-05, from the second-opinion reviews of the Clerk guard series)

| # | Finding (source) | Disposition |
| --- | --- | --- |
| 39 | Key-realm validation must be allowlist-shaped: a denylist of `pk_test_`/`sk_test_` prefixes fails open — legacy `test_…` development keys and malformed/truncated values pass in production (second-opinion review on PR #757, 2026-08-05) | **Overtaken by main**: the authoritative runtime allowlist is the shipped `refineClerkKeyLocality` path (`pk_live_`/`sk_live_` only), already consumed through the shared runtime composition seam; row 8 records why no parallel `@clerk/shared` predicate belongs in the gate |
| 40 | The app README's Vercel section still documents `DANGEROUSLY_DISABLE_AUTH=true` as a valid optional configuration (with Clerk keys "unnecessary"), while the guard series makes exactly that a hard startup failure in preview and production (second-opinion review on PR #759, 2026-08-05) | **Overtaken by main**: the app README now names the flag as a local-development valve and states that every deployed environment rejects it; no duplicate edit belongs in this PR |

### Disposition ledger — code-owner re-review (2026-08-11)

| # | Finding | Disposition |
| --- | --- | --- |
| 41 | The prescribed `@clerk/shared` predicate disagrees with the runtime validator the gate must reuse | **Apply**: rows 8/39 and the MCP-475 mechanism now consume only `refineClerkKeyLocality` through the shared runtime composition seam |
| 42 | Trusted `preview-serves` publication is an unowned second project with no dependency or owner gate | **Apply by rescoping**: remove merge-blocking and ruleset-adoption criteria; keep the current signal advisory and require a separate authorised node/ticket before it becomes required |
| 43 | Build-vs-buy evidence is absent for the proposed deploy gates | **Apply, then correct the trust comparison**: record Vercel Native Deployment Checks and the Checks API/Marketplace path; both Native Checks and the ordinary Vercel build use branch-controlled invocation, so neither is called non-bypassable. Keep the build rehearsal as the simpler accidental-failure prevention carrier and route adversarially trusted publication to the separate future decision |
| 44 | Delivery-node `last_updated` values predate substantive 2026-08-11 amendments | **Apply**: set all four sibling nodes to 2026-08-11 |
| 45 | Acceptance criterion 3 calls code-owner clearance `repo-safe` and refers to an inline thread that does not exist | **Apply**: classify clearance as owner-held, name the code owner as verifier, and use the durable PR review/reply record rather than an inline-thread claim |

### Disposition ledger — critical post-submission review (2026-08-11)

| # | Finding | Disposition |
| --- | --- | --- |
| 46 | PR body and MCP-475 overview still promise deployed-serving proof after trusted publication was removed from the node | **Apply**: true both summaries to build-time shared-schema rehearsal plus a deployed-handler smoke; keep `preview-serves` advisory |
| 47 | MCP-479 is Done, PR #751 shipped the mechanism, and `release-redeploy-guard-truing` already owns the residual proof | **Apply by archiving**: preserve `release-redeploy-recovery` as an overtaken unratified record rather than a second live carrier |
| 48 | MCP-475 names both `loadRuntimeConfig` and a process-only seam, and applies the long-running SIGTERM smoke to Vercel's handler artefact | **Apply**: converge on `composeLoadedRuntimeFromValidatedEnv` after explicit process-env selection; smoke `dist/server.js` as production imports and invokes it |
| 49 | MCP-480 still has no explicit flush deadline, reporter-failure matrix, or consuming-workspace destination-redaction proof | **Apply**: one attempt, 500 ms hard deadline, no retry, original-error preservation across every failure arm, and known-canary redaction proofs repo-side and at the preview destination |
| 50 | The global build-vs-buy finding was recorded only for Vercel deploy gates | **Apply**: MCP-480 reuses and extends `@oaknational/sentry-node`; MCP-481 first uses the existing external monitor and does not invent an in-repo scheduler |
| 51 | MCP-481's GitHub heartbeat reverses ADR-162 and shares Sentry's notification plane, so the claimed independent failure domain is false | **Apply by rescoping**: keep health/auth checks externally operated; remove the heartbeat and ADR-reversal gate; treat true independent-provider redundancy as separate work |
| 52 | MCP-481 overclaims automatic alert/error correlation and does not disposition synthetic-401 log pollution | **Apply**: state that boot evidence is contemporaneous but not embedded; add a stable non-secret probe marker and an acceptance proof that the traffic remains separately queryable |
| 53 | Public mechanism records retain incident chronology and the operations procedure carries an unsupported internal-record-id theory | **Apply**: keep incident evidence on Linear; ground replacement ordering only in Vercel's documented change → redeploy boundary |
| 54 | Criterion 5 and §Out of scope invent a fresh owner blessing before merge | **Apply**: encode the standing instruction — merge once current CI is green and all comments are properly addressed; no additional owner ceremony |
| 55 | MCP-475/479/480/481 descriptions still carry pre-review mechanisms and false platform claims | **Apply on the owning surface**: true the four Linear descriptions to the final plan boundaries and record the update in T5 |

### Disposition ledger — Copilot exact-tip review (2026-08-11)

| # | Finding | Disposition |
| --- | --- | --- |
| 56 | Native Deployment Checks and the existing Vercel build both use branch-controlled invocation, so the latter is not a non-bypassable alternative | **Apply**: correct the comparison, bound this node to accidental invalid-configuration prevention, and leave adversarially trusted publication to its separately authorised outcome |
| 57 | A gate-module unit test cannot prove Turbo or Vercel executed the orchestration step | **Apply**: add a repo-side production-build-entrypoint contract proof and keep the same-commit remote execution proof owner-held |
| 58 | The archived recovery goal overclaims arbitrary bad-deployment recovery and carries an unmeasured five-minute target | **Apply**: narrow the goal to repaired environment settings on Vercel's last successful commit in the ordinary non-rollback state; remove the timing claim |
| 59 | Rollback prose turned frozen deployment configuration into a claim that the incident's broken binding necessarily returns | **Already cured at the published tip**: state only that Instant Rollback serves the selected deployment with its original environment binding |
| 60 | "The deployed one" is ambiguous after Instant Rollback | **Apply**: name Vercel's last successfully deployed commit in the criterion and predicate boundary |
| 61 | The archive repeats the unsupported same-broken-binding rollback claim in §Out of scope | **Already cured at the published tip** by row 59's documented frozen-configuration wording |
| 62 | "Not a minimal Sentry client" preserves a discarded design as a tombstone | **Apply**: state the bounded bootstrap-reporter contract positively |
| 63 | Absence-only redaction proof would not prove use of the shared barrier | **Already cured at the published tip**: require a positive canary-to-redaction-marker assertion in the consuming workspace and destination |
| 64 | Successful flush alone does not prove reporter failures preserve and bound the original error | **Already cured at the published tip**: cover initialisation, capture, flush rejection, and non-settling flush with fake-clock proofs |
| 65 | Amendment-plan evidence surfaces disagreed between PR-level and nonexistent inline-thread wording | **Already cured at the published tip**: the overview, goal, mechanism, row 45, and criterion 3 use the durable PR review/reply record |
| 66 | "Every review finding" overclaims one-to-one ledger coverage of the earlier 3–4 August review bodies | **Apply**: scope criterion 1 to the four amendment rounds governed by this ledger; retain earlier review bodies and their replies on the PR as their evidence surface |
| 67 | The derived todo count did not include T3a | **Already cured at the published tip**: the record says five todos |
| 68 | The PR body described T4 as open after its publication actions completed | **Already cured on the owning GitHub surface**: the current body distinguishes published T4 evidence from current exact-tip review and CI |
| 69 | A bare full SHA in the plan violated the collaboration-content prefix rule | **Already cured at the published tip**: the stale exact-SHA paragraph was removed rather than retained as execution state |
| 70 | The environment procedure's incident-cost sentence was ungrammatical | **Already cured at the published tip**: incident chronology and diagnosis cost moved to Linear |

## Acceptance criteria

1. **Every finding in the amendment rounds governed here has exactly one
   ledger row and each applied row is visible in the diff.** The governed
   rounds are the 2026-08-05 eleven-expert set, the 2026-08-11 code-owner
   re-review, the critical post-submission review, and the Copilot exact-tip
   review. Earlier 3–4 August review bodies retain their durable PR replies
   rather than being retroactively restated. Proof: repo-safe — this node's
   ledger plus the PR #746 diff at re-review.
2. **No corpus statement contradicts `main`** (shipped arm described as
   shipped; runbook instructions executable today). Proof: repo-safe —
   the rebase commit plus reviewer re-check against the named files.
3. **The PR carries the adjudication and the review state
   clears honestly** (reply posted, re-review requested; no dismissal
   without evidence). Proof: **owner-held** — verifier the requested code
   owner; durable evidence is the PR review plus the evidence-carrying reply.
4. **CI green on the amended branch** including the plan-estate
   validator. Proof: repo-safe — the checks rollup.
5. **Merge happens as soon as the standing conditions hold.** Proof:
   owner-held — current CI is green, every comment and review body has
   a proper evidence-backed disposition, and the PR is merged without
   seeking an additional owner blessing.
6. **ADR-163 §10 names its amendments without collision and quotes the
   `VERCEL_GIT_PREVIOUS_SHA` definition verbatim with its retrieval
   date** — exactly one "fourth amendment" designation for the redeploy
   arm, no remaining "third" reference to it, the 2026-04-28 third
   amendment untouched. Proof: repo-safe — the ADR diff plus docs lint.

## Out of scope

- Executing PR #769's remaining deliverables (the guard
  cancellation-message change, the rolled-back-state runbook section,
  the live redeploy proof). The ADR-163 §10 truing moved INTO this plan
  (owner-directed 2026-08-05, Mechanism 4); #769's node is re-scoped
  accordingly.
- Any code change to the shipped guard or the estate's build scripts —
  this PR remains docs-only.
- The estate-level build-environment secret-exposure ruling (row 9
  records the position pointer; a durable ruling belongs to the
  governance surface).
- Any implementation of the three live delivery plans; this PR makes
  their records decision-complete and truthful.

## Todos

- [x] T1: merge `main` into the branch; re-true `release-redeploy-recovery`
      and the two operations docs (rows 14–19, 31–35); land the ADR-163
      §10 truing (Mechanism 4); run the row-40 README check.
- [x] T2: amend `deploy-config-fails-the-build` (rows 1–9, 39).
- [x] T3: amend `boot-failure-observability` and
      `production-liveness-detection` (rows 20–30, including the row-28
      check).
- [x] T3a: cure the 2026-08-11 code-owner findings (rows 41–45), including
      the MCP-475 rescope and the four sibling metadata updates.
- [x] T4: post the adjudication reply (rows 10–13, 36), re-request
      review, and record the ledger completion on the tickets. Evidence:
      [PR adjudication](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/746#issuecomment-5251424241);
      Linear comments `626aaa2d-26e2-460c-a087-4d659d5f66ec`
      (MCP-475), `e102e0ae-ec81-48d5-a610-09e42c029b1d`
      (MCP-479), `2fdd6924-f0c0-4170-903b-c70b88ea4354`
      (MCP-480), and `60917574-1f92-4102-abaa-25a89b5f5b36`
      (MCP-481), all 2026-08-11.
- [ ] T5: apply the post-submission dispositions (rows 46–55), true the
      four Linear issue descriptions, publish the exact-tip evidence,
      and re-harvest every review/comment/check surface.

T4 records the completed publication actions; it does not satisfy acceptance
criterion 3 by itself. T5 exists because the later critical review changed the
substance, not merely the prose. Exact-tip checks, review state, comments, and
threads are harvested again after T5 publishes; no historical SHA or check
count stands in for that current evidence.

All five todos are commits on the existing PR #746 branch — one bounded
repair story, no replacement PR.
