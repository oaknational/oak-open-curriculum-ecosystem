/**
 * The served surface's MCP Apps / WIDGET compatibility with the AI hosts,
 * checked on every commit.
 *
 * SCOPE (review-narrowed, 2026-08-18): the evaluation covers the tools and
 * widget lanes of the vendor's model — what a CONNECTED host would do with
 * what we serve. It supplies no connection facts, so the protocol-negotiation
 * lane is NOT evaluated: a host that cannot initialise against the server's
 * protocol versions is outside this gate's sight. Checking that lane per
 * host is a named follow-up on MCP-605, not a silent assumption here.
 *
 * Sibling of the other served-surface proofs here: those assert that the
 * surface is internally coherent (advertised widgets are registered, dormant
 * tools are absent); this one asserts what the surface MEANS for the hosts
 * teachers reach Oak through.
 *
 * Both inputs come from the REAL registration walk over the in-memory
 * composition root — the tool list from `tools/list`, the widget document
 * from `resources/read` — never from a re-derivation. That matters: an
 * earlier attempt read the raw tool registry instead and evaluated a DORMANT
 * widget the server never serves, producing a confident answer about
 * something unreachable. Asking the composition root cannot drift from what
 * is served, because it IS what is served.
 *
 * The widget bytes are real too: the harness's default stub is overridden
 * with the committed generated `WIDGET_HTML_CONTENT` — the exact constant
 * production wires — so the engine's HTML scan runs over what a host
 * receives, not a placeholder.
 *
 * The engine is MCPJam's, imported directly — their documented route for
 * exactly this (changelog 2026-06-26: "the shared host-compatibility engine
 * is now importable directly … to build your own compatibility checks in CI
 * or custom tooling"). No server process, no network, no credentials.
 *
 * What this does NOT prove: that the DEPLOYED surface matches this one. That
 * needs a live run against the real deployment, which needs credentials and
 * is therefore on-demand — `pnpm mcp:conformance --compat`.
 */
import {
  bundledHostCompatCatalog,
  evaluateMarketHosts,
  scanWidgetUsage,
  type HostCompatTool,
} from '@mcpjam/sdk/host-compat';
import { describe, expect, it } from 'vitest';

import { WIDGET_HTML_CONTENT } from '../generated/widget-html-content.js';
import { createConnectedClient } from '../registration-proof/connected-client.js';

interface SurfaceEvaluation {
  readonly hosts: readonly {
    readonly hostId: string;
    readonly verdict: string;
    readonly fallsBackToText: boolean;
  }[];
  readonly uiMetaToolNames: readonly string[];
  readonly toolListCursor: string | undefined;
}

async function evaluateServedSurface(): Promise<SurfaceEvaluation> {
  const client = await createConnectedClient({ getWidgetHtml: () => WIDGET_HTML_CONTENT });
  try {
    const page = await client.listTools();
    const toolsData = {
      tools: page.tools.map((tool) => ({
        name: tool.name,
        ...(tool._meta === undefined ? {} : { _meta: tool._meta }),
      })) satisfies HostCompatTool[],
    };

    const widgetUsage = await scanWidgetUsage(toolsData, async (uri) => {
      const { contents } = await client.readResource({ uri });
      // Faithful projection: `text`, `blob`, and the content item's `_meta`
      // all carry engine-read semantics — CSP domain lists and sandbox
      // permission requests live on the CONTENT ITEM's `_meta.ui` per the
      // MCP Apps spec, and dropping them would freeze this test's picture
      // while real hosts degraded.
      return {
        contents: contents.map((entry) => ({
          ...('text' in entry ? { text: entry.text } : {}),
          ...('blob' in entry ? { blob: entry.blob } : {}),
          ...(entry._meta === undefined ? {} : { _meta: entry._meta }),
        })),
      };
    });

    const { reports } = evaluateMarketHosts(toolsData, {
      ...(widgetUsage === undefined ? {} : { widgetUsage }),
      catalog: bundledHostCompatCatalog(),
    });

    return {
      hosts: reports.map((report) => ({
        hostId: report.hostId,
        verdict: report.verdict,
        fallsBackToText: report.findings.some((finding) => finding.code === 'widget_text_fallback'),
      })),
      // DELIBERATELY broader than the engine's widget notion (which needs a
      // resourceUri or an OpenAI template): the dormant user-search pair
      // declares visibility-only `_meta.ui` with NO resourceUri, which the
      // engine would ignore entirely — this predicate trips on it going
      // live, which is exactly the surprise the assertion below exists to
      // catch. `!== null` because `typeof null === 'object'`.
      uiMetaToolNames: toolsData.tools
        .filter((tool) => typeof tool._meta?.ui === 'object' && tool._meta.ui !== null)
        .map((tool) => tool.name),
      toolListCursor: page.nextCursor,
    };
  } finally {
    await client.close();
  }
}

/**
 * Evaluated once and shared as a promise rather than assigned in `beforeAll`.
 *
 * Booting the composition root costs seconds, so it should happen once — but
 * a mutable binding filled by a hook couples every assertion below to hook
 * ordering, and leaves a window where a failed boot shows up as empty arrays
 * that every filter-based assertion would happily pass. Awaiting one promise
 * gives the same single boot with neither weakness: a failure surfaces as a
 * rejection inside whichever test awaits it.
 */
const evaluation: Promise<SurfaceEvaluation> = evaluateServedSurface();

/**
 * The hosts whose regressions FAIL THIS GATE, named by the owner
 * (2026-08-30): the surfaces Oak's users actually reach the server through,
 * plus the vendor's own reference host. The other catalogue hosts are still
 * evaluated (the completeness check below covers all 16) and still appear in
 * live captures, but a regression confined to them does not fail a commit —
 * nobody at Oak is watching what, say, Notion's MCP client does with our
 * widget. This names which regressions block a commit, NOT which hosts Oak
 * promises: per the 2026-08-29 ruling, no tool-backed release set exists.
 */
const GATED_HOST_IDS: ReadonlySet<string> = new Set([
  'chatgpt',
  'claude',
  'claude-code',
  'codex',
  'copilot',
  'cursor',
  'mcpjam',
]);

describe('served surface — the evaluation actually ran', () => {
  it('evaluated every host in the pinned catalogue, by name', async () => {
    const { hosts } = await evaluation;

    // Every assertion below FILTERS this list, so a short list passes them all
    // while proving nothing about the hosts that vanished. An earlier version
    // of this guard asserted only "non-empty and contains claude", which any
    // subset containing Claude and ChatGPT satisfies — review caught that it
    // was itself the vacuous green it existed to prevent.
    //
    // The exact set, not a count: a count passes if one host is swapped for
    // another. The SDK is pinned, so this list changes only when the pin moves
    // — at which point the change should be read, not absorbed.
    expect([...hosts.map((host) => host.hostId)].sort((a, b) => a.localeCompare(b))).toEqual([
      'agentcore',
      'chatgpt',
      'claude',
      'claude-code',
      'cline',
      'codex',
      'copilot',
      'cursor',
      'goose',
      'mcpjam',
      'mistral',
      'n8n',
      'notion',
      'perplexity',
      'slack',
      'vscode',
    ]);
  });

  it('saw the whole tool list in one page', async () => {
    const { toolListCursor } = await evaluation;

    // tools/list is paginated by spec. The engine's `toolsTruncated` option
    // exists to demote `works` to `unknown` on a truncated list — the server
    // returns one page today, and this guard fails the day that stops being
    // true, rather than letting later pages go unevaluated silently.
    expect(toolListCursor).toBeUndefined();
  });
});

describe('served surface — no gated host is blocked', () => {
  it('leaves every gated host able to use Oak, even where it degrades', async () => {
    const { hosts } = await evaluation;

    // `blocked` means a host cannot use the surface at all — an app-only
    // widget with no text fallback is the way to earn it. Degradation is
    // acceptable and expected; blocking is not. Scoped to the gated set:
    // a blocked verdict confined to a non-gated host is a live-capture
    // observation, not a commit failure.
    expect(
      hosts
        .filter((host) => GATED_HOST_IDS.has(host.hostId) && host.verdict === 'blocked')
        .map((host) => host.hostId),
    ).toEqual([]);
  });

  it('reaches a determinate verdict for every gated host', async () => {
    const { hosts } = await evaluation;

    // `unknown` means the engine withheld judgement — a truncated tool list
    // or an unreadable widget. It is honest, and it is also the absence of an
    // answer, so it must not pass unnoticed where it gates. The global causes
    // of `unknown` (a truncated list, an unreadable widget) hit the gated
    // hosts too, so scoping loses none of that signal.
    expect(
      hosts
        .filter((host) => GATED_HOST_IDS.has(host.hostId) && host.verdict === 'unknown')
        .map((host) => host.hostId),
    ).toEqual([]);
  });
});

describe('served surface — the ui-meta-bearing surface stays as small as it reads', () => {
  it('serves exactly one tool carrying _meta.ui', async () => {
    const { uiMetaToolNames } = await evaluation;

    // The dormant `user-search` pair also declares `_meta.ui` (visibility
    // only, no widget) in the registry. If it ever appears here, it has been
    // switched live — which changes the compatibility story and should be a
    // deliberate act, not a surprise.
    expect(uiMetaToolNames).toEqual(['get-curriculum-model']);
  });
});

describe('served surface — the hosts that matter render Oak’s widget', () => {
  it('renders in Claude and ChatGPT rather than falling back to text', async () => {
    const { hosts } = await evaluation;
    const fallback = new Map(hosts.map((host) => [host.hostId, host.fallsBackToText]));

    expect(fallback.get('claude')).toBe(false);
    expect(fallback.get('chatgpt')).toBe(false);
  });
});
