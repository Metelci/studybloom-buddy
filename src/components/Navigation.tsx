import { useState } from "react";
import { Home, CheckSquare, TrendingUp, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "social", label: "Social", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-standard min-w-[56px]",
                isActive ? "tab-active" : "tab-inactive"
              )}
              aria-label={item.label}
            >
              <Icon 
                size={24} 
                className={cn(
                  "mb-1 transition-colors duration-standard",
                  isActive ? "text-primary-container-foreground" : "text-on-surface-variant"
                )}
              />
              <span className={cn(
                "text-xs font-medium transition-colors duration-standard",
                isActive ? "text-primary-container-foreground" : "text-on-surface-variant"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}