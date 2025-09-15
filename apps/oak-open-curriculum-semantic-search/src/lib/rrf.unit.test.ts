import { describe, it, expect } from 'vitest';
import { rrfFuse, type RankedId } from './rrf';

describe('rrfFuse', () => {
  it('fuses ranks with default k and produces expected scores', () => {
    const listA: RankedId[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const listB: RankedId[] = [{ id: 'b' }, { id: 'a' }, { id: '' }]; // ignored: empty id

    const scores = rrfFuse([listA, listB]);

    // Expect three unique ids; empty id is ignored
    expect(scores.size).toBe(3); // a, b, c

    const expectedA = 1 / (60 + 1) + 1 / (60 + 2); // ranks 1 and 2
    const expectedB = 1 / (60 + 2) + 1 / (60 + 1); // ranks 2 and 1
    const expectedC = 1 / (60 + 3); // rank 3 only

    const a = scores.get('a');
    const b = scores.get('b');
    const c = scores.get('c');
    if (a === undefined || b === undefined || c === undefined) {
      throw new Error('Expected fused scores for a, b, and c');
    }

    expect(a).toBeCloseTo(expectedA, 10);
    expect(b).toBeCloseTo(expectedB, 10);
    expect(c).toBeCloseTo(expectedC, 10);

    // a and b should be equal and both greater than c
    expect(a).toBeCloseTo(b, 12);
    expect(a).toBeGreaterThan(c);
    expect(b).toBeGreaterThan(c);
  });

  it('respects custom k parameter', () => {
    const list: RankedId[] = [{ id: 'x' }, { id: 'y' }]; // ranks 1 and 2

    const scores = rrfFuse([list], { k: 0 });

    const x = scores.get('x');
    const y = scores.get('y');
    if (x === undefined || y === undefined) {
      throw new Error('Expected fused scores for x and y');
    }

    expect(x).toBeCloseTo(1 / 1, 10);
    expect(y).toBeCloseTo(1 / 2, 10);
    expect(x).toBeGreaterThan(y);
  });
});
