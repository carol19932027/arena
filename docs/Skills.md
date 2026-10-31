# Skills & Patterns — Agent Knowledge Base

**Project:** Arena iOS 27 Liquid Glass PWA  
**Purpose:** Skills and patterns the agent must know to implement this project

---

## 1. Vanilla JS Web Components

### Custom Element Lifecycle
- `constructor()` — set up shadow DOM, initial state
- `connectedCallback()` — attach listeners, render initial content
- `disconnectedCallback()` — remove listeners, cleanup
- `attributeChangedCallback(name, oldVal, newVal)` — react to attribute changes
- `adoptedCallback()` — when moved to a new document

### Pattern: Glassy-Liquid Wrapper
```js
export class GlassButton extends HTMLElement {
  static observedAttributes = ['variant', 'disabled'];
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.addEventListener('click', this._onClick);
  }
  // ...
}
customElements.define('arena-glass-button', GlassButton);
```

---

## 2. glassy-liquid Integration

### Import
```js
// CDN (no build step)
import 'https://unpkg.com/glassy-liquid@0.1.0/dist/elements.js';
// or bundled
import 'glassy-liquid/elements';
```

### Key Elements Used
- `<glass-button variant="prominent">` — primary actions
- `<glass-button variant="plain">` — secondary actions
- `<glass-switch>` — boolean toggles
- `<glass-slider>` — range inputs
- `<glass-tab-bar>` — bottom navigation
- `<glass-sheet open detent="50%">` — bottom sheets
- `<glass-search>` — search fields
- `<glass-menu>` — dropdown menus
- `<glass-toolbar>` — top action bars
- `<glass-group>` — list sections
- `<glass-surface radius="16">` — glass containers
- `<glass-scene src="...">` — refraction backdrop

### Events
All elements emit native DOM events: `click`, `change`, `input`, `toggle`, `search`, `detent`.

---

## 3. Client-Side Routing (History API)

```js
class Router {
  routes = new Map();
  currentPath = '/';
  
  navigate(path) {
    history.pushState({}, '', path);
    this.render(path);
  }
  
  handlePopState() {
    this.render(location.pathname);
  }
}
```

- Listen to `popstate` for back/forward
- Intercept all internal anchor clicks
- Use `document.startViewTransition` for animated transitions (Baseline 2026)

---

## 4. State Management (Local Store)

Simple reactive store with subscribers:

```js
class Store {
  constructor(initialState) {
    this.state = initialState;
    this.subscribers = new Set();
  }
  set(partial) {
    this.state = { ...this.state, ...partial };
    this.subscribers.forEach(fn => fn(this.state));
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
}
```

---

## 5. RTL / LTR Handling

### HTML Direction
```html
<html dir="rtl" lang="fa">  <!-- Persian -->
<html dir="ltr" lang="en">  <!-- English -->
```

### CSS Logical Properties
```css
/* Instead of margin-left */
margin-inline-start: var(--ios27-space-md);
/* Instead of padding-right */
padding-inline-end: var(--ios27-space-lg);
```

### Font Selection
```css
:lang(fa) { font-family: 'Vazirmatn', system-ui, sans-serif; }
:lang(en) { font-family: system-ui, -apple-system, sans-serif; }
```

### Number Formatting
- Persian: `new Intl.NumberFormat('fa-IR')` → ۰-۹
- English: `new Intl.NumberFormat('en-US')` → 0-9

---

## 6. PWA Implementation

### Manifest (`public/manifest.webmanifest`)
- `name`, `short_name`, `description`
- `start_url`, `scope`
- `display: standalone`
- `theme_color`, `background_color`
- `icons`: 192×192, 512×512 (SVG or PNG)

### Service Worker (`public/sw.js`)
- Cache-first for app shell (HTML, CSS, JS)
- Network-first for content/API mock data
- Cache versioning (`v1`, `v2`, ...)
- `install` and `activate` events with `skipWaiting()` and `clients.claim()`
- Offline fallback route

---

## 7. View Transition API (Baseline 2026)

```js
function navigateWithTransition(path) {
  if (!document.startViewTransition) {
    router.navigate(path);
    return;
  }
  const transition = document.startViewTransition(() => {
    router.navigate(path);
  });
  transition.finished.then(() => {
    // transition complete
  });
}
```

---

## 8. Accessibility Patterns

| Pattern | Implementation |
|---------|---------------|
| Focus trap in sheets/modals | Manage focus within container |
| ARIA labels on glass buttons | `aria-label`, `aria-pressed` |
| Skip to main content | Visually hidden skip link |
| Reduced motion | Respect `prefers-reduced-motion` |
| Reduced transparency | Respect `prefers-reduced-transparency` |
| Touch target size | ≥ 44×44 px |

---

## 9. Animation & Motion

### Spring Animation (Cubic-Bezier Approximation)
```css
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Haptic-Like Visual Feedback
- Button press: scale down to 0.95, opacity 0.8
- Switch toggle: spring-based thumb movement
- Sheet presentation: slide up with slight overshoot

---

## 10. Mock Data Strategy

All data is in `src/data/` as ES module exports. No fetch/XHR calls. Data shapes:

```js
// src/data/mockUsers.js
export const users = [
  { id: 1, firstName: 'علی', lastName: 'حسینی', username: 'ali.h', role: 'admin', status: 'active' },
  // ...
];

export const roles = [
  { id: 1, name: 'مدیر سیستم', key: 'admin', permissions: ['*'] },
  { id: 2, name: 'مُحرر', key: 'editor', permissions: ['blog:read', 'blog:write'] },
  // ...
];
```
