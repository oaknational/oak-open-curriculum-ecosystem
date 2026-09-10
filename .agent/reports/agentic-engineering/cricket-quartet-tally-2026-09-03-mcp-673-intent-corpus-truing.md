# Cricket quartet tally — 2026-09-03, MCP-673 intent-corpus truing node (Finch calls Pinnacle, c91bd4)

Owner-invoked full suite ("run a full Cricket suite, and an adversarial
assumption reviewer on Fable ... critically assess their responses and
findings") at the close of the session that surveyed the planning and intent
corpus, authored the delivery node
`intent-corpus-truing-around-the-extraction-plan` (second draft after two
Opus readiness reviews) and opened draft PR #959. Platform: Claude; panel:
the effort-inversion quartet per the cricket skill's Claude bindings; both
stances, run concurrently on one identical frame; orchestrated as one
Workflow run (`wf_05364a10-e98`) with an adversarial assumptions review on
Fable, two-lens refutation of its top findings, and a cross-examiner over
the whole panel. Recorded at occurrence.

## Legs (platform / model / effort / stable role / stance)

Output tokens and the largest context seen are read from each leg's
transcript; runtime is first-to-last transcript timestamp. The run's total
across all twenty agents was 1,691,041 subagent tokens and 20.3 minutes of
wall-clock.

| Role | Model | Effort | Stance | Verdict | Output tokens | Context | Runtime |
| --- | --- | --- | --- | --- | ---: | ---: | ---: |
| cricket-judgement-low | fable | low | normal | ON-TRACK | 18 | 33,200 | 19.7s |
| cricket-judgement-medium | opus | medium | normal | ON-TRACK | 28 | 33,161 | 36.4s |
| cricket-judgement-high | sonnet | high | normal | ON-TRACK | 20 | 33,472 | 37.3s |
| cricket-procedure-xhigh | haiku | xhigh | normal | ON-TRACK | 10,018 | 25,602 | 72.3s |
| cricket-judgement-low | fable | low | adversarial | ON-TRACK | 420 | 33,306 | 30.7s |
| cricket-judgement-medium | opus | medium | adversarial | ON-TRACK | 32 | 33,207 | 40.0s |
| cricket-judgement-high | sonnet | high | adversarial | ON-TRACK | 26 | 43,416 | 35.8s |
| cricket-procedure-xhigh | haiku | xhigh | adversarial | ON-TRACK | 21 | 27,661 | 128.0s |

Panel shape: eight concurrent, both stances at once on the identical frame
(no between-wave enrichment). All eight returns delivered; zero UNDELIVERED.

Companion legs in the same run (not quartet data): assumptions-expert on
fable at xhigh effort, adversarial stance — READY WITH CURES, twelve
findings, 27,084 output tokens, 237,863 context, 12.7 min; ten refuters on
the default model (two lenses over the top five findings, 71s–281s each);
one cross-examiner (24,366 output tokens, 2.7 min).

## Adjudication (the seat's decision; verdicts were evidence)

- **Unanimous panel, ON-TRACK ×8.** Every seat grounded the verdict on the
  owner's verbatim three-step objective with steps 1–2 landed and on his
  verbatim allocation of this session to survey, planning and reviews. The
  cross-examiner verified both merge SHAs and the born-sketch rule the
  draft hold cites. Consensus here is correctly grounded, not mere
  agreement — the adversary attacked the node's content and never its
  priority.
- **One redirection (Opus, normal): consolidate the owner's decisions into
  one ask on #959.** Accepted in substance and sharpened by the adversary's
  F5: the node's gate had required a separate word per item and said a
  blanket approval "stamps none", which the estate's own precedent
  contradicts (the strategic node was ratified by one word, "Ratify both",
  over an enumerated scope). The node now presents one numbered list taking
  one owner word, with declines by item number.
- **Accepted from the adversary (each cured in the node's third draft):**
  F2 the vision carries the same "this repository delivers" sentence as the
  stream page it parents — added to the amendment set; F6 the parent
  returns to `toolkit-re-architecture` because that node enumerates its lane
  by a `serves:` search and the truing node carries the lane's A2 — the
  re-point hedge is deleted; F4 the Goal's "nothing rewritten" contradicted
  the in-place restatement — the ratified node's form is now stated as the
  schema's in-place amendment with a revert-on-decline before merge; F7
  per-todo estimates and file counts against the owner's 30-to-90 band,
  with a named drop candidate; F9 the Atlas block stated as the verdict, the
  alternative deleted; F3 AC1 rescoped to the sweep named, no closure
  claim; F10 the index names the node by id per its own convention and the
  plans index gains a pointer; F11 the three unjudged scan hits and the
  adapter README judged; F12 the ordering item marked as the one decision
  among confirmations.
- **Accepted in residue only:** F1 (true: the engineering release page, the
  tooling page and the SDK README claim publishing that does not happen —
  the registry returns not-found) — cured as three lines in the factual
  true-up pull request, not by widening the pinned scan, whose re-run over
  those globs was shown to return mostly noise; F8 (true: AC3 measures a
  link and the index ranks nothing) — cured by narrowing "priority" to
  "order and intent" and stating that ranking across lanes stays the
  owner's; the proposed gate asking him for public priority words is
  rejected, because he closed that question himself the same day.
  *(Dated addendum, 2026-09-03 ~11:xxZ, the implementing seat Chinook seeks
  Cloud, 661556: the owner reopened that question himself later the same
  morning and ruled the other way on a card — "Also state it as the current
  priority" — so the strategy index's shipped line names the extraction as
  the repository's current first priority for structural work as well as
  its structural commitment. The narrowing this record describes was the
  state of the node's third draft, not of the merged text; the ranking is
  the owner's word, propagated, never the plan's. Raised by the Claude Code
  Review on PR #959.)*
- **Rejected from the panel:** the Opus-adversarial "resolved unilaterally"
  (the choice was recorded with its reason; it was wrong, not unilateral);
  the Opus-normal "six concerns routed" (four named); the Haiku-adversarial
  "three gates" (one gate described three ways) and "no counter-evidence in
  supplied context" (a statement of search scope, not a finding); the
  Sonnet-adversarial "well-scoped" (the node carried no estimate to scope
  against); the Fable-normal "the node names P21D" (the schema does).

## Verdict-quality notes for the experiment record

- The verdict did not discriminate (eight identical, all correctly
  grounded); the signal is in second-order content. Fable at low effort
  produced the tightest, best-calibrated evidence and was the only seat to
  say what it had not verified. Opus at medium effort produced the only
  redirection and the two watch items (parent, sizing) that overlapped the
  adversary's surviving findings — the highest decision value per leg.
  Sonnet at high effort was the only seat to read the node first-hand and
  converted the read into "well-scoped" with zero findings. Haiku at xhigh
  produced conformant output with an inflated gate count and an adversarial
  pass confined to the supplied frame.
- Stance mattered less than model: adversarial added nothing over normal at
  Haiku and Sonnet; at Opus it surfaced the two real risks. The run's
  adversarial value came from Fable at reviewer effort: twelve findings,
  four of the top five unrefuted on both lenses, the other two refuted on
  proportion only.
- The cross-examiner's own reading matched the seat's: the work was the
  right work; the node was not yet the right node.
