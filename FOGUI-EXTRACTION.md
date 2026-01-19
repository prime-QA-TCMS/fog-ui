# FOG-UI Developer Guide

**Version:** 0.2.0  
**Last Updated:** January 19, 2026  
**Purpose:** Guide for adding new generic, reusable components to the fog-ui package

---

## 📖 About This Guide

This document serves as a **step-by-step guide** for developers contributing to the fog-ui package. It outlines:
- ✅ What's already implemented
- 📝 What still needs to be added
- 🛠️ How to add new components, hooks, and utilities
- ✅ Quality standards and checklist
- 🧪 Testing requirements

---

## 🎯 Package Philosophy

**Generic First:** Only add components that can be used in ANY React application (e-commerce, CRM, analytics, dashboards, etc.)  
**Not Product-Specific:** Avoid domain-specific logic (QA/Testing, E-commerce orders, etc.)  
**Configurable:** Make everything customizable via props  
**Type-Safe:** Full TypeScript support with generics  
**Well-Tested:** Minimum 80% code coverage  
**Documented:** JSDoc comments and usage examples

## 📦 Current Package Status

### ✅ Fully Implemented & Exported

#### **API Infrastructure** (Phase 1 - COMPLETE)
- ✅ **AxiosHelper** - Type-safe axios wrapper
- ✅ **createAuthenticatedClient** - JWT authentication with auto-refresh
- ✅ **AxiosProvider** - React context for multi-service API management
- ✅ **useAxios** - Hook to access all services
- ✅ **useService** - Hook to access specific service
- ✅ **API Types** - Complete TypeScript definitions
- ✅ **API Documentation** - Comprehensive README.md in src/api/
- ✅ **Test Coverage** - 100% coverage (146+ tests)

#### **Layout Components**
- ✅ **PageWrapper** - Layout wrapper with menu and navigation
- ✅ **Topbar** - Application header with title and actions
- ✅ **ProtectedRoute** - Authentication-gated routing with role-based access

#### **Display Components**
- ✅ **DataTable** - Advanced data table with sorting/filtering
- ✅ **DataRow** - Table row component
- ✅ **DataLoading** - Loading state indicator
- ✅ **NestedTable** - Expandable nested tables
- ✅ **TableHeader** - Table header component
- ✅ **NoDataTableRow** - Empty state for tables

#### **List Components**
- ✅ **List** (GenericList) - Configurable list component
- ✅ **AccordionList** - Collapsible accordion lists
- ✅ **CircularProgressList** - List with loading states
- ✅ **GenericListView** - Data fetching list pattern with loading/error states

#### **Form Components**
- ✅ **Form** (GenericForm) - Dynamic form builder
- ✅ **PopUpForm** - Form in modal dialog
- ✅ **SearchForm** - Search input with filtering
- ✅ **Popup** - Modal/dialog component

#### **Chart Components**
- ✅ **TrendAnalyticsChart** - Time-series trend charts
- ✅ **GenericPieChart** - Pie/donut charts

#### **Card Components**
- ✅ **CardListContainer** - Grid container for cards
- ✅ **CardView** - Generic card layout
- ✅ **FilterFormCard** - Card with filter form
- ✅ **PermissionCard** - Permission display card
- ✅ **UserGroupCard** - User group card
- ✅ **MetricCardGrid** - Metric/stat cards grid

#### **Tab Components**
- ✅ **Tabs** (GenericTabs) - Tab navigation

#### **Context & Theming**
- ✅ **ThemeContext** - Theme management
- ✅ **Custom MUI Theme** - Pre-configured Material-UI theme

#### **Hooks**
- ✅ **useResolvedMenu** - Menu resolution with route param substitution
- ✅ **useApi** - Data fetching with loading/error states
- ✅ **useNavigationWithContext** - Navigation with automatic breadcrumb/title sync

#### **Error Handling**
- ✅ **ErrorBoundary** - React error boundary with customizable fallback UI, error logging, and reset functionality

#### **Notifications**
- ✅ **ToastProvider** - Context provider for global toast notification management
- ✅ **ToastContainer** - Container component for rendering toasts at specified positions
- ✅ **Toast** - Individual toast notification with Material-UI Alert
- ✅ **useToast** - Hook for displaying toast notifications (success, error, warning, info)

#### **Styles**
- ✅ **pageContainer** - Full-page layout style
- ✅ **DrawerContainer** - Side drawer style
- ✅ **contentContainer** - Standard content container with padding and scrolling
- ✅ **wrapContainer** - Flexbox wrap container with consistent spacing
- ✅ **halfScreenContainer** - Grid layout for two-column split content
- ✅ **metricCardComponentStyle** - Metric card grid style
- ✅ **pageTitle** - Page title typography
- ✅ **sectionTitle** - Section heading typography
- ✅ **bodyText** - Body text typography
- ✅ **captionText** - Caption/helper text typography

#### **Types**
- ✅ Complete TypeScript definitions for all components
- ✅ Exported via `export * from './types'`

---

## 📦 Current Package Structure

```
fog-ui/
├── src/
│   ├── api/                        ✅ COMPLETE
│   │   ├── axiosHelper.ts
│   │   ├── createAuthenticatedClient.ts
│   │   ├── AxiosProvider.tsx
│   │   ├── types.ts
│   │   ├── README.md              (Developer documentation)
│   │   └── __tests__/             (146 tests, 100% coverage)
│   │
│   ├── components/                 ✅ COMPLETE
│   │   ├── cards/                  (7 card components)
│   │   ├── charts/                 (2 chart components)
│   │   ├── forms/                  (3 form components)
│   │   ├── lists/                  (3 list components)
│   │   ├── popup/                  (1 popup component)
│   │   ├── table/                  (6 table components)
│   │   ├── tabs/                   (1 tab component)
│   │   └── template/               (2 layout components)
│   │
│   ├── context/                    ✅ COMPLETE
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/                      🚧 PARTIAL
│   │   ├── useResolvedMenu.ts     (needs enhancement)
│   │   └── useApi.ts              ✅ COMPLETE
│   │
│   ├── style/                      🚧 PARTIAL
│   │   └── muiComponentStyles/
│   │       ├── containerStyles.ts (2 of 6 styles)
│   │       ├── sharedComponentStyles.ts ✅
│   │       └── typographyStyles.ts ❌ NOT YET
│   │
│   ├── theme/                      ✅ COMPLETE
│   │   ├── index.ts
│   │   └── theme.ts
│   │
│   ├── types/                      ✅ COMPLETE
│   │   └── index.ts
│   │
│   └── index.ts                    ✅ COMPLETE (all exports)
```

---

## ✅ Quality Checklist

Before marking any task as complete, ensure:

- [ ] **No hardcoded product-specific logic**
- [ ] **Fully configurable via props/parameters**
- [ ] **Complete TypeScript types**
- [ ] **JSDoc comments on all public APIs**
- [ ] **Unit tests with >80% coverage**
- [ ] **Integration tests for complex features**
- [ ] **All tests passing**: `npm test`
- [ ] **Build succeeds**: `npm run build`
- [ ] **Lint passes**: `npm run lint`
- [ ] **Exported from src/index.ts**
- [ ] **Usage examples in documentation**
- [ ] **CHANGELOG.md updated**
- [ ] **Tested in consumer-app**
- [ ] **No breaking changes (or documented)**
- [ ] **Follows existing code patterns**
- [ ] **Peer review completed**

---

## 📋 Checklist Before Each Release

- [ ] All TypeScript types exported
- [ ] Zero product-specific logic
- [ ] JSDoc comments on public APIs
- [ ] Unit tests with >80% coverage
- [ ] Integration tests for complex features
- [ ] README.md updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped appropriately
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] Lint passes: `npm run lint`
- [ ] Consumer app tested locally
- [ ] Examples updated

---

## 📊 Testing Standards

### Coverage Requirements

| Item Type | Minimum Coverage | Target Coverage |
|-----------|------------------|-----------------|
| Components | 80% | 95% |
| Hooks | 85% | 100% |
| Utilities | 90% | 100% |
| API Infrastructure | 95% | 100% |

### Test Categories

#### Unit Tests
- Test individual components in isolation
- Mock all external dependencies
- Test all props/parameters
- Test edge cases (null, undefined, empty arrays)
- Test error states

#### Integration Tests
- Test component interactions
- Test with real context providers
- Test routing behavior
- Test form submissions

### Test Example Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  const defaultProps = { prop1: 'value1' };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders with default props', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interactions', () => {
    const onClick = vi.fn();
    render(<ComponentName {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  
  it('handles edge cases', () => {
    render(<ComponentName {...defaultProps} data={null} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
```

---

## 🚀 Release Process

### Pre-Release Checklist

- [ ] All tests passing
- [ ] Coverage >80% for new code
- [ ] No TypeScript errors
- [ ] JSDoc comments complete
- [ ] README/CHANGELOG updated
- [ ] `npm run build` succeeds
- [ ] Tested in consumer-app
- [ ] Version bumped appropriately

---

## 💡 Best Practices

### Code Style
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Use named exports (not default exports)
- Keep components small (<200 lines)

### TypeScript
- Always define prop types
- Use generics for reusable components
- Avoid `any` (use `unknown` if needed)
- Document complex types with comments

### Testing
- Test user behavior, not implementation
- Use semantic queries (`getByRole`, `getByLabelText`)
- Mock at the boundary (API calls, router)
- Test accessibility (aria labels, keyboard nav)

---

## 📊 Development Roadmap

### ✅ Phase 1 - API Infrastructure: **100% COMPLETE**
- API: Complete (146+ tests, 100% coverage) ✅

### ✅ Phase 2 - Advanced Components: **100% COMPLETE**
- ProtectedRoute: Complete (25 tests, 100% coverage) ✅
- GenericListView: Complete (21 tests, 100% coverage) ✅
- useNavigationWithContext: Complete (29 tests, 100% coverage) ✅

### 🟡 Phase 3 - Quality of Life: **66% COMPLETE**
- ErrorBoundary: Complete (30 tests, 100% coverage) ✅
- Toast/Notification system: Complete (76 tests, 97.6% coverage) ✅
- AuthPage ❌

---

**Last Updated:** January 19, 2026  
**Version:** 0.2.0  
**Next Review:** After completing Phase 3

---
