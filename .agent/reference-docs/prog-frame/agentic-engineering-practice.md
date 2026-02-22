# Progression Application: The Agentic Engineering Practice

**Applicant**: Jim Cresswell, Principal Engineer
**Progression category**: Develop a new capability
**Level**: 1

## What I want to achieve

**Situation**: The software industry is undergoing a transformation in how code is produced. Generative AI can now produce large volumes of sophisticated code, but without significant guardrails and human oversight it can also introduce subtle defects, create security vulnerabilities, and heighten reputational risk at scale. Oak's engineering function needed to navigate this transformation proactively — not by writing policy documents about AI, but by building the actual infrastructure for safe, high-quality human-AI collaboration and demonstrating it through real product delivery.

**Task**: Develop a new capability that Oak does not currently have: a complete, working system of principles, structures, specialist AI reviewers, quality gates, and tooling that governs how human engineers and AI agents collaborate on production code. This is not an improvement to an existing process — no such process exists. It is the creation of a new discipline: the **Agentic Engineering Practice**.

**Action**: Design and build the practice from first principles through real product work (the Oak MCP Ecosystem — SDK, MCP servers, semantic search). Every component was created to solve a concrete problem encountered during delivery: rules to prevent repeated mistakes, sub-agents to provide specialist review, plans to organise multi-step work, institutional memory to preserve learning across sessions, quality gates to enforce standards without exception, and platform bindings to make it all discoverable through use.

**Result**: A self-reinforcing system that is documented (ADR-119), mapped (`.agent/directives/practice.md`), and operational. The practice governs all work on the oak-mcp-ecosystem repository. As the repository becomes public and Oak's product engineers begin working on it, the practice is the mechanism by which they will be enabled to deliver safely and at increased velocity using AI tools — it teaches itself to every new developer and AI agent that enters the codebase. The act of creating the practice, naming it, documenting it, and making it self-teaching *is* the act of enabling others.

**This is a new capability, not standard Principal Engineer work.** The progression framework asks: *"If my role were hired again, would the candidate be expected to already have this skill?"* The answer is no. A Principal Engineer is expected to ensure product and process quality, set architectural direction, and maintain specialist expertise. The practice goes beyond those responsibilities:

- **Product quality → novel discipline**: not improving an existing engineering process but defining one that did not previously exist — a system for safe human-AI collaboration, built from first principles
- **Architectural direction → meta-system design**: not setting direction for product code but designing the system that governs how all architectural decisions are made, reviewed, and learned from — including 13 specialist AI reviewers, a layered prompt design for those reviewers, and a reusable plan template system
- **Internal technical authority → enabling others at scale**: not maintaining expertise within Oak but creating the infrastructure through which other engineers — Oak's product teams and, through the open-source repository, engineers beyond Oak — can work safely and effectively with AI. Conceiving of the practice as a domain with a clear boundary is deliberately in service of making it generalisable and transferable to other repositories, both within Oak and beyond
- **Process improvement → self-improving system**: not continuous improvement of existing processes but the creation of a system that continuously improves itself through a learning loop (mistakes → napkin → distilled learnings → rules → work)

## How I will achieve and evidence it

The practice is built, operational, and evidenced through its outputs:

**System components delivered** (each with its own documentation, ADR where appropriate, and operational history):

- **Directives and rules** (`.agent/directives/`) — 7 directive documents governing all work: AGENT.md (entry point), rules.md (operational rules), practice.md (system map), testing-strategy.md, schema-first-execution.md, semantic-search-architecture.md, metacognition.md
- **Prompts** (`.agent/prompts/`) — 7 reusable prompt playbooks that provide domain context and operational guidance for specific types of work (e.g. semantic search sessions, grounding before a task, structuring task execution). Prompts are invoked by commands and reference plans — they are the operational layer between "start a task" and "do the work."
- **Commands** (`.cursor/commands/`) — 10 slash commands that initiate structured workflows: starting a session with grounding, creating plans, running quality gates, invoking reviewers, committing, stepping back to reflect, and consolidating documentation after work is complete. Commands invoke prompts, which reference plans — creating a predictable sequence from initiation to completion.
- **Specialist sub-agent reviewers** (`.cursor/agents/`, `.agent/sub-agents/`) — 13 AI reviewers (10 standard, 3 on-demand) covering code quality, 4 architecture perspectives, test quality, type safety, configuration, security, documentation, ground truth design, sub-agent design, and release readiness. Each reviewer has a definition (`.cursor/agents/`) and its prompt is built from reusable components and templates (`.agent/sub-agents/components/`, `.agent/sub-agents/templates/`) following a layered composition architecture (ADR-114).
- **Skills** (`.cursor/skills/`, `.agent/skills/`) — 12 specialised capabilities that encode domain knowledge and repeatable workflows: napkin maintenance (continuous session learning), distillation (extracting rules from accumulated learning), ground-truth design and evaluation (for search quality), authentication patterns, and more. Skills teach the AI agent how to perform specific complex tasks correctly.
- **Quality gates** — enforced at every step: type generation, build, type-check, lint, format, markdown lint, unit tests, integration tests, E2E tests, UI tests, smoke tests, secret scanning. All gates are always blocking — no gate is ever disabled or skipped.
- **Plan system** (`.agent/plans/`) — templates and reusable components (ADR-117), active/archive lifecycle, machine-readable progress tracking, roadmaps. Plans are executable work specifications with test-driven development phases and deterministic validation commands.
- **Institutional memory** (`.agent/memory/`) — napkin (session-level log of mistakes, corrections, and what works), distilled learnings (curated rulebook extracted when the napkin grows large). The learning loop converts experience into rules: work produces mistakes, the napkin captures them, distillation extracts patterns, and rules prevent repetition.
- **Experience records** (`.agent/experience/`) — 75+ qualitative records of shifts in understanding across sessions. Not what was done or what was achieved, but what the work was *like* — what shifted, what was surprising, what went differently from expectation. These are a form of institutional memory — a growing corpus that captures the qualitative dimension of human-AI collaboration over time, and will eventually be mined for deeper insights into how the practice evolves, what patterns recur, and where the collaboration model can improve.
- **Platform bindings** — always-applied workspace rules (`.cursor/rules/`), entry-point files for multiple AI platforms (AGENT.md for Cursor, CLAUDE.md for Claude, AGENTS.md for Codex, GEMINI.md for Gemini). These ensure the practice is discoverable regardless of which AI tool is used.
- **114 Architectural Decision Records** (numbered to 119) — every significant design choice documented

**The end-to-end workflow**: these components connect into a structured workflow. A command initiates a session with grounding. Prompts provide domain context. Plans specify the work with test-driven phases. Implementation happens under quality gate enforcement. Sub-agent reviewers provide specialist feedback. Documentation is consolidated after completion. The napkin captures what was learned. This sequence repeats, and the practice improves with each cycle.

**Evidence that the practice works:**

- The oak-mcp-ecosystem repository was built entirely under the practice's governance: a Curriculum SDK generated from the OpenAPI schema, two MCP servers (stdio + HTTP with OAuth), a semantic search system combining four ranking methods across seven data sources, core packages, and comprehensive documentation
- The practice is self-teaching: AI agents in new sessions discover how it works by following links from AGENT.md, with no external instruction
- The learning loop is active: mistakes captured in sessions are distilled into rules that prevent repetition in future sessions
- The repository is public and open-source, providing a live demonstration

**Support received**: No additional budget, staffing, or dedicated time was allocated. The practice was developed alongside and through normal product delivery work, using standard engineering tooling.

## Anticipated timescale

The work has been completed within approximately six months (September 2025 – February 2026), consistent with Level 1 progression. The practice evolved through real product delivery rather than in a separate initiative:

- **Months 1–2**: Core rules and directives established; quality gates defined; first sub-agent reviewers created. Driven by immediate need — repeated mistakes in AI-assisted coding required codified guardrails.
- **Months 3–4**: Plan system and templates developed; institutional memory (napkin/distilled learnings) introduced; reviewer roster expanded to 13 specialists. The learning loop became operational — mistakes were being captured and converted into rules within sessions.
- **Months 5–6**: Practice named, documented (ADR-119, practice.md), and wired into onboarding. The system reached a stable, self-teaching state — new AI agents can discover how it works by following links from the entry point, with no external instruction.

## Impact for Oak

**Strategic alignment**: [Oak's stated mission](https://www.thenational.academy/about-us/who-we-are) is to *"improve pupil outcomes and close the disadvantage gap by supporting teachers to teach, and enabling pupils to access, a high-quality curriculum."* Oak has also publicly stated that it is *"exploring how we can help teachers reduce their lesson planning workload using AI."* This work contributes directly to both. The practice ensures that AI-enabled infrastructure (SDK, MCP servers, search) — which makes Oak's curriculum accessible to AI-powered educational services — is produced safely and to a high standard. That infrastructure itself is designed to boost innovation and quality in the education technology sector: the SDK and MCP servers lower the cost of building AI-powered curriculum tools for developers across the UK and globally, directly enabling the ecosystem through which teachers' workloads can be reduced. The practice governs the production of tools that themselves enable innovation — the impact compounds.

**Value delivered**:

- A single engineer, working with AI under the practice's governance, produced the entire oak-mcp-ecosystem: SDK, two MCP servers, semantic search, core packages, 114 ADRs, and the practice itself. This demonstrates a sustainable model for high-output, high-quality engineering with small teams.
- As the repository becomes public and Oak's product engineers contribute to it, the practice is the mechanism by which they will deliver safely at increased velocity using AI tools — without compromising on quality. The self-teaching property means no separate training or onboarding programme is needed; the practice teaches itself to each new contributor.
- The practice is deliberately framed as a transferable pattern with a clear conceptual boundary. The patterns established here — the learning loop, the sub-agent review system, the command-prompt-plan workflow, the quality gate discipline — are generalisable to other repositories within Oak and to other organisations. The open-source repository makes both the practice and its products (SDK, MCP servers, search) available to the education technology sector and the wider public sector.

**Impact through three orders of effect**:

The impact of this work is designed to compound. The initial investment — building the practice — produces effects at three successive orders, each magnifying the leverage of the one before:

1. **First order (delivered)**: the practice has enabled a single engineer, working with AI, to produce the entire oak-mcp-ecosystem safely and to a high standard. This is the direct, immediate benefit — increased velocity and quality for the person who built it.

2. **Second order (imminent)**: as the repository becomes public and Oak's product engineers begin contributing, the practice will enable them to work safely and at increased velocity with AI tools, without compromising on quality. The self-teaching property means no separate training is needed — each new contributor is guided by the practice from their first session. Separately, as the SDK and MCP server packages are published on npm, external developers will gain typed, validated access to Oak's curriculum data, lowering the cost of building AI-powered education tools.

3. **Third order (the leverage point)**: those external developers will build new systems — AI-powered curriculum tools, teacher-facing products, educational services — and *those* systems will have a direct impact on teaching quality and pupil outcomes at scale. This is where the leverage of the initial investment is maximised and hugely magnified: the practice governs the production of infrastructure that enables others to build things that change outcomes for teachers and children.

Oak's mission is to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach. The third-order effect is where this work connects most powerfully to that mission — not through what it delivers directly, but through what it enables others to build.

**Sustainability**: The practice is self-sustaining by design. The learning loop means it improves through use without external maintenance. The self-teaching property means new engineers and AI agents can adopt it without training. Because the practice is conceived as a transferable pattern with a clear conceptual boundary, it can be adopted in other Oak repositories as the organisation scales its use of AI-enabled engineering.

**How this prepares Oak for future changes**: The AI transformation of software engineering is accelerating. Oak now has a working, tested, documented approach to managing that transformation — not as a policy aspiration but as operational infrastructure. When AI capabilities change (and they will), the practice provides the framework for adapting safely.
