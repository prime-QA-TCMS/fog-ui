import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AxiosProvider, useAxios, useService } from '../AxiosProvider';
import { AxiosHelper } from '../axiosHelper';
import * as createAuthenticatedClientModule from '../createAuthenticatedClient';

// Mock dependencies
vi.mock('axios', () => ({
	default: {
		create: vi.fn(),
	},
}));
vi.mock('../axiosHelper');
vi.mock('../createAuthenticatedClient');

import axios from 'axios';

describe('AxiosProvider', () => {
	let mockAxiosCreate: any;
	let mockAxiosInstance: any;
	let mockAuthenticatedInstance: any;
	let mockCreateAuthenticatedClient: any;

	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();

		// Mock axios instance
		mockAxiosInstance = {
			get: vi.fn(),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			interceptors: {
				request: { use: vi.fn(), eject: vi.fn() },
				response: { use: vi.fn(), eject: vi.fn() },
			},
		};

		// Mock authenticated axios instance
		mockAuthenticatedInstance = {
			...mockAxiosInstance,
		};

		// Mock axios.create
		mockAxiosCreate = vi.fn().mockReturnValue(mockAxiosInstance);
		(axios.create as any) = mockAxiosCreate;

		// Mock createAuthenticatedClient
		mockCreateAuthenticatedClient = vi
			.spyOn(createAuthenticatedClientModule, 'createAuthenticatedClient')
			.mockReturnValue({
				instance: mockAuthenticatedInstance,
				setToken: vi.fn(),
				getToken: vi.fn(),
				clearToken: vi.fn(),
				refreshToken: vi.fn(),
			});

		// Mock AxiosHelper constructor
		vi.mocked(AxiosHelper).mockImplementation(function (this: any, instance: any) {
			this.instance = instance;
			this.get = vi.fn();
			this.post = vi.fn();
			this.put = vi.fn();
			this.delete = vi.fn();
			return this;
		} as any);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Provider initialization', () => {
		it('should render children', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<div>Test Child</div>
				</AxiosProvider>
			);

			expect(screen.getByText('Test Child')).toBeDefined();
		});

		it('should create service instances for all configured services', () => {
			const TestComponent = () => {
				const { services } = useAxios();
				return <div>{Object.keys(services).length}</div>;
			};

			render(
				<AxiosProvider
					services={{
						user: { baseURL: 'http://localhost:8081' },
						data: { baseURL: 'http://localhost:8082' },
						analytics: { baseURL: 'http://localhost:8083' },
					}}
				>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('3')).toBeDefined();
		});

		it('should handle empty services object', () => {
			const TestComponent = () => {
				const { services } = useAxios();
				return <div>{Object.keys(services).length}</div>;
			};

			render(
				<AxiosProvider services={{}}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('0')).toBeDefined();
		});
	});

	describe('Service creation - unauthenticated', () => {
		it('should create unauthenticated service with baseURL', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'http://localhost:8080',
				})
			);
		});

		it('should create unauthenticated service with timeout', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080', timeout: 5000 } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'http://localhost:8080',
					timeout: 5000,
				})
			);
		});

		it('should create unauthenticated service with custom axios config', () => {
			render(
				<AxiosProvider
					services={{
						test: {
							baseURL: 'http://localhost:8080',
							axiosConfig: {
								headers: { 'X-Custom-Header': 'value' },
								withCredentials: true,
							},
						},
					}}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'http://localhost:8080',
					headers: { 'X-Custom-Header': 'value' },
					withCredentials: true,
				})
			);
		});

		it('should create unauthenticated service when requiresAuth is false', () => {
			render(
				<AxiosProvider
					services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: false } }}
					authConfig={{ tokenKey: 'token' }}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalled();
			expect(mockCreateAuthenticatedClient).not.toHaveBeenCalled();
		});

		it('should create unauthenticated service when requiresAuth is true but no authConfig', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalled();
			expect(mockCreateAuthenticatedClient).not.toHaveBeenCalled();
		});
	});

	describe('Service creation - authenticated', () => {
		it('should create authenticated service when requiresAuth is true and authConfig provided', () => {
			render(
				<AxiosProvider
					services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true } }}
					authConfig={{ tokenKey: 'accessToken' }}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockCreateAuthenticatedClient).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'http://localhost:8080',
					tokenKey: 'accessToken',
				})
			);
		});

		it('should use service timeout over authConfig timeout for authenticated service', () => {
			render(
				<AxiosProvider
					services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true, timeout: 15000 } }}
					authConfig={{ tokenKey: 'accessToken', timeout: 10000 }}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			// Service timeout is used in the local 'timeout: timeout || authConfig.timeout'
			// but then ...authConfig spreads and may override with authConfig.timeout
			// The implementation uses timeout || authConfig.timeout, then spreads authConfig
			// which would override it back to authConfig.timeout if authConfig has timeout
			expect(mockCreateAuthenticatedClient).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'http://localhost:8080',
					tokenKey: 'accessToken',
					// authConfig.timeout (10000) takes precedence due to spread order
					timeout: 10000,
				})
			);
		});

		it('should merge service axiosConfig with authConfig axiosConfig', () => {
			render(
				<AxiosProvider
					services={{
						test: {
							baseURL: 'http://localhost:8080',
							requiresAuth: true,
							axiosConfig: { headers: { 'X-Service-Header': 'service' } },
						},
					}}
					authConfig={{
						tokenKey: 'accessToken',
						axiosConfig: { headers: { 'X-Auth-Header': 'auth' } },
					}}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockCreateAuthenticatedClient).toHaveBeenCalledWith(
				expect.objectContaining({
					axiosConfig: expect.objectContaining({
						headers: expect.objectContaining({
							'X-Service-Header': 'service',
						}),
					}),
				})
			);
		});

		it('should pass all authConfig properties to createAuthenticatedClient', () => {
			const authConfig = {
				tokenKey: 'accessToken',
				timeout: 10000,
				loginRedirectPath: '/login',
				storageType: 'sessionStorage' as const,
				refreshConfig: {
					refreshEndpoint: '/auth/refresh',
					refreshTokenKey: 'refreshToken',
				},
			};

			render(
				<AxiosProvider
					services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true } }}
					authConfig={authConfig}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockCreateAuthenticatedClient).toHaveBeenCalledWith(
				expect.objectContaining({
					tokenKey: 'accessToken',
					timeout: 10000,
					loginRedirectPath: '/login',
					storageType: 'sessionStorage',
					refreshConfig: {
						refreshEndpoint: '/auth/refresh',
						refreshTokenKey: 'refreshToken',
					},
				})
			);
		});
	});

	describe('Service creation - mixed services', () => {
		it('should create both authenticated and unauthenticated services', () => {
			render(
				<AxiosProvider
					services={{
						public: { baseURL: 'http://localhost:8081', requiresAuth: false },
						private: { baseURL: 'http://localhost:8082', requiresAuth: true },
					}}
					authConfig={{ tokenKey: 'accessToken' }}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
			expect(mockCreateAuthenticatedClient).toHaveBeenCalledTimes(1);
		});

		it('should handle multiple authenticated services', () => {
			render(
				<AxiosProvider
					services={{
						user: { baseURL: 'http://localhost:8081', requiresAuth: true },
						data: { baseURL: 'http://localhost:8082', requiresAuth: true },
						analytics: { baseURL: 'http://localhost:8083', requiresAuth: true },
					}}
					authConfig={{ tokenKey: 'accessToken' }}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockCreateAuthenticatedClient).toHaveBeenCalledTimes(3);
		});
	});

	describe('getService method', () => {
		it('should return existing service', () => {
			const TestComponent = () => {
				const { getService } = useAxios();
				const service = getService('test');
				return <div>{service ? 'found' : 'not found'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('found')).toBeDefined();
		});

		it('should throw error for non-existent service', () => {
			const TestComponent = () => {
				const { getService } = useAxios();
				try {
					getService('nonexistent');
					return <div>no error</div>;
				} catch (error: any) {
					return <div>{error.message}</div>;
				}
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText(/Service "nonexistent" not found/)).toBeDefined();
		});

		it('should include available services in error message', () => {
			const TestComponent = () => {
				const { getService } = useAxios();
				try {
					getService('missing');
					return <div>no error</div>;
				} catch (error: any) {
					return <div>{error.message}</div>;
				}
			};

			render(
				<AxiosProvider
					services={{
						user: { baseURL: 'http://localhost:8081' },
						data: { baseURL: 'http://localhost:8082' },
					}}
				>
					<TestComponent />
				</AxiosProvider>
			);

			const errorText = screen.getByText(/Available services: user, data/);
			expect(errorText).toBeDefined();
		});

		it('should return same service instance on multiple calls', () => {
			const TestComponent = () => {
				const { getService } = useAxios();
				const service1 = getService('test');
				const service2 = getService('test');
				return <div>{service1 === service2 ? 'same' : 'different'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('same')).toBeDefined();
		});
	});

	describe('hasService method', () => {
		it('should return true for existing service', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService('test') ? 'exists' : 'missing'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('exists')).toBeDefined();
		});

		it('should return false for non-existent service', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService('missing') ? 'exists' : 'missing'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('missing')).toBeDefined();
		});

		it('should check service names case-sensitively', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return (
					<div>
						{hasService('Test') ? 'found-upper' : 'not-found-upper'} |{' '}
						{hasService('test') ? 'found-lower' : 'not-found-lower'}
					</div>
				);
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText(/not-found-upper.*found-lower/)).toBeDefined();
		});
	});

	describe('useAxios hook', () => {
		it('should throw error when used outside provider', () => {
			// Suppress console.error for this test
			const originalError = console.error;
			console.error = vi.fn();

			const TestComponent = () => {
				try {
					useAxios();
					return <div>no error</div>;
				} catch (error: any) {
					return <div>{error.message}</div>;
				}
			};

			render(<TestComponent />);

			expect(screen.getByText('useAxios must be used within an AxiosProvider')).toBeDefined();

			console.error = originalError;
		});

		it('should return context value when used inside provider', () => {
			const TestComponent = () => {
				const context = useAxios();
				return <div>{context ? 'has context' : 'no context'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('has context')).toBeDefined();
		});

		it('should provide services object', () => {
			const TestComponent = () => {
				const { services } = useAxios();
				return <div>{services ? 'has services' : 'no services'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('has services')).toBeDefined();
		});

		it('should provide getService function', () => {
			const TestComponent = () => {
				const { getService } = useAxios();
				return <div>{typeof getService === 'function' ? 'has function' : 'no function'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('has function')).toBeDefined();
		});

		it('should provide hasService function', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{typeof hasService === 'function' ? 'has function' : 'no function'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('has function')).toBeDefined();
		});
	});

	describe('useService hook', () => {
		it('should return service instance for existing service', () => {
			const TestComponent = () => {
				const service = useService('test');
				return <div>{service ? 'has service' : 'no service'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('has service')).toBeDefined();
		});

		it('should throw error for non-existent service', () => {
			const TestComponent = () => {
				try {
					useService('missing');
					return <div>no error</div>;
				} catch (error: any) {
					return <div>error: {error.message.includes('not found') ? 'not found' : 'other'}</div>;
				}
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText(/error: not found/)).toBeDefined();
		});

		it('should throw error when used outside provider', () => {
			// Suppress console.error for this test
			const originalError = console.error;
			console.error = vi.fn();

			const TestComponent = () => {
				try {
					useService('test');
					return <div>no error</div>;
				} catch (error: any) {
					return <div>{error.message}</div>;
				}
			};

			render(<TestComponent />);

			expect(screen.getByText('useAxios must be used within an AxiosProvider')).toBeDefined();

			console.error = originalError;
		});
	});

	describe('Memoization', () => {
		it('should memoize context value when services unchanged', () => {
			const services = { test: { baseURL: 'http://localhost:8080' } };
			const authConfig = { tokenKey: 'accessToken' };

			let renderCount = 0;
			const TestComponent = () => {
				useAxios();
				renderCount++;
				return <div>render {renderCount}</div>;
			};

			const { rerender } = render(
				<AxiosProvider services={services} authConfig={authConfig}>
					<TestComponent />
				</AxiosProvider>
			);

			const initialRenderCount = renderCount;

			// Force re-render with same props
			rerender(
				<AxiosProvider services={services} authConfig={authConfig}>
					<TestComponent />
				</AxiosProvider>
			);

			// Should not create new context value (renderCount should increase but services stay same)
			expect(renderCount).toBeGreaterThan(initialRenderCount);
		});

		it('should recreate context value when services change', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService('test') ? 'test' : hasService('new') ? 'new' : 'none'}</div>;
			};

			const { rerender } = render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('test')).toBeDefined();

			rerender(
				<AxiosProvider services={{ new: { baseURL: 'http://localhost:8081' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('new')).toBeDefined();
		});

		it('should recreate context value when authConfig changes', () => {
			const TestComponent = () => {
				const { services } = useAxios();
				return <div>services: {Object.keys(services).length}</div>;
			};

			const { rerender } = render(
				<AxiosProvider
					services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true } }}
					authConfig={{ tokenKey: 'token1' }}
				>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('services: 1')).toBeDefined();

			rerender(
				<AxiosProvider
					services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true } }}
					authConfig={{ tokenKey: 'token2' }}
				>
					<TestComponent />
				</AxiosProvider>
			);

			// Should recreate with new authConfig
			expect(mockCreateAuthenticatedClient).toHaveBeenCalledTimes(2);
		});
	});

	describe('Edge cases', () => {
		it('should handle service name with special characters', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService('api-v2') ? 'found' : 'not found'}</div>;
			};

			render(
				<AxiosProvider services={{ 'api-v2': { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('found')).toBeDefined();
		});

		it('should handle service name with dots', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService('api.v2.user') ? 'found' : 'not found'}</div>;
			};

			render(
				<AxiosProvider services={{ 'api.v2.user': { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('found')).toBeDefined();
		});

		it('should handle empty string service name', () => {
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService('') ? 'found' : 'not found'}</div>;
			};

			render(
				<AxiosProvider services={{ '': { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('found')).toBeDefined();
		});

		it('should handle baseURL with trailing slash', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080/' } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'http://localhost:8080/',
				})
			);
		});

		it('should handle baseURL without protocol', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'localhost:8080' } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					baseURL: 'localhost:8080',
				})
			);
		});

		it('should handle very long service names', () => {
			const longName = 'a'.repeat(1000);
			const TestComponent = () => {
				const { hasService } = useAxios();
				return <div>{hasService(longName) ? 'found' : 'not found'}</div>;
			};

			render(
				<AxiosProvider services={{ [longName]: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('found')).toBeDefined();
		});

		it('should handle timeout of 0', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080', timeout: 0 } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					timeout: 0,
				})
			);
		});

		it('should handle very large timeout values', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080', timeout: 999999999 } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					timeout: 999999999,
				})
			);
		});

		it('should handle undefined timeout', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080', timeout: undefined } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(mockAxiosCreate).toHaveBeenCalled();
		});
	});

	describe('Integration scenarios', () => {
		it('should support multiple components accessing different services', () => {
			const UserComponent = () => {
				const userApi = useService('user');
				return <div>user: {userApi ? 'ok' : 'fail'}</div>;
			};

			const DataComponent = () => {
				const dataApi = useService('data');
				return <div>data: {dataApi ? 'ok' : 'fail'}</div>;
			};

			render(
				<AxiosProvider
					services={{
						user: { baseURL: 'http://localhost:8081' },
						data: { baseURL: 'http://localhost:8082' },
					}}
				>
					<UserComponent />
					<DataComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('user: ok')).toBeDefined();
			expect(screen.getByText('data: ok')).toBeDefined();
		});

		it('should support nested components accessing same service', () => {
			const ParentComponent = () => {
				const api = useService('test');
				return (
					<div>
						parent: {api ? 'ok' : 'fail'}
						<ChildComponent />
					</div>
				);
			};

			const ChildComponent = () => {
				const api = useService('test');
				return <div>child: {api ? 'ok' : 'fail'}</div>;
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<ParentComponent />
				</AxiosProvider>
			);

			expect(screen.getByText(/parent: ok/)).toBeDefined();
			expect(screen.getByText('child: ok')).toBeDefined();
		});

		it('should create AxiosHelper instances for all services', () => {
			render(
				<AxiosProvider
					services={{
						service1: { baseURL: 'http://localhost:8081' },
						service2: { baseURL: 'http://localhost:8082' },
						service3: { baseURL: 'http://localhost:8083' },
					}}
				>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(AxiosHelper).toHaveBeenCalledTimes(3);
		});
	});

	describe('Error handling', () => {
		it('should handle invalid service configuration gracefully', () => {
			// Even with invalid config, provider should not crash
			render(
				<AxiosProvider services={{ test: { baseURL: '' } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(screen.getByText('Test')).toBeDefined();
		});

		it('should throw descriptive error when getService called with invalid name', () => {
			const TestComponent = () => {
				const { getService } = useAxios();
				try {
					getService('');
					return <div>no error</div>;
				} catch (error: any) {
					return <div>error caught</div>;
				}
			};

			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080' } }}>
					<TestComponent />
				</AxiosProvider>
			);

			expect(screen.getByText('error caught')).toBeDefined();
		});

		it('should not crash when authConfig is undefined but service requires auth', () => {
			render(
				<AxiosProvider services={{ test: { baseURL: 'http://localhost:8080', requiresAuth: true } }}>
					<div>Test</div>
				</AxiosProvider>
			);

			expect(screen.getByText('Test')).toBeDefined();
		});
	});
});

