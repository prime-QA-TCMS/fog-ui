import { Theme } from '@mui/material/styles';

/**
 * Typography style for main page titles
 * @param theme - MUI theme object
 * @returns Style object for page title typography
 * @example
 * ```tsx
 * <Typography sx={pageTitle(theme).root}>
 *   Dashboard Overview
 * </Typography>
 * ```
 */
export const pageTitle = (theme: Theme) => ({
	root: {
		fontSize: '2rem',
		fontWeight: 600,
		color: theme.palette.text.primary,
		marginBottom: theme.spacing(2),
	},
});

/**
 * Typography style for section headings within a page
 * @param theme - MUI theme object
 * @returns Style object for section title typography
 * @example
 * ```tsx
 * <Typography sx={sectionTitle(theme).root}>
 *   User Statistics
 * </Typography>
 * ```
 */
export const sectionTitle = (theme: Theme) => ({
	root: {
		fontSize: '1.5rem',
		fontWeight: 500,
		color: theme.palette.text.primary,
		marginBottom: theme.spacing(1.5),
	},
});

/**
 * Typography style for standard body text
 * @param theme - MUI theme object
 * @returns Style object for body text typography
 * @example
 * ```tsx
 * <Typography sx={bodyText(theme).root}>
 *   This is the main content of the page.
 * </Typography>
 * ```
 */
export const bodyText = (theme: Theme) => ({
	root: {
		fontSize: '1rem',
		color: theme.palette.text.primary,
	},
});

/**
 * Typography style for caption/helper text
 * @param theme - MUI theme object
 * @returns Style object for caption text typography
 * @example
 * ```tsx
 * <Typography sx={captionText(theme).root}>
 *   Last updated: 2 hours ago
 * </Typography>
 * ```
 */
export const captionText = (theme: Theme) => ({
	root: {
		fontSize: '0.875rem',
		color: theme.palette.text.secondary,
	},
});
