import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Alert } from '@mui/material';
import { PageWrapper, Topbar, ProtectedRoute } from 'fog-ui';

// Mock protected component
function ProtectedContent() {
	return (
		<Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 1 }}>
			<Typography variant="h6" gutterBottom>
				Protected Content
			</Typography>
			<Typography variant="body2">
				This content is only visible when user has proper authorization.
			</Typography>
		</Box>
	);
}

export function TemplateComponentsDemo() {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	// Mock menu items for PageWrapper
	const menuItems = {
		dashboard: { label: 'Dashboard', icon: 'home' },
		users: { label: 'Users', icon: 'people' },
		settings: { label: 'Settings', icon: 'settings' },
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Template Components
			</Typography>

			<Paper sx={{ p: 3, mb: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Layout and template components for building page structures and protecting routes.
					</Typography>

					{/* PageWrapper Demo */}
					<Box>
						<Typography variant="h6" gutterBottom>
							PageWrapper Component
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Main layout wrapper that provides a consistent page structure with optional sidebar navigation.
						</Typography>
						<Alert severity="info">
							PageWrapper provides a consistent layout with:
							<ul style={{ marginTop: '8px' }}>
								<li>Responsive sidebar navigation</li>
								<li>Collapsible menu structure</li>
								<li>Consistent spacing and styling</li>
								<li>Optional theme support</li>
							</ul>
						</Alert>
					</Box>

					{/* Topbar Demo */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Topbar Component
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Header component typically used with PageWrapper to provide navigation and actions.
						</Typography>
						<Alert severity="info">
							Topbar provides:
							<ul style={{ marginTop: '8px' }}>
								<li>Branding and logo area</li>
								<li>User profile section</li>
								<li>Navigation breadcrumbs</li>
								<li>Action buttons and notifications</li>
							</ul>
						</Alert>
					</Box>

					{/* ProtectedRoute Demo */}
					<Box>
						<Typography variant="h6" gutterBottom>
							ProtectedRoute Component
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Route wrapper that enforces authorization. Use to protect pages requiring authentication.
						</Typography>

						<Stack spacing={2}>
							<Button
								variant={isAuthorized ? 'contained' : 'outlined'}
								onClick={() => setIsAuthorized(!isAuthorized)}
								color={isAuthorized ? 'success' : 'error'}
							>
								{isAuthorized ? 'Authorized ✓' : 'Unauthorized ✗'} - Click to toggle
							</Button>

							{isAuthorized ? (
								<ProtectedContent />
							) : (
								<Alert severity="warning">
									User is not authorized to view this content. Click the button above to simulate authorization.
								</Alert>
							)}

							<Alert severity="success">
								ProtectedRoute features:
								<ul style={{ marginTop: '8px' }}>
									<li>Checks user authorization before rendering component</li>
									<li>Redirects to login page if unauthorized</li>
									<li>Supports role-based access control</li>
									<li>Can specify required permissions</li>
								</ul>
							</Alert>
						</Stack>
					</Box>

					{/* Usage Example */}
					<Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<Typography variant="subtitle2" gutterBottom>
							Usage Example:
						</Typography>
						<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block' }}>
							{`import { PageWrapper, Topbar, ProtectedRoute } from 'fog-ui';

function App() {
  return (
    <PageWrapper menuItems={menuItems}>
      <Topbar title="Dashboard" />
      <ProtectedRoute
        isAuthorized={user.isAuthenticated}
        requiredRole="admin"
      >
        <AdminPanel />
      </ProtectedRoute>
    </PageWrapper>
  );
}`}
						</Typography>
					</Box>
				</Stack>
			</Paper>
		</Box>
	);
}
