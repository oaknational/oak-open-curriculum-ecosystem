---
related_pdr: PDR-044
name: "Structural Enforcer Recursive Exclusion"
use_this_when: "Designing a structural enforcer (hook, scanner, lint rule, regex matcher) that scans for a pathogen — vocabulary, file shape, prohibited construct, code smell — across a path scope; the cataloguing documents and tests inside that scope will trip the enforcer on themselves unless explicitly excluded."
category: agent
proven_in: ".agent/hooks/policy.json (preToolUseContent.scoped_blocks)"
proven_date: 2026-05-04
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A new structural enforcer correctly identifies its own pathogen in the documents that catalogue or test the pathogen, blocking writes to those documents and forcing the author to either bypass the enforcer or hedge it"
  stable: true
---

# Structural Enforcer Recursive Exclusion

## Pattern

Any structural enforcer that scans for a pathogen — a hedging-vocabulary
literal, a SHA-shaped token, a banned import, a banned regex shape, an
ESLint anti-pattern — necessarily fires on the documents that **define**
the pathogen by example: the rule that names the banned word, the ADR
that documents the banned shape, the test fixture that proves the
enforcer catches the shape, the PDR that catalogues the trip-list.

When the enforcer is wired into a write-time path (a hook on `Edit` or
`Write`, a pre-commit gate, a CI lint pass), authoring or amending a
cataloguing document trips the enforcer on legitimate cataloguing prose.
The author then faces three shapes: (a) bypass the enforcer (the failure
mode); (b) hedge the enforcer with a "this rule does not apply when
documenting the rule" clause (the failure mode this pattern is named to
prevent — see PDR-047 §Test 3); or (c) declare a recursive exclusion
list naming the cataloguing documents.

The cure is (c): include in the enforcer's configuration an explicit
`exclude_paths` list (or equivalent — file glob, prefix list, ESLint
override) naming every document that catalogues the pathogen by
definition. The exclusion is structural, not a carve-out: the
cataloguing documents are **off-topic** for the enforcer (they are
explaining what is banned, not enacting what is banned), in the same
sense that a Scope subsection on a rule names off-topic shapes that
the rule does not govern.

## Anti-Pattern

A structural enforcer with no exclusion list, deployed into a path
scope that includes the documents defining the enforcer's own
pathogen. The enforcer trips on the cataloguing documents at write
time; the author either bypasses the enforcer (silent erosion) or
adds a conditional clause to the enforcer's specification (PDR-047
violation). Both shapes are wrong. The structural cure is the
recursive-exclusion list.

A second anti-pattern shape: an exclusion list that names *some* but
not *all* cataloguing documents, so the enforcer fires inconsistently
across the cataloguing surface. The list must be exhaustive over the
documents that exist *at the time the enforcer is authored*; new
cataloguing documents added later are amendments to the exclusion
list, landed in the same diff that adds the new cataloguing document.

## Application

The enforcer's configuration shape varies by mechanism, but the
structure is invariant:

1. Enumerate the documents inside the path scope that **catalogue** the
   pathogen by definition. These are documents whose substance requires
   citing or naming the pathogen — rules that name banned words,
   PDRs/ADRs that catalogue trip-lists, test corpora that prove the
   enforcer catches the shape, distilled-memory entries that record the
   ban as doctrine.
2. Express the exclusion in the enforcer's native shape: `exclude_paths`
   list in a JSON hook config; `overrides` block in `eslint.config.ts`;
   `--exclude` glob in a CI scanner; `# noqa` allow-list at the
   regex matcher's per-line check.
3. Cite the exclusion in the enforcer's host documentation (the rule
   file, the ADR, the script's TSDoc) so that future maintainers can
   distinguish exclusion-by-definition from exclusion-by-erosion.
4. When the path scope grows or new cataloguing documents are added,
   update the exclusion list in the same diff. The exclusion list is
   maintained alongside the cataloguing surface, not as separate
   hygiene work.

Worked instances in this repo:

| Enforcer | Path scope | Exclusion mechanism | Cataloguing role |
|---|---|---|---|
| `policy.json` `preToolUseContent.scoped_blocks` (hedging vocabulary literals) | `.agent/practice-core/`, `.agent/plans/`, `docs/architecture/`, `docs/governance/`, `**/*.plan.md` | **Explicit exclude_paths**: `principles.md`, `distilled.md`, PDR-043, PDR-044, PDR-047 | These docs catalogue the trip-list members by definition |
| `policy.json` `preToolUseContent.scoped_blocks` (SHA-fingerprint regex on permanent docs) | ADRs, practice-core, principles.md, testing-strategy.md | **Per-line context exclusion**: fenced code blocks, inline-code spans, `(historical reference)` markers | Code blocks are data context; inline code spans are technical citations; historical-reference markers explicitly opt in to citing legacy SHAs |
| `validate-fitness-vocabulary.mjs` | All live surfaces | **Self-exclusion by placement**: the validator's source lives outside the validated surface, so the cataloguing happens in code (not in any markdown that the validator scans) | The validator is the canonical enumeration of the vocabulary; placing its source where the scanner does not look is a structural alternative to an `exclude_paths` list |

The three mechanisms — **explicit `exclude_paths`** (instance 1),
**per-line context exclusion** (instance 2), and **self-exclusion by
placement** (instance 3) — are distinct concrete shapes the pattern
takes. The choice of mechanism is determined by the enforcer's scan
unit and the cataloguing surface's location: when cataloguing
necessarily lives inside the scanned paths, an `exclude_paths` list
is the cure; when cataloguing lives at line granularity inside
otherwise-scanned files, per-line context exclusion is the cure;
when cataloguing lives in code outside the scanner's universe,
placement is the cure. All three satisfy the same principle: the
cataloguing surface is **off-topic** for the enforcer, not exempt
from it.

## Composition with PDR-047 (Doctrine-Authoring Discipline)

PDR-047 §Test 3 (Re-frame test) names the substance failure that this
pattern's exclusion list is *not*: a clause inside the enforcer
specification that says "the rule does not apply when documenting the
rule" is a hedge. The structural-exclusion list is **not** a hedge.
The distinction is operational:

- A hedge is **inside** the rule specification: *"the trip-list catches
  vocabulary X, **except** when the document is teaching about
  vocabulary X."* The substance test asks whether re-phrasing reads "the
  rule does not apply here"; a hedge passes the substance test (yes, it
  does); the cure is structural re-frame or rule split.
- A recursive-exclusion list is **outside** the rule specification: the
  rule says "vocabulary X is banned on doctrine surfaces". The path
  scope, expressed through `include_paths` and `exclude_paths`,
  declares which surfaces are doctrine surfaces. The excluded
  cataloguing documents are not doctrine surfaces in the rule's sense
  — they are meta-doctrine surfaces *about* doctrine. The substance
  test asks whether the rule itself reads "the rule does not apply
  here"; the exclusion list passes the substance test (no, the rule
  applies to all doctrine surfaces; the cataloguing documents are not
  doctrine surfaces).

The pattern is therefore PDR-047-compliant by construction: the
exclusion lives in the enforcer's path-scope mechanism, not in its
substance. PDR-047's own first-write fire on the host's
hedging-vocabulary hook (PDR-047 §Notes) was cured by extending the
exclusion list, not by hedging the rule.

## Worked Instances in Detail

### Instance 1 — WS3 hedging-vocabulary trip-list (Vining Spreading Seed, 2026-05-04)

The doctrine-enforcement-quick-wins WS3 plan added thirteen
hedging-vocabulary literals to `policy.json`
`preToolUseContent.scoped_blocks`. The first-author edit attempted to
add the literals without an exclusion list. The hook then blocked
edits to `.agent/directives/principles.md`, `.agent/memory/active/distilled.md`,
PDR-043 (rush-impulse three structural cues), and PDR-044 (memetic
immune system) — exactly the documents that **catalogue** the
trip-list members by definition. The cure was a single exclusion list
applied to all thirteen scoped_blocks entries: `principles.md`,
`distilled.md`, `PDR-043`, `PDR-044`, plus subsidiary exclusions for
`archive/`, `fixtures/`, `/tests/`, `.test.ts`. The exclusion list is
visible in `policy.json` lines 53-63 (and identical in every
subsequent scoped_block).

### Instance 2 — PDR-047 first-write fire (Ferny Spreading Petal, 2026-05-04)

PDR-047 (rule applies always — doctrine-authoring discipline) is the
PDR that **defines** the substance test for hedging-vocabulary intent.
Authoring the PDR required citing every hedging-vocabulary item the
trip-list catches: *carve out*, *exception*, *for these arcs*, etc.
The first write attempt to `PDR-047-rule-applies-always-doctrine-authoring.md`
was correctly blocked by the WS3 hook — the file catalogues the
pathogen by definition. The cure was extending the existing
`exclude_paths` list with `PDR-047`, applied identically across all
thirteen scoped_blocks. No hedge was added to PDR-047 itself; the rule
remains absolute. The exclusion list reflects that PDR-047 is a
meta-doctrine surface (it is *about* the trip-list), not a doctrine
surface (it is not enacting the trip-list).

The two instances share one structural property: **the cataloguing
document is not exempt from the principle the enforcer enforces; it
is exempt from the path scope of the enforcer's mechanism**. The
principle (no hedging vocabulary on doctrine surfaces) applies
universally. The mechanism (write-time hook on doctrine-surface
paths) excludes the meta-doctrine paths because those paths are not
doctrine surfaces in the principle's sense.

The two instances are not repetitions of the same firing — they are
**independent confirmations** that the pattern arises whenever an
enforcer's path scope overlaps its cataloguing-document scope. Vining's
case was vocabulary literals against the documents that name the
vocabulary; Ferny's case was vocabulary literals against a *new* PDR
that catalogues the same vocabulary as part of authoring the
substance test. The mechanism is the same; the cataloguing surface
is different (existing-doctrine vs new-doctrine). That structural
distinctness across two firings is what makes ≥2 instances sufficient
to graduate this kind of design observation, where a recurring
debugging mistake might require more.

## Why This Matters

A structural enforcer wired into a write-time path is the most
effective form of doctrine enforcement in the PDR-038 sense — it
catches the failure shape upstream of human review. But the enforcer
is wired against *paths*, and the documents that catalogue the
pathogen sit on those paths by necessity. Without an explicit
exclusion list, every new cataloguing document or amendment to an
existing one trips the enforcer; every trip is a forcing-function for
either silent bypass (the gate-off-fix-gate-on anti-pattern named in
`never-disable-checks.md`) or substance hedging (PDR-047 §Failure
shape 2). Both shapes erode the enforcer's reliability.

The recursive-exclusion list closes the gap between enforcement
universality (the principle applies everywhere it claims to) and
enforcement mechanism scope (the hook fires only on the surfaces the
principle is enforcing on). The exclusion is not a relaxation of the
principle; it is a sharpening of the mechanism.

## Generalisation Beyond Vocabulary Hooks

The pattern applies whenever a structural enforcer's path scope and
cataloguing-document scope overlap:

- **ESLint rules** that ban a syntactic shape (e.g. `no-as-cast`)
  inside repository code, with the rule's own implementation living
  in the same repo: the rule's implementation file is a cataloguing
  surface (it must construct an `as` cast to test that it catches the
  pattern). `eslint.config.ts` `overrides` exempts the rule's own
  source and test files.
- **CI scanners** that grep for a banned pattern across the working
  tree: the scanner's own source and the test corpus that proves the
  scanner works are cataloguing surfaces. The scanner's `--exclude`
  glob names them.
- **Markdown linters** that enforce a heading shape across docs: the
  linter's own configuration documentation, which by necessity shows
  a violating heading as a worked example, is a cataloguing surface.
  The linter's ignore-list excludes its own README.
- **Trip-list documentation surfaces** (like
  `.agent/rules/no-hedging-vocabulary.md`) where the rule body must
  print the literal trip-list to teach what the rule bans: the rule's
  own host file is a cataloguing surface. The host's enforcement
  mechanism either excludes the rule file by path or ships the
  trip-list as code, not as prose, so the matcher does not
  encounter it.

Each of these instances is an application of the same shape:
enforcer combined with cataloguing document combined with path
overlap requires an explicit exclusion list as the structural cure.

## Related

- **Governance Claim Needs a Scanner** (`governance-claim-needs-a-scanner.md`)
  — paired pattern. That pattern names *when* a scanner is required
  (universal claim across live surfaces); this pattern names *how* the
  scanner's path scope must be specified to remain coherent over time.
- **Passive Guidance Loses to Artefact Gravity**
  (`passive-guidance-loses-to-artefact-gravity.md`) — the structural
  cousin: passive guidance loses to the gravity of the surface; an
  active enforcer wins, *but* an active enforcer without recursive
  exclusion creates artefact gravity in a different direction
  (cataloguing documents can no longer be authored against the
  enforcer's path scope).
- PDR-038 §Stated Principles Require Structural Enforcement —
  the upstream rationale: prose alone drifts; structural enforcement
  closes the loop.
- PDR-044 §Memetic Immune System §Innate immunity — the
  enforcer architecture this pattern's exclusion list is most often
  expressed in.
- PDR-047 §Notes — the second worked instance recorded inline.
- `.agent/rules/no-hedging-vocabulary.md` §Excluded Surfaces — the
  host rule that names the exclusion list and cites the structural
  reason.
