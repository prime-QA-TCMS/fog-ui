import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { Topbar } from '../Topbar';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('Topbar - User Menu Integration', () => {
	const mockLogout = vi.fn();

	beforeEach(() => {
		mockLogout.mockClear();
	});

	test('renders user menu icon when userMenu prop is provided', () => {
		const userMenu = {
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		expect(screen.getByTestId('topbar-user-menu-button')).toBeInTheDocument();
	});

	test('does not render user menu when userMenu prop is not provided', () => {
		renderWithProviders(<Topbar pageTitle="Test Page" />);

		expect(screen.queryByTestId('topbar-user-menu-button')).not.toBeInTheDocument();
	});

	test('opens user menu when icon is clicked', async () => {
		const user = userEvent.setup();
		const userMenu = {
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.getByTestId('topbar-user-menu')).toBeInTheDocument();
	});

	test('displays Logout menu item always', async () => {
		const user = userEvent.setup();
		const userMenu = {
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.getByTestId('topbar-user-menu-logout')).toBeInTheDocument();
	});

	test('displays Profile menu item when profilePath is provided', async () => {
		const user = userEvent.setup();
		const userMenu = {
			profilePath: '/profile',
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.getByTestId('topbar-user-menu-profile')).toBeInTheDocument();
	});

	test('does not display Profile menu item when profilePath is not provided', async () => {
		const user = userEvent.setup();
		const userMenu = {
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.queryByTestId('topbar-user-menu-profile')).not.toBeInTheDocument();
	});

	test('displays My Account menu item when accountPath is provided', async () => {
		const user = userEvent.setup();
		const userMenu = {
			accountPath: '/account',
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.getByTestId('topbar-user-menu-account')).toBeInTheDocument();
	});

	test('displays both Profile and My Account items when both paths are provided', async () => {
		const user = userEvent.setup();
		const userMenu = {
			profilePath: '/profile',
			accountPath: '/account',
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.getByTestId('topbar-user-menu-profile')).toBeInTheDocument();
		expect(screen.getByTestId('topbar-user-menu-account')).toBeInTheDocument();
		expect(screen.getByTestId('topbar-user-menu-logout')).toBeInTheDocument();
	});

	test('calls onLogout when Logout menu item is clicked', async () => {
		const user = userEvent.setup();
		const userMenu = {
			onLogout: mockLogout,
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		const logoutButton = screen.getByTestId('topbar-user-menu-logout');
		await user.click(logoutButton);

		expect(mockLogout).toHaveBeenCalled();
	});

	test('closes menu after logout click', async () => {
		const user = userEvent.setup();
		const userMenu = {
			onLogout: vi.fn(),
		};

		renderWithProviders(<Topbar pageTitle="Test Page" userMenu={userMenu} />);

		const menuButton = screen.getByTestId('topbar-user-menu-button');
		await user.click(menuButton);

		expect(screen.getByTestId('topbar-user-menu')).toBeInTheDocument();

		const logoutButton = screen.getByTestId('topbar-user-menu-logout');
		await user.click(logoutButton);

		// Menu should close
		expect(screen.queryByTestId('topbar-user-menu')).not.toBeInTheDocument();
	});
});
