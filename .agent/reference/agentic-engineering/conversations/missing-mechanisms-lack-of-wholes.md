# Missing Mechanisms, Lack of Wholes

> **Editor's note — 2026-04-21 Session 5**: this conversation transcript
> is preserved verbatim as historical record. References to "workstream
> brief's Promotion watchlist" reflect doctrine current at the time of
> the conversation; the workstream-brief artefact surface was retired in
> Session 5 of the `memory-feedback` thread and the promotion watchlist
> now lives in the per-thread next-session record's `Lane state`
> substructure. See [PDR-011 §Amendment Log 2026-04-21 Session 5](../../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md#amendment-log)
> for the canonical update.

are all the memory planes wired into appropriate feedback loops? Is the applied Practice learning on all fronts?     
  Does the Practice itself needs updates or PDRs around the memory enhancements? What about the new patterns, and the  
  need for pertubation mechanisms? Are there any mechanisms for emergent learnings to flow out of a memory plane, or   
  out of the emergent whole of the memory planes, and back into the repo or the Practice?                              
  @.agents/skills/jc-metacognition/                                                                                    
                                                                                                                       
  Don't change any files, just explore, understand, reflect, then answer                                               
  ⎿  Listed directory .agents/skills/jc-metacognition/                                                                 
  ⎿  .agent/memory/operational/next-session-opener.md (file://):                                                       
  ⎿    ● [Line 44:37] "oneline": Unknown word. (cSpell)                                                                
  ⎿    ● [Line 108:18] "unlanded": Unknown word. (cSpell)                                                              
  ⎿    ● [Line 123:5] "Unlanded": Unknown word. (cSpell)
                                                                                                                       
⏺ Honest assessment after exploring. Mixed — one plane is wired well, one is freshly wired, one is unwired, and the
  emergent-whole observation is unmechanised.                                                                          
                                                                                                                     
  Plane-by-plane                                      
                                                                                                                       
  Active memory — wired, mature loop. capture (napkin) → distil (distilled.md) → graduate (ADRs/PDRs/rules/docs) →     
  enforce (rules). Documented in ADR-131, PDR-011, practice.md. Size-triggered (napkin ~500 lines) + trigger-list for  
  consolidation. Feedback to repo AND to Practice Core. ✓                                                              
                                                                                                                       
  Operational memory — newly wired this session. session-handoff writes; start-right reads; tracks                     
  resolve/promote/delete at close; promotion_needed on a track card routes into the workstream brief's Promotion       
  watchlist, which then routes into napkin. Loop works; it's just young. Cross-plane path operational→active is real. ✓
                                                                                                                     
  Executive memory — the gap. Installed without a loop. No drift-detection surface, no graduation channel, no automatic
   route back into active memory. When a session notices the reviewer catalogue is one-behind or the artefact-inventory
   is stale, there is no standardised pathway — the observation relies on the agent remembering to drop a napkin entry 
  manually. Refresh discipline says "only when artefact architecture evolves," which is a write-side rule, not a     
  learning loop.

  Cross-plane paths                                                                                                    
   
  ┌─────────────────────────────┬────────────────────────────────────────────────────────┐                             
  │          From → To          │                         Status                         │                           
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤
  │ Active → Operational        │ ✓ session-handoff reads distilled/napkin signals       │
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤
  │ Active → Executive          │ ✗ no path                                              │                             
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤                             
  │ Active → Practice Core      │ ✓ via consolidation → PDR/pattern graduation           │                             
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤                             
  │ Operational → Active        │ ✓ via promotion_needed → watchlist → napkin            │                           
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤                             
  │ Operational → Executive     │ ✗ no path                                              │                           
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤                             
  │ Operational → Practice Core │ ✓ via PDR-011 amendment (this session demonstrated it) │                           
  ├─────────────────────────────┼────────────────────────────────────────────────────────┤                             
  │ Executive → anywhere        │ ✗ no path — read-only discipline                       │
  └─────────────────────────────┴────────────────────────────────────────────────────────┘                             
                                                                                                                     
  Emergent-whole observation                                                                                           
                                                                                                                     
  Not mechanised. The inherited-framing pattern surfaced three times this session; the owner named it, not an agent    
  mechanism. Cross-plane redundancy detection (same rule stated in three layers) has no validator. The
  perturbation-mechanism bundle was the owner's synthesis. Agent-side, the machinery doesn't reach across planes to    
  spot meta-patterns. This is a real gap.                                                                            

  Practice updates the memory enhancements imply

  Three PDR/doctrine candidates, in priority order:                                                                    
   
  1. PDR — Three-mode memory taxonomy. Currently host-local (in .agent/memory/README.md + orientation.md). Decision    
  needed: is it portable Practice doctrine (belongs in Practice Core) or legitimately host-local? If portable, draft a
  PDR; if host-local, record that explicitly so other repos don't silently inherit the three-mode shape without        
  choosing it.                                                                                                       
  2. PDR — Executive-memory feedback loop. Defines the drift-detection surface and the graduation channel from
  executive memory back into active memory (and onwards). Without this, executive memory becomes a write-once catalogue
   that silently goes stale.
  3. practice.md Artefact Map update. Currently describes .agent/memory/ as a single thing; post-restructure it's three
   things with distinct cadences. Minor text update, not a PDR.                                                        
   
  Patterns and perturbation mechanisms — captured but stagnation-risk                                                  
                                                                                                                     
  Both live in napkin awaiting graduation. The mechanism to graduate them is jc-consolidate-docs. That mechanism is    
  session-invoked, not time-triggered. If the next sessions stay on Sentry integration work, the perturbation-mechanism
   PDR and the inherited-framing pattern extraction can sit indefinitely. Not fine if it drifts.                       
                                                                                                                     
  A simple improvement: the Deep consolidation status field in repo-continuity.md already exists as a narrative        
  pending-graduations surface. Making it more structured (explicit list of pending graduations with trigger conditions
  and first-captured dates) would give age-visibility without inventing new machinery.                                 
                                                                                                                     
  The honest bottom line

  Memory planes are not fully wired. Active is healthy, operational is young-but-real, executive is a sink without a   
  return path. Cross-plane paths have gaps (active→executive, executive→anywhere). Emergent-whole observation relies on
   human insight. The Practice needs at minimum a taxonomy decision (portable vs host-local), ideally an               
  executive-memory loop PDR, and a practice.md Artefact Map refresh. Patterns and perturbation mechanisms are captured
  but stagnation-vulnerable without time-based or size-based triggers.

  None of this is urgent for shipping Sentry at public alpha. All of it is the kind of thing that, left alone, produces
   the same failure mode the perturbation-mechanism work was designed to prevent — an agent inheriting an incomplete
  machinery and not noticing what's missing.                                                                           
                                                         