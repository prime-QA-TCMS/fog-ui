# fog-ui

fog-ui is an open-source React component library built on top of Material UI (MUI).
It provides reusable UI components and a shared theming system intended for teams
that build and maintain multiple React applications.

This project is community-driven and welcomes contributions of all kinds:
code, documentation, tests, ideas, and constructive feedback.

---

## Why fog-ui exists

Many teams use MUI successfully but end up duplicating:
- the same card patterns
- the same table layouts
- the same form abstractions
- the same theme logic

fog-ui exists to centralize those patterns into a **tested, typed, reusable library**
without locking consumers into a rigid design system.

Core goals:
- Consistency across applications
- Explicit, predictable APIs
- Strong test coverage
- Minimal magic

---

## Project values

We try to optimize for the following:

- **Clarity over cleverness**  
  Code should be readable first, impressive second.

- **Composition over inheritance**  
  Prefer composing MUI primitives instead of deep abstractions.

- **Stability over novelty**  
  This is a UI foundation, not a playground for trends.

- **Respect for contributors’ time**  
  Clear structure, tests, and documentation matter.

---

## Who this project is for

fog-ui is a good fit if you:
- already use MUI
- want shared UI foundations across apps
- care about test coverage and type safety
- prefer explicit APIs over hidden behavior

fog-ui is *not* intended to:
- replace MUI
- provide a full design system with opinions on branding
- support multiple styling frameworks

---

# Implementation Guide (Getting Started)

This page explains how to integrate `fog-ui` into a React application, including required dependencies, theming setup, and common integration patterns.

---

## 1) Install

### Install fog-ui
```bash
npm install fog-ui
```

### Install required peer dependencies (MUI + Emotion)
fog-ui is built on Material UI (MUI) and uses Emotion styling. Your application must include:
```bash
npm install @mui/material @emotion/react @emotion/styled
```
If your application uses additional MUI packages (icons, date pickers, etc.), install them separately as needed.

## 2) Minimal integration (recommended)
fog-ui ships a theme factory (`createFogTheme`) that produces an MUI theme. Wrap your app with MUI's `ThemeProvider` once at the root.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createFogTheme, ToastProvider, PageWrapper } from "fog-ui";
import App from "./App";

const theme = createFogTheme({
  palette: { mode: "light" }, // switch to "dark" for dark mode
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <PageWrapper menuItems={{}}>
          <App />
        </PageWrapper>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```
This mirrors the consumer app setup: one shared MUI theme, toast provider, and the layout wrapper.

## 3) Using components
Once installed, import components directly from the package:
### Install fog-ui
```tsx
import { PermissionCard, DataTable, TrendAnalyticsChart } from "fog-ui";
```
If a component requires routing (for example, template/navigation components), make sure your application is wrapped with a router.


## 4) Router integration (required for template/nav components)
Template components (PageWrapper, Topbar, ProtectedRoute) and link-rendering lists need `react-router-dom`. Wrap the app with a router (HashRouter in the consumer app):
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createFogTheme } from "fog-ui";
import App from "./App";

const theme = createFogTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);

```
Install routing if you do not already have it:
```bash
npm install react-router-dom
```

## 5) Theme customization
Use `createFogTheme` to control light/dark mode, brand colors, and typography (as shown in the consumer app `ThemeCustomizationDemo`).

```tsx
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createFogTheme } from "fog-ui";

const theme = createFogTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976D2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: "Inter",
  },
});

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

## 6) TypeScript usage
fog-ui is designed for TypeScript. In most projects, no additional setup is required.

If you see type resolution issues:

- Ensure your TypeScript version is modern (TS 5+ recommended)
- Ensure your bundler supports ESM packages correctly


### Types — how to import
fog-ui exposes TypeScript types from the package root so you can import them directly from `fog-ui`.

Examples:

- Import a type-only symbol:

```ts
import type { TableRowData } from 'fog-ui';

function handleRow(row: TableRowData) { /* ... */ }
```

- Import types alongside runtime values (use `import type` when possible to avoid pulling runtime code):

```ts
import { DataTable } from 'fog-ui';
import type { DataTableProps } from 'fog-ui';

const props: DataTableProps = { /* ... */ };
<DataTable {...props} />
```

- If you only need several types, prefer named type imports to keep imports minimal:

```ts
import type { TabsProps, TabItem } from 'fog-ui';
```

Notes:

- The package publishes `.d.ts` declarations under `dist/` and `package.json` `types` points to `./dist/index.d.ts`.
- When using `tsc` or IDEs like VS Code, TypeScript will resolve types from the installed package automatically.
- Prefer `import type { ... } from 'fog-ui'` to ensure imports are erased at compile time and do not pull runtime code into your bundle.



## 7) Common pitfalls
Components render but styles look wrong

fog-ui relies on MUI/Emotion theming. Ensure:
- Emotion packages are installed
- The app is wrapped in a single MUI ThemeProvider (or the theme from `createFogTheme`)

Navigation components do not work
- Install `react-router-dom`
- Wrap the app in a router (HashRouter/BrowserRouter)

Bundle size looks too large
- Ensure only one copy of react, @mui/material, @emotion/react/@emotion/styled is installed (dedupe in Vite if linking locally)

AxiosProvider throws on missing services
- Pass a `services` map: `{ api: { baseURL: '...', requiresAuth: false } }`
- When using `useService`, always specify the service name: `useService('api')`


## 8) Quick verification checklist
After integration, verify:

[] npm run dev renders at least one fog-ui component
[] Theme styles apply correctly
[] If using template/navigation: routing works (links, page wrapper)
[] No duplicate React or Emotion versions installed


## Local development and installing from local source
If you are testing `fog-ui` from a local checkout (for example using a `file:..` dependency in a consumer), the consumer bundler can accidentally pre-bundle the library and include React internals. To avoid duplicate React runtimes in the consumer app, follow one of these recommended workflows.

- Build before installing (recommended when using `file:`):

```powershell
cd path/to/fog-ui
npm run build
cd path/to/consumer-app
npm install ../fog-ui
```

- Use `npm pack` to create a tarball and install that in the consumer (reproducible and closer to how npm publishes):

```powershell
cd path/to/fog-ui
npm pack
cd path/to/consumer-app
npm install ../fog-ui-<version>.tgz
```

- If you prefer to keep a live link to your local package during development, instruct consumer Vite to avoid pre-bundling the package and to treat React as external. Add or update `consumer-app/vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Prevent Vite from pre-bundling the local package and React
    exclude: ['fog-ui', 'react', 'react-dom']
  },
  build: {
    rollupOptions: {
      // Ensure React and react-dom (and their subpaths) remain external
      external: [/^react($|\/)/, /^react-dom($|\/)/]
    }
  }
})
```

Notes:
- Installing via `file:..` does not automatically run a library build for you — run `npm run build` in the library first or use `npm pack`.
- Adding a `prepare` script in `fog-ui` (for example, `"prepare": "npm run build"`) helps ensure builds run for some install scenarios (notably git-based installs), but it may not run for plain `file:` installs; the explicit build or pack workflows above are more reliable for local testing.




---

# 📚 Feature Documentation

Comprehensive developer guides for all fog-ui features and components:

## Core Infrastructure

- [**API Module**](src/api/README.md) - HTTP client, authentication, token management, multi-service support
- [**Hooks Module**](src/hooks/README.md) - Custom hooks (useApi, useNavigationWithContext, useResolvedMenu)
- [**Context Module**](src/context/README.md) - ThemeContext provider for theme management
- [**Theme System**](src/theme/README.md) - MUI theme configuration and customization

## Component Categories

### Forms & Input
- [**Forms Module**](src/components/forms/README.md) - GenericForm, PopUpForm, SearchForm with validation, 12+ field types, API integration

### Data Display
- [**Tables**](src/components/table/README.md) - DataTable with nested rows, custom rendering, loading states
- [**Cards**](src/components/cards/README.md) - CardView, MetricCard, FilterFormCard, PermissionCard, UserGroupCard
- [**Lists**](src/components/lists/README.md) - List, AccordionList, CircularProgressList, GenericListView
- [**Charts**](src/components/charts/README.md) - GenericPieChart, TrendAnalyticsChart

### Layout & Navigation
- [**Template/Layout**](src/components/template/README.md) - PageWrapper, Topbar, ProtectedRoute
- [**Menus**](src/components/menus/README.md) - Menu configuration with dynamic route parameters

### UI Components
- [**Tabs**](src/components/tabs/README.md) - Tabbed interface with icons and custom content
- [**Toast/Notifications**](src/components/toast/README.md) - Toast system with 4 variants, 6 positions, auto-dismiss
- [**Popup/Modal**](src/components/popup/README.md) - Modal/Dialog component for content overlays
- [**ErrorBoundary**](src/components/errorBoundary/README.md) - Error handling with custom fallback UI

### Utilities
- [**Style Utilities**](src/style/muiComponentStyles/README.md) - Container styles, typography utilities, theme-based layouts

---

## Quick Navigation by Use Case

**Building a Dashboard?**
→ Start with [Tables](src/components/table/README.md), [Charts](src/components/charts/README.md), [Cards](src/components/cards/README.md)

**Creating Forms?**
→ Check [Forms Module](src/components/forms/README.md), [Popup](src/components/popup/README.md), [Toast](src/components/toast/README.md)

**Setting Up Navigation?**
→ Use [Template/Layout](src/components/template/README.md), [Menus](src/components/menus/README.md), [Hooks](src/hooks/README.md)

**Styling Your App?**
→ Reference [Theme System](src/theme/README.md), [Style Utilities](src/style/muiComponentStyles/README.md), [Context](src/context/README.md)

**Handling Errors?**
→ Implement [ErrorBoundary](src/components/errorBoundary/README.md)

**Making API Calls?**
→ Use [API Module](src/api/README.md), [Hooks](src/hooks/README.md)

---

## 9) Where to go next
- [Full Feature Docs](#-feature-documentation) - Comprehensive guides for all components
- [Implementation Guide](#implementation-guide-getting-started) - Setup and integration steps
- [Common Pitfalls](#7-common-pitfalls) - Troubleshooting and best practices
- FAQ
