# Plan: Complete Subject Synonym Coverage

**Status**: Active  
**Created**: 2026-01-16  
**ADR**: [ADR-100](../../../../docs/architecture/architectural-decisions/100-complete-subject-synonym-coverage.md)  
**Blocks**: Ground truth review (sessions 7+)

## Overview

Complete synonym coverage for all 17 subjects before continuing ground truth review. Synonyms directly impact search quality — reviewing ground truths without complete synonyms would produce misleading results.

**Why this matters**: In Session 6, we found that `cooking-nutrition/primary` had low MRR because queries for "nutrition" weren't finding lessons about "nutrients" — there was no synonym mapping. This pattern likely affects other subjects.

---

## ⚠️ MANDATORY: Accuracy and Sensitivity Review

**ALL synonym entries MUST be reviewed for accuracy and cultural sensitivity before implementation.**

This is not optional. Synonyms affect search results for educational content used by teachers and students across the UK. Incorrect or insensitive synonyms could:
- Return irrelevant or misleading educational content
- Cause offence to religious, cultural, or ethnic groups
- Conflate distinct concepts in ways that misrepresent traditions
- Undermine trust in the search system

### Review Checklist (MUST complete for EVERY synonym file)

Before implementing any synonym file, verify:

- [ ] **Factual accuracy**: Each synonym is a genuine alternative term, not a related-but-different concept
- [ ] **No conflation**: Distinct concepts are NOT mapped to each other (e.g., Torah ≠ Talmud)
- [ ] **Equal treatment**: All groups/traditions within a category are represented fairly
- [ ] **Respectful terminology**: Terms are those that members of each tradition would use
- [ ] **No offensive alternatives**: No terms that could be considered slurs or pejorative
- [ ] **Theological precision**: Religious concepts are not oversimplified or misrepresented
- [ ] **Cultural awareness**: Regional/cultural variations are handled appropriately

### High-Risk Categories Requiring Extra Scrutiny

1. **Religious Education** — Religious figures, texts, places of worship, beliefs
2. **Citizenship** — Political terms, identity, migration, discrimination
3. **RSHE/PSHE** — Relationships, identity, consent, mental health

### Capitalisation Convention

- **Keys (canonical terms)**: Lowercase kebab-case slugs (system convention, e.g., `'jesus'`)
- **Values (alternatives)**: Lowercase (Elasticsearch is case-insensitive, e.g., `['christ', 'jesus christ']`)
- **Comments/documentation**: Proper capitalisation for names (e.g., "Jesus", "Muhammad", "Buddha")

This means in code:
```typescript
// Jesus Christ - Christian figure (COMMENT uses proper capitalisation)
'jesus': ['christ', 'jesus christ'],  // values are lowercase
```

---

## Current State

### Phase 1: Architecture Cleanup ✅ COMPLETE

The following has already been done:

1. ✅ Removed individual re-exports from `synonyms/index.ts` (lines 32-45)
2. ✅ Refactored `synonym-export.ts` to iterate dynamically over `synonymsData`
3. ✅ Verified SDK builds correctly

**Result**: Adding a new synonym file now only requires:
- Create the file
- Add import and entry to `synonyms/index.ts`
- Add entry to `tsup.config.ts`

### Current Synonym Files (9 subjects)

| Subject | File | Status |
|---------|------|--------|
| computing | `computing.ts` | ✅ |
| cooking-nutrition | `cooking-nutrition.ts` | ✅ |
| english | `english.ts` | ✅ |
| geography | `geography.ts` | ✅ |
| history | `history.ts` | ✅ |
| maths | `maths.ts` | ✅ |
| music | `music.ts` | ✅ |
| science | `science.ts` | ✅ |
| (generic/education) | `education.ts` | ✅ |

### Missing Synonym Files (8 subjects + 1 placeholder)

| Subject | Priority | Has Bulk Data | Sensitivity Level |
|---------|----------|---------------|-------------------|
| art | High | ✅ | Low |
| citizenship | High | ✅ | **Medium** |
| design-technology | High | ✅ | Low |
| physical-education | High | ✅ | Low |
| religious-education | High | ✅ | **HIGH** |
| french | Medium | ✅ | Low |
| german | Medium | ✅ | Low |
| spanish | Medium | ✅ | Low |
| rshe-pshe | Low | ❌ (placeholder) | **HIGH** |

---

## Phase 2: Create Missing Subject Synonyms

### Prerequisites

```bash
cd /Users/jim/code/oak/oak-mcp-ecosystem
```

### File Template

Each synonym file follows this pattern:

```typescript
/**
 * [Subject] concept synonyms.
 *
 * Maps canonical [subject] concepts to alternative terms for search expansion.
 *
 * @remarks
 * These synonyms were compiled with care to ensure accuracy and cultural
 * sensitivity. If you identify any inaccuracies, inappropriate conflations,
 * or terms that could cause offence, please contact us immediately:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 *
 * [MINED-YYYY-MM-DD] Extracted from [subject] bulk data (primary + secondary).
 * [REVIEWED-YYYY-MM-DD] Accuracy and sensitivity review completed.
 */

export const [subject]Synonyms = {
  // Category comment
  'canonical-term': [
    'alternative 1',
    'alternative 2',
  ],
} as const;

export type [Subject]Synonyms = typeof [subject]Synonyms;
```

### Disclaimer Template (for HIGH sensitivity files)

For Religious Education, RSHE/PSHE, and other HIGH sensitivity files, add this expanded header:

```typescript
/**
 * [Subject] concept synonyms.
 *
 * Maps canonical [subject] concepts to alternative terms for search expansion.
 *
 * ⚠️ SENSITIVITY NOTICE
 * This file contains terminology related to [religion/relationships/identity/etc.].
 * All entries have been reviewed for accuracy and cultural sensitivity.
 *
 * We have made best efforts to:
 * - Represent all traditions/groups fairly and accurately
 * - Use terminology that members of each community would recognise
 * - Avoid conflating distinct concepts
 * - Exclude any terms that could be considered offensive
 *
 * If you identify any inaccuracies, inappropriate conflations, outdated
 * terminology, or terms that could cause offence, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 *
 * @remarks
 * [MINED-YYYY-MM-DD] Extracted from [subject] bulk data.
 * [REVIEWED-YYYY-MM-DD] Accuracy and sensitivity review completed by [reviewer].
 */
```

---

### 2.1 Art Synonyms

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/art.ts`

**Sensitivity Level**: Low

**Mined vocabulary** (from bulk data):

Units include: 3D Design, Abstract art, Architecture, Ceramics, Collage, Drawing, Fine Art, Lettering, Painting, Photography, Printmaking, Sculpture, Textiles, Street Art

Lessons include: Abstract expression, Assemblage, Body adornment, Colour mixing, Composition, Facial expressions, Formal elements, Mark-making, Mixed media, Perspective, Portrait, Still life, Tone

**Expected concepts**:

```typescript
// Art movements
'abstract-art': ['abstract', 'abstraction', 'non-representational'],
'impressionism': ['impressionist'],
'surrealism': ['surrealist'],
'pop-art': ['pop art', 'popular art'],

// Techniques and processes
'composition': ['arranging', 'layout', 'design'],
'perspective': ['depth', 'vanishing point', 'foreshortening'],
'shading': ['tone', 'tonal work', 'light and dark'],
'mark-making': ['marks', 'drawing marks', 'expressive marks'],

// Media and materials
'watercolour': ['watercolor', 'water colour', 'aquarelle'],
'acrylic': ['acrylic paint', 'acrylics'],
'charcoal': ['charcoal drawing'],
'collage': ['mixed media', 'assemblage'],
'printmaking': ['printing', 'print-making', 'relief printing'],
'ceramics': ['pottery', 'clay work', 'ceramic'],
'textiles': ['fabric', 'textile art', 'fibre art'],
'sculpture': ['3d art', 'three-dimensional art', 'sculptural'],

// Elements and principles
'formal-elements': ['elements of art', 'art elements'],
'line': ['lines', 'linear'],
'shape': ['shapes', 'form'],
'colour': ['color', 'colours', 'colors'],
'texture': ['surface', 'tactile'],
'pattern': ['patterns', 'repetition'],

// Genres
'portrait': ['portraiture', 'self-portrait', 'portraits'],
'landscape': ['landscapes', 'scenery'],
'still-life': ['still life', 'nature morte'],
```

---

### 2.2 Citizenship Synonyms

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/citizenship.ts`

**Sensitivity Level**: Medium — Political terms and identity concepts require care

**Mined vocabulary** (from bulk data):

Units include: Democracy, Elections, Government, Parliament, Constitution, Human rights, Law, Crime, Media, Identity, Community, Active citizenship, Brexit, EU

Lessons include: Voting, MPs, Political parties, Referendums, Civil law, Criminal law, Justice system, Sentencing, Police, Rights, Responsibilities, Equality, Discrimination, Migration, Taxation

**Expected concepts**:

```typescript
// Democracy and government
'democracy': ['democratic', 'democratic system'],
'parliament': ['parliamentary', 'house of commons', 'house of lords'],
'government': ['governing', 'governance'],
'election': ['elections', 'voting', 'electoral'],
'referendum': ['referendums', 'referenda', 'public vote'],
'constitution': ['constitutional'],

// Political participation
'voting': ['vote', 'votes', 'ballot'],
'political-party': ['political parties', 'party politics'],
'mp': ['member of parliament', 'mps', 'members of parliament'],
'campaign': ['campaigning', 'campaigns', 'activism'],

// Law and justice
'law': ['laws', 'legal', 'legislation'],
'criminal-law': ['criminal justice', 'crime law'],
'civil-law': ['civil justice', 'civil cases'],
'justice-system': ['legal system', 'courts', 'judiciary'],
'sentencing': ['sentences', 'punishment'],
'rights': ['human rights', 'civil rights', 'legal rights'],

// Society
'community': ['communities', 'local community'],
'identity': ['identities', 'national identity', 'british identity'],
'migration': ['immigration', 'emigration', 'migrants'],
'equality': ['equal rights', 'fairness'],
'discrimination': ['prejudice', 'bias'],
```

---

### 2.3 Design Technology Synonyms

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/design-technology.ts`

**Sensitivity Level**: Low

**Mined vocabulary** (from bulk data):

Units include: CAD, Structures, Mechanisms, Materials, Textiles, Electronics, Systems and control, Iterative design, Circular economy, Prototypes

Lessons include: Levers, Linkages, Pulleys, Gears, Cams, Pneumatics, Programming, Sensors, Frame structures, Shell structures, Bridges, Packaging

**Expected concepts**:

```typescript
// Design process
'design': ['designing', 'design process'],
'prototype': ['prototypes', 'prototyping', 'model'],
'iteration': ['iterative', 'iterate', 'design iteration'],
'specification': ['specifications', 'design spec', 'brief'],
'cad': ['computer aided design', 'computer-aided design'],

// Materials
'materials': ['material', 'resources'],
'wood': ['timber', 'wooden'],
'metal': ['metals', 'metallic'],
'plastic': ['plastics', 'polymer', 'polymers'],
'textiles': ['fabrics', 'textile', 'cloth'],

// Structures
'structure': ['structures', 'structural'],
'frame-structure': ['frame structures', 'framework'],
'shell-structure': ['shell structures', 'shells'],

// Mechanisms
'mechanism': ['mechanisms', 'mechanical'],
'lever': ['levers', 'leverage'],
'linkage': ['linkages', 'linked'],
'pulley': ['pulleys'],
'gear': ['gears', 'cogs'],
'cam': ['cams'],
'pneumatics': ['pneumatic', 'air pressure'],

// Electronics and control
'electronics': ['electronic', 'circuits'],
'programming': ['coding', 'code', 'programmed'],
'sensor': ['sensors', 'input device'],
'control': ['controlling', 'systems and control'],

// Sustainability
'sustainability': ['sustainable', 'eco-friendly'],
'circular-economy': ['recycling', 'reuse', 'sustainable design'],
```

---

### 2.4 Physical Education Synonyms

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/physical-education.ts`

**Sensitivity Level**: Low

**Mined vocabulary** (from bulk data):

Units include: Athletics, Dance, Gymnastics, Swimming, Invasion games, Net and wall games, Striking and fielding, Health and wellbeing, Outdoor activities, Sport psychology

Sports: Football, Basketball, Netball, Hockey, Rugby, Tennis, Badminton, Cricket, Rounders, Swimming, Gymnastics

**Expected concepts**:

```typescript
// General PE
'physical-education': ['pe', 'p.e.', 'sport', 'sports'],
'exercise': ['physical activity', 'workout', 'training'],
'fitness': ['physical fitness', 'fit', 'conditioning'],

// Sports categories
'invasion-games': ['invasion sports', 'team games'],
'net-games': ['net and wall games', 'racket sports'],
'striking-fielding': ['striking and fielding', 'bat and ball'],
'athletics': ['track and field', 'athletic'],
'gymnastics': ['gymnastic', 'gym'],
'dance': ['dancing', 'movement'],
'swimming': ['swim', 'aquatics'],

// Specific sports
'football': ['soccer'],
'basketball': ['basket ball'],
'netball': ['net ball'],
'rugby': ['rugby union', 'rugby league'],
'tennis': ['lawn tennis'],
'badminton': ['shuttlecock'],
'cricket': ['batting', 'bowling', 'fielding'],
'rounders': ['rounder'],

// Health and fitness
'health': ['healthy', 'wellbeing', 'well-being'],
'nutrition': ['diet', 'eating', 'food'],
'warm-up': ['warming up', 'warmup'],
'cool-down': ['cooling down', 'cooldown'],
'stamina': ['endurance', 'cardiovascular'],
'strength': ['muscular strength', 'power'],
'flexibility': ['stretching', 'suppleness'],

// Movement
'coordination': ['coordinated', 'motor skills'],
'balance': ['balancing', 'stability'],
'agility': ['agile', 'quick movement'],
```

---

### 2.5 Religious Education Synonyms

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/religious-education.ts`

**⚠️ Sensitivity Level**: HIGH — Requires extra scrutiny

**Mined vocabulary** (from bulk data):

Religions: Christianity, Islam, Judaism, Hinduism, Buddhism, Sikhism, Humanism

Units include: Beliefs, Practices, Ethics, Pilgrimage, Prayer, Festivals, Worship, Holy books, Prophets, Jesus, Muhammad, Buddha, Gurus

#### CRITICAL: Sensitivity Review Notes

The following issues were identified and corrected from an initial draft:

1. **❌ WRONG**: `'torah': ['talmud']` — Torah and Talmud are DIFFERENT texts
2. **❌ WRONG**: `'temple': ['mandir', 'gurdwara']` — These are tradition-specific
3. **❌ WRONG**: `'humanism': ['secular']` — Humanism ≠ secular
4. **⚠️ CAREFUL**: `'jesus': ['messiah']` — "Messiah" is a Jewish concept; needs separate entry
5. **⚠️ CAREFUL**: `'guru': ['teacher']` — Too generic; Sikh Gurus are specific

**CORRECTED Expected concepts**:

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// WORLD RELIGIONS — Equal, respectful treatment of all traditions
// ═══════════════════════════════════════════════════════════════════════════

// Christianity
'christianity': ['christian', 'christians'],

// Islam
'islam': ['muslim', 'muslims', 'islamic'],

// Judaism
'judaism': ['jewish', 'jews', 'jew'],

// Hinduism
'hinduism': ['hindu', 'hindus'],

// Buddhism
'buddhism': ['buddhist', 'buddhists'],

// Sikhism
'sikhism': ['sikh', 'sikhs'],

// Humanism (non-religious worldview, NOT the same as "secular")
'humanism': ['humanist', 'humanists', 'non-religious worldview'],

// ═══════════════════════════════════════════════════════════════════════════
// RELIGIOUS CONCEPTS — Generic terms across traditions
// ═══════════════════════════════════════════════════════════════════════════

'belief': ['beliefs', 'faith', 'believing'],
'worship': ['worshipping', 'prayer', 'praying'],
'sacred': ['holy', 'divine', 'spiritual'],
'scripture': ['scriptures', 'holy book', 'holy books', 'sacred text'],
'pilgrimage': ['pilgrimages', 'holy journey'],
'festival': ['festivals', 'religious celebration', 'holy day'],
'ritual': ['rituals', 'rites', 'ceremony'],

// ═══════════════════════════════════════════════════════════════════════════
// ETHICS AND MORALITY
// ═══════════════════════════════════════════════════════════════════════════

'ethics': ['ethical', 'morality', 'moral'],
'good-evil': ['good and evil', 'right and wrong'],
'suffering': ['pain', 'hardship'],
'forgiveness': ['forgiving', 'reconciliation'],

// ═══════════════════════════════════════════════════════════════════════════
// RELIGIOUS FIGURES — Respectful, accurate terminology
// ═══════════════════════════════════════════════════════════════════════════

// Generic
'prophet': ['prophets', 'messenger'],
'god': ['deity', 'divine being'],

// Jesus Christ — Christian figure
'jesus': ['christ', 'jesus christ'],

// Messiah — Jewish concept (separate from Jesus)
'messiah': ['mashiach', 'messianic'],

// Prophet Muhammad — Islamic figure
'muhammad': ['mohammed', 'prophet muhammad'],

// Siddhartha Gautama — the historical Buddha
'buddha': ['siddhartha gautama', 'gautama buddha'],

// Sikh Gurus — NOT generic "teacher"
'guru': ['gurus', 'sikh gurus', 'ten gurus'],

// ═══════════════════════════════════════════════════════════════════════════
// PLACES OF WORSHIP — Separate entries per tradition (NOT conflated)
// ═══════════════════════════════════════════════════════════════════════════

// Christian
'church': ['churches', 'chapel', 'cathedral'],

// Islamic
'mosque': ['mosques', 'masjid'],

// Jewish
'synagogue': ['synagogues', 'shul'],

// Hindu — separate from generic "temple"
'mandir': ['hindu temple', 'hindu mandir'],

// Sikh — separate from generic "temple"
'gurdwara': ['sikh temple', 'sikh gurdwara'],

// Buddhist/generic
'temple': ['temples', 'buddhist temple'],

// ═══════════════════════════════════════════════════════════════════════════
// SACRED TEXTS — Correct distinctions (NOT conflated)
// ═══════════════════════════════════════════════════════════════════════════

// Christian
'bible': ['biblical', 'new testament', 'gospel', 'gospels'],

// Jewish — Torah and Talmud are DIFFERENT texts
'torah': ['pentateuch', 'five books of moses', 'chumash'],
'talmud': ['rabbinic commentary', 'oral law'],
'tanakh': ['hebrew bible', 'jewish scriptures'],

// Islamic
'quran': ['koran', 'quranic'],

// Sikh
'guru-granth-sahib': ['sikh scriptures', 'adi granth'],
```

---

### 2.6 French Synonyms (MFL)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/french.ts`

**Sensitivity Level**: Low

**Focus**: Grammar terms and language learning vocabulary (not French words)

**Expected concepts**:

```typescript
// Grammar terms
'verb': ['verbs', 'verb conjugation'],
'noun': ['nouns', 'naming word'],
'adjective': ['adjectives', 'describing word'],
'adverb': ['adverbs'],
'pronoun': ['pronouns'],
'preposition': ['prepositions'],
'article': ['articles', 'definite article', 'indefinite article'],

// Tenses
'present-tense': ['present', 'present tense verbs'],
'past-tense': ['past', 'perfect tense', 'imperfect tense', 'preterite'],
'future-tense': ['future', 'future tense'],

// Language skills
'speaking': ['oral', 'spoken'],
'listening': ['comprehension', 'aural'],
'reading': ['written comprehension'],
'writing': ['written', 'composition'],

// French-specific
'french': ['français', 'francophone'],
'france': ['french culture', 'la france'],
```

---

### 2.7 German Synonyms (MFL)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/german.ts`

**Sensitivity Level**: Low

**Focus**: Grammar terms (same as French) plus German-specific vocabulary

**Expected concepts**:

```typescript
// Grammar terms (same as French)
'verb': ['verbs', 'verb conjugation'],
'noun': ['nouns', 'naming word'],
'adjective': ['adjectives', 'describing word'],
'case': ['cases', 'nominative', 'accusative', 'dative', 'genitive'],

// German-specific
'german': ['deutsch', 'germanic'],
'germany': ['german culture', 'deutschland'],
'separable-verb': ['separable verbs', 'trennbare verben'],
```

---

### 2.8 Spanish Synonyms (MFL)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/spanish.ts`

**Sensitivity Level**: Low

**Focus**: Grammar terms (same as French) plus Spanish-specific vocabulary

**Expected concepts**:

```typescript
// Grammar terms (same as French)
'verb': ['verbs', 'verb conjugation'],
'noun': ['nouns', 'naming word'],
'adjective': ['adjectives', 'describing word'],

// Spanish-specific
'spanish': ['español', 'hispanic', 'castellano'],
'spain': ['spanish culture', 'españa'],
'latin-america': ['latin american', 'hispanic culture'],
```

---

### 2.9 RSHE/PSHE Synonyms (Placeholder)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/rshe-pshe.ts`

**⚠️ Sensitivity Level**: HIGH — Relationships, identity, consent, mental health

**Note**: No bulk data available yet. Create placeholder with expected concepts. When RSHE bulk data becomes available, this file MUST be revisited and expanded using the same mining process as other subjects.

#### CRITICAL: Sensitivity Review Notes

This subject requires the SAME level of scrutiny as Religious Education.

**Why RSHE requires extra care:**

1. **Age-sensitive content**: Topics must be appropriate for the key stage
2. **Inclusive language**: Must represent all family structures, identities, and relationships
3. **Non-stigmatising**: Mental health and wellbeing terms must not perpetuate stigma
4. **Empowering**: Safety and consent language must be empowering, not fear-based
5. **Legally compliant**: Must align with statutory RSHE guidance
6. **Parental sensitivity**: Content is subject to parental review and opt-out rights

**Potential pitfalls to avoid:**

1. **❌ WRONG**: Assuming "family" = two-parent heterosexual household
2. **❌ WRONG**: Using clinical/medical terms where everyday language is appropriate
3. **❌ WRONG**: Conflating gender identity with sexual orientation
4. **❌ WRONG**: Using outdated or pathologising mental health terminology
5. **❌ WRONG**: Using language that implies judgement about relationship choices
6. **⚠️ CAREFUL**: Consent terminology must be age-appropriate (KS1 ≠ KS4)
7. **⚠️ CAREFUL**: Puberty terms must be inclusive of all bodies

**Review resources:**

- DfE Statutory RSHE Guidance
- Stonewall education resources (for inclusive terminology)
- Mind/Mental Health Foundation (for non-stigmatising MH language)
- NSPCC (for safeguarding language)

**PLACEHOLDER Expected concepts** (to be expanded when bulk data available):

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIPS — Inclusive of all family structures and relationship types
// ═══════════════════════════════════════════════════════════════════════════

// Family — inclusive of diverse structures
'family': ['families', 'family life', 'family structures'],
'relationships': ['relationship', 'interpersonal', 'connections'],
'friendship': ['friends', 'friendships', 'peer relationships'],

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH — Physical and mental, non-stigmatising language
// ═══════════════════════════════════════════════════════════════════════════

// Mental health — non-stigmatising, inclusive terminology
'mental-health': ['emotional health', 'wellbeing', 'mental wellbeing', 'emotional wellbeing'],
'physical-health': ['body health', 'healthy body', 'physical wellbeing'],
'puberty': ['growing up', 'adolescence', 'body changes'],

// ═══════════════════════════════════════════════════════════════════════════
// SAFETY — Age-appropriate, empowering language
// ═══════════════════════════════════════════════════════════════════════════

'safety': ['staying safe', 'personal safety', 'keeping safe'],
'online-safety': ['internet safety', 'digital safety', 'e-safety', 'online wellbeing'],
'consent': ['permission', 'boundaries', 'personal boundaries'],

// ═══════════════════════════════════════════════════════════════════════════
// PERSONAL DEVELOPMENT — Inclusive, affirming language
// ═══════════════════════════════════════════════════════════════════════════

'identity': ['self-identity', 'who am i', 'sense of self'],
'emotions': ['feelings', 'emotional', 'how we feel'],
'resilience': ['coping', 'resilient', 'coping strategies', 'bouncing back'],

// ═══════════════════════════════════════════════════════════════════════════
// BODY AND SELF — Affirming, inclusive language
// ═══════════════════════════════════════════════════════════════════════════

'body': ['bodies', 'our bodies'],
'self-esteem': ['self-worth', 'self-confidence', 'confidence'],
'self-care': ['looking after yourself', 'personal care'],
```

#### When RSHE Bulk Data Becomes Available

1. Mine the bulk data using the standard process
2. Compare mined vocabulary against the placeholder synonyms above
3. Expand entries based on actual curriculum content
4. **RE-RUN the full sensitivity review checklist**
5. Update the `[MINED-YYYY-MM-DD]` and `[REVIEWED-YYYY-MM-DD]` dates
6. Have a second reviewer check HIGH sensitivity entries

---

## Phase 3: Update Index and Build Config

### 3.1 Update `synonyms/index.ts`

Add imports and entries to `synonymsData`:

```typescript
import { artSynonyms } from './art.js';
import { citizenshipSynonyms } from './citizenship.js';
import { designTechnologySynonyms } from './design-technology.js';
import { physicalEducationSynonyms } from './physical-education.js';
import { religiousEducationSynonyms } from './religious-education.js';
import { frenchSynonyms } from './french.js';
import { germanSynonyms } from './german.js';
import { spanishSynonyms } from './spanish.js';
import { rshePsheSynonyms } from './rshe-pshe.js';

export const synonymsData = {
  // ... existing entries ...
  artConcepts: artSynonyms,
  citizenshipConcepts: citizenshipSynonyms,
  designTechnologyConcepts: designTechnologySynonyms,
  physicalEducationConcepts: physicalEducationSynonyms,
  religiousEducationConcepts: religiousEducationSynonyms,
  frenchConcepts: frenchSynonyms,
  germanConcepts: germanSynonyms,
  spanishConcepts: spanishSynonyms,
  rshePsheConcepts: rshePsheSynonyms,
} as const;
```

### 3.2 Update `tsup.config.ts`

Add entry points for new synonym files:

```typescript
// In entry array, add:
'src/mcp/synonyms/art.ts',
'src/mcp/synonyms/citizenship.ts',
'src/mcp/synonyms/design-technology.ts',
'src/mcp/synonyms/physical-education.ts',
'src/mcp/synonyms/religious-education.ts',
'src/mcp/synonyms/french.ts',
'src/mcp/synonyms/german.ts',
'src/mcp/synonyms/spanish.ts',
'src/mcp/synonyms/rshe-pshe.ts',
```

---

## Phase 4: Validation

### 4.1 Build and Push

```bash
cd /Users/jim/code/oak/oak-mcp-ecosystem
pnpm -C packages/sdks/oak-curriculum-sdk build
pnpm -C apps/oak-open-curriculum-semantic-search es:setup
```

### 4.2 Verify Synonym Count

Expected: ~350+ synonyms (up from ~234)

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local
curl -s "${ELASTICSEARCH_URL}/_synonyms/oak-syns?size=1000" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.synonyms_set | length'
```

### 4.3 Test Synonym Expansion

For each new subject, verify synonyms expand correctly:

```bash
# Test art synonyms
curl -X POST "${ELASTICSEARCH_URL}/oak_lessons/_analyze" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"analyzer": "oak_text_search", "text": "watercolour painting"}' | jq '.tokens[].token'

# Test citizenship synonyms
curl -X POST "${ELASTICSEARCH_URL}/oak_lessons/_analyze" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"analyzer": "oak_text_search", "text": "democracy voting"}' | jq '.tokens[].token'

# Test RE synonyms (verify Torah and Talmud are NOT conflated)
curl -X POST "${ELASTICSEARCH_URL}/oak_lessons/_analyze" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"analyzer": "oak_text_search", "text": "torah"}' | jq '.tokens[].token'
```

### 4.4 Run Quality Gates

```bash
pnpm type-check
pnpm lint
pnpm test
```

### 4.5 Run Benchmarks

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark --all --verbose
```

Compare before/after MRR for subjects with new synonyms.

---

## Acceptance Criteria

- [ ] All 17 subjects have synonym files (9 existing + 8 new + 1 placeholder)
- [ ] **ALL synonym files reviewed for accuracy and sensitivity** (mandatory)
- [ ] `synonyms/index.ts` updated with new imports and entries
- [ ] `tsup.config.ts` updated with new entry points
- [ ] SDK builds successfully
- [ ] ES synonym set contains 350+ entries
- [ ] All quality gates pass
- [ ] Benchmark run shows no regression

---

## Files Summary

| File | Action | Status | Sensitivity |
|------|--------|--------|-------------|
| `synonyms/index.ts` | Add imports, remove re-exports | ✅ Done | — |
| `synonym-export.ts` | Refactor to iterate dynamically | ✅ Done | — |
| `tsup.config.ts` | Add new synonym file entries | Pending | — |
| `synonyms/art.ts` | Create | Pending | Low |
| `synonyms/citizenship.ts` | Create | Pending | Medium |
| `synonyms/design-technology.ts` | Create | Pending | Low |
| `synonyms/physical-education.ts` | Create | Pending | Low |
| `synonyms/religious-education.ts` | Create | Pending | **HIGH** |
| `synonyms/french.ts` | Create | Pending | Low |
| `synonyms/german.ts` | Create | Pending | Low |
| `synonyms/spanish.ts` | Create | Pending | Low |
| `synonyms/rshe-pshe.ts` | Create (placeholder) | Pending | **HIGH** |

---

## After Completion

1. Resume ground truth review from Session 7 (cooking-nutrition/secondary)
2. Update `.agent/prompts/semantic-search/semantic-search.prompt.md` to reflect completed prerequisite
3. Mark ADR-100 status as "Accepted"
