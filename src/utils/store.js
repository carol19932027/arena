/**
 * Store — Simple Reactive State Management
 *
 * A lightweight pub/sub store for local application state.
 * No external dependencies, no backend, purely client-side.
 */

export class Store {
  /**
   * @param {Object} initialState - Initial state object
   */
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._subscribers = new Set();
  }

  /** Get current state (read-only copy) */
  get state() {
    return { ...this._state };
  }

  /**
   * Update state with partial object and notify subscribers
   * @param {Object} partial - Partial state to merge
   */
  set(partial) {
    this._state = { ...this._state, ...partial };
    this._notify();
  }

  /**
   * Subscribe to state changes
   * @param {Function} callback - Called with new state on every change
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this._subscribers.add(callback);
    // Immediately call with current state
    callback(this._state);
    return () => this._subscribers.delete(callback);
  }

  /** Notify all subscribers */
  _notify() {
    const state = this.state;
    this._subscribers.forEach((cb) => cb(state));
  }
}
