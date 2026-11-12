# Findings: loop engineering at scale, in its own terms

As of 2026-11-12. Reader: the owner. Decision served: what the independent baseline is, and whether
it is firm enough to compare against. Scope and method are in [brief.md](./brief.md). Claims cite
[evidence-log.md](./evidence-log.md): an E or P id names a logged claim with its bin; an S id alone
names a source, and the claim then stands at that source's rung with no row of its own. Sentences
marked as this session's inference or synthesis cite nothing and are the author's.

## Verdicts

1. **The article's body was not read.** The PDF is the free preview of a paid post. It states a
   thesis, two incidents and a contents list, then stops at its first body heading (P17). The
   templates, the checklist, the framework and the swarm architecture it promises are unread.
2. **The field behind the article is readable, and this baseline describes that field.** The
   preview's four topics each match a public body of writing from January to July 2026. This
   session's inference, unattested by any source: the floor, the outer-loop topic and the harness
   and factory topics track three essays by one author, Addy Osmani, dated June and July 2026
   (E-02, E-40, E-55, all search-digest rows).
3. **This session's synthesis: one idea runs through all four topics. A loop cannot be trusted to
   stop or to judge itself, so the stopping power and the verdict must sit outside it.** It draws on
   E-24, E-30, E-31, E-43, E-45, E-56 and E-61. The swarm leg rests on a reconstruction.
4. **The evidence is thin where the article is most vivid.** One unsigned compilation reports that
   the $47,000 incident rests on a single self-reported Medium post (E-80, E-82). The $4,200
   incident traced to nothing in three searches (E-84). The phrase "refutation gate" appeared in no
   other source in two searches (E-60).
5. **The Kimi K3 licence, read directly, is permissive for most builders.** Its two commercial
   conditions bind model-as-a-service operators above US$20 million a year and products above 100
   million monthly users or US$20 million a month (E-69, E-70). Vendor guides, unread, put the
   practical barrier at hardware (E-73).
6. **Status: `provisional`.** The baseline supports a concept-level comparison. It does not support
   any statement about what this article's paid body says, and most definitions rest on search
   digests of pages this session could not open.

## What was read, and at what strength

| Layer | Strength | Consequence |
| --- | --- | --- |
| The article's preview | Read directly | K1 is answered in full |
| The article's paid body | Unread | Nothing is attributed to it |
| The Kimi K3 licence and README lines, and the quoted lines of an incident compilation | Read directly with `curl` | The firm part of the baseline |
| Other GitHub-hosted pages: the 14-step roadmap, the Ralph playbook, one issue, two lists | Read through the fetch tool's model summary | Usable; quotations from them are the summary's rendering |
| Everything else: Osmani's three essays, Shapiro's levels, StrongDM, Dagu, Ng, two arXiv papers, Anthropic's guide | Search digests only | Unchecked. Wording, dates and attribution are open to correction, and two digest errors were caught this session (E-72, E-76) |

Of 22 hosts probed, the two GitHub hosts answered and 20 were refused. The reopen conditions in the
brief follow from that. A commissioned web-session report, briefed in
[commissioned-report-brief.md](./commissioned-report-brief.md), is the route to opening the pages
behind the search-digest rows.

Two questions depend least on the paid body: K2, the stated floor, and K7, the incidents. Each
still has one item only the author can settle: the "six primitives" of his earlier guide, and the
source of the $4,200 case. K3 to K6 are the field's account, awaiting the article's.

## K1: what the preview claims

The thesis is one sentence: "a working loop and a safe loop are not the same thing, and the gap
between them is where real incidents happen" (P7). The diagnosis follows from two incidents: both
loops "were doing what they were built to do", and what was missing was "a governance layer outside
the loop, with the power to end it" (P10).

The preview positions an earlier guide by the same author as "the floor" (P6) and this article as
what appears above it at three thresholds: more than one loop, more than one person, or more at
stake than one overnight bill.

It promises four topics and shows none of them (P12 to P16):

1. the harness: a file structure with templates, and a checklist that separates dashboards from
   enforcement;
2. the inner-loop and outer-loop split;
3. the light-factory and dark-factory framework;
4. swarm-scale architecture with a single refutation gate, with a reading of Kimi K3's licence and
   infrastructure.

## Approach 1: loop engineering, the stated floor

**Definition.** Replacing yourself as the person who prompts the agent, and designing the system
that does it instead (E-02). The loop finds work, hands it to the agent, checks the result, records
state and chooses the next step (S1).

**Origin.** The name spread in the week of 7 to 9 June 2026 from a post by Peter Steinberger (P4,
E-01). Osmani's essay of the same week gave it structure (E-02). The practice is older than the
name: a curated list dates Geoffrey Huntley's naming of the Ralph loop to July 2025 (E-18).

**Mechanism.** The sources give two part-lists and one typology, which do not agree:

| Source | Parts |
| --- | --- |
| Osmani (E-03) | Automations, worktrees, skills, plugins and connectors, subagents; state is added by secondary write-ups |
| The 14-step roadmap (E-06) | One automation, one skill, one state file, one gate |
| Anthropic's guide, as an arXiv paper restates it (E-15) | Four loop types by what the developer hands off: the turn, the stop condition, the trigger, the prompt |

The Ralph technique is the minimal case: a shell loop that pipes one prompt file to a headless
agent, a fresh context on every pass, a plan file on disk as the only memory, and tests and builds
as "backpressure" (E-10 to E-12).

"Ralph Wiggum" carries two meanings in the field. In Huntley's line it names the technique. In the
roadmap it names the failure: an agent that declares completion early, with no real verifier and no
hard stop (E-14). The article's preview lists "the Ralph Wiggum pattern" without saying which.

**Operation.** The roadmap sets an admission test before any loop is built: the work recurs,
verification is automated, the token budget can absorb waste, and the agent can run and inspect the
code (E-05). Its build order is a reliable manual run, then a loop, then a schedule. Its unit of
account is cost per accepted change, with under 50% accepted marked as a loss (E-08).

**Failure modes the roadmap names (S1).** Early completion; goal drift as constraints vanish in
long-session summaries; a maker that grades its own work leniently; gates that rot; and token spend
at 5 to 10 times the estimate (E-08). Write-ups of Osmani add "comprehension debt": the widening
distance between the code that exists and the code anyone has read (S19, search digest).

**Evidence.** The roadmap and the playbook were read through the fetch tool's summary. Osmani's
essay and Anthropic's guide were not opened. A search digest reports one measured study: of 36,710
repositories, 217 ran confirmed autonomous loops, and almost none committed the state files the
literature recommends (E-16). The author's own guide, with its "six primitives", was not found
(E-17). This session's inference: the six are Osmani's five plus state.

## Approach 2: the harness, and a governance layer outside the loop

**Definition.** A search digest gives Osmani's wording as: the walls around a loop, meaning the
sandbox it runs in, the tools it can reach, the memory that survives between runs, and the gates
that decide what "done" means. The loop is the behaviour; the harness is the environment the
behaviour runs inside (E-20). An agent is a model plus a harness (E-21).

**Origin.** Harness engineering predates loop engineering in 2026 usage, and an arXiv paper places
loop engineering as "the next abstraction level above" it (S16). The coiner of the term was not
established.

**Mechanism.** Explainers sort the parts this way (E-22):

| Belongs to the harness | Belongs to the loop |
| --- | --- |
| Instruction files, sandbox, permissions, hooks, tests, traces | Triggers, work queue, separate checker, memory, budget |

The boundary is unsettled. One explainer says the harness contains the loop; another gives verifiers
and bounded retry to the loop (E-23).

The sources agree on one property. A line in an instruction file is advisory: the model reads it and
may not follow it. A hook or a gateway is not advisory: it acts whatever the model intended (E-24).

**Dashboards against enforcement.** The preview's diagnosis (P10) has a direct counterpart in the
field. An incident compilation puts it as "the separation between observation and enforcement": the
major observability platforms can trace a loop, plot the spend and fire an alert, and "None of them
can stop the next call" (E-30, E-31). The remedy vendor posts describe is a check that runs before
each call and refuses it: a budget cap at a gateway or billing layer, and a kill switch read at the
start of every step that stops the agent when it cannot be read (E-32, E-33).

**Operation, as vendor posts state it (S24, search digest).** Put every model and tool call behind
an enforcing point, and give each agent its own credential so spend is attributable and revocable.
The preview's second incident adds a third requirement in its own words: three dashboards, and "None
of them had the authority to stop it" (P9).

**Failure modes, from the same vendor posts (S24).** A cap the agent can read but nothing enforces;
an alert that arrives after the spend; a prompt-level stop instruction, which one post calls the
weakest control available.

**Evidence.** The observation-against-enforcement claim was read directly in the compilation, which
is unsigned. The enforcement designs come from vendors who sell them (E-34). No source read gives a
canonical harness file structure (E-27); the article's "harness file structure with working
templates" is unread. A search digest of a source-code study of eleven harnesses reports that loop
sophistication does not predict benchmark performance (E-26).

## Approach 3: the inner loop and the outer loop

**Definition.** Agents run the inner loop: investigate, implement, test, report. Engineers own the
outer loop, which carries accountability (E-41).

**Origin.** Priority is not established. Andrew Ng published a three-loop version in late June
2026: the agent's coding loop, the developer's feedback loop, and an external loop driven by users
and the market (E-46). Osmani's "Own the Outer Loop" followed in July 2026 (E-40) and is the form
the preview's wording matches.

**Mechanism.** Osmani names four human-owned loops (E-42). The second column is a search digest's
gloss:

| Loop | The question it answers |
| --- | --- |
| Constraints | What inputs, architectures, instructions and invariants are set |
| Sampling | How much output is reviewed |
| Audit | What evidence is kept |
| Ownership | Which part of the production boundary a human owns |

A second definition competes with his. Dagu holds that inner and outer describe nesting, not who is
involved: an outer loop is one that contains inner loops and crosses a boundary such as a review, a
schedule, a pull request or production (E-44). Under Osmani the split is about who is answerable.
Under Dagu it is about structure.

**Operation.** The two point the same way. Osmani: an independent check, not the model's own
say-so, decides when work is done (E-43). Dagu: end the inner loop on a command's result, and keep
that check out of the agent's reach (E-45).

**Failure modes.** The preview's phrase is that the split decides whether automation "compounds
toward the right goal or merely compounds" (P13). No source read uses that wording (E-47). The
nearest named failure is goal drift (S1).

**Evidence.** All at search-digest strength. The human-ownership claim is an argued position, not a
measured result.

## Approach 4: the light factory and the dark factory

**Definition.** A software factory is many harnessed loops running at once, fed by a queue of work
and drained through a review gate into production (E-55). It is dark when no human reads the code,
and light when humans still read at the points where a wrong call is costly, or still make the
judgement calls upstream in specifications and architecture (E-55, E-57).

**Origin.** "Dark factory" comes from lights-out manufacturing. Dan Shapiro applied it to software
on 23 January 2026 as the top of a six-step scale (E-50). The names are from a secondary GitHub page
(E-51); the third column is search digests' gloss:

| Level | Shapiro's name | The human's role |
| --- | --- | --- |
| 0 | Spicy autocomplete | Writes every line |
| 1 | Coding intern | Hands off discrete tasks |
| 2 | Junior developer | Pairs with the agent and reviews everything |
| 3 | Developer | Reviews full-time; the agent writes most code |
| 4 | Engineering team | Writes specifications and checks outcomes |
| 5 | Dark factory | Specification in, software out, nobody reviewing |

Osmani's essay of 20 July 2026 sets light against dark as two designs (E-55); the sources read do
not say who first paired the words.

**Mechanism: how much review to remove.** The field's answer is a rule about checks. A loop earns
lights-out operation only when its checks are cheap, frequent and hard to game (E-56). Digests of
the same essay say the scarce resource is human attention and the bottleneck is verification, not
generation (S4). StrongDM, the most-cited dark factory, replaces reading with holdout scenarios and
with behavioural clones of the third-party services its software talks to (E-52, E-53).

**Operation.** This session's synthesis: a dark factory moves the human work from reading diffs to
writing specifications and building the checks. StrongDM's CTO gives a spend heuristic of US$1,000
in tokens per engineer per day (E-54). Critics in the digests note the clones need maintaining as
the real services change (S13).

**Failure modes.** Dexter Horthy's team ran a lights-off factory in 2025 and shut it down: the
codebase degraded, and an outage forced weeks of reading code nobody had read (E-58). His stated
cause is that the reward signal punishes broken tests and ignores slow loss of maintainability. He
keeps humans at four points: product review, system architecture, program design, and vertical
slices reviewed as they land (E-59). Green tests can hide growing comprehension debt (S4).

**Evidence.** One named success, built by three people (E-54), and one named abandonment (E-58).
Both are self-reported and both rest on search digests. The curated list says most teams run light
(E-57).

## Approach 5: swarms, the refutation gate and Kimi K3

**Definition.** The preview describes "the swarm architecture that pairs hundreds of parallel agents
with a single refutation gate" (P16). No other source found uses "refutation gate" (E-60). The
description that follows is the nearest public pattern, and it is a reconstruction.

**Origin.** Two lines meet here. Write-ups say Moonshot's Kimi models are trained to split work
across parallel sub-agents, reported at up to 300 sub-agents and 4,000 steps for K2.6 (E-63).
Separately, the paper "Refute-or-Promote" of April 2026 describes review by refutation: adversarial
agents receive only the candidate claim, without its author's reasoning, and the candidate survives
only when none of them produces a grounded refutation (E-61).

**Mechanism.** Many workers generate in parallel; a separate verifier checks each output and sends
failures back to be re-run. One June 2026 write-up runs this: a 300-agent swarm with a separate
model checking every output against its source (E-64). A report of Google's Antigravity preview
gives a ratio of one adversarial verifier to every two to four workers, which is several gates, not
one (E-65).

This session's inference on why the shape appeals: per-token generation on open weights is cheap
once the hardware is paid for, verification is the scarce step, and a single gate spends it in one
place.

**Failure modes.** The refutation paper records a valid finding killed unanimously by the
adversaries and recovered only by a human override (E-62). This session's inference: a single gate
is a single point, and the swarm's output is as sound as the gate.

**Kimi K3's licence, read in full.** The Kimi K3 License grants use, modification, distribution and
sale, subject to five conditions (E-68). Condition 1 requires the copyright and permission notice in
copies and compliance with applicable law; condition 5 disclaims warranty and liability (E-75).
Condition 4 is the exemption below. Conditions 2 and 3 are the commercial ones:

| Condition | Who it binds | What it requires |
| --- | --- | --- |
| Model as a Service (E-69) | An operator giving third parties inference or fine-tuning access with meaningful control over inputs, whose group revenue passes US$20 million in any 12 consecutive months | A separate agreement with Moonshot before any commercial use |
| Attribution (E-70) | A commercial product with over 100 million monthly active users or over US$20 million in monthly revenue | "Kimi K3" displayed prominently in the interface |

Neither applies to internal use, or to use through Moonshot's own products or certified inference
partners (E-71). The model-as-a-service definition excludes "end-user products with model
capabilities solely embedded within specific features or harnesses" (E-69). A product is outside
condition 2 where it meets that "solely embedded" test, and below condition 3 until it is very
large. This is a reading of the text, not legal advice.

Two points for a commercial builder. Condition 2 counts the aggregate revenue of the licensee and
its affiliates, not the revenue from the model (E-69). A search digest reports a revenue share of up
to 30%; the licence text holds no such clause (E-72, E-76).

**Kimi K3's infrastructure.** The README gives 2.8 trillion parameters and a 1-million-token context
window (E-66) and says nothing about swarms (E-67). Vendor self-hosting guides, in search digests
that disagree with each other on sizes, put the checkpoint near 1.56 TB and the minimum serving
footprint near 1.68 TB of accelerator memory, on eight current-generation accelerators (E-73). On
those figures, "open weights" at this size means a datacentre, or a hosted endpoint.

**Evidence.** The licence and README were read directly. The swarm architecture is reconstructed
from sources about a predecessor model and a different product. The article's own architecture is
unread.

## K7: the two incidents

The tracing below rests on one unsigned compilation on GitHub (S6), read directly. The Medium post
it cites was not opened.

**The $47,000 case.** The compilation traces it to a single Medium post of November 2025, credited
to Teja Kusireddy (E-80), and calls it "the headline cost figure of the year, and also the
most-caveated" (E-82). Its $47,000 and 11 days match the preview (P8). Its account differs from the
preview's in two ways: the system had four agents, of which two looped (E-81), and "Nobody noticed"
compresses a specific mechanism, detection by monthly invoice (E-83).

**The $4,200 case** was not found. Three searches on its figures returned the article alone (E-84).
The nearest public record is a Claude Code issue of December 2025: over 300 identical calls in about
4.6 hours and about 27 million tokens, with no dollar figure and no dashboards (E-85). The numbers
do not match. The case is unsourced until the paid body is read.

The compilation lists many further cases of the same class and notes that first-party engineering
post-mortems "remain extraordinarily rare" (S6, line 3).

## What operating these approaches requires

This table is the session's synthesis of the cards above, with the rows each line draws on:

| Scale | What the sources say must exist | Rows |
| --- | --- | --- |
| One loop | An objective gate, a hard stop, a state file, a budget that can absorb 5 to 10 times the estimate | E-05 to E-08 |
| Several loops, several people | Every call behind an enforcing point; per-agent credentials; someone with the authority to stop a run | E-32, S24, P9 |
| A factory | Checks that are cheap, frequent and hard to game; a decision on where humans still read | E-56, E-59 |
| A swarm | A separate verifier; a route for a human to overrule the gate; hardware or a hosted endpoint | E-62, E-64, E-73 |

The sources that give numbers treat token spend as large and variable (E-08, E-54).

## Frame verdicts

The brief held two frames: a coherent emerging discipline, or a newsletter digest of recent coinages.

| Topic | Verdict |
| --- | --- |
| Loop engineering | Mixed, nearer Frame 1. For: named originators, working implementations, a reported adoption study. Against: the part-lists differ, "Ralph Wiggum" carries two opposed meanings, the roadmap needed corrections (E-09), and the study found the recommended state files almost never committed (E-16) |
| Harness and enforcement | Frame 1 for the observation-against-enforcement distinction; Frame 2 for any fixed file structure, which no source read supplies |
| Inner and outer loop | Mixed. Two earlier versions, two competing definitions, priority unestablished |
| Light and dark factory | Frame 1 for the terms; the evidence base is two self-reported cases |
| Swarm with a refutation gate | Frame 2 on present evidence. The phrase is unattested elsewhere and the pattern is assembled from adjacent sources |
| The incidents | Frame 2. One single-source figure, one untraced |

For the article as a whole: the preview reads as a digest that orders a field's ideas for founders.
Whether its body adds templates and a checklist of its own is the open question.

## Challenge pass

- **A frame that changes the answer.** Read as a product, the article sells urgency: two alarming
  figures, then a paywall. That reading predicts weak sourcing for the incidents, which is what was
  found. It does not weaken the field's ideas, which stand on other sources.
- **Dependent evidence.** Osmani's three essays, the roadmap, most explainers and the curated list
  are one voice and its echoes. The apparent consensus on harness, outer loop and factory is largely
  his.
- **Vendor interest.** The enforcement designs and the K3 hardware figures come from companies
  selling gateways and compute.
- **The omitted scale.** The sources are about small teams and founders. Almost nothing read
  addresses regulated settings, long-lived codebases or organisations past a few dozen engineers,
  though the preview speaks of "a scaling organization".
- **This session's own inference.** The mapping of the preview's topics onto Osmani's essays, and of
  the "six primitives" onto his five plus state, are inferences from order and dates. Neither is
  attested.
- **Instrument limits.** Search digests are a model's summary of pages. One digest carried an error
  a direct read corrected: a 30% revenue share absent from the licence (E-76). Digests also
  disagreed with each other on Kimi K3's checkpoint size, and no direct read settled it.

This pass was made by the session that wrote the findings. It is a self-review.

## Review pass

One read-only subagent reviewed the first version of this file against the evidence log and the
brief, on 2026-11-12. It is the same model as the author, so it is a challenge pass and not
independent assurance. It returned 25 findings: three at its highest severity, twelve at the second.

Accepted and applied in this version: the opening claim that every statement carried a logged id;
the essay-mapping verdict restated as inference; licence conditions 1 and 5 added; the incident
tracing attributed to the one unsigned compilation it rests on; quotation marks removed from
search-digest wording; unsupported clauses cut or marked as this session's inference; the
loop-engineering frame verdict changed to mixed; counts and rung descriptions corrected in all three
files.

Not applied, with the reason: a logged row for every source-only citation. Those claims stay at
their source's rung, as the opening paragraph now states, because the commissioned report re-reads
the same sources at a higher rung and will replace them.

## Status, and what it permits

`provisional`.

- **Permits:** a concept-level comparison against these five approaches as the field describes them;
  reliance on what the Kimi K3 licence text says; reliance on what the incident compilation says.
- **Forbids:** any statement of what the article's paid body says; treating a search-digest
  definition as the author's wording; treating the swarm card as the article's architecture.

| Question | Coverage | Strongest rung reached |
| --- | --- | --- |
| K1 preview | Complete | Direct read |
| K2 the floor | Roadmap and playbook covered; Osmani's essay and the author's guide not opened | GitHub page through a model summary |
| K3 harness | Outline; no file structure | Direct read for enforcement, digest for definitions |
| K4 inner and outer | Outline | Digest |
| K5 factories | Outline | Digest, two GitHub pages through a model summary |
| K6 swarm and K3 | Licence complete; architecture reconstructed | Direct read for the licence |
| K7 incidents | One traced through a compilation, one untraced | Direct read of the compilation |
| K8 practicalities | Assembled from the above | Mixed |

## Open items, in order

1. **The full article text.** With it, K3 to K6 are re-answered against the author's own templates,
   checklist, framework and architecture, and the $4,200 incident gets its source or stays
   unsourced. This is the largest gain available and the owner holds it.
2. **The commissioned report.** The owner offered on 2026-11-12 to run a web session with open
   access and bring its report back. [commissioned-report-brief.md](./commissioned-report-brief.md)
   is that brief. Its return re-reads every Assumption row at the page and re-bins it.
3. **The author's "Loop Engineering Guide".** It defines the floor this article builds on and was
   not found. The commissioned brief asks for it.

## What comes next

The comparison with the Practice is a separate, later piece of work, gated on the owner's go-ahead.
Its inputs are the Fact rows of the evidence log, and the approach cards only where the rows they
cite are Fact rows. Assumption rows are leads until the commissioned report settles them. This
session does not begin the comparison.
