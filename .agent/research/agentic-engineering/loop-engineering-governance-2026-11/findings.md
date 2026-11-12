# Findings: loop engineering at scale, in its own terms

As of 2026-11-12. Reader: the owner. Decision served: what the independent baseline is, and whether
it is firm enough to compare against. Scope and method are in [brief.md](./brief.md); every claim
below carries an id from [evidence-log.md](./evidence-log.md).

## Verdicts

1. **The article's body was not read.** The PDF is the free preview of a paid post. It states a
   thesis, two incidents and a contents list, then stops at its first body heading (P17). The
   templates, the checklist, the framework and the swarm architecture it promises are unread.
2. **The field behind the article is readable, and this baseline describes that field.** The
   preview's four topics each match a public body of writing from January to July 2026. Three of the
   four follow, in order, three essays by one author, Addy Osmani, published in the eight weeks
   before the article (E-02, E-40, E-55).
3. **One idea runs through all four topics: a loop cannot be trusted to stop or to judge itself, so
   the stopping power and the verdict must sit outside it.** The harness holds the walls, the outer
   loop holds accountability, the factory's lighting follows the strength of its checks, and the
   swarm drains through a verifier.
4. **The evidence is thin where the article is most vivid.** The $47,000 incident traces to one
   self-reported Medium post (E-80, E-82). The $4,200 incident traces to nothing found (E-84). The
   phrase "refutation gate" appears in no other source found (E-60).
5. **The Kimi K3 licence is permissive for almost every builder.** Its two commercial conditions
   bind only model-as-a-service operators above US$20 million a year and products above 100 million
   monthly users or US$20 million a month (E-69, E-70). The practical barrier is hardware (E-73).
6. **Status: `provisional`.** The baseline supports a concept-level comparison. It does not support
   any statement about what this article's paid body says, and most definitions rest on search
   digests of pages this session could not open.

## What was read, and at what strength

| Layer | Strength | Consequence |
| --- | --- | --- |
| The article's preview | Read directly | K1 is answered in full |
| The article's paid body | Unread | Nothing is attributed to it |
| GitHub-hosted sources: the Kimi K3 licence and README, an incident compilation, the 14-step roadmap, the Ralph playbook, one issue | Read, the licence and incident lines directly | The firm part of the baseline |
| Everything else: Osmani's three essays, Shapiro's levels, StrongDM, Dagu, Ng, two arXiv papers, Anthropic's guide | Search digests only | Correct in outline; wording, dates and attribution are open to correction |

The session's network allowed GitHub and refused 20 of the 22 other research hosts probed. The
reopen conditions in the brief follow from that.

Two questions are independent of the paid body and stand on their own: K2, the stated floor, and
K7, the incidents. K3 to K6 are the field's account, awaiting the article's.

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
name: Geoffrey Huntley's Ralph technique dates to July 2025 (E-10, S10).

**Mechanism.** The sources give three overlapping part-lists:

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

**Failure modes, in the sources' words.** Early completion; goal drift as constraints vanish in
long-session summaries; a maker that grades its own work leniently; gates that rot; token spend at 5
to 10 times the estimate; and "comprehension debt", the widening distance between the code that
exists and the code anyone has read (S1, E-08, S19).

**Evidence.** The roadmap and the playbook were read. Osmani's essay and Anthropic's guide were not.
One measured study exists: of 36,710 repositories, 217 ran confirmed autonomous loops, and almost
none committed the state files the literature recommends (E-16). The author's own guide, with its
"six primitives", was not found (E-17). The six are most likely Osmani's five plus state; that is
this session's inference.

## Approach 2: the harness, and a governance layer outside the loop

**Definition.** "The walls around a loop: the sandbox it runs in, the tools it can reach, the memory
that survives between runs, and the gates that decide what 'done' means." The loop is the behaviour;
the harness is the environment the behaviour runs inside (E-20). An agent is a model plus a harness
(E-21).

**Origin.** Harness engineering predates loop engineering in 2026 usage, and an arXiv paper places
loop engineering as "the next abstraction level above" it (S16). The coiner of the term was not
established.

**Mechanism.** Explainers sort the parts this way (E-22):

| Belongs to the harness | Belongs to the loop |
| --- | --- |
| Instruction files, sandbox, permissions, hooks, tests, traces | Triggers, work queue, separate checker, memory, budget, stop rule |

The boundary is unsettled. One explainer says the harness contains the loop, because the loop can do
nothing the harness does not permit; another gives verifiers and bounded retry to the loop (E-23).

The sources agree on one property. A line in an instruction file is advisory: the model reads it and
may not follow it. A hook or a gateway is not advisory: it acts whatever the model intended (E-24).

**Dashboards against enforcement.** This is the article's sharpest point, and the field states it
plainly. An incident compilation puts it as "the separation between observation and enforcement":
the major observability platforms can trace a loop, plot the spend and fire an alert, and "None of
them can stop the next call" (E-30, E-31). The remedy the sources describe is a check that runs
before each call and refuses it: a budget cap at a gateway or billing layer, an iteration ceiling, a
kill switch read at the start of every step that fails closed when it cannot be read (E-32, E-33).

**Operation.** A team must put every model and tool call behind a point it controls, give each agent
its own credential so spend is attributable and revocable, and decide who holds the authority to
stop a run (S24). The preview's second incident is this last point exactly: three dashboards, and
"None of them had the authority to stop it" (P9).

**Failure modes.** A cap the agent can read but nothing enforces; an alert that arrives after the
spend; a prompt-level stop instruction, which one source calls the weakest control available (S24).

**Evidence.** The observation-against-enforcement claim was read directly in the compilation. The
enforcement designs come from vendors who sell them (E-34). No source gives a canonical harness file
structure (E-27); the article's "harness file structure with working templates" is its own
contribution or its own packaging, and unread. A source-code study of eleven harnesses reports that
loop sophistication does not predict benchmark performance (E-26), which bears on how much a more
elaborate harness buys.

## Approach 3: the inner loop and the outer loop

**Definition.** Agents run the inner loop: investigate, implement, test, report. Engineers own the
outer loop, which carries accountability: someone who can say what changed, why it was safe, and
what happens if they are wrong (E-41).

**Origin.** Osmani, "Own the Outer Loop", July 2026 (E-40). Andrew Ng published a three-loop version
in late June 2026: the agent's coding loop, the developer's feedback loop, and an external loop
driven by users and the market, each slower than the last (E-46).

**Mechanism.** Osmani names four human-owned loops (E-42):

| Loop | The question it answers |
| --- | --- |
| Constraints | What inputs, architectures, instructions and invariants are set |
| Sampling | How much output is reviewed |
| Audit | What evidence is kept |
| Ownership | Which part of the production boundary a human owns |

A second definition competes with his. Dagu holds that inner and outer "describe nesting, not who is
involved": an outer loop is one that contains inner loops and crosses a boundary such as a review, a
schedule, a pull request or production (E-44). Under Osmani the split is about who is answerable.
Under Dagu it is about structure, and a machine can run an outer loop.

**Operation.** Both definitions give the same working rule: end the inner loop on a command's
result, never on the agent's claim, and keep that check out of the agent's reach (E-43, E-45).

**Failure modes.** The preview's phrase is that the split decides whether automation "compounds
toward the right goal or merely compounds" (P13). No source read uses that wording (E-47). The
nearest named failure is goal drift (S1). Commentary on Osmani's essay calls handing the outer loop
to the machine abdication.

**Evidence.** All at search-digest strength. The human-ownership claim is an argued position, not a
measured result.

## Approach 4: the light factory and the dark factory

**Definition.** A software factory is many harnessed loops running at once, fed by a queue of work
and drained through a review gate into production (E-55). It is dark when no human reads the code,
and light when humans still read at the points where a wrong call is costly, or still make the
judgement calls upstream in specifications and architecture (E-55, E-57).

**Origin.** "Dark factory" comes from lights-out manufacturing. Dan Shapiro applied it to software
on 23 January 2026 as the top of a six-step scale (E-50):

| Level | Shapiro's name | The human's role |
| --- | --- | --- |
| 0 | Spicy autocomplete | Writes every line |
| 1 | Coding intern | Hands off discrete tasks |
| 2 | Junior developer | Pairs with the agent and reviews everything |
| 3 | Developer | Reviews full-time; the agent writes most code |
| 4 | Engineering team | Writes specifications and checks outcomes |
| 5 | Dark factory | Specification in, software out, nobody reviewing |

The light and dark pairing as a deliberate choice between two designs is Osmani's, from 20 July 2026
(E-55).

**Mechanism: how much review to remove.** The field's answer is a rule about checks. A loop earns
lights-out operation only when its checks are cheap, frequent and hard to game (E-56). The scarce
resource is human attention, and the bottleneck is verification, not generation (S4). StrongDM, the
reference dark factory, replaces reading with holdout scenarios the building agents cannot see and
with behavioural clones of the third-party services its software talks to (E-52, E-53).

**Operation.** A dark factory moves the human work from reading diffs to writing specifications and
building the verification estate. StrongDM's CTO gives a spend heuristic of US$1,000 in tokens per
engineer per day (E-54). The clones need maintaining as the real services change.

**Failure modes.** Dexter Horthy's team ran a lights-off factory in 2025 and shut it down: the
codebase degraded, and an outage forced weeks of reading code nobody had read (E-58). His stated
cause is that the reward signal punishes broken tests and ignores slow loss of maintainability. He
keeps humans at four points: product review, system architecture, program design, and vertical
slices reviewed as they land (E-59). Green tests can hide growing comprehension debt (S4).

**Evidence.** One named success, built by three people at a security company (E-54), and one named
abandonment (E-58). Both are self-reported. The curated list says most teams run light (E-57).

## Approach 5: swarms, the refutation gate and Kimi K3

**Definition.** The preview describes "the swarm architecture that pairs hundreds of parallel agents
with a single refutation gate" (P16). No other source found uses "refutation gate" (E-60). The
description that follows is the nearest public pattern, and it is a reconstruction.

**Origin.** Two lines meet here. Moonshot's Kimi models have been trained since K2.5 to split work
across parallel sub-agents, reported at up to 300 sub-agents and 4,000 steps for K2.6 (E-63).
Separately, the paper "Refute-or-Promote" of April 2026 describes review by refutation: adversarial
agents receive only the candidate claim, without its author's reasoning, and the candidate survives
only when none of them produces a grounded refutation (E-61).

**Mechanism.** Many cheap workers generate in parallel; one verifier, often a different and stronger
model, checks each output and sends failures back to be re-run. One June 2026 write-up runs exactly
this: a 300-agent open-weight swarm with a separate model checking every output against its source
(E-64). A report of Google's Antigravity preview gives a ratio of one adversarial verifier to every
two to four workers, which is several gates, not one (E-65).

The economics explain the shape. Open-weight workers make generation cheap. Verification stays
costly, so the design spends it once, at a gate, on a model chosen for judgement.

**Failure modes.** The refutation paper records a valid finding killed unanimously by the
adversaries and recovered only by a human override (E-62). A gate tuned to refute rejects true
positives. A single gate is also a single point: the whole swarm's quality is the gate's quality.

**Kimi K3's licence, read in full.** The Kimi K3 License grants use, modification, distribution and
sale (E-68), with two commercial conditions:

| Condition | Who it binds | What it requires |
| --- | --- | --- |
| Model as a Service (E-69) | An operator giving third parties inference or fine-tuning access with meaningful control over inputs, whose group revenue passes US$20 million in any 12 consecutive months | A separate agreement with Moonshot before any commercial use |
| Attribution (E-70) | A commercial product with over 100 million monthly active users or over US$20 million in monthly revenue | "Kimi K3" displayed prominently in the interface |

Neither applies to internal use, or to use through Moonshot's own products or certified inference
partners (E-71). The model-as-a-service definition excludes "end-user products with model
capabilities solely embedded within specific features or harnesses" (E-69). A founder building a
product on K3 is outside condition 2 by that definition, and below condition 3 until the product is
very large.

Two points for a commercial builder. The first condition counts the revenue of the licensee "and its
affiliates", in total, not the revenue from the model. A search digest reports a revenue share of up
to 30%; the licence text holds no such clause (E-72).

**Kimi K3's infrastructure.** The README gives 2.8 trillion parameters and a 1-million-token context
window (E-66) and says nothing about swarms (E-67). Self-hosting guides put the checkpoint near 1.56
TB and the minimum serving footprint near 1.68 TB of accelerator memory, on eight
current-generation accelerators (E-73). "Open weights" at this size means a datacentre, or a hosted
endpoint from Moonshot or a partner.

**Evidence.** The licence and README were read directly. The swarm architecture is reconstructed
from sources about a predecessor model and a different product. The article's own architecture is
unread.

## K7: the two incidents

**The $47,000 case** traces to a single Medium post of November 2025, credited to Teja Kusireddy
(E-80). The compilation that tracks such incidents calls it "the headline cost figure of the year,
and also the most-caveated" (E-82). The preview's telling differs from the record in two ways: the
system had four agents, of which two looped (E-81), and "Nobody noticed" compresses a specific
mechanism, detection by monthly invoice (E-83).

**The $4,200 case** was not found. Three searches on its figures returned the article alone (E-84).
The nearest public record is a Claude Code issue of December 2025: over 300 identical calls in about
4.6 hours and about 27 million tokens, with no dollar figure and no dashboards (E-85). The numbers
do not match. The case is unsourced until the paid body is read.

The class of incident is well recorded even though these two instances are weak. The compilation
lists eighteen cases and notes that first-party engineering post-mortems "remain extraordinarily
rare" (S6).

## What operating these approaches requires

Taken together, the sources describe the same bill of work at each scale:

| Scale | What must exist before the approach is safe to run |
| --- | --- |
| One loop | An objective gate, a hard stop, a state file, a budget that can absorb 5 to 10 times the estimate |
| Several loops, several people | Every call behind an enforcing point; per-agent credentials; a named holder of the authority to stop |
| A factory | A verification estate that is cheap, frequent and hard to game; a decision on where humans still read |
| A swarm | A verifier stronger than the workers; a route for a human to overrule the gate; hardware or a hosted endpoint |

The cost moves from writing code to building and maintaining verification. Every source that gives a
number treats token spend as large and variable.

## Frame verdicts

The brief held two frames: a coherent emerging discipline, or a newsletter digest of recent coinages.

| Topic | Verdict |
| --- | --- |
| Loop engineering | Frame 1. Named originators, working implementations, one measured adoption study |
| Harness and enforcement | Frame 1 for the observation-against-enforcement distinction; Frame 2 for any fixed file structure, which no source supplies |
| Inner and outer loop | Mixed. One named originator, two competing definitions |
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
- **Instrument limits.** Search digests are a model's summary of pages. Two digests in this session
  carried errors the direct reads corrected: a 30% revenue share absent from the licence, and
  conflicting checkpoint sizes.

This pass was made by the session that wrote the findings. It is a self-review.

## Status, and what it permits

`provisional`.

- **Permits:** a concept-level comparison against these five approaches as the field describes them;
  reliance on the Kimi K3 licence reading; reliance on the incident tracing.
- **Forbids:** any statement of what the article's paid body says; treating a search-digest
  definition as the author's wording; treating the swarm card as the article's architecture.

| Question | Coverage | Strongest rung reached |
| --- | --- | --- |
| K1 preview | Complete | Direct read |
| K2 the floor | Good | GitHub page read |
| K3 harness | Outline; no file structure | Direct read for enforcement, digest for definitions |
| K4 inner and outer | Outline | Digest |
| K5 factories | Outline | Digest, one GitHub page |
| K6 swarm and K3 | Licence complete; architecture reconstructed | Direct read for the licence |
| K7 incidents | One traced, one untraced | Direct read |
| K8 practicalities | Assembled from the above | Mixed |

## Open items, in order

1. **The full article text.** With it, K3 to K6 are re-answered against the author's own templates,
   checklist, framework and architecture, and the $4,200 incident gets its source or stays
   unsourced. This is the largest gain available and the owner holds it.
2. **Network reach.** With `addyosmani.com`, `arxiv.org`, `simonwillison.net`, `ghuntley.com` and
   `dagu.sh` allowed, every Assumption row citing them is re-read and re-binned.
3. **The author's "Loop Engineering Guide".** It defines the floor this article builds on and was
   not found.

## What comes next

The comparison with the Practice is a separate, later piece of work, gated on the owner's go-ahead.
Its inputs are the Fact rows of the evidence log and the five approach cards above. This session
does not begin it.
