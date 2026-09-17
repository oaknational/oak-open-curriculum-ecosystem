---
status: permanent-dated-record
date: 2026-08-05
subject: mcp-458-carousel-screenshots
source: MCP-458 requirements, MCP-444 §10 approved prompts, GitHub deployments API + git ancestry (deployment verification), MCP-328 (asset licence risk)
identity: Breeze tracks Troposphere / claude / d5f748 (Implementer, non-code submission prep)
---

# MCP App carousel screenshots — deployment verdict and shot plan

Serves MCP-458. Two parts: the deployment precondition the Director required be verified
**before** any capture, and the shot plan. Capture itself has not happened — see
§Blockers.

## Part 1 — deployment verdict for PR #655 (the banner safe-area fix)

MCP-458 makes the ordering constraint explicit: shoot only once the widget disclaimer,
brand-panel change, and the banner safe-area fix (PR #655) are present, because showing
the corrected panel is the whole reason the carousel was sequenced late. MCP-458 asserts
they "now are". That assertion was verified first-hand rather than inherited.

**VERDICT: the #655 fix IS in the deployed production build.**

Evidence chain, each link checked directly:

| Link | Method | Result |
| --- | --- | --- |
| #655 is merged | `git log` | Merge commit `da7a3e7f1`, 2026-07-30 17:43 +0100, *"fix(mcp-http): compose safe-area insets with token padding in the widget shell (MCP-434)"* |
| #655 is on main | `git merge-base --is-ancestor da7a3e7f1 origin/main` | YES |
| First release containing it | `git tag --contains` | **v1.125.4** |
| What is deployed to Production | GitHub deployments API, latest `environment=Production` | 2026-08-05T14:55:36Z, sha **`188a0c8a5`** |
| That sha's release | `git describe --tags` | **v1.150.2** |
| Deployed build contains #655 | `git merge-base --is-ancestor da7a3e7f1 188a0c8a5` | **YES** |
| Deployment succeeded | deployment statuses API | `state=success`, env_url `poc-oak-open-curriculum-ccsvhrrt2.vercel.thenational.academy` |
| Alpha endpoint live | `GET https://curriculum-mcp-alpha.oaknational.dev/healthz` | HTTP 200 `{"status":"ok","mode":"streamable-http","auth":"required-for-post"}` |

The fix is baked in, not runtime-conditional: #655 changed
`apps/oak-curriculum-mcp-streamable-http/src/generated/widget-html-content.ts` (generated
and compiled into the server) along with `widget/src/safe-area-insets.ts`,
`widget/src/index.css`, and `widget/src/App.tsx`. So any deployment at or above v1.125.4
serves the corrected widget shell. v1.150.2 is 25 minor versions past that.

### What this verdict does NOT establish — stated so nobody over-reads it

**That `curriculum-mcp-alpha.oaknational.dev` is aliased to that specific production
deployment is NOT proven.** Both that domain and the production deployment URL return an
identical `ETag` (`W/"43-Pkinc+K62zQWBhwRhgFJcteCBZg"`) on `/healthz`, which is
*consistent* with one build serving both — but it is weak evidence, because the healthz
response body is a hard-coded build-invariant constant, so an identical ETag would appear
even across different builds. The domain also fronts differently (`server: Vercel` on
alpha, `server: cloudflare` on the deployment URL), though both carry `x-vercel-id`.

No unauthenticated surface on this app exposes a build or version identifier —
`/healthz` returns a static three-field JSON with no version — so an anonymous probe
cannot close this gap.

Two ways to close it definitively, whichever is cheaper at the time:

1. **Vercel project aliases via API/CLI** — read which deployment the alpha hostname
   points at. Preferred: no metered browser quota.
2. **Read the widget resource over an authenticated MCP session** and grep the served HTML
   for the safe-area composition. This is the strongest check because it observes the
   actual artefact the screenshot will show, and it happens naturally as a side effect of
   the capture session anyway.

**Practical bar for the shoot:** whoever captures should confirm the rendered banner shows
the corrected spacing in the shot itself. That is a visual check on the very artefact
being submitted, which outranks any inference from version numbers. The version chain
above establishes that the corrected build *exists and is deployed*; the shot confirms it
is *what was photographed*.

## Part 2 — requirements (verified 2026-07-30, twice, independently)

Hard requirements from the live MCP Apps submission page:

- **3–5 images**, PNG, **at least 1000px wide**, any shape.
- **Cropped to Oak's response only — the prompt must NOT be visible in the image.**
- **Prompt text supplied separately, paired with each image.**
- No mobile variants. **No video, no GIF.**
- A carousel template is linked from the submission page (Anthropic MCP Apps Figma
  community file).

The clause binds because our connector serves a `ui://` widget resource, which makes it an
MCP App. This falsified the earlier "no screenshot requirement" conclusion; MCP-442
recorded the falsification and MCP-458 supersedes the cancelled MCP-293.

**The Figma template URL is not in our captured evidence** — every source says only that a
template "is linked from the page". I have not invented a URL. Retrieve it from the
submission page at form time; it is a convenience for framing, not a gate.

## Part 3 — the shot list

Prompts are outward-facing copy (they appear on the listing and are supplied to Anthropic),
so they are assembled from an approved source, not written here. All four below are
MCP-444 §10 verbatim — Aakesh's checked draft, each verified same-day as exercising a
different named tool.

MCP-458's bar is that each image shows "Oak doing something a teacher would want — a
lesson found, a unit sequence laid out, a quiz returned — with real curriculum content".

### Image 1 — lesson search · LOW RISK · recommended core

Paired prompt text:

```text
Find KS3 science lessons about photosynthesis
```

Tool exercised: `search`. Shows: a lesson found. This is the clearest single
demonstration of the core value and should lead the carousel.

### Image 2 — misconceptions · LOW RISK · recommended core

Paired prompt text:

```text
Which misconceptions should I plan for when teaching fractions in year 3?
```

Tool exercised: `get-misconception-graph`. Shows: documented pupil misconceptions —
planning value that no generic assistant can supply, and the most distinctive thing Oak
serves.

### Image 3 — progression across years · LOW RISK · recommended core

Paired prompt text:

```text
How does number develop from year 1 to year 11 in maths?
```

Tool exercised: `get-thread-progressions`. Shows: a sequence laid out across year groups.

### Image 4 — lesson resources · **CARRIES A REAL ON-CAMERA RISK** · shoot only if pre-verified

Paired prompt text:

```text
Get me the worksheet and slides for Oak's lesson on food chains
```

Tools exercised: `get-lessons-assets` + `download-asset`. Shows: downloadable resources.

**Risk, and why it matters more than a normal one.** MCP-328 (open, High) records that the
lesson advertised in our own assets schema is licence-restricted, so the documented happy
path returns *"Resource unavailable due to copyright restriction."* MCP-328's own impact
note is the point: that failure is **misleading about Oak** — it tells a teacher Oak's
resources are copyright-restricted when the overwhelming majority are freely available
under OGL v3.0.

Whether the *food-chains* lesson's assets are restricted is unverified. So this prompt may
render either a genuine resource list or a copyright refusal, and the refusal is precisely
the frame we must not publish in a directory carousel.

**Disposition: run this prompt and inspect the response BEFORE deciding to shoot it.** If
it returns real assets, shoot it — it is the strongest "ready-made resources" shot we have.
If it returns a restriction notice, drop it; three images satisfies the 3–5 requirement, and
Images 1–3 are sufficient without it. Do not attempt to fix the underlying defect here —
MCP-328 is owned elsewhere.

**Pre-verification was attempted and is not available from this lane** — recorded so a
successor does not repeat the probe. Checking the food-chains lesson's asset availability
directly against the Curriculum API returns **HTTP 401**: the endpoint requires
`OAK_API_KEY`, and this worktree carries no local env file. So the condition cannot be
retired ahead of time by an unauthenticated read. It resolves at capture time (or at paste
time for the listing's example prompts), where a connected client supplies the auth as a
side effect of the session that needs it anyway.

### The gap I did not fill

MCP-458's "what good looks like" names **"a quiz returned"**, and no approved-source prompt
covers quizzes. I have not written one, because example prompts are outward-facing copy and
this lane does not invent it. If a quiz shot is wanted, that prompt is Jim's authorship —
flagging it rather than filling it.

Images 1–3 already cover "a lesson found" and "a unit sequence laid out", so the gap costs
coverage of one illustrative example, not compliance.

## Blockers — capture has not been attempted

One remains. The first was discharged during the session and is recorded here with its
resolution, because the reasoning matters more than the outcome.

**1. A connected client rendering the widget — DISCHARGED, with one access condition.**

**Target: production, `https://www.thenational.academy/mcp`** (Director ruling ~16:56Z,
superseding an earlier preview-first ruling of ~16:20Z). Production has served the closed beta
through Claude for a week, so it is a proven vehicle — better than a preview on provenance (it
is the app the listing points at), with no expiry, and it **decouples this ticket from the Clerk
cutover entirely**.

That decoupling is the load-bearing point: **the widget renders identically either side of the
Clerk realm switch.** The realm governs *who can sign in*, not what the panel looks like. So
images shot before the cutover stay accurate after it.

**The access condition is on the photographer, not the photograph.** While production
authenticates against the development Clerk instance, that instance's auth is passwordless and
**allowlisted** — so connecting needs an account on the allowlist, not any Oak account. The
owner has run the beta on it all week and is therefore almost certainly allowlisted; this bites
only if the session were delegated, where it would present as an auth wall that looks like a
defect and is not one. The condition **disappears at the cutover**, after which any Oak account
works.

*Volatile — re-check rather than inherit.* Production switched to the production Clerk realm at
~17:02Z and was reverted to the development realm at ~17:19Z during an unrelated connector
incident, so the allowlist condition is live as written. Before capture, read `jwks_uri` from
`/.well-known/oauth-authorization-server` **on both hosts, requiring agreement across
consecutive samples** — a mid-rollout read can disagree between hosts and yield a confident
wrong answer (observed 2026-08-05 17:19:21Z, where the two hosts disagreed for 27 seconds).

**2. The metered Oak Chrome session — THE ONLY REMAINING INPUT.** Capturing a Claude client UI
means driving the Oak-account claude.ai session, which is a metered Premium team seat under
`oak-chrome-session-is-metered` ("preserve it for key interactions with Oak related
systems"), held pending the owner's word. It has not been driven and will not be without that
word. Per the same rule, reporting a named quota-priced unknown is the correct output rather
than silent spend.

Everything not gated on that one input is complete: the deployment verdict, the requirements
checklist, the shot list with paired prompt text, the risk on Image 4, and the named gap. The
target endpoint is settled, the vehicle is proven, and the shot list is written — the missing
input is a browser session, not a decision.

## Who wrote this, and how

Assembled by an AI agent — Breeze tracks Troposphere, a Claude session on the MCP-507
submission-prep lane, 2026-08-05. The deployment verdict is first-hand (GitHub deployments
API, git ancestry, live HTTP probes) rather than inherited from MCP-458's assertion. Prompts
are MCP-444 §10 verbatim; no outward-facing copy was invented.
