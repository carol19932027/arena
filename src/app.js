/**
 * App — Application Shell & Navigation
 *
 * Manages the top navigation bar, bottom tab bar, view switching,
 * and the overall shell layout of the iOS 27 Liquid Glass PWA.
 */

import { i18n } from './utils/i18n.js';
import { Router } from './utils/router.js';

/**
 * Navigation item definition
 * @typedef {Object} NavItem
 * @property {string} path - Route path
 * @property {string} labelKey - i18n key for label
 * @property {string} icon - SVG icon path data
 * @property {Function} render - View render function (lazy-loaded)
 */

export class App {
  constructor() {
    this._router = null;
    this._outlet = null;
    this._navbar = null;
    this._tabBar = null;
    this._currentView = null;
  }

/**
 * Mount the app shell into the DOM
 * @returns {Promise<void>}
 */
  async mount() {
    const d = document.getElementById('diag-overlay');
    if (d) { const line = document.createElement('div'); line.textContent = '> app.mount() started'; d.appendChild(line); d.scrollTop = d.scrollHeight; }
    this._createShell();
    if (d) { const line = document.createElement('div'); line.textContent = '> shell created'; d.appendChild(line); d.scrollTop = d.scrollHeight; }
    await this._setupRouter();
    if (d) { const line = document.createElement('div'); line.textContent = '> router setup done'; d.appendChild(line); d.scrollTop = d.scrollHeight; }
    this._setupI18nListener();
    this._renderNavbar();
    this._renderTabBar();
    this._navigateTo(this._router.defaultRoute);
    if (d) { const line = document.createElement('div'); line.textContent = '> initial navigation done'; d.appendChild(line); d.scrollTop = d.scrollHeight; }
  }

  /** Create shell DOM structure */
  _createShell() {
    const shell = document.createElement('div');
    shell.id = 'app';
    shell.innerHTML = `
      <header class="navbar" id="navbar">
        <button class="navbar__back" id="navbar-back" aria-label="بازگشت" hidden>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="navbar__title" id="navbar-title"></h1>
        <div class="navbar__actions" id="navbar-actions"></div>
      </header>

      <main id="app-main" class="app__main">
        <div id="view-outlet"></div>
      </main>

      <nav class="tab-bar" id="tab-bar"></nav>
    `;

    document.body.innerHTML = '';
    document.body.appendChild(shell);

    this._outlet = document.getElementById('view-outlet');
    this._navbar = document.getElementById('navbar');
    this._tabBar = document.getElementById('tab-bar');
  }

  /** Initialize router with lazy-loaded view routes */
  async _setupRouter() {
    this._router = new Router({
      routes: new Map(),
      defaultRoute: '/',
      outlet: this._outlet,
    });

    // Register routes with lazy imports (await to ensure routes exist before init)
    await this._registerRoutes();
    this._router.init();
  }

  /** Lazy-load view modules and register routes */
  async _registerRoutes() {
    const routeDefs = [
      { path: '/', labelKey: 'nav_dashboard', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', view: () => import('./views/dashboard/index.js') },
      { path: '/blog', labelKey: 'nav_blog', icon: 'M16 1H2v14h2V8h12v6h2V1z', view: () => import('./views/blog/index.js') },
      { path: '/users', labelKey: 'nav_users', icon: 'M12 4.5c1.5 0 3 .42 4.23 1.15C17.56 6.2 19 8.13 19 10.5c0 2.37-1.43 4.41-3.43 5.39.42.1.86.23 1.32.39.14.05.29.09.44.13 1.42.36 2.36 1.01 2.89 1.83.49.75.73 1.62.73 2.57V20c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1v-3.21c0-.95.24-1.82.73-2.57.53-.82 1.47-1.47 2.89-1.83.15-.04.3-.08.44-.13.46-.16.9-.29 1.32-.39C13.43 14.91 12 12.87 12 10.5c0-2.37 1.43-4.41 3.43-5.39C8.57 4.92 10.5 4.5 12 4.5zM3 7.5c0-.83.67-1.5 1.5-1.5S6 6.67 6 7.5 5.33 9 4.5 9 3 8.33 3 7.5zm4.5 0c0-.83.67-1.5 1.5-1.5S9 6.67 9 7.5 8.33 9 7.5 9 6 8.33 6 7.5zm4.5 0c0-.83.67-1.5 1.5-1.5S12 6.67 12 7.5 11.33 9 10.5 9 9 8.33 9 7.5zM21 2v2c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V2zm0 26H3c-.55 0-1-.45-1-1V16c0-.55.45-1 1-1h18c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1z', view: () => import('./views/users/index.js') },
      { path: '/files', labelKey: 'nav_files', icon: 'M22 19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14l4 4-.001.001.001.001L22 19z', view: () => import('./views/files/index.js') },
      { path: '/settings', labelKey: 'nav_settings', icon: 'M19.43 12.98c.04-.32.07-.64.07-.98 0-2.5-1.9-4.6-4.43-4.93-.26-.1-.58-.17-.9-.19s-.63-.02-.92.11c-.18.07-.34.2-.46.38-.55.84-.88 1.79-.88 2.85 0 .39.03.77.07 1.13-.04-.02-.07-.05-.11-.08-.81-.65-1.79-1.1-2.85-1.1-1.86 0-3.62.76-4.86 2.04-.57.59-1.02 1.26-1.33 1.99-.27.62-.44 1.32-.44 2.05 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92 0-.17-.01-.34-.03-.52.01-.01.01-.02.02-.03.17-.24.31-.51.41-.79.89-2.6 3.4-4.38 6.32-4.44 1.04-.03 2.06-.18 3.04-.45.96-.26 1.88-.67 2.74-1.27.89-.62 1.7-1.39 2.39-2.31.24-.32.5-.66.77-1.01.1-.12.22-.23.34-.35.78-.78 1.58-1.47 2.34-2.06.13-.1.26-.21.38-.33.26-.26.54-.49.82-.68l.01-.01c.19-.15.38-.28.57-.4.24-.16.48-.31.72-.44.33-.18.66-.33 1-.45.36-.13.72-.23 1.08-.29.27-.04.54-.07.8-.09.31-.03.62-.04.93-.04.65 0 1.3.04 1.94.11.7.08 1.4.17 2.08.3.44.08.87.2 1.28.36.11.04.22.07.33.11q.6.24 1.17.56c.07.04.14.09.2.14.43.37.82.78 1.17 1.23.07.09.13.19.19.29.32.52.57 1.09.71 1.67.03.13.05.26.07.39.06.34.1.69.1 1.04 0 1.02-.83 1.85-1.85 1.85M16.5 15.02c-.25 0-.47-.13-.6-.34-.22-.35-.34-.8-.34-1.29 0-.49.12-.94.34-1.29.14-.21.35-.34.6-.34s.46.13.6.34c.22.35.34.8.34 1.29 0 .49-.12.94-.34 1.29-.14.21-.35.34-.6.34', view: () => import('./views/settings/index.js') },
      { path: '/agents', labelKey: 'nav_agents', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5z', view: () => import('./views/agents/index.js') },
    ];

    for (const def of routeDefs) {
      try {
        const module = await def.view();
        const renderFn = module.default || module.render;
        this._router.addRoute(def.path, renderFn);

        // Render tab bar item
        this._addTabItem(def.path, def.labelKey, def.icon);
      } catch (err) {
        console.error(`[App] Failed to load route ${def.path}:`, err);
      }
    }
  }

  /** Add a tab bar item */
  _addTabItem(path, labelKey, icon) {
    const label = i18n.t(labelKey, labelKey);
    const tab = document.createElement('a');
    tab.className = 'tab-bar__tab';
    tab.href = path;
    tab.setAttribute('data-nav', 'true');
    tab.setAttribute('aria-label', label);
    tab.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="${icon}" /></svg>
      <span>${label}</span>
    `;

    if (path === this._router.defaultRoute) {
      tab.classList.add('active');
    }

    this._tabBar.appendChild(tab);
  }

  /** Render the top navigation bar */
  _renderNavbar() {
    const title = document.getElementById('navbar-title');
    const backBtn = document.getElementById('navbar-back');
    const actions = document.getElementById('navbar-actions');

    // Update title when route changes
    this._router.beforeNavigate(() => {
      const path = this._router.currentPath;
      const def = this._getRouteDef(path);
      if (def) {
        title.textContent = i18n.t(def.labelKey, def.labelKey);
      }
      // Hide back button on root
      backBtn.hidden = path === '/';
      return true;
    });

    // Back button handler
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  /** Render tab bar (called after routes registered) */
  _renderTabBar() {
    // Tab items are added during route registration
  }

  /** Navigate to a path */
  _navigateTo(path) {
    this._router.navigate(path);
  }

  /** Get route definition by path (for label lookup) */
  _getRouteDef(path) {
    // Simple lookup; could be cached
    const pathMap = {
      '/': { labelKey: 'nav_dashboard' },
      '/blog': { labelKey: 'nav_blog' },
      '/users': { labelKey: 'nav_users' },
      '/files': { labelKey: 'nav_files' },
      '/settings': { labelKey: 'nav_settings' },
      '/agents': { labelKey: 'nav_agents' },
    };
    return pathMap[path] || null;
  }

  /** Set up i18n direction change listener */
  _setupI18nListener() {
    i18n.onChange(() => {
      // Re-render tab labels when language changes
      const tabs = this._tabBar.querySelectorAll('.tab-bar__tab');
      tabs.forEach((tab) => {
        const path = tab.getAttribute('href');
        const def = this._getRouteDef(path);
        if (def) {
          const span = tab.querySelector('span');
          if (span) span.textContent = i18n.t(def.labelKey, def.labelKey);
          tab.setAttribute('aria-label', i18n.t(def.labelKey, def.labelKey));
        }
      });

      // Update navbar title
      const title = document.getElementById('navbar-title');
      const currentDef = this._getRouteDef(this._router.currentPath);
      if (currentDef && title) {
        title.textContent = i18n.t(currentDef.labelKey, currentDef.labelKey);
      }
    });
  }
}
