import { describe, expect, it } from 'vitest';

import { validateSubagentProjections } from './subagent-projection-validation.js';
import { fakeProjectionRepo } from './test-helpers/fake-projection-repo.js';

/**
 * The sub-agent adapter leg of the portability validator (closure item 6, 2b-ii, slices A1
 * A2 and B): every template's declaration renders its adapters on the four adapter surfaces
 * and the Codex registry's blocks after its hand-kept head, the five are compared
 * byte for byte, `--fix` writes what is missing or drifted and removes what no declaration
 * renders, and the leg refuses, touching nothing, whenever it cannot vouch for its input.
 * Injected in-memory port, no real file system.
 */

const TEMPLATES = '.agent/sub-agents/templates';
const FIX = 'run `pnpm portability:fix`';
const REFUSING = 'refusing to regenerate the sub-agent adapters';

const ALPHA = '---\ndescription: Alpha reviews a.\n---\n\n## Delegation Triggers\n\nAlpha body.\n';
const CRICKET = [
  '---',
  'variants:',
  '  - name: cricket-judgement-high',
  '    platforms:',
  '      - cursor',
  '      - claude',
  '    description: Fast high-effort check.',
  '    title: Cricket — High Effort',
  '---',
  '',
  '## Delegation Triggers',
  '',
].join('\n');

const EXPECTED_PATHS = [
  '.cursor/agents/alpha.md',
  '.claude/agents/alpha.md',
  '.codex/agents/alpha.toml',
  '.gemini/agents/alpha.md',
  '.cursor/agents/cricket-judgement-high.md',
  '.claude/agents/cricket-judgement-high.md',
];

const REGISTRY = '.codex/config.toml';
const REGISTRY_HEAD = 'file_opener = "cursor"\n\n[features]\nmulti_agent = true\n\n';
const REGISTRY_BLOCKS =
  '[agents."alpha"]\ndescription = "Alpha reviews a."\nconfig_file = "agents/alpha.toml"\n';

function bareRepo(): ReturnType<typeof fakeProjectionRepo> {
  return fakeProjectionRepo(
    new Map([
      [`${TEMPLATES}/alpha.md`, ALPHA],
      [`${TEMPLATES}/cricket-judgement.md`, CRICKET],
      [REGISTRY, REGISTRY_HEAD],
    ]),
  );
}

describe('validateSubagentProjections', () => {
  it('reports every adapter missing on a bare repository, and writes them all in fix mode', async () => {
    const repo = bareRepo();
    const check = await validateSubagentProjections(false, repo);
    expect(check.issues).toStrictEqual([
      ...EXPECTED_PATHS.map((file) => `${file}: missing sub-agent adapter (${FIX})`),
      `${REGISTRY}: drifted from the template's declaration; adapters are never hand-edited (${FIX})`,
    ]);
    expect(check.templateCount).toBe(2);

    const fix = await validateSubagentProjections(true, repo);
    expect(fix.issues).toEqual([]);
    expect(fix.written).toStrictEqual([...EXPECTED_PATHS, REGISTRY]);
    // The registry: the hand-kept head verbatim, then one block per Codex adapter.
    expect(repo.files.get(REGISTRY)).toBe(`${REGISTRY_HEAD}${REGISTRY_BLOCKS}`);
    expect(repo.files.get('.claude/agents/alpha.md')).toContain(
      "description: 'Alpha reviews a.'\ntools: Read, Grep, Glob, Bash\n",
    );
    expect(repo.files.get('.cursor/agents/cricket-judgement-high.md')).toContain(
      '# Cricket — High Effort',
    );

    const again = await validateSubagentProjections(false, repo);
    expect(again.issues).toEqual([]);
  });

  it('reports a hand-edited adapter as drifted and restores it in fix mode', async () => {
    const repo = bareRepo();
    await validateSubagentProjections(true, repo);
    repo.files.set('.codex/agents/alpha.toml', 'edited by hand\n');
    const check = await validateSubagentProjections(false, repo);
    expect(check.issues).toEqual([
      `.codex/agents/alpha.toml: drifted from the template's declaration; adapters are never hand-edited (${FIX})`,
    ]);
    const fix = await validateSubagentProjections(true, repo);
    expect(fix.written).toEqual(['.codex/agents/alpha.toml']);
    expect(repo.files.get('.codex/agents/alpha.toml')).toContain('name = "alpha"');
  });

  it('reports an adapter with no template behind it as stale and removes it in fix mode, on the Gemini surface too', async () => {
    const repo = bareRepo();
    await validateSubagentProjections(true, repo);
    repo.files.set('.claude/agents/gone.md', 'hand-kept\n');
    repo.files.set('.gemini/agents/gone.md', 'hand-kept\n');
    const check = await validateSubagentProjections(false, repo);
    expect(check.issues).toEqual([
      `.claude/agents/gone.md: no template renders it (${FIX} to remove it)`,
      `.gemini/agents/gone.md: no template renders it (${FIX} to remove it)`,
    ]);
    const fix = await validateSubagentProjections(true, repo);
    expect(fix.removed).toEqual(['.claude/agents/gone.md', '.gemini/agents/gone.md']);
    expect(repo.files.has('.gemini/agents/gone.md')).toBe(false);
  });

  it('refuses to render anything while one template carries no declaration, naming it, and writes nothing', async () => {
    const repo = bareRepo();
    repo.files.set(`${TEMPLATES}/gamma.md`, '## Delegation Triggers\n\nUndeclared.\n');
    const fix = await validateSubagentProjections(true, repo);
    expect(fix.issues).toEqual([
      `${TEMPLATES}/gamma.md: no declaration in its frontmatter (write the block in the shape .agent/sub-agents/README.md §Declarations gives); ${REFUSING}`,
    ]);
    expect(fix.written).toEqual([]);
    expect(repo.files.has('.cursor/agents/alpha.md')).toBe(false);
  });

  it('refuses a template whose declaration does not parse, or whose name a path cannot carry, naming each', async () => {
    const repo = bareRepo();
    repo.files.set(`${TEMPLATES}/delta.md`, '---\ndescription: 7\n---\n');
    repo.files.set(`${TEMPLATES}/Bad Name.md`, ALPHA);
    const check = await validateSubagentProjections(false, repo);
    expect(check.issues).toEqual([
      `${TEMPLATES}/Bad Name.md: "Bad Name": not a template basename (lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no suffix); ${REFUSING}`,
      `${TEMPLATES}/delta.md: delta: description: Invalid input: expected string, received number; ${REFUSING}`,
    ]);
  });

  it('refuses to act when the templates directory is absent, unreadable or empty, or holds a file that is not a template', async () => {
    const absent = await validateSubagentProjections(true, fakeProjectionRepo(new Map()));
    expect(absent.issues).toEqual([`${TEMPLATES}: no such directory; ${REFUSING}`]);

    const unreadable = await validateSubagentProjections(
      true,
      fakeProjectionRepo(
        new Map(),
        new Map([[TEMPLATES, { kind: 'unreadable', cause: 'EACCES' }]]),
      ),
    );
    expect(unreadable.issues).toEqual([`${TEMPLATES}: unreadable (EACCES); ${REFUSING}`]);

    const empty = await validateSubagentProjections(
      true,
      fakeProjectionRepo(
        new Map(),
        new Map([[TEMPLATES, { kind: 'files', files: [], stray: [] }]]),
      ),
    );
    expect(empty.issues).toEqual([`${TEMPLATES}: no templates; ${REFUSING} from an empty set`]);

    const stray = bareRepo();
    stray.files.set(`${TEMPLATES}/notes.txt`, 'stray');
    const check = await validateSubagentProjections(true, stray);
    expect(check.issues).toEqual([
      `${TEMPLATES}/notes.txt: not a template; the templates directory admits .md templates only`,
    ]);
    expect(check.written).toEqual([]);
  });

  it('refuses when a template or an existing adapter is unreadable, naming it, and writes nothing', async () => {
    const template = bareRepo();
    const brokenTemplate = fakeProjectionRepo(
      template.files,
      new Map(),
      new Map([[`${TEMPLATES}/alpha.md`, { kind: 'unreadable', cause: 'EIO' }]]),
    );
    expect((await validateSubagentProjections(true, brokenTemplate)).issues).toEqual([
      `${TEMPLATES}/alpha.md: unreadable (EIO); ${REFUSING}`,
    ]);

    const generated = bareRepo();
    await validateSubagentProjections(true, generated);
    const brokenAdapter = fakeProjectionRepo(
      generated.files,
      new Map(),
      new Map([['.cursor/agents/alpha.md', { kind: 'foreign' }]]),
    );
    const check = await validateSubagentProjections(true, brokenAdapter);
    expect(check.issues).toEqual([
      '.cursor/agents/alpha.md: not a regular file; the sub-agent surfaces admit regular files only',
    ]);
    expect(check.written).toEqual([]);
  });

  it('refuses through the leg a declaration the Codex adapter cannot carry verbatim, writing nothing', async () => {
    const repo = bareRepo();
    repo.files.set(`${TEMPLATES}/alpha.md`, '---\ndescription: Alpha says "hi".\n---\n');
    const fix = await validateSubagentProjections(true, repo);
    expect(fix.issues).toHaveLength(1);
    expect(fix.issues[0]).toContain(
      '.codex/agents/alpha.toml: the description carries a character',
    );
    expect(fix.written).toEqual([]);
  });

  it('reads the registry as its own surface: reordered blocks drift and are rewritten after the head verbatim; a registry with no file refuses; a foreign line in its tail refuses', async () => {
    const repo = bareRepo();
    await validateSubagentProjections(true, repo);
    repo.files.set(
      REGISTRY,
      `${REGISTRY_HEAD}[agents."zeta"]\ndescription = "Gone."\nconfig_file = "agents/zeta.toml"\n\n${REGISTRY_BLOCKS}`,
    );
    const check = await validateSubagentProjections(false, repo);
    expect(check.issues).toEqual([
      `${REGISTRY}: drifted from the template's declaration; adapters are never hand-edited (${FIX})`,
    ]);
    const fix = await validateSubagentProjections(true, repo);
    expect(fix.written).toEqual([REGISTRY]);
    expect(repo.files.get(REGISTRY)).toBe(`${REGISTRY_HEAD}${REGISTRY_BLOCKS}`);

    const noRegistry = bareRepo();
    noRegistry.files.delete(REGISTRY);
    const absent = await validateSubagentProjections(true, noRegistry);
    expect(absent.issues).toEqual([
      `${REGISTRY}: no Codex registry to keep the head of; ${REFUSING}`,
    ]);
    expect(absent.written).toEqual([]);

    const unreadable = fakeProjectionRepo(
      bareRepo().files,
      new Map(),
      new Map([[REGISTRY, { kind: 'unreadable', cause: 'EIO' }]]),
    );
    expect((await validateSubagentProjections(true, unreadable)).issues).toEqual([
      `${REGISTRY}: unreadable (EIO); ${REFUSING}`,
    ]);

    const foreign = bareRepo();
    foreign.files.set(
      REGISTRY,
      `${REGISTRY_HEAD}${REGISTRY_BLOCKS}\n[mcp_servers.docs]\nurl = "x"\n`,
    );
    const refused = await validateSubagentProjections(true, foreign);
    expect(refused.issues).toEqual([
      `${REGISTRY}: line "[mcp_servers.docs]" sits in the registry tail, which the declarations render whole; write a block line in the rendered shape with its block complete, or move a foreign section above the first agents block; ${REFUSING}`,
    ]);
    expect(refused.written).toEqual([]);
  });

  it('refuses a surface holding a subdirectory, naming it, and writes nothing: the fake port reports a nested descendant as production does (#81 round two)', async () => {
    const repo = bareRepo();
    await validateSubagentProjections(true, repo);
    repo.files.set('.claude/agents/nested/gone.md', 'hand-kept\n');
    const check = await validateSubagentProjections(true, repo);
    expect(check.issues).toEqual([
      '.claude/agents/nested: not a regular file; the sub-agent surfaces admit regular files only',
    ]);
    expect(check.written).toEqual([]);
  });

  it('renders a declaration on exactly the surfaces it names: the declarations are the one platform truth', async () => {
    const declaring = async (platforms: string): Promise<readonly string[]> => {
      const repo = bareRepo();
      repo.files.set(
        `${TEMPLATES}/beta.md`,
        `---\ndescription: Beta reviews b.\nplatforms:\n${platforms}---\n\n## Delegation Triggers\n`,
      );
      const fix = await validateSubagentProjections(true, repo);
      expect(fix.issues).toEqual([]);
      return fix.written.filter((written) => written.includes('/beta.'));
    };
    expect(await declaring('  - gemini\n')).toEqual(['.gemini/agents/beta.md']);
    expect(await declaring('  - claude\n')).toEqual(['.claude/agents/beta.md']);
    // The bare repository's fan-out variant, cricket-judgement-high on Cursor and Claude,
    // renders on those two; declared on Cursor alone it renders on Cursor alone and no
    // gate expects it elsewhere.
    const narrowed = bareRepo();
    narrowed.files.set(
      `${TEMPLATES}/cricket-judgement.md`,
      CRICKET.replace('      - claude\n', ''),
    );
    const fix = await validateSubagentProjections(true, narrowed);
    expect(fix.issues).toEqual([]);
    expect(fix.written.filter((written) => written.includes('cricket-judgement-high'))).toEqual([
      '.cursor/agents/cricket-judgement-high.md',
    ]);
  });

  it('ends a fix run at a refused mutation, reporting it with what was written before it', async () => {
    const repo = fakeProjectionRepo(
      bareRepo().files,
      new Map(),
      new Map(),
      new Set(['.codex/agents/alpha.toml']),
    );
    const fix = await validateSubagentProjections(true, repo);
    expect(fix.issues).toEqual([
      '.codex/agents/alpha.toml: not a regular file at the moment of the write; refusing the projection write',
    ]);
    expect(fix.written).toEqual(['.cursor/agents/alpha.md', '.claude/agents/alpha.md']);
  });
});
