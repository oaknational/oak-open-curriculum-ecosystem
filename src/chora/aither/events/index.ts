/**
 * @fileoverview Events system barrel export - hormonal messaging infrastructure
 * @module systems/events
 *
 * The events system is the hormonal messaging infrastructure that enables
 * organs to communicate without direct coupling. Like hormones in a biological
 * system, events flow throughout the organism carrying signals between organs.
 */

// Export implementation
export { createEventBus } from './event-bus.js';

// Re-export contracts from substrate
export type { EventBus } from '../../stroma/contracts/event-bus.js';
