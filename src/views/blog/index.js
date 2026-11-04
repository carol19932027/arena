/**
 * View — Blog Management
 * Post list with search/filter, create/edit/delete, rich editor (mock), media upload (mock), AI assistant (mock).
 */

import { i18n } from '../../utils/i18n.js';
import { posts, categories } from '../../data/mockBlog.js';

/**
 * Render the Blog view into the outlet element
 * @param {HTMLElement} outlet - Container element
 */
export default function render(outlet) {
  const isFa = i18n.locale === 'fa';

  outlet.innerHTML = `
    <section class="blog">
      <div class="blog__header">
        <h1 class="dashboard__title">${i18n.t('blog_title', 'Blog Management')}</h1>
      </div>

      <!-- Toolbar: Search + Filter + Add -->
      <div class="blog__toolbar">
        <input
          type="text"
          id="blog-search"
          class="glass-search"
          placeholder="${i18n.t('blog_search_placeholder', 'Search posts...')}"
        >
        <div class="segmented-control" role="group" aria-label="${i18n.t('blog_status_label', 'Status')}">
          ${categories.map((cat) => `
            <button class="seg-btn${cat.id === 'all' ? ' active' : ''}" data-cat="${cat.id}">
              ${isFa ? cat.label : cat.labelEn}
            </button>
          `).join('')}
        </div>
        <button class="btn btn--primary" id="blog-add-post" data-sheet="editor">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ${i18n.t('blog_create_post', 'Create New Post')}
        </button>
      </div>

      <!-- Post List -->
      <div class="blog__post-list" id="blog-post-list">
        ${renderPostList(posts)}
      </div>

      <!-- Editor Sheet (Hidden by default) -->
      <div id="blog-editor-sheet" class="hidden">
        ${renderEditor()}
      </div>
    </section>
  `;

  _attachBlogListeners(outlet);
}

/**
 * Render post list HTML
 */
function renderPostList(postList) {
  const isFa = i18n.locale === 'fa';

  if (postList.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">📝</div>
        <h2 class="empty-state__title">${i18n.t('blog_no_posts', 'No posts found.')}</h2>
      </div>
    `;
  }

  return postList.map((post) => `
    <article class="blog-post-card" data-post-id="${post.id}">
      <header class="blog-post-card__header">
        <h3 class="blog-post-card__title">${post.title}</h3>
        <p class="blog-post-card__meta">
          <span>${post.author}</span>
          <span>•</span>
          <span>${post.status === 'published' ? (isFa ? 'منتشر شده' : 'Published') : (isFa ? 'پیش‌نویس' : 'Draft')}</span>
        </p>
      </header>
      <p class="blog-post-card__excerpt">${stripHtml(post.content)}</p>
      <footer class="blog-post-card__footer">
        <div>
          <span class="badge ${post.status === 'published' ? 'bg-success' : 'bg-tertiary'}">
            ${post.status === 'published' ? (isFa ? 'منتشر شده' : 'Published') : (isFa ? 'پیش‌نویس' : 'Draft')}
          </span>
        </div>
        <div class="post-actions">
          <button class="btn btn--ghost btn--sm" data-action="edit" data-post-id="${post.id}">
            ${i18n.t('edit', 'Edit')}
          </button>
          <button class="btn btn--ghost btn--sm btn--destructive" data-action="delete" data-post-id="${post.id}">
            ${i18n.t('delete', 'Delete')}
          </button>
        </div>
      </footer>
    </article>
  `).join('');
}

/**
 * Render rich editor sheet
 */
function renderEditor() {
  const isFa = i18n.locale === 'fa';
  return `
    <div class="editor-sheet">
      <div class="editor__header">
        <h2 class="editor__title">${i18n.t('blog_edit_post', 'Edit Post')}</h2>
        <button class="btn btn--ghost" id="editor-close">${i18n.t('close', 'Close')}</button>
      </div>

      <div class="editor__body">
        <div class="editor__toolbar">
          <button class="editor__btn" data-format="bold" title="${i18n.t('blog_editor_toolbar_bold', 'Bold')}"><b>B</b></button>
          <button class="editor__btn" data-format="italic" title="${i18n.t('blog_editor_toolbar_italic', 'Italic')}"><i>I</i></button>
          <button class="editor__btn" data-format="underline" title="${i18n.t('blog_editor_toolbar_underline', 'Underline')}"><u>U</u></button>
          <button class="editor__btn" data-format="heading" title="${i18n.t('blog_editor_toolbar_heading', 'Heading')}>H</button>
          <button class="editor__btn" data-format="ul" title="${i18n.t('blog_editor_toolbar_list_ul', 'Bullet List')}>⦿</button>
          <button class="editor__btn" data-format="ol" title="${i18n.t('blog_editor_toolbar_list_ol', 'Numbered List')}1.</button>
          <select class="editor__select" data-format="color">
            <option value="">${i18n.t('blog_editor_toolbar_color', 'Font Color')}</option>
            <option value="#007aff">Blue</option>
            <option value="#34c759">Green</option>
            <option value="#ff3b30">Red</option>
          </select>
          <select class="editor__select" data-format="size">
            <option value="16px">${i18n.t('blog_editor_toolbar_size', 'Font Size')}</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
          <button class="editor__btn" data-action="upload" title="${i18n.t('blog_editor_upload', 'Upload Media')}">📎</button>
          <button class="editor__btn" data-action="ai" title="${i18n.t('blog_editor_ai_assistant', 'Writing Assistant')}">✨</button>
        </div>

        <div class="editor__content">
          <input type="text" id="editor-title" class="editor__title-input" placeholder="${i18n.t('blog_title_label', 'Title')}">
          <div id="editor-content" class="editor__content-area" contenteditable="true" placeholder="${i18n.t('blog_content_label', 'Content')}"></div>
        </div>
      </div>

      <div class="editor__footer">
        <select class="editor__status-select">
          <option value="draft">${i18n.t('blog_status_draft', 'Draft')}</option>
          <option value="published">${i18n.t('blog_status_published', 'Published')}</option>
        </select>
        <button class="btn btn--primary" id="editor-save">${i18n.t('save', 'Save')}</button>
      </div>
    </div>
  `;
}

/**
 * Strip HTML tags for excerpt
 */
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

/**
 * Attach event listeners for blog interactions
 */
function _attachBlogListeners(outlet) {
  // Search
  const searchInput = outlet.querySelector('#blog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = posts.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term)
      );
      const list = outlet.querySelector('#blog-post-list');
      if (list) list.innerHTML = renderPostList(filtered);
    });
  }

  // Filter buttons
  outlet.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      outlet.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      const filtered = cat === 'all' ? posts : posts.filter((p) => p.category === cat);
      const list = outlet.querySelector('#blog-post-list');
      if (list) list.innerHTML = renderPostList(filtered);
    });
  });

  // Add post -> open editor sheet
  const addBtn = outlet.querySelector('#blog-add-post');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const sheet = document.getElementById('blog-editor-sheet');
      if (sheet) {
        sheet.classList.remove('hidden');
        sheet.classList.add('sheet-open');
      }
    });
  }

  // Edit / Delete actions
  outlet.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit"]');
    if (editBtn) {
      const postId = editBtn.getAttribute('data-post-id');
      const post = posts.find((p) => p.id === postId);
      if (post) _openEditor(post);
      return;
    }

    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
      const postId = deleteBtn.getAttribute('data-post-id');
      if (confirm(i18n.t('blog_delete_confirm', 'Are you sure you want to delete this post?'))) {
        _deletePost(postId, outlet);
      }
      return;
    }
  });

  // Editor close
  const editorClose = document.getElementById('editor-close');
  if (editorClose) {
    editorClose.addEventListener('click', () => {
      const sheet = document.getElementById('blog-editor-sheet');
      if (sheet) {
        sheet.classList.add('hidden');
        sheet.classList.remove('sheet-open');
      }
    });
  }

  // Editor save
  const editorSave = document.getElementById('editor-save');
  if (editorSave) {
    editorSave.addEventListener('click', () => {
      const titleInput = document.getElementById('editor-title');
      const contentArea = document.getElementById('editor-content');
      const statusSelect = document.querySelector('.editor__status-select');

      if (!titleInput || !contentArea) return;

      const newPost = {
        id: Date.now().toString(),
        title: titleInput.value || i18n.t('blog_title_label', 'Untitled'),
        content: contentArea.innerHTML,
        author: i18n.locale === 'fa' ? 'نویسنده' : 'Author',
        category: 'general',
        status: statusSelect ? statusSelect.value : 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      posts.unshift(newPost);
      const list = outlet.querySelector('#blog-post-list');
      if (list) list.innerHTML = renderPostList(posts);

      // Close sheet
      const sheet = document.getElementById('blog-editor-sheet');
      if (sheet) {
        sheet.classList.add('hidden');
        sheet.classList.remove('sheet-open');
      }

      // Toast
      _showToast(i18n.t('blog_saved', 'Post saved successfully.'));
    });
  }
}

/**
 * Open editor with existing post data
 */
function _openEditor(post) {
  const titleInput = document.getElementById('editor-title');
  const contentArea = document.getElementById('editor-content');
  const statusSelect = document.querySelector('.editor__status-select');

  if (titleInput) titleInput.value = post.title;
  if (contentArea) contentArea.innerHTML = post.content;
  if (statusSelect) statusSelect.value = post.status;

  const sheet = document.getElementById('blog-editor-sheet');
  if (sheet) {
    sheet.classList.remove('hidden');
    sheet.classList.add('sheet-open');
  }
}

/**
 * Delete a post
 */
function _deletePost(postId, outlet) {
  const index = posts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    const list = outlet.querySelector('#blog-post-list');
    if (list) list.innerHTML = renderPostList(posts);
    _showToast(i18n.t('blog_deleted', 'Post deleted successfully.'));
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
