# Attribution

This repository integrates content from multiple open education sources.
This file documents attribution requirements and credits for all
external content used in the Oak Open Curriculum Ecosystem.

For code licensing, see [LICENCE](LICENCE) (MIT).
For data licensing terms, see [LICENCE-DATA.md](LICENCE-DATA.md).

## Oak Open Curriculum API

Curriculum content accessed via the
[Oak Open Curriculum API](https://open-api.thenational.academy/) is
provided under the
[Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

> Contains public sector information licensed under the Open Government
> Licence v3.0.

## EEF Teaching and Learning Toolkit

This repository contains a structured dataset derived from the
[EEF Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit),
published by the Education Endowment Foundation.

All impact estimates (months of additional progress), cost ratings, and
evidence strength ratings are sourced from EEF publications. Users
should consult the original EEF strand pages for full detail, technical
appendices, and the most current figures.

**Citation**:

> Higgins, S., Katsipataki, M., Kokotsaki, D., Coleman, R., Major,
> L.E., & Coe, R. _Teaching and Learning Toolkit_. Education Endowment
> Foundation.
> <https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit>

**EEF MCP server prototype**: John Roberts (Oak National Academy). The
design patterns for evidence-grounded recommendation, transparent composite
scoring, and caveats-first output in this repository are informed by JR's
prototype. (Personal contact is recorded only in `package.json` `contributors`
— see the attribution policy below.)

## Oak Curriculum Ontology

The [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)
is Oak's formal semantic representation of curriculum structure, aligned
to the National Curriculum for England (2014), using W3C standards (RDF,
OWL, SKOS, SHACL). This is an Oak-developed representation and does not
constitute an official DfE National Curriculum publication.

**Primary author**: Mark Hodierne (see the
[Oak Curriculum Ontology repository](https://github.com/oaknational/oak-curriculum-ontology)).

Ontology data (`.ttl` files) is licensed under the
[Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
Code is licensed under the [MIT Licence](https://opensource.org/licenses/MIT).

> Contains curriculum structure data derived from the Oak Curriculum
> Ontology, licensed under the Open Government Licence v3.0.

## Contributor attribution and personal data

External contributors and source authors are credited **by name** in this file
and wherever else their contribution is named (READMEs, ADRs, plan bodies),
alongside a link to the public upstream source.

**Personal contact data (e.g. email addresses) lives in exactly one place: the
`contributors` field of the relevant `package.json`** — the npm metadata
convention and the single sanctioned home. It MUST NOT be copied into prose,
READMEs, ADRs, PDRs, plan bodies, rule files, or any other versioned document;
those credit by name + public/org contact + the upstream URL. This keeps
personal data in one minimised, conventional home rather than scattered across
the documentation surface. The policy is enforced as a clause of the
[`documentation-hygiene`](.agent/rules/documentation-hygiene.md) rule
(§2 Attribution).
