
import { ChatInterface } from "@/components/Chat/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-2rem)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
