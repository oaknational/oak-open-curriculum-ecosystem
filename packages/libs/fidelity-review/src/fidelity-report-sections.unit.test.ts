import { describe, expect, it } from 'vitest';

import type { PairingMap } from './pairing-types';
import type { FidelityRegister } from './register';
import { exemptSection, globalEntriesSection, orphanedEntries } from './fidelity-report-sections';

const REGISTER = {
  version: 1,
  entries: [
    {
      id: 'picker-oak-fold/known-divergence',
      pairId: 'picker-oak-fold',
      kind: 'feature',
      summary: 'A recorded pair judgment.',
      evidence: ['demo-evidence/live-picker-oak-fold.png'],
      disposition: 'deliberate',
      rationale: 'Ratified.',
      author: 'design-lane',
      date: '2026-08-09',
    },
    {
      id: 'global/token-source-convergence',
      pairId: 'global',
      kind: 'visual',
      summary: 'Applies to every pair.',
      evidence: ['demo-evidence/live-picker-oak-fold.png'],
      disposition: 'deliberate',
      rationale: 'Ratified (ADR-213).',
      author: 'design-lane',
      date: '2026-08-09',
    },
    {
      id: 'gone-pair/old-finding',
      pairId: 'gone-pair',
      kind: 'visual',
      summary: 'Entry whose pair no longer exists.',
      evidence: ['demo-evidence/old.png'],
      disposition: 'matched',
      rationale: 'From an earlier export.',
      author: 'design-lane',
      date: '2026-08-01',
    },
  ],
} satisfies FidelityRegister;

const EMPTY_REGISTER = { version: 1, entries: [] } satisfies FidelityRegister;

describe('globalEntriesSection', () => {
  it('renders only the global-scope judgments, with their evidence linked report-relative', () => {
    const html = globalEntriesSection(REGISTER);

    expect(html).toContain('global/token-source-convergence');
    expect(html).toContain('href="../../demo-evidence/live-picker-oak-fold.png"');
    expect(html).not.toContain('picker-oak-fold/known-divergence');
  });

  it('renders nothing when no global judgment exists', () => {
    expect(globalEntriesSection(EMPTY_REGISTER)).toBe('');
  });
});

describe('orphanedEntries', () => {
  it('lists entries whose pair is gone, excluding the global scope', () => {
    const html = orphanedEntries(new Set(['picker-oak-fold']), REGISTER);

    expect(html).toContain('gone-pair/old-finding');
    expect(html).toContain('superseded');
    expect(html).not.toContain('global/token-source-convergence');
  });

  it('renders nothing when every entry has a live pair', () => {
    expect(orphanedEntries(new Set(['picker-oak-fold', 'gone-pair']), REGISTER)).toBe('');
  });
});

describe('exemptSection', () => {
  it('lists every exempt surface with its reason', () => {
    const map = {
      exemptSurfaces: [{ route: '/', reason: 'no export target ships for this route' }],
    } satisfies PairingMap;

    const html = exemptSection(map);

    expect(html).toContain('<code>/</code>');
    expect(html).toContain('no export target ships for this route');
  });
});
