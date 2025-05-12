# Admin Authentication Feature for Meet Joshi's Portfolio Site

## Overview

This feature provides secure authentication for the admin area of Meet Joshi's personal portfolio website. It allows an authorized administrator to log in and manage content including blog posts, projects, and site content without requiring direct code changes.

## Features

- **Secure Authentication**
  - Username/password login system
  - Session-based authentication
  - Protected API endpoints
  - Automatic redirect to login page for unauthenticated users

- **Content Management**
  - Blog posts: Create, edit, and delete blog posts with Markdown support
  - Projects: Manage portfolio projects with metadata
  - Site Content: Edit various sections of the website (hero, about, skills, contact)
  - Image Upload: Secure file uploads with validation

## Implementation Details

### Authentication

Authentication is implemented using server-side sessions. When a user logs in with valid credentials, a session is created and stored in a cookie. This session is verified on each request to protected resources.

Key files:
- `/src/lib/auth/auth.ts` - Core authentication logic
- `/src/lib/auth/session.ts` - Session management
- `/src/lib/auth/middleware.ts` - Auth middleware for routes
- `/src/pages/api/auth/login.ts` - Login API endpoint
- `/src/pages/api/auth/logout.ts` - Logout API endpoint
- `/src/pages/api/auth/session.ts` - Session validation endpoint

### Admin Interface

The admin interface provides a user-friendly way to manage content. It includes:

- Dashboard overview
- Blog post management
- Project management 
- Site content editor
- Markdown editor with live preview

Key components:
- `/src/layouts/AdminLayout.astro` - Main layout for admin pages
- `/src/components/admin/Sidebar.astro` - Navigation sidebar
- `/src/components/admin/ContentEditor.astro` - Markdown editor with preview
- `/src/components/admin/Login.astro` - Login form component

### API Endpoints

The following API endpoints are implemented for content management:

- **Blog Posts**
  - `GET /api/blogs` - List all blog posts
  - `POST /api/blogs` - Create a new blog post
  - `GET /api/blogs/:slug` - Get a specific blog post
  - `PUT /api/blogs/:slug` - Update a blog post
  - `DELETE /api/blogs/:slug` - Delete a blog post

- **Projects**
  - `GET /api/projects` - List all projects
  - `POST /api/projects` - Create a new project
  - `GET /api/projects/:slug` - Get a specific project
  - `PUT /api/projects/:slug` - Update a project
  - `DELETE /api/projects/:slug` - Delete a project

- **Site Content**
  - `GET /api/site-content` - Get all site content
  - `GET /api/site-content/:section` - Get content for a specific section
  - `PUT /api/site-content/:section` - Update content for a section

- **File Upload**
  - `POST /api/upload` - Upload image files with validation

### Data Storage

For simplicity, this implementation uses JSON files for data storage:

- `/src/data/blogs.json` - Blog posts storage
- `/src/data/projects.json` - Projects storage
- `/src/data/site-content.json` - Site content storage

In a production environment, you might want to replace this with a proper database.

## Security Considerations

- Password is hashed using bcryptjs before storing
- All admin API endpoints check for valid authentication
- File uploads are validated for type, size, and have secure naming
- Content-Type headers are properly set for all API responses
- Input validation is performed on all form submissions

## Dependencies

- `bcryptjs`: For password hashing
- `marked`: For Markdown rendering
- `@types/bcryptjs`: TypeScript definitions for bcryptjs

## Future Improvements

- Add more robust error handling and form validation
- Implement CSRF protection
- Add user management for multiple admin users
- Add image management interface
- Implement search functionality for content
- Add analytics dashboard

## Usage

1. Log in at `/admin/login` with admin credentials
2. Navigate the admin interface using the sidebar
3. Create, edit, or delete content as needed
4. Log out when finished using the logout button in the sidebar
