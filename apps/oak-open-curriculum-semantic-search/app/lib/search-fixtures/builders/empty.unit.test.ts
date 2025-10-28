import { describe, expect, it } from 'vitest';
import { buildEmptyFixture } from './empty';

describe('buildEmptyFixture', () => {
  it('clears lesson results while retaining scope metadata', () => {
    const fixture = buildEmptyFixture({ scope: 'lessons', dataset: 'ks3-art' });
    expect(fixture.scope).toBe('lessons');
    expect(fixture.results).toHaveLength(0);
    expect(fixture.total).toBe(0);
    expect(fixture.timedOut).toBe(false);
  });

  it('produces empty unit fixtures with zero totals', () => {
    const fixture = buildEmptyFixture({ scope: 'units', dataset: 'ks4-maths' });
    expect(fixture.scope).toBe('units');
    expect(fixture.results).toHaveLength(0);
    expect(fixture.total).toBe(0);
  });

  it('defaults dataset per scope when omitted', () => {
    const fixture = buildEmptyFixture({ scope: 'sequences' });
    expect(fixture.scope).toBe('sequences');
    expect(fixture.results).toHaveLength(0);
  });
});
