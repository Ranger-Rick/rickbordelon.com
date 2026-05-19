# AGENTS.md

## Package Manager

Always use **bun** for installing dependencies and running scripts.

```bash
bun install
bun run dev      # dev server
bun run build    # production build
bun run preview  # preview production build
```

## Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vite 8** (build tool)
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin)
- **JavaScript** (not TypeScript) -- `jsconfig.json` is used for path aliases
- **Docker** for containerized deployment

## Coding Conventions

### Formatting

- 2-space indentation (spaces, not tabs)
- Single quotes for strings
- No semicolons
- Trailing commas in multiline arrays/objects

### File Naming

- Components: PascalCase (`HeroSection.vue`, `ThemeToggle.vue`)
- Non-component JS: camelCase (`main.js`, `vite.config.js`)

### Vue Components

- Always use `<script setup>` (Composition API only, no Options API)
- Block order: `<script setup>` first, then `<template>` (no `<style>` blocks)
- Props defined with `defineProps()` using object syntax with types, defaults, and validators
- Node built-ins prefixed with `node:` (e.g., `'node:url'`)

### CSS / Styling

- All styles live in `src/assets/main.css` -- no `<style>` blocks in components
- BEM-like class naming: block (`section-card`), element (`hero-card__content`), modifier (`content-card--left`)
- CSS custom properties for theming (`--theme-*`, `--color-*`)
- Dark mode via `.dark` class on `<html>`
- Tailwind utilities used sparingly in templates for layout/spacing

### Imports

- Relative imports within `src/` (e.g., `'./components/HeroSection.vue'`)
- `@/` alias available (maps to `./src`)

## Project Structure

```
src/
├── main.js              # app bootstrap
├── App.vue              # root component
├── assets/
│   └── main.css         # global styles, Tailwind, theme variables
└── components/          # Vue components
```

## No Linting Config

There is no ESLint or Prettier config. Follow the conventions above by matching existing code style.
