import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true, message = 'Test error' }: { shouldThrow?: boolean; message?: string }) => {
	if (shouldThrow) {
		throw new Error(message);
	}
	return <div>No error</div>;
};

// Suppress console.error for tests (ErrorBoundary will log errors)
const originalError = console.error;
beforeEach(() => {
	console.error = vi.fn();
});

afterEach(() => {
	console.error = originalError;
});

describe('ErrorBoundary', () => {
	describe('Error Catching', () => {
		it('should catch errors from child components', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			);

			// Should show default error message
			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		});

		it('should render children when no error occurs', () => {
			render(
				<ErrorBoundary>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>
			);

			expect(screen.getByText('No error')).toBeInTheDocument();
			expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
		});

		it('should catch different error messages', () => {
			render(
				<ErrorBoundary>
					<ThrowError message="First error" />
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		});

		it('should display error with aria-live for accessibility', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			);

			const errorContainer = screen.getByRole('alert');
			expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
		});
	});

	describe('Default Fallback UI', () => {
		it('should render default fallback UI', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
			expect(screen.getByText(/We're sorry for the inconvenience/)).toBeInTheDocument();
		});

		it('should show reset button by default', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			);

			expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
		});

		it('should hide reset button when showResetButton is false', () => {
			render(
				<ErrorBoundary showResetButton={false}>
					<ThrowError />
				</ErrorBoundary>
			);

			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('should use custom reset button text', () => {
			render(
				<ErrorBoundary resetButtonText="Reload App">
					<ThrowError />
				</ErrorBoundary>
			);

			expect(screen.getByRole('button', { name: 'Reload App' })).toBeInTheDocument();
		});
	});

	describe('Custom Fallback UI', () => {
		it('should render custom fallback as ReactNode', () => {
			render(
				<ErrorBoundary fallback={<div>Custom error message</div>}>
					<ThrowError />
				</ErrorBoundary>
			);

			expect(screen.getByText('Custom error message')).toBeInTheDocument();
			expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
		});

		it('should render custom fallback as function', () => {
			render(
				<ErrorBoundary
					fallback={(error) => <div>Error: {error.message}</div>}
				>
					<ThrowError message="Custom error" />
				</ErrorBoundary>
			);

			expect(screen.getByText('Error: Custom error')).toBeInTheDocument();
		});

		it('should pass error and errorInfo to fallback function', () => {
			const fallbackFn = vi.fn((error, errorInfo) => (
				<div>
					<div>Error: {error.message}</div>
					<div>Stack: {errorInfo?.componentStack ? 'present' : 'missing'}</div>
				</div>
			));

			render(
				<ErrorBoundary fallback={fallbackFn}>
					<ThrowError message="Test error" />
				</ErrorBoundary>
			);

			expect(fallbackFn).toHaveBeenCalled();
			expect(screen.getByText('Error: Test error')).toBeInTheDocument();
		});
	});

	describe('Error Logging', () => {
		it('should call onError callback when error occurs', () => {
			const onError = vi.fn();

			render(
				<ErrorBoundary onError={onError}>
					<ThrowError message="Test error" />
				</ErrorBoundary>
			);

			expect(onError).toHaveBeenCalledTimes(1);
			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Test error' }),
				expect.objectContaining({ componentStack: expect.any(String) })
			);
		});

		it('should log to console when logErrors is true', () => {
			const mockConsoleError = vi.fn();
			console.error = mockConsoleError;

			render(
				<ErrorBoundary logErrors={true}>
					<ThrowError />
				</ErrorBoundary>
			);

			// Should have our custom error logs
			const customErrorLogs = mockConsoleError.mock.calls.filter(call =>
				call[0]?.includes?.('ErrorBoundary caught an error')
			);
			expect(customErrorLogs.length).toBeGreaterThan(0);
		});

		it('should not log custom error when logErrors is false', () => {
			const mockConsoleError = vi.fn();
			console.error = mockConsoleError;

			render(
				<ErrorBoundary logErrors={false}>
					<ThrowError />
				</ErrorBoundary>
			);

			// React will still log errors, but our custom logging won't
			const customErrorLogs = mockConsoleError.mock.calls.filter(call =>
				call[0]?.includes?.('ErrorBoundary caught an error')
			);
			expect(customErrorLogs.length).toBe(0);
		});

		it('should not call onError when no error occurs', () => {
			const onError = vi.fn();

			render(
				<ErrorBoundary onError={onError}>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>
			);

			expect(onError).not.toHaveBeenCalled();
		});
	});

	describe('Reset Functionality', () => {
		it('should reset error boundary when reset button is clicked', () => {
			const { rerender } = render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();

			// Click reset button
			const resetButton = screen.getByRole('button', { name: 'Try Again' });
			resetButton.click();

			// Re-render with non-throwing component
			rerender(
				<ErrorBoundary>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>
			);

			expect(screen.getByText('No error')).toBeInTheDocument();
		});

		it('should call onReset callback when reset', () => {
			const onReset = vi.fn();

			render(
				<ErrorBoundary onReset={onReset}>
					<ThrowError />
				</ErrorBoundary>
			);

			const resetButton = screen.getByRole('button', { name: 'Try Again' });
			resetButton.click();

			expect(onReset).toHaveBeenCalledTimes(1);
		});

		it('should not call onReset when not provided', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			);

			const resetButton = screen.getByRole('button', { name: 'Try Again' });

			// Should not throw error when clicking reset without onReset
			expect(() => resetButton.click()).not.toThrow();
		});
	});

	describe('Multiple Children', () => {
		it('should render multiple children when no error', () => {
			render(
				<ErrorBoundary>
					<div>Child 1</div>
					<div>Child 2</div>
					<div>Child 3</div>
				</ErrorBoundary>
			);

			expect(screen.getByText('Child 1')).toBeInTheDocument();
			expect(screen.getByText('Child 2')).toBeInTheDocument();
			expect(screen.getByText('Child 3')).toBeInTheDocument();
		});

		it('should catch error from any child', () => {
			render(
				<ErrorBoundary>
					<div>Child 1</div>
					<ThrowError />
					<div>Child 3</div>
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
			expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
			expect(screen.queryByText('Child 3')).not.toBeInTheDocument();
		});
	});

	describe('Nested ErrorBoundaries', () => {
		it('should handle nested error boundaries', () => {
			render(
				<ErrorBoundary fallback={<div>Outer boundary caught error</div>}>
					<div>Outer content</div>
					<ErrorBoundary fallback={<div>Inner boundary caught error</div>}>
						<ThrowError />
					</ErrorBoundary>
				</ErrorBoundary>
			);

			// Inner boundary should catch the error
			expect(screen.getByText('Inner boundary caught error')).toBeInTheDocument();
			expect(screen.queryByText('Outer boundary caught error')).not.toBeInTheDocument();
			expect(screen.getByText('Outer content')).toBeInTheDocument();
		});
	});

	describe('Real-World Scenarios', () => {
		it('should handle data fetching errors', () => {
			const DataComponent = () => {
				throw new Error('Failed to fetch data');
			};

			render(
				<ErrorBoundary
					onError={(error) => {
						expect(error.message).toBe('Failed to fetch data');
					}}
				>
					<DataComponent />
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		});

		it('should handle component lifecycle errors', () => {
			class LifecycleError extends React.Component {
				componentDidMount() {
					throw new Error('Lifecycle error');
				}

				render() {
					return <div>Component content</div>;
				}
			}

			const onError = vi.fn();

			render(
				<ErrorBoundary onError={onError}>
					<LifecycleError />
				</ErrorBoundary>
			);

			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Lifecycle error' }),
				expect.any(Object)
			);
		});

		it('should handle errors with custom recovery', () => {
			const onReset = vi.fn();
			const onError = vi.fn();

			const { rerender } = render(
				<ErrorBoundary onReset={onReset} onError={onError}>
					<ThrowError />
				</ErrorBoundary>
			);

			expect(onError).toHaveBeenCalledTimes(1);

			// User clicks reset
			screen.getByRole('button', { name: 'Try Again' }).click();
			expect(onReset).toHaveBeenCalledTimes(1);

			// Re-render with fixed component
			rerender(
				<ErrorBoundary onReset={onReset} onError={onError}>
					<div>Component recovered</div>
				</ErrorBoundary>
			);

			expect(screen.getByText('Component recovered')).toBeInTheDocument();
		});

		it('should work with complex component trees', () => {
			const ComplexTree = () => (
				<div>
					<header>Header</header>
					<main>
						<aside>Sidebar</aside>
						<section>
							<ThrowError />
						</section>
					</main>
					<footer>Footer</footer>
				</div>
			);

			render(
				<ErrorBoundary>
					<ComplexTree />
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
			expect(screen.queryByText('Header')).not.toBeInTheDocument();
		});

		it('should provide useful error information for debugging', () => {
			const originalNodeEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'development';

			render(
				<ErrorBoundary>
					<ThrowError message="Detailed error for debugging" />
				</ErrorBoundary>
			);

			// In development, error details should be visible
			expect(screen.getByText('Error Details (Development Only):')).toBeInTheDocument();
			expect(screen.getByText(/Detailed error for debugging/)).toBeInTheDocument();

			process.env.NODE_ENV = originalNodeEnv;
		});
	});

	describe('Edge Cases', () => {
		it('should handle null children', () => {
			render(
				<ErrorBoundary>
					{null}
				</ErrorBoundary>
			);

			// Should render nothing, no error
			expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
		});

		it('should handle undefined children', () => {
			render(
				<ErrorBoundary>
					{undefined}
				</ErrorBoundary>
			);

			expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
		});

		it('should handle empty fragment', () => {
			render(
				<ErrorBoundary>
					<>
					</>
				</ErrorBoundary>
			);

			expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
		});

		it('should handle errors with missing error message', () => {
			const ThrowEmptyError = () => {
				throw new Error();
			};

			render(
				<ErrorBoundary>
					<ThrowEmptyError />
				</ErrorBoundary>
			);

			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		});
	});
});
