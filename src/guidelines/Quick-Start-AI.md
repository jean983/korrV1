# Quick Start: AI Integration for KorrAI

## 5-Minute Setup with Ollama (Local Development)

### 1. Install Ollama
```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download from https://ollama.com/download
```

### 2. Pull Llama Model
```bash
ollama pull llama3.1:8b
```

### 3. Install Dependencies
```bash
npm install ollama
```

### 4. Create AI Service
Create `/lib/ai-service-simple.ts`:

```typescript
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const response = await ollama.chat({
      model: 'llama3.1:8b',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful geotechnical engineering assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.message.content;
  } catch (error) {
    console.error('AI generation error:', error);
    return 'AI service temporarily unavailable. Please try again.';
  }
}
```

### 5. Use in Your Component
```typescript
// In activity-details-page.tsx
import { generateAIResponse } from '../lib/ai-service-simple';

const handleExploreFurther = async (itemId: string) => {
  const item = localActivity.checklist.find(i => i.id === itemId);
  if (!item) return;

  setLoadingItems(new Set(loadingItems).add(itemId));

  try {
    const prompt = `Generate contextual guidance for this checklist item:
    
    Title: ${item.title}
    Description: ${item.description || 'N/A'}
    
    Provide 2-3 paragraphs with:
    - Key considerations
    - Common issues
    - Best practices`;

    const aiContext = await generateAIResponse(prompt);

    // Update state with AI context
    const updatedChecklist = localActivity.checklist.map(checklistItem => {
      if (checklistItem.id === itemId) {
        return { ...checklistItem, aiContext, aiContextFetched: true };
      }
      return checklistItem;
    });

    setLocalActivity({
      ...localActivity,
      checklist: updatedChecklist,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }
};
```

### 6. Test
```bash
# Ensure Ollama is running
ollama serve

# In another terminal
npm run dev
```

Navigate to an activity, click "Explore Further" on any checklist item!

---

## Production Setup with Together.ai (Managed API)

### 1. Sign Up
Visit https://together.ai and create an account

### 2. Get API Key
Copy your API key from the dashboard

### 3. Add to Environment
```bash
# .env.local
TOGETHER_API_KEY=your-api-key-here
```

### 4. Install SDK
```bash
npm install openai
```

### 5. Update AI Service
```typescript
// /lib/ai-service-simple.ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
});

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful geotechnical engineering assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    return response.choices[0].message.content || 'No response generated';
  } catch (error) {
    console.error('AI generation error:', error);
    return 'AI service temporarily unavailable. Please try again.';
  }
}
```

### 6. Deploy
Your app now uses a production-ready AI service!

---

## Switching Between Development and Production

```typescript
// /lib/ai-service-simple.ts

const USE_PRODUCTION = process.env.NODE_ENV === 'production';

export async function generateAIResponse(prompt: string): Promise<string> {
  if (USE_PRODUCTION) {
    return generateTogetherAI(prompt);
  } else {
    return generateOllamaAI(prompt);
  }
}

async function generateOllamaAI(prompt: string): Promise<string> {
  const { Ollama } = await import('ollama');
  const ollama = new Ollama({ host: 'http://localhost:11434' });
  // ... Ollama implementation
}

async function generateTogetherAI(prompt: string): Promise<string> {
  const { OpenAI } = await import('openai');
  // ... Together.ai implementation
}
```

---

## Common Issues

### "Connection refused" when using Ollama
**Solution:** Ensure Ollama is running: `ollama serve`

### "Model not found"
**Solution:** Pull the model first: `ollama pull llama3.1:8b`

### Slow responses
**Solution:** 
- Use smaller model for development (8B instead of 70B)
- Reduce max_tokens in the request
- Use GPU if available

### API rate limits
**Solution:**
- Implement caching for repeated queries
- Add rate limiting on client side
- Upgrade API plan if needed

---

## Recommended Models by Use Case

| Use Case | Local (Ollama) | Production (API) |
|----------|---------------|------------------|
| Development | llama3.1:8b | N/A |
| Chat Interface | llama3.1:8b | Llama-3.1-70B-Instruct-Turbo |
| Context Generation | qwen2.5:14b | Qwen-2.5-72B-Instruct |
| Document Analysis | llama3.1:70b | Llama-3.1-405B-Instruct |

---

## Next Steps

1. ✅ Get basic AI working (this guide)
2. 📖 Read full integration guide (`AI-Integration-Guide.md`)
3. 🔧 Implement RAG for chat interface
4. 🚀 Add caching and optimization
5. 📊 Monitor usage and costs
6. 🔒 Review security and privacy

---

For detailed implementation, see `AI-Integration-Guide.md`
