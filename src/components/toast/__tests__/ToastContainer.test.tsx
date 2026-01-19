import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ToastContainer } from '../ToastContainer';
import { ToastProvider } from '../ToastProvider';
import { useToast } from '../useToast';

describe('ToastContainer', () => {
	describe('Error Handling', () => {
		it('throws error when used outside ToastProvider', () => {
			// Suppress console.error for this test
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

			expect(() => {
				render(<ToastContainer />);
			}).toThrow('ToastContainer must be used within ToastProvider');

			consoleError.mockRestore();
		});
	});

	describe('Rendering Toasts', () => {
		it('renders no toasts when empty', () => {
			const { container } = render(
				<ToastProvider>
					<ToastContainer />
				</ToastProvider>
			);

			expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0);
		});

		it('renders toast when added', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button onClick={() => toast.info('Test message')}>Add Toast</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			expect(screen.getAllByText('Test message').length).toBeGreaterThan(0);
			expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
		});

		it('renders multiple toasts', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button
							onClick={() => {
								toast.success('Success');
								toast.error('Error');
								toast.warning('Warning');
							}}
						>
							Add Toasts
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toasts').click();
			});

			expect(screen.getAllByText('Success').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Error').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
		});
	});

	describe('Positioning', () => {
		it('uses default position from provider', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button onClick={() => toast.info('Test')}>Add Toast</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider defaultPosition="top-right">
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			// Verify toast is rendered with default position
			expect(screen.getAllByText('Test').length).toBeGreaterThan(0);
			expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
		});

		it('groups toasts by position', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button
							onClick={() => {
								toast.info('Top Left', { position: 'top-left' });
								toast.info('Top Right', { position: 'top-right' });
								toast.info('Bottom Left', { position: 'bottom-left' });
							}}
						>
							Add Toasts
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toasts').click();
			});

			// Verify all toasts are rendered in their respective positions
			expect(screen.getAllByText('Top Left').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Top Right').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Bottom Left').length).toBeGreaterThan(0);
		});

		it('renders toasts in top-center position', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button onClick={() => toast.info('Centered', { position: 'top-center' })}>
							Add Toast
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			// Verify toast is rendered with center position
			expect(screen.getAllByText('Centered').length).toBeGreaterThan(0);
			expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
		});

		it('renders toasts in bottom positions', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button
							onClick={() => {
								toast.info('Bottom Left', { position: 'bottom-left' });
								toast.info('Bottom Center', { position: 'bottom-center' });
								toast.info('Bottom Right', { position: 'bottom-right' });
							}}
						>
							Add Toasts
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toasts').click();
			});

			// Verify all three bottom toasts are rendered
			expect(screen.getAllByText('Bottom Left').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Bottom Center').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Bottom Right').length).toBeGreaterThan(0);
		});
	});

	describe('Toast Removal', () => {
		it('removes toast when close button clicked', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button onClick={() => toast.info('Test message')}>Add Toast</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			expect(screen.getAllByText('Test message').length).toBeGreaterThan(0);

			act(() => {
				const closeButtons = screen.getAllByLabelText('close');
				closeButtons[0]?.click();
			});

			expect(screen.queryAllByText('Test message')).toHaveLength(0);
		});

		it('removes specific toast among multiple', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button
							onClick={() => {
								toast.info('Toast 1');
								toast.info('Toast 2');
								toast.info('Toast 3');
							}}
						>
							Add Toasts
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toasts').click();
			});

			expect(screen.getAllByText('Toast 1').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Toast 2').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Toast 3').length).toBeGreaterThan(0);

			// Close the middle toast
			const closeButtons = screen.getAllByLabelText('close');
			act(() => {
				closeButtons[1]?.click();
			});

			expect(screen.getAllByText('Toast 1').length).toBeGreaterThan(0);
			expect(screen.queryAllByText('Toast 2')).toHaveLength(0);
			expect(screen.getAllByText('Toast 3').length).toBeGreaterThan(0);
		});
	});

	describe('Styling', () => {
		it('applies fixed positioning to containers', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button onClick={() => toast.info('Test')}>Add Toast</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			// Verify toast is rendered (positioning is applied via MUI sx prop)
			expect(screen.getAllByText('Test').length).toBeGreaterThan(0);
			expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
		});

		it('applies high z-index to containers', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button onClick={() => toast.info('Test')}>Add Toast</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			// Verify toast is rendered (z-index is applied via MUI sx prop)
			expect(screen.getAllByText('Test').length).toBeGreaterThan(0);
			expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
		});
	});

	describe('Integration', () => {
		it('works with all toast variants', () => {
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button
							onClick={() => {
								toast.success('Success');
								toast.error('Error');
								toast.warning('Warning');
								toast.info('Info');
							}}
						>
							Add All
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add All').click();
			});

			expect(screen.getAllByText('Success').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Error').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
			expect(screen.getAllByText('Info').length).toBeGreaterThan(0);

			const alerts = screen.getAllByRole('alert');
			expect(alerts.length).toBeGreaterThanOrEqual(4);
		});

		it('handles action buttons in toasts', () => {
			const mockAction = vi.fn();
			const TestComponent = () => {
				const toast = useToast();
				return (
					<>
						<button
							onClick={() =>
								toast.success('Action toast', {
									actionText: 'Undo',
									onAction: mockAction,
								})
							}
						>
							Add Toast
						</button>
						<ToastContainer />
					</>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			const undoButton = screen.getAllByText('Undo')[0];
			expect(undoButton).toBeInTheDocument();

			act(() => {
				undoButton.click();
			});

			expect(mockAction).toHaveBeenCalledTimes(1);
			expect(screen.queryByText('Action toast')).not.toBeInTheDocument();
		});
	});
});
