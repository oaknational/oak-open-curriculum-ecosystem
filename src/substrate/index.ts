/**
 * @fileoverview Substrate - The physics of our system
 * @module substrate
 *
 * The substrate contains fundamental types, contracts, and schemas
 * that form the unchanging laws everything else follows.
 * Like physics in biology, it provides constraints enabling self-organization.
 */

// Re-export all types - the fundamental constants
export * from './types/index.js';

// Re-export all contracts - the cell membranes
export * from './contracts/index.js';

// Re-export all event schemas - the signaling patterns
export * from './event-schemas/index.js';
