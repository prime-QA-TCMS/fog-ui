# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.11] - 2026-01-19

### Added

#### Components

##### ErrorBoundary
- New error boundary component for catching rendering errors in child components
- Supports custom fallback UI (component or function)
- Error logging callback for external services (Sentry, etc.)
- Reset functionality with customizable button text
- Optional console logging in development mode
- 100% test coverage (30 tests)
- Full TypeScript support with generics
- Accessible with ARIA labels

##### Toast/Notification System
- Complete global toast notification system with ToastProvider context
- **Toast Component** - MUI Alert wrapper with close and action buttons
- **ToastContainer** - Renders toasts grouped by position (6 positions: top/bottom × left/center/right)
- **ToastProvider** - Context provider with auto-dismiss timer management
- **useToast Hook** - Convenient API for displaying toasts
  - Methods: `success()`, `error()`, `warning()`, `info()`, `show()`, `remove()`, `clearAll()`
  - Support for custom duration, position, and action buttons
- 4 toast variants with distinct styling (success, error, warning, info)
- 6 positioning options for flexible UI placement
- Auto-dismiss with configurable timeout
- Action buttons with callbacks
- Queue management for multiple toasts
- 97.64% test coverage (76 tests total)
  - Toast: 90% coverage (17 tests)
  - ToastProvider: 100% coverage (26 tests)
  - useToast: 100% coverage (23 tests)
  - ToastContainer: 95.83% coverage (10 tests)
- Full TypeScript support

##### Container Styles (Expanded)
- Added 4 new container styles to `muiComponentStyles/containerStyles.ts`:
  - `loginContainer` - Centered flex layout for login/auth pages
  - `contentContainer` - Content area with padding and scrollable overflow
  - `wrapContainer` - Flex wrap container with theme-based gap spacing
  - `halfScreenContainer` - Two-column grid layout (50/50 split) with responsive stacking
- Existing styles maintained: `pageContainer`, `DrawerContainer`
- 100% test coverage (40 tests)
- All styles fully theme-integrated and responsive

#### Documentation

##### Developer README Files (16 total)
Complete developer documentation for all features with architecture diagrams, usage examples, best practices, and troubleshooting:

**Core Infrastructure:**
- [API Module](src/api/README.md) - HTTP client, authentication, token management
- [Hooks Module](src/hooks/README.md) - useApi, useNavigationWithContext, useResolvedMenu
- [Context Module](src/context/README.md) - ThemeContext provider
- [Theme System](src/theme/README.md) - MUI theme configuration

**Components:**
- [Forms Module](src/components/forms/README.md) - GenericForm, PopUpForm, SearchForm
- [Tables](src/components/table/README.md) - DataTable with nested rows
- [Cards](src/components/cards/README.md) - Card components and layouts
- [Lists](src/components/lists/README.md) - List, AccordionList, CircularProgressList
- [Charts](src/components/charts/README.md) - Pie charts and trend analytics
- [Toast/Notifications](src/components/toast/README.md) - Complete toast system docs
- [Template/Layout](src/components/template/README.md) - PageWrapper, Topbar, ProtectedRoute
- [Tabs](src/components/tabs/README.md) - Tabbed interface
- [Popup/Modal](src/components/popup/README.md) - Modal/Dialog component
- [ErrorBoundary](src/components/errorBoundary/README.md) - Error handling
- [Menus](src/components/menus/README.md) - Menu configuration

**Utilities:**
- [Style Utilities](src/style/muiComponentStyles/README.md) - Container and typography styles

##### Root README Updates
- Added comprehensive "Feature Documentation" section
- Quick navigation guide organized by component category
- Use case-based quick links (Dashboard, Forms, Navigation, etc.)
- Improved table of contents for easier navigation

### Changed

#### Exports (index.ts)
- Added Toast system exports:
  - `ToastProvider`
  - `ToastContext`
  - `Toast`
  - `ToastContainer`
  - `useToast`
  - Toast types: `Toast`, `ToastVariant`, `ToastPosition`, `ToastOptions`, `ToastContextValue`
- Added ErrorBoundary export with all types
- Added container style exports:
  - `loginContainer`
  - `contentContainer`
  - `wrapContainer`
  - `halfScreenContainer`

#### Documentation
- Updated `FOGUI-EXTRACTION.md` to reflect new components and progress
  - Phase 3 status: 66% complete (2 of 3 items)
  - Notifications section now includes 4 toast components
  - Styles section includes all 6 container styles

### Fixed

- Toast system: Fixed style queries in tests to check rendered content instead of sx props
- Container styles: Fixed type definitions for theme.spacing() return values
- Toast tests: Resolved TypeScript type issues with setTimeout timers

### Performance

- Toast system uses efficient Map-based timer management
- Container styles use memoized theme calculations
- ErrorBoundary uses lifecycle methods for minimal re-renders

### Test Coverage

- **ErrorBoundary**: 100% coverage (30 tests)
- **Toast System**: 97.64% overall
  - Toast: 90%
  - ToastContainer: 95.83%
  - ToastProvider: 100%
  - useToast: 100%
- **Container Styles**: 100% coverage (40 tests)

### Breaking Changes

None - all changes are backwards compatible.

### Dependencies

No new peer dependencies added. All new features use existing dependencies:
- React 18+
- Material-UI v5
- TypeScript 4.9+

### Notes

- Phase 3 (Quality of Life Features) now 66% complete
- Remaining Phase 3 item: AuthPage component (estimated 10-12 hours)
- All new components follow established patterns and coding standards
- Comprehensive test coverage ensures stability and maintainability
- Developer documentation provides everything needed for integration and customization

---

## [0.1.10] - 2026-01-18

### Added

- Previous release features and components

---

## Release Notes Format

For each release, we document:
- **Added** - New features, components, and functionality
- **Changed** - Modifications to existing features
- **Fixed** - Bug fixes and corrections
- **Deprecated** - Features marked for removal
- **Removed** - Features that were removed
- **Performance** - Performance improvements
- **Security** - Security-related changes
- **Test Coverage** - Testing improvements and coverage metrics
- **Breaking Changes** - Any changes that break backwards compatibility
- **Dependencies** - New or updated dependencies

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

---

## Support

For questions or issues related to changes in specific versions, please refer to:
- Feature documentation in respective README.md files
- Git history for implementation details
- Issue tracker for bug reports and discussions
