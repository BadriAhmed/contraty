---
name: Contraty
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#585d77'
  on-secondary: '#ffffff'
  secondary-container: '#dadefd'
  on-secondary-container: '#5c617c'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#c1c5e3'
  on-secondary-fixed: '#151a31'
  on-secondary-fixed-variant: '#41455f'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
  success-green: '#16a34a'
  success-light: '#dcfce7'
  border-slate: '#e2e8f0'
  text-secondary: '#64748b'
  bg-page: '#f7f7fb'
  cat-real-estate: '#0ea5e9'
  cat-employment: '#16a34a'
  cat-business: '#8b5cf6'
  cat-services: '#3b82f6'
  cat-family: '#eab308'
  cat-documents: '#94a3b8'
typography:
  headline-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-section:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  subtitle:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.5'
  card-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  section-gap: 3rem
  grid-gap: 1.5rem
  margin-page: 2rem
  margin-mobile: 1rem
---

# Design System: Contraty

## Brand Personality
Approachable, professional, and trustworthy. A modern legal-tech aesthetic inspired by the clean, tool-focused layout of iLoveIMG but adapted for the contract domain.

## Color Palette

### Background & Surfaces
- **Page Background**: `#f7f7fb` (Light, airy lavender grey)
- **Card/Surface**: `#ffffff` (Pure white)
- **Header**: `#ffffff` with `1px solid #e2e8f0` border
- **Footer**: `#1a1f36` (Dark Navy - provides professional weight)

### Primary UI (Blue)
- **Primary**: `#2563eb` (Blue-600) - Main CTAs
- **Primary Hover**: `#1d4ed8` (Blue-700)
- **Primary Active**: `#1e3a5f` (Dark Navy)

### Accents
- **Premium/Gold**: `#f59e0b` (Amber-500) - Upgrades and badges
- **Premium Hover**: `#d97706` (Amber-600)
- **Success Green**: `#16a34a` (Green-600)
- **Success Light BG**: `#dcfce7` (Green-100)

### Neutrals
- **Text Primary**: `#1a1f36` (Headings and body)
- **Text Secondary**: `#64748b` (Slate-500)
- **Border**: `#e2e8f0` (Slate-200)

### Category Colors
- **Real Estate**: `#0ea5e9` (Sky-500)
- **Employment**: `#16a34a` (Green-600)
- **Business**: `#8b5cf6` (Violet-500)
- **Services**: `#3b82f6` (Blue-500)
- **Finance**: `#f59e0b` (Amber-500)
- **Family/Civil**: `#eab308` (Yellow-500)
- **Documents**: `#94a3b8` (Slate-400)

## Typography
- **Primary Font**: `Inter` (Sans-serif, modern, readable)
- **Arabic Font**: `Noto Naskh Arabic` (For RTL support)
- **Monospace**: `JetBrains Mono` (For contract code/JSON previews)

### Scale
- **H1 (Hero)**: `48px / 3rem`, Bold (700)
- **H2 (Subtitle)**: `20px / 1.25rem`, Regular (400)
- **H3 (Section)**: `24px / 1.5rem`, Semibold (600)
- **H4 (Card Title)**: `18px / 1.125rem`, Semibold (600)
- **Body**: `16px / 1rem`, Regular (400)
- **Small**: `14px / 0.875rem`, Regular (400)

## Components

### Buttons
- **Shape**: Rounded (8px)
- **Primary**: Solid blue-600, white text, semi-bold.
- **Secondary**: Outlined blue-600, white background.
- **Premium**: Solid amber-500, dark navy text.

### Cards
- **Border**: 1px solid #e2e8f0
- **Radius**: 12px
- **Hover Shadow**: Layered shadow (0 0 20px 4px rgba(148,163,184,0.15), 0 4px 80px -8px rgba(30,41,59,0.25))

### Pills / Filters
- **Shape**: Full pill (rounded-full)
- **Style**: White background, light border. Dark navy background when active.

## Spacing
- **Container**: Max-width 1280px (7xl)
- **Section Gap**: 48px (my-12)
- **Grid Gap**: 24px (gap-6)
