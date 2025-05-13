import { clearSessionCookie } from '../../../lib/auth/session';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Create base response
    const response = new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Logged out successfully',
        redirectTo: '/' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
    // Clear the session cookie
    return clearSessionCookie(response);
  } catch (error) {
    console.error('Logout API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Error during logout process'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
