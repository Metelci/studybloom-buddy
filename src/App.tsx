import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/components/Home";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "tasks":
        return (
          <div className="p-6 pb-20 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-on-surface mb-4">Tasks</h1>
            <p className="text-on-surface-variant">Tasks screen coming soon...</p>
          </div>
        );
      case "progress":
        return (
          <div className="p-6 pb-20 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-on-surface mb-4">Progress</h1>
            <p className="text-on-surface-variant">Progress tracking coming soon...</p>
          </div>
        );
      case "social":
        return (
          <div className="p-6 pb-20 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-on-surface mb-4">Social</h1>
            <p className="text-on-surface-variant">Social features coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 pb-20 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-on-surface mb-4">Settings</h1>
            <p className="text-on-surface-variant">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <main className="min-h-screen">
            {renderActiveScreen()}
          </main>
          <Navigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
