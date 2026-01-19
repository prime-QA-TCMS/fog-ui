import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "SharedUI",
			formats: ["es", "cjs"],
			fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
		},
		rollupOptions: {
			// Externalize all peer dependencies so they are not bundled into the library
			external: [
				/^react($|\/)/,
				/^react-dom($|\/)/,
				/^react-router-dom($|\/)/,
				/^@emotion\/react($|\/)/,
				/^@emotion\/styled($|\/)/,
				/^@mui\/icons-material($|\/)/,
				/^@mui\/material($|\/)/,
				/^@mui\/system($|\/)/,
				/^@reduxjs\/toolkit($|\/)/,
				/^axios($|\/)/,
				/^i18next($|\/)/,
				/^react-hook-form($|\/)/,
				/^react-i18next($|\/)/,
				/^react-redux($|\/)/,
				/^recharts($|\/)/,
				/^redux($|\/)/,
				/^zod($|\/)/,
			],
			output: {
				exports: "named",
			},
		},
		sourcemap: true,
		emptyOutDir: false,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: 'src/setupTests.ts',
		include: ['src/**/*.test.{ts,tsx}'],
		threads: true,
		maxThreads: 8,
		minThreads: 1,
	}
});
