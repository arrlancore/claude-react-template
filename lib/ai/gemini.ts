import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIConfig, AIUsageTracking } from './types';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private proModel: any;
  private flashModel: any;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.proModel = this.genAI.getGenerativeModel({ model: config.proModel });
    this.flashModel = this.genAI.getGenerativeModel({ model: config.flashModel });
  }

  async generateResponse(
    prompt: string,
    options: {
      model?: 'pro' | 'flash';
      maxTokens?: number;
      temperature?: number;
      systemInstruction?: string;
    } = {}
  ): Promise<{
    content: string;
    usage: { inputTokens: number; outputTokens: number };
    responseTime: number;
  }> {
    const startTime = Date.now();

    try {
      const model = options.model === 'flash' ? this.flashModel : this.proModel;

      // Configure generation parameters
      const generationConfig = {
        maxOutputTokens: options.maxTokens || this.config.maxTokens || 1000,
        temperature: options.temperature || this.config.temperature || 0.7,
      };

      // Build prompt with system instruction if provided
      let fullPrompt = prompt;
      if (options.systemInstruction) {
        fullPrompt = `${options.systemInstruction}\n\nUser: ${prompt}`;
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const content = response.text();

      // Calculate usage metrics
      const responseTime = Date.now() - startTime;
      const usage = {
        inputTokens: await model.countTokens(fullPrompt).then(r => r.totalTokens),
        outputTokens: await model.countTokens(content).then(r => r.totalTokens),
      };

      return {
        content,
        usage,
        responseTime,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStreamResponse(
    prompt: string,
    options: {
      model?: 'pro' | 'flash';
      maxTokens?: number;
      temperature?: number;
      systemInstruction?: string;
      onChunk?: (chunk: string) => void;
    } = {}
  ): Promise<{
    content: string;
    usage: { inputTokens: number; outputTokens: number };
    responseTime: number;
  }> {
    const startTime = Date.now();

    try {
      const model = options.model === 'flash' ? this.flashModel : this.proModel;

      const generationConfig = {
        maxOutputTokens: options.maxTokens || this.config.maxTokens || 1000,
        temperature: options.temperature || this.config.temperature || 0.7,
      };

      let fullPrompt = prompt;
      if (options.systemInstruction) {
        fullPrompt = `${options.systemInstruction}\n\nUser: ${prompt}`;
      }

      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      let content = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        content += chunkText;
        if (options.onChunk) {
          options.onChunk(chunkText);
        }
      }

      const responseTime = Date.now() - startTime;
      const usage = {
        inputTokens: await model.countTokens(fullPrompt).then(r => r.totalTokens),
        outputTokens: await model.countTokens(content).then(r => r.totalTokens),
      };

      return {
        content,
        usage,
        responseTime,
      };
    } catch (error) {
      console.error('Gemini Streaming Error:', error);
      throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  calculateCost(inputTokens: number, outputTokens: number, model: 'pro' | 'flash' = 'pro'): number {
    // Gemini pricing (approximate - update with actual rates)
    const rates = {
      pro: { input: 0.00125, output: 0.005 }, // per 1K tokens
      flash: { input: 0.000075, output: 0.0003 }, // per 1K tokens
    };

    const rate = rates[model];
    return (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.generateResponse('Test', {
        model: 'flash',
        maxTokens: 10
      });
      return !!result.content;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let geminiClient: GeminiClient | null = null;

export function createGeminiClient(): GeminiClient {
  if (!geminiClient) {
    const config: AIConfig = {
      apiKey: process.env.GOOGLE_AI_API_KEY!,
      proModel: process.env.GEMINI_PRO_MODEL || 'gemini-1.5-pro',
      flashModel: process.env.GEMINI_FLASH_MODEL || 'gemini-1.5-flash',
      maxTokens: 1000,
      temperature: 0.7,
    };

    if (!config.apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is required');
    }

    geminiClient = new GeminiClient(config);
  }

  return geminiClient;
}

export { geminiClient };
