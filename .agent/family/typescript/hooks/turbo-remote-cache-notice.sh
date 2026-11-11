#!/usr/bin/env sh

# The Turbo remote cache is optional: this repository enables it, a shell need
# not. Sourced by pre-commit and pre-push after TURBO_UI is set. When the shell
# carries no TURBO_TOKEN, say so in one line and carry on: every gate runs the
# same. The line claims only what the shell shows: turbo also reads a `turbo
# login` credential from its own config when the variable is absent, so the
# line names that as the one other way the cache is reached. A token the cache
# refuses is turbo's own warning in the gate output, never hidden here.
# A token reaches the cache only with a team: TURBO_TEAM in the environment
# or this checkout's own `turbo link` config (.turbo/config.json, which a
# new worktree lacks), so a token with neither gets its own line.
# docs/engineering/build-system.md §Caching says how a host and CI reach the
# cache without a login.
if [ -z "${TURBO_TOKEN:-}" ]; then
  echo "Turbo remote cache: TURBO_TOKEN is not set in this shell; unless turbo holds a login credential of its own, it uses its local cache. To share the remote cache without a login, configure an optional remote Turbo cache (docs/engineering/build-system.md, Caching)."
elif [ -z "${TURBO_TEAM:-}" ] && [ ! -f .turbo/config.json ]; then
  echo "Turbo remote cache: TURBO_TOKEN is set but no team is named (no TURBO_TEAM, no turbo link config in this checkout), so turbo uses its local cache. Export TURBO_TEAM alongside the token (docs/engineering/build-system.md, Caching)."
fi
