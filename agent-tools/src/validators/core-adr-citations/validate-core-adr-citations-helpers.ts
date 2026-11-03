/**
 * Pure helpers for the Core ADR-citation validator: PDR-105's portability axis,
 * in the strict form the `practice-core-portability` rule gives it.
 *
 * @remarks
 * The Practice Core travels to every Practice-bearing repository; an ADR is
 * one repository's decision. A Core file that names an ADR by its number points
 * at a record that is absent wherever the Core arrives, and the reader is left
 * holding a number with nothing behind it. The rule states it: no file under
 * `.agent/practice-core/` carries an ADR identifier. The reference-direction
 * validator enforces the axis for resolvable markdown links; this validator
 * enforces it for the written identifier, which no link check sees. The cure is
 * the concept named in place of the number, never a deleted sentence.
 *
 * The gate is strict: every citation fails, and nothing exempts one.
 *
 * A citation is `ADR`, one separator (an ASCII hyphen, a Unicode hyphen or
 * dash from U+2010 to U+2015, a space or a no-break space) and a number, in any
 * letter case, with no letter or digit on either side. So `_ADR-150_` in
 * underscore emphasis and `adr-7` are citations, while `PDR-105`, `MADR-2`,
 * `ADR-12a` and the bare word `ADRs` are not. Matching runs line by line, so a
 * citation never spans a line break.
 *
 * @packageDocumentation
 */

import { type ScanFile } from '../../core/tracked-file-scan.js';

export type { ScanFile };

/** The Core's directory, with its trailing separator. */
const CORE_PREFIX = '.agent/practice-core/';

/** The citation pattern the module TSDoc describes, compiled per line with the `giu` flags. */
const ADR_CITATION_SOURCE = String.raw`(?<![\p{L}\p{N}])ADR[-\u2010-\u2015\u00A0 ]\d+(?![\p{L}\p{N}])`;

/** One ADR citation inside a Core file. */
export interface AdrCitation {
  /** 1-based line number. */
  readonly line: number;
  /** 1-based column of the citation's first character. */
  readonly column: number;
  /** The citation as written. */
  readonly text: string;
}

/** True when a repo-relative path is inside the Core. */
export function isCorePath(relativePath: string): boolean {
  return relativePath.startsWith(CORE_PREFIX);
}

/** Every ADR citation in a document, in reading order. */
export function findAdrCitations(content: string): AdrCitation[] {
  const citations: AdrCitation[] = [];
  for (const [index, lineText] of content.split('\n').entries()) {
    for (const match of lineText.matchAll(new RegExp(ADR_CITATION_SOURCE, 'giu'))) {
      citations.push({
        line: index + 1,
        column: match.index + 1,
        text: match[0],
      });
    }
  }
  return citations;
}

/** A citation and the Core file that carries it. */
export interface CoreCitation extends AdrCitation {
  /** The carrying file's repo-relative path. */
  readonly file: string;
}

/** Every ADR citation across the Core files: by file in the order given, then in reading order. */
export function findCoreCitations(files: readonly ScanFile[]): CoreCitation[] {
  return files.flatMap((file) =>
    findAdrCitations(file.content).map((citation) => ({ file: file.path, ...citation })),
  );
}
