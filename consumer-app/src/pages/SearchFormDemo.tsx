import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Alert } from '@mui/material';
import { SearchForm } from 'fog-ui';

export function SearchFormDemo() {
	const [searchResults, setSearchResults] = useState<any>(null);
	const [submitted, setSubmitted] = useState(false);

	const searchFields = [
		{
			name: 'productName',
			label: 'Product Name',
			type: 'text',
			validation: { required: false },
		},
		{
			name: 'category',
			label: 'Category',
			type: 'select',
			options: [
				{ label: 'Electronics', value: 'electronics' },
				{ label: 'Clothing', value: 'clothing' },
				{ label: 'Books', value: 'books' },
				{ label: 'Food', value: 'food' },
			],
			validation: { required: false },
		},
		{
			name: 'minPrice',
			label: 'Min Price',
			type: 'number',
			validation: { required: false },
		},
		{
			name: 'maxPrice',
			label: 'Max Price',
			type: 'number',
			validation: { required: false },
		},
		{
			name: 'inStock',
			label: 'In Stock Only',
			type: 'checkbox',
			validation: { required: false },
		},
	];

	const handleSearch = (formData: Record<string, any>) => {
		setSearchResults(formData);
		setSubmitted(true);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				SearchForm Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Collapsible search form wrapped in an accordion. Click the header to expand/collapse search criteria.
					</Typography>

					<SearchForm
						title="Product Search"
						data={searchFields}
						handleFormSubmit={handleSearch}
					/>

					{submitted && searchResults && (
						<Alert severity="success" onClose={() => setSubmitted(false)}>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Search Criteria:
							</Typography>
							<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
								{JSON.stringify(searchResults, null, 2)}
							</Typography>
						</Alert>
					)}

					<Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<Typography variant="subtitle2" gutterBottom>
							Features:
						</Typography>
						<Typography variant="body2" component="ul" sx={{ pl: 2 }}>
							<li>Collapsible accordion for search form</li>
							<li>Multiple form field types (text, select, number, checkbox)</li>
							<li>Flexible validation configuration</li>
							<li>Compact interface for filtering large datasets</li>
						</Typography>
					</Box>
				</Stack>
			</Paper>
		</Box>
	);
}
