# Menus Module - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `menus` module provides menu configuration and utilities for creating navigation menus with support for dynamic route parameters.

### Key Features

- ✅ **Menu Configuration** - Define menus with labels, paths, and icons
- ✅ **Route Parameters** - Automatically resolves :param placeholders
- ✅ **Nested Menus** - Support for sub-menus and sections
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Integration** - Works with PageWrapper and useResolvedMenu

---

## Menu Structure

```typescript
interface MenuItem {
  label: string;                    // Display text
  path: string;                     // Navigation path (supports :params)
  icon?: ReactNode;                 // Optional icon
  children?: MenuItem[];            // Nested menu items
  disabled?: boolean;               // Disable menu item
}

type MenuConfig = Record<string, MenuItem[]>;
```

---

## Usage

### Basic Menu Configuration

```typescript
import { Home, Settings, Users, Folder } from '@mui/icons-material';

export const mainMenu: MenuConfig = {
  main: [
    {
      label: 'Home',
      path: '/',
      icon: <Home />,
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: <Folder />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
    },
  ],
  admin: [
    {
      label: 'Users',
      path: '/admin/users',
      icon: <Users />,
    },
  ],
};
```

---

### With Dynamic Routes

```typescript
export const projectMenu: MenuConfig = {
  project: [
    {
      label: 'Overview',
      path: '/projects/:projectId',
      icon: <Dashboard />,
    },
    {
      label: 'Tasks',
      path: '/projects/:projectId/tasks',
      icon: <Assignment />,
    },
    {
      label: 'Settings',
      path: '/projects/:projectId/settings',
      icon: <Settings />,
    },
  ],
};

// When used with useResolvedMenu, :projectId is automatically replaced
// Route: /projects/123
// Resolved: /projects/123, /projects/123/tasks, /projects/123/settings
```

---

### With PageWrapper

```typescript
import { PageWrapper } from 'fog-ui';
import { mainMenu } from './menus';

function App() {
  return (
    <PageWrapper menuItems={mainMenu}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </PageWrapper>
  );
}
```

---

### Nested Menus

```typescript
export const nestedMenu: MenuConfig = {
  main: [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: <Folder />,
      children: [
        { label: 'All Projects', path: '/projects' },
        { label: 'My Projects', path: '/projects/my' },
        { label: 'Archived', path: '/projects/archived' },
      ],
    },
  ],
};
```

---

### Conditional Menu Items

```typescript
import { useAuth } from './hooks/useAuth';

function AppMenu() {
  const { user } = useAuth();
  
  const menu: MenuConfig = {
    main: [
      { label: 'Home', path: '/', icon: <Home /> },
      { label: 'Projects', path: '/projects', icon: <Folder /> },
    ],
    ...(user?.role === 'admin' && {
      admin: [
        { label: 'Users', path: '/admin/users', icon: <Users /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings /> },
      ],
    }),
  };
  
  return <PageWrapper menuItems={menu}>{/* ... */}</PageWrapper>;
}
```

---

## Complete Example

```typescript
import { 
  Home, 
  Folder, 
  Assignment, 
  People, 
  Settings, 
  BarChart,
  Security 
} from '@mui/icons-material';

// Main application menu
export const appMenu: MenuConfig = {
  navigation: [
    {
      label: 'Dashboard',
      path: '/',
      icon: <Home />,
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: <Folder />,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: <BarChart />,
    },
  ],
  
  project: [
    {
      label: 'Project Overview',
      path: '/projects/:projectId',
      icon: <Folder />,
    },
    {
      label: 'Tasks',
      path: '/projects/:projectId/tasks',
      icon: <Assignment />,
    },
    {
      label: 'Team',
      path: '/projects/:projectId/team',
      icon: <People />,
    },
    {
      label: 'Settings',
      path: '/projects/:projectId/settings',
      icon: <Settings />,
    },
  ],
  
  admin: [
    {
      label: 'User Management',
      path: '/admin/users',
      icon: <People />,
    },
    {
      label: 'Security',
      path: '/admin/security',
      icon: <Security />,
    },
    {
      label: 'System Settings',
      path: '/admin/settings',
      icon: <Settings />,
    },
  ],
};

// Usage
function App() {
  const { user } = useAuth();
  const { projectId } = useParams();
  
  // Filter menu based on context
  const currentMenu = projectId
    ? { navigation: appMenu.navigation, project: appMenu.project }
    : { navigation: appMenu.navigation };
  
  // Add admin menu if user is admin
  const finalMenu = user?.role === 'admin'
    ? { ...currentMenu, admin: appMenu.admin }
    : currentMenu;
  
  return (
    <PageWrapper menuItems={finalMenu}>
      <Routes>
        {/* Routes */}
      </Routes>
    </PageWrapper>
  );
}
```

---

## Best Practices

### 1. Menu Organization
Group related items by section:

```typescript
// ✅ Good - Clear sections
{
  main: [ /* primary navigation */ ],
  project: [ /* project-specific */ ],
  admin: [ /* admin tools */ ],
}

// ❌ Bad - Everything mixed
{
  all: [ /* all items together */ ]
}
```

### 2. Icon Consistency
Use consistent icon style:

```typescript
// ✅ Good - Material Icons throughout
{ label: 'Home', icon: <Home /> }
{ label: 'Settings', icon: <Settings /> }

// ❌ Bad - Mixed icon libraries
{ label: 'Home', icon: <MaterialHome /> }
{ label: 'Settings', icon: <FontAwesomeSettings /> }
```

### 3. Route Parameters
Use consistent parameter names:

```typescript
// ✅ Good - Consistent naming
'/projects/:projectId'
'/projects/:projectId/tasks/:taskId'

// ❌ Bad - Inconsistent
'/projects/:id'
'/projects/:projectId/tasks/:tid'
```

### 4. Conditional Menus
Show only relevant menu items:

```typescript
// ✅ Good - Show based on user role/context
const menu = {
  main: [...],
  ...(isAdmin && { admin: [...] }),
  ...(hasProject && { project: [...] }),
};

// ❌ Bad - Show everything, disable items
const menu = {
  main: [...],
  admin: [...].map(item => ({ ...item, disabled: !isAdmin })),
};
```

---

## Integration with useResolvedMenu

The `useResolvedMenu` hook automatically resolves route parameters in menu paths:

```typescript
import { useResolvedMenu } from 'fog-ui';
import { useParams } from 'react-router-dom';

function Sidebar() {
  const params = useParams();  // { projectId: '123', taskId: '456' }
  
  const menu = {
    project: [
      { label: 'Overview', path: '/projects/:projectId' },
      { label: 'Task', path: '/projects/:projectId/tasks/:taskId' },
    ],
  };
  
  const resolved = useResolvedMenu(menu);
  // Result:
  // {
  //   project: [
  //     { label: 'Overview', path: '/projects/123' },
  //     { label: 'Task', path: '/projects/123/tasks/456' },
  //   ]
  // }
  
  return <MenuList items={resolved.project} />;
}
```

---

## Testing

Menu configurations should be tested for:
- Correct structure and types
- Route parameter format
- Conditional rendering logic
- Icon imports

---

## Troubleshooting

**Issue:** Route parameters not resolving  
**Solution:** Ensure useResolvedMenu is used and parameter names match route

**Issue:** Menu items not showing  
**Solution:** Check conditional logic and ensure menu config is properly structured

**Issue:** Icons not displaying  
**Solution:** Verify icon imports and that ReactNode is properly passed
