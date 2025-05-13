// Core authentication utilities for the admin system

// WARNING: Using plain text passwords is NOT secure and should NEVER be used in production
// This is only for development/testing purposes

// For a simple single-user system, we can hardcode the admin credentials
// In production, use environment variables and proper password hashing
const ADMIN_USER = {
  username: 'admin',
  password: 'Meet', // Plain text password - INSECURE!
};

// Initialize admin credentials (call this on app startup)
export async function initializeAdmin() {
  // No hashing needed with plain text
  console.log("Using plain text password for development only");
}

// Simple function to check if user is logged in based on session data
export function isLoggedIn(session: any): boolean {
  return Boolean(session?.authenticated && session?.username === ADMIN_USER.username);
}

// Function to authenticate and provide specific error messages
export async function authenticate(username: string, password: string): Promise<{ success: boolean; message: string }> {
  // Check if username exists
  if (username !== ADMIN_USER.username) {
    return { 
      success: false, 
      message: "Invalid username. Please check your credentials and try again." 
    };
  }
  
  // Check if password is correct (plain text comparison)
  if (password !== ADMIN_USER.password) {
    return { 
      success: false, 
      message: "Incorrect password. Please try again." 
    };
  }
  
  // Authentication successful
  return { 
    success: true, 
    message: "Login successful!" 
  };
}
