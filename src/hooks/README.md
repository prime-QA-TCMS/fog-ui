# Hooks Module - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `hooks` module provides custom React hooks that simplify common application patterns including API data fetching, navigation with context management, and menu route parameter resolution.

### Key Features

- ✅ **Data Fetching** - Simplified API integration with loading/error states
- ✅ **Context Navigation** - Navigate with automatic title and context data management
- ✅ **Dynamic Menus** - Automatically resolve route parameters in menu items
- ✅ **Type Safety** - Full TypeScript support with generics
- ✅ **Production Tested** - Comprehensive test coverage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Component                           │
│                                                              │
│  useApi(apiFn, params, immediate)                           │
│    └─> Manages: loading, error, data, refetch              │
│                                                              │
│  useNavigationWithContext()                                 │
│    └─> Wraps: react-router navigate + localStorage         │
│                                                              │
│  useResolvedMenu(menuItems)                                 │
│    └─> Resolves: :param → actual values from route         │
└─────────────────────────────────────────────────────────────┘
```

---

## Hooks Reference

### 1. useApi

**Purpose:** Simplified data fetching with automatic loading and error state management.

**Signature:**
```typescript
function useApi<T>(
  apiFn?: (() => Promise<T>) | null,
  params?: any[],
  immediate?: boolean
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Parameters:**
- `apiFn` - Async function that fetches data. Can be null to skip execution.
- `params` - Array of dependencies for the API function (default: `[]`)
- `immediate` - Whether to fetch data immediately on mount (default: `true`)

**Returns:**
- `data` - The fetched data, or null if not yet loaded
- `loading` - Boolean indicating if the request is in progress
- `error` - Error object if the request failed, or null
- `refetch` - Function to manually trigger a new fetch

**Usage Example:**
```typescript
import { useApi } from 'fog-ui';
import { useAxios } from 'fog-ui';

function UserList() {
  const { api } = useAxios();
  
  // Fetch immediately on mount
  const { data, loading, error, refetch } = useApi(
    () => api.get<User[]>('/users'),
    [],
    true
  );
  
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  
  return (
    <>
      <Button onClick={refetch}>Refresh</Button>
      <List>
        {data?.map(user => (
          <ListItem key={user.id}>{user.name}</ListItem>
        ))}
      </List>
    </>
  );
}
```

**Manual Fetch Example:**
```typescript
function CreateUser() {
  const { api } = useAxios();
  const [userData, setUserData] = useState({ name: '', email: '' });
  
  // Don't fetch immediately (immediate = false)
  const { data, loading, error, refetch } = useApi(
    () => api.post<User>('/users', userData),
    [userData],
    false
  );
  
  const handleSubmit = async () => {
    await refetch(); // Manually trigger the POST request
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <TextField value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
      <Button type="submit" disabled={loading}>Create User</Button>
      {error && <Alert severity="error">{error.message}</Alert>}
      {data && <Alert severity="success">User created: {data.name}</Alert>}
    </form>
  );
}
```

---

### 2. useNavigationWithContext

**Purpose:** Navigate between pages while automatically managing page titles and context data in localStorage.

**Signature:**
```typescript
function useNavigationWithContext(): {
  navigateWithContext: (
    path: string,
    context?: NavigationContext,
    options?: NavigateOptions
  ) => void;
}

interface NavigationContext {
  title?: string;
  contextData?: Record<string, any>;
}
```

**Parameters:**
- `path` - The path to navigate to
- `context` - Optional context data:
  - `title` - Page title to set in localStorage (dispatches storage event)
  - `contextData` - Additional key-value pairs to store in localStorage
- `options` - Standard react-router NavigateOptions (replace, state, etc.)

**Usage Example:**
```typescript
import { useNavigationWithContext } from 'fog-ui';

function ProjectList() {
  const { navigateWithContext } = useNavigationWithContext();
  
  const handleProjectClick = (project: Project) => {
    navigateWithContext(
      `/projects/${project.id}`,
      {
        title: project.name,
        contextData: {
          projectOwner: project.owner,
          projectStatus: project.status
        }
      }
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

**How It Works:**
1. Stores `title` in `localStorage.setItem('pageTitle', title)`
2. Stores each `contextData` entry as separate localStorage items
3. Dispatches storage event for cross-component communication
4. Navigates using react-router's navigate function
5. Components like PageWrapper can listen for storage events to update the UI

---

### 3. useResolvedMenu

**Purpose:** Automatically resolves route parameters (`:param`) in menu item paths using current route values.

**Signature:**
```typescript
function useResolvedMenu(
  menuItems: Record<string, MenuItem[]>
): Record<string, MenuItem[]>

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
```

**Parameters:**
- `menuItems` - Object keyed by section name, containing arrays of menu items

**Returns:**
- Resolved menu items with all `:param` placeholders replaced with actual values

**Usage Example:**
```typescript
import { useResolvedMenu } from 'fog-ui';
import { useParams } from 'react-router-dom';

function ProjectSidebar() {
  // Current route: /projects/123/suites/456
  const rawMenuItems = {
    main: [
      { label: 'Overview', path: '/projects/:projectId' },
      { label: 'Suites', path: '/projects/:projectId/suites' },
      { label: 'Current Suite', path: '/projects/:projectId/suites/:suiteId' },
      { label: 'Settings', path: '/projects/:projectId/settings' }
    ],
    admin: [
      { label: 'Users', path: '/projects/:projectId/users' }
    ]
  };
  
  const resolvedMenuItems = useResolvedMenu(rawMenuItems);
  
  // Result:
  // {
  //   main: [
  //     { label: 'Overview', path: '/projects/123' },
  //     { label: 'Suites', path: '/projects/123/suites' },
  //     { label: 'Current Suite', path: '/projects/123/suites/456' },
  //     { label: 'Settings', path: '/projects/123/settings' }
  //   ],
  //   admin: [
  //     { label: 'Users', path: '/projects/123/users' }
  //   ]
  // }
  
  return (
    <nav>
      {Object.entries(resolvedMenuItems).map(([section, items]) => (
        <div key={section}>
          <Typography variant="h6">{section}</Typography>
          <List>
            {items.map(item => (
              <ListItem key={item.path} component={Link} to={item.path}>
                {item.icon}
                {item.label}
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </nav>
  );
}
```

---

## Best Practices

### useApi

1. **Dependency Management:** Include all variables used in `apiFn` in the `params` array to trigger re-fetches when they change
2. **Error Handling:** Always check for `error` state and display appropriate feedback
3. **Loading States:** Show loading indicators to improve UX during data fetching
4. **Manual Fetch:** Use `immediate: false` for POST/PUT/DELETE operations that shouldn't run on mount

### useNavigationWithContext

1. **Page Titles:** Always set meaningful `title` values for better user navigation
2. **Context Data:** Only store serializable data (no functions or circular references)
3. **localStorage Cleanup:** Clear old context data when it's no longer needed
4. **Storage Events:** PageWrapper listens for storage events, so title updates are automatic

### useResolvedMenu

1. **Memoization:** The hook uses `useMemo` internally, so pass stable menu structures
2. **Route Structure:** Ensure your route param names match the `:param` placeholders
3. **Nested Routes:** Works with deeply nested routes like `/a/:id/b/:bid/c/:cid`
4. **Missing Params:** Unresolved params remain as-is (e.g., `:unknownParam`)

---

## TypeScript Types

```typescript
// useApi
type UseApiReturn<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// useNavigationWithContext
interface NavigationContext {
  title?: string;
  contextData?: Record<string, any>;
}

interface NavigationWithContextReturn {
  navigateWithContext: (
    path: string,
    context?: NavigationContext,
    options?: NavigateOptions
  ) => void;
}

// useResolvedMenu
interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
```

---

## Testing

All hooks are thoroughly tested with comprehensive test suites:

- **useApi**: 15+ tests covering loading states, error handling, refetch, immediate vs manual fetch
- **useNavigationWithContext**: 10+ tests covering navigation, localStorage integration, storage events
- **useResolvedMenu**: 8+ tests covering parameter resolution, nested params, missing params

Run tests:
```bash
npm test -- src/hooks/__tests__
```

---

## Common Patterns

### Combining Hooks

```typescript
function ProjectDetails() {
  const { navigateWithContext } = useNavigationWithContext();
  const { api } = useAxios();
  const { projectId } = useParams();
  
  const { data: project, loading } = useApi(
    () => api.get<Project>(`/projects/${projectId}`),
    [projectId]
  );
  
  const menuItems = {
    main: [
      { label: 'Overview', path: '/projects/:projectId' },
      { label: 'Settings', path: '/projects/:projectId/settings' }
    ]
  };
  
  const resolvedMenu = useResolvedMenu(menuItems);
  
  const handleNavigate = (path: string) => {
    navigateWithContext(path, { title: project?.name });
  };
  
  return (
    <>
      <Sidebar menu={resolvedMenu} onNavigate={handleNavigate} />
      <main>{loading ? <CircularProgress /> : <ProjectContent project={project} />}</main>
    </>
  );
}
```

---

## Troubleshooting

### useApi

**Issue:** Data not refetching when params change  
**Solution:** Ensure all variables used in `apiFn` are included in the `params` array

**Issue:** Infinite loop  
**Solution:** Avoid objects/arrays in `params` unless they're stable references (use `useMemo`)

### useNavigationWithContext

**Issue:** Title not updating in PageWrapper  
**Solution:** Ensure PageWrapper is mounted and listening for storage events

**Issue:** Context data not persisting  
**Solution:** Check that values are JSON serializable (no functions, circular refs)

### useResolvedMenu

**Issue:** Params not being resolved  
**Solution:** Ensure param names in paths match the route param names exactly

**Issue:** Menu items changing too frequently  
**Solution:** Memoize your `menuItems` object with `useMemo`
