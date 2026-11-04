/**
 * main.js — Application Entry Point
 *
 * Bootstraps the iOS 27 Liquid Glass PWA:
 * 1. Registers glassy-liquid Web Components
 * 2. Initializes i18n, store, router
 * 3. Mounts the app shell
 * 4. Registers service worker
 */

import { i18n } from './utils/i18n.js';
import { App } from './app.js';

/**
 * Create the init-status element synchronously so it exists before init() runs
 */
function createStatusIndicator() {
  const el = document.createElement('div');
  el.id = 'init-status';
  el.style.cssText =
    'position:fixed;bottom:8px;right:8px;font-size:11px;color:#8e8e93;background:rgba(0,0,0,0.1);padding:4px 8px;border-radius:4px;z-index:999999;';
  el.textContent = 'Initializing...';
  document.body.appendChild(el);
  return el;
}

// Create status indicator immediately (synchronous)
const statusEl = createStatusIndicator();

/**
 * Page-level diagnostic overlay
 */
function createDiagnostic() {
  const d = document.createElement('div');
  d.id = 'diag-overlay';
  d.style.cssText =
    'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);color:#fff;font-family:monospace;font-size:11px;padding:10px;overflow:auto;z-index:999999;pointer-events:none;';
  d.innerHTML = '<div>Diagnostics started...</div>';
  document.body.appendChild(d);
  return d;
}

const diag = createDiagnostic();

function diagLog(msg) {
  const line = document.createElement('div');
  line.textContent = '> ' + msg;
  diag.appendChild(line);
  diag.scrollTop = diag.scrollHeight;
  console.log('[DIAG]', msg);
}

/**
 * Initialize the application
 */
async function init() {
  diagLog('init() started');
  try {
    // 1. Load glassy-liquid Web Components (local)
    diagLog('Step 1: Importing glassy-liquid...');
    statusEl.textContent = 'Loading glassy-liquid...';
    await import('/public/glassy-liquid/elements.js');
    diagLog('glassy-liquid elements registered');
    console.log('[main] glassy-liquid elements registered');

    // 2. Initialize i18n (default: Persian / RTL)
    diagLog('Step 2: Initializing i18n...');
    statusEl.textContent = 'Initializing i18n...';
    i18n.setLocale('fa');
    diagLog('i18n initialized: ' + i18n.locale + ' (' + i18n.direction + ')');
    console.log(`[main] i18n initialized: ${i18n.locale} (${i18n.direction})`);

    // 3. Mount the app shell
    diagLog('Step 3: Mounting app shell...');
    statusEl.textContent = 'Mounting app shell...';
    const app = new App();
    await app.mount();
    diagLog('App mounted successfully');
    console.log('[main] App mounted');
    statusEl.textContent = 'Ready';
    statusEl.style.background = 'rgba(52, 199, 89, 0.2)';
    statusEl.style.color = '#34c759';

    // 4. Register service worker (PWA)
    diagLog('Step 4: Registering service worker...');
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/public/sw.js', {
        scope: '/',
      });
      diagLog('Service Worker registered: ' + registration.scope);
      console.log('[main] Service Worker registered:', registration.scope);
    } else {
      diagLog('Service Worker not supported');
    }

    diagLog('Initialization complete!');
  } catch (err) {
    diagLog('FATAL ERROR: ' + String(err));
    console.error('[main] Initialization failed:', err);
    statusEl.textContent = 'Error: ' + String(err.message || err);
    statusEl.style.background = 'rgba(255, 59, 48, 0.2)';
    statusEl.style.color = '#ff3b30';
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = `
        <div style="padding: 24px; text-align: center; font-family: system-ui, sans-serif;">
          <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
          <div style="font-size: 16px; font-weight: 600; color: #ff3b30; margin-bottom: 8px;">Initialization Failed</div>
          <div style="font-size: 13px; color: #666; font-family: monospace; text-align: left; max-width: 600px; margin: 0 auto;">
            ${String(err).replace(/</g, '&lt;')}
          </div>
        </div>
      `;
    }
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('error', (event) => {
  console.error('[main] Uncaught error:', event.error);
  diagLog('ERROR: ' + (event.error?.message || event.message));
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 24px; text-align: center; font-family: system-ui, sans-serif;">
        <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
        <div style="font-size: 16px; font-weight: 600; color: #ff3b30; margin-bottom: 8px;">JS Error</div>
        <div style="font-size: 13px; color: #666; font-family: monospace; text-align: left; max-width: 600px; margin: 0 auto;">
          ${(event.error?.message || event.message).replace(/</g, '&lt;')}
        </div>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[main] Unhandled promise rejection:', event.reason);
  diagLog('REJECTION: ' + String(event.reason));
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 24px; text-align: center; font-family: system-ui, sans-serif;">
        <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
        <div style="font-size: 16px; font-weight: 600; color: #ff3b30; margin-bottom: 8px;">Promise Error</div>
        <div style="font-size: 13px; color: #666; font-family: monospace; text-align: left; max-width: 600px; margin: 0 auto;">
          ${String(event.reason).replace(/</g, '&lt;')}
        </div>
      </div>
    `;
  }
});
