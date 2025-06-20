// Jest setup file
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for testing
process.env.GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'test-api-key';
process.env.GEMINI_PRO_MODEL = 'gemini-1.5-pro';
process.env.GEMINI_FLASH_MODEL = 'gemini-1.5-flash';
