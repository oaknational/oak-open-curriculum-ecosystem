# Assurance: the four questions and the warrant for each claim

What supports a claim, and what each kind of support cannot establish. Owned with `specify` (its
evidence plan); `assess-specification` applies the same table when it judges adequacy. Source: the
specification framework note, §9.

## Four separate questions

1. Is the specification adequate? It addresses the right need, scope, constraints and affected
   parties, and hides no material contradiction.
2. Does the implementation conform? Its observed or proven behaviour meets the specified obligations
   within the stated domain.
3. Is the result useful in context? People can achieve the intended purpose in the actual environment.
4. Does it produce the claimed wider effect? A defensible evaluation supports the outcome and any
   causal or distributional claim.

A tiny operation closes its local conformance claim while a service-level effect stays unresolved;
no unit must answer all four on its own.

## The warrant a claim needs

| Claim | Appropriate warrant | Essential limit |
| --- | --- | --- |
| Shape or representation validity | Schema validation, static checks, serialisation tests | Establishes neither meaning nor authority |
| Deterministic behaviour | Examples, properties, exhaustive checks over a declared finite domain, analysis or formal proof | Tests sample behaviour; proofs are conditional on models and premises |
| Semantic preservation | Mapping rules, discriminating fixtures, domain review, a justified equivalence argument | Loss is declared; a round trip can preserve a shared mistake |
| Operational reliability | Representative workload and failure evidence; production observation | Environment, correlated failures and observation windows matter |
| Agent behaviour | Held-out cases, repeated trials where relevant, controlled configuration, calibrated scoring, adversarial cases | A finite sample guarantees no future failure |
| Human usability and access | Research with the relevant people and settings, including difficult and excluded cases | A designed persona or an author's walkthrough is not user research |
| Learning or public impact | Valid measurement and an appropriate comparative or causal design | Satisfaction, completion and aggregate averages are not substitutes |

## An evidence record

An evidence record names the exact claim and subject revision, the instrument or oracle version, the
conditions, the input provenance, the result, its uncertainty, the known exclusions, the date and the
reviewer. When an upstream dependency changes, the affected reliance is marked for review; results are
neither eternally valid nor wholly useless.

The only oracle is never generated from the implementation it checks. Schema-derived code and
documentation reduce drift; independently justified examples or properties still catch a wrong source
definition. Expected results need their own substantive basis.

## Acceptance is a profile

Structural validity, behavioural conformance, semantic fidelity, operational readiness, context
suitability and outcome support hold different statuses at once; acceptance is never one green flag.
Evidence strength does not substitute for the authority to accept residual risk, and a non-waivable
obligation cannot be traded away by an internal score.

For AI behaviour, distinguish hard surrounding controls from empirically assessed model behaviour: a
specification can prohibit an unauthorised effect, enforced at a trusted boundary, while measuring
separately whether the model follows instructional preferences. "Never discloses private data" is not
discharged by a set of successful prompts.
