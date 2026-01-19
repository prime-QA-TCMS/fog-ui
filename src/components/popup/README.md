# Popup/Modal Component - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `popup` component provides a customizable Material-UI Dialog/Modal wrapper for displaying content in overlay modals.

### Key Features

- ✅ **Flexible Content** - Any React component as modal content
- ✅ **Customizable** - Title, actions, size, and styling
- ✅ **Accessible** - ARIA labels and focus management
- ✅ **Responsive** - Mobile-friendly layouts
- ✅ **Type Safety** - Full TypeScript support

---

## Props

```typescript
interface PopupProps {
  open: boolean;                    // Controls modal visibility
  onClose: () => void;              // Close callback
  title?: string;                   // Modal title
  children: ReactNode;              // Modal content
  actions?: ReactNode;              // Footer actions (buttons)
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Max width
  fullWidth?: boolean;              // Use full width
  fullScreen?: boolean;             // Full screen on mobile
}
```

---

## Usage

### Basic Modal

```typescript
import { useState } from 'react';
import { Popup } from 'fog-ui';
import { Button, Typography } from '@mui/material';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
      >
        <Typography>Modal content goes here</Typography>
      </Popup>
    </>
  );
}
```

### With Actions

```typescript
<Popup
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  actions={
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <Typography>Are you sure you want to proceed?</Typography>
</Popup>
```

### Different Sizes

```typescript
// Small modal
<Popup open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <Typography>Small modal content</Typography>
</Popup>

// Large modal
<Popup open={open} onClose={handleClose} maxWidth="lg" fullWidth>
  <Typography>Large modal content</Typography>
</Popup>

// Full screen (mobile)
<Popup open={open} onClose={handleClose} fullScreen>
  <Typography>Full screen modal</Typography>
</Popup>
```

---

## Complete Example

```typescript
import { useState } from 'react';
import { Popup } from 'fog-ui';
import { Button, TextField, Box } from '@mui/material';
import { useToast } from 'fog-ui';

function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();
  
  const handleSubmit = async () => {
    try {
      await createUser({ name, email });
      toast.success('User created successfully');
      setOpen(false);
      setName('');
      setEmail('');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };
  
  const actions = (
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={!name || !email}
      >
        Create User
      </Button>
    </>
  );
  
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add User
      </Button>
      
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        title="Create New User"
        maxWidth="sm"
        fullWidth
        actions={actions}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </Box>
      </Popup>
    </>
  );
}
```

---

## Best Practices

1. **Close Handlers** - Always provide onClose callback
2. **Form Validation** - Validate before allowing submission
3. **Loading States** - Show loading indicators during async operations
4. **Keyboard Navigation** - Ensure Escape key closes modal

---

## Testing

Run tests:
```bash
npm test -- src/components/popup/__tests__
```
