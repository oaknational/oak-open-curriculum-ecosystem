~~Profile the check performance and getting rid of the root scripts, if it needs CI it should be in a workspace~~

graph foundations for MVP

profile pnpm check
profile pre-commit hooks
learning loop consolidation
skills refresh

land collaboration P-Foundation/P0

agent tools cli overhaul
agent communication improvements

~~Researching which platforms no longer support commands, if they are going away, and move everything to skills~~

~~Identify which platforms use which skills sources so that no duplicates are registered~~

Profile mcp performance with sentry, finish adding sentry features

Separate oak specific instances from general frameworks

Stryker on simplest workspace

Change code gen to produce a build output rather than source code for another workspace

Co-locate data shape processing, data processing, run time libraries, specific instances, apps. Within codegen break it down

Three part graph MVP

User facing search

Identify seam between data and data processing and domain logic for search, in preparation for enabling the source to be a data service rather than the bulk data

Make sure that all rules, skills, directives and anything else routinely read has an estimated token size limit, start with what it is today, then profile in dev tool usage. Budget is probably around 80k for 200k models, 120k for 1M models

Apply a similar budget system to resources surfaced by the MCP server
