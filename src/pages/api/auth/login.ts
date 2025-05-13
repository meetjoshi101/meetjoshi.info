import { authenticate } from '../../../lib/auth/auth';
import { createAuthenticatedSession, setSessionCookie } from '../../../lib/auth/session';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { username, password } = body;
    
    // Validate required fields
    if (!username || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Username and password are required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Authenticate using the more specific authenticate function
    const authResult = await authenticate(username, password);
    
    if (!authResult.success) {
      // Return the specific error message from authenticate
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: authResult.message
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create authenticated session
    const session = createAuthenticatedSession(username);
    
    // Create success response
    const response = new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login successful',
        redirectTo: '/admin'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
    // Set session cookie
    return setSessionCookie(response, session);
  } catch (error) {
    console.error('Login API error:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Server error occurred while processing login request' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
