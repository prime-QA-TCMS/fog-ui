import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
	AuthConfig,
	AuthenticatedClientResult,
	QueuedRequest,
	StorageAdapter,
	MemoryStorage,
} from './types';

function createStorageAdapter(storageType: 'localStorage' | 'sessionStorage' | 'memory'): StorageAdapter {
	if (storageType === 'memory') {
		const memoryStorage: MemoryStorage = {};
		return {
			getItem: (key: string) => memoryStorage[key] || null,
			setItem: (key: string, value: string) => {
				memoryStorage[key] = value;
			},
			removeItem: (key: string) => {
				delete memoryStorage[key];
			},
		};
	}

	const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
	return {
		getItem: (key: string) => storage.getItem(key),
		setItem: (key: string, value: string) => storage.setItem(key, value),
		removeItem: (key: string) => storage.removeItem(key),
	};
}

/**
 * Creates an authenticated axios client with automatic token injection and refresh
 *
 * @param config - Configuration for the authenticated client
 * @returns An object containing the axios instance and helper methods
 *
 * @example
 * ```typescript
 * const client = createAuthenticatedClient({
 *   baseURL: 'https://api.example.com',
 *   tokenKey: 'accessToken',
 *   refreshConfig: {
 *     refreshEndpoint: '/api/auth/refresh',
 *     refreshTokenKey: 'refreshToken',
 *   },
 *   onRefreshFailed: () => {
 *     window.location.href = '/login';
 *   }
 * });
 *
 * // Use the instance
 * const data = await client.instance.get('/users');
 *
 * // Manual token management
 * client.setToken('new-token');
 * client.clearToken();
 * ```
 */
export function createAuthenticatedClient(config: AuthConfig = {}): AuthenticatedClientResult {
	const {
		baseURL,
		timeout = 10000,
		tokenKey = 'accessToken',
		tokenStorage = 'localStorage',
		refreshConfig,
		loginRedirectPath = '/login',
		onRefreshFailed,
		shouldRefreshToken = (error: any) => error.response?.status === 401,
		onRequest,
		onResponse,
		onError,
		axiosConfig = {},
	} = config;

	const storage = createStorageAdapter(tokenStorage);

	const instance: AxiosInstance = axios.create({
		baseURL,
		timeout,
		...axiosConfig,
	});

	let isRefreshing = false;
	let refreshQueue: QueuedRequest[] = [];

	const getToken = (): string | null => {
		return storage.getItem(tokenKey);
	};

	const setToken = (token: string): void => {
		storage.setItem(tokenKey, token);
	};

	const clearToken = (): void => {
		storage.removeItem(tokenKey);
	};

	const refreshToken = async (): Promise<void> => {
		if (!refreshConfig) {
			throw new Error('Refresh configuration not provided');
		}

		const refreshTokenValue = storage.getItem(refreshConfig.refreshTokenKey || 'refreshToken');
		if (!refreshTokenValue) {
			throw new Error('No refresh token available');
		}

		try {
			const response = await axios.post(refreshConfig.refreshEndpoint, {
				refreshToken: refreshTokenValue,
			});

			const newAccessToken = refreshConfig.extractAccessToken
				? refreshConfig.extractAccessToken(response.data)
				: response.data.accessToken || response.data.token;

			const newRefreshToken = refreshConfig.extractRefreshToken
				? refreshConfig.extractRefreshToken(response.data)
				: response.data.refreshToken || null;

			setToken(newAccessToken);
			if (newRefreshToken) {
				storage.setItem(refreshConfig.refreshTokenKey || 'refreshToken', newRefreshToken);
			}
		} catch (error) {
			clearToken();
			if (refreshConfig.refreshTokenKey) {
				storage.removeItem(refreshConfig.refreshTokenKey);
			}
			throw error;
		}
	};

	const processQueue = (error: any = null): void => {
		refreshQueue.forEach((request) => {
			if (error) {
				request.reject(error);
			} else {
				request.resolve();
			}
		});
		refreshQueue = [];
	};

	instance.interceptors.request.use(
		async (requestConfig: InternalAxiosRequestConfig) => {
			let modifiedConfig = requestConfig;
			if (onRequest) {
				modifiedConfig = await onRequest(requestConfig);
			}

			const token = getToken();
			if (token && modifiedConfig.headers) {
				modifiedConfig.headers.Authorization = `Bearer ${token}`;
			}

			return modifiedConfig;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		(response) => {
			if (onResponse) {
				return onResponse(response);
			}
			return response;
		},
		async (error) => {
			const originalRequest = error.config;
			if (shouldRefreshToken(error) && refreshConfig && !originalRequest._retry) {
				originalRequest._retry = true;

				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						refreshQueue.push({ resolve, reject });
					})
						.then(() => {
							return instance(originalRequest);
						})
						.catch((err) => {
							return Promise.reject(err);
						});
				}

				isRefreshing = true;

				try {
					await refreshToken();
					processQueue();
					return instance(originalRequest);
				} catch (refreshError) {
					processQueue(refreshError);

					if (onRefreshFailed) {
						onRefreshFailed(refreshError);
					} else {
						if (typeof window !== 'undefined') {
							window.location.href = loginRedirectPath;
						}
					}

					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}

			if (onError) {
				return onError(error);
			}

			return Promise.reject(error);
		}
	);

	return {
		instance,
		setToken,
		clearToken,
		getToken,
		refreshToken,
	};
}
