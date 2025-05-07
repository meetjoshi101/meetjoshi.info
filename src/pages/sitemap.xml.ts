import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

// Define priority for different page types
const priorityMap = {
  '/': '1.0',
  '/projects': '0.8',
  '/blogs': '0.8',
  '/projects/': '0.7',
  '/blogs/': '0.7',
};

export const GET: APIRoute = async ({ site }) => {
  // Make sure we have a URL
  if (!site) {
    throw new Error('Missing site configuration in astro.config.mjs');
  }

  const baseUrl = site.toString();
  const now = formatDate(new Date());

  // Get all content collections
  const projects = await getCollection('projects');
  const blogs = await getCollection('blogs');

  // Build static pages
  const staticPages = [
    {
      url: baseUrl,
      lastmod: now,
      changefreq: 'weekly',
      priority: priorityMap['/'] || '0.5',
    },
    {
      url: `${baseUrl.replace(/\/?$/, '/')}${'projects'}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: priorityMap['/projects'] || '0.5',
    },
    {
      url: `${baseUrl.replace(/\/?$/, '/')}/blogs`,
      lastmod: now,
      changefreq: 'weekly',
      priority: priorityMap['/blogs'] || '0.5',
    },
  ];

  // Build project pages
  const projectPages = projects.map((project) => {
    const url = `${baseUrl.replace(/\/?$/, '/')}${'projects/'}${project.slug}`;
    const lastmod = project.data.publishDate ? formatDate(project.data.publishDate) : now;
    return {
      url,
      lastmod,
      changefreq: 'monthly',
      priority: priorityMap['/projects/'] || '0.6',
    };
  });

  // Build blog pages
  const blogPages = blogs.map((blog) => {
    const url = `${baseUrl.replace(/\/?$/, '/')}${'blogs/'}${blog.slug}`;
    const lastmod = blog.data.publishDate ? formatDate(blog.data.publishDate) : now;
    return {
      url,
      lastmod,
      changefreq: 'monthly',
      priority: priorityMap['/blogs/'] || '0.6',
    };
  });

  // Combine all pages
  const allPages = [...staticPages, ...projectPages, ...blogPages];

  // Build XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${allPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};