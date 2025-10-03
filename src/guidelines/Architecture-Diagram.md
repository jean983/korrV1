# KorrAI Activity Management - Architecture Diagram

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ActivityDetailsPage                          │
│  Main container for activity management                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Checklist│  │ Notes  │  │ Files  │
    │  Tab   │  │  Tab   │  │  Tab   │
    └────┬───┘  └────────┘  └────────┘
         │
         │ Contains multiple checklist items
         ▼
┌────────────────────────────────────────────────────┐
│              Checklist Item Card                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ [✓] Item Title              [Edit] [Link] [AI]│  │
│  │     Description                                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Expandable AI Context Panel (when expanded):      │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✨ AI-Generated Context                       │  │
│  │ [Context text from AI model...]               │  │
│  │                                                │  │
│  │ 📄 Relevant Documents                         │  │
│  │  - Document 1.pdf  [Preview]                  │  │
│  │  - Document 2.pdf  [Preview]                  │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
         │
         ├─── Triggers ───────────────────────┐
         │                                    │
         ▼                                    ▼
┌──────────────────────┐         ┌──────────────────────┐
│ LinkDocumentsDialog  │         │  FilePreviewDialog   │
│                      │         │                      │
│ Tabs:                │         │  Shows:              │
│  - Link Existing     │         │   - File metadata    │
│  - Upload New        │         │   - Tags             │
│                      │         │   - Preview area     │
│ [Search box]         │         │   - Download button  │
│ [ ] Document 1       │         └──────────────────────┘
│ [ ] Document 2       │
│ [✓] Document 3       │
│                      │
│ [Upload area]        │
│                      │
└──────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1. Clicks "Explore Further"
       ▼
┌──────────────────────────────────────┐
│   ActivityDetailsPage Component      │
│                                      │
│   handleExploreFurther(itemId)       │
└──────┬───────────────────────────────┘
       │
       │ 2. Calls AI Service
       ▼
┌──────────────────────────────────────┐
│        AI Service Layer              │
│   (aiService.generateCompletion)     │
└──────┬───────────────────────────────┘
       │
       ├─── Local Dev ────┐    ├─── Production ────┐
       ▼                  ▼    ▼                   ▼
   ┌────────┐      ┌──────────┐    ┌──────────────┐
   │ Ollama │      │ Together │    │ Groq / Other │
   │ (Local)│      │   .ai    │    │  Providers   │
   └────┬───┘      └────┬─────┘    └──────┬───────┘
        │               │                  │
        │               │                  │
        └───────────────┴──────────────────┘
                        │
                        │ 3. Returns AI context
                        ▼
        ┌───────────────────────────────────┐
        │    Update Component State         │
        │  (localActivity.checklist)        │
        └───────────────┬───────────────────┘
                        │
                        │ 4. Renders AI context
                        ▼
        ┌───────────────────────────────────┐
        │   Expanded AI Context Panel       │
        │   - AI insights                   │
        │   - Linked documents              │
        └───────────────────────────────────┘
```

## File Structure

```
korrai/
│
├── components/
│   ├── activity-details-page.tsx       [Modified] Main activity view
│   ├── file-preview-dialog.tsx         [New] File preview modal
│   ├── link-documents-dialog.tsx       [New] Document linking UI
│   └── ui/
│       ├── collapsible.tsx             [Existing] Used for expand/collapse
│       └── dialog.tsx                  [Existing] Modal base component
│
├── lib/
│   ├── mock-data.ts                    [Modified] Extended data models
│   └── ai-service-example.ts           [New] AI integration reference
│
└── guidelines/
    ├── AI-Integration-Guide.md         [New] Comprehensive AI guide
    ├── Quick-Start-AI.md               [New] Quick setup guide
    └── Architecture-Diagram.md         [This file]
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│              ActivityDetailsPage State                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  localActivity: Activity                                     │
│   ├── checklist: ActivityChecklistItem[]                    │
│   │    ├── id, title, description                           │
│   │    ├── completed, completedBy, completedAt              │
│   │    ├── linkedFiles: string[]          [New]             │
│   │    ├── aiContext: string              [New]             │
│   │    └── aiContextFetched: boolean      [New]             │
│   ├── notes: ActivityNote[]                                 │
│   └── files: ActivityFile[]                                 │
│                                                              │
│  expandedItems: Set<string>               [New]             │
│  loadingItems: Set<string>                [New]             │
│  editingItemId: string | null             [New]             │
│  editTitle: string                        [New]             │
│  editDescription: string                  [New]             │
│  previewFile: ProjectDocument | null      [New]             │
│  showFilePreview: boolean                 [New]             │
│  linkingDocItemId: string | null          [New]             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## User Interaction Flows

### Flow 1: Edit Checklist Item
```
User clicks edit icon
    ↓
handleStartEdit(item)
    ↓
Set editingItemId, editTitle, editDescription
    ↓
Show Input/Textarea fields
    ↓
User modifies text
    ↓
User clicks Save → handleSaveEdit()
    ↓
Update localActivity.checklist
    ↓
Clear edit state
    ↓
Show updated item
```

### Flow 2: Link Documents to Checklist Item
```
User clicks link icon
    ↓
Set linkingDocItemId
    ↓
Open LinkDocumentsDialog
    ↓
User searches/selects documents
    ↓
User clicks Save
    ↓
handleSaveLinkedDocuments(itemId, fileIds)
    ↓
Update item.linkedFiles array
    ↓
Show badge with count
    ↓
Close dialog
```

### Flow 3: Explore AI Context
```
User clicks "Explore Further"
    ↓
Toggle expandedItems set
    ↓
If not already fetched:
    ↓
Add to loadingItems set
    ↓
Call AI service (async)
    ↓
Wait for response (1.5s mock / real API time)
    ↓
Update item.aiContext
    ↓
Set item.aiContextFetched = true
    ↓
Remove from loadingItems
    ↓
Show AI context + linked documents
```

### Flow 4: Preview Document
```
User clicks document in AI context panel
    ↓
handleFilePreview(doc)
    ↓
Set previewFile and showFilePreview
    ↓
Open FilePreviewDialog
    ↓
Display metadata, tags, preview area
    ↓
User can download or close
```

## AI Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│   - ActivityDetailsPage                                      │
│   - ChatInterface                                            │
│   - ReportGenerator                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Uses
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Service Layer                            │
│   - AIService class                                          │
│   - Helper functions (generateChecklistContext, etc.)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Abstracts
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Provider Adapter Layer                          │
│   - OllamaAdapter                                            │
│   - TogetherAdapter                                          │
│   - GroqAdapter                                              │
│   - OpenAIAdapter                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Connects to
                     ▼
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌─────────────┐         ┌─────────────────┐
│   Local     │         │   Remote APIs   │
│   Ollama    │         │   (Together.ai, │
│   Server    │         │    Groq, etc.)  │
└─────────────┘         └─────────────────┘
```

## Database Schema (Future Enhancement)

```sql
-- Activities table (existing, extended)
activities
  - id
  - name
  - description
  - status
  ...

-- Checklist items (extended)
checklist_items
  - id
  - activity_id
  - title
  - description
  - completed
  - order
  - ai_context           [New]
  - ai_context_fetched   [New]

-- Document links (new junction table)
checklist_document_links
  - id
  - checklist_item_id
  - document_id
  - created_at

-- Documents table (existing)
documents
  - id
  - name
  - type
  - size
  - project_id
  - url
  ...

-- AI Cache (new, for optimization)
ai_context_cache
  - id
  - cache_key            (hash of prompt)
  - response
  - model_version
  - created_at
  - expires_at
```

## Performance Considerations

### Optimization Strategies

1. **AI Response Caching**
   ```
   Cache Key = hash(itemTitle + itemDescription + documentIds)
   Cache Duration = 24 hours
   
   Before calling AI:
     - Check cache
     - Return if found and not expired
     - Otherwise, call AI and cache result
   ```

2. **Lazy Loading**
   ```
   - Only load AI context when user expands
   - Documents loaded on-demand
   - Pagination for large document lists
   ```

3. **Debouncing**
   ```
   - Search input debounced (300ms)
   - Auto-save debounced (1000ms)
   ```

4. **Optimistic Updates**
   ```
   - Update UI immediately
   - Sync with backend asynchronously
   - Rollback on error
   ```

## Security Flow

```
┌──────────────┐
│  Frontend    │
└──────┬───────┘
       │
       │ 1. User action with JWT token
       ▼
┌──────────────────────┐
│  Backend API         │
│  - Validate token    │
│  - Check permissions │
└──────┬───────────────┘
       │
       │ 2. Sanitize input
       ▼
┌──────────────────────┐
│  AI Service Layer    │
│  - Rate limiting     │
│  - Input validation  │
└──────┬───────────────┘
       │
       │ 3. Secure API call
       ▼
┌──────────────────────┐
│  LLM Provider        │
│  - API key in header │
│  - TLS encryption    │
└──────────────────────┘
```

---

## Integration Checklist

### Phase 1: Local Development Setup
- [ ] Install Ollama
- [ ] Pull Llama 3.1 model
- [ ] Test basic chat completion
- [ ] Uncomment AI service implementation
- [ ] Test with one checklist item

### Phase 2: Feature Integration
- [ ] Replace mock generateAIContext with real AI
- [ ] Test edit functionality end-to-end
- [ ] Test document linking
- [ ] Test file preview
- [ ] Verify all loading states work

### Phase 3: Production Setup
- [ ] Choose production AI provider
- [ ] Set up API keys securely
- [ ] Implement error handling
- [ ] Add rate limiting
- [ ] Set up monitoring

### Phase 4: Optimization
- [ ] Implement response caching
- [ ] Add request batching
- [ ] Optimize prompts for token usage
- [ ] Set up analytics

---

**Last Updated:** October 2, 2025  
**Maintained By:** KorrAI Development Team
