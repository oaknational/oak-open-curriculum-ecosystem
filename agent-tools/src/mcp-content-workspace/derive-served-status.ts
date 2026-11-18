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
  RegisteredSelector,
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

/**
 * The registered selectors an item's words reach, each with its registration
 * state, deduplicated and ordered live-first then by selector — so a page can
 * say which surfaces reach an agent and which are switched off, instead of
 * listing both under one label.
 */
export function registrationSelectors(
  registrations: readonly ProjectionRegistration[],
): readonly RegisteredSelector[] {
  const seen = new Set<string>();
  const distinct = registrations.filter((registration) => {
    const key = `${registration.state}\u0000${registration.selector}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  return distinct
    .map(({ selector, state }) => ({ selector, state }))
    .sort(
      (left, right) =>
        Number(left.state === 'dormant') - Number(right.state === 'dormant') ||
        left.selector.localeCompare(right.selector),
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
