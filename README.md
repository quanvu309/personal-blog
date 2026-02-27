# Personal Essay Blog

A minimalist personal essay blog inspired by Paul Graham's design philosophy, built with modern web technologies.

## Overview

This project follows Specification-Driven Development (SDD) methodology. The specifications drive implementation, ensuring alignment between intent and code.

## Project Status

**Current Phase**: Specification Complete
**Branch**: `001-personal-essay-blog`

## Features

- Clean, minimalist reading experience optimized for long-form essays
- Paul Graham-inspired typography with modern polish
- Client-side search across all essay content
- Password-protected admin interface for content management
- File-based markdown storage (portable, version-controlled)
- Fully responsive (mobile, tablet, desktop)
- Zero-cost deployment (Vercel free tier)

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Content**: Markdown files with frontmatter
- **Auth**: NextAuth.js (credentials provider)
- **Search**: Fuse.js (client-side)
- **Deployment**: Vercel

## Documentation

All specifications and implementation plans are in `/specs/001-personal-essay-blog/`:

- **[spec.md](./specs/001-personal-essay-blog/spec.md)** - Feature specification with user stories, requirements, and success criteria
- **[plan.md](./specs/001-personal-essay-blog/plan.md)** - Implementation plan with technology choices and phased development approach

## Getting Started

(To be added after implementation begins)

## Design Philosophy

### Content-First Minimalism

- Typography as the primary design element
- Generous whitespace
- No distracting visual embellishments
- Subtle modern UX without clutter

### Technology Principles

- **Lightweight**: Simple solutions over complex ones
- **Free**: All tools and hosting are free/open-source
- **Portable**: Content in portable markdown format
- **Modern**: Current web standards and best practices

## Development Workflow

This project follows SDD principles:

1. **Specification First**: Features start as detailed specifications (WHAT and WHY)
2. **Implementation Planning**: Technical decisions documented with rationale (HOW)
3. **Test-Driven**: Tests written before implementation
4. **Continuous Refinement**: Feedback loop between spec and code

## License

MIT

## Author

Personal project for writing and sharing essays.
