/**
 * AI Service Example Implementation for KorrAI
 * 
 * This file demonstrates how to integrate open-source LLMs into KorrAI.
 * See /guidelines/AI-Integration-Guide.md for full documentation.
 * 
 * Quick Start:
 * 1. Install Ollama: https://ollama.com
 * 2. Pull model: ollama pull llama3.1:8b
 * 3. Install deps: npm install ollama openai
 * 4. Start Ollama: ollama serve
 * 5. Uncomment the implementation below
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

export type AIProvider = 'ollama' | 'together' | 'groq' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

// Default configuration - modify based on your needs
const DEFAULT_CONFIG: AIConfig = {
  // For local development with Ollama
  provider: 'ollama',
  model: 'llama3.1:8b',
  baseURL: 'http://localhost:11434',
  
  // For production with Together.ai (uncomment and set API key)
  // provider: 'together',
  // model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
  // apiKey: process.env.TOGETHER_API_KEY,
  
  temperature: 0.7,
  maxTokens: 2048,
};

// ============================================================================
// EXAMPLE IMPLEMENTATION (Uncomment to use)
// ============================================================================

/*
import { Ollama } from 'ollama';
import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
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

export class AIService {
  private config: AIConfig;

  constructor(config: Partial<AIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async chat(messages: ChatMessage[], options?: Partial<AIConfig>): Promise<AIResponse> {
    const finalConfig = { ...this.config, ...options };

    switch (finalConfig.provider) {
      case 'ollama':
        return this.chatOllama(messages, finalConfig);
      case 'together':
      case 'groq':
      case 'openai':
        return this.chatOpenAICompatible(messages, finalConfig);
      default:
        throw new Error(`Unsupported provider: ${finalConfig.provider}`);
    }
  }

  private async chatOllama(messages: ChatMessage[], config: AIConfig): Promise<AIResponse> {
    const ollama = new Ollama({ 
      host: config.baseURL || 'http://localhost:11434' 
    });

    const response = await ollama.chat({
      model: config.model,
      messages: messages as any,
      options: {
        temperature: config.temperature,
        num_predict: config.maxTokens,
      },
    });

    return {
      content: response.message.content,
    };
  }

  private async chatOpenAICompatible(
    messages: ChatMessage[], 
    config: AIConfig
  ): Promise<AIResponse> {
    const baseURLs: Record<string, string> = {
      together: 'https://api.together.xyz/v1',
      groq: 'https://api.groq.com/openai/v1',
      openai: 'https://api.openai.com/v1',
    };

    const client = new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      baseURL: config.baseURL || baseURLs[config.provider],
    });

    const response = await client.chat.completions.create({
      model: config.model,
      messages: messages as any,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
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
}

// Singleton instance
export const aiService = new AIService();
*/

// ============================================================================
// HELPER FUNCTIONS FOR KORRAI USE CASES
// ============================================================================

/**
 * Generate contextual guidance for a checklist item
 * 
 * @example
 * const context = await generateChecklistContext({
 *   title: "Review environmental reports",
 *   description: "Check past findings",
 * }, ["Environmental Audit Q1.pdf", "Permit EP3425.pdf"]);
 */
/*
export async function generateChecklistContext(
  checklistItem: { title: string; description?: string },
  relatedDocuments: string[]
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are an expert geotechnical engineering assistant. Provide concise, 
actionable guidance for activity checklist items based on context and best practices.`,
    },
    {
      role: 'user',
      content: `Checklist Item: ${checklistItem.title}
${checklistItem.description ? `Description: ${checklistItem.description}` : ''}

Related Documents:
${relatedDocuments.map(doc => `- ${doc}`).join('\n')}

Provide 2-3 paragraphs with:
1. Key considerations
2. Common issues or concerns
3. Relevant standards or best practices`,
    },
  ];

  const response = await aiService.chat(messages, {
    temperature: 0.3, // Lower temperature for more focused responses
    maxTokens: 512,
  });

  return response.content;
}
*/

/**
 * Answer geotechnical engineering questions using RAG
 * 
 * @example
 * const answer = await answerQuestion(
 *   "What is the bearing capacity at 3m depth?",
 *   ["BH-001 borehole log shows dense gravel..."]
 * );
 */
/*
export async function answerQuestion(
  question: string,
  contextDocuments: string[]
): Promise<{ answer: string; sources: string[] }> {
  const context = contextDocuments.join('\n\n---\n\n');

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are KorrAI, an expert geotechnical engineering assistant. 
Answer questions based on provided context and your knowledge. Always cite sources.`,
    },
    {
      role: 'user',
      content: `Context:\n${context}\n\nQuestion: ${question}\n\nProvide a detailed answer with citations.`,
    },
  ];

  const response = await aiService.chat(messages, {
    temperature: 0.3,
    maxTokens: 1024,
  });

  // Extract sources from response (simplified)
  const sources = contextDocuments
    .map((doc, i) => `Source ${i + 1}`)
    .slice(0, 3);

  return {
    answer: response.content,
    sources,
  };
}
*/

/**
 * Generate activity summary from completed items and notes
 * 
 * @example
 * const summary = await generateActivitySummary(
 *   "Environmental Audit",
 *   ["Reviewed reports", "Inspected site"],
 *   ["Oil staining remediated", "All permits current"]
 * );
 */
/*
export async function generateActivitySummary(
  activityType: string,
  completedItems: string[],
  notes: string[]
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'Generate concise summaries of completed activities.',
    },
    {
      role: 'user',
      content: `Activity: ${activityType}

Completed:
${completedItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Notes:
${notes.join('\n')}

Generate a brief 2-3 sentence summary.`,
    },
  ];

  const response = await aiService.chat(messages, {
    temperature: 0.5,
    maxTokens: 256,
  });

  return response.content;
}
*/

// ============================================================================
// MOCK IMPLEMENTATION (Active until real AI is configured)
// ============================================================================

/**
 * Mock AI responses for development/testing
 * Replace with real implementation above when ready
 */
export async function generateChecklistContext(
  checklistItem: { title: string; description?: string },
  relatedDocuments: string[]
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockResponses: Record<string, string> = {
    'review': `Based on analysis of related documents, this review task requires attention to:
    
1. Verification that all previous findings have been addressed
2. Cross-referencing with current regulatory requirements
3. Documentation of any deviations from standard procedures

Key considerations: Ensure all stakeholders have provided input, check for any outstanding issues from prior reviews, and maintain comprehensive documentation for audit purposes.`,
    
    'inspect': `Site inspection should focus on visual assessment and verification of conditions:

1. Safety protocols must be followed at all times
2. Photographic documentation is essential for records
3. Any anomalies should be immediately reported

Common issues include: access restrictions, weather conditions affecting visibility, equipment availability. Ensure proper PPE and site authorization before proceeding.`,
    
    'check': `Compliance verification requires systematic review of all applicable requirements:

1. Current permits and their expiration dates
2. Regulatory updates since last review
3. Documentation of compliance measures

Reference relevant standards and maintain detailed records. Note any areas requiring remediation or follow-up action.`,

    'default': `This task requires careful attention to detail and adherence to established procedures. Key considerations include:

1. Review of relevant documentation and historical data
2. Verification of current conditions and requirements
3. Documentation of findings and any required actions

Ensure all stakeholders are informed and any concerns are escalated appropriately. Maintain comprehensive records for future reference.`
  };

  const title = checklistItem.title.toLowerCase();
  const responseKey = Object.keys(mockResponses).find(key => title.includes(key)) || 'default';
  
  return mockResponses[responseKey];
}

export async function answerQuestion(
  question: string,
  contextDocuments: string[]
): Promise<{ answer: string; sources: string[] }> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    answer: `Based on the available project data, I can provide the following analysis: ${question.includes('bearing') ? 'The bearing capacity depends on soil conditions at the specified depth. For preliminary estimates, consider SPT N-values and soil classification. Detailed calculations should follow Eurocode 7 or relevant local standards.' : 'Please refer to the project documentation for specific details. I recommend consulting with the project geotechnical engineer for verification.'}`,
    sources: contextDocuments.slice(0, 3),
  };
}

export async function generateActivitySummary(
  activityType: string,
  completedItems: string[],
  notes: string[]
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return `${activityType} completed successfully. ${completedItems.length} checklist items were verified and documented. ${notes.length > 0 ? 'Field notes indicate satisfactory conditions with no major concerns identified.' : 'All tasks completed as planned.'}`;
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Generate context for a checklist item
 * 
 * const item = {
 *   title: "Review environmental permits",
 *   description: "Verify all permits are current"
 * };
 * 
 * const docs = ["Permit EP3425.pdf", "Q1 Audit Report.pdf"];
 * const context = await generateChecklistContext(item, docs);
 * console.log(context);
 */

/**
 * Example 2: Answer a question using RAG
 * 
 * const question = "What is the soil classification at 5m depth in BH-001?";
 * const context = [
 *   "BH-001 Borehole Log: At 5m depth, London Clay (CH) with N-value 28"
 * ];
 * 
 * const result = await answerQuestion(question, context);
 * console.log(result.answer);
 * console.log(result.sources);
 */

/**
 * Example 3: Generate activity summary
 * 
 * const summary = await generateActivitySummary(
 *   "Site Inspection",
 *   ["Visual inspection completed", "Photos taken", "Report drafted"],
 *   ["Weather conditions good", "No safety concerns"]
 * );
 * 
 * console.log(summary);
 */
