
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/lib/theme";

const Index = () => {
  return (
    <ThemeProvider>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:bg-gradient-to-br dark:from-slate-100 dark:via-slate-200 dark:to-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.15),rgba(0,0,0,0)_40%)] dark:bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.05),rgba(255,255,255,0)_40%)] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-2rem)]">
          <ChatInterface />
        </div>
      </motion.div>
    </ThemeProvider>
  );
};

export default Index;
