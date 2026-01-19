import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Toast } from '../Toast';
import type { Toast as ToastType } from '../types';

describe('Toast', () => {
	const mockOnClose = vi.fn();

	beforeEach(() => {
		mockOnClose.mockClear();
	});

	describe('Basic Rendering', () => {
		it('renders toast message', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Test message',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.getByText('Test message')).toBeInTheDocument();
		});

		it('renders with success variant', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Success!',
				variant: 'success',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const alert = screen.getByRole('alert');
			expect(alert).toHaveClass('MuiAlert-standardSuccess');
		});

		it('renders with error variant', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Error!',
				variant: 'error',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const alert = screen.getByRole('alert');
			expect(alert).toHaveClass('MuiAlert-standardError');
		});

		it('renders with warning variant', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Warning!',
				variant: 'warning',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const alert = screen.getByRole('alert');
			expect(alert).toHaveClass('MuiAlert-standardWarning');
		});

		it('renders with info variant', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Info!',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const alert = screen.getByRole('alert');
			expect(alert).toHaveClass('MuiAlert-standardInfo');
		});
	});

	describe('Close Functionality', () => {
		it('calls onClose when close button clicked', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const closeButton = screen.getByLabelText('close');
			fireEvent.click(closeButton);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
			expect(mockOnClose).toHaveBeenCalledWith('1');
		});

		it('has accessible close button', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const closeButton = screen.getByLabelText('close');
			expect(closeButton).toBeInTheDocument();
			expect(closeButton).toHaveAttribute('aria-label', 'close');
		});
	});

	describe('Action Button', () => {
		it('renders action button when provided', () => {
			const mockAction = vi.fn();
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
				actionText: 'Undo',
				onAction: mockAction,
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.getByText('Undo')).toBeInTheDocument();
		});

		it('calls onAction and onClose when action button clicked', () => {
			const mockAction = vi.fn();
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
				actionText: 'Undo',
				onAction: mockAction,
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const actionButton = screen.getByText('Undo');
			fireEvent.click(actionButton);

			expect(mockAction).toHaveBeenCalledTimes(1);
			expect(mockOnClose).toHaveBeenCalledTimes(1);
			expect(mockOnClose).toHaveBeenCalledWith('1');
		});

		it('does not render action button without onAction', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
				actionText: 'Undo',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.queryByText('Undo')).not.toBeInTheDocument();
		});

		it('does not render action button without actionText', () => {
			const mockAction = vi.fn();
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
				onAction: mockAction,
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			// Should only have close button, not action button
			const buttons = screen.getAllByRole('button');
			expect(buttons).toHaveLength(1); // Only close button
		});
	});

	describe('Accessibility', () => {
		it('has alert role', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.getByRole('alert')).toBeInTheDocument();
		});

		it('renders message as text content', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Important notification',
				variant: 'warning',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const alert = screen.getByRole('alert');
			expect(alert).toHaveTextContent('Important notification');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty message', () => {
			const toast: ToastType = {
				id: '1',
				message: '',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.getByRole('alert')).toBeInTheDocument();
		});

		it('handles long messages', () => {
			const longMessage = 'A'.repeat(500);
			const toast: ToastType = {
				id: '1',
				message: longMessage,
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.getByText(longMessage)).toBeInTheDocument();
		});

		it('handles special characters in message', () => {
			const toast: ToastType = {
				id: '1',
				message: '<script>alert("XSS")</script> & special chars',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			expect(screen.getByText('<script>alert("XSS")</script> & special chars')).toBeInTheDocument();
		});

		it('handles multiple rapid clicks on close button', () => {
			const toast: ToastType = {
				id: '1',
				message: 'Test',
				variant: 'info',
			};

			render(<Toast toast={toast} onClose={mockOnClose} />);
			const closeButton = screen.getByLabelText('close');

			fireEvent.click(closeButton);
			fireEvent.click(closeButton);
			fireEvent.click(closeButton);

			expect(mockOnClose).toHaveBeenCalledTimes(3);
		});
	});
});
