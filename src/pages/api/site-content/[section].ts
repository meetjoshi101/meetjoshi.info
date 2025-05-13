import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';

// In a real app, this would be a database
// For this example, we'll store site content in a JSON file
const SITE_CONTENT_FILE = path.join(process.cwd(), 'src/data/site-content.json');

// Helper function to read site content from file
async function getSiteContent(): Promise<SiteContent> {
  try {
    const data = await fs.readFile(SITE_CONTENT_FILE, 'utf-8');
    return JSON.parse(data) as SiteContent;
  } catch (error) {
    // If file doesn't exist, create it with empty object
    const defaultContent = {
      hero: {
        title: "Hi, I'm Meet Joshi",
        content: "# Hi, I'm Meet Joshi\n\nA passionate web developer focused on building modern and efficient web applications.",
        metadata: {
          subtitle: "Web Developer & Designer",
          ctaText: "View My Work",
          ctaUrl: "#projects"
        }
      },
      about: {
        title: "About Me",
        content: "# About Me\n\nI'm a web developer with expertise in modern JavaScript frameworks and libraries.",
        metadata: {
          image: "/about.jpg"
        }
      },
      skills: {
        title: "Skills & Expertise",
        content: "# Skills & Expertise\n\nHere are some of the technologies I work with regularly.",
        metadata: {
          skillGroups: []
        }
      },
      contact: {
        title: "Let's Connect",
        content: "# Let's Connect\n\nHave a project in mind? Reach out to me.",
        metadata: {
          email: "contact@example.com",
          linkedIn: "",
          github: ""
        }
      }
    };
    await fs.writeFile(SITE_CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
    return defaultContent;
  }
}

// Define the SiteContent interface
interface SiteContentSection {
  title: string;
  content: string;
  metadata: Record<string, any>;
  updatedAt?: string;
}

interface SiteContent {
  [key: string]: SiteContentSection;
}

// Helper function to write site content to file
async function saveSiteContent(content: SiteContent): Promise<void> {
  await fs.writeFile(SITE_CONTENT_FILE, JSON.stringify(content, null, 2));
}

// GET all site content or specific section
export const GET: APIRoute = async ({ request, params }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { section } = params;
    const siteContent = await getSiteContent();
    
    if (section) {
      // Return specific section
      if (!siteContent[section]) {
        return new Response(
          JSON.stringify({ success: false, message: 'Content section not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, content: siteContent[section] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Return all site content
      return new Response(
        JSON.stringify({ success: true, content: siteContent }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error getting site content:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get site content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT update site content section
export const PUT: APIRoute = async ({ request, params }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { section } = params;
    if (!section) {
      return new Response(
        JSON.stringify({ success: false, message: 'Section parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const contentData = await request.json();
    const siteContent = await getSiteContent();
    
    // Check if section exists
    if (!siteContent[section]) {
      return new Response(
        JSON.stringify({ success: false, message: 'Content section not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse metadata if it's a string
    if (typeof contentData.metadata === 'string') {
      try {
        contentData.metadata = JSON.parse(contentData.metadata);
      } catch (error) {
        contentData.metadata = {};
      }
    }
    
    // Update section
    siteContent[section] = {
      ...siteContent[section],
      ...contentData,
      updatedAt: new Date().toISOString()
    };
    
    await saveSiteContent(siteContent);
    
    return new Response(
      JSON.stringify({ success: true, content: siteContent[section] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating site content:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update site content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
