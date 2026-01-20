import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

import { Topbar } from '../Topbar';

test('Topbar renders page title', () => {
	renderWithProviders(<Topbar pageTitle="Hello" />);
	expect(screen.getByText('Hello')).toBeInTheDocument();
});

test('Topbar renders menu items when provided', async () => {
	const menu = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Settings', path: '/settings' },
	];

	renderWithProviders(<Topbar pageTitle="Hello" menu={menu} />);
	expect(screen.getByTestId('topbar-menu-/dashboard')).toBeInTheDocument();
	expect(screen.getByTestId('topbar-menu-/settings')).toBeInTheDocument();
});

test('Topbar renders user menu when provided', async () => {
	const userMenu = {
		profilePath: '/profile',
		accountPath: '/account',
		onLogout: vi.fn(),
	};

	renderWithProviders(<Topbar pageTitle="Hello" userMenu={userMenu} />);
	expect(screen.getByTestId('topbar-user-menu-button')).toBeInTheDocument();
});
