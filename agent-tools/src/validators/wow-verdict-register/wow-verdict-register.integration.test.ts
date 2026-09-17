/*
 * Integration-class: the committed live register's RAW BYTES reach the
 * boundary parser un-normalised through the owned test-helpers fixture
 * surface (a duplicate key, BOM, or trailing content in the real file is
 * caught here, where a JSON re-serialisation would silently normalise it
 * away). The committed artefact is the system under test's input — the
 * plan-schema corpus validators are the precedent.
 */
import { describe, expect, it } from 'vitest';

import { readLiveRegisterBytes } from './test-helpers/read-live-register.js';
import { parseWowVerdictRegister } from './wow-verdict-register.js';

describe('the committed live register', () => {
  it('parses against the boundary schema, byte-for-byte as committed', () => {
    const result = parseWowVerdictRegister(readLiveRegisterBytes());

    expect(result.ok ? undefined : result.error).toBeUndefined();
  });
});
