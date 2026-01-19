import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../test/utils';
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

describe('DataTable - Colspan Bug Tests', () => {
	it('should have correct colspan when no nested config or actions', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				emptyMessage="No data"
			/>
		);

		const noDataCell = screen.getByTestId('data-table-no-data-cell');
		// Should match columns.length (2), not columns.length + 1 (3)
		expect(noDataCell).toHaveAttribute('colspan', '2');
	});

	it('should have correct colspan when nested config is present', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				nestedConfig={{
					getNestedData: () => [],
					nestedColumns: [{ key: 'detail', label: 'Detail' }],
				} as any}
				emptyMessage="No data"
			/>
		);

		const noDataCell = screen.getByTestId('data-table-no-data-cell');
		// Should match columns.length + 1 for nested expand column (3)
		expect(noDataCell).toHaveAttribute('colspan', '3');
	});

	it('should have correct colspan when row component (actions) is present', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				rowComponent={() => <button>Edit</button>}
				emptyMessage="No data"
			/>
		);

		const noDataCell = screen.getByTestId('data-table-no-data-cell');
		// Should match columns.length + 1 for actions column (3)
		expect(noDataCell).toHaveAttribute('colspan', '3');
	});

	it('should have correct colspan when both nested and actions are present', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				nestedConfig={{
					getNestedData: () => [],
					nestedColumns: [{ key: 'detail', label: 'Detail' }],
				} as any}
				rowComponent={() => <button>Edit</button>}
				emptyMessage="No data"
			/>
		);

		const noDataCell = screen.getByTestId('data-table-no-data-cell');
		// Should match columns.length + 2 (one for nested, one for actions) = 4
		expect(noDataCell).toHaveAttribute('colspan', '4');
	});

	it('should have correct colspan in loading state with no nested or actions', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				loading={true}
			/>
		);

		const loadingCell = screen.getByTestId('data-table-loading-cell');
		// Should match columns.length (2), not columns.length + 1 (3)
		expect(loadingCell).toHaveAttribute('colspan', '2');
	});

	it('should have correct colspan in loading state with nested config', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				nestedConfig={{
					getNestedData: () => [],
					nestedColumns: [{ key: 'detail', label: 'Detail' }],
				} as any}
				loading={true}
			/>
		);

		const loadingCell = screen.getByTestId('data-table-loading-cell');
		// Should match columns.length + 1 for nested expand column (3)
		expect(loadingCell).toHaveAttribute('colspan', '3');
	});

	it('should have correct colspan in loading state with actions', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				rowComponent={() => <button>Edit</button>}
				loading={true}
			/>
		);

		const loadingCell = screen.getByTestId('data-table-loading-cell');
		// Should match columns.length + 1 for actions column (3)
		expect(loadingCell).toHaveAttribute('colspan', '3');
	});

	it('should have correct colspan in loading state with both nested and actions', () => {
		renderWithProviders(
			<DataTable
				title="Users"
				data={[]}
				columns={columns as any}
				nestedConfig={{
					getNestedData: () => [],
					nestedColumns: [{ key: 'detail', label: 'Detail' }],
				} as any}
				rowComponent={() => <button>Edit</button>}
				loading={true}
			/>
		);

		const loadingCell = screen.getByTestId('data-table-loading-cell');
		// Should match columns.length + 2 (one for nested, one for actions) = 4
		expect(loadingCell).toHaveAttribute('colspan', '4');
	});
});
