# Database Setup Instructions

## Setup Neon Database (Required for adding posts)

### 1. Create a Neon Database Account

1. Go to https://neon.tech
2. Sign up for a free account (you can use your GitHub account)
3. Click "Create a project"
4. Give it a name like "camthoi-blog"
5. Select a region close to your users
6. Click "Create project"

### 2. Get Your Database Connection String

1. Once the project is created, you'll see a connection string
2. It will look like: `postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
3. Copy this entire string

### 3. Add to Vercel Environment Variables

Run these commands in your terminal:

```bash
cd "/Users/quanvu/Library/CloudStorage/GoogleDrive-minhquanvu3902@gmail.com/My Drive/01_WORK/09_Code/personal-blog"

# Add the DATABASE_URL (replace with your actual connection string)
printf '%s' 'postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require' | npx vercel env add DATABASE_URL production

# Also add it to your local .env.local for development
echo "DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require" >> .env.local
```

### 4. Initialize the Database

After deploying, you need to initialize the database schema. You can do this by:

1. Log in to your admin panel: https://personal-blog-neon-two.vercel.app/admin/login
2. Use a tool like curl or Postman to make a POST request to:
   ```bash
   curl -X POST https://personal-blog-neon-two.vercel.app/api/init-db \
     -H "Cookie: <your-session-cookie>"
   ```

Or manually run this SQL in the Neon SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
```

### 5. Deploy

```bash
# Commit changes
git add .
git commit -m "Add database support with Neon"
git push origin main

# Deploy to Vercel
npx vercel --prod
```

### 6. Test

After deployment:
1. Log in to https://personal-blog-neon-two.vercel.app/admin/login (password: `admin123`)
2. Try creating a new post
3. It should now work!

## What Changed

- **Added Neon PostgreSQL**: Posts are now stored in a database instead of markdown files
- **Updated API Routes**: `/api/posts` and `/api/posts/[id]` now use database queries
- **New Dependencies**: Added `@neondatabase/serverless` package
- **Database Schema**: Created a `posts` table with all necessary fields

## Why This Was Needed

Vercel's serverless environment has a read-only filesystem, so we can't write markdown files in production. Using a database solves this problem and is the proper solution for a production blog.
