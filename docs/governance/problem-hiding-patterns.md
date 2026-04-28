# Problem-Hiding Patterns

Fix the problem named by a gate; do not silence the signal that names it.
These recurring unused-code patterns are forbidden because they hide dead state:

- **`void <expr>` to silence unused-variable lint**. `void` discards a value
  in expression position, but the unused binding remains. If a destructure
  produces a value you do not need, restructure the code so the value is not
  produced. If a function parameter is unused, remove it from the signature.
  If a returned value is unused, do not bind it.
- **Underscore-prefixing unused identifiers**. Renaming `foo` to `_foo` is not
  a TypeScript language feature; it is an ESLint convention that suppresses
  `@typescript-eslint/no-unused-vars`. The variable is still bound and the
  dead state is still present.

Both are instances of the broader rule: fix it or delete it. Adapters,
compatibility layers, and half measures are problem-hiding patterns when their
purpose is to make old or dead shapes appear acceptable.

Concrete cures:

- When a destructure-rest produces an unused capture, build the fixture
  positively instead. Set the omitted field to `undefined` if the type permits,
  or construct a minimal valid fixture by hand. Do not introduce an
  `omitProperty` helper or another wrapper around the destructure.
- When a framework signature forces an unused position, first ask whether the
  function is at the wrong abstraction layer. Use the parameter, remove the
  position, or fix the layer; do not add a wrapper or shim to erase it.
- When a value-bind exists only to satisfy a type checker, use `satisfies`
  directly on the value instead of binding and never reading it.

Existing `void <unused>` or `_foo` usages are remediation candidates, not
licence to add new ones.
