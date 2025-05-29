
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="relative w-full justify-start glass-morphism border-border/30 hover:scale-105 transition-all duration-200"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="flex items-center space-x-3"
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
        }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      >
        {theme === 'dark' ? (
          <>
            <Moon className="h-4 w-4" />
            <span className="text-sm font-medium">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4" />
            <span className="text-sm font-medium">Light Mode</span>
          </>
        )}
      </motion.div>
      
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </Button>
  );
};
