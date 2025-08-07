/**
 * @fileoverview State machine type definitions
 * @module moria/types/state-machine
 *
 * Provides type definitions for state machines and state transitions.
 * These types help model stateful behavior in a type-safe way.
 */

/**
 * Represents a state transition in a state machine
 */
export type StateTransition<TState, TEvent> = {
  /**
   * The state to transition from
   */
  from: TState;

  /**
   * The event that triggers the transition
   */
  event: TEvent;

  /**
   * The state to transition to
   */
  to: TState;

  /**
   * Optional guard condition that must be true for transition
   */
  guard?: (context: unknown) => boolean;
};

/**
 * Represents a complete state machine definition
 */
export type StateMachine<TState, TEvent> = {
  /**
   * The initial state of the machine
   */
  initial: TState;

  /**
   * All possible states in the machine
   */
  states: TState[];

  /**
   * All possible transitions between states
   */
  transitions: StateTransition<TState, TEvent>[];
};

/**
 * State with entry and exit actions
 */
export interface StateWithActions<TState, TContext = unknown> {
  /**
   * The state identifier
   */
  state: TState;

  /**
   * Action to perform on entering this state
   */
  onEntry?: (context: TContext) => void;

  /**
   * Action to perform on exiting this state
   */
  onExit?: (context: TContext) => void;
}

/**
 * Extended state machine with actions
 */
export interface StateMachineWithActions<TState, TEvent, TContext = unknown>
  extends StateMachine<TState, TEvent> {
  /**
   * States with entry/exit actions
   */
  stateActions?: Map<TState, StateWithActions<TState, TContext>>;

  /**
   * Global context for the state machine
   */
  context?: TContext;
}

/**
 * State machine instance that tracks current state
 */
export interface StateMachineInstance<TState, TEvent, TContext = unknown> {
  /**
   * The current state
   */
  currentState: TState;

  /**
   * The machine definition
   */
  machine: StateMachine<TState, TEvent>;

  /**
   * Machine context
   */
  context?: TContext;

  /**
   * Send an event to the machine
   */
  send(event: TEvent): TState;

  /**
   * Check if a transition is possible
   */
  canTransition(event: TEvent): boolean;

  /**
   * Get possible events from current state
   */
  getPossibleEvents(): TEvent[];

  /**
   * Reset to initial state
   */
  reset(): void;
}

/**
 * Hierarchical state for nested state machines
 */
export interface HierarchicalState<TState, TEvent> {
  /**
   * The state identifier
   */
  state: TState;

  /**
   * Optional parent state
   */
  parent?: TState;

  /**
   * Optional child states
   */
  children?: TState[];

  /**
   * Optional nested state machine
   */
  submachine?: StateMachine<TState, TEvent>;
}

/**
 * State transition result
 */
export type TransitionResult<TState, TError = string> =
  | { success: true; state: TState }
  | { success: false; error: TError };

/**
 * State history for tracking state changes
 */
export interface StateHistory<TState, TEvent> {
  /**
   * History of state transitions
   */
  transitions: Array<{
    from: TState;
    to: TState;
    event: TEvent;
    timestamp: number;
  }>;

  /**
   * Add a transition to history
   */
  addTransition(from: TState, to: TState, event: TEvent): void;

  /**
   * Get the last N transitions
   */
  getLastTransitions(count: number): Array<{
    from: TState;
    to: TState;
    event: TEvent;
    timestamp: number;
  }>;

  /**
   * Clear history
   */
  clear(): void;
}
