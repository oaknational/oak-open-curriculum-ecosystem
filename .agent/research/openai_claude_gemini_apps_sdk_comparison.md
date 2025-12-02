# Comparison of OpenAI Apps SDK, Anthropic Claude, and Google Gemini

## Focus: Embedded tools & branded, context-aware experiences

_Last updated: 2025-12-02._  
_This document compares how OpenAI, Anthropic, and Google let you build “apps inside the assistant” — i.e., embedded tools or themed, branded experiences with context-dependent formatting._

---

## 1. Scope & mental model

When you say **“embedded tools / themed, branded experiences with context-dependent formatting”**, there are four layers that matter:

1. **Protocol layer (how tools connect)**
   - The main cross-vendor standard here is **Model Context Protocol (MCP)**, an open standard for connecting AI apps to external systems ([modelcontextprotocol.io](https://modelcontextprotocol.io); [specification](https://modelcontextprotocol.io/specification/2025-03-26/index)).
   - MCP defines **servers** that expose _resources, prompts, and tools_ and **clients/hosts** that connect to them.

2. **Assistant host layer (ChatGPT, Claude, Gemini app, etc.)**
   - How the assistant itself discovers, invokes, and visually surfaces tools/apps.

3. **Tool / agent layer (API)**
   - Tool/function calling, server-side tools, code execution, agent frameworks, etc.

4. **UI / experience layer**
   - How the assistant renders **custom UI** (widgets, layouts, interactive canvases) instead of just plain text.

Very roughly:

- **OpenAI Apps SDK** = MCP + ChatGPT as host + **formal UI/component spec** for in-chat apps.
- **Anthropic Claude** = MCP + rich tool/agent layer + **desktop/code extensions**; UI is mostly chat-first with lighter theming/metadata.
- **Google Gemini** = Function-calling tools + first-party extensions + **Generative UI / Dynamic View** inside Gemini & Search; third‑party UI APIs are more limited/experimental today.

The rest of this doc unpacks each vendor against those four layers.

---

## 2. Model Context Protocol (MCP) in brief

**What it is.**  
MCP is an open-source protocol for connecting AI apps to external tools, data, and services ([overview](https://modelcontextprotocol.io/); [FAQs](https://modelcontextprotocol.io/faqs)). It standardizes:

- **Servers** that expose:
  - **Tools** (functions an LLM can call) ([tools spec](https://modelcontextprotocol.io/specification/draft/server/tools))
  - **Resources** (data, files, APIs)
  - **Prompts** (templated workflows)
- **Clients/hosts** (like ChatGPT, Claude Desktop, Claude Code, IDEs) that connect to one or more servers.

**Origin & adoption.**

- MCP was introduced as an open standard by Anthropic in late 2024 ([Anthropic MCP announcement referenced in ITPro](https://www.itpro.com/technology/artificial-intelligence/what-is-model-context-protocol-mcp)).
- The spec and tooling now live at [modelcontextprotocol.io](https://modelcontextprotocol.io) and on GitHub ([modelcontextprotocol organization](https://github.com/modelcontextprotocol)).
- ITPro notes that within months, **OpenAI** and **Google DeepMind** had adopted MCP in their ecosystems ([ITPro article](https://www.itpro.com/technology/artificial-intelligence/what-is-model-context-protocol-mcp)).

**Why it matters for you.**

If you implement your core logic as an **MCP server**, you can:

- Plug into **ChatGPT Apps** via the OpenAI Apps SDK.
- Plug into **Claude** via the MCP connector and Desktop/Code integrations.
- Plug into **other MCP-capable hosts** (IDEs, browsers, custom frontends) without re-implementing integrations.

So MCP is the “USB-C” for tools; each vendor then adds its own **UI and hosting story on top**.

---

## 3. OpenAI: Apps SDK + MCP (ChatGPT apps)

### 3.1. Positioning

OpenAI’s **Apps SDK** is explicitly framed as a way to build **apps that run inside ChatGPT**, with both logic and UI defined by the developer and surfaced contextually in chat:

- Apps are “a new generation of apps you can chat with, right inside ChatGPT” and appear when ChatGPT suggests them or when invoked by name ([OpenAI apps blog](https://openai.com/index/introducing-apps-in-chatgpt/)).
- Developers build these using the **Apps SDK**, an open standard built on MCP, which lets them design “both the logic and interface of their apps” ([same blog](https://openai.com/index/introducing-apps-in-chatgpt/); [Apps SDK docs](https://developers.openai.com/apps-sdk)).
- The SDK is open source and intended to work in any host that adopts the standard ([Apps SDK docs](https://developers.openai.com/apps-sdk); [Apps SDK examples repo](https://github.com/openai/openai-apps-sdk-examples)).

For your specific interest (“embedded tools / branded experiences with context-dependent formatting”), OpenAI currently has the **clearest, most formalized story**.

### 3.2. Architecture (conceptual)

High-level architecture (simplified):

1. **MCP server (your backend)**
   - You implement an MCP server that exposes your tools, data, and prompts.
   - MCP tools are defined with names, descriptions, and JSON schemas per the MCP spec ([MCP tools spec](https://modelcontextprotocol.io/specification/draft/server/tools)).
   - OpenAI provides documentation and examples for building such servers ([MCP guide in Apps docs](https://developers.openai.com/apps-sdk/concepts/mcp-server); [example servers](https://github.com/openai/openai-apps-sdk-examples)).

2. **ChatGPT as MCP host**
   - ChatGPT runs an MCP client internally and connects to your server when the user installs or invokes your app ([Apps SDK docs](https://developers.openai.com/apps-sdk)).
   - The host can list your tools, call them, and stream results back.

3. **Widget runtime & custom UI**
   - A key extension beyond “plain MCP” is the **Apps UI layer**:
     - OpenAI ships a React-based **Apps SDK UI** library: a design system tuned for ChatGPT apps ([apps-sdk-ui repo](https://github.com/openai/apps-sdk-ui)).
     - The UI library exposes **pre-styled components** (buttons, forms, cards, modals, layout primitives) and design tokens for typography, spacing, etc., intended to make your app “feel native to ChatGPT” while still allowing branding.
     - Your UI runs as HTML/JS in a sandboxed “widget runtime” that ChatGPT can embed in the chat (this is described across the Apps SDK docs and examples: [Apps SDK UI](https://github.com/openai/apps-sdk-ui), [Apps examples gallery](https://github.com/openai/openai-apps-sdk-examples)).

4. **App metadata & discovery**
   - You define an app manifest and metadata (name, icon, categories, etc.) that ChatGPT uses for:
     - Surfacing apps contextually in conversation.
     - Rendering app tiles in the **forthcoming app directory** ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/); [developer guidelines](https://developers.openai.com/apps-sdk/resources/app-developer-guidelines)).

5. **Authentication & state**
   - Apps can integrate authentication so users can log into existing accounts and access premium features ([Apps SDK “Authenticate users” guide](https://developers.openai.com/apps-sdk/build/authenticate-users)).
   - There are patterns for storing per-user state and linking ChatGPT sessions to your backend ([manage state guide](https://developers.openai.com/apps-sdk/build/manage-state)).

### 3.3. Developer workflow (short version)

In practice, building an app usually looks like:

1. **Plan**
   - Identify use cases & UX flows ([Research use cases](https://developers.openai.com/apps-sdk/plan/research-use-cases)).
   - Translate them into **MCP tools** and **UI components**.

2. **Build**
   - Implement an **MCP server** with your tools and prompts ([Build your MCP server](https://developers.openai.com/apps-sdk/build/set-up-your-server)).
   - Build a **ChatGPT UI** using the Apps SDK UI library (React + design tokens) ([Build your ChatGPT UI](https://developers.openai.com/apps-sdk/build/build-your-chatgpt-ui); [apps-sdk-ui](https://github.com/openai/apps-sdk-ui)).
   - Host the server & widget code on your infra.

3. **Connect & test**
   - Connect your app to ChatGPT in **Developer Mode** and test the flows ([Quickstart](https://developers.openai.com/apps-sdk/quickstart)).

4. **Publish**
   - Later in the preview, you’ll submit apps for review and listing in the ChatGPT app directory, with potential monetization ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/)).

### 3.4. Capabilities relevant to “embedded, branded, context-aware experiences”

**Embedded tools.**

- Every app is fundamentally a **tool bundle** implemented as an MCP server, so tools are first-class.
- The model can call your tools automatically when it decides they’re useful, or you can design explicit UI actions that call them ([Apps SDK MCP server concept](https://developers.openai.com/apps-sdk/concepts/mcp-server)).

**Themed / branded UI.**

- You’re encouraged to follow **ChatGPT UI guidelines** for consistency ([UI guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)), but you have room to:
  - Use your own logo, illustrations, and content style.
  - Compose your own layouts using the Apps SDK UI component library ([apps-sdk-ui README](https://github.com/openai/apps-sdk-ui)).
- The design tokens & components give you a “native” baseline while still letting you express brand identity (colors, imagery, copy, data visualizations, etc.).

**Context-dependent formatting & invocation.**

- ChatGPT can automatically **recommend apps** when the conversation suggests it (e.g., talking about houses triggers Zillow, per OpenAI’s examples) ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/)).
- Inside your app, you can design **conditional flows**:
  - Show a **map widget** if the user provided a location.
  - Show an **editor** when a tool returns an object that needs human adjustment.
  - Show **different layouts** depending on tool outputs (e.g., gallery vs. table).
- The Apps SDK UI docs explicitly cover designing components & conversational flows so they feel native but can adapt to context ([UX principles](https://developers.openai.com/apps-sdk/concepts/ux-principles); [UI guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)).

**Net takeaway for OpenAI**

- **Strengths:**
  - First-class, formalized spec for **in-chat apps with UI**.
  - Built on MCP, so backends are portable.
  - Strong opinionated design system and developer guidelines for context-aware interfaces.
- **Limitations (today):**
  - Apps run inside ChatGPT (not in third-party hosts) unless others adopt the standard.
  - Still in preview; directory & monetization are rolling out ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/)).

---

## 4. Anthropic Claude: Tools, MCP, Desktop Extensions & Code

Anthropic is the **birthplace of MCP**, and Claude has very mature support for tool use and MCP integrations. The emphasis, though, is more on **agents + connectors** than on a “UI apps SDK” like OpenAI’s.

### 4.1. Tool use in the Claude API

Claude’s tool system splits into:

1. **Client tools (your functions/APIs)**
   - Defined with names, descriptions, and JSON schemas in your API call.
   - The model decides when to call them; you execute them and return `tool_result` blocks, and Claude uses the results to craft its answer ([Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)).

2. **Server tools (Anthropic-hosted tools)**
   - Tools like `web_search` and `web_fetch` that run on Anthropic infra and are invoked automatically when enabled ([same tool use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)).

Key advanced features (all about **robust, efficient tool orchestration**):

- **Programmatic Tool Calling**: Claude writes Python code that orchestrates multiple tools, with execution happening in a sandboxed “code execution” tool ([advanced tool use blog](https://www.anthropic.com/engineering/advanced-tool-use)).
- **Tool Use Examples**: you can provide concrete example tool calls to disambiguate schema usage and conventions ([advanced tool use blog](https://www.anthropic.com/engineering/advanced-tool-use)).
- **Tool Search Tool**: helps manage many tools by deferring tool descriptions and searching them as needed ([same article](https://www.anthropic.com/engineering/advanced-tool-use)).

These are excellent for **backend agents** but do not directly expose a UI component spec inside Claude chat.

### 4.2. MCP connector in the Claude API

Claude can consume **remote MCP servers** directly via the **MCP connector**:

- You define an array of `mcp_servers` and then expose them through `tools` entries of type `mcp_toolset` ([MCP connector docs](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector)).
- Per the docs, each `mcp_toolset` lets you:
  - Enable/disable tools.
  - Defer loading tool descriptions (for large toolsets).
  - Configure caching and other options.

This means your **MCP server (same one you’d use with ChatGPT Apps)** can be mounted as tools in Claude, with the agent choosing when and how to call them. But again, the UI is primarily **chat text with structured content**, not custom HTML widgets.

### 4.3. Claude Desktop & Desktop Extensions (.mcpb)

Claude Desktop on macOS/Windows is an MCP host with **Desktop Extensions** and a **Connectors Directory**:

- Desktop extensions let you install local MCP servers with **one-click .mcpb bundles** ([Getting started with local MCP servers](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop); [mcpb GitHub](https://github.com/modelcontextprotocol/mcpb)).
- MCP Bundles (`.mcpb`):
  - Are zip archives containing your MCP server plus a `manifest.json`.
  - Are conceptually similar to browser extensions or VS Code extensions ([mcpb README](https://github.com/modelcontextprotocol/mcpb/blob/main/README.md)).

The **manifest** supports fairly rich metadata, which is where theming/branding shows up:

- Fields like `display_name`, `description`, `long_description`, `icon`, `screenshots`, `keywords`, `homepage`, etc. ([Desktop Extensions engineering blog](https://www.anthropic.com/engineering/desktop-extensions); [manifest example in that article](https://www.anthropic.com/engineering/desktop-extensions)).
- `user_config` definitions drive a **generated configuration UI** (forms for API keys, directory pickers, numeric limits, etc.) in Claude Desktop ([same article](https://www.anthropic.com/engineering/desktop-extensions)).
- The MCPB repo has recently added **localization and theming** capabilities to manifests ([mcpb release notes mentioning localization/theming](https://github.com/modelcontextprotocol/mcpb/releases)).

So, from a UX perspective, Desktop Extensions give you:

- A **branded presence** in the Extensions directory (icon, name, screenshots).
- A **generated configuration UI** for your server.
- Your tools appear in Claude Desktop as available capabilities the model can use in chat.

What you don’t get (yet) is a way to inject **arbitrary interactive UI canvases** into the chat stream itself, in the way Apps SDK does with widgets. The experience is still “chat + tool calls”, albeit with curated branding around the extension.

### 4.4. Claude Code & plugin-provided MCP servers

For developers, **Claude Code** (the IDE assistant) has first-class MCP integration:

- You can connect MCP servers over HTTP/SSE/stdio with the `claude mcp add` CLI, and then use them inside Claude Code ([Claude Code MCP docs](https://code.claude.com/docs/en/mcp)).
- Plugins can **bundle MCP servers** and have them auto-configured when the plugin is installed, via `.mcp.json` or `plugin.json` ([plugin MCP section in the same docs](https://code.claude.com/docs/en/mcp)).
- The result is an **embedded tools experience inside the IDE**: the assistant can query GitHub, databases, Sentry, etc., using those servers.

Again, the surface is mostly **textual/code** UI controlled by Claude Code, not a custom widget runtime defined by the plugin author.

### 4.5. Connectors Directory & remote MCP

Anthropic also runs a **Connectors Directory** for remote MCP servers:

- The Help Center explains that MCP is an open standard for connecting to tools and data, and that the directory exposes curated connectors (e.g., SaaS tools) that teams can enable centrally ([Connectors Directory FAQ](https://support.claude.com/en/articles/11596036-anthropic-connectors-directory-faq)).

For you, this means you can ship:

- A **remote MCP server** hosted by you, then
- Get it listed as a **Connector**, so customers can enable it for their Claude org.

This is more like “enterprise integrations” than end-user “apps”, but it’s a powerful route for distribution.

### 4.6. Code execution with MCP

Anthropic’s **Code Execution with MCP** pattern combines MCP tools with a sandboxed executor:

- Claude writes code that uses MCP tools like `gdrive`, `salesforce`, etc., and intermediate data never has to go through the model’s context ([code execution with MCP blog](https://www.anthropic.com/engineering/code-execution-with-mcp)).
- This lets you build sophisticated **agent workflows** that orchestrate many tools and systems, with privacy-preserving tokenization for sensitive data ([same article](https://www.anthropic.com/engineering/code-execution-with-mcp)).

This is extremely useful for **backend agents** and enterprise automations, but again is **not a UI SDK**.

### 4.7. How “close” is Claude to Apps SDK?

Short summary with respect to your criteria:

- **Embedded tools?**
  - Yes – via regular tool use, MCP connector, Desktop Extensions, Connectors Directory, and Claude Code plugins.
- **Themed / branded experiences?**
  - Partially – you can brand **extensions/bundles** (name, icon, descriptions, screenshots) and rely on Anthropic’s generated configuration UI, but you **cannot** currently define arbitrary interactive app layouts inside chat akin to Apps SDK widgets.
- **Context-dependent formatting?**
  - At the **text level**, you can prompt Claude to produce different layouts (tables, Markdown, inline images/links) based on context, but you don’t get a formal UI component framework.
- **Closest analogy to Apps SDK?**
  - The combination of **MCPB Desktop Extensions** + **Connectors Directory** is the nearest, but it’s more about **tool packaging & distribution** than about embedding bespoke UI inside Claude’s chat surface.

**Net takeaway for Anthropic**

- **Strengths:** deep MCP integration, advanced tool orchestration, enterprise-focused connectors, and rich packaging via `.mcpb`.
- **Gap vs Apps SDK:** no public, general-purpose **UI component spec** for in-assistant mini-app UIs; branding is mostly around metadata and configuration panes rather than in-chat widgets.

---

## 5. Google Gemini: Tools, Extensions, Gems & Generative UI

Google splits its story between:

- The **Gemini API** (developer-facing).
- The **Gemini app** and **AI Mode in Search** (consumer-facing assistants).

### 5.1. Tools & function calling in the Gemini API

The Gemini API exposes tools in two ways:

1. **Function Calling (custom tools)**
   - You define `functionDeclarations` and pass them via the `tools` field in your request; the model can decide to call them with structured JSON arguments, similar to other function-calling APIs ([Function Calling docs](https://ai.google.dev/gemini-api/docs/function-calling)).

2. **Managed, built-in tools**
   - Google provides **built-in tools** – for example:
     - `google_search` / retrieval tools for web search and retrieval.
     - Code execution and other specialized tools (exact list evolves, see [Tools overview](https://ai.google.dev/gemini-api/docs/tools)).
   - You can mix built-in tools and your own functions in a single request.

Tools work in both **normal request–response** and **Live API** (streaming / real-time voice) contexts:

- The **Tools overview** describes using tools with standard calls and the Live API ([Tools docs](https://ai.google.dev/gemini-api/docs/tools)).
- **Tool use with Live API** shows how to combine, e.g., `google_search` with your own light-control function while streaming audio ([Live tools docs](https://ai.google.dev/gemini-api/docs/live-tools)).

So for backends, Google provides a solid tool layer comparable to OpenAI/Anthropic, but **without MCP** – you adapt your integrations to Gemini’s own tools/functions schema.

### 5.2. Generative UI, Visual Layout & Dynamic View

Google has introduced **Generative UI** as research and product features:

- The **Google Research blog** defines “generative UI” as the model generating not just content, but an entire **custom user interface** (web pages, tools, simulations) tailored to each prompt ([Generative UI blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)).
- This work is rolling out in the **Gemini app** via an experiment called **Dynamic View**, and in Search’s AI Mode ([same blog, section about Gemini app & AI Mode](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)).

External coverage describes two related features in the Gemini app:

- **Visual Layout** – more like a rich, magazine-like layout (carousels, itineraries).
- **Dynamic View** – lets Gemini assemble pictures, tabs, sliders, and code into mini web-apps on demand, powered by Gemini 3, effectively making each prompt an ephemeral interactive canvas ([analysis of Dynamic View & Visual Layout](https://www.aicerts.ai/news/geminis-dynamic-view-google-bets-big-on-ui-innovation/)).

Important nuance for you:

- **Today, there is no public, stable SDK** that lets third-party devs explicitly author Dynamic View layouts or generative UI via structured specs.
- Instead, you influence layout **implicitly** through prompting, and the Gemini app decides when to use these experiments.
- The research blog hints that this is a first step toward fully AI-generated user experiences and mentions the Gemini app experiment as an early embodiment ([Generative UI blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)).

So Gemini currently has the **most aggressive native UI innovation** on the consumer side, but the knobs are primarily **prompt-level**, not an explicit “UI component spec” open to devs (yet).

### 5.3. Gemini / Bard Extensions (first‑party integrations)

Google previously launched **Bard Extensions**, now carried into Gemini, which connect the assistant to various Google services:

- The official Google blog announcement explains that Extensions let the assistant pull information from Gmail, Docs, Drive, Maps, YouTube, and Google Flights/Hotels in a single conversation ([Bard Extensions blog](https://blog.google/products/gemini/google-bard-new-features-update-sept-2023/)).
- Extensions appear as inline results, cards, etc., inside the assistant UI.

Third-party guides note that these extensions “work similarly to ChatGPT plugins,” but they are primarily for Google’s **own ecosystem** (Gmail, Drive, Docs, Maps, Flights, Hotels, YouTube, etc.) and are **not currently a general, documented plugin platform** for arbitrary external developers ([example overview](https://beebom.com/how-use-google-bard-extensions/)).

So for your purposes:

- Extensions are **embedded tools** with custom UI, but the provider is Google, not you.
- There is no public extension SDK akin to OpenAI’s Apps SDK for arbitrary third-party providers.

### 5.4. Gems: user-defined custom experiences

The **Gemini app** also supports **Gems**, which are user-defined custom versions of Gemini:

- The Google blog describes Gems as ways to tailor Gemini “to your specific needs” and notes that they’re now shareable with others ([Gems blog](https://blog.google/products/gemini/sharing-gems/)).
- A Gem is essentially a bundle of instructions/personality/behavior, not a separate UI framework.

From your POV, Gems are closer to:

- OpenAI’s **Custom GPTs**, or
- Anthropic’s **Skills** concept,

than to an Apps SDK: they define **behavior**, not UI components or tool schemas.

### 5.5. Developer-facing SDKs and UI story

For **embedding Gemini into your own apps**, Google offers:

- The **Gemini API** plus language-specific SDKs and a **Gen AI SDK for JavaScript/TypeScript** for web apps ([Gemini API docs](https://ai.google.dev/gemini-api/docs); [web apps getting started pathway](https://developers.google.com/learn/pathways/solution-ai-gemini-getting-started-web)).
- You design your own UI (React, native, etc.), and use function calling & tools on the backend.

But there’s currently **no official “Gemini Apps SDK”** to let you:

- Publish branded mini-apps that run inside Gemini for the general user base.
- Define structured UI layouts/components for the Gemini host in the way OpenAI’s Apps SDK does for ChatGPT.

Some coverage of Dynamic View suggests that **future APIs may let partners embed generative interfaces inside their own products**, but that’s speculative/forward-looking and not a documented, generally available SDK yet ([Dynamic View analysis](https://www.aicerts.ai/news/geminis-dynamic-view-google-bets-big-on-ui-innovation/)).

**Net takeaway for Google**

- **Strengths:** powerful tool/function calling in the API; rich first-party extensions; cutting-edge generative UI in Gemini app & Search.
- **Gap vs Apps SDK:** no general-purpose, documented SDK for third-party **in-Gemini apps with authored UI**; devs mostly embed Gemini in their own UIs.

---

## 6. Side-by-side comparison (focused on your criteria)

### 6.1. At a glance

| Aspect                                                      | OpenAI (ChatGPT + Apps SDK)                                                                                                                                                           | Anthropic (Claude)                                                                                                                                                                                                                                                                                                                                                | Google (Gemini)                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Underlying “tools” mechanism**                            | MCP tools + OpenAI tools/function calling                                                                                                                                             | Claude client/server tools + MCP connector                                                                                                                                                                                                                                                                                                                        | Gemini tools (function calling + built-in tools)                                                                                                                                                                                                                                                                                                       |
| **Protocol standardization**                                | Builds on MCP; Apps SDK spec is MCP-based and open ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/); [MCP overview](https://modelcontextprotocol.io/))             | Invented MCP; deep MCP support (API connector, Desktop, Code) ([MCP connector docs](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector); [desktop article](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop))                                                                             | Uses its own tools/functions schema, not MCP ([Tools docs](https://ai.google.dev/gemini-api/docs/tools))                                                                                                                                                                                                                                               |
| **In-assistant app / extension framework**                  | **Apps SDK**: apps run inside ChatGPT with custom UI widgets & MCP tools ([Apps SDK docs](https://developers.openai.com/apps-sdk))                                                    | **Desktop Extensions (.mcpb)** + Connectors + Claude Code plugins: tools in Claude, IDE integrations, but UI is mostly chat + config panes ([Desktop Extensions blog](https://www.anthropic.com/engineering/desktop-extensions))                                                                                                                                  | **Extensions** for first-party services + Generative UI (Dynamic View, Visual Layout) in Gemini app/Search ([Bard Extensions blog](https://blog.google/products/gemini/google-bard-new-features-update-sept-2023/); [Generative UI blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)) |
| **Third-party UI component / widget spec inside assistant** | **Yes** – Apps SDK UI library + widget runtime ([apps-sdk-ui](https://github.com/openai/apps-sdk-ui))                                                                                 | **Not today** – no public spec for arbitrary in-chat widgets; branding mostly via extension metadata                                                                                                                                                                                                                                                              | **Not today** – generative UI is primarily controlled by Google; no published 3P UI spec yet                                                                                                                                                                                                                                                           |
| **Branded presence**                                        | App directory (planned), app tiles, icons, custom components themed with design tokens                                                                                                | Extensions directory, `.mcpb` manifest with icon/screenshots/long description; config UI auto-generated ([Desktop Extensions blog](https://www.anthropic.com/engineering/desktop-extensions); [mcpb README](https://github.com/modelcontextprotocol/mcpb/blob/main/README.md))                                                                                    | Gemini app & Search surfaces: cards, chips, rich layouts; first-party brands via Extensions; Gems for personal “mini-personas” ([Bard Extensions blog](https://blog.google/products/gemini/google-bard-new-features-update-sept-2023/); [Gems blog](https://blog.google/products/gemini/sharing-gems/))                                                |
| **Context-aware surfacing**                                 | ChatGPT can suggest apps when relevant in conversation ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/)); your app can also conditionally render different widgets | Claude uses tools automatically based on context; Desktop/Code show tools as available for tasks, but no dedicated “app suggestions” UX documented ([Tool use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview))                                                                                                                      | Gemini suggests Extensions and chooses when to use Generative UI/Dynamic View; behavior is mostly internal to Google’s UX ([Generative UI blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/))                                                                                          |
| **Distribution story**                                      | App directory + review/monetization planned ([apps blog](https://openai.com/index/introducing-apps-in-chatgpt/))                                                                      | Connectors Directory for remote MCP; Desktop Extensions directory; `.mcpb` files can be shared privately ([Connectors FAQ](https://support.claude.com/en/articles/11596036-anthropic-connectors-directory-faq); [Getting started with Desktop servers](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop)) | No general 3P app marketplace for in-Gemini apps; distribution is mostly your own UI using the Gemini API, or Google’s own Extensions ([Gemini API docs](https://ai.google.dev/gemini-api/docs))                                                                                                                                                       |

### 6.2. “Closest to Apps SDK” ranking

From narrow perspective of **“I want to ship a branded mini-app that lives inside the assistant’s own UI, with context-aware formatting and embedded tools”**:

1. **OpenAI ChatGPT + Apps SDK** – direct hit; this is exactly what it’s for.
2. **Anthropic Claude (Desktop Extensions + MCPB)** – you get branded tool packages and some UI around installation/configuration, but not full custom in-chat widget surfaces.
3. **Google Gemini** – strongest first-party visual innovation (Generative UI / Dynamic View) but no documented third-party UI/apps SDK yet; customization is primarily via prompt, tools, and embedding Gemini in your own UI.

---

## 7. Practical design paths per vendor

### 7.1. OpenAI: Full “assistant-native app”

**Goal:** a fully branded, context-aware experience _inside ChatGPT_.

**Architecture sketch:**

1. Build your **MCP server** once (core logic, tools, data access).
2. Use **Apps SDK UI** to create a set of widgets and flows that represent your app’s UX ([Apps SDK Quickstart](https://developers.openai.com/apps-sdk/quickstart); [apps-sdk-ui](https://github.com/openai/apps-sdk-ui)).
3. Define **rich metadata** (categories, description, icon) to help ChatGPT surface it in the right contexts ([Optimize metadata guide](https://developers.openai.com/apps-sdk/guides/optimize-metadata)).
4. Implement **auth** and **state** so your existing users can log in and pick up where they left off ([Authenticate users](https://developers.openai.com/apps-sdk/build/authenticate-users); [Manage state](https://developers.openai.com/apps-sdk/build/manage-state)).

This is the only option today where you truly **author both tools and UI** for an in-assistant app as a formal, documented spec.

### 7.2. Anthropic: Tool-first, UI-light approach

**Goal:** leverage Claude’s reasoning and an MCP-based integration, with branding but without bespoke in-chat UI components.

Recommended approach:

1. Implement your logic as an **MCP server** (so it’s portable to OpenAI as well) ([MCP docs](https://modelcontextprotocol.io/)).
2. Package a **Desktop Extension (.mcpb)** that includes:
   - Your server.
   - A rich `manifest.json` with display name, icon, screenshots, keywords, and `user_config` form fields ([Desktop Extensions blog](https://www.anthropic.com/engineering/desktop-extensions); [mcpb README](https://github.com/modelcontextprotocol/mcpb/blob/main/README.md)).
3. Optionally list your server in the **Connectors Directory** for remote use ([Connectors Directory FAQ](https://support.claude.com/en/articles/11596036-anthropic-connectors-directory-faq)).
4. For **presentation**, rely on:
   - Claude’s Markdown output (tables, code blocks, images).
   - Carefully designed prompts that instruct Claude to format results in branded ways (e.g., specific section titles, color hints via HTML/Markdown where supported).

You’re effectively shipping a **tool with strong metadata and some UI at install/config time**, but not a customizable interactive canvas in the chat window itself.

### 7.3. Google: Tool API + generative UI as a host feature

**Goal:** expose tools to Gemini and maybe benefit from generative UI in the Gemini app, while also building your own front-ends.

Suggested setup:

1. Implement your core logic as **HTTP APIs** and expose them as **Gemini tools** using function calling ([Function Calling docs](https://ai.google.dev/gemini-api/docs/function-calling); [Tools overview](https://ai.google.dev/gemini-api/docs/tools)).
2. Build your own **web/mobile UI** using the Gemini API and Gen AI SDK ([Gemini API docs](https://ai.google.dev/gemini-api/docs); [web apps guide](https://developers.google.com/learn/pathways/solution-ai-gemini-getting-started-web)).
3. For the **Gemini app** itself:
   - There’s no public app SDK; you influence responses/layout indirectly via prompting.
   - If/when Dynamic View is enabled for your users, it may choose to render richer interfaces for certain prompts automatically ([Generative UI blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/); [Dynamic View analysis](https://www.aicerts.ai/news/geminis-dynamic-view-google-bets-big-on-ui-innovation/)).

So with Google, you typically **host the branded UI yourself**, and Gemini is the engine + tools layer, not the primary app marketplace/platform (at least for now).

---

## 8. Summary

- **OpenAI’s Apps SDK** is currently the **closest match** to what you described: a mostly-spec-based, MCP-powered framework for **embedded apps with branded UI and context-aware behaviors inside ChatGPT**, plus distribution and monetization plans ([Apps SDK docs](https://developers.openai.com/apps-sdk); [apps blog](https://openai.com/index/introducing-apps-in-chatgpt/)).
- **Anthropic** provides a rich **tool and connector ecosystem** (MCP connector, Desktop Extensions, Connectors Directory, advanced tool use, code execution) and a packaging format (.mcpb) that includes branding and generated config UI, but stops short of a full **UI widget SDK** inside Claude chat ([Tool use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview); [Desktop Extensions blog](https://www.anthropic.com/engineering/desktop-extensions)).
- **Google Gemini** offers strong **tool/function calling** and is pushing the frontier on **Generative UI / Dynamic View** in its own products, but today developers mostly interact via the Gemini API and build their own UIs; there is no widely documented third-party **in-Gemini apps SDK** comparable to OpenAI’s ([Gemini API tools docs](https://ai.google.dev/gemini-api/docs/tools); [Generative UI blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)).

If you want **maximum reuse** across vendors, the safest design is:

1. Implement your core product as an **MCP server**.
2. Layer different **host integrations** on top:
   - ChatGPT Apps SDK (rich embedded app).
   - Claude MCP connector + Desktop Extensions (tool-first with branded install).
   - Gemini function-calling tools + your own frontends (Gemini as the reasoning/agent engine).

That way, you can give OpenAI users the full **embedded app** experience, Claude users a very capable **tool/extension** experience, and Gemini users a **custom UI backed by Gemini tools**, all from the same underlying logic.

---

_End of document._
