import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
	plugins: [react()],
	resolve: {
		dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
		alias: {
			'react': resolve(__dirname, './node_modules/react'),
			'react-dom': resolve(__dirname, './node_modules/react-dom'),
		}
	},
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
		exclude: ['fog-ui']
	}
})
