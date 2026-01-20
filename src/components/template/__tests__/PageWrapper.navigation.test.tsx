import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

import { PageWrapper } from '../PageWrapper';

test('PageWrapper updates title on menu click and calls navigate', async () => {
	const menuItems = { main: [{ label: 'Goto', path: '/goto' }] };
	renderWithProviders(
		<PageWrapper menuItems={menuItems}>
			<div>Child</div>
		</PageWrapper>
	);

	expect(screen.getByText('FOG-UI LOGO')).toBeInTheDocument();
	const item = screen.getByText('Goto');
	await userEvent.click(item);
	expect(navigateMock).toHaveBeenCalledWith('/goto');
	// pageTitle should be stored in localStorage by handleNavigation
	expect(localStorage.getItem('pageTitle')).toBe('Goto');
});
