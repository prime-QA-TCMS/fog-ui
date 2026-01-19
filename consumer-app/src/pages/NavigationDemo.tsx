import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Divider, TextField } from '@mui/material';
import { useNavigationWithContext } from 'fog-ui';
import type { NavigationContext } from 'fog-ui';

export function NavigationDemo() {
	const { navigateWithContext } = useNavigationWithContext();
	const [customTitle, setCustomTitle] = useState('Custom Page Title');
	const [contextKey, setContextKey] = useState('customData');
	const [contextValue, setContextValue] = useState('Sample Value');

	const handleBasicNavigation = () => {
		navigateWithContext('/datatable', {
			title: 'DataTable View',
		});
	};

	const handleNavigationWithContext = () => {
		navigateWithContext('/forms', {
			title: 'Form Page',
			contextData: {
				source: 'navigation-demo',
				timestamp: new Date().toISOString(),
				user: 'demo-user',
			},
		});
	};

	const handleCustomNavigation = () => {
		const context: NavigationContext = {
			title: customTitle,
			contextData: {
				[contextKey]: contextValue,
			},
		};
		navigateWithContext('/toast', context);
	};

	const handleNavigationReplace = () => {
		navigateWithContext(
			'/error-boundary',
			{
				title: 'Error Boundary Demo',
			},
			{ replace: true }
		);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Navigation with Context
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
					useNavigationWithContext hook provides programmatic navigation with automatic title
					management and context data storage via localStorage
				</Typography>

				<Stack spacing={3}>
					{/* Basic Navigation */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Basic Navigation with Title
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Navigate to a page and set its title in localStorage
						</Typography>
						<Button variant="contained" onClick={handleBasicNavigation}>
							Navigate to DataTable
						</Button>
					</Box>

					<Divider />

					{/* Navigation with Context Data */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Navigation with Context Data
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Navigate and store additional context data (check localStorage after
							navigation)
						</Typography>
						<Button variant="contained" color="secondary" onClick={handleNavigationWithContext}>
							Navigate with Context
						</Button>
					</Box>

					<Divider />

					{/* Custom Navigation */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Custom Navigation
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Configure custom title and context data
						</Typography>
						<Stack spacing={2}>
							<TextField
								label="Page Title"
								value={customTitle}
								onChange={(e) => setCustomTitle(e.target.value)}
								fullWidth
								size="small"
							/>
							<Stack direction="row" spacing={2}>
								<TextField
									label="Context Key"
									value={contextKey}
									onChange={(e) => setContextKey(e.target.value)}
									size="small"
									sx={{ flex: 1 }}
								/>
								<TextField
									label="Context Value"
									value={contextValue}
									onChange={(e) => setContextValue(e.target.value)}
									size="small"
									sx={{ flex: 1 }}
								/>
							</Stack>
							<Button variant="contained" color="info" onClick={handleCustomNavigation}>
								Navigate with Custom Data
							</Button>
						</Stack>
					</Box>

					<Divider />

					{/* Navigation with Options */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Navigation with Router Options
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Use replace option to replace current history entry
						</Typography>
						<Button variant="contained" color="warning" onClick={handleNavigationReplace}>
							Navigate with Replace
						</Button>
					</Box>

					<Divider />

					{/* Local Storage Viewer */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Current Context in LocalStorage
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Check browser DevTools → Application → Local Storage to see stored values
						</Typography>
						<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
							<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
								{JSON.stringify(
									{
										pageTitle: localStorage.getItem('pageTitle'),
										customData: localStorage.getItem('customData'),
										source: localStorage.getItem('source'),
										timestamp: localStorage.getItem('timestamp'),
										user: localStorage.getItem('user'),
									},
									null,
									2
								)}
							</Typography>
						</Paper>
					</Box>
				</Stack>
			</Paper>
		</Box>
	);
}
