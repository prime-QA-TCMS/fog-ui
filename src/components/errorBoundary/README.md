# ErrorBoundary Component - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `ErrorBoundary` component catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of crashing the entire application.

### Key Features

- ✅ **Error Catching** - Catches rendering errors, lifecycle errors, and constructor errors
- ✅ **Custom Fallback UI** - Provide custom error display components
- ✅ **Error Logging** - Optional callback for logging to external services
- ✅ **Reset Functionality** - Allow users to retry after errors
- ✅ **TypeScript Support** - Full type safety
- ✅ **Accessible** - ARIA labels for screen readers
- ✅ **Production Tested** - 100% test coverage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ErrorBoundary                             │
│                                                              │
│  State: hasError, error, errorInfo                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ getDerivedStateFromError(error)                      │   │
│  │   └─> Sets hasError = true                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ componentDidCatch(error, errorInfo)                  │   │
│  │   ├─> Logs error (if enabled)                       │   │
│  │   └─> Calls onError callback                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Render:                                                     │
│    hasError? → fallback UI                                  │
│    else → children                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  // Custom fallback UI or function
  // Default: Built-in error UI with message and reset button
  
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  // Callback when error is caught (for logging)
  
  onReset?: () => void;
  // Callback when error boundary is reset
  
  showResetButton?: boolean;
  // Show/hide reset button in default fallback
  // Default: true
  
  resetButtonText?: string;
  // Custom reset button text
  // Default: "Try Again"
  
  logErrors?: boolean;
  // Log errors to console
  // Default: true in development, false in production
}
```

---

## Usage

### Basic Usage

```typescript
import { ErrorBoundary } from 'fog-ui';
import MyComponent from './MyComponent';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Custom Fallback UI

```typescript
import { ErrorBoundary } from 'fog-ui';
import { Box, Typography, Button } from '@mui/material';

function App() {
  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Oops! Something went wrong.
          </Typography>
          <Typography>
            Please refresh the page or contact support.
          </Typography>
        </Box>
      }
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Fallback Function with Error Details

```typescript
import { ErrorBoundary } from 'fog-ui';
import { ErrorInfo } from 'react';

function App() {
  return (
    <ErrorBoundary
      fallback={(error: Error, errorInfo: ErrorInfo) => (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" color="error">
            Error: {error.message}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Component Stack:
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {errorInfo.componentStack}
          </pre>
        </Box>
      )}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Error Logging to External Service

```typescript
import { ErrorBoundary } from 'fog-ui';
import * as Sentry from '@sentry/react';

function App() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    
    // Log to custom service
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      }),
    });
  };
  
  return (
    <ErrorBoundary onError={handleError}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### With Reset Callback

```typescript
import { ErrorBoundary } from 'fog-ui';
import { useToast } from 'fog-ui';

function App() {
  const toast = useToast();
  
  const handleReset = () => {
    toast.info('Resetting application state...');
    // Clear localStorage, reset state, etc.
    localStorage.clear();
  };
  
  return (
    <ErrorBoundary
      onReset={handleReset}
      resetButtonText="Reset App"
      showResetButton={true}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Multiple Error Boundaries

```typescript
function App() {
  return (
    <ErrorBoundary fallback={<div>App Error</div>}>
      <Header />
      
      <ErrorBoundary fallback={<div>Sidebar Error</div>}>
        <Sidebar />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div>Content Error</div>}>
        <MainContent />
      </ErrorBoundary>
      
      <Footer />
    </ErrorBoundary>
  );
}
```

---

## What Error Boundaries Catch

Error boundaries catch errors during:
- ✅ Rendering
- ✅ Lifecycle methods
- ✅ Constructors of child components

---

## What Error Boundaries DON'T Catch

Error boundaries do NOT catch errors in:
- ❌ **Event handlers** - Use try-catch instead
- ❌ **Asynchronous code** - setTimeout, promises, async/await
- ❌ **Server-side rendering**
- ❌ **Errors thrown in the error boundary itself**

### Handling Event Handler Errors

```typescript
function MyComponent() {
  const toast = useToast();
  
  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    }
  };
  
  return <Button onClick={handleClick}>Click Me</Button>;
}
```

---

## Best Practices

### 1. Granular Error Boundaries
Place error boundaries at strategic points to isolate failures:

```typescript
// ✅ Good - Isolates different sections
<ErrorBoundary>
  <Header />
</ErrorBoundary>
<ErrorBoundary>
  <Sidebar />
</ErrorBoundary>
<ErrorBoundary>
  <Content />
</ErrorBoundary>

// ❌ Bad - Single point of failure
<ErrorBoundary>
  <Header />
  <Sidebar />
  <Content />
</ErrorBoundary>
```

### 2. Always Log Errors
Use `onError` callback for logging:

```typescript
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    // Send to logging service
  }}
>
  <App />
</ErrorBoundary>
```

### 3. Provide Meaningful Fallbacks
Give users actionable feedback:

```typescript
// ✅ Good
fallback={
  <Box>
    <Typography>Unable to load user profile.</Typography>
    <Button onClick={reload}>Try Again</Button>
    <Button onClick={goHome}>Go Home</Button>
  </Box>
}

// ❌ Bad
fallback={<div>Error</div>}
```

### 4. Production vs Development
Show different UI in dev vs prod:

```typescript
<ErrorBoundary
  fallback={(error, errorInfo) => (
    process.env.NODE_ENV === 'development' ? (
      <Box>
        <pre>{error.message}</pre>
        <pre>{errorInfo.componentStack}</pre>
      </Box>
    ) : (
      <Box>
        <Typography>Something went wrong. Please try again.</Typography>
      </Box>
    )
  )}
>
  <App />
</ErrorBoundary>
```

---

## Complete Example

```typescript
import { ErrorBoundary } from 'fog-ui';
import { Box, Typography, Button } from '@mui/material';
import { useToast } from 'fog-ui';
import * as Sentry from '@sentry/react';

function App() {
  const toast = useToast();
  
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
    
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    
    // Show toast notification
    toast.error('An unexpected error occurred');
  };
  
  const handleReset = () => {
    // Clear any error state
    localStorage.removeItem('errorState');
    toast.info('Application reset');
  };
  
  return (
    <ErrorBoundary
      onError={handleError}
      onReset={handleReset}
      resetButtonText="Reload App"
      fallback={(error, errorInfo) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            We're sorry for the inconvenience. Our team has been notified.
          </Typography>
          
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%', maxWidth: 600 }}>
              <Typography variant="subtitle2" color="error">
                Error: {error.message}
              </Typography>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {errorInfo.componentStack}
              </pre>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button variant="outlined" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </Box>
        </Box>
      )}
    >
      <MainApp />
    </ErrorBoundary>
  );
}
```

---

## Testing

The ErrorBoundary component is thoroughly tested with 100% coverage:

- Error catching and fallback rendering
- Custom fallback UI (component and function)
- Error logging and onError callback
- Reset functionality and onReset callback
- Console logging in dev/prod modes

Run tests:
```bash
npm test -- src/components/errorBoundary/__tests__
```

---

## Troubleshooting

**Issue:** Error boundary not catching error  
**Solution:** Ensure error occurs during render, not in event handler or async code

**Issue:** Fallback UI not showing  
**Solution:** Check that error is thrown in a child component, not the boundary itself

**Issue:** Reset button not working  
**Solution:** Verify component remounts properly - error boundary resets internal state

**Issue:** Error logging not working  
**Solution:** Check `logErrors` prop and ensure `onError` callback is provided
