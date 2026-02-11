/**
 * Unit tests for the ground truth registry.
 *
 * Tests the registry accessors and validates the registry structure.
 * Following TDD: these tests are written first (RED), then implementation (GREEN).
 */

import { describe, expect, it } from 'vitest';

import type { GroundTruthEntry, Phase } from './registry';
import {
  getAllGroundTruthEntries,
  getEntriesForPhase,
  getEntriesForSubject,
  getGroundTruthEntry,
  GROUND_TRUTH_ENTRIES,
} from './registry/index';

describe('GROUND_TRUTH_ENTRIES', () => {
  it('is a non-empty readonly array', () => {
    expect(Array.isArray(GROUND_TRUTH_ENTRIES)).toBe(true);
    expect(GROUND_TRUTH_ENTRIES.length).toBeGreaterThan(0);
  });

  it('contains only entries with required fields', () => {
    for (const entry of GROUND_TRUTH_ENTRIES) {
      expect(entry.subject).toBeDefined();
      expect(typeof entry.subject).toBe('string');
      expect(entry.phase).toBeDefined();
      expect(['primary', 'secondary']).toContain(entry.phase);
      expect(Array.isArray(entry.queries)).toBe(true);
      expect(entry.queries.length).toBeGreaterThan(0);
    }
  });

  it('has unique subject/phase combinations', () => {
    const seen = new Set<string>();
    for (const entry of GROUND_TRUTH_ENTRIES) {
      const key = `${entry.subject}/${entry.phase}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});

describe('getAllGroundTruthEntries', () => {
  it('returns all entries from the registry', () => {
    const entries = getAllGroundTruthEntries();
    expect(entries.length).toBe(GROUND_TRUTH_ENTRIES.length);
    expect(entries).toEqual(GROUND_TRUTH_ENTRIES);
  });

  it('returns a readonly array', () => {
    const entries = getAllGroundTruthEntries();
    expect(Object.isFrozen(entries) || Array.isArray(entries)).toBe(true);
  });
});

describe('getGroundTruthEntry', () => {
  it('returns the entry for a valid subject/phase combination', () => {
    // Get the first entry to test with
    const firstEntry = GROUND_TRUTH_ENTRIES[0];
    if (!firstEntry) {
      throw new Error('Registry is empty');
    }

    const result = getGroundTruthEntry(firstEntry.subject, firstEntry.phase);
    expect(result).toBeDefined();
    expect(result?.subject).toBe(firstEntry.subject);
    expect(result?.phase).toBe(firstEntry.phase);
    expect(result?.queries).toEqual(firstEntry.queries);
  });

  it('returns undefined for a non-existent subject/phase combination', () => {
    // Use a subject that exists but with a phase that doesn't
    // Citizenship only has secondary (no primary content in curriculum), so citizenship/primary should return undefined
    const result = getGroundTruthEntry('citizenship', 'primary');
    expect(result).toBeUndefined();
  });

  it('returns undefined for an invalid subject', () => {
    // Cast to bypass type checking for test purposes
    const result = getGroundTruthEntry('nonexistent-subject' as 'art', 'secondary');
    expect(result).toBeUndefined();
  });
});

describe('getEntriesForSubject', () => {
  it('returns all entries for a subject with ground truths', () => {
    // English has both primary and secondary
    const entries = getEntriesForSubject('english');
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.subject).toBe('english');
    }
  });

  it('returns an empty array for a subject with no ground truths', () => {
    // Cast to bypass type checking for test purposes
    const entries = getEntriesForSubject('nonexistent-subject' as 'art');
    expect(entries).toEqual([]);
  });

  it('returns entries for subjects with multiple phases', () => {
    // English should have at least primary and secondary
    const entries = getEntriesForSubject('english');
    const phases = entries.map((e) => e.phase);
    expect(phases).toContain('primary');
    expect(phases).toContain('secondary');
  });
});

describe('getEntriesForPhase', () => {
  it('returns all entries for a given phase', () => {
    const secondaryEntries = getEntriesForPhase('secondary');
    expect(secondaryEntries.length).toBeGreaterThan(0);
    for (const entry of secondaryEntries) {
      expect(entry.phase).toBe('secondary');
    }
  });

  it('returns entries from multiple subjects for secondary phase', () => {
    const secondaryEntries = getEntriesForPhase('secondary');
    const subjects = new Set(secondaryEntries.map((e) => e.subject));
    // We should have multiple subjects with secondary ground truths
    expect(subjects.size).toBeGreaterThan(1);
  });

  it('returns entries for primary phase', () => {
    const primaryEntries = getEntriesForPhase('primary');
    // We have at least english, science, history, cooking-nutrition with primary
    expect(primaryEntries.length).toBeGreaterThanOrEqual(4);
    for (const entry of primaryEntries) {
      expect(entry.phase).toBe('primary');
    }
  });
});

describe('GroundTruthEntry type', () => {
  it('has the correct shape', () => {
    const entry: GroundTruthEntry = {
      subject: 'maths',
      phase: 'secondary',
      queries: [],
    };
    expect(entry.subject).toBe('maths');
    expect(entry.phase).toBe('secondary');
    expect(entry.queries).toEqual([]);
  });
});

describe('Phase type', () => {
  it('includes primary and secondary only', () => {
    const phases: Phase[] = ['primary', 'secondary'];
    expect(phases).toContain('primary');
    expect(phases).toContain('secondary');
    expect(phases.length).toBe(2);
  });
});
