/jc-start-right-quick Please review the plan surfaces and roadmaps and vision etc, and write a short, multi-paragraph summary document of what work we have done, intend to do, what impact we intend to have through delivering what value, and what next steps look like.

Include all threads, clustered meaningfully. Some groupings to consider are the following, however, this is in NO WAY exhaustive and you must attempt to identify other meaningful directions.

Already done

## Product

- Release all of this under an open licence, to benefit the wider education, edtech, and AI sectors.
- Create a strict, type-safe Typescript SDK for the Oak Open Curriculum API (both the API and the Bulk Data). The SDK is driven from the OpenAPI spec, so if the API updates the SDK also automatically updates on the next release.  This drastically lowers the cost of adopting the Oak API into third party products.
- Create a fully standards compliant MCP server that uses the SDK to expose the Oak Open Curriculum Data in AI clients. The two main use cases being: providing teachers with access to Oak's high quality, fully sequenced curriculum in the environments they are already using for planning, e.g. ChatGPT and Claude; and enabling edtech developers to work with the Oak data inside their development environments, to again lower the cost of working with Oak data, and increase the rate of innovation in the wider sectors.
- Integrated Clerk for user and authorisation management.
- Create a full hybrid semantic search service on Elasticsearch Serverless, with all the code necessary to recreate it for internal or external use, using the Bulk Downloads data. Benchmark that search service, and make sure that it at least matches, and typically exceeds, the usefulness of the product search service.
- Create an SDK for that search service to lower the cost of working with it.
- Create MCP tools based on that search SDK, so that the Oak data is fully discoverable to the agent using the MCP tools, in a way that is native to natural language requests.
- Use the MCP App extension to provide a deeper and visual UI experience for the MCP app, aimed at teachers.

## Software Engineering Excellence

- The Oak Open Curriculum Ecosystem repo is built to the highest standards, which is absolutely necessary in the context of agentic engineering to avoid producing low-quality output.
- The repo has more forms of automated checking than most projects, and the orthogonal nature of the checks helps catch issues that might otherwise accumulate and lower the level of organisation within the repo - that is a risk in any repo, when the disorder becomes dominant the system will suddenly collaps, and in agentic contexts that risk is accelerated
- The repo architectural structure is formal, disciplined, and enforced. Core packages do not have dependencies and do one job, libraries bring core packages together and do not import from each other, functionality that needs to be shared is factored out into new core packages. Apps import libraries and export nothing. This is simple good practice but it also enables RAPID innovation as those independent parts can be remixed into new capabilities and new apps.
- Integrations with third party services such as Sentry, Elasticsearch, Clerk, are always managed via local adapters. The main benefits being 1. if the service is not authorised or not working, the rest of the app will still function, 2. it makes switching provider hugely easier and cheaper.
- This repo contains extensive documentation of all sorts, including a dedicated onboarding flow.
- In short, one of the roles of this repo is as an exemplar of software engineering practice.

## Agentic Engineering

- Pioneered taking traditional guardrail tools such as automated testing and linting, and making them part of reliable agent workflows.
- Created several framework for stabilising longer-term agent engineering tasks, including session state memory, learning loops, reusable rules etc.
- Took all of that, and multiple other experiments, and created the Practice, a full agentic engineering framework that exists that covers research, planning, development, validation, release, guardrails, mutliple forms of memory and feedback loops, and self-improvement. The Practice is designed to be transferable to any repo, and includes core mechanisms allowing enhancements developed in the ecosystem of Practice repos to be exchhanged and learned from, making the self-improvement local _and_ distributed and accelerating as more repos contribute.

Currently working on

- Fully integrating Sentry and Open Telemetry into the observability surfaces
- Building an MCP App UI for the semantic search service to provide a self-directed search experience for users, and to demonstrate the capabilities of the semantic search
- Refining and expanding agentic engineering best practice, innovating and learning from the wider industry
- Planning the integration of the knowledge graphs

Next directions

- Plan to make the search service available in the upstream Oak API to unlock powerful content discovery options.
- Continue to enhance the Practice
- Continue to enhance the memory and continuity systems. The agents work with the repo, so the project context must be IN the repo. Institutional knowledge about what was done doesn't sit with developers in the same way because they are doing less and less of the actual coding; the Practice is how that institutional knowledge continues to exist, and how it remains useful to both developers and agents.
- Public alpha is blocked in observability and the user-facing search service.

Future

- Public beta is blocked on Posthog integration, already researched and planned.
- There is a large body of research spanning product, engineering, agentic interactions and so on in this repo, enough to keep us at the forefront for some years. That isn't bloat or a useless backlog, nothing gets promoted to a plan without triggers to activate or drop the plan, and we have multiple plan classes with different triggers and validation mechanisms.

There is a lot more to be discovered in this repo... ask it about itself.

