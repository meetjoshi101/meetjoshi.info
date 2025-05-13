// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://meetjoshi.info',
  prefetch: true,
  output: 'server', // Enable server-side rendering for all pages
  integrations: [],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});