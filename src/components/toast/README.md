# Toast/Notification System - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `toast` module provides a complete toast notification system with support for multiple variants, positions, auto-dismiss, and action buttons. Built on Material-UI Alert component with full TypeScript support.

### Key Features

- ✅ **4 Variants** - Success, error, warning, info with distinct styling
- ✅ **6 Positions** - Top/bottom × left/center/right placement
- ✅ **Auto-Dismiss** - Configurable timeout with manual dismiss option
- ✅ **Action Buttons** - Optional action buttons with callbacks
- ✅ **Queue Management** - Multiple toasts displayed simultaneously
- ✅ **Type Safety** - Full TypeScript support with generics
- ✅ **Accessible** - ARIA labels and keyboard navigation
- ✅ **Production Tested** - 97.6% test coverage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Root                          │
│                                                              │
│  <ToastProvider>                                            │
│    ├─> State: toasts[], timeouts Map                       │
│    ├─> Methods: addToast, removeToast, clearToasts         │
│    └─> Context: Provides toast API to children             │
│         │                                                    │
│         ├──> <ToastContainer />                             │
│         │      └─> Groups toasts by position                │
│         │           └─> Renders <Toast /> for each          │
│         │                                                    │
│         └──> Child Components                               │
│               └─> useToast() hook                           │
│                    ├─> success(msg, opts)                   │
│                    ├─> error(msg, opts)                     │
│                    ├─> warning(msg, opts)                   │
│                    ├─> info(msg, opts)                      │
│                    └─> show(msg, opts)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Components Reference

### 1. ToastProvider

**Purpose:** Manages toast state and provides context to children.

**Props:**
```typescript
interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;  // Default: 'top-right'
  defaultDuration?: number;         // Default: 5000ms
}
```

**Usage:**
```typescript
import { ToastProvider } from 'fog-ui';

function App() {
  return (
    <ToastProvider defaultPosition="top-right" defaultDuration={5000}>
      <YourApp />
    </ToastProvider>
  );
}
```

### 2. ToastContainer

**Purpose:** Renders all active toasts grouped by position.

**Props:**
```typescript
// No props - automatically consumes ToastContext
```

**Usage:**
```typescript
import { ToastProvider, ToastContainer } from 'fog-ui';

function App() {
  return (
    <ToastProvider>
      <YourApp />
      <ToastContainer />  {/* Place once at root level */}
    </ToastProvider>
  );
}
```

### 3. Toast

**Purpose:** Individual toast component (MUI Alert wrapper).

**Props:**
```typescript
interface ToastComponentProps {
  toast: Toast;
  onClose: () => void;
}

interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: ToastPosition;
  actionText?: string;
  onAction?: () => void;
}
```

**Note:** Typically not used directly - ToastContainer renders these automatically.

### 4. useToast Hook

**Purpose:** Provides convenient methods for displaying toasts.

**Return Value:**
```typescript
interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  show: (message: string, options?: ToastOptions) => string;
  remove: (id: string) => void;
  clearAll: () => void;
  toasts: Toast[];
}
```

---

## Usage

### Basic Setup

```typescript
// main.tsx or App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider, ToastContainer } from 'fog-ui';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider defaultPosition="top-right" defaultDuration={5000}>
      <App />
      <ToastContainer />
    </ToastProvider>
  </React.StrictMode>
);
```

### Simple Toast Notifications

```typescript
import { useToast } from 'fog-ui';
import { Button } from '@mui/material';

function MyComponent() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Data saved successfully!');
  };
  
  const handleError = () => {
    toast.error('Failed to save data');
  };
  
  const handleWarning = () => {
    toast.warning('Your session will expire soon');
  };
  
  const handleInfo = () => {
    toast.info('New features available!');
  };
  
  return (
    <>
      <Button onClick={handleSuccess}>Success</Button>
      <Button onClick={handleError}>Error</Button>
      <Button onClick={handleWarning}>Warning</Button>
      <Button onClick={handleInfo}>Info</Button>
    </>
  );
}
```

### Custom Duration

```typescript
const toast = useToast();

// Auto-dismiss after 3 seconds
toast.success('Quick message', { duration: 3000 });

// Auto-dismiss after 10 seconds
toast.warning('Important warning', { duration: 10000 });

// Never auto-dismiss (requires manual close)
toast.error('Critical error', { duration: 0 });
```

### Custom Position

```typescript
const toast = useToast();

// Top positions
toast.info('Top Left', { position: 'top-left' });
toast.info('Top Center', { position: 'top-center' });
toast.info('Top Right', { position: 'top-right' });

// Bottom positions
toast.success('Bottom Left', { position: 'bottom-left' });
toast.success('Bottom Center', { position: 'bottom-center' });
toast.success('Bottom Right', { position: 'bottom-right' });
```

### Action Buttons

```typescript
const toast = useToast();

// Toast with action button
toast.warning('Unsaved changes', {
  duration: 0,  // Don't auto-dismiss
  actionText: 'Save Now',
  onAction: () => {
    console.log('Saving...');
    // Perform save operation
  }
});

// Undo action
toast.info('Item deleted', {
  duration: 5000,
  actionText: 'Undo',
  onAction: () => {
    console.log('Undoing deletion...');
  }
});
```

### Managing Toasts

```typescript
const toast = useToast();

// Get the toast ID when creating
const id = toast.success('Processing...');

// Later, remove specific toast
toast.remove(id);

// Clear all toasts
toast.clearAll();

// Access all active toasts
console.log(toast.toasts);  // Toast[]
```

### Complete Example with Form

```typescript
import { useState } from 'react';
import { useToast } from 'fog-ui';
import { TextField, Button, Box } from '@mui/material';

function UserForm() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Show processing toast
      const processingId = toast.info('Saving user...', { duration: 0 });
      
      // API call
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      // Remove processing toast
      toast.remove(processingId);
      
      // Show success
      toast.success(`User "${name}" created successfully!`);
      setName('');
      
    } catch (error) {
      toast.error('Failed to create user. Please try again.', {
        duration: 0,
        actionText: 'Retry',
        onAction: () => handleSubmit(e)
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        Create User
      </Button>
    </Box>
  );
}
```

---

## API Reference

### ToastOptions

```typescript
interface ToastOptions {
  variant?: 'success' | 'error' | 'warning' | 'info';  // Default: 'info'
  duration?: number;        // Default: 5000ms, 0 = no auto-dismiss
  position?: ToastPosition; // Default: from ToastProvider
  actionText?: string;      // Optional action button text
  onAction?: () => void;    // Optional action button handler
}
```

### ToastPosition

```typescript
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
```

### useToast Methods

#### success(message: string, options?: ToastOptions): string
Shows a success toast (green, with checkmark icon).

#### error(message: string, options?: ToastOptions): string
Shows an error toast (red, with error icon).

#### warning(message: string, options?: ToastOptions): string
Shows a warning toast (orange, with warning icon).

#### info(message: string, options?: ToastOptions): string
Shows an info toast (blue, with info icon).

#### show(message: string, options?: ToastOptions): string
Shows a toast with custom variant specified in options.

#### remove(id: string): void
Removes a specific toast by ID.

#### clearAll(): void
Removes all active toasts.

---

## Best Practices

### 1. Provider Placement
Place ToastProvider at the root of your app before any components that need toast notifications:

```typescript
// ✅ Good
<ToastProvider>
  <App />
  <ToastContainer />
</ToastProvider>

// ❌ Bad
<App>
  <ToastProvider>
    <Content />
  </ToastProvider>
</App>
```

### 2. Message Guidelines
- **Keep it short:** 1-2 sentences max
- **Be specific:** "User John Doe created" vs "Success"
- **Action-oriented:** "Click Retry to attempt again"

```typescript
// ✅ Good
toast.success('Invoice #1234 sent to client@example.com');
toast.error('Failed to connect to server. Check your internet connection.');

// ❌ Bad
toast.success('Success');
toast.error('Error');
```

### 3. Duration Guidelines
- **Success:** 3-5 seconds (quick confirmation)
- **Info:** 5-7 seconds (read time for info)
- **Warning:** 7-10 seconds (important but not critical)
- **Error:** 0 (manual dismiss) or 10+ seconds (user needs to read/act)

```typescript
toast.success('Saved!', { duration: 3000 });
toast.info('5 new messages', { duration: 5000 });
toast.warning('Session expires in 5 min', { duration: 10000 });
toast.error('Payment failed', { duration: 0 });  // Requires manual dismiss
```

### 4. Position Strategy
- **Persistent actions:** Use consistent position (e.g., all top-right)
- **Context-specific:** Use position near relevant UI (e.g., bottom-center for inline actions)
- **Avoid overcrowding:** Stick to 1-2 positions in your app

### 5. Action Buttons
Only add action buttons when:
- Action is immediately relevant
- Action is quick to perform
- Alternative method isn't more obvious

```typescript
// ✅ Good use cases
toast.info('Item deleted', { actionText: 'Undo', onAction: undoDelete });
toast.warning('Unsaved changes', { actionText: 'Save', onAction: save });

// ❌ Bad use cases
toast.success('Logged in', { actionText: 'OK', onAction: () => {} });  // Unnecessary
```

### 6. Cleanup
Remove toasts when component unmounts or action completes:

```typescript
useEffect(() => {
  const id = toast.info('Loading...');
  
  return () => {
    toast.remove(id);  // Cleanup on unmount
  };
}, []);
```

---

## Styling & Theming

Toasts automatically adapt to your Material-UI theme:

```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    success: { main: '#4caf50' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
  },
});

<ThemeProvider theme={theme}>
  <ToastProvider>
    <App />
    <ToastContainer />
  </ToastProvider>
</ThemeProvider>
```

---

## Testing

The toast system is thoroughly tested with comprehensive test suites:

- **Toast Component**: 17 tests covering rendering, variants, actions, close
- **ToastProvider**: 26 tests covering add, remove, clear, auto-dismiss
- **useToast Hook**: 23 tests covering all methods, options, edge cases
- **ToastContainer**: 10 tests covering positioning, grouping, rendering

**Coverage:** 97.64% overall
- Toast: 90%
- ToastContainer: 95.83%
- ToastProvider: 100%
- useToast: 100%

Run tests:
```bash
npm test -- src/components/toast/__tests__
```

---

## Common Patterns

### Loading State Toast

```typescript
function DataLoader() {
  const toast = useToast();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let loadingId: string;
    
    async function loadData() {
      loadingId = toast.info('Loading data...', { duration: 0 });
      
      try {
        const response = await fetch('/api/data');
        const json = await response.json();
        setData(json);
        toast.remove(loadingId);
        toast.success('Data loaded successfully!');
      } catch (error) {
        toast.remove(loadingId);
        toast.error('Failed to load data');
      }
    }
    
    loadData();
  }, []);
  
  return <div>{/* Render data */}</div>;
}
```

### Async Operation with Progress

```typescript
async function uploadFile(file: File) {
  const toast = useToast();
  const uploadId = toast.info('Uploading file...', { duration: 0 });
  
  try {
    await api.upload(file);
    toast.remove(uploadId);
    toast.success('File uploaded successfully!', {
      actionText: 'View',
      onAction: () => navigate('/files')
    });
  } catch (error) {
    toast.remove(uploadId);
    toast.error('Upload failed', {
      duration: 0,
      actionText: 'Retry',
      onAction: () => uploadFile(file)
    });
  }
}
```

---

## Troubleshooting

**Issue:** Toasts not appearing  
**Solution:** Ensure `ToastContainer` is rendered and `ToastProvider` wraps your app

**Issue:** useToast returns undefined  
**Solution:** Verify component is inside `<ToastProvider>` wrapper

**Issue:** Toasts not auto-dismissing  
**Solution:** Check `duration` value - `0` means no auto-dismiss, default is 5000ms

**Issue:** Multiple toasts overlapping  
**Solution:** Toasts are automatically grouped by position - this is expected behavior

**Issue:** Action button not working  
**Solution:** Verify `onAction` callback is provided and not undefined
