---
agent_name: Ferny Fruiting Root
session_id_prefix: ee16a4
platform: claude
model: claude-opus-4-7
created_at: 2026-05-23T17:29:00Z
last_updated_at: 2026-05-24T21:13:00Z
topic: ws-2-pdr-076-split-prestage-synthesis
intended_consumer: post-m1-attestation-tidy-up cycles 3+4
captured_by_agent_name: Charcoal Brazing Kiln
captured_by_session_id_prefix: 7c7327
captured_by_platform: claude
captured_by_model: claude-opus-4-7
captured_at: 2026-05-24T21:13:00Z
capture_origin_path: /tmp/ferny-ws2-partition-prestage-synthesis.md
capture_class: substrate-from-tmp-to-durable-repo
preservation: byte-for-byte
---

Pre-authoring PDR-076 SPLIT partition verification synthesis. 3-way fan-out (fred + assumptions + docs-adr) returned ~12 min wall-clock. **One substantive partition GAP caught** + §Forbids item 4 fate decided + paste-ready stub/quote/cross-reference blocks authored.

## Subagent transcript ids

| Reviewer | Transcript id | Headline |
|---|---|---|
| architecture-expert-fred | `af47615e16180ab9b` | Partition verified clean; §Forbids item 4 → REMOVE FROM BOTH |
| assumptions-expert | `a6dfb2f6a3f148746` | **GAP CAUGHT**: §Cascade item 2 has body-file-adjacency overlap; convergence-on-decision ≠ convergence-on-partition |
| docs-adr-expert | `aec4caccaa0c2c789` | Paste-ready blocks authored for stub, quote dup, cross-refs, Notes, PDR-027 amendment |

## CRITICAL finding (assumptions-expert; would have surfaced as mid-author rework)

**§Cascade item 2's body-file-adjacency overlap with item 5** — pre-stage caught this.

Item 2 ("Identity-bearing collaboration substrate schemas") is currently placed in 076a per the proposed partition. But item 2's scope covers handoff records, conversation entries, sidebar participants — many of which ARE body files or body-file-adjacent. Item 2's enforcement touches the same author-attribution surface as item 5 (body-file consumers in 076b).

**Cure**: before authoring, narrow item 2 to identity-row-schema-only OR move part of item 2 to 076b. fred + betty + docs-adr had all read this as "clean partition" but missed the body-file adjacency. assumptions-expert's meta-level lens caught it.

**Implication for Director routing**: surface the partition to owner explicitly (not just the SPLIT decision). Reviewers converged on SPLIT *decision*; the partition *shape* needs owner sight before authoring lands. Owner-decision-required surface I'm flagging now.

## fred's clean verdicts on questions 1, 3, 4, 5

- **§Cascade item 6 (PDR-029 audit-target amendment)**: 076a only. Placement correct. PDR-029 currently audits PDR-027 identity discipline; body-file frontmatter is structurally separate; future 076b tripwire enforcement would be a NEW PDR-029 amendment under 076b's own cascade.
- **§Falsifiability split**: clean partition. 076a owns short-prefix-collision; 076b owns body-file-path-collision. No shared falsifiers. Structurally disjoint failure classes.
- **§Decision sequencing-conditionality on PDR-027**: 076a only. fred ratifies docs-adr's "preserved and sharpened" claim. Minor caveat: 076b references 076a's field-shape (definitional dependency, not sequencing-conditionality); 076b carries `Related: PDR-076a` link, NOT the PDR-027-must-amend-first gate.
- **§Decision items 1, 2, 3**: clean unambiguous. Item 1 (session_id_prefix demotion) → 076a; Item 2 (identity key (agent_name, id)) → 076a; Item 3 (body-file frontmatter contract) → 076b. The only cross-reference is field reuse (healthy directional dependency 076b→076a, never reverse).

## fred's verdict on §Forbids item 4 fate

**REMOVE FROM BOTH.** The file boundary is the enforcement. §Forbids item 4 exists in v2 precisely because the two decisions share one PDR; post-SPLIT, "downstream amendments must respect the separation" is true by construction (each PDR carries its own cascade). Retaining it re-imports the coupling the SPLIT cures and creates a prose pointer that can drift. Per `no-moving-targets-in-permanent-docs` and `replace-don't-bridge`: cure the need structurally, do not document the absent coupling.

## docs-adr's paste-ready blocks (all reviewer-verified)

Available in transcript `aec4caccaa0c2c789`; summary of authored substance:

1. **Archival stub for rewritten PDR-076**: Status field + `(SUPERSEDED — SPLIT)` title suffix + retained Context + retained Owner direction + pointer block; no other §Decision/§Rationale/§Cascade. Frontmatter unchanged (minimal `pdr_kind: governance` per v2).
2. **§Owner-direction quote duplication block** (verified verbatim from v2 lines 433-440): paste-ready for BOTH 076a and 076b with explicit "Both PDR-076a and PDR-076b co-emerged from a single owner direction..." co-emergence framing.
3. **`Related:` cross-reference shape**: house-style aligned; each PDR cites the other with one-sentence co-emergence gloss.
4. **§Notes one-line history**: "**Split history**. This PDR originated as part of PDR-076 (2026-05-23)..."
5. **PDR-027 Amendment-Log wording**: house-style aligned bold-prefixed date + parenthetical SPLIT acknowledgement.

## Recommendations to Director (Twilit ST)

1. **Cycle #6 authoring is NOT cleanly ready** — the item 2 body-file-adjacency overlap needs cure BEFORE authoring. Either (a) narrow item 2 to identity-row-schema-only in 076a, or (b) split item 2 between 076a (identity-row-class) and 076b (body-file-adjacent class).
2. **Surface partition to owner alongside SPLIT GO** — convergence on SPLIT *decision* is strong (5 reviewers now); partition *shape* hasn't been owner-seen and has the just-caught gap.
3. **§Forbids item 4 fate is owner-decision OR reviewer-converged**: assumptions flagged this; fred verdicted REMOVE-FROM-BOTH. Recommend going with fred's verdict (file-boundary-enforces) but flag to owner in coherence bundle.
4. **Paste-ready blocks reduce Cycle #6 authoring time** to mostly mechanical execution if partition gap is resolved.

## My posture

- Pre-stage substrate complete; verified clean except item 2 gap
- Awaiting Director routing on (a) item 2 partition decision + (b) Cycle #6 authoring trigger after owner verdict
- State going forward: STANDBY — waiting on Director partition-cure verdict + owner-coherence-moment surface
- Heartbeat cron `b0762b44` firing on 4-min cadence with IDLE/STANDBY/ACTIVE marker discipline

— Ferny Fruiting Root / claude / claude-opus-4-7 / ee16a4 (WS-2 partition pre-stage lead; gap caught pre-authoring)
