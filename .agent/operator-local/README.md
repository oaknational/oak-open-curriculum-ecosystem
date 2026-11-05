# The operator profile has moved to the home directory

The operator profile — which identity performs which action class on
third-party systems, how this operator wants agents to write to them and as
them, and personal operating preferences — no longer lives in this checkout.
Per [PDR-141](../practice-core/decision-records/PDR-141-operator-profile-in-the-home-directory.md)
it lives under the Practice's home-directory root so that every Practice
repository, linked worktree and clone on the machine reads the same files:

- `~/.practice/profile/index.md` — true of the operator everywhere, on every
  machine and in every repository;
- `~/.practice/profile/repos/<scope-key>.md` — true of one repository line,
  keyed by the root package.json name (`name`, or `scope--name` for a
  scoped name), never by a remote or a path;
- `~/.practice/profile/machines/<machine-key>.md` — true of one machine,
  keyed by the short host name, which is what lets the root be a private
  git repository the operator syncs between machines.

Every document opens with frontmatter governed by
[`practice-core/schemas/operator-profile.schema.json`](../practice-core/schemas/operator-profile.schema.json);
`pnpm profile:check` validates a present profile and says so, exit 0, when
none exists.

The contract is PDR-141's: strictly optional (a missing file is the expected
condition and nothing warns, blocks or depends on it); below every tracked
surface in the authority order
([`orientation.md` §The Operator-Local Profile Tier](../directives/orientation.md#the-operator-local-profile-tier));
identities named, credentials never; nothing load-bearing for a gate,
validator or build; inferred content marked until the operator ratifies it.
The single tracked read pointer is the shared start-right grounding
([`start-right-quick/shared/start-right.md`](../skills/start-right-quick/shared/start-right.md)).

This directory stays git-ignored (see the sibling `.gitignore`) so that a
file placed here by an older habit remains untracked; it is not a home for
anything.
