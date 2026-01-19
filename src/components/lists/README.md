# Lists Components - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `lists` module provides various list components for displaying collections of data including standard lists, accordion lists, and lists with loading indicators.

### Key Features

- ✅ **Multiple List Types** - List, AccordionList, CircularProgressList, GenericListView
- ✅ **Customizable** - Custom rendering for list items
- ✅ **Loading States** - Built-in loading indicators
- ✅ **Expandable** - Accordion-style expandable sections
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Accessible** - Semantic HTML and ARIA labels

---

## Components

### 1. List

**Purpose:** Standard Material-UI list with custom item rendering.

**Props:**
```typescript
interface ListProps<T> {
  items: T[];                       // Array of items
  renderItem: (item: T, index: number) => ReactNode;  // Custom renderer
  divider?: boolean;                // Show dividers between items
  dense?: boolean;                  // Compact spacing
}
```

**Usage:**
```typescript
import { List } from 'fog-ui';
import { ListItem, ListItemText } from '@mui/material';

function UserList() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  return (
    <List
      items={users}
      renderItem={(user) => (
        <ListItem key={user.id}>
          <ListItemText 
            primary={user.name} 
            secondary={user.email} 
          />
        </ListItem>
      )}
      divider
    />
  );
}
```

---

### 2. AccordionList

**Purpose:** Expandable/collapsible list sections.

**Props:**
```typescript
interface AccordionListProps {
  sections: AccordionSection[];
  defaultExpanded?: number;         // Initially expanded section
  onChange?: (index: number) => void;
}

interface AccordionSection {
  title: string;
  content: ReactNode;
  disabled?: boolean;
}
```

**Usage:**
```typescript
import { AccordionList } from 'fog-ui';

function FAQSection() {
  const sections = [
    {
      title: 'What is this?',
      content: <p>This is a FAQ section using AccordionList.</p>,
    },
    {
      title: 'How do I use it?',
      content: <p>Simply define sections with title and content.</p>,
    },
    {
      title: 'Can I disable sections?',
      content: <p>Yes, set disabled: true on any section.</p>,
      disabled: false,
    },
  ];
  
  return <AccordionList sections={sections} defaultExpanded={0} />;
}
```

---

### 3. CircularProgressList

**Purpose:** List with loading state and circular progress indicator.

**Props:**
```typescript
interface CircularProgressListProps<T> {
  items: T[];
  loading: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  loadingMessage?: string;
  emptyMessage?: string;
}
```

**Usage:**
```typescript
import { CircularProgressList } from 'fog-ui';
import { ListItem, ListItemText } from '@mui/material';

function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);
  
  return (
    <CircularProgressList
      items={data}
      loading={loading}
      loadingMessage="Loading data..."
      emptyMessage="No items found"
      renderItem={(item) => (
        <ListItem key={item.id}>
          <ListItemText primary={item.name} />
        </ListItem>
      )}
    />
  );
}
```

---

### 4. GenericListView

**Purpose:** Generic list with built-in empty state and custom rendering.

**Props:**
```typescript
interface GenericListViewProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
  title?: string;
}
```

**Usage:**
```typescript
import { GenericListView } from 'fog-ui';
import { Card, CardContent, Typography } from '@mui/material';

function ProductList() {
  const products = [
    { id: 1, name: 'Product A', price: 29.99 },
    { id: 2, name: 'Product B', price: 49.99 },
  ];
  
  return (
    <GenericListView
      items={products}
      title="Products"
      emptyMessage="No products available"
      renderItem={(product) => (
        <Card key={product.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Typography>${product.price}</Typography>
          </CardContent>
        </Card>
      )}
    />
  );
}
```

---

## Complete Example

```typescript
import { useState, useEffect } from 'react';
import { CircularProgressList, AccordionList } from 'fog-ui';
import { 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  IconButton,
  Box,
  Typography 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  const handleEdit = (user: User) => {
    console.log('Edit:', user);
  };
  
  const handleDelete = (user: User) => {
    console.log('Delete:', user);
  };
  
  // FAQ sections
  const faqSections = [
    {
      title: 'How to add users?',
      content: <Typography>Click the "Add User" button in the top right.</Typography>,
    },
    {
      title: 'How to edit users?',
      content: <Typography>Click the edit icon next to any user.</Typography>,
    },
  ];
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      
      {/* User List */}
      <CircularProgressList
        items={users}
        loading={loading}
        loadingMessage="Loading users..."
        emptyMessage="No users found. Add your first user to get started."
        renderItem={(user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" onClick={() => handleEdit(user)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(user)}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar src={user.avatar}>{user.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={`${user.email} • ${user.role}`}
            />
          </ListItem>
        )}
      />
      
      {/* FAQ Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>FAQ</Typography>
        <AccordionList sections={faqSections} />
      </Box>
    </Box>
  );
}
```

---

## Best Practices

1. **Loading States** - Always show loading indicators for async data
2. **Empty States** - Provide helpful empty messages with actions
3. **Performance** - Use React.memo for expensive list items
4. **Accessibility** - Use semantic HTML and ARIA labels

---

## Testing

Run tests:
```bash
npm test -- src/components/lists/__tests__
```
