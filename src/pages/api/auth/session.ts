import { getSessionFromCookie } from '../../../lib/auth/session';
import { isLoggedIn } from '../../../lib/auth/auth';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
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
};
