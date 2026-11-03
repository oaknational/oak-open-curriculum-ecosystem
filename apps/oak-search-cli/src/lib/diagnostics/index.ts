/**
 * ELSER diagnostics module: the chunk runner, its document outcomes and the
 * report built from them.
 */

export type {
  DocumentFailure,
  DocumentSuccess,
  ChunkStats,
  DiagnosticReport,
} from './elser-diagnostic-types';

export { processChunk } from './elser-diagnostic-runner';

export { buildDiagnosticReport } from './elser-diagnostic-report';
