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
    { icon: FileText, title: "Content", prompt: "Help me write content about " },
    { icon: MessageSquare, title: "Discussion", prompt: "Let's discuss " }
  ];
  
  return (
    <div className="flex h-full max-w-7xl mx-auto">
      {/* Professional Sidebar */}
      <div className="w-80 sidebar-modern animate-slide-in-left">
        <div className="p-6 h-full flex flex-col">
          {/* Settings Section */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <h2 className="text-sm font-semibold text-foreground">Settings</h2>
            </div>
            
            <div className="space-y-4">
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
                  className="chat-input-modern pl-10"
                />
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
              </div>
              
              <ThemeToggle />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  onClick={() => setInput(action.prompt)}
                  className="w-full text-left action-card rounded-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <action.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
              className="w-full mt-6 p-4 glass-card rounded-xl text-red-500 hover:bg-red-500/5 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-auto scrollbar-modern">
          {messages.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div key={message.id} className="animate-fade-in-up">
                  <ChatMessage 
                    message={message} 
                    isLatest={index === messages.length - 1 && message.role === 'assistant'}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-fade-in-up">
              <div className="relative mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center">
                  <BotIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse-subtle"></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-text">Welcome to Prism AI</h2>
                <p className="text-muted-foreground text-lg">
                  Your professional AI assistant. Choose a quick action or start typing.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="glass-card border-t border-blue-500/10 p-6 m-4 rounded-2xl">
          {errorState && messages.length > 0 && (
            <div className="mb-4 p-4 glass-card border border-red-500/20 rounded-xl flex items-center justify-between">
              <span className="text-sm text-red-500">Failed to get response. Please try again.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="border-red-500/20 hover:bg-red-500/10"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Retry
              </Button>
            </div>
          )}
          
          {showFileUpload && (
            <div className="mb-4 p-4 glass-card border border-blue-500/20 rounded-xl">
              <FileUpload 
                onFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
                onFileRemove={handleFileRemove}
              />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="chat-input-modern h-12"
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
              className={`h-12 w-12 glass-card ${showFileUpload ? 'bg-blue-500/10' : ''}`}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            
            <Button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-primary h-12 px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
