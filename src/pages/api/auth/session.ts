import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = getSessionFromCookie(request);
    const authenticated = session ? isLoggedIn(session) : false;
    
    // Return session status
    return new Response(
      JSON.stringify({ 
        authenticated,
        username: authenticated ? session?.username : null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Session API error:', error);
    return new Response(
      JSON.stringify({ 
        authenticated: false, 
        error: 'Failed to check authentication status'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
