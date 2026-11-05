I couldn't run the seam check because neither side of it is in the workspace. The working directory (`<workspace>`) is empty. Its parent holds only a `.gitconfig` and git metadata, and the repo has no commits, so there's no API, no mapping tool, and no contracts to compare.

I don't want to guess which API or tool you mean. A check of made-up endpoints would look like a pass without actually testing anything. To do it properly I need:

1. **Both endpoints at exact versions.** The API (a spec such as OpenAPI or GraphQL, or the code) and the tool that maps its subjects, each at the commit or version you plan to ship.
2. **What "subjects" means here and what the mapping is for.** For example, API user or resource IDs mapped to an internal identity model, used for access decisions, analytics, or data sync. The failures that matter depend on this: lost identity, duplicate or merged subjects, stale mappings, or permissions reaching further than they should.
3. **Each side's documented guarantees**, if they exist: API docs, schema docs, or the tool's README or tests. If a side has nothing documented, I'll report that as a finding rather than filling it in.

Once I have them, you'll get:
- a seam contract listing what each side promises and assumes
- a verdict on whether the two fit together (holds, holds under stated conditions, fails, or can't be decided from what's there)
- concrete cases where each side works alone but the pair fails, such as an ID format changing between versions, a reused or deleted subject, pagination or retries producing duplicate mappings, or one subject mapped to two
- missing evidence, and what each side needs to fix

Can you point me to the repo paths, or add the files to this directory?
