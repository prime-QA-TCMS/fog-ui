import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Alert, Divider, Switch, FormControlLabel } from '@mui/material';
import { ProtectedRoute, MenuItem, UserMenuConfig, BreadcrumbsConfig } from 'fog-ui';

// Mock protected content component
function ProtectedContent({ title }: { title: string }) {
	return (
		<Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 1 }}>
			<Typography variant="h6" gutterBottom>
				✓ {title}
			</Typography>
			<Typography variant="body2">
				This content is protected and rendered based on authentication and authorization rules.
			</Typography>
		</Box>
	);
}

export function ProtectedRouteDemo() {
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [userRole, setUserRole] = useState('user');
	const [usePageWrapper, setUsePageWrapper] = useState(true);

	// Menu structure
	const menuItems = {
		main: [
			{ label: 'Dashboard', path: '/dashboard' },
			{ label: 'Users', path: '/users' },
		],
		admin: [
			{ label: 'Settings', path: '/settings' },
			{ label: 'Reports', path: '/reports' },
		],
	};

	const userMenu: UserMenuConfig = {
		profilePath: '/profile',
		accountPath: '/account',
		onLogout: () => console.log('Logging out...'),
	};

	const topbarMenu: MenuItem[] = [
		{ label: 'Help', path: '/help' },
		{ label: 'Documentation', path: '/docs' },
	];

	const breadcrumbsConfig: BreadcrumbsConfig = {
		parameterNames: ['category', 'subcategory'],
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				ProtectedRoute Component Variations
			</Typography>

			{/* Controls */}
			<Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
				<Typography variant="h6" gutterBottom>
					Configuration Controls
				</Typography>
				<Stack spacing={2}>
					<FormControlLabel
						control={<Switch checked={isAuthenticated} onChange={(e) => setIsAuthenticated(e.target.checked)} />}
						label="Is Authenticated"
					/>
					<FormControlLabel
						control={<Switch checked={usePageWrapper} onChange={(e) => setUsePageWrapper(e.target.checked)} />}
						label="Use PageWrapper"
					/>
					<Box>
						<Typography variant="body2" gutterBottom>
							User Role:
						</Typography>
						<Stack direction="row" spacing={1}>
							{['guest', 'user', 'admin'].map((role) => (
								<Button
									key={role}
									variant={userRole === role ? 'contained' : 'outlined'}
									onClick={() => setUserRole(role)}
									size="small"
								>
									{role}
								</Button>
							))}
						</Stack>
					</Box>
				</Stack>
			</Paper>

			<Stack spacing={4}>
				{/* 1. Full Configuration */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						1. With All Options
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						All props configured
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						requiredRoles={['user', 'admin']}
						userRoles={[userRole]}
						usePageWrapper={usePageWrapper}
						menuItems={menuItems}
						logo="🚀 ADVANCED APP"
						topbarMenu={topbarMenu}
						topbarUserMenu={userMenu}
						breadcrumbsConfig={breadcrumbsConfig}
						drawerFooterComponent={<Box sx={{ p: 2, textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>v1.0.0 © 2024</Box>}
					>
						<ProtectedContent title="Full Configuration" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 2. Without Logo */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						2. Without Custom Logo
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						Uses default logo from PageWrapper
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						userRoles={[userRole]}
						usePageWrapper={usePageWrapper}
						menuItems={menuItems}
						topbarMenu={topbarMenu}
						topbarUserMenu={userMenu}
					>
						<ProtectedContent title="No Custom Logo" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 3. Without Menu Items */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						3. Without Menu Items
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						No sidebar navigation
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						usePageWrapper={usePageWrapper}
						logo="📱 MINIMAL"
						topbarMenu={topbarMenu}
						topbarUserMenu={userMenu}
					>
						<ProtectedContent title="No Menu Items" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 4. Without Topbar Menu */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						4. Without Topbar Menu
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						Sidebar navigation only
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						usePageWrapper={usePageWrapper}
						menuItems={menuItems}
						logo="🎯 FOCUS"
						topbarUserMenu={userMenu}
					>
						<ProtectedContent title="No Topbar Menu" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 5. Without User Menu */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						5. Without User Menu
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						No user profile icon in topbar
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						usePageWrapper={usePageWrapper}
						menuItems={menuItems}
						logo="👤 NO USER MENU"
						topbarMenu={topbarMenu}
					>
						<ProtectedContent title="No User Menu" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 6. Without Breadcrumbs */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						6. Without Breadcrumbs Config
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						Breadcrumb navigation disabled
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						usePageWrapper={usePageWrapper}
						menuItems={menuItems}
						logo="🗺️ NO BREADCRUMBS"
						topbarMenu={topbarMenu}
						topbarUserMenu={userMenu}
					>
						<ProtectedContent title="No Breadcrumbs" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 7. Minimal - Auth Only */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						7. Minimal Configuration (Auth Only)
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						Only basic authentication
					</Typography>
					<ProtectedRoute requireAuth={true} isAuthenticated={() => isAuthenticated} usePageWrapper={usePageWrapper}>
						<ProtectedContent title="Auth Only" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 8. Without PageWrapper */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						8. Without PageWrapper
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						Raw content without layout wrapper
					</Typography>
					<ProtectedRoute
						requireAuth={true}
						isAuthenticated={() => isAuthenticated}
						usePageWrapper={false}
						menuItems={menuItems}
						logo="📦 RAW"
					>
						<ProtectedContent title="No PageWrapper" />
					</ProtectedRoute>
				</Paper>

				<Divider />

				{/* 9. Role-Based Access Control */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
						9. Role-Based Access (Current role: {userRole})
					</Typography>
					<Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
						Admin role required - switch role above to test
					</Typography>
					{userRole === 'admin' ? (
						<ProtectedRoute
							requireAuth={false}
							requiredRoles={['admin']}
							userRoles={[userRole]}
							usePageWrapper={usePageWrapper}
							menuItems={menuItems}
							logo="🔐 ADMIN ONLY"
						>
							<ProtectedContent title="Admin Access Granted" />
						</ProtectedRoute>
					) : (
						<Alert severity="warning">Admin role required. Current role: {userRole}</Alert>
					)}
				</Paper>
			</Stack>

			{/* Info Section */}
			<Paper sx={{ p: 3, mt: 4, bgcolor: 'info.light' }}>
				<Typography variant="h6" gutterBottom>
					ProtectedRoute Props
				</Typography>
				<Typography variant="body2" component="div" sx={{ mt: 2 }}>
					<strong>Authentication:</strong>
					<ul>
						<li>requireAuth - Enable auth checks</li>
						<li>isAuthenticated - Auth check function</li>
						<li>fallbackPath - Redirect on auth failure</li>
					</ul>
				</Typography>
				<Typography variant="body2" component="div">
					<strong>Authorization:</strong>
					<ul>
						<li>requiredRoles - Required user roles</li>
						<li>userRoles - Current user roles</li>
					</ul>
				</Typography>
				<Typography variant="body2" component="div">
					<strong>Layout:</strong>
					<ul>
						<li>usePageWrapper - Wrap in PageWrapper</li>
						<li>menuItems - Sidebar menu</li>
						<li>logo - Custom logo</li>
						<li>topbarMenu - Topbar buttons</li>
						<li>topbarUserMenu - User menu config</li>
						<li>breadcrumbsConfig - Breadcrumb config</li>
						<li>drawerFooterComponent - Sidebar footer</li>
					</ul>
				</Typography>
			</Paper>
		</Box>
	);
}
