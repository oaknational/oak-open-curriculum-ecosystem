/**
 * Integration tests for one skill's files in the plugin.
 *
 * @remarks
 * Each test describes the file set the plugin must carry for one adapter
 * and canonical shape, driven through the in-memory seams: the inlined
 * skill file, the adapter's references beside it, and every sibling
 * reference those files link (read and never copied in the repository),
 * projected under the skill at the paths the rewritten links name,
 * transitively, and named by canonical path for the manifest. Files are addressed by
 * path; the order the projector emits them in is no contract.
 */

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { pluginSkillFiles } from './plugin-skill.js';
import type { PluginSkill } from './project.js';
import { harness, REPO } from './test-helpers/in-memory-seams.js';

const assess: PluginSkill = {
  name: 'assess-specification',
  hostSkill: 'oak-assess-specification',
  canonicalRelativeDir: '.agent/skills/specification/assess-specification',
};

const userValue: PluginSkill = {
  name: 'user-value',
  hostSkill: 'oak-user-value',
  canonicalRelativeDir: '.agent/skills/planning/user-value',
};

const ASSESS_ADAPTER =
  '---\nname: oak-assess-specification\ndescription: "Assess a specification."\n---\n\nPointer.\n';

/** The assess canonical: its own reference, two of the sibling's (one with a fragment), an external link and a sibling skill. */
const ASSESS_CANONICAL = [
  '---',
  'name: assess-specification',
  '---',
  '',
  '# Assess a Specification',
  '',
  'Apply [assessment criteria](references/assessment-criteria.md) and the shared',
  'references owned with [`specify`](../specify/SKILL-CANONICAL.md):',
  '[assurance](../specify/references/assurance.md#the-four-questions) and',
  '[the specification record](../specify/references/specification-record.md), read and',
  'never copied; see also [the standard](https://example.org/specify/references/standard.md).',
  '',
].join('\n');

/** The adapter's own reference, itself linking the sibling's references from one level deeper. */
const ASSESSMENT_CRITERIA = [
  '# Assessment criteria',
  '',
  'It applies [assurance](../../specify/references/assurance.md) and',
  '[lifecycle and change](../../specify/references/lifecycle-and-change.md) without copying them.',
  '',
].join('\n');

/** A non-markdown adapter file whose text happens to hold a link: carried as it is. */
const NOTES = 'see ](../../specify/references/assurance.md) for the warrant\n';

const SPECIFY_REFERENCES = '.agent/skills/specification/specify/references';
const ASSESS_DIR = 'skills/oak-assess-specification';

/** A harness carrying the assess skill; the sibling's canonical references are seeded when asked. */
function withAssess(siblingReferences: boolean) {
  const h = harness();
  h.files.set(`${REPO}/.claude/skills/oak-assess-specification/SKILL.md`, ASSESS_ADAPTER);
  h.files.set(
    `${REPO}/.claude/skills/oak-assess-specification/references/assessment-criteria.md`,
    ASSESSMENT_CRITERIA,
  );
  h.files.set(`${REPO}/.claude/skills/oak-assess-specification/references/notes.txt`, NOTES);
  h.files.set(`${REPO}/${assess.canonicalRelativeDir}/SKILL-CANONICAL.md`, ASSESS_CANONICAL);
  if (siblingReferences) {
    h.files.set(
      `${REPO}/${SPECIFY_REFERENCES}/assurance.md`,
      '# Assurance\n\nSee [profiles](profiles.md).\n',
    );
    h.files.set(
      `${REPO}/${SPECIFY_REFERENCES}/profiles.md`,
      '# Profiles\n\nStart from [the record](specification-record.md).\n',
    );
    h.files.set(
      `${REPO}/${SPECIFY_REFERENCES}/specification-record.md`,
      '# Specification record\n',
    );
    h.files.set(
      `${REPO}/${SPECIFY_REFERENCES}/lifecycle-and-change.md`,
      '# Lifecycle and change\n',
    );
  }
  return h;
}

/** Alphabetical order, so a comparison never depends on the projector's emission order. */
const alphabetical = (a: string, b: string): number => a.localeCompare(b, 'en');

/** The projected files by path, and their paths as emitted (a duplicate would show here, not in the map). */
function projected(skill: PluginSkill, seams: ReturnType<typeof harness>['seams']) {
  const result = unwrapOrThrow(pluginSkillFiles(REPO, skill, seams));
  return {
    byPath: new Map(result.files.map((file) => [file.path, file.content])),
    paths: result.files.map((file) => file.path).toSorted(alphabetical),
    sharedReferences: result.sharedReferences,
  };
}

describe('pluginSkillFiles', () => {
  it('points each sibling reference link at the projected copy and carries every linked sibling file, transitively', () => {
    const { byPath, paths, sharedReferences } = projected(assess, withAssess(true).seams);
    const skillFile = byPath.get(`${ASSESS_DIR}/SKILL.md`) ?? '';
    expect(skillFile.startsWith('---\nname: oak-assess-specification\n')).toBe(true);
    expect(skillFile).toContain('[assessment criteria](references/assessment-criteria.md)');
    expect(skillFile).toContain('[assurance](references/specify/assurance.md#the-four-questions)');
    expect(skillFile).toContain(
      '[the specification record](references/specify/specification-record.md)',
    );
    expect(skillFile).toContain('[`specify`](../specify/SKILL-CANONICAL.md)');
    expect(skillFile).toContain('(https://example.org/specify/references/standard.md)');
    expect(skillFile).not.toContain('../specify/references/');
    expect(byPath.get(`${ASSESS_DIR}/references/assessment-criteria.md`)).toBe(
      [
        '# Assessment criteria',
        '',
        'It applies [assurance](specify/assurance.md) and',
        '[lifecycle and change](specify/lifecycle-and-change.md) without copying them.',
        '',
      ].join('\n'),
    );
    expect(byPath.get(`${ASSESS_DIR}/references/notes.txt`)).toBe(NOTES);
    expect(byPath.get(`${ASSESS_DIR}/references/specify/profiles.md`)).toBe(
      '# Profiles\n\nStart from [the record](specification-record.md).\n',
    );
    expect(paths).toEqual(
      [
        `${ASSESS_DIR}/SKILL.md`,
        `${ASSESS_DIR}/references/assessment-criteria.md`,
        `${ASSESS_DIR}/references/notes.txt`,
        `${ASSESS_DIR}/references/specify/assurance.md`,
        `${ASSESS_DIR}/references/specify/lifecycle-and-change.md`,
        `${ASSESS_DIR}/references/specify/profiles.md`,
        `${ASSESS_DIR}/references/specify/specification-record.md`,
      ].toSorted(alphabetical),
    );
    expect(sharedReferences).toEqual([
      `${SPECIFY_REFERENCES}/assurance.md`,
      `${SPECIFY_REFERENCES}/lifecycle-and-change.md`,
      `${SPECIFY_REFERENCES}/profiles.md`,
      `${SPECIFY_REFERENCES}/specification-record.md`,
    ]);
  });

  it('refuses, naming the linking file, the link and where it resolves, when a linked sibling reference reads as absent', () => {
    const refusal = unwrapErr(pluginSkillFiles(REPO, assess, withAssess(false).seams));
    expect(refusal.message).toContain(
      '.agent/skills/specification/assess-specification/SKILL-CANONICAL.md links',
    );
    expect(refusal.message).toContain('../specify/references/assurance.md#the-four-questions');
    expect(refusal.message).toContain(`${SPECIFY_REFERENCES}/assurance.md`);
  });

  it('refuses when two siblings of one name in different families would project a file at the same path', () => {
    const h = withAssess(true);
    h.files.set(
      `${REPO}/.agent/skills/planning/specify/references/assurance.md`,
      '# Another assurance\n',
    );
    h.files.set(
      `${REPO}/${assess.canonicalRelativeDir}/SKILL-CANONICAL.md`,
      [
        '---',
        'name: assess-specification',
        '---',
        '',
        'See [a](../specify/references/assurance.md) and [b](../../planning/specify/references/assurance.md).',
        '',
      ].join('\n'),
    );
    const refusal = unwrapErr(pluginSkillFiles(REPO, assess, h.seams));
    expect(refusal.message).toContain('../../planning/specify/references/assurance.md');
    expect(refusal.message).toContain(`${ASSESS_DIR}/references/specify/assurance.md`);
    expect(refusal.message).toContain(`where ${SPECIFY_REFERENCES}/assurance.md already sits`);
  });

  it('leaves a link that would resolve above the repository as written and carries no file for it', () => {
    const h = withAssess(true);
    h.files.set(
      `${REPO}/${assess.canonicalRelativeDir}/SKILL-CANONICAL.md`,
      '---\nname: assess-specification\n---\n\nAn [escape](../../../../../elsewhere/references/x.md).\n',
    );
    const { byPath, paths } = projected(assess, h.seams);
    expect(byPath.get(`${ASSESS_DIR}/SKILL.md`)).toContain(
      '[escape](../../../../../elsewhere/references/x.md)',
    );
    expect(paths.filter((path) => path.includes('elsewhere'))).toEqual([]);
  });

  it("projects a skill whose files link no sibling as its adapter's files alone, the body unchanged", () => {
    const { byPath, paths, sharedReferences } = projected(userValue, harness().seams);
    expect(paths).toEqual(
      [
        'skills/oak-user-value/SKILL.md',
        'skills/oak-user-value/references/value-model.md',
      ].toSorted(alphabetical),
    );
    expect(byPath.get('skills/oak-user-value/SKILL.md')).toContain(
      '[its references](references/value-model.md)',
    );
    expect(byPath.get('skills/oak-user-value/references/value-model.md')).toBe('# Value model\n');
    expect(sharedReferences).toEqual([]);
  });
});
