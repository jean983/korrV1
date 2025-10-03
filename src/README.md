# KorrAI Geotechnical AI Platform

![KorrAI](https://img.shields.io/badge/Status-Stage%201%20Complete-success)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4.0-06B6D4)
![License](https://img.shields.io/badge/License-Proprietary-red)

**Version**: 2.0  
**Last Updated**: October 3, 2025  
**Status**: ✅ Stage 1 Complete - Ready for Backend Integration

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Backend Integration](#backend-integration)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Export & Handoff](#export--handoff)
- [Contributing](#contributing)

---

## 🎯 Overview

KorrAI is a specialized **Retrieval Augmented Generation (RAG) platform** designed specifically for geotechnical engineers. It combines AI-powered document analysis with domain-specific tools to streamline geotechnical analysis, foundation design, and regulatory compliance.

### Current Status

**Stage 1 is COMPLETE** with a fully functional frontend prototype ready for backend integration. The application includes:

- ✅ Complete authentication system (mock - ready for Supabase)
- ✅ Multi-project management with status tracking
- ✅ Interactive map interface with geospatial data support
- ✅ AI-powered RAG chat interface (mock AI - ready for real LLM)
- ✅ Comprehensive activity management with checklist workflows
- ✅ Document management with preview and linking
- ✅ Global notifications system
- ✅ Account settings and user preferences
- ✅ "Dig Deeper" data exploration feature
- ✅ Dark/Light theme support
- ✅ Fully responsive design

---

## ✨ Features

### 🔐 Authentication & User Management
- Login page with email/password (mock auth - replace with Supabase Auth)
- Account settings with profile management
- Theme toggle (Light/Dark)
- Notification preferences
- Password change functionality

### 📊 Dashboard & Project Management
- Split-screen layout (Map + Chat)
- Multi-project support with quick switching
- Project status indicators (Active, Planned, Archived, Completed)
- Resizable panels
- Context settings for RAG queries
- Global notifications bell icon

### 🗺️ Interactive Map Interface
- Leaflet-based mapping with custom markers
- Asset types: Boreholes, Monitoring Points, Infrastructure
- Asset clustering for performance
- Multiple base layers (Streets, Satellite, Terrain)
- Shapefile upload and rendering (GeoJSON support)
- "Dig Deeper" functionality from map popups
- Fullscreen map view

### 💬 AI Chat Interface
- Message history with user/AI distinction
- Source attribution badges
- Confidence indicators
- Reasoning step display
- "Dig Deeper" results inline
- File attachment support
- Auto-scroll and loading states
- Mock AI responses (ready for real LLM integration)

### 📝 Activity Management
- Create and track activities (Inspection, Audit, Monitoring, Review)
- Checklist workflows with completion tracking
- Document linking to checklist items
- AI "Explore Further" for contextual guidance
- Notes and file attachments
- AI-generated summaries
- Auto-save functionality

### 🔔 Notifications System
- Global notification bell with unread count
- Categorized notifications (Activity, System, Team)
- Mark as read/unread
- Time-relative timestamps
- Priority indicators

### 🎨 Design System
- **Brand Colors**: Teal Blue (#186181), Sage Green (#769f86), Navy (#1d2759)
- 40+ ShadCN UI components customized with KorrAI theme
- Responsive typography with global overrides
- Consistent spacing and layout system
- Accessible color contrast (WCAG AA)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4.0 (inline theme configuration)
- **UI Components**: ShadCN UI with custom theming
- **Mapping**: Leaflet with custom markers and clustering
- **Icons**: Lucide React
- **Forms**: React Hook Form v7.55.0 with Zod validation
- **Toast Notifications**: Sonner
- **Date Handling**: date-fns

### Backend (To Implement)
- **Database**: Supabase (PostgreSQL with pgvector)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **AI/LLM**: OpenAI GPT-4, Anthropic Claude, or Ollama (local)
- **Embeddings**: OpenAI, Cohere, or sentence-transformers

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd korrai-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Mock Authentication

Currently, the app uses **mock authentication** - you can login with any email/password combination.

**Example**:
- Email: `engineer@korrai.com`
- Password: `anything`

---

## 📁 Project Structure

```
korrai-platform/
├── App.tsx                          # Main app entry point with routing
├── components/
│   ├── login-page.tsx               # Authentication UI
│   ├── dashboard.tsx                # Main dashboard (map + chat)
│   ├── activities-page.tsx          # Activity list view
│   ├── activity-details-page.tsx    # Activity detail/edit view
│   ├── account-settings.tsx         # User account management
│   ├── chat-interface.tsx           # RAG chat UI
│   ├── project-map.tsx              # Map with assets
│   ├── dig-deeper-content.tsx       # Dig deeper preview
│   ├── source-preview-dialog.tsx    # Full source data viewer
│   ├── notifications-popover.tsx    # Notifications dropdown
│   ├── figma/
│   │   └── ImageWithFallback.tsx    # ⚠️ PROTECTED - Do not modify
│   └── ui/                          # ShadCN components (40+ files)
├── lib/
│   ├── ai-service-example.ts        # 🔧 AI integration examples
│   ├── mock-data.ts                 # 📊 Sample data (replace with Supabase)
│   └── notification-context.tsx     # Notification state management
├── styles/
│   └── globals.css                  # Global styles with detailed docs
├── guidelines/                      # Development documentation
│   ├── AI-Integration-Guide.md      # Complete AI/LLM setup
│   ├── Quick-Start-AI.md            # Fast Ollama setup
│   ├── Guidelines.md                # Dev best practices
│   └── QUICK_REFERENCE.md           # Common tasks reference
├── PRD.md                           # 📋 Product Requirements (complete specs)
└── Attributions.md                  # Third-party licenses
```

### Key Files

- **`/App.tsx`**: Main application with page routing logic
- **`/lib/mock-data.ts`**: 📊 Sample data for all features (replace with Supabase queries)
- **`/lib/ai-service-example.ts`**: 🔧 AI integration examples (Ollama, OpenAI, Together.ai, Groq)
- **`/styles/globals.css`**: Complete design system with extensive documentation
- **`/PRD.md`**: Comprehensive product requirements and technical specifications

---

## 🔌 Backend Integration

### Required Services

#### 1. **Supabase** (Database, Auth, Storage)

**Setup Steps**:
```bash
# 1. Create Supabase project at supabase.com
# 2. Get your credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 3. Enable pgvector extension for RAG embeddings
# 4. Create tables (see PRD.md Section 8 for schema)
# 5. Set up Row Level Security (RLS) policies
# 6. Configure storage buckets
```

**Required Tables**:
- `users`, `projects`, `project_members`, `activities`, `checklist_items`
- `documents`, `document_links`, `assets`, `asset_data`
- `notifications`, `chat_messages`, `data_sources`, `shapefile_layers`
- `embeddings` (with pgvector for RAG)

#### 2. **AI/LLM Service** (Choose one)

**Option A: Ollama (Free, Local, Recommended for Dev)**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.1:8b

# Start server
ollama serve

# Set environment variable
VITE_OLLAMA_BASE_URL=http://localhost:11434
```

**Option B: OpenAI (Best accuracy, Production)**
```bash
# Get API key from platform.openai.com
VITE_OPENAI_API_KEY=sk-your-key-here
```

**Option C: Together.ai (Fast, Cost-effective)**
```bash
# Get API key from together.ai
VITE_TOGETHER_API_KEY=your-key-here
```

**Option D: Groq (Ultra-fast, Free tier)**
```bash
# Get API key from groq.com
VITE_GROQ_API_KEY=your-key-here
```

### Implementation Guide

See comprehensive guides in `/guidelines/`:
- **`AI-Integration-Guide.md`**: Complete AI setup with code examples
- **`Quick-Start-AI.md`**: Fast local setup with Ollama

### Code Examples

All AI integration examples are in **`/lib/ai-service-example.ts`**:
- RAG query handling
- Checklist context generation
- Activity summary generation
- Multiple provider support (Ollama, OpenAI, Together.ai, Groq)

**Uncomment the implementation** and update imports when ready to use.

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `/dist` directory.

### Recommended Hosting

- **Vercel** (easiest, automatic deployments)
- **Netlify** (similar to Vercel)
- **AWS Amplify** (enterprise-grade)
- **Custom VPS** (full control)

### Environment Variables

Create `.env.local` file:

```bash
# === REQUIRED ===
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# === AI/LLM (Choose One) ===
# OpenAI (Production)
VITE_OPENAI_API_KEY=sk-your-key

# Ollama (Local Dev)
VITE_OLLAMA_BASE_URL=http://localhost:11434

# Together.ai (Alternative)
VITE_TOGETHER_API_KEY=your-key

# Groq (Alternative)
VITE_GROQ_API_KEY=your-key

# === OPTIONAL ===
# Feature flags
VITE_ENABLE_VOICE_INPUT=false
VITE_ENABLE_PDF_PREVIEW=true
VITE_ENABLE_SHAPEFILE_UPLOAD=true
```

### Deployment Checklist

**Pre-Deployment**:
- [ ] Set up Supabase project with all tables
- [ ] Configure Supabase Auth
- [ ] Create storage buckets
- [ ] Enable pgvector extension
- [ ] Set environment variables
- [ ] Test AI/LLM integration

**Deployment**:
- [ ] Build production bundle
- [ ] Deploy to hosting
- [ ] Configure custom domain
- [ ] Set up SSL
- [ ] Configure CORS

**Post-Deployment**:
- [ ] Monitor errors
- [ ] Set up analytics
- [ ] Configure backups
- [ ] Test authentication
- [ ] Verify file uploads

---

## 📚 Documentation

### Core Documentation

- **`PRD.md`**: Complete product requirements and technical specifications (v2.0 - Updated Jan 2025)
- **`EXPORT_HANDOFF.md`**: ⭐ **COMPREHENSIVE HANDOFF GUIDE** - Start here for integration!
- **`CLEANUP_CHECKLIST.md`**: Code review checklist and quality assurance
- **`.env.example`**: Environment variables template with detailed instructions
- **`DEPLOYMENT.md`**: Platform-specific deployment instructions
- **`EXPORT_SUMMARY.md`**: Feature summary and change log
- **`Attributions.md`**: Third-party licenses and credits

### Guidelines Directory (`/guidelines/`)

- **`AI-Integration-Guide.md`**: Comprehensive AI/LLM integration instructions (40+ pages)
- **`Quick-Start-AI.md`**: Fast setup for Ollama (5 minutes to AI-powered chat)
- **`Guidelines.md`**: Development best practices and coding patterns
- **`QUICK_REFERENCE.md`**: Quick reference for common tasks
- **`UI-UPDATES-VISUAL.md`**: Visual changelog of UI updates
- **`Architecture-Diagram.md`**: System architecture overview

### Code Documentation

All components have inline comments explaining:
- Component purpose and functionality
- Props and state management
- Integration points for backend
- 🔴 🟡 🟢 Placeholder indicators with priority levels

---

## 📦 Export & Handoff

### 🎯 For New Developers

**Start Here**: [`EXPORT_HANDOFF.md`](/EXPORT_HANDOFF.md)

This comprehensive guide includes:
- ✅ Quick start instructions
- ✅ Complete architecture overview
- ✅ **All placeholder locations** with code examples
- ✅ **All global overrides** clearly documented
- ✅ Backend integration guide with SQL schema
- ✅ Environment setup instructions
- ✅ Deployment checklist
- ✅ Known limitations and workarounds

### 🔍 Integration Checklist

Before going to production, review:

1. **`CLEANUP_CHECKLIST.md`** - Verification of code quality
2. **`.env.example`** - All required environment variables
3. **`PRD.md` Section 10** - Implementation status
4. **`EXPORT_HANDOFF.md` Section 6** - Backend integration SQL

### 🔴 Placeholder Priority System

All placeholders are marked with colored indicators:

- 🔴 **REQUIRED** - Must be implemented for production
  - Authentication (Supabase Auth)
  - AI Service (LLM integration)
  - Mock Data (Database queries)
  - File Upload (Supabase Storage)

- 🟡 **RECOMMENDED** - Improves functionality
  - Map tiles (Mapbox/Google Maps)
  - Shapefile processing (server-side)
  - Document preview (PDF.js)

- 🟢 **OPTIONAL** - Nice to have
  - Analytics integration
  - Voice input
  - Advanced visualizations

### 📊 Implementation Status

**✅ Complete**: All UI/UX, frontend logic, design system
**🟡 Backend Needed**: Authentication, database, AI, storage
**🔴 Placeholders**: Clearly marked in code with `// 🔴 PLACEHOLDER`

See [`PRD.md` Section 10](/PRD.md) for detailed feature breakdown.

---

## ⚠️ Important Notes

### Placeholders & Mock Data

The following features currently use **mock data/placeholders** and need backend integration:

#### 🔧 **Mock Authentication**
- **Location**: `/components/login-page.tsx` (line 13)
- **Current**: Accepts any email/password
- **Action Required**: Replace with Supabase Auth

#### 🤖 **Mock AI Responses**
- **Location**: `/lib/ai-service-example.ts` (lines 284-359)
- **Current**: Simulated AI responses with delays
- **Action Required**: Uncomment real implementation and configure LLM

#### 📊 **Mock Data**
- **Location**: `/lib/mock-data.ts` (entire file)
- **Current**: Sample projects, assets, activities, documents
- **Action Required**: Replace with Supabase database queries

#### 📄 **File Uploads**
- **Locations**: Multiple components
- **Current**: Shows confirmation dialogs only
- **Action Required**: Implement Supabase Storage integration

#### 🗺️ **Shapefile Processing**
- **Location**: `/components/project-settings.tsx`
- **Current**: Client-side validation only
- **Action Required**: Backend conversion service (GDAL/ogr2ogr)

#### 📖 **Document Viewer**
- **Location**: `/components/file-preview-dialog.tsx`, `/components/source-preview-dialog.tsx`
- **Current**: Placeholder UI
- **Action Required**: Implement PDF.js or similar for real PDF rendering

#### 🎤 **Voice Input**
- **Location**: `/components/chat-interface.tsx` (line 346)
- **Current**: Disabled button
- **Action Required**: Implement Web Speech API or similar

### Protected Files

**⚠️ DO NOT MODIFY**:
- `/components/figma/ImageWithFallback.tsx` - System component for image handling

### Global Style Overrides

The **`/styles/globals.css`** file contains important global typography overrides:

```css
/* These styles apply to ALL HTML elements by default */
h1, h2, h3, h4 { ... }  /* Auto-sized headings */
p, label, button, input { ... }  /* Consistent typography */
```

**⚠️ Important**: Only use Tailwind text classes (`text-sm`, `text-lg`, etc.) when you need to override these defaults. For most cases, use the global styles.

---

## 🤝 Contributing

### Development Workflow

1. **Read the guidelines** in `/guidelines/` directory
2. **Review the PRD** (`/PRD.md`) for feature specs
3. **Check placeholders** before implementing new features
4. **Follow the design system** (brand colors, typography, spacing)
5. **Test in light/dark modes**
6. **Ensure responsive design**

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Components**: ShadCN UI for base components
- **Icons**: Lucide React
- **Formatting**: Prettier (recommended)

### Git Commit Messages

```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code style change (no logic change)
refactor: Code refactoring
test: Test updates
chore: Build/config updates
```

---

## 🎨 Design System Quick Reference

### Brand Colors

```css
/* Primary (Teal Blue) */
--primary: #186181

/* Secondary (Sage Green) */
--secondary: #769f86
--success: #769f86

/* Navy */
--foreground: #1d2759

/* Utility Classes */
.text-brand-teal { color: #186181; }
.bg-brand-sage { background-color: #769f86; }
.border-brand-navy { border-color: #1d2759; }
```

### Typography

```tsx
// Use global defaults (no classes needed)
<h1>Heading 1</h1>  // Automatically styled
<p>Paragraph</p>    // Automatically styled

// Override only when needed
<h2 className="text-2xl">Custom Size</h2>
```

### Common Patterns

```tsx
// Status Badges
<Badge variant="outline" className="bg-success/10 text-success">
  Active
</Badge>

// Action Buttons
<Button variant="default" className="gap-2">
  <Icon className="w-4 h-4" />
  Action
</Button>

// Cards
<Card className="p-4">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

## 📊 Project Stats

- **Components**: 40+ React components
- **UI Library**: 40+ ShadCN components
- **Code Files**: 60+ TypeScript files
- **Documentation**: 5 comprehensive guides
- **Lines of Code**: ~15,000+
- **Mock Data**: 4 projects, 12 assets, sample activities
- **Status**: ✅ Stage 1 Complete

---

## 📝 License

**Proprietary** - KorrAI Platform  
Copyright © 2025 KorrAI. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🆘 Support

### Documentation
- **Product Requirements**: See `/PRD.md`
- **AI Integration**: See `/guidelines/AI-Integration-Guide.md`
- **Quick Start**: See `/guidelines/Quick-Start-AI.md`

### Common Issues

**Q: Login not working?**  
A: Current implementation uses mock auth - any credentials work. Replace with Supabase Auth for production.

**Q: AI not responding?**  
A: AI responses are currently simulated. See `/lib/ai-service-example.ts` for real implementation.

**Q: Files not uploading?**  
A: File upload currently shows confirmation dialogs. Implement Supabase Storage for real uploads.

**Q: Map not loading?**  
A: Ensure internet connection for Leaflet tiles. Check browser console for errors.

**Q: Dark mode not working?**  
A: Toggle in Account Settings or user dropdown menu.

---

## 🎯 Next Steps

### For Developers

1. **Backend Integration**:
   - Set up Supabase project
   - Implement database schema
   - Configure authentication
   - Add storage buckets

2. **AI Integration**:
   - Choose LLM provider (Ollama, OpenAI, etc.)
   - Implement RAG pipeline
   - Generate embeddings
   - Connect to chat interface

3. **Testing**:
   - Unit tests for components
   - Integration tests for API calls
   - E2E tests for user flows
   - Performance testing

### For Product Managers

1. **Review PRD** (`/PRD.md`) for complete feature specs
2. **Validate user flows** with screenshots and demos
3. **Plan Phase 2** features (geotechnical tools, advanced RAG)
4. **Prepare user documentation** and training materials

### For Designers

1. **Review design system** in `/styles/globals.css`
2. **Validate brand consistency** across all pages
3. **Test accessibility** (keyboard nav, screen readers)
4. **Prepare marketing materials** using brand colors

---

## 🚀 Ready to Launch

KorrAI Stage 1 is **complete and ready for backend integration**. All frontend components are functional, well-documented, and production-ready.

**What's Working**:
✅ Full UI/UX implementation  
✅ All core features functional  
✅ Responsive design  
✅ Theme system  
✅ Mock data for testing  
✅ Comprehensive documentation  

**What's Needed**:
🔧 Supabase backend setup  
🤖 AI/LLM integration  
📊 Real data connections  
🔐 Production authentication  
☁️ Cloud storage implementation  

---

**Built with ❤️ for Geotechnical Engineers**

