import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { DataTable } from '../DataTable';

const columns = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' },
];

describe('DataTable - No Data Scenarios', () => {
	test('renders default empty message when data array is empty', () => {
		renderWithProviders(
			<DataTable data={[]} columns={columns as any} />
		);

		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('renders custom empty message when data array is empty', () => {
		renderWithProviders(
			<DataTable
				data={[]}
				columns={columns as any}
				emptyMessage="No users available at this time"
			/>
		);

		expect(screen.getByText('No users available at this time')).toBeInTheDocument();
	});

	test('renders empty message with title when no data', () => {
		renderWithProviders(
			<DataTable
				title="User List"
				data={[]}
				columns={columns as any}
				emptyMessage="No users found"
			/>
		);

		expect(screen.getByText('User List')).toBeInTheDocument();
		expect(screen.getByText('No users found')).toBeInTheDocument();
	});

	test('does not render loading spinner when loading is false and data is empty', () => {
		renderWithProviders(
			<DataTable
				data={[]}
				columns={columns as any}
				loading={false}
			/>
		);

		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('renders loading spinner instead of empty message when loading is true', () => {
		renderWithProviders(
			<DataTable
				data={[]}
				columns={columns as any}
				loading={true}
			/>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
		expect(screen.queryByText('No records found.')).not.toBeInTheDocument();
	});

	test('handles transition from loading to no data', () => {
		const { rerender } = renderWithProviders(
			<DataTable
				data={[]}
				columns={columns as any}
				loading={true}
			/>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();

		// Simulate API response with no data
		rerender(
			<DataTable
				data={[]}
				columns={columns as any}
				loading={false}
			/>
		);

		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('handles undefined data gracefully', () => {
		renderWithProviders(
			<DataTable
				data={undefined as any}
				columns={columns as any}
			/>
		);

		// Should render empty message when data is undefined
		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('renders correct colspan for empty message based on columns length', () => {
		const manyColumns = [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' },
			{ key: 'email', label: 'Email' },
			{ key: 'role', label: 'Role' },
			{ key: 'status', label: 'Status' },
		];

		const { container } = renderWithProviders(
			<DataTable
				data={[]}
				columns={manyColumns as any}
			/>
		);

		const emptyCell = screen.getByText('No records found.').closest('td');
		// colspan should be columns.length (5) when no nested or actions
		expect(emptyCell).toHaveAttribute('colspan', '5');
	});
});
