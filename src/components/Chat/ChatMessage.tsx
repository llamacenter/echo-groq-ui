
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { PopIn } from '@/components/UI/AnimatedContainer';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

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
      }, 15);
      
      return () => clearInterval(interval);
    } else {
      setRendered(message.content);
    }
  }, [message.content, message.role, isLatest]);
  
  return (
    <PopIn 
      className={cn(
        "py-6 px-4 flex gap-4 rounded-xl",
        message.role === 'assistant' ? 'glass-light' : 'bg-transparent'
      )}
      delay={0.1}
    >
      <div className="flex-shrink-0">
        <motion.div 
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full",
            message.role === 'user' 
              ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-700/50' 
              : 'bg-purple-950/60 text-purple-300 border border-purple-700/50'
          )}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </motion.div>
      </div>
      
      <div className="flex-grow space-y-1.5">
        <div className="text-sm font-medium flex items-center gap-2">
          {message.role === 'user' ? 'You' : (
            <span className="text-gradient">Prism</span>
          )}
          <span className="text-xs text-slate-500">
            {new Intl.DateTimeFormat('en-US', { 
              hour: 'numeric', 
              minute: 'numeric',
              hour12: true 
            }).format(message.createdAt)}
          </span>
        </div>
        <div className="prose prose-sm max-w-none prose-invert">
          {rendered}
        </div>
      </div>
    </PopIn>
  );
};
