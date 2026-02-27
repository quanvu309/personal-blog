# API Route Contracts

**Feature ID**: `001-camthoi-blog`
**Created**: 2026-02-27
**Type**: Interface Contract

---

## Overview

This document defines the contracts for all API routes in the Camthoi blog application. All routes follow REST conventions and return JSON responses.

---

## Authentication

All admin API routes require authentication via NextAuth session.

**Session Check**:
```typescript
// All admin routes must verify session
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}
```

---

## Common Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Success Response Example**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response Example**:
```json
{
  "success": false,
  "error": "Validation failed: Title is required"
}
```

---

## POST /api/posts

Create a new blog post.

**Authentication**: Required

**Request Body**:
```typescript
{
  title: string;        // Required, min 1 char
  content: string;      // Required, min 1 char
  status: 'draft' | 'published';  // Required
}
```

**Request Example**:
```json
{
  "title": "My First Post",
  "content": "# Hello\n\nThis is my first post.",
  "status": "draft"
}
```

**Response (201 Created)**:
```typescript
{
  success: true;
  data: Post;  // Full post object with generated id, slug, timestamps
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "# Hello\n\nThis is my first post.",
    "status": "draft",
    "date": "2026-02-27T12:00:00Z",
    "createdAt": "2026-02-27T12:00:00Z",
    "updatedAt": "2026-02-27T12:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (missing title or content)
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error (GitHub API failure, etc.)

**Side Effects**:
- Creates markdown file in `/content/posts/`
- Updates `posts-metadata.json`
- Commits changes to GitHub repository
- Generates unique ID and slug

---

## GET /api/posts

Get all posts (published only for public, all for authenticated admin).

**Authentication**: Optional (returns only published if not authenticated)

**Query Parameters**: None

**Response (200 OK)**:
```typescript
{
  success: true;
  data: PostMetadata[];  // Array of post metadata
}
```

**Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "title": "My First Post",
      "slug": "my-first-post",
      "date": "2026-02-27T12:00:00Z",
      "status": "published"
    },
    {
      "id": "def456",
      "title": "Draft Post",
      "slug": "draft-post",
      "date": "2026-02-28T12:00:00Z",
      "status": "draft"
    }
  ]
}
```

**Filtering**:
- If not authenticated: Only returns posts with `status: "published"`
- If authenticated: Returns all posts (draft and published)
- Always sorted by date (newest first)

**Error Responses**:
- `500 Internal Server Error`: Failed to read posts

---

## GET /api/posts/[id]

Get a single post by ID.

**Authentication**: Optional (draft posts require authentication)

**Path Parameters**:
- `id`: Post ID (string)

**Response (200 OK)**:
```typescript
{
  success: true;
  data: Post;  // Full post object
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "# Hello\n\nThis is my first post.",
    "status": "published",
    "date": "2026-02-27T12:00:00Z",
    "createdAt": "2026-02-27T12:00:00Z",
    "updatedAt": "2026-02-27T12:00:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Trying to access draft post without authentication
- `404 Not Found`: Post ID does not exist
- `500 Internal Server Error`: Failed to read post

---

## PATCH /api/posts/[id]

Update an existing post.

**Authentication**: Required

**Path Parameters**:
- `id`: Post ID (string)

**Request Body** (all fields optional):
```typescript
{
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
}
```

**Request Example**:
```json
{
  "title": "Updated Title",
  "status": "published"
}
```

**Response (200 OK)**:
```typescript
{
  success: true;
  data: Post;  // Updated post object
}
```

**Validation**:
- If `title` provided, must not be empty
- If `content` provided, must not be empty
- If `status` provided, must be 'draft' or 'published'
- At least one field must be provided

**Side Effects**:
- Updates markdown file in `/content/posts/`
- Updates `posts-metadata.json`
- Updates `updatedAt` timestamp
- Regenerates slug if title changed
- Commits changes to GitHub repository

**Error Responses**:
- `400 Bad Request`: Validation failed or no fields provided
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post ID does not exist
- `500 Internal Server Error`: Server error

---

## DELETE /api/posts/[id]

Permanently delete a post.

**Authentication**: Required

**Path Parameters**:
- `id`: Post ID (string)

**Request Body**: None

**Response (200 OK)**:
```typescript
{
  success: true;
  message: 'Post deleted successfully';
}
```

**Response Example**:
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Side Effects**:
- Deletes markdown file from `/content/posts/`
- Updates `posts-metadata.json`
- Commits changes to GitHub repository
- Post is permanently removed (no soft delete)

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post ID does not exist
- `500 Internal Server Error`: Failed to delete post

---

## GET /api/about

Get the About page content.

**Authentication**: Not required

**Query Parameters**: None

**Response (200 OK)**:
```typescript
{
  success: true;
  data: AboutPage;
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "content": "# About Me\n\nI'm a writer...",
    "updatedAt": "2026-02-27T12:00:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: About page doesn't exist yet
- `500 Internal Server Error`: Failed to read about page

---

## PATCH /api/about

Update the About page content.

**Authentication**: Required

**Request Body**:
```typescript
{
  content: string;  // Required, markdown content
}
```

**Request Example**:
```json
{
  "content": "# About Me\n\nUpdated bio..."
}
```

**Response (200 OK)**:
```typescript
{
  success: true;
  data: AboutPage;
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "content": "# About Me\n\nUpdated bio...",
    "updatedAt": "2026-02-27T14:30:00Z"
  }
}
```

**Side Effects**:
- Updates `/content/about.md` file
- Updates `updatedAt` timestamp
- Commits changes to GitHub repository

**Error Responses**:
- `400 Bad Request`: Content field missing or empty
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Failed to update about page

---

## POST /api/auth/[...nextauth]

NextAuth.js authentication endpoints.

**Note**: These are handled by NextAuth.js library. See NextAuth documentation for full contract.

**Key Endpoints**:
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

**Session Response Example**:
```json
{
  "user": {
    "name": "Admin"
  },
  "expires": "2026-03-29T12:00:00Z"
}
```

---

## Error Handling Standards

All routes must handle these error scenarios:

1. **Validation Errors** (400):
   ```json
   {
     "success": false,
     "error": "Validation failed: Title is required"
   }
   ```

2. **Authentication Errors** (401):
   ```json
   {
     "success": false,
     "error": "Unauthorized"
   }
   ```

3. **Not Found Errors** (404):
   ```json
   {
     "success": false,
     "error": "Post not found"
   }
   ```

4. **Server Errors** (500):
   ```json
   {
     "success": false,
     "error": "Internal server error",
     "message": "GitHub API connection failed"
   }
   ```

---

## Rate Limiting

**Note**: GitHub API has rate limits (5000 requests/hour for authenticated requests).

- Admin operations are limited by GitHub API rate limits
- Implement exponential backoff for failed GitHub API calls
- Cache post metadata to reduce GitHub API calls

---

## Testing Checklist

For each API route, verify:

- [ ] Returns correct response format
- [ ] Validates required fields
- [ ] Checks authentication where required
- [ ] Returns appropriate HTTP status codes
- [ ] Handles errors gracefully
- [ ] Performs declared side effects
- [ ] Commits to GitHub successfully
- [ ] Updates metadata cache correctly
