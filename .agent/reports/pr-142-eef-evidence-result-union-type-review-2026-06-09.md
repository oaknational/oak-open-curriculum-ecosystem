# PR #142 — `EefEvidenceResult` Union Type Review

**Date**: 2026-06-09
**Author session**: Silvered Lurking Mask (claude / Opus 4.8)
**Branch**: `assess/evidence_workflows`
**Scope**: The single Copilot review comment on
[PR #142](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/142),
on `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`.
**Status**: Findings for the deferred specialist type review. Names a
recommendation; does **not** apply a code change. Verified empirically (probe,
now deleted) and cross-reviewed by the `type-expert` subagent, whose findings
were then re-checked against source.

## The comment under review

Copilot (the only substantive feedback on the PR — all other comments are green
bot status from SonarQube / Vercel) flagged the success branch of
`EefEvidenceResult`:

> `EefEvidenceResult` models the success `structuredContent` as a union of two
> envelopes, but the union is non-discriminated (both shapes are identical aside
> from `members`) so it doesn't help narrowing and adds type complexity. Prefer
> a single envelope type whose `members` element type is a union (matching the
> "nested union" approach described elsewhere).

The type in question:

```139:145:packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts
type EefEvidenceResult =
  | {
      content: never[];
      structuredContent: EefEvidenceEnvelope | EefEvidenceEnvelope<EefStrandHeadline>;
      isError?: false;
    }
  | { content: TextContent[]; isError: true };
```

## Relevant facts from source

- `EefEvidenceEnvelope<TMember = EefStrand>` is a strict `interface` with
  `members: readonly TMember[]` (`graph-corpus-sdk/src/eef-strands/eef-evidence.ts`).
- `EefStrandHeadline = Pick<EefStrand, 'id' | 'name' | 'slug' | 'eef_url' |
  'headline' | 'tags'>` (`eef-headline-view.ts`), so `EefStrand` is a structural
  **subtype** of `EefStrandHeadline`.
- `EefAnswerType` is `'strand-lookup' | 'context-subset'` — result completeness,
  **not** member depth. It is therefore not a depth discriminant.
- The value is spread across the ADR-193 egress membrane
  (`eefEvidenceToCallToolResult`) into the vendor `Record<string, unknown>` and
  JSON-serialised to an LLM agent. The sole real consumer
  (`mcp/universal-tools/executor.ts`) immediately collapses it to `CallToolResult`.
- `runEefEvidenceTool` is reachable on the public package surface via the
  `"./mcp/*"` subpath export, **but** the `EefEvidenceResult` type itself is not
  exported (an external consumer can use the returned value but cannot name its
  type).

## Verdict

Copilot is **half right**: the diagnosis is correct, the prescription is not.

1. **Non-discriminated — correct.** Nothing narrows the root union by a property
   check; `answerType` is orthogonal to member depth.

2. **Copilot's fix (`EefEvidenceEnvelope<EefStrand | EefStrandHeadline>`) is
   worse — confirmed.** Because `EefStrandHeadline` is a `Pick` of `EefStrand`, a
   member-level union `EefStrand | EefStrandHeadline` exposes only the
   headline-common fields on access, erasing full-strand detail from the full
   path.

3. **The current root union ALSO collapses for member access — confirmed.**
   `readonly EefStrand[]` is assignable to `readonly EefStrandHeadline[]`
   (readonly arrays are covariant in their element type), so
   `EefEvidenceEnvelope<EefStrand>` is assignable to
   `EefEvidenceEnvelope<EefStrandHeadline>` and the union's usable access surface
   degrades to the headline shape. Neither form lets a consumer read full fields
   without an explicit narrow. (TypeScript may still *display* the union
   un-collapsed; it is the access surface that collapses.)

4. **Runtime/safety impact — low, not zero.** No consumer narrows this value
   before it crosses the egress membrane to `Record<string, unknown>` and JSON.
   The type is reachable on the public surface but its precise form is unnameable
   externally and is collapsed immediately by the only consumer. Net: not a live
   hazard, but the return type overstates the precision available to a TypeScript
   consumer — misleading as a contract rather than unsafe.

5. **A faithful self-describing type needs a real discriminant.** The plan
   wording "nested union, never a root union" should be reconciled: the naive
   nested member union is the lossy one. If the typed result is meant to be
   useful to a TS consumer, the right shape is a closed discriminated one — e.g.
   a `memberDepth: 'full' | 'headline'` tag paired with the matching exact
   envelope/member branch.

## Verification

- **Empirical probe (deleted).** A throwaway type file in
  `graph-corpus-sdk/src/eef-strands/` used non-distributive `[A] extends [B]`
  checks with `@ts-expect-error` on the negative claims; `pnpm type-check` passed
  green. Because an unused `@ts-expect-error` is itself a compile error, green
  proves the positive assignments held **and** both negatives fired. This
  confirms claims 1–3.
- **Cross-review.** The `type-expert` subagent independently agreed with claims
  1–3, and refined claim 4 (the type is on the public surface, so not purely
  cosmetic). That refinement was re-checked against the `package.json` exports
  map and the dist `.d.ts` — accurate, with the mitigating facts noted in fact 6
  / verdict 4 above (`EefEvidenceResult` unexported; sole consumer collapses it).

## Recommendation for the deferred type review

**Do not apply Copilot's nested-union fix.** Choose between:

- **(A) Keep two exact branches, add a real discriminant** (`memberDepth:
  'full' | 'headline'`) so the type is genuinely self-describing and a consumer
  can narrow to full-strand fields. If a downstream agent is also expected to
  distinguish depth from JSON, the discriminant must live inside
  `structuredContent`, not only as a sibling TypeScript-only result field.
  (Note: an agent can already infer depth from member field presence and from
  having passed `detail: 'headline'`, so a `structuredContent` discriminant is
  justified mainly for TS-consumer narrowing, not for the agent.)
- **(B) Accept it as an egress-oriented transport shape** and simplify both the
  type and the plan wording, documenting that member-level precision lives in
  `inspectStrand` / `evidenceForMove` / `evidenceForMoveHeadlines`, while the MCP
  handler return type is deliberately transport-shaped.

Either way, the `EefStrand <: EefStrandHeadline` subtype collapse (verified
above) is the fact that should drive the decision — it is the reason the bare
member union and the root union both fail to preserve full detail.
