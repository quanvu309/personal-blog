# Component Contracts

**Feature ID**: `001-camthoi-blog`
**Created**: 2026-02-27
**Type**: Component Interface Contract

---

## Overview

This document defines the interface contracts for all React components in the Camthoi blog application, including props, events, and behavior.

---

## 1. PostList Component

**Purpose**: Display a list of blog posts on the homepage

**Location**: `components/PostList.tsx`

### 1.1 Props Interface

```typescript
interface PostListProps {
  posts: PostMetadata[];  // Array of post metadata
  showStatus?: boolean;   // Show draft/published status (admin only)
}
```

### 1.2 Behavior

- Displays posts in reverse chronological order (newest first)
- Each post shows title and formatted date
- Clicking a post title navigates to `/posts/{slug}`
- If `showStatus` is true, displays status badge for each post
- If `posts` is empty, displays "No posts yet" message

### 1.3 Example Usage

```tsx
// Public homepage
<PostList posts={publishedPosts} />

// Admin dashboard
<PostList posts={allPosts} showStatus={true} />
```

### 1.4 Accessibility

- Uses `<nav>` with `aria-label="Blog posts"`
- Each post link is focusable and keyboard-navigable
- Semantic heading hierarchy

---

## 2. PostContent Component

**Purpose**: Render markdown content as formatted HTML

**Location**: `components/PostContent.tsx`

### 2.1 Props Interface

```typescript
interface PostContentProps {
  content: string;     // Markdown content
  className?: string;  // Additional CSS classes
}
```

### 2.2 Behavior

- Parses markdown to HTML
- Sanitizes HTML to prevent XSS
- Applies typography styles
- Preserves code blocks with syntax highlighting (optional)
- Renders blockquotes, lists, headers appropriately

### 2.3 Example Usage

```tsx
<PostContent content={post.content} />
```

### 2.4 Security

- MUST sanitize all HTML output
- MUST escape user-generated content
- MUST prevent script injection

### 2.5 Accessibility

- Rendered HTML uses semantic tags
- Headings maintain proper hierarchy
- Links have descriptive text

---

## 3. PostForm Component

**Purpose**: Form for creating and editing blog posts

**Location**: `components/PostForm.tsx`

### 3.1 Props Interface

```typescript
interface PostFormProps {
  mode: 'create' | 'edit';          // Form mode
  initialData?: Partial<Post>;      // Initial values (for edit mode)
  onSubmit: (data: PostFormData) => Promise<void>;  // Submit handler
  onCancel: () => void;              // Cancel handler
  isLoading?: boolean;               // Loading state
}

interface PostFormData {
  title: string;
  content: string;
  status: 'draft' | 'published';
}
```

### 3.2 Behavior

**Create Mode**:
- Empty form
- Submit button shows "Create Draft" or "Publish"
- Validates before submission

**Edit Mode**:
- Pre-populated with `initialData`
- Submit button shows "Save" or "Publish"
- Can toggle between draft and published

**Validation**:
- Title required (min 1 char)
- Content required (min 1 char)
- Shows validation errors inline
- Disables submit while `isLoading` is true

**Events**:
- `onSubmit`: Called with form data when submitted
- `onCancel`: Called when cancel button clicked

### 3.3 Example Usage

```tsx
// Create new post
<PostForm
  mode="create"
  onSubmit={handleCreate}
  onCancel={() => router.push('/admin')}
/>

// Edit existing post
<PostForm
  mode="edit"
  initialData={post}
  onSubmit={handleUpdate}
  onCancel={() => router.back()}
  isLoading={isSaving}
/>
```

### 3.4 Form Fields

```typescript
interface FormFields {
  title: {
    type: 'text';
    label: 'Title';
    required: true;
    placeholder: 'Enter post title';
    maxLength: 200;
  };

  content: {
    type: 'textarea';
    label: 'Content (Markdown)';
    required: true;
    placeholder: 'Write your post in markdown...';
    rows: 20;
  };

  status: {
    type: 'radio';
    label: 'Status';
    options: [
      { value: 'draft', label: 'Save as Draft' },
      { value: 'published', label: 'Publish' }
    ];
  };
}
```

### 3.5 Accessibility

- All form fields have labels
- Validation errors announced to screen readers
- Focus management on error
- Keyboard navigation supported

---

## 4. AdminNav Component

**Purpose**: Navigation bar for admin interface

**Location**: `components/AdminNav.tsx`

### 4.1 Props Interface

```typescript
interface AdminNavProps {
  currentPath?: string;  // Current route path
  onLogout: () => void;  // Logout handler
}
```

### 4.2 Behavior

- Displays "CAMTHOI ADMIN" title
- Shows navigation links (Dashboard, New Post)
- Highlights current page
- Displays logout button
- Responsive: collapses to hamburger menu on mobile

### 4.3 Navigation Items

```typescript
const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'New Post', href: '/admin/posts/new' },
  { label: 'Edit About', href: '/admin/about/edit' }
];
```

### 4.4 Example Usage

```tsx
<AdminNav
  currentPath={pathname}
  onLogout={handleLogout}
/>
```

---

## 5. Layout Components

### 5.1 PublicLayout

**Purpose**: Layout wrapper for public pages

**Location**: `app/layout.tsx`

```typescript
interface PublicLayoutProps {
  children: React.ReactNode;
}
```

**Behavior**:
- Renders site header with "CAMTHOI" title
- Renders navigation (Home, About)
- Renders children
- No authentication required

### 5.2 AdminLayout

**Purpose**: Protected layout for admin pages

**Location**: `app/admin/layout.tsx`

```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}
```

**Behavior**:
- Checks authentication (redirects to login if not authenticated)
- Renders AdminNav component
- Renders children
- Handles session expiry

---

## 6. DeleteConfirmation Component

**Purpose**: Modal for confirming post deletion

**Location**: `components/DeleteConfirmation.tsx`

### 6.1 Props Interface

```typescript
interface DeleteConfirmationProps {
  isOpen: boolean;              // Modal visibility
  postTitle: string;            // Title of post to delete
  onConfirm: () => Promise<void>;  // Confirm handler
  onCancel: () => void;         // Cancel handler
  isLoading?: boolean;          // Loading state
}
```

### 6.2 Behavior

- Displays modal overlay when `isOpen` is true
- Shows post title in confirmation message
- "Cancel" button calls `onCancel`
- "Delete" button calls `onConfirm`
- Disables buttons while `isLoading` is true
- Closes on Escape key press

### 6.3 Example Usage

```tsx
<DeleteConfirmation
  isOpen={showDeleteModal}
  postTitle={selectedPost.title}
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteModal(false)}
  isLoading={isDeleting}
/>
```

### 6.4 Accessibility

- Traps focus within modal
- Returns focus to trigger element on close
- Announces modal to screen readers
- Escape key closes modal

---

## 7. LoadingSpinner Component

**Purpose**: Visual loading indicator

**Location**: `components/ui/LoadingSpinner.tsx`

### 7.1 Props Interface

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';  // Spinner size
  className?: string;          // Additional classes
}
```

### 7.2 Behavior

- Displays animated spinner
- Centers in container
- Accessible label for screen readers

### 7.3 Example Usage

```tsx
<LoadingSpinner size="md" />
```

---

## 8. ErrorMessage Component

**Purpose**: Display error messages

**Location**: `components/ui/ErrorMessage.tsx`

### 8.1 Props Interface

```typescript
interface ErrorMessageProps {
  message: string;       // Error message text
  onDismiss?: () => void;  // Optional dismiss handler
}
```

### 8.2 Behavior

- Displays error message with error styling
- Shows dismiss button if `onDismiss` provided
- Announced to screen readers with `role="alert"`

### 8.3 Example Usage

```tsx
{error && (
  <ErrorMessage
    message={error}
    onDismiss={() => setError(null)}
  />
)}
```

---

## 9. Button Component

**Purpose**: Reusable button with variants

**Location**: `components/ui/Button.tsx`

### 9.1 Props Interface

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}
```

### 9.2 Variants

- **primary**: Black background, white text
- **secondary**: Transparent background, black border
- **danger**: Red background (for delete actions)

### 9.3 Behavior

- Shows loading spinner when `isLoading` is true
- Disabled when `disabled` or `isLoading` is true
- Calls `onClick` on click (unless disabled)

### 9.4 Example Usage

```tsx
<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>

<Button variant="danger" isLoading={isDeleting}>
  Delete
</Button>
```

---

## 10. Component Testing Checklist

For each component, verify:

**Props**:
- [ ] All required props provided
- [ ] Optional props have sensible defaults
- [ ] Prop types validated

**Rendering**:
- [ ] Renders correctly with valid props
- [ ] Handles empty/null data gracefully
- [ ] Updates when props change

**Behavior**:
- [ ] Event handlers called with correct arguments
- [ ] Side effects execute as expected
- [ ] Loading states display correctly
- [ ] Error states display correctly

**Accessibility**:
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] ARIA attributes correct
- [ ] Focus management proper
- [ ] Color contrast meets WCAG AA

**Responsive**:
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Works on desktop

---

## 11. State Management Patterns

### 11.1 Local Component State

Use for:
- Form input values
- UI state (modals, dropdowns)
- Temporary data

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<PostFormData>({
  title: '',
  content: '',
  status: 'draft'
});
```

### 11.2 Server State

Use for:
- Post data
- About page content
- Any data fetched from API

Pattern: Fetch on mount, show loading state, handle errors

```typescript
const [posts, setPosts] = useState<Post[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchPosts()
    .then(setPosts)
    .catch(err => setError(err.message))
    .finally(() => setIsLoading(false));
}, []);
```

### 11.3 Form State

Pattern: Controlled components with validation

```typescript
const [formData, setFormData] = useState({ ... });
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  await onSubmit(formData);
};
```

---

## 12. Component Communication Patterns

### 12.1 Parent → Child

Via props:
```tsx
<PostList posts={posts} />
```

### 12.2 Child → Parent

Via callback props:
```tsx
<PostForm onSubmit={handleSubmit} />
```

### 12.3 Sibling → Sibling

Via shared parent state:
```tsx
function ParentComponent() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <>
      <PostList onSelect={setSelectedPost} />
      <PostDetails post={selectedPost} />
    </>
  );
}
```

---

## Next Steps

After component contracts are implemented:
1. Build actual components following these contracts
2. Write unit tests for each component
3. Create Storybook stories (optional)
4. Document component usage examples
