/**
 * View — Dashboard
 * Default active view with stats cards, quick actions, and activity log.
 */

import { i18n } from '../../utils/i18n.js';
import { stats, quickActions, activityLogs } from '../../data/mockDashboard.js';

/**
 * Render the Dashboard view into the outlet element
 * @param {HTMLElement} outlet - Container element
 */
export default function render(outlet) {
  const isFa = i18n.locale === 'fa';

  outlet.innerHTML = `
    <section class="dashboard">
      <!-- Header -->
      <div class="dashboard__header">
        <h1 class="dashboard__title">${i18n.t('dashboard_title', 'Dashboard')}</h1>
        <p class="dashboard__subtitle">${i18n.t('dashboard_welcome', 'Welcome to the management panel')}</p>
      </div>

      <!-- Stats Cards -->
      <div class="dashboard__stats">
        ${stats.map((stat) => `
          <div class="stat-card">
            <div class="stat-card__icon" style="font-size: 28px;">${stat.icon}</div>
            <h2 class="stat-card__value">${stat.value}</h2>
            <p class="stat-card__label">${isFa ? stat.label : stat.labelEn}</p>
            <p class="stat-card__trend stat-card__trend--${stat.trend}">
              ${isFa ? stat.change : stat.changeEn}
            </p>
          </div>
        `).join('')}
      </div>

      <!-- Quick Actions -->
      <div class="dashboard__quick-actions">
        <h2 class="section-header__title">${i18n.t('dashboard_quick_actions', 'Quick Actions')}</h2>
        <div class="quick-action-grid">
          ${quickActions.map((action) => `
            <a href="${action.path}" class="quick-action" data-nav>
              <div class="quick-action__icon">${action.icon}</div>
              <span class="quick-action__label">${isFa ? action.label : action.labelEn}</span>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- Activity Logs -->
      <div class="dashboard__activity">
        <div class="section-header">
          <div>
            <h2 class="section-header__title">${i18n.t('dashboard_recent_activity', 'Recent Activity')}</h2>
          </div>
        </div>
        <ul class="list">
          ${activityLogs.map((log) => `
            <li class="list-item">
              <div class="list-item__avatar">${log.user.charAt(0)}</div>
              <div class="list-item__content">
                <div class="list-item__title">${log.user}</div>
                <div class="list-item__subtitle">
                  ${isFa ? log.action : log.actionEn}
                </div>
              </div>
              <span class="text-tertiary" style="font-size: var(--ios27-text-caption2);">
                ${isFa ? log.time : log.timeEn}
              </span>
            </li>
          `).join('')}
          ${activityLogs.length === 0 ? `
            <li class="list-item">
              <span class="text-tertiary">${i18n.t('dashboard_activity_no_items', 'No recent activity recorded.')}</span>
            </li>
          ` : ''}
        </ul>
      </div>
    </section>
  `;
}
