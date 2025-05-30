
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="w-full justify-start glass-card border-blue-500/10 hover:bg-blue-500/5 transition-all duration-300"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-blue-500/10">
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <Sun className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <span className="text-sm font-medium text-foreground">
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
    </Button>
  );
};
