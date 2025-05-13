import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';

// In a real app, this would be a database
// For this example, we'll store site content in a JSON file
const SITE_CONTENT_FILE = path.join(process.cwd(), 'src/data/site-content.json');

// Helper function to read site content from file
async function getSiteContent() {
  try {
    const data = await fs.readFile(SITE_CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
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

// GET all site content
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
    const siteContent = await getSiteContent();
    
    return new Response(
      JSON.stringify({ success: true, content: siteContent }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting site content:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get site content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
