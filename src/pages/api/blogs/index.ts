import type { APIRoute } from 'astro';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';
import fs from 'node:fs/promises';
import path from 'node:path';

// Define the content directory
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check authentication
    const session = getSessionFromCookie(request);
    if (!session || !isLoggedIn(session)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), { status: 401 });
    }

    // Parse the request body
    const blogData = await request.json();
    
    // Validate required fields
    if (!blogData.title || !blogData.slug || !blogData.excerpt) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: title, slug, and excerpt are required'
      }), { status: 400 });
    }

    // Parse tags from JSON string back to array if needed
    let tags = [];
    if (typeof blogData.tags === 'string') {
      try {
        tags = JSON.parse(blogData.tags);
      } catch (e) {
        // If parsing fails, assume it's a comma-separated string
        tags = blogData.tags.split(',').map((tag: string) => tag.trim());
      }
    } else {
      tags = blogData.tags || [];
    }

    // Current date for publishing
    const publishDate = blogData.publishDate || new Date().toISOString();

    // Create the content
    const content = `---
title: ${blogData.title}
publishDate: ${publishDate}
excerpt: ${blogData.excerpt}
tags: ${JSON.stringify(tags)}
---

${blogData.content || ''}`;

    // Ensure the blogs directory exists
    const blogsDir = path.join(CONTENT_DIR, 'blog');
    await fs.mkdir(blogsDir, { recursive: true });

    // Write to file
    await fs.writeFile(
      path.join(blogsDir, `${blogData.slug}.md`),
      content,
      'utf-8'
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Blog post saved successfully',
      slug: blogData.slug
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error saving blog post:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while saving the blog post'
    }), { status: 500 });
  }
};

// Handle GET requests to fetch all blogs
export const GET: APIRoute = async ({ request }) => {
  try {
    // Check authentication
    const session = getSessionFromCookie(request);
    if (!session || !isLoggedIn(session)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), { status: 401 });
    }

    const blogsDir = path.join(CONTENT_DIR, 'blog');
    
    // Ensure the directory exists
    try {
      await fs.access(blogsDir);
    } catch {
      await fs.mkdir(blogsDir, { recursive: true });
      return new Response(JSON.stringify({
        success: true,
        blogs: []
      }), { status: 200 });
    }
    
    // Get all blog files
    const files = await fs.readdir(blogsDir);
    const blogs = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(blogsDir, file), 'utf-8');
        const slug = file.replace('.md', '');
        
        // Extract frontmatter
        const frontmatter = content.split('---')[1];
        const blogInfo = frontmatter.split('\n')
          .filter(line => line.trim() !== '')
          .reduce((acc: any, line) => {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            
            if (key && value) {
              if (key.trim() === 'tags') {
                try {
                  acc[key.trim()] = JSON.parse(value);
                } catch (e) {
                  acc[key.trim()] = [];
                }
              } else {
                acc[key.trim()] = value;
              }
            }
            return acc;
          }, {});
        
        blogs.push({
          slug,
          title: blogInfo.title || 'Untitled',
          publishDate: blogInfo.publishDate || '',
          excerpt: blogInfo.excerpt || '',
          tags: blogInfo.tags || []
        });
      }
    }
    
    // Sort by publish date (newest first)
    blogs.sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
    
    return new Response(JSON.stringify({
      success: true,
      blogs
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while fetching blogs'
    }), { status: 500 });
  }
};
