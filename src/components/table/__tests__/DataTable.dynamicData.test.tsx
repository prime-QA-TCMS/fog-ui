import React, { useState, useEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { DataTable } from '../DataTable';

const columns = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' },
];

interface User {
	_id: string;
	name: string;
	email: string;
}

describe('DataTable - Dynamic Data Updates (API Simulation)', () => {
	it('should render no data initially, then render data after update', async () => {
		const TestComponent = () => {
			const [data, setData] = useState<User[]>([]);
			const [loading, setLoading] = useState(true);

			useEffect(() => {
				// Simulate API call
				setTimeout(() => {
					setData([
						{ _id: '1', name: 'John Doe', email: 'john@example.com' },
						{ _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
					]);
					setLoading(false);
				}, 100);
			}, []);

			return (
				<DataTable
					title="Users"
					data={data}
					columns={columns as any}
					loading={loading}
					emptyMessage="No users found"
				/>
			);
		};

		renderWithProviders(<TestComponent />);

		// Initially should show loading
		expect(screen.getByRole('progressbar')).toBeInTheDocument();

		// Wait for data to load
		await waitFor(() => {
			expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		});

		// Should now display the data
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
		expect(screen.queryByText('No users found')).not.toBeInTheDocument();
	});

	it('should transition from empty state to data without loading', async () => {
		const TestComponent = () => {
			const [data, setData] = useState<User[]>([]);

			useEffect(() => {
				// Simulate delayed data update without loading state
				setTimeout(() => {
					setData([
						{ _id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
					]);
				}, 100);
			}, []);

			return (
				<DataTable
					title="Users"
					data={data}
					columns={columns as any}
					emptyMessage="No users available"
				/>
			);
		};

		renderWithProviders(<TestComponent />);

		// Initially should show empty message
		expect(screen.getByText('No users available')).toBeInTheDocument();

		// Wait for data to appear
		await waitFor(() => {
			expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
		});

		// Empty message should be gone
		expect(screen.queryByText('No users available')).not.toBeInTheDocument();
	});

	it('should handle multiple data updates correctly', async () => {
		const TestComponent = () => {
			const [data, setData] = useState<User[]>([]);
			const [updateCount, setUpdateCount] = useState(0);

			useEffect(() => {
				if (updateCount === 0) {
					// First update
					setTimeout(() => {
						setData([{ _id: '1', name: 'First User', email: 'first@example.com' }]);
						setUpdateCount(1);
					}, 50);
				} else if (updateCount === 1) {
					// Second update
					setTimeout(() => {
						setData([
							{ _id: '1', name: 'First User', email: 'first@example.com' },
							{ _id: '2', name: 'Second User', email: 'second@example.com' },
						]);
						setUpdateCount(2);
					}, 50);
				}
			}, [updateCount]);

			return (
				<DataTable
					title="Users"
					data={data}
					columns={columns as any}
					emptyMessage="No users found"
				/>
			);
		};

		renderWithProviders(<TestComponent />);

		// Initially empty
		expect(screen.getByText('No users found')).toBeInTheDocument();

		// Wait for first user
		await waitFor(() => {
			expect(screen.getByText('First User')).toBeInTheDocument();
		});

		// Wait for second user
		await waitFor(() => {
			expect(screen.getByText('Second User')).toBeInTheDocument();
		});

		// Should have both users
		const rows = screen.getAllByRole('row');
		// header + 2 data rows = 3 (excluding title)
		expect(rows.length).toBeGreaterThanOrEqual(2);
	});

	it('should handle transition from data back to empty', async () => {
		const TestComponent = () => {
			const [data, setData] = useState<User[]>([
				{ _id: '1', name: 'John Doe', email: 'john@example.com' },
			]);

			useEffect(() => {
				// Clear data after delay
				setTimeout(() => {
					setData([]);
				}, 100);
			}, []);

			return (
				<DataTable
					title="Users"
					data={data}
					columns={columns as any}
					emptyMessage="All users removed"
				/>
			);
		};

		renderWithProviders(<TestComponent />);

		// Initially should have data
		expect(screen.getByText('John Doe')).toBeInTheDocument();

		// Wait for data to be cleared
		await waitFor(() => {
			expect(screen.getByText('All users removed')).toBeInTheDocument();
		});

		// Data should be gone
		expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
	});

	it('should render data immediately when provided on mount', () => {
		const data: User[] = [
			{ _id: '1', name: 'Immediate User', email: 'immediate@example.com' },
		];

		renderWithProviders(
			<DataTable
				title="Users"
				data={data}
				columns={columns as any}
				emptyMessage="No users found"
			/>
		);

		// Data should be visible immediately
		expect(screen.getByText('Immediate User')).toBeInTheDocument();
		expect(screen.queryByText('No users found')).not.toBeInTheDocument();
		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
	});

	it('should update correctly when loading changes with existing data', async () => {
		const TestComponent = () => {
			const [loading, setLoading] = useState(true);
			const data: User[] = [
				{ _id: '1', name: 'Cached User', email: 'cached@example.com' },
			];

			useEffect(() => {
				setTimeout(() => {
					setLoading(false);
				}, 100);
			}, []);

			return (
				<DataTable
					title="Users"
					data={data}
					columns={columns as any}
					loading={loading}
					emptyMessage="No users found"
				/>
			);
		};

		renderWithProviders(<TestComponent />);

		// Initially should show loading
		expect(screen.getByRole('progressbar')).toBeInTheDocument();

		// Wait for loading to finish
		await waitFor(() => {
			expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		});

		// Should now display the data
		expect(screen.getByText('Cached User')).toBeInTheDocument();
	});
});
