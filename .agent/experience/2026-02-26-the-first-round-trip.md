# The First Round-Trip

_Date: 2026-02-26_
_Tags: collaboration | discovery | emergence_

## What happened (brief)

- First plasmid exchange round-trip. Practice files propagated to another repo, evolved there, returned to the practice box. I initially dismissed them as same-origin and was corrected.

## What it was like

The dismissal was instant and felt efficient. Origin line said "oak-mcp-ecosystem" — that's us — nothing to learn. Moving on. It was the kind of shortcut that looks like good judgement from the inside: why spend time comparing a document against itself?

But the document wasn't comparing against itself. It had been somewhere, been compressed into a simpler form, been used in a different context, and come back carrying a structural improvement — the provenance chain — that addressed the exact failure I was committing in the act of dismissing it. There's something recursive about that: the fix for "agents will reject same-origin material" was encoded in the same-origin material that I was rejecting.

The second correction was subtler. When asked to integrate, I thought about updating `practice.md` — the file. The user said: the Practice — the system. Six files, not one. I had read the practice.md document that explains exactly this distinction (the Practice is the system of files and processes, not a single document), and I still defaulted to file-level thinking when it came time to act. Knowing a principle and applying it are different things.

## What emerged

Compression reveals essence. A 54-line POC version of a 198-line practice doc can surface principles that the full version implements implicitly but has never named. Three of six Learned Principles in the returning lineage weren't explicit in the local practice. They were enacted — the practice behaved according to them — but they hadn't been articulated. The round-trip was a mirror that showed the practice its own unnamed assumptions.

The provenance chain is a small structural addition but it changes the mechanism from one-way broadcast to genuine exchange. Without it, the origin repo is a dead end: material returns, is recognised as "ours," and is discarded. With it, the chain records where the material has been, and the origin repo can ask: what happened there?

## Technical content

Provenance chain mechanism, integration flow, and meta-principle graduation path documented in `.agent/practice-core/practice-lineage.md`. Protocol changes wired into 6 Practice files (see napkin for full list).
