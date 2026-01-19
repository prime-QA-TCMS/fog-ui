/**
 * Toast/Notification System Types
 * 
 * Defines types for a flexible, accessible toast notification system.
 */

/**
 * Toast message severity variants
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position on screen
 */
export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

/**
 * Individual toast message
 */
export interface Toast {
	/** Unique identifier for the toast */
	id: string;
	/** Toast message content */
	message: string;
	/** Toast severity variant */
	variant: ToastVariant;
	/** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
	duration?: number;
	/** Optional position override */
	position?: ToastPosition;
	/** Optional action button text */
	actionText?: string;
	/** Optional action button handler */
	onAction?: () => void;
}

/**
 * Options for creating a new toast
 */
export interface ToastOptions {
	/** Toast severity variant (default: 'info') */
	variant?: ToastVariant;
	/** Auto-dismiss duration in milliseconds (default: 5000, 0 = no auto-dismiss) */
	duration?: number;
	/** Position on screen (default: from context) */
	position?: ToastPosition;
	/** Optional action button text */
	actionText?: string;
	/** Optional action button handler */
	onAction?: () => void;
}

/**
 * Toast context value for managing toasts globally
 */
export interface ToastContextValue {
	/** Array of active toasts */
	toasts: Toast[];
	/** Add a new toast */
	addToast: (message: string, options?: ToastOptions) => string;
	/** Remove a toast by ID */
	removeToast: (id: string) => void;
	/** Remove all toasts */
	clearToasts: () => void;
	/** Default position for new toasts */
	defaultPosition: ToastPosition;
	/** Default duration for new toasts */
	defaultDuration: number;
}
