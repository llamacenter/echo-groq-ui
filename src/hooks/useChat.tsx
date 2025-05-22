
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Message, ChatStatus, ModelOption } from "@/types/chat";

// Updated model list without deprecated models
export const MODELS: ModelOption[] = [
  {
    id: "llama3-8b-8192",
    name: "Llama 3 8B",
    description: "Efficient open-source LLM with 8B parameters",
    maxTokens: 8192,
  },
  {
    id: "llama3-70b-8192",
    name: "Llama 3 70B",
    description: "Powerful open-source LLM with 70B parameters",
    maxTokens: 8192,
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    description: "Most powerful model in the Claude family",
    maxTokens: 4096,
  },
  {
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
    description: "Balanced performance and efficiency",
    maxTokens: 4096,
  }
];

// Default API key for fallback when user doesn't provide one
const DEFAULT_API_KEY = "gsk_XDGddw9LqwN5vpqMgWH6mpDewfn1ofNG4WUQm0a5TU";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODELS[0]);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("groq_api_key") || "";
  });
  
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("groq_api_key", apiKey);
    }
  }, [apiKey]);
  
  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      role,
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addMessage(content, "user");
    
    // Use provided API key or fallback to default
    const keyToUse = apiKey || DEFAULT_API_KEY;
    
    setStatus("loading");
    
    try {
      // Call the Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyToUse}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })).concat([{ role: 'user', content }]),
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error calling Groq API');
      }
      
      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;
      addMessage(assistantResponse, "assistant");
      
    } catch (error) {
      console.error("Error calling Groq API:", error);
      toast.error(error instanceof Error ? error.message : "Error connecting to Groq API");
      throw error; // Re-throw to allow retry handling
    } finally {
      setStatus("idle");
    }
  }, [addMessage, apiKey, selectedModel, messages]);
  
  const retryLastMessage = useCallback(async () => {
    if (messages.length < 1) return;
    
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
    
    // Remove all messages after the last user message
    setMessages(prev => prev.slice(0, messages.length - lastUserMessageIndex));
    
    // Resend the message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);
  
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    status,
    selectedModel,
    setSelectedModel,
    apiKey,
    setApiKey,
    sendMessage,
    clearChat,
    retryLastMessage
  };
}
