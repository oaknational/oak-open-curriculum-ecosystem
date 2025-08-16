# Phase Jim

## General To Do

- [x] Create a report on which parts of the codebase are generic to "Oak MCP Servers" and which are specific to the "Oak Notion MCP Server", and begin to define domain boundaries between the two, with the goal of eventual extraction of the generic code into a shared library.
- [x] Identify all uses of Node specific APIs, and group them, to enable definition of an edge-compatible core API surface, with Node extensions for Node-specific use cases.
- [x] See if this repo is small enough that type-enabled linting can be enabled without making linting take too long for git hooks. -- it's borderline too slow, but acceptable for the extra issues and bad patterns it catches at check time.
- [x] Add plans to define boundaries between external systems (Notion), and our code. Make that boundary explicit and simple. Use Notion types and type-guards/predicates at that boundary to properly validate the data, we will use the same types in our codebase. Consider using Zod schemas to validate incoming data, but do not create new types where the Notion SDK types are already available.
- [x] Add Claude custom commands for quality gates, stepping back, commit and push
- [x] Think about how best to use subagents
- [x] Turn it into a pnpm workspace and Turbo monorepo
- [ ] Find all the as, any, non-null, `record<string`, eslint-disable, ts-ignore, ts-expect-error, etc in the SDK and MCP server. and remove them manually.
- [ ] Sort out the flawed type propagation from getting the thing working fast.
- [ ] Remove any dead code from the refactoring
- [ ] Improve the documentation, the rules file is now too large to be consistently applied by the agent, and we have other "agent guidance" docs... we need to consolidate and refine. Fewer, better, more consistent.
- [ ] Standardise and improve the sub-agents, sort out the rules/guidance first.
- [ ] Add mutation testing to the test suite
- [ ] Make sure that the generated types are properly crossed referenced, so not anyValidKey: anyValidValue, but specificValidKey: validValuesForThatSpecificKey, required types derived from data structures with reference IDs on both sides
- [ ] Enforce logger usage with eslint no-console rule
- [ ] Update Zod to Zod 4 everywhere
- [ ] Import hooks library from @engraph

## MCP server ideas

- [ ] Open Curriculum API MCP server including hybrid lexical+semantic search and all the API endpoints
- [ ] An MCP server that takes a JSON array of well defined tasks `[{name: string, prompt: string}]`, uses Claude Typescript SDK to execute them in parallel, and collates and returns the results to the calling MCP client. E.g. fixing linting issues, there are many issues, but approximately five groups of issues, so we could run five Claude tasks in parallel, and collate the results. Five Sonnet instances could be given prompts specify the files, issues, and likely solutions, and told that all fixes need to aligned with the rules in .agent/directives-and-memory/AGENT.md, and that all fixes need to be self-contained, i.e. not depend on other fixes, and that once their individual fixes are made the instances should stop, not pick up other tasks or make any other changes. If the changes are isolated, atomic, and precise, then the agents should be able to act in parallel without any issues.

## Architecture and Nomenclature

```text
Discrete Hierarchy (bounded)                Phantom Layer           Cross-Cutting Chōra
───────────────────────────────             ─────────────────        ──────────────────────────────
Morion (Μόριον) → Moria (Μόρια)             Eidōlon → Eidōla        Chōra (Χώρα) → Chōrai (Χῶραι)
  [Molecule → Molecules / syntax atoms]     [Phantom molecules?]      [collective fields]

Organelle → Organelles                      Eidōlon → Eidōla          ├─ Aither (Αἰθήρ) → Aitheres (Αἰθέρες)
  [Organelle / pure functions]              [Phantom functions]       │    [Ether: flows, events, error handling, logging]
                                                                      │
Kytos (Κύτος) → Kytia (Κύτια)               Eidōlon → Eidōla          ├─ Stroma (Στρῶμα) → Stromata (Στρώματα)
  [Cell → Cells / modules]                  [Phantom modules]         │    [Matrix/Layer/Foundation: types, schemas, contracts]
                                                                      │
Histos (Ἱστός) → Histoi (Ἱστοί)             Eidōlon → Eidōla          ├─ Krypton (Κρυπτόν) → Krypta (Κρυπτά)
  [Tissue → Tissues / libraries]            [Phantom libraries]       │    [Hidden: secrets, keys, tokens]
                                                                      │
Organon (ὄργανον) → Organa (ὄργανα)         Eidōlon → Eidōla          ├─ Phaneron (Φανερόν) → Phanera (Φανερά)
  [Organ → Organs / services]               [Phantom services]        │    [Visible: runtime config, settings]
                                                                      │
Systema (Σύστημα) → Systemata (Συστήματα)   Eidōlon → Eidōla          ├─ Kanōn (Κανών) → Kanones (Κανόνες)
  [System → Systems / grouped Organa]       [Phantom systems]         │    [Canon: tooling config, standards]
                                                                      │
Psychon (Ψυχόν) → Psycha (Ψυχά)              Eidōlon → Eidōla          ├─ Kratos (Κράτος) → Krate (Κράτη)
  [Living Being → Organisms / products]     [Phantom products]        │    [Power: control, permissions]
                                                                      │
Ecosystema (Οἰκοσύστημα) → Ecosystemata     Eidōlon → Eidōla          └─ Nomos (Νόμος) → Nomoi (Νόμοι)
  [Ecosystem → Ecosystems / clusters]       [Phantom ecosystems]          [Law: governance, policy]

Biosphaera (Βιοσφαῖρα) → Biosphaerae        Eidōlon → Eidōla
  [Biosphere → Biospheres / platform]       [Phantom platforms]
```
