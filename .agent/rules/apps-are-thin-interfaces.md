# Apps Are Thin Interfaces

Apps are thin user interfaces that compose SDK/library capabilities. Apps NEVER reimplement domain logic that an SDK already provides.

SDKs own: query shapes, query processing, score processing, field inventories, data contracts.
Apps own: CLI commands, request assembly, operational tooling, user-facing presentation.

The test: "Could another app need this?" If yes → SDK. If an app duplicates SDK logic, collapse it by importing from the SDK.

See `.agent/directives/principles.md` §Layer Role Topology.
