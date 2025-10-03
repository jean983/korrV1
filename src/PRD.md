# Product Requirements Document (PRD)
## Korrai Geotechnical AI Platform

### **Executive Summary**
Korrai Geotechnical AI is a specialized Retrieval Augmented Generation (RAG) platform designed specifically for geotechnical engineers. The platform combines AI-powered document analysis with domain-specific tools to streamline geotechnical analysis, foundation design, and regulatory compliance.

---

## **1. Product Overview**

### **1.1 Vision Statement**
To revolutionize geotechnical engineering by providing AI-powered insights, automated analysis, and intelligent recommendations that enhance safety, efficiency, and accuracy in ground engineering projects.

### **1.2 Mission**
Empower geotechnical engineers with an intelligent platform that understands their domain-specific needs, accelerates decision-making, and ensures compliance with industry standards and regulations.

### **1.3 Target Users**
- **Primary**: Geotechnical Engineers (5-20 years experience)
- **Secondary**: Mining Engineers working with foundations
- **Tertiary**: Engineering consultancies and mining firms
- **Enterprise**: Large engineering firms and government regulatory agencies

---

## **2. Market Analysis**

### **2.1 Problem Statement**
- Geotechnical engineers spend 40-60% of their time on document review and analysis
- Critical information is scattered across standards, reports, and research papers
- Manual interpretation of soil data leads to conservative designs and increased costs
- Regulatory compliance requires constant updates on changing standards
- Knowledge transfer between senior and junior engineers is inefficient

### **2.2 Market Opportunity**
- Global geotechnical engineering market: $8.2B (2024)
- Growing infrastructure development and urbanization
- Increasing focus on sustainable foundation solutions
- Rising demand for data-driven engineering decisions

---

## **3. Product Goals & Objectives**

### **3.1 Primary Goals**
1. **Reduce Analysis Time**: Decrease document review time by 70%
2. **Improve Accuracy**: Provide AI-validated recommendations with confidence levels
3. **Ensure Compliance**: Real-time checking against current standards and codes
4. **Knowledge Democratization**: Make expert knowledge accessible to all experience levels

### **3.2 Success Metrics**
- User engagement: 5+ sessions per week per active user
- Time savings: 20+ hours saved per user per month
- Accuracy improvement: 90%+ user satisfaction with AI recommendations
- Adoption rate: 80% of users continue using after 30-day trial

---

## **4. Core Features & Requirements**

### **Implementation Status Legend**
- ✅ **Fully Implemented**: Feature complete with UI/UX
- 🟡 **Partially Implemented**: Core functionality present, backend integration needed
- 🔴 **Planned**: Not yet implemented
- 🟢 **Ready for Backend**: Frontend complete, awaiting API integration

### **4.1 Essential Features (MVP) - ✅ IMPLEMENTED**

#### **Document Intelligence** ✅
- **Upload & Processing**: Support for PDF, Word, Excel, image, drawing, and geospatial (i.e., shp) files ✅
- **File Preview Dialog**: View uploaded documents with metadata and type indicators ✅
- **Document Linking**: Link documents to activity checklist items ✅
- **Shapefile Upload**: Upload and visualize shapefiles as map layers ✅
- **Version Control**: Track document updates and maintain audit trails (ready for backend)

#### **RAG Chat Interface** ✅
- **Contextual Q&A**: Answer questions based on uploaded project documents ✅
- **Message Types**: User, assistant, system messages with proper formatting ✅
- **Source Attribution**: Display sources and references for AI responses ✅
- **File Attachments**: Upload files directly from chat interface ✅
- **Auto-scroll**: Automatic scrolling to latest messages ✅
- **Reasoning Display**: Show AI thought process with expandable reasoning steps ✅
- **Context Settings**: Configure RAG context including standards and data sources ✅

#### **Project Management** ✅
- **Project Organization**: Multi-project support with project switcher ✅
- **Project Status**: Active/Planned/Archived/Completed status system ✅
- **Project Settings**: Comprehensive settings page for project configuration ✅
- **Activity Management**: Full activity system with templates and checklists ✅
- **Progress Tracking**: Monitor activity completion and status ✅
- **Auto-save**: Automatic saving with toast notifications ✅
- **Team Collaboration**: User roles and project sharing (ready for backend) ✅

### **4.2 Advanced Features (Phase 2) - 🟡 PARTIALLY IMPLEMENTED**

#### **Geotechnical Analysis Tools** 🟡
- **"Dig Deeper" Data Exploration**: Interactive data exploration from map and chat ✅
- **Data Preview**: Show preview of borehole, monitoring, and infrastructure data ✅
- **Full Source View**: Complete data tables with all soil layers and readings ✅
- **Recommended Questions**: AI-suggested follow-up questions for deeper analysis ✅
- **Soil Classification**: Automated USCS and AASHTO classification (ready for backend)
- **Bearing Capacity**: Calculate allowable bearing pressures (ready for backend)
- **Settlement Analysis**: Predict foundation settlements (planned)
- **Slope Stability**: Analyze slope stability with various methods (planned)
- **Liquefaction Assessment**: Evaluate liquefaction potential (planned)

#### **Visualization & Modeling** ✅
- **Interactive Map**: Leaflet-based map with project locations ✅
- **Asset Markers**: Color-coded markers for boreholes, monitoring, infrastructure ✅
- **Popup Details**: Click markers to view asset information ✅
- **Shapefile Layers**: Upload and display shapefile layers with controls ✅
- **Layer Controls**: Toggle visibility and adjust opacity ✅
- **Map Expansion**: Expand map to full screen view ✅
- **Soil Profiles**: Generate visual soil profiles from borehole data (data structure ready)
- **Cross-sections**: Create geological cross-sections (planned)
- **3D Subsurface Models**: Build 3D geological models (planned)

#### **Data Integration** 🟡
- **Mock Geotechnical Data**: Sample borehole, monitoring, and infrastructure data ✅
- **Asset Details Panel**: Detailed view of selected assets ✅
- **Data Source Configuration**: Configure data sources in project settings ✅
- **Laboratory Data**: Import and analyze soil test results (ready for backend)
- **Field Monitoring**: Connect with monitoring equipment and sensors (ready for backend)
- **GIS Integration**: Shapefile upload implemented ✅
- **Weather Data**: Factor in environmental conditions (planned)

### **4.3 Enterprise Features (Phase 3)**

#### **Advanced Analytics**
- **Predictive Modeling**: Predict performance based on historical data
- **Risk Assessment**: Quantify geotechnical risks with uncertainty analysis
- **Cost Optimization**: Recommend cost-effective foundation solutions
- **Performance Monitoring**: Track long-term foundation performance

#### **Integration & APIs**
- **CAD Software**: Integration with AutoCAD, MicroStation
- **Analysis Software**: Connect with PLAXIS, GeoStudio, LPILE
- **Project Management**: Integration with Procore, Autodesk Construction Cloud
- **ERP Systems**: Connect with enterprise resource planning systems

---

## **5. Technical Architecture**

### **5.1 Frontend Architecture**
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with Korrai design system
- **State Management**: React Query for server state, Zustand for client state
- **Charts/Visualization**: Recharts, D3.js for complex visualizations
- **3D Rendering**: Three.js for 3D geological models

### **5.2 Backend Architecture**
- **Database**: Supabase (PostgreSQL) with pgvector for embeddings
- **Authentication**: Supabase Auth with role-based access control
- **File Storage**: Supabase Storage for documents and models
- **AI/ML**: OpenAI GPT-4 for chat, custom embeddings for domain knowledge
- **APIs**: RESTful APIs with real-time subscriptions

### **5.3 AI/ML Components**
- **Document Processing**: Custom pipeline for geotechnical document parsing
- **Vector Database**: Specialized embeddings for geotechnical terminology
- **RAG Pipeline**: Context-aware retrieval with source attribution
- **Domain Models**: Fine-tuned models for specific geotechnical calculations

### **5.4 Security & Compliance**
- **Data Encryption**: End-to-end encryption for sensitive project data
- **Access Control**: Project-based permissions and team management
- **Audit Logging**: Complete audit trail for regulatory compliance
- **Data Residency**: Support for regional data storage requirements

---

## **6. User Experience Design**

### **6.1 Core User Journeys**

#### **New Project Setup**
1. Create new project with basic information
2. Upload relevant documents (site investigation, previous reports)
3. AI processes documents and extracts key information
4. Review extracted data and make corrections if needed
5. Begin analysis and design process

#### **Foundation Design Analysis**
1. Input soil parameters or import from documents
2. Specify foundation type and loading conditions
3. AI recommends design approach based on standards
4. Review calculations and safety factors
5. Generate design report with references

#### **Regulatory Compliance Check**
1. Upload design documents or calculations
2. Specify applicable codes and standards
3. AI checks compliance and identifies issues
4. Receive detailed compliance report
5. Access recommendations for addressing non-compliance

### **6.2 Interface Design Principles**
- **Domain-Focused**: UI designed specifically for geotechnical workflows
- **Progressive Disclosure**: Show relevant information based on current task
- **Visual Clarity**: Clear representation of technical data and calculations
- **Mobile Responsive**: Field access for site engineers

---

## **7. Monetization Strategy**

### **7.1 Pricing Tiers**

#### **Starter Plan - $49/month per user**
- 5 active projects
- 100 document uploads per month
- Basic AI chat and analysis
- Standard report templates
- Email support

#### **Professional Plan - $149/month per user**
- Unlimited projects
- 500 document uploads per month
- Advanced analysis tools
- Custom report templates
- Team collaboration (up to 10 users)
- Priority support

#### **Enterprise Plan - Custom pricing**
- Custom user limits
- Unlimited document processing
- API access and integrations
- Custom AI model training
- Dedicated account management
- On-premise deployment options

### **7.2 Revenue Projections**
- **Year 1**: $500K ARR (300 users average)
- **Year 2**: $2.5M ARR (1,000 users average)
- **Year 3**: $8M ARR (2,500 users average)

---

## **8. Development Roadmap**

### **Phase 1: MVP (Months 1-4)**
- Core RAG implementation
- Document upload and processing
- Basic chat interface
- Project management
- User authentication

### **Phase 2: Domain Tools (Months 5-8)**
- Geotechnical analysis calculators
- Soil classification tools
- Foundation design recommendations
- Standards integration
- Basic visualization

### **Phase 3: Advanced Features (Months 9-12)**
- 3D modeling capabilities
- Monitoring data integration
- Team collaboration features
- Advanced analytics
- Mobile app

### **Phase 4: Enterprise (Months 13-16)**
- API integrations
- Custom model training
- On-premise deployment
- Advanced security features
- Industry partnerships

---

## **9. Risk Assessment**

### **9.1 Technical Risks**
- **AI Accuracy**: Risk of incorrect technical recommendations
- **Data Quality**: Poor quality input data affecting analysis
- **Scalability**: Performance issues with large datasets
- **Integration Complexity**: Challenges connecting with existing software

### **9.2 Business Risks**
- **Market Adoption**: Slow adoption in conservative engineering industry
- **Competition**: Established CAD/analysis software vendors entering market
- **Regulatory Changes**: Changes in engineering standards affecting platform
- **Talent Acquisition**: Difficulty finding geotechnical + AI expertise

### **9.3 Mitigation Strategies**
- Implement confidence scoring and uncertainty quantification
- Extensive testing with domain experts and pilot customers
- Gradual rollout with continuous feedback collection
- Strong partnerships with engineering firms for market validation

---

## **10. Current Implementation Status**

### **10.1 Completed Features (Stage 1)**

#### **Authentication & User Management** ✅
- Login page with email/password authentication (mock - ready for Supabase)
- User profile with avatar and settings
- Account settings page with profile customization
- Theme toggle (light/dark mode)
- Logout functionality
- Session management

#### **Dashboard & Navigation** ✅
- Split-screen layout: Chat (60%) + Map (40%)
- Responsive design for mobile and desktop
- Project selector dropdown with status badges
- Top navigation bar with logo, notifications, user menu
- Sidebar navigation (ready for additional pages)
- Mobile menu with hamburger icon

#### **Chat Interface (RAG)** ✅
- Message display with user/assistant/system types
- Input field with Enter to send, Shift+Enter for new line
- File attachment button with upload confirmation
- Auto-scroll to latest message
- Source attribution badges
- "Dig Deeper" inline content with data preview
- Reasoning popup showing AI thought process
- Context-aware responses (mock AI)

#### **Interactive Map** ✅
- Leaflet-based map with OpenStreetMap tiles
- Project location markers
- Asset markers: Boreholes (red), Monitoring (blue), Infrastructure (yellow)
- Click markers for popup details
- Right-click "Dig Deeper" on markers
- Shapefile layer rendering
- Layer controls (visibility, opacity)
- Expand to full screen
- Dark mode support

#### **Activity Management System** ✅
- Activities page with activity cards
- Activity templates: Inspection, Environmental Audit, Safety Meeting
- Create new activities with form dialog
- Activity detail page with full information
- Dynamic checklists with add/remove items
- "Explore Further" AI-powered context on checklist items
- Document linking to checklist items
- File preview dialog for linked documents
- Progress tracking (percentage complete)
- Status management (Not Started, In Progress, Completed, Cancelled)
- Priority levels (Low, Medium, High)
- Due date tracking
- Notes section
- Auto-save with toast notifications

#### **Project Settings** ✅
- Project information tab
- Team members management (ready for backend)
- Documents list with upload
- Data sources configuration
- Shapefile upload with layer management
- Project status updates
- Delete project functionality
- Back navigation to dashboard

#### **Notifications System** ✅
- Bell icon with unread count badge
- Notification types: activity, document, system, mention
- Priority levels: low, medium, high
- Mark as read/unread
- Mark all as read
- Notification popover with scrollable list
- Recent notifications (last 7 days)
- Color-coded priority indicators

#### **"Dig Deeper" Feature** ✅
- Triggered from map markers or chat
- Inline preview in chat window
- Shows first 3 items from each data table
- Recommended AI-generated questions
- "View Full Source" button
- Full source dialog with complete data
- Data type detection (borehole, monitoring, infrastructure, document)
- Borehole full data: basic info, soil stratigraphy with all layers
- Monitoring full data: basic info, parameters, latest readings
- Infrastructure full data: basic info, specifications
- Document viewer placeholder (PDF/Word)

#### **File Management** ✅
- File upload confirmation dialog
- File preview dialog with metadata
- Document type icons
- File size display
- Upload date tracking
- Link documents to activities
- Supported types: PDF, Word, Excel, Images, Shapefiles

#### **Context Settings** ✅
- Include borehole data toggle
- Include monitoring data toggle
- Include infrastructure data toggle
- Standards selection (Eurocode 7, BS 8002, etc.)
- Custom instructions text area
- Apply settings button
- Persistent settings (ready for backend)

#### **Design System** ✅
- Korrai brand colors: Teal (#186181), Sage (#769f86), Navy (#1d2759)
- Light and dark theme support
- Shadcn/ui component library (customized)
- Consistent typography system
- Global CSS overrides for brand consistency
- Success/warning/error color scheme
- Custom chart colors matching brand
- Loading states with skeletons
- Toast notifications (Sonner)

### **10.2 Technical Implementation**

#### **Frontend Architecture** ✅
- React 18 with TypeScript
- Tailwind CSS v4.0
- Component-based architecture
- Custom hooks for state management
- Context API for notifications
- Mock data layer (ready for API replacement)

#### **Data Models** ✅
Complete TypeScript interfaces for:
- Projects
- Activities
- Assets (Borehole, Monitoring, Infrastructure)
- Documents
- Notifications
- Chat Messages
- Users
- Shapefile Layers
- Context Settings

#### **Integration Points** 🟢
All ready for backend integration:
- Authentication (Supabase Auth)
- Database (Supabase PostgreSQL)
- File Storage (Supabase Storage)
- AI Service (Ollama/Together.ai/Groq/OpenAI)
- Vector Database (pgvector for RAG)
- Real-time subscriptions (Supabase Realtime)

### **10.3 Documentation** ✅
- **PRD.md**: Complete product requirements (this document)
- **EXPORT_HANDOFF.md**: Comprehensive handoff guide with all placeholders
- **DEPLOYMENT.md**: Deployment instructions
- **EXPORT_SUMMARY.md**: Feature summary and change log
- **/guidelines/AI-Integration-Guide.md**: Complete AI integration guide
- **/guidelines/Quick-Start-AI.md**: Quick start for AI setup
- **/guidelines/QUICK_REFERENCE.md**: Code patterns and examples
- **/guidelines/Architecture-Diagram.md**: System architecture
- **/guidelines/UI-UPDATES-VISUAL.md**: UI update history
- **Attributions.md**: Third-party attributions
- **README.md**: Project overview

---

## **11. Success Criteria**

### **11.1 Product Metrics**
- 90%+ accuracy in document data extraction
- <2 second response time for chat queries
- 95%+ uptime for critical features
- 4.5+ star average user rating

### **11.2 Business Metrics**
- 1,000+ active users by end of Year 1
- 70%+ customer retention rate
- $2M+ ARR by end of Year 2
- 85%+ Net Promoter Score (NPS)

### **11.3 Impact Metrics**
- 50%+ reduction in time for foundation design
- 30%+ improvement in design optimization
- 90%+ compliance with applicable standards
- 25%+ reduction in project review cycles

---

## **Appendices**

### **A. Technical Specifications**
[Detailed technical requirements and specifications]

### **B. Market Research Data**
[Comprehensive market analysis and competitive landscape]

### **C. User Research Findings**
[Interview summaries and user needs analysis]

### **D. Regulatory Requirements**
[Engineering standards and compliance requirements by region]

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Implementation Status**: Stage 1 Complete - Ready for Backend Integration  
**Next Review**: February 2025  
**Owner**: Product Team, Korrai  
**Stakeholders**: Engineering Team, Business Development, Customer Success

---

## **Document Change Log**

### Version 2.0 - January 2025
- ✅ Added comprehensive implementation status section
- ✅ Updated feature list with completion status
- ✅ Added status legend (✅ 🟡 🔴 🟢)
- ✅ Documented all completed features in Stage 1
- ✅ Added technical implementation details
- ✅ Linked to EXPORT_HANDOFF.md for integration guide
- ✅ Updated roadmap with actual progress

### Version 1.0 - December 2024
- Initial PRD creation
- Core feature definition
- Market analysis
- Technical architecture planning