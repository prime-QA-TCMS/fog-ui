import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Grid } from '@mui/material';
import {
	DrawerContainer,
	loginContainer,
	contentContainer,
	wrapContainer,
	halfScreenContainer,
} from 'fog-ui';

export function ContainerStylesDemo() {
	const [darkMode, setDarkMode] = useState(false);

	const containerExamples = [
		{
			name: 'Login Container',
			style: loginContainer,
		},
		{
			name: 'Content Container',
			style: contentContainer,
		},
		{
			name: 'Wrap Container',
			style: wrapContainer,
		},
		{
			name: 'Half Screen Container',
			style: halfScreenContainer,
		},
	];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Container Styles
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Predefined container styles for consistent UI styling
					</Typography>

					<Button
						variant="outlined"
						onClick={() => setDarkMode(!darkMode)}
					>
						Toggle Dark Mode
					</Button>

					<Grid container spacing={2}>
						{containerExamples.map((example) => (
							<Grid item xs={12} sm={6} key={example.name}>
								<Box
									sx={{
										...example.style,
										p: 2,
										backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
									}}
								>
									<Typography variant="subtitle2" gutterBottom>
										{example.name}
									</Typography>
									<Typography variant="caption" display="block">
										Responsive container with predefined styles
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Paper>
		</Box>
	);
}
