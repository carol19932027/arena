/**
 * View — Settings
 * Theme (Dark/Light/Auto), glass settings, user profile, app settings.
 */

import { i18n } from '../../utils/i18n.js';

/**
 * Render the Settings view into the outlet element
 * @param {HTMLElement} outlet - Container element
 */
export default function render(outlet) {
  const isFa = i18n.locale === 'fa';

  outlet.innerHTML = `
    <section class="settings">
      <div class="settings__header">
        <h1 class="dashboard__title">${i18n.t('settings_title', 'Settings')}</h1>
      </div>

      <!-- Profile -->
      <div class="settings__group">
        <div class="settings__group-header">
          <h2 class="settings__group-title">${i18n.t('settings_profile', 'Profile')}</h2>
          <p class="settings__group-desc">${i18n.t('settings_profile_name', 'Full Name')} • ${i18n.t('settings_profile_email', 'Email')}</p>
        </div>
        <div class="settings__item">
          <div class="settings__item-label">${i18n.t('settings_profile_name', 'Full Name')}</div>
          <div class="settings__item-control">
            <div class="avatar avatar--xl">AH</div>
            <div>
              <div style="font-weight: var(--ios27-font-weight-semibold);">علی حسینی</div>
              <div style="font-size: var(--ios27-text-caption1); color: var(--ios27-text-tertiary);">ali@example.com</div>
            </div>
          </div>
        </div>
        <div class="settings__item">
          <div class="settings__item-label">${i18n.t('settings_profile_email', 'Email')}</div>
          <div class="settings__item-control">
            <input type="email" value="ali@example.com" disabled style="background: transparent; border: none; color: inherit; font: inherit; width: 200px;">
          </div>
        </div>
        <div class="settings__item">
          <div class="settings__item-label">${i18n.t('settings_profile_avatar', 'Profile Picture')}</div>
          <div class="settings__item-control">
            <button class="btn btn--ghost btn--sm">${i18n.t('edit', 'Edit')}</button>
          </div>
        </div>
      </div>

      <!-- Theme -->
      <div class="settings__group">
        <div class="settings__group-header">
          <h2 class="settings__group-title">${i18n.t('settings_theme', 'Appearance')}</h2>
          <p class="settings__group-desc">${i18n.t('settings_theme_label', 'Theme')}</p>
        </div>
        <div class="settings__item">
          <div class="settings__item-label">${i18n.t('settings_theme', 'Theme')}</div>
          <div class="settings__item-control">
            <div class="segmented-control">
              <button class="seg-btn active" data-theme="light">${i18n.t('settings_theme_light', 'Light')}</button>
              <button class="seg-btn" data-theme="dark">${i18n.t('settings_theme_dark', 'Dark')}</button>
              <button class="seg-btn" data-theme="auto">${i18n.t('settings_theme_auto', 'Auto')}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Glass Settings -->
      <div class="settings__group">
        <div class="settings__group-header">
          <h2 class="settings__group-title">${i18n.t('settings_glass', 'Glass Settings')}</h2>
          <p class="settings__group-desc">تخصیص ظاهر شیشه‌ای برنامه</p>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('settings_glass_blur', 'Glass Blur')}</div>
            <div class="settings__item-desc">میزان blur سطوح شیشه‌ای</div>
          </div>
          <div class="settings__item-control">
            <input type="range" id="settings-glass-blur" min="0" max="40" value="20" style="width: 140px;">
          </div>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('settings_glass_tint', 'Glass Tint')}</div>
            <div class="settings__item-desc">رنگ تಿರ شیشه‌ای</div>
          </div>
          <div class="settings__item-control">
            <input type="color" id="settings-glass-tint" value="#007aff">
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="settings__group">
        <div class="settings__group-header">
          <h2 class="settings__group-title">${i18n.t('settings_about', 'About')}</h2>
        </div>
        <div class="settings__item">
          <div class="settings__item-label">${i18n.t('settings_version', 'Version')}</div>
          <div class="settings__item-control">
            <span class="text-tertiary">1.0.0</span>
          </div>
        </div>
        <div class="settings__item">
          <div class="settings__item-label">${i18n.t('settings_language', 'Language')}</div>
          <div class="settings__item-control">
            <select id="settings-language">
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  `;

  _attachSettingsListeners(outlet);
}

/**
 * Attach event listeners
 */
function _attachSettingsListeners(outlet) {
  // Theme selection
  outlet.querySelectorAll('.seg-btn[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      _setTheme(theme);

      // Update active state
      outlet.querySelectorAll('.seg-btn[data-theme]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Glass blur
  const blurInput = outlet.querySelector('#settings-glass-blur');
  if (blurInput) {
    blurInput.addEventListener('input', (e) => {
      document.documentElement.style.setProperty('--ios27-glass-blur', `${e.target.value}px`);
    });
  }

  // Glass tint
  const tintInput = outlet.querySelector('#settings-glass-tint');
  if (tintInput) {
    tintInput.addEventListener('input', (e) => {
      document.documentElement.style.setProperty('--ios27-glass-tint-light', `rgba(255,255,255,0.78)`);
      // tint applied via CSS variable if needed
    });
  }

  // Language
  const langSelect = outlet.querySelector('#settings-language');
  if (langSelect) {
    langSelect.value = i18n.locale;
    langSelect.addEventListener('change', (e) => {
      i18n.setLocale(e.target.value);
      // Re-render would be needed for full language switch; here we just update direction
    });
  }
}

/**
 * Set theme (light/dark/auto)
 */
function _setTheme(theme) {
  document.documentElement.removeAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'auto') {
    // Handled by CSS prefers-color-scheme
  } else {
    // light is default, no attribute needed
  }
}

/**
 * Show toast notification
 */
function _showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--show');
  setTimeout(() => toast.classList.remove('toast--show'), 3000);
}
