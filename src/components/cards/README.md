# Card Components - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `cards` module provides various card components for displaying data including filter cards, permission cards, user group cards, metric cards, and card containers.

### Key Features

- ✅ **Multiple Card Types** - FilterFormCard, PermissionCard, UserGroupCard, MetricCard, CardView
- ✅ **Customizable** - Flexible styling and content
- ✅ **Responsive** - Mobile-friendly layouts
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Material-UI** - Built on MUI Card component

---

## Components

### 1. CardView

**Purpose:** Generic card component for custom content.

**Props:**
```typescript
interface CardViewProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  elevation?: number;
}
```

**Usage:**
```typescript
import { CardView } from 'fog-ui';
import { Button } from '@mui/material';

function MyCard() {
  return (
    <CardView
      title="Card Title"
      actions={<Button size="small">Action</Button>}
      elevation={2}
    >
      <p>Card content goes here</p>
    </CardView>
  );
}
```

---

### 2. FilterFormCard

**Purpose:** Card containing a form for filtering/searching.

**Props:**
```typescript
interface FilterFormCardProps {
  fields: FormField[];
  onFilter: (values: Record<string, any>) => void;
  onClear?: () => void;
}
```

**Usage:**
```typescript
import { FilterFormCard } from 'fog-ui';

function SearchCard() {
  const fields = [
    { name: 'search', label: 'Search', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [...] },
  ];
  
  const handleFilter = (values) => {
    console.log('Filter:', values);
  };
  
  return (
    <FilterFormCard
      fields={fields}
      onFilter={handleFilter}
      onClear={() => console.log('Clear filters')}
    />
  );
}
```

---

### 3. MetricCard / MetricCardGrid

**Purpose:** Display key metrics and statistics.

**Props:**
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

interface MetricCardGridProps {
  metrics: MetricCardProps[];
  columns?: number;
}
```

**Usage:**
```typescript
import { MetricCardGrid } from 'fog-ui';
import { TrendingUp, People, AttachMoney } from '@mui/icons-material';

function Dashboard() {
  const metrics = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <People />,
      trend: 'up',
      trendValue: '+12%',
      color: 'primary',
    },
    {
      title: 'Revenue',
      value: '$45,678',
      icon: <AttachMoney />,
      trend: 'up',
      trendValue: '+8%',
      color: 'success',
    },
    {
      title: 'Active Sessions',
      value: '456',
      icon: <TrendingUp />,
      trend: 'down',
      trendValue: '-3%',
      color: 'warning',
    },
  ];
  
  return <MetricCardGrid metrics={metrics} columns={3} />;
}
```

---

### 4. PermissionCard

**Purpose:** Display and manage user permissions.

**Props:**
```typescript
interface PermissionCardProps {
  permissions: Permission[];
  onToggle: (id: string, enabled: boolean) => void;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}
```

**Usage:**
```typescript
import { PermissionCard } from 'fog-ui';

function UserPermissions() {
  const permissions = [
    { id: '1', name: 'Read', description: 'View data', enabled: true },
    { id: '2', name: 'Write', description: 'Edit data', enabled: false },
    { id: '3', name: 'Delete', description: 'Remove data', enabled: false },
  ];
  
  const handleToggle = (id, enabled) => {
    console.log(`Permission ${id} ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  return <PermissionCard permissions={permissions} onToggle={handleToggle} />;
}
```

---

### 5. UserGroupCard

**Purpose:** Display user group information.

**Props:**
```typescript
interface UserGroupCardProps {
  group: UserGroup;
  onEdit?: (group: UserGroup) => void;
  onDelete?: (group: UserGroup) => void;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}
```

**Usage:**
```typescript
import { UserGroupCard } from 'fog-ui';

function GroupsList() {
  const group = {
    id: '1',
    name: 'Administrators',
    description: 'Full system access',
    memberCount: 5,
  };
  
  return (
    <UserGroupCard
      group={group}
      onEdit={(g) => console.log('Edit:', g)}
      onDelete={(g) => console.log('Delete:', g)}
    />
  );
}
```

---

### 6. CardListContainer

**Purpose:** Grid container for displaying multiple cards.

**Props:**
```typescript
interface CardListContainerProps {
  children: ReactNode;
  columns?: number;
  spacing?: number;
}
```

**Usage:**
```typescript
import { CardListContainer, CardView } from 'fog-ui';

function CardGrid() {
  return (
    <CardListContainer columns={3} spacing={2}>
      <CardView title="Card 1">Content 1</CardView>
      <CardView title="Card 2">Content 2</CardView>
      <CardView title="Card 3">Content 3</CardView>
    </CardListContainer>
  );
}
```

---

## Complete Example

```typescript
import { MetricCardGrid, FilterFormCard, CardListContainer, CardView } from 'fog-ui';
import { People, AttachMoney, ShoppingCart } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

function DashboardPage() {
  // Metrics
  const metrics = [
    { title: 'Users', value: '1,234', icon: <People />, trend: 'up', trendValue: '+12%' },
    { title: 'Revenue', value: '$45K', icon: <AttachMoney />, trend: 'up', trendValue: '+8%' },
    { title: 'Orders', value: '789', icon: <ShoppingCart />, trend: 'down', trendValue: '-3%' },
  ];
  
  // Filter fields
  const filterFields = [
    { name: 'dateRange', label: 'Date Range', type: 'daterange' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { label: 'All', value: '' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]},
  ];
  
  const handleFilter = (values) => {
    console.log('Applying filters:', values);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Metrics */}
      <MetricCardGrid metrics={metrics} columns={3} />
      
      {/* Filters */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <FilterFormCard
          fields={filterFields}
          onFilter={handleFilter}
          onClear={() => console.log('Clear')}
        />
      </Box>
      
      {/* Content Cards */}
      <CardListContainer columns={2} spacing={2}>
        <CardView title="Recent Activity">
          <Typography>No recent activity</Typography>
        </CardView>
        <CardView title="Notifications">
          <Typography>You have 3 new notifications</Typography>
        </CardView>
      </CardListContainer>
    </Box>
  );
}
```

---

## Best Practices

1. **Consistent Styling** - Use same elevation/spacing across cards
2. **Meaningful Metrics** - Show actionable data in metric cards
3. **Grid Layouts** - Use CardListContainer for consistent spacing
4. **Responsive** - Test on mobile devices

---

## Testing

Run tests:
```bash
npm test -- src/components/cards/__tests__
```
