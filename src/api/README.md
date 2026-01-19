# API Module - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Quick Start](#quick-start)
5. [Usage Guides](#usage-guides)
6. [Advanced Patterns](#advanced-patterns)
7. [TypeScript Types](#typescript-types)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The `api` module provides a comprehensive, production-ready HTTP client infrastructure for React applications. It handles authentication, token refresh, multi-service architecture, and provides a clean, type-safe API for making HTTP requests.

### Key Features

- ✅ **Automatic Token Management** - Handles JWT token injection and refresh automatically
- ✅ **401 Handling** - Automatically refreshes tokens and retries failed requests
- ✅ **Multi-Service Support** - Manage multiple API services with different configurations
- ✅ **Request Queuing** - Queues requests during token refresh to prevent race conditions
- ✅ **Storage Flexibility** - Supports localStorage, sessionStorage, and in-memory storage
- ✅ **Type Safety** - Full TypeScript support with generics
- ✅ **React Integration** - Context provider and hooks for easy integration
- ✅ **Configurable** - Extensive configuration options for customization
- ✅ **Production Tested** - 100% test coverage with comprehensive test suites

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │            AxiosProvider (Context)                  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Service 1 (AxiosHelper + Auth Client)      │  │    │
│  │  │  Service 2 (AxiosHelper + Auth Client)      │  │    │
│  │  │  Service 3 (AxiosHelper)                     │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Components use:                                            │
│  - useAxios() → Access all services                        │
│  - useService(name) → Access specific service              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    Backend API 1       Backend API 2       Backend API 3
  (Authenticated)     (Authenticated)     (Public)
```

### Component Hierarchy

1. **AxiosProvider** (Top Level)
   - Creates and manages service instances
   - Provides context to child components
   - Handles service lifecycle

2. **createAuthenticatedClient** (Per Service)
   - Creates authenticated axios instances
   - Sets up request/response interceptors
   - Manages token refresh flow
   - Returns AxiosHelper wrapper

3. **AxiosHelper** (Per Service)
   - Wraps axios instance
   - Provides clean HTTP method APIs
   - Type-safe with generics

---

## Core Components

### 1. AxiosHelper

**Purpose:** Type-safe wrapper around axios instances.

**Key Methods:**
- `get<T>(url, config?): Promise<T>`
- `post<T>(url, data?, config?): Promise<T>`
- `put<T>(url, data?, config?): Promise<T>`
- `delete<T>(url, config?): Promise<T>`

**When to Use:**
- You want a clean, simple HTTP client
- You need type safety for API responses
- You're wrapping an existing axios instance

### 2. createAuthenticatedClient

**Purpose:** Factory function for creating authenticated axios clients with automatic token refresh.

**Key Features:**
- Automatic bearer token injection
- 401 error handling with token refresh
- Request queuing during refresh
- Configurable storage (localStorage/sessionStorage/memory)
- Custom interceptors and error handlers

**When to Use:**
- Your API requires JWT authentication
- You need automatic token refresh
- You want to centralize auth logic

### 3. AxiosProvider

**Purpose:** React context provider for managing multiple API services.

**Key Features:**
- Multi-service architecture support
- Dynamic service configuration
- Service instance caching
- React hooks for easy access

**When to Use:**
- You have multiple backend services
- You want to share API clients across components
- You need centralized API configuration

---

## Quick Start

### Basic Setup (Single Service)

```typescript
import { AxiosProvider } from 'fog-ui';

function App() {
  return (
    <AxiosProvider
      services={{
        api: {
          baseURL: 'https://api.example.com',
          requiresAuth: true,
        },
      }}
      authConfig={{
        tokenKey: 'accessToken',
        refreshConfig: {
          refreshEndpoint: '/auth/refresh',
          refreshTokenKey: 'refreshToken',
        },
      }}
    >
      <YourApp />
    </AxiosProvider>
  );
}
```

### Using in Components

```typescript
import { useService } from 'fog-ui';

function UserList() {
  const api = useService('api');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await api.get<User[]>('/users');
      setUsers(data);
    }
    fetchUsers();
  }, []);

  return <div>{/* render users */}</div>;
}
```

---

## Usage Guides

### Guide 1: Simple Public API

For a public API that doesn't require authentication:

```typescript
import { AxiosProvider, useService } from 'fog-ui';

// Setup
<AxiosProvider
  services={{
    public: {
      baseURL: 'https://api.public.com',
      requiresAuth: false,
      timeout: 5000,
    },
  }}
>
  <App />
</AxiosProvider>

// Usage
function Component() {
  const publicApi = useService('public');
  
  const data = await publicApi.get<Data>('/endpoint');
}
```

### Guide 2: Authenticated API with Token Refresh

For an API that requires JWT authentication:

```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
      timeout: 10000,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    storageType: 'localStorage', // or 'sessionStorage' or 'memory'
    loginRedirectPath: '/login',
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
      refreshTokenKey: 'refreshToken',
      extractAccessToken: (response) => response.data.token,
      extractRefreshToken: (response) => response.data.refreshToken,
    },
    onRefreshFailed: (error) => {
      console.error('Token refresh failed:', error);
      // Custom error handling (e.g., show notification)
    },
  }}
>
  <App />
</AxiosProvider>
```

**How Token Refresh Works:**

1. Request fails with 401 status
2. System automatically calls refresh endpoint with refresh token
3. New tokens are stored
4. Original request is retried with new token
5. If refresh fails, user is redirected to login (or custom handler is called)

### Guide 3: Multi-Service Architecture

For microservices or multiple backend APIs:

```typescript
<AxiosProvider
  services={{
    // User service
    users: {
      baseURL: 'https://users.example.com',
      requiresAuth: true,
      timeout: 10000,
    },
    // Data service
    data: {
      baseURL: 'https://data.example.com',
      requiresAuth: true,
      timeout: 15000,
    },
    // Public content service
    content: {
      baseURL: 'https://cdn.example.com',
      requiresAuth: false,
      timeout: 5000,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
      refreshTokenKey: 'refreshToken',
    },
  }}
>
  <App />
</AxiosProvider>

// Usage in components
function MyComponent() {
  const { getService, hasService } = useAxios();
  
  // Check if service exists
  if (hasService('users')) {
    const usersApi = getService('users');
    const users = await usersApi.get<User[]>('/users');
  }
  
  // Or use convenience hook
  const dataApi = useService('data');
  const analytics = await dataApi.get<Analytics>('/analytics');
}
```

### Guide 4: Custom Headers and Config

Adding custom headers or axios configuration:

```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
      axiosConfig: {
        headers: {
          'X-API-Version': '2.0',
          'X-Client-ID': 'my-app',
        },
        withCredentials: true,
        maxRedirects: 5,
      },
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    axiosConfig: {
      headers: {
        'X-Auth-Provider': 'custom',
      },
    },
  }}
>
  <App />
</AxiosProvider>
```

**Note:** Service-level `axiosConfig` is merged with auth-level `axiosConfig`. Service config takes precedence for overlapping keys.

### Guide 5: Memory Storage (No Persistence)

For testing or when you don't want to persist tokens:

```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    storageType: 'memory', // Tokens stored in memory only
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
      refreshTokenKey: 'refreshToken',
    },
  }}
>
  <App />
</AxiosProvider>
```

**Use Cases for Memory Storage:**
- Unit/integration testing
- Temporary sessions
- Security-sensitive applications (tokens don't persist on disk)
- Development/debugging

### Guide 6: Manual Token Management

Directly managing tokens programmatically:

```typescript
import { createAuthenticatedClient } from 'fog-ui';

const client = createAuthenticatedClient({
  baseURL: 'https://api.example.com',
  tokenKey: 'accessToken',
});

// Set token after login
async function handleLogin(credentials) {
  const response = await fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  const { token } = await response.json();
  
  client.setToken(token);
}

// Check if token exists
if (client.getToken()) {
  // User is authenticated
}

// Clear token on logout
function handleLogout() {
  client.clearToken();
}

// Manual token refresh
await client.refreshToken();
```

### Guide 7: Custom Token Extractors

When your API has non-standard token response formats:

```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
      refreshTokenKey: 'refreshToken',
      
      // Custom token extraction logic
      extractAccessToken: (response) => {
        // Example: Token nested deep in response
        return response.data.auth.credentials.accessToken;
      },
      
      extractRefreshToken: (response) => {
        return response.data.auth.credentials.refreshToken;
      },
    },
  }}
>
  <App />
</AxiosProvider>
```

### Guide 8: Custom Request/Response Interceptors

Adding custom logic to interceptors:

```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    
    // Custom request interceptor (runs after token is added)
    onRequest: (config) => {
      console.log('Request:', config.url);
      config.headers['X-Request-Time'] = Date.now();
      return config;
    },
    
    // Custom response interceptor (runs on success)
    onResponse: (response) => {
      console.log('Response:', response.status);
      return response;
    },
    
    // Custom error handler (runs on non-401 errors)
    onError: (error) => {
      if (error.response?.status === 403) {
        console.error('Forbidden:', error.response.data);
      }
      return Promise.reject(error);
    },
  }}
>
  <App />
</AxiosProvider>
```

### Guide 9: Conditional Token Refresh

Control when token refresh should occur:

```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
      refreshTokenKey: 'refreshToken',
      
      // Custom logic to determine if refresh should happen
      shouldRefreshToken: (error) => {
        // Only refresh for 401, not for other auth errors
        if (error.response?.status === 401) {
          // Don't refresh for certain endpoints
          const url = error.config?.url || '';
          return !url.includes('/auth/login');
        }
        return false;
      },
    },
  }}
>
  <App />
</AxiosProvider>
```

---

## Advanced Patterns

### Pattern 1: Type-Safe API Responses

Define response types for better type safety:

```typescript
// types/api.ts
interface User {
  id: string;
  name: string;
  email: string;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}

// Usage
function UserList() {
  const api = useService('api');
  
  const users = await api.get<PaginatedResponse<User>>('/users?page=1');
  
  users.data.forEach((user) => {
    console.log(user.name); // Fully typed!
  });
}
```

### Pattern 2: Request/Response Transformation

Transform data before sending or after receiving:

```typescript
const api = useService('api');

// Transform request data
const requestData = { firstName: 'John', lastName: 'Doe' };
await api.post('/users', requestData);

// Transform response with custom config
const response = await api.get<User>('/users/123', {
  transformResponse: (data) => {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      fullName: `${parsed.firstName} ${parsed.lastName}`,
    };
  },
});
```

### Pattern 3: Request Cancellation

Cancel requests when component unmounts:

```typescript
import { useEffect, useRef } from 'react';
import axios from 'axios';

function UserList() {
  const api = useService('api');
  const cancelTokenSource = useRef(axios.CancelToken.source());
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await api.get<User[]>('/users', {
          cancelToken: cancelTokenSource.current.token,
        });
        setUsers(users);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        }
      }
    }
    
    fetchUsers();
    
    return () => {
      cancelTokenSource.current.cancel('Component unmounted');
    };
  }, []);
}
```

### Pattern 4: Retry Logic

Implement custom retry logic:

```typescript
async function fetchWithRetry<T>(
  api: AxiosHelper,
  url: string,
  maxRetries = 3
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await api.get<T>(url);
    } catch (error) {
      lastError = error;
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  
  throw lastError;
}

// Usage
const data = await fetchWithRetry<User[]>(api, '/users');
```

### Pattern 5: Parallel Requests

Make multiple requests in parallel:

```typescript
async function fetchDashboardData() {
  const api = useService('api');
  
  const [users, analytics, settings] = await Promise.all([
    api.get<User[]>('/users'),
    api.get<Analytics>('/analytics'),
    api.get<Settings>('/settings'),
  ]);
  
  return { users, analytics, settings };
}
```

### Pattern 6: Service-Specific Error Handling

Handle errors differently per service:

```typescript
function DataFetcher() {
  const { getService } = useAxios();
  
  async function fetchFromService(serviceName: string, endpoint: string) {
    const service = getService(serviceName);
    
    try {
      return await service.get(endpoint);
    } catch (error) {
      // Service-specific error handling
      if (serviceName === 'users') {
        console.error('User service error:', error);
        // Show user-friendly message
      } else if (serviceName === 'data') {
        console.error('Data service error:', error);
        // Fallback to cached data
      }
      throw error;
    }
  }
}
```

### Pattern 7: Dynamic Service Configuration

Change service configuration at runtime:

```typescript
function AdminPanel() {
  const [environment, setEnvironment] = useState<'dev' | 'prod'>('dev');
  
  const services = useMemo(() => ({
    api: {
      baseURL: environment === 'dev' 
        ? 'https://dev-api.example.com'
        : 'https://api.example.com',
      requiresAuth: true,
    },
  }), [environment]);
  
  return (
    <AxiosProvider services={services} authConfig={authConfig}>
      <button onClick={() => setEnvironment(environment === 'dev' ? 'prod' : 'dev')}>
        Switch to {environment === 'dev' ? 'Production' : 'Development'}
      </button>
      <Dashboard />
    </AxiosProvider>
  );
}
```

---

## TypeScript Types

### Core Interfaces

```typescript
// Token storage interface
interface TokenStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Token refresh configuration
interface TokenRefreshConfig {
  refreshEndpoint: string;
  refreshTokenKey?: string;
  extractAccessToken?: (response: any) => string;
  extractRefreshToken?: (response: any) => string | null;
  shouldRefreshToken?: (error: any) => boolean;
}

// Authentication configuration
interface AuthConfig {
  tokenKey: string;
  timeout?: number;
  loginRedirectPath?: string;
  storageType?: 'localStorage' | 'sessionStorage' | 'memory';
  refreshConfig?: TokenRefreshConfig;
  axiosConfig?: AxiosRequestConfig;
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onError?: (error: any) => any;
  onRefreshFailed?: (error: any) => void;
}

// Service configuration
interface ServiceConfig {
  baseURL: string;
  requiresAuth?: boolean;
  timeout?: number;
  axiosConfig?: AxiosRequestConfig;
}

// Provider props
interface AxiosProviderProps {
  services: ApiServicesConfig;
  authConfig?: AuthConfig;
  children: React.ReactNode;
}

// Context value
interface AxiosContextValue {
  services: Record<string, AxiosHelper>;
  getService: (serviceName: string) => AxiosHelper;
  hasService: (serviceName: string) => boolean;
}
```

### Usage with Generics

```typescript
// Type-safe API calls
interface User {
  id: string;
  name: string;
}

const api = useService('api');

// Response is typed as User
const user = await api.get<User>('/users/123');

// Response is typed as User[]
const users = await api.get<User[]>('/users');

// Post with typed body and response
interface CreateUserRequest {
  name: string;
  email: string;
}

const newUser = await api.post<User, CreateUserRequest>('/users', {
  name: 'John',
  email: 'john@example.com',
});
```

---

## Best Practices

### 1. Service Naming

Use clear, descriptive service names:

```typescript
// ✅ Good
services={{
  userService: { baseURL: '...' },
  analyticsService: { baseURL: '...' },
  contentService: { baseURL: '...' },
}}

// ❌ Avoid
services={{
  api1: { baseURL: '...' },
  api2: { baseURL: '...' },
  service: { baseURL: '...' },
}}
```

### 2. Error Handling

Always handle errors appropriately:

```typescript
// ✅ Good
async function fetchUsers() {
  try {
    const users = await api.get<User[]>('/users');
    return users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.status, error.message);
      // Show user-friendly error message
    }
    throw error;
  }
}

// ❌ Avoid
async function fetchUsers() {
  const users = await api.get<User[]>('/users'); // Unhandled rejection
  return users;
}
```

### 3. Token Storage Selection

Choose appropriate storage based on security requirements:

```typescript
// Public computers / High security
storageType: 'memory' // Tokens cleared on page refresh

// Normal web apps
storageType: 'localStorage' // Tokens persist across sessions

// Same-session only
storageType: 'sessionStorage' // Tokens cleared when tab closes
```

### 4. Service Organization

Organize services by domain or team ownership:

```typescript
services={{
  // Auth domain
  authService: { baseURL: 'https://auth.example.com', requiresAuth: false },
  
  // User management domain
  userService: { baseURL: 'https://users.example.com', requiresAuth: true },
  
  // Business logic domain
  businessService: { baseURL: 'https://api.example.com', requiresAuth: true },
  
  // Public content
  cdnService: { baseURL: 'https://cdn.example.com', requiresAuth: false },
}}
```

### 5. Type Definitions

Keep API types in a central location:

```typescript
// types/api/users.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

// types/api/index.ts
export * from './users';
export * from './analytics';
export * from './settings';

// Usage
import { User, CreateUserRequest } from '@/types/api';
```

### 6. Timeout Configuration

Set appropriate timeouts based on endpoint characteristics:

```typescript
services={{
  // Fast endpoints (user actions)
  userService: {
    baseURL: '...',
    timeout: 5000, // 5 seconds
  },
  
  // Slow endpoints (reports, analytics)
  reportService: {
    baseURL: '...',
    timeout: 30000, // 30 seconds
  },
  
  // Real-time endpoints
  realtimeService: {
    baseURL: '...',
    timeout: 2000, // 2 seconds
  },
}}
```

### 7. Environment Configuration

Use environment variables for configuration:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:3001';

<AxiosProvider
  services={{
    api: {
      baseURL: API_BASE_URL,
      requiresAuth: true,
    },
    auth: {
      baseURL: AUTH_BASE_URL,
      requiresAuth: false,
    },
  }}
  authConfig={{
    tokenKey: 'accessToken',
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
    },
  }}
>
  <App />
</AxiosProvider>
```

---

## Troubleshooting

### Issue: Token not being added to requests

**Symptoms:** Requests fail with 401, but token exists in storage

**Solutions:**
1. Check that `requiresAuth: true` is set for the service
2. Verify `tokenKey` matches the storage key
3. Ensure token is actually stored: `console.log(localStorage.getItem('accessToken'))`
4. Check request interceptor is working: Add `onRequest` handler with console.log

```typescript
authConfig={{
  tokenKey: 'accessToken',
  onRequest: (config) => {
    console.log('Request headers:', config.headers);
    return config;
  },
}}
```

### Issue: Token refresh loop

**Symptoms:** Infinite loop of refresh requests

**Solutions:**
1. Ensure refresh endpoint doesn't require authentication
2. Add custom `shouldRefreshToken` to prevent refreshing for refresh endpoint

```typescript
refreshConfig={{
  refreshEndpoint: '/auth/refresh',
  shouldRefreshToken: (error) => {
    const url = error.config?.url || '';
    return error.response?.status === 401 && !url.includes('/auth/refresh');
  },
}}
```

### Issue: "Service not found" error

**Symptoms:** `Error: Service "xyz" not found`

**Solutions:**
1. Check service name spelling: `getService('api')` matches `services={{ api: {...} }}`
2. Verify AxiosProvider is wrapping your component
3. Use `hasService('xyz')` to check before accessing

```typescript
const { hasService, getService } = useAxios();

if (hasService('api')) {
  const api = getService('api');
  // Use api
} else {
  console.error('API service not configured');
}
```

### Issue: Requests not being retried after token refresh

**Symptoms:** 401 errors are not automatically retried

**Solutions:**
1. Verify `refreshConfig` is provided
2. Check refresh token exists in storage
3. Ensure refresh endpoint returns valid tokens
4. Add logging to debug:

```typescript
authConfig={{
  refreshConfig: {
    refreshEndpoint: '/auth/refresh',
    extractAccessToken: (response) => {
      console.log('Refresh response:', response.data);
      return response.data.accessToken;
    },
  },
  onRefreshFailed: (error) => {
    console.error('Refresh failed:', error);
  },
}}
```

### Issue: TypeScript errors with response types

**Symptoms:** Type errors when accessing response data

**Solutions:**
1. Ensure generic type parameter is provided: `api.get<User>('/user')`
2. Define proper interfaces for API responses
3. Use type guards for optional properties

```typescript
interface User {
  id: string;
  name: string;
  email?: string; // Optional
}

const user = await api.get<User>('/user');

if (user.email) {
  // TypeScript knows email is defined here
  console.log(user.email.toLowerCase());
}
```

### Issue: CORS errors

**Symptoms:** Requests fail with CORS policy errors

**Solutions:**
1. Backend must set proper CORS headers
2. For credentials, set `withCredentials: true`:

```typescript
services={{
  api: {
    baseURL: 'https://api.example.com',
    axiosConfig: {
      withCredentials: true,
    },
  },
}}
```

3. Ensure `Access-Control-Allow-Credentials: true` on backend

### Issue: Memory leaks with axios instances

**Symptoms:** App slows down over time, memory usage increases

**Solutions:**
1. Don't create new axios clients in render loops
2. Use AxiosProvider to manage instance lifecycle
3. Cancel requests when components unmount (see Advanced Patterns)

### Issue: Tokens not persisting across page refreshes

**Symptoms:** User logged out after refresh

**Solutions:**
1. Check `storageType` is not set to `'memory'`
2. Verify localStorage/sessionStorage is accessible (not disabled)
3. Check browser's storage quota hasn't been exceeded

```typescript
// Test storage
try {
  localStorage.setItem('test', 'value');
  localStorage.removeItem('test');
  console.log('localStorage is working');
} catch (error) {
  console.error('localStorage is not available:', error);
}
```

### Issue: Race conditions with concurrent requests

**Symptoms:** Some requests fail during token refresh

**Solution:** The library handles this automatically with request queuing. If issues persist:
1. Check `shouldRefreshToken` isn't rejecting valid 401s
2. Verify only one refresh is happening at a time (built-in)
3. Review custom interceptors that might interfere

---

## Testing

### Testing Components that Use API

```typescript
import { render } from '@testing-library/react';
import { AxiosProvider } from 'fog-ui';

function renderWithProvider(component: React.ReactElement) {
  return render(
    <AxiosProvider
      services={{
        api: {
          baseURL: 'http://localhost:3000',
          requiresAuth: false,
        },
      }}
    >
      {component}
    </AxiosProvider>
  );
}

test('fetches users', async () => {
  const { findByText } = renderWithProvider(<UserList />);
  expect(await findByText('John Doe')).toBeInTheDocument();
});
```

### Mocking API Calls

```typescript
import { vi } from 'vitest';

vi.mock('fog-ui', () => ({
  useService: () => ({
    get: vi.fn().mockResolvedValue([
      { id: '1', name: 'John Doe' },
    ]),
  }),
}));
```

---

## Migration Guide

### From Direct Axios to AxiosHelper

**Before:**
```typescript
import axios from 'axios';

const response = await axios.get('https://api.example.com/users');
const users = response.data;
```

**After:**
```typescript
import { useService } from 'fog-ui';

const api = useService('api');
const users = await api.get<User[]>('/users'); // Returns data directly
```

### From Custom Auth to createAuthenticatedClient

**Before:**
```typescript
const instance = axios.create({ baseURL: 'https://api.example.com' });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manual token refresh logic...
```

**After:**
```typescript
<AxiosProvider
  services={{
    api: {
      baseURL: 'https://api.example.com',
      requiresAuth: true,
    },
  }}
  authConfig={{
    tokenKey: 'token',
    refreshConfig: {
      refreshEndpoint: '/auth/refresh',
    },
  }}
>
  <App />
</AxiosProvider>
```

---

## Performance Considerations

1. **Service Instance Caching:** AxiosProvider creates service instances once and caches them using `useMemo`
2. **Request Queuing:** During token refresh, requests are queued and executed after refresh completes
3. **Storage Access:** Minimize direct storage access; tokens are read once per request
4. **Memory Storage:** Use for temporary sessions to avoid disk I/O

---

## Security Considerations

1. **Token Storage:** Use `memory` storage for high-security applications
2. **HTTPS Only:** Always use HTTPS in production to prevent token interception
3. **Token Expiration:** Implement short-lived access tokens with refresh tokens
4. **XSS Protection:** Sanitize all user inputs to prevent token theft via XSS
5. **CSRF Protection:** Use CSRF tokens for state-changing operations

---

## Contributing

When contributing to this module:

1. Maintain 100% test coverage
2. Add JSDoc comments to all public APIs
3. Update this documentation for new features
4. Follow existing code patterns
5. Write integration tests for new flows

---

## Changelog

### Version 1.0.0 (January 19, 2026)
- Initial release
- AxiosHelper implementation
- createAuthenticatedClient with token refresh
- AxiosProvider with multi-service support
- Complete TypeScript types
- 100% test coverage

---

## Support

For issues or questions:
1. Check this documentation
2. Review test files in `__tests__/` for examples
3. Check GitHub issues
4. Contact the maintainers

---

**Happy Coding! 🚀**
