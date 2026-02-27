# Data Schemas

**Feature ID**: `001-camthoi-blog`
**Created**: 2026-02-27
**Type**: Data Contract

---

## Overview

This document defines all data structures, validation rules, and storage formats for the Camthoi blog application.

---

## 1. Post Entity

### 1.1 TypeScript Interface

```typescript
interface Post {
  id: string;           // Unique identifier (UUID v4)
  title: string;        // Post title
  slug: string;         // URL-friendly slug
  content: string;      // Markdown content
  date: string;         // Publication date (ISO 8601)
  status: PostStatus;   // Draft or published
  createdAt: string;    // Creation timestamp (ISO 8601)
  updatedAt: string;    // Last update timestamp (ISO 8601)
}

type PostStatus = 'draft' | 'published';
```

### 1.2 Validation Rules

```typescript
const PostValidation = {
  id: {
    required: true,
    type: 'string',
    format: 'uuid-v4',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },

  title: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 200,
    trim: true,
    example: 'My First Blog Post'
  },

  slug: {
    required: true,
    type: 'string',
    format: 'slug',  // lowercase, hyphens, alphanumeric only
    unique: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    example: 'my-first-blog-post'
  },

  content: {
    required: true,
    type: 'string',
    minLength: 1,
    format: 'markdown',
    example: '# Hello World\n\nThis is my first post.'
  },

  date: {
    required: true,
    type: 'string',
    format: 'iso8601',
    example: '2026-02-27T12:00:00Z'
  },

  status: {
    required: true,
    type: 'string',
    enum: ['draft', 'published'],
    default: 'draft'
  },

  createdAt: {
    required: true,
    type: 'string',
    format: 'iso8601',
    immutable: true,  // Cannot be changed after creation
    example: '2026-02-27T12:00:00Z'
  },

  updatedAt: {
    required: true,
    type: 'string',
    format: 'iso8601',
    autoUpdate: true,  // Automatically updated on any change
    example: '2026-02-27T14:30:00Z'
  }
};
```

### 1.3 Business Rules

1. **ID Generation**: Must be UUID v4, generated on creation, never changed
2. **Slug Generation**: Auto-generated from title using the following algorithm:
   ```
   1. Convert to lowercase
   2. Replace spaces with hyphens
   3. Remove all non-alphanumeric characters except hyphens
   4. Remove duplicate hyphens
   5. Trim hyphens from start and end
   6. If slug exists, append incrementing number (-2, -3, etc.)
   ```
3. **Date Handling**:
   - `date` represents publication date (for published posts) or intended date (for drafts)
   - `createdAt` is set once on creation
   - `updatedAt` is updated on every modification
4. **Status Transitions**:
   - Can change from `draft` to `published`
   - Can change from `published` to `draft`
   - No restrictions on transitions

### 1.4 Markdown File Format

Posts are stored as markdown files with frontmatter:

**Filename**: `{id}.md` (e.g., `123e4567-e89b-12d3-a456-426614174000.md`)

**Location**: `/content/posts/`

**Format**:
```markdown
---
id: "123e4567-e89b-12d3-a456-426614174000"
title: "My First Blog Post"
slug: "my-first-blog-post"
date: "2026-02-27T12:00:00Z"
status: "published"
createdAt: "2026-02-27T12:00:00Z"
updatedAt: "2026-02-27T12:00:00Z"
---

# Hello World

This is my first blog post content in **markdown** format.

## Section Heading

More content here...
```

---

## 2. Post Metadata Entity

### 2.1 TypeScript Interface

```typescript
interface PostMetadata {
  id: string;        // Matches Post.id
  title: string;     // Matches Post.title
  slug: string;      // Matches Post.slug
  date: string;      // Matches Post.date
  status: PostStatus; // Matches Post.status
}
```

### 2.2 Purpose

Used for fast post listing without reading full markdown files.

### 2.3 Storage Format

**Filename**: `/content/posts-metadata.json`

**Format**:
```json
{
  "posts": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "date": "2026-02-27T12:00:00Z",
      "status": "published"
    },
    {
      "id": "456e7890-e89b-12d3-a456-426614174000",
      "title": "Second Post",
      "slug": "second-post",
      "date": "2026-02-26T12:00:00Z",
      "status": "draft"
    }
  ],
  "lastUpdated": "2026-02-27T14:30:00Z"
}
```

### 2.4 Synchronization Rules

1. **Update Triggers**:
   - Post created → Add to metadata
   - Post updated → Update in metadata
   - Post deleted → Remove from metadata

2. **Consistency**:
   - Metadata must always reflect current post state
   - Metadata updated atomically with post file changes
   - If metadata is corrupted, regenerate from markdown files

---

## 3. About Page Entity

### 3.1 TypeScript Interface

```typescript
interface AboutPage {
  content: string;   // Markdown content
  updatedAt: string; // Last update timestamp (ISO 8601)
}
```

### 3.2 Validation Rules

```typescript
const AboutValidation = {
  content: {
    required: true,
    type: 'string',
    minLength: 0,  // Can be empty
    format: 'markdown'
  },

  updatedAt: {
    required: true,
    type: 'string',
    format: 'iso8601',
    autoUpdate: true
  }
};
```

### 3.3 Markdown File Format

**Filename**: `/content/about.md`

**Format**:
```markdown
---
updatedAt: "2026-02-27T12:00:00Z"
---

# About Me

I'm a writer who loves sharing thoughts about...

## Background

More about me...
```

---

## 4. Session Entity

### 4.1 TypeScript Interface

```typescript
interface Session {
  user: {
    name: string;
  };
  expires: string;  // ISO 8601 timestamp
}
```

### 4.2 Configuration

```typescript
const SessionConfig = {
  maxAge: 30 * 24 * 60 * 60,  // 30 days in seconds
  updateAge: 24 * 60 * 60,     // Update session every 24 hours
  strategy: 'jwt'               // Use JWT strategy
};
```

### 4.3 Storage

Sessions are managed by NextAuth.js using JWT tokens stored in HTTP-only cookies.

---

## 5. Slug Generation Algorithm

### 5.1 Function Signature

```typescript
function generateSlug(title: string, existingSlugs: string[]): string
```

### 5.2 Implementation Steps

```typescript
function generateSlug(title: string, existingSlugs: string[]): string {
  // Step 1: Convert to lowercase
  let slug = title.toLowerCase();

  // Step 2: Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Step 3: Remove non-alphanumeric characters (except hyphens)
  slug = slug.replace(/[^a-z0-9-]/g, '');

  // Step 4: Remove duplicate hyphens
  slug = slug.replace(/-+/g, '-');

  // Step 5: Trim hyphens from start and end
  slug = slug.replace(/^-+|-+$/g, '');

  // Step 6: Handle empty slug
  if (!slug) {
    slug = 'untitled';
  }

  // Step 7: Ensure uniqueness
  let finalSlug = slug;
  let counter = 2;
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}
```

### 5.3 Test Cases

```typescript
// Basic conversion
generateSlug('Hello World', [])
// → 'hello-world'

// Special characters
generateSlug('Hello, World!', [])
// → 'hello-world'

// Multiple spaces
generateSlug('Hello    World', [])
// → 'hello-world'

// Non-ASCII characters
generateSlug('Café Münchën', [])
// → 'caf-mnchen'

// Duplicate prevention
generateSlug('Hello', ['hello'])
// → 'hello-2'

generateSlug('Hello', ['hello', 'hello-2'])
// → 'hello-3'

// Empty/special only
generateSlug('!!!', [])
// → 'untitled'

// Numbers
generateSlug('2024 Review', [])
// → '2024-review'
```

---

## 6. ID Generation

### 6.1 Function Signature

```typescript
function generateId(): string
```

### 6.2 Implementation

```typescript
import { v4 as uuidv4 } from 'uuid';

function generateId(): string {
  return uuidv4(); // Generates UUID v4
}
```

### 6.3 Example Output

```
123e4567-e89b-12d3-a456-426614174000
```

---

## 7. Date Handling

### 7.1 Standards

All dates MUST be stored in ISO 8601 format with UTC timezone.

**Format**: `YYYY-MM-DDTHH:mm:ssZ`

**Example**: `2026-02-27T14:30:00Z`

### 7.2 Helper Functions

```typescript
// Get current timestamp
function now(): string {
  return new Date().toISOString();
}

// Format date for display
function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
// Example: "February 27, 2026"

// Parse frontmatter date
function parseFrontmatterDate(dateStr: string): Date {
  return new Date(dateStr);
}
```

---

## 8. Content Validation

### 8.1 Markdown Content Rules

1. **Allowed Markdown Features**:
   - Headers (h1-h6)
   - Paragraphs
   - Bold, italic, strikethrough
   - Links
   - Lists (ordered and unordered)
   - Blockquotes
   - Code blocks (inline and fenced)
   - Horizontal rules

2. **Forbidden Content**:
   - HTML tags (sanitized on render)
   - JavaScript
   - Iframes
   - Forms
   - Images (text-only constraint)

3. **Sanitization**:
   - Remove all HTML tags except safe markdown-generated ones
   - Escape potentially dangerous characters
   - Prevent XSS attacks

---

## 9. File System Structure

### 9.1 Content Directory Layout

```
/content/
  ├── posts/
  │   ├── 123e4567-e89b-12d3-a456-426614174000.md
  │   ├── 456e7890-e89b-12d3-a456-426614174001.md
  │   └── 789e0123-e89b-12d3-a456-426614174002.md
  ├── posts-metadata.json
  └── about.md
```

### 9.2 Naming Conventions

- **Post files**: `{uuid}.md`
- **About file**: `about.md` (fixed name)
- **Metadata file**: `posts-metadata.json` (fixed name)

---

## 10. Data Integrity Rules

### 10.1 Atomic Operations

All data mutations MUST be atomic:
1. Update markdown file
2. Update metadata cache
3. Commit to GitHub
4. If any step fails, rollback previous steps

### 10.2 Validation Order

1. Validate input data
2. Check uniqueness constraints (slug)
3. Generate derived fields (id, slug, timestamps)
4. Write to file system
5. Update metadata
6. Commit to version control

### 10.3 Error Recovery

- If metadata becomes inconsistent, rebuild from markdown files
- If file write fails, do not update metadata
- If Git commit fails, keep local changes but warn user

---

## 11. Constraints Summary

| Field | Constraint | Value |
|-------|-----------|-------|
| Post.title | Max length | 200 characters |
| Post.title | Min length | 1 character |
| Post.content | Min length | 1 character |
| Post.slug | Pattern | `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| Post.slug | Uniqueness | Must be unique across all posts |
| Post.id | Format | UUID v4 |
| Post.id | Uniqueness | Must be unique (guaranteed by UUID) |
| All dates | Format | ISO 8601 with UTC timezone |
| Session | Duration | 30 days (2,592,000 seconds) |

---

## 12. Testing Checklist

For each data operation, verify:

- [ ] Validation rules enforced
- [ ] Required fields present
- [ ] Data types correct
- [ ] Uniqueness constraints respected
- [ ] Timestamps auto-generated/updated correctly
- [ ] Slugs generated correctly
- [ ] IDs are valid UUIDs
- [ ] Markdown file format correct
- [ ] Metadata cache synchronized
- [ ] Data persists across restarts
- [ ] Edge cases handled (empty strings, special characters, duplicates)
