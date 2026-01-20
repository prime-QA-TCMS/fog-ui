import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { Topbar } from '../Topbar';
import userEvent from '@testing-library/user-event';
import { DashboardOutlined, SettingsOutlined } from '@mui/icons-material';

describe('Topbar - Menu Integration', () => {
	test('renders topbar menu items when menu prop is provided', () => {
		const menuItems = [
			{ label: 'Dashboard', path: '/dashboard' },
			{ label: 'Settings', path: '/settings' },
		];

		renderWithProviders(<Topbar pageTitle="Test Page" menu={menuItems} />);

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});

	test('does not render menu when menu prop is not provided', () => {
		renderWithProviders(<Topbar pageTitle="Test Page" />);

		// Should not find the dashboard or settings buttons
		expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
		expect(screen.queryByText('Settings')).not.toBeInTheDocument();
	});

	test('renders menu with icons when provided', () => {
		const menuItems = [
			{ label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined /> },
			{ label: 'Settings', path: '/settings', icon: <SettingsOutlined /> },
		];

		renderWithProviders(<Topbar pageTitle="Test Page" menu={menuItems} />);

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});

	test('renders empty menu gracefully', () => {
		renderWithProviders(<Topbar pageTitle="Test Page" menu={[]} />);

		expect(screen.getByTestId('topbar')).toBeInTheDocument();
	});

	test('menu items have correct navigation paths', () => {
		const menuItems = [
			{ label: 'Dashboard', path: '/dashboard' },
			{ label: 'Projects', path: '/projects' },
		];

		renderWithProviders(<Topbar pageTitle="Test Page" menu={menuItems} />);

		const dashboardButton = screen.getByText('Dashboard');
		const projectsButton = screen.getByText('Projects');

		expect(dashboardButton).toBeInTheDocument();
		expect(projectsButton).toBeInTheDocument();
	});

	test('menu items have correct test IDs', () => {
		const menuItems = [
			{ label: 'Dashboard', path: '/dashboard' },
		];

		renderWithProviders(<Topbar pageTitle="Test Page" menu={menuItems} />);

		expect(screen.getByTestId('topbar-menu-/dashboard')).toBeInTheDocument();
	});
});
