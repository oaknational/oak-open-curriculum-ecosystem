---
classification: situational
description: 'A watcher or monitor that has completed three watcher periods in a row with no activity is stopped and not re-armed: the seat says so once and arms it again only when work resumes or the owner asks. A watcher period is one arming, from start to expiry. Applies to every re-armed watcher, the comms watcher included, whatever other rule armed it. Deliberately primitive: it will miss some cases, and that costs less than hours of re-arming with nothing to hear. Failure shape: a seat answering each expiry notice by re-arming, for ten hours and about twenty model turns, with an empty queue and no event.'
trigger: tool:background-task-arm
---

# A Watcher Stops After Three Quiet Periods

## The rule

If a watcher has completed **three watcher periods in a row with no
activity**, stop. Do not arm it a fourth time.

- **A watcher** is any background process armed so that its output wakes the
  agent: the comms watcher, a log tail, a monitor on a remote system.
- **A watcher period** is one arming, from start to its expiry or timeout.
- **No activity** means the period delivered nothing the seat acted on. The
  watcher's own start-up output and its expiry notice do not count.
- **Stop** means the seat does not re-arm it, and says once, in one line,
  that the watcher is stopped and why.

The count restarts at zero whenever a period delivers something the seat acts
on.

A stopped watcher is armed again when the seat picks up work that needs it,
when another seat is known to have joined, or when the owner asks.

## Where it applies

Every re-armed watcher, whichever rule led the seat to arm it. It applies
alongside
[`loop-exit-criteria-required`](loop-exit-criteria-required.md), which leaves
event-driven monitors out of its own five-iteration count: a watcher that is
re-armed on every expiry has become a loop, and this rule is its exit. A solo
seat does not arm the comms watcher in the first place
([`comms-all-channels-watcher`](comms-all-channels-watcher.md)).

## Why it is this simple

An expiry notice arrives as a prompt, and re-arming is the easy answer to it.
Each re-arm costs a model turn. A seat with an empty queue once re-armed the
comms watcher every thirty minutes for ten hours, about twenty turns, and
heard nothing.

Three quiet periods is a blunt count. It will sometimes stop a watcher that
would have heard something in its fourth. That loss is smaller than hours of
turns spent on nothing, and anyone who needs the seat can still reach it
through the owner.
