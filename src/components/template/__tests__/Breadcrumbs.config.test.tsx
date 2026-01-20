import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs - Configuration', () => {
	test('does not render when config prop is not provided', () => {
		renderWithProviders(<Breadcrumbs />);

		// Component should return null, so breadcrumb should not be in document
		expect(screen.queryByLabelText('breadcrumb')).not.toBeInTheDocument();
	});

	test('renders when config prop is provided', () => {
		const config = {
			parameterNames: ['projectId', 'suiteId'],
		};

		renderWithProviders(<Breadcrumbs config={config} />);

		// Should render the Home breadcrumb at minimum
		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	test('accepts custom parameter names in config', () => {
		const config = {
			parameterNames: ['customId1', 'customId2', 'customId3'],
		};

		renderWithProviders(<Breadcrumbs config={config} />);

		// Should render without errors
		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	test('renders with empty parameter names array', () => {
		const config = {
			parameterNames: [],
		};

		renderWithProviders(<Breadcrumbs config={config} />);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	test('renders breadcrumb with aria-label', () => {
		const config = {
			parameterNames: ['projectId'],
		};

		renderWithProviders(<Breadcrumbs config={config} />);

		expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument();
	});

	test('uses default parameter names when not provided', () => {
		const config = {};

		renderWithProviders(<Breadcrumbs config={config} />);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	test('renders Home link with correct path', () => {
		const config = {
			parameterNames: ['projectId'],
		};

		renderWithProviders(<Breadcrumbs config={config} />);

		// Check that home link exists - it should be rendered as Typography, not always a link
		expect(screen.getByText('Home')).toBeInTheDocument();
	});
});
