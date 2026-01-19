import React from 'react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { useToast } from 'fog-ui';

export function ToastDemo() {
	const toast = useToast();

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Toast Notifications
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={2}>
					<Typography variant="body2" color="textSecondary">
						Click buttons below to trigger different types of toast notifications
					</Typography>

					<Stack direction="row" spacing={2} flexWrap="wrap">
						<Button
							variant="contained"
							color="success"
							onClick={() => toast.success('Operation successful!')}
						>
							Success Toast
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={() => toast.error('Something went wrong!')}
						>
							Error Toast
						</Button>
						<Button
							variant="contained"
							color="warning"
							onClick={() => toast.warning('Warning: Please check this!')}
						>
							Warning Toast
						</Button>
						<Button
							variant="contained"
							color="info"
							onClick={() => toast.info('Information: New feature available')}
						>
							Info Toast
						</Button>
					</Stack>

					<Stack direction="row" spacing={2} flexWrap="wrap">
						<Button
							variant="outlined"
							onClick={() => toast.success('This will auto-dismiss in 3 seconds', { duration: 3000 })}
						>
							3 Second Toast
						</Button>
						<Button
							variant="outlined"
							onClick={() => toast.info('This stays until dismissed', { duration: 10000 })}
						>
							Persistent Toast
						</Button>
					</Stack>
				</Stack>
			</Paper>
		</Box>
	);
}
