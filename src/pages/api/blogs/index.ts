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

// GET all blog posts
export const GET: APIRoute = async ({ request }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const blogs = await getBlogs();
    
    return new Response(
      JSON.stringify({ success: true, blogs }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting blogs:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get blogs' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST create new blog post
export const POST: APIRoute = async ({ request }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const blogData = await request.json();
    const blogs = await getBlogs();
    
    // Check if slug is already used
    const slugExists = blogs.some(blog => blog.slug === blogData.slug);
    if (slugExists) {
      return new Response(
        JSON.stringify({ success: false, message: 'A blog post with this slug already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Add timestamp
    const now = new Date().toISOString();
    const newBlog = {
      ...blogData,
      createdAt: now,
      updatedAt: now
    };
    
    // Add to blogs and save
    blogs.push(newBlog);
    await saveBlogs(blogs);
    
    return new Response(
      JSON.stringify({ success: true, blog: newBlog }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to create blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
