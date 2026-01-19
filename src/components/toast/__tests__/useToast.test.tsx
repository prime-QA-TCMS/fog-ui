import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useToast } from '../useToast';
import { ToastProvider } from '../ToastProvider';
import type { ReactNode } from 'react';

describe('useToast', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	const wrapper = ({ children }: { children: ReactNode }) => (
		<ToastProvider>{children}</ToastProvider>
	);

	describe('Hook Usage', () => {
		it('throws error when used outside ToastProvider', () => {
			// Suppress console.error for this test
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

			expect(() => {
				renderHook(() => useToast());
			}).toThrow('useToast must be used within ToastProvider');

			consoleError.mockRestore();
		});

		it('returns toast methods when used within ToastProvider', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			expect(result.current).toHaveProperty('success');
			expect(result.current).toHaveProperty('error');
			expect(result.current).toHaveProperty('warning');
			expect(result.current).toHaveProperty('info');
			expect(result.current).toHaveProperty('show');
			expect(result.current).toHaveProperty('remove');
			expect(result.current).toHaveProperty('clearAll');
			expect(result.current).toHaveProperty('toasts');
		});
	});

	describe('Success Toast', () => {
		it('creates success toast', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Success message');
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].variant).toBe('success');
			expect(result.current.toasts[0].message).toBe('Success message');
		});

		it('returns toast ID', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			let id: string = '';
			act(() => {
				id = result.current.success('Test');
			});

			expect(id).toBeTruthy();
			expect(typeof id).toBe('string');
		});

		it('accepts custom options', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Success', {
					duration: 3000,
					position: 'bottom-center',
				});
			});

			expect(result.current.toasts[0].duration).toBe(3000);
			expect(result.current.toasts[0].position).toBe('bottom-center');
		});
	});

	describe('Error Toast', () => {
		it('creates error toast', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.error('Error message');
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].variant).toBe('error');
			expect(result.current.toasts[0].message).toBe('Error message');
		});

		it('accepts custom options', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.error('Error', { duration: 0 }); // Don't auto-dismiss errors
			});

			expect(result.current.toasts[0].duration).toBe(0);
		});
	});

	describe('Warning Toast', () => {
		it('creates warning toast', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.warning('Warning message');
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].variant).toBe('warning');
			expect(result.current.toasts[0].message).toBe('Warning message');
		});
	});

	describe('Info Toast', () => {
		it('creates info toast', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.info('Info message');
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].variant).toBe('info');
			expect(result.current.toasts[0].message).toBe('Info message');
		});
	});

	describe('Custom Show Method', () => {
		it('creates toast with custom variant', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.show('Custom message', { variant: 'success' });
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].variant).toBe('success');
		});

		it('defaults to info variant', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.show('Default message');
			});

			expect(result.current.toasts[0].variant).toBe('info');
		});

		it('accepts all toast options', () => {
			const mockAction = vi.fn();
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.show('Message', {
					variant: 'warning',
					duration: 10000,
					position: 'top-left',
					actionText: 'Undo',
					onAction: mockAction,
				});
			});

			const toast = result.current.toasts[0];
			expect(toast.variant).toBe('warning');
			expect(toast.duration).toBe(10000);
			expect(toast.position).toBe('top-left');
			expect(toast.actionText).toBe('Undo');
			expect(toast.onAction).toBe(mockAction);
		});
	});

	describe('Remove Method', () => {
		it('removes specific toast by ID', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			let id1: string = '';
			let id2: string = '';

			act(() => {
				id1 = result.current.success('Toast 1');
				id2 = result.current.success('Toast 2');
			});

			expect(result.current.toasts).toHaveLength(2);

			act(() => {
				result.current.remove(id1);
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].id).toBe(id2);
		});

		it('handles removing non-existent ID', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Toast');
			});

			expect(result.current.toasts).toHaveLength(1);

			act(() => {
				result.current.remove('non-existent-id');
			});

			expect(result.current.toasts).toHaveLength(1);
		});
	});

	describe('Clear All Method', () => {
		it('clears all toasts', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Toast 1');
				result.current.error('Toast 2');
				result.current.warning('Toast 3');
			});

			expect(result.current.toasts).toHaveLength(3);

			act(() => {
				result.current.clearAll();
			});

			expect(result.current.toasts).toHaveLength(0);
		});

		it('works when no toasts exist', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.clearAll();
			});

			expect(result.current.toasts).toHaveLength(0);
		});
	});

	describe('Auto-Dismiss', () => {
		it('auto-dismisses after duration', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Test', { duration: 3000 });
			});

			expect(result.current.toasts).toHaveLength(1);

			act(() => {
				vi.advanceTimersByTime(3000);
			});

			expect(result.current.toasts).toHaveLength(0);
		});

		it('does not auto-dismiss when duration is 0', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.error('Permanent error', { duration: 0 });
			});

			expect(result.current.toasts).toHaveLength(1);

			act(() => {
				vi.advanceTimersByTime(10000);
			});

			expect(result.current.toasts).toHaveLength(1);
		});
	});

	describe('Multiple Toasts', () => {
		it('manages multiple toasts independently', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Toast 1', { duration: 1000 });
				result.current.error('Toast 2', { duration: 2000 });
				result.current.warning('Toast 3', { duration: 3000 });
			});

			expect(result.current.toasts).toHaveLength(3);

			act(() => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.toasts).toHaveLength(2);

			act(() => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.toasts).toHaveLength(1);

			act(() => {
				vi.advanceTimersByTime(1000);
			});
			expect(result.current.toasts).toHaveLength(0);
		});

		it('handles rapid successive toasts', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.info(`Toast ${i}`);
				}
			});

			// Should respect maxToasts limit (default 5)
			expect(result.current.toasts.length).toBeLessThanOrEqual(5);
		});
	});

	describe('Toast State', () => {
		it('provides current toasts array', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			expect(result.current.toasts).toEqual([]);

			act(() => {
				result.current.success('Test');
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0]).toMatchObject({
				message: 'Test',
				variant: 'success',
			});
		});
	});

	describe('Action Handlers', () => {
		it('includes action handler in toast', () => {
			const mockAction = vi.fn();
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.success('Test', {
					actionText: 'Undo',
					onAction: mockAction,
				});
			});

			const toast = result.current.toasts[0];
			expect(toast.actionText).toBe('Undo');
			expect(toast.onAction).toBe(mockAction);
		});
	});

	describe('Edge Cases', () => {
		it('handles empty message', () => {
			const { result } = renderHook(() => useToast(), { wrapper });

			act(() => {
				result.current.info('');
			});

			expect(result.current.toasts).toHaveLength(1);
			expect(result.current.toasts[0].message).toBe('');
		});

		it('handles very long messages', () => {
			const { result } = renderHook(() => useToast(), { wrapper });
			const longMessage = 'A'.repeat(1000);

			act(() => {
				result.current.info(longMessage);
			});

			expect(result.current.toasts[0].message).toBe(longMessage);
		});

		it('handles special characters in message', () => {
			const { result } = renderHook(() => useToast(), { wrapper });
			const specialMessage = '<script>alert("XSS")</script> & special chars';

			act(() => {
				result.current.info(specialMessage);
			});

			expect(result.current.toasts[0].message).toBe(specialMessage);
		});
	});
});
