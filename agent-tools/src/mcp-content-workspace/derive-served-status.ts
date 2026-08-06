/**
 * Live-versus-dormant derivation for one content item.
 *
 * @remarks
 * Liveness is *derived*, never authored: the MCP-101 served-surface allowlist
 * classifies every tool and resource, and the current-source projection
 * recomputes that classification by walking the HTTP registration root over an
 * in-memory MCP transport. This module reads the recomputed result rather than
 * re-parsing the allowlist, because `validate-mcp-content-current-source`
 * already guards the projection against the allowlist — a second derivation
 * here would be a second thing to keep true.
 *
 * @packageDocumentation
 */

import type {
  ProjectionItem,
  ProjectionRegistration,
  ServedStatus,
} from './content-workspace-model.js';

/**
 * Classify how an item's words reach an agent.
 *
 * @remarks
 * `unbound` is the honest answer for an item with current source but no
 * item-level registration binding — the projection's evidence ceiling states
 * that exact channel bindings currently cover the prompt-to-guidance
 * replacements and that later migration slices add the rest. Reporting such an
 * item as dormant would assert an absence the evidence does not support.
 */
export function deriveServedStatus(item: ProjectionItem): ServedStatus {
  if (item.source.state === 'retired') {
    return 'retired';
  }
  const states = new Set(item.registrations.map((registration) => registration.state));
  if (states.size === 0) {
    return 'unbound';
  }
  if (states.size > 1) {
    return 'mixed';
  }
  return states.has('live') ? 'live' : 'dormant';
}

/** The registered selectors an item's words reach, deduplicated and ordered. */
export function registrationSelectors(
  registrations: readonly ProjectionRegistration[],
): readonly string[] {
  return [...new Set(registrations.map((registration) => registration.selector))].sort(
    (left, right) => left.localeCompare(right),
  );
}

/** Reviewer-facing wording for a served status. */
export function servedStatusLabel(status: ServedStatus): string {
  switch (status) {
    case 'live': {
      return 'Live — an agent can reach these words today';
    }
    case 'dormant': {
      return 'Dormant — retained in the codebase but not registered, so no agent sees it';
    }
    case 'mixed': {
      return 'Mixed — reaches both live and dormant surfaces';
    }
    case 'retired': {
      return 'Retired — the words no longer exist in the codebase';
    }
    default: {
      return 'Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them';
    }
  }
}
