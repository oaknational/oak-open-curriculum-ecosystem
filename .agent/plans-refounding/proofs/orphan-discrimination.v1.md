# Orphan-discrimination proof (v1)

Planted-defect discrimination proofs for the refounding nets (F1 §9 plus the
plan-todo plant set). Every plant ran on a STAGED SCRATCH COPY; the frozen
tree was never touched. A zero-orphan residue result is acceptable only
alongside this transcript, and the proof re-runs after ANY net or bound
change.

## Plant 1 — anchorless work-bearing preamble

Planted 30 net-invisible work-bearing lines at the top of `milestones/README.md`.
Residue gained EXACTLY ONE orphan candidate at lines 1-30 (reasons: file-preamble, oversized-block); every other file's candidates
were unchanged.

## Plant 2 — misspelt Net-C keyword work line

Planted one work line with a misspelt keyword at line 2 of `milestones/README.md`. It appeared in
residue, NOT in inventory, and the correctly-spelt control shifted the per-net
diff by exactly one, in Net C alone (nets: C) —
the nets do not silently almost-match.

## Plant 3 — marker-free sweep paraphrase (honest blindness)

Planted a MARKER-FREE work-bearing paraphrase at line 1 of a staged copy of `.agent/memory/operational/threads/README.md`.
The sweep net returned ZERO hits for it while the plant was verifiably present
in the copy, and a marker-bearing control line planted in the SAME copy hit 1 time(s) in the SAME scan — the scanner
was live, and the sweep net ALONE still cannot see marker-free work. This is
the honest residue signal the G1 item-6 reader-sample cure exists for; it is a
blindness DISCLOSURE, not a pass.

## Machine-readable outcome

```json
{
  "preamble": {
    "file": "milestones/README.md",
    "lineStart": 1,
    "lineEnd": 30,
    "reasons": [
      "file-preamble",
      "oversized-block"
    ]
  },
  "keyword": {
    "file": "milestones/README.md",
    "plantedLine": 2,
    "misspeltInInventory": false,
    "misspeltInResidueBlock": true,
    "controlNets": [
      "C"
    ],
    "netCShift": 1
  },
  "sweep": {
    "file": ".agent/memory/operational/threads/README.md",
    "plantedLine": 1,
    "plantPresentInCopy": true,
    "sweepHitsForPlant": 0,
    "sweepHitsForControl": 1
  }
}
```
