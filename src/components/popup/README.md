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
  open: boolean;                    					// Controls modal visibility
  onClose: () => void;              					// Close callback
  title: string;                    					// Modal title (required)
  component: React.ReactNode;        					// Modal content (required)
  buttons?: { text: string; onClick: () => void }[];	// Optional footer action buttons
}
```

---

## Usage

### Basic Modal

```typescript
import { useState } from 'react';
import { Popup } from 'fog-ui';
import { Button, Box, Typography } from '@mui/material';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
        component={
          <Box sx={{ p: 2 }}>
            <Typography>Modal content goes here</Typography>
          </Box>
        }
      />
    </>
  );
}
```

### With Action Buttons

```typescript
<Popup
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  component={
    <Box sx={{ p: 2 }}>
      <Typography>Are you sure you want to proceed?</Typography>
    </Box>
  }
  buttons={[
    { text: 'Cancel', onClick: () => setOpen(false) },
    { text: 'Confirm', onClick: handleConfirm }
  ]}
/>
```

### Different Sizes

The Popup uses `maxWidth="sm"` by default (fixed in component). Content fills available space within the dialog. Use Box/Stack with proper spacing for responsive layouts:

```typescript
// Standard small modal (default)
<Popup 
  open={open} 
  onClose={handleClose}
  title="Small Modal"
  component={
    <Box sx={{ p: 2 }}>
      <Typography>Small modal content</Typography>
    </Box>
  }
/>

// Customize content layout with Stack
<Popup 
  open={open} 
  onClose={handleClose}
  title="Form Modal"
  component={
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField label="Name" fullWidth />
        <TextField label="Email" fullWidth />
        <Typography variant="body2" color="textSecondary">
          Additional form fields as needed
        </Typography>
      </Stack>
    </Box>
  }
/>
```

---

## Complete Example

```typescript
import { useState } from 'react';
import { Popup } from 'fog-ui';
import { Button, TextField, Box, Stack, Typography } from '@mui/material';

function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = async () => {
    try {
      await createUser({ name, email });
      setOpen(false);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Failed to create user', error);
    }
  };
  
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add User
      </Button>
      
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        title="Create New User"
        component={
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
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
            </Stack>
          </Box>
        }
        buttons={[
          { text: 'Cancel', onClick: () => setOpen(false) },
          { 
            text: 'Create User', 
            onClick: handleSubmit 
          }
        ]}
      />
    </>
  );
}
```

---

## Best Practices

1. **Wrap content in Box/Stack** - Use `<Box sx={{ p: 2 }}>` to add padding to component content  
2. **Close handlers** - Always provide `onClose` callback  
3. **Form validation** - Validate inputs before button onClick handlers  
4. **Button array** - Pass `buttons` as array of `{ text, onClick }` objects  
5. **Keyboard navigation** - Escape key and clicking outside automatically close modal  
6. **Title required** - `title` prop is required and shown in DialogTitle

---

## Testing

Run tests:
```bash
npm test -- src/components/popup/__tests__
```
