# Seam Definition Precedes Migration — 2026-04-18

## What the work was like

A session that started as a 3-hour Practice track (author PDR-007,
migrate files) became an 8-hour structural reshape with 17 new PDRs,
a Core contract change, and a genuine mid-session corrective that
reframed the whole migration.

The rhythm went: propose → approve → scope expansion → approve →
execute → corrective interrupt → reframe → execute. Three times
the scope expanded on owner direction; once the direction reversed.
Each expansion was an invitation to do more coherent work; the
reversal was a pointed question about a boundary I had drawn
loosely.

## The corrective that mattered

Mid-migration, mid-bash-loop, about to `git mv` 53 pattern files
into `practice-core/patterns/`. The owner interrupted: "how are we
going to handle the integration and discoverability of two sets of
patterns? I don't like the split... we need clear separation in
intent, audience, meaning, it's too loose as it is now."

The word that cut: **seam**. I had drawn a boundary using one axis
(universal vs ecosystem-specific) when the real axis was different
(governance vs engineering; and within engineering, general vs
instance). Without seam clarity, the two pattern directories would
have had effectively the same admission bar, each accumulating
drift that the other couldn't reject. Moving files around a loose
seam would have actively made the system worse.

The corrective produced three outputs I did not have going in: a
clearer model of PDRs (some are pattern-shaped; some are decision-
shaped; they all sit together because they all govern the
Practice), a clearer model of patterns (general abstractions
synthesised from instances, not moved from instances), and a
redefinition of the migration itself (nothing moves from
memory/active/patterns/ because patterns-in-the-Practice are authored
fresh via synthesis).

## What this felt like

Being stopped mid-commit was disorienting in the moment and
clarifying afterward. The disorientation was momentum-loss — I was
confident the migration was sound and was executing smoothly; the
interrupt said "you are confident about the wrong thing." The
clarification was seeing, as the owner pointed it out, that the
confidence had been structural: my plan had internal consistency
but no external test. The seam had never been challenged because
I had never asked whether moving files was the right operation in
the first place.

The metacognition invocation felt useful as a circuit breaker.
Reading the metacognition directive forced me to slow down and
actually reconsider what I had been doing, rather than just
adjusting the classification and carrying on. The distinction
between "reconsider the approach" and "fix the current approach"
mattered here.

## What I would do differently

Next time the scope of a structural reorganisation grows to
include many file moves, the seam-definition pass should run
explicitly before classification. I did the classification pass,
presented it, got approval, and started executing — without ever
confirming that the axis of classification was the right one.

The lightweight version of the seam-definition pass is a
one-paragraph statement of the intent/audience/meaning distinction
between the source and destination, followed by three test cases
where the distinction produces a non-obvious result. If I cannot
write those three test cases, I do not yet understand the seam.

## What the session produced

17 PDRs (PDR-007 through PDR-023). Core contract redefined as
files + required directories. 29 instance patterns gained
`related_pdr` frontmatter linking them to their general
governance form. `outgoing/` sharpened to ephemeral exchange only.
Trinity and entry points updated. One commit, 96 files, +5550/−2362.

The external repo waiting on the enhanced Practice now has a
substantially more coherent substrate than it would have received
had the original 3-hour scope held.
