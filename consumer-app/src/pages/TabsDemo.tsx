import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { Tabs } from 'fog-ui';

interface TabData {
	label: string;
	content: React.ReactNode;
}

export function TabsDemo() {
	const tabsData: TabData[] = [
		{
			label: 'Overview',
			content: (
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Overview Tab
					</Typography>
					<Typography variant="body1">
						This is the overview tab content. The Tabs component provides a clean way to organize
						content into separate views.
					</Typography>
				</Box>
			),
		},
		{
			label: 'Details',
			content: (
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Details Tab
					</Typography>
					<Typography variant="body1">
						This is the details tab with more specific information about the item.
					</Typography>
				</Box>
			),
		},
		{
			label: 'Settings',
			content: (
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Settings Tab
					</Typography>
					<Typography variant="body1">
						Configure your preferences and options in this settings tab.
					</Typography>
				</Box>
			),
		},
		{
			label: 'History',
			content: (
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						History Tab
					</Typography>
					<Typography variant="body1">
						View the complete history and timeline of changes here.
					</Typography>
				</Box>
			),
		},
	];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Tabs Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Organize content with tabbed navigation
					</Typography>

					<Tabs
						tabsData={tabsData}
					/>
				</Stack>
			</Paper>
		</Box>
	);
}
