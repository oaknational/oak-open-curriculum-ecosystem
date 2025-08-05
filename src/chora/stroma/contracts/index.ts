/**
 * @fileoverview Contracts - cell membrane interfaces
 * @module substrate/contracts
 *
 * Contracts define the boundaries between components,
 * controlling what can enter and exit each module.
 */

// Logger contract - cell membrane for logging system
export type { Logger } from './logger.js';

// ConfigProvider contract - cell membrane for configuration system
export type { ConfigProvider } from './config.js';

// EventBus contract - hormonal messaging between organs
export type { EventBus } from './event-bus.js';

// Notion operations contract - for dependency injection
export type {
  NotionOperations,
  NotionTransformers,
  NotionFormatters,
} from './notion-operations.js';
