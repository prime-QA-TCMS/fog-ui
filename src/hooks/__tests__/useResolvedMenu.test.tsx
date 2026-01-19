import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useResolvedMenu } from '../useResolvedMenu';
import * as ReactRouterDom from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
	useParams: vi.fn(),
}));

describe('useResolvedMenu', () => {
	const mockUseParams = vi.mocked(ReactRouterDom.useParams);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Functionality', () => {
		it('returns menu items unchanged when no params exist', () => {
			mockUseParams.mockReturnValue({});

			const menuItems = {
				main: [
					{ label: 'Home', path: '/home' },
					{ label: 'About', path: '/about' },
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual(menuItems);
		});

		it('resolves single parameter in path', () => {
			mockUseParams.mockReturnValue({ projectId: '123' });

			const menuItems = {
				main: [
					{ label: 'Project', path: '/projects/:projectId' },
					{ label: 'Settings', path: '/projects/:projectId/settings' },
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{ label: 'Project', path: '/projects/123' },
					{ label: 'Settings', path: '/projects/123/settings' },
				],
			});
		});

		it('resolves multiple parameters in single path', () => {
			mockUseParams.mockReturnValue({
				projectId: '123',
				suiteId: '456',
			});

			const menuItems = {
				main: [
					{
						label: 'Suite Details',
						path: '/projects/:projectId/suites/:suiteId',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{
						label: 'Suite Details',
						path: '/projects/123/suites/456',
					},
				],
			});
		});

		it('resolves parameters in multiple menu sections', () => {
			mockUseParams.mockReturnValue({ userId: '789' });

			const menuItems = {
				primary: [{ label: 'Profile', path: '/users/:userId/profile' }],
				secondary: [{ label: 'Settings', path: '/users/:userId/settings' }],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				primary: [{ label: 'Profile', path: '/users/789/profile' }],
				secondary: [{ label: 'Settings', path: '/users/789/settings' }],
			});
		});
	});

	describe('Edge Cases', () => {
		it('handles paths without parameters', () => {
			mockUseParams.mockReturnValue({ projectId: '123' });

			const menuItems = {
				main: [
					{ label: 'Home', path: '/' },
					{ label: 'Projects', path: '/projects' },
					{ label: 'Project Detail', path: '/projects/:projectId' },
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{ label: 'Home', path: '/' },
					{ label: 'Projects', path: '/projects' },
					{ label: 'Project Detail', path: '/projects/123' },
				],
			});
		});

		it('handles undefined params gracefully', () => {
			mockUseParams.mockReturnValue({
				projectId: '123',
				suiteId: undefined,
			});

			const menuItems = {
				main: [
					{ label: 'Project', path: '/projects/:projectId' },
					{ label: 'Suite', path: '/projects/:projectId/suites/:suiteId' },
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			// suiteId should remain as :suiteId since it's undefined
			expect(result.current).toEqual({
				main: [
					{ label: 'Project', path: '/projects/123' },
					{ label: 'Suite', path: '/projects/123/suites/:suiteId' },
				],
			});
		});

		it('handles empty menu items', () => {
			mockUseParams.mockReturnValue({ projectId: '123' });

			const menuItems = {
				main: [],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({ main: [] });
		});

		it('handles empty sections object', () => {
			mockUseParams.mockReturnValue({ projectId: '123' });

			const menuItems = {};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({});
		});

		it('preserves other MenuItem properties', () => {
			mockUseParams.mockReturnValue({ id: '999' });

			const menuItems = {
				main: [
					{
						label: 'Item',
						path: '/items/:id',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current.main[0]).toEqual({
				label: 'Item',
				path: '/items/999',
			});
		});
	});

	describe('Parameter Patterns', () => {
		it('handles numeric parameter values', () => {
			mockUseParams.mockReturnValue({ id: '12345' });

			const menuItems = {
				main: [{ label: 'Item', path: '/items/:id' }],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [{ label: 'Item', path: '/items/12345' }],
			});
		});

		it('handles UUID parameter values', () => {
			const uuid = '550e8400-e29b-41d4-a716-446655440000';
			mockUseParams.mockReturnValue({ id: uuid });

			const menuItems = {
				main: [{ label: 'Item', path: '/items/:id' }],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [{ label: 'Item', path: `/items/${uuid}` }],
			});
		});

		it('handles parameter with special characters in value', () => {
			mockUseParams.mockReturnValue({ slug: 'my-project-2024' });

			const menuItems = {
				main: [{ label: 'Project', path: '/projects/:slug' }],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [{ label: 'Project', path: '/projects/my-project-2024' }],
			});
		});

		it('handles consecutive parameters', () => {
			mockUseParams.mockReturnValue({
				orgId: 'org1',
				projectId: 'proj2',
			});

			const menuItems = {
				main: [
					{
						label: 'Project',
						path: '/orgs/:orgId/projects/:projectId',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{
						label: 'Project',
						path: '/orgs/org1/projects/proj2',
					},
				],
			});
		});

		it('does not replace partial param matches', () => {
			mockUseParams.mockReturnValue({
				id: '123',
				userId: '456',
			});

			const menuItems = {
				main: [
					{ label: 'Item', path: '/items/:id' },
					{ label: 'User', path: '/users/:userId' },
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			// :id should not match :userId
			expect(result.current).toEqual({
				main: [
					{ label: 'Item', path: '/items/123' },
					{ label: 'User', path: '/users/456' },
				],
			});
		});
	});

	describe('Memoization', () => {
		it('returns same reference when params and menuItems unchanged', () => {
			mockUseParams.mockReturnValue({ id: '123' });

			const menuItems = {
				main: [{ label: 'Item', path: '/items/:id' }],
			};

			const { result, rerender } = renderHook(() =>
				useResolvedMenu(menuItems)
			);

			const firstResult = result.current;

			rerender();

			expect(result.current).toBe(firstResult);
		});

		it('returns new reference when params change', () => {
			mockUseParams.mockReturnValue({ id: '123' });

			const menuItems = {
				main: [{ label: 'Item', path: '/items/:id' }],
			};

			const { result, rerender } = renderHook(() =>
				useResolvedMenu(menuItems)
			);

			const firstResult = result.current;

			// Change params
			mockUseParams.mockReturnValue({ id: '456' });
			rerender();

			expect(result.current).not.toBe(firstResult);
			expect(result.current.main[0].path).toBe('/items/456');
		});

		it('returns new reference when menuItems change', () => {
			mockUseParams.mockReturnValue({ id: '123' });

			const menuItems1 = {
				main: [{ label: 'Item', path: '/items/:id' }],
			};

			const { result, rerender } = renderHook(
				({ items }) => useResolvedMenu(items),
				{ initialProps: { items: menuItems1 } }
			);

			const firstResult = result.current;

			// Change menu items
			const menuItems2 = {
				main: [{ label: 'Other', path: '/other/:id' }],
			};
			rerender({ items: menuItems2 });

			expect(result.current).not.toBe(firstResult);
			expect(result.current.main[0].label).toBe('Other');
		});
	});

	describe('Complex Scenarios', () => {
		it('handles deeply nested paths', () => {
			mockUseParams.mockReturnValue({
				orgId: 'org1',
				projectId: 'proj1',
				suiteId: 'suite1',
				testId: 'test1',
			});

			const menuItems = {
				main: [
					{
						label: 'Test',
						path: '/orgs/:orgId/projects/:projectId/suites/:suiteId/tests/:testId',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{
						label: 'Test',
						path: '/orgs/org1/projects/proj1/suites/suite1/tests/test1',
					},
				],
			});
		});

		it('handles query parameters in paths', () => {
			mockUseParams.mockReturnValue({ projectId: '123' });

			const menuItems = {
				main: [
					{
						label: 'Project',
						path: '/projects/:projectId?tab=overview',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{
						label: 'Project',
						path: '/projects/123?tab=overview',
					},
				],
			});
		});

		it('handles hash fragments in paths', () => {
			mockUseParams.mockReturnValue({ sectionId: 'intro' });

			const menuItems = {
				main: [
					{
						label: 'Section',
						path: '/docs/:sectionId#content',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				main: [
					{
						label: 'Section',
						path: '/docs/intro#content',
					},
				],
			});
		});
	});

	describe('Real-World Scenarios', () => {
		it('resolves menu for project management app', () => {
			mockUseParams.mockReturnValue({
				workspaceId: 'ws-123',
				projectId: 'proj-456',
			});

			const menuItems = {
				workspace: [
					{ label: 'Dashboard', path: '/workspaces/:workspaceId' },
					{ label: 'Projects', path: '/workspaces/:workspaceId/projects' },
				],
				project: [
					{
						label: 'Overview',
						path: '/workspaces/:workspaceId/projects/:projectId',
					},
					{
						label: 'Tasks',
						path: '/workspaces/:workspaceId/projects/:projectId/tasks',
					},
					{
						label: 'Settings',
						path: '/workspaces/:workspaceId/projects/:projectId/settings',
					},
				],
			};

			const { result } = renderHook(() => useResolvedMenu(menuItems));

			expect(result.current).toEqual({
				workspace: [
					{ label: 'Dashboard', path: '/workspaces/ws-123' },
					{ label: 'Projects', path: '/workspaces/ws-123/projects' },
				],
				project: [
					{
						label: 'Overview',
						path: '/workspaces/ws-123/projects/proj-456',
					},
					{
						label: 'Tasks',
						path: '/workspaces/ws-123/projects/proj-456/tasks',
					},
					{
						label: 'Settings',
						path: '/workspaces/ws-123/projects/proj-456/settings',
					},
				],
			});
		});
	});
});

