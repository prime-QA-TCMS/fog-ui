# Context Module - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `context` module provides React Context providers for managing global application state. Currently includes the ThemeContext for managing Material-UI theme customization with dark/light mode and primary color configuration.

### Key Features

- ✅ **Dark/Light Mode** - Toggle between light and dark themes
- ✅ **Custom Primary Color** - Dynamically change the primary color palette
- ✅ **Persistent Settings** - Theme preferences saved to localStorage
- ✅ **Material-UI Integration** - Seamless integration with MUI ThemeProvider
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Production Tested** - Comprehensive test coverage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Application Root                       │
│                                                              │
│  <ThemeContextProvider>                                     │
│    ├─> Manages: mode (light/dark), primaryColor            │
│    ├─> localStorage: Persists theme preferences            │
│    ├─> MUI ThemeProvider: Wraps children with theme        │
│    └─> Context: Exposes toggleTheme, changePrimaryColor    │
│         │                                                    │
│         └──> Child Components                               │
│               └─> useContext(ThemeContext)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Components Reference

### ThemeContextProvider

**Purpose:** Provides theme management functionality to all child components.

**Props:**
```typescript
interface ThemeContextProviderProps {
  children: ReactNode;
}
```

**Context Value:**
```typescript
interface ThemeContextProps {
  toggleTheme: () => void;           // Switch between light/dark mode
  changePrimaryColor: (color: string) => void;  // Update primary color
  mode: 'light' | 'dark';            // Current theme mode
  primaryColor: string;               // Current primary color (hex)
}
```

---

## Usage

### Basic Setup

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeContextProvider } from 'fog-ui';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
);
```

### Consuming Theme Context

```typescript
import { useContext } from 'react';
import { ThemeContext } from 'fog-ui';
import { Box, Button, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function ThemeControls() {
  const { mode, primaryColor, toggleTheme, changePrimaryColor } = useContext(ThemeContext);
  
  return (
    <Box>
      {/* Toggle dark/light mode */}
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      
      {/* Show current mode */}
      <Typography>Current Mode: {mode}</Typography>
      
      {/* Change primary color */}
      <Box>
        <Button onClick={() => changePrimaryColor('#1976D2')}>Blue</Button>
        <Button onClick={() => changePrimaryColor('#DC004E')}>Pink</Button>
        <Button onClick={() => changePrimaryColor('#388E3C')}>Green</Button>
        <Button onClick={() => changePrimaryColor('#F57C00')}>Orange</Button>
      </Box>
      
      {/* Show current color */}
      <Box 
        sx={{ 
          width: 50, 
          height: 50, 
          backgroundColor: primaryColor,
          border: '1px solid #000'
        }}
      />
    </Box>
  );
}
```

### Complete Example with Topbar

```typescript
import { useContext } from 'react';
import { ThemeContext } from 'fog-ui';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Brightness4, Brightness7, Palette } from '@mui/icons-material';

function AppTopbar() {
  const { mode, toggleTheme, changePrimaryColor } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleColorMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleColorMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleColorChange = (color: string) => {
    changePrimaryColor(color);
    handleColorMenuClose();
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>
        
        {/* Theme Toggle */}
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        
        {/* Color Picker */}
        <IconButton onClick={handleColorMenuOpen} color="inherit">
          <Palette />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleColorMenuClose}
        >
          <MenuItem onClick={() => handleColorChange('#1976D2')}>
            <Box sx={{ width: 24, height: 24, bgcolor: '#1976D2', mr: 1 }} />
            Blue
          </MenuItem>
          <MenuItem onClick={() => handleColorChange('#DC004E')}>
            <Box sx={{ width: 24, height: 24, bgcolor: '#DC004E', mr: 1 }} />
            Pink
          </MenuItem>
          <MenuItem onClick={() => handleColorChange('#388E3C')}>
            <Box sx={{ width: 24, height: 24, bgcolor: '#388E3C', mr: 1 }} />
            Green
          </MenuItem>
          <MenuItem onClick={() => handleColorChange('#F57C00')}>
            <Box sx={{ width: 24, height: 24, bgcolor: '#F57C00', mr: 1 }} />
            Orange
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
```

---

## How It Works

### 1. Initialization
- Reads `themeMode` and `primaryColor` from localStorage on mount
- Defaults to `'light'` mode and `'#1976D2'` (blue) if not found
- Creates initial theme using Material-UI's `createTheme`

### 2. Theme Creation
```typescript
const theme = useMemo(
  () => createTheme({
    palette: {
      mode: mode,              // 'light' or 'dark'
      primary: {
        main: primaryColor,    // Hex color string
      },
    },
  }),
  [mode, primaryColor]
);
```

### 3. Persistence
- Every time `mode` changes, updates `localStorage.setItem('themeMode', mode)`
- Every time `primaryColor` changes, updates `localStorage.setItem('primaryColor', primaryColor)`
- Settings persist across browser sessions and page refreshes

### 4. Context Distribution
- Wraps children in both `ThemeContext.Provider` and Material-UI's `ThemeProvider`
- All child components can access theme functions via `useContext(ThemeContext)`
- All child components automatically receive updated MUI theme via `ThemeProvider`

---

## API Reference

### toggleTheme()

Switches between light and dark mode.

```typescript
const { toggleTheme } = useContext(ThemeContext);

// Toggle mode
toggleTheme();  // light → dark, or dark → light
```

### changePrimaryColor(color: string)

Updates the primary color of the theme.

```typescript
const { changePrimaryColor } = useContext(ThemeContext);

// Change to different colors
changePrimaryColor('#1976D2');  // Blue
changePrimaryColor('#DC004E');  // Pink
changePrimaryColor('#388E3C');  // Green
changePrimaryColor('#F57C00');  // Orange
changePrimaryColor('#9C27B0');  // Purple
```

**Accepted Formats:**
- Hex: `'#1976D2'`, `'#FFF'`
- RGB: `'rgb(25, 118, 210)'`
- Named colors: `'blue'`, `'red'`, etc.

### mode: 'light' | 'dark'

Current theme mode.

```typescript
const { mode } = useContext(ThemeContext);

console.log(mode);  // 'light' or 'dark'
```

### primaryColor: string

Current primary color (hex string).

```typescript
const { primaryColor } = useContext(ThemeContext);

console.log(primaryColor);  // '#1976D2'
```

---

## Best Practices

### 1. Provider Placement
Place `ThemeContextProvider` at the root of your application, before any components that need theme access:

```typescript
// ✅ Good
<ThemeContextProvider>
  <App />
</ThemeContextProvider>

// ❌ Bad - Some components won't have access
<App>
  <ThemeContextProvider>
    <Content />
  </ThemeContextProvider>
</App>
```

### 2. Color Selection
Provide a curated set of colors rather than allowing arbitrary input:

```typescript
const THEME_COLORS = {
  blue: '#1976D2',
  pink: '#DC004E',
  green: '#388E3C',
  orange: '#F57C00',
  purple: '#9C27B0',
} as const;

// ✅ Good - Predefined palette
<Button onClick={() => changePrimaryColor(THEME_COLORS.blue)}>Blue</Button>

// ❌ Avoid - Arbitrary user input
<input type="color" onChange={e => changePrimaryColor(e.target.value)} />
```

### 3. Accessibility
Ensure sufficient contrast in both light and dark modes:

```typescript
// Check contrast ratio with theme colors
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  
  return (
    <Box
      sx={{
        color: theme.palette.text.primary,        // Adapts to mode
        backgroundColor: theme.palette.background.default,  // Adapts to mode
      }}
    >
      Content with good contrast
    </Box>
  );
}
```

### 4. React Hooks Rules
Always consume context inside a functional component or custom hook:

```typescript
// ✅ Good
function MyComponent() {
  const { toggleTheme } = useContext(ThemeContext);
  return <Button onClick={toggleTheme}>Toggle</Button>;
}

// ❌ Bad - Outside component
const { toggleTheme } = useContext(ThemeContext);  // Error!
```

---

## localStorage Schema

The ThemeContextProvider stores the following keys in localStorage:

```typescript
{
  "themeMode": "light" | "dark",      // Current theme mode
  "primaryColor": "#1976D2"            // Current primary color (hex)
}
```

### Clearing Stored Preferences

```typescript
// Clear all theme preferences
localStorage.removeItem('themeMode');
localStorage.removeItem('primaryColor');

// Refresh page to reload defaults
window.location.reload();
```

---

## TypeScript Types

```typescript
interface ThemeContextProps {
  toggleTheme: () => void;
  changePrimaryColor: (color: string) => void;
  mode: 'light' | 'dark';
  primaryColor: string;
}

interface ThemeContextProviderProps {
  children: ReactNode;
}
```

---

## Testing

The ThemeContext is thoroughly tested with comprehensive test suites:

- **State Management**: Mode toggling, color changes, default values
- **localStorage Integration**: Persistence, retrieval, updates
- **Provider Functionality**: Context distribution, children rendering
- **Edge Cases**: Missing localStorage, invalid colors, rapid toggles

Run tests:
```bash
npm test -- src/context/__tests__
```

---

## Common Patterns

### Theme-Aware Component

```typescript
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from 'fog-ui';

function ThemedCard() {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  
  return (
    <Card
      sx={{
        backgroundColor: mode === 'dark' 
          ? theme.palette.grey[800] 
          : theme.palette.grey[100],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        Theme-aware content
      </CardContent>
    </Card>
  );
}
```

### Settings Page

```typescript
function SettingsPage() {
  const { mode, primaryColor, toggleTheme, changePrimaryColor } = useContext(ThemeContext);
  
  return (
    <Box>
      <Typography variant="h5">Theme Settings</Typography>
      
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={toggleTheme}
            />
          }
          label="Dark Mode"
        />
      </FormGroup>
      
      <Typography variant="h6" sx={{ mt: 2 }}>Primary Color</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {['#1976D2', '#DC004E', '#388E3C', '#F57C00', '#9C27B0'].map(color => (
          <Box
            key={color}
            onClick={() => changePrimaryColor(color)}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: color,
              border: primaryColor === color ? '3px solid black' : '1px solid gray',
              cursor: 'pointer',
              borderRadius: 1,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
```

---

## Troubleshooting

**Issue:** Theme not updating after toggle  
**Solution:** Ensure component is inside `<ThemeContextProvider>` and using `useContext(ThemeContext)`

**Issue:** localStorage not persisting  
**Solution:** Check browser privacy settings - some modes block localStorage

**Issue:** Custom color not applying  
**Solution:** Verify color format is valid CSS color (hex, rgb, named)

**Issue:** Context is undefined  
**Solution:** Ensure you're consuming context inside a component that's a child of `ThemeContextProvider`
