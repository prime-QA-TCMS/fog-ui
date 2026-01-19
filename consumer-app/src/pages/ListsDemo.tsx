import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { List, CircularProgressList, AccordionList } from 'fog-ui';

interface ListItem {
	id: string;
	title: string;
	icon?: React.ReactNode;
	link?: string;
}

interface ProgressItem {
	id: number;
	value: number;
	title: string;
}

interface AccordionItem {
	id: string;
	title: string;
	percentage: number | null;
	component: React.ReactNode;
}

const sampleItems: ListItem[] = [
	{ id: '1', title: 'First Item' },
	{ id: '2', title: 'Second Item' },
	{ id: '3', title: 'Third Item' },
	{ id: '4', title: 'Fourth Item' },
	{ id: '5', title: 'Fifth Item' },
];

const sampleProgressItems: ProgressItem[] = [
	{ id: 1, title: 'Task 1', value: 75 },
	{ id: 2, title: 'Task 2', value: 50 },
	{ id: 3, title: 'Task 3', value: 90 },
	{ id: 4, title: 'Task 4', value: 30 },
	{ id: 5, title: 'Task 5', value: 60 },
];

const sampleAccordionItems: AccordionItem[] = [
	{
		id: '1',
		title: 'Section 1',
		percentage: 75,
		component: <Typography variant="body2">Details for section 1</Typography>,
	},
	{
		id: '2',
		title: 'Section 2',
		percentage: 50,
		component: <Typography variant="body2">Details for section 2</Typography>,
	},
	{
		id: '3',
		title: 'Section 3',
		percentage: 90,
		component: <Typography variant="body2">Details for section 3</Typography>,
	},
	{
		id: '4',
		title: 'Section 4',
		percentage: null,
		component: <Typography variant="body2">Details for section 4</Typography>,
	},
	{
		id: '5',
		title: 'Section 5',
		percentage: 60,
		component: <Typography variant="body2">Details for section 5</Typography>,
	},
];

export function ListsDemo() {
	const [loading, setLoading] = useState(false);

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				List Components
			</Typography>
			<Stack spacing={3}>
				<Paper sx={{ p: 3 }}>
					<Stack spacing={2}>
						<Typography variant="h6">Standard List</Typography>
						<Typography variant="body2" color="textSecondary">
							Basic list component for displaying items
						</Typography>
						<List items={sampleItems} />
					</Stack>
				</Paper>

				<Paper sx={{ p: 3 }}>
					<Stack spacing={2}>
						<Typography variant="h6">Circular Progress List</Typography>
						<Typography variant="body2" color="textSecondary">
							List with loading state and circular progress
						</Typography>
						<Button
							variant="outlined"
							onClick={() => setLoading(!loading)}
							sx={{ alignSelf: 'flex-start' }}
						>
							{loading ? 'Hide Loading' : 'Show Loading'}
						</Button>
						<CircularProgressList
							items={loading ? [] : sampleProgressItems}
						/>
					</Stack>
				</Paper>

				<Paper sx={{ p: 3 }}>
					<Stack spacing={2}>
						<Typography variant="h6">Accordion List</Typography>
						<Typography variant="body2" color="textSecondary">
							Expandable accordion-style list
						</Typography>
						<AccordionList items={sampleAccordionItems} />
					</Stack>
				</Paper>
			</Stack>
		</Box>
	);
}
