# Editorial Voice for Technical Blogs

This file governs outward-facing technical articles that emerge from work in
this repository. It applies to blog stubs, full drafts, talks-in-prose, and
related public writing.

It is adapted from an adjacent editorial system, but the register here is
different. Those materials are identity-led. These articles are about ideas,
patterns, failures, mechanisms, and what this repo has learned through
practice.

Blog stubs are not internal docs. They are public technical essays with an
argument.

## Editorial lead

The human repository owner is the editorial lead for these articles. Agents may
propose, draft, and refine, but final editorial judgement lives there.

## Voice and register

**Confident, precise, reflective, and alive.** The writing should sound like
someone who has actually done the work, learned from it, and can now name what
matters without puffing it up.

The ideal voice has:

- **Confidence without swagger**: make clear claims when they are earned
- **Seriousness without heaviness**: the stakes are real, but the prose should
  still move
- **Warmth without softness**: be inviting and generous, not vague
- **Intellectual play without sloppiness**: name patterns boldly, but keep the
  reasoning disciplined

The target is not a neutral documentation voice, a sales voice, or a detached
academic voice. It is an essay voice: technically grounded, publicly legible,
and willing to think in the open.

## Audience

Assume the primary readers are:

1. Engineers and technical leads
2. Architects, staff engineers, and engineering managers
3. People actively working with AI agents, MCP systems, or rich toolchains
4. Curious peers from adjacent domains who will tolerate some complexity but
   should not need private repo context

Write for an intelligent reader who does not know this repo.

## The job of a post

Each post should do at least one of these well:

- name a pattern that lacks a crisp name
- challenge a common assumption
- make a subtle distinction that changes practice
- show how a mechanism worked in reality, not just in theory
- offer a field-level implication that is properly grounded

If a piece merely reports what changed in the repo, it is not a blog post yet.

## Core principles

### Thesis first

Every piece should have a sharp, arguable centre. The reader should be able to
answer "what is this really saying?" in one sentence.

Open with tension, not throat-clearing.

Better:

- "Continuity in agentic systems is an engineering property, not a memory
  feature."
- "A repository can function as shared working memory."

Worse:

- "As AI continues to evolve, many teams are exploring..."
- "In this post I want to share some thoughts about..."

### Show, do not justify

Carry over the strongest version of this principle, but adapt it to technical
argument.

Do not explain defensively why a choice was reasonable. Show what the mechanism
did, what it changed, and what it made possible. Trust the reader to follow the
implication.

Better:

- "The handoff prompt restored active plan state, branch state, and recent
  obligations in one pass."
- "The note pipeline preserved surprises that would otherwise have vanished into
  chat history."

Worse:

- "We decided to do this because we thought it might be useful..."
- "The intention here was basically to try to improve continuity..."

### Earn abstraction

These essays can become conceptual, but abstraction must be paid for with
concrete examples.

Move in this order:

1. friction or failure
2. mechanism or pattern
3. implication
4. open question

Do not begin with universal theory and hunt for examples afterwards.

### Name the thing cleanly

One of the repo's strengths is discovering distinctions. When a distinction is
real, state it cleanly and hold it consistently.

Examples:

- operational continuity vs epistemic continuity
- transcript storage vs shared working memory
- role separation vs retained understanding
- lineage order vs maturity

Avoid introducing two or three near-synonyms for the same concept in one piece.

### Keep the human in view

These are technical essays, but the centre of gravity is still human judgement,
collaboration, misunderstanding, correction, and learning.

Avoid writing as if the agent is the whole system. The interesting unit is
usually the human-agent-repo-practice system, not the model in isolation.

### Collaborative credit

Do not write as if every idea emerged fully formed from one agent or one
person. These pieces should reflect the real ecology of discovery: user
judgement, agent proposals, reviewer pressure, repo constraints, and feedback
from running systems.

Use confident authorship without false soloism.

Better:

- "Working in this repo surfaced a pattern..."
- "Through repeated handoffs, we found..."
- "The practice now distinguishes..."

Worse:

- "I single-handedly discovered..."
- "The agent realised..."

## What to optimise for

### Precision over hype

Avoid inflated language:

- revolutionary
- game-changing
- paradigm shift
- the future of software
- everything changes

If a claim is important, make it more precise, not louder.

### Clarity over insider shorthand

Internal names are useful evidence, but public writing should not depend on
them. Mention repo-specific artefacts when they help, then immediately explain
their role in plain language.

### Energy over flatness

Do not flatten the prose into safe corporate explanation. These essays can
carry rhythm, surprise, and a little mischief, so long as the argument stays
tight.

### Limits over overclaiming

A good technical essay says where its evidence comes from and where it may not
generalise yet. That does not weaken the piece; it makes the strong claims more
trustworthy.

## Evidence hierarchy

Use evidence in this order where possible:

1. **Lived repo evidence**: concrete work, failures, corrections, reviewer
   findings, practice changes
2. **Mechanistic explanation**: why the pattern plausibly works
3. **External references**: studies, articles, standards, or field examples
4. **Open questions**: what remains uncertain

Do not lean on external citations to compensate for a weak internal argument.

## Recommended article shape

Not every piece must follow this exactly, but it is the default shape for this
directory.

### 1. The live tension

What problem, contradiction, or repeated failure made this piece necessary?

### 2. The distinction or thesis

What is the cleanest version of the claim?

### 3. The mechanism

How does the thing actually work?

### 4. The evidence

What in this repo or practice makes the claim credible?

### 5. The broader implication

Why should someone outside this codebase care?

### 6. The limit or open question

Where does the claim stop being proven?

## Anti-patterns

Avoid these unless there is a very deliberate reason:

- **Documentation voice**: step-by-step explanation with no thesis
- **Changelog voice**: "we changed X, then Y, then Z"
- **Justificatory voice**: explaining why choices were sensible instead of
  showing their consequences
- **Anthropomorphic slippage**: talking as if a model has awareness, intent, or
  continuity when the claim really concerns external scaffolding
- **Thesis inflation**: jumping from one repo's pattern to a universal law
- **Keyword slurry**: stuffing in AI, agents, MCP, RAG, memory, and safety
  without a real conceptual spine
- **Abstract fog**: making philosophical claims without operational grounding

## House style for this directory

- British spelling and grammar
- Prefer active voice
- Prefer short paragraphs with a clear argumentative cadence
- Use headings that carry meaning, not generic labels where possible
- Use examples generously
- Use lists when they clarify distinctions; do not let the piece become a deck
- Keep jargon disciplined; define new terms the first time they matter

## How this differs from identity-led editorial guidance

Identity-led editorial guidance centres personal positioning, voice, and
representation. This file centres public technical argument.

Carry over:

- confidence
- seriousness with liveliness
- show, do not justify
- collaborative credit
- consistency of underlying worldview

Do not carry over directly:

- identity-led framing
- CV-style evidential self-presentation
- personal positioning language that belongs to another register rather than
  these essays

## Editorial test

Before considering a piece ready, ask:

- Is there a clear thesis?
- Has abstraction been earned by concrete evidence?
- Does the piece name a real distinction cleanly?
- Does it sound like lived practice rather than trend commentary?
- Is it public-facing rather than repo-insider prose?
- Is it confident without overclaiming?
- Would an intelligent reader finish with a sharper mental model than they
  started with?
