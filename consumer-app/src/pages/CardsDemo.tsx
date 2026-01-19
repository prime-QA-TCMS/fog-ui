import React, { useState } from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
	CardListContainer,
	CardView,
	FilterFormCard,
	PermissionCard,
	MetricCardGrid,
} from 'fog-ui';

export function CardsDemo() {
	const sampleCards = [
		{ id: '1', title: 'Card 1', description: 'First sample card', onViewClick: () => console.log('Card 1 clicked') },
		{ id: '2', title: 'Card 2', description: 'Second sample card', onViewClick: () => console.log('Card 2 clicked') },
		{ id: '3', title: 'Card 3', description: 'Third sample card', onViewClick: () => console.log('Card 3 clicked') },
	];

	const samplePermissions = [
		{
			_id: '1',
			name: 'Read Access',
			actions: ['view', 'download', 'export'],
			__v: 0,
		},
		{
			_id: '2',
			name: 'Write Access',
			actions: ['create', 'edit', 'delete', 'publish'],
			__v: 0,
		},
		{
			_id: '3',
			name: 'Admin Access',
			actions: ['manage', 'configure', 'audit', 'override'],
			__v: 0,
		},
	];

	const sampleMetrics = [
		{
			title: 'Total Users',
			value: 1234,
			color: 'blue',
			icon: '👥',
			isPercentage: false,
			trend: { current: 1234, original: 1100, desiredOutcome: 'incline' },
		},
		{
			title: 'Active Sessions',
			value: 567,
			color: 'green',
			icon: '🔗',
			isPercentage: false,
			trend: { current: 567, original: 540, desiredOutcome: 'incline' },
		},
		{
			title: 'Error Rate',
			value: 2.3,
			color: 'red',
			icon: '⚠️',
			isPercentage: true,
			trend: { current: 2.3, original: 2.8, desiredOutcome: 'decline' },
		},
		{
			title: 'Response Time',
			value: 145,
			color: 'orange',
			icon: '⏱️',
			isPercentage: false,
			trend: { current: 145, original: 155, desiredOutcome: 'decline' },
		},
	];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Card Components
			</Typography>

			<Stack spacing={4}>
				{/* CardListContainer */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Card List Container
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
						Container for displaying multiple cards in a grid layout
					</Typography>
					<CardListContainer cards={sampleCards} />
				</Paper>

				{/* FilterFormCard */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Filter Form Card
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
						Card with form inputs for filtering data
					</Typography>
					<FilterFormCard
						name="search_filters"
						filterFormFields={[
							{
								name: 'search',
								label: 'Search',
								type: 'text',
								placeholder: 'Search items...',
							},
							{
								name: 'status',
								label: 'Status',
								type: 'select',
								options: [
									{ value: 'active', label: 'Active' },
									{ value: 'inactive', label: 'Inactive' },
								],
							},
						]}
						onChange={(filters) => console.log('Filters applied:', filters)}
					/>
				</Paper>

				{/* PermissionCard */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Permission Cards
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
						Cards for displaying and managing permissions
					</Typography>
					<Stack spacing={2}>
						{samplePermissions.map((permission) => (
							<PermissionCard key={permission._id} data={permission} />
						))}
					</Stack>
				</Paper>

				{/* MetricCardGrid */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Metric Card Grid
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
						Grid layout for displaying key metrics and statistics
					</Typography>
					<MetricCardGrid data={sampleMetrics} />
				</Paper>
			</Stack>
		</Box>
	);
}
