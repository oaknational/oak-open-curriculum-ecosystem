I can't write the plan yet because I don't have the scope. You mentioned a ratified scope, but your message didn't include one, and the working directory is an empty repository with no commits. It has none of the files the planning skill depends on either: no `.agent/plans/` estate, no `plan-node-schema.md`, no templates, no impact-areas registry and no directives.

Writing a plan without the scope would mean guessing what's in scope, what the goal is and what counts as done. The skill doesn't allow that, and the result wouldn't be worth ratifying.

To go ahead, I need:

1. **The ratified scope.** Paste it, or give me the path or ticket where it lives.
2. **Where the ratification is recorded.** Who ratified it and a link or reference to where they did. The plan needs this for its approval stamp (the `ratified_where` field).
3. **Which repository to use**, if not this one. I need the repo that has `.agent/plans/` with its schema and templates. If this empty repo really is the target, say so. I'll then write a self-contained delivery plan that follows the skill's frontmatter and body rules, and note that there's no validator here to check it against.

Once I have the scope, the plan will include:
- the goal
- who it's for and what they get
- why the approach works
- acceptance criteria, each marked as provable by tests/CI in the repo or as needing an owner to check an outside system
- what's out of scope
- tasks broken into single-PR pieces
- a section for recording review findings

It will start as a draft (`status: sketch`) waiting for your sign-off.
