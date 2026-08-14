# MCP App: Project Update

23 July to 11 August 2026

**Published as the Linear project update on 2026-08-11** (the previous update was 23 July). One claim was falsified in flight and made true the same day: the dependency-advisory wave of 4–7 August was cleared (MCP-549 Done — production audit clean, Dependabot zero, one owner-accepted dev-only residual).

---

## The Headline

At the last report (23rd July) we had a working private alpha with a manual install. Nineteen days later the app is in **public beta**, though setup is still manual. The one-click routes are with Anthropic: **the connector (the MCP app) was submitted on Friday 7 August** and the **plugin (the MCP app plus skills) on 10 August** — neither is live until accepted. Every piece of content an AI assistant might read from us is **audited, registered, and governed**. The staged path the last update promised — private beta September, public beta October — has been beaten by weeks.

## What Happened, Why It Matters

### 1. The app crossed from alpha to submission-ready

Four things shipped. The public landing page went live, carrying Oak brand assets, linked terms and privacy, an experimental-service disclaimer, public-beta copy and sign-in. The submission package went out with every claim checked — an unsupported rate-limit figure was found and withdrawn rather than shipped. The plugin was streamlined to the ratified seven components. We hardened sign-in and security.

### 2. "How we will know" is now instrumented, not promised

The previous update promised privacy-safe usage statistics. Since then the whole measurement chain shipped: a closed analytics adapter (only declared events can ever be sent), scoped pseudonyms (no user identifiers leave the app), a transport observer on the MCP surface, and a five-year retention decision recorded with the privacy reasoning.

The chain spans PostHog, Sentry, and Vercel.

Why it matters: the hypothesis — *teachers are already using AI assistants; putting Oak in that context improves outcome quality and reduces work* — will become falsifiable with data.

**For the impact team**, engagement evidence builds from day one of beta — and the first days of telemetry are already teaching us.

### 3. Safeguarding and content governance moved from intention to machinery

Every static string an assistant might read from us — tool descriptions, server instructions, guidance text, 728 governed items — now lives in one register with drift detection: change a served word and a validator fails until a named, hash-pinned review entry in the register accounts for it. Restricted lessons (RSHE and similar) are excluded at the data boundary itself, not filtered at the edge. Tool descriptions were swept for anything that could steer an assistant beyond presenting Oak's content.

Why it matters: **for teachers**, the safety property is structural, not editorial; **for the compliance reviewers**, the machine-current content registry the last update promised exists — every served item rendered, anchored, and accounted — ready for their review to run beside the build rather than after it.

### 4. Reliability work nobody sees until it saves you

Four things landed here. Every preview deployment now gets a post-deploy liveness check, and production has a redeploy guard. The dependency estate is clear of high-severity advisories. Configuration isolation means no workspace can silently depend on another's setup — strict, everywhere, all the time. And a mutation-testing canary proved our test suites detect injected faults, then caught itself running against the wrong configuration and fixed that too.

Why it matters: **for the engineers**, this is the "without compromising quality or stability" half of rapid innovation, built as structure rather than vigilance. The estate-wide mutation-testing rollout follows in stages, priced with the canary's cost data.

### 5. The engine that built all of this got faster and safer

The Practice — the agentic-engineering framework this repository runs on — spent the window hardening itself. Every action a bot takes on GitHub is now identified and gate-checked, and nothing merges until it is genuinely settled. Every quality check is registered as a governed lever rather than a script someone can quietly switch off. Four AI platforms (Claude, Codex, Copilot CLI, Cursor) work the repository as first-class citizens on a shared comms stream.

Why it matters: the rapid delivery was possible _because_ of every quality gate blocking and dual-review on every change. The cost-of-innovation story the last update claimed is now evidenced by nineteen days of high-impact delivery.

> Comprehensive, strict checks make safe, rapid, high-quality AI-driven delivery a reality.

## The Numbers (Nineteen Days, Entirely Straight-Faced)

- **310 pull requests merged** — roughly one every 90 minutes, around the clock. The bots don't stop.
- **2,109 commits**; **658,841 lines added, 364,508 removed** — a million-line window, net +294k, on a codebase that *shrank* in several places we're proudest of.
- **253 production releases** (v1.82 → v1.158) — about thirteen a day.
- **1,765 deployments over the twenty-day Vercel window** (258 to production — one production deploy every ~110 minutes), production builds in **94 seconds**, and **zero failed production builds**: all ten build failures happened on previews and never reached main.
- **98 Linear tickets completed** in the release project — including the entire analytics build, the canonical-domain decision-and-execution, and the submission itself.
- Sentry issues opened in its 30-day window: **six**, five of them single bursts, exactly one still live.
- **34 workspaces** in the monorepo behind the same blocking gates (one research-area lint-coverage gap is named and scheduled in a ratified plan, not glossed). **Zero** high-severity dependency advisories standing. Every workspace reusable for other projects.
- Surfaces live as of 11 August: the MCP server on production (fronted at www.thenational.academy/mcp), its public landing page, the design-system showcase, and a curriculum hub demo.
- Every release gate, ratification, and submission decision stays a human decision; the four standing decisions taken in the window are recorded and traceable.

## User Engagement and Platform Health

In the first few days:

- 57 clients completed an MCP handshake
- 31 of those called a tool
- 10 distinct signed-in accounts have connected since production sign-in went live around 7 August.

That's before anyone knows the MCP app exists.

**Usage (PostHog, instrumented from 29 July).** **~1,300 genuine tool calls** from ~30 distinct clients in two weeks. Three findings that matter:

- **The distinctive surface gets used.** Beyond flat retrieval, real sessions exercise search, topic exploration, and the prior-knowledge, misconception and progression graphs — 40 distinct tools called at least once. Small n, right shape.
- **A measurable discovery-to-activation gap**: 57 clients completed the handshake; 31 ever called a tool. This is not a problem, it's expected for an unpublished tool, but it proves we can _see what is happening_.
- **Signed-in people are still few**: ten distinct accounts since production sign-in went live. The most encouraging single data point arrived on the morning of 11 August: a first-time account running an eleven-minute, human-paced session that followed the documented entry path exactly — model, subjects, units, nineteen searches, fifteen topic explorations. We can't yet prove it wasn't one of our own, but the shape is right, and we want a hundred of them.

The service is quick and quiet: 0.64% tool-call error rate, median response 304ms, p95 under half a second.

We only have a few days of very low usage data, but we _already have insights_.

**Errors (Sentry — unhandled exceptions, last 30 days).** Quiet in a good way: roughly 23 production exception events against ~75,000 MCP requests — around 0.03%. Six issues, five of them single bursts that never recurred; the second-noisiest was entirely our own branch-preview noise. One is genuinely live: a small number of clients advertise an MCP protocol revision newer than any released SDK supports, and our server currently turns them away. Those users get *nothing* from us, which matters more than the volume; the fix decision is ticketed and re-prioritised off the back of this stocktake.

Still to do: setting up somewhere for alerts to go.

**Deployment (Vercel).** The production deployment is healthy, and www.thenational.academy/mcp is confirmed Cloudflare-fronted onto it with protocol-correct auth challenges.

## Where the Release Stands

**In**: the connector submitted on 7 August — the release's defining act — with Anthropic's review running on their clock. The plugin submitted on 10 August as the one-click install route. Analytics complete and observing safely. The canonical domain decided, executed, and serving. 98 tickets closed in the window.

## What We Need

- **Beta users, and a route to them.** Ten signed-in accounts is a working instrument with nobody on it; the plugin and the connector are both submitted — when the listings land, we're ready to learn from real teachers.

## Next

- Anthropic's reviews of the submitted connector and plugin run on their clock; we watch for them and respond fast.
- The guidance documents flow in from their Oak authors and go live through the waiting pipeline, each on its own schedule.
- Learning from this experience, and planning for the ChatGPT submission.

---

*All figures first-hand from git, GitHub, Linear, PostHog, Sentry, and Vercel on 2026-08-11.*
