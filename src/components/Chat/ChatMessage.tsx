
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
      "flex gap-4",
      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        )}>
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      </div>
      
      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2 max-w-[80%]",
        message.role === 'user' ? 'items-end' : 'items-start'
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="font-medium">
            {message.role === 'user' ? 'You' : 'Prism AI'}
          </span>
          <span>
            {new Intl.DateTimeFormat('en-US', { 
              hour: 'numeric', 
              minute: 'numeric',
              hour12: true 
            }).format(message.createdAt)}
          </span>
        </div>
        
        {/* Message Bubble */}
        <div className={cn(
          "p-4 rounded-lg",
          message.role === 'user' 
            ? 'chat-bubble-user ml-auto' 
            : 'chat-bubble-assistant mr-auto'
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
          
          {/* Typing indicator */}
          {message.role === 'assistant' && isLatest && rendered.length < message.content.length && (
            <div className="flex items-center space-x-1 mt-2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">typing...</span>
            </div>
          )}
        </div>
        
        {/* Voice output for assistant messages */}
        {message.role === 'assistant' && (
          <VoiceOutput 
            text={message.content} 
            isLatestMessage={isLatest}
          />
        )}
      </div>
    </div>
  );
};
