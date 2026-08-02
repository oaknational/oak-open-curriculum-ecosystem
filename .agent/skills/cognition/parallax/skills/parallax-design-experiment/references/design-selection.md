# Design selection

Use this reference after the estimand and scale map exist. A design is defensible only relative to the question, causal structure, constraints, and intended inference.

## Selection sequence

1. State whether the aim is causal estimation, mechanism discrimination, parameter estimation, prediction, screening, optimisation, measurement validation, or implementation learning.
2. Draw the assignment/intervention, exposure, measurement, and dependency structure.
3. Identify plausible interference, carryover, learning, time trends, clustering, attrition, and non-compliance.
4. Compare at least one design from a different family.
5. Prefer the least assumption-dependent feasible design that answers the actual estimand ethically.
6. Record what the chosen design cannot establish.

## Common families

| Family | Useful when | Important vulnerabilities |
|---|---|---|
| Individually randomised parallel | Units can be independently assigned and interference is limited | Non-compliance, attrition, spillovers, weak external validity |
| Paired or crossover | Within-unit comparison reduces stable heterogeneity | Carryover, period effects, irreversible interventions |
| Blocked or stratified | Known prognostic structure should be balanced | Incorrect strata, sparse cells, analysis ignoring design |
| Cluster randomised | Intervention or interference operates at group level | Few clusters, ICC uncertainty, recruitment after assignment |
| Stepped wedge | Staged delivery is necessary and all clusters eventually receive treatment | Secular trends, carryover, complex modelling, implementation learning |
| Factorial | Several factors and interactions can be varied efficiently | Aliasing, many contrasts, infeasible combinations |
| Fractional factorial or screening | Many controllable factors must be screened | Assumptions about higher-order interactions, resolution |
| Response surface | Optimising continuous process settings | Local validity, model misspecification, unsafe regions |
| Group sequential | Early stopping for benefit, futility, or harm is valuable | Unplanned looks, operational bias, adjusted inference |
| Adaptive | Prospectively planned modifications can improve information or ethics | Simulation burden, time trends, leakage, complex estimands |
| Multi-arm or platform | Several interventions share infrastructure or controls | Multiplicity, non-concurrent controls, temporal drift |
| N-of-1 | Effects are reversible, repeatable, and individual decisions matter | Carryover, unstable condition, limited population inference |
| Simulation/computational | Mechanisms or algorithms can be manipulated reproducibly | Model-to-world bridge, unrealistic inputs, hidden implementation choices |

## When randomisation is unavailable

Do not call an observational comparison an experiment merely because an intervention occurred. Consider:

- **Regression discontinuity:** assignment changes at a threshold; identify local effects and test manipulation/continuity assumptions.
- **Interrupted time series:** repeated observations surround an intervention; model secular trends, autocorrelation, seasonality, and co-interventions.
- **Difference-in-differences:** treated and comparison trajectories can support a parallel-trends argument; inspect pre-trends and composition changes.
- **Instrumental variables:** an instrument affects treatment but has no other path to the outcome; state exclusion and monotonicity assumptions and the local target population.
- **Synthetic control:** a weighted donor pool represents the missing counterfactual; inspect donor quality, pre-fit, spillovers, and placebo tests.
- **Matched or adjusted cohorts:** measured confounding can be controlled; unmeasured confounding remains a defeater.
- **Natural experiments:** assignment-like variation arises externally; justify why it is as-if random for the target estimand.

Use negative controls, falsification tests, sensitivity analysis, triangulation, and alternative designs. Never imply that statistical adjustment creates exchangeability by itself.

## Mixed-method and mechanistic complements

Quantitative causal estimates may show whether an effect occurred but not how, for whom, or why implementation differed. Add process, qualitative, mechanistic, usability, ethnographic, or implementation evidence when it tests a distinct bridge claim. Preserve methodological independence before synthesis.

## Cross-scale checks

Ask separately:

- Does assignment operate at the same unit as exposure?
- Does the analysis model the actual dependence unit?
- Does the measurement window capture the mechanism's expected latency?
- Does the sample support inference to the intended population, sites, periods, and implementation conditions?
- Does a local efficacy result bridge to system adoption and long-term outcomes?

If not, write explicit bridge claims rather than relying on the design label.

## Primary sources and standards

- [NIST/SEMATECH e-Handbook: Process Improvement and design of experiments](https://www.itl.nist.gov/div898/handbook/pri/pri.htm)
- [HM Treasury: The Magenta Book and analytical methods annex](https://www.gov.uk/government/publications/the-magenta-book)
- [FDA: Adaptive Design Clinical Trials for Drugs and Biologics](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adaptive-design-clinical-trials-drugs-and-biologics-guidance-industry)
- [FDA: Interacting on Complex Innovative Trial Designs](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/interacting-fda-complex-innovative-trial-designs-drugs-and-biological-products)

These sources are illustrative across domains. Apply the standards, law, ethics process, and specialist review governing the actual domain and jurisdiction.
