# Oak Open Curriculum Ecosystem

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![Open Government Licence (data)](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)
[![SonarCloud quality gate status](https://sonarcloud.io/api/project_badges/measure?project=oaknational_oak-open-curriculum-ecosystem&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)
[![SonarCloud AI code assurance](https://sonarcloud.io/api/project_badges/ai_code_assurance?project=oaknational_oak-open-curriculum-ecosystem)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)

This repository contains the code that makes Oak National Academy's open curriculum available
to AI assistants and to developers: the Oak Curriculum MCP server, a TypeScript SDK for the
curriculum API, semantic search, and the engineering practice we use to build them.

If you teach and want Oak in the AI tool you already use, go to
[Bring Oak's curriculum into your AI tools](https://www.thenational.academy/ai-plugin).

## What's here

| What                          | What it does                                                                                                                                 | Where                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Oak Curriculum MCP server** | Lets an AI assistant search, browse and fetch Oak's curriculum, through the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) | [`apps/oak-curriculum-mcp-streamable-http`](apps/oak-curriculum-mcp-streamable-http/README.md)                 |
| **Curriculum SDK**            | Gives developers typed TypeScript access to Oak's curriculum API, generated from the API's own schema (SDK: software development kit)        | [`packages/sdks/oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/README.md)                               |
| **Semantic search**           | Finds lessons, units and learning threads by meaning as well as by keyword, and searches curriculum sequences by keyword                     | [`apps/oak-search-cli`](apps/oak-search-cli/), [`packages/sdks/oak-search-sdk`](packages/sdks/oak-search-sdk/) |
| **Demonstration apps**        | The Curriculum Hub, with live search and content, and the design-system showcase                                                             | [`demos/`](demos/)                                                                                             |
| **Design system**             | The colours, type and components our interfaces share                                                                                        | [`packages/design/`](packages/design/)                                                                         |
| **The Practice**              | How we build all of this with AI agents, documented in the open                                                                              | [How the agentic engineering system works](docs/foundation/agentic-engineering-system.md)                      |

The apps, SDKs, core packages and libraries are summarised in the
[architecture overview](docs/architecture/README.md#workspace-summaries). The `.agent/` folder
holds the rules, plans and records our agents and engineers work from; it isn't part of the
product.

## Status

This is new and still in development.
[Oak's plugin page](https://www.thenational.academy/ai-plugin) lists the AI tools the server
supports.
[Releases](https://github.com/oaknational/oak-open-curriculum-ecosystem/releases) lists each
version of the code. The Curriculum SDK isn't on the npm registry yet.

## Use it

- **Connect an AI tool.** AI tools that support Model Context Protocol (MCP) connections can
  connect to the server at `https://mcp.thenational.academy/mcp`. The
  [plugin repository](https://github.com/oaknational/oak-ai-plugins/blob/main/README.md) has
  the instructions, and the
  [served tool table](apps/oak-curriculum-mcp-streamable-http/served-tool-table.md) lists
  every tool the server offers.
- **Call the curriculum API.** Request a free key from
  [Oak's Open Curriculum API](https://open-api.thenational.academy/docs/about-oaks-api/api-keys).
- **Use the SDK.** The [Curriculum SDK](packages/sdks/oak-curriculum-sdk/README.md) gives you
  typed access to the API. Until it's on the npm registry, use it from a clone of this
  repository.
- **Reuse the parts.** The components here are built to be reused; the
  [engineering tools strategy](docs/strategy/stream-engineering-tools.md) sets out what they
  are.

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

## How it's built

**One schema, everything generated.** Everything flows from the OpenAPI schema that describes
the curriculum API. The SDK, its types and validators, and the MCP tools are all generated from
that one schema, so when the API changes, one command regenerates them all. See the
[architecture overview](docs/architecture/README.md), the
[OpenAPI pipeline](docs/architecture/openapi-pipeline.md) and the
[architectural decision records](docs/architecture/architectural-decisions/README.md).

**Written by AI agents, directed by our engineers.** AI agents write the code. Our engineers
direct them, review what they write, and build the guardrails and quality gates they work
within. See
[how the agentic engineering system works](docs/foundation/agentic-engineering-system.md) and
[working with this repo](docs/engineering/working-with-this-repo-for-devs.md).

## Documentation

- [Vision](VISION.md) and [strategy](docs/strategy/README.md): what this work is for.
- [Setup guide](docs/engineering/setup.md): prerequisites, Windows and the full command list.
- [Working with this repo](docs/engineering/working-with-this-repo-for-devs.md): how to direct
  the agents, including how to start a session.
- [MCP servers for contributors](docs/engineering/mcp-servers-for-contributors.md): the
  approved set for Oak team members using an AI coding agent.
- [Curriculum guide](docs/domain/curriculum-guide.md): how the curriculum data is structured.
- [Documentation index](docs/README.md): everything else.
- AI agents: read the
  [start-right-quick workflow](.agent/skills/start-right-quick/shared/start-right.md), then
  [AGENT.md](.agent/directives/AGENT.md).

## Contributing

We aren't accepting external contributions at the moment. You're free to read, fork and learn
from the code. Oak team members: see [CONTRIBUTING.md](CONTRIBUTING.md). If you find a security
issue, follow the [security policy](SECURITY.md).

## Licence

The code is released under the [MIT licence](LICENCE). Curriculum content is under the Open
Government Licence v3.0, except where otherwise stated, and needs attribution to Oak National
Academy: see [LICENCE-DATA.md](LICENCE-DATA.md) and the
[register of data sources](docs/governance/DATA-SOURCES.md). Oak's branding is copyright: see
[BRANDING.md](BRANDING.md).

[ATTRIBUTION.md](ATTRIBUTION.md) gives the attribution requirements and credits for the external
sources this repository uses.

## Get in touch

This repository is maintained by Oak National Academy.
[Contact us](https://www.thenational.academy/contact-us) through our website, which also carries
our [privacy policy](https://www.thenational.academy/legal/privacy-policy) and
[accessibility statement](https://www.thenational.academy/legal/accessibility-statement).
