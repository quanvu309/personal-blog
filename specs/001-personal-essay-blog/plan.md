# Implementation Plan: Personal Essay Blog

**Branch**: `001-personal-essay-blog` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)

## Summary

Build a minimalist personal essay blog with Paul Graham-inspired design using Next.js 15, shadcn/ui, and file-based markdown content management. The system provides a clean reading experience with search functionality and password-protected admin interface for essay management.

## Technical Context

**Language/Version**: TypeScript with Next.js 15 (App Router), React 18
**Primary Dependencies**:
- shadcn/ui for UI components
- Tailwind CSS for styling
- next-auth for authentication
- gray-matter for markdown parsing
- fuse.js for client-side search
- react-markdown for rendering

**Storage**: Markdown files in `/content/essays` directory (file-based, git-committed)
**Testing**: Vitest for unit tests, Playwright for E2E tests
**Target Platform**: Web (desktop/mobile), deployed to Vercel free tier
**Project Type**: Next.js web application (SSG + SSR hybrid)
**Performance Goals**:
- <2s page load
- <500ms search response
- Lighthouse score >90 (performance, accessibility)

**Constraints**:
- Free/open-source tools only
- No database required (file-based content)
- Deployable to free hosting tier
- Light mode only

**Scale/Scope**: Single author, estimated 50-200 essays over time, minimal traffic expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity Principles**:
- ✅ Single Next.js project (not exceeding 3-project limit)
- ✅ No premature abstraction (use Next.js features directly)
- ✅ File-based content (no database complexity)
- ✅ Simple auth (next-auth credentials provider)

**Test-First Approach**:
- Integration tests for essay rendering and search
- E2E tests for admin authentication and CRUD operations
- Contract tests for markdown → HTML transformation

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-essay-blog/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Technology choices and rationale
├── data-model.md        # Essay schema and file structure
└── contracts/           # API routes and component contracts
```

### Source Code

```text
personal-blog/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with typography styles
│   ├── page.tsx           # Homepage (essay list)
│   ├── essays/
│   │   └── [slug]/
│   │       └── page.tsx   # Individual essay view (SSG)
│   ├── admin/
│   │   ├── layout.tsx     # Protected layout with auth check
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── new/
│   │   │   └── page.tsx   # Create new essay
│   │   └── edit/
│   │       └── [slug]/
│   │           └── page.tsx  # Edit existing essay
│   ├── login/
│   │   └── page.tsx       # Login page
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts   # NextAuth configuration
│       └── essays/
│           ├── route.ts        # GET (list), POST (create)
│           └── [slug]/
│               └── route.ts    # GET, PATCH, DELETE
│
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── essay-list.tsx     # Homepage essay list with search
│   ├── essay-card.tsx     # Individual essay preview
│   ├── essay-content.tsx  # Markdown renderer
│   ├── search-bar.tsx     # Client-side search input
│   └── admin/
│       ├── essay-form.tsx     # Create/edit form
│       └── essay-manager.tsx  # List with edit/delete actions
│
├── lib/
│   ├── essays.ts          # File system operations for essays
│   ├── markdown.ts        # Markdown processing utilities
│   ├── search.ts          # Fuse.js search initialization
│   └── auth.ts            # Auth configuration helpers
│
├── content/
│   └── essays/            # Markdown essay files
│       ├── example-essay.md
│       └── another-essay.md
│
├── types/
│   └── essay.ts           # TypeScript interfaces
│
├── tests/
│   ├── integration/
│   │   ├── essay-rendering.test.ts
│   │   └── search.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── essay-crud.spec.ts
│       └── public-reading.spec.ts
│
├── public/                # Static assets
├── .env.local.example     # Environment variables template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

**Structure Decision**: Single Next.js project using App Router for modern React Server Components. File-based content management eliminates database complexity while maintaining portability and version control benefits.

## Technology Stack Rationale

### Frontend Framework: Next.js 15 (App Router)

**Why**:
- Built-in SSG for optimal blog performance
- Server Components reduce client bundle size
- App Router provides better layouts and loading states
- Excellent Vercel deployment integration (free tier)
- Strong TypeScript support

**Alternatives Rejected**:
- Astro: Great for content sites, but less flexible for admin UI interactivity
- Remix: Excellent but not as optimized for static content generation
- Vite + React: Requires more configuration for SSG/routing

### UI Components: shadcn/ui + Tailwind CSS

**Why**:
- shadcn/ui provides beautiful, accessible components that align with "minimalism with polish" goal
- Copy-paste approach (not npm dependency) = full customization control
- Built on Radix UI primitives (excellent accessibility)
- Tailwind CSS enables Paul Graham-inspired typography with utility classes
- Both are completely free and open-source

**Alternatives Rejected**:
- Material UI: Too opinionated, not minimal enough
- Chakra UI: Adds unnecessary bundle size
- Pure CSS: More work for responsive design and accessibility

### Content Storage: File-based Markdown

**Why**:
- Markdown files in git = full version history automatically
- Portable format that outlives any framework
- No database maintenance or costs
- Easy backup (git clone)
- Can edit essays in any text editor or IDE
- Aligns with minimalist, lightweight philosophy

**Alternatives Rejected**:
- Sanity CMS: Excellent but adds external dependency and complexity
- Contentful: Not free for production use
- Database (PostgreSQL): Overkill for single-author blog, adds hosting complexity
- Notion API: External dependency, potential rate limits

### Authentication: NextAuth.js (Credentials Provider)

**Why**:
- Industry-standard auth for Next.js
- Simple credentials provider for single-user use case
- Session management built-in
- Free and open-source
- Easily extended if multi-user needed later

**Alternatives Rejected**:
- Clerk: Beautiful but has usage limits on free tier
- Auth0: Complex for single-user scenario
- Custom JWT: Reinventing the wheel, security risks

### Search: Fuse.js (Client-side)

**Why**:
- Lightweight fuzzy search library
- Runs entirely client-side (no backend needed)
- Fast enough for expected essay corpus size
- Handles typos and partial matches
- Zero server costs

**Alternatives Rejected**:
- Algolia: Overkill and has usage limits
- Elasticsearch: Way too complex for this use case
- Server-side search: Adds unnecessary latency

## Data Model

### Essay File Structure

Each essay is a markdown file with frontmatter:

```markdown
---
title: "Essay Title Here"
slug: "essay-title-here"
date: "2026-02-27"
status: "published" # or "draft"
---

Essay content in markdown format...

## Headers work

With **bold** and *italic* text.
```

### Essay TypeScript Interface

```typescript
interface Essay {
  slug: string;           // Unique identifier (filename without .md)
  title: string;          // Essay title
  content: string;        // Markdown content
  date: string;          // Publication date (ISO 8601)
  status: 'draft' | 'published';
  createdAt: string;     // File creation timestamp
  updatedAt: string;     // Last modified timestamp
}

interface EssayMetadata {
  slug: string;
  title: string;
  date: string;
  status: 'draft' | 'published';
}
```

## API Routes

### `GET /api/essays`
Returns list of essay metadata (title, slug, date, status). Filters drafts for non-authenticated requests.

### `POST /api/essays`
Creates new essay. Requires authentication. Accepts title, content, status.

### `GET /api/essays/[slug]`
Returns full essay content. Filters drafts for non-authenticated requests.

### `PATCH /api/essays/[slug]`
Updates existing essay. Requires authentication. Accepts title, content, status.

### `DELETE /api/essays/[slug]`
Deletes essay file. Requires authentication.

## Phase 0: Research & Setup

**Deliverable**: `research.md` with validated technology choices

Tasks:
1. Research next-auth credentials provider setup for single-user scenario
2. Research gray-matter vs frontmatter parsers for markdown
3. Research shadcn/ui components needed (Button, Card, Input, Textarea, etc.)
4. Research Fuse.js configuration for optimal essay search
5. Validate Vercel free tier supports all planned features
6. Research Playwright setup for Next.js App Router testing

## Phase 1: Project Bootstrap

**Deliverable**: Working Next.js app with shadcn/ui installed, directory structure created

Tasks:
1. Initialize Next.js 15 project with TypeScript and Tailwind CSS
2. Install and configure shadcn/ui
3. Set up directory structure (app/, components/, lib/, content/)
4. Configure TypeScript paths and aliases
5. Set up Vitest and Playwright
6. Create .env.local.example with required environment variables
7. Initialize git repository and create .gitignore

## Phase 2: Core Reading Experience

**Deliverable**: Public can browse and read published essays

Tasks:
1. Create Essay type definitions
2. Implement file system utilities in `lib/essays.ts` (read, list, parse frontmatter)
3. Build homepage with essay list (app/page.tsx)
4. Build individual essay page (app/essays/[slug]/page.tsx)
5. Create markdown rendering component with styling
6. Implement Paul Graham-inspired typography with Tailwind
7. Add responsive layout for mobile/tablet/desktop
8. Write integration tests for essay rendering

## Phase 3: Search Functionality

**Deliverable**: Readers can search essays by title and content

Tasks:
1. Integrate Fuse.js into lib/search.ts
2. Create SearchBar component
3. Implement client-side filtering in essay list
4. Add real-time search updates as user types
5. Handle empty search results gracefully
6. Write integration tests for search

## Phase 4: Authentication

**Deliverable**: Password-protected login system

Tasks:
1. Install and configure next-auth
2. Set up credentials provider for single user
3. Create login page (app/login/page.tsx)
4. Implement session management
5. Create auth middleware to protect /admin routes
6. Add logout functionality
7. Write E2E tests for authentication flow

## Phase 5: Admin Interface

**Deliverable**: Authenticated author can create, edit, delete essays

Tasks:
1. Create protected admin layout
2. Build admin dashboard listing all essays (drafts + published)
3. Create essay creation form (app/admin/new/page.tsx)
4. Create essay editing form (app/admin/edit/[slug]/page.tsx)
5. Implement API routes for CRUD operations
6. Add essay deletion with confirmation
7. Add status toggle (draft ↔ published)
8. Write E2E tests for admin CRUD operations

## Phase 6: Polish & Deployment

**Deliverable**: Production-ready blog deployed to Vercel

Tasks:
1. Optimize images and assets
2. Run Lighthouse audits and fix issues
3. Add proper meta tags for SEO
4. Create README with setup instructions
5. Test on multiple devices and browsers
6. Deploy to Vercel
7. Set up custom domain (if applicable)
8. Document deployment process

## Success Validation

After implementation, validate against spec's Success Criteria:

- [ ] SC-001: Reader can navigate from homepage to essay in <3 clicks
- [ ] SC-002: Search returns results in <500ms for 100 essays
- [ ] SC-003: Lighthouse accessibility score >90
- [ ] SC-004: Author can create and publish essay in <2 minutes
- [ ] SC-005: Unauthorized users cannot access admin (100%)
- [ ] SC-006: Deployed to Vercel free tier with $0 monthly cost
- [ ] SC-007: Content readable even if CSS fails
- [ ] SC-008: Mobile reading experience validated

## Open Questions (from spec.md)

These need answers before proceeding with implementation:

1. **Session duration**: How long should admin sessions last? Suggest: 7 days with "Remember me" checkbox
2. **Essay deletion**: Permanent delete or move to archive folder? Suggest: Permanent with confirmation dialog
3. **RSS feed**: Should we add RSS? It's standard for blogs. Suggest: Add in Phase 6
4. **About page**: Should there be an author bio page? Suggest: Add simple /about page
5. **Revision history**: Track changes or just current version? Suggest: Git history is sufficient

## Risk Assessment

**Low Risks**:
- Technology stack is proven and well-documented
- File-based content avoids database migration issues
- Free hosting tier has generous limits for low-traffic blog

**Medium Risks**:
- Search performance may degrade with 500+ essays (mitigation: use web workers if needed)
- Single password authentication is less secure than OAuth (mitigation: use strong password, HTTPS only)

**Mitigation Strategies**:
- Start with simple solutions, add complexity only when needed
- Comprehensive testing ensures features work as specified
- Git-based content provides easy rollback mechanism
