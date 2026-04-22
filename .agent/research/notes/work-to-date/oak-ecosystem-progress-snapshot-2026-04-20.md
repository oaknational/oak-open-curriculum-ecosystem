---
title: "Oak Open Curriculum Ecosystem — Progress Snapshot"
status: active
last_reviewed: 2026-04-20
audience: mixed
---

# Oak Open Curriculum Ecosystem — Progress Snapshot (April 2026)

This project has moved well beyond a promising idea. It now has real shape as
both a practical product platform and a strong piece of engineering work. The
core idea is simple: take Oak's open curriculum data and make it far easier to
use well, whether you are a teacher working in an AI tool, a developer
building something new, or Oak itself extending its own capabilities.

So far, a substantial amount has already been delivered. The repository is
public and open-licensed. There is a strict, generated TypeScript SDK for
Oak's API and bulk data. There is a live, standards-compliant MCP server that
brings Oak curriculum into tools such as ChatGPT, Claude, and Cursor. There
is a hybrid semantic search service, plus its own SDK and MCP tools, so the
curriculum can be discovered through natural language as well as direct API
access. Clerk is integrated for authentication and authorisation, and the MCP
App extension groundwork is in place so richer visual experiences can sit
alongside the MCP tools.

That matters because one investment is now doing several useful jobs at once.
Teachers can reach Oak's curriculum in the environments they already use for
planning. EdTech and AI teams can build on Oak data with much less integration
work. Oak gets reusable infrastructure rather than one-off implementations.
The repo has effectively become a platform for turning curriculum data into
tools, products, and experiments much faster than would otherwise be possible.

Just as importantly, the work has been built with a high level of discipline.
The architecture is deliberately clean, the automated checks are unusually
strong, third-party services sit behind local adapters enabling cheap provider
switching, and the documentation and onboarding are extensive. More than that,
the engineering has been organised deliberately to stay modular and remixable:
small core parts, clear boundaries, and shared building blocks that can be
reused in future Oak products or by teams outside Oak. That is not just tidy
engineering. It is part of the value, because it makes faster innovation and
lower-cost experimentation much more realistic.

This has also become one of the clearest expressions of the wider Practice.
What started as a set of experiments in using agents for software delivery has
grown into a more complete system for research, planning, implementation,
validation, continuity, and learning. In other words, the repo is not only
shipping curriculum infrastructure; it is also producing the Practice itself
as a separate and valuable piece of work: a transferable, learning support
system for agentic engineering that can move between repos, improve over time,
and help other teams work with agents more reliably. That is increasingly an
asset in its own right, not just an internal means to an end.

The current focus is fairly clear. Public alpha now mainly depends on closing
two visible pieces of work: finishing the Sentry and OpenTelemetry evidence
needed to complete the observability lane, and building the user-facing MCP
App search experience that shows the semantic search system at its best.
Alongside that, the first knowledge-graph alignment work has been completed,
so the next question is less "should this happen?" and more "what is the best
way to integrate it?". The Practice itself is also continuing to improve as
new lessons are turned into better rules, reviewers, and continuity systems.

After that, the next steps are practical rather than speculative. Closing the
current lanes opens public alpha. The path to public beta then centres on
production Clerk migration, operational hardening, stronger alerting, and the
next round of user-facing polish. Beyond the milestone gates, there are some
very promising longer arcs: making the search service reusable from the
upstream Oak API itself, deepening the memory and continuity systems so the
project context stays in the repo, and continuing to bring knowledge-graph and
other richer education capabilities into the same shared infrastructure.

The overall impact is encouraging. This work is already lowering the cost of
building on Oak's curriculum, making good curriculum data easier to use, and
creating infrastructure that can support many downstream tools rather than
just one. It is also creating two broader forms of leverage: a modular,
well-organised engineering base that should make future Oak product work and
wider-sector reuse faster, and a transferable Practice that has value beyond
this single repository. Open public educational assets, strong engineering
discipline, and agentic delivery are reinforcing each other here rather than
pulling in different directions. There is still a lot to do, but the shape is
now clear, the foundations are real, and the next steps feel like delivery
rather than discovery.
