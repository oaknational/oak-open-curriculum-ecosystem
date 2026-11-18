# Sub-agent declarations

A canonical sub-agent template under `.agent/sub-agents/templates/` declares what its adapters
carry in its frontmatter: its `description`, the platforms that carry an adapter, and per
platform only what deviates from the estate's standard adapter body (`.agent/sub-agents/README.md`
§Declarations). The declaration is the one source for the Cursor, Claude and Codex adapters
and the `[agents."<name>"]` tail of `.codex/config.toml` (`compute-dont-hope`): `pnpm
portability:fix` renders them from it and `pnpm portability:check` recomputes them byte for
byte, so none is ever edited by hand. This module owns the declaration shape, its reader and
the renderers; the validator leg and its drift check live in `validators/portability/`.

The module is carried as the same bytes on both estates that run it (the exchange's N1 row),
save the result package's import line (`@oaknational/result` here): a change here is made once
and lands on both; an estate's own facts live in its declarations, never in the generator's
defaults.

- [`subagent-declaration.ts`](subagent-declaration.ts) — the closed declaration shape: a
  ROLE (one description, per-platform deviations) or a FAN-OUT (`variants`, each an adapter
  in its own name written out in full); [`claude-fields.ts`](claude-fields.ts) the Claude
  block and the combinations it refuses (`tools: none`, `body: system-prompt`);
  [`declaration-scalars.ts`](declaration-scalars.ts) the platform enum, the one-line scalar
  and the prose fields; [`template-name.ts`](template-name.ts) the name a path can carry.
- [`read-subagent-declaration.ts`](read-subagent-declaration.ts) reads the block at a
  template's head as YAML, sharing only the fence line with
  [`../rule-declarations/frontmatter-lines.ts`](../rule-declarations/frontmatter-lines.ts);
  [`system-prompt-block.ts`](system-prompt-block.ts) takes the template's `## System prompt`
  blockquote for a Claude adapter whose body is that block rather than the pointer.
- [`adapter-defaults.ts`](adapter-defaults.ts), [`standard-adapter-body.ts`](standard-adapter-body.ts)
  — the fields a role fills when it declares none, and the measured standard body (the title,
  the pre-pointer line, the closing prose) a declaration deviates from;
  [`adapter-spec.ts`](adapter-spec.ts) writes the pointer sentence and reduces a role or a
  variant to what one adapter renders
  from and names the surfaces.
- [`render-subagent-adapters.ts`](render-subagent-adapters.ts) — the Cursor and Claude
  adapters as pure functions of the declarations, composing
  [`render-codex-adapter.ts`](render-codex-adapter.ts) (the TOML form and the values it cannot
  carry verbatim) and [`render-gemini-adapter.ts`](render-gemini-adapter.ts) (rendered only
  where a declaration names `gemini`; none does on this estate);
  [`render-codex-registry.ts`](render-codex-registry.ts) renders the registry's blocks after
  its hand-kept head and refuses a foreign line in the tail; [`yaml-scalar.ts`](yaml-scalar.ts)
  writes each scalar in the form the estate's formatter keeps.
- [`declared-adapters.ts`](declared-adapters.ts) — the adapters the declarations render, each
  with the platforms it names, read from the tree for the health probe's adapter parity
  (`core/health-probe-parity.ts`), so the probe and the leg share one truth.

The portability validator's `subagent-projection-validation.ts` wires the renderers into
`portability:check` and `portability:fix` over the shared drift check
([`validators/portability/projection-drift.ts`](../validators/portability/projection-drift.ts));
`subagent-registry-surface.ts` reads the registry and splits its kept head. A host arriving
with hand-kept adapters writes each template's declaration from what its adapters say, then
lets the generator take the surfaces over; the running estate never derives a declaration
from the adapters (`pnpm subagents:check` still reads and validates them).
