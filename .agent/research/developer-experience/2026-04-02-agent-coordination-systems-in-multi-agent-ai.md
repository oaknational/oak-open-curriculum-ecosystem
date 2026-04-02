# Agent Coordination Systems in Multi‑Agent AI

Normalised copy on 2 April 2026 from the sibling Markdown, DOCX, and PDF
exports under `.agent/research/developer-experience/novel/`.
This version preserves the source wording and structure as closely as
possible. Changes are limited to citation-link recovery, export-artefact
removal, and light markdown cleanup. For a report-style consolidation of the
same source material, see
[`2026-04-02-agent-coordination-systems-in-multi-agent-ai-consolidated.md`](./2026-04-02-agent-coordination-systems-in-multi-agent-ai-consolidated.md).

## Executive overview

Agent coordination as practiced in 2024–2026 is best understood as a **convergence of three historically separate traditions**: (i) classical multi‑agent systems (MAS) coordination theory (communication languages, negotiation protocols, blackboards, joint intention), (ii) distributed systems/workflow execution (state machines, event logs, checkpointing, durable execution), and (iii) LLM tool-use loops (function/tool calling, multimodal perception, and probabilistic routing). [[1]](https://eprints.soton.ac.uk/252090/1/KE-REVIEW-8-3.pdf)
Across today’s ecosystem, “multi‑agent” most often means **multiple LLM-driven roles** coordinated by either (a) an explicit workflow runtime (graphs/supersteps/events), or (b) a “group chat” controller that chooses the next speaker and stops when a termination condition is met. The dominant engineering reality is **centralized orchestration with optional parallelism**, not decentralized autonomy. Examples are explicit in modern docs: LangGraph’s Pregel-inspired superstep runtime, state schema, checkpoints, and interrupts; Microsoft Agent Framework workflows executed in supersteps with checkpoints; and Google ADK’s workflow agents and (in ADK 2.0) graph-based workflows marketed as enabling more deterministic processes. [[2]](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
A second convergence point is **standardization at tool/context boundaries**. Two protocols stand out:

- **MCP** (Model Context Protocol) standardizes how hosts/clients/servers exchange tools, resources, and prompts over JSON‑RPC 2.0, explicitly raising security/consent concerns because it enables arbitrary data access and code execution. [[3]](https://modelcontextprotocol.io/specification/2025-11-25)
- **A2A** (Agent2Agent) targets agent‑to‑agent interoperability across vendors/frameworks, exposing abstract operations via bindings (JSON‑RPC, gRPC, HTTP/REST) and positioning itself as complementary to MCP (agents collaborate via A2A; agents use tools via MCP). [[4]](https://a2a-protocol.org/latest/specification/)

The field is converging on a **small set of coordination primitives**:

- **Graph/state machine orchestration** with explicit routing plus checkpoint/interrupt semantics (LangGraph; Microsoft Agent Framework workflows; Google ADK graph workflows). [[5]](https://docs.langchain.com/oss/python/langgraph/use-graph-api)
- **Event-driven step orchestration** (LlamaIndex Workflows: “event-driven, async-first, step-based”). [[6]](https://github.com/run-llama/workflows-py)
- **Group-chat orchestration** with a manager selecting the next speaker (AG2 / AutoGen lineage; Semantic Kernel group chat patterns). [[7]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- **Handoff/routine orchestration** where “handoffs” are represented as tools and selected by the model, often framed as “transfer” between specialists (OpenAI Swarm; OpenAI Agents SDK; AG2 handoffs). [[8]](https://github.com/openai/swarm/blob/main/README.md)
- **Ledger/task-board orchestration** (Magentic‑One’s dynamic ledgers + orchestrator; related “task ledger” patterns in vendor design guides). [[9]](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf)

Where terminology is most confused/misleading:

- **“Swarm,” “society,” “crew,” “team,” “metamind”** are often used as affective branding for what is mechanically a **workflow, a chat manager, or a hierarchical delegator**. Swarm intelligence in the classical sense emphasizes decentralization, emergence, and distributed functioning; most LLM “swarms” have an explicit controller and shared thread. [[10]](https://books.apple.com/gb/book/swarm-intelligence/id873884933)
- “Autonomous” is frequently used to mean **“LLM chooses tools and routing”**, which is a form of probabilistic control—not autonomy in the MAS sense of independently acting toward delegated goals in an environment. [[11]](https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/imas//distrib/2up/lect02-2up.pdf)
- “Memory” blends at least three distinct mechanisms: (i) replayable execution state, (ii) conversational context storage and compaction, and (iii) long-term knowledge stores. These are not interchangeable, and systems implement them differently. [[12]](https://docs.langchain.com/oss/python/langgraph/persistence)

## Research taxonomy

A useful taxonomy has to separate **artifact type** (framework vs protocol vs experiment) from **coordination mechanism** (graph vs chat manager vs blackboard). Below is a mechanism‑first taxonomy designed to be operational for architecture decisions.
**Taxonomy dimensions (minimum viable) and how to operationalize them**
**Category (what kind of artifact is it?)**

- **Orchestration runtime/framework**: provides APIs and control semantics for running multi-step/multi-agent programs (LangGraph, LlamaIndex Workflows, CrewAI Flows, Microsoft Agent Framework workflows, Google ADK workflow agents). [[13]](https://docs.langchain.com/oss/python/langgraph/use-graph-api)
- **Managed agent platform/service**: provides hosted infrastructure, governance, memory, connectors, deployment, monitoring (e.g., AWS Bedrock Agents action groups; Vertex AI Agent Builder; Microsoft Foundry Agent Service memory; IBM watsonx Orchestrate). [[14]](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_CreateAgentActionGroup.html)
- **Interoperability protocol**: defines cross-system communication boundaries (MCP; A2A). [[15]](https://modelcontextprotocol.io/specification/2025-11-25)
- **Research prototype / landmark experiment**: demonstrates a coordination or memory thesis, not a general production runtime (Generative Agents; Voyager; Magentic-One as both research + OSS reference system). [[16]](https://arxiv.org/abs/2304.03442)
- **Conceptual model (historical lineage)**: blackboard, contract net, joint intentions, BDI—often still explanatory for today’s “agent teams.” [[17]](https://i.stanford.edu/pub/cstr/reports/cs/tr/86/1123/CS-TR-86-1123.pdf)

**Coordination primitive (what really coordinates?)**

- **Graph with explicit state transitions** (nodes/edges; conditional routing; sometimes bulk-synchronous “supersteps”). [[18]](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
- **Event-driven step pipeline** (steps emit/consume events; shared context; async-first). [[6]](https://github.com/run-llama/workflows-py)
- **Chat manager + speaker selection** (“group chat orchestration,” “selector,” “round-robin,” etc.). [[19]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- **Handoff as a tool call** (model chooses transfers; handoff represented as a tool function). [[20]](https://openai.github.io/openai-agents-python/handoffs/)
- **Shared blackboard / shared state** (specialists opportunistically contribute partial solutions to a shared store under a moderator). [[21]](https://i.stanford.edu/pub/cstr/reports/cs/tr/86/1123/CS-TR-86-1123.pdf)
- **Market/negotiation protocol** (contract net bidding/awarding). [[22]](https://www.reidgsmith.com/The_Contract_Net_Protocol_Dec-1980.pdf)
- **Population/ensemble/debate** (multiple instances generate candidates, debate, vote, or self-consistency aggregate). [[23]](https://arxiv.org/abs/2305.14325)

**Authority model (who has control?)**

- **Centralized orchestrator** (single controller picks next action/agent; others are subordinate tools). This is explicit in chat-manager patterns and in systems like Magentic-One (Orchestrator directs specialists). [[24]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- **Hierarchical manager–worker** (manager assigns tasks; workers execute; manager validates). CrewAI’s hierarchical process requires a manager LLM/agent. [[25]](https://docs.crewai.com/en/concepts/processes)
- **Peer-to-peer federation** (agents discover/negotiate/coordinate via protocol; authority is negotiated, not assumed). A2A is explicitly designed for this class. [[26]](https://a2a-protocol.org/latest/specification/)
- **Decentralized emergent** (no leader; coordination emerges from local rules). This is common in classical swarm intelligence writing, but rare in mainstream LLM agent frameworks. [[27]](https://books.apple.com/gb/book/swarm-intelligence/id873884933)

**State model (what is “the state of execution”?)**

- **Typed global state + reducers** (LangGraph state schema with reducers for concurrent updates). [[28]](https://7x.mintlify.app/oss/python/langgraph/graph-api)
- **Session state dictionaries with scoping** (ADK session/state; explicit guidance to update through specific mechanisms for trackable/persistent state). [[29]](https://google.github.io/adk-docs/sessions/state/)
- **Workflow checkpoint snapshots** (Microsoft Agent Framework checkpoints capture executor states/messages/shared states end-of-superstep). [[30]](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)
- **Conversation transcript state** (group chat frameworks often treat the shared conversation log as the state; selection policies operate over it). [[19]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)

**Memory model (what persists across time?)**

- **Checkpointed execution state** (resume/fork/replay from checkpoints; “time-travel”). [[31]](https://docs.langchain.com/oss/javascript/langgraph/use-time-travel)
- **Session memory for conversation history** (OpenAI Agents SDK sessions; ADK session memory vs long-term memory service; Foundry long-term memory). [[32]](https://openai.github.io/openai-agents-python/sessions/)
- **Long-term knowledge stores / retrieval memory** (explicit memory services, vector DB integrations, or platform-managed memory). [[33]](https://google.github.io/adk-docs/sessions/memory/)
- **Skill libraries** (Voyager’s executable code skill library; a durable behavioral repertoire). [[34]](https://arxiv.org/abs/2305.16291)
- **Reflection summaries** (Generative Agents’ reflection/planning architecture builds higher-level reflections from experience). [[35]](https://arxiv.org/abs/2304.03442)

**Execution model (how does it run?)**

- **Synchronous sequential** (tasks/steps executed one after another). [[36]](https://docs.crewai.com/en/learn/sequential-process)
- **Parallel or bulk-synchronous parallel (BSP) supersteps** (LangGraph explicitly uses supersteps inspired by Pregel; Microsoft workflows execute in supersteps and checkpoint at end). [[37]](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
- **Async event streams** (LlamaIndex Workflows positions itself as event-driven and async-first). [[6]](https://github.com/run-llama/workflows-py)
- **Streaming + long-running tasks** (A2A explicitly supports synchronous, streaming, and asynchronous push notifications for long-running tasks). [[26]](https://a2a-protocol.org/latest/specification/)

**Determinism of coordination**

- **Deterministic control flow with probabilistic substeps** (graphs where routing is explicit, but node outputs can vary because of LLM calls). LangGraph time-travel explicitly notes re-execution may produce different results. [[38]](https://docs.langchain.com/oss/javascript/langgraph/use-time-travel)
- **LLM-routed control flow** (speaker selection “auto,” or handoffs chosen by the model). [[39]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- **Hybrid** (rule/condition gating plus LLM content generation). [[40]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/context-variables/)

**HITL support (human-in-the-loop)**

- Interrupt/pause/resume (LangGraph interrupts; CrewAI pending-human states + resume endpoint; ADK ToolConfirmation workflows; MCP emphasizes user consent as an implementation responsibility). [[41]](https://docs.langchain.com/oss/python/langgraph/interrupts)

**Interoperability/protocol support**

- **Tool/context interop**: MCP server integration and capability negotiation. [[3]](https://modelcontextprotocol.io/specification/2025-11-25)
- **Agent-to-agent interop**: A2A protocol operations/bindings; explicit MCP relationship appendix. [[42]](https://a2a-protocol.org/latest/specification/)

**Maturity level**

- **Production OSS** (stable APIs, enterprise docs/governance): e.g., Agents SDK repos and docs; LangGraph docs; BeeAI under Linux Foundation governance (as stated by project). [[43]](https://developers.openai.com/api/docs/guides/agents-sdk/)
- **Preview/alpha workflow runtimes** (ADK 2.0 graph workflows explicitly labeled alpha). [[44]](https://google.github.io/adk-docs/workflows/)
- **Research reference systems** (Magentic-One, Generative Agents, Voyager). [[45]](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf)

## Comparative matrix

The matrix below is intentionally mechanism‑centric; “multi-agent” label is not treated as a category. Where a statement is based on public docs/repo text, it is cited; where it is an inference (e.g., “mostly centralized”), it is flagged as such.

### Representative orchestration runtimes and frameworks

| System | Artifact type | Real coordination primitive | Authority model | State + memory model | Execution + recovery | HITL | Interop signals |
|----|----|----|----|----|----|----|----|
| LangGraph (LangChain ecosystem) | Orchestration runtime | Graph + message passing in discrete “supersteps,” inspired by Pregel | Centralized in the runtime; decentralization is simulated via nodes/agents (inference grounded in explicit graph control) | Typed state schema with reducers; checkpoints per superstep; time-travel via checkpoints | Checkpoint-based persistence enables restart from last successful step; replay/fork “time travel”; re-execution after checkpoint may be non-deterministic if LLM calls differ | Interrupts pause and resume via persisted state | Not a protocol; integrates tools at app layer; commonly paired with tool schemas (function calling) |
| CrewAI | Orchestration framework | Task/process engine (sequential/hierarchical) + “Flows” with start/listen/router steps | Hierarchical process uses manager LLM/agent; otherwise sequential runner | Flow state; @persist for persistence; explicit “Pending Human Input” state in HITL guide | Persistence supports resuming after crash/human delays (as documented); workflow engine semantics otherwise app-defined | Webhook + resume endpoint for human review/feedback | Not a protocol; integrations via tools/connectors |
| OpenAI Agents SDK | Orchestration SDK | Tool-use loop + handoffs treated as tools; Runner executes runs and records traces | Centralized runner + model-selected tool calls/hand-offs | Built-in session memory for conversation history; RunContext for non-LLM-passed dependencies; trace/span model | Tracing records LLM/tool/handoff/guardrail events; durability beyond sessions is app-defined | Guardrails can block/validate; human approval patterns exist but are not a single universal mechanism | Tool calling; can integrate with external systems; protocol interop not the primary design center |
| Swarm (OpenAI sample repo) | Educational reference | Agents + handoffs as core abstractions | Explicitly handoff-driven; still centrally run in code | Stateless between calls in the core framing; meant to demonstrate patterns | Educational, not positioned as production library | Possible via custom handoff logic | No protocol stance; focuses on routines/handoffs pattern |
| AG2 (formerly AutoGen) | Orchestration framework | Group chat manager selects next speaker; handoffs + context variables for routing | GroupChatManager coordinates; speaker selection strategies include LLM “auto,” round-robin, random, manual | Context variables used for routing; agents can be initialized with prior chat_messages; “teachable agent” examples use a memory store | Execution is chat-loop; recovery/durability depends on how state is persisted externally (inference) | Human participation supported in the conversation modes | Protocol-agnostic; connects to many model providers and tools |
| Microsoft Agent Framework | Orchestration framework + workflow runtime | Workflows executed in supersteps; supports sequential/concurrent/group chat/handoff/magentic orchestration patterns | Central workflow runtime plus orchestrators (group chat managers, handoff orchestrations) | Checkpoints at end of each superstep capture executor state/messages/shared states; includes session-based state management | Checkpointing supports pause/resume across restarts (as documented); durable execution guarantees beyond checkpointing are not implied | HITL supported in workflows; also warns about third-party data flows | Explicit MCP server integration; notes integrations including A2A in overview |
| Google ADK | Orchestration framework | “Workflow agents” orchestrate sub-agents; ADK 2.0 adds graph-based workflows for more deterministic processes | Often hierarchical multi-agent patterns; workflow agents define control flow | Session/state plus long-term MemoryService; guidance for reliable, trackable, persistent state updates | Graph-based workflows (alpha) combine agents/tools/code nodes; determinism is a goal claim; production stability caveat in alpha notice | HITL via ToolConfirmation workflows (Java ADK announcement) and graph nodes for human input | Designed for compatibility; appears in Google’s broader agent platform stack |
| LlamaIndex Workflows / AgentWorkflow | Orchestration runtime | Event-driven, async-first, step-based workflows; AgentWorkflow as orchestrator for one or more agents | Central workflow driver; agents act as steps/tools | Shared context across steps; focus on observability; “AgentWorkflow coordinates between agents, maintaining state” | Async orchestration; recovery semantics depend on backend/persistence choices; observability emphasized | HITL possible via step definitions, but not the primary advertised primitive | Tool integration via app code; no dedicated interop protocol focus |
| BeeAI Framework | Agent framework | Event-driven middleware + constrained agents (rule-based governance) | Central runtime with constraints as governance layer | Emphasizes constraint enforcement and predictable behavior; Linux Foundation-hosted governance claim by project | Production-framed; specifics of durable checkpoints not its primary claim | Governance hooks and middleware can implement approvals; integrates with platforms | Integrates with MCP in ecosystem examples; A2A mentioned in project ecosystem repos (ecosystem-level signal) |
| smolagents (Hugging Face) | Agent library | Lightweight agent loops; includes examples for “orchestrate a multi-agent system” with a simple hierarchy | Typically hierarchical coordinator pattern in examples | Memory depends on user; emphasizes minimal abstractions | Primarily a library; durability/ops are user-defined | Depends on application | Ecosystem integration; not an interop protocol |

Sources: LangGraph supersteps/Pregel and state/reducers, checkpoints/time travel, interrupts/persistence. [[46]](https://docs.langchain.com/oss/javascript/langgraph/graph-api) CrewAI sequential/hierarchical processes, manager LLM, flows persistence and HITL/resume. [[47]](https://docs.crewai.com/en/learn/sequential-process) OpenAI Agents SDK primitives, handoffs-as-tools, sessions, tracing, guardrails. [[48]](https://developers.openai.com/api/docs/guides/agents-sdk/) Swarm repo purpose and primitives. [[49]](https://github.com/openai/swarm/blob/main/README.md) AG2 group chat manager/speaker selection and handoffs/context variables. [[50]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/) Microsoft Agent Framework overview + workflows/checkpoints/group chat. [[51]](https://learn.microsoft.com/en-us/agent-framework/overview/) Google ADK workflow agents, state/memory, graph workflows alpha. [[52]](https://google.github.io/adk-docs/agents/workflow-agents/) LlamaIndex Workflows repo and AgentWorkflow docs. [[53]](https://github.com/run-llama/workflows-py) BeeAI governance/constraints. [[54]](https://framework.beeai.dev/introduction/welcome) smolagents multi-agent example. [[55]](https://huggingface.co/docs/smolagents/v1.14.0/en/examples/multiagents)

### Managed platforms with public technical detail

| System | Coordination surface exposed | Coordination primitive | State/memory posture | Notes for coordination design |
|----|----|----|----|----|
| Agents for Amazon Bedrock | “Action groups” defining APIs + logic for calling them | Central agent chooses actions; action groups formalize tool surface | Configuration-driven; state is platform/session oriented | Action groups define callable actions; can include user input action group signature; coordination is mostly tool routing and prompt logic |
| Vertex AI Agent Builder | Suite for lifecycle (build/scale/govern) and supports using ADK or other frameworks | Platform-level orchestration + governance | Managed agent lifecycle; connects to Agent Engine sessions | Designed to host/scale agents; coordination details depend on chosen framework (ADK or others) |
| Microsoft Foundry Agent Service (preview) | Managed memory + agent infra for Agent Framework | Platform services backing orchestrated agents | Explicit long-term memory with extraction/consolidation and scoped stores | Strong emphasis on continuity across sessions/devices/workflows; memory is a first-class managed object |
| IBM watsonx Orchestrate | Multi-agent orchestration + tools/workflows/services | Platform-level orchestration | Enterprise governance; details partly product-specific | Coordinates specialized agents; tool/workflow integration is central |

Sources: Bedrock action groups. [[56]](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_CreateAgentActionGroup.html) Vertex AI Agent Builder overview. [[57]](https://docs.cloud.google.com/agent-builder/overview) Foundry memory. [[58]](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory) watsonx Orchestrate building agents and multi-agent orchestration note. [[59]](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=building-agents)

### Protocols and interoperability layers

| Protocol | Scope | Coordination primitive implied | Key mechanism | Security/governance posture |
|----|----|----|----|----|
| MCP | Model/tool/context interoperability | Tool/resource exchange; not agent-to-agent delegation | JSON‑RPC 2.0 messages between Host/Client/Server; capability negotiation; tool/resource/prompt features | Spec stresses user consent, data privacy, tool safety, and sampling controls; protocol can’t enforce—implementers must |
| A2A | Agent-to-agent interoperability | Delegation/collaboration between independent agents | Layered model: abstract operations mapped to protocol bindings (JSON‑RPC, gRPC, HTTP/REST); supports streaming + async notifications | Requires authentication/authorization/error mappings; positioning as complementary to MCP |

Sources: MCP architecture, features, JSON‑RPC basis, and security principles. [[3]](https://modelcontextprotocol.io/specification/2025-11-25) A2A introduction/goals, layered approach and bindings, streaming/async support, and MCP relationship appendix. [[4]](https://a2a-protocol.org/latest/specification/)

### Research prototypes and landmark experiments

| System | Central thesis | Coordination mechanism | Memory mechanism | Why it still matters to engineering |
|----|----|----|----|----|
| Magentic-One | Generalist multi-agent team outperforms monolithic baseline via orchestrator + specialists | Lead Orchestrator delegates to FileSurfer/WebSurfer/Coder/ComputerTerminal; uses structured ledgers; replans on errors | Working memory of progress (ledger) + environment state; evaluated via AutoGenBench | Concrete reference architecture for “manager with tool-specialists” + evaluation rigor concerns (side effects, isolation, repetition) |
| Generative Agents | Believable social simulation requires observation→reflection→planning architecture | Population of agents coordinate via environment interactions and emergent social behavior | Full record of experiences + reflections + retrieval for planning | Canonical “memory hierarchy” archetype influencing modern “reflective loop” and long-term memory designs |
| Voyager | Lifelong embodied learning is enabled by curriculum + skill library + iterative feedback prompting | Single agent loop coupled to environment; coordination across internal modules | Ever-growing skill library of executable code | Canonical design for “skill libraries” and environment feedback loops in agent systems |
| Multi-agent debate / self-consistency | Ensemble reasoning improves factuality/reasoning under some conditions | Multiple LMs propose, debate, vote, or select consistent answer | Implicit memory via conversation rounds; aggregation as the coordination primitive | Clarifies that “multi-agent” can be purely epistemic (ensembles) rather than labor division |

Sources: Magentic-One paper figure/intro and agent list; evaluation benchmarks and AutoGenBench contribution. [[60]](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf) Generative Agents architecture and reflection claims. [[35]](https://arxiv.org/abs/2304.03442) Voyager components and skill library. [[61]](https://arxiv.org/abs/2305.16291) Multi-agent debate and self-consistency. [[23]](https://arxiv.org/abs/2305.14325)

## Terminology and glossary

This glossary disambiguates terms by mapping them onto the taxonomy dimensions (coordination primitive, authority model, state/memory model). Where a term is used inconsistently in practice, the “misuse” column states the common failure mode.

| Term | Precise definition (mechanism) | Common usage in today’s ecosystem | Where it is vague/misleading | Taxonomy mapping anchor |
|----|----|----|----|----|
| agent | A system capable of autonomous action in an environment to achieve delegated goals; often formalized as mapping percepts to actions | Often means “LLM + tools + prompt” | Collapses autonomy, tool calling, and workflow steps into one word | Authority + action space; environment coupling |
| multi-agent system | Multiple decision-making agents interacting in a shared environment toward common or conflicting goals | Often means “multiple roles in one workflow/chat” | Treats “many prompts” as MAS even without genuine interaction/agency | Coordination primitive + shared environment |
| swarm | In classical swarm intelligence: decentralized, self-organized coordination with emergence and distributed functioning | Used as branding for handoff chains or agent teams | Often centrally orchestrated; not swarm intelligence in mechanism | Decentralized local rules vs centralized orchestrator |
| crew | A role-specialized team with assigned responsibilities and a process | Used for “N agents + tasks” frameworks | Often just a static task list; “roles” are mostly prompt templates | Role-based orchestration; usually hierarchical |
| team | Agents form joint plans/commitments, coordinate actions over time | Used loosely for any multi-agent setup | “Teamwork” in MAS has formal notions of joint intention/commitment | Joint intention / commitment models |
| society | Population-level behaviors, norms, and interactions in shared environment | Used for “agent swarms” and simulation | Often no explicit social mechanisms beyond shared chat log | Population / environment-coupled MAS |
| metamind | A meta-controller supervising other agents and revising plans (a “mind of minds”) | Used in marketing to imply emergent intelligence | Usually a single orchestrator or planner; “meta” is rhetorical | Central orchestrator + eval/repair loops |
| orchestrator | Component that selects next action/agent/step and maintains control state | Used for workflow engines, chat managers, and planners | Hides whether routing is deterministic or model-chosen | Authority model + routing mechanism |
| supervisor | A manager agent that delegates and validates | Used for hierarchical patterns and governance | Sometimes just a critic prompt, not an authority with enforcement | Manager–worker; validation gates |
| handoff | Transfer of control/context from one agent to another, often represented as a tool call | Widely used in Agents SDK, Swarm, and AG2 | Frequently implemented as “model calls transfer_to_X tool,” which is not necessarily safe or authenticated | Handoff primitive + tool calling |
| workflow | Explicit execution graph/sequence of steps, usually deterministic at control level | Used for graphs, DAGs, step pipelines | Many “agent workflows” are effectively scripts with LLM calls; “workflow” can hide lack of durable semantics | Graph/event-driven step orchestration |
| SOP | Standard Operating Procedure encoded as a procedural script for role interaction | Used heavily in MetaGPT-like “software company” systems | Often just prompt templates; procedural guarantees are weak unless enforced by runtime | Scripted role/process orchestration |
| blackboard | Shared repository updated opportunistically by specialist knowledge sources under a moderator/control shell | Often used metaphorically for “shared memory” | True blackboards include control strategies and opportunistic triggering; many “shared state” systems lack this | Shared-state + opportunistic activation |
| group chat orchestration | Multiple agents share one conversation thread; a manager selects the next speaker and stopping condition | Canonical in AutoGen/AG2 and Semantic Kernel patterns | Can be mistaken for decentralization; the manager is central authority | Chat manager + speaker selection |
| concurrent orchestration | Multiple agents/steps run in parallel, then results are merged | Used in workflow runtimes and design guides | Often limited by shared-state conflicts and non-deterministic merge logic | Parallel/superstep execution model |
| debate | Multiple agents propose/criticize iteratively to refine answer or reach consensus | Used for multi-agent reasoning ensembles | Sometimes a single-agent self-critique loop misnamed as debate | Ensemble reasoning coordination |
| reflection | Mechanism that synthesizes experience into higher-level memories/plans | Used in simulations and “self-improving” agents | Conflates introspective prompting with structured memory synthesis | Memory hierarchy + planning loop |
| skill library | Persistent repository of reusable behaviors (often executable code) that can be retrieved/composed | Used in embodied agents and coding agents | Often confused with “tools list”; skill libraries have learning/composition semantics | Long-term procedural memory |
| persistent memory | Storage that survives beyond a single run and can influence future behavior | Sessions, memory services, long-term stores | Often conflates conversation logs, embeddings stores, and checkpointed execution | Memory model (short-term vs long-term) |
| HITL | Human-in-the-loop controls that can pause/approve/override agent actions | Interrupt/approval/resume patterns | Sometimes reduced to “human can read logs,” which is not control | Governance + interrupts + resumption |
| MCP | Protocol for connecting LLM apps to tools/resources/prompts with capability negotiation | Tool connector standard | Mistaken as agent-to-agent protocol; it is primarily agent/tool boundary | Tool interoperability protocol |
| A2A | Protocol for agent-to-agent communication and task collaboration across systems | Inter-agent interop | Mistaken as “framework”; it is a protocol with multiple bindings | Agent interoperability protocol |

Sources: Agent and MAS definitions (Russell & Norvig; Wooldridge) and coordination foundations (Jennings). [[62]](https://people.eecs.berkeley.edu/~russell/aima1e/chapter02.pdf) Swarm intelligence framing (decentralization/emergence/distributed functioning) and contrast with Swarm repo mechanism. [[27]](https://books.apple.com/gb/book/swarm-intelligence/id873884933) Group chat orchestration definition and manager role. [[63]](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) SOP framing in MetaGPT. [[64]](https://github.com/FoundationAgents/MetaGPT) Blackboard definitions and “confusion” note in blackboard literature. [[65]](https://i.stanford.edu/pub/cstr/reports/cs/tr/86/1123/CS-TR-86-1123.pdf) Reflection/memory in Generative Agents. [[35]](https://arxiv.org/abs/2304.03442) Skill library in Voyager. [[34]](https://arxiv.org/abs/2305.16291) MCP and A2A specs. [[66]](https://modelcontextprotocol.io/specification/2025-11-25)

## Long-form literature review

### Classical coordination lineages and what they explain about today’s “agent teams”

Modern LLM multi-agent frameworks frequently rediscover three older coordination ideas—often without naming them—because these ideas are structural responses to the same underlying problem: **how to coordinate multiple specialized problem solvers under uncertainty**.
**Blackboard architectures** emerged to solve ill-defined problems by letting multiple specialist “knowledge sources” opportunistically contribute partial solutions to a shared repository, while a control component manages which specialist acts next. [[67]](https://stacks.stanford.edu/file/druid%3Ats923xj4709/ts923xj4709.pdf) This maps cleanly onto today’s shared-state orchestration runtimes: many frameworks maintain a single evolving state and allow specialized nodes/agents to post updates; the main difference is that the “knowledge source” is now often an LLM call. LangGraph’s explicit notion of a shared `State` with reducers for applying updates provides a concrete engineering analogue of a controlled blackboard, except its control strategy is explicit routing in a graph rather than opportunistic triggering. [[68]](https://7x.mintlify.app/oss/python/langgraph/graph-api)
**Contract net protocols** addressed distributed task allocation via negotiation: managers announce tasks; contractors bid; managers award contracts. [[69]](https://www.reidgsmith.com/The_Contract_Net_Protocol_Dec-1980.pdf) While few mainstream LLM frameworks implement contract-net bidding explicitly, the *shape* reappears whenever a manager agent decomposes work and assigns subtasks, particularly in hierarchical manager–worker patterns (for example, CrewAI’s hierarchical process with a manager model/agent) and in Magentic-One’s Orchestrator delegating work to specialized agents. [[70]](https://docs.crewai.com/en/concepts/processes) The crucial difference is that “bids” are typically replaced by **implicit selection**: the manager agent chooses a worker based on descriptions and conversation state rather than formal capability bids.
**Communication languages and interaction protocols** (KQML, FIPA ACL) were early attempts at interoperability among agents and knowledge-based systems. KQML explicitly framed “performatives” as operations agents perform on each other’s knowledge/goal stores, and positioned “communication facilitators” as coordination infrastructure. [[71]](https://dl.acm.org/doi/10.1145/191246.191322) FIPA produced families of specifications for message representations and communicative act libraries. [[72]](https://www.fipa.org/specs/fipa00071/XC00071B.pdf) The contemporary analogue is not the message semantics (which were heavy and hard to industrialize) but the renewed focus on **interoperability boundaries**: MCP for “agent ↔ tool/resource” interoperability and A2A for “agent ↔ agent” interoperability reintroduce protocolization, but with pragmatic binding to JSON-RPC/gRPC/HTTP and explicit security/auth expectations. [[73]](https://modelcontextprotocol.io/specification/2025-11-25)
A persistent conceptual tool from MAS theory is **joint intention / teamwork**: a team is not merely concurrent individual action but involves shared commitments and coordination norms. [[74]](https://philpapers.org/rec/COHT) This matters because many “agent teams” in LLM systems do not have stable commitments—only transient conversational alignment. In production architectures, this gap appears as brittle “handoffs” that lose accountability, unclear ownership of side effects, and ambiguous termination conditions.

### The LLM-era coordination shift: from message semantics to execution semantics

LLM-based agents invert historical emphasis. Classical ACL work cared deeply about **message meaning**. Modern agent systems care at least as much about **execution meaning**: what does it mean to resume, replay, fork, or recover when an LLM call is stochastic and tools have side effects?
LangGraph is explicit about this shift: it runs graph programs in discrete supersteps inspired by Pregel and uses checkpointers to store thread checkpoints; time travel means resuming from a checkpoint and re-executing nodes after it, which may yield different results because LLM calls and API calls can vary. [[75]](https://docs.langchain.com/oss/javascript/langgraph/graph-api) This is a key design boundary: **checkpointing is not determinism**, it is replayability of *state snapshots*, and the re-run semantics are inherently probabilistic if downstream steps are model-driven.
Microsoft Agent Framework converges on a similar execution model: workflows execute in supersteps and checkpoints are created at end-of-superstep, capturing executor states, pending messages, requests/responses, and shared states. [[30]](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints) This is strong evidence that agent coordination is inheriting workflow-runtime semantics from distributed systems rather than only conversational semantics from chat.
Google ADK is converging in the same direction. Its “workflow agents” are explicitly defined as components designed purely for orchestrating sub-agents’ execution flow, and ADK 2.0’s graph-based workflows are explicitly pitched as enabling “deterministic processes” by relying on structured node definitions rather than prompts alone, while warning the feature is alpha. [[76]](https://google.github.io/adk-docs/agents/workflow-agents/) The key conceptual move is to acknowledge that *enterprise coordination* wants explicit control paths; LLMs inhabit the nodes rather than define the graph.
LlamaIndex Workflows emphasizes an event-driven, async-first, step-based execution model, again aligning with workflow-engine patterns (shared context, events, steps), and separately provides AgentWorkflow as an orchestrator for systems of one or more agents. [[53]](https://github.com/run-llama/workflows-py) This again indicates convergence around *execution structure*.

### Group chat orchestration as “coordination by deliberation”

A parallel school treats a multi-agent system primarily as **a controlled deliberation**, where coordination is choosing “who speaks next” and “when to stop.” AutoGen’s central abstraction (in the widely cited early technical report) is a multi-agent conversation framework where agents can be LLMs, tools, or humans, and conversation patterns can be programmed using natural language and code. [[77]](https://arxiv.org/abs/2308.08155) AG2, as the lineage continuation, makes the chat manager explicit: a GroupChatManager selects an agent to speak, broadcasts messages, and repeats until termination; speaker selection methods include round-robin, random, manual, and LLM-driven “auto.” [[78]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
Semantic Kernel’s group chat orchestration pattern similarly describes a group chat manager that coordinates flow, chooses next responding agent, and can request human input. [[79]](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/group-chat)
Mechanistically, these are **centralized schedulers over a shared transcript**. Their central advantage is conceptual simplicity: you can treat the transcript as the blackboard and treat “next speaker selection” as the control strategy. Their central weakness is operational: unless the framework provides durable, replayable, externally persisted state transitions and explicit idempotency strategies, failures frequently degrade into “restart the conversation” or “replay the whole chat,” which is expensive and can multiply side effects.

### Handoffs and routines: coordination by transfer of responsibility

OpenAI’s Swarm makes “handoff” the central coordination primitive: the repo states Swarm “accomplishes this through two primitive abstractions: Agents and handoffs,” where an agent encompasses instructions/tools and can choose to hand off a conversation to another agent. [[80]](https://github.com/openai/swarm/blob/main/README.md) The OpenAI cookbook frames routines and handoffs as a simple, controllable way to orchestrate multiple agents and points to Swarm as a sample repository implementing these ideas. [[81]](https://developers.openai.com/cookbook/examples/orchestrating_agents/)
The OpenAI Agents SDK explicitly operationalizes this pattern for production use: handoffs “are represented as tools to the LLM” (e.g., a `transfer_to_refund_agent` tool), embedded inside the usual tool calling semantics. [[82]](https://openai.github.io/openai-agents-python/handoffs/) This is a profound architectural choice: it reuses the model’s tool selection mechanism as the *router*, which means routing is probabilistic by default unless constrained (through tool_choice, guardrails, policies, or external logic). [[83]](https://developers.openai.com/api/docs/guides/function-calling/)
AG2’s documentation likewise calls handoffs “the essential mechanism” controlling how agents interact and pass control in group chat, with context variables influencing routing. [[84]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/handoffs/)
The key tension here is **authority vs convenience**. Handoffs are attractive because they let developers compose specialists without writing explicit graphs. But because handoffs are often just another tool call, hard questions emerge:

- What is the formal meaning of “control transfer” if tool calls can fail?
- How do you enforce that only permitted handoffs occur?
- How do you authenticate that a handoff request is legitimate in a multi-process setting?

These are precisely the questions that protocols like A2A are attempting to address at an interoperability/security layer, by specifying authentication/authorization and standardized error handling across bindings. [[85]](https://a2a-protocol.org/latest/specification/)

### Workflow runtimes and the rise of checkpoint/interrupt as first-class coordination

In practice, coordination architecture becomes production-relevant when systems must support:

- **long-running processes**
- **safe pause/resume**
- **human approvals**
- **recovery after failure**
- **auditability and traceability**

LangGraph explicitly ties persistence/checkpointing to fault tolerance, human-in-the-loop workflows, and time-travel debugging; interrupts pause execution and “LangGraph saves the graph state using its persistence layer and waits indefinitely until you resume execution.” [[86]](https://docs.langchain.com/oss/python/langgraph/interrupts)
CrewAI documents analogous requirements at the workflow layer: Flows are framed as orchestrating steps, managing state, persisting execution, and resuming long-running workflows; persistence via `@persist` is explicitly linked to resuming after crashes or waiting for human input; the HITL guide presents a “Pending Human Input” state and a resume endpoint. [[87]](https://docs.crewai.com/)
Microsoft Agent Framework treats this as a core workflow feature set: workflows provide explicit routing, checkpointing, and HITL support; checkpoints occur at end-of-superstep and capture full workflow state. [[88]](https://learn.microsoft.com/en-us/agent-framework/overview/)
Google ADK similarly emphasizes structured state/state update mechanisms for “reliable, trackable, and persistent state management,” and ADK’s session/state/memory model split is explicitly documented (session/state as short-term; MemoryService as long-term). [[89]](https://google.github.io/adk-docs/sessions/state/)
The architectural pattern emerging here is that “agent coordination” is increasingly **workflow-engine design plus probabilistic compute nodes**. This drives a practical conclusion:
> If a framework cannot precisely state its resume/retry semantics in the presence of side effects, it is not an orchestration runtime; it is a scripting library.
The Magentic‑One paper reinforces this point from an evaluation perspective: it introduces AutoGenBench and explicitly motivates isolation and repetition controls because agentic benchmarks involve stochastic LLM calls and side effects of actions. [[90]](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf)

### Memory hierarchies: from “chat history” to operational state + long-term knowledge

The term “memory” is overloaded; the architecture-minded view separates at least three layers.
**Operational execution memory (checkpoint/state)** is about resuming programs. LangGraph checkpoints are “snapshots of graph state saved at each super-step,” and time travel is a debugger/undo/audit log that resumes from checkpoints. [[91]](https://docs.langchain.com/oss/python/langgraph/persistence) Microsoft workflows similarly define checkpoints as capturing executor states, messages, and shared state. [[30]](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)
**Conversation/session memory (short-term)** is about continuing dialogue without manual message plumbing. OpenAI Agents SDK sessions “automatically maintain conversation history across multiple agent runs.” [[92]](https://openai.github.io/openai-agents-python/sessions/) Google ADK’s docs explicitly separate session/state from long-term memory. [[93]](https://google.github.io/adk-docs/sessions/memory/)
**Long-term memory/knowledge** is about persistence of distilled facts/preferences and retrieval across sessions. Microsoft Foundry describes “managed, long-term memory” that extracts meaningful info from conversations, consolidates it into durable knowledge, and makes it available across sessions, with scoping for isolation. [[58]](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)
Research prototypes clarify how these layers can be composed. Generative Agents stores a complete record of experiences, synthesizes memories into higher-level reflections over time, and retrieves them to plan behavior; this is a sophisticated *memory hierarchy* that has influenced many “reflection” patterns. [[35]](https://arxiv.org/abs/2304.03442) Voyager’s skill library is a different kind of long-term memory: **procedural memory** as executable code that can be retrieved and composed in new environments, tied to an automatic curriculum and iterative feedback prompting. [[61]](https://arxiv.org/abs/2305.16291)
The engineering lesson is that “memory” should be specified precisely in architecture documents as:

- **what persists** (state snapshot, transcript, embeddings, skills)
- **when it is written** (end-of-step checkpoint, after run completion, on explicit commit)
- **how it is read** (deterministic load, retrieval query, summarization)
- **what invariants hold** (is it authoritative? can it be overwritten? is it scoped per user, per run, per agent?)

Without these, coordination bugs masquerade as “model issues.”

### Protocolization and interoperability: why MCP and A2A matter differently

MCP and A2A solve different problems and should not be conflated.
**MCP** standardizes the connector boundary: it defines hosts/clients/servers communicating via JSON‑RPC 2.0 with capability negotiation. It enumerates server features (resources/prompts/tools) and client features (sampling/roots/elicitation). [[94]](https://modelcontextprotocol.io/specification/2025-11-25) The spec is unusually explicit that it enables arbitrary data access and code execution paths and therefore requires robust user consent and tool safety considerations—while acknowledging the protocol cannot enforce them, only recommend implementation. [[95]](https://modelcontextprotocol.io/specification/2025-11-25)
**A2A** standardizes the agent boundary: it aims to let independent agents discover capabilities, negotiate modalities, manage collaborative tasks, and securely exchange information without access to each other’s internals. It is layered: abstract operations mapped to bindings (JSON‑RPC, gRPC, HTTP/REST) and supports synchronous, streaming, and asynchronous push notifications. [[26]](https://a2a-protocol.org/latest/specification/) The spec explicitly frames A2A and MCP as complementary: an A2A server agent may use MCP to interact with underlying tools to fulfill an A2A task. [[96]](https://a2a-protocol.org/latest/specification/)
The architectural implication is a potential future split between:

- **intra-application coordination** (graphs/workflows/group chat managers)
- **inter-application interoperability** (A2A for agent-to-agent; MCP for agent-to-tool/resource)

This resembles the historical split between in-process workflow engines and distributed RPC/service discovery, but adapted to agentic systems.

### “Swarm,” “society,” “crew”: mechanism vs metaphor

It is useful to interrogate marketing metaphors by asking: **what is the coordination primitive?**

- OpenAI “Swarm” (repo) is not swarm intelligence; it is handoff orchestration (agents + handoffs). [[80]](https://github.com/openai/swarm/blob/main/README.md)
- Classical swarm intelligence emphasizes distributed functioning and emergence rather than centralization; that is a different mechanism class. [[97]](https://books.apple.com/gb/book/swarm-intelligence/id873884933)
- MetaGPT explicitly frames itself as “software company as multi-agent system,” organized around SOPs (“Code = SOP(Team)”), which is primarily **scripted role/process orchestration** rather than emergent collective intelligence. [[64]](https://github.com/FoundationAgents/MetaGPT)
- ChatDev frames coordination as a “chat chain” dividing software lifecycle phases into subtasks for multi-turn communications. Mechanistically, it is a stage pipeline with a shared transcript and role prompts. [[98]](https://arxiv.org/html/2307.07924v5)
- CAMEL’s “society of agents” is a research framing around role-playing as a technique to elicit autonomous cooperation and generate conversational data, rather than a production runtime thesis. [[99]](https://arxiv.org/abs/2303.17760)

A useful practical heuristic is:
> If “swarm/society/crew” does not imply a specific execution and state model beyond “multiple prompts,” treat it as a UI metaphor, not an architecture.

### Evaluation: why coordination systems are hard to measure

Benchmarking agent coordination is difficult because coordination changes *interaction trajectories* with environments and tools, producing side effects, requiring isolation, and exposing variance from stochastic reasoning and model sampling.
Magentic‑One’s evaluation framing explicitly acknowledges this by introducing AutoGenBench and arguing for repetition, isolation, and strong controls over initial conditions, because benchmarks with side effects require containment. [[90]](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf)
The benchmarks cited in Magentic‑One (GAIA, WebArena, AssistantBench) illustrate distinct evaluation challenges:

- **GAIA**: real-world questions requiring reasoning, multimodality, web browsing, and tool use; paper reports large human vs tool-augmented model gaps in early baselines. [[100]](https://arxiv.org/abs/2311.12983)
- **WebArena**: realistic, reproducible web environment for language-guided agents to execute high-level commands via web interactions. [[101]](https://arxiv.org/abs/2307.13854)
- **AssistantBench**: realistic/time-consuming web tasks with automatic evaluation, focused on web-connected agents. [[102]](https://arxiv.org/abs/2407.15711)

These benchmarks test not only model capability but coordination architecture: whether the system can plan, recover from errors, maintain state, and avoid redundant actions.

### Synthesis: architectural families and the real tradeoffs

A compact synthesis is to treat contemporary systems as points in a design space:
**Explicit orchestration (graphs/workflows/events)** tends to maximize:

- controllability and debuggability (explicit routing and state snapshots) [[103]](https://docs.langchain.com/oss/python/langgraph/use-graph-api)
- pause/resume and HITL integration (interrupts/checkpoints/resume endpoints) [[104]](https://docs.langchain.com/oss/python/langgraph/interrupts)
- production observability/tracing (workflow runtime instrumentation) [[105]](https://openai.github.io/openai-agents-python/tracing/)

…but it pays in:

- higher engineering surface area (state schemas, reducers, event types) [[106]](https://7x.mintlify.app/oss/python/langgraph/graph-api)
- potential rigidity (graph updates require code changes and coordination discipline) [[44]](https://google.github.io/adk-docs/workflows/)

**Chat-manager orchestration (group chat, speaker selection)** tends to maximize:

- rapid composition of role-specialized prompts [[107]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- “deliberation” patterns (brainstorm, critique, debate) [[108]](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

…but it pays in:

- unclear semantics for state consistency and recovery (often transcript-only state) [[109]](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- weaker guarantees around side effects (tool actions embedded in chat loops) [[110]](https://developers.openai.com/api/docs/guides/function-calling/)

**Handoff/routine orchestration** maximizes:

- modular specialization and a simple mental model of transfer of responsibility [[111]](https://github.com/openai/swarm/blob/main/README.md)

…but it pays in:

- probabilistic routing and governance issues because handoffs are often tool calls selected by the model [[112]](https://openai.github.io/openai-agents-python/handoffs/)
- identity/trust gaps across boundaries (a motivation for protocols like A2A) [[26]](https://a2a-protocol.org/latest/specification/)

A major convergence is that the “best” production systems are hybrid: **explicit workflows for control + model-driven steps for flexibility**, plus observability and governance layers, plus (increasingly) protocol-based interoperability at boundaries.

## Open problems and research questions

This section highlights gaps and tensions that remain under-theorized or under-engineered, particularly where today’s systems rely on metaphor or best-effort practice rather than explicit semantics.
**Durable execution vs checkpointing is still unresolved**
Checkpointing (saving state snapshots at supersteps) is becoming common (LangGraph, Microsoft workflows), and it enables pause/resume and replay/fork debugging. [[113]](https://docs.langchain.com/oss/python/langgraph/persistence) But durable execution in the distributed-systems sense requires more: **automatic recovery, retry semantics, duplicate prevention, and defined idempotency/compensation strategies**. Workflow engines like Temporal explicitly frame “durable execution” as the ability for a workflow to continue despite crashes/outages by resuming in a new process/machine. [[114]](https://temporal.io/blog/reliable-data-processing-queues-workflows) The open research/engineering question is how to bring *durable execution guarantees* into agentic workflows where tool calls have side effects and LLM calls are stochastic.
**A formal semantics for “agent actions with side effects” is missing**
Benchmarks and evaluation harnesses increasingly acknowledge side effects and isolation needs (AutoGenBench’s isolation/repetition framing; web benchmarks requiring controlled environments). [[115]](https://microsoft.github.io/autogen/0.2/blog/2024/01/25/AutoGenBench/) Yet mainstream agent frameworks rarely define:

- a transaction model for tool actions
- compensation logic on failure
- audit-grade provenance for “why an action was taken” beyond traces

MCP emphasizes the risks: tool safety must treat tool descriptions as untrusted and require explicit consent for tool invocation. [[95]](https://modelcontextprotocol.io/specification/2025-11-25) That is a governance statement, but not a durable execution model.
**Interoperability is becoming real, but semantics remain shallow**
MCP standardizes the interface for tools/resources/prompts and explicitly borrows inspiration from LSP-style ecosystem interoperability. [[3]](https://modelcontextprotocol.io/specification/2025-11-25) A2A proposes a binding-neutral set of operations for agent collaboration with security and error mappings, and positions itself as complementary to MCP. [[42]](https://a2a-protocol.org/latest/specification/)
Open questions:

- How should an A2A agent declare *capabilities* in a way that supports safe delegation (beyond natural language descriptions)?
- How should identity, attestation, and policy be handled so handoffs/delegations are verifiable across organizations?
- Can we define a minimal shared “agent contract” analogous to OpenAPI for tools, but for agent tasks, constraints, and accountability?

**Centralization is the default; “true multi-agent” remains rare and under-evaluated**
Most systems that call themselves “swarms” or “societies” are architecturally centralized: a workflow runtime, a chat manager, or an orchestrator agent chooses next actions. [[116]](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) Classical swarm intelligence emphasizes decentralization and emergent coordination; this is a different architectural family. [[97]](https://books.apple.com/gb/book/swarm-intelligence/id873884933)
Open questions:

- What benchmark tasks *require* decentralized coordination rather than a central planner?
- How do we evaluate emergent coordination without collapsing it into “best prompt wins”?
- Can A2A-style federation enable meaningful peer-to-peer coordination, or will it still collapse into a “meta-orchestrator calling remote agents”?

**Terminology remains a technical debt**
The field’s overloaded metaphors (swarm, society, crew, orchestrator, memory) are not just linguistic issues; they cause mismatched expectations about determinism, accountability, and failure recovery.
Practical research challenge: define a **standard vocabulary** with testable properties:

- “resumable” (what is resumed—state, transcript, or both?)
- “durable” (which failure modes are handled automatically?)
- “deterministic orchestration” (is control flow deterministic or model-chosen?)
- “memory” (is it execution state, session history, or long-term knowledge?)

MCP’s spec-style language (RFC2119 MUST/SHOULD) is a model for how technical communities reduce ambiguity; similar rigor is largely missing for agent orchestration semantics. [[117]](https://modelcontextprotocol.io/specification/2025-11-25)
**Evaluation methodology is still catching up to coordination architecture**
Benchmarks like GAIA and WebArena force agents into realistic tool/environment interactions, but they conflate:

- model capability
- tool integration quality
- orchestration quality
- environment stability
- and operator policy (e.g., what actions are permitted). [[118]](https://arxiv.org/abs/2311.12983)

Open questions:

- How to create benchmarks that isolate coordination quality (routing, delegation, recovery) from base-model reasoning?
- How to measure “coordination overhead” (latency, token cost, tool calls) and reliability under perturbations?
- How to standardize evaluation harnesses so results are reproducible (AutoGenBench points in this direction). [[119]](https://microsoft.github.io/autogen/0.2/blog/2024/01/25/AutoGenBench/)

**Debate/ensemble patterns work, but why and when remains unclear**
Multi-agent debate can improve reasoning and factuality in some settings (multiple instances propose and debate). [[120]](https://arxiv.org/abs/2305.14325) Self-consistency improves chain-of-thought performance by sampling diverse reasoning paths and selecting the most consistent answer. [[121]](https://arxiv.org/abs/2203.11171) But these patterns are often integrated into frameworks as “just run multiple agents.” Under-theorized issues include:

- communication topology (sparse vs fully connected) affects performance [[122]](https://aclanthology.org/2024.findings-emnlp.427.pdf)
- aggregation method (vote vs debate) can dominate outcomes (an active research theme) [[123]](https://neurips.cc/virtual/2025/poster/116557)
- adversarial or collusive failure modes when agents share the same base model and priors

**Shortlist: what is most conceptually important vs most production-relevant**
Conceptually important (clarifies a mechanism class):

- Magentic-One (orchestrator + specialists + ledgers + evaluation harness framing). [[124]](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf)
- LangGraph (graph + supersteps + checkpoints + interrupts/time-travel). [[125]](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
- MCP + A2A (protocolization of tool and agent boundaries). [[66]](https://modelcontextprotocol.io/specification/2025-11-25)
- Generative Agents and Voyager (memory hierarchies; skill libraries). [[126]](https://arxiv.org/abs/2304.03442)

Production-relevant (explicit coordination semantics + operational hooks):

- LangGraph (checkpointing/interrupts/time travel). [[127]](https://docs.langchain.com/oss/python/langgraph/interrupts)
- Microsoft Agent Framework workflows (superstep checkpoints; multi-agent orchestration patterns). [[128]](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)
- Google ADK workflow agents (explicit control) and its state/memory layering; graph workflows where stability allows. [[129]](https://google.github.io/adk-docs/agents/workflow-agents/)
- OpenAI Agents SDK (handoffs-as-tools, sessions, tracing, guardrails). [[130]](https://openai.github.io/openai-agents-python/handoffs/)

**What looks multi-agent but usually isn’t**
A recurring anti-pattern is “multi-agent” systems that are actually:

- a fixed sequence of prompts with role labels (no dynamic routing, no explicit state/recovery) [[131]](https://docs.crewai.com/en/learn/sequential-process)
- a single agent doing self-critique under multiple names (no real decomposition) (inference; common in practice)
- a chat loop with multiple “agents” but one hidden central controller choosing all actions (group chat manager patterns are explicit about central coordination). [[132]](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

**Suggested reading order (mechanism-first)**

1) Protocol boundaries: MCP spec and security principles; A2A intro + MCP relationship appendix. [[66]](https://modelcontextprotocol.io/specification/2025-11-25)
2) Explicit workflow runtimes: LangGraph state/supersteps/persistence/interrupts/time travel; Microsoft workflows checkpoints; ADK workflow agents and graph workflows. [[133]](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
3) Chat-manager lineages: AutoGen report; AG2 group chat manager and speaker selection; Semantic Kernel group chat. [[134]](https://arxiv.org/abs/2308.08155)
4) Reference research systems and evaluation: Magentic-One + AutoGenBench; GAIA/WebArena/AssistantBench papers. [[135]](https://arxiv.org/abs/2411.04468)
5) Memory/skills archetypes: Generative Agents; Voyager. [[126]](https://arxiv.org/abs/2304.03442)

**Canonical bibliography pointers (grouped by category; non-exhaustive)**
Orchestration runtimes: LangGraph docs (graph API, persistence, interrupts, time travel). [[136]](https://docs.langchain.com/oss/python/langgraph/use-graph-api) CrewAI docs (processes, flows persistence, HITL). [[137]](https://docs.crewai.com/en/concepts/processes) Microsoft Agent Framework docs (overview, workflows, checkpoints). [[88]](https://learn.microsoft.com/en-us/agent-framework/overview/) Google ADK docs (workflow agents, state/memory, graph workflows). [[129]](https://google.github.io/adk-docs/agents/workflow-agents/) LlamaIndex Workflows repo/docs. [[138]](https://github.com/run-llama/workflows-py)
Protocols: MCP specification and repository. [[139]](https://modelcontextprotocol.io/specification/2025-11-25) A2A specification and MCP relationship appendix. [[140]](https://a2a-protocol.org/latest/specification/)
Landmark prototypes and evaluation: AutoGen report. [[141]](https://arxiv.org/abs/2308.08155) Magentic-One paper + AutoGenBench. [[142]](https://arxiv.org/abs/2411.04468) GAIA, WebArena, AssistantBench. [[143]](https://arxiv.org/abs/2311.12983) Generative Agents; Voyager. [[126]](https://arxiv.org/abs/2304.03442)
Classical coordination lineages: Contract Net protocol. [[22]](https://www.reidgsmith.com/The_Contract_Net_Protocol_Dec-1980.pdf) Blackboard systems (Nii; Hearsay-II). [[21]](https://i.stanford.edu/pub/cstr/reports/cs/tr/86/1123/CS-TR-86-1123.pdf) KQML and agent communication languages. [[144]](https://dl.acm.org/doi/10.1145/191246.191322)
