please read @rules.md @testing-strategy.md and @schema-first-execution.md and commit to them. The schema first is an absolute for parts of the sdk related directly to calling the upstream api, but it is okay to e.g. add additional metadata to mcp tools at type-gen time.

Quality gate definitions for later. Note some of these gates will trigger earlier ones, caching should prevent duplicate work, see `docs/development/build-system.md` and ADR 065.

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
