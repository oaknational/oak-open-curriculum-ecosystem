---
name: "Oak Misconceptions Substrate Migration"
overview: "Migrate the slice-3a misconception sub-graph surface from the legacy graph factory onto graph-corpus-sdk and GraphView after graph-stack Inc.3 lands the misconception adapter."
status: superseded
graph_layer: oak-graph-surface
isProject: false
todos:
  - id: wait-for-inc3-adapter
    content: "Start only after graph-stack Inc.3 lands the misconception adapter on graph-corpus-sdk."
    status: pending
  - id: preserve-slice-3a-contract
    content: "Prove the substrate implementation preserves the Thread IRI response contract, maxResponseTokens = 16000 budget, and 20-context fixture manifest behaviour."
    status: pending
---

# Oak Misconceptions Substrate Migration

> **⛔ SUPERSEDED 2026-06-02 — absorbed by the unified substrate-migration
> plan.** Migration ownership for ALL existing graph tools lives in
> [`graph-tools-substrate-migration.plan.md`](../../future/graph-tools-substrate-migration.plan.md)
> (graph-estate-consolidation Judgement call 4). Every claim in this file was
> independently re-grounded at absorption — the disposition ledger is that
> plan's §Absorption record. The `Inc.3` trigger and the
> `maxResponseTokens = 16000` budget demanded below are retired framing.

This follow-on owns the substrate migration cut from slice 3a. Slice 3a may
ship first on the legacy graph factory as an explicit interim path.
