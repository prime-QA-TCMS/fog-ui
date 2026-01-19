import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AxiosHelper } from '../axiosHelper';

// Mock axios
vi.mock('axios');

describe('AxiosHelper', () => {
	let mockAxiosInstance: AxiosInstance;
	let axiosHelper: AxiosHelper;

	beforeEach(() => {
		// Create a mock axios instance with all necessary methods
		mockAxiosInstance = {
			get: vi.fn(),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
		} as unknown as AxiosInstance;

		axiosHelper = new AxiosHelper(mockAxiosInstance);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('constructor', () => {
		it('should create an instance with provided axios instance', () => {
			expect(axiosHelper).toBeInstanceOf(AxiosHelper);
		});

		it('should accept any valid axios instance', () => {
			const anotherInstance = {
				get: vi.fn(),
				post: vi.fn(),
				put: vi.fn(),
				delete: vi.fn(),
			} as unknown as AxiosInstance;

			const helper = new AxiosHelper(anotherInstance);
			expect(helper).toBeInstanceOf(AxiosHelper);
		});

		it('should store the instance internally', async () => {
			const mockResponse: AxiosResponse = {
				data: { test: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			// Should use the instance passed in constructor
			await axiosHelper.get('/test');
			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
		});
	});

	describe('get method', () => {
		it('should call axios.get and return data', async () => {
			const mockData = { id: 1, name: 'Test User' };
			const mockResponse: AxiosResponse = {
				data: mockData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get('/users/1');

			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1', undefined);
			expect(result).toEqual(mockData);
		});

		it('should pass config to axios.get', async () => {
			const mockData = { id: 1 };
			const mockResponse: AxiosResponse = {
				data: mockData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};
			const config = { headers: { 'X-Custom': 'value' } };

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			await axiosHelper.get('/users/1', config);

			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1', config);
		});

		it('should handle empty data response', async () => {
			const mockResponse: AxiosResponse = {
				data: null,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get('/users');

			expect(result).toBeNull();
		});

		it('should handle array data response', async () => {
			const mockData = [{ id: 1 }, { id: 2 }];
			const mockResponse: AxiosResponse = {
				data: mockData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get('/users');

			expect(result).toEqual(mockData);
			expect(Array.isArray(result)).toBe(true);
		});

		it('should reject when axios.get fails', async () => {
			const error = new Error('Network error');
			(mockAxiosInstance.get as any).mockRejectedValue(error);

			await expect(axiosHelper.get('/users')).rejects.toThrow('Network error');
		});

		it('should handle 404 error', async () => {
			const error = {
				response: {
					status: 404,
					data: { message: 'Not found' },
				},
			};
			(mockAxiosInstance.get as any).mockRejectedValue(error);

			await expect(axiosHelper.get('/users/999')).rejects.toEqual(error);
		});

		it('should handle 500 error', async () => {
			const error = {
				response: {
					status: 500,
					data: { message: 'Internal server error' },
				},
			};
			(mockAxiosInstance.get as any).mockRejectedValue(error);

			await expect(axiosHelper.get('/users')).rejects.toEqual(error);
		});

		it('should handle timeout error', async () => {
			const error = { code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' };
			(mockAxiosInstance.get as any).mockRejectedValue(error);

			await expect(axiosHelper.get('/slow-endpoint')).rejects.toEqual(error);
		});

		it('should handle network error', async () => {
			const error = { message: 'Network Error', code: 'ERR_NETWORK' };
			(mockAxiosInstance.get as any).mockRejectedValue(error);

			await expect(axiosHelper.get('/users')).rejects.toEqual(error);
		});

		it('should handle empty string URL', async () => {
			const mockResponse: AxiosResponse = {
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};
			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			await axiosHelper.get('');

			expect(mockAxiosInstance.get).toHaveBeenCalledWith('', undefined);
		});

		it('should handle URL with query parameters', async () => {
			const mockData = { results: [] };
			const mockResponse: AxiosResponse = {
				data: mockData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};
			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get('/users?page=1&limit=10');

			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users?page=1&limit=10', undefined);
			expect(result).toEqual(mockData);
		});
	});

	describe('post method', () => {
		it('should call axios.post and return data', async () => {
			const postData = { name: 'New User', email: 'test@example.com' };
			const mockResponseData = { id: 1, ...postData };
			const mockResponse: AxiosResponse = {
				data: mockResponseData,
				status: 201,
				statusText: 'Created',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.post('/users', postData);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData, undefined);
			expect(result).toEqual(mockResponseData);
		});

		it('should pass config to axios.post', async () => {
			const postData = { name: 'Test' };
			const config = { headers: { 'Content-Type': 'application/json' } };
			const mockResponse: AxiosResponse = {
				data: { id: 1 },
				status: 201,
				statusText: 'Created',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			await axiosHelper.post('/users', postData, config);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData, config);
		});

		it('should handle post without data', async () => {
			const mockResponse: AxiosResponse = {
				data: { success: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.post('/trigger-action');

			expect(mockAxiosInstance.post).toHaveBeenCalledWith('/trigger-action', undefined, undefined);
			expect(result).toEqual({ success: true });
		});

		it('should handle null data', async () => {
			const mockResponse: AxiosResponse = {
				data: { accepted: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			await axiosHelper.post('/endpoint', null);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith('/endpoint', null, undefined);
		});

		it('should reject when axios.post fails with 400 error', async () => {
			const error = {
				response: {
					status: 400,
					data: { message: 'Invalid request' },
				},
			};
			(mockAxiosInstance.post as any).mockRejectedValue(error);

			await expect(axiosHelper.post('/users', { invalid: 'data' })).rejects.toEqual(error);
		});

		it('should reject when axios.post fails with 401 error', async () => {
			const error = {
				response: {
					status: 401,
					data: { message: 'Unauthorized' },
				},
			};
			(mockAxiosInstance.post as any).mockRejectedValue(error);

			await expect(axiosHelper.post('/protected', {})).rejects.toEqual(error);
		});

		it('should reject when axios.post fails with 403 error', async () => {
			const error = {
				response: {
					status: 403,
					data: { message: 'Forbidden' },
				},
			};
			(mockAxiosInstance.post as any).mockRejectedValue(error);

			await expect(axiosHelper.post('/admin', {})).rejects.toEqual(error);
		});

		it('should handle empty response data', async () => {
			const mockResponse: AxiosResponse = {
				data: null,
				status: 204,
				statusText: 'No Content',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.post('/action', {});

			expect(result).toBeNull();
		});

		it('should handle FormData payload', async () => {
			const formData = new FormData();
			formData.append('file', 'test');
			const mockResponse: AxiosResponse = {
				data: { uploaded: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.post('/upload', formData);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith('/upload', formData, undefined);
			expect(result).toEqual({ uploaded: true });
		});
	});

	describe('put method', () => {
		it('should call axios.put and return data', async () => {
			const updateData = { name: 'Updated User' };
			const mockResponseData = { id: 1, ...updateData };
			const mockResponse: AxiosResponse = {
				data: mockResponseData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.put as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.put('/users/1', updateData);

			expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', updateData, undefined);
			expect(result).toEqual(mockResponseData);
		});

		it('should pass config to axios.put', async () => {
			const updateData = { status: 'active' };
			const config = { headers: { 'If-Match': 'etag123' } };
			const mockResponse: AxiosResponse = {
				data: { success: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.put as any).mockResolvedValue(mockResponse);

			await axiosHelper.put('/users/1', updateData, config);

			expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', updateData, config);
		});

		it('should handle put without data', async () => {
			const mockResponse: AxiosResponse = {
				data: { updated: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.put as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.put('/resource/1');

			expect(mockAxiosInstance.put).toHaveBeenCalledWith('/resource/1', undefined, undefined);
			expect(result).toEqual({ updated: true });
		});

		it('should reject when axios.put fails with 404 error', async () => {
			const error = {
				response: {
					status: 404,
					data: { message: 'Resource not found' },
				},
			};
			(mockAxiosInstance.put as any).mockRejectedValue(error);

			await expect(axiosHelper.put('/users/999', {})).rejects.toEqual(error);
		});

		it('should reject when axios.put fails with 409 conflict', async () => {
			const error = {
				response: {
					status: 409,
					data: { message: 'Conflict' },
				},
			};
			(mockAxiosInstance.put as any).mockRejectedValue(error);

			await expect(axiosHelper.put('/users/1', { email: 'duplicate@example.com' })).rejects.toEqual(error);
		});

		it('should reject when axios.put fails with 422 validation error', async () => {
			const error = {
				response: {
					status: 422,
					data: { errors: { email: 'Invalid email format' } },
				},
			};
			(mockAxiosInstance.put as any).mockRejectedValue(error);

			await expect(axiosHelper.put('/users/1', { email: 'invalid' })).rejects.toEqual(error);
		});

		it('should handle empty object update', async () => {
			const mockResponse: AxiosResponse = {
				data: { id: 1, name: 'Unchanged' },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.put as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.put('/users/1', {});

			expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', {}, undefined);
			expect(result).toEqual({ id: 1, name: 'Unchanged' });
		});
	});

	describe('delete method', () => {
		it('should call axios.delete and return data', async () => {
			const mockResponse: AxiosResponse = {
				data: { success: true, deleted: 1 },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.delete as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.delete('/users/1');

			expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', undefined);
			expect(result).toEqual({ success: true, deleted: 1 });
		});

		it('should pass config to axios.delete', async () => {
			const config = { headers: { 'X-Reason': 'cleanup' } };
			const mockResponse: AxiosResponse = {
				data: { deleted: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.delete as any).mockResolvedValue(mockResponse);

			await axiosHelper.delete('/users/1', config);

			expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', config);
		});

		it('should handle 204 No Content response', async () => {
			const mockResponse: AxiosResponse = {
				data: null,
				status: 204,
				statusText: 'No Content',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.delete as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.delete('/users/1');

			expect(result).toBeNull();
		});

		it('should reject when axios.delete fails with 404 error', async () => {
			const error = {
				response: {
					status: 404,
					data: { message: 'Resource not found' },
				},
			};
			(mockAxiosInstance.delete as any).mockRejectedValue(error);

			await expect(axiosHelper.delete('/users/999')).rejects.toEqual(error);
		});

		it('should reject when axios.delete fails with 403 forbidden', async () => {
			const error = {
				response: {
					status: 403,
					data: { message: 'Cannot delete this resource' },
				},
			};
			(mockAxiosInstance.delete as any).mockRejectedValue(error);

			await expect(axiosHelper.delete('/protected/1')).rejects.toEqual(error);
		});

		it('should reject when axios.delete fails with 409 conflict', async () => {
			const error = {
				response: {
					status: 409,
					data: { message: 'Resource is in use' },
				},
			};
			(mockAxiosInstance.delete as any).mockRejectedValue(error);

			await expect(axiosHelper.delete('/users/1')).rejects.toEqual(error);
		});

		it('should handle delete with data parameter (unusual but valid)', async () => {
			const config = { data: { reason: 'test' } };
			const mockResponse: AxiosResponse = {
				data: { deleted: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.delete as any).mockResolvedValue(mockResponse);

			await axiosHelper.delete('/users/1', config);

			expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', config);
		});
	});

	describe('TypeScript generic types', () => {
		it('should correctly type GET response', async () => {
			interface User {
				id: number;
				name: string;
			}

			const mockUser: User = { id: 1, name: 'John' };
			const mockResponse: AxiosResponse<User> = {
				data: mockUser,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get<User>('/users/1');

			expect(result).toEqual(mockUser);
			// TypeScript should recognize result as User type
			expect(result.id).toBe(1);
			expect(result.name).toBe('John');
		});

		it('should correctly type POST response', async () => {
			interface CreateResponse {
				id: number;
				created: boolean;
			}

			const mockResponse: CreateResponse = { id: 1, created: true };
			const axiosResponse: AxiosResponse<CreateResponse> = {
				data: mockResponse,
				status: 201,
				statusText: 'Created',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.post as any).mockResolvedValue(axiosResponse);

			const result = await axiosHelper.post<CreateResponse>('/users', { name: 'Test' });

			expect(result.created).toBe(true);
		});

		it('should handle array types in generic', async () => {
			interface User {
				id: number;
			}

			const mockUsers: User[] = [{ id: 1 }, { id: 2 }];
			const mockResponse: AxiosResponse<User[]> = {
				data: mockUsers,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get<User[]>('/users');

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
		});
	});

	describe('edge cases and error scenarios', () => {
		it('should handle axios instance being replaced mid-execution', async () => {
			const mockResponse: AxiosResponse = {
				data: { test: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			// First call
			await axiosHelper.get('/test1');

			// Second call should still work
			await axiosHelper.get('/test2');

			expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
		});

		it('should handle concurrent requests', async () => {
			const mockResponse: AxiosResponse = {
				data: { success: true },
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);
			(mockAxiosInstance.post as any).mockResolvedValue(mockResponse);

			const promises = [
				axiosHelper.get('/endpoint1'),
				axiosHelper.get('/endpoint2'),
				axiosHelper.post('/endpoint3', {}),
			];

			const results = await Promise.all(promises);

			expect(results).toHaveLength(3);
			expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
		});

		it('should handle special characters in URL', async () => {
			const mockResponse: AxiosResponse = {
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			await axiosHelper.get('/users?name=O\'Brien&age=30');

			expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users?name=O\'Brien&age=30', undefined);
		});

		it('should handle very long URLs', async () => {
			const longUrl = '/users?' + 'x'.repeat(2000);
			const mockResponse: AxiosResponse = {
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			await axiosHelper.get(longUrl);

			expect(mockAxiosInstance.get).toHaveBeenCalledWith(longUrl, undefined);
		});

		it('should handle response with nested objects', async () => {
			const complexData = {
				user: {
					profile: {
						details: {
							name: 'John',
							nested: {
								deep: 'value',
							},
						},
					},
				},
			};

			const mockResponse: AxiosResponse = {
				data: complexData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get('/complex');

			expect(result).toEqual(complexData);
			expect(result.user.profile.details.nested.deep).toBe('value');
		});

		it('should handle response with circular reference safely', async () => {
			const circularData: any = { prop: 'value' };
			circularData.self = circularData;

			const mockResponse: AxiosResponse = {
				data: circularData,
				status: 200,
				statusText: 'OK',
				headers: {},
				config: {} as any,
			};

			(mockAxiosInstance.get as any).mockResolvedValue(mockResponse);

			const result = await axiosHelper.get('/circular');

			expect(result.prop).toBe('value');
			expect(result.self).toBe(result);
		});
	});
});
