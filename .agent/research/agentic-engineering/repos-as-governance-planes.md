# Repositories that look genuinely useful as system layers or support substrates for multi-agent systems

I prioritized official repos/docs, permissive licensing, current release activity, and evidence of real coordination, workflow control, policy gating, or machine-readable contribution structure. I down-ranked thin wrappers and maintenance-mode projects; notably, AutoGen is now in maintenance mode, and Microsoft explicitly positions Agent Framework as the direct successor to AutoGen and Semantic Kernel for multi-agent orchestration. ([GitHub][1])

A high-level conclusion before the list: the strongest current open landscape is **not** a single all-in-one “agent framework.” The most credible stack is split across four roles: **execution engines** such as LangGraph, Microsoft Agent Framework, Temporal, and Dapr; **interop substrates** such as A2A and MCP; **policy/control planes** such as OPA and the Agent Governance Toolkit; and **repo-native support environments** such as Prow, Zuul, Backstage, and OpenRewrite. The non-agent repos are still stronger than most agent-native repos on durability, gating, policy, and controlled change management. ([GitHub][2])

## A. Direct agent system / coordination layer repositories

### LangGraph

* **Link / licence / category:** [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph). MIT. Category A. ([GitHub][2])
* **Why relevant / layer / architecture / orientation:** LangGraph presents itself as a low-level orchestration framework for long-running, stateful agents and emphasizes durable execution, human-in-the-loop control, memory, and production deployment. Under the hood, compiled graphs run on a Pregel-based runtime, so this is primarily a **runtime + orchestration + state/memory + supervision** layer. It is designed for **mixed human/agent operation** rather than purely autonomous agents. ([LangChain Docs][3])
* **Strengths / limitations / maturity / reuse:** Its main strength is explicit coordination state plus durable, restartable execution. Its main limitation is that governance/policy and cross-runtime federation largely sit outside the core. The repo shows very active releases, including 1.1.8 on April 17, 2026, and the MIT licence is permissive enough for serious reuse. ([GitHub][2])

### Microsoft Agent Framework

* **Link / licence / category:** [microsoft/agent-framework](https://github.com/microsoft/agent-framework). MIT. Category A. ([GitHub][4])
* **Why relevant / layer / architecture / orientation:** Agent Framework is explicitly for building, orchestrating, and deploying AI agents and multi-agent workflows in Python and .NET. Its workflow model is unusually explicit: workflows are built from **executors, edges, and events**, and Microsoft’s 1.0 release calls out a stable graph-based engine with branching, fan-out/fan-in, checkpointing, and hydration. That makes it a strong **runtime + orchestration + observability + harness** candidate for **mixed human/agent operation**. ([Microsoft Learn][5])
* **Strengths / limitations / maturity / reuse:** Relative to many agent repos, it has a clearer enterprise workflow story and Microsoft now treats it as the successor to both AutoGen and Semantic Kernel. The main caveat is youth: the architecture is serious, but the ecosystem is still consolidating around it. Version 1.0 was announced on April 3, 2026, releases remain active, and the MIT licence is permissive for reuse. ([Microsoft Learn][6])

### OpenAI Agents SDK

* **Link / licence / category:** [openai/openai-agents-python](https://github.com/openai/openai-agents-python). MIT. Category A. ([GitHub][7])
* **Why relevant / layer / architecture / orientation:** This SDK is more serious than a simple chat wrapper because it exposes distinct orchestration patterns—**handoffs** when a specialist should take over, and **agents-as-tools** when a manager should stay in control. It also has built-in guardrails, human review that can pause runs before side effects, tracing, resumable state, MCP integration, and “Sandbox Agents” with persistent isolated workspaces for real file/repo work. That puts it in the **orchestration + handoff + tracing + supervision + coding-workspace** layer, aimed at **mixed human/agent operation**. ([OpenAI Developers][8])
* **Strengths / limitations / maturity / reuse:** Its strongest ideas are specialist ownership transfer, bounded specialist-as-tool use, and strong observability. Its limitation is that it is less of a general distributed control substrate than LangGraph, Temporal, or Dapr. The repo is active, with v0.14.2 on April 18, 2026, and the MIT licence is permissive enough for reuse. ([OpenAI Developers][8])

### Google ADK

* **Link / licence / category:** [google/adk-python](https://github.com/google/adk-python). Apache-2.0. Category A. ([GitHub][9])
* **Why relevant / layer / architecture / orientation:** ADK is a code-first toolkit for building, evaluating, and deploying agents, but the technically important part is its explicit **multi-agent hierarchy** model and its separate **workflow agents**. The docs frame multi-agent systems as hierarchies of `BaseAgent` instances, and the toolchain includes a CLI and Developer UI for inspecting events, state changes, traces, and graph structure. That makes it a credible **runtime + orchestration + evaluation + devtooling** layer for **mixed human/agent operation**. ([adk.dev][10])
* **Strengths / limitations / maturity / reuse:** ADK’s main strengths are explicit hierarchical composition, workflow-specialized agents, and unusually good local dev/inspection tooling. The main caveat is ecosystem gravity: it is open and permissive, but the design is still closely tied to the Google toolchain. The repo is active, with v1.31.0 on April 16–17, 2026, and Apache-2.0 makes serious reuse straightforward. ([GitHub][11])

### Agent2Agent Protocol (A2A)

* **Link / licence / category:** [a2aproject/A2A](https://github.com/a2aproject/A2A). Apache-2.0. Category A. ([GitHub][12])
* **Why relevant / layer / architecture / orientation:** A2A is not an orchestration engine; it is an **agent federation protocol**. The repo and docs describe an open protocol for communication between opaque agentic applications, with capability discovery, modality negotiation, secure collaboration on long-running tasks, and a **Task** object as a stateful collaboration unit. This squarely belongs to the **communication + protocol + federation** layer and is designed mainly **for agents**. ([GitHub][12])
* **Strengths / limitations / maturity / reuse:** This is one of the clearest open answers to agent-to-agent interoperability, and the project now has a broader SDK/TCK ecosystem under the Linux Foundation. The limitation is equally clear: it does not itself solve orchestration, memory convergence, or policy. A2A 1.0.0 shipped on March 12, 2026, and the org shows official SDKs plus a TCK repo with active updates in April 2026. Apache-2.0 is permissive enough for serious reuse. ([GitHub][13])

### Model Context Protocol (MCP)

* **Link / licence / category:** [modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol). MIT. Category A. ([GitHub][14])
* **Why relevant / layer / architecture / orientation:** MCP is often over-described as “agent interoperability,” but its actual role is narrower and more useful: a standardized **host/client/server** substrate for tools, resources, prompts, sampling, roots, and other capability exchange between LLM applications and external systems. The current specification uses JSON-RPC, stateful connections, capability negotiation, and explicit security/consent principles. It belongs to the **tool/context protocol + capability exchange** layer and is best viewed as **mixed human/agent infrastructure**. ([Model Context Protocol][15])
* **Strengths / limitations / maturity / reuse:** Its strength is that it standardizes the “bounded capability surface” around agents better than most orchestration frameworks do. Its limitation is that it is **not** agent-to-agent coordination and **not** a workflow runtime. The repo is MIT-licensed and the current official spec revision is 2025-06-18, which is sufficiently mature for serious experimentation and reuse. ([GitHub][14])

### Microsoft Agent Governance Toolkit

* **Link / licence / category:** [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit). MIT. Category A. ([GitHub][16])
* **Why relevant / layer / architecture / orientation:** AGT is one of the few repos that treats **governance itself** as a first-class system layer. Its FAQ says it intercepts every agent action—tool calls, API requests, and inter-agent messages—before execution and enforces deterministic policies at sub-millisecond latency. The broader project describes policy, identity/mesh, runtime/hypervisor, SRE, and compliance packages, including unified governance across A2A and MCP-style surfaces. This is a **governance + policy + supervision + security** layer for **mixed human/agent systems**. ([GitHub][17])
* **Strengths / limitations / maturity / reuse:** The strength is conceptual clarity: it separates runtime governance from model prompting and from fleet management. The limitation is maturity: even Microsoft describes current packages as public preview, so this is promising but early rather than settled infrastructure. The repo is MIT-licensed, and v3.1.0 public preview was published in April 2026. ([GitHub][18])

### BeeAI Framework

* **Link / licence / category:** [i-am-bee/beeai-framework](https://github.com/i-am-bee/beeai-framework). Apache-2.0. Category A. ([GitHub][19])
* **Why relevant / layer / architecture / orientation:** BeeAI is one of the more infrastructure-minded agent frameworks because it combines workflows, memory, observability, serialization, and the ability to serve agents over A2A and MCP. Its middleware model explicitly intercepts the execution lifecycle of agents, tools, and models, and its docs emphasize built-in constraint enforcement and rule-based governance. That places it in the **runtime + orchestration + protocol + bounded-autonomy** layer for **mixed human/agent operation**. ([GitHub][19])
* **Strengths / limitations / maturity / reuse:** BeeAI is unusually aligned with your interest in bounded autonomy and protocol-facing coordination. The caveat is maturity: release numbering remains pre-1.0 and even the Python starter template is marked alpha. It is permissively licensed and promising, but I would treat it as an early substrate candidate rather than a settled foundation. ([GitHub][20])

## B. Non-agent-primary repositories with strong agent-support infrastructure

### Temporal

* **Link / licence / category:** [temporalio/temporal](https://github.com/temporalio/temporal). MIT. Category B. ([GitHub][21])
* **Why relevant / layer / architecture / orientation:** Temporal is not agent-branded, but it is one of the strongest substrates for agent systems because it solves durable, long-running, stateful execution. Its docs describe workflows as code-defined executions with event histories and deterministic replay requirements; if the application crashes, Temporal recreates pre-failure state and continues where it left off. This is a **workflow runtime + durability + recovery** layer designed mainly **for humans/automation engineers**, but highly suitable for agents. ([Temporal Docs][22])
* **Strengths / limitations / maturity / reuse:** Temporal’s strength is operational seriousness: durable execution, retries, replay, and long-running processes are first-class. Its limitation is that it supplies almost none of the higher-level agent semantics itself. The repo is active, with v1.30.4 on April 10, 2026, and the MIT licence is permissive enough for serious reuse. ([GitHub][21])

### Dapr

* **Link / licence / category:** [dapr/dapr](https://github.com/dapr/dapr). Apache-2.0. Category B. ([GitHub][23])
* **Why relevant / layer / architecture / orientation:** Dapr is a portable distributed-application runtime, but it is highly relevant because it bundles workflow, pub/sub, state management, locks, crypto, configuration, and virtual actors in one reusable substrate. The docs also make clear that Dapr Workflow builds on Dapr Actors, and the actor runtime uses turn-based concurrency with per-actor locking and deadlock interruption. That makes Dapr a serious **distributed runtime + workflow + state + communication + stability-control** layer for **mixed human/agent systems**. ([GitHub][23])
* **Strengths / limitations / maturity / reuse:** Dapr’s main strength is that it already offers the kinds of distributed control primitives most agent frameworks only sketch: state, actors, workflow, messaging, resilience, and security. Its main limitation is that agent semantics must still be built on top. The repo is very active, with Dapr Runtime v1.17.5 on April 16, 2026, and Apache-2.0 is permissive enough for serious reuse. ([GitHub][23])

### Open Policy Agent (OPA)

* **Link / licence / category:** [open-policy-agent/opa](https://github.com/open-policy-agent/opa). Apache-2.0. Category B. ([GitHub][24])
* **Why relevant / layer / architecture / orientation:** OPA is a general-purpose policy engine, which is exactly why it matters: it offers a clean external policy plane for tool use, CI/CD gating, repo automation, and service authorization. The project frames itself as unified, context-aware policy enforcement across the stack, and its CI/CD docs show direct use for failing jobs when policies are violated. That makes it a **governance + policy + approval/gating** layer aimed mainly **at humans/automation systems**, but highly applicable to agents. ([GitHub][24])
* **Strengths / limitations / maturity / reuse:** OPA’s strength is mature separation of decision policy from application logic. Its limitation is that it has no native model of agents, conversations, or multi-agent trust—you must map those concepts into policy input yourself. The repo remains active, with a release on April 8, 2026, and Apache-2.0 is permissive enough for serious reuse. ([GitHub][25])

### Prow

* **Link / licence / category:** [kubernetes-sigs/prow](https://github.com/kubernetes-sigs/prow). Apache-2.0. Category B. ([GitHub][26])
* **Why relevant / layer / architecture / orientation:** Prow is a Kubernetes-based CI/CD and GitHub automation system, but it is highly relevant as a **governed contribution environment**. Its docs describe repo/org-specific plugins configured in `plugins.yaml`, support for external plugins, deployable GitHub App setups, and Tide merge pools that automatically retest and merge PRs. Kubernetes itself uses Prow to test PRs, and the separate [`kubernetes/test-infra`](https://github.com/kubernetes/test-infra) repo is a live example of a large machine-readable automation environment. This belongs to the **contribution support + workflow control + chatops + merge governance** layer for **mixed human/automation operation**. ([Prow][27])
* **Strengths / limitations / maturity / reuse:** Prow is one of the best open examples of bounded automation in real repositories: declarative config, commands, merge queues, and per-repo plugin surfaces. Its limitation is operational complexity and a GitHub/Kubernetes-centric model. The project is mature and permissively licensed enough for serious reuse. ([GitHub][26])

### Zuul

* **Link / licence / category:** [opendev.org/zuul/zuul](https://opendev.org/zuul/zuul). Apache-2.0. Category B. ([Zuul][28])
* **Why relevant / layer / architecture / orientation:** Zuul is a project gating system rather than an agent repo, but it is one of the best open systems for **multi-repo dependency-aware coordination**. Its docs emphasize protecting projects from merging broken code, and its cross-project dependency model treats changes as a DAG using `Depends-On:` across repositories and even across systems such as GitHub and Gerrit. This places it in the **gating + dependency orchestration + contribution governance** layer for **mixed human/automation operation**. ([Acme Gating][29])
* **Strengths / limitations / maturity / reuse:** Zuul’s main strength is that it solves a harder problem than simple PR CI: speculative, dependency-aware, cross-project gating. Its limitation is operational heft and a smaller ecosystem than GitHub-native tooling. The project remains actively documented and released in 2026, and the Apache-2.0 licence is permissive enough for serious reuse. ([Zuul][30])

### Backstage

* **Link / licence / category:** [backstage/backstage](https://github.com/backstage/backstage). Apache-2.0. Category B. ([GitHub][31])
* **Why relevant / layer / architecture / orientation:** Backstage is not an execution runtime, but it is a very plausible **host environment** for agents because it provides a centralized software catalog, software templates under `/create`, GitHub discovery, org/team ingestion, and an extensible permission framework. The docs show conditional authorization of template parameters and steps, plus ownership-based policy decisions in the catalog. This makes it a **developer control plane + catalog + template + permission** layer aimed mainly **at humans**, but with strong **mixed human/agent** potential. ([Backstage][32])
* **Strengths / limitations / maturity / reuse:** Backstage’s strength is not “agents” but institutional structure: ownership metadata, discovery, templates, permissions, and plugin surfaces. Its limitation is that it does not directly execute workflows or policies at the agent-action level. The project remains very active, with v1.50.2 on April 18, 2026, and Apache-2.0 is permissive enough for serious reuse. ([GitHub][33])

### OpenRewrite

* **Link / licence / category:** [openrewrite/rewrite](https://github.com/openrewrite/rewrite). Apache-2.0 core. Category B. ([GitHub][34])
* **Why relevant / layer / architecture / orientation:** OpenRewrite matters because automated code contribution becomes much safer when edits are **semantic and recipe-driven** rather than free-form text generation. Its core model is the Lossless Semantic Tree with type attribution, and its tooling supports recipes/visitors plus multi-repo execution through the Moderne CLI. That makes it a powerful **code transformation + maintenance workflow + contribution support** substrate for **mixed human/automation operation**. ([OpenRewrite Docs][35])
* **Strengths / limitations / maturity / reuse:** OpenRewrite is one of the strongest open options for bounded, structural repository change at scale. The caveat is licensing: the core framework is Apache-licensed, but higher-value recipe/language layers include source-available and proprietary pieces. The repo is very active, with v8.79.6 on April 19, 2026. My reuse verdict is **yes for core substrate, but not uniformly across the full ecosystem**. ([GitHub][36])

## Shortlist of the most promising repos overall

**Inspect first for execution/orchestration:** LangGraph, Microsoft Agent Framework, Temporal, and Dapr. These are the clearest repositories for long-running, stateful, recoverable coordination rather than prompt-level choreography. ([GitHub][2])

**Inspect first for interoperability:** A2A and MCP. They solve different problems and are complementary: A2A is the stronger candidate for agent-to-agent federation, while MCP is the stronger candidate for tool/context exchange and bounded capability exposure. ([GitHub][12])

**Inspect first for governance/control:** OPA if you want the most mature generic policy plane, and Agent Governance Toolkit if you want an explicitly agent-native runtime governance layer and can tolerate preview maturity. ([GitHub][24])

**Inspect first for repo-native support environments:** Prow, Zuul, Backstage, and OpenRewrite. Together they cover merge gating, cross-repo dependency control, ownership/catalog structure, and structural code transformation. ([GitHub][37])

**Second-wave agent-native candidates:** OpenAI Agents SDK, Google ADK, and BeeAI are all serious and useful, but I rank them slightly below the shortlist above if the question is specifically **shared substrate/system layer** rather than a more application-facing agent framework. ([GitHub][7])

## Comparison matrix

| Repo                      | Cat. | Main layer                            | Core coordination primitive                                       | Orientation         | Reuse verdict                                                                                                  |
| ------------------------- | ---- | ------------------------------------- | ----------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| LangGraph                 | A    | Runtime / orchestration               | Explicit state graph executed by a Pregel runtime                 | Mixed               | Strong open orchestration runtime; add separate policy and interop layers. ([LangChain Docs][38])              |
| Microsoft Agent Framework | A    | Workflow runtime / orchestration      | Executors + edges + events, with checkpointing/hydration          | Mixed               | Strong open enterprise workflow substrate; still comparatively young. ([Microsoft Learn][5])                   |
| A2A                       | A    | Agent federation protocol             | Stateful Task collaboration plus capability discovery/negotiation | Agent-first         | Best current open agent-to-agent interop candidate; not a runtime. ([GitHub][12])                              |
| MCP                       | A    | Tool/context protocol                 | JSON-RPC host/client/server capability exchange                   | Mixed               | Best current substrate for bounded tool/context surfaces; not agent federation. ([Model Context Protocol][15]) |
| Agent Governance Toolkit  | A    | Governance / supervision              | Runtime interception of actions plus policy/identity layers       | Mixed               | Promising agent-native control plane; preview maturity is the caveat. ([GitHub][17])                           |
| Temporal                  | B    | Durable workflow runtime              | Event history + deterministic replay + retries                    | Human/automation    | Excellent substrate when stability and recoverability matter most. ([Temporal Docs][22])                       |
| Dapr                      | B    | Distributed runtime                   | Actors + workflow + pub/sub + state + locks                       | Mixed               | Rich distributed substrate; agent semantics must be layered on top. ([Dapr Docs][39])                          |
| OPA                       | B    | Policy engine                         | External policy-as-code decisions over runtime inputs             | Human/automation    | Very strong generic policy plane; agent concepts need translation into policy input. ([GitHub][24])            |
| Prow                      | B    | Contribution governance               | Webhooks + plugins + Tide merge pools + chatops commands          | Mixed               | Excellent repo automation/gating substrate, especially for governed contribution. ([Prow][40])                 |
| Zuul                      | B    | Cross-repo gating                     | DAG dependencies and speculative project gating                   | Mixed               | Best open multi-repo gating model in this set; operationally heavy. ([Zuul][41])                               |
| Backstage                 | B    | Catalog / template / permission plane | Software catalog + discovery + templates + permission policies    | Human-first / mixed | Excellent host environment around agents, not an agent runtime itself. ([GitHub][31])                          |
| OpenRewrite               | B    | Structural code-change substrate      | Semantic trees + recipes + multi-repo runs                        | Mixed               | Very strong for bounded code maintenance; licensing becomes mixed above core. ([OpenRewrite Docs][35])         |

## Recurring architectural patterns

The most important pattern is the split between **execution engine**, **protocol**, and **policy plane**. LangGraph, Microsoft Agent Framework, Temporal, and Dapr are mostly execution engines. A2A and MCP are mostly interoperability protocols. OPA and AGT are policy/control layers. The fact that these responsibilities remain separated across projects is not a weakness by itself; it is evidence that most open systems still do not unify orchestration, federation, and governance into one coherent substrate. ([GitHub][2])

A second pattern is the return of **explicit state and durable re-entry**. LangGraph emphasizes durable execution and resumable state; Microsoft Agent Framework uses checkpointing/hydration; Temporal uses event history and deterministic replay; Dapr workflows build on actors with explicit persisted state. This is exactly the direction a serious multi-agent substrate needs if it is to survive long-running interaction rather than just produce single-turn outputs. ([LangChain Docs][3])

A third pattern is **bounded autonomy through external gates**, not through prompt wording alone. OpenAI Agents pauses runs for human review, LangGraph exposes HITL state inspection, OPA externalizes policy decisions, AGT intercepts actions before execution, Prow/Tide gates merges, and Backstage authorizes templates and catalog actions. The deeper architectural lesson is that successful systems put control at the perimeter of action. ([OpenAI Developers][42])

A fourth pattern is that the best repo-support environments are **declarative and machine-readable**. `plugins.yaml` in Prow, `Depends-On` DAGs in Zuul, catalog/template definitions and permission policies in Backstage, and recipe DSLs plus LSTs in OpenRewrite all show that automation becomes safer when repositories expose structure, boundaries, and admissible operations explicitly. ([Prow][40])

## What non-agent repos teach us about agent support environments

Non-agent repos teach that **stability beats cleverness**. Temporal and Dapr devote enormous design effort to retries, replay, actor placement, concurrency rules, failure handling, and persistence. Most “agent frameworks” still underinvest in these basics even though those basics are what prevent chaos in many interacting components. ([Temporal Docs][22])

They also teach that **institutions matter**. Prow, Zuul, and Backstage are useful not because they are intelligent, but because they encode approvals, ownership, queueing, gating, templates, and discovery. Those are exactly the kinds of institutional supports agents need if they are to contribute safely to real systems rather than toy demos. ([GitHub][37])

Finally, they teach that **safe repository action should be structural whenever possible**. OpenRewrite’s recipe/LST model is a better substrate for large-scale maintenance and modernization than unconstrained file-editing agents, because it narrows the action space to auditable, semantic transforms. ([OpenRewrite Docs][35])

## Gaps in the current open repo landscape

The biggest missing piece is a truly convincing **unified substrate**. Today you can combine durable execution (Temporal/Dapr/LangGraph), protocol interop (A2A/MCP), policy (OPA/AGT), and repo control (Prow/Zuul/Backstage/OpenRewrite), but almost no permissively licensed repo integrates all of that into one cohesive system. That is an inference from how responsibilities are distributed across the projects above. ([GitHub][21])

A second gap is weak support for **shared memory, provenance, and conflict-resolution semantics across agents**. A2A gives a stateful task abstraction and MCP gives structured capability exchange, but neither defines a full shared-state or conflict-resolution model for many semi-autonomous agents acting concurrently. ([agent2agent.info][43])

A third gap is that **human oversight is still relatively shallow**. The dominant pattern is pause/approve/reject rather than richer organizational workflow: queue ownership, escalation, policy budgets, audit envelopes, or institutional role semantics. Those richer patterns mostly still live in non-agent systems like Prow, Zuul, and Backstage rather than agent frameworks themselves. ([OpenAI Developers][42])

A fourth gap is the absence of a common open standard for **machine-readable contribution contracts** aimed at automated contributors. We have pieces—Prow config, Zuul pipeline/job config, Backstage templates and permissions, OpenRewrite recipes—but no common repo-native contract describing what an automated contributor may read, change, request, or merge. That is precisely the sort of support layer your research target points toward. ([Prow][40])

## A few notable exclusions / down-ranked repos

I did **not** rank AutoGen as a forward-looking top candidate because the repo is now explicitly in maintenance mode. I also would place CrewAI below the shortlist for this specific question: it is capable and production-minded, but it reads to me more as an application-level agent automation framework than as a deeper shared orchestration substrate. BeeAI made the cut because it is more protocol- and governance-minded than most peers, even though it is earlier. ([GitHub][1])

If I were assembling a reference stack today, I would prototype with **LangGraph or Microsoft Agent Framework** as the agent-native coordination layer, use **Temporal or Dapr** whenever durability/distributed operation matters, use **A2A + MCP** for interop boundaries, and put **OPA or AGT** plus **Prow/Backstage/OpenRewrite** around the repository and deployment surface. That combination is not elegant, but it is much closer to a real control substrate than any single repo currently available. ([GitHub][2])

[1]: https://github.com/microsoft/autogen "https://github.com/microsoft/autogen"
[2]: https://github.com/langchain-ai/langgraph "https://github.com/langchain-ai/langgraph"
[3]: https://docs.langchain.com/oss/python/langgraph/overview "https://docs.langchain.com/oss/python/langgraph/overview"
[4]: https://github.com/microsoft/agent-framework "https://github.com/microsoft/agent-framework"
[5]: https://learn.microsoft.com/en-us/agent-framework/workflows/ "https://learn.microsoft.com/en-us/agent-framework/workflows/"
[6]: https://learn.microsoft.com/en-us/agent-framework/overview/ "https://learn.microsoft.com/en-us/agent-framework/overview/"
[7]: https://github.com/openai/openai-agents-python "https://github.com/openai/openai-agents-python"
[8]: https://developers.openai.com/api/docs/guides/agents/orchestration "https://developers.openai.com/api/docs/guides/agents/orchestration"
[9]: https://github.com/google/adk-python "https://github.com/google/adk-python"
[10]: https://adk.dev/agents/multi-agents/ "https://adk.dev/agents/multi-agents/"
[11]: https://github.com/google/adk-python/releases "https://github.com/google/adk-python/releases"
[12]: https://github.com/a2aproject/A2A "https://github.com/a2aproject/A2A"
[13]: https://github.com/a2aproject/A2A/releases "https://github.com/a2aproject/A2A/releases"
[14]: https://github.com/modelcontextprotocol/modelcontextprotocol "https://github.com/modelcontextprotocol/modelcontextprotocol"
[15]: https://modelcontextprotocol.io/specification/2025-06-18 "https://modelcontextprotocol.io/specification/2025-06-18"
[16]: https://github.com/microsoft/agent-governance-toolkit "https://github.com/microsoft/agent-governance-toolkit"
[17]: https://github.com/microsoft/agent-governance-toolkit/blob/main/FAQ.md "https://github.com/microsoft/agent-governance-toolkit/blob/main/FAQ.md"
[18]: https://github.com/microsoft/agent-governance-toolkit/blob/main/RELEASE_NOTES_v3.1.0.md "https://github.com/microsoft/agent-governance-toolkit/blob/main/RELEASE_NOTES_v3.1.0.md"
[19]: https://github.com/i-am-bee/beeai-framework "https://github.com/i-am-bee/beeai-framework"
[20]: https://github.com/i-am-bee/beeai-framework/releases "https://github.com/i-am-bee/beeai-framework/releases"
[21]: https://github.com/temporalio/temporal "GitHub - temporalio/temporal: Temporal service · GitHub"
[22]: https://docs.temporal.io/workflows "https://docs.temporal.io/workflows"
[23]: https://github.com/dapr/dapr "GitHub - dapr/dapr: Dapr is a portable runtime for building distributed applications across cloud and edge, combining event-driven architecture with workflow orchestration. · GitHub"
[24]: https://github.com/open-policy-agent/OPA "GitHub - open-policy-agent/opa: Open Policy Agent (OPA) is an open source, general-purpose policy engine. · GitHub"
[25]: https://github.com/open-policy-agent/opa/releases "https://github.com/open-policy-agent/opa/releases"
[26]: https://github.com/kubernetes-sigs/prow "https://github.com/kubernetes-sigs/prow"
[27]: https://docs.prow.k8s.io/ "Prow"
[28]: https://zuul-ci.org/?utm_source=chatgpt.com "Zuul is an open source CI tool"
[29]: https://acmegating.com/docs/zuul/latest/tutorials/quick-start.html?utm_source=chatgpt.com "Quick-Start Installation and Tutorial — Zuul documentation"
[30]: https://zuul-ci.org/docs/zuul/latest/releasenotes.html?utm_source=chatgpt.com "Release Notes — Zuul documentation"
[31]: https://github.com/backstage/backstage "https://github.com/backstage/backstage"
[32]: https://backstage.io/docs/features/software-templates/ "https://backstage.io/docs/features/software-templates/"
[33]: https://github.com/backstage/backstage/releases "https://github.com/backstage/backstage/releases"
[34]: https://github.com/openrewrite/rewrite "https://github.com/openrewrite/rewrite"
[35]: https://docs.openrewrite.org/concepts-and-explanations/lossless-semantic-trees "https://docs.openrewrite.org/concepts-and-explanations/lossless-semantic-trees"
[36]: https://github.com/openrewrite/rewrite/releases?utm_source=chatgpt.com "Releases · openrewrite/rewrite"
[37]: https://github.com/kubernetes-sigs/prow/blob/main/site/content/en/docs/components/core/tide/pr-authors.md "https://github.com/kubernetes-sigs/prow/blob/main/site/content/en/docs/components/core/tide/pr-authors.md"
[38]: https://docs.langchain.com/oss/python/langgraph/pregel "https://docs.langchain.com/oss/python/langgraph/pregel"
[39]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/ "https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/"
[40]: https://docs.prow.k8s.io/docs/components/plugins/ "https://docs.prow.k8s.io/docs/components/plugins/"
[41]: https://zuul-ci.org/docs/zuul/3.6.0/user/gating.html "https://zuul-ci.org/docs/zuul/3.6.0/user/gating.html"
[42]: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals"
[43]: https://agent2agent.info/docs/concepts/task/ "https://agent2agent.info/docs/concepts/task/"
