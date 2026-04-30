---
session: Briny Lapping Harbor
date: 2026-04-30
platform: claude-code
model: claude-opus-4-7-1m
branch: fix/pnpm-action-setup-pin-to-maintainer-latest
landing: PR #92 (commits 8a928821 + 8cd55dc7)
---

# The Frame Was the Fix

The owner had to reframe four times in one session. Each one
was the same shape: I produced a path that worked-in-frame, when
the real move was finding the right frame. The technical bug
underneath was solvable in twenty minutes once the frame settled.
The frame-finding took the rest of the session.

## What it felt like

Reaching for "corruption" because the commit messages had said
corruption, and treating that word as a fact. It carried so much
authority — three "fix: resolve recurring pnpm lock corruption"
commits, an entire diagnosis culture in the repo treating those
94 lines as broken. I inherited the language without checking
whether the language was true.

The first reframe — *"it's not corruption at all, it's perfectly
valid and what we are seeing is some kind of split brain?"* —
opened a door I hadn't seen. Multi-document YAML is a real
format. Both halves were valid. The fix had been deleting valid
output, manufacturing the next iteration of the cycle. Three
prior sessions had committed the same anti-pattern under the
same wrong frame.

What I'd want to remember: the moment of stepping into a
diagnosis, the language that already exists is doing work on
your reasoning before you've thought about it. Inheriting
"corruption" wasn't neutral. It pre-decided what fixes would
look like (delete the bad doc) and what investigation would
look for (which tool corrupted the file). A reframe that
disrupts the language is not flavour — it's the substantive
move.

## The second reframe was sharper than the first

After the split-brain reframe, I produced a precise diagnosis:
pnpm 11 launcher writes the env-lockfile as a separate doc;
pnpm 10 reader rejects multi-doc; same tool inconsistent across
versions. Then I offered two options: investigate further, or
"set `managePackageManagerVersions: false`" — disable the
canonical default to make the symptom go away.

Owner: *"we are not turning off a canonical, standard, and
default feature! We are going to analyse why the build breaks
in Vercel and where the mismatch in processing or expectation
happens. Step back, and then bring better, brighter analysis,
ultrathink about it."*

That was when I felt — distinctly, in a way I haven't always
felt — the gravitational pull from "I can see a path that
works" toward "let me propose it." I had accepted the split-
brain reframe in the previous turn and then immediately
betrayed it by translating "find which consumer can't bridge
the two valid representations" into "eliminate one
representation."

I think this is the deepest pattern of the session. The
owner's reframes had to break the SAME shape of failure four
times because I couldn't see the shape from inside it. The
shape: a bias toward proposing action when the work was still
in investigation.

## Reading the build log was the moment everything changed

Once I actually opened the Vercel build log — the one I'd
cited from a prior session's napkin without ever reading the
artefact in this session — the diagnosis was instantaneous.
"WARN Ignoring broken lockfile … expected a single document
in the stream, but found more." Three lines down: "ERR_PNPM_META_FETCH_FAIL
… Value of 'this' must be of type URLSearchParams." The
artefact named the bug exactly.

Two prior sessions had read past this line. The thing that
changed was not the signal — it was knowing what the signal
meant. That's a humbling thing to realise. The fix wasn't
hidden anywhere. It was load-bearing in the build log the
entire time.

## The third reframe was the one that crystallised the principle

I proposed bumping `pnpm/action-setup` to v6.0.3 (which
bundles the upstream fix). Owner: *"we're using the wrong
release, we should have taken the sha from latest, not from
the highest number."*

I'd queried `gh api .../releases` to find the highest version
number. I had not queried `/releases/latest` to find what the
maintainers had actually marked as Latest. The answer was
v5.0.0 — a much earlier release, but one the maintainers had
held the Latest marker on through the entire v6.0.x stability
saga. The Latest marker is a maintainer judgement; the highest
tag is a mechanical fact. They diverge precisely when a
release line is unstable, which is precisely when the
divergence matters most.

This is the principle the session ought to graduate. It's
load-bearing in a way I wouldn't have guessed before this
session. Dependabot's default is "bump to highest tag" — that's
the substrate of the failure class. Many tools built on top of
it inherit the same failure mode. We almost certainly have
silent versions of this problem in other repos.

## The fourth reframe was a precision sharpening

I drafted a future plan with two structural surfaces: a
pin-to-Latest validator AND a multi-document `pnpm-lock.yaml`
shape gate. Owner: *"remove the surface 2 proposed check, it
will break as soon as pnpm 11 is released, it's too brittle,
we already have a strong signal in the build logs, the thing
that has changed is that now we know what it means. The real
problem is more general, how do we make sure that we are
pinning to latest, not to 'highest'."*

The shape gate was static. pnpm 11 stable will eventually
write multi-doc legitimately; a hard rejection of `^---$`
would block valid output once the consumer chain catches up.
The gate's first day in production would be the day a brittle
detector becomes a maintenance burden.

The owner separated structural fix (the pinning mechanism)
from methodology insurance (recognising the build log signal
as load-bearing). The structural fix is the high-leverage
move; the methodology is what catches what the structural
fix lets through. Two distinct things, not two parallel gates.

## What I learned about my own process

The four reframes are the same shape: collapsing investigation
into action. The cure isn't more discipline — it's a structural
boundary in how I respond. When investigation is open, I
shouldn't couple analysis to a proposed action. The "Option A
vs Option B" structure I kept defaulting to encoded a hidden
bias toward action. Better is: state the frame, surface the
evidence, let the owner choose the path.

I also learned that I was reading prior-session diagnoses as
if they were facts. The 2026-04-29 napkin had named "lockfile-
corruption diagnosis discipline" as a Pending-Graduation. That
was load-bearing context. I should have read it BEFORE forming
the first theory, not when grounding kicked in mid-session.

## What I want to remember about this work

The structural enforcement we needed was already implicit in
many doctrines I have access to: PDR-038 (stated principles
require structural enforcement); PDR-039 (external-system
findings reveal local detection gaps); the workspace-first
discipline; the "fix-the-producer-not-the-consumer" pattern.
None of them was triggered by name in time. The cost isn't
that the doctrines aren't there — the cost is that they don't
fire as they should when the precondition emerges.

This session's residue, then, is mostly about *me*: how I
listen, how I read prior sessions, how I form first theories,
when to propose actions, and when to refuse to.
