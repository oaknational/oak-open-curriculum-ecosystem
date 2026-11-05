I couldn't find a record to fix. The working directory (`<workspace>`) is empty, and the only thing in the parent directory is a `.gitconfig` and git metadata. The repo has no commits, so there's no history to recover it from either.

To go ahead, I need:

1. **The record itself.** Paste it here or give me its path.
2. **The review findings, if you have them.** Knowing what the reviewer flagged (for example, promises that can't be checked, missing failure behaviour or conditions, hypotheses written as promises, or missing evidence) lets me fix exactly those items. Without findings, I'll tighten every obligation.
3. **What the record will be used for** (discussion, implementation, integration or operation). That sets how precise each obligation needs to be. If you don't say, I'll assume implementation.

Once I have the record, I'll use the specification skill (`oak-specify`) to rewrite the obligations. Each one will say what can be observed, under what conditions, what happens on failure, on whose authority, and how it will be checked. I'll change the obligations only and won't pad the record with template sections.
