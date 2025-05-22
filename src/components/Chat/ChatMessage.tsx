
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { PopIn } from '@/components/UI/AnimatedContainer';
import { User, Bot } from 'lucide-react';

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
        "py-6 px-4 flex gap-4 message-container",
        message.role === 'assistant' ? 'bg-white rounded-lg shadow-sm' : ''
      )}
      delay={0.1}
    >
      <div className="flex-shrink-0">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full",
          message.role === 'user' 
            ? 'bg-prism-100 text-prism-700' 
            : 'bg-violet-100 text-violet-700'
        )}>
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      </div>
      
      <div className="flex-grow space-y-1">
        <div className="text-sm font-medium">
          {message.role === 'user' ? 'You' : 'Prism'}
        </div>
        <div className="prose prose-sm max-w-none">
          {rendered}
        </div>
      </div>
    </PopIn>
  );
};
