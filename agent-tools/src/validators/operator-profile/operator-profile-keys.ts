/**
 * Operator profile — key derivation and the credential tripwire. Pure.
 */

import { MACHINE_KEY_PATTERN } from './operator-profile-schema.js';

/**
 * Derive the machine key from a host name: the short (first-label) form,
 * lowercased. `hostname -s` already gives the short form; a fully qualified
 * name is cut at its first dot.
 *
 * @param hostName - as `hostname` or `os.hostname()` reports it
 * @returns the machine key, or undefined when the host name is unusable
 */
export function deriveMachineKey(hostName: string): string | undefined {
  const short = hostName.trim().split('.')[0]?.toLowerCase() ?? '';
  return MACHINE_KEY_PATTERN.test(short) ? short : undefined;
}

/** File stem of `repos/<stem>.md`, or undefined for any other path. */
export function scopeKeyFromRelPath(relPath: string): string | undefined {
  return /^repos\/([^/]+)\.md$/.exec(relPath)?.[1];
}

/** File stem of `machines/<stem>.md`, or undefined for any other path. */
export function machineKeyFromRelPath(relPath: string): string | undefined {
  return /^machines\/([^/]+)\.md$/.exec(relPath)?.[1];
}

/**
 * What the credential tripwire looks for. The lists are configuration: the
 * engine below is proven against a small injected vocabulary, and a new
 * spelling is a row here, never a new pattern in the engine.
 */
export interface CredentialVocabulary {
  /**
   * Token shapes, read anywhere on the line as written. A shape carries no
   * `g` or `y` flag: it is tested line by line and must hold no position.
   */
  readonly tokenShapes: readonly RegExp[];
  /** Credential labels, compared canonically: case, quotes, spaces, `_` and `-` are ignored. */
  readonly labels: readonly string[];
  /** Header labels, compared canonically, whose value is a credential only as a `Bearer <token>` pair. */
  readonly bearerLabels: readonly string[];
  /** Words that make an upper-case environment-variable name a credential's. */
  readonly variableWords: readonly string[];
}

/** The production vocabulary. The profile names identities, never credentials. */
const CREDENTIAL_VOCABULARY: CredentialVocabulary = {
  tokenShapes: [
    /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/,
    /github_pat_[A-Za-z0-9_]{20,}/,
    /\bsk-[A-Za-z0-9_-]{16,}/,
    /\bxox[abpr]-[A-Za-z0-9-]{10,}/,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /\bAKIA[0-9A-Z]{16}\b/,
  ],
  labels: ['password', 'passwd', 'secret', 'api key', 'token', 'access token', 'auth token'],
  bearerLabels: ['authorization'],
  variableWords: [
    'SECRET',
    'TOKEN',
    'PASSWORD',
    'PASSWD',
    'API_KEY',
    'APIKEY',
    'PRIVATE_KEY',
    'ACCESS_KEY',
  ],
};

/**
 * The line without its Markdown furniture, which is exactly: the leading run
 * of whitespace and the marks `>`, `#`, `*`, `-`, `+`; then one ordered-list
 * number (`1.` or `1)`); and every bold or code mark. Removed once, here, so
 * every reading below stays linear. A single `*` or `_` inside a value stays,
 * so a value that opens with one is still a value; a closer alone is nothing.
 */
function withoutFurniture(line: string): string {
  return line
    .replace(/^[\s>#*+-]+/, '')
    .replace(/^\d{1,9}[.)]\s+/, '')
    .replaceAll(/\*\*|__|`/g, '')
    .trim();
}

/** A name as its canonical key, so `API key`, `api_key`, `"apiKey"` and `api-key` are one label. */
function canonicalKey(name: string): string {
  return name.toLowerCase().replaceAll(/["' _-]/g, '');
}

/** Whether a name is one of the labels, both read canonically. */
function isOneOf(labels: readonly string[], name: string): boolean {
  const key = canonicalKey(name);
  return labels.some((label) => canonicalKey(label) === key);
}

/** The name and value a line binds at its first `:` or `=`, or undefined when it binds nothing. */
function binding(plain: string): { readonly name: string; readonly value: string } | undefined {
  const at = plain.search(/[:=]/);
  if (at === -1) {
    return undefined;
  }
  return { name: plain.slice(0, at).trim(), value: plain.slice(at + 1).trim() };
}

/**
 * An upper-case environment-variable name, with or without `export` before
 * it, that IS a credential word (`PRIVATE_KEY`) or carries one after a prefix
 * (`AWS_SECRET_ACCESS_KEY`, `MY_TOKENS`). A name that merely begins with the
 * word (`TOKENIZER`, `TOKENS`) is prose or another variable, and passes.
 */
function isCredentialVariable(name: string, words: readonly string[]): boolean {
  const variable = name.replace(/^export\s+/, '');
  return (
    /^[A-Z0-9_]+$/.test(variable) &&
    words.some((word) => variable === word || variable.lastIndexOf(word) > 0)
  );
}

/**
 * A table row whose first cell is a label and whose second is one token
 * (`| Password | hunter2 |`); a label cell followed by several words
 * (`| Password | Where it lives |`) passes.
 */
function tableRowBindsCredential(plain: string, labels: readonly string[]): boolean {
  if (!plain.startsWith('|')) {
    return false;
  }
  const [label = '', value = ''] = plain
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
  return isOneOf(labels, label) && /^\S+$/.test(value);
}

/** Whether the line, furniture removed, binds a credential name to a value. */
function bindsCredential(plain: string, vocabulary: CredentialVocabulary): boolean {
  if (tableRowBindsCredential(plain, vocabulary.labels)) {
    return true;
  }
  const bound = binding(plain);
  if (bound === undefined || bound.value === '') {
    return false;
  }
  if (isOneOf(vocabulary.bearerLabels, bound.name)) {
    return /^["']?bearer\s+\S/i.test(bound.value);
  }
  return (
    isOneOf(vocabulary.labels, bound.name) ||
    isCredentialVariable(bound.name, vocabulary.variableWords)
  );
}

/**
 * A label with nothing after the colon or equals sign: in Markdown the value
 * often sits on the next line (`Password:` then the secret, `Authorization:`
 * then `Bearer …`). Such a line binds the next non-blank line as its value
 * when that line is a value and nothing else.
 */
function isLabelOnly(plain: string, vocabulary: CredentialVocabulary): boolean {
  const bound = binding(plain);
  if (bound === undefined || bound.value !== '') {
    return false;
  }
  return isOneOf(vocabulary.labels, bound.name) || isOneOf(vocabulary.bearerLabels, bound.name);
}

/**
 * A line that is a value and nothing else: one token, optionally quoted, or
 * a `Bearer <token>` pair. A sentence after a bare label is prose, not a
 * wrapped value (`token:` then `secrets live in the keychain` passes).
 */
const VALUE_ONLY_LINE = /^\s*(?:["']?[^\s"']+["']?|bearer\s+\S+)\s*$/i;

/** The index of the next non-blank line after `from` when it is a value line, or -1. */
function wrappedValueLine(lines: readonly string[], from: number): number {
  for (let index = from + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (line.trim() !== '') {
      return VALUE_ONLY_LINE.test(line) ? index : -1;
    }
  }
  return -1;
}

/**
 * Line numbers (1-based) of credential-shaped lines in a document; the
 * content is never echoed.
 *
 * A tripwire for the accidental paste, never a secrets scanner. It reads the
 * named shapes and nothing else: a token shape anywhere on a line; at the
 * start of a line, Markdown furniture aside, a vocabulary label or an
 * upper-case credential variable bound by `:` or `=` to a value; a bearer
 * header carrying a bearer pair; a table row binding a label to one token;
 * and a bare label whose value is the next non-blank line. A spelling outside
 * these shapes passes by design: the control is that credentials are never
 * written to the profile at all (the operator-profile PDR's content decision).
 *
 * @param content - the whole document, frontmatter included
 * @param vocabulary - what to look for (the production vocabulary by default)
 * @returns the offending line numbers, empty when clean
 */
export function findCredentialLikeLines(
  content: string,
  vocabulary: CredentialVocabulary = CREDENTIAL_VOCABULARY,
): readonly number[] {
  const lines = content.split('\n');
  const flagged = new Set<number>();
  lines.forEach((line, index) => {
    const plain = withoutFurniture(line);
    if (
      vocabulary.tokenShapes.some((shape) => shape.test(line)) ||
      bindsCredential(plain, vocabulary)
    ) {
      flagged.add(index + 1);
    }
    if (isLabelOnly(plain, vocabulary)) {
      const value = wrappedValueLine(lines, index);
      if (value !== -1) {
        flagged.add(index + 1);
        flagged.add(value + 1);
      }
    }
  });
  return [...flagged].sort((a, b) => a - b);
}
