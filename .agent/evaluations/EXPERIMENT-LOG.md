# Experiment Log

Chronological record of search experiments and their impact on system metrics.

**Purpose**: Enable revisiting past decisions, identifying patterns, demonstrating rigorous evaluation, and generating new ideas.

---

## How to Read This Log

- Entries are in **reverse chronological order** (newest first)
- Each entry shows before/after metrics and the decision
- The "Cumulative Progress" table at the bottom shows system evolution
- **Note**: Historical entries reference scripts that existed at the time (e.g., `analyze-cross-curriculum.ts`). As of 2026-01-06, all evaluation is consolidated into `pnpm benchmark` — see [ADR-098](../../docs/architecture/architectural-decisions/098-ground-truth-registry.md)

---

## Current System State

For the full current state, see [current-state.md](../plans/semantic-search/current-state.md).

### ✅ Phase 8 Comprehensive Baselines COMPLETE (2026-01-10)

**All 30 subject/phase entries measured with production-ready ground truths (509 queries).**

| Metric | Value | Status |
|--------|-------|--------|
| Overall MRR | 0.582 | ✅ Exceeds Tier 1 target (0.45) |
| Overall NDCG@10 | 0.517 | ⚠️ Below target (0.75) |
| Overall Precision@10 | 0.168 | ⚠️ Below target (0.50) |
| Overall Recall@10 | 0.620 | ✅ Meets target (0.60) |
| Zero-Hit Rate | 18.5% | ⚠️ Above target (10%) |
| p95 Latency | 793ms | ⚠️ Above target (300ms) |
| Total Queries | 509 | — |
| Total Entries | 30 | — |

**Results stored in**: `evaluation/baselines/baselines.json`

**Performance by tier**:

- ✅ Excellent (MRR ≥ 0.80): 2 entries (art/primary, science/secondary)
- ✅ Good (MRR 0.50-0.79): 15 entries
- ⚠️ Acceptable (MRR 0.40-0.49): 4 entries
- ❌ Poor (MRR < 0.40): 9 entries (MFL subjects + PE + RE)

**Available scripts**:

```bash
pnpm ground-truth:validate  # Run all 16 validation checks
pnpm ground-truth:analyze   # Detailed quality breakdown by entry
pnpm benchmark --all        # Run benchmarks for all entries
```

### Historical: Previous Baselines (2025-12-24) — SUPERSEDED

**Note**: These baselines were measured against ground truth that has since been corrected. The 2026-01-10 baselines above are now authoritative.

**See**: [ground-truth-corrections.md](ground-truth-corrections.md) for details of previous corrections (63 in Dec 2025).

---

## Log Entries

### 2026-01-10: Phase 8 Comprehensive Baselines — UPDATED

**Context**: Comprehensive baseline measurement across all 30 subject/phase entries using production-ready ground truths (509 queries, all three validation stages complete).

**Method**: `pnpm benchmark --all` against live Elasticsearch.

**Results — All 30 Entries**:

| Entry | #Q | MRR | NDCG@10 | P@10 | R@10 | Zero% | p95ms | Status |
|-------|-----|-----|---------|------|------|-------|-------|--------|
| art/primary | 10 | 0.900 | 0.762 | 0.160 | 0.800 | 0.0% | 720 | ✅ Excellent |
| art/secondary | 11 | 0.716 | 0.651 | 0.209 | 0.788 | 0.0% | 612 | ✅ Good |
| citizenship/secondary | 9 | 0.363 | 0.322 | 0.133 | 0.444 | 33.3% | 468 | ❌ Poor |
| computing/primary | 10 | 0.517 | 0.469 | 0.140 | 0.700 | 20.0% | 575 | ✅ Good |
| computing/secondary | 12 | 0.758 | 0.611 | 0.167 | 0.583 | 16.7% | 962 | ✅ Good |
| cooking-nutrition/primary | 9 | 0.564 | 0.515 | 0.167 | 0.722 | 11.1% | 447 | ✅ Good |
| cooking-nutrition/secondary | 11 | 0.758 | 0.715 | 0.145 | 0.773 | 18.2% | 500 | ✅ Good |
| design-technology/primary | 10 | 0.517 | 0.475 | 0.140 | 0.700 | 20.0% | 483 | ✅ Good |
| design-technology/secondary | 11 | 0.411 | 0.436 | 0.164 | 0.591 | 18.2% | 649 | ⚠️ Acceptable |
| english/primary | 16 | 0.578 | 0.512 | 0.175 | 0.604 | 18.8% | 843 | ✅ Good |
| english/secondary | 58 | 0.581 | 0.510 | 0.178 | 0.589 | 13.8% | 767 | ✅ Good |
| french/primary | 10 | 0.341 | 0.318 | 0.100 | 0.450 | 40.0% | 514 | ❌ Poor |
| french/secondary | 10 | 0.210 | 0.195 | 0.050 | 0.217 | 70.0% | 535 | ❌ Poor |
| geography/primary | 10 | 0.783 | 0.647 | 0.140 | 0.700 | 0.0% | 591 | ✅ Good |
| geography/secondary | 15 | 0.708 | 0.523 | 0.173 | 0.578 | 6.7% | 811 | ✅ Good |
| german/secondary | 10 | 0.145 | 0.180 | 0.060 | 0.283 | 50.0% | 466 | ❌ Very Poor |
| history/primary | 9 | 0.571 | 0.540 | 0.178 | 0.630 | 22.2% | 529 | ✅ Good |
| history/secondary | 18 | 0.634 | 0.585 | 0.206 | 0.722 | 16.7% | 583 | ✅ Good |
| maths/primary | 38 | 0.546 | 0.444 | 0.153 | 0.539 | 18.4% | 914 | ✅ Good |
| maths/secondary | 76 | 0.734 | 0.671 | 0.242 | 0.811 | 2.6% | 1035 | ✅ Good |
| music/primary | 10 | 0.461 | 0.380 | 0.100 | 0.500 | 40.0% | 522 | ⚠️ Acceptable |
| music/secondary | 12 | 0.688 | 0.602 | 0.192 | 0.708 | 25.0% | 473 | ✅ Good |
| physical-education/primary | 20 | 0.388 | 0.321 | 0.110 | 0.438 | 35.0% | 491 | ❌ Poor |
| physical-education/secondary | 12 | 0.274 | 0.239 | 0.083 | 0.319 | 50.0% | 882 | ❌ Poor |
| religious-education/primary | 10 | 0.379 | 0.403 | 0.110 | 0.550 | 40.0% | 438 | ❌ Poor |
| religious-education/secondary | 10 | 0.327 | 0.257 | 0.080 | 0.317 | 40.0% | 549 | ❌ Poor |
| science/primary | 17 | 0.767 | 0.725 | 0.253 | 0.789 | 5.9% | 728 | ✅ Good |
| science/secondary | 36 | 0.789 | 0.691 | 0.219 | 0.755 | 2.8% | 746 | ✅ Good |
| spanish/primary | 10 | 0.307 | 0.340 | 0.090 | 0.450 | 30.0% | 478 | ❌ Poor |
| spanish/secondary | 9 | 0.178 | 0.149 | 0.056 | 0.278 | 55.6% | 470 | ❌ Poor |
| **OVERALL** | **509** | **0.582** | **0.517** | **0.168** | **0.620** | **18.5%** | **793** | — |

**Performance Tiers**:

| Tier | Entries | Subjects |
|------|---------|----------|
| ✅ Excellent (MRR ≥ 0.80) | 2 | art/primary, science/secondary (just below at 0.789) |
| ✅ Good (MRR 0.50-0.79) | 15 | art/secondary, computing/primary, computing/secondary, cooking-nutrition/primary, cooking-nutrition/secondary, design-technology/primary, english/primary, english/secondary, geography/primary, geography/secondary, history/primary, history/secondary, maths/primary, maths/secondary, music/secondary, science/primary |
| ⚠️ Acceptable (MRR 0.40-0.49) | 4 | design-technology/secondary, music/primary |
| ❌ Poor (MRR < 0.40) | 9 | citizenship/secondary, french/primary, french/secondary, german/secondary, physical-education/primary, physical-education/secondary, religious-education/primary, religious-education/secondary, spanish/primary, spanish/secondary |

**Key Findings**:

1. **MFL subjects critically underperform**: German (0.145), Spanish/secondary (0.178), French/secondary (0.210) — ELSER is English-only, cannot semantically match target language content
2. **Science excels across phases**: Primary (0.767) and secondary (0.789) both strong
3. **Art/primary is top performer**: MRR 0.900
4. **PE struggles**: Both primary (0.388) and secondary (0.274) need improvement
5. **Religious Education struggles**: Both primary (0.379) and secondary (0.327) need improvement
6. **Overall MRR 0.582**: Exceeds Tier 1 target (0.45) by 29%
7. **Zero-hit rate elevated**: 18.5% overall, with MFL and RE having 40-70% zero-hit rates

**Results stored in**: `evaluation/baselines/baselines.json`

---

#### Detailed Per-Category Results Matrix

**Status Legend**: ✓✓=EXCELLENT | ✓=GOOD | ~=ACCEPTABLE | ✗=BAD

| Subject | Phase | Category | #Q | MRR | NDCG | P@10 | R@10 | Zero% | p95ms |
|---------|-------|----------|-----|-----|------|------|------|-------|-------|
| art | primary | cross-topic | 1 | 1.000✓✓ | 1.000✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 449~ |
| art | primary | imprecise-input | 1 | 0.500~ | 0.497✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 401~ |
| art | primary | natural-expression | 2 | 1.000✓✓ | 0.894✓✓ | 0.150✗ | 0.750✓ | 0.000✓✓ | 437~ |
| art | primary | pedagogical-intent | 1 | 1.000✓✓ | 0.337✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 449~ |
| art | primary | precise-topic | 5 | 0.900✓✓ | 0.800✓ | 0.180✗ | 0.900✓✓ | 0.000✓✓ | 720✗ |
| art | secondary | cross-topic | 1 | 0.125✗ | 0.248✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 322~ |
| art | secondary | imprecise-input | 1 | 0.250✗ | 0.339✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 402~ |
| art | secondary | natural-expression | 2 | 0.500~ | 0.483✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 391~ |
| art | secondary | pedagogical-intent | 1 | 1.000✓✓ | 0.932✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 471~ |
| art | secondary | precise-topic | 6 | 0.917✓✓ | 0.779✓ | 0.283✗ | 0.944✓✓ | 0.000✓✓ | 612✗ |
| citizenship | secondary | cross-topic | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 352~ |
| citizenship | secondary | imprecise-input | 1 | 0.167✗ | 0.239✗ | 0.200✗ | 0.667✓ | 0.000✓✓ | 426~ |
| citizenship | secondary | natural-expression | 2 | 0.500~ | 0.408✗ | 0.150✗ | 0.500~ | 0.500✗ | 327~ |
| citizenship | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 407~ |
| citizenship | secondary | precise-topic | 4 | 0.525~ | 0.461✗ | 0.175✗ | 0.583~ | 0.000✓✓ | 468~ |
| computing | primary | cross-topic | 1 | 0.333✗ | 0.394✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 575✗ |
| computing | primary | imprecise-input | 1 | 0.333✗ | 0.406✗ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 290✓ |
| computing | primary | natural-expression | 2 | 0.083✗ | 0.140✗ | 0.050✗ | 0.250✗ | 0.500✗ | 449~ |
| computing | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 572✗ |
| computing | primary | precise-topic | 5 | 0.867✓ | 0.723~ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 442~ |
| computing | secondary | cross-topic | 1 | 1.000✓✓ | 0.787✓ | 0.100✗ | 0.500~ | 0.000✓✓ | 401~ |
| computing | secondary | imprecise-input | 1 | 0.100✗ | 0.157✗ | 0.100✗ | 0.333✗ | 0.000✓✓ | 470~ |
| computing | secondary | natural-expression | 2 | 0.500~ | 0.394✗ | 0.050✗ | 0.250✗ | 0.500✗ | 556✗ |
| computing | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 557✗ |
| computing | secondary | precise-topic | 7 | 1.000✓✓ | 0.800✓ | 0.243✗ | 0.810✓✓ | 0.000✓✓ | 962✗ |
| cooking-nutrition | primary | cross-topic | 1 | 1.000✓✓ | 1.000✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 447~ |
| cooking-nutrition | primary | imprecise-input | 1 | 0.125✗ | 0.343✗ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 338~ |
| cooking-nutrition | primary | natural-expression | 2 | 0.125✗ | 0.225✗ | 0.100✗ | 0.500~ | 0.500✗ | 413~ |
| cooking-nutrition | primary | pedagogical-intent | 1 | 0.500~ | 0.497✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 382~ |
| cooking-nutrition | primary | precise-topic | 4 | 0.800✓ | 0.586✗ | 0.200✗ | 0.750✓ | 0.000✓✓ | 406~ |
| cooking-nutrition | secondary | cross-topic | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 486~ |
| cooking-nutrition | secondary | imprecise-input | 1 | 1.000✓✓ | 0.918✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 329~ |
| cooking-nutrition | secondary | natural-expression | 2 | 0.667~ | 0.725~ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 421~ |
| cooking-nutrition | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 396~ |
| cooking-nutrition | secondary | precise-topic | 6 | 1.000✓✓ | 0.916✓✓ | 0.167✗ | 0.917✓✓ | 0.000✓✓ | 500~ |
| design-technology | primary | cross-topic | 1 | 0.167✗ | 0.280✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 410~ |
| design-technology | primary | imprecise-input | 1 | 0.250✗ | 0.450✗ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 456~ |
| design-technology | primary | natural-expression | 2 | 0.500~ | 0.169✗ | 0.050✗ | 0.250✗ | 0.500✗ | 401~ |
| design-technology | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 359~ |
| design-technology | primary | precise-topic | 5 | 0.750✓ | 0.737~ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 483~ |
| design-technology | secondary | cross-topic | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 439~ |
| design-technology | secondary | imprecise-input | 1 | 1.000✓✓ | 0.787✓ | 0.100✗ | 0.500~ | 0.000✓✓ | 395~ |
| design-technology | secondary | natural-expression | 2 | 0.321✗ | 0.273✗ | 0.150✗ | 0.667✓ | 0.000✓✓ | 649✗ |
| design-technology | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 341~ |
| design-technology | secondary | precise-topic | 6 | 0.479✗ | 0.578✗ | 0.233✗ | 0.778✓ | 0.000✓✓ | 435~ |
| english | primary | cross-topic | 1 | 1.000✓✓ | 0.956✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 608✗ |
| english | primary | imprecise-input | 1 | 0.167✗ | 0.193✗ | 0.100✗ | 0.333✗ | 0.000✓✓ | 799✗ |
| english | primary | natural-expression | 3 | 0.750✓ | 0.724~ | 0.233✗ | 0.778✓ | 0.000✓✓ | 843✗ |
| english | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 648✗ |
| english | primary | precise-topic | 10 | 0.583~ | 0.487✗ | 0.180✗ | 0.600✓ | 0.200~ | 818✗ |
| english | secondary | cross-topic | 1 | 0.100✗ | 0.083✗ | 0.100✗ | 0.333✗ | 0.000✓✓ | 776✗ |
| english | secondary | imprecise-input | 3 | 0.548~ | 0.534✗ | 0.200✗ | 0.667✓ | 0.000✓✓ | 444~ |
| english | secondary | natural-expression | 8 | 0.333✗ | 0.264✗ | 0.087✗ | 0.260✗ | 0.500✗ | 900✗ |
| english | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 642✗ |
| english | secondary | precise-topic | 45 | 0.650~ | 0.573✗ | 0.198✗ | 0.661✓ | 0.067✓ | 700✗ |
| french | primary | cross-topic | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 391~ |
| french | primary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 322~ |
| french | primary | natural-expression | 2 | 0.071✗ | 0.056✗ | 0.050✗ | 0.250✗ | 0.500✗ | 468~ |
| french | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 468~ |
| french | primary | precise-topic | 5 | 0.654~ | 0.613~ | 0.180✗ | 0.800✓ | 0.000✓✓ | 514✗ |
| french | secondary | cross-topic | 2 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 402~ |
| french | secondary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 304~ |
| french | secondary | natural-expression | 2 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 535✗ |
| french | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 469~ |
| french | secondary | precise-topic | 4 | 0.525~ | 0.487✗ | 0.125✗ | 0.542~ | 0.250✗ | 353~ |
| geography | primary | cross-topic | 1 | 1.000✓✓ | 0.834✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 316~ |
| geography | primary | imprecise-input | 1 | 0.500~ | 0.497✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 288✓ |
| geography | primary | natural-expression | 2 | 0.750✓ | 0.695~ | 0.150✗ | 0.750✓ | 0.000✓✓ | 408~ |
| geography | primary | pedagogical-intent | 1 | 1.000✓✓ | 0.787✓ | 0.100✗ | 0.500~ | 0.000✓✓ | 432~ |
| geography | primary | precise-topic | 5 | 0.767✓ | 0.592✗ | 0.140✗ | 0.700✓ | 0.000✓✓ | 591✗ |
| geography | secondary | cross-topic | 1 | 0.333✗ | 0.581✗ | 0.300~ | 1.000✓✓ | 0.000✓✓ | 410~ |
| geography | secondary | imprecise-input | 1 | 0.500~ | 0.418✗ | 0.200✗ | 0.667✓ | 0.000✓✓ | 409~ |
| geography | secondary | natural-expression | 2 | 0.225✗ | 0.255✗ | 0.150✗ | 0.500~ | 0.000✓✓ | 399~ |
| geography | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 374~ |
| geography | secondary | precise-topic | 10 | 0.933✓✓ | 0.633~ | 0.180✗ | 0.600✓ | 0.000✓✓ | 811✗ |
| german | secondary | cross-topic | 2 | 0.306✗ | 0.367✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 399~ |
| german | secondary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 362~ |
| german | secondary | natural-expression | 2 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 462~ |
| german | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 466~ |
| german | secondary | precise-topic | 4 | 0.211✗ | 0.268✗ | 0.100✗ | 0.458~ | 0.250✗ | 360~ |
| history | primary | cross-topic | 1 | 1.000✓✓ | 0.956✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 256✓ |
| history | primary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 295✓ |
| history | primary | natural-expression | 2 | 0.321✗ | 0.309✗ | 0.150✗ | 0.583~ | 0.000✓✓ | 439~ |
| history | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 529✗ |
| history | primary | precise-topic | 4 | 0.875✓ | 0.821✓ | 0.275✗ | 0.875✓✓ | 0.000✓✓ | 433~ |
| history | secondary | cross-topic | 2 | 0.500~ | 0.454✗ | 0.100✗ | 0.500~ | 0.500✗ | 406~ |
| history | secondary | imprecise-input | 1 | 1.000✓✓ | 0.815✓ | 0.300~ | 1.000✓✓ | 0.000✓✓ | 357~ |
| history | secondary | natural-expression | 2 | 0.625~ | 0.588✗ | 0.300~ | 1.000✓✓ | 0.000✓✓ | 489~ |
| history | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 508✗ |
| history | secondary | precise-topic | 12 | 0.680~ | 0.636~ | 0.217✗ | 0.750✓ | 0.083✓ | 583✗ |
| maths | primary | cross-topic | 2 | 0.500~ | 0.356✗ | 0.100✗ | 0.333✗ | 0.500✗ | 584✗ |
| maths | primary | imprecise-input | 1 | 0.500~ | 0.342✗ | 0.100✗ | 0.333✗ | 0.000✓✓ | 265✓ |
| maths | primary | natural-expression | 3 | 0.067✗ | 0.030✗ | 0.033✗ | 0.111✗ | 0.667✗ | 632✗ |
| maths | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 498~ |
| maths | primary | precise-topic | 31 | 0.615~ | 0.507✗ | 0.174✗ | 0.618✓ | 0.097✓ | 914✗ |
| maths | secondary | cross-topic | 2 | 0.417✗ | 0.431✗ | 0.200✗ | 0.667✓ | 0.000✓✓ | 1035✗ |
| maths | secondary | imprecise-input | 4 | 1.000✓✓ | 0.780✓ | 0.225✗ | 0.792✓ | 0.000✓✓ | 532✗ |
| maths | secondary | natural-expression | 9 | 0.388✗ | 0.409✗ | 0.200✗ | 0.667✓ | 0.111~ | 905✗ |
| maths | secondary | pedagogical-intent | 2 | 0.350✗ | 0.276✗ | 0.100✗ | 0.333✗ | 0.000✓✓ | 533✗ |
| maths | secondary | precise-topic | 59 | 0.793✓ | 0.726~ | 0.256✗ | 0.856✓✓ | 0.017✓✓ | 1108✗ |
| music | primary | cross-topic | 1 | 1.000✓✓ | 0.731~ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 328~ |
| music | primary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 333~ |
| music | primary | natural-expression | 2 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 336~ |
| music | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 398~ |
| music | primary | precise-topic | 5 | 0.722✓ | 0.613~ | 0.160✗ | 0.800✓✓ | 0.000✓✓ | 522✗ |
| music | secondary | cross-topic | 2 | 0.500~ | 0.321✗ | 0.100✗ | 0.500~ | 0.500✗ | 384~ |
| music | secondary | imprecise-input | 1 | 1.000✓✓ | 0.932✓✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 473~ |
| music | secondary | natural-expression | 2 | 1.000✓✓ | 0.853✓✓ | 0.200✗ | 0.750✓ | 0.000✓✓ | 268✓ |
| music | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 397~ |
| music | secondary | precise-topic | 6 | 0.708✓ | 0.658~ | 0.250✗ | 0.833✓✓ | 0.167~ | 404~ |
| physical-education | primary | cross-topic | 1 | 0.250✗ | 0.145✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 397~ |
| physical-education | primary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 336~ |
| physical-education | primary | natural-expression | 3 | 0.048✗ | 0.087✗ | 0.033✗ | 0.167✗ | 0.667✗ | 389~ |
| physical-education | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 849✗ |
| physical-education | primary | precise-topic | 14 | 0.526~ | 0.429✗ | 0.143✗ | 0.554~ | 0.214✗ | 491~ |
| physical-education | secondary | cross-topic | 2 | 0.167✗ | 0.253✗ | 0.100✗ | 0.500~ | 0.500✗ | 415~ |
| physical-education | secondary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 485~ |
| physical-education | secondary | natural-expression | 2 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 383~ |
| physical-education | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 882✗ |
| physical-education | secondary | precise-topic | 6 | 0.492✗ | 0.394✗ | 0.133✗ | 0.472~ | 0.167~ | 619✗ |
| religious-education | primary | cross-topic | 1 | 0.125✗ | 0.248✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 387~ |
| religious-education | primary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 375~ |
| religious-education | primary | natural-expression | 2 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 397~ |
| religious-education | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 438~ |
| religious-education | primary | precise-topic | 5 | 0.733✓ | 0.756✓ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 366~ |
| religious-education | secondary | cross-topic | 2 | 0.063✗ | 0.124✗ | 0.050✗ | 0.250✗ | 0.500✗ | 430~ |
| religious-education | secondary | imprecise-input | 1 | 0.143✗ | 0.181✗ | 0.100✗ | 0.333✗ | 0.000✓✓ | 284✓ |
| religious-education | secondary | natural-expression | 2 | 0.250✗ | 0.073✗ | 0.050✗ | 0.167✗ | 0.500✗ | 549✗ |
| religious-education | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 443~ |
| religious-education | secondary | precise-topic | 4 | 0.625~ | 0.500✗ | 0.125✗ | 0.500~ | 0.250✗ | 447~ |
| science | primary | cross-topic | 1 | 0.250✗ | 0.339✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 336~ |
| science | primary | imprecise-input | 1 | 0.333✗ | 0.581✗ | 0.300~ | 1.000✓✓ | 0.000✓✓ | 376~ |
| science | primary | natural-expression | 3 | 0.733✓ | 0.536✗ | 0.133✗ | 0.500~ | 0.000✓✓ | 414~ |
| science | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 447~ |
| science | primary | precise-topic | 11 | 0.932✓✓ | 0.891✓✓ | 0.318~ | 0.947✓✓ | 0.000✓✓ | 728✗ |
| science | secondary | cross-topic | 1 | 1.000✓✓ | 0.896✓✓ | 0.300~ | 1.000✓✓ | 0.000✓✓ | 467~ |
| science | secondary | imprecise-input | 2 | 0.750✓ | 0.492✗ | 0.150✗ | 0.500~ | 0.000✓✓ | 406~ |
| science | secondary | natural-expression | 2 | 0.571~ | 0.627~ | 0.200✗ | 0.833✓✓ | 0.000✓✓ | 418~ |
| science | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 477~ |
| science | secondary | precise-topic | 30 | 0.825✓ | 0.725~ | 0.230✗ | 0.783✓ | 0.000✓✓ | 746✗ |
| spanish | primary | cross-topic | 1 | 0.500~ | 0.627~ | 0.200✗ | 1.000✓✓ | 0.000✓✓ | 340~ |
| spanish | primary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 355~ |
| spanish | primary | natural-expression | 2 | 0.183✗ | 0.292✗ | 0.100✗ | 0.500~ | 0.000✓✓ | 478~ |
| spanish | primary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 465~ |
| spanish | primary | precise-topic | 5 | 0.440✗ | 0.438✗ | 0.100✗ | 0.500~ | 0.200~ | 437~ |
| spanish | secondary | cross-topic | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 328~ |
| spanish | secondary | imprecise-input | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 394~ |
| spanish | secondary | natural-expression | 2 | 0.500~ | 0.365✗ | 0.100✗ | 0.500~ | 0.500✗ | 465~ |
| spanish | secondary | pedagogical-intent | 1 | 0.000✗ | 0.000✗ | 0.000✗ | 0.000✗ | 1.000✗ | 470~ |
| spanish | secondary | precise-topic | 4 | 0.150✗ | 0.153✗ | 0.075✗ | 0.375✗ | 0.250✗ | 403~ |

---

#### Category Performance Summary (Across All Subjects)

| Category | Queries | Avg MRR | Avg Zero% | Key Insight |
|----------|---------|---------|-----------|-------------|
| **precise-topic** | 252 | 0.68 | 5.8% | Strongest category — curriculum-aligned queries work well |
| **cross-topic** | 30 | 0.43 | 33.3% | Cross-curricular queries struggle |
| **natural-expression** | 60 | 0.32 | 35.0% | Natural language queries underperform |
| **imprecise-input** | 30 | 0.36 | 33.3% | Fuzzy/misspelled queries need improvement |
| **pedagogical-intent** | 30 | 0.09 | 86.7% | Pedagogical queries fail almost universally |

**Critical Pattern**: `pedagogical-intent` category fails across nearly all subjects (86.7% zero-hit rate). These are queries like "differentiation strategies for X" or "assessment ideas for Y" — the search system cannot match pedagogical intent to lesson content.

---

**Decision**: ✅ **PHASE 8 COMPLETE** — Comprehensive baselines established for all 30 entries with 509 queries.

**Next Steps**:

1. Investigate MFL performance (ELSER multilingual limitation)
2. Improve PE and RE ground truths or search configuration
3. Address high zero-hit rate subjects

---

### 2026-01-08: Ground Truth Remediation — COMPLETE

**Context**: Following discovery of ground truth quality issues, comprehensive remediation undertaken. All 431 queries across 30 entries now pass all 17 validation checks.

**What Was Built**:

1. **Type Generation Infrastructure** (`ground-truths/generation/`):
   - `bulk-data-parser.ts` — Parse bulk JSON with Result pattern and type guards
   - `type-emitter.ts` — Generate branded `AnyLessonSlug` type + `SLUG_TO_SUBJECT_MAP`
   - `schema-emitter.ts` — Generate Zod schemas for runtime validation
   - `generate-ground-truth-types.ts` — Orchestrates generation

2. **Validation Script** (`evaluation/validation/validate-ground-truth.ts`):
   - **17 comprehensive validation checks** (all blocking errors, no warnings)
   - Validates against 12,320 slugs from bulk data
   - Cross-subject contamination detection
   - Run with: `pnpm ground-truth:validate`

3. **Analysis Script** (`evaluation/validation/analyze-ground-truth-quality.ts`):
   - Detailed breakdown by entry showing which queries have issues
   - Run with: `pnpm ground-truth:analyze` (add `--verbose` for query lists)

4. **Generated Output** (`ground-truths/generated/`):
   - `lesson-slugs-by-subject.ts` — Branded types, Sets, subject map
   - `ground-truth-schemas.ts` — Zod schemas for validation

**17 Validation Checks** (all blocking):

| # | Check | Error Category |
|---|-------|----------------|
| 1 | Slug existence | `invalid-slug` |
| 2 | Non-empty relevance | `empty-relevance` |
| 3 | Valid scores | `invalid-score` |
| 4 | No duplicate queries | `duplicate-query` |
| 5 | No duplicate slugs | `duplicate-slug-in-query` |
| 6 | Query length (3-10 words) | `short-query` / `long-query` |
| 7 | Category required | `missing-category` |
| 8 | **Priority required** | `missing-priority` |
| 9 | Slug format | `slug-format` |
| 10 | Cross-subject | `cross-subject` |
| 11 | Phase consistency | `phase-mismatch` |
| 12 | KS4 consistency | `ks4-in-primary` |
| 13 | Minimum slugs (≥2) | `single-slug` |
| 14 | **Score variety (2+ slugs)** | `uniform-scores` |
| 15 | Highly relevant (score=3) | `no-highly-relevant` |
| 16 | Zod schema | `schema-validation` |
| 17 | Entry duplicates | (entry-level) |

**Final Results**:

| Metric | Start | End | Status |
|--------|-------|-----|--------|
| Invalid slugs | 66 | 0 | ✅ |
| Empty expectedRelevance | 12 | 0 | ✅ |
| Missing categories | 130 | 0 | ✅ |
| Short queries | 78 | 0 | ✅ |
| Uniform scores | 47 | 0 | ✅ |
| Missing priority | 34 | 0 | ✅ |
| Single-slug queries | 10 | 0 | ✅ |
| No score=3 | 21 | 0 | ✅ |
| **Total errors** | **408** | **0** | ✅ |

**Decision**: ✅ **REMEDIATION COMPLETE**

All 431 queries pass all 17 validation checks. Ground truths are production-ready for benchmarking.

**Files Changed**: 40+ ground truth files across all subjects + validation infrastructure

**Documentation Updated**:

- ADR-085: Ground Truth Validation Discipline — all 17 checks documented
- GROUND-TRUTH-PROCESS.md — updated with all validation requirements

---

### 2026-01-08: Ground Truth Quality Issues Discovered — DISCOVERY ENTRY

**Context**: During post-ingestion benchmark analysis, discovered fundamental issues with ground truth validation infrastructure and data quality. This entry documents the original discovery; see above for remediation progress.

**Original Findings**:

| Issue | Details | Impact |
|-------|---------|--------|
| **Validation script broken** | Expects `lesson_slug` in top-level array, actual is `lessonSlug` in `.lessons[]` | Script reports false positives |
| **Missing slugs** | 66 of 1278 (5.2%) don't exist in bulk data | Guaranteed MRR=0 |
| **Empty expectedRelevance** | e.g., "mitosis meiosis cell division" has `{}` | Cannot calculate metrics |
| **Fabricated slugs** | e.g., An Inspector Calls slugs invented | False failures |

**Root Cause**: Bulk download format changed Dec 30, 2025, but validation script was not updated.

**Decision**: 🔄 **REMEDIATION INITIATED** — See entry above for progress.

---

### 2026-01-07: Test Coverage Complete + Documentation Cleanup

**Context**: Completed all test coverage gaps identified during Result pattern compliance work. Also cleaned up outdated documentation references to deprecated `ingest:all` command.

**Test Coverage Added**:

| Component | Tests Added | File |
|-----------|-------------|------|
| `safeGet` | 3 unit tests | `src/adapters/sdk-safe-get.unit.test.ts` |
| SDK API Methods (success) | 8 unit tests | `src/adapters/sdk-api-methods.unit.test.ts` |

**Documentation Updates**:

- Updated `INGESTION-GUIDE.md`, `scripts/README.md`, `operations/README.md` — replaced `pnpm ingest:all` with `pnpm es:ingest-live -- --all`
- Updated `ADR-069` — marked as superseded, removed outdated usage patterns

**Decision**: ✅ **COMPLETE** — All infrastructure ready for Phase 8.

**Next**: Run `pnpm benchmark --all` against live ES.

---

### 2026-01-06: Unified Evaluation Infrastructure Built (ADR-098)

**Context**: Built M3 Phases 5b-7. Established `GROUND_TRUTH_REGISTRY` as single source of truth, unified `benchmark.ts` as the only evaluation tool, and clarified the separation between evaluation (measure quality) and smoke tests (verify behavior). **Needs validation via Phase 8 baseline runs.**

**What Was Built**:

1. **Ground Truth Registry** (`src/lib/search-quality/ground-truth/registry/`)
   - `GROUND_TRUTH_ENTRIES`: 28 entries covering 16 subjects × primary/secondary phases
   - Type-safe accessors: `getAllGroundTruthEntries()`, `getGroundTruthEntry()`
   - Phase model: `Phase = 'primary' | 'secondary'` (KS4 is part of secondary)
   - KS4-specific queries have `keyStage: 'ks4'` for correct ES filtering

2. **Unified Benchmark Tool** (`evaluation/analysis/benchmark.ts`)
   - Single entry point for all search quality measurement
   - Usage: `pnpm benchmark --all | --subject X --phase Y`
   - Reports MRR, NDCG@10, zero-hit rate per entry

3. **Comprehensive Ground Truths**
   - 14 primary subjects with curated queries
   - All secondary subjects with queries
   - KS4-specific: maths tiers, science subjects, english set texts, geography fieldwork, history historic environments

**What Was Deleted**:

- **10 performance-measuring smoke tests**: `search-quality.smoke.test.ts`, `hard-query-baseline.smoke.test.ts`, etc.
- **5 fragmented analysis scripts**: `analyze-per-category.ts`, `analyze-diagnostic-queries.ts`, etc.

**Decision**: 🔄 **INFRASTRUCTURE BUILT, READY FOR TESTING**

| Before | After |
|--------|-------|
| 6 analysis scripts | 1 unified `benchmark.ts` |
| Hardcoded mappings | Registry-driven |
| Maths KS4 focused | All 28 subject/phase entries |
| Performance smoke tests | Behavior-focused smoke tests |

**Documentation**:

- ADR-098: Ground Truth Registry as Single Source of Truth
- Updated: `evaluation/analysis/README.md`

**Next**: Phase 8 — Run `pnpm benchmark --all` against live ES, update `evaluation/baselines/baselines.json` with all metrics (MRR, NDCG@10, Precision@10, Recall@10, Zero-Hit Rate, p95 Latency).

---

### 2026-01-03: M3 Comprehensive Baselines — All Core and Humanities Subjects Measured

**Context**: Final phase of M3 baseline completion. Fixed the `analyze-cross-curriculum.ts` script to support per-key-stage query filtering, enabling accurate measurement of subject/KS-specific ground truths. Previously the script loaded ALL queries for a subject but filtered ES by key stage, causing false negatives.

**Script Fix**: Updated to use per-KS query exports (e.g., `ENGLISH_KS4_ALL_QUERIES` instead of `ENGLISH_ALL_QUERIES`) ensuring queries match the key stage being searched.

**Method**: Ran `analyze-cross-curriculum.ts` for each subject/KS combination with per-KS query filtering.

**Results — English (66 queries across KS1-4)**:

| Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Multi | Col | Status |
|-----------|---------|-------------|-----|-----|-----|-------|-----|--------|
| KS1 | 14 | **0.131** | 0.136 | 0.000 | 0.333 | — | 0.000 | ❌ Poor |
| KS2 | 14 | **0.107** | 0.045 | 0.000 | 0.000 | — | 1.000 | ❌ Poor |
| KS3 | 17 | **0.742** | 0.818 | 0.500 | 0.333 | — | 0.333 | ✅ Good |
| KS4 | 35 | **0.394** | 0.401 | 0.583 | 0.000 | 0.000 | 1.000 | ⚠️ Acceptable |

**Results — Science (35 queries across KS2-3)**:

| Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Multi | Col | Status |
|-----------|---------|-------------|-----|-----|-----|-------|-----|--------|
| KS2 | 15 | **0.852** | 0.938 | 0.333 | 0.200 | — | 1.000 | ✅ Excellent |
| KS3 | 20 | **0.899** | 0.874 | 1.000 | 1.000 | 1.000 | — | ✅ Excellent |

**Results — History (16 queries across KS2-3)**:

| Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Status |
|-----------|---------|-------------|-----|-----|-----|--------|
| KS2 | 6 | **0.667** | 0.800 | 0.000 | — | ✅ Good |
| KS3 | 10 | **0.950** | 0.938 | 1.000 | 1.000 | ✅ Excellent |

**Results — Geography KS3 (9 queries)**:

| Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Multi | Status |
|-----------|---------|-------------|-----|-----|-----|-------|--------|
| KS3 | 9 | **0.759** | 0.806 | 0.500 | 0.500 | 1.000 | ✅ Good |

**Results — Religious Education KS3 (7 queries)**:

| Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Status |
|-----------|---------|-------------|-----|-----|-----|--------|
| KS3 | 7 | **0.667** | 0.667 | 0.333 | 1.000 | ✅ Good |

**Results — Maths KS4 (55 queries)**:

| Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Multi | Col | Status |
|-----------|---------|-------------|-----|-----|-----|-------|-----|--------|
| KS4 | 55 | **0.894** | 0.930 | 1.000 | 0.833 | 0.750 | 0.500 | ✅ Excellent |

**Key Findings**:

1. **Primary English critically underperforms** — KS1 (0.131) and KS2 (0.107) ground truths may target content that doesn't exist in those key stages
2. **Science performs excellently** — Both KS2 (0.852) and KS3 (0.899) exceed all expectations
3. **History KS3 is top performer** — 0.950 MRR shows strong curriculum term alignment
4. **English KS4 needs synonym work** — An Inspector Calls queries fail completely (0.000 MRR for synonym category)
5. **Maths confirmed excellent** — 0.894 overall MRR validates hybrid search architecture

**Decision**: ✅ M3 COMPREHENSIVE BASELINES COMPLETE — All 25 subject/KS combinations now measured

**Files changed**:

- `evaluation/analysis/analyze-cross-curriculum.ts` — Fixed to support per-KS query filtering

---

### 2026-01-03: Cross-Curriculum Ground Truth Expansion — Languages Baseline

**Context**: M3 Phase 3 completion — established baseline MRR for Languages (French, Spanish, German). This is part of the comprehensive cross-curriculum ground truth expansion from KS4 Maths only (73 queries) to 200+ queries across 17 subjects.

**Method**: Created 18 ground truth queries (6 per language) covering naturalistic, misspelling, and synonym categories. All lesson slugs validated via Oak Curriculum MCP tools. Ran `analyze-cross-curriculum.ts` for each subject.

**Results — Languages Baseline (KS3)**:

| Subject | Naturalistic | Misspelling | Synonym | Overall MRR | Queries |
|---------|-------------|-------------|---------|-------------|---------|
| French  | 0.286 ❌    | 0.000 ❌    | 0.000 ❌ | **0.190**   | 6       |
| Spanish | 0.417 ⚠️    | 0.000 ❌    | 0.100 ❌ | **0.294**   | 6       |
| German  | 0.292 ❌    | 0.000 ❌    | 0.000 ❌ | **0.194**   | 6       |

**Key Findings**:

1. **Misspelling universally fails** — "grammer" (common misspelling of "grammar") not handled by fuzzy matching for language-specific vocabulary
2. **Synonym queries fail** — "saying no not" → negation, "action words" → verbs not bridged
3. **Naturalistic partially works** — Spanish performs best (0.417) due to more specific curriculum term matching
4. **French negation query succeeds** — "French negation ne pas" ranks #1, showing specific curriculum terms work well

**Query-Level Insights**:

| Query | Subject | Expected Result | Actual | Issue |
|-------|---------|-----------------|--------|-------|
| "French negation ne pas" | French | ne-pas-negation | ✅ Rank 1 | Curriculum terms work |
| "Spanish verb endings year 7" | Spanish | ar-verbs | ✅ Rank 1 | Specific + year works |
| "german grammer present tence" | German | present-tense-verbs | ❌ Not found | Misspelling not bridged |
| "French saying no not" | French | negation | ❌ Not found | Colloquial synonym gap |

**Decision**: ✅ BASELINE ESTABLISHED — Languages performance is poor but expected

**Implications**:

1. **Synonym gaps identified** — Need language-specific synonyms (negation↔"saying no", verbs↔"action words")
2. **Misspelling handling** — "grammer" is high-frequency typo, needs fuzzy expansion
3. **Cross-curriculum validation working** — New analysis script enables per-subject measurement

**Files changed**:

- `evaluation/analysis/analyze-cross-curriculum.ts` — NEW parameterised baseline script
- `src/lib/search-quality/ground-truth/french/` — NEW 6 queries
- `src/lib/search-quality/ground-truth/spanish/` — NEW 6 queries
- `src/lib/search-quality/ground-truth/german/` — NEW 6 queries

---

### 2026-01-03: Cross-Curriculum Ground Truth Expansion — Phase 4 Complete (All Remaining Subjects)

**Context**: M3 Phase 4 completion — established baselines for all remaining subjects (Computing, Art, Music, D&T, PE, Citizenship, Cooking & Nutrition). This completes the cross-curriculum ground truth expansion to 263 queries across 16 subjects.

**Method**: Created 57 additional ground truth queries covering naturalistic, misspelling, synonym, and colloquial categories. All lesson slugs validated via Oak Curriculum MCP tools.

**Results — Remaining Subjects Baseline**:

| Subject | Naturalistic | Misspelling | Synonym | Colloquial | Overall MRR | Queries |
|---------|-------------|-------------|---------|------------|-------------|---------|
| Computing (KS3) | 0.571 ✅ | 0.333 ⚠️ | 0.000 ❌ | — | **0.481** | 9 |
| Art (KS3) | 0.810 ✅ | 0.500 ✅ | 0.500 ✅ | — | **0.741** | 9 |
| Music (KS3) | 0.714 ✅ | 0.500 ✅ | — | 1.000 ✅ | **0.722** | 9 |
| D&T (KS3) | 0.806 ✅ | 1.000 ✅ | 1.000 ✅ | 0.500 ✅ | **0.815** | 9 |
| PE (KS3) | 0.450 ⚠️ | 0.000 ❌ | 0.500 ✅ | 0.000 ❌ | **0.356** | 9 |
| Citizenship (KS3) | 0.708 ✅ | 0.167 ❌ | 1.000 ✅ | — | **0.667** | 6 |
| Cooking (KS2) | 0.667 ✅ | 0.167 ❌ | — | 0.125 ❌ | **0.493** | 6 |

**Key Findings**:

1. **Design & Technology performs excellently** (0.815) — Curriculum-specific terminology well-indexed
2. **Art and Music perform well** (0.741, 0.722) — Creative subjects have good semantic coverage
3. **PE struggles with misspellings** (0.000) — "runing" not fuzzy-matched
4. **Computing synonym gap** (0.000) — "coding" → "programming" not bridged
5. **Consistent misspelling issues** — Multiple subjects fail on "grammer" and similar typos

**Decision**: ✅ PHASE 4 COMPLETE — All 16 subjects with bulk data now have ground truths

**Files changed**:

- `src/lib/search-quality/ground-truth/computing/` — NEW 9 queries
- `src/lib/search-quality/ground-truth/art/` — NEW 9 queries
- `src/lib/search-quality/ground-truth/music/` — NEW 9 queries
- `src/lib/search-quality/ground-truth/design-technology/` — NEW 9 queries
- `src/lib/search-quality/ground-truth/physical-education/` — NEW 9 queries
- `src/lib/search-quality/ground-truth/citizenship/` — NEW 6 queries
- `src/lib/search-quality/ground-truth/cooking-nutrition/` — NEW 6 queries
- `src/lib/search-quality/ground-truth/index.ts` — Updated with all subjects
- `evaluation/analysis/analyze-cross-curriculum.ts` — Updated subject mapping

**Complete Ground Truth Coverage (2026-01-03)**:

| Subject | Key Stage | Queries | Overall MRR | Status |
|---------|-----------|---------|-------------|--------|
| Maths | KS4 | 55 | 0.614 | ✅ Excellent |
| English | KS1-4 | 66 | TBD | ✅ Created |
| Science | KS2-3 | 35 | TBD | ✅ Created |
| History | KS2-3 | 16 | TBD | ✅ Created |
| Geography | KS3 | 9 | TBD | ✅ Created |
| Religious Education | KS3 | 7 | TBD | ✅ Created |
| French | KS3 | 6 | 0.190 | ❌ Poor |
| Spanish | KS3 | 6 | 0.294 | ❌ Poor |
| German | KS3 | 6 | 0.194 | ❌ Poor |
| Computing | KS3 | 9 | 0.481 | ⚠️ Acceptable |
| Art | KS3 | 9 | 0.741 | ✅ Good |
| Music | KS3 | 9 | 0.722 | ✅ Good |
| D&T | KS3 | 9 | 0.815 | ✅ Excellent |
| PE | KS3 | 9 | 0.356 | ❌ Poor |
| Citizenship | KS3 | 6 | 0.667 | ✅ Good |
| Cooking | KS2 | 6 | 0.493 | ⚠️ Acceptable |
| RSHE/PSHE | — | — | — | ⏸️ Deferred |
| **Total** | **All** | **263** | — | **M3 TARGET EXCEEDED** |

**Next Steps**:

- Run full baselines for English, Science, History, Geography, RE
- Document all results in current-state.md
- Identify cross-curriculum synonym gaps for Tier 2 work

---

### 2025-12-24: Tier 1 Exhausted — All Standard Approaches Verified

**Context**: Systematically verified all Tier 1 standard approaches following the ground truth correction. Goal was to exhaust all fundamental improvements before declaring Tier 1 complete.

**Verification Method**: For each approach, ran targeted search queries to verify functionality:

| Approach | Verification | Result |
|----------|-------------|--------|
| Single-word synonyms | `trig`, `factorise`, `pythag` | ✅ All work |
| Phrase synonyms | `straight line` at START/MIDDLE/END | ✅ All positions work |
| UK/US spelling | `center`→`centre`, `analyze`→`analyse` | ✅ ELSER handles |
| Abbreviations | `pythag`, `quad`, `diff` | ✅ All expand correctly |
| Technical vocabulary | `transposition`→`changing the subject` | ✅ Works |
| Stop words | Queries with/without `the`, `of` | ✅ No impact |
| Vocabulary gaps | Top 20 bulk download keywords | ✅ None critical |
| Intent-based queries | Root cause analysis | ⚠️ Exception granted |

**Intent-Based Exception**:

The two intent-based queries (MRR 0.229) cannot be fixed with Tier 1 approaches:

- "challenging extension work for able mathematicians" — needs difficulty metadata
- "visual introduction to vectors for beginners" — needs teaching approach metadata

These require Tier 4 (LLM query classification or metadata enrichment). Exception documented in [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md).

**Decision**: ✅ **TIER 1 EXHAUSTED**

| Criterion | Status |
|-----------|--------|
| Aggregate MRR ≥ 0.45 | ✅ 0.614 |
| No category < 0.25 without exception | ✅ Intent-based exception granted |
| Standard approaches checklist | ✅ All items checked |
| De facto plateau | ✅ No more experiments possible |

**Next Steps**: Tier 2 (Document Relationships) can proceed when prioritised.

---

### 2025-12-24: TRUE Baseline Established — TIER 1 TARGET MET

**Context**: Following the ground truth corrections on 2025-12-23, ran evaluation scripts with corrected ground truth to establish TRUE baseline metrics.

**Method**: Fixed dotenv paths in `analyze-per-category.ts` and `analyze-diagnostic-queries.ts` (were resolving to wrong directories), then ran:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # 15 hard queries by category
pnpm eval:diagnostic      # 18 diagnostic queries by pattern
```

**Results — Per-Category (15 queries)**:

| Category | Previous (Invalid GT) | Verified (Corrected GT) | Delta | Status |
|----------|----------------------|------------------------|-------|--------|
| naturalistic | 0.567 | **0.722** | +27% | ✅ Good |
| misspelling | 0.611 | **0.833** | +36% | ✅ Excellent |
| synonym | 0.167 | **0.611** | +266% | ✅ Good |
| multi-concept | 0.083 | **0.625** | +653% | ✅ Good |
| colloquial | 0.500 | **0.500** | 0% | ✅ Good |
| intent-based | 0.167 | **0.229** | +37% | ❌ Poor |
| **Overall** | 0.369 | **0.614** | +66% | ✅ **EXCEEDS Tier 1 target** |

**Results — Diagnostic Patterns (18 queries)**:

| Pattern Category | MRR | Success Rate | Key Finding |
|------------------|-----|--------------|-------------|
| Single-word synonym | 0.500 | 100% | Both queries succeed |
| Phrase synonym (all positions) | 0.500 | 100% | All 5 queries succeed |
| Multi-word curriculum term | 0.333 | 100% | Works, rank 3 |
| Spoken formula | 0.333 | 100% | Works, rank 3 |
| Concept + Method | 1.000 | 100% | **Both rank #1** |
| Three/Four concepts | 1.000 | 100% | Keyword density helps |
| Abstract intersection | 0.000 | 0% | Too vague |
| **Synonym overall** | 0.463 | 100% | All 9 in top 10 |
| **Multi-concept overall** | 0.623 | 78% | 7/9 in top 10 |

**Decision**: ✅ **TIER 1 TARGET MET** — System exceeds all targets; exhaustion pending

**Critical Insight**: The ground truth correction revealed the system was **already performing much better than measured**. The "failures" in previous measurements were artifacts of scoring against non-existent lessons.

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Lesson Hard MRR | ≥0.45 | 0.614 | ✅ +36% above target |
| Lesson Std MRR | ≥0.92 | 0.944 | ✅ Met |
| Unit Hard MRR | ≥0.50 | 0.856 | ✅ Met |
| Unit Std MRR | ≥0.92 | 0.988 | ✅ Met |

**Implications**:

1. **Tier 1 TARGET MET** — Exit criteria met; standard approaches must still be exhausted
2. **B.4 + B.5 + Synonyms are all working** — Verified contributing to 0.614 overall
3. **Semantic reranking decision was correct** — System works without AI; AI optional
4. **Intent-based is only failing category** (0.229) — Targeted improvement possible but not blocking

**Files changed**:

- `evaluation/analysis/analyze-per-category.ts` — Fixed dotenv path (was `../../../` should be `../../`)
- `evaluation/analysis/analyze-diagnostic-queries.ts` — Fixed dotenv path

**Documentation updated**:

- `current-state.md` — All metrics verified
- `EXPERIMENT-LOG.md` — This entry

---

### 2025-12-23: Ground Truth Corrections — CRITICAL DISCOVERY

**Context**: During B.5 validation, discovered that the search was working correctly for some queries, but the "expected" lesson slugs in ground truth didn't exist in the Oak Curriculum API. This led to a comprehensive audit.

**Discovery**: **63 ground truth slugs (15% of the data) were invalid** — lesson references that don't exist.

| Category | Affected Queries | Missing Slugs |
|----------|-----------------|---------------|
| synonym | 9 queries | 29 slugs |
| multi-concept | 9 queries | 24 slugs |
| naturalistic | 3 queries | 3 slugs |
| colloquial | 2 queries | 2 slugs |
| intent-based | 1 query | 3 slugs |
| misspelling | 2 queries | 2 slugs |

**Root Cause**: Ground truth was created using assumed slug naming conventions rather than verified API data.

**Impact**: ALL previous MRR measurements are suspect:

- "Failures" may have been correct — searching for lessons that don't exist
- "Successes" may have been luck — correct by accident
- The semantic reranking rejection (-16.8%) may be WRONG

**Actions Taken**:

1. ✅ **63 slugs corrected** in `hard-queries.ts`, `diagnostic-synonym-queries.ts`, `diagnostic-multi-concept-queries.ts`
2. ✅ **Integration test created** (`ground-truth.integration.test.ts`) validates all slugs exist via Oak API
3. ✅ **Unit ground truth validated** — all 36 slugs exist
4. ✅ **Sequence ground truth created** — 41 queries, ~50 slugs, all validated
5. ✅ **All quality gates pass** including new validation test

**Decision**: 🔴 **ALL EXPERIMENTS MUST BE RE-RUN**

This is not a setback — it's a quality improvement. We now have:

- Validated ground truth (can trust measurements)
- Preventative test (can't happen again)
- Complete coverage (lessons, units, sequences)

**What We Preserve**:

- ✅ All implementations (B.4, B.5, synonyms)
- ✅ All architectural decisions (ADR-082, ADR-083, ADR-084)
- ✅ All learnings (ES synonym filter works for tokens not phrases)
- ✅ The tier-based strategy

**What Needs Re-Evaluation**:

- ⚠️ Semantic reranking rejection — may have been wrong
- ⚠️ B.4 noise filtering improvement (+16.8%) — may be different
- ⚠️ B.5 phrase boosting — never measured
- ⚠️ All baseline metrics — need true values

**Next Steps**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Establish TRUE baseline
pnpm eval:diagnostic      # Detailed pattern analysis
```

Then: Update all documentation with VERIFIED metrics.

**Files changed**:

- `hard-queries.ts` — 15 slugs corrected
- `diagnostic-synonym-queries.ts` — 9 slugs corrected
- `diagnostic-multi-concept-queries.ts` — 9 slugs corrected
- `ground-truth.integration.test.ts` — NEW validation test
- `sequences/types.ts` — NEW
- `sequences/standard-queries.ts` — NEW (24 queries)
- `sequences/hard-queries.ts` — NEW (17 queries)
- `sequences/index.ts` — NEW

**Documentation**: [ground-truth-corrections.md](ground-truth-corrections.md)

---

### 2025-12-23: B.5 Phrase Query Enhancement — IMPLEMENTATION COMPLETE, VALIDATION PENDING

**Context**: Implemented ADR-084 Phrase Query Boosting to address the root cause of phrase synonym failure identified in the diagnostic analysis. ES synonym filter works for single tokens only — after tokenization, "straight line" becomes ["straight", "line"], so phrase rules never match. ~40% of 163 synonyms are multi-word phrases that were non-functional.

**Implementation**:

1. **SDK Phrase Vocabulary Export**: New `buildPhraseVocabulary()` function extracts multi-word terms from synonym data
2. **Phrase Detection**: New pure function `detectCurriculumPhrases(query: string)` with TDD unit tests
3. **Phrase Boosters**: `createPhraseBoosters()` creates `match_phrase` queries for detected phrases
4. **RRF Integration**: BM25 retrievers now include phrase boost in `bool.should` when phrases detected

**Decision**: ⏸️ PENDING — Quality gates NOT verified, experiment NOT run

**⚠️ CRITICAL**: The code is merged but:

1. Quality gates have NOT been run after the merge
2. The experiment to measure MRR impact has NOT been run

The work is incomplete. Both must be done before this can be marked complete.

**Baseline (BEFORE phrase boosting — needs re-measurement)**:

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Synonym MRR | 0.167 | ??? | Target: ≥0.40 |
| Multi-concept MRR | 0.083 | ??? | Target: ≥0.25 |
| Overall Lesson Hard MRR | 0.369 | ??? | Target: ≥0.45 |

**Key insights**:

1. **Schema-first preserved**: Phrase vocabulary flows from SDK synonyms (single source of truth)
2. **TDD approach**: Unit tests written first, covering detection basics, position independence, multiple phrases, case insensitivity, edge cases
3. **Existing pattern reused**: Phrase boosters use same `bool.should` structure as existing query patterns
4. **No index changes**: Pure query-time enhancement, no reindexing required

**Files changed**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts` — Added `buildPhraseVocabulary()`
- `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` — Exported new function
- `apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.ts` — NEW
- `apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.unit.test.ts` — NEW
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts` — Added phrase boosters
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-builders.ts` — Integrated phrase detection

**ADR**: [ADR-084: Phrase Query Boosting for Multi-Word Synonym Support](../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)

**⚠️ IMMEDIATE ACTION REQUIRED**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:diagnostic      # Measure MRR with phrase boosting
pnpm eval:per-category    # Get full breakdown
```

Then update this entry with actual before/after metrics and change decision to ✅ ACCEPTED or ❌ REJECTED based on results.

---

### 2025-12-23: Diagnostic Query Analysis (18 Queries)

**Context**: Created 18 diagnostic queries (9 synonym, 9 multi-concept) to granularly understand why synonym (0.167) and multi-concept (0.083) categories have poor MRR. Analyzed by pattern to identify specific failure modes vs success patterns.

#### Synonym Diagnostics (Overall MRR: 0.204)

| Pattern | Count | MRR | Status | Finding |
|---------|-------|-----|--------|---------|
| Single-word synonym | 2 | 0.500 | ✅ Good | "trig", "factorise" both work (rank 2) |
| Phrase synonym (all positions) | 3 | 0.000 | ❌ FAIL | "straight line" fails in START/END/MIDDLE |
| Formal synonym | 1 | 0.500 | ✅ Good | "transposition" works (rank 2) |
| Spoken formula | 1 | 0.333 | ✅ Good | "y equals mx plus c" works (rank 3) |
| Multiple synonyms | 1 | 0.000 | ❌ FAIL | "rules" + "index" both fail |
| Multi-word curriculum term | 1 | 0.000 | ❌ FAIL | "circle rules" vs "circle theorems" |

#### Multi-Concept Diagnostics (Overall MRR: 0.343)

| Pattern | Count | MRR | Status | Finding |
|---------|-------|-----|--------|---------|
| Concept + Method | 2 | 1.000 | ✅ EXCELLENT | Both rank #1! |
| Four concepts | 1 | 0.500 | ✅ Good | Keyword density helps |
| Implicit intersection | 1 | 0.333 | ✅ Good | Works with "with" |
| Three concepts | 1 | 0.250 | ⚠️ Marginal | Rank 4 |
| Explicit AND | 1 | 0.000 | ❌ FAIL | Too generic |
| Three geometry concepts | 1 | 0.000 | ❌ FAIL | Lacks method specificity |
| Single concept "graphs" | 1 | 0.000 | ❌ FAIL | Too broad |
| Abstract intersection | 1 | 0.000 | ❌ FAIL | Too abstract |

**Decision**: ✅ DIAGNOSIS COMPLETE — Clear root cause identified for both categories

**Critical findings**:

1. **🔥 Synonym root cause**: ES synonym filter works for **single tokens only**, not **phrase synonyms**. After tokenization, "straight line" becomes ["straight", "line"], so the phrase rule "straight line => linear" never matches. ~40% of our 163 synonym rules are phrase-based and currently non-functional.

2. **🎯 Multi-concept insight**: The system **already works well** for structured queries (concept + method). Failures are in generic/abstract queries without method specificity. The issue is NOT multi-concept scoring — it's query structure.

3. **Next step clarity**: B.5 should focus on **phrase query enhancement** (match_phrase boosting for curriculum terms), NOT complex multi-concept scoring logic.

**Files changed**:

- Added `diagnostic-queries.ts` with 18 queries
- Added `analyze-diagnostic-queries.ts` script
- Added `DIAGNOSTIC-QUERIES.md` documentation

**What this teaches us**:

- Always measure granularly — aggregate MRR hides critical patterns
- Assumptions about "working" systems need validation (synonyms were deployed but not working for phrases)
- The search system has strengths (method-based queries) to leverage, not just weaknesses to fix

---

### 2025-12-23: B.4 Noise Phrase Filtering + Complete Synonym Deployment

**Context**: Implemented ADR-082 Tier 1 fundamentals: colloquial phrase filtering and verified complete synonym deployment (163 entries). Followed TDD approach with unit tests, integration via preprocessor, and smoke test validation.

| Category | Before | After | Delta | Notes |
|----------|--------|-------|-------|-------|
| Overall Lesson Hard MRR | 0.316 | 0.369 | +16.8% | Significant improvement |
| Naturalistic | 0.300 | 0.567 | +89% | "the bit where you X" pattern handled |
| Colloquial | 0.000 | 0.500 | +∞ | "complete the square" now works |
| Synonym | 0.167 | 0.167 | 0% | Synonyms working but need phrase boost |

**Decision**: ✅ ACCEPTED — Substantial MRR improvement, naturalistic queries fixed

**Key insights**:

1. **Noise filtering highly effective**: Removing colloquial filler ("the bit where", "that X stuff for", "how do I", etc.) improved naturalistic category by 89%

2. **Synonym deployment verified**: All 163 synonyms deployed including 37 mathsConcepts. Analyzer test confirms expansion working (e.g., "rearrange formulas" → "changing", "subject", etc.)

3. **Synonym queries still struggling**: Despite working synonyms, queries like "gradient of a straight line" fail because multi-word curriculum terms need phrase matching enhancement (B.5 next)

4. **Colloquial partial success**: "complete the square" now ranks #1, but "sohcahtoa" still fails — need phrase query boost for curriculum-specific terminology

**What was implemented**:

**B.4 Noise Phrase Filtering**:

- Created `removeNoisePhrases()` pure function with 8 colloquial patterns
- TDD approach: unit tests → implementation → integration
- Integrated as preprocessor in `buildLessonRrfRequest()` and `buildUnitRrfRequest()`
- Smoke tests validate impact on colloquial and naturalistic queries
- Patterns: "that X stuff for", "the bit where you", "how do I", "how to", "what is", "teach my students about", "lesson on", "help with"

**Synonym Deployment Investigation**:

- Discovered ES GET API pagination issue (defaults to 10 results)
- Confirmed all 163 synonyms deployed via `?size=200` parameter
- Verified synonyms include: `changing-the-subject` → "rearrange formulas", `linear-graphs` → "straight line graphs", `trigonometry` → "sohcahtoa"
- Analyzer test confirms query-time expansion working correctly
- Issue: Synonyms expand correctly but phrase matching too weak for multi-word terms

**Files changed**:

- `src/lib/query-processing/remove-noise-phrases.ts` — New pure function
- `src/lib/query-processing/remove-noise-phrases.unit.test.ts` — TDD tests
- `src/lib/query-processing/index.ts` — Barrel export
- `src/lib/hybrid-search/rrf-query-builders.ts` — Integration point
- `smoke-tests/noise-phrase-filtering.smoke.test.ts` — Validation tests

**Next steps**: B.5 Phrase Query Enhancement for curriculum-specific multi-word terms

---

### 2025-12-22: Ingestion Data Quality Fixes — Complete

**Context**: After fixing lesson enumeration, discovered unit documents had incorrect `lesson_count` (25/36 wrong) and missing `thread_slugs`. Root cause: upstream API pagination bug where unfiltered endpoint returns incomplete data (431 vs 436 lessons). Implemented workaround and comprehensive validation.

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Indexed Lessons | 431 | 436 | +1.2% |
| Units with correct `lesson_count` | 11/36 | 36/36 | +69% |
| Lesson Hard MRR | 0.327 | 0.316 | -3.4% |
| Unit Hard MRR | 0.761 | 0.856 | +12.5% |
| Lesson Std MRR | (not measured) | 0.944 | N/A |
| Unit Std MRR | (not measured) | 0.988 | N/A |

**Decision**: ✅ ACCEPTED — Data quality is foundational

**Key insights**:

1. **Upstream API Bug Discovered**: Unfiltered `/key-stages/{ks}/subject/{subject}/lessons` returns 431 lessons, but filtered-by-unit requests return all 436. Documented in API wishlist.

2. **Lesson MRR Slight Decrease**: More lessons in index (436 vs 431) = larger search space = slightly harder to rank correctly. This is expected.

3. **Unit MRR Significant Improvement**: Correct `lesson_count` and `thread_slugs` data improves unit document quality, leading to +12.5% improvement.

4. **Standard Query Performance Excellent**: First measurement shows 0.944 (lessons) and 0.988 (units) — validates hybrid architecture.

**What was implemented**:

- Created `fetchAllLessonsByUnit()` to work around API bug (fetches lessons unit-by-unit)
- Updated `createUnitDocument()` to use aggregated lesson data via `lessonsByUnit` map
- Fixed thread field extraction for unit documents (now populate `thread_slugs`, `thread_titles`, `thread_orders`)
- Added comprehensive test coverage: unit tests, integration tests, smoke tests
- Validated against bulk download data (436 lessons, 36 units match exactly)

**Files changed**:

- `src/lib/indexing/fetch-all-lessons.ts` — Added `fetchAllLessonsByUnit()`
- `src/lib/indexing/document-transforms.ts` — Fixed unit document creation
- `src/lib/indexing/lesson-aggregation.ts` — Added `buildLessonsByUnit()`
- `src/lib/index-oak-helpers.ts` — Updated to use unit-by-unit fetching
- `smoke-tests/ingestion-validation.smoke.test.ts` — New validation tests
- `src/lib/indexing/unit-lesson-count-correctness.integration.test.ts` — New test

**Completion report**: [COMPLETION-REPORT-2025-12-22.md](../.agent/plans/quality-and-maintainability/COMPLETION-REPORT-2025-12-22.md)

**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

---

### 2025-12-20: Ingestion Gap Fix — Initial Lesson Enumeration

**Context**: The ingestion was using a truncated data source (`/units/{slug}/summary` → `unitLessons[]`). Fixed by switching to paginated `/key-stages/{ks}/subject/{subject}/lessons` endpoint per [ADR-083](../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md).

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Indexed Lessons | 314 | 431 | +37% |
| Lesson Hard MRR | 0.380* | 0.327 | -14% |
| Unit Hard MRR | 0.844* | 0.761 | -10% |

_*Previous values were against INCOMPLETE index_

**Decision**: ✅ ACCEPTED — Data completeness is foundational

**Key insight**: The apparent MRR "regression" is actually a correction. The old baselines were artificially high because they were measured against incomplete data. With 37% more lessons in the index, there are more candidates to rank — making it harder to hit top results. The new MRR values are intermediate baselines (still had data quality issues to fix).

**What was implemented**:

- Added `getLessonsByKeyStageAndSubject` with pagination support to SDK adapter
- Implemented `aggregateLessonsBySlug` pure function (TDD)
- Implemented `fetchAllLessonsWithPagination` orchestrator
- All unit relationships preserved (lessons can belong to multiple units)
- Removed deprecated `deriveLessonGroupsFromUnitSummaries`

**Files changed**:

- `src/adapters/oak-adapter-sdk.ts`
- `src/lib/indexing/lesson-aggregation.ts` (new)
- `src/lib/indexing/fetch-all-lessons.ts` (new)
- `src/lib/indexing/lesson-document-builder.ts` (new)
- `src/lib/index-oak-helpers.ts`
- `src/lib/indexing/document-transforms.ts`

---

### 2025-12-19: Comprehensive Synonym Coverage

**Hypothesis**: Adding 40+ Maths KS4 synonyms will improve hard query MRR by ≥5%

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Lesson Hard MRR | 0.367 | 0.380 | +3.5% |
| Unit Hard MRR | 0.811 | 0.844 | +4.1% |
| Vocabulary gap tests | 3/11 | 11/11 | +8 |

**Decision**: ✅ ACCEPTED

**Key insight**: "sohcahtoa" was returning histograms before synonyms; now returns trigonometry rank 1. The synonym approach successfully bridges vocabulary gaps between teacher language and curriculum terminology.

**What was changed**:

- Expanded `maths.ts` from 8 to 40+ synonym entries
- Added mappings for: sohcahtoa→trigonometry, solving for x→linear equations, straight line→linear, etc.

**Experiment file**: [comprehensive-synonym-coverage.experiment.md](experiments/comprehensive-synonym-coverage.experiment.md)

---

### 2025-12-19: Semantic Reranking

**Hypothesis**: Cross-encoder reranking will improve hard query MRR by ≥15%

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Lesson Hard MRR | 0.367 | 0.305 | -16.8% |

**Decision**: ❌ REJECTED

**Key insight**: Generic cross-encoder lacks curriculum domain knowledge. This experiment led to the creation of [ADR-082: Fundamentals-First Strategy](../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — AI on weak fundamentals = amplified weakness.

**What was learned**:

- Generic AI models don't understand curriculum vocabulary
- Need to master fundamentals (synonyms, phrases, noise filtering) before AI enhancement
- Rich data assets (relationships, threads) are underutilised

**Experiment file**: [semantic-reranking.experiment.md](experiments/semantic-reranking.experiment.md)

---

### 2025-12-18: Hard Query Baseline

**Purpose**: Document current system behaviour before experiments

| Metric | Value |
|--------|-------|
| Lesson Hard MRR | 0.367 |
| Unit Hard MRR | 0.811 |
| Colloquial MRR | 0.000 |
| Synonym MRR | 0.167 |
| Misspelling MRR | 0.833 |

**Key findings**:

- 5 of 8 lesson failures are vocabulary gaps fixable with synonyms
- Units outperform lessons (0.811 vs 0.367) — unit summaries are more information-dense
- Misspelling handling is excellent (fuzzy matching working)
- Colloquial queries fail completely (noise phrases + vocabulary gaps)

**Baseline file**: [hard-query-baseline.md](baselines/hard-query-baseline.md)

---

## Cumulative Progress

| Date | Event | Lesson Hard MRR | Unit Hard MRR | Lessons | Notes |
|------|-------|-----------------|---------------|---------|-------|
| 2025-12-18 | Hard Query Baseline | 0.367 | 0.811 | 314 | ⚠️ Against incomplete index |
| 2025-12-19 | Semantic Reranking Rejected | — | — | 314 | -16.8% regression, reverted, led to ADR-082 |
| 2025-12-19 | Synonym Coverage Accepted | 0.380 | 0.844 | 314 | ⚠️ Against incomplete index |
| 2025-12-20 | Ingestion Gap Fixed (Initial) | 0.327 | 0.761 | 431 | ⚠️ Still had data quality issues |
| 2025-12-22 | Data Quality Fixes Complete | 0.316 | 0.856 | 436 | ⚠️ Against invalid ground truth |
| 2025-12-23 | Ground Truth Corrected | — | — | 436 | 63 invalid slugs fixed |
| **2025-12-24** | **TRUE Baseline Established** | **0.614** | **0.856** | **436** | ✅ **TIER 1 TARGET MET** |
| **2026-01-06** | **Unified Evaluation Infrastructure** | — | — | — | Phase 7 complete, ADR-098, `benchmark.ts` |
| **2026-01-07** | **Test Coverage + Docs Cleanup** | — | — | — | ✅ All infrastructure ready for Phase 8 |

**Standard Query Performance** (verified 2025-12-24):

- Lesson Std MRR: **0.944** ✅ Excellent
- Unit Std MRR: **0.988** ✅ Near perfect

**Tier 1 Target**: ✅ **MET** — MRR 0.614 exceeds 0.45 target by 36%; exhaustion pending

---

## How to Add an Entry

After running an experiment:

1. Add a new entry at the top of "Log Entries" (below the most recent)
2. Include: date, descriptive name, hypothesis, before/after metrics table, decision, key insight
3. Link to the detailed experiment file
4. Update the "Cumulative Progress" table
5. Update [current-state.md](plans/semantic-search/current-state.md) with new metric values
6. **Codify learnings** (see below)

### Codify Learnings — Extract Lasting Value

| If the experiment... | Then update... |
|---------------------|----------------|
| Led to an architectural decision | Create or update an **ADR** |
| Revealed operational best practices | Update **INGESTION-GUIDE.md**, **SYNONYMS.md**, etc. |
| Changed the recommended process | Update **NEW-SUBJECT-GUIDE.md** |

**Key principle**:

- **What we DO** → Goes in operational guides (e.g., NEW-SUBJECT-GUIDE.md)
- **What we DON'T DO** → Stays here in the experiment log
- **Why we decided** → Full reasoning in the experiment file

**Template**:

```markdown
### YYYY-MM-DD: [Descriptive Name]

**Hypothesis**: [What you expected to happen]

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| [Metric] | [Value] | [Value] | [Change] |

**Decision**: ✅ ACCEPTED / ❌ REJECTED / ⏸️ INCONCLUSIVE

**Key insight**: [One paragraph explaining the most important learning]

**Experiment file**: [filename.experiment.md](experiments/filename.experiment.md)
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) | **Defines "Target Met" vs "Exhausted"** |
| [current-state.md](../plans/semantic-search/current-state.md) | Current metrics snapshot |
| [EXPERIMENT-PRIORITIES.md](experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap (what to try next) |
| [ADR-081](../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Evaluation framework and decision criteria |
| [ADR-082](../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |
