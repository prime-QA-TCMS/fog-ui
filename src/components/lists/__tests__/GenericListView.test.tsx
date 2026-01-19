import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenericListView } from '../GenericListView';
import { ListItemData } from '../List';
import { AccordionItem } from '../AccordionList';

// Mock useApi hook
vi.mock('../../../hooks/useApi', () => ({
	useApi: vi.fn(),
}));

// Mock AccordionList component
vi.mock('../AccordionList', () => ({
	AccordionList: ({ items }: { items: any[] }) => (
		<div data-testid="accordion-list">
			{items.map((item) => (
				<div key={item.id} data-testid={`accordion-item-${item.id}`}>
					{item.title}
				</div>
			))}
		</div>
	),
}));

import { useApi } from '../../../hooks/useApi';

const mockUseApi = vi.mocked(useApi);

interface TestUser {
	id: number;
	name: string;
	email: string;
	isActive: boolean;
}

describe('GenericListView', () => {
	const mockFetchData = vi.fn<[], Promise<TestUser[]>>();
	const mockMapToListItem = vi.fn<[TestUser], ListItemData>();

	beforeEach(() => {
		vi.clearAllMocks();
		mockMapToListItem.mockImplementation((user: TestUser) => ({
			id: user.id,
			title: user.name,
			link: `/users/${user.id}`,
		}));
	});

	describe('Data Fetching', () => {
		it('displays loading state while fetching', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: true,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByTestId('loading-container')).toBeInTheDocument();
			expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
			const loadingContainer = screen.getByTestId('loading-container');
			expect(loadingContainer).toHaveAttribute('role', 'status');
			expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
			expect(loadingContainer).toHaveAttribute('aria-busy', 'true');
		});

		it('displays data after successful fetch', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'John Doe',
					email: 'john@example.com',
					isActive: true,
				},
				{
					id: 2,
					name: 'Jane Smith',
					email: 'jane@example.com',
					isActive: true,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByTestId('accordion-list')).toBeInTheDocument();
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('Jane Smith')).toBeInTheDocument();
			expect(mockMapToListItem).toHaveBeenCalledTimes(2);
		});

		it('passes immediate prop to useApi', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
					immediate={false}
				/>
			);

			expect(mockUseApi).toHaveBeenCalledWith(mockFetchData, [], false);
		});

		it('uses immediate=true by default', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(mockUseApi).toHaveBeenCalledWith(mockFetchData, [], true);
		});
	});

	describe('Error States', () => {
		it('displays error message when fetch fails', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: new Error('Network error'),
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByTestId('error-message')).toBeInTheDocument();
			expect(screen.getByText('Failed to load data')).toBeInTheDocument();
		});

		it('displays custom error message', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: new Error('API error'),
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
					errorMessage="Could not load users"
				/>
			);

			expect(screen.getByText('Could not load users')).toBeInTheDocument();
		});

		it('error message has correct accessibility attributes', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: new Error('Error'),
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			const errorElement = screen.getByTestId('error-message');
			expect(errorElement).toHaveAttribute('role', 'alert');
			expect(errorElement).toHaveAttribute('aria-live', 'polite');
		});
	});

	describe('Empty States', () => {
		it('displays empty message when no data', () => {
			mockUseApi.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByTestId('empty-message')).toBeInTheDocument();
			expect(screen.getByText('No items found')).toBeInTheDocument();
		});

		it('displays custom empty message', () => {
			mockUseApi.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
					emptyMessage="No users available"
				/>
			);

			expect(screen.getByText('No users available')).toBeInTheDocument();
		});

		it('displays empty message when data is null', () => {
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByText('No items found')).toBeInTheDocument();
		});

		it('empty message has correct accessibility attributes', () => {
			mockUseApi.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			const emptyElement = screen.getByTestId('empty-message');
			expect(emptyElement).toHaveAttribute('role', 'status');
			expect(emptyElement).toHaveAttribute('aria-live', 'polite');
		});
	});

	describe('Filtering', () => {
		it('applies filter function to data', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'Active User',
					email: 'active@example.com',
					isActive: true,
				},
				{
					id: 2,
					name: 'Inactive User',
					email: 'inactive@example.com',
					isActive: false,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			const filterActive = vi.fn((users: TestUser[]) =>
				users.filter((u) => u.isActive)
			);

			render(
				<GenericListView
					fetchData={mockFetchData}
					filterData={filterActive}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(filterActive).toHaveBeenCalledWith(testData);
			expect(screen.getByText('Active User')).toBeInTheDocument();
			expect(screen.queryByText('Inactive User')).not.toBeInTheDocument();
			expect(mockMapToListItem).toHaveBeenCalledTimes(1);
		});

		it('renders all data when no filter provided', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'User 1',
					email: 'user1@example.com',
					isActive: true,
				},
				{
					id: 2,
					name: 'User 2',
					email: 'user2@example.com',
					isActive: false,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByText('User 1')).toBeInTheDocument();
			expect(screen.getByText('User 2')).toBeInTheDocument();
			expect(mockMapToListItem).toHaveBeenCalledTimes(2);
		});

		it('displays empty message when filter removes all items', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'User 1',
					email: 'user1@example.com',
					isActive: false,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			const filterActive = (users: TestUser[]) =>
				users.filter((u) => u.isActive);

			render(
				<GenericListView
					fetchData={mockFetchData}
					filterData={filterActive}
					mapToListItem={mockMapToListItem}
					emptyMessage="No active users"
				/>
			);

			expect(screen.getByText('No active users')).toBeInTheDocument();
			expect(mockMapToListItem).not.toHaveBeenCalled();
		});
	});

	describe('Custom List Component', () => {
		it('renders with custom list component', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'User 1',
					email: 'user1@example.com',
					isActive: true,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			const CustomList = ({ items }: { items: ListItemData[] }) => (
				<div data-testid="custom-list">
					{items.map((item) => (
						<div key={item.id} data-testid={`custom-item-${item.id}`}>
							{item.title}
						</div>
					))}
				</div>
			);

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
					ListComponent={CustomList}
				/>
			);

			expect(screen.getByTestId('custom-list')).toBeInTheDocument();
			expect(screen.getByTestId('custom-item-1')).toBeInTheDocument();
			expect(screen.getByText('User 1')).toBeInTheDocument();
		});

		it('uses AccordionList by default', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'User 1',
					email: 'user1@example.com',
					isActive: true,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByTestId('accordion-list')).toBeInTheDocument();
		});
	});

	describe('Data Mapping', () => {
		it('maps data correctly using mapToListItem function', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'John Doe',
					email: 'john@example.com',
					isActive: true,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(mockMapToListItem).toHaveBeenCalled();
			expect(mockMapToListItem).toHaveBeenCalledTimes(1);
			// Verify the first argument matches the user data
			expect(mockMapToListItem.mock.calls[0][0]).toEqual(testData[0]);
		});

		it('handles AccordionItem mapping', () => {
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'John Doe',
					email: 'john@example.com',
					isActive: true,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			const mapToAccordionItem = vi.fn<[TestUser], AccordionItem>(
				(user: TestUser) => ({
					id: user.id,
					title: user.name,
					percentage: 100,
					component: <div>{user.email}</div>,
				})
			);

			render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mapToAccordionItem}
				/>
			);

			expect(mapToAccordionItem).toHaveBeenCalled();
			expect(mapToAccordionItem).toHaveBeenCalledTimes(1);
			// Verify the first argument is the user data
			expect(mapToAccordionItem.mock.calls[0][0]).toEqual(testData[0]);
		});
	});

	describe('Real-World Scenarios', () => {
		it('handles user list scenario', () => {
			const users: TestUser[] = [
				{
					id: 1,
					name: 'Admin User',
					email: 'admin@example.com',
					isActive: true,
				},
				{
					id: 2,
					name: 'Regular User',
					email: 'user@example.com',
					isActive: true,
				},
				{
					id: 3,
					name: 'Inactive User',
					email: 'inactive@example.com',
					isActive: false,
				},
			];

			mockUseApi.mockReturnValue({
				data: users,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			const filterActive = (users: TestUser[]) =>
				users.filter((u) => u.isActive);

			render(
				<GenericListView
					fetchData={mockFetchData}
					filterData={filterActive}
					mapToListItem={mockMapToListItem}
					emptyMessage="No active users found"
				/>
			);

			expect(screen.getByText('Admin User')).toBeInTheDocument();
			expect(screen.getByText('Regular User')).toBeInTheDocument();
			expect(screen.queryByText('Inactive User')).not.toBeInTheDocument();
		});

		it('handles error recovery scenario', () => {
			const { rerender } = render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			// Initial error state
			mockUseApi.mockReturnValue({
				data: null,
				loading: false,
				error: new Error('Network error'),
				refetch: vi.fn(),
			});

			rerender(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByText('Failed to load data')).toBeInTheDocument();

			// Data loaded after retry
			const testData: TestUser[] = [
				{
					id: 1,
					name: 'User 1',
					email: 'user1@example.com',
					isActive: true,
				},
			];

			mockUseApi.mockReturnValue({
				data: testData,
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			rerender(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByText('User 1')).toBeInTheDocument();
		});

		it('handles loading to empty state transition', () => {
			const { rerender } = render(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			// Loading state
			mockUseApi.mockReturnValue({
				data: null,
				loading: true,
				error: null,
				refetch: vi.fn(),
			});

			rerender(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByTestId('loading-container')).toBeInTheDocument();

			// Empty state
			mockUseApi.mockReturnValue({
				data: [],
				loading: false,
				error: null,
				refetch: vi.fn(),
			});

			rerender(
				<GenericListView
					fetchData={mockFetchData}
					mapToListItem={mockMapToListItem}
				/>
			);

			expect(screen.getByText('No items found')).toBeInTheDocument();
		});
	});
});
