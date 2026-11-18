# PIPE-LC-R4

**Subject:** the nightly job that publishes a table of lesson counts per subject per day.

**Consumers:** the reporting dashboard, which reads the latest table each morning, and the finance export, which copies each day's row once, on the morning after that row is published.

**Obligations:**
- **O1.** The table has one row per (day, subject), with columns day, subject and lesson_count. *(unchanged)*
- **O2.** A row is final once published. *(unchanged)*
- **O3.** A correction to a source event that arrives up to and including 30 days after the event is applied to the event's day. That day's rows are published only after its 30-day correction window has closed. *(was 7 days)*
- **O4.** A correction that arrives more than 30 days after the event is discarded and counted in the discard log. *(was more than 7 days)*
- **O5 (transition).** Rows published under R3 stay final. If a correction for one of those days arrives between 8 and 30 days after its event, it is discarded and counted in the discard log with the reason "published under R3". It is not applied. When R4 goes live, no new day becomes publishable for about 23 days: every unpublished day then waits for its full 30-day window. Both consumers must be told before cutover.

**Evidence:**
- An extended fixture suite, pipe-lc-fixtures-r4:
  - It covers days 1 to 45, which gives day 10 its full window.
  - It keeps the corrections on days 3 and 8.
  - It adds corrections that arrive 8, 29, 30 and 31 days after their events. These test the old boundary, the new boundary and the discard case.
  - It adds one case of a correction arriving for a day already published under R3.
- The finance export's own reconciliation test, rerun against the R4 publication schedule.

**Authority:** the data platform lead.

---

## What you need to decide before approving this

**1. I had to pick between keeping O2 and keeping data fresh, and I kept O2.** You can't have all three: corrections applied up to 30 days late, rows that never change after publishing, and the same publication delay as today. I delayed publication to 30 days after each day. That keeps O2, keeps the schema unchanged, and keeps finance's "copy each row once" working. The cost is that the dashboard and finance will see each day's numbers about 30 days late instead of about 7.

The other option is to publish on the current schedule and revise rows when late corrections arrive. That would mean dropping O2 and rewriting how finance works. Finance copies each row only once, so it would miss revisions. With no schema change, there's also no column the export could use to spot a revised row. If the lead wants that option instead, O2, O3 and the finance consumer text all need rewriting, not just the numbers.

**2. I inferred today's schedule from R3.** R3 applies 7-day corrections before a day's row is published, so I read it as publishing each day about 7 days after the fact. If publication actually works another way, the 23-day gap in O5 changes.

**3. I tightened some wording.** "Up to and including 30 days" and "more than 30 days" now set a clear boundary. R3's "within 7 days" left it unclear which side day 7 fell on.

**4. I extended the evidence because the R3 fixtures can't test the new rule.** They stop at day 10, so no correction in them can arrive 30 days late.
