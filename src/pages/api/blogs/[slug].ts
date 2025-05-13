import type { APIRoute } from 'astro';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';
import fs from 'node:fs/promises';
import path from 'node:path';

// Define the content directory
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Check authentication
    const session = getSessionFromCookie(request);
    if (!session || !isLoggedIn(session)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), { status: 401 });
    }

    const { slug } = params;
    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Blog slug is required'
      }), { status: 400 });
    }

    // Path to blog file
    const blogPath = path.join(CONTENT_DIR, 'blog', `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(blogPath);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Blog post not found'
      }), { status: 404 });
    }

    // Read and parse the file
    const content = await fs.readFile(blogPath, 'utf-8');
    const [frontmatter, markdown] = content.split('---', 3).filter(Boolean);

    // Parse frontmatter
    const blog = frontmatter.split('\n')
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

    // Add content and slug
    blog.content = markdown.trim();
    blog.slug = slug;

    return new Response(JSON.stringify({
      success: true,
      blog
    }), { status: 200 });

  } catch (error) {
    console.error('Error fetching blog details:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while fetching blog details'
    }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // Check authentication
    const session = getSessionFromCookie(request);
    if (!session || !isLoggedIn(session)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), { status: 401 });
    }

    const { slug } = params;
    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Blog slug is required'
      }), { status: 400 });
    }

    // Parse the request body
    const blogData = await request.json();
    
    // Validate required fields
    if (!blogData.title || !blogData.excerpt) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: title and excerpt are required'
      }), { status: 400 });
    }
    
    // Parse tags from JSON string back to array if needed
    let tags = [];
    if (typeof blogData.tags === 'string') {
      try {
        tags = JSON.parse(blogData.tags);
      } catch (e) {
        tags = blogData.tags.split(',').map((tag: string) => tag.trim());
      }
    } else {
      tags = blogData.tags || [];
    }
    
    // Get publish date from existing or use current date
    const publishDate = blogData.publishDate || new Date().toISOString();
    
    // Create the content
    const content = `---
title: ${blogData.title}
publishDate: ${publishDate}
excerpt: ${blogData.excerpt}
tags: ${JSON.stringify(tags)}
---

${blogData.content || ''}`;

    // Path to blog file
    const blogPath = path.join(CONTENT_DIR, 'blog', `${blogData.slug}.md`);
    
    // Write to file
    await fs.writeFile(blogPath, content, 'utf-8');
    
    // If slug has changed, delete the old file
    if (slug !== blogData.slug) {
      const oldPath = path.join(CONTENT_DIR, 'blog', `${slug}.md`);
      try {
        await fs.unlink(oldPath);
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Blog post updated successfully',
      slug: blogData.slug
    }), { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while updating the blog post'
    }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // Check authentication
    const session = getSessionFromCookie(request);
    if (!session || !isLoggedIn(session)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), { status: 401 });
    }

    const { slug } = params;
    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Blog slug is required'
      }), { status: 400 });
    }

    // Path to blog file
    const blogPath = path.join(CONTENT_DIR, 'blog', `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(blogPath);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Blog post not found'
      }), { status: 404 });
    }

    // Delete the file
    await fs.unlink(blogPath);

    return new Response(JSON.stringify({
      success: true,
      message: 'Blog post deleted successfully'
    }), { status: 200 });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while deleting the blog post'
    }), { status: 500 });
  }
};
