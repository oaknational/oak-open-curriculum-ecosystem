import { describe, expect, it } from 'vitest';

import {
  detectGateExpiryDrift,
  formatGateExpiryAlert,
  formatGateExpiryDrift,
} from './plan-gate-drift.js';
import { planNodeSchema } from './plan-node-schema.js';
import { type ParsedPlanFile } from './plan-corpus-types.js';

/**
 * The fixed "today" every case pins — deliberately NOT the wall-clock
 * date, so an implementation that secretly reads a clock fails here on
 * any machine, on any day (the injection invariant held by structure).
 */
const TODAY = '2026-03-15';

/** Strictly before {@link TODAY}: drifts. */
const EXPIRED = '2026-03-14';

/**
 * Strictly after {@link TODAY}, in a later month with a SMALLER day
 * number — a discriminating fixture that fails any implementation
 * comparing day-of-month instead of whole dates.
 */
const FUTURE = '2026-04-05';

const BASE_DELIVERY = {
  id: 'fixture-lane',
  node_type: 'delivery',
  name: 'Fixture lane',
  overview: 'One-line scope.',
  status: 'sketch',
  serves: 'fixture-release',
  impact_areas: ['served-surface'],
  last_updated: '2026-07-23',
};

const RATIFIED_STAMP = {
  status: 'ratified',
  ratified_by: 'The Owner',
  ratified_date: '2026-07-23',
  ratified_where: 'decisions register D23',
};

/** Per-node-type frontmatter deltas that keep each fixture contract-valid. */
const TYPE_OVERRIDES: Record<string, Record<string, unknown>> = {
  strategic: { node_type: 'strategic', serves: 'FRAME-1', gate_expiry_default: 'P21D' },
  delivery: {},
  runbook: { node_type: 'runbook', serves: undefined },
};

function gate(expires: string, clearsWhen = 'The decision lands') {
  return { awaiting: 'owner-decision', clears_when: clearsWhen, expires };
}

/** Build a schema-valid plan fixture; a non-parsing fixture fails the test. */
function plan(path: string, overrides: Record<string, unknown>): ParsedPlanFile {
  const result = planNodeSchema.safeParse({ ...BASE_DELIVERY, ...overrides });
  if (!result.success) {
    expect.fail(`fixture '${path}' should satisfy the plan-node contract: ${result.error.message}`);
  }
  return { path, node: result.data };
}

describe('detectGateExpiryDrift — the §Owner gates drift promise', () => {
  it('reports no drift while a gate is within its horizon', () => {
    const files = [plan('delivery/future.plan.md', { owner_gates: [gate(FUTURE)] })];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([]);
  });

  it('keeps a gate live through its whole expiry day', () => {
    const files = [plan('delivery/today.plan.md', { owner_gates: [gate(TODAY)] })];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([]);
  });

  it('reports drift the day after a gate expires', () => {
    const files = [plan('delivery/expired.plan.md', { owner_gates: [gate(EXPIRED)] })];
    expect(detectGateExpiryDrift(files, TODAY)).toHaveLength(1);
  });

  it('carries the finding as data: path plus the whole expired gate', () => {
    const expired = gate(EXPIRED, 'CLEARED: row awaiting removal');
    const files = [plan('delivery/expired.plan.md', { owner_gates: [expired] })];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([
      {
        path: 'delivery/expired.plan.md',
        gate: { awaiting: 'owner-decision', clears_when: expired.clears_when, expires: EXPIRED },
      },
    ]);
  });

  it('reports only the expired gate on a plan that also carries a live one', () => {
    const files = [plan('delivery/mixed.plan.md', { owner_gates: [gate(EXPIRED), gate(FUTURE)] })];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([
      { path: 'delivery/mixed.plan.md', gate: gate(EXPIRED) },
    ]);
  });

  it('reports every expired gate on a plan that carries more than one', () => {
    const files = [
      plan('delivery/mcp-67-shape.plan.md', {
        ...RATIFIED_STAMP,
        tickets: ['MCP-67'],
        owner_gates: [gate(EXPIRED), { ...gate(EXPIRED), awaiting: 'external-input' }],
      }),
    ];
    const drifts = detectGateExpiryDrift(files, TODAY);
    expect(drifts).toHaveLength(2);
    expect(drifts.map((drift) => drift.gate.awaiting)).toEqual([
      'owner-decision',
      'external-input',
    ]);
  });

  it('reports drift on an expired gate whether the plan is sketch or ratified', () => {
    const files = [
      plan('delivery/sketch.plan.md', { owner_gates: [gate(EXPIRED)] }),
      plan('delivery/ratified.plan.md', {
        ...RATIFIED_STAMP,
        id: 'fixture-ratified',
        tickets: ['MCP-101'],
        owner_gates: [gate(EXPIRED)],
      }),
    ];
    expect(detectGateExpiryDrift(files, TODAY).map((drift) => drift.path)).toEqual([
      'delivery/sketch.plan.md',
      'delivery/ratified.plan.md',
    ]);
  });

  it.each(['strategic', 'delivery', 'runbook'])(
    'reports drift on an expired gate on a %s node — every node type drifts alike',
    (nodeType) => {
      const files = [
        plan(`${nodeType}/gated.plan.md`, {
          ...TYPE_OVERRIDES[nodeType],
          owner_gates: [gate(EXPIRED)],
        }),
      ];
      expect(detectGateExpiryDrift(files, TODAY)).toHaveLength(1);
    },
  );

  it('lets archiving a plan clear its drift — archived gates demand no decision', () => {
    const files = [
      plan('archive/done.plan.md', { status: 'archived', owner_gates: [gate(EXPIRED)] }),
    ];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([]);
  });

  it('lets superseding a plan clear its drift — replaced gates demand no decision', () => {
    const files = [
      plan('delivery/replaced.plan.md', {
        status: 'superseded',
        superseded_by: 'fixture-successor',
        owner_gates: [gate(EXPIRED)],
      }),
    ];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([]);
  });

  it('reports no drift for a plan with an empty gate list', () => {
    const files = [plan('delivery/no-gates.plan.md', { owner_gates: [] })];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([]);
  });

  it('reports no drift for a plan that declares no gates at all', () => {
    const files = [plan('delivery/gateless.plan.md', {})];
    expect(detectGateExpiryDrift(files, TODAY)).toEqual([]);
  });
});

describe('formatGateExpiryDrift — the decision-demanding report section', () => {
  it('renders nothing when there is no drift', () => {
    expect(formatGateExpiryDrift([], TODAY)).toEqual([]);
  });

  it('leads with a counted, dated header that demands the decision by name', () => {
    const lines = formatGateExpiryDrift(
      detectGateExpiryDrift(
        [
          plan('delivery/expired.plan.md', {
            owner_gates: [gate(EXPIRED), { ...gate(EXPIRED), awaiting: 'external-input' }],
          }),
        ],
        TODAY,
      ),
      TODAY,
    );
    const headerIndex = lines.findIndex((line) => line.includes('expired owner gate(s)'));
    const pathIndex = lines.findIndex((line) => line.includes('delivery/expired.plan.md'));
    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(headerIndex).toBeLessThan(pathIndex);
    const header = lines[headerIndex] ?? '';
    expect(header).toContain('2 expired owner gate(s)');
    expect(header).toContain(`as of ${TODAY}`);
    expect(header).toContain('renew, resolve, or archive');
    expect(header).toContain('discharged gate row');
  });

  it('anchors every expired gate to its own line with its awaiting, date, and context', () => {
    const joined = formatGateExpiryDrift(
      detectGateExpiryDrift(
        [
          plan('delivery/expired.plan.md', {
            owner_gates: [gate(EXPIRED), { ...gate('2026-03-13'), awaiting: 'external-input' }],
          }),
        ],
        TODAY,
      ),
      TODAY,
    ).join('\n');
    expect(joined).toContain(`awaiting 'owner-decision', expired ${EXPIRED}`);
    expect(joined).toContain("awaiting 'external-input', expired 2026-03-13");
    expect(joined).toContain('The decision lands');
  });

  it("groups each plan's expired gates under its own path", () => {
    const lines = formatGateExpiryDrift(
      detectGateExpiryDrift(
        [
          plan('delivery/first.plan.md', {
            owner_gates: [gate(EXPIRED, 'First plan decision')],
          }),
          plan('delivery/second.plan.md', {
            id: 'fixture-second',
            owner_gates: [gate(EXPIRED, 'Second plan decision')],
          }),
        ],
        TODAY,
      ),
      TODAY,
    );
    const firstPathLines = lines.filter((line) => line.includes('delivery/first.plan.md'));
    const secondPathLines = lines.filter((line) => line.includes('delivery/second.plan.md'));
    expect(firstPathLines).toHaveLength(1);
    expect(secondPathLines).toHaveLength(1);
    const firstPathIndex = lines.indexOf(firstPathLines[0] ?? '');
    const firstGateIndex = lines.findIndex((line) => line.includes('First plan decision'));
    const secondPathIndex = lines.indexOf(secondPathLines[0] ?? '');
    const secondGateIndex = lines.findIndex((line) => line.includes('Second plan decision'));
    expect(firstPathIndex).toBeLessThan(firstGateIndex);
    expect(firstGateIndex).toBeLessThan(secondPathIndex);
    expect(secondPathIndex).toBeLessThan(secondGateIndex);
  });
});

describe('formatGateExpiryAlert — the persistent non-blocking alert', () => {
  it('renders nothing when there is no drift to alert on', () => {
    expect(formatGateExpiryAlert([], TODAY)).toEqual([]);
  });

  it('carries the drift report and the standing resolution instructions together', () => {
    const joined = formatGateExpiryAlert(
      detectGateExpiryDrift(
        [plan('delivery/expired.plan.md', { owner_gates: [gate(EXPIRED)] })],
        TODAY,
      ),
      TODAY,
    ).join('\n');
    expect(joined).toContain('1 expired owner gate(s)');
    expect(joined).toContain('delivery/expired.plan.md');
    expect(joined).toContain('To instigate resolution');
    expect(joined).toContain('renew');
    expect(joined).toContain('resolve: remove the discharged gate row');
    expect(joined).toContain('archive');
    expect(joined).toContain('repeats until the gate rows change');
  });
});
