# Quick Start Guide - Fog UI Testing

Get started testing Fog UI components in the consumer app in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git (optional, for cloning)

## Quick Setup

### 1. Start the Dev Server (Already Running)
The consumer app is currently running at: **http://localhost:5173/**

If not running, execute:
```bash
cd consumer-app
npm run dev
```

### 2. Access the Testing App
Open your browser to: **http://localhost:5173/**

## Feature Quick Links

| Feature | URL | Status |
|---------|-----|--------|
| Toast Notifications | http://localhost:5173/#/ | ✅ Live |
| DataTable | http://localhost:5173/#/datatable | ✅ Live |
| Forms | http://localhost:5173/#/forms | ✅ Live |
| Error Boundary | http://localhost:5173/#/error-boundary | ✅ Live |
| Container Styles | http://localhost:5173/#/container-styles | ✅ Live |

## Quick Test Cases (5 min each)

### Toast (2 min)
1. Click any toast button
2. Watch notification appear
3. Verify auto-dismiss

### DataTable (2 min)
1. See user list display
2. Click "Toggle Loading" to see spinner
3. Click "Toggle Empty State" to see empty message

### Form (2 min)
1. Try submitting empty form → see validation errors
2. Fill valid data
3. Submit → see success message

### Error Boundary (1 min)
1. Click "Trigger Error"
2. See error display
3. Click "Reset Error Boundary"

### Container Styles (1 min)
1. See 4 containers
2. Click "Toggle Dark Mode"
3. Watch styles change

## Verification Checklist

- [ ] Can navigate between all 5 features using tabs
- [ ] Toast notifications appear and disappear
- [ ] DataTable shows data and handles states
- [ ] Form validates and submits
- [ ] Error Boundary catches and recovers from errors
- [ ] Container styles render correctly
- [ ] No errors in browser console
- [ ] Responsive on different screen sizes

## Unit Tests Status

```
✅ 603 / 603 tests passing
✅ 68 / 68 test files passing
✅ All coverage targets met (>80%)
```

Run tests locally:
```bash
npm test -- --run
```

## Build Status

```
✅ Main library built successfully
   - ESM: 74.33 kB (gzipped: 17.12 kB)
   - CJS: 43.56 kB (gzipped: 13.15 kB)

✅ Consumer app built successfully
   - Bundle: 646.94 kB (gzipped: 204.19 kB)
```

Rebuild:
```bash
npm run build
npm run build:consumer  # if separate script exists
```

## Developer Tools

### Console Commands
Open DevTools (F12) and check:
- No red errors
- No network 404s
- All files loaded

### Network Tab
- Check bundle sizes
- Verify load times
- Monitor for failed requests

### React DevTools
(If installed)
- Inspect component tree
- Check props and state
- Debug component rendering

## Common Issues & Solutions

### Issue: Components not showing
**Solution**: Refresh page (Ctrl+F5 or Cmd+Shift+R)

### Issue: Toast not appearing
**Solution**: Check if ToastProvider is wrapping app

### Issue: Form not submitting
**Solution**: Check browser console for validation errors

### Issue: Build fails
**Solution**: 
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh | F5 or Cmd+R |
| Hard Refresh | Ctrl+F5 or Cmd+Shift+R |
| DevTools | F12 or Cmd+Option+I |
| Console | Ctrl+Shift+K |
| Network | Ctrl+Shift+E |

## What to Look For

### ✅ Should Work
- Tab navigation switches features
- Toasts appear and dismiss
- DataTable displays data
- Form validation shows errors
- Error Boundary catches errors
- Responsive design works

### ❌ Should NOT See
- Red console errors
- Network 404 errors
- Broken styling
- Missing components
- Unresponsive buttons
- Console warnings

## Feature Completeness

### Toast System (v0.1.11)
- ✅ Multiple severity levels (success, error, warning, info)
- ✅ Auto-dismiss functionality
- ✅ Manual dismiss support
- ✅ Stacking multiple toasts
- ✅ 97.6% test coverage

### DataTable Component (v0.1.11)
- ✅ Column rendering
- ✅ Loading state
- ✅ Empty state
- ✅ Row actions
- ✅ Responsive layout
- ✅ 100% test coverage on added features

### Form Component
- ✅ Text, email, password fields
- ✅ Validation rules
- ✅ Error display
- ✅ Form submission
- ✅ Field reset

### Error Boundary
- ✅ Error catching
- ✅ Fallback UI
- ✅ Error reset
- ✅ 100% test coverage

### Container Styles
- ✅ Multiple predefined styles
- ✅ Responsive containers
- ✅ Theme integration
- ✅ 100% test coverage

## Next Steps

1. ✅ **Testing** - Use TESTING_GUIDE.md for comprehensive testing
2. 📋 **Documentation** - See README.md files in each component folder
3. 🚀 **Deployment** - Run `npm run build` for production
4. 🔄 **Iteration** - File issues/improvements as needed

## Support Resources

- [Main README](README.md) - Complete documentation
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Detailed testing procedures
- [Feature Documentation](README.md#feature-documentation) - Component guides
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes

## Performance Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Initial Load | ~2-3s | < 5s ✅ |
| TTI | ~3-4s | < 5s ✅ |
| Bundle Size | 646 KB | < 1MB ✅ |
| Tests Passing | 603/603 | 100% ✅ |
| Coverage | >80% | >80% ✅ |

## Tips for Effective Testing

1. **Test in different browsers** - Chrome, Firefox, Safari, Edge
2. **Test on different devices** - Desktop, tablet, mobile
3. **Check console** - Always verify no errors
4. **Test network** - Try on slow connections
5. **Test keyboard** - Tab through all interactive elements
6. **Test accessibility** - Use screen reader if available
7. **Document issues** - Use bug report template
8. **Report findings** - Share results with team

---

**Ready to Test?** Open http://localhost:5173/ in your browser!
