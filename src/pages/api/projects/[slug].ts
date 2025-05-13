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
        message: 'Project slug is required'
      }), { status: 400 });
    }

    // Path to project file
    const projectPath = path.join(CONTENT_DIR, 'projects', `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(projectPath);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Project not found'
      }), { status: 404 });
    }

    // Read and parse the file
    const content = await fs.readFile(projectPath, 'utf-8');
    const [frontmatter, markdown] = content.split('---', 3).filter(Boolean);

    // Parse frontmatter
    const project = frontmatter.split('\n')
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
          } else if (key.trim() === 'featured') {
            acc[key.trim()] = value === 'true';
          } else {
            acc[key.trim()] = value;
          }
        }
        return acc;
      }, {});

    // Add content and slug
    project.content = markdown.trim();
    project.slug = slug;

    return new Response(JSON.stringify({
      success: true,
      project
    }), { status: 200 });

  } catch (error) {
    console.error('Error fetching project details:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while fetching project details'
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
        message: 'Project slug is required'
      }), { status: 400 });
    }

    // Parse the request body
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.title || !projectData.description) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: title and description are required'
      }), { status: 400 });
    }
    
    // Parse tags from JSON string back to array if needed
    let tags = [];
    if (typeof projectData.tags === 'string') {
      try {
        tags = JSON.parse(projectData.tags);
      } catch (e) {
        tags = projectData.tags.split(',').map((tag: string) => tag.trim());
      }
    } else {
      tags = projectData.tags || [];
    }
    
    // Parse technologies from JSON string back to array if needed
    let technologies = [];
    if (typeof projectData.technologies === 'string') {
      try {
        technologies = JSON.parse(projectData.technologies);
      } catch (e) {
        technologies = projectData.technologies.split(',').map((tech: string) => tech.trim());
      }
    } else {
      technologies = projectData.technologies || ["default-technology"];
    }
    
    // Convert featured string to boolean
    const featured = projectData.featured === 'true' || projectData.featured === true;
    
    // Get publish date from existing or use current date
    const publishDate = projectData.publishDate || new Date().toISOString();
    
    // Create the content
    const content = `---
title: ${projectData.title}
description: ${projectData.description}
publishDate: ${publishDate}
thumbnail: ${projectData.thumbnail || ''}
demoUrl: ${projectData.demoUrl || ''}
repoUrl: ${projectData.repoUrl || ''}
tags: ${JSON.stringify(tags)}
technologies: ${JSON.stringify(technologies)}
featured: ${featured}
---

${projectData.content || ''}`;

    // Path to project file
    const projectPath = path.join(CONTENT_DIR, 'projects', `${projectData.slug}.md`);
    
    // Write to file
    await fs.writeFile(projectPath, content, 'utf-8');
    
    // If slug has changed, delete the old file
    if (slug !== projectData.slug) {
      const oldPath = path.join(CONTENT_DIR, 'projects', `${slug}.md`);
      try {
        await fs.unlink(oldPath);
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Project updated successfully',
      slug: projectData.slug
    }), { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while updating the project'
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
        message: 'Project slug is required'
      }), { status: 400 });
    }

    // Path to project file
    const projectPath = path.join(CONTENT_DIR, 'projects', `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(projectPath);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Project not found'
      }), { status: 404 });
    }

    // Delete the file
    await fs.unlink(projectPath);

    return new Response(JSON.stringify({
      success: true,
      message: 'Project deleted successfully'
    }), { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while deleting the project'
    }), { status: 500 });
  }
};
