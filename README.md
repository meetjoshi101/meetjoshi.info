# Meet Joshi - Personal Portfolio & Blog

Welcome to my personal website repository! This site serves as my professional portfolio, blog, and central hub for showcasing my software development expertise and projects.

## 📋 Overview

This is a modern, responsive personal website built with:

- **Astro** - For fast, efficient page rendering and content management
- **Tailwind CSS** - For utility-first styling
- **daisyUI** - For beautiful UI components
- **TypeScript** - For type-safe development

The site features:
- 💼 Project portfolio showcasing my best work
- 📝 Technical blog with industry insights and tutorials
- 👨‍💻 Information about my skills, experience, and expertise
- 📬 Contact information and professional details

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
├── src/
│   ├── assets/             # JavaScript assets and utilities
│   │   └── js/
│   │       └── scrollAnimations.js
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components (ProjectCard, SEO)
│   │   ├── layout/         # Layout components (Navbar)
│   │   └── sections/       # Major page sections (Hero, Skills)
│   ├── content/            # Content collections for Astro CMS
│   │   ├── blogs/          # Blog post content
│   │   ├── projects/       # Project details
│   │   └── site-content/   # Site content (about, contact, etc.)
│   ├── layouts/            # Page layout templates
│   │   └── MainLayout.astro
│   ├── pages/              # Website pages and routes
│   │   ├── blogs/          # Blog section pages and dynamic routes
│   │   ├── projects/       # Project pages and dynamic routes
│   │   ├── index.astro     # Homepage
│   │   └── sitemap.xml.ts  # Dynamic sitemap generator
│   └── styles/             # Global CSS styles
│       └── global.css
└── astro.config.mjs        # Astro configuration
```

The project utilizes Astro's content collections to manage structured content like blog posts and project information, making it easy to maintain and update the site content without touching the application code.

## 💻 Development

### Prerequisites

- Node.js 18+ and npm

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

---

© 2025 Meet Joshi. All Rights Reserved.
