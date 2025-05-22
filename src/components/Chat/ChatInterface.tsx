
import { useState, useRef, useEffect } from 'react';
import { useChat, MODELS } from '@/hooks/useChat';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { ModelSelector } from '@/components/Chat/ModelSelector';
import { GradientButton } from '@/components/UI/GradientButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedContainer, SlideIn } from '@/components/UI/AnimatedContainer';
import { Send, Trash2, KeyRound, Sparkles, Bot as BotIcon, Command, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [errorState, setErrorState] = useState(false);
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
    clearChat,
    retryLastMessage
  } = useChat();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== 'loading' && status !== 'streaming') {
      try {
        await sendMessage(input);
        setInput('');
        setErrorState(false);
      } catch (error) {
        setErrorState(true);
      }
    }
  };
  
  const handleRetry = async () => {
    try {
      setErrorState(false);
      await retryLastMessage();
    } catch (error) {
      setErrorState(true);
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
            <h1 className="text-3xl font-bold text-gradient flex items-center gap-2">
              <Sparkles className="h-6 w-6" /> Prism
            </h1>
            <p className="text-sm text-slate-400">
              A powerful interface for Groq's advanced language models
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <ModelSelector
              models={MODELS}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
            
            <SlideIn className="relative w-full sm:w-auto" delay={0.1}>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your Groq API key (optional)"
                className="w-full max-w-xs pr-10 bg-slate-800 border-slate-700 text-white/90 placeholder:text-slate-500"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </SlideIn>
          </div>
        </AnimatedContainer>
      </div>

      <Card className="flex-grow overflow-hidden border-0 shadow-xl glass">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-grow overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.length > 0 ? (
              <div className="space-y-6">
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
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <BotIcon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gradient">Welcome to Prism</h2>
                  <p className="text-slate-400">
                    Experience the next generation of AI conversation with Groq's powerful language models.
                    Enter your API key (optional) and start chatting!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-w-md mx-auto">
                    {[
                      { title: "Creative Writing", icon: "✨" },
                      { title: "Code Generation", icon: "💻" },
                      { title: "Data Analysis", icon: "📊" },
                      { title: "Research Help", icon: "🔍" }
                    ].map((item) => (
                      <div key={item.title} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-left flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </AnimatedContainer>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-900/70">
            {errorState && messages.length > 0 && (
              <div className="mb-3 px-3 py-2 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-red-300">Failed to get a response. Please try again.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1.5 text-red-300 border-red-800/50 hover:bg-red-900/50 hover:text-red-200"
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Prism..."
                  disabled={isLoading}
                  className="pr-10 py-6 bg-slate-800 border-slate-700 text-white/90 placeholder:text-slate-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-500">
                  <Command className="h-3 w-3" /> Enter
                </span>
              </div>
              
              <GradientButton 
                type="submit"
                loading={isLoading}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
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
                  className="text-slate-400 border-slate-700 hover:bg-slate-800"
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
