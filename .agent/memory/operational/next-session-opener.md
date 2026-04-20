# Next-Session Opener — Sentry Integration for Public Alpha

**Authored**: 2026-04-20 session close; revised 2026-04-21 after a
§L-8 WS1 RED pause caught a testing-strategy violation in the
prescribed test shape before code was written.
**Consumed at**: next session open.
**Lifecycle**: delete on session close once its landing target has
been reported (per PDR-026); rewrite if the landing target needs
re-stating for a further session.

---

## Impact (metacognition lens)

The work shifts the MCP server's operational posture from *"errors
captured without attribution"* to *"errors attributed to release,
tool context, and request state, with runtime health visible."* This
is the quality bar for public alpha.

The bridge from action to impact is three lanes:

1. **§L-8** (next-session target): esbuild-native build + Sentry
   plugin wiring + bespoke L-7 orchestrator deletion + ADR-163 §6
   amendment. Unblocks release attribution and sourcemap linkage.
2. **Phase 3a** (L-1 + L-2 + L-3, parallel after §L-8): free-signal
   integrations, delegates extraction, MCP request-context
   enrichment. Unblocks runtime-health visibility + request-level
   attribution.
3. **L-15** + **L-EH final** (can land during alpha): strategy
   close-out ADR + `prefer-result-pattern` ESLint rule.

After the three lanes, public-alpha Sentry integration is complete.

## Landing target (per PDR-026)

State at session open:

> **Target**: reviewer findings synthesised on the simplified §L-8
> WS1 shape, §L-8 WS1 body amended in the maximisation plan, and
> the revised WS1 committed.

The 2026-04-21 napkin entry caught that the WS1 spec's three
integration tests assert vendor / configuration behaviour (plugin
lifecycle, build output carrying vendor-injected Debug IDs, build
equivalence) rather than Oak-authored product behaviour — a
testing-strategy violation. Do not author those tests. Dispatch
the three reviewers first.

## Session shape

1. **Ground First** per `start-right-quick` steps 1–6 (directives →
   start-here ADRs → active memory → operational memory → plans →
   branch state). Read the 2026-04-21 napkin entry (top of file)
   before touching §L-8.
2. **Dispatch reviewers in parallel** against the proposed
   simplification:
   - `test-reviewer` — is a single pure-function unit test over the
     env-to-plugin-config translator the right level of proof?
   - `architecture-reviewer-betty` — is the boundary (Oak policy
     function → vendor plugin config → esbuild) canonical and the
     smallest surface area that preserves intent?
   - `assumptions-reviewer` — does the simplification miss any
     Oak-authored behaviour that a richer test shape would have
     caught?
3. **Synthesise findings** and amend §L-8 WS1 in the maximisation
   plan. Expected shape:
   - **WS1 RED**: one unit test at `packages/libs/sentry-node/src/`
     over `resolveSentryEnvironment` + `resolveSentryRegistrationPolicy`
     composed into a pure translator that produces
     `@sentry/esbuild-plugin` input shape. Proves Oak-authored env-
     to-plugin-config logic.
   - **WS2 GREEN**: canonical esbuild config in
     `apps/oak-curriculum-mcp-streamable-http/esbuild.config.mjs`
     consuming the translator; delete bespoke orchestrator + wiring
     + `@sentry/cli` from both apps; amend `package.json` and
     `vercel.json` per the existing §L-8 body.
   - **WS4/WS5 smoke**: Vercel preview deployment produces the
     expected Sentry UI state (release registered + commits
     attached + deploy event); this is the canonical proof of the
     plugin/config wiring, not in-process integration tests.
   - **ADR-163 §6 amendment**: atomic with WS2 commit, per existing
     §L-8 WS3.1.
4. **Commit the revised WS1 body** before any implementation work.
5. **Then execute** the revised WS1 RED, followed by WS2 GREEN
   atomic with WS3.1 if capacity allows; otherwise stop at the
   revised-WS1 commit and record next-session target per PDR-026.

## Standing decisions (owner-beats-plan invariant protects these)

- **Build tool for the MCP app**: **raw esbuild**, NOT tsup.
  `@sentry/esbuild-plugin` + `tsup` is known-broken at runtime.
  Other workspaces stay on tsup.
- **Plugin**: `@sentry/esbuild-plugin`, first-party, ADOPTED.
- **L-7 bespoke orchestrator** (953 lines across 5 files): DELETE
  in WS2, atomic with WS3.1 ADR-163 §6 amendment.
- **`@sentry/cli` devDep**: DELETE from BOTH the MCP app AND
  `apps/oak-search-cli/` (dormant copy).
- **Canonical, idiomatic esbuild config**: per 2026-04-21 owner
  direction — the config itself is Sentry / esbuild canonical
  wiring, not invented Oak machinery. Keep it simple.

## Non-goals (do not re-open)

- Do NOT author the three integration tests the earlier §L-8 WS1
  body prescribed. Their shape is a testing-strategy violation
  (vendor/configuration assertion, not Oak product behaviour).
- Do NOT invent a build-config wrapper (`buildMcpAppEsbuildOptions`
  or similar) to make integration testing feel cleaner — that is
  the "complex test setup signals architectural problem" trap.
- Do NOT migrate any other workspace off tsup.
- Do NOT re-open the tsup-vs-esbuild decision.
- Do NOT defer the ADR-163 §6 rewrite (atomic with WS2).

## What's after this landing

- Phase 3a in parallel: L-1, L-2, L-3 — schema-independent; three
  small lanes that close public-alpha Sentry integration.
- L-15 strategy close-out + L-EH final (author `prefer-result-pattern`
  rule + first-tranche adoption).

## Pattern reminder

`inherited-framing-without-first-principles-check` has now
surfaced four times across two sessions. Before authoring tests
prescribed by a plan body, run the one-line first-principles check:
*"What Oak-authored behaviour does this test prove? Could a single
pure-function unit test prove the same thing simpler?"* If the
answer is "no Oak behaviour, just configuration or vendor wiring,"
the test belongs in a smoke phase against the live system, not in
a RED phase driving in-process implementation.

## Session-close discipline reminder (PDR-026)

Close by either:

- **Landed**: record the commit SHA + evidence link; delete this
  file.
- **Unlanded**: record attempted / prevented / next-session-re-attempts
  in `repo-continuity.md § Next safe step`; rewrite the Target
  block above for the next session.
