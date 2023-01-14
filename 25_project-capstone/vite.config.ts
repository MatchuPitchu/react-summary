/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svgr(), tsconfigPaths(), react()],
	optimizeDeps: {
		exclude: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore']
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: 'src/tests/setupTests.ts'
	}
});
