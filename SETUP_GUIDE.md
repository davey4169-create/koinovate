# Koinovate - Complete Setup Guide

## Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Vercel account (for deployment)
- Paystack account (already integrated)

## Environment Variables (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Auth
NEXTAUTH_SECRET=your_secret_key_min_32_chars
NEXTAUTH_URL=http://localhost:3000

# Paystack (existing)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_key
PAYSTACK_SECRET_KEY=your_paystack_secret
```

## Database Setup (Supabase SQL)

Run the SQL migration file in Supabase SQL Editor:
1. Go to Supabase Dashboard > SQL Editor
2. Create a new query
3. Copy and run the contents of `/db-migrations/001_init.sql`

This creates:
- `users` table (with roles, plans, features)
- `membership_plans` table
- `surveys` table
- `courses` table
- `tasks` table
- `user_surveys` table
- `user_courses` table
- `user_tasks` table
- `admin_logs` table

## Features by Plan

### Free Plan
- Basic dashboard
- View published surveys only
- View free courses only
- View basic tasks

### Pulse Plan
- Full dashboard
- All surveys
- All courses
- All tasks
- AI Trading signals

### Premium Plan (all features)
- Everything in Pulse
- Advanced analytics
- Priority support
- Custom settings

## Admin Setup

1. Create first user via registration
2. Use Supabase admin panel to set user's role to 'admin'
3. Create initial membership plans via admin dashboard
4. Create surveys, courses, and tasks

## Deployment to Vercel

```bash
npm run build
vercel deploy
```

Environment variables must be set in Vercel dashboard.

## API Routes Overview

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (Next.js built-in)
- `POST /api/auth/logout` - Logout

### Admin
- `GET/POST /api/admin/surveys` - Manage surveys
- `GET/POST /api/admin/courses` - Manage courses
- `GET/POST /api/admin/courses/[id]` - Get/update course
- `GET/POST /api/admin/tasks` - Manage tasks
- `GET/POST /api/admin/plans` - Manage plans
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/[id]` - Update user plan/status
- `DELETE /api/admin/users/[id]` - Delete user

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/user/available-surveys` - Surveys user can access
- `GET /api/user/available-courses` - Courses user can access
- `POST /api/user/surveys/[id]/submit` - Submit survey
- `POST /api/user/courses/[id]/complete` - Mark course complete
- `POST /api/user/tasks/[id]/complete` - Mark task complete

## Key Database Indexes
- users(email) - UNIQUE
- users(role) - for admin queries
- surveys(id, created_at) - for listing
- courses(id, created_at)
- tasks(id, created_at)

## Security Notes
- Row Level Security (RLS) enabled on all tables
- Admin operations use service role key
- User queries respect user's plan/permissions
- API routes validate user authentication
- All external URLs validated before redirect
