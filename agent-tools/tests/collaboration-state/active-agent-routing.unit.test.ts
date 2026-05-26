import { afterEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  routingKeyFor,
  setLegacyFallbackWriter,
} from '../../src/collaboration-state/active-agent-routing';
import { deriveCollaborationIdentity } from '../../src/collaboration-state/identity';
import { type CollaborationAgentId } from '../../src/collaboration-state/types';

// Restore the module-level writer between tests so capture state in one
// test never leaks into the next. The setter returns a restore function
// that snapshots the previous writer; afterEach drains the per-test
// override added inside that test.
let restoreWriter: (() => void) | undefined;
afterEach(() => {
  if (restoreWriter !== undefined) {
    restoreWriter();
    restoreWriter = undefined;
  }
});

function captureWriter(): { lines: string[]; writer: (line: string) => void } {
  const lines: string[] = [];
  return {
    lines,
    writer: (line) => {
      lines.push(line);
    },
  };
}

const diagnosticPayloadSchema = z
  .object({
    event: z.literal('routing-legacy-fallback'),
    agent_name: z.string(),
    platform: z.string(),
    model: z.string(),
    session_id_prefix: z.string(),
  })
  .strict();

const legacyAgent: CollaborationAgentId = {
  agent_name: 'Foamy Charting Fjord',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e1f',
};

// Derived via the same code path the production CLI uses so the id is a
// valid UUID v5 without coupling the test to the v5 namespace constant.
const idKeyedAgent: CollaborationAgentId = deriveCollaborationIdentity({
  platform: 'codex',
  model: 'GPT-5',
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: 'Galactic Transiting Orbit',
    CODEX_THREAD_ID: '019e1867-a0a8-7c11-aae3-1bc48533a585',
  },
}).agentId;

describe('routingKeyFor — id-keyed and legacy branches', () => {
  it('returns kind: "id-keyed" when the input identity carries a UUID v5 id', () => {
    const capture = captureWriter();
    restoreWriter = setLegacyFallbackWriter(capture.writer);

    const key = routingKeyFor(idKeyedAgent);

    expect(key).toStrictEqual({
      kind: 'id-keyed',
      agent_name: idKeyedAgent.agent_name,
      id: idKeyedAgent.id,
    });
    expect(capture.lines).toStrictEqual([]);
  });

  it('returns kind: "legacy" and emits the diagnostic when the input identity lacks an id', () => {
    const capture = captureWriter();
    restoreWriter = setLegacyFallbackWriter(capture.writer);

    const key = routingKeyFor(legacyAgent);

    expect(key).toStrictEqual({
      kind: 'legacy',
      agent_name: legacyAgent.agent_name,
      session_id_prefix: legacyAgent.session_id_prefix,
    });
    expect(capture.lines).toHaveLength(1);
  });
});

describe('routingKeyFor — legacy-fallback diagnostic payload (PDR-076a Phase 3 audit signal)', () => {
  it('emits a line prefixed with [routing-legacy-fallback] when lifting a legacy identity', () => {
    const capture = captureWriter();
    restoreWriter = setLegacyFallbackWriter(capture.writer);

    routingKeyFor(legacyAgent);

    expect(capture.lines[0]).toMatch(/^\[routing-legacy-fallback] /);
  });

  it('emits a JSON payload carrying agent_name, platform, model, and session_id_prefix', () => {
    const capture = captureWriter();
    restoreWriter = setLegacyFallbackWriter(capture.writer);

    routingKeyFor(legacyAgent);

    const jsonText = capture.lines[0]?.replace(/^\[routing-legacy-fallback] /, '') ?? '{}';
    const payload = diagnosticPayloadSchema.parse(JSON.parse(jsonText));

    expect(payload).toStrictEqual({
      event: 'routing-legacy-fallback',
      agent_name: legacyAgent.agent_name,
      platform: legacyAgent.platform,
      model: legacyAgent.model,
      session_id_prefix: legacyAgent.session_id_prefix,
    });
  });

  it('emits one diagnostic per legacy lift, so audit aggregation can count distinct events', () => {
    const capture = captureWriter();
    restoreWriter = setLegacyFallbackWriter(capture.writer);

    routingKeyFor(legacyAgent);
    routingKeyFor(legacyAgent);
    routingKeyFor(idKeyedAgent);
    routingKeyFor(legacyAgent);

    expect(capture.lines).toHaveLength(3);
  });
});

describe('setLegacyFallbackWriter — DI seam', () => {
  it('returns a restore function that reverts the writer to the previous binding', () => {
    const firstCapture = captureWriter();
    const restoreFirst = setLegacyFallbackWriter(firstCapture.writer);
    const secondCapture = captureWriter();
    const restoreSecond = setLegacyFallbackWriter(secondCapture.writer);

    routingKeyFor(legacyAgent);
    expect(secondCapture.lines).toHaveLength(1);
    expect(firstCapture.lines).toStrictEqual([]);

    restoreSecond();
    routingKeyFor(legacyAgent);
    expect(firstCapture.lines).toHaveLength(1);

    restoreFirst();
  });
});
