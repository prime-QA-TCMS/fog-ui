import React from 'react';
import { describe, test, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../test/utils';
import { DataLoading } from '../DataLoading';

describe('DataLoading - No Data / Edge Cases', () => {
	test('renders loading spinner with valid columns', () => {
		const columns = [
			{ key: 'name', label: 'Name' },
			{ key: 'email', label: 'Email' },
		];

		renderWithProviders(
			<table>
				<tbody>
					<DataLoading columns={columns as any} />
				</tbody>
			</table>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	test('handles empty columns array gracefully', () => {
		renderWithProviders(
			<table>
				<tbody>
					<DataLoading columns={[] as any} />
				</tbody>
			</table>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
		const cell = screen.getByRole('progressbar').closest('td');
		expect(cell).toHaveAttribute('colspan', '1');
	});

	test('handles undefined columns gracefully', () => {
		renderWithProviders(
			<table>
				<tbody>
					<DataLoading columns={undefined as any} />
				</tbody>
			</table>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
		const cell = screen.getByRole('progressbar').closest('td');
		expect(cell).toHaveAttribute('colspan', '1');
	});

	test('handles null columns gracefully', () => {
		renderWithProviders(
			<table>
				<tbody>
					<DataLoading columns={null as any} />
				</tbody>
			</table>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
		const cell = screen.getByRole('progressbar').closest('td');
		expect(cell).toHaveAttribute('colspan', '1');
	});

	test('calculates correct colspan based on columns length', () => {
		const columns = [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' },
			{ key: 'email', label: 'Email' },
			{ key: 'role', label: 'Role' },
		];

		renderWithProviders(
			<table>
				<tbody>
					<DataLoading columns={columns as any} />
				</tbody>
			</table>
		);

		const cell = screen.getByRole('progressbar').closest('td');
		// colspan should be columns.length when no nested or actions
		expect(cell).toHaveAttribute('colspan', '4');
	});
});
