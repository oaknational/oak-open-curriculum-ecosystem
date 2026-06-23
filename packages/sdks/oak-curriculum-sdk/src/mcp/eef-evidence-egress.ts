/**
 * EGRESS MEMBRANE (ADR-193) for `get-eef-evidence`.
 *
 * Everything in `aggregated-eef-evidence.ts` above this seam is strict EEF
 * DOMAIN code: exact types derived from the fixed `as const` corpus, no
 * `unknown`/`Record`/index-signature/`as`. This module is the single seam
 * where that strict result crosses into the MCP vendor TRANSPORT type.
 * Everything that consumes its output (the executor, the auth layer,
 * registration) is vendor-facing transport whose currency is the SDK's
 * `CallToolResult`.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import type { EefEvidenceResult } from './aggregated-eef-evidence.js';
import { GET_EEF_EVIDENCE_TOOL_DEF } from './aggregated-eef-evidence.js';
import { formatToolResponse } from './universal-tool-shared.js';

/**
 * Cross the strict {@link EefEvidenceResult} produced by
 * `runEefEvidenceTool` into the vendor's `CallToolResult`.
 *
 * On success the membrane delegates to {@link formatToolResponse} — the
 * single family formatter — emitting the dual shape (the domain module's
 * header carries the rationale and supersession record). The envelope
 * crosses into its `data: unknown` parameter: the one erasure as the strict
 * value crosses out (no `as`, no index signature, no `any`); the unit tests
 * pin the envelope's key set so the decoration spread can never silently
 * clobber a future envelope key. `isError` results pass through unchanged;
 * beyond this function the value is the vendor's (ADR-191).
 */
export function eefEvidenceToCallToolResult(result: EefEvidenceResult): CallToolResult {
  if (result.isError) {
    return { content: result.content, isError: true };
  }
  return formatToolResponse({
    summary: result.summary,
    data: result.envelope,
    status: 'success',
    toolName: 'get-eef-evidence',
    annotationsTitle: GET_EEF_EVIDENCE_TOOL_DEF.title,
    timestamp: Date.now(),
  });
}
