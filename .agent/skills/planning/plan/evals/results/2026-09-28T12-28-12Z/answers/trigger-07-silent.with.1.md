I can't answer yes or no yet: the working directory is empty, so I have neither side's contract. From here the answer can't be decided either way. Below is what's needed to settle it and the specific ways this kind of pairing usually breaks.

## What I need from you

1. **The API side:** which API, which version, and where its subject slugs are defined (a schema, an enum, a vocabulary endpoint or docs). I also need to know what it promises about slugs:
   - Are they stable, or can one be renamed or reused?
   - Can there be several per record?
   - Is the list closed, or can new ones appear?
   - Can they vary by locale, key stage or programme?
2. **The partner tool:** its name and version, and where its taxonomy lives (export, spec or API). I need its structure (flat or nested, one or several labels per item) and how it's versioned and changed.
3. **What you'll do with the pair:** for example, filtering the partner's content by our slug, reporting in the partner's categories, or syncing records. Also who the users are and whether it's one-off or ongoing.
4. **Any existing mapping:** a crosswalk table, and who owns it.

## How I'd frame it meanwhile

This is a **translation** between two vocabularies: our slug gets converted into a partner category (or the reverse). For that to be safe, a few things have to hold:

- A slug and its mapped category must mean the same set of content, not just have similar labels.
- The two sides must use the same notion of identity. Is a slug a subject, or a subject within a phase or exam board?
- The mapping has to say what happens when a value doesn't map, rather than silently dropping it.
- Both version numbers must be recorded against the mapping.

A mapping that loads without errors doesn't show that meaning survives the translation.

## Likely ways it breaks, to check once I have the material

- **Same name, different coverage:** e.g. our `science` covers combined science, while the partner splits it into biology, chemistry and physics. One slug fans out to three categories, and reports double-count or under-count.
- **Different grain:** our slug covers several key stages, but the partner's categories are tied to one. The mapping looks fine but mixes content from different phases.
- **Mismatched cardinality:** a record has one slug but the partner allows several tags, or the reverse, so reverse lookups aren't unique.
- **Different change rhythms:** a slug gets renamed or reused while the partner's taxonomy stays put. Old links now point to the wrong category without any error.
- **Unmapped values:** a new slug with no partner category is quietly dropped, so content disappears instead of being flagged.
- **Label vs identifier:** the partner matches on display names, which can change, rather than on stable IDs.

Each of these tells us which side is missing a guarantee, such as a slug-stability promise from the API or versioned change notices from the partner.

If you share the two specs (or paths/URLs) and the intended use, I'll write up the full seam contract: the verdict on whether the pair can be relied on, the break cases I tested, the evidence still missing, and what each side has to guarantee.
