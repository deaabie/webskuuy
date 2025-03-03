
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/591701b0-a550-4cc2-8b31-b8d8f54e6b8b

## Quick Start Guide

### Step 1: Clone and Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

### Step 2: Supabase Setup

This project uses Supabase for backend functionality. Follow these steps to set up your Supabase project:

1. Create a Supabase account at [supabase.com](https://supabase.com) if you don't have one
2. Create a new Supabase project
3. Once your project is created, go to Project Settings -> API to find your project URL and anon key
4. Create the required database tables by running these SQL commands in the Supabase SQL editor:

```sql
-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    categories TEXT[] DEFAULT '{}',
    logo TEXT,
    status TEXT DEFAULT 'upcoming',
    installation_guide TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password)
VALUES ('admin', 'admin123');
```

5. In your project, update the Supabase configuration in `src/integrations/supabase/client.ts` with your project's URL and anon key:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/pages` - Page components
  - `/services` - API and service functions
  - `/hooks` - Custom React hooks
  - `/types` - TypeScript type definitions
  - `/integrations` - Third-party integrations (Supabase)

## Built With

This project uses modern web technologies:

- Vite - Fast build tool and dev server
- TypeScript - Type-safe JavaScript
- React - UI framework
- shadcn-ui - Beautiful UI components
- Tailwind CSS - Utility-first CSS framework
- Supabase - Backend as a Service (BaaS)

## How to Edit This Project

### Option 1: Use Lovable (Recommended)

Visit the [Lovable Project](https://lovable.dev/projects/591701b0-a550-4cc2-8b31-b8d8f54e6b8b) and start prompting. Changes made via Lovable will be committed automatically.

### Option 2: Use Your IDE

Work locally using your preferred IDE. Changes pushed to the repo will be reflected in Lovable.

### Option 3: Edit in GitHub

Edit files directly on GitHub:
1. Navigate to the file
2. Click the "Edit" button (pencil icon)
3. Make changes and commit

### Option 4: Use GitHub Codespaces

1. Go to the main repository page
2. Click "Code" -> "Codespaces"
3. Click "New codespace"

## Deployment

### Option 1: Using Lovable
Open [Lovable](https://lovable.dev/projects/591701b0-a550-4cc2-8b31-b8d8f54e6b8b) and click Share -> Publish.

### Option 2: Custom Domain
While we don't support custom domains directly, you can deploy to Netlify. Visit our docs for details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Admin Panel

The project includes an admin panel at `/admin`. Default credentials:
- Username: admin
- Password: admin123

Be sure to change these credentials in production!

## Need Help?

- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Join our [Discord Community](https://discord.gg/lovable)
- Watch tutorials on our [YouTube Channel](https://www.youtube.com/@lovabledev)
