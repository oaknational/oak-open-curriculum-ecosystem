import { describe, expect, it } from 'vitest';

import { auditCodexIdentityRecords, type CommsEvent } from '../../src/collaboration-state';
import {
  collaborationAgentIdSchema,
  collaborationAgentIdWriteSchema,
  type CollaborationCommitQueueEntry,
} from '../../src/collaboration-state/types';

const nowIso = '2026-04-28T11:05:00Z';

// Schema-parsed literal blocks (testing-strategy §Test Data Anchoring): the
// parse proves each block strict-schema-legal, which plain typed literals
// declared as separate consts cannot (no excess-property check at use sites).
const anonymousAgent = collaborationAgentIdSchema.parse({
  agent_name: 'Codex',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: 'unknown',
});

const namedAgent = collaborationAgentIdSchema.parse({
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
});

describe('auditCodexIdentityRecords', () => {
  it('reports anonymous Codex records across all four sources', () => {
    // The queue lives in the per-intent store since registry 1.4.0, so the
    // audit takes its live entries as an injected input, like comms events.
    const commitQueue: readonly CollaborationCommitQueueEntry[] = [
      {
        intent_id: 'queued-anonymous',
        claim_id: 'claim-queued',
        // Anonymity (name/prefix) is orthogonal to the PDR-076a routing
        // id: intents REQUIRE id at parse, and an anonymous seat still
        // carries one. The id-less-intent rejection is covered by
        // state-parsers.unit.test.ts.
        agent_id: collaborationAgentIdWriteSchema.parse({
          ...anonymousAgent,
          id: 'a3c81f5e-7d2b-5c49-8e16-4f0a9d3b7c25',
        }),
        files: ['.agent/plans/example.md'],
        commit_subject: 'docs(agent): anonymous queue',
        queued_at: '2026-04-28T11:00:00Z',
        updated_at: '2026-04-28T11:00:00Z',
        expires_at: '2026-04-28T11:15:00Z',
        phase: 'queued',
        queued_seq: 0,
      },
    ];
    const activeText = JSON.stringify(
      {
        schema_version: '1.4.0',
        claims: [
          {
            claim_id: 'fresh-active-anonymous',
            agent_id: anonymousAgent,
            thread: 'agentic-engineering-enhancements',
            areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/active-claims.json'] }],
            claimed_at: '2026-04-28T11:00:00Z',
            freshness_seconds: 900,
            sidebar_open: false,
            intent: 'Fresh anonymous state.',
          },
          {
            claim_id: 'stale-active-anonymous',
            agent_id: anonymousAgent,
            thread: 'agentic-engineering-enhancements',
            areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/active-claims.json'] }],
            claimed_at: '2026-04-28T10:00:00Z',
            freshness_seconds: 900,
            sidebar_open: false,
            intent: 'Stale anonymous state.',
          },
        ],
      },
      null,
      2,
    );
    const closedText = JSON.stringify(
      {
        schema_version: '1.3.0',
        claims: [
          {
            claim_id: 'closed-anonymous',
            agent_id: anonymousAgent,
            thread: 'agentic-engineering-enhancements',
            areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/closed.json'] }],
            claimed_at: '2026-04-28T08:00:00Z',
            freshness_seconds: 900,
            intent: 'Closed anonymous state.',
            archived_at: '2026-04-28',
          },
        ],
      },
      null,
      2,
    );
    const threadRecordText = [
      '# Next-Session Record',
      '',
      '**Last refreshed**: 2026-04-28 (Codex / codex / GPT-5 / unknown — current row.)',
      '',
      '**Prior refresh**: 2026-04-28 (Codex / codex / GPT-5 / unknown — old row.)',
      '',
    ].join('\n');
    // Comms events are audited from the event stream (the source of truth),
    // never from the rendered shared log (a generated read model whose
    // heading field carries the render-time display token). Coverage is the
    // author block on narrative/lifecycle events and the from block on
    // directed messages; to blocks are address relays built from --to-*
    // flags and evidence what the SENDER knew, so they are never audited.
    const commsEvents: readonly CommsEvent[] = [
      {
        schema_version: '2.0.0',
        event_id: 'anon-narrative-event',
        created_at: '2026-04-28T09:00:00Z',
        kind: 'narrative',
        author: anonymousAgent,
        title: 'old event',
        body: 'Anonymous historical event.',
      },
      {
        schema_version: '2.0.0',
        event_id: 'anon-lifecycle-event',
        created_at: '2026-04-28T09:02:00Z',
        kind: 'lifecycle',
        event_type: 'claim_lifecycle',
        occurred_at: '2026-04-28T09:02:00Z',
        author: anonymousAgent,
        // Discriminating fixture: agent_id differs from author so the test
        // fails if the audit reads the wrong lifecycle identity field.
        agent_id: namedAgent,
        thread: 'agentic-engineering-enhancements',
        claim_id: 'claim-anon',
        title: 'anonymous lifecycle',
        subject: 'anonymous lifecycle subject',
        body: 'Anonymous lifecycle body.',
      },
      {
        schema_version: '2.0.0',
        event_id: 'anon-from-directed',
        created_at: '2026-04-28T09:05:00Z',
        kind: 'directed',
        message_kind: 'coordination-update',
        from: anonymousAgent,
        to: namedAgent,
        subject: 'anonymous sender',
        body: 'Directed body.',
      },
      {
        schema_version: '2.0.0',
        event_id: 'anon-subject-lifecycle',
        created_at: '2026-04-28T09:12:00Z',
        kind: 'lifecycle',
        event_type: 'claim_lifecycle',
        occurred_at: '2026-04-28T09:12:00Z',
        // The two lifecycle identity blocks are independently sourced by the
        // migration; a named author with an anonymous subject is reported
        // against the agent_id block alone.
        author: namedAgent,
        agent_id: anonymousAgent,
        thread: 'agentic-engineering-enhancements',
        claim_id: 'claim-anon-subject',
        title: 'anonymous subject lifecycle',
        subject: 'anonymous subject',
        body: 'Lifecycle body.',
      },
      {
        schema_version: '2.0.0',
        event_id: 'named-narrative-event',
        created_at: '2026-04-28T09:15:00Z',
        kind: 'narrative',
        author: namedAgent,
        // Relay blocks on narrative events are excluded for the same reason
        // as directed `to`: they evidence what the writer knew.
        addressed_to: anonymousAgent,
        title: 'named event',
        body: 'Named body.',
      },
    ];

    const report = auditCodexIdentityRecords({
      nowIso,
      activeText,
      closedText,
      threadRecordText,
      commsEvents,
      commitQueue,
    });

    expect(report.summary).toStrictEqual({
      total: 10,
      by_classification: {
        'historical-no-repair': 6,
        'live-risk': 2,
        'needs-evidence': 2,
      },
    });
    expect(report.findings).toMatchObject([
      {
        source: 'active',
        record_ref: 'claim:fresh-active-anonymous',
        classification: 'live-risk',
      },
      {
        source: 'active',
        record_ref: 'claim:stale-active-anonymous',
        classification: 'needs-evidence',
      },
      {
        source: 'active',
        record_ref: 'commit_queue:queued-anonymous',
        classification: 'live-risk',
      },
      {
        source: 'closed',
        record_ref: 'claim:closed-anonymous',
        classification: 'historical-no-repair',
      },
      {
        source: 'thread-record',
        record_ref: 'Last refreshed',
        classification: 'needs-evidence',
      },
      {
        source: 'thread-record',
        record_ref: 'Prior refresh',
        classification: 'historical-no-repair',
      },
      {
        source: 'comms-event',
        record_ref: 'event:anon-narrative-event#author',
        classification: 'historical-no-repair',
      },
      {
        source: 'comms-event',
        record_ref: 'event:anon-lifecycle-event#author',
        classification: 'historical-no-repair',
      },
      {
        source: 'comms-event',
        record_ref: 'event:anon-from-directed#from',
        classification: 'historical-no-repair',
      },
      {
        source: 'comms-event',
        record_ref: 'event:anon-subject-lifecycle#agent_id',
        classification: 'historical-no-repair',
      },
    ]);
  });

  it('does not report an anonymous addressee on a directed message', () => {
    const report = auditCodexIdentityRecords({
      nowIso,
      activeText: JSON.stringify({ schema_version: '1.4.0', claims: [] }),
      closedText: JSON.stringify({ schema_version: '1.3.0', claims: [] }),
      threadRecordText: '',
      commitQueue: [],
      commsEvents: [
        {
          schema_version: '2.0.0',
          event_id: 'anon-to-directed',
          created_at: '2026-04-28T09:10:00Z',
          kind: 'directed',
          message_kind: 'coordination-update',
          from: namedAgent,
          to: anonymousAgent,
          subject: 'named sender to anonymous address',
          body: 'Directed body.',
        },
      ],
    });

    expect(report.findings).toStrictEqual([]);
  });

  it('throws at parse on a legacy flat-queue registry text instead of auditing it', () => {
    // The runtime readers migrate a legacy 1.3.0 file BEFORE any audit sees
    // it; text that still carries the flat queue reaching this pure audit is
    // therefore a wiring defect, and the version pin fails it loudly. The
    // id-less-intent rejection now lives at the per-intent store boundary
    // (state-parsers.unit.test.ts pins it on parseCommitQueueIntentText).
    const activeText = JSON.stringify({
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [],
    });

    expect(() =>
      auditCodexIdentityRecords({
        nowIso,
        activeText,
        closedText: JSON.stringify({ schema_version: '1.3.0', claims: [] }),
        threadRecordText: '',
        commitQueue: [],
        commsEvents: [],
      }),
    ).toThrow('active claims registry must use schema_version 1.4.0');
  });
});
