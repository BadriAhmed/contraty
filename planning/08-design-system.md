# Design System Reference — Inspired by iLoveIMG

To hand to a designer. iLoveIMG's palette adapted for Contraty's legal/contract domain.

---

## Color Palette

### Background & Surfaces

| Token | iLoveIMG Original | Contraty Adaptation | Usage |
|---|---|---|---|
| Page background | `#f5f5fa` (lavender grey) | `#f7f7fb` | Main body, keeps the light airy feel |
| Card/surface | `#ffffff` | `#ffffff` | Tool cards, content cards |
| Header | `#ffffff` + `1px solid #d6d6df` | Same | Top nav, conveys trust |
| Footer | — | `#1a1f36` (dark navy) | Professional, legal-grade |

### Primary UI (Blue family)

| Token | iLoveIMG | Contraty | Usage |
|---|---|---|---|
| Primary button | `#4d90fe` | `#2563eb` (blue-600) | CTA: "Generate contract", "Download" |
| Primary hover | `#2c64c0` | `#1d4ed8` (blue-700) | Button hover state |
| Primary active | `#161616` | `#1e3a5f` (dark navy) | Button pressed |
| Secondary button bg | `#ffffff` | `#ffffff` | Outlined buttons |
| Secondary outline | `#4d90fe` | `#2563eb` | Login, Sign up (secondary) |

### Accent (Success / Premium)

| Token | iLoveIMG | Contraty | Usage |
|---|---|---|---|
| Premium/gold | `#ffc233` | `#f59e0b` (amber-500) | "Upgrade", premium badge |
| Premium hover | `#ef9e02` | `#d97706` (amber-600) | Hover |
| Success green | `#8FBC5D` | `#16a34a` (green-600) | "Contract generated", success toasts |
| Green light bg | `#E5F5D2` | `#dcfce7` | Green tool icons bg |

### Neutral

| Token | iLoveIMG | Contraty | Usage |
|---|---|---|---|
| Text primary | `#333333`, `#26323d` | `#1a1f36` | Body text, headings |
| Text secondary | — | `#64748b` (slate-500) | Descriptions, helper text |
| Border | `#d6d6df` | `#e2e8f0` (slate-200) | Card borders, dividers |
| Tag inactive bg | `#ffffff` | `#ffffff` | Filter pills |
| Tag inactive border | `#d6d6df` | `#e2e8f0` | Filter pill border |
| Tag active bg | `#292931` | `#1a1f36` | Active filter pill |

### Category Icons (multi-color, like iLoveIMG tools)

| Category | iLoveIMG color | Contraty color | Usage |
|---|---|---|---|
| Real estate | `#3CB6E2` (blue) | `#0ea5e9` (sky-500) | Immobilier |
| Employment | `#8FBC5D` (green) | `#16a34a` (green-600) | Travail |
| Business | `#AB6993` (purple) | `#8b5cf6` (violet-500) | Sociétés |
| Services | `#4A7AAB` (steel blue) | `#3b82f6` (blue-500) | Services |
| Finance | `#FFD400` (yellow) | `#f59e0b` (amber-500) | Prêt & Finance |
| Family/Civil | `#DAB400` (gold) | `#eab308` (yellow-500) | Droit de la famille |
| Documents | `#BCD1E6` (light blue) | `#94a3b8` (slate-400) | Divers |

---

## Typography

### Font Stack

| Usage | iLoveIMG | Contraty (free equivalent) |
|---|---|---|
| Primary font | Graphik (commercial) | **Inter** (Google Fonts, free) |
| Arabic font | Not in use on iLoveIMG | **Noto Naskh Arabic** (Google Fonts) |
| Monospace | — | JetBrains Mono (contract JSON preview only) |

### Scale

| Level | iLoveIMG size | Contraty size | Usage |
|---|---|---|---|
| H1 hero | ~48px Bold | `text-5xl` (48px) `font-bold` | Landing page headline |
| H2 subtitle | ~24px Regular | `text-xl` (20px) `font-normal` | Hero subtitle |
| H3 section | — | `text-2xl` (24px) `font-semibold` | Section titles |
| H4 card title | 16-18px Semibold | `text-lg` (18px) `font-semibold` | Contract card names |
| Body | 16px Regular | `text-base` (16px) | Descriptions |
| Small | 12px | `text-sm` (14px) | Helper text, badges |
| Button | 16px Semibold | `text-base` (16px) `font-semibold` | Button text |

### Weight scale (matching iLoveIMG's Graphik range)

```
Regular (400) — Body text, descriptions
Medium (500)  — Tags, pills, form labels
Semibold (600) — Buttons, card titles, nav links
Bold (700) — Headlines, hero text
```

---

## Spacing & Layout

| Token | iLoveIMG | Contraty |
|---|---|---|
| Section margin | 48px between blocks | `my-12` (48px) |
| Card gap | 24px grid gap | `gap-6` (24px) |
| Card padding | — | `p-6` (24px) |
| Container max-width | 1370px | `max-w-7xl` (1280px) |
| Button padding (lg) | 8px 20px | `px-5 py-2` |
| Button padding (sm) | 8px 12px | `px-3 py-2` |
| Page padding (mobile) | 24px | `px-4` (16px) |

---

## Components

### Buttons

**Primary (Solid)**
```
background: #2563eb
color: #ffffff
font-weight: 600
border-radius: 8px
padding: 8px 20px (lg) / 8px 12px (sm)
transition: all 0.1s linear
hover: background #1d4ed8
active: background #1e3a5f
```

**Secondary (Outline)**
```
background: #ffffff
color: #2563eb
outline: 2px solid #2563eb
outline-offset: -2px
border: none
hover: color #1d4ed8, outline #1d4ed8
```

**Premium (Gold)**
```
background: #f59e0b
color: #1a1f36
font-weight: 600
hover: background #d97706
```

### Filter Tags (Pills)

```
Default:
  background: #ffffff
  border: 1px solid #e2e8f0
  border-radius: 9999px (full pill)
  font-size: 16px
  font-weight: 500
  padding: 4px 16px
  height: 34px
  transition: all 0.2s ease-in-out

Active:
  background: #1a1f36
  color: #ffffff
  border-color: #1a1f36

Hover (inactive):
  border-color: #1a1f36
```

### Cards (Tool/Contract Cards)

```
Card container:
  background: #ffffff
  border-radius: 12px
  border: 1px solid #e2e8f0
  padding: 24px
  transition: box-shadow 0.2s ease

Card hover:
  box-shadow:
    0 0 20px 4px rgba(148, 163, 184, 0.15),
    0 4px 80px -8px rgba(30, 41, 59, 0.25),
    0 4px 4px -2px rgba(71, 85, 105, 0.15)
  (layered shadow, like iLoveIMG)

Card icon:
  width: 48px, height: 48px
  background: category-color at 15% opacity
  border-radius: 12px
  SVG icon in category-color
```

### Header / Navigation

```
Header bar:
  background: #ffffff
  border-bottom: 1px solid #e2e8f0
  height: 60px
  position: fixed, top: 0

Brand/Logo:
  order: 2 (centered in mobile, left in desktop)
  height: 32px

Nav links:
  color: #1a1f36
  font-weight: 500
  font-size: 14px
  padding: 8px 12px
  border-radius: 8px
  hover: background #f1f5f9
```

### Badges

```
New badge:
  background: #dcfce7 (green-100)
  color: #16a34a (green-600)
  border-radius: 4px
  font-size: 11px
  font-weight: 600
  padding: 2px 8px
  text-transform: uppercase
  letter-spacing: 0.5px

Premium badge:
  background: #fef3c7 (amber-100)
  color: #92400e (amber-800)
```

### Wizard Steps (Contract Generation)

```
Step indicator:
  background: #f1f5f9 (inactive)
  background: #2563eb (active)
  background: #16a34a (completed)
  width: 32px, height: 32px
  border-radius: 9999px
  font-weight: 600, color: #ffffff
  font-size: 14px

Progress bar:
  background: #e2e8f0
  fill: #2563eb
  height: 4px
  border-radius: 2px
  transition: width 0.3s ease
```

---

## Responsive Behavior (Mobile-First)

```
Mobile (<768px):
  - Cards: 1 column grid
  - Header: hamburger menu, brand centered
  - Buttons: full-width
  - Hero: stacked layout, smaller heading
  - Filter tags: horizontal scroll
  - Page padding: 16px

Tablet (768px-1024px):
  - Cards: 2 column grid
  - Header: inline nav links

Desktop (>1024px):
  - Cards: 3 column grid
  - Max content width: 1280px
  - Header: full nav with dropdowns
```

---

## Quick Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',  // Primary
          700: '#1d4ed8',  // Primary hover
          900: '#1e3a5f',  // Dark navy
        },
        surface: '#f7f7fb',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Naskh Arabic', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        card: '0 0 20px 4px rgba(148,163,184,0.15), 0 4px 80px -8px rgba(30,41,59,0.25), 0 4px 4px -2px rgba(71,85,105,0.15)',
      },
    },
  },
}
```

---

## Summary for Designer

> **Vibe:** iLoveIMG's clean, tool-grid aesthetic — adapted for a professional legal context.
>
> **Keep:** card grid layout, pill-shaped filter tags, multi-color category icons, generous white space, layered shadows on hover.
>
> **Change:** swap iLoveIMG's playful green/pink accents for a more serious navy blue (`#2563eb`) and amber gold (`#f59e0b`). Use Inter font instead of Graphik. Add Noto Naskh Arabic for RTL support.
>
> **Mood words:** trustworthy, clean, modern, professional, approachable (not corporate-stiff).
