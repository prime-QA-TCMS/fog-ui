# Template/Layout Components - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `template` module provides layout components for building consistent application structures. Includes PageWrapper (main layout with sidebar), Topbar (navigation header), and ProtectedRoute (authentication guard).

### Key Features

- ✅ **PageWrapper** - Complete layout with sidebar navigation and dynamic menu
- ✅ **Topbar** - Customizable top navigation bar
- ✅ **ProtectedRoute** - Authentication-based route protection
- ✅ **Dynamic Menus** - Automatically resolves route parameters in menu paths
- ✅ **Responsive** - Mobile-friendly layouts
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Production Tested** - Comprehensive test coverage

---

## Components

### 1. PageWrapper

**Purpose:** Main application layout with sidebar navigation and content area.

**Props:**
```typescript
interface PageWrapperProps {
  children: ReactNode;              // Main content
  menuItems: Record<string, MenuItem[]>;  // Sidebar menu structure
}

interface MenuItem {
  label: string;                    // Menu item text
  path: string;                     // Navigation path (supports :params)
  icon?: ReactNode;                 // Optional icon
}
```

**Features:**
- Fixed sidebar with navigation menu
- Automatic route parameter resolution (`:projectId` → actual ID)
- Dynamic page title from localStorage
- Responsive drawer
- Material-UI integration

**Usage:**
```typescript
import { PageWrapper } from 'fog-ui';
import { Home, Settings, Users } from '@mui/icons-material';

function App() {
  const menuItems = {
    main: [
      { label: 'Home', path: '/', icon: <Home /> },
      { label: 'Projects', path: '/projects', icon: <Folder /> },
      {
        label: 'Project Details',
        path: '/projects/:projectId',  // Auto-resolved
        icon: <Info />
      },
    ],
    settings: [
      { label: 'Settings', path: '/settings', icon: <Settings /> },
      { label: 'Users', path: '/users', icon: <Users /> },
    ],
  };
  
  return (
    <PageWrapper menuItems={menuItems}>
      <YourMainContent />
    </PageWrapper>
  );
}
```

**With Dynamic Title:**
```typescript
import { useNavigationWithContext } from 'fog-ui';

function ProjectList() {
  const { navigateWithContext } = useNavigationWithContext();
  
  const handleProjectClick = (project: Project) => {
    navigateWithContext(
      `/projects/${project.id}`,
      { title: project.name }  // Updates PageWrapper title
    );
  };
  
  return (
    <List>
      {projects.map(project => (
        <ListItem key={project.id} onClick={() => handleProjectClick(project)}>
          {project.name}
        </ListItem>
      ))}
    </List>
  );
}
```

---

### 2. Topbar

**Purpose:** Application top navigation bar with branding and actions.

**Props:**
```typescript
interface TopbarProps {
  title?: string;                   // App title
  logo?: ReactNode;                 // Custom logo
  actions?: ReactNode;              // Right-side actions (buttons, menus)
  showMenuButton?: boolean;         // Show mobile menu toggle
  onMenuClick?: () => void;         // Menu button callback
}
```

**Usage:**
```typescript
import { Topbar } from 'fog-ui';
import { IconButton, Avatar } from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';

function AppLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const actions = (
    <>
      <IconButton color="inherit">
        <Notifications />
      </IconButton>
      <IconButton 
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
  
  return (
    <Topbar
      title="My Application"
      logo={<img src="/logo.png" alt="Logo" height={32} />}
      actions={actions}
    />
  );
}
```

---

### 3. ProtectedRoute

**Purpose:** Route wrapper that redirects unauthenticated users.

**Props:**
```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;         // Authentication status
  redirectPath?: string;            // Redirect destination (default: '/login')
  fallback?: ReactNode;             // Loading UI while checking auth
}
```

**Usage:**
```typescript
import { ProtectedRoute } from 'fog-ui';
import { Routes, Route } from 'react-router-dom';

function App() {
  const { user, loading } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            isAuthenticated={!!user}
            redirectPath="/login"
            fallback={<CircularProgress />}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            isAuthenticated={user?.role === 'admin'}
            redirectPath="/dashboard"
          >
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

## Complete Layout Example

```typescript
import { PageWrapper, Topbar, ProtectedRoute } from 'fog-ui';
import { Routes, Route } from 'react-router-dom';
import {
  Home, Folder, Settings, Users, Analytics
} from '@mui/icons-material';

function App() {
  const { user } = useAuth();
  
  const menuItems = {
    main: [
      { label: 'Home', path: '/', icon: <Home /> },
      { label: 'Projects', path: '/projects', icon: <Folder /> },
      { label: 'Project Details', path: '/projects/:projectId', icon: <Info /> },
      { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
    ],
    admin: [
      { label: 'Users', path: '/users', icon: <Users /> },
      { label: 'Settings', path: '/settings', icon: <Settings /> },
    ],
  };
  
  return (
    <ProtectedRoute isAuthenticated={!!user} redirectPath="/login">
      <PageWrapper menuItems={menuItems}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </PageWrapper>
    </ProtectedRoute>
  );
}
```

---

## Best Practices

### 1. Menu Organization
Group related menu items by section:

```typescript
// ✅ Good
const menuItems = {
  projects: [
    { label: 'All Projects', path: '/projects' },
    { label: 'My Projects', path: '/projects/my' },
  ],
  admin: [
    { label: 'Users', path: '/admin/users' },
    { label: 'Settings', path: '/admin/settings' },
  ],
};

// ❌ Bad - No organization
const menuItems = {
  all: [
    { label: 'Projects', path: '/projects' },
    { label: 'Users', path: '/admin/users' },
    { label: 'My Projects', path: '/projects/my' },
  ],
};
```

### 2. Route Parameters
Use route parameters for dynamic paths:

```typescript
// ✅ Good - Will auto-resolve to actual IDs
{ label: 'Project Details', path: '/projects/:projectId' }
{ label: 'Suite Details', path: '/projects/:projectId/suites/:suiteId' }

// ❌ Bad - Static path
{ label: 'Project 123', path: '/projects/123' }
```

### 3. Protected Routes
Apply protection at appropriate levels:

```typescript
// ✅ Good - Protect entire section
<ProtectedRoute isAuthenticated={!!user}>
  <PageWrapper>
    <Routes>{/* All routes */}</Routes>
  </PageWrapper>
</ProtectedRoute>

// ❌ Bad - Protect each route individually
<Routes>
  <Route path="/a" element={<ProtectedRoute><A /></ProtectedRoute>} />
  <Route path="/b" element={<ProtectedRoute><B /></ProtectedRoute>} />
</Routes>
```

### 4. Page Titles
Update titles dynamically for better UX:

```typescript
const { navigateWithContext } = useNavigationWithContext();

// ✅ Good
navigateWithContext('/projects/123', { title: 'Project Alpha' });

// ❌ Bad - No context
navigate('/projects/123');
```

---

## Testing

The template components are thoroughly tested:

- PageWrapper menu rendering and navigation
- Route parameter resolution
- Dynamic page title updates
- ProtectedRoute redirects
- Topbar actions and interactions

Run tests:
```bash
npm test -- src/components/template/__tests__
```

---

## Troubleshooting

**Issue:** Menu items not resolving route parameters  
**Solution:** Ensure PageWrapper uses useResolvedMenu hook internally

**Issue:** Page title not updating  
**Solution:** Use navigateWithContext hook with title in context

**Issue:** ProtectedRoute not redirecting  
**Solution:** Verify isAuthenticated prop is boolean and redirectPath is valid

**Issue:** Sidebar not showing on mobile  
**Solution:** Check Material-UI Drawer responsive settings
