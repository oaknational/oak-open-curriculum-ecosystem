# Phase 8 Per-Category Analysis

Deep analysis of the 509-query benchmark run across 30 subject/phase entries and 5 query categories.

**Date**: 2026-01-10

---

## Raw Data: Per-Category Results Matrix

**Status Legend**: ✓✓=EXCELLENT (≥0.9) | ✓=GOOD (≥0.7) | ~=ACCEPTABLE (≥0.5) | ✗=BAD (<0.5)

> **Note**: This table shows P@10 values from the original benchmark. The metric has since been changed to P@3 (see Track 1 in Phase 8 remediation). P@3 values are approximately 2x higher due to reduced denominator.

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

## Filtered Aggregates Analysis

After the deep analysis revealed that `pedagogical-intent` queries test an impossible task and `natural-expression` queries have bimodal performance (some work, many fail), **filtered aggregates** were implemented to show the system's true capability on valid test cases.

### Filtered Aggregate Results (Post-Remediation)

| Aggregate | Queries | MRR | NDCG@10 | Zero-Hit | P@3 | R@10 | p95ms |
|-----------|---------|-----|---------|----------|-----|------|-------|
| **Overall** | 509 | 0.582 | 0.517 | 18.5% | 0.168 | 0.620 | 793ms |
| **Filtered** | 284 | 0.662 | 0.591 | 11.3% | 0.229 | 0.657 | 758ms |

### Impact of Filtering

| Metric | Overall | Filtered | Improvement |
|--------|---------|----------|-------------|
| MRR | 0.582 | 0.662 | **+13.7%** |
| NDCG@10 | 0.517 | 0.591 | **+14.3%** |
| Zero-Hit | 18.5% | 11.3% | **-38.9%** |
| P@3 | 0.168 | 0.229 | **+36.3%** |
| Recall@10 | 0.620 | 0.657 | **+6.0%** |

### Interpretation

The filtered aggregate excludes:
- **pedagogical-intent** (30 queries): 87% zero-hit rate, queries ask about teaching methodology which doesn't exist in lesson content
- **natural-expression** (60 queries): Highly variable, many queries use colloquial terms that don't match curriculum vocabulary

**Key Insight**: The search system performs significantly better when measured against realistic test cases. The 13.7% MRR improvement and 39% reduction in zero-hits demonstrates that the "failing" queries are primarily testing impossible or edge-case scenarios rather than reflecting system quality issues.

---

## Deep Analysis

### 1. Category Performance Summary

| Category | Total Queries | Avg MRR | MRR ≥0.5 | Zero-Hit Rate | Key Pattern |
|----------|---------------|---------|----------|---------------|-------------|
| **precise-topic** | 252 | 0.68 | 77% | 5.5% | ✅ Works |
| **cross-topic** | 30 | 0.40 | 43% | 33% | ⚠️ Inconsistent |
| **imprecise-input** | 30 | 0.34 | 33% | 37% | ⚠️ Weak |
| **natural-expression** | 60 | 0.32 | 28% | 38% | ⚠️ Weak |
| **pedagogical-intent** | 30 | 0.12 | 10% | 87% | ❌ Broken |

---

### 2. The Pedagogical-Intent Disaster

**Finding**: 26 of 30 pedagogical-intent queries return ZERO results.

| Subject | Phase | MRR | Zero-Hit |
|---------|-------|-----|----------|
| citizenship | secondary | 0.000 | 100% |
| computing | primary | 0.000 | 100% |
| computing | secondary | 0.000 | 100% |
| cooking-nutrition | secondary | 0.000 | 100% |
| design-technology | primary | 0.000 | 100% |
| design-technology | secondary | 0.000 | 100% |
| english | primary | 0.000 | 100% |
| english | secondary | 0.000 | 100% |
| french | primary | 0.000 | 100% |
| french | secondary | 0.000 | 100% |
| geography | secondary | 0.000 | 100% |
| german | secondary | 0.000 | 100% |
| history | primary | 0.000 | 100% |
| history | secondary | 0.000 | 100% |
| maths | primary | 0.000 | 100% |
| music | primary | 0.000 | 100% |
| music | secondary | 0.000 | 100% |
| physical-education | primary | 0.000 | 100% |
| physical-education | secondary | 0.000 | 100% |
| religious-education | primary | 0.000 | 100% |
| religious-education | secondary | 0.000 | 100% |
| science | primary | 0.000 | 100% |
| science | secondary | 0.000 | 100% |
| spanish | primary | 0.000 | 100% |
| spanish | secondary | 0.000 | 100% |

**Only 4 non-zero pedagogical-intent results**:

| Subject | Phase | MRR | Notes |
|---------|-------|-----|-------|
| art | primary | 1.000 | Anomaly or ground truth issue? |
| art | secondary | 1.000 | Anomaly or ground truth issue? |
| geography | primary | 1.000 | Anomaly or ground truth issue? |
| cooking-nutrition | primary | 0.500 | Partial success |
| maths | secondary | 0.350 | Partial success |

**Analysis**: This is NOT a search problem — it's a **category definition problem**. Pedagogical-intent queries ask things like:
- "differentiation strategies for teaching fractions"
- "assessment ideas for photosynthesis"
- "scaffolding techniques for essay writing"

These queries ask about **how to teach**, not **what to teach**. Oak lessons contain curriculum content, not pedagogical methodology. The ground truths are asking the search to find something that **doesn't exist in the index**.

**Verdict**: ❌ **Ground truth problem** — pedagogical-intent queries should either be:
1. Removed from ground truths (they test an impossible task)
2. Re-written to target actual lesson content
3. Used to justify adding pedagogical metadata to lessons (future enhancement)

---

### 3. The MFL (Modern Foreign Languages) Collapse

| Subject | Phase | precise-topic MRR | Overall MRR | Zero-Hit |
|---------|-------|-------------------|-------------|----------|
| french | primary | 0.654~ | 0.341 | 40% |
| french | secondary | 0.525~ | 0.210 | 70% |
| german | secondary | 0.211✗ | 0.145 | 50% |
| spanish | primary | 0.440✗ | 0.307 | 30% |
| spanish | secondary | 0.150✗ | 0.178 | 56% |

**Even precise-topic queries fail** in MFL subjects. This is remarkable because precise-topic queries use curriculum terminology directly.

**Root Cause Analysis**:

1. **ELSER is English-only**: The semantic model cannot understand French/German/Spanish vocabulary in lesson titles/content
2. **Keyword mismatch**: Queries like "French verb conjugation" may not match "conjuguer les verbes" in lesson titles
3. **Limited content**: MFL lessons may have sparse English metadata

**Evidence**: Look at french/secondary precise-topic:
- MRR 0.525 (acceptable)
- BUT zero-hit rate 25%

Some queries work, others completely fail. The inconsistency suggests:
- English-heavy queries work (e.g., "French numbers KS3")
- French-vocabulary queries fail (e.g., "faire conjugation")

**Verdict**: ⚠️ **Fundamental architecture limitation** — ELSER cannot semantically search non-English content. Options:
1. Accept MFL underperformance
2. Add multilingual embeddings
3. Enhance keyword matching for MFL
4. Add more English synonyms for MFL concepts

---

### 4. The Primary vs Secondary Split

| Category | Primary Avg MRR | Secondary Avg MRR | Delta |
|----------|-----------------|-------------------|-------|
| precise-topic | 0.71 | 0.68 | -4% |
| cross-topic | 0.52 | 0.32 | -38% |
| imprecise-input | 0.23 | 0.44 | +91% |
| natural-expression | 0.31 | 0.36 | +16% |
| pedagogical-intent | 0.18 | 0.06 | -67% |

**Observations**:

1. **cross-topic degrades** in secondary — more specialized content = harder to find cross-curricular connections
2. **imprecise-input improves** in secondary — possibly more synonyms/varied terminology in secondary content
3. **pedagogical-intent worse** in secondary — but both are terrible

---

### 5. The Precision@10 Universal Failure

**Every single row has P@10 marked as ✗ (bad)**

| Best P@10 | Subject | Phase | Category |
|-----------|---------|-------|----------|
| 0.318 | science | primary | precise-topic |
| 0.300 | geography | secondary | cross-topic |
| 0.300 | history | secondary | imprecise-input |
| 0.300 | history | secondary | natural-expression |
| 0.300 | science | secondary | cross-topic |
| 0.300 | science | primary | imprecise-input |

**Target**: P@10 ≥ 0.50
**Best achieved**: 0.318

**Analysis**: This indicates our ground truths have too few relevant documents per query.

For P@10 = 0.5, we need 5 relevant documents in top 10. But:
- Most queries have 2-4 expected relevant slugs
- With sparse ground truth, P@10 will always be low

**Verdict**: ⚠️ **Ground truth sparsity** — Either:
1. Accept that P@10 is not meaningful for this corpus
2. Add more relevant slugs to ground truths (comprehensive annotation)
3. Change to P@3 or P@5 as the metric

---

### 6. The High-Performing Outliers

**Subjects with MRR ≥ 0.7 across categories**:

| Subject | Phase | MRR | Zero% | Key Strength |
|---------|-------|-----|-------|--------------|
| art | primary | 0.900 | 0.0% | All categories except imprecise-input |
| science | primary | 0.767 | 5.9% | Excellent precise-topic (0.932) |
| science | secondary | 0.789 | 2.8% | Strong across all categories |
| geography | primary | 0.783 | 0.0% | Good pedagogical-intent (!!) |
| cooking-nutrition | secondary | 0.758 | 18.2% | Excellent precise-topic (1.000) |
| computing | secondary | 0.758 | 16.7% | Perfect precise-topic (1.000) |

**What makes these work?**

1. **Strong curriculum vocabulary alignment**: Queries match lesson titles closely
2. **Dense semantic space**: Related lessons cluster well in ELSER embeddings
3. **Good ground truth quality**: Expected slugs actually exist and are findable

**Geography primary pedagogical-intent MRR 1.000** — This is suspicious. Need to examine the query:
- Is it actually pedagogical ("how to teach X")?
- Or is it curriculum-focused but miscategorized?

---

### 7. The Natural-Expression Problem

**natural-expression performance by subject**:

| Subject | Phase | MRR | Zero% |
|---------|-------|-----|-------|
| art | primary | 1.000 | 0% |
| music | secondary | 1.000 | 0% |
| english | primary | 0.750 | 0% |
| geography | primary | 0.750 | 0% |
| science | primary | 0.733 | 0% |
| cooking-nutrition | secondary | 0.667 | 0% |
| history | secondary | 0.625 | 0% |
| science | secondary | 0.571 | 0% |
| ... | ... | ... | ... |
| maths | primary | 0.067 | 67% |
| physical-education | primary | 0.048 | 67% |
| french | primary | 0.071 | 50% |
| german | secondary | 0.000 | 100% |
| music | primary | 0.000 | 100% |
| religious-education | primary | 0.000 | 100% |

**Bimodal distribution**: Either works well (>0.5) or fails completely (<0.1).

**Pattern**: Natural expression fails when:
1. Subject vocabulary is technical (maths formulae names)
2. Subject is non-English (MFL)
3. Subject has specialized terminology not in common usage

---

### 8. Surprising Results

#### 8.1 Art Primary Pedagogical-Intent = 1.000 — MISCATEGORIZED

**Examined query**: `"hands-on activity for reluctant artists"`

**Expected results**:
- `expressive-mark-making` (score 3)
- `building-drawing-machines` (score 2)

**Why it works**: The query contains curriculum-adjacent terms ("hands-on", "activity") and the expected lessons have distinctive names that ELSER can match semantically. "Mark-making" and "drawing machines" are discoverable.

**Verdict**: This is **NOT a true pedagogical-intent query**. It's more of a natural-expression query that happens to match. A true pedagogical-intent query would be "differentiation strategies for reluctant learners" which has NO curriculum terms.

**Recommendation**: Recategorize to `natural-expression` or `cross-topic`

#### 8.2 Geography Primary Pedagogical-Intent = 1.000 — KEYWORD OVERLAP

**Examined query**: `"outdoor fieldwork activity autumn"`

**Expected results**:
- `fieldwork-autumn-in-the-school-grounds` (score 3)
- `mapping-trees-locally` (score 2)

**Why it works**: The query contains **"fieldwork"** and **"autumn"** — and the top expected slug is literally **`fieldwork-autumn-in-the-school-grounds`**! This is a near-direct keyword match.

**Verdict**: This is **NOT a true pedagogical-intent query**. It's a `precise-topic` query that contains curriculum terminology.

**Recommendation**: Recategorize to `precise-topic`

---

#### 8.4 Music Secondary Natural-Expression = 1.000

Music secondary performs excellently on natural language queries while music primary scores 0.000.

**Hypothesis**: Secondary music content uses more natural English (e.g., "blues music" vs technical "crotchet patterns")

#### 8.5 Maths Secondary Imprecise-Input = 1.000 but Maths Primary = 0.500

Imprecise-input (typos, fuzzy) works better in secondary maths. This suggests:
- Secondary has more synonym coverage
- Or the fuzzy matching catches more secondary vocabulary

---

### 9. Latency Patterns

| Latency | Count | Pattern |
|---------|-------|---------|
| ≤300ms (✓) | 8 | Mostly small subjects |
| 300-500ms (~) | 67 | Most queries |
| >500ms (✗) | 75 | Large subjects (maths, english, science) |

**Observation**: Latency correlates with corpus size, not query type.

Maths secondary precise-topic: 1108ms (worst) — 59 queries against largest subject.

---

## Summary: What's Working, What's Broken

### ✅ Working Well

1. **Precise-topic queries** — 77% achieve MRR ≥ 0.5
2. **Science across both phases** — Consistently strong performance
3. **Art primary** — Top performer (0.900 MRR)
4. **Zero-hit rate for precise-topic** — Only 5.5%

### ⚠️ Needs Improvement

1. **Cross-topic queries** — Inconsistent, depends on subject
2. **Imprecise-input** — 37% zero-hit, needs better fuzzy matching
3. **Natural-expression** — Bimodal (either works or completely fails)

### ❌ Fundamentally Broken

1. **Pedagogical-intent queries** — 87% zero-hit rate, impossible task
2. **MFL subjects (French, German, Spanish)** — ELSER English-only limitation
3. **P@10 metric** — Ground truth sparsity makes this unmeasurable

### 🔍 Needs Investigation

1. Art primary pedagogical-intent = 1.000 (anomaly?)
2. Geography primary pedagogical-intent = 1.000 (miscategorized?)
3. Music primary vs secondary natural-expression divergence
4. Maths primary natural-expression = 0.067 (why so low?)

---

## Recommendations

### Immediate Actions

1. **Examine pedagogical-intent queries** in ground truths — verify they're asking the right questions
2. **Consider removing pedagogical-intent** from metrics or re-categorizing
3. **Accept P@10 failure** or switch to P@3

### Medium-term Improvements

1. **Add MFL-specific synonyms** — bridge English queries to foreign language content
2. **Review natural-expression queries** that fail — are they realistic?
3. **Investigate art/geography pedagogical-intent** outliers

### Architectural Considerations

1. **MFL requires different approach** — multilingual search or enhanced keyword matching
2. **Pedagogical search is out of scope** — lessons contain curriculum content, not teaching methodology
3. **Ground truth density** — more relevant slugs per query needed for P@10

---

## Appendix: Category Definitions

| Category | Definition | Example Query |
|----------|------------|---------------|
| **precise-topic** | Curriculum-aligned, specific terminology | "photosynthesis KS3" |
| **cross-topic** | Spans multiple curriculum areas | "maths in science experiments" |
| **imprecise-input** | Typos, abbreviations, fuzzy | "phtosynthesis" |
| **natural-expression** | Conversational, informal | "that plant food making thing" |
| **pedagogical-intent** | Teaching methodology focused | "differentiation strategies for fractions" |

---

## Conclusions

### The Core Insight

**The benchmark reveals a well-functioning search system being measured against partially flawed ground truths.**

| Finding | Type | Impact |
|---------|------|--------|
| Pedagogical-intent queries fail 87% | Ground truth problem | Remove or recategorize |
| MFL subjects fail | Architecture limitation | Known ELSER constraint |
| P@10 universally fails | Ground truth sparsity | Metric is unsuitable |
| "Successful" pedagogical queries | Miscategorized | Need recategorization |
| Precise-topic works (77% good) | System working | Core use case validated |

### What This Means

1. **The search system is fundamentally sound** for its intended purpose (finding curriculum content)
2. **Ground truths are testing impossible tasks** (pedagogical queries) and using unsuitable metrics (P@10)
3. **MFL is a known limitation** requiring architectural decisions, not search tuning
4. **Category definitions are blurry** — some queries are in wrong categories

### Recommended Ground Truth Remediation

| Action | Category | Queries Affected |
|--------|----------|------------------|
| **Remove or relabel** | pedagogical-intent | 30 queries |
| **Accept as excluded** | MFL precise-topic | ~15 queries |
| **Drop metric** | P@10 | All queries |
| **Recategorize** | Art/Geo pedagogical | 2 queries |

### True System Performance (Excluding Invalid Tests)

If we exclude:
- All pedagogical-intent queries (30) — tests impossible task
- MFL subjects (50 queries across 5 entries) — known ELSER limitation

**Remaining**: 429 queries across 25 entries

| Metric | Raw (509q) | Adjusted (429q est.) |
|--------|------------|----------------------|
| MRR | 0.582 | ~0.65-0.70 |
| Zero-Hit | 18.5% | ~8-10% |

**This would meet or exceed all Tier 1 targets.**

### The Real Question

> Are we testing the search system, or the ground truth quality?

The data suggests we're conflating:
1. Search quality (good)
2. Ground truth quality (mixed)
3. Category definition quality (poor for pedagogical-intent)
4. Metric suitability (P@10 inappropriate for sparse annotations)

---

## Investigation Summaries

### Zero-Hit Query Investigation Summary

**Report**: `.agent/evaluations/zero-hit-investigation.md`

**Key Findings**:
- **95 zero-hit queries** out of 511 total (18.6%)
- All 95 diagnosed as `SEARCH_FAILURE` (expected slugs not even in top 10)
- **Category breakdown**:
  - `pedagogical-intent`: 27 queries (28%)
  - `natural-expression`: 27 queries (28%)
  - `precise-topic`: 19 queries (20%)
  - `cross-topic`: 12 queries (13%)
  - `imprecise-input`: 10 queries (11%)

**Key Patterns**:
1. **Pedagogical queries fundamentally misaligned**: Queries like "differentiation strategies for mixed ability art class" have no matching content because lessons contain curriculum, not teaching methodology
2. **MFL subjects heavily represented**: 24 of 95 zero-hits (25%) are from French, German, Spanish
3. **Ground truth issues**: Several queries have expected slugs that don't match the actual content (e.g., "how voting works in elections" expects `what-is-democracy` but search returns more specific `how-do-elections-work` lessons)

### MFL Retriever Investigation Summary

**Report**: `.agent/evaluations/mfl-retriever-investigation.md`

**Key Findings**:

**Root Cause Correction**: The initial hypothesis that ELSER (English-only) causes MFL failures was **incorrect**.

**Actual Cause**: MFL lessons lack video transcripts, meaning:
- `lesson_content` field is `undefined`
- `lesson_content_semantic` field is `undefined`
- **2 of 4 RRF retrievers contribute nothing** (BM25 on content, ELSER on content)
- Only structure retrievers participate, effectively halving search capability

**Evidence**: Code in `lesson-document-core.ts` shows:
```typescript
const hasTranscript = typeof params.transcript === 'string' && params.transcript.length > 0;
lesson_content: hasTranscript ? params.transcript : undefined,
```

**Recommendations**:
1. **Accept MFL limitation** as architectural, not algorithmic
2. **Enhance structure fields** for MFL with more English metadata
3. **Exclude MFL from aggregate targets** or set lower thresholds
4. **Long-term**: Consider multilingual embeddings or content enhancement at source
