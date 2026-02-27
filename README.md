# Camthoi - Personal Minimalist Blog

A personal text-only blog with clean retro minimalist design, featuring Palantir-inspired aesthetics and a password-protected content management system.

## Features

- 📝 **Text-Only Blog**: Focus on content without distractions
- 🎨 **Retro Minimalist Design**: Palantir-inspired clean aesthetic with Georgia serif typography
- ✍️ **Admin CMS**: Password-protected interface for creating and managing posts
- 📱 **Fully Responsive**: Works beautifully on mobile, tablet, and desktop
- 🔒 **Secure**: Password-protected admin access with 30-day sessions
- 📦 **Markdown Support**: Write posts in markdown format
- 🚀 **GitHub Pages**: Free static site hosting
- ♿ **Accessible**: WCAG AA compliant

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Content**: Markdown files with frontmatter
- **Deployment**: GitHub Pages with GitHub Actions

## Project Structure

```
personal-blog/
├── specs/                  # Complete specifications
│   └── 001-camthoi-blog/
│       ├── spec.md         # Functional requirements
│       ├── plan.md         # Implementation plan
│       ├── design.md       # Visual design system
│       └── contracts/      # API/data/component contracts
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utility functions
├── content/                # Markdown content
│   ├── posts/             # Blog posts
│   └── about.md           # About page
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in the required values:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
ADMIN_PASSWORD=your-admin-password

# GitHub Integration (for auto-commits)
GITHUB_TOKEN=your-github-token
GITHUB_OWNER=your-username
GITHUB_REPO=personal-blog
GITHUB_BRANCH=main
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

**Create GitHub Personal Access Token**:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Camthoi Blog")
4. Select scope: `repo` (Full control of private repositories)
5. Generate and copy the token

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

### 4. Build for Production

```bash
npm run build
```

This generates a static export in the `/out` directory.

## Development Phases

This project follows a spec-first methodology with the following phases:

- [x] **Phase 0**: Project Setup
- [x] **Phase 1**: Core Reading Experience (public blog pages)
- [x] **Phase 2**: Authentication System
- [x] **Phase 3**: Admin Post Management
- [x] **Phase 4**: About Page Management
- [x] **Phase 5**: GitHub Pages Deployment
- [x] **Phase 6**: Polish & Testing ← **Complete!**

## Design System

### Colors

- Background: `#FAFAFA` (near-white)
- Text: `#1A1A1A` (near-black)
- Secondary: `#6B6B6B` (medium gray)
- Border: `#E0E0E0` (light gray)

### Typography

- **Font**: Georgia serif
- **Body**: 18px (1.125rem)
- **Headings**: 48px H1, 28px H2, 24px H3
- **Line Height**: 1.8 for body, 1.2 for headings

### Principles

- Brutalist simplicity (no decoration)
- Typography-first design
- Generous whitespace
- Sharp hierarchy
- Monochromatic palette

## Documentation

Complete specifications are available in the `specs/` directory:

- **spec.md**: Complete functional requirements (48 requirements total)
- **plan.md**: Implementation roadmap with 6 development phases
- **design.md**: Complete visual design system
- **contracts/**: All API routes, data schemas, and component interfaces

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Using the Blog

### Admin Access

1. Navigate to `/admin/login`
2. Enter your admin password (from `.env.local`)
3. Access the admin dashboard to:
   - Create, edit, and delete posts
   - Toggle post status (draft/published)
   - Edit the About page

### Creating Posts

1. Click "Create New Post" from the admin dashboard
2. Write your content in Markdown format
3. Choose status: Draft (private) or Published (public)
4. Save to create the post

### Deploying to GitHub Pages

1. Push your repository to GitHub
2. Go to repository Settings → Pages
3. Source: Select "GitHub Actions"
4. The workflow will automatically build and deploy your blog
5. Your site will be available at `https://username.github.io/repository-name`

## License

Private project - All rights reserved

---

Built with strict spec-first methodology 🎯
