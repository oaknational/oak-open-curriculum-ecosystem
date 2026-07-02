# Documentation Hygiene

Operationalises [ADR-127 (Documentation as Foundational Infrastructure)](../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md)
and the **Misleading docs are blocking** principle in
[`.agent/directives/principles.md` § Code Quality](../directives/principles.md).

Three surfaces operationalised by this rule:

## 1. Misleading-doc detection

Per [`.agent/directives/principles.md` § Code Quality "Misleading docs are blocking"](../directives/principles.md):
when a code or doctrine change invalidates surrounding docs (TSDoc,
READMEs, ADRs, PDRs, runbooks), the docs MUST be fixed in the same
landing. Misleading docs cause more harm than missing docs (missing
docs prompt verification; misleading docs are trusted and acted on).
Composes with PDR-026 §Landing target definition (the symmetric
landing-time pair).

Help and usage text is documentation, and it MUST track real behaviour. Never
document an affordance that is a tolerated no-op (a `--flag` the command accepts
but ignores, an option listed in `--help` that does nothing): a documented no-op
reads as a real feature and invites a future reader to depend on — or wire — the
behaviour it lacks. Either make the affordance real or remove it from the help
text; a no-op kept "for completeness" is a misleading doc.

## 2. Attribution on adoption

When external concepts, patterns, vocabulary, or implementation
techniques are **adopted or adapted** from outside the repository
(blog posts, papers, vendor docs, OSS projects, conference talks,
other Practice-bearing repos, etc.), attribution MUST be explicit and
include a direct link to the upstream source. The rule applies
wherever the adoption is recorded — TSDoc, README sections, ADRs,
PDRs, plan bodies, rule files, distilled entries — anywhere the
adopted concept is named or applied.

The minimum form is a single sentence + a working URL. Preferred form
includes the upstream's own framing in a brief quote so future readers
can re-derive whether the adaptation matches or diverges from the
original. Adaptations (rather than direct adoptions) MUST also note
*how* the local form differs from the upstream — silent divergence
turns a citation into a misleading doc.

The motivation is twofold: (a) reproducibility — a future reader
should be able to consult the upstream when a local restatement
becomes ambiguous; (b) intellectual honesty — work that builds on
others' work names that work explicitly. Failing to cite is
treated as a documentation defect of the same class as misleading
docs.

**Contributor and source-author attribution + personal data.** People
(external contributors, source authors, prototype or repository authors)
are credited **by name** wherever their contribution is named, with a link
to the public upstream. Their **personal contact data (email addresses)
belongs in exactly one place — the `contributors` field of the relevant
`package.json`** — and MUST NOT be copied into prose, READMEs, ADRs, PDRs,
plan bodies, rule files, distilled entries, or any other versioned document.
Scattering a personal email across docs is a documentation defect of the
same class as a missing citation. The canonical attribution surface is
[`ATTRIBUTION.md`](../../ATTRIBUTION.md) (names + public references) plus
`package.json` metadata (contact); name + public/org contact + source URL,
never a personal email in the document body.

## 3. TSDoc presence and quality

Per [`.agent/directives/principles.md` § Document Everywhere](../directives/principles.md):
public functions, types, and modules carry TSDoc explaining intent,
contract, and trade-offs. Canonical TSDoc syntax and style rules live
in that section of `principles.md` — this rule does not duplicate the
syntax reference; it operationalises the *presence* expectation as a
gate at edit time.

## 4. Doctrine includes rationale

Rules, PDRs, ADRs, commands, and READMEs must state enough "why" for a
future reader to re-derive the rule under novel conditions. What-only
doctrine decays into ritual: it is followed when convenient and broken
under pressure.
