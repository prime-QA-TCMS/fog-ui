import { createTheme, ThemeOptions } from '@mui/material/styles';

export function createFogTheme(options?: ThemeOptions) {
	const mode = options?.palette?.mode || 'light';

	const base: ThemeOptions = {
		palette: {
			primary: { main: '#1976D2' },
			secondary: { main: '#9c27b0' },
			mode: mode,
			...(mode === 'dark' && {
				background: { default: '#121212', paper: '#1e1e1e' },
				text: { primary: '#ffffff', secondary: '#b0b0b0' },
			}),
			...(mode === 'light' && {
				background: { default: '#fafafa', paper: '#ffffff' },
				text: { primary: '#000000', secondary: '#666666' },
			}),
		},
		typography: {
			fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
		},
	};

	return createTheme({ ...base, ...(options || {}) });
}
