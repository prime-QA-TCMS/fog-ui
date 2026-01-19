import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProtectedRoute } from '../ProtectedRoute';
import * as ReactRouterDom from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

// Mock PageWrapper
vi.mock('../PageWrapper', () => ({
	PageWrapper: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="page-wrapper">{children}</div>
	),
}));

describe('ProtectedRoute', () => {
	const mockNavigate = vi.fn();
	const mockUseNavigate = vi.mocked(ReactRouterDom.useNavigate);

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseNavigate.mockReturnValue(mockNavigate);
	});

	describe('Authentication', () => {
		it('renders children when authenticated', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute isAuthenticated={isAuthenticated}>
					<div>Protected Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Protected Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('redirects to fallback path when not authenticated', () => {
			const isAuthenticated = vi.fn().mockReturnValue(false);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					fallbackPath="/login"
				>
					<div>Protected Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
			expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
		});

		it('uses default fallback path when not specified', () => {
			const isAuthenticated = vi.fn().mockReturnValue(false);

			render(
				<ProtectedRoute isAuthenticated={isAuthenticated}>
					<div>Protected Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
		});

		it('renders children when requireAuth is false', () => {
			render(
				<ProtectedRoute requireAuth={false}>
					<div>Public Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Public Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('renders children when requireAuth is true but no isAuthenticated provided', () => {
			render(
				<ProtectedRoute requireAuth={true}>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});

	describe('Role-Based Access Control', () => {
		it('renders children when user has required role', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin']}
					userRoles={['admin', 'user']}
				>
					<div>Admin Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Admin Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('redirects when user lacks required role', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin']}
					userRoles={['user']}
					fallbackPath="/unauthorized"
				>
					<div>Admin Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalledWith('/unauthorized', {
				replace: true,
			});
			expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
		});

		it('renders when user has at least one required role', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin', 'editor']}
					userRoles={['editor', 'viewer']}
				>
					<div>Editor Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Editor Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('redirects when user has no matching roles', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin', 'editor']}
					userRoles={['viewer']}
				>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalled();
			expect(screen.queryByText('Content')).not.toBeInTheDocument();
		});

		it('renders when no roles required', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={[]}
					userRoles={[]}
				>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('handles empty userRoles gracefully', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin']}
					userRoles={[]}
				>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalled();
			expect(screen.queryByText('Content')).not.toBeInTheDocument();
		});
	});

	describe('PageWrapper Integration', () => {
		it('wraps content in PageWrapper by default', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute isAuthenticated={isAuthenticated}>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
			expect(screen.getByText('Content')).toBeInTheDocument();
		});

		it('passes menuItems to PageWrapper', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);
			const menuItems = {
				main: [
					{ label: 'Dashboard', path: '/dashboard' },
					{ label: 'Settings', path: '/settings' },
				],
			};

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					menuItems={menuItems}
				>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
		});

		it('renders children directly when usePageWrapper is false', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					usePageWrapper={false}
				>
					<div>Direct Content</div>
				</ProtectedRoute>
			);

			expect(screen.queryByTestId('page-wrapper')).not.toBeInTheDocument();
			expect(screen.getByText('Direct Content')).toBeInTheDocument();
		});
	});

	describe('Combined Authentication and Authorization', () => {
		it('checks authentication before roles', () => {
			const isAuthenticated = vi.fn().mockReturnValue(false);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin']}
					userRoles={['admin']}
					fallbackPath="/login"
				>
					<div>Content</div>
				</ProtectedRoute>
			);

			// Should redirect to login, not check roles
			expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
			expect(screen.queryByText('Content')).not.toBeInTheDocument();
		});

		it('checks roles after authentication succeeds', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin']}
					userRoles={['user']}
					fallbackPath="/unauthorized"
				>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalledWith('/unauthorized', {
				replace: true,
			});
		});

		it('renders when both authentication and authorization pass', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin', 'editor']}
					userRoles={['editor']}
				>
					<div>Authorized Content</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Authorized Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('handles undefined isAuthenticated function', () => {
			render(
				<ProtectedRoute requireAuth={true}>
					<div>Content</div>
				</ProtectedRoute>
			);

			// Should not crash and render content
			expect(screen.getByText('Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('handles null children', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute isAuthenticated={isAuthenticated}>
					{null}
				</ProtectedRoute>
			);

			// Should render PageWrapper even with null children
			expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
		});

		it('handles complex children structures', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute isAuthenticated={isAuthenticated}>
					<div>
						<h1>Title</h1>
						<p>Description</p>
						<button>Action</button>
					</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Title')).toBeInTheDocument();
			expect(screen.getByText('Description')).toBeInTheDocument();
			expect(screen.getByText('Action')).toBeInTheDocument();
		});

		it('uses replace: true for navigation to prevent back button issues', () => {
			const isAuthenticated = vi.fn().mockReturnValue(false);

			render(
				<ProtectedRoute isAuthenticated={isAuthenticated}>
					<div>Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), {
				replace: true,
			});
		});
	});

	describe('Real-World Scenarios', () => {
		it('handles admin dashboard scenario', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);
			const menuItems = {
				main: [
					{ label: 'Dashboard', path: '/admin/dashboard' },
					{ label: 'Users', path: '/admin/users' },
					{ label: 'Settings', path: '/admin/settings' },
				],
			};

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin']}
					userRoles={['admin']}
					menuItems={menuItems}
					fallbackPath="/unauthorized"
				>
					<div>Admin Dashboard</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
			expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('handles public route with optional auth', () => {
			render(
				<ProtectedRoute requireAuth={false} usePageWrapper={false}>
					<div>Public Landing Page</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Public Landing Page')).toBeInTheDocument();
			expect(screen.queryByTestId('page-wrapper')).not.toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('handles multi-role editor scenario', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin', 'editor', 'moderator']}
					userRoles={['editor', 'viewer']}
				>
					<div>Editor Interface</div>
				</ProtectedRoute>
			);

			expect(screen.getByText('Editor Interface')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});

		it('handles insufficient permissions scenario', () => {
			const isAuthenticated = vi.fn().mockReturnValue(true);

			render(
				<ProtectedRoute
					isAuthenticated={isAuthenticated}
					requiredRoles={['admin', 'moderator']}
					userRoles={['viewer']}
					fallbackPath="/access-denied"
				>
					<div>Restricted Content</div>
				</ProtectedRoute>
			);

			expect(mockNavigate).toHaveBeenCalledWith('/access-denied', {
				replace: true,
			});
			expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
		});
	});
});
