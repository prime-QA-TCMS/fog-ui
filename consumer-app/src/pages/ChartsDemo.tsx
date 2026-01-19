import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { TrendAnalyticsChart, GenericPieChart } from 'fog-ui';

export function ChartsDemo() {
	const trendChartData = {
		title: 'Monthly Performance Trend',
		xAxisKey: 'date',
		data: [
			{ date: '2024-01', revenue: 120, users: 80 },
			{ date: '2024-02', revenue: 150, users: 110 },
			{ date: '2024-03', revenue: 180, users: 140 },
			{ date: '2024-04', revenue: 165, users: 130 },
			{ date: '2024-05', revenue: 195, users: 160 },
			{ date: '2024-06', revenue: 220, users: 180 },
		],
		series: [
			{ dataKey: 'revenue', name: 'Revenue', color: '#8884d8' },
			{ dataKey: 'users', name: 'Users', color: '#82ca9d' },
		],
		metrics: [],
	};

	const pieChartData1 = [
		{ status: 'Category A', count: 400, color: '#8884d8' },
		{ status: 'Category B', count: 300, color: '#82ca9d' },
		{ status: 'Category C', count: 200, color: '#ffc658' },
		{ status: 'Category D', count: 100, color: '#ff8042' },
	];

	const pieChartData2 = [
		{ status: 'Product 1', count: 250, color: '#0088FE' },
		{ status: 'Product 2', count: 200, color: '#00C49F' },
		{ status: 'Product 3', count: 150, color: '#FFBB28' },
		{ status: 'Product 4', count: 180, color: '#FF8042' },
		{ status: 'Product 5', count: 120, color: '#8884D8' },
	];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Chart Components
			</Typography>

			<Stack spacing={4}>
				{/* Trend Analytics Chart */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Trend Analytics Chart
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
						Line chart for displaying trends over time
					</Typography>
					<TrendAnalyticsChart chartData={trendChartData} />
				</Paper>

				{/* Pie Charts */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Generic Pie Charts
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
						Pie charts for displaying proportional data
					</Typography>
					<Stack spacing={4}>
						<Box sx={{ minHeight: 300 }}>
							<GenericPieChart
								title="Distribution by Category"
								data={pieChartData1}
								onRefresh={() => console.log('Refresh chart')}
								onExportCsv={() => console.log('Export CSV')}
							/>
						</Box>
						<Box sx={{ minHeight: 300 }}>
							<GenericPieChart
								title="Product Sales"
								data={pieChartData2}
								onRefresh={() => console.log('Refresh chart')}
								onExportCsv={() => console.log('Export CSV')}
							/>
						</Box>
					</Stack>
				</Paper>
			</Stack>
		</Box>
	);
}
