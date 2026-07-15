# S2 deterministic evidence (v1)

This compact record makes the S2 deterministic layer — the tiling baseline and
the audit-mode claim-vs-derived run — reproducible without versioning its
generated bulk outputs. Sources, frozen inputs, generators, this verification
contract, and the committed divergence report are durable; the bulk outputs
are local and ignored.

## Verdict and boundary

The S2 deterministic layer is complete and recomputable. Two complete runs
from base `1259530547de987fb37a160fa0cc577fb00aa1d8` (v1.69.4) produced
identical verdicts and byte-identical SHA-256 values for all 36 outputs (six
top-level artefacts plus 30 per-area ledgers). The standing freeze check
verified all 681/681 denominator files in both runs. The regenerated
`inventory.v1.jsonl` and `net-diff.v1.report.json` are byte-identical to the
S1 evidence contract recorded at base `0a04617d4` — S2 consumed exactly S1's
merged deterministic outputs, and those outputs are stable across the base
advance.

- **Tiling baseline: GREEN.** Exact cover proven for the whole denominator:
  69,661 `default-block` sentinel ledger rows over 681 files in 30 areas
  (69,623 anchor-aligned rows from the 643 Markdown files + 38 whole-span
  rows, one per non-Markdown denominator file). Every row asserts the ABSENCE
  of judgement (the anchored default blocks; no home, no binding).
- **Audit-mode run: green — no recomputation performed** (the exact
  OG-2-settled shape). 1,960 status rows: 0 consistent, 0
  `recorded-done-but-red`, 0 `recorded-pending-but-green`, 224
  `unmapped-status`, 1,736 `no-evidence`, 0 attested. No evidence executors
  ran (the `--evidence` DI seam was not fed — its executors are deferred by
  design), so divergence classification in BOTH directions remains open; this
  report is the claim-side snapshot plus the residue map, not a proof of
  status truth.
- **The UNMAPPED residue is a Walk-A finding, and it is UNDER the halt
  band.** 224 of 1,960 status lines (11.43%) across **81 distinct free-text
  status values** are unmapped under the ratified status-mapping table v1
  (six todo-binary entries). The owner-gate register's OG-2 row anticipated
  "the >20% halt firing at r1's audit run" as the table-v2 trigger; it did
  NOT fire — the residue is under-band, so table v2 is not mechanically
  triggered. The 81 distinct values (prose-status sprawl, enumerated in the
  committed divergence report) remain sitting input for Walk A.

This evidence does **not** close full S1 or r1: the declared-rate reader
sample (owner-gated fleet residual), the 77 residue candidates, and the 3,514
sweep hits remain J3/fleet queues unchanged from the S1 record.

## Known arrival at this stable point (A1, ruled PROCEED)

`refound-merge-recheck` reported RED in both runs — exactly ONE modified
unsanctioned arrival, identical both times (`arrivals.v1.report.json`:
681 live / 681 frozen, 0 added, 1 modified, 0 deleted, 0 sanctioned):

- File: `.agent/plans/product-development-governance/active/plan-corpus-refounding.plan.md`
  (the controlling plan itself). Frozen sha256
  `32aed457602edead48e0d5103909890d8bc6a34ba9f00d3f53f3f520f03f0c4c`, live
  sha256 `ac13e00800efb011d246e44b46ea7a5764936ec388064b942ac03974369835a3`.
- Substance (18 diff-lines, read in full): the
  `last_updated: 2026-07-08 → 2026-07-15` bump plus a 16-line "R1 execution
  progress (2026-07-15)" section recording the S1 merge and its honest
  partial-stable-point boundary.
- Provenance (Director-supplied, first-hand): the deep-handoff fold authored
  by Zodiac turns Solstice (commit `01e0e1ebe`, cherry-picked onto PR #384's
  branch under the prior Director's ruling, merged to main at `5ce08c259`).
- Classification and ruling: G3 table class **A1** (modification of an
  already-frozen file; ratified routing AUTO-FREEZE, no per-arrival ruling).
  The amendment WRITER is deliberately unbuilt at this point
  (`refound-amendments.ts`: read contract only), so the Director ruled
  (S2 ARC channel, 2026-07-15T16:15Z): PROCEED over the intact v1
  denominator — the S2 tools read frozen bytes only, so the arrival cannot
  affect any S2 output — record the arrival here with provenance, and route
  the frozen-v2 amendment authoring to the tooling lane's tested writer.
- Structural pattern note (Director, for the Walk-A agenda): the controlling
  plan sits inside its own frozen corpus and will modify at every stable
  point the process records. Expect an A1 self-arrival per stage until the
  G3 table gains a standing row for this class.

The RED is therefore an honest known-cause verdict at this stable point, not
a silent green and not an unexplained anomaly.

## Recorded outputs

`Lines` means physical newline-delimited lines; for JSONL outputs it is also
the semantic row count. The 30 per-area ledgers are aggregated here; per-file
hashes are in the verification block below and the machine-readable twin.

| Output | Bytes | Lines | Semantic rows | SHA-256 |
| --- | ---: | ---: | ---: | --- |
| `arrivals.v1.report.json` | 618 | 22 | 1 arrival | `249d80cb841aef84a0f025406d04fcc88f1d83f4dca08bad46666504d7ed7d56` |
| `inventory.v1.jsonl` | 18,958,318 | 69,623 | 69,623 | `8c212300a2e256ea24e67925456fe79cbc36b7612b122d5183f70d7df8125b37` |
| `net-diff.v1.report.json` | 19,244,678 | 497,993 | n/a | `108428ac876e3f718a3e57abfa5003a2d0b6684fa8f7c2aa36374abfc3ac3fb4` |
| `ledger/*.ledger.jsonl` (30 files) | 18,886,897 | 69,661 | 69,661 | per-file below |
| `claim-census.v1.jsonl` | 2,366,524 | 6,922 | 6,922 | `db14136a2517909a398befbf7982d72397d37a2271a75e2337f8499a1af6a76d` |
| `claim-census.v1.report.json` | 1,014 | 66 | n/a | `b8bf1513f87c4f8f6cc8e75422986b138e0a3e8d87e644bcd113cbb735fa839b` |
| `plan-state.v1.report.json` | 485,642 | 13,842 | 1,960 rows | `428cd0aa7bc2309823a2443c2b6349181716b59e149261f631490f8fe4d4c91b` |

`plan-state.v1.report.json` — the claim-vs-derived divergence report, the
Walk-A input — is COMMITTED as a first-class report alongside this record;
the other outputs above are local and ignored. The machine-readable twin is
[`s2-deterministic-evidence.v1.json`](s2-deterministic-evidence.v1.json).

## Headline measurements

- Tiling: 69,661 ledger rows; 681 files; 30 areas; exact cover (zero gaps,
  zero overlaps); GREEN in both runs.
- Census: 6,922 records (one per unique captured line) across 643 frozen
  Markdown files — 1,960 status lines and 5,421 completion-keyword lines,
  and the two captures OVERLAP: 459 lines are both a status line and a
  keyword line (1,960 + 5,421 − 459 = 6,922; the totals are not additive).
  Per-keyword counts overlap likewise — one line can match several
  keywords, 1,383 lines match more than one, so the per-keyword sum
  (7,063) exceeds the 5,421 keyword-line total. Keyword line counts (v1
  list order): completed 1,080; complete 2,355; landed 727; closed 469;
  resolved 470; archived 349; superseded 372; done 466; merged 198;
  retired 192; implemented 160; executed 137; shipped 88.
- Audit: 1,960 rows — UNMAPPED 224 (11.43%, band ≤20% not crossed),
  no-evidence 1,736, attested 0, divergence classes 0/0 (no evidence
  injected); 81 distinct unmapped status values.

These non-zero outputs are queues and sitting inputs for placed judgement
(Walk A, table v2, the evidence executors), not automatic findings or
closure evidence.

## Regenerate

Use a clean checkout at the exact recorded run base
`1259530547de987fb37a160fa0cc577fb00aa1d8`. The frozen-tree-derived outputs
(inventory, net-diff, ledgers, census, plan-state report) are expected stable
at a later base ONLY while all three conditions hold: `refound-verify-freeze`
stays green over an unchanged frozen tree; zero amendments; AND the
generating toolchain is unchanged — the `refound-*` generators and their
dependencies, the ratified status-mapping table v1, and the
completion-keyword list v1. Verify-freeze pins the frozen INPUTS only; a
generator, mapping-table, keyword-list, or dependency change at a later base
alters these bytes while the freeze stays green, so the byte contract binds
to the recorded base (matching `requiresExactRunBase` in the machine twin) —
the later-base expectation is a conditional convenience, never part of the
contract. `arrivals.v1.report.json` is inherently live-tree-dependent and
reproduces only at the exact base. From the
repository root, run this exact sequence without adding a `--help` probe
(the raw `refound-*` scripts execute on any argv):

```sh
pnpm install
pnpm build
pnpm --filter @oaknational/agent-tools refound-verify-freeze
pnpm --filter @oaknational/agent-tools refound-merge-recheck
pnpm --filter @oaknational/agent-tools refound-inventory
pnpm --filter @oaknational/agent-tools refound-default-ledger
pnpm --filter @oaknational/agent-tools refound-tile
pnpm --filter @oaknational/agent-tools refound-claim-census
pnpm exec tsx agent-tools/src/plan-state/plan-state.ts \
  --census .agent/plans-refounding/claim-census.v1.jsonl \
  --report .agent/plans-refounding/plan-state.v1.report.json
```

Expected verdicts: verify-freeze OK 681; merge-recheck RED with exactly the
one A1 arrival above (at the exact base); inventory 643 files / 169,258
lines / 69,623 anchors / 41.13%; default-ledger 69,661 rows / 30 ledgers;
tile GREEN; census 6,922 records; plan-state
`green — no recomputation performed (1960 row(s); UNMAPPED 224, no-evidence 1736, attested 0)`.

`refound-default-ledger` refuses over ANY pre-existing target ledger: remove
(or set aside) the `ledger/` directory before a repeat run. Repeat the
sequence a second time. The second run must report the same verdicts and the
verification below must pass after both runs.

## Verify byte identity

From the repository root, run the block below. Every checksum must print
`OK`. A mismatch is a failed recomputation, not a reason to refresh this
record silently.

```sh
shasum -a 256 -c <<'EOF'
249d80cb841aef84a0f025406d04fcc88f1d83f4dca08bad46666504d7ed7d56  .agent/plans-refounding/arrivals.v1.report.json
db14136a2517909a398befbf7982d72397d37a2271a75e2337f8499a1af6a76d  .agent/plans-refounding/claim-census.v1.jsonl
b8bf1513f87c4f8f6cc8e75422986b138e0a3e8d87e644bcd113cbb735fa839b  .agent/plans-refounding/claim-census.v1.report.json
8c212300a2e256ea24e67925456fe79cbc36b7612b122d5183f70d7df8125b37  .agent/plans-refounding/inventory.v1.jsonl
0f6ccad8aea50030686ff608ebfca54b7278ec5acedf0b6f5c131168b207ad4e  .agent/plans-refounding/ledger/milestones.ledger.jsonl
e1e14f9da414e741e8d55344c7199cdd044fb0b5f92d1814983d3cd85617385b  .agent/plans-refounding/ledger/plans--agent-tooling.ledger.jsonl
0b1c53aa0a010df01ec404785ca73a79bdedd4f0f1acd1e9245fa0922a69eacc  .agent/plans-refounding/ledger/plans--agentic-engineering-enhancements.ledger.jsonl
350a3a5102f3696eb9b75f920fba0280bfbdbfb2db896ff04d4232d765378592  .agent/plans-refounding/ledger/plans--architecture-and-infrastructure.ledger.jsonl
a6e56e825b1dcd95bbdb87390df111f60fdf1287ef1fc8ee49f1ea8eda5c52ce  .agent/plans-refounding/ledger/plans--compliance.ledger.jsonl
ad1836a4e6faed6a54636c1a2077dc0bdce8ca839f6cffa88d41caac5a653246  .agent/plans-refounding/ledger/plans--connecting-oak-resources.ledger.jsonl
949529e390cb41d6941c68fefc6c71428353c2874eba650acaae41e887b25124  .agent/plans-refounding/ledger/plans--curriculum-hub-demo.ledger.jsonl
1db39501cc55e1903167dd8c3119962b1273441723e4c5431a0e5ccca18a4134  .agent/plans-refounding/ledger/plans--curriculum-mcp-path-to-ga.ledger.jsonl
ab91d0ee08da5f9e84349a9d1c97f5d289be2a8942bf77c5ac5da213e54bc8f5  .agent/plans-refounding/ledger/plans--developer-experience.ledger.jsonl
38773f44636b4a3154c4fc696a5191eeed76cf5e8b4fe390bf1a695a1aa1d719  .agent/plans-refounding/ledger/plans--discovery.ledger.jsonl
4cca21edee6eca9a852fdad76670ca0eccce2944ce83bf64e002cf3b45e29174  .agent/plans-refounding/ledger/plans--effectiveness-and-impact.ledger.jsonl
27f31880a6a65cffa992716fedd7a9790ee66d01e426b86494f1894a77f7a909  .agent/plans-refounding/ledger/plans--exploring-open-education-resources.ledger.jsonl
f2a15300716de05918aa32b2636d3af9f7354877ca3d88f3b7e792fadb3e8d1f  .agent/plans-refounding/ledger/plans--notes.ledger.jsonl
b66ad160bdab7c0b016e39d9ed4ce04e3c69458bb28e10f4607e2e8f6c9f6343  .agent/plans-refounding/ledger/plans--observability.ledger.jsonl
a2f01b65ec7fa9a26e61b9e15c78b81b568e249af1d2c49cf03cd0a61f8c9fd5  .agent/plans-refounding/ledger/plans--product-development-governance.ledger.jsonl
8f42facb6feb49fd12c293ac0682efe2d0e52a772858e0ebc5e835ab04f5b53b  .agent/plans-refounding/ledger/plans--school-data-search.ledger.jsonl
0fc9936402afab9b017f85c25df6684211894d49598dda27a1d05ddd0a5986f7  .agent/plans-refounding/ledger/plans--sdk-and-mcp-enhancements.ledger.jsonl
f5b460d377a9ab3d159ece9457ad5eb7f4708b4f2d9a2c225823316f72f2f366  .agent/plans-refounding/ledger/plans--sector-engagement.ledger.jsonl
800b4ebe3d8a5f9920ef6a2c48aceb3424602125df1310d9916d1efc1b892fac  .agent/plans-refounding/ledger/plans--security-and-privacy.ledger.jsonl
1a2afcd75d1aad4feef8ece7e46cb75709e3ec8cacaecc6d9cce39a046afdc99  .agent/plans-refounding/ledger/plans--semantic-search.ledger.jsonl
9644ab9f160494978ce5125ae65d7beda7cdb8f3c095adb54d66cdf40a717cfa  .agent/plans-refounding/ledger/plans--slack-assistants.ledger.jsonl
b1182d7bddd8d8ddf9e7de7360b35c85537d1d6b354a6ee869653d743057ef95  .agent/plans-refounding/ledger/plans--speculative.ledger.jsonl
c03379e5d5e49b93bc4fb82371144c49fca914a7da4d3a5051570ca28241b77c  .agent/plans-refounding/ledger/plans--telemetry-and-understanding.ledger.jsonl
06bc58dc1998fb1b317f1bd9e7ef1d7e0636f9c8bc4e51509e667708ebe8c716  .agent/plans-refounding/ledger/plans--templates.ledger.jsonl
93a2d3469fa772d7739b8c5cc88e8e2de5f208e4184f26b263240f391d63afd7  .agent/plans-refounding/ledger/plans--upstream-feature-requests.ledger.jsonl
bfd0640b1f71586cf8c534dcd198c62f41759d8bfa5c12c9f81ad30f91ce19c4  .agent/plans-refounding/ledger/plans--user-experience.ledger.jsonl
774a4ad448d4240cf81f8f1e1d3246ca75f682f729d19f33246ba79ef10cf083  .agent/plans-refounding/ledger/plans.ledger.jsonl
3e5805bb20ba7e9ac1ec6c8b97fb61b12bce3727be958c4b38a00f12e6ca420e  .agent/plans-refounding/ledger/proposals--kg-ont-mcp-strat.ledger.jsonl
3b55ff599bd7fcf1564f5aa4f7d3e9e6f69825622c81913e253dc3bb594c347a  .agent/plans-refounding/ledger/proposals--upstream-api-endpoint-additions.ledger.jsonl
95c386ab3389a42def8526df879ad1e641b3967f8b549ef0f6a2e4e17f18d299  .agent/plans-refounding/ledger/proposals.ledger.jsonl
108428ac876e3f718a3e57abfa5003a2d0b6684fa8f7c2aa36374abfc3ac3fb4  .agent/plans-refounding/net-diff.v1.report.json
428cd0aa7bc2309823a2443c2b6349181716b59e149261f631490f8fe4d4c91b  .agent/plans-refounding/plan-state.v1.report.json
EOF
```
