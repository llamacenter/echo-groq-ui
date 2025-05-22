
import { useState, useRef, useEffect } from 'react';
import { useChat, MODELS } from '@/hooks/useChat';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { ModelSelector } from '@/components/Chat/ModelSelector';
import { GradientButton } from '@/components/UI/GradientButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedContainer, SlideIn } from '@/components/UI/AnimatedContainer';
import { Send, Trash2, KeyRound } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    status,
    selectedModel,
    setSelectedModel,
    apiKey,
    setApiKey,
    sendMessage,
    clearChat
  } = useChat();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== 'loading' && status !== 'streaming') {
      sendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (messages.length === 0) {
      inputRef.current?.focus();
    }
  }, [messages.length]);

  const isLoading = status === 'loading' || status === 'streaming';
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 pb-4">
        <AnimatedContainer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gradient">Prism</h1>
            <p className="text-sm text-gray-600">
              A beautiful interface for Groq's powerful LLM APIs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <ModelSelector
              models={MODELS}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
            
            <SlideIn className="relative" delay={0.1}>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your Groq API key"
                className="w-full max-w-xs pr-10"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </SlideIn>
          </div>
        </AnimatedContainer>
      </div>

      <Card className="flex-grow overflow-hidden border-0 shadow-md glass">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-grow overflow-auto p-4">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    isLatest={index === messages.length - 1 && message.role === 'assistant'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <AnimatedContainer className="space-y-6 max-w-lg" duration={0.5}>
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-prism-500 to-violet-400 flex items-center justify-center">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gradient">Welcome to Prism</h2>
                  <p className="text-gray-600">
                    A beautiful interface for interacting with Groq's powerful language models.
                    Enter your API key and start chatting!
                  </p>
                </AnimatedContainer>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-grow"
              />
              <GradientButton 
                type="submit"
                loading={isLoading}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </GradientButton>
              
              {messages.length > 0 && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    clearChat();
                    toast.success("Chat cleared");
                  }}
                  className="text-gray-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Bot icon component for the welcome screen
const Bot = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="14" x="3" y="8" rx="2" />
    <circle cx="12" cy="15" r="2" />
    <path d="M12 15v4" />
    <path d="M10 7v1" />
    <path d="M14 7v1" />
    <path d="M16 5h0a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2h0" />
  </svg>
);
