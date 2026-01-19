# Forms Module - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `forms` module provides a comprehensive form solution with dynamic field types, validation, API integration, and customizable layouts. Features include GenericForm (data-driven forms), PopUpForm (modal forms), and SearchForm (filter forms).

### Key Features

- ✅ **12+ Field Types** - Text, email, select, multiselect, switch, rating, date, file, and more
- ✅ **Built-in Validation** - Email, URL, phone, min/max length, custom rules
- ✅ **API Integration** - Fetch select options from APIs dynamically
- ✅ **Modal Support** - PopUpForm for dialog-based forms
- ✅ **Search Forms** - Specialized SearchForm for filtering data
- ✅ **Responsive Layout** - Full-width and half-width field support
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Production Tested** - Comprehensive test coverage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Form Components                           │
│                                                              │
│  GenericForm                                                │
│    ├─> State: formData, errors                             │
│    ├─> Validation: Built-in rules + custom                 │
│    ├─> Fields: Dynamic rendering based on type             │
│    └─> Submit: Validates & calls onSubmit                  │
│                                                              │
│  PopUpForm                                                  │
│    ├─> Wraps: GenericForm in Material-UI Dialog            │
│    └─> Controls: open/close state                          │
│                                                              │
│  SearchForm                                                 │
│    ├─> Simplified: No submit button by default             │
│    ├─> Auto-search: Calls onSearch on field change         │
│    └─> Use case: Filtering, searching, quick filters       │
└─────────────────────────────────────────────────────────────┘
```

---

## Components Reference

### 1. GenericForm

**Purpose:** Data-driven form component with validation and dynamic fields.

**Props:**
```typescript
interface FormProps {
  fields: FormField[];              // Array of field configurations
  onSubmit?: (values: Record<string, any>) => void;
  submitButtonText?: string;        // Default: 'Submit'
  cancelButtonText?: string;        // Default: 'Cancel'
  onCancel?: () => void;
  customButtons?: CustomButton[];   // Additional custom buttons
  initialValues?: Record<string, any>;
}

interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  onChange?: (value: string) => void;
  options?: Option[];               // For select/multiselect
  placeholder?: string;
  validations?: ValidationRule[];
  defaultValue?: any;
  apiEndpoint?: string;             // Fetch options from API
  optionLabelKey?: string;          // Key for option label in API response
  optionValueKey?: string;          // Key for option value in API response
  width?: 'full' | 'half';         // Field width (responsive)
}
```

**Supported Field Types:**
- `text` - Standard text input
- `email` - Email input with validation
- `password` - Password input (masked)
- `number` - Numeric input
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `multiselect` - Multiple selection dropdown
- `switch` - Toggle switch (boolean)
- `rating` - Star rating (1-5)
- `date` - Date picker
- `datetime` - Date and time picker
- `daterange` - Date range picker
- `radio` - Radio button group
- `file` - File upload
- `image` - Image upload
- `video` - Video upload

**Usage Example:**
```typescript
import { GenericForm } from 'fog-ui';

function UserForm() {
  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 50,
      width: 'half',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validations: [{ rule: 'email' }],
      width: 'half',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' },
      ],
      defaultValue: 'user',
      width: 'half',
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      placeholder: 'Tell us about yourself...',
      maxLength: 500,
    },
    {
      name: 'newsletter',
      label: 'Subscribe to newsletter',
      type: 'switch',
      defaultValue: false,
    },
  ];
  
  const handleSubmit = (values: Record<string, any>) => {
    console.log('Form submitted:', values);
    // API call to save data
  };
  
  return (
    <GenericForm
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create User"
      cancelButtonText="Reset"
      onCancel={() => console.log('Form cancelled')}
    />
  );
}
```

### 2. PopUpForm

**Purpose:** Form displayed in a Material-UI Dialog modal.

**Props:**
```typescript
interface PopUpFormProps {
  fields: FormField[];
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: Record<string, any>) => void;
  title?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  initialValues?: Record<string, any>;
}
```

**Usage Example:**
```typescript
import { useState } from 'react';
import { PopUpForm } from 'fog-ui';
import { Button } from '@mui/material';

function UserManagement() {
  const [open, setOpen] = useState(false);
  
  const fields: FormField[] = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ];
  
  const handleSubmit = (values: Record<string, any>) => {
    console.log('User created:', values);
    setOpen(false);
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Add User</Button>
      
      <PopUpForm
        open={open}
        onClose={() => setOpen(false)}
        fields={fields}
        onSubmit={handleSubmit}
        title="Create New User"
        submitButtonText="Create"
      />
    </>
  );
}
```

### 3. SearchForm

**Purpose:** Simplified form for search/filter functionality.

**Props:**
```typescript
interface SearchFormProps {
  fields: FormField[];
  onSearch: (values: Record<string, any>) => void;
  searchButtonText?: string;
  clearButtonText?: string;
  onClear?: () => void;
  autoSearch?: boolean;  // Trigger search on field change
}
```

**Usage Example:**
```typescript
import { SearchForm } from 'fog-ui';

function UserListWithSearch() {
  const [users, setUsers] = useState<User[]>([]);
  
  const searchFields: FormField[] = [
    {
      name: 'name',
      label: 'Search by name',
      type: 'text',
      placeholder: 'Enter name...',
      width: 'half',
    },
    {
      name: 'role',
      label: 'Filter by role',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      width: 'half',
    },
  ];
  
  const handleSearch = async (filters: Record<string, any>) => {
    const response = await fetch(`/api/users?${new URLSearchParams(filters)}`);
    const data = await response.json();
    setUsers(data);
  };
  
  const handleClear = () => {
    setUsers([]);
  };
  
  return (
    <Box>
      <SearchForm
        fields={searchFields}
        onSearch={handleSearch}
        onClear={handleClear}
        searchButtonText="Search"
        clearButtonText="Clear Filters"
      />
      
      <List>
        {users.map(user => (
          <ListItem key={user.id}>{user.name}</ListItem>
        ))}
      </List>
    </Box>
  );
}
```

---

## Validation

### Built-in Validation Rules

The forms module includes several built-in validation rules:

```typescript
export const validationRules = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Invalid email address';
  },
  
  url: (value: string) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },
  
  phone: (value: string) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(value) ? null : 'Invalid phone number';
  },
  
  minLength: (value: string, min: number) => {
    return value.length >= min ? null : `Minimum ${min} characters required`;
  },
  
  maxLength: (value: string, max: number) => {
    return value.length <= max ? null : `Maximum ${max} characters allowed`;
  },
  
  required: (value: any) => {
    return value && value !== '' ? null : 'This field is required';
  },
};
```

### Using Validation

```typescript
const fields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validations: [
      { rule: 'email' },
      { rule: 'minLength', args: [5] },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validations: [
      { rule: 'minLength', args: [8] },
      { rule: 'maxLength', args: [50] },
    ],
  },
];
```

### Custom Validation

```typescript
// Define custom validation function
const customValidation = (value: string) => {
  if (value.includes('test')) {
    return 'Cannot contain "test"';
  }
  return null;
};

// Add to field configuration
const fields: FormField[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    validations: [
      { rule: customValidation },  // Custom function
    ],
  },
];
```

---

## API Integration

### Dynamic Select Options

Fetch select/multiselect options from an API:

```typescript
const fields: FormField[] = [
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    apiEndpoint: '/api/countries',     // API endpoint
    optionLabelKey: 'name',             // Key for label in response
    optionValueKey: 'code',             // Key for value in response
    required: true,
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'multiselect',
    apiEndpoint: '/api/tags',
    optionLabelKey: 'label',
    optionValueKey: '_id',
  },
];

// Expected API response format:
// [
//   { code: 'US', name: 'United States' },
//   { code: 'CA', name: 'Canada' },
//   ...
// ]
```

---

## Best Practices

### 1. Field Organization
Group related fields and use width property for layout:

```typescript
const fields: FormField[] = [
  // Personal info - side by side
  { name: 'firstName', label: 'First Name', type: 'text', width: 'half' },
  { name: 'lastName', label: 'Last Name', type: 'text', width: 'half' },
  
  // Contact - side by side
  { name: 'email', label: 'Email', type: 'email', width: 'half' },
  { name: 'phone', label: 'Phone', type: 'text', width: 'half' },
  
  // Address - full width
  { name: 'address', label: 'Address', type: 'textarea', width: 'full' },
];
```

### 2. Required Fields
Always mark required fields and provide clear validation messages:

```typescript
// ✅ Good
{ name: 'email', label: 'Email', type: 'email', required: true }

// ❌ Bad
{ name: 'email', label: 'Email (required)', type: 'email' }  // Don't put in label
```

### 3. Default Values
Provide sensible defaults to improve UX:

```typescript
const fields: FormField[] = [
  { name: 'newsletter', type: 'switch', defaultValue: true },
  { name: 'role', type: 'select', defaultValue: 'user', options: [...] },
];
```

### 4. Placeholder Text
Use placeholders for guidance, not labels:

```typescript
// ✅ Good
{ 
  name: 'bio', 
  label: 'Biography', 
  type: 'textarea',
  placeholder: 'Tell us about your experience and skills...'
}

// ❌ Bad
{ name: 'bio', type: 'textarea', placeholder: 'Biography' }  // Use label instead
```

### 5. Custom Buttons
Use custom buttons for additional actions:

```typescript
<GenericForm
  fields={fields}
  onSubmit={handleSubmit}
  customButtons={[
    {
      text: 'Save Draft',
      onClick: handleSaveDraft,
      color: 'secondary',
      variant: 'outlined',
    },
    {
      text: 'Preview',
      onClick: handlePreview,
      color: 'info',
      variant: 'text',
    },
  ]}
/>
```

---

## Complete Examples

### Registration Form

```typescript
import { GenericForm, FormField } from 'fog-ui';
import { useToast } from 'fog-ui';

function RegistrationForm() {
  const toast = useToast();
  
  const fields: FormField[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 20,
      width: 'full',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validations: [{ rule: 'email' }],
      width: 'half',
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      validations: [{ rule: 'phone' }],
      width: 'half',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      minLength: 8,
      validations: [{ rule: 'minLength', args: [8] }],
      width: 'half',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      required: true,
      width: 'half',
    },
    {
      name: 'agreeToTerms',
      label: 'I agree to the terms and conditions',
      type: 'switch',
      required: true,
      defaultValue: false,
    },
  ];
  
  const handleSubmit = async (values: Record<string, any>) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        toast.success('Registration successful!');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <GenericForm
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Register"
      />
    </Box>
  );
}
```

---

## Testing

The forms module is thoroughly tested with comprehensive test suites covering:
- Field rendering for all types
- Validation rules and error display
- Form submission and data handling
- API integration for dynamic options
- Initial values and default values
- Custom buttons and callbacks

Run tests:
```bash
npm test -- src/components/forms/__tests__
```

---

## Troubleshooting

**Issue:** Select options not loading from API  
**Solution:** Verify `apiEndpoint`, `optionLabelKey`, and `optionValueKey` are correct

**Issue:** Validation not triggering  
**Solution:** Ensure validation rules are properly defined in `validations` array

**Issue:** Initial values not applying  
**Solution:** Check that `initialValues` keys match field `name` properties

**Issue:** Form not submitting  
**Solution:** Verify `onSubmit` prop is provided and all required fields are filled
