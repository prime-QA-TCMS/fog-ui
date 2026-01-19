import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import type { MenuItem } from '../../types';

/**
 * Props for the ProtectedRoute component
 */
export interface ProtectedRouteProps {
	/**
	 * The content to render if access is granted
	 */
	children: React.ReactNode;

	/**
	 * Menu items to pass to PageWrapper
	 * @example
	 * ```tsx
	 * const menuItems = {
	 *   main: [
	 *     { label: 'Dashboard', path: '/dashboard' },
	 *     { label: 'Settings', path: '/settings' }
	 *   ]
	 * };
	 * ```
	 */
	menuItems?: Record<string, MenuItem[]>;

	/**
	 * Whether authentication is required to access this route
	 * @default true
	 */
	requireAuth?: boolean;

	/**
	 * Array of roles required to access this route
	 * If empty, only authentication is checked
	 * @default []
	 * @example ['admin', 'editor']
	 */
	requiredRoles?: string[];

	/**
	 * Path to redirect to if access is denied
	 * @default '/login'
	 */
	fallbackPath?: string;

	/**
	 * Function to check if user is authenticated
	 * Should return true if authenticated, false otherwise
	 * @example
	 * ```tsx
	 * const isAuthenticated = () => !!localStorage.getItem('token');
	 * ```
	 */
	isAuthenticated?: () => boolean;

	/**
	 * Array of roles the current user has
	 * Used for role-based access control
	 * @default []
	 * @example ['admin', 'user']
	 */
	userRoles?: string[];

	/**
	 * Whether to wrap content in PageWrapper
	 * Set to false to render children directly without layout
	 * @default true
	 */
	usePageWrapper?: boolean;
}

/**
 * Protected route component that handles authentication and authorization
 *
 * This component provides:
 * - Authentication checking (redirects if not authenticated)
 * - Role-based access control (redirects if user lacks required roles)
 * - Automatic redirection to fallback path
 * - Optional PageWrapper integration
 *
 * @example
 * ```tsx
 * // Simple authentication check
 * <ProtectedRoute
 *   isAuthenticated={() => !!localStorage.getItem('token')}
 * >
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * // With role-based access
 * <ProtectedRoute
 *   isAuthenticated={() => !!localStorage.getItem('token')}
 *   requiredRoles={['admin']}
 *   userRoles={['admin', 'user']}
 *   fallbackPath="/unauthorized"
 * >
 *   <AdminPanel />
 * </ProtectedRoute>
 *
 * // With menu items
 * <ProtectedRoute
 *   isAuthenticated={() => !!localStorage.getItem('token')}
 *   menuItems={{
 *     main: [
 *       { label: 'Dashboard', path: '/dashboard' },
 *       { label: 'Settings', path: '/settings' }
 *     ]
 *   }}
 * >
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * // Without PageWrapper
 * <ProtectedRoute
 *   isAuthenticated={() => !!localStorage.getItem('token')}
 *   usePageWrapper={false}
 * >
 *   <CustomLayout>
 *     <Dashboard />
 *   </CustomLayout>
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
	children,
	menuItems,
	requireAuth = true,
	requiredRoles = [],
	fallbackPath = '/login',
	isAuthenticated,
	userRoles = [],
	usePageWrapper = true,
}: ProtectedRouteProps) {
	const navigate = useNavigate();

	useEffect(() => {
		// Check authentication if required
		if (requireAuth && isAuthenticated && !isAuthenticated()) {
			navigate(fallbackPath, { replace: true });
			return;
		}

		// Check role-based access if roles are specified
		if (requiredRoles.length > 0) {
			const hasRequiredRole = requiredRoles.some((role) =>
				userRoles.includes(role)
			);

			if (!hasRequiredRole) {
				navigate(fallbackPath, { replace: true });
			}
		}
	}, [
		requireAuth,
		isAuthenticated,
		requiredRoles,
		userRoles,
		navigate,
		fallbackPath,
	]);

	// If we're still checking or about to redirect, render nothing
	// This prevents flash of content before redirect
	if (requireAuth && isAuthenticated && !isAuthenticated()) {
		return null;
	}

	if (requiredRoles.length > 0) {
		const hasRequiredRole = requiredRoles.some((role) =>
			userRoles.includes(role)
		);
		if (!hasRequiredRole) {
			return null;
		}
	}

	// Render with or without PageWrapper based on usePageWrapper prop
	if (usePageWrapper) {
		return (
			<PageWrapper menuItems={menuItems || {}}>
				{children}
			</PageWrapper>
		);
	}

	return <>{children}</>;
}
