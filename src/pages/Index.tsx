
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ThemeProvider } from "@/lib/theme";
import { Sparkles, Zap } from "lucide-react";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-600/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-blue-400/5 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Modern header */}
        <header className="header-modern sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center animate-glow-pulse">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="animate-slide-in-left">
                  <h1 className="text-xl font-bold gradient-text">Prism AI</h1>
                  <p className="text-sm text-muted-foreground">Advanced AI Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 glass-card rounded-full">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-muted-foreground">Powered by Groq</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="h-[calc(100vh-5rem)] animate-fade-in-up">
          <ChatInterface />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
