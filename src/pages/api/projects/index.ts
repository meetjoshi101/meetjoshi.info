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

// GET all projects
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
    const projects = await getProjects();
    
    return new Response(
      JSON.stringify({ success: true, projects }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting projects:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get projects' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST create new project
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
    const projectData = await request.json();
    const projects = await getProjects();
    
    // Check if slug is already used
    const slugExists = projects.some(project => project.slug === projectData.slug);
    if (slugExists) {
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
    
    // Add timestamp
    const now = new Date().toISOString();
    const newProject = {
      ...projectData,
      createdAt: now,
      updatedAt: now
    };
    
    // Convert featured to boolean if it's a string
    if (typeof newProject.featured === 'string') {
      newProject.featured = newProject.featured === 'true';
    }
    
    // Add to projects and save
    projects.push(newProject);
    await saveProjects(projects);
    
    return new Response(
      JSON.stringify({ success: true, project: newProject }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to create project' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
