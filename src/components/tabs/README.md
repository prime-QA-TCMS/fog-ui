# Tabs Component - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `Tabs` component provides a Material-UI based tabbed interface for organizing content into separate panels.

### Key Features

- ✅ **Dynamic Tabs** - Define tabs with labels and content
- ✅ **Controlled/Uncontrolled** - Supports both modes
- ✅ **Custom Styling** - Customizable tab appearance
- ✅ **Accessible** - ARIA labels and keyboard navigation
- ✅ **Type Safety** - Full TypeScript support

---

## Props

```typescript
interface TabsProps {
  tabs: Tab[];                      // Array of tab configurations
  defaultTab?: number;              // Initially selected tab (default: 0)
  onChange?: (index: number) => void;  // Tab change callback
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
}

interface Tab {
  label: string;                    // Tab label
  content: ReactNode;               // Tab panel content
  disabled?: boolean;               // Disable tab
  icon?: ReactNode;                 // Optional icon
}
```

---

## Usage

### Basic Tabs

```typescript
import { Tabs } from 'fog-ui';

function MyComponent() {
  const tabs = [
    {
      label: 'Overview',
      content: <div>Overview content here</div>,
    },
    {
      label: 'Details',
      content: <div>Details content here</div>,
    },
    {
      label: 'Settings',
      content: <div>Settings content here</div>,
    },
  ];
  
  return <Tabs tabs={tabs} defaultTab={0} />;
}
```

### With Icons

```typescript
import { Tabs } from 'fog-ui';
import { Home, Settings, Info } from '@mui/icons-material';

function MyComponent() {
  const tabs = [
    {
      label: 'Home',
      icon: <Home />,
      content: <HomePage />,
    },
    {
      label: 'Settings',
      icon: <Settings />,
      content: <SettingsPage />,
    },
    {
      label: 'About',
      icon: <Info />,
      content: <AboutPage />,
    },
  ];
  
  return <Tabs tabs={tabs} />;
}
```

### Controlled Tabs

```typescript
import { useState } from 'react';
import { Tabs } from 'fog-ui';

function MyComponent() {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { label: 'Tab 1', content: <div>Content 1</div> },
    { label: 'Tab 2', content: <div>Content 2</div> },
  ];
  
  return (
    <Tabs
      tabs={tabs}
      defaultTab={activeTab}
      onChange={(index) => {
        setActiveTab(index);
        console.log('Tab changed to:', index);
      }}
    />
  );
}
```

### With Disabled Tabs

```typescript
const tabs = [
  { label: 'Available', content: <div>Content</div> },
  { label: 'Disabled', content: <div>Hidden</div>, disabled: true },
  { label: 'Active', content: <div>More content</div> },
];
```

---

## Complete Example

```typescript
import { useState } from 'react';
import { Tabs } from 'fog-ui';
import { Box, Typography } from '@mui/material';
import { AccountCircle, Settings, Security } from '@mui/icons-material';

function UserProfile() {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    {
      label: 'Profile',
      icon: <AccountCircle />,
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Profile Information</Typography>
          <Typography>Name: John Doe</Typography>
          <Typography>Email: john@example.com</Typography>
        </Box>
      ),
    },
    {
      label: 'Settings',
      icon: <Settings />,
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Account Settings</Typography>
          {/* Settings form */}
        </Box>
      ),
    },
    {
      label: 'Security',
      icon: <Security />,
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Security Settings</Typography>
          {/* Security options */}
        </Box>
      ),
    },
  ];
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>User Profile</Typography>
      <Tabs
        tabs={tabs}
        defaultTab={activeTab}
        onChange={setActiveTab}
        variant="standard"
      />
    </Box>
  );
}
```

---

## Best Practices

1. **Keep Tab Content Light** - Lazy load heavy content
2. **Meaningful Labels** - Use clear, concise tab labels
3. **Consistent Icons** - Use icons consistently across tabs
4. **Tab Count** - Limit to 3-7 tabs for optimal UX

---

## Testing

Run tests:
```bash
npm test -- src/components/tabs/__tests__
```
