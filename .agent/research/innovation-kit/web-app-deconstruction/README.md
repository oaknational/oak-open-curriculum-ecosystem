# Web-app deconstruction research corpus

This directory preserves the analytical record that preceded the formal
definition of the Innovation Kit. It deconstructs Oak Web Application, Oak
Components, Oak Open Curriculum Ecosystem, Database Tools and their surrounding
contracts in order to ask what a toolkit for creating excellent Oak products
would need to make intrinsic, composable and teachable.

The corpus is historical research, not a current implementation or runnable
workspace. Its 77 Markdown records preserve observations, inferences, unknowns,
examples, hypotheses and synthesis. The source repositories and revisions named
inside each record remain the evidence boundary for its claims; words such as
“current” and “now” refer to those pinned snapshots, not necessarily to the
repository state at the time of reading.

## Start here

- [Research charter](docs/research-charter.md) — the original mission, quality
  dimensions, scope and evidence discipline.
- [Corpus index](docs/README.md) — the full research map.
- [Meta-analysis](docs/synthesis/meta-analysis.md) — cross-system concepts,
  contracts and falsifiable working model.
- [Ecosystem enablement](docs/synthesis/ecosystem-enablement.md) — implications
  for OCE and a future toolkit.
- [Capability coverage](docs/investigations/capability-coverage.md) — covered,
  partial and unknown areas.
- [Evidence-harness provenance](evidence-harness-provenance.md) — what the
  retired measurement code established and where its immutable source remains.

## Preservation boundary

The relocation preserves the analysis, representative examples and this
corpus-level MIT licence. It intentionally does not preserve the former nested
package workspace, research CLI, fixtures, tests, CI workflow, agent session
state or hand-off files as live repository surfaces. Those mechanisms supported
the original investigation; they are not part of the Innovation Kit and should
not be mistaken for maintained product code.

The exact pre-relocation record remains recoverable at commit
[4915fe1](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/tree/4915fe1826372d9b0b6ee18322500c811128f41c/research/web-app-deconstruction).

## How to read the corpus

- Treat **Observed**, **Inferred**, **Unknown**, **Proposed** and hypothesis
  status labels as materially different.
- Treat H001–H012 as low-confidence questions under test, not accepted
  architecture.
- Keep semantic authority, implementation mechanism and evidence authority
  separate.
- Preserve negative and ambiguous findings.
- Use the material to derive capability and contract obligations; do not turn
  every lens, journey or example into a module.
- Re-verify any claim that will govern present implementation against the live
  owning source.
