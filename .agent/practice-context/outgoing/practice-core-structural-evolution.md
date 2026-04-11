# Practice Core Structural Evolution and Adoption Guide

This note describes how the Practice Core has grown from 5 to 8 files,
why each file was added, and how to bring an older installation up to
date.

## The Eight Files (current)

| # | File | Added | Purpose |
|---|------|-------|---------|
| 1 | `practice.md` | Origin (2026-02-26) | The blueprint: philosophy, principles, architecture, artefact model |
| 2 | `practice-lineage.md` | Origin (2026-02-26) | How the Practice propagates: integration flow, learned principles, provenance |
| 3 | `practice-bootstrap.md` | Origin (2026-02-26) | How to install the Practice: artefact templates, commands, ecosystem survey |
| 4 | `README.md` | Origin (2026-02-26) | Human entry point: what this is, how to bring it to a new repo |
| 5 | `index.md` | Origin (2026-02-26) | Agent entry point: routing for cold-start, daily work, and incoming plasmids |
| 6 | `CHANGELOG.md` | 2026-03-06 (new-cv) | Exchange provenance: what each repo changed in the Core, newest first |
| 7 | `provenance.yml` | 2026-03-23 (algo-experiments) | Per-file provenance chains, UUID-keyed, extracted from trinity frontmatter |
| 8 | `practice-verification.md` | 2026-04-03 (oak) | Verification: health checks, operational estate audit, fresh-checkout criteria |

Files 1-3 are the "plasmid trinity" — the intellectual core. Files 4-5
are entry points. Files 6-8 are operational infrastructure.

## Evolution History

### 5 files (origin, 2026-02-26)

The initial Practice Core: three blueprints (practice.md,
practice-lineage.md, practice-bootstrap.md) plus two entry points
(README.md, index.md). Created in `cloudinary-icon-ingest-poc` and
`oak-open-curriculum-ecosystem` simultaneously.

### 5 to 6 files (2026-03-06, new-cv)

**Added: `CHANGELOG.md`**

When the Practice began travelling between repos, there was no
record of what each repo changed. The provenance arrays in trinity
frontmatter tracked which repos had touched each file, but not what
they changed. The CHANGELOG provides a human-readable record of what
changed and why, newest first.

**If your Core has 5 files**: create `CHANGELOG.md` at the top of
`practice-core/`. Add an entry for your repo describing the current
state of your Practice. See the CHANGELOG in any 6+ file Core for
the format.

### 6 to 7 files (2026-03-23, algo-experiments)

**Added: `provenance.yml`**

The per-file provenance chains were originally embedded as YAML arrays
in the frontmatter of each trinity file. This caused three problems:
(1) merge conflicts during plasmid exchange, (2) frontmatter bloat as
chains grew, (3) implied hierarchy from sequential integer IDs. The
fix was to extract all chains into a single `provenance.yml` file
with UUID v4 IDs.

**If your Core has 6 files**: create `provenance.yml` by extracting
the `provenance:` array from each trinity file's frontmatter.
Replace frontmatter arrays with `provenance: provenance.yml`. Convert
sequential integer IDs to UUID v4. See the provenance.yml in any
7+ file Core for the field specification.

### 7 to 8 files (2026-04-03, oak-open-curriculum-ecosystem)

**Added: `practice-verification.md`**

`practice-bootstrap.md` had grown to carry both "how to install"
(the template) and "how to verify it works" (health checks,
operational estate audit, claimed/installed/activated model,
fresh-checkout acceptance criteria). The verification concern deserved
its own weight as a distinct lifecycle phase. The split separates
installation from verification.

**If your Core has 7 files**: the verification material was extracted
from `practice-bootstrap.md`. If your bootstrap has a "Health Check"
or "Post-Installation Verification" section, move it to a new
`practice-verification.md`. If it doesn't, create
`practice-verification.md` with:
- Minimum operational estate (6 mandatory surface categories)
- Claimed/installed/activated audit (three-state verification model)
- Fresh-checkout acceptance criteria (6 things a new agent must do)
- Post-installation health check (presence, parity, runtime probes)

Update all "seven files" references to "eight files" across the Core.

## General Adoption Notes

- The CHANGELOG is the most detailed record of what changed and why.
  When integrating an incoming Core, read the CHANGELOG first.
- The `provenance.yml` field specification is documented in
  `practice-lineage.md` under the Provenance section.
- File count references appear in README.md, practice.md, and
  practice-lineage.md. Search for the word "files" and update.
- The Core package is the 8 files. The optional
  `.agent/practice-context/` directory travels alongside but is not
  part of the Core.
