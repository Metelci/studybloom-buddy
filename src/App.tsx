import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/components/Home";
import { Progress } from "@/components/Progress";
import { Social } from "@/components/Social";
import { Tasks } from "@/components/Tasks";
import { Settings } from "@/components/Settings";
import { useNativeFeatures } from "@/hooks/useNativeFeatures";
import { initDatabase } from "@/db/sqlite";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [tasksSubTab, setTasksSubTab] = useState("daily");
  const { user, loading } = useAuth();
  
  // Initialize native features
  const nativeFeatures = useNativeFeatures();

  useEffect(() => {
    // Initialize SQLite database on native platforms
    initDatabase().catch((e) => console.error('SQLite init error', e));
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">
        {renderActiveScreen()}
      </main>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={<AppContent />} />
              </Routes>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
