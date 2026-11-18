# Director Handoff — the upstream line's seat blocks, conserved at the 2026-09-15 sync

Conserved verbatim at the upstream sync of `c67d33c` into engraph (PR #147), 2026-09-15. The
upstream line (`oaknational/oak-open-curriculum-ecosystem`, `main`) added the blocks below to its
`director-handoff.md` between the merge base `216e64c15` and `c67d33c8a`. This line's handoff keeps
one live snapshot and archives what it replaces (its refresh contract), so these blocks are homed
here rather than in the live file. They describe the upstream line's Director seats — Kiln mends
Firelight, Civet calls Crypt, Kestrel weaves Downdraft — never this line's.

In the same window upstream re-labelled its 2026-09-02 #915 fold banner "SUPERSEDED BY THE
DIRECTOR-SEATED BANNERS ABOVE". This line archived that banner unchanged at
[`director-handoff-current-handoff-state-2026-09-08.md`](director-handoff-current-handoff-state-2026-09-08.md);
the re-label is recorded here, and that archive stays verbatim.

---

> # §SEAT LIVE — Kestrel weaves Downdraft (`24c921`, claude-opus-5), took the seat from cold 2026-09-13
>
> **Two Directors sat between Civet's block below and this one without refreshing this section.**
> Mackerel rides Brine (`529615`) recorded its tenure only in comms (`1feda95d`); Sloop spins
> Seabed (`9f30c5`) posted one event and nothing else. If you are reading Civet's block below as
> current state, it is ten days stale.
>
> ## The takeover signal that nearly fooled me, stated so it does not fool you
>
> **Four claims read `fresh` for a process that did not exist.** Mackerel's Director claim was
> `stale`, but four lane claims it opened read `fresh` minutes before I arrived. What settled it
> was the process table, not the registry: the only `claude` processes on the host had started
> _after_ those claims were written. **The registry cannot distinguish "recently written" from
> "currently held".** Add a process check to the readiness gate's liveness question; a fresh row
> is necessary evidence of liveness and nowhere near sufficient.
>
> ## What this seat landed
>
> Eight lane branches are pushed and every one is in sync with its remote, verified by
> `rev-list --left-right` per branch rather than by any gate's tick:
>
> - **#955** — the inherited mid-merge completed (`5aeaa755f`), then merged to _current_ main
>   (`3b43dab97`); it was still 27 behind because the inherited `MERGE_HEAD` was a 10-Sep tip.
> - **#963, #947** — review-thread cures committed, pushed, replied to as emgeebot and resolved.
>   Both PRs now have zero unresolved threads.
> - **#931, #932, #934, #935, #960** — the local, unpushed main-merges pushed. All 0 behind main.
> - **`de82bfb6c`** — three cross-references trued to the renumbered F-166 (see below).
>
> ## Three traps this seat hit, each of which will recur
>
> 1. **A green gate is not a landed artefact.** Four serial pushes printed
>    `✅ Pre-push checks completed!` and then 401'd; the remote never moved. The cause is a
>    credential race: the token is minted when git opens the connection, the ~10-minute pre-push
>    gate runs, and the token has expired by the time the pack is sent. **Long-gate pushes are
>    currently a coin flip** — #935 took three attempts, #932 three. Retry is the workaround; the
>    cure belongs in the credential helper's token lifetime. Always verify the remote ref.
> 2. **The commit skill prescribes a claim label its own guard cannot match.** It tells worktree
>    seats to claim `git:index/head@<worktree-name>`; `commit-queue/guard.ts:134` tests exact
>    array membership on `index/head`, so it never matches. `claims open` accepts the label and
>    `guard` then refuses the claim it just wrote. The only working spellings are the bare label —
>    which falsely asserts a window on the PRIMARY index — or no ceremony. The tool rewards the
>    mislabel. One-line predicate fix plus a test; it is a leaf.
> 3. **Two generated files were NUL-corrupted by an interrupted write.** `#932`'s worktree held
>    16,384 NUL bytes in each of two `oak-sdk-codegen` vocab `data.json` files — 16 KiB apiece,
>    the signature of a crash or OOM kill mid-write, matching this host's known crash and a
>    low-memory kill of this session's own comms watcher. It read at first glance like a
>    narrower-corpus codegen run; it was not. The corrupt artefacts are preserved in this
>    session's scratchpad, valid content restored from the committed blobs, and a sweep of all 40
>    worktrees found no other instance. **It was blocking #932's push** — the pre-push gate runs
>    against the working tree, so a dirty generated file fails the gate.
>
> ## Owner-gated, carried, and NOT discharged by this seat
>
> - **Four probe-created OAuth clients are live in the production Clerk IdP**, each with
>   `client_secret_expires_at: 0`. Find by `client_name: "probe-mcp674-recheck"`. Inherited from
>   Civet, still the highest-priority residue. **Owner cleanup.**
> - **Twelve PRs are green, thread-clean, and blocked solely on a code-owner approving review**:
>   #927 #928 #931 #932 #933 #934 #935 #947 #955 #960 #963 #975. This is the estate's actual
>   bottleneck and it is the same failure #947's own retrospective diagnoses.
> - **The one-implementer-at-a-time ruling (3 Sep)** was put to the owner for release, with ~10
>   disjoint lanes waiting. Unanswered; this seat stayed serial.
> - **The codeql-action pair** is committed-ready in `oak-codeql-action-4-37-9-pair` (pin verified:
>   tag `v4.37.9` → `cdf488f5…`). Raising it needs a leaf ticket and overrides the
>   "Dependabot owns github-actions bumps" doctrine, because Dependabot's split #941/#942 can
>   never go green. Put to the owner with a recommendation to mint and raise; unanswered.
> - **Two expired plan owner-decision gates** remain (Mackerel discharged six of the eight).

---

> # §SEAT WOUND DOWN AT OWNER WORD, 2026-09-03 ~17:0xZ (Civet calls Crypt, `2a5c71`, claude-opus-5)
>
> **THIS SUPERSEDES THE MOMENT-1 BLOCK BELOW.** Owner word, verbatim: _"OK i'm going to pick this
> stuff up next week. Please wind down your session now"_. **No successor is pre-positioned** — the
> owner is away until next week and there is no cast to hand to, so this is PDR-064's terminal case,
> not a two-moment handover. Claim `b5b2744b` closed at wind-down; heartbeat and watcher stopped.
> Whoever sits next takes the seat from cold using _How to take the Director seat_ above, and the
> readiness gate's liveness check will correctly show no live Director.
>
> ## What LANDED IN PRODUCTION this seat (the one thing that outlives the session)
>
> **The MCP dynamic-client-registration rate limit is LIVE on `mcp.thenational.academy`, and
> Cloud-Config #569 is MERGED.** Verified from post-apply Terraform state and from `main`, not from
> an apply message: rule `27eecff8`, enabled, `block` with a 429 JSON body, 20 requests/60s keyed on
> `[cf.colo.id, ip.src]`, `mitigation_timeout 60`. `main` line 128 carries byte-identical expression
> to what is live — no divergence. Full detail in comms `bad67c52`.
>
> **It closed a real hole.** Before this, `POST /oauth/register`, `/oauth/register/`,
> `/OAuth/register` and `/oauth/REGISTER` ALL returned **201 Created** and minted a usable
> production OAuth client — the case-sensitive path equality failed open onto a working client
> factory three days before publicity.
>
> ## Three inherited framings that are now FALSE — do not re-inherit them
>
> 1. **"#562 blocks EVERY apply in the `cloudflare-rulesets` workspace."** True only of an
>    UNTARGETED apply. Error 20014 is raised by `cloudflare_ruleset.http_request_firewall_managed`
>    (`firewall_managed_rules.tf`), a different resource from `cloudflare_ruleset.http_ratelimit`.
>    A `-target` apply on the rate-limit resource ran clean with #562 still open. #562 is deferred to
>    next week at owner word and is **`APPROVED` and merely `BEHIND`** — a branch update and a merge,
>    NOT a review round. This seat told the owner it needed review on a stale 13:20Z reading; he
>    deferred it on that basis. Correct the basis when it is picked up.
> 2. **"Green CI covers the rate-limit expression."** It never did. `terraform validate` and all
>    three checks treat `expression` as an opaque string. Cloudflare validates wirefilter
>    server-side at write time, so **a successful apply is the only proof the expression parses**.
> 3. **`-target` does not protect a nested block.** `cloudflare_ruleset` holds rules as nested
>    blocks, so any apply of that resource rewrites the whole rules list. Targeting isolates
>    resources, never sibling rules.
>
> ## THE HAZARD THAT NEARLY COST SOMETHING, stated as a standing lesson
>
> **A `-target` plan on a `cloudflare_ruleset` must be read RULE BY RULE, never by its summary
> count.** The plan read `0 to add, 1 to change, 0 to destroy` — which looks like "append my rule"
> and was in fact a silent in-place overwrite of a DIFFERENT rule. Terraform index-matches nested
> blocks by POSITION: config's rule 3 (the new MCP rule) matched live's rule 3, a hand-made
> `"Downloads api"` rule created in the Cloudflare dashboard on 2026-03-25, absent from config AND
> from stored state. **The owner caught this from the plan output and stopped to ask.** Disposition
> at his word: deliberately let go — it was disabled, and its traffic is already covered by live
> rule 1 (`path contains "api/downloads/"`, 30/60s, `managed_challenge`, no lockout), so its 24-hour
> block was the harsher twin practice had already rejected. Its full definition is conserved in
> comms `bad67c52` — where its action, threshold, period and characteristics are marked **INFERRED,
> not measured**: they were derived from the plan listing them as unchanged against the MCP rule's
> own values. Only its description, `enabled`, expression, `mitigation_timeout` and
> `requests_to_origin` were read directly.
>
> ## OWED, and none of it is discharged
>
> - **Four probe-created OAuth clients are LIVE in the production IdP**, each with
>   `client_secret_expires_at: 0` — a secret that never expires. **Find them in Clerk by
>   `client_name: "probe-mcp674-recheck"`** and by `redirect_uris: ["ftp://not-a-valid-redirect"]`;
>   that name is the durable handle deliberately recorded here INSTEAD of the client ids, which are
>   identifiers of live production credentials, went to the owner directly, and become stale the
>   moment the clients are deleted. **Owner cleanup. This is the highest-priority residue.**
> - **Owed by this seat and not done: trace wherever else `928977d`'s "a probe creates no client"
>   claim was relayed.** It reached an implementer as a method and cost the four clients; it may
>   have been repeated in earlier handovers, seat briefs or comms events. Promised to Kiln mends
>   Firelight at handover and forwarded here rather than dropped.
> - **A false safety claim is LIVE on `main`** at `rate_limits.tf` lines 55–56 (from `928977d`):
>   _"validation precedes the upstream fetch, so a probe creates no client"_. True only for a
>   MALFORMED body. It reached an implementer as a **method** and cost the four clients above.
>   Corrected prose is drafted but **unconserved outside a scratchpad** — see the loss note below.
>   Landing it is a one-leaf follow-up PR.
> - **Out-of-band zone drift is unaudited.** Something creates rules in `thenational.academy` by
>   hand. This one surfaced only because it collided with a new rule; nothing has measured the rest.
>   Worth a sweep before publicity, not after.
> - **#928** remains owner-held past publicity; **#913** is a human merge decision; **#927** (the
>   `agent-tools spawn` no-upstream footgun) is still open and still load-bearing.
> - **Six expired plan owner-decision gates** and the owner-gated items Kiln listed below are
>   untouched by this seat, except MCP-517, whose root cause the removed alias retired.
>
> ## The mistake this seat made, recorded because the next seat will be tempted the same way
>
> **This seat caused the four-client incident.** It measured with `redirect_uris:
> ["not-a-valid-uri"]` — no scheme, not a URI, rejected 400 before anything was created — then
> briefed an implementer to re-probe with "a deliberately invalid body, **as before**" **without
> giving the string**. The implementer reasonably chose `ftp://not-a-valid-redirect`, a syntactically
> valid URI, and Clerk accepted all four. **A method relayed without the detail that made it safe.**
> That is the same class as the shelf-life failure this seat inherited from two predecessors on the
> same day, reproduced inside its first hour of authority. The implementer stopped, refused to adjust
> the comment to fit, and reported — which is the behaviour that contained it.
>
> **Second, smaller:** this seat opened "Do not apply this" on the plan output alone, then had to
> soften it once the config check showed the overwritten rule was disabled drift. The stop was the
> right instinct; the severity was asserted one measurement early.
>
> ## Fleet and mechanics at wind-down
>
> Fleet is **empty**. Kiln mends Firelight closed out (`34245439`) with zero claims. Willow holds
> Compost closed 2026-09-02. One dispatched implementer did the #569 work and was stopped by the
> owner by accident after it had completed its push; it is not resumable. Its drafts survive only in
> a session-scoped scratchpad.
>
> **F-166's adjacent mechanism, which will bite the next handover:** a correctly-conducted PDR-064
> handover ALWAYS emits `HEARTBEAT-COMMS-LEG-FAILED` between the successor's claim adoption and the
> predecessor's stop, because a heartbeat may not anchor to another seat's claim. The loudest signal
> in a clean handover is a false alarm. (Recorded as F-161 at the time; renumbered F-166 at the
> convergence merge, where main already held an F-161.)
>
> **Watcher note:** the all-channels watcher died once on `step "drain" exceeded 60000ms` and needed
> re-arming at `--step-timeout-ms 300000`. Kiln's died the same way at 120000ms. On a comms directory
> this size, the default deadline is not survivable — arm it raised from the start.
>
> _Wound down at owner word, 2026-09-03. Comms trail: `9653d19e` (standby), `0d150e2d` (Moment 2),
> `8ee10126` (rulings + incident), `bad67c52` (production landing), plus this seat's closeout._

---

> # §HANDOVER TO CIVET CALLS CRYPT (`2a5c71`) — PDR-064 MOMENT 1, 2026-09-03 ~13:1xZ, AT OWNER WORD
>
> **Kiln mends Firelight (`3b47e6`) is standing down.** Claim to adopt: **`b5b2744b-27df-416f-8389-71a6e83915e2`**,
> role `director`, thread `mcp-submission-drive`. Authority transfers at the successor's Moment 2,
> not on this block. My heartbeat runs until then — the seat does not go dark between the moments.
>
> **No separate handoff record.** This is PDR-063 §Deliberate succession, not budget-driven
> retirement: the lane is at rest (no in-flight edits, every dispatched sub-agent reported and
> stood down), and the successor arrived fully rehydrated and asked explicitly for a thin Moment 1.
> **This banner is the record.** Two unstaged files carry it — this file and
> `frictions-register.md` — batching into a later PR per the owner's 2026-07-15 ruling, never a
> dedicated handover PR.
>
> ## THE ONE THING THAT MATTERS MOST: the pre-publish surface is no longer in this repo
>
> **Zero pre-publish PRs are open here** — control-probed, because the label still matches the
> three that merged (#950, #949, #892), so it is a true zero and not a broken filter. A full pass
> over all 32 open PRs found exactly two pre-publish, and both have landed. Publicity is
> **2026-09-06**.
>
> **What is left, in dependency order, and it is all outside this codebase:**
>
> 1. **Cloud-Config #562 must merge FIRST.** It is the owner's own revert of #558, open since
>    2026-08-21. Until it lands, **any** apply in the `cloudflare-rulesets` workspace fails on
>    Cloudflare error **20014** — two rules executing the same managed ruleset, which Cloudflare
>    permits one of per phase. This blocks every other Cloudflare change, and an earlier agent read
>    the plan as merely "2 to change" without knowing the apply is refused outright.
> 2. **Cloud-Config #569** — the `/oauth/register` rate limit (MCP-674, `In Progress`). Review →
>    merge → **apply**, behind #562.
> 3. **OWA #4454** — the `/mcp` landing page, `CHANGES_REQUESTED`, owner-driven. Merging it also
>    makes the live privacy policy's ten `www.thenational.academy/mcp` links resolve instead of 404.
> 4. **Aakesh:** the privacy-policy retention line (no MCP retention period is published at all —
>    UK GDPR Art 13(2)(a)), the DPIA cluster, #4454's install-steps copy, and the OpenAI
>    submission's endpoint host.
>
> ## Awaiting review, green, not pre-publish
>
> **#963** (WAF-block runbook scenario), **#955** (the owner's one-PR-per-leaf rule, opening
> rewritten as rule prose with his ruling preserved verbatim under §Origin), **#960** (runtime
> topology diagram — **now safe to review**, the removed-alias correction landed).
>
> **Restorer residue this seat owned, per Willow's closeout assignment:** **#927** open and
> load-bearing — it fixes the `agent-tools spawn` no-upstream footgun that bit two lanes today;
> **#928** owner-held past publicity, and **the hold is now visible on the PR itself** rather than
> living only in a dead session's notes; **#913** human merge decision. #892 and #949 merged.
>
> ## Owner rulings today — recorded so the successor never re-asks
>
> The 10:17Z burst that closed nine PRs and deleted their branches was **intended** (commits
> survive at `refs/pull/<n>/head`). **One** implementer at a time, not two. The content-workspace
> owner gate is **lifted**, and MCP-103 is **off the pre-publish path** at Medium. Publicity is
> **Claude-first; ChatGPT is post-publicity**, which de-labelled MCP-623. `oak-skills` is private,
> so MCP-680 is post-publish. The `mcp.thenational.academy/` → `www…/mcp` redirect is **parked
> awaiting Aakesh** and must sequence behind #4454 (its four acceptance probes are recorded below).
> MCP-271 closed with its DCR register **dispositioned** rather than a mitigation claim — the rate
> limit is authored-not-applied, and consent-phishing is knowingly accepted for the beta because a
> volume limit does not touch it.
>
> ## The alias is gone, and it retired more than itself
>
> The owner removed `curriculum-mcp-alpha.oaknational.dev` today — DNS record and Vercel domain
> both, verified. That **structurally retired MCP-517's root cause** and made its acceptance probe
> unrunnable (it targets a URL that now 404s), so MCP-517 is re-scoped with its forensic record
> preserved in full. **MCP-522 carries the part that outlives the alias**: wherever `CANONICAL_HOST`
> is unset, Clerk derives its origin from a **client-supplied** `x-forwarded-host`.
>
> ## Two corrections to this seat's own reporting, inherited deliberately
>
> **I read a 30-day aggregate as a present-tense fact** and warned the owner the alias was carrying
> live production traffic including real users. The 24-hour window showed **zero** `Claude-User`
> traffic — it was historical. That is the shelf-life failure my own predecessor handed me at this
> seat's start, made again on my own measurement.
>
> **And the M11 alarm was unfounded.** MCP-144 is a Backlog tracking ticket for **externally-owned**
> review that has never started, so "compliance sign-off dated tomorrow, blocked on MCP-103" was
> never a commitment this repo could miss. It reached the owner through two handoffs and I relayed
> it before checking.
>
> ## Alerting, measured today — read before touching MCP-544
>
> **One** enabled Sentry alert (`758827`, "MCP production — new issue" → Slack
> `#mcp-alerts-sentry-prod`, production-scoped) and **zero metric rules**. Nothing watches for the
> service being down, for error rate, or for latency. **A Cloudflare block never reaches the app**,
> so it appears in no Oak instrument at all. And ~1,430 spec-mandated protocol-version rejections
> are **99% of current error volume**, so any threshold set from today's numbers is calibrated
> against noise — which is why the owner deliberately sequenced alerting _after_ the security and
> routing picture settles. A product-facing plain-language account is a Linear document on the
> project: _"What we get told when the MCP app breaks"_.
>
> ## Standing constraints still binding
>
> Route anything owner-needing the **same day** it is discovered, never batched. The Director
> **routes, does not execute** — my predecessor broke this and the owner caught it; I dispatched
> read-only reviewers and implementers rather than editing. `agent-tools spawn` sets a lane's
> upstream to `origin/main`, so **`git branch --unset-upstream` after every spawn** until #927
> lands, and it does not carry `.env.local`. This is a **shared primary checkout** on
> `docs/one-pr-per-leaf-issue` — no branch switching, explicit pathspec only. `emgeebot` cannot
> write to Cloud-Config, OWA or `oak-skills` (its installation covers this repo alone, measured
> repeatedly) and **cannot dispatch workflows** (`actions:write` absent — the conformance run needs
> the owner). Reviews and approvals go under the owner's account; everything else under emgeebot.
>
> _Moment 1 by Kiln mends Firelight (`3b47e6`) at the owner's word, 2026-09-03. The successor
> re-runs the mechanical liveness check and pastes it at Moment 2._

---
> **§DIRECTOR SEATED, 2026-09-02 ~15:30Z (Kiln mends Firelight, `3b47e6`, claude-opus-5) —
> THIS SUPERSEDES THE FOLD BANNER BELOW, WHOSE "NO DIRECTOR IS SEATED" LINE IS NOW FALSE.**
> Seated at PDR-064 Moment 2 (`f910eba6`) from **Pinnace hunts Delta** (`2f1935`), whose Moment 1
> was `76f3b319`, at owner word. Claim **`b5b2744b`** ADOPTED in place, role `director`, thread
> `mcp-submission-drive`. Readiness gate passed with the mechanical check pasted; premise
> recomputed, not just ownership. Heartbeat armed 16:02Z (both legs, `heartbeat_at` recomputed off
> the claim row) — it was legitimately absent until a peer arrived under the PDR-078 §4
> consumer-absent exemption. Handoff record (instance-tier, untracked, disk only):
> `.agent/state/collaboration/handoffs/2026-09-02-pinnace-hunts-delta-to-kiln-mends-firelight.md`.
>
> **~~A STALE ROW A SUCCESSOR MUST NOT MISREAD~~ — STRUCK 2026-09-03, THE LINE ITSELF WENT STALE.**
> This banner said Tulip mends Bark's claim `39718d8d` was still open and its disposition owed. It
> is **not in the registry**: this seat closed and archived it earlier the same session as registry
> hygiene, and then failed to update this line. Caught by the incoming Director at its arrival
> grounding. `claims active-agents` is the truth; this banner is not. **A successor should chase
> nothing here.**
>
> **THE SEAT IS NOT THE OWNER INTERFACE'S RELAY ANY MORE — it IS the owner interface.** The
> `mcp-submission-drive` thread record still names Raven turns Nocturne (`0aad1a`) as a LIVE
> liaison and instructs routing through it. That is FALSE: the liaison seat has been superseded
> twice and is down (last comms event of the old fleet, `8fbf07fa`, 2026-08-21T15:55:50Z). PDR-117's
> normal case applies — the Director is the single owner interface directly.
>
> **LIVE FLEET AT THIS WRITING (one peer):** **Willow holds Compost** (`3a2054`, copilot-cli),
> claim `dcbefb47`, role `reviewer` — the PR Review Warden, on worktree
> `oak-pr-review-warden-gpt5` / branch `chore/pr-review-warden-gpt5`, holding a **21-PR**
> `review-requested:mantagen` queue (independently measured by both seats). Its seat brief is
> revision 3 at `.agent/state/collaboration/handoffs/pr-review-warden-seat-brief.md` (untracked).
> Two implementer lanes were dispatched and have reported: OWA #4454's review findings (landed,
> `b390edc289`) and MCP-103's content workspace (step zero done, awaiting an owner ruling).
>
> **OWNER RULINGS TODAY — recorded so no successor re-asks:** (1) the 10:17Z burst that closed
> nine PRs unmerged and deleted their branches — **INTENDED, leave them closed**; their commits
> survive at `refs/pull/<n>/head`. (2) **One** implementer on the 22-ticket triage, not two — the
> critical path is owner-gated. (3) **The content-workspace owner gate is LIFTED** (it previously
> read _"research EXECUTION and the content-workspace build stay owner-gated — do not auto-start"_
> in `repo-continuity.md`); MCP-103 has a lane as of today. (4) MCP-549, MCP-292 and MCP-306 closed
> Done on re-measured evidence; **MCP-444 deliberately NOT closed** — its own definition of done
> requires each of 25 suggestions visibly dispositioned by its field owner, it is Aakesh's ticket,
> and "the submission was sent" does not meet that bar. (5) MCP-415 closes when MCP-143 clears
> review, which turns on three owner rulings, not on any work.
>
> **STILL OWNER-GATED, all minutes each, none discharged by this seat:** MCP-517's cookie-deletion
> browser test (the last unproven acceptance limb in the auth cluster — no agent can run it, every
> guard here runs unauthenticated); MCP-665's five Cloudflare ray IDs; three rulings on MCP-143;
> and **six expired plan owner-decision gates**, of which `production-liveness-detection` must be
> separated from the other five because its gate is **MCP-614's AC3, the release's alerting leg**.
> These were INHERITED, not surfaced by the prior seat.
>
> **THE DATED FACT THAT GOVERNS EVERYTHING:** public-beta publicity is **2026-09-06**. M11's
> compliance sign-off is dated **2026-09-03** and is blocked on MCP-103. The owner's standing rule
> is that anything needing him routes the **same day it is discovered, never batched** — an item
> held to Friday afternoon costs nine days.
>
> **TWO LESSONS THE PRIOR SEAT PAID FOR AND STATED AGAINST ITS OWN INTEREST — inherit them.**
> First, _the Director routes; it does not execute_: Pinnace authored PR #955's rule itself instead
> of seating an implementer, the owner caught it (_"Ah thought that would have been an agent"_), and
> the tell each time was that executing felt efficient. Second, _a measured fact acquires a shelf
> life the moment it is relayed_: "twelve days, zero merges" was true at measurement and false when
> restated hours later — the freeze broke 2026-09-02 with five merges, and `origin/main` moved three
> times during this session's own handover (`e6d8d91b9` → `a3bf6ef09`, `v1.176.3`). PR #947 is owed
> an addendum for the first of those.
>
> **SHARED-CHECKOUT CONSTRAINT:** this seat and its predecessor occupy the SAME primary checkout,
> not separate worktrees, currently on `docs/one-pr-per-leaf-issue` (PR #955). No seat switches
> branches out from under another; staging is by explicit pathspec only; a lane wanting a clean tree
> spawns a worktree with `agent-tools spawn`, never raw `git worktree add`.
>
> **TOOLING FOOTGUN, TWO INDEPENDENT INSTANCES TODAY:** `agent-tools spawn` sets a new lane
> branch's upstream to `origin/main`, so a bare push would target `main`. Cure is
> `git branch --unset-upstream`, verified. The fix is **PR #927**, unmerged and in the review queue —
> it is routed as the warden's first item for that reason. Spawn also does not carry `.env.local`,
> and one lane saw its turbo build corrupt a generated `graph-corpus/data.json` into a single line,
> presenting as a content defect in an unrelated validator.
>
> **QUEUE RESIDUE CLEARED 2026-09-03, and read the rest of the queue correctly.** An expired
> `staging` entry (`intent e1562324`, subject _"docs(architecture): measured runtime topology for
> the MCP service"_) sat orphaned under THIS seat's identity — a dispatched sub-agent queued it,
> because a sub-agent shares its parent's PDR-027 identity and cannot hold a distinguishable one.
> The work had landed as PR **#960** / `6c5a7f4ba`; the entry was pure residue and is now completed.
> **The remaining 17 entries are ALL `abandoned`, dating back to 2026-08-03** — accumulated
> commit-warden hygiene that nobody has held since the fleet stood down. Zero non-abandoned entries
> remain, so the queue carries no live contention and must not be read as a claim signal.
>
> **F-166 RECORDED — this seat's own registry-staleness, and it is a tooling gap not a lapse.**
> (Recorded as F-161 at the time; renumbered F-166 at the convergence merge.) The
> heartbeat was correctly stood down under the PDR-078 §4 consumer-absent exemption when the only
> peer closed out, and the registry then read this claim `stale` for ~17 hours of live work. **The
> exemption has a suspend condition and no resume condition** — nothing fires when a consumer
> reappears, and the seat that suspends the heartbeat is precisely the seat that stops looking.
> Caught by the incoming Director, not by this seat. Interim discipline for anyone applying the
> exemption: treat a peer's team-start as a re-arm trigger and re-check the premise at every
> fleet-composition change. Heartbeat re-armed 13:0xZ and runs until the successor's Moment 2.
>
> **PARKED, AWAITING AAKESH (owner, 2026-09-03):** `https://mcp.thenational.academy/` should redirect to
> `www.thenational.academy/mcp`. **Correct change, wrong order today** — measured 2026-09-03: the canonical
> root serves a working 58KB landing page (200), while the target `www/mcp` returns **404** and OWA
> **#4454** is still OPEN with `CHANGES_REQUESTED`. Shipping the redirect now would send visitors from a
> working page to a 404. Sequence it behind #4454's merge. Recommended home is a Cloudflare redirect rule
> in the `thenational.academy` zone (Terraform-managed, so a real Cloud-Config PR) rather than the app, so
> it survives #928 removing the app's HTML surface. **The whole risk is precision:** the rule must match the
> root path EXACTLY, or it takes the connector and discovery down with it — `/mcp` (406), `/healthz` (200),
> `/.well-known/oauth-protected-resource/mcp` (200) and `/.well-known/oauth-authorization-server` (200) are
> the four acceptance probes. No ticket minted yet, deliberately: the owner said come back to it.
>
> **THIS BANNER IS PENDING-BATCH, NOT UNCOMMITTED BY ACCIDENT.** Handover artefacts on tracked
> surfaces land BATCHED into the next substantive or consolidation PR — never a dedicated handover
> branch or PR (owner ruling 2026-07-15) — and it must not ride #955, which is a single-leaf
> doctrine PR under the very rule it lands. The fold banner below is the prior state.

---
