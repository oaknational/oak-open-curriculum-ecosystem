# ADR-228: Agent-web standards — six dispositions, and the standing of a vendor scorecard

- **Status:** Accepted (2026-09-09)
- **Date:** 2026-09-09
- **Deciders:** Matthew Gregory (owner) asked that the day's agent-readiness
  standards decisions be recorded — "record/update decisions in ADRs if
  necessary"; the dispositions were taken at the Director seat and its
  implementer lane, from the measurements cited below
- **Related:** [ADR-223](223-perishable-claims-carry-risk-based-freshness-metadata.md)
  — every claim here carries its measurement date because every one of them is
  perishable

## Context

Oak's public estate is being read by agents. Six emerging agent-web standards
came up for disposition on 2026-09-09, several of them surfaced by a scanner at
`isitagentready.com`, and the estate had no single record saying which Oak
adopts and why. Without one, each surface gets re-argued from whatever evidence
the next reader happens to find, and a scanner row reads as an obligation.

**The scanner is one vendor's product, not a conformance standard.**
`isitagentready.com` is operated by Cloudflare: the page's own liability
disclaimer names Cloudflare, and every outbound link measured on 2026-09-09
resolves to Cloudflare property — `cloudflare.com/agents/`,
`cloudflare.com/content-signals/`,
`cloudflare.com/fundamentals/reference/markdown-for-agents/`,
`cloudflare.com/web-bot-auth/`, plus its privacy policy and website terms. Its
sole remaining gate between `www` and the next scored level is Cloudflare's own
Content Signals initiative, which Cloudflare's own lead acknowledges is not
standardised and which the IETF AIPREF working group is separately drafting
towards a Proposed Standard. A scorecard whose unmet rows are its author's
products is a marketing surface with a useful checklist attached. It is worth
reading as a prompt and worthless as an authority, and it does not set Oak's
roadmap.

This ADR is therefore not a conformance exercise. It applies the estate's
existing origin-truth principle — metadata lives on the host that owns the
capability, and a surface earns its place by making Oak's public machine estate
more truthful and useful, never by satisfying a scanner row.

## Decision

Every disposition below answers three questions in order.

1. **Does a body with change control stand behind it?** A named editor, a
   registry entry, a working group that has actually adopted the document.
2. **Does something Oak cares about consume it?** Measured consumers, not
   announced intentions.
3. **Would the claim be true?** Publishing a document is an assertion about
   Oak. An assertion an orchestrator will act on and Oak cannot honour is worse
   than silence.

A standard failing (3) is declined however well it scores on (1) and (2).

### 1. ARD (Agentic Resource Discovery) — adopt

The spec is v0.91, status "Proposal", dated 26 August 2026
(`agenticresourcediscovery.org/spec/`, read 2026-09-09). Contributing
organisations named on the site and in the spec include Microsoft, Google,
Hugging Face, GoDaddy, Cisco, Databricks, GitHub, Nvidia, Salesforce,
ServiceNow, Snowflake and AWS. No formal steering committee or oversight board
is named anywhere on the site or in the spec — the site says only that ARD "is
being developed by a working group with participants from Microsoft, Google,
Hugging Face, GoDaddy, and others". So ARD's governance is weaker than its
sponsor list suggests, and weaker than A2A's.

It is adopted anyway, because it passes test (2) decisively and test (3)
cleanly. Two live consumers were confirmed on 2026-09-09: GitHub's Agent Finder
for Copilot, shipped 2026-06-17 and stated by GitHub to implement ARD; and
`hf discover`, built into the Hugging Face CLI, whose client reads
`ai-catalog.json` and whose server offers semantic search over catalogued
skills and MCP servers. And the claim an ARD manifest makes is modest and true:
here are the machine resources this domain publishes, at these URLs. Oak has
those resources today.

**A correction that changes the implementation, measured 2026-09-09.** ARD
v0.91 renamed the discovery path. The spec says a consumer "MUST fetch
`/.well-known/ard.json`, and MUST honour a `rel="ard"` link", and describes
`/.well-known/ai-catalog.json` with the `ai-catalog` relation as its
_predecessor_, which a consumer "MAY additionally consult". The deployed
ecosystem has not followed the rename:

| Domain                      | `/.well-known/ai-catalog.json`     | `/.well-known/ard.json` |
| --------------------------- | ---------------------------------- | ----------------------- |
| `github.com`                | 200, `application/ai-catalog+json` | 404                     |
| `huggingface.co`            | 200, `application/ai-catalog+json` | 401                     |
| `developers.cloudflare.com` | 200, `application/ai-catalog+json` | 404                     |

`huggingface.co` also advertises the predecessor in a response header:
`Link: </.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/ai-catalog+json"`.
Not one of the three serves the v0.91 path. So an Oak manifest at `ard.json`
alone would be conformant and invisible, and one at `ai-catalog.json` alone
would be visible and non-conformant with the current spec. **Oak publishes
both, with identical content**, until the ecosystem converges. The
`.well-known` placement is correct for this file on its own merits: a site
catalogue is genuinely site-wide metadata.

_Revisit trigger:_ the three domains above serve `/.well-known/ard.json`, at
which point the predecessor copy is retired; or ARD reaches v1.0 with a named
governance body, at which point its governance row here is restated.

### 2. A2A — decline, on applicability only

A2A is the most genuinely ratified standard in this set, and the decline says
nothing against it.

Measured 2026-09-09: release v1.0.1, published 2026-05-28 (v1.0.0 preceded it
on 2026-03-12). The well-known URI suffix `agent-card.json` sits in the IANA
Well-Known URIs registry with status **permanent**, change controller **Linux
Foundation**, registered 2025-08-01, referencing
`a2a-protocol.org/latest/specification/` — verified against the registry page
with `security.txt` and `oauth-authorization-server` as control rows. The
project has joined the Agentic AI Foundation under the Linux Foundation.

It is declined because **Oak operates no agent**. An agent card is not a
description; it is an advertisement of a task endpoint that will accept
delegated work and do it. An orchestrator that reads one will act on it.
Publishing a card over nothing is a false advertisement, and it fails test (3)
outright — the only test that cannot be bought back with adoption numbers.

_Revisit trigger:_ Oak ships an agent with a task endpoint it intends third
parties to call. On that day this row is reopened, and the answer is expected
to be yes.

### 3. WebMCP — decline

The document at `webmachinelearning.github.io/webmcp/` is a Draft Community
Group Report dated 4 September 2026, published by the Web Machine Learning
Community Group, and states of itself: "It is not a W3C Standard nor is it on
the W3C Standards Track" (read 2026-09-09). Chrome's status is "Proposed" with
no origin trial and no ship milestone — carried from the same day's verification
pass, not re-measured for this record.

WebKit has taken a formal position against it. `WebKit/standards-positions`
issue 670, titled "WebMCP", is closed (2026-06-11) carrying the label
`position: oppose`, alongside `concerns: duplication`, `concerns: privacy`,
`concerns: security`, `concerns: internationalization`, `concerns: venue`,
`concerns: meaningful user consent` and `concerns: use cases` — verified
through the GitHub API on 2026-09-09. The duplication concern is the
substantive one, and the estate agrees with it: an agent-facing tool layer
bolted beside the DOM duplicates what HTML semantics and ARIA should already
carry, and a page that needs a second, agent-only description of itself is a
page whose first description is inadequate.

Mozilla has filed no position at all. Searches of `mozilla/standards-positions`
for "WebMCP" and for "modelContext" each returned zero on 2026-09-09, against a
control search for "WebGPU" in the same repository that returned two. So the
browser split is one formal objection and one silence, not one objection and one
endorsement.

A separate practical point: the API this estate previously tracked no longer
exists. The current draft defines `document.modelContext` with
`registerTool()` / `getTools()` / `executeTool()`, not the
`navigator.modelContext` / `provideContext` shape recorded earlier. Per-tool
registration is a different design, not a rename, so any sizing done from the
old description would have sized the wrong work.

_Revisit trigger:_ WebKit's position moves off `oppose`, or Chrome opens an
origin trial. Either would be evidence the duplication objection has been
answered rather than out-shipped.

### 4. DNS-AID — decline

`draft-mozleywilliams-dnsop-dnsaid-02`, "DNS for AI Discovery". Queried
against the IETF Datatracker API on 2026-09-09: revision `-02`, dated
2026-05-27, `stream: null`, no intended standards level, no standards level,
expiring **2026-11-28**, `draft-iesg` state `idexists` — "The IESG has not
started processing this draft, or has stopped processing it without
publication". The document is an individual submission. The `dnsop` in the
filename is the authors' convention and not evidence of working-group adoption
— a `name__contains=dnsaid` query returns exactly one document.

Adoption is zero. A 39-domain sweep on 2026-09-09 found nothing; that sweep's
per-domain list was not written to a tracked record, so an eleven-domain subset
was re-probed for this ADR — `_agent` TXT and SVCB records at `infoblox.com`,
`telekom.com`, `amazon.com` (the draft authors' own employers),
`cloudflare.com`, `github.com`, `huggingface.co`, `openai.com`,
`anthropic.com`, `microsoft.com`, `google.com` and `thenational.academy`. Every
one returned nothing, against controls (`_dmarc.cloudflare.com` TXT,
`google.com` TXT) that returned records.

A DNS record nobody resolves is not discovery, and Oak's discoverable resources
already have working entry points.

_Revisit trigger:_ the draft is working-group adopted, or a `-03` appears with
a stream assigned. Its 2026-11-28 expiry is the sharper one — a lapse closes
the item rather than reopening it.

### 5. MCP Server Card — decline, and this is right on the merits

The earlier "no" recorded on MCP-346 was correct, but its rationale — that the
extension is immature — is the weaker of the two available arguments and would
expire the moment the extension matured. **This ADR supersedes that rationale.**
The stronger argument is that the paths the scanner probes are wrong paths, and
would still be wrong paths after the extension stabilised.

The scanner probes `/.well-known/mcp.json`,
`/.well-known/mcp/server-card.json` and `/.well-known/mcp/server-cards.json`
(the probe list is carried from the same day's verification pass; the scanner
runs client-side and its path list was not re-extracted for this record). The
MCP extension's own discovery document lists both of those placement classes
under "Alternatives considered … not recommended" (read from
`modelcontextprotocol/ext-server-card`, `docs/discovery.md` §Alternatives
considered, 2026-09-09):

> The following placements were considered and **not** recommended:
>
> - **A `.well-known` URI** (e.g., `/.well-known/mcp/server-card`).
>   `.well-known` is for _site-wide_ metadata, whereas an individual server's
>   card is _application-level_ metadata.
> - **Nesting under a domain-root `/mcp/`** (e.g., `/mcp/server-card`).

The reserved and recommended location is `GET <streamable-http-url>/server-card`.
Serving any of the three scanner paths would move Oak away from the convention
the ecosystem is actually converging on, in exchange for a scorecard row.

The extension itself remains pre-official, measured 2026-09-09:

| Fact                                 | Measured value                                                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| SEP-2127 state                       | open, `CHANGES_REQUESTED`, last updated 2026-09-09T13:00:43Z                                                      |
| `ext-server-card` README status line | "Experimental. This work is for prototyping and feedback only, and is not an accepted or official MCP extension." |
| Prior core-spec attempt (PR #2652)   | closed unmerged, relaunched as this experimental extension                                                        |

**What has changed since the earlier assessment**, and it is the reason this row
is worth restating rather than leaving alone: two major operators now serve
conformant cards at the reserved path.

| Endpoint                                          | Result, 2026-09-09                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `https://api.githubcopilot.com/mcp/server-card`   | 200, `application/mcp-server-card+json`, `name: io.github.github/github-mcp-server`                                |
| `https://huggingface.co/mcp/server-card`          | 200, `application/mcp-server-card+json`, `name: huggingface.co/mcp`, version 0.4.18                                |
| `https://mcp.thenational.academy/mcp/server-card` | 406 — the request falls through to the MCP transport, which answers "Accept header must include text/event-stream" |

Both cards declare
`$schema: https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json`,
and both domains advertise them through their ARD/AI-catalog manifests. So the
convention has real deployments while the specification has none of its
formal gates. Oak waits; when it publishes, it publishes at
`<streamable-http-url>/server-card` and nowhere else, and Oak's endpoint
currently answering 406 there is the shape to fix rather than a second path to
invent.

_Revisit trigger:_ SEP-2127 merges, or a client Oak cares about consumes cards.
Either flips this to a build item at the reserved path — MCP-422 already holds
that shape.

### 6. authMd — change nothing

Oak already serves `auth.md` publicly on `open-api`
(`https://open-api.thenational.academy/auth.md`, 200, `text/markdown`, verified
2026-09-09; the capitalised `Auth.md` 404s, and lowercase is the convention).
It documents static-key authentication, the key-request route, and the
deliberate absence of OAuth, OIDC and dynamic client registration. Nothing
changes.

`auth.md` is a WorkOS vendor convention (`github.com/workos/auth.md`), pre-1.0,
with no standards body and no IETF document behind it. Oak serves it because it
is genuinely useful to an agent, not because anything requires it.

**The claim that `auth.md` requires OAuth Protected Resource Metadata is false**,
and the counter-example is live. Measured 2026-09-09:

| URL                                                         | Result               |
| ----------------------------------------------------------- | -------------------- |
| `https://workos.com/auth.md`                                | 200, `text/markdown` |
| `https://workos.com/.well-known/oauth-protected-resource`   | 404                  |
| `https://workos.com/.well-known/oauth-authorization-server` | 404                  |

`workos.com` — the convention's own author — passes the scanner's `auth.md`
check while failing both OAuth checks, and the scanner emits its own warning
saying so: "OAuth Protected Resource Metadata was not found; using auth.md
instructions only". The two are independent.

Oak's file fails the scanner's completeness check for a different reason
entirely: it honestly states that there is no machine-callable registration
endpoint, because there is not one. The only route to a green row is building
automated agent self-provisioning of API keys. That is a product decision about
who may obtain a key without a human in the loop, and it belongs to the owner
and to whoever accepts the abuse and cost exposure. It is not a conformance
gap, and it must not be executed as one.

_Revisit trigger:_ a product decision to offer automated key self-provisioning.
Documentation completeness gaps that do not require that decision — rate limits
and a support path — stay with MCP-427.

## Consequences

1. **The `www` ARD lane publishes two files, not one** — `/.well-known/ard.json`
   for spec conformance and `/.well-known/ai-catalog.json` for the consumers
   that exist, with identical content and a `Link: rel="ard"` header. Publishing
   only the v0.91 path would have been conformant and unread. This is the one
   finding here that changes work already in flight.
2. **Five scanner rows will stay red, deliberately**: A2A, WebMCP, DNS-AID, MCP
   Server Card, and `auth.md` completeness. This ADR is the answer when they are
   re-raised, and each red row now has a named trigger that would turn it green
   for a reason other than the scanner.
3. **MCP-346's decision stands; its rationale is superseded by §5 here.** The
   ticket said no because the extension was immature. The durable reason is that
   the probed paths are the wrong paths.
4. **MCP-422 keeps its shape and gains a deadline-free trigger.** Oak's
   `<streamable-http-url>/server-card` answers 406 today because the request
   falls through to the transport; that is the endpoint to change when the
   trigger fires, and no `.well-known` route is added.
5. **`auth.md` completeness is decoupled from OAuth.** MCP-425 and MCP-426 can be
   dispositioned on their own merits without `auth.md` waiting on them.
6. **Every claim above is dated, and most are perishable.** ARD is a Proposal,
   SEP-2127 is open, the DNS-AID draft expires 2026-11-28, and the WebMCP API
   shape changed once already. A reader finding an undated restatement of any of
   these elsewhere in the estate should trust the measurement, not the
   restatement.
7. **A vendor scorecard is evidence, never a backlog.** The general rule this
   ADR establishes: when a scored surface is operated by a party that sells the
   remedy, its rows are read as prompts and answered on Oak's own tests.

## Evidence

Measured first-hand on 2026-09-09 for this record: the ARD spec page and site;
`ai-catalog.json` and `ard.json` on `github.com`, `huggingface.co` and
`developers.cloudflare.com`, with their `Link` headers; the IANA Well-Known
URIs registry, with control rows; the A2A release list; the WebMCP draft and
WebKit standards-position issue 670; the IETF Datatracker record for
`draft-mozleywilliams-dnsop-dnsaid` and its IESG state; the eleven-domain
`_agent` DNS probe with controls; SEP-2127's state and review decision; the
`ext-server-card` README and `docs/discovery.md`; the GitHub, Hugging Face and
Oak `server-card` endpoints; `auth.md` and the two OAuth well-known paths on
both `open-api.thenational.academy` and `workos.com`; and the
`isitagentready.com` page source.

Carried from the same day's verification pass rather than re-measured here: the
39-domain DNS-AID adoption sweep (whose per-domain list was never written down —
hence the eleven-domain re-probe above), the scanner's own "OAuth Protected
Resource Metadata was not found" warning text, the scanner's probe-path list,
and the Chrome "Proposed" status for WebMCP. Surrounding working in
[`standards-verification-2026-09-09.report.md`](../../../.agent/plans-backlog-2026-07/discovery/current/standards-verification-2026-09-09.report.md),
[`agent-readiness-collation-2026-09-09.md`](../../../.agent/reports/agent-readiness-collation-2026-09-09.md)
and
[`agent-readiness-plan-review-2026-09-09.md`](../../../.agent/reports/agent-readiness-plan-review-2026-09-09.md).
