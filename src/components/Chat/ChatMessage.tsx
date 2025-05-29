
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import { VoiceOutput } from './VoiceOutput';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

export const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const [rendered, setRendered] = useState('');
  
  useEffect(() => {
    if (message.role === 'assistant' && isLatest) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < message.content.length) {
          setRendered(message.content.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    } else {
      setRendered(message.content);
    }
  }, [message.content, message.role, isLatest]);
  
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      
      return !inline && match ? (
        <CodeBlock
          code={String(children).replace(/\n$/, '')}
          language={match[1]}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };
  
  return (
    <div className={cn(
      "flex gap-6 group",
      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Enhanced Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center relative transition-all duration-300 group-hover:scale-105",
          message.role === 'user' 
            ? 'chat-bubble-user-modern' 
            : 'glass-card'
        )}>
          {message.role === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
          
          {/* Status indicator for AI */}
          {message.role === 'assistant' && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-background">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-3 max-w-[85%]",
        message.role === 'user' ? 'items-end' : 'items-start'
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 text-xs",
          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="font-semibold text-foreground">
            {message.role === 'user' ? 'You' : 'Prism AI'}
          </span>
          <span className="text-muted-foreground">
            {new Intl.DateTimeFormat('en-US', { 
              hour: 'numeric', 
              minute: 'numeric',
              hour12: true 
            }).format(message.createdAt)}
          </span>
          {message.role === 'assistant' && (
            <div className="px-2 py-1 glass-card rounded-full">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">AI</span>
            </div>
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={cn(
          "p-5 rounded-2xl transition-all duration-300 group-hover:shadow-lg",
          message.role === 'user' 
            ? 'chat-bubble-user-modern ml-auto' 
            : 'chat-bubble-assistant-modern mr-auto'
        )}>
          <div className="prose prose-sm max-w-none">
            {message.role === 'assistant' && isLatest ? (
              <ReactMarkdown className="markdown" components={components}>
                {rendered}
              </ReactMarkdown>
            ) : (
              <ReactMarkdown className="markdown" components={components}>
                {message.content}
              </ReactMarkdown>
            )}
          </div>
          
          {/* Enhanced typing indicator */}
          {message.role === 'assistant' && isLatest && rendered.length < message.content.length && (
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-white/10">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-blue-300 font-medium">Prism AI is thinking...</span>
            </div>
          )}
        </div>
        
        {/* Voice output for assistant messages */}
        {message.role === 'assistant' && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <VoiceOutput 
              text={message.content} 
              isLatestMessage={isLatest}
            />
          </div>
        )}
      </div>
    </div>
  );
};
