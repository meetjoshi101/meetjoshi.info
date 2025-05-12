// Core authentication utilities for the admin system

import * as bcrypt from 'bcryptjs';

// For a simple single-user system, we can hardcode the admin credentials
// In production, this would ideally be stored in environment variables
const ADMIN_USER = {
  username: 'admin', // Replace with actual username
  // This is a hashed password - never store plain text passwords!
  passwordHash: '', // Will be replaced with a proper hash
};

// Initialize admin credentials (call this on app startup)
export async function initializeAdmin() {
  // For demo purposes, we'll create a hash for "adminpassword"
  // In production, use environment variables for greater security
  if (!ADMIN_USER.passwordHash) {
    ADMIN_USER.passwordHash = await bcrypt.hash('adminpassword', 10);
  }
}

// Verify login credentials
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USER.username) {
    return false;
  }
  
  return await bcrypt.compare(password, ADMIN_USER.passwordHash);
}

// Simple function to check if user is logged in based on session data
export function isLoggedIn(session: any): boolean {
  return Boolean(session?.authenticated && session?.username === ADMIN_USER.username);
}
