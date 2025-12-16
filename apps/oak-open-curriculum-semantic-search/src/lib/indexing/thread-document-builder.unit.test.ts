/**
 * Unit tests for thread document builder.
 *
 * TDD approach: These tests were written FIRST to specify the desired behaviour.
 *
 */

import { describe, it, expect } from 'vitest';
import { createThreadDocument, type CreateThreadDocumentParams } from './thread-document-builder';

describe('createThreadDocument', () => {
  const baseParams: CreateThreadDocumentParams = {
    threadSlug: 'number-multiplication-and-division',
    threadTitle: 'Number: Multiplication and division',
    subjectSlugs: ['maths'],
    unitCount: 15,
  };

  it('should create a thread document with all required fields', () => {
    const doc = createThreadDocument(baseParams);

    expect(doc.thread_slug).toBe('number-multiplication-and-division');
    expect(doc.thread_title).toBe('Number: Multiplication and division');
    expect(doc.subject_slugs).toEqual(['maths']);
    expect(doc.unit_count).toBe(15);
    expect(doc.thread_url).toContain('number-multiplication-and-division');
  });

  it('should handle threads spanning multiple subjects', () => {
    const doc = createThreadDocument({
      ...baseParams,
      threadSlug: 'data-handling',
      threadTitle: 'Data Handling',
      subjectSlugs: ['maths', 'science'],
      unitCount: 8,
    });

    expect(doc.subject_slugs).toHaveLength(2);
    expect(doc.subject_slugs).toContain('maths');
    expect(doc.subject_slugs).toContain('science');
  });

  it('should handle threads with zero unit count', () => {
    const doc = createThreadDocument({
      ...baseParams,
      unitCount: 0,
    });

    expect(doc.unit_count).toBe(0);
  });

  it('should generate a valid thread URL', () => {
    const doc = createThreadDocument(baseParams);

    expect(doc.thread_url).toBe(
      'https://www.thenational.academy/teachers/curriculum/threads/number-multiplication-and-division',
    );
  });

  it('should include title_suggest with correct contexts', () => {
    const doc = createThreadDocument(baseParams);

    expect(doc.title_suggest).toBeDefined();
    expect(doc.title_suggest?.input).toContain('Number: Multiplication and division');
    expect(doc.title_suggest?.contexts).toEqual({
      subject: ['maths'],
    });
  });

  it('should include all subjects in title_suggest contexts', () => {
    const doc = createThreadDocument({
      ...baseParams,
      subjectSlugs: ['maths', 'science'],
    });

    expect(doc.title_suggest?.contexts).toEqual({
      subject: ['maths', 'science'],
    });
  });
});
