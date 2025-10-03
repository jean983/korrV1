# KorrAI Platform - Export Handoff Document

**Version**: 2.0  
**Date**: January 2025  
**Status**: Ready for Production Setup

---

## 🎯 Executive Summary

This is a complete, production-ready frontend implementation of the KorrAI geotechnical engineering platform. All core features are implemented with mock data. The backend integration points are clearly marked and ready for Supabase/API integration.

### What's Complete ✅
- **Full Authentication Flow** (mock - ready for Supabase Auth)
- **Split-Screen Dashboard** with chat and map
- **RAG Chat Interface** with context-aware responses
- **Interactive Map** with project locations and asset markers
- **Activity Management System** with AI-powered features
- **Project Management** with status tracking
- **Notifications System** with real-time updates
- **Document Management** with preview dialogs
- **"Dig Deeper" Functionality** with data exploration
- **Account Settings** page
- **Shapefile Upload** functionality
- **Comprehensive Design System** (Korrai brand)

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Placeholder & Integration Points](#placeholders--integration-points)
4. [Global Overrides & Customizations](#global-overrides--customizations)
5. [Feature Documentation](#feature-documentation)
6. [Backend Integration Guide](#backend-integration-guide)
7. [Deployment Checklist](#deployment-checklist)
8. [Known Limitations](#known-limitations)

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+ installed
npm or yarn package manager
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### First Steps
1. Open browser to http://localhost:5173
2. Login with ANY email/password (mock auth)
3. Explore the dashboard and features
4. Review integration points below before connecting backend

---

## 🏗️ Architecture Overview

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui (customized for Korrai brand)
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Recharts
- **State Management**: React useState/useContext (ready for React Query)
- **Toast Notifications**: Sonner

### File Structure
```
/
├── App.tsx                     # Main app entry point with routing
├── components/                 # All React components
│   ├── ui/                    # Shadcn UI components (DO NOT MODIFY)
│   ├── figma/                 # Protected Figma components
│   ├── dashboard.tsx          # Main dashboard view
│   ├── chat-interface.tsx     # RAG chat implementation
│   ├── project-map.tsx        # Interactive map component
│   ├── activities-page.tsx    # Activity management
│   ├── account-settings.tsx   # User settings
│   └── [other components]
├── lib/                       # Utilities and data
│   ├── mock-data.ts          # 🔴 MOCK DATA - Replace with API calls
│   ├── ai-service-example.ts # 🔴 AI Integration template
│   └── notification-context.tsx # Notification system
├── styles/
│   └── globals.css           # 🟡 GLOBAL OVERRIDES - See section below
└── guidelines/               # Comprehensive documentation
```

---

## 🔴 Placeholders & Integration Points

### 1. Authentication (MOCK - HIGH PRIORITY)

**Location**: `/components/login-page.tsx`

```typescript
// 🔴 PLACEHOLDER: Mock authentication - accepts ANY credentials
const handleLogin = () => {
  // TODO: Replace with Supabase Auth
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: email,
  //   password: password,
  // });
  setIsAuthenticated(true);
};
```

**Action Required**: 
- Integrate Supabase Auth
- See `/guidelines/AI-Integration-Guide.md` for setup
- Update `App.tsx` to handle auth state

---

### 2. AI Service (MOCK - HIGH PRIORITY)

**Location**: `/lib/ai-service-example.ts`

```typescript
// 🔴 PLACEHOLDER: Mock AI responses
// Lines 291-358 contain mock implementations
// Real implementation is commented out (lines 50-237)

export async function generateChecklistContext(...) {
  // 🔴 This is a MOCK response with simulated delay
  // Uncomment lines 159-192 for real AI integration
  await new Promise(resolve => setTimeout(resolve, 1500));
  return mockResponses[responseKey];
}
```

**Action Required**:
1. Uncomment lines 50-237 for real implementation
2. Install dependencies: `npm install ollama openai`
3. Set up Ollama (local) OR Together.ai/Groq (production)
4. Configure API keys in environment variables:
   ```bash
   TOGETHER_API_KEY=your_key_here  # For Together.ai
   GROQ_API_KEY=your_key_here      # For Groq
   OPENAI_API_KEY=your_key_here    # For OpenAI
   ```
5. Update `DEFAULT_CONFIG` object (line 31)

---

### 3. Mock Data (MOCK - HIGH PRIORITY)

**Location**: `/lib/mock-data.ts`

```typescript
// 🔴 PLACEHOLDER: All data is hardcoded mock data
// Lines 400+ contain sample projects, boreholes, monitoring points

export const mockProjects: Project[] = [
  // 🔴 Replace with API call to fetch user's projects
  // const { data } = await supabase.from('projects').select('*');
  {
    id: '1',
    name: 'Thames Tideway Tunnel Extension',
    // ... mock data
  }
];
```

**Action Required**:
- Replace all mock data exports with Supabase queries
- Create database schema matching TypeScript interfaces
- Update all components importing from `mock-data.ts`

**Key Mock Data Exports**:
- `mockProjects` - Project list
- `mockActivities` - Activity templates
- `mockChatHistory` - Chat messages (replace with vector DB)
- `mockNotifications` - Notification history
- `mockUser` - Current user data

---

### 4. File Upload (PLACEHOLDER - MEDIUM PRIORITY)

**Location**: `/components/chat-interface.tsx`, `/components/activity-details-page.tsx`

```typescript
// 🔴 PLACEHOLDER: File upload simulation
const handleFileConfirm = () => {
  // TODO: Implement actual file upload to Supabase Storage
  // const { data, error } = await supabase.storage
  //   .from('project-documents')
  //   .upload(`${projectId}/${file.name}`, file);
  
  toast.success('File uploaded successfully');
};
```

**Action Required**:
- Integrate Supabase Storage
- Implement file upload with progress tracking
- Add file type validation and size limits
- Generate thumbnails for images

---

### 5. Map Tiles (EXTERNAL SERVICE - LOW PRIORITY)

**Location**: `/components/leaflet-map.tsx`

```typescript
// 🟡 USING: Free OpenStreetMap tiles
// Production should use paid service for reliability

<TileLayer
  attribution='&copy; OpenStreetMap'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // 🟡 PRODUCTION: Replace with Mapbox/Google Maps
  // url="https://api.mapbox.com/styles/v1/..."
/>
```

**Action Required** (Optional):
- Sign up for Mapbox (recommended) or Google Maps
- Update tile URL and add API key
- Estimated cost: $0-50/month depending on usage

---

### 6. Shapefile Processing (CLIENT-SIDE - OK FOR NOW)

**Location**: `/components/project-settings.tsx`

```typescript
// 🟡 NOTE: Shapefile parsing happens in browser
// For large files, consider server-side processing

const handleShapefileUpload = async (files: FileList) => {
  // Uses shapefile.js library (client-side)
  const geojson = await shapefile.read(shpFile);
  // For production: send to backend for processing
};
```

**Action Required** (Optional):
- Move to backend for large files (>10MB)
- Add validation and sanitization
- Store processed GeoJSON in database

---

## 🟡 Global Overrides & Customizations

### Design System Override

**Location**: `/styles/globals.css`

```css
/* 
 * 🟡 GLOBAL OVERRIDE: Custom typography for all HTML elements
 * This overrides Tailwind defaults to match Korrai brand
 */

@layer base {
  :where(:not(:has([class*=" text-"]), :not(:has([class^="text-"])))) {
    h1 {
      font-size: var(--text-2xl);      /* 🟡 Custom size */
      font-weight: var(--font-weight-medium);  /* 🟡 500 instead of 700 */
      line-height: 1.5;
    }
    /* ... more overrides for h2, h3, h4, p, label, button, input */
  }
}
```

**⚠️ Important**: 
- These styles ONLY apply to elements WITHOUT Tailwind text classes
- If you add `text-lg` to an element, global styles won't apply
- This ensures consistent typography across the app

---

### Brand Colors

```css
/* 🟡 KORRAI BRAND COLORS - DO NOT CHANGE without design approval */

:root {
  --primary: #186181;        /* Teal Blue - Main brand */
  --accent: #769f86;         /* Sage Green - Secondary */
  --foreground: #1d2759;     /* Navy - Text */
}

.dark {
  --primary: #22a699;        /* Lighter teal for dark mode */
  --accent: #769f86;         /* Same sage (works in both modes) */
}
```

**Utility Classes**:
```css
/* Additional brand utilities not in Tailwind */
.text-brand-teal { color: #186181; }
.text-brand-sage { color: #769f86; }
.text-brand-navy { color: #1d2759; }
/* + bg- and border- variants */
```

---

### Leaflet Map Dark Mode

```css
/* 🟡 CUSTOM: Dark mode filter for map tiles */

.dark .leaflet-layer,
.dark .leaflet-control-zoom-in,
.dark .leaflet-control-zoom-out {
  filter: invert(1) hue-rotate(180deg);
}
```

**Note**: This inverts the map colors for dark mode. Works well with OpenStreetMap tiles.

---

## 📚 Feature Documentation

### Authentication Flow
1. **Login Page** → `login-page.tsx`
   - Email/password input
   - 🔴 Currently accepts ANY credentials (mock)
   - Shows "Get started" for new users
   - Shows "Sign in" for returning users

2. **Session Management** → `App.tsx`
   - `isAuthenticated` state
   - Logout clears state and redirects to login

### Dashboard Layout
- **Split View**: Chat (60%) + Map (40%)
- **Responsive**: Stacks on mobile
- **Project Selector**: Dropdown to switch projects
- **Context Settings**: Configure RAG context
- **Top Bar**: Logo, project selector, notifications, user menu

### Chat Interface
- **Message Types**: user, assistant, system, dig-deeper, reasoning
- **File Attachments**: Click paperclip icon
- **Auto-scroll**: Scrolls to bottom on new messages
- **Source Attribution**: Shows sources for AI responses
- **Dig Deeper**: Inline data exploration with preview

### Map Features
- **Asset Markers**: Boreholes (red), Monitoring (blue), Infrastructure (yellow)
- **Popup Details**: Click marker for asset info
- **Dig Deeper**: Right-click marker for data exploration
- **Layers**: Toggle shapefile layers
- **Controls**: Zoom, expand to full screen

### Activity Management
- **Templates**: Inspection, audit, meeting types
- **Checklists**: Dynamic checklist items
- **AI Context**: "Explore Further" button on items
- **Document Linking**: Link files to checklist items
- **Auto-save**: Saves changes with toast notification
- **File Preview**: Click documents to preview

### Notifications
- **Bell Icon**: Shows unread count
- **Types**: activity, document, system, mention
- **Priorities**: low, medium, high
- **Actions**: Mark as read, mark all as read
- **Real-time**: Would connect to Supabase realtime

### "Dig Deeper" Feature
- **Inline Preview**: Shows first 3 rows of data
- **Recommended Questions**: AI-suggested follow-up questions
- **Full Source View**: Modal with complete data tables
- **Document Viewer**: Placeholder for PDF/Word preview

---

## 🔌 Backend Integration Guide

### Phase 1: Database Setup (Supabase)

1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com/dashboard
   # Create new project, note credentials
   ```

2. **Create Tables**
   ```sql
   -- Users (handled by Supabase Auth)
   
   -- Projects
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     description TEXT,
     location JSONB,
     status TEXT CHECK (status IN ('active', 'planned', 'archived', 'completed')),
     created_at TIMESTAMPTZ DEFAULT NOW(),
     owner_id UUID REFERENCES auth.users(id)
   );
   
   -- Assets (boreholes, monitoring, infrastructure)
   CREATE TABLE assets (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id),
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     location JSONB NOT NULL,
     data JSONB NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Documents
   CREATE TABLE documents (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id),
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     url TEXT NOT NULL,
     size BIGINT,
     uploaded_by UUID REFERENCES auth.users(id),
     uploaded_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Activities
   CREATE TABLE activities (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id),
     type TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     status TEXT CHECK (status IN ('not-started', 'in-progress', 'completed', 'cancelled')),
     priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
     due_date TIMESTAMPTZ,
     checklist JSONB,
     notes JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Notifications
   CREATE TABLE notifications (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     type TEXT NOT NULL,
     title TEXT NOT NULL,
     message TEXT NOT NULL,
     priority TEXT,
     read BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Chat Messages (consider pgvector for RAG)
   CREATE TABLE chat_messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id),
     role TEXT NOT NULL,
     content TEXT NOT NULL,
     metadata JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Enable pgvector extension for embeddings
   CREATE EXTENSION IF NOT EXISTS vector;
   
   -- Document embeddings for RAG
   CREATE TABLE document_embeddings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     document_id UUID REFERENCES documents(id),
     chunk_text TEXT NOT NULL,
     embedding vector(1536),  -- OpenAI ada-002 dimension
     metadata JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Set Up Storage Buckets**
   ```sql
   -- Create storage buckets
   INSERT INTO storage.buckets (id, name, public)
   VALUES 
     ('project-documents', 'project-documents', false),
     ('user-avatars', 'user-avatars', true),
     ('shapefiles', 'shapefiles', false);
   ```

4. **Row Level Security (RLS)**
   ```sql
   -- Enable RLS
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
   ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
   ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
   
   -- Example policy: Users can only see their projects
   CREATE POLICY "Users can view own projects"
     ON projects FOR SELECT
     USING (auth.uid() = owner_id);
   
   -- Add more policies as needed
   ```

### Phase 2: Frontend Integration

1. **Install Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create Supabase Client** (`/lib/supabase.ts`)
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. **Environment Variables** (`.env`)
   ```bash
   # 🔴 REQUIRED: Add these to your .env file
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   
   # 🔴 For AI integration
   VITE_TOGETHER_API_KEY=your-together-api-key
   # OR
   VITE_GROQ_API_KEY=your-groq-api-key
   # OR
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Replace Mock Data**
   
   Example: Replace `mockProjects` in dashboard:
   ```typescript
   // Before (mock):
   import { mockProjects } from '../lib/mock-data';
   const [projects] = useState(mockProjects);
   
   // After (real):
   import { supabase } from '../lib/supabase';
   const [projects, setProjects] = useState<Project[]>([]);
   
   useEffect(() => {
     async function fetchProjects() {
       const { data, error } = await supabase
         .from('projects')
         .select('*')
         .eq('owner_id', user?.id);
       
       if (data) setProjects(data);
     }
     fetchProjects();
   }, [user]);
   ```

### Phase 3: RAG Implementation

See `/guidelines/AI-Integration-Guide.md` for complete RAG setup.

**Quick Steps**:
1. Set up pgvector extension in Supabase
2. Generate embeddings for uploaded documents
3. Implement semantic search
4. Integrate with chat interface

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Replace all mock data with API calls
- [ ] Integrate authentication
- [ ] Set up file storage
- [ ] Configure AI service
- [ ] Test all features with real data
- [ ] Set up error logging (Sentry, etc.)
- [ ] Add analytics (PostHog, etc.)

### Security
- [ ] Enable RLS on all tables
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Review API key usage (should be server-side only)

### Performance
- [ ] Optimize images (use Next.js Image or similar)
- [ ] Lazy load components
- [ ] Implement pagination for large lists
- [ ] Add loading states
- [ ] Cache frequently accessed data
- [ ] Set up CDN for static assets

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel/Netlify/etc
# See DEPLOYMENT.md for platform-specific instructions
```

---

## ⚠️ Known Limitations

### Current Implementation
1. **No Pagination**: All data loads at once (add pagination when integrating backend)
2. **No Search**: Project/asset search not implemented yet
3. **No Offline Support**: Requires internet connection
4. **Client-Side Only**: No server-side rendering
5. **Mock AI**: AI responses are hardcoded mock data
6. **No Real-time Updates**: Would need Supabase realtime subscriptions
7. **Limited File Types**: Document preview only supports PDFs (placeholder)
8. **No Data Export**: Can't export data to Excel/CSV yet

### Browser Support
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **Not Supported**: IE11 and below

### Known Issues
1. **Map Dark Mode**: Sometimes flickers on theme toggle (cosmetic)
2. **File Upload**: Progress bar not implemented yet
3. **Shapefile Upload**: Large files (>50MB) may timeout in browser

---

## 📞 Support & Resources

### Documentation Files
- `PRD.md` - Complete product requirements
- `DEPLOYMENT.md` - Deployment instructions
- `EXPORT_SUMMARY.md` - Change log and feature summary
- `/guidelines/AI-Integration-Guide.md` - Complete AI setup guide
- `/guidelines/Quick-Start-AI.md` - Quick AI integration
- `/guidelines/QUICK_REFERENCE.md` - Code patterns and examples

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Leaflet](https://leafletjs.com/)
- [Recharts](https://recharts.org/)

### Package Dependencies
See `package.json` for complete list. Key dependencies:
- React 18
- TypeScript
- Tailwind CSS 4.0
- Leaflet + React-Leaflet
- Recharts
- Lucide React (icons)
- Sonner (toasts)
- Shadcn/ui components

---

## 🎉 You're Ready!

This codebase is production-ready for frontend deployment. Follow the integration steps above to connect your backend, and you'll have a fully functional geotechnical AI platform.

**Next Steps**:
1. Review all 🔴 PLACEHOLDER sections
2. Set up Supabase project
3. Follow Backend Integration Guide
4. Test thoroughly
5. Deploy!

Good luck! 🚀

---

**Last Updated**: January 2025  
**Maintained By**: KorrAI Development Team
