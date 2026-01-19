# Chart Components - Developer Documentation

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## Overview

The `charts` module provides data visualization components including pie charts and trend analytics charts built on popular charting libraries.

### Key Features

- ✅ **Pie Charts** - GenericPieChart for categorical data
- ✅ **Trend Analytics** - TrendAnalyticsChart for time-series data
- ✅ **Customizable** - Colors, labels, tooltips
- ✅ **Responsive** - Adapts to container size
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Interactive** - Hover effects and tooltips

---

## Components

### 1. GenericPieChart

**Purpose:** Display categorical data as pie or donut chart.

**Props:**
```typescript
interface GenericPieChartProps {
  data: PieChartData[];
  title?: string;
  variant?: 'pie' | 'donut';
  showLegend?: boolean;
  height?: number;
  colors?: string[];
}

interface PieChartData {
  label: string;
  value: number;
  color?: string;
}
```

**Usage:**
```typescript
import { GenericPieChart } from 'fog-ui';

function StatusDistribution() {
  const data = [
    { label: 'Active', value: 45, color: '#4caf50' },
    { label: 'Pending', value: 30, color: '#ff9800' },
    { label: 'Inactive', value: 15, color: '#f44336' },
    { label: 'Archived', value: 10, color: '#9e9e9e' },
  ];
  
  return (
    <GenericPieChart
      data={data}
      title="Project Status Distribution"
      variant="donut"
      showLegend={true}
      height={300}
    />
  );
}
```

**With Custom Colors:**
```typescript
const data = [
  { label: 'Category A', value: 100 },
  { label: 'Category B', value: 200 },
  { label: 'Category C', value: 150 },
];

const customColors = ['#1976D2', '#DC004E', '#388E3C'];

<GenericPieChart
  data={data}
  colors={customColors}
  title="Custom Colors"
/>
```

---

### 2. TrendAnalyticsChart

**Purpose:** Display time-series data with line or bar chart.

**Props:**
```typescript
interface TrendAnalyticsChartProps {
  data: TrendData[];
  title?: string;
  variant?: 'line' | 'bar' | 'area';
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showGrid?: boolean;
}

interface TrendData {
  date: string | Date;
  value: number;
  label?: string;
}
```

**Usage:**
```typescript
import { TrendAnalyticsChart } from 'fog-ui';

function UserGrowth() {
  const data = [
    { date: '2024-01', value: 100 },
    { date: '2024-02', value: 150 },
    { date: '2024-03', value: 180 },
    { date: '2024-04', value: 220 },
    { date: '2024-05', value: 280 },
  ];
  
  return (
    <TrendAnalyticsChart
      data={data}
      title="User Growth Over Time"
      variant="line"
      xAxisLabel="Month"
      yAxisLabel="Number of Users"
      height={400}
      showGrid={true}
    />
  );
}
```

**Multiple Series:**
```typescript
const multiSeriesData = [
  { date: '2024-01', value: 100, label: 'Series A' },
  { date: '2024-01', value: 80, label: 'Series B' },
  { date: '2024-02', value: 150, label: 'Series A' },
  { date: '2024-02', value: 120, label: 'Series B' },
];

<TrendAnalyticsChart
  data={multiSeriesData}
  title="Comparison"
  variant="bar"
/>
```

---

## Complete Example

```typescript
import { useState, useEffect } from 'react';
import { GenericPieChart, TrendAnalyticsChart } from 'fog-ui';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

interface AnalyticsData {
  statusDistribution: PieChartData[];
  userGrowth: TrendData[];
  revenueOverTime: TrendData[];
}

function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);
  
  if (loading) return <CircularProgress />;
  if (!data) return <Typography>No data available</Typography>;
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
      
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <GenericPieChart
                data={data.statusDistribution}
                title="Status Distribution"
                variant="donut"
                showLegend={true}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* User Growth Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <TrendAnalyticsChart
                data={data.userGrowth}
                title="User Growth"
                variant="line"
                xAxisLabel="Month"
                yAxisLabel="Users"
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TrendAnalyticsChart
                data={data.revenueOverTime}
                title="Revenue Over Time"
                variant="area"
                xAxisLabel="Date"
                yAxisLabel="Revenue ($)"
                height={400}
                showGrid={true}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
```

---

## Best Practices

### 1. Data Formatting
Ensure data is properly formatted:

```typescript
// ✅ Good - Consistent format
const data = [
  { label: 'A', value: 100 },
  { label: 'B', value: 200 },
];

// ❌ Bad - Inconsistent
const data = [
  { label: 'A', value: 100 },
  { name: 'B', count: 200 },  // Different keys
];
```

### 2. Meaningful Labels
Use clear, descriptive labels:

```typescript
// ✅ Good
{ label: 'Active Users', value: 1234 }

// ❌ Bad
{ label: 'AU', value: 1234 }
```

### 3. Color Consistency
Use theme colors or consistent palettes:

```typescript
const themeColors = [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.success.main,
];

<GenericPieChart data={data} colors={themeColors} />
```

### 4. Responsive Heights
Set appropriate heights for containers:

```typescript
// Mobile
<GenericPieChart height={250} />

// Desktop
<GenericPieChart height={400} />
```

---

## Chart Libraries

The charts module uses:
- **Recharts** - For React-based charting
- **Chart.js** - For canvas-based charts
- **Material-UI** - For styling and theming

---

## Testing

Run tests:
```bash
npm test -- src/components/charts/__tests__
```

---

## Troubleshooting

**Issue:** Chart not rendering  
**Solution:** Ensure data array is not empty and properly formatted

**Issue:** Chart too small  
**Solution:** Set explicit height prop or ensure parent has defined height

**Issue:** Colors not applying  
**Solution:** Check color format (must be valid CSS color)

**Issue:** Tooltip not showing  
**Solution:** Verify data has required fields and tooltip is enabled
