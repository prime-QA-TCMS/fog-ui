import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
	/**
	 * Child components to wrap with error boundary
	 */
	children: ReactNode;

	/**
	 * Custom fallback UI to display when an error occurs
	 * Can be a ReactNode or a function that receives the error and errorInfo
	 * @default Built-in error UI with error message and reset button
	 */
	fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);

	/**
	 * Callback function called when an error is caught
	 * Use this for error logging to external services
	 * @param error - The error that was thrown
	 * @param errorInfo - React error info with component stack
	 */
	onError?: (error: Error, errorInfo: ErrorInfo) => void;

	/**
	 * Callback function called when the error boundary is reset
	 * Use this to clean up state or perform actions after reset
	 */
	onReset?: () => void;

	/**
	 * Whether to show the reset button in the default fallback UI
	 * @default true
	 */
	showResetButton?: boolean;

	/**
	 * Custom reset button text
	 * @default "Try Again"
	 */
	resetButtonText?: string;

	/**
	 * Whether to log errors to console
	 * @default true in development, false in production
	 */
	logErrors?: boolean;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
	/**
	 * Whether an error has been caught
	 */
	hasError: boolean;

	/**
	 * The error that was caught
	 */
	error: Error | null;

	/**
	 * React error info with component stack
	 */
	errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in child components,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 * 
 * This component uses React's error boundary lifecycle methods (getDerivedStateFromError
 * and componentDidCatch) to catch errors during rendering, in lifecycle methods,
 * and in constructors of the whole tree below them.
 * 
 * Note: Error boundaries do NOT catch errors for:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (setTimeout, requestAnimationFrame, etc.)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 * 
 * @example
 * // Basic usage with default fallback UI
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // With custom fallback UI
 * <ErrorBoundary fallback={<div>Something went wrong!</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // With fallback function that uses error details
 * <ErrorBoundary
 *   fallback={(error, errorInfo) => (
 *     <div>
 *       <h1>Error: {error.message}</h1>
 *       <pre>{errorInfo.componentStack}</pre>
 *     </div>
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // With error logging to external service
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     // Send to error tracking service
 *     logErrorToService(error, errorInfo);
 *   }}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // With custom reset behavior
 * <ErrorBoundary
 *   onReset={() => {
 *     // Clear application state
 *     store.dispatch(resetAppState());
 *   }}
 *   resetButtonText="Reload Application"
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // Without reset button
 * <ErrorBoundary showResetButton={false}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	/**
	 * Default props for ErrorBoundary
	 */
	static defaultProps: Partial<ErrorBoundaryProps> = {
		showResetButton: true,
		resetButtonText: 'Try Again',
		logErrors: import.meta.env.DEV,
	};

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	/**
	 * Static lifecycle method called when an error is thrown
	 * Updates state so the next render will show the fallback UI
	 */
	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {
			hasError: true,
			error,
		};
	}

	/**
	 * Lifecycle method called after an error has been thrown
	 * Used for logging the error
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Update state with error info
		this.setState({
			errorInfo,
		});

		// Log to console if enabled
		if (this.props.logErrors) {
			console.error('ErrorBoundary caught an error:', error);
			console.error('Component stack:', errorInfo.componentStack);
		}

		// Call custom error handler
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	/**
	 * Resets the error boundary state to allow re-rendering children
	 */
	resetErrorBoundary = (): void => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});

		// Call custom reset handler
		if (this.props.onReset) {
			this.props.onReset();
		}
	};

	/**
	 * Renders the default fallback UI when an error occurs
	 */
	renderDefaultFallback(): ReactNode {
		const { error, errorInfo } = this.state;
		const { showResetButton, resetButtonText } = this.props;

		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '400px',
					padding: 3,
					textAlign: 'center',
				}}
				role="alert"
				aria-live="assertive"
			>
				<Typography variant="h4" color="error" gutterBottom>
					Something went wrong
				</Typography>

				<Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 600 }}>
					We're sorry for the inconvenience. An unexpected error has occurred.
					{showResetButton && ' Please try again.'}
				</Typography>

				{import.meta.env.DEV && error && (
					<Box
						sx={{
							mt: 2,
							p: 2,
							backgroundColor: 'grey.100',
							borderRadius: 1,
							maxWidth: 800,
							width: '100%',
							textAlign: 'left',
						}}
					>
						<Typography variant="subtitle2" color="error" gutterBottom>
							Error Details (Development Only):
						</Typography>
						<Typography
							variant="body2"
							component="pre"
							sx={{
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
								fontSize: '0.875rem',
								color: 'text.primary',
							}}
						>
							{error.toString()}
						</Typography>
						{errorInfo && (
							<Typography
								variant="body2"
								component="pre"
								sx={{
									mt: 1,
									whiteSpace: 'pre-wrap',
									wordBreak: 'break-word',
									fontSize: '0.75rem',
									color: 'text.secondary',
								}}
							>
								{errorInfo.componentStack}
							</Typography>
						)}
					</Box>
				)}

				{showResetButton && (
					<Button
						variant="contained"
						color="primary"
						onClick={this.resetErrorBoundary}
						sx={{ mt: 3 }}
					>
						{resetButtonText}
					</Button>
				)}
			</Box>
		);
	}

	render(): ReactNode {
		const { hasError, error, errorInfo } = this.state;
		const { children, fallback } = this.props;

		if (hasError && error) {
			// Render custom fallback if provided
			if (fallback) {
				if (typeof fallback === 'function') {
					return fallback(error, errorInfo!);
				}
				return fallback;
			}

			// Render default fallback
			return this.renderDefaultFallback();
		}

		// No error, render children normally
		return children;
	}
}
