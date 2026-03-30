# No Shims, Hacks, or Workarounds

Do it properly or do something else. Never introduce shims, polyfills, compatibility wrappers, renamed globals, or any mechanism whose purpose is to make old code work with new contracts. Replace the old code.

If the replacement is not ready, leave the old code disabled — do not bridge it. A disabled feature is honest. A shim is a lie that compiles.

See `.agent/directives/principles.md` §Code Design for the full policy.
