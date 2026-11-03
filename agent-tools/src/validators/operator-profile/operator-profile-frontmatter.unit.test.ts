import path from 'node:path';

import { unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  PROFILE_FIXTURES,
  VALID_INDEX_DOCUMENT,
  VALID_MACHINE_DOCUMENT,
  VALID_SCOPE_DOCUMENT,
} from './operator-profile-fixtures.js';
import { parseOperatorProfileDocument } from './operator-profile-document.js';
import {
  deriveMachineKey,
  findCredentialLikeLines,
  machineKeyFromRelPath,
  type CredentialVocabulary,
  scopeKeyFromRelPath,
} from './operator-profile-keys.js';
import { scopeKeyFromManifestText, scopeKeyFromPackageName } from './operator-profile-scope-key.js';
import { classifyProfileEntries } from './operator-profile-layout.js';
import { resolveProfileRoot } from './operator-profile-root.js';

function messagesOf(result: ReturnType<typeof parseOperatorProfileDocument>): readonly string[] {
  return result.ok ? [] : result.error;
}

const INDEX_POSITION = { relPath: 'index.md', expectedKind: 'index' } as const;
const SCOPE_POSITION = {
  relPath: 'repos/engraphcode--open-curriculum-ecosystem.md',
  expectedKind: 'scope',
  expectedKey: 'engraphcode--open-curriculum-ecosystem',
} as const;
const MACHINE_POSITION = {
  relPath: 'machines/studio-laptop.md',
  expectedKind: 'machine',
  expectedKey: 'studio-laptop',
} as const;

describe('parseOperatorProfileDocument', () => {
  it('accepts a conforming index document', () => {
    const parsed = unwrap(parseOperatorProfileDocument(INDEX_POSITION, VALID_INDEX_DOCUMENT));
    expect(parsed.frontmatter.kind).toBe('index');
    expect(parsed.frontmatter.ratified).toBe(false);
  });

  it('accepts a conforming scope document whose key matches its file name', () => {
    const parsed = unwrap(parseOperatorProfileDocument(SCOPE_POSITION, VALID_SCOPE_DOCUMENT));
    expect(parsed.frontmatter.kind).toBe('scope');
  });

  it('accepts a conforming machine document whose key matches its file name', () => {
    const parsed = unwrap(parseOperatorProfileDocument(MACHINE_POSITION, VALID_MACHINE_DOCUMENT));
    expect(parsed.frontmatter.kind).toBe('machine');
  });

  it.each(PROFILE_FIXTURES.filter((fixture) => !fixture.frontmatterValid))(
    'refuses the non-conforming fixture "$name" with a frontmatter message',
    (fixture) => {
      const result = parseOperatorProfileDocument(
        { relPath: fixture.relPath, expectedKind: fixture.kind },
        fixture.content,
      );
      expect(result.ok).toBe(false);
      expect(messagesOf(result).some((message) => message.startsWith('frontmatter'))).toBe(true);
    },
  );

  it('refuses a document with no frontmatter block', () => {
    const result = parseOperatorProfileDocument(INDEX_POSITION, '# Just prose\n');
    expect(messagesOf(result)).toEqual([
      'no YAML frontmatter block (every operator-profile document opens with one)',
    ]);
  });

  it('refuses unparseable YAML without echoing it, and still scans it for credentials', () => {
    const token = `ghp_${'z'.repeat(30)}`;
    const broken = `---\nkind: [unclosed\ntoken: ${token}\n---\n\n# body\n`;
    const messages = messagesOf(parseOperatorProfileDocument(INDEX_POSITION, broken));
    expect(messages[0]).toMatch(
      /^frontmatter is not parseable YAML \(\w+\); the block's text is not echoed$/,
    );
    expect(
      messages.some((message) => message.startsWith('credential-shaped content on line 3')),
    ).toBe(true);
    expect(messages.join('\n')).not.toContain('unclosed');
    expect(messages.join('\n')).not.toContain(token);
  });

  it('refuses a kind that contradicts the layout position', () => {
    const result = parseOperatorProfileDocument(INDEX_POSITION, VALID_SCOPE_DOCUMENT);
    expect(messagesOf(result)).toContain(
      'frontmatter kind is "scope" but the layout position requires "index"',
    );
  });

  it('refuses a scope key that disagrees with the file name', () => {
    const result = parseOperatorProfileDocument(
      { relPath: 'repos/other--repo.md', expectedKind: 'scope', expectedKey: 'other--repo' },
      VALID_SCOPE_DOCUMENT,
    );
    expect(messagesOf(result)).toContain(
      'frontmatter scope_key "engraphcode--open-curriculum-ecosystem" does not match the file name "other--repo"',
    );
  });

  it('refuses a machine key that disagrees with the file name', () => {
    const result = parseOperatorProfileDocument(
      { relPath: 'machines/other.md', expectedKind: 'machine', expectedKey: 'other' },
      VALID_MACHINE_DOCUMENT,
    );
    expect(messagesOf(result)).toContain(
      'frontmatter machine_key "studio-laptop" does not match the file name "other"',
    );
  });

  it('refuses an empty body', () => {
    const frontmatterOnly = `${VALID_INDEX_DOCUMENT.split('---\n\n')[0]}---\n`;
    const result = parseOperatorProfileDocument(INDEX_POSITION, frontmatterOnly);
    expect(messagesOf(result)).toContain('the body below the frontmatter is empty');
  });

  it('refuses credential-shaped lines by line number without echoing them', () => {
    const leaked = `${VALID_INDEX_DOCUMENT}\nA token: ghp_${'a'.repeat(30)}\n`;
    const messages = messagesOf(parseOperatorProfileDocument(INDEX_POSITION, leaked));
    expect(
      messages.some((message) => message.startsWith('credential-shaped content on line')),
    ).toBe(true);
    expect(messages.join('\n')).not.toContain('ghp_');
  });

  it('refuses a closing delimiter that does not end its line as no frontmatter block at all', () => {
    const unclosed = '---\npractice_profile: operator-profile\n---junk\n\n# body\n';
    expect(messagesOf(parseOperatorProfileDocument(INDEX_POSITION, unclosed))).toEqual([
      'no YAML frontmatter block (every operator-profile document opens with one)',
    ]);
  });

  it('accepts a CRLF document and reads its body from the same delimiter match', () => {
    const crlf = VALID_INDEX_DOCUMENT.replaceAll('\n', '\r\n');
    expect(parseOperatorProfileDocument(INDEX_POSITION, crlf).ok).toBe(true);
    const emptyBody = `${VALID_INDEX_DOCUMENT.split('---\n\n')[0]}---\r\n\r\n`;
    expect(messagesOf(parseOperatorProfileDocument(INDEX_POSITION, emptyBody))).toContain(
      'the body below the frontmatter is empty',
    );
  });

  it('withholds the name of an unrecognised frontmatter key, which may be credential-shaped', () => {
    const withUnknownKey = VALID_INDEX_DOCUMENT.replace(
      'ratified: false\n',
      `ratified: false\nsk-${'q'.repeat(20)}: present\n`,
    );
    const messages = messagesOf(parseOperatorProfileDocument(INDEX_POSITION, withUnknownKey));
    expect(messages).toContain(
      "frontmatter (root): 1 unrecognized key (the key names are not echoed; the contract lists the family's keys)",
    );
    expect(messages.join('\n')).not.toContain('sk-');
  });
});

// The tripwire's engine is proven against three injected words. The production
// lists are configuration; that they are wired in is proven through the real
// call site, by the document tests above that refuse a token by line number.
const VOCABULARY: CredentialVocabulary = {
  tokenShapes: [/-TOK-\d{4}/],
  labels: ['pass word'],
  bearerLabels: ['authorization'],
  variableWords: ['TOKEN'],
};

describe('findCredentialLikeLines — token shapes, labels and table rows', () => {
  it('flags a token shape on the line as written, its leading marks included', () => {
    expect(findCredentialLikeLines('clean\n-TOK-1234', VOCABULARY)).toEqual([2]);
  });

  it('flags a label bound to a value', () => {
    expect(findCredentialLikeLines('password: x', VOCABULARY)).toEqual([1]);
  });

  it('reads a label whatever its case, quoting or joining, on both sides', () => {
    expect(findCredentialLikeLines('"Pass_word" = x', VOCABULARY)).toEqual([1]);
  });

  it('reads a label through Markdown furniture', () => {
    expect(findCredentialLikeLines('> - **Password:** x', VOCABULARY)).toEqual([1]);
  });

  it('reads a label through a plus mark and an ordered-list number', () => {
    const listed = '+ password: x\n1. password: y\n  2) password: z';
    expect(findCredentialLikeLines(listed, VOCABULARY)).toEqual([1, 2, 3]);
  });

  it('passes prose that mentions a label without being one', () => {
    expect(findCredentialLikeLines('password managers: use one', VOCABULARY)).toEqual([]);
  });

  it('flags a value that opens with a mark', () => {
    expect(findCredentialLikeLines('password: _x', VOCABULARY)).toEqual([1]);
  });

  it('passes a closing mark alone, which is not a value', () => {
    expect(findCredentialLikeLines('**Password:** **', VOCABULARY)).toEqual([]);
  });

  it('flags a table row that binds a label to one token', () => {
    expect(findCredentialLikeLines('| Password | x |', VOCABULARY)).toEqual([1]);
  });

  it('passes a table row whose label cell is followed by several words', () => {
    expect(findCredentialLikeLines('| Password | Where it lives |', VOCABULARY)).toEqual([]);
  });

  it('passes a table row whose first cell is no label', () => {
    expect(findCredentialLikeLines('| Name | x |', VOCABULARY)).toEqual([]);
  });
});

describe('findCredentialLikeLines — variables, bearer headers and wrapped values', () => {
  it('flags a variable that carries a credential word, bound to a value', () => {
    expect(findCredentialLikeLines('MY_TOKEN=x', VOCABULARY)).toEqual([1]);
  });

  it('flags an exported variable whose name is the credential word', () => {
    expect(findCredentialLikeLines('export TOKEN="x"', VOCABULARY)).toEqual([1]);
  });

  it('passes a variable that carries no credential word', () => {
    expect(findCredentialLikeLines('MY_PATH=x', VOCABULARY)).toEqual([]);
  });

  it('passes a variable that merely begins with the word', () => {
    expect(findCredentialLikeLines('TOKENIZER=x', VOCABULARY)).toEqual([]);
  });

  it('passes a credential variable named in prose', () => {
    expect(findCredentialLikeLines('MY_TOKEN is set by the launcher', VOCABULARY)).toEqual([]);
  });

  it('passes a credential variable bound to nothing', () => {
    expect(findCredentialLikeLines('MY_TOKEN=', VOCABULARY)).toEqual([]);
  });

  it('flags a bearer header only when it carries a bearer pair', () => {
    const content = 'Authorization: Bearer x\nAuthorization: basic';
    expect(findCredentialLikeLines(content, VOCABULARY)).toEqual([1]);
  });

  it('flags a bare label and the value on the next non-blank line, both lines', () => {
    expect(findCredentialLikeLines('Password:\n\nx', VOCABULARY)).toEqual([1, 3]);
  });

  it('flags a bare bearer header and the bearer pair on the next line', () => {
    expect(findCredentialLikeLines('Authorization:\nBearer x', VOCABULARY)).toEqual([1, 2]);
  });

  it('passes a bare label followed by a sentence', () => {
    const content = 'Password:\nit lives in the keychain';
    expect(findCredentialLikeLines(content, VOCABULARY)).toEqual([]);
  });

  it('passes a bare label with only blank lines after it', () => {
    expect(findCredentialLikeLines('Password:\n\n', VOCABULARY)).toEqual([]);
  });
});

describe('scopeKeyFromPackageName', () => {
  it('maps an unscoped manifest name to itself and a scoped one to scope--name, lowercased', () => {
    expect(scopeKeyFromPackageName('example-sites')).toBe('example-sites');
    expect(scopeKeyFromPackageName('@Example-Org/Example.Repo')).toBe('example-org--example.repo');
    expect(scopeKeyFromPackageName('  @a/b  ')).toBe('a--b');
  });

  it('returns undefined for a name the key grammar cannot carry', () => {
    expect(scopeKeyFromPackageName('')).toBeUndefined();
    expect(scopeKeyFromPackageName('@scope')).toBeUndefined();
    expect(scopeKeyFromPackageName('a/b')).toBeUndefined();
    expect(scopeKeyFromPackageName('@a/b/c')).toBeUndefined();
    expect(scopeKeyFromPackageName('.hidden')).toBeUndefined();
    expect(scopeKeyFromPackageName('~tilde')).toBeUndefined();
  });
});

describe('scopeKeyFromManifestText', () => {
  it('reads the name of a root manifest and derives the key', () => {
    expect(unwrap(scopeKeyFromManifestText('{"name":"@a/b","private":true}'))).toBe('a--b');
  });

  it('names the reason when the manifest is not JSON, has no name, or has a name the grammar refuses', () => {
    expect(unwrapErr(scopeKeyFromManifestText('not json'))).toContain('not JSON');
    expect(unwrapErr(scopeKeyFromManifestText('{"private":true}'))).toContain('name');
    expect(unwrapErr(scopeKeyFromManifestText('{"name":"a/b"}'))).toContain('scope key');
  });
});

describe('key derivation from paths and host names', () => {
  it('reads the stem of repos/<key>.md and machines/<key>.md and nothing else', () => {
    expect(scopeKeyFromRelPath('repos/a--b.md')).toBe('a--b');
    expect(scopeKeyFromRelPath('index.md')).toBeUndefined();
    expect(scopeKeyFromRelPath('repos/nested/a--b.md')).toBeUndefined();
    expect(scopeKeyFromRelPath('repos/a--b.txt')).toBeUndefined();
    expect(machineKeyFromRelPath('machines/studio-laptop.md')).toBe('studio-laptop');
    expect(machineKeyFromRelPath('repos/studio-laptop.md')).toBeUndefined();
    expect(machineKeyFromRelPath('machines/nested/x.md')).toBeUndefined();
  });

  it('derives the lowercase short host name and refuses an unusable one', () => {
    expect(deriveMachineKey('Studio-Laptop.local')).toBe('studio-laptop');
    expect(deriveMachineKey('build01')).toBe('build01');
    expect(deriveMachineKey('')).toBeUndefined();
    expect(deriveMachineKey('-leading-dash')).toBeUndefined();
  });
});

describe('resolveProfileRoot', () => {
  // Expected values are built with the platform's own path module so the
  // test proves precedence, not a separator: Windows joins with backslashes
  // and resolves a rooted path onto the current drive.
  const home = path.join('srv', 'operator-home');
  const homeProfile = path.join(home, '.practice', 'profile');

  it('prefers the parsed --root value, then PRACTICE_HOME, then the home fallback', () => {
    const explicit = path.join('srv', 'elsewhere', 'profile');
    expect(resolveProfileRoot(explicit, {}, home)).toBe(path.resolve(explicit));
    const practiceHome = path.join('opt', 'practice');
    expect(resolveProfileRoot(undefined, { PRACTICE_HOME: practiceHome }, home)).toBe(
      path.join(practiceHome, 'profile'),
    );
    expect(resolveProfileRoot(undefined, {}, home)).toBe(homeProfile);
    expect(resolveProfileRoot(undefined, { PRACTICE_HOME: '' }, home)).toBe(homeProfile);
  });
});

describe('classifyProfileEntries', () => {
  it('maps the named layout to expectations, tolerates git furniture, and reports everything else', () => {
    const layout = classifyProfileEntries([
      { relPath: 'index.md', kind: 'file' },
      { relPath: '.git', kind: 'directory' },
      { relPath: '.gitignore', kind: 'file' },
      { relPath: 'repos', kind: 'directory' },
      { relPath: 'repos/engraphcode--open-curriculum-ecosystem.md', kind: 'file' },
      { relPath: 'machines', kind: 'directory' },
      { relPath: 'machines/studio-laptop.md', kind: 'file' },
      { relPath: 'notes.md', kind: 'file' },
      { relPath: 'repos/stray.txt', kind: 'file' },
      { relPath: 'index.md.bak', kind: 'file' },
      { relPath: 'drafts', kind: 'directory' },
    ]);
    expect(layout.documents).toEqual([INDEX_POSITION, SCOPE_POSITION, MACHINE_POSITION]);
    expect(layout.unexpected).toEqual(['notes.md', 'repos/stray.txt', 'index.md.bak', 'drafts']);
    expect(layout.notRegular).toEqual([]);
  });

  it('refuses a symlink or special entry at any position as not regular, never as a document', () => {
    const layout = classifyProfileEntries([
      { relPath: 'index.md', kind: 'symlink' },
      { relPath: 'repos', kind: 'symlink' },
      { relPath: 'machines/studio-laptop.md', kind: 'other' },
      { relPath: '.gitignore', kind: 'symlink' },
    ]);
    expect(layout.documents).toEqual([]);
    expect(layout.unexpected).toEqual([]);
    expect(layout.notRegular).toEqual([
      'index.md',
      'repos',
      'machines/studio-laptop.md',
      '.gitignore',
    ]);
  });

  it('treats an empty root as a layout with nothing to validate', () => {
    expect(classifyProfileEntries([])).toEqual({ documents: [], unexpected: [], notRegular: [] });
  });
});
