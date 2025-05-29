
import { useState, useRef, useEffect } from 'react';
import { useChat, MODELS } from '@/hooks/useChat';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { ModelSelector } from '@/components/Chat/ModelSelector';
import { VoiceInput } from '@/components/Chat/VoiceInput';
import { FileUpload } from '@/components/Chat/FileUpload';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Send, Trash2, KeyRound, Bot as BotIcon, 
  RefreshCw, PaperclipIcon, MessageSquare, Code, FileText, Lightbulb
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

  const quickActions = [
    { icon: Lightbulb, title: "Ideas", prompt: "Help me brainstorm ideas for " },
    { icon: Code, title: "Code", prompt: "Help me write code for " },
    { icon: FileText, title: "Writing", prompt: "Help me write content about " },
    { icon: MessageSquare, title: "Chat", prompt: "Let's discuss " }
  ];
  
  return (
    <div className="flex h-full max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/30 bg-card/30">
        <div className="p-4 h-full flex flex-col">
          {/* Controls Section */}
          <div className="space-y-4 mb-6">
            <h2 className="text-sm font-medium text-foreground">Settings</h2>
            
            <ModelSelector
              models={MODELS}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
            
            <div className="relative">
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your Groq API key"
                className="chat-input pr-10"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <ThemeToggle />
          </div>

          {/* Quick Actions */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => setInput(action.prompt)}
                  className="w-full text-left p-3 feature-card rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={() => {
                clearChat();
                toast.success("Chat cleared");
              }}
              className="w-full mt-4 p-3 border border-destructive/20 rounded-lg text-destructive hover:bg-destructive/5 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-auto scrollbar-thin">
          {messages.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
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
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <BotIcon className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Welcome to Prism AI</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Start a conversation by typing a message or selecting a quick action from the sidebar.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="border-t border-border/30 bg-card/30 p-4">
          {errorState && messages.length > 0 && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
              <span className="text-sm text-destructive">Failed to get a response. Please try again.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="border-destructive/20 hover:bg-destructive/10"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Retry
              </Button>
            </div>
          )}
          
          {showFileUpload && (
            <div className="mb-4 p-4 bg-muted/30 border border-border/30 rounded-lg">
              <FileUpload 
                onFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
                onFileRemove={handleFileRemove}
              />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="chat-input"
              />
            </div>
            
            <VoiceInput 
              onTranscript={handleVoiceTranscription}
              isDisabled={isLoading}
            />
            
            <Button 
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              variant="outline"
              size="icon"
              className={showFileUpload ? 'bg-primary/10 border-primary/30' : ''}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            
            <Button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
