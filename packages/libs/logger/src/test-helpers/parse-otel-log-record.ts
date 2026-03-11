import type { OtelLogRecord } from '../otel-format';

interface OtelLogRecordCandidate {
  Timestamp?: unknown;
  ObservedTimestamp?: unknown;
  SeverityNumber?: unknown;
  SeverityText?: unknown;
  Body?: unknown;
  Attributes?: unknown;
  Resource?: unknown;
}

function isOtelLogRecordCandidate(value: unknown): value is OtelLogRecordCandidate {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasRequiredStringFields(candidate: OtelLogRecordCandidate): boolean {
  return (
    typeof candidate.Timestamp === 'string' &&
    typeof candidate.ObservedTimestamp === 'string' &&
    typeof candidate.SeverityText === 'string' &&
    typeof candidate.Body === 'string'
  );
}

function hasRequiredNumberFields(candidate: OtelLogRecordCandidate): boolean {
  return typeof candidate.SeverityNumber === 'number';
}

function hasRequiredObjectFields(candidate: OtelLogRecordCandidate): boolean {
  return (
    typeof candidate.Attributes === 'object' &&
    candidate.Attributes !== null &&
    typeof candidate.Resource === 'object' &&
    candidate.Resource !== null
  );
}

function isOtelLogRecord(value: unknown): value is OtelLogRecord {
  if (!isOtelLogRecordCandidate(value)) {
    return false;
  }
  return (
    hasRequiredStringFields(value) &&
    hasRequiredNumberFields(value) &&
    hasRequiredObjectFields(value)
  );
}

/**
 * Parse one JSON log line into a validated OTel log record.
 *
 * @param line - Single JSON log line (optionally newline-terminated)
 * @returns Validated OTel log record
 */
export function parseOtelLogRecord(line: string): OtelLogRecord {
  const parsed: unknown = JSON.parse(line);
  if (!isOtelLogRecord(parsed)) {
    throw new Error('Invalid OTel log record payload');
  }
  return parsed;
}
