---
classification: core
description: Canonical documentation hygiene (misleading-doc detection, attribution on adoption, TSDoc presence).
---

# Documentation Hygiene

Operationalises [PDR-023 (Documentation Structure Discipline)](../practice-core/decision-records/PDR-023-documentation-structure-discipline.md)
and the **Misleading docs are blocking** principle in
[`.agent/directives/principles.md` § Code Quality](../directives/principles.md).

Six surfaces operationalised by this rule:

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

**Private-upstream clause** (added 2026-07-21; the worked instances are
the Resonance/castr imports of 2026-07-20): when the upstream is a
private repository or estate with NO public URL, a working link cannot
exist and is not required. The required citation is then: the upstream's
name, its repo-relative source path, the exchange vehicle (e.g. the
inter-practice protocol / an incoming-capture note), and the adaptation
note — the maximum reproducibility a private upstream permits. Stating
"no public upstream URL exists" explicitly is part of the citation, so a
reader knows the link's absence is a property of the source, not an
omission. Where the private upstream is the owner's own project, the
citation uses the name the owner gives it for the repository: on
2026-09-27 the owner ruled, relayed by the Director on OCE pull request
250, that one such project's own name stays out of the repository for
now and that it is called Student Support Experiments until the owner
says otherwise (one instance).

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
contract, and trade-offs, and non-trivial internal logic is documented
too. Canonical TSDoc syntax and style rules live in that section of
`principles.md` — this rule does not duplicate the syntax reference; it
operationalises the *presence* expectation as a gate at edit time. When
tooling, rules or behaviour change, the contract docs that describe them
(READMEs, the tooling reference, the rule and skill indexes) are updated
in the same landing.

## 4. Doctrine includes rationale

Rules, PDRs, ADRs, commands, and READMEs must state enough "why" for a
future reader to re-derive the rule under novel conditions. What-only
doctrine decays into ritual: it is followed when convenient and broken
under pressure.

## 5. Runnable examples are run

Any example command, code snippet, or diagnostic check added to a doc is
RUN (or compile-probed) against the real surface before the edit lands —
a cure written from recall is not a cure. Twice in one session
(2026-07-04) a documented check failed exactly where it claimed to help:
a lockfile "parse check" that false-passes with exit 0 AND destroys the
evidence by rewriting the file, and a type-level fix snippet that
silently reproduces the trap it warns about (an inline conditional type
does not distribute). Both were caught only because a reviewer executed
them. The check for a diagnostic example is that it FAILS on the failure
it diagnoses, not merely that it runs; verify-on-real-content applies to
the documented cure itself, not just the claim it supports.

## 6. Current-state truth lives in permanent docs; a boundary change sweeps the old names

A stable fact about how the system is built now (which surface owns which
data, where a boundary sits, what derives from what) lives in the permanent
architecture docs (`docs/architecture/`, the relevant ADR), never only in a
plan, an audit or a report: on 2026-03-09 the site's split-ownership truth
lived in an audit until it was moved. Permanent documentation uses canonical
names and never depends on an ephemeral plan file. When the architecture moves on, the
historical ADR stays accepted and gains a short clarification note pointing
at the record that supersedes the detail; the ADR is never rewritten to the
new truth. And when a source-of-truth boundary lands (a field renamed, a
route retired, a derivation moved), the same landing greps accepted ADRs and
live plans for the superseded names and re-trues each hit, because those
surfaces keep speaking the old names long after the code has stopped
(2026-08-12: older accepted ADRs and a current plan still named a retired
field and retired routes after the boundary landed). The pull request names
the grep it ran.
