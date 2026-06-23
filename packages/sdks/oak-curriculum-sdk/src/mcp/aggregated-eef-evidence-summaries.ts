/**
 * Deterministic one-line summary projection for EEF evidence envelopes,
 * mirroring the sibling graph tools' summary style (information only —
 * the envelope itself is the data; ADR-191). Consumed by the
 * `get-eef-evidence` dispatch sites, where `detail` is statically known.
 */

import type {
  EefEvidenceEnvelope,
  EefStrandHeadline,
} from '@oaknational/graph-corpus-sdk/eef-strands';

/** One-line human summary of an evidence envelope. */
export function summariseEefEnvelope(
  envelope: EefEvidenceEnvelope | EefEvidenceEnvelope<EefStrandHeadline>,
  detail: 'full' | 'headline',
): string {
  const members = envelope.members.length;
  const edges = envelope.edges.length;
  const frontier = envelope.frontier.length;
  return `EEF evidence (${envelope.answerType}): ${String(members)} ${detail} member strand${members === 1 ? '' : 's'}, ${String(edges)} related_strand edge${edges === 1 ? '' : 's'}, ${String(frontier)} frontier strand${frontier === 1 ? '' : 's'}.`;
}
