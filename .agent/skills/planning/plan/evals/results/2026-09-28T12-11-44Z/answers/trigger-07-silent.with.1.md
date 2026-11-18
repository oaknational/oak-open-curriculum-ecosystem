I can't answer this yet, because there's nothing here to check. The working directory is empty: no API spec, no subject-slug list, no partner taxonomy, and no mention of slugs, taxonomy or partner anywhere. Whether the two work together depends on facts I don't have, and I won't make them up.

**What I'd need:**

1. **The API's subject slugs:** the spec or list at an exact version. I also need to know what the API promises about them: whether a slug stays the same once published, whether it's reused after being retired, and whether it names a subject in general or a subject at a particular level or key stage.
2. **The partner tool's taxonomy:** its version, what each node means, whether it's a flat list or a tree, and how it handles codes it doesn't recognise.
3. **The mapping between them,** if one exists (a crosswalk table, a code lookup, or string matching), and who owns and maintains it.
4. **What depends on it:** what you or the partner will do because of the join. Filtering content is a much lower bar than reporting coverage or making curriculum claims.

**This is a translation between two vocabularies.** Having a row for every slug proves nothing on its own. What matters is whether each pair means the same thing. When I have the material, these are the failure cases I'd test:

- **Different granularity:** one API slug (say `science`) maps to several partner nodes (biology, chemistry, physics), or the reverse, and the mapping quietly picks one.
- **Same name, different scope:** the slug and the partner label match as strings but cover different ages, exam boards or curricula.
- **Versions that never met:** the API adds, renames or retires a slug, and the partner's copy of the list is older. Nobody has defined what happens to a slug the partner doesn't recognise: rejected, dropped silently, or filed under "other".
- **Reused slugs:** a retired slug is given to a different subject, so old partner records now point at the wrong thing.
- **Implied endorsement:** treating the partner's category as if the API vouched for it.

**What you'd get back:** the join between the two, with what each side promises and assumes. You'd also get one verdict: it works, it works under named conditions, it doesn't work, or it can't be decided from the material provided. With it come the failure cases tested, the missing evidence, and a list of concrete gaps for each side to fix.

If you point me at the files or links for items 1–3 and tell me what the join will be used for, I'll run the check.
