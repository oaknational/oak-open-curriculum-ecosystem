# Findings: loops in agentic systems, in the field's own terms

As of 2026-11-12. Reader: the owner. Decision served: what the independent baseline on loops in
agentic systems is, and whether it is firm enough to compare against. Scope and method are in
[brief.md](./brief.md). Claims cite [evidence-log.md](./evidence-log.md) by row. Six papers are read
in depth in [paper-readings.md](./paper-readings.md), which also reconciles them.

This file was rewritten whole after its second review, on the evidence as it now stands. Its
revision record is at the end.

**The subject.** The field's writing on loops in agentic systems. The article that started the
work, Linas Beliūnas's "Loops at Scale", is the prompt that pointed at the field; its preview is one
source and its paid body is not needed (owner, 2026-11-12). Nothing here compares the field with
the Practice.

**Marking.** A sentence labelled as this session's synthesis or inference is the author's and cites
the rows it draws on. Everything else states what a cited row says.

## Verdicts

1. **The sources describe four nested things, and do not agree on the nesting.** This session's
   synthesis. A harness is the environment around one agent run (E-203). A loop is a system that
   prompts the agent in place of a person (E-200). An outer loop is where a person stays answerable
   (E-204). A factory is many harnessed loops drained through a review gate (E-203). One essay puts
   the loop "one floor above the harness" (E-200); the same author elsewhere makes the harness the
   walls around a loop (E-203); a source-code study makes the agent loop one of a harness's seven
   subsystems (E-115); a consultancy calls loop engineering "the outer loop component of the
   harness" (E-224).
2. **This session's synthesis: across coding loops, evaluation, research agents and operations, the
   sources place the stop and the verdict outside the thing that does the work.** A generator
   "confidently praising" its own work, with a separate sceptical evaluator as the remedy (E-253).
   Dashboards that could show spend and "None of them can stop the next call" (E-31). Research
   agents with no "externally validated in-loop oracle" (E-262). Operations agents that investigate
   freely while a person approves changes to production (E-263). No graph-engineering source read
   says this, and the memory papers say something narrower: stored lessons need validating before
   they are trusted (E-315).
3. **Verification is named as the hard part in four sources from three areas.** A vendor lab's
   training report (E-339), the factories essay's rule for running without review (E-127), a survey
   of research agents (E-262), and a benchmark that finds self-evolving agents generate better
   updates than they select (E-323). The strongest statement, that verification "must co-evolve
   with the generator" (E-252), comes from model training; carrying it to loops at run time is an
   untested bridge (paper-readings.md, B1).
4. **The vocabulary is unsettled.** "Gate" has at least three senses: a check that can only stop
   work (E-206), the factory's one review gate (E-203), and a promotion gate where candidates are
   attacked (E-344). "Inner and outer" means who is answerable in one source and nesting in another
   (E-204, E-206). "Closed loop" means feedback to one author, who argues against its use for
   running without people (E-206). The loop essay that named the practice never uses the word
   "gate" (E-200).
5. **Real loops differ from the prescribed one.** The one measured study of loops in public
   repositories found them in 217 of 36,487, most of them automatic pull-request reviewers, with no
   loop state file on any default branch (E-303, E-305). Dedicated stop-condition and budget files
   were absent, but a closer reading of 256 repositories found a spending or turn limit in 101 and
   a verifier in 76 (E-304). The study says it probably undercounts and excludes companies (E-306).
6. **An agent writing its own memory is easy to build and has not been shown to work reliably.**
   Practitioner forms exist and are described by their makers (E-230, E-232, E-234). Under stress
   tests, two published memory methods made a strong agent worse than no memory when tasks came in
   random order (E-312), and skill-evolving agents selected worse updates than they generated
   (E-323). One method reports gains in all 12 of its runs, and it admits a stored skill only after
   running it on real work (E-331, E-332); it was not put through the same stress tests.
7. **Agreement among agents is not evidence.** In one operator's campaign, more than 80 agents
   endorsed a vulnerability that did not exist and a unanimous kill removed one that was real; an
   empirical test was the control that held (E-345, E-346).
8. **Most practitioner evidence is self-report.** One dark factory built by three people (E-128),
   one abandonment after about four months (E-130), headline figures with "No published study or
   dataset" behind them (E-302), vendor claims in operations and support (E-263, E-265), and a
   best-known cost incident whose own figures do not reconcile (E-137). The measured work is from
   2026, academic, unreplicated, and more critical than the practitioner writing.
9. **One voice supplies most of the coding definitions.** Five essays by Addy Osmani were read
   (E-200, E-201, E-203, E-204, E-234). The adoption study says of the practitioner sources that
   "much of the agreement traces back to one origin" (E-302).
10. **Status: `provisional`.** The baseline supports a concept-level comparison. Its limits are in
    the status section.

## What was read, and at what strength

| Layer | How it was read | Rows |
| --- | --- | --- |
| Six papers | Main body, three end to end and three by their load-bearing sections | E-300 to E-350 |
| About 45 web pages with logged rows, among them Osmani's five essays, Huntley, Dagu, Ng, Anthropic's guides, Hashimoto, Moonshot, and eleven arXiv abstract pages | Downloaded with `curl` and read as passages around search terms | E-200 to E-265 |
| The Kimi K3 licence and README; an incident compilation | Read directly in the first round | E-66 to E-85 |
| Shapiro's levels, StrongDM, Horthy's account, the harness study's body | Relayed as paraphrase by two commissioned web sessions | E-100 to E-139 |
| The Medium post behind the $47,000 incident; posts on X; customer-support vendor pages | Refused access or not opened; known through pages that quote or summarise them | E-137, E-228, E-265 |

A review pass checked 116 quoted strings in rows E-200 to E-265 against the saved page text; all
116 matched. Seven more from two pages first read through a summarising tool were then confirmed at
the page (E-251, E-260).

Pages for Shapiro, StrongDM and Willison were downloaded in the last round and not read; those
topics still rest on the relayed rows.

## The prompt: what the article's preview claims

The thesis: "a working loop and a safe loop are not the same thing, and the gap between them is
where real incidents happen" (P7). The diagnosis: what was missing was "a governance layer outside
the loop, with the power to end it" (P10). It promises a harness of "seven files" with templates
(E-212), a checklist separating dashboards from enforcement, an inner-loop and outer-loop split, a
light-factory and dark-factory framework, and a swarm architecture with "a single refutation gate"
(P13 to P16). No source opened describes a seven-file harness (E-117), and "refutation gate"
appears in no other opened source (E-131).

## Approach 1: loop engineering

**Definition.** "Loop engineering is replacing yourself as the person who prompts the agent."
(E-200). The academic version: "automated control structures that repeatedly invoke coding agents,
triggered on a schedule or by events, with each agent loop bounded by a machine-checkable stop
condition" (E-301).

**Origin.** A remark by Boris Cherny published 2 June 2026, a post by Peter Steinberger on 7 June,
and Osmani's essay the same day (E-307). The practice is older: Huntley's Ralph loop is from July
2025, "In its purest form, Ralph is a Bash loop" (E-205).

**Mechanism.** Osmani: "A loop needs five things and then one place to remember stuff", which are
automations, worktrees, skills, plugins and connectors, sub-agents, and memory; his table calls the
six "Primitive" (E-200, E-101). Anthropic sorts loops by what the person hands off: the check, the
stop condition, the trigger, or the prompt (E-107). The adoption study's review finds the sources
agree on triggers, stop conditions, state, a separate verifier, budgets with a "kill switch", and
escalation points (E-302).

**Operation.** An admission test before building: recurring work, automated verification, a token
budget that can absorb waste, tools to run the code (E-05). A unit of account: cost per accepted
change (E-08).

**Failure modes.** Early completion, goal drift, a maker grading its own work, gates that rot,
spend at 5 to 10 times the estimate (E-08, E-14). From the adoption study's review: "verifier
theater", and review volume turning the human gate into "a rubber stamp" while "the pipeline still
reports green" (E-302). Ralph as first described has no stop condition and no sandboxing, and its
author limits it to greenfield work (E-106, E-205).

**Evidence.** Definitions read at the page. One measured study (verdict 5). Novelty is contested
inside the field: "a renamed cron job" (E-302).

## Approach 2: the harness, and enforcement outside the loop

**Definition.** Three scopes. "A harness is the walls around a loop: the sandbox it runs in, the
tools it can reach, the memory that survives between runs, and the gates that decide what 'done'
means." (E-203). "Agent = Model + Harness. If you're not the model, you're the harness." (E-201).
Seven subsystems: agent loop, model integration, tools, memory and context, safety and permissions,
orchestration, extensibility (E-115).

**Origin.** Hashimoto, February 2026: "I've grown to calling this 'harness engineering.'" (E-202).
Osmani credits Trivedy with coining it (E-201).

**Advice against control.** The sources separate what the model is told from what the system
enforces. Claude Code's documentation says instruction files are "context, not enforced
configuration" and that blocking an action "regardless of what Claude decides" needs a hook
(E-233). An incident compilation says of observability platforms: "None of them can stop the next
call" (E-31).

**Operation.** Vendor posts place enforcement at a gateway that checks a budget before each call
(E-32). In shipped harnesses the stop is often soft or absent: one "ships disabled", one has "no
cost kill-switch", one has a step limit that "defaults to infinity" (E-350). Anthropic's loops guide
bounds a goal by turn caps and shows spend; it describes no monetary budget control (E-108).

**Evidence.** Definitions and the three harness sentences read at the page. The gateway designs
come from vendors who sell them (E-34). A study of 2,853 repositories found harness configuration
in open source "mostly context engineering" (E-308).

## Approach 3: the inner loop and the outer loop

**Definition.** "Engineers own the outer loop." Agents run the inner loop; the human belongs in four
others: constraints, sampling, audit and ownership (E-204).

**Origin and variants.** Ng, 26 June 2026: three loops by speed, the agent's, the developer's and
the market's, the developer's kept human by "a context advantage" (E-208, E-124). Osmani, 15 July
(E-120). Dagu, 6 November: "'Inner' and 'outer' describe nesting, not who is involved" (E-206).

**Operation.** End the inner loop on a command's result, with the check out of the agent's reach
(E-45, relayed).

**Evidence.** Three versions read at the page. The claim that a person must own the outer loop is
argued, not measured.

## Approach 4: the light factory and the dark factory

**Definition.** "A software factory is many harnessed loops running at once, fed by a queue of work
and drained through a review gate into production, with humans owning the whole thing from above."
(E-203). Dark: no human reads the code. The essay's body says "lit" where its title says "Light"
(E-126).

**Origin.** Shapiro's six levels, 23 January 2026, level 5 being the dark factory; the level names
in circulation are Willison's (E-125).

**The rule for running dark.** A loop's check must be cheap, frequent, hard to fake, immediate and
free of drift; review stays where a wrong answer is costly and only a person can catch it (E-127).

**Cases.** StrongDM: no human writes or reviews code, validation by holdout scenarios and cloned
services, US$1,000 of tokens per engineer per day, three people (E-128). Horthy: about four months
without reading the code, then abandonment and a rebuild (E-130).

**Evidence.** The definition read at the page; the rule, the levels and both cases relayed. Both
cases are self-reported.

## Approach 5: swarms and gates that refute

**Definition.** Moonshot's Agent Swarm "coordinates up to 300 sub-agents working in parallel" and
"is currently powered by Kimi K3" (E-209). Anthropic's dynamic workflows have the model write
"orchestration scripts that run tens to hundreds of parallel" subagents (E-227).

**The gate.** The nearest worked method is Refute-or-Promote: adversaries see the claim without its
author's reasoning, a critic from another model family reviews it, and an empirical test is
mandatory (E-344). Its own record is verdict 7. Its author offers transfer to coding only as a
preliminary test (paper-readings.md, B3).

**Kimi K3.** 2.8 trillion parameters, open weights (E-66). The licence, read in full, grants use
and sale subject to five conditions; the two commercial ones bind model-as-a-service operators
above US$20 million a year and products above 100 million monthly users or US$20 million a month
(E-68 to E-71, E-75). Serving needs "At least 8x GB300" (E-210).

**Evidence.** Vendor pages and the licence read directly; one single-operator paper. No source
describes a swarm governed by one refuting gate.

## Approach 6: the graph-engineering turn

**Definition.** "Wiring multiple agents, each running its own loop, together through nodes, edges,
and shared state" (E-222).

**Origin.** Steinberger's post of 18 July 2026 UTC: "Are we still talking loops or did we shift to
graphs yet?" It contains neither the phrase nor a claim, and the phrase dates to 2024 (E-220). Two
sources read the post as a joke (E-221).

**Mechanism.** One source draws the line at who routes: in a loop "the routing lives in the model's
judgement"; "In a graph the routing lives in code" (E-222). Anthropic's earlier word for the second
is workflow: "predefined code paths" (E-226).

**Evidence.** Five commentary sources: a consultancy, a training company, a newsletter and two
vendors. Three say the practice predates the name: "Graph engineering largely renames
orchestration" (E-223, E-224). None reports a measured benefit of graphs over loops. One restates
the question as "which cycles in software development deserve to be made explicit" (E-221).

## Approach 7: loops whose product is the agent's own memory or skills

**Definition.** Long-term memory "consolidates [experiences] into reusable knowledge and skills,
forming the loop through which agents improve from their own experience" (E-236).

**Forms.**

| Form | Who writes | When | Row |
| --- | --- | --- | --- |
| Compound engineering | A person, with the agent, in a named step | After each unit of work | E-230 |
| A notebook in the instruction file | The agent, appending | After each task in an unattended loop | E-234 |
| Auto memory | The agent | During a session | E-232 |
| Sleep-time compute | The agent, rewriting its memory | In idle time | E-235 |

**Mechanism.** Compound engineering: "each unit of engineering work should make subsequent units
easier—not harder", with half of engineering time given to improving the system (E-230). Research
systems automate the write, and some gate it (E-241, E-332).

**What the measured work found.** Read in full in paper-readings.md:

- Two memory methods on a strong web agent: no significant gain, more variance, and worse than no
  memory under shuffled task order (E-311, E-312). The memories held advice the environment could
  not carry out, and a lucky fallback spread: "Memories are 'contagious'" (E-313).
- Ten configurations on a trading benchmark: gains that vanish under shift, no reliable revision of
  an outdated rule, and selection as the bottleneck (E-321 to E-324).
- One method with an execution gate: gains in all 12 runs, 7 of 26 candidate updates rejected
  (E-331, E-332).
- A cited benchmark: human-curated skills +16.2 points; skills a model wrote for itself from the
  task description, -1.3 (E-333).

**Evidence.** Practitioner forms: described by their makers, unmeasured. Three papers by different
author groups on different benchmarks; none replicated; none on coding agents' own instruction
files. A mechanism-level study of one such system, Hermes Agent, is linked from the evidence log.

## Approach 8: evaluation as a loop

**Definition.** Read traces, name the failures, "turn important failures into targeted evals and
use the results to guide changes", and rerun to see "whether the system improved" (E-250).

**Mechanism.** "Error analysis is the most important activity in evals", continued to "theoretical
saturation" (E-250). Capability evals "start at a low pass rate" and can "'graduate' to become a
regression suite" held near 100%; an outcome is the environment's final state, not the agent's
account (E-251).

**Where people stay.** Reading transcripts, because "You won't know if your graders are working
well unless you read the transcripts"; calibrating model graders against human graders; replacing
saturated evals (E-251).

**Failure modes.** Self-grading (E-253). In training, reward hacking: stronger policies "retrieving
solution artifacts or tampering with tests" (E-340). An evaluator agent that "modifies the
generator's code", reuses its tests, or "advocates for the generator" (E-343).

**Evidence.** Two practitioner guides and one engineering post read at the page; one vendor lab's
training report read in its main sections. The report also shows targeted verification working:
hacked passes cut from 28.57% to 0.56% (E-340).

## Approach 9: loops beyond software engineering

The first two rows are still code. The research-agent survey is scoped to computational research.

| Domain | The loop | The check | Row |
| --- | --- | --- | --- |
| Model training research | Edit the training script, train five minutes, keep or discard, repeat | One validation metric | E-260 |
| Scientific hypotheses | Generate, debate, rank in tournaments, evolve | An Elo rating from the system's own tournaments | E-261 |
| Incident response | Agents investigate | By one vendor's account, a person approves changes to production | E-263 |
| Customer support | Not described in any source opened | Vendor claims of 60 to 80% unattended resolution | E-265 |

**This session's synthesis** (E-260, E-261): where a cheap objective check exists the loop runs
unattended; where none exists the system builds one from its own judgement and its authors then
test that judgement against an outside benchmark.

**Failure mode.** The survey's "verification gap": research agents' "claims are often harder to
verify than their code is to run"; of nine closed-loop systems, "seven are mechanical reruns"
(E-262).

**Evidence.** The thinnest area. One README without results, one vendor research post, one survey
abstract, one vendor's summary of its competitors, and unmeasured vendor claims.

## The incident record

**The $47,000 case.** One Medium post of late 2025, never opened by this work. Its Hacker News
thread has 7 comments, the first listing cost monitoring and circuit breakers as precautions found
"within half a day of thinking about it" (E-213). Its republished weekly figures sum to $25,658
over four weeks, which fits neither $47,000 nor 11 days (E-137).

**The $4,200 case.** No source earlier than the prompting article (E-138). The nearest public
record is a Claude Code issue: over 300 identical calls in about 4.6 hours, no dollar figure (E-85).

**The class.** An unsigned compilation lists further cases and says first-party post-mortems
"remain extraordinarily rare" (S6).

## Frame verdicts

The brief held two frames per topic: a coherent emerging discipline with identifiable originators
and stable definitions, or recent coinages with shifting definitions and thin evidence.

| Topic | Verdict |
| --- | --- |
| Loop engineering | Mixed. Dated originators and one measured study; contested novelty and loops in the wild that differ from the prescription |
| Harness and enforcement | First frame for the distinction between advice and control; second for any canonical structure |
| Inner and outer loop | Mixed. Three dated versions, two incompatible definitions |
| Light and dark factories | First frame for the terms; two self-reported cases |
| Swarms and refuting gates | First frame for swarms as shipped products; second for a single refuting gate |
| Graph engineering | Second frame. Its own explainers say it renames orchestration |
| Memory and skills as a loop's product | Mixed. A clear mechanism; measured results that mostly fail under stress |
| Evaluation as a loop | First frame. The most settled practice read, with named failure modes |
| Loops beyond software engineering | Second frame on present evidence |
| The incidents | Second frame |

## Status, and what it permits

`provisional`.

- **Permits:** a concept-level comparison against these nine approaches as the field describes
  them; reliance on the quotations in rows E-200 to E-350; reliance on the Kimi K3 licence reading.
- **Forbids:** treating a relayed row (E-100 to E-139) as an author's wording; treating any bridge
  claim in paper-readings.md as established; treating vendor figures as measured.
- **Why provisional:** web pages were read as passages, not whole; three of the six papers were
  read by section; the measured studies are unreplicated preprints; several topics still rest on
  relayed rows; and every review of this work has been by the same model that wrote it.

## Open items, in order

1. **Independent review.** Two same-model review passes have run. Neither is independent assurance.
2. **Three pages fetched and unread.** Shapiro, StrongDM and Willison; reading them would lift
   approach 4 off relayed rows.
3. **Two long papers.** The harness source-code study and the research-agent survey were not read
   in full.
4. **Measured evidence beyond software.** Nothing independent was found for support or operations;
   the search was not exhaustive.
5. **Two unopened origins.** The Medium post behind the $47,000 incident and the posts on X.

## What comes next

The comparison with the Practice is a separate, later piece of work, gated on the owner's go-ahead.
Its inputs are this file, paper-readings.md, and the evidence log's rows from E-200 upward, with
earlier rows as leads. This session does not begin it.

## Revision record

All on 2026-11-12.

| Step | What changed |
| --- | --- |
| First version | Built from the article's preview, GitHub-hosted pages and search summaries, with the network restricted |
| First review pass | 25 findings; inference marked as inference, licence conditions completed, incident tracing attributed to its one source |
| Two commissioned web-session reports | Eight statements corrected; rows E-100 to E-139 |
| Change of subject | Recentred on the field at the owner's word |
| Broadening | Four areas added and earlier claims re-read at the page; rows E-200 to E-265 |
| Full-paper reads | Six papers; rows E-300 to E-350; the adoption study's result corrected |
| Second review pass | 116 of 116 checked quotations matched their pages. 25 findings on framing: sweeping words, selective rows and stale sections. This rewrite is the response. Twelve evidence rows were corrected, among them one that had omitted a paper's positive result and one that misread an essay as not about memory |
