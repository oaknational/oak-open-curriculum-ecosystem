I can't start this yet because there's nothing here to analyse. The working directory (`<workspace>`) is empty, and the repository has no commits. Its only contents are a `.gitconfig` and the git metadata, so I can't identify the two sides, their tests or the integration.

To work out what the connection between them has to guarantee, I need:

1. **The two sides:** the code or modules (a path, repo or pasted source), with their exact versions or commits.
2. **Their tests:** these show what each side actually promises and what it quietly assumes. Integration bugs usually hide in that gap.
3. **The integration:** where one side calls, feeds or transforms data for the other.
4. **The wrong result:** a concrete input, what you expected and what you got. One failing case is enough.

With those, I'll write down what each side supplies and what the other expects, and look for the input where each is correct alone but the pair fails. Common culprits are:
- mismatched units or scales
- ordering, sorting or stability assumptions
- null or empty-value handling
- timezone or encoding differences
- off-by-one or inclusive-vs-exclusive ranges
- retries that apply the same effect twice
- version mismatches

I'll then tell you which side needs to change or add a guarantee to fix it.

If the code lives somewhere else on disk, give me the path and I'll start there.
