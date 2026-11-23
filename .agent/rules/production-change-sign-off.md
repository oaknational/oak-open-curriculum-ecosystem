---
classification: situational
description: "Before a pull request is opened and again before it merges, classify the change by what it does to the user-facing apps (the MCP app and the search app) and take the sign-off its class requires: A no production effect, ordinary merge; B production code path with no intended change in behaviour, ordinary merge plus a named proof; C trust, privacy or request-path boundary, a specialist review and the owner's explicit go-ahead on that pull request, with the merge tool never started before it; D a major version or rewrite on a production path, a ticket first, with the owner deciding case by case what each one needs before it is started."
trigger: ceremony:pr-lifecycle ∪ surface:dependency-management
---

# Production Change Sign-Off

The rubric is
[`docs/engineering/production-change-sign-off.md`](../../docs/engineering/production-change-sign-off.md).
That page is the authority: it defines the four classes, gives the examples
and says what each class needs before merge. This rule says when to apply it
and what an agent does at each moment.

## Trigger

- A pull request is about to be opened, or taken over.
- A pull request is about to be merged, by the merge tool or any other route.
- A dependency update is being triaged.

## Action

1. **Classify from the call sites.** Find where the changed code is imported
   and which app runs it. The question is whether the change alters what the
   MCP app or the search app runs or serves in production. A change in more
   than one class takes the highest; split the pull request where the parts
   separate cleanly. When the class is unclear, take the higher class and ask.
2. **State the class in the pull request description**, with its reason in
   one sentence.
3. **Take the sign-off the class requires.**
   - **A**: the ordinary merge path.
   - **B**: the ordinary merge path, with the proof named in the description:
     the suite that exercises the code, the preview checked, and what the
     pull request's checks do not exercise.
   - **C**: a specialist review of the diff, then the owner's explicit
     go-ahead for that pull request, asked through a question prompt. Do not
     start the merge tool before it, stop one that is running, and say on the
     pull request that the change is held and why.
   - **D**: raise it on a ticket with the evidence. Do not start it; the
     owner decides, case by case, what each one needs before it is started.
4. **Reclassify when the facts change.** A class B change that needs a
   configuration change, or changes behaviour, has left class B. Say so on
   the pull request and take the new class's sign-off.

## The failure this prevents

A merge tool that reads only checks and review state merges a privacy or
authentication change the moment they are green. The checks cannot tell a
lint update from a change to what leaves the process, and an instruction to
carry on with a body of work is not consent to each trust-boundary change
inside it. Worked instance (2026-11-23): a change to what the Sentry SDK is
told to collect was opened, marked ready and put to the merge tool as one more
update in a dependency pass, and the owner stopped it.

The opposite failure is as real: holding every change for a person's approval.
Class A and class B exist so that most changes are not held.
