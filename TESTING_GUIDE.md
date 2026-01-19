# Fog UI Testing Guide

Complete manual testing guide for all Fog UI components in the consumer app.

## Pre-Testing Checklist

- [ ] Consumer app is running on `http://localhost:5173/`
- [ ] All unit tests pass: `npm test -- --run`
- [ ] Build successful: `npm run build`
- [ ] Browser console shows no errors
- [ ] Network tab shows no failed requests

## Test Scenarios

### 1. Toast Notifications Testing

**Location**: http://localhost:5173/#/

#### Test Case 1.1: Success Toast
- [ ] Click "Success Toast" button
- [ ] Verify green toast appears with message
- [ ] Verify toast auto-dismisses after 5 seconds
- [ ] Verify no console errors

#### Test Case 1.2: Error Toast
- [ ] Click "Error Toast" button
- [ ] Verify red toast appears with message
- [ ] Verify error icon is visible
- [ ] Verify toast is dismissable

#### Test Case 1.3: Warning Toast
- [ ] Click "Warning Toast" button
- [ ] Verify orange toast appears
- [ ] Verify message is readable

#### Test Case 1.4: Info Toast
- [ ] Click "Info Toast" button
- [ ] Verify blue toast appears
- [ ] Verify info icon is present

#### Test Case 1.5: Multiple Toasts
- [ ] Click multiple toast buttons rapidly
- [ ] Verify multiple toasts stack vertically
- [ ] Verify each toast displays correctly
- [ ] Verify no overlapping issues

#### Test Case 1.6: Timing Tests
- [ ] Click "3 Second Toast"
- [ ] Count and verify 3-second dismissal
- [ ] Click "Persistent Toast"
- [ ] Verify it stays visible beyond 3 seconds
- [ ] Manually dismiss it

### 2. DataTable Component Testing

**Location**: http://localhost:5173/#/datatable

#### Test Case 2.1: Normal Data Display
- [ ] Verify table displays with title "Users Management"
- [ ] Verify all 4 users are displayed
- [ ] Verify columns: Name, Email, Role, Status
- [ ] Verify action buttons (Edit, Delete) for each row

#### Test Case 2.2: Loading State
- [ ] Click "Toggle Loading" button
- [ ] Verify loading spinner appears
- [ ] Verify message changes to loading state
- [ ] Click again to hide loading state
- [ ] Verify data reappears

#### Test Case 2.3: Empty State
- [ ] Click "Toggle Empty State" button
- [ ] Verify "No users found" message appears
- [ ] Verify table structure is maintained
- [ ] Verify proper colspan for empty row
- [ ] Click again to show data

#### Test Case 2.4: Mixed States
- [ ] Toggle loading while empty
- [ ] Toggle empty while loading
- [ ] Verify correct state displays each time

#### Test Case 2.5: Responsive Behavior
- [ ] Resize browser window to tablet size
- [ ] Verify table is readable
- [ ] Resize to mobile size
- [ ] Verify table adapts gracefully
- [ ] Verify horizontal scroll if needed

#### Test Case 2.6: Action Buttons
- [ ] Hover over Edit button
- [ ] Verify button highlights
- [ ] Click Edit button
- [ ] Verify button responds (no errors)
- [ ] Test Delete button similarly

### 3. Form Component Testing

**Location**: http://localhost:5173/#/forms

#### Test Case 3.1: Valid Form Submission
- [ ] Enter username: "testuser"
- [ ] Enter email: "test@example.com"
- [ ] Enter password: "password123"
- [ ] Click Submit button
- [ ] Verify "Form Submitted Successfully" message
- [ ] Verify form data displays in JSON
- [ ] Verify message disappears after 3 seconds

#### Test Case 3.2: Username Validation
- [ ] Leave username empty
- [ ] Click Submit
- [ ] Verify error: "Username is required"
- [ ] Enter username
- [ ] Verify error disappears

#### Test Case 3.3: Email Validation
- [ ] Leave email empty
- [ ] Click Submit
- [ ] Verify error: "Email is required"
- [ ] Enter invalid email: "notanemail"
- [ ] Verify error: "Invalid email"
- [ ] Enter valid email
- [ ] Verify no error

#### Test Case 3.4: Password Validation
- [ ] Leave password empty
- [ ] Click Submit
- [ ] Verify error: "Password is required"
- [ ] Enter password: "123"
- [ ] Verify error: "Min 6 characters"
- [ ] Enter password: "password123"
- [ ] Verify no error

#### Test Case 3.5: Multiple Submissions
- [ ] Submit form with valid data
- [ ] Verify success message
- [ ] Submit again with different data
- [ ] Verify new data displays
- [ ] Submit multiple times
- [ ] Verify consistency

#### Test Case 3.6: Field Interactions
- [ ] Click in username field
- [ ] Type characters
- [ ] Tab to next field
- [ ] Verify focus moves correctly
- [ ] Tab through all fields
- [ ] Verify tab order is logical

### 4. Error Boundary Component Testing

**Location**: http://localhost:5173/#/error-boundary

#### Test Case 4.1: Initial State
- [ ] Verify "This component is working correctly" message
- [ ] Verify green background
- [ ] Verify no error display

#### Test Case 4.2: Trigger Error
- [ ] Click "Trigger Error" button
- [ ] Verify error message displays: "This is a test error to demonstrate the ErrorBoundary component"
- [ ] Verify error boundary catches the error
- [ ] Verify app doesn't crash
- [ ] Verify error details are visible

#### Test Case 4.3: Reset Error Boundary
- [ ] With error displayed, click "Reset Error Boundary" button
- [ ] Verify error message disappears
- [ ] Verify component returns to normal state
- [ ] Verify green background shows again

#### Test Case 4.4: Multiple Error Cycles
- [ ] Trigger error
- [ ] Reset
- [ ] Trigger error again
- [ ] Reset again
- [ ] Verify process works consistently

#### Test Case 4.5: Error Details
- [ ] When error is shown, check error message content
- [ ] Verify error type is displayed
- [ ] Verify error stack trace is visible
- [ ] Verify reset instructions are clear

### 5. Container Styles Testing

**Location**: http://localhost:5173/#/container-styles

#### Test Case 5.1: Container Display
- [ ] Verify 4 containers are displayed
- [ ] Verify container names: Login, Content, Wrap, Half Screen
- [ ] Verify each has text content
- [ ] Verify containers have distinct styling

#### Test Case 5.2: Dark Mode Toggle
- [ ] Click "Toggle Dark Mode" button
- [ ] Verify containers change to dark background
- [ ] Verify text is still readable
- [ ] Verify styling is consistent
- [ ] Click again to return to light mode
- [ ] Verify transition is smooth

#### Test Case 5.3: Responsive Containers
- [ ] View on desktop (full width)
- [ ] Verify 2 containers per row (Grid sm={6})
- [ ] Resize to tablet
- [ ] Verify layout adapts
- [ ] Resize to mobile
- [ ] Verify single column layout
- [ ] Verify container styles responsive

#### Test Case 5.4: Style Consistency
- [ ] Compare styling across all containers
- [ ] Verify padding is consistent
- [ ] Verify borders/shadows are applied
- [ ] Verify text styling matches
- [ ] Verify no overlap or misalignment

#### Test Case 5.5: Theme Integration
- [ ] Verify styles work with Material-UI theme
- [ ] Verify colors contrast well
- [ ] Verify layout respects spacing
- [ ] Verify no style conflicts

## Cross-Feature Testing

### Navigation Testing
- [ ] Click each tab at the top
- [ ] Verify URL updates (hash routing)
- [ ] Verify correct component displays
- [ ] Use browser back/forward
- [ ] Verify navigation works correctly

### Global Toast + Other Components
- [ ] While on DataTable, trigger toast
- [ ] Verify toast displays over table
- [ ] While on Form, trigger toast
- [ ] Verify toast displays correctly
- [ ] Toast should work on all pages

### Error Boundary + Other Features
- [ ] Trigger error on Error Boundary page
- [ ] Show toast notification
- [ ] Verify both work together
- [ ] Reset error boundary
- [ ] Verify toast persists

## Browser Testing Matrix

Test in multiple browsers:

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome  | Latest  | [ ]    |       |
| Firefox | Latest  | [ ]    |       |
| Safari  | Latest  | [ ]    |       |
| Edge    | Latest  | [ ]    |       |

## Device Testing Matrix

| Device      | Size    | Status | Notes |
|-------------|---------|--------|-------|
| Desktop     | 1920x80 | [ ]    |       |
| Laptop      | 1366x7  | [ ]    |       |
| Tablet      | 768x102 | [ ]    |       |
| Mobile      | 375x66  | [ ]    |       |

## Performance Testing

- [ ] Open DevTools Network tab
- [ ] Verify initial page load time < 3 seconds
- [ ] Check bundle size
- [ ] Verify CSS/JS files load
- [ ] Check for 404 errors
- [ ] Monitor memory usage
- [ ] Test on slow 3G network
- [ ] Verify app still works

## Accessibility Testing

- [ ] Test keyboard navigation (Tab key)
- [ ] Test form fields are focusable
- [ ] Test buttons are clickable with Enter
- [ ] Verify color contrast ratios
- [ ] Check alt text on images
- [ ] Test with screen reader (if available)
- [ ] Verify labels associated with inputs
- [ ] Test error message announcements

## Security Testing

- [ ] Verify no sensitive data in console
- [ ] Check for XSS vulnerabilities
- [ ] Test form input sanitization
- [ ] Verify no hardcoded credentials
- [ ] Check CORS headers if applicable
- [ ] Verify no console warnings/errors

## Bug Report Template

For any issues found:

```
**Title**: [Brief description]

**Severity**: Critical | High | Medium | Low

**Steps to Reproduce**:
1. Navigate to [URL]
2. Perform action [action]
3. Expected [expected behavior]
4. Actual [actual behavior]

**Browser/Device**: [Browser name, version, device]

**Screenshots**: [Attach if applicable]

**Console Errors**: [Copy any error messages]

**Additional Notes**: [Any other relevant info]
```

## Sign-Off

| Role      | Name | Date | Status |
|-----------|------|------|--------|
| Tester    |      |      | [ ]    |
| Developer |      |      | [ ]    |
| QA Lead   |      |      | [ ]    |

---

**Testing Completed**: ___________
**All Tests Passed**: [ ] Yes [ ] No
**Issues Found**: ______
**Status**: APPROVED [ ] | NEEDS WORK [ ]
