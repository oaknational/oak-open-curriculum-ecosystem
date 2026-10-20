# Packaging the Oak MCP app for ChatGPT — submission gap report

**Ticket:** MCP-636 · **Date:** 2026-08-19 · **Repo HEAD:** `SHA:05cca303f`
**Author:** Implementer seat, `mcp-submission-drive`. Agent-written, not typed by MG.
**Status:** investigation complete. No product code changed.

---

## Read this first: the ground moved

**"ChatGPT Apps" no longer exists under that name.** `developers.openai.com/apps-sdk`
now **301-redirects to `developers.openai.com/plugins`**. The surface is
**"plugins"**, the portal is `platform.openai.com/plugins`, and a plugin may be
skills-only, MCP-only, or both. All requirements below are read from the live
`/plugins` documentation today, not from the Apps SDK vocabulary the tickets and
the Codex skill still use.

This matters beyond naming: the current docs publish a **named error code for
every hard blocker**, which lets us separate what actually stops a submission
from what merely reads badly on a form. That distinction reorders the whole
ticket.

---

## The two headline answers

### 1. Are we there yet? — No, and the real blockers are not the ones on the ticket

Against OpenAI's published blocker list, Oak is **strong where MCP-636 feared it
was weak, and unprepared where nothing has been ticketed at all.**

- **Tool annotations: MET.** All 40 exposed tools set all three hints explicitly.
  This was the ticket's headline blocker. It is clean.
- **Widget compatibility: MET, and the architecture bet paid off.** ChatGPT has
  been "fully compatible with the MCP Apps spec" since **2026-02-22**. ADR-141's
  deletion of every `openai/*` key was correct.
- **OIDC / `openid`: NOT a submission blocker at all.** It gates one optional
  feature. But it conceals a genuine flow-breaking risk — see below.
- **Unticketed blockers exist**, including a required demo-recording URL,
  per-annotation justifications, organisation identity verification, a required
  `_meta.ui.domain` on the widget, and four HTTPS listing URLs.

### 2. Is it a code-only set of fixes? — No. Three things sit outside the repo

1. **Domain verification** — a token served at a `.well-known` path on the MCP
   host. Measured today: `.well-known/*` is **not** generally routed to this app,
   so this needs a **Cloudflare edge rule** as well as a route.
2. **A Clerk instance setting** (`default_scopes`) — a configuration write to
   shared Oak auth infrastructure, needed to stop ChatGPT's OAuth link failing.
3. **Business/process items** — organisation identity verification, a demo
   recording, privacy and terms URLs, logo and icon assets, demo credentials.

Everything else is code, and most of it is small.

---

## ⚠️ The finding that matters most, and it is not on any ticket

**Oak's advertised scopes and Oak's granted scopes disagree, and OpenAI's
documentation says ChatGPT will walk straight into the gap.**

Measured today against production:

- Our proxied AS metadata at `/.well-known/oauth-authorization-server` advertises
  Clerk's full list: `openid, profile, email, public_metadata, private_metadata,
  offline_access, user:org:read`.
- A client that registers **without naming its scopes** is granted
  `email offline_access profile` — **no `openid`** — and is then **refused** when
  it requests `openid`.

OpenAI's authentication documentation, verbatim:

> If your provider advertises OIDC scopes (for example, `openid`, `email`,
> `profile`) in `scopes_supported` … **ChatGPT requests those scopes by default
> during the OAuth flow.** Some identity providers may not enable advertised OIDC
> scopes by default.

**So the predicted outcome is that ChatGPT requests `openid` because we advertise
it, is refused because we do not grant it, and the error is delivered by redirect
to ChatGPT's callback — bypassing our server entirely.** That is the exact silent
failure ADR-113 documented against Cursor, pointed at ChatGPT.

This is **not** the optional enterprise-domain feature. This is the OAuth link
itself. It is unproven against ChatGPT specifically — see the limits section —
but it is the highest-value thing in this report and it belongs on a ticket.

---

## The `openid` question — the conflict dissolves, but the risk relocates

### What the estate believed

`mcp-security-policy.ts` excludes `openid`, reasoning that Clerk accepts it at
registration and returns `error=invalid_scope` at authorisation. ADR-113 records
the same, dated **2026-02-21**.

### What is true today — measured, control-validated

Three throwaway clients were registered through our own public DCR endpoint and
probed at Clerk's authorisation endpoint. **No sign-in was completed and no token
was ever issued.**

| Client | Registered with | Granted | `openid` at authorisation |
|---|---|---|---|
| A | `openid email` | `email offline_access openid` | **accepted** |
| B | `openid email profile offline_access` | all four | **accepted** |
| C | *(no `scope` field)* | `email offline_access profile` | **REJECTED** |

Client A was additionally refused `profile`, `public_metadata`,
`private_metadata` and `user:org:read` — none of which it had registered.

### Why this is trustworthy

**The first probe stage was discarded as an invalid instrument.** Clerk's
`/oauth/authorize` forwards a deliberately fake scope onward unchanged, so
"`openid` was accepted" there proved nothing. Validation happens one hop later at
`/oauth/authorize/continue`, where a control scope that must fail reliably
produces:

```text
error=invalid_scope
error_description=The requested scope is invalid, unknown, or malformed.
  The OAuth 2.0 Client is not allowed to request scope 'definitely_not_a_real_scope_636'.
```

That is **the exact error string ADR-113 recorded**, fired on demand — and
`openid` does not fire it for a client that registered with it.

### The corrected mechanism

> **Clerk grants a dynamically-registered client exactly the scopes named in its
> registration — or, if it names none, the instance's `default_scopes`.
> Requesting anything beyond that set returns `invalid_scope`, with a message
> that reads as though the scope itself were unsupported. Oak's instance default
> does not include `openid`.**

Corroborated independently: Clerk's changelog for **2026-07-22** describes this
exact failure as a client-side omission — *"OAuth clients such as ChatGPT or
Claude don't include the scope parameter in their registration request, which can
result in an `invalid_scope` error"* — and an independent reproduction in
`anthropics/claude-code#67714` shows a scope-less DCR granted
`email offline_access profile` while a scope-carrying DCR gets `openid` and
authorises successfully.

**ADR-113 appears to have been written from the registration response's HTTP
status rather than its `scope` field.** A 201 was read as "Clerk accepted
`openid`" when the body said otherwise.

### The lever, and why it is not ours

Clerk shipped an instance-level **`default_scopes`** setting on **2026-07-22** for
precisely this. Clerk's own Express MCP guide gives the recommended value
including `openid`:

```sh
npx clerk@latest api instance/oauth_application_settings -X PATCH \
  -d '{"default_scopes":["openid","profile","email"]}'
```

**This is a write to shared Oak auth infrastructure. Under the standing Clerk
read-only constraint it is out of bounds for an agent seat and needs the owner.**

**A limitation Clerk states explicitly:** *"Clerk doesn't override the `scope`
value when a client provides one."* `default_scopes` fills the gap only for
clients that omit `scope` **entirely**. If ChatGPT sends a *partial* scope, the
setting will not help. **Which of the two ChatGPT does is the single
highest-value unknown in this report.**

### Two clean options

- **Grant what we advertise** — set `default_scopes` to include `openid`. Aligns
  advertisement with reality and unlocks the enterprise feature.
- **Advertise only what we grant** — stop the proxy passing Clerk's
  `scopes_supported` through unfiltered. Removes the trap without touching Clerk,
  and permanently forgoes the enterprise-domain feature.

Both are defensible. **The current state — advertising a scope we refuse to
grant — is the one position that is not.**

---

## Requirement-by-requirement, against OpenAI's published blocker list

**BLOCKER** = OpenAI publishes a named validation error code, or says "required".

| Requirement | State | Blocker? | Code-only? |
|---|---|---|---|
| All three tool hints set explicitly | **MET — 40/40, proven** | Blocker | n/a |
| A written **justification** per annotation | **NOT DONE** | Blocker | Not code |
| Streamable HTTP transport, stable `/mcp` URL | **MET** | Blocker | n/a |
| AS metadata advertises `S256` | **MET** — measured | Blocker | n/a |
| Domain verification token served | **GAP — no mechanism** | Blocker | **NO** |
| Successful production tool scan | Untested | Blocker | Needs demo creds |
| **Demo-recording URL** | **NOT DONE** | Blocker | Not code |
| Organisation identity verification | **UNKNOWN** | Blocker | Not code |
| Privacy policy + terms + website + support URLs | **UNKNOWN** | Blocker | Not code |
| Logo + composer icon, brand-colour contrast | **UNKNOWN** | Blocker | Not code |
| Display name ≤30, short description ≤30 chars | Not authored | Blocker | Not code |
| Exactly 5 positive + 3 negative test cases | Not authored | Blocker | Not code |
| Project **not** on EU data residency | **UNKNOWN — check** | Blocker | Not code |
| `_meta.ui.domain` on the widget | **ABSENT** | Docs say required | Yes |
| Widget renders via `_meta.ui.*` | **MET** — ChatGPT compatible since 2026-02-22 | n/a | n/a |
| Widget CSP narrow, no wildcards | **MET** | Recommendation | n/a |
| `openid` + `email` scopes granted | **GAP — see above** | *Recommendation, but see the flow risk* | **NO** |
| OIDC discovery document | **GAP** — 404 | Recommendation | Yes |
| userinfo endpoint advertised | **GAP** — Clerk serves one, we do not advertise it | Recommendation | Yes |
| `outputSchema` on every tool | **GAP on all 40** | Recommendation | Yes |

---

## Tool hints — MET, and MCP-636's numbers were wrong

**All 40 exposed tools set `readOnlyHint`, `openWorldHint` and `destructiveHint`
as explicit literal booleans**, plus `idempotentHint` and `title`. Three
mechanisms guarantee it:

- **Generated tools (29):** `emit-index.ts:131-141` pushes the four hint lines
  **unconditionally** — no branch, no per-tool config.
- **Hand-authored aggregated tools (10 live):** `definitions.ts:71-83` types all
  four as **non-optional `boolean`** under a `satisfies` clause. An omission
  fails typecheck.
- **App-local tool (1):** `oak-under-the-hood-tool.ts:172-177`, literal inline.

Proven end-to-end by `handlers-tool-registration.integration.test.ts:166-192`,
which walks the real `registerTool` calls against non-optional `z.boolean()`, and
by the CI-pinned `served-tool-table.md`, generated from a real `client.listTools()`.

### Corrections to MCP-636

- **"44/44/42 files carry them" is not reproducible.** Actual counts over
  TypeScript in `apps/` + `packages/` are **60 / 60 / 58**; excluding tests, a
  flat **47 / 47 / 47**. The two-file gap is two *test* files asserting only some
  hints. **No tool descriptor is missing any hint.** The ticket's inference was
  right; its numbers were not.
- **The exposed tool count is 40, not 44** — 29 generated + 10 live aggregated +
  1 app-local. Three declared tools (`get-eef-evidence`, `user-search`,
  `user-search-query`) are dormant and never registered.

### What is still missing

**Justifications.** OpenAI requires a written justification for every annotation
value (`justification_required`), and states that a justification cannot override
an annotation. This is exactly what the `chatgpt-app-submission` skill generates,
and it is the strongest reason to run it.

**A wire-level test.** No e2e asserts all three hints on every tool over the
wire; coverage lives at the registration walk and the pinned artefact. The repo's
own `app-submission-standards.plan.md` §5.3 asked for this and it is only partly
discharged. Worth closing — it is the artefact a reviewer would be shown.

---

## `outputSchema` — absent on all 40, and MCP-636's claim is inverted

**No exposed tool declares an `outputSchema`, including `oak-under-the-hood`.**

MCP-636 says "only `oak-under-the-hood-tool.ts` declares one". That is
**backwards**: that file is the one place that *documents the deliberate absence*
of an outputSchema, and its own test asserts
`expect(config).not.toHaveProperty('outputSchema')`. The claim looks like a
`grep -l` hit read with its sense inverted.

The absence is structural — `handlers.ts:237-242` builds the registration config
from exactly four keys.

**The cheap win:** the material already exists. `emit-index.ts:114-115` already
emits `toolOutputJsonSchema` (the 200-response JSON Schema) onto every generated
descriptor; it is simply never forwarded to MCP.

**Two caveats that make this bigger than metadata.** Declaring `outputSchema`
obliges the server to return matching `structuredContent`. And OpenAI's own
wording is conditional — *"Declare `outputSchema` for any tool that returns
`structuredContent`"* — with **no error code**. It is correctly a warning, and
should be its own bounded slice.

---

## Widget — ADR-141 vindicated, with two new gaps

**ChatGPT reads the standard MCP Apps `_meta.ui.*` keys.** OpenAI's changelog,
**2026-02-22**: *"ChatGPT is now fully compatible with the MCP Apps spec."* The
current reference goes further and inverts the old direction of travel:
`_meta["openai/outputTemplate"]` is now documented as an *"OpenAI-specific
optional/compatibility alias"*, `openai/widgetCSP` as *"legacy … superseded by
`_meta.ui.csp`"*, and `openai/visibility` was **deprecated on 2026-07-21** in
favour of `_meta.ui.visibility`. Oak's MIME type `text/html;profile=mcp-app` is
what the current docs use; `text/html+skybridge` appears **zero times** in the
entire current documentation set.

**ADR-141's recorded bet was right, and Oak is on the preferred path.** This was
the assumption whose failure would have been most expensive; it holds.

**The CSP itself is genuinely narrow** — `resourceDomains` of
`fonts.googleapis.com` and `fonts.gstatic.com`, both provably required (Lexend is
imported from Google Fonts and there is no `@font-face` in the bundle);
`connectDomains` correctly omitted because the widget performs no `fetch`,
`WebSocket` or `EventSource` calls at all. No wildcards, no unused domains.

### Two new gaps

1. **`_meta.ui.domain` is absent and the docs call it required.** Verbatim:
   *"Dedicated origin for hosted components (required when submitting a plugin
   with UI; must be unique per plugin)."* Oak's `WIDGET_UI_META` declares only
   `csp` and `prefersBorder`. There is **no matching error code** in the published
   table, so enforcement is unconfirmed — but "required" should be treated as
   required. **Our own `mcp-expert` sub-agent template has drifted here**, saying
   `_meta.ui.domain` is only needed for direct cross-origin `fetch()`. That
   template should be corrected.
2. **`redirect_domains` has no standard equivalent.** OpenAI states
   `_meta.ui.csp` does **not** support `redirect_domains`, and that allowlisting
   host-mediated external links still requires
   `_meta["openai/widgetCSP"].redirect_domains`. **Oak's widget does open
   external links** — `App.tsx:81` calls `app.openLink({ url })` to
   `www.thenational.academy`. Whether the MCP Apps `openLink` maps onto the
   OpenAI path that needs this allowlist is **not settled by the public docs**.
   If it does, this is the single justified `openai/*` exception to ADR-141 and
   the ADR should record it rather than have a seat quietly reintroduce a vendor
   key.

---

## Domain verification — the mechanism is a route, not a DNS record

This is better specified than the ticket assumed, and slightly more tractable.

- **Mechanism:** serve the token as the **entire plain-text response body** at
  `https://<challenge-base-host>/.well-known/openai-apps-challenge`. Not JSON,
  not a list, one token. **Not a DNS TXT record.**
- **What is verified:** the host of the **MCP server** — `www.thenational.academy`
  — not the marketing site. The optional Challenge Base URL may be *"the MCP host
  name or a parent host name"*, so the apex is available if wanted.
- **Blocker code:** `domain_verification_required`.

**Why it is still not code-only.** Measured today: `/.well-known/openai-apps-challenge`
and a random `/.well-known/…` path both return the **Oak website's 404**, while
the three OAuth `.well-known` paths return the app's JSON. So `.well-known/*` is
**not** generally routed to this app — the OAuth paths reach it through specific
Cloudflare rules that are **not version-controlled in this repository**. A new
challenge path needs that edge rule extended.

A second trap: `static-content.ts:145-152` leaves `dotfiles` unset and `send`
defaults it to `'ignore'`, so a file dropped in `public/` would silently not
serve. This wants an explicit Express route, not a static file.

**Shape of the fix:** one small Express route in this repo, plus one Cloudflare
edge-rule change owned elsewhere, plus the token from the portal. **Start the
edge-rule request early — it is the only item with an unbounded external lead
time.**

---

## OIDC discovery and userinfo — a recommendation, not a blocker

**This is the correction that most changes MCP-636's priority ordering.** OIDC is
required **only** to enable the optional workspace-domain-restriction feature.
Three independent grounds:

1. The requirement sits under the heading *"Support workspace domain
   restrictions"*, introduced by the conditional *"To support this protection…"*.
2. The submission page repeats the condition: *"To support workspace domain
   restrictions for a plugin that uses OAuth…"*.
3. **There is no error code for it.** The published table has codes for
   annotations and domain verification — the other two items in Oak's portal
   feedback — and none for OIDC, userinfo, or the `openid`/`email` scopes.

**What is actually lost without it:** exactly one thing. A ChatGPT
Enterprise/Business workspace that has verified an email domain cannot bind a
user's corporate identity to that workspace. It does not block submission,
publication, discovery, or ordinary use. **MCP-623's reading of this was
correct.**

Current state, measured:

- `www.thenational.academy/.well-known/openid-configuration` → **404**.
- Our AS metadata → 200, carrying `S256` (a genuine hard requirement — servers
  whose AS metadata omits it are *"unsupported"*), but **no `userinfo_endpoint`**.
- `clerk.thenational.academy/.well-known/openid-configuration` → 200, advertising
  `userinfo_endpoint` and `email_verified` in `claims_supported`.
- `clerk.thenational.academy/oauth/userinfo` unauthenticated → **401**. It exists
  and it guards.

**A cross-origin AS is explicitly the documented design** — OpenAI's own example
uses a separate `auth.yourcompany.com` — and **ChatGPT follows the RFC 9728
`authorization_servers` pointer**, accepting *either*
`/.well-known/oauth-authorization-server` **or** `/.well-known/openid-configuration`
at the issuer. So the discovery document does **not** have to live on the MCP
server's domain.

Two exact-match constraints that will bite if this is taken up:

- The `issuer` in the discovery document must be **byte-identical** to the entry
  in `authorization_servers`. No normalisation of trailing slashes, ports or case.
- `authorization_response_iss_parameter_supported: true` must only be set if `iss`
  is returned on **every** authorization response including errors. Our metadata
  currently asserts `true` — inherited from Clerk, unverified by us. Getting this
  wrong changes which redirect URI ChatGPT uses.

Supporting facts that make the work cheap: `clerk-skip-surfaces.ts:48` **already
lists** `/.well-known/openid-configuration` as an auth-skip path (the route is
anticipated; only the handler is missing), and `oauth-proxy-upstream.ts:34`
**already parses** `userinfo_endpoint` from Clerk's metadata as an optional field
before dropping it.

**MCP-623 already owns this surface and its analysis is sound.** This report
confirms its measurements independently and adds the scope correction.

---

## Blockers nobody has ticketed

Every one of these is a published blocker, and none appears on MCP-636, MCP-629,
MCP-623 or MCP-107:

- **A demo-recording URL** showing the main use cases and tools across supported
  platforms.
- **A written justification per annotation** on every tool.
- **Organisation identity verification** in the Platform dashboard. *"Publishing
  under an unverified individual or business name will result in rejection."*
- **The submitter needs Apps Management → Write** (`api.apps.write`).
- **Reviewer demo credentials** that work with **no MFA, no SMS, no email
  confirmation, no private-network access** — and Oak's `tools/list` requires
  auth, so the reviewer cannot see the surface without them.
- **The OpenAI project must not use EU data residency.** *"Projects with EU data
  residency cannot submit plugins with MCP servers for review."* This is a
  property of the **OpenAI platform project**, not Oak's hosting. **Worth
  checking before anything else — it could invalidate the submitting account.**
- Website, support, **privacy policy** and **terms** URLs, HTTPS, ≤1,024 chars,
  matching the publisher identity.
- Logo and composer icon (square, ≥48×48, ≤5 MiB) and brand colour meeting
  **≥2:1 contrast** against white, with a dark variant against `#212121`.
- ≤3 starter prompts, ≤128 chars each. Screenshots, if provided, exactly **706 px
  wide, 400–860 px tall**, one per starter prompt.
- Category from a fixed list — **`Education & Research`** is Oak's.
- **The MCP server origin is immutable across versions.** Only the path may
  change; changing scheme/host/port requires a brand-new submission. **This makes
  the paused MCP-622 subdomain decision a genuine ordering constraint** — decide
  the host *before* submitting, or be locked to it.

Documented rejection reasons, of which two bear directly on Oak: outputs must not
*"offer extraneous information that is irrelevant to the request, including
personal identifiers"*, and all test cases must pass on **every** supported
surface — **ChatGPT and Codex**.

---

## Sequence

1. **Check the EU data-residency status of the OpenAI project.** One lookup; it
   can invalidate everything downstream.
2. **Resolve the advertised-vs-granted scope mismatch.** Either set Clerk's
   `default_scopes` or stop advertising what we do not grant. This is the live
   flow risk, not a form warning.
3. **Start the Cloudflare edge-rule request for the challenge path.** Longest
   external lead time.
4. **Confirm the MCP host** (MCP-622) before submitting — the origin is immutable
   afterwards.
5. **Run the `chatgpt-app-submission` skill** to generate annotations
   justifications, app info and the 5+3 test cases. Do not let it auto-apply hint
   edits.
6. **Prove the signed-in auth leg** — a real token carrying `openid`, accepted at
   Clerk's userinfo, returning `email_verified: true`.
7. **Publish OIDC discovery + advertise `userinfo_endpoint`** (MCP-623).
8. **Add `_meta.ui.domain`**, and settle the `redirect_domains` question.
9. **`outputSchema`** as a separate slice, priced with the `structuredContent`
   obligation.
10. **The business items** — demo recording, identity verification, listing URLs,
    assets, demo credentials.

---

## What needs the owner, separated from what a seat can do

### Needs the owner or someone outside the team

- **The Clerk `default_scopes` write.** Shared auth infrastructure; out of bounds
  for a seat under the standing read-only constraint.
- **The Cloudflare edge rule** for the challenge path.
- **Organisation identity verification, the demo recording, privacy/terms URLs,
  brand assets, and reviewer demo credentials.**
- **The EU data-residency check** on the OpenAI project.
- **The `openid` policy reversal itself.** It is documented in a shipped ADR and
  enforced by a live standing instruction on MCP-345. A seat should not reverse it
  on one probe, however well-controlled.
- **Whether Oak wants the enterprise-domain feature at all.** MCP-623 makes the
  honest case that a free public curriculum service has little use for it, and
  that the reason to do it is that it clears a warning a reviewer reads. That is
  a call on effort, not an engineering blocker.
- **The MCP-622 host decision**, now that the origin is known to be immutable.

### A seat can do

- The `.well-known/openai-apps-challenge` route (the edge rule is separate).
- Publish `/.well-known/openid-configuration` and advertise `userinfo_endpoint`.
- Add `_meta.ui.domain`.
- The wire-level three-hint e2e test.
- The `outputSchema` slice.
- Run the submission skill and produce the JSON from true values.
- Correct the stale records listed below.

---

## ⚠️ Coordination — MCP-345 is live and this report touches its premise

A separate seat is working **MCP-345** (adding the `profile` scope) under a
standing instruction, carried as a bolded banner, that **`openid` must NOT be
added.** That instruction stays in force as a control. **Nothing here authorises
a change to `mcp-security-policy.ts`, and no such change was made.**

Three findings bear on that lane:

1. **The banner's stated reason is disproven.** It quotes the Clerk
   `invalid_scope` behaviour as the ground for exclusion. That behaviour does not
   reproduce as described.
2. **`profile` is already in Oak's Clerk default grant** (`email offline_access
   profile`) — so a scope-less client already has it. That may make part of
   MCP-345's work unnecessary, and is worth knowing before it lands.
3. **The real risk is registered-vs-requested**, not which scope is named. A
   client can only use scopes it registered with. Advertising in the PRM without
   grantability reproduces the silent failure for *any* scope.

Routing this is the Director's call, not this seat's.

---

## Stale records this investigation found

Not corrected here — this was a no-code-change investigation — but each is wrong
in a way that will mislead the next reader:

- **ADR-113 §Troubleshooting** — the root cause is misdiagnosed, and its
  implementation reference points at
  `packages/sdks/oak-curriculum-sdk/code-generation/mcp-security-policy.ts`,
  which no longer exists. The file is now under `oak-sdk-codegen/`.
- **`mcp-security-policy.ts:38-48`** — the doc comment repeats the misdiagnosis.
- **`mcp-security-policy.unit.test.ts:49`** — asserts `openid` is absent. It is
  the guard that will catch any change here, and would need inverting.
- **`packages/sdks/oak-curriculum-sdk/docs/mcp/README.md:73,107`** — still
  documents required scopes as `openid, email`, inconsistent with the shipped
  policy in the *other* direction.
- **`.agent/sub-agents/templates/mcp-expert.md:458`** — says `_meta.ui.domain` is
  only needed for cross-origin `fetch()`; OpenAI says it is required for any UI
  submission.
- **`app-submission-standards.plan.md` §5.3** — says "all 34 tools"; the served
  surface is now 40.
- **MCP-629 and the Codex skill** both use "ChatGPT App"; the surface is now
  "plugins" and the skill should be re-pointed at `/plugins`.

---

## Evidence and limits

**Measured first-hand today against production:** every `.well-known` response on
`www.thenational.academy` and `clerk.thenational.academy`; the unauthenticated
userinfo 401; three DCR registrations and the full scope matrix at Clerk's
authorisation endpoint **including a control scope that must fail**; the
unauthenticated `tools/list` 401 and its `WWW-Authenticate` header; the
`.well-known` routing test that shows the challenge path is not routed to this
app.

**Read at source:** `mcp-security-policy.ts`, ADR-113, ADR-141, `auth-routes.ts`,
`oauth-proxy-upstream.ts`, `clerk-skip-surfaces.ts`, `register-widget-resource.ts`,
the tool-hint generator and its tests, the widget source, and the
`chatgpt-app-submission` skill itself.

**Fetched live today:** OpenAI's `/plugins` documentation set including the
submission-errors table, and Clerk's changelog and MCP guides.

### Not verified — stated plainly

- **The signed-in auth leg.** No sign-in was completed; no token was issued. That
  a token carrying `openid` is granted, and that Clerk's userinfo accepts an
  Oak-proxied token and returns `email_verified: true`, are **both unproven**.
- **Whether ChatGPT omits `scope` entirely or sends a partial value** at
  registration. This decides whether `default_scopes` is sufficient, and it is
  the highest-value unknown remaining.
- **Whether ChatGPT actually fails against Oak today.** The predicted failure is
  built from Oak's measured configuration plus OpenAI's documented behaviour. It
  is a strong inference, not an observation.
- Whether `/oauth/userinfo` requires `openid` in the token or whether an
  `email`-scoped token suffices. Clerk's docs never give the per-property mapping.
- Whether `_meta.ui.domain` omission is enforced by a validation error code.
- Whether MCP Apps `openLink` needs `openai/widgetCSP.redirect_domains`.
- Oak's current status on: EU data residency, organisation identity verification,
  listing URLs, brand assets. All are portal/account facts not visible from here.
- **No per-server tool limit, rate limit, minimum MCP protocol version, or review
  SLA is published.** Do not let anyone fill these by analogy — with 40 tools,
  the absence of a documented cap is worth knowing is an *absence*, not a
  clearance.

### Probe disclosure

Three throwaway OAuth clients were registered through the public DCR endpoint
(`Oak MCP-636 readiness probe`, `… probe B`, `… probe C`, redirect URI
`http://localhost:8765/callback`). This is the same unauthenticated endpoint every
MCP client uses. **No sign-in was completed, no authorisation code or token was
ever issued**, and nothing was written to Clerk beyond those three client records.
They can be deleted from the Clerk dashboard.
