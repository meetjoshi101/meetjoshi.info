import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';

// In a real app, this would be a database
// For this example, we'll store blogs in a JSON file
const BLOGS_FILE = path.join(process.cwd(), 'src/data/blogs.json');

// Helper function to read blogs from file
async function getBlogs() {
  try {
    const data = await fs.readFile(BLOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(BLOGS_FILE, '[]');
    return [];
  }
}

// Helper function to write blogs to file
async function saveBlogs(blogs) {
  await fs.writeFile(BLOGS_FILE, JSON.stringify(blogs, null, 2));
}

export const GET: APIRoute = async ({ params, request }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { slug } = params;
    const blogs = await getBlogs();
    
    // Find blog by slug
    const blog = blogs.find(b => b.slug === slug);
    
    if (!blog) {
      return new Response(
        JSON.stringify({ success: false, message: 'Blog post not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, blog }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting blog:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { slug } = params;
    const blogData = await request.json();
    const blogs = await getBlogs();
    
    // Find blog by slug
    const blogIndex = blogs.findIndex(b => b.slug === slug);
    
    if (blogIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: 'Blog post not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if new slug is already used by another blog
    if (blogData.slug !== slug && blogs.some(b => b.slug === blogData.slug)) {
      return new Response(
        JSON.stringify({ success: false, message: 'A blog post with this slug already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update blog
    const updatedBlog = {
      ...blogs[blogIndex],
      ...blogData,
      updatedAt: new Date().toISOString()
    };
    
    blogs[blogIndex] = updatedBlog;
    await saveBlogs(blogs);
    
    return new Response(
      JSON.stringify({ success: true, blog: updatedBlog }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating blog:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { slug } = params;
    const blogs = await getBlogs();
    
    // Find blog by slug
    const blogIndex = blogs.findIndex(b => b.slug === slug);
    
    if (blogIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: 'Blog post not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Remove blog
    blogs.splice(blogIndex, 1);
    await saveBlogs(blogs);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Blog post deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to delete blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
