---
name: project-spec-creation
classification: active
description: Create project definition documents for generative UI handoff (v0, Bolt, etc.). Use when specifying a content-driven site for another agent — discovery, design constraints, guardrails, assets, and handoff structure.
---

# Project Definition Document Creation

You are helping create a comprehensive set of project definition documents for handoff to a generative UI agent (like v0.app, Bolt, or similar). The goal is to produce documents that are:

- **Complete enough** that the agent can build without inventing content
- **Constrained enough** that the agent cannot drift into generic patterns
- **Expressive enough** that the owner's distinctive voice survives generation

This process works for any content-driven site: personal portfolios, CVs, blogs, microbusiness sites, artist showcases, service providers, etc.

---

## Phase 1: Discovery & Content Extraction

### 1.1 Identify Project Type

| Type                   | Primary Content              | Key Pages                      | Special Needs                |
| ---------------------- | ---------------------------- | ------------------------------ | ---------------------------- |
| **CV / Personal site** | Bio, experience, credentials | Home, CV, variants             | Print CSS, JSON-LD Person    |
| **Visual portfolio**   | Images, project descriptions | Gallery, project detail, about | Image optimization, lightbox |
| **Blog**               | Posts, categories, author    | Home, post, archive, about     | RSS, reading time, dates     |
| **Microbusiness**      | Services, contact, location  | Home, services, contact        | Maps, forms, hours           |
| **Artist/Creator**     | Works, exhibitions, press    | Gallery, CV, press, contact    | Image galleries, chronology  |

### 1.2 Gather Source Content

- All existing copy (bios, descriptions, about text)
- Prior versions of the site or documents
- Visual assets (logos, photos, work samples)
- Structured data (credentials, exhibitions, services, posts)
- External profiles (LinkedIn, GitHub, Behance, etc.)

### 1.3 Identify the Owner's Voice

Ask:

- What makes their writing recognizable?
- What tensions, trade-offs, or deliberate ambiguities should be preserved?
- What do they explicitly _not_ want to sound like?
- Is there industry jargon they embrace or reject?

Document this as **Character and Tone** (see Phase 2).

### 1.4 Structure the Content

Convert prose into structured JSON where appropriate:

```text
content/
├── site.json           # Global metadata (name, tagline, social links)
├── [primary].json      # Main content (cv.json, portfolio.json, services.json)
├── [secondary].json    # Supporting content (posts/, projects/)
├── og.json             # Open Graph metadata
└── jsonld.json         # Structured data (Schema.org)
```

---

## Phase 2: Design & Constraints

### 2.1 Define Character and Tone

Create 3-5 specific attributes that describe the feel, not just adjectives:

**Template:**

```markdown
The design should express:

- **[Attribute name]**: [What it means visually/structurally]
- **[Attribute name]**: [What it means visually/structurally]
```

**Examples by project type:**

| Type          | Example Attributes                                                |
| ------------- | ----------------------------------------------------------------- |
| CV            | "Inexorable forward motion" — directional energy, content emerges |
| Portfolio     | "Work speaks first" — images dominate, text supports              |
| Blog          | "Quiet authority" — generous whitespace, no shouting              |
| Microbusiness | "Approachable expertise" — warm but competent                     |

### 2.2 Create Anti-Patterns

**"Do Not Optimise For" list** — What the agent should actively avoid:

Universal anti-patterns:

- Animation density or decorative motion
- Marketing persuasion, hype language
- Unnecessary component abstraction
- Heavy gradients, glows, glassmorphism

Project-specific additions:

- CV: Timelines, career arcs, "impact metrics" not in content
- Portfolio: Infinite scroll, tiny thumbnails, autoplay
- Blog: Comment sections, share buttons, newsletter popups
- Microbusiness: Stock photos, testimonial carousels

### 2.3 Lock Typography and Color

Specify exact values, not ranges:

- Font families with roles (headings vs prose)
- Font fallback stacks
- Type scale (specific px values)
- Line height (exact ratio like 1.7)
- Color palette with hex values
- **Verified contrast ratios** (calculate and document)

### 2.4 Define Accessibility Requirements

Minimum: WCAG 2.2 AA. Call out specific criteria:

- Contrast ratios (4.5:1 body, 3:1 large text)
- Focus indicators (2px outline minimum)
- Target sizes (24×24px minimum)
- Skip links, heading hierarchy, landmarks
- `prefers-reduced-motion` respect

### 2.5 Project-Specific Requirements

| Type          | Special Requirements                                      |
| ------------- | --------------------------------------------------------- |
| CV            | Print CSS (A4), PDF-friendly, variants as separate routes |
| Portfolio     | Responsive images, lazy loading, project detail template  |
| Blog          | Post template, date formatting, estimated reading time    |
| Microbusiness | Contact form handling, map embed, business hours          |

---

## Phase 3: Agent Guardrails

### 3.1 Copy Lock

Make immutability explicit and redundant:

```markdown
## Copy Lock (Non-Negotiable)

All copy in `content/*.json` is FINAL.

- Do **not** rewrite, paraphrase, summarise, correct, or "improve"
- Do **not** omit content for aesthetic or layout reasons
- Do **not** reorder content unless a spec explicitly requires it
- Headings, punctuation, casing, and hyphenation are part of the copy
- Your job is **typesetting and rendering**, not editing

If layout conflicts with content length, change the layout, not the content.
```

### 3.2 Voice Preservation

```markdown
Do not simplify or sanitise language that expresses uncertainty,
constraint, or trade-off. Preserve deliberate asymmetry, restraint,
and unfinished edges in the prose.
```

### 3.3 Failure Mode Analysis

Anticipate how the agent might fail:

| Failure Mode          | Risk                            | Mitigation            |
| --------------------- | ------------------------------- | --------------------- |
| Helpful rewriting     | Breaks voice/cadence            | Copy Lock             |
| Editorial compression | Loses nuance                    | Completeness check    |
| Selective omission    | Drops "less important" sections | Explicit section list |
| Template averaging    | Generic result                  | Character/Tone spec   |
| Over-styling          | Decorative clutter              | Anti-pattern list     |

### 3.4 Fallback Rules

```markdown
- If uncertain about layout, do less: simplify the layout. Never omit content; the Copy Lock
  holds.
- If uncertain about styling, default to typography and whitespace.
- If uncertain about a section, render it plainly rather than guess at emphasis.
```

### 3.5 Completeness Check

```markdown
Before finishing, verify that every field in:

- `content/site.json`
- `content/[primary].json`
  has been rendered on the appropriate route.

No truncation, collapsing, "read more", or editorial shortening.
```

---

## Phase 4: External Review

### 4.1 Multi-Agent Review

Have different AI systems review the documents:

- Each has different biases and catches different issues
- Systematically evaluate suggestions before implementing
- Don't implement blindly — some suggestions conflict

### 4.2 Cross-Document Consistency

Verify:

- No conflicting values (colors, spacing, fonts)
- No orphaned references (files mentioned but not provided)
- Document precedence is clear and explicit
- All placeholder values replaced (REPLACE*WITH*\*)

### 4.3 Dependency Audit

For any packages specified:

```bash
pnpm view <package> time --json | jq -r 'to_entries | sort_by(.value) | reverse | .[0:3]'
```

- Reject packages with no releases in 18+ months
- Document why each dependency is needed
- Prefer built-in solutions over dependencies

---

## Phase 5: Asset Preparation

### 5.1 Static Asset Generation

Generate all visual assets before handoff:

- Favicons (light/dark variants if theme-aware)
- Apple touch icons
- Open Graph images
- Logo variants

Don't rely on runtime generation for v0 handoff.

### 5.2 Image Optimization

For visual portfolios:

- Multiple sizes (thumbnail, preview, full)
- WebP/AVIF with fallbacks
- Lazy loading strategy
- Alt text in content files

### 5.3 Verification

Compare generated assets against reference/original:

- Correct colors
- Correct dimensions
- Proper centering/positioning

---

## Phase 6: Handoff Structure

### 6.1 File Organization

```text
project/
├── v0-prompt.md              ← Entry point (read this first)
├── README.md                 ← Explains structure and handoff process
├── content/
│   ├── site.json             ← Global metadata
│   ├── [primary].json        ← Main content
│   ├── og.json               ← Open Graph
│   └── jsonld.json           ← Structured data
├── spec/
│   ├── design-brief.md       ← Design requirements
│   ├── presentation.json     ← Typography, layout values
│   ├── theme.json            ← Colors, spacing, CSS variables
│   ├── deps.md               ← Approved dependencies
│   └── [components].md       ← UI component placement
├── public/
│   ├── favicon-*.svg         ← Generated icons
│   ├── og-image.png          ← Social sharing image
│   └── [assets]              ← Other static assets
└── post-handoff/
    ├── README.md             ← Not for v0
    ├── testing.md            ← QA strategy
    ├── hardening.md          ← Security, performance
    └── deployment.md         ← Hosting notes
```

### 6.2 Entry Point Document

The main prompt should include:

1. Source file list with descriptions
2. Document precedence (when in conflict)
3. Routes / page structure
4. Key requirements summary
5. Quality bar (what "done" looks like)
6. Anti-patterns list

### 6.3 README

Explain:

- What files to pass to v0
- What files are for post-generation
- Document precedence
- How to verify the output

---

## Output Checklist

### Documents

- [ ] Entry point prompt (`v0-prompt.md`)
- [ ] Design brief with character, tone, anti-patterns
- [ ] Content files (JSON) with all copy
- [ ] Presentation spec (layout, type scale, spacing)
- [ ] Theme config (colors, verified contrast)
- [ ] Dependency list with maintenance dates
- [ ] Accessibility requirements
- [ ] README explaining structure

### Assets

- [ ] Logo/favicon variants
- [ ] Open Graph image
- [ ] Any required images optimized

### Project-Specific

- [ ] CV: Print CSS requirements, variant rules
- [ ] Portfolio: Image gallery spec, project template
- [ ] Blog: Post template, archive structure
- [ ] Microbusiness: Contact form handling, map/hours

### Hygiene

- [ ] .gitignore (no node_modules, OS artifacts)
- [ ] All placeholder values replaced
- [ ] No conflicting specs across documents
- [ ] Dependency audit complete

---

## Key Principles

1. **Trust but verify** — Check claims about package maintenance, contrast ratios
2. **Redundancy in constraints** — Say important things multiple times
3. **Explicit over implicit** — If something matters, write it down
4. **Preserve voice** — Don't smooth out deliberate texture in content
5. **Separation of concerns** — Content vs spec vs post-generation
6. **Less is more** — Minimal dependencies, minimal animation, maximal clarity
