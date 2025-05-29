
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className={cn(
        "flex gap-4 group",
        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      layout
    >
      {/* Avatar */}
      <motion.div 
        className="flex-shrink-0 relative"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg",
          message.role === 'user' 
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
            : 'glass-morphism border-2 border-primary/20'
        )}>
          {message.role === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-primary" />
          )}
        </div>
        
        {/* Online indicator for assistant */}
        {message.role === 'assistant' && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse-soft" />
        )}
      </motion.div>
      
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
        <motion.div 
          className={cn(
            "p-4 rounded-2xl shadow-sm relative",
            message.role === 'user' 
              ? 'chat-bubble-user' 
              : 'chat-bubble-assistant'
          )}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
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
            <motion.div 
              className="flex items-center space-x-1 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      duration: 0.6, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">typing...</span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Voice output for assistant messages */}
        {message.role === 'assistant' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <VoiceOutput 
              text={message.content} 
              isLatestMessage={isLatest}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
