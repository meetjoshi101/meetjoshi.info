// Authentication middleware for protecting routes

import { getSessionFromCookie } from './session';
import { isLoggedIn } from './auth';
import type { APIContext } from 'astro';

// Middleware to check if user is authenticated
export function authMiddleware({ request }: { request: Request }) {
  const session = getSessionFromCookie(request);
  
  if (!session || !isLoggedIn(session)) {
    // Not authenticated, redirect to login
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin/login',
      },
    });
  }
  
  // User is authenticated, continue
  return null;
}

// Helper function to check if user is authenticated (for use in components)
export function isAuthenticated(request: Request): boolean {
  const session = getSessionFromCookie(request);
  return Boolean(session && isLoggedIn(session));
}
