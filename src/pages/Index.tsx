
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/lib/theme";
import { Sparkles, Zap, Brain, Rocket } from "lucide-react";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating orbs */}
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 0.8, 1],
              x: [0, -25, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 20, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Geometric shapes */}
          <motion.div 
            className="absolute top-1/4 right-20 w-4 h-4 bg-indigo-400/30 rotate-45"
            animate={{ rotate: [45, 405] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-16 w-3 h-3 bg-purple-400/30 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]" />
        
        {/* Main content */}
        <motion.div 
          className="relative z-10 h-screen flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header with floating design */}
          <motion.header 
            className="p-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur opacity-40 animate-pulse-soft" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">Prism AI</h1>
                  <p className="text-sm text-muted-foreground">Next-gen AI companion</p>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-3">
                {[
                  { icon: Brain, label: "Smart", color: "from-blue-500 to-cyan-500" },
                  { icon: Zap, label: "Fast", color: "from-yellow-500 to-orange-500" },
                  { icon: Rocket, label: "Advanced", color: "from-purple-500 to-pink-500" }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className={`hidden md:flex items-center space-x-2 glass-morphism rounded-full px-3 py-2 bg-gradient-to-r ${item.color} bg-opacity-10`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.header>

          {/* Main content area */}
          <div className="flex-1 px-6 pb-6">
            <motion.div 
              className="max-w-7xl mx-auto h-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ChatInterface />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
