/**
 * View — Users & RBAC
 * User management (add/edit/delete) and role/permission management.
 * Delete role with associated users shows a native alert.
 */

import { i18n } from '../../utils/i18n.js';
import { users, roles } from '../../data/mockUsers.js';

/**
 * Render the Users view into the outlet element
 * @param {HTMLElement} outlet - Container element
 */
export default function render(outlet) {
  const isFa = i18n.locale === 'fa';

  outlet.innerHTML = `
    <section class="users">
      <div class="users__header">
        <h1 class="dashboard__title">${i18n.t('users_title', 'Users & RBAC')}</h1>
      </div>

      <!-- Toolbar -->
      <div class="users__toolbar">
        <input type="text" id="users-search" placeholder="${i18n.t('search', 'Search...')}">
        <button class="btn btn--primary" id="users-add-user" data-sheet="user-form">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ${i18n.t('users_add_user', 'Add User')}
        </button>
      </div>

      <!-- Users Table -->
      <div class="card">
        <table class="users__table">
          <thead>
            <tr>
              <th>${i18n.t('users_first_name', 'First Name')}</th>
              <th>${i18n.t('users_last_name', 'Last Name')}</th>
              <th>${i18n.t('users_username', 'Username')}</th>
              <th>${i18n.t('users_role', 'Role')}</th>
              <th>${i18n.t('users_status', 'Status')}</th>
              <th style="text-align: center;">${i18n.t('edit', 'Edit')}</th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            ${renderUserRows(users)}
          </tbody>
        </table>
      </div>

      <div class="users__empty" id="users-empty" style="display: none;">
        <div class="empty-state">
          <div class="empty-state__icon">👤</div>
          <h2 class="empty-state__title">${i18n.t('users_no_users', 'No users found.')}</h2>
        </div>
      </div>

      <!-- RBAC Section -->
      <div class="users__rbac">
        <h2 class="section-header__title">${i18n.t('users_rbac_title', 'Role & Permission Management')}</h2>
        <div class="users__role-list" id="users-role-list">
          ${renderRoleList(roles)}
        </div>
      </div>

      <!-- User Form Sheet (Hidden) -->
      <div id="users-user-form-sheet" class="hidden">
        ${renderUserForm()}
      </div>

      <!-- Role Delete Confirm Sheet (Hidden) -->
      <div id="users-role-delete-sheet" class="hidden">
        ${renderRoleDeleteConfirm()}
      </div>
    </section>
  `;

  _attachUsersListeners(outlet);
}

/**
 * Render user table rows
 */
function renderUserRows(userList) {
  const isFa = i18n.locale === 'fa';

  if (userList.length === 0) return '';

  return userList.map((user) => `
    <tr data-user-id="${user.id}">
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.username}</td>
      <td>
        <span class="badge bg-info">${getRoleLabel(user.role)}</span>
      </td>
      <td>
        <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-tertiary'}">
          ${user.status === 'active' ? (isFa ? 'فعال' : 'Active') : (isFa ? 'غیرفعال' : 'Inactive')}
        </span>
      </td>
      <td style="text-align: center;">
        <button class="btn btn--ghost btn--sm" data-action="edit-user" data-user-id="${user.id}">
          ${i18n.t('edit', 'Edit')}
        </button>
        <button class="btn btn--ghost btn--sm btn--destructive" data-action="delete-user" data-user-id="${user.id}">
          ${i18n.t('delete', 'Delete')}
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Render role list (RBAC)
 */
function renderRoleList(roleList) {
  const isFa = i18n.locale === 'fa';

  return roleList.map((role) => `
    <div class="users__role-card" data-role-id="${role.id}">
      <div class="users__role-header">
        <div>
          <h3 class="users__role-name">${isFa ? role.name : role.nameEn}</h3>
          <p class="users__role-desc">${isFa ? role.description : role.descriptionEn}</p>
        </div>
        <div class="users__role-user-count">
          <span class="badge bg-tertiary">${role.userCount} ${isFa ? 'کاربر' : 'users'}</span>
        </div>
      </div>
      <div class="users__role-permissions">
        ${role.permissions.map((p) => `<span class="badge bg-info" style="font-size: var(--ios27-text-caption2);">${p}</span>`).join('')}
      </div>
      <div class="users__role-actions">
        <button class="btn btn--ghost btn--sm" data-action="edit-role" data-role-id="${role.id}">
          ${i18n.t('edit', 'Edit')}
        </button>
        <button class="btn btn--ghost btn--sm btn--destructive" data-action="delete-role" data-role-id="${role.id}">
          ${i18n.t('delete', 'Delete')}
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Get role label by key
 */
function getRoleLabel(roleKey) {
  const role = roles.find((r) => r.id === roleKey);
  return role ? (i18n.locale === 'fa' ? role.name : role.nameEn) : roleKey;
}

/**
 * Render user form sheet
 */
function renderUserForm() {
  const isFa = i18n.locale === 'fa';
  return `
    <div class="editor-sheet">
      <div class="editor__header">
        <h2 class="editor__title" id="users-form-title">${i18n.t('users_add_user', 'Add User')}</h2>
        <button class="btn btn--ghost" id="users-form-close">${i18n.t('close', 'Close')}</button>
      </div>
      <div class="editor__body">
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('users_first_name', 'First Name')}</div>
            <input type="text" id="users-form-first-name" placeholder="${i18n.t('users_first_name', 'First Name')}">
          </div>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('users_last_name', 'Last Name')}</div>
            <input type="text" id="users-form-last-name" placeholder="${i18n.t('users_last_name', 'Last Name')}">
          </div>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('users_username', 'Username')}</div>
            <input type="text" id="users-form-username" placeholder="${i18n.t('users_username', 'Username')}">
          </div>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('users_role', 'Role')}</div>
            <select id="users-form-role">
              ${roles.map((r) => `<option value="${r.id}">${isFa ? r.name : r.nameEn}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('users_password', 'Password')}</div>
            <input type="password" id="users-form-password" placeholder="••••••••">
          </div>
        </div>
        <div class="settings__item">
          <div>
            <div class="settings__item-label">${i18n.t('users_status', 'Status')}</div>
            <select id="users-form-status">
              <option value="active">${i18n.t('users_status_active', 'Active')}</option>
              <option value="inactive">${i18n.t('users_status_inactive', 'Inactive')}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="editor__footer">
        <button class="btn btn--ghost" id="users-form-cancel">${i18n.t('cancel', 'Cancel')}</button>
        <button class="btn btn--primary" id="users-form-save">${i18n.t('save', 'Save')}</button>
      </div>
    </div>
  `;
}

/**
 * Render role delete confirm sheet
 */
function renderRoleDeleteConfirm() {
  const isFa = i18n.locale === 'fa';
  return `
    <div class="editor-sheet">
      <div class="editor__header">
        <h2 class="editor__title">${i18n.t('users_rbac_delete_confirm', 'Delete Role?')}</h2>
        <button class="btn btn--ghost" id="users-role-delete-cancel">${i18n.t('cancel', 'Cancel')}</button>
      </div>
      <div class="editor__body">
        <p id="users-role-delete-message">${i18n.t('users_rbac_delete_role_warning', 'This role is assigned to users.')}</p>
        <input type="hidden" id="users-role-delete-id">
      </div>
      <div class="editor__footer">
        <button class="btn btn--ghost" id="users-role-delete-cancel-btn">${i18n.t('cancel', 'Cancel')}</button>
        <button class="btn btn--destructive" id="users-role-delete-confirm">${i18n.t('delete', 'Delete')}</button>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners
 */
function _attachUsersListeners(outlet) {
  // Search
  const searchInput = outlet.querySelector('#users-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = users.filter((u) =>
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term)
      );
      const body = outlet.querySelector('#users-table-body');
      const empty = outlet.querySelector('#users-empty');
      if (body) body.innerHTML = renderUserRows(filtered);
      if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';
    });
  }

  // Add user
  const addBtn = outlet.querySelector('#users-add-user');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('users-form-title').textContent = i18n.t('users_add_user', 'Add User');
      document.getElementById('users-user-form-sheet').classList.remove('hidden');
      document.getElementById('users-user-form-sheet').classList.add('sheet-open');
    });
  }

  // Edit / Delete user
  outlet.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit-user"]');
    if (editBtn) {
      const userId = editBtn.getAttribute('data-user-id');
      const user = users.find((u) => u.id === userId);
      if (user) _openUserForm(user);
      return;
    }

    const deleteBtn = e.target.closest('[data-action="delete-user"]');
    if (deleteBtn) {
      const userId = deleteBtn.getAttribute('data-user-id');
      if (confirm(i18n.t('users_delete_confirm', 'Are you sure you want to delete this user?'))) {
        _deleteUser(userId, outlet);
      }
      return;
    }

    // Delete role
    const delRoleBtn = e.target.closest('[data-action="delete-role"]');
    if (delRoleBtn) {
      const roleId = delRoleBtn.getAttribute('data-role-id');
      _openRoleDeleteConfirm(roleId);
      return;
    }
  });

  // User form close
  const formClose = document.getElementById('users-form-close');
  if (formClose) {
    formClose.addEventListener('click', () => {
      document.getElementById('users-user-form-sheet').classList.add('hidden');
      document.getElementById('users-user-form-sheet').classList.remove('sheet-open');
    });
  }

  // User form cancel
  const formCancel = document.getElementById('users-form-cancel');
  if (formCancel) {
    formCancel.addEventListener('click', () => {
      document.getElementById('users-user-form-sheet').classList.add('hidden');
      document.getElementById('users-user-form-sheet').classList.remove('sheet-open');
    });
  }

  // User form save
  const formSave = document.getElementById('users-form-save');
  if (formSave) {
    formSave.addEventListener('click', () => {
      const firstName = document.getElementById('users-form-first-name').value;
      const lastName = document.getElementById('users-form-last-name').value;
      const username = document.getElementById('users-form-username').value;
      const role = document.getElementById('users-form-role').value;
      const password = document.getElementById('users-form-password').value;
      const status = document.getElementById('users-form-status').value;

      if (!firstName || !lastName || !username) {
        _showToast(i18n.t('toast_error', 'An error occurred.'));
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        username,
        role,
        status,
        email: `${username}@example.com`,
        avatar: (firstName.charAt(0) + lastName.charAt(0)).toUpperCase(),
      };

      users.push(newUser);
      const body = outlet.querySelector('#users-table-body');
      if (body) body.innerHTML = renderUserRows(users);

      // Update role user count
      const roleObj = roles.find((r) => r.id === role);
      if (roleObj) roleObj.userCount += 1;
      const roleList = document.getElementById('users-role-list');
      if (roleList) roleList.innerHTML = renderRoleList(roles);

      // Close sheet
      document.getElementById('users-user-form-sheet').classList.add('hidden');
      document.getElementById('users-user-form-sheet').classList.remove('sheet-open');

      // Clear form
      document.getElementById('users-form-first-name').value = '';
      document.getElementById('users-form-last-name').value = '';
      document.getElementById('users-form-username').value = '';
      document.getElementById('users-form-password').value = '';

      _showToast(i18n.t('users_saved', 'User saved successfully.'));
    });
  }

  // Role delete cancel
  const roleDeleteCancel = document.getElementById('users-role-delete-cancel');
  if (roleDeleteCancel) {
    roleDeleteCancel.addEventListener('click', () => {
      document.getElementById('users-role-delete-sheet').classList.add('hidden');
      document.getElementById('users-role-delete-sheet').classList.remove('sheet-open');
    });
  }

  const roleDeleteCancelBtn = document.getElementById('users-role-delete-cancel-btn');
  if (roleDeleteCancelBtn) {
    roleDeleteCancelBtn.addEventListener('click', () => {
      document.getElementById('users-role-delete-sheet').classList.add('hidden');
      document.getElementById('users-role-delete-sheet').classList.remove('sheet-open');
    });
  }

  // Role delete confirm
  const roleDeleteConfirm = document.getElementById('users-role-delete-confirm');
  if (roleDeleteConfirm) {
    roleDeleteConfirm.addEventListener('click', () => {
      const roleId = document.getElementById('users-role-delete-id').value;
      const role = roles.find((r) => r.id === roleId);

      if (!role) return;

      // Native alert if role has users
      if (role.userCount > 0) {
        alert(
          i18n.t('users_rbac_delete_role_warning', 'This role is assigned to users. Please reassign before deleting.') +
          '\n\n' +
          i18n.t('users_rbac_delete_confirm', 'Are you sure you want to delete this role?')
        );
      }

      if (confirm(i18n.t('users_rbac_delete_confirm', 'Are you sure you want to delete this role?'))) {
        const index = roles.findIndex((r) => r.id === roleId);
        if (index !== -1) {
          roles.splice(index, 1);
          const roleList = document.getElementById('users-role-list');
          if (roleList) roleList.innerHTML = renderRoleList(roles);
          _showToast(i18n.t('toast_deleted', 'Deleted successfully.'));
        }
      }

      document.getElementById('users-role-delete-sheet').classList.add('hidden');
      document.getElementById('users-role-delete-sheet').classList.remove('sheet-open');
    });
  }
}

/**
 * Open user form with existing user data
 */
function _openUserForm(user) {
  document.getElementById('users-form-title').textContent = i18n.t('users_edit_user', 'Edit User');
  document.getElementById('users-form-first-name').value = user.firstName;
  document.getElementById('users-form-last-name').value = user.lastName;
  document.getElementById('users-form-username').value = user.username;
  document.getElementById('users-form-role').value = user.role;
  document.getElementById('users-form-password').value = '';
  document.getElementById('users-form-status').value = user.status;

  const sheet = document.getElementById('users-user-form-sheet');
  sheet.classList.remove('hidden');
  sheet.classList.add('sheet-open');
}

/**
 * Delete user
 */
function _deleteUser(userId, outlet) {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return;

  const user = users[index];

  // Decrement role user count
  const roleObj = roles.find((r) => r.id === user.role);
  if (roleObj && roleObj.userCount > 0) {
    roleObj.userCount -= 1;
  }

  users.splice(index, 1);
  const body = outlet.querySelector('#users-table-body');
  const empty = outlet.querySelector('#users-empty');
  if (body) body.innerHTML = renderUserRows(users);
  if (empty) empty.style.display = users.length === 0 ? 'block' : 'none';

  // Update role list
  const roleList = document.getElementById('users-role-list');
  if (roleList) roleList.innerHTML = renderRoleList(roles);

  _showToast(i18n.t('users_deleted', 'User deleted successfully.'));
}

/**
 * Open role delete confirm sheet
 */
function _openRoleDeleteConfirm(roleId) {
  const role = roles.find((r) => r.id === roleId);
  if (!role) return;

  document.getElementById('users-role-delete-id').value = roleId;
  document.getElementById('users-role-delete-message').textContent =
    role.userCount > 0
      ? i18n.t('users_rbac_delete_role_warning', 'This role is assigned to users. Please reassign before deleting.')
      : i18n.t('users_rbac_delete_confirm', 'Are you sure you want to delete this role?');

  const sheet = document.getElementById('users-role-delete-sheet');
  sheet.classList.remove('hidden');
  sheet.classList.add('sheet-open');
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
