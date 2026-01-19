import React, { useState } from 'react';
import {
	Box,
	Typography,
	Paper,
	TextField,
	Button,
	Stack,
	Select,
	MenuItem,
	FormControl,
	FormLabel,
} from '@mui/material';
import { Form } from 'fog-ui';

interface FormData {
	username: string;
	email: string;
	password: string;
	role: string;
}

export function FormDemo() {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		username: '',
		email: '',
		password: '',
		role: 'user',
	});

	const fields = [
		{
			name: 'username',
			label: 'Username',
			type: 'text',
			validation: { required: 'Username is required' },
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			validation: { required: 'Email is required', pattern: { value: /\S+@\S+/, message: 'Invalid email' } },
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			validation: { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } },
		},
	];

	const handleSubmit = (data: any) => {
		setFormData(data);
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Form Component
			</Typography>
			<Paper sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant="body2" color="textSecondary">
						Reusable form component with built-in validation
					</Typography>

					<Form onSubmit={handleSubmit} fields={fields as any} />

					{submitted && (
						<Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
							<Typography variant="subtitle2" gutterBottom>
								Form Submitted Successfully!
							</Typography>
							<Typography variant="body2" component="pre">
								{JSON.stringify(formData, null, 2)}
							</Typography>
						</Paper>
					)}
				</Stack>
			</Paper>
		</Box>
	);
}
