---
status: permanent-dated-record
date: 2026-08-05
subject: submission-human-gates
source: every state verified first-hand against Linear at 2026-08-05 ~16:05Z (issues + comments + relations), not inherited from any prior read
identity: Breeze tracks Troposphere / claude / d5f748 (Implementer, non-code submission prep)
---

# The human gates on the Claude submission — who owns what, and what is waiting on you

Owner-requested. One section per non-engineering gate. Every state below was read directly
from Linear at approximately 16:05Z on 2026-08-05, including ticket comments and blocking
relations — nothing here is carried over from an earlier summary, because several of these
tickets have gone stale underneath themselves this week.

No personal email addresses appear in this document. People are named by name and role.

## At a glance

| # | Gate | Who owns it | State | Waiting on you? |
| --- | --- | --- | --- | --- |
| 1 | Curriculum expert sign-off on plugin content (MCP-339) | **UNASSIGNED** | Not started, 6 days still | **Yes — get a name on it** |
| 2 | Listing name and copy (MCP-292 / MCP-306) | Jim signs, you hold the form | Copy ready, 4 items open | **Yes — 3 decisions** |
| 3 | Privacy policy edits (MCP-443) | Jayne (DPO) | Pack ready, not yet with her | **Yes — get it to her** |
| 4 | Comms sign-off (MCP-268) | You | Never scoped; its date has passed | **Yes — define or stand down** |
| 5 | Four upstream API defects (MCP-327/328/329/330) | Aakesh | All 4 unmoved 6 days | **Yes — chase or trigger MCP-420** |
| 6 | Carousel screenshots (MCP-458) | You | Plan ready, capture blocked | **Yes — one sequencing call** |
| 7 | Public documentation (MCP-308 / MCP-301) | You (on the mirror) | Copy finalised, publish held | No — waiting on M4 |
| 8 | Free-text input privacy (MCP-468) | You | Engineering done; a contract question remains | **Yes — one question to Elastic** |

Gate 8 is not on the list I was given. I have included it because it is a live blocking
relation on MCP-309 and sits in the same family as gate 3; strike it if that is deliberate.

## 1. Curriculum expert sign-off on plugin content — MCP-339

**What it is.** A named Oak curriculum expert reads the plugin's shipped content — four
skills, four workflows, four agents — and confirms the pedagogy, principles and standards
encoded in it are faithful to Oak's actual positions.

**Who owns it.** **UNASSIGNED.** The ticket has no assignee. A comment dated 2026-07-29
records the owner word that Jim takes this to the expert directly, "owner-in-motion, not
agent-routable" — but **the expert's name has never been written onto the ticket**, so from
the board there is no identifiable person holding it.

**State.** Not started. Backlog since it was created on 2026-07-29; last touched
2026-07-30 at 11:02Z, so six days without movement. It **does still block MCP-309** — I
verified the blocking relation is live. It was re-homed to the OKR project on 2026-07-30,
which dropped its M0 milestone membership but left the blocking relation intact, so it can
look absent from the release board while still gating submission.

**What you do next.** Two things. Get the expert's name onto the ticket so the gate has a
visible owner. And when you speak to them, they need to settle **two specific questions**
that the PR #620 review surfaced and deliberately left for this sign-off:

1. Nine WCAG-precision critiques of the `oak-accessibility` skill's "house bar". The
   review found statements that are imprecise about WCAG as published — but Oak's text is
   a deliberately stricter authored bar. Whether each is *intentionally stricter* or simply
   *wrong* is this expert's judgement, not a defect to fix pre-emptively. The list is in
   PR #620's round-2 record.
2. An internal inconsistency: the bundled quality standard names **WCAG 2.1 AA** while the
   reviewer instruction treats **2.2** as Required. Which is Oak's bar?

**Where the substance lives.** MCP-339. The review surface is the merged plugin content
from PR #620, already truth-swept (MCP-340 discharged via #623), with the
attribution/source trails inside each skill.

**One thing to know before any fix is made.** The plugin content is a subset *copy* of the
private `oaknational/oak-skills` repository. Content corrections land **upstream** there and
flow down; fixing only the plugin copy forks it from its source.

## 2. Listing name and copy — MCP-292 and MCP-306

**What it is.** The words a teacher reads when deciding whether to connect Oak to Claude,
and the form fields those words go into.

**Who owns it.** Jim signs off the copy — MCP-292's standing rule is that outward-facing
wording is assembled from approved sources and anything new goes to Jim as finished
options. You hold the form itself.

**State.** The copy is assembled and measured. Four things are open, and one of them cannot
be undone later.

**What you do next — three decisions and one lookup:**

1. **The name.** This is the only irreversible field on the entire listing: the form derives
   a permanent slug from it. Three options, all traced to approved sources —
   `Oak National Academy`, `Oak Curriculum`, `Oak Open Curriculum`. A separate decision card
   carries the trade-offs. Nothing else on the listing needs deciding before submission;
   this does.
2. **Categories — nobody can fill this from what we hold.** The form requires one to five,
   but no source in the repo or on any ticket lists the options Anthropic offers. It needs
   reading off the live form. Editable after submission, so it is not urgent, just
   unanswerable from here.
3. **Sponsored or promoted content.** Currently answered "Other — links back to original
   content on our own site in some cases." Recommend changing to a plain **No**: Anthropic
   prohibits advertising and paid placement, and linking to Oak's own free curriculum is
   neither. The current answer invites a reviewer question for no benefit.
4. **Which tagline.** Three options, all measured to fit the character limit.

**Where the substance lives.** MCP-292 and MCP-306, plus
`.agent/reports/mcp-292-306-listing-copy-pack-2026-08-05.md`.

**One field that will go stale on you.** Connection requirements currently must say an
invitation is needed, because sign-in is invite-only. The moment M4 lands that stops being
true. Do not paste that field from anything written earlier — it is the one listing field
whose truth flips at the M4 boundary.

## 3. Privacy policy edits — MCP-443, to Jayne

**What it is.** Six exact edits to the live privacy policy so that its shared AI-tools
section is true of the MCP app as well as Aila. Several current sentences are false for the
MCP app.

**Who owns it.** Jayne, as DPO.

**State.** In Progress since 2026-07-30. The review pack is written and ready — **but it has
not reached her.** It exists only as a repository document, because writing to Linear under
your account needs your sanction and I stopped rather than assume it.

**What you do next.** Get the pack to Jayne. The ask on her is deliberately narrow: **five
of the six edits are factual corrections** that need approval rather than judgement — the
policy currently says things that are not true — and **only one is a genuine determination**
(the lawful basis for usage analytics, currently stated as consent, which cannot be right
because no consent surface exists in any MCP host). That one is the real decision; the other
five are sign-off.

**Where the substance lives.** MCP-443, plus
`.agent/reports/mcp-443-privacy-policy-dpo-review-pack-2026-08-05.md`.

**Two things in that pack you should know about before she sees it.** The ticket's own
retention edit was stale — it proposed 12 months, superseded on 2026-08-03 by the amendment
to five years that Jayne herself was party to; the pack carries the corrected figure. And a
seventh obligation was assigned to this ticket on 2026-08-04 (describing the connector's
multi-region processing accurately) that never made it into the ticket's edit list; the pack
flags it as a gap. Neither was visible from the ticket alone.

## 4. Comms sign-off — MCP-268

**What it is.** Honestly, nobody has said. The ticket exists to witness that comms sign-off
is part of the submission, and it states plainly that its scope — which outward-facing
surfaces it covers and who signs — is "the owner's to define at pickup."

**Who owns it.** You are the assignee.

**State.** Todo, created 2026-07-27, **never scoped**. Its gate date was recorded as riding
M0, "Friday 2026-07-31" — that date has passed. This is the only gate on the board that
cannot be assessed at all, because it has never been given content.

**What you do next.** Either define it — name the surfaces it covers and who signs — or
explicitly stand it down. Both are fine; leaving it undefined means submission proceeds with
an owner-named gate nobody can confirm was met.

**Where the substance lives.** MCP-268, and nowhere else.

## 5. Four upstream API defects — MCP-327, 328, 329, 330, with MCP-420 armed

**What it is.** Four defects in the upstream Oak API's own published schema. They matter
because our tool descriptions are generated verbatim from it, so a connected assistant — or
an Anthropic reviewer — reads them.

**Who owns them.** All four are assigned to Aakesh.

**State.** All four Backlog, all last touched 2026-07-30 at 11:20Z — **six days, no motion
on any of them.**

| Ticket | Priority | What breaks |
| --- | --- | --- |
| MCP-327 | High | The advertised example sequence slug does not resolve. Our own test suite already asserts it is invalid. |
| MCP-328 | High | The advertised example lesson's assets are licence-restricted, so the documented call always fails — and it fails by telling a teacher Oak's resources are copyright-restricted. |
| MCP-329 | Medium | A grammatical error served verbatim to every assistant, plus two unconfirmed observations about the documented path and return type. |
| MCP-330 | High | The schema says every parameter is optional; the endpoint rejects the empty call. A machine client cannot satisfy the contract from the contract. |

**What you do next.** Either chase Aakesh, or use the contingency. **MCP-420 is armed and
waiting on your word**: it patches the spec at ingest time, self-retires when each upstream
fix lands, and your trigger at form-fill also rules those tickets' blocking edges off
MCP-309. It is decision-complete and not executing.

One nuance worth carrying: **MCP-330 is not a fix, it is a product decision** — what should a
bare keywords call mean? Nobody has proposed an answer because it is a judgement about
intent, so chasing it as a bug will not move it.

**Where the substance lives.** MCP-327/328/329/330; MCP-420 and its delivery plan.

## 6. Carousel screenshots — MCP-458

**What it is.** Three to five PNG images for the directory listing carousel, cropped to
Oak's response with the prompt supplied separately per image.

**Who owns it.** You are the assignee; the capture needs someone driving a Claude client
with the connector connected.

**State.** Plan complete, shot list ready with four prompts drawn from approved sources.
The banner spacing fix that gated the shoot is **verified present in the deployed production
build** (first shipped in v1.125.4; production is at v1.150.2). Capture itself has not
happened.

**What you do next — one sequencing call.** As of the successful OAuth run at approximately
16:02Z, a working capture vehicle demonstrably exists. But MCP-458 says shoot the *final
live app, not a preview*, and production is still bound to the development Clerk instance
until the cutover. So: shoot **after** the production cutover, so the carousel shows the app
as submitted — my recommendation — or accept a preview bound to production Clerk. The images
look the same either way; the question is what you want to have photographed.

**Where the substance lives.** MCP-458, plus
`.agent/reports/mcp-458-carousel-screenshot-plan-2026-08-05.md`.

**One shot needs a check before it is taken.** The fourth prompt asks for lesson resources,
and MCP-328 above means it may return a copyright refusal. Run it and read the response
before capturing it; if it refuses, drop it — three images meets the requirement.

## 7. Public documentation — MCP-308, owned by MCP-301

**What it is.** One public page a teacher, or the school IT person deciding whether to
approve the connector, can read. Anthropic requires it live by the publish date; a blog post
or help-centre article is enough.

**Who owns it.** You are the assignee on MCP-308, the release-project mirror. **The owning
ticket, MCP-301, has no assignee** and sits in Backlog in the OKR project.

**State.** The copy is **done**. A finalised draft is homed on MCP-308 as a comment dated
2026-08-05, covering all five required elements, with all five of its own decisions closed
and an explicit hold: do not publish before M4, because the app is invite-only until then.

**What you do next.** Nothing now. After M4: publish it, then put the URL on the form. In
the meantime Anthropic accepts sharing documentation privately during review, so the missing
public URL is a sequencing matter, not missing work.

**Where the substance lives.** The draft is a comment on MCP-308; scope is owned by MCP-301.

**Two refinements worth making before it publishes.** The draft says the connector "runs
across multiple regions, including the United States" — true, and matching the owner
decision, but it omits the mitigating half of the approved wording ("no storage in the
functions and no personal data retained in compute; persistent stores remain EU-resident").
For the school-IT half of its stated audience, the bare version is both more alarming and
less accurate. Separately, it says "thousands of lessons" where the approved description says
"over 12,000" — countable beats vague. Both are existing approved copy, so both are cheap.

**One board-hygiene note.** Because the work lives on the mirror and not the owning ticket,
MCP-301 reads as untouched — and MCP-308's own rule says that if the two disagree, MCP-301
wins. Worth reconciling so a later reader does not conclude the page was never drafted.

## 8. Free-text input privacy — MCP-468 (not on the list I was given)

**What it is.** Whether the connector needs a user warning about not typing personal
information — which turns on whether free-text input is retained anywhere. Only two of the
forty tools take human-typed text at all.

**Who owns it.** You are the assignee.

**State.** Todo. The **engineering half is done and evidenced**: free-text provably never
reaches analytics (guarded by a build-failing test), cannot reach error diagnostics, is
never logged, and the one query-persisting sink is not wired into the connector's path.

**What you do next — one question, and it is not an engineering question.** The residual is
contractual: whether Elastic, as operator of the managed search service, retains search
request bodies in its own operator-side logs. Public documentation cannot answer it. It
needs asking via Elastic's data-handling terms or their support directly. There is also a
standing guard recorded: do not enable query logging if Elastic later offers it, without a
privacy review.

The decision on the warning is already made and recorded: include it, framed as a user
obligation, and **do not claim automated filtering** — we do not filter inputs.

**Where the substance lives.** MCP-468, alongside MCP-443 and MCP-461 for the wording.

## Four things that are wrong on the board itself

These are not gates. They are stale records that will mislead whoever reads them next, and
each needs a small deliberate fix rather than being discovered again.

1. **MCP-173** states a 12-month analytics retention period in four places. It was
   superseded on 2026-08-03 by the amendment to five years, and MCP-173 was updated *after*
   that date without the figure changing — so the drift survived an update and will survive
   another.
2. **MCP-309** still lists MCP-470 as a blocker. MCP-470 is Done, and its own closing
   comment states that the blocking edge was removed. The removal was described but not
   performed, so the submission's blocker set reads longer than it is.
3. **MCP-443** is short the residency edit that MCP-470's closing decision assigned to it.
   The DPO pack carries it as a flagged gap, but the ticket itself does not.
4. **A departed Clerk contact** is named in Linear tickets — including a live mailto in
   MCP-507's own runsheet step 4 — and in 28 coordination records. The coordination records
   are immutable history and should be left alone; the tickets are worth correcting, because
   someone following that step could email a dead address.

## A pattern worth naming, because it caused three of the findings above

Four of these gates carried something that was accurate when written and had quietly become
false: MCP-443's retention figure, MCP-443's missing obligation, MCP-309's blocker list, and
MCP-507's contact address. None of them looked stale. Each read as current, and each was
being cited as authority.

The only thing that caught them was opening the source a ticket cited instead of trusting
the ticket's summary of it. On a board this size, a ticket's age is a live risk factor rather
than metadata — and this week almost every ticket is older than the facts inside it.

## Who wrote this, and how

Assembled by an AI agent — Breeze tracks Troposphere, a Claude session on the MCP-507
submission-prep lane — at the Director's routing of the owner's request, 2026-08-05. Every
state was read first-hand from Linear at approximately 16:05Z, including comments and
blocking relations, rather than inherited from any prior summary. Where a state could not be
determined from available sources it is marked as such rather than guessed.
