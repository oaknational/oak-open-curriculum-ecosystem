import { describe, expect, it } from 'vitest';

import { diffFactsParity, diffMatrixParity } from '../src/workspace-census/check-parity.js';
import { renderFactsArtefact } from '../src/workspace-census/facts-artefact.js';
import type { SubjectFacts } from '../src/workspace-census/facts.js';

function subjectFacts(dirPath: string, trackedFiles = 1): SubjectFacts {
  return {
    dirPath,
    publishedName: null,
    manifest: null,
    internalDependents: [],
    sourceDependencies: [],
    turboTasks: [],
    fileProfile: { trackedFiles, codeFiles: 0 },
    oakMarkers: {
      oakInDocs: 0,
      oakInSource: 0,
      cssOakVariables: 0,
      dottedOakNamespaces: 0,
      oakEnvKeys: 0,
    },
  };
}

describe('facts parity — the committed artefact must equal the canonical recomputation byte-for-byte', () => {
  it('holds green when the committed artefact is the canonical rendering of the live facts', () => {
    const live = [subjectFacts('agent-tools'), subjectFacts('scripts')];
    expect(diffFactsParity(live, renderFactsArtefact(live))).toEqual([]);
  });

  it('names a stale entry whose committed values differ from the live recomputation', () => {
    const live = [subjectFacts('agent-tools', 5)];
    const committed = renderFactsArtefact([subjectFacts('agent-tools', 4)]);
    expect(diffFactsParity(live, committed)).toEqual([
      'facts.json: entry for agent-tools is stale — run `facts` to regenerate',
    ]);
  });

  it('names a live subject the committed artefact is missing', () => {
    const live = [subjectFacts('agent-tools'), subjectFacts('scripts')];
    const committed = renderFactsArtefact([subjectFacts('agent-tools')]);
    expect(diffFactsParity(live, committed)).toEqual([
      'facts.json: no entry for subject scripts — run `facts` to regenerate',
    ]);
  });

  it('names a committed entry that matches no derived subject', () => {
    const live = [subjectFacts('agent-tools')];
    const committed = renderFactsArtefact([subjectFacts('agent-tools'), subjectFacts('retired')]);
    expect(diffFactsParity(live, committed)).toEqual([
      'facts.json: entry for retired matches no derived subject — run `facts` to regenerate',
    ]);
  });

  it('rejects a committed artefact holding duplicate entries for one subject', () => {
    const live = [subjectFacts('agent-tools')];
    const committed = renderFactsArtefact([
      subjectFacts('agent-tools', 4),
      subjectFacts('agent-tools', 1),
    ]);
    expect(diffFactsParity(live, committed)).toEqual([
      'facts.json: duplicate entry for subject agent-tools',
    ]);
  });

  it('fails on envelope-only drift even though every entry matches', () => {
    const live = [subjectFacts('agent-tools')];
    const committed = renderFactsArtefact(live).replace(
      '"schema_version": "1.0.0"',
      '"schema_version": "9.9.9"',
    );
    expect(diffFactsParity(live, committed)).toEqual([
      'facts.json: artefact bytes differ from the recomputation (envelope or entry order) — run `facts` to regenerate',
    ]);
  });

  it('fails on entry reordering even though every entry matches', () => {
    const live = [subjectFacts('agent-tools'), subjectFacts('scripts')];
    const committed = renderFactsArtefact([subjectFacts('scripts'), subjectFacts('agent-tools')]);
    expect(diffFactsParity(live, committed)).toEqual([
      'facts.json: artefact bytes differ from the recomputation (envelope or entry order) — run `facts` to regenerate',
    ]);
  });

  it('reports invalid committed JSON as a parse problem, not a crash', () => {
    const problems = diffFactsParity([subjectFacts('agent-tools')], '{not json');
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('facts.json is not valid JSON');
  });

  it('names every drift without a residue line at exactly the ten-drift bound', () => {
    const live = Array.from({ length: 10 }, (_, i) => subjectFacts(`subject-${String(i)}`, 2));
    const committed = renderFactsArtefact(
      Array.from({ length: 10 }, (_, i) => subjectFacts(`subject-${String(i)}`, 1)),
    );
    const problems = diffFactsParity(live, committed);
    expect(problems).toHaveLength(10);
    expect(problems.at(-1)).toContain('is stale');
  });

  it('truncates past ten named drifts with a residue count', () => {
    const live = Array.from({ length: 12 }, (_, i) => subjectFacts(`subject-${String(i)}`, 2));
    const committed = renderFactsArtefact(
      Array.from({ length: 12 }, (_, i) => subjectFacts(`subject-${String(i)}`, 1)),
    );
    const problems = diffFactsParity(live, committed);
    expect(problems).toHaveLength(11);
    expect(problems.at(-1)).toBe('facts.json: …and 2 further drifted entries');
  });
});

describe('matrix parity', () => {
  it('holds green when the committed matrix equals the recomputed rendering', () => {
    expect(diffMatrixParity('# matrix\n', '# matrix\n')).toEqual([]);
  });

  it('fails on any difference from the recomputed rendering', () => {
    expect(diffMatrixParity('# matrix\n', '# matrix (old)\n')).toEqual([
      'matrix.md: committed rendering differs from the recomputed one — run `render`',
    ]);
  });
});
