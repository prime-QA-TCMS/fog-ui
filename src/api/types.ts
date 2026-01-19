import { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export type TokenStorage = 'localStorage' | 'sessionStorage' | 'memory';

export interface TokenRefreshConfig {
	refreshEndpoint: string;
	refreshTokenKey?: string;
	extractAccessToken?: (response: any) => string;
	extractRefreshToken?: (response: any) => string | null;
}

export interface AuthConfig {
	baseURL?: string;
	timeout?: number;
	tokenKey?: string;
	tokenStorage?: TokenStorage;
	refreshConfig?: TokenRefreshConfig;
	loginRedirectPath?: string;
	onRefreshFailed?: (error: any) => void;
	shouldRefreshToken?: (error: any) => boolean;
	onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
	onResponse?: (response: any) => any;
	onError?: (error: any) => any;
	axiosConfig?: AxiosRequestConfig;
}

export interface ServiceConfig {
	baseURL: string;
	requiresAuth?: boolean;
	timeout?: number;
	axiosConfig?: AxiosRequestConfig;
}

export interface ApiServicesConfig {
	[serviceName: string]: ServiceConfig;
}
export interface AxiosContextValue {
	services: Record<string, any>; // Will be AxiosHelper instances
	getService: (serviceName: string) => any;
	hasService: (serviceName: string) => boolean;
}
export interface AxiosProviderProps {
	services: ApiServicesConfig;
	authConfig?: AuthConfig;
	children: React.ReactNode;
}
export interface MemoryStorage {
	[key: string]: string | null;
}

export interface StorageAdapter {
	getItem: (key: string) => string | null;
	setItem: (key: string, value: string) => void;
	removeItem: (key: string) => void;
}
export interface QueuedRequest {
	resolve: (value?: any) => void;
	reject: (error?: any) => void;
}

export interface AuthenticatedClientResult {
	instance: AxiosInstance;
	setToken: (token: string) => void;
	clearToken: () => void;
	getToken: () => string | null;
	refreshToken: () => Promise<void>;
}