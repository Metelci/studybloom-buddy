import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/components/Home";
import { Progress } from "@/components/Progress";
import { Social } from "@/components/Social";
import { Settings } from "@/components/Settings";

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
        return <Progress />;
      case "social":
        return <Social />;
      case "settings":
        return <Settings />;
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
