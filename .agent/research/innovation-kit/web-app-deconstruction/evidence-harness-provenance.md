# Evidence-harness provenance

The original web-app deconstruction used a small TypeScript package, fixtures,
tests and CI wiring to make selected repository observations repeatable. Those
surfaces were intentionally retired when the corpus moved into .agent/research:
this copy preserves analysis and examples, not a maintained research
application.

The last complete harness is immutable at PR 25 head
[4915fe1826372d9b0b6ee18322500c811128f41c](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/tree/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence).
Commands retained in the research documents describe how an observation was
originally produced. They are provenance, not instructions that work in the
current checkout and not a continuing reproducibility claim.

## Historical research gates

The retired package checked internal links and record structure, exercised its
inventory/comparison helpers, and recorded normalised JSON rather than
committing generated results. The current repository's documentation gates now
protect the retained Markdown corpus; they do not recreate the old probes.

## Component-boundary inventory

The
[inventory script](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/component-boundary-inventory.ts)
counted and classified selected Oak Components and OWA source relationships for
the pinned revisions named in the analysis.

## OCE inventory

The
[OCE inventory](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/oce-inventory.ts)
produced the structural facts used by the OCE system map.

## OWA architecture inventory

The
[OWA inventory](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/owa-architecture-inventory.ts)
sampled routing, state, configuration and assurance surfaces at the cited OWA
revision.

## Database/API chain inventory

The
[chain inventory](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/database-api-chain-inventory.ts)
and its
[tests](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/tests/database-api-chain-inventory.test.ts)
supported the revision-pinned Database Tools → OpenAPI → OCE atlas.

## OpenAPI provider/consumer comparison

The
[comparison script](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/openapi-oce-contract-comparison.ts)
compared selected provider and consumer contract behaviour. Its scope and
network prerequisites remain part of the limitations recorded in the linked
analysis.

## Oak Components runtime probes

The
[runtime probe](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/oak-components-runtime.ts)
and
[Next fixtures](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/tree/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/fixtures/next-app)
supported the recorded package-artifact and host-runtime observations.

## Curriculum-export redirect probe

The
[redirect probe](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/scripts/curriculum-export-redirect.ts)
and
[characterisation fixture](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction/packages/research-evidence/fixtures/curriculum-export/missing-mv-refresh.test.ts.template)
established the two assertions described in the experiment record at its pinned
revision.
