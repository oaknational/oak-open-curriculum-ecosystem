# Why delivery stopped when the merge engine turned out to be a seat

**Date**: 2026-09-01
**Arc**: 2026-07-06 → 2026-09-01, the `oak-open-curriculum-ecosystem` delivery
pipeline, ending in a twelve-day merge freeze
**Commissioned by**: the owner, at the point the freeze surfaced during a board audit
**Run by**: the Director seat (Pinnace hunts Delta, `2f1935`)
**Modes**: `metacognition` (retrospective) + `reason`
**Status of the numbers**: every count below is recomputed from its primary source at
writing time (GitHub REST/GraphQL, the ruleset API, git history, the comms stream).
Sets are stated as open sets with exemplars.

---

## The owner's hypothesis, and why it needs correcting

> "It was working when Jim + agents were working alone … but now there's a few human
> collaborators."

The correlation is real; the causation is not. Luke joined in the week of 10 August
and that week still cleared 44 merges. The week of 3 August had two human authors and
cleared 83. Human collaborators arriving did not stop delivery.

**What stopped delivery was the retirement of the seat that had been doing the
merging.** The rest of this record establishes that, because the difference decides
whether the cure is a human process change or a capability change — and the estate
would have built the wrong cure from the hypothesis as stated.

---

## Timeline, from primary sources

Weekly, Monday-anchored, recomputed from the full PR set (800 records fetched):

| Week | PRs created | PRs merged | Clearance | Distinct human PR authors |
|---|---|---|---|---|
| 2026-06-22 | 72 | 69 | 0.96 | 1 |
| 2026-07-06 | 37 | 31 | 0.84 | 1 |
| 2026-07-13 | 73 | 57 | 0.78 | 1 |
| 2026-07-20 | 169 | 144 | 0.85 | 1 |
| 2026-07-27 | 143 | 137 | **0.96** | 1 |
| 2026-08-03 | 112 | 83 | 0.74 | 2 |
| 2026-08-10 | 53 | 44 | 0.83 | 3 |
| 2026-08-17 | 44 | **16** | **0.36** | 2 |
| 2026-08-24 | 4 | **0** | **0** | 2 |
| 2026-08-31 | 6 | **0** | **0** | 1 |

Last merge to `main`: **PR #920, 2026-08-20T08:39:15Z**, released as `v1.175.1` at
08:45:10Z. `main` has not moved since. Control probe: the same merged-PR query with the
date filter removed returns #920, #914, #909, #907, #906, #903, #902, #901 — the
instrument sees merges, so the zero is real.

Queue as at 2026-09-01: **44 open PRs, 34 non-draft.** Age of the non-draft set:
4 at 0–1 day, 1 at 2–6 days, 17 at 7–13 days, 11 at 14–27 days, 1 at 28 days or more.
**29 of 34 have waited a week or more.**

---

## The causal stack

Ordered by depth. Each layer answers "why was the layer above possible?".

### L1 — Technical root: the published endpoint has no single source

`www.thenational.academy/mcp` appears in **97 tracked files**. 84 are `.agent/`
records, which should keep their historical literals; the live surface is **13 files**,
of which five are consumed by a user or a gate:

- `plugins/oak-open-curriculum/.mcp.json` — the binding every installing user receives
- `plugins/oak-open-curriculum/skills/oak-curriculum-principles-mcp-enabled/SKILL.md`
- `.mcp.json.example` and `.cursor/mcp.json`
- `.github/workflows/mcp-conformance-unattended.yml` — the CI `--target`

The only named constant for this value in the entire estate is a local `const` inside a
test file, and that file's own TSDoc states the position out loud:

> `agent-tools/tests/skills/plugin-mcp-server-binding.integration.test.ts:29` —
> *"source constant to derive from — for the shipped plugin's binding, this test is the
> authority rather than a copy of one."*

The **server** side, by contrast, already does this correctly: `CANONICAL_HOST` is
validated at the env boundary and `resolveCanonicalOrigin()` derives the origin from it
(`apps/oak-curriculum-mcp-streamable-http/src/canonical-origin.ts`,
`security-config.ts:59`). So the asymmetry is exact — **the server derives its
self-description from one configured value; every client-facing artefact holds a
hand-maintained copy.**

Consequence: a host change is a sweep, not an edit. The same three-line fix was
independently discovered and rebuilt **three times** — #930 (21 Aug, agent), #940
(28 Aug, a platform engineer), #944 (1 Sept, the tech lead) — each author unaware of
the previous, because the only trace of the earlier work was an unreviewed PR.

This layer is a contributing cause, not the freeze's cause. It is recorded first
because it is the cheapest to cure and the one the three PRs all miss.

### L2 — Delivery root: the merge path was a privilege exercised by a live seat, not a service

This is the finding.

The branch ruleset `Code-owner review gate (bot-exempt by owner ruling 2026-07-21)`
(id `19395183`, active) sets `require_code_owner_review=true`,
`required_approving_review_count=0`, and grants `bypass_mode: always` to four actors:
two Users (`jimCresswell`, `mantagen`) and two Integrations (the bot apps).

Because bypass governs *who may merge*, not *whose PR is exempt*, every PR in this repo
reads `mergeStateStatus: BLOCKED` by design and only a bypass actor can land it. So the
question "what was our throughput?" reduces to "which bypass actor was working?".

Who actually pressed merge, recomputed from GraphQL `mergedBy` over 500 merged PRs:

| Week | Who merged |
|---|---|
| 2026-07-06 | `jimCresswell`=19 |
| 2026-07-13 | `jimCresswell`=57 |
| 2026-07-20 | **`jimbot-oakington-iii`=89**, `jimCresswell`=55 |
| 2026-07-27 | **`jimbot-oakington-iii`=133**, `jimCresswell`=4 |
| 2026-08-03 | `jimbot-oakington-iii`=47, `jimCresswell`=14, `mantagen`=12, `emgeebot-oakenfold`=10 |
| 2026-08-10 | `jimbot-oakington-iii`=33, `jimCresswell`=8, `mantagen`=3 |
| 2026-08-17 | `jimbot-oakington-iii`=8, `mantagen`=7, `emgeebot-oakenfold`=1 |
| 2026-08-24 | *(nobody)* |
| 2026-08-31 | *(nobody)* |

**In the arc's best week, an agent seat performed 97% of the merges (133 of 137).** No
human ever exceeded 57 in a week, and in the last active week the two bypass-capable
humans managed 7 between them.

The seats stood down on 2026-08-21 at 15:55:50Z (comms event `8fbf07fa`, the owner-liaison
closeout). **Throughput went to zero the same day** — not degraded, zero, because the
gate marks everything BLOCKED and no bypass actor was working the queue.

Name for the mechanism, which the estate did not previously have:

> **An embodied capability.** A delivery capability that lives in a live seat's
> privileges rather than in a service, a workflow, or a documented human duty. It
> presents as institutional capacity while the seat is running and vanishes without
> warning when the seat retires, because nothing names it as a thing that can be absent.

Approval volume tells the same story from the other side. Approvals per week — 13, 14,
55, 12, 14, **0**, **0** — never came close to the merge rate, which is the arithmetic
proof that merges were not flowing through approval at all. And `CHANGES_REQUESTED` went
0, 0, 25, 5, **27**: in the final active week, blocking reviews outnumbered approvals
two to one.

Two further degradations compounded it, both partly outside the estate's control: the
`claude` reviewer began reporting "your organization's overage spend limit has been
reached" from 13 August, and `chatgpt-codex-connector` reported "Codex usage limits have
been reached" from 18 August. Automated review volume decayed 51 → 38 → 4 across those
weeks. First-review latency, though, stayed at a **0.0-hour median throughout, and every
one of the 34 non-draft open PRs has had at least one review** — so the estate has
abundant *review* and no *approval*. Those are different goods and the pipeline only ever
metered one of them.

### L3 — Process root: work-in-progress was never bounded against merge capacity

PR creation ran at 100–169 per week, sustained by the same fleet that was merging them.
Production and clearance were coupled *only* because one population did both. Nothing
measured inventory, nothing bounded it, and no seat owned it.

The estate has a claims registry, a commit queue, heartbeats, and a Director role — all
of which coordinate *who is working on what*. **None of them models the queue of
finished-but-unlanded work.** So a 34-item inventory, 29 items of it over a week old,
accrued without ever tripping a signal. The board did not show it either: those PRs' tickets
read `In Review`, which is accurate and yet indistinguishable from "waiting for a reviewer
who is never coming".

### L4 — Meta root: the coordination substrate models agents, and humans are invisible to it

The estate's coordination machinery is unusually well developed — `active-claims.json`,
the comms event stream, PDR-027 identities, liveness heartbeats, the Director/Implementer
contract, ~40 always-applied rules. **Every one of these surfaces models agents.** Humans
do not appear in the claims registry, emit no heartbeat, are not visible on the comms
stream, and their pull requests are not sequenced by any of it.

At a one-human / N-agent topology that was complete, because the human was the *operator*
of the system rather than a participant in it. At M-humans / N-agents the humans became
participants the system cannot see, and every coordination guarantee silently became
partial — without any surface reporting the change.

This is where the interdependency failures come from, and they are the same defect wearing
different clothes:

- **MCP-641** ("Remove the www `/mcp*` edge carve-out") declared three blockers —
  MCP-638, MCP-639, MCP-640 — and states in its own body that MCP-640's leg is *"the one
  irreversible step in the whole move"* and that removing the carve-out early *"breaks
  installed clients with no warning."* Its state history holds exactly one entry: `Backlog`,
  never left. The removal happened anyway (Cloud-Config #561, merged 2026-08-21T14:04:43Z,
  correctly and deliberately) while two blockers were open. A blocking relationship the
  seats had authored well was not a control, because **no mechanism reads the board when no
  seat is sitting**.
- **Cloud-Config is not a Practice estate at all**, so the arc's single most consequential
  change occurred entirely outside the coordination surface, with no claim, no comms event,
  and no ticket transition.
- **Cross-repo sequencing had no home.** OWA #4454 creates `/mcp`; OWA #4459 links to it;
  the ecosystem PRs repoint clients at the new host. The correct order was recorded in
  prose in a PR description and nowhere machine-readable. `/mcp` has returned **404**
  since the carve-out came off — measured 2026-09-01: `www…/mcp` → 404,
  `www…/mcp/healthz` → 404, control `mcp.thenational.academy/mcp/healthz` → 200.

Stopping here: the next "why" — vendor spend limits, GitHub's ruleset semantics — leaves
the estate's control.

---

## Counterfactual test

**When could this have gone right, and what did the cured segment cost?**

The strongest counterfactual is a segment of the same arc under the cured process: the
week of **27 July**. 143 PRs created, 137 merged, clearance **0.96**, `jimbot` merging
133 of them, **14 human approvals**, **zero** changes-requested.

- Cured segment: roughly **one human touch per ten merges**, and the queue cleared weekly.
- Uncured segment (17 Aug onward): human attention consumed at a *higher* absolute rate —
  27 blocking reviews in the week of 17 August, plus this session's whole audit — for
  **zero** merges.

The uncured process is not merely slower. It costs more human attention per unit of
delivered work, and delivers none.

**The single decisive intervention** would have been to treat the 21 August stand-down as
a capability handover rather than a seat closing: name the merge engine as a capability,
identify that it was about to become absent, and either keep one bypass-capable actor
working the queue or drain the queue before standing down. The fleet's own closeout
discipline is thorough about *knowledge* loss and silent about *capability* loss.

---

## Honest credit

What the twelve days actually bought, stated plainly:

- **Genuine engineering value, all of it real and all of it unmerged**: three measured
  security reviews (#931, #932, #934), two ADR corrections against disproven premises
  (#922, #924), the F-166 spawn-upstream footgun cured with a positional-argument test
  (#927), the landing-page teardown (#928), host-topology truing (#936), and the
  served-URL allowlist (#935).
- **The diagnosis was correct and early.** Commit `ca80bbac1` (20 Aug) measured, with the
  reference implementation's own `selectResourceURL`, that *"a conforming client dialling
  www cannot authorise"*, established that the PRM is host-independent, recorded that
  *"the re-point was always unavoidable"*, and withdrew a wrong revert recommendation after
  the owner caught it with one question. That is the practice working well.
- **The cure was built the next morning** (#930, 21 Aug), including the fix to the test
  constant that had been pinning the defect.
- **Knowledge was preserved deliberately** (#923, #929) rather than lost.

The credit does not excuse the price. Every item above is stranded behind the same freeze,
and the diagnosis being unreachable from `main` is precisely why two later authors rebuilt
the same fix. **The arc's failure mode is not that work was not done. It is that finished,
correct work could not land, and its invisibility caused it to be done again.**

---

## Proposals

Each carries its warrant, its falsifier, and its PDR-130 lane.

### P1 · Name the merge engine as a capability with an explicit holder — SLOW LANE

Delivery throughput must be an assignable, observable role rather than an emergent
property of whoever happens to hold bypass. Concretely: a named `merge-warden` duty in the
claims registry with a declared holder at all times, and a stand-down protocol that
refuses to complete while the queue is non-empty and no successor holds the duty.

- **Warrant**: 133 of 137 merges in the arc's best week were performed by one agent seat;
  throughput hit exactly zero on the day that seat retired, with no signal emitted.
- **Prediction**: no future week records zero merges while non-draft mergeable PRs exist.
- **Falsifier**: a week passes with a named merge-warden in post and a non-empty mergeable
  queue that still does not clear — in which case the constraint is capacity, not ownership,
  and P2 is the live cure instead.
- **Review date**: 2026-12-01.

### P2 · Bound work-in-progress against measured merge capacity — SLOW LANE

Agent PR production must be sized to the clearance rate actually observed, not to what the
fleet can author. A standing inventory signal (count and age of non-draft mergeable PRs)
becomes a first-class surface, and crossing a threshold routes to the owner as a blocker
rather than accruing silently.

- **Warrant**: 34 non-draft PRs, 29 of them over a week old, accrued without tripping any
  signal; the board rendered them all as `In Review`, which is accurate and useless.
- **Prediction**: the non-draft queue's 90th-percentile age stays under 7 days.
- **Falsifier**: the signal fires repeatedly and is routinely acknowledged-and-ignored,
  which would make it ceremony rather than a control.
- **Review date**: 2026-12-01.

### P3 · Model humans in the coordination substrate, or state explicitly that it does not — SLOW LANE

The substrate's guarantees are advertised without qualification and hold only for agents.
Either humans gain minimal presence (a claim row for a lane a human is working, so agents
can see it), or every coordination surface carries an explicit boundary statement naming
what it does not cover.

- **Warrant**: at 1-human/N-agents coordination was complete; at M-humans/N-agents,
  three authors independently rebuilt one fix and an irreversible edge change landed with
  two declared blockers open — none of it visible to any coordination surface.
- **Prediction**: no future instance of two authors independently building the same fix.
- **Falsifier**: humans decline to participate in the substrate — a legitimate outcome,
  which converts this into the documentation half rather than the presence half.
- **Review date**: 2026-12-01.

### P4 · One source for the published endpoint, with generated consumers — FAST LANE

A tracked constant module owns the client-facing MCP endpoint (tracked, not env: it is a
published value and must be reviewable in git). The five consuming artefacts are generated
from it at build time, `CANONICAL_HOST` is cross-checked against it at startup so server
self-description and client advertisement cannot diverge, and a validator reddens on any
hardcoded MCP endpoint outside the generated set.

- **Warrant**: 97 files hold the literal; the estate's only named constant for it lives in
  a test file that declares itself the authority; the same fix was built three times.
- **Prediction**: the next host change is one line plus `pnpm build`, and no sweep PR is
  raised.
- **Falsifier**: the validator produces false positives on legitimate historical records
  often enough to be suppressed.
- **Home**: the repo already runs this exact pattern for the SDK, and
  `validate-mcp-content-current-source` is the nearest sibling validator.

### P5 · A test that pins a literal must derive it or declare itself the source — FAST LANE

`plugin-mcp-server-binding.integration.test.ts` was green for eleven days while asserting
the wrong host, because it defined the wrong value as `CANONICAL_MCP_ENDPOINT` and checked
the artefact matched. This is the estate's own "describe a system state, never ratify an
implementation choice" doctrine failing at a value boundary rather than a behaviour one.

- **Warrant**: the single instance above, where the test was the *only* guard on a
  user-facing binding and it agreed with the defect.
- **Prediction**: no future guard on a published value asserts a locally-defined literal.
- **Falsifier**: the rule cannot be stated without also forbidding legitimate
  self-declared-source tests, of which this repo has several by design.

### P6 · Cross-repo sequencing needs a machine-readable home — SLOW LANE

Ordering constraints that span repositories currently live in PR prose. Cloud-Config sits
outside the Practice entirely. At minimum, a declared cross-repo dependency edge that a
gate can read before a merge that would break another repo's surface.

- **Warrant**: `/mcp` has been a 404 for eleven days because three repos' work landed in
  the wrong order, with the correct order recorded only in prose.
- **Prediction**: no future cross-repo change strands a published surface.
- **Falsifier**: the mechanism is bypassed under time pressure on its first real test.
- **Review date**: 2026-12-01.

---

## Success test for this record

Per the retrospective skill: this has paid its way only if a proposal graduates, kills, or
changes a decision, or the causal stack names a mechanism the estate lacked words for.

It names one — **the embodied capability** (L2) — and that naming is the record's primary
contribution, because it generalises well beyond merging: any capability held in a live
seat's privileges rather than in a service will present as institutional capacity and
disappear without a signal. The proposals are routed above and are not yet decided; the
owner's word converts them.

---

## Addendum policy

New understanding amends this record additively — an addendum, never a rewrite. Two claims
here are explicitly unverified and should be corrected in place if measured otherwise:
whether the automated reviewers' spend limits have since been lifted, and whether the
27 August–1 September zero-merge weeks have any cause beyond the fleet's absence and the
owner's stated leave.

---

## Addendum 1 (2026-09-01, same session) — P1 was underspecified: "warden" is not a human

The owner's first question on reading P1 was *"a merge-warden? do you mean a human?"* The
proposal as written did not say, and the omission mattered enough to correct here rather
than silently.

**The answer is no, and forcing it to be a human would make the freeze worse rather than
better.** The arc's own numbers rule it out: human merge throughput peaked at 57 in a week
and typically ran 3–19, against a fleet authoring 100–169 PRs per week. A human warden is
a throttle, not a cure — it reproduces this queue by construction.

**But an unrestricted agent warden is no longer right either, and that is the legitimate
half of the question.** In July, an agent merging agent-authored work under an Integration
bypass was safe *because one engineer was the only other person in the codebase*. With
several human collaborators now sharing it, the same arrangement means agent-authored
product changes land without any human having approved them. That is a genuinely different
risk, and it changed when the topology changed — the same L4 shift that produced every
other failure in this arc.

**So the duty splits by risk class, not by actor.** Composition of the stuck queue,
recomputed at writing time over the 34 non-draft open PRs:

| Class | Count | Exemplars |
|---|---|---|
| `docs` / `chore` | 15 | #908, #910, #913, #921, #922, #923, #924, #929, #931, #932, #933, #934, #936 |
| `feat` | 7 | #892, #895, #905, #912, #919, #925, #945 |
| `fix` | 7 | #891, #911, #927, #930, #935, #940, #944 |
| `build(deps)` | 2 | #941, #942 |
| `refactor` | 2 | #890, #928 |
| untyped | 1 | #761 |

And product-code footprint, measured per PR (files under `apps/` or `packages/` as a
fraction of the diff):

- **Zero product files**: #911, #921, #924, #927, #930, #935, #940 — all `fix`/`docs`,
  none touching shipped code.
- **Mostly or wholly product code**: #928 (90 of 105), #936 (10 of 10), #933 (4 of 4).
- **Mixed**: #922 (2 of 5), #925 (2 of 11).

So roughly two-thirds of the queue carries no product code at all. A risk-classed warden
would have cleared that two-thirds without a human touch, while still putting the
landing-page teardown (#928) and the host-topology change (#936) in front of a person.

### P1, amended

- **The duty is an agent's**, held continuously, with a declared holder in the claims
  registry — because that is the only actor class the evidence shows can sustain the rate.
- **The gate is risk-classed, not actor-classed.** Auto-clear when green: `docs`, `chore`,
  records, knowledge preservation, test-only changes, dependency floors, and any PR whose
  diff touches no `apps/` or `packages/` product code. Human approval required: any product
  code, and unconditionally anything touching auth, the edge, or a published surface.
- **The stand-down protocol is the actual cure**, and it is independent of who holds the
  duty: a seat cannot complete closeout while its class of the queue is non-empty and no
  successor holds the duty. The 21 August stand-down was clean by every existing
  discipline — knowledge conserved, claims closed, heartbeats stopped — and still took the
  estate's delivery capability with it, because no discipline names capability as a thing
  that can be handed over.

**Falsifier, amended**: if a risk-classed auto-clear lands a change that a human approval
would have caught, the classification boundary is wrong and must move — not the duty.

**What this changes about the record's L2 finding**: nothing. The mechanism (an embodied
capability) stands. What the addendum corrects is the assumption, latent in P1's wording,
that the cure for a capability held by an agent is to move it to a human. The cure is to
name it, class it, and require its handover.
