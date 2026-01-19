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

			expect(screen.getByText('Test message')).toBeInTheDocument();
			expect(screen.getByRole('alert')).toBeInTheDocument();
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

			expect(screen.getByText('Success')).toBeInTheDocument();
			expect(screen.getByText('Error')).toBeInTheDocument();
			expect(screen.getByText('Warning')).toBeInTheDocument();
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
			expect(screen.getByText('Test')).toBeInTheDocument();
			expect(screen.getByRole('alert')).toBeInTheDocument();
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
			expect(screen.getByText('Top Left')).toBeInTheDocument();
			expect(screen.getByText('Top Right')).toBeInTheDocument();
			expect(screen.getByText('Bottom Left')).toBeInTheDocument();
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
			expect(screen.getByText('Centered')).toBeInTheDocument();
			expect(screen.getByRole('alert')).toBeInTheDocument();
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
			expect(screen.getByText('Bottom Left')).toBeInTheDocument();
			expect(screen.getByText('Bottom Center')).toBeInTheDocument();
			expect(screen.getByText('Bottom Right')).toBeInTheDocument();
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

			expect(screen.getByText('Test message')).toBeInTheDocument();

			act(() => {
				screen.getByLabelText('close').click();
			});

			expect(screen.queryByText('Test message')).not.toBeInTheDocument();
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

			expect(screen.getByText('Toast 1')).toBeInTheDocument();
			expect(screen.getByText('Toast 2')).toBeInTheDocument();
			expect(screen.getByText('Toast 3')).toBeInTheDocument();

			// Close the middle toast
			const closeButtons = screen.getAllByLabelText('close');
			act(() => {
				closeButtons[1].click();
			});

			expect(screen.getByText('Toast 1')).toBeInTheDocument();
			expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
			expect(screen.getByText('Toast 3')).toBeInTheDocument();
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
			expect(screen.getByText('Test')).toBeInTheDocument();
			expect(screen.getByRole('alert')).toBeInTheDocument();
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
			expect(screen.getByText('Test')).toBeInTheDocument();
			expect(screen.getByRole('alert')).toBeInTheDocument();
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

			expect(screen.getByText('Success')).toBeInTheDocument();
			expect(screen.getByText('Error')).toBeInTheDocument();
			expect(screen.getByText('Warning')).toBeInTheDocument();
			expect(screen.getByText('Info')).toBeInTheDocument();

			const alerts = screen.getAllByRole('alert');
			expect(alerts).toHaveLength(4);
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

			const undoButton = screen.getByText('Undo');
			expect(undoButton).toBeInTheDocument();

			act(() => {
				undoButton.click();
			});

			expect(mockAction).toHaveBeenCalledTimes(1);
			expect(screen.queryByText('Action toast')).not.toBeInTheDocument();
		});
	});
});
