I can't find an investigation to audit. The working directory `<workspace>` is empty. Its parent contains only a `.gitconfig` and a bare `.git` stub, and the repo has no commits.

To do the audit, I need:

1. **The investigation**: the draft, or at least its conclusion and the claims that lead to it. You can give me a file path or paste the text.
2. **The sources it cites**: the documents, data, interview notes or links, or wherever they're stored. Without them I can only check whether the draft is consistent with itself, not whether the sources back it.
3. **Optionally, the publication bar**: for example, whether each factual claim needs two independent sources, or whether some sources are off-limits or already known to be weak.

Once I have those, I'll check each claim that supports the conclusion against the source it cites. I'll flag:
- claims with no source
- sources that don't say what the draft says they say
- places where the draft states something more strongly than the source does
- sources that seem independent but share an origin
- anything that's out of date
- counter-evidence the draft leaves out

For each finding I'll say whether the conclusion still holds, holds only with changes, or doesn't hold.

A tooling note: a skill called `parallax-audit` for evidence audits is mentioned in the environment but isn't installed. I'll do the audit directly, not through a skill.
