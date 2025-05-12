// Session management utilities

import { initializeAdmin } from './auth';
import type { APIContext } from 'astro';

// Session object type
export interface Session {
  authenticated: boolean;
  username: string | null;
  created: number; // timestamp
  expires: number; // timestamp
}

// Create a new empty session
export function createEmptySession(): Session {
  return {
    authenticated: false,
    username: null,
    created: Date.now(),
    expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  };
}

// Create an authenticated session
export function createAuthenticatedSession(username: string): Session {
  return {
    authenticated: true,
    username,
    created: Date.now(),
    expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  };
}

// Get current session from cookies
export function getSessionFromCookie(request: Request): Session | null {
  const cookies = parseCookies(request.headers.get('cookie') || '');
  
  if (!cookies.session) {
    return null;
  }
  
  try {
    const session = JSON.parse(atob(cookies.session)) as Session;
    
    // Check if session is expired
    if (Date.now() > session.expires) {
      return null;
    }
    
    return session;
  } catch (e) {
    console.error('Failed to parse session cookie', e);
    return null;
  }
}

// Helper to parse cookies
function parseCookies(cookieString: string): Record<string, string> {
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(part => decodeURIComponent(part.trim()));
      if (name && value) cookies[name] = value;
      return cookies;
    }, {} as Record<string, string>);
}

// Set session cookie in response
export function setSessionCookie(response: Response, session: Session): Response {
  const sessionValue = btoa(JSON.stringify(session));
  
  // Clone the response to avoid modifying the original
  const newResponse = new Response(response.body, response);
  
  // Set the cookie with secure flags
  newResponse.headers.append(
    'Set-Cookie',
    `session=${sessionValue}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`
  );
  
  return newResponse;
}

// Remove session cookie (for logout)
export function clearSessionCookie(response: Response): Response {
  // Clone the response to avoid modifying the original
  const newResponse = new Response(response.body, response);
  
  // Set an expired cookie to remove it
  newResponse.headers.append(
    'Set-Cookie',
    'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );
  
  return newResponse;
}

// Initialize the auth system
export async function initAuth() {
  await initializeAdmin();
}
