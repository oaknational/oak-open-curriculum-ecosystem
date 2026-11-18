I could not run the enrichment step, so this is the report before enrichment, cut to fit. The enrichment tool takes at most 50,000 characters and the full draft was about 65,000. I ran out of turns before I could cut it down. The full source register is the first thing I dropped; this version keeps the main sources and summarises the rest.

Coverage is also short of the brief:
- **OCE cognition skills:** I could not open them. GitHub refused automated access and the tool would not fetch the raw files, so I did not use them.
- **Searches:** I ran 18 of the roughly 20 planned web searches.
- **W13 (harness paper):** I read it only partly. Observations 11 and 13, and recommendations 4, 5, 8, 11 and 15–18, were not found.
- **W16 and W18:** I could not open the $47,000 Medium post, its Hacker News thread, the X posts or the Cherny video.

# Loop-engineering baseline: primary-source reading, 12 November 2026

The subject article's model claims check out against Moonshot's own pages. Its two cost incidents are only partly traceable. "Refutation gate" has no origin before the subject article.

The sources describe four layers:
- **Loop engineering:** designing the system that prompts a coding agent.
- **Harness:** the environment one agent run sits inside.
- **Outer loop:** where humans keep accountability.
- **Dark factory:** a setup that ships code no human has read.

Several words carry conflicting senses across sources: "inner/outer", "closed", "gate", "harness", "back pressure".

**TL;DR**
- **Definitions:**
  - W1 (Osmani) defines loop engineering as five building blocks plus memory/state. The word "gate" does not appear.
  - W11 (Anthropic) classifies loops by what is handed off: the check, the stop condition, the trigger, or the prompt. [claude](https://claude.com/blog/getting-started-with-loops)
  - W12 (Lulla et al.) confirmed autonomous loops in 217 of 256 heuristic matches among 36,645 scanned repositories. Almost none committed state, budget or stop-condition files. [arxiv](https://arxiv.org/abs/2608.21884) [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - W13 (Barbaste et al.) defines a harness as seven subsystems and finds that loop sophistication does not predict benchmark performance. [arxiv](https://arxiv.org/html/2609.00006v1)
- **Claims that check out:**
  - Moonshot's pages give Kimi K3 as 2.8T total parameters (104B activated) under the "Kimi K3 License", with weights promised by 27 July 2026. [kimi +2](https://www.kimi.ai/blog/kimi-k3)
  - Moonshot says swarms run up to 300 sub-agents, and only the orchestrator is trained with reinforcement learning (PARL). [kimi +2](https://www.kimi.ai/help/agent/agent-swarm)
  - The vLLM recipe states a minimum of 8× GB300. [vllm](https://recipes.vllm.ai/moonshotai/Kimi-K3)
  - The $47,000 incident traces to a Teja Kusireddy post I could not open. Its republished weekly figures sum to $25,658, not $47,000. [Substack](https://todatabeyond.substack.com/p/we-spent-47000-running-ai-agents)
- **Not found / unresolved:**
  - **$4,200 incident:** I found no source earlier than the subject article (3 August 2026) for the agent that retried 240 times.
  - **"Refutation gate":** W14 does not use the phrase. It says "promotion gate", "kill mandate" and "mandatory empirical validation gate". [arxiv](https://arxiv.org/pdf/2604.19049v1)
  - **Horthy's lights-out run:** sources give three, about four, or four to five months. July to November 2025 is the best-supported span. [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy)

# 00-register.md

## Header

**Date.** 12 November 2026. Every page marked `opened` was fetched in this session. Nothing is stated from memory.

**Subject article.** Linas Beliūnas, "Loops at Scale: The Governance Layer Nobody Built Yet", Substack, Aug 03, 2026, marked "Paid": https://linas.substack.com/p/ai-agent-loop-governance. [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
- The full text was not available. I read only the free preview, up to the heading "The Harness Is Not the Loop". **Part 1 is skipped.**
- The preview contains:
  - an opening on Steinberger and Cherny; [Substack](https://linas.substack.com/p/ai-agent-loop-governance) [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
  - a back-reference to W5; [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
  - the two incidents; [Substack](https://linas.substack.com/p/ai-agent-loop-governance) [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
  - the four topics. [Substack](https://linas.substack.com/p/ai-agent-loop-governance) [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
- Quotation: "None of them had the authority to stop it" (Beliūnas, 3 August 2026). It refers to the three dashboards in the $4,200 case. [Substack](https://linas.substack.com/p/ai-agent-loop-governance) [Substack](https://linas.substack.com/p/ai-agent-loop-governance)

**Coverage of W1–W18.**

| Status | Count | Sources |
|---|---|---|
| Opened fully | 6 | W1, W3, W6, W7, W12, W14 |
| Opened partly | 10 | W2, W4, W5, W8, W9, W10, W11, W13, W15, W17 |
| Not opened | 2 | W16 (bot-blocked; Algolia refused), W18 (x.com snippets only) |

**Method note (OCE cognition skills).**
- **What I tried:**
  - https://github.com/EngraphCode/open-curriculum-ecosystem/tree/engraph/.agent/skills/cognition: the tool refused it as not permitted.
  - https://github.com/EngraphCode/open-curriculum-ecosystem/tree/engraph/.agent%2Fskills%2Fcognition: "Site disallows automated access".
  - Raw files: not attempted, because the file names were unknown and the tool does not permit constructed URLs.
- **What search snippets show:** pull requests (for example https://github.com/EngraphCode/open-curriculum-ecosystem/pull/382) name skills `proportionality`, `cricket`, `concept-exploration`, `parallax-synthesise` and `parallax-audit`, each with a `SKILL-CANONICAL.md`. [github](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/63) [github](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/382)
- **Outcome:** I read no skill file, so I neither describe nor apply their contents. I used ordinary careful method instead:
  - every claim is tied to a page opened in this session;
  - snippets are labelled;
  - conflicts are recorded rather than resolved;
  - a final self-check is included.
- **Subagent:** one subagent read W13's PDF up to §13.1. What it reports beyond that point comes from snippets and is marked.

## Source register (main sources)

| Id | Title | Author | Published | URL | Opened? |
|---|---|---|---|---|---|
| S0 | Loops at Scale | Linas Beliūnas | 3 Aug 2026 | https://linas.substack.com/p/ai-agent-loop-governance | partial (preview; paid) |
| W1 | Loop Engineering | Addy Osmani | 7 Jun 2026 | https://addyosmani.com/blog/loop-engineering/ | opened |
| W2 | Own the Outer Loop | Addy Osmani | 15 Jul 2026 | https://addyosmani.com/blog/own-the-outer-loop/ | partial (keynote video not opened) |
| W3 | Software Factories, Light and Dark | Addy Osmani | 20 Jul 2026 | https://addyosmani.com/blog/software-factories/ | opened |
| W4 | Agent Harness Engineering | Addy Osmani | 19 Apr 2026 | https://addyosmani.com/blog/agent-harness-engineering/ | partial (factory-model and long-running-agents posts not opened) |
| W5 | Loop Engineering guide | Linas Beliūnas | 10 Jun 2026 | https://linas.substack.com/p/loop-engineering-complete-guide | partial (preview; paid) |
| W6 | Ralph Wiggum as a "software engineer" | Geoffrey Huntley | 14 Jul 2025 | https://ghuntley.com/ralph/ | opened |
| W7a | The Five Levels | Dan Shapiro | 23 Jan 2026 | https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/ | opened (images not inspected) |
| W7b | The Five Levels (link post) | Simon Willison | 28 Jan 2026 | https://simonwillison.net/2026/Jan/28/the-five-levels/ | opened |
| W8a–c | StrongDM Story / Principles / Techniques | Justin McCarthy / StrongDM AI | 6 Feb 2026 | https://factory.strongdm.ai/ ; https://factory.strongdm.ai/principles ; https://factory.strongdm.ai/techniques | opened (/products not opened) |
| W8e | How StrongDM's AI team build serious software… | Simon Willison | 7 Feb 2026 | https://simonwillison.net/2026/Feb/7/software-factory/ | opened |
| W8f | HN thread on StrongDM | various | — | https://news.ycombinator.com/item?id=46924426 | partial |
| W9a | Open, closed, inner, outer | Yota Hamada | 6 Nov 2026 | https://dagu.sh/blog/loops-around-a-coding-agent | opened (guides https://docs.dagu.sh/ai/loops/ not opened) |
| W10a | Three Key Loops for Building Great Software | Andrew Ng | 26 Jun 2026 | https://www.deeplearning.ai/the-batch/three-key-loops-for-building-great-software | opened (issue-359 not opened) |
| W11a | Loop engineering: Getting started with loops | Delba de Oliveira, Michael Segner | 30 Jun 2026 | https://claude.com/blog/getting-started-with-loops | opened |
| W11b | Keep Claude working toward a goal | Anthropic | — | https://code.claude.com/docs/en/goal | opened (routines and workflows docs not opened) |
| W12 | Loop Engineering: Building Blocks, Adoption, and Impact | Lulla, Nersesyan, Mohsenimofidi, Treude, Baltes | v2 26 Aug 2026 | https://arxiv.org/pdf/2608.21884v2 | opened (full) |
| W13 | Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents | Barbaste, Darrigol, Vu, Wiltberger | 15 Jul 2026 | https://arxiv.org/html/2609.00006v1 | partial (to §13.1; later sections from snippets) |
| W14 | Refute-or-Promote | Abhinav Agarwal | Apr 2026 | https://arxiv.org/pdf/2604.19049v1 | opened (full) |
| W15a | High Leverage Ep. 12 | Joe Ruscio, Dexter Horthy | 5 Aug 2026 | https://www.heavybit.com/library/podcasts/high-leverage/ep-12-the-limits-of-lights-out-coding-with-dexter-horthy | partial (transcript truncated) |
| W15f | Context engineering with Dex Horthy | Gergely Orosz | 15 Jul 2026 | https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy | partial (notes, not transcript) |
| W15i | HN: Why Software Factories Fail | various | — | https://news.ycombinator.com/item?id=49023019 | partial |
| W16a | We Spent $47,000 Running AI Agents in Production | Teja Kusireddy | not established | https://pub.towardsai.net/we-spent-47-000-running-ai-agents-in-production-heres-what-nobody-tells-you-about-a2a-and-mcp-5f845848de33 | not opened (bot-blocked; HN 45802430, Algolia and ZenML not reached) |
| W17a | Kimi Agent Swarm feature page | Moonshot AI | — | https://www.kimi.ai/features/agent-swarm | opened |
| W17c | Kimi K3: Open Frontier Intelligence | Moonshot AI | Jul 2026 | https://www.kimi.ai/blog/kimi-k3 | partial |
| W17f | moonshotai/Kimi-K3 model card | Moonshot AI | — | https://huggingface.co/moonshotai/Kimi-K3 | partial (LICENSE not opened) |
| W17g | Kimi-K3 vLLM recipe | vLLM | — | https://recipes.vllm.ai/moonshotai/Kimi-K3 | partial |
| W17h | Agent Swarm help page | Moonshot AI | — | https://www.kimi.ai/help/agent/agent-swarm | partial |
| W18a | Steinberger X post | Peter Steinberger | 7 Jun 2026 | https://x.com/steipete/status/2063697162748260627 | not opened (snippet) |
| W18b | Acquired Unplugged: Boris Cherny | WorkOS | 2 Jun 2026 per W12 | https://www.youtube.com/watch?v=RkQQ7WEor7w | not opened |
| X1 | Skill Issue: Harness Engineering for Coding Agents | Kyle (HumanLayer) | 12 Mar 2026 | https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents | partial |
| X20 | The Agent That Burned $4,200 in 63 Hours | Sattyam Jain | — | https://medium.com/@sattyamjain96/the-agent-that-burned-4-200-in-63-hours-a-production-ai-postmortem-d38fd9586a85 | not opened (snippet) |
| X21 | Kimi K2.6 Self-Improving Loop Explained | Mervin Praison | 19 Jun 2026 | https://mer.vin/2026/06/kimi-k2-6-self-improving-loop-explained-300-agent-swarm-with-opus-4-8-verification/ | opened (summarises an unopened "Movez" X article) |

**Not opened.**
- Trivedy (https://x.com/Vtrivedy10/status/2031408954517971368, https://www.vtrivedy.com/posts/claude-code-sdk-haas-harness-as-a-service).
- Hashimoto (https://mitchellh.com/writing/my-ai-adoption-journey; snippets date it 5 Feb 2026). [opsera](https://opsera.ai/blog/harness-engineering)
- Anthropic harness post (https://www.anthropic.com/engineering/harness-design-long-running-apps).
- Böckeler (https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html).
- Khan (https://levelup.gitconnected.com/building-claude-code-with-harness-engineering-d2e8c0da85f0).
- Willison's 2025 post on designing agentic loops.
- The repomirror field report.
- Sonar, GitLab, Wharton, the Anthropic RCT and OpenAI (the statistics cited in W2).
- METR.
- Greyling's repository.
- Masood, Pacheco, Hightower.
- The clauday article.
- 12-factor agents, ace-fca.md and wsff.md.
- The Horthy talk, the AAIF article and the Mastra podcast.
- The Kimi K2.5, K2.6, K3.1 Pro and Agent Swarm blog posts.
- The X posts from rohanpaul_ai, reach_vb and weswinder.

# 01-loop-engineering.md

## Q1. W1's definition, building blocks, state, and "gate"

**Quotation.** "A loop needs five things and then one place to remember stuff." (Osmani, 7 June 2026, https://addyosmani.com/blog/loop-engineering/) [addyosmani](https://addyosmani.com/blog/loop-engineering/)

**Definition (opening).** Loop engineering means you stop being the person who prompts the agent and design the system that does it instead. A loop is a recursive goal that the AI iterates on until it is complete. Osmani says he is sceptical and warns about token cost. He places loop engineering "one floor above" harness engineering. [addyosmani](https://addyosmani.com/blog/loop-engineering/)

**Building blocks, in order** (section "The five pieces, and then notes"):
1. **Automations:** run on a schedule and do discovery and triage. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
2. **Worktrees:** keep agents working in parallel from colliding. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
3. **Skills:** record the project knowledge the agent would otherwise guess. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
4. **Plugins and connectors:** link the agent to existing tools. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
5. **Sub-agents:** one agent has the idea and another checks it. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
6. **Memory:** a markdown file or Linear board that holds what is done and what is next. [addyosmani](https://addyosmani.com/blog/loop-engineering/)

**Does it include state?** Yes. The prose calls the sixth item "memory"; the table under the same heading labels that row "State". [addyosmani](https://addyosmani.com/blog/loop-engineering/)

**Other points.**
- `/loop` re-runs on a cadence. `/goal` runs until a condition holds, checked by a separate model (section "Automations…"). [claude](https://code.claude.com/docs/en/goal) [addyosmani](https://addyosmani.com/blog/loop-engineering/)
- Separating the maker from the checker is called the most useful structural feature (section "Sub-agents…"). [addyosmani](https://addyosmani.com/blog/loop-engineering/)
- Three problems remain: verification, comprehension debt, and cognitive surrender (section "What the loop still does not do for you"). [addyosmani](https://addyosmani.com/blog/loop-engineering/)

**Does it use "gate"?** **Not found in this source.** The page says "verifier", "checker" and "stop condition".

**Summary.** W1's loop is five product features plus memory/state. Checking is framed as maker/checker, never as a gate.

## Q2. W5's "six primitives", Ralph, the 14-step roadmap, the orchestrator

**Quotation.** "posted twelve words that broke the entire AI-coding internet" (Beliūnas, 10 June 2026, https://linas.substack.com/p/loop-engineering-complete-guide)

**Access.** Paid. The preview ends at "What Is a Loop?". [Substack](https://linas.substack.com/p/loop-engineering-complete-guide)

**What the preview shows.**
- Steinberger's post of 7 June 2026. [Substack](https://linas.substack.com/p/loop-engineering-complete-guide)
- Cherny "on stage a few days before", sourced to the WorkOS video. [Substack](https://linas.substack.com/p/loop-engineering-complete-guide)
- A contents list that includes "The 14-step roadmap", 41 pre-built loops, Claude Fable 5, and failures, costs and three debts. [Substack](https://linas.substack.com/p/loop-engineering-complete-guide)

**What is not visible.** The six primitives, Ralph and the orchestrator model are **not found in the preview**. Only S0's preview attributes them to W5. [Substack](https://linas.substack.com/p/ai-agent-loop-governance)

**Other sources with six elements.** W1 has five pieces plus memory/state. The brief says Greyling's repository has "Six Primitives (+ Memory)", but I did not open it. W12 §2.2 describes that repository as seven loop patterns and four readiness levels. [arxiv](https://arxiv.org/pdf/2608.21884v2)

**Internal inconsistency.** W5 says "twelve words", but the sentence it quotes has sixteen. [Substack](https://linas.substack.com/p/loop-engineering-complete-guide)

**Summary.** The contents of W5 are paywalled. The preview confirms only that a 14-step roadmap exists.

## Q3. W6: the Ralph technique, stopping, cost, safety

**Quotation.** "In its purest form, Ralph is a Bash loop." (Huntley, 14 July 2025, https://ghuntley.com/ralph/)

**Technique.**
- A `while` loop pipes PROMPT.md into a coding agent forever. It works with any tool that does not cap tool calls or usage. [ghuntley](https://ghuntley.com/ralph/)
- One item per loop, with a context of about 170k. [ghuntley](https://ghuntley.com/ralph/)
- The same plan and specs are loaded every loop. [ghuntley](https://ghuntley.com/ralph/)
- Back pressure comes from tests, builds, type checkers and static analysers. [ghuntley](https://ghuntley.com/ralph/)
- Only one subagent runs build and test, to avoid "bad form back pressure". [ghuntley](https://ghuntley.com/ralph/)

**Stopping.**
- There is no built-in stop. Ralph runs out of TODO items or goes off track (section "the todo list"). [ghuntley](https://ghuntley.com/ralph/)
- The operator chooses between `git reset --hard` and rescue prompts (section "you will wake up to a broken code base"). [ghuntley](https://ghuntley.com/ralph/)

**Cost.** An anecdote: a $50k contract delivered for $297. [ghuntley](https://ghuntley.com/ralph/) No cap is described.

**Safety.**
- Senior expertise is still required. [ghuntley](https://ghuntley.com/ralph/)
- Huntley would not use Ralph on an existing codebase. It is for greenfield work, expecting to get about 90% of the way. [ghuntley](https://ghuntley.com/ralph/)
- Sandboxing and permissions are **not found in this source**.

**Summary.** Ralph is a bash loop that restarts the agent and keeps state in files. The operator stops it, and it is limited to greenfield work.

## Q4. W11: loop types, hand-offs, budgets, stop conditions

**Quotations.**
- W11a: "loops as agents repeating cycles of work until a stop condition is met" (de Oliveira and Segner, 30 June 2026, https://claude.com/blog/getting-started-with-loops). [claude](https://claude.com/blog/getting-started-with-loops)
- W11b: "It doesn’t run commands or read files independently" (Anthropic, https://code.claude.com/docs/en/goal), referring to the `/goal` evaluator. [claude](https://code.claude.com/docs/en/goal)

**Loop types (W11a).**

| Loop | Trigger | Stop | Hands off |
|---|---|---|---|
| Turn-based | User prompt | Claude judges the task done | The check | [claude](https://claude.com/blog/getting-started-with-loops)
| Goal-based (`/goal`) | Manual prompt | Goal met or maximum turns reached ("stop after 5 tries"); an evaluator checks | The stop condition | [claude](https://claude.com/blog/getting-started-with-loops)
| Time-based (`/loop`, `/schedule`) | Interval | Cancelled, or the work completes | The trigger | [claude](https://claude.com/blog/getting-started-with-loops)
| Proactive | Event or schedule, no human in real time | Each task stops at its goal; the routine runs until switched off | The prompt | [claude](https://claude.com/blog/getting-started-with-loops)

**Managing token usage (W11a, section "Managing token usage").**
- Pick the right primitive and model. [claude](https://claude.com/blog/getting-started-with-loops)
- Set clear success and stop criteria. [claude](https://claude.com/blog/getting-started-with-loops)
- Pilot before a large run. [claude](https://claude.com/blog/getting-started-with-loops)
- Use scripts for deterministic work. [claude](https://claude.com/blog/getting-started-with-loops)
- Don't schedule more often than needed. [claude](https://claude.com/blog/getting-started-with-loops)
- `/usage`, `/goal` and `/workflows` show spend. You can stop an agent from `/workflows`. [claude](https://claude.com/blog/getting-started-with-loops)

**Stop conditions (W11b).**
- A goal clears when it is judged met or impossible, on an error the user must fix, or on `/goal clear`. [claude](https://code.claude.com/docs/en/goal)
- A goal can be bounded by writing a turn or time clause into the condition. [claude](https://code.claude.com/docs/en/goal)
- Status shows token spend. [claude](https://code.claude.com/docs/en/goal)
- The loop stops after several turns without tool use. [claude](https://code.claude.com/docs/en/goal)
- A dollar budget for `/goal` is **not found in this source**.

**Summary.** W11 classifies loops by what is handed off. Spend is displayed to the user rather than enforced.

## Q5. W12: what it measured and found

**Quotation.** "almost none commits the state files the discourse prescribes" (Lulla et al., 26 August 2026, https://arxiv.org/abs/2608.21884) [arxiv](https://arxiv.org/abs/2608.21884)

**Method.**
- **Review (§3):**
  - Seven grey-literature sources from 7 June to 15 July: Osmani ×2, Orosz's newsletter and a 136-comment thread, Lindenberg, a HuaShu note, and Greyling's repository. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - Plus Huntley, Greyling's essay, the Stripe "Minions" podcast, and Osmani's post on autonomy. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - Claude Code assisted, and the last author checked the quotations. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Working definition (§2):** automated control structures that repeatedly invoke agents on a schedule or event, each run bounded by a machine-checkable stop. They persist state, verify independently, bound cost, restrict unattended changes, and define when humans intervene. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Observations O1–O6:**
  - O1: handing off the next prompt. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - O2: novelty is contested ("renamed cron job"). [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - O3: consistent building blocks, including a "kill switch", although the sources are not independent. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - O4: benefits are self-reported. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - O5: failure modes, such as about eight million tokens spent in 48 hours and "verifier theater". [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - O6: no systematic evidence. [arxiv](https://arxiv.org/pdf/2608.21884v2)

**Table 2, detected / confirmed:**

| Mechanism | Detected | Confirmed |
|---|---|---|
| Triggering | 253 | 242 | [arxiv](https://arxiv.org/pdf/2608.21884v2)
| Stop conditions | 0 | 0 |
| State | 2 | 0 |
| Skills | 1 | 1 |
| Isolation | not traceable | — |
| Verification | 0 | 0 |
| Human oversight | 15 | 13 | [arxiv](https://arxiv.org/pdf/2608.21884v2)
| Budgets | 0 | 0 |
| Provenance | 30 | not assessed |
| Cost | 0 | 0 |

**Mining study (§4.1).**
- **Scan:** 19 August 2026. 36,710 repositories, minus 65 removed and 158 forks, gives 36,645. Eight tools. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Behavioural signals:** cadence, authorship and append-only edits. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Labelling:** Claude Code (Fable 5) labelled 256 candidates, an Opus 5 agent tried to refute each label, and the last author adjudicated. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Confirmed:** 217 loops (0.59% of repositories); precision 0.868. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Triggers:** 21 schedule-only, 180 event-only (mostly pull-request review), 15 both. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Tools:** Claude Code 189. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Committed vs not:** triggers are committed (all but one as GitHub Actions). State, budget, verifier and cost files are not. [arxiv](https://arxiv.org/pdf/2608.21884v2)

**Threats to validity (§6).**
- Single adjudicator, not blind, so no κ is reported. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- The review is interpretive. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- The sample is public repositories only, scanned about ten weeks after the term was coined. [arxiv](https://arxiv.org/pdf/2608.21884v2)

**Planned study (§4.2).** Three conditions: interactive (C1), goal-driven (C2) and scheduled (C3). Measures are throughput, correctness, cost and human effort. [arxiv](https://arxiv.org/pdf/2608.21884v2)

**Summary.** W12 finds that loops run mostly as GitHub Actions pull-request reviews. The state, budget and stop-condition files the discourse prescribes are almost never committed.

## Q6. W18: what Steinberger and Cherny said, and when

**Steinberger.**
- The X post is dated 7 June 2026, with a "monthly reminder" lead-in (snippet, not opened). [x](https://x.com/steipete/status/2063697162748260627) [a16z](https://a16z.com/knowing-when-to-stop-the-art-of-making-a-loop-converge/)
- W12 (ref. [48]) agrees and reports more than eight million views by mid-July. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- W1 and W5 quote it without the lead-in. [addyosmani](https://addyosmani.com/blog/loop-engineering/)

**Cherny.**
- W12 dates it to the WorkOS "Acquired Unplugged" video, **2 June 2026**. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- W5, W1 and W12 each give different wording.
- W1 links to an X post by rohanpaul_ai (not opened). [addyosmani](https://addyosmani.com/blog/loop-engineering/)
- **The exact words are not established at origin.**

**Summary.** The dates are 7 June (Steinberger) and 2 June 2026 (Cherny, according to W12). The exact wording is not verified at origin.

# 02-harness.md

## Q7. Definitions of "harness" and who coined "harness engineering"

**Quotations.**
- W3: "A software factory is harnessing loops at scale." (Osmani, 20 July 2026) [addyosmani](https://addyosmani.com/blog/software-factories/) [addyosmani](https://addyosmani.com/blog/software-factories/)
- W4: "Harnesses don’t shrink, they move" (Osmani, 19 April 2026, section heading) [addyosmani](https://addyosmani.com/blog/agent-harness-engineering/)
- W13: "loop sophistication does not predict benchmark performance" (Barbaste et al., 15 July 2026) [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)

**Definitions.**
- **W3** (section "The loop is the atom"): the walls around a loop. Its sandbox, tools, memory, and the gates that decide what counts as done. [addyosmani](https://addyosmani.com/blog/software-factories/)
- **W4** (section "What is a harness, really?"): everything except the model. Prompts and agent files; tools, skills, MCP; infrastructure; orchestration; hooks and middleware; observability. Hooks are called "the enforcement layer". [addyosmani](https://addyosmani.com/blog/agent-harness-engineering/)
- **W13 §2:** the seven subsystems are the loop, LLM integration, tools, memory/context, safety/permissions, orchestration and extensibility. A harness is not a framework, an evaluation harness or an orchestrator. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **W2:** a model plus a harness of files, tools, memory, skills, sandboxes, permissions, observability and recovery. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)

**Coinage.**
- W4 and X1 credit Viv Trivedy. [addyosmani +2](https://addyosmani.com/blog/agent-harness-engineering/)
- W13 §2.1 says Hashimoto used the term first in passing (February 2026) and Trivedy then defined it. [github +2](https://madplay.github.io/en/post/harness-engineering)
- X1 quotes Hashimoto: fix each agent mistake so that it never recurs. [humanlayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) [trybrain](https://trybrain.com/blog/the-rise-of-the-harness-engineer/)
- X1 defines harness engineering as a subset of context engineering. [humanlayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

**Origin sources.** Trivedy, Hashimoto, Anthropic, Böckeler, Khan and Macedo were **not opened**.

**Summary.** The three sources define the harness at different scopes. Credit for the term is split between Trivedy and Hashimoto.

## Q8. File structures, templates, the 90-line scaffold, "seven files"

**Quotation (X1).** "it's not a model problem. It's a configuration problem." (Kyle, 12 March 2026) [humanlayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) [addyosmani](https://addyosmani.com/blog/agent-harness-engineering/)

**File structures and templates by source.**
- **W6:**
  - `PROMPT.md`. [ghuntley](https://ghuntley.com/ralph/)
  - `specs/*`: one spec per file. [ghuntley](https://ghuntley.com/ralph/)
  - `fix_plan.md`: a TODO list. [ghuntley](https://ghuntley.com/ralph/)
  - `AGENT.md`: "the heart of the loop". [ghuntley](https://ghuntley.com/ralph/)
- **W1:**
  - `SKILL.md`. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
  - `.codex/agents/*.toml`. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
  - `.claude/agents/`. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
  - `AGENTS.md` or progress files as state. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
- **W11a:** an example `SKILL.md` with a verification procedure. [claude](https://claude.com/blog/getting-started-with-loops)
- **X1:**
  - A skill folder (`SKILL.md`, `response_template.md`, `CLIs/`). [humanlayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
  - CLAUDE.md kept under 60 lines. [humanlayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- **W12, Table 2:**
  - `STATE.md`, `LOOP.md`. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - `loop-budget.md`, `loop-constraints.md`. [arxiv](https://arxiv.org/pdf/2608.21884v2)
  - pause labels. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **X21:**
  - A spec template (GOAL, SCOPE, RULES, SOURCES, OUTPUT, ON CONFLICT, STOP CONDITION). [mer](https://mer.vin/2026/06/kimi-k2-6-self-improving-loop-explained-300-agent-swarm-with-opus-4-8-verification/?amp=1)
  - `CONSTRAINTS.md`. [mer](https://mer.vin/2026/06/kimi-k2-6-self-improving-loop-explained-300-agent-swarm-with-opus-4-8-verification/?amp=1)

**W13 §16.10 (subagent).**
- About 90 lines of Python. [arxiv](https://arxiv.org/pdf/2609.00006)
- A linear loop, a middleware pipeline, four tools (`bash`, `read`, `write`, `search_replace`), provider fallback, `AGENTS.md` discovery, and threshold compaction. [arxiv](https://arxiv.org/pdf/2609.00006)
- It implements 10 of the 18 recommendations. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006)
- Its limits and stop condition were **not found**.

**"Seven files."** Not found in any opened source. W13's "seven" refers to subsystems, not files. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)

**Summary.** Several sources give layouts. None supports a seven-file harness.

## Q9. W13: subsystems, observations, recommendations, budgets

**Subsystems.** See Q7.

**Observations.**

| # | Observation | Basis |
|---|---|---|
| 1 (§5) | Loop sophistication does not predict benchmark performance | Read | [arxiv](https://arxiv.org/html/2609.00006v1)
| 2 (§7.1) | Provider optimisations depend on who pays the per-provider cost | Read | [arxiv](https://arxiv.org/html/2609.00006v1)
| 3 (§7.3) | Prompt rhetoric converges, then thins | Subagent |
| 4 (§8.4) | Edit strategy is key to accuracy | Subagent |
| 5 (§9.6) | Persistent memory is the frontier | Subagent |
| 6 (§10.2) | OS sandboxing is a costly choice | Subagent |
| 7 (§11) | Coordinator-worker emerges independently | Subagent |
| 8 (§12.5) | Skills overtook MCP | Subagent |
| 9 | Twin absences (no agentic framework, no embedding retrieval) | Inferred | [arxiv](https://arxiv.org/html/2609.00006v1)
| 10 | Maps onto Anthropic's patterns | Snippet |
| 11 | **Not found** | — |
| 12 | Platform turn | Snippet |
| 13 | **Not found** | — |

**Recommendations, partial.**
- 1: middleware.
- 2: provider fallback.
- 3: small tool surface.
- 6: Markdown context.
- 7: compaction.
- 9–10: sandboxing.
- 12: defer multi-agent.
- 14: MCP and skills as extensions.
- **Not found:** 4, 5, 8, 11, 15–18.

**Permissions (§10).**
- **Claude Code:** three layers. [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Codex:** four layers, including a Guardian reviewer that fails closed. [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Hermes:** a floor that survives YOLO mode. [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Pi:** no sandbox. [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Mini-SWE-Agent:** step, cost and time limits only. [arxiv](https://arxiv.org/pdf/2609.00006v1)

**Budgets and stops (§6.2, Table 5).**
- **Gemini CLI:** a 100-turn cap. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Hermes:** a 90-iteration budget, a verify-on-stop guard, and a hard stop that ships disabled. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Mistral Vibe:** price and token middlewares. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **Pi:** no cost kill switch. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
- **OpenCode:** `maxSteps` is infinite. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)

**§6.1.** Harness engineering builds the inner cycle. Loop engineering composes the outer loops from it. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)

**Summary.** Observations 1–8 are established. Most of the recommendations are not.

## Q10. Sources that separate seeing spend from having the power to stop it

- **S0** (incident bullets): the dashboards lacked the authority to stop the spend. [Substack](https://linas.substack.com/p/ai-agent-loop-governance) [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
- **W11a** ("Managing token usage"): usage is shown; agents can be stopped only through `/workflows`. [claude](https://claude.com/blog/getting-started-with-loops)
- **W11b** ("Check status"): spend is shown, but turns are what bound the goal. [claude](https://code.claude.com/docs/en/goal)
- **W9a** ("Loops nobody starts"): limits should be fields, not hopes written into a prompt. A limit stops the loop; it does not judge the work. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- **W12** (Table 2): budgets are declared, but enforcement is invisible. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **W13** (§6.2): Pi has no cost kill switch. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)

**Summary.** Five sources draw this distinction. Only W9a and W13 describe an enforced limit.

# 03-inner-outer-loops.md

## Q11. W2: inner and outer loop, four loops, statistics

**Quotation.** "Engineers own the outer loop." (Osmani, 15 July 2026) [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)

**Inner and outer.**
- Agents run the inner execution loop: investigation, implementation, verification. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
- Engineers own the outer loop: the agency to decide, verify, approve and own. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)

**The four loops a human sits in (back-pressure passage).**
- Constraints. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
- Sampling. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
- Audit. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
- Ownership. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)

**Statistics.** I opened none of the origins, so none is checked.

| W2's figure | Attributed to |
|---|---|
| 42% of committed code is AI-assisted | Sonar | [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
| Review is the bottleneck | GitLab | [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
| Nearly three-quarters accepted wrong AI answers | Wharton | [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
| Comprehension 50% vs 67% | Anthropic RCT | [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
| Hour-scale delegation | OpenAI | [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)

**Summary.** Agents work the inner loop and humans own four outer loops. The statistics are unverified.

## Q12. W9: open, closed, inner, outer, gate, background loop

**Quotation.** "\"Closed loop\" means feedback, not \"no human\"." (Hamada, 6 November 2026) [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)

**Definitions.**
- **Open:** nothing returns to the agent. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- **Closed:** check failures return to the agent. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- **Inner:** seconds to minutes. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- **Outer:** contains inner loops and crosses a boundary such as review, a schedule, a pull request or production. Hours to days. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- **Gate:** a check that only stops work. A loop sends work back. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- **Background loop:** started by a schedule or a webhook. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)

**Where it departs from W2** (my reading).
- W9a defines inner and outer by nesting, not by whether an agent or a person is involved. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
- W9a calls review a "gate", whereas W2 rejects the "release gate" framing.

**Summary.** The terms are defined by feedback and nesting rather than by who takes part.

## Q13. W10: three loops

**Quotation.** "So long as the human knows something the AI does not" (Ng, 26 June 2026) [deeplearning](https://www.deeplearning.ai/the-batch/three-key-loops-for-building-great-software)

**The three loops.**
- **Agentic coding:** minutes. [deeplearning](https://www.deeplearning.ai/the-batch/three-key-loops-for-building-great-software)
- **Developer feedback:** tens of minutes to hours. This one stays human because of the developer's context advantage. [deeplearning](https://www.deeplearning.ai/the-batch/three-key-loops-for-building-great-software)
- **External feedback:** hours to weeks. [deeplearning](https://www.deeplearning.ai/the-batch/three-key-loops-for-building-great-software)

**Summary.** Three nested loops on timescales of minutes, hours and weeks.

# 04-factories.md

## Q14. Shapiro's levels

**Quotations.**
- W7a: "It’s a black box that turns specs into software." (Shapiro, 23 January 2026) [simonwillison](https://simonwillison.net/2026/Jan/28/the-five-levels/) [danshapiro](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/)
- W7b: "Nobody reviews AI-produced code, ever." (Willison, 28 January 2026) [simonwillison](https://simonwillison.net/2026/Jan/28/the-five-levels/)

**The levels.** They are zero-indexed, so there are six. [simonwillison](https://simonwillison.net/2026/Jan/28/the-five-levels/)

| Level | Shapiro (W7a) | Willison (W7b) |
|---|---|---|
| 0 | Your parents' Volvo | Spicy autocomplete |
| 1 | AI intern | Coding intern |
| 2 | Junior buddy | Junior developer |
| 3 | Safety driver reviewing diffs | Developer |
| 4 | Robotaxi; you are a PM | Engineering team |
| 5 | Black box; "Dark" (as in Fanuc's dark factory) | Dark software factory |

**Where the names appear.** The level names appear only in Willison's list. I did not inspect Shapiro's images, so whether the names appear in them is **not established**.

## Q15. W3: factories and the rule for running without review

**Definitions.**
- **Software factory:** harnessed loops plus a queue plus a review gate, with humans owning the whole. [addyosmani](https://addyosmani.com/blog/software-factories/)
- **Light factory:** humans stay in the loop. [addyosmani](https://addyosmani.com/blog/software-factories/) [addyosmani](https://addyosmani.com/blog/software-factories/)
- **Dark factory:** code no human has read. [addyosmani](https://addyosmani.com/blog/software-factories/) [addyosmani](https://addyosmani.com/blog/software-factories/)
- **Lit factory:** human judgement moved upstream. [addyosmani](https://addyosmani.com/blog/software-factories/)

**Rule (section "What earns a loop the dark").** A loop may go dark only if its check is cheap, high-frequency and hard to fake, answers immediately, and does not drift. Loops should be short: agents hold up for 3 to 10 steps and lose the thread after 20. [addyosmani](https://addyosmani.com/blog/software-factories/)

**Origin of the rule.**
- Stated in W3's own voice.
- The step count is attributed to 12-factor factor 10 (not opened). [addyosmani](https://addyosmani.com/blog/software-factories/)
- The diagram and failure report are attributed to Horthy's talk (not opened). [addyosmani](https://addyosmani.com/blog/software-factories/)
- The nightly cron that fixes one anti-pattern is attributed to a Horthy post (**not found**). [addyosmani](https://addyosmani.com/blog/software-factories/) [addyosmani](https://addyosmani.com/blog/software-factories/)

## Q16. W8: StrongDM

**Quotations.**
- W8a: "Code must not be reviewed by humans" (McCarthy, 6 February 2026) [strongdm](https://factory.strongdm.ai/) [strongdm](https://factory.strongdm.ai)
- W8b: "The loop runs until the holdout scenarios pass (and stay passing)" [strongdm](https://factory.strongdm.ai/principles)
- W8c: "Internal structure is treated as opaque." [strongdm](https://factory.strongdm.ai/techniques)
- W8e: "I hope these patterns can be put into play with a much lower spend." (Willison, 7 February 2026) [simonwillison](https://simonwillison.net/2026/Feb/7/software-factory/)
- W8f: "We’re not selling a product or service here." (navanchauhan) [ycombinator](https://news.ycombinator.com/item?id=46924426)

**Rules (W8a).**
- No code is written by humans. [strongdm](https://factory.strongdm.ai/) [strongdm](https://factory.strongdm.ai)
- No code is reviewed by humans. [strongdm](https://factory.strongdm.ai/) [strongdm](https://factory.strongdm.ai)
- Spend at least $1,000 per day on tokens per engineer. [strongdm](https://factory.strongdm.ai/) [strongdm](https://factory.strongdm.ai)

**Verifying without reading code.**
- Scenarios are kept outside the codebase, like a holdout set. [hyper](https://hyper.ai/en/stories/eb7b9cb01c2d0faabbebc97981a06997) [strongdm](https://factory.strongdm.ai)
- "Satisfaction" is the fraction of trajectories that pass. [hyper](https://hyper.ai/en/stories/eb7b9cb01c2d0faabbebc97981a06997) [strongdm](https://factory.strongdm.ai)
- A Digital Twin Universe clones Okta, Jira, Slack and Google services. [hyper](https://hyper.ai/en/stories/eb7b9cb01c2d0faabbebc97981a06997) [strongdm](https://factory.strongdm.ai)

**Team.** Three people: McCarthy, Jay Taylor and Navan Chauhan. The team was founded on 14 July 2025. [hyper +3](https://hyper.ai/en/stories/eb7b9cb01c2d0faabbebc97981a06997)

**Principles page.** Seed → validation harness → feedback, with "apply more tokens". [strongdm](https://factory.strongdm.ai/principles)

**Techniques page.** Six techniques. Code is treated as opaque, like model weights. [strongdm](https://factory.strongdm.ai/techniques)

**Willison's criticisms.** $20k per engineer per month, and "inhuman mistakes". [simonwillison](https://simonwillison.net/2026/Feb/7/software-factory/)

**Hacker News disputes.**
- No code was released. [ycombinator](https://news.ycombinator.com/item?id=46924426)
- The post is marketing for an acquisition. [ycombinator](https://news.ycombinator.com/item?id=46924426)
- Rust anti-patterns in the released code. [ycombinator](https://news.ycombinator.com/item?id=46924426)
- A hallucinated Docker image in the README. [ycombinator](https://news.ycombinator.com/item?id=46924426)
- The cost. [ycombinator](https://news.ycombinator.com/item?id=46924426)

## Q17. Horthy's lights-out experiment

**Quotation.** "Shipping unread code spells disaster within months." (Orosz, 15 July 2026) [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy) [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy)

**What happened (W15f).**
- From July 2025, no human reviewed the code. [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy) [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy)
- Four months later the system was abandoned. Opus 4.1 could not find a mis-routed primary key. [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy) [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy)
- Re-onboarding took three weeks. [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy) [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy)

**What he does now (W15f).** Slow nightly loops: four agents open four pull requests, and a person reads each one. [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy) [latent](https://latent.space/wiki/dex-horthy/)

**Reconciling the durations.**
- W3 gives "about four months". [addyosmani](https://addyosmani.com/blog/software-factories/) [addyosmani](https://addyosmani.com/blog/software-factories/)
- Snippets give "four or five months", "July–November 2025", and a hypothetical "3 months". [Substack +2](https://sprintanddrift.substack.com/p/tacit-knowing-slight-return)
- About four months (July–November 2025) is the best-supported figure.

# 05-swarms-and-gates.md

## Q18. "Refutation gate"

**Quotation (X21).** "Ask what’s wrong; refute mode only" (Praison, 19 June 2026) [mer](https://mer.vin/2026/06/kimi-k2-6-self-improving-loop-explained-300-agent-swarm-with-opus-4-8-verification/?amp=1)

**Where the exact phrase appears.**
- S0, 3 August 2026. [Substack](https://linas.substack.com/p/ai-agent-loop-governance) [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
- Undated or later snippets: misfitdev/frank-grimes, pavp/skillkit, a kaizen verifier, dev.to, ThakiCloud. [github +4](https://github.com/misfitdev/frank-grimes/issues/76)

**Where it does not appear.** W14, W12, W1–W11 and W17.

**Nearest equivalents.**
- **W14:** "promotion gate" and "mandatory empirical validation gate". [arxiv](https://arxiv.org/pdf/2604.19049v1)
- **X21:** an Opus "verify gate" over a Kimi swarm. [mer](https://mer.vin/2026/06/kimi-k2-6-self-improving-loop-explained-300-agent-swarm-with-opus-4-8-verification/?amp=1)
- **W12 §4.1:** an agent tries to refute each label. [arxiv](https://arxiv.org/pdf/2608.21884v2)

**Summary.** S0 is the earliest swarm use of the phrase found.

## Q19. W14: Refute-or-Promote

**Quotation.** "consensus among AI agents does not equal correctness" (Agarwal, April 2026) [arxiv](https://arxiv.org/pdf/2604.19049v1)

**Stages (§3).**
- **Candidate generation:** stratified hunters, each required to self-critique. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- **Stage A:** 1 creative and 2 adversarial agents. The adversaries see only the claim. A candidate survives only if it is not refuted. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- **Stage B:** 2 creative and 3 adversarial agents. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- **Stage C:** mandatory empirical validation, then recalibration of the CVSS score. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- **Stage D:** a cross-family critic. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- A human oversees the pipeline. [arxiv](https://arxiv.org/pdf/2604.19049v1)

**Numbers.**
- About 79% of about 171 candidates killed. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- 83% prospective kill rate (n=30). [arxiv](https://arxiv.org/pdf/2604.19049v1)
- Stage A ~63%; Stage B ~42%. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- 4 CVEs. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- About $250 in total. [arxiv](https://arxiv.org/pdf/2604.19049v1)

**Failures the paper reports.**
- A non-existent Bleichenbacher oracle, unanimously endorsed by 10 reviewers (80+ agents), killed by one test. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- A wolfSSL byte-order error. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- An lcms2 CVE resurrected by a human after being killed. [arxiv](https://arxiv.org/pdf/2604.19049v1)

**Limitations stated.**
- A single operator. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- No ablations. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- Recall not measured. [arxiv](https://arxiv.org/pdf/2604.19049v1)
- Nothing found autonomously. [arxiv](https://arxiv.org/pdf/2604.19049v1)

## Q20. Moonshot, Kimi K3 and vLLM

**Quotations.**
- W17h: "Freeze the Players, Train Only the Coach" [kimi](https://www.kimi.ai/help/agent/agent-swarm)
- W17f: "the world's first open 3T-class model" [kimi](https://www.kimi.ai/blog/kimi-k3) [huggingface](https://huggingface.co/moonshotai/Kimi-K3)
- W17c: "The full model weights will be released by July 27, 2026." [kimi](https://www.kimi.ai/blog/kimi-k3)
- W17g: "Hardware: At least 8x GB300." [vllm](https://recipes.vllm.ai/moonshotai/Kimi-K3)

**Swarm (W17h).**
- Up to 300 sub-agents and more than 4,000 tool calls. [kimi +2](https://www.kimi.ai/help/agent/agent-swarm)
- Introduced with K2.5 (Jan 2026), upgraded in K2.6 (Apr 2026), and now powered by K3. [kimi](https://www.kimi.ai/help/agent/agent-swarm) [kimi](https://www.kimi.ai/help/agent/agent-swarm)
- Trained with PARL; only the orchestrator is trained. [kimi +2](https://www.kimi.ai/help/agent/agent-swarm)

**Model card (W17f).**
- 2.8T total parameters, 104B activated. [kimi](https://www.kimi.ai/blog/kimi-k3) [huggingface](https://huggingface.co/moonshotai/Kimi-K3)
- 896 experts, 16 selected. [kimi](https://www.kimi.ai/blog/kimi-k3) [huggingface](https://huggingface.co/moonshotai/Kimi-K3)
- Context length 1,048,576. [kimi](https://www.kimi.ai/resources/kimi-k3-pricing) [huggingface](https://huggingface.co/moonshotai/Kimi-K3)
- "Kimi K3 License". I did not open the licence text. [huggingface](https://huggingface.co/moonshotai/Kimi-K3)

**vLLM recipe (W17g).**
- Default configuration: 8× B300. [vllm](https://recipes.vllm.ai/moonshotai/Kimi-K3)
- Minimum: 8× GB300, or 8× MI355X/MI350X. [vllm](https://recipes.vllm.ai/moonshotai/Kimi-K3)

**The subject article's claims.**
- "2.8-trillion-parameter" is consistent with Moonshot's pages. [kimi](https://www.kimi.ai/blog/kimi-k3) [huggingface](https://huggingface.co/moonshotai/Kimi-K3)
- "Late July" is consistent with the 27 July release date. [kimi](https://www.kimi.ai/blog/kimi-k3) [zentor](https://zentor.ai/blog/what-is-kimi-k3)

# 06-incidents-and-critics.md

## Q21. The $47,000 post (W16)

I did not open the post.

**From snippets.**
- **What happened:** agents looped for 11 days, at $47,000. Four LangChain agents communicating via A2A; two of them got stuck in a loop. [towardsai](https://pub.towardsai.net/we-spent-47-000-running-ai-agents-in-production-heres-what-nobody-tells-you-about-a2a-and-mcp-5f845848de33)
- **Weekly figures (republished):** $127, $891, $6,240 and $18,400. [Substack](https://todatabeyond.substack.com/p/we-spent-47000-running-ai-agents)
- **Who ran it, and how it was detected:** not established.
- **Publication date:** sources give 16 Oct 2025, 31 Oct 2025, 14 Nov 2025 and "Sep 13". Not established. [medium +3](https://medium.com/@kusireddy)

**Reconciling the figures.** The four weeks sum to $25,658 over about 28 days, so they do not reconcile with $47,000 over 11 days.

**Hacker News disputes, and whether it was promotional.** Not found.

## Q22. The $4,200 incident

**Earliest source found.** S0 itself. [Substack](https://linas.substack.com/p/ai-agent-loop-governance)

**Candidate (X20, snippet).** $4,200 over 63 hours. It does not match the duration or the other details. [medium](https://medium.com/@sattyamjain96/the-agent-that-burned-4-200-in-63-hours-a-production-ai-postmortem-d38fd9586a85)

**Searches run.**
- `coding agent "240 times" "$4,200" retried`
- `agent "three dashboards" spend "authority to stop" loop`

**Not run** (search budget exhausted): "240 retries", "retried 240 times", "observability is not enforcement", "dashboards vs enforcement", "no authority to stop".

**Origin: not found.**

## Q23. Critics

1. **Horthy** (W15f obs. 2–3, 12): unread code; benchmark-shaped training. [pragmaticengineer](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy)
2. **Willison** (W8e): cost; "inhuman mistakes". [simonwillison](https://simonwillison.net/2026/Feb/7/software-factory/)
3. **Osmani's own caveats** (W1, W3): verification, comprehension debt, cognitive surrender. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/) [addyosmani](https://addyosmani.com/blog/loop-engineering/)
4. **Huntley** (W6): senior engineers are needed; not suitable for existing codebases. [ghuntley](https://ghuntley.com/ralph/)
5. **Hacker News commenters** (W8f, W15i): no code released, code quality, cost, intent and subjective quality. [ycombinator](https://news.ycombinator.com/item?id=49023019) [ycombinator](https://news.ycombinator.com/item?id=46924426)
6. **Sceptics cited in W12** (O2, O5): "renamed cron job", tokenmaxxing, review fatigue. [arxiv](https://arxiv.org/pdf/2608.21884v2)
7. **Ng** (W10a): the developer's context advantage. [deeplearning](https://www.deeplearning.ai/the-batch/three-key-loops-for-building-great-software)
8. **Hamada** (W9a): self-checking lowers accuracy. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
9. **Agarwal** (W14): consensus is not correctness. [arxiv](https://arxiv.org/pdf/2604.19049v1)

# 07-conflicts-dependence-not-found.md

## Conflicts

- **Inner/outer:**
  - W2: agent vs human. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
  - W9a: nesting. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
  - W13: harness vs loop. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
  - W12: inner/outer *harness*. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Gate:**
  - W9a: stop-only. [dagu](https://dagu.sh/blog/loops-around-a-coding-agent)
  - W3: review gate and type gates. [addyosmani](https://addyosmani.com/blog/software-factories/)
  - W14: promotion and validation gates.
  - W1: never used.
- **Harness:**
  - W3: the walls around a loop. [addyosmani](https://addyosmani.com/blog/software-factories/)
  - W4: everything except the model. [addyosmani](https://addyosmani.com/blog/agent-harness-engineering/)
  - W13: seven subsystems. [arxiv](https://arxiv.org/html/2609.00006v1) [arxiv](https://arxiv.org/pdf/2609.00006v1)
  - W8a: validation harnesses. [strongdm](https://factory.strongdm.ai)
- **Back pressure:**
  - W6: rejection signals. [ghuntley](https://ghuntley.com/ralph/)
  - W3: autonomy no greater than what can be cheaply verified. [addyosmani](https://addyosmani.com/blog/software-factories/)
  - W2: back pressure as the means to stop and regulate agents. [addyosmani](https://addyosmani.com/blog/own-the-outer-loop/)
- **State/memory:** W1 uses "memory" in the prose and "State" in its table. [addyosmani](https://addyosmani.com/blog/loop-engineering/)
- **Who coined "harness engineering":** Trivedy (W4, X1) vs Hashimoto (W13). [addyosmani +3](https://addyosmani.com/blog/agent-harness-engineering/)
- **Four-loop taxonomy:** Anthropic (W11a) vs Osmani (per W12). [claude](https://claude.com/blog/getting-started-with-loops) [arxiv](https://arxiv.org/pdf/2608.21884v2)
- **Steinberger's word count:** "twelve" vs the sixteen words actually quoted.
- **Cherny's wording:** three different versions.
- **Horthy's duration:** three, four or five months.
- **$47,000:** the weekly sum does not match the total.

## Not found

- W5's paywalled items (six primitives, Ralph, the orchestrator).
- The original wording of the X posts and the video.
- All the harness-origin sources.
- A seven-file harness.
- W13 observations 11 and 13, and several recommendations.
- W2's statistics at origin.
- 12-factor agents and Horthy's cron post.
- W16.
- The $4,200 origin.
- The OCE skills.

## Dependence

- W7b summarises W7a.
- W8e quotes W8a. [simonwillison](https://simonwillison.net/2026/Feb/7/software-factory/)
- S0 builds on W5. [Substack](https://linas.substack.com/p/ai-agent-loop-governance)
- W12 notes that Greyling and HuaShu build on Osmani. [arxiv](https://arxiv.org/pdf/2608.21884v2)
- W4 synthesises Trivedy, HumanLayer and Anthropic. [addyosmani](https://addyosmani.com/blog/agent-harness-engineering/) [addyosmani](https://addyosmani.com/blog/agent-harness-engineering/)
- W3 depends on Horthy. [addyosmani](https://addyosmani.com/blog/software-factories/)
- X21 summarises Movez. [mer](https://mer.vin/2026/06/kimi-k2-6-self-improving-loop-explained-300-agent-swarm-with-opus-4-8-verification/?amp=1)
- The republished copies depend on W16.

# 08-source-index.md

- **W1** (https://addyosmani.com/blog/loop-engineering/): Q1, Q6, Q23. Defines loop engineering and memory/State.
- **W2** (https://addyosmani.com/blog/own-the-outer-loop/): Q7, Q11. Defines the outer loop and the four loops.
- **W3** (https://addyosmani.com/blog/software-factories/): Q7, Q15, Q17. Defines light, lit and dark factories.
- **W4** (https://addyosmani.com/blog/agent-harness-engineering/): Q7. Defines harness.
- **W6** (https://ghuntley.com/ralph/): Q3, Q8. Defines Ralph and back pressure.
- **W8** (https://factory.strongdm.ai/): Q16. Defines scenario and satisfaction.
- **W9a** (https://dagu.sh/blog/loops-around-a-coding-agent): Q12. Defines open, closed and gate.
- **W11** (https://claude.com/blog/getting-started-with-loops): Q4. Defines the loop types.
- **W12** (https://arxiv.org/abs/2608.21884): Q5. Gives a working definition.
- **W13** (https://arxiv.org/html/2609.00006v1): Q7–Q9. Defines the subsystems.
- **W14** (https://arxiv.org/pdf/2604.19049v1): Q19. Defines kill mandate and CMC.
- **W17** (https://huggingface.co/moonshotai/Kimi-K3): Q20.

# 09-vocabulary.md

| Term | Source | Meaning |
|---|---|---|
| loop | W1 | A recursive goal |
| loop | W11a | Repeated cycles until a stop condition | [claude](https://claude.com/blog/getting-started-with-loops)
| harness | W3 / W4 / W13 | The walls around a loop / everything except the model / seven subsystems |
| inner/outer | W2 / W9a / W13 | Agent vs human / nesting / harness vs loop |
| gate | W9a / W3 / W14 | Stop-only check / review gate / promotion gate |
| back pressure | W6 / W3 / W2 | Rejection signals / limit on autonomy / stop and regulate |
| dark | W7a / W3 | Level 5 / no human reads the code |
| swarm | W17h | An orchestrator with up to 300 sub-agents |

# 10-self-check.md

- **Links:** all are full https URLs.
- **Status:** every source has an opened status.
- **Coverage:** questions 1–23 are each answered or marked "not found".
- **Quotations:** at most one per source, each under 15 words.
- **No comparison or advice:** the report contains none.
- **OCE skills:** they were unreadable and were not applied.
- **Enrichment:** the enrichment step failed because of the draft-length limit.