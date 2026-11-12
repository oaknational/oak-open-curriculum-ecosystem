# Commissioned report brief: primary-source reading for the loop-engineering baseline

As of 2026-11-12. Written for a Claude web session with open web access, run by the owner. The
session that wrote this brief could reach GitHub and almost no other host, so most of its baseline
rests on search summaries. This commission closes that gap by opening the pages themselves.

Paste everything below the line into the web session. If you hold the full text of the paid article,
attach it to the same message.

---

## Your task

Produce one research report, in Markdown, on a set of approaches to running AI coding agents in
loops. Read the sources listed below by opening each page. Report what each source says, in its own
words, with quotations and links.

The report will be merged into an existing evidence log by another session. It is read by someone
who will later compare these approaches with a different methodology. That later comparison needs an
account that describes these approaches and nothing else.

## Rules

1. **Describe; do not compare or advise.** No comparison with any other methodology, framework or
   product beyond the sources' own comparisons. No recommendations about adoption.
2. **Open the page.** Every claim comes from a page you opened in this session. Mark each source
   `opened` or `not opened`. A search snippet is `not opened`, and so is your own prior knowledge.
   State nothing from memory.
3. **Quote.** For each definition, list, rule and number, give the source's exact words in quotation
   marks, the URL, the author and the publication date shown on the page.
4. **Use the sources' vocabulary.** Where two sources use one word differently, record both
   meanings and keep them apart.
5. **Record absence.** When a page does not contain what a question asks for, write "not found in
   this source". When a page will not load, write that and move on.
6. **Count dependence.** Note when one source is quoting, summarising or republishing another.
7. **British spelling** in your own prose. Quotations stay as written.

## The subject article

Linas Beliūnas, "Loops at Scale: The Governance Layer Nobody Built Yet", Substack, 3 August 2026:
`https://linas.substack.com/p/ai-agent-loop-governance`. It is a paid post. Its free preview names
four topics: the harness as distinct from the loop, with a file structure, templates and a checklist
separating dashboards from enforcement; the split between an inner loop and an outer loop; a
light-factory and dark-factory framework for removing human review; and swarm architectures that
pair hundreds of parallel agents with "a single refutation gate", on open-weight models including
Kimi K3. It cites two incidents: two agents in a clarification loop for 11 days at $47,000, and a
coding agent that retried 240 times over 3 hours at $4,200 while three dashboards showed the spend.

**If the full article text is attached**, treat it as Source A and do Part 1. If it is not, skip
Part 1 and say so at the top of the report. Do not try to get past the paywall.

## Part 1: the article itself (only with the full text attached)

Quote, section by section:

- every heading, in order;
- the harness file structure and each template, reproduced in full;
- the checklist that separates dashboards from enforcement, item by item;
- the definitions of inner loop and outer loop, and who owns each;
- the light-factory and dark-factory framework: its criteria, levels or decision rule;
- the swarm architecture and the definition of the refutation gate;
- what it says about Kimi K3's licence and infrastructure;
- the source it gives for each of the two incidents, if any;
- every person, essay, paper or product it credits, with the link it gives.

## Part 2: the sources to open

Open each. Where a page has moved, find its current address and record both.

| Id | Source |
| --- | --- |
| W1 | Addy Osmani, "Loop Engineering": `https://addyosmani.com/blog/loop-engineering/` |
| W2 | Addy Osmani, "Own the Outer Loop": `https://addyosmani.com/blog/own-the-outer-loop/` |
| W3 | Addy Osmani, "Software Factories, Light and Dark": `https://addyosmani.com/blog/software-factories/` |
| W4 | Addy Osmani, "Agent Harness Engineering" (find it from his blog index) |
| W5 | Linas Beliūnas's earlier "Loop Engineering Guide" on `linas.substack.com` (find it; record whether it is free or paid) |
| W6 | Geoffrey Huntley's original Ralph post: `https://ghuntley.com/ralph/` |
| W7 | Dan Shapiro, "The Five Levels: from Spicy Autocomplete to the Dark Factory", January 2026 (find the original on his site), and Simon Willison's note: `https://simonwillison.net/2026/Jan/28/the-five-levels/` |
| W8 | StrongDM's software factory: their own page (`https://factory.strongdm.ai/` or the post "The StrongDM Software Factory: Building Software with AI") and Simon Willison's write-up of 7 February 2026 |
| W9 | Dagu, "Open, closed, inner, outer: the loops around a coding agent": `https://dagu.sh/blog/loops-around-a-coding-agent` |
| W10 | Andrew Ng's letter on three nested loops in The Batch, late June 2026 |
| W11 | Anthropic, "Loop engineering: Getting started with loops": `https://claude.com/blog/getting-started-with-loops` |
| W12 | "Loop Engineering: Building Blocks, Adoption, and Impact": `https://arxiv.org/abs/2608.21884` |
| W13 | "Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents": `https://arxiv.org/abs/2609.00006` |
| W14 | "Refute-or-Promote: Adversarial Stage-Gated Multi-Agent Review": `https://arxiv.org/abs/2604.19049` |
| W15 | Dexter Horthy on lights-out coding: the Heavybit "High Leverage" episode 12 page, and any written account by Horthy himself |
| W16 | The Medium post behind the $47,000 incident, credited to Teja Kusireddy, November 2025, and Hacker News item 45802430 |
| W17 | Moonshot's own material on agent swarms: `https://www.kimi.ai/features/agent-swarm`, the Kimi K3 model card on Hugging Face, and the vLLM recipe for Kimi K3 |
| W18 | The posts by Peter Steinberger (7 June 2026) and Boris Cherny that the term is traced to, at their original addresses |

## Part 3: the questions

Answer each from the opened sources. Give the quotation, then one or two sentences of your own.

**Loop engineering**

1. How does W1 define loop engineering? Reproduce its list of building blocks exactly, with each
   item's definition. Does it include state? Does it use the word "gate"?
2. What are the "six primitives" in W5? Reproduce the list. What does W5 say about the Ralph Wiggum
   pattern, the 14-step roadmap and the orchestrator model?
3. How does W6 define the Ralph technique? What does it say about stopping, cost and safety?
4. What loop types does W11 name, and what does each hand off? What does it say about budgets and
   stop conditions?
5. What did W12 measure, with what method, and what did it find? Reproduce the abstract.
6. What exactly did Steinberger and Cherny write, and on what dates (W18)?

**Harness**

7. How do W3, W4 and W13 each define "harness"? What parts does each list? Who do they credit with
   coining "harness engineering"?
8. Does any source give a harness file structure or templates? Reproduce it.
9. What does W13 list as its subsystems, observations and recommendations? Reproduce the abstract
   and the findings that concern permissions, budgets, stop conditions and loop sophistication.
10. Which sources separate observing an agent's spend from having the power to stop it? Quote them.

**Inner loop and outer loop**

11. How does W2 define the inner loop and the outer loop? Reproduce its four loops with their
    definitions. What evidence or statistics does it cite, and from where?
12. How does W9 define open, closed, inner and outer? Where does it disagree with W2?
13. What are the three loops in W10, with their timescales, quoted?

**Light factory and dark factory**

14. Reproduce Shapiro's levels from W7 exactly: number, name, description.
15. How does W3 define a software factory, a light factory and a dark factory? What rule does it
    give for when a loop may run without human review? Quote the rule.
16. What does W8 say StrongDM's rules are, how it verifies without reading code, what it spends, and
    how many people built it? What criticisms does Willison record?
17. What happened in Horthy's lights-off experiment (W15): dates, duration, what failed, what he
    does now?

**Swarms and the refutation gate**

18. Does any source use the phrase "refutation gate"? Search for it and report where it appears.
19. What does W14 propose, how does its gate decide, and what failure does the paper itself report?
20. What does Moonshot say (W17) about swarm size, how swarm behaviour is trained, and whether Kimi
    K3 supports it? What hardware does the vLLM recipe state as the minimum for Kimi K3?

**The incidents**

21. What does the original Medium post (W16) say: who ran the system, how many agents, what looped,
    the cost figures, how it was detected? What do the Hacker News commenters dispute?
22. Find the source of the second incident: a coding agent, 240 retries, 3 hours, $4,200, three
    monitoring dashboards. Report the earliest source found, or that none was found and which
    searches you ran.

**Disagreement**

23. Who argues against these approaches, or against running without human review, and on what
    grounds? Quote two or three named critics.

## The report's shape

Return one Markdown document with these sections, in this order.

1. **Header.** The date, whether the full article was attached, and how many of W1 to W18 were
   opened.
2. **Source register.** One row per source:

   ```text
   | Id | Title | Author | Published | URL opened | Opened? | Notes (moved, paywalled, republished from) |
   ```

3. **Part 1 answers**, if the article was attached.
4. **Answers 1 to 23.** Each as: the question number, the quotations with source ids, then your
   summary.
5. **Conflicts.** Where two sources disagree on a definition, a date or a number.
6. **Not found.** Every question or source that produced nothing, with what you tried.
7. **Dependence.** Which sources repeat which.

Keep quotations exact and complete enough to stand alone. Length is not a constraint; accuracy of
quotation is.
