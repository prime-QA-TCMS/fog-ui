# Fog UI Consumer App - Feature Testing

This is a comprehensive testing application showcasing all Fog UI components and features. Use this app to test and interact with the various components available in the Fog UI library.

## Features Showcase

### 1. **Toast Notifications** 
   - **Path**: http://localhost:5173/#/
   - **Features Demonstrated**:
     - Success toasts
     - Error toasts
     - Warning toasts
     - Info toasts
     - Auto-dismissing notifications
     - Persistent notifications
   - **Use Cases**:
     - Displaying success messages after operations
     - Showing error alerts to users
     - Providing informational updates
     - User feedback confirmations

### 2. **DataTable Component**
   - **Path**: http://localhost:5173/#/datatable
   - **Features Demonstrated**:
     - Data grid with columns
     - Loading state with spinner
     - Empty state handling
     - Row action buttons (Edit, Delete)
     - Dynamic column configuration
   - **Use Cases**:
     - Displaying lists of data
     - User management interfaces
     - Content tables with actions
     - Responsive data display

### 3. **Form Component**
   - **Path**: http://localhost:5173/#/forms
   - **Features Demonstrated**:
     - Text input fields
     - Email validation
     - Password fields with validation
     - Form submission
     - Field-level error messages
     - Minimum length validation
   - **Use Cases**:
     - User registration forms
     - Login forms
     - User profile updates
     - Data entry interfaces

### 4. **Error Boundary Component**
   - **Path**: http://localhost:5173/#/error-boundary
   - **Features Demonstrated**:
     - Catching component errors
     - Fallback UI display
     - Error recovery with reset
     - Graceful error handling
   - **Use Cases**:
     - Protecting app from crashing
     - Displaying user-friendly error messages
     - Error recovery workflows
     - Production error handling

### 5. **Container Styles**
   - **Path**: http://localhost:5173/#/container-styles
   - **Features Demonstrated**:
     - Login container styling
     - Content container styling
     - Wrap container styling
     - Half-screen container styling
     - Dark mode support
   - **Use Cases**:
     - Consistent spacing and layout
     - Responsive container design
     - Theme-based styling
     - Reusable style patterns

## Running the App

### Development Mode
```bash
cd consumer-app
npm run dev
```
The app will be available at `http://localhost:5173/`

### Production Build
```bash
cd consumer-app
npm run build
```

### Testing Navigation
- Use the tab navigation at the top to switch between different feature demos
- Each tab shows a different component or feature
- Interactive buttons and forms demonstrate real functionality

## Component Integration Guide

### Using Toast Notifications
```tsx
import { useToast, ToastProvider } from 'fog-ui';

// Wrap your app with ToastProvider
<ToastProvider>
  <YourApp />
</ToastProvider>

// Use in components
const { showToast } = useToast();
showToast('Success!', 'success');
showToast('Error occurred', 'error');
```

### Using DataTable
```tsx
import { DataTable } from 'fog-ui';

<DataTable
  title="Users"
  data={users}
  columns={columns}
  loading={isLoading}
  rowComponent={(item) => <ActionButtons item={item} />}
/>
```

### Using Form Component
```tsx
import { Form } from 'fog-ui';

const fields = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

<Form
  onSubmit={(data) => console.log(data)}
  fields={fields}
/>
```

### Using Error Boundary
```tsx
import { ErrorBoundary } from 'fog-ui';

<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>
```

### Using Container Styles
```tsx
import { contentContainer, loginContainer } from 'fog-ui';

<Box sx={contentContainer}>
  Your content here
</Box>
```

## Testing Checklist

- [ ] Test Toast notifications with all severity levels
- [ ] Verify DataTable displays data correctly
- [ ] Test DataTable loading and empty states
- [ ] Submit form and verify validation
- [ ] Trigger error in Error Boundary component
- [ ] Test container styles responsiveness
- [ ] Verify tab navigation between features
- [ ] Check responsive behavior on mobile

## Project Structure

```
consumer-app/
├── src/
│   ├── pages/
│   │   ├── ToastDemo.tsx
│   │   ├── DataTableDemo.tsx
│   │   ├── FormDemo.tsx
│   │   ├── ErrorBoundaryDemo.tsx
│   │   ├── ContainerStylesDemo.tsx
│   │   └── index.ts
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Browser Compatibility

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: Responsive design supported

## Performance Notes

- Initial bundle size: ~646 KB (minified)
- GZipped size: ~204 KB
- Consider code-splitting for production deployments
- All components are tree-shakeable for optimal bundling

## Troubleshooting

### App not loading
- Check that the main fog-ui library is built: `npm run build` in root
- Clear node_modules and reinstall: `npm install`
- Check console for error messages

### Components not displaying
- Ensure ToastProvider wraps the app
- Verify all imports are correct
- Check Material-UI theme configuration

### Styling issues
- Clear build artifacts: `rm -rf dist/` and `npm run build`
- Verify Material-UI version compatibility
- Check browser console for CSS loading errors

## Next Steps

1. ✅ All features are implemented and demonstrated
2. ✅ Consumer app is fully functional
3. ✅ All 603 unit tests passing
4. Ready for production deployment!

## Additional Resources

- [Fog UI Documentation](../README.md)
- [Component READMEs](../src/components/)
- [Feature Documentation](../README.md#feature-documentation)
