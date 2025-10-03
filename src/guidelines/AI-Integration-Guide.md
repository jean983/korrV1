# KorrAI - Open Source AI Model Integration Guide

This guide provides comprehensive instructions for integrating open-source Large Language Models (LLMs) into the KorrAI platform to power the AI context generation, chat interface, and intelligent playbook features.

## Table of Contents

1. [Overview](#overview)
2. [Recommended Open Source Models](#recommended-open-source-models)
3. [Integration Approaches](#integration-approaches)
4. [Implementation Guide](#implementation-guide)
5. [API Integration Examples](#api-integration-examples)
6. [Cost Optimization](#cost-optimization)
7. [Security & Privacy](#security--privacy)

---

## Overview

KorrAI uses AI in several key areas:
- **Activity Context Generation**: Extracting insights from historical reports and generating contextual guidance
- **Chat Interface**: RAG-based geotechnical engineering assistant
- **Playbook Automation**: Auto-generating checklists based on operating procedures
- **Document Analysis**: Extracting key information from technical documents

---

## Recommended Open Source Models

### 1. **Llama 3.1 (Meta)** - RECOMMENDED
- **Best for**: General reasoning, context generation, chat
- **Sizes**: 8B, 70B, 405B parameters
- **License**: Llama 3.1 Community License (Free for commercial use)
- **Why**: Excellent instruction-following, strong performance on technical content
- **Deployment**: Ollama, vLLM, TGI (Text Generation Inference)

### 2. **Mistral 7B / Mixtral 8x7B**
- **Best for**: Fast inference, cost-effective deployment
- **License**: Apache 2.0
- **Why**: Good balance of performance and resource efficiency
- **Deployment**: Ollama, vLLM, HuggingFace

### 3. **Qwen 2.5 (Alibaba)**
- **Best for**: Technical/scientific content, multilingual support
- **Sizes**: 7B, 14B, 32B, 72B parameters
- **License**: Apache 2.0
- **Why**: Strong performance on technical domains, excellent for geotechnical applications

### 4. **Phi-3 (Microsoft)**
- **Best for**: Resource-constrained environments, edge deployment
- **Sizes**: Mini (3.8B), Small (7B), Medium (14B)
- **License**: MIT
- **Why**: High quality despite smaller size, cost-effective

---

## Integration Approaches

### Approach 1: Local Deployment with Ollama (EASIEST)

**Pros:**
- No external API calls, complete privacy
- No per-token costs
- Fast inference for smaller models
- Easy setup and development

**Cons:**
- Requires GPU for acceptable performance
- Limited to available hardware resources
- Need to manage model hosting

**Best for:** Development, demos, small deployments, privacy-sensitive applications

### Approach 2: Self-Hosted API (vLLM/TGI)

**Pros:**
- Full control over infrastructure
- Scalable with cloud resources
- Can serve multiple applications
- Good performance with optimization

**Cons:**
- Requires DevOps expertise
- Cloud hosting costs (but predictable)
- Need to manage scaling and monitoring

**Best for:** Production deployments with moderate traffic

### Approach 3: Managed Open-Source APIs

**Services:**
- **Together.ai**: Hosts Llama 3.1, Mixtral, Qwen
- **Groq**: Ultra-fast inference for Llama models
- **Replicate**: Simple API for various models
- **Anyscale**: Enterprise-grade Llama hosting

**Pros:**
- No infrastructure management
- Pay-per-use pricing
- High availability and performance
- Easy scaling

**Cons:**
- Per-token costs (but cheaper than OpenAI)
- Less control than self-hosting
- Vendor lock-in considerations

**Best for:** Production with variable traffic, rapid deployment

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
# For Ollama integration (local)
npm install ollama

# For managed API integration (Together.ai, Groq, etc.)
npm install openai  # Most use OpenAI-compatible APIs

# For advanced RAG features
npm install @langchain/community @langchain/core
npm install chromadb  # Vector database for document embeddings
```

### Step 2: Create AI Service Module

Create `/lib/ai-service.ts`:

```typescript
// /lib/ai-service.ts

interface AIConfig {
  provider: 'ollama' | 'together' | 'groq' | 'replicate';
  model: string;
  apiKey?: string;
  baseURL?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateCompletion(
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<AIResponse> {
    switch (this.config.provider) {
      case 'ollama':
        return this.ollamaCompletion(messages, options);
      case 'together':
      case 'groq':
      case 'replicate':
        return this.openAICompatibleCompletion(messages, options);
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  private async ollamaCompletion(
    messages: ChatMessage[],
    options?: any
  ): Promise<AIResponse> {
    const { Ollama } = await import('ollama');
    const ollama = new Ollama({ host: this.config.baseURL || 'http://localhost:11434' });

    const response = await ollama.chat({
      model: this.config.model,
      messages: messages as any,
      options: {
        temperature: options?.temperature || 0.7,
        num_predict: options?.maxTokens || 2048,
      },
    });

    return {
      content: response.message.content,
    };
  }

  private async openAICompatibleCompletion(
    messages: ChatMessage[],
    options?: any
  ): Promise<AIResponse> {
    const { OpenAI } = await import('openai');
    
    const client = new OpenAI({
      apiKey: this.config.apiKey || 'dummy-key',
      baseURL: this.getBaseURL(),
    });

    const response = await client.chat.completions.create({
      model: this.config.model,
      messages: messages as any,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2048,
    });

    return {
      content: response.choices[0].message.content || '',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  }

  private getBaseURL(): string {
    const baseURLs = {
      together: 'https://api.together.xyz/v1',
      groq: 'https://api.groq.com/openai/v1',
      replicate: 'https://openai-proxy.replicate.com/v1',
    };
    return this.config.baseURL || baseURLs[this.config.provider as keyof typeof baseURLs];
  }
}

// Export singleton instance
export const aiService = new AIService({
  // For development: use Ollama locally
  provider: 'ollama',
  model: 'llama3.1:8b',
  baseURL: 'http://localhost:11434',

  // For production: use managed API (example with Together.ai)
  // provider: 'together',
  // model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
  // apiKey: process.env.TOGETHER_API_KEY,
});

export default AIService;
```

### Step 3: Implement Context Generation

Create `/lib/ai-context-generator.ts`:

```typescript
// /lib/ai-context-generator.ts

import { aiService } from './ai-service';
import { ActivityChecklistItem, ProjectDocument } from './mock-data';

export async function generateChecklistItemContext(
  item: ActivityChecklistItem,
  relatedDocuments: ProjectDocument[],
  projectContext: string
): Promise<string> {
  const systemPrompt = `You are an AI assistant for geotechnical engineers. Your task is to provide contextual guidance for activity checklist items based on historical data, relevant documents, and industry best practices.

Guidelines:
- Reference specific documents, standards, and regulations when available
- Highlight potential issues or concerns based on past activities
- Provide actionable recommendations
- Keep responses concise (2-3 paragraphs maximum)
- Use technical terminology appropriate for geotechnical engineering`;

  const userPrompt = `
Project Context: ${projectContext}

Checklist Item:
Title: ${item.title}
Description: ${item.description || 'No description provided'}

Related Documents:
${relatedDocuments.map(doc => `- ${doc.name} (${doc.type})`).join('\n')}

Task: Generate contextual guidance for this checklist item. Include:
1. Key considerations based on the document types available
2. Common issues or concerns for this type of task
3. Specific recommendations or standards to reference
`;

  const response = await aiService.generateCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], {
    temperature: 0.3, // Lower temperature for more focused responses
    maxTokens: 512,
  });

  return response.content;
}

export async function generateActivitySummary(
  activityType: string,
  completedItems: ActivityChecklistItem[],
  notes: string[]
): Promise<string> {
  const systemPrompt = `You are an AI assistant that generates concise activity summaries for geotechnical engineering projects.`;

  const userPrompt = `
Activity Type: ${activityType}

Completed Checklist Items:
${completedItems.map((item, i) => `${i + 1}. ${item.title}`).join('\n')}

Notes from Field:
${notes.join('\n\n')}

Generate a brief summary (2-3 sentences) of what was accomplished in this activity.
`;

  const response = await aiService.generateCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], {
    temperature: 0.5,
    maxTokens: 256,
  });

  return response.content;
}
```

### Step 4: Update Activity Details Component

Modify `/components/activity-details-page.tsx` to use real AI:

```typescript
// In activity-details-page.tsx

import { generateChecklistItemContext } from '../lib/ai-context-generator';

// Replace the mock generateAIContext function:
const handleExploreFurther = async (itemId: string) => {
  const item = localActivity.checklist.find(i => i.id === itemId);
  if (!item) return;

  const newExpanded = new Set(expandedItems);
  if (newExpanded.has(itemId)) {
    newExpanded.delete(itemId);
    setExpandedItems(newExpanded);
    return;
  }

  newExpanded.add(itemId);
  setExpandedItems(newExpanded);

  if (item.aiContextFetched) return;

  setLoadingItems(new Set(loadingItems).add(itemId));

  try {
    // Get related documents
    const linkedDocs = getLinkedDocuments(item.linkedFiles);
    
    // Get project context
    const project = mockProjects.find(p => p.id === localActivity.projectId);
    const projectContext = `${project?.name} - ${project?.description}`;

    // Generate AI context
    const aiContext = await generateChecklistItemContext(
      item,
      linkedDocs,
      projectContext
    );

    const updatedChecklist = localActivity.checklist.map(checklistItem => {
      if (checklistItem.id === itemId) {
        return {
          ...checklistItem,
          aiContext,
          aiContextFetched: true
        };
      }
      return checklistItem;
    });

    setLocalActivity({
      ...localActivity,
      checklist: updatedChecklist,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error generating AI context:', error);
    // Optionally show error toast
  } finally {
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }
};
```

### Step 5: Implement RAG for Chat Interface

Create `/lib/rag-service.ts`:

```typescript
// /lib/rag-service.ts

import { aiService } from './ai-service';

interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

interface RAGResponse {
  answer: string;
  sources: string[];
  reasoning: Array<{ step: number; description: string; sources: string[] }>;
}

export class RAGService {
  private documents: Document[] = [];

  async addDocuments(docs: Document[]) {
    this.documents.push(...docs);
    // In production, you would:
    // 1. Generate embeddings using a model like sentence-transformers
    // 2. Store in a vector database (ChromaDB, Pinecone, Weaviate)
  }

  async query(question: string, projectId?: string): Promise<RAGResponse> {
    // 1. Retrieve relevant documents (simplified - in production use vector similarity)
    const relevantDocs = this.documents
      .filter(doc => projectId ? doc.metadata.projectId === projectId : true)
      .slice(0, 5); // Take top 5 for context

    // 2. Build context from documents
    const context = relevantDocs
      .map(doc => `[${doc.metadata.name}]\n${doc.content}`)
      .join('\n\n---\n\n');

    // 3. Generate response with citations
    const systemPrompt = `You are KorrAI, an expert geotechnical engineering assistant. Answer questions based on the provided documents and your knowledge. Always cite your sources.

When providing reasoning:
1. Break down complex answers into clear steps
2. Reference specific documents when making claims
3. Use technical terminology appropriately
4. Provide calculations when relevant`;

    const userPrompt = `Context from project documents:

${context}

Question: ${question}

Provide a detailed answer with step-by-step reasoning. Format your response as:
ANSWER: [your answer here]
SOURCES: [list document names referenced]
REASONING: [numbered steps with sources]`;

    const response = await aiService.generateCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.3,
      maxTokens: 1024,
    });

    // Parse response (simplified - in production use structured output)
    const content = response.content;
    const answerMatch = content.match(/ANSWER:(.*?)(?=SOURCES:|$)/s);
    const sourcesMatch = content.match(/SOURCES:(.*?)(?=REASONING:|$)/s);
    
    return {
      answer: answerMatch?.[1].trim() || content,
      sources: relevantDocs.map(doc => doc.metadata.name),
      reasoning: this.parseReasoning(content),
    };
  }

  private parseReasoning(content: string) {
    // Simplified parsing - enhance for production
    const reasoningMatch = content.match(/REASONING:(.*)/s);
    if (!reasoningMatch) return [];

    const steps = reasoningMatch[1].trim().split('\n')
      .filter(line => /^\d+\./.test(line))
      .map((line, index) => ({
        step: index + 1,
        description: line.replace(/^\d+\.\s*/, ''),
        sources: [], // Would extract from line in production
      }));

    return steps;
  }
}

export const ragService = new RAGService();
```

---

## API Integration Examples

### Using Ollama (Local Development)

1. **Install Ollama:**
```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download from ollama.com
```

2. **Pull a model:**
```bash
ollama pull llama3.1:8b
# or for better quality (requires more RAM):
ollama pull llama3.1:70b
```

3. **Configure in your app:**
```typescript
// Set in your environment or config
const AI_CONFIG = {
  provider: 'ollama',
  model: 'llama3.1:8b',
  baseURL: 'http://localhost:11434'
};
```

### Using Together.ai (Production)

1. **Sign up:** https://together.ai
2. **Get API key** from dashboard
3. **Configure:**

```typescript
// .env.local
TOGETHER_API_KEY=your-api-key-here

// In your config
const AI_CONFIG = {
  provider: 'together',
  model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
  apiKey: process.env.TOGETHER_API_KEY
};
```

### Using Groq (Ultra-fast Inference)

1. **Sign up:** https://groq.com
2. **Get API key**
3. **Configure:**

```typescript
const AI_CONFIG = {
  provider: 'groq',
  model: 'llama-3.1-70b-versatile',
  apiKey: process.env.GROQ_API_KEY
};
```

**Groq Pricing (as of 2024):** Free tier available, then $0.05-0.10 per million tokens

---

## Cost Optimization

### Model Selection Strategy

| Use Case | Recommended Model | Cost Consideration |
|----------|------------------|-------------------|
| Chat interface (simple queries) | Llama 3.1 8B / Phi-3 | Very low cost |
| Context generation | Llama 3.1 70B / Qwen 2.5 32B | Balanced |
| Complex analysis | Llama 3.1 405B | High quality, higher cost |
| Embeddings (RAG) | sentence-transformers (local) | Free |

### Cost Reduction Techniques

1. **Caching:** Cache AI responses for common queries
```typescript
const contextCache = new Map<string, string>();

async function getCachedContext(itemId: string, item: ActivityChecklistItem) {
  const cacheKey = `${itemId}-${item.title}`;
  if (contextCache.has(cacheKey)) {
    return contextCache.get(cacheKey)!;
  }
  const context = await generateChecklistItemContext(item, ...);
  contextCache.set(cacheKey, context);
  return context;
}
```

2. **Prompt optimization:** Shorter prompts = lower costs
3. **Batch processing:** Process multiple items in one request
4. **Model routing:** Use smaller models for simple tasks, larger for complex
5. **Local embeddings:** Use sentence-transformers locally instead of API

---

## Security & Privacy

### Best Practices

1. **API Key Management:**
```typescript
// Never commit API keys
// Use environment variables
const API_KEY = process.env.TOGETHER_API_KEY;

// Validate before use
if (!API_KEY) {
  throw new Error('API key not configured');
}
```

2. **Data Privacy:**
- For sensitive geotechnical data, prefer local deployment (Ollama)
- If using managed APIs, review data retention policies
- Consider on-premise deployment for regulated industries

3. **Rate Limiting:**
```typescript
// Simple rate limiter
class RateLimiter {
  private requests: number[] = [];
  constructor(private maxRequests: number, private windowMs: number) {}

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
```

4. **Input Sanitization:**
```typescript
function sanitizeInput(input: string): string {
  // Remove potential injection attempts
  return input
    .replace(/[<>]/g, '')
    .slice(0, 10000); // Limit length
}
```

---

## Production Deployment Checklist

- [ ] Choose deployment strategy (local/cloud/managed)
- [ ] Set up API keys securely (environment variables, secrets manager)
- [ ] Implement error handling and retries
- [ ] Add monitoring and logging
- [ ] Set up rate limiting
- [ ] Configure caching for common requests
- [ ] Test with production-like data volumes
- [ ] Document model versions and configurations
- [ ] Set up fallback mechanisms if AI service is unavailable
- [ ] Review data privacy compliance (GDPR, etc.)
- [ ] Load test inference endpoints
- [ ] Set up cost alerts and budgets

---

## Additional Resources

- **Ollama Documentation:** https://ollama.com/docs
- **Together.ai Docs:** https://docs.together.ai
- **Groq Documentation:** https://console.groq.com/docs
- **LangChain (RAG framework):** https://js.langchain.com
- **Hugging Face Models:** https://huggingface.co/models
- **vLLM (self-hosting):** https://docs.vllm.ai

---

## Support

For questions about AI integration in KorrAI:
1. Check this guide first
2. Review the API documentation for your chosen provider
3. Test with the mock data first before deploying
4. Consider starting with Ollama for development, then moving to managed APIs for production

---

**Last Updated:** October 2, 2025
**Version:** 1.0
