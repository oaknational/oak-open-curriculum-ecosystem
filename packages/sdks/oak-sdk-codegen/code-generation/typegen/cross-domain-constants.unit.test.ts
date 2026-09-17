/**
 * The widget addresses are a published contract, not build artefacts.
 *
 * Clients keep the widget address from the tool list they were given, and a
 * published plugin's tool metadata is fixed in its published snapshot, so the
 * server must keep answering at the address it has advertised. Compatible
 * widget changes ship as content behind it; an incompatible change takes the
 * next version segment. The per-build addresses clients may still hold stay
 * on the public allowlist so an unauthenticated read of one reaches
 * resource-not-found rather than an authorization challenge (ADR-141, widget
 * URI identity amendment, MCP-489).
 *
 * Designed sentinels (testing-strategy, "Prove behaviour, never config or
 * content"): the values are pinned because a named decision attaches to each
 * changing. A failure here is a prompt to re-adjudicate that decision, never
 * to update the expectation to match.
 *
 * @see cross-domain-constants.ts — source of truth for widget constants
 */

import { describe, it, expect } from 'vitest';
import { BASE_WIDGET_URI, RETIRED_WIDGET_URIS } from './cross-domain-constants.js';

describe('BASE_WIDGET_URI', () => {
  it('is the published widget address', () => {
    expect(
      BASE_WIDGET_URI,
      'Serving a different widget address breaks every client holding an earlier tool ' +
        'list, and a published plugin needs a new reviewed version first. Re-adjudicate ' +
        'against ADR-141 (widget URI identity amendment, MCP-489) before changing this ' +
        'expectation; ship compatible widget changes as content behind the same address, ' +
        'and give an incompatible change the next version segment.',
    ).toBe('ui://widget/oak-curriculum-app-v1.html');
  });
});

describe('RETIRED_WIDGET_URIS', () => {
  it('lists the per-build addresses clients may still hold', () => {
    expect(
      RETIRED_WIDGET_URIS,
      'Dropping an address turns an unauthenticated read of it back into an authentication ' +
        'challenge, which tells the client to sign in and retry the same address instead of ' +
        'that the address does not exist. Re-adjudicate against ADR-141 (widget URI identity ' +
        'amendment, MCP-489) before changing this expectation.',
    ).toEqual([
      'ui://widget/oak-curriculum-app-899803c6.html',
      'ui://widget/oak-curriculum-app-5ce56c4b.html',
    ]);
  });
});
