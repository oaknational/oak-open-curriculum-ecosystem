/**
 * Operator profile — one document's validation. Pure: the caller supplies
 * the file's layout position and its contents; the CLI owns the IO.
 */

import { err, ok, type Result } from '@oaknational/result';
import { parse as parseYaml } from 'yaml';
import type { ZodError } from 'zod';

import { isJsonObject } from '../../core/json.js';
import { findCredentialLikeLines } from './operator-profile-keys.js';
import {
  type OperatorProfileFrontmatter,
  type OperatorProfileKind,
  operatorProfileFrontmatterSchema,
} from './operator-profile-schema.js';

/** What the caller knows about a document from its position in the layout. */
export interface ProfileDocumentExpectation {
  /** Path relative to the profile root, for messages. */
  readonly relPath: string;
  readonly expectedKind: OperatorProfileKind;
  /** For a scope or machine document: the file stem the frontmatter's key must equal. */
  readonly expectedKey?: string;
}

export interface ParsedProfileDocument {
  readonly relPath: string;
  readonly frontmatter: OperatorProfileFrontmatter;
}

/** A document split at its frontmatter block. */
export interface FrontmatterSplit {
  /** The text between the delimiters. */
  readonly frontmatter: string;
  /** Everything after the closing delimiter's line. */
  readonly body: string;
}

/**
 * The frontmatter block: `---` alone on the first line, the block, then
 * `---` alone on its own line (a trailing `\r` allowed). A closing line such
 * as `---junk` closes nothing.
 */
const FRONTMATTER_BLOCK = /^---\r?\n([\s\S]*?)\r?\n---\r?(?:\n|$)/;

const NO_FRONTMATTER = 'no YAML frontmatter block (every operator-profile document opens with one)';

/**
 * Split a document at its frontmatter block with one strict whole-line
 * delimiter match, which serves the parse and the body alike.
 *
 * @param content - the whole document text
 * @returns the block's text and the body after it, or null when there is no block
 */
export function splitProfileFrontmatter(content: string): FrontmatterSplit | null {
  const match = FRONTMATTER_BLOCK.exec(content);
  const frontmatter = match?.[1];
  if (match === null || frontmatter === undefined) {
    return null;
  }
  return { frontmatter, body: content.slice(match[0].length) };
}

function parseFrontmatterMapping(frontmatter: string): Result<unknown, string> {
  let parsed: unknown;
  try {
    parsed = parseYaml(frontmatter);
  } catch (cause) {
    // Content-free on purpose: a YAML parser's message can quote the
    // offending source, and the source may be the credential this
    // validator exists to keep out of every output.
    const name = cause instanceof Error ? cause.name : 'error';
    return err(`frontmatter is not parseable YAML (${name}); the block's text is not echoed`);
  }
  return isJsonObject(parsed) ? ok(parsed) : err('frontmatter is not a YAML mapping');
}

/**
 * One schema issue as a message. An unrecognised key's name is withheld: the
 * key can be the credential-shaped token this validator exists to keep out of
 * every output, so the message carries the count and the path only.
 */
function issueMessage(issue: ZodError['issues'][number]): string {
  const at = issue.path.map(String).join('.') || '(root)';
  if (issue.code === 'unrecognized_keys') {
    const count = issue.keys.length;
    return `frontmatter ${at}: ${count} unrecognized key${count === 1 ? '' : 's'} (the key names are not echoed; the contract lists the family's keys)`;
  }
  return `frontmatter ${at}: ${issue.message}`;
}

function parseFrontmatter(
  frontmatter: string,
): Result<OperatorProfileFrontmatter, readonly string[]> {
  const mapping = parseFrontmatterMapping(frontmatter);
  if (!mapping.ok) {
    return err([mapping.error]);
  }
  const parsed = operatorProfileFrontmatterSchema.safeParse(mapping.value);
  return parsed.success ? ok(parsed.data) : err(parsed.error.issues.map(issueMessage));
}

/** The key a scope or machine document carries; undefined for the index. */
function documentKey(frontmatter: OperatorProfileFrontmatter): string | undefined {
  if (frontmatter.kind === 'scope') {
    return frontmatter.scope_key;
  }
  if (frontmatter.kind === 'machine') {
    return frontmatter.machine_key;
  }
  return undefined;
}

function positionMessages(
  expectation: ProfileDocumentExpectation,
  frontmatter: OperatorProfileFrontmatter,
): readonly string[] {
  if (frontmatter.kind !== expectation.expectedKind) {
    return [
      `frontmatter kind is "${frontmatter.kind}" but the layout position requires "${expectation.expectedKind}"`,
    ];
  }
  const key = documentKey(frontmatter);
  if (key === undefined || expectation.expectedKey === undefined) {
    return [];
  }
  if (key === expectation.expectedKey) {
    return [];
  }
  const field = frontmatter.kind === 'scope' ? 'scope_key' : 'machine_key';
  return [
    `frontmatter ${field} "${key}" does not match the file name "${expectation.expectedKey}"`,
  ];
}

function bodyMessages(body: string): readonly string[] {
  return body.trim() === '' ? ['the body below the frontmatter is empty'] : [];
}

function credentialMessages(content: string): readonly string[] {
  const lines = findCredentialLikeLines(content);
  if (lines.length === 0) {
    return [];
  }
  return [
    `credential-shaped content on line${lines.length === 1 ? '' : 's'} ${lines.join(', ')} — the profile names identities, never credentials`,
  ];
}

/**
 * Validate one profile document: frontmatter against the family schema, the
 * kind against its position in the layout, the scope or machine key against
 * the file name, a non-empty body, and no credential-shaped lines. The
 * credential scan runs on every document, frontmatter parse or no parse.
 *
 * @param expectation - what the layout says this document must be
 * @param content - the whole document text
 * @returns the parsed frontmatter, or every failure message at once
 */
export function parseOperatorProfileDocument(
  expectation: ProfileDocumentExpectation,
  content: string,
): Result<ParsedProfileDocument, readonly string[]> {
  const credentials = credentialMessages(content);
  const split = splitProfileFrontmatter(content);
  if (split === null) {
    return err([NO_FRONTMATTER, ...credentials]);
  }
  const frontmatter = parseFrontmatter(split.frontmatter);
  if (!frontmatter.ok) {
    return err([...frontmatter.error, ...credentials]);
  }
  const messages = [
    ...positionMessages(expectation, frontmatter.value),
    ...bodyMessages(split.body),
    ...credentials,
  ];
  if (messages.length > 0) {
    return err(messages);
  }
  return ok({ relPath: expectation.relPath, frontmatter: frontmatter.value });
}
