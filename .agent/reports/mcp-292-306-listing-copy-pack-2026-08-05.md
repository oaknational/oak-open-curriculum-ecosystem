---
status: permanent-dated-record
date: 2026-08-05
subject: mcp-292-306-listing-copy
source: MCP-444 (Aakesh's checked draft, §§6-19), MCP-292, MCP-306, .agent/reports/claude-directory-submission-form-inventory-2026-07-28.md, MCP-470 (residency), MCP-308 comment 7de5f83a (support contact)
identity: Breeze tracks Troposphere / claude / d5f748 (Implementer, non-code submission prep)
---

# Connector listing copy — assembled for sign-off

Serves MCP-292 (the words) and MCP-306 (the form fields). **This is the body-copy half
only.** The listing NAME is deliberately excluded: it derives the permanent, irreversible
slug and is carded separately, because the name blocks and the body copy does not.

**Nothing here is invented.** Every line is MCP-444's checked draft, an owner-approved
source, or a field value already on the record. Where no approved source exists, the field
is marked **GAP** and left empty rather than filled — those need human authorship.

Character counts below are measured, not estimated.

## Standing caveat on the one-liner cap

Two approved sources disagree: the form inventory (owner's own live-form capture) records
**One-liner, max 200 chars**; MCP-444 §6 and MCP-292's table both say **tagline, 55**. It is
unresolved and only a look at the live form settles it — routed to the Director 2026-08-05.

**All one-liner candidates below are written to 55 characters**, the safe bound: copy that
fits 55 is valid under either answer, and the field is editable after submission if the cap
turns out to be 200. Only the slug is not editable, so the conservative read costs nothing.

## Field 1 — One-liner / tagline · THREE OPTIONS, all fit

MCP-444 §7 verbatim. All three measured inside the 55-char safe bound:

| # | Copy | Chars |
| --- | --- | --- |
| A | `Explore Oak's free, fully sequenced curriculum` | 46 |
| B | `Free, sequenced lessons and resources from Oak` | 46 |
| C | `Plan with Oak's free, teacher-made curriculum` | 45 |

Reading them for whoever chooses: **A** leads with the curriculum's completeness
("fully sequenced"), which is Oak's real differentiator. **B** leads with what a teacher
receives (lessons and resources) and is the most concrete. **C** leads with the job
("plan") and is the only one that names teacher authorship. Any is defensible; MCP-444 named
these for Alexis to take or reshape.

## Field 2 — Description · 1,129 of 2,000 chars

MCP-444 §8 verbatim. Measured **1,129 characters**, comfortably inside the 2,000 cap with
871 characters of headroom.

```text
Oak National Academy is a public body sponsored by the Department for Education. We provide
a free, optional, fully sequenced curriculum aligned with the national curriculum for
England, created with teachers and subject experts.

This connector gives Claude read-only access to our Curriculum API: over 12,000 lessons
organised into sequenced units across 17 subjects and key stages 1–4, with cross-year
learning threads, key vocabulary, documented pupil misconceptions, prior-knowledge links,
quizzes, and downloadable resources — slide decks, worksheets, and starter and exit quizzes.
Coverage varies by subject and key stage.

Use it to search the curriculum by topic, key stage and year; see how a concept builds
across year groups; check what prior knowledge a unit assumes and which misconceptions to
plan for; and generate secure download links for lesson resources.

Lesson content is available under the Open Government Licence v3.0, except where otherwise
stated, and requires attribution to Oak National Academy. See our API terms and conditions:
https://www.thenational.academy/legal/terms-and-conditions-api-version
```

Four properties of this draft are load-bearing and should survive any rewording (MCP-444's
own note):

1. **"public body sponsored by the Department for Education"** matches the gov.uk
   classification. The previously-drafted *"publicly funded, independent body"* can read as
   the opposite of what Oak is.
2. **The numbers are real and re-checkable.** *"thousands of curricula"* matched nothing
   countable; *"over 12,000 lessons"* does.
3. **"Coverage varies by subject and key stage"** — a small hedge that saves support
   contacts later.
4. **The licensing sentence mirrors the API terms** (*"except where otherwise stated"*) and
   carries the link.

Re-verify the counts (12,000 lessons, 17 subjects) at paste time if the API has moved since
2026-07-30, when MCP-444 checked them. Anthropic's policy is unambiguous that a listing must
not overstate capability.

## Field 3 — Primary use cases · 370 chars

MCP-444 §9 verbatim:

```text
Teachers use Oak to cut planning time: find lessons and ready-made resources on any topic,
check how a concept develops across year groups, and anticipate the misconceptions pupils
bring. School and trust leaders use it to review coverage and sequencing against the
national curriculum. Everything is openly licensed, so you can adapt what you find for your
own classes.
```

## Field 4 — Example prompts · form asks for three, four offered

MCP-444 §10 verbatim, each exercising a different tool. Anthropic requires **at least three
that work**.

```text
1. Find KS3 science lessons about photosynthesis
   -> search

2. Which misconceptions should I plan for when teaching fractions in year 3?
   -> get-misconception-graph

3. How does number develop from year 1 to year 11 in maths?
   -> get-thread-progressions

4. Get me the worksheet and slides for Oak's lesson on food chains
   -> get-lessons-assets + download-asset
```

**Prompt 4 carries a verification condition.** MCP-328 (open) records that the lesson
advertised in our own assets schema is licence-restricted, so the documented path can return
*"Resource unavailable due to copyright restriction."* Whether the food-chains lesson's
assets are restricted is unverified. Anthropic's review criteria expect the example prompts
to work, and a reviewer running a failing prompt is a rejection risk. **Run all four before
pasting; if 4 refuses, submit 1–3** — three satisfies the requirement. The same condition
governs the carousel shot list (see the MCP-458 plan).

## Field 5 — Connection requirements

Assembled from MCP-444 §11, with one time-sensitive addition.

```text
The connector is read-only and requires signing in with an Oak account; there are no client
IDs or secrets to configure. Oak does not impose a per-user or per-key request quota on this
connector. The service sits behind Cloudflare and Vercel, whose platform-level protections
apply to volumetric and abusive traffic; normal interactive use by a teacher or an assistant
is well within them. The get-rate-limit tool reports the current allowance at any time and
explains what its response means; checking does not count against the quota.
```

**THIS FIELD IS AUTHORITATIVE — the submission draft's version is stale.** The Anthropic
submission draft still reads "1,000 requests per hour (sliding window), enforced per API key
by the upstream Oak Curriculum API". That claim is withdrawn (see below) and must not be
pasted. An earlier revision of this pack said the draft wins wherever the two differ; that
precedence is reversed for this field, because the draft carries the number this field exists
to remove. Correcting the draft is listed as an outstanding item.

**Raw `X-RateLimit-*` headers deliberately dropped from the paste copy.** An earlier draft of
this replacement pointed reviewers at the tool *or* the headers. That was a trap: the headers
carry the same figures, but a bare `X-RateLimit-Limit: 0` reads naturally as "no allowance"
when it in fact means "no cap". Only the `get-rate-limit` tool's own description states that
convention — *"A response of limit=0, remaining=0, reset=0 indicates an unlimited API key
with no rate cap"* — so the tool is self-explaining and the headers are not. Pointing a
reviewer at an ambiguous signal and then asserting the text and the tool agree would have
been worse than saying nothing. (The header convention above is inferred from the tool's
documented behaviour over the same upstream values, not read from a header specification —
another reason not to put it in outbound copy.)

**No rate-limit figure, by owner ruling (2026-08-06).** Earlier revisions of this field named
"1,000 per window" and then "1,000 per hour (sliding window)". Both are withdrawn: there is
no such limit. MG: *"we don't impose any ourselves and neither does the upstream API
(apparently that ADR is ancient and stale)... but it's behind cloudflare/vercel which have
some 'reasonable use' clause we should put in instead of this 1000 rate limit."* Jim,
independently: *"All mcp connections share a single API key, that API has no rate limit."*

**Where the number came from, so it is not reintroduced.** ADR-070 (2025-12-07) recorded a
1,000 requests/hour limit as a property of *the Oak API*, having observed it on the key in
use at the time. It travelled ADR-070 → MCP-444 §11 → this pack → the submission draft,
faithfully copied at every step and never rechecked against the surface it described. The
figure was real when measured; its scope was lost in transit. ADR-070 still asserts it and is
tracked for a superseding note on MCP-515.

**Why the wording is shaped this way.** It states what does NOT exist rather than implying a
cap, so no figure has to be defended. And it keeps the `get-rate-limit` reference because the
tool is real: it currently reports no cap, which now AGREES with the text. Previously the
field invited a reviewer to run the very call that contradicted it — a first-hand check on
2026-08-06 returned `limit=0, remaining=0, reset=0`, which that tool documents as an
unlimited key. No platform figure is quoted because neither Cloudflare's nor Vercel's
protections publish one that could honestly be stated here.

**Time-sensitive — must be re-stated at paste time.** MCP-292 records that what someone
needs before connecting is *"an invitation, while sign-in is gated"*. Sign-in is invite-only
private beta until the M4 switchover. So this field's truthful content **depends on whether
M4 has landed when the form is submitted**:

- **If still invite-only:** the invitation requirement must be stated, and MCP-309 flags
  separately that a reviewer cannot get in unaided — either the gate lifts or the reviewer is
  seeded an account (MCP-303 owns the reviewer access pack).
- **If M4 has landed and sign-in is open:** the copy above stands as written.

Do not paste this field from a snapshot. It is the one listing field whose truth changes at
the M4 boundary.

MCP-444 §11 also notes a result-size line should be added once MCP-441 settles the posture.

## Field 6 — Data handling

MCP-444 §14 verbatim, **plus the residency sentence MCP-470's owner decision requires**:

```text
The connector serves openly licensed curriculum content and does not store conversations. It
processes the tool arguments Claude sends — which may include free-text search terms —
together with authentication and request metadata, to serve requests, secure the service and
measure usage; usage analytics are pseudonymised. Users should not include pupil names or
other personal information in queries. All data is handled in accordance with Oak's privacy
policy (below).
```

**Residency addition — required, not optional.** MCP-470's owner decision (Jim 2026-08-03,
Matt 2026-08-04) was to **keep multi-region including the US** and to describe it accurately;
its closing comments state the data-handling statement "must NOT claim EU-only residency".
The owner-approved framing:

```text
multi-region (incl. US), with no storage in the functions and no personal data retained in
compute (transient processing only); persistent stores remain EU-resident
```

Turning that framing into a final sentence sits with the DPO alongside the privacy-policy
edits — the same obligation is flagged as a gap in the MCP-443 DPO pack, because MCP-443's
own edit list never absorbed it.

**Language rule, absolute:** never *"anonymised"* or *"anonymous"* for MCP usage analytics.
The identifier is pseudonymised and remains personal data (ADR-218).

## Field 7 — Third-party connections

MCP-444 §15 verbatim:

```text
The connector calls the Oak Curriculum API (open-api.thenational.academy). Supporting
services: Clerk (authentication), Elastic Cloud (search), Sentry and PostHog (monitoring and
pseudonymised analytics), Vercel (hosting) — all named in Oak's privacy policy. The Oak
Curriculum Ontology (github.com/oaknational/oak-curriculum-ontology) is a provenance source
built into the server, not a runtime dependency. Lesson assets may include third-party
content; attribution requirements are set out in the API terms and conditions.
```

## Field 8 — Resources and prompts

MCP-444 §13 verbatim. The previously-drafted *"No resources or prompts will be exposed"* is
false — six resources are live:

```text
No MCP prompts are exposed. Six MCP resources are served: a getting-started guide, three
workflow-guidance documents (find-lessons, explore-curriculum, learning-progression), the
curriculum model, and the Oak Curriculum App UI widget (an MCP App).
```

## Field 9 — Allowed link URIs

The listing declares which origins the app may open. Only Oak-owned addresses, and
subdomains must be listed individually.

```text
https://www.thenational.academy
https://support.thenational.academy
```

`www` is from MCP-292 (the widget links back to Oak). `support` is from MCP-444 §19 — the
served fonts tip links there today. **Conditional:** MCP-438 is open and removes that
embedded tip; if MCP-438 lands before submission, re-check whether `support` is still
reachable from the app and drop it if not. Declaring an origin the app cannot open is
harmless; omitting one it can open is not.

## Field 10 — The mechanical MCP-306 fields

| Field | Value | Source / status |
| --- | --- | --- |
| Name + derived slug | **CARDED SEPARATELY** | Irreversible; see the name decision card |
| Company name | Oak National Academy | MCP-306: already answered |
| Company website | `https://www.thenational.academy` | Oak's public site |
| Author | company name + website (rather than a person) | MCP-306 permits either; company form avoids naming an individual on a public listing |
| Support | `help@thenational.academy` | MCP-308's owner-approved draft (comment 7de5f83a) |
| Privacy policy | Oak's live policy URL | Required; the MCP-443 edits must land for it to be accurate |
| Documentation | **DEPENDENCY, not a URL** | See below |
| Read/write | `read_only` | MCP-306: already answered |
| Authentication | OAuth 2.0 + DCR (`oauth_dcr`) | Already set; MCP-304/MCP-271 may revisit |
| Personal health data | No | MCP-306: already answered |
| Sponsored / promoted content | **Recommend plain `No`** | See below |
| Categories | **GAP** | See below |

**Documentation link.** Both casings of the previously-drafted URL return 404 — it was a
guess at a page that does not exist yet. MCP-444 §16's recommendation stands: record the
dependency rather than a URL. Anthropic accepts private doc sharing during review, with the
page public by the publish date. The page's finalised draft is on MCP-308 (verified present
and complete, publish held to post-M4), so the copy exists; only the public URL does not.

**Sponsored / promoted content.** Currently answered *"Other — links back to original content
on www.thenational.academy in some cases."* MCP-306's own analysis recommends changing this to
a plain **No**, and I agree: Anthropic's policy prohibits advertising, sponsored content and
paid placements, and linking to Oak's own free curriculum is none of those. The current answer
invites a reviewer question for no benefit. **Jim's call**, per MCP-306.

**Categories — GAP, genuinely unfillable from our evidence.** The form requires 1–5. Neither
MCP-292, MCP-306, MCP-444, nor the form inventory enumerates the category options Anthropic
offers — the inventory captured only the constraint (*"at least one, up to 5"*). I have not
guessed. MCP-292 notes categories "shape who finds us, so worth deciding deliberately rather
than by default", which makes guessing the wrong move twice over. Two ways to close it: read
the option list off the live form, or have it read out to whoever chooses. Categories are
editable after submission, so this is not a one-way door — it is simply a field nobody can
fill from what we hold.

## What is still outstanding on this listing, in one list

1. **Name** — carded separately, irreversible, blocks the slug.
2. **One-liner cap** — 55 vs 200 unresolved; copy written to 55 so it is safe either way.
3. **Categories** — GAP; needs the live form's option list.
4. **Documentation URL** — does not exist yet; record the dependency (MCP-301 / MCP-308).
5. **Connection requirements** — settled. The M4 boundary has passed and sign-in is open
   (owner verified against production 2026-08-06 with a non-Oak email, no invitation), so the
   field above stands as written; do not reintroduce the invitation caveat.
6. **Residency sentence** — owner framing exists; final wording sits with the DPO.
7. **Example prompt 4** — run it first; drop if the assets call refuses (MCP-328).
8. **Sponsored content answer** — recommend `No`; Jim's call.
9. **Result-size line** — add once MCP-441 settles (MCP-444 §11).
10. **`support` link URI** — re-check if MCP-438 lands first.
11. **Correct the submission draft's rate-limit field** — the draft still states "1,000
    requests per hour (sliding window), enforced per API key by the upstream Oak Curriculum
    API". There is no such limit (MCP-513). Until the draft is edited, the false number is
    still pastable from it; use Field 5 above instead, which supersedes it. ADR-070, the
    figure's origin, also still asserts the limit (MCP-515).

Choices 1, 3 and 8 are human decisions. Everything else is a verification or a dependency
with a known owner.

## Who wrote this, and how

Assembled by an AI agent — Breeze tracks Troposphere, a Claude session on the MCP-507
submission-prep lane, 2026-08-05 — from MCP-444's checked draft and other approved sources.
No outward-facing copy was invented; every GAP is left empty rather than filled. Character
counts are measured. Per MCP-292's standing rule, genuinely new wording goes to Jim as
finished options, never as a blank page — and the three unfillable fields are named as such.
