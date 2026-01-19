import { describe, it, expect } from 'vitest';
import { createTheme } from '@mui/material';
import {
	pageContainer,
	DrawerContainer,
	loginContainer,
	contentContainer,
	wrapContainer,
	halfScreenContainer,
} from '../containerStyles';

describe('containerStyles', () => {
	const theme = createTheme();

	describe('pageContainer', () => {
		it('returns style object with root property', () => {
			const styles = pageContainer(theme);
			expect(styles).toHaveProperty('root');
		});

		it('applies flex display', () => {
			const styles = pageContainer(theme);
			expect(styles.root.display).toBe('flex');
		});

		it('applies minHeight 100vh', () => {
			const styles = pageContainer(theme);
			expect(styles.root.minHeight).toBe('100vh');
		});

		it('applies theme background color', () => {
			const styles = pageContainer(theme);
			expect(styles.root.background).toBe(theme.palette.background.default);
		});

		it('uses theme from parameter', () => {
			const customTheme = createTheme({
				palette: {
					background: {
						default: '#custom-color',
					},
				},
			});
			const styles = pageContainer(customTheme);
			expect(styles.root.background).toBe('#custom-color');
		});
	});

	describe('DrawerContainer', () => {
		it('returns style object with root property', () => {
			const styles = DrawerContainer();
			expect(styles).toHaveProperty('root');
		});

		it('applies fixed width', () => {
			const styles = DrawerContainer();
			expect(styles.root.width).toBe(300);
		});

		it('applies flexShrink 0', () => {
			const styles = DrawerContainer();
			expect(styles.root.flexShrink).toBe(0);
		});

		it('applies MuiDrawer-paper styles', () => {
			const styles = DrawerContainer();
			expect(styles.root['& .MuiDrawer-paper']).toBeDefined();
			expect(styles.root['& .MuiDrawer-paper'].width).toBe(300);
			expect(styles.root['& .MuiDrawer-paper'].boxSizing).toBe('border-box');
		});
	});

	describe('loginContainer', () => {
		it('returns style object with root property', () => {
			const styles = loginContainer(theme);
			expect(styles).toHaveProperty('root');
		});

		it('applies flex display', () => {
			const styles = loginContainer(theme);
			expect(styles.root.display).toBe('flex');
		});

		it('centers content horizontally', () => {
			const styles = loginContainer(theme);
			expect(styles.root.justifyContent).toBe('center');
		});

		it('centers content vertically', () => {
			const styles = loginContainer(theme);
			expect(styles.root.alignItems).toBe('center');
		});

		it('applies minHeight 100vh', () => {
			const styles = loginContainer(theme);
			expect(styles.root.minHeight).toBe('100vh');
		});

		it('applies theme background color', () => {
			const styles = loginContainer(theme);
			expect(styles.root.background).toBe(theme.palette.background.default);
		});

		it('uses theme from parameter', () => {
			const customTheme = createTheme({
				palette: {
					background: {
						default: '#login-bg',
					},
				},
			});
			const styles = loginContainer(customTheme);
			expect(styles.root.background).toBe('#login-bg');
		});
	});

	describe('contentContainer', () => {
		it('returns style object with root property', () => {
			const styles = contentContainer(theme);
			expect(styles).toHaveProperty('root');
		});

		it('applies padding from theme', () => {
			const styles = contentContainer(theme);
			expect(styles.root.padding).toBeDefined();
			expect(typeof styles.root.padding).toBe('string');
		});

		it('applies maxHeight with calc', () => {
			const styles = contentContainer(theme);
			expect(styles.root.maxHeight).toBe('calc(100vh - 64px)');
		});

		it('applies overflowY auto', () => {
			const styles = contentContainer(theme);
			expect(styles.root.overflowY).toBe('auto');
		});

		it('uses theme spacing from parameter', () => {
			const customTheme = createTheme({
				spacing: 10,
			});
			const styles = contentContainer(customTheme);
			expect(styles.root.padding).toBeDefined();
			expect(typeof styles.root.padding).toBe('string');
		});
	});

	describe('wrapContainer', () => {
		it('returns style object with root property', () => {
			const styles = wrapContainer(theme);
			expect(styles).toHaveProperty('root');
		});

		it('applies flex display', () => {
			const styles = wrapContainer(theme);
			expect(styles.root.display).toBe('flex');
		});

		it('applies flexWrap wrap', () => {
			const styles = wrapContainer(theme);
			expect(styles.root.flexWrap).toBe('wrap');
		});

		it('applies gap from theme', () => {
			const styles = wrapContainer(theme);
			expect(styles.root.gap).toBeDefined();
			expect(typeof styles.root.gap).toBe('string');
		});

		it('uses theme spacing from parameter', () => {
			const customTheme = createTheme({
				spacing: 10,
			});
			const styles = wrapContainer(customTheme);
			expect(styles.root.gap).toBeDefined();
			expect(typeof styles.root.gap).toBe('string');
		});
	});

	describe('halfScreenContainer', () => {
		it('returns style object with root property', () => {
			const styles = halfScreenContainer(theme);
			expect(styles).toHaveProperty('root');
		});

		it('applies grid display', () => {
			const styles = halfScreenContainer(theme);
			expect(styles.root.display).toBe('grid');
		});

		it('applies two equal columns', () => {
			const styles = halfScreenContainer(theme);
			expect(styles.root.gridTemplateColumns).toBe('1fr 1fr');
		});

		it('applies gap from theme', () => {
			const styles = halfScreenContainer(theme);
			expect(styles.root.gap).toBeDefined();
			expect(typeof styles.root.gap).toBe('string');
		});

		it('applies minHeight 100vh', () => {
			const styles = halfScreenContainer(theme);
			expect(styles.root.minHeight).toBe('100vh');
		});

		it('uses theme spacing from parameter', () => {
			const customTheme = createTheme({
				spacing: 10,
			});
			const styles = halfScreenContainer(customTheme);
			expect(styles.root.gap).toBeDefined();
			expect(typeof styles.root.gap).toBe('string');
		});
	});

	describe('Style consistency', () => {
		it('all theme-based styles accept Theme parameter', () => {
			// Should not throw errors
			expect(() => pageContainer(theme)).not.toThrow();
			expect(() => loginContainer(theme)).not.toThrow();
			expect(() => contentContainer(theme)).not.toThrow();
			expect(() => wrapContainer(theme)).not.toThrow();
			expect(() => halfScreenContainer(theme)).not.toThrow();
		});

		it('DrawerContainer works without theme parameter', () => {
			expect(() => DrawerContainer()).not.toThrow();
		});

		it('all styles return objects with root property', () => {
			const styles = [
				pageContainer(theme),
				DrawerContainer(),
				loginContainer(theme),
				contentContainer(theme),
				wrapContainer(theme),
				halfScreenContainer(theme),
			];

			styles.forEach((style) => {
				expect(style).toHaveProperty('root');
				expect(typeof style.root).toBe('object');
			});
		});

		it('theme-dependent styles use theme values', () => {
			const customTheme = createTheme({
				spacing: 10,
				palette: {
					background: {
						default: '#custom',
					},
				},
			});

			const pageStyles = pageContainer(customTheme);
			const loginStyles = loginContainer(customTheme);
			const contentStyles = contentContainer(customTheme);
			const wrapStyles = wrapContainer(customTheme);
			const halfScreenStyles = halfScreenContainer(customTheme);

			// Check background uses custom theme
			expect(pageStyles.root.background).toBe('#custom');
			expect(loginStyles.root.background).toBe('#custom');

			// Check spacing values are defined and are strings
			expect(contentStyles.root.padding).toBeDefined();
			expect(typeof contentStyles.root.padding).toBe('string');
			expect(wrapStyles.root.gap).toBeDefined();
			expect(typeof wrapStyles.root.gap).toBe('string');
			expect(halfScreenStyles.root.gap).toBeDefined();
			expect(typeof halfScreenStyles.root.gap).toBe('string');
		});
	});

	describe('Edge cases', () => {
		it('handles default MUI theme', () => {
			const defaultTheme = createTheme();

			expect(() => pageContainer(defaultTheme)).not.toThrow();
			expect(() => loginContainer(defaultTheme)).not.toThrow();
			expect(() => contentContainer(defaultTheme)).not.toThrow();
			expect(() => wrapContainer(defaultTheme)).not.toThrow();
			expect(() => halfScreenContainer(defaultTheme)).not.toThrow();
		});

		it('handles custom theme with different spacing', () => {
			const customTheme = createTheme({ spacing: 4 });

			const contentStyles = contentContainer(customTheme);
			expect(contentStyles.root.padding).toBeDefined();
			expect(typeof contentStyles.root.padding).toBe('string');

			const wrapStyles = wrapContainer(customTheme);
			expect(wrapStyles.root.gap).toBeDefined();
			expect(typeof wrapStyles.root.gap).toBe('string');
		});

		it('handles custom theme with different background', () => {
			const customTheme = createTheme({
				palette: {
					mode: 'dark',
					background: {
						default: '#1a1a1a',
					},
				},
			});

			const pageStyles = pageContainer(customTheme);
			expect(pageStyles.root.background).toBe('#1a1a1a');

			const loginStyles = loginContainer(customTheme);
			expect(loginStyles.root.background).toBe('#1a1a1a');
		});
	});

	describe('Type safety', () => {
		it('returns proper style object structure', () => {
			const pageStyles = pageContainer(theme);
			const drawerStyles = DrawerContainer();
			const loginStyles = loginContainer(theme);
			const contentStyles = contentContainer(theme);
			const wrapStyles = wrapContainer(theme);
			const halfScreenStyles = halfScreenContainer(theme);

			// All should have root property with object value
			expect(typeof pageStyles.root).toBe('object');
			expect(typeof drawerStyles.root).toBe('object');
			expect(typeof loginStyles.root).toBe('object');
			expect(typeof contentStyles.root).toBe('object');
			expect(typeof wrapStyles.root).toBe('object');
			expect(typeof halfScreenStyles.root).toBe('object');
		});
	});
});
