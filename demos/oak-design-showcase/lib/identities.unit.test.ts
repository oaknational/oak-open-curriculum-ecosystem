import { typeSafeKeys, typeSafeValues } from '@oaknational/type-helpers';
import { describe, expect, it } from 'vitest';

import { IDENTITIES } from '../components/useIdentity';

import { targetFragmentsFor } from './identities';

describe('targetFragmentsFor on the live identity list', () => {
  const result = targetFragmentsFor(IDENTITIES);

  it('maps every live identity to a target-state fragment', () => {
    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      expect(typeSafeKeys(result.value)).toHaveLength(IDENTITIES.length);
      expect(typeSafeValues(result.value).toSorted((a, b) => a.localeCompare(b))).toStrictEqual([
        'emc2',
        'oak',
        'pds',
      ]);
    }
  });

  it('names each identity by its fragment, which differs from the slug for creature', () => {
    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      expect(result.value.oak).toBe('oak');
      expect(result.value.pds).toBe('pds');
      expect(result.value.creature).toBe('emc2');
    }
  });
});

describe('targetFragmentsFor on synthetic lists', () => {
  it('fails loud on a slug with no fragment row — a later addition must not be silently unnamed', () => {
    const result = targetFragmentsFor(['oak', 'aurora']);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("'aurora'");
    }
  });

  it('reports every unknown slug, not just the first', () => {
    const result = targetFragmentsFor(['aurora', 'borealis']);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("'aurora'");
      expect(result.error).toContain("'borealis'");
    }
  });

  it('accepts a subset of the roster', () => {
    const result = targetFragmentsFor(['oak']);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(typeSafeKeys(result.value)).toStrictEqual(['oak']);
    }
  });
});
