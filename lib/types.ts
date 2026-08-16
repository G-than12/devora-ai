export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface ToolLog {
  toolName: string;
  input: any;
  status: 'running' | 'success' | 'error';
  executionTime?: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  status: 'streaming' | 'completed' | 'stopped' | 'error';
  errorMessage?: string;
  toolLogs?: ToolLog[];
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  summary?: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type AiMode = 'explain' | 'debug' | 'build' | 'brainstorm';
export type ProgrammingLevel = 'beginner' | 'intermediate' | 'advanced';
export type ResponseStyle = 'concise' | 'balanced' | 'detailed';
export type Creativity = 'precise' | 'balanced' | 'creative';
export type ResponseLength = 'short' | 'medium' | 'long';

export interface UserPreferences {
  aiMode: AiMode;
  programmingLevel: ProgrammingLevel;
  responseStyle: ResponseStyle;
  creativity: Creativity;
  temperature: number;
  responseLength: ResponseLength;
  theme: 'light' | 'dark';
}
