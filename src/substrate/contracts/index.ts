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
