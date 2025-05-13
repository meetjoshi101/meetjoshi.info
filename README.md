# Meet Joshi - Personal Portfolio & Blog

Welcome to my personal website repository! This site serves as my professional portfolio, blog, and central hub for showcasing my software development expertise and projects.

## 📋 Overview

This is a modern, responsive personal website built with:

- **Astro v5.7+** - For fast, efficient page rendering and content management
- **Tailwind CSS v4.1+** - For utility-first styling
- **daisyUI v5.0+** - For beautiful UI components
- **TypeScript v5.8+** - For type-safe development

The site features:
- 💼 Project portfolio showcasing my best work
- 📝 Technical blog with industry insights and tutorials
- 👨‍💻 Information about my skills, experience, and expertise
- 📬 Contact information and professional details
- 🔒 Admin dashboard with secure authentication for content management

## 🚀 Project Structure

The website is organized with a modern, maintainable structure:

```text
/
├── public/                  # Static assets and public files
│   ├── CNAME               # Domain configuration for hosting
│   ├── favicon.svg         # Website favicon
│   ├── robots.txt          # SEO settings
│   ├── blogs/              # Blog post images
│   └── projects/           # Project images
├── specs/                  # Feature specifications
│   └── admin-authentication-feature.md
├── src/
│   ├── assets/             # JavaScript assets and utilities
│   │   └── js/
│   │       └── scrollAnimations.js
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin dashboard components
│   │   │   ├── ContentEditor.astro
│   │   │   ├── Login.astro
│   │   │   ├── LoginForm.astro
│   │   │   └── Sidebar.astro
│   │   ├── common/         # Shared components
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ProtectedRoute.astro
│   │   │   └── SEO.astro
│   │   ├── layout/         # Layout components (Navbar)
│   │   └── sections/       # Major page sections (Hero, Skills)
│   ├── content/            # Content collections for Astro CMS
│   │   ├── config.ts       # Content collection configuration
│   │   ├── blogs/          # Blog post content
│   │   ├── projects/       # Project details
│   │   └── site-content/   # Site content (about, contact, etc.)
│   ├── data/               # Static data files
│   │   ├── blogs.json
│   │   ├── projects.json
│   │   └── site-content.json
│   ├── docs/               # Documentation
│   │   └── admin-authentication.md
│   ├── layouts/            # Page layout templates
│   │   ├── AdminLayout.astro
│   │   └── MainLayout.astro
│   ├── lib/                # Utility libraries
│   │   └── auth/           # Authentication utilities
│   │       ├── auth.ts
│   │       ├── middleware.ts
│   │       └── session.ts
│   ├── pages/              # Website pages and routes
│   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── index.astro # Admin dashboard homepage
│   │   │   ├── login-new.astro
│   │   │   ├── login.astro
│   │   │   ├── blogs/      # Blog management
│   │   │   │   ├── [slug].astro
│   │   │   │   ├── index.astro
│   │   │   │   └── new.astro
│   │   │   ├── projects/   # Project management
│   │   │   │   ├── [slug].astro
│   │   │   │   ├── index.astro
│   │   │   │   └── new.astro
│   │   │   └── site-content/ # Site content management
│   │   │       ├── [section].astro
│   │   │       └── index.astro
│   │   ├── api/            # API endpoints
│   │   │   ├── upload.ts
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   │   ├── login.ts
│   │   │   │   ├── logout.ts
│   │   │   │   └── session.ts
│   │   │   ├── blogs/      # Blog API
│   │   │   │   ├── [slug].ts
│   │   │   │   └── index.ts
│   │   │   ├── projects/   # Projects API
│   │   │   │   ├── [slug].ts
│   │   │   │   └── index.ts
│   │   │   └── site-content/ # Site content API
│   │   │       ├── [section].ts
│   │   │       └── index.ts
│   │   ├── blogs/          # Blog section pages and dynamic routes
│   │   │   ├── [...slug].astro
│   │   │   └── index.astro
│   │   ├── projects/       # Project pages and dynamic routes
│   │   │   ├── [...slug].astro
│   │   │   └── index.astro
│   │   ├── index.astro     # Homepage
│   │   └── sitemap.xml.ts  # Dynamic sitemap generator
│   ├── styles/             # Global CSS styles
│   │   └── global.css
│   ├── env.d.ts            # Environment type definitions
│   └── types.ts            # TypeScript type definitions
└── astro.config.mjs        # Astro configuration
```

The project utilizes Astro's content collections to manage structured content like blog posts and project information, making it easy to maintain and update the site content without touching the application code.

## 💻 Development

### Prerequisites

- Node.js 18+ and npm
- Modern browser that supports Tailwind CSS v4 and daisyUI v5

### Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/meetjoshi.info.git
   cd meetjoshi.info
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```

4. **Open your browser**
   The site will be available at http://localhost:4321

### Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 🚢 Deployment

This site is configured to deploy to GitHub Pages using GitHub Actions. The deployment process is automated:

1. Push changes to the `main` branch
2. GitHub Actions builds the site using `npm run build`
3. The built site is deployed to the `gh-pages` branch
4. The site is served from `https://meetjoshi.info` (custom domain configuration)

## 🔒 Admin Dashboard

The portfolio includes a secure admin dashboard for content management:

- **Authentication** - Secure login system using bcryptjs for password hashing
- **Content Editor** - Markdown editor for updating blog posts and project details
- **Media Management** - Upload and manage images for blogs and projects
- **Site Content** - Update site sections like About, Contact, and Skills

To access the admin dashboard:
1. Navigate to the `/admin` route
2. Log in with admin credentials

## 🔒 Authentication System

This website uses a server-side rendering approach for the admin area to ensure secure authentication:

- The admin section requires server-side rendering to handle authentication cookies and session management
- Set `output: 'server'` in astro.config.mjs to enable server-side rendering for all pages
- Alternatively, use `export const prerender = false;` at the top of specific pages that need server-side rendering
- Authentication is handled through cookies with secure HttpOnly attributes
- Login requests are processed via API endpoints with proper error handling

If you encounter authentication issues, make sure:
1. The server is running in SSR mode
2. The admin credentials are properly configured in the auth system
3. Cookies are enabled in your browser

### Manual Deployment

If you prefer to deploy manually:

1. Build the site
   ```sh
   npm run build
   ```

2. Deploy the `dist` directory to your web hosting service of choice

## 🛠️ Built With

- [Astro](https://astro.build/) - The web framework for content-driven websites
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [daisyUI](https://daisyui.com/) - Tailwind CSS component library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Last Updated

This README was last updated on May 12, 2025.

---

© 2025 Meet Joshi. All Rights Reserved.
