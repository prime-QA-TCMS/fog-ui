import { useContext } from 'react';
import { ToastContext } from './ToastProvider';
import type { ToastOptions } from './types';

/**
 * useToast Hook
 * 
 * Provides convenient methods for displaying toast notifications.
 * Must be used within a ToastProvider.
 * 
 * @returns Object with toast methods and state
 * 
 * @example
 * ```tsx
 * import { useToast } from 'fog-ui';
 * 
 * function MyComponent() {
 *   const toast = useToast();
 * 
 *   const handleSuccess = () => {
 *     toast.success('Operation completed successfully!');
 *   };
 * 
 *   const handleError = () => {
 *     toast.error('Something went wrong', { duration: 0 }); // Won't auto-dismiss
 *   };
 * 
 *   return <button onClick={handleSuccess}>Save</button>;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With custom options
 * const toast = useToast();
 * 
 * toast.warning('Low disk space', {
 *   duration: 10000,
 *   position: 'bottom-center',
 *   actionText: 'View Details',
 *   onAction: () => console.log('Action clicked')
 * });
 * ```
 * 
 * @example
 * ```tsx
 * // Custom toast
 * const id = toast.show('Custom message', {
 *   variant: 'info',
 *   duration: 3000
 * });
 * 
 * // Remove specific toast
 * toast.remove(id);
 * 
 * // Clear all toasts
 * toast.clearAll();
 * ```
 */
export const useToast = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useToast must be used within ToastProvider');
	}

	const { addToast, removeToast, clearToasts, toasts } = context;

	return {
		/**
		 * Display a success toast
		 * @param message - Toast message
		 * @param options - Optional toast configuration
		 * @returns Toast ID
		 */
		success: (message: string, options?: Omit<ToastOptions, 'variant'>) => {
			return addToast(message, { ...options, variant: 'success' });
		},

		/**
		 * Display an error toast
		 * @param message - Toast message
		 * @param options - Optional toast configuration
		 * @returns Toast ID
		 */
		error: (message: string, options?: Omit<ToastOptions, 'variant'>) => {
			return addToast(message, { ...options, variant: 'error' });
		},

		/**
		 * Display a warning toast
		 * @param message - Toast message
		 * @param options - Optional toast configuration
		 * @returns Toast ID
		 */
		warning: (message: string, options?: Omit<ToastOptions, 'variant'>) => {
			return addToast(message, { ...options, variant: 'warning' });
		},

		/**
		 * Display an info toast
		 * @param message - Toast message
		 * @param options - Optional toast configuration
		 * @returns Toast ID
		 */
		info: (message: string, options?: Omit<ToastOptions, 'variant'>) => {
			return addToast(message, { ...options, variant: 'info' });
		},

		/**
		 * Display a toast with custom options
		 * @param message - Toast message
		 * @param options - Optional toast configuration
		 * @returns Toast ID
		 */
		show: (message: string, options?: ToastOptions) => {
			return addToast(message, options);
		},

		/**
		 * Remove a specific toast by ID
		 * @param id - Toast ID to remove
		 */
		remove: (id: string) => {
			removeToast(id);
		},

		/**
		 * Clear all active toasts
		 */
		clearAll: () => {
			clearToasts();
		},

		/**
		 * Array of currently active toasts
		 */
		toasts,
	};
};
