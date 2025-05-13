import type { APIRoute } from 'astro';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';
import fs from 'node:fs/promises';
import path from 'node:path';

// Define the Project interface
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string[];
  image?: string;
  github?: string;
  liveUrl?: string;
  publishDate: string;
  featured?: boolean;
  [key: string]: any; // Allow additional properties
}

// Define the content directory
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

// Define the projects file path
const PROJECTS_FILE = path.join(CONTENT_DIR, 'projects.json');

// Helper function to read projects from file
async function getProjects(): Promise<Project[]> {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(PROJECTS_FILE, '[]');
    return [];
  }
}

// Helper function to write projects to file
async function saveProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// Handle GET requests to fetch all projects
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

    // This endpoint should return all projects
    // For now, we'll just return an empty success response
    return new Response(JSON.stringify({
      success: true,
      projects: []
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while fetching projects'
    }), { status: 500 });
  }
};

// POST create new project
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
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.title || !projectData.slug || !projectData.description) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: title, slug, and description are required'
      }), { status: 400 });
    }

    // Parse tags from JSON string back to array if needed
    let tags = [];
    if (typeof projectData.tags === 'string') {
      try {
        tags = JSON.parse(projectData.tags);
      } catch (e) {
        // If parsing fails, assume it's a comma-separated string
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
        // If parsing fails, assume it's a comma-separated string
        technologies = projectData.technologies.split(',').map((tech: string) => tech.trim());
      }
    } else {
      technologies = projectData.technologies || ["default-technology"];
    }

    // Convert featured string to boolean
    const featured = projectData.featured === 'true' || projectData.featured === true;

    // Current date for publishing
    const publishDate = new Date().toISOString();

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

    // Ensure the projects directory exists
    const projectsDir = path.join(CONTENT_DIR, 'projects');
    await fs.mkdir(projectsDir, { recursive: true });

    // Write to file
    await fs.writeFile(
      path.join(projectsDir, `${projectData.slug}.md`),
      content,
      'utf-8'
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Project saved successfully',
      slug: projectData.slug
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error saving project:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error occurred while saving the project'
    }), { status: 500 });
  }
};
