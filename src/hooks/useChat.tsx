
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Message, ChatStatus, ModelOption } from "@/types/chat";

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
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Mixture of experts model with 8x7B parameters",
    maxTokens: 32768,
  },
  {
    id: "gemma-7b-it",
    name: "Gemma 7B",
    description: "Google's lightweight 7B instruction-tuned model",
    maxTokens: 8192,
  }
];

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
    
    if (!apiKey) {
      toast.error("Please enter your Groq API key");
      return;
    }
    
    setStatus("loading");
    
    try {
      // Call the Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
    } finally {
      setStatus("idle");
    }
  }, [addMessage, apiKey, selectedModel, messages]);
  
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
    clearChat
  };
}
