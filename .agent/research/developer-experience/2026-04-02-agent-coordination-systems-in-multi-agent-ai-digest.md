# Agent Coordination Systems in Multi-Agent AI

Consolidated on 2 April 2026 from the sibling Markdown, DOCX, and PDF exports
under `.agent/research/developer-experience/novel/`.

- For a source-faithful clean copy of the original document, see
  [`2026-04-02-agent-coordination-systems-in-multi-agent-ai-normalised-copy.md`](./2026-04-02-agent-coordination-systems-in-multi-agent-ai-normalised-copy.md).
- The Markdown export provided the strongest body structure.
- The DOCX export provided recoverable hyperlinks and the cleanest reference
  layer.
- A later PDF text-extraction pass confirmed that the PDF is a text-based
  export with embedded Unicode fonts and substantially the same body content as
  the Markdown and DOCX copies.
- The PDF also carries a trailing raw-URL appendix, but the apparent extras are
  line-break or truncation variants of links already recoverable from the DOCX
  relationship layer, so the PDF did not materially change the reconstruction
  or bibliography.
- A local link-resolution sweep was run across the deduplicated URL set
  recovered from the DOCX export. Fifty-eight of sixty-three URLs resolved
  cleanly. Five legacy links are preserved in the bibliography and marked as
  unresolved during the sweep.
- This document is a cleaned consolidation of the source report, not a full
  rewrite into a fresh state-of-the-world survey.

## Executive overview

The source report argues that agent coordination in the 2024-2026 period is
best understood as a convergence of three traditions:

1. Classical multi-agent systems theory and coordination models.
2. Workflow and distributed-systems execution semantics.
3. LLM-centred tool-use loops and routing patterns.

Across the surveyed ecosystem, "multi-agent" usually means multiple model-led
roles coordinated through one of two dominant control surfaces:

- An explicit workflow runtime with graph, state, event, or superstep semantics.
- A group-chat controller that chooses the next speaker and stops on a
  termination condition.

The strongest practical conclusion in the source material is that most modern
systems remain centrally orchestrated even when they present themselves as
teams, swarms, or societies. Parallelism exists, but the common production
shape is still a controller, manager, workflow runtime, or orchestrator sitting
above subordinate specialists. The report also identifies a second major
convergence: protocol standardisation at system boundaries, with one protocol
serving tool and context exchange and another targeting agent-to-agent
delegation and collaboration.

A cleaned synthesis of the source material yields five recurring coordination
primitives:

- Graph or state-machine orchestration with explicit routing.
- Event-driven step orchestration.
- Group-chat orchestration with a speaker selector.
- Handoffs represented as tool-like transfers of responsibility.
- Ledger or task-board orchestration in which an orchestrator maintains a
  running view of progress and replanning.

Source note: [1], [2], [3], [4], [5], [6], [7], [8], [9], [12], [16], [23],
[24], [30], [32], [33], [40], [63].

## Mechanism-first taxonomy

The original report is strongest when it separates artifact type from
coordination mechanism. That split is preserved here because it keeps
"multi-agent" from becoming an empty category.

### Artifact type

- **Orchestration runtime or framework**: provides control semantics for
  multi-step or multi-agent programs.
- **Managed agent platform or service**: provides hosting, governance, memory,
  deployment, and operational infrastructure around coordinated agents.
- **Interoperability protocol**: defines a boundary across systems rather than
  supplying the orchestration runtime itself.
- **Research prototype or landmark experiment**: demonstrates a coordination,
  memory, or evaluation thesis more than a general production runtime.
- **Historical conceptual model**: blackboard systems, contract-net style task
  allocation, joint intention, and related coordination theories that still
  explain present-day designs.

Source note: [5], [6], [13], [14], [31], [32], [33], [36], [37], [38], [63].

### Coordination primitive

- **Graph with explicit state transitions**: node-edge control flow,
  conditional routing, and, in some systems, bulk-synchronous supersteps.
- **Event-driven step pipeline**: steps emit and consume events against shared
  context.
- **Chat manager and speaker selection**: a controller decides who speaks next
  and when the conversation terminates.
- **Handoff as transfer**: the active role yields control to another role,
  often through the same function-calling or tool-selection mechanism used for
  ordinary actions.
- **Shared blackboard or shared state**: specialists contribute partial work to
  a shared working surface under some form of control shell.
- **Negotiation or market protocol**: work allocation emerges through bids,
  awards, or capability matching rather than a fixed flow.
- **Population or ensemble pattern**: multiple instances propose, debate, vote,
  or converge on a more stable answer.

Source note: [2], [6], [7], [16], [17], [18], [42], [47], [63].

### Authority model

- **Centralised orchestrator**: one controller chooses the next action.
- **Hierarchical manager-worker**: a manager assigns and validates work done by
  workers.
- **Peer-to-peer federation**: authority is negotiated across agents through a
  protocol boundary.
- **Decentralised emergence**: coordination comes from local rules without a
  stable leader.

The source report repeatedly returns to the claim that the first two patterns
dominate real implementations, while the last two remain more aspirational,
protocol-oriented, or research-oriented.

Source note: [7], [10], [19], [24], [32], [40].

### State, memory, execution, and governance

- **State** ranges from typed shared state with reducers, to session state, to
  transcript-as-state in chat systems.
- **Memory** splits into checkpointed execution state, session history,
  long-term stores, reflection summaries, and procedural skill libraries.
- **Execution** ranges from sequential processes to async event flows to
  superstep-based checkpointed runtimes.
- **Governance** shows up most clearly in interrupts, approval points, resume
  endpoints, consent requirements, and traceability layers.

The main conceptual warning in the original report is that these are not
interchangeable. A checkpoint is not the same thing as long-term memory; a chat
history is not the same thing as execution state; and "memory" as a label often
hides that distinction.

Source note: [12], [19], [21], [22], [24], [25], [29], [31], [37], [57], [58].

## Comparative matrix

### Representative orchestration runtimes and frameworks

| System | Primary primitive | Control model | State and memory posture | Recovery and HITL posture | Notes |
| --- | --- | --- | --- | --- | --- |
| LangGraph | Graph plus supersteps | Central runtime | Typed shared state, reducers, checkpoints | Persistence, time-travel, interrupts | Strong execution semantics; model behaviour inside nodes remains probabilistic |
| CrewAI | Tasks, flows, hierarchical processes | Sequential or manager-worker | Flow state plus persistence options | Resume and human-input states documented | Strong process framing; durable semantics remain framework-level, not protocol-level |
| OpenAI Agents SDK | Tool loop plus handoffs | Central runner with model-selected actions | Session history, run context, tracing | Guardrails and tracing; durable state is app-defined | Treats handoffs as a first-class routing primitive |
| AG2 / AutoGen lineage | Group chat plus handoffs | Chat manager | Transcript plus context variables and optional memory stores | Human participation and selectable speaker policies | Strong deliberation model; transcript often doubles as state |
| Microsoft Agent Framework | Workflow runtime with orchestration patterns | Central workflow runtime | Checkpoints, session state, orchestration patterns | Pause/resume via checkpoints and workflow state | One of the clearest workflow-engine convergences in the source set |
| Google ADK | Workflow agents and graph workflows | Usually hierarchical | Session state plus long-term memory services | Graph workflows and human-confirmation surfaces | Explicit split between state and memory is a useful design signal |
| LlamaIndex Workflows | Event-driven steps | Central workflow driver | Shared context across steps | Async-first; persistence depends on deployment choices | A clear event-driven alternative to graph-first runtimes |
| BeeAI Framework | Event-driven framework with governance constraints | Central runtime with policy layers | Constraint-oriented runtime state | Governance hooks and middleware | Strong emphasis on constrained behaviour rather than protocol interop |
| smolagents | Lightweight orchestration examples | Usually hierarchical in examples | Minimal built-in memory assumptions | Mostly application-defined | Useful as a minimal contrast case |
| Magentic-One | Orchestrator plus specialist ensemble | Strongly centralised orchestrator | Ledgers, environment state, replanning | Evaluated with explicit attention to agentic benchmarking | Useful reference architecture for orchestrator-led systems |

Source note: [2], [6], [7], [9], [12], [19], [21], [22], [24], [25], [29],
[30], [31], [32], [33], [34], [35], [57], [63].

### Managed platforms with public technical detail

| System | Coordination surface | Coordination posture | State or memory posture | Design implication |
| --- | --- | --- | --- | --- |
| Agents for Amazon Bedrock | Action groups and callable surfaces | Central agent chooses actions | Session-oriented platform state | Coordination is mostly action routing plus configured tool surfaces |
| Vertex AI Agent Builder | Lifecycle and hosting surface | Platform orchestration plus governance | Managed runtime and session infrastructure | Coordination details depend on the framework hosted inside the platform |
| Microsoft Foundry Agent Service | Managed memory and agent infrastructure | Platform services under workflow systems | Long-term memory is a first-class managed object | Strong continuity and consolidation posture |
| IBM watsonx Orchestrate | Multi-agent orchestration with tools and workflows | Platform-level orchestration | Enterprise governance posture | Coordination is bundled with operational and enterprise controls |

Source note: [13], [36], [37], [38].

### Protocols and interoperability layers

| Protocol | Boundary | What it coordinates | Mechanism | Governance implication |
| --- | --- | --- | --- | --- |
| MCP | Model-to-tool or model-to-context | Tools, resources, prompts, and capability negotiation | JSON-RPC 2.0 message exchange | Strong consent and safety language, but enforcement remains an implementation concern |
| A2A | Agent-to-agent | Delegation and collaboration across systems | Binding-neutral operations mapped to JSON-RPC, gRPC, and HTTP/REST | Pushes authentication, authorisation, and error semantics into the coordination conversation |

Source note: [3], [4].

### Research prototypes and landmark experiments

| System | Central thesis | Coordination significance |
| --- | --- | --- |
| Generative Agents | Observation, reflection, and planning create believable long-horizon agent behaviour | Canonical memory hierarchy example |
| Voyager | Curriculum plus executable skill library enables open-ended embodied learning | Canonical procedural-memory or skill-library pattern |
| Magentic-One | An orchestrator plus specialists can outperform a monolithic baseline on complex tasks | Clear orchestrator-led reference architecture |
| Debate and self-consistency work | Multiple instances can improve reasoning under some conditions | Shows that "multi-agent" can also mean ensemble reasoning, not just division of labour |

Source note: [14], [18], [26], [60], [61], [62], [63].

## Terminology and glossary

The source report spends substantial effort untangling overloaded terms. The
table below keeps the most useful distinctions.

| Term | Mechanism-centred meaning | Common misuse |
| --- | --- | --- |
| agent | A goal-directed actor operating in an environment | Used as shorthand for "LLM plus prompt and tools" even when there is no meaningful environment model |
| multi-agent system | Multiple decision-making actors interacting in a shared environment | Used for any workflow with multiple role prompts |
| orchestrator | The component that chooses the next step, tool, or specialist | Used without stating whether routing is deterministic, model-chosen, or policy-gated |
| group chat orchestration | Shared transcript plus manager-driven speaker selection | Mistaken for decentralised coordination |
| handoff | Explicit transfer of control or responsibility between roles | Reduced to "the model called another tool" without any trust or policy semantics |
| workflow | Explicit multi-step control structure | Used for scripts that have no pause, replay, or compensation semantics |
| blackboard | Shared working surface with specialist contributions under a control shell | Used loosely for any shared state store |
| contract net | Negotiated task allocation through bids and awards | Flattened into ordinary manager-worker assignment |
| reflection | Synthesis of past experience into higher-level planning material | Confused with a one-shot self-critique prompt |
| skill library | Persistent repository of reusable behaviours or executable routines | Confused with a flat tools list |
| persistent memory | Storage that survives beyond a single run | Used for everything from chat logs to checkpoints to vector stores |
| HITL | Human-in-the-loop control over agent execution | Reduced to passive observability rather than genuine pause or approval powers |
| MCP | Protocol for model and tool/context interoperability | Mistaken for agent-to-agent delegation |
| A2A | Protocol for agent-to-agent collaboration across systems | Mistaken for an orchestration framework |
| swarm | In the classical sense, decentralised self-organised coordination | Used as branding for centrally controlled agent teams |

Source note: [3], [4], [10], [11], [15], [17], [23], [39], [42], [44], [45].

## Long-form literature review

### Classical coordination lineages

The source report usefully reconnects present-day agent designs with older
coordination models instead of treating current frameworks as unprecedented.
Three lineages matter most.

Blackboard systems explain why so many present-day runtimes revolve around a
shared working surface that specialists update incrementally. Contract-net style
allocation explains why manager-worker systems keep resurfacing even when they
are not implemented as explicit bids and awards. Communication-language work
explains why the field has swung back toward protocol boundaries after years of
framework-local conventions.

The report also uses joint-intention and teamwork ideas as a corrective: a real
team is not just several specialists in one transcript. It also needs stable
commitments, coordination norms, and some coherent notion of shared progress.
That gap helps explain why modern handoff-heavy systems often feel brittle when
ownership is vague.

Source note: [1], [11], [15], [17], [39], [42], [43], [44], [45].

### From message semantics to execution semantics

One of the strongest threads in the source material is the shift from message
semantics to execution semantics. Classical coordination literature often cared
most about what a message meant. Modern agent systems care just as much about
what happens when execution pauses, restarts, replays, forks, or resumes after
side effects.

That is why the report places so much weight on supersteps, checkpoints,
interrupts, persistence, and replay. These are workflow-engine concerns more
than chat concerns. Once a system touches external tools or long-running tasks,
the central architectural question becomes whether it can say something precise
about retries, duplicate prevention, recovery boundaries, and operator control.

The cleaned conclusion here is simple: checkpointing is not the same thing as
durable execution. It is a prerequisite for replayable state, but it does not
by itself define side-effect semantics, compensation, or idempotency.

Source note: [2], [12], [22], [23], [29], [31], [32], [58].

### Deliberation, handoffs, and responsibility transfer

The report distinguishes two families that are often muddled together.

The first is deliberative coordination: shared transcript, manager-selected next
speaker, and termination through a conversation policy. The second is transfer
coordination: handoffs represented as explicit responsibility shifts, often
implemented through the same selection machinery used for tools.

These families overlap in practice, but they have different failure modes.
Deliberative systems risk ballooning transcript state and losing crisp recovery
points. Handoff systems risk ambiguous ownership, weak trust semantics, and
overreliance on model-selected routing. Both are still usually centralised,
even when the branding implies something more emergent.

Source note: [7], [16], [18], [19], [28], [46], [47], [48], [49], [50].

### Memory hierarchies and learning loops

Another useful contribution in the source report is its insistence that
"memory" is not one thing. At least five different mechanisms recur:

- replayable execution state
- session history
- long-term memory stores
- reflection summaries
- procedural or executable skill libraries

Generative Agents gives the clearest reflective-memory example. Voyager gives
the clearest skill-library example. Workflow runtimes give the clearest
checkpointed-execution example. When a framework collapses those into one word,
architectural clarity disappears quickly.

Source note: [12], [14], [21], [24], [25], [26], [37].

### Protocolisation and interoperability

The source material treats protocol work as a different layer from orchestration
frameworks, and that distinction is worth preserving. One protocol standardises
how model-hosting systems access tools, resources, prompts, and capabilities.
The other tries to standardise agent-to-agent task exchange and collaboration.

This matters because tool access and delegation are different problems. A system
can have excellent tool interoperability and still have no meaningful semantics
for trustable handoffs across organisational or runtime boundaries. The report's
view is that these protocols are complementary rather than interchangeable.

Source note: [3], [4], [23], [24].

### Metaphor versus mechanism

The source report is especially sharp when it challenges branding language.
"Swarm", "society", "crew", and related labels often describe system vibe more
than mechanism. In classical swarm literature, decentralisation and emergence
are defining traits. In current agent engineering, the same language often sits
on top of a plainly centralised orchestrator or manager.

That mismatch is not just a naming annoyance. It affects operator expectations
about determinism, accountability, and failure recovery. If a system is really a
manager-worker workflow, calling it a swarm obscures the parts that matter.

Source note: [10], [19], [40], [41], [53].

### Evaluation and benchmarking

The report also argues that coordination quality is hard to measure because most
benchmarks combine several variables at once: base-model capability, tool
quality, environment stability, orchestration quality, policy constraints, and
operator decisions.

Benchmarks such as GAIA, WebArena, AssistantBench, and AutoGenBench are useful
because they push systems into realistic environments, but they still leave open
the question of how to isolate routing quality, delegation quality, or recovery
quality from everything else. The report treats that gap as a major open
evaluation problem rather than a solved one.

Source note: [18], [54], [55], [56], [59], [61], [62].

### Synthesis

The consolidated synthesis is that the strongest production-oriented systems are
hybrids:

- explicit workflows for control
- model-driven steps for flexibility
- observable state and trace surfaces
- governance and approval hooks
- protocol boundaries at the tool and agent edges

The deepest disagreement is not really about whether multiple specialists are
useful. It is about how much control should be explicit, how much can safely be
left to model selection, and what semantics are required before a system moves
from "interesting orchestration pattern" to "reliable operating substrate".

Source note: [23], [24], [30], [32], [40], [57], [63].

## Open problems and research questions

- **Durable execution versus checkpointing**: how far can checkpoint-based
  replay go before side effects, retries, and duplicate prevention require a
  stronger workflow contract? Source note: [12], [22], [23], [58].
- **Side-effect semantics**: mainstream frameworks still say less than they
  should about compensation, transaction boundaries, and provenance for actions
  with real-world effects. Source note: [23], [29], [57], [59].
- **Interoperability depth**: protocol work is making boundary exchange real,
  but capability declaration, trust, policy, and accountability remain shallow.
  Source note: [3], [4], [23], [24].
- **Centralisation default**: most practical systems still collapse toward a
  controller, even when the surrounding language implies decentralised
  emergence. Source note: [7], [10], [19], [40], [63].
- **Terminology debt**: the field still lacks a precise shared vocabulary for
  "durable", "resumable", "deterministic", and "memory". Source note: [3],
  [12], [23], [37], [57].
- **Evaluation decomposition**: benchmarks still struggle to separate model
  quality from orchestration quality. Source note: [54], [55], [56], [59].
- **When ensemble patterns help**: debate, vote, and self-consistency methods
  can help, but the boundary conditions are still under-theorised. Source note:
  [18], [60], [61], [62].

## References

The list below preserves the full deduplicated URL set recovered from the DOCX
export. It is deduplicated by URL, not by work, so mirrors and alternate
editions remain separate where the export linked them separately. Entries marked
as unresolved were preserved from the source export even though they did not
resolve during the local sweep.

1. Southampton review PDF on cooperative knowledge-based systems.
   <https://eprints.soton.ac.uk/252090/1/KE-REVIEW-8-3.pdf>

2. Graph API overview - Docs by LangChain.
   <https://docs.langchain.com/oss/javascript/langgraph/graph-api>

3. Specification - Model Context Protocol.
   <https://modelcontextprotocol.io/specification/2025-11-25>

4. Overview - A2A Protocol.
   <https://a2a-protocol.org/latest/specification/>

5. Use the graph API - Docs by LangChain.
   <https://docs.langchain.com/oss/python/langgraph/use-graph-api>

6. run-llama/workflows-py repository.
   <https://github.com/run-llama/workflows-py>

7. GroupChat - AG2.
   <https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/>

8. OpenAI Swarm README.
   <https://github.com/openai/swarm/blob/main/README.md>

9. Magentic-One PDF. Unresolved during local sweep; preserved from source
   export.
   <https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Magentic-One.pdf>

10. Swarm Intelligence by Eric Bonabeau, Marco Dorigo, and Guy Theraulaz.
    <https://books.apple.com/gb/book/swarm-intelligence/id873884933>

11. Wooldridge lecture notes on intelligent agents and multi-agent systems.
    <https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/imas//distrib/2up/lect02-2up.pdf>

12. Persistence - Docs by LangChain.
    <https://docs.langchain.com/oss/python/langgraph/persistence>

13. CreateAgentActionGroup - Amazon Bedrock.
    <https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_CreateAgentActionGroup.html>

14. Generative Agents: Interactive Simulacra of Human Behavior.
    <https://arxiv.org/abs/2304.03442>

15. Stanford blackboard architecture report. Unresolved during local sweep;
    preserved from source export.
    <https://i.stanford.edu/pub/cstr/reports/cs/tr/86/1123/CS-TR-86-1123.pdf>

16. Handoffs - OpenAI Agents SDK.
    <https://openai.github.io/openai-agents-python/handoffs/>

17. The Contract Net Protocol (PDF).
    <https://www.reidgsmith.com/The_Contract_Net_Protocol_Dec-1980.pdf>

18. Improving Factuality and Reasoning in Language Models through Multiagent
    Debate.
    <https://arxiv.org/abs/2305.14325>

19. Processes - CrewAI.
    <https://docs.crewai.com/en/concepts/processes>

20. Graph API overview - Docs by LangChain (mirror).
    <https://7x.mintlify.app/oss/python/langgraph/graph-api>

21. State - Agent Development Kit (ADK).
    <https://google.github.io/adk-docs/sessions/state/>

22. Microsoft Agent Framework Workflows - Checkpoints.
    <https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints>

23. Use time-travel - Docs by LangChain.
    <https://docs.langchain.com/oss/javascript/langgraph/use-time-travel>

24. Sessions - OpenAI Agents SDK.
    <https://openai.github.io/openai-agents-python/sessions/>

25. Memory - Agent Development Kit (ADK).
    <https://google.github.io/adk-docs/sessions/memory/>

26. Voyager: An Open-Ended Embodied Agent with Large Language Models.
    <https://arxiv.org/abs/2305.16291>

27. Sequential Processes - CrewAI.
    <https://docs.crewai.com/en/learn/sequential-process>

28. Context Variables - AG2.
    <https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/context-variables/>

29. Interrupts - Docs by LangChain.
    <https://docs.langchain.com/oss/python/langgraph/interrupts>

30. Agents SDK | OpenAI API.
    <https://developers.openai.com/api/docs/guides/agents-sdk/>

31. Graph-based agent workflows - Agent Development Kit (ADK).
    <https://google.github.io/adk-docs/workflows/>

32. Microsoft Agent Framework Overview.
    <https://learn.microsoft.com/en-us/agent-framework/overview/>

33. Workflow Agents - Agent Development Kit (ADK).
    <https://google.github.io/adk-docs/agents/workflow-agents/>

34. Welcome to the BeeAI Framework.
    <https://framework.beeai.dev/introduction/welcome>

35. Hugging Face smolagents multi-agent example.
    <https://huggingface.co/docs/smolagents/v1.14.0/en/examples/multiagents>

36. Vertex AI Agent Builder overview.
    <https://docs.cloud.google.com/agent-builder/overview>

37. What is Memory? - Microsoft Foundry.
    <https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory>

38. IBM watsonx Orchestrate: Building agents.
    <https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=building-agents>

39. AIMA chapter on agents and environments (PDF).
    <https://people.eecs.berkeley.edu/~russell/aima1e/chapter02.pdf>

40. AI Agent Orchestration Patterns - Azure Architecture Center.
    <https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns>

41. MetaGPT repository.
    <https://github.com/FoundationAgents/MetaGPT>

42. Stanford blackboard systems report (PDF).
    <https://stacks.stanford.edu/file/druid%3Ats923xj4709/ts923xj4709.pdf>

43. ACM article via DOI 10.1145/191246.191322. Unresolved during local sweep;
    preserved from source export.
    <https://dl.acm.org/doi/10.1145/191246.191322>

44. FIPA communicative acts specification (PDF). Unresolved during local sweep;
    preserved from source export.
    <https://www.fipa.org/specs/fipa00071/XC00071B.pdf>

45. Commitments and teamwork reference via PhilPapers. Unresolved during local
    sweep; preserved from source export.
    <https://philpapers.org/rec/COHT>

46. AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation.
    <https://arxiv.org/abs/2308.08155>

47. Group Chat Agent Orchestration - Microsoft Learn.
    <https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/group-chat>

48. Orchestrating Agents: Routines and Handoffs.
    <https://developers.openai.com/cookbook/examples/orchestrating_agents/>

49. Function calling - OpenAI API.
    <https://developers.openai.com/api/docs/guides/function-calling/>

50. Handoffs - AG2.
    <https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/group-chat/handoffs/>

51. CrewAI documentation.
    <https://docs.crewai.com/>

52. ChatDev: Communicative Agents for Software Development.
    <https://arxiv.org/html/2307.07924v5>

53. CAMEL: Communicative Agents for "Mind" Exploration of Large Language Model
    Society.
    <https://arxiv.org/abs/2303.17760>

54. GAIA: a benchmark for General AI Assistants.
    <https://arxiv.org/abs/2311.12983>

55. WebArena: A Realistic Web Environment for Building Autonomous Agents.
    <https://arxiv.org/abs/2307.13854>

56. AssistantBench: Can Web Agents Solve Realistic and Time-Consuming Tasks?
    <https://arxiv.org/abs/2407.15711>

57. Tracing - OpenAI Agents SDK.
    <https://openai.github.io/openai-agents-python/tracing/>

58. Reliable data processing: Queues and Workflows - Temporal.
    <https://temporal.io/blog/reliable-data-processing-queues-workflows>

59. AutoGenBench - A Tool for Measuring and Evaluating AutoGen Agents.
    <https://microsoft.github.io/autogen/0.2/blog/2024/01/25/AutoGenBench/>

60. Self-Consistency Improves Chain of Thought Reasoning in Language Models.
    <https://arxiv.org/abs/2203.11171>

61. EMNLP 2024 findings PDF.
    <https://aclanthology.org/2024.findings-emnlp.427.pdf>

62. Debate or Vote: Which Yields Better Decisions in Multi-Agent Large
    Language Models?
    <https://neurips.cc/virtual/2025/poster/116557>

63. Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks.
    <https://arxiv.org/abs/2411.04468>
