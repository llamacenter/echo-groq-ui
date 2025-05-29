import { useState, useRef, useEffect } from 'react';
import { useChat, MODELS } from '@/hooks/useChat';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { ModelSelector } from '@/components/Chat/ModelSelector';
import { VoiceInput } from '@/components/Chat/VoiceInput';
import { FileUpload } from '@/components/Chat/FileUpload';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedContainer } from '@/components/UI/AnimatedContainer';
import { 
  Send, Trash2, KeyRound, Sparkles, Bot as BotIcon, 
  Command, RefreshCw, PaperclipIcon, MessageSquare, Lightbulb, Code, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
    {
      icon: Lightbulb,
      title: "Creative Ideas",
      description: "Brainstorm and explore creative concepts",
      prompt: "Help me brainstorm creative ideas for ",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Code,
      title: "Code Assistant",
      description: "Get help with programming and development",
      prompt: "Help me write code for ",
      gradient: "from-green-400 to-blue-500"
    },
    {
      icon: FileText,
      title: "Content Writing",
      description: "Create compelling written content",
      prompt: "Help me write content about ",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "General Chat",
      description: "Have a natural conversation",
      prompt: "Let's discuss ",
      gradient: "from-blue-400 to-indigo-500"
    }
  ];
  
  return (
    <div className="h-full flex gap-6">
      {/* Sidebar */}
      <motion.div 
        className="w-80 floating-sidebar flex-shrink-0"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 gradient-text">Controls</h2>
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
                  className="modern-input pr-10"
                />
                <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <ThemeToggle />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  onClick={() => setInput(action.prompt)}
                  className="w-full text-left p-3 glass-morphism rounded-xl hover:scale-105 transition-all duration-200 group"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-20`}>
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {messages.length > 0 && (
            <motion.button
              onClick={() => {
                clearChat();
                toast.success("Chat cleared");
              }}
              className="w-full mt-4 p-3 glass-morphism rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Clear Chat</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        className="flex-1 flex flex-col glass-card min-h-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-auto scrollbar-modern">
          <AnimatePresence mode="popLayout">
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
              <motion.div 
                className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.div 
                  className="relative mb-8"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative shadow-2xl">
                    <BotIcon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-40 animate-pulse-soft" />
                </motion.div>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold gradient-text">Welcome to Prism AI</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Experience the future of AI conversation with our advanced language models.
                    Start by typing a message, using voice input, or selecting a quick action.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Input Area */}
        <div className="p-6 border-t border-border/50">
          {errorState && messages.length > 0 && (
            <motion.div 
              className="mb-4 p-4 glass-morphism border border-destructive/20 rounded-xl flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-sm text-destructive">Failed to get a response. Please try again.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-morphism border-destructive/20 hover:bg-destructive/10"
                onClick={handleRetry}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Retry
              </Button>
            </motion.div>
          )}
          
          <AnimatePresence>
            {showFileUpload && (
              <motion.div 
                className="mb-4 p-4 glass-morphism rounded-xl border border-border/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  selectedFiles={selectedFiles}
                  onFileRemove={handleFileRemove}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="modern-input pr-16 py-4 text-base"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1 opacity-60">
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
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={`floating-action ${
                showFileUpload 
                  ? 'bg-primary/10 text-primary border-primary/30' 
                  : ''
              }`}
              size="icon"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            
            <Button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
