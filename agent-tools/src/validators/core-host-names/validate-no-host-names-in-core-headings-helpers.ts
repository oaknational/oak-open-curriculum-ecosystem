/**
 * Pure helpers for the Core host-name heading validator: the portability
 * constraint of the decision-records README ("no host-repo names as the carrier
 * of meaning") in the one form a scanner can hold without reading prose, the
 * heading.
 *
 * @remarks
 * A dated amendment entry headed `2026-09-14 — <host>: ...` records a host's
 * adoption of a Practice decision inside the decision itself. The Core travels
 * to every Practice-bearing repository, so on arrival the heading names a
 * repository the reader may never have seen, and the two estates' copies of one
 * record diverge by the host each was written in. The host-side adoption
 * belongs in the host's own decision record and the bridge index (PDR-079);
 * the Core's heading names the decision, never the host.
 *
 * The needle set is DERIVED from the Core's own records, never declared in this
 * module: a host is a repository the Core has lived in, and the Core says which
 * twice over. The `repo:` field of every provenance entry
 * (`.agent/practice-core/provenance.yml`, the field specification in
 * `practice-lineage.md` §Provenance) names the repositories that evolved the
 * trinity; the changelog's entry tags (`## [<repository>] <date> — ...`) name
 * every repository that changed the Core, the writing seat's repository in both
 * estates by the changelog's own convention. A tag written as `owner/name`
 * yields the owner, the name and the slug. The repository the scan runs in
 * joins by its origin remote's owner and name, so a host no record yet names
 * is still a needle in its own tree. Matching is case-insensitive, literal and
 * token-bounded: a name is a name, not a pattern, and `castr` inside a longer
 * word is not the host.
 *
 * Only ATX headings outside fenced code blocks are inspected (the reading is
 * `markdown-headings.ts`), and the changelog itself is exempt: its headings
 * carry the tag by convention, a record of who changed the Core, not a decision.
 *
 * @packageDocumentation
 */

import { type ScanFile } from '../../core/tracked-file-scan.js';

import { atxHeadings } from './markdown-headings.js';

export type { ScanFile };

/** The Core's directory, with its trailing separator. */
const CORE_PREFIX = '.agent/practice-core/';

/** The changelog: its entry tags name the Core's hosts, and its headings are not scanned. */
export const CHANGELOG_PATH = `${CORE_PREFIX}CHANGELOG.md`;

/** The provenance file whose `repo:` fields name every repository in the chain. */
export const PROVENANCE_PATH = `${CORE_PREFIX}provenance.yml`;

/** A `repo:` line of the provenance file: the field, then the name, optionally quoted. */
const PROVENANCE_REPO_LINE = /^\s*-?\s*repo:\s*(?:'([^']*)'|"([^"]*)"|(\S+))\s*$/u;

/** A changelog entry heading: the level-two hashes, then the bracketed repository tag. */
const CHANGELOG_TAG_LINE = /^## \[([^\]]+)\]/u;

/** A character that would make a host name part of a longer token. */
const TOKEN_CHARACTER = /[\p{L}\p{N}]/u;

/** One host name in one Core heading. */
export interface HostNameHeadingHit {
  /** The carrying file's repo-relative path. */
  readonly file: string;
  /** 1-based line number of the heading. */
  readonly line: number;
  /** 1-based column of the name's first character. */
  readonly column: number;
  /** The name as written in the heading. */
  readonly text: string;
}

/** True when a repo-relative path is a Core markdown document the gate reads. */
export function isScannedCorePath(relativePath: string): boolean {
  return (
    relativePath.startsWith(CORE_PREFIX) &&
    relativePath.endsWith('.md') &&
    relativePath !== CHANGELOG_PATH
  );
}

/** The names once each, compared case-insensitively, the first spelling kept; blanks dropped. */
function uniqueNames(names: readonly string[]): string[] {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const key = name.trim().toLowerCase();
    if (key !== '' && !seen.has(key)) {
      seen.add(key);
      unique.push(name.trim());
    }
  }
  return unique;
}

/** The repository a provenance line's `repo:` field names, or undefined for any other line. */
function provenanceRepoOf(line: string): string | undefined {
  const match = PROVENANCE_REPO_LINE.exec(line);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

/**
 * The repository names the provenance file declares, once each, in order of
 * first appearance.
 *
 * @remarks
 * The file is read line by line for its `repo:` field rather than parsed as a
 * document: the field is the whole of what the gate needs, its shape is fixed
 * by the lineage's specification, and a parser would make the gate's reading
 * depend on a library the Core does not.
 */
export function provenanceRepositories(provenance: string): string[] {
  const names: string[] = [];
  for (const line of provenance.split('\n')) {
    const name = provenanceRepoOf(line);
    if (name !== undefined) {
      names.push(name);
    }
  }
  return uniqueNames(names);
}

/**
 * The repository names the changelog's entry tags declare, once each, in
 * order of first appearance; a tag written as `owner/name` yields the owner,
 * the name and the slug.
 */
export function changelogRepositories(changelog: string): string[] {
  const names: string[] = [];
  for (const line of changelog.split('\n')) {
    const tag = CHANGELOG_TAG_LINE.exec(line)?.[1];
    if (tag !== undefined) {
      names.push(...tag.split('/'), tag);
    }
  }
  return uniqueNames(names);
}

/**
 * The needle set: the names the Core's records declare and the scanned
 * repository's own origin owner and name, once each.
 *
 * @param declared - the names {@link provenanceRepositories} and
 * {@link changelogRepositories} read
 * @param origin - the owner and repository name of the scanned tree's origin
 */
export function hostNeedles(
  declared: readonly string[],
  origin: { readonly owner: string; readonly repoName: string },
): string[] {
  return uniqueNames([...declared, origin.owner, origin.repoName]);
}

/** True when the match at `at` is a whole token: no letter or digit on either side. */
function isTokenBounded(line: string, at: number, length: number): boolean {
  const before = line.charAt(at - 1);
  const after = line.charAt(at + length);
  return !TOKEN_CHARACTER.test(before) && !TOKEN_CHARACTER.test(after);
}

/** The first token-bounded, case-insensitive occurrence of `needle` in `line`, or -1. */
function indexOfToken(line: string, needle: string): number {
  const lowered = line.toLowerCase();
  const target = needle.toLowerCase();
  let from = 0;
  for (;;) {
    const at = lowered.indexOf(target, from);
    if (at === -1) {
      return -1;
    }
    if (isTokenBounded(lowered, at, target.length)) {
      return at;
    }
    from = at + 1;
  }
}

/**
 * Scan one Core document's headings for host names.
 *
 * @remarks
 * At most one hit is recorded per heading, enough to name it; the text
 * recorded is the name as written. Needles are tried in the order given.
 */
export function findHostNameHeadingHits(
  file: string,
  content: string,
  needles: readonly string[],
): HostNameHeadingHit[] {
  const hits: HostNameHeadingHit[] = [];
  for (const heading of atxHeadings(content)) {
    for (const needle of needles) {
      const at = indexOfToken(heading.text, needle);
      if (at !== -1) {
        hits.push({
          file,
          line: heading.line,
          column: at + 1,
          text: heading.text.slice(at, at + needle.length),
        });
        break;
      }
    }
  }
  return hits;
}

/** Every host-name heading hit across the Core documents, by file in the order given. */
export function scanCoreHeadings(
  files: readonly ScanFile[],
  needles: readonly string[],
): HostNameHeadingHit[] {
  return files.flatMap((file) => findHostNameHeadingHits(file.path, file.content, needles));
}
