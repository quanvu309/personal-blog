# Implementation Plan: Camthoi Personal Blog

**Feature ID**: `001-camthoi-blog`
**Created**: 2026-02-27
**Status**: Draft
**Spec Version**: 1.0

---

## 1. Overview

This document defines HOW the Camthoi blog will be implemented, including technology choices, architecture decisions, development phases, and deployment strategy.

**Reference**: All requirements are defined in `spec.md`

---

## 2. Technology Stack

### 2.1 Core Framework

**Choice**: Next.js 15 (App Router) with TypeScript

**Rationale**:
- Meets NFR-7.2 (free and open-source)
- Supports static site generation for GitHub Pages (NFR-7.1)
- Excellent performance for static content (NFR-1.1, NFR-1.2)
- Built-in routing and file-based structure
- Strong TypeScript support
- Large ecosystem and community

**Alternatives Considered**:
- **Astro**: Excellent for static sites but less flexible for admin interface interactivity
- **Gatsby**: Mature but heavier and more complex than needed
- **Hugo/Jekyll**: Fast but limited JavaScript capabilities for admin features
- **Plain HTML/CSS/JS**: Too much custom work for authentication and markdown rendering

### 2.2 Styling

**Choice**: Tailwind CSS

**Rationale**:
- Rapid development of custom designs
- Utility-first approach fits minimalist aesthetic
- Small production bundle (purges unused styles)
- Free and open-source
- Excellent for responsive design (FR-1.10)

**Alternatives Considered**:
- **Plain CSS**: More control but slower development
- **CSS Modules**: Good encapsulation but more verbose
- **Styled Components**: Runtime overhead not needed for static site

### 2.3 Content Storage

**Choice**: Markdown files in `/content` directory + JSON metadata

**Rationale**:
- Meets FR-4.1 (portable format)
- Meets FR-4.4 (version control via git)
- Human-readable (NFR-6.1)
- Easy to export (NFR-6.2)
- No database setup or costs
- Can be edited in any text editor

**Structure**:
```
/content/
  posts/
    001-first-post.md
    002-second-post.md
  about.md
  posts-metadata.json  # Contains all post metadata for fast listing
```

### 2.4 Markdown Processing

**Choice**: `gray-matter` + `marked` or `remark`

**Rationale**:
- gray-matter: Industry standard for frontmatter parsing
- marked/remark: Proven markdown-to-HTML conversion
- Supports custom rendering if needed
- Lightweight and fast

### 2.5 Authentication

**Choice**: NextAuth.js v5 with Credentials provider

**Rationale**:
- Industry-standard auth for Next.js
- Supports session management (FR-2.5)
- Simple credentials provider for single-user scenario
- Handles session expiry (30 days per R1)
- Free and open-source

**Alternative**: Custom JWT implementation (rejected - reinventing the wheel, security risks)

### 2.6 GitHub Integration

**Choice**: Octokit (GitHub REST API client)

**Rationale**:
- Official GitHub API client
- Handles authentication with personal access tokens
- Can commit files directly to repository
- Well-documented and maintained

**Note**: Author will need to generate a GitHub Personal Access Token with repo write permissions

### 2.7 Deployment

**Choice**: GitHub Pages with GitHub Actions for build

**Rationale**:
- Meets NFR-7.1 (zero monthly cost)
- Direct integration with source repository
- Automatic deployments via Actions
- Free SSL certificates
- Good performance and uptime

---

## 3. Architecture

### 3.1 Application Architecture

**Pattern**: Hybrid Static Site Generation (SSG) + Client-Side Rendering (CSR)

**Public Routes** (SSG):
- `/` - Homepage (pre-rendered, regenerated on deploy)
- `/posts/[slug]` - Individual posts (pre-rendered, regenerated on deploy)
- `/about` - About page (pre-rendered, regenerated on deploy)
- `/404` - Custom 404 page (static)

**Admin Routes** (CSR + Protected):
- `/admin/login` - Login page (client-rendered)
- `/admin` - Dashboard (client-rendered, auth required)
- `/admin/posts/new` - Create post (client-rendered, auth required)
- `/admin/posts/[id]/edit` - Edit post (client-rendered, auth required)
- `/admin/about/edit` - Edit about page (client-rendered, auth required)

### 3.2 Data Flow

**Reading Content (Public)**:
```
1. Build time: Read markdown files → Parse → Generate static HTML pages
2. Runtime: Serve pre-rendered HTML (no API calls needed)
```

**Managing Content (Admin)**:
```
1. Author logs in → NextAuth validates → Creates session
2. Author creates/edits post → Form submission
3. Client sends request to API route
4. API route validates session
5. API route uses Octokit to commit changes to GitHub
6. GitHub webhook (optional) triggers rebuild
7. New content appears after rebuild
```

### 3.3 File Structure

```
personal-blog/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx        # Individual post page
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout (auth check)
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── posts/
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Create post
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit post
│   │   └── about/
│   │       └── edit/
│   │           └── page.tsx    # Edit about page
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    # NextAuth config
│   │   ├── posts/
│   │   │   ├── route.ts        # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET one, PATCH, DELETE
│   │   └── about/
│   │       └── route.ts        # GET, PATCH
│   └── not-found.tsx           # Custom 404 page
│
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── PostList.tsx           # Homepage post listing
│   ├── PostContent.tsx        # Markdown rendering
│   ├── PostForm.tsx           # Create/edit form
│   └── AdminNav.tsx           # Admin navigation
│
├── lib/
│   ├── markdown.ts            # Markdown processing utilities
│   ├── posts.ts               # Post CRUD operations
│   ├── github.ts              # GitHub API interactions
│   ├── auth.ts                # Auth config and helpers
│   └── utils.ts               # General utilities
│
├── content/
│   ├── posts/                 # Markdown post files
│   ├── about.md               # About page content
│   └── posts-metadata.json    # Post metadata cache
│
├── types/
│   └── index.ts               # TypeScript types
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
│
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

---

## 4. Data Models

### 4.1 Post Markdown File Format

```markdown
---
id: "unique-id-here"
title: "Post Title"
slug: "auto-generated-slug"
date: "2026-02-27T12:00:00Z"
status: "published"
createdAt: "2026-02-27T12:00:00Z"
updatedAt: "2026-02-27T12:00:00Z"
---

Post content goes here in **markdown** format.

## Subheading

More content...
```

### 4.2 TypeScript Interfaces

```typescript
// Post entity
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string; // ISO 8601
  status: 'draft' | 'published';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// Post metadata (for listings)
interface PostMetadata {
  id: string;
  title: string;
  slug: string;
  date: string;
  status: 'draft' | 'published';
}

// About page
interface AboutPage {
  content: string;
  updatedAt: string;
}

// API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## 5. Development Phases

### Phase 0: Project Setup
**Duration**: 1 day
**Goal**: Development environment ready

**Tasks**:
1. Initialize Next.js 15 project with TypeScript
2. Install dependencies (Tailwind, NextAuth, markdown libraries, Octokit)
3. Configure Tailwind CSS
4. Set up basic file structure
5. Create .env.local.example with required variables
6. Initialize git repository (if not already)
7. Create initial README with setup instructions

**Deliverable**: Empty Next.js app running locally

---

### Phase 1: Core Reading Experience (Public Site)
**Duration**: 2-3 days
**Goal**: Readers can browse and read published posts

**Tasks**:
1. Create content/posts directory with sample posts
2. Implement markdown parsing utilities (lib/markdown.ts)
3. Implement post reading utilities (lib/posts.ts)
4. Build homepage (app/page.tsx) with post list
5. Build individual post page (app/posts/[slug]/page.tsx)
6. Build About page (app/about/page.tsx)
7. Implement basic layout and navigation
8. Add responsive design
9. Test static generation

**Acceptance Criteria**:
- All acceptance criteria from User Story 1 (spec.md)
- Site builds as static pages
- Navigation works between all pages
- Content displays correctly on mobile and desktop

**Deliverable**: Functioning public blog with sample content

---

### Phase 2: Authentication System
**Duration**: 1-2 days
**Goal**: Secure admin access with login

**Tasks**:
1. Install and configure NextAuth.js
2. Create login page (app/admin/login/page.tsx)
3. Configure credentials provider
4. Implement session management (30-day expiry)
5. Create protected admin layout (app/admin/layout.tsx)
6. Add logout functionality
7. Test authentication flow
8. Add session persistence

**Acceptance Criteria**:
- All acceptance criteria from User Story 5 (spec.md)
- Sessions last 30 days (R1)
- Unauthorized access to /admin redirects to login

**Deliverable**: Working authentication protecting /admin routes

---

### Phase 3: Admin Interface - Post Management
**Duration**: 3-4 days
**Goal**: Author can create, edit, delete posts via admin

**Tasks**:
1. Build admin dashboard (app/admin/page.tsx)
2. Create post form component (components/PostForm.tsx)
3. Build create post page (app/admin/posts/new/page.tsx)
4. Build edit post page (app/admin/posts/[id]/edit/page.tsx)
5. Implement GitHub API integration (lib/github.ts)
6. Create API routes for post operations
7. Add delete confirmation
8. Add status toggle (draft/published)
9. Test all CRUD operations

**Acceptance Criteria**:
- All acceptance criteria from User Stories 2, 3, 4 (spec.md)
- Posts committed to GitHub repository
- Changes trigger rebuild (manual or automatic)

**Deliverable**: Full post management via admin interface

---

### Phase 4: About Page Management
**Duration**: 1 day
**Goal**: Author can edit About page content

**Tasks**:
1. Create About edit page (app/admin/about/edit/page.tsx)
2. Create API route for About page updates
3. Implement About page GitHub commit
4. Test About page workflow

**Acceptance Criteria**:
- Author can edit About page content
- Changes appear on public site after rebuild
- Content stored as markdown file

**Deliverable**: Editable About page

---

### Phase 5: GitHub Actions & Deployment
**Duration**: 1-2 days
**Goal**: Automatic deployment to GitHub Pages

**Tasks**:
1. Create GitHub Actions workflow (.github/workflows/deploy.yml)
2. Configure Next.js for static export
3. Set up GitHub Pages
4. Test deployment process
5. Configure environment variables in GitHub
6. Test rebuild on content changes
7. Set up custom 404 page

**Acceptance Criteria**:
- Site deploys to GitHub Pages successfully
- Changes to content trigger rebuild
- All environment variables secured
- Custom 404 page works (R4)

**Deliverable**: Live site on GitHub Pages with CI/CD

---

### Phase 6: Polish & Testing
**Duration**: 2-3 days
**Goal**: Production-ready application

**Tasks**:
1. Implement error handling throughout app
2. Add loading states
3. Improve form validation
4. Test all edge cases from spec.md Appendix A
5. Run accessibility audit (target 90+)
6. Test on multiple devices and browsers
7. Optimize performance (Lighthouse audit)
8. Add proper meta tags for SEO
9. Write user documentation
10. Create deployment guide

**Acceptance Criteria**:
- All Success Criteria from spec.md Section 9 pass
- All edge cases handled gracefully
- Lighthouse scores: Performance 90+, Accessibility 90+

**Deliverable**: Production-ready Camthoi blog

---

## 6. Environment Variables

Required environment variables:

```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secret>
ADMIN_PASSWORD=<hashed-password>

# GitHub Integration
GITHUB_TOKEN=<personal-access-token>
GITHUB_OWNER=<github-username>
GITHUB_REPO=<repository-name>
GITHUB_BRANCH=main
```

---

## 7. Testing Strategy

### 7.1 Manual Testing
- Test all user stories' acceptance criteria
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- Accessibility testing with screen reader

### 7.2 Automated Testing (Optional, Phase 7)
- Unit tests for utilities (markdown parsing, slug generation)
- Integration tests for API routes
- E2E tests for critical paths (login, create post, publish)

---

## 8. Deployment Process

### 8.1 Initial Deployment

1. Create GitHub repository
2. Push code to repository
3. Generate GitHub Personal Access Token
4. Add secrets to GitHub repository settings
5. Enable GitHub Pages in repository settings
6. Configure GitHub Pages source (gh-pages branch)
7. Run GitHub Actions workflow
8. Verify deployment

### 8.2 Content Updates

1. Author logs into admin interface
2. Creates/edits content
3. Admin commits changes via GitHub API
4. (Option A) Manually trigger GitHub Actions rebuild
5. (Option B) Set up webhook to auto-trigger on push
6. Changes appear on live site after build completes

---

## 9. Security Considerations

1. **Authentication**: NextAuth handles session security
2. **Password Storage**: Hash admin password, never store plain text
3. **GitHub Token**: Store as environment variable, never commit
4. **API Routes**: All admin APIs check authentication
5. **XSS Protection**: Sanitize markdown output
6. **CSRF**: Next.js built-in protection

---

## 10. Performance Optimization

1. **Static Generation**: Pre-render all public pages at build time
2. **Image Optimization**: N/A (text-only)
3. **Code Splitting**: Next.js automatic code splitting
4. **Caching**: GitHub Pages provides CDN caching
5. **Minimal JavaScript**: Only load JS for admin routes

---

## 11. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| GitHub API rate limits | High | Low | Use conditional requests, cache metadata |
| Build time increases with many posts | Medium | Medium | Implement incremental static regeneration if needed |
| GitHub token expiration | High | Low | Document renewal process, monitor expiry |
| Concurrent edits | Low | Very Low | Single author, accept last-write-wins |
| Content loss on failed commit | Medium | Low | Validate before commit, show error messages |

---

## 12. Future Enhancements (Out of Scope for v1.0)

- RSS feed generation
- Search functionality
- Post tagging/categories
- Draft preview mode
- Scheduled publishing
- Analytics integration
- Comments (via third-party service)
- Dark mode
- Multiple authors

---

## 13. Success Metrics

Before considering complete, verify:

- [ ] All requirements from spec.md are implemented
- [ ] All user story acceptance criteria pass
- [ ] All success criteria from spec.md Section 9 are met
- [ ] Site deployed to GitHub Pages at $0/month cost
- [ ] Author can create and publish post in under 3 minutes
- [ ] Lighthouse accessibility score 90+
- [ ] All edge cases handled

---

**Next Step**: Create `contracts/` directory with API contracts and data schemas
