import { describe, expect, it } from 'vitest';

import {
  type EventView,
  formatWatcherEventHeader,
} from '../../src/collaboration-state/comms-relevant-events';

describe('formatWatcherEventHeader', () => {
  it('renders broadcast view without tags when tags is undefined', () => {
    expect(formatWatcherEventHeader('broadcast', undefined)).toBe('--- NEW [BROADCAST] EVENT ---');
  });

  it('renders group view without tags when tags is undefined', () => {
    expect(formatWatcherEventHeader('group', undefined)).toBe('--- NEW [GROUP] EVENT ---');
  });

  it('renders directed view without tags when tags is undefined', () => {
    expect(formatWatcherEventHeader('directed', undefined)).toBe('--- NEW [DIRECTED] EVENT ---');
  });

  it('renders lifecycle view without tags when tags is undefined', () => {
    expect(formatWatcherEventHeader('lifecycle', undefined)).toBe('--- NEW [LIFECYCLE] EVENT ---');
  });

  it('renders an empty tags array identically to undefined tags', () => {
    expect(formatWatcherEventHeader('broadcast', [])).toBe('--- NEW [BROADCAST] EVENT ---');
  });

  it('renders a single failure-mode tag on a broadcast event', () => {
    expect(formatWatcherEventHeader('broadcast', ['failure-mode'])).toBe(
      '--- NEW [BROADCAST] [FAILURE-MODE] EVENT ---',
    );
  });

  it('renders a single behaviour-note tag on a directed event', () => {
    expect(formatWatcherEventHeader('directed', ['behaviour-note'])).toBe(
      '--- NEW [DIRECTED] [BEHAVIOUR-NOTE] EVENT ---',
    );
  });

  it('sorts two tags alphabetically when input is reverse-alphabetical', () => {
    expect(formatWatcherEventHeader('broadcast', ['failure-mode', 'behaviour-note'])).toBe(
      '--- NEW [BROADCAST] [BEHAVIOUR-NOTE] [FAILURE-MODE] EVENT ---',
    );
  });

  it('produces the same output for alphabetical input on a lifecycle event', () => {
    expect(formatWatcherEventHeader('lifecycle', ['behaviour-note', 'failure-mode'])).toBe(
      '--- NEW [LIFECYCLE] [BEHAVIOUR-NOTE] [FAILURE-MODE] EVENT ---',
    );
  });

  it('renders an unknown tag literally with uppercase normalisation', () => {
    expect(formatWatcherEventHeader('broadcast', ['doctrine-update'])).toBe(
      '--- NEW [BROADCAST] [DOCTRINE-UPDATE] EVENT ---',
    );
  });

  it('uppercases a mixed-case tag', () => {
    expect(formatWatcherEventHeader('directed', ['Mixed-Tag'])).toBe(
      '--- NEW [DIRECTED] [MIXED-TAG] EVENT ---',
    );
  });

  it('does not mutate the input tags array', () => {
    const tags: readonly string[] = ['failure-mode', 'behaviour-note'];
    const snapshot = [...tags];
    const view: EventView = 'broadcast';
    formatWatcherEventHeader(view, tags);
    expect([...tags]).toStrictEqual(snapshot);
  });
});
