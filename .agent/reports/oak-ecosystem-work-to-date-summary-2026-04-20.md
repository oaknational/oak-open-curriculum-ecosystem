---
title: "Oak Open Curriculum Ecosystem — Work To Date"
status: active
last_reviewed: 2026-04-20
audience: mixed
---

# Oak Open Curriculum Ecosystem — Work To Date (April 2026)

This is a short summary of what has already been built, what is being worked
on now, what the next steps look like, and what value this work is intended to
create.

## Already done

### Product

- Released the code for all of this under an open licence, so the wider
  education, EdTech, and AI sectors can benefit from it directly.
- Created a strict, type-safe TypeScript SDK for the Oak Open Curriculum API
  and bulk data. The SDK is driven from the OpenAPI specification, so when the
  API changes the SDK can be brought into line automatically on the next
  release. This drastically lowers the cost of adopting Oak data in third-
  party products.
- Created a fully standards-compliant MCP server that uses that SDK to expose
  Oak's curriculum data inside AI clients. The two main use cases are giving
  teachers access to Oak's high-quality, fully sequenced curriculum in the
  tools they already use for planning, and enabling EdTech developers to work
  with Oak data directly inside their development environments.
- Shipped that server to a live invite-only alpha at
  `curriculum-mcp-alpha.oaknational.dev`, so this is already a working service
  rather than just an internal codebase.
- Integrated Clerk for user and authorisation management.
- Created a full hybrid semantic search service on Elasticsearch Serverless,
  with all the code needed to recreate it for internal or external use using
  Oak's bulk downloads.
- Benchmarked that search service through formal ground-truth and evaluation
  work, with the evaluation system itself still being refined.
- Created an SDK for the search service to lower the cost of working with it.
- Created MCP tools on top of that search SDK, so Oak data is discoverable to
  the agent in a way that is native to natural-language requests.
- Put the MCP App extension infrastructure in place to support a deeper, more
  visual experience for users, particularly teachers.

### Software engineering excellence

- Built the Oak Open Curriculum Ecosystem repo to a very high standard, which
  is especially important in an agentic engineering context because disorder
  compounds quickly if it is not actively controlled.
- Added more forms of automated checking than most projects carry, with the
  checks deliberately covering different failure modes so problems are caught
  before they accumulate.
- Kept the architectural structure formal, disciplined, and enforced. Core
  packages do one job and have no dependencies, libraries bring core packages
  together without importing each other, and anything that genuinely needs to
  be shared is factored out properly. That is good engineering practice in its
  own right, but it is also a deliberate way to enable rapid innovation across
  future Oak products and the wider sector.
- Managed third-party services such as Sentry, Elasticsearch, and Clerk via
  local adapters. That means the system degrades more gracefully when a
  service is unavailable, and it keeps the cost of switching providers much
  lower than it would otherwise be.
- Built extensive documentation, including a dedicated onboarding flow.
- In short, one role of this repo is to act as an exemplar of software
  engineering practice.

### Agentic engineering

- Helped pioneer the use of traditional guardrail tools such as automated
  testing, linting, and type-checking as part of reliable agent workflows,
  rather than only as checks for humans.
- Created several frameworks for stabilising longer-term agent engineering
  tasks, including session-state memory, learning loops, reusable rules,
  reviewer workflows, and continuity mechanisms.
- Took all of that, plus multiple other experiments, and turned it into a
  fuller agentic engineering framework called the Practice. It covers
  research, planning, development, validation, release, guardrails, multiple
  forms of memory and feedback loop, and self-improvement.
- Designed that framework to be transferable rather than useful only here,
  including a portable Practice Core that can move between repos so
  improvements can be learned locally and exchanged across the wider ecosystem.

## Currently working on

- Fully integrating Sentry and OpenTelemetry into the observability surfaces,
  with the remaining work now mostly around final deployment evidence rather
  than core runtime capability.
- Building an MCP App UI for the semantic search service to provide a self-
  directed search experience for users and to demonstrate the capabilities of
  the search system more clearly.
- Refining and expanding agentic engineering best practice, including the
  memory, continuity, reviewer, and governance parts of the system.
- Turning the completed knowledge graph alignment work into the right next
  implementation slice for knowledge graph integration.

## Next directions

- Make the search service available in the upstream Oak API to unlock more
  powerful content-discovery options.
- Continue to enhance the Practice.
- Continue to enhance the memory and continuity systems. The agents work with
  the repo, so the project context must live in the repo. Institutional
  knowledge about what was done no longer sits with developers in quite the
  same way, because they are doing less and less of the coding directly. The
  Practice is how that institutional knowledge continues to exist and remains
  useful to both developers and agents.
- Complete the remaining observability and user-facing search work needed to
  open public alpha.

## Future

- Public beta depends mainly on production Clerk migration, operational
  hardening, and further work on the user-facing experience, with PostHog
  already researched and planned as part of the broader observability and
  product analytics arc.
- There is a large body of research spanning product, engineering, agentic
  interaction, and open-education opportunities in this repo. That is not
  bloat or a useless backlog. Nothing gets promoted to a plan without triggers
  to activate or drop it, and different plan classes have their own validation
  mechanisms.

There is a lot more to discover in this repo, but the important point is that
it has already produced real product value, real engineering value, and a
reusable agentic engineering system that should continue to pay back as the
work develops further.
