import React, { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import { AxiosHelper } from './axiosHelper';
import { createAuthenticatedClient } from './createAuthenticatedClient';
import { AxiosProviderProps, AxiosContextValue, ApiServicesConfig } from './types';

const AxiosContext = createContext<AxiosContextValue | undefined>(undefined);

/**
 * Provider component for managing multiple API service instances
 *
 * @example
 * ```tsx
 * import { AxiosProvider } from 'fog-ui';
 *
 * function App() {
 *   return (
 *     <AxiosProvider
 *       services={{
 *         user: { baseURL: 'http://localhost:8081', requiresAuth: false },
 *         data: { baseURL: 'http://localhost:8082', requiresAuth: true },
 *         analytics: { baseURL: 'http://localhost:8083', requiresAuth: true, timeout: 15000 }
 *       }}
 *       authConfig={{
 *         tokenKey: 'accessToken',
 *         refreshConfig: {
 *           refreshEndpoint: '/api/auth/refresh',
 *           refreshTokenKey: 'refreshToken'
 *         }
 *       }}
 *     >
 *       <YourApp />
 *     </AxiosProvider>
 *   );
 * }
 *
 * // In a component:
 * const { getService } = useAxios();
 * const userApi = getService('user');
 * const users = await userApi.get('/users');
 * ```
 */
export const AxiosProvider: React.FC<AxiosProviderProps> = ({ services, authConfig, children }) => {
	const contextValue = useMemo<AxiosContextValue>(() => {
		const serviceInstances: Record<string, AxiosHelper> = {};

		if (services && typeof services === 'object') {
			Object.entries(services).forEach(([serviceName, serviceConfig]) => {
				const { baseURL, requiresAuth = false, timeout, axiosConfig = {} } = serviceConfig;

				let axiosInstance;

				if (requiresAuth && authConfig) {
					const authenticatedClient = createAuthenticatedClient({
						baseURL,
						timeout: timeout || authConfig.timeout,
						...authConfig,
						axiosConfig: {
							...authConfig.axiosConfig,
							...axiosConfig,
						},
					});
					axiosInstance = authenticatedClient.instance;
				} else {
					axiosInstance = axios.create({
						baseURL,
						timeout,
						...axiosConfig,
					});
				}
				serviceInstances[serviceName] = new AxiosHelper(axiosInstance);
			});
		}

		return {
			services: serviceInstances,
			getService: (serviceName: string) => {
				const service = serviceInstances[serviceName];
				if (!service) {
					throw new Error(
						`Service "${serviceName}" not found. Available services: ${Object.keys(serviceInstances).join(', ')}`
					);
				}
				return service;
			},
			hasService: (serviceName: string) => {
				return serviceName in serviceInstances;
			},
		};
	}, [services, authConfig]);

	return <AxiosContext.Provider value={contextValue}>{children}</AxiosContext.Provider>;
};

/**
 * Hook to access axios service instances
 *
 * @throws Error if used outside of AxiosProvider
 * @returns Object containing services and helper methods
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const { getService } = useAxios();
 *   const userApi = getService('user');
 *
 *   useEffect(() => {
 *     const fetchUsers = async () => {
 *       const users = await userApi.get('/users');
 *       setUsers(users);
 *     };
 *     fetchUsers();
 *   }, []);
 * }
 * ```
 */
export const useAxios = (): AxiosContextValue => {
	const context = useContext(AxiosContext);
	if (!context) {
		throw new Error('useAxios must be used within an AxiosProvider');
	}
	return context;
};

/**
 * Hook to directly access a specific service
 *
 * @param serviceName - The name of the service to access
 * @returns AxiosHelper instance for the specified service
 * @throws Error if service doesn't exist or used outside AxiosProvider
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const userApi = useService('user');
 *
 *   useEffect(() => {
 *     const fetchUsers = async () => {
 *       const users = await userApi.get('/users');
 *       setUsers(users);
 *     };
 *     fetchUsers();
 *   }, []);
 * }
 * ```
 */
export const useService = (serviceName: string): AxiosHelper => {
	const { getService } = useAxios();
	return getService(serviceName);
};
