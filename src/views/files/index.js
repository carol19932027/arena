/**
 * View — File Explorer (S3 Buckets)
 * Rich file explorer for browsing S3 buckets and files.
 * Mock data only — no real S3 API calls.
 */

import { i18n } from '../../utils/i18n.js';
import { buckets, files } from '../../data/mockFiles.js';

let currentBucketId = null;

/**
 * Render the Files view into the outlet element
 * @param {HTMLElement} outlet - Container element
 */
export default function render(outlet) {
  const isFa = i18n.locale === 'fa';

  outlet.innerHTML = `
    <section class="files">
      <div class="files__header">
        <h1 class="dashboard__title" id="files-title">${i18n.t('files_title', 'File Management')}</h1>
      </div>

      <!-- Toolbar -->
      <div class="files__toolbar">
        <input type="text" id="files-search" placeholder="${i18n.t('search', 'Search...')}">
        <button class="btn btn--primary" id="files-add-bucket" data-action="add-bucket">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ${i18n.t('files_add_bucket', 'Add Bucket')}
        </button>
      </div>

      <!-- Bucket List -->
      <div class="files__bucket-list" id="files-bucket-list">
        ${renderBucketList(buckets)}
      </div>

      <!-- File List (shown when bucket selected) -->
      <div id="files-file-view" class="hidden">
        <div class="files__file-header">
          <button class="btn btn--ghost btn--sm" id="files-back-to-buckets">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            ${i18n.t('back', 'Back')}
          </button>
          <h2 class="files__bucket-title" id="files-bucket-title"></h2>
        </div>
        <div class="files__file-list" id="files-file-list"></div>
      </div>

      <!-- Empty state for no buckets -->
      <div id="files-no-buckets" class="hidden">
        <div class="empty-state">
          <div class="empty-state__icon">📁</div>
          <h2 class="empty-state__title">${i18n.t('files_no_buckets', 'No buckets connected.')}</h2>
        </div>
      </div>
    </section>
  `;

  _attachFilesListeners(outlet);
}

/**
 * Render bucket cards
 */
function renderBucketList(bucketList) {
  const isFa = i18n.locale === 'fa';

  if (bucketList.length === 0) return '';

  return bucketList.map((bucket) => `
    <div class="files__bucket-card" data-bucket-id="${bucket.id}">
      <div class="files__bucket-icon">${getBucketIcon(bucket.type)}</div>
      <h3 class="files__bucket-name">${isFa ? bucket.displayName : bucket.displayNameEn}</h3>
      <p class="files__bucket-count">
        ${bucket.fileCount} ${isFa ? 'فایل' : 'files'} • ${bucket.size}
      </p>
      <span class="badge ${bucket.status === 'connected' ? 'bg-success' : 'bg-tertiary'}" style="font-size: var(--ios27-text-caption2);">
        ${bucket.status === 'connected' ? (isFa ? 'متصل' : 'Connected') : (isFa ? 'قطع شده' : 'Disconnected')}
      </span>
    </div>
  `).join('');
}

/**
 * Get bucket type icon (mock — all are generic storage)
 */
function getBucketIcon() {
  return '☁️';
}

/**
 * Attach event listeners
 */
function _attachFilesListeners(outlet) {
  // Search
  const searchInput = outlet.querySelector('#files-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Filter buckets (mock)
    });
  }

  // Add bucket
  const addBucketBtn = outlet.querySelector('#files-add-bucket');
  if (addBucketBtn) {
    addBucketBtn.addEventListener('click', () => {
      const name = prompt(i18n.t('files_add_bucket', 'Enter bucket name:'));
      if (name) {
        const newBucket = {
          id: Date.now().toString(),
          name,
          displayName: name,
          displayNameEn: name,
          fileCount: 0,
          size: '0 B',
          status: 'connected',
          region: 'us-east-1',
        };
        buckets.push(newBucket);
        const list = outlet.querySelector('#files-bucket-list');
        if (list) list.innerHTML = renderBucketList(buckets);
        const noBuckets = document.getElementById('files-no-buckets');
        if (noBuckets) noBuckets.classList.add('hidden');
        _showToast(i18n.t('toast_saved', 'Saved successfully.'));
      }
    });
  }

  // Bucket click -> show files
  outlet.addEventListener('click', (e) => {
    const bucketCard = e.target.closest('.files__bucket-card');
    if (bucketCard) {
      const bucketId = bucketCard.getAttribute('data-bucket-id');
      _showBucketFiles(bucketId, outlet);
      return;
    }

    // Back to buckets
    const backBtn = e.target.closest('#files-back-to-buckets');
    if (backBtn) {
      _showBucketList(outlet);
      return;
    }

    // File actions
    const deleteFileBtn = e.target.closest('[data-action="delete-file"]');
    if (deleteFileBtn) {
      const fileId = deleteFileBtn.getAttribute('data-file-id');
      const bucketId = deleteFileBtn.getAttribute('data-bucket-id');
      if (confirm(i18n.t('files_delete_file', 'Delete this file?'))) {
        _deleteFile(bucketId, fileId, outlet);
      }
      return;
    }
  });

  // Initial state: if no buckets, show empty
  if (buckets.length === 0) {
    document.getElementById('files-no-buckets').classList.remove('hidden');
  }
}

/**
 * Show files for a bucket
 */
function _showBucketFiles(bucketId, outlet) {
  const bucket = buckets.find((b) => b.id === bucketId);
  if (!bucket) return;

  currentBucketId = bucketId;

  const isFa = i18n.locale === 'fa';

  // Update header
  const title = document.getElementById('files-title');
  const bucketTitle = document.getElementById('files-bucket-title');
  if (title) title.textContent = isFa ? bucket.displayName : bucket.displayNameEn;
  if (bucketTitle) bucketTitle.textContent = isFa ? bucket.displayName : bucket.displayNameEn;

  // Hide bucket list, show file view
  document.getElementById('files-bucket-list').classList.add('hidden');
  const fileView = document.getElementById('files-file-view');
  if (fileView) fileView.classList.remove('hidden');

  // Render files
  const fileList = document.getElementById('files-file-list');
  const bucketFiles = files[bucketId] || [];
  if (fileList) {
    if (bucketFiles.length === 0) {
      fileList.innerHTML = `
        <div class="empty-state" style="padding: var(--ios27-space-xl) var(--ios27-space-lg);">
          <div class="empty-state__icon">📭</div>
          <h2 class="empty-state__title">${i18n.t('files_bucket_empty', 'This bucket is empty.')}</h2>
        </div>
      `;
    } else {
      fileList.innerHTML = bucketFiles.map((file) => `
        <div class="files__file-row" data-file-id="${file.id}">
          <div class="files__file-icon">${file.icon}</div>
          <div class="files__file-info">
            <div class="files__file-name">${file.name}</div>
            <div class="files__file-meta">${file.type} • ${file.size} • ${file.modified}</div>
          </div>
          <div class="files__file-actions">
            <button class="btn btn--ghost btn--sm" data-action="preview-file" data-file-id="${file.id}" title="${i18n.t('files_preview', 'Preview')}">👁️</button>
            <button class="btn btn--ghost btn--sm" data-action="download-file" data-file-id="${file.id}" title="${i18n.t('files_download', 'Download')}">⬇️</button>
            <button class="btn btn--ghost btn--sm btn--destructive" data-action="delete-file" data-file-id="${file.id}" data-bucket-id="${bucketId}" title="${i18n.t('files_delete_file', 'Delete')}">🗑️</button>
          </div>
        </div>
      `).join('');
    }
  }
}

/**
 * Show bucket list
 */
function _showBucketList(outlet) {
  currentBucketId = null;
  const title = document.getElementById('files-title');
  if (title) title.textContent = i18n.t('files_title', 'File Management');
  document.getElementById('files-bucket-list').classList.remove('hidden');
  document.getElementById('files-file-view').classList.add('hidden');
}

/**
 * Delete file
 */
function _deleteFile(bucketId, fileId, outlet) {
  const bucketFiles = files[bucketId];
  if (!bucketFiles) return;

  const index = bucketFiles.findIndex((f) => f.id === fileId);
  if (index !== -1) {
    bucketFiles.splice(index, 1);

    // Update bucket count
    const bucket = buckets.find((b) => b.id === bucketId);
    if (bucket) {
      bucket.fileCount = Math.max(0, bucket.fileCount - 1);
    }

    // Re-render file view
    _showBucketFiles(bucketId, outlet);
    _showToast(i18n.t('toast_deleted', 'Deleted successfully.'));
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
