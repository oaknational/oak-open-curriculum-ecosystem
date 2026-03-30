# No Symlinks

Symlinks are forbidden in this repository. Any discovered symlinks must be removed immediately as highest priority.

The correct approach is to structure workspaces in accordance with best practice architectural principles and to use the pnpm workspace dependency graph appropriately. Platform adapters (`.claude/`, `.cursor/`, `.agents/`) must be real files — thin pointers to canonical content — not symlinks to shared locations.

pnpm's own `node_modules` symlinks are managed by pnpm and are not in scope of this rule.

See `.agent/directives/principles.md` §Code Design for the full policy.
