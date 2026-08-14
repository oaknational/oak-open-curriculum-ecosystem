---
title: Editorial Tone of Voice
type: directive
status: active
last_updated: 2026-08-11
---

# Editorial Tone of Voice

Oak's editorial voice, for copy that carries Oak's name and is read to be
oriented, persuaded, or informed about the work — as distinct from copy read to
build the system precisely. This directive governs the first kind of writing;
it must stay out of the second.

## Where this applies — and where it must not

**Apply the editorial voice to:**

- `VISION.md` (repository root)
- strategy documents (as they come to exist)
- the public-facing, narrative parts of `README.md` and other outward-facing
  documents
- any Oak-named outward copy authored in this repository (announcements,
  partner-facing material, the framing prose of public reports)

**Do not apply it to** — here, precise transmission of understanding to builders
comes first, and an editorial voice would interfere with it:

- plans under `.agent/plans/`
- ADRs and architecture documents
- the developer-facing parts of `README.md` (Quick Start, install and verify,
  key commands, architecture, workspace summaries, the contributing process) and
  the `docs/engineering/` and `docs/operations/` surfaces
- agent directives, the Practice Core, rules, code, code comments, commit
  messages, and collaboration or state surfaces

When one document holds both — the README is the clear case — apply the voice to
the public-facing narrative and leave the developer-facing sections in plain
technical English.

## The three principles

Three principles work together. Cut any one and the voice changes.

- **Empower the reader, not Oak.** Every sentence exists to make the reader's
  work better, easier, or more effective. Oak is the supporting cast, not the
  protagonist. Count the "we"s and "our"s; turn as many as carry meaning into
  "you" and "your". Stats and accolades serve the reader ("join over 100k
  teachers"), never flatter Oak ("we have 100k teachers").
- **Be personable.** First and second person. Contractions, always — we're,
  you're, don't, it's — even in formal copy. Write how you'd speak; read it
  aloud, and if you wouldn't say it to a colleague, rewrite it.
- **Be clear and direct.** Plain words, short sentences, the point at the start.
  No throat-clearing, no apology, no jargon. You can almost always cut words;
  where you can, do.

## Audience adaptation

The "you = the reader, Oak = supporting cast" mechanic is calibrated to
**teacher-facing** copy, where the teacher is the protagonist. Strategic and
internal documents — the vision, the strategy — are Oak speaking about its own
work to Oak and the sector. There, keep the voice **qualities** (clarity,
directness, plain English, confidence, British English, lead-with-value, and the
anti-patterns below) in the first-person "we" voice, and reserve the
teacher-protagonist "you" mechanic for genuinely teacher-facing surfaces. Do not
turn a strategic document into marketing copy; do not let a strategic document
slip into institutional third-person ("the platform provides…") either.

Name the audience(s) the document actually serves, then calibrate — most of
these documents serve more than one. Two things move the register: **who** the
reader is, and **whether they decide or build**. Practitioners and engineers want
capability, contracts, and how it works ("can I build on this, and will it
hold?"); leaders and executives want value, impact, cost, risk, and strategic fit
("why invest, and what does it change?").

The audiences this repository writes for:

- **Teachers** — the default teacher-facing register: warm, peer-to-peer,
  practical; assume craft expertise; teacher as protagonist.
- **Education leaders** (school and trust) — more operational; lead with the
  outcome (time saved, reach, evidence) and back it with the mechanism.
- **EdTech and AI builders** (engineers) — lead with what they can build and the
  contracts they can trust: typed SDK, MCP, schema-first guarantees, openly
  licensed data.
- **EdTech and AI leaders** (executives) — lead with leverage: lower cost of
  innovation, a single integration point, the open public-good and partnership
  case.
- **Oak's own engineers and teams** — direct and concrete; the vision and
  strategy are written here first for Oak deciding to back this as a product and
  the people building it.
- **Press, public, DfE, and sector partners** — short, quotable, declarative;
  recognisably Oak, impact-led, grounded in evidence, never a procurement
  register.

Add others as a document needs them. The voice qualities and anti-patterns hold
across every audience; only the emphasis and the entry point change.

## The first paragraph stands alone

Many readers read only the first paragraph — and they're typically the least
technical stakeholders the document serves. Write the opening paragraph as the
whole story in miniature: what happened, why it matters, what comes next. A
reader who stops there leaves correctly informed, just less precisely; every
section after it is elaboration for readers who continue.

Two consequences:

- The document's single most important claim goes in the first paragraph, in
  plain words — never introduced for the first time below a later heading.
- Calibrate the first paragraph to the least technical audience the document
  serves; the technical registers get their depth in the sections that follow.

## The strategic frame — imply, never state

Oak's strategy stands on three pillars: **supporting schools, supporting
teachers, and supporting the wider ecosystem** — with "ecosystem" read widely:
the education sector, edtech, and the AI players' work in education. Oak is
publicly funded, so providing public goods and services is the obligation and
the privilege behind the work.

When writing or reviewing audience-facing content, check whether the value
claim can ladder up to a pillar, and tie the repository's value and impact
back to the pillars wherever it naturally can. Then **imply, never state**:

- Never quote the pillar formula, the funding rationale, or the
  obligation-and-privilege line verbatim in published copy. Organise the
  content so teachers, schools, and the wider ecosystem are visibly served, in
  that spirit.
- Prefer ecosystem-framing phrases ("supporting and building on the
  innovations of the wider ecosystem") over naming specific partner datasets
  in timeless documents — named sources date the copy and pre-empt
  owner-shaped source strategy.

## "We", not "Oak"

Default to "we" as Oak's voice; avoid third-person "Oak does X" unless the
distance is genuinely needed (formal text, or first introduction to a new
reader). When the company name is needed, use "Oak", not "Oak National Academy"
— the full legal name is reserved for legal text and the first introduction in a
formal release. "At Oak, we…" is a fine scene-setter; the action stays in first
person.

## British English and terminology

Oak is an English public body — British spelling and conventions throughout:
organise, behaviour, colour, analyse, recognise, centre, focused (single "s"),
licence (noun) / licensed (verb), practice (noun) / practised (verb), programme
(for a curriculum or scheme of work; "program" only for code).

Terminology: **pupils** for learners in compulsory schooling (not "students",
not "kids"); **teachers** (not "educators"); **schools** and, for multi-academy
trusts specifically, **trusts**; **lessons, units, curriculum plans**; **key
stage 1–4** or **KS1–KS4**; **maths** (not "math"); **marking** (not "grading");
**headteacher** (not "principal"); the **national curriculum** (lowercase in
running text; "the National Curriculum" only for the statutory document);
**Aila** (capitalised, no italics). Avoid "students" for school-age children,
"math", US schooling terms (grade, elementary/middle/high school), and
"educators".

## Anti-patterns

Rewrite a draft that shows any of these.

- **The marketing brochure** — "cutting-edge", "world-class", "revolutionary",
  "unlock potential". → The specific promise: "free up two hours of planning a
  week."
- **The institutional voice** — "Oak provides…", "the platform offers…", "users
  can access…". → The conversational voice: "browse the lesson library", "you
  can adapt every lesson".
- **The throat-clear** — "we're delighted to announce…". → The lede: "our updated
  KS3 science curriculum is live."
- **The over-qualified** — "we hope this might possibly help those who…". → The
  direct: "use this when you…".
- **The faux-modesty** — "we're just a small team trying our best". → The
  confident statement: "we're a team of teachers and curriculum experts."
- **The acronym soup** — spell out on first use; an acronym a teacher in another
  subject wouldn't know gets defined or replaced.
- **The American slip** — "students" (for pupils), "math", "grade". → British
  equivalents.

## Self-edit checklist

Run before publishing:

1. **You-count vs we-count** — more "we"s than "you"s? Flip what carries meaning
   (teacher-facing copy especially).
2. **First-sentence test** — does it do work, or set it up? Cut setup.
3. **First-paragraph test** — would a reader who stops after paragraph one
   leave with the whole story? If not, rewrite the opening.
4. **Read aloud** — anything you wouldn't say? Rewrite.
5. **Cut adverbs** — "really", "very", "actually" are usually deletable.
6. **Contractions** — "we are" → "we're"; "do not" → "don't".
7. **Jargon scan** — define or replace specialist terms and acronyms.
8. **British English scan** — no "math", no "students" for pupils, "-ise" not
   "-ize".
9. **Word-count test** — could you cut 20% without losing meaning? Cut it.
10. **The "Oak" hunt** — any "Oak" that should be "we"?
11. **CTA verbs** — "Explore", "Browse", "Try", "See"; never "Click here",
    "Read more".

## Authority

This directive is the host-local instantiation of the optional editorial-voice
concept governed by
[PDR-102](../practice-core/decision-records/PDR-102-editorial-voice-optional-host-defined-scope-bounded.md)
(editorial voice is optional, host-defined, scope-bounded). The voice below is
Oak's own and stays host-local — it does not travel through the Practice Core.

Oak's brand and tone-of-voice guidance is the canonical source:
<https://support.thenational.academy/using-the-oak-brand>. Plain language is the
readability dimension of accessibility (WCAG 3.1); for the full accessibility of
the artefact the copy lives in, apply the accessibility practice.
