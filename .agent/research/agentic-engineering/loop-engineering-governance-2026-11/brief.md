# Session brief: loop engineering at scale, in its own terms

As of 2026-11-12. Owner: Jim. Author: Claude (Rocket holds Patina), in a Claude Code cloud session
with the owner.

This brief is the improved form of the owner's request. The owner asked for the improvement as the
first task, so it was written before any research and committed first. The session that wrote it
also carries it out.

## The owner's words

Verbatim, typos kept, 2026-11-12:

> Please read the attached PDF then plan and carry out a deep dive review of the concepts and
> practicalities of the approaches they talk about. I would like those approaches understood on
> their own terms, not compared to the Practice. They will be compared with the Practice, at a later
> time, once we have established Thier independent baseline. Use all appropriate skills throughout
> planning, research, synthesis and reporting. Add the findings to the research folder next to other
> recent research into self improving and learning systems. The first task is to improve this
> request. Open a draft PR

The owner's quoted words bind. Everything else in this brief is the author's proposal.

## What the request left open, and how this brief closes it

| Gap in the request | Resolution |
| --- | --- |
| "the attached PDF" is not identified | Linas Beliūnas, "Loops at Scale: The Governance Layer Nobody Built Yet", Substack, dated 3 August 2026, URL `https://linas.substack.com/p/ai-agent-loop-governance`, printed to PDF on 12 November 2026 |
| The PDF's extent is assumed complete | It is not. The PDF is four pages: the free preview only. The post is marked PAID and stops at the heading "The Harness Is Not the Loop" with "This post is for paid subscribers". The body the owner wants reviewed is absent from the attachment |
| "the approaches they talk about" is unbounded | The preview names four topics and one prerequisite. Those five, with the incidents and provenance, are the IN set (below) |
| "deep dive" has no depth or stopping rule | Parallax depth Core. Each key question ends with a cited answer or `insufficient-evidence` |
| "on their own terms" has no test | The own-terms rule below, with a vocabulary sweep before landing |
| "concepts and practicalities" is not operationalised | Each approach gets the same six-field card (below) |
| "the research folder next to other recent research" | `.agent/research/agentic-engineering/loop-engineering-governance-2026-11/`, beside `hermes-agent-v0.23.0-2026-11/`, the 2026-11-10 self-improvement research |
| No evidence standard | Citation or silence; every claim binned and given a rung (below) |

## Goal, in, out

```text
GOAL  Establish an independent baseline: what the approaches in the article are,
      what each requires in operation, and how well each is evidenced, described
      in their sources' vocabulary. The baseline is the footing for a later
      comparison with the Practice.
IN    1. Loop engineering as the article's stated floor: the definition, the
         primitives, the Ralph Wiggum pattern, the 14-step roadmap, the
         orchestrator role.
      2. The harness as distinct from the loop: its file structure, and the
         governance layer outside the loop with the power to end it; dashboards
         against enforcement.
      3. The inner-loop and outer-loop split.
      4. The light-factory and dark-factory framework for removing human review.
      5. Swarm-scale architectures on open-weight models: hundreds of parallel
         agents, the single refutation gate, Kimi K3's licence and
         infrastructure requirements.
      6. The two incidents the article cites, traced to their sources.
      7. Provenance: who originated each term, and when.
OUT   Any comparison with, analogy to, or evaluation against the Practice
      (owner, 2026-11-12).
      Adoption advice for this repository.
      Building or running any loop, harness or swarm.
      Fintech content from the same newsletter.
      Buying or circumventing the paywall.
```

## The own-terms rule

The Practice is this session's method and never its comparand. The interest this protects: the later
comparison needs an account that was not shaped by the thing it will be compared with.

- Each approach is described with its sources' names for things, each name tied to a citation.
- "Loop", "harness", "skill", "gate", "memory" and "governance" are also Practice words. In the
  research files they carry their sources' meanings.
- No research file draws an analogy to, a contrast with, or a judgement against a Practice
  mechanism. When one occurs to the session, it goes in the napkin as one line and no further.
- Critique is in scope where it is internal: a source's claim tested against its own evidence, or
  against another source in the same field.

## The evidence situation

Three facts shape the method, all read first-hand on 2026-11-12.

1. **The article's body is behind a paywall.** The preview gives the thesis, two incidents, the
   four-topic contents list and the promise of templates. It gives none of the templates, the
   checklist, the framework or the swarm architecture.
2. **The session's network refuses the article's host and two others.** `linas.substack.com`,
   `addyosmani.com` and `arxiv.org` fail to resolve from this cloud session. `gist.github.com`
   resolves. Web search works and returns summaries. A later probe, recorded in the evidence log,
   found GitHub the only research host family the session could reach.
3. **The article presents itself as a digest.** It points to an earlier "Loop Engineering Guide" and
   names concepts that circulate under other authors' names.

The consequence: the review reconstructs each approach from the public sources the field itself
uses, and reports the article's own paid text as unread. A reconstruction is labelled as one
wherever it stands in for the article. The report never states what the paid body says.

## Key questions

| Id | Question |
| --- | --- |
| K1 | What does the article's preview claim, verbatim, and what does it promise but not show? |
| K2 | What is loop engineering as its originators define it: who named it, what are its building blocks, what is the Ralph Wiggum pattern, and what is the 14-step roadmap? |
| K3 | What is a harness, how does it differ from a loop, what files compose one, and what separates a dashboard from enforcement? |
| K4 | What are the inner loop and the outer loop, who owns each, and what failure does the split prevent? |
| K5 | What is the light-factory and dark-factory framework, where does it come from, and how does it decide how much human review to remove? |
| K6 | What is the swarm architecture with a single refutation gate, and what do Kimi K3's licence and infrastructure requirements mean for a commercial product? |
| K7 | Do the two incidents ($47,000 over 11 days; $4,200 over 240 retries) trace to a primary source? |
| K8 | For each approach: what does operating it require, what does it cost, how does it fail, and who disputes it? |

## Two frames, held until the evidence decides

- **Frame 1.** The article reports a coherent, emerging engineering discipline. Its terms have
  identifiable originators, stable definitions and working implementations.
- **Frame 2.** The article is a newsletter digest. Its terms are recent coinages with shifting
  definitions, its incidents are unsourced or recycled, and its frameworks are packaging.

Whichever frame the session starts to favour, it searches for disconfirming evidence first. The
verdict may differ per topic.

## The approach card

One card per approach, the same six fields each time:

| Field | Content |
| --- | --- |
| Definition | The approach in its originators' words, cited |
| Origin | Who coined the term, when, and what it descends from |
| Mechanism | The parts and how they interact |
| Operation | What a team must build, run and pay for |
| Failure modes | What its own sources say goes wrong |
| Evidence | The rung reached, and what remains contested or unverified |

## Method

Solo session, Parallax depth Core. Core is chosen because the question spans several loosely
defined terms and one serious counterframe, while the evidence available is secondary and the
output commits nobody to action.

1. **Ground.** `oak-start-right-quick`; host classified; claim opened.
2. **Preview transcript.** Transcribe the four PDF pages' claims into the evidence log. This is the
   only first-hand reading of the article.
3. **Trace each topic outward.** For each of K2 to K7, search for the originating sources, read
   every source the network permits, and record search-summary evidence at its own lower rung.
4. **Fill the cards.** One per approach.
5. **Challenge.** Look for the frame that changes the answer, dependent sources presented as
   corroboration, and claims that rest on a single newsletter.
6. **Own-terms sweep.** Search the research files for Practice vocabulary used to describe or judge.
7. **Review.** One read-only reviewer pass on the report, recorded as a same-model challenge pass.
8. **Land.** Commit, push, draft PR, handoff.

Skills and rules in play: `oak-start-right-quick`, `oak-proportionality`, `oak-parallax` with its
framing, synthesis and audit siblings, `oak-reason`, `oak-metacognition`, `oak-cricket`,
`oak-napkin`, `oak-commit`, `oak-pr-lifecycle`, `oak-session-handoff`; `verify-dont-trust`,
`scope-from-goal-before-approach`, `fleet-design-review-before-expensive-fleets`,
`no-hedging-vocabulary`, `markdown-code-blocks-must-have-language`.

## Evidence discipline

- **Citation or silence.** A claim stands with a URL and the UTC date read, or carries
  `[unverified]`.
- **Bins.** Fact (verified), Owner's call, Assumption to verify, Dropped.
- **Rungs,** lowest first. The evidence log carries the scale as used, which adds R0 for the PDF
  preview and records that R2 and R3 reads came through the fetch tool's model summary:
  1. R1, search summary: a search engine's digest of a page the session did not open.
  2. R2, secondary page read: a page opened this session that reports someone else's claim.
  3. R3, primary page read: the originator's own page, opened this session.
  4. R4, artefact read: code, a licence text or a model card, read directly.
- **Dependence.** Pages that repeat one origin count as one source.
- **The article's paid body is at no rung.** Nothing is attributed to it.
- **Models and dates.** The article names products and releases. Each is checked as a claim; none
  is taken from the session's own memory.

## Fan-out

Inline first: the main seat runs the searches and reads the sources. Subagents are used for one
conscience check and one review pass, each a single leg, below every fleet threshold. No fleet is
planned.

## Deliverables

All in `.agent/research/agentic-engineering/loop-engineering-governance-2026-11/`.

| File | Content | Reader and decision |
| --- | --- | --- |
| `brief.md` | This file | Any resuming session: what is in scope |
| `evidence-log.md` | Provenance, the preview transcript, every claim with bin, rung and source | The comparison session: which statements it may rely on |
| `findings.md` | The approach cards, K1 to K8 answered, frame verdicts, status, open items | The owner: what the baseline is and whether it is firm enough to compare against |

Added on the owner's offer of 2026-11-12 to run a web session: `commissioned-report-brief.md`, a
self-contained brief for a session with open web access to read the primary sources this session
could not open.

One row is added to the lane `README.md`. Nothing else in the repository changes.

## Stop conditions

The session stops and reports when the work grows past the IN set or when a step conflicts with a
live rule. A key question that only the paid body can answer is marked `insufficient-evidence` for
the article and answered for the field; the session continues.

## Conscience check on this brief

`oak-cricket` (medium, normal stance) read this brief before the research ran. Work verdict:
DRIFTING. Frame verdict: SOUND. Its evidence: the owner's object is the article, five of the eight
key questions are expected to change once the paid body is read, and asking the owner for the text
costs one message. Its redirection: ask the owner for the full text, run the reconstruction only if
none arrives, and name K2 and K7 as the firm part of the baseline.

Disposition, by the author: accepted in part. The request for the full text goes to the owner in the
session report and the pull request, as the first open item. The reconstruction runs now, because
the owner asked for the work to be carried out in this session and the field's public sources are
the larger part of what a comparison needs. The findings name K2 and K7 as independent of the paid
body, and K3 to K6 as the field's account awaiting the article's own.

## Reopen conditions

- The owner supplies the full article text. K1, K3, K4, K5 and K6 are then re-answered against it.
- The blocked hosts are allowed. Every R1 claim that cites them is re-read and re-binned.
