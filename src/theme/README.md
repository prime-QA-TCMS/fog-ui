# Theme System - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `theme` module provides Material-UI theme configuration with customizable color palettes, typography, and component defaults.

### Key Features

- ✅ **Light/Dark Mode** - Pre-configured themes for both modes
- ✅ **Custom Palettes** - Easily customize primary, secondary, error colors
- ✅ **Typography** - Responsive font sizes and weights
- ✅ **Component Overrides** - Global component styling defaults
- ✅ **Theme Integration** - Works seamlessly with ThemeContext
- ✅ **Type Safety** - Full TypeScript support

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Theme Module                              │
│                                                              │
│  theme.ts                                                   │
│    ├─> createTheme() from MUI                              │
│    ├─> palette: { mode, primary, secondary, ... }          │
│    ├─> typography: { fontFamily, fontSize, ... }           │
│    └─> components: { MuiButton, MuiCard, ... }             │
│                                                              │
│  index.ts                                                   │
│    └─> exports theme configuration                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage

### Basic Theme Setup

```typescript
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'fog-ui';
import App from './App';

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}
```

### With ThemeContext (Recommended)

```typescript
import { ThemeContextProvider } from 'fog-ui';
import App from './App';

// ThemeContextProvider includes ThemeProvider internally
function Root() {
  return (
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  );
}
```

### Custom Theme Configuration

```typescript
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',       // Custom primary color
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#DC004E',       // Custom secondary color
    },
    error: {
      main: '#F44336',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',  // Disable uppercase
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## Theme Structure

### Palette

```typescript
{
  palette: {
    mode: 'light' | 'dark',
    primary: {
      main: string,
      light: string,
      dark: string,
      contrastText: string,
    },
    secondary: { /* same structure */ },
    error: { /* same structure */ },
    warning: { /* same structure */ },
    info: { /* same structure */ },
    success: { /* same structure */ },
    background: {
      default: string,
      paper: string,
    },
    text: {
      primary: string,
      secondary: string,
      disabled: string,
    },
  }
}
```

### Typography

```typescript
{
  typography: {
    fontFamily: string,
    fontSize: number,
    h1: { fontSize, fontWeight, lineHeight, ... },
    h2: { /* same structure */ },
    h3: { /* same structure */ },
    h4: { /* same structure */ },
    h5: { /* same structure */ },
    h6: { /* same structure */ },
    body1: { /* same structure */ },
    body2: { /* same structure */ },
    button: { /* same structure */ },
    caption: { /* same structure */ },
    overline: { /* same structure */ },
  }
}
```

### Component Overrides

```typescript
{
  components: {
    MuiButton: {
      defaultProps: { /* default prop values */ },
      styleOverrides: { /* style overrides */ },
    },
    MuiCard: { /* same structure */ },
    MuiTextField: { /* same structure */ },
    // ... other components
  }
}
```

---

## Accessing Theme

### Using useTheme Hook

```typescript
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      Themed Content
    </Box>
  );
}
```

### Using sx Prop

```typescript
import { Box } from '@mui/material';

function MyComponent() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        p: 2,
        borderRadius: 1,
      }}
    >
      Themed Content
    </Box>
  );
}
```

---

## Best Practices

### 1. Use Theme Values
Always use theme values instead of hardcoded colors/sizes:

```typescript
// ✅ Good
sx={{
  color: 'primary.main',
  padding: theme.spacing(2),
}}

// ❌ Bad
sx={{
  color: '#1976D2',
  padding: '16px',
}}
```

### 2. Responsive Typography
Use theme breakpoints for responsive text:

```typescript
sx={{
  fontSize: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
  },
}}
```

### 3. Global Overrides
Set component defaults globally in theme:

```typescript
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',  // Apply to all buttons
      },
    },
  },
}
```

---

## Complete Example

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF4081',
    },
    background: {
      default: '#F0F2F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />  {/* Normalize CSS */}
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## Testing

Theme configuration is tested for:

- Theme structure and exports
- Integration with components
- Dark/light mode switching
- Custom palette values

Run tests:
```bash
npm test -- src/theme/__tests__
```

---

## Troubleshooting

**Issue:** Theme values not applying  
**Solution:** Ensure component is wrapped in ThemeProvider

**Issue:** Custom colors not working  
**Solution:** Check color format (must be valid CSS color)

**Issue:** Typography not responsive  
**Solution:** Use theme breakpoints in sx prop or component overrides
