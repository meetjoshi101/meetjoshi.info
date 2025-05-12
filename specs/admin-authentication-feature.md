# Admin Authentication Feature Plan

## High-Level Objective
Add an authentication system to the website that allows an admin user (Meet Joshi) to log in with username and password to access protected routes for content management. This will enable secure editing of blog posts, projects, and other site content without requiring direct code changes.

## Key Requirements
1. Secure login system with username and password authentication
2. Protected admin dashboard route
3. Session management for logged-in users
4. Content management UI for blogs and projects
5. Logout functionality

## Technology Stack
- **Authentication**: Astro Auth or custom auth implementation
- **UI Components**: daisyUI 5 for login form and admin dashboard
- **State Management**: Client-side storage for session (cookies/localStorage)
- **API Routes**: Astro API endpoints for authentication and content operations

## File Changes & Additions

### Configuration Files
- `astro.config.mjs`: Update to add auth integration
- `src/env.d.ts`: Add type definitions for authentication

### Authentication Files
- `src/lib/auth/`: New directory for authentication utilities
  - `src/lib/auth/auth.ts`: Core authentication logic
  - `src/lib/auth/session.ts`: Session management utilities
  - `src/lib/auth/middleware.ts`: Authentication middleware for protected routes

### API Routes
- `src/pages/api/auth/`: New directory for auth API endpoints
  - `src/pages/api/auth/login.ts`: Handle login requests
  - `src/pages/api/auth/logout.ts`: Handle logout requests
  - `src/pages/api/auth/session.ts`: Check session status

### Admin UI
- `src/pages/admin/`: New directory for admin pages
  - `src/pages/admin/index.astro`: Admin dashboard
  - `src/pages/admin/login.astro`: Login page
  - `src/pages/admin/blogs/`: Blog management pages
  - `src/pages/admin/projects/`: Project management pages

### Components
- `src/components/admin/`: New directory for admin components
  - `src/components/admin/LoginForm.astro`: Login form component
  - `src/components/admin/Sidebar.astro`: Admin sidebar navigation
  - `src/components/admin/ContentEditor.astro`: Reusable content editor
- `src/components/common/ProtectedRoute.astro`: Component to guard admin routes

### Layouts
- `src/layouts/AdminLayout.astro`: Layout for admin pages

## Implementation Plan

### Phase 1: Authentication Setup
1. Create basic authentication system (username/password)
2. Set up login page with daisyUI styling
3. Implement session management and persistence
4. Create middleware for protected routes

### Phase 2: Admin Dashboard
1. Create admin dashboard layout
2. Build dashboard overview page
3. Add navigation and logout functionality
4. Connect authentication status to UI elements

### Phase 3: Content Management
1. Create content listing views for blogs and projects
2. Build content editor interface using daisyUI components
3. Implement content creation, editing, and deletion
4. Add media upload functionality for blog and project images

### Phase 4: Testing & Security
1. Test authentication flow and session persistence
2. Implement proper error handling and validation
3. Add rate limiting for login attempts
4. Review and harden security measures

## Security Considerations
- Store password securely (hashed, not plain text)
- Implement CSRF protection
- Use secure, HTTP-only cookies for session management
- Add rate limiting to prevent brute force attacks
- Sanitize user inputs to prevent XSS attacks

## UI Mockups
1. Login page with daisyUI form components
2. Admin dashboard with sidebar navigation
3. Content listing page with action buttons
4. Content editor with rich text editing

## Tasks List

### Authentication Setup
- [ ] Research authentication options for Astro
- [ ] Set up auth directory structure and core files
- [ ] Create login page with daisyUI components
- [ ] Implement basic username/password authentication
- [ ] Set up session management system
- [ ] Create middleware for protected routes

### Admin Dashboard
- [ ] Design and implement admin layout
- [ ] Create admin dashboard homepage
- [ ] Implement sidebar navigation
- [ ] Add authentication status indicator
- [ ] Create logout functionality

### Content Management
- [ ] Create blog listing page in admin section
- [ ] Create project listing page in admin section
- [ ] Implement markdown/rich text editor component
- [ ] Create forms for adding/editing blog posts
- [ ] Create forms for adding/editing projects
- [ ] Add image upload functionality

### Security & Testing
- [ ] Test authentication flow end-to-end
- [ ] Implement proper error handling
- [ ] Add input validation
- [ ] Review security practices
- [ ] Add rate limiting for login attempts
- [ ] Test across different browsers and devices

## Future Enhancements
- Password reset functionality
- Activity logging and audit trail
- Rich text editor improvements

---

This feature enhancement will enable secure content management for the portfolio website, allowing for easier updates to blogs, projects, and site content without requiring direct code changes or deployments.
