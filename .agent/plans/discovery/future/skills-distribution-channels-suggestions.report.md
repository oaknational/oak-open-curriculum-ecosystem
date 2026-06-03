---
title: "Skills, MCP, Plugins, and Oak Capability Packaging"
collection: discovery
lane: future
status: strategy-report
last_updated: 2026-06-03
---

# Skills, MCP, Plugins, and Oak Capability Packaging

**Date:** 2026-06-03  
**Audience:** Oak Open Curriculum Ecosystem, Agent Tooling, Curriculum AI, Developer Experience  
**Purpose:** Establish a strategic position on Skills, MCP, plugin-style bundles, and Oak’s taxonomy for repo-working, developer-facing, and teacher-facing agent capabilities.

---

## 1. Executive summary

Skills are no longer merely a vendor-local convention. There is now a credible open **Agent Skills** format: a skill is a directory containing `SKILL.md`, optional supporting files such as scripts, references, and assets, and metadata that allows an agent host to progressively load the right procedural knowledge at the right time.

However, that does **not** mean the ecosystem has solved skill discovery, fetching, installation, permissions, registry governance, or cross-vendor plugin packaging.

The current state is best described as follows:

| Layer | Current status | Strategic implication for Oak |
|---|---|---|
| **Agent Skills** | A real open artifact format now exists. OpenAI and Claude both support skill-like bundles, with vendor-specific extensions. | Use Agent Skills as one packaging target, not as the whole conceptual model. |
| **MCP** | MCP standardizes runtime access to tools, resources, and prompts. It does not yet standardize “skills” as first-class packages. | Use MCP for live Oak curriculum data, search, graph, assets, and external service access. Do not wait for MCP to become a skill registry. |
| **Plugins / bundles** | OpenAI Codex and Claude Code both now use plugin-style packaging that can include skills plus MCP servers and other agent extensions. | Treat plugins as an emerging composition layer, but not yet a vendor-neutral standard. |
| **Oak repo-working skills** | Oak already has repo-working Practice skills aimed at agents working in `oak-open-curriculum-ecosystem`. | Keep these under Practice governance and avoid leaking this vocabulary into teacher/developer-facing surfaces. |
| **Oak developer capabilities** | Oak needs agent/developer guidance for using APIs, SDKs, MCP, semantic search, graph, and open curriculum data correctly. | Call these “developer capabilities” or “developer capability packs”; package them as Skills or plugins only when useful. |
| **Curriculum assistance capabilities** | Oak is developing teacher-facing capabilities that use Oak data via MCP apps in ChatGPT, Claude, and similar hosts. | Call these “curriculum assistance capabilities”; teacher-facing language should not expose repo, Practice, or platform mechanics. |

The key recommendation is:

> Oak should standardize on **audience-led capability vocabulary** and treat Skills, MCP servers, and plugins as packaging/runtime mechanisms.

That means:

- **Repo-working skills** remain skills, because they are Practice-governed workflows for agents working in the repo.
- **Oak developer capabilities** are not “skills” in the primary vocabulary, even if they are later emitted as `SKILL.md` packages.
- **Curriculum assistance capabilities** are not “skills” in teacher-facing vocabulary, even if they are powered by Agent Skills, MCP tools, or plugins.
- **Plugins** should be treated as an installable bundle shape, not yet a cross-vendor standard.

---

## 2. The core distinction Oak must preserve

Oak now has at least three adjacent but distinct things that can all be accidentally called “skills”.

The attached taxonomy plan already identifies the right split:

1. **Repo-working skills**  
   Practice-governed workflows for agents working inside the `oak-open-curriculum-ecosystem` repo.

2. **Oak developer capabilities**  
   Agent-readable or developer-readable guidance for using Oak technical services correctly: APIs, SDKs, MCP, search, graph, open data, and related integration surfaces.

3. **Curriculum assistance capabilities**  
   Teacher- and educator-facing assistance for curriculum discovery, lesson planning, sequencing, evidence, pedagogy, adaptation, and explanation, powered by Oak curriculum data.

This split matters because each category has a different audience, governance boundary, safety model, and success metric.

| Category | Primary user | Governance owner | Typical runtime | Public vocabulary |
|---|---|---|---|---|
| Repo-working skills | Agents and developers modifying the repo | Practice / agent tooling | Claude Code, Codex, Cursor, local repo agents | “repo-working skills” or “Practice skills” |
| Oak developer capabilities | Developers and agents integrating Oak services | Developer Experience / platform | SDK, API, MCP server, docs, examples | “developer capabilities” |
| Curriculum assistance capabilities | Teachers, educators, curriculum users | Curriculum / product / pedagogy | ChatGPT app, Claude app, MCP app, assistant UX | “curriculum assistance capabilities” |

The naming distinction is not cosmetic. It prevents three forms of leakage:

- **Governance leakage:** internal Practice rules accidentally appearing in teacher-facing products.
- **Mechanism leakage:** `SKILL.md`, adapter paths, Claude/Codex mechanics, or repo structure becoming part of user-facing language.
- **Audience leakage:** developer capabilities being framed as if they are teacher workflows, or teacher workflows being reviewed under repo-maintenance criteria.

---

## 3. Current ecosystem state

### 3.1 Agent Skills: an artifact format now exists

The modern Agent Skills pattern is a directory-based package:

```text
my-skill/
  SKILL.md
  references/
  scripts/
  assets/
```

The important properties are:

- `SKILL.md` is the entrypoint.
- Frontmatter contains machine-readable metadata, especially `name` and `description`.
- The body contains instructions for the agent.
- Supporting files are loaded only when relevant.
- Skill descriptions act as activation metadata.
- Scripts and assets can make a skill more deterministic or reusable.
- The model should not need to load every detail of every skill at startup.

This is a strong format because it is:

- filesystem-native;
- easy to version in Git;
- easy to package as a zip;
- readable by humans and agents;
- compatible with progressive disclosure;
- usable by multiple hosts with adapters.

For Oak, the key point is that this is a good **capability packaging format**, not necessarily the right public noun for every capability.

### 3.2 OpenAI Skills: hosted and local environment packaging

OpenAI now treats Skills as versioned bundles of files plus `SKILL.md`, compatible with the open Agent Skills pattern. They can be uploaded as directories or zips, then attached to model environments.

This is strategically important because it shows Skills becoming an API-level artifact, not just a UI convention.

However, OpenAI Skills do not by themselves solve the wider ecosystem problem of:

- universal discovery;
- cross-vendor registries;
- signed package distribution;
- dependency resolution;
- permission negotiation;
- compatibility across ChatGPT, Claude, Codex, Cursor, Gemini, and future hosts.

OpenAI has one product implementation. Claude has another. Other hosts have or will have their own.

### 3.3 Claude Skills: open standard plus vendor extensions

Claude Code also supports Skills and describes them as following the open Agent Skills standard, while adding Claude-specific extensions such as allowed tools, invocation control, and plugin integration.

Claude’s model is especially relevant because it explicitly distinguishes:

- project skills;
- personal skills;
- enterprise skills;
- plugin-provided skills.

That reinforces the point that **Skill** is a host mechanism and package type. It is not automatically the right concept name for every audience.

### 3.4 MCP: runtime protocol, not skill packaging

MCP is now the strongest emerging standard for connecting models to live external capabilities.

MCP standardizes things like:

- **tools**: callable functions;
- **resources**: URI-addressed data and context;
- **prompts**: reusable prompt templates or structured interaction patterns;
- host/client/server architecture;
- capability negotiation;
- JSON-RPC message exchange.

MCP is excellent for Oak because Oak has rich live data and structured curriculum APIs. MCP can expose:

- curriculum search;
- lesson fetch;
- unit summaries;
- prerequisite graphs;
- thread progressions;
- downloadable asset metadata;
- quiz data;
- transcripts;
- subject and key-stage browsing;
- EEF or evidence-linked context where appropriate.

But MCP does **not** currently define a first-class core primitive such as:

```text
skills/list
skills/get
skills/install
skills/activate
skills/manifest
```

A future MCP server could expose skill-like content by convention, for example:

```text
resources/list
  skill://oak/curriculum-assistance/SKILL.md
  skill://oak/curriculum-assistance/references/planning-playbook.md

tools/list
  fetch_skill_archive
  validate_skill
  install_skill

prompts/list
  oak_lesson_planning_workflow
  oak_curriculum_sequence_explainer
```

But that would be a convention layered on MCP, not a settled MCP standard.

The correct mental model is:

> MCP gives the agent live hands. Skills give the agent procedural memory. Plugins bundle both into an installable product surface.

### 3.5 Plugins: product convergence, not yet ecosystem standard

Both OpenAI Codex and Claude Code now use plugin-style concepts.

OpenAI Codex plugins can bundle:

- Skills;
- app integrations;
- MCP servers.

Claude Code plugins can bundle:

- Skills;
- agents;
- hooks;
- MCP servers;
- slash commands;
- other runtime extensions.

This is a major signal. The ecosystem is converging on the idea that agent extensions are not just one thing. A useful installed package often needs:

- instructions;
- examples;
- MCP servers;
- permissions;
- auth;
- tools;
- hooks;
- rules;
- agents;
- templates;
- assets.

That is exactly the “collection of MCP, skills, rules, etc.” shape.

But there is not yet a neutral standard equivalent to:

```text
plugin.json
skills/
mcp-servers/
rules/
hooks/
agents/
permissions/
lockfile
signatures
```

Each vendor is building something similar, but product-specific.

The strategic opportunity is to design Oak’s internal source of truth so it can emit to future standards without being locked into today’s plugin format.

---

## 4. Direct answers to the foundational questions

### 4.1 Is there still no canonical way to surface or fetch Skills?

There is now a canonical-ish **format**.

There is not yet a canonical cross-vendor **distribution protocol**.

| Question | Answer |
|---|---|
| Is there a standard-ish skill artifact? | Yes: Agent Skills with `SKILL.md` plus optional supporting files. |
| Can OpenAI manage uploaded Skills? | Yes, in OpenAI API environments. |
| Can Claude discover Skills? | Yes, with Claude-specific locations and extensions. |
| Is there a universal skill registry? | Not yet. |
| Is there a universal fetch/install/update protocol? | Not yet. |
| Is there a universal permission and trust model? | Not yet. |
| Is there a vendor-neutral plugin bundle manifest? | Not yet. |

So the previous statement “there is no canonical way” needs refinement:

> There is now a credible canonical **format**, but not yet a canonical **ecosystem distribution and discovery layer**.

### 4.2 Are there proposals to surface Skills via MCP?

No accepted first-class MCP Skill primitive appears to exist in the current core model.

MCP can represent adjacent parts:

| Skill need | MCP can model today? | Mechanism |
|---|---:|---|
| Instruction text | Partially | Prompt or resource |
| Reference files | Yes | Resources |
| Callable operations | Yes | Tools |
| Discovery metadata | Partially | Tool/resource/prompt descriptions |
| Installation | By convention only | Custom tools |
| Versioning | By convention only | Resource metadata or custom registry |
| Permission model | Partially | Host-mediated tool permissions and OAuth |
| Skill activation | No standard primitive | Host-specific selection logic |

An MCP-based skill registry is plausible, but it would need a profile or extension.

A possible future profile could look like:

```text
MCP Skill Registry Profile

resources/list:
  skill://publisher/package/version/SKILL.md
  skill://publisher/package/version/manifest.json
  skill://publisher/package/version/archive.zip

tools/list:
  search_skills
  fetch_skill
  validate_skill
  install_skill
  resolve_dependencies

prompts/list:
  skill_preview
  skill_install_review
```

But this is a future design space, not a settled standard.

### 4.3 Are plugins going to become a standard?

Plugins are already becoming a **product abstraction**.

They are not yet a **cross-vendor standard**.

The direction of travel is clear: agents need installable bundles that combine instructions, tools, MCP servers, permissions, examples, and sometimes agents/hooks. Both OpenAI and Claude have converged on this shape.

But the standardization layer is still missing.

A future standard would need to define:

- manifest schema;
- package layout;
- dependency declarations;
- MCP server declarations;
- skill declarations;
- rules and instruction precedence;
- permission requests;
- trust and provenance;
- signatures;
- lockfiles;
- marketplace metadata;
- compatibility targets;
- host-specific overrides;
- update behavior;
- deprecation behavior.

Until that exists, Oak should treat plugin formats as **adapter targets**.

---

## 5. Oak’s current position

Oak is in a strong but terminology-sensitive position.

The `oak-open-curriculum-ecosystem` repo already has a sophisticated agent tooling surface. It includes repo-working skills, adapter-standardization work, MCP/server/app infrastructure, SDK work, semantic search, and open curriculum data access.

The repo currently contains or references:

- repo-working skill surfaces;
- Claude and cross-tool skill adapter surfaces;
- a PDR for vendor-agnostic skill standardization;
- a plan for a deterministic skills adapter generator;
- a repo README describing SDK, MCP server, MCP app, semantic search, and AI-platform exploration;
- existing start-right workflows for agents working in the repo.

The most important Oak-specific finding is that Oak has two different future-facing audiences in addition to repo agents:

1. **Developers and technical agents** using Oak services.
2. **Teachers and educators** using Oak curriculum support via MCP apps in ChatGPT, Claude, and similar hosts.

Those audiences should not inherit repo-working “skills” language.

---

## 6. Oak taxonomy recommendation

Oak should adopt the following vocabulary as a durable internal and external taxonomy.

### 6.1 Repo-working skills

**Definition:**  
Practice-governed workflows for agents working in the Oak repo.

**Examples:**

- start-right workflows;
- undo/change workflows;
- repo health checks;
- architecture/ADR workflows;
- codebase navigation;
- PR preparation;
- migration assistance;
- quality gate orchestration.

**Audience:**  
Agents and developers working directly in the repo.

**Governance:**  
Practice / agent tooling.

**Packaging:**  
Agent Skills are appropriate. These can be `SKILL.md`-based and adapter-generated.

**Recommended term:**  
Use “repo-working skills” or “Practice skills”.

**Avoid:**  
Calling these simply “Oak skills” in contexts where teachers or external developers may read them.

---

### 6.2 Oak developer capabilities

**Definition:**  
Agent-readable and developer-readable guidance for using Oak technical services correctly.

**Examples:**

- how to use the Oak Curriculum SDK;
- how to query the MCP server;
- how to use semantic search;
- how to fetch lesson assets;
- how to interpret curriculum IDs;
- how to traverse units, lessons, threads, and prerequisites;
- how to combine Oak API data with ontology or evidence sources;
- how to build an AI application on top of Oak open curriculum data.

**Audience:**  
Developers, AI engineers, partner teams, and technical agents.

**Governance:**  
Developer Experience, platform, data, and architecture.

**Packaging:**  
Could be emitted as:

- docs;
- SDK examples;
- MCP prompts;
- Agent Skills;
- Codex/Claude plugins;
- app templates.

**Recommended term:**  
Use “Oak developer capabilities” or “developer capability packs”.

**Avoid:**  
Calling these “skills” in the primary vocabulary. They may be packaged as Skills, but their durable category is developer capability.

---

### 6.3 Curriculum assistance capabilities

**Definition:**  
Teacher- and educator-facing assistant behaviours powered by Oak curriculum data.

**Examples:**

- find lessons on a topic;
- compare units;
- explain a curriculum sequence;
- identify prerequisites;
- adapt a lesson for a class context;
- create a lesson plan using Oak materials;
- explain misconceptions;
- suggest retrieval practice;
- connect lesson planning to evidence-informed guidance;
- help teachers navigate available Oak resources.

**Audience:**  
Teachers, educators, curriculum leads, and potentially pupils indirectly through teacher-mediated planning.

**Governance:**  
Curriculum, product, pedagogy, safety, and evidence.

**Runtime:**  
MCP apps in ChatGPT or Claude, plus Oak-hosted APIs/search/graph.

**Packaging:**  
Could be emitted as:

- teacher-facing app instructions;
- MCP prompts;
- Agent Skills inside a host;
- Claude/OpenAI plugin bundles;
- app-level onboarding;
- guided workflows.

**Recommended term:**  
Use “curriculum assistance capabilities”.

**Avoid:**  
Teacher-facing language such as:

- “run the skill”;
- “invoke `SKILL.md`”;
- “use the repo skill”;
- “Practice workflow”;
- “adapter surface”;
- “canonical skill body”.

Teachers should experience this as Oak curriculum assistance, not as agent tooling.

---

## 7. Why `SKILL.md` must be treated as packaging

The most important conceptual move is to separate **capability** from **packaging**.

A capability is what the assistant can help with.

A skill is one way to package procedural knowledge for a host.

An MCP server is one way to expose live data and actions.

A plugin is one way to bundle multiple extension surfaces together.

The same Oak capability could be represented many ways:

| Capability | Skill packaging | MCP packaging | Plugin packaging | User-facing product |
|---|---|---|---|---|
| Find Oak lessons | Skill instructions for search workflow | `search` and `fetch` MCP tools | Teacher assistant plugin | “Find lessons” |
| Explain prerequisites | Skill playbook | prerequisite graph MCP resource/tool | Curriculum planning bundle | “What should pupils know first?” |
| Use Oak SDK correctly | Developer skill | API docs/resources | Developer plugin | “Build with Oak data” |
| Work safely in repo | Repo-working skill | GitHub tools/MCP optional | Codex/Claude plugin | “Repo agent workflow” |

Oak’s taxonomy plan is right to say that platform `SKILL.md` support should be treated as packaging unless it reveals a genuine audience or governance constraint.

---

## 8. Recommended Oak architecture

Oak should use a layered model.

```text
Layer 1: Oak data and services
  - Oak Open Curriculum data
  - API
  - SDK
  - semantic search
  - graph / ontology
  - assets
  - EEF or evidence-linked material where appropriate

Layer 2: Runtime access
  - MCP server
  - MCP app
  - API clients
  - SDK
  - search indexes

Layer 3: Capability definitions
  - repo-working skills
  - Oak developer capabilities
  - curriculum assistance capabilities

Layer 4: Packaging adapters
  - Agent Skills
  - Claude skills/plugins
  - OpenAI/Codex skills/plugins
  - ChatGPT app instructions
  - MCP prompts/resources
  - future standard plugin manifests

Layer 5: User experience
  - repo agent workflows
  - developer docs and examples
  - teacher-facing assistant workflows
```

The strategic source of truth should be Layer 3: **capability definitions**.

Skills and plugins should be emitted from that layer, not authored as the only conceptual source.

---

## 9. Proposed Oak canonical capability manifest

Oak should consider a small internal manifest for agent-readable capabilities. This should not replace `SKILL.md`; it should sit above it and generate or guide packaging.

Example:

```yaml
id: oak-curriculum-lesson-planning
audience: curriculum-assistance
status: draft
owner: curriculum-ai
display_name: Lesson planning with Oak curriculum
summary: >
  Helps teachers find, understand, and adapt Oak curriculum lessons and units
  using Oak's MCP-accessible curriculum data.

user_visible_name: Oak curriculum lesson planning
user_visible_description: >
  Find relevant Oak lessons, understand where they sit in the curriculum,
  and plan how to use them with a class.

not_user_visible:
  - repo paths
  - Practice governance
  - SKILL.md mechanics
  - adapter generation
  - internal skill naming

runtime_dependencies:
  mcp:
    - oak-curriculum.search
    - oak-curriculum.fetch
    - oak-curriculum.get-curriculum-model
    - oak-curriculum.get-prerequisite-graph
    - oak-curriculum.get-thread-progressions

packaging_targets:
  agent_skill: candidate
  chatgpt_mcp_app: yes
  claude_mcp_app: yes
  codex_plugin: no
  claude_code_plugin: no

permissions:
  reads:
    - oak-open-curriculum-data
    - lesson-metadata
    - unit-metadata
    - asset-metadata
  writes: []
  network:
    - oak-mcp-server

safety_notes:
  - Do not claim a lesson is appropriate for a class without teacher judgement.
  - Explain curriculum evidence and sequencing clearly.
  - Surface licensing or third-party asset constraints when resources are exported.
  - Ask clarifying questions only when teacher intent cannot be safely inferred.

example_intents:
  - Find me a Year 7 lesson on cells.
  - What should pupils know before this unit?
  - Help me plan a lesson sequence on fractions.
  - What Oak resources are available for KS2 electricity?
```

A developer capability would look different:

```yaml
id: oak-curriculum-api-developer
audience: developer
status: draft
owner: developer-experience
display_name: Oak curriculum API developer capability
summary: >
  Helps developers and agents use Oak APIs, SDKs, MCP tools, semantic search,
  and graph data correctly when building applications on Oak Open Curriculum.

runtime_dependencies:
  docs:
    - sdk-reference
    - mcp-tool-reference
    - openapi-schema
  mcp:
    - oak-curriculum.get-curriculum-model
    - oak-curriculum.search
    - oak-curriculum.fetch

packaging_targets:
  docs: yes
  agent_skill: candidate
  codex_plugin: candidate
  claude_code_plugin: candidate
  chatgpt_teacher_app: no

example_intents:
  - Build an app that searches Oak lessons.
  - Fetch lesson assets for a key stage and subject.
  - Understand curriculum entity IDs and slugs.
  - Use semantic search with subject and key-stage filters.
```

A repo-working skill would remain closer to current Practice packaging:

```yaml
id: oak-start-right-team
audience: repo-working
status: active
owner: practice
display_name: Oak start-right team workflow
summary: >
  Helps an agent start repo work correctly by reading the right context,
  respecting Practice rules, and selecting the appropriate workflow.

packaging_targets:
  agent_skill: yes
  claude_code_skill: yes
  cross_tool_skill: yes
  chatgpt_teacher_app: no

canonical_source:
  path: .agent/skills/oak-start-right-team/SKILL-CANONICAL.md

adapter_surfaces:
  - .agents/skills/
  - .claude/skills/
```

This sort of manifest would let Oak preserve its taxonomy while still generating platform-specific packaging.

---

## 10. Relationship to PDR-051

PDR-051 is still the right doctrine for **repo-working skills**.

Its core decisions are strong:

- canonical skill bodies should be non-discoverable source files;
- adapter generation should be deterministic;
- adapters should not be manually edited;
- duplicate vendor surfaces should be avoided;
- the cross-tool `.agents/skills/` surface plus Claude-native `.claude/skills/` surface is enough for current repo-working needs;
- custom command surfaces should be subsumed into skills where appropriate.

However, PDR-051 should not become the entire Oak capability doctrine.

It answers:

> How should this repo author and emit platform skills for agents working in the repo?

It does not fully answer:

> How should Oak describe, package, and govern teacher-facing curriculum assistance?

Nor does it fully answer:

> How should Oak expose developer-facing capability packs around APIs, SDKs, MCP, search, and graph?

The attached taxonomy plan fills that gap.

The relationship should be:

```text
agent-capability-vocabulary.md
  defines the three audience categories

PDR-051
  governs repo-working skill packaging and adapter generation

Developer capability docs/manifests
  govern external technical capability packaging

Curriculum assistance capability docs/manifests
  govern teacher-facing assistant behaviour

Platform adapters
  emit Skills, MCP prompts/resources, plugins, and app packaging
```

---

## 11. Recommended public vocabulary

Oak should be disciplined about the nouns it uses.

### 11.1 Use “skill” only in these contexts

Use **skill** when referring to:

- platform Agent Skills;
- `SKILL.md` packages;
- repo-working Practice workflows;
- generated skill adapters;
- imported third-party skill packs;
- host-specific skill menus.

Examples:

```text
repo-working skill
Practice skill
Agent Skill package
generated skill adapter
Claude skill
OpenAI skill
```

### 11.2 Use “capability” for durable audience-facing categories

Use **capability** when referring to what an assistant can do for a user.

Examples:

```text
Oak developer capability
curriculum assistance capability
lesson-planning capability
curriculum discovery capability
developer integration capability
```

### 11.3 Use “plugin” or “bundle” for installable compositions

Use **plugin** or **bundle** when referring to a package that includes multiple extension surfaces.

Examples:

```text
Oak developer plugin
Oak curriculum assistance bundle
Codex plugin
Claude Code plugin
MCP app bundle
```

### 11.4 Teacher-facing language should avoid implementation mechanics

Teacher-facing terms should be:

```text
assistant
curriculum support
lesson planning help
Oak curriculum search
teaching sequence support
resource discovery
```

Teacher-facing terms should avoid:

```text
skill
SKILL.md
adapter
canonical body
Practice
repo workflow
MCP tool schema
plugin manifest
```

The teacher can benefit from MCP and Skills without needing to know those terms.

---

## 12. Recommended packaging strategy for Oak

### 12.1 Near term: do not wait for a standard plugin format

Oak should not wait for the ecosystem to settle.

Instead, Oak should:

1. Adopt the three-category vocabulary now.
2. Keep repo-working skills under PDR-051.
3. Define canonical capability manifests for developer and teacher capabilities.
4. Emit platform packages from those manifests as needed.
5. Treat all vendor-specific plugin systems as adapters.

### 12.2 Medium term: build two pilot capability packs

Oak should pilot two non-repo capability packs.

#### Pilot A: Oak developer capability pack

Purpose:

> Help developers and technical agents build on Oak Open Curriculum using API, SDK, MCP, semantic search, and graph data.

Likely contents:

```text
capabilities/developer/oak-curriculum-api/
  capability.yaml
  instructions.md
  examples/
  references/
  packaging/
    agent-skill/
    claude-code-plugin/
    codex-plugin/
```

Likely workflows:

- discover curriculum model;
- search lessons;
- fetch lesson metadata;
- fetch assets and licensing context;
- inspect units and threads;
- use prerequisite graph;
- combine SDK and MCP patterns;
- handle IDs and slugs correctly.

#### Pilot B: Curriculum assistance capability pack

Purpose:

> Help teachers use Oak curriculum data through ChatGPT or Claude via an MCP app.

Likely contents:

```text
capabilities/curriculum-assistance/oak-teacher-planning/
  capability.yaml
  teacher-facing-instructions.md
  pedagogy-guidance.md
  evidence-use.md
  safety-and-boundaries.md
  packaging/
    chatgpt-mcp-app/
    claude-mcp-app/
    agent-skill/
```

Likely workflows:

- find lessons and units;
- explain sequence and progression;
- identify prerequisites;
- suggest retrieval or practice activities;
- adapt explanations;
- surface misconceptions;
- cite Oak lesson/unit evidence;
- preserve teacher agency.

### 12.3 Long term: prepare for a portable plugin standard

Oak should assume a future plugin standard may emerge.

That future standard may look like:

```text
oak-curriculum-assistant.plugin/
  plugin.yaml
  skills/
  prompts/
  mcp/
  rules/
  assets/
  permissions.yaml
  lockfile.json
  signatures/
```

Oak should not bet on any single vendor’s version of this yet.

Instead, Oak should maintain a canonical internal model that can emit:

- OpenAI/Codex plugin;
- Claude Code plugin;
- ChatGPT app configuration;
- MCP prompt/resource conventions;
- future neutral plugin standard.

---

## 13. Security, trust, and governance implications

Skills and plugins are not just documentation. They can shape model behaviour, invoke tools, read files, call MCP servers, and sometimes run scripts.

For Oak, the relevant risks are:

### 13.1 Supply-chain risk

A skill or plugin may contain:

- hidden instructions;
- scripts;
- misleading examples;
- unsafe tool preferences;
- stale API assumptions;
- incompatible host metadata;
- unexpected MCP dependencies.

Mitigations:

- pin versions;
- record source and hash;
- maintain lockfiles for ingested skills;
- review `SKILL.md` descriptions and activation triggers;
- require deterministic adapter generation;
- avoid manual adapter edits;
- distinguish owned from ingested skills.

### 13.2 Audience confusion risk

If teacher-facing capabilities are described as “skills”, teachers may see implementation vocabulary instead of product value.

Mitigations:

- teacher-facing docs use curriculum assistance language;
- internal packaging docs can mention Skills;
- generated platform descriptions should be reviewed for audience fit.

### 13.3 Data and licensing risk

Teacher-facing capabilities may fetch or recommend resources, including downloadable assets. Oak must preserve licensing and third-party-content constraints.

Mitigations:

- include licensing notes in assistant responses when assets are exported or reused;
- design MCP tools to expose license metadata;
- encode teacher-facing safety guidance in the capability pack;
- avoid overclaiming what teachers may legally reuse.

### 13.4 Pedagogical authority risk

A curriculum assistant can sound authoritative. It should support teacher judgement rather than replace it.

Mitigations:

- state assumptions;
- cite curriculum evidence;
- distinguish Oak content from generated adaptation;
- ask for class context when needed;
- avoid claiming universal suitability.

### 13.5 Permission and action risk

Developer and repo-working capabilities may call tools that modify files, branches, issues, or PRs.

Mitigations:

- separate read-only teacher capabilities from write-capable repo/developer capabilities;
- declare allowed tools;
- use host permission prompts;
- avoid bundling write-capable repo workflows with teacher-facing curriculum assistance.

---

## 14. Proposed implementation plan

### Phase 1: Vocabulary adoption

Create or promote the vocabulary surface described by the taxonomy plan.

Minimum durable terms:

```text
repo-working skills
Oak developer capabilities
curriculum assistance capabilities
platform skills
plugin bundles
MCP runtime tools
```

Actions:

- audit current uses of “skill”, “capability”, “developer”, “teacher”, “educator”, “MCP”, “search”, and “curriculum”;
- replace mechanism-led wording with audience-led wording;
- add examples for each category;
- explicitly say `SKILL.md` is packaging.

### Phase 2: Inventory existing artifacts

Create an inventory table:

| Artifact | Current path | Audience | Governance | Packaging | Status |
|---|---|---|---|---|---|
| oak-start-right-team | repo skill path | repo-working | Practice | Skill | active |
| undo-change | repo skill path | repo-working | Practice | Skill | active |
| Oak SDK guidance | docs / future capability | developer | DevEx | docs / skill candidate | candidate |
| Curriculum lesson planning | future capability | teacher | Curriculum/Product | MCP app / skill candidate | draft |
| Curriculum search workflow | future capability | teacher/developer split | Product/DevEx | MCP prompt / skill candidate | draft |

This will expose ambiguous cases early.

### Phase 3: Complete repo-working skill standardization

Continue or complete the PDR-051 implementation path:

- canonical non-discoverable source files;
- generated adapters;
- exactly two repo skill adapter surfaces where current doctrine says so;
- no manual adapter edits;
- command surfaces retired or converted;
- validator and drift gates enforced.

This should be scoped explicitly to repo-working skills.

### Phase 4: Define developer capability pack

Create a developer capability pack around Oak Open Curriculum technical use.

Include:

- curriculum domain model;
- API and SDK usage;
- MCP tool usage;
- search patterns;
- graph and prerequisite usage;
- asset and license handling;
- examples for app builders;
- known pitfalls.

Packaging targets:

- docs first;
- Agent Skill package second;
- Codex/Claude plugin only after the capability is stable.

### Phase 5: Define curriculum assistance capability pack

Create a teacher-facing capability pack around curriculum assistance.

Include:

- teacher-facing workflows;
- examples of lesson discovery;
- examples of unit/sequence explanation;
- prerequisite explanations;
- adaptation guidance;
- evidence and licensing notes;
- safety boundaries;
- tone and UX guidance.

Packaging targets:

- ChatGPT/Claude MCP app behaviour;
- MCP prompts/resources where useful;
- Agent Skill package only as an implementation detail;
- plugin bundle when distribution requires it.

### Phase 6: Adapter generation for capability packages

Build a generator that emits platform packages from canonical capability manifests.

Potential targets:

```text
dist/agent-skills/
dist/claude-plugin/
dist/codex-plugin/
dist/chatgpt-app/
dist/mcp-prompts/
```

This mirrors the logic of PDR-051 but applies to capability packs rather than repo-working Practice skills.

### Phase 7: Monitor standards and adapt

Track:

- Agent Skills spec changes;
- MCP spec changes;
- MCP registry or package proposals;
- OpenAI plugin publishing;
- Claude plugin marketplaces;
- tool permission models;
- signed package conventions;
- emerging OCI-style agent package formats.

Oak should be ready to adopt a neutral standard without renaming its core categories.

---

## 15. Suggested decision record

Oak should consider a short decision record along these lines.

```markdown
# ADR/PDR: Audience-led agent capability taxonomy

## Decision

Oak distinguishes three categories of agent-readable workflow and knowledge surface:

1. Repo-working skills
2. Oak developer capabilities
3. Curriculum assistance capabilities

`SKILL.md`, Agent Skills, MCP prompts/resources/tools, and plugins are packaging or runtime mechanisms. They do not determine the durable category name.

## Consequences

- Repo-working Practice workflows may continue to be called skills.
- Developer-facing guidance is called developer capability.
- Teacher-facing guidance is called curriculum assistance capability.
- Any category may later be packaged as an Agent Skill.
- Plugin bundles are generated packaging artifacts, not the source taxonomy.
- Teacher-facing copy must not expose repo-working or platform adapter mechanics.
```

---

## 16. Strategic watchlist

Oak should watch these ecosystem developments closely.

### 16.1 MCP skill registry proposals

Key question:

> Does MCP add or standardize a package discovery profile for skills, prompts, apps, or plugins?

Impact:

- Could replace custom registry conventions.
- Could let Oak expose capability packs through an MCP registry server.
- Could make Oak curriculum assistance discoverable across hosts.

### 16.2 OpenAI plugin publishing

Key question:

> Does OpenAI generalize Codex plugins beyond Codex and expose stable plugin manifests?

Impact:

- Could become a distribution channel for Oak developer packs.
- Could eventually support ChatGPT teacher-facing capability bundles.
- Would require careful review of teacher-facing language and permissions.

### 16.3 Claude plugin marketplaces

Key question:

> Does Claude’s plugin ecosystem become a de facto package format?

Impact:

- Could be useful for developer and code-agent workflows.
- Less likely to be the primary teacher-facing distribution path unless Claude app UX supports it cleanly.

### 16.4 Agent Skills spec evolution

Key question:

> Does the Agent Skills spec add dependency, permission, signature, or registry fields?

Impact:

- Oak may be able to simplify its manifest.
- Oak should avoid inventing fields that conflict with likely future standard fields.

### 16.5 Permission and provenance standards

Key question:

> Do hosts converge on signed skills/plugins, lockfiles, publisher identity, and permission review?

Impact:

- Essential for enterprise trust.
- Especially important if Oak distributes teacher-facing or developer-facing packages externally.

---

## 17. Recommended position statement

Oak’s position should be:

> Oak uses Skills as one packaging mechanism for agent-readable workflows, MCP as the runtime protocol for live curriculum and service access, and plugin bundles as emerging host-specific distribution packages. Oak’s durable taxonomy is audience-led: repo-working skills, Oak developer capabilities, and curriculum assistance capabilities. Platform-specific files such as `SKILL.md` are implementation details unless the audience is explicitly an agent or developer working with that platform.

This position is robust because it:

- aligns with current Agent Skills adoption;
- avoids overfitting to OpenAI or Claude plugin models;
- preserves Oak’s Practice governance boundary;
- creates clean teacher-facing language;
- gives developers a clear capability model;
- leaves room for future MCP or plugin standards.

---

## 18. Final recommendation

Oak should move now on taxonomy and architecture, rather than waiting for the ecosystem to settle.

The practical path is:

1. Accept the three-category vocabulary.
2. Keep PDR-051 focused on repo-working skills.
3. Promote or implement the taxonomy plan when the next concrete plugin, MCP guidance, or capability package appears.
4. Create canonical capability manifests for developer and curriculum assistance surfaces.
5. Use adapters to emit Agent Skills, MCP prompt/resource conventions, and vendor plugins.
6. Keep teacher-facing products free of repo and platform mechanics.
7. Track MCP/plugin standardization and be ready to emit to it when it stabilizes.

The central architectural principle is:

> **Capability first, packaging second.**

For Oak, that means the repo can continue to have skills, developers can receive capabilities, teachers can receive curriculum assistance, and all of them can still be packaged through Skills, MCP, or plugins when the host requires it.
