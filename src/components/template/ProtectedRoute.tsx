import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import { ProtectedRouteProps } from './types';

export function ProtectedRoute({
	children,
	menuItems,
	logo,
	drawerFooterComponent,
	topbarMenu,
	topbarUserMenu,
	breadcrumbsConfig,
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
			<PageWrapper
				menuItems={menuItems || {}}
				logo={logo}
				drawerFooterComponent={drawerFooterComponent}
				topbarMenu={topbarMenu}
				topbarUserMenu={topbarUserMenu}
				breadcrumbsConfig={breadcrumbsConfig}
			>
				{children}
			</PageWrapper>
		);
	}

	return <>{children}</>;
}
