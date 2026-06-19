/**
 * Pure helpers for the reference-direction validator (PDR-105).
 *
 * A cross-artefact reference is a dependency; it must point toward a *more
 * fundamental* artefact — more durable in time, or more general across context.
 * A reference pointing the other way (a durable doc depending on an ephemeral
 * surface, or a portable Core doc depending on a repo-specific one) is a latent
 * defect: the target moves, is deleted, or is absent where the referrer is read.
 *
 * These functions are pure: callers supply file paths + contents; no IO happens
 * here. Path resolution uses POSIX semantics so repo-relative classification is
 * deterministic across platforms.
 *
 * @packageDocumentation
 */

import posix from 'node:path/posix';

import {
  isStableAddressedState,
  isStableIndex,
} from './validate-reference-direction-allowlists.js';

// Re-exported so consumers (and tests) resolve the stable-index predicate from the
// validator's public surface; the allowlist data itself lives in the sibling module.
export { isStableIndex } from './validate-reference-direction-allowlists.js';

/** Artefact layers, ordered by fundamentality (most fundamental last). */
export type ArtefactLayer =
  | 'ephemeral' // plans, threads, operational memory/state — most volatile
  | 'repo-doctrine' // ADRs, rules, directives, governance — durable, repo-specific
  | 'portable-core' // practice-core (PDRs, trinity) — durable AND portable
  | 'other'; // code and everything not policed as a reference source

/** A single repo-path reference extracted from a markdown file. */
export interface ExtractedReference {
  /** The raw link target as written (anchor stripped). */
  readonly rawTarget: string;
  /** Repo-relative POSIX path the target resolves to. */
  readonly resolvedRepoPath: string;
  /** 1-based line number of the reference. */
  readonly line: number;
  /** True when the reference line is annotated as a deliberate historical pointer. */
  readonly historicalMarked: boolean;
}

/** A reference-direction violation. */
export interface ReferenceViolation {
  readonly sourcePath: string;
  readonly sourceLayer: ArtefactLayer;
  readonly targetPath: string;
  readonly targetLayer: ArtefactLayer;
  readonly line: number;
  /** Which axis the reference violates. */
  readonly axis: 'portability' | 'durability';
}

/** A markdown file to scan. */
export interface ScanFile {
  /** Repo-relative POSIX path. */
  readonly path: string;
  readonly content: string;
}

const PORTABLE_CORE_PREFIX = '.agent/practice-core/';

const REPO_DOCTRINE_PREFIXES = [
  'docs/architecture/architectural-decisions/',
  'docs/governance/',
  '.agent/rules/',
  '.agent/directives/',
] as const;

const EPHEMERAL_PREFIXES = [
  '.agent/plans/',
  '.agent/memory/operational/threads/',
  '.agent/memory/active/',
  '.agent/state/',
  // Analysis docs are dated, supersedable research outputs — ephemeral, not durable
  // doctrine. Previously fell through to `other` (inert as a target), so a doctrine
  // doc citing one was silently unflagged.
  '.agent/analysis/',
] as const;

/** Matches a line annotated as a deliberate historical reference. */
const HISTORICAL_MARKER = /\(historical references?\)|<!--\s*historical\s*-->/i;

/** Classify a repo-relative path into its artefact layer. */
export function classifyLayer(repoRelPath: string): ArtefactLayer {
  const p = repoRelPath.replace(/^\.\//, '');
  if (p.startsWith(PORTABLE_CORE_PREFIX)) {
    return 'portable-core';
  }
  if (REPO_DOCTRINE_PREFIXES.some((prefix) => p.startsWith(prefix))) {
    return 'repo-doctrine';
  }
  // repo-continuity sits in operational memory but is the stable index, not a
  // doctrine source; classify by prefix below. It is handled as a source via the
  // allowlist, never as a policed doctrine surface.
  if (EPHEMERAL_PREFIXES.some((prefix) => p.startsWith(prefix))) {
    return 'ephemeral';
  }
  return 'other';
}

/**
 * Extract repo-relative references from markdown content. Resolves inline links
 * (`](target)`) and reference definitions (`[label]: target`) relative to the
 * source file's directory. External URLs, mailto, and pure anchors are ignored.
 *
 * Backticked paths — a repo path written inside backticks — are deliberately NOT
 * extracted: a backtick is a concept-NAME, not a resolvable dependency that can rot,
 * and the PDR-105 de-link convention treats backticked/prose names as safe. Detecting
 * them would flag ~1000
 * legitimate concept-names across policed doctrine — a gate-bricking false-positive
 * storm — so the validator polices only resolvable markdown-link references. Do not
 * "widen" extraction to backticks without first revisiting that convention.
 */
export function extractReferences(sourcePath: string, content: string): ExtractedReference[] {
  const sourceDir = posix.dirname(sourcePath.replace(/^\.\//, ''));
  const references: ExtractedReference[] = [];
  const lines = content.split('\n');

  // Source only; re-created per line with the 'g' flag so `^` anchors to the
  // start of each individual line string (no cross-line lastIndex carry-over).
  const linkPatternSource = /\]\(([^)]+)\)|^\s*\[[^\]]+\]:\s*(\S+)/.source;

  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    const historicalMarked = HISTORICAL_MARKER.test(lineText);
    let match: RegExpExecArray | null;
    const pattern = new RegExp(linkPatternSource, 'g');
    while ((match = pattern.exec(lineText)) !== null) {
      // Strip any markdown link title (`path "Title"`) before resolving.
      const rawTarget = (match[1] ?? match[2] ?? '').replace(/\s+"[^"]*"$/, '').trim();
      if (!isRepoPathReference(rawTarget)) {
        continue;
      }
      const withoutAnchor = rawTarget.split('#')[0];
      if (withoutAnchor === '') {
        continue;
      }
      const resolved = posix.normalize(posix.join(sourceDir, withoutAnchor));
      references.push({
        rawTarget: withoutAnchor,
        resolvedRepoPath: resolved,
        line: i + 1,
        historicalMarked,
      });
    }
  }
  return references;
}

/** A target is a repo path reference when it is relative and not a URL/anchor/mailto. */
function isRepoPathReference(target: string): boolean {
  if (target === '') {
    return false;
  }
  if (/^[a-z]+:/i.test(target)) {
    return false; // http:, https:, mailto:, etc.
  }
  if (target.startsWith('#')) {
    return false; // pure anchor
  }
  // Only police references that point at repo files (have a path separator or a
  // markdown/json/ts extension). Bare anchors and labels are skipped above.
  return target.includes('/') || /\.(md|json|ts|tsx|mjs|cjs)$/.test(target.split('#')[0]);
}

/**
 * Classify a single reference from a policed source into a violation, or null.
 *
 * - **Portability:** a `portable-core` source referencing any repo path that is
 *   not itself `portable-core`. A PDR must not cite an ADR (it travels to repos
 *   without that ADR). Reported even when the target is ephemeral (the stronger
 *   axis), so a Core → ephemeral reference is reported once.
 * - **Durability:** any policed source referencing an `ephemeral` target, unless
 *   the line is historical-marked or the target is a stable-addressed operational
 *   surface (a singleton registry/log/schema — see {@link isStableAddressedState}).
 */
function classifyReference(
  file: ScanFile,
  sourceLayer: ArtefactLayer,
  ref: ExtractedReference,
): ReferenceViolation | null {
  // A reference that resolves outside the repo root is not a hierarchy concern.
  if (ref.resolvedRepoPath.startsWith('..')) {
    return null;
  }
  const targetLayer = classifyLayer(ref.resolvedRepoPath);
  const base = {
    sourcePath: file.path,
    sourceLayer,
    targetPath: ref.resolvedRepoPath,
    targetLayer,
    line: ref.line,
  };
  // Portability: a portable-Core file may reference only other portable-Core
  // artefacts — anything else (ADRs, rules, repo code/docs) is repo-specific and
  // absent in other Practice-bearing repos. The historical marker does NOT
  // suppress this: the target is missing on arrival regardless of intent.
  if (sourceLayer === 'portable-core' && targetLayer !== 'portable-core') {
    return { ...base, axis: 'portability' };
  }
  if (
    targetLayer === 'ephemeral' &&
    !ref.historicalMarked &&
    !isStableAddressedState(ref.resolvedRepoPath)
  ) {
    return { ...base, axis: 'durability' };
  }
  return null;
}

/**
 * Find all reference-direction violations across the supplied files. Only
 * `portable-core` and `repo-doctrine` files are policed as sources; the stable
 * index is exempt (resolving thread identity → location is its job).
 */
export function findReferenceDirectionViolations(files: readonly ScanFile[]): ReferenceViolation[] {
  const violations: ReferenceViolation[] = [];
  for (const file of files) {
    const sourceLayer = classifyLayer(file.path);
    const policed = sourceLayer === 'portable-core' || sourceLayer === 'repo-doctrine';
    if (!policed || isStableIndex(file.path)) {
      continue;
    }
    for (const ref of extractReferences(file.path, file.content)) {
      const violation = classifyReference(file, sourceLayer, ref);
      if (violation !== null) {
        violations.push(violation);
      }
    }
  }
  return violations;
}
