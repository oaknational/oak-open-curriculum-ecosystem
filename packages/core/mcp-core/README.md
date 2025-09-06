# @oaknational/mcp-core

Platform-agnostic core interfaces and factory for composing runtime providers.

- Public API: `createRuntime({ logger, clock, storage })`
- Contracts: `CoreLogger`, `CoreClock`, `CoreStorage`
- Testing helper: `@oaknational/mcp-core/testing/provider-contract`

For details on provider contracts (what they are, what they prove, how to use them), see `docs/architecture/provider-contracts.md`.
