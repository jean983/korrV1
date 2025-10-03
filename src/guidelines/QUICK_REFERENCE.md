# KorrAI Activity Management - Quick Reference Card

## 🚀 Quick Commands

### AI Setup (Local Development)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.1:8b

# Start Ollama server
ollama serve

# Install dependencies
npm install ollama openai
```

### AI Setup (Production)
```bash
# Set API key
echo "TOGETHER_API_KEY=your-key-here" >> .env.local

# Already installed with ollama command above
```

---

## 📂 Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `/components/activity-details-page.tsx` | Main activity view | Modified |
| `/components/file-preview-dialog.tsx` | File preview modal | New |
| `/components/link-documents-dialog.tsx` | Document linking | New |
| `/lib/mock-data.ts` | Data models | Extended |
| `/lib/ai-service-example.ts` | AI integration code | New |
| `/guidelines/AI-Integration-Guide.md` | Full AI guide | New |
| `/guidelines/Quick-Start-AI.md` | Setup guide | New |

---

## 🎯 Feature Quick Access

### Edit Checklist Item
```typescript
// Location: ActivityDetailsPage component
const handleStartEdit = (item: ActivityChecklistItem) => {
  setEditingItemId(item.id);
  setEditTitle(item.title);
  setEditDescription(item.description || '');
};
```
**User Action:** Click edit icon (✏️) → Modify → Save/Cancel

### Link Documents
```typescript
// Trigger dialog
setLinkingDocItemId(item.id);

// Save links
handleSaveLinkedDocuments(itemId, selectedFileIds);
```
**User Action:** Click link icon (🔗) → Select docs → Save

### Generate AI Context
```typescript
// Current (mock)
const context = await generateChecklistContext(item, docs);

// Replace with real AI
import { generateChecklistContext } from '../lib/ai-service-example';
```
**User Action:** Click "Explore Further" (✨)

### Preview File
```typescript
handleFilePreview(document);
```
**User Action:** Click document name → View preview

---

## 🔧 Common Code Snippets

### Adding New AI Function
```typescript
export async function myAIFunction(input: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: 'You are a geotechnical assistant...',
    },
    {
      role: 'user',
      content: input,
    },
  ];

  const response = await aiService.chat(messages, {
    temperature: 0.7,
    maxTokens: 512,
  });

  return response.content;
}
```

### Calling AI Service
```typescript
import { aiService } from '../lib/ai-service-example';

// Simple completion
const response = await aiService.chat([
  { role: 'user', content: 'Your prompt here' }
]);

// With options
const response = await aiService.chat(messages, {
  temperature: 0.3,
  maxTokens: 256,
});
```

### Updating Checklist Item
```typescript
const updatedChecklist = localActivity.checklist.map(item => {
  if (item.id === targetId) {
    return { ...item, fieldToUpdate: newValue };
  }
  return item;
});

setLocalActivity({
  ...localActivity,
  checklist: updatedChecklist,
  updatedAt: new Date()
});
```

---

## 🎨 UI Component Reference

### Import Components
```typescript
import { FilePreviewDialog } from './file-preview-dialog';
import { LinkDocumentsDialog } from './link-documents-dialog';
```

### File Preview Dialog
```tsx
<FilePreviewDialog
  file={previewFile}
  open={showFilePreview}
  onOpenChange={setShowFilePreview}
/>
```

### Link Documents Dialog
```tsx
<LinkDocumentsDialog
  open={!!linkingDocItemId}
  onOpenChange={(open) => !open && setLinkingDocItemId(null)}
  currentLinkedFiles={item.linkedFiles || []}
  onSave={(fileIds) => handleSaveLinkedDocuments(itemId, fileIds)}
  projectId={activity.projectId}
/>
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" (Ollama) | Run `ollama serve` |
| "Model not found" | Run `ollama pull llama3.1:8b` |
| AI responses slow | Use smaller model (8B vs 70B) |
| "API key not found" | Check `.env.local` file |
| Edit not saving | Check console for errors |
| Document link not showing | Verify `linkedFiles` array |

---

## 📊 Data Model Quick Reference

### ActivityChecklistItem
```typescript
interface ActivityChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
  order: number;
  linkedFiles?: string[];        // NEW
  aiContext?: string;            // NEW
  aiContextFetched?: boolean;    // NEW
}
```

### ProjectDocument
```typescript
interface ProjectDocument {
  id: string;
  name: string;
  type: 'report' | 'drawing' | 'photo' | 'data' | 'specification';
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  projectId: string;
  tags: string[];
}
```

---

## ⚙️ Configuration Quick Reference

### AI Service Config
```typescript
const config: AIConfig = {
  // Local
  provider: 'ollama',
  model: 'llama3.1:8b',
  baseURL: 'http://localhost:11434',

  // Production
  // provider: 'together',
  // model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
  // apiKey: process.env.TOGETHER_API_KEY,
};
```

### Model Selection
```typescript
// Development
model: 'llama3.1:8b'          // Fast, local

// Production (quality)
model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo'

// Production (cost-effective)
model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
```

---

## 🔐 Environment Variables

```bash
# .env.local

# Together.ai
TOGETHER_API_KEY=your-together-key

# Groq (alternative)
GROQ_API_KEY=your-groq-key

# OpenAI (if using)
OPENAI_API_KEY=your-openai-key

# Optional: Custom Ollama URL
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 📈 Performance Tips

### Optimize AI Calls
```typescript
// Use lower temperature for deterministic results
{ temperature: 0.1 }

// Reduce max tokens for faster responses
{ maxTokens: 256 }

// Implement caching
const cacheKey = `${item.id}-${item.title}`;
if (cache.has(cacheKey)) return cache.get(cacheKey);
```

### Optimize UI
```typescript
// Debounce search
const debouncedSearch = useMemo(
  () => debounce((query) => setSearchQuery(query), 300),
  []
);

// Lazy load components
const FilePreviewDialog = lazy(() => import('./file-preview-dialog'));
```

---

## 🧪 Testing Snippets

### Test AI Service
```typescript
import { generateChecklistContext } from '../lib/ai-service-example';

const testItem = {
  title: 'Test checklist item',
  description: 'Test description'
};

const context = await generateChecklistContext(testItem, []);
console.log(context);
```

### Test Dialog
```tsx
// Add to your component
<button onClick={() => setShowFilePreview(true)}>
  Test Preview
</button>

<FilePreviewDialog
  file={mockDocuments[0]}
  open={showFilePreview}
  onOpenChange={setShowFilePreview}
/>
```

---

## 🎯 Common Use Cases

### Use Case 1: Generate Context for New Item
```typescript
const newItem = {
  id: uuid(),
  title: 'Check soil samples',
  description: 'Verify lab results',
  completed: false,
  order: checklist.length + 1,
};

// Generate AI context
const context = await generateChecklistContext(newItem, []);

// Add to checklist with context
const itemWithContext = {
  ...newItem,
  aiContext: context,
  aiContextFetched: true,
};
```

### Use Case 2: Link Documents After Upload
```typescript
// User uploads files
const uploadedFileIds = await uploadFiles(files);

// Link to checklist item
handleSaveLinkedDocuments(itemId, [
  ...existingLinkedFiles,
  ...uploadedFileIds
]);
```

### Use Case 3: Batch AI Generation
```typescript
// Generate context for all incomplete items
const incompleteItems = checklist.filter(item => !item.completed);

const contextPromises = incompleteItems.map(item =>
  generateChecklistContext(item, getLinkedDocuments(item.linkedFiles))
);

const contexts = await Promise.all(contextPromises);

// Update all at once
const updatedChecklist = checklist.map((item, i) => ({
  ...item,
  aiContext: contexts[i],
  aiContextFetched: true
}));
```

---

## 🚦 Status Indicators

| Icon | Meaning |
|------|---------|
| ✏️ | Edit mode available |
| 🔗 | Link documents |
| ✨ | AI features |
| 📄 | Document/file |
| ⏳ | Loading |
| ✓ | Completed |
| Badge (3) | Document count |

---

## 📚 Further Reading

- **Full AI Guide:** `/guidelines/AI-Integration-Guide.md`
- **Quick Start:** `/guidelines/Quick-Start-AI.md`
- **Architecture:** `/guidelines/Architecture-Diagram.md`
- **Implementation:** `/IMPLEMENTATION_SUMMARY.md`

---

## 💡 Pro Tips

1. **Start with Ollama** for development - it's free and runs locally
2. **Cache AI responses** to reduce costs and improve speed
3. **Use smaller models** for simple tasks (8B parameters)
4. **Use larger models** for complex analysis (70B+ parameters)
5. **Monitor token usage** in production to control costs
6. **Implement fallbacks** if AI service is unavailable
7. **Test with mock data** before connecting real AI
8. **Review prompts** regularly to improve quality

---

**Quick Help:** For immediate issues, check `/guidelines/Quick-Start-AI.md`  
**Last Updated:** October 2, 2025
