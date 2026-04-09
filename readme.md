# ComplyTech Agency Website

This repository contains the codebase for the **ComplyTech** agency website, an SEO and GEO-optimized platform offering ADA compliance services, small business audits, and related healthcare industry accessibility solutions.

## Architecture & Technology Stack

The project is a modern static site and web application built for maximum performance and SEO visibility. 
It uses the following stack:

- **Framework:** [Astro](https://astro.build/) (v4)
- **UI Components:** [React](https://react.dev/) (v18) via `@astrojs/react`
- **SEO & Routing:** Native Astro capabilities with `@astrojs/sitemap`
- **Styling:** Custom CSS design system with specific color tokens and modern micro-animations.

## Project Structure

```text
/
├── public/                 # Static assets like images, robots.txt, sitemap.xml, etc.
├── src/                    # Source code (Astro pages, React components, CSS, etc.)
├── .astro/                 # Astro internal generated types/cache
├── dist/                   # Production build output
├── ada_content_package.md   # Content strategy and SEO keywords documentation
├── competitor_analysis.md  # Market analysis
├── astro.config.mjs        # Astro configuration file
├── package.json            # Project dependencies and npm scripts
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites
Make sure you have Node.js installed. We recommend the latest LTS version.

### Installation

1. Install all dependencies using npm:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321` by default.

### Build for Production

To create a production-ready build:
```bash
npm run build
```
This will compile the Astro pages and React components into the `dist/` folder.

To preview the built site locally:
```bash
npm run preview
```

## Contributing & Content

To update website content or extend pages, follow the guidelines established in the `ada_content_package.md` to maintain schema.org markup, SEO keyword density, and appropriate heading hierarchy.

## License

All rights reserved. ComplyTech.
