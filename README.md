# Oak Open Curriculum Ecosystem

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![Open Government Licence (data)](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)
[![SonarCloud quality gate status](https://sonarcloud.io/api/project_badges/measure?project=oaknational_oak-open-curriculum-ecosystem&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)
[![SonarCloud AI code assurance](https://sonarcloud.io/api/project_badges/ai_code_assurance?project=oaknational_oak-open-curriculum-ecosystem)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)

Oak National Academy is a public body sponsored by the Department for Education. We provide a
free, optional, fully sequenced curriculum aligned with the national curriculum for England,
created with teachers and subject experts. This repository turns that curriculum into
AI-native infrastructure, for teachers and for the wider ecosystem that builds with it. The
code is open source, the curriculum content is openly licensed, and the work is new and still
in development.

## Find what you need

- **You teach, and want Oak in the AI tool you already use:** go to
  [Bring Oak's curriculum into your AI tools](https://www.thenational.academy/ai-plugin) on
  Oak's website. You do not need anything on this page.
- **You want to know what this is and why it matters:** read the [vision](VISION.md), then the
  [strategy](docs/strategy/README.md). The [curriculum guide](docs/domain/curriculum-guide.md)
  explains Oak's curriculum structure in plain language.
- **You want to build with Oak's curriculum:** see [Build with it](#build-with-it).
- **You want to know how it is built:** see [How it's built](#how-its-built).
- **You want to run or change the code:** start at [Quick Start](#quick-start).

## Status

Oak's website says what is available today:

> Our curriculum plans are now available in ChatGPT and Claude, with Gemini, Copilot and
> others to follow.
>
> This is new, and still in development.

Source: [Oak National Academy plugin](https://www.thenational.academy/ai-plugin), read 15 November 2026.

That page is the place to check which AI tools Oak supports. Versions of the code in this
repository are listed under
[Releases](https://github.com/oaknational/oak-open-curriculum-ecosystem/releases).

## What's here

| What                          | What it does                                                                                                                                                                            | Where                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Oak Curriculum MCP server** | AI assistants and developer tools can search, browse and fetch curriculum data through the [Model Context Protocol](https://modelcontextprotocol.io/)                                   | [`apps/oak-curriculum-mcp-streamable-http`](apps/oak-curriculum-mcp-streamable-http/README.md)                 |
| **Curriculum SDK**            | Typed TypeScript access to Oak's curriculum API for software developers (SDK: software development kit): types, validators and MCP tool metadata, all generated from the OpenAPI schema | [`packages/sdks/oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/README.md)                               |
| **Semantic search**           | Hybrid lexical and semantic retrieval across lessons, units and threads; lexical search of curriculum sequences                                                                         | [`apps/oak-search-cli`](apps/oak-search-cli/), [`packages/sdks/oak-search-sdk`](packages/sdks/oak-search-sdk/) |
| **Demonstration apps**        | The Curriculum Hub, with live search and content, and the design-system showcase                                                                                                        | [`demos/`](demos/)                                                                                             |
| **Design system**             | The design token pipeline and reusable design primitives                                                                                                                                | [`packages/design/`](packages/design/)                                                                         |
| **The Practice**              | The openly documented way this repository is built with AI agents                                                                                                                       | [How the agentic engineering system works](docs/foundation/agentic-engineering-system.md)                      |

The `.agent/` folder holds the working material of the Practice: the rules, plans and records
the agents and engineers work from. It is public because the repository is public. It is not
part of the product.

The apps, SDKs, core packages and libraries are summarised in the
[architecture overview](docs/architecture/README.md#workspace-summaries).

### Sector reusable components

Beyond Oak-hosted products, we publish a deliberate set of reusable sector components — the
OpenAPI-to-MCP pipeline, SDK-generation patterns, hybrid-search tooling, MCP and MCP App
scaffolds, graph projection conventions, and the openly documented Practice — so other
organisations can lower the cost of building curriculum-aware applications without starting
from scratch.

## Build with it

- **Connect an AI tool.** Oak can connect to any AI tool that supports Model Context Protocol
  (MCP) connections. The server is at `https://mcp.thenational.academy/mcp`. Oak's
  [plugin repository](https://github.com/oaknational/oak-ai-plugins/blob/main/README.md) has
  the instructions, and the [served tool table](apps/oak-curriculum-mcp-streamable-http/served-tool-table.md)
  lists every tool the server offers.
- **Call the curriculum API.** Request a free key from
  [Oak's Open Curriculum API](https://open-api.thenational.academy/docs/about-oaks-api/api-keys).
- **Use the SDK.** The [Curriculum SDK](packages/sdks/oak-curriculum-sdk/README.md) gives typed
  access to the API. It is not yet on the npm registry; until it is, use it from a clone of
  this repository.
- **Check the licences.** Code is under the [MIT licence](LICENCE). Curriculum content is
  under the Open Government Licence v3.0, except where otherwise stated, and requires
  attribution to Oak National Academy: see [LICENCE-DATA.md](LICENCE-DATA.md) and the
  [register of data sources](docs/governance/DATA-SOURCES.md).

## How it's built

**Schema-first.** Everything flows from the OpenAPI schema of Oak's curriculum API. The
TypeScript SDK, its types and validators, and the MCP tools are all generated from that one
schema, so a change to the schema reaches all of them by running one command. See the
[architecture overview](docs/architecture/README.md), the
[OpenAPI pipeline](docs/architecture/openapi-pipeline.md) and the
[architectural decision records](docs/architecture/architectural-decisions/README.md).

**Agent-directed.** The code is written by AI agents, directed and reviewed by Oak's
engineers. The engineers design the system the agents work in: the guardrails, the
architectural constraints, the quality gates and the review workflows. See
[how the agentic engineering system works](docs/foundation/agentic-engineering-system.md) and,
for the practical side,
[working with this repo](docs/engineering/working-with-this-repo-for-devs.md).

## Quick Start

**First, install the prerequisites** — Node.js 24, pnpm (standalone installer), bash 5.2 or later
(macOS ships 3.2) and `gh` — from the [setup guide](docs/engineering/setup.md#prerequisites).
**On Windows, start at [Windows (via WSL)](docs/engineering/setup.md#windows-via-wsl) instead**; it
returns you here at the right step. The setup guide also carries the full command list.

### Install and verify

```bash
git clone https://github.com/oaknational/oak-open-curriculum-ecosystem.git
cd oak-open-curriculum-ecosystem
pnpm install
.agent/setup/install-shellcheck.sh # the pinned shellcheck pnpm lint runs; once per checkout
pnpm test && pnpm type-check && pnpm lint
```

If these pass, your toolchain is working. No API keys are required for unit tests, type-checking, linting, or building.

**Before your first push**: install [gitleaks](https://github.com/gitleaks/gitleaks/releases) (`brew install gitleaks` on macOS; WSL/Linux: see [Windows (via WSL)](docs/engineering/setup.md#windows-via-wsl)). The pre-push hook runs a secrets scan and will block pushes if gitleaks is not installed.

### Get an API key (optional)

Many tasks work without environment variables. To run dev servers, integration tests, or search workflows, you need an Oak API key:

1. Request a free key from [Oak's API keys page](https://open-api.thenational.academy/docs/about-oaks-api/api-keys).
2. Copy the example environment file for the workspace you are running and add
   your key there:

```bash
# HTTP MCP server
cp apps/oak-curriculum-mcp-streamable-http/.env.example \
  apps/oak-curriculum-mcp-streamable-http/.env.local

# Search CLI
cp apps/oak-search-cli/.env.example apps/oak-search-cli/.env.local

# Edit the relevant .env.local and set OAK_API_KEY=your_key_here
```

See [environment variables guide](docs/operations/environment-variables.md) for Elasticsearch, Clerk, and other service credentials.

### Next steps

- [Setup guide](docs/engineering/setup.md): prerequisites, Windows and the full command list.
- [CONTRIBUTING.md](CONTRIBUTING.md): the development process, commit conventions and quality
  expectations for Oak team members.
- [Working with this repo](docs/engineering/working-with-this-repo-for-devs.md): how to direct
  the agents, including how to start a session.
- [MCP servers for contributors](docs/engineering/mcp-servers-for-contributors.md): the
  sanctioned set for Oak teammates using an AI coding agent.
- [Documentation index](docs/README.md): every section of the documentation.
- AI agents: read the [start-right-quick workflow](.agent/skills/start-right-quick/shared/start-right.md),
  then [AGENT.md](.agent/directives/AGENT.md).

## Credits and Attribution

This repository brings together work from multiple contributors and open
education organisations. See [ATTRIBUTION.md](ATTRIBUTION.md) for full
details, citations, and licence terms for each source.

- **[Education Endowment Foundation](https://educationendowmentfoundation.org.uk/)** — Teaching and Learning Toolkit data. Citation: Higgins, S., Katsipataki, M., Kokotsaki, D., Coleman, R., Major, L.E., & Coe, R. _Teaching and Learning Toolkit_. Education Endowment Foundation.
- **Mark Hodierne** — [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology), primary author
- **John Roberts** — EEF MCP server prototype
- **Heather W** — Oak Curriculum Hub demo web UI (`demos/oak-curriculum-hub`)

## Licence and contact

- **Licence.** Code: MIT, see [LICENCE](LICENCE). Curriculum data: see
  [LICENCE-DATA.md](LICENCE-DATA.md). Branding is copyright Oak National Academy: see
  [BRANDING.md](BRANDING.md).
- **Contributing.** You are free to read, fork and learn from the code. At this time we are
  not accepting external contributions; this may change, so watch the repository for updates.
  Oak team members: see [CONTRIBUTING.md](CONTRIBUTING.md).
- **Security.** If you find a security issue, please follow our [security policy](SECURITY.md).
- **Privacy and accessibility.** Oak publishes its
  [privacy policy](https://www.thenational.academy/legal/privacy-policy) and
  [accessibility statement](https://www.thenational.academy/legal/accessibility-statement) on
  its website.
- **Contact.** Use [Oak's contact page](https://www.thenational.academy/contact-us).
