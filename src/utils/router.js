/**
 * Router — Client-Side Routing with History API
 *
 * Handles SPA navigation using the browser History API.
 * Supports View Transitions API for smooth animated transitions (Baseline 2026).
 */

export class Router {
  /**
   * @param {Object} options
   * @param {Map<string, Function>} options.routes - Path to render-function map
   * @param {string} options.defaultRoute - Default path (e.g. '/')
   * @param {HTMLElement} options.outlet - DOM element to render views into
   */
  constructor({ routes = new Map(), defaultRoute = '/', outlet = null }) {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this.outlet = outlet;
    this._currentPath = defaultRoute;
    this._beforeUnloadHandlers = new Set();
  }

  /** Current route path */
  get currentPath() {
    return this._currentPath;
  }

  /** Initialize router: listen to popstate, render initial route */
  init() {
    window.addEventListener('popstate', () => {
      this.render(location.pathname);
    });

    // Intercept anchor clicks for client-side navigation
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[data-nav]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

      event.preventDefault();
      this.navigate(href);
    });

    this.render(this.defaultRoute);
  }

  /**
   * Register a route
   * @param {string} path
   * @param {Function} render - Render function for this route
   */
  addRoute(path, render) {
    this.routes.set(path, render);
  }

  /**
   * Navigate to a path (pushes to history)
   * @param {string} path
   */
  navigate(path) {
    if (path === this._currentPath) return;

    const transitionWithAnimation = () => {
      history.pushState({}, '', path);
      this._currentPath = path;
      this._renderPath(path);
    };

    if (document.startViewTransition) {
      const transition = document.startViewTransition(transitionWithAnimation);
      transition.finished.catch(() => {});
    } else {
      transitionWithAnimation();
    }
  }

  /**
   * Replace current route without adding history entry
   * @param {string} path
   */
  replace(path) {
    if (path === this._currentPath) return;
    history.replaceState({}, '', path);
    this._currentPath = path;
    this._renderPath(path);
  }

  /** Render a specific path */
  render(path) {
    this._currentPath = path;
    this._renderPath(path);
  }

  _renderPath(path) {
    if (!this.outlet) {
      console.warn('[Router] No outlet element defined');
      return;
    }

    const renderFn = this.routes.get(path);
    if (!renderFn) {
      // Fallback to default route
      const defaultFn = this.routes.get(this.defaultRoute);
      if (defaultFn) {
        this.outlet.innerHTML = '';
        defaultFn(this.outlet);
      }
      return;
    }

    this.outlet.innerHTML = '';
    renderFn(this.outlet);
  }

  /**
   * Add a before-unload / before-navigate handler
   * @param {Function} handler - Returns true to allow navigation, false to block
   */
  beforeNavigate(handler) {
    this._beforeUnloadHandlers.add(handler);
    return () => this._beforeUnloadHandlers.delete(handler);
  }
}
