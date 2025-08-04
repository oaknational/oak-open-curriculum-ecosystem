# Phase Jim

## General To Do

- [x] Create a report on which parts of the codebase are generic to "Oak MCP Servers" and which are specific to the "Oak Notion MCP Server", and begin to define domain boundaries between the two, with the goal of eventual extraction of the generic code into a shared library.
- [x] Identify all uses of Node specific APIs, and group them, to enable definition of an edge-compatible core API surface, with Node extensions for Node-specific use cases.
- [x] See if this repo is small enough that type-enabled linting can be enabled without making linting take too long for git hooks. -- it's borderline too slow, but acceptable for the extra issues and bad patterns it catches at check time.
- [x] Add plans to define boundaries between external systems (Notion), and our code. Make that boundary explicit and simple. Use Notion types and typeguards/predicates at that boundary to properly validate the data, we will use the same types in our codebase. Consider using Zod schemas to validate incoming data, but do not create new types where the Notion SDK types are already available.
- [x] Add Claude custom commands for quality gates, stepping back, commit and push
- [ ] Think about how best to use subagents
- [ ] make the relative import rule more targetted
- [ ] Add mutation testing to the test suite
- [ ] Turn it into a pnpm workspace and Turbo monorepo

## MCP server ideas

- [ ] Open Curriculum API MCP server including hybrid lexical+semantic search and all the API endpoints
- [ ] An MCP server that takes a JSON array of well defined tasks `[{name: string, prompt: string}]`, uses Claude Typescript SDK to execute them in parallel, and collates and returns the results to the calling MCP client. E.g. fixing linting issues, there are many issues, but approximately five groups of issues, so we could run five Claude tasks in parallel, and collate the results. Five Sonnet instances could be given prompts specify the files, issues, and likely solutions, and told that all fixes need to aligned with the rules in .agent/directives-and-memory/AGENT.md, and that all fixes need to be self-contained, i.e. not depend on other fixes, and that once their individual fixes are made the instances should stop, not pick up other tasks or make any other changes. If the changes are isolated, atomic, and precise, then the agents should be able to act in parallel without any issues.
