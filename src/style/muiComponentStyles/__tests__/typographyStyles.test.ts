import { describe, it, expect } from 'vitest';
import { createTheme, Theme } from '@mui/material/styles';
import {
	pageTitle,
	sectionTitle,
	bodyText,
	captionText,
} from '../typographyStyles';

describe('typographyStyles', () => {
	let theme: Theme;

	beforeEach(() => {
		theme = createTheme({
			palette: {
				text: {
					primary: '#333333',
					secondary: '#666666',
				},
			},
			spacing: (factor: number) => `${8 * factor}px`,
		});
	});

	describe('pageTitle', () => {
		it('returns correct style object', () => {
			const result = pageTitle(theme);

			expect(result).toHaveProperty('root');
			expect(result.root).toEqual({
				fontSize: '2rem',
				fontWeight: 600,
				color: '#333333',
				marginBottom: '16px',
			});
		});

		it('uses theme text primary color', () => {
			const customTheme = createTheme({
				palette: {
					text: {
						primary: '#000000',
					},
				},
			});

			const result = pageTitle(customTheme);
			expect(result.root.color).toBe('#000000');
		});

		it('uses theme spacing function', () => {
			const customTheme = createTheme({
				spacing: (factor: number) => `${10 * factor}px`,
			});

			const result = pageTitle(customTheme);
			expect(result.root.marginBottom).toBe('20px');
		});
	});

	describe('sectionTitle', () => {
		it('returns correct style object', () => {
			const result = sectionTitle(theme);

			expect(result).toHaveProperty('root');
			expect(result.root).toEqual({
				fontSize: '1.5rem',
				fontWeight: 500,
				color: '#333333',
				marginBottom: '12px',
			});
		});

		it('has smaller font size than pageTitle', () => {
			const pageTitleResult = pageTitle(theme);
			const sectionTitleResult = sectionTitle(theme);

			expect(sectionTitleResult.root.fontSize).toBe('1.5rem');
			expect(pageTitleResult.root.fontSize).toBe('2rem');
		});

		it('has lighter font weight than pageTitle', () => {
			const pageTitleResult = pageTitle(theme);
			const sectionTitleResult = sectionTitle(theme);

			expect(sectionTitleResult.root.fontWeight).toBe(500);
			expect(pageTitleResult.root.fontWeight).toBe(600);
		});

		it('uses theme text primary color', () => {
			const customTheme = createTheme({
				palette: {
					text: {
						primary: '#111111',
					},
				},
			});

			const result = sectionTitle(customTheme);
			expect(result.root.color).toBe('#111111');
		});
	});

	describe('bodyText', () => {
		it('returns correct style object', () => {
			const result = bodyText(theme);

			expect(result).toHaveProperty('root');
			expect(result.root).toEqual({
				fontSize: '1rem',
				color: '#333333',
			});
		});

		it('uses theme text primary color', () => {
			const customTheme = createTheme({
				palette: {
					text: {
						primary: '#222222',
					},
				},
			});

			const result = bodyText(customTheme);
			expect(result.root.color).toBe('#222222');
		});

		it('has no margin', () => {
			const result = bodyText(theme);
			expect(result.root).not.toHaveProperty('marginBottom');
		});
	});

	describe('captionText', () => {
		it('returns correct style object', () => {
			const result = captionText(theme);

			expect(result).toHaveProperty('root');
			expect(result.root).toEqual({
				fontSize: '0.875rem',
				color: '#666666',
			});
		});

		it('uses theme text secondary color', () => {
			const customTheme = createTheme({
				palette: {
					text: {
						secondary: '#999999',
					},
				},
			});

			const result = captionText(customTheme);
			expect(result.root.color).toBe('#999999');
		});

		it('has smaller font size than bodyText', () => {
			const bodyTextResult = bodyText(theme);
			const captionTextResult = captionText(theme);

			expect(captionTextResult.root.fontSize).toBe('0.875rem');
			expect(bodyTextResult.root.fontSize).toBe('1rem');
		});

		it('has no margin', () => {
			const result = captionText(theme);
			expect(result.root).not.toHaveProperty('marginBottom');
		});
	});

	describe('Integration Tests', () => {
		it('all typography styles work with same theme', () => {
			const page = pageTitle(theme);
			const section = sectionTitle(theme);
			const body = bodyText(theme);
			const caption = captionText(theme);

			expect(page.root).toBeDefined();
			expect(section.root).toBeDefined();
			expect(body.root).toBeDefined();
			expect(caption.root).toBeDefined();
		});

		it('maintains consistent color hierarchy', () => {
			const page = pageTitle(theme);
			const section = sectionTitle(theme);
			const body = bodyText(theme);
			const caption = captionText(theme);

			// Page, section, and body use primary text
			expect(page.root.color).toBe(theme.palette.text.primary);
			expect(section.root.color).toBe(theme.palette.text.primary);
			expect(body.root.color).toBe(theme.palette.text.primary);

			// Caption uses secondary text
			expect(caption.root.color).toBe(theme.palette.text.secondary);
		});

		it('maintains descending font size hierarchy', () => {
			const page = pageTitle(theme);
			const section = sectionTitle(theme);
			const body = bodyText(theme);
			const caption = captionText(theme);

			// Font sizes should decrease: pageTitle > sectionTitle > bodyText > captionText
			const pageFontSize = parseFloat(page.root.fontSize);
			const sectionFontSize = parseFloat(section.root.fontSize);
			const bodyFontSize = parseFloat(body.root.fontSize);
			const captionFontSize = parseFloat(caption.root.fontSize);

			expect(pageFontSize).toBeGreaterThan(sectionFontSize);
			expect(sectionFontSize).toBeGreaterThan(bodyFontSize);
			expect(bodyFontSize).toBeGreaterThan(captionFontSize);
		});
	});
});
