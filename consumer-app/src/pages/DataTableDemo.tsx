import React, { useState } from 'react';
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Stack,
	TextField,
} from '@mui/material';
import { DataTable } from 'fog-ui';

interface User {
	_id: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

const sampleUsers: User[] = [
	{
		_id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'Admin',
		status: 'Active',
	},
	{
		_id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'User',
		status: 'Active',
	},
	{
		_id: '3',
		name: 'Bob Johnson',
		email: 'bob@example.com',
		role: 'Editor',
		status: 'Inactive',
	},
	{
		_id: '4',
		name: 'Alice Brown',
		email: 'alice@example.com',
		role: 'User',
		status: 'Active',
	},
];

const userColumns = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' },
	{ key: 'role', label: 'Role' },
	{ key: 'status', label: 'Status' },
];

export function DataTableDemo() {
	const [loading, setLoading] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);

	const handleLoadingToggle = () => {
		setLoading(!loading);
	};

	const handleEmptyToggle = () => {
		setIsEmpty(!isEmpty);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				DataTable Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Comprehensive data table with nested rows, loading states, and empty states
					</Typography>

					<Stack direction="row" spacing={2}>
						<Button
							variant={loading ? 'contained' : 'outlined'}
							onClick={handleLoadingToggle}
						>
							{loading ? 'Loading...' : 'Toggle Loading'}
						</Button>
						<Button
							variant={isEmpty ? 'contained' : 'outlined'}
							onClick={handleEmptyToggle}
						>
							{isEmpty ? 'Show Empty' : 'Toggle Empty State'}
						</Button>
					</Stack>

					<DataTable
						title="Users Management"
						data={isEmpty ? [] : sampleUsers}
						columns={userColumns as any}
						loading={loading}
						emptyMessage="No users found"
						rowComponent={(user: User) => (
							<Stack direction="row" spacing={1}>
								<Button size="small" variant="outlined">
									Edit
								</Button>
								<Button size="small" variant="outlined" color="error">
									Delete
								</Button>
							</Stack>
						)}
					/>
				</Stack>
			</Paper>
		</Box>
	);
}
