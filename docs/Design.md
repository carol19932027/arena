# Design Specification — iOS 27 Liquid Glass

**Project:** Arena Native-like PWA + SPA  
**Version:** 1.0.0  
**Last Updated:** 2026-10-31  
**UI Library:** `glassy-liquid` v0.1.0 (Web Components)  
**Target OS Appearance:** iOS 27 Liquid Glass  
**Direction:** RTL + LTR (Persian / English)  
**Font:** Vazirmatn (Persian), system-ui (English fallback)

---

## 1. Design System Tokens

All CSS custom properties are defined in `src/styles/tokens.css`.  
They follow the `--gl-*` convention from `glassy-liquid` plus project-specific `--ios27-*` tokens.

### 1.1 Color Palette

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--ios27-bg-primary` | `#ffffff` | `#000000` | Main page background |
| `--ios27-bg-secondary` | `#f2f2f7` | `#1c1c1e` | Elevated surface background |
| `--ios27-bg-tertiary` | `#e5e5ea` | `#2c2c2e` | Separator / subtle fill |
| `--ios27-accent` | `#007aff` | `#0a84ff` | Primary accent (iOS blue) |
| `--ios27-accent-hover` | `#0056b3` | `#208df4` | Accent pressed / hover |
| `--ios27-text-primary` | `#000000` | `#ffffff` | Primary text |
| `--ios27-text-secondary` | `#3c3c43` | `#ebebf5` | Secondary text |
| `--ios27-text-tertiary` | `#8e8e93` | `#636366` | Tertiary / muted text |
| `--ios27-border` | `#d1d1d6` | `#38383a` | Hairline borders |
| `--ios27-success` | `#34c759` | `#30d158` | Success / positive |
| `--ios27-warning` | `#ffcc00` | `#ffd60a` | Warning / caution |
| `--ios27-destructive` | `#ff3b30` | `#ff453a` | Destructive / delete |
| `--ios27-glass-tint` | `rgba(255,255,255,0.75)` | `rgba(0,0,0,0.65)` | Glass surface tint |
| `--ios27-glass-blur` | `20px` | `20px` | Backdrop blur strength |
| `--ios27-shadow` | `0 10px 30px -10px rgba(0,0,0,0.12)` | `0 20px 40px -10px rgba(0,0,0,0.5)` | Drop shadow |

### 1.2 Typography (Vazirmatn)

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--ios27-text-large-title` | `34px` | `700` | `1.15` | Large titles in navigation bars |
| `--ios27-text-title1` | `28px` | `700` | `1.2` | Section titles |
| `--ios27-text-title2` | `22px` | `600` | `1.25` | Card titles |
| `--ios27-text-title3` | `20px` | `600` | `1.3` | Subtitles |
| `--ios27-text-headline` | `17px` | `600` | `1.4` | List item primary |
| `--ios27-text-body` | `17px` | `400` | `1.5` | Body text |
| `--ios27-text-callout` | `16px` | `400` | `1.5` | Callout / hint text |
| `--ios27-text-subhead` | `15px` | `400` | `1.45` | Secondary info |
| `--ios27-text-footnote` | `13px` | `400` | `1.4` | Footnotes |
| `--ios27-text-caption1` | `12px` | `400` | `1.35` | Captions |
| `--ios27-text-caption2` | `11px` | `400` | `1.3` | Tiny labels |

### 1.3 Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--ios27-space-xs` | `4px` | Tight internal padding |
| `--ios27-space-sm` | `8px` | Small gaps |
| `--ios27-space-md` | `16px` | Standard section gap |
| `--ios27-space-lg` | `24px` | Card padding |
| `--ios27-space-xl` | `32px` | Large section padding |
| `--ios27-space-xxl` | `48px` | Hero / large title area |
| `--ios27-space-safe-top` | `env(safe-area-inset-top)` | iOS notch safe area |
| `--ios27-space-safe-bottom` | `env(safe-area-inset-bottom)` | iOS home indicator safe area |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--ios27-radius-sm` | `8px` | Small elements (badge, tag) |
| `--ios27-radius-md` | `12px` | Cards, buttons |
| `--ios27-radius-lg` | `16px` | Sheets, modals, large surfaces |
| `--ios27-radius-xl` | `24px` | Full-screen panels |
| `--ios27-radius-circle` | `50%` | Avatars, circular buttons |

### 1.5 Elevation / Shadow

| Token | Value |
|-------|-------|
| `--ios27-elev-none` | `none` |
| `--ios27-elev-sm` | `0 1px 3px rgba(0,0,0,0.08)` |
| `--ios27-elev-md` | `0 4px 12px rgba(0,0,0,0.1)` |
| `--ios27-elev-lg` | `0 10px 30px -10px rgba(0,0,0,0.15)` |
| `--ios27-elev-xl` | `0 20px 40px -15px rgba(0,0,0,0.25)` |

---

## 2. glassy-liquid Component Usage

The project uses **only** `glassy-liquid` Web Components. No other UI library is permitted.

### Registered Elements (via `glassy-liquid/elements`)

| Element | Tag | Purpose |
|---------|-----|---------|
| GlassScene | `<glass-scene>` | Real refraction backdrop for Safari / Firefox |
| GlassSurface | `<glass-surface>` | Generic glass layer |
| GlassButton | `<glass-button>` | iOS glass button (plain / prominent) |
| GlassSwitch | `<glass-switch>` | Toggle control |
| GlassSlider | `<glass-slider>` | Range slider |
| GlassTabBar | `<glass-tab-bar>` | Bottom tab navigation |
| GlassSegmented | `<glass-segmented-control>` | Segmented control |
| GlassMenu | `<glass-menu>` | Dropdown / context menu |
| GlassToolbar | `<glass-toolbar>` | Top action toolbar |
| GlassGroup | `<glass-group>` | Grouped list section |
| GlassSpacer | `<glass-spacer>` | Flexible spacer |
| GlassSearch | `<glass-search>` | Search field |
| GlassSheet | `<glass-sheet>` | Bottom sheet (detents) |
| GlassProgressiveBlur | `<glass-progressive-blur>` | Scroll-edge blur |

### Variants & Attributes

- `variant="prominent"` on `<glass-button>` → filled accent button
- `variant="plain"` (default) → glass-only button
- `appearance="light" \| "dark"` → overrides page color scheme
- `radius="number \| capsule \| circle"` → corner radius on surfaces/buttons
- `open` boolean on `<glass-sheet>` → controls sheet visibility
- `detent` attribute → sheet detent points

### Events

Native DOM events: `click`, `change`, `input`, `select`, `toggle`, `search`, `detent`.

---

## 3. Navigation Patterns (iOS 27)

### 3.1 Bottom Tab Bar

- Fixed at bottom, respecting `safe-area-inset-bottom`
- 4–5 tabs max, each with icon + label
- Active tab uses `--glass-tab-selected`, inactive uses `--glass-tab-selection`
- Spring-based scale/opacity transitions on tab switch

### 3.2 Large Title Navigation Bar

- Collapsible large title on scroll
- Back button with chevron (`‹`) in RTL-aware direction
- Right-side action buttons (glass buttons, prominent variant)

### 3.3 Bottom Sheets

- Presented from bottom with spring animation
- Multiple detents (e.g., 25%, 50%, 75%, 100%)
- Drag handle at top
- Scrim behind sheet

### 3.4 View Transitions

- Uses View Transitions API (`document.startViewTransition`) where available
- Fallback: crossfade (300ms ease-out)
- Direction-aware: slide from edge based on navigation direction

---

## 4. RTL / LTR Support

- `<html dir="rtl">` for Persian, `<html dir="ltr">` for English
- `direction` CSS logical properties used throughout (`margin-inline-start`, `padding-inline-end`, etc.)
- `text-align: start` / `text-align: end` instead of left/right
- Vazirmatn font for Persian text; system fallback for Latin
- Numbers: Eastern Arabic numerals (۰-۹) in Persian mode, Western (0-9) in English
- Icons mirrored in RTL (chevrons, arrows, etc.) via CSS `transform: scaleX(-1)` where needed

---

## 5. Component Library (Custom)

Beyond `glassy-liquid` primitives, the project defines custom vanilla-JS web components:

| Component | File | Description |
|-----------|------|-------------|
| `StatCard` | `src/components/StatCard.js` | Dashboard stat card with glass surface |
| `ActivityItem` | `src/components/ActivityItem.js` | Activity log row |
| `QuickAction` | `src/components/QuickAction.js` | Dashboard shortcut button |
| `BlogPostList` | `src/components/BlogPostList.js` | Blog list with search/filter |
| `BlogEditor` | `src/components/BlogEditor.js` | Rich-text editor (mock) |
| `UserList` | `src/components/UserList.js` | User management table |
| `UserForm` | `src/components/UserForm.js` | Add/edit user modal |
| `RBACRoleManager` | `src/components/RBACRoleManager.js` | Role & permission manager |
| `FileExplorer` | `src/components/FileExplorer.js` | S3 bucket file browser |
| `ChatView` | `src/components/ChatView.js` | Agent chat (iMessage style) |
| `ThemeToggle` | `src/components/ThemeToggle.js` | Dark/Light/Auto switch |

---

## 6. Views & Layout

| View | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Stats, quick actions, activity log |
| Blog | `/blog` | Blog management with rich editor |
| Users | `/users` | Users & RBAC |
| Files | `/files` | File explorer (S3 buckets) |
| Settings | `/settings` | App settings, theme, profile |
| Agents | `/agents` | Agent chat interface |

---

## 7. Accessibility

- All `glassy-liquid` components carry proper ARIA roles by default
- Custom components add `role`, `aria-label`, `aria-expanded`, `aria-controls`
- Keyboard navigation: Tab, Enter, Space, Escape
- Focus rings visible (`--glass-focus`)
- `prefers-reduced-motion` respected (animations disabled/reduced)
- `prefers-reduced-transparency` respected (glass becomes opaque)
- Minimum 4.5:1 contrast on all text
- Touch targets ≥ 44×44 px

---

## 8. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.0s |
| Layout Shift (CLS) | < 0.1 |
| Frame rate during animations | 60 fps |
| Bundle size (JS + CSS) | < 100 kB gzip |

---

## 9. PWA Requirements

- `manifest.webmanifest` with name, short_name, icons, start_url, display: standalone
- Service Worker with cache-first for app shell, network-first for content
- Offline fallback page
- Install prompt (beforeinstallprompt)
- Theme color matching `--ios27-bg-primary`
