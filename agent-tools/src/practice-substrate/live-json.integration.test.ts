import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type InstanceTierProbe } from './instance-tier.js';
import { evaluateCollaborationJsonSurfaces } from './live-json.js';
import { collaborationAjv, validateWithAjv } from './live-json-support.js';
import {
  makeTempSubstrateRepo,
  removeTempSubstrateRepo,
} from './test-helpers/temp-substrate-repo.js';

/**
 * Characterisation of the live claim-surface contract-parser leg — written
 * before the seam consolidation and kept green through it. The failing
 * fixture is SCHEMA-VALID but PARSER-INVALID (schema_version 1.2.0 is in
 * the schema's enum; the contract parser pins 1.4.0 exactly), so the
 * expected finding can ONLY come from the contract gate — deleting the
 * gate turns this test green-to-empty, not same-finding-via-Ajv. Real
 * temp-directory IO makes this an integration test; the IO lives behind
 * the test-helpers surface (the injected-seams rule).
 */

/** Every registry here is present, so the leg never consults the probe. */
const NOTHING_IGNORED: InstanceTierProbe = ok(new Set());

describe('evaluateCollaborationJsonSurfaces contract-parser leg', () => {
  it('passes a clean estate', async () => {
    const root = await makeTempSubstrateRepo({
      activeClaims: { schema_version: '1.4.0', claims: [] },
    });
    try {
      expect(await evaluateCollaborationJsonSurfaces(root, NOTHING_IGNORED)).toStrictEqual([]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('classifies a malformed-JSON comms event as an invalid-json finding: the parser Err carries the raw SyntaxError to the classifier', async () => {
    const root = await makeTempSubstrateRepo({
      activeClaims: { schema_version: '1.4.0', claims: [] },
      commsEventFiles: { 'broken-event.json': 'not json at all' },
    });
    try {
      const findings = await evaluateCollaborationJsonSurfaces(root, NOTHING_IGNORED);
      const commsFindings = findings.filter((finding) => finding.surface === 'collaboration-comms');
      expect(commsFindings.map((finding) => finding.id)).toStrictEqual(['invalid-json']);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('classifies a JSON-valid but schema-invalid comms event as schema-incoherence, never invalid-json', async () => {
    // The discriminating pair for the classifier fold: any wrapping or
    // relabelling of the parser Err at the comms read loop collapses this
    // split (both cases would report the same id) and one of the two pins
    // reddens.
    const root = await makeTempSubstrateRepo({
      activeClaims: { schema_version: '1.4.0', claims: [] },
      commsEventFiles: { 'wrong-shape.json': JSON.stringify({ kind: 'narrative' }) },
    });
    try {
      const findings = await evaluateCollaborationJsonSurfaces(root, NOTHING_IGNORED);
      const commsFindings = findings.filter((finding) => finding.surface === 'collaboration-comms');
      expect(commsFindings.map((finding) => finding.id)).toStrictEqual(['schema-incoherence']);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('classifies a schema-valid but contract-violating registry (schema_version 1.2.0) as exactly one schema-incoherence finding from the gate', async () => {
    const root = await makeTempSubstrateRepo({
      activeClaims: { schema_version: '1.2.0', commit_queue: [], claims: [] },
    });
    try {
      // Detection-power invariant, asserted so its decay is LOUD: the schema
      // ALONE accepts this fixture (1.2.0 is in the enum) — if a future
      // schema change drops 1.2.0, Ajv starts producing the identical
      // finding and this test would silently stop detecting gate deletion.
      expect(
        validateWithAjv(
          await collaborationAjv(root),
          'active-claims.schema.json',
          'collaboration-active-claims',
          '.agent/state/collaboration/active-claims.json',
          { schema_version: '1.2.0', commit_queue: [], claims: [] },
        ),
      ).toStrictEqual([]);
      expect(await evaluateCollaborationJsonSurfaces(root, NOTHING_IGNORED)).toStrictEqual([
        {
          id: 'schema-incoherence',
          surface: 'collaboration-active-claims',
          severity: 'blocking',
          repair: 'manual-with-provenance',
          message:
            'JSON surface .agent/state/collaboration/active-claims.json does not satisfy its schema.',
          evidence: ['.agent/state/collaboration/active-claims.json'],
        },
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });
});
