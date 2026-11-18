I can't tell which component you mean. The working directory (`<workspace>`) has no files, and the repo has no commits yet.

Which component should I specify? Any of these works:
- a file path or module name, if the code is somewhere else,
- a short description of the component and what it's for, or
- a design doc or spec to work from.

Once I have it, I'll write a specification with three parts:
- **Must do:** the outcomes it's required to deliver, and the conditions under which each one holds.
- **Must preserve:** the invariants, data and meaning, existing behaviour, and authority boundaries it must not break.
- **May permit:** the variation it's allowed (implementation freedom, acceptable degraded modes), plus what's explicitly out of scope or forbidden.

For each obligation I'll also give counterexamples that would violate it.
