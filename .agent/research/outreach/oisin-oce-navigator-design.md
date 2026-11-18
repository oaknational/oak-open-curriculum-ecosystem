---
name: "Ask Oisín — OCE navigator design (with Ask Oak split out)"
status: settled — full-claim verification complete
last_updated: 2026-07-08
companion: ".agent/research/outreach/slack-assistant-logging-observability-design.md (telemetry topology — resolved)"
---

# Ask Oisín — repo & project navigator, with Ask Oak split out for curriculum content

> Verified against primary vendor documentation and the live Oak Curriculum MCP on 2026-07-08,
> then re-verified by a full claim-register pass the same day (every discrete claim in this
> estate was extracted, classified, and checked against primary sources, the live services, or
> the repository itself; corrections are folded in below). Owner rulings in force: **pragmatic
> PII egress** (§Security), **running-text matcher deferred** for v1, **build v1 now** (no
> demand gate), **internal-use only** (allow-listed installations), and the app framework:
> **Next.js App Router** (owner choice, 2026-07-08). React *components* stay out of scope for
> v1 (Slack Block Kit only). The telemetry topology is **resolved** — see the companion record.

**Ask Oisín** (Open Curriculum Ecosystem Navigator, OCEN) is a Slack bot that answers questions about the *project*: the OCE repo, the approaches, the strategy, the Practice, the vision, and the current planning state. It grounds in the `oaknational/oak-open-curriculum-ecosystem` GitHub repo, where the `under-the-hood` skill and the `.agent/` directives, PDRs/ADRs, `principles.md`, and planning state live. Oisín reads that repo **live, through the official remote GitHub MCP server (read-only)** — attached with the same AI SDK MCP client that Ask Oak uses for the Oak Curriculum MCP. **Nothing is vendored.** Surfacing the Oak Curriculum MCP as a source of *curriculum content* — lessons, threads, misconceptions, EEF evidence — is a separate concern handled by a separate app, **Ask Oak**. Two apps, one shared pattern — each attaches exactly one read-only MCP over HTTP — both hosted on Vercel.

Oisín is invoked as `@ask-oisin` (the intended display name is "Ask Oisín"; the username/handle is constrained by Slack to lowercase letters, numbers, hyphens, underscores, and periods, under 22 characters — whether the *display name* renders the accent is undocumented, so confirm at app registration). It is reached by the `@ask-oisin` mention, two slash commands — `/ask-oisin` and its Welsh-spelling alias `/ask-osian`, both routing to the same handler — and the Slack agent side-panel / DMs. Slack gives a bot exactly one handle and has no native `@`-mention alias, so the second slash command is what carries the alternate spelling. A running-text matcher that catches the name typed mid-sentence (Oisin/Osian/Ossian/Osheen…) is **deferred for v1** (owner ruling): it requires subscribing to every channel message (`message.channels`, which delivers *all* traffic in every channel the bot joins), the largest incidental-PII surface in the design, so v1 relies on explicit invocation only (see §Security, privacy, and PII).

## Verification ledger

Every claim in this document is one of: **verified** (primary vendor docs, the live service, or
the repo, 2026-07-08 — the default for anything stated as fact below), an **owner ruling**
(marked), or a **residual to re-check at build time** (listed here). The residuals:

- **Installed-version re-verification** (standing `verify-vendor-call-shapes` discipline):
  re-check `isStepCount` / `instructions`, the `@ai-sdk/mcp` transport options, and the
  `@vercel/slack-bolt` receiver wiring against the *installed* majors at each WS's GREEN step.
  The shapes below are verified against the currently published majors (`ai@7.0.x`,
  `@ai-sdk/mcp@2.0.x`, `@vercel/slack-bolt@1.6.x`, `@slack/bolt@4.x`).
- **Display-name accent** ("Ask Oisín"): undocumented; confirm at Slack app registration.
- **Oak MCP alpha stability** (Ask Oak only): the OAuth metadata and tool inventory were
  verified live 2026-07-08 (grants exactly `authorization_code` + `refresh_token`, PKCE S256,
  DCR, `offline_access`; unauthenticated calls return 401), but the alpha is invite-only and
  may change before Ask Oak is promoted.

## Scope: two apps, one pattern

| | **Ask Oisín** | **Ask Oak** |
|---|---|---|
| Answers | The project: repo, approaches, strategy, the Practice, vision, planning state | The curriculum: lessons, units, threads, misconceptions, EEF evidence |
| Grounds in | OCE GitHub repo, read **live** — the `under-the-hood` skill, `.agent/` directives, PDRs, `principles.md`, planning docs | Oak Curriculum MCP curriculum tools (`get-curriculum-model`, `search`, `fetch`, thread/prior-knowledge/misconception graphs, EEF) |
| MCP used | Official **remote GitHub MCP server** (read-only, `repos` toolset), via the AI SDK's MCP client | Oak Curriculum MCP, via the AI SDK's MCP client |
| Oak skills loaded | `oak-tone-of-voice` (primary), read live from `oak-skills` | `oak-tone-of-voice`, `oak-curriculum-principles`, `oak-lesson-builder`, `oak-brand` (all four verified present in `oak-skills`), read live |
| Auth blocker | GitHub token only — a fine-grained PAT selecting the private `oak-skills` repo (read access to the public OCE repo is implicit: fine-grained PATs always carry read on all public repos); ships first | A first-class **machine identity on the Oak MCP** (Clerk M2M verification — an enhancement we own on our own MCP app) |
| Audience | Internal Oak staff | Internal Oak staff (curriculum focus) |

Both apps are separate Slack apps (two manifests, two bot users, two tokens) built on the same codebase — the same invocation set, the same Vercel + `@vercel/slack-bolt` runtime, the same AI SDK + AI Gateway model layer, and the same "attach one read-only MCP, run a bounded tool loop" shape.

## TL;DR
- Host on Vercel as a **Next.js App Router** app (owner choice) using the official `@vercel/slack-bolt` adapter (v1.6.x), which acknowledges Slack inside its 3-second window and continues the real work in the background via `waitUntil` under Fluid compute (default-on for new projects; the receiver's ack deadline defaults to ~3s). The adapter is Web-Request-native — `export const POST = createHandler(app, receiver)` in an App Router route handler. The app is **headless**: route handlers run on Vercel's **Node.js runtime by default**, and there is no client-side code (Slack's own client renders everything) — so there is exactly one origin (back-end) and one runtime (Node). Reuse the genuine shared `@oaknational/*` packages (result/env/env-resolution/logger/type-helpers/build-metadata); rate limiting is a durable-KV limiter on **Upstash Redis via the Vercel Marketplace** (Vercel KV no longer exists — existing stores were migrated to Upstash in December 2024); Clerk is Ask-Oak-only. Socket Mode needs a long-lived process, so it stays a local-dev convenience only.
- Use the AI SDK (**v7**: `isStepCount`, `instructions`) with the Vercel AI Gateway (BYOK) as the model layer, not the raw Anthropic SDK. Zero markup on tokens including under BYOK (paid tier + purchased credits; a failed BYOK request falls back to system credentials billed against the balance); spend/latency observability; automatic cross-provider failover; per-API-key **budgets** (enforced spend caps — requests stop at the limit, not alerts). Both apps call `generateText` with a bounded tool loop (`stopWhen: isStepCount(…)`): Oisín with the GitHub MCP tools attached, Ask Oak with the Oak MCP tools attached. Route with a current model slug (e.g. `anthropic/claude-sonnet-5`); treat it as an **opaque operator-configured value and do not validate its format** (owner ruling) — the Gateway rejects unknown slugs at call time.
- **ZDR**: prefer the **per-request** form (`zeroDataRetention: true` in `providerOptions` — no additional cost) over the team-wide dashboard toggle ($0.10 per 1,000 successful requests). Either way ZDR is a beneficial control, not a dependency of the PII invariant (owner ruling).
- Ground Oisín by reading the repo **live** through the official remote GitHub MCP server (read-only, `repos` toolset — which includes `search_code` and `get_file_contents`), attached via `@ai-sdk/mcp` — no vendoring, ever. There is no anonymous mode, so the one credential is a fine-grained PAT (select `oak-skills`; public-repo read is implicit). The Oak Curriculum MCP stays out of Oisín entirely: its `oak-under-the-hood` tool only returns a pointer back to the same repo.
- **PII: pragmatic egress (owner ruling).** The user's own deliberately-typed question is the only sanctioned egress; author identity is stripped, structured PII scrubbed, nothing logged or persisted outside Slack. The invariant **does not depend on ZDR** (owner ruling 2026-07-08) — it stands on minimisation + scrubbing.
- Neither app needs persistent storage to ship (Oisín's GitHub PAT and Ask Oak's machine credential are env secrets); the durable KV serves rate limiting and retry de-duplication (keyed on the opaque Slack event id). Ask Oak authenticates **as a service**: the Oak MCP is our own app, so it grows first-class machine-identity verification (Clerk M2M) rather than Ask Oak persisting a human-minted OAuth refresh token — the workaround shape a frozen-system reading would have forced. Reach for Neon Postgres only when durable, queryable data (feedback, analytics, audit) becomes a real need.
- **Telemetry (resolved)**: a first-class **`@oaknational/sentry-nextjs` provider workspace** (wrapping `@sentry/nextjs`: instrumentation.ts + `onRequestError`) composed at the **app root**, carrying the ADR-160 redaction barrier through a shared Sentry-shaped redaction core extracted from `sentry-node` — the barrier is owned once, per-runtime providers are thin, and the `slack-assistant` framework imports **no vendor provider**. The estate workspaces (`observability`, `logger`, `sentry-node`) are enhanced in support of this work (owner direction), including fixing `logger`'s `node:crypto` portability leak with its missing enforcement test. Details and the full topology evaluation: the companion record.

## Key Findings

**The Vercel serverless-vs-Slack problem is solved.** Historically, Bolt on serverless was painful — ack fast to beat Slack's 3-second timeout and the long-running work gets killed when the function returns; wait for the work and Slack times out. The official `@vercel/slack-bolt` adapter closes that gap: its `VercelReceiver` acknowledges within the deadline and hands the real work to `waitUntil` (from `@vercel/functions`) under Fluid compute, so you keep Bolt's `app.event`/`app.command`/`app.message` ergonomics on serverless (the receiver swaps transport, not the listener API). It works with any Web-Request framework — Vercel names Hono, Nitro, and Next.js; its README example is Next.js App Router. Fluid compute is default-on for new Vercel projects, and the default function duration is already 300s on every tier.

**The repo already has proven shared packages for this class of service — and they are improvable in support of this work.** `apps/oak-curriculum-mcp-streamable-http` is a Vercel-deployed, observable, rate-limited, Clerk-authenticated headless app consuming the shared workspace packages. Its genuine shared `@oaknational/*` packages (`result`, `env`, `env-resolution`, `logger`, `type-helpers`, `build-metadata`) are the reusable part for Oisín. For telemetry, `sentry-node` binds the shared barrier to `@sentry/node`; this work decomposes at that vendor×runtime fault line (owner direction — the estate is not frozen): a shared Sentry-shaped redaction core plus a new `@oaknational/sentry-nextjs` provider, so the Next.js app composes its own runtime's provider with the barrier owned once. The MCP app is an OAuth **resource server** (plus a transparent AS passthrough proxy) — it verifies inbound tokens; it is *not* an OAuth client — so Ask Oak's client acquisition/refresh is new work, not a lift.

**The AI Gateway is the right model layer here.** Tokens cost the same as going direct to Anthropic, with zero markup, including under BYOK; on top you get a spend/latency dashboard, automatic cross-provider failover, per-key enforced budgets, and ZDR routing (per-request form free). Anthropic-specific knobs pass through `providerOptions.anthropic` (e.g. `cacheControl` for prompt caching; there is no `betas` key — beta headers are handled by the SDK per feature).

**Live-GitHub is the grounding for Oisín, via the official GitHub MCP server, and the Oak MCP stays out.** The repo is public, so the credential is trivial and the Oak MCP invite-only alpha is out of Oisín's critical path. The `oak-under-the-hood` tool was verified first-hand (2026-07-08) to return *only* a resource-link pointer to `raw.githubusercontent.com/…/main/.agent/skills/under-the-hood/SKILL-CANONICAL.md` plus two public Oak URLs — pure redundancy for a bot already reading the repo. Reading live (not vendoring) removes any staleness problem.

**Both apps use the AI SDK's MCP client, not Anthropic's server-side connector.** `createMCPClient` from `@ai-sdk/mcp` (stable, 2.0.x) connects to a remote MCP over Streamable HTTP (`transport: { type: 'http', url, headers }`) with Bearer or OAuth (`authProvider`) auth and adapts its tools into ordinary AI SDK tools, from the Vercel runtime, inside one `generateText` tool loop. Anthropic's own MCP connector was rejected: it is a feature of the Anthropic Messages API (`mcp_servers`), not the AI SDK, and Anthropic's own docs state it is not eligible for Zero Data Retention.

**Ask Oak authenticates as a service — because we own both ends.** The Oak MCP's OAuth 2.1 metadata (Clerk-backed, verified live 2026-07-08) supports `authorization_code` and `refresh_token` grants with PKCE (S256) — and **not** `client_credentials` (Clerk does not support that grant yet; it says it is aiming to). Its *user*-OAuth surface therefore cannot authenticate a headless client. But the Oak MCP is `apps/oak-curriculum-mcp-streamable-http` — our app — and Clerk ships **M2M tokens** as its machine-auth product for exactly this backend-to-backend case. So the excellent shape is a first-class machine identity: the MCP app's verification layer grows an M2M path alongside user OAuth, and Ask Oak presents its machine token as a plain Bearer header. The alternative — a human signing in once with `offline_access` and the bot persisting that refresh token — was considered and rejected: it binds a service to a human account's lifecycle, muddies audit attribution, and forces a day-one secret store (Clerk's refresh tokens never expire, which makes the workaround *durable*, not *right*). If Clerk later ships `client_credentials`, the M2M implementation can migrate to the standard grant.

**The running-text matcher is deferred (owner ruling).** Dropping it for v1 removes the largest incidental-PII surface (channel-wide message ingestion), eliminates the `app_mention`/`message` double-fire hazard for channels entirely, and drops the `channels:history` scope. Explicit invocation — mention, two slash commands, the agent panel, and DMs — covers real usage. (Double-fire is a real engineering concern but not Slack-documented guidance; the v1 event set avoids it by construction, and the DM/mention overlap is de-duplicated in the framework.) The matcher can return later if demand emerges, gated on the same privacy review.

## Implementation shape

**Organisation — thin apps over a shared framework.** Almost everything is shared; the per-app delta is a config object and a system prompt. So: a framework package plus two thin app entrypoints. Apps are leaf deployables and must not depend on each other (the dependency-direction contract lives in the ESLint boundary rules, `packages/core/oak-eslint/src/rules/boundary.ts`, per ADR-041); shared code lives *up* in `packages/`.

```text
packages/libs/slack-assistant/     # the reusable framework (org-agnostic, publishable)
apps/slack/ask-oisin/              # thin: config + deploy harness
apps/slack/ask-oak/                # thin: config + deploy harness
```

`apps/slack/*` is the right home (a family of Slack surfaces is likely); add it as a workspace glob in `pnpm-workspace.yaml` (which currently lists apps individually). The framework does **not** live under `apps/`.

**Workspaces depended on.** Existing: `@oaknational/result`, `env`, `env-resolution`, `logger`, `type-helpers`, `build-metadata` (all already consumed by the MCP app); the Clerk stack (`@clerk/backend`, `@clerk/mcp-tools`) for Ask Oak; optionally `@oaknational/curriculum-sdk` if Ask Oak calls some endpoints directly rather than via MCP. New — each defined, described, and testable in isolation (owner direction: that isolation is itself the architectural value, not a cost to defer):

- **`@oaknational/ai-gateway`** — the model layer: Gateway slug handling, `generateText`/`streamText` invocation, `providerOptions` (per-request ZDR, caching), the bounded tool loop, MCP-client attachment + the pure denylist filter, and the **egress contract** (the branded scrubbed-text type its egress points require — the contract lives here because both the tool loop and the surface framework consume it). Tested in isolation over injected fake models and fake MCP clients. Nothing Slack-shaped in it.
- **`@oaknational/slack-assistant`** — the Slack surface framework: Bolt + `@vercel/slack-bolt` wiring, invocation mechanics, mrkdwn/disclaimer, the scrub *implementation* (Slack-shaped identity patterns) satisfying the `ai-gateway` egress contract, `defineSlackAssistant(config)`. Imports `ai-gateway`; imports no vendor telemetry provider.
- **`@oaknational/sentry-nextjs`** — the Next.js telemetry provider, plus the shared Sentry-shaped redaction core it and `sentry-node` both consume (extracted from `sentry-node`; barrier owned once).

The ESLint boundary model is configured (never disabled) by stratifying the existing adapter tier — an **adapter-base** sub-tier (`ai-gateway`, the shared sentry core) that composite adapters (`slack-assistant`, `sentry-node`, `sentry-nextjs`) may depend on, with no composite→composite edges — structural acyclicity, recorded as an ADR-041 amendment.

**The three seams.**
- *Reusable everywhere (org-agnostic, publishable):* the model layer (`ai-gateway`: bounded tool loop, slug handling, streaming, MCP attachment, the egress contract) and the Slack surface (`slack-assistant`: Bolt + `@vercel/slack-bolt` ack/`waitUntil` wiring; invocation mechanics — mention, slash routing, DM/mention de-duplication; **the PII egress boundary implementation**; mrkdwn rendering, the LLM-content disclaimer; signature verification, rate limiting; the 👍/👎 reaction feedback signal — metadata-only counters, owner decision 2026-07-08) — two libs, each testable in isolation. (The custom interactive Block Kit feedback affordance stays deferred.)
- *Reusable with some change (configuration):* which MCP to attach and its auth; which skills/persona load into the system prompt; model choice; the bot's name; branding/disclaimer text.
- *Specific to each app (the ~40-line delta):* Ask Oisín's project-navigator persona + GitHub MCP + "hand curriculum questions to Ask Oak" routing; Ask Oak's curriculum persona + Oak MCP + machine-identity Bearer auth (Clerk M2M) + `get-curriculum-model`-first. Telemetry providers compose at each app's root.

**Separating Oak config from general functionality → a publishable core.** Express the seam as a factory, `defineSlackAssistant(config)`: the framework is tier 1, the `config` object *is* tiers 2–3 (the pattern ADR-154 names; this factory is our instance of it). The test for placement: *would someone else's bot need this unchanged?* → framework; *would they change a value?* → config; *would they change logic?* → it's mis-placed. Held to that line, `slack-assistant` has zero Oak in it and is open-sourceable as a "grounded Slack assistant over any MCP" framework, which serves the openness principle and is exactly the "others spin up their own versions" goal. For v1, draw the seam for **Slack only** — no surface-adapter indirection. A future surface-agnostic core (web/CLI adapters) stays in the deferred revisit register, not in the v1 shape.

**Framework: Next.js App Router (owner choice), plus a revisit register.** The adapter is Web-Request-native and Next.js is its README's primary target, already present in the monorepo (the hub demo supplies the Next config conventions to copy). Supporting evidence from verification: the mature Sentry SDK on this path is `@sentry/nextjs`, whereas the SDK for the lighter alternatives is alpha (`@sentry/hono`). Incoming canonical Next.js/React resources will supply shared config/conventions to adopt, not change the framework. Reopen the register rows below when they land:

| Item | Status now | What would change it |
|---|---|---|
| App HTTP framework | **Next.js App Router** (owner choice, 2026-07-08) | Incoming shared Next.js config workspace → adopt its conventions (a config alignment, not a framework change) |
| `packages/libs/slack-assistant` | Safe to design now — surface/framework-agnostic | Only if the standard mandates a specific runtime shape |
| Web-surface adapter (surface-agnostic core opportunity) | **Deferred** — this is the React/Next surface | Gated on canonical Next.js/React resources + `react-component-expert` + `accessibility-expert` review |
| Any feedback/admin/config **UI** beyond Slack Block Kit | Deferred | Same gate as the web adapter |
| WCAG 2.2 AA component review | N/A while Block-Kit-only | Fires the moment any React component exists |

Block Kit (suggested prompts, mrkdwn) is not React, so v1 is React/Next-component-free and not blocked by the missing resources.

## Security, privacy, and PII

**Invariant (owner ruling: pragmatic egress).** An LLM bot must send the user's question out of Slack to reach Claude, so "zero PII leaves Slack" is only literally achievable with Oak-controlled inference (recorded as the strict alternative, not v1). The achievable invariant v1 commits to: **the user's own deliberately-typed question is the sole sanctioned egress — minimised, stripped of identity, scrubbed of structured PII — and no content is logged or persisted outside Slack.** This invariant is **independent of ZDR** (owner ruling 2026-07-08): it holds on minimisation + scrubbing alone. ZDR stays a beneficial toggle (use the free per-request form).

**Access control (owner ruling): internal-use only, workspace-level.** An installation allow-list gate — applied after Slack signature verification, before any model call — rejects any Slack workspace/team that is not ours. Scope is **workspace-level** (owner ruling 2026-07-08): guests / Slack-Connect members *within* an allow-listed workspace are accepted; no per-user identity gating in v1. No external workspaces, no external access. Others may fork the repo and self-host their own instance; our deployment serves internal Oak staff only.

**Trust boundaries and every egress point** (the middle three are commonly missed):

| Egress | Carries | Control |
|---|---|---|
| LLM prompt → Gateway → Anthropic | question + system prompt + any thread context | per-request ZDR; strip identity; minimise context; DLP scrub |
| **Tool-call arguments** the model generates → GitHub/Oak | model may echo question PII into a search query | scrub applies to tool args too, not just the prompt |
| **Sentry** | request/response bodies if logged | the ADR-160 redaction barrier as a closure over every fan-out hook — all five (`beforeSend`, `beforeSendTransaction`, `beforeBreadcrumb`, `beforeSendLog`, `beforeSendSpan`); metadata only, never content; console-as-breadcrumbs is redacted, console-as-logs stays off |
| **Vercel function logs** | prompt/response if logged | never log message bodies; structured metadata only |
| AI Gateway dashboard | sees the prompt inherently | ZDR; accept the Gateway sees only the sanctioned question |
| KV / DB (dedup, rate limits) | question text at rest outside Slack | key dedup on the Slack event id (opaque); rate-limit keys are team ids + salted one-way user-id hashes; keep feedback state *in* Slack |

**Controls (framework-level, so every bot inherits them):**
1. **Never attach author identity** — strip user ids, display names, `@`-mentions, and email-looking tokens before egress. The model does not need to know who asked.
2. **DLP/redaction at the boundary** — emails, phone numbers, structured identifiers; imperfect for freeform names but catches structured PII; applies to prompt, tool args, and anything logged.
3. **No running-text matcher / no `message.channels`** (v1) — the biggest incidental-PII surface is removed; do not wholesale-forward channel `conversations.replies`, default to the current question only.
4. **No content persistence** — nothing logged/persisted outside Slack (this holds independently of ZDR). Secrets (Slack tokens, Gateway key, the GitHub PAT with private `oak-skills` read, Ask Oak's machine token) encrypted, minimally scoped, rotated.
5. **Egress allowlist** — the function reaches only Gateway, Slack, GitHub MCP, Oak MCP.
6. **Read-only tools** — GitHub MCP `X-MCP-Readonly: true` (any non-falsey value enables it), Oak MCP is read; low prompt-injection blast radius (repo/curriculum content can carry adversarial instructions, but the bot cannot act destructively).
7. **Access control + cost/abuse** — the installation allow-list (fail-closed: an empty or malformed list rejects everything) plus a durable-KV limiter (Upstash Redis) keyed on the Slack team id and a salted one-way-hashed (never-egressed) user id; per-API-key Gateway budgets as the enforced spend cap.
8. **Safeguarding (owner ruling 2026-07-08): deflect + signpost, no record.** On a sensitive/safeguarding disclosure the bot declines to engage and points the user to Oak's human safeguarding route; nothing is retained (preserves the no-logging invariant). Carried in the system prompt. A mandated-escalation-with-record variant was considered and not adopted for v1.
9. **Accessibility (org requirement)** — any rendered affordance beyond Block Kit defaults must meet WCAG 2.2 AA (contrast, keyboard/AT reachability, non-colour-only signals).

## Details

### 1. Ask Oisín

**Grounding.** Oisín reads the OCE repo live. It attaches the official remote GitHub MCP server as a read-only tool set and lets the model fetch what each question needs: it starts from `.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md` and follows it, then reads the specific `.agent/` directives, decision records (PDRs/ADRs), `principles.md`, and planning docs the question calls for. Nothing is baked into the deploy, so every answer reflects the current `main`. It does not touch the Oak Curriculum MCP.

**Oak skills.** The LLM reads Oak skills live from `oaknational/oak-skills`, primarily `oak-tone-of-voice`: make the reader the subject not Oak, use first and second person and contractions, put the point first in plain words. `oak-skills` is a **private** repo (verified 2026-07-08), so Oisín's PAT selects it — **owner ruling 2026-07-08** (the make-public and mirror-into-OCE alternatives were considered and declined for v1); the PAT's read access to the public OCE repo is implicit.

**Message flow.**
1. A user `@ask-oisin`s a question, uses `/ask-oisin` or `/ask-osian`, or messages Oisín in the agent side-panel or a DM.
2. Slack delivers an `app_mention`, slash-command, `message.im`, or assistant-thread event over the Events API to the app's HTTP request URL on Vercel.
3. The `@vercel/slack-bolt` adapter acknowledges within Slack's 3-second window and hands the real work to `waitUntil`. Bolt sets an assistant status ("Ask Oisín is reading the OCE repo…") via `assistant.threads.setStatus`.
4. The handler builds the prompt from the current question only (author identity stripped, PII scrubbed — see §Security), calls the AI SDK (`generateText`, or `streamText`) with a Gateway model string, the GitHub MCP tools, and system instructions: role + routing, where in the repo to read (start from the under-the-hood skill), a pointer to `oak-tone-of-voice`, and Slack-formatting rules.
5. Claude reads the repo live through the GitHub tools and answers. Curriculum-content questions are declined with a short explanation (Ask Oak is not yet live); the bot does not guess. Answers cite the repo path used, so users can verify.
6. The handler streams the answer as Slack `mrkdwn` (`sayStream`), appends an LLM-content disclaimer, and sets the thread title. 👍/👎 reactions on the answer are counted as the POC feedback signal (metadata only; the custom interactive affordance stays deferred).

**Hosting & runtime (Vercel).** A **Next.js App Router** app on Vercel. The Slack request URL is an App Router route handler wired to Bolt through `@vercel/slack-bolt` (see the skeleton). Route handlers run on the **Node.js runtime by default** (Edge is opt-in and unused here), Fluid compute keeps the function alive for `waitUntil` (default-on for new projects; default duration 300s on every tier — set `maxDuration` only if the default needs changing). The app is headless: no pages, no client bundle, no browser code.

**AI layer.** The AI SDK routes through the AI Gateway by passing a `creator/model` slug — `anthropic/claude-sonnet-5` for the default, or a higher-quality Opus ID. Treat the slug as an **opaque operator-configured value; do not validate its format** (owner ruling) — the Gateway rejects unknown slugs at call time. BYOK is configured once in the Vercel dashboard. Anthropic knobs (e.g. prompt caching via `cacheControl`) pass through `providerOptions.anthropic`. Enable per-request ZDR (`zeroDataRetention: true` — free) rather than the team-wide toggle ($0.10/1,000 successful requests).

**Persistence.** None to ship: stateless, grounded live from GitHub, history from Slack (`conversations.replies`, current thread only), thread context via Bolt's assistant-thread context (the default `AssistantThreadContextStore` is message-metadata-backed; supplying a database-backed store is the escape hatch if metadata is ever outgrown). Its only stored secret is the GitHub PAT. The durable KV (Upstash Redis) carries rate-limit counters and retry de-duplication keyed on the opaque Slack event id — never content. Neon only when feedback/analytics/audit become real.

**Auth / OAuth scopes.** Slack bot token scopes: `app_mentions:read`, `chat:write`, `assistant:write`, `im:history`, `im:write`, `commands`, `reactions:read` (the feedback signal). (No `channels:history` — the running-text matcher is deferred. `assistant:write` is the scope for the `assistant.threads.*` methods and is added with the agent feature; the two assistant-thread events themselves require no extra subscription scope.) Claude is reached through the AI Gateway with an `AI_GATEWAY_API_KEY` (BYOK in the dashboard). GitHub is reached through the remote GitHub MCP server with the fine-grained PAT. Oisín needs no Oak MCP token — its outbound calls are only the AI Gateway, Slack, and the GitHub MCP.

### 2. Ask Oak (separate app, curriculum content)

Ask Oak is a second Slack app on the same codebase and stack. It answers curriculum questions by attaching the Oak Curriculum MCP through the AI SDK's MCP client over Streamable HTTP with a machine-identity bearer token, pruning out the non-curriculum tools and calling `get-curriculum-model` first as the server requires. Its system instructions load `oak-tone-of-voice`, `oak-curriculum-principles`, `oak-lesson-builder`, and `oak-brand` (read live; all four verified present).

**Machine identity, both ends ours.** Ask Oak is a headless service and authenticates as one: a Clerk **M2M token**, presented as a plain Bearer header on the `@ai-sdk/mcp` transport, verified by an M2M path we add to the Oak MCP app's auth layer (alongside its existing user-OAuth verification; `@clerk/backend` carries Clerk's machine-token verification surface). The Oak MCP is our app — its auth approaches are ours to extend, and giving a service a service's identity is the architecturally honest shape: clean audit attribution, no coupling to any human account's lifecycle, no day-one secret store (the machine credential is an env secret like every other). Because the MCP call originates from the Vercel runtime, tool round-trips run inside the background-work window. This adds a scoped deliverable on the MCP app (the M2M verification path + machine-caller authorisation/rate identity) that Ask Oak's plan names as a blocking prerequisite we own; invoke the clerk-expert when building both sides.

**Tool set — prune by denylist, not a narrow allowlist.** Ask Oak needs the discovery, browsing, fetching, progression/graph, and programme tool families — most of the server's surface. Expose *everything except* the non-curriculum tools (`oak-under-the-hood`, `get-rate-limit`, `get-changelog`, `get-changelog-latest`), rather than a hand-curated allowlist that silently drops lesson-content tools (`get-lessons-summary`/`-transcript`/`-quiz`/`-assets`, `get-units-summary`, the `get-programmes-*` set) and any tool added later. Note (verified in the `@ai-sdk/mcp` source): `client.tools()` does **not** surface MCP tool annotations (`readOnlyHint`/`destructiveHint`) — it consumes only `annotations.title` — so an annotation-based filter is not implementable on the adapted tools; the name denylist stands, and reading the raw MCP `listTools` result is the escape hatch if annotation-aware filtering is ever needed.

### 3. The Oak Curriculum MCP server

The production alpha at `https://curriculum-mcp-alpha.oaknational.dev/mcp` is a Streamable HTTP MCP server using OAuth 2.1 (advertised at `/.well-known/oauth-protected-resource`; Clerk-backed authorization server; `authorization_code` + `refresh_token` grants, PKCE S256, dynamic client registration; unauthenticated calls return 401 — all verified live 2026-07-08), invite-only for Oak staff. It exposes resources, workflow prompts, and ~42 tools, including `oak-under-the-hood` and the curriculum tools `get-curriculum-model` (call first), `browse-curriculum`, `explore-topic`, `search`, `fetch`, `get-thread-progressions`, `get-prior-knowledge-graph`, `get-misconception-graph`, `get-eef-evidence`, `get-keyword-graph`, plus the lessons/units/programmes/sequences fetching families — over **164 threads across 16 subjects** (verified verbatim from `get-curriculum-model`, 2026-07-08; the tool inventory is alpha and may change). The curriculum tools are Ask Oak's; Oisín uses none.

### 4. The repo decision instruments — status and application

**Sourcing note.** The instruments named below were confirmed in-repo on 2026-07-08: the `metacognition` and `reason` skills are present at `.agent/skills/metacognition/SKILL-CANONICAL.md` and `.agent/skills/reason/SKILL-CANONICAL.md`; `principles.md` is at `.agent/directives/principles.md` with an ordered "Decision Lenses" section; PDR-051 subsumes custom commands into the skills surface (so skills are the invocable-workflow surface); the continuity pipeline `capture → distil → graduate → enforce` is confirmed. There is no standalone "decision matrix" file — the matrix is a *method*, defined next.

**Decision matrix — the method.** The decision matrix is the five **`principles.md` Decision Lenses** applied *in order* (first that decisively resolves governs), run through the two reasoning skills: `/oak-metacognition` supplies the inward check (am I about to bring about the right impact? — the action-to-impact bridge) and `/oak-reason` supplies the outward structure (name the kind, frame the problem not the solution, surface the warrant and its falsifier, decide for reversibility, stress-test). The five lenses:

1. Choose long-term architectural excellence at every decision point.
2. Strict, everywhere, all the time.
3. Could it be simpler without compromising functionality or quality? (the First Question)
4. Would it be simpler if the system changed?
5. Optimise for user value.

Applied to the key decisions:

- **The split (one app vs two).** Lens 1 favours the split: isolating Ask Oak's invite-only OAuth dependency from a ship-now app is the cleaner boundary. Lenses 3–4 resist duplicated deployment, and the third option they force is the one adopted — one shared codebase, two thin app configs. Lens 5: staff get Ask Oisín now and curriculum answers when Ask Oak ships. → two apps, one codebase.
- **Oisín's grounding (live GitHub vs vendoring vs the Oak MCP).** Lenses 1–2 favour reading the repo live: one live source with nothing to drift, carrying file-level planning state the pointer-only `oak-under-the-hood` cannot. Lens 4 dissolves the "which surface" question. Lens 3: one credential, one tool loop. → live GitHub read; no vendoring; no Oak MCP for Oisín.
- **Hosting and model layer.** Lens 1: the managed path buys observability and failover at a mild, reversible lock-in cost. Lenses 3 and 5: simplest path to staff. → Vercel + AI Gateway, with **Next.js App Router** for the HTTP layer (owner choice; the adapter is Web-Request-native and the mature Sentry SDK sits on this path).
- **The telemetry topology.** Lens 4 asked whether the "which Sentry mechanism" problem dissolves if the framing changes — it did: the app is headless and Node-runtime, so there is one origin and the runtime's documented provider composes at the app root behind our shared redaction barrier — with the estate workspaces enhanced to own that barrier once (lens 1: the provider workspace, not app-local wiring). Full evaluation: the companion record.
- **Ask Oak's machine identity.** Lens 4 again, this time on our own system: treating the Oak MCP's advertised user-OAuth grants as fixed forced a workaround (persist a human-minted refresh token + a day-one store). Changing the system — adding Clerk M2M verification to our own MCP app — dissolves the store, the refresh machinery, and the human-account coupling at once. Lens 1 makes it the design, not an option. → first-class machine identity; the MCP-app enhancement is a named prerequisite we own.
- **The running-text matcher.** Lens 3 (simpler without losing value) and lens 4 (change the system, dissolve the problem): dropping it removes the channel-wide PII surface and the channel double-fire hazard at negligible cost to real usage. → deferred for v1.

**Routing between the two bots.** Oisín answers project questions from the repo and declines curriculum questions (pointing at Ask Oak once it exists) rather than confabulating; Ask Oak defers project questions to Oisín. Each bot's instructions carry its decomposition: Oisín reads the under-the-hood skill first, then targeted files; Ask Oak calls `get-curriculum-model` first, then the specific tool, in the step loop.

The continuity directive still applies: capture surprising failures (alpha auth expiry, a GitHub rate-limit or PAT-scope surprise, a Gateway routing surprise) into the `capture → distil → graduate → enforce` pipeline.

### 5. Starter code skeleton (TypeScript, Next.js App Router on Vercel)

> The skeleton encodes intent against the APIs verified 2026-07-08 (`ai@7`, `@ai-sdk/mcp@2`,
> `@vercel/slack-bolt@1.6`, `@slack/bolt@4`); re-verify against the installed versions at
> build time per `verify-vendor-call-shapes`.

**Ask Oisín app manifest (`manifest.oisin.yaml`):**
```yaml
display_information:
  name: Ask Oisín
  description: Open Curriculum Ecosystem Navigator — project, Practice, strategy, planning (bot)
features:
  bot_user:
    display_name: Ask Oisín          # accent rendering undocumented — confirm at registration
    always_online: true
  agent_view:                        # current key; assistant_view is legacy (new apps must use agent_view)
    agent_description: "Ask about the OCE repo, the Practice, strategy, and planning state."
  slash_commands:
    - command: /ask-oisin
      description: Ask Oisín about the project, the Practice, strategy, and planning
      usage_hint: "[your question]"
      should_escape: false
    - command: /ask-osian
      description: Alias of /ask-oisin (Welsh spelling)
      usage_hint: "[your question]"
      should_escape: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - chat:write
      - assistant:write
      - im:history
      - im:write
      - commands          # no channels:history — running-text matcher deferred for v1
      - reactions:read    # the 👍/👎 feedback signal (metadata-only counters)
settings:
  event_subscriptions:
    request_url: https://ask-oisin.vercel.app/api/slack   # one request URL per app — a dev app covers previews
    bot_events:
      - app_mention
      - assistant_thread_started
      - assistant_thread_context_changed
      - message.im        # DMs only; NOT message.channels (matcher deferred)
      - reaction_added    # feedback signal on bot answers
      - reaction_removed
  interactivity:
    is_enabled: true
    request_url: https://ask-oisin.vercel.app/api/slack
  socket_mode_enabled: false
  org_deploy_enabled: false
```

**`.env`:**
```text
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
AI_GATEWAY_API_KEY=...                     # Vercel AI Gateway; BYOK (Anthropic key) set in the dashboard
CLAUDE_MODEL=anthropic/claude-sonnet-5     # opaque operator-configured model slug; not format-validated
GITHUB_TOKEN=github_pat_...                # fine-grained PAT: select oak-skills (private); public OCE read is implicit
SLACK_TEAM_ALLOWLIST=T0123456789           # installation allow-list (fail-closed when empty/malformed)
# Ask Oak (separate app) additionally needs OAK_MCP_URL and its machine-identity credential
# (Clerk M2M — verified by our MCP app), an env secret like the rest.
```

**Shared core (`lib/core.ts`) — model layer + bounded tool loop:**
```ts
import { generateText, isStepCount, type ToolSet } from "ai";   // v7: isStepCount, instructions

// A "creator/model" string routes through the Vercel AI Gateway (BYOK, zero markup).
// Opaque operator-configured model slug (e.g. anthropic/claude-sonnet-5); do not validate its format.
export const MODEL = process.env.CLAUDE_MODEL!;

// Both apps attach exactly one read-only MCP tool set; the model runs a bounded tool loop.
// `prompt` MUST already be scrubbed of author identity and PII by the egress boundary.
export async function ask(instructions: string, prompt: string, tools: ToolSet) {
  const { text } = await generateText({
    model: MODEL,
    instructions,                 // v7 name (formerly `system`)
    prompt,
    stopWhen: isStepCount(8),     // bound the tool round-trips (GitHub reads / curriculum lookups)
    tools,
    providerOptions: { gateway: { zeroDataRetention: true } },  // per-request ZDR — free
  });
  return text;
}
```

**Ask Oisín route handler (`app/api/slack/route.ts`):**
```ts
import { App } from "@slack/bolt";
import { createHandler, VercelReceiver } from "@vercel/slack-bolt";
import { createMCPClient } from "@ai-sdk/mcp";
import { ask } from "@/lib/core";
import { scrub } from "@/lib/pii";                     // strips identity + structured PII before egress

const INSTRUCTIONS = `You are Ask Oisín (@ask-oisin), a bot — an assistant, not a person — for Oak
National Academy's internal staff. You answer questions about the PROJECT: the Open Curriculum
Ecosystem repo, its approaches, the Practice, strategy, vision, and current planning state.
Read the repo LIVE with the GitHub tools — nothing is baked in. Start from
.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md and follow it, then read the specific .agent/
directives, decision records (PDRs/ADRs), principles.md, and planning docs the question needs.
Cite the repo path you used. For Oak's voice, read oak-tone-of-voice from the oak-skills repo.
If a question is really about curriculum CONTENT, say so and explain that curriculum answers are
not yet available (the Ask Oak app is future); do not guess. If someone shares a sensitive or
safeguarding disclosure, do not engage with it — say you cannot help with that here and point them
to Oak's human safeguarding route; retain nothing. Format replies as Slack mrkdwn.`;

// Official remote GitHub MCP server, read-only, repos toolset — reads the repo live.
const github = await createMCPClient({
  transport: {
    type: "http",
    url: "https://api.githubcopilot.com/mcp/",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-MCP-Readonly": "true",
      "X-MCP-Toolsets": "repos",     // includes search_code + get_file_contents
    },
  },
});
const tools = await github.tools();

// Construct ONE receiver; pass the SAME instance to the App and to createHandler (verified shape).
const receiver = new VercelReceiver();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,   // Bolt verifies every request signature
  receiver,
  deferInitialization: true,
});

// An @-mention inside a DM delivers BOTH app_mention and message.im for the same message —
// answer once, keyed on channel+ts. (Illustrative in-instance guard; the durable event-id
// de-dup across Slack retries is the framework's WS7.3 KV cycle.)
const answered = new Set<string>();
const answerOnce = async (key: string, reply: () => Promise<void>) => {
  if (answered.has(key)) return;
  answered.add(key);
  await reply();
};

app.event("app_mention", async ({ event, say }) => {
  await answerOnce(`${event.channel}:${event.ts}`, async () => {
    await say({
      text: await ask(INSTRUCTIONS, scrub(event.text), tools),
      thread_ts: event.thread_ts ?? event.ts,        // reply in the existing thread when mentioned inside one
    });
  });
});

app.message(async ({ message, say }) => {            // DMs only (message.im); no channel subscription
  if (message.channel_type !== "im" || message.subtype !== undefined) return;   // typed narrowing — no `as any`
  await answerOnce(`${message.channel}:${message.ts}`, async () => {
    await say({
      text: await ask(INSTRUCTIONS, scrub(message.text ?? ""), tools),
      thread_ts: message.thread_ts ?? message.ts,
    });
  });
});

const slash = async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
  await ack();                                        // within 3s; the answer follows via response_url
  await respond({ response_type: "in_channel", text: await ask(INSTRUCTIONS, scrub(command.text ?? ""), tools) });
};
app.command("/ask-oisin", slash);
app.command("/ask-osian", slash);

app.event("assistant_thread_started", async ({ event, client }) => {
  await client.assistant.threads.setSuggestedPrompts({
    thread_ts: event.assistant_thread.thread_ts,
    channel_id: event.assistant_thread.channel_id,
    prompts: [
      { title: "What is the Practice?", message: "What is the Practice and how does it work?" },
      { title: "Where's the plan?", message: "What's the current planning state for OCE?" },
    ],
  });
});

export const POST = createHandler(app, receiver);
```

**Ask Oak entrypoint — the delta:** same manifest shape, hosting, and invocation set; different instructions, a machine-identity Bearer header, and the Oak MCP tool set pruned by denylist:
```ts
import { createMCPClient } from "@ai-sdk/mcp";
import { ask } from "@/lib/core";

const INSTRUCTIONS = `You are Ask Oak (@ask-oak), a bot for Oak's curriculum content. Answer questions about
lessons, units, threads, misconceptions, keywords, prior knowledge, and EEF evidence using the Oak
Curriculum tools; call get-curriculum-model first. Read oak-tone-of-voice and oak-curriculum-principles
for Oak's voice. Format replies as Slack mrkdwn.`;

// First-class machine identity: a Clerk M2M token verified by our MCP app's machine-auth path.
// A plain Bearer header — no OAuth client flow, no persisted refresh token, no day-one store.
const mcp = await createMCPClient({
  transport: {
    type: "http",
    url: process.env.OAK_MCP_URL!,
    headers: { Authorization: `Bearer ${process.env.OAK_MCP_M2M_TOKEN}` },
  },
});
const all = await mcp.tools();

// Curriculum content = everything EXCEPT the non-curriculum tools. A denylist (not a curated
// allowlist) picks up new curriculum tools automatically and never silently drops one.
// (client.tools() does not surface readOnlyHint/destructiveHint, so a name denylist is the filter.)
const NON_CURRICULUM = new Set([
  "oak-under-the-hood", "get-rate-limit", "get-changelog", "get-changelog-latest",
]);
const tools = Object.fromEntries(Object.entries(all).filter(([k]) => !NON_CURRICULUM.has(k)));

// ...identical app_mention / DM / slash / assistant-thread wiring, calling ask(INSTRUCTIONS, scrub(text), tools)
```

Token-by-token streaming is **v1** (owner decision 2026-07-08): `streamText` in the model layer feeding Slack's streaming methods (`chat.startStream`/`chat.appendStream`/`chat.stopStream`; Bolt's `sayStream` helper, `@slack/bolt` ≥ 4.7) on the mention/DM/assistant listeners — slash commands post complete answers via `response_url`. For later: supply a database-backed `AssistantThreadContextStore` if Slack-metadata context is ever outgrown. Pin the majors named above. A small answer-quality eval set (reuse the search-quality ground-truth methodology already in the repo) turns answer quality into a gate rather than a vibe.

### 6. Doc references supporting each decision
- `@vercel/slack-bolt` — Fluid compute + `waitUntil`; Web-Request-native (Hono/Nitro/Next.js); `createHandler(app, receiver)` + `VercelReceiver` + `deferInitialization`: the Vercel changelog "Build Slack agents with @vercel/slack-bolt" (2025-08-27), the `vercel-labs/slack-bolt` README, and the package source (v1.6.0).
- Shared workspace packages — `apps/oak-curriculum-mcp-streamable-http` consumes them today; the boundary tiers live in `packages/core/oak-eslint/src/rules/boundary.ts` (ADR-041); the framework/consumer seam is ADR-154.
- Official remote **GitHub MCP server** — endpoint `https://api.githubcopilot.com/mcp/` (GA 2025-09-04), PAT/OAuth auth (no anonymous mode), read-only via `X-MCP-Readonly`, toolset scoping via `X-MCP-Toolsets`, `repos` toolset tool list: `github/github-mcp-server` docs + README.
- Slack — agent/assistant feature (`features.agent_view`; `assistant_view` is legacy), assistant-thread events, `assistant:write`, status/suggested-prompt helpers; 3s ack + up-to-3 retries (`x-slack-retry-num`); slash commands (per-command `url` optional in the manifest) + `commands` scope; `mrkdwn` (`<url|text>` links, no headings/tables); `conversations.replies`; streaming via `chat.startStream`/`appendStream`/`stopStream` (changelog 2025-10-07) and Bolt `sayStream` (4.7.0): docs.slack.dev.
- HTTP required on Vercel (Socket Mode is a long-lived stateful WebSocket, ≤10 concurrent connections per app; Slack recommends HTTP for deployed apps): Slack "Comparing HTTP & Socket Mode".
- Vercel AI Gateway — zero markup incl. BYOK (paid tier + credits; system-credit fallback), observability/failover, ZDR (team-wide $0.10/1k; per-request free), per-key budgets (enforced caps), `providerOptions` passthrough: Vercel AI Gateway docs.
- AI SDK — `creator/model` routing, `generateText`/`streamText`, `stopWhen: isStepCount(N)` and `instructions` (v7 renames of `stepCountIs`/`system`); MCP client (`@ai-sdk/mcp@2`, Streamable HTTP `type: 'http'`, OAuth `authProvider`, `tools()`): ai-sdk.dev docs and the v7 migration guide.
- Vercel platform — Node.js runtime default for App Router route handlers; Fluid compute default-on; duration default 300s (Pro/Enterprise max 800s, extended 1800s); Redis via Marketplace (Vercel KV retired December 2024): Vercel docs.
- Sentry — `@sentry/nextjs` manual setup (instrumentation.ts, `onRequestError`, `withSentryConfig`), filtering hooks (`beforeSend` et al.): docs.sentry.io. Full topology evaluation: the companion record.
- Neon on Vercel — Marketplace-native Postgres, `pg` + `attachDatabasePool` (from `@vercel/functions`), scale-to-zero, branching: Neon + Vercel docs.
- Anthropic MCP connector — a Messages API feature (`mcp_servers`); Anthropic's docs state it is not ZDR-eligible: docs.claude.com.
- Oak skills: `oaknational/oak-skills` (private; skills verified present). Oak MCP: `curriculum-mcp-alpha.oaknational.dev` and its `/.well-known/` metadata (verified live).

## Recommendations
1. **Host both apps as Next.js App Router apps on Vercel with `@vercel/slack-bolt`** (owner choice; Web-Request-native adapter; mature Sentry SDK on this path), reusing the genuine shared `@oaknational/*` packages; rate limiting on a Marketplace Upstash Redis; HTTP request URL, no Socket Mode.
2. **Use the AI SDK v7 + AI Gateway (BYOK), not the raw Anthropic SDK.** Configure BYOK, route with a current model slug (`anthropic/claude-sonnet-5`, opaque/unvalidated), per-request ZDR, per-key budget caps, pin `ai@^7` (`isStepCount`, `instructions`). Both apps: `generateText` with a bounded tool loop.
3. **Ship Ask Oisín first, reading GitHub live, no vendoring.** Attach the official remote GitHub MCP server (read-only, `repos` toolset) via `@ai-sdk/mcp`; fine-grained PAT selecting `oak-skills` (public OCE read implicit).
4. **Enforce the pragmatic PII boundary in the framework** (§Security): strip identity, scrub PII on prompt and tool args, no content in logs/Sentry/KV, egress allowlist, per-request ZDR (beneficial — the invariant does not depend on it).
5. **Build the shared `packages/libs/slack-assistant` framework** with a `defineSlackAssistant(config)` seam so Oak config is separate from general functionality and the core is publishable; apps live at `apps/slack/*`, thin; telemetry providers compose at each app's root, never in the framework.
6. **Storage:** Upstash Redis (Marketplace) for rate limits + retry dedup; no durable store for either app; Neon later, only when durable queryable data is real.
7. **Stand up Ask Oak on a first-class machine identity**: land Clerk M2M verification on our MCP app (a scoped deliverable we own), then Ask Oak presents its machine token as a Bearer header — curriculum tools pruned by name denylist (annotations are not surfaced by `client.tools()`), `get-curriculum-model` first; invoke the clerk-expert on both sides.
8. **Apply the decision matrix as defined in §4** when re-evaluating any change, and **reopen the revisit register** (§Implementation shape) when the canonical Next.js/React resources and workspaces arrive.

## Caveats
- The skeleton is verified against the published majors as of 2026-07-08; re-verify the exact call shapes against the *installed* versions at build time (`verify-vendor-call-shapes`). `@vercel/slack-bolt` is young (first published 2025-08); track its releases.
- The remote GitHub MCP server requires a credential even for public-repo reads — there is **no anonymous mode**. Live reads count against the authenticated GitHub REST limit (5,000/hr per token; search carries additional per-minute sub-limits).
- AI Gateway BYOK requires the paid tier and purchased credits; a failed BYOK request falls back to Vercel system credentials billed against your balance.
- Fluid compute must be enabled (default-on for new projects); the default function duration is 300s on every tier — raise `maxDuration` only if model + live-tool latency ever approaches it (Pro/Enterprise allow 800s).
- The Oak MCP's *user*-OAuth surface has **no `client_credentials` grant** (verified live from `/.well-known/`; Clerk does not support it yet). Ask Oak therefore rides a Clerk **M2M machine identity** verified by an auth-path enhancement on our own MCP app — a named prerequisite we own, not an external wait. The invite-only alpha is also ours to evolve.
- **PII is pragmatic, not zero** (owner ruling): the sanctioned question egresses to the model. True zero-egress requires Oak-controlled inference — recorded as the strict alternative, not v1.
- Slack streaming's Web API surface is `chat.startStream`/`chat.appendStream`/`chat.stopStream` (Bolt `sayStream`), not a single `chat.stream` method. Slack `mrkdwn` is not standard markdown (links `<url|text>`, no headings/tables).
- Two apps mean two manifests, two bot users, and two token sets to rotate; the shared codebase keeps the maintenance cost to configuration, not logic. Slack delivers events to **one request URL per app**, so preview/dev testing uses a separate dev Slack app pointed at the preview deployment.
