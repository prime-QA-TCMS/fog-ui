import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '../useApi';

describe('useApi', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Immediate Execution', () => {
		it('fetches data successfully on mount when immediate is true', async () => {
			const mockData = { id: 1, name: 'Test User' };
			const mockFn = vi.fn().mockResolvedValue(mockData);

			const { result } = renderHook(() => useApi(mockFn, [], true));

			// Initially loading
			expect(result.current.loading).toBe(true);
			expect(result.current.data).toBeNull();
			expect(result.current.error).toBeNull();

			// Wait for fetch to complete
			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.data).toEqual(mockData);
			expect(result.current.error).toBeNull();
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('handles errors during fetch', async () => {
			const mockError = new Error('API Error');
			const mockFn = vi.fn().mockRejectedValue(mockError);

			const { result } = renderHook(() => useApi(mockFn));

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe('API Error');
			expect(result.current.data).toBeNull();
		});

		it('converts non-Error rejections to Error instances', async () => {
			const mockFn = vi.fn().mockRejectedValue('String error');

			const { result } = renderHook(() => useApi(mockFn));

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe('String error');
		});
	});

	describe('Manual Execution', () => {
		it('does not fetch immediately when immediate is false', () => {
			const mockFn = vi.fn().mockResolvedValue('data');

			const { result } = renderHook(() => useApi(mockFn, [], false));

			expect(result.current.loading).toBe(false);
			expect(result.current.data).toBeNull();
			expect(mockFn).not.toHaveBeenCalled();
		});

		it('fetches data when refetch is called manually', async () => {
			const mockData = { id: 2, name: 'Manual User' };
			const mockFn = vi.fn().mockResolvedValue(mockData);

			const { result } = renderHook(() => useApi(mockFn, [], false));

			expect(mockFn).not.toHaveBeenCalled();

			// Manually trigger fetch
			await result.current.refetch();

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.data).toEqual(mockData);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('can refetch multiple times', async () => {
			const mockFn = vi
				.fn()
				.mockResolvedValueOnce({ count: 1 })
				.mockResolvedValueOnce({ count: 2 })
				.mockResolvedValueOnce({ count: 3 });

			const { result } = renderHook(() => useApi(mockFn, [], false));

			// First refetch
			await result.current.refetch();
			await waitFor(() => expect(result.current.loading).toBe(false));
			expect(result.current.data).toEqual({ count: 1 });

			// Second refetch
			await result.current.refetch();
			await waitFor(() => expect(result.current.loading).toBe(false));
			expect(result.current.data).toEqual({ count: 2 });

			// Third refetch
			await result.current.refetch();
			await waitFor(() => expect(result.current.loading).toBe(false));
			expect(result.current.data).toEqual({ count: 3 });

			expect(mockFn).toHaveBeenCalledTimes(3);
		});
	});

	describe('Null API Function', () => {
		it('handles null apiFn gracefully', () => {
			const { result } = renderHook(() => useApi(null));

			expect(result.current.loading).toBe(false);
			expect(result.current.data).toBeNull();
			expect(result.current.error).toBeNull();
		});

		it('handles undefined apiFn gracefully', () => {
			const { result } = renderHook(() => useApi(undefined));

			expect(result.current.loading).toBe(false);
			expect(result.current.data).toBeNull();
			expect(result.current.error).toBeNull();
		});

		it('does not execute when apiFn becomes null', async () => {
			const mockFn = vi.fn().mockResolvedValue('data');

			const { result, rerender } = renderHook(
				({ fn }) => useApi(fn, [], false),
				{ initialProps: { fn: mockFn } }
			);

			// Change to null
			rerender({ fn: null });

			await result.current.refetch();

			expect(mockFn).not.toHaveBeenCalled();
			expect(result.current.loading).toBe(false);
		});
	});

	describe('Loading State', () => {
		it('sets loading to true while fetching', async () => {
			const mockFn = vi.fn(
				() =>
					new Promise((resolve) => setTimeout(() => resolve('data'), 50))
			);

			const { result } = renderHook(() => useApi(mockFn));

			expect(result.current.loading).toBe(true);

			await waitFor(() => expect(result.current.loading).toBe(false));
		});

		it('resets loading to false after error', async () => {
			const mockFn = vi.fn().mockRejectedValue(new Error('Error'));

			const { result } = renderHook(() => useApi(mockFn));

			expect(result.current.loading).toBe(true);

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.loading).toBe(false);
		});
	});

	describe('Error State', () => {
		it('clears previous error on successful refetch', async () => {
			const mockFn = vi
				.fn()
				.mockRejectedValueOnce(new Error('First error'))
				.mockResolvedValueOnce('success');

			const { result } = renderHook(() => useApi(mockFn));

			// Wait for first error
			await waitFor(() => expect(result.current.loading).toBe(false));
			expect(result.current.error).toBeInstanceOf(Error);

			// Refetch successfully
			await result.current.refetch();
			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.error).toBeNull();
			expect(result.current.data).toBe('success');
		});

		it('clears previous error when starting new fetch', async () => {
			const mockFn = vi
				.fn()
				.mockRejectedValueOnce(new Error('Error'))
				.mockImplementation(
					() => new Promise((resolve) => setTimeout(() => resolve('data'), 100))
				);

			const { result } = renderHook(() => useApi(mockFn));

			// Wait for error
			await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));

			// Start new fetch
			result.current.refetch();

			// Error should be cleared immediately when fetch starts
			await waitFor(() => expect(result.current.error).toBeNull());
		});
	});

	describe('Parameter Changes', () => {
		it('refetches when parameters change', async () => {
			let userId = 1;
			const mockFn = vi.fn(() =>
				Promise.resolve({ id: userId, name: `User ${userId}` })
			);

			const { result, rerender } = renderHook(
				({ id }) => {
					userId = id; // Update the closure variable
					return useApi(mockFn, [id], true);
				},
				{ initialProps: { id: 1 } }
			);

			await waitFor(() => expect(result.current.loading).toBe(false));
			expect(result.current.data).toEqual({ id: 1, name: 'User 1' });
			expect(mockFn).toHaveBeenCalledTimes(1);

			// Change parameter
			rerender({ id: 2 });

			await waitFor(() => expect(result.current.loading).toBe(false));
			expect(result.current.data).toEqual({ id: 2, name: 'User 2' });
			expect(mockFn).toHaveBeenCalledTimes(2);
		});
	});

	describe('Type Safety', () => {
		it('preserves generic type for data', async () => {
			interface User {
				id: number;
				name: string;
				email: string;
			}

			const mockUser: User = {
				id: 1,
				name: 'Test User',
				email: 'test@example.com',
			};

			const mockFn = vi.fn().mockResolvedValue(mockUser);

			const { result } = renderHook(() => useApi<User>(mockFn));

			await waitFor(() => expect(result.current.loading).toBe(false));

			// TypeScript should recognize this as User | null
			expect(result.current.data).toEqual(mockUser);
			if (result.current.data) {
				expect(result.current.data.email).toBe('test@example.com');
			}
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string as error', async () => {
			const mockFn = vi.fn().mockRejectedValue('');

			const { result } = renderHook(() => useApi(mockFn));

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe('');
		});

		it('handles number as error', async () => {
			const mockFn = vi.fn().mockRejectedValue(404);

			const { result } = renderHook(() => useApi(mockFn));

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe('404');
		});

		it('handles object as error', async () => {
			const mockFn = vi.fn().mockRejectedValue({ status: 500 });

			const { result } = renderHook(() => useApi(mockFn));

			await waitFor(() => expect(result.current.loading).toBe(false));

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe('[object Object]');
		});

		it('handles immediate = true when apiFn is null', () => {
			const { result } = renderHook(() => useApi(null, [], true));

			expect(result.current.loading).toBe(false);
			expect(result.current.data).toBeNull();
			expect(result.current.error).toBeNull();
		});
	});

	describe('Refetch Function Stability', () => {
		it('provides stable refetch function reference', async () => {
			const mockFn = vi.fn().mockResolvedValue('data');

			const { result, rerender } = renderHook(() =>
				useApi(mockFn, [], false)
			);

			const firstRefetch = result.current.refetch;

			rerender();

			const secondRefetch = result.current.refetch;

			// Function reference should be stable between rerenders
			expect(firstRefetch).toBe(secondRefetch);
		});
	});
});
