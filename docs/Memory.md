# Project Memory — Arena iOS 27 Liquid Glass PWA

**Branch:** `arena/4af6464d-arena`  
**Status:** Initial setup complete, server running  
**Last Updated:** 2026-10-31

---

## 1. Project State

- [x] Project structure created
- [x] docs/Design.md — design system tokens
- [x] docs/Agent.md — agent instructions & coding standards
- [x] docs/Skills.md — skills & patterns
- [x] docs/Memory.md — this file
- [x] Shell + navigation + router (src/app.js, src/utils/router.js)
- [x] PWA manifest (public/manifest.webmanifest)
- [x] Service Worker (public/sw.js) — cache-first shell, network-first content
- [x] Dashboard view (src/views/dashboard/index.js)
- [x] Blog view (src/views/blog/index.js) — with rich editor, search, filter, create/edit/delete
- [x] Users & RBAC view (src/views/users/index.js) — with role delete native alert
- [x] File Explorer view (src/views/files/index.js) — S3 buckets, file list, upload/delete
- [x] Settings view (src/views/settings/index.js) — theme, glass settings, profile
- [x] Agents view (src/views/agents/index.js) — iMessage-style chat
- [x] Mock data (src/data/*.js) — all client-side, no backend
- [x] i18n (src/utils/i18n.js) — Persian + English, RTL/LTR
- [x] Store (src/utils/store.js) — reactive pub/sub state
- [x] Design tokens (src/styles/tokens.css)
- [x] Layout styles (src/styles/layout.css)
- [x] View styles (src/styles/views.css)
- [x] Entry point (src/main.js) — glassy-liquid local import, i18n init, SW registration
- [x] index.html — PWA meta tags, manifest link, local font fallback

---

## 2. Technical Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| UI Library | `glassy-liquid` v0.1.0 | Required by project rules |
| Framework | Vanilla JS (ES modules) | Required by project rules |
| UI Distribution | Local copy (public/glassy-liquid/) | CDN (unpkg.com) blocked in sandbox |
| Routing | History API + `popstate` + View Transitions API | SPA client-side routing, Baseline 2026 |
| State | Simple reactive store (pub/sub) | Lightweight, no dependencies |
| Styling | CSS custom properties + logical properties | RTL/LTR, design tokens |
| Font | Vazirmatn (system fallback), system-ui (Latin) | Google Fonts CDN blocked; local @font-face fallback |
| Direction | `dir="rtl"` / `dir="ltr"` on `<html>` | Full RTL/LTR support |
| Build step | None | Zero-dependency, simple deployment |
| PWA | manifest + SW (cache-first shell, network-first content) | Offline capability |
| Components | Custom vanilla JS components wrapping glassy-liquid | Maximum reuse of library primitives |

---

## 3. File Structure

```
/arena/
├── docs/
│   ├── Agent.md
│   ├── Design.md
│   ├── Memory.md
│   └── Skills.md
├── public/
│   ├── glassy-liquid/       # Local copy of glassy-liquid v0.1.0 dist
│   │   ├── elements.js
│   │   ├── glassy-liquid.min.js
│   │   ├── components/
│   │   ├── scene/
│   │   ├── core/
│   │   ├── engine/
│   │   └── ...
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── app.js
│   ├── main.js
│   ├── data/
│   │   ├── mockAgents.js
│   │   ├── mockBlog.js
│   │   ├── mockDashboard.js
│   │   ├── mockFiles.js
│   │   └── mockUsers.js
│   ├── styles/
│   │   ├── layout.css
│   │   ├── tokens.css
│   │   └── views.css
│   ├── utils/
│   │   ├── i18n.js
│   │   ├── router.js
│   │   └── store.js
│   └── views/
│       ├── agents/index.js
│       ├── blog/index.js
│       ├── dashboard/index.js
│       ├── files/index.js
│       ├── settings/index.js
│       └── users/index.js
├── index.html
└── README.md
```

---

## 4. Key Fixes Applied

1. **glassy-liquid CDN → local**: `unpkg.com` is blocked in sandbox. Downloaded package from `registry.npmjs.org` and served locally from `/public/glassy-liquid/`.

2. **Google Fonts CDN → local fallback**: `fonts.googleapis.com` is blocked. Replaced with local `@font-face` using `local('Vazirmatn')` with `system-ui` fallback.

3. **Syntax error in i18n.js**: Fixed corrupted string `'settings_theme': ''apparence / نام'` → `'settings_theme': 'ظاهر / نام'`.

4. **Async route registration**: `_setupRouter()` now awaits `_registerRoutes()` before calling `router.init()`, ensuring routes are registered before initial render.

---

## 5. Running the Server

```bash
cd /home/user/arena
python3 -m http.server 8080
# Open http://localhost:8080
```

Server is currently running on port 8080 (process ID: `arena-pwa-dev-server-cf83c22d`).

---

## 6. Key Features Implemented

1. **Dashboard**: Stats cards (4), quick actions (4), activity log list
2. **Blog**: Post list with search + category filter, rich-text editor (bold/italic/underline/heading/lists/color/size), media upload (mock), AI writing assistant (mock), create/edit/delete with confirmation
3. **Users & RBAC**: User table with add/edit/delete, role management with permissions, native alert when deleting role with associated users
4. **File Explorer**: S3 bucket cards, file list with icons, add/delete bucket, add/delete file, preview/download actions
5. **Settings**: Profile, theme (light/dark/auto), glass settings (blur/tint), language switcher, about
6. **Agents**: Agent list (4 agents with status), iMessage-style chat with mock responses, auto-resize input
7. **PWA**: Web App Manifest with shortcuts, Service Worker with caching strategies, installable
8. **i18n**: Full Persian/English support with Vazirmatn font, RTL layout
9. **Navigation**: Bottom tab bar, top navbar with back button, View Transitions API
