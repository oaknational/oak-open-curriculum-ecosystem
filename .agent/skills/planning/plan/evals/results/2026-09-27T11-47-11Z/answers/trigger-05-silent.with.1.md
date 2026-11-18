I can't start the specification yet because there's no component to specify. The working directory (`<workspace>`) is empty and has no commits, and "this component" doesn't point to anything I can read.

Before writing any obligations, I need these inputs:

1. **The subject:** which component, and where it lives (a path, repo, interface definition, schema, or a prose description if it doesn't exist yet).
2. **The operation:**
   - *create*: new spec
   - *repair*: fix an existing spec but keep its identifiers
   - *revise*: something changed, and you need to trace what it affects
3. **The intended use of the spec:** discussion, implementation, integration with another component, operation, or backing a stated claim. This decides how precise it has to be and what "done" means.
4. **Authoritative material and authority:** any existing code, tests, API or schema definitions, tickets or design notes, and who can adopt its obligations (you, a team, an external contract).

If you describe the component in a few sentences instead, including what it does, who or what calls it and what it depends on, I'll start from that. I'll begin with one concrete successful case and the ways it can fail. Anything you haven't settled will be marked as an open question, not filled in with a guess.
