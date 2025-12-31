read @rules.md , @testing-strategy.md , and @schema-first-execution.md , and take to heart that it is encouraged to take a step back and consider if work is delivering value through impact at the system level, not just fixing the problem right in front of you. Identify and question assumptions. Even before the First Question, ask, are we solving the right problem, at the right layer? Any generated plans must include regularly re-reading and re-committing to those foundation documents.

**Commit** to software engineering best practices, architectural systems design excellence, and great developer experience.

The schema first is an absolute for parts of the sdk related directly to calling the upstream api, or e.g. extracting information from the upstream OpenAPI spec, but it is okay to e.g. add additional metadata to mcp tools at type-gen time.

When analysing a generated file, always analyse the generator code that produced it as well, as it is the source of truth for the generated file.

After each piece of work, the fully quality gate suite must be run one gate at a time, and analysis of issues must wait until all gates are complete. Analysis must include asking if there are fundamental architectural issues or opportunities for improvement.

All plans must include instructions to create comprehensive TSDoc (general on all logic and state, with additional extensive examples on public interfaces), markdown documentation such as READMEs, and ADRs as appropriate.

Quality gate definitions for later. Note some of these gates will trigger earlier ones, caching should prevent duplicate work, see `docs/development/build-system.md` and ADR 065.

Always ask, "what impact are we trying to create for the user with this change?"

Do not assume you know what the initial step should be, discuss with the user first.

```shell
# From the repo root, one at a time, with no filters
pnpm type-gen # Makes changes
pnpm build # Makes changes
pnpm type-check
pnpm lint:fix # Makes changes
pnpm format:root # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```
