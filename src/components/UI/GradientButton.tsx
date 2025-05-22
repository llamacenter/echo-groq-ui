
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, variant = 'default', size = 'default', loading = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all',
          variant === 'default' && 'bg-gradient-to-r from-prism-600 to-violet-500 hover:from-prism-700 hover:to-violet-600',
          variant === 'outline' && 'border-2 border-prism-500 bg-transparent text-prism-500 hover:bg-prism-50',
          variant === 'ghost' && 'bg-transparent text-prism-600 hover:bg-prism-50',
          loading && 'pointer-events-none',
          className
        )}
        size={size}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
        {variant === 'default' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-prism-500/10 to-violet-400/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: -1 }}
          />
        )}
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
