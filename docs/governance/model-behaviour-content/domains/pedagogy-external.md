---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# pedagogy-external — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

External EEF Teaching and Learning Toolkit material carrying Oak editorial framing. The corpus is cited, not rewritten; the framing around it is ours to review.

**8 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned elsewhere (8)

These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.

### C438 — methodology.cost\_measure.scale (labels + GBP per-pupil/per-class ranges)

**What it says now:**

```text
cost_measure: {
      name: 'Implementation cost',
      scale: {
        '1': {
          rating: 1,
          label: 'Very low',
          range_per_pupil_per_year_gbp: 'Up to £80',
          range_per_class_per_year_gbp: 'Up to £2,000',
        },
        '2': {
          rating: 2,
          label: 'Low',
          range_per_pupil_per_year_gbp: '£80-£200',
          range_per_class_per_year_gbp: '£2,000-£5,000',
        },
        '3': {
          rating: 3,
          label: 'Moderate',
          range_per_pupil_per_year_gbp: '£200-£600',
          range_per_class_per_year_gbp: '£5,000-£15,000',
        },
        '4': {
          rating: 4,
          label: 'High',
          range_per_pupil_per_year_gbp: '£600-£1,200',
          range_per_class_per_year_gbp: '£15,000-£30,000',
        },
        '5': {
          rating: 5,
          label: 'Very high',
          range_per_pupil_per_year_gbp: 'Over £1,200',
          range_per_class_per_year_gbp: 'Over £30,000',
        },
      },
    },
```

**What it is for:** Defines the 1-5 cost rating labels (Very low..Very high) and their GBP bands used to explain cost ratings in outputs.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C441 — strands[].{id,name,slug,eef\_url} catalog identity (25 strands)

**What it says now:**

```text
strands: [
    {
      id: 'eef-tl-arts-participation',
      name: 'Arts participation',
      slug: 'arts-participation',
      eef_url:
        'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/arts-participation',
      headline: {
        impact_months: 3,
        cost_rating: 1,
        cost_label: 'Very Low',
        evidence_strength_rating: 3,
        evidence_strength_label: 'Moderate',
        headline_summary: 'Moderate impact for very low cost based on moderate evidence',
      },
      definition: {
        short:
          'Involvement in artistic and creative activities such as dance, drama, music, painting, or sculpture.',
        full: 'Arts participation is defined as involvement in artistic and creative activities, such as dance, drama, music, painting, or sculpture. It can occur either as part of the curriculum or as extra-curricular activity. Arts-based approaches may be used in other areas of the curriculum, such as the use of drama to develop engagement and oral language before a writing task. This entry focuses on the benefits of arts participation for core academic attainment in other areas of the curriculum, particularly literacy and mathematics.',
      },
      key_findings: [
        'Arts participation approaches can have a positive impact on academic outcomes in other areas of the curriculum.',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Names and links each of the 25 EEF toolkit strands, forming the catalog agents navigate and cite.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C442 — strands[].definition.short + definition.full (25 strands)

**What it says now:**

```text
definition: {
        short:
          'Involvement in artistic and creative activities such as dance, drama, music, painting, or sculpture.',
        full: 'Arts participation is defined as involvement in artistic and creative activities, such as dance, drama, music, painting, or sculpture. It can occur either as part of the curriculum or as extra-curricular activity. Arts-based approaches may be used in other areas of the curriculum, such as the use of drama to develop engagement and oral language before a writing task. This entry focuses on the benefits of arts participation for core academic attainment in other areas of the curriculum, particularly literacy and mathematics.',
      },
      key_findings: [
        'Arts participation approaches can have a positive impact on academic outcomes in other areas of the curriculum.',
        'The value of arts participation should be considered beyond maths or English outcomes — arts engagement is valuable in and of itself.',
        'If the aim is to improve academic attainment, it is important to identify the link between the chosen arts intervention and the outcomes you want to improve.',
        'Arts-based approaches may offer a route to re-engage older pupils in learning, though this does not always translate into better attainment.',
      ],
      effectiveness: {
        summary:
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Defines each intervention (what it is, scope) so the agent can describe strands accurately to users.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C443 — strands[].key\_findings (bulleted findings across 25 strands)

**What it says now:**

```text
key_findings: [
        'Arts participation approaches can have a positive impact on academic outcomes in other areas of the curriculum.',
        'The value of arts participation should be considered beyond maths or English outcomes — arts engagement is valuable in and of itself.',
        'If the aim is to improve academic attainment, it is important to identify the link between the chosen arts intervention and the outcomes you want to improve.',
        'Arts-based approaches may offer a route to re-engage older pupils in learning, though this does not always translate into better attainment.',
      ],
      effectiveness: {
        summary:
          "The average impact of arts participation on other areas of academic learning appears to be positive but moderate, about an additional three months' progress. Improved outcomes have been identified in English, mathematics and science.",
        mechanisms: [
          'Increased engagement and motivation, particularly for disengaged pupils',
          'Development of transferable skills (creativity, collaboration, self-expression)',
          'Specific cross-curricular links (e.g. drama and writing, music and spatial awareness)',
        ],
      },
      behind_the_average: {
        summary:
          'Impact is similar for both primary and secondary school pupils. Effects tend to be higher for writing and mathematics than reading.',
        by_phase: {
          primary: {
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Supplies the headline evidence points per strand that the agent relays as the substance of each recommendation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C444 — strands[].effectiveness + behind\_the\_average (summary/mechanisms/moderating\_factors)

**What it says now:**

```text
effectiveness: {
        summary:
          "The average impact of arts participation on other areas of academic learning appears to be positive but moderate, about an additional three months' progress. Improved outcomes have been identified in English, mathematics and science.",
        mechanisms: [
          'Increased engagement and motivation, particularly for disengaged pupils',
          'Development of transferable skills (creativity, collaboration, self-expression)',
          'Specific cross-curricular links (e.g. drama and writing, music and spatial awareness)',
        ],
      },
      behind_the_average: {
        summary:
          'Impact is similar for both primary and secondary school pupils. Effects tend to be higher for writing and mathematics than reading.',
        by_phase: {
          primary: {
            notes: 'Similar impact to secondary',
          },
          secondary: {
            notes: 'Similar impact to primary; may particularly benefit disengaged learners',
          },
        },
        by_subject: [
          {
            subject: 'Writing',
            notes: 'Higher impact than average, particularly through drama',
          },
          {
            subject: 'Mathematics',
            notes: 'Higher impact than average, possible link via music and spatial awareness',
          },
          {
            subject: 'Reading',
            notes: 'Lower impact than writing or mathematics',
          },
        ],
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Explains average impact, mechanisms, and phase/subject variation; includes Oak-editorial superlatives (e.g. Feedback 'the most securely evidenced intervention'; Metacognition 'highest impact of any strand').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact

### C446 — strands[].implementation (key\_considerations / common\_pitfalls / digital\_technology\_application)

**What it says now:**

```text
implementation: {
        key_considerations: [
          'Consider whether the aim is academic improvement or wider development — both are valid but require different approaches',
          'Ensure explicit links between arts activities and target learning outcomes where academic improvement is the goal',
          'Consider how increased engagement through arts can be channelled into improved academic learning',
        ],
      },
      related_strands: ['eef-tl-collaborative-learning', 'eef-tl-oral-language-interventions'],
      tags: ['creative', 'engagement', 'cross-curricular', 'enrichment', 'primary', 'secondary'],
    },
    {
      id: 'eef-tl-aspiration-interventions',
      name: 'Aspiration interventions',
      slug: 'aspiration-interventions',
      eef_url:
        'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/aspiration-interventions',
      headline: {
        impact_months: null,
        cost_rating: 1,
        cost_label: 'Very Low',
        evidence_strength_rating: 0,
        evidence_strength_label: 'Insufficient',
        headline_summary: 'Unclear impact for very low cost based on insufficient evidence',
      },
      definition: {
        short:
          "Interventions that aim to raise pupils' aspirations for their future education and career.",
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Advisory do/don't guidance the agent relays for putting a strand into practice (e.g. avoid unstructured group work; teach metacognition within subject content; 'least help first').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C448 — strands[].related\_guidance\_reports (title + url)

**What it says now:**

```text
related_guidance_reports: [
        {
          title: 'Improving Behaviour in Schools',
          url: 'https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/behaviour',
        },
      ],
      tags: [
        'behaviour',
        'classroom-management',
        'self-regulation',
        'universal',
        'targeted',
        'primary',
        'secondary',
      ],
      update_history: [
        {
          date: '2025-05-21',
          notes: 'Updated as part of first living systematic review cycle',
        },
      ],
      school_context_relevance: {
        most_relevant_phases: ['primary', 'secondary'],
        most_relevant_key_stages: ['KS1', 'KS2', 'KS3', 'KS4'],
        most_relevant_priorities: ['improving_behaviour', 'closing_disadvantage_gap'],
        pp_relevance: 'high',
        pp_relevance_note:
          'Behavioural challenges disproportionately affect disadvantaged pupils. Both universal and targeted approaches effective.',
        implementation_requirements: {
          cpd_intensity: 'moderate',
          additional_staff_needed: false,
          resource_cost: 'low',
          time_to_embed: '2-6 months',
          key_staff: ['classroom_teachers', 'pastoral_leads', 'behaviour_leads'],
        },
      },
    },
    {
      id: 'eef-tl-collaborative-learning',
      name: 'Collaborative learning approaches',
      slug: 'collaborative-learning-approaches',
      eef_url:
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Points agents/users to named EEF guidance reports (e.g. 'Improving Behaviour in Schools', 'Teacher Feedback to Improve Pupil Learning') with links for deeper reading.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C451 — uk\_context (pupil\_premium\_rates\_2024\_25, national\_averages, key\_stage\_mapping)

**What it says now:**

```text
uk_context: {
    pupil_premium_rates_2024_25: {
      primary_fsm: 1455,
      secondary_fsm: 1035,
      looked_after_children: 2530,
      service_children: 335,
    },
    national_averages: {
      pp_percentage: 27,
      send_support_percentage: 13,
      ehcp_percentage: 4.3,
      primary_avg_size: 281,
      secondary_avg_size: 993,
    },
    key_stage_mapping: {
      EYFS: {
        age: '3-5',
        years: ['Nursery', 'Reception'],
      },
      KS1: {
        age: '5-7',
        years: ['Y1', 'Y2'],
      },
      KS2: {
        age: '7-11',
        years: ['Y3', 'Y4', 'Y5', 'Y6'],
      },
      KS3: {
        age: '11-14',
        years: ['Y7', 'Y8', 'Y9'],
      },
      KS4: {
        age: '14-16',
        years: ['Y10', 'Y11'],
      },
      KS5: {
        age: '16-18',
        years: ['Y12', 'Y13'],
      },
    },
  },
```

**What it is for:** Supplies UK reference figures (PP funding rates, national PP/SEND averages, key-stage-to-age/year mapping) the agent uses to contextualise recommendations.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
- **Who owns the words:** The EEF Teaching and Learning Toolkit — external material. Cite it, do not rewrite it; the Oak framing around it is ours to review.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-content · **Impact tier:** high-impact
