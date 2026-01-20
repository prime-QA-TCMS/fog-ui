import React from 'react';
import { Alert, IconButton, Button, Slide, type SlideProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Toast as ToastType } from './types';

export interface ToastProps {
	/** Toast data */
	toast: ToastType;
	/** Callback when toast is dismissed */
	onClose: (id: string) => void;
}

/**
 * Toast Component
 * 
 * Displays a single toast notification message with Material-UI Alert.
 * Supports different variants, custom actions, and dismissal.
 * 
 * @example
 * ```tsx
 * <Toast
 *   toast={{
 *     id: '1',
 *     message: 'Operation successful!',
 *     variant: 'success',
 *     duration: 5000
 *   }}
 *   onClose={handleClose}
 * />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
	const handleClose = () => {
		onClose(toast.id);
	};

	const handleAction = () => {
		if (toast.onAction) {
			toast.onAction();
			handleClose();
		}
	};

	return (
		<Alert
			severity={toast.variant}
			onClose={handleClose}
			action={
				<>
					{toast.actionText && toast.onAction && (
						<Button color="inherit" size="small" onClick={handleAction}>
							{toast.actionText}
						</Button>
					)}
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleClose}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</>
			}
			sx={{
				mb: 1,
				minWidth: 300,
				maxWidth: 500,
				boxShadow: 3,
			}}
		>
			{toast.message}
		</Alert>
	);
};
