I need to know which component you mean before I can write this. The working directory (`<workspace>`) is empty, and the repo has no commits. Apart from `.gitconfig` there's no code, schema, test or document to read. If I wrote a spec now, I'd be guessing at every obligation.

Please tell me:

1. **Which component.** Give its name and what kind of thing it is: a service, API, library module, UI component, data set, agent behaviour, and so on. If it's in files, give me the path or paste the source.
2. **What the spec is for.** Is it for discussion, implementation, integration with another component, or operations? The answer decides how much detail it needs and when it's ready.
3. **What already exists.** List any interface definitions, schemas, tests, docs or tickets that describe it. I'll link to those rather than duplicate them.
4. **Is this a new spec or a change to an existing one?** If something changed, tell me what.
5. **Who decides.** Who can approve obligations or accept known gaps, such as a team, product owner or standard?

A two-line description is enough to start, for example: "a rate limiter in front of our payments API; spec for implementation; the OpenAPI file is at X." From that, I'll start with one successful case and the failure cases. Then I'll write what the component must do, what it must preserve and what's deliberately left open, plus how each requirement will be checked.
