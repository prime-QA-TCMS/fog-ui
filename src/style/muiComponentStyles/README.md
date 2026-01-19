# Style Utilities - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `style/muiComponentStyles` module provides reusable Material-UI styling functions for common layout patterns. Includes container styles for pages, drawers, login forms, content areas, and more.

### Key Features

- ✅ **6 Container Styles** - Pre-built layouts for common use cases
- ✅ **Typography Utilities** - Text styling helpers
- ✅ **Theme Integration** - Automatically adapts to MUI theme
- ✅ **Responsive** - Mobile-friendly layouts
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Production Tested** - 100% test coverage

---

## Container Styles

### 1. pageContainer(theme)

**Purpose:** Full-page layout with minimum height and theme-based background.

**Returns:** `{ root: SxProps<Theme> }`

**Usage:**
```typescript
import { pageContainer } from 'fog-ui';
import { useTheme, Box } from '@mui/material';

function MyPage() {
  const theme = useTheme();
  const styles = pageContainer(theme);
  
  return (
    <Box sx={styles.root}>
      <h1>Page Content</h1>
    </Box>
  );
}
```

**Generated Styles:**
```typescript
{
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  }
}
```

---

### 2. DrawerContainer()

**Purpose:** Fixed-width sidebar/drawer container.

**Returns:** `{ root: SxProps<Theme> }`

**Usage:**
```typescript
import { DrawerContainer } from 'fog-ui';
import { Drawer } from '@mui/material';

function Sidebar() {
  const styles = DrawerContainer();
  
  return (
    <Drawer variant="permanent" sx={styles.root}>
      {/* Sidebar content */}
    </Drawer>
  );
}
```

**Generated Styles:**
```typescript
{
  root: {
    width: 300,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 300,
      boxSizing: 'border-box',
    },
  }
}
```

---

### 3. loginContainer(theme)

**Purpose:** Centered login/authentication form layout.

**Returns:** `SxProps<Theme>`

**Usage:**
```typescript
import { loginContainer } from 'fog-ui';
import { useTheme, Box, Card } from '@mui/material';

function LoginPage() {
  const theme = useTheme();
  const styles = loginContainer(theme);
  
  return (
    <Box sx={styles}>
      <Card sx={{ p: 4, maxWidth: 400 }}>
        <LoginForm />
      </Card>
    </Box>
  );
}
```

**Generated Styles:**
```typescript
{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}
```

---

### 4. contentContainer(theme)

**Purpose:** Content area with padding and scrollable overflow.

**Returns:** `SxProps<Theme>`

**Usage:**
```typescript
import { contentContainer } from 'fog-ui';
import { useTheme, Box } from '@mui/material';

function MainContent() {
  const theme = useTheme();
  const styles = contentContainer(theme);
  
  return (
    <Box sx={styles}>
      <h1>Main Content</h1>
      <p>Long scrollable content...</p>
    </Box>
  );
}
```

**Generated Styles:**
```typescript
{
  padding: theme.spacing(3),
  maxHeight: 'calc(100vh - 64px)',
  overflow: 'auto',
  backgroundColor: theme.palette.background.paper,
}
```

---

### 5. wrapContainer(theme)

**Purpose:** Flex wrap container with gap spacing.

**Returns:** `SxProps<Theme>`

**Usage:**
```typescript
import { wrapContainer } from 'fog-ui';
import { useTheme, Box, Card } from '@mui/material';

function CardGrid() {
  const theme = useTheme();
  const styles = wrapContainer(theme);
  
  return (
    <Box sx={styles}>
      {items.map(item => (
        <Card key={item.id} sx={{ width: 300 }}>
          {item.title}
        </Card>
      ))}
    </Box>
  );
}
```

**Generated Styles:**
```typescript
{
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}
```

---

### 6. halfScreenContainer(theme)

**Purpose:** Two-column grid layout (50/50 split).

**Returns:** `SxProps<Theme>`

**Usage:**
```typescript
import { halfScreenContainer } from 'fog-ui';
import { useTheme, Box } from '@mui/material';

function SplitLayout() {
  const theme = useTheme();
  const styles = halfScreenContainer(theme);
  
  return (
    <Box sx={styles}>
      <Box>Left Content</Box>
      <Box>Right Content</Box>
    </Box>
  );
}
```

**Generated Styles:**
```typescript
{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',  // Stack on mobile
  },
}
```

---

## Typography Styles

### Utility Functions

```typescript
import { typographyStyles } from 'fog-ui';

// Available typography utilities
typographyStyles.heading1      // Large page heading
typographyStyles.heading2      // Section heading
typographyStyles.bodyText      // Standard body text
typographyStyles.caption       // Small caption text
typographyStyles.ellipsis      // Text overflow with ellipsis
```

---

## Complete Example

```typescript
import { 
  pageContainer, 
  contentContainer, 
  wrapContainer, 
  halfScreenContainer 
} from 'fog-ui';
import { useTheme, Box, Card, Typography } from '@mui/material';

function Dashboard() {
  const theme = useTheme();
  const pageStyles = pageContainer(theme);
  const contentStyles = contentContainer(theme);
  const wrapStyles = wrapContainer(theme);
  const splitStyles = halfScreenContainer(theme);
  
  return (
    <Box sx={pageStyles.root}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4">Dashboard</Typography>
      </Box>
      
      {/* Main Content */}
      <Box sx={contentStyles}>
        {/* Card Grid */}
        <Box sx={wrapStyles}>
          <Card sx={{ p: 2, width: 250 }}>
            <Typography>Card 1</Typography>
          </Card>
          <Card sx={{ p: 2, width: 250 }}>
            <Typography>Card 2</Typography>
          </Card>
          <Card sx={{ p: 2, width: 250 }}>
            <Typography>Card 3</Typography>
          </Card>
        </Box>
        
        {/* Split Layout */}
        <Box sx={{ ...splitStyles, mt: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography>Left Panel</Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Typography>Right Panel</Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
```

---

## Best Practices

### 1. Always Use Theme
Pass theme to style functions:

```typescript
// ✅ Good
const theme = useTheme();
const styles = pageContainer(theme);

// ❌ Bad
const styles = pageContainer();  // Won't have theme values
```

### 2. Combine Styles
Use spread operator to combine multiple styles:

```typescript
<Box sx={{
  ...contentContainer(theme),
  backgroundColor: 'custom.background',
  padding: theme.spacing(4),
}}>
  Content
</Box>
```

### 3. Responsive Design
Container styles include responsive breakpoints:

```typescript
// halfScreenContainer automatically stacks on mobile
<Box sx={halfScreenContainer(theme)}>
  <div>Column 1</div>
  <div>Column 2</div>
</Box>
```

---

## Testing

All style utilities are thoroughly tested with 100% coverage:

- Theme integration and spacing
- Responsive behavior
- Return types and structure
- Edge cases

Run tests:
```bash
npm test -- src/style/muiComponentStyles/__tests__
```

---

## Troubleshooting

**Issue:** Styles not applying theme colors  
**Solution:** Ensure you're passing `useTheme()` result to style functions

**Issue:** Responsive layout not working  
**Solution:** Check viewport meta tag in HTML and browser console for CSS errors

**Issue:** Container not scrolling  
**Solution:** Verify parent has defined height for `overflow: auto` to work
