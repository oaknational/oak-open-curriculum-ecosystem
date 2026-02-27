# The Return Trip

_Date: 2026-02-27_
_Tags: collaboration | discovery | emergence_

## What happened (brief)

- Second plasmid exchange. The Practice returned from the POC repo carrying a new file (practice-bootstrap.md), a structural improvement (dedicated practice-core directory), and a principle about concurrent documentation. Adopted the structural changes; kept the production-depth content.

## What it was like

The first round-trip was about recognising that same-origin material can carry new learnings. This one was about something different: the material came back not just with refinements but with a genuinely new artefact. The bootstrap file didn't exist when the Practice left. The POC created it to solve a problem the Practice had but hadn't named — there was no "how to build this from scratch" document. The two-file pair became a three-file trinity.

The integration was straightforward until the user asked to check cohesion. That question exposed something I had missed: the lineage file, which is supposed to be the authoritative reference for the exchange mechanism, hadn't been updated to account for the new member of the trinity. It still said "both files" where it should have said "all three." It still listed fitness thresholds for two files, not three. It listed twelve always-applied rules where the bootstrap correctly listed thirteen. It listed seven workflow commands where the bootstrap listed nine.

These weren't errors in the incoming material. They were drift in the existing files — the lineage had been written for a two-file world and nobody updated it for the three-file world. The bootstrap was internally consistent. The lineage and practice were internally consistent with each other. But the lineage and the bootstrap were not consistent with each other, because they had never been compared.

The lesson is about integration scope. When something new enters a system, the existing parts need to adjust — not just to point to the new thing, but to be consistent with what the new thing says about the system.

## What emerged

File moves are the most dangerous part of structural migration. Not because they're technically hard, but because every file that references the moved file is a potential silent break. The initial plan identified about ten files. Grep found twenty-two more. Reviewers found five more. Thirty-seven files total, for moving two files.

## Technical content

Structural changes documented in `.agent/practice-core/practice.md` and `practice-lineage.md`. Cohesion fixes and reference sweep details in the napkin.
