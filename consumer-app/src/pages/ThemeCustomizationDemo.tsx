import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Stack, TextField, Button, Alert, Card, CardContent } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createFogTheme } from 'fog-ui';

export function ThemeCustomizationDemo() {
	const [primaryColor, setPrimaryColor] = useState('#1976D2');
	const [secondaryColor, setSecondaryColor] = useState('#9c27b0');
	const [fontFamily, setFontFamily] = useState('Inter');
	const [mode, setMode] = useState<'light' | 'dark'>('light');

	const customTheme = useMemo(
		() =>
			createFogTheme({
				palette: {
					mode: mode,
					primary: { main: primaryColor },
					secondary: { main: secondaryColor },
				},
				typography: {
					fontFamily: fontFamily,
				},
			}),
		[primaryColor, secondaryColor, fontFamily, mode]
	);

	const fontOptions = ['Inter', 'Roboto', 'Helvetica', 'Georgia', 'Courier New'];

	return (
		<ThemeProvider theme={customTheme}>
			<Box>
				<Typography variant="h4" gutterBottom>
					Theme Customization
				</Typography>

				<Paper sx={{ p: 3 }}>
					<Stack spacing={3}>
						<Typography variant="body2" color="textSecondary">
							Customize the Fog UI theme with different palettes, colors, and typography settings.
						</Typography>

						{/* Theme Controls */}
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Theme Configuration
								</Typography>

								<Stack spacing={2}>
									<TextField
										fullWidth
										label="Primary Color"
										type="color"
										value={primaryColor}
										onChange={(e) => setPrimaryColor(e.target.value)}
										InputLabelProps={{ shrink: true }}
										variant="outlined"
									/>

									<TextField
										fullWidth
										label="Secondary Color"
										type="color"
										value={secondaryColor}
										onChange={(e) => setSecondaryColor(e.target.value)}
										InputLabelProps={{ shrink: true }}
										variant="outlined"
									/>

									<TextField
										select
										fullWidth
										label="Font Family"
										value={fontFamily}
										onChange={(e) => setFontFamily(e.target.value)}
										variant="outlined"
									>
										{fontOptions.map((font) => (
											<option key={font} value={font}>
												{font}
											</option>
										))}
									</TextField>

									<TextField
										select
										fullWidth
										label="Theme Mode"
										value={mode}
										onChange={(e) => setMode(e.target.value as 'light' | 'dark')}
										variant="outlined"
									>
										<option value="light">Light</option>
										<option value="dark">Dark</option>
									</TextField>

									<Button
										variant="contained"
										fullWidth
										onClick={() => {
											setPrimaryColor('#1976D2');
											setSecondaryColor('#9c27b0');
											setFontFamily('Inter');
											setMode('light');
										}}
									>
										Reset to Defaults
									</Button>
								</Stack>
							</CardContent>
						</Card>

						{/* Preview */}
						<Card sx={{ bgcolor: 'background.default' }}>
							<CardContent>
								<Typography variant="h6" gutterBottom color="primary">
									Theme Preview
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Typography variant="h5" color="primary">
											Primary Color: {primaryColor}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											Used for main interactive elements
										</Typography>
									</Box>

									<Box>
										<Typography variant="h5" color="secondary">
											Secondary Color: {secondaryColor}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											Used for supplementary interactive elements
										</Typography>
									</Box>

									<Box>
										<Typography variant="body1">
											Font Family: {fontFamily}
										</Typography>
										<Typography variant="caption" color="textSecondary">
											Applied to all typography
										</Typography>
									</Box>

									<Box>
										<Typography variant="body1">
											Theme Mode: {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
										</Typography>
										<Typography variant="caption" color="textSecondary">
											Changes background and text colors for visibility
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>

						{/* Code Example */}
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Code Example
								</Typography>
								<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block' }}>
									{`import { createFogTheme } from 'fog-ui';
import { ThemeProvider } from '@mui/material/styles';

const customTheme = createFogTheme({
  palette: {
    mode: 'dark',
    primary: { main: '${primaryColor}' },
    secondary: { main: '${secondaryColor}' },
  },
  typography: {
    fontFamily: '${fontFamily}',
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}`}
								</Typography>
							</CardContent>
						</Card>

						{/* Features */}
						<Alert severity="info">
							<Typography variant="subtitle2" gutterBottom>
								Theme Customization Features:
							</Typography>
							<Typography component="ul" variant="body2" sx={{ pl: 2 }}>
								<li>Custom primary and secondary colors</li>
								<li>Font family configuration</li>
								<li>Light and dark mode support</li>
								<li>Palette mode automatically adjusts text contrast</li>
								<li>MUI ThemeProvider integration</li>
								<li>All components automatically use theme colors</li>
							</Typography>
						</Alert>
					</Stack>
				</Paper>
			</Box>
		</ThemeProvider>
	);
}
