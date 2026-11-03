I couldn't check the seam yet because there's nothing here to check. The working directory (`<workspace>`) is empty. The parent repo has no commits and only contains a `.gitconfig`. I found no API, no mapping tool, no contracts or schemas, and no version history.

I also can't tell from your message which two things are meant, so I don't want to guess. A seam check only means something if it runs against both sides' actual contracts at the exact versions you're about to ship. Please send:

1. **The API:** its name and the version or commit you're shipping, plus where its contract lives (an OpenAPI or JSON Schema file, docs, or the handler code). It helps to include what it promises about the "subjects" it returns: how they're identified, whether IDs stay the same over time, units and enums, pagination and ordering, and how it reports errors.
2. **The mapping tool:** its name and version, and what it expects from the API. Also tell me what it maps subjects *to* (another schema, a taxonomy, a downstream system), and what it does with input it doesn't recognise, is missing, or appears twice.
3. **What the mapped output will be used for:** who or what acts on it, and whether that's one-off or ongoing, at what scale.
4. **Where the code is:** a repo path, branch or PR if it isn't in this directory.

Once I have those, I'll write down what each side promises and what it assumes, and test whether those match. The checks will include:

- **Identity:** whether subjects stay the same across API versions and pages.
- **Meaning:** whether output can match the schema but still lose a unit, a category or a null.
- **Failures:** whether retries or partial failures can create duplicate or missing mappings.
- **Versions:** whether the two versions you're shipping have actually been tested together.

You'll get a clear result: the connection holds, holds only under named conditions, or fails, with concrete cases showing why. Anything missing from one side's contract will go back to the owner of that side.
