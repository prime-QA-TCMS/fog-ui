import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { Popup } from 'fog-ui';

export function PopupDemo() {
	const [open, setOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Popup/Modal Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Reusable modal/dialog component for various use cases
					</Typography>

					<Stack direction="row" spacing={2} flexWrap="wrap">
						<Button variant="contained" onClick={() => setOpen(true)}>
							Open Simple Popup
						</Button>
						<Button variant="contained" color="warning" onClick={() => setConfirmOpen(true)}>
							Open Confirmation Popup
						</Button>
						<Button variant="contained" color="secondary" onClick={() => setFormOpen(true)}>
							Open Form Popup
						</Button>
					</Stack>

					{/* Simple Popup */}
					<Popup
						open={open}
						onClose={() => setOpen(false)}
						title="Information"
						component={
							<Box sx={{ p: 2 }}>
								<Typography variant="body1" gutterBottom>
									This is a simple popup dialog with informational content.
								</Typography>
								<Typography variant="body2" color="textSecondary">
									You can display any content you want inside the popup. Click outside or press
									ESC to close.
								</Typography>
							</Box>
						}
					/>

					{/* Confirmation Popup */}
					<Popup
						open={confirmOpen}
						onClose={() => setConfirmOpen(false)}
						title="Confirm Action"
						component={
							<Box sx={{ p: 2 }}>
								<Typography variant="body1" gutterBottom>
									Are you sure you want to proceed with this action?
								</Typography>
								<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
									<Button
										variant="contained"
										color="error"
										onClick={() => setConfirmOpen(false)}
										fullWidth
									>
										Yes, Proceed
									</Button>
									<Button
										variant="outlined"
										onClick={() => setConfirmOpen(false)}
										fullWidth
									>
										Cancel
									</Button>
								</Stack>
							</Box>
						}
					>
					/>

						{/* Form Popup */}
						<Popup
							open={formOpen}
							onClose={() => setFormOpen(false)}
							title="Enter Details"
							component={
								<Box sx={{ p: 2 }}>
									<Stack spacing={2}>
										<Typography variant="body2" color="textSecondary">
											Popups can contain forms and interactive content
										</Typography>
										<Box
											component="form"
											onSubmit={(e) => {
												e.preventDefault();
												setFormOpen(false);
											}}
										>
											<Stack spacing={2}>
												<input
													type="text"
													placeholder="Enter your name"
													style={{
														padding: '10px',
														border: '1px solid #ccc',
														borderRadius: '4px',
														fontSize: '14px',
													}}
												/>
												<input
													type="email"
													placeholder="Enter your email"
													style={{
														padding: '10px',
														border: '1px solid #ccc',
														borderRadius: '4px',
														fontSize: '14px',
													}}
												/>
												<Button type="submit" variant="contained" fullWidth>
													Submit
												</Button>
											</Stack>
										</Box>
									</Stack>
								</Box>
							}
						/>
				</Stack>
			</Paper>
		</Box>
	);
}
