import { useCallback } from 'react';
import { useNavigate, NavigateOptions } from 'react-router-dom';

/**
 * Context data that can be passed during navigation
 */
export interface NavigationContext {
	/**
	 * Page title to set in localStorage and dispatch as storage event
	 * This allows PageWrapper or other components to automatically update the page title
	 */
	title?: string;

	/**
	 * Additional context data to store in localStorage
	 * Each key-value pair will be stored as a separate localStorage item
	 * Values will be JSON stringified before storage
	 */
	contextData?: Record<string, any>;
}

/**
 * Return type for useNavigationWithContext hook
 */
export interface NavigationWithContextReturn {
	/**
	 * Navigate to a path with optional context data
	 * @param path - The path to navigate to
	 * @param context - Optional context data (title, contextData)
	 * @param options - Optional react-router NavigateOptions (replace, state, etc.)
	 */
	navigateWithContext: (
		path: string,
		context?: NavigationContext,
		options?: NavigateOptions
	) => void;
}

/**
 * Custom hook for navigation with automatic breadcrumb/title sync and context data management
 * 
 * This hook provides navigation with localStorage integration, allowing you to:
 * - Set page titles that persist across navigations
 * - Store arbitrary context data in localStorage
 * - Dispatch storage events for cross-component communication
 * - Support all standard react-router navigation options
 * 
 * @returns Object with navigateWithContext function
 * 
 * @example
 * // Basic navigation with title
 * const { navigateWithContext } = useNavigationWithContext();
 * navigateWithContext('/dashboard', { title: 'Dashboard' });
 * 
 * @example
 * // Navigation with title and context data
 * navigateWithContext('/user/123', {
 *   title: 'User Profile',
 *   contextData: {
 *     userId: 123,
 *     userName: 'John Doe',
 *     breadcrumbs: ['Home', 'Users', 'Profile']
 *   }
 * });
 * 
 * @example
 * // Navigation with replace option (no history entry)
 * navigateWithContext('/login', { title: 'Login' }, { replace: true });
 * 
 * @example
 * // Navigation with router state
 * navigateWithContext('/dashboard', undefined, {
 *   state: { from: '/login' }
 * });
 * 
 * @example
 * // Listen to title changes in another component
 * useEffect(() => {
 *   const handleStorageChange = (e: StorageEvent) => {
 *     if (e.key === 'pageTitle' && e.newValue) {
 *       setPageTitle(e.newValue);
 *     }
 *   };
 *   window.addEventListener('storage', handleStorageChange);
 *   return () => window.removeEventListener('storage', handleStorageChange);
 * }, []);
 */
export function useNavigationWithContext(): NavigationWithContextReturn {
	const navigate = useNavigate();

	const navigateWithContext = useCallback(
		(
			path: string,
			context?: NavigationContext,
			options?: NavigateOptions
		) => {
			// Set page title in localStorage and dispatch storage event
			if (context?.title) {
				const oldValue = localStorage.getItem('pageTitle');
				localStorage.setItem('pageTitle', context.title);

				// Dispatch storage event for same-window communication
				// Note: localStorage events don't fire in the same window by default,
				// so we manually dispatch a StorageEvent
				window.dispatchEvent(
					new StorageEvent('storage', {
						key: 'pageTitle',
						newValue: context.title,
						oldValue: oldValue,
						url: window.location.href,
					})
				);
			}

			// Store context data in localStorage
			if (context?.contextData) {
				Object.entries(context.contextData).forEach(([key, value]) => {
					try {
						const oldValue = localStorage.getItem(key);
						const stringValue = JSON.stringify(value);
						localStorage.setItem(key, stringValue);

						// Dispatch storage event for each context data item
						window.dispatchEvent(
							new StorageEvent('storage', {
								key,
								newValue: stringValue,
								oldValue: oldValue,
								url: window.location.href,
							})
						);
					} catch (error) {
						console.error(`Failed to store context data for key "${key}":`, error);
					}
				});
			}

			// Perform navigation with optional react-router options
			navigate(path, options);
		},
		[navigate]
	);

	return { navigateWithContext };
}
