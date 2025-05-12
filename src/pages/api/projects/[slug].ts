import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';

// In a real app, this would be a database
// For this example, we'll store projects in a JSON file
const PROJECTS_FILE = path.join(process.cwd(), 'src/data/projects.json');

// Helper function to read projects from file
async function getProjects() {
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
async function saveProjects(projects) {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
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
    const projects = await getProjects();
    
    // Find project by slug
    const project = projects.find(p => p.slug === slug);
    
    if (!project) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, project }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting project:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get project' }),
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
    const projectData = await request.json();
    const projects = await getProjects();
    
    // Find project by slug
    const projectIndex = projects.findIndex(p => p.slug === slug);
    
    if (projectIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if new slug is already used by another project
    if (projectData.slug !== slug && projects.some(p => p.slug === projectData.slug)) {
      return new Response(
        JSON.stringify({ success: false, message: 'A project with this slug already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse tags if they are a string
    if (typeof projectData.tags === 'string') {
      try {
        projectData.tags = JSON.parse(projectData.tags);
      } catch (error) {
        projectData.tags = [];
      }
    }
    
    // Convert featured to boolean if it's a string
    if (typeof projectData.featured === 'string') {
      projectData.featured = projectData.featured === 'true';
    }
    
    // Update project
    const updatedProject = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    projects[projectIndex] = updatedProject;
    await saveProjects(projects);
    
    return new Response(
      JSON.stringify({ success: true, project: updatedProject }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update project' }),
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
    const projects = await getProjects();
    
    // Find project by slug
    const projectIndex = projects.findIndex(p => p.slug === slug);
    
    if (projectIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: 'Project not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Remove project
    projects.splice(projectIndex, 1);
    await saveProjects(projects);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Project deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to delete project' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
