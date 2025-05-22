
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  maxTokens?: number;
}

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'error';
