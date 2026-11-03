/**
 * Unit tests for the rewrite of links into a sibling skill's references.
 *
 * @remarks
 * Each test describes what one projected file's links must become and
 * which sibling files it therefore needs, from a source location and a
 * skill alone. Pure inputs, no fakes, no IO.
 */

import { describe, expect, it } from 'vitest';

import type { PluginSkill } from './project.js';
import { rewriteSiblingLinks } from './sibling-references.js';

const connection: PluginSkill = {
  name: 'specify-connection',
  hostSkill: 'oak-specify-connection',
  canonicalRelativeDir: '.agent/skills/specification/specify-connection',
};

function sourced(path: string, sourcePath: string, content: string) {
  return { file: { path, content, executable: false }, sourcePath };
}

describe('rewriteSiblingLinks', () => {
  it("points a body's link into a sibling's references at references/<sibling>/ and names the file it needs", () => {
    const rewritten = rewriteSiblingLinks(
      sourced(
        'skills/oak-specify-connection/SKILL.md',
        '.agent/skills/specification/specify-connection/SKILL-CANONICAL.md',
        'See [assurance](../specify/references/assurance.md#warrant) and [own](references/connection-method.md).',
      ),
      connection,
    );
    expect(rewritten.file.content).toBe(
      'See [assurance](references/specify/assurance.md#warrant) and [own](references/connection-method.md).',
    );
    expect(rewritten.needed.map((needed) => [needed.sourcePath, needed.projectedPath])).toEqual([
      [
        '.agent/skills/specification/specify/references/assurance.md',
        'skills/oak-specify-connection/references/specify/assurance.md',
      ],
    ]);
  });

  it("points a reference's link one level deeper at the sibling copy beside it", () => {
    const rewritten = rewriteSiblingLinks(
      sourced(
        'skills/oak-specify-connection/references/connection-method.md',
        '.agent/skills/specification/specify-connection/references/connection-method.md',
        'Apply [the record](../../specify/references/specification-record.md).',
      ),
      connection,
    );
    expect(rewritten.file.content).toBe('Apply [the record](specify/specification-record.md).');
    expect(rewritten.needed.map((needed) => needed.projectedPath)).toEqual([
      'skills/oak-specify-connection/references/specify/specification-record.md',
    ]);
  });

  it("points a relocated sibling copy's link back into the skill's own references at that copy beside it, needing nothing", () => {
    const rewritten = rewriteSiblingLinks(
      sourced(
        'skills/oak-specify-connection/references/specify/assurance.md',
        '.agent/skills/specification/specify/references/assurance.md',
        'Compare [the method](../../specify-connection/references/connection-method.md).',
      ),
      connection,
    );
    expect(rewritten.file.content).toBe('Compare [the method](../connection-method.md).');
    expect(rewritten.needed).toEqual([]);
  });

  it('leaves links with a scheme, absolute links, bare fragments, sibling skill files, escapes above the repository, angle-bracketed and titled links as written', () => {
    const content = [
      '[web](https://example.org/x/references/a.md)',
      '[abs](/etc/references/a.md)',
      '[frag](#references)',
      '[skill](../specify/SKILL-CANONICAL.md)',
      '[rule](../../../rules/verify-dont-trust.md)',
      '[escape](../../../../../elsewhere/references/x.md)',
      '[angled](<../specify/references/a.md>)',
      '[titled](../specify/references/b.md "t")',
    ].join(' ');
    const rewritten = rewriteSiblingLinks(
      sourced(
        'skills/oak-specify-connection/SKILL.md',
        '.agent/skills/specification/specify-connection/SKILL-CANONICAL.md',
        content,
      ),
      connection,
    );
    expect(rewritten.file.content).toBe(content);
    expect(rewritten.needed).toEqual([]);
  });
});
