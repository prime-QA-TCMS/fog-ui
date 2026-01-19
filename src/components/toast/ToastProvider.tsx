import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { ToastContainer } from './ToastContainer';
import type { Toast, ToastOptions, ToastContextValue, ToastPosition } from './types';

/**
 * Toast Context
 * 
 * Provides toast notification state and methods globally.
 */
export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
	/** Child components */
	children: React.ReactNode;
	/** Default position for toasts (default: 'top-right') */
	defaultPosition?: ToastPosition;
	/** Default auto-dismiss duration in ms (default: 5000, 0 = no auto-dismiss) */
	defaultDuration?: number;
	/** Maximum number of toasts to display simultaneously (default: 5) */
	maxToasts?: number;
}

/**
 * ToastProvider Component
 * 
 * Provides global toast notification functionality to the application.
 * Manages toast state, auto-dismissal, and toast queue.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * import { ToastProvider } from 'fog-ui';
 * 
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Custom configuration
 * <ToastProvider
 *   defaultPosition="bottom-center"
 *   defaultDuration={3000}
 *   maxToasts={3}
 * >
 *   <YourApp />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
	children,
	defaultPosition = 'top-right',
	defaultDuration = 5000,
	maxToasts = 5,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	/**
	 * Generate a unique ID for a toast
	 */
	const generateId = useCallback((): string => {
		return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
	}, []);

	/**
	 * Remove a toast by ID
	 */
	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));

		// Clear the timeout if it exists
		const timeout = timeoutsRef.current.get(id);
		if (timeout) {
			clearTimeout(timeout);
			timeoutsRef.current.delete(id);
		}
	}, []);

	/**
	 * Add a new toast
	 */
	const addToast = useCallback(
		(message: string, options?: ToastOptions): string => {
			const id = generateId();
			const duration = options?.duration ?? defaultDuration;

			const newToast: Toast = {
				id,
				message,
				variant: options?.variant ?? 'info',
				duration,
				position: options?.position,
				actionText: options?.actionText,
				onAction: options?.onAction,
			};

			setToasts((prev) => {
				// If at max capacity, remove oldest toast
				const updated = prev.length >= maxToasts ? prev.slice(1) : prev;
				return [...updated, newToast];
			});

			// Set up auto-dismiss if duration > 0
			if (duration > 0) {
				const timeout = setTimeout(() => {
					removeToast(id);
				}, duration);
				timeoutsRef.current.set(id, timeout);
			}

			return id;
		},
		[generateId, defaultDuration, maxToasts, removeToast]
	);

	/**
	 * Clear all toasts
	 */
	const clearToasts = useCallback(() => {
		// Clear all timeouts
		timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
		timeoutsRef.current.clear();
		setToasts([]);
	}, []);

	/**
	 * Cleanup timeouts on unmount
	 */
	useEffect(() => {
		return () => {
			timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			timeoutsRef.current.clear();
		};
	}, []);

	const value: ToastContextValue = {
		toasts,
		addToast,
		removeToast,
		clearToasts,
		defaultPosition,
		defaultDuration,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
};
