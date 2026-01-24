# MFL Synonym Architecture

**Stream**: search-quality  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../bulk-data-analysis/vocabulary-mining.md](../bulk-data-analysis/vocabulary-mining.md)  
**Created**: 2026-01-24  
**Last Updated**: 2026-01-24

---

## Overview

The MFL (Modern Foreign Languages) synonym files contain structural issues that violate DRY and confuse different categories of vocabulary data.

**Languages affected**: French, German, Spanish

**Problems identified**:

1. **DRY violation**: Common grammar terms repeated 3× across files
2. **Semantic confusion**: Translation hints mixed with true synonyms
3. **Questionable value**: Some entries provide no search benefit

---

## Problem Analysis

### DRY Violation: Common Grammar Terms

These concepts appear identically in ALL THREE MFL files:

| Concept | French | German | Spanish | Notes |
|---------|:------:|:------:|:-------:|-------|
| `verb` | ✓ | ✓ | ✓ | Identical |
| `noun` | ✓ | ✓ | ✓ | Identical |
| `adjective` | ✓ | ✓ | ✓ | Identical |
| `adverb` | ✓ | ✓ | ✓ | Identical |
| `pronoun` | ✓ | ✓ | ✓ | Nearly identical |
| `preposition` | ✓ | ✓ | ✓ | Identical |
| `present-tense` | ✓ | ✓ | ✓ | Identical |
| `future-tense` | ✓ | ✓ | ✓ | Identical |
| `speaking` | ✓ | ✓ | ✓ | Identical |
| `listening` | ✓ | ✓ | ✓ | Identical |
| `reading` | ✓ | ✓ | ✓ | Identical |
| `writing` | ✓ | ✓ | ✓ | Identical |
| `negation` | ✓ | ✓ | ✓ | Core same, details differ |
| `question-words` | ✓ | - | ✓ | Same concept |
| `grammatical-gender` | ✓ | - | ✓ | Same concept |

**Impact**: ~14 entries × 3 languages = 42 entries that should be ~14 in a shared file.

### Semantic Confusion: Bucket Classification

Current synonym files mix different categories that should be treated differently:

| Bucket | Definition | Example | Treatment |
|--------|------------|---------|-----------|
| **A: True synonyms** | English words that mean the same | `negation → negative` | Keep in synonym set |
| **B: Accented variants** | Same word with/without diacritics | `être → etre` | Keep (ASCII folding backup) |
| **C: Translation hints** | Foreign word → English meaning | `comment → how question` | Remove (no search value) |
| **D: Language-specific terms** | Terms unique to one language | `liaison`, `accusative` | Keep in language file |

---

## Bucket C: Translation Hints (Removed)

These entries were removed from synonym files because they provide no search value.
Teachers search in English; these foreign language words don't appear in search queries.

**French** (removed):
```typescript
comment: ['how question']    // French "how" → English meaning
quand: ['when question']     // French "when" → English meaning
qui: ['who question']        // French "who" → English meaning
quel: ['quelle', 'which question']  // Form variant + translation
```

**German** (removed):
```typescript
du: ['informal you singular']   // Definition, not synonym
ihr: ['informal you plural']    // Definition, not synonym
sie: ['formal you', 'polite form']  // Definition, not synonym
```

**Spanish** (removed):
```typescript
cómo: ['como', 'how question']  // Accent variant + translation
quién: ['quien', 'who question'] // Accent variant + translation
```

**Archived to**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/bucket-c-analysis.ts`

---

## Proposed Architecture

### Phase 1: Remove Bucket C (✅ Done 2026-01-24)

Remove translation hints from synonym files. Archive for analysis.

### Phase 2: Create `mfl-common.ts` (Future)

Extract common grammar terms to a shared file:

```typescript
// mfl-common.ts
export const mflCommonSynonyms = {
  // GRAMMAR WORD CLASSES
  verb: ['verbs', 'verb conjugation'],
  noun: ['nouns', 'naming word'],
  adjective: ['adjectives', 'describing word'],
  // ...
  
  // TENSES (common concept)
  'present-tense': ['present', 'present tense verbs'],
  'past-tense': ['past'],
  'future-tense': ['future', 'future tense'],
  
  // LANGUAGE SKILLS
  speaking: ['oral', 'spoken', 'pronunciation'],
  listening: ['comprehension', 'aural'],
  // ...
  
  // COMMON STRUCTURES
  negation: ['negative', 'making negative', 'not'],
  'question-words': ['interrogatives', 'wh-words'],
  'grammatical-gender': ['gender', 'masculine', 'feminine'],
} as const;
```

### Phase 3: Refactor Language Files (Future)

Keep only language-specific concepts in individual files:

**French-specific**: `liaison`, `sfc`, `passé composé`
**German-specific**: `case`, `accusative`, `dative`, `separable-verb`, `word-order`
**Spanish-specific**: `ser`, `estar`, `preterite`

---

## Value Reflection

**What value are synonyms providing?**

| Use Case | Synonym Helps? | Example |
|----------|:-------------:|---------|
| Teacher types "negative" → finds "negation" lessons | ✓ | `negation → negative` |
| Teacher types "etre" → finds "être" lessons | ✓ | ASCII folding backup |
| Teacher types "how question French" → finds "comment" | ✗ | Teachers don't search this way |

**Key insight**: Synonyms should bridge *English* colloquial terms to *English* curriculum terms.
Foreign language words in lesson titles are matched by the indexed content, not by synonyms.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../bulk-data-analysis/vocabulary-mining.md](../bulk-data-analysis/vocabulary-mining.md) | Synonym bucket classification |
| [../../synonyms/README.md](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md) | Synonym source of truth |
| [mfl-multilingual-embeddings.md](mfl-multilingual-embeddings.md) | MFL search quality issues |

---

## Checklist

- [x] Document MFL synonym architecture issues
- [x] Remove Bucket C entries from synonym files
- [x] Archive Bucket C entries for analysis
- [ ] Create `mfl-common.ts` with shared grammar terms
- [ ] Refactor language files to remove duplicates
- [ ] Update index.ts to compose synonyms correctly
- [ ] Validate search quality unchanged
