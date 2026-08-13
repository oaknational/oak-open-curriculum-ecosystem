---
status: permanent-dated-record
date: 2026-08-13
subject: mcp-301-public-documentation-draft
source:
  MCP-301, MCP-308 (incl. comment 7de5f83a — prior finalised draft), MCP-292, MCP-306,
  MCP-444, MCP-443, MCP-461, MCP-468, MCP-470, ADR-218 (incl. the 2026-08-03 amendment),
  .agent/reports/mcp-292-306-listing-copy-pack-2026-08-05.md,
  .agent/reports/mcp-443-privacy-policy-dpo-review-pack-2026-08-05.md,
  .agent/reports/claude-directory-submission-form-inventory-2026-07-28.md,
  apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx,
  apps/oak-curriculum-mcp-streamable-http/served-tool-table.md, ATTRIBUTION.md, SECURITY.md,
  the served landing page at www.thenational.academy/mcp (fetched 2026-08-13)
identity: Implementer seat (agent), thread `mcp-submission-drive`, under Wildfire holds Quench (Director, ee2764)
---

# Public documentation page — sourced draft for MCP-301

Discharges the drafting half of MCP-301 (release-gate mirror MCP-308, milestone M0). This is
a **draft ready to place**, not a published page. Where it finally lives — Oak blog, help
centre, or a repo-served page — is undecided and deliberately not decided here.

**Nothing outward-facing is invented.** Every claim in Part 1 carries a source marker
resolving to the table in Part 2. Where no approved wording existed, the claim is **not
written** — it goes to Part 4 as rendered options for MG and Jim to choose from.

**Read Part 3 first.** Three source conflicts materially change what this page may say, and
one of them contradicts the brief this work was commissioned under.

## A prior draft already exists, and this supersedes it

MCP-308 comment `7de5f83a` (2026-08-05) carries a **finalised draft of this same page**,
authored by an agent and posted under MG's Linear account, marked *"For sign-off — not
published"*. It was not blank-page work and this document does not discard it: the draft
below keeps its structure and most of its copy, and corrects it in three places.

What changed since that draft, all verified rather than assumed:

- **Its publish hold has lifted.** The draft's decision D3 held publication until after the
  M4 switchover. M4 has passed: sign-in is open, owner-verified against production on
  2026-08-06 with a non-Oak email and no invitation (listing-copy pack, outstanding item 5).
  The condition the hold depended on is satisfied.
- **Its JSON snippet is wrong.** It shows `"oak-curriculum"` with a bare `url`. The live page
  serves `"oak-open-curriculum"` with `"type": "http"`. Corrected below from the served page.
- **Its residency line is thin.** It says only *"including the United States (MCP-470)"*. The
  owner-approved framing pairs the US disclosure with the mitigating facts, and both halves
  are part of the approved wording. Carried in full below.

## Scope check against what Anthropic requires

MCP-301 scopes five points; Anthropic's directory policy also requires troubleshooting.

| Required | Covered below | Sourcing |
| --- | --- | --- |
| What the app is | Yes | Fully sourced |
| What it does for teachers | Yes | Fully sourced |
| How to connect it | Yes | Fully sourced, endpoint re-verified |
| What data it touches | Yes | Fully sourced, one line needs DPO wording (D1) |
| How to get help | Yes | Fully sourced |
| How to troubleshoot it | **No** | No approved source exists — see D4 |

---

# Part 1 — the draft page

Markers `[S1]`–`[S24]` resolve to Part 2 and **are stripped on publication**. British
spelling throughout. Headings are sentence-case and nest without skipping a level, so the
page carries a valid heading outline wherever it lands.

## Oak Curriculum MCP

Designed for teachers, this service connects your AI assistant to Oak's high quality, free,
fully sequenced and openly licensed curriculum resources — thousands of lessons, units, and
assets across subjects and key stages. `[S2]` It's read-only: it finds and returns Oak's own
curriculum, and it can't change anything. `[S3]` It's in public beta. `[S1]` Connect it at
`https://www.thenational.academy/mcp` and sign in with your Oak account. `[S4]` `[S5]`

### What it is

Oak National Academy is a public body sponsored by the Department for Education. We provide a
free, optional, fully sequenced curriculum aligned with the national curriculum for England,
created with teachers and subject experts. `[S6]`

This connector gives your AI assistant read-only access to our Curriculum API: over 12,000
lessons organised into sequenced units across 17 subjects and key stages 1–4, with cross-year
learning threads, key vocabulary, documented pupil misconceptions, prior-knowledge links,
quizzes, and downloadable resources — slide decks, worksheets, and starter and exit quizzes.
Coverage varies by subject and key stage. `[S7]`

Every tool is read-only. `[S3]`

### What it does for you

Teachers use Oak to cut planning time: find lessons and ready-made resources on any topic,
check how a concept develops across year groups, and anticipate the misconceptions pupils
bring. School and trust leaders use it to review coverage and sequencing against the national
curriculum. Everything is openly licensed, so you can adapt what you find for your own
classes. `[S8]`

Things to ask: `[S9]`

- Find KS3 science lessons about photosynthesis
- Which misconceptions should I plan for when teaching fractions in year 3?
- How does number develop from year 1 to year 11 in maths?
- Get me the worksheet and slides for Oak's lesson on food chains

### How to connect it

The Oak Curriculum MCP is a remote MCP server at `https://www.thenational.academy/mcp`.
`[S4]` The first time you connect you sign in with your Oak account and approve access —
there are no client IDs or secrets to set up. `[S5]` `[S10]`

In most AI assistants (for example, Claude):

1. Open connector settings and choose **Add custom connector**. `[S11]`
2. Paste `https://www.thenational.academy/mcp`. `[S4]`
3. Sign in with your Oak account when prompted, and approve access. `[S5]`

Oak's curriculum tools are then available in your conversation. `[S11]`

For a client configured by a JSON file, add this under your MCP servers: `[S12]`

```json
{
  "mcpServers": {
    "oak-open-curriculum": {
      "type": "http",
      "url": "https://www.thenational.academy/mcp"
    }
  }
}
```

### What data it touches

The connector serves openly licensed curriculum content and does not store conversations. It
processes the tool arguments your assistant sends — which may include free-text search terms
— together with authentication and request metadata, to serve requests, secure the service
and measure usage; usage analytics are pseudonymised. All data is handled in accordance with
Oak's privacy policy. `[S13]`

**You must not include any personal or sensitive information that could identify an individual
in your inputs.** `[S14]`

What we record is a fixed set of records about how the app is used, not what you ask it: that
you started a session, and which AI assistant and protocol version connected; which of our
tools and resources you use, and when; how long each request takes and whether it succeeded;
a pseudonymised identifier that links this activity to your account for analytics purposes.
`[S15]`

We don't collect your IP address or your location through our MCP apps. `[S16]`

Where it runs: multi-region (including the US), with no storage in the functions and no
personal data retained in compute (transient processing only); persistent stores remain
EU-resident. `[S17]`

The connector calls the Oak Curriculum API (`open-api.thenational.academy`). Supporting
services: Clerk (authentication), Elastic Cloud (search), Sentry and PostHog (monitoring and
pseudonymised analytics), Vercel (hosting) — all named in Oak's privacy policy. `[S18]`

### How to get help

- **Questions or support:** email `help@thenational.academy`. `[S19]`
- **Security issues:** follow Oak's security policy at
  `www.thenational.academy/.well-known/security.txt` — please don't report security issues in
  public. `[S20]`
- **Curriculum data details:** see the Oak Curriculum API documentation at
  `https://open-api.thenational.academy/docs/about-oaks-api/api-overview`. `[S21]`

### Licence and attribution

Lesson content is available under the Open Government Licence v3.0, except where otherwise
stated, and requires attribution to Oak National Academy. `[S22]` See our API terms and
conditions at `https://open-api.thenational.academy/docs/about-oaks-api/terms`. `[S23]`

When you reuse Oak's curriculum content, attribute it: "Contains public sector information
licensed under the Open Government Licence v3.0." `[S24]`

---

# Part 2 — source table

24 claims, each traceable. "Verified" means measured first-hand on the date given, not
inherited from a document.

| # | Claim | Source | Status |
| --- | --- | --- | --- |
| S1 | Public beta | `page-sections.tsx` status tag `Public Beta` (owner's word, MCP-509); served page carries it | Verified served 2026-08-13 |
| S2 | Hero sentence, verbatim | `PAGE_DESCRIPTION` in `page-sections.tsx` — owner's copy, no agent authorship | Verified served 2026-08-13, byte-identical |
| S3 | Every tool is read-only | `served-tool-table.md`: 40 tools, **40/40** `readOnlyHint: true`, **40/40** `destructiveHint: false`; listing pack read/write `read_only` | Verified 2026-08-13 by tally |
| S4 | Endpoint `www.thenational.academy/mcp` | Canonical endpoint; `mcpEndpointUrl` derived at build by `derive-view-props.ts` | Verified 2026-08-13: page 200, unauthenticated POST 401 |
| S5 | Sign in with your Oak account | `ConnectSection`: *"You will be prompted to sign in with your Oak account."* | Verified served 2026-08-13 |
| S6 | Public body sponsored by the DfE | MCP-444 §8 → listing pack Field 2. Load-bearing: matches the gov.uk classification | Approved source |
| S7 | 12,000 lessons / 17 subjects / KS1–4 / coverage varies | MCP-444 §8 → listing pack Field 2 | Approved source; **re-verify counts at publish** (pack's own instruction) |
| S8 | What teachers and leaders use it for | MCP-444 §9 → listing pack Field 3 | Approved source |
| S9 | Four example prompts | MCP-444 §10 → listing pack Field 4 | Approved source; **prompt 4 carries a verification condition** (MCP-328 — assets may refuse on licence grounds). Drop it if it refuses; three is the required minimum |
| S10 | No client IDs or secrets | Listing pack Field 5 | Approved source |
| S11 | Add custom connector; tools then available | MCP-308 draft D2, verified live by Marten turns Crypt (endpoint owner) at app 1.150.0 | Host UI labels are Anthropic's, not Oak's — see the maintenance note |
| S12 | JSON snippet | `createSnippet` in `create-snippet.ts`; served HTML | **Verified 2026-08-13 — corrects the MCP-308 draft** |
| S13 | Data-handling paragraph | MCP-444 §14 → listing pack Field 6 | Approved source. *"Users should not include…"* replaced by S14's stronger approved wording |
| S14 | Free-text user obligation | MCP-468, verbatim; decision recorded to include it | Approved source. **Never pair with a filtering claim** — Oak does not filter inputs (MCP-468) |
| S15 | What is recorded | Owner's own drafted replacement copy, adopted per MCP-443 | Owner-authored; live-data verified (allowlist match) |
| S16 | No IP, no location | MCP-443 Edit 1 / optional transparency addition; `$geoip_disable: true` on every event, zero events carrying an IP | Verified in live EU PostHog 2026-07-30 |
| S17 | Multi-region incl. US; EU-resident stores | MCP-470 owner decision, verbatim framing (Jim 2026-08-03, Matt 2026-08-04) | Owner-approved framing. **See C1 — this is not EU-only** |
| S18 | Third-party services | MCP-444 §15 → listing pack Field 7 | Approved source |
| S19 | `help@thenational.academy` | MCP-308 owner-approved draft (comment 7de5f83a); also `CODE_OF_CONDUCT.md` | Approved source; organisational mailbox, not personal data |
| S20 | Security via `security.txt` | `SECURITY.md` | Verified 2026-08-13: 200 |
| S21 | API documentation link | `OAK_API_OVERVIEW_URL` in `page-sections.tsx` | In-repo constant |
| S22 | OGL v3.0, except where otherwise stated, attribution required | MCP-444 §8 → listing pack Field 2; mirrors the API terms | Approved source |
| S23 | API terms link | `OAK_API_TERMS_URL` in `page-sections.tsx` | In-repo constant |
| S24 | Attribution string, verbatim | `ATTRIBUTION.md`; `docs/governance/DATA-SOURCES.md` | Approved source |

**Maintenance note on S11.** The connect steps name Anthropic's own UI labels. Oak does not
control them and they change without notice. They were verified once, on 2026-08-05. Re-read
them before publication and treat them as the page's most perishable content.

---

# Part 3 — conflicts between sources

Reported rather than resolved, per MCP-301's standing rule. **C1 contradicts the brief this
work was commissioned under** and is the one to read.

## C1 — EU data residency is false, and must not be written

**The brief for this work asked for "EU data residency". The ratified record says the
opposite, and explicitly forbids the claim.**

- MCP-470 asked whether to restrict Vercel Function Regions to the EU. The project runs
  **5 EU + 4 US** regions (`cdg1`, `arn1`, `dub1`, `lhr1`, `fra1`, plus `iad1`, `sfo1`,
  `pdx1`, `cle1`).
- **The owner decision was to KEEP multi-region, including the US** — option 1 declined.
  Recorded twice: Jim Cresswell 2026-08-03 (*"There is no storage in the functions, and no
  PII in the compute, I'd leave it because there is no risk"*) and Matt Gregory 2026-08-04.
  MCP-470 is Done.
- MCP-470's closing comment is explicit: the data-handling residency statement *"must not
  claim EU-only residency."*

A Vercel Function handles the request in flight — including the free-text `search` /
`explore-topic` query and the auth token — so with US regions enabled **that processing can
occur in the US**. Persistent stores remain EU-resident (Elastic `europe-west1`, PostHog EU).

The page above therefore states multi-region including the US, paired with the mitigating
facts, exactly as the owner framed it. **This is the single claim an IT admin is most likely
to hold Oak to, and an EU-only version of it would have been false.**

A trap for anyone re-verifying: the Vercel API's `serverlessFunctionRegion` field returns a
single legacy value (`cdg1`) and does **not** reflect the multi-region selection. Read the
Functions settings, or you will wrongly conclude EU-only.

## C2 — "no captured content or queries" is true of Oak's stores, unproven for Elastic's

The brief also asked for "no captured content or queries". That is **true and
architecturally guaranteed for Oak's own surfaces**, and **not established for one
sub-processor**:

- **Guaranteed:** ADR-218 excludes tool arguments, responses, prompts, search terms and query
  text from the analytics envelope by construction, enforced by a build-failing test that
  injects hostile content fields and asserts they are stripped. Sentry cannot receive them
  (`sendDefaultPii` hardcoded false, boot-fails if forced). App logging records tool names, a
  `hasParams` boolean and sizes only. The one query-persisting sink is not wired into the MCP
  retrieval path. All per MCP-468's 2026-08-03 trace.
- **Not established:** MCP-468's residual is open. Customer-configurable Elastic query
  logging does not exist on Serverless (slow logs, audit logging and query logging are all
  Unavailable — *"there is no switch to flip"*). But **Elastic's own operator-side logging of
  `_search` request bodies is not determinable from public docs** and is a DPA question, not
  an engineering one.

The page above therefore says *"does not store conversations"* and *"processes the tool
arguments… to serve requests"* — both true — and does **not** assert that no system anywhere
retains a query. That gap is why S14's user-obligation warning is in the page. Per MCP-468,
the warning is precautionary and **must never be presented as PII filtering: Oak does not
filter inputs.**

## C3 — "no teacher-level identity" overstates the posture

The brief's third data claim also needs correcting. Activity **is** linked to the teacher's
account:

- The PostHog actor identifier is a pseudonym derived from the verified Clerk principal. It
  **is personal data for Oak** and ADR-218 states it "is not described as anonymous".
- Sentry holds the **opaque Clerk user identifier** — a direct authentication identifier —
  attached to the per-request scope. So Sentry holds a direct identifier where PostHog holds
  a destination-scoped pseudonym; no stable person identifier is shared between the two.

The page says "a pseudonymised identifier that links this activity to your account", which is
the owner's own wording and is accurate.

**Absolute language rule, from ADR-218 and both source packs:** never describe MCP usage
analytics as "anonymised" or "anonymous". Reviewers of this page must hold that line.

## C4 — retention: 5 years vs 12 months, and the live policy may state neither

Not a conflict this page has to resolve, but it governs D3:

- **ADR-218 §5, amended 2026-08-03: maximum 5 years (60 months).** Decided by the project
  owner with the DPO/privacy lead.
- **MCP-173 still says 12 months in four places** and needs re-basing.
- **MCP-461 — updating the figure in the live privacy policy and TnCs — is still `Todo`.**

So the page must not link "Oak's privacy policy" as authority for a retention figure the
policy may not yet carry. See D3.

## C5 — the prior draft's JSON snippet disagrees with the live page

MCP-308's draft shows `"oak-curriculum"` with a bare `url`. `createSnippet` and the served
HTML both give `"oak-open-curriculum"` with `"type": "http"`. **The live page wins**;
corrected in Part 1. Anyone copying from the older draft would publish a snippet that does
not match what the app itself tells users to paste.

---

# Part 4 — decisions for MG and Jim

Seven places where no approved wording existed. Each carries rendered options and a
recommendation. **Nothing here has been written into Part 1** — these are the gaps.

## D1 — the residency sentence in plain English

**Why it's open.** The owner-approved framing (S17) is accurate but reads as internal
technical shorthand. The MCP-443 DPO pack states plainly that turning it into a final
sentence **sits with the DPO**, and deliberately did not draft it. Part 1 carries the
approved framing verbatim rather than a paraphrase, so the page is safe as it stands — but it
does not yet read like a page for a teacher or an IT admin.

- **Option A (verbatim, current state).** "Where it runs: multi-region (including the US),
  with no storage in the functions and no personal data retained in compute (transient
  processing only); persistent stores remain EU-resident."
- **Option B (plainer, same facts).** "Your requests are handled by servers in several
  regions, including the United States. Nothing is stored there — the request is processed and
  passed on. Everything we do keep is stored in the EU."
- **Option C (IT-admin framing, leads with the store).** "All the data we store stays in the
  EU. Requests themselves are processed across several regions, including the United States;
  no data is stored and no personal data is retained at that stage."

**Recommendation: C, subject to DPO sign-off.** It leads with what an IT admin is actually
asking ("where does our data live?"), and it keeps both halves of the approved framing
without softening the US disclosure. **Do not publish any of these without the DPO** — this
is the one sentence on the page that MCP-443 explicitly reserves to them.

## D2 — whether to state that there's no AI in the app

**Why it's open.** No approved source states it. The supporting facts are solid: 40/40
read-only tools, no generative dependencies in the app workspace, and Anthropic's compliance
acknowledgement 4 (no AI image/video/audio generation). But no Oak-approved sentence says
"there is no AI in this app", and the risk runs both ways — silence invites the assumption
that Oak generates lesson content, while overclaiming ("no AI") could read oddly on a page
about connecting an AI assistant.

- **Option A (say nothing beyond read-only).** Part 1 already says "It's read-only: it finds
  and returns Oak's own curriculum, and it can't change anything."
- **Option B (explicit negative).** Add: "Oak doesn't generate any of this content. Every
  lesson, unit and resource the connector returns was written by teachers and subject
  experts, and the connector only ever reads it."
- **Option C (positive framing, no negative).** Add: "Everything the connector returns is
  Oak's own published curriculum, written by teachers and subject experts."

**Recommendation: B.** It's the sentence that answers the question a school IT admin and a
sceptical teacher both actually have, it's provable from the read-only tally, and it's the
one place where "AI slop" fears are cheaply defused. Sourced from the read-only annotations
plus the existing "created with teachers and subject experts" (S6), so it's assembly rather
than invention.

## D3 — whether to state a retention period

**Why it's open.** See C4: ADR-218 says 5 years, MCP-173 still says 12 months, and MCP-461
(the live policy edit) is `Todo`. Stating a figure the live policy contradicts is the exact
failure mode this page must avoid.

- **Option A (omit; link only).** Say nothing about retention; rely on the privacy-policy
  link. **Available today.**
- **Option B (state 5 years).** "We keep this usage information for a maximum of 5 years."
  **Blocked until MCP-461 lands** — otherwise the page and the policy disagree.
- **Option C (state the direction without a number).** "We keep this usage information for a
  limited period, set out in our privacy policy."

**Recommendation: A now, B once MCP-461 lands.** A is honest and needs nothing. Note that
stating 5 years is the *conservative* direction, not the risky one — the DPO pack establishes
that if enforcement still deletes at 12 months while the policy states a 5-year ceiling, Oak
is operating inside its stated ceiling. The reverse would be the breach.

## D4 — the troubleshooting section, which does not exist

**Why it's open, and why it matters.** Anthropic's directory policy requires developers to
document *"how their software works, what it's for, and how people troubleshoot it."* MCP-301
scoped five points and troubleshooting is not among them, so **no approved source anywhere
covers it.** This is the one genuine content gap against the stated requirement. "How to get
help" is a support route, not troubleshooting.

Everything below is drafted from verified system behaviour, not from approved copy:

- **Option A (three-item list).**
  - "The connector asks you to sign in every time" — you need an Oak account; sign in and
    approve access when prompted.
  - "A resource won't download" — some lesson resources are restricted by copyright and can't
    be shared; you'll see a message saying so. *(Grounded in MCP-328.)*
  - "A request came back too large" — ask for a narrower slice: a single subject or key stage
    rather than the whole curriculum. *(Grounded in the served `browse-curriculum`
    description's own note.)*
- **Option B (one line).** "If something isn't working, email `help@thenational.academy` and
  tell us which assistant you're using and what you asked for."
- **Option C (both).** A's list, closing with B's line.

**Recommendation: C.** It satisfies the policy requirement, each item is grounded in verified
behaviour rather than invented, and the closing line means no reader dead-ends. Flagging
plainly: **this is the least-sourced part of the page** and needs an owner's eye on the
wording, not just a tick.

## D5 — the "grounded, not invented" framing

**Why it's open.** The MCP-308 draft says the answers are *"grounded in Oak's openly licensed
curriculum rather than invented"*. That's agent-authored and never signed off. It's a strong
line and worth keeping, but it should be chosen, not inherited.

- **Option A (keep the draft's wording).** "…so the answers are grounded in Oak's openly
  licensed curriculum rather than invented."
- **Option B (softer, teacher-facing).** "…so what you get back comes from Oak's actual
  curriculum, not from guesswork."
- **Option C (drop it).** The read-only sentence and D2's option already carry the substance.

**Recommendation: A.** It's the clearest articulation of the connector's value, it's already
been through one owner's hands on MCP-308, and it directly serves the trust question. If it
lands, it belongs in "What it does for you", not the hero.

## D6 — the page's title, once its home is known

**Why it's open.** Part 1 uses "Oak Curriculum MCP", which is the served page's own H1 and so
is sourced. But a help-centre article aimed at teachers may want a plainer title, and the
listing **Name** is separately carded as an irreversible decision (it derives the permanent
slug). These should not drift apart.

- **Option A.** "Oak Curriculum MCP" — matches the live page exactly.
- **Option B.** "Connecting Oak to your AI assistant" — describes the reader's job.
- **Option C.** "Oak Curriculum MCP: connecting Oak to your AI assistant" — both.

**Recommendation: C** for a help-centre home, **A** if the page is served from Oak's own
domain next to the landing page. Whichever is chosen, **keep it consistent with the listing
Name decision** rather than deciding it here.

## D7 — whether to state that inputs are not filtered

**Why it's open.** MCP-468 is emphatic that Oak must **not** claim automated PII filtering,
and that the S14 warning is precautionary. It does not say whether to state the negative
explicitly. The MCP-443 pack treats the equivalent question (stating the IP/location
negative) as an editorial and DPO judgement.

- **Option A (warning only, current state).** S14 stands alone.
- **Option B (add the negative).** "We don't scan or filter what you type, so please don't
  put anything personal in it."
- **Option C (add the reason).** "Your questions are used to answer your request and aren't
  stored — but they do pass through our systems, so please don't include anything personal."

**Recommendation: A.** The warning already places the obligation correctly. B invites the
question "why not?" on a page that can't answer it, and C edges toward the C2 territory this
page should not assert. Revisit if the DPO wants the negative stated.

---

# What is blocked, and by whom

Not decisions for MG and Jim to make — dependencies with named owners.

| Item | Owner | Blocks |
| --- | --- | --- |
| Lawful basis for usage analytics | DPO (MCP-443 Edit 4) | Nothing on this page — deliberately not stated. Do not add it |
| Final residency sentence | DPO (MCP-443 §GAP) | D1 |
| Retention figure in the live policy | MCP-461, with Jayne Taylor | D3 option B |
| Elastic operator-side query logging | MCP-468 residual → DPIA (MCP-278) | Nothing on this page; bounds what C2 may claim |
| Example prompt 4 | MCP-328 | S9 — run it before publishing |
| Lesson and subject counts | Re-verify at publish | S7 |

## Where this page could live — not decided here

MCP-301 accepts a blog post or help-centre article; it doesn't need a documentation site. The
submission draft names `https://support.thenational.academy/using-oak-mcp`, which returned
404 when measured on 2026-08-06. Anthropic's field guidance is that the URL must be **public
by the publish date**, and may be **shared privately during review** — so the requirement is
that the field is filled, not that the URL resolves at submission. Timing is "before review",
not "before submit".

Placing this page may be a cross-repository job (Oak's help centre and blog are not this
repository) — the same problem as MCP-596. **That decision is deliberately left open.** This
document is the content, ready to place.

## Who wrote this, and how

Assembled by an AI agent — Implementer seat on thread `mcp-submission-drive`, 2026-08-13 —
from MCP-308's prior draft and the approved sources named in the front matter. No
outward-facing copy was invented: every claim in Part 1 resolves to Part 2, and every gap is
in Part 4 as options rather than filled by inference. First-hand verifications (the served
page, the endpoint's auth behaviour, the 40/40 read-only tally, the JSON snippet, the
`security.txt` status) were measured on 2026-08-13 and are marked as such. Three source
conflicts are reported in Part 3 rather than resolved, including one that contradicts the
brief this work was commissioned under.
