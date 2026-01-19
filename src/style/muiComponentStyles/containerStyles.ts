import { Theme } from '@mui/material';

export const pageContainer = (theme: Theme) => ({
	root: {
		display: 'flex',
		minHeight: '100vh',
		background: theme.palette.background.default,
	},
});

export const DrawerContainer = () => ({
	root: {
		width: 300,
		flexShrink: 0,
		'& .MuiDrawer-paper': {
			width: 300,
			boxSizing: 'border-box',
		},
	},
});

/**
 * Login container style
 * Centers content vertically and horizontally for login/authentication pages
 */
export const loginContainer = (theme: Theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		background: theme.palette.background.default,
	},
});

/**
 * Content container style
 * Standard content container with padding and scrolling for main content areas
 */
export const contentContainer = (theme: Theme) => ({
	root: {
		padding: theme.spacing(3),
		maxHeight: 'calc(100vh - 64px)',
		overflowY: 'auto' as const,
	},
});

/**
 * Wrap container style
 * Flexbox container that wraps items with consistent spacing
 */
export const wrapContainer = (theme: Theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap' as const,
		gap: theme.spacing(2),
	},
});

/**
 * Half screen container style
 * Grid layout that splits content into two equal columns
 */
export const halfScreenContainer = (theme: Theme) => ({
	root: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: theme.spacing(2),
		minHeight: '100vh',
	},
});
