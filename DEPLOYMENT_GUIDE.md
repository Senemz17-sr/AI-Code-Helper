# 🚀 CodeTutor - Deployment & Launch Guide

## Pre-Deployment Checklist

### Development Environment
- [x] React 18 + Vite setup
- [x] TypeScript configured
- [x] Tailwind CSS + shadcn/ui installed
- [x] Framer Motion for animations
- [x] React Router for navigation
- [x] CodeMirror for code editor
- [x] Supabase client initialized

### Features Implemented
- [x] 6 complete courses across 4 languages
- [x] 8+ lessons with code examples
- [x] AI Assistant panel with streaming
- [x] Quiz system
- [x] Progress tracking
- [x] Responsive design
- [x] Dark/Light mode
- [x] Dashboard with learning stats

## Deployment Steps

### 1. Prepare Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key
```

### 2. Build the Application
```bash
npm run build
```

Output location: `dist/` folder

### 3. Deploy to Production

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

#### Option C: Supabase Hosting
```bash
# Build
npm run build

# Upload dist/ folder to hosting service
```

#### Option D: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### 4. Configure Supabase

#### Create Tables
```sql
-- Run these in Supabase SQL Editor

CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT,
  level TEXT,
  chapters INT,
  duration TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  chapter INT,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_courses TEXT[],
  total_progress INT DEFAULT 0,
  certificates_earned INT DEFAULT 0,
  learning_streak INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Set Up Authentication
1. Go to Supabase Dashboard
2. Navigate to Authentication → Providers
3. Enable Email/Password provider
4. Configure email templates
5. Set up redirect URLs:
   - Development: `http://localhost:8080/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 5. Configure CORS
In Supabase:
```bash
# Update CORS settings for your domain
curl -i -X PATCH 'https://your-project.supabase.co/rest/v1/rpc/cors' \
  -H 'Content-Type: application/json' \
  -H 'apikey: your_key' \
  -d '{"allowed_origins": ["https://yourdomain.com"]}'
```

## Post-Deployment

### 1. Verify Deployment
- [ ] Visit deployed URL
- [ ] Test course browsing
- [ ] Test lesson navigation
- [ ] Test AI assistant
- [ ] Test dark mode
- [ ] Test mobile responsiveness

### 2. Setup Domain
```bash
# Point your domain to deployed site
# For Vercel: Add CNAME record
# For Netlify: Update DNS records
```

### 3. Setup Analytics (Optional)
```bash
# Add Google Analytics
# Update NEXT_PUBLIC_GA_ID in .env
```

### 4. Setup Email Service
```bash
# For password reset emails, configure in Supabase
# Settings → Email Templates
```

## Monitoring & Maintenance

### Performance Monitoring
```bash
# Lighthouse score check
npm run build && npm run preview

# Bundle analysis
npm run analyze
```

### Error Tracking (Optional)
Add Sentry integration:
```bash
npm install @sentry/react
```

### Database Monitoring
- Monitor user_progress table for inserts
- Clean up old sessions regularly
- Backup user data

## Scaling Considerations

### When Traffic Increases
1. **Enable Caching**
   - Add Redis for session storage
   - Cache course content

2. **Optimize API Calls**
   - Implement request batching
   - Use pagination for lessons

3. **Scale Database**
   - Upgrade Supabase plan
   - Add read replicas

4. **CDN Setup**
   - Use Cloudflare for static assets
   - Cache course content globally

## Troubleshooting

### Common Issues

**Problem**: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

**Problem**: Supabase connection error
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_PUBLISHABLE_KEY
```

**Problem**: AI assistant not responding
```bash
# Check Supabase Edge Function logs
# Verify OpenAI API key in Edge Function
```

**Problem**: Dark mode not persisting
```bash
# Check localStorage
# Verify useTheme hook is working
```

## Update & Maintenance Schedule

### Weekly
- Monitor error logs
- Check user feedback
- Review analytics

### Monthly
- Update dependencies
- Check security vulnerabilities
- Backup database

### Quarterly
- Review performance metrics
- Plan new features
- Update course content

## Rollback Plan

```bash
# If deployment has issues:
# 1. Identify the problematic commit
git log --oneline

# 2. Revert to previous version
git revert <commit-hash>

# 3. Rebuild and redeploy
npm run build
vercel deploy --prod
```

## Success Metrics

Track these KPIs:
- User sign-ups
- Active learners (DAU/MAU)
- Course completion rate
- Average lesson time
- AI assistant usage
- Quiz pass rate
- User retention

## Security Checklist

- [ ] Enable HTTPS
- [ ] Set strong CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Regular security audits
- [ ] Monitor API rate limits
- [ ] Keep dependencies updated

## Support Resources

- **Documentation**: `LEARNING_PLATFORM_GUIDE.md`
- **Supabase Docs**: https://supabase.io/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

## Next Steps

1. Set up production environment
2. Configure Supabase
3. Deploy application
4. Setup custom domain
5. Monitor performance
6. Gather user feedback
7. Iterate and improve

---

**Happy Deploying! 🎉**
