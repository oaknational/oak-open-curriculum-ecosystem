import { describe, expect, it } from 'vitest';

import {
  COMMS_EVENT_TAG_NAMESPACE,
  validateCommsEventTags,
} from '../../src/collaboration-state/comms-tag-namespace';

describe('comms event tag namespace (ADR-183)', () => {
  it('exposes the canonical namespace as a frozen tuple', () => {
    expect(COMMS_EVENT_TAG_NAMESPACE).toStrictEqual([
      'failure-mode',
      'behaviour-note',
      'heartbeat',
    ]);
    expect(Object.isFrozen(COMMS_EVENT_TAG_NAMESPACE)).toBe(true);
  });

  it('accepts every canonical tag', () => {
    expect(validateCommsEventTags(['failure-mode'])).toStrictEqual(['failure-mode']);
    expect(validateCommsEventTags(['behaviour-note'])).toStrictEqual(['behaviour-note']);
    expect(validateCommsEventTags(['heartbeat'])).toStrictEqual(['heartbeat']);
  });

  it('accepts multiple canonical tags in one call', () => {
    expect(validateCommsEventTags(['failure-mode', 'heartbeat'])).toStrictEqual([
      'failure-mode',
      'heartbeat',
    ]);
  });

  it('accepts an empty list', () => {
    expect(validateCommsEventTags([])).toStrictEqual([]);
  });

  it('rejects an unknown tag and names the offender + the canonical namespace', () => {
    expect(() => validateCommsEventTags(['mystery'])).toThrow(
      /unknown comms event tag: 'mystery'.*failure-mode.*behaviour-note.*heartbeat/,
    );
  });

  it('rejects an empty-string tag (whitespace is not a tag)', () => {
    expect(() => validateCommsEventTags([''])).toThrow(/unknown comms event tag: ''/);
  });

  it('rejects duplicate tags (each tag belongs at most once on an event)', () => {
    expect(() => validateCommsEventTags(['heartbeat', 'heartbeat'])).toThrow(
      /duplicate comms event tag: 'heartbeat'/,
    );
  });
});
