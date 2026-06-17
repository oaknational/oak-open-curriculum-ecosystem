---
pdr_kind: governance
---

# PDR-102: Editorial Voice Is an Optional, Host-Defined, Scope-Bounded Concern

**Status**: Accepted
**Date**: 2026-06-17
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md) (host-local
instance vs portable governance — a specific voice is a host-local instance, this
PDR is the portable governance);
[PDR-019](PDR-019-adr-scope-by-reusability.md) (the ADR-vs-PDR reusability test —
the *concept* is re-derived across repos, so it is a PDR; a specific voice is
host-local and travels only by deliberate human transfer).

## Context

Some Practice-bearing repositories publish outward-facing prose — a vision, a
strategy, a public landing narrative, announcements, partner-facing material. For
that prose, a consistent editorial voice raises quality and trust. Other
repositories publish no such prose and need no voice at all.

Two failure modes sit either side of this:

1. **No governance.** A repo that adopts a voice has no shared discipline for
   *where* the voice applies, so the persuasive register leaks into builder-facing
   surfaces (plans, decision records, developer docs, code) where it degrades the
   precise transmission of understanding those surfaces exist for.
2. **Over-portability.** A specific repo's voice — its brand, terminology, and
   register — is written into the portable Practice Core and travels to every repo
   that hydrates the Core, imposing one organisation's voice on all of them.

The Core should carry the *concept and its governance*, never any specific voice.

## Decision

**Editorial voice is optional, host-defined, and scope-bounded.**

1. **Optional.** A Practice-bearing repository MAY adopt an editorial voice for
   its outward-facing and strategic prose. Most repositories need none; adoption
   is a deliberate host choice, never a default and never mandated by the Core.
2. **Host-defined, never in the Core.** When a repo adopts a voice, the voice
   itself — its principles, terminology, register, examples — lives in a
   host-local artefact (a host directive or doc). The Practice Core carries only
   this governance (the optional concept, the scope discipline, the audience
   model) and **never carries or transports any specific voice**. A voice does not
   travel through Core hydration; if one repo's voice is wanted in another, a
   human transfers it deliberately.
3. **Scope-bounded — the load-bearing exclusion.** A voice applies only to
   *outward-facing and strategic* surfaces (e.g. a vision, a strategy, public
   narrative, announcements, partner-facing copy). It is **excluded** from
   *builder-facing* surfaces — plans, decision records, developer and engineering
   docs, code, code comments, commit messages, and agent operational/state
   surfaces. Those surfaces exist to transmit understanding precisely; an
   editorial or persuasive register bends that transmission and is a defect there,
   not an improvement. When a single document holds both (a public readme with a
   developer section), the voice applies to the outward narrative and the
   builder-facing sections stay in plain technical register.
4. **Audience-aware.** A host that adopts a voice names the audiences it serves
   and may calibrate register per audience. A generally useful axis is **whether
   the reader decides or builds**: readers who decide (leaders, sponsors, buyers)
   lead on value, impact, cost, and fit; readers who build (engineers,
   integrators) lead on capability, contracts, and how it works. The specific
   audiences and any further calibration are host-defined.

## Scope

**Adopter scope**: every Practice-bearing repo. The *governance* is portable;
*adoption* and the *voice content* are host choices. A repo that publishes no
outward prose simply does not adopt — no artefact required.

**Applies to**: the decision of whether and how to govern an editorial voice. It
does not prescribe a voice, does not require adoption, and does not define
audiences for any host.

## Rationale

Separating the portable governance (the optional concept, the scope exclusion, the
audience model) from the non-portable content (a specific voice) lets the
discipline travel while the brand does not. The scope exclusion is the
load-bearing clause: it is the part most likely to be violated — persuasive copy
creeping into plans and decision records — and the part whose violation costs the
most, because it degrades transmission to the people building the system.

## Consequences

**Enables**: a repo can hold a quality bar for its outward prose with a shared
discipline for where it applies, while the Core stays voice-neutral and portable.

**Costs**: a host that adopts a voice maintains a host-local voice artefact and
honours the scope boundary.

**Forbids**: writing any specific voice into the Practice Core; applying an
editorial or persuasive register to builder-facing surfaces; mandating that a repo
adopt a voice.

## Falsifiability

Shown wrong if the scope boundary proves unworkable in practice — adopting repos
find no stable line between outward-facing and builder-facing surfaces, or the
decide-vs-build audience axis never changes how anything is written. The honest
signal to revise is adopters reporting that the exclusion cannot be drawn, or that
the concept added governance overhead without changing any prose.

## Source

Graduated 2026-06-17 from a host instantiation: a repository authored a
host-local editorial-voice directive scoped to its outward and strategic prose,
excluded from plans and developer docs, with a decide-vs-build audience model. The
owner directed that the *concept* — optional, audience-aware, scope-bounded —
graduate to portable governance, while the specific voice stays host-local and
travels only by deliberate human transfer.
