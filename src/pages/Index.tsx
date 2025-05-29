
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ThemeProvider } from "@/lib/theme";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/3 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-600/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-blue-400/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Professional header */}
        <header className="header-modern sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse-subtle"></div>
                </div>
                <div className="animate-slide-in-left">
                  <h1 className="text-xl font-bold gradient-text">Prism AI</h1>
                  <p className="text-sm text-muted-foreground">Professional AI Assistant</p>
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
