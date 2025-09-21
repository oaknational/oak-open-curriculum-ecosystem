# General To Do

- [x] Create a report on which parts of the codebase are generic to "Oak MCP Servers" and which are specific to the "Oak Notion MCP Server", and begin to define domain boundaries between the two, with the goal of eventual extraction of the generic code into a shared library.
- [x] Identify all uses of Node specific APIs, and group them, to enable definition of an edge-compatible core API surface, with Node extensions for Node-specific use cases.
- [x] See if this repo is small enough that type-enabled linting can be turned on without making linting take too long for git hooks. -- it's borderline too slow, but acceptable for the extra issues and bad patterns it catches at check time.
- [x] Add plans to define boundaries between external systems (Notion), and our code. Make that boundary explicit and simple. Use Notion types and type-guards/predicates at that boundary to properly validate the data, we will use the same types in our codebase. Consider using Zod schemas to validate incoming data, but do not create new types where the Notion SDK types are already available.
- [x] Add Claude custom commands for quality gates, stepping back, commit and push
- [x] Think about how best to use sub-agents - code review, architecture review, etc.
- [x] Turn it into a pnpm workspace and Turbo monorepo.
- [x] Standardise the architecture for ease of onboarding and maintenance.
- [x] Better define the providers folder
  - [x] consider a more semantically useful name
  - [x] find out where we are on CLoudflare worker support (web APIs, no Node.js dependencies)
- [x] Consider a more canonical three tier design, (apps and services) -consumes-> libs -uses-> (core and utilities) or some variant of that? What does excellent look like?
- [x] Improve getting started and onboarding docs, make sure all architecture docs and diagrams are up to date and accurate.
- [x] Add support for remote MCP servers, the initial version is local only.
- [x] Find all the as, any, non-null, `record<string`, eslint-disable, ts-ignore, ts-expect-error, etc in the SDK and MCP server. and remove them manually.
- [x] Improve the documentation, the rules file is now too large to be consistently applied by the agent, and we have other "agent guidance" docs... we need to consolidate and refine. Fewer, better, more consistent.
- [x] Add a trivial front page for the mcp http server, so it doesn't show "authentication error" when visited in a browser... in fact, maybe put some _very_ basic quickstart docs there?
- [=] Add the utilities, libraries, and a single app (for now) for creating the semantic search indices, keeping them updated, and providing a UI for using them. IN PROGRESS
- [x] Profile the `pnpm qg` command, and see what we can speed up adn where... it's mostly the linting that is slow, and likely that is due to type-based rules. This is important because it is a DX frustration and it is slowing down the development process, including for agents.
- [x] Add more canonical URLs to the MCP server, and the SDK.
- [ ] Remove generated files from version control `git filter-repo --path dist --path docs/api --path '_typedoc_*' --invert-paths` -- alters history
- [ ] Update dependency versions across the board.
- [ ] Add mutation testing to the test suite
- [x] Make sure that the generated types are properly crossed referenced, so not anyValidKey: anyValidValue, but specificValidKey: validValuesForThatSpecificKey, required types derived from data structures with reference IDs on both sides. This strict type-safety is one of the key benefits of the SDK architecture over the standard auto-generated API client.
- [ ] Improve the logger, Consola is too lightweight, we need something production ready and cloud runtime compatible. Enforce logger usage with eslint no-console rule
- [ ] Update Zod to Zod 4 everywhere, requires support from OpenAPI type generation pipeline.
- [ ] Standardise and improve the Claude sub-agents.
- [ ] Production hardening, auth, caching, logging, tracing, error handling (Result<T,E>), error tracking (Sentry), etc.
- [ ] Rename the type-gen code from scripts to something more meaningful.
- [ ] Consider putting the type-gen code in a separate package from the SDK runtime code, they are not tightly coupled and have different if related intentions. This could go either way, the typegen code essentially becomes a library of functions that are used within the SDK runtime code.

## MCP server ideas

- [+] Open Curriculum API MCP server including hybrid lexical+semantic search and all the API endpoints IN PROGRESS
- [ ] An fan-out-fan-in MCP server that takes a JSON array of well defined tasks `[{name: string, prompt: string}]`, uses Claude Typescript SDK to execute them in parallel, and collates and returns the results to the calling MCP client. E.g. fixing linting issues, if there are many issues, but approximately five _groups_ of issues, we could run five agent tasks in parallel, and collate the results. Five Sonnet instances could be given prompts specify the files, issues, and likely solutions, and told that all fixes need to align with the rules in .agent/directives-and-memory/AGENT.md, and that all fixes need to be self-contained, i.e. not dependent on other fixes, and that once their individual fixes are made the instances should stop, not pick up other tasks or make any other changes. If the changes are isolated, atomic, and precise, then the agents should be able to act in parallel without issue, and the calling agent can review the results.
