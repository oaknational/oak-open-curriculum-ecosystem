# W0.1 census — the hand-authored types scaffold (preserved)

Preserved from the W0.1 design-census sitting alongside
[the cycle plan v2](./w01-census-cycle-plan-v2.md). The scaffold was
authored for `packages/design/oak-design-tokens/src/design-census/` but
its generator and validator were never built, so as source it is an
orphan by construction — the knowledge lives here until a census cycle
is re-sanctioned (the governing completion-plan sketch was archived
unratified at the 2026-08-19 records pass). The design substance: closed
disposition vocabularies, fingerprinted exclusion grants, and the
generator/validator deep-equal contract.

```ts
/**
 * Hand-authored types for the W0.1 design census artefacts.
 *
 * @remarks
 * Three artefacts compose the census (design-system-completion plan, story
 * W0.1): the GENERATED page census and feature census (pure derivations of
 * the kit's corpus — never hand-edited), and the HAND-AUTHORED dispositions
 * ledger that annotates their rows. The generator emits the two artefacts;
 * the validator deep-equals them against a fresh derivation and asserts a
 * bijection between ledger rows and census rows, so "zero undispositioned
 * rows" is checked structurally rather than remembered.
 *
 * Disposition vocabularies are CLOSED (closed-shape rule): page rows carry
 * `express-composed` or `owner-accepted-exclusion` at census time — a page
 * folding or demoting is the owner's call at W1.4, and no seat vocabulary
 * may pre-empt it. Class and gap-leaf rows carry their own closed sets.
 * Exclusion grants record the content fingerprint they were granted
 * against, so a grant over changed content fails the validator instead of
 * silently hiding the change; affirmative rows need no fingerprint — their
 * drift is visible through the whole-artefact recompute.
 *
 * @packageDocumentation
 */

/** Closed page-row disposition vocabulary (owner-reserved words excluded). */
export const PAGE_DISPOSITIONS = ['express-composed', 'owner-accepted-exclusion'] as const;

/** One page-row disposition. */
export type PageDisposition = (typeof PAGE_DISPOSITIONS)[number];

/** Closed class-row disposition vocabulary. */
export const CLASS_DISPOSITIONS = ['published', 'owner-accepted-exclusion'] as const;

/** One class-row disposition. */
export type ClassDisposition = (typeof CLASS_DISPOSITIONS)[number];

/** Closed gap-leaf disposition vocabulary (the split $type rule's second arm). */
export const GAP_LEAF_DISPOSITIONS = ['vendor-extension', 'named-exclusion'] as const;

/** One gap-leaf disposition. */
export type GapLeafDisposition = (typeof GAP_LEAF_DISPOSITIONS)[number];

/** Closed framing-prose states the page walk records. */
export const FRAMING_PROSE_STATES = ['present', 'absent'] as const;

/** One framing-prose state. */
export type FramingProseState = (typeof FRAMING_PROSE_STATES)[number];

/** Mechanical evidence columns for one page (never a disposition). */
export interface PageEvidence {
  /** True when the page links any kit-published stylesheet. */
  readonly linksKitStylesheet: boolean;
  /** True when the page declares a local style element. */
  readonly hasLocalStyle: boolean;
  /** Framing-prose state (read by the W0.5 owner-voice pass at rebuild). */
  readonly framingProse: FramingProseState;
}

/** One generated page-census row. */
export interface PageCensusRow {
  /** Repo-relative POSIX path, byte-exact case. */
  readonly path: string;
  /** SHA-256 hex fingerprint of the page's bytes at generation. */
  readonly contentHash: string;
  /** Mechanical evidence columns. */
  readonly evidence: PageEvidence;
}

/** The generated page census artefact. */
export interface PageCensus {
  /** Artefact schema version. */
  readonly version: 1;
  /** ISO-8601 UTC generation timestamp. */
  readonly generatedAt: string;
  /** Commit the walk ran at. */
  readonly sourceCommit: string;
  /** Every page in the census domain, path-sorted by code unit. */
  readonly pages: readonly PageCensusRow[];
}

/** One published class as the selector parse sees it. */
export interface ClassCensusRow {
  /** Class name without the leading dot. */
  readonly name: string;
  /** Kit stylesheets (basenames) whose selectors carry the class. */
  readonly files: readonly string[];
}

/** One DTCG token root as the token walk sees it. */
export interface TokenRootRow {
  /** Top-level root name (distinct across files). */
  readonly root: string;
  /** dtcg files (basenames) declaring the root. */
  readonly files: readonly string[];
  /** Leaf count under the root across all declaring files. */
  readonly leafCount: number;
}

/** One hardcoded rotation instance (dispositioned against the W2.7 boundary). */
export interface RotationInstanceRow {
  /** Kit stylesheet basename. */
  readonly file: string;
  /** The literal rotate() value as authored. */
  readonly value: string;
  /** Occurrences of the value in the file's declarations. */
  readonly count: number;
}

/** One untyped DTCG leaf recorded by the gap census. */
export interface UntypedLeafRow {
  /** File-qualified JSON pointer to the leaf. */
  readonly pointer: string;
  /** The leaf's raw $value rendered as a string. */
  readonly value: string;
}

/** The split $type gap-census block. */
export interface GapCensus {
  /** Leaves carrying their own $type. */
  readonly typedLeafCount: number;
  /** Leaves whose full value is a single alias reference (type inferable). */
  readonly aliasInferableCount: number;
  /** Leaves typed by group inheritance (zero in the current corpus). */
  readonly groupInheritedCount: number;
  /** Leaves with no derivable DTCG type — each needs a ledger disposition. */
  readonly untypedLeaves: readonly UntypedLeafRow[];
}

/** The derived stylesheet domain (from the aggregator's import closure). */
export interface StylesheetDomain {
  /** The aggregator stylesheet (the kit's own publication statement). */
  readonly aggregator: string;
  /** Basenames in the aggregator's import closure, walk order. */
  readonly imports: readonly string[];
  /** Kit-root stylesheets OUTSIDE the closure — each needs a disposition. */
  readonly outsideClosure: readonly string[];
}

/** The generated feature census artefact. */
export interface FeatureCensus {
  /** Artefact schema version. */
  readonly version: 1;
  /** ISO-8601 UTC generation timestamp. */
  readonly generatedAt: string;
  /** Commit the walk ran at. */
  readonly sourceCommit: string;
  /** The derived stylesheet domain. */
  readonly stylesheetDomain: StylesheetDomain;
  /** Every published class, name-sorted by code unit. */
  readonly classes: readonly ClassCensusRow[];
  /** Every token root, root-sorted by code unit. */
  readonly tokenRoots: readonly TokenRootRow[];
  /** Theme presets as the theme runtime declares them. */
  readonly themes: readonly string[];
  /** Motion-axis values as the theme runtime declares them. */
  readonly motionAxis: readonly string[];
  /** The kit's hardcoded rotation instances. */
  readonly rotationInstances: readonly RotationInstanceRow[];
  /** The split $type gap census. */
  readonly gapCensus: GapCensus;
}

/** One hand-authored page disposition. */
export interface PageDispositionRow {
  /** Repo-relative POSIX path matching exactly one page-census row. */
  readonly path: string;
  /** The census-time disposition. */
  readonly disposition: PageDisposition;
  /**
   * Content fingerprint the grant was made against — REQUIRED on
   * `owner-accepted-exclusion`, absent otherwise.
   */
  readonly grantedAgainst?: string;
  /** Optional short rationale. */
  readonly note?: string;
}

/** One hand-authored class disposition. */
export interface ClassDispositionRow {
  /** Class name matching exactly one class-census row. */
  readonly name: string;
  /** The disposition. */
  readonly disposition: ClassDisposition;
  /** Fingerprint of the class's declaring files — REQUIRED on exclusion. */
  readonly grantedAgainst?: string;
  /** Optional short rationale. */
  readonly note?: string;
}

/** One hand-authored gap-leaf disposition. */
export interface GapLeafDispositionRow {
  /** File-qualified JSON pointer matching exactly one untyped leaf. */
  readonly pointer: string;
  /** The disposition. */
  readonly disposition: GapLeafDisposition;
  /** Fingerprint of the leaf's raw value — REQUIRED, both dispositions are grants. */
  readonly grantedAgainst: string;
  /** Optional short rationale. */
  readonly note?: string;
}

/** One stylesheet outside the derived domain, explicitly dispositioned. */
export interface StylesheetDispositionRow {
  /** Kit-root stylesheet basename. */
  readonly file: string;
  /** The only legitimate disposition for an outside-closure stylesheet. */
  readonly disposition: 'owner-accepted-exclusion';
  /** Fingerprint of the stylesheet — REQUIRED (the row is a grant). */
  readonly grantedAgainst: string;
  /** Optional short rationale. */
  readonly note?: string;
}

/** The hand-authored dispositions ledger. */
export interface DispositionsLedger {
  /** Ledger schema version. */
  readonly version: 1;
  /** Page dispositions — bijective with page-census rows. */
  readonly pages: readonly PageDispositionRow[];
  /** Class dispositions — bijective with class-census rows. */
  readonly classes: readonly ClassDispositionRow[];
  /** Gap-leaf dispositions — bijective with untyped-leaf rows. */
  readonly gapLeaves: readonly GapLeafDispositionRow[];
  /** Outside-closure stylesheet dispositions — bijective with that list. */
  readonly stylesheets: readonly StylesheetDispositionRow[];
}
```
