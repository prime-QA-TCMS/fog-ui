import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNavigationWithContext } from '../useNavigationWithContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('useNavigationWithContext', () => {
	const localStorageMock: Record<string, string> = {};

	beforeEach(() => {
		// Clear all mocks
		vi.clearAllMocks();

		// Reset localStorage
		Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);

		// Mock localStorage
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: vi.fn((key: string) => localStorageMock[key] || null),
				setItem: vi.fn((key: string, value: string) => {
					localStorageMock[key] = value;
				}),
				removeItem: vi.fn((key: string) => {
					delete localStorageMock[key];
				}),
				clear: vi.fn(() => {
					Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
				}),
			},
			writable: true,
		});

		// Mock window.dispatchEvent
		vi.spyOn(window, 'dispatchEvent');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// Helper to render hook with router context
	const renderHookWithRouter = () => {
		return renderHook(() => useNavigationWithContext(), {
			wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
		});
	};

	describe('Basic Navigation', () => {
		it('should navigate to path without context', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard');
			});

			expect(mockNavigate).toHaveBeenCalledWith('/dashboard', undefined);
		});

		it('should navigate to path with undefined context', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', undefined);
			});

			expect(mockNavigate).toHaveBeenCalledWith('/dashboard', undefined);
		});

		it('should navigate to path with empty context object', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', {});
			});

			expect(mockNavigate).toHaveBeenCalledWith('/dashboard', undefined);
			expect(localStorage.setItem).not.toHaveBeenCalled();
		});

		it('should navigate with react-router options', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/login', undefined, { replace: true });
			});

			expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
		});

		it('should navigate with state in options', () => {
			const { result } = renderHookWithRouter();
			const state = { from: '/protected' };

			act(() => {
				result.current.navigateWithContext('/login', undefined, { state });
			});

			expect(mockNavigate).toHaveBeenCalledWith('/login', { state });
		});
	});

	describe('Title Sync', () => {
		it('should set title in localStorage', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', { title: 'Dashboard' });
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('pageTitle', 'Dashboard');
			expect(localStorageMock.pageTitle).toBe('Dashboard');
		});

		it('should dispatch storage event for title', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', { title: 'Dashboard' });
			});

			expect(window.dispatchEvent).toHaveBeenCalled();
			const dispatchCall = (window.dispatchEvent as any).mock.calls.find(
				(call: any[]) => call[0] instanceof StorageEvent && call[0].key === 'pageTitle'
			);
			expect(dispatchCall).toBeDefined();
			expect(dispatchCall[0].newValue).toBe('Dashboard');
		});

		it('should not set title if not provided', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', { contextData: { foo: 'bar' } });
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('foo', '"bar"');
			expect(localStorage.setItem).not.toHaveBeenCalledWith('pageTitle', expect.anything());
		});

		it('should update title when navigating to different pages', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', { title: 'Dashboard' });
			});

			expect(localStorageMock.pageTitle).toBe('Dashboard');

			act(() => {
				result.current.navigateWithContext('/profile', { title: 'Profile' });
			});

			expect(localStorageMock.pageTitle).toBe('Profile');
			expect(localStorage.setItem).toHaveBeenCalledTimes(2);
		});
	});

	describe('Context Data Storage', () => {
		it('should store single context data item', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/user/123', {
					contextData: { userId: 123 },
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
			expect(localStorageMock.userId).toBe('123');
		});

		it('should store multiple context data items', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/user/123', {
					contextData: {
						userId: 123,
						userName: 'John Doe',
						userEmail: 'john@example.com',
					},
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
			expect(localStorage.setItem).toHaveBeenCalledWith('userName', '"John Doe"');
			expect(localStorage.setItem).toHaveBeenCalledWith('userEmail', '"john@example.com"');
			expect(localStorageMock.userId).toBe('123');
			expect(localStorageMock.userName).toBe('"John Doe"');
		});

		it('should JSON stringify complex context data', () => {
			const { result } = renderHookWithRouter();
			const breadcrumbs = ['Home', 'Users', 'Profile'];

			act(() => {
				result.current.navigateWithContext('/user/123', {
					contextData: { breadcrumbs },
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('breadcrumbs', JSON.stringify(breadcrumbs));
			expect(localStorageMock.breadcrumbs).toBe(JSON.stringify(breadcrumbs));
		});

		it('should dispatch storage events for each context data item', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/user/123', {
					contextData: {
						userId: 123,
						userName: 'John Doe',
					},
				});
			});

			// Should have dispatched 2 events (one for each context data item)
			const storageEvents = (window.dispatchEvent as any).mock.calls.filter(
				(call: any[]) => call[0] instanceof StorageEvent
			);

			expect(storageEvents.length).toBeGreaterThanOrEqual(2);

			const userIdEvent = storageEvents.find((call: any[]) => call[0].key === 'userId');
			expect(userIdEvent).toBeDefined();
			expect(userIdEvent[0].newValue).toBe('123');

			const userNameEvent = storageEvents.find((call: any[]) => call[0].key === 'userName');
			expect(userNameEvent).toBeDefined();
			expect(userNameEvent[0].newValue).toBe('"John Doe"');
		});

		it('should handle empty contextData object', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', { contextData: {} });
			});

			expect(mockNavigate).toHaveBeenCalledWith('/dashboard', undefined);
			// No localStorage calls except for possible initialization
			const setItemCalls = (localStorage.setItem as any).mock.calls;
			expect(setItemCalls.length).toBe(0);
		});
	});

	describe('Combined Title and Context Data', () => {
		it('should set both title and context data', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/user/123', {
					title: 'User Profile',
					contextData: { userId: 123 },
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('pageTitle', 'User Profile');
			expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
			expect(localStorageMock.pageTitle).toBe('User Profile');
			expect(localStorageMock.userId).toBe('123');
		});

		it('should dispatch storage events for both title and context data', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/user/123', {
					title: 'User Profile',
					contextData: { userId: 123 },
				});
			});

			const storageEvents = (window.dispatchEvent as any).mock.calls.filter(
				(call: any[]) => call[0] instanceof StorageEvent
			);

			expect(storageEvents.length).toBeGreaterThanOrEqual(2);

			const titleEvent = storageEvents.find((call: any[]) => call[0].key === 'pageTitle');
			expect(titleEvent).toBeDefined();

			const userIdEvent = storageEvents.find((call: any[]) => call[0].key === 'userId');
			expect(userIdEvent).toBeDefined();
		});
	});

	describe('Edge Cases', () => {
		it('should handle null values in contextData', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', {
					contextData: { value: null },
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('value', 'null');
			expect(localStorageMock.value).toBe('null');
		});

		it('should handle undefined values in contextData', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', {
					contextData: { value: undefined },
				});
			});

			// undefined gets stringified as undefined (not "undefined" string)
			expect(localStorage.setItem).toHaveBeenCalled();
		});

		it('should handle boolean values in contextData', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', {
					contextData: { isActive: true, isVerified: false },
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('isActive', 'true');
			expect(localStorage.setItem).toHaveBeenCalledWith('isVerified', 'false');
		});

		it('should handle number values in contextData', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', {
					contextData: { count: 42, price: 99.99 },
				});
			});

			expect(localStorage.setItem).toHaveBeenCalledWith('count', '42');
			expect(localStorage.setItem).toHaveBeenCalledWith('price', '99.99');
		});

		it('should handle circular reference gracefully', () => {
			const { result } = renderHookWithRouter();
			const circular: any = { prop: 'value' };
			circular.self = circular;

			// Mock console.error to avoid test noise
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

			act(() => {
				result.current.navigateWithContext('/dashboard', {
					contextData: { circular },
				});
			});

			// Should log error but still navigate
			expect(consoleError).toHaveBeenCalled();
			expect(mockNavigate).toHaveBeenCalledWith('/dashboard', undefined);

			consoleError.mockRestore();
		});

		it('should handle empty string path', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('', { title: 'Home' });
			});

			expect(mockNavigate).toHaveBeenCalledWith('', undefined);
			expect(localStorage.setItem).toHaveBeenCalledWith('pageTitle', 'Home');
		});
	});

	describe('Real-World Scenarios', () => {
		it('should handle user profile navigation with breadcrumbs', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/user/123', {
					title: 'User Profile - John Doe',
					contextData: {
						userId: 123,
						userName: 'John Doe',
						breadcrumbs: ['Home', 'Users', 'John Doe'],
						lastVisited: new Date('2026-01-19').toISOString(),
					},
				});
			});

			expect(localStorageMock.pageTitle).toBe('User Profile - John Doe');
			expect(localStorageMock.userId).toBe('123');
			expect(localStorageMock.userName).toBe('"John Doe"');
			expect(JSON.parse(localStorageMock.breadcrumbs)).toEqual(['Home', 'Users', 'John Doe']);
			expect(mockNavigate).toHaveBeenCalledWith('/user/123', undefined);
		});

		it('should handle dashboard navigation with filters', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/dashboard', {
					title: 'Analytics Dashboard',
					contextData: {
						dateRange: { start: '2026-01-01', end: '2026-01-19' },
						selectedMetrics: ['revenue', 'users', 'orders'],
						viewMode: 'grid',
					},
				});
			});

			expect(localStorageMock.pageTitle).toBe('Analytics Dashboard');
			expect(JSON.parse(localStorageMock.dateRange)).toEqual({
				start: '2026-01-01',
				end: '2026-01-19',
			});
			expect(JSON.parse(localStorageMock.selectedMetrics)).toEqual(['revenue', 'users', 'orders']);
		});

		it('should handle authentication redirect with return path', () => {
			const { result } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext(
					'/login',
					{
						title: 'Login',
						contextData: {
							returnTo: '/dashboard',
							reason: 'session_expired',
						},
					},
					{ replace: true }
				);
			});

			expect(localStorageMock.pageTitle).toBe('Login');
			expect(localStorageMock.returnTo).toBe('"/dashboard"');
			expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
		});

		it('should handle form navigation with draft data', () => {
			const { result } = renderHookWithRouter();
			const formDraft = {
				title: 'Draft Post',
				content: 'This is a draft...',
				tags: ['react', 'typescript'],
				savedAt: Date.now(),
			};

			act(() => {
				result.current.navigateWithContext('/posts/new', {
					title: 'Create Post',
					contextData: {
						formDraft,
						isDraft: true,
					},
				});
			});

			expect(localStorageMock.pageTitle).toBe('Create Post');
			expect(JSON.parse(localStorageMock.formDraft)).toEqual(formDraft);
			expect(localStorageMock.isDraft).toBe('true');
		});

		it('should handle navigation sequence preserving context', () => {
			const { result } = renderHookWithRouter();

			// Navigate to list page
			act(() => {
				result.current.navigateWithContext('/users', {
					title: 'Users',
					contextData: { page: 1, pageSize: 20 },
				});
			});

			expect(localStorageMock.pageTitle).toBe('Users');
			expect(localStorageMock.page).toBe('1');

			// Navigate to detail page
			act(() => {
				result.current.navigateWithContext('/users/123', {
					title: 'User Detail',
					contextData: { userId: 123, previousPage: '/users' },
				});
			});

			expect(localStorageMock.pageTitle).toBe('User Detail');
			expect(localStorageMock.userId).toBe('123');
			expect(localStorageMock.previousPage).toBe('"/users"');

			// Verify localStorage contains both old and new data
			expect(localStorageMock.page).toBe('1'); // Previous context still exists
		});
	});

	describe('Hook Stability', () => {
		it('should return stable navigateWithContext function', () => {
			const { result, rerender } = renderHookWithRouter();

			const firstFunction = result.current.navigateWithContext;

			rerender();

			const secondFunction = result.current.navigateWithContext;

			expect(firstFunction).toBe(secondFunction);
		});

		it('should maintain functionality after rerender', () => {
			const { result, rerender } = renderHookWithRouter();

			act(() => {
				result.current.navigateWithContext('/page1', { title: 'Page 1' });
			});

			expect(localStorageMock.pageTitle).toBe('Page 1');

			rerender();

			act(() => {
				result.current.navigateWithContext('/page2', { title: 'Page 2' });
			});

			expect(localStorageMock.pageTitle).toBe('Page 2');
			expect(mockNavigate).toHaveBeenCalledTimes(2);
		});
	});
});
