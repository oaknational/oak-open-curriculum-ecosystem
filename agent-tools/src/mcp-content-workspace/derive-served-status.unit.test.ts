import { describe, expect, it } from 'vitest';

import type {
  CurrentSourceTruthItem,
  RegistrationEvidence,
} from '../mcp-content-current-source/current-source-model.js';
import {
  deriveServedStatus,
  registrationSelectors,
  servedStatusLabel,
} from './derive-served-status.js';

function registration(state: 'live' | 'dormant', selector: string): RegistrationEvidence {
  return {
    rootId: 'oak-curriculum-http',
    state,
    primitive: 'resource',
    selector,
    anchorSurfaces: [],
    channels: state === 'live' ? ['resources/list.resources[]'] : [],
  };
}

function item(overrides: Partial<CurrentSourceTruthItem> = {}): CurrentSourceTruthItem {
  return {
    id: 'C001',
    authority: 'workspace',
    workspaceScope: 'in',
    source: {
      state: 'available',
      files: ['packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts'],
      evidence: { revision: 'unchanged', anchorTargetCount: 1, anchorCount: 1 },
    },
    lineage: { disposition: 'retained', baselineFile: 'a.ts' },
    registrations: [],
    ...overrides,
  };
}

describe('deriveServedStatus', () => {
  it('reports an item registered on a live surface as live', () => {
    expect(deriveServedStatus(item({ registrations: [registration('live', 'docs://a')] }))).toBe(
      'live',
    );
  });

  it('reports an item registered only on a retained-but-unregistered surface as dormant', () => {
    expect(deriveServedStatus(item({ registrations: [registration('dormant', 'docs://b')] }))).toBe(
      'dormant',
    );
  });

  it('reports an item reaching both live and dormant surfaces as mixed', () => {
    const registrations = [registration('live', 'docs://a'), registration('dormant', 'docs://b')];
    expect(deriveServedStatus(item({ registrations }))).toBe('mixed');
  });

  it('withholds a liveness claim for an item with no recorded registration binding', () => {
    expect(deriveServedStatus(item())).toBe('unbound');
  });

  it('reports an item whose source no longer exists as retired', () => {
    const retired = item({
      source: { state: 'retired', files: [] },
      lineage: { disposition: 'retired', baselineFile: 'a.ts' },
    });
    expect(deriveServedStatus(retired)).toBe('retired');
  });

  it('does not describe an unbound item as unserved', () => {
    expect(servedStatusLabel('unbound')).not.toMatch(/dormant|not served|switched off/i);
  });
});

describe('registrationSelectors', () => {
  it('lists each surface once, in a stable order', () => {
    const registrations = [
      registration('live', 'docs://b'),
      registration('dormant', 'docs://a'),
      registration('live', 'docs://b'),
    ];
    expect(registrationSelectors(registrations)).toEqual(['docs://a', 'docs://b']);
  });
});
