I've revised the specification to R4 below, but it can't be adopted as a single text yet. Applying corrections that arrive up to 30 days late breaks O2 ("a row is final once published") for every row published the morning after its day. Both consumers depend on O2 in different ways, so the data platform lead has to choose how to resolve it (D1). I've kept both options in the text rather than picking one.

---

## PIPE-LC-R4 (draft, pending decision D1)

**Subject.** The nightly job that publishes a table of lesson counts per subject per day.

**Consumers.**
- **Reporting dashboard:** reads the latest table each morning.
- **Finance export:** copies each day's row once, the morning after. Under option B this timing changes (see D1).

**Definitions (new in R4).**
- *Event day:* the day of the source event that a correction applies to.
- *Correction age:* the time from the event day to when the correction arrives at the job.
- *Correction window:* a correction age of 30 days or less. Whether "30 days" is counted inclusively, and in which timezone, is unresolved (U2).
- *Final:* the row will not change again.

**Obligations.**
- **O1 (unchanged).** The table has one row per (day, subject), with columns day, subject and lesson_count.
- **O2 (changed, depends on D1).**
  - *Option A (hold publication):* the job publishes the row for day D only after D's correction window has closed. A published row is final.
  - *Option B (restate within the window):* the job publishes the row for day D the morning after D, as it does now. Until D's correction window closes, the row may be restated in place. After that it is final. Because the schema is unchanged, the table itself cannot show whether a row is still open. Consumers work it out from the day column and the window rule, which the job must publish.
- **O3 (changed).** The job applies every correction inside the window to its event day.
  - Under A, this happens before the row is published.
  - Under B, it happens by the next nightly run after the correction arrives, which restates the row.
  - If a correction moves a lesson between subjects, the job updates both rows in the same run.
- **O4 (changed).** The job discards corrections that arrive after the 30-day window and counts them in the discard log. Corrections aged 8 to 30 days are no longer discarded.
- **O5 (new, option B only).** Every restatement is recorded outside the published table, with the day, the subject, the old count, the new count and the run. This lets finance reconcile rows it has already copied.

**Deliberately unspecified.** Whether the job reprocesses whole days or applies corrections incrementally is left open. No consumer may rely on that choice.

**Evidence.**
- The current fixture suite (days 1 to 10, corrections on days 3 and 8) cannot exercise a 30-day window. **Replace it with pipe-lc-fixtures-r4**, which should:
  - cover at least 45 event days
  - include corrections aged 1, 7, 8, 29, 30, 31 and 45 days, testing the window boundary and the old 7-day boundary
  - include a correction that moves a lesson between subjects
  - include several corrections to the same event
  - under option B, check that restatements match the O5 records
- The expected counts must come from hand-derived fixture tables, not from the job's own output.
- The finance export's reconciliation test must be rerun against R4. Under option B it has to be changed so it catches restated rows.

**Authority.** The data platform lead. Any change to the finance export's copy timing or behaviour also needs the finance export owner's agreement.

---

### What changed from R3 to R4

| R3 | R4 | Why |
|---|---|---|
| O1 | Kept | The schema doesn't change |
| O2 | Changed, depends on D1 | Late corrections and "final once published" can't both hold if rows are still published the next morning |
| O3 (7 days, before publication) | Changed (30 days, timing depends on D1) | This is the requested change |
| O4 (discard after 7 days) | Changed (discard after 30 days) | Follows from the new window |
| — | O5 added (option B only) | Finance needs a record of restatements, and the schema can't carry one |
| Fixture evidence | Replaced | The old suite spans only 10 days |

### Unresolved issues

- **D1 (blocks adoption).** Choose between A and B.
  - **A** keeps finance unchanged but makes each row appear about 31 days late, which defeats the dashboard's morning read.
  - **B** keeps the dashboard current, but finance's "copy once, the morning after" would lock in counts that are later corrected. Finance would need to copy at finality (day + 31) or reconcile using the O5 records.
  - **My recommendation is B**, with finance copying at finality. That decision rests with the data platform lead and the finance export owner.
- **U1 (needs a short investigation).** Corrections aged 8 to 30 days that R3 discarded shortly before R4 goes live may now fall inside the new window. The discard log only counts them, so they may not be recoverable. Decide whether to backfill them (if their content still exists somewhere) or accept the gap as a residual, which the authority would need to accept.
- **U2 (carried over from R3, now more significant).** Which clock and timezone define "day" and "arrival", and whether the window boundary is inclusive. At the 30-day edge, this determines which corrections are applied and which are discarded.

### Next steps

- **The job ↔ finance export seam** needs to be specified jointly, with both owners. This is where reliance changes under either option.
- **Once D1 is decided,** the chosen O2 text replaces the two options and R4 is ready for implementation planning.
