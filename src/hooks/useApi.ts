import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading and error states.
 * Provides a simple, React Query-like interface for async operations.
 * 
 * @template T - The type of data returned by the API function
 * @param apiFn - Async function that fetches data. Can be null to skip execution.
 * @param params - Array of parameters to pass to the API function. Used for dependency tracking.
 * @param immediate - Whether to fetch data immediately on mount. Default is true.
 * @returns Object containing data, loading state, error state, and refetch function
 * 
 * @example
 * ```typescript
 * // Fetch immediately on mount
 * const { data, loading, error, refetch } = useApi(
 *   () => api.get<User[]>('/users'),
 *   [],
 *   true
 * );
 * 
 * // Manual fetch (immediate = false)
 * const { data, loading, error, refetch } = useApi(
 *   () => api.post('/users', userData),
 *   [userData],
 *   false
 * );
 * 
 * // Trigger manual fetch
 * await refetch();
 * ```
 */
export function useApi<T>(
	apiFn?: (() => Promise<T>) | null,
	params: any[] = [],
	immediate = true
): {
	data: T | null;
	loading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
} {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		if (!apiFn) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await apiFn();
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error(String(err)));
		} finally {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [apiFn, ...params]);

	useEffect(() => {
		if (immediate && apiFn) {
			fetchData();
		}
	}, [immediate, fetchData, apiFn]);

	return { data, loading, error, refetch: fetchData };
}
