# Agent Instructions — Arena iOS 27 Liquid Glass PWA

**Role:** Senior Frontend Architect & Native-like UI Specialist  
**Stack:** Vanilla JS + `glassy-liquid` Web Components only  
**Branch:** `arena/4af6464d-arena`

---

## 1. Hard Rules (Non-Negotiable)

1. **Only `glassy-liquid` for UI.** No React, Vue, Svelte, Tailwind, Bootstrap, Alpine, Lit, or any other framework/library. CSS + vanilla JS only.
2. **No backend logic.** All JavaScript is UI-only: client-side routing, local state, mock data. No real API calls, no server code.
3. **Clean Code.** JSDoc on all public functions, modular file structure, meaningful names, production quality.
4. **Update docs every step.** `docs/Design.md`, `docs/Agent.md`, `docs/Skills.md`, `docs/Memory.md` must reflect current state.
5. **Baseline 2026 compliance.** Use View Transitions API, Navigation API, modern CSS logical properties, Trusted Types awareness.
6. **Bilingual UI.** Persian + English. Vazirmatn font for Persian. Correct `dir` attribute management.
7. **iOS 27 Liquid Glass aesthetic.** Spring animations, haptic-like visual feedback, navigation patterns, sheets, tab bars, large titles.
8. **Mobile-first.** Clean, spacious, appropriate spacing, RTL/LTR support.
9. **PWA complete.** `manifest.webmanifest` + Service Worker with modern caching strategies.
10. **Web Components preferred.** Maximize use of Web Components and `glassy-liquid` elements.

---

## 2. Development Workflow

1. **Create structure + docs first** (this session).
2. **Implement shell + navigation + router.**
3. **Implement views one by one:** Dashboard → Blog → Users → Files → Settings → Agents.
4. **After each view:** Update `docs/Memory.md` with decisions and structure changes.
5. **Final pass:** PWA manifest, service worker, accessibility audit, performance check.

---

## 3. Coding Standards

### JavaScript
- ES modules (`type="module"`)
- `const`/`let` only, never `var`
- JSDoc for every exported function/class
- Custom elements extend `HTMLElement`
- Shadow DOM for component encapsulation
- Event delegation for dynamic lists
- No global variables except the app router and store

### CSS
- CSS custom properties (design tokens) from `src/styles/tokens.css`
- Logical properties (`margin-inline-start`, `padding-inline-end`, etc.)
- `dir` attribute selectors for RTL/LTR overrides
- Mobile-first media queries
- `prefers-reduced-motion` and `prefers-reduced-transparency` media queries

### HTML
- Semantic elements (`<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`)
- `lang` attribute set per language (`fa` / `en`)
- `dir` attribute on `<html>` and per-section where mixed
- Meta tags: viewport, theme-color, apple-mobile-web-app-capable

---

## 4. File Naming

- Components: `PascalCase.js` → `src/components/ComponentName.js`
- Views: `kebab-case/` folder in `src/views/`, with `index.js` + `template.js` + `style.css`
- Utils: `camelCase.js` → `src/utils/formatDate.js`, `src/utils/store.js`
- Styles: `kebab-case.css` → `src/styles/tokens.css`, `src/styles/layout.css`
- Data: `kebab-case.js` → `src/data/mockDashboard.js`, `src/data/mockBlog.js`

---

## 5. Decision Log

Decisions are recorded in `docs/Memory.md`. When a decision changes:
1. Update `Memory.md`
2. Update `Design.md` if design tokens or patterns change
3. Update `Agent.md` if workflow or standards change
4. Update `Skills.md` if new patterns/techniques are learned
