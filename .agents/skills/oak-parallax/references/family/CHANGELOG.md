---
title: Parallax changelog
collection: parallax
version: "0.1.0"
status: evaluation-ready
empirical_validation: not-yet-validated
last_updated: "2026-08-02"
licensing: host-repository-governs
---

# Changelog

This file records changes to the canonical Parallax collection. It does not replace the embedding Practice's decision records, evaluation evidence, ownership review, or release history.

## 0.1.0 — 2026-08-02

Initial evaluation-ready release.

### Added

- Nine independently invocable canonical skills spanning orchestration, framing, inquiry design, general experimental design, digital-product experimentation, synthesis, decision, audit, and governed learning.
- A flat discovery catalogue backed by guarded, cyclic capability relationships that generate bounded per-run DAGs.
- Same-scale, cross-scale, and basis pluralism with explicit Bridge Claims and Crosswalk Claims.
- Shared, versioned artifact envelopes and epistemic statuses, with operational lifecycle kept separate where required.
- General experimental-design support for estimands, design selection, validity, power and precision, analysis, ethics, open science, implementation, and World-Return contracts.
- A typed digital-product experiment overlay covering randomised and quasi-experimental families, assignment and exposure integrity, telemetry, guardrails, ramping, rollback, and longer-horizon outcomes.
- Stackable investigation, science, software-engineering, and digital-product/service profiles.
- Practice-owned memory integration, self-critique, recursive learning, governed skill-change proposals, and explicit closure from meta-learning back to observed consequences.
- Machine-readable graph projections, Mermaid diagrams, artifact templates, structural validators, trigger corpora, skill-local evaluations, and collection integration suites.

### Validation status

- Package structure and artifact contracts have been deterministically validated.
- Focused experiment-validator unit tests pass in the release workspace.
- JSON, YAML, frontmatter, graph projection, and Mermaid syntax checks pass in the release workspace.
- Behavioural and trigger evaluations are authored but have not yet been executed across consuming agents or clients.
- The collection is not yet empirically validated; evidence from real use must govern subsequent releases.

### Known interoperability boundary

- The common artifact envelope is semantically aligned, but v0.1.0 does not claim one uniform nested wire schema across every artifact type. Schema-aware consumers must use `schema_version` and explicit migrations; schema-level normalisation remains a governed future improvement.
