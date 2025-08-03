# ADR-005: Automatic PII Scrubbing

## Status

Accepted

## Context

When exposing Notion workspace data through MCP, we may inadvertently expose personally identifiable information (PII) such as email addresses. This could:

- Violate privacy regulations (GDPR, CCPA)
- Expose sensitive user information
- Create security risks
- Damage user trust

We need a systematic approach to prevent PII exposure.

## Decision

Automatically scrub email addresses in all outputs, displaying them as `abc...@domain.com` format. Implement this as a pure function that processes all user-related data before it leaves the system.

## Rationale

- **Privacy by Design**: PII protection built into the system, not added as an afterthought
- **Compliance Ready**: Helps meet privacy regulation requirements
- **User Trust**: Demonstrates commitment to protecting user data
- **Fail-Safe**: Automatic scrubbing prevents accidental exposure
- **Consistency**: Applied uniformly across all outputs
- **Testability**: Pure function implementation enables comprehensive testing

## Consequences

### Positive

- Reduced risk of PII exposure
- Consistent privacy protection across the system
- Easy to test and verify
- Can be extended to other PII types in the future
- Users still see partial email for identification

### Negative

- Full email addresses not available even when needed
- Slight performance overhead for string processing
- May need exemptions for certain use cases
- Pattern matching might miss edge cases

## Implementation

- Create pure function `scrubEmail(email: string): string`
- Apply to all user data transformations
- Use regex pattern to detect email addresses
- Replace with format preserving first 3 chars and domain
- Add comprehensive unit tests for edge cases
- Document any exemptions clearly
