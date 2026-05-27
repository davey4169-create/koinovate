# Koinovate - Quick Start Guide

## ⚡ Start in 5 Minutes

### 1. Set Environment Variables
Create `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Create Admin User
- Register at http://localhost:3000/auth
- Go to Supabase > users table
- Change your `role` to 'admin'
- Refresh http://localhost:3000/admin

### 4. Test Everything
- ✅ Admin: Create survey with redirect URL
- ✅ Admin: Create course with redirect URL  
- ✅ Admin: Create task with redirect URL
- ✅ User: See dashboard
- ✅ User: Click survey → redirects to external URL

---

## 🗂️ Files Created/Modified

### New Utility Files
- `/src/lib/auth.js` - Authentication helpers
- `/src/lib/permissions.js` - Feature access control
- `/src/hooks/useFeatureAccess.js` - Access control hooks
- `/src/middleware.js` - Route protection

### New API Routes
**Admin APIs:**
- `/src/app/api/admin/surveys/*`
- `/src/app/api/admin/courses/*`
- `/src/app/api/admin/tasks/*`
- `/src/app/api/admin/users/*`
- `/src/app/api/admin/plans/*`

**User APIs:**
- `/src/app/api/user/profile/*`
- `/src/app/api/user/dashboard/*`
- `/src/app/api/user/surveys/*`
- `/src/app/api/user/courses/*`
- `/src/app/api/user/tasks/*`

### New Pages
**Admin Dashboard:**
- `/src/app/admin/page.js` - Main admin dashboard
- `/src/app/admin/surveys/page.js` - Manage surveys
- `/src/app/admin/courses/page.js` - Manage courses
- `/src/app/admin/tasks/page.js` - Manage tasks
- `/src/app/admin/users/page.js` - Manage users
- `/src/app/admin/users/[id]/page.js` - Edit user
- `/src/app/admin/plans/page.js` - View plans
- `/src/app/admin/admin.css` - Admin styles

**User Dashboard:**
- `/src/app/user/dashboard/page.js` - User dashboard
- `/src/app/user/dashboard/dashboard.css` - Dashboard styles

### Configuration Files
- `/vercel.json` - Vercel deployment config
- `/.env.local.example` - Environment variables template
- `/db-migrations/001_init.sql` - Complete database schema
- `/SETUP_GUIDE.md` - Setup instructions
- `/DEPLOYMENT_GUIDE.md` - Deployment guide
- `/QUICKSTART.md` - This file

### Modified Files
- `/src/store/userStore.js` - Enhanced with new methods

---

## 🎯 Key Features

### ✅ Complete CRUD Operations
```
Surveys    → Create, Read, Update, Delete
Courses    → Create, Read, Update, Delete
Tasks      → Create, Read, Update, Delete
Users      → Read, Update, Delete
Plans      → Read
```

### ✅ External URL Redirects
- Admin sets redirect URL for surveys
- Admin sets redirect URL for courses
- Admin sets redirect URL for tasks
- User clicks → redirects to external URL

### ✅ Membership Tier System
```
Free       → Access free surveys/courses/tasks
Pulse      → Full access + AI Trading (₦15,000/month)
Premium    → Everything + Priority support (₦50,000/month)
```

### ✅ Feature Access Control
```javascript
// Check if user has feature
const hasTrading = useFeatureAccess(FEATURES.AI_TRADING)

// Check if user can access tier
const canAccess = useTierAccess('pulse')
```

### ✅ Admin Control Panel
- Manage all users
- Create/edit/delete surveys
- Create/edit/delete courses
- Create/edit/delete tasks
- Set user plans
- View activity logs

### ✅ User Dashboard
- View available surveys/courses/tasks
- Complete surveys and tasks (earn rewards)
- Track wallet balance
- See membership status
- View completion stats

---

## 🚀 Deployment (One Click)

### Via Vercel
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com → New Project
# 3. Select your repo
# 4. Add environment variables
# 5. Click Deploy
```

**That's it! Your app is live.**

---

## 🔐 Security Features

✅ Row-Level Security (RLS) on all tables  
✅ Admin-only API endpoints  
✅ User data isolation  
✅ Input validation on all endpoints  
✅ Safe external URL validation  
✅ Session management with Supabase Auth  

---

## 📊 Database Schema

```
users
├── id (UUID)
├── email (UNIQUE)
├── full_name
├── phone
├── role (user | admin)
├── membership_tier (free | pulse | premium)
├── membership_active (boolean)
├── membership_end_date
├── wallet_balance
├── created_at

surveys
├── id
├── title
├── description
├── reward
├── min_tier
├── redirect_url (external)
├── status
├── created_by (user_id)

courses
├── id
├── title
├── description
├── redirect_url (external)
├── thumbnail
├── min_tier
├── order_num
├── status

tasks
├── id
├── title
├── description
├── reward
├── redirect_url (external)
├── min_tier
├── frequency (daily | weekly | once)
├── status

And more... (see 001_init.sql)
```

---

## 💡 Pro Tips

1. **Test Admin Features First**
   - Create test surveys/courses/tasks
   - Verify redirect URLs work
   - Test user access restrictions

2. **Monitor Database**
   - Check Supabase logs
   - Monitor RLS policies
   - Verify data integrity

3. **User Onboarding**
   - Register → Auto gets Free plan
   - Admin upgrades → User sees new features immediately
   - Dashboard refreshes in real-time

4. **External URLs**
   - Use full URLs (https://example.com/page)
   - Test links before publishing
   - Avoid redirects inside redirects

---

## ❓ FAQ

**Q: How do users upgrade their plan?**  
A: Via `/membership` page using Paystack payment (integrate separately)

**Q: Can users see other users' data?**  
A: No. RLS policies restrict access to own data only.

**Q: How do external redirects work?**  
A: Admin sets URL → User clicks → Browser navigates to external URL

**Q: Can I customize colors?**  
A: Yes. Edit CSS files in `/src/app/admin` and `/src/app/user/dashboard`

**Q: Is it production ready?**  
A: Yes. 100% ready for Vercel deployment.

---

## 🎓 Learning Resources

- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **Vercel**: https://vercel.com/docs

---

Made with ❤️ for Koinovate
