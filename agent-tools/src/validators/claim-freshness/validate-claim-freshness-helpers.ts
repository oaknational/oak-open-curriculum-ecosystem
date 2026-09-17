import { typeSafeEntries } from '@oaknational/type-helpers';

import { isJsonObject, type JsonObject } from '../../core/json.js';
import { assessPin } from './assess-pin.js';
import type {
  FreshnessIntegrityFinding,
  FreshnessMonitoringObligation,
  FreshnessNotTrackedRow,
} from './claim-freshness-types.js';

/**
 * Pure rules for the perishable-claim freshness contract (ADR-223) over the
 * hook policy's `platform_support` rows.
 *
 * Deliberately clock-free: every rule is a deterministic function of the row
 * content plus the injected per-surface ceiling, so the gate run can never be
 * reddened by time passing. Landing 1 reports the monitoring inventory;
 * landing 2 owns clock-bearing expiry, pin-drift, and enforcement.
 *
 * @packageDocumentation
 */

/** Precise partition of the registered freshness surface. */
export interface FreshnessAssessment {
  readonly integrityFindings: readonly FreshnessIntegrityFinding[];
  readonly monitoringObligations: readonly FreshnessMonitoringObligation[];
  readonly notTrackedRows: readonly FreshnessNotTrackedRow[];
}

/** The validator's verdict and report. */
export interface FreshnessOutcome {
  readonly exitCode: 0 | 1;
  readonly reportLines: readonly string[];
}

interface ResolvedDateField {
  readonly timestamp: number | null;
  readonly findings: readonly FreshnessIntegrityFinding[];
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const MS_PER_DAY = 86_400_000;

/** Strict ISO calendar-date parse: shape `YYYY-MM-DD` and a real calendar day. */
function parseIsoDateUtc(value: unknown): number | null {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return null;
  }
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(timestamp)) {
    return null;
  }
  return new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : null;
}

/** Resolve one required date field to a timestamp, or an integrity finding. */
function resolveDateField(rowKey: string, row: JsonObject, field: string): ResolvedDateField {
  const timestamp = parseIsoDateUtc(row[field]);
  if (timestamp !== null) {
    return { timestamp, findings: [] };
  }
  const reason =
    row[field] === undefined
      ? 'missing — every registered perishable claim carries this field'
      : 'not a real YYYY-MM-DD calendar date';
  return { timestamp: null, findings: [{ row: rowKey, field, reason }] };
}

/** Ordering and ceiling rules over the two resolved timestamps. */
function checkInterval(
  rowKey: string,
  groundedAt: number | null,
  reviewBy: number | null,
  maxIntervalDays: number,
): readonly FreshnessIntegrityFinding[] {
  if (groundedAt === null || reviewBy === null) {
    return [];
  }
  if (reviewBy <= groundedAt) {
    return [{ row: rowKey, field: 'review_by', reason: 'must be after grounded_at' }];
  }
  if ((reviewBy - groundedAt) / MS_PER_DAY > maxIntervalDays) {
    return [
      {
        row: rowKey,
        field: 'review_by',
        reason: `interval exceeds this surface's registered ceiling of ${String(maxIntervalDays)} days`,
      },
    ];
  }
  return [];
}

function assessRow(rowKey: string, row: JsonObject, maxIntervalDays: number): FreshnessAssessment {
  const groundedAt = resolveDateField(rowKey, row, 'grounded_at');
  const reviewBy = resolveDateField(rowKey, row, 'review_by');
  const pin = assessPin(rowKey, row);
  const integrityFindings = [
    ...groundedAt.findings,
    ...reviewBy.findings,
    ...checkInterval(rowKey, groundedAt.timestamp, reviewBy.timestamp, maxIntervalDays),
    ...pin.integrityFindings,
  ];

  if (integrityFindings.length > 0) {
    return { integrityFindings, monitoringObligations: [], notTrackedRows: [] };
  }
  return {
    integrityFindings: [],
    monitoringObligations: pin.monitoringObligation === undefined ? [] : [pin.monitoringObligation],
    notTrackedRows: pin.notTrackedRow === undefined ? [] : [pin.notTrackedRow],
  };
}

/** Evaluate every `platform_support` row against the freshness contract. */
export function assessFreshnessRows(
  platformSupport: unknown,
  maxIntervalDays: number,
): FreshnessAssessment {
  if (!isJsonObject(platformSupport)) {
    return {
      integrityFindings: [
        { row: 'platform_support', reason: 'platform_support is missing or not an object' },
      ],
      monitoringObligations: [],
      notTrackedRows: [],
    };
  }

  return typeSafeEntries(platformSupport).reduce<FreshnessAssessment>(
    (assessment, [rowKey, row]) => {
      const rowAssessment = isJsonObject(row)
        ? assessRow(rowKey, row, maxIntervalDays)
        : {
            integrityFindings: [{ row: rowKey, reason: 'row is not an object' }],
            monitoringObligations: [],
            notTrackedRows: [],
          };
      return {
        integrityFindings: [...assessment.integrityFindings, ...rowAssessment.integrityFindings],
        monitoringObligations: [
          ...assessment.monitoringObligations,
          ...rowAssessment.monitoringObligations,
        ],
        notTrackedRows: [...assessment.notTrackedRows, ...rowAssessment.notTrackedRows],
      };
    },
    { integrityFindings: [], monitoringObligations: [], notTrackedRows: [] },
  );
}

/** Map a freshness assessment to an integrity verdict plus staged inventory report. */
export function decideFreshnessOutcome(assessment: FreshnessAssessment): FreshnessOutcome {
  if (assessment.integrityFindings.length > 0) {
    return {
      exitCode: 1,
      reportLines: assessment.integrityFindings.map((finding) => {
        const findingPath =
          finding.field === undefined ? finding.row : `${finding.row}.${finding.field}`;
        return `  ${findingPath}: ${finding.reason}`;
      }),
    };
  }

  const obligationHeader = `${String(assessment.monitoringObligations.length)} monitoring obligations`;
  const notTrackedHeader = `${String(assessment.notTrackedRows.length)} declared not-tracked rows`;
  return {
    exitCode: 0,
    reportLines: [
      `claim-freshness inventory: ${obligationHeader}`,
      ...assessment.monitoringObligations.map(
        (obligation) => `  ${obligation.row}: pinned to ${obligation.pinnedVersion}`,
      ),
      `claim-freshness inventory: ${notTrackedHeader}`,
      ...assessment.notTrackedRows.map((row) => `  ${row.row}: ${row.reason}`),
      'claim-freshness inventory: report-only in landing 1; SessionStart enforcement arrives in landing 2',
    ],
  };
}
