# 🚀 KorrAI Deployment Guide

**Version**: 2.0  
**Last Updated**: October 3, 2025  
**Target Environment**: Production

This guide provides step-by-step instructions for deploying KorrAI to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Supabase Setup](#supabase-setup)
3. [AI/LLM Configuration](#aillm-configuration)
4. [Environment Variables](#environment-variables)
5. [Build & Deploy](#build--deploy)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Code Review
- [ ] All placeholder code identified and documented
- [ ] Mock data replaced with real database queries
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Form validation on all inputs
- [ ] Responsive design tested on all screen sizes
- [ ] Dark mode works correctly
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Security Review
- [ ] No sensitive data in code
- [ ] Environment variables properly configured
- [ ] CORS settings reviewed
- [ ] API endpoints secured
- [ ] Row-level security (RLS) policies configured
- [ ] File upload size limits set
- [ ] Rate limiting implemented

### Performance Review
- [ ] Bundle size optimized (<1MB initial load)
- [ ] Images optimized and lazy-loaded
- [ ] Database queries optimized with indexes
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets

---

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization or create new
4. Enter project details:
   - **Name**: KorrAI Production
   - **Database Password**: Use strong password (save securely!)
   - **Region**: Choose closest to users
   - **Pricing Plan**: Pro or Team (Free tier not recommended for production)

### Step 2: Enable Extensions

In Supabase SQL Editor, run:

```sql
-- Enable vector extension for RAG embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable PostGIS for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 3: Create Database Schema

Run the following SQL to create all tables:

```sql
-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('engineer', 'manager', 'admin', 'viewer')),
  department TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'planned', 'archived', 'completed')) DEFAULT 'active',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_address TEXT,
  start_date DATE,
  end_date DATE,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ============================================
-- ASSETS (Geotechnical Data)
-- ============================================

CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('borehole', 'monitoring', 'infrastructure')) NOT NULL,
  name TEXT NOT NULL,
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  location_address TEXT,
  data JSONB NOT NULL, -- Stores type-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geospatial index for map queries
CREATE INDEX idx_assets_location ON public.assets USING GIST (
  ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
);

-- ============================================
-- ACTIVITIES
-- ============================================

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('inspection', 'audit', 'monitoring', 'review')) NOT NULL,
  status TEXT CHECK (status IN ('not-started', 'in-progress', 'completed', 'on-hold')) DEFAULT 'not-started',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  due_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.activity_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE TABLE public.checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL, -- For ordering
  ai_context TEXT, -- Generated AI guidance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.activity_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS
-- ============================================

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('report', 'drawing', 'photo', 'data', 'specification', 'other')) NOT NULL,
  size BIGINT NOT NULL, -- bytes
  url TEXT NOT NULL, -- Supabase Storage URL
  uploaded_by UUID REFERENCES public.profiles(id),
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.document_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  checklist_item_id UUID REFERENCES public.checklist_items(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, checklist_item_id)
);

-- Full-text search index
CREATE INDEX idx_documents_search ON public.documents USING GIN (
  to_tsvector('english', name || ' ' || COALESCE(array_to_string(tags, ' '), ''))
);

-- ============================================
-- CHAT & RAG
-- ============================================

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  sources TEXT[] DEFAULT '{}', -- Source document IDs
  confidence DOUBLE PRECISION, -- 0-1 confidence score
  reasoning JSONB, -- Reasoning steps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX idx_embeddings_vector ON public.embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================
-- SHAPEFILES & GIS DATA
-- ============================================

CREATE TABLE public.shapefile_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geometry_type TEXT NOT NULL,
  feature_count INTEGER NOT NULL,
  geojson_data JSONB NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  opacity DOUBLE PRECISION DEFAULT 1.0,
  color TEXT DEFAULT '#186181',
  description TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('activity', 'system', 'team')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for unread notifications
CREATE INDEX idx_notifications_unread ON public.notifications (user_id, read, created_at DESC);

-- ============================================
-- DATA SOURCES (External Connections)
-- ============================================

CREATE TABLE public.data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('api', 'database', 'cloud-storage', 'ftp')) NOT NULL,
  status TEXT CHECK (status IN ('connected', 'disconnected', 'error')) DEFAULT 'disconnected',
  config JSONB NOT NULL, -- Connection configuration (encrypted)
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON public.data_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Set Up Row-Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shapefile_layers ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects: Users can only see projects they're members of
CREATE POLICY "Users can view their projects" ON public.projects
  FOR SELECT USING (
    id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  );

-- Project Members: Users can only see members of their projects
CREATE POLICY "Users can view project members" ON public.project_members
  FOR SELECT USING (
    project_id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  );

-- Assets: Users can only see assets from their projects
CREATE POLICY "Users can view project assets" ON public.assets
  FOR SELECT USING (
    project_id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  );

-- Activities: Users can only see activities from their projects
CREATE POLICY "Users can view project activities" ON public.activities
  FOR SELECT USING (
    project_id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  );

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- Add similar policies for other tables...
```

### Step 5: Create Storage Buckets

In Supabase Dashboard > Storage:

1. **Create `documents` bucket**:
   - Name: `documents`
   - Public: No
   - File size limit: 50MB
   - Allowed MIME types: `application/pdf`, `application/msword`, `image/*`, etc.

2. **Create `avatars` bucket**:
   - Name: `avatars`
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: `image/*`

3. **Create `shapefiles` bucket**:
   - Name: `shapefiles`
   - Public: No
   - File size limit: 100MB
   - Allowed MIME types: `application/json`, `application/zip`

**Storage Policies** (for `documents` bucket):
```sql
-- Users can upload to their project folders
CREATE POLICY "Users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.projects
      WHERE id IN (
        SELECT project_id FROM public.project_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can view documents from their projects
CREATE POLICY "Users can view documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.projects
      WHERE id IN (
        SELECT project_id FROM public.project_members
        WHERE user_id = auth.uid()
      )
    )
  );
```

### Step 6: Configure Authentication

In Supabase Dashboard > Authentication > Providers:

1. **Enable Email provider**
2. Configure email templates (optional)
3. Set up redirect URLs:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/**`

---

## 🤖 AI/LLM Configuration

### Option 1: OpenAI (Recommended for Production)

1. **Get API Key**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create API key
   - Set usage limits to prevent unexpected bills

2. **Configure**:
   ```bash
   VITE_OPENAI_API_KEY=sk-your-key-here
   VITE_AI_PROVIDER=openai
   VITE_AI_MODEL=gpt-4
   VITE_EMBEDDING_MODEL=text-embedding-ada-002
   ```

3. **Cost Estimation**:
   - GPT-4: ~$0.03-0.06 per 1K tokens
   - Embeddings: ~$0.0001 per 1K tokens
   - Estimated cost: $100-500/month for 100 active users

### Option 2: Ollama (Local Deployment)

1. **Install on Server**:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull Model**:
   ```bash
   ollama pull llama3.1:70b  # Production
   # or
   ollama pull llama3.1:8b   # Development
   ```

3. **Run as Service**:
   ```bash
   sudo systemctl enable ollama
   sudo systemctl start ollama
   ```

4. **Configure**:
   ```bash
   VITE_AI_PROVIDER=ollama
   VITE_OLLAMA_BASE_URL=http://localhost:11434
   VITE_AI_MODEL=llama3.1:70b
   ```

### Option 3: Together.ai or Groq

```bash
# Together.ai
VITE_AI_PROVIDER=together
VITE_TOGETHER_API_KEY=your-key
VITE_AI_MODEL=meta-llama/Llama-3.1-70B-Instruct-Turbo

# OR Groq
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY=your-key
VITE_AI_MODEL=llama-3.1-70b-versatile
```

---

## 🔐 Environment Variables

Create `.env.production` file:

```bash
# ============================================
# SUPABASE (Required)
# ============================================
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ============================================
# AI/LLM (Choose One)
# ============================================

# OpenAI (Production)
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_AI_MODEL=gpt-4
VITE_EMBEDDING_MODEL=text-embedding-ada-002

# OR Ollama (Self-hosted)
# VITE_AI_PROVIDER=ollama
# VITE_OLLAMA_BASE_URL=http://localhost:11434
# VITE_AI_MODEL=llama3.1:70b

# OR Together.ai
# VITE_AI_PROVIDER=together
# VITE_TOGETHER_API_KEY=your-key-here
# VITE_AI_MODEL=meta-llama/Llama-3.1-70B-Instruct-Turbo

# OR Groq
# VITE_AI_PROVIDER=groq
# VITE_GROQ_API_KEY=your-key-here
# VITE_AI_MODEL=llama-3.1-70b-versatile

# ============================================
# APPLICATION
# ============================================
VITE_APP_URL=https://your-domain.com
VITE_APP_NAME=KorrAI
VITE_ENVIRONMENT=production

# ============================================
# FEATURES (Optional)
# ============================================
VITE_ENABLE_VOICE_INPUT=false
VITE_ENABLE_PDF_PREVIEW=true
VITE_ENABLE_SHAPEFILE_UPLOAD=true
VITE_ENABLE_ANALYTICS=true

# ============================================
# ANALYTICS (Optional)
# ============================================
# VITE_POSTHOG_KEY=your-posthog-key
# VITE_SENTRY_DSN=your-sentry-dsn

# ============================================
# LIMITS
# ============================================
VITE_MAX_FILE_SIZE=52428800  # 50MB in bytes
VITE_MAX_UPLOAD_FILES=10
VITE_RAG_CONTEXT_LIMIT=5
```

---

## 📦 Build & Deploy

### Local Build Test

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add all variables from `.env.production`
   - Redeploy

### Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables**:
   - Go to Netlify Dashboard > Site Settings > Build & Deploy > Environment
   - Add all variables

### Deploy to Custom Server (VPS)

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload `dist` folder** to server

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/korrai/dist;
       index index.html;
       
       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript application/json;
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Set up SSL** with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## ✅ Post-Deployment

### 1. Verify Deployment

- [ ] Website loads at production URL
- [ ] Login/signup works
- [ ] Projects load correctly
- [ ] Map displays assets
- [ ] Chat interface responds
- [ ] File upload works
- [ ] Notifications appear
- [ ] Theme toggle works
- [ ] Mobile responsive

### 2. Create Admin User

```sql
-- In Supabase SQL Editor
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@korrai.com'),
  'admin@korrai.com',
  'Admin User',
  'admin'
);
```

### 3. Seed Initial Data (Optional)

```sql
-- Create sample project
INSERT INTO public.projects (name, description, status, owner_id)
VALUES (
  'Demo Project',
  'Sample geotechnical project for testing',
  'active',
  (SELECT id FROM auth.users WHERE email = 'admin@korrai.com')
);
```

### 4. Configure DNS

Point your domain to deployment:
- **Vercel**: Add custom domain in dashboard
- **Netlify**: Add custom domain in dashboard
- **VPS**: Update A/CNAME records to server IP

### 5. Set Up Monitoring

**Sentry (Error Tracking)**:
```bash
npm install @sentry/react
```

Add to `App.tsx`:
```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: "production",
});
```

**PostHog (Analytics)**:
```bash
npm install posthog-js
```

Add to `App.tsx`:
```tsx
import posthog from 'posthog-js';

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com'
});
```

---

## 📊 Monitoring & Maintenance

### Daily Checks

- [ ] Check error logs (Sentry)
- [ ] Review user analytics (PostHog)
- [ ] Monitor AI/LLM costs
- [ ] Check Supabase usage
- [ ] Review performance metrics

### Weekly Maintenance

- [ ] Review and respond to user feedback
- [ ] Check for security updates
- [ ] Backup database
- [ ] Review storage usage
- [ ] Optimize slow queries

### Monthly Tasks

- [ ] Review and analyze metrics vs goals
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cost analysis and optimization

---

## 🔧 Troubleshooting

### Issue: Authentication Not Working

**Symptoms**: Login fails, redirects broken

**Solutions**:
1. Check Supabase Auth configuration
2. Verify redirect URLs in Supabase settings
3. Check CORS settings
4. Verify environment variables
5. Clear browser cache and cookies

### Issue: AI Responses Not Working

**Symptoms**: Chat shows loading indefinitely

**Solutions**:
1. Check AI provider API key is set
2. Verify API key has sufficient credits/quota
3. Check network connectivity to AI provider
4. Review browser console for errors
5. Test API key with curl/Postman

### Issue: File Uploads Failing

**Symptoms**: Upload button doesn't work

**Solutions**:
1. Check Supabase Storage bucket exists
2. Verify storage policies are correct
3. Check file size limits
4. Verify MIME types allowed
5. Check user has correct permissions

### Issue: Map Not Loading

**Symptoms**: Map shows blank or errors

**Solutions**:
1. Check internet connectivity (Leaflet tiles need internet)
2. Verify assets have valid lat/lng coordinates
3. Check browser console for errors
4. Verify Leaflet CSS is imported
5. Check map container has height set

### Issue: Slow Performance

**Symptoms**: Pages load slowly, lag

**Solutions**:
1. Enable CDN for static assets
2. Optimize database queries (add indexes)
3. Implement pagination for large lists
4. Enable gzip compression
5. Lazy load images and components
6. Check bundle size (`npm run build -- --report`)

---

## 📈 Scaling Considerations

### When to Scale

- **Database**: >10,000 projects or >1M assets
- **Storage**: >500GB files
- **AI Calls**: >100,000 requests/month
- **Users**: >1,000 concurrent users

### Scaling Options

1. **Supabase**: Upgrade to Pro or Enterprise plan
2. **AI/LLM**: Use caching, rate limiting, or self-hosted Ollama
3. **CDN**: Use Cloudflare or AWS CloudFront
4. **Database**: Add read replicas, optimize queries
5. **Hosting**: Use auto-scaling (Vercel Pro, AWS)

---

## 🎉 Launch Checklist

Final checklist before public launch:

- [ ] All environment variables set
- [ ] Database schema created with RLS
- [ ] Storage buckets configured
- [ ] AI/LLM integrated and tested
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring active
- [ ] Backup strategy in place
- [ ] User documentation complete
- [ ] Terms of service and privacy policy published
- [ ] Support email configured
- [ ] Team trained on admin tasks
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Beta testers feedback addressed

---

## 📞 Support

For deployment issues:
- **Documentation**: See `/guidelines/` directory
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **AI Integration**: See `/lib/ai-service-example.ts`

---

**Good luck with your deployment! 🚀**

