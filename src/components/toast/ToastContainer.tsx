import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { Toast } from './Toast';
import { ToastContext } from './ToastProvider';
import type { ToastPosition } from './types';

/**
 * Get CSS position styles based on toast position
 */
const getPositionStyles = (position: ToastPosition) => {
	const baseStyles = {
		position: 'fixed' as const,
		zIndex: 9999,
		display: 'flex',
		flexDirection: 'column' as const,
		gap: 1,
		pointerEvents: 'none' as const,
		'& > *': {
			pointerEvents: 'auto' as const,
		},
	};

	switch (position) {
		case 'top-left':
			return { ...baseStyles, top: 16, left: 16 };
		case 'top-center':
			return { ...baseStyles, top: 16, left: '50%', transform: 'translateX(-50%)' };
		case 'top-right':
			return { ...baseStyles, top: 16, right: 16 };
		case 'bottom-left':
			return { ...baseStyles, bottom: 16, left: 16, flexDirection: 'column-reverse' };
		case 'bottom-center':
			return {
				...baseStyles,
				bottom: 16,
				left: '50%',
				transform: 'translateX(-50%)',
				flexDirection: 'column-reverse',
			};
		case 'bottom-right':
			return { ...baseStyles, bottom: 16, right: 16, flexDirection: 'column-reverse' };
		default:
			return { ...baseStyles, top: 16, right: 16 };
	}
};

/**
 * ToastContainer Component
 * 
 * Renders all active toasts at their specified positions.
 * Automatically groups toasts by position for proper stacking.
 * 
 * This component should be rendered once at the root level of your application,
 * typically inside the ToastProvider.
 * 
 * @example
 * ```tsx
 * import { ToastProvider, ToastContainer } from 'fog-ui';
 * 
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <YourApp />
 *       <ToastContainer />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export const ToastContainer: React.FC = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('ToastContainer must be used within ToastProvider');
	}

	const { toasts, removeToast, defaultPosition } = context;

	// Group toasts by position
	const toastsByPosition = toasts.reduce(
		(acc, toast) => {
			const position = toast.position || defaultPosition;
			if (!acc[position]) {
				acc[position] = [];
			}
			acc[position].push(toast);
			return acc;
		},
		{} as Record<ToastPosition, typeof toasts>
	);

	return (
		<>
			{Object.entries(toastsByPosition).map(([position, positionToasts]) => (
				<Box key={position} sx={getPositionStyles(position as ToastPosition)}>
					{positionToasts.map((toast) => (
						<Toast key={toast.id} toast={toast} onClose={removeToast} />
					))}
				</Box>
			))}
		</>
	);
};
