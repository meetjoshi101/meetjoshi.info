// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://meetjoshi.info',
  base: 'meetjoshi.info'
  prefetch: true,
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