# Dark Mode Setup - Complete Configuration

## Changes Made

### 1. **tailwind.config.js** ✅
- Changed `darkMode: "class"` to `darkMode: "selector"` (Tailwind 4 syntax)
- Added color theme extensions matching your design system
- Added Nohemi font family extension

### 2. **postcss.config.js** ✅
- Removed `@tailwindcss/postcss` (not needed with @tailwindcss/vite)
- Kept autoprefixer for vendor prefixes

### 3. **index.html** ✅
- Added initialization script that runs before React renders
- This prevents flash of unstyled content (FOUC) on dark mode
- Script reads theme from localStorage and adds `dark` class to `<html>`

### 4. **SettingsContext.tsx** ✅ (Already working)
- Manages theme state with localStorage persistence
- Adds/removes `dark` class on `<html>` element when toggled
- Properly wrapped in main.tsx with SettingsProvider

### 5. **Settings.tsx Component** ✅ (Already working)
- Has theme toggle buttons (Light/Dark)
- Calls `setTheme("light")` and `setTheme("dark")`
- UI already styled for dark mode

## How It Works

1. **Page Load**:
   - `index.html` script runs immediately, checks localStorage for saved theme
   - If theme is "dark", adds `dark` class to `<html>` element
   - Prevents FOUC

2. **React Initialization**:
   - SettingsProvider wraps the app in main.tsx
   - SettingsContext initializes theme state from localStorage
   - useEffect keeps HTML class in sync with state

3. **User Toggles Theme**:
   - Click Light/Dark button in Settings
   - `setTheme()` updates state
   - useEffect runs → adds/removes `dark` class from `<html>`
   - Tailwind's `dark:` variants activate immediately
   - Theme persists to localStorage

## Testing Dark Mode

1. Go to `/settings` route
2. Click the "Dark" button in the Theme section
3. Page should immediately switch to dark colors
4. All `dark:` Tailwind classes should apply
5. Refresh page → dark mode persists

## Tailwind Dark Mode Selectors

Your components use `dark:` variants like:
```tsx
<div className="bg-white dark:bg-gray-800">
  <p className="text-gray-700 dark:text-gray-100">Text</p>
</div>
```

When `dark` class is on `<html>`, these `dark:` styles activate automatically.

## Browser DevTools Check

Open DevTools and check:
1. Elements panel → `<html>` element
2. When dark mode is enabled, should see `class="dark"`
3. When toggled off, class should be removed
4. Computed styles should change accordingly

## If Dark Mode Still Isn't Working

Try these debugging steps:

1. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear site data in DevTools

2. **Check localStorage**:
   - Open DevTools → Application → Local Storage
   - Should see key: `"theme"` with value: `"dark"` or `"light"`

3. **Verify HTML element**:
   - Inspect `<html>` element
   - Should have `class="dark"` when dark mode is on

4. **Check for CSS conflicts**:
   - The old `variables.css` file has custom CSS vars
   - Tailwind's `dark:` classes should override them
   - If not working, might need to remove conflicting styles

## Tailwind 4 Features Used

- `@tailwindcss/vite` plugin for fast builds
- `@import "tailwindcss"` in index.css
- `@theme { ... }` block for custom tokens
- `darkMode: "selector"` for class-based dark mode
- `dark:` variant prefixes for dark mode styles
