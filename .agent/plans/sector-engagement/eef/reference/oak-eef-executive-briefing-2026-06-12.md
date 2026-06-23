# Oak and the EEF: evidence where teachers plan

**An executive briefing — 12 June 2026.** Prepared for executive audiences at
Oak National Academy and the Education Endowment Foundation. This document
stands alone: it is the companion to a detailed technical research record of
the same date, and assumes no prior reading.

## In one paragraph

Teachers increasingly plan lessons with AI assistants. Oak has connected the
EEF's Teaching and Learning Toolkit to that moment: an assistant helping a
teacher with an Oak lesson can now draw on the Toolkit's evidence — impact,
cost, and strength of evidence for thirty teaching approaches — with the
EEF's own caveats, attribution, and limits carried intact into every answer.
The capability is live today on Oak's public AI interface. With a fuller
dataset, an agreed update route, and clear licensing, it could become the
most faithful large-scale distribution channel the Toolkit has ever had.

## What is live today

- Since 8 June 2026, Oak's public AI interface (built on the Model Context
  Protocol, the open standard that lets AI assistants use trusted tools and
  data) serves the Toolkit's thirty approaches as structured, queryable
  evidence: months of additional progress, implementation cost, and
  evidence-strength ratings, with the EEF's definitions and key findings.
- Every response carries the EEF's full attribution — organisation, source,
  and the six named research authors — alongside all nine of the EEF's own
  caveats, and points the reader to the EEF's pages for the most current
  figures. This travels on every answer, not in a footnote.
- A guided lesson-adaptation workflow walks an assistant through Oak's
  curriculum signals (the misconceptions and prior knowledge embedded in Oak
  lessons) to the relevant evidence, keeping the teacher's judgement at the
  centre throughout.
- The work builds on a prototype by John Roberts at Oak, whose early EEF
  integration showed the concept was viable.

## Built for trust

Four design guarantees matter to both organisations:

1. **Faithful transmission.** The system serves the evidence exactly as the
   EEF states it. Verified in production: figures, caveats, and attribution
   arrive intact, item for item.
2. **Honesty about weak evidence.** Where the EEF rates evidence
   insufficient, the system says so. Asked about learning styles, it reports
   unclear impact and insufficient evidence — and the finding that the
   approach is not supported — rather than inventing a number.
3. **The teacher decides.** By deliberate design the system never ranks,
   recommends, or selects. It serves deterministic facts; the assistant
   reasons over them; the professional chooses. There is no algorithm
   deciding what a teacher should do.
4. **No pupil data.** The evidence service involves no data about pupils or
   schools — it serves published research evidence only.

## A worked example, from the live service

A teacher planning a Year 5 fractions lesson asks their assistant for help.
Oak's curriculum data surfaces a real, recorded misconception — that pupils
add the denominators when adding fractions. The assistant retrieves the
EEF's feedback evidence: high impact (six months' additional progress), very
low cost, extensive evidence, and the EEF's own observation that feedback
can correct misconceptions before they become embedded. The teacher receives
an evidence-calibrated option — with the population-average caveat attached —
at exactly the moment it is useful. This loop has been exercised end to end
on the live service.

## New this week: from term plans to Monday morning

Inspired by a recent article by John Roberts, we added a further guided
workflow on 11 June, built on Oak's fully sequenced curriculum. It serves
two quite different planning moments:

- **Planning the sequence, before the term starts.** Most teaching follows
  a route set well in advance. Oak's data already supports that planning —
  the full sequence, what each step assumes pupils already know, and the
  misconceptions to anticipate are all queryable today — and a guided
  workflow for term-ahead sequence planning is the natural next step we
  are building towards.
- **Rescuing Monday morning.** A substitute teacher learns on Sunday night
  that they are teaching tomorrow, and all they know is that the class just
  finished electrolysis. The workflow turns that single fact into a grounded
  plan the same evening: where the class is in the sequence, what comes
  next, the prior knowledge worth checking first, the misconceptions to
  anticipate, which Oak resources exist for that step, and how to adapt
  them in line with evidence-supported approaches.

Same data, same guarantees; the difference is the moment — considered
sequence planning ahead of term, and just-in-time planning when the
timetable has other ideas.

## What more we could unlock together

Three things would multiply the value of what is already live:

1. **A more complete dataset.** Today's snapshot carries headline figures
   for all thirty approaches, but the deeper narratives — what sits behind
   the averages, implementation guidance, study counts — for only a subset.
   The EEF publishes this depth for every approach. With the full dataset,
   an assistant could answer "what should I watch for when implementing
   this?" for every strand, and study-level data would open richer analysis
   still.
2. **An easy update mechanism.** The Toolkit is a living review, updated
   through the year; Oak's snapshot is from April 2026. An agreed supply
   route — even a simple periodic data feed — would keep the served evidence
   current with the EEF's latest figures, with each update reviewed before
   release.
3. **Clear licensing.** Oak holds and serves the dataset in good faith with
   maximal attribution, but the licensing terms and supply route have never
   been formally agreed. Clear terms would let the evidence travel with
   confidence — for Oak, and for any organisation that wants to do this
   properly.

## The proposal

A working conversation between Oak and the EEF on a data partnership
covering those three items: dataset depth, an update route, and licence
terms. Oak brings the live distribution channel, the engineering, and a
commitment to measure faithfulness — our next step is to evaluate whether
the evidence survives intact into the lesson materials teachers actually
produce, giving the EEF direct line of sight on how its work is represented
in AI-mediated planning.

## The numbers at a glance

| Measure | Position |
| --- | --- |
| Teaching approaches served | 30, the full Toolkit |
| Live since | 8 June 2026, on Oak's public AI interface |
| Attribution and caveats | On every response — nine EEF caveats, six named authors |
| Honest nulls | Insufficient-evidence approaches reported as such |
| Current snapshot | April 2026; the Toolkit itself updates through the year |
| Deeper narrative coverage | A subset of approaches today; the EEF publishes it for all |
| Pupil data involved | None |
