# Contract Testing and Schema Evolution

**Status**: Iceboxed
**Original**: `quality-and-maintainability/contract-testing-schema-evolution.plan.md`
**Iceboxed**: 2026-02-23

## Concept

Validate that the SDK's generated types remain structurally compatible
with the upstream OpenAPI schema across schema evolution events. Includes
contract snapshot tests, breaking-change detection, and migration
tooling.

## Why Iceboxed

- Large initiative (10-12 weeks estimated), owner TBD
- Not referenced from any active milestone
- No upstream schema evolution events are imminent
- The cardinal rule (`pnpm sdk-codegen` aligns everything) already provides
  the core guarantee

## Reactivation Trigger

- Upstream API announces a breaking schema change
- SDK consumers report type-compatibility issues after schema updates
- Milestone planning includes schema evolution as a deliverable

## References

- ADRs 029, 030, 031, 048 (schema-first principles)
- [Mutation testing plan](../agentic-engineering-enhancements/mutation-testing-implementation.plan.md)
  (complementary quality assurance)
