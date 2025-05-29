
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
      className="w-full justify-start"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="flex items-center space-x-3">
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
      </div>
    </Button>
  );
};
