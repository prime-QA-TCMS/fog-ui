import React, { useState } from 'react';
import {
	Box,
	Typography,
	Paper,
	Stack,
	Button,
	TextField,
	Divider,
	Alert,
	CircularProgress,
} from '@mui/material';
import {
	AxiosProvider,
	useAxios,
	useService,
	createAuthenticatedClient,
	AxiosHelper,
} from 'fog-ui';
import type { AxiosInstance } from 'axios';

// Example API service component
function ApiServiceExample() {
	const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users/1');
	const [response, setResponse] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { getService } = useAxios() as any;

	const handleFetch = async () => {
		try {
			const service = getService('api') as any;
			if (!service) {
				setError('Axios service not available');
				return;
			}

			setLoading(true);
			setError(null);
			setResponse(null);

			const result = await service.get(url);
			setResponse(result.data);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch data');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				useAxios Hook Example
			</Typography>
			<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
				Access the configured axios instance from any component within AxiosProvider
			</Typography>

			<Stack spacing={2}>
				<TextField
					label="API URL"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					fullWidth
					size="small"
				/>
				<Button variant="contained" onClick={handleFetch} disabled={loading}>
					{loading ? <CircularProgress size={24} /> : 'Fetch Data'}
				</Button>

				{error && <Alert severity="error">{error}</Alert>}

				{response && (
					<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
						<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
							{JSON.stringify(response, null, 2)}
						</Typography>
					</Paper>
				)}
			</Stack>
		</Box>
	);
}

// Example service hook usage
function ServiceHookExample() {
	const [userId, setUserId] = useState('1');
	const [response, setResponse] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const service = useService('api');

	const handleFetchUser = async () => {
		if (!service) {
			setError('Service not available');
			return;
		}

		setLoading(true);
		setError(null);
		setResponse(null);

		try {
			const result = await service.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
			setResponse(result.data);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch user');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				useService Hook Example
			</Typography>
			<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
				Alternative hook for accessing the axios service instance
			</Typography>

			<Stack spacing={2}>
				<TextField
					label="User ID"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
					fullWidth
					size="small"
					type="number"
				/>
				<Button variant="contained" color="secondary" onClick={handleFetchUser} disabled={loading}>
					{loading ? <CircularProgress size={24} /> : 'Fetch User'}
				</Button>

				{error && <Alert severity="error">{error}</Alert>}

				{response && (
					<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
						<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
							{JSON.stringify(response, null, 2)}
						</Typography>
					</Paper>
				)}
			</Stack>
		</Box>
	);
}

export function ApiIntegrationsDemo() {
	const [baseUrl, setBaseUrl] = useState('https://jsonplaceholder.typicode.com');
	const [authToken, setAuthToken] = useState('demo-token-12345');

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				API Integration Utilities
			</Typography>

			<Paper sx={{ p: 3, mb: 3 }}>
				<Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
					Fog UI provides comprehensive API utilities including AxiosProvider, authenticated
					client creation, and helper functions for making HTTP requests.
				</Typography>

				<Stack spacing={3}>
					{/* Configuration */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Configuration
						</Typography>
						<Stack spacing={2}>
							<TextField
								label="Base URL"
								value={baseUrl}
								onChange={(e) => setBaseUrl(e.target.value)}
								fullWidth
								size="small"
							/>
							<TextField
								label="Auth Token"
								value={authToken}
								onChange={(e) => setAuthToken(e.target.value)}
								fullWidth
								size="small"
								type="password"
							/>
						</Stack>
					</Box>

					<Divider />

					{/* AxiosProvider with Examples */}
					<AxiosProvider
						services={{
							api: {
								baseURL: baseUrl,
								requiresAuth: false,
							},
						}}
						authConfig={undefined}
					>
						<ApiServiceExample />
						<Divider sx={{ my: 3 }} />
						<ServiceHookExample />
					</AxiosProvider>

					<Divider />

					{/* createAuthenticatedClient */}
					<Box>
						<Typography variant="h6" gutterBottom>
							createAuthenticatedClient
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Create an authenticated axios instance with custom configuration
						</Typography>
						<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
							<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
								{`import { createAuthenticatedClient } from 'fog-ui';

const client = createAuthenticatedClient({
  baseURL: 'https://api.example.com',
  authToken: 'your-token-here',
  timeout: 10000,
});

// Use the client
const response = await client.get('/api/users');`}
							</Typography>
						</Paper>
					</Box>

					<Divider />

					{/* AxiosHelper */}
					<Box>
						<Typography variant="h6" gutterBottom>
							AxiosHelper
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Utility class with helper methods for common HTTP operations
						</Typography>
						<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
							<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
								{`import { AxiosHelper } from 'fog-ui';

// Static helper methods
const data = await AxiosHelper.get('/api/data', axiosInstance);
const result = await AxiosHelper.post('/api/create', payload, axiosInstance);
const updated = await AxiosHelper.put('/api/update/1', data, axiosInstance);
await AxiosHelper.delete('/api/delete/1', axiosInstance);`}
							</Typography>
						</Paper>
					</Box>

					<Divider />

					{/* AxiosProvider Setup */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Setup in Your App
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Wrap your application with AxiosProvider to enable API utilities throughout
						</Typography>
						<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
							<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
								{`import { AxiosProvider } from 'fog-ui';

function App() {
  return (
    <AxiosProvider 
      baseURL="https://api.example.com"
      authToken={getAuthToken()}
      timeout={10000}
    >
      <YourApp />
    </AxiosProvider>
  );
}`}
							</Typography>
						</Paper>
					</Box>
				</Stack>
			</Paper>
		</Box>
	);
}
