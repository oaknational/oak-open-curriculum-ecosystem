---
name: "Web Bot Auth - signed agent verification"
collection: discovery
lane: future
status: strategic-tracking
last_updated: 2026-06-01
parent_plan: agentic-mechanisms-discovery.plan.md
security_cross_link: ../../security-and-privacy/README.md
---

# Web Bot Auth agent verification plan

> **Strategic brief (`future/`).** Web Bot Auth is a first-class discovery and
> access-control concern for official Oak web apps. Discovery owns the
> agent-readiness placement; security owns any enforcement evidence and
> risk-disposition claims.

## Purpose

Track whether Oak should recognise signed automated agents through Web Bot Auth
or equivalent edge verification, and define how that decision composes with
robots, sitemaps, Content Signals, API catalog discovery, and security evidence.

Primary references:

- Cloudflare Web Bot Auth documentation:
  <https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/>
- Cloudflare signed agents documentation:
  <https://developers.cloudflare.com/bots/concepts/bot/signed-agents/>

## Problem, End Goal, Mechanism, And Means

- **Problem.** Agent readiness is not only outbound metadata. Official Oak web
  apps also need a position on inbound automated agents: which agents may fetch,
  how their identity is verified, and whether verification is merely observed or
  used for policy.
- **End goal.** Every official Oak web app has a discoverable baseline
  (`robots.txt` and sitemap), a public usage-policy posture where relevant
  (Content Signals), and a recorded Web Bot Auth decision that security can
  evidence if enforcement is enabled.
- **Mechanism.** Keep Web Bot Auth in discovery because it shapes agent access
  to public web surfaces, then cross-link to security for edge configuration,
  validation evidence, and release claims.
- **Means.** Track official Web Bot Auth and signed-agent guidance, decide
  whether Oak accepts signed-agent verification, define per-host rollout scope,
  and require security evidence before claiming a control is enabled.

## Domain Boundaries

This discovery plan owns:

- Web Bot Auth as part of Oak's public agent-readiness surface;
- relationship to robots, sitemaps, Content Signals, and API catalog discovery;
- per-host discovery scope for official Oak web apps;
- the promotion trigger into executable discovery planning.

Security-and-privacy owns:

- edge configuration and policy enforcement;
- WAF, Cloudflare, or equivalent provider evidence;
- security claim classes and merge-readiness evidence;
- risk disposition if Web Bot Auth is declined or unavailable.

This plan does not own:

- implementation in Cloudflare or another edge provider;
- private bot allowlists unrelated to public agent readiness;
- replacing robots, sitemaps, or Content Signals with cryptographic
  verification.

## Non-Goals

- Do not treat Web Bot Auth as a public metadata file served by the web app.
- Do not claim signed-agent verification is enabled without security evidence.
- Do not use Web Bot Auth as a substitute for `robots.txt`, sitemaps, or
  Content Signals.
- Do not require Web Bot Auth for hosts that have no agent-facing access-control
  policy need.

## Dependencies And Sequencing

Blocking prerequisites:

- **`blocking`** - Oak chooses whether signed-agent verification is part of its
  public agent-readiness posture.
- **`blocking`** - Security identifies the owning edge/provider controls and
  evidence format.
- **`blocking`** - Official Oak web apps are inventoried for baseline robots and
  sitemap coverage.

Beneficial prerequisites:

- **`beneficial`** - Content Signals policy is settled. *Without it:* Web Bot
  Auth can still be tracked as identity verification, but not as a usage-policy
  replacement.
- **`beneficial`** - Partner or crawler demand exists for signed-agent handling.
  *Without it:* record a decline/defer decision and keep normal crawl baselines.

## Strategic Acceptance Criteria And Success Signals

This strategic plan is successful when:

- Web Bot Auth is visible as its own discovery lane, not hidden under robots;
- every official Oak web app baseline still includes `robots.txt` and sitemap
  requirements;
- any Web Bot Auth implementation claim routes through security evidence;
- future executors know whether Web Bot Auth is enabled, declined, deferred, or
  unavailable for Oak.

Success after implementation would mean:

- signed-agent verification is configured only on the intended hosts;
- security evidence names the provider control, policy behaviour, and test
  result;
- discovery docs explain how Web Bot Auth composes with robots, sitemaps,
  Content Signals, and API catalog discovery.

## Promotion Trigger To `current`

Promote when Oak decides to enable or formally decline Web Bot Auth for official
Oak web apps, or when a partner/client requirement makes signed-agent
verification decision-ready.

Promotion must produce executable tasks for host inventory, provider
configuration evidence, test requests, public documentation, and security
cross-link updates.
