import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ToastProvider, ToastContext } from '../ToastProvider';
import { useContext } from 'react';

describe('ToastProvider', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('Context Provider', () => {
		it('provides toast context to children', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return <div>{context ? 'Context Available' : 'No Context'}</div>;
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			expect(screen.getByText('Context Available')).toBeInTheDocument();
		});

		it('renders children', () => {
			render(
				<ToastProvider>
					<div>Test Child</div>
				</ToastProvider>
			);

			expect(screen.getByText('Test Child')).toBeInTheDocument();
		});
	});

	describe('Adding Toasts', () => {
		it('adds a toast', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Test message')}>Add Toast</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			const button = screen.getByText('Add Toast');
			act(() => {
				button.click();
			});

			expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
		});

		it('adds multiple toasts', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Message 1')}>Add Toast</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			const button = screen.getByText('Add Toast');
			act(() => {
				button.click();
				button.click();
				button.click();
			});

			expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
		});

		it('respects maxToasts limit', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Message')}>Add Toast</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider maxToasts={3}>
					<TestComponent />
				</ToastProvider>
			);

			const button = screen.getByText('Add Toast');
			act(() => {
				button.click();
				button.click();
				button.click();
				button.click(); // 4th toast should remove oldest
			});

			expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
		});

		it('adds toast with custom options', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button
							onClick={() =>
								context?.addToast('Success!', {
									variant: 'success',
									duration: 3000,
									position: 'bottom-center',
								})
							}
						>
							Add Toast
						</button>
						<div data-testid="toast-variant">{context?.toasts[0]?.variant}</div>
					</div>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			const button = screen.getByText('Add Toast');
			act(() => {
				button.click();
			});

			expect(screen.getByTestId('toast-variant')).toHaveTextContent('success');
		});

		it('returns unique toast ID', () => {
			const ids: string[] = [];
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<button
						onClick={() => {
							const id = context?.addToast('Test');
							if (id) ids.push(id);
						}}
					>
						Add Toast
					</button>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			const button = screen.getByText('Add Toast');
			act(() => {
				button.click();
				button.click();
				button.click();
			});

			expect(ids.length).toBe(3);
			expect(new Set(ids).size).toBe(3); // All unique
		});
	});

	describe('Removing Toasts', () => {
		it('removes a toast by ID', () => {
			let toastId: string | undefined;
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => { toastId = context?.addToast('Test'); }}>
							Add Toast
						</button>
						<button onClick={() => toastId && context?.removeToast(toastId)}>
							Remove Toast
						</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
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
			expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

			act(() => {
				screen.getByText('Remove Toast').click();
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});

		it('handles removing non-existent toast', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.removeToast('non-existent-id')}>
							Remove Toast
						</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Remove Toast').click();
			});

			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});
	});

	describe('Auto-Dismiss', () => {
		it('auto-dismisses toast after default duration', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Test', { duration: 5000 })}>
							Add Toast
						</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
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
			expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

			act(() => {
				vi.advanceTimersByTime(5000);
			});

			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});

		it('does not auto-dismiss when duration is 0', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Test', { duration: 0 })}>
							Add Toast
						</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
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
			expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

			act(() => {
				vi.advanceTimersByTime(10000);
			});

			expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
		});

		it('uses custom default duration', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Test')}>Add Toast</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider defaultDuration={3000}>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			act(() => {
				vi.advanceTimersByTime(2999);
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

			act(() => {
				vi.advanceTimersByTime(1);
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});

		it('clears timeout when toast manually removed', () => {
			let toastId: string | undefined;
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => { toastId = context?.addToast('Test', { duration: 5000 }); }}>
							Add Toast
						</button>
						<button onClick={() => toastId && context?.removeToast(toastId)}>
							Remove Toast
						</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
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

			act(() => {
				screen.getByText('Remove Toast').click();
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

			// Advance past original auto-dismiss time
			act(() => {
				vi.advanceTimersByTime(5000);
			});
			// Should still be 0, not cause any issues
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});
	});

	describe('Clear All Toasts', () => {
		it('clears all toasts', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Test')}>Add Toast</button>
						<button onClick={() => context?.clearToasts()}>Clear All</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
				screen.getByText('Add Toast').click();
				screen.getByText('Add Toast').click();
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('3');

			act(() => {
				screen.getByText('Clear All').click();
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});

		it('clears all pending timeouts', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<div>
						<button onClick={() => context?.addToast('Test', { duration: 5000 })}>
							Add Toast
						</button>
						<button onClick={() => context?.clearToasts()}>Clear All</button>
						<div data-testid="toast-count">{context?.toasts.length}</div>
					</div>
				);
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
				screen.getByText('Add Toast').click();
			});

			act(() => {
				screen.getByText('Clear All').click();
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

			// Advance time - should not cause issues
			act(() => {
				vi.advanceTimersByTime(10000);
			});
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});
	});

	describe('Default Props', () => {
		it('uses default position', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return <div data-testid="position">{context?.defaultPosition}</div>;
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			expect(screen.getByTestId('position')).toHaveTextContent('top-right');
		});

		it('uses custom default position', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return <div data-testid="position">{context?.defaultPosition}</div>;
			};

			render(
				<ToastProvider defaultPosition="bottom-center">
					<TestComponent />
				</ToastProvider>
			);

			expect(screen.getByTestId('position')).toHaveTextContent('bottom-center');
		});

		it('uses default duration', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return <div data-testid="duration">{context?.defaultDuration}</div>;
			};

			render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			expect(screen.getByTestId('duration')).toHaveTextContent('5000');
		});

		it('uses custom default duration', () => {
			const TestComponent = () => {
				const context = useContext(ToastContext);
				return <div data-testid="duration">{context?.defaultDuration}</div>;
			};

			render(
				<ToastProvider defaultDuration={3000}>
					<TestComponent />
				</ToastProvider>
			);

			expect(screen.getByTestId('duration')).toHaveTextContent('3000');
		});
	});

	describe('Cleanup', () => {
		it('cleans up timeouts on unmount', () => {
			const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

			const TestComponent = () => {
				const context = useContext(ToastContext);
				return (
					<button onClick={() => context?.addToast('Test', { duration: 5000 })}>
						Add Toast
					</button>
				);
			};

			const { unmount } = render(
				<ToastProvider>
					<TestComponent />
				</ToastProvider>
			);

			act(() => {
				screen.getByText('Add Toast').click();
			});

			unmount();

			expect(clearTimeoutSpy).toHaveBeenCalled();
		});
	});
});
