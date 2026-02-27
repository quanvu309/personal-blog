# Feature Specification: Camthoi Personal Blog

**Feature ID**: `001-camthoi-blog`
**Created**: 2026-02-27
**Status**: Approved - Ready for Implementation Planning
**Type**: New Feature
**Version**: 1.0

---

## 1. Overview

### 1.1 Purpose
A personal text-based blog system that allows an author to publish written content and readers to consume that content in a clean, focused reading environment.

### 1.2 Scope
This specification defines the functional requirements for a blog system with two primary user interfaces:
- **Public Interface**: For readers to browse and read published posts
- **Admin Interface**: For the author to create, edit, and manage posts

### 1.3 Goals
- Enable the author to publish written content without technical barriers
- Provide readers with a distraction-free reading experience
- Maintain content in a portable, durable format
- Require zero ongoing operational costs

---

## 2. User Roles

### 2.1 Reader (Primary User)
- **Description**: Any person visiting the public blog to read content
- **Access Level**: Public, no authentication required
- **Primary Goals**: Find and read published posts

### 2.2 Author (Admin User)
- **Description**: The blog owner who creates and manages content
- **Access Level**: Authenticated access to admin interface
- **Primary Goals**: Create, edit, publish, and manage blog posts
- **Quantity**: Exactly one author

---

## 3. User Stories

### Story 1: Reading Published Posts
**As a** reader
**I want to** browse a list of published posts and read their full content
**So that** I can consume the author's written work

**Acceptance Criteria**:

**AC-1.1**: Homepage displays all published posts
- **Given** I visit the blog homepage
- **When** the page loads
- **Then** I see a list of all published posts
- **And** each post shows its title
- **And** each post shows its publication date
- **And** posts are ordered by publication date (newest first)

**AC-1.2**: Navigate to individual post
- **Given** I am on the homepage
- **When** I click on a post title
- **Then** I navigate to a page showing the full post content
- **And** the post displays the title
- **And** the post displays the publication date
- **And** the post displays the full content in a readable format

**AC-1.3**: Navigate back to homepage
- **Given** I am reading a post
- **When** I want to return to the list
- **Then** there is a clear way to navigate back to the homepage

**AC-1.4**: Draft posts are hidden
- **Given** a post has draft status
- **When** I visit the homepage or try to access the post directly
- **Then** the draft post is not visible or accessible

**AC-1.5**: Responsive reading experience
- **Given** I access the blog from any device (mobile, tablet, desktop)
- **When** I view the homepage or a post
- **Then** the content is readable and properly formatted for my device

---

### Story 2: Creating New Posts
**As an** author
**I want to** create new blog posts through an admin interface
**So that** I can publish content without editing code or files

**Acceptance Criteria**:

**AC-2.1**: Access admin interface
- **Given** I navigate to the admin URL
- **When** I am not authenticated
- **Then** I am prompted to log in
- **And** cannot access admin features without authentication

**AC-2.2**: Create new post
- **Given** I am authenticated in the admin interface
- **When** I choose to create a new post
- **Then** I can enter a post title
- **And** I can write post content in markdown format
- **And** I can save the post as a draft
- **And** I can publish the post immediately

**AC-2.3**: Post validation
- **Given** I am creating a new post
- **When** I try to save without a title
- **Then** I receive an error message
- **When** I try to save without content
- **Then** I receive an error message

**AC-2.4**: Published post appears publicly
- **Given** I have published a new post
- **When** I view the public blog homepage
- **Then** the new post appears in the list
- **And** it is accessible to readers

**AC-2.5**: Draft post remains private
- **Given** I have saved a post as draft
- **When** I view the public blog homepage
- **Then** the draft post does not appear
- **And** readers cannot access it

---

### Story 3: Editing Existing Posts
**As an** author
**I want to** edit my published and draft posts
**So that** I can correct errors or update content

**Acceptance Criteria**:

**AC-3.1**: View all posts in admin
- **Given** I am authenticated in the admin interface
- **When** I view the admin dashboard
- **Then** I see a list of all posts (both published and draft)
- **And** each post's status is clearly indicated
- **And** I can identify which posts are published vs draft

**AC-3.2**: Edit post content
- **Given** I am viewing a post in the admin interface
- **When** I choose to edit the post
- **Then** I can modify the title
- **And** I can modify the content
- **And** I can save my changes

**AC-3.3**: Change post status
- **Given** I am editing a post
- **When** I change the status from draft to published
- **Then** the post becomes visible on the public blog
- **When** I change the status from published to draft
- **Then** the post is removed from the public blog

**AC-3.4**: Updates appear immediately
- **Given** I have saved changes to a published post
- **When** I view the public blog
- **Then** the updates are visible to readers

---

### Story 4: Deleting Posts
**As an** author
**I want to** permanently remove posts
**So that** I can clean up unwanted content

**Acceptance Criteria**:

**AC-4.1**: Delete post option
- **Given** I am viewing my posts in the admin interface
- **When** I choose to delete a post
- **Then** I am asked to confirm the deletion

**AC-4.2**: Permanent deletion
- **Given** I confirm post deletion
- **When** the deletion completes
- **Then** the post no longer appears in the admin interface
- **And** the post is not accessible on the public blog

---

### Story 5: Admin Authentication
**As an** author
**I want to** secure the admin interface with authentication
**So that** only I can manage blog content

**Acceptance Criteria**:

**AC-5.1**: Login requirement
- **Given** I access the admin URL
- **When** I am not authenticated
- **Then** I see a login interface
- **And** cannot access admin features

**AC-5.2**: Successful login
- **Given** I am on the login page
- **When** I enter valid credentials
- **Then** I gain access to the admin interface

**AC-5.3**: Failed login
- **Given** I am on the login page
- **When** I enter invalid credentials
- **Then** I see an error message
- **And** remain on the login page
- **And** do not gain access to admin features

**AC-5.4**: Session persistence
- **Given** I have successfully logged in
- **When** I navigate between admin pages
- **Then** I remain authenticated
- **And** do not need to log in again

**AC-5.5**: Logout
- **Given** I am authenticated
- **When** I choose to log out
- **Then** my session ends
- **And** I cannot access admin features without logging in again

---

## 4. Functional Requirements

### 4.1 Public Blog Interface

**FR-1.1**: The system MUST display a homepage listing all published posts
**FR-1.2**: The system MUST display each post's title on the homepage
**FR-1.3**: The system MUST display each post's publication date on the homepage
**FR-1.4**: The system MUST order posts by publication date, newest first
**FR-1.5**: The system MUST provide individual pages for each published post
**FR-1.6**: The system MUST render post content from markdown to formatted output
**FR-1.7**: The system MUST hide draft posts from public view
**FR-1.8**: The system MUST provide navigation from homepage to individual posts
**FR-1.9**: The system MUST provide navigation from individual posts back to homepage
**FR-1.10**: The system MUST be responsive across device sizes
**FR-1.11**: The system MUST provide an About page accessible from public interface
**FR-1.12**: The About page MUST display author-provided content

### 4.2 Admin Interface

**FR-2.1**: The system MUST provide an admin interface separate from public interface
**FR-2.2**: The system MUST require authentication to access admin features
**FR-2.3**: The system MUST provide a login interface
**FR-2.4**: The system MUST validate credentials during login
**FR-2.5**: The system MUST maintain authenticated sessions
**FR-2.6**: The system MUST provide a logout function
**FR-2.7**: The system MUST display all posts (published and draft) in admin
**FR-2.8**: The system MUST indicate post status (draft vs published)

### 4.3 Post Management

**FR-3.1**: The system MUST allow creation of new posts
**FR-3.2**: The system MUST accept post title as required input
**FR-3.3**: The system MUST accept post content in markdown format as required input
**FR-3.4**: The system MUST support two post statuses: draft and published
**FR-3.5**: The system MUST validate that posts have both title and content
**FR-3.6**: The system MUST allow editing of existing posts
**FR-3.7**: The system MUST allow changing post status
**FR-3.8**: The system MUST allow deletion of posts
**FR-3.9**: The system MUST confirm deletion before permanent removal
**FR-3.10**: The system MUST generate unique URLs for each post
**FR-3.11**: The system MUST track publication date for each post
**FR-3.12**: The system MUST immediately reflect changes when posts are published/unpublished

### 4.4 Content Storage

**FR-4.1**: The system MUST store posts in a portable format
**FR-4.2**: The system MUST preserve post content across system restarts
**FR-4.3**: The system MUST maintain post metadata (title, date, status)
**FR-4.4**: The system MUST support version control of content

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-1.1**: Homepage MUST load in under 2 seconds on standard broadband
**NFR-1.2**: Individual post pages MUST load in under 2 seconds on standard broadband
**NFR-1.3**: Admin operations MUST complete in under 1 second for typical actions

### 5.2 Usability

**NFR-2.1**: Reading interface MUST prioritize content readability
**NFR-2.2**: Text MUST be easily readable without zooming on mobile devices
**NFR-2.3**: Admin interface MUST be usable without technical documentation
**NFR-2.4**: Author MUST be able to create and publish a post in under 5 minutes

### 5.3 Accessibility

**NFR-3.1**: Public interface MUST meet WCAG 2.1 Level AA standards
**NFR-3.2**: Content MUST be navigable via keyboard only
**NFR-3.3**: Content MUST be readable by screen readers
**NFR-3.4**: Interface MUST use semantic HTML

### 5.4 Security

**NFR-4.1**: Admin interface MUST be protected by authentication
**NFR-4.2**: Unauthorized users MUST NOT access admin features
**NFR-4.3**: Credentials MUST NOT be stored in plain text
**NFR-4.4**: System MUST protect against common web vulnerabilities (XSS, injection)

### 5.5 Reliability

**NFR-5.1**: System MUST be available 99% of the time
**NFR-5.2**: Content MUST NOT be lost due to system failures
**NFR-5.3**: Admin operations MUST complete successfully or provide clear error messages

### 5.6 Maintainability

**NFR-6.1**: Content MUST be stored in human-readable format
**NFR-6.2**: Content MUST be exportable
**NFR-6.3**: System MUST allow content migration to other platforms

### 5.7 Cost

**NFR-7.1**: System MUST be deployable at zero monthly cost
**NFR-7.2**: System MUST use only free and open-source tools

---

## 6. Data Requirements

### 6.1 Post Entity

A Post represents a single blog article.

**Required Attributes**:
- **identifier**: Unique identifier for the post
- **title**: Post title (text)
- **content**: Post content in markdown (text)
- **status**: Either "draft" or "published"
- **publication_date**: Date when post was/will be published

**Derived/System Attributes**:
- **url_slug**: URL-safe version of title
- **created_at**: Timestamp when post was created
- **updated_at**: Timestamp when post was last modified

**Validation Rules**:
- Title MUST NOT be empty
- Content MUST NOT be empty
- Status MUST be either "draft" or "published"
- Publication date MUST be a valid date
- Each post MUST have a unique identifier
- Each post MUST have a unique URL slug

### 6.2 Author Session

An Author Session represents an authenticated admin user.

**Required Attributes**:
- **session_id**: Unique session identifier
- **authenticated**: Boolean authentication state
- **created_at**: When session was created
- **expires_at**: When session expires

---

## 7. Interface Requirements

### 7.1 Public Interface URLs

The system MUST provide these public-facing URLs:

- **Homepage**: Displays list of published posts
- **Post Page**: Displays individual post (one URL per post)
- **About Page**: Displays author information

URL structure requirements:
- URLs MUST be human-readable
- URLs MUST be permanent (not change after publication)
- URLs MUST uniquely identify posts
- Post URLs MUST follow pattern: `/posts/{auto-generated-slug}`
- About page URL MUST be `/about`

### 7.2 Admin Interface URLs

The system MUST provide these admin URLs:

- **Login Page**: Authenticates the author
- **Admin Dashboard**: Lists all posts and provides management options
- **Create Post Page**: Interface for creating new posts
- **Edit Post Page**: Interface for editing existing posts (one URL per post)

---

## 8. Constraints

### 8.1 Technical Constraints
- MUST be deployable to GitHub Pages or equivalent static hosting
- MUST work without requiring paid services
- MUST support markdown as content format

### 8.2 Content Constraints
- Content MUST be text-only (no images, videos, or media files)
- Post URLs MUST follow pattern: `/posts/{auto-generated-slug}`
- URL slugs MUST be auto-generated from post titles

### 8.3 User Constraints
- System supports exactly ONE author (no multi-user support)
- No reader accounts or authentication required

---

## 9. Success Criteria

The feature is considered successful when:

**SC-1**: A reader can navigate from homepage to reading a full post in 2 clicks or less
**SC-2**: The author can create and publish a new post in under 3 minutes
**SC-3**: The public blog interface achieves 90+ score on Lighthouse accessibility audit
**SC-4**: Unauthorized users have 0% success rate accessing admin features
**SC-5**: The system is deployed with $0 monthly hosting costs
**SC-6**: Post content remains accessible even if styling fails to load
**SC-7**: All user stories have passing acceptance tests

---

## 10. Out of Scope

The following features are explicitly NOT included:

- Search functionality
- Post categories or tags
- Comments system
- Social media sharing
- Analytics or visitor tracking
- RSS feed generation
- Multiple author support
- Post scheduling
- Image or media uploads
- Email notifications
- Dark mode
- Reading time estimates
- Related posts
- Custom domains (handled at hosting level)

---

## 11. Requirements Clarifications

All open questions have been resolved:

**R1 - Session Duration**: Admin sessions MUST remain active for 30 days before requiring re-authentication

**R2 - About Page**: System MUST provide an "About" page where the author can share information

**R3 - Post Metadata**: Posts MUST display only title and publication date (no word count or reading time)

**R4 - Deleted Post URLs**: System MUST return a 404 error page when accessing URLs of deleted posts

**R5 - URL Generation**: System MUST auto-generate post URLs from titles (no manual customization)

---

## 12. Assumptions

This specification assumes:

**A1**: The author has basic familiarity with markdown syntax
**A2**: The author can access the hosting platform to deploy updates
**A3**: Readers have modern web browsers (last 2 versions of major browsers)
**A4**: Internet connectivity is available for both author and readers
**A5**: The author will manage content backups if required

---

## 13. Dependencies

This feature depends on:

**D1**: A hosting platform that supports static sites (e.g., GitHub Pages)
**D2**: A markdown rendering library or capability
**D3**: A method for persistent data storage

---

## 14. Acceptance Testing Approach

Each user story's acceptance criteria will be verified through:

- **Manual testing**: For user interface and experience validation
- **Automated testing**: For functional requirements where applicable
- **Cross-browser testing**: On Chrome, Firefox, Safari (desktop and mobile)
- **Accessibility testing**: Using automated tools + manual screen reader testing

---

## Appendix A: Edge Cases

The system must handle these edge cases:

1. **Empty title**: System MUST reject post creation/update
2. **Empty content**: System MUST reject post creation/update
3. **Duplicate titles**: System MUST handle gracefully (generate unique slugs)
4. **Very long titles** (>200 chars): System MUST either truncate or validate
5. **Special characters in titles**: System MUST generate valid URL slugs
6. **Malformed markdown**: System MUST render without breaking page layout
7. **Concurrent admin sessions**: System MUST handle author logged in on multiple devices
8. **Session expiration during editing**: System MUST either preserve work or warn user
9. **Direct URL access to draft post**: System MUST return 404 or similar for non-admin users
10. **Deleted post URL access**: System MUST return 404 or similar

---

**Specification Version**: 1.0
**Last Updated**: 2026-02-27
**Next Step**: Create implementation plan (plan.md)
