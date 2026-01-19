import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, TextField, Alert } from '@mui/material';
import { ErrorBoundary } from 'fog-ui';

function ProblematicComponent() {
	const [shouldError, setShouldError] = useState(false);

	if (shouldError) {
		throw new Error('This is a test error to demonstrate the ErrorBoundary component');
	}

	return (
		<Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
			<Typography variant="body1" gutterBottom>
				This component is working correctly.
			</Typography>
			<Button
				variant="contained"
				color="error"
				onClick={() => setShouldError(true)}
			>
				Trigger Error
			</Button>
		</Box>
	);
}

export function ErrorBoundaryDemo() {
	const [resetKey, setResetKey] = useState(0);

	const handleReset = () => {
		setResetKey((prev) => prev + 1);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Error Boundary Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						The Error Boundary catches errors in child components and displays a fallback UI.
						Try clicking "Trigger Error" to see how it handles exceptions.
					</Typography>

					<Alert severity="info">
						An error boundary is a React component that catches JavaScript errors anywhere in the
						child component tree. It's useful for graceful error handling in production apps.
					</Alert>

					<ErrorBoundary key={resetKey}>
						<ProblematicComponent />
					</ErrorBoundary>

					<Button variant="outlined" onClick={handleReset} sx={{ alignSelf: 'flex-start' }}>
						Reset Error Boundary
					</Button>
				</Stack>
			</Paper>
		</Box>
	);
}
