# Doing and Dreaming: the collection, and its review

Readings, a reflection, two trials and a sort, by the seat that wrote the Hermes and Practice
comparison, on research results the owner supplied on 12 November 2026; and the review of the
whole collection that the owner asked for before any design starts. None proposes a design.

| Document | What it is |
| --- | --- |
| [`review-of-the-collection.md`](review-of-the-collection.md) | **Start here.** The review the owner delegated: what the collection establishes and how each finding is known, where its pieces disagree, which claims were wrong or weaker than written and what was corrected, what nobody looked at, and whether it is enough to start design. Readers who wrote none of it sorted the rules again, recomputed the numbers, and read nineteen recorded skill-evaluation runs the collection had missed |
| [`reflection.md`](reflection.md) | The reflection the owner asked for on the report "Doing and Dreaming", set against the Practice's own records |
| [`reading-the-loop-baseline.md`](reading-the-loop-baseline.md) | A reading of the loop-engineering baseline (pull request 403) for what it bears on the comparison and on the strategic node |
| [`delivery-trial.md`](delivery-trial.md) | The first measurement the reflection suggested, run at the owner's word: ten headless sessions, and which of the estate's 124 rules each one opened. Rules on the task's subject were opened; rules about how to think were mostly not |
| [`rules-sort/`](rules-sort/README.md) | A sort of the 124 rules that followed from the trial (90 tied to a named activity, 28 habits of mind, 6 pointers) with five other ways of grouping them; then, widened at the owner's word, the 246 pattern files and what becomes of them, the 78 skills measured the same way, and what a rule and a skill are each good for. Tables beside each finding so the counts can be redone |
| [`trial-evidence/`](trial-evidence/README.md) | The evidence behind both trials: a record of each of the forty sessions, the thirty answers as the reader saw them, the key, the reader's 115 marks, and the scripts. Scrubbed of machine paths and identifiers; the raw traces are not kept |
| [`habit-text-trial.md`](habit-text-trial.md) | The test the rules sort named, run at the owner's word: the 28 habit instructions delivered as text to the same ten sessions, with the unchanged clone run again beside them and the 30 answers marked by a reader blind to condition. The text was taken up (a goal-and-scope block in both treatment answers to one planning task and in no control) and no conclusion changed; design and prediction were written before the run |
| [`claude-code-rules-and-skills-loading.md`](claude-code-rules-and-skills-loading.md) | How Claude Code loads rules and skills and where its size thresholds are, from Anthropic's documentation by a sub-agent at the owner's request, with this seat's reading of what it means here: both rules and skills reach a session as pointers, so the platform's protections apply to the pointer and not the text |
| [`codex-rules-and-skills-loading.md`](codex-rules-and-skills-loading.md) | The same question for Codex, the owner's second concern after Claude Code. From OpenAI's documentation only. Codex has no mechanism that loads a rule's text: it gives the model the `AGENTS.md` chain, the skills listing and a hook's output. Nothing here is loaded twice. The report, as returned, is [`codex-rules-and-skills-loading-report.md`](codex-rules-and-skills-loading-report.md) |
| [`cursor-rules-and-skills-loading.md`](cursor-rules-and-skills-loading.md) | The same question for Cursor, begun after the review as the first step of defining a rules and skills system that works across platforms. From Cursor's documentation only; nothing was observed in Cursor. By that documentation the estate's 87 skills are discovered twice there, both entry files are always loaded, and both session-start hooks can run. The sub-agent's report, as returned, is [`cursor-rules-and-skills-loading-report.md`](cursor-rules-and-skills-loading-report.md) |
| [`where-we-are.md`](where-we-are.md) | A reflection across all four pieces of related work, written when the owner supplied the last of them: what they say together, what reflection changed, a first sketch of where the estate stands on self-governance and self-improvement, and six suggested next steps |

**Where the report is.** The owner's report is kept once, as received, at
[`../loop-engineering-governance-2026-11/owner-reports/doing-and-dreaming.md`](../loop-engineering-governance-2026-11/owner-reports/doing-and-dreaming.md)
(SHA-256 `37726eb5fc6737d868aeaad146a5ec27f606fa2e966b5b41f08bda94a24c3277`). This directory
first held a second copy; it was compared byte for byte with that one and removed when the
baseline merged. The report was written in isolation from the Practice. Its one figure did not
travel with the text: the line beginning "embedded content: learning loop" stands where it was.

**Three readings of the one report now exist**, from different sides: `reflection.md` here
against the Practice's records; the baseline's
[`doing-and-dreaming-reading.md`](../loop-engineering-governance-2026-11/doing-and-dreaming-reading.md)
against the field's sources; and `reading-the-loop-baseline.md` here on where those two meet.

These are inputs to the strategic node
[`self-starting-practice-refinement`](../../../plans/strategic/self-starting-practice-refinement.plan.md).
By the owner's word no design phase starts until the other results have arrived and all the
work has been reviewed together. The results arrived on 12 November 2026 and the review is the
first document in the table above.
