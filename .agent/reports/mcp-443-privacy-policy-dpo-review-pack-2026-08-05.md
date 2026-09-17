---
status: permanent-dated-record
date: 2026-08-05
subject: mcp-443-privacy-policy-dpo-review
source: MCP-443 (edits + grounding), ADR-218 incl. the 2026-08-03 retention amendment, docs/governance/safety-and-security.md §Compliance Considerations, MCP-173, MCP-470 (residency decision + folded obligation)
identity: Breeze tracks Troposphere / claude / d5f748 (Implementer, non-code submission prep)
---

# Privacy policy — MCP app edits packaged for DPO review

Discharges the packaging half of MCP-443. This is a review pack for the DPO, assembled
from MCP-443's own edits and re-grounded against the current repository authorities. It
decides nothing. Every proposed wording below is **proposed for DPO review**, exactly as
MCP-443 framed it.

The live policy is *"Privacy Policy - March 2026 - combined main and AI sites"*.

## What is being asked, in one paragraph

The policy deliberately covers Aila and the MCP app in one *"Information collected via
our AI tool"* section. That only works if every sentence is true of both surfaces. It is
not: several statements are false for the MCP app, and one required disclosure is
missing. Six edits are proposed. **Five are factual corrections** — the policy currently
says things that are not true of the MCP app, and the correction is not a matter of
judgement. **One is a genuine DPO decision** (the lawful basis, Edit 4). Reviewing the
one is the substantive ask; the five need approval rather than adjudication.

Two things this pack adds beyond MCP-443's own text, both flagged in place rather than
folded in silently: **Edit 5's retention figure is corrected** (MCP-443's 12 months was
superseded on 2026-08-03 — see the next section), and **a seventh obligation is missing
from MCP-443 entirely** (data residency, assigned to this ticket by MCP-470's owner
decision — see §GAP).

## Why the timing matters

- MCP analytics capture has been **live in production since 2026-07-29**.
- ADR-218 §"Before public capture is enabled" requires, as a precondition, *"an
  MCP-specific privacy notice and an approved lawful basis"*.
- The Claude directory submission is in flight, and Anthropic's directory terms require
  a privacy policy that *"clearly and accurately describe[s] to users what user
  information you and third parties collect and how you and third parties use and share
  such information."*

So this closes before or with submission, not after it.

## CORRECTION TO MCP-443 ITSELF — read this before Edit 5

**MCP-443's Edit 5 is stale and must not be adopted as written.** It proposes a
**12-month** retention line, grounded on MCP-173's *"≤12 months"* commitment. That
figure was superseded three days ago.

ADR-218 was **amended on 2026-08-03**: retention moved from a maximum 12 months to a
maximum **5 years (60 months)**. The ADR's status line records it, §5 records it, and the
Amendment section at the end gives the reasoning — MCP usage analytics do not differ in
nature from Oak's other products, so retention aligns with the period Oak already applies
to main-website analytics; a 12-month window makes year-on-year comparison impossible;
and what is collected is deliberately minimal, so a shorter window is not warranted on
data-minimisation grounds.

The amendment records that it was **decided by the project owner with the DPO/privacy
lead** and the product and analytics leads, with the author of the original provisional
figure consulted. So the DPO is already party to the 5-year decision — which is precisely
why proposing 12 months here would be wrong.

Two further consequences worth the DPO's attention:

1. **MCP-173 has not caught up.** It still states 12 months in four places (the retention
   checkbox, the required-evidence bullet, and the observed-project note), despite being
   updated after the amendment date. A reader consulting MCP-173 alongside this pack will
   see a contradiction. MCP-173 needs re-basing; that is outside this pack's scope but
   should not be lost.
2. **Stating 5 years is the safe direction, not the risky one.** ADR-218's amendment notes
   that the *enforced* PostHog configuration and the scheduled deletion job are re-based
   from 12 months to 5 years **separately**, tracked in Linear. If enforcement still
   deletes at 12 months while the policy states a 5-year ceiling, Oak is operating inside
   its stated ceiling, which is sound. The reverse — stating 12 months while retaining for
   5 years — would be the breach. The corrected figure is therefore both accurate and the
   conservative choice.

Edit 5 below carries the corrected figure.

## Section-home decision (recorded, per MCP-443)

Two homes currently describe MCP: a dedicated *"Information collected … via our MCP
apps"* section, and a proposed split of the shared AI-tool section. **Decision recorded on
MCP-443: keep the dedicated MCP section as the single home, and scope the "Information
collected via our AI tool" section to Aila / web tools only.**

That decision is why this pack carries six edits rather than seven — MCP-443's Edit 1
(the full split of the shared section) becomes unnecessary, with only its Aila-scoping
substance surviving inside Edits 2 and 3. Edits 4 to 7 apply regardless of the
section-home decision.

The dedicated MCP section's base copy is the owner's own drafted replacement, adopted per
MCP-443:

> a fixed set of records about how the app is used, not what you ask it: that you started
> a session, and which AI assistant and protocol version connected; which of our tools and
> resources you use, and when; how long each request takes and whether it succeeded; a
> pseudonymised identifier that links this activity to your account for analytics purposes

Live-data verification confirmed both claims behind that draft: no GeoIP
(`$geoip_disable: true` on every event, zero events carrying an IP) and no content (the
union of every property ever sent matches the content-free allowlist).

Three deltas apply on top of that draft, all carried below: the legitimate interest is
**Oak's**, not the user's (Edit 4); a retention entry is needed (Edit 5); and an explicit
negative about IP and location is available as an optional transparency addition.

## The six edits

### Edit 2 — the "stored" sentence · FACTUAL CORRECTION

Current:

```text
Your "inputs" and "outputs" are stored for this purpose.
```

Proposed:

```text
For our web-based generative AI tools, your "inputs" and "outputs" are stored for this
purpose. Our MCP apps do not store your inputs or outputs.
```

Grounding: false for the MCP app as written. Nothing in the MCP service persists request
or response content; ADR-218 excludes it by construction.

### Edit 3 — cookies sentence (also fixes a typo) · FACTUAL CORRECTION

Current:

```text
In addition, our AI tool uses cookies and webs beacons - please see our Cookie Policy for full details.
```

Proposed:

```text
In addition, our web-based AI tools use cookies and web beacons - please see our Cookie
Policy for full details. Our MCP apps do not set analytics cookies.
```

Grounding: the MCP analytics are server-side; browser analytics, cookies, and iframe
persistence were expressly rejected in ADR-218. Also corrects *"webs beacons"* to
*"web beacons"*.

### Edit 4 — lawful basis · **THIS ONE IS THE DPO'S DECISION**

Current:

```text
Our legal basis for processing this information is your consent.
```

Proposed wording, offered only:

```text
Our legal basis for processing your account information is your consent. Our legal basis
for processing usage information is our legitimate interest.
```

Grounding: no consent surface exists in any MCP host, and ADR-218 explicitly refuses to
present OAuth authorisation as consent — the ADR states that *"authorisation is not
described as agreement to analytics."* So "consent" is untrue for MCP usage analytics as
things stand. This also matches the DPO's own in-document margin direction
(consent → legitimate interest).

**The lawful-basis determination itself belongs to the DPO.** ADR-218 lists an *approved
lawful basis* as a precondition for public capture, and this pack does not presume the
answer. Note the wording detail: the legitimate interest is **Oak's** ("our"), not the
user's — an earlier draft read "your legitimate interest", which is the wrong party and
inconsistent with the policy's other sections.

If legitimate interest is the chosen basis, a legitimate-interests assessment and the
associated objection route are the DPO's call as to whether they are required here.

### Edit 5 — retention · FACTUAL CORRECTION, figure corrected from MCP-443

Add one line to the Data retention list:

```text
usage information collected via our MCP apps will be retained for a maximum of 5 years;
```

Grounding: ADR-218 §5 as amended 2026-08-03 — maximum 5 years (60 months) across PostHog
and every authorised copy. **This supersedes MCP-443's proposed "12 months"**; see the
correction section above for why, and for the MCP-173 drift that accompanies it.

The existing *"website visits up to 5 years"* line does not cover MCP usage information and
must not be read as doing so — a separate entry is still required even though the periods
now coincide.

### Edit 6 — the Sentry entry in the third-party list · FACTUAL CORRECTION

Current:

```text
Sentry (error tracking and crash reporting for our Labs applications)
```

Proposed:

```text
Sentry (error tracking and crash reporting)
```

Grounding: the MCP service sends diagnostics to Sentry too, so the Labs-only parenthetical
under-describes the processing.

One fact for the DPIA rather than necessarily for the policy text: MCP diagnostic events
attach the opaque Clerk user identifier to the per-request Sentry scope, so **Sentry holds
a direct authentication identifier where PostHog holds only a destination-scoped
pseudonym; no stable person identifier is shared between the two processors.** This is
stated in `docs/governance/safety-and-security.md` §Compliance Considerations, which is the
source description to use when finalising processor records. That document also records
that whether the identifier may flow to any further sink remains an open redaction-policy
question (ADR-160).

### Edit 7 — the PostHog entry in the third-party list · FACTUAL CORRECTION

Current:

```text
PostHog (web interacts and LLM agents, analytics and product-usage insights)
```

Proposed:

```text
PostHog (product-usage analytics)
```

Grounding: the *"LLM agents"* phrasing implies prompt and response content is sent to
PostHog. It is not — the MCP integration sends only content-free usage events (four event
types, allowlisted properties, no inputs or outputs). *"Product-usage analytics"* describes
both the MCP and web analytics accurately without implying content capture. Pairs with
Edit 6 so both processor-list entries are true after the change.

## GAP — a seventh obligation was assigned to MCP-443 but never entered its edit list

**MCP-443's six edits do not cover data residency, and they should.** This is not a
correction to an existing edit; it is a missing edit, and the DPO is precisely the person
who must not discover it later.

The trail:

- MCP-470 asked whether to restrict the Vercel Function Regions to the EU (the project runs
  **5 EU + 4 US** regions: `cdg1`, `arn1`, `dub1`, `lhr1`, `fra1`, plus `iad1`, `sfo1`,
  `pdx1`, `cle1`).
- **The owner decision was to KEEP multi-region, including the US** — declined option 1.
  Recorded twice: Jim Cresswell relayed 2026-08-03 (*"There is no storage in the functions,
  and no PII in the compute, I'd leave it because there is no risk"*) and Matt Gregory
  2026-08-04. MCP-470 is Done.
- **Both closing comments explicitly fold the resulting disclosure obligation onto
  MCP-443.** MCP-470's 2026-08-04 comment: *"the submission's data-handling residency
  statement, the privacy policy, and the DPIA must now describe the connector accurately as
  multi-region, including US processing (compute) … It must not claim EU-only residency.
  Folded onto MCP-443 (privacy-truth) and the DPIA (Jayne)."*

MCP-443's edit list predates that fold (its edits were authored 2026-07-30; the fold
happened 2026-08-04) and was never extended to absorb it. So an obligation the owner
assigned to this ticket is not in the ticket.

Why it matters: a Vercel Function invocation handles the request in flight — including the
free-text `search` / `explore-topic` query and the auth token — so with US regions enabled
that processing **can occur in the US**. The persistent stores remain EU-resident (Elastic
`europe-west1`, PostHog EU). A policy silent on this, or one implying EU-only residency,
would be inaccurate in the same way the six edits above are inaccurate.

The owner-approved framing to use, from MCP-470's own closing comments — note that it pairs
the US disclosure with the mitigating facts, and both halves are part of the approved
wording:

```text
multi-region (incl. US), with no storage in the functions and no personal data retained in
compute (transient processing only); persistent stores remain EU-resident
```

I have not drafted policy prose for this, because the six edits are MCP-443's own wording
and this one has no equivalent approved sentence. The framing above is the owner's; turning
it into a policy sentence is the DPO's call, as with everything else here.

One related note for the DPIA rather than the policy: MCP-470 records a trap worth carrying
— the Vercel API's `serverlessFunctionRegion` field returns a single legacy value (`cdg1`)
and does **not** reflect the multi-region selection. Anyone re-verifying the region set must
read the Functions settings, not that field, or they will wrongly conclude EU-only.

## Optional transparency addition

Not one of the six; offered because the owner's replacement copy removes the false claims
without stating the negatives:

```text
We do not collect your IP address or your location through our MCP apps.
```

Grounding: `$geoip_disable: true` on every event; zero events carrying an IP. Whether to
state a negative explicitly is an editorial and DPO judgement.

## One language rule across every edit

**Never describe MCP usage analytics as "anonymised" or "anonymous".** The identifier is
pseudonymised and remains personal data — ADR-218 is explicit, and
`docs/governance/safety-and-security.md` states that the pseudonym *"is pseudonymised
personal data, not anonymous data: it carries transparency, access, retention and erasure
duties."* The policy's existing *"we do not seek to identify you"* framing must not be
extended over the MCP section.

## Verification base, and its limits

From MCP-443, verified against the live EU production PostHog project on 2026-07-30:
4,159 events since 2026-07-29 ~15:01 BST across exactly four event types
(`$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, `$mcp_resource_read`); the union of
all property keys matches the ADR-218 allowlist; zero events with an IP; GeoIP disabled on
every event; 31 person rows with no person properties; every `distinct_id` a keyed
pseudonym.

Stated limits, so the DPO can weigh the evidence rather than inherit a number:

- **The counts are a 2026-07-30 snapshot** and will have grown, since capture is live. The
  load-bearing claims are the *shape* claims — four event types, allowlisted properties,
  zero content, zero IP — not the totals.
- **The verification was of what has been sent, not a proof of what cannot be sent.** The
  structural guarantee is ADR-218's allowlist; the repository proof that unknown events and
  properties are rejected before transmission is tracked on MCP-173 and is listed there as
  outstanding.
- ADR-218's own maturity note records that acceptance does **not** assert that retention,
  access controls, or the deletion route are live. MCP-173 tracks that evidence.

## What this pack does not cover

- The **DPIA** itself, and the processor records — Edit 6 and §GAP each supply one fact for
  them (the Sentry/PostHog identifier split, and the multi-region compute posture).
- **Policy prose for the residency gap.** §GAP names the obligation and the owner-approved
  framing; it does not draft the sentence, because no approved sentence exists to assemble
  from.
- **Public-beta enablement**, which MCP-173 gates separately and which is a distinct
  decision from initial submission.
- The **enforced retention re-basing** (PostHog project setting and the scheduled deletion
  job) from 12 months to 5 years, which ADR-218's amendment records as separately tracked.
- **MCP-173's own 12-month text**, which needs re-basing against the amendment.

## Who wrote this, and how

Assembled by an AI agent — Breeze tracks Troposphere, a Claude session working on the
MCP-507 submission-prep lane, 2026-08-05 — from MCP-443's edits and grounding, re-verified
first-hand against ADR-218 (including its 2026-08-03 amendment),
`docs/governance/safety-and-security.md` §Compliance Considerations, and MCP-173. Every
wording is MCP-443's or the owner's own draft except where this pack flags a correction.
Nothing here is decided; the words are the DPO's.
