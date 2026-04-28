---
title: "Don't test SDK internals"
category: testing
barrier_met: true
source_sessions:
  - "2026-04-06b: legacy _meta['ui/resourceUri'] test deleted"
---

## Pattern

Tests must prove **product behaviour**, not third-party SDK internal
normalisation or compatibility logic. If an assertion can only fail
when the SDK changes (not when Oak's code changes), the test is
testing the wrong thing.

## Anti-pattern

Writing E2E or integration tests that assert the presence or shape of
SDK-internal output (e.g. a backward-compatibility key that the SDK
adds silently). These tests create false coupling to the SDK's
internal decisions, break on SDK upgrades without any change to
product code, and obscure the true test surface.

## Correct approach

Test the **contract at your boundary**:

1. What does the Oak code put in? (test the projection/config)
2. What does the wire protocol produce? (test the protocol response)
3. Does the system behave correctly? (test product behaviour)

Do not assert on SDK-internal transformations between steps 1 and 2.
The SDK is a dependency, not a test subject. Trust it or replace it.
