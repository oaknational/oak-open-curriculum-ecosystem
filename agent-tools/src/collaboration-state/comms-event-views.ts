/**
 * Comms-event view types — every event is one of these from the perspective
 * of a given agent. The comms event stream is the canonical truth; these are
 * the views the agent sees onto it.
 *
 * - `broadcast`: narrative event with no addressing — visible to everyone.
 * - `group`: narrative event whose `audience` array includes the agent.
 * - `directed`: directed-kind message addressed to the agent, OR narrative
 *   event whose `addressed_to` names the agent.
 * - `observed`: cross-traffic the agent witnesses but is not the addressee
 *   of — directed-kind events to another agent, narratives `addressed_to`
 *   another agent, or narratives whose `audience` is set but excludes the
 *   agent. **Incidental visibility, not a change to the agent's work
 *   contract**: observed events do not impose action on the agent. They
 *   exist so the broad-awareness contract per
 *   `.agent/rules/comms-all-channels-watcher.md` holds — agents apply
 *   relevance triage in their own reasoning, not at the watcher boundary.
 * - `lifecycle`: structured lifecycle moment (session, claim, consolidation).
 *
 * Sync-urgent messages are not a separate kind today: they are carried by
 * any of the above views with an urgency convention applied at the agent's
 * reasoning layer, not at the watcher boundary. When the schema grows a
 * sync kind or urgency flag, `sync` will be added here as a sixth view.
 */
export type EventView = 'broadcast' | 'group' | 'directed' | 'observed' | 'lifecycle';
