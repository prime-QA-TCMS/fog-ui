# Table Components - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `table` module provides a complete data table solution with support for nested tables, custom rendering, loading states, and expandable rows. Built on Material-UI Table components with full TypeScript support.

### Key Features

- ✅ **Dynamic Columns** - Configure columns with custom rendering
- ✅ **Nested Tables** - Expandable rows with child data
- ✅ **Loading States** - Skeleton loading UI
- ✅ **Empty States** - Customizable empty message
- ✅ **Custom Rendering** - Per-row and per-cell custom components
- ✅ **Type Safety** - Full TypeScript generics
- ✅ **Accessible** - ARIA labels and semantic HTML
- ✅ **Production Tested** - Comprehensive test coverage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DataTable<T>                              │
│                                                              │
│  Props: data, columns, nestedConfig, loading                │
│                                                              │
│  ├─> TableHeader                                            │
│  │     └─> Renders column headers                           │
│  │                                                            │
│  ├─> DataLoading (if loading)                               │
│  │     └─> Shows skeleton rows                              │
│  │                                                            │
│  ├─> NoDataTableRow (if empty)                              │
│  │     └─> Shows empty message                              │
│  │                                                            │
│  └─> DataRow (for each item)                                │
│        ├─> Renders table cells                              │
│        ├─> Expand button (if nestedConfig)                  │
│        └─> NestedTable (when expanded)                      │
│              └─> Recursive DataTable for nested data        │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. DataTable

**Purpose:** Main table component with support for nested data.

**Props:**
```typescript
interface DataTableProps<T> {
  title?: string;                   // Table title
  data: T[];                         // Array of data items
  columns: Column<T>[];              // Column definitions
  loading?: boolean;                 // Show loading state
  emptyMessage?: string;             // Custom empty message
  nestedConfig?: NestedConfig<T>;    // Nested table configuration
  rowComponent?: (item: T) => ReactNode;  // Custom row content
  rowExtraComponent?: (item: T) => ReactNode;  // Additional row content
  nestedHeaderComponent?: (item: T) => ReactNode;  // Custom nested header
  onRowExpand?: (item: T) => void;   // Callback when row expands
}

interface Column<T> {
  key: keyof T | string;             // Data key or custom key
  label: string;                     // Column header text
  align?: 'left' | 'right' | 'center';  // Text alignment
  render?: (item: T) => ReactNode;   // Custom cell rendering
}

interface NestedConfig<T> {
  getNestedData: (item: T) => any[];  // Function to get child data
  nestedColumns: Column<any>[];       // Columns for nested table
  loading?: boolean;                  // Loading state for nested data
}
```

---

## Usage

### Basic Table

```typescript
import { DataTable, Column } from 'fog-ui';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const columns: Column<User>[] = [
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'role', label: 'Role', align: 'center' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (user) => (
        <Chip
          label={user.status}
          color={user.status === 'active' ? 'success' : 'default'}
        />
      ),
    },
  ];
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  return (
    <DataTable
      title="Users"
      data={users}
      columns={columns}
      loading={loading}
      emptyMessage="No users found"
    />
  );
}
```

### Custom Cell Rendering

```typescript
const columns: Column<User>[] = [
  {
    key: 'name',
    label: 'Name',
    render: (user) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={user.avatar} sx={{ mr: 1 }} />
        <Typography>{user.name}</Typography>
      </Box>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'right',
    render: (user) => (
      <Box>
        <IconButton onClick={() => handleEdit(user)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(user)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
];
```

### Nested Table (Expandable Rows)

```typescript
import { DataTable, Column, NestedConfig } from 'fog-ui';

interface Project {
  _id: string;
  name: string;
  owner: string;
  tasks: Task[];
}

interface Task {
  _id: string;
  title: string;
  status: string;
  assignee: string;
}

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  
  const projectColumns: Column<Project>[] = [
    { key: 'name', label: 'Project Name' },
    { key: 'owner', label: 'Owner' },
  ];
  
  const taskColumns: Column<Task>[] = [
    { key: 'title', label: 'Task' },
    { key: 'status', label: 'Status' },
    { key: 'assignee', label: 'Assignee' },
  ];
  
  const nestedConfig: NestedConfig<Project> = {
    getNestedData: (project) => project.tasks,
    nestedColumns: taskColumns,
    loading: false,
  };
  
  return (
    <DataTable
      title="Projects"
      data={projects}
      columns={projectColumns}
      nestedConfig={nestedConfig}
      emptyMessage="No projects found"
    />
  );
}
```

### With Row Expand Callback

```typescript
function ProjectList() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const handleRowExpand = async (project: Project) => {
    // Fetch additional data when row expands
    const taskDetails = await fetchTaskDetails(project._id);
    setSelectedProject({ ...project, taskDetails });
  };
  
  return (
    <DataTable
      data={projects}
      columns={projectColumns}
      nestedConfig={nestedConfig}
      onRowExpand={handleRowExpand}
    />
  );
}
```

### Loading State

```typescript
function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await fetchData();
      setData(result);
      setLoading(false);
    }
    loadData();
  }, []);
  
  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}  // Shows skeleton loading rows
    />
  );
}
```

---

## Sub-Components

### TableHeader

**Purpose:** Renders column headers.

**Usage:** Automatically used by DataTable.

### DataLoading

**Purpose:** Displays skeleton loading rows.

**Usage:** Automatically shown when `loading={true}`.

### NoDataTableRow

**Purpose:** Displays empty state message.

**Usage:** Automatically shown when `data` array is empty.

### DataRow

**Purpose:** Renders individual table rows with expand functionality.

**Usage:** Automatically used by DataTable for each data item.

### NestedTable

**Purpose:** Renders nested table inside expanded rows.

**Usage:** Automatically shown when row is expanded and `nestedConfig` is provided.

---

## Best Practices

### 1. Column Configuration
Define columns separately for reusability:

```typescript
// ✅ Good
const userColumns: Column<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

<DataTable data={users} columns={userColumns} />

// ❌ Bad
<DataTable 
  data={users} 
  columns={[{ key: 'name', label: 'Name' }]}  // Inline definition
/>
```

### 2. Custom Rendering
Use `render` function for complex cells:

```typescript
{
  key: 'status',
  label: 'Status',
  render: (item) => (
    <Chip 
      label={item.status} 
      color={item.status === 'active' ? 'success' : 'error'}
    />
  ),
}
```

### 3. Loading States
Always handle loading states:

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().finally(() => setLoading(false));
}, []);

<DataTable data={data} columns={columns} loading={loading} />
```

### 4. Empty States
Provide meaningful empty messages:

```typescript
// ✅ Good
emptyMessage="No users found. Click 'Add User' to get started."

// ❌ Bad
emptyMessage="No data"
```

### 5. TypeScript Generics
Use proper typing for type safety:

```typescript
// ✅ Good
const columns: Column<User>[] = [...];
<DataTable<User> data={users} columns={columns} />

// ❌ Bad
const columns: any[] = [...];
<DataTable data={users} columns={columns} />
```

---

## Complete Example

```typescript
import { useState, useEffect } from 'react';
import { DataTable, Column, NestedConfig } from 'fog-ui';
import { Chip, IconButton, Box } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

interface Project {
  _id: string;
  name: string;
  owner: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  tasks: Task[];
}

interface Task {
  _id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetch('/api/projects').then(r => r.json());
        setProjects(data);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);
  
  const handleView = (project: Project) => {
    console.log('View:', project);
  };
  
  const handleEdit = (project: Project) => {
    console.log('Edit:', project);
  };
  
  const handleDelete = (project: Project) => {
    console.log('Delete:', project);
  };
  
  const projectColumns: Column<Project>[] = [
    {
      key: 'name',
      label: 'Project Name',
      align: 'left',
    },
    {
      key: 'owner',
      label: 'Owner',
      align: 'left',
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (project) => (
        <Chip
          label={project.status}
          color={
            project.status === 'active' ? 'success' :
            project.status === 'completed' ? 'info' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      align: 'center',
      render: (project) => new Date(project.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (project) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton size="small" onClick={() => handleView(project)}>
            <Visibility />
          </IconButton>
          <IconButton size="small" onClick={() => handleEdit(project)}>
            <Edit />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(project)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];
  
  const taskColumns: Column<Task>[] = [
    {
      key: 'title',
      label: 'Task',
      align: 'left',
    },
    {
      key: 'assignee',
      label: 'Assignee',
      align: 'left',
    },
    {
      key: 'priority',
      label: 'Priority',
      align: 'center',
      render: (task) => (
        <Chip
          label={task.priority}
          color={
            task.priority === 'high' ? 'error' :
            task.priority === 'medium' ? 'warning' : 'success'
          }
          size="small"
        />
      ),
    },
  ];
  
  const nestedConfig: NestedConfig<Project> = {
    getNestedData: (project) => project.tasks,
    nestedColumns: taskColumns,
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        title="Project Management"
        data={projects}
        columns={projectColumns}
        loading={loading}
        emptyMessage="No projects found. Create your first project to get started."
        nestedConfig={nestedConfig}
        onRowExpand={(project) => console.log('Expanded:', project.name)}
      />
    </Box>
  );
}
```

---

## Testing

The table components are thoroughly tested with comprehensive test coverage:

- Column rendering and alignment
- Custom cell rendering with `render` function
- Nested table expansion and collapse
- Loading states with skeleton rows
- Empty states with custom messages
- Row expand callbacks

Run tests:
```bash
npm test -- src/components/table/__tests__
```

---

## Troubleshooting

**Issue:** Nested table not expanding  
**Solution:** Ensure data items have `_id` property and `nestedConfig` is provided

**Issue:** Custom render function not working  
**Solution:** Check that `render` returns valid ReactNode

**Issue:** Loading state not showing  
**Solution:** Verify `loading` prop is set to `true`

**Issue:** Empty message not displaying  
**Solution:** Ensure `data` array is empty (length === 0)
