# Design Specification: Camthoi Blog

**Feature ID**: `001-camthoi-blog`
**Created**: 2026-02-27
**Status**: Draft
**Design Philosophy**: Palantir-inspired clean retro minimalism

---

## 1. Design Principles

### 1.1 Core Aesthetic

**Cool Minimal**: Subtle grays and blacks create sophisticated, modern minimalism without harsh contrast.

**Typography-First**: Content and type treatment are the primary design elements. No decorative embellishments.

**Brutalist Simplicity**: Raw, honest design with zero ornamentation. Pure function over form.

**Generous Whitespace**: Clean breathing room around all elements. Nothing feels cramped.

**Sharp Hierarchy**: Clear visual distinction between different content levels through type scale and spacing alone.

### 1.2 Inspiration

- **Palantir**: Clean, utilitarian presentation with systematic organization
- **Classic Print**: Traditional serif typography with generous margins
- **Brutalism**: Raw, honest design with no decoration

---

## 2. Color Palette

### 2.1 Base Colors

```css
/* Primary Colors */
--color-bg-primary: #FAFAFA;      /* Near-white background (softer than pure white) */
--color-text-primary: #1A1A1A;    /* Near-black text (softer than pure black) */
--color-text-secondary: #6B6B6B;  /* Medium gray for metadata */
--color-border: #E0E0E0;          /* Subtle borders and dividers */
--color-accent: #404040;          /* Dark gray for interactive elements */

/* Semantic Colors */
--color-link: #2C2C2C;            /* Darker gray for links */
--color-link-hover: #000000;      /* Pure black on hover */
--color-draft: #8A8A8A;           /* Light gray for draft indicator */
--color-published: #1A1A1A;       /* Near-black for published */
--color-error: #4A4A4A;           /* Keep monochromatic */
```

### 2.2 Rationale

- **Monochromatic**: Emphasizes content over decoration
- **Near-white background** (#FAFAFA): Reduces eye strain vs pure white
- **Near-black text** (#1A1A1A): Excellent contrast without harshness
- **All colors meet WCAG AA** accessibility standards

### 2.3 Usage Guide

| Element | Color | Variable |
|---------|-------|----------|
| Page background | #FAFAFA | `--color-bg-primary` |
| Body text | #1A1A1A | `--color-text-primary` |
| Dates, metadata | #6B6B6B | `--color-text-secondary` |
| Borders, dividers | #E0E0E0 | `--color-border` |
| Links (default) | #2C2C2C | `--color-link` |
| Links (hover) | #000000 | `--color-link-hover` |
| Buttons (default) | #1A1A1A | `--color-text-primary` |
| Buttons (hover) | #000000 | `--color-link-hover` |

---

## 3. Typography

### 3.1 Font Stack

**Primary Font**:
```css
font-family: Georgia, 'Times New Roman', serif;
```

**Rationale**:
- Georgia is web-safe (available on all platforms)
- Classic serif conveys timelessness and sophistication
- Excellent readability at all sizes
- Perfect for long-form reading

### 3.2 Type Scale

```css
/* Headings */
--font-size-h1: 3rem;        /* 48px - Page titles */
--font-size-h2: 1.75rem;     /* 28px - Post titles in listings */
--font-size-h3: 1.5rem;      /* 24px - Section headings */

/* Body */
--font-size-base: 1.125rem;  /* 18px - Body text */
--font-size-small: 0.875rem; /* 14px - Metadata, captions */

/* Line Heights */
--line-height-heading: 1.2;  /* Tight for headings */
--line-height-body: 1.8;     /* Generous for readability */

/* Font Weights */
--font-weight-normal: 400;   /* Body text */
--font-weight-semibold: 600; /* Headings, emphasis */
```

### 3.3 Typography Specifications

**H1 (Page Titles - "CAMTHOI")**:
```css
font-size: 3rem;             /* 48px */
font-weight: 400;            /* Regular */
line-height: 1.2;
letter-spacing: -0.02em;     /* Slight tightening */
margin: 0 0 3rem 0;
color: var(--color-text-primary);
```

**H2 (Post Titles on Homepage)**:
```css
font-size: 1.75rem;          /* 28px */
font-weight: 400;
line-height: 1.3;
margin: 0 0 0.5rem 0;
color: var(--color-text-primary);
```

**H3 (In-Post Section Headings)**:
```css
font-size: 1.5rem;           /* 24px */
font-weight: 600;            /* Semibold */
line-height: 1.4;
margin: 2rem 0 1rem 0;
color: var(--color-text-primary);
```

**Body Text (Paragraphs)**:
```css
font-size: 1.125rem;         /* 18px */
font-weight: 400;
line-height: 1.8;            /* 32.4px */
margin: 0 0 1.5rem 0;
max-width: 65ch;             /* Optimal line length */
color: var(--color-text-primary);
```

**Small Text (Dates, Metadata)**:
```css
font-size: 0.875rem;         /* 14px */
font-weight: 400;
line-height: 1.6;
color: var(--color-text-secondary);
```

**Links**:
```css
color: var(--color-link);
text-decoration: underline;
text-decoration-thickness: 1px;
text-underline-offset: 2px;
transition: color 0.15s ease, text-decoration-thickness 0.15s ease;

&:hover {
  color: var(--color-link-hover);
  text-decoration-thickness: 2px;
}
```

---

## 4. Spacing System

### 4.1 Spacing Scale

```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
--space-3xl: 6rem;    /* 96px */
```

### 4.2 Layout Constraints

```css
--content-max-width: 800px;   /* Max width for all content */
--reading-max-width: 65ch;    /* Max width for body text */
--padding-mobile: 1.5rem;     /* Side padding on mobile */
--padding-desktop: 4rem;      /* Side padding on desktop */
```

### 4.3 Vertical Rhythm

All vertical spacing uses multiples of 1.5rem (24px) for consistent rhythm.

---

## 5. Layout Specifications

### 5.1 Page Container

```css
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;  /* Mobile */
}

@media (min-width: 768px) {
  .page-container {
    padding: 4rem 2rem;  /* Desktop */
  }
}
```

### 5.2 Homepage Layout

```
┌─────────────────────────────────────┐
│                                     │
│  CAMTHOI                            │  ← H1 (48px)
│  ═════════════════════════════════  │  ← 1px border
│                                     │
│  Post Title One                     │  ← H2 (28px), link
│  February 27, 2026                  │  ← Small (14px), gray
│                                     │  ← 2rem spacing
│  Post Title Two                     │
│  February 20, 2026                  │
│                                     │
│  Post Title Three                   │
│  February 15, 2026                  │
│                                     │
│  [More posts...]                    │
│                                     │
│                                     │
│                                     │
│  About                              │  ← Link, small, gray
│                                     │
└─────────────────────────────────────┘
```

**Specifications**:
- Site title "CAMTHOI" at top left
- Thin horizontal divider below title
- Post list with 2rem spacing between items
- About link at bottom
- No sidebar, no header navigation
- Clean vertical flow

### 5.3 Individual Post Layout

```
┌─────────────────────────────────────┐
│                                     │
│  ← Home                             │  ← Back link (top-left)
│                                     │
│  Post Title Here                    │  ← H1 (48px)
│  February 27, 2026                  │  ← Small, gray
│  ═════════════════════════════════  │  ← Divider
│                                     │
│  Post content begins here in        │  ← Body (18px)
│  readable paragraphs. Maximum       │  ← Max 65ch width
│  line length is 65 characters.      │
│                                     │
│  Generous line spacing ensures      │
│  comfortable reading.               │
│                                     │
│  ## Section Heading                 │  ← H3 (24px)
│                                     │
│  More content continues with        │
│  proper hierarchy...                │
│                                     │
│  ═════════════════════════════════  │
│  ← Home                             │  ← Back link (bottom)
│                                     │
└─────────────────────────────────────┘
```

**Specifications**:
- Back link at top and bottom
- Title and date prominently displayed
- Divider separates meta from content
- Body text max-width 65ch
- Section headings with 2rem top margin

### 5.4 About Page Layout

Same as individual post layout, but without date.

### 5.5 Admin Dashboard Layout

```
┌─────────────────────────────────────┐
│  CAMTHOI ADMIN          Logout →    │  ← Header bar
│  ═════════════════════════════════  │
│                                     │
│  [+ New Post]                       │  ← Primary button
│                                     │
│  All Posts                          │  ← Heading
│                                     │
│  • My First Post        [Published] │  ← Post item
│    Feb 27, 2026    [Edit] [Delete]  │  ← Actions
│                                     │
│  • Draft Post              [Draft]  │
│    Feb 20, 2026    [Edit] [Delete]  │
│                                     │
│  • Another Post        [Published]  │
│    Feb 15, 2026    [Edit] [Delete]  │
│                                     │
└─────────────────────────────────────┘
```

**Specifications**:
- Header with admin title and logout
- New Post button (primary style)
- List of all posts with status badges
- Edit and Delete actions inline
- Bullet points for visual hierarchy

### 5.6 Post Form Layout

```
┌─────────────────────────────────────┐
│  ← Back to Dashboard                │
│                                     │
│  Create New Post                    │  ← Heading
│                                     │
│  Title                              │  ← Label
│  [_____________________________]    │  ← Input
│                                     │
│  Content (Markdown)                 │  ← Label
│  [                               ]  │
│  [                               ]  │  ← Textarea
│  [                               ]  │  ← (20 rows)
│  [                               ]  │
│                                     │
│  Status                             │  ← Label
│  ○ Save as Draft  ● Publish         │  ← Radio buttons
│                                     │
│  [Cancel]  [Save Draft]  [Publish]  │  ← Buttons
│                                     │
└─────────────────────────────────────┘
```

**Specifications**:
- Back link at top
- Full-width form inputs
- Clear labels above fields
- Radio buttons for status
- Button group at bottom

---

## 6. Component Designs

### 6.1 Button

**Default (Secondary)**:
```css
.button {
  background: transparent;
  border: 1px solid var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  font-family: Georgia, serif;
  font-size: 1rem;
  color: var(--color-text-primary);
  border-radius: 0;  /* Sharp corners, brutalist */
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.button:hover {
  background: var(--color-text-primary);
  color: var(--color-bg-primary);
}
```

**Primary**:
```css
.button-primary {
  background: var(--color-text-primary);
  color: var(--color-bg-primary);
  border: 1px solid var(--color-text-primary);
}

.button-primary:hover {
  background: var(--color-link-hover);
  border-color: var(--color-link-hover);
}
```

**Danger (Delete)**:
```css
.button-danger {
  border-color: var(--color-error);
  color: var(--color-error);
}

.button-danger:hover {
  background: var(--color-error);
  color: var(--color-bg-primary);
}
```

### 6.2 Input Fields

**Text Input**:
```css
.input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0;  /* No rounded corners */
  padding: 0.75rem;
  font-family: Georgia, serif;
  font-size: 1rem;
  background: #FFFFFF;
  color: var(--color-text-primary);
}

.input:focus {
  border-color: var(--color-text-primary);
  outline: none;
  box-shadow: none;  /* No shadow, maintain minimalism */
}
```

**Textarea**:
```css
.textarea {
  /* Same as .input */
  resize: vertical;  /* Allow vertical resize only */
  min-height: 400px;
}
```

### 6.3 Post List Item

```css
.post-item {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 2rem;
}

.post-item:last-child {
  border-bottom: none;
}

.post-title {
  font-size: 1.75rem;
  font-weight: 400;
  margin: 0 0 0.5rem 0;
  color: var(--color-link);
  text-decoration: none;
}

.post-title:hover {
  color: var(--color-link-hover);
  text-decoration: underline;
}

.post-date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
```

### 6.4 Status Badge

```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
}

.badge-draft {
  color: var(--color-draft);
  border-color: var(--color-draft);
}

.badge-published {
  color: var(--color-published);
  border-color: var(--color-published);
}
```

### 6.5 Divider

```css
.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 3rem 0;
}
```

---

## 7. Responsive Design

### 7.1 Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
```

### 7.2 Typography Adjustments

**Mobile (<640px)**:
```css
--font-size-h1: 2.5rem;   /* 40px */
--font-size-h2: 1.5rem;   /* 24px */
--font-size-base: 1rem;   /* 16px */
--padding-mobile: 1.5rem;
```

**Tablet (640px - 1024px)**:
```css
--font-size-h1: 2.75rem;  /* 44px */
--font-size-base: 1.0625rem; /* 17px */
--padding-mobile: 2rem;
```

**Desktop (>1024px)**:
```css
/* Use default values */
--padding-desktop: 4rem;
```

### 7.3 Layout Adjustments

**Mobile**:
- Single column
- Reduced spacing
- Smaller type sizes
- Compact button sizes

**Desktop**:
- Full spacing
- Full type scale
- Comfortable button sizes

---

## 8. Animation & Interaction

### 8.1 Philosophy

Minimal, functional animations only. No gratuitous motion.

### 8.2 Transitions

```css
/* Link hover */
transition: color 0.15s ease, text-decoration-thickness 0.15s ease;

/* Button hover */
transition: background-color 0.2s ease, color 0.2s ease;

/* Focus states - NO transition (instant for accessibility) */
```

### 8.3 No Page Transitions

Instant navigation maintains brutalist aesthetic. No fade-ins, slide-ins, or other page transitions.

---

## 9. Accessibility

### 9.1 Color Contrast

All text meets WCAG AA standards:
- Body text (#1A1A1A on #FAFAFA): **15.8:1** ✓
- Secondary text (#6B6B6B on #FAFAFA): **4.6:1** ✓
- Links (#2C2C2C on #FAFAFA): **11.5:1** ✓

### 9.2 Focus States

```css
*:focus-visible {
  outline: 2px solid var(--color-text-primary);
  outline-offset: 2px;
}
```

### 9.3 Semantic HTML

- Use `<nav>` for navigation
- Use `<article>` for blog posts
- Use `<h1>`-`<h6>` in proper hierarchy
- Use `<button>` for buttons (not `<div>` with click handlers)
- Use `<a>` for links

### 9.4 Screen Reader Support

- All images have alt text (N/A - text only)
- Form inputs have labels
- Buttons have descriptive text
- ARIA labels where needed

---

## 10. CSS Custom Properties

Complete design token system:

```css
:root {
  /* Colors */
  --color-bg-primary: #FAFAFA;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-border: #E0E0E0;
  --color-accent: #404040;
  --color-link: #2C2C2C;
  --color-link-hover: #000000;
  --color-draft: #8A8A8A;
  --color-published: #1A1A1A;
  --color-error: #4A4A4A;

  /* Typography */
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-size-h1: 3rem;
  --font-size-h2: 1.75rem;
  --font-size-h3: 1.5rem;
  --font-size-base: 1.125rem;
  --font-size-small: 0.875rem;
  --line-height-heading: 1.2;
  --line-height-body: 1.8;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;

  /* Layout */
  --content-max-width: 800px;
  --reading-max-width: 65ch;
  --padding-mobile: 1.5rem;
  --padding-desktop: 4rem;

  /* Effects */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
}
```

---

## 11. Design Checklist

Before implementation, verify:

**Colors**:
- [ ] All colors defined in CSS custom properties
- [ ] Contrast ratios meet WCAG AA
- [ ] Monochromatic palette maintained

**Typography**:
- [ ] Georgia font applied throughout
- [ ] Type scale implemented correctly
- [ ] Line heights set for readability
- [ ] Max-width 65ch for body text

**Spacing**:
- [ ] Consistent vertical rhythm
- [ ] Generous whitespace around elements
- [ ] Proper padding on all devices

**Layout**:
- [ ] Max-width 800px enforced
- [ ] Centered content container
- [ ] Responsive breakpoints working

**Components**:
- [ ] Buttons have proper states (default, hover, disabled)
- [ ] Inputs have focus states
- [ ] Links have underline and hover effect
- [ ] Status badges styled correctly

**Accessibility**:
- [ ] Focus states visible
- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## 12. Implementation Notes

### 12.1 Tailwind CSS Configuration

Configure Tailwind to match design tokens:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FAFAFA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        // ... etc
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      fontSize: {
        'h1': '3rem',
        'h2': '1.75rem',
        // ... etc
      },
    },
  },
};
```

### 12.2 Global Styles

Apply base typography styles globally:

```css
body {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-heading);
}
```

---

**Status**: Ready for implementation
**Next Step**: Begin Phase 0 - Project Setup
