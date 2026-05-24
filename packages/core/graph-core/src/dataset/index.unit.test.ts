/**
 * Unit tests for the RDF/JS-aligned DatasetCore surface.
 */

import { describe, expect, it } from 'vitest';

import { createDataset, type DatasetCore } from './index.js';
import type { Quad } from '../term/index.js';
import { literal, namedNode, quad } from '../data-factory/index.js';

const exSubject = namedNode('http://example.test/subject');
const exPredicate = namedNode('http://example.test/predicate');
const exOtherPredicate = namedNode('http://example.test/other-predicate');
const exObject = namedNode('http://example.test/object');
const exGraph = namedNode('http://example.test/graph');

describe('DatasetCore', () => {
  const firstQuad = quad(exSubject, exPredicate, exObject);
  const secondQuad = quad(exSubject, exOtherPredicate, literal('second'), exGraph);
  const structuralCopy = quad(
    namedNode('http://example.test/subject'),
    namedNode('http://example.test/predicate'),
    namedNode('http://example.test/object'),
  );

  it('starts empty and iterates over added quads', () => {
    const dataset: DatasetCore = createDataset();

    expect(dataset.size).toBe(0);
    expect([...dataset]).toEqual([]);

    dataset.add(firstQuad).add(secondQuad);

    expect(dataset.size).toBe(2);
    expect([...dataset]).toEqual([firstQuad, secondQuad]);
  });

  it('uses structural equality for add and has', () => {
    const dataset = createDataset([firstQuad]);

    dataset.add(structuralCopy);

    expect(dataset.size).toBe(1);
    expect(dataset.has(structuralCopy)).toBe(true);
  });

  it('deletes structurally matching quads', () => {
    const dataset = createDataset([firstQuad, secondQuad]);

    dataset.delete(structuralCopy);

    expect(dataset.size).toBe(1);
    expect(dataset.has(firstQuad)).toBe(false);
    expect(dataset.has(secondQuad)).toBe(true);
  });

  it('matches subject, predicate, object, and graph patterns', () => {
    const dataset = createDataset([firstQuad, secondQuad]);

    expect([...dataset.match(exSubject)]).toEqual([firstQuad, secondQuad]);
    expect([...dataset.match(null, exPredicate)]).toEqual([firstQuad]);
    expect([...dataset.match(null, null, literal('second'))]).toEqual([secondQuad]);
    expect([...dataset.match(null, null, null, exGraph)]).toEqual([secondQuad]);
  });

  it('returns an independent dataset from match', () => {
    const dataset = createDataset([firstQuad, secondQuad]);
    const matches = dataset.match(exSubject);

    matches.delete(firstQuad);

    expect(matches.size).toBe(1);
    expect(dataset.size).toBe(2);
  });

  it('keeps DatasetCore assignable to iterable Quad collections', () => {
    const dataset: Iterable<Quad> = createDataset([firstQuad]);

    expect([...dataset]).toEqual([firstQuad]);
  });
});
