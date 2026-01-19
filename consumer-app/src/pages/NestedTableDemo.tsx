import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Chip } from '@mui/material';
import { DataTable } from 'fog-ui';

interface MainRow {
	_id: string;
	name: string;
	status: string;
	count: number;
	details?: SubRow[];
}

interface SubRow {
	_id: string;
	subName: string;
	value: string;
	timestamp: string;
}

export function NestedTableDemo() {
	const sampleData: MainRow[] = [
		{
			_id: '1',
			name: 'Project Alpha',
			status: 'Active',
			count: 3,
			details: [
				{ _id: '1-1', subName: 'Task 1', value: 'Completed', timestamp: '2024-01-15' },
				{ _id: '1-2', subName: 'Task 2', value: 'In Progress', timestamp: '2024-01-16' },
				{ _id: '1-3', subName: 'Task 3', value: 'Pending', timestamp: '2024-01-17' },
			],
		},
		{
			_id: '2',
			name: 'Project Beta',
			status: 'Completed',
			count: 2,
			details: [
				{ _id: '2-1', subName: 'Task 1', value: 'Completed', timestamp: '2024-01-10' },
				{ _id: '2-2', subName: 'Task 2', value: 'Completed', timestamp: '2024-01-12' },
			],
		},
		{
			_id: '3',
			name: 'Project Gamma',
			status: 'Pending',
			count: 4,
			details: [
				{ _id: '3-1', subName: 'Task 1', value: 'Pending', timestamp: '2024-01-18' },
				{ _id: '3-2', subName: 'Task 2', value: 'Pending', timestamp: '2024-01-19' },
				{ _id: '3-3', subName: 'Task 3', value: 'Pending', timestamp: '2024-01-20' },
				{ _id: '3-4', subName: 'Task 4', value: 'Pending', timestamp: '2024-01-21' },
			],
		},
	];

	const mainColumns = [
		{ key: 'name', label: 'Project Name' },
		{ key: 'status', label: 'Status' },
		{ key: 'count', label: 'Task Count' },
	];

	const nestedColumns = [
		{ key: 'subName', label: 'Task Name' },
		{ key: 'value', label: 'Status' },
		{ key: 'timestamp', label: 'Date' },
	];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Nested Table Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
					Tables with expandable rows showing nested/hierarchical data. Click on a row to expand and see nested details.
				</Typography>

				<DataTable
					data={sampleData}
					columns={mainColumns}
					nestedConfig={{
						getNestedData: (item: MainRow) => item.details || [],
						nestedColumns: nestedColumns,
					}}
				/>
			</Paper>
		</Box>
	);
}
