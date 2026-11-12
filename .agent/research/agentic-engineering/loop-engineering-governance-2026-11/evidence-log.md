# Evidence log: loop engineering at scale

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
- The subject article postdates S2, S3 and S4 and its four topics follow theirs in order. Whether
  its body cites them is unknown.
