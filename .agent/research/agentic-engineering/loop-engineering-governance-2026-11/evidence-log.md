# Evidence log: loops in agentic systems

Reader: the owner, and the later session that compares this baseline with the Practice. Decision
served: which statements about these approaches may be relied on. Method and scope are in
[brief.md](./brief.md).

## Provenance

- All reads were made on 2026-11-12 UTC from a Claude Code cloud session.
- The subject article: Linas Beliūnas, "Loops at Scale: The Governance Layer Nobody Built Yet",
  `https://linas.substack.com/p/ai-agent-loop-governance`, dated 3 August 2026, marked PAID. The
  browser tab title reads "Loop Engineering at Scale: The AI Agent Governance Layer". Read as a
  four-page PDF printed on 12 November 2026. Page 4 is blank.
- **Network reach, measured.** A probe of 22 research hosts with `curl` returned a proxy refusal
  (HTTP 403 on CONNECT) for 20 of them, among them `www.oreilly.com`, `dev.to`, `medium.com`,
  `en.wikipedia.org`, `huggingface.co`, `simonwillison.net`, `ghuntley.com`, `x.com` and
  `web.archive.org`. `github.com` and `raw.githubusercontent.com` answered. The fetch tool separately
  failed to resolve `linas.substack.com`, `addyosmani.com` and `arxiv.org`.
- **Instruments.** Web search (extended mode) returns a digest with result links. The fetch tool
  returns a small model's summary of a page. `curl` against `raw.githubusercontent.com` returns the
  file itself.

## Rungs

| Rung | Meaning in this log |
| --- | --- |
| R0 | The PDF preview of the subject article, read directly |
| R1 | Search digest of a page this session could not open |
| R2 | GitHub-hosted secondary page, read through the fetch tool's summary |
| R3 | GitHub-hosted primary page, read through the fetch tool's summary |
| R4 | Primary file read directly with `curl` |

Most of this log sits at R1. An R1 row records what a search digest says a page says. It is two
steps from the page and it can be wrong about wording, dates and attribution.

## Source register

| Id | Source | URL | Rung |
| --- | --- | --- | --- |
| S0 | Beliūnas, subject article, preview pages 1 to 3 | `https://linas.substack.com/p/ai-agent-loop-governance` | R0 |
| S1 | Codez, "Loop engineering: the 14-step roadmap", X post of 9 June 2026, mirrored as a gist with a corrections note | `https://gist.github.com/taitruong/ea4f430261f41403021babba2ebdfb7c` | R2 |
| S2 | Osmani, "Loop Engineering", June 2026 | `https://addyosmani.com/blog/loop-engineering/` | R1 |
| S3 | Osmani, "Own the Outer Loop", July 2026 | `https://addyosmani.com/blog/own-the-outer-loop/` | R1 |
| S4 | Osmani, "Software Factories, Light and Dark", 20 July 2026 | `https://addyosmani.com/blog/software-factories/` | R1 |
| S5 | Huntley's fork of Farr's Ralph playbook | `https://github.com/ghuntley/how-to-ralph-wiggum` | R3 |
| S6 | "Runaway agent cost loop incidents", an unsigned compiled report, sources dated to May 2026 | `https://github.com/vkorost/state-of-ai-observability-2026/blob/main/reports/Claude%20-%20Runaway%20agent%20cost%20loop%20incidents.md` | R4 for the quoted lines |
| S7 | Claude Code issue 15909, opened 31 December 2025 | `https://github.com/anthropics/claude-code/issues/15909` | R3 |
| S8 | Kimi K3 licence text | `https://raw.githubusercontent.com/MoonshotAI/Kimi-K3/main/LICENSE` | R4 |
| S9 | Kimi K3 README | `https://github.com/MoonshotAI/Kimi-K3` | R4 for the quoted lines |
| S10 | "awesome-software-factories", first 100,000 characters | `https://github.com/arialus/awesome-software-factories` | R2 |
| S11 | Shapiro, "The Five Levels: from Spicy Autocomplete to the Dark Factory", 23 January 2026; Willison's note of 28 January 2026 | `https://simonwillison.net/2026/Jan/28/the-five-levels/` | R1 |
| S12 | Cole Medin knowledge base, five levels entry | `https://github.com/coleam00/cole-medin-knowledge-base/blob/main/concepts/five-levels-of-ai-coding-autonomy.md` | R2 |
| S13 | StrongDM, "The StrongDM Software Factory"; Willison's coverage of 7 February 2026; Stanford CodeX note of 8 February 2026 | `https://law.stanford.edu/2026/02/08/built-by-agents-tested-by-agents-trusted-by-whom/` | R1 |
| S14 | Dagu, "Open, closed, inner, outer: the loops around a coding agent" | `https://dagu.sh/blog/loops-around-a-coding-agent` | R1 |
| S15 | Ng, three nested loops, The Batch, late June 2026 | `https://www.nowosci.ai/en/article/andrew-ng-loop-engineering-coding-agents` | R1 |
| S16 | Lulla et al., "Loop Engineering: Building Blocks, Adoption, and Impact", arXiv 2608.21884 | `https://arxiv.org/abs/2608.21884` | R1 |
| S17 | Barbaste et al., "Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents", arXiv 2609.00006; a reading guide on GitHub | `https://github.com/lushinshang/harness_engineering_11_systems` | R1 for the paper, R2 for the guide |
| S18 | Anthropic, "Loop engineering: Getting started with loops" | `https://claude.com/blog/getting-started-with-loops` | R1 |
| S19 | Heavybit podcast with Dexter Horthy, "The limits of lights-out coding", and secondary write-ups | `https://www.heavybit.com/library/podcasts/high-leverage/ep-12-the-limits-of-lights-out-coding-with-dexter-horthy` | R1 |
| S20 | "Refute-or-Promote: Adversarial Stage-Gated Multi-Agent Review", arXiv 2604.19049 | `https://arxiv.org/abs/2604.19049` | R1 |
| S21 | Kimi K2.6 swarm write-ups and Moonshot's Agent Swarm feature page | `https://www.kimi.ai/features/agent-swarm` | R1 |
| S22 | Kimi K3 self-hosting guides | `https://www.thundercompute.com/blog/kimi-k3` | R1 |
| S23 | Harness-against-loop explainers: Data Science Dojo, Managed Code, Exemplar, Agentastic | `https://datasciencedojo.com/blog/harness-engineering-vs-loop-engineering/` | R1 |
| S24 | Runtime-authority and kill-switch vendor posts: Cycles, OrcaRouter, Rioja | `https://runcycles.io/concepts/coding-agents-need-runtime-budget-authority` | R1 |
| S25 | Report of Google Antigravity's swarm preview | `https://hermes-ai.net/news/google-s-antigravity-launches-swarm-to-run-parallel-coding-agents/` | R1 |

## The preview, transcribed (R0)

Text at the right-hand margin of the PDF is clipped. Clipped words are not restored.

| Id | The preview says |
| --- | --- |
| P1 | Subtitle: founders running AI agent loops in 2026 need harnesses, outer-loop ownership and swarm governance, "not just better prompts" |
| P2 | "Loop engineering got its name in a single week of June 2026." Peter Steinberger is credited as arguably first to post that developers should stop prompting coding agents and start "designing the loops that prompt them" |
| P3 | Boris Cherny, who runs Claude Code at Anthropic, "had already put it more plainly: his only job now is to write loops" |
| P4 | An embedded post by Steinberger, timestamped 21:58 on 07/06/2026, 7.9M views: "Here's your monthly reminder that you shouldn't be prompting coding agents anymore." |
| P5 | The author's earlier "Loop Engineering Guide" covered "the six primitives, the Ralph Wiggum pattern, the 14-step roadmap, and Claude Fable 5 as orchestrator" |
| P6 | "That guide is the floor." This article covers what becomes visible "once a founder has more than one loop running, more than one person touching the system, or more at stake than a single overnight API bill" |
| P7 | "a working loop and a safe loop are not the same thing, and the gap between them is where real incidents happen" |
| P8 | Incident one: two autonomous agents "fell into a clarification loop, each asking the other to restate its work, and ran that way for 11 days, billing every call, until the charges passed $47,000". "Nobody noticed." |
| P9 | Incident two: a coding agent "hit an ambiguous error and retried 240 times" over 3 hours, "reaching $4,200 while three monitoring dashboards displayed the spend in real time. None of them had the authority to stop it" |
| P10 | "Both loops were doing what they were built to do. The logic was fine. What was missing was a governance layer outside the loop, with the power to end it." |
| P11 | "agent capability is more fun to write about than agent constraint" |
| P12 | Contents item, first bullet: its opening is cut by the page break; the visible remainder reads "the templates to build one" |
| P13 | Contents item: "The split between the inner loop and the outer loop that determines whether" a founder's automation "compounds toward the right goal or merely compounds" |
| P14 | Contents item: "The light-factory and dark-factory framework for deciding how much human review a scaling organization can safely remove" |
| P15 | Contents item: "the swarm-scale architectures now running on open-weight models, including Kimi K3, whose full 2.8-trillion-parameter weights Moonshot AI published on Hugging Face in late July, the largest open-weight release to date" |
| P16 | The rest is "an operating manual": "the harness file structure with working templates, the checklist that separates dashboards from" enforcement (the line is clipped after "re"), "the swarm architecture that pairs hundreds of parallel agents with a single refutation gate, and what K3's license and infrastructure requirements actually mean for anyone building a commercial product on top of it" |
| P17 | First body heading: "The Harness Is Not the Loop", followed by "This post is for paid subscribers" |

## Claims

Bins: F is Fact (verified at the stated rung), A is Assumption to verify, D is Dropped.

### Loop engineering, the stated floor

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-01 | The term spread in the week of 7 to 9 June 2026 after Steinberger's post | F | S0 (P4), S1 |
| E-02 | Osmani's essay "Loop Engineering" is dated 7 or 8 June 2026 and defines the practice as replacing yourself as the person who prompts the agent | A | S2 |
| E-03 | Osmani's essay lists five pieces: automations, worktrees, skills, plugins and connectors, and subagents. Secondary write-ups add external state as a sixth | A | S2 |
| E-04 | The 14-step roadmap is by Codez (@0xCodez), posted on X on 9 June 2026, citing Osmani and AlphaSignal | F | S1 |
| E-05 | The roadmap's admission test has four conditions: recurring work, automated verification, a token budget that can absorb waste, and agent tools to run and inspect code | F | S1 |
| E-06 | The roadmap's minimum viable loop has four parts: one automation, one skill, one state file, one gate | F | S1 |
| E-07 | The roadmap states a gate must be objective, and calls a second agent's review without an objective check "just a second optimist" | F | S1 |
| E-08 | The roadmap says loops can burn 5 to 10 times the expected tokens, and that a loop with under 50% of changes accepted loses money | F | S1 |
| E-09 | The gist appends corrections to the roadmap: it mixes Codex and Claude Code constructs | F | S1 |
| E-10 | The Ralph technique is credited to Geoffrey Huntley; its minimal form is `while :; do cat PROMPT.md \| claude ; done` | F | S5 |
| E-11 | In the playbook, each Ralph iteration starts with a clean context and the plan file on disk is the shared state | F | S5 |
| E-12 | The playbook's backpressure is tests, typechecks, lints and builds that reject work before commit | F | S5 |
| E-13 | The playbook names two stop conditions: Ctrl+C and an optional iteration cap. It runs with permissions bypassed and says "a sandbox becomes your only security boundary" | F | S5 |
| E-14 | In the roadmap, "Ralph Wiggum loop" names a failure: the agent declares completion early with no real verifier and no hard stop | F | S1 |
| E-15 | Anthropic's guide classifies loops as turn-based, goal-based, time-based and proactive | A | S18, S16 |
| E-16 | A mining study of 36,710 repositories confirmed autonomous agent loops in 217; almost all committed the configuration that starts the loop and almost none committed the state files the gray literature recommends | A | S16 |
| E-17 | Beliūnas's own "Loop Engineering Guide" was not found by search; its "six primitives" are unlisted in any source read | F | Three searches, S0 |
| E-18 | A curated list says Huntley named the Ralph Wiggum loop pattern in July 2025 | F at R2 | S10 |

### Harness

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-20 | Osmani defines the harness as "the walls around a loop: the sandbox it runs in, the tools it can reach, the memory that survives between runs, and the gates that decide what 'done' means"; the loop is the behaviour, the harness the environment | A | S4 |
| E-21 | Osmani defines an agent as a model plus a harness of files, tools, memory, skills, sandboxes, permissions, observability and recovery | A | S3 |
| E-22 | Explainers assign instruction files, sandboxing, permissions, hooks, tests and traces to the harness, and triggers, a work queue, a separate checker, memory and a budget to the loop | A | S23 |
| E-23 | Explainers disagree on containment: one says the harness contains the loop, another gives verifiers and bounded retry to the loop | A | S23 |
| E-24 | Explainers agree an instruction-file line is advisory and hard rules need programmatic enforcement; hooks can block an action whatever the model intended | A | S23 |
| E-25 | A source-code study of eleven coding harnesses identifies seven subsystems, 13 observations, 29 design patterns and 18 recommendations | A | S17 |
| E-26 | The same study reports that loop sophistication does not predict benchmark performance | A | S17 |
| E-27 | No source read gives a canonical harness file structure | F | Search of 12 November 2026 |

### Enforcement against observation

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-30 | "observability tools are passive: they record loops, they do not stop them" | F | S6, line 75 |
| E-31 | The report names "the separation between observation and enforcement" as the structural monitoring gap: the listed platforms can alert, and "None of them can stop the next call" | F | S6, line 91 |
| E-32 | Vendor posts place enforcement at a gateway or billing layer that checks a budget before each call | A | S24 |
| E-33 | One guide defines a kill switch as a flag checked at the start of every step, with the agent stopping when the flag cannot be read | A | S24 |
| E-34 | The sources for E-32 and E-33 sell or promote enforcement products | F | S24, by their domains |

### Inner loop and outer loop

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-40 | Osmani's "Own the Outer Loop" is dated 9 July 2026 on Substack and 15 July 2026 on his site | A | S3 |
| E-41 | In it, agents run the inner loop (investigate, implement, test, report) and engineers own the outer loop, which carries accountability | A | S3 |
| E-42 | It names four human-owned loops: constraints, sampling, audit and ownership | A | S3 |
| E-43 | It says an independent check, not the model's own say-so, decides when work is done | A | S3 |
| E-44 | Dagu defines inner and outer by nesting, not by who is involved, and an outer loop as one that crosses a boundary such as a review, a schedule, a pull request or production | A | S14 |
| E-45 | Dagu advises ending the inner loop on a command's result and keeping the check out of the agent's reach | A | S14 |
| E-46 | Ng describes three nested loops at different speeds: the agent's coding loop, the developer's feedback loop, and an external feedback loop | A | S15 |
| E-47 | No source read supports the preview's "compounds toward the right goal or merely compounds" wording | F | Search of 12 November 2026 |

### Light factory and dark factory

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-50 | Shapiro published a scale from level 0 to level 5 on 23 January 2026; level 5 is the "dark factory", named after lights-out manufacturing | A | S11, S10, S12 |
| E-51 | The levels are: 0 spicy autocomplete, 1 coding intern, 2 junior developer, 3 developer, 4 engineering team, 5 dark factory | F at R2 | S12 |
| E-52 | StrongDM's charter holds two rules: code must not be written by humans, and code must not be reviewed by humans | A | S13 |
| E-53 | StrongDM validates with holdout scenarios and a "Digital Twin Universe" of cloned third-party services | A | S13 |
| E-54 | The $1,000 of tokens per engineer per day figure is a heuristic stated by StrongDM's CTO, and the factory was built by a three-person team | A | S13 |
| E-55 | Osmani's essay of 20 July 2026 defines a factory as many harnessed loops fed by a queue and drained through a review gate, light where humans read at the costly points, dark where nobody reads the diff | A | S4 |
| E-56 | Its rule for going dark: a loop's checks must be cheap, frequent and hard to game | A | S4 |
| E-57 | A curated list defines a light factory as one where humans still make judgement calls upstream, and says most teams run this kind | F at R2 | S10 |
| E-58 | Horthy's team ran a lights-off factory in 2025 and shut it down after the codebase degraded and an outage forced weeks of reading code nobody had read | A | S19, S10 |
| E-59 | Horthy keeps human judgement at four points: product review, system architecture, program design, and vertical slices reviewed as they land | A | S19 |

### Swarms, the refutation gate and Kimi K3

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-60 | No source found uses the phrase "refutation gate" for a swarm architecture | F | Two searches of 12 November 2026 |
| E-61 | "Refute-or-Promote" (April 2026) describes stage-gated review in which adversarial agents see only the candidate claim, and a candidate survives only when none produces a code-grounded refutation | A | S20 |
| E-62 | That paper records a valid candidate killed unanimously and recovered by human override | A | S20 |
| E-63 | Kimi K2.6 write-ups describe up to 300 parallel sub-agents over up to 4,000 steps, as a trained behaviour | A | S21 |
| E-64 | One June 2026 write-up pairs a 300-agent swarm with a separate model that checks every output against its source and returns failures to be re-run | A | S21 |
| E-65 | A report of Google Antigravity's swarm preview describes workers in isolated worktrees with one adversarial verifier for every two to four workers | A | S25 |
| E-66 | Kimi K3 is a 2.8T-parameter open-weight model with a 1-million-token context window, described by Moonshot as "the world's first open 3T-class model" | F | S9, line 30 |
| E-67 | The K3 README makes no statement about swarms or parallel agents | F | S9, `grep` for "swarm" returned no line |
| E-68 | The Kimi K3 License grants use, modification, distribution and sale, subject to five conditions | F | S8 |
| E-69 | Condition 2: an operator of a "Model as a Service" business whose group revenue passes US$20 million in any 12 consecutive months needs a separate agreement with Moonshot before commercial use. End-user products with the model "solely embedded within specific features or harnesses" are outside the definition | F | S8 |
| E-70 | Condition 3: a commercial product with over 100 million monthly active users, or over US$20 million in monthly revenue, must display "Kimi K3" prominently in its interface | F | S8 |
| E-71 | Condition 4: conditions 2 and 3 do not apply to internal use, or to use through Moonshot's products or certified inference partners | F | S8 |
| E-72 | The licence holds no revenue-share clause | F | S8, full text read |
| E-73 | Self-hosting guides put the checkpoint near 1.56 TB and the vLLM minimum near 1.68 TB of accelerator memory across eight current-generation accelerators | A | S22 |
| E-74 | The weights went public on 26 or 27 July 2026 | A | Search digest |
| E-75 | Condition 1 requires the copyright and permission notice in all copies and compliance with applicable laws; condition 5 provides the software "AS IS" and disclaims liability | F | S8 |
| E-76 | A search digest, citing Wikipedia's Moonshot AI page, reported a revenue share of up to 30% for inference providers above US$20 million a year; the licence text read directly holds no such clause | F | Search of 12 November 2026 against S8 |

### The two incidents

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-80 | The $47,000 case traces to one Medium post from November 2025, credited to Teja Kusireddy, amplified by TechStartups on 14 November 2025 | F | S6, lines 19 and 43 |
| E-81 | The topology was four LangChain agents; two of them, Analysis and Verification, looped | F | S6, line 43 |
| E-82 | The report calls the figure "the headline cost figure of the year, and also the most-caveated", with self-reported weekly amounts | F | S6, line 43 |
| E-83 | The loop was detected from the monthly invoice | F | S6, lines 19 and 89 |
| E-84 | The $4,200, 240-retry, three-dashboard case was not found: three searches returned no source other than the subject article | F | Searches of 12 November 2026 |
| E-85 | The nearest public record is Claude Code issue 15909: over 300 identical `npm install` calls across about 4.6 hours and about 27 million tokens, with no dollar figure, closed by automation as not planned | F | S7 |

### Names and dates in the preview

| Id | Claim | Bin | Source |
| --- | --- | --- | --- |
| E-90 | Cherny's line is reported as "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops" | A | Search digest |
| E-91 | "Claude Fable 5" appears as a model name in the K3 README's benchmark notes, with a link to an Anthropic announcement | F | S9, lines 591 and 594 |
| E-92 | On 18 July 2026 Steinberger asked whether the conversation had moved from loops to graphs, and "graph engineering" followed as a term | A | Search digest |

## Dependence notes

- S2, S3 and S4 are one author. Most explainers in S23, the roadmap in S1 and the curated list in
  S10 cite him. Agreement among them is one voice repeated.
- S6 compiles press and practitioner posts. It is not independent of the Medium post behind E-80.
- S22 and S24 are vendors with products to sell in the area they describe.
- S5 is a fork of a third party's playbook about Huntley's technique, not Huntley's own post.
- The subject article postdates S2, S3 and S4. This session's inference, attested by no source: its
  floor tracks S2, its outer-loop topic S3, and its harness and factory topics S4. Whether its body
  cites them is unknown.
- S6 is unsigned, and its file name begins "Claude -", which suggests a model compiled it. Its
  claims about the Medium post are its own; that post was not opened.

## Reading the bins

- F means the cited source says this, at the rung shown. For an R1 or R2 source that is a weaker
  statement than for an R4 source. "F at R2" marks a Fact row whose only source is a model summary
  of a secondary page.
- A negative row ("not found") is F for the searches run and no further. Each rests on two or three
  extended searches made on 12 November 2026 with the row's own key phrases as the query.
- No row needed the Owner's call bin, and no row was Dropped.

## The commissioned reports (rung RW)

On 2026-11-12 the owner ran [commissioned-report-brief.md](./commissioned-report-brief.md) in two
web sessions with open access and returned two reports, filed as received in
[commissioned-reports/](./commissioned-reports/): `report-a.md` (274 lines) and `report-b.md` (773
lines, with a note that its enrichment step failed and its register was cut).

**Rung RW.** A page opened by a commissioned web session and relayed to this session as paraphrase
with at most one short quotation per source. This session did not open the page. RW sits above R1,
because the page was opened and is named with its section, and below R3, because the relay is a
model's report that this session cannot re-read at the source. Both reports departed from the
brief's quotation rule: neither reproduces lists, templates or abstracts verbatim.

**How the two reports relate.** They are two runs of one brief by the same model family. Where they
agree, that is one reading made twice, not two independent witnesses. They differ in coverage:

| Point | Report A | Report B |
| --- | --- | --- |
| W12, the adoption paper | Abstract page only | Full paper |
| W14, Refute-or-Promote | Abstract page only | Full paper |
| W13, the harness paper | To part-way through section 6.2 | To section 13.1, by a subagent |
| W17, Moonshot | K2.5 pages only; hardware not opened | K3 blog, model card, vLLM recipe, swarm help page, each partly |
| W8, StrongDM | Story page | Story, Principles and Techniques pages, a Hacker News thread |
| W16 and W18 | Not opened | Not opened |

Report B also tried to read this repository's own skill files, which the brief did not ask for. It
could not open them and applied none.

### Rows the reports settle

W ids are the brief's. "Was" gives the earlier row and its bin.

| Id | Claim, as the reports relay it | Was | Source |
| --- | --- | --- | --- |
| E-100 | W1 is dated 7 June 2026 and defines loop engineering as replacing yourself as the person who prompts the agent | E-02, A | A and B, Q1 |
| E-101 | W1 lists five pieces, then a sixth, memory. Its table has six rows under the column header "Primitive", the sixth labelled "State" | E-03, A | A and B, Q1 |
| E-102 | W1 does not use the word "gate"; it says verifier, checker and stop condition | new | A and B, Q1 |
| E-103 | W1 places the practice "one floor above the harness" | new | A, Q1 |
| E-104 | The author's earlier guide exists: "Loop Engineering: How to Design AI Loops That Build, Ship, and Improve While You Sleep", 10 June 2026, paid, preview ending at "What Is a Loop?" | E-17, F (not found) | A and B, Q2 |
| E-105 | That guide's preview lists a 14-step roadmap, 41 pre-built loops, Claude Fable 5, and failures, costs and three debts. The phrase "six primitives" is not in its preview | new | A and B, Q2 |
| E-106 | Huntley's original Ralph post is dated 14 July 2025. The loop as shown never exits; the operator stops it. He would not use it on an existing codebase. It says nothing on sandboxing or permissions | E-10 to E-13, E-18 | A and B, Q3 |
| E-107 | Anthropic's guide is dated 30 June 2026 and classifies four loops by what is handed off: turn-based (the check), goal-based (the stop condition), time-based (the trigger), proactive (the prompt) | E-15, A | A and B, Q4 |
| E-108 | The guide bounds goal loops by turn caps written into the goal and shows spend through usage commands; it describes no monetary budget control | new | A and B, Q4 |
| E-109 | W12 scanned 36,710 repositories on 19 August 2026 (36,645 after removals), matched 256 by heuristics and confirmed 217 loops, precision 0.868 | E-16, A | B, Q5; A for the counts |
| E-110 | In W12's Table 2, stop conditions, verification, budgets and cost files were detected in 0 repositories and state in 2, none confirmed; triggers were confirmed in 242. Of the 217 loops, 180 were event-triggered, mostly pull-request review | E-16, A | B, Q5 |
| E-111 | W12 names its own limits: a single adjudicator, public repositories only, a scan about ten weeks after the term appeared; it records that novelty is contested ("renamed cron job") and that benefits are self-reported | new | B, Q5 |
| E-112 | Cherny's line was spoken on stage, not posted: W12 dates it to a WorkOS "Acquired Unplugged" video of 2 June 2026. W1, W5 and W12 word it three ways | E-90, A | A and B, Q6 |
| E-113 | W4, "Agent Harness Engineering", is dated 19 April 2026. It defines the harness as everything that is not the model and calls hooks "the enforcement layer" | new | A and B, Q7 |
| E-114 | W3's harness definition is the walls around a loop: sandbox, reachable tools, memory between runs, and the gates that decide what done means | E-20, A | A and B, Q7 |
| E-115 | W13 defines the harness by seven subsystems: agent loop, LLM integration, tools, memory and context, safety and permissions, orchestration, extensibility | E-25, A | A and B, Q7 |
| E-116 | Credit for "harness engineering" is split: W4 names Trivedy; W13 says Hashimoto used it first in passing in February 2026 and Trivedy then defined it | new | A and B, Q7 |
| E-117 | No opened source gives a seven-file harness structure. Report A reads the live preview as advertising a harness "built from seven files with templates" | E-27, F | A and B, Q8; A, Part 1 note |
| E-118 | W13's first observation: the eleven systems span three orders of magnitude in code size and loop sophistication does not predict benchmark performance | E-26, A | A and B, Q9 |
| E-119 | W13 records budget and stop controls per system: a 100-turn cap, a 90-iteration budget with a hard stop that ships disabled, price and token middlewares, one system with no cost kill switch, one whose step limit defaults to infinite | new | B, Q9 |
| E-120 | W2 is dated 15 July 2026 and is the written form of a conference keynote. Agents run the inner loop (investigate, implement, verify, report); engineers own the outer loop (decide, verify, approve, own) | E-40, E-41, A | A and B, Q11 |
| E-121 | W2's four loops and their questions: constraints (what to set), sampling (how much to review), audit (what evidence to keep), ownership (which part of the production boundary to own) | E-42, A | A and B, Q11 |
| E-122 | W2 itself names Quality, Verdict and Answerability, and three costs: cognitive surrender, cognitive debt, orchestration tax. Its statistics come from sources neither report opened | new | A and B, Q11 |
| E-123 | W9 is dated 6 November 2026, after the subject article. It defines inner and outer by nesting, closed by feedback returning to the agent, and a gate as a check that can only stop work where a loop sends it back | E-44, E-45, A | A and B, Q12 |
| E-124 | Ng's letter is dated 26 June 2026: an agentic coding loop (minutes), a developer feedback loop (tens of minutes to hours), an external feedback loop (hours to weeks) | E-46, A | A and B, Q13 |
| E-125 | Shapiro's post is dated 23 January 2026. The level names in circulation (spicy autocomplete to dark software factory) are from Willison's note; Shapiro's running text uses other labels | E-50, E-51 | A and B, Q14 |
| E-126 | W3, dated 20 July 2026, is largely an account of a Horthy conference talk. Its body says "lit factory"; its title says "Light" | E-55, A | A, Q15 and conflicts |
| E-127 | W3's rule for a loop to run dark: its check is cheap, runs at high frequency, is hard to fake, answers immediately and does not drift. Review stays where a wrong answer is expensive and only a person can catch it; auth, billing and public API contracts are named | E-56, A | A and B, Q15 |
| E-128 | StrongDM's story page gives three rules: no code written by humans, none reviewed by humans, and at least US$1,000 of tokens per engineer per day. Three named people; the team dates from 14 July 2025 | E-52 to E-54, A | A and B, Q16 |
| E-129 | Willison's main objection to StrongDM is cost, about US$20,000 per engineer per month; Hacker News commenters dispute released code quality and intent | new | A and B, Q16 |
| E-130 | Horthy's lights-out run: no human reviewed code from July 2025; about four months later the system was abandoned and rebuilt, with three weeks of re-onboarding. Sources give three, four or five months | E-58, A | A and B, Q17 |
| E-131 | Among opened sources, "refutation gate" appears only in the subject article. W14 says "promotion gate" and "mandatory empirical validation gate". Report B saw the phrase in later or undated search snippets it did not open | E-60, F | A and B, Q18 |
| E-132 | W14 is a method for defect discovery, not for coding swarms. Adversaries see only the claim; a candidate survives when unrefuted; a mandatory empirical stage follows | E-61, A | A and B, Q19 |
| E-133 | W14 reports two failures in opposite directions: ten reviewers unanimously endorsed a vulnerability that did not exist, killed by one empirical test; and a real CVE was killed and restored by a human | E-62, A | A and B, Q19 |
| E-134 | Moonshot's swarm help page gives up to 300 sub-agents and over 4,000 tool calls, introduced with K2.5, upgraded in K2.6 and "now powered by K3"; only the orchestrator is trained | E-63, A | B, Q20 |
| E-135 | The vLLM recipe states a minimum of eight GB300 accelerators, or eight MI355X or MI350X | E-73, A | B, Q20 |
| E-136 | Moonshot's pages give K3 as 2.8T parameters with 104B activated, and promised full weights by 27 July 2026 | E-66, E-74 | B, Q20 |
| E-137 | The Medium post behind the $47,000 incident was opened by neither report. Its republished weekly figures ($127, $891, $6,240, $18,400) sum to $25,658, and four weeks of rising cost do not fit an 11-day loop. Its date is given as 16 October, 31 October and 14 November 2025 | E-80 to E-83 | A and B, Q21 |
| E-138 | Neither report found a source for the $4,200 incident earlier than the subject article. The nearest is a Medium post, unopened, titled "The Agent That Burned $4,200 in 63 Hours" | E-84, F | A and B, Q22 |
| E-139 | Named critics, each in a source the reports opened: Horthy (maintainability has no fast oracle), Willison (cost), Osmani (his own caveats), Ng (the developer's context advantage), Huntley (greenfield only) | new | A and B, Q23 |

### Disagreements between the two reports

- Report A says W12 and W14 were read as abstract pages only; Report B says both in full. Rows that
  rest on the papers' bodies (E-110, E-111, the second failure in E-133) are Report B's alone.
- Report A found nothing on K3 and swarms and did not open the hardware recipe; Report B did both.
  E-134 to E-136 are Report B's alone.
- Report A reads the preview as naming "seven files"; Report B mentions the number only to say no
  source supports it. The PDF this session read is cut at that line (P12).

### Still open after the reports

- The exact words of Steinberger's post and Cherny's remark at origin.
- The Medium post behind the $47,000 incident, and any source for the $4,200 incident.
- The sources W4 draws on for the harness (Trivedy, Hashimoto, Böckeler), and the origins of W2's
  statistics.
- W13's later observations and recommendations.
