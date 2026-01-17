# Operations

**Domain**: Running the search system safely and reliably  
**Intent**: The system operates predictably, failures are handled, changes can be rolled back  
**Impact**: Production stability, observable behaviour, safe evolution

---

## Why Separate?

This is about **how the system runs**, not what it does. The questions here are:

- What happens when inference fails?
- How do we version synonym sets?
- Who owns what?
- What are our latency budgets?

This work defines operational constraints, not search quality improvements.

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [governance.md](governance.md) | Latency budgets, failure modes, versioning, ownership | 📋 Pending |

---

## Key Areas

| Area | What It Covers |
|------|----------------|
| **Latency Budgets** | p50/p95 targets per stage |
| **Failure Modes** | What happens when components fail |
| **Graceful Degradation** | Which stages are optional under load |
| **Versioning** | How vocab, rules, profiles are versioned |
| **Ownership** | Who owns each asset class |

---

## Dependencies

- SDK extraction complete
- Basic search operational

---

## Success Criteria

- [ ] Latency budgets defined and monitored
- [ ] Fallback logic implemented for each stage
- [ ] Versioning strategy for synonym sets and query rules
- [ ] Ownership model documented
