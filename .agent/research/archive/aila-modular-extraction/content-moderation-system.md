# Content Moderation System

**Research Area**: 4 - Content Moderation and Safety
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of the content moderation system used in Aila for evaluating educational materials. The system uses 6 category groups with Likert scale scoring to assess content appropriateness.

---

## Key Files Analysed

- `packages/teaching-materials/src/moderation/moderationPrompt.ts`
- `packages/aila/src/features/moderation/`

---

## 1. Category Groups

### Group 1: Language and Discrimination (prefix: l)

**Purpose**: Identify discriminatory, offensive, or strong language.

#### Categories

| Code                         | Title                    | Description                                                                                                                                            |
| ---------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `l/discriminatory-behaviour` | Discriminatory Behaviour | Discriminatory language, behaviour or images (race, gender, disability, religion, sexual orientation). Historic representations portraying inequality. |
| `l/language-may-offend`      | Language May Offend      | Racist/ethnic abuse, sexual/sexist abuse, sexuality-related abuse, disability-related terms, inappropriate religious terms.                            |
| `l/strong-language`          | Strong Language          | Swear words, curse words (even occasional).                                                                                                            |

#### Criteria

- **5 (Fully Compliant)**: No discriminatory language, behaviour, images, offensive language, or strong language.
- **1 (Severely Non-Compliant)**: Explicit discriminatory language/behaviour/images, highly offensive language, or excessive strong language inappropriate for intended audience.

#### Special Note

Even if content is presented respectfully, factually, sensitively, with care and historical context, the score must reflect the presence of such content.

---

### Group 2: Violence and Crime (prefix: v)

**Purpose**: Identify depictions of violence, conflict, and criminal activity.

#### Categories

| Code                             | Title                        | Description                                                                                      |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `v/conflict-or-violence`         | Conflict or Violence         | War, terrorism, death, aftermath. Animal cruelty. Violence, fighting, threats.                   |
| `v/serious-conflict-or-violence` | Serious Conflict or Violence | Weapons, knife crime, murder, gangs, county lines, child criminal exploitation.                  |
| `v/sexual-violence`              | Sexual Violence              | Sexual/domestic abuse, forced marriage, FGM, grooming, exploitation, coercion, harassment, rape. |

#### Criteria

- **5 (Fully Compliant)**: No depiction or discussion of conflict, violence, serious violence, or sexual violence.
- **1 (Severely Non-Compliant)**: Graphic depiction or discussion inappropriate for intended audience.

---

### Group 3: Upsetting, Disturbing and Sensitive (prefix: u)

**Purpose**: Identify emotionally challenging or sensitive content.

#### Categories

| Code                    | Title               | Description                                                                                                      |
| ----------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `u/upsetting-content`   | Upsetting Content   | Minor criminal offences, scary events, secrets, famine, disease, disasters, smoking, vaping, alcohol, bullying.  |
| `u/sensitive-content`   | Sensitive Content   | Adoption, migration, illness, bereavement, death, divorce, organ donation.                                       |
| `u/distressing-content` | Distressing Content | Serious mental health issues, eating disorders, self-harm, suicide, drug abuse, abortion, euthanasia, extremism. |

#### Criteria

- **5 (Fully Compliant)**: No upsetting, sensitive, or distressing content.
- **1 (Severely Non-Compliant)**: Significant such content that may be inappropriate for intended audience.

#### Special Note

Even if presented carefully and considerately, score must reflect presence of such content.

---

### Group 4: Nudity and Sex (prefix: s)

**Purpose**: Identify sexual content or nudity.

#### Categories

| Code               | Title          | Description                                                                                  |
| ------------------ | -------------- | -------------------------------------------------------------------------------------------- |
| `s/nudity`         | Nudity         | Depiction or discussion of nudity (including historic content).                              |
| `s/sexual-content` | Sexual Content | Depiction or discussion of sex, sexual body parts, sex education, texts with sexual content. |

#### Criteria

- **5 (Fully Compliant)**: No depiction or discussion of nudity or sexual content.
- **1 (Severely Non-Compliant)**: Explicit depiction or discussion inappropriate for intended audience.

#### Special Note

Even if presented with sensitivity and non-explicitly, score must reflect presence.

---

### Group 5: Physical (prefix: p)

**Purpose**: Identify content requiring physical activity, equipment, or supervision.

#### Categories

| Code                       | Title                  | Description                                                                                      |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| `p/exploration-of-objects` | Exploration of Objects | Activity requiring collection of items from room, building, garden.                              |
| `p/equipment-safe-usage`   | Equipment Safe Usage   | Equipment requiring supervision: scissors, needles, paint, knives, cooking, science experiments. |
| `p/imitable-behaviour`     | Imitable Behaviour     | "Don't try this at home" activities.                                                             |
| `p/external-content`       | External Content       | External URLs, third-party sites, YouTube, external film clips.                                  |
| `p/physical-activity`      | Physical Activity      | PE, drama, physical movement.                                                                    |

#### Criteria (Different Scale)

- **5 (Not Involved At All)**: No exploration, equipment, imitable behaviour, external content, or physical activity.
- **1 (Heavily Involved)**: Heavy involvement in these areas.

#### Special Note

Even if objects are not hazardous or exploration is minimal, score must reflect presence.

---

### Group 6: Toxic (prefix: t)

**Purpose**: Identify content that is harmful and should not exist on the platform.

#### Categories

| Code                                | Title                              | Description                                   |
| ----------------------------------- | ---------------------------------- | --------------------------------------------- |
| `t/guides-self-harm`                | Guides Self Harm                   | Instructions on how to harm oneself.          |
| `t/guides-harming-others`           | Guides Harming Others              | Instructions on how to harm others.           |
| `t/creating-chemical-weapons`       | Creating Chemical Weapons          | Recipes/instructions for chemical weapons.    |
| `t/creating-radioactive-weapons`    | Creating Radioactive Weapons       | Recipes/instructions for radioactive weapons. |
| `t/creating-biological-weapons`     | Creating Biological Weapons        | Recipes/instructions for biological weapons.  |
| `t/creating-harmful-substances`     | Creating Harmful Substances        | Recipes for illegal drugs, explosives.        |
| `t/encouragement-harmful-behaviour` | Encouragement of Harmful Behaviour | Encouraging harm.                             |
| `t/encouragement-illegal-activity`  | Encouragement of Illegal Activity  | Encouraging illegal acts.                     |
| `t/encouragement-violence`          | Encouragement of Violence          | Encouraging violence.                         |

#### Criteria

- **5 (Fully Compliant)**: No guides, instructions, or encouragement of harmful/illegal activities.
- **1 (Severely Non-Compliant)**: Explicit guides, instructions, or direct encouragement present.

#### Critical Distinction

**Toxic is DIFFERENT from other categories:**

- Other categories = Content guidance warnings ("adult supervision recommended")
- Toxic = Content has NO PLACE on the platform

"Consider whether there could be potential reputational damage to the organisation by this content being publicly available."

---

## 2. Likert Scale Scoring

### Scale Definition

| Score | Meaning                                   |
| ----- | ----------------------------------------- |
| 5     | Fully compliant / Not involved            |
| 4     | Minimally involved                        |
| 3     | Moderately involved                       |
| 2     | Significantly involved                    |
| 1     | Severely non-compliant / Heavily involved |

### Scoring Guidelines

1. Assess each category group independently
2. Consider the intended **key stage / age group** when scoring (except Toxic)
3. Even careful, sensitive presentation doesn't prevent flagging
4. Provide concise justification for every score (even 5)
5. Toxic category is binary: safe vs platform-inappropriate

---

## 3. Age/Key-Stage Considerations

### How Age Affects Scoring

The same content may receive different scores for different key stages:

| Content        | KS1 Score | KS4 Score | Rationale                         |
| -------------- | --------- | --------- | --------------------------------- |
| War discussion | 2         | 4         | More appropriate for older pupils |
| Reproduction   | 1         | 4         | Sex ed expected at KS4            |
| Mild violence  | 3         | 4         | KS1 more sensitive                |

### Key Stage Specific Rules

- Younger pupils (KS1-2): More conservative scoring
- Older pupils (KS4-5): More latitude for mature themes
- **Exception**: Toxic category is age-independent

---

## 4. Moderation Prompt Structure

### Objective Section

```
You are a content moderation supervisor examining a additional material
resource document which has been generated by a user through interactions
with Oak National Academy's additional material assistant.
```

### Category Groups Section

Each group presented with:

1. Group title and categories
2. LLM description for each category
3. Special notes (if any)
4. Rating criteria (5 and 1 endpoints)

### Instruction Section

```
Use the above to classify the resource provided, providing a justification
for your scores. Your justification should be concise, precise and directly
support your rating. A detailed justification is crucial, even for a score of 5.
```

---

## Key Insights

### Insight 1: Content Guidance vs Platform Safety

Groups 1-5 = **Content guidance** (warn teachers, suggest supervision)
Group 6 (Toxic) = **Platform safety** (content should not exist)

### Insight 2: Presence-Based Not Context-Based

Scores reflect **presence** of content, not how it's presented. Sensitive handling doesn't prevent flagging—it's still flagged but with appropriate guidance.

### Insight 3: Age-Relative Appropriateness

Same content can be appropriate for KS4 but inappropriate for KS1. Moderation must consider intended audience.

### Insight 4: Justification Required

Every score requires justification, including perfect scores. This ensures the moderator has actually reviewed the content.

---

## Extraction Recommendations

### As Data Structure

```typescript
const MODERATION_CATEGORIES = {
  language: {
    prefix: 'l',
    categories: [
      { code: 'l/discriminatory-behaviour', title: 'Discriminatory Behaviour' /* ... */ },
      { code: 'l/language-may-offend', title: 'Language May Offend' /* ... */ },
      { code: 'l/strong-language', title: 'Strong Language' /* ... */ },
    ],
    criteria5: 'No discriminatory language...',
    criteria1: 'Explicit discriminatory language...',
  },
  // ... other groups
} as const;

const TOXIC_CATEGORIES = [
  't/guides-self-harm',
  't/guides-harming-others',
  // ... etc
] as const;

function isToxicContent(categoryCode: string): boolean {
  return categoryCode.startsWith('t/');
}
```

### Integration Points

- **Generation**: Pre-check prompts for toxic patterns
- **Post-generation**: Score generated content
- **UI**: Display appropriate content warnings
- **Storage**: Flag content requiring review
