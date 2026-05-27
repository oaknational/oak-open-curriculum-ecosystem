---
fitness_line_target: 500
fitness_line_limit: 750
fitness_char_limit: 150000
fitness_line_length: 300
lifecycle_model: >-
  queue — empties as substance graduates; depth proportional to
  cross-session-wait accumulation, not to file-permanence concerns
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
drain_strategy: >-
  Graduate items to PDRs/ADRs/rules/permanent docs; archive resolved items to
  dated archive snapshots; keep pending and recently-graduated items here
fitness_rationale: >-
  Limits calibrated to working queue depth (currently ~86 entries × ~12-25
  lines/entry, with index + per-entry metadata + schema preamble headroom), not
  to a permanent-doc shape. Raised 2026-05-07 (Pelagic Rolling Harbour) per
  owner direction: principles.md is loaded every session and must stay small;
  this register has a fundamentally different access rhythm — multi-session
  cross-wait accumulation under cross-session-wait pressure — and its limits
  should reflect that lifecycle. Recalibration is the substance-led structural
  fix per the substance > destination boundary.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---
