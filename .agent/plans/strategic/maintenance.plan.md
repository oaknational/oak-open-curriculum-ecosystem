---
id: maintenance
node_type: strategic
name: "Maintenance — known defects are fixed, and stay fixed"
overview: "The resting branch carries no known analyser finding: every one is fixed in the tree, and the class behind it is held by a gate where one exists."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: TOOLS-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-10-27
---

# Maintenance — known defects are fixed, and stay fixed

## Outcome

The resting branch carries no known analyser finding. Every finding a code analyser raises is
fixed in the tree, never dismissed (owner ruling 2026-09-08, verbatim: "We don't dismiss issues,
we fix them."), and where a gate can hold the class, the class is held at commit time. Findings
from reviewers are triaged under `review-feedback-defaults-to-triage` and PDR-140.

## User groups and value

- **The owner**: the estate's quality surfaces read zero and mean it.
- **Every seat**: work starts on a branch whose known defects are already fixed, and a new defect
  is met in the diff that introduced it.
- **Consumers of the published code**: the rigour TOOLS-1 promises holds below the contracts too.

## The bet

Fixing defects as a standing, planned activity — with the gate that keeps each class fixed — costs
less than re-reading an accumulating backlog every session. Deliberately not done here: new
capability, refactoring for its own sake, or any architectural change; those serve their own nodes.

## Success looks like

The analysers' views of the resting branch read zero at each reading, and a recurrence of a fixed
class is caught by a gate, not by the next analysis. This node claims nothing about defects not yet
found.

## Delivery

Delivery plans serving this node declare `serves: maintenance`; enumerate them by search.
