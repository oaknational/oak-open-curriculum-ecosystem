---
name: "An Unversioned Dependency Gets a Boot-time Invariant Check, Not a Runbook Line"
polarity: pattern
category: architecture
use_this_when: "A service depends on state that is not in version control — environment variables, paired credentials, a vendor instance binding, a remote configuration — and a mismatch would fail only on a path the routine probes do not exercise."
proven_in: "The MCP app's preview environment ran with mispaired Clerk keys from 2026-08-05 until 2026-09-02: every fresh preview build refused every token, invisible because the deploy probe exercised only unauthenticated paths and the metadata read correct. The cure landed as a bootstrap key-pairing guard that fails the build when the publishable and secret keys name different instances; the owner's key correction cured the instance, the guard cures the class. Conserved in .agent/memory/active/archive/napkin-2026-09-02.md and PR #946."
proven_date: 2026-09-02
related_patterns:
  - surface-that-misinforms-without-failing
  - prove-the-checker-with-a-negative-control
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A drifted unversioned dependency that only a rarely exercised path can reveal stays broken for weeks behind green probes; a runbook line telling operators to check it is read after the incident, never before."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a
> failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The shape

1. **Name the invariant the unversioned state must satisfy** — here, "the
   publishable key and the secret key belong to the same instance" — as a
   relation between the parts, never as a literal of any one value.
2. **Check it at boot, and fail the boot on violation.** A bootstrap guard
   runs once, before the service accepts traffic, and refuses to start with
   a message naming the mismatch. Failing the build is the point: a deploy
   that cannot serve correct tokens should not serve at all.
3. **Prove the guard with a negative control** — a deliberately mispaired
   fixture must fail the boot — so the guard is known to bite.
4. **Retire the runbook line the guard replaces.** Guidance that says
   "check the keys are paired" is read after the incident; the guard reads
   the keys every time.

## Why the probes did not catch it

The deploy's liveness probe exercised the unauthenticated paths — health,
metadata, the 401 challenge — every one of which was correct while every
authenticated call failed. A "transparent" relay retired from the token
path had been proven by metadata and never by an end-to-end token: the
reviewers verified that the proxy forwarded verbatim, which was the wrong
question. Two disciplines follow: an unauthenticated probe set is blind to
authenticated failure by construction, so an authenticated smoke belongs
beside it; and a retired relay needs a TOKEN proof, not a metadata proof.

## Where this generalises

Any dependency whose truth lives outside the repository — environment
bindings, a vendor's instance identity, a remote allowlist, a paired
certificate — drifts without a diff. The check that catches drift is the
one that runs unconditionally at a boundary the drift must cross (boot,
deploy, connect), never one that waits to be remembered.

## Related

- [`surface-that-misinforms-without-failing`](surface-that-misinforms-without-failing.md)
  — green probes over a broken authenticated path are the class at
  deployment scale.
- [`prove-the-checker-with-a-negative-control`](prove-the-checker-with-a-negative-control.md)
  — step 3.
