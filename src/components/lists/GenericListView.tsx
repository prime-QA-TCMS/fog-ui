import { Typography, Box, CircularProgress } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { AccordionList, AccordionItem } from './AccordionList';
import type { ListItemData } from './List';

/**
 * Props for GenericListView component
 */
export interface GenericListViewProps<T> {
	/**
	 * Function that fetches the data
	 * Should return a Promise that resolves to an array of items
	 * @example
	 * ```tsx
	 * const fetchUsers = async () => {
	 *   const response = await fetch('/api/users');
	 *   return response.json();
	 * };
	 * ```
	 */
	fetchData: () => Promise<T[]>;

	/**
	 * Optional function to filter data after fetching
	 * Useful for client-side filtering
	 * @example
	 * ```tsx
	 * const filterActive = (items: User[]) => items.filter(u => u.active);
	 * ```
	 */
	filterData?: (items: T[]) => T[];

	/**
	 * Function to map fetched data to list item format
	 * @example
	 * ```tsx
	 * const mapUser = (user: User): ListItemData => ({
	 *   id: user.id,
	 *   title: user.name,
	 *   icon: <PersonIcon />,
	 *   link: `/users/${user.id}`
	 * });
	 * ```
	 */
	mapToListItem: (item: T) => ListItemData | AccordionItem;

	/**
	 * Message to display when no items are found
	 * @default 'No items found'
	 */
	emptyMessage?: string;

	/**
	 * Message to display when an error occurs
	 * @default 'Failed to load data'
	 */
	errorMessage?: string;

	/**
	 * Custom list component to render the items
	 * Can be any component that accepts an 'items' prop
	 * @default AccordionList
	 * @example
	 * ```tsx
	 * import { GenericList } from 'fog-ui';
	 * <GenericListView
	 *   fetchData={fetchUsers}
	 *   mapToListItem={mapUser}
	 *   ListComponent={GenericList}
	 * />
	 * ```
	 */
	ListComponent?: React.ComponentType<{ items: any[] }>;

	/**
	 * Whether to fetch data immediately on mount
	 * @default true
	 */
	immediate?: boolean;
}

/**
 * Generic list view component that handles data fetching and rendering
 *
 * This component provides:
 * - Automatic data fetching with useApi hook
 * - Loading state display
 * - Error state display
 * - Empty state display
 * - Optional client-side filtering
 * - Flexible list component rendering
 *
 * @example
 * ```tsx
 * // Simple usage with default AccordionList
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const fetchUsers = async () => {
 *   const response = await fetch('/api/users');
 *   return response.json();
 * };
 *
 * const mapToListItem = (user: User): ListItemData => ({
 *   id: user.id,
 *   title: user.name,
 *   link: `/users/${user.id}`
 * });
 *
 * <GenericListView
 *   fetchData={fetchUsers}
 *   mapToListItem={mapToListItem}
 * />
 *
 * // With filtering
 * const filterActive = (users: User[]) => users.filter(u => u.isActive);
 *
 * <GenericListView
 *   fetchData={fetchUsers}
 *   filterData={filterActive}
 *   mapToListItem={mapToListItem}
 *   emptyMessage="No active users found"
 * />
 *
 * // With custom list component
 * import { GenericList } from 'fog-ui';
 *
 * <GenericListView
 *   fetchData={fetchUsers}
 *   mapToListItem={mapToListItem}
 *   ListComponent={GenericList}
 * />
 *
 * // With manual fetch control
 * <GenericListView
 *   fetchData={fetchUsers}
 *   mapToListItem={mapToListItem}
 *   immediate={false}
 * />
 * ```
 */
export function GenericListView<T>({
	fetchData,
	filterData,
	mapToListItem,
	emptyMessage = 'No items found',
	errorMessage = 'Failed to load data',
	ListComponent = AccordionList,
	immediate = true,
}: GenericListViewProps<T>) {
	const { data, loading, error } = useApi<T[]>(fetchData, [], immediate);

	// Show loading state
	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				padding={3}
				data-testid="loading-container"
				role="status"
				aria-live="polite"
				aria-busy="true"
			>
				<CircularProgress
					data-testid="loading-spinner"
					aria-label="Loading data"
				/>
			</Box>
		);
	}

	// Show error state
	if (error) {
		return (
			<Typography
				color="error"
				data-testid="error-message"
				role="alert"
				aria-live="polite"
			>
				{errorMessage}
			</Typography>
		);
	}

	// Show empty state
	if (!data || data.length === 0) {
		return (
			<Typography
				data-testid="empty-message"
				role="status"
				aria-live="polite"
			>
				{emptyMessage}
			</Typography>
		);
	}

	// Filter data if filter function provided
	const filteredData = filterData ? filterData(data) : data;

	// Show empty state after filtering
	if (filteredData.length === 0) {
		return (
			<Typography
				data-testid="empty-message"
				role="status"
				aria-live="polite"
			>
				{emptyMessage}
			</Typography>
		);
	}

	// Map data to list items
	const listItems = filteredData.map(mapToListItem);

	// Render list component
	return <ListComponent items={listItems} />;
}
