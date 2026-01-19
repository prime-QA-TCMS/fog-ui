import React from 'react';
import { Box, Typography, Paper, Stack, Card, CardContent, Container } from '@mui/material';
import { pageContainer, DrawerContainer, loginContainer, contentContainer, wrapContainer, halfScreenContainer, pageTitle, sectionTitle, bodyText, captionText } from 'fog-ui';

export function StyleUtilitiesDemo() {
	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Style Utilities
			</Typography>

			<Paper sx={{ p: 3 }}>
				<Stack spacing={4}>
					<Typography variant="body2" color="textSecondary">
						Fog UI provides reusable style utilities for common layout and typography patterns.
					</Typography>

					{/* Container Styles Section */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Container Styles
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Pre-configured MUI sx styles for common container layouts:
						</Typography>

						<Stack spacing={2}>
							{/* pageContainer */}
							<Card sx={{ border: '1px dashed #ccc' }}>
								<CardContent>
									<Typography variant="subtitle2" gutterBottom>
										pageContainer
									</Typography>
									<Box sx={{ ...pageContainer, bgcolor: 'primary.light', height: 100 }}>
										<Typography variant="caption" sx={{ color: 'primary.dark' }}>
											Full-page container with standard padding and margins
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
										Use for: Main page wrapper
									</Typography>
								</CardContent>
							</Card>

							{/* contentContainer */}
							<Card sx={{ border: '1px dashed #ccc' }}>
								<CardContent>
									<Typography variant="subtitle2" gutterBottom>
										contentContainer
									</Typography>
									<Box sx={{ ...contentContainer, bgcolor: 'info.light', height: 100 }}>
										<Typography variant="caption" sx={{ color: 'info.dark' }}>
											Content wrapper with consistent padding
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
										Use for: Main content areas
									</Typography>
								</CardContent>
							</Card>

							{/* DrawerContainer */}
							<Card sx={{ border: '1px dashed #ccc' }}>
								<CardContent>
									<Typography variant="subtitle2" gutterBottom>
										DrawerContainer
									</Typography>
									<Box sx={{ ...DrawerContainer, bgcolor: 'success.light', height: 100 }}>
										<Typography variant="caption" sx={{ color: 'success.dark' }}>
											Sidebar drawer with fixed width
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
										Use for: Sidebar navigation
									</Typography>
								</CardContent>
							</Card>

							{/* loginContainer */}
							<Card sx={{ border: '1px dashed #ccc' }}>
								<CardContent>
									<Typography variant="subtitle2" gutterBottom>
										loginContainer
									</Typography>
									<Box sx={{ ...loginContainer, bgcolor: 'warning.light', height: 100 }}>
										<Typography variant="caption" sx={{ color: 'warning.dark' }}>
											Centered login form container
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
										Use for: Auth/login pages
									</Typography>
								</CardContent>
							</Card>

							{/* wrapContainer */}
							<Card sx={{ border: '1px dashed #ccc' }}>
								<CardContent>
									<Typography variant="subtitle2" gutterBottom>
										wrapContainer
									</Typography>
									<Box sx={{ ...wrapContainer, bgcolor: 'secondary.light', height: 100 }}>
										<Typography variant="caption" sx={{ color: 'secondary.dark' }}>
											Flexible wrapper with responsive padding
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
										Use for: Flexible content wrapping
									</Typography>
								</CardContent>
							</Card>

							{/* halfScreenContainer */}
							<Card sx={{ border: '1px dashed #ccc' }}>
								<CardContent>
									<Typography variant="subtitle2" gutterBottom>
										halfScreenContainer
									</Typography>
									<Box sx={{ ...halfScreenContainer, bgcolor: 'error.light', height: 100 }}>
										<Typography variant="caption" sx={{ color: 'error.dark' }}>
											Half-width container for split layouts
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
										Use for: Side-by-side layouts
									</Typography>
								</CardContent>
							</Card>
						</Stack>
					</Box>

					{/* Typography Styles Section */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Typography Styles
						</Typography>
						<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
							Pre-configured sx styles for consistent typography:
						</Typography>

						<Stack spacing={2}>
							{/* pageTitle */}
							<Card>
								<CardContent>
									<Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
										pageTitle
									</Typography>
									<Typography sx={{ ...pageTitle }}>
										Page Title - Large heading for main page titles
									</Typography>
									<Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
										Use for: Main page headings
									</Typography>
								</CardContent>
							</Card>

							{/* sectionTitle */}
							<Card>
								<CardContent>
									<Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
										sectionTitle
									</Typography>
									<Typography sx={{ ...sectionTitle }}>
										Section Title - Medium heading for section grouping
									</Typography>
									<Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
										Use for: Section headings within pages
									</Typography>
								</CardContent>
							</Card>

							{/* bodyText */}
							<Card>
								<CardContent>
									<Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
										bodyText
									</Typography>
									<Typography sx={{ ...bodyText }}>
										Body Text - Standard paragraph text with consistent styling and line height for readability.
									</Typography>
									<Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
										Use for: Main content paragraphs
									</Typography>
								</CardContent>
							</Card>

							{/* captionText */}
							<Card>
								<CardContent>
									<Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
										captionText
									</Typography>
									<Typography sx={{ ...captionText }}>
										Caption Text - Small text for captions, helper text, and secondary information.
									</Typography>
									<Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
										Use for: Helper text, labels, and secondary information
									</Typography>
								</CardContent>
							</Card>
						</Stack>
					</Box>

					{/* Code Examples */}
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Usage Examples
							</Typography>

							<Stack spacing={2}>
								<Box>
									<Typography variant="subtitle2" gutterBottom>
										Container Style Example:
									</Typography>
									<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block', bgcolor: 'grey.50', p: 1.5, borderRadius: 1 }}>
										{`import { pageContainer, contentContainer } from 'fog-ui';

function Page() {
  return (
    <Box sx={pageContainer}>
      <Box sx={contentContainer}>
        Your content here
      </Box>
    </Box>
  );
}`}
									</Typography>
								</Box>

								<Box>
									<Typography variant="subtitle2" gutterBottom>
										Typography Style Example:
									</Typography>
									<Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', display: 'block', bgcolor: 'grey.50', p: 1.5, borderRadius: 1 }}>
										{`import { pageTitle, bodyText } from 'fog-ui';

function Page() {
  return (
    <>
      <Typography sx={pageTitle}>My Page</Typography>
      <Typography sx={bodyText}>
        Page description and content...
      </Typography>
    </>
  );
}`}
									</Typography>
								</Box>
							</Stack>
						</CardContent>
					</Card>

					{/* Features */}
					<Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
						<Typography variant="subtitle2" gutterBottom>
							Style Utility Benefits:
						</Typography>
						<Typography component="ul" variant="body2" sx={{ pl: 2 }}>
							<li>Consistent spacing and padding across components</li>
							<li>Responsive breakpoints built-in</li>
							<li>Typography maintains visual hierarchy</li>
							<li>Reduces code duplication</li>
							<li>Easy to maintain and update globally</li>
							<li>Works with MUI's sx prop system</li>
						</Typography>
					</Box>
				</Stack>
			</Paper>
		</Box>
	);
}
