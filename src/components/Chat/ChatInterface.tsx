
import { useState, useRef, useEffect } from 'react';
import { useChat, MODELS } from '@/hooks/useChat';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { ModelSelector } from '@/components/Chat/ModelSelector';
import { VoiceInput } from '@/components/Chat/VoiceInput';
import { FileUpload } from '@/components/Chat/FileUpload';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { GradientButton } from '@/components/UI/GradientButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedContainer, SlideIn } from '@/components/UI/AnimatedContainer';
import { 
  Send, Trash2, KeyRound, Sparkles, Bot as BotIcon, 
  Command, RefreshCw, PaperclipIcon
} from 'lucide-react';
import { toast } from 'sonner';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [errorState, setErrorState] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
        let messageText = input;
        if (selectedFiles.length > 0) {
          const fileNames = selectedFiles.map(f => f.name).join(', ');
          messageText += `\n\n(Uploaded files: ${fileNames})`;
        }
        
        await sendMessage(messageText);
        setInput('');
        setErrorState(false);
        setShowFileUpload(false);
        setSelectedFiles([]);
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

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added`);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceTranscription = (text: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + text);
    toast.success("Voice transcription added to message");
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
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex-shrink-0 pb-6">
        <AnimatedContainer className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-xl blur opacity-30 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Prism AI</h1>
                <p className="text-sm text-muted-foreground">Powered by advanced language models</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <ModelSelector
              models={MODELS}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
            
            <SlideIn className="relative w-full sm:w-auto min-w-[280px]" delay={0.1}>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your Groq API key (optional)"
                className="w-full pr-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </SlideIn>
          </div>
        </AnimatedContainer>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-grow overflow-hidden border-border/50 shadow-2xl glass">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-grow overflow-auto p-6 scrollbar-thin">
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
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <AnimatedContainer className="space-y-8 max-w-2xl" duration={0.5}>
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center relative">
                      <BotIcon className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gradient">Welcome to Prism AI</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Experience the next generation of AI conversation with powerful language models.
                      Start by typing a message or use voice input to begin your conversation.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-lg mx-auto">
                    {[
                      { title: "Creative Writing", icon: "✨", desc: "Stories, poems, and creative content" },
                      { title: "Code Generation", icon: "💻", desc: "Programming help and debugging" },
                      { title: "Data Analysis", icon: "📊", desc: "Insights and data interpretation" },
                      { title: "Research Help", icon: "🔍", desc: "Information gathering and synthesis" }
                    ].map((item) => (
                      <div key={item.title} className="group p-4 glass-light rounded-xl hover:shadow-lg transition-all duration-300 card-halo">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedContainer>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-xl">
            {errorState && messages.length > 0 && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
                <span className="text-sm text-destructive">Failed to get a response. Please try again.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-destructive/20 hover:bg-destructive/10"
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            )}
            
            {showFileUpload && (
              <div className="mb-4 p-4 glass-light rounded-lg border border-border/30">
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  selectedFiles={selectedFiles}
                  onFileRemove={handleFileRemove}
                />
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-grow">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="pr-16 py-6 text-base bg-background border-border/50 focus:border-primary/50 transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Command className="h-3 w-3" />
                    Enter
                  </span>
                </div>
              </div>
              
              <VoiceInput 
                onTranscript={handleVoiceTranscription}
                isDisabled={isLoading}
              />
              
              <Button 
                variant="outline" 
                size="icon"
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`border-border/50 transition-all duration-200 ${
                  showFileUpload 
                    ? 'bg-primary/10 text-primary border-primary/30' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>
              
              <GradientButton 
                type="submit"
                loading={isLoading}
                disabled={!input.trim()}
                className="px-6"
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
                  className="border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
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
