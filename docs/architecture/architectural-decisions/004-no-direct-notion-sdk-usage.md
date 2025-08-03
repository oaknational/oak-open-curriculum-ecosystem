# ADR-004: Abstract Notion SDK Behind Interface

## Status

Accepted

## Context

The Notion SDK is a third-party dependency that:

- May change its API in breaking ways
- Couples our code directly to Notion's implementation details
- Makes testing difficult without mocking the entire SDK
- Could be replaced with a different implementation in the future

We need to decide whether to use the SDK directly throughout our codebase or abstract it behind an interface.

## Decision

Wrap the Notion SDK behind a `NotionClientWrapper` interface. No direct SDK usage outside of the adapter layer.

## Rationale

- **Isolation**: API changes are isolated to a single location
- **Testability**: Can test with simple implementations of the interface
- **Flexibility**: Can swap implementations (e.g., for testing, caching, or alternative clients)
- **Domain Language**: Interface uses our domain language, not Notion's
- **Upgrade Path**: SDK upgrades only require changes in one place
- **Anti-Corruption Layer**: Prevents Notion-specific concepts from leaking into business logic

## Consequences

### Positive

- Business logic is decoupled from Notion SDK specifics
- Easier to test components that use Notion data
- Can add features like caching, retry logic, and rate limiting transparently
- Clear boundary between our domain and Notion's domain
- Simplified mocking for integration tests

### Negative

- Additional abstraction layer to maintain
- Need to map between SDK types and our domain types
- Some SDK features might be harder to expose through the interface
- Initial development takes longer

## Implementation

- Create `NotionClientWrapper` interface with domain-specific methods
- Implement interface using the actual Notion SDK
- Use factory pattern to create instances
- Map SDK types to domain types at the boundary
- Keep all SDK imports within the adapter layer
- Use dependency injection to provide the wrapper to consumers
