import Ajv from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

import localCommsEventSchema from '../../src/collaboration-state/schemas/comms-event.schema.json';
import { loadWireContractText, negotiateWireFamily } from '../../src/protocol-wire/contract.js';
import { type WireContract } from '../../src/protocol-wire/types.js';
import { validateWireValue } from '../../src/protocol-wire/validate.js';
import wireContractDocument from './inter-practice-wire.fixture.json';

// Schema-complete, no-IO fixture for the pure validator tests. The protocol
// wire smoke binds the real core-carried contract to these same invariants.
const REAL_CONTRACT_TEXT = JSON.stringify(wireContractDocument);

function realContract(): WireContract {
  const loaded = loadWireContractText(REAL_CONTRACT_TEXT);
  if (!loaded.ok) {
    throw new Error(`real wire contract failed to load: ${loaded.error}`);
  }
  return loaded.value;
}

// Clearly-fake wire payloads mirroring the live shapes.
function minimalExchangeEvent(): { [key: string]: unknown } {
  return {
    schema_version: '2.0.0',
    event_id: '00000000-0000-0000-0000-00000000fake',
    created_at: '2026-01-01T00:00:00Z',
    kind: 'narrative',
    author: {
      agent_name: 'Fixture Testing Fixture',
      platform: 'claude',
      model: 'fixture-model',
      session_id_prefix: 'fake00',
    },
    title: 'fixture title',
    body: 'fixture body',
  };
}

describe('loadWireContractText', () => {
  it('loads the real core-carried contract with its version and family', () => {
    const contract = realContract();
    expect(contract.version).toBe('1.0.0');
    expect(contract.family).toBe('1');
  });

  it('refuses malformed JSON loudly', () => {
    const result = loadWireContractText('{ not json');
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('unreadable');
  });

  it('refuses a document that declares no version', () => {
    const result = loadWireContractText(JSON.stringify({ $defs: {} }));
    expect(result.ok).toBe(false);
  });
});

describe('negotiateWireFamily', () => {
  it('agrees on the shared family across minors', () => {
    const result = negotiateWireFamily('1.0.0', '1.4.2');
    expect(result).toEqual({ ok: true, value: '1' });
  });

  it('refuses cross-family contact with a typed refusal naming both versions', () => {
    const result = negotiateWireFamily('1.0.0', '2.0.0');
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('1.0.0');
    expect(result.error).toContain('2.0.0');
    expect(result.error).toContain('cross-family');
  });

  it('refuses negotiation when a version carries no family component (fail-fast)', () => {
    const result = negotiateWireFamily('', '1.0.0');
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('versionless');
  });

  it('refuses a non-numeric MAJOR as malformed, distinct from cross-family', () => {
    const result = negotiateWireFamily('v1.0.0', '1.0.0');
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('malformed');
    expect(result.error).not.toContain('cross-family');
  });

  it('normalises a zero-padded MAJOR so 01.x and 1.x agree', () => {
    expect(negotiateWireFamily('01.0.0', '1.4.0')).toEqual({ ok: true, value: '1' });
  });
});

describe('validateWireValue against the real contract', () => {
  it('accepts a minimal exchange event carrying exactly the required fields', () => {
    expect(
      validateWireValue(realContract(), 'exchange_comms_event', minimalExchangeEvent()),
    ).toEqual({ ok: true, value: undefined });
  });

  it('tolerates unknown fields — the additive-optional forward-compat leg', () => {
    const newer = { ...minimalExchangeEvent(), mood: 'hypothetical-future-optional-field' };
    expect(validateWireValue(realContract(), 'exchange_comms_event', newer)).toEqual({
      ok: true,
      value: undefined,
    });
  });

  it("tolerates identity-nested local extras — the clause-5 promise, the founding refusal's exact site", () => {
    const event = minimalExchangeEvent();
    const author = event['author'];
    if (author === null || typeof author !== 'object') {
      throw new Error('fixture author missing');
    }
    event['author'] = {
      ...author,
      id: '00000000-0000-5000-8000-00000000fake',
      naming_schema_version: 'v2-noun-verb-noun',
    };
    expect(validateWireValue(realContract(), 'exchange_comms_event', event).ok).toBe(true);
  });

  it('refuses an exchange event missing a required field, naming it', () => {
    const broken = minimalExchangeEvent();
    delete broken['title'];
    const result = validateWireValue(realContract(), 'exchange_comms_event', broken);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('title');
  });

  it('names every violated site, not just the first (the allErrors contract)', () => {
    const broken = minimalExchangeEvent();
    delete broken['title'];
    delete broken['body'];
    const result = validateWireValue(realContract(), 'exchange_comms_event', broken);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('title');
    expect(result.error).toContain('body');
  });

  it('refuses an identity without the join key', () => {
    const event = minimalExchangeEvent();
    event['author'] = { agent_name: 'Fixture', platform: 'claude', model: 'fixture-model' };
    const result = validateWireValue(realContract(), 'exchange_comms_event', event);
    expect(result.ok).toBe(false);
  });

  it('accepts a heartbeat mirroring the live watcher shape', () => {
    const heartbeat = {
      schema_version: '0.2.0',
      watched_comms_dir: '/coordination/.agent/state/collaboration/comms',
      pid: 424242,
      started_at: '2026-01-01T00:00:00Z',
      last_drain_at: '2026-01-01T00:01:00Z',
      last_emit_at: null,
      last_error_at: null,
      emitted_count: 3,
      heartbeat_interval_ms: 30000,
      watcher_identity: {
        agent_name: 'Fixture Testing Fixture',
        platform: 'claude',
        model: 'fixture-model',
        session_id_prefix: 'fake00',
        id: '00000000-0000-5000-8000-00000000fake',
      },
    };
    expect(validateWireValue(realContract(), 'watcher_heartbeat', heartbeat)).toEqual({
      ok: true,
      value: undefined,
    });
  });

  it('refuses a heartbeat whose pid is not a number', () => {
    const heartbeat = {
      schema_version: '0.2.0',
      watched_comms_dir: '/coordination/.agent/state/collaboration/comms',
      pid: '42',
      started_at: '2026-01-01T00:00:00Z',
      watcher_identity: minimalExchangeEvent()['author'],
    };
    expect(validateWireValue(realContract(), 'watcher_heartbeat', heartbeat).ok).toBe(false);
  });

  it('refuses a heartbeat missing the watcher identity (the join is load-bearing)', () => {
    const heartbeat = {
      schema_version: '0.2.0',
      watched_comms_dir: '/coordination/.agent/state/collaboration/comms',
      pid: 424242,
      started_at: '2026-01-01T00:00:00Z',
    };
    expect(validateWireValue(realContract(), 'watcher_heartbeat', heartbeat).ok).toBe(false);
  });

  it('accepts an older wire heartbeat without the additive watched comms source', () => {
    const heartbeat = {
      schema_version: '0.1.0',
      pid: 424242,
      started_at: '2026-01-01T00:00:00Z',
      watcher_identity: minimalExchangeEvent()['author'],
    };
    expect(validateWireValue(realContract(), 'watcher_heartbeat', heartbeat)).toEqual({
      ok: true,
      value: undefined,
    });
  });

  it('refuses a heartbeat whose watched comms source is relative', () => {
    const heartbeat = {
      schema_version: '0.2.0',
      watched_comms_dir: 'relative/comms',
      pid: 424242,
      started_at: '2026-01-01T00:00:00Z',
      watcher_identity: minimalExchangeEvent()['author'],
    };
    expect(validateWireValue(realContract(), 'watcher_heartbeat', heartbeat).ok).toBe(false);
  });

  it('refuses an identity with an empty-string join key (minLength holds on the wire)', () => {
    const identity = {
      agent_name: 'Fixture Testing Fixture',
      platform: 'claude',
      model: 'fixture-model',
      session_id_prefix: '',
    };
    expect(validateWireValue(realContract(), 'wire_identity', identity).ok).toBe(false);
  });

  it('accepts a repo_ref with an origin and refuses one without', () => {
    expect(
      validateWireValue(realContract(), 'claim_repo_ref', {
        origin: 'github.com/fixture-org/fixture-repo',
      }).ok,
    ).toBe(true);
    expect(validateWireValue(realContract(), 'claim_repo_ref', {}).ok).toBe(false);
  });

  it('tolerates unknown fields on repo_ref, heartbeat, and identity — forward compat holds per shape', () => {
    const contract = realContract();
    expect(
      validateWireValue(contract, 'claim_repo_ref', {
        origin: 'github.com/fixture-org/fixture-repo',
        future_optional: 'tolerated',
      }).ok,
    ).toBe(true);
    expect(
      validateWireValue(contract, 'watcher_heartbeat', {
        schema_version: '0.2.0',
        watched_comms_dir: '/coordination/.agent/state/collaboration/comms',
        pid: 424242,
        started_at: '2026-01-01T00:00:00Z',
        watcher_identity: minimalExchangeEvent()['author'],
        future_optional: 'tolerated',
      }).ok,
    ).toBe(true);
    expect(
      validateWireValue(contract, 'wire_identity', {
        agent_name: 'Fixture Testing Fixture',
        platform: 'claude',
        model: 'fixture-model',
        session_id_prefix: 'fake00',
        future_optional: 'tolerated',
      }).ok,
    ).toBe(true);
  });

  it('accepts a seen-file of newline-delimited id tokens — UUIDs and slugs, LF or CRLF, per the event_id grammar', () => {
    const uuidLines =
      '00000000-0000-4000-8000-00000000fake\n00000000-0000-4000-8000-0000000fake2\n';
    expect(validateWireValue(realContract(), 'watcher_seen_file', uuidLines).ok).toBe(true);
    expect(
      validateWireValue(realContract(), 'watcher_seen_file', 'fixture-slug-handoff-0001\n').ok,
    ).toBe(true);
    expect(
      validateWireValue(
        realContract(),
        'watcher_seen_file',
        '00000000-0000-4000-8000-00000000fake\r\nfixture-slug-0002\r\n',
      ).ok,
    ).toBe(true);
  });

  it('accepts an empty seen-file and a final token without a trailing newline; refuses intra-line whitespace and blank lines', () => {
    expect(validateWireValue(realContract(), 'watcher_seen_file', '').ok).toBe(true);
    expect(validateWireValue(realContract(), 'watcher_seen_file', 'fixture-slug-0003').ok).toBe(
      true,
    );
    expect(validateWireValue(realContract(), 'watcher_seen_file', 'two tokens\n').ok).toBe(false);
    expect(
      validateWireValue(
        realContract(),
        'watcher_seen_file',
        '00000000-0000-4000-8000-00000000fake\n\n',
      ).ok,
    ).toBe(false);
  });

  it('revalidates a reused contract instance correctly across shapes and outcomes', () => {
    const contract = realContract();
    expect(
      validateWireValue(contract, 'wire_identity', {
        agent_name: 'Fixture Testing Fixture',
        platform: 'claude',
        model: 'fixture-model',
        session_id_prefix: 'fake00',
      }).ok,
    ).toBe(true);
    expect(
      validateWireValue(contract, 'wire_identity', {
        agent_name: '',
        platform: 'claude',
        model: 'fixture-model',
        session_id_prefix: 'fake00',
      }).ok,
    ).toBe(false);
    expect(
      validateWireValue(contract, 'claim_repo_ref', { origin: 'github.com/fixture-org/fixture' })
        .ok,
    ).toBe(true);
  });
});

describe('version-family evolution (simulated newer minor)', () => {
  function simulatedNewerMinor(): WireContract {
    const parsed: unknown = JSON.parse(REAL_CONTRACT_TEXT);
    if (parsed === null || typeof parsed !== 'object') {
      throw new Error('real contract is not an object');
    }
    const clone: unknown = JSON.parse(JSON.stringify(parsed));
    const doc = clone;
    if (doc === null || typeof doc !== 'object') {
      throw new Error('clone failed');
    }
    const record = doc;
    Object.assign(record, { version: '1.1.0' });
    const loaded = loadWireContractText(JSON.stringify(record));
    if (!loaded.ok) {
      throw new Error(loaded.error);
    }
    return loaded.value;
  }

  it('an older-minor minimal payload stays valid under the newer minor (backward)', () => {
    expect(
      validateWireValue(simulatedNewerMinor(), 'exchange_comms_event', minimalExchangeEvent()).ok,
    ).toBe(true);
  });

  it('negotiation agrees across the simulated minors', () => {
    expect(negotiateWireFamily(realContract().version, simulatedNewerMinor().version).ok).toBe(
      true,
    );
  });
});

describe('reconciliation binding: the local strict schema honours the wire contract (no second drift surface)', () => {
  const localSchemaText = JSON.stringify(localCommsEventSchema);

  function isRecord(value: unknown): value is { [key: string]: unknown } {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function parseRecord(text: string): { [key: string]: unknown } {
    const parsed: unknown = JSON.parse(text);
    if (!isRecord(parsed)) {
      throw new Error('expected a JSON object');
    }
    return parsed;
  }

  function defOf(document: { [key: string]: unknown }, name: string): { [key: string]: unknown } {
    const defs = document['$defs'];
    if (!isRecord(defs)) {
      throw new Error('no $defs');
    }
    const def = defs[name];
    if (!isRecord(def)) {
      throw new Error(`no $def ${name}`);
    }
    return def;
  }

  function requiredOf(def: { [key: string]: unknown }): readonly string[] {
    const required = def['required'];
    if (!Array.isArray(required)) {
      throw new TypeError('no required array');
    }
    return required.filter((entry): entry is string => typeof entry === 'string');
  }

  function propertyNamesOf(def: { [key: string]: unknown }): readonly string[] {
    const properties = def['properties'];
    if (properties === null || typeof properties !== 'object') {
      throw new Error('no properties');
    }
    return Object.keys(properties);
  }

  it('required sets agree over the shared event fields (both directions)', () => {
    const wire = defOf(realContract().document, 'exchange_comms_event');
    const local = defOf(parseRecord(localSchemaText), 'narrative');
    expect([...requiredOf(wire)].sort((a, b) => a.localeCompare(b))).toEqual(
      [...requiredOf(local)].sort((a, b) => a.localeCompare(b)),
    );
  });

  it('required sets agree over the identity tuple (both directions)', () => {
    const wire = defOf(realContract().document, 'wire_identity');
    const local = defOf(parseRecord(localSchemaText), 'agent_id');
    expect([...requiredOf(wire)].sort((a, b) => a.localeCompare(b))).toEqual(
      [...requiredOf(local)].sort((a, b) => a.localeCompare(b)),
    );
  });

  it('every wire event field NAME is declared by the strict local schema (name-subset only — content constraints stay local)', () => {
    const wire = defOf(realContract().document, 'exchange_comms_event');
    const local = defOf(parseRecord(localSchemaText), 'narrative');
    const localNames = new Set(propertyNamesOf(local));
    for (const name of propertyNamesOf(wire)) {
      expect(localNames.has(name), `local schema does not declare wire field ${name}`).toBe(true);
    }
  });

  it('the reconciliation-floor event (wire-valid minimal) is accepted by the strict local narrative validator — catches type/const drift on shared required fields', () => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    const local = parseRecord(localSchemaText);
    const validateLocal = ajv.compile({ $ref: '#/$defs/narrative', $defs: local['$defs'] });
    const accepted = validateLocal(minimalExchangeEvent());
    expect(accepted, JSON.stringify(validateLocal.errors ?? [], null, 2)).toBe(true);
  });

  it('every wire identity field is declared by the strict local agent_id (forward-compat guard for identity extras)', () => {
    const wire = defOf(realContract().document, 'wire_identity');
    const local = defOf(parseRecord(localSchemaText), 'agent_id');
    const localNames = new Set(propertyNamesOf(local));
    for (const name of propertyNamesOf(wire)) {
      expect(localNames.has(name), `local agent_id does not declare wire field ${name}`).toBe(true);
    }
  });

  function expectSharedFieldCompat(name: string, wireField: unknown, localField: unknown): void {
    if (!isRecord(wireField) || !isRecord(localField)) {
      throw new Error(`field ${name} not an object on both sides`);
    }
    const wireRef = wireField['$ref'];
    const localRef = localField['$ref'];
    if (typeof wireRef === 'string' || typeof localRef === 'string') {
      // The one legal $ref pairing: the wire identity ↔ the local agent_id.
      expect(wireRef, `field ${name}: wire $ref`).toBe('#/$defs/wire_identity');
      expect(localRef, `field ${name}: local $ref`).toBe('#/$defs/agent_id');
      return;
    }
    if (typeof wireField['type'] === 'string' && typeof localField['type'] === 'string') {
      expect(wireField['type'], `field ${name}: type drift`).toBe(localField['type']);
    }
  }

  it('shared event fields agree on their JSON type or identity $ref (type drift red-gates)', () => {
    // The exchange delivery event is narrative-shaped (PDR-125 clause 7);
    // if a directed/lifecycle kind ever crosses estates, this binding gains
    // that pair too.
    const wire = defOf(realContract().document, 'exchange_comms_event');
    const local = defOf(parseRecord(localSchemaText), 'narrative');
    const wireProps = wire['properties'];
    const localProps = local['properties'];
    if (!isRecord(wireProps) || !isRecord(localProps)) {
      throw new Error('properties missing');
    }
    for (const name of propertyNamesOf(wire)) {
      expectSharedFieldCompat(name, wireProps[name], localProps[name]);
    }
  });

  it('wire-valid boundary payloads for every shared optional field are accepted by the strict local schema (the no-false-local-refusal direction)', () => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    const local = parseRecord(localSchemaText);
    const validateLocal = ajv.compile({ $ref: '#/$defs/narrative', $defs: local['$defs'] });
    const identity = {
      agent_name: 'Fixture Testing Fixture',
      platform: 'claude',
      model: 'fixture-model',
      session_id_prefix: 'fake00',
    };
    const boundary = {
      ...minimalExchangeEvent(),
      in_response_to: '00000000-0000-4000-8000-0000000fake9',
      tags: ['behaviour-note'],
      audience: [identity],
      addressed_to: identity,
    };
    expect(validateWireValue(realContract(), 'exchange_comms_event', boundary).ok).toBe(true);
    const accepted = validateLocal(boundary);
    expect(accepted, JSON.stringify(validateLocal.errors ?? [], null, 2)).toBe(true);
  });
});
