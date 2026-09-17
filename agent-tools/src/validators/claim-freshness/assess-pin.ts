import { typeSafeKeys } from '@oaknational/type-helpers';

import { isJsonObject, type JsonObject } from '../../core/json.js';
import type {
  FreshnessIntegrityFinding,
  FreshnessMonitoringObligation,
  FreshnessNotTrackedRow,
} from './claim-freshness-types.js';

interface PinAssessment {
  readonly integrityFindings: readonly FreshnessIntegrityFinding[];
  readonly monitoringObligation?: FreshnessMonitoringObligation;
  readonly notTrackedRow?: FreshnessNotTrackedRow;
}

const VERSION_PATTERN = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?![\s\S])/u;

function hasExactKeys(value: JsonObject, expected: readonly string[]): boolean {
  const actual = typeSafeKeys(value).sort((left, right) => left.localeCompare(right));
  const sortedExpected = [...expected].sort((left, right) => left.localeCompare(right));
  return (
    actual.length === sortedExpected.length &&
    actual.every((key, index) => key === sortedExpected[index])
  );
}

function appendPinFinding(
  integrityFindings: readonly FreshnessIntegrityFinding[],
  row: string,
  reason: string,
): PinAssessment {
  return {
    integrityFindings: [...integrityFindings, { row, field: 'pin', reason }],
  };
}

function assessPinned(
  rowKey: string,
  pin: JsonObject,
  integrityFindings: readonly FreshnessIntegrityFinding[],
): PinAssessment {
  if (
    !hasExactKeys(pin, ['kind', 'version']) ||
    typeof pin.version !== 'string' ||
    !VERSION_PATTERN.test(pin.version)
  ) {
    return appendPinFinding(
      integrityFindings,
      rowKey,
      'pinned must contain exactly kind and a bare x.y.z version',
    );
  }
  return {
    integrityFindings,
    monitoringObligation: { row: rowKey, pinnedVersion: pin.version },
  };
}

function assessNotTracked(
  rowKey: string,
  pin: JsonObject,
  integrityFindings: readonly FreshnessIntegrityFinding[],
): PinAssessment {
  if (
    !hasExactKeys(pin, ['kind', 'reason']) ||
    typeof pin.reason !== 'string' ||
    pin.reason.trim() === ''
  ) {
    return appendPinFinding(
      integrityFindings,
      rowKey,
      'not-tracked must contain exactly kind and a non-empty reason',
    );
  }
  return {
    integrityFindings,
    notTrackedRow: { row: rowKey, reason: pin.reason.trim() },
  };
}

/** Validate and classify the required closed `pin` declaration. */
export function assessPin(rowKey: string, row: JsonObject): PinAssessment {
  const integrityFindings: FreshnessIntegrityFinding[] = Object.hasOwn(row, 'pinned_to')
    ? [
        {
          row: rowKey,
          field: 'pinned_to',
          reason: 'retired — use the required closed pin declaration',
        },
      ]
    : [];
  const pin = row.pin;
  if (!isJsonObject(pin)) {
    return appendPinFinding(
      integrityFindings,
      rowKey,
      'missing or not an object — declare pinned or not-tracked',
    );
  }
  if (pin.kind === 'pinned') {
    return assessPinned(rowKey, pin, integrityFindings);
  }
  if (pin.kind === 'not-tracked') {
    return assessNotTracked(rowKey, pin, integrityFindings);
  }
  return appendPinFinding(integrityFindings, rowKey, 'kind must be pinned or not-tracked');
}
