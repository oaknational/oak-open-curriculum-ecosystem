# Oak Open Curriculum Ecosystem

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![Open Government Licence (data)](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)
[![SonarCloud quality gate status](https://sonarcloud.io/api/project_badges/measure?project=oaknational_oak-open-curriculum-ecosystem&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)
[![SonarCloud AI code assurance](https://sonarcloud.io/api/project_badges/ai_code_assurance?project=oaknational_oak-open-curriculum-ecosystem)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)

We’re Oak, helping schools deliver a world-class curriculum for every pupil. Our curriculum is
free, openly licensed and fully sequenced, from key stage 1 to key stage 4, and this repository
is where it meets AI. The tools here put it inside the AI assistants teachers already use, and
let anyone build with it. The code is open source, and it's new and still in development.

We're a public body sponsored by the Department for Education, and we make our curriculum with
teachers and subject experts.

## Start here

- **You teach.** You don't need this page.
  [Bring Oak's curriculum into your AI tools](https://www.thenational.academy/ai-plugin) walks
  you through adding Oak to the AI tool you already use.
- **You're deciding whether this matters.** Read the [vision](VISION.md): what we're doing and
  why. The [strategy](docs/strategy/README.md) has the detail, and the
  [curriculum guide](docs/domain/curriculum-guide.md) explains how Oak's curriculum is put
  together.
- **You want to build with Oak's curriculum.** Go to [Build with it](#build-with-it): connect an
  AI tool, call the API or use the SDK.
- **You want to know how it's made.** Go to [How it's built](#how-its-built): one schema,
  generated code, and AI agents directed by our engineers.
- **You want to run the code.** [Quick Start](#quick-start) takes you from a clone to passing
  tests.

## Status

From [our website](https://www.thenational.academy/ai-plugin), read 15 November 2026:

> Our curriculum plans are now available in ChatGPT and Claude, with Gemini, Copilot and
> others to follow.
>
> This is new, and still in development.

That page lists the AI tools we support.
[Releases](https://github.com/oaknational/oak-open-curriculum-ecosystem/releases) lists each
version of the code here.

## What's here

| What                          | What it does                                                                                                                                 | Where                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Oak Curriculum MCP server** | Lets an AI assistant search, browse and fetch Oak's curriculum, through the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) | [`apps/oak-curriculum-mcp-streamable-http`](apps/oak-curriculum-mcp-streamable-http/README.md)                 |
| **Curriculum SDK**            | Gives developers typed TypeScript access to Oak's curriculum API, generated from the API's own schema (SDK: software development kit)        | [`packages/sdks/oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/README.md)                               |
| **Semantic search**           | Finds lessons, units and learning threads by meaning as well as by keyword, and searches curriculum sequences by keyword                     | [`apps/oak-search-cli`](apps/oak-search-cli/), [`packages/sdks/oak-search-sdk`](packages/sdks/oak-search-sdk/) |
| **Demonstration apps**        | The Curriculum Hub, with live search and content, and the design-system showcase                                                             | [`demos/`](demos/)                                                                                             |
| **Design system**             | The colours, type and components our interfaces share                                                                                        | [`packages/design/`](packages/design/)                                                                         |
| **The Practice**              | How we build all of this with AI agents, documented in the open                                                                              | [How the agentic engineering system works](docs/foundation/agentic-engineering-system.md)                      |

You'll also see a large `.agent/` folder. It holds the rules, plans and records our agents and
engineers work from. It's in the open with everything else, and it isn't part of the product.

The apps, SDKs, core packages and libraries are summarised in the
[architecture overview](docs/architecture/README.md#workspace-summaries).

## Build with it

- **Connect an AI tool.** AI tools that support Model Context Protocol (MCP) connections can
  connect to Oak, at `https://mcp.thenational.academy/mcp`. Our
  [plugin repository](https://github.com/oaknational/oak-ai-plugins/blob/main/README.md) has
  the instructions, and the
  [served tool table](apps/oak-curriculum-mcp-streamable-http/served-tool-table.md) lists
  every tool the server offers.
- **Call the curriculum API.** Request a free key from
  [Oak's Open Curriculum API](https://open-api.thenational.academy/docs/about-oaks-api/api-keys).
- **Use the SDK.** The [Curriculum SDK](packages/sdks/oak-curriculum-sdk/README.md) gives you
  typed access to the API. It isn't on the npm registry yet; until it is, use it from a clone
  of this repository.
- **Reuse the parts.** We build the components here to be reused; the
  [engineering tools strategy](docs/strategy/stream-engineering-tools.md) sets out what they
  are.
- **Check the licences.** The code is under the [MIT licence](LICENCE). Curriculum content is
  under the Open Government Licence v3.0, except where otherwise stated, and needs attribution
  to Oak National Academy: see [LICENCE-DATA.md](LICENCE-DATA.md) and the
  [register of data sources](docs/governance/DATA-SOURCES.md).

## How it's built

**One schema, everything generated.** Everything flows from the OpenAPI schema that describes Oak's curriculum
API. The SDK, its types and validators, and the MCP tools are all generated from that one
schema, so when the API changes, one command regenerates them all. See the
[architecture overview](docs/architecture/README.md), the
[OpenAPI pipeline](docs/architecture/openapi-pipeline.md) and the
[architectural decision records](docs/architecture/architectural-decisions/README.md).

**Written by AI agents, directed by our engineers.** AI agents write the code. Our engineers
direct them, review what they write, and build the guardrails and quality gates they work
within. It's documented in the open, so you can judge it for yourself: start with
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
  approved set for Oak team members using an AI coding agent.
- [Documentation index](docs/README.md): every section of the documentation.
- AI agents: read the
  [start-right-quick workflow](.agent/skills/start-right-quick/shared/start-right.md), then
  [AGENT.md](.agent/directives/AGENT.md).

## Credits and Attribution

This repository brings together work from multiple contributors and open
education organisations. See [ATTRIBUTION.md](ATTRIBUTION.md) for full
details, citations, and licence terms for each source.

- **[Education Endowment Foundation](https://educationendowmentfoundation.org.uk/)** — Teaching and Learning Toolkit data. Citation: Higgins, S., Katsipataki, M., Kokotsaki, D., Coleman, R., Major, L.E., & Coe, R. _Teaching and Learning Toolkit_. Education Endowment Foundation.
- **Mark Hodierne** — [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology), primary author
- **John Roberts** — EEF MCP server prototype
- **Heather W** — Oak Curriculum Hub demo web UI (`demos/oak-curriculum-hub`)

## Licence and contact

- **Licence.** The code is [MIT-licensed](LICENCE); the curriculum has
  [its own licence](LICENCE-DATA.md). Our branding is copyright: see [BRANDING.md](BRANDING.md).
- **Contributing.** You're free to read, fork and learn from the code. We aren't accepting
  external contributions at the moment. Oak team members: see
  [CONTRIBUTING.md](CONTRIBUTING.md).
- **Security.** If you find a security issue, please follow our [security policy](SECURITY.md).
- **Privacy and accessibility.** Our
  [privacy policy](https://www.thenational.academy/legal/privacy-policy) and
  [accessibility statement](https://www.thenational.academy/legal/accessibility-statement) are
  on our website.
- **Contact.** [Get in touch](https://www.thenational.academy/contact-us).
