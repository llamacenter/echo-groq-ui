
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ThemeProvider } from "@/lib/theme";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Simple header */}
        <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Prism AI</h1>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="h-[calc(100vh-5rem)]">
          <ChatInterface />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
