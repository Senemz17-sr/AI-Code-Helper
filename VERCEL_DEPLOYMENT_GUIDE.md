# Vercel Deployment Guide

This guide walks you through deploying the AI Code Tutor to Vercel.

## Prerequisites

- Vercel account: [Sign up at vercel.com](https://vercel.com)
- Git repository with your code pushed
- All environment variables configured

## Step 1: Prepare Your Project

✅ The project is already configured for Vercel deployment:

- **package.json**: Contains required `dev`, `build`, and `preview` scripts
- **vite.config.ts**: Properly configured for production builds
- **vercel.json**: Configured with SPA routing for React Router
- **.env.example**: Template for environment variables
- **.gitignore**: Excludes sensitive files from version control

## Step 2: Set Up Environment Variables

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the values from your services:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   LOVABLE_API_KEY=your_lovable_api_key
   ```

### Vercel Dashboard

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the same names (the `VITE_` prefix is automatically handled for frontend)

**Required Variables:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anonymous key
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key (if using payments)
- `LOVABLE_API_KEY` - Your AI analysis API key

## Step 3: Connect GitHub Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Choose these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 4: Configure Build Settings

In Vercel dashboard project settings:

```json
Build Command:    npm run build
Output Directory: dist
Install Command:  npm install
```

These are already in `vercel.json`, but verify in the dashboard under **Settings** → **Build & Development Settings**.

## Step 5: Deploy

### Option A: Automatic Deployment (Recommended)

1. Push to your main branch:
   ```bash
   git push origin main
   ```
2. Vercel automatically detects changes and deploys

### Option B: Deploy from Dashboard

1. Go to your Vercel project
2. Click the "Deploy" button
3. Monitor deployment logs in real-time

## Step 6: Verify Deployment

After deployment completes:

1. ✅ Visit your deployed URL
2. ✅ Test all routes (they should work without 404 errors)
3. ✅ Check browser console for errors (F12)
4. ✅ Test API calls to Supabase
5. ✅ Verify environment variables are loaded

### Common Issues & Fixes

#### 404 on Page Refresh
- **Fixed**: `vercel.json` has SPA routing configured (`"routes": [{ "src": "/.*", "dest": "/" }]`)

#### Environment Variables Not Loaded
- Check Vercel dashboard: **Settings** → **Environment Variables**
- Redeploy after adding variables
- Ensure variable names match exactly

#### Build Fails
- Check build logs in Vercel dashboard
- Run `npm run build` locally to debug
- Ensure all dependencies are in `package.json`

#### Blank Page on Load
- Check browser DevTools console (F12)
- Verify network requests in Network tab
- Check if API calls are reaching Supabase correctly

## Step 7: Post-Deployment

### Before Going Live

- [ ] Test all authenticated routes
- [ ] Test payment flow (if implemented)
- [ ] Verify API calls work in production
- [ ] Check performance in Lighthouse
- [ ] Test on mobile devices

### Monitoring

1. Check Vercel Analytics:
   - Go to **Analytics** tab
   - Monitor Core Web Vitals
   - Watch error rates

2. Set up error tracking:
   - Integrate with services like Sentry
   - Monitor Supabase logs
   - Check API error rates

## Environment Variables Reference

| Variable | Source | Example |
|----------|--------|---------|
| `VITE_SUPABASE_URL` | Supabase Dashboard | `https://xgsgvwcavwaefofxpoay.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API | JWT token |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe Dashboard | `pk_live_...` |
| `LOVABLE_API_KEY` | Lovable Account | API key for AI analysis |

## Commands Reference

```bash
# Local development
npm run dev

# Preview production build
npm run build
npm run preview

# Install dependencies
npm install

# Run tests
npm test
```

## Rollback

If deployment has issues:

1. Go to **Deployments** tab in Vercel
2. Find the previous working deployment
3. Click the three dots menu
4. Select "Promote to Production"

## Support

For Vercel deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

For application issues:
- Check Supabase status: [status.supabase.com](https://status.supabase.com)
- Review application logs in browser console
- Check Vercel function logs if using serverless functions
