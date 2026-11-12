# Findings: loop engineering at scale, in its own terms

As of 2026-11-12. Reader: the owner. Decision served: what the independent baseline is, and whether
it is firm enough to compare against. Scope and method are in [brief.md](./brief.md). Claims cite
[evidence-log.md](./evidence-log.md): an E or P id names a logged claim with its bin; an S id alone
names a source, and the claim then stands at that source's rung with no row of its own. Sentences
marked as this session's inference or synthesis cite nothing and are the author's.

## Verdicts

Revised on 2026-11-12 after two commissioned web-session reports opened the pages this session
could not reach. The section after this one lists what they changed.

1. **The article's body is still unread.** The PDF and both web sessions reached only the free
   preview, which stops at its first body heading (P17). The templates, the checklist, the framework
   and the swarm architecture it promises are unread. The author's earlier guide, the "floor", is
   also paid and unread past its preview (E-104).
2. **The field behind the article is now read at the page.** The article's topics line up with four
   essays by one author, Addy Osmani: the harness (19 April 2026, E-113), the loop (7 June, E-100),
   the outer loop (15 July, E-120) and light and dark factories (20 July, E-126). The preview
   credits none of them; whether the body does is unknown. This alignment is an inference, made
   separately by this session and by Report A.
3. **This session's synthesis: one idea runs through all four topics. A loop cannot be trusted to
   stop or to judge itself, so the stopping power and the verdict must sit outside it.** It draws on
   E-24, E-30, E-31, E-113, E-120, E-123, E-127 and E-132.
4. **The practice lags its own prescription.** The one measured study found loops running in 217 of
   36,645 public repositories, and found stop conditions, budgets and verification files committed
   in none of them (E-109, E-110). The article's claim that the governance layer is unbuilt has
   measured support, from a study with stated limits (E-111). The detail beyond the headline counts
   rests on Report B's reading of the full paper alone.
5. **The evidence is thin where the article is most vivid.** Nobody opened the Medium post behind
   the $47,000 incident, and its republished weekly figures sum to $25,658 over four weeks, which
   fits neither the total nor the 11 days (E-137). The $4,200 incident has no source earlier than
   the article (E-138). "Refutation gate" appears in no opened source but the article (E-131).
6. **The article's model claims hold.** Moonshot's pages give Kimi K3 as 2.8 trillion parameters
   with weights promised by 27 July 2026, and swarms of up to 300 sub-agents now running on K3
   (E-134, E-136). The licence, read directly, is permissive for most builders (E-69, E-70). The
   serving minimum is eight current-generation accelerators (E-135).
7. **Status: `provisional`, firmer than before.** The baseline supports a concept-level comparison
   on the field's account. It supports no statement about the article's paid body.

## What the commissioned reports changed

The reports are filed in [commissioned-reports/](./commissioned-reports/) and merged as rows E-100
to E-139. They are a model's relay of pages it opened, with paraphrase in place of quotation, and
the two runs are one reading made twice. Where a card below cites an earlier row that a report
settled, the E-100 series row is the stronger citation.

**Confirmed.** The definition of loop engineering and its parts (E-100, E-101); Anthropic's four
loop types by what is handed off (E-107); the harness definitions (E-113 to E-115); the outer-loop
essay and its four loops with their questions (E-120, E-121); Ng's three loops (E-124); the rule for
running dark (E-127); StrongDM's rules and team (E-128); Horthy's abandonment (E-130); the adoption
study's counts (E-109); the absence of "refutation gate" elsewhere (E-131) and of any source for the
$4,200 incident (E-138).

**Corrected.**

| Earlier statement | What the reports show |
| --- | --- |
| The author's earlier guide was not found | It exists, dated 10 June 2026, and is paid (E-104). Its preview lists a 14-step roadmap; the roadmap this session read is a separate X post of 9 June by another author (E-04). Which came first is not settled |
| The "six primitives" are an inference from Osmani's five plus state | Osmani's own table has six rows headed "Primitive", the sixth "State" (E-101). The inference is confirmed for Osmani; the paid guide's own list is unread (E-105) |
| Cherny "had already put it" in a post | It was a remark on stage, dated by one paper to 2 June 2026, and worded three ways by three sources (E-112) |
| The level names are Shapiro's | The names in circulation are Willison's; Shapiro's text uses other labels (E-125) |
| Dagu's nesting definition competes with Osmani's as a source for the article | Dagu's post is dated 6 November 2026, three months after the article (E-123). It is a later refinement of the vocabulary, not an input |
| The refutation paper's failure is a valid finding wrongly killed | It reports that, and the opposite: ten reviewers unanimously endorsed a vulnerability that did not exist, killed by one empirical test (E-133) |
| Kimi swarm figures rest on write-ups of K2.6 | Moonshot's own help page gives 300 sub-agents and says the swarm is now powered by K3 (E-134) |
| The harness card rests on Osmani's factories essay | Osmani's separate harness essay of April 2026 is the fuller source, and calls hooks "the enforcement layer" (E-113) |

**Added.**

- Osmani's loop essay never uses the word "gate" (E-102). The word carries three senses elsewhere:
  a check that can only stop work (E-123), the factory's review gate (E-126), and a promotion gate
  where candidates are attacked (E-132). The article's "refutation gate" is a fourth, undefined in
  the preview.
- Loop and harness nest in opposite directions in different sources: the loop sits "one floor
  above the harness" (E-103); the harness is the walls around a loop (E-114); the agent loop is one
  of a harness's seven subsystems (E-115).
- Report A reads the live preview as advertising a harness "built from seven files". No opened
  source describes a seven-file harness (E-117). The nearest count of seven is the seven subsystems
  of the harness paper (E-115), which are not files.
- Real harnesses differ widely in whether a stop is enforced: one ships its hard stop disabled, one
  has no cost kill switch, one defaults its step limit to infinite (E-119). Anthropic's guide shows
  spend and bounds loops by turn caps, with no monetary budget control (E-108).
- The original Ralph post gives no stop condition and no sandboxing, and its author limits it to
  greenfield work (E-106). The sandbox guidance this session read comes from a later playbook
  (E-13).
- The factories essay is largely a report of a talk by Horthy, the critic of dark factories
  (E-126), and its body says "lit factory" where its title says "Light".

## What was read, and at what strength

| Layer | Strength | Consequence |
| --- | --- | --- |
| The article's preview | Read directly | K1 is answered in full |
| The article's paid body | Unread | Nothing is attributed to it |
| The Kimi K3 licence and README lines, and the quoted lines of an incident compilation | Read directly with `curl` | The firm part of the baseline |
| Other GitHub-hosted pages: the 14-step roadmap, the Ralph playbook, one issue, two lists | Read through the fetch tool's model summary | Usable; quotations from them are the summary's rendering |
| Osmani's four essays, Huntley's post, Shapiro's levels, StrongDM, Dagu, Ng, three arXiv papers, Anthropic's guide, Moonshot's pages | Opened by two commissioned web sessions and relayed as paraphrase (rung RW in the evidence log) | Usable for what each source says and when; not for exact wording. Three earlier search-digest statements were corrected by these reads |
| The Medium post behind the $47,000 incident; the X posts; the harness term's origin sources | Search digests only | Unchecked |

Of 22 hosts probed, the two GitHub hosts answered and 20 were refused. The reopen conditions in the
brief follow from that. The owner then ran
[commissioned-report-brief.md](./commissioned-report-brief.md) in two web sessions with open access;
their reports opened most of the pages behind the search-digest rows.

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
literature recommends (E-16). The author's own guide exists and is paid; its "six primitives" are unread (E-104,
E-105). Osmani's own table lists six primitives, his five pieces plus state (E-101).

## Approach 2: the harness, and a governance layer outside the loop

**Definition.** A search digest gives Osmani's wording as: the walls around a loop, meaning the
sandbox it runs in, the tools it can reach, the memory that survives between runs, and the gates
that decide what "done" means. The loop is the behaviour; the harness is the environment the
behaviour runs inside (E-20). An agent is a model plus a harness (E-21).

**Origin.** Harness engineering predates loop engineering in 2026 usage, and an arXiv paper places
loop engineering as "the next abstraction level above" it (S16). Credit for the term is split
between Viv Trivedy and Mitchell Hashimoto (E-116).

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

**Origin.** Andrew Ng published a three-loop version on 26 June 2026: the agent's coding loop, the
developer's feedback loop, and an external loop driven by users and the market (E-124). Osmani's
"Own the Outer Loop" followed on 15 July 2026 (E-120) and is the form the preview's wording
matches. Dagu's definition, below, dates from November 2026, after the article (E-123).

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
on 23 January 2026 as the top of a six-step scale (E-50). The names are Simon Willison's, from his
note on the post (E-125); the third column paraphrases Shapiro's descriptions as the reports relay
them:

| Level | Name in circulation | The human's role |
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
adversaries and recovered only by a human override (E-62), and the reverse: a vulnerability that
did not exist, endorsed unanimously by ten reviewers and killed by one empirical test (E-133). The
paper's own conclusion is that agreement among agents is not correctness. This session's inference: a single gate
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
most-caveated" (E-82). Its $47,000 and 11 days match the preview (P8). The post's republished weekly
figures sum to $25,658 across four weeks, which fits neither number, and its date is given three
ways; neither commissioned report could open it (E-137). Its account differs from the
preview's in two ways: the system had four agents, of which two looped (E-81), and "Nobody noticed"
compresses a specific mechanism, detection by monthly invoice (E-83).

**The $4,200 case** was not found. Three searches on its figures returned the article alone (E-84).
The nearest public record is a Claude Code issue of December 2025: over 300 identical calls in about
4.6 hours and about 27 million tokens, with no dollar figure and no dashboards (E-85). The numbers
do not match. The commissioned reports found one further near-miss, an unopened Medium post about
$4,200 burned over 63 hours, with none of the other details (E-138). The case is unsourced until
the paid body is read.

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
| Swarm with a refutation gate | Mixed. Frame 1 for the swarm: the vendor documents up to 300 sub-agents on the open-weight model the article names (E-134). Frame 2 for the "single refutation gate": the phrase is in no other opened source (E-131), and the nearest method reports that agreement among refuting agents failed in both directions (E-133) |
| The incidents | Frame 2. One single-source figure whose own numbers do not reconcile (E-137), one untraced (E-138) |

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
- **Forbids:** any statement of what the article's paid body says; treating a relayed paraphrase as
  the author's wording; treating the swarm card as the article's architecture.
- **Why still provisional:** the reports are a model's relay that this session cannot re-read at
  the source, the two runs are not independent of each other, and the article's body is unread.

| Question | Coverage | Strongest rung reached |
| --- | --- | --- |
| K1 preview | Complete | Direct read |
| K2 the floor | Osmani's essay, Huntley's post, Anthropic's guide and the adoption study covered; the author's guide paid and unread | Commissioned report |
| K3 harness | Three definitions and per-system controls covered; no file structure exists in any opened source | Commissioned report; direct read for enforcement |
| K4 inner and outer | Three versions covered and dated | Commissioned report |
| K5 factories | Levels, rule, one success and one abandonment covered | Commissioned report |
| K6 swarm and K3 | Licence complete; Moonshot's swarm and hardware covered by one report; the article's architecture unread | Direct read for the licence; commissioned report for the rest |
| K7 incidents | One traced to an unopened post with figures that do not reconcile; one untraced | Commissioned report; direct read of the compilation |
| K8 practicalities | Assembled from the above | Mixed |

## Open items, in order

1. **The full article text.** With it, K3 to K6 are re-answered against the author's own templates,
   checklist, framework and architecture, and the $4,200 incident gets its source or stays
   unsourced. This is the largest gain available and the owner holds it.
2. **The author's earlier guide.** It defines the floor this article builds on, and it is paid
   (E-104). The owner's subscription covers it or does not; with its text, the "six primitives" and
   the 14-step roadmap are read in the author's own form.
3. **Three unopened origins.** The Medium post behind the $47,000 incident, the exact words of
   Steinberger and Cherny, and the harness sources Osmani draws on. Each refused automated access.

## What comes next

The comparison with the Practice is a separate, later piece of work, gated on the owner's go-ahead.
Its inputs are the Fact rows of the evidence log, and the approach cards only where the rows they
cite are Fact rows or rows E-100 to E-139. Assumption rows the reports did not reach remain leads.
This session does not begin the comparison.
