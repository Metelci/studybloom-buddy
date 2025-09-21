import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/components/Home";
import { Progress } from "@/components/Progress";
import { Social } from "@/components/Social";
import { Tasks } from "@/components/Tasks";
import { Settings } from "@/components/Settings";
import { useNativeFeatures } from "@/hooks/useNativeFeatures";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [tasksSubTab, setTasksSubTab] = useState("daily");
  
  // Initialize native features
  const nativeFeatures = useNativeFeatures();

  const navigateToTasks = (subTab?: string) => {
    setActiveTab("tasks");
    if (subTab) {
      setTasksSubTab(subTab);
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <Home onNavigateToTasks={navigateToTasks} />;
      case "tasks":
        return <Tasks initialTab={tasksSubTab} />;
      case "progress":
        return <Progress />;
      case "social":
        return <Social />;
      case "settings":
        return <Settings />;
      default:
        return <Home onNavigateToTasks={navigateToTasks} />;
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
