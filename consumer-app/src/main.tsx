import React, { useState, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { PageWrapper, ToastProvider, createFogTheme } from 'fog-ui'
import { Container, Box, Typography, Tabs, Tab, Paper, ThemeProvider, IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import {
	ToastDemo,
	DataTableDemo,
	ErrorBoundaryDemo,
	FormDemo,
	ContainerStylesDemo,
	TabsDemo,
	ListsDemo,
	ChartsDemo,
	CardsDemo,
	PopupDemo,
	NestedTableDemo,
	NavigationDemo,
	ApiIntegrationsDemo,
	SearchFormDemo,
	TemplateComponentsDemo,
	ProtectedRouteDemo,
	ThemeCustomizationDemo,
	StyleUtilitiesDemo,
} from './pages'

interface MenuItem {
	label: string
	path: string
	component: React.ReactNode
}

const demoPages: MenuItem[] = [
	{ label: 'Toast', path: '/', component: <ToastDemo /> },
	{ label: 'DataTable', path: '/datatable', component: <DataTableDemo /> },
	{ label: 'Nested Table', path: '/nested-table', component: <NestedTableDemo /> },
	{ label: 'Forms', path: '/forms', component: <FormDemo /> },
	{ label: 'Search Form', path: '/search-form', component: <SearchFormDemo /> },
	{ label: 'Error Boundary', path: '/error-boundary', component: <ErrorBoundaryDemo /> },
	{ label: 'Container Styles', path: '/container-styles', component: <ContainerStylesDemo /> },
	{ label: 'Tabs', path: '/tabs', component: <TabsDemo /> },
	{ label: 'Lists', path: '/lists', component: <ListsDemo /> },
	{ label: 'Charts', path: '/charts', component: <ChartsDemo /> },
	{ label: 'Cards', path: '/cards', component: <CardsDemo /> },
	{ label: 'Popup', path: '/popup', component: <PopupDemo /> },
	{ label: 'Navigation', path: '/navigation', component: <NavigationDemo /> },
	{ label: 'API Integration', path: '/api', component: <ApiIntegrationsDemo /> },
	{ label: 'Template Components', path: '/template', component: <TemplateComponentsDemo /> },
	{ label: 'Protected Route', path: '/protected-route', component: <ProtectedRouteDemo /> },
	{ label: 'Theme Customization', path: '/theme', component: <ThemeCustomizationDemo /> },
	{ label: 'Style Utilities', path: '/styles', component: <StyleUtilitiesDemo /> },
]

function AppContent({ isDark, setIsDark }: { isDark: boolean; setIsDark: (dark: boolean) => void }) {
	const navigate = useNavigate()
	const currentPath = window.location.hash.slice(1) || '/'
	const tabValue = demoPages.findIndex((page) => page.path === currentPath) || 0

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		navigate(demoPages[newValue].path)
	}

	return (
		<PageWrapper menuItems={{}}>
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Box sx={{ mb: 4 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
						<Box>
							<Typography variant="h3" component="h1" gutterBottom>
								Fog UI Component Showcase
							</Typography>
							<Typography variant="body1" color="textSecondary" gutterBottom>
								Comprehensive demo of all Fog UI components and features
							</Typography>
						</Box>
						<IconButton
							color="inherit"
							onClick={() => setIsDark(!isDark)}
							aria-label="toggle theme"
						>
							{isDark ? <Brightness7 /> : <Brightness4 />}
						</IconButton>
					</Box>
				</Box>

				<Paper sx={{ mb: 4 }}>
					<Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
						{demoPages.map((page) => (
							<Tab key={page.path} label={page.label} />
						))}
					</Tabs>
				</Paper>

				<Box sx={{ mb: 4 }}>
					<Routes>
						{demoPages.map((page) => (
							<Route key={page.path} path={page.path} element={page.component} />
						))}
					</Routes>
				</Box>
			</Container>
		</PageWrapper>
	)
}

function App() {
	const [isDark, setIsDark] = useState(false)

	const theme = useMemo(
		() =>
			createFogTheme({
				palette: {
					mode: isDark ? 'dark' : 'light',
				},
			}),
		[isDark]
	)

	return (
		<ThemeProvider theme={theme}>
			<HashRouter>
				<ToastProvider>
					<AppContent isDark={isDark} setIsDark={setIsDark} />
				</ToastProvider>
			</HashRouter>
		</ThemeProvider>
	)
}

createRoot(document.getElementById('root')!).render(<App />)
