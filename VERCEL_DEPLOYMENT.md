# Vercel Deployment Guide

## Prerequisites
- Vercel Account (https://vercel.com)
- GitHub account with your repository
- Environment variables from Supabase and Stripe

## Step 1: Prepare Environment Variables

Before deploying to Vercel, ensure you have the following environment variables ready:

### Supabase Configuration
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase public key

### Stripe Configuration (for payments)
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Connect your GitHub account and select the `code-tutor` repository
5. On the "Configure Project" screen:
   - **Framework Preset**: Should auto-detect as Vite ✓
   - **Build Command**: Should auto-detect as `npm run build` ✓
   - **Output Directory**: Should auto-detect as `dist` ✓
   - **Install Command**: Should auto-detect as `npm install` ✓
6. Under "Environment Variables", add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`
7. Click "Deploy"

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 3: Configure Environment Variables in Vercel Dashboard

1. Go to your project: https://vercel.com/dashboard
2. Select your `code-tutor` project
3. Go to "Settings" → "Environment Variables"
4. Add production environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`
5. Save changes

## Step 4: Verify Deployment

1. After deployment completes, click the "Visit" button
2. Test the application:
   - Check if courses load properly
   - Test authentication flow
   - Verify code editor functionality
   - Test payment functionality (in production)

## Automatic Deployments

Once deployed:
- Every push to your main branch → automatic production deployment
- Every push to feature branches → automatic preview deployments
- Pull requests show a preview link automatically

## Important Notes

### Supabase Configuration
- Ensure your Supabase project is configured with proper authentication
- Update Supabase redirect URLs to include your Vercel domain:
  - Add: `https://your-project-name.vercel.app/**`
  - Add: `https://your-project-name-*.vercel.app/**` (for preview deployments)

### Payment Processing
- For Stripe, ensure your webhook endpoints are updated with the Vercel deployment URL
- Test payments thoroughly in development environment before production

### CORS Configuration
- Supabase calls should work automatically if credentials are correct
- Verify CORS settings in Supabase if you encounter cross-origin errors

## Troubleshooting

### Build fails
- Check that all environment variables are set correctly
- Verify Node.js version compatibility (18+ recommended)
- Clear build cache in Vercel Dashboard → Settings → Git

### Blank page after deployment
- Check browser console for errors (F12)
- Verify environment variables are correct in Vercel Dashboard
- Check that Supabase project is accessible

### API/Supabase calls fail
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct
- Update Supabase redirect URLs for your new domain
- Check Supabase project settings for allowed origins

## Rollback

To rollback to a previous deployment:
1. Go to your project in Vercel Dashboard
2. Click "Deployments" tab
3. Find the previous working version
4. Click the three dots → "Promote to Production"

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
