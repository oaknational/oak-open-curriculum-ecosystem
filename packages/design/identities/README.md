# Identity packs

The identity-pack tier. Each child directory is one identity pack — a
self-contained, **data-only** workspace carrying an identity's validated
manifest, authored CSS, vendored assets, and its own licence surface.
The tier is governed by the ratified `tango-identity-pack` delivery plan
(ticket MCP-615; the plan node lands with that ticket's PR) and exists
so that "identity as configuration" is a shipping mechanism: adding an
identity is a data act, proven by the identity-№N regression.

## Tier invariants (machine-checked)

`packages/core/oak-eslint/scripts/validate-boundaries.ts` carries this
tier's leg (`pnpm --filter @oaknational/eslint-plugin-standards
validate-boundaries`, on the `repo-validators:check` chain). There is
deliberately **no hand-declared pack inventory** — a declared tuple
would make every pack addition a framework-code edit, violating the
identity-№N property the tier exists to prove. Instead the leg checks
structure:

- the tier directory exists (a rename must fail loud, never silently
  shrink the checked surface — this tier has no `package.json`, so the
  package-keyed workspace scans cannot see it);
- every child **directory** (only the enumerated transients are exempt,
  by name AND kind: `node_modules` and `.turbo` directories, a
  `.DS_Store` file — every other child, dot-prefixed or not, faces
  validation) is a pack workspace named
  `@oaknational/identity-pack-<directory>`, `"private": true`, with a
  non-blank `license` declaration and **no `scripts`** (packs are
  data-only, on the `oak-design-assets` precedent, and contribute
  nothing to the task graph); a malformed pack `package.json` is a
  located finding, never a bare crash;
- every file a pack carries fits the **permitted anatomy** — a closed
  shape: manifest/data JSON, authored CSS, docs, licence surfaces, and
  vendored assets (fonts and images). Source or executable code, tool
  configuration, and any file class the permitted set has never
  admitted are refused by default — a new class enters by amending the
  set deliberately, never by omission. Three legs keep the refusal
  honest: JSON is admitted **by place and format suffix, never by
  extension** (the root `package.json` and `manifest.json`, and
  `*.tokens.json` DTCG modules under `dtcg/` — tool configuration rides
  the `.json` extension, and a place alone re-opens the hole inside the
  place, so the DTCG format's own suffix names the admitted shape); the
  contents walk skips
  only enumerated transient artefacts (`node_modules`, `.turbo`,
  `.DS_Store`), so a committed dot-entry faces the same anatomy
  instead of hiding behind its leading dot; and **symbolic links are
  refused as a file kind** — a link can point outside the pack
  boundary, so no linked file reads as well-shaped. This is what makes
  the data-only invariant (and the depth note below) machine-checked
  rather than doctrinal.

Pack specifiers stay out of the lint framework by mechanism, not by
discipline: `createDesignSiblingZones` accepts only
`DesignPackageImport` members, so a pack specifier is a compile error
unless it first enters `DESIGN_PACKAGE_IMPORTS` — and entering that
tuple immediately fails the Design boundary inventory leg, because the
depth-1 workspace scan can never see a nested pack. These two refusals
are what discharge the plan's "pack specifiers never enter the depth-3
zone builders" clause.

One recorded (not recomputed) fact remains: the
`packages/design/identities/*` line in `pnpm-workspace.yaml`. At zero
packs its removal is consequence-free; from the first pack onward,
`workspace:*` consumers and the T1d roster derivation make its removal
loud.

## Boundary-zone depth note (read before adding source to a pack)

Packs carry no ESLint config, so `createDesignBoundaryRules`'
path-zone derivation never runs here. Its relative zones (for example
`'../../../apps/**'`) resolve against `process.cwd()` — which matches
each design workspace's own directory only because every design
workspace **that lints** runs `eslint .` from its own directory. A pack
at this tier's depth would derive directories that do not exist. If a
pack ever legitimately gains source and a lint config,
`createDesignBoundaryRules` needs a depth (or `basePath`) parameter
first; until then, source in a pack is a shape error the data-only
invariant above refuses.
